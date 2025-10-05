import {
    setImage,
    setTexts
} from "../util/util.js";
import {getMultipleTextPath, poppinsBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_D2(data = {
    background: '',
    title: '',
    title_m: '',

    left: '',
    left_color: '',
    left_rrect_color: '',

    right: '',
    right_color: '',
    right_rrect_color: '',

    bottom_left: '',
    bottom_right: '',
}) {
    let svg = `
  <defs>
    <clipPath id="clippath-CD2-1">
        <rect width="150" height="120" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Base">
    <rect width="150" height="120" rx="20" ry="20" style="fill: #382e32;"/>
  </g>
  <g id="Background">
    <g style="clip-path: url(#clippath-CD2-1);">
    </g>
  </g>
  <g id="Text">
  </g>
`
    // 路径定义
    const reg_text = /(?<=<g id="Text">)/
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CD2-1\);">)/

    // 文字定义
    const title = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: data?.title ?? '',
            size: 40,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: data?.title_m ?? '',
            size: 30,
            color: '#fff'
        }], 75, 77, 'center baseline', true
    )

    const left_width = poppinsBold.getTextWidth(data?.left ?? '', 16)
    const left_rrect_width = Math.max(48, left_width + 20)

    const left = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: data?.left ?? '',
            size: 16,
            color: data?.left_color || '#fff'
        }], 6 + (left_rrect_width) / 2, 22, 'center baseline'
    )

    const left_rrect = PanelDraw.Rect(6, 6, left_rrect_width, 20, 10, data?.left_rrect_color)

    const right = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: data?.right ?? '',
            size: 16,
            color: data?.right_color || '#fff'
        }], 120, 22, 'center baseline'
    )

    const right_rrect = PanelDraw.Rect(150 - 6 - 48, 6, 48, 20, 10, data?.right_rrect_color)

    const bottom_left = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: data?.bottom_left ?? '',
            size: 14,
            color: '#fff'
        }], 6, 112, 'left baseline', true
    )

    const bottom_right = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: data?.bottom_right ?? '',
            size: 14,
            color: '#fff'
        }], 144, 112, 'right baseline', true
    )

    svg = setTexts(svg,
        [title, left, right, bottom_left, bottom_right, left_rrect, right_rrect],
        reg_text)

    svg = setImage(svg, 0, 0, 150, 120, data?.background ?? '', reg_background, 0.8)

    return svg.toString()
}
