import {
    exportJPEG,
    getBeatMapTitlePath,
    getImageFromV3,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    isASCII,
    readTemplate,
    setText,
    setTexts, round, rounds
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMultipleTextPath, poppinsBold, PuHuiTi} from "../util/font.js";
import {
    getMaimaiCategory,
    getMaimaiCover,
    getMaimaiMaximumRating,
    getMaimaiRankBG,
    getMaimaiType,
    getMaimaiVersionBG
} from "../util/maimai.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_ME(data);
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
        const svg = await panel_ME(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

const RANK_COLORS = ['#848484', '#5eb0ac', '#587ec3', '#5967af',
    '#59519e', '#d56da1', '#d56e74', '#d56e4b',
    '#dd8d52', '#e6ad5a', '#fff767', '#fff996',
    '#56b1ef', '#82cdff'
]

const COMBO_COLORS = ['#56b1ef', '#63ae71', '#88bd6f', '#e6ad5a',
    '#fff767'
]

/**
 * maimai 成绩面板
 * @param data
 * @return {Promise<string>}
 */
// E面板升级计划
export async function panel_ME(data = {
    song: {
        "id": "10319",
        "title": "幻想のサテライト",
        "alias": "幻想的卫星",
        "type": "DX",
        "ds": [
            4.0,
            7.8,
            10.4,
            13.6
        ],
        "level": [
            "4",
            "7+",
            "10",
            "13"
        ],
        "cids": [
            2207,
            2208,
            2209,
            2210
        ],
        "charts": [
            {
                "notes": [
                    120,
                    14,
                    4,
                    12,
                    6
                ],
                "charter": "-"
            },
            {
                "notes": [
                    212,
                    24,
                    10,
                    10,
                    14
                ],
                "charter": "-"
            },
            {
                "notes": [
                    313,
                    38,
                    32,
                    35,
                    8
                ],
                "charter": "シチミヘルツ"
            },
            {
                "notes": [
                    395,
                    55,
                    85,
                    188,
                    5
                ],
                "charter": "某S氏"
            }
        ],
        "basic_info": {
            "title": "幻想のサテライト",
            "artist": "豚乙女",
            "genre": "东方Project",
            "bpm": 230,
            "release_date": "",
            "from": "maimai でらっくす",
            "is_new": false
        }
    },

    score: {
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
        "type": "DX",
        "max": 1584,
    },

    user: {
        "name": "SIyuyuko",
        "probername": "siyuyuko",
        "dan": 0,
        "plate": "",
        "rating": 16384,
        "base": 6247,
        "additional": 704,
        "platename": ""
    },
    chart: {
        cnt: 40548,
        diff: '13',
        fit_diff: 13.087111508862211,
        avg: 98.89086608957203,
        avg_dx: 1822.3576501923646,
        std_dev: 1.893239577489891,
        dist: [
            67, 32, 41, 51,
            95, 627, 1071, 2488,
            2567, 4395, 3527, 4448,
            9914, 11225
        ],
        fc_dist: [22077, 15301, 2717, 406, 47]
    },
    diff: {
        achievements: 98.18493029066289,
        dist: [
            0.0036156539303055903,
            0.001280319906978949,
            0.0019736732771803377,
            0.0015605218485318481,
            0.0024396775756987954,
            0.022256098308517457,
            0.04559009548116136,
            0.10248321308397312,
            0.08164869351247368,
            0.12102803190896665,
            0.08530003675181519,
            0.10004081113353877,
            0.20083831734988083,
            0.2299448559309774
        ],
        fc_dist: [
            0.6742283957764563,
            0.21712285867551254,
            0.08623490594232444,
            0.018627094942007597,
            0.003786744663699096
        ]
    }

}) {
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');

    // 路径定义
    const reg_banner_blurred = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_e1 = /(?<=<g id="Card_E1">)/;
    const reg_card_e2 = /(?<=<g id="Card_E2">)/;
    const reg_card_e3 = /(?<=<g id="Card_E3">)/;

    // 导入文字
    svg = setText(svg, getPanelNameSVG('maimai Best Performance (!ymmb)', 'MB', 'v0.5.0 DX'), reg_index);

    // 评级
    svg = setImage(svg, 665, 290, 590, 590, getImageFromV3('Maimai', `object-score-${data?.score?.rate || 'd'}.png`), reg_index, 1);

    // 图片定义
    const background = getMaimaiRankBG(data.score.rate);
    const banner = await getMaimaiCover(data.song.id);
    const componentE1 = component_E1(PanelMEGenerate.score2componentE1(data.score));
    const componentE2 = component_E2(PanelMEGenerate.score2componentE2(data.song));
    const componentE3 = component_E3(PanelMEGenerate.score2componentE3(data.diff, data.score.level, data.chart.fit_diff));
    const componentE4 = component_E4(PanelMEGenerate.score2componentE4(data.score.type));
    const componentE5 = component_E5(PanelMEGenerate.score2componentE5(data.song.basic_info.bpm, data.chart.cnt));
    const componentE6 = await component_E6(PanelMEGenerate.score2componentE6(data.song, data.score.level_index));
    const componentE7 = component_E7(PanelMEGenerate.score2componentE7(data.score));
    const componentE8 = component_E8(PanelMEGenerate.score2componentE8(data.score));
    const componentE9 = component_E9(PanelMEGenerate.score2componentE9(data.score));
    const componentE10 = component_E10(PanelMEGenerate.score2componentE10(data.chart));

    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.maimaiPlayer2CardA1(data.user));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = setSvgBody(svg, 40, 330, componentE1, reg_card_e1);
    svg = setSvgBody(svg, 40, 500, componentE2, reg_card_e1);
    svg = setSvgBody(svg, 40, 770, componentE3, reg_card_e1);
    svg = setSvgBody(svg, 550, 330, componentE4, reg_card_e2);
    svg = setSvgBody(svg, 1280, 330, componentE5, reg_card_e2);
    svg = setSvgBody(svg, 550, 880, componentE6, reg_card_e2);
    svg = setSvgBody(svg, 1390, 330, componentE7, reg_card_e3);
    svg = setSvgBody(svg, 1390, 500, componentE8, reg_card_e3);
    svg = setSvgBody(svg, 1390, 600, componentE9, reg_card_e3);
    svg = setSvgBody(svg, 1390, 770, componentE10, reg_card_e3);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.6);
    svg = setImage(svg, 0, 0, 1920, 330, banner, reg_banner_blurred, 0.8);


    return svg.toString()
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_E1 = (
    data = {
        label: 'Expert',
        difficulty: 10.4,
    }) => {

    // 读取模板
    let svg =
        `   <defs>
            <clipPath id="clippath-OE1-1">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE1-2">
            
            </clipPath>
            <linearGradient id="grad-OE1-3" x1="0%" y1="0" x2="100%" y2="0">
                <stop offset="0%" style="stop-color:rgb(99,174,113); stop-opacity:1" />
                <stop offset="40%" style="stop-color:rgb(136,189,111); stop-opacity:1" />
                <stop offset="60%" style="stop-color:rgb(255,247,103); stop-opacity:1" />
                <stop offset="75%" style="stop-color:rgb(213,110,75); stop-opacity:1" />
                <stop offset="87%" style="stop-color:rgb(146,92,159); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(247,216,254); stop-opacity:1" />
            </linearGradient>
          </defs>
          <g id="Base_OE1">
            <rect id="Base" x="0" y="0" width="490" height="150" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE1-3); fill-opacity: 0.2"/>
          </g>
          <g id="Star_OE1" style="clip-path: url(#clippath-OE1-2);">
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE1-3); fill-opacity: 1"/>
          </g>
          <g id="Text_OE1">
          </g>
          <g id="Overlay_OE1">
          </g>`;

    const reg_text = /(?<=<g id="Text_OE1">)/;
    const reg_difficulty = /(?<=<clipPath id="clippath-OE1-2">)/;

    const difficulty_rrect = PanelDraw.Rect(15, 105, Math.max((Math.min((data?.difficulty / 15), 1) * 460), 20), 30, 15, 'none')

    let circle_text

    switch (data?.label.toUpperCase()) {
        case "RE:MASTER" :
            circle_text = 'object-score-difficulty-remaster.png';
            break;
        case "MASTER" :
            circle_text = 'object-score-difficulty-master.png';
            break;
        case "EXPERT" :
            circle_text = 'object-score-difficulty-expert.png';
            break;
        case "ADVANCED" :
            circle_text = 'object-score-difficulty-advanced.png';
            break;
        case "BASIC" :
            circle_text = 'object-score-difficulty-basic.png';
            break;
    }

    /*
    let level = data?.level || '0'
    const difficulty_b = Math.floor(data?.difficulty || 0);
    let difficulty_m

    if (level.endsWith('+?')) {
        difficulty_m = '+?'
    } else if (level.endsWith('+')) {
        difficulty_m = '+'
    } else if (level.endsWith('?')) {
        difficulty_m = '?'
    } else {
        difficulty_m = '';
    }

     */

    const difficulty = rounds(data?.difficulty, 1)

    const text_arr = [
        {
            font: "poppinsBold",
            text: difficulty.integer,
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: difficulty.decimal,
            size: 48,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: ' / ' + data?.label.toUpperCase(),
            size: 24,
            color: '#fff',
        },
    ]

    const texts = getMultipleTextPath(text_arr, 105, 88, "left baseline");

    const title = poppinsBold.getTextPath('Difficulty', 475, 28, 18, 'right baseline', '#fff')

    svg = setImage(svg, 20, 20, 66, 67, getImageFromV3('Maimai', circle_text), reg_text, 1)
    svg = setText(svg, difficulty_rrect, reg_difficulty)
    svg = setTexts(svg, [texts, title], reg_text);

    return svg;
};

const component_E2 = (
    data = {
        difficulties: [],
        version: 'maimai',
    }) => {

    let svg = `
          <g id="Base_OE2">
          </g>
          <g id="Text_OE2">
          </g>
    `;

    const reg_base = /(?<=<g id="Base_OE2">)/;
    const reg_text = /(?<=<g id="Text_OE2">)/;

    const version = getMaimaiVersionBG(data.version);



    let diffs = ''

    for (const d of data.difficulties) {
        diffs += (d + ' / ')
    }

    diffs = diffs.slice(0, -3)

    const difficulty = poppinsBold.getTextPath(diffs, 475, 28, 18, 'right baseline', '#fff')

    const title = poppinsBold.getTextPath('Version', 15, 28, 18, 'left baseline', '#fff');

    svg = setImage(svg, 58, 42, 370, 185, version, reg_base, 1)

    svg = setText(svg, PanelDraw.Rect(0, 0, 490, 250, 20, '#382e32'), reg_base);

    svg = setTexts(svg, [title, difficulty], reg_text);

    return svg;
};

const component_E3 = (
    data = {

        difficulty: '0',
        distribution: [0],
        combo: [0],
        achievements: 0.0,
        fit: 0.0,
    }) => {
    let svg = `
        <g id="Base_OE3">
        </g>
        <g id="Dist_OE3">
        </g>
        <g id="Combo_OE3">
        </g>
        <g id="Text_OE3">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE3">)/;
    const reg_dist = /(?<=<g id="Dist_OE3">)/;
    const reg_combo = /(?<=<g id="Combo_OE3">)/;
    const reg_base = /(?<=<g id="Base_OE3">)/;

    const title = poppinsBold.getTextPath('Distribution: Lv.' + data?.difficulty, 15, 28, 18, 'left baseline', '#fff');
    const dist_title = poppinsBold.getTextPath('  D     C      B                        A                        S              SS           SSS', 15, 138, 18, 'left baseline', '#fff')
    const combo_title = poppinsBold.getTextPath('  C    FC            AP', 310, 252, 18, 'left baseline', '#fff')
    const acc_title = poppinsBold.getTextPath('Avg. Ach.', 15, 168, 18, 'left baseline', '#fff')
    const level_title = poppinsBold.getTextPath('Dist. Level', 15, 223, 18, 'left baseline', '#fff')

    const dist = PanelDraw.BarChart(data.distribution, null, 0, 15, 40 + 80, 460, 80, 2, 5, RANK_COLORS, 0.1, 0, null, 1)
    const combo = PanelDraw.BarChart(data.combo, null, 0, 310, 155 + 80, 165, 80, 2, 5, COMBO_COLORS, 0.1, 0, null, 1)

    const acc = rounds(data?.achievements, 4)
    const avg_acc = poppinsBold.get2SizeTextPath(acc.integer, acc.decimal + ' %', 48, 30, 300, 190, 'right baseline', '#fff');

    const level = rounds(data?.fit, 2)
    const dist_level = poppinsBold.get2SizeTextPath(level.integer, level.decimal, 48, 30, 300, 245, 'right baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = setTexts(svg, [title, dist_title, combo_title, acc_title, level_title, avg_acc, dist_level], reg_text)
    svg = setText(svg, dist, reg_dist)
    svg = setText(svg, combo, reg_combo)
    svg = setText(svg, rect, reg_base)

    return svg;
}


const component_E4 = (
    data = {
        image: '',
    }) => {
    let svg = `
        <g id="Base_OE4">
        </g>
        <g id="Status_OE4">
        </g>
    `;

    const reg_status = /(?<=<g id="Status_OE4">)/;
    const reg_base = /(?<=<g id="Base_OE4">)/;
    const rect = PanelDraw.Rect(0, 0, 90, 60, 20, '#382e32', 1);

    svg = setImage(svg, 20, 5, 50, 50, data?.image, reg_status, 1);
    svg = setText(svg, rect, reg_base);

    return svg;
}


const component_E5 = (
    data = {
        bpm: 0,
        count: 0,
    }) => {
    let svg = `
        <g id="Base_OE5">
        </g>
        <g id="Text_OE5">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE5">)/;
    const reg_base = /(?<=<g id="Base_OE5">)/;
    const rect = PanelDraw.Rect(0, 0, 90, 60, 20, '#382e32', 1);

    const fav = poppinsBold.getTextPath(data?.bpm.toString(), 78, 25, 16, 'right baseline', '#fff')
    const pc = poppinsBold.getTextPath(round(data?.count, 1, -1), 78, 47, 16, 'right baseline', '#fff')

    svg = setTexts(svg, [fav, pc], reg_text);
    svg = setImage(svg, 12, 10, 18, 16, getImageFromV3('object-beatmap-bpm.png'), reg_text, 1);
    svg = setImage(svg, 12, 32, 18, 18, getImageFromV3('object-beatmap-playcount.png'), reg_text, 1);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E6 = async (
    data = {
        title: '',
        artist: '',
        charter: '',
        id: 0,
        category: '',
    }) => {
    let svg = `   <defs>
            <clipPath id="clippath-OE6-1">
                <rect id="BG_Base" x="0" y="0" width="820" height="160" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            </defs>
        <g id="Base_OE6">
        </g>
        <g id="Background_OE6" style="clip-path: url(#clippath-OE6-1);">
        </g>
        <g id="Labels_OE6">
        </g>
    `;

    const reg_label = /(?<=<g id="Labels_OE6">)/;
    const reg_background = /(?<=<g id="Background_OE6" style="clip-path: url\(#clippath-OE6-1\);">)/;
    const reg_base = /(?<=<g id="Base_OE6">)/;

    const t = getBeatMapTitlePath(
        isASCII(data?.title || '') ? "poppinsBold" : "PuHuiTi",
        isASCII(data?.artist || '') ? "poppinsBold" : "PuHuiTi",
        data?.title || '', data?.artist || '', '', 820 / 2, 55, 98, 48, 24, 820 - 20);

    const diff_text = poppinsBold.cutStringTail(data?.category || '', 30,
        820 - 40 - 10
        - 2 * Math.max(
            poppinsBold.getTextWidth(poppinsBold.cutStringTail(data?.creator || '', 30, 240, true), 24),
            poppinsBold.getTextWidth('b' + (data?.bid || 0), 24)
        ), true)

    const diff = poppinsBold.getTextPath(diff_text, 820 / 2, 142, 30, 'center baseline', '#fff');

    const charter_font = isASCII(data?.charter || '') ? poppinsBold : PuHuiTi
    const charter = charter_font.getTextPath(
        charter_font.cutStringTail(data?.charter || '', 30, 240, true),
        20, 142, 24, 'left baseline', '#fff');
    const bid = poppinsBold.getTextPath((data?.id || 0).toString(), 820 - 20, 142, 24, 'right baseline', '#fff');

    const background = await getMaimaiCover(data?.id);

    const rect = PanelDraw.Rect(0, 0, 820, 160, 20, '#382e32', 1);

    svg = setTexts(svg, [t.title, t.title_unicode, bid, charter, diff], reg_label);
    svg = setImage(svg, 0, 0, 820, 160, background, reg_background, 0.4);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E7 = (
    data = {
        rating: 0.0,
        max: 0.0,
    }) => {

    // 读取模板
    let svg =
        `   <defs>
            <clipPath id="clippath-OE7-1">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-2">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <linearGradient id="grad-OE7-12" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(79,172,254); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(0,242,254); stop-opacity:1" />
            </linearGradient>
          </defs>
          <g id="Base_OE7">
            <rect id="Base" x="0" y="0" width="490" height="150" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE7-12); fill-opacity: 0.2"/>
          </g>
          <g id="Rect_OE7">
            <g id="Clip_OE7-2" style="clip-path: url(#clippath-OE7-2);">
            
            </g>
          </g>
          <g id="Text_OE7">
          </g>`;

    const reg_text = /(?<=<g id="Text_OE7">)/;
    const reg_clip2 = /(?<=<g id="Clip_OE7-2" style="clip-path: url\(#clippath-OE7-2\);">)/;


    let reference_pp_text;
    const max = Math.max(data.rating, data.max);
    const is_perfect = data.rating > (data.max - 1e-4)
    const percent = max > 0 ? data.rating / max : 100

    if (is_perfect) {
        reference_pp_text = ' / PERFECT';
    } else {
        reference_pp_text = ' / ' + max + ' Rating [' + Math.round(percent * 100) + '%]';
    }

    const text_arr = [
        {
            font: "poppinsBold",
            text: data?.rating.toString(),
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: reference_pp_text,
            size: 24,
            color: '#fff',
        },
    ]

    const texts = getMultipleTextPath(text_arr, 20, 88, "left baseline");

    const title = poppinsBold.getTextPath('DX Rating', 475, 28, 18, 'right baseline', '#fff')

    // 保底 PP
    const pp_width = percent * 460;
    const pp_rect = PanelDraw.Rect(15, 105, pp_width, 30, 15, "url(#grad-OE7-12)", 1);
    svg = setText(svg, pp_rect, reg_clip2);

    svg = setTexts(svg, [texts, title], reg_text);

    return svg;
};

const component_E8 = (
    data = {
        combo: '',
        sync: '',
    }) => {
    let svg = `
        <g id="Base_OE8">
        </g>
        <g id="Text_OE8">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE8">)/;
    const reg_base = /(?<=<g id="Base_OE8">)/;

    const rect = PanelDraw.Rect(0, 0, 490, 80, 20, '#382e32', 1);

    let combo;
    switch (data.combo) {
        case 'fc': combo = 'object-score-combo-fullcombo.png'; break;
        case 'fcp': combo = 'object-score-combo-fullcomboplus.png'; break;
        case 'ap': combo = 'object-score-combo-allperfect.png'; break;
        case 'app': combo = 'object-score-combo-allperfectplus.png'; break;
        default: combo = 'object-score-combo-clear.png'; break;
    }

    let sync;
    switch (data.sync) {
        case 'sync': sync = 'object-score-sync-sync.png'; break;
        case 'fs': sync = 'object-score-sync-fullsync.png'; break;
        case 'fsp': sync = 'object-score-sync-fullsyncplus.png'; break;
        case 'fsd': sync = 'object-score-sync-fullsyncdx.png'; break;
        case 'fsdp': sync = 'object-score-sync-fullsyncdxplus.png'; break;
        default: sync = 'object-score-sync-solo.png'; break;
    }

    svg = setImage(svg, 15, 15, 225, 50, getImageFromV3('Maimai', combo), reg_text, 1)
    svg = setImage(svg, 250, 15, 225, 50, getImageFromV3('Maimai', sync), reg_text, 1)
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E9 = (
    data = {
        achievement: 0.0,
        dx: 0,
        max: 0,
    }) => {
    let svg = `
        <g id="Base_OE9">
        </g>
        <g id="Text_OE9">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE9">)/;
    const reg_base = /(?<=<g id="Base_OE9">)/;

    const title = poppinsBold.getTextPath('Achievement', 15, 28, 18, 'left baseline', '#fff');
    const title2 = poppinsBold.getTextPath('DX Score', 15, 98, 18, 'left baseline', '#fff');

    const a = (data?.achievement || 0)

    const achievement_number = rounds(a, 4)
    const achievement = getMultipleTextPath([
            {
                font: 'poppinsBold',
                text: achievement_number.integer,
                size: 60,
            },
            {
                font: 'poppinsBold',
                text: achievement_number.decimal + ' %',
                size: 36
            }
        ],
        470, 62, 'right baseline')

    const combo = getMultipleTextPath([
            {
                font: 'poppinsBold',
                text: data?.dx || 0,
                size: 60,
            },
            {
                font: 'poppinsBold',
                text: ' / ' + data?.max || 0,
                size: 36,
            }
        ],
        470, 132, 'right baseline')

    const rect = PanelDraw.Rect(0, 0, 490, 150, 20, '#382e32', 1);

    svg = setTexts(svg, [title, title2, achievement, combo], reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E10 = (
    data = {

        distribution: '0',
        combo: '0',
        achievements: 0.0,
        dx: 0,
    }) => {
    let svg = `
        <g id="Base_OE10">
        </g>
        <g id="Dist_OE10">
        </g>
        <g id="Combo_OE10">
        </g>
        <g id="Text_OE10">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE10">)/;
    const reg_dist = /(?<=<g id="Dist_OE10">)/;
    const reg_combo = /(?<=<g id="Combo_OE10">)/;
    const reg_base = /(?<=<g id="Base_OE10">)/;

    const title = poppinsBold.getTextPath('Distribution: this song', 15, 28, 18, 'left baseline', '#fff');
    const dist_title = poppinsBold.getTextPath('  D     C      B                        A                        S              SS           SSS', 15, 138, 18, 'left baseline', '#fff')
    const combo_title = poppinsBold.getTextPath('  C    FC            AP', 310, 252, 18, 'left baseline', '#fff')
    const acc_title = poppinsBold.getTextPath('Avg. Ach.', 15, 168, 18, 'left baseline', '#fff')
    const level_title = poppinsBold.getTextPath('Avg. DX Score', 15, 223, 18, 'left baseline', '#fff')

    const dist = PanelDraw.BarChart(data.distribution, null, 0, 15, 40 + 80, 460, 80, 2, 5, RANK_COLORS, 0.1, 0, null, 1)
    const combo = PanelDraw.BarChart(data.combo, null, 0, 310, 155 + 80, 165, 80, 2, 5, COMBO_COLORS, 0.1, 0, null, 1)

    const acc = rounds(data?.achievements, 4)
    const avg_acc = poppinsBold.get2SizeTextPath(acc.integer, acc.decimal + ' %', 48, 30, 300, 190, 'right baseline', '#fff');

    const avg_dx = poppinsBold.getTextPath(Math.floor(data?.dx).toString(), 300, 245, 48, 'right baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = setTexts(svg, [title, dist_title, combo_title, acc_title, level_title, avg_acc, avg_dx], reg_text)
    svg = setText(svg, dist, reg_dist)
    svg = setText(svg, combo, reg_combo)
    svg = setText(svg, rect, reg_base)

    return svg;
}

const PanelMEGenerate = {
    score2componentE1: (score) => {

        return {
            label: score.level_label,
            difficulty: score.ds,
        }
    },

    score2componentE2: (song) => {
        return {
            difficulties: song.level,
            version: song.basic_info.from,
        }
    },

    score2componentE3: (diff, difficulty = '', fit = 0.0) => {
        return {
            difficulty: difficulty,
            distribution: diff.dist,
            combo: diff.fc_dist,
            achievements: diff.achievements,
            fit: fit,
        }
    },

    score2componentE4: (type) => {
        return {
            image: getMaimaiType(type),
        }
    },

    score2componentE5: (bpm, count) => {
        return {
            bpm: bpm,
            count: count,
        }
    },

    score2componentE6: (song, index) => {
        return {
            title: song.basic_info.title,
            artist: song.basic_info.artist,
            charter: song.charts[index].charter,
            id: song.id,
            category: getMaimaiCategory(song?.basic_info?.genre),
        }
    },

    score2componentE7: (score) => {
        return {
            rating: score?.ra || 0,
            max: getMaimaiMaximumRating(score?.ds),
        }
    },

    score2componentE8: (score) => {
        return {
            combo: score.fc,
            sync: score.fs,
        }
    },

    score2componentE9: (score) => {
        return {
            achievement: score.achievements,
            dx: score.dxScore,
            max: score.max,
        }
    },

    score2componentE10: (chart) => {
        return {
            distribution: chart.dist,
            combo: chart.fc_dist,
            achievements: chart.avg,
            dx: chart.avg_dx,
        }
    },
}
