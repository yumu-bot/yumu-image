import {getImageFromV3, setImage, setSvgBody, isASCII, setTexts, isNotEmptyString, getImage} from "../util/util.js";
import {BerlinBold, getMultipleTextPath, poppinsBold, PuHuiTi} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {colorArray} from "../util/color.js";

export function card_MS(data = {
    background: getImageFromV3('card-default.png'),
    cover: getImageFromV3('Maimai', 'Cover', '00000.png'),
    overlay: '', // 覆盖层
    type: '', //dx 图片
    icon1: '',
    icon2: '',
    icon3: '', // dx 评级

    label1: '',
    label1_size: 36,
    label1_colors: ['none', 'none'],

    label2: '',
    label2_size: 48,
    label2_colors: ['none', 'none'],

    left: '',
    right: '',

    title: '',

    main_b: '',
    main_m: '',
    main_l: '',
    main_b_size: 56,
    main_m_size: 36,
    main_l_size: 24,

    additional_b: '',
    additional_m: '',
    additional_b_size: 24,
    additional_m_size: 14,

    rrect1_percent: 0,
    rrect1_color1: '',
    rrect1_color2: '',
    rrect1_base_opacity: 0.1,

    // 这里太定制了
    stars: '', //dx 星星
    component: ''

}) {
    // 读取模板
    let svg = `  <defs>
    <clipPath id="clippath-CG-1">
      <rect width="350" height="710" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CG-2">
      <rect x="60" y="60" width="230" height="230" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Background">
    <rect width="350" height="710" rx="20" ry="20" style="fill: #382E32;"/>
    <g style="clip-path: url(#clippath-CG-1);">
    </g>
  </g>
  <g id="Base">
  </g>
  <g id="Cover">
    <g style="clip-path: url(#clippath-CG-2);">
    </g>
  </g>
  <g id="Component">
  </g>
  <g id="Icon">
  </g>
  <g id="Text">
  </g>`;

    // 正则

    const reg_text = /(?<=<g id="Text">)/
    const reg_component = /(?<=<g id="Component">)/
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CG-1\);">)/
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CG-2\);">)/
    const reg_base = /(?<=<g id="Base">)/

    // 导入文字
    const label1_width = BerlinBold.getTextWidth(data?.label1, 36)
    const label1_rrect = PanelDraw.LinearGradientRect(20, 20, label1_width + 40, 50, 25,
        data.label1_colors, 1, [100, 0], [80, 20]
    )
    const label1 = BerlinBold.getTextPath(data?.label1, 20 + (label1_width + 40) / 2, 56, 36, 'center baseline', '#fff', 1, true)

    const label2_width = BerlinBold.getTextWidth(data?.label2, 48)
    const label2_rrect = PanelDraw.LinearGradientRect(310 - label2_width - 40, 255, label2_width + 40, 50, 25,
        data.label2_colors, 1, [100, 0], [80, 20]
    )
    const label2 = BerlinBold.getTextPath(data?.label2, 310 - (label2_width + 40) / 2, 290, 48, 'center baseline', '#fff', 1, true)

    const base1 = PanelDraw.Rect(30, 30, 290, 310, 20, '#46393f', 1)

    const left = poppinsBold.getTextPath(data?.left, 45, 325, 14, 'left baseline', '#fff')
    const right_font = isASCII(data?.right) ? poppinsBold : PuHuiTi
    const right_size = isASCII(data?.right) ? 14 : 12
    const right = right_font.getTextPath(
        right_font.cutStringTail(data?.right, right_size,
            270 - right_font.getTextWidth(data?.left, right_size)),
        305, 325, right_size, 'right baseline', '#fff')

    const title = poppinsBold.getTextPath(data?.title, 310, 370, 14, 'right baseline', '#fff')
    const main = getMultipleTextPath([{
        font: "poppinsBold",
        text: data?.main_b,
        size: data?.main_b_size,
        color: '#fff',
    }, {
        font: "poppinsBold",
        text: data?.main_m,
        size: data?.main_m_size,
        color: '#fff',
    }, {
        font: "poppinsBold",
        text: data?.main_l,
        size: data?.main_l_size,
        color: '#fff',
    }], 175, 415 + 5, 'center baseline')

    const additional = getMultipleTextPath([{
        font: "poppinsBold",
        text: data?.additional_b,
        size: data?.additional_b_size,
        color: '#fff',
    }, {
        font: "poppinsBold",
        text: data?.additional_m,
        size: data?.additional_m_size,
        color: '#fff',
    }], 135, 445, 'left baseline')

    const color_array = (isNotEmptyString(data?.rrect1_color1) && isNotEmptyString(data?.rrect1_color2)) ?
        [data?.rrect1_color1, data?.rrect1_color2] :
        colorArray.cyan

    const rrect1_top = data?.rrect1_percent > 0 ?
        PanelDraw.LinearGradientRect(130, 450, Math.max(180 * (data?.rrect1_percent || 0), 10), 10, 5, color_array)
        : ''
    const rrect1_base = PanelDraw.LinearGradientRect(130, 450, 180, 10, 5, color_array,
        data?.rrect1_base_opacity || 0.1)

    const base2 = PanelDraw.Rect(30, 350, 290, 120, 20, '#46393f', 1)

    svg = setImage(svg, 0, 0, 350, 710, data?.background, reg_background, 0.6, 'xMidYMid slice', true)
    svg = setSvgBody(svg, 310, 445, data?.stars, reg_text)
    svg = setSvgBody(svg, 30, 480, data?.component, reg_component)

    svg = setTexts(svg, [label1, label2, left, right, title, main, additional], reg_text)

    const overlay_image = getImage(60, 60, 230, 230, data?.overlay, 0.6)
    const cover_image = getImage(60, 60, 230, 230, data?.cover)

    svg = setTexts(svg, [overlay_image, cover_image], reg_cover)

    const type_image = getImage(30, 250, 90, 60, data?.type)
    const icon1_image = getImage(42, 424, 36, 40, data?.icon1)
    const icon2_image = getImage(84, 424, 36, 40, data?.icon2)
    const icon3_image = getImage(232, 420, 56, 30, data?.icon3)

    svg = setTexts(svg, [label1_rrect, label2_rrect, rrect1_top, rrect1_base,
        type_image, icon1_image, icon2_image, icon3_image
    ], reg_component)

    svg = setTexts(svg, [base1, base2], reg_base)

    return svg.toString()
}