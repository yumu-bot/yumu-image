import {
    exportJPEG,
    getNowTimeStamp,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    setCustomBanner,
    setText,
    isNumber,
    getTimeByDHMSLarge,
    getTimeByDHMSSmall,
    getTimeByDHMS,
    setTexts,
    isNotNumber,
    getTimeDifference,
    modifyArrayToFixedLength,
    isNotEmptyArray,
    getGameMode,
    isNotBlankString,
    isPicturePng,
    floor,
    floors,
    isNotEmptyString, getSvgBody, getImageFromV3Cache
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getMascotName, getRandomMascotTransparentPath, pp2UserBG} from "../util/mascotBanner.js";
import {label_D3, label_D4, label_D5, LABELS} from "../component/label.js";
import {PanelDraw} from "../util/panelDraw.js";
import {poppinsBold} from "../util/font.js";
import {PanelColor} from "../util/color.js";
import moment from "moment";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_D2(data);
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
        const svg = await panel_D2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * user info 老婆面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_D2(data = {
    user: {
        profile: {
            banner: null
        },

        profile_hue: 0,

        rank_highest: {
            rank: null,
            updated_at: null
        },
    },

    // 比对自几天前
    history_days: 1,

    history_user: null,

    scores: [{}],
    best_time: [0],
    mode: '',
}) {
    // 自设定义
    const has_custom_mascot = false;
    const has_custom_panel = false;

    const user = data?.user
    const scores = data?.scores
    const history = data?.history_user
    const days = data?.history_days
    const best_time = data?.best_time || []

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
    const componentD1 = component_D1(PanelDGenerate.user2componentD1(user, history, has_custom_panel, hue));
    const componentD2 = component_D2(await PanelDGenerate.scores2componentD2(scores, has_custom_panel, hue));
    const componentD3 = component_D3(PanelDGenerate.user2componentD3(user, history, has_custom_panel, hue));

    // D4 是可能出现的看板娘
    const componentD4 = component_D4(PanelDGenerate.mascot2componentD4(user, getGameMode(data?.mode, 0).toLowerCase(), has_custom_mascot, hue));
    const componentD5 = component_D5(PanelDGenerate.user2componentD5(user?.rank_history?.data || [], user?.rank_highest || {}, has_custom_panel, hue));
    const componentD6 = component_D6(PanelDGenerate.user2componentD6(best_time, has_custom_panel, hue));
    const componentD7 = component_D7(PanelDGenerate.user2componentD7(user.monthly_playcounts || [{start_date: 0}], has_custom_panel, hue));
    const componentD8 = component_D8(PanelDGenerate.user2componentD8(user, history, has_custom_panel, hue));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const string_components = [
        getSvgBody(40, 330, componentD1),
        getSvgBody(40, 620, componentD2),
        getSvgBody(40, 940, componentD3),
        getSvgBody(1390, 330, componentD5),
        getSvgBody(1390, 530, componentD6),
        getSvgBody(1390, 650, componentD7),
        getSvgBody(1390, 770, componentD8),
        getSvgBody(0, 0, componentD4),
    ]

    svg = setTexts(svg, string_components, reg_component)

    // 面板文字
    const day_str = isNumber(days) ? (days >= 2 ?
            ('compare time: ' + days + ' days ago // ') :
            ('compare time: ' + days + ' day ago // ')) :
        '';

    const request_time = day_str + 'request time: ' + getNowTimeStamp();

    const panel_name = getPanelNameSVG('Waifu Information v4 (!ymiw)', 'IW', request_time);

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    // 插入图片和部件
    const background = pp2UserBG(data.user.pp || 0);
    svg = setCustomBanner(svg, data.user?.profile?.banner, reg_banner);
    svg = setImage(svg, 0, 280, 1920, 1080, background, reg_background, 0.6);

    return svg.toString();
}


// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_D1 = (
    data = {
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

        join: 0,
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OD1">
    </g>`

    const reg = /(?<=<g id="Component_OD1">)/;

    const hide = data.has_custom_panel

    // 卡片定义
    const pc = floors(data?.user?.play_count, -4)
    const pc_b = pc.integer
    const pc_m = pc.decimal

    const tth = floors(data?.user?.total_hits, -4)
    const tth_b = tth.integer
    const tth_m = tth.decimal

    const pt_b = getTimeByDHMSLarge(data?.user?.play_time, true);
    const pt_m = getTimeByDHMSSmall(data?.user?.play_time, true);

    const pc_d = data?.delta?.play_count || 0;
    const tth_d = data?.delta?.total_hits || 0;
    const pt_d = data?.delta?.play_time || 0;

    const pt_ds = (pt_d > 0) ? '+' + getTimeByDHMS(pt_d) : '';
    const pc_ds = (pt_d > 0) ? getText(pc_d) : '';
    const tth_ds = (pt_d > 0) ? getText(tth_d) : '';

    const label_pc = label_D4({
        ...LABELS.PC,
        data_b: pc_b,
        data_m: pc_m,
        delta: pc_ds,
        delta_color: getColor(pc_d),
        hide: hide
    });
    const label_tth = label_D4({
        ...LABELS.TTH,
        data_b: tth_b,
        data_m: tth_m,
        delta: tth_ds,
        delta_color: getColor(tth_d),
        hide: hide
    });
    const label_pt = label_D4({
        ...LABELS.PT,
        data_b: pt_b,
        data_m: pt_m,
        delta: pt_ds,
        delta_color: getColor(pt_d),
        hide: hide
    });

    const pc_body = getSvgBody(20, 50, label_pc)
    const tth_body = getSvgBody(20, 50 + 75, label_tth)
    const pt_body = getSvgBody(20, 50 + 150, label_pt)

    const join = poppinsBold.getTextPath('Join: ' +
        moment(data?.join, 'YYYY-MM-DD[T]HH:mm:ss[Z]').format('YYYY-MM-DD')
        + ' ['
        + getTimeDifference(data?.join)
        + ']',
        470, 27, 18, 'right baseline', '#fff')

    svg = setTexts(svg, [pc_body, tth_body, pt_body, join], reg)

    if (!hide) {
        const title = poppinsBold.getTextPath('Main Statistics', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 270, 20, PanelColor.middle(data.hue), 1)

        svg = setTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_D2 = (
    data = {
        scores: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OD2">
    </g>`

    const reg = /(?<=<g id="Component_OD2">)/;

    const d2s = data?.scores || []

    let string_d2s = ''

    for (let i = 0; i < d2s.length; i++) {
        const x = i % 3
        const y = Math.floor(i / 3)

        string_d2s += getSvgBody(10 + x * 160, 40 + y * 130, d2s[i])
    }

    svg = setText(svg, string_d2s, reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Bests', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 300, 20, PanelColor.middle(data.hue), 1)

        svg = setTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_D3 = (
    data = {
        user: [],
        sum: 1,
        delta: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OD3">
    </g>`

    const reg = /(?<=<g id="Component_OD3">)/;

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

        svg = setSvgBody(svg, x, 25, label, reg)

        // 底部颜色
        const l = (count * 460 / data?.sum)

        if (l > 0) {
            length += Math.max(l, 15)
            rrect_lengths.push(Math.min(length, 460))
        } else {
            rrect_lengths.push(0)
        }
    }

    const rrect_colors = ['#FAFAFA', '#FFFF00',
        '#BDBDBD', '#FF9800', '#22AC38']

    for (let i in rrect_lengths) {
        const w = rrect_lengths[i]
        const c = rrect_colors[i]

        svg = setText(svg, PanelDraw.Rect(15, 75, w, 15, 7.5, c, 1), reg)
    }

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Ranks', 15, 27 - 5, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 100, 20, PanelColor.middle(data.hue), 1)

        svg = setTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_D4 = (
    data = {
        mascot: '',
        is_png: false,
        hue: 342,
    }
) => {
    let svg = `<defs>
        <clipPath id="clippath-PD2-C4">
        </clipPath>
        </defs>
        <g id="Component_OD4_Base">
    </g>
        <g style="clip-path: url(#clippath-PD2-C4);">
    </g>`

    const clip = /(?<=<clipPath id="clippath-PD2-C4">)/;

    const reg = /(?<=<g style="clip-path: url\(#clippath-PD2-C4\);">)/;
    const reg_base = /(?<=<g id="Component_OD4_Base">)/;

    if (data.is_png === true) {
        svg = setText(svg, PanelDraw.Rect(0, 290, 1920, 790, 20, 'none', 1), clip)

        svg = setImage(svg, 0, 290, 1920, 790, data?.mascot || '', reg, 1, 'xMidYMin meet')
    } else {
        svg = setText(svg, PanelDraw.Rect(550, 330, 820, 710, 20, 'none', 1), clip)

        svg = setImage(svg, 550, 330, 820, 710, data?.mascot || '', reg, 1, 'xMidYMid slice')

        svg = setText(svg, PanelDraw.Rect(550, 330, 820, 710, 20, PanelColor.middle(data.hue), 1), reg_base)
    }

    return svg.toString()
}

const component_D5 = (
    data = {
        rank_time: [],
        rank_highest: {
            rank: null,
            updated_at: null
        },
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OD5">
    </g>`

    const reg = /(?<=<g id="Component_OD5">)/;

    const has_highest = (data?.rank_highest?.rank > 0)

    const arr = modifyArrayToFixedLength(data.rank_time, 90, true);

    const user_ranking_max = Math.max.apply(Math, arr);

    //处理rank数组，如果有0，补最大值
    let ranking_nonzero_arr = [];

    arr.forEach((v) => {
        if (v === 0) v = user_ranking_max;
        ranking_nonzero_arr.push(v);
    });

    const user_ranking_min = Math.min.apply(Math, ranking_nonzero_arr) || 0;

    const user_ranking_mid = (user_ranking_max + user_ranking_min) / 2;

    let difference = '0d'

    if (has_highest && isNotEmptyString(data?.rank_highest?.updated_at)) {
        difference = getTimeDifference(data.rank_highest.updated_at)
    } else {
        ranking_nonzero_arr.forEach((v, i) => {
            if (v === user_ranking_min) {
                difference = (0 - (90 - i)) + 'd'
            }
        })
    }

    const rank_axis_y_min = floor(user_ranking_min, 1, -1);
    const rank_axis_y_mid = floor(user_ranking_mid, 1, -1);
    const rank_axis_y_max = floor(user_ranking_max, 1, -1);

    // 绘制坐标，注意max在下面
    const rank_axis =
        poppinsBold.getTextPath(rank_axis_y_min, 15, 48, 14, 'left baseline', '#fc2') +
        poppinsBold.getTextPath(rank_axis_y_mid, 15, (48 + 154) / 2, 14, 'left baseline', '#fc2') +
        poppinsBold.getTextPath(rank_axis_y_max, 15, 154, 14, 'left baseline', '#fc2');

    const day_axis = poppinsBold.getTextPath('-90d', 35, 170, 14, 'left baseline', '#fc2')
        + poppinsBold.getTextPath('-45d', 257.5, 170, 14, 'center baseline', '#fc2')
        + poppinsBold.getTextPath('-0d', 480, 170, 14, 'right baseline', '#fc2');

    const rank_chart = PanelDraw.LineChart(ranking_nonzero_arr, user_ranking_min, user_ranking_max, 50, 155, 415, 115, '#fc2', 1, 0, 4, true); //这里min和max换位置

    const max = poppinsBold.getTextPath(
        'Max: #' + (has_highest ? data.rank_highest.rank : user_ranking_min)
        + ' [' + difference + ']',
        475, 27, 18, 'right baseline', '#fff', 1
    )

    svg = setTexts(svg, [max, rank_chart, rank_axis, day_axis], reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Rank History', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 180, 20, PanelColor.middle(data.hue), 1)

        svg = setTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_D6 = (
    data = {
        bp_time: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OD6">
    </g>`

    const reg = /(?<=<g id="Component_OD6">)/;

    const arr = modifyArrayToFixedLength(data.bp_time, 90);

    const best_max = Math.max.apply(Math, arr);
    const best_min = 0;

    let day = 0
    arr.forEach((v, i) => {
        if (v === best_max) {
            day = 90 - i
        }
    })

    const best_axis_y_max = floor(best_max, 1, -1);
    const best_axis_y_min = floor(best_min, 1, -1);

    // 绘制坐标
    const best_axis =
        poppinsBold.getTextPath(best_axis_y_max, 15, 45, 14, 'left baseline', '#CCE199') +
        poppinsBold.getTextPath(best_axis_y_min, 15, 74, 14, 'left baseline', '#CCE199');

    const day_axis = poppinsBold.getTextPath('-90d', 35, 90, 14, 'left baseline', '#CCE199')
        + poppinsBold.getTextPath('-45d', 257.5, 90, 14, 'center baseline', '#CCE199')
        + poppinsBold.getTextPath('-0d', 480, 90, 14, 'right baseline', '#CCE199');

    const best_chart = PanelDraw.LineChart(arr, best_max, 0, 50, 75, 415, 40, '#CCE199', 1, 0, 4, false);

    const max = poppinsBold.getTextPath(
        'Max: +' + (best_max || '0')
        + ' [' + (0 - day) + 'd]',
        475, 27 - 5, 18, 'right baseline', '#fff', 1
    )

    svg = setTexts(svg, [max, best_chart, best_axis, day_axis], reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Bests History', 15, 27 - 5, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 100, 20, PanelColor.middle(data.hue), 1)

        svg = setTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_D7 = (
    data = {
        pc_time: [],
        time: '',
        x_axis_1: '',
        x_axis_2: '',
        x_axis_3: '',
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OD7">
    </g>`

    const reg = /(?<=<g id="Component_OD7">)/;

    const arr = data?.pc_time || [];

    const pc_max = Math.max.apply(Math, arr);
    const pc_min = 0;

    const pc_axis_y_max = floor(pc_max, 1, -1);
    const pc_axis_y_min = floor(pc_min, 1, -1);

    // 绘制坐标
    const pc_axis =
        poppinsBold.getTextPath(pc_axis_y_max, 15, 45, 14, 'left baseline', '#8DCFF4') +
        poppinsBold.getTextPath(pc_axis_y_min, 15, 74, 14, 'left baseline', '#8DCFF4');

    const month_axis = poppinsBold.getTextPath(data?.x_axis_1, 35, 90, 14, 'left baseline', '#8DCFF4')
        + poppinsBold.getTextPath(data?.x_axis_2, 257.5, 90, 14, 'center baseline', '#8DCFF4')
        + poppinsBold.getTextPath(data?.x_axis_3, 480, 90, 14, 'right baseline', '#8DCFF4');

    const pc_chart = PanelDraw.LineChart(arr, pc_max, 0, 50, 75, 415, 40, '#8DCFF4', 1, 0, 4, false);

    const max = poppinsBold.getTextPath(
        'Max: ' + (pc_max || '0')
        + ' [' + data?.time + ']',
        475, 27 - 5, 18, 'right baseline', '#fff', 1
    )

    svg = setTexts(svg, [max, pc_chart, pc_axis, month_axis], reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Play History', 15, 27 - 5, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 100, 20, PanelColor.middle(data.hue), 1)

        svg = setTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_D8 = (
    data = {
        user: {
            ranked_score: 0,
            total_score: 0,

            medal: 0,
            played_map: 0,

            maximum_combo: 0,
            follower: 0,
        },

        delta: {
            ranked_score: 0,
            total_score: 0,
            maximum_combo: 0,
        },

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OD8">
    </g>`

    const reg = /(?<=<g id="Component_OD8">)/;

    const hide = data.has_custom_panel

    // 卡片定义
    const rks = floors(data.user.ranked_score, 1)
    const rks_b = rks.integer
    const rks_m = rks.decimal

    const tts = floors(data.user.total_score, 1)
    const tts_b = tts.integer
    const tts_m = tts.decimal

    const mpc = floors(data.user.played_map, -4)
    const mpc_b = mpc.integer
    const mpc_m = mpc.decimal

    const med = floors(data.user.medal, -4)
    const med_b = med.integer
    const med_m = med.decimal

    const mxc = floors(data.user.maximum_combo, -4)
    const mxc_b = mxc.integer
    const mxc_m = mxc.decimal

    const fan = floors(data.user.follower, -4)
    const fan_b = fan.integer
    const fan_m = fan.decimal

    const rks_d = data?.delta?.ranked_score || 0;
    const tts_d = data?.delta?.total_score || 0;
    const mxc_d = data?.delta?.maximum_combo || 0;

    const rks_ds = (rks_d > 0) ? getText(rks_d) : '';
    const tts_ds = (tts_d > 0) ? getText(tts_d) : '';
    const mxc_ds = (mxc_d > 0) ? getText(mxc_d) : '';

    const label_pc = label_D5({
        ...LABELS.RKS,
        data_b: rks_b,
        data_m: rks_m,
        delta: rks_ds,
        delta_color: getColor(rks_d),
        hide: hide
    });
    const label_tth = label_D5({
        ...LABELS.TTS,
        data_b: tts_b,
        data_m: tts_m,
        delta: tts_ds,
        delta_color: getColor(tts_d),
        hide: hide
    });
    const label_mpc = label_D5({
        ...LABELS.MPC,
        data_b: mpc_b,
        data_m: mpc_m,
        hide: hide
    });
    const label_med = label_D5({
        ...LABELS.MED,
        data_b: med_b,
        data_m: med_m,
        hide: hide
    });
    const label_mxc = label_D5({
        ...LABELS.MXC,
        data_b: mxc_b,
        data_m: mxc_m,
        delta: mxc_ds,
        delta_color: getColor(mxc_d),
        hide: hide
    });
    const label_fan = label_D5({
        ...LABELS.FAN,
        data_b: fan_b,
        data_m: fan_m,
        hide: hide
    });

    svg = setSvgBody(svg, 20, 50, label_pc, reg)
    svg = setSvgBody(svg, 250, 50, label_tth, reg)
    svg = setSvgBody(svg, 20, 50 + 75, label_mpc, reg)
    svg = setSvgBody(svg, 250, 50 + 75, label_med, reg)
    svg = setSvgBody(svg, 20, 50 + 150, label_mxc, reg)
    svg = setSvgBody(svg, 250, 50 + 150, label_fan, reg)

    if (!hide) {
        const title = poppinsBold.getTextPath('Secondary Statistics', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 270, 20, PanelColor.middle(data.hue), 1)

        svg = setTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

// 私有转换方式
const PanelDGenerate = {
    user2componentD1: (user, history_user, has_custom_panel = false, hue) => {
        const s = user.statistics
        const h = history_user?.statistics

        return {
            user: {
                play_count: s.play_count || 0,
                play_time: s.play_time || 0,
                total_hits: s.total_hits || 0,
            },

            delta: {
                play_count: getDelta(s.play_count, h?.play_count),
                play_time: getDelta(s.play_time, h?.play_time),
                total_hits: getDelta(s.total_hits, h?.total_hits),
            },

            join: user?.join_date,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    scores2componentD2: async (scores = [], has_custom_panel = false, hue) => {
        return {
            scores: await PanelGenerate.score2CardD2(scores),
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    user2componentD3: (user, history_user, has_custom_panel = false, hue) => {
        const s = user.statistics
        const h = history_user?.statistics

        return {
            user: [s.count_ssh, s.count_ss, s.count_sh, s.count_s, s.count_a],

            sum: Math.max(1, s.count_ssh + s.count_ss + s.count_sh + s.count_s + s.count_a),

            delta: [
                getDelta(s.count_ssh, h?.count_ssh),
                getDelta(s.count_ss, h?.count_ss),
                getDelta(s.count_sh, h?.count_sh),
                getDelta(s.count_s, h?.count_s),
                getDelta(s.count_a, h?.count_a)
            ],

            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    mascot2componentD4: (user = {}, mode = 'osu', has_custom_mascot = false, hue) => {
        let path

        if (has_custom_mascot === true) {
            path = user?.profile?.mascot

            if (isNotBlankString(path)) {
                return {
                    mascot: path,
                    is_png: isPicturePng(path)
                }
            }
        }

        path = getRandomMascotTransparentPath(getMascotName(mode))

        return {
            mascot: path,
            is_png: true,
            hue: hue,
        }
    },

    user2componentD5: (rank_time = [], rank_highest = {}, has_custom_panel = false, hue) => {
        return {
            rank_time: rank_time || [],
            rank_highest: rank_highest || {},
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    user2componentD6: (bp_time = [], has_custom_panel = false, hue) => {
        return {
            bp_time: bp_time || [],
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    user2componentD7: (monthly_pc = [
        {
            "start_date": "2018-10-01",
            "count": 61
        }], has_custom_panel = false, hue) => {

        const pc_time = monthly_pc.map(v => {
            return v.count
        })

        const max = Math.max.apply(Math, pc_time)

        let time = '0d'
        monthly_pc.forEach((v) => {
            if (v.count === max) {
                time = getTimeDifference(v?.start_date, "YYYY-MM-DD")
            }
        })

        if (isNotEmptyArray(monthly_pc)) {
            const earliest = moment(monthly_pc[0].start_date, 'YYYY-MM-DD')
            const latest = moment(monthly_pc[monthly_pc.length - 1].start_date, 'YYYY-MM-DD')

            // 这是个负数
            const period = Math.ceil(earliest.diff(latest, 'months') / 2)

            return {
                pc_time: pc_time || [],
                time: time,
                x_axis_1: earliest.format('YYYY-MM'),
                x_axis_2: moment(monthly_pc[monthly_pc.length - 1].start_date, 'YYYY-MM-DD')
                    .subtract(
                        Math.abs(period), 'months')
                    .format('YYYY-MM'),
                x_axis_3: latest.format('YYYY-MM'),

                has_custom_panel: has_custom_panel,
                hue: hue,
            }
        } else {
            return {
                pc_time: [],
                time: '0d',
                x_axis_1: moment().subtract(42, 'months').format('YYYY-MM'),
                x_axis_2: moment().subtract(21, 'months').format('YYYY-MM'),
                x_axis_3: moment().format('YYYY-MM'),

                has_custom_panel: has_custom_panel,
                hue: hue,
            }
        }
    },

    user2componentD8: (user, history_user, has_custom_panel = false, hue) => {
        const s = user.statistics
        const h = history_user?.statistics

        return {
            user: {
                ranked_score: s?.ranked_score || 0,
                total_score: s?.total_score || 0,

                medal: user?.user_achievements?.length || 0,
                played_map: user.beatmap_playcounts_count || 0,

                maximum_combo: s?.maximum_combo || 0,
                follower: user?.follower_count || 0,
            },

            delta: {
                ranked_score: getDelta(s.ranked_score, h?.ranked_score),
                total_score: getDelta(s.total_score, h?.total_score),
                maximum_combo: getDelta(s.maximum_combo, h?.maximum_combo),
            },

            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },
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