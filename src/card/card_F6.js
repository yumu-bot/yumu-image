import {
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr, getRoundedNumberStr,
    implantSvgBody,
    modifyArrayToFixedLength,
    replaceText,
    replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_E, LABEL_OPTION} from "../component/label.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_F6(data = {
    user: {
        ranked_score: 0,
        total_score: 0,
        play_count: 0,
        play_time: 0,
        played_map: 0,
        ranked_map: 0,
        rep_watched: 0,
        follower: 0,
        total_hits: 0,
    },

    delta: {
        ranked_score: 0,
        total_score: 0,
        play_count: 0,
        play_time: 0,

        total_hits: 0,
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
    svg = replaceText(svg, getPlayCountChart(data.pc_arr), reg_pc);

    // 绘制标签
    const labels = await userData2Labels(data);
    const deltas = userDelta2Labels(data);

    for (const i in labels) {
        svg = implantSvgBody(svg,
            20 + (i % 4) * 220,
            (i < 4) ? 65 : 145, labels[i], reg_label);
    }

    for (const i in deltas) {
        svg = implantSvgBody(svg,
        80 - 2 + (i % 4) * 220,
            (i < 4) ? 130 : 210, deltas[i], reg_label); //我也不知道为什么这里要 -2
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
        215 + 90 - (user_pc_activity_max / Math.max(1000, user_pc_activity_max)) * 90,
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

    if (data?.user?.play_time) {
        const t = data.user.play_time;

        const days = Math.floor(t / 86400);
        const hours = Math.floor((t - 86400 * days) / 3600);
        const minutes = Math.floor((t - 86400 * days - 3600 * hours) / 60);

        if (days > 0) {
            pt_b = days.toString();
            pt_m = 'd' + hours + 'h' + minutes + 'm';
        } else if (hours > 0) {
            pt_b = hours.toString();
            pt_m = 'h' + minutes + 'm';
        } else if (minutes > 0) {
            pt_b = minutes.toString();
            pt_m = 'm';
        } else if (hours > -1) {
            pt_b = '0';
            pt_m = 'm';
        } else {
            pt_b = '-';
            pt_m = '';
        }
    }

    const isRankedMapPCCalculated = data.user.ranked_map !== 0;

    // 卡片定义
    const rks_b = getRoundedNumberLargerStr(data.user.ranked_score, 4);
    const rks_m = getRoundedNumberSmallerStr(data.user.ranked_score, 4);
    const tts_b = getRoundedNumberLargerStr(data.user.total_score, 4);
    const tts_m = getRoundedNumberSmallerStr(data.user.total_score, 4);
    const pc_b = getRoundedNumberLargerStr(data.user.play_count, 0);
    const pc_m = getRoundedNumberSmallerStr(data.user.play_count, 0);

    const rmp_b = getRoundedNumberLargerStr(data.user.ranked_map, 0);
    const rmp_m = getRoundedNumberSmallerStr(data.user.ranked_map, 0);
    const mpc_b = getRoundedNumberLargerStr(data.user.played_map, 0);
    const mpc_m = getRoundedNumberSmallerStr(data.user.played_map, 0);

    const rep_b = getRoundedNumberLargerStr(data.user.rep_watched, 0);
    const rep_m = getRoundedNumberSmallerStr(data.user.rep_watched, 0);
    const fan_b = getRoundedNumberLargerStr(data.user.follower, 0);
    const fan_m = getRoundedNumberSmallerStr(data.user.follower, 0);
    const tth_b = getRoundedNumberLargerStr(data.user.total_hits, 4);
    const tth_m = getRoundedNumberSmallerStr(data.user.total_hits, 4);

    const label_rks =
        await label_E({...LABEL_OPTION.RKS, data_b: rks_b, data_m: rks_m});
    const label_tts =
        await label_E({...LABEL_OPTION.TTS, data_b: tts_b, data_m: tts_m});
    const label_pc =
        await label_E({...LABEL_OPTION.PC, data_b: pc_b, data_m: pc_m});
    const label_pt =
        await label_E({...LABEL_OPTION.PT, data_b: pt_b, data_m: pt_m});

    const label_mpl = isRankedMapPCCalculated ?
        await label_E({...LABEL_OPTION.RMP, data_b: rmp_b, data_m: rmp_m}) :
        await label_E({...LABEL_OPTION.MPC, data_b: mpc_b, data_m: mpc_m})
    ;
    const label_rep =
        await label_E({...LABEL_OPTION.REP, data_b: rep_b, data_m: rep_m});
    const label_fan =
        await label_E({...LABEL_OPTION.FAN, data_b: fan_b, data_m: fan_m});
    const label_tth =
        await label_E({...LABEL_OPTION.TTH, data_b: tth_b, data_m: tth_m});

    let arr = [];
    arr.push(label_rks, label_tts, label_pc, label_pt,label_mpl, label_rep, label_fan, label_tth);

    return arr;
}

function userDelta2Labels(data) {
    
    const getSign = (T) => {
        if (typeof T === 'number') {
            return (T > 0) ? '+' : ((T < 0) ? '-': '');
        } else return '';
    }
    
    const getColor = (T) => {
        const increase = '#93D02E';
        const decrease = '#DE6055';
        const none = '#CBAA2C00';
        
        if (typeof T === 'number') {
            return (T > 0) ? increase : ((T < 0) ? decrease: none);
        } else return '';
    }

    const getPath = (T) => {
        const text = getSign(T) + getRoundedNumberStr(Math.abs(T), 3);
        return torus.getTextPath(text, 0, 0, 18, 'left baseline', getColor(T)) ;
    }


    const rks = data?.delta?.ranked_score || 0;
    const tts = data?.delta?.total_score || 0;
    const pc = data?.delta?.play_count || 0;
    const pt = data?.delta?.play_time || 0;
    const tth = data?.delta?.total_hits || 0;

    let pt_h = '';
    if (data?.delta?.play_time || data?.delta?.play_time === 0) {
        let pt_b = getSign(pt);
        let pt_m;

        const days = Math.floor(Math.abs(pt) / 86400);
        const hours = Math.floor((Math.abs(pt) - 86400 * days) / 3600);
        const minutes = Math.floor((Math.abs(pt) - 86400 * days - 3600 * hours) / 60);

        if (days > 0) {
            pt_b += days.toString();
            pt_m = 'd' + hours + 'h' + minutes + 'm';
        } else if (hours > 0) {
            pt_b += hours.toString();
            pt_m = 'h' + minutes + 'm';
        } else if (minutes > 0) {
            pt_b += minutes.toString();
            pt_m = 'm';
        } else if (hours > -1) {
            pt_b += '0';
            pt_m = 'm';
        } else {
            pt_b = '-';
            pt_m = '';
        }
        pt_h = pt_b + pt_m;
    }

    const label_rks = getPath(rks);
    const label_tts = getPath(tts);
    const label_pc = getPath(pc);
    const label_pt = torus.getTextPath(pt_h, 0, 0, 18, 'left baseline', getColor(pt));
    const label_tth = getPath(tth);
    const n = ""; //没法做的差值

    let arr = [];
    arr.push(label_rks, label_tts, label_pc, label_pt, n, n, n, label_tth);
    return arr;
}
