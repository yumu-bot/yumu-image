import {
    exportJPEG, getBeatMapTitlePath, getDecimals, getImageFromV3,
    getPanelNameSVG, getRoundedNumberStr, implantImage,
    implantSvgBody, isASCII, readNetImage,
    readTemplate,
    replaceText, replaceTexts
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMultipleTextPath, poppinsBold, PuHuiTi} from "../util/font.js";
import fs from "fs";

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
        "additional": 704
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
    svg = replaceText(svg, getPanelNameSVG('maimai Best Performance (!ymmb)', 'MB', 'v0.4.1 SE'), reg_index);

    // 评级
    svg = implantImage(svg, 590, 590, 665, 290, 1, getImageFromV3(`Maimai/object-score-${data?.score?.rate || 'D'}.png`), reg_index);

    // 图片定义
    const background = getMaimaiBG(data.score.rate);
    const banner = await getMaimaiSongBG(data.song.id);
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
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = implantSvgBody(svg, 40, 330, componentE1, reg_card_e1);
    svg = implantSvgBody(svg, 40, 500, componentE2, reg_card_e1);
    svg = implantSvgBody(svg, 40, 770, componentE3, reg_card_e1);
    svg = implantSvgBody(svg, 550, 330, componentE4, reg_card_e2);
    svg = implantSvgBody(svg, 1280, 330, componentE5, reg_card_e2);
    svg = implantSvgBody(svg, 550, 880, componentE6, reg_card_e2);
    svg = implantSvgBody(svg, 1390, 330, componentE7, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 500, componentE8, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 600, componentE9, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 770, componentE10, reg_card_e3);

    // 导入图片
    svg = implantImage(svg, 1920, 1080, 0, 0, 0.6, background, reg_background);
    svg = implantImage(svg, 1920, 330, 0, 0, 0.8, banner, reg_banner_blurred);


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

    const text_arr = [
        {
            font: "poppinsBold",
            text: getDecimals(data?.difficulty, 2),
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: getDecimals(data?.difficulty, 4),
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

    svg = implantImage(svg, 66, 67, 20, 20, 1, getImageFromV3('Maimai/' + circle_text), reg_text)
    svg = replaceText(svg, difficulty_rrect, reg_difficulty)
    svg = replaceTexts(svg, [texts, title], reg_text);

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

    let version;

    switch (data?.version) {
        case "maimai":
            version = 'object-version-maimai.png';
            break;
        case "maimai PLUS":
            version = 'object-version-maimai-plus.png';
            break;
        case "maimai GreeN":
            version = 'object-version-maimai-green.png';
            break;
        case "maimai GreeN PLUS":
            version = 'object-version-maimai-green-plus.png';
            break;
        case "maimai ORANGE":
            version = 'object-version-maimai-orange.png';
            break;
        case "maimai ORANGE PLUS":
            version = 'object-version-maimai-orange-plus.png';
            break;
        case "maimai PiNK":
            version = 'object-version-maimai-pink.png';
            break;
        case "maimai PiNK PLUS":
            version = 'object-version-maimai-pink-plus.png';
            break;
        case "maimai MURASAKi":
            version = 'object-version-maimai-murasaki.png';
            break;
        case "maimai MURASAKi PLUS":
            version = 'object-version-maimai-murasaki-plus.png';
            break;
        case "maimai MiLK":
            version = 'object-version-maimai-murasaki.png';
            break;
        case "MiLK PLUS":
            version = 'object-version-maimai-murasaki-plus.png';
            break;
        case "maimai FiNALE":
        case "maimai でらっくす":
            version = 'object-version-maimai-dx.png';
            break;
        case "maimai でらっくす PLUS":
            version = 'object-version-maimai-dx-plus.png';
            break;
        case "maimai でらっくす Splash":
            version = 'object-version-maimai-dx-splash.png';
            break;
        case "maimai でらっくす Splash PLUS":
            version = 'object-version-maimai-dx-splash-plus.png';
            break;
        case "maimai でらっくす UNiVERSE":
            version = 'object-version-maimai-dx-universe.png';
            break;
        case "maimai でらっくす UNiVERSE PLUS":
            version = 'object-version-maimai-dx-universe-plus.png';
            break;
        case "maimai でらっくす FESTiVAL":
            version = 'object-version-maimai-dx-festival.png';
            break;
        case "maimai でらっくす FESTiVAL PLUS":
            version = 'object-version-maimai-dx-festival-plus.png';
            break;
        case "maimai でらっくす BUDDiES":
            version = 'object-version-maimai-dx-buddies.png';
            break;
        case "maimai でらっくす BUDDiES PLUS":
            version = 'object-version-maimai-dx-buddies-plus.png';
            break;
        case "maimai でらっくす PRiSM":
            version = 'object-version-maimai-dx-prism.png';
            break;
        case "maimai でらっくす PRiSM PLUS":
            version = 'object-version-maimai-dx-prism-plus.png';
            break;
    }

    let diffs = ''

    for (const d of data.difficulties) {
        diffs += (d + ' / ')
    }

    diffs = diffs.slice(0, -3)

    const difficulty = poppinsBold.getTextPath(diffs, 475, 28, 18, 'right baseline', '#fff')

    const title = poppinsBold.getTextPath('Version', 15, 28, 18, 'left baseline', '#fff');

    svg = implantImage(svg, 370, 185, 58, 42, 1, getImageFromV3('Maimai/' + version), reg_base)

    svg = replaceText(svg, PanelDraw.Rect(0, 0, 490, 250, 20, '#382e32'), reg_base);

    svg = replaceTexts(svg, [title, difficulty], reg_text);

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

    const acc = (Math.round(data?.achievements * 10000) / 10000).toString()
    const avg_acc = poppinsBold.get2SizeTextPath(getDigit(acc, 4).b, getDigit(acc, 4).m + ' %', 48, 30, 300, 190, 'right baseline', '#fff');

    const level = (Math.round(data?.fit * 100) / 100).toString()
    const dist_level = poppinsBold.get2SizeTextPath(getDigit(level, 2).b, getDigit(level, 2).m, 48, 30, 300, 245, 'right baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = replaceTexts(svg, [title, dist_title, combo_title, acc_title, level_title, avg_acc, dist_level], reg_text)
    svg = replaceText(svg, dist, reg_dist)
    svg = replaceText(svg, combo, reg_combo)
    svg = replaceText(svg, rect, reg_base)

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

    svg = implantImage(svg, 50, 50, 20, 5, 1, data?.image, reg_status);
    svg = replaceText(svg, rect, reg_base);

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
    const pc = poppinsBold.getTextPath(getRoundedNumberStr(data?.count, 1), 78, 47, 16, 'right baseline', '#fff')

    svg = replaceTexts(svg, [fav, pc], reg_text);
    svg = implantImage(svg, 18, 16, 12, 10, 1, getImageFromV3('object-beatmap-bpm.png'), reg_text);
    svg = implantImage(svg, 18, 18, 12, 32, 1, getImageFromV3('object-beatmap-playcount.png'), reg_text);
    svg = replaceText(svg, rect, reg_base);

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

    const background = await getMaimaiSongBG(data?.id);

    const rect = PanelDraw.Rect(0, 0, 820, 160, 20, '#382e32', 1);

    svg = replaceTexts(svg, [t.title, t.title_unicode, bid, charter, diff], reg_label);
    svg = implantImage(svg, 820, 160, 0, 0, 0.6, background, reg_background);
    svg = replaceText(svg, rect, reg_base);

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
    const is_perfect = data.rating >= data.max
    const percent = max > 0 ? data.rating / max : 0

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
    svg = replaceText(svg, pp_rect, reg_clip2);

    svg = replaceTexts(svg, [texts, title], reg_text);

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

    svg = implantImage(svg, 225, 50, 15, 15, 1, getImageFromV3('Maimai/' + combo), reg_text)
    svg = implantImage(svg, 225, 50, 250, 15, 1, getImageFromV3('Maimai/' + sync), reg_text)
    svg = replaceText(svg, rect, reg_base);

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

    const achievement = getMultipleTextPath([
            {
                font: 'poppinsBold',
                text: getDigit(a, 4).b,
                size: 60,
            },
            {
                font: 'poppinsBold',
                text: getDigit(a, 4).m + ' %',
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

    svg = replaceTexts(svg, [title, title2, achievement, combo], reg_text);
    svg = replaceText(svg, rect, reg_base);

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

    const acc = (Math.round(data?.achievements * 10000) / 10000).toString()
    const avg_acc = poppinsBold.get2SizeTextPath(getDigit(acc, 4).b, getDigit(acc, 4).m + ' %', 48, 30, 300, 190, 'right baseline', '#fff');

    const avg_dx = poppinsBold.getTextPath(Math.floor(data?.dx).toString(), 300, 245, 48, 'right baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = replaceTexts(svg, [title, dist_title, combo_title, acc_title, level_title, avg_acc, avg_dx], reg_text)
    svg = replaceText(svg, dist, reg_dist)
    svg = replaceText(svg, combo, reg_combo)
    svg = replaceText(svg, rect, reg_base)

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
        let image;
        switch (type) {
            case 'DX':
                image = getImageFromV3('Maimai/object-type-deluxe.png');
                break;
            case 'SD':
                image = getImageFromV3('Maimai/object-type-standard.png');
                break;
            default :
                image = '';
                break;
        }

        return {
            image: image,
        }
    },

    score2componentE5: (bpm, count) => {
        return {
            bpm: bpm,
            count: count,
        }
    },

    score2componentE6: (song, index) => {
        let category

        switch (song.basic_info.genre) {
            case "东方Project":
                category = "Touhou Project";
                break;
            case "舞萌":
                category = "maimai";
                break;
            case "niconico & VOCALOID":
                category = "niconico & VOCALOID";
                break;
            case "流行&动漫":
                category = "POPS & ANIME";
                break;
            case "其他游戏":
                category = "GAME & VARIETY";
                break;
            case "音击&中二节奏":
                category = "Ongeki & CHUNITHM";
                break;
            default:
                category = "";
                break;
        }

        return {
            title: song.basic_info.title,
            artist: song.basic_info.artist,
            charter: song.charts[index].charter,
            id: song.id,
            category: category,
        }
    },

    score2componentE7: (score) => {
        return {
            rating: score?.ra || 0,
            max: Math.floor(score.ds * 1.05 * 22.4),
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

function getMaimaiBG(rank) {
    let out;

    switch (rank) {
        case 'sssp':
        case 'sss':
            out = 'object-score-backimage-SSS.jpg';
            break;
        case 'ssp':
        case 'ss':
            out = 'object-score-backimage-X.jpg';
            break;
        case 'sp':
        case 's':
            out = 'object-score-backimage-S.jpg';
            break;
        case 'aaa':
        case 'aa':
        case 'a':
            out = 'object-score-backimage-D.jpg';
            break;
        case 'bbb':
        case 'bb':
        case 'b':
            out = 'object-score-backimage-B.jpg';
            break;
        case 'c':
            out = 'object-score-backimage-A.jpg';
            break;
        case 'd':
            out = 'object-score-backimage-F.jpg';
            break;
        default:
            out = 'object-score-backimage-SH.jpg';
            break;
    }

    return getImageFromV3(out)
}

async function getMaimaiSongBG(song_id = 0) {
    if (typeof song_id == "number" && fs.existsSync(getImageFromV3('Maimai/' + song_id + '.png'))) {
        return getImageFromV3('Maimai/' + song_id + '.png')
    } else {
        let id;

        if (song_id == null) {
            id = 1;
        } else if (song_id === 1235) {
            id = song_id + 10000; // 这是水鱼的 bug，不关我们的事
        } else if (song_id > 10000 && song_id < 11000) {
            id = song_id - 10000;
        } else {
            id = song_id;
        }
        return await readNetImage('https://www.diving-fish.com/covers/' + id.toString().padStart(5, '0') + '.png', true, getImageFromV3('Maimai/00000.png'))
    }
}

function getDigit(achievement = 0.0, digit = 4) {
    const b = Math.floor(achievement)
    const m = Math.round((achievement - b) * Math.pow(10, digit))
    let m_str

    if (m !== 0) {
        m_str = '.' + m.toString().padStart(digit, '0')
    } else {
        m_str = ''
    }

    return {
        b: b.toString(),
        m: m_str
    }
}