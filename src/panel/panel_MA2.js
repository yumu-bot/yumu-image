import {
    exportJPEG,
    getImageFromV3,
    getPanelNameSVG,
    setImage,
    setSvgBody, isNotEmptyArray,
    readTemplate,
    setText, thenPush, getSvgBody, round
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {card_I3} from "../card/card_I3.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {
    getCHUNITHMCover, getCHUNITHMRank,
    getCHUNITHMRankBG, getCHUNITHMDifficultyColor,
} from "../util/maimai.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MA2(data);
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
        const svg = await panel_MA2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * CHUNITHM 多成绩列表。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MA2(data = {
    user: {},
    scores: [{
        "achievements": 100.5133,
        "ds": 10.4,
        "dxScore": 1125,
        "fc": "fc",
        "fs": "sync",
        "level": "10",
        "level_index": 2,
        "level_label": "Expert",
        "ra": 234,
        "rate": "sssp",
        "song_id": 10319,
        "title": "幻想のサテライト",
        "artist": "豚乙女",
        "charter": "mai-Star",
        "type": "DX",
        "max": 234,
        "position": 0,
    },],

    // 仅 b35+b15 使用
    scores_latest: [],
    scores_selection: [],

    versions: [''],
    panel: "CB"
}) {
    let svg = readTemplate('template/Panel_MA.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_card_i = /(?<=<g id="CardI">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MA1-1\);">)/;

    // 面板文字
    let panel_name

    if (data?.panel === 'CB') {
        panel_name = getPanelNameSVG('CHUNITHM Multiple Best Scores (!ymcb)', 'CB');
    } else {
        panel_name = getPanelNameSVG('CHUNITHM Multiple Scores (!ymy)', 'Y');
    }

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.chuPlayer2CardA1(data.user));

    const standard = data?.scores || []
    const deluxe = data?.scores_latest || []
    const select = data?.scores_selection || []

    // 导入i卡
    let param_b30 = [];
    let param_n20 = [];
    let param_s10 = [];

    await Promise.allSettled(
        standard.map((s) => {
            return chuScore2CardI3(s)
        })
    ).then(results => thenPush(results, param_b30))

    const card_b30 = param_b30.map((sd) => {return card_I3(sd)})

    await Promise.allSettled(
        deluxe.map((s) => {
            return chuScore2CardI3(s)
        })
    ).then(results => thenPush(results, param_n20))

    const card_n20 = param_n20.map((dx) => {return card_I3(dx)})

    await Promise.allSettled(
        select.map((s) => {
            return chuScore2CardI3(s)
        })
    ).then(results => thenPush(results, param_s10))

    const card_s10 = param_s10.map((se) => {return card_I3(se)})

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const b30_height = Math.ceil(card_b30.length / 5) * 150
    const n20_height = Math.ceil(card_n20.length / 5) * 150
    const s10_height = Math.ceil(card_s10.length / 5) * 150
    let bn_offset = 0
    let ns_offset = 0

    let string_b30 = ''

    for (const i in card_b30) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        string_b30 += getSvgBody(40 + (352 + 20) * x, 330 + 150 * y, card_b30[i]);
    }

    svg = setText(svg, string_b30, reg_card_i);

    if (isNotEmptyArray(card_b30) && isNotEmptyArray(card_n20)) {
        bn_offset = 20
    }

    if ((isNotEmptyArray(card_b30) || isNotEmptyArray(card_n20)) && isNotEmptyArray(card_s10)) {
        ns_offset = 20
    }

    let string_n20 = ''

    for (const i in card_n20) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        string_n20 += getSvgBody(40 + (352 + 20) * x, 330 + 150 * y + b30_height + bn_offset, card_n20[i]);
    }

    svg = setText(svg, string_n20, reg_card_i);

    let string_s10 = ''

    for (const i in card_s10) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        string_s10 += getSvgBody(40 + (352 + 20) * x, 330 + 150 * y + b30_height + bn_offset + n20_height + ns_offset, card_s10[i]);
    }

    svg = setText(svg, string_s10, reg_card_i);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath("maimai"), reg_banner, 0.8);

    // 计算面板高度
    let card_height

    if (n20_height === 0) {
        if (s10_height === 0) {
            card_height = b30_height + bn_offset + 60 - 15
        } else {
            card_height = b30_height + bn_offset + s10_height + 80 - 15
        }
    } else {
        if (s10_height === 0) {
            card_height = b30_height + bn_offset + n20_height + 80 - 15
        } else {
            card_height = b30_height + bn_offset + n20_height + s10_height + 100 - 15
        }
    }

    const panel_height = card_height + 290

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    return svg.toString()
}

/*
async function chuScore2CardI(score) {
    const rate = getCHUNITHMRank(score?.score || 0)

    const position = score?.position >= 1 ? ('#' + score.position + ' // ') : ''
    const score_text = position + (score?.score || 0).toString()

    const difficulty_color = getCHUNITHMDifficultyColor(score?.level_index)

    const rating_max = (score?.ds || 0) + 2.15
    const rating_max_text = score?.score >= 1009000 ? ('') : ('[' + getRoundedNumberStr(rating_max, 3) + '] ')

    const too_bright = (score?.level_index || 0) === 1;

    return {
        background: getCHUNITHMRankBG(score?.score || 0),
        cover: await getCHUNITHMCover(score?.mid || 0),
        rank: getImageFromV3('Chunithm', `object-score-${rate}2.png`),
        type: '',

        title: score?.title || '',
        left1: score?.artist || '',
        left2: score?.charter || '',
        right: score_text,
        index_b: getRoundedNumberStrLarge(score?.ra || 0, 3),
        index_m: getRoundedNumberStrSmall(score?.ra || 0, 3),
        index_l: rating_max_text, // 右下角左边的小字
        index_b_size: 40,
        index_m_size: 24,
        index_l_size: 18,
        label1: score?.ds?.toString() || '?',
        label2: score?.mid?.toString() || '0',

        color_text: '#fff',
        color_label1: too_bright ? '#1c1719' : '#fff',
        color_label2: too_bright ? '#1c1719' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,

        color_component1: '', // 星星 //注意。这个组件的锚点在左下角
        color_component2: '',
    }
}

async function chuScore2CardI2(score) {
    const rate = getCHUNITHMRank(score?.score || 0)

    const position = score?.position >= 1 ? ('#' + score.position + ' // ') : ''
    const score_text = (score?.score || 0).toString()

    const difficulty_color = getCHUNITHMDifficultyColor(score?.level_index)

    const rating = score?.ra || 0
    const rating_max = (score?.ds || 0) + 2.15
    const rating_max_text = score?.score >= 1009000 ? ('') : (' [' + getRoundedNumberStr(rating_max, 3) + ']')

    const right = position + getRoundedNumberStr(rating, 3) + rating_max_text

    const too_bright = (score?.level_index || 0) === 1;

    return {
        background: getCHUNITHMRankBG(score?.score || 0),
        cover: await getCHUNITHMCover(score?.mid || 0),
        rank: getImageFromV3('Chunithm', `object-score-${rate}2.png`),
        type: '',
        level: 0,

        title: score?.title || '',
        left1: score?.artist || '',
        left2: score?.charter || '',
        right: right,
        index_b: score_text.slice(0, -4) || '0',
        index_m: score_text.slice(-4) || '0000',
        index_l: '',
        index_b_size: 40,
        index_m_size: 24,
        index_l_size: 18,
        label1: score?.ds?.toString() || '?',
        label2: score?.mid?.toString() || '0',

        color_text: '#fff',
        color_label1: too_bright ? '#1c1719' : '#fff',
        color_label2: too_bright ? '#1c1719' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,

        component1: '',
        component2: '',
        component3: drawCombo(score?.fc),
    }
}

 */

async function chuScore2CardI3(score = {
    position: 45,
    artist: 'PRASTIK DANCEFLOOR',
    charter: 'じゃこレモン',
    cid: 2972,
    ds: 12.1,
    score: 970350,
    fc: '',
    level: '12',
    level_index: 2,
    level_label: 'Expert',
    mid: 1100,
    ra: 11.82,
    title: 'TECHNOPOLIS 2085',
    alias: '2085'
}) {
    const rate = getCHUNITHMRank(score?.score || 0)

    const score_text = (score?.score || 0).toString()

    const difficulty_color = getCHUNITHMDifficultyColor(score?.level_index)

    const rating = score?.ra || 0
    const rating_max = (score?.ds || 0) + 2.15
    const rating_max_text = score?.score >= 1009000 ? (' [MAX]') : (' [' + round(rating_max, 2) + ']')

    let difficulty

    if (score?.ds <= 0) {
        difficulty = score?.level || '?'
    } else {
        difficulty = score?.ds?.toString() || '?'
    }

    const too_bright = (score?.level_index || 0) === 1;

    return {
        background: getCHUNITHMRankBG(score?.score || 0),
        cover: await getCHUNITHMCover(score?.mid || 0),
        rank: getImageFromV3('Chunithm', `object-score-${rate}2.png`),
        type: '',
        level: 0,

        title: score?.title || '',
        title2: score?.alias || '',
        left1: score?.artist || '',
        left2: score?.charter || '',
        left3: round(rating, 2),
        left4: rating_max_text,

        index_b: score_text.slice(0, -4) || '0',
        index_m: score_text.slice(-4) || '0000',
        index_l: '',
        index_b_size: 32,
        index_m_size: 20,
        index_r_size: 18,
        label1: difficulty,
        label2: score?.position >= 1 ? ('#' + score.position) : '',
        label3: score?.mid?.toString() || '0',

        color_text: '#fff',
        color_label1: too_bright ? '#1c1719' : '#fff',
        color_label2: too_bright ? '#1c1719' : '#fff',
        color_label3: too_bright ? '#1c1719' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,
        color_rrect3: difficulty_color,

        component1: '',
        component2: '',
        component3: drawCombo(score?.fc),

        left3_is_right: true,
    }
}

function drawCombo(combo = '') {
    let combo_image

    switch (combo) {
        case 'fullcombo': combo_image = 'fullcombo'; break;
        case 'fullchain': combo_image = 'fullchain'; break;
        case 'alljustice': combo_image = 'alljustice'; break;
        default: return ''; //combo_image = 'clear'; break;
    }

    return PanelDraw.Image(0, 0, 105, 15, getImageFromV3('Chunithm', `object-icon-chain-${combo_image}.png`))
}