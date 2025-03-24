import {setImage, readNetImage, setText} from "../util/util.js";
import {torus} from "../util/font.js";
import {getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_I4(data = {
    map_background: "https://a.ppy.sh/",
    star_rating: 4.35,
    score_rank: 'D',
    bp_ranking: 1, //感觉暂时不使用这个也可以
    bp_pp: 369,
    bp_remark: 'PP',// PP

}) {

    // 正则
    let reg_text = /(?<=<g id="Text">)/;
    let reg_overlay = /(?<=<g id="Overlay">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CI4-1\);">)/;

    // 读取模板

    let svg = `
  <defs>
    <clipPath id="clippath-CI4-1">
      <rect width="70" height="50" rx="12" ry="12" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Base">
    <rect width="70" height="50" rx="12" ry="12" style="fill: #46393f;"/>
  </g>
  <g id="Background">
    <g style="clip-path: url(#clippath-CI4-1);">
    </g>
  </g>
  <g id="Text">
  </g>
  <g id="Overlay">
  </g>`;

    // 替换文字
    // let bp_ranking = data.bp_ranking ?
    //    torus.getTextPath(data.bp_ranking.toString(), 35, 26.795, 30, "center baseline", "#fff") : '';

    let pp_str;

    if (typeof data?.bp_pp === 'number') {
        pp_str = Math.floor(data?.bp_pp).toString() + (data?.bp_remark || 'PP');
    } else {
        pp_str = data?.bp_pp;
    }

    const bp_pp = torus.getTextPath(pp_str, 35, 45.224, 16, "center baseline", "#fff")

    // 定义圆圈
    const circle_sr = data.star_rating ?
        PanelDraw.Circle(10, 10, 5, getStarRatingColor(data.star_rating)) : '';
    const circle_rank = data.score_rank ?
        PanelDraw.Circle(60, 10, 5, getRankColor(data.score_rank)) : '';

    // 替换模板

    // svg = replaceText(svg, bp_ranking, reg_text);
    svg = setText(svg, bp_pp, reg_text);
    svg = setText(svg, circle_sr, reg_overlay);
    svg = setText(svg, circle_rank, reg_overlay);

    const bg = await readNetImage(data.map_background, true);

    svg = setImage(svg, 0, 0, 70, 50, bg, reg_background, 0.5);

    return svg.toString();
}