import {
    exportJPEG, getMapBG, getPanelNameSVG,
    implantImage,
    implantSvgBody, readTemplate,
    replaceText, transformSvgBody
} from "../util/util.js";
import {card_D} from "../card/card_D.js";
import {getMapAttributes} from "../util/compute-pp.js";
import {card_A2} from "../card/card_A2.js";
import {getModInt} from "../util/mod.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {hasLeaderBoard} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_H(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}
export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_H(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 图池展示
 * @param data
 * @return {Promise<string>}
 */
export async function panel_H (
    data = {
        name: 'MapPool',
        firstMapSID: 667290,
        modPools: [
            {
                mod: 'Hidden',
                modStr: 'HD',
                beatMaps: []
            }
        ]
    }) {
    // 导入模板
    let svg = readTemplate("template/Panel_H.svg");

    // 路径定义
    const reg_panelheight = '${panelheight}'
    const reg_cardheight = '${cardheight}'
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PH-1\);">)/;
    const reg_bodycard = /(?<=<g id="BodyCard">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Get Mappool (!ymgp)', 'GP', 'v0.4.0 UU');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入主体卡片
    const pools = data.modPools || [];
    let cards = [];
    let row = 1;

    let map_count = 0;

    for (const p of pools) {
        cards.push(await drawModPool(p, row));
        row += getRowCount(p?.beatMaps?.length);
        map_count += p?.beatMaps?.length;
    }

    //执行上面的代码
    for (const v of cards) {
        svg = replaceText(svg, v, reg_bodycard);
    }

    // 卡片定义
    const mod_count = pools.length || 0;
    const poolInfo = await card_A2(await pool2cardA2(data, map_count, mod_count));

    //设置面板高度
    const panelHeight = 330 + 150 * (row - 1);
    const cardHeight = 40 + 150 * (row - 1);

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantSvgBody(svg,40, 40, poolInfo, reg_maincard);

    return svg.toString();
}

async function drawModPool(pool = {
    mod: 'Hidden',
    modStr: 'HD',
    beatMaps: []
}, rowStart = 1) {
    let data = [];
    const count = pool?.beatMaps?.length || 0;

    for (let j = 0; j < getFullRowCount(count); j++) {
        for (let k = 0; k < 3; k++) {
            data.push(
                await drawCardD(pool.beatMaps[j * 3 + k], pool.modStr, rowStart - 1 + j + 1, k + 1, 3)
            );
        }
    }

    if (hasRemain(count)) {
        for (let o = 0; o < getRemain(count); o++) {
            data.push(
                await drawCardD(pool.beatMaps[getFullRowCount(count) * 3 + o], pool.modStr, rowStart - 1 + getFullRowCount(count) + 1, o + 1, getRemain(count))
            );
        }
    }

    return data;
}
//渲染单张卡片
async function drawCardD(b, mod = 'NM', row = 1, column = 1, maxColumn = 3) {
    const x = ((3 - maxColumn) * 300 + 80) + 600 * (column - 1);
    const y = 330 + 150 * (row - 1);

    return transformSvgBody(x, y, await card_D(await beatmap2CardD(b, mod)));
}

function getRowCount(i = 0) {
    if (typeof i !== "number") return 0;
    let v = getFullRowCount(i)
    if (hasRemain(i)) v++;
    return v;
}

function getFullRowCount(i = 0) {
    return Math.floor(i / 3);
}

function getRemain(i = 0) {
    return i % 3;
}

function hasRemain(i = 0) {
    return (getRemain(i) !== 0);
}

async function pool2cardA2(data, map_count = 0, mod_count = 0) {
    const background = data?.firstMapSID ? await getMapBG(data.firstMapSID, 'cover', false) : getRandomBannerPath();

    const title1 = data.name || '';
    const title3 = data.categoryList ? data.categoryList[0].category ? 'creator: ' + data.categoryList[0].category[0].creater : 'creator?' : '';

    const left2 = data.info ? data.info.toString() : '';
    const left3 = (map_count && mod_count) ? 'P' + mod_count + ' M' + map_count : '';
    const right3b = data.id ? data.id.toString() : '0';

    return {
        background: background,
        map_status: null,

        title1: title1,
        title2: '',
        title3: title3,
        title_font: 'PuHuiTi',
        left1: '',
        left2: left2,
        left3: left3,
        right1: '',
        right2: 'Pool ID:',
        right3b: right3b,
        right3m: '',
    };
}

async function beatmap2CardD(b, mod) {
    let cs = b.cs, ar = b.ar, od = b.accuracy, hp = b.drain;

    //修改四维
    if (mod === 'DT' || mod === 'NC') {
        ar = (ar > 5) ? ((1200 - 750 * (ar - 5) / 5) * 2 / 3 - 1200) / 750 * 5 + 5
            : - ((1200 - 600 * (5 - ar) / 5) * 2 / 3 - 1200) / 600 * 5 + 5 ;
        od = (b.mode_int === 1) ? ( - (50 - (3 * od)) * 2 / 3 + 50) / 3
            : (b.mode_int === 3) ? ( - (64 - (3 * od)) * 2 / 3 + 64) / 3
                : ( - (80 - (6 * od)) * 2 / 3 + 80) / 3;
        hp *= 3 / 4;
    } else if (mod === 'HT' || mod === 'DC') {
        ar = (ar > 5) ? ((1200 - 750 * (ar - 5) / 5) * 3 / 2 - 1200) / 750 * 5 + 5
            : - ((1200 - 600 * (5 - ar) / 5) * 3 / 2 - 1200) / 600 * 5 + 5 ;
        od = (b.mode_int === 1) ? ( - (50 - (3 * od)) * 3 / 2 + 50) / 2
            : (b.mode_int === 3) ? ( - (64 - (3 * od)) * 3 / 2 + 64) / 2
                : ( - (80 - (6 * od)) * 3 / 2 + 80) / 2;
        hp *= 3 / 2;
    } else if (mod === 'HR') {
        ar = Math.min(ar * 1.4, 10);
        cs = Math.min(cs * 1.3, 10);
        od = Math.min(od * 1.4, 10);
        hp = Math.min(hp * 1.4, 10);
    } else if (mod === 'EZ') {
        ar /= 2;
        cs /= 2;
        od /= 2;
        hp /= 2;
    }

    const star = await getStar(b.difficulty_rating, b.id, getModInt([mod]), b.mode_int);

    async function getStar(rawStar = 0, bid = 0, mods, modeInt = 0) {
        if (mod === 'DT' || mod === 'NC' || mod === 'HT' || mod === 'DC' || mod === 'HR' || mod === 'EZ' || mod === 'FL') {
            try {
                const attr = await getMapAttributes(bid, mods, modeInt)
                return attr.stars;
            } catch (e) {
                return rawStar;
            }
        } else {
            return rawStar;
        }
    }

    return {
        background: await getMapBG(b.beatmapset.id, 'cover', hasLeaderBoard(b.ranked)),
        title: b.beatmapset.title || '',
        title_unicode: b.beatmapset.title_unicode || '',
        artist: b.beatmapset.artist || '',
        mapper: b.beatmapset.creator || '',
        difficulty: b.version || '',
        bid: b.id || 0,
        mod: mod,
        cs: cs,
        ar: ar,
        od: od,
        hp: hp,
        star_rating: star,
        game_mode: b.mode,

        font_title2: 'PuHuiTi',
    }
}
