import {
    exportJPEG, getGameMode,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    readTemplate, setCustomBanner,
    setText,
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {card_F1} from "../card/card_F1.js";
import {card_F2} from "../card/card_F2.js";
import {card_F3} from "../card/card_F3.js";
import {card_F4} from "../card/card_F4.js";
import {card_F5} from "../card/card_F5.js";
import {card_F6} from "../card/card_F6.js";
import {card_F7} from "../card/card_F7.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {pp2UserBG} from "../util/mascotBanner.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_D0(data);
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
        const svg = await panel_D0(data);
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
export async function panel_D0(data = {
    //A1
    user: {},
    historyUser: null,

    //recent
    "re-list": [
        {
            accuracy: 0.9242601246105919,
            mods: [ 'HD' ],
            passed: true,
            perfect: false,
            pp: 15.7001,
            rank: 'B',
            replay: true,
            score: 2647816,
            statistics: {
                count_50: 5,
                count_100: 70,
                count_300: 767,
                count_geki: 149,
                count_katu: 49,
                count_miss: 14
            },
            user: {
                id: 9794030,
                avatar: 'https://a.ppy.sh/9794030?1689442698.jpeg',
                pm_only: false,
                avatar_url: 'https://a.ppy.sh/9794030?1689442698.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: false,
                is_supporter: false,
                last_visit: [Array],
                pm_friends_only: false,
                username: 'SIyuyuko',
                country_code: 'CN'
            },
            best_id: 4518169991,
            max_combo: 207,
            user_id: 9794030,
            created_at: [ 2023, 10, 8, 13, 11, 20 ],
            id: 23509231244,
            mode: 'OSU',
            mode_int: 0,
            beatmap: {
                id: 4044160,
                mode: 'osu',
                status: 'ranked',
                version: "Calvaria's Another",
                ar: 9,
                cs: 5,
                bpm: 110,
                convert: false,
                passcount: 160,
                playcount: 1306,
                ranked: 1,
                url: 'https://osu.ppy.sh/beatmaps/4044160',
                beatMapFailedCount: 0,
                beatMapRetryCount: 0,
                beatMapRating: 0,
                beatmapset_id: 1751172,
                difficulty_rating: 5.1,
                mode_int: 0,
                total_length: 229,
                hit_length: 203,
                user_id: 12381096,
                accuracy: 8,
                drain: 5,
                is_scoreable: true,
                last_updated: '2023-09-15T03:11:55Z',
                checksum: '6eb6623607646fd874f63ffe1bbe0329',
                count_sliders: 429,
                count_spinners: 0,
                count_circles: 427
            },
            beatmapset: {
                video: false,
                fromDatabases: false,
                mapperUID: 11839745,
                sid: 1751172,
                mapperName: 'VoiceCore',
                ranked: true,
                rating: 0,
                id: 1751172,
                user_id: 11839745,
                artist: "Snail's House",
                artist_unicode: "Snail's House",
                title: 'Biscuit Funk',
                title_unicode: 'Biscuit Funk',
                creator: 'VoiceCore',
                favourite_count: 60,
                nsfw: false,
                play_count: 12245,
                preview_url: '//b.ppy.sh/preview/1751172.mp3',
                source: '',
                status: 'ranked',
                covers: [Object],
                spotlight: false
            },
            create_at_str: '2023-10-08T13:11:20Z'
        },
    ],

    //bp
    "bp-list": [{
        accuracy: 0.9983416252072969,
        mods: [ 'HD' ],
        passed: true,
        perfect: true,
        pp: 245.363,
        rank: 'SH',
        replay: true,
        score: 7625753,
        statistics: {
            count_50: 0,
            count_100: 1,
            count_300: 401,
            count_geki: 114,
            count_katu: 1,
            count_miss: 0
        },
        user: {
            id: 9794030,
            avatar: 'https://a.ppy.sh/9794030?1689442698.jpeg',
            pm_only: false,
            avatar_url: 'https://a.ppy.sh/9794030?1689442698.jpeg',
            default_group: 'default',
            is_active: true,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: false,
            last_visit: [Array],
            pm_friends_only: false,
            username: 'SIyuyuko',
            country_code: 'CN'
        },
        weight: { percentage: 69.83373, pp: 171.34613 },
        best_id: 4280526255,
        max_combo: 600,
        user_id: 9794030,
        created_at: [ 2022, 9, 27, 12, 1, 36 ],
        id: 4280526255,
        mode: 'OSU',
        mode_int: 0,
        beatmap: {
            id: 1982050,
            mode: 'osu',
            status: 'ranked',
            version: "Kaguya_Sama's Extra",
            ar: 9.5,
            cs: 4,
            bpm: 108,
            convert: false,
            passcount: 12285,
            playcount: 59715,
            ranked: 1,
            url: 'https://osu.ppy.sh/beatmaps/1982050',
            beatMapFailedCount: 0,
            beatMapRetryCount: 0,
            beatMapRating: 0,
            beatmapset_id: 318425,
            difficulty_rating: 5.55,
            mode_int: 0,
            total_length: 102,
            hit_length: 102,
            user_id: 9326064,
            accuracy: 8.8,
            drain: 5.5,
            is_scoreable: true,
            last_updated: '2019-04-06T18:48:01Z',
            checksum: '546572114dec84e7dbbdddda45a03fa9',
            count_sliders: 183,
            count_spinners: 0,
            count_circles: 219
        },
        beatmapset: {
            video: true,
            fromDatabases: false,
            mapperUID: 2732340,
            sid: 318425,
            mapperName: 'Taeyang',
            ranked: true,
            rating: 0,
            id: 318425,
            user_id: 2732340,
            artist: 'Forte Escape',
            artist_unicode: 'Forte Escape',
            title: 'Ask to Wind',
            title_unicode: '바람에게 부탁해',
            creator: 'Taeyang',
            favourite_count: 144,
            nsfw: false,
            play_count: 314154,
            preview_url: '//b.ppy.sh/preview/318425.mp3',
            source: 'DJMAX',
            status: 'ranked',
            covers: [Object],
            spotlight: false
        },
        create_at_str: '2022-09-27T12:01:36Z'
    }],

    // osu taiko catch mania
    mode: "osu",

    //user_bp_arr
    "bp-time": [],

    ranked_map_play_count: 1564,
    bonus_pp: 0,
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_D.svg');

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PD-BR\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-PD-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_f1 = /(?<=<g id="Card_F1">)/;
    const reg_card_f2 = /(?<=<g id="Card_F2">)/;
    const reg_card_f3 = /(?<=<g id="Card_F3">)/;
    const reg_card_f4 = /(?<=<g id="Card_F4">)/;
    const reg_card_f5 = /(?<=<g id="Card_F5">)/;
    const reg_card_f6 = /(?<=<g id="Card_F6">)/;
    const reg_card_f7 = /(?<=<g id="Card_F7">)/;

    // 卡片定义
    const mode = data.mode ? getGameMode(data.mode.toLowerCase(), 0) :
        (data.user.mode ? getGameMode(data.user.mode.toLowerCase(), 0) : 'default');

    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user, data.historyUser));

    const cardF1 = await card_F1(user2CardF1(data.user, mode));
    const cardF2 = await card_F2({recent: data["re-list"]});
    const cardF3 = await card_F3({bp: data["bp-list"]});
    const cardF4 = await card_F4(user2CardF4(data.user));
    const cardF5 = await card_F5(user2CardF5(data.user, mode, data["bp-time"]));
    const cardF6 = await card_F6(user2CardF6(data.user, data.historyUser, mode, data.bonus_pp, data.ranked_map_play_count));
    const cardF7 = await card_F7(user2CardF7(data.user, mode));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    svg = setSvgBody(svg, 40, 330, cardF1, reg_card_f1);
    svg = setSvgBody(svg, 620, 330, cardF2, reg_card_f2);
    svg = setSvgBody(svg, 620, 690, cardF3, reg_card_f3);
    svg = setSvgBody(svg, 620, 880, cardF4, reg_card_f4);
    svg = setSvgBody(svg, 980, 330, cardF5, reg_card_f5);
    svg = setSvgBody(svg, 980, 690, cardF6, reg_card_f6);

    //F7是不需要平移的，位置由卡片决定
    svg = setSvgBody(svg, 0, 0, cardF7, reg_card_f7);

    // 面板文字
    const panel_name = getPanelNameSVG('Information (!ymi)', 'I');

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    // 插入图片和部件
    const background = pp2UserBG(data.user.pp || 0);
    svg = setCustomBanner(svg, reg_banner, data.user?.profile?.banner);
    svg = setImage(svg, 0, 280, 1920, 1080, background, reg_background, 0.6);

    return svg.toString();
}

function user2CardF1(user, mode = 'osu') {
    return {
        mode: mode,
        level_current: user.level_current,
        level_progress: Math.floor(user.levelProgress),
    }
}

function user2CardF4(user, historyUser) {
    return {
        user: {
            count_ssh: user.statistics.count_ssh,
            count_ss: user.statistics.count_ss,
            count_sh: user.statistics.count_sh,
            count_s: user.statistics.count_s,
            count_a: user.statistics.count_a,
        },

        historyUser: {
            count_ssh: historyUser?.statistics?.count_ssh,
            count_ss: historyUser?.statistics?.count_ss,
            count_sh: historyUser?.statistics?.count_sh,
            count_s: historyUser?.statistics?.count_s,
            count_a: historyUser?.statistics?.count_a,
        }
    };
}

function user2CardF5(user, mode = 'osu', bp_arr = []) {
    return {
        mode: mode,
        country: user?.country?.name || 'China',
        country_rank: user?.statistics?.country_rank,
        global_rank: user?.statistics?.global_rank,

        ranking_arr: user?.rank_history?.data || [],
        bp_arr: bp_arr,
    };
}

function user2CardF6(user, historyUser, mode = 'osu', bonus_pp = 0, ranked_map_play_count = 0) {
    const arr = user.monthly_playcounts || [{start_date: 0}];
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

    return {
        user: {
            ranked_score: user.statistics.ranked_score || 0,
            total_score: user.statistics.total_score || 0,
            play_count: user.statistics.play_count || 0,
            play_time: user.statistics.play_time || 0,

            played_map: user.beatmap_playcounts_count,
            ranked_map: ranked_map_play_count,

            rep_watched: user.statistics.replays_watched_by_others || 0,
            follower: user.follower_count || 0,
            total_hits: user.total_hits || 0,
        },

        delta: {
            ranked_score: (user?.statistics?.ranked_score - historyUser?.statistics?.ranked_score) || 0,
            total_score: (user?.statistics?.total_score - historyUser?.statistics?.total_score) || 0,
            play_count: (user?.statistics?.play_count - historyUser?.statistics?.play_count) || 0,
            play_time: (user?.statistics?.play_time - historyUser?.statistics?.play_time) || 0,
            played_map: 0,
            rep_watched: 0,
            follower: 0,
            total_hits: (user?.statistics?.total_hits - historyUser?.statistics?.total_hits) || 0,
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

