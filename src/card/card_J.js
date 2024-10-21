import {
    getImageFromV3,
    implantImage, isNumber, replaceText, replaceTexts,
} from "../util/util.js";
import {torus} from "../util/font.js";
import {getModColor, getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {matchAnyMod} from "../util/mod.js";

export async function card_J(data = {
    cover: getImageFromV3('beatmap-defaultBG.jpg'),
    background: getImageFromV3('beatmap-defaultBG.jpg'),
    type: '',

    title: '',
    artist: '',
    difficulty_name: '',
    star_rating: 0,
    score_rank: 'F',
    accuracy: 0, //%
    combo: 0, //x
    mods_arr: [],
    pp: 0 //pp

}) {

    // 正则

    const reg_text = /(?<=<g id="Text_CJ">)/;
    const reg_overlay = /(?<=<g id="Overlay_CJ">)/;
    const reg_mod = /(?<=<g id="Mod_CJ">)/;
    const reg_rank = /(?<=<g id="Rank_CJ">)/;

    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CJ-1\);">)/
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CJ-2\);">)/


    // 读取模板
    let svg = `
  <defs>
  <clipPath id="clippath-CJ-1">
     <rect width="310" height="80" rx="12" ry="12" style="fill: none;"/>
  </clipPath>
  <clipPath id="clippath-CJ-2">
     <rect width="120" height="80" rx="10" ry="10" style="fill: none;"/>
  </clipPath>
</defs>
    <g id="Base_CJ">
        <rect width="310" height="80" rx="10" ry="10" style="fill: #46393f;"/>
    </g>
    <g id="Background_CJ">
        <g style="clip-path: url(#clippath-CJ-1);">
        </g>
    </g>
    <g id="Cover_CJ">
        <g style="clip-path: url(#clippath-CJ-2);">
        </g>
    </g>
    <g id="Stat_CJ">
        <g id="Rank_CJ">
        </g>
        <g id="Mod_CJ">
        </g>
    </g>
    <g id="Overlay_CJ">
    </g>
    <g id="Text_CJ">
    </g>`;

    // 定义文字
    const text_title = torus.cutStringTail(data.title || '', 18, 170);
    // let text_map_artist = torus.cutStringTail(data.map_artist || '', 14, 170);
    const text_pp = data.pp;

    // 替换文字
    const title =
        torus.getTextPath(text_title , 130, 17.877, 18, "left baseline", "#fff");
    /*
    let map_artist =
        torus.getTextPath(text_map_artist, 130, 32.571, 14, "left baseline", "#a1a1a1");

     */

    const line_3_right_text = (data.accuracy && data.combo) ?  data.combo + 'x ' + data.accuracy + '%': '0x 0%';
    const line_3_right =
        torus.getTextPath(line_3_right_text, 300, 47.571, 14, "right baseline", "#fff");

    const text_difficulty_name = torus.cutStringTail('[' + data.difficulty_name + ']' || '',
        14,
        170);
    /*
        torus.cutStringTail(data.map_difficulty_name || '',
        14,
        170 - 5 - torus.getTextWidth(map_line_3_right_text, 14));

     */

    const difficulty_name =
        torus.getTextPath(text_difficulty_name, 130, 32.571, 14, "left baseline", "#fff"); //y: 47.571

    const pp = data.pp ?
        torus.get2SizeTextPath(text_pp.toString(), 'PP', 30, 20, 300, 73.795, 'right baseline', '#fff')
        :
        torus.getTextPath('-', 300, 73.795, 30, 'right baseline', '#fff');

    const rank_text_color = (data.score_rank === 'X' || data.score_rank === 'XH') ? '#000' : '#fff';
    const rank = torus.getTextPath(data.score_rank, 150, 69.877, 18, "center baseline", rank_text_color);

    const sr = data.star_rating ? (Math.floor(data.star_rating * 10) / 10).toString() : '';
    const star_rating =
        torus.getTextPath(sr, 25, 20.877, 18, "center baseline", '#fff');

    // 定义颜色
    const rank_rrect = data.score_rank ?
        PanelDraw.Rect(130, 54, 40, 20, 10, getRankColor(data.score_rank)) : '';

    const star_rrect = data.star_rating ?
        PanelDraw.Rect(5, 5, 40, 20, 10, getStarRatingColor(data.star_rating)) : '';

    // 替换模组

    const insertMod = (mod, i, j) => {
        let offset_x = 179 + i * 14;
        let offset_y = 69 - j * 12; //原来是 14，后面做了调整

        return PanelDraw.Circle(offset_x, offset_y, 5, getModColor(mod));
    }

    const mods_arr = (data.mods_arr || [{acronym: ''}])?.filter(v => v.acronym !== 'CL')
    const length = mods_arr.length;

    for (let i = 0; i < length; ++i) {
        const mod = mods_arr[i]

        let acronym = mod?.acronym || mod.toString()

        if (matchAnyMod(mod, ['DT', 'NC', 'HT', 'DC']) && isNumber(mod?.settings?.speed_change)) {
            acronym = mod?.settings?.speed_change?.toString() + 'x'
        }

        if (i < 3){
            svg = replaceText(svg, insertMod(acronym, i, 0), reg_mod)
        } else {
            svg = replaceText(svg, insertMod(acronym, i - 3, 1), reg_mod)
        }
    }

    // 替换模板
    svg = replaceTexts(svg, [title, difficulty_name, line_3_right, pp, rank, star_rating], reg_text);

    svg = replaceText(svg, rank_rrect, reg_rank)
    svg = replaceText(svg, star_rrect, reg_overlay)

    // 替换图片

    svg = implantImage(svg, 30, 20, 85, 4, 1, data?.type || '', reg_text);

    svg = data.background ? implantImage(svg, 310, 80, 0, 0, 0.2, data.background, reg_background) : svg;
    svg = data.cover ? implantImage(svg, 120, 80, 0, 0, 1, data.cover, reg_cover) : svg;

    return svg.toString();

}