import {
    exportJPEG,
    getImageFromV3,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    isNotEmptyArray,
    isNotNull,
    isNotNullOrEmptyObject,
    readTemplate,
    setText,
    setTexts, rounds
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {
    getMaimaiBannerIndex,
    getMaimaiCover, getMaimaiDifficultyName, getMaimaiDifficultyColors, getMaimaiMaximumRating,
    getMaimaiRankBG,
    getMaimaiType, isMaimaiMaximumRating, getMaimaiDXStarLevel, getMaimaiDXStarColor,
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
        "alias": "幻想的卫星",
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

    panel: "MS",
    percent: "" // 0+ 100+ 101- 默认 100+
}) {
    let svg = readTemplate('template/Panel_MS.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a2 = /(?<=<g id="CardA2">)/;
    let reg_card_g = /(?<=<g id="CardG">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MS1-1\);">)/;

    // 面板文字
    let panel_name = getPanelNameSVG('Maimai Song Info (!ymms)', 'MS', 'v0.5.0 DX');


    // 插入文字
    svg = setText(svg, panel_name, reg_index);

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

    card_Gs = await applySingleVersion(single_song, scores)
    // TODO 多成绩先不做
    /*

    if (is_multiple_version_score || is_too_much_score || is_too_much_chart) {
        card_Gs = await applyMultipleVersion(standard, deluxe, scores)
    } else {
        card_Gs = await applySingleVersion(single_song, scores)
    }

     */

    // 渲染卡片
    const length = card_Gs?.length || 1
    const interval = (length === 5) ? 22 : 30
    const x = (1920 + interval - (interval + 350) * length) / 2

    if (isNotEmptyArray(card_Gs)) {
        for (const i in card_Gs) {
            const v = card_Gs[i]
            svg = setSvgBody(svg, x + i * (interval + 350), 330, v, reg_card_g)
        }
    }

    // 导入 A2 卡
    const cardA2 = card_A2(await PanelGenerate.maimaiSong2CardA2(single_song, has_deluxe, has_standard));

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA2, reg_card_a2);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 330, getRandomBannerPath("maimai", getMaimaiBannerIndex(single_song)), reg_banner, 0.8);

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

// 歌曲有多个版本，或者多个版本，> 5 个难度有成绩
// 会显示最高的 5 个成绩，亦或是显示最高的几个难度
function applyMultipleVersion(standard = {}, deluxe = {}, score = {}) {

}

async function maiScore2CardG(song = {}, index = 0, score = {}) {
    const has_score = score?.ra > 0

    const background = getMaimaiRankBG(score?.rate || 'd')
    const cover = await getMaimaiCover(song?.id || 0)
    const overlay = score?.rate === "sssp" ? getImageFromV3('avatar-foil.png') : ''

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
        case 'sync': sync = 'object-icon-sync-sync.png'; break;
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

    const rank = has_score ? getImageFromV3('Maimai', `object-score-${score?.rate || 'd'}2.png`) : ''

    const difficulty_name = getMaimaiDifficultyName(index)
    const difficulty = song?.ds[index]
    const diff_colors = getMaimaiDifficultyColors(index)

    const achievements = score?.achievements?.toFixed(4) || '0.0000' // rounds(score?.achievements, 4)

    const main_b = has_score ? achievements.slice(0, -3) : '-'
    const main_m = has_score ? achievements.slice(-3) : ''
    const main_l = has_score ? '%' : ''

    const rating = score?.ra || 0
    const max_rating = getMaimaiMaximumRating(difficulty)

    const additional_b = has_score ? rating.toString() : ''
    const additional_m = has_score ? (isMaimaiMaximumRating(rating, difficulty) ? '' : ' [' + max_rating + ']') : '[' + max_rating + ']'

    const div = (score?.dxScore || 0) / (score?.max || 1)

    let rrect1_color1
    let rrect1_color2
    let percent
    let rrect1_base_opacity = 0.3

    if (div >= 0.97) {
        rrect1_color1 = '#F7B551'
        rrect1_color2 = '#FFF45C'
        percent = (1 - div) / 0.03
    } else if (div >= 0.95) {
        rrect1_color1 = '#FF554E'
        rrect1_color2 = '#FAD129'
        percent = (0.97 - div) / 0.02
    } else if (div >= 0.93) {
        rrect1_color1 = '#FF554E'
        rrect1_color2 = '#F28D29'
        percent = (0.95 - div) / 0.02
    } else if (div >= 0.9) {
        rrect1_color1 = '#F0EF47'
        rrect1_color2 = '#26D94F'
        percent = (0.93 - div) / 0.02
    } else if (div >= 0.85) {
        rrect1_color1 = '#38F8D4'
        rrect1_color2 = '#43EB81'
        percent = (0.9 - div) / 0.05
    } else if (div > 0) {
        rrect1_color1 = '#4facfe'
        rrect1_color2 = '#00f2fe'
        percent = div / 0.85
        rrect1_base_opacity = 0.1
    } else {
        rrect1_color1 = '#4facfe'
        rrect1_color2 = '#00f2fe'
        percent = rating / max_rating
        rrect1_base_opacity = 0.1
    }

    const stars = drawStars(score?.dxScore, score?.max)
    const component = component_G1(song?.charts[index]?.notes, score?.achievements)

    return {
        background: background,
        cover: cover,
        overlay : overlay,
        type: type, //dx 图片
        icon1: combo,
        icon2: sync,
        icon3: rank,

        label1: difficulty_name,
        label1_size: 36,
        label1_color1: diff_colors.color1,
        label1_color2: diff_colors.color2,

        label2: difficulty,
        label2_size: 48,
        label2_color1: diff_colors.color1,
        label2_color2: diff_colors.color2,

        left: 'Charter:',
        right: song?.charts[index]?.charter || '-',

        title: 'Achievements',

        main_b: main_b,
        main_m: main_m,
        main_l: main_l,
        main_b_size: 56,
        main_m_size: 36,
        main_l_size: 24,

        additional_b: additional_b,
        additional_m: additional_m,
        additional_b_size: 24,
        additional_m_size: 14,

        rrect1_percent: percent,
        rrect1_color1: rrect1_color1,
        rrect1_color2: rrect1_color2,
        rrect1_base_opacity: rrect1_base_opacity,

        stars: stars, //dx 星星
        component: component
    }
}

const component_G1 = (notes = { tap: 472, hold: 65, slide: 69, touch: 26, break_: 26 }, achievements = 0) => {
    let svg = `
        <g id="Base_LG1">
        </g>
        <g id="Icon_LG1">
        </g>
        <g id="Text_LG1">
        </g>
    `;
    const note = notes || []
    // const sum = ((note?.tap + note?.hold + note?.slide + note?.break_ + note?.touch) || -1)
    const base_score_sum = (note?.tap + 2 * note?.hold + 3 * note?.slide + 5 * note?.break_ + note?.touch) || -1

    const reg_base = /(?<=<g id="Base_LG1">)/
    const reg_icon = /(?<=<g id="Icon_LG1">)/
    const reg_text = /(?<=<g id="Text_LG1">)/

    // const dx_text = (sum > 0 ? ('DX Score: ' + sum * 3) : '-')
    // const dx = poppinsBold.getTextPath(dx_text, 280, 20, 14, 'right baseline', '#fff')

    const title = poppinsBold.getTextPath('Notes & Tolerance', 10, 20, 14, 'left baseline', '#fff')

    const equivalent_text = (achievements > 0 ?
        ('≈ ' + getApproximateGreatString((101 - achievements) / 100 / (0.2 / base_score_sum), 1) + ' GR')
        : '-')
    const equivalent = poppinsBold.getTextPath(equivalent_text, 280, 20, 14, 'right baseline', '#fff')

    svg = setImage(svg, 10 + 7, 30, 40, 25, getImageFromV3('Maimai', 'object-note-tap.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 7 + 54, 30, 40, 25, getImageFromV3('Maimai', 'object-note-hold.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 7 + 108, 30, 40, 25, getImageFromV3('Maimai', 'object-note-slide.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 7 + 162, 30, 40, 25, getImageFromV3('Maimai', 'object-note-touch.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 7 + 216, 30, 40, 25, getImageFromV3('Maimai', 'object-note-break.png'), reg_icon, 1)

    svg = setImage(svg, 10 + 3 + 3.5, 95 + 3, 47 - 7, 25 - 6, getImageFromV3('Maimai', 'object-score-sp2.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 3 + 54, 95, 47, 25, getImageFromV3('Maimai', 'object-score-ss2.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 3 + 108, 95, 47, 25, getImageFromV3('Maimai', 'object-score-ssp2.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 3 + 162, 95, 47, 25, getImageFromV3('Maimai', 'object-score-sss2.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 3 + 216, 95, 47, 25, getImageFromV3('Maimai', 'object-score-sssp2.png'), reg_icon, 1)

    const s3p_loss = poppinsBold.getTextPath('<' + getApproximateGreatString((1.01 - 0.98) * base_score_sum / 0.2),
        37, 137, 14, 'center baseline', '#fff')
    const s3_loss = poppinsBold.getTextPath('<' + getApproximateGreatString((1.01 - 0.99) * base_score_sum / 0.2),
        37 + 54, 137, 14, 'center baseline', '#fff')
    const s2p_loss = poppinsBold.getTextPath('<' + getApproximateGreatString((1.01 - 0.995) * base_score_sum / 0.2),
        37 + 108, 137, 14, 'center baseline', '#fff')
    const s2_loss = poppinsBold.getTextPath('<' + getApproximateGreatString((1.01 - 1) * base_score_sum / 0.2),
        37 + 162, 137, 14, 'center baseline', '#fff')
    const sp_loss = poppinsBold.getTextPath('<' + getApproximateGreatString((1.01 - 1.005) * base_score_sum / 0.2),
        37 + 216, 137, 14, 'center baseline', '#fff')

    const break_2550_percent = (0.01 * 0.25 / note?.break_)
    const break_2550_text = '≈  ' + getJudgeScoreString(0 - 100 * break_2550_percent)
        + '%  ≈  ' + getApproximateGreatString(break_2550_percent / (0.2 / base_score_sum), 3)

    const break_2000_percent = (1 / base_score_sum + (0.01 * 0.6 / note?.break_)) // 基础分数损失 5 倍，0.2*5=1
    const break_2000_text = '≈  ' + getJudgeScoreString(0 - 100 * break_2000_percent)
        + '%  ≈  ' + getApproximateGreatString(break_2000_percent / (0.2 / base_score_sum), 3)

    const break_2550 = poppinsBold.getTextPath(break_2550_text,
        62, 137 + 25, 14, 'left baseline', '#fff')
    const break_2000 = poppinsBold.getTextPath(break_2000_text,
        62, 137 + 55, 14, 'left baseline', '#fff')

    svg = setImage(svg, 10 + 3, 145, 47, 25, getImageFromV3('Maimai', 'object-note-break-perfect.png'), reg_icon, 1)
    svg = setImage(svg, 10 + 3, 175, 47, 25, getImageFromV3('Maimai', 'object-note-break-great.png'), reg_icon, 1)

    svg = setImage(svg, 35 + Math.round(poppinsBold.getTextWidth(break_2550_text, 14)) + 30, 145, 47, 25, getImageFromV3('Maimai', 'object-note-tap-great.png'), reg_icon, 1)
    svg = setImage(svg, 35 + Math.round(poppinsBold.getTextWidth(break_2000_text, 14)) + 30, 175, 47, 25, getImageFromV3('Maimai', 'object-note-tap-great.png'), reg_icon, 1)

    const tap_count = poppinsBold.getTextPath((note?.tap || 0).toString(),
        37, 72, 14, 'center baseline', '#fff')
    const hold_count = poppinsBold.getTextPath((note?.hold || 0).toString(),
        37 + 54, 72, 14, 'center baseline', '#fff')
    const slide_count = poppinsBold.getTextPath((note?.slide || 0).toString(),
        37 + 108, 72, 14, 'center baseline', '#fff')
    const touch_count = poppinsBold.getTextPath((note?.touch || 0).toString(),
        37 + 162, 72, 14, 'center baseline', '#fff')
    const break_count = poppinsBold.getTextPath((note?.break_ || 0).toString(),
        37 + 216, 72, 14, 'center baseline', '#fff')

    // 占比矩形 占鸡儿比 当前进度
    // const width = 270 / sum

    let gradient
    if (achievements >= 100.5) {
        gradient = [
            {
                offset: "0%",
                color: "#EC6841",
                opacity: 1,
            },
            {
                offset: "20%",
                color: "#F19149",
                opacity: 1,
            },
            {
                offset: "40%",
                color: "#FFF45C",
                opacity: 1,
            },
            {
                offset: "60%",
                color: "#31B16C",
                opacity: 1,
            },
            {
                offset: "80%",
                color: "#00B7EE",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#00f2fe",
                opacity: 1,
            },
        ]
    } else if (achievements >= 100) {
        gradient = [
            {
                offset: "0%",
                color: "#EC6841",
                opacity: 1,
            },
            {
                offset: "35%",
                color: "#F19149",
                opacity: 1,
            },
            {
                offset: "70%",
                color: "#FFF45C",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#00B7EE",
                opacity: 1,
            },
        ]
    } else if (achievements >= 99) {
        gradient = [
            {
                offset: "0%",
                color: "#F7B551",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#FFF45C",
                opacity: 1,
            },
        ]
    } else if (achievements >= 97) {
        gradient = [
            {
                offset: "0%",
                color: "#F19149",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#F7B551",
                opacity: 1,
            },
        ]
    } else if (achievements >= 80) {
        gradient = [
            {
                offset: "0%",
                color: "#EA68A2",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#EC6841",
                opacity: 1,
            },
        ]
    } else if (achievements >= 60) {
        gradient = [
            {
                offset: "0%",
                color: "#12B4B1",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#00B7EE",
                opacity: 1,
            },
        ]
    } else if (achievements >= 50) {
        gradient = [
            {
                offset: "0%",
                color: "#12B4B1",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#31B16C",
                opacity: 1,
            },
        ]
    } else {
        gradient = [
            {
                offset: "0%",
                color: "#777",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#aaa",
                opacity: 1,
            },
        ]
    }

    let rrect_width
    if (achievements >= 100.5) {
        rrect_width = 270 * 0.9 + 27 * (achievements - 100.5) / 0.5
    } else if (achievements >= 100) {
        rrect_width = 270 * 0.7 + 27 * (achievements - 100) / 0.5
    } else if (achievements >= 99.5) {
        rrect_width = 270 * 0.5 + 27 * (achievements - 99.5) / 0.5
    } else if (achievements >= 99) {
        rrect_width = 270 * 0.3 + 27 * (achievements - 99) / 0.5
    } else if (achievements >= 98) {
        rrect_width = 270 * 0.1 + 27 * (achievements - 98)
    } else if (achievements > 0) {
        rrect_width = Math.max(27 * (achievements - 95) / 3, 10)
    } else {
        rrect_width = 0
    }


    const progress_rrect = achievements > 0 ? PanelDraw.GradientRect(10, 80, rrect_width, 10, 5, gradient) : ''
    const progress_base_rrect = PanelDraw.GradientRect(10, 80, 270, 10, 5, gradient, 0.2)

    /*
    const tap_rrect = PanelDraw.GradientRect(10, 80, width * ((note?.tap) || 0), 10, 5,
        [
            {
                offset: "0%",
                color: "#ea68a2",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#eb6877",
                opacity: 1,
            }
        ]
    )
    const hold_rrect = PanelDraw.GradientRect(10, 80, width * ((note?.tap + note?.hold) || 0), 10, 5,
        [
            {
                offset: "0%",
                color: "#ff9800",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#fff100",
                opacity: 1,
            }
        ]
    )
    const slide_rrect = PanelDraw.GradientRect(10, 80, width * ((note?.tap + note?.hold + note?.slide) || 0), 10, 5,
        [
            {
                offset: "0%",
                color: "#0068b7",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#00a0e9",
                opacity: 1,
            },
        ]
    )
    const touch_rrect = PanelDraw.GradientRect(10, 80, width * ((note?.tap + note?.hold + note?.slide + note?.touch) || 0), 10, 5,
        [
            {
                offset: "0%",
                color: "#00a0e9",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#82d7fc",
                opacity: 1,
            },
        ]
    )
    const break_rrect = PanelDraw.GradientRect(10, 80, 270, 10, 5,
        [
            {
                offset: "0%",
                color: "#fff100",
                opacity: 1,
            },
            {
                offset: "100%",
                color: "#ff9800",
                opacity: 1,
            }
        ]
    )

     */

    // 基础分：PF 500, GR 400, GD 250, MS 0, Hold x2, Slide x3, Break x5~
    // 绝赞基础分：CP~PF2 2500, GR1 2000, GR2 1500, GR3 1250, GD 1000, MS 0,
    // 绝赞额外分：CP 100, PF1 75, PF2 50, GR1~3 40, GD 30, MS 0,

    // 换算得到的基础分损失：PF 0, GR -0.2, GD -0.5, MS -1, Hold x2, Slide x3, Break x5
    // 换算得到的绝赞基础分损失：CP~PF2 0, GR1 -1, GR2 -2, GR3 -2.5, GD -break_great2, MS -5,
    // 换算得到的绝赞额外分奖励：CP 1, PF1 0.75, PF2 0.5, GR1~3 0.4, GD 0.3, MS 0,


    /*

    // 单一物件的基础分或额外分
    // 以 100- 计算
    const base_score_sum = (note?.tap + 2 * note?.hold + 3 * note?.slide + 5 * note?.break_ + note?.touch) || -1
    const base_score = base_score_sum > 0 ? (100 / base_score_sum) : 0
    const extra_score = note?.break_ > 0 ? (1 / note?.break_) : 0

    const break_critical = poppinsBold.getTextPath(getJudgeScoreString(extra_score),
        37, 142, 14, 'center baseline', '#fff')
    const break_perfect1 = poppinsBold.getTextPath(getJudgeScoreString(extra_score * 0.75),
        37 + 54, 142, 14, 'center baseline', '#fff')
    const break_great1 = poppinsBold.getTextPath(getJudgeScoreString(base_score * -1 + extra_score * 0.4),
        37 + 108, 142, 14, 'center baseline', '#fff')
    const break_good = poppinsBold.getTextPath(getJudgeScoreString(base_score * -3 + extra_score * 0.3),
        37 + 162, 142, 14, 'center baseline', '#fff')
    const break_miss = poppinsBold.getTextPath(getJudgeScoreString(base_score * -5),
        37 + 216, 142, 14, 'center baseline', '#fff')

    const break_perfect2 = poppinsBold.getTextPath(getJudgeScoreString(extra_score * 0.5),
        37 + 54, 167, 14, 'center baseline', '#fff')
    const break_great2 = poppinsBold.getTextPath(getJudgeScoreString(base_score * -2 + extra_score * 0.4),
        37 + 108, 167, 14, 'center baseline', '#fff')

    const tap_great = poppinsBold.getTextPath(getJudgeScoreString(base_score * -0.2),
        37, 192, 14, 'center baseline', '#fff')
    const break_great3 = poppinsBold.getTextPath(getJudgeScoreString(base_score * -2.5 + extra_score * 0.4),
        37 + 108, 192, 14, 'center baseline', '#fff')
    const tap_good = poppinsBold.getTextPath(getJudgeScoreString(base_score * -0.5),
        37 + 162, 192, 14, 'center baseline', '#fff')
    const tap_miss = poppinsBold.getTextPath(getJudgeScoreString(base_score * -1),
        37 + 216, 192, 14, 'center baseline', '#fff')

    const base = PanelDraw.Rect(0, 0, 290, 210, 20, '#46393f', 1)

    svg = replaceTexts(svg, [title, dx,
        break_critical, break_perfect1, break_perfect2, break_great1, break_great2, break_great3, break_good, break_miss,
        tap_great, tap_good, tap_miss, tap_count, hold_count, slide_count, touch_count, break_count], reg_text)

    svg = replaceTexts(svg, [tap_rrect, hold_rrect, slide_rrect, touch_rrect, break_rrect, base], reg_base)

     */

    const base = PanelDraw.Rect(0, 0, 290, 210, 20, '#382E32', 1)

    svg = setTexts(svg, [title, equivalent, tap_count, hold_count, slide_count, touch_count, break_count, s3p_loss, s3_loss, s2p_loss, s2_loss, sp_loss, break_2550, break_2000], reg_text)

    svg = setTexts(svg, [progress_rrect, progress_base_rrect, base], reg_base)

    return svg.toString()
}

/**
 *
 * @param score
 * @returns {string}
 */
function getJudgeScoreString(score = 0) {
    if (Number.isNaN(score)) return ''
    const out = (score > 0) ? '+' : ((score < 0) ? '-' : '')

    const score_number = rounds(Math.abs(score), 4)

    const large = score_number.integer
    const small = score_number.decimal

    return out + large + small

    /*
    if (large.startsWith('0')) {
        return out + '.' + small
    } else {
        return out + large + small
    }

     */
}

/**
 *
 * @param score
 * @param level
 * @returns {string}
 */
function getApproximateGreatString(score = 0, level = 1) {
    if (Number.isNaN(score)) return ''
    const score_number = rounds(Math.abs(score), level)

    const large = score_number.integer
    const small = score_number.decimal

    return large + small

    /*
    if (large.startsWith('0')) {
        return '.' + small
    } else {
        return large + small
    }
     */
}

// 锚点在右下角
function drawStars(dx = 0, max = 0) {
    if (typeof max !== "number" || max <= 0) return ''

    const level = getMaimaiDXStarLevel(dx, max)
    const color = getMaimaiDXStarColor(level)
    const y_delta = (level >= 5) ? 14 : 16

    const diamonds = [
        PanelDraw.Diamond(-12, -12, 12, 12, color),
        PanelDraw.Diamond(-12, -12 - y_delta, 12, 12, color),
        PanelDraw.Diamond(-12, -12 - y_delta * 2, 12, 12, color),
        PanelDraw.Diamond(-12, -12 - y_delta * 3, 12, 12, color),
        PanelDraw.Diamond(-12, -12 - y_delta * 4, 12, 12, color),
    ]

    let out = '';

    for (let i = 0; i < level; i++) {
        out += diamonds[i];
    }

    return out;
}

