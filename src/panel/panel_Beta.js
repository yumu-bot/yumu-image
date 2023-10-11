import {XMLBuilder, XMLParser} from "fast-xml-parser"
import {exportJPEG, getDiffBG, readNetImage, readTemplate} from "../util.js";
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
    const url_avatar = await readNetImage(`https://a.ppy.sh/${score.user.id}`);
    const url_bg = await getDiffBG(score.beatmap.id); //`https://assets.ppy.sh/beatmaps/${score.beatmapset.id}/covers/list@2x.jpg`
    const mode_int = score.mode_int;
    const mods = score.mods;
    const rankStr = score.rank;
    const statistics = score.statistics;
    const bid = score.beatmap.id;
    const title = score?.beatmapset?.title || ("BID" + bid);
    const star = score.beatmap.difficulty_rating;
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

        searchObject(ppShowLine, e => e.$mk === "pp-now").$height = Math.round(now * 1000);
        searchObject(ppShowLine, e => e.$mk === "pp-fc").$height = Math.round(full * 1000);
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

        let info = getSvgById(svg, "text-info");
        setSvgText(searchObject(info, e => e.$mk === "title"), infoData.title);
        setSvgText(searchObject(info, e => e.$mk === "time"), infoData.time);
        setSvgText(searchObject(info, e => e.$mk === "star"), infoData.star);
        setSvgText(searchObject(info, e => e.$mk === "acc"), infoData.acc);
        setSvgText(searchObject(info, e => e.$mk === "pp"), infoData.pp);
        setSvgText(searchObject(info, e => e.$mk === "combo"), infoData.combo);
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

    function search(obj) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const result = search(obj[i]);
                if (result) {
                    return result;
                }
            }
        } else if (typeof obj === 'object' && obj !== null) {
            if (callback(obj)) {
                count++;
                if (count >= index) {
                    return obj;
                }
            }
            for (const key in obj) {
                const result = search(obj[key]);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    return search(obj);
}

function getSvgById(obj, str, index = 0) {
    if (str && typeof str === "string") {
        return searchObject(obj, objn => objn.$id === str, index);
    }
}

function setSvgText(obj, str) {
    obj["#text"] = str;
}