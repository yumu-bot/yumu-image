import {colorArray} from "../util/color.js";
import {getBody, getImage, getSvg, isASCII, isEmptyString, rounds, setTexts} from "../util/util.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getTextPath, poppinsBold, PuHuiTi} from "../util/font.js";

export function card_B7(data = {
    icon: null,
    title: '',
    left_1: '',
    left_2: '',
    value: 11.4514,
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

    const is_limit_break = data.value > data.limit

    let base_opacity
    let bar_colors
    let bar_width
    let raw_width

    if (is_limit_break) {
        base_opacity = 0.8
        bar_colors = data.limit_break_colors ?? colorArray.radiant
        raw_width = (data.value - data.limit) / (data.max - data.limit) * 320
    } else {
        base_opacity = 0.2
        bar_colors = data.colors
        raw_width = (data.value - data.min) / (data.limit - data.min) * 320
    }

    if (raw_width > 0) {
        bar_width = Math.round(Math.min(320, Math.max(30, raw_width)))
    } else {
        bar_width = 0
    }

    let icon_x
    let bar_x
    let title_x
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
        icon_x = 0
        bar_x = 0
        title_x = 95
        value_x = 320 // 右对齐
        bar_position_x = [0, 100]
    } else {
        icon_x = 320 - 80
        bar_x = 320 - bar_width
        title_x = 320 - 95 // 右对齐
        value_x = 0 // 左对齐
        bar_position_x = [100, 0]
    }

    let icon

    if (data.icon != null && data.icon?.toString()?.startsWith('data:image')) {
        icon = getImage(icon_x + 10, 10, 60, 60, data.icon)
    } else {
        icon = getSvg(getBody(data.icon), icon_x + 10, 10, 60, 60, '#fff', 640, 640)
    }

    const icon_base =
        PanelDraw.Rect(icon_x, 0, 80, 80, 10, '#382E32') +
        PanelDraw.LinearGradientRect(
            icon_x, 0, 80, 80, 10,
            data.icon_colors, 0.4,
            [0, 100], [20, 80])

    const bar_base = PanelDraw.LinearGradientRect(
        0, 95, 320, 30, 15, data.colors ?? bar_colors, base_opacity, bar_position_x, [55, 45]
    )

    const bar = PanelDraw.LinearGradientRect(
        bar_x, 95, bar_width, 30, 15, bar_colors, 1, bar_position_x, [55, 45]
    )

    const text_anchor = to_left ? 'right baseline' : 'left baseline'

    const title = poppinsBold.getTextPath(data.title, title_x, 30, 40, text_anchor, '#fff'
    )

    const left1 = getTextPath(left1_font, data.left_1, title_x, 55, left1_size, text_anchor, '#aaa')

    const left2 = getTextPath(left2_font, data.left_2, title_x, 78, left2_size, text_anchor, '#aaa')

    const values = rounds(data.value, data.round_level ?? 1)

    const data_b = isEmptyString(data.data_b) ? values.integer : (data.data_b ?? '')
    const data_m = isEmptyString(data.data_b) ? values.decimal : (data.data_m ?? '')

    const value = poppinsBold.get2SizeTextPath(data_b, data_m, 46, 30, value_x, 80, to_left ? 'left baseline' : 'right baseline'
    )

    svg = setTexts(svg, [title, left1, left2, value], reg_text)
    svg = setTexts(svg, [icon, icon_base, bar, bar_base], reg_label)


    return svg
}