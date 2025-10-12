import {getMultipleTextPath, poppinsBold, torus, torusBold} from "../util/font.js";
import {getRankColor} from "../util/color.js";
import {
    floors,
    getAvatar,
    getFlagPath, getSvgBody,
    getTimeDifferenceShort,
    readNetImage, round,
    rounds, setImage, setText, setTexts
} from "../util/util.js";
import {label_N2, LABELS} from "../component/label.js";
import {PanelDraw} from "../util/panelDraw.js";
import {drawLazerMods} from "../util/mod.js";

export async function card_A4(data = {
    score: {},

    score_rank: 1,
    compare_score: 15905693,
    is_legacy: false,
}) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CN2-1">
              <rect x="65" width="790" height="62" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CN2-2">
              <rect x="65" y="0" width="62" height="62" rx="10" ry="10" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CN-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            </filter>
          </defs>
          <g id="Base_CN_2">
            <rect width="915" height="62" rx="20" ry="20" style="fill: #382E32;"/>
          </g>
          <g id="Background_CN_2">
            <rect x="65" width="790" height="62" rx="20" ry="20" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CN2-1);" filter="url(#blur-CN-1)">
            </g>
          </g>
          <g id="Avatar_CN_2">
            <rect x="65" width="62" height="62" rx="20" ry="20" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CN2-2);">
            </g>
          </g>
          <g id="Text_CN_2">
          </g>
          <g id="Mod_CN_2">
          </g>
          <g id="Label_CN_2">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CN_2">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CN2-2\);">)/;
    const reg_rank = /(?<=<g id="Background_CN_2">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CN2-1\);" filter="url\(#blur-CN-1\)">)/;
    const reg_label = /(?<=<g id="Label_CN_2">)/;
    const reg_mod = /(?<=<g id="Mod_CN_2">)/;

    //导入背景和头像
    const user = data.score.user || {}

    const ranks = data.score.rank
        ?.replaceAll("X", "SS")
        ?.replaceAll("H", "")
        ?.split("") || [];
    let rank

    if (ranks.length === 2) {
        rank = torusBold.getTextPath(ranks[0].toString(), 884 - 8, 44, 40, 'center baseline', "#2A2226", 1) +
            torusBold.getTextPath(ranks[1].toString(), 884 + 8, 44, 40, 'center baseline', "#2A2226", 0.8)
    } else {
        rank = torusBold.getTextPath(ranks[0]?.toString() || 'F', 884, 44, 40, 'center baseline', "#2A2226", 1)
    }

    const rank_color = getRankColor(data.score.rank);

    const avatar = await getAvatar(user.avatar_url, true);

    const cover = await readNetImage(user.cover?.url, true)

    const time_difference = getTimeDifferenceShort(data.score.ended_at, 2)

    const name = getMultipleTextPath([{
        font: poppinsBold,
        text: (user?.username || '') + '  ',
        size: 24,
        color: '#fff'
    }, {
        font: poppinsBold,
        text: '[' + time_difference + ']',
        size: 14,
        color: '#fff'
    }], 176, 26, 'left baseline')

    const name_width = poppinsBold.getTextWidth((user?.username || '') + '  ', 24)
        + poppinsBold.getTextWidth('[' + time_difference + ']', 14)

    const flag_svg = await getFlagPath(user.country_code, 138, 8 - 2, 20)

    // 导入N1标签
    const acc = data.score.accuracy * 100;
    const combo = data.score.max_combo;
    const pp = floors(data.score.pp, 0)

    let score
    if (data?.is_legacy) {
        const l = data.score.legacy_total_score

        if (l > 0) {
            score = l
        } else {
            score = data.score.total_score
        }
    } else {
        score = data.score.total_score
    }

    const delta_score = (data.compare_score - score !== 0) ? ((score - data.compare_score)) : 0;

    const acc_number = rounds(acc, 2)

    let combo_index = ''

    if (data.score.rank === 'XH' || data.score.rank === 'X') {
        combo_index = ' [PF]'
    } else if (data.score.is_perfect_combo || (data.score.beatmap.max_combo === data.score.max_combo)) {
        combo_index = ' [FC]'
    }

    const n2_acc = getSvgBody(138, 36,
        await label_N2({
            ...LABELS.ACC2,
            data_b: acc_number.integer,
            data_m: acc_number.decimal + '%',
        }));
    const n2_combo = getSvgBody(138 + 92, 36,
        await label_N2({
            ...LABELS.COMBO2,
            data_b: combo.toString(),
            data_m: 'x' + combo_index,
        }));

    const pp_text = getMultipleTextPath([{
        font: poppinsBold,
        text: pp.integer,
        size: 28,
        color: '#fff'
    }, {
        font: poppinsBold,
        text: pp.decimal + ' PP',
        size: 20,
        color: '#fff'
    }], 834, 31, 'right baseline')

    const score_width = poppinsBold.getTextWidth(delta_score + '  ', 12) + poppinsBold.getTextWidth(score, 18)

    let delta_score_text

    if (score_width > 146) {
        delta_score_text = round(delta_score, 2)
    } else {
        if (Math.abs(delta_score) <= 1e-4) {
            delta_score_text = '-0'
        } else {
            delta_score_text = delta_score.toString()
        }
    }

    const score_text = getMultipleTextPath([{
        font: poppinsBold,
        text: delta_score_text + '  ',
        size: 12,
        color: '#aaa'
    }, {
        font: poppinsBold,
        text: score,
        size: 18,
        color: '#aaa'
    }], 834, 53, 'right baseline')

    const ranking = poppinsBold.getTextPath(data.score_rank, 32 + 2, 38, 20, 'center baseline', "#fff")

    // 导入评价，x和y是矩形的左上角
    let stat_svg = ''
    const stat_interval = 5;
    const stat_x = 360
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

            stat_svg += stat_text + svg_rect

            //结算
            width_sum += (width + stat_interval);
        }
    }

    // 插入模组，因为先插的在上面，所以从左边插
    /*
    let mods_svg = ''
    const mods_arr = data.score.mods ?? [{acronym: ''}]
    const mods_arr_length = mods_arr.length;

    let multiplier
    if (mods_arr_length <= 5 && mods_arr_length > 0) {
        multiplier = 2
    } else if (mods_arr_length > 5) {
        multiplier = 1
    }

    mods_arr.forEach((mod, i) => {
        const offset_x = 915 - 235 - 32 + multiplier * 24 - mods_arr_length * multiplier * 24

        mods_svg += getModRRectPath(mod, offset_x + multiplier * i * 24, 6, 40, 20, 10, 15)
    });

     */
    const mods_arr = data.score.mods ?? [{acronym: ''}]
    const mods_svg = drawLazerMods(mods_arr, 685, 3, 25, 510 - name_width, 'right', 4, true).svg

    const rank_rrect = PanelDraw.Rect(810, 0, 105, 62, 20, rank_color)
    const version_rrect = PanelDraw.Rect(0, 0, 65 + 62, 62, 20, data?.score?.is_lazer ? "#FF9800" : "#00A0E9")

    svg = setImage(svg, 65, 0, 62, 62, avatar, reg_avatar)
    svg = setImage(svg, 65, 0, 790, 62, cover, reg_background, 0.2)
    svg = setText(svg, mods_svg, reg_mod)
    svg = setText(svg, stat_svg, reg_label)
    svg = setTexts(svg, [rank_rrect, version_rrect], reg_rank)
    svg = setTexts(svg, [name, flag_svg, n2_combo, n2_acc, pp_text, score_text, ranking, rank], reg_text)

    return svg.toString()
}

function getStatWidthArr(stat_sum = 1, stat_arr = [], minWidth = 10, fullWidth = 325, interval = 5) {
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
            stat_arr.push(s.small_tick_miss);
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
            stat_color_arr = [
                '#8DCEF4',
                '#79C471',
                '#FEF668',
                '#ED6C9E'
            ];
            break;
        case 1:
            stat_color_arr = [
                '#8DCEF4',
                '#79C471',
                '#ED6C9E'
            ];
            break;
        case 2:
            stat_color_arr = [
                '#8DCEF4',
                '#79C471',
                '#FEF668',
                '#ED6C9E',
                '#A1A1A1'
            ];
            break;
        case 3:
            stat_color_arr = [
                '#8DCEF4',
                '#FEF668',
                '#79C471',
                '#5E8AC6',
                '#A1A1A1',
                '#ED6C9E'
            ];
            break;
    }
    return stat_color_arr;
}