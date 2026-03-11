import {getImage, isASCII, isNotBlankString} from "../util/util.js";
import {getMultipleTextPath, PuHuiTi, torus, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMaimaiDXStarColor} from "../util/maimai.js";
import {drawLazerMods} from "../util/mod.js";
import {colorArray, PanelColor} from "../util/color.js";

// 【优化2】将纯静态的 SVG 头部/定义提取到函数外部，避免每次调用重复创建字符串
const SVG_DEFS = `
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
    </defs>
    <g id="Base-CI4">
        <rect width="352" height="130" rx="20" ry="20" style="fill: #46393f;"/>
        <rect x="15" width="130" height="130" rx="20" ry="20" style="fill: #382e32;"/>
    </g>
`;

export function card_I4(data = {}) {
    const {
        // background = '',
        cover = '', rank = '', type = '', level = 0,
        title = '', title2 = '', left1 = '', left2 = '', left3 = '', left4 = '',
        index_b = '', index_m = '', index_b_size = 32, index_m_size = 20,
        label1 = '', label2 = '',
        color_text = '#fff', color_label1 = 'none', color_label2 = 'none',
        color_left = '#382e32', color_rrect1 = 'none', color_rrect2 = 'none',
        color_backgrounds = colorArray.gray,
        mods = [], left3_is_right = false
    } = data;

    // 文本字体与字号判定
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

    // 宽度计算
    let title2_width = title2_font.getTextWidth(title2, title2_size);
    let left1_width = Math.min(left1_font.getTextWidth(left1, title_size), 181 - title2_width); // 简化计算: 207-20-10+4 = 181

    if (title2_width > 131) { // 181 - 50 = 131
        left1_width = Math.min(left1_font.getTextWidth(left1, title_size), 131);
        title2_width = 131 - left1_width;
    }

    const title_width = 191 - (isNotBlankString(type) ? 35 : 0);
    const left2_width = 191 - 16 * level;

    // 预生成所有 SVG 元素字符串
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
        { font: "torus", text: index_m, size: index_m_size, color: color_text }
    ], 342, 120, 'right baseline');

    // 图片与组件预生成
    const left_rrect = PanelDraw.Rect(0, 0, 145, 130, 20, color_left, 1);
    const modsData = drawLazerMods(mods, 342, 70, 24, 60, 'right', 8, false, false, false);

    const label1_width = torusBold.getTextWidth(label1, 18);
    const label1_rrect_width = Math.max(40, label1_width + 10);
    const label1_path = torusBold.getTextPath(label1, 25 + (label1_rrect_width / 2), 24, 18, 'center baseline', color_label1);
    const label1_rrect = PanelDraw.Rect(25, 8, label1_rrect_width, 20, 10, color_rrect1, 1);

    const label2_width = torusBold.getTextWidth(label2, 18);
    const label2_rrect_width = Math.max(40, label2_width + 10);
    const label2_path = torusBold.getTextPath(label2, 25 + (label2_rrect_width / 2), 118, 18, 'center baseline', color_label2);
    const label2_rrect = PanelDraw.Rect(25, 102, label2_rrect_width, 20, 10, color_rrect2, 1);

    const stars_path = drawStars(level);

    const background_rrect = PanelDraw.LinearGradientRect(
        0, 0, 350, 130, 20, color_backgrounds, 0.4, [80, 20], [100, 0]
    )

    return `
    ${SVG_DEFS}
    <g id="Background-CI4">
        <g>
            ${background_rrect}
        </g>
    </g>
    <g id="Difficulty-CI4">
        <g style="clip-path: url(#clippath-CI4-2);">
            ${left_rrect}
        </g>
    </g>
    <g id="Cover-CI4">
        <g style="clip-path: url(#clippath-CI4-3);">
             ${getImage(15, 0, 130, 130, cover, 1)}
        </g>
    </g>
    <g id="Rank-CI4">
        ${getImage(152, 96, 56, 30, rank, 1)}
        <g transform="translate(342, 54)">
            ${stars_path}
        </g>
    </g>
    <g id="Overlay-CI4">
        ${label1_rrect}
        ${label2_rrect}
        ${modsData.svg}
        ${getImage(300, 4, 45, 30, type, 1)}
    </g>
    <g id="Text-CI4">
        ${title_path}
        ${title2_path}
        ${left1_path}
        ${left2_path}
        ${left3_path}
        ${index_path}
        ${label1_path}
        ${label2_path}
    </g>`;
}

function drawStars(level = 0) {
    if (!level) return '';
    const color = getMaimaiDXStarColor(level);

    // 【优化4】使用 Array Map 替代 for 循环字符串拼接，微调性能并增加代码整洁度
    return Array.from({ length: level }, (_, i) =>
        PanelDraw.Diamond(-10 - (14 * i), 0, 10, 10, color)
    ).join('');
}