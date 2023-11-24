import {
    getDecimals, implantImage,
    readTemplate,
    replaceText, replaceTexts
} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";
import {getColorInSpectrum, getModColor} from "../util/color.js";

export async function card_D(data = {
    background: '',
    title: 'Xin Mei Sang Zui Jiu',
    title_unicode: '新妹桑醉酒',
    artist: 'Fushimi Rio',
    mapper: 'Fia',
    difficulty: 'OWC HD2',
    bid: '1146381',
    mod: 'NM',
    cs: 4.2,
    ar: 10.3,
    od: 11,
    hp: 6,
    star_rating: 8.88,
    game_mode: 'osu',

    font_title2: 'PuHuiTi'

}, reuse = false) {
    //读取面板
    let svg = readTemplate("template/Card_D.svg");

    // 路径定义
    let reg_text = /(?<=<g id="Text">)/
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CD-1\);">)/
    let reg_mod_color = '${mod_color}';
    let reg_sd_text = /(?<=<g id="SDText">)/

    let reg_sd_circle1 = '${sd_circle1}';
    let reg_sd_circle2 = '${sd_circle2}';
    let reg_sd_circle3 = '${sd_circle3}';

    // 文字定义

    const title_width = torus.getTextWidth(data.title || '', 36);
    const title2_width = 415 - title_width - 10;

    const font_t2 = (data.font_title2 === 'PuHuiTi') ? PuHuiTi : torus;

    const text_title2 = (data.title_unicode && (data.title !== data.title_unicode) && title2_width > 0)
        ? font_t2.cutStringTail(data.title_unicode || '', 18, title2_width, true) : '';

    const title =
        torus.getTextPath(
            torus.cutStringTail(data.title,36,420),
            20, 33.754, 36, 'left baseline', "#fff");
    const title2 =
        font_t2.getTextPath(text_title2, 20 + 10 + title_width,
        (data.font_title2 === 'PuHuiTi') ? 32 : 33.754, 18, 'left baseline', "#bbb");

    let mapper = data.mapper;
    let artist = torus.cutStringTail(
        data.artist,
        24,
        360 - torus.getTextWidth(' // ' + mapper, 24))

    let text_artist_and_mapper =
        torus.getTextPath(artist + ' // ' + mapper,20, 65.836, 24, 'left baseline', "#bbb");

    let bid = data.bid || 0;
    let difficulty_name =
        torus.cutStringTail(data.difficulty,
            24,
            360 - torus.getTextWidth('[] - b' + bid, 24));

    let info = '[' + difficulty_name + '] - b' + bid;
    let text_info =
        torus.getTextPath(info, 20, 96.836, 24, 'left baseline', "#bbb");

    let text_mod =
        torus.getTextPath(data.mod, 500, 30.754, 36, 'center baseline', "#fff");

    let text_star_b = getDecimals(data.star_rating,2);
    let text_star_m = getDecimals(data.star_rating,3) + '*';
    let star_m_width = torus.getTextWidth(text_star_m,36);
    let text_star =
        torus.getTextPath(text_star_b, 550 - star_m_width, 96.59, 60, "right baseline", "#fff") +
        torus.getTextPath(text_star_m, 550, 96.59, 36, "right baseline", "#fff")

    let text_mod_color = getModColor(data.mod);

    // 谱面四维
    let cs_arr = [1,2,3,3.5,4,4.2,4.6,5,5.3,5.8,6.2,6.5,7];
    let ar_arr = [4,6,8,8.5,9,9.3,9.7,10,10.1,10.3,10.5,10.8,11];
    let od_arr = [3,5,7,7.5,8,8.3,8.7,9,9.1,9.6,10,10.5,11];
    let hp_arr = [1,2,3,4,5,6,7,8,8.6,9.3,10,10.5,11];
    let cs_color = getColorInSpectrum(data.cs, cs_arr, 1);
    let ar_color = getColorInSpectrum(data.ar, ar_arr, 1);
    let od_color = getColorInSpectrum(data.od, od_arr, 1);
    let hp_color = getColorInSpectrum(data.hp, hp_arr, 1);
    let sd_name1 = '';
    let sd_name2 = '';
    let sd_name3 = '';
    let sd_circle1 = 'none';
    let sd_circle2 = 'none';
    let sd_circle3 = 'none';

    switch (data.game_mode) {
        case "osu" : {
            sd_name1 = 'CS';
            sd_name2 = 'AR';
            sd_name3 = 'OD';
            sd_circle1 = cs_color;
            sd_circle2 = ar_color;
            sd_circle3 = od_color;
        } break;
        case "taiko" :{
            sd_name1 = 'OD';
            sd_name2 = 'HP';
            sd_circle1 = od_color;
            sd_circle2 = hp_color;
        } break;
        case "catch" : {
            sd_name1 = 'CS';
            sd_name2 = 'AR';
            sd_name3 = 'HP';
            sd_circle1 = cs_color;
            sd_circle2 = ar_color;
            sd_circle3 = hp_color;
        } break;
        case "mania" : {
            sd_name2 = 'OD';
            sd_name3 = 'HP';
            sd_circle2 = od_color;
            sd_circle3 = hp_color;
        } break;
    }

    //这里所有物件均向左平移 5px了
    let text_sd1 = torus.getTextPath(sd_name1,
        385.5,
        77.571,
        14,
        'center baseline',
        '#fff')
    let text_sd2 = torus.getTextPath(sd_name2,
        406.5,
        77.571,
        14,
        'center baseline',
        '#fff')
    let text_sd3 = torus.getTextPath(sd_name3,
        427.5,
        77.571,
        14,
        'center baseline',
        '#fff')

    svg = replaceTexts(svg, [text_sd1, text_sd2, text_sd3], reg_sd_text);
    svg = replaceText(svg, sd_circle1, reg_sd_circle1);
    svg = replaceText(svg, sd_circle2, reg_sd_circle2);
    svg = replaceText(svg, sd_circle3, reg_sd_circle3);

    // 替换文字
    svg = replaceTexts(svg, [title, title2, text_artist_and_mapper, text_info, text_mod, text_star], reg_text);
    svg = replaceText(svg, text_mod_color, reg_mod_color);

    // 插入图片
    svg = implantImage(svg, 560 ,110 ,0 ,0 , 0.4, data.background, reg_background);

    return svg.toString();
}