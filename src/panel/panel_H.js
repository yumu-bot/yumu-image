import {
    exportJPEG, getKeyDifficulty, getGameMode, getPanelNameSVG,
    setImage,
    setSvgBody, readTemplate,
    setText, getSvgBody, readNetImage, getMapBackground, isNotEmptyArray, setTexts, thenPush
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";

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
        pool: {
            name: 'MapPool',
            first_map_sid: 667290,
            mod_pools: [
                {
                    mod: 'Hidden',
                    mod_str: 'HD',
                    mod_color: '#EA68A2',
                    beatmaps: [],
                }
            ]
        },
        mode: 'OSU',
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
    const panel_name = getPanelNameSVG('Get Mappool (!ymgp)', 'GP');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 插入主体卡片
    const pools = data.pool.mod_pools || [];
    const mode = getGameMode(data?.mode, 0);

    let cards = [];
    let row = 1;
    let map_count = 0;

    for (const p of pools) {
        cards.push(await drawModPool(p, mode, row));
        row += getRowCount(p?.beatmaps?.length);
        map_count += p?.beatmaps?.length;
    }

    //执行上面的代码
    svg = setTexts(svg, cards, reg_bodycard)

    // 卡片定义
    const mod_count = pools.length || 0;
    const poolInfo = card_A2(await pool2cardA2(data?.pool, mode, map_count, mod_count));

    //设置面板高度
    const panelHeight = 330 + 150 * (row - 1);
    const cardHeight = 40 + 150 * (row - 1);

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);
    svg = setSvgBody(svg,40, 40, poolInfo, reg_maincard);

    return svg.toString();
}

async function drawModPool(pool = {
    mod: 'Hidden',
    mod_str: 'HD',
    beatmaps: []
}, mode = 'osu', rowStart = 1) {
    /**
     *
     * @type {[Promise<*>]}
     */
    let card = [];
    let data = [];
    const count = pool?.beatmaps?.length || 0;

    for (let j = 0; j < getFullRowCount(count); j++) {
        for (let k = 0; k < 3; k++) {
            card.push(
                drawCardD(pool.beatmaps[j * 3 + k], pool.mod_str, pool.mod_color, mode, rowStart - 1 + j + 1, k + 1, 3)
            );
        }
    }

    if (hasRemain(count)) {
        for (let o = 0; o < getRemain(count); o++) {
            card.push(
                drawCardD(pool.beatmaps[getFullRowCount(count) * 3 + o], pool.mod_str, pool.mod_color, mode, rowStart - 1 + getFullRowCount(count) + 1, o + 1, getRemain(count))
            );
        }
    }

    await Promise.allSettled(card)
        .then(results => thenPush(results, data))

    return data;
}
//渲染单张卡片
async function drawCardD(b, mod = 'NM', mod_color = '666', mode = 'osu', row = 1, column = 1, maxColumn = 3) {
    const x = ((3 - maxColumn) * 300 + 80) + 600 * (column - 1);
    const y = 330 + 150 * (row - 1);

    return getSvgBody(x, y, await card_H(await beatmap2CardD(b, mod, mod_color, mode)));
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

async function pool2cardA2(pool, mode, map_count = 0, mod_count = 0) {
    const background = pool?.first_map_sid ? await readNetImage('https://assets.ppy.sh/beatmaps/' + pool.first_map_sid + '/covers/cover.jpg', false) : getRandomBannerPath();

    const title1 = pool.name || '';
    const title3 = isNotEmptyArray(pool?.category_list) ? pool.category_list[0].category ? 'creator: ' + pool.category_list[0].category[0].creater : 'creator?' : '';

    const left1 = pool.info ? pool.info.toString() : '';
    const left3 = (map_count && mod_count) ? 'P' + mod_count + ' M' + map_count : '';
    const right3b = pool.id ? pool.id.toString() : '0';

    return {
        background: background,
        map_status: null,

        title1: title1,
        title2: '',
        title3: title3,
        title_font: 'PuHuiTi',
        left1: left1,
        left2: 'mode: ' + mode,
        left3: left3,
        right1: '',
        right2: 'Pool ID:',
        right3b: right3b,
        right3m: '',
    };
}

async function beatmap2CardD(b, mod, mod_color, mode) {
    let cs = b.cs, ar = b.ar, od = b.accuracy, hp = b.drain;

    /**
     * @type {Number}
     */
    const mode_int = getGameMode(mode, -2);

    /*

    //修改四维
    if (mod === 'DT' || mod === 'NC') {
        ar = (ar > 5) ? ((1200 - 750 * (ar - 5) / 5) * 2 / 3 - 1200) / 750 * 5 + 5
            : - ((1200 - 600 * (5 - ar) / 5) * 2 / 3 - 1200) / 600 * 5 + 5 ;
        od = (mode_int === 1) ? ( - (50 - (3 * od)) * 2 / 3 + 50) / 3
            : (mode_int === 3) ? ( - (64 - (3 * od)) * 2 / 3 + 64) / 3
                : ( - (80 - (6 * od)) * 2 / 3 + 80) / 3;
        hp *= 3 / 4;
    } else if (mod === 'HT' || mod === 'DC') {
        ar = (ar > 5) ? ((1200 - 750 * (ar - 5) / 5) * 3 / 2 - 1200) / 750 * 5 + 5
            : - ((1200 - 600 * (5 - ar) / 5) * 3 / 2 - 1200) / 600 * 5 + 5 ;
        od = (mode_int === 1) ? ( - (50 - (3 * od)) * 3 / 2 + 50) / 2
            : (mode_int === 3) ? ( - (64 - (3 * od)) * 3 / 2 + 64) / 2
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

    const star = await getStar(b.difficulty_rating, b.id, getModInt([mod]), mode_int, b?.mode_int);

    // 如果 mod 会影响星数，或者转谱则计算
    async function getStar(rawStar = 0, bid = 0, mod_int = 0, mode_int = 0, beatmap_mode_int = 0) {
        if (hasModChangedSR(mod) || mode_int !== beatmap_mode_int) {
            try {
                const attr = await getMapAttributes(bid, mod_int, mode_int)
                return attr.stars;
            } catch (e) {
                return rawStar;
            }
        } else {
            return rawStar;
        }
    }

     */

    return {
        background: await getMapBackground(b, 'cover'),
        title: b.beatmapset.title || '',
        title_unicode: b.beatmapset.title_unicode || '',
        artist: b.beatmapset.artist || '',
        mapper: b.beatmapset.creator || '',
        difficulty: getKeyDifficulty(b) || '',
        bid: b.id || 0,
        mod: mod,
        mod_color: mod_color,
        cs: cs,
        ar: ar,
        od: od,
        hp: hp,
        star_rating: b.difficulty_rating,
        mode_int: mode_int,

        font_title2: 'PuHuiTi',
    }
}
