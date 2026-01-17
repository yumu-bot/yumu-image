import {
    exportJPEG, getImageFromV3,
    getPanelNameSVG, getSvgBody, isASCII, isNotBlankString,
    readTemplate,
    setImage,
    setSvgBody,
    setText, setTexts,
    thenPush
} from "../util/util.js";
import {colorArray} from "../util/color.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import { PuHuiTi, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMaimaiCover, getMaimaiDifficultyColors, getMaimaiRankBG} from "../util/maimai.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MV(data);
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
        const svg = await panel_MV(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * MAIMAI 牌子完成度列表。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MV(
    data = {
        user: {
            name: 'Muz',
            probername: 'Muziya',
            dan: 0,
            rating: 14660,
            base: 0,
            additional: 0
        },
        plate_list: [
            {star: '15'},
            {star: '14+', progress: [Array]},
            {star: '14', progress: [Array]},
            {star: '13+', progress: [Array]},
            {star: '13', progress: [
                    {
                        title: 'Shooting Shower～DANCE TIME(シンディ)～',
                        song_id: 11570,
                        score: {
                            independent_id: 115703,
                            achievements: 100.7895,
                            ds: 13,
                            dxScore: 1514,
                            fc: 'fcp',
                            fs: 'fsd',
                            level: '13',
                            level_index: 3,
                            level_label: 'Master',
                            ra: 292,
                            rate: 'sssp',
                            song_id: 11570,
                            title: 'Shooting Shower～DANCE TIME(シンディ)～',
                            type: 'DX',
                            max: 0,
                            position: 0,
                            bpm: 0,
                            is_utage: false,
                            is_deluxe: true
                        },
                        required: 'sss',
                        completed: true
                    },

                ]},
            {star: '12+', progress: [Array]}
        ],
        chart_count: [
            528, 0, 12, 16,
            38, 37, 19
        ]
    }
) {

    let svg = readTemplate('template/Panel_MA.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_card_i = /(?<=<g id="CardI">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MA1-1\);">)/;

    const panel_name = getPanelNameSVG('Maimai Version Plate (!ymmv)', 'MV');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.maiPlayer2CardA1(data.user));

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath("maimai"), reg_banner, 0.8);

    // 临时
    let card_mv = [];

    const param_progress = data?.plate_list.flatMap(item => item.progress || []);

    await Promise.allSettled(
        param_progress.map((pg) => {return card_MV(progress2CardMV(pg))})
    ).then(results => thenPush(results, card_mv))

    const mv_height = Math.max(Math.ceil(card_mv.length / 12) * 146 - 20, 0)

    let string_sd = ''

    for (const i in card_mv) {
        const x = i % 12;
        const y = Math.floor(i / 12);

        string_sd += getSvgBody(40 + (135 + 20) * x, 330 + 146 * y, card_mv[i]);
    }

    // 计算面板高度
    const card_height = mv_height + 80
    const panel_height = card_height + 290

    svg = setTexts(svg, [string_sd], reg_card_i)

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    return svg
}

function progress2CardMV(progress = {
    title: 'Shooting Shower～DANCE TIME(シンディ)～',
    song_id: 11570,
    star: 13,
    index: 3,
    score: {
        independent_id: 115703,
        achievements: 100.7895,
        ds: 13,
        dxScore: 1514,
        fc: 'fcp',
        fs: 'fsd',
        level: '13',
        level_index: 3,
        level_label: 'Master',
        ra: 292,
        rate: 'sssp',
        song_id: 11570,
        title: 'Shooting Shower～DANCE TIME(シンディ)～',
        type: 'DX',
        max: 0,
        position: 0,
        bpm: 0,
        is_utage: false,
        is_deluxe: true
    },
    required: 'sss',
    completed: true
},) {
    return {
        left1_text: (progress.song_id ?? 0).toString(),
        left2_text: (progress.star ?? 0).toString(),

        left1_colors: (progress.song_id >= 10000) ? colorArray.amber : colorArray.deep_blue,
        left2_colors: getMaimaiDifficultyColors(progress.index),

        title_text: progress.title ?? '',
        song_id: progress.song_id,

        rank: progress.score?.rate,
        combo: progress.score?.fc,
        sync: progress.score?.fs,

        required: progress.required,
        completed: progress.completed,
    }
}

async function card_MV(data = {
    left1_text: '',
    left2_text: '',

    left1_colors: colorArray.blue,
    left2_colors: colorArray.blue,

    song_id: 0,

    title_text: '',

    rank: '',
    combo: '',
    sync: '',

    required: '',
    completed: false,
}) {

    // 模板
    let svg = `
    <defs>
    <clipPath id="clippath-CV-1">
        <rect width="135" height="126" rx="10" ry="10" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CV-2">
         <rect x="-5" y="111" width="145" height="20" rx="10" ry="10" style="fill: none;"/>
    </clipPath>
    </defs>
    <g id="Base-CV">
        <rect width="135" height="126" rx="10" ry="10" style="fill: #382E32;"/>
    </g>
    <g id="Background-CV">
        <g style="clip-path: url(#clippath-CV-1);">
        </g>
    </g>
    <g id="Rank-CV">
        <rect x="-5" y="111" width="145" height="20" rx="10" ry="10" style="fill: #46393f;"/>
        <g style="clip-path: url(#clippath-CV-2);">
        </g>
    </g>
    <g id="Overlay-CV">
    </g>
    <g id="Text-CV">
    </g>`


    // 正则
    const reg_text = /(?<=<g id="Text-CV">)/;
    const reg_overlay = /(?<=<g id="Overlay-CV">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CV-1\);">)/
    const reg_rank = /(?<=<g style="clip-path: url\(#clippath-CV-2\);">)/

    const title_text = PuHuiTi.cutStringTail(data.title_text, 15, 130)

    const title_ascii = isASCII(title_text)
    let title

    if (title_ascii) {
        title = torusBold.getTextPath(title_text, 135 / 2, 126, 16, 'center baseline')
    } else {
        title = PuHuiTi.getTextPath(title_text, 135 / 2, 126, 15, 'center baseline')
    }

    // 左侧覆盖部分
    const left1_width = torusBold.getTextWidth(data?.left1_text, 16)
    const left1_rrect_width = Math.max(40, left1_width + 10)
    const left1 = torusBold.getTextPath(data?.left1_text, -5 + (left1_rrect_width / 2), 10, 16,
        'center baseline', '#fff')
    const left1_rrect = PanelDraw.LinearGradientRect(-5, -5, left1_rrect_width, 20, 10, data?.left1_colors, 1,
        [100, 0], [80, 20])

    const left2_width = torusBold.getTextWidth(data?.left2_text, 16)
    const left2_rrect_width = Math.max(40, left2_width + 10)
    const left2 = torusBold.getTextPath(data?.left2_text, -5 + (left2_rrect_width / 2), 35, 16,
        'center baseline', '#fff')
    const left2_rrect = PanelDraw.LinearGradientRect(-5, 20, left2_rrect_width, 20, 10, data?.left2_colors, 1,
        [100, 0], [80, 20])

    const rank = getMaimaiRankBG(data.rank)

    const image = getImageFromRequired(data.required, data.rank, data.combo, data.sync)

    let completed_opacity
    if (data.completed === true) {
        completed_opacity = 0.2
    } else {
        completed_opacity = 1
    }

    const song_cover = await getMaimaiCover(data.song_id)

    svg = setTexts(svg, [title, left1, left1_rrect, left2, left2_rrect], reg_text)
    svg = setImage(svg, -5, 92, 145, 60, rank, reg_rank, 0.6)
    svg = setImage(svg, 0, -5, 135, 135, song_cover, reg_background, completed_opacity)
    svg = setImage(svg, image.x, image.y, image.w, image.h, image.image, reg_overlay)

    return svg
}

function getImageFromRequired(required = '', rank = '', combo = '', sync = '') {
    let image
    let x
    let y
    let w
    let h

    switch (required) {
        case 'ap':
        case 'fc': {
            let c = ''

            switch (combo) {
                case 'fc':
                    c = 'object-icon-combo-fullcombo.png';
                    break;
                case 'fcp':
                    c = 'object-icon-combo-fullcomboplus.png';
                    break;
                case 'ap':
                    c = 'object-icon-combo-allperfect.png';
                    break;
                case 'app':
                    c = 'object-icon-combo-allperfectplus.png';
                    break;
                default:
                    c = 'object-icon-combo-clear.png';
                    break;
            }
            image = getImageFromV3('Maimai', c)
            x = 109; y = -8;
            w = 36; h = 40;
        } break;

        case 'fsd': {
            let s = ''

            switch (sync?.fs) {
                case 'sync':
                    s = 'object-icon-sync-sync.png';
                    break;
                case 'fs':
                    s = 'object-icon-sync-fullsync.png';
                    break;
                case 'fsp':
                    s = 'object-icon-sync-fullsyncplus.png';
                    break;
                case 'fsd':
                    s = 'object-icon-sync-fullsyncdx.png';
                    break;
                case 'fsdp':
                    s = 'object-icon-sync-fullsyncdxplus.png';
                    break;
                default:
                    s = 'object-icon-sync-solo.png';
                    break;
            }
            image = getImageFromV3('Maimai', s)
            x = 109;
            y = -8;
            w = 36;
            h = 40;
        } break;

        default: {
            if (isNotBlankString(rank)) {
                image = getImageFromV3('Maimai', `object-score-${rank || 'd'}2.png`)
            } else {
                image = ''
            }

            x = 84;
            y = -10;
            w = 56;
            h = 30;
        }
    }

    return {
        image: image,
        x: x,
        y: y,
        w: w,
        h: h,
    }
}
