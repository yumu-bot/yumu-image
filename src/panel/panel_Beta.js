import {XMLBuilder, XMLParser} from "fast-xml-parser"
import {exportJPEG, getAvatar, getDiffBG, readNetImage, readTemplate} from "../util.js";
import {calcPerformancePoints} from "../compute-pp.js";

const opt = {
    preserveOrder: false,
    ignoreAttributes: false,
    parseTagValue: true,
    attributeNamePrefix: "$"
}
const parser = new XMLParser(opt);
const builder = new XMLBuilder(opt);

/*
Object.prototype.getSvgById = function (e, index = 0) {
    if (e && typeof e === "string") {
        return serchObject(this, obj => obj.$id === e, index);
    }
}

Object.prototype.setSvgText = function (str) {
    this["#text"] = str;
}
 */

export async function router(req, res) {
    try {
        const data = req.fields;
        // 让原来的函数返回值变成 svg 字符串
        const svg = await panel_Beta(data);
        res.set('Content-Type', 'image/jpeg');
        // send 的时候再导出图片, 保持原来接口不变, 别忘记 exportImage 前 await
        // 再在下面补充一个 router_svg 用于返回 svg 字符串
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}
export function test(){
    let templateStr = readTemplate('template/sp.svg');
    const template = parser.parse(templateStr)
    const svg = template.svg;
    const modsBox = getSvgById(svg, "mods");
    console.log(modsBox.$id);
}
export async function router_svg(req, res) {
    try {
        const data = req.fields;
        const svg = await panel_Beta(data);
        // 记得修改返回格式 image/svg+xml
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_Beta(score) {
    const url_avatar = await getAvatar(score.user.id);
    const url_bg = await getDiffBG(score.beatmap.id);

    const mode_int = score.mode_int;
    const mods = score.mods;
    const rankStr = score.rank;
    const statistics = score.statistics;
    const bid = score.beatmap.id;
    const title = score?.beatmapset?.title || ("BID" + bid);
    let star;
    const time = score.beatmap.total_length;
    const acc = score.accuracy;
    let pp = score.pp || 0;
    const combo = score.max_combo;

    let templateStr = readTemplate('template/sp.svg');
    const template = parser.parse(templateStr)
    const svg = template.svg;

    {// pp all
        const ppShowLine = getSvgById(svg, "pp-show");
        let ppData = await calcPerformancePoints(bid, {
            ...statistics,
            combo,
            mods,
            mode_int
        });
        const now = ppData.pp / ppData.perfect_pp;
        const full = ppData.full_pp / ppData.perfect_pp;
        if (pp < 1) pp = ppData.pp;

        getSvgById(ppShowLine, "pp-now").$height = Math.round(now * 1000);
        getSvgById(ppShowLine, "pp-fc").$height = Math.round(full * 1000);
        star = ppData.attr.stars;
    }

    {// info 处理
        const infoData = {}
        const time$m = Math.floor(time / 60).toString().padStart(2, '0');
        const time$s = (time % 60).toString().padStart(2, '0');
        infoData.time = `${time$m}:${time$s}`;
        if (star >= 100) {
            infoData.star = '100+✫';
        } else if (star >= 10) {
            infoData.star = star.toFixed(1) + '✫';
        } else {
            infoData.star = star.toFixed(2) + '✫';
        }
        const acc$e = Math.floor((10000 * acc) % 100);
        const acc$a = Math.floor(100 * acc).toString().padStart(2, '0');
        infoData.acc = `${acc$a}.${acc$e}%`;
        infoData.pp = pp.toFixed(1);
        infoData.combo = `${combo}X`;
        if (title.length > 12) {
            infoData.title = title.substring(0, 11) + "...";
        } else {
            infoData.title = title;
        }

        setSvgText(getSvgById(svg, "text-bid"), `BID ${bid}`);
        let info = getSvgById(svg, "text-info");
        setSvgText(getSvgById(info, "title"), infoData.title);
        setSvgText(getSvgById(info, "time"), infoData.time);
        setSvgText(getSvgById(info, "star"), infoData.star);
        setSvgText(getSvgById(info, "acc"), infoData.acc);
        setSvgText(getSvgById(info, "pp"), infoData.pp);
        setSvgText(getSvgById(info, "combo"), infoData.combo);
    }

    {// rank
        let rankData = {
            rank: rankStr.charAt(0),
            style: rankStr.charAt(rankStr.length - 1).toLowerCase()
        };
        const rank = getSvgById(svg, "text-rank");
        rank.$fill = `url(#${rankData.style})`
        if (rankData.rank.startsWith("X")) {
            getSvgById(rank, "rank-l").$opacity = "1"
        } else {
            setSvgText(getSvgById(rank, "rank-r"), rankData.rank);
        }
    }

    {// image
        searchObject(getSvgById(svg, "avatar"), () => true).image["$xlink:href"] = url_avatar;
        searchObject(getSvgById(svg, "bg"), () => true).image["$xlink:href"] = url_bg;
    }

    {// mods
        const modsBox = getSvgById(svg, "mods");
        modsBox.svg = [];
        mods.filter((_, i) => i < 7)
            .map((v, i) => {
                const modSvgStr = readTemplate(`template/Mod/${v}.svg`);
                const modSvgObj = parser.parse(modSvgStr);
                const mod = modSvgObj.svg;
                mod.$x = `${i * 75}`
                return mod;
            }).forEach(e => {
            modsBox.svg.push(e);
        })
    }

    return builder.build(template);
}


function searchObject(obj, callback, index = 0) {
    let count = 0;
    const objList = [obj];

    function search() {
        const temp = objList.shift()
        if (Array.isArray(temp)) {
            for (let i = 0; i < temp.length; i++) {
                objList.push(temp[i]);
            }
        } else {
            if (callback(temp)) {
                if (count >= index) {
                    return temp;
                } else count++;
            }
            for (const key in temp) {
                if (typeof temp[key] === 'object') objList.push(temp[key]);
            }
        }
        if (objList.length > 0){
            return search();
        }
        return null;
    }

    return search();
}

function getSvgById(obj, str, index = 0) {
    if (str && typeof str === "string") {
        return searchObject(obj, objn => objn.$id === str, index);
    }
}

function setSvgText(obj, str) {
    obj["#text"] = str;
}