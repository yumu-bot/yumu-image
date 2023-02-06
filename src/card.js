import {InsertSvgBuilder, readImage, readTemplate, replaceText, torus} from "./util.js";

export async function card_A1(data = {
    background: readImage("image/A_CardA1_BG.png"),
    avatar: readImage("image/A_CardA1_Avatar.png"),
    country_flag: readImage("image/A_CardA1_CountryFlag.png"),
    sub_icon1: readImage("image/A_CardA1_SubIcon1.png"),
    sub_icon2: readImage("image/A_CardA1_SubIcon2.png"),
    name: 'Muziyami',
    rank_global: '#28075',
    rank_country: 'CN#577',
    info: '95.27% Lv.100(32%)',
    pp_b: '4396',
    pp_m: 'PP',

    color_base: '#2a2226',
}, reuse = false) {
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = '${background}';
    let reg_avatar = '${avatar}';
    let reg_country_flag = '${country_flag}';
    let reg_sub_icon1 = '${sub_icon1}';
    let reg_sub_icon2 = '${Sub_Icon2}';

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

    let out_svg = new InsertSvgBuilder(svg)
        .insertImage(data.background, reg_background)
        .insertImage(data.avatar, reg_avatar)
        .insertImage(data.country_flag, reg_country_flag)
        .insertImage(data.sub_icon1, reg_sub_icon1)
        .insertImage(data.sub_icon2, reg_sub_icon2)

    return out_svg.export(reuse);
}

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

// 绘制方法 card h  参数有两个,data是数据,data.background就是背景,以此类推,下面声明时写的是当用的时候没有传参数,采用的默认值,
export async function card_H(data = {
    background: readImage("image/I_CardH_BG.png"),
    avatar: readImage("image/I_CardH_Avatar.png"),
    name: 'Muziyami',
    info: '39.2M // 99W-0L 100%',
    rank: '#1',
    pp_b: '264',
    pp_m: 'pp',
    color_score: '#fbb03b',
    color_base: '#3fa9f5',
}, reuse = false) {
    // 正则表达式
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = '${background}';
    let reg_avatar = '${avatar}';
    let reg_color_score = /(?<=fill: )#fbb03b/;
    let reg_color_base = /(?<=fill: )#3fa9f5/;

    // 文字的 <path>
    let text_name = torus.getTextPath(data.name, 210, 40, 36, "left center", "#fff");
    let text_info = torus.getTextPath(data.info, 210, 70, 24, "left center", "#fff");
    let text_rank = torus.getTextPath(data.rank, 210, 100, 24, "left center", "#fff");

    // pp位置计算 这部分同样是文字的<path>
    let r4_1 = torus.getTextMetrics(data.pp_b, 0, 0, 48, "center", "#fff");
    let r4_2 = torus.getTextMetrics(data.pp_m, 0, 0, 24, "center", "#fff");
    let p4_x = 815;
    let p4_y = 72;
    let p1 = p4_x - (r4_1.width + r4_2.width) / 2;
    let p2 = p4_x - r4_2.width / 2 + r4_1.width / 2;
    let text_pp = torus.getTextPath(data.pp_b, p1, p4_y, 48, "left center", "#fff") + torus.getTextPath(data.pp_m, p2, p4_y, 24, "left center", "#fff");

    // 读取模板
    let svg = readTemplate('template/Card_H.svg');
    // 替换模板内容,replaceText(模板, 内容, 正则)
    svg = replaceText(svg, data.color_score, reg_color_score);
    svg = replaceText(svg, data.color_base, reg_color_base);
    svg = replaceText(svg, text_name, reg_text);
    svg = replaceText(svg, text_info, reg_text);
    svg = replaceText(svg, text_rank, reg_text);
    svg = replaceText(svg, text_pp, reg_text);
    // 替换图片
    let out_svg = new InsertSvgBuilder(svg)
        .insertImage(data.background, reg_background)
        .insertImage(data.avatar, reg_avatar);

    return out_svg.export(reuse);
}


export async function card_D(data = {
    background: readImage("image/BG.png"),
    title: 'BeatmapTitle',
    artist: 'BeatmapArtist // Mapper',
    info: '[Difficulty] - b<bid>',
    mod: 'NM',
    star_b: '8',
    star_m: '.88*',
}, reuse = false) {
    let reg_text = /(?<=<g id="Text">)/
    let reg_background = '${background}'
    // 文字
    let text_title = torus.getTextPath(data.title, 20, 34, 36, 'left center', "#fff");
    let text_artist = torus.getTextPath(data.artist, 20, 66, 24, 'left center', "#fff");
    let text_info = torus.getTextPath(data.info, 20, 97, 24, 'left center', "#fff");
    let text_mod = torus.getTextPath(data.mod, 475, 35, 36, 'left center', "#fff");
    let r4_1 = torus.getTextMetrics(data.star_b, 0, 0, 60, "center", "#fff");
    let r4_2 = torus.getTextMetrics(data.star_m, 0, 0, 36, "center", "#fff");
    let p4_x = 500
    let p4_y = 97
    let p1 = p4_x - (r4_1.width + r4_2.width) / 2
    let p2 = p4_x - r4_2.width / 2 + r4_1.width / 2
    let text_star = torus.getTextPath(data.star_b, p1, p4_y, 60, "left center", "#fff") + torus.getTextPath(data.star_m, p2, p4_y, 36, "left center", "#fff")

    let svg = readTemplate("template/Card_D.svg");

    svg = replaceText(svg, text_title, reg_text);
    svg = replaceText(svg, text_artist, reg_text);
    svg = replaceText(svg, text_info, reg_text);
    svg = replaceText(svg, text_mod, reg_text);
    svg = replaceText(svg, text_star, reg_text);
    let out_svg = new InsertSvgBuilder(svg).insertImage(data.background, reg_background);

    return out_svg.export(reuse);
}


export async function Panel_H(data = {
    background: readImage("image/Yumu ChocoPanel-SVG-Card1.31.png"),
    avatar: readImage("image/Yumu ChocoPanel-SVG-Card1.32.png"),
    name: 'Muziyami',
    info: '39.2M // 99W-0L 100%',
    rank: '#1',
    pp_b: '264',
    pp_m: 'pp',
    color_score: '#fbb03b',
    color_base: '#3fa9f5',
}) {
    let reg_background = '${background}'
    //
    let reg_height = /(?<=id="Background">[\s\S]*height=")\d+/
    let reg_cards = /(?<=<g id="cardH">)/
    let reg_text = /(?<=<g id="Text">)/;

    const get = (path, x, y) => {
        return `<image width="900" height="110" x="${x}" y="${y}" xlink:href="${path}" />`
    }

    let bg1 = await card_H(data, true);
    data.pp_b = '15';
    let bg2 = await card_H(data, true);


    let a1 = torus.getTextPath("24", 20, 97, 24, 'left center', "#fff");
    let a2 = torus.getTextPath("16", 120, 97, 16, 'left center', "#fff");
    let a3 = torus.getTextPath("12", 220, 97, 12, 'left center', "#fff");
    let svg = readTemplate("template/Panel_H.svg");

    svg = svg.replace(reg_text, a1);
    svg = svg.replace(reg_text, a2);
    svg = svg.replace(reg_text, a3);


    return new InsertSvgBuilder(svg)
        .insertSvg(bg1, 10, 100)
        .insertSvg(bg2, 10, 400)
        .insertSvg(bg1, 300, 210)
        .insertSvg(bg2, 300, 510)
        .export();
}

