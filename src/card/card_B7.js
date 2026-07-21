import {colorArray} from "../util/color.js";
import {getBody, getImage, getSvg, isASCII, isEmptyString, rounds, setTexts, normalize, clampToInteger} from "../util/util.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getTextPath, poppinsBold, PuHuiTi} from "../util/font.js";

export function card_B7(data = {}, to_left = false) {
    const {
        icon = null,
        title = '',
        left_1 = '',
        left_2 = '',
        value = 11.4514,
        data_b = '',
        data_m = '',
        min = 0,
        limit = 10,
        max = 20,
        colors = colorArray.gray,
        icon_colors = ['#382E32', '#382E32'],
        limit_break_colors = colorArray.rainbow,
        round_level = 2
    } = data;

    let svg = `
    <defs>
</defs>
  <g id="Background">
  </g>
  <g id="Body">
    <g id="Label">
    </g>
    <g id="Text">
    </g>
  </g>
    `;

    const reg_label = /(?<=<g id="Label">)/;
    const reg_text = /(?<=<g id="Text">)/;

    const is_limit_break = value > limit;

    // 2. 一行确定当前使用的区间上下限 [low, high]
    const [low, high] = is_limit_break ? [limit, max] : [min, limit];

    const base_opacity = is_limit_break ? 0.8 : 0.2;
    const bar_colors = is_limit_break ? (limit_break_colors ?? colorArray.radiant) : colors;

    const raw_width = normalize(value, low, high, 320);
    const bar_width = clampToInteger(raw_width, 30, 320);

    let icon_x;
    let bar_x;
    let title_x;
    let value_x;
    let bar_position_x;

    const left1_font = isASCII(left_1) ? poppinsBold : PuHuiTi;
    const left1_size = isASCII(left_1) ? 18 : 16;

    const left2_font = isASCII(left_2) ? poppinsBold : PuHuiTi;
    const left2_size = isASCII(left_2) ? 18 : 16;

    if (!to_left) {
        icon_x = 0;
        bar_x = 0;
        title_x = 95;
        value_x = 320; // 右对齐
        bar_position_x = [0, 100];
    } else {
        icon_x = 320 - 80;
        bar_x = 320 - bar_width;
        title_x = 320 - 95; // 右对齐
        value_x = 0; // 左对齐
        bar_position_x = [100, 0];
    }

    let parsed_icon;

    if (icon?.toString()?.startsWith('<svg')) {
        parsed_icon = getSvg(getBody(icon), icon_x + 10, 10, 60, 60, '#fff', 640, 640);
    } else {
        parsed_icon = getImage(icon_x + 10, 10, 60, 60, icon);
    }

    const icon_base =
        PanelDraw.Rect(icon_x, 0, 80, 80, 10, '#382E32') +
        PanelDraw.LinearGradientRect(
            icon_x, 0, 80, 80, 10,
            icon_colors, 0.4,
            [0, 100], [20, 80]);

    const bar_base = PanelDraw.LinearGradientRect(
        0, 95, 320, 30, 15, colors ?? bar_colors, base_opacity, bar_position_x, [55, 45]
    );

    const bar = PanelDraw.LinearGradientRect(
        bar_x, 95, bar_width, 30, 15, bar_colors, 1, bar_position_x, [55, 45]
    );

    const text_anchor = to_left ? 'right baseline' : 'left baseline';

    const title_path = poppinsBold.getTextPath(title, title_x, 30, 40, text_anchor, '#fff');

    const left1 = getTextPath(left1_font, left_1, title_x, 55, left1_size, text_anchor, '#aaa');

    const left2 = getTextPath(left2_font, left_2, title_x, 78, left2_size, text_anchor, '#aaa');

    const values = rounds(value, round_level ?? 1);

    const val_b = isEmptyString(data_b) ? values.integer : data_b;
    const val_m = isEmptyString(data_b) ? values.decimal : data_m;

    const value_path = poppinsBold.get2SizeTextPath(val_b, val_m, 46, 30, value_x, 80, to_left ? 'left baseline' : 'right baseline');

    svg = setTexts(svg, [title_path, left1, left2, value_path], reg_text);
    svg = setTexts(svg, [parsed_icon, icon_base, bar, bar_base], reg_label);

    return svg;
}