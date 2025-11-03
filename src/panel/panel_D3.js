import {
    exportJPEG,
    floor, getGameMode, getImage,
    getImageFromV3, getImageFromV3Cache, getNowTimeStamp, getPanelNameSVG,
    getSvgBody,
    getTexts, getTimeByDHMS, getTimeDifference, isNotNumber, isNumber, round, rounds, setCustomBanner, setImage,
    setSvgBody, setText,
    setTexts
} from "../util/util.js";
import {colorArray, PanelColor} from "../util/color.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMultipleTextPath, poppinsBold} from "../util/font.js";
import {getMascotBanner, getMascotName, pp2UserBG} from "../util/mascotBanner.js";
import {label_D3} from "../component/label.js";
import moment from "moment";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_D3(data);
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
        const svg = await panel_D3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * info v4
 * @param data
 * @return {Promise<string>}
 */
export async function panel_D3(
    data = {
        user: {},
        bests: [],
        best_arr: {
            count: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0
            ],
            max: 1,
            time: '09-13',
            week0: '11-02',
            week4: '10-05',
            week8: '09-07'
        },
        playcount_arr: {
            count: [
                217, 183, 193, 122, 172, 334, 214, 141, 100,
                108, 68, 72, 54, 61, 131, 42, 118, 78,
                20, 140, 167, 79, 36, 96, 114, 152, 67,
                41, 156, 93, 90, 72, 66, 99, 96, 81,
                43, 7, 0
            ],
            max: 334,
            time: '2023-03',
            year0: '25',
            year1: '24',
            year2: '23',
            year3: '22',
            quarter: 4
        },
        ranking_arr: {
            ranking: [
                44805, 44836, 44867, 44889, 44913, 44923, 44947, 44970,
                45000, 45021, 45040, 45055, 45073, 45094, 45117, 45131,
                45158, 45181, 45208, 45233, 45263, 45281, 45305, 45333,
                45351, 45383, 45409, 45430, 45453, 45478, 45506, 45523,
                45550, 45579, 45615, 45649, 45665, 45686, 45703, 45727,
                45747, 45774, 45801, 45825, 45851, 45882, 45905, 45924,
                45952, 45972, 45996, 46014, 46037, 46058, 46077, 46100,
                46125, 46154, 46174, 46185, 46205, 46225, 46250, 46265,
                46287, 46303, 46325, 46346, 46363, 46379, 46398, 46417,
                46433, 46454, 46474, 46499, 46525, 46559, 46587, 46616,
                46650, 46667, 46699, 46721, 46748, 46767, 46783, 46802,
                46822, 46822
            ],
            statistics: {
                top: 44805,
                bottom: 46822,
                improvement: 0,
                intervals: null
            }
        },
        highest_rank: {rank: 22319, time: '2021-11-10T12:57:03Z'},
        percentiles: {
            global_rank: 1,
            country_rank: 1,
            level: 0,
            rank_count_score: 0,
            play_count: 0,
            total_hits: 0,
            play_time: 0,
            ranked_score: 0,
            total_score: 0,
            beatmap_playcount: 0,
            replays_watched: 0,
            maximum_combo: 0
        },
        history_day: 1,
        history_user: {
            max_combo: 2801,
            accuracy: 98.8682,
            user_id: 7003013,
            play_count: 24623,
            level_progress: 51,
            country_rank: 845,
            play_time: 2426037,
            total_hits: 9219039,
            level_current: 100,
            global_rank: 46822,
            statistics: {
                pp: 6381.16,
                count_ss: 34,
                count_ssh: 120,
                count_s: 168,
                count_sh: 989,
                count_a: 1694,
                ranked_score: 31347377267,
                total_score: 78249882504,
                hit_accuracy: 98.8682,
                play_count: 24623,
                play_time: 2426037,
                total_hits: 9219039,
                maximum_combo: 2801,
                global_rank: 46822,
                replays_watched_by_others: 0,
                country_rank: 845,
                level_current: 100,
                level_progress: 51,
                time: '2025-11-01T07:57:26.646629'
            },
            support_level: 0,
            rank_history: {mode: 'osu', data: [Array]},
            pp: 6381.16,
            user_achievements_count: 0
        },
        bonus_pp: 0,
    },
) {

    // 自设定义
    const has_custom_panel = false;

    const user = data?.user
    const bests = data?.bests

    const best_arr = data?.best_arr
    const playcount_arr = data?.playcount_arr
    const ranking_arr = data?.ranking_arr
    const highest_rank = data?.highest_rank
    const percentiles = data?.percentiles
    const bonus_pp = data?.bonus_pp ?? 0

    const history = data?.history_user
    const day = data?.history_day

    const hue = user?.profile_hue ?? 342

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PD2-BR">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PD2-BG">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PD2-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PD2-BR);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PD2-BG)" style="clip-path: url(#clippath-PD2-BG);">
        </g>
    </g>
    <g id="Component">
    </g>
    <g id="Card_A1">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: ${PanelColor.middle(hue)};"/>
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PD2-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PD2-BG\)" style="clip-path: url\(#clippath-PD2-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/

    // 卡片定义
    const cardA1 = await card_A1(
        await PanelGenerate.user2CardA1(user, history)
    );
    const componentD1 = component_D1(ranking_arr, has_custom_panel, hue)

    const componentD2 = component_D2({
        level_current: user.level_current,
        level_progress: user.level_progress,
        top_percent: percentiles?.level,
    }, has_custom_panel, hue)

    const componentD3 = component_D3(
        {
            bests: await PanelGenerate.score2CardD2(bests),
            best_pp: Math.max((user.pp ?? 0) - bonus_pp, 0),
            bonus_pp: bonus_pp,
        },
        has_custom_panel, hue
    )

    const stat = user.statistics

    const componentD4 = component_D4(
        {
            user: [stat.count_ssh, stat.count_ss, stat.count_sh, stat.count_s, stat.count_a],

            sum: Math.max(1, stat.count_ssh + stat.count_ss + stat.count_sh + stat.count_s + stat.count_a),

            delta: [
                getDelta(stat.count_ssh, history?.count_ssh),
                getDelta(stat.count_ss, history?.count_ss),
                getDelta(stat.count_sh, history?.count_sh),
                getDelta(stat.count_s, history?.count_s),
                getDelta(stat.count_a, history?.count_a)
            ],

            top_percent: percentiles?.rank_count_score,
        },
        has_custom_panel, hue
    )

    const componentD5 = component_D5(best_arr, has_custom_panel, hue)
    const componentD6 = component_D6(playcount_arr, has_custom_panel, hue)
    const componentD7 = component_D7({
        highest_rank: highest_rank,
        statistics: user.statistics,
        history: history.statistics,
        top_percent: percentiles,
        achievements_count: user.user_achievements_count ?? 0,
        replays_watched_counts: (user.replays_watched_counts?? []).length,
        beatmap_playcounts_count: user.beatmap_playcounts_count ?? 0,
        mode: getGameMode(user.mode, 0)
    }, has_custom_panel, hue)

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const string_components = [
        getSvgBody(40, 330, componentD1),
        getSvgBody(40, 500, componentD2),
        getSvgBody(40, 620, componentD3),
        getSvgBody(40, 935, componentD4),
        getSvgBody(1460, 330, componentD5),
        getSvgBody(1680, 330, componentD6),
        getSvgBody(550, 500, componentD7),
    ]

    svg = setTexts(svg, string_components, reg_component)

    // 面板文字
    const day_str = isNumber(day) ? (day >= 2 ?
            ('compare time: ' + day + ' days ago // ') :
            ('compare time: ' + day + ' day ago // ')) :
        '';

    const request_time = day_str + 'request time: ' + getNowTimeStamp();

    const panel_name = getPanelNameSVG('Information v4 (!ymi)', 'I', request_time);

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    // 插入图片和部件
    const background = pp2UserBG(data.user.pp || 0);
    svg = setCustomBanner(svg, data.user?.profile?.banner, reg_banner);
    svg = setImage(svg, 0, 280, 1920, 1080, background, reg_background, 0.6);

    return svg.toString();
}

const component_D1 = (
    ranking_arr = {
        ranking: [],
        statistics: {}
    },
    has_custom_panel = false,
    hue = 342
) => {
    const hide = has_custom_panel
    const stat = ranking_arr.statistics
    const ranking = ranking_arr?.ranking ?? []

    const ranking_y_bottom = floor(stat.bottom, 1, -1);
    const ranking_y_middle = floor((stat.top + stat.bottom) / 2, 1, -1);
    const ranking_y_top = floor(stat.top, 1, -1);

    const y_axis =
        poppinsBold.getTextPath(ranking_y_top, 25, 48, 14, 'center baseline', '#fc2') +
        poppinsBold.getTextPath(ranking_y_middle, 25, (48 + 128) / 2, 14, 'center baseline', '#fc2') +
        poppinsBold.getTextPath(ranking_y_bottom, 25, 128, 14, 'center baseline', '#fc2');

    const rank_chart = PanelDraw.LineChart(
        ranking, stat.top, stat.bottom,
        45, 35 + 90, 1340, 90, '#ffcc22', 1, 0.2, 4, true)

    let x_axis = ''

    for (let i = 0; i <= 9; i++) {
        let suffix = ''
        let anchor = 'center baseline'

        if (i === 0) {
            suffix = 'day';
            anchor = 'right baseline'
        } else if (i === 9) {
            anchor = 'left baseline'
        }

        const x = 1385 - 1340 * i / 9

        x_axis += poppinsBold.getTextPath('-' + (i * 10) + suffix, x, 144, 16, anchor, '#aaa')
    }

    let improvement = ''

    const intervals = stat?.intervals ?? []

    for (const interval of intervals) {
        const x = 45 + 1340 * interval.end / 90

        const stat_now = ranking[interval.end]
        const percent = (stat_now - stat.top) / (stat.bottom - stat.top) ?? 0

        let delta = -5

        if ((interval.end <= 14 || interval.end >= 60) && percent <= 0.2) {
            delta = 20
        }

        const y = 30 + (percent * 90) + delta

        const imp = floor(interval.improvement, 1, -1)

        improvement += poppinsBold.getTextPath('+' + imp, x, y, 16, 'center baseline', '#fff')
    }

    const improvement_svg = poppinsBold.getTextPath(
        'Improvement In 90 days: +' + stat.improvement ?? 0,
        1390, 25, 18, 'right baseline', '#fff')

    let title = ''
    let image = ''
    let rrect = ''

    if (!hide) {
        title = poppinsBold.getTextPath('Ranking', 45, 25, 18, 'left baseline', '#fff')

        image = getImage(10, 4, 30, 30,
            getImageFromV3('Icons', 'changelog-a.png'))

        rrect = PanelDraw.Rect(0, 0, 1400, 150, 20, PanelColor.middle(hue))
    }

    return '<g>' + getTexts([improvement, improvement_svg, rank_chart, x_axis, y_axis, title, image, rrect]) + '</g>'
}

const component_D2 = (
    data = {
        level_current: 0,
        level_progress: 0,
        top_percent: 0,
    },
    has_custom_panel = false,
    hue = 342
) => {
    const hide = has_custom_panel

    const percent = (data.level_progress / 100) ?? 0

    const level_rrect = PanelDraw.LinearGradientRect(95, 42, 385 * percent, 15, 7.5, colorArray.cyan)

    const base_rrect = PanelDraw.Rect(95, 42, 385, 15, 7.5, PanelColor.top(hue))

    let hexagon = ''

    const level = poppinsBold.getTextPath(
        (data?.level_current ?? 0).toString(), 47.5, 60, 28, 'center baseline', '#fff')

    const current = poppinsBold.getTextPath(
        ((data?.level_progress ?? 0)) + '%', 95, 82, 18, 'left baseline', '#fff')

    const top = poppinsBold.getTextPath(
        'Top ' + (round(100 - (data?.top_percent ?? 0) * 100, 2)) + '%', 480, 82, 18, 'right baseline', '#aaa')

    let title = ''
    let image = ''
    let rrect = ''

    if (!hide) {
        hexagon = getImage(15, 15, 65, 70, getImageFromV3('object-hexagon-level.png'))

        title = poppinsBold.getTextPath('Level', 440, 25, 18, 'right baseline', '#fff')

        image = getImage(450, 4, 30, 30,
            getImageFromV3('Icons', 'rulesets.png'))

        rrect = PanelDraw.Rect(0, 0, 490, 100, 20, PanelColor.middle(hue))
    }

    return '<g>' + getTexts([hexagon, level, current, top, level_rrect, base_rrect, title, image, rrect]) + '</g>'
}

const component_D3 = (
    data = {
        bests: [],
        best_pp: 0,
        bonus_pp: 0,
    },
    has_custom_panel = false,
    hue = 342
) => {
    const hide = has_custom_panel

    const d2s = data.bests

    let string_d2s = ''
    let rrect_d2s = ''

    for (let i = 0; i < d2s.length; i++) {
        const x = i % 3
        const y = Math.floor(i / 3)

        string_d2s += getSvgBody(10 + x * 160, 35 + y * 130, d2s[i])
        rrect_d2s += PanelDraw.Rect(10 + x * 160, 35 + y * 130, 150, 120, 10, PanelColor.top(hue))
    }

    const pp_text = Math.round(data.best_pp ?? 0) + ' PP [' + round(data.bonus_pp ?? 0, 3) + ' Bonus PP]'

    const pp = poppinsBold.getTextPath(
        pp_text, 480, 25, 18, 'right baseline', '#aaa'
    )

    let title = ''
    let image = ''
    let rrect = ''

    if (!hide) {
        title = poppinsBold.getTextPath('Bests', 45, 25, 18, 'left baseline', '#fff')

        image = getImage(10, 4, 30, 30,
            getImageFromV3('Icons', 'thumbs-up.png'))

        rrect = PanelDraw.Rect(0, 0, 490, 295, 20, PanelColor.middle(hue))
    }

    return '<g>' + getTexts([pp, string_d2s, title, image, rrect]) + '</g>'
}

const component_D4 = (
    data = {},
    has_custom_panel = false,
    hue = 342
) => {
    const hide = has_custom_panel

    let rank_body = ''

    let length = 0;

    const ranks = ['XH', 'X', 'SH', 'S', 'A']
    let rrect_lengths = []

    for (const i in data.user) {
        const rank = ranks[i]
        const count = data.user[i]
        const delta = data.delta[i]
        const x = 15 + i * 90

        const icon = getImageFromV3Cache('object-score-' + rank + '-small.png')

        let text;
        let delta_text = getText(delta);

        if (rank === 'S' || rank === 'SH') {
            text = ''
        } else {
            text = ' '
            delta_text = ' ' + delta_text
        }

        if (count < 1000) {
            text += (' ' + count)
            delta_text = ' ' + delta_text
        } else if (count >= 100000) {
            text += floor(count, 2)
        } else {
            text += count?.toString()
        }

        const label = label_D3({
            icon: icon,
            text: text,
            delta: delta_text,
            delta_color: getColor(delta),
            hide: data.has_custom_panel
        })

        rank_body += getSvgBody(x, 25, label)

        // 底部颜色
        const l = (count * 460 / data?.sum)

        if (l > 0) {
            length += Math.max(l, 15)
            rrect_lengths.push(Math.min(length, 460))
        } else {
            rrect_lengths.push(0)
        }
    }

    const rrect_colors = [colorArray.white, colorArray.yellow, colorArray.gray, colorArray.amber, colorArray.green]

    let rrects = ''

    for (let i in rrect_lengths) {
        const w = rrect_lengths[rrect_lengths.length - 1 - i]
        const c = rrect_colors[rrect_lengths.length - 1 - i]

        rrects += PanelDraw.LinearGradientRect(15, 75, w, 15, 7.5, c, 1)
    }

    const base_rrect = PanelDraw.Rect(15, 75, 460, 15, 7.5, PanelColor.top(hue), 1)

    const top = poppinsBold.getTextPath(
        'Top ' + (round(100 - (data?.top_percent ?? 0) * 100, 2)) + '%', 480, 22, 18, 'right baseline', '#aaa')

    let title = ''
    let image = ''
    let rrect = ''

    if (!hide) {
        title = poppinsBold.getTextPath('Rank Count', 45, 25, 18, 'left baseline', '#fff')

        image = getImage(10, 4, 30, 30,
            getImageFromV3('Icons', 'crown.png'))

        rrect = PanelDraw.Rect(0, 0, 490, 105, 20, PanelColor.middle(hue))
    }

    return '<g>' + getTexts([top, rank_body, rrects, base_rrect, title, image, rrect]) + '</g>'
}

const component_D5 = (
    best_arr = {

        count: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0
        ],
        max: 1,
        time: '09-13',
        week0: '11-02',
        week4: '10-05',
        week8: '09-07'
    },
    has_custom_panel = false,
    hue = 342
) => {
    const hide = has_custom_panel

    const matrix = PanelDraw.RectMatrix(
        11, 33, 178, 94, {
            width: 10, height: 10, row: 7, column: 13
        }, best_arr.count ?? [], {
            hue: 207, saturation: 0.77, lightness_min: 0.2, lightness_max: 0.8
        }, 5, 1
    )

    const x_axis = poppinsBold.getTextPath(
        best_arr.week0, 189, 144, 16, 'right baseline', '#aaa'
    ) + poppinsBold.getTextPath(
        best_arr.week4, 133, 144, 16, 'right baseline', '#aaa'
    ) + poppinsBold.getTextPath(
        best_arr.week8, 77, 144, 16, 'right baseline', '#aaa'
    )

    const max = poppinsBold.getTextPath(
        'MAX: +' + (best_arr.max ?? 0), 189, 15, 12, 'right baseline', '#aaa'
    ) + poppinsBold.getTextPath(
        (best_arr.time ?? '-'), 189, 28, 12, 'right baseline', '#aaa'
    )

    let title = ''
    let rrect = ''

    if (!hide) {
        title = poppinsBold.getTextPath('BP', 10, 25, 18, 'left baseline', '#fff')

        rrect = PanelDraw.Rect(0, 0, 200, 150, 20, PanelColor.middle(hue))
    }

    return '<g>' + getTexts([x_axis, max, matrix, title, rrect]) + '</g>'

}

const component_D6 = (
    playcount_arr = {
        count: [
            217, 183, 193, 122, 172, 334, 214, 141, 100,
            108, 68, 72, 54, 61, 131, 42, 118, 78,
            20, 140, 167, 79, 36, 96, 114, 152, 67,
            41, 156, 93, 90, 72, 66, 99, 96, 81,
            43, 7, 0
        ],
        max: 334,
        time: '2023-3',
        year0: '25',
        year1: '24',
        year2: '23',
        year3: '22',
        quarter: 4,
    },
    has_custom_panel = false,
    hue = 342
) => {
    const hide = has_custom_panel
    const quarter_offset = (playcount_arr.quarter ?? 1) - 1

    const matrix = PanelDraw.RectMatrix(
        11, 33, 178, 94, {
            width: 10, height: 28, row: 3, column: 13
        }, playcount_arr.count ?? [], {
            hue: 90, saturation: 0.4, lightness_min: 0.2, lightness_max: 0.8
        }, 5, 1
    )

    let x_axis = poppinsBold.getTextPath(
        playcount_arr.year0, Math.min(179 - quarter_offset * 14, 170), 144, 16, 'left baseline', '#aaa'
    ) + poppinsBold.getTextPath(
        playcount_arr.year1, 123 - quarter_offset * 14, 144, 16, 'left baseline', '#aaa'
    ) + poppinsBold.getTextPath(
        playcount_arr.year2, 67 - quarter_offset * 14, 144, 16, 'left baseline', '#aaa'
    )

    if (quarter_offset === 0) {
        x_axis += poppinsBold.getTextPath(
            playcount_arr.year3, 10, 144, 16, 'left baseline', '#aaa'
        )
    }

    const max = poppinsBold.getTextPath(
        'MAX: ' + (playcount_arr.max ?? 0), 189, 15, 12, 'right baseline', '#aaa'
    ) + poppinsBold.getTextPath(
        (playcount_arr.time ?? '-'), 189, 28, 12, 'right baseline', '#aaa'
    )

    let title = ''
    let rrect = ''

    if (!hide) {
        title = poppinsBold.getTextPath('PC', 10, 25, 18, 'left baseline', '#fff')

        rrect = PanelDraw.Rect(0, 0, 200, 150, 20, PanelColor.middle(hue))
    }

    return '<g>' + getTexts([x_axis, max, matrix, title, rrect]) + '</g>'

}

const component_D7 = (
    data = {
        highest_rank: {},

        statistics: {},

        history: {},

        top_percent: {},

        achievements_count: 0,
        replays_watched_counts: 0,
        beatmap_playcounts_count: 0,

        mode: 'osu'
    },
    has_custom_panel = false,
    hue = 342
) => {
    const hide = has_custom_panel
    const percent = data?.top_percent ?? {}
    const stat = data.statistics
    const history = data.history

    let title = ''
    let image = ''
    let mascot = ''
    let mascot_name = ''
    let rrect = ''
    let mascot_rect = ''

    let highest_icon = ''
    let highest_title = ''

    const highest_rank = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: '#',
            size: 30,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: (data.highest_rank.rank ?? 0).toString(),
            size: 40,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: '     [' +
                getTimeDifference(data.highest_rank.time, 'YYYY-MM-DD[T]HH:mm:ss[Z]',
                    moment().subtract(8, "hours"), 2
                ) + ']',
            size: 24,
            color: '#ccc'
        }], 140, 134, 'left baseline'
    )


    const overlay = PanelColor.overlay(hue)
    const top = PanelColor.top(hue)
    const middle = PanelColor.middle(hue)

    const pc_text = rounds(stat.play_count ?? 0, -4)
    const tth_text = rounds(stat.total_hits ?? 0, -4)
    const rks_text = rounds(stat.ranked_score ?? 0, -4)
    const tts_text = rounds(stat.total_score ?? 0, -4)
    const bpc_text = rounds(data.beatmap_playcounts_count ?? 0, -4)
    const rwc_text = rounds(data.replays_watched_counts ?? 0, -4)
    const mxc_text = rounds(stat.maximum_combo ?? 0, -4)


    /**
     *
     * @type {[{}]}
     */

    const params = [
        {
            icon: getImageFromV3('Icons', 'play.png'),
            title: 'Play Count',
            percent: percent.play_count ?? 0,
            text_b: pc_text.integer,
            text_m: pc_text.decimal,

            value: stat.play_count ?? 0,
            divisor: 1000,
            history: history?.play_count ?? 0,

            colors: colorArray.cyan,

            background_color: overlay,
            icon_background_color: top,
        }, {
            icon: getImageFromV3('Icons', 'gameplay-c.png'),
            title: 'Total Hits',
            percent: percent.total_hits ?? 0,
            text_b: tth_text.integer,
            text_m: tth_text.decimal,

            value: stat.total_hits ?? 0,
            divisor: 1000,
            history: history?.total_hits ?? 0,

            colors: colorArray.yellow,

            background_color: overlay,
            icon_background_color: top,
        }, {
            icon: getImageFromV3('Icons', 'calendar.png'),
            title: 'Play Time',
            percent: percent.play_time ?? 0,
            text_b: getTimeByDHMS((stat.play_time ?? 0), true),
            text_m: '',

            value: stat.play_time ?? 0,
            divisor: 3600,
            history: history?.play_time ?? 0,

            colors: colorArray.light_green,

            background_color: overlay,
            icon_background_color: top,
        }, {
            icon: getImageFromV3('Icons', 'online.png'),
            title: 'Ranked Score',
            percent: percent.ranked_score ?? 0,
            text_b: rks_text.integer,
            text_m: rks_text.decimal,

            value: stat.ranked_score ?? 0,
            divisor: 1_000_000,
            history: history?.statistics?.ranked_score ?? 0,

            colors: colorArray.purple.toReversed(),

            background_color: top,
            icon_background_color: middle,
        }, {
            icon: getImageFromV3('Icons', 'global.png'),
            title: 'Total Score',
            percent: percent.total_score ?? 0,
            text_b: tts_text.integer,
            text_m: tts_text.decimal,

            value: stat.total_score ?? 0,
            divisor: 1_000_000,
            history: history?.statistics?.total_score ?? 0,

            colors: colorArray.pink,

            background_color: top,
            icon_background_color: middle,
        }, {
            icon: getImageFromV3('Icons', 'crown.png'),
            title: 'Medals',
            percent: -1,
            text_b: (data.achievements_count ?? 0).toString(),
            text_m: '',

            value: data.achievements_count ?? 0,
            divisor: 1,
            history: 0,

            colors: colorArray.gray,

            background_color: top,
            icon_background_color: middle,
        }, {
            icon: getImageFromV3('Icons', 'input.png'),
            title: 'Beatmap Play Count',
            percent: percent.beatmap_playcount ?? 0,
            text_b: bpc_text.integer,
            text_m: bpc_text.decimal,

            value: data.beatmap_playcounts_count ?? 0,
            divisor: 1,
            history: 0,

            colors: colorArray.green,

            background_color: top,
            icon_background_color: middle,
        }, {
            icon: getImageFromV3('Icons', 'crown.png'),
            title: 'Replays Watched',
            percent: percent.replays_watched ?? 0,
            text_b: rwc_text.integer,
            text_m: rwc_text.decimal,

            value: data.replays_watched_counts ?? 0,
            divisor: 1,
            history: history?.statistics?.replays_watched_counts ?? 0,

            colors: colorArray.yellow,

            background_color: top,
            icon_background_color: middle,
        }, {
            icon: getImageFromV3('Icons', 'cross-circle.png'),
            title: 'Maximum Combo',
            percent: percent.maximum_combo ?? 0,
            text_b: mxc_text.integer,
            text_m: mxc_text.decimal,

            value: stat.maximum_combo ?? 0,
            divisor: 1,
            history: history?.maximum_combo ?? 0,

            colors: colorArray.blue,

            background_color: top,
            icon_background_color: middle,
        },
    ]

    const labels = params.map(it => label_D6(it, has_custom_panel))

    let label_strings = ''

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const x = 10 + j * 440
            const y = 168 + i * 124

            label_strings += getSvgBody(x, y, labels[i * 3 + j])
        }
    }

    if (!hide) {
        title = poppinsBold.getTextPath('Statistics Overview', 45, 25, 18, 'left baseline', '#fff')

        image = getImage(10, 4, 30, 30,
            getImageFromV3('Icons', 'gameplay-b.png'))

        const mascot_name_text = getMascotName(data.mode)

        mascot_name = poppinsBold.getTextPath(mascot_name_text, 1320, 62, 18, 'right baseline', '#fff')

        const mascot_data = getMascotBanner(data.mode, 140)

        mascot = `
    <defs>
        <linearGradient id="linear-O3-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:0" />
            <stop offset="60%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
        </linearGradient>
        <mask id="mask-O3-1">
            <rect x="790" y="40" width="540" height="140" fill="url(#linear-O3-1)"/>
        </mask>
    </defs>
    <g id="Background_Right" mask="url(#mask-O3-1)"> 
`
            + getImage(790, 40 + mascot_data.y, 540, 720, mascot_data.mascot, 1)
            + '</g>'

        mascot_rect = PanelDraw.Rect(0, 40, 1330, 140, 0, PanelColor.top(hue))

        highest_icon = getImage(25, 55, 100, 100, getImageFromV3('Icons', 'ranking.png'))

        highest_title = poppinsBold.getTextPath('Highest Rank', 140, 86, 24, 'left baseline', '#ccc')

        rrect = PanelDraw.Rect(0, 0, 1330, 540, 20, PanelColor.middle(hue))
    }

    return '<g>' + getTexts([label_strings, highest_rank, highest_icon, highest_title, mascot_name, mascot, title, image, mascot_rect, rrect]) + '</g>'
}


function label_D6(
    data = {
        icon: '',
        title: '',
        percent: 0,
        text_b: '',
        text_m: '',

        value: 0, // 这两个用于显示下方的方框
        divisor: 1,
        history: 0,

        colors: [],

        background_color: '',
        icon_background_color: '',
    },
    has_custom_panel = false,
) {
    const hide = has_custom_panel

    let title = ''

    const text = poppinsBold.get2SizeTextPath(data.text_b ?? '0', data.text_m ?? '', 36, 28, 110, 72, 'left baseline', '#fff')

    const percent_rrect = (data.percent >= 0) ?
        PanelDraw.LinearGradientRect(
            400, 18 + (1 - data.percent) * 78,
            15, data.percent > 0 ? Math.max(data.percent * 78, 15) : 0,
            7.5,
            data.colors ?? colorArray.deep_gray, 1, [0, 0], [80, 20])
        :
        PanelDraw.LinearGradientRect(
            400, 18,
            15, 78,
            7.5,
            data.colors ?? colorArray.deep_gray, 1, [0, 0], [20, 80])

    const top = (data.percent >= 0) ? poppinsBold.getTextPath(
        'Top ' + round(100 - (data.percent ?? 0) * 100, 2) + '%', 395, 96, 14, 'right baseline', '#aaa'
    ) : ''

    const roman = getSvgBody(110, 84, getRomanSigns(data.value, data.divisor))

    let delta = data.value - data.history

    if (data.history === 0) delta = 0

    const delta_svg = poppinsBold.getTextPath(
        getText(delta), 395, 32, 16, 'right baseline', getColor(delta)
    )

    let icon = ''
    let rrect = ''
    let icon_rrect = ''
    let percent_base_rrect = ''

    if (!hide) {
        icon = getImage(20, 22, 70, 70, data.icon)

        title = poppinsBold.getTextPath(data.title ?? 'Label', 110, 32, 18, 'left baseline', '#ccc')

        rrect = PanelDraw.Rect(0, 0, 430, 114, 20, data.background_color)

        icon_rrect = PanelDraw.Rect(15, 17, 80, 80, 20, data.icon_background_color)

        percent_base_rrect = PanelDraw.Rect(400, 18, 15, 78, 7.5, data.icon_background_color)
    }

    return '<g>' + getTexts([title, text, top, delta_svg, percent_rrect, roman, icon, icon_rrect, percent_base_rrect, rrect]) + '</g>'

}

function getRomanSigns(value = 0, divisor = 1) {
    const v = Math.round(value / divisor)

    function convertToRoman(num = 0) {
        if (num <= 0) {
            return ''
        }

        if (num >= 4000) {
            num %= 4000
        }

        // 定义罗马数字与阿拉伯数字的对应关系
        const romanNumerals = [
            {value: 1000, numeral: 'M'},
            {value: 900, numeral: 'CM'},
            {value: 500, numeral: 'D'},
            {value: 400, numeral: 'CD'},
            {value: 100, numeral: 'C'},
            {value: 90, numeral: 'XC'},
            {value: 50, numeral: 'L'},
            {value: 40, numeral: 'XL'},
            {value: 10, numeral: 'X'},
            {value: 9, numeral: 'IX'},
            {value: 5, numeral: 'V'},
            {value: 4, numeral: 'IV'},
            {value: 1, numeral: 'I'}
        ];

        let result = '';
        let remaining = num;

        // 遍历每个罗马数字单位
        for (let i = 0; i < romanNumerals.length; i++) {
            const {value, numeral} = romanNumerals[i];

            // 当剩余数字大于等于当前单位值时，添加对应的罗马数字
            while (remaining >= value) {
                result += numeral;
                remaining -= value;
            }
        }

        return result;
    }

    const roman = convertToRoman(v)

    let string = ''

    for (let i = 0; i < roman.length; i++) {
        let shape

        const x = i * 14

        // i 平行四边形，v 正方形，x 菱形，l 三角形，c 五边形，d 六边形，m 圆形
        switch (roman[i]) {
            case 'I':
                shape = PanelDraw.Polygon([
                    x + 8, 0,
                    x + 12, 0,
                    x + 4, 10,
                    x, 10,
                ], '#aaa');
                break
            case 'V':
                shape = PanelDraw.Rect(x, 0, 10, 10, 0, '#aaa');
                break
            case 'X':
                shape = PanelDraw.Polygon([
                    x + 6, -1,
                    x, 5,
                    x + 6, 11,
                    x + 12, 5
                ], '#aaa');
                break
            case 'L':
                shape = PanelDraw.Polygon([
                    x - 1, 10,
                    x - 1 + 12, 10,
                    x - 1 + 6, -0.392
                ], '#aaa');
                break
            case 'C':
                shape = PanelDraw.Polygon([
                    x + 6, 6 - 0.854 - 6.308,
                    x + 6 + 5.706, 6 - 0.854 - 1.854,
                    x + 6 + 3.526, 10,
                    x + 6 - 3.526, 10,
                    x + 6 - 5.706, 6 - 0.854 - 1.854
                ], '#aaa');
                break
            case 'D':
                shape = PanelDraw.Polygon([
                    x, 5.196 - 0.3923,
                    x + 3, 10,
                    x + 9, 10,
                    x + 12, 5.196 - 0.3923,
                    x + 9, -0.3923,
                    x + 3, -0.3923,
                ], '#aaa');
                break
            case 'M':
                shape = PanelDraw.Circle(x + 5, 5, 5, '#aaa');
                break
        }

        string += shape
    }

    return string
}

function getDelta(user = 0, delta = null) {
    if (isNotNumber(delta)) return 0
    else return user - delta
}

// 等于原来 D 卡的 userDelta2Labels
const getSign = (T) => {
    if (isNumber(T)) {
        return (T > 0) ? '+' : ((T < 0) ? '-' : '');
    } else return '';
}

const getColor = (T) => {
    const increase = '#c2e5c3'; //'#93D02E';
    const decrease = '#ffcdd2'; // '#DE6055';
    const none = 'none';

    if (typeof T === 'number') {
        return (T > 0) ? increase : ((T < 0) ? decrease : none);
    } else return '';
}

const getText = (T) => {
    const abs = Math.abs(T);

    if (isNotNumber(T)) {
        return '0';
    } else if (T >= 100000) {
        return getSign(T) + floor(abs, 2);
    } else {
        return getSign(T) + abs;
    }
}
