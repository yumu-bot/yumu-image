import {
    implantImage, implantSvgBody, isASCII, isNotBlankString, replaceText, replaceTexts,
} from "../util/util.js";
import {getMultipleTextPath, PuHuiTi, torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMaimaiDXStarColor} from "../util/maimai.js";

// maimai / CHUNITHM 多成绩面板
export function card_I2(data = {
    background: '',
    cover: '',
    rank: '',
    type: '',
    level: 0,  // 星星数量

    title: '',
    title2: '', // 外号
    left1: '',
    left2: '',
    right: '',
    index_b: '',
    index_m: '',
    index_r: '', // 右下角右边的小字
    index_b_size: 40,
    index_m_size: 24,
    index_r_size: 18,
    label1: '',
    label2: '',

    color_text: '#fff',
    color_label1: 'none',
    color_label2: 'none',

    color_left: 'none',
    color_rrect1: 'none',
    color_rrect2: 'none',

    component1: '', // Combo
    component2: '', // Sync
    component3: '', // Chain
}) {
    // 模板
    let svg = `
    <defs>
    <clipPath id="clippath-CI2-1">
        <rect x="100" width="330" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI2-2">
         <rect width="80" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI2-3">
         <rect x="20" width="120" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
        <filter id="blur-CI2-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="Base-CI2">
        <rect width="430" height="110" rx="20" ry="20" style="fill: #46393f;"/>
        <rect x="20" width="120" height="110" rx="20" ry="20" style="fill: #382e32;"/>
    </g>
    <g id="Background-CI2">
        <g filter="url(#blur-CI2-BG)" style="clip-path: url(#clippath-CI2-1);">
        </g>
    </g>
    <g id="Difficulty-CI2">
        <g style="clip-path: url(#clippath-CI2-2);">
        </g>
    </g>
    <g id="Cover-CI2">
        <g style="clip-path: url(#clippath-CI2-3);">
        </g>
    </g>
    <g id="Rank-CI2">
    </g>
    <g id="Overlay-CI2">
    </g>
    <g id="Text-CI2">
    </g>`;

    // 正则
    const reg_text = /(?<=<g id="Text-CI2">)/;
    const reg_overlay = /(?<=<g id="Overlay-CI2">)/;
    const reg_rank = /(?<=<g id="Rank-CI2">)/;
    const reg_background = /(?<=<g filter="url\(#blur-CI2-BG\)" style="clip-path: url\(#clippath-CI2-1\);">)/
    const reg_difficulty = /(?<=<g style="clip-path: url\(#clippath-CI2-2\);">)/
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CI2-3\);">)/

    const text_color = data?.color_text || '#fff'

    // 文本
    const title_size = isASCII(data?.title) ? 24 : 22;
    const title2_size = isASCII(data?.title2) ? 16 : 14;
    const left1_size = isASCII(data?.left1) ? 16 : 14;
    const left2_size = isASCII(data?.left2) ? 16 : 14;

    const title_font = isASCII(data?.title) ? torus : PuHuiTi;
    const title2_font = isASCII(data?.title2) ? torus : PuHuiTi;
    const left1_font = isASCII(data?.left1) ? torus : PuHuiTi;
    const left2_font = isASCII(data?.left2) ? torus : PuHuiTi;

    // 优先显示 title2
    let title2_width = title2_font.getTextWidth(data?.title2 || '', title2_size)
    let title_width = Math.min(title_font.getTextWidth(data?.title || '', title_size), 260 - 20 - title2_width - 10)

    // 副标题太长也不行
    if (title2_width > 260 - 20 - 50 - 10) {
        title_width = Math.min(title_font.getTextWidth(data?.title || '', title_size), 260 - 20 - 50 - 10)
        title2_width = 260 - 20 - 50 - title_width - 10
    }

    const title = title_font.getTextPath(
        title_font.cutStringTail(data?.title || '', title_size, title_width), 150, 24, title_size, 'left baseline', '#fff')
    const title2 = title2_font.getTextPath(
        title2_font.cutStringTail(data?.title2 || '', title2_size, title2_width), 150 + title_width + 8, 24, title2_size, 'left baseline', '#bbb')
    const left1 = left1_font.getTextPath(
        left1_font.cutStringTail(data?.left1 || '', left1_size,
            (isNotBlankString(data?.component3) ? 160 : 260) - 16 * (data?.level || 0)),
        150, 44, left1_size, 'left baseline', '#fff')
    const left2 = left2_font.getTextPath(
        left2_font.cutStringTail(data?.left2 || '', left2_size,
            260 - torus.getTextWidth(data?.right, 16) - 5), 150, 64, left2_size, 'left baseline', '#fff')

    const right = torus.getTextPath(data?.right, 420, 64, 16, 'right baseline', '#fff')

    const index_arr = [
        {
            font: "torus",
            text: data?.index_b,
            size: data?.index_b_size || 40,
            color: text_color,
        },
        {
            font: "torus",
            text: data?.index_m,
            size: data?.index_m_size || 24,
            color: text_color,
        },
        {
            font: "torus",
            text: data?.index_r,
            size: data?.index_r_size || 18,
            color: text_color,
        },
    ]

    const index = getMultipleTextPath(index_arr, 420, 100, 'right baseline')

    svg = replaceTexts(svg, [title, title2, left1, left2, right, index], reg_text)

    // 图片和矩形
    const left_rrect = PanelDraw.Rect(0, 0, 80, 110, 20, data?.color_left || '#382e32', 1)
    svg = replaceText(svg, left_rrect, reg_difficulty);

    svg = implantImage(svg, 120, 110, 20, 0, 1, data?.cover, reg_cover);
    svg = implantImage(svg, 310, 110, 120, 0, 0.4, data?.background, reg_background);
    svg = implantImage(svg, 56, 30, 145 + 2, 75, 1, data?.rank, reg_rank);

    svg = implantSvgBody(svg, 204, 75, data?.component1, reg_rank) // 27 * 30
    svg = implantSvgBody(svg, 232, 75, data?.component2, reg_rank) // 27 * 30

    // 左侧覆盖部分
    const label1 = torus.getTextPath(data?.label1, 50, 22, 18, 'center baseline', data?.color_label1)
    const label1_rrect = PanelDraw.Rect(30, 6, 40, 20, 10, data?.color_rrect1, 1)

    const label2_width = torus.getTextWidth(data?.label2, 18)
    const label2_rrect_width = Math.max(40, label2_width + 10)
    const label2 = torus.getTextPath(data?.label2, 30 + (label2_rrect_width / 2), 100, 18,
        'center baseline', data?.color_label2)
    const label2_rrect = PanelDraw.Rect(30, 84, label2_rrect_width, 20, 10, data?.color_rrect2, 1)

    svg = replaceTexts(svg, [label1, label2], reg_text)
    svg = replaceTexts(svg, [label1_rrect, label2_rrect], reg_overlay)

    // 右侧覆盖部分
    const stars = drawStars(data?.level || 0)

    svg = implantSvgBody(svg, 420, 35, stars, reg_rank)  //注意。这个组件的锚点在右上角
    svg = implantImage(svg, 45, 30, 385, 4, 1, data?.type, reg_overlay);
    svg = implantSvgBody(svg, 316, 32, data?.component3, reg_rank) // 105 * 15

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