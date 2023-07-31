import {XMLParser, XMLBuilder} from "fast-xml-parser"
import {exportImage, readTemplate} from "../util.js";
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
        const png = await spBuilder(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(png);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function spBuilder(score) {
    const url_avatar = `https://a.ppy.sh/${score.user.id}`;
    const url_bg_list2x = `https://assets.ppy.sh/beatmaps/${score.beatmapset.id}/covers/list@2x.jpg`;
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

        serchObject(ppShowLine, e => e.$mk === "pp-now").$height = Math.round(now * 1000);
        serchObject(ppShowLine, e => e.$mk === "pp-fc").$height = Math.round(full * 1000);
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
        setSvgText(serchObject(info, e => e.$mk === "title"), infoData.title);
        setSvgText(serchObject(info, e => e.$mk === "time"), infoData.time);
        setSvgText(serchObject(info, e => e.$mk === "star"), infoData.star);
        setSvgText(serchObject(info, e => e.$mk === "acc"), infoData.acc);
        setSvgText(serchObject(info, e => e.$mk === "pp"), infoData.pp);
        setSvgText(serchObject(info, e => e.$mk === "combo"), infoData.combo);
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
        serchObject(getSvgById(svg, "avatar"), () => true).image["$xlink:href"] = url_avatar;
        serchObject(getSvgById(svg, "bg"), () => true).image["$xlink:href"] = url_bg_list2x;
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

    let svgStr = builder.build(template);
    console.error(svgStr);
    return await exportImage(svgStr);
}

function serchObject(obj, callback, index = 0) {
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
        return serchObject(obj, objn => objn.$id === str, index);
    }
}

function setSvgText(obj, str) {
    obj["#text"] = str;
}