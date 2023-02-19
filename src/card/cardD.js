import {InsertSvgBuilder, readImage, readTemplate, replaceText, torus} from "../util.js";

export async function card_D(data = {
    background: readImage("image/H_CardD_BG.png"),
    title: 'Xin Mei Sang Zui Jiu',
    artist: 'Fushimi Rio // Fia',
    info: '[OWC HD2] - b114514',
    mod: 'EZ',
    cs: 'CS 4.2',
    ar: 'AR 10.3',
    od: 'OD 11',
    star_b: '8',
    star_m: '.88*',
    color_mod: '#39b54a',
}, reuse = false) {
    let reg_text = /(?<=<g id="Text">)/
    let reg_background = '${background}'
    let reg_color_mod = /(?<=fill: )#39b54a/;
    // 文字
    let text_title = torus.getTextPath(data.title, 20, 33.754, 36, 'left baseline', "#fff");
    let text_artist = torus.getTextPath(data.artist, 20, 65.836, 24, 'left baseline', "#fff");
    let text_info = torus.getTextPath(data.info, 20, 96.836, 24, 'left baseline', "#fff");

    let text_metrics_mod = torus.getTextMetrics(data.mod, 0, 0, 36, "left baseline", "#fff");
    let text_mod =
        torus.getTextPath(data.mod, 500 - text_metrics_mod.width / 2, 34.754, 36, 'left baseline', "#fff");

    let text_cs = torus.getTextPath(data.cs, 384, 56.877, 18, "left baseline", "#fff");
    let text_ar = torus.getTextPath(data.ar, 384, 76.877, 18, "left baseline", "#fff");
    let text_od = torus.getTextPath(data.od, 384, 96.877, 18, "left baseline", "#fff");

    let text_metrics_star_b = torus.getTextMetrics(data.star_b, 0, 0, 60, "left baseline", "#fff");
    let text_metrics_star_m = torus.getTextMetrics(data.star_m, 0, 0, 36, "left baseline", "#fff");
    let star_b_x = 550 - text_metrics_star_m.width - text_metrics_star_b.width;
    let star_m_x = 550 - text_metrics_star_m.width;
    let text_star =
        torus.getTextPath(data.star_b, star_b_x, 96.59, 60, "left baseline", "#fff") +
        torus.getTextPath(data.star_m, star_m_x, 96.59, 36, "left baseline", "#fff")

    let svg = readTemplate("template/Card_D.svg");

    svg = replaceText(svg, data.color_mod, reg_color_mod);
    svg = replaceText(svg, text_title, reg_text);
    svg = replaceText(svg, text_artist, reg_text);
    svg = replaceText(svg, text_info, reg_text);
    svg = replaceText(svg, text_mod, reg_text);
    svg = replaceText(svg, text_cs, reg_text);
    svg = replaceText(svg, text_ar, reg_text);
    svg = replaceText(svg, text_od, reg_text);
    svg = replaceText(svg, text_star, reg_text);

    let out_svg = new InsertSvgBuilder(svg).insertImage(data.background, reg_background);

    return out_svg.export(reuse);
}