import {
    exportJPEG, getImageFromV3, getPanelNameSVG, implantImage,
    implantSvgBody, isNotEmptyArray, readTemplate,
    replaceText
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_I} from "../card/card_I.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {getMaimaiBG, getMaimaiRankBG, getMaimaiType, getMaimaiVersionBG} from "../util/maimai.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MA(data);
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
        const svg = await panel_MA(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * maimai 多成绩列表。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MA(data = {
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
    panel: "MA"
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

    if (data?.panel === 'MB') {
        panel_name = getPanelNameSVG('Maimai Multiple Best Scores (!ymmb)', 'MB', 'v0.4.1 SE');
    } else if (data?.panel === 'MV') {
        panel_name = getPanelNameSVG('Maimai Version Scores (!ymmv)', 'MV', 'v0.4.1 SE');
    } else {
        panel_name = getPanelNameSVG('Maimai Multiple Scores (!ymx)', 'SS', 'v0.4.1 SE');
    }

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.maimaiPlayer2CardA1(data.user));

    const standard = data?.scores || []
    const deluxe = data?.scores_latest || []

    // 导入i卡
    let cardI1 = [];
    let cardI2 = [];

    for (const s of standard) {
        cardI1.push(card_I(await maiScore2CardI(s))) ;
    }

    for (const s of deluxe) {
        cardI2.push(card_I(await maiScore2CardI(s))) ;
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

    if (isNotEmptyArray(data.versions)) {
        const l = data.versions.length;
        const x = Math.min(l, 5);

        for (let i = 0; i < x; i++) {
            const v = data.versions[x - i - 1] // 反向获取
            svg = implantImage(svg, 260, 130, 1920 - 40 - 10 - 260 - 270 * i, 140, 1, getMaimaiVersionBG(v), reg_index);
        }

        svg = replaceText(svg, PanelDraw.Rect(1920 - 40 - 20 - 270 * l, 140, 270 * l + 20, 130, 20, '#382e32', 1), reg_index)
    }

    // 计算面板高度
    const cardHeight = I1_height + I2_height + 40
    const panelHeight = cardHeight + 290

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    return svg.toString()
}

async function maiScore2CardI(score = {
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
}) {
    const position = score?.position >= 1 ? ('#' + score.position + ' // ') : ''
    const achievement_text = position + (score?.achievements || 0).toFixed(4) + '%'

    const rating_max = Math.floor(score.ds * 1.005 * 22.4) || 0
    const rating_max_text = score?.ra >= rating_max ? ('') : ('[' + rating_max + '] ')

    const too_bright = (score?.level_index || 0) === 4 || (score?.level_index || 0) === 1;

    const difficulty_color = getDifficultyColor(score?.level_index || 0)

    return {
        background: getMaimaiRankBG(score?.rate || ''),
        cover: await getMaimaiBG(score?.song_id || 0),
        rank: getImageFromV3('Maimai', `object-score-${score?.rate || 'd'}2.png`),
        type: getMaimaiType(score?.type),

        title: score?.title || '',
        left1: score?.artist || '',
        left2: score?.charter || '',
        right: achievement_text,
        index_b: Math.round(score?.ra || 0).toString(),
        index_m: '',
        index_l: rating_max_text, // 右下角左边的小字
        index_b_size: 40,
        index_m_size: 24,
        index_l_size: 18,
        label1: score?.level || '?',
        label2: (score?.song_id || 0).toString(),

        color_text: '#fff',
        color_label1: too_bright ? '#000' : '#fff',
        color_label2: too_bright ? '#000' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,

        color_component1: getDXRatingStars(score?.dxScore || 0, score?.max || 0), // 星星 //注意。这个组件的锚点在左下角
        color_component2: getComboAndSync(score?.fc, score?.fs),
    }
}

function getDifficultyColor(index = 0) {
    switch (index) {
        case 1: return '#fff100'
        case 2: return '#d32f2f'
        case 3: return '#9922ee'
        case 4: return '#f7d8fe'
        default: return '#009944'
    }
}

function getDXRatingStars(rating = 0, max = 0) {
    if (typeof max !== "number" || max <= 0) return ''

    const div = rating / max;
    let level
    let color

    if (div >= 0.97) {
        level = 5
        color = '#fbf365'
    } else if (div >= 0.95) {
        level = 4
        color = '#ffb84d'
    } else if (div >= 0.93) {
        level = 3
        color = '#ffb84d'
    } else if (div >= 0.9) {
        level = 2
        color = '#6fc576'
    } else if (div >= 0.85) {
        level = 1
        color = '#6fc576'
    } else {
        return ''
    }

    const diamonds = [
        PanelDraw.Diamond(0, -10, 10, 10, color),
        PanelDraw.Diamond(14, -10, 10, 10, color),
        PanelDraw.Diamond(28, -10, 10, 10, color),
        PanelDraw.Diamond(7, -18, 10, 10, color),
        PanelDraw.Diamond(21, -18, 10, 10, color),
    ]

    let out = '';

    for (let i = 0; i < level; i++) {
        out += diamonds[i];
    }

    return out;
}

function getComboAndSync(combo = '', sync = '') {
    let combo_color

    switch (combo) {
        case 'fc': combo_color = '#6fc576'; break;
        case 'fcp': combo_color = '#c2e5c3'; break;
        case 'ap': combo_color = '#ffb84d'; break;
        case 'app': combo_color = '#fbf365'; break;
        default: combo_color = '#46393f'; break;
    }

    let sync_color;
    switch (sync) {
        case 'sync': sync_color = '#0068b7'; break;
        case 'fs': sync_color = '#80d8ff'; break;
        case 'fsp': sync_color = '#e1f6ff'; break;
        case 'fsd': sync_color = '#ffb84d'; break;
        case 'fsdp': sync_color = '#fbf365'; break;
        default: sync_color = '#46393f'; break;
    }

    return PanelDraw.Circle(5, 5, 5, combo_color) + PanelDraw.Circle(19, 5, 5, sync_color)
}