import {get2SizeTorusTextPath, implantImage, readTemplate, torus} from "../util.js";

export async function card_J(data = {
    map_cover: 'PanelObject/D_CardJ_Cover.png',
    map_background: 'PanelObject/D_CardJ_Background.png',
    map_title_romanized: '',
    map_difficulty_name: '',
    star_rating: '0',
    score_rank: 'F',
    accuracy: '0', //%
    combo: '0', //x
    mods_arr: ['HD', 'HR', 'DT', 'NF'],
    pp: '0' //pp

}, reuse = false) {
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
        torus.getTextPath(data.map_difficulty_name, 130, 34.224, 16, "left baseline", "#a1a1a1");

    let map_line3_text = data.accuracy + '% ' + data.combo + 'x';
    let map_line3 =
        torus.getTextPath(map_line3, 300, 49.224, 16, "right baseline", "#a1a1a1");

    let pp = get2SizeTorusTextPath(data.pp, 'PP', 30, 18, 300, 73.795, 'right baseline', '#a1a1a1')

    let rank_color = '#fff'; if (data.score_rank === 'X') rank_color = '#000'

    let rank =
        torus.getTextPath(data.score_rank, 150, 69.877, 18, "center baseline", rank_color);

    // 替换模板

    // 替换图片

    svg = implantImage(svg,310,80,0,0,1, data.map_background, reg_background)
    svg = implantImage(svg,120,80,0,0,1, data.map_cover, reg_cover)

    return svg.toString();

}