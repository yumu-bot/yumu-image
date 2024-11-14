import {
    exportJPEG,
    getPanelNameSVG,
    implantImage,
    implantSvgBody,
    replaceText,
    replaceTexts,
    getRoundedNumberStr,
    putCustomBanner,
    getDiffBG,
    getImageFromV3,
    modifyArrayToFixedLength, getTime, isNotNull, isEmptyArray
} from "../util/util.js";
import {poppinsBold} from "../util/font.js";
import {card_A1} from "../card/card_A1.js";
import {label_J4, label_J5, label_J6, label_J7, LABELS} from "../component/label.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getModColor, getRankColor, getStarRatingColor, PanelColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {pp2UserBG} from "../util/mascotBanner.js";
import {card_D2} from "../card/card_D2.js";
import {getModFullName} from "../util/mod.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_J2(data);
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
        const svg = await panel_J2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 分析最好成绩
 * !ba
 * @param data
 * @return {Promise<string>}
 */
export async function panel_J2(data = {
    user: {},
    bests: [{}],

    favorite_mappers: [
        {
            avatar_url: "https://a.ppy.sh/17064371?1675693670.jpeg",
            username: "-Spring Night-",
            map_count: 50,
            pp_count: 16247,
        },
    ],

    // 右上角的 BP 分布折线图
    // 给加权前的 pp
    pp_raw_arr: [240, 239, 238, 236, 234, 240, 221, 204, 200, 190, 190, 189, 187, 174, 166, 164],

    //给 bp 在一天中的小时，分钟除以60加上来
    time_arr: [0.4, 2.5, 23.8],

    // 8 个时间段的计数
    time_dist_arr: [0, 0, 0, 0, 0, 0, 0, 0],

    rank_arr: ['A', 'SS', 'SS', 'B'], //给评级的统计数据。

    length_arr: [24, 59, 81, 75], //长度的统计数据
    mods_arr: [["HD"], ["HR", "HD"]],
    star_arr: [0, 0],

    mods_attr: [
        {
            index: "HD",
            map_count: 50,
            pp_count: 4396,
            percent: 0.26,
        },
        {
            index: "DT",
            map_count: 12,
            pp_count: 17,
            percent: 0.74,
        }
    ],

    //第一个给Perfect数量（真FC），第二个给FC数量（包括真假FC），第三个之后到第八个都给评级数量。越牛逼的越靠上
    rank_attr: [
        {
            index: "FC",
            map_count: 50,
            pp_count: 16247,
            percent: 0.5,
        },
        {
            index: "SS",
            map_count: 50,
            pp_count: 16247,
            percent: 0.4,
        },
        {
            index: "SH",
            map_count: 50,
            pp_count: 16247,
            percent: 0.1,
        },
    ],

    client_count: [93, 7], //版本成绩数量，第一个是 stable，第二个是 lazer

    bpm_attr: [
        {
            length: 719,
            combo: 719,
            ranking: 1,
            cover: "https://assets.ppy.sh/beatmaps/382400/covers/list.jpg?1622096843",
            star: 6.38,
            rank: "A", // bp.rank
            bpm: 111,
            mods: ['HR']
        },
    ],
    length_attr: [],
    combo_attr: [],
    star_attr: [],

}) {
    // 自设定义
    const has_custom_panel = false;

    const user = data?.user
    const bests = data?.bests

    const hue = user?.profile_hue || 342

    const favorite_mappers = data?.favorite_mappers
    const pp_raw_arr = data?.pp_raw_arr || []
    const time_arr = data?.time_arr || []
    const time_dist_arr = data?.time_dist_arr || []
    const rank_arr = data?.rank_arr || []
    const length_arr = data?.length_arr || []
    const star_arr = data?.star_arr || []
    const mods_arr = data?.mods_arr || []

    const client_count = data?.client_count || []

    const mods_attr = data?.mods_attr || []
    const rank_attr = data?.rank_attr || []
    const bpm_attr = data?.bpm_attr || []
    const length_attr = data?.length_attr || []
    const combo_attr = data?.combo_attr || []
    const star_attr = data?.star_attr || []
    
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PJ2-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PJ2-BG">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PJ2-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PJ2-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PJ2-BG)" style="clip-path: url(#clippath-PJ2-BG);">
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
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PJ2-1\);">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/
    const reg_background = /(?<=<g filter="url\(#blur-PJ2-BG\)" style="clip-path: url\(#clippath-PJ2-BG\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('BP Analysis v3 (!ymba)', 'BA', 'v0.5.0 DX');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 卡片定义
    const cardA1 = await card_A1(
        await PanelGenerate.user2CardA1(user)
    );
    const componentJ1 = component_J1(PanelJGenerate.attr2componentJ1(bpm_attr, length_attr, combo_attr, star_attr, client_count, has_custom_panel, hue));
    const componentJ2 = component_J2(await PanelJGenerate.scores2componentJ2(bests, has_custom_panel, hue));
    const componentJ3 = component_J3(PanelJGenerate.rank2componentJ3(rank_attr, has_custom_panel, hue));
    const componentJ4 = component_J4(PanelJGenerate.mods2componentJ4(mods_attr, user.pp, pp_raw_arr?.length || 0, has_custom_panel, hue));
    const componentJ5 = component_J5(PanelJGenerate.distribution2componentJ5(rank_arr, mods_arr, star_arr, length_arr, has_custom_panel, hue));
    const componentJ6 = component_J6(PanelJGenerate.pp2componentJ6(pp_raw_arr, has_custom_panel, hue));
    const componentJ7 = component_J7(PanelJGenerate.times2componentJ7(time_arr, time_dist_arr, pp_raw_arr, rank_arr, has_custom_panel, hue));
    const componentJ8 = await component_J8(PanelJGenerate.mappers2componentJ8(favorite_mappers, has_custom_panel, hue));

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = implantSvgBody(svg, 40, 330, componentJ1, reg_component);
    svg = implantSvgBody(svg, 40, 740, componentJ2, reg_component);
    svg = implantSvgBody(svg, 550, 330, componentJ3, reg_component);
    svg = implantSvgBody(svg, 970, 330, componentJ4, reg_component);
    svg = implantSvgBody(svg, 550, 740, componentJ5, reg_component);
    svg = implantSvgBody(svg, 1390, 330, componentJ6, reg_component);
    svg = implantSvgBody(svg, 1390, 530, componentJ7, reg_component);
    svg = implantSvgBody(svg, 1390, 740, componentJ8, reg_component);

    // 插入图片和部件
    const background = pp2UserBG(user.pp || 0);
    svg = putCustomBanner(svg, reg_banner, user?.profile?.banner);
    svg = implantImage(svg, 1920, 1080, 0, 280, 0.6, background, reg_background);


    return svg.toString()
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_J1 = (
    data = {
        labels: [],
        counts: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ1">
    </g>`

    const reg = /(?<=<g id="Component_OJ1">)/;

    const hide = data.has_custom_panel

    for (const i in data.labels) {
        const v = data.labels[i]

        svg = implantSvgBody(svg, 20, 45 + (i * 80), v, reg)
    }

    const count_base = PanelDraw.Rect(20, 368, 450, 10, 5, PanelColor.top(data.hue))

    const count_stable = PanelDraw.Rect(20, 368, Math.min(Math.max(450 * ((data.counts[0]) || 0) / 100, 10), 450), 10, 5, '#006899')

    const count_lazer = PanelDraw.Rect(20, 368, Math.min(Math.max(450 * ((data.counts[0] + data.counts[1]) || 0) / 100, 10), 450), 10, 5, '#854317')

    svg = replaceTexts(svg, [count_stable, count_lazer, count_base], reg)

    if (!hide) {
        const title = poppinsBold.getTextPath('Main Statistics', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 390, 20, PanelColor.middle(data.hue), 1)

        svg = replaceTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_J2 = (
    data = {
        scores: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ2">
    </g>`

    const reg = /(?<=<g id="Component_OJ2">)/;

    const d2s = data?.scores || []

    for (let i = 0; i < d2s.length; i++) {
        const x = i % 3
        const y = Math.floor(i / 3)

        svg = implantSvgBody(svg, 10 + x * 160, 40 + y * 130, d2s[i], reg)
    }

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Bests', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 300, 20, PanelColor.middle(data.hue), 1)

        svg = replaceTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_J3 = (
    data = {
        rank_attr: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ3">
    </g>`

    const reg = /(?<=<g id="Component_OJ3">)/;

    const rank = data?.rank_attr || []

    // 绘制标签
    let max_width
    let x_count

    if (rank.length <= 2) {
        max_width = 380
        x_count = 1
    } else if (rank.length <= 4) {
        max_width = 185
        x_count = 2
    } else {
        max_width = 120
        x_count = 3
    }

    for (let i = 0; i < Math.min(rank.length, 6); i++) {
        const v = rank[i]
        /*{
            index: "FC",
            map_count: 50,
            pp_count: 16247,
            percent: 0.5,
        }
        */
        const x = i % x_count
        const y = Math.floor(i / x_count)

        const label = label_J4({
            icon_title: v?.index || '?',
            abbr: v?.index || '?',
            remark: Math.round(v?.pp_count || 0) + ' PP',
            data_b: (v?.map_count || 0).toString().padStart(3, '0'),

            bar_progress: (v?.percent || 0),
            bar_color: getRankColor(v?.index),
            max_width: max_width,
            hide: data.has_custom_panel,
            hue: data.hue,
        })

        svg = implantSvgBody(svg, 10 + x * (max_width + 10), 250 + y * 70, label, reg)
    }

    // 插入饼图
    let rank_svg = '';
    rank.reduce((prev, curr) => {
        if (curr.index === 'FC') return 0; //排去FC

        const curr_percent = prev + curr.percent;
        const color = getRankColor(curr.index);

        rank_svg += PanelDraw.Pie(200, 136, 95, curr_percent, prev, color);

        return curr_percent;
    }, 0);

    rank_svg += PanelDraw.Image(200 - 95, 136 - 95, 190, 190, getImageFromV3('object-piechart-overlay2.png'), 1);

    svg = replaceText(svg, rank_svg, reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Ranks', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 400, 390, 20, PanelColor.middle(data.hue), 1)

        svg = replaceTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_J4 = (
    data = {
        mods_attr: [],
        user_pp: 0,
        bests_size: 0,
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ4">
    </g>`

    const reg = /(?<=<g id="Component_OJ4">)/;

    const mods = data?.mods_attr || []

    // 绘制标签
    let max_width
    let x_count

    if (mods.length <= 2) {
        max_width = 380
        x_count = 1
    } else if (mods.length <= 4) {
        max_width = 185
        x_count = 2
    } else {
        max_width = 120
        x_count = 3
    }

    // 全是 no mod 的玩家只能这样处理
    if (isEmptyArray(mods)) {
        const label = label_J4({
            icon_title: 'No Mod',
            abbr: 'NM',
            remark: Math.round(data?.user_pp || 0) + ' PP',
            data_b: (data?.bests_size || 0).toString().padStart(3, '0'),

            bar_progress: (data?.bests_size || 0) / 100,
            bar_color: '#DADADA',
            max_width: max_width,
            hide: data.has_custom_panel,
            hue: data.hue,
        })

        svg = implantSvgBody(svg, 10, 250, label, reg)
    }

    for (let i = 0; i < Math.min(mods.length, 6); i++) {
        const v = mods[i]
        /*{
            index: "HD",
            map_count: 50,
            pp_count: 4396,
            percent: 0.26,
        }
        */
        const x = i % x_count
        const y = Math.floor(i / x_count)

        const label = label_J4({
            icon_title: getModFullName(v?.index || '?'),
            abbr: v?.index || '?',
            remark: Math.round(v?.pp_count || 0) + ' PP',
            data_b: (v?.map_count || 0).toString().padStart(3, '0'),

            bar_progress: (v?.percent || 0),
            bar_color: getModColor(v?.index),
            max_width: max_width,
            hide: data.has_custom_panel,
            hue: data.hue,
        })

        svg = implantSvgBody(svg, 10 + x * (max_width + 10), 250 + y * 70, label, reg)
    }

    // 插入饼图
    let mod_svg = '';

    // 这里是给 no mod 的饼
    mod_svg += PanelDraw.Pie(200, 136, 95, 0, data.bests_size / 100, '#DADADA');

    mods.reduce((prev, curr) => {
        const curr_percent = prev + curr.percent;
        const color = getModColor(curr.index);

        mod_svg += PanelDraw.Pie(200, 136, 95, curr_percent, prev, color);

        return curr_percent;
    }, 0);

    mod_svg += PanelDraw.Image(200 - 95, 136 - 95, 190, 190, getImageFromV3('object-piechart-overlay2.png'), 1);

    svg = replaceText(svg, mod_svg, reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Mods', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 400, 390, 20, PanelColor.middle(data.hue), 1)

        svg = replaceTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_J5 = (
    data = {
        rank_arr: [],
        mods_arr: [],
        star_arr: [],
        length_arr: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ5">
    </g>`

    const reg = /(?<=<g id="Component_OJ5">)/;

    const mods = data?.mods_arr || [['']]
    const rank = data?.rank_arr || []
    const star = data?.star_arr || []
    const length = data?.length_arr || []

    const graph1_colors = []
    const graph2_colors = []

    for (const i in rank) {
        const r = rank[i] || ''
        graph1_colors.push(getRankColor(r))
    }
    const rank_svg = PanelDraw.BarChart(star, 0, 0, 11, 150, 798, 110, 3, 2, graph1_colors, 5, 6, null, 1)

    for (const i in mods) {
        const m = mods[i][0] || ''
        let color = getModColor(m)

        // no mod 没有颜色，这里赋灰色
        if (color === 'none') color = '#DADADA'

        graph2_colors.push(color)
    }

    const mods_svg = PanelDraw.BarChart(length, 0, 0, 11, 180, 798, 110, 3, 2, graph2_colors, 60, 6, null, 1, true)

    const b1 = poppinsBold.getTextPath('#1', 10, 170, 14, 'left baseline')
    const b50 = poppinsBold.getTextPath('#50', 410, 170, 14, 'center baseline')
    const b100 = poppinsBold.getTextPath('#100', 810, 170, 14, 'right baseline')

    svg = replaceTexts(svg, [rank_svg, mods_svg, b1, b50, b100], reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Bests Distribution', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 820, 300, 20, PanelColor.middle(data.hue), 1)

        const title_graph1 = poppinsBold.getTextPath('Ranks / SR', 805, 22, 12, 'right baseline', '#fff', 1)

        const title_graph2 = poppinsBold.getTextPath('Mods / Length', 804, 288, 12, 'right baseline', '#fff', 1)

        svg = replaceTexts(svg, [title, title_graph1, title_graph2, rrect], reg)
    }

    return svg.toString()
}

const component_J6 = (
    data = {
        pp_raw_arr: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ6">
    </g>`

    const reg = /(?<=<g id="Component_OJ6">)/;

    const arr = modifyArrayToFixedLength(data.pp_raw_arr, 100, false);

    const pp_max = Math.max.apply(Math, arr);
    const pp_min = Math.min.apply(Math, arr);
    const pp_average = Math.round(
        arr.reduce((prev, curr) => {
            return prev + curr
        }) / arr.length) || 0

    const y_max = getRoundedNumberStr(pp_max, 1);
    const y_mid = getRoundedNumberStr((pp_max + pp_min) / 2, 1);
    const y_min = getRoundedNumberStr(pp_min, 1);

    // 绘制坐标
    const pp_axis =
        poppinsBold.getTextPath(y_max, 15, 48, 14, 'left baseline', '#fff') +
        poppinsBold.getTextPath(y_mid, 15, (48 + 154) / 2, 14, 'left baseline', '#fff') +
        poppinsBold.getTextPath(y_min, 15, 154, 14, 'left baseline', '#fff');

    const position_axis = poppinsBold.getTextPath('#1', 35, 170, 14, 'left baseline', '#fff')
        + poppinsBold.getTextPath('#50', 257.5, 170, 14, 'center baseline', '#fff')
        + poppinsBold.getTextPath('#100', 480, 170, 14, 'right baseline', '#fff');

    const rank_chart = PanelDraw.LineChart(arr, 0, 0, 50, 155, 415, 115, '#fc2', 1, 0, 4, false);

    const average = poppinsBold.getTextPath(
        'Average: ' + (pp_average || '0')
        + ' PP',
        475, 27, 18, 'right baseline', '#fff', 1
    )

    svg = replaceTexts(svg, [average, rank_chart, pp_axis, position_axis], reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('PP', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 180, 20, PanelColor.middle(data.hue), 1)

        svg = replaceTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_J7 = (
    data = {
        time_arr: [],
        time_dist_arr: [],
        pp_raw_arr: [],
        rank_arr: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ7">
    </g>`

    const reg = /(?<=<g id="Component_OJ7">)/;

    const times = data?.time_arr || []
    const dist = data?.time_dist_arr || []
    const pp = data?.pp_raw_arr || []
    const rank = data?.rank_arr || []

    const dist_chart = PanelDraw.BarChart(dist, 0, 0, 15, 40 + 120, 460, 120, 4, 4, [
        '#0075A9', '#00736D', '#007130', '#0D7D25',
        '#648C0C', '#B7AB00', '#AD6B00', '#A84200'
    ], 0, 2)

    const colors = rank.map((v) => {return getRankColor(v)})

    const times_chart = PanelDraw.Scatter(15, 40, 460, 120, 4, 0.9, times, pp, colors, 0, 24, Math.min.apply(Math, pp), Math.max.apply(Math, pp))

    let hour_text = ''
    for (let i = 0; i < 9; i++) {
        const hour = (i * 3).toString()
        hour_text += poppinsBold.getTextPath(hour, 15 - 2 + i * (460 / 8), 180, 14, 'center baseline')
    }

    let hour_max_count = 0
    let hour_max_index = 0
    for (let i = 0; i < 9; i++) {
        const count = dist[i]

        if (count >= hour_max_count) {
            hour_max_count = count
            hour_max_index = i
        }
    }

    const hour_max_text = poppinsBold.getTextPath(
        'Max: ' + hour_max_count + 'x ['
        + (hour_max_index * 3) + '-'
        + ((hour_max_index + 1) * 3) + ']'
        , 475, 27, 18, 'right baseline')

    svg = replaceTexts(svg, [times_chart, dist_chart, hour_text, hour_max_text], reg)

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Time Distribution', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 190, 20, PanelColor.middle(data.hue), 1)

        svg = replaceTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

const component_J8 = async (
    data = {
        favorite_mappers: [],
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ8">
    </g>`

    const reg = /(?<=<g id="Component_OJ8">)/;

    const mappers = data?.favorite_mappers || []

    const most_favorite = mappers[0]

    if (isNotNull(most_favorite)) {
        // J6 单人版
        const label = await label_J7({
            ...most_favorite,
            index: 1
        }, data.hue)
        svg = replaceText(svg, label, reg)
    }

    for (let i = 1; i < Math.min(mappers.length, 7); i++) {
        const x = (i - 1) % 2
        const y = Math.floor((i - 1) / 2)

        const label = await label_J6({
            ...mappers[i],
            index: i + 1,
        }, data.hue)

        svg = implantSvgBody(svg, 10 + x * 235, 105 + y * 65, label, reg)
    }

    if (!data.has_custom_panel) {
        const title = poppinsBold.getTextPath('Favorite Mappers', 15, 27, 18, 'left baseline', '#fff', 1)
        const rrect = PanelDraw.Rect(0, 0, 490, 300, 20, PanelColor.middle(data.hue), 1)

        svg = replaceTexts(svg, [title, rrect], reg)
    }

    return svg.toString()
}

// 私有转换方式
const PanelJGenerate = {
    attr2componentJ1: (bpm_attr, length_attr, combo_attr, star_attr, client_count, has_custom_panel = false, hue) => {
        const attr2labelJ5 = (attr = [
            {
                length: 719,
                combo: 719,
                ranking: 1,
                cover: "https://assets.ppy.sh/beatmaps/382400/covers/list.jpg?1622096843",
                star: 6.38,
                rank: "A",
                bpm: 111,
                mods: ['HR']
            },
        ], type = 'bpm', has_custom_panel = false) => {
            const max_attr = attr[0]
            const min_attr = attr[2]

            let label_const, max, min, data_b, data_m, bar_min, bar_mid, bar_max

            let bar_min_text = null, bar_mid_text = null, bar_max_text = null

            switch (type) {
                case 'bpm': {
                    label_const = LABELS.BPM
                    min = min_attr?.bpm || 0
                    max = max_attr?.bpm || 0
                    data_b = min
                    data_m = max
                    bar_min = 60
                    bar_mid = 180
                    bar_max = 300
                } break;
                case 'length': {
                    label_const = LABELS.LENGTH
                    min = min_attr?.length || 0
                    max = max_attr?.length || 0
                    data_b = getTime(min)
                    data_m = getTime(max)
                    bar_min = 30
                    bar_mid = 300
                    bar_max = 530
                    bar_min_text = '0:30'
                    bar_mid_text = '5:00'
                    bar_max_text = '9:30'
                } break;
                case 'combo': {
                    label_const = LABELS.COMBO
                    min = min_attr?.combo || 0
                    max = max_attr?.combo || 0
                    data_b = min
                    data_m = max
                    bar_min = 0
                    bar_mid = 1500
                    bar_max = 3000
                } break;
                case 'star': {
                    label_const = LABELS.SR
                    min = min_attr?.star || 0
                    max = max_attr?.star || 0
                    data_b = getRoundedNumberStr(min, 3)
                    data_m = getRoundedNumberStr(max, 3)
                    bar_min = 0
                    bar_mid = 4.5
                    bar_max = 9
                } break;
                default: {
                    label_const = LABELS.UNDEFINED
                    max = 0
                    min = 0
                    data_b = '0'
                    data_m = ''
                    bar_min = 0
                    bar_mid = 0
                    bar_max = 0
                } break;
            }

            const hide = has_custom_panel === true
            const remark = `#${min_attr?.ranking || '?'} - #${max_attr?.ranking || '?'}`

            return label_J5({
                ...label_const,
                remark: remark,
                data_b: data_b + ' - ',
                data_m: data_m,
                data_b_size: 24,
                data_m_size: 36,
                bar_min: bar_min,
                bar_mid: bar_mid,
                bar_max: bar_max,
                bar_min_text: bar_min_text,
                bar_mid_text: bar_mid_text,
                bar_max_text: bar_max_text,
                min: min,
                max: max,
                hide: hide,
                },
            )
        }

        const labels = [
            attr2labelJ5(bpm_attr, 'bpm', has_custom_panel),
            attr2labelJ5(length_attr, 'length', has_custom_panel),
            attr2labelJ5(combo_attr, 'combo', has_custom_panel),
            attr2labelJ5(star_attr, 'star', has_custom_panel)
        ]

        return {
            labels: labels,
            counts: client_count || [0, 0],

            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    scores2componentJ2: async (scores = [], has_custom_panel = false, hue) => {
        let d2s = []

        for (const s of scores) {
            const star = s?.beatmap?.difficulty_rating || 0
            const star_rrect_color = getStarRatingColor(star)
            const star_text_color = (star < 4) ? '#000' : '#fff'

            const rank = s?.legacy_rank || 'F'
            const rank_rrect_color = getRankColor(rank)
            const rank_text_color = (rank === 'X' || rank === 'XH') ? '#000' : '#fff';

            const data = {
                background: await getDiffBG(s.beatmap_id, s.beatmap.beatmapset_id,
                    'list', s.ranked, false),
                title: Math.round(s?.pp).toString() || '0',
                title_m: 'PP',

                left: getRoundedNumberStr(star, 3),
                left_color: star_text_color,
                left_rrect_color: star_rrect_color,

                right: rank,
                right_color: rank_text_color,
                right_rrect_color: rank_rrect_color,

                bottom_left: s?.beatmap_id.toString() || '0',
                bottom_right: getTime(s?.beatmap?.total_length),
            }

            d2s.push(await card_D2(data))
        }

        return {
            scores: d2s,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    rank2componentJ3: (rank_attr, has_custom_panel = false, hue) => {
        return {
            rank_attr: rank_attr,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    mods2componentJ4: (mods_attr, user_pp, bests_size, has_custom_panel = false, hue) => {
        return {
            mods_attr: mods_attr,
            user_pp: user_pp,
            bests_size: bests_size,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    distribution2componentJ5: (rank_arr, mods_arr, star_arr, length_arr, has_custom_panel = false, hue) => {
        return {
            rank_arr: rank_arr,
            mods_arr: mods_arr,
            star_arr: star_arr,
            length_arr: length_arr,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    pp2componentJ6: (pp_raw_arr, has_custom_panel = false, hue) => {
        return {
            pp_raw_arr: pp_raw_arr,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    times2componentJ7: (time_arr, time_dist_arr, pp_raw_arr, rank_arr, has_custom_panel = false, hue) => {
        return {
            time_arr: time_arr,
            time_dist_arr: time_dist_arr,
            pp_raw_arr: pp_raw_arr,
            rank_arr: rank_arr,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    mappers2componentJ8: (favorite_mappers, has_custom_panel = false, hue) => {
        return {
            favorite_mappers: favorite_mappers,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },
}