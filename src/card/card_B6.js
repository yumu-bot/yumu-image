import {colorArray} from "../util/color.js";
import {getBody, getSvg, isASCII, isEmptyString, round, rounds, setTexts} from "../util/util.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getTextPath, poppinsBold, PuHuiTi} from "../util/font.js";

export function card_B6(data = {
    icon: null,
    title: '',
    left_1: '',
    left_2: '',
    value: 11.4514,
    delta: 0,
    data_b: '',
    data_m: '',
    min: 0,
    limit: 10,
    max: 20,
    colors: colorArray.gray,
    icon_colors: ['#382E32', '#382E32'],
    limit_break_colors: colorArray.rainbow,
    round_level: 2
}, to_left = false) {
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
    `

    const reg_label = /(?<=<g id="Label">)/;
    const reg_text = /(?<=<g id="Text">)/;

    const title_width = poppinsBold.getTextWidth(data.title, 46)

    const is_limit_break = data.value > data.limit

    const delta = data?.delta ?? 0

    let base_opacity
    let bar_colors
    let bar_width
    let bar_delta_width
    let raw_width
    let raw_delta_width

    if (is_limit_break) {
        base_opacity = 0.6
        bar_colors = data.limit_break_colors ?? colorArray.radiant
        raw_width = (data.value - data.limit) / (data.max - data.limit) * 390
        raw_delta_width = (data.value - delta - data.limit) / (data.max - data.limit) * 390
    } else {
        base_opacity = 0.2
        bar_colors = data.colors
        raw_width = (data.value - data.min) / (data.limit - data.min) * 390
        raw_delta_width = (data.value - delta - data.min) / (data.limit - data.min) * 390
    }

    if (raw_width > 0) {
        bar_width = Math.round(Math.min(390, Math.max(30, raw_width)))
    } else {
        bar_width = 0
    }

    if (raw_delta_width > 0) {
        bar_delta_width = Math.round(Math.min(390, Math.max(30, raw_delta_width)))
    } else {
        bar_delta_width = 0
    }

    let red_width = 0
    let green_width = 0
    let real_bar_width = bar_width
    let delta_color
    let delta_sign

    if (delta > 0) {
        // 自己比对方大，delta 原色在前，bar 绿色在后
        real_bar_width = bar_delta_width
        green_width = bar_width
        delta_color = '#c2e5c3'; //'#93D02E';
        delta_sign = '+'
    } else if (delta < 0) {
        // 自己比对方小，bar 原色在前, delta 红色在后
        real_bar_width = bar_width
        red_width = bar_delta_width
        delta_color = '#ffcdd2'; // '#DE6055';
        delta_sign = ''
    }

    let icon_x
    let bar_base_x
    let bar_x
    let bar_green_x
    let bar_red_x
    let title_x
    let left_x
    let value_x
    let bar_position_x

    let left1_font
    let left2_font
    let left1_size
    let left2_size

    if (isASCII(data.left_1)) {
        left1_font = poppinsBold
        left1_size = 18
    } else {
        left1_font = PuHuiTi
        left1_size = 16
    }

    if (isASCII(data.left_2)) {
        left2_font = poppinsBold
        left2_size = 18
    } else {
        left2_font = PuHuiTi
        left2_size = 16
    }

    if (!to_left) {
        icon_x = 20
        bar_base_x = 120
        bar_x = 120
        bar_green_x = 120
        bar_red_x = 120
        title_x = 120
        left_x = 120 + title_width + 10
        value_x = 510 // 右对齐
        bar_position_x = [0, 100]
    } else {
        icon_x = 510 - 80
        bar_base_x = 20
        bar_x = 390 - real_bar_width + 20
        bar_green_x = 390 - green_width + 20
        bar_red_x = 390 - red_width + 20
        title_x = 510 - 120 + 20 // 右对齐
        left_x = 510 - 120 - title_width - 10 + 20 // 右对齐
        value_x = 20 // 左对齐
        bar_position_x = [100, 0]
    }

    const icon = getSvg(getBody(data.icon), icon_x + 10, 30, 60, 60, '#fff', 640, 640)

    const icon_base =
        PanelDraw.Rect(icon_x, 20, 80, 80, 10, '#382E32') +
        PanelDraw.LinearGradientRect(
            icon_x, 20, 80, 80, 10,
            data.icon_colors, 0.4,
            [0, 100], [20, 80])

    const bar_base = PanelDraw.LinearGradientRect(
        bar_base_x, 70, 390, 30, 15, data.colors ?? bar_colors, base_opacity, bar_position_x, [55, 45]
    )

    const bar = PanelDraw.LinearGradientRect(
        bar_x, 70, real_bar_width, 30, 15, bar_colors, 1, bar_position_x, [55, 45]
    )

    const bar_red = PanelDraw.LinearGradientRect(
        bar_red_x, 70, red_width, 30, 15, colorArray.dark_red, 1, bar_position_x, [55, 45]
    )

    const bar_green = PanelDraw.LinearGradientRect(
        bar_green_x, 70, green_width, 30, 15, colorArray.light_green, 1, bar_position_x, [55, 45]
    )

    const text_anchor = to_left ? 'right baseline' : 'left baseline'

    const title = poppinsBold.getTextPath(data.title, title_x, 54, 46, text_anchor, '#fff'
    )

    const left1 = getTextPath(left1_font, data.left_1, left_x, 34, left1_size, text_anchor, '#aaa')

    const left2 = getTextPath(left2_font, data.left_2, left_x, 54, left2_size, text_anchor, '#aaa')

    const values = rounds(data.value, data.round_level ?? 1)

    const data_b = isEmptyString(data.data_b) ? values.integer : (data.data_b ?? '')
    const data_m = isEmptyString(data.data_b) ? values.decimal : (data.data_m ?? '')

    const value = poppinsBold.get2SizeTextPath(data_b, data_m, 46, 30, value_x, 54, to_left ? 'left baseline' : 'right baseline'
    )

    const value_width = poppinsBold.getTextWidth(data_b, 46) + poppinsBold.getTextWidth(data_m, 30)

    let delta_x
    let delta_anchor

    if (!to_left) {
        delta_x = value_x - value_width - 10
        delta_anchor = 'right baseline'
    } else {
        delta_x = value_x + value_width + 10
        delta_anchor = 'left baseline'
    }

    const delta_value = delta !== 0 ? poppinsBold.getTextPath(
        delta_sign + round(delta, 2), delta_x, 54, 18, delta_anchor, delta_color
    ) : ''

    svg = setTexts(svg, [title, left1, left2, value, delta_value], reg_text)
    svg = setTexts(svg, [icon, icon_base, bar, bar_red, bar_green, bar_base], reg_label)


    return svg
}