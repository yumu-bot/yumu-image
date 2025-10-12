import {
    setImage, readTemplate,
    setText,
    setTexts, isASCII, isNotEmptyString
} from "../util/util.js";
import {torus, PuHuiTi, torusBold, getMultipleTextPath} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {drawLazerMods} from "../util/mod.js";

export function card_C(data = {
    background: '',
    cover: '',
    type: '',

    title: '',
    title2: '',
    left1: '',
    left2: '',
    index_b: '',
    index_m: '',
    index_l: '', // 小字
    index_b_size: 48,
    index_m_size: 36,
    index_l_size: 24,
    label1: '',
    label2: '',
    label3: '',
    label4: '',
    label5: '',
    mods_arr: [],

    color_title2: '#aaa',
    color_right: '#fff',
    color_left: '#fff',
    color_index: '#fff',
    color_label1: '',
    color_label2: '',
    color_label3: '',
    color_label4: '',
    color_label5: '',
    color_label12: '#fff',
    color_left12: '#fff',

    font_title2: 'torus',
    font_label4: 'torus',

}) {
    // 读取模板
    let svg = readTemplate('template/Card_H.svg');

    // 路径定义
    const reg_text = /(?<=<g id="Text">)/;
    const reg_mod = /(?<=<g id="Mods">)/;
    const reg_label = /(?<=<g id="Label">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CH-1\);">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CH-2\);">)/;
    const reg_color_right = '${color_right}';
    const reg_color_left = '${color_left}';

    // 插入模组
    const mods_arr = data.mods_arr

    // 160 刚好可以展示单模组，并且收起多模组
    const mods_data =
        drawLazerMods(mods_arr, 710, 24, 60, 160, 'right', 6, true, false)

    svg = setText(svg, mods_data.svg, reg_mod);

    // 插入四个小标签
    const color_title2 = data.color_title2 ?? 'none';
    const color_label1 = data.color_label1 ?? 'none';
    const color_label2 = data.color_label2 ?? 'none';
    const color_label3 = data.color_label3 ?? 'none';
    const color_label4 = data.color_label4 ?? 'none';
    const color_label5 = data.color_label5 ?? 'none';

    const font_l4 = (data?.font_label4 === 'PuHuiTi') ? PuHuiTi : torus;
    const font_t2 = (data?.font_title2 === 'PuHuiTi') ? PuHuiTi : torus;

    const label1_width = torus.getTextWidth(data?.label1 ?? '', 18) + 16;
    const label2_width = torus.getTextWidth(data?.label2 ?? '', 18) + 16;
    const label3_width = torus.getTextWidth(data?.label3 ?? '', 24) + 30;
    const label4_width = font_l4.getTextWidth(data?.label4 ?? '', 24) + 30;
    const label5_width = torus.getTextWidth(data?.label5 ?? '', 18) + 16;

    const label1 = torusBold.getTextPath(data?.label1 ?? '', 38, 23.877, 18, 'left baseline', data?.color_label12 || '#fff');
    const label2 = torusBold.getTextPath(data?.label2 ?? '', 38, 97.877, 18, 'left baseline', data?.color_label12 || '#fff');
    const label3 = torus.getTextPath(data?.label3 ?? '', 710 - label3_width / 2, 34.836, 24, 'center baseline', '#fff');
    const label4 = font_l4.getTextPath(data?.label4 ?? '', 710 - label4_width / 2, 78.572, 24, 'center baseline', '#fff');
    const label5 = torusBold.getTextPath(data?.label5 ?? '', 177, 97.877, 18, 'right baseline', data?.color_label12 || '#fff');

    const index = getMultipleTextPath([
        {
            font: torus,
            text: data?.index_b,
            size: data?.index_b_size || 48,
            color: data?.color_index || 'none',
        }, {
            font: torus,
            text: data?.index_m,
            size: data?.index_m_size || 36,
            color: data?.color_index || 'none',
        },
    ], 815, 73.672, 'center baseline') +
        torus.getTextPath(data?.index_l, 815, 33.672,
            data?.index_l_size || 24, 'center baseline', data?.color_index || 'none')

    const rrect_label1 = data.label1 ? PanelDraw.Rect(30, 8, label1_width, 20, 10, color_label1) : '';
    const rrect_label2 = data.label2 ? PanelDraw.Rect(30, 82, label2_width, 20, 10, color_label2) : '';
    const rrect_label3 = data.label3 ? PanelDraw.Rect(710 - label3_width, 10, label3_width, 34, 17, color_label3) : '';
    const rrect_label4 = data.label4 ? PanelDraw.Rect(710 - label4_width, 54, label4_width, 34, 17, color_label4) : '';
    const rrect_label5 = data.label5 ? PanelDraw.Rect(185 - label5_width, 82, label5_width, 20, 10, color_label5) : '';

    svg = setText(svg, data?.color_right || 'none', reg_color_right);
    svg = setText(svg, data?.color_left || 'none', reg_color_left);

    svg = setImage(svg, 140, 4, 45, 30, data?.type || '', reg_label, 1);

    // 计算标题的长度
    let title_max_width = 500;
    let left_max_width = 500;
    let mods_width = mods_data.width;

    title_max_width -= (Math.max(mods_width, label3_width - 10)); //一般来说就第三个标签最长了
    left_max_width -= mods_width;

    let str_title = data.title ?? ''
    let str_title2 = data.title2 ?? ''

    const is_title_not_equal = data.title !== data.title2

    const is_title2_prefix_not_ascii = isNotEmptyString(str_title2) && !isASCII(str_title2.substring(0, 3))

    let title_width = Math.min(title_max_width, torus.getTextWidth(str_title, 36));
    let title2_width = title_max_width - title_width - 10;

    const title2_prefix_width = font_t2.getTextWidth(str_title2.substring(0, 3) + '...', 18);

    if (is_title_not_equal && is_title2_prefix_not_ascii && title2_width < title2_prefix_width) {
        title_width = title_max_width - title2_prefix_width - 20;
        title2_width = title2_prefix_width + 10
    }

    // 文字定义
    const color_left12 = data.color_left12 ?? '#fff';

    const text_title = torus.cutStringTail(str_title, 36, title_width);
    title_width = torus.getTextWidth(text_title, 36)

    const text_left1 = torus.cutStringTail(data.left1 ?? '', 24, left_max_width);
    const text_left2 = torus.cutStringTail(data.left2 ?? '', 24, left_max_width);

    const text_title2 = (is_title_not_equal && title2_width > 0)
        ? font_t2.cutStringTail(str_title2, 18, title2_width, true) : '';

    const title = torus.getTextPath(text_title, 210, 34.754, 36, 'left baseline', '#fff');
    const title2 = font_t2.getTextPath(text_title2, 210 + 10 + title_width,
        (data.font_title2 === 'PuHuiTi') ? 33 : 34.754, 18, 'left baseline', color_title2);
    const left1 = torus.getTextPath(text_left1, 210, 66.836, 24, 'left baseline', color_left12);
    const left2 = torus.getTextPath(text_left2, 210, 96.836, 24, 'left baseline', color_left12);

    // 插入文字
    svg = setTexts(svg, [title, title2, left1, left2, index], reg_text);

    svg = setTexts(svg, [label1, label2, label3, label4, label5, rrect_label1, rrect_label2, rrect_label3, rrect_label4, rrect_label5], reg_label);

    // 插入图片
    svg = data.cover ? setImage(svg, 20, 0, 176, 110, data.cover, reg_avatar, 1) : svg;
    svg = data.background ? setImage(svg, 0, 0, 900, 110, data.background, reg_background, 0.2) : svg;

    return svg.toString();
}
