import {isASCII, isNotBlankString, setImage, setSvgBody, setText, setTexts} from "../util/util.js";
import {getMultipleTextPath, PuHuiTi, torus, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMaimaiDXStarColor} from "../util/maimai.js";
import {drawLazerMods} from "../util/mod.js";

export function card_I4(data = {
    background: '',
    cover: '',
    rank: '',
    type: '',
    level: 0,  // 星星数量

    title: '',
    title2: '', // 外号
    left1: '',
    left2: '',
    left3: '', // 大号字
    left4: '', // 小号字
    index_b: '',
    index_m: '',
    index_b_size: 32,
    index_m_size: 20,
    label1: '',
    label2: '',

    color_text: '#fff',
    color_label1: 'none',
    color_label2: 'none',

    color_left: 'none',
    color_rrect1: 'none',
    color_rrect2: 'none',

    mods: [], // mod

}) {
    // 模板
    let svg = `
    <defs>
    <clipPath id="clippath-CI4-1">
        <rect x="100" width="252" height="130" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI4-2">
         <rect width="80" height="130" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI4-3">
         <rect x="15" width="130" height="130" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
        <filter id="blur-CI4-BG" height="130%" width="130%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="Base-CI4">
        <rect width="352" height="130" rx="20" ry="20" style="fill: #46393f;"/>
        <rect x="15" width="130" height="130" rx="20" ry="20" style="fill: #382e32;"/>
    </g>
    <g id="Background-CI4">
        <g filter="url(#blur-CI4-BG)" style="clip-path: url(#clippath-CI4-1);">
        </g>
    </g>
    <g id="Difficulty-CI4">
        <g style="clip-path: url(#clippath-CI4-2);">
        </g>
    </g>
    <g id="Cover-CI4">
        <g style="clip-path: url(#clippath-CI4-3);">
        </g>
    </g>
    <g id="Rank-CI4">
    </g>
    <g id="Overlay-CI4">
    </g>
    <g id="Text-CI4">
    </g>`;

    // 正则
    const reg_text = /(?<=<g id="Text-CI4">)/;
    const reg_overlay = /(?<=<g id="Overlay-CI4">)/;
    const reg_rank = /(?<=<g id="Rank-CI4">)/;
    const reg_background = /(?<=<g filter="url\(#blur-CI4-BG\)" style="clip-path: url\(#clippath-CI4-1\);">)/
    const reg_difficulty = /(?<=<g style="clip-path: url\(#clippath-CI4-2\);">)/
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CI4-3\);">)/

    const text_color = data?.color_text || '#fff'

    // 文本

    const title_size = isASCII(data?.title) ? 22 : 20;
    const title2_size = isASCII(data?.title2) ? 16 : 14;
    const left1_size = isASCII(data?.left1) ? 16 : 14;
    const left2_size = isASCII(data?.left2) ? 16 : 14;
    const left3_size = isASCII(data?.left3) ? 24 : 22;
    const left4_size = isASCII(data?.left4) ? 16 : 14;

    const title_font = isASCII(data?.title) ? torus : PuHuiTi;
    const title2_font = isASCII(data?.title2) ? torus : PuHuiTi;
    const left1_font = isASCII(data?.left1) ? torus : PuHuiTi;
    const left2_font = isASCII(data?.left2) ? torus : PuHuiTi;
    const left3_font = isASCII(data?.left3) ? torus : PuHuiTi;
    const left4_font = isASCII(data?.left4) ? torus : PuHuiTi;

    // 优先显示 title2
    let title2_width = title2_font.getTextWidth(data?.title2 ?? '', title2_size)
    let left1_width = Math.min(left1_font.getTextWidth(data?.left1 ?? '', title_size), 207 - 20 - title2_width - 10 + 4)

    // 副标题太长也不行
    if (title2_width > 207 - 20 - 50 - 10 + 4) {
        left1_width = Math.min(left1_font.getTextWidth(data?.left1 ?? '', title_size), 207 - 20 - 50 - 10 + 4)
        title2_width = 207 - 20 - 50 - left1_width - 10 + 4
    }

    const title_width = 207 - 20 - (isNotBlankString(data?.type) ? 35 : 0) + 4
    const left2_width = 207 - 20 - 16 * (data?.level ?? 0) + 4

    const title = title_font.getTextPath(
        title_font.cutStringTail(data?.title || '', title_size, title_width), 157 - 2, 26, title_size, 'left baseline', '#fff')
    const title2 = title2_font.getTextPath(
        title2_font.cutStringTail(data?.title2 || '', title2_size, title2_width), 342, 46, title2_size, 'right baseline', '#bbb')
    const left1 = left1_font.getTextPath(
        left1_font.cutStringTail(data?.left1 || '', left1_size, left1_width), 157 - 2, 46, left1_size, 'left baseline', '#fff')
    const left2 = left2_font.getTextPath(
        left2_font.cutStringTail(data?.left2 || '', left2_size, left2_width), 157 - 2, 66, left2_size, 'left baseline', '#fff')
    const left34_arr = [
        {
            font: left3_font,
            text: data?.left3,
            size: left3_size,
            color: text_color,
        },{
            font: left4_font,
            text: data?.left4,
            size: left4_size,
            color: text_color,
        },
    ]

    const left3 = data?.left3_is_right ? getMultipleTextPath(left34_arr, 342, 90, 'right baseline')
        : getMultipleTextPath(left34_arr, 157 - 2, 90, 'left baseline')

    const index_arr = [
        {
            font: "torus",
            text: data?.index_b,
            size: data?.index_b_size || 32,
            color: text_color,
        },
        {
            font: "torus",
            text: data?.index_m,
            size: data?.index_m_size || 20,
            color: text_color,
        },
    ]

    const index = getMultipleTextPath(index_arr, 342, 120, 'right baseline')

    svg = setTexts(svg, [title, title2, left1, left2, left3, index], reg_text)

    // 图片和矩形
    const left_rrect = PanelDraw.Rect(0, 0, 145, 130, 20, data?.color_left || '#382e32', 1)
    svg = setText(svg, left_rrect, reg_difficulty);

    svg = setImage(svg, 15, 0, 130, 130, data?.cover, reg_cover, 1);
    svg = setImage(svg, 0, 0, 352, 130, data?.background, reg_background, 0.4);
    svg = setImage(svg, 154 - 2, 96, 56, 30, data?.rank, reg_rank, 1);

    const mods = drawLazerMods(data?.mods,
        342, 70, 24, 60, 'right', 8, false, false, false)

    // 左侧覆盖部分
    const label1_width = torusBold.getTextWidth(data?.label1, 18)
    const label1_rrect_width = Math.max(40, label1_width + 10)
    const label1 = torusBold.getTextPath(data?.label1, 25 + (label1_rrect_width / 2), 24, 18,
        'center baseline', data?.color_label1)
    const label1_rrect = PanelDraw.Rect(25, 8, label1_rrect_width, 20, 10, data?.color_rrect1, 1)

    const label2_width = torusBold.getTextWidth(data?.label2, 18)
    const label2_rrect_width = Math.max(40, label2_width + 10)
    const label2 = torusBold.getTextPath(data?.label2, 25 + (label2_rrect_width / 2), 118, 18,
        'center baseline', data?.color_label2)
    const label2_rrect = PanelDraw.Rect(25, 102, label2_rrect_width, 20, 10, data?.color_rrect2, 1)

    svg = setTexts(svg, [label1, label2], reg_text)
    svg = setTexts(svg, [label1_rrect, label2_rrect, mods.svg], reg_overlay)

    // 右侧覆盖部分
    const stars = drawStars(data?.level || 0)

    svg = setSvgBody(svg, 342, 54, stars, reg_rank)  //注意。这个组件的锚点在右上角
    svg = setImage(svg, 300, 4, 45, 30, data?.type, reg_overlay, 1);

    return svg.toString()
}

function drawStars(level = 0) {
    const color = getMaimaiDXStarColor(level)

    let out = '';

    for (let i = 0; i < level; i++) {
        out += PanelDraw.Diamond(-10 - (14 * i), 0, 10, 10, color);
    }

    return out;
}