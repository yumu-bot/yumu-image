import {getRankColor, getStarRatingColor, implantImage, replaceText, torus} from "../util.js";

export async function card_K(data = {
    map_background: 'beatmap-defaultBG.jpg',
    star_rating: 4.35,
    score_rank: 'D',
    bp_ranking: 1, //感觉暂时不使用这个也可以
    bp_pp: 369,
    bp_remark: 'PP',// PP

}, reuse = false) {

    // 正则
    let reg_text = /(?<=<g id="Text">)/;
    let reg_overlay = /(?<=<g id="Overlay">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CK-1\);">)/;

    // 读取模板

    let svg = `
  <defs>
    <clipPath id="clippath-CK-1">
      <rect width="70" height="50" rx="12" ry="12" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Base">
    <rect width="70" height="50" rx="12" ry="12" style="fill: #46393f;"/>
  </g>
  <g id="Background">
    <g style="clip-path: url(#clippath-CK-1);">
    </g>
  </g>
  <g id="Text">
  </g>
  <g id="Overlay">
  </g>`;

    // 替换文字
    // let bp_ranking = data.bp_ranking ?
    //    torus.getTextPath(data.bp_ranking.toString(), 35, 26.795, 30, "center baseline", "#fff") : '';
    let bp_pp = data.bp_pp ?
        torus.getTextPath(Math.floor(data.bp_pp).toString() + (data.bp_remark ? data.bp_remark : 'PP'), 35, 45.224, 16, "center baseline", "#fff") : '';

    // 定义圆圈
    let circle_sr = data.star_rating ?
        `<circle cx="10" cy="10" r="5" style="fill: ${getStarRatingColor(data.star_rating)};"/>` : '';
    let circle_rank = data.score_rank ?
        `<circle cx="60" cy="10" r="5" style="fill: ${getRankColor(data.score_rank)};"/>` : '';

    // 替换模板

    // svg = replaceText(svg, bp_ranking, reg_text);
    svg = replaceText(svg, bp_pp, reg_text);
    svg = replaceText(svg, circle_sr, reg_overlay);
    svg = replaceText(svg, circle_rank, reg_overlay);

    svg = data.map_background ? implantImage(svg,70,50,0,0,0.5, data.map_background, reg_background) : svg;

    return svg.toString();
}