import {
    exportJPEG,
    getImageFromV3,
    getPanelNameSVG,
    getRoundedNumberStr,
    getRoundedNumberStrLarge,
    getRoundedNumberStrSmall,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_I} from "../card/card_I.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {
    getCHUNITHMCover, getCHUNITHMRank,
    getCHUNITHMRankBG, getCHUNITHMDifficultyColor,
} from "../util/maimai.js";

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
        panel_name = getPanelNameSVG('CHUNITHM Multiple Best Scores (!ymmb)', 'CB', 'v0.4.1 SE');
    } else {
        panel_name = getPanelNameSVG('CHUNITHM Multiple Scores (!ymy)', 'SS', 'v0.4.1 SE');
    }

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.chunithmPlayer2CardA1(data.user));

    const standard = data?.scores || []
    const deluxe = data?.scores_latest || []

    // 导入i卡
    let cardI1 = [];
    let cardI2 = [];

    for (const s of standard) {
        cardI1.push(card_I(await chuScore2CardI(s))) ;
    }

    for (const s of deluxe) {
        cardI2.push(card_I(await chuScore2CardI(s))) ;
    }


    // 插入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const I1_height = Math.ceil(cardI1.length / 4) * 150
    const I2_height = Math.ceil(cardI2.length / 4) * 150

    for (const i in cardI1) {
        const x = i % 4;
        const y = Math.floor(i / 4);

        svg = implantSvgBody(svg, 40 + 470 * x, 330 + 150 * y, cardI1[i], reg_card_i);
    }

    for (const i in cardI2) {
        const x = i % 4;
        const y = Math.floor(i / 4);

        svg = implantSvgBody(svg, 40 + 470 * x, 330 + 150 * y + I1_height, cardI2[i], reg_card_i);
    }

    // 导入图片
    svg = implantImage(svg, 1920, 330, 0, 0, 0.8, getRandomBannerPath("maimai"), reg_banner);

    // 计算面板高度
    const cardHeight = I1_height + I2_height + 40
    const panelHeight = cardHeight + 290

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    return svg.toString()
}

async function chuScore2CardI(score = {
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
    title: 'TECHNOPOLIS 2085'
}) {
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
        color_label1: too_bright ? '#000' : '#fff',
        color_label2: too_bright ? '#000' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,

        color_component1: '', // 星星 //注意。这个组件的锚点在左下角
        color_component2: '',
    }
}