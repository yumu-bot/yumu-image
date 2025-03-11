import {
    implantImage, isNotEmptyString, replaceText,
    replaceTexts
} from "../util/util.js";
import {torus, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_H3(data = {
    background: '',
    cover: '',

    title: '',
    left1: '',
    left2: '',

    label1: '',
    label2: '',

    color_rrect: '#fff',
    color_title_text: '#fff',
    color_label_rrect1: '',
    color_label_rrect2: '',
    color_label_text: '#fff',
    color_left1_text: '#bbb',
    color_left2_text: '#bbb',
}) {

    // 读取模板
    let svg = `
      <defs>
    <clipPath id="clippath-CH3-1">
      <rect x="220" y="0" width="680" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CH3-2">
      <rect x="20" y="0" width="238" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
        <filter id="blur-CH3-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
  </defs>
  <g id="Base">
    <rect width="900" height="110" rx="20" ry="20" style="fill: #382e32;"/>
  </g>
  <g id="Color">
  </g>
  <g id="Background">
  <rect x="218" y="0" width="682" height="110" rx="20" ry="20" style="fill: #382e32;"/>
    <g style="clip-path: url(#clippath-CH3-1);" filter="url(#blur-CH3-BG)">
    </g>
  </g>
  <g id="Index">
  </g>
  <g id="Avatar">
  <rect x="20" y="0" width="176" height="110" rx="20" ry="20" style="fill: #382e32;"/>
    <g style="clip-path: url(#clippath-CH3-2);">
    </g>
  </g>
  <g id="Text">
  </g>
  <g id="Label">
  </g>
    `

    // 路径定义
    const reg_text = /(?<=<g id="Text">)/;
    const reg_color = /(?<=<g id="Color">)/;
    const reg_label = /(?<=<g id="Label">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CH3-1\);" filter="url\(#blur-CH3-BG\)">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CH3-2\);">)/;

    // 插入小标签
    const label1_width = torus.getTextWidth(data?.label1 || '', 18) + 16;
    const label2_width = torus.getTextWidth(data?.label2 || '', 18) + 16;

    const text_label1 = torusBold.getTextPath(data?.label1 || '', 38, 23.877, 18, 'left baseline', data?.color_label_text || '#fff');
    const text_label2 = torusBold.getTextPath(data?.label2 || '', 38, 97.877, 18, 'left baseline', data?.color_label_text || '#fff');

    const rrect_label1 = isNotEmptyString(data.label1) ? PanelDraw.Rect(30, 8, label1_width, 20, 10, data.color_label_rrect1 || 'none') : '';
    const rrect_label2 = isNotEmptyString(data.label2) ? PanelDraw.Rect(30, 82, label2_width, 20, 10, data.color_label_rrect2 || 'none') : '';

    // 颜色定义
    const left_rrect = PanelDraw.Rect(0, 0, 60, 110, 20, data?.color_rrect || 'none', 1)
    svg = replaceText(svg, left_rrect, reg_color)

    svg = replaceTexts(svg, [text_label1, text_label2, rrect_label1, rrect_label2], reg_label);

    // 文字定义
    const text_title = torus.cutStringTail(data.title || '', 36, 610);
    const text_left1 = torus.cutStringTail(data.left1 || '', 24, 610);
    const text_left2 = torus.cutStringTail(data.left2 || '', 24, 610);

    const title = torus.getTextPath(text_title, 272, 34.754, 36, 'left baseline', data?.color_title_text || '#fff');
    const left1 = torus.getTextPath(text_left1, 272, 66.836, 24, 'left baseline', data?.color_left1_text || '#bbb');
    const left2 = torus.getTextPath(text_left2, 272, 96.836, 24, 'left baseline', data?.color_left2_text || '#bbb');

    // 插入文字
    svg = replaceTexts(svg, [title, left1, left2], reg_text);

    // 插入图片
    svg = data.cover ? implantImage(svg, 238, 110, 20, 0, 1, data.cover, reg_avatar) : svg;
    svg = data.background ? implantImage(svg,900, 110, 0, 0, 0.2, data.background, reg_background) : svg;

    return svg.toString();

}
