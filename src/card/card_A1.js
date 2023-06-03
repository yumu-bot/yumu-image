import {
    getExportFileV3Path,
    getFlagPath,
    getRoundedNumberLargerStr, getRoundedNumberSmallerStr,
    implantImage,
    readTemplate,
    replaceText,
    torus
} from "../util.js";

export async function card_A1(data = {
    background: getExportFileV3Path('card-default.png'),
    avatar: getExportFileV3Path('avatar-guest.png'),
    sub_icon1: getExportFileV3Path('object-card-supporter.png'),
    sub_icon2: null,
    name: 'Muziyami',
    rank_global: 28075,
    rank_country: 577,
    country: 'CN',
    acc: 95.27,
    level: 100,
    progress: 32,
    pp: 4396,

    color_base: '#2a2226',
}, reuse = false) {
    // 读取模板
    let svg = readTemplate('template/Card_A1.svg');

    // 路径定义
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CA1-1\);">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CA1-2\);">)/;
    let reg_country_flag = /(?<=<g style="clip-path: url\(#clippath-CA1-3\);">)/;
    let reg_sub_icon1 = /(?<=<g style="clip-path: url\(#clippath-CA1-4\);">)/;
    let reg_sub_icon2 = /(?<=<g style="clip-path: url\(#clippath-CA1-5\);">)/;

    let reg_color_base = /(?<=fill: )#2a2226/;

    let rank_country = data.rank_country || '-';
    let rank_global = data.rank_global || '-';
    let country = data.country || '??'

    // 文字的 <path>
    let text_name =
        torus.getTextPath(torus.cutStringTail(data.name, 48, 290),
            130, 53.672, 48, "left baseline", "#fff");
    let text_rank_global =
        torus.getTextPath('#' + rank_global, 20, 165.836, 24, "left baseline", "#fff");
    let text_rank_country =
        torus.getTextPath(country + '#' + rank_country, 20, 191.836, 24, "left baseline", "#fff");

    let level = data.level || 0;
    let progress = data.progress || 0;
    let acc = getRoundedNumberLargerStr(data.acc,3) + getRoundedNumberSmallerStr(data.acc,3) || 0
    let info = acc + '% Lv.' + level + '(' + progress + '%)';
    let text_info =
        torus.getTextPath(info, 420, 141.836, 24, "right baseline", "#fff");

    //pp位置计算
    let pp = Math.round(data.pp) || 0;

    let text_pp = torus.getTextPath(pp.toString(),
            420 - torus.getTextWidth('PP', 48),
            191.59, 60, "right baseline", "#fff")
        + torus.getTextPath('PP',
            420, 191.59, 48, "right baseline", "#fff");

    // 替换模板内容,replaceText(模板, 内容, 正则)
    svg = replaceText(svg, data.color_base, reg_color_base);
    svg = replaceText(svg, text_name, reg_text);
    svg = replaceText(svg, text_info, reg_text);
    svg = replaceText(svg, text_rank_country, reg_text);
    svg = replaceText(svg, text_rank_global, reg_text);
    svg = replaceText(svg, text_pp, reg_text);
    let flagSvg = await getFlagPath(data.country, 130, 64);
    svg = replaceText(svg, flagSvg, reg_country_flag); //高44宽60吧
    // 替换图片

    svg = data.background ? implantImage(svg, 430, 210, 0, 0, 0.5, data.background, reg_background) : svg;
    svg = data.avatar ? implantImage(svg, 100, 100, 20, 20, 1, data.avatar, reg_avatar) : svg;
    svg = data.sub_icon1 ? implantImage(svg, 40, 40, 195, 70, 1, data.sub_icon1, reg_sub_icon1) : svg;
    svg = data.sub_icon2 ? implantImage(svg, 40, 40, 245, 70, 1, data.sub_icon2, reg_sub_icon2) : svg;

    return svg.toString();
    /*
    let out_svg = new InsertSvgBuilder(svg)
        .insertImage(data.background, reg_background)
        .insertImage(data.avatar, reg_avatar)
        .insertImage(data.country_flag, reg_country_flag)
        .insertImage(data.sub_icon1, reg_sub_icon1)
        .insertImage(data.sub_icon2, reg_sub_icon2)

    return out_svg.export(reuse);
    */
}

