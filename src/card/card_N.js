import {
    getImageFromV3,
    getFlagPath,
    getTimeDifference,
    implantImage,
    implantSvgBody, replaceText, replaceTexts, getAvatar, rounds,
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_N, LABELS} from "../component/label.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getScoreTypeImage} from "../util/star.js";
import {getModRRectPath} from "../util/mod.js";

export async function card_N(data = {
    score: {},

    score_rank: 1,
    compare_score: 15905693,
}) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CN-1">
              <rect width="915" height="62" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CN-2">
              <circle cx="95" cy="31" r="25" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CN-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            </filter>
          </defs>
          <g id="Background_CN_1">
            <rect width="915" height="62" rx="20" ry="20" style="fill: #382E32;"/>
            <circle cx="145" cy="31" r="25" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CN-1);" filter="url(#blur-CN-1)">
            </g>
          </g>
          <g id="Avatar_CN_1">
            <g style="clip-path: url(#clippath-CN-2);">
            </g>
          </g>
          <g id="Text_CN_1">
          </g>
          <g id="Mod_CN_1">
          </g>
          <g id="Label_CN_1">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CN_1">)/;
    const reg_avatar = /(?<= <g style="clip-path: url\(#clippath-CN-2\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CN-1\);" filter="url\(#blur-CN-1\)">)/;
    const reg_label = /(?<=<g id="Label_CN_1">)/;
    const reg_mod = /(?<=<g id="Mod_CN_1">)/;

    //导入背景和头像

    const rank = getImageFromV3(`object-score-${data.score.rank}-small.png`);
    const avatar = await getAvatar(data.score.user.avatar_url, true);
    const background = getImageFromV3(`object-score-backimage-${data.score.rank}.jpg`);

    //await readNetImage(data.score.user.cover.url, getExportFileV3Path('avatar-guest.png'));
    const name = torus.get2SizeTextPath(
        torus.cutStringTail(data.score.user.username, 26, 180, true), //最大宽度220px，给后面排名留了50px
        ' #' + data.score_rank, 26, 18, 130, 26, 'left baseline', '#fff'); //lS24 sS16 / y 24
    const flagSvg = await getFlagPath(data.score.user.country_code, 130, 32, 20);

    const score_date = getTimeDifference(data.score.ended_at);
    const background_opacity = getBGOpacity(score_date);

    const country_date = torus.get2SizeTextPath(
        data.score.user.country_code, ' (' + score_date + ')',
        18, 14, 162, 50, 'left baseline', '#fff');

    // 导入N1标签
    const acc = data.score.accuracy * 100;
    const combo = data.score.max_combo;
    const pp = Math.round(data.score.pp);
    const score = data.score.total_score;

    const delta_score = (data.compare_score - score !== 0) ? ((score - data.compare_score).toString()) : '-0';
    const delta_score_text = torus.getTextPath(delta_score.toString(), 580 - 10, 36 + 17, 18, 'right baseline', '#aaa');

    const acc_number = rounds(acc, 2)

    const n1_acc = await label_N({
        ...LABELS.ACC2,
        data_b: acc_number.integer,
        data_m: acc_number.decimal + '%',
    });
    const n1_combo = await label_N({
        ...LABELS.COMBO2,
        data_b: combo.toString(),
        data_m: 'x',
    });
    const n1_pp = await label_N({
        ...LABELS.PP2,
        data_b: pp.toString(),
        data_m: 'PP',
    });

    const score_number = rounds(score, -4, 1)

    const n1_score = await label_N({
        ...LABELS.SCORE2,
        data_b: score_number.integer,
        data_m: score_number.decimal,
    });

    // 导入评价，x和y是矩形的左上角
    const stat_interval = 5;
    const stat_x = 580
    const stat_y = 46;
    const stat_min_width = 10;
    const stat_full_width = 325;

    const stat_arr = getStatArr(data.score, data.score.ruleset_id);
    const stat_width_arr = getStatWidthArr(data?.score?.total_hit || 0, stat_arr, stat_min_width, stat_full_width, stat_interval);
    const stat_color_arr = getStatColorArr(data.score.ruleset_id);

    let width_sum = 0;
    for (const i in stat_arr) {
        const stat = stat_arr[i];
        const width = stat_width_arr[i];
        const color = stat_color_arr[i];

        if (stat > 0) {
            const stat_text = torus.getTextPath(stat.toString(),
                stat_x + width_sum + width / 2,
                stat_y - 5, 14, 'center baseline', '#fff');
            const svg_rect = PanelDraw.Rect(stat_x + width_sum, stat_y, width, 10, 5, color);

            svg = replaceText(svg, stat_text, reg_label);
            svg = replaceText(svg, svg_rect, reg_label);

            //结算
            width_sum += (width + stat_interval);
        }
    }

    // 插入模组，因为先插的在上面，所以从左边插
    const mods_arr = data.score.mods || [{acronym: ''}]
    const mods_arr_length = mods_arr.length;

    let multiplier
    if (mods_arr_length <= 5 && mods_arr_length > 0) {
        multiplier = 2
    } else if (mods_arr_length > 5) {
        multiplier = 1
    }

    mods_arr.forEach((mod, i) => {
        const offset_x = 900 - 32 + multiplier * 24 - mods_arr_length * multiplier * 24

        svg = replaceText(svg, getModRRectPath(mod, offset_x + multiplier * i * 24, 6, 40, 20, 10, 15), reg_mod);
    });

    const type = getScoreTypeImage(data?.score?.is_lazer)
    svg = implantImage(svg, 45, 30, 295, 30, 1, type, reg_label);

    // 插入图片和部件（新方法
    svg = implantImage(svg, 40, 40, 15, 10, 1, rank, reg_label);
    svg = implantImage(svg, 50, 50, 70, 6, 1, avatar, reg_avatar);
    svg = implantImage(svg, 915, 62, 0, 0, background_opacity, background, reg_background);
    svg = replaceTexts(svg, [name, country_date, delta_score_text, flagSvg], reg_text);

    svg = implantSvgBody(svg, 350, 6, n1_acc, reg_label);
    svg = implantSvgBody(svg, 460, 6, n1_combo, reg_label);
    svg = implantSvgBody(svg, 570, 6, n1_pp, reg_label);
    svg = implantSvgBody(svg, 350, 36, n1_score, reg_label);

    return svg.toString();
}
function getStatWidthArr (stat_sum = 1, stat_arr = [], minWidth = 10, fullWidth = 325, interval = 5) {
    let stat_width_arr = [];
    let remain_width = fullWidth;
    let remain_width_calc;
    let stat_sum_calc = stat_sum;

    if (stat_sum > 0) {

        //先减去间距，如果是0就不用考虑这个间距
        remain_width -= (interval * (stat_arr.length - 1));
        for (const v of stat_arr) {
            if (v === 0) remain_width += interval;
        }
        remain_width_calc = remain_width;

        //筛选出太短的
        for (const v of stat_arr) {
            if ((v / stat_sum) < (minWidth / remain_width) && v > 0) {
                stat_sum_calc -= v;
                remain_width_calc -= minWidth;
            }
        }

        //赋值
        for (const v of stat_arr) {
            if (v === 0) {
                stat_width_arr.push(0);
            } else if ((v / stat_sum) < (minWidth / remain_width)) {
                stat_width_arr.push(minWidth);
            } else {
                stat_width_arr.push(v / stat_sum_calc * remain_width_calc);
            }
        }
    }

    return stat_width_arr;
}

function getStatArr(score = {statistics: {
        perfect: 0,
        great: 104,
        good: 0,
        ok: 3,
        meh: 5,
        miss: 4,
        ignore_hit: 68,
        ignore_miss: 10,
        large_tick_hit: 8,
        large_tick_miss: 2,
        small_tick_hit: 0,
        small_tick_miss: 0,
        slider_tail_hit: 66,
        large_bonus: 12
    },}, mode = 0) {
    const s = score.statistics

    let stat_arr = [];
    switch (mode) {
        case 0: {
            stat_arr.push(s.great);
            stat_arr.push(s.ok);
            stat_arr.push(s.meh);
            stat_arr.push(s.miss);
        } break;
        case 1: {
            stat_arr.push(s.great);
            stat_arr.push(s.ok);
            stat_arr.push(s.miss);
        } break;
        case 2: {
            stat_arr.push(s.great);
            stat_arr.push(s.large_tick_hit);
            stat_arr.push(s.small_tick_hit);
            stat_arr.push(s.miss);
        } break;
        case 3: {
            stat_arr.push(s.perfect);
            stat_arr.push(s.great);
            stat_arr.push(s.good);
            stat_arr.push(s.ok);
            stat_arr.push(s.meh);
            stat_arr.push(s.miss);
        } break;
    }
    return stat_arr;
}

function getStatColorArr(mode = 0) {
    let stat_color_arr = [];

    switch (mode) {
        case 0:
            stat_color_arr = ['#8DCEF4', '#79C471', '#FEF668', '#ED6C9E'];
            break;
        case 1:
            stat_color_arr = ['#8DCEF4', '#79C471', '#FEF668', '#ED6C9E'];
            break;
        case 2:
            stat_color_arr = ['#8DCEF4', '#79C471', '#ED6C9E'];
            break;
        case 3:
            stat_color_arr = ['#8DCEF4', '#FEF668', '#79C471', '#5E8AC6',
                '#A1A1A1', '#ED6C9E'];
            break;
    }
    return stat_color_arr;
}

function getBGOpacity(timeDifference = '-1d') {
    const unit = timeDifference ? timeDifference.toString().slice(-1) : '-';
    switch (unit) {
        case 'y': return 0.25;
        case 'mo': return 0.3;
        case 'd': return 0.4;
        case 'h': return 0.5;
        case 'm': return 0.6;
        case 'w': return 0.7; //now
        default : return 0.5;
    }
}