import {
    get2SizeTorusTextPath, getExportFileV3Path, getModColor,
    getRankColor,
    getStarRatingColor,
    implantImage,
    readTemplate,
    replaceText,
    torus
} from "../util.js";

export async function card_J(data = {
    map_cover: '',
    map_background: '',
    map_title_romanized: 'no title',
    map_difficulty_name: 'who made this',
    star_rating: '0',
    score_rank: 'F',
    accuracy: '0', //%
    combo: '0', //x
    mods_arr: [],
    pp: '0' //pp

}, reuse = false) {

    // 正则

    let reg_text = /(?<=<g id="Text">)/;
    let reg_overlay = /(?<=<g id="Overlay">)/;
    let reg_mod = /(?<=<g id="Mod">)/;
    let reg_rank = /(?<=<g id="Rank">)/;

    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CJ-1\);">)/
    let reg_cover = /(?<=<g style="clip-path: url\(#clippath-CJ-2\);">)/


    // 读取模板
    let svg = readTemplate('template/Card_J.svg');


    // 替换文字
    let map_title_romanized =
        torus.getTextPath(data.map_title_romanized, 130, 17.877, 18, "left baseline", "#fff");
    let map_difficulty_name =
        torus.getTextPath(data.map_difficulty_name, 130, 32.571, 14, "left baseline", "#a1a1a1");

    let map_line3_text = (data.accuracy || data.combo) ? data.accuracy + '% ' + data.combo + 'x' : '';

    let map_line3 =
        torus.getTextPath(map_line3_text, 300, 47.571, 14, "right baseline", "#a1a1a1");

    let pp = data.pp ? get2SizeTorusTextPath(data.pp, 'PP', 30, 18, 300, 73.795, 'right baseline', '#fff') : '';

    let rank_text_color = '#fff'; if (data.score_rank === 'X' || data.score_rank === 'XH') rank_text_color = '#000'
    let rank =
        torus.getTextPath(data.score_rank, 150, 69.877, 18, "center baseline", rank_text_color);

    let sr = data.star_rating ? (Math.floor(data.star_rating * 10) / 10).toString() : '';
    let star_rating =
        torus.getTextPath(sr, 25, 20.877, 18, "center baseline", '#fff');

    // 定义颜色
    let rank_color = data.score_rank ?
        `<rect x="130" y="54" width="40" height="20" rx="10" ry="10" style="fill: ${getRankColor(data.score_rank)};"/>`
        : '';
    let star_color = data.star_rating ?
        `<rect x="5" y="5" width="40" height="20" rx="10" ry="10" style="fill: ${getStarRatingColor(data.star_rating)};"/>`
        : '';

    // 替换模组

    let insertMod = (mod, i, j) => {
        let offset_x = 179 + i * 14;
        let offset_y = 69 - j * 14;

        return `<circle id="Mod${i}${j}" cx="${offset_x}" cy="${offset_y}" r="5" style="fill: ${getModColor(mod)};"/>`
    }

    let length = data.mods_arr ? data.mods_arr.length : 0;

    for (let i = 0; i < length; ++i) {
        if (i < 3){
            svg = replaceText(svg, insertMod(data.mods_arr[i], i, 0), reg_mod)
        } else {
            svg = replaceText(svg, insertMod(data.mods_arr[i], i - 3, 1), reg_mod)
        }
    }


    // 替换模板

    svg = replaceText(svg, map_title_romanized, reg_text);
    svg = replaceText(svg, map_difficulty_name, reg_text);
    svg = replaceText(svg, map_line3, reg_text);
    svg = replaceText(svg, pp, reg_text);
    svg = replaceText(svg, rank, reg_text);
    svg = replaceText(svg, star_rating, reg_text);

    svg = replaceText(svg, rank_color, reg_rank)
    svg = replaceText(svg, star_color, reg_overlay)

    // 替换图片

    svg = data.map_background ? implantImage(svg,310,80,0,0,1, data.map_background, reg_background) : svg;
    svg = data.map_cover ? implantImage(svg,120,80,0,0,1, data.map_cover, reg_cover) : svg;

    return svg.toString();

}