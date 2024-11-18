import {
    implantImage, implantSvgBody, isASCII, isNotBlankString, replaceText, replaceTexts,
} from "../util/util.js";
import {getMultipleTextPath, PuHuiTi, torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMaimaiDXStarColor} from "../util/maimai.js";

// maimai / CHUNITHM 多成绩面板
export function card_I3(data = {
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
    right: '',
    index_b: '',
    index_m: '',
    index_r: '', // 右下角右边的小字
    index_b_size: 32,
    index_m_size: 20,
    index_r_size: 18,
    label1: '',
    label2: '',
    label3: '',

    color_text: '#fff',
    color_label1: 'none',
    color_label2: 'none',
    color_label3: 'none',

    color_left: 'none',
    color_rrect1: 'none',
    color_rrect2: 'none',
    color_rrect3: 'none',

    component1: '', // Combo
    component2: '', // Sync
    component3: '', // Chain

    left3_is_right: false // chunithm 可以放在右边
}) {
    // 模板
    let svg = `
    <defs>
    <clipPath id="clippath-CI3-1">
        <rect x="100" width="330" height="130" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI3-2">
         <rect width="80" height="130" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI3-3">
         <rect x="15" width="130" height="130" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
        <filter id="blur-CI3-BG" height="130%" width="130%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="Base-CI3">
        <rect width="352" height="130" rx="20" ry="20" style="fill: #46393f;"/>
        <rect x="15" width="130" height="130" rx="20" ry="20" style="fill: #382e32;"/>
    </g>
    <g id="Background-CI3">
        <g filter="url(#blur-CI3-BG)" style="clip-path: url(#clippath-CI3-1);">
        </g>
    </g>
    <g id="Difficulty-CI3">
        <g style="clip-path: url(#clippath-CI3-2);">
        </g>
    </g>
    <g id="Cover-CI3">
        <g style="clip-path: url(#clippath-CI3-3);">
        </g>
    </g>
    <g id="Rank-CI3">
    </g>
    <g id="Overlay-CI3">
    </g>
    <g id="Text-CI3">
    </g>`;

    // 正则
    const reg_text = /(?<=<g id="Text-CI3">)/;
    const reg_overlay = /(?<=<g id="Overlay-CI3">)/;
    const reg_rank = /(?<=<g id="Rank-CI3">)/;
    const reg_background = /(?<=<g filter="url\(#blur-CI3-BG\)" style="clip-path: url\(#clippath-CI3-1\);">)/
    const reg_difficulty = /(?<=<g style="clip-path: url\(#clippath-CI3-2\);">)/
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CI3-3\);">)/

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
    let title2_width = title2_font.getTextWidth(data?.title2 || '', title2_size)
    let left1_width = Math.min(left1_font.getTextWidth(data?.left1 || '', title_size), 207 - 20 - title2_width - 10)

    // 副标题太长也不行
    if (title2_width > 207 - 20 - 50 - 10) {
        left1_width = Math.min(left1_font.getTextWidth(data?.left1 || '', title_size), 207 - 20 - 50 - 10)
        title2_width = 207 - 20 - 50 - left1_width - 10
    }

    const title_width = 207 - 20 - (isNotBlankString(data?.type) ? 30 : 0)
    const left2_width = 207 - 20 - (isNotBlankString(data?.component3) ? 105 : 0) - 16 * (data?.level || 0)

    const title = title_font.getTextPath(
        title_font.cutStringTail(data?.title || '', title_size, title_width), 157, 26, title_size, 'left baseline', '#fff')
    const title2 = title2_font.getTextPath(
        title2_font.cutStringTail(data?.title2 || '', title2_size, title2_width), 342, 46, title2_size, 'right baseline', '#bbb')
    const left1 = left1_font.getTextPath(
        left1_font.cutStringTail(data?.left1 || '', left1_size, left1_width), 157, 46, left1_size, 'left baseline', '#fff')
    const left2 = left2_font.getTextPath(
        left2_font.cutStringTail(data?.left2 || '', left2_size, left2_width), 157, 66, left2_size, 'left baseline', '#fff')
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
        : getMultipleTextPath(left34_arr, 157, 90, 'left baseline')

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
        {
            font: "torus",
            text: data?.index_r,
            size: data?.index_r_size || 18,
            color: text_color,
        },
    ]

    const index = getMultipleTextPath(index_arr, 342, 120, 'right baseline')

    svg = replaceTexts(svg, [title, title2, left1, left2, left3, index], reg_text)

    // 图片和矩形
    const left_rrect = PanelDraw.Rect(0, 0, 145, 130, 20, data?.color_left || '#382e32', 1)
    svg = replaceText(svg, left_rrect, reg_difficulty);

    svg = implantImage(svg, 130, 130, 15, 0, 1, data?.cover, reg_cover);
    svg = implantImage(svg, 352, 130, 0, 0, 0.4, data?.background, reg_background);
    svg = implantImage(svg, 56, 30, 154, 96, 1, data?.rank, reg_rank);

    svg = implantSvgBody(svg, 290, 68, data?.component1, reg_rank) // 27 * 30
    svg = implantSvgBody(svg, 290 + 28, 68, data?.component2, reg_rank) // 27 * 30

    // 左侧覆盖部分
    const label1_width = torus.getTextWidth(data?.label1, 18)
    const label1_rrect_width = Math.max(40, label1_width + 10)
    const label1 = torus.getTextPath(data?.label1, 25 + (label1_rrect_width / 2), 24, 18,
        'center baseline', data?.color_label1)
    const label1_rrect = PanelDraw.Rect(25, 8, label1_rrect_width, 20, 10, data?.color_rrect1, 1)

    const label2_width = torus.getTextWidth(data?.label2, 18)
    const label2_rrect_width = Math.max(40, label2_width + 10)
    const label2 = torus.getTextPath(data?.label2, 25 + (label2_rrect_width / 2), 118, 18,
        'center baseline', data?.color_label2)
    const label2_rrect = PanelDraw.Rect(25, 102, label2_rrect_width, 20, 10, data?.color_rrect2, 1)

    const label3_width = torus.getTextWidth(data?.label3, 18)
    const label3_rrect_width = Math.max(40, label3_width + 10)
    const label3 = torus.getTextPath(data?.label3, 135 - (label3_rrect_width / 2), 118, 18,
        'center baseline', data?.color_label3)
    const label3_rrect = PanelDraw.Rect(135 - label3_rrect_width, 102, label3_rrect_width, 20, 10, data?.color_rrect3, 1)

    svg = replaceTexts(svg, [label1, label2, label3], reg_text)
    svg = replaceTexts(svg, [label1_rrect, label2_rrect, label3_rrect], reg_overlay)

    // 右侧覆盖部分
    const stars = drawStars(data?.level || 0)

    svg = implantSvgBody(svg, 342, 54, stars, reg_rank)  //注意。这个组件的锚点在右上角
    svg = implantImage(svg, 45, 30, 305, 2, 1, data?.type, reg_overlay);
    svg = implantSvgBody(svg, 236, 54, data?.component3, reg_rank) // 105 * 15

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