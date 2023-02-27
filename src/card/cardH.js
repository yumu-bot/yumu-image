import {getExportFileV3Path, implantImage, readTemplate, replaceText, torus} from "../util.js";

export async function card_H(data = {
    background: '',
    cover: '',
    title: '',
    left1: '',
    left2: '',
    index_b: '',
    index_m: '',
    label1: '',
    label2: '',
    label3: '',
    label4: '',
    mods_arr: [],

    color_index: '#46393F',
    color_left: '#46393F',
    color_label1: '',
    color_label2: '',
    color_label3: '',
    color_label4: '',

}, reuse = false) {
    // 读取模板
    let svg = readTemplate('template/Card_H0.svg');

    // 路径定义
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CH-1\);">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CH-2\);">)/;
    let reg_mod = /(?<=<g id="Mods">)/;

    // 插入模组
    let insertMod = (mod, i) => {
        let offset_x = 620 - i * 20;

        return `<image transform="translate(${offset_x} 350)" width="90" height="64" xlink:href="${getExportFileV3Path('Mods/' + mod + '.png')}"/>`;
    }

    if (data.mods_arr.length <= 2) {
        data.mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, 2 * i), reg_mod);
        });
    } else {
        data.mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, i), reg_mod);
        });
    }

    // 插入四个小标签


    // 计算标题的长度
    let title_max_width = 500;
    let left_max_width = 500;
    let mods_width;
    let label_width = torus.getTextWidth(data.label3,24);

    switch (data.mods_arr.length) {
        case 0: mods_width = 0; break;
        case 1: mods_width = 100; break;
        case 2: mods_width = 140; break;
        case 3: mods_width = 140; break;
        case 4: mods_width = 160; break;
        case 5: mods_width = 180; break;
    }

    title_max_width -= (Math.max(mods_width, ));
    left_max_width -= mods_width;

    // 文字定义


    let text_title = torus.cutStringTail(data.title, 36, )
    let title = torus.getTextPath(data.title || '', 20, 46.6, 36, 'left baseline', '#fff');


    // 插入文字
    svg = replaceText(svg, title, reg_text)

    // 插入图片
    svg = data.background ? implantImage(svg,900,110,0,0,0.5, data.background, reg_background) : svg;

    return svg.toString();
}