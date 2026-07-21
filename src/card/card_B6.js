import {colorArray} from "../util/color.js";
import {
    clampToInteger,
    getBody,
    getImage,
    getSvg,
    isASCII,
    isEmptyString, normalize,
    round,
    rounds,
    setTexts
} from "../util/util.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getTextPath, poppinsBold, PuHuiTi} from "../util/font.js";

export function card_B6(data = {}, to_left = false) {
    // 1. 使用解构赋值统一设置变量和默认值
    const {
        icon = null,
        title = '',
        left_1 = '',
        left_2 = '',
        value = 11.4514,
        delta = 0,
        delta_top = 0,
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

    const title_width = poppinsBold.getTextWidth(title, 46);

    const is_limit_break = value > limit;

    let base_opacity;
    let bar_colors;
    let bar_width;
    let bar_delta_width;
    let raw_width;
    let raw_delta_width;

    if (is_limit_break) {
        base_opacity = 0.6;
        bar_colors = limit_break_colors ?? colorArray.radiant;
        raw_width = normalize(value, max, limit, 390)
        raw_delta_width = normalize(value - delta, max, limit, 390)
    } else {
        base_opacity = 0.2;
        bar_colors = colors;
        raw_width = normalize(value, limit, min, 390)
        raw_delta_width = normalize(value - delta, limit, min, 390)
    }

    bar_width = clampToInteger(raw_width, 390, 30)
    bar_delta_width = clampToInteger(raw_delta_width, 390, 30)

    let red_width = 0;
    let green_width = 0;
    let real_bar_width = bar_width;
    let delta_color;
    let delta_sign;

    if (delta > 0) {
        real_bar_width = bar_delta_width;
        green_width = bar_width;
        delta_color = '#c2e5c3';
        delta_sign = '+';
    } else if (delta < 0) {
        real_bar_width = bar_width;
        red_width = bar_delta_width;
        delta_color = '#ffcdd2';
        delta_sign = '';
    }

    let icon_x;
    let bar_base_x;
    let bar_x;
    let bar_green_x;
    let bar_red_x;
    let title_x;
    let left_x;
    let value_x;
    let bar_position_x;

    let left1_font;
    let left2_font;
    let left1_size;
    let left2_size;

    if (isASCII(left_1)) {
        left1_font = poppinsBold;
        left1_size = 18;
    } else {
        left1_font = PuHuiTi;
        left1_size = 16;
    }

    if (isASCII(left_2)) {
        left2_font = poppinsBold;
        left2_size = 18;
    } else {
        left2_font = PuHuiTi;
        left2_size = 16;
    }

    if (!to_left) {
        icon_x = 20;
        bar_base_x = 120;
        bar_x = 120;
        bar_green_x = 120;
        bar_red_x = 120;
        title_x = 120;
        left_x = 120 + title_width + 10;
        value_x = 510;
        bar_position_x = [0, 100];
    } else {
        icon_x = 510 - 80;
        bar_base_x = 20;
        bar_x = 390 - real_bar_width + 20;
        bar_green_x = 390 - green_width + 20;
        bar_red_x = 390 - red_width + 20;
        title_x = 510 - 120 + 20;
        left_x = 510 - 120 - title_width - 10 + 20;
        value_x = 20;
        bar_position_x = [100, 0];
    }

    let parsed_icon;

    if (icon?.toString()?.startsWith('<svg')) {
        parsed_icon = getSvg(getBody(icon), icon_x + 10, 30, 60, 60, '#fff', 640, 640);
    } else {
        parsed_icon = getImage(icon_x + 10, 30, 60, 60, icon);
    }

    const icon_base =
        PanelDraw.Rect(icon_x, 20, 80, 80, 10, '#382E32') +
        PanelDraw.LinearGradientRect(
            icon_x, 20, 80, 80, 10,
            icon_colors, 0.4,
            [0, 100], [20, 80]);

    const bar_base = PanelDraw.LinearGradientRect(
        bar_base_x, 70, 390, 30, 15, colors ?? bar_colors, base_opacity, bar_position_x, [55, 45]
    );

    const bar = PanelDraw.LinearGradientRect(
        bar_x, 70, real_bar_width, 30, 15, bar_colors, 1, bar_position_x, [55, 45]
    );

    const bar_red = PanelDraw.LinearGradientRect(
        bar_red_x, 70, red_width, 30, 15, colorArray.dark_red, 1, bar_position_x, [55, 45]
    );

    const bar_green = PanelDraw.LinearGradientRect(
        bar_green_x, 70, green_width, 30, 15, colorArray.light_green, 1, bar_position_x, [55, 45]
    );

    const text_anchor = to_left ? 'right baseline' : 'left baseline';

    const title_path = poppinsBold.getTextPath(title, title_x, 54, 46, text_anchor, '#fff');

    const left1 = getTextPath(left1_font, left_1, left_x, 34, left1_size, text_anchor, '#aaa');

    const left2 = getTextPath(left2_font, left_2, left_x, 54, left2_size, text_anchor, '#aaa');

    const values = rounds(value, round_level ?? 1);

    const val_b = isEmptyString(data_b) ? values.integer : data_b;
    const val_m = isEmptyString(data_b) ? values.decimal : data_m;

    const value_path = poppinsBold.get2SizeTextPath(val_b, val_m, 46, 30, value_x, 54, to_left ? 'left baseline' : 'right baseline');

    const value_width = poppinsBold.getTextWidth(val_b, 46) + poppinsBold.getTextWidth(val_m, 30);

    let delta_x;
    let delta_anchor;

    if (!to_left) {
        delta_x = value_x - value_width - 10;
        delta_anchor = 'right baseline';
    } else {
        delta_x = value_x + value_width + 10;
        delta_anchor = 'left baseline';
    }

    const delta_path = (delta ?? 0) !== 0 ? poppinsBold.getTextPath(
        delta_sign + round(delta, round_level), delta_x, 54, 18, delta_anchor, delta_color
    ) : '';

    const delta_top_path = (delta_top ?? 0) !== 0 ? poppinsBold.getTextPath(
        delta_top.toString(), delta_x, 28, 18, delta_anchor, delta_color
    ) : '';


    svg = setTexts(svg, [title_path, left1, left2, value_path, delta_path, delta_top_path], reg_text);
    svg = setTexts(svg, [parsed_icon, icon_base, bar, bar_red, bar_green, bar_base], reg_label);

    return svg;
}