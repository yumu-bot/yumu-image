import {
    implantImage, implantSvgBody, isASCII, replaceText, replaceTexts,
} from "../util/util.js";
import {getMultipleTextPath, PuHuiTi, torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

// maimai / CHUNITHM 多成绩面板
export function card_I(data = {
    background: '',
    cover: '',
    rank: '',
    type: '',

    title: '',
    left1: '',
    left2: '',
    right: '',
    index_b: '',
    index_m: '',
    index_l: '', // 右下角左边的小字
    index_b_size: 40,
    index_m_size: 24,
    index_l_size: 18,
    label1: '',
    label2: '',

    color_text: '#fff',
    color_label1: 'none',
    color_label2: 'none',

    color_left: 'none',
    color_rrect1: 'none',
    color_rrect2: 'none',

    color_component1: '', // 星星 //注意。这个组件的锚点在左下角
    color_component2: '',
}) {
    // 模板
    let svg = `
    <defs>
    <clipPath id="clippath-CI-1">
        <rect x="140" width="290" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI-2">
         <rect width="80" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI-3">
         <rect x="20" width="160" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
        <filter id="blur-CI-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="Base-CI">
        <rect width="430" height="110" rx="20" ry="20" style="fill: #46393f;"/>
        <rect x="20" width="160" height="110" rx="20" ry="20" style="fill: #382e32;"/>
    </g>
    <g id="Background-CI">
        <g filter="url(#blur-CI-BG)" style="clip-path: url(#clippath-CI-1);">
        </g>
    </g>
    <g id="Difficulty-CI">
        <g style="clip-path: url(#clippath-CI-2);">
        </g>
    </g>
    <g id="Cover-CI">
        <g style="clip-path: url(#clippath-CI-3);">
        </g>
    </g>
    <g id="Rank-CI">
    </g>
    <g id="Overlay-CI">
    </g>
    <g id="Text-CI">
    </g>`;

    // 正则
    const reg_text = /(?<=<g id="Text-CI">)/;
    const reg_overlay = /(?<=<g id="Overlay-CI">)/;
    const reg_rank = /(?<=<g id="Rank-CI">)/;


    const reg_background = /(?<=<g filter="url\(#blur-CI-BG\)" style="clip-path: url\(#clippath-CI-1\);">)/
    const reg_difficulty = /(?<=<g style="clip-path: url\(#clippath-CI-2\);">)/
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CI-3\);">)/

    const text_color = data?.color_text || '#fff'

    // 文本
    const title_size = isASCII(data?.title) ? 24 : 22;
    const left1_size = isASCII(data?.left1) ? 16 : 14;
    const left2_size = isASCII(data?.left2) ? 16 : 14;

    const title_font = isASCII(data?.title) ? torus : PuHuiTi;
    const left1_font = isASCII(data?.left1) ? torus : PuHuiTi;
    const left2_font = isASCII(data?.left2) ? torus : PuHuiTi;

    const title = title_font.getTextPath(
        title_font.cutStringTail(data?.title || '', title_size, 230), 190, 24, title_size, 'left baseline', '#fff')
    const left1 = left1_font.getTextPath(
        left1_font.cutStringTail(data?.left1 || '', left1_size, 230), 190, 44, left1_size, 'left baseline', '#fff')
    const left2 = left2_font.getTextPath(
        left2_font.cutStringTail(data?.left2 || '', left2_size,
            230 - torus.getTextWidth(data?.right, 16) - 5), 190, 64, left2_size, 'left baseline', '#fff')

    const right = torus.getTextPath(data?.right, 420, 64, 16, 'right baseline', '#fff')

    const index_arr = [
        {
            font: "torus",
            text: data?.index_l,
            size: data?.index_l_size || 18,
            color: text_color,
        },
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
    ]

    const index = getMultipleTextPath(index_arr, 420, 100, 'right baseline')

    svg = replaceTexts(svg, [title, left1, left2, right, index], reg_text)

    // 图片和矩形
    const left_rrect = PanelDraw.Rect(0, 0, 80, 110, 20, data?.color_left || '#382e32', 1)
    svg = replaceText(svg, left_rrect, reg_difficulty);

    svg = implantImage(svg, 160, 110, 20, 0, 1, data?.cover, reg_cover);

    svg = implantImage(svg, 290, 110, 140, 0, 0.4, data?.background, reg_background);

    svg = implantImage(svg, 56, 30, 185 + 2, 75, 1, data?.rank, reg_rank);

    svg = implantSvgBody(svg, 248, 86, data?.color_component1, reg_rank) //注意。这个组件的锚点在左下角

    svg = implantSvgBody(svg, 248, 90, data?.color_component2, reg_rank)

    // 左侧覆盖部分
    svg = implantImage(svg, 45, 30, 128, 0, 1, data?.type, reg_overlay);

    const label1 = torus.getTextPath(data?.label1, 50, 22, 18, 'center baseline', data?.color_label1)
    const label1_rrect = PanelDraw.Rect(30, 6, 40, 20, 10, data?.color_rrect1, 1)

    const label2_width = torus.getTextWidth(data?.label2, 18)
    const label2_rrect_width = Math.max(40, label2_width + 10)
    const label2 = torus.getTextPath(data?.label2, 30 + (label2_rrect_width / 2), 100, 18,
        'center baseline', data?.color_label2)
    const label2_rrect = PanelDraw.Rect(30, 84, label2_rrect_width, 20, 10, data?.color_rrect2, 1)

    svg = replaceTexts(svg, [label1, label2], reg_text)
    svg = replaceTexts(svg, [label1_rrect, label2_rrect], reg_overlay)

    return svg.toString()
}

