import {
    exportJPEG,
    getImageFromV3,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    isNotEmptyArray,
    readTemplate,
    setText,
    setTexts, floors, thenPush, getSvgBody, isASCII, floor, getImage
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getMaimaiBannerIndex, getRandomBannerPath} from "../util/mascotBanner.js";
import {
    getMaimaiCover, getMaimaiDifficultyName, getMaimaiDifficultyColors, getMaimaiMaximumRating,
    getMaimaiRankBG,
    getMaimaiType, isMaimaiMaximumRating, getMaimaiDXStarLevel, getMaimaiDXStarColor,
} from "../util/maimai.js";
import {PanelDraw} from "../util/panelDraw.js";
import {poppinsBold, PuHuiTi} from "../util/font.js";
import {card_MS} from "../card/card_MS.js";
import {colorArray} from "../util/color.js";

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
    user: {},
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
        },
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
    version: "DX",
}) {
    let svg = readTemplate('template/Panel_MS.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a2 = /(?<=<g id="CardA2">)/;
    let reg_card_g = /(?<=<g id="CardG">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MS1-1\);">)/;

    // 面板文字
    let panel_name = getPanelNameSVG('Maimai Song Info (!ymms)', 'MS');


    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入 G 卡
    const song = (data?.songs || [])[0]
    const scores = data?.scores || []

    const card_Gs = await applyScore(song, scores)

    // 渲染卡片
    const length = card_Gs?.length || 1
    const interval = (length === 5) ? 22 : 30
    const x = (1920 + interval - (interval + 350) * length) / 2

    if (isNotEmptyArray(card_Gs)) {
        let string_Gs = ''

        for (const i in card_Gs) {
            string_Gs += getSvgBody(x + i * (interval + 350), 330, card_Gs[i])
        }

        svg = setText(svg, string_Gs, reg_card_g)
    }

    // 导入 A2 卡
    const cardA2 = card_A2(await PanelGenerate.maiSong2CardA2(song, data?.version));

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA2, reg_card_a2);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath("maimai", getMaimaiBannerIndex(song)), reg_banner, 0.8);

    svg = setText(svg, component_G2(data.user), reg_index)

    return svg.toString()
}

// 歌曲只有一个版本，只有一个版本有成绩
// 成绩会补充至 5 个。以歌曲为准。
async function applyScore(song = {}, scores = [{}]) {
    let card_Gs = []
    let param_Gs = []

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

        param_Gs.push(maiScore2CardG(song, parseInt(i), score))
    }

    await Promise.allSettled(
        param_Gs
    ).then(results => thenPush(results, card_Gs))

    return card_Gs.map((card) => {return card_MS(card)})
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
        percent = (1 - div) / (1 - 0.97)
    } else if (div >= 0.95) {
        rrect1_color1 = '#FF554E'
        rrect1_color2 = '#FAD129'
        percent = (0.97 - div) / (0.97 - 0.95)
    } else if (div >= 0.93) {
        rrect1_color1 = '#FF554E'
        rrect1_color2 = '#F28D29'
        percent = (0.95 - div) / (0.95 - 0.93)
    } else if (div >= 0.9) {
        rrect1_color1 = '#F0EF47'
        rrect1_color2 = '#26D94F'
        percent = (0.93 - div) / (0.93 - 0.9)
    } else if (div >= 0.85) {
        rrect1_color1 = '#38F8D4'
        rrect1_color2 = '#43EB81'
        percent = (0.9 - div) / (0.9 - 0.85)
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
    const component = component_G1(song?.charts[index]?.notes, score?.achievements, score?.fc)

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

        rrect1_percent: Math.min(Math.max(0, percent), 1),
        rrect1_color1: rrect1_color1,
        rrect1_color2: rrect1_color2,
        rrect1_base_opacity: rrect1_base_opacity,

        stars: stars, //dx 星星
        component: component
    }
}

const component_G1 = (notes = { tap: 472, hold: 65, slide: 69, touch: 26, break_: 26 }, achievements = 0, fc = "") => {
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

    let equivalent_text

    if (fc === 'app') {
        equivalent_text = '= AP+'
    } else if (fc === 'ap') {
        equivalent_text = '= ' + getApproximateGreatString((101 - achievements) / (0.25 / note?.break_), 1) + ' BREAK PF.'
    } else if (achievements > 0) {
        const great = getApproximateGreatString((101 - achievements) / 100 / (0.2 / base_score_sum), 1)

        if (great.includes(".")) {
            equivalent_text = '≈ ' + great + ' GR.'
        } else {
            equivalent_text = '= ' + great + ' GR.'
        }
    } else {
        equivalent_text = '-'
    }

    const equivalent = poppinsBold.getTextPath(equivalent_text, 280, 20, 14, 'right baseline', '#fff')

    const tap_image = getImage(10 + 7, 30, 40, 25, getImageFromV3('Maimai', 'object-note-tap.png'))
    const hold_image = getImage(10 + 7 + 54, 30, 40, 25, getImageFromV3('Maimai', 'object-note-hold.png'))
    const slide_image = getImage(10 + 7 + 108, 30, 40, 25, getImageFromV3('Maimai', 'object-note-slide.png'))
    const touch_image = getImage(10 + 7 + 162, 30, 40, 25, getImageFromV3('Maimai', 'object-note-touch.png'))
    const break_image = getImage(10 + 7 + 216, 30, 40, 25, getImageFromV3('Maimai', 'object-note-break.png'))

    const sp_image = getImage(10 + 3 + 3.5, 95 + 3, 47 - 7, 25 - 6, getImageFromV3('Maimai', 'object-score-sp2.png'))
    const s2_image = getImage(10 + 3 + 54, 95, 47, 25, getImageFromV3('Maimai', 'object-score-ss2.png'))
    const s2p_image = getImage(10 + 3 + 108, 95, 47, 25, getImageFromV3('Maimai', 'object-score-ssp2.png'))
    const s3_image = getImage(10 + 3 + 162, 95, 47, 25, getImageFromV3('Maimai', 'object-score-sss2.png'))
    const s3p_image = getImage(10 + 3 + 216, 95, 47, 25, getImageFromV3('Maimai', 'object-score-sssp2.png'))

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

    const break_pf_image = getImage(10 + 3, 145, 47, 25, getImageFromV3('Maimai', 'object-note-break-perfect.png'))
    const break_gr_image = getImage(10 + 3, 175, 47, 25, getImageFromV3('Maimai', 'object-note-break-great.png'))

    const tap_gr1_image = getImage(35 + Math.round(poppinsBold.getTextWidth(break_2550_text, 14)) + 30, 145, 47, 25, getImageFromV3('Maimai', 'object-note-tap-great.png'))
    const tap_gr2_image = getImage(35 + Math.round(poppinsBold.getTextWidth(break_2000_text, 14)) + 30, 175, 47, 25, getImageFromV3('Maimai', 'object-note-tap-great.png'))

    svg = setTexts(svg, [tap_image, hold_image, slide_image, touch_image, break_image,
        sp_image, s2_image, s2p_image, s3_image, s3p_image,
        break_pf_image, break_gr_image, tap_gr1_image, tap_gr2_image
    ], reg_icon)

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

    let colors
    if (achievements >= 100.5) {
        colors = colorArray.rainbow
    } else if (achievements >= 100) {
        colors = colorArray.iridescent
    } else if (achievements >= 99) {
        colors = colorArray.yellow
    } else if (achievements >= 97) {
        colors = colorArray.amber
    } else if (achievements >= 80) {
        colors = colorArray.deep_orange
    } else if (achievements >= 60) {
        colors = colorArray.indigo
    } else if (achievements >= 50) {
        colors = colorArray.turquoise
    } else {
        colors = colorArray.deep_gray
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

    const progress_rrect = achievements > 0 ? PanelDraw.LinearGradientRect(10, 80, rrect_width, 10, 5, colors) : ''
    const progress_base_rrect = PanelDraw.LinearGradientRect(10, 80, 270, 10, 5, colors, 0.2)

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

const component_G2 = (user = {}) => {
    let svg = `   <defs>
            <clipPath id="clippath-LG2-1">
              <circle cx="1850" cy="225" r="45" style="fill: #382E32;"/>
            </clipPath>
        </defs>
        <g id="Base_LG2">
        </g>
        <g id="Icon_LG2" style="clip-path: url(#clippath-LG2-1);">
        </g>
        <g id="Text_LG2">
        </g>
    `;

    const reg_base = /(?<=<g id="Base_LG2">)/
    const reg_icon = /(?<=<g id="Icon_LG2" style="clip-path: url\(#clippath-LG2-1\);">)/
    const reg_text = /(?<=<g id="Text_LG2">)/

    const circle = PanelDraw.Circle(1850, 225, 45, '#382E32', 1)

    const avatar = getImageFromV3('Maimai', 'avatar-guest2.png')

    svg = setImage(svg, 1850 - 45, 225 - 45, 90, 90, avatar, reg_icon)
    svg = setText(svg, circle, reg_base)

    const name_font = (isASCII(user?.name) ? poppinsBold : PuHuiTi)
    const text = poppinsBold.getTextPath('Player', 1790, 193, 18, 'right baseline', '#fff') +
        name_font.getTextPath(user.name, 1790, 225, 30, 'right baseline', '#fff') +
        poppinsBold.getTextPath(Math.round(user?.rating || 0).toString(), 1790, 265, 40, 'right baseline', '#fff')

    svg = setText(svg, text, reg_text)

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

    const score_number = floors(Math.abs(score), 4)

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

    return floor(Math.abs(score), level)
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

