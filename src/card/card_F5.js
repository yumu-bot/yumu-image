import {
    getRoundedNumberStr,
    maximumArrayToFixedLength, modifyArrayToFixedLength,
    replaceText, replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_F5(data = {
    mode: "osu",
    country: 'CN',
    country_rank: 1234,
    global_rank: 1234,

    ranking_arr: [],
    bp_arr: [],
}) {
    // 读取模板
    let svg = `
          <g id="Base_CF5">
          </g>
          <g id="BP_CF5">
          </g>
          <g id="Ranking_CF5">
          </g>
          <g id="Text_CF5">
          </g>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base_CF5">)/;
    const reg_ranking = /(?<=<g id="Ranking_CF5">)/;
    const reg_bp = /(?<=<g id="BP_CF5">)/;
    const reg_text = /(?<=<g id="Text_CF5">)/;

    // 绘制 BP 图表
    svg = replaceText(svg, getBPActivityChart(data.bp_arr), reg_bp);

    // 绘制 Rank 图表
    svg = replaceText(svg, getRankingChart(data.ranking_arr), reg_ranking);

    // 导入文本
    const ranking_title = torus.getTextPath('Ranking', 15, 35.795, 30, 'left baseline', '#fff');

    const ranking_text = torus.get2SizeTextPath(
        '#' + (data.global_rank || 0), ' ' + (data.country || '') + ' #' + (data.country_rank || 0),
        36, 24, 880, 44.754, 'right baseline', '#fff', '#aaa');

    svg = replaceTexts(svg, [ranking_title, ranking_text], reg_text);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 900, 335, 20, '#382e32');

    svg = replaceText(svg, base_rrect, reg_base);

    return svg;
}

function getBPActivityChart(bp_arr = []) {
    const arr = maximumArrayToFixedLength(bp_arr, 39);
    const user_bp_activity_max = Math.max.apply(Math, arr);

    const bp_activity_text = torus.getTextPath(`BP+${user_bp_activity_max}`,
        70 + arr.findIndex((item) => item === user_bp_activity_max) * 20,
        185 + 90 - (user_bp_activity_max / Math.max(5, user_bp_activity_max)) * 90,
        16,
        'center baseline',
        '#aaa');
    const bp_chart = PanelDraw.BarChart(arr, null, 0, 62, 280, 780, 90, 8, 4, '#8DCFF4', 5, 16);

    const ranking_day_90 = torus.getTextPath('-90d', 60, 316.836, 24, 'left baseline', '#fc2');
    const ranking_day_45 = torus.getTextPath('-45d', 450, 316.836, 24, 'center baseline', '#fc2');
    const ranking_day_0 = torus.getTextPath('-0d', 840, 316.836, 24, 'right baseline', '#fc2');

    const ranking_text = ranking_day_0 + ranking_day_45 + ranking_day_90;

    return bp_activity_text + bp_chart + ranking_text;
}

function getRankingChart(ranking_arr = []) {

    const arr = modifyArrayToFixedLength(ranking_arr, 90, true);

    const user_ranking_max = Math.max.apply(Math, arr);

    //处理rank数组，如果有0，补最大值
    let ranking_nonzero_arr = [];

    arr.forEach((v) => {
        if (v === 0) v = user_ranking_max;
        ranking_nonzero_arr.push(v);
    });

    const user_ranking_min = Math.min.apply(Math, ranking_nonzero_arr);

    const user_ranking_mid = (user_ranking_max + user_ranking_min) / 2;

    // 绘制纵坐标，注意max在下面
    const rank_axis_y_min = getRoundedNumberStr(user_ranking_min, 1);
    const rank_axis_y_mid = getRoundedNumberStr(user_ranking_mid, 1);
    const rank_axis_y_max = getRoundedNumberStr(user_ranking_max, 1);

    const rank_axis =
        torus.getTextPath(rank_axis_y_min, 30, 72.836, 24, 'center baseline', '#fc2') +
        torus.getTextPath(rank_axis_y_mid, 30, 179.836, 24, 'center baseline', '#fc2') +
        torus.getTextPath(rank_axis_y_max, 30, 286.836, 24, 'center baseline', '#fc2');

    const rank_chart = PanelDraw.LineChart(ranking_nonzero_arr, user_ranking_min, user_ranking_max, 60, 280, 780, 215, '#fc2', 1, 0, 4, true); //这里min和max换位置

    return rank_axis + rank_chart;
}
