import {
    getGameMode, getTimeByDHMS,
    getTimeByDHMSLarge,
    getTimeByDHMSSmall,
    setImage,
    setSvgBody,
    setText,
    setTexts, floors
} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMascotName, getMascotPath} from "../util/mascotBanner.js";
import {label_D1, LABELS} from "../component/label.js";


export async function card_F1N(data = {
    user: {
        play_count: 0,
        play_time: 0,
        total_hits: 0,
    },

    delta: {
        play_count: 0,
        play_time: 0,
        total_hits: 0,
    },
    mode: 'osu',
    level_current: 90,
    level_progress: 24,
}) {
    // 读取模板
    let svg = `   
   <defs>
        <clipPath id="clippath-CF1-1">
            <rect x="0" y="0" width="380" height="710" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-CF1-2">
            <rect x="360" y="0" width="560" height="710" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <filter id="inset-shadow-CF1-1" height="150%" width="150%" x="-25%" y="-25%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="30" result="blur"/>
        </filter>
        </defs>
          <g id="Base_CF1">
          </g>
          <g id="Glass_CF1">
            <g style="clip-path: url(#clippath-CF1-1);" filter="url(#inset-shadow-CF1-1)">
            </g>
          </g>
          <g id="Mascot_CF1">
            <g style="clip-path: url(#clippath-CF1-2);">
            </g>
          </g>
          <g id="RRect_CF1">
          </g>
          <g id="Text_CF1">
          </g>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base_CF1">)/;
    const reg_glass = /(?<=<g style="clip-path: url\(#clippath-CF1-1\);" filter="url\(#inset-shadow-CF1-1\)">)/;
    const reg_mascot = /(?<=<g style="clip-path: url\(#clippath-CF1-2\);">)/;
    const reg_rrect = /(?<=<g id="RRect_CF1">)/;
    const reg_text = /(?<=<g id="Text_CF1">)/;

    // 绘制标签
    const labels = await userData2Labels(data);
    const deltas = userDelta2Labels(data);

    for (const i in labels) {
        svg = setSvgBody(svg, 0, 20 + 240 * i, labels[i], reg_text);
    }

    for (const i in deltas) {
        svg = setSvgBody(svg, 0, 195 + 240 * i, deltas[i], reg_text);
    }

    // 获取吉祥物
    const mascot_name_data = getMascotName(getGameMode(data.mode, 0)) || 'pippi';
    const mascot_link = getMascotPath(mascot_name_data);

    svg = setImage(svg, 0, 0, 380, 710, mascot_link, reg_glass, 0.6);
    svg = setImage(svg, 360, 0, 560, 710, mascot_link, reg_mascot, 1);

    // 插入进度
    const mascot_name_width = torus.getTextWidth(mascot_name_data, 36);

    const user_lv_text_width = torus.getTextWidth(' Lv.', 24);
    const user_lv_width = torus.getTextWidth(data.level_current, 36);
    const user_progress_width = torus.getTextWidth(data.level_progress, 36) + torus.getTextWidth('%', 24);

    const mascot_mark1_rrect_width = mascot_name_width + user_lv_width + user_lv_text_width + 30;
    const mascot_mark2_rrect_width = user_progress_width + 30;

    const mascot_mark1 =
        torus.getTextPath(mascot_name_data,
            395,
            50.754,
            36,
            "left baseline",
            "#fff") +
        torus.getTextPath(' Lv.',
            395 + mascot_name_width,
            50.754,
            24,
            "left baseline",
            "#fff") +
        torus.getTextPath((data.level_current.toString() || '0'),
            395 + mascot_name_width + user_lv_text_width,
            50.754,
            36,
            "left baseline",
            "#fff");

    const mascot_mark2 = torus.get2SizeTextPath(data.level_progress.toString(), '%', 36, 24, 885, 50.754, 'right baseline', '#fff');

    const mascot_mark1_rrect = PanelDraw.Rect(380, 20, mascot_mark1_rrect_width, 40, 12, '#54454c', 0.7);

    const mascot_mark2_rrect = PanelDraw.Rect(900 - mascot_mark2_rrect_width, 20, mascot_mark2_rrect_width, 40, 12, '#54454c', 0.7);

    // 导入底部的指示矩形
    const progress_base = PanelDraw.Rect(380, 686, 520, 4, 2, '#54454c');

    const progress_rrect = PanelDraw.Rect(380, 686, 520 * (data.level_progress || 0) / 100, 4, 2, '#FFCC22');

    // 导入
    svg = setTexts(svg, [mascot_mark1, mascot_mark2], reg_text);
    svg = setTexts(svg, [mascot_mark1_rrect, mascot_mark2_rrect, progress_rrect, progress_base], reg_rrect);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 920, 710, 20, '#382e32');

    svg = setText(svg, base_rrect, reg_base);

    return svg;
}

async function userData2Labels(data) {
    // 卡片定义
    const pc_b = floors(data?.user?.play_count, -4).integer;
    const pc_m = floors(data?.user?.play_count, -4).decimal;
    const tth_b = floors(data?.user?.total_hits, -4).integer;
    const tth_m = floors(data?.user?.total_hits, -4).decimal;
    const pt_b = getTimeByDHMSLarge(data?.user?.play_time);
    const pt_m = getTimeByDHMSSmall(data?.user?.play_time);

    const label_pc = await label_D1({...LABELS.PC, data_b: pc_b, data_m: pc_m, remark_font: PuHuiTi});
    const label_tth = await label_D1({...LABELS.TTH, data_b: tth_b, data_m: tth_m, remark_font: PuHuiTi});
    const label_pt = await label_D1({...LABELS.PT, data_b: pt_b, data_m: pt_m, remark_font: PuHuiTi});

    let arr = [];
    arr.push(label_pc, label_tth, label_pt);

    return arr;
}

// 注意，这个是以 x=180 居中的
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
            return torus.getTextPath(T, 180, 0, 18, 'center baseline', getColor(1)) ;
        } else {
            const text = getSign(T) + Math.abs(T);
            return torus.getTextPath(text, 180, 0, 18, 'center baseline', getColor(T)) ;
        }
    }

    const pc = data?.delta?.play_count || 0;
    const tts = data?.delta?.total_hits || 0;
    const pt = data?.delta?.play_time || 0;

    const pt_h = (pt > 0) ? '+' + getTimeByDHMS(pt) : '';

    if (data?.delta?.play_time === 0) {
        return new Array(3).fill("");
    }

    let arr = [];
    for (const x of [pc, tts, pt_h]) {
        arr.push(getPath(x));
    }
    return arr;
}