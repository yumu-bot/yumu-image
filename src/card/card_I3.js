import { getImage, isASCII, isNotBlankString } from "../util/util.js";
import { getMultipleTextPath, PuHuiTi, torus, torusBold } from "../util/font.js";
import { PanelDraw } from "../util/panelDraw.js";
import { getMaimaiDXStarColor } from "../util/maimai.js";

// 【优化】静态 SVG 定义外提
const SVG_DEFS_I3 = `
    <defs>
    <clipPath id="clippath-CI3-1">
        <rect x="100" width="252" height="130" rx="20" ry="20" style="fill: none;"/>
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
`;

export function card_I3(data = {}) {
    // 【优化】解构赋值，减少 data?. 访问开销
    const {
        background = '', cover = '', rank = '', type = '', level = 0,
        title = '', title2 = '', left1 = '', left2 = '', left3 = '', left4 = '',
        index_b = '', index_m = '', index_r = '',
        index_b_size = 32, index_m_size = 20, index_r_size = 18,
        label1 = '', label2 = '', label3 = '',
        color_text = '#fff', color_label1 = 'none', color_label2 = 'none', color_label3 = 'none',
        color_left = '#382e32', color_rrect1 = 'none', color_rrect2 = 'none', color_rrect3 = 'none',
        component1 = '', component2 = '', component3 = '',
        left3_is_right = false
    } = data;

    // 字体判定逻辑保持
    const isTitleAscii = isASCII(title);
    const isTitle2Ascii = isASCII(title2);
    const isLeft1Ascii = isASCII(left1);
    const isLeft2Ascii = isASCII(left2);
    const isLeft3Ascii = isASCII(left3);
    const isLeft4Ascii = isASCII(left4);

    const title_size = isTitleAscii ? 22 : 20;
    const title2_size = isTitle2Ascii ? 16 : 14;
    const left1_size = isLeft1Ascii ? 16 : 14;
    const left2_size = isLeft2Ascii ? 16 : 14;
    const left3_size = isLeft3Ascii ? 24 : 22;
    const left4_size = isLeft4Ascii ? 16 : 14;

    const title_font = isTitleAscii ? torus : PuHuiTi;
    const title2_font = isTitle2Ascii ? torus : PuHuiTi;
    const left1_font = isLeft1Ascii ? torus : PuHuiTi;
    const left2_font = isLeft2Ascii ? torus : PuHuiTi;
    const left3_font = isLeft3Ascii ? torus : PuHuiTi;
    const left4_font = isLeft4Ascii ? torus : PuHuiTi;

    // 宽度计算优化
    let title2_width = title2_font.getTextWidth(title2, title2_size);
    let left1_width = Math.min(left1_font.getTextWidth(left1, title_size), 181 - title2_width);

    if (title2_width > 131) {
        left1_width = Math.min(left1_font.getTextWidth(left1, title_size), 131);
        title2_width = 131 - left1_width;
    }

    const title_width = 191 - (isNotBlankString(type) ? 30 : 0);
    const left2_width = 191 - (isNotBlankString(component3) ? 105 : 0) - 16 * level;

    // 预生成文本 Path
    const title_path = title_font.getTextPath(title_font.cutStringTail(title, title_size, title_width), 155, 26, title_size, 'left baseline', '#fff');
    const title2_path = title2_font.getTextPath(title2_font.cutStringTail(title2, title2_size, title2_width), 342, 46, title2_size, 'right baseline', '#bbb');
    const left1_path = left1_font.getTextPath(left1_font.cutStringTail(left1, left1_size, left1_width), 155, 46, left1_size, 'left baseline', '#fff');
    const left2_path = left2_font.getTextPath(left2_font.cutStringTail(left2, left2_size, left2_width), 155, 66, left2_size, 'left baseline', '#fff');

    const left3_path = getMultipleTextPath([
        { font: left3_font, text: left3, size: left3_size, color: color_text },
        { font: left4_font, text: left4, size: left4_size, color: color_text }
    ], left3_is_right ? 342 : 155, 90, left3_is_right ? 'right baseline' : 'left baseline');

    const index_path = getMultipleTextPath([
        { font: "torus", text: index_b, size: index_b_size, color: color_text },
        { font: "torus", text: index_m, size: index_m_size, color: color_text },
        { font: "torus", text: index_r, size: index_r_size, color: color_text }
    ], 342, 120, 'right baseline');

    // 标签矩形逻辑
    const label1_width = torusBold.getTextWidth(label1, 18);
    const label1_rrect_width = Math.max(40, label1_width + 10);
    const label1_path = torusBold.getTextPath(label1, 25 + (label1_rrect_width / 2), 24, 18, 'center baseline', color_label1);
    const label1_rrect = PanelDraw.Rect(25, 8, label1_rrect_width, 20, 10, color_rrect1, 1);

    const label2_width = torusBold.getTextWidth(label2, 18);
    const label2_rrect_width = Math.max(40, label2_width + 10);
    const label2_path = torusBold.getTextPath(label2, 25 + (label2_rrect_width / 2), 118, 18, 'center baseline', color_label2);
    const label2_rrect = PanelDraw.Rect(25, 102, label2_rrect_width, 20, 10, color_rrect2, 1);

    const label3_width = torusBold.getTextWidth(label3, 18);
    const label3_rrect_width = Math.max(40, label3_width + 10);
    const label3_path = torusBold.getTextPath(label3, 135 - (label3_rrect_width / 2), 118, 18, 'center baseline', color_label3);
    const label3_rrect = PanelDraw.Rect(135 - label3_rrect_width, 102, label3_rrect_width, 20, 10, color_rrect3, 1);

    const stars_path = drawStars(level);
    const left_rrect = PanelDraw.Rect(0, 0, 145, 130, 20, color_left, 1);

    // 一次性组装 SVG
    return `
    ${SVG_DEFS_I3}
    <g id="Background-CI3">
        <g filter="url(#blur-CI3-BG)" style="clip-path: url(#clippath-CI3-1);">
            ${getImage(0, 0, 352, 130, background, 0.4)}
        </g>
    </g>
    <g id="Difficulty-CI3">
        <g style="clip-path: url(#clippath-CI3-2);">
            ${left_rrect}
        </g>
    </g>
    <g id="Cover-CI3">
        <g style="clip-path: url(#clippath-CI3-3);">
            ${getImage(15, 0, 130, 130, cover, 1)}
        </g>
    </g>
    <g id="Rank-CI3">
        ${getImage(152, 96, 56, 30, rank, 1)}
        <g transform="translate(290, 68)">${component1}</g>
        <g transform="translate(318, 68)">${component2}</g>
        <g transform="translate(342, 54)">${stars_path}</g>
        <g transform="translate(236, 54)">${component3}</g>
    </g>
    <g id="Overlay-CI3">
        ${label1_rrect}
        ${label2_rrect}
        ${label3_rrect}
        ${getImage(305, 2, 45, 30, type, 1)}
    </g>
    <g id="Text-CI3">
        ${title_path}
        ${title2_path}
        ${left1_path}
        ${left2_path}
        ${left3_path}
        ${index_path}
        ${label1_path}
        ${label2_path}
        ${label3_path}
    </g>`;
}

function drawStars(level = 0) {
    if (!level) return '';
    const color = getMaimaiDXStarColor(level);
    return Array.from({ length: level }, (_, i) =>
        PanelDraw.Diamond(-10 - (14 * i), 0, 10, 10, color)
    ).join('');
}