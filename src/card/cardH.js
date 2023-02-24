import {implantImage, InsertSvgBuilder, readImage, readTemplate, replaceText, torus} from "../util.js";

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

    svg = implantImage(svg,560,110,0,0,0.5,'I_CardH_BG.png', reg_background)

    let out_svg = new InsertSvgBuilder(svg)
        .insertImage(data.background, reg_background)
        .insertImage(data.avatar, reg_avatar);

    return out_svg.export(reuse);
}