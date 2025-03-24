import {
    setSvgBody,
    modifyArrayToFixedLength,
    setText,
    setTexts, round, rounds
} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";
import {label_D2, label_E, LABELS} from "../component/label.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_F6N(data = {
    user: {
        ranked_score: 0,
        total_score: 0,
        played_map: 0,
        ranked_map: 0,
        rep_watched: 0,
        follower: 0,
        medal: 0,
    },

    delta: {
        ranked_score: 0,
        total_score: 0,
    },

    pc_arr: [],
    bonus_pp: 0,

    last_year: '19',
    last_month: '04',
    first_year: '19',
    first_month: '04',
    mid_year: '19',
    mid_month: '04',

    mode: 'osu',
}) {
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
    svg = setText(svg, getPlayCountChart(data.pc_arr), reg_pc);

    // 绘制标签
    const labels = await userData2Labels(data);
    const deltas = userDelta2Labels(data);

    for (const i in labels) {
        svg = setSvgBody(svg,
            (i < 2) ? 20 + (i % 2) * 440 : 20 + ((i - 2) % 4) * 220,
            (i < 2) ? 65 : 145, labels[i], reg_label);
    }

    for (const i in deltas) {
        svg = setSvgBody(svg, 80 - 2 + (i % 2) * 440, 130, deltas[i], reg_label); //我也不知道为什么这里要 -2
    }

    // 导入文本
    const user_data_title = torus.getTextPath('User Data', 15, 40.795, 30, 'left baseline', '#fff');

    const user_data_text = torus.get2SizeTextPath(data.mode, ' (bonus: ' + data.bonus_pp + 'PP)' , 30, 24, 880, 40.836, 'right baseline', '#fff', '#aaa');

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

    svg = setTexts(svg, [user_data_title, user_data_text, first_date, mid_date, last_date], reg_text);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 900, 355, 20, '#382e32');

    svg = setText(svg, base_rrect, reg_base);

    return svg;
}

function getPlayCountChart(pc_arr = []) {
    const arr = modifyArrayToFixedLength(pc_arr, 43, true);

    const user_pc_activity_max = Math.max.apply(Math, arr);

    const pc_activity_text = torus.getTextPath(
        user_pc_activity_max > 0 ? user_pc_activity_max + 'PC' : '',
        30 + arr.findIndex((item) => item === user_pc_activity_max) * 20,
        215 + 90 - (user_pc_activity_max / Math.max(1000, user_pc_activity_max)) * 90,
        16,
        'center baseline',
        '#a1a1a1');

    const pc_chart = PanelDraw.BarChart(arr, null, 0, 22, 310, 860, 90, 8, 4, '#8dcff4', 1000, 16, '#aaa');

    return pc_activity_text + pc_chart;
}

async function userData2Labels(data) {

    // 卡片定义
    const rks_a = round(data.user.ranked_score, 1);
    const rks_b = rounds(data.user.ranked_score, -4, 2).integer;
    const rks_m = rounds(data.user.ranked_score, -4, 2).decimal;
    const tts_a = round(data.user.total_score, 1);
    const tts_b = rounds(data.user.total_score, -4, 2).integer;
    const tts_m = rounds(data.user.total_score, -4, 2).decimal;

    const mpc_b = rounds(data.user.played_map, -4).integer;
    const mpc_m = rounds(data.user.played_map, -4).decimal;
    const rep_b = rounds(data.user.rep_watched, -4).integer;
    const rep_m = rounds(data.user.rep_watched, -4).decimal;
    const fan_b = rounds(data.user.follower, -4).integer;
    const fan_m = rounds(data.user.follower, -4).decimal;
    const mdl_b = rounds(data.user.medal, -4).integer;
    const mdl_m = rounds(data.user.medal, -4).decimal;

    const label_rks =
        await label_D2({...LABELS.RKS, data_b: rks_b, data_m: rks_m, abbr: rks_a, remark_font: PuHuiTi});
    const label_tts =
        await label_D2({...LABELS.TTS, data_b: tts_b, data_m: tts_m, abbr: tts_a, remark_font: PuHuiTi});

    const label_mpl =
        await label_E({...LABELS.MPC, data_b: mpc_b, data_m: mpc_m, remark_font: PuHuiTi});
    const label_rep =
        await label_E({...LABELS.REP, data_b: rep_b, data_m: rep_m, remark_font: PuHuiTi});
    const label_fan =
        await label_E({...LABELS.FAN, data_b: fan_b, data_m: fan_m, remark_font: PuHuiTi});
    const label_mdl =
        await label_E({...LABELS.MED, data_b: mdl_b, data_m: mdl_m, remark_font: PuHuiTi});

    let arr = [];
    arr.push(label_rks, label_tts, label_mpl, label_rep, label_fan, label_mdl);

    return arr;
}

function userDelta2Labels(data) {
    const getSign = (T) => {
        if (typeof T === 'number') {
            return (T > 0) ? '+' : ((T < 0) ? '-': '');
        } else return '';
    }

    const getColor = (T) => {
        const increase = '#c2e5c3'; //'#93D02E';
        const decrease = '#ffcdd2'; // '#DE6055';
        const none = 'none';

        if (typeof T === 'number') {
            return (T > 0) ? increase : ((T < 0) ? decrease: none);
        } else return '';
    }

    const getPath = (T) => {
        if (isNaN(+T)) {
            return torus.getTextPath(T, 0, 0, 18, 'left baseline', getColor(1)) ;
        } else {
            const text = getSign(T) + round(T, -4, 2); //Math.abs(T);
            return torus.getTextPath(text, 0, 0, 18, 'left baseline', getColor(T)) ;
        }
    }

    const rks = data?.delta?.ranked_score || 0;
    const tts = data?.delta?.total_score || 0;

    if (data?.delta?.ranked_score === 0) {
        return new Array(2).fill("");
    }

    let arr = [];
    for (const x of [rks, tts]) {
        arr.push(getPath(x));
    }
    return arr;
}
