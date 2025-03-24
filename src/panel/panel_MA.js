import {
    exportJPEG, getImageFromV3, getPanelNameSVG, setImage,
    setSvgBody, isNotEmptyArray, readTemplate,
    setText
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {
    getMaimaiCover,
    getMaimaiDifficultyColor, getMaimaiDXStarLevel, getMaimaiMaximumRating,
    getMaimaiRankBG,
    getMaimaiType,
    getMaimaiVersionBG
} from "../util/maimai.js";
import {PanelDraw} from "../util/panelDraw.js";
import {card_I3} from "../card/card_I3.js";

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
        panel_name = getPanelNameSVG('Maimai Multiple Best Scores (!ymmb)', 'MB', 'v0.5.0 DX');
    } else if (data?.panel === 'MV') {
        panel_name = getPanelNameSVG('Maimai Version Scores (!ymmv)', 'MV', 'v0.5.0 DX');
    } else {
        panel_name = getPanelNameSVG('Maimai Multiple Scores (!ymx)', 'SS', 'v0.5.0 DX');
    }

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.maimaiPlayer2CardA1(data.user));

    const standard = data?.scores || []
    const deluxe = data?.scores_latest || []

    // 导入i卡
    let card_sd = [];
    let card_dx = [];

    for (const s of standard) {
        card_sd.push(card_I3(await maiScore2CardI3(s))) ;
    }

    for (const s of deluxe) {
        card_dx.push(card_I3(await maiScore2CardI3(s))) ;
    }

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const sd_height = Math.ceil(card_sd.length / 5) * 150
    let dx_offset = 0 // 偏移值
    const dx_height = Math.ceil(card_dx.length / 5) * 150

    for (const i in card_sd) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        svg = setSvgBody(svg, 40 + (352 + 18) * x, 330 + 150 * y, card_sd[i], reg_card_i);
    }

    if (isNotEmptyArray(card_sd) && isNotEmptyArray(card_dx)) dx_offset = 20

    for (const i in card_dx) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        svg = setSvgBody(svg, 40 + (352 + 18) * x, 330 + 150 * y + sd_height + dx_offset, card_dx[i], reg_card_i);
    }

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 330, getRandomBannerPath("maimai"), reg_banner, 0.8);

    if (isNotEmptyArray(data.versions)) {
        const l = data.versions.length;
        const x = Math.min(l, 5);

        for (let i = 0; i < x; i++) {
            const v = data.versions[x - i - 1] // 反向获取
            svg = setImage(svg, 1920 - 40 - 10 - 260 - 270 * i, 140, 260, 130, getMaimaiVersionBG(v), reg_index, 1);
        }

        svg = setText(svg, PanelDraw.Rect(1920 - 40 - 20 - 270 * l, 140, 270 * l + 20, 130, 20, '#382e32', 1), reg_index)
    }

    // 计算面板高度
    const cardHeight = sd_height + dx_offset + dx_height + 80 - 15
    const panelHeight = cardHeight + 290

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    return svg.toString()
}

/*
async function maiScore2CardI(score) {
    const position = score?.position >= 1 ? ('#' + score.position + ' // ') : ''
    const achievement_text = position + (score?.achievements || 0).toFixed(4) + '%'

    const rating_max = getMaimaiMaximumRating(score?.ds)
    const rating_max_text = score?.ra >= rating_max ? ('') : ('[' + rating_max + '] ')

    const too_bright = (score?.level_index || 0) === 4 || (score?.level_index || 0) === 1;

    const difficulty_color = getMaimaiDifficultyColor(score?.level_index || 0)

    return {
        background: getMaimaiRankBG(score?.rate || ''),
        cover: await getMaimaiCover(score?.song_id || 0),
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
        label1: score?.ds?.toString() || '?',
        label2: score?.song_id?.toString() || '?',

        color_text: '#fff',
        color_label1: too_bright ? '#1c1719' : '#fff',
        color_label2: too_bright ? '#1c1719' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,

        color_component1: drawStars(score?.dxScore || 0, score?.max || 0), // 星星 //注意。这个组件的锚点在左下角
        color_component2: drawComboAndSync(score?.fc, score?.fs),
    }

    function drawStars(dx = 0, max = 0) {
        const level = getMaimaiDXStarLevel(dx, max)
        const color = getMaimaiDXStarColor(level)

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

    function drawComboAndSync(combo = '', sync = '') {
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
}

async function maiScore2CardI2(score) {
    const position = score?.position >= 1 ? ('#' + score.position + ' // ') : ''
    const achievement_text = (score?.achievements || 0).toFixed(4).toString()

    const rating = Math.round(score?.ra || 0)
    const rating_max = getMaimaiMaximumRating(score?.ds)
    const rating_max_text = (rating >= rating_max) ? ('') : (' [' + rating_max + ']')

    const right = position + rating.toString() + rating_max_text

    const too_bright = (score?.level_index || 0) === 4 || (score?.level_index || 0) === 1;

    const difficulty_color = getMaimaiDifficultyColor(score?.level_index || 0)

    return {
        background: getMaimaiRankBG(score?.rate || ''),
        cover: await getMaimaiCover(score?.song_id || 0),
        rank: getImageFromV3('Maimai', `object-score-${score?.rate || 'd'}2.png`),
        type: getMaimaiType(score?.type),
        level: getMaimaiDXStarLevel(score?.dxScore, score?.max),

        title: score?.title || '',
        title2: score?.alias || '',
        left1: score?.artist || '',
        left2: score?.charter || '',
        right: right,
        index_b: achievement_text.slice(0, -3),
        index_m: achievement_text.slice(-3),
        index_r: (score?.achievements > 0) ? '%' : '', // 右下角左边的小字
        index_b_size: 40,
        index_m_size: 24,
        index_r_size: 18,
        label1: score?.ds?.toString() || '?',
        label2: score?.song_id?.toString() || '?',

        color_text: '#fff',
        color_label1: too_bright ? '#1c1719' : '#fff',
        color_label2: too_bright ? '#1c1719' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,

        component1: drawCombo(score?.fc),
        component2: drawSync(score?.fs),
        component3: '',
    }
}

 */

async function maiScore2CardI3(score = {
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
    "alias": "幻想的卫星",
    "artist": "豚乙女",
    "charter": "mai-Star",
    "type": "DX",
    "max": 234,
    "position": 0,
}) {
    const achievement_text = (score?.achievements || 0).toFixed(4).toString()

    const rating = Math.round(score?.ra || 0)
    const rating_max = getMaimaiMaximumRating(score?.ds)
    const rating_max_text = (rating >= rating_max) ? (' [MAX]') : (' [' + rating_max + ']')

    const too_bright = (score?.level_index || 0) === 4 || (score?.level_index || 0) === 1;

    const difficulty_color = getMaimaiDifficultyColor(score?.level_index || 0)

    return {
        background: getMaimaiRankBG(score?.rate || ''),
        cover: await getMaimaiCover(score?.song_id || 0),
        rank: getImageFromV3('Maimai', `object-score-${score?.rate || 'd'}2.png`),
        type: getMaimaiType(score?.type),
        level: getMaimaiDXStarLevel(score?.dxScore, score?.max),

        title: score?.title || '',
        title2: score?.alias || '',
        left1: score?.artist || '',
        left2: score?.charter || '',
        left3: rating.toString(),
        left4: rating_max_text,
        index_b: achievement_text.slice(0, -3),
        index_m: achievement_text.slice(-3),
        index_r: (score?.achievements > 0) ? '%' : '',
        index_b_size: 32,
        index_m_size: 20,
        index_r_size: 18,
        label1: score?.ds?.toString() || '?',
        label2: score?.position >= 1 ? ('#' + score.position) : '',
        label3: score?.song_id?.toString() || '?',

        color_text: '#fff',
        color_label1: too_bright ? '#1c1719' : '#fff',
        color_label2: too_bright ? '#1c1719' : '#fff',
        color_label3: too_bright ? '#1c1719' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,
        color_rrect3: difficulty_color,

        component1: drawCombo(score?.fc),
        component2: drawSync(score?.fs),
        component3: '',

        left3_is_right: false,
    }
}

function drawCombo(combo = '') {
    let combo_image

    switch (combo) {
        case 'fc': combo_image = 'fullcombo'; break;
        case 'fcp': combo_image = 'fullcomboplus'; break;
        case 'ap': combo_image = 'allperfect'; break;
        case 'app': combo_image = 'allperfectplus'; break;
        default: combo_image = 'clear'; break;
    }

    return PanelDraw.Image(0, 0, 27, 30, getImageFromV3('Maimai', `object-icon-combo-${combo_image}.png`))
}

function drawSync(sync = '') {
    let sync_image;
    switch (sync) {
        case 'sync': sync_image = 'sync'; break;
        case 'fs': sync_image = 'fullsync'; break;
        case 'fsp': sync_image = 'fullsyncplus'; break;
        case 'fsd': sync_image = 'fullsyncdx'; break;
        case 'fsdp': sync_image = 'fullsyncdxplus'; break;
        default: sync_image = 'solo'; break;
    }

    return PanelDraw.Image(0, 0, 27, 30, getImageFromV3('Maimai', `object-icon-sync-${sync_image}.png`))
}