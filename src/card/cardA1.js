import {readTemplate, implantImage, replaceText, torus} from "../util.js";

export async function card_A1(data = {
    background: 'PanelObject/A_CardA1_BG.png',
    avatar: 'PanelObject/A_CardA1_Avatar.png',
    country_flag: 'PanelObject/A_CardA1_CountryFlag.png',
    sub_icon1: 'PanelObject/A_CardA1_SubIcon1.png',
    sub_icon2: 'PanelObject/A_CardA1_SubIcon2.png',
    name: 'Muziyami',
    rank_global: '#28075',
    rank_country: 'CN#577',
    info: '95.27% Lv.100(32%)',
    pp_b: '4396',
    pp_m: 'PP',

    color_base: '#2a2226',
}, reuse = false) {
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CA1-1\);">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CA1-2\);">)/;
    let reg_country_flag = /(?<=<g style="clip-path: url\(#clippath-CA1-3\);">)/;
    let reg_sub_icon1 = /(?<=<g style="clip-path: url\(#clippath-CA1-4\);">)/;
    let reg_sub_icon2 = /(?<=<g style="clip-path: url\(#clippath-CA1-5\);">)/;

    let reg_color_base = /(?<=fill: )#2a2226/;

    // 文字的 <path>
    let text_name =
        torus.getTextPath(data.name, 130, 53.672, 48, "left baseline", "#fff");
    let text_rank_global =
        torus.getTextPath(data.rank_global, 20, 165.836, 24, "left baseline", "#fff");
    let text_rank_country =
        torus.getTextPath(data.rank_country, 20, 191.836, 24, "left baseline", "#fff");
    let text_info =
        torus.getTextPath(data.info, 420, 141.836, 24, "right baseline", "#fff");

    //pp位置计算
    let text_metrics_pp_b = torus.getTextMetrics(data.pp_b, 0, 0, 60, "right baseline", "#fff");
    let text_metrics_pp_m = torus.getTextMetrics(data.pp_m, 0, 0, 48, "right baseline", "#fff");
    let text_pp_b_x = 420 - text_metrics_pp_m.width - text_metrics_pp_b.width;
    let text_pp_m_x = 420 - text_metrics_pp_m.width;

    let text_pp = torus.getTextPath(data.pp_b, text_pp_b_x, 191.59, 60, "left baseline", "#fff")
        + torus.getTextPath(data.pp_m, text_pp_m_x, 191.59, 48, "left baseline", "#fff");

    // 读取模板
    let svg = readTemplate('template/Card_A1.svg');
    // 替换模板内容,replaceText(模板, 内容, 正则)
    svg = replaceText(svg, data.color_base, reg_color_base);
    svg = replaceText(svg, text_name, reg_text);
    svg = replaceText(svg, text_info, reg_text);
    svg = replaceText(svg, text_rank_country, reg_text);
    svg = replaceText(svg, text_rank_global, reg_text);
    svg = replaceText(svg, text_pp, reg_text);
    // 替换图片

    svg = implantImage(svg,430,210,0,0,0.5, data.background, reg_background)
    svg = implantImage(svg,100,100,20,20,1, data.avatar, reg_avatar)
    svg = implantImage(svg,60,44,130,68,1, data.country_flag, reg_country_flag)
    svg = implantImage(svg,40,40,200,70,1, data.sub_icon1, reg_sub_icon1)
    svg = implantImage(svg,40,40,250,70,1, data.sub_icon2, reg_sub_icon2)

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
