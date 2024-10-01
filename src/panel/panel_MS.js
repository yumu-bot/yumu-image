import {
    exportJPEG, getImageFromV3, getPanelNameSVG, getRoundedNumberStr, implantImage,
    implantSvgBody, isNotEmptyArray, isNotNull, isNotNullOrEmptyObject, readTemplate,
    replaceText, replaceTexts
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {
    getMaimaiBannerIndex,
    getMaimaiCover, getMaimaiDifficulty, getMaimaiDifficultyColors,
    getMaimaiRankBG,
    getMaimaiType,
} from "../util/maimai.js";
import {PanelDraw} from "../util/panelDraw.js";
import {poppinsBold} from "../util/font.js";
import {card_G} from "../card/card_G.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MS(data);
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
        const svg = await panel_MS(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * maimai 歌曲成绩。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MS(data = {
    songs: [{
        "id": "319",
        "title": "幻想のサテライト",
        "type": "SD",
        "ds": [
            4.0,
            8.1,
            11.3,
            14.0
        ],
        "level": [
            "4",
            "8",
            "11",
            "14"
        ],
        "cids": [
            800,
            801,
            802,
            803
        ],
        "charts": [
            {
                "notes": [
                    128,
                    13,
                    5,
                    11
                ],
                "charter": "-"
            },
            {
                "notes": [
                    351,
                    6,
                    7,
                    4
                ],
                "charter": "-"
            },
            {
                "notes": [
                    386,
                    36,
                    23,
                    36
                ],
                "charter": "mai-Star"
            },
            {
                "notes": [
                    621,
                    41,
                    169,
                    19
                ],
                "charter": "はっぴー"
            }
        ],
        "basic_info": {
            "title": "幻想のサテライト",
            "artist": "豚乙女",
            "genre": "东方Project",
            "bpm": 230,
            "release": "",
            "version": "maimai GreeN PLUS",
            "current": false
        }
    }, {
        id: 0,
        // 第一个是 SD，第二个是 DX
    }],

    // 从 ra 大往小排
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

    panel: "MS"
}) {
    let svg = readTemplate('template/Panel_MS.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a2 = /(?<=<g id="CardA2">)/;
    let reg_card_g = /(?<=<g id="CardG">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MS1-1\);">)/;

    // 面板文字
    let panel_name = getPanelNameSVG('Maimai Song Info (!ymms)', 'MS', 'v0.4.1 SE');


    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入 G 卡
    const songs = data?.songs || []

    let standard = null
    let deluxe = null

    for (let o of songs) {
        if (isNotNull(o?.type)) {
            switch (o.type) {
                case 'SD': {
                    standard = o
                    break
                }
                case 'DX': {
                    deluxe = o
                    break
                }
            }
        }
    }

    const has_standard = isNotNull(standard)
    const has_deluxe = isNotNull(deluxe)

    const scores = data?.scores || []
    let has_standard_score = false
    let has_deluxe_score = false

    for (let s in scores) {
        if (isNotNullOrEmptyObject(s)) {
            if (s?.type === "DX") {
                has_standard_score = true
            }
            if (s?.type === "SD") {
                has_deluxe_score = true
            }
        }
    }
    const single_song = has_deluxe ? deluxe : (has_standard ? standard : null)

    const is_multiple_version_score = (has_standard_score && has_deluxe_score)
    const is_too_much_score = scores.length > 5
    const is_too_much_chart = (has_standard && standard.ds?.length > 5) || (has_deluxe && deluxe.ds?.length > 5)

    let card_Gs

    if (is_multiple_version_score || is_too_much_score || is_too_much_chart) {
        card_Gs = applyMultipleVersion(standard, deluxe, scores)
    } else {
        card_Gs = applySingleVersion(single_song, scores)
    }

    // 渲染卡片
    const length = card_Gs?.length || 1
    const interval = (length === 5) ? 12 : 20
    const x = 1920 / 2 + interval / 2 - (interval + 350) * length

    if (isNotEmptyArray(card_Gs)) {
        for (const i in card_Gs) {
            const v = card_Gs[i]
            svg = implantSvgBody(svg, x, 330, v, reg_card_g)
        }
    }

    // 导入 A2 卡
    const cardA2 = await card_A2(await PanelGenerate.maimaiSong2CardA2(single_song, has_deluxe, has_standard));

    // 插入卡片
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_card_a2);

    // 导入图片
    svg = implantImage(svg, 1920, 330, 0, 0, 0.8, getRandomBannerPath("maimai", getMaimaiBannerIndex(single_song)), reg_banner);

    return svg.toString()
}

// 歌曲只有一个版本，只有一个版本有成绩
// 成绩会补充至 5 个。以歌曲为准。
async function applySingleVersion(song = {}, scores = [{}]) {
    let card_Gs = []

    // 统计卡片

    for (const i in song?.level) {
        const v = song?.ds[i]

        let score
        for (const s of scores) {
            if (s.type === song.type && s.ds === v) {
                score = s
                break
            }
        }

        card_Gs.push(
            card_G(await maiScore2CardG(song, parseInt(i), score))
        )
    }

    return card_Gs

}

// 歌曲有多个版本，或者多个版本、> 5 个难度有成绩
// 会显示最高的 5 个成绩，亦或是显示最高的几个难度
function applyMultipleVersion(standard = {}, deluxe = {}, score = {}) {

}

async function maiScore2CardG(song = {
    "id": "319",
    "title": "幻想のサテライト",
    "type": "SD",
    "ds": [
        4.0,
        8.1,
        11.3,
        14.0
    ],
    "level": [
        "4",
        "8",
        "11",
        "14"
    ],
    "cids": [
        800,
        801,
        802,
        803
    ],
    "charts": [
        {
            "notes": [
                128,
                13,
                5,
                11
            ],
            "charter": "-"
        },
        {
            "notes": [
                351,
                6,
                7,
                4
            ],
            "charter": "-"
        },
        {
            "notes": [
                386,
                36,
                23,
                36
            ],
            "charter": "mai-Star"
        },
        {
            "notes": [
                621,
                41,
                169,
                19
            ],
            "charter": "はっぴー"
        }
    ],
    "basic_info": {
        "title": "幻想のサテライト",
        "artist": "豚乙女",
        "genre": "东方Project",
        "bpm": 230,
        "release": "",
        "version": "maimai GreeN PLUS",
        "current": false
    }
}, index = 0, score = {
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
    const has_score = isNotNullOrEmptyObject(score)

    const background = getMaimaiRankBG(score?.rate || 'd')
    const cover = await getMaimaiCover(song?.song_id || 0)
    const type = getMaimaiType(song?.type)

    let combo;
    switch (score?.fc) {
        case 'fc':
            combo = 'object-icon-combo-fullcombo.png';
            break;
        case 'fcp':
            combo = 'object-icon-combo-fullcomboplus.png';
            break;
        case 'ap':
            combo = 'object-icon-combo-allperfect.png';
            break;
        case 'app':
            combo = 'object-icon-combo-allperfectplus.png';
            break;
        default:
            combo = 'object-icon-combo-clear.png';
            break;
    }
    combo = getImageFromV3('Maimai', combo)

    let sync;
    switch (score?.fs) {
        // case 'sync': sync = 'object-icon-sync-sync.png'; break;
        case 'fs':
            sync = 'object-icon-sync-fullsync.png';
            break;
        case 'fsp':
            sync = 'object-icon-sync-fullsyncplus.png';
            break;
        case 'fsd':
            sync = 'object-icon-sync-fullsyncdx.png';
            break;
        case 'fsdp':
            sync = 'object-icon-sync-fullsyncdxplus.png';
            break;
        default:
            sync = 'object-icon-sync-solo.png';
            break;
    }
    sync = getImageFromV3('Maimai', sync)

    const stars = getDXRatingStars(score?.dxScore, score?.max)
    const label1 = getMaimaiDifficulty(index)
    const label2 = song?.ds[index]
    const diff_colors = getMaimaiDifficultyColors(index)

    const component = component_G1(song?.notes, score?.achievements || 0)

    return {
        background: background,
        cover: cover,
        type: type, //dx 图片
        icon1: combo,
        icon2: sync,
        icon3: stars, //dx 星星

        label1: label1,
        label1_size: 36,
        label1_color1: diff_colors.color1,
        label1_color2: diff_colors.color2,

        label2: label2,
        label2_size: 48,
        label2_color1: diff_colors.color1,
        label2_color2: diff_colors.color2,

        left: 'Charter:',
        right: '',

        title1: '',

        main_b: '',
        main_m: '',
        main_b_size: 60,
        main_m_size: 36,

        additional_b: '',
        additional_m: '',
        additional_b_size: 24,
        additional_m_size: 14,

        rrect1_percent: 0,
        rrect1_color1: '',
        rrect1_color2: '',

        component: component
    }
}

const component_G1 = (notes = [], achievement = 0) => {
    let svg = `
        <g id="Icon_LG1">
        </g>
        <g id="Text_LG1">
        </g>
    `;

    const reg_icon = /<g id="Icon_LG1">/
    const reg_text = /<g id="Text_LG1">/

    const achievement_text = achievement > 0 ? (((achievement >= 100) ? '+' : '-') + getRoundedNumberStr(Math.abs(achievement - 100), 4) + ' %') : '-'

    const title = poppinsBold.getTextPath('Notes', 10, 20, 18, 'left baseline', '#fff')
    const acc = poppinsBold.getTextPath(achievement_text, 280, 20, 18, 'right baseline', '#fff')

    svg = implantImage(svg, 40, 25, 80 + 7, 30, 1,
        getImageFromV3('Maimai', 'object-note-tap.png'), reg_icon)
    svg = implantImage(svg, 40, 25, 80 + 7 + 54, 30, 1,
        getImageFromV3('Maimai', 'object-note-hold.png'), reg_icon)
    svg = implantImage(svg, 40, 25, 80 + 7 + 108, 30, 1,
        getImageFromV3('Maimai', 'object-note-slide.png'), reg_icon)
    svg = implantImage(svg, 40, 25, 80 + 7 + 162, 30, 1,
        getImageFromV3('Maimai', 'object-note-touch.png'), reg_icon)
    svg = implantImage(svg, 40, 25, 80 + 7 + 216, 30, 1,
        getImageFromV3('Maimai', 'object-note-break.png'), reg_icon)

    svg = implantImage(svg, 100, 25, 80 + 7, 30, 1,
        getImageFromV3('Maimai', 'object-note-break-critical.png'), reg_icon)
    svg = implantImage(svg, 100, 25, 80 + 7 + 54, 30, 1,
        getImageFromV3('Maimai', 'object-note-break-perfect.png'), reg_icon)
    svg = implantImage(svg, 100, 25, 80 + 7 + 108, 30, 1,
        getImageFromV3('Maimai', 'object-note-break-great.png'), reg_icon)
    svg = implantImage(svg, 100, 25, 80 + 7 + 162, 30, 1,
        getImageFromV3('Maimai', 'object-note-break-good.png'), reg_icon)
    svg = implantImage(svg, 100, 25, 80 + 7 + 216, 30, 1,
        getImageFromV3('Maimai', 'object-note-break-miss.png'), reg_icon)

    svg = implantImage(svg, 150, 25, 80 + 7, 30, 1,
        getImageFromV3('Maimai', 'object-note-tap-great.png'), reg_icon)
    svg = implantImage(svg, 150, 25, 80 + 7 + 162, 30, 1,
        getImageFromV3('Maimai', 'object-note-tap-good.png'), reg_icon)
    svg = implantImage(svg, 150, 25, 80 + 7 + 216, 30, 1,
        getImageFromV3('Maimai', 'object-note-tap-miss.png'), reg_icon)


    svg = replaceTexts(svg, [title, acc], reg_text)

    return svg.toString()
}

// 锚点在右下角
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
        PanelDraw.Diamond(-12, -12, 12, 12, color),
        PanelDraw.Diamond(-12 - 15, -12, 12, 12, color),
        PanelDraw.Diamond(-12 - 30, -12, 12, 12, color),
        PanelDraw.Diamond(-12 - 45, -12, 12, 12, color),
        PanelDraw.Diamond(-12 - 60, -12, 12, 12, color),
    ]

    let out = '';

    for (let i = 0; i < level; i++) {
        out += diamonds[i];
    }

    return out;
}

