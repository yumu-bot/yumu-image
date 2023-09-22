import {
    implantImage,
    readTemplate,
    replaceText,
    replaceTexts,
    getModColor, PanelDraw
} from "../util.js";
import {torus, PuHuiTi} from "../font.js";

export async function card_H(data = {
    background: '',
    cover: '',
    title: '',
    title2: '',
    left1: '',
    left2: '',
    index_b: '',
    index_m: '',
    index_b_size: 48,
    index_m_size: 36,
    label1: '',
    label2: '',
    label3: '',
    label4: '',
    mods_arr: [],

    color_title2: '#aaa',
    color_right: '#fff',
    color_left: '#fff',
    color_index: '#fff',
    color_label1: '',
    color_label2: '',
    color_label3: '',
    color_label4: '',
    color_left12: '#fff',

    font_title2: 'torus',
    font_label4: 'torus',

}, reuse = false) {
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
    const insertMod = (mod, i) => {
        let offset_x = 620 - i * 20;
        if (mod !== '') {

            // 模组 svg 化
            const mod_abbr_path = torus.getTextPath(mod.toString(), (offset_x + 45), 66, 36, 'center baseline', '#fff');
            return `<path transform="translate(${offset_x} 24)"  d="m70.5,4l15,20c2.667,3.556,2.667,8.444,0,12l-15,20c-1.889,2.518-4.852,4-8,4H27.5c-3.148,0-6.111-1.482-8-4l-15-20c-2.667-3.556-2.667-8.444,0-12L19.5,4C21.389,1.482,24.352,0,27.5,0h35c3.148,0,6.111,1.482,8,4Z" style="fill: ${getModColor(mod)};"/>\n${mod_abbr_path}\n`;

            //return `<image transform="translate(${offset_x} 350)" width="90" height="64" xlink:href="${getExportFileV3Path('Mods/' + mod + '.png')}"/>`;
        } else return '';
    }

    const mods_arr = data.mods_arr || ['']
    const mods_arr_length = mods_arr.length;

    if (mods_arr_length <= 2 && mods_arr_length > 0) {
        mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, 2 * i), reg_mod);
        });
    } else if (mods_arr_length > 2) {
        mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, i), reg_mod);
        });
    }

    // 插入四个小标签
    const color_title2 = data.color_title2 || 'none';
    const color_label1 = data.color_label1 || 'none';
    const color_label2 = data.color_label2 || 'none';
    const color_label3 = data.color_label3 || 'none';
    const color_label4 = data.color_label4 || 'none';

    const font_l4 = (data.font_label4 === 'PuHuiTi') ? PuHuiTi : torus;
    const font_t2 = (data.font_title2 === 'PuHuiTi') ? PuHuiTi : torus;

    const label3_width = torus.getTextWidth(data.label3 || '', 24) + 30;
    const label4_width = font_l4.getTextWidth(data.label4 || '', 24) + 30;

    const label1 = torus.getTextPath(data.label1 || '', 50, 20.877, 18, 'center baseline', '#fff');
    const label2 = torus.getTextPath(data.label2 || '', 50, 96.877, 18, 'center baseline', '#fff');
    const label3 = torus.getTextPath(data.label3 || '', 710 - label3_width / 2, 34.836, 24, 'center baseline', '#fff');
    const label4 = font_l4.getTextPath(data.label4 || '', 710 - label4_width / 2, 78.572, 24, 'center baseline', '#fff');

    const index = torus.get2SizeTextPath(
        data.index_b, data.index_m,
        data.index_b_size || 48, data.index_m_size || 36, 815,73.672,'center baseline', data.color_index)

    const rrect_label1 = data.label1 ? PanelDraw.Rect(30, 5, 40, 20, 10, color_label1) : '';
    const rrect_label2 = data.label2 ? PanelDraw.Rect(30, 5, 40, 20, 10, color_label2) : '';
    const rrect_label3 = data.label3 ? PanelDraw.Rect(710 - label3_width, 10, label3_width, 34, 17, color_label3) : '';
    const rrect_label4 = data.label4 ? PanelDraw.Rect(710 - label4_width, 54, label4_width, 34, 17, color_label4) : '';

    svg = replaceText(svg, data.color_right || 'none', reg_color_right);
    svg = replaceText(svg, data.color_left || 'none', reg_color_left);


    svg = replaceTexts(svg, [label1, label2, label3, label4, rrect_label1, rrect_label2, rrect_label3, rrect_label4,], reg_label);
    svg = replaceText(svg, index, reg_text);

    // 计算标题的长度
    let title_max_width = 500;
    let left_max_width = 500;
    let mods_width;

    switch (mods_arr_length) {
        case 0: mods_width = 0; break;
        case 1: mods_width = 100; break;
        case 2: mods_width = 140; break;
        case 3: mods_width = 140; break;
        case 4: mods_width = 160; break;
        case 5: mods_width = 180; break;
        default: mods_width = 180;
    }

    title_max_width -= (Math.max(mods_width, label3_width)); //一般来说就第三个标签最长了
    left_max_width -= mods_width;

    const title_width = torus.getTextWidth(data.title || '', 36);
    const title2_width = Math.max(title_max_width - title_width - 20, 0);

    // 文字定义
    const color_left12 = data.color_left12 || '#fff';

    const text_title = torus.cutStringTail(data.title || '', 36, title_max_width);
    const text_left1 = torus.cutStringTail(data.left1 || '', 24, left_max_width);
    const text_left2 = torus.cutStringTail(data.left2 || '', 24, left_max_width);

    const text_title2 = (data.title2 && (data.title !== data.title2))
        ? font_t2.cutStringTail(data.title2 || '', 18, title2_width, true) : '';

    const title = torus.getTextPath(text_title, 210, 34.754, 36, 'left baseline', '#fff');
    const title2 = font_t2.getTextPath(text_title2, 210 + 10 + title_width,
        (data.font_title2 === 'PuHuiTi') ? 33 : 34.754, 18, 'left baseline', color_title2);
    const left1 = torus.getTextPath(text_left1, 210, 66.836, 24, 'left baseline', color_left12);
    const left2 = torus.getTextPath(text_left2, 210, 96.836, 24, 'left baseline', color_left12);

    // 插入文字
    svg = replaceTexts(svg, [title, title2, left1, left2], reg_text);

    // 插入图片
    svg = data.cover ? implantImage(svg, 176,110,20,0,1, data.cover, reg_avatar) : svg;
    svg = data.background ? implantImage(svg,900,110,0,0,0.3, data.background, reg_background) : svg;

    return svg.toString();
}