import { getImage, isASCII, isNotEmptyString } from "../util/util.js";
import { torus, PuHuiTi, torusBold, getMultipleTextPath } from "../util/font.js";
import { PanelDraw } from "../util/panelDraw.js";
import { drawLazerMods } from "../util/mod.js";
import { PanelColor } from "../util/color.js";

// 【优化】静态 SVG 定义与基础底座外提
const SVG_DEFS_C = `
  <defs>
    <clipPath id="clippath-CH-1">
      <rect x="160" y="0" width="570" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CH-2">
      <rect x="20" y="0" width="176" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Base">
    <rect width="900" height="110" rx="20" ry="20" style="fill: #382e32;"/>
  </g>
`;

export function card_C(data = {}) {
    // 【优化】结构化默认值，减少 data?. 访问次数
    const {
        background = '', cover = '', type = '',
        title = '', title2 = '', left1 = '', left2 = '',
        index_b = '', index_m = '', index_l = '',
        index_b_size = 48, index_m_size = 36, index_l_size = 24,
        label1 = '', label2 = '', label3 = '', label4 = '', label5 = '',
        mods_arr = [],
        color_title2 = '#aaa', color_right, color_left, color_index = '#fff',
        color_label1 = 'none', color_label2 = 'none', color_label3 = 'none',
        color_label4 = 'none', color_label5 = 'none',
        color_label12 = '#fff', color_left12 = '#fff',
        font_title2 = 'torus', font_label4 = 'torus'
    } = data;

    // 1. 处理模组与宽度限制
    const mods_data = drawLazerMods(mods_arr, 710, 24, 60, 160, 'right', 6, true, false);

    // 2. 字体选择
    const font_l4 = (font_label4 === 'PuHuiTi') ? PuHuiTi : torus;
    const font_t2 = (font_title2 === 'PuHuiTi') ? PuHuiTi : torus;

    // 3. 标签与矩形计算
    const label1_width = torus.getTextWidth(label1, 18) + 16;
    const label2_width = torus.getTextWidth(label2, 18) + 16;
    const label3_width = torus.getTextWidth(label3, 24) + 30;
    const label4_width = font_l4.getTextWidth(label4, 24) + 30;
    const label5_width = torus.getTextWidth(label5, 18) + 16;

    const label1_path = label1 ? torusBold.getTextPath(label1, 38, 23.877, 18, 'left baseline', color_label12) : '';
    const label2_path = label2 ? torusBold.getTextPath(label2, 38, 97.877, 18, 'left baseline', color_label12) : '';
    const label3_path = label3 ? torus.getTextPath(label3, 710 - label3_width / 2, 34.836, 24, 'center baseline', '#fff') : '';
    const label4_path = label4 ? font_l4.getTextPath(label4, 710 - label4_width / 2, 78.572, 24, 'center baseline', '#fff') : '';
    const label5_path = label5 ? torusBold.getTextPath(label5, 177, 97.877, 18, 'right baseline', color_label12) : '';

    const rrect_label1 = label1 ? PanelDraw.Rect(30, 8, label1_width, 20, 10, color_label1) : '';
    const rrect_label2 = label2 ? PanelDraw.Rect(30, 82, label2_width, 20, 10, color_label2) : '';
    const rrect_label3 = label3 ? PanelDraw.Rect(710 - label3_width, 10, label3_width, 34, 17, color_label3) : '';
    const rrect_label4 = label4 ? PanelDraw.Rect(710 - label4_width, 54, label4_width, 34, 17, color_label4) : '';
    const rrect_label5 = label5 ? PanelDraw.Rect(185 - label5_width, 82, label5_width, 20, 10, color_label5) : '';

    // 4. 指数区域 (Index) 计算
    const index_path = getMultipleTextPath([
            { font: torus, text: index_b, size: index_b_size, color: color_index },
            { font: torus, text: index_m, size: index_m_size, color: color_index },
        ], 815, 73.672, 'center baseline') +
        (index_l ? torus.getTextPath(index_l, 815, 33.672, index_l_size, 'center baseline', color_index) : '');

    // 5. 左右装饰矩形渲染逻辑
    const rrect_left_svg = Array.isArray(color_left)
        ? PanelDraw.LinearGradientRect(0, 0, 60, 110, 20, color_left, 1, [40, 60], [0, 100])
        : PanelDraw.Rect(0, 0, 60, 110, 20, isNotEmptyString(color_left) ? color_left : PanelColor.top(342), 1);

    const rrect_right_svg = Array.isArray(color_right)
        ? PanelDraw.LinearGradientRect(680, 0, 220, 110, 20, color_right, 1, [0, 100], [20, 80])
        : PanelDraw.Rect(680, 0, 220, 110, 20, isNotEmptyString(color_right) ? color_right : PanelColor.top(342), 1);

    // 6. 标题与副标题动态权衡
    let title_max_width = 500 - (Math.max(mods_data.width, label3_width - 10));
    let left_max_width = 500 - mods_data.width;

    const is_title_not_equal = title !== title2;
    let title_w = Math.min(title_max_width, torus.getTextWidth(title, 36));
    let title2_w = title_max_width - title_w - 10;

    // 针对非 ASCII 副标题的预裁切逻辑优化
    if (is_title_not_equal && isNotEmptyString(title2) && !isASCII(title2.substring(0, 4))) {
        const t2_prefix_w = font_t2.getTextWidth(title2.substring(0, 3) + '...', 18);
        if (title2_w < t2_prefix_w) {
            title_w = title_max_width - t2_prefix_w - 20;
        }
    }

    const text_title = torus.cutStringTail(title, 36, title_w);
    title_w = torus.getTextWidth(text_title, 36);
    title2_w = title_max_width - title_w - 10;

    const text_title2 = (is_title_not_equal && title2_w > 0) ? font_t2.cutStringTail(title2, 18, title2_w, true) : '';

    const title_path = torus.getTextPath(text_title, 210, 34.754, 36, 'left baseline', '#fff');
    const title2_path = text_title2 ? font_t2.getTextPath(text_title2, 210 + 10 + title_w, (font_title2 === 'PuHuiTi' ? 33 : 34.754), 18, 'left baseline', color_title2) : '';

    const left1_path = torus.getTextPath(torus.cutStringTail(left1, 24, left_max_width), 210, 66.836, 24, 'left baseline', color_left12);
    const left2_path = torus.getTextPath(torus.cutStringTail(left2, 24, left_max_width), 210, 96.836, 24, 'left baseline', color_left12);

    // 7. 最终组装
    return `
    ${SVG_DEFS_C}
    <g id="Color">
        ${rrect_left_svg}
        ${rrect_right_svg}
    </g>
    <g id="Background">
        <rect x="160" y="0" width="570" height="110" rx="20" ry="20" style="fill: #382e32;"/>
        <g style="clip-path: url(#clippath-CH-1);">
            ${getImage(0, 0, 900, 110, background, 0.2)}
        </g>
    </g>
    <g id="Index">
        ${index_path}
    </g>
    <g id="Avatar">
        <rect x="20" y="0" width="176" height="110" rx="20" ry="20" style="fill: #382e32;"/>
        <g style="clip-path: url(#clippath-CH-2);">
            ${getImage(20, 0, 176, 110, cover, 1)}
        </g>
    </g>
    <g id="Mods">
        ${mods_data.svg}
    </g>
    <g id="Text">
        ${title_path}
        ${title2_path}
        ${left1_path}
        ${left2_path}
    </g>
    <g id="Label">
        ${getImage(140, 4, 45, 30, type, 1)}
        ${rrect_label1}
        ${rrect_label2}
        ${rrect_label3}
        ${rrect_label4}
        ${rrect_label5}
        ${label1_path}
        ${label2_path}
        ${label3_path}
        ${label4_path}
        ${label5_path}
    </g>`;
}