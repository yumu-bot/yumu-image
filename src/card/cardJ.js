import {implantImage, readTemplate} from "../util.js";

export async function card_J(data = {
    map_cover: 'PanelObject/D_CardJ_Cover.png',
    map_background: 'PanelObject/D_CardJ_Background.png',
    map_title_romanized: 'Fia is a Cheater',
    map_difficulty_name: 'Fushimi Rio also cheated',
    star_rating: '4.86',
    score_rank: 'S',
    accuracy: '98.36', //%
    combo: '536', //x
    mods_arr: ['HD', 'HR', 'DT', 'NF'],
    pp: '736' //pp

}, reuse = false) {
    let reg_text = /(?<=<g id="Text">)/;
    let reg_overlay = /(?<=<g id="Overlay">)/;
    let reg_mod = /(?<=<g id="Mod">)/;
    let reg_rank = /(?<=<g id="Rank">)/;

    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CJ-1\);">)/
    let reg_cover = /(?<=<g style="clip-path: url\(#clippath-CJ-2\);">)/

    // 读取模板
    let svg = readTemplate('template/Card_J.svg');

    // 替换模板


    // 替换图片

    svg = implantImage(svg,310,80,0,0,1, data.map_background, reg_background)
    svg = implantImage(svg,120,80,0,0,1, data.map_cover, reg_cover)

    return svg.toString();

}