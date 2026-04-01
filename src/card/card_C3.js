import {getRandomString, isASCII, isNotEmptyString, setImage, setSvgBody, setText, setTexts} from "../util/util.js";
import {PuHuiTi, torus, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export function card_C3(data = {
    background: null,
    cover: '',

    title: '',
    title2: '',
    left1: '',
    left2: '',

    label1: '',
    label2: '',
    color_rrect: '#fff',
    color_title_text: '#fff',
    color_title2_text: '#bbb',
    color_label_rrect1: '',
    color_label_rrect2: '',
    color_label_text: '#fff',
    color_left1_text: '#bbb',
    color_left2_text: '#bbb',

    blur: 15,
    
}) {
    const random = getRandomString(6)

    // 读取模板
    let svg = `
      <defs>
    <clipPath id="clippath-CC3-1">
      <rect x="160" y="0" width="740" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CC3-2">
      <rect x="20" y="0" width="176" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
        <filter id="blur-CC3-BG-${random}" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="${data.blur ?? 15}" result="blur"/>
        </filter>
  </defs>
  <g id="Base">
    <rect width="900" height="110" rx="20" ry="20" style="fill: #382e32;"/>
  </g>
  <g id="Color">
  </g>
  <g id="Background">
  <rect x="160" y="0" width="570" height="110" rx="20" ry="20" style="fill: #382e32;"/>
    <g style="clip-path: url(#clippath-CC3-1);" filter="url(#blur-CC3-BG-${random})">
    </g>
  </g>
  <g id="Index">
  </g>
  <g id="Avatar">
  <rect x="20" y="0" width="176" height="110" rx="20" ry="20" style="fill: #382e32;"/>
    <g style="clip-path: url(#clippath-CC3-2);">
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
    const reg_background = new RegExp(`(?<=<g style="clip-path: url\\(#clippath-CC3-1\\);" filter="url\\(#blur-CC3-BG-${random}\\)">)`);
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CC3-2\);">)/;

    // 插入小标签
    const label1_width = torus.getTextWidth(data?.label1 ?? '', 18) + 16;
    const label2_width = torus.getTextWidth(data?.label2 ?? '', 18) + 16;

    const text_label1 = torusBold.getTextPath(data?.label1 ?? '', 38, 23.877, 18, 'left baseline', data?.color_label_text || '#fff');
    const text_label2 = torusBold.getTextPath(data?.label2 ?? '', 38, 97.877, 18, 'left baseline', data?.color_label_text || '#fff');

    const rrect_label1 = isNotEmptyString(data.label1) ? PanelDraw.Rect(30, 8, label1_width, 20, 10, data.color_label_rrect1 || 'none') : '';
    const rrect_label2 = isNotEmptyString(data.label2) ? PanelDraw.Rect(30, 82, label2_width, 20, 10, data.color_label_rrect2 || 'none') : '';

    // 颜色定义
    const left_rrect = PanelDraw.Rect(0, 0, 60, 110, 20, data?.color_rrect || 'none', 1)
    svg = setText(svg, left_rrect, reg_color)

    svg = setTexts(svg, [text_label1, text_label2, rrect_label1, rrect_label2], reg_label);

    // 文字定义

    const title = data?.title
    const title2 = data?.title2
    const font_t2 = (isASCII(title2)) ? torus : PuHuiTi

    let title_max_width = 680
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
    const title2_path = text_title2 ? font_t2.getTextPath(text_title2, 210 + 10 + title_w, (font_t2 === PuHuiTi ? 33 : 34.754), 18, 'left baseline', data.color_title2_text) : '';

    const text_left1 = torus.cutStringTail(data.left1 || '', 24, 680);
    const text_left2 = torus.cutStringTail(data.left2 || '', 24, 680);

    const left1 = torus.getTextPath(text_left1, 210, 66.836, 24, 'left baseline', data?.color_left1_text || '#bbb');
    const left2 = torus.getTextPath(text_left2, 210, 96.836, 24, 'left baseline', data?.color_left2_text || '#bbb');

    // 插入文字
    svg = setTexts(svg, [title_path, title2_path, left1, left2], reg_text);

    // 插入图片
    svg = data.cover ? setImage(svg, 20, 0, 176, 110, data.cover, reg_avatar, 1) :
        setSvgBody(svg, 0, 0, PanelDraw.Rect(0, 0, 176, 110, 20, '#382E32') + torusBold.getTextPath('?', 176 / 2 + 20, 66, 36, 'center baseline', '#fff'), reg_avatar);
    svg = data.background ? setImage(svg, 0, 0, 900, 110, data.background, reg_background, 0.2) : svg;

    return svg;
}