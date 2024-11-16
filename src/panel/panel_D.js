import {
    exportJPEG, getGameMode, getNowTimeStamp,
    getPanelNameSVG,
    implantImage,
    implantSvgBody,
    readTemplate, putCustomBanner,
    replaceText, isNumber,
} from "../util/util.js";
import {card_F1N} from "../card/card_F1N.js";
import {card_A1} from "../card/card_A1.js";
import {card_F5} from "../card/card_F5.js";
import {card_F6N} from "../card/card_F6N.js";
import {card_F7} from "../card/card_F7.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {pp2UserBG} from "../util/mascotBanner.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_D(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}
export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_D(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * user info 面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_D(data = {
    //A1
    user: {},

    historyUser: null,

    //bp
    "bp-list": [],

    // osu taiko catch mania
    mode: "osu",

    //user_bp_arr
    "bp-times": [],
    bonus_pp: 0,

    // 比对自几天前
    day: 1,
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_D.svg');

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PD-BR\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-PD-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_f1n = /(?<=<g id="Card_F1">)/;
    const reg_card_f5 = /(?<=<g id="Card_F5">)/;
    const reg_card_f6n = /(?<=<g id="Card_F6">)/;
    const reg_card_f7 = /(?<=<g id="Card_F7">)/;

    // 卡片定义
    const mode = data.mode ? getGameMode(data.mode.toLowerCase(), 0) :
        (data.user.playmode ? getGameMode(data.user.playmode.toLowerCase(), 0) : 'default');

    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user, data.historyUser));

    const cardF5 = await card_F5(user2CardF5(data.user, mode, data["bp-times"]));
    const cardF6N = await card_F6N(user2CardF6N(data.user, data.historyUser, mode, data.bonus_pp));
    const cardF7 = await card_F7(user2CardF7(data.user, mode));
    const cardF1N = await card_F1N(user2CardF1N(data.user, data.historyUser, mode));

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    svg = implantSvgBody(svg, 40, 330, cardF1N, reg_card_f1n);
    svg = implantSvgBody(svg, 980, 330, cardF5, reg_card_f5);
    svg = implantSvgBody(svg, 980, 690, cardF6N, reg_card_f6n);

    //F7是不需要平移的，位置由卡片决定
    svg = implantSvgBody(svg, 0, 0, cardF7, reg_card_f7);

    // 面板文字
    const day_str = isNumber(data.day) ? (data.day >= 2 ?
            ('compare time: ' + data.day + ' days ago // ') :
            ('compare time: ' + data.day + ' day ago // ')) :
        '';

    const request_time = day_str + 'request time: ' + getNowTimeStamp();

    const panel_name = getPanelNameSVG('Information (!ymi)', 'I', 'v0.5.0 DX', request_time);

    // 导入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入图片和部件
    const background = pp2UserBG(data.user.pp || 0);
    svg = putCustomBanner(svg, reg_banner, data.user?.profile?.banner);
    svg = implantImage(svg, 1920, 1080, 0, 280, 0.6, background, reg_background);

    return svg.toString();
}

function user2CardF1N(user, historyUser, mode = 'osu') {
    return {
        user: {
            play_count: user.statistics.play_count || 0,
            play_time: user.statistics.play_time || 0,
            total_hits: user.totalHits || 0,
        },

        delta: {
            play_count: (user?.statistics?.play_count - historyUser?.statistics?.play_count) || 0,
            play_time: (user?.statistics?.play_time - historyUser?.statistics?.play_time) || 0,
            total_hits: (user?.statistics?.total_hits - historyUser?.statistics?.total_hits) || 0,
        },

        mode: mode,
        level_current: user.level_current,
        level_progress: Math.floor(user.level_progress),
    }
}

function user2CardF5(user, mode = 'osu', bp_arr = []) {
    return {
        mode: mode,
        country: user?.country?.name || 'China',
        country_rank: user?.statistics?.country_rank,
        global_rank: user?.statistics?.global_rank,

        highest_rank: user?.rank_highest?.rank,
        highest_date: user?.rank_highest?.updated_at,

        ranking_arr: user?.rank_history?.data || [],
        bp_arr: bp_arr,
    };
}

function user2CardF6N(user, historyUser, mode = 'osu', bonus_pp = 0) {
    const arr = user.monthlyPlaycounts || [{start_date: 0}];
    let fd = arr[0]?.start_date;

    const pc_arr = [];
    if (fd) {
        const mpc = arr.reduce((obj, {start_date: date, count: count}) => {
            obj[date] = count;
            return obj;
        }, {});
        let [year, month, day] = fd.split('-').map(Number);
        const nowDate = new Date();
        const thisYear = nowDate.getUTCFullYear();
        const thisMonth = nowDate.getUTCMonth() + 1;
        // 如果修改起始日期 参考下面例子
        //  year = thisYear - 1; //修改年
        //  month = month === 12 ? 1 : month + 1; //修改月
        // fd = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-'); //修改要传递的起始日期
        while (true) {
            if (year >= thisYear && month >= thisMonth) {
                break;
            }

            const key = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-');

            if (key in mpc) {
                pc_arr.push(mpc[key]);
            } else {
                pc_arr.push(0);
            }

            if (month < 12) {
                month += 1;
            } else {
                month = 1;
                year += 1;
            }
        }
        fd = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-');
    } else {
        const nowDate = new Date();
        const thisYear = nowDate.getUTCFullYear();
        const thisMonth = nowDate.getUTCMonth() + 1;
        fd = `${thisYear}-${thisMonth.toString().padStart(2, '0')}-01`;
    }

    // 绘制月份
    const last_year = fd.slice(0, 4);
    const last_month = fd.slice(5, 7);
    let first_year;
    let first_month;
    let mid_year;
    let mid_month;

    // 减42个月
    if (parseInt(last_month) <= 6) {
        first_year = (parseInt(last_year) - 4).toString().padStart(2, '0');
        first_month = (parseInt(last_month) + 6).toString().padStart(2, '0');
    } else {
        first_year = (parseInt(last_year) - 3).toString().padStart(2, '0');
        first_month = (parseInt(last_month) - 6).toString().padStart(2, '0');
    }

    // 减21个月
    if (parseInt(last_month) <= 9) {
        mid_year = (parseInt(last_year) - 2).toString().padStart(2, '0');
        mid_month = (parseInt(last_month) + 3).toString().padStart(2, '0');
    } else {
        mid_year = (parseInt(last_year) - 1).toString().padStart(2, '0');
        mid_month = (parseInt(last_month) - 9).toString().padStart(2, '0');
    }

    const medal_arr = user?.user_achievements || [];
    const medal_count = medal_arr?.length || 0;

    return {
        user: {
            ranked_score: user.statistics.ranked_score || 0,
            total_score: user.statistics.total_score || 0,

            played_map: user.beatmap_playcounts_count,

            rep_watched: user.statistics.replays_watched_by_others || 0,
            follower: user.follower_count || 0,
            medal: medal_count,
        },

        delta: {
            ranked_score: (user?.statistics?.ranked_score - historyUser?.statistics?.ranked_score) || 0,
            total_score: (user?.statistics?.total_score - historyUser?.statistics?.total_score) || 0,
        },

        bonus_pp: Math.round(bonus_pp) || 0,

        pc_arr: pc_arr,

        last_year: last_year,
        last_month: last_month,
        first_year: first_year,
        first_month: first_month,
        mid_year: mid_year,
        mid_month: mid_month,

        mode: mode,
    };
}

function user2CardF7(user, mode) {
    return {
        mode: mode,
        country: user?.country?.code || 'UN',
        pp4k: Math.round(user?.statistics?.pp_4k || 0),
        pp7k: Math.round(user?.statistics?.pp_7k || 0),
        cr4k: user.statistics?.country_rank_4k || 0,
        gr4k: user.statistics?.rank_4k || 0,
        cr7k: user.statistics?.country_rank_7k || 0,
        gr7k: user.statistics?.rank_7k || 0,
    }
}

