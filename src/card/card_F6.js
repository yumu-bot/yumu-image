import {
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    implantSvgBody,
    modifyArrayToFixedLength,
    PanelDraw,
    replaceText,
    replaceTexts
} from "../util.js";
import {torus} from "../font.js";
import {label_E, LABEL_OPTION} from "../component/label.js";

export async function card_F6(data = {
    ranked_score: 0,
    total_score: 0,
    play_count: 0,
    play_time: 0,
    played_map: 0,
    rep_watched: 0,
    follower: 0,
    total_hits: 0,

    pc_arr: [],
    bonus_pp: 0,

    last_year: '19',
    last_month: '04',
    first_year: '19',
    first_month: '04',
    mid_year: '19',
    mid_month: '04',

    mode: 'osu',
}, reuse = false) {
    // 读取模板
    let svg = `
          <g id="Base_CF6">
          </g>
          <g id="PC_CF6">
          </g>
          <g id="Label_CF6">
          </g>
          <g id="Text_CF6">
          </g>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base_CF6">)/;
    const reg_pc = /(?<=<g id="PC_CF6">)/;
    const reg_label = /(?<=<g id="Label_CF6">)/;
    const reg_text = /(?<=<g id="Text_CF6">)/;

    // 绘制 PC 图表
    svg = replaceText(svg, getPlayCountChart(data.pc_arr), reg_pc);

    // 绘制标签
    const labels = await userData2Labels(data);

    for (const i in labels) {
        svg = implantSvgBody(svg,
            20 + (i % 4) * 220,
            (i < 4) ? 65 : 145, labels[i], reg_label);
    }

    // 导入文本
    const user_data_title = torus.getTextPath('User Data', 15, 35.795, 30, 'left baseline', '#fff');

    const user_data_text = torus.get2SizeTextPath(data.mode, ' (' + data.bonus_pp + ')' , 30, 30, 970, 725.836, 'right baseline', '#fff', '#aaa');

    const first_date = torus.getTextPath(
        data.first_year + '-' + data.first_month,
        15,
        334.836,
        24,
        'left baseline',
        '#aaa');
    const mid_date = torus.getTextPath(
        data.mid_year + '-' + data.mid_month,
        450,
        334.836,
        24,
        'center baseline',
        '#aaa');
    const last_date = torus.getTextPath(
        data.last_year + '-' + data.last_month,
        885,
        334.836,
        24,
        'right baseline',
        '#aaa');

    svg = replaceTexts(svg, [user_data_title, user_data_text, first_date, mid_date, last_date], reg_text);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 900, 355, 20, '#382e32');

    svg = replaceText(svg, base_rrect, reg_base);

    return svg;
}

function getPlayCountChart(pc_arr = []) {
    const arr = modifyArrayToFixedLength(pc_arr, 43, true);

    const user_pc_activity_max = Math.max.apply(Math, arr);

    const pc_activity_text = torus.getTextPath(`${user_pc_activity_max}PC`,
        30 + arr.findIndex((item) => item === user_pc_activity_max) * 20,
        220 - 5 + 75 - (user_pc_activity_max / Math.max(1000, user_pc_activity_max)) * 75,
        16,
        'center baseline',
        '#a1a1a1');

    const pc_chart = PanelDraw.BarChart(arr, null, 0, 22, 310, 860, 90, 8, 4, '#8dcff4', 1000, 16, '#aaa');

    return pc_activity_text + pc_chart;
}

async function userData2Labels(data) {
    // playtime 格式化
    let pt_b = '';
    let pt_m = '';

    if (data.play_time) {
        const d = Math.floor(data.play_time / 86400);
        const d_f = Math.floor(data.play_time % 86400 / 864).toString().padStart(2, '0')
        pt_b = d + '.';
        pt_m = d_f + 'd';
    }

    // 卡片定义
    const rks_b = getRoundedNumberLargerStr(data.ranked_score, 4);
    const rks_m = getRoundedNumberSmallerStr(data.ranked_score, 4);
    const tts_b = getRoundedNumberLargerStr(data.total_score, 4);
    const tts_m = getRoundedNumberSmallerStr(data.total_score, 4);
    const pc_b = getRoundedNumberLargerStr(data.play_count, 0);
    const pc_m = getRoundedNumberSmallerStr(data.play_count, 0);
    const mpl_b = getRoundedNumberLargerStr(data.played_map, 0);
    const mpl_m = getRoundedNumberSmallerStr(data.played_map, 0);
    const rep_b = getRoundedNumberLargerStr(data.rep_watched, 0);
    const rep_m = getRoundedNumberSmallerStr(data.rep_watched, 0);
    const fan_b = getRoundedNumberLargerStr(data.follower, 0);
    const fan_m = getRoundedNumberSmallerStr(data.follower, 0);
    const tth_b = getRoundedNumberLargerStr(data.total_hits, 4);
    const tth_m = getRoundedNumberSmallerStr(data.total_hits, 4);

    const label_rks =
        await label_E({...LABEL_OPTION.RKS, data_b: rks_b, data_m: rks_m}, true);
    const label_tts =
        await label_E({...LABEL_OPTION.TTS, data_b: tts_b, data_m: tts_m}, true);
    const label_pc =
        await label_E({...LABEL_OPTION.PC, data_b: pc_b, data_m: pc_m}, true);
    const label_pt =
        await label_E({...LABEL_OPTION.PT, data_b: pt_b, data_m: pt_m}, true);

    const label_mpl =
        await label_E({...LABEL_OPTION.MPL, data_b: mpl_b, data_m: mpl_m}, true);
    const label_rep =
        await label_E({...LABEL_OPTION.REP, data_b: rep_b, data_m: rep_m}, true);
    const label_fan =
        await label_E({...LABEL_OPTION.FAN, data_b: fan_b, data_m: fan_m}, true);
    const label_tth =
        await label_E({...LABEL_OPTION.TTH, data_b: tth_b, data_m: tth_m}, true);

    let arr = [];
    arr.push(label_rks, label_tts, label_pc, label_pt,label_mpl, label_rep, label_fan, label_tth);

    return arr;
}