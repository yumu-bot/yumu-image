import {exportPng, getBase64Text, readImage, readTemplete, replaceText, SaveFiles, torus} from "./util.js";
import fs from "fs";

export async function cardA1(){
    let svg = readTemplete('template/CardA1.svg');
}

// 绘制方法 card h  参数有两个,data是数据,data.background就是背景,以此类推,下面声明时写的是当用的时候没有传参数,采用的默认值,
export async function card_H(data = {
    background: readImage("image/Yumu ChocoPanel-SVG-Card1.31.png"),
    avatar: readImage("image/Yumu ChocoPanel-SVG-Card1.32.png"),
    name: 'Muziyami',
    info: '39.2M // 99W-0L 100%',
    rank: '#1',
    pp_b: '264',
    pp_m: 'pp',
    color_score: '#fbb03b',
    color_base: '#3fa9f5',
}, getSVG = false) {
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
    let svg = readTemplete('template/Card_H.svg');
    // 替换模板内容,replaceText(模板, 内容, 正则)
    svg = replaceText(svg, data.color_score, reg_color_score);
    svg = replaceText(svg, data.color_base, reg_color_base);
    svg = replaceText(svg, text_name, reg_text);
    svg = replaceText(svg, text_info, reg_text);
    svg = replaceText(svg, text_rank, reg_text);
    svg = replaceText(svg, text_pp, reg_text);
    // 替换图片
    svg = replaceText(svg, getBase64Text(data.background), reg_background);
    svg = replaceText(svg, getBase64Text(data.avatar), reg_avatar);

    // 导出 getSVG意思是是否返回svg的text,否则直接返回图
    return getSVG ? svg : exportPng(svg);
}


export async function card_D(data = {
    background: readImage("image/BG.png"),
    title:'BeatmapTitle',
    artist:'BeatmapArtist // Mapper',
    info:'[Difficulty] - b<bid>',
    mod:'NM',
    star_b:'8',
    star_m:'.88*',
}, getSVG = false) {
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

    let svg = readTemplete("template/Card_D.svg");

    svg = replaceText(svg, text_title, reg_text);
    svg = replaceText(svg, text_artist, reg_text);
    svg = replaceText(svg, text_info, reg_text);
    svg = replaceText(svg, text_mod, reg_text);
    svg = replaceText(svg, text_star, reg_text);
    svg = replaceText(svg, getBase64Text(data.background), reg_background);

    return getSVG ? svg : exportPng(svg);
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

    const get = (path,x, y) => {
        return `<image width="900" height="110" x="${x}" y="${y}" xlink:href="${path}" />`
    }

    let bg1 = await card_H(data, true);
    let bg2 = await card_H(data, true);
    const f = new SaveFiles();
    f.saveSvgText(bg1);
    f.saveSvgText(bg2);
    let svg = readTemplete("template/Panel_H.svg");
    svg = svg.replace(reg_height, "100");



    let out = await exportPng(svg);
    f.remove()
    return out;
}

