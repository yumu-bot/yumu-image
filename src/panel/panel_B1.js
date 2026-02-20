import {
    exportJPEG,
    getImageFromV3,
    getGameMode, getPanelNameSVG,
    setImage,
    setSvgBody, readTemplate,
    setText, setTexts, getNowTimeStamp, getSvgBody
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {LABEL_PPM6} from "../component/label.js";
import {getRankColors} from "../util/color.js";
import {getRankFromValue} from "../util/star.js";
import {card_B6} from "../card/card_B6.js";
import {card_B7} from "../card/card_B7.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B1(data);
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
        const svg = await panel_B1(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

const VALUE_NAMES = ['ACC', 'PTT', 'STA', 'STB', 'PRE', 'EFT', 'STH'] // OVA 跟 SAN 单独处理

// ppm 面板
export async function panel_B1(data = {
    // A1卡
    users: [{
        background: getImageFromV3('card-default.png'),
        avatar: getImageFromV3('avatar-guest.png'),
        sub_icon1: null,
        sub_icon2: 2,
        name: 'Muziyami',
        rank_global: 28075,
        rank_country: 577,
        country: 'CN',
        acc: 95.27,
        level: 100,
        progress: 32,
        pp: 4396,
    }, {}],

    my: {
        ACC: 1.1195, // 0-1
        PTT: 0.85,
        STA: 0.76,
        STB: 0.543,
        EFT: 0.645,
        STH: 0.984,
        OVA: 99.4, // 0-100
        SAN: 125.45, // 0-100
    },

    my_oii: 0.0,

    others: {
        ACC: 0.64, // 0-1
        PTT: 0.8743,
        STA: 0.7658,
        STB: 0.353,
        EFT: 0.995,
        STH: 1.004,
        OVA: 74.6, // 0-100
        SAN: 5.45, // 0-100
    },

    count: 0,

    delta: 0,

    //其他统计数据
    stat: {
        is_vs: false, //是PPMVS吗？不是则false
        mode_int: 0, // 这里改用mode_int
    }

}) {
    let svg = readTemplate('template/Panel_B.svg');

    const is_pm4 = data?.panel === 'PM4'

    const BOUNDARY = [is_pm4 ? 100.8 : 120, 100, 95, 90, 80, 70, 60, 10];
    const SANITY_BOUNDARY = [is_pm4 ? 100.8 : 120, 100, 95, 90, 80, 70, 60, 0];
    const SANITY_RANKS = ['?', '++', '+', '-', '--', '!?', '!', '!!', 'X'];
    const OII_BOUNDARY = [0, 0.5, 1, 1.5, 2, 3, 4, 5].toReversed();
    // const OII_RANKS = ['?', '++', '+', '-', '--', '!?', '!', '!!', 'X'].toReversed();

    const VALUE_NORMAL = ['ACC', 'PTT', 'STA', 'STB', 'EFT', 'STH'];
    const VALUE_MANIA = ['ACC', 'PTT', 'STA', 'PRE', 'EFT', 'STH'];

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    // 条件定义
    const is_vs = data.stat.is_vs;
    const mode = getGameMode(data.stat.mode_int, 0);

    const game_mode_path = torus.getTextPath(mode, 960, 614, 60, 'center baseline', '#fff');

    // 画六个标识
    svg = setText(svg, PanelDraw.HexagonIndex((mode === 'mania') ? VALUE_MANIA : VALUE_NORMAL), reg_hexagon);

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    // 面板文字
    let panel_name

    if (is_pm4) {
        const request_time = 'data count: ' + (data.count || 0) + 'x // range: +-' + (data.delta || 0) + 'PP // request time: ' + getNowTimeStamp();

        panel_name = getPanelNameSVG('PP Minus v4.5 (!ympm/!ympv)', 'PM', request_time);
    } else {
        panel_name = getPanelNameSVG('PP Minus v2.4 Legacy (!ympl)', 'PL');
    }

    // 插入文字
    svg = setTexts(svg, [panel_name, game_mode_path], reg_index);

    // 主计算
    let card_B1_lefts = [];
    let card_B1_rights = [];
    let card_B7_centers = [];

    let number_left = [];
    let number_right = [];
    let scale_left = 1;
    let scale_right = 1;

    if (is_vs) {
        let mePP = data.users[0].pp || 0;
        let otherPP = data.users[1].pp || 0;
        const smoothing = 0.6; // 调节这个值，越小越接近1

        if (mePP >= otherPP && mePP > 0) {
            scale_right = Math.pow(otherPP / mePP, smoothing);
        } else if (otherPP > 0) {
            scale_left = Math.pow(mePP / otherPP, smoothing);
        }
    }

    // 获取卡片
    for (const abbr of VALUE_NAMES) {
        if (typeof data?.my[abbr] !== 'number') continue;

        const value = (data?.my[abbr] ?? 0) * 100;
        const rank = getRankFromValue(value, BOUNDARY)
        const icon_colors = getRankColors(rank)

        card_B1_lefts.push(card_B6({
            ...LABEL_PPM6[abbr],

            value: value,
            icon_colors: icon_colors,
            round_level: 1,
            max: (is_pm4) ? 101 : 120,
        }, false));

        number_left.push(Math.min(Math.max((data.my[abbr] * scale_left - 0.6), 0.01) / 4 * 10, 1));
    }
    svg = setText(svg, PanelDraw.HexagonChart(number_left, 960, 600, 230, '#00A8EC'), reg_hexagon);

    let string_b1s = ''

    for (let j = 0; j < 6; j++) {
        string_b1s += getSvgBody(40, 340 + j * 115, card_B1_lefts[j]);
    }

    svg = setText(svg, string_b1s, reg_left)

    // 我自己的卡片
    const cardA1m = await card_A1(await PanelGenerate.user2CardA1(data.users[0]));
    svg = setSvgBody(svg, 40, 40, cardA1m, reg_maincard);

    // 如果是vs，渲染右边的人
    if (is_vs) {
        const cardA1o = await card_A1(await PanelGenerate.user2CardA1(data.users[1]));
        svg = setSvgBody(svg, 1450, 40, cardA1o, reg_maincard);

        for (const abbr of VALUE_NAMES) {
            if (typeof data.others[abbr] !== 'number') continue;

            const value = (data?.others[abbr] || 0) * 100;
            const rank = getRankFromValue(value, BOUNDARY)
            const icon_colors = getRankColors(rank)

            card_B1_rights.push(card_B6({
                ...LABEL_PPM6[abbr],

                value: value,
                icon_colors: icon_colors,
                round_level: 1,
                max: (is_pm4) ? 101 : 120,
            }, true));

            number_right.push(Math.min(Math.max((data.others[abbr] * scale_right - 0.6), 0.01) / 4 * 10, 1));
        }

        svg = setText(svg, PanelDraw.HexagonChart(number_right, 960, 600, 230, '#FF0000'), reg_hexagon);


        let string_b1v = ''

        for (let j = 0; j < 6; j++) {
            string_b1v += getSvgBody(1350, 340 + j * 115, card_B1_rights[j]);
        }

        svg = setText(svg, string_b1v, reg_right)
        
        const value_1 = (data?.my.OVA || 0) * 100;
        const rank_1 = getRankFromValue(value_1, BOUNDARY);
        const icon_colors_1 = getRankColors(rank_1);

        card_B7_centers.push(card_B7({
            ...LABEL_PPM6.OVA,

            value: value_1,
            icon_colors: icon_colors_1,
            round_level: 1,
            max: (is_pm4) ? 101 : 120,
        }));

        const value_2 = (data?.others.OVA || 0) * 100;
        const rank_2 = getRankFromValue(value_2, BOUNDARY);
        const icon_colors_2 = getRankColors(rank_2);

        card_B7_centers.push(card_B7({
            ...LABEL_PPM6.OVA,

            value: value_2,
            icon_colors: icon_colors_2,
            round_level: 1,
            max: (is_pm4) ? 101 : 120,
        }, true));

    } else {
        const value_1 = (data?.my.OVA || 0) * 100;
        const rank_1 = getRankFromValue(value_1, BOUNDARY);
        const icon_colors_1 = getRankColors(rank_1);

        card_B7_centers.push(card_B7({
            ...LABEL_PPM6.OVA,

            value: value_1,
            icon_colors: icon_colors_1,
            round_level: 1,
            max: (is_pm4) ? 101 : 120,
        }));

        if (is_pm4) {
            const oii = (data?.my_oii || 0);
            const oii_rank = getRankFromValue(oii, OII_BOUNDARY); // 用于颜色判断的 rank
            const oii_colors = getRankColors(oii_rank);
            // const oii_real_rank = getRankFromValue(oii, OII_BOUNDARY, OII_RANKS); // SAN 指示器

            card_B7_centers.push(card_B7({
                ...LABEL_PPM6.OII,

                value: oii,
                // data_b: oii_real_rank,
                // data_m: '',
                round_level: 1,
                icon_colors: oii_colors,
            }, true));
        } else {
            // 兼容 PPM2
            const san_value = (data?.my.SAN || 0) * 100;
            const san_rank = getRankFromValue(san_value, SANITY_BOUNDARY); // 用于颜色判断的 rank
            const san_colors = getRankColors(san_rank);
            const san_truly_rank = getRankFromValue(san_value, SANITY_BOUNDARY, SANITY_RANKS); // SAN 指示器

            card_B7_centers.push(card_B7({
                ...LABEL_PPM6.SAN,


                value: san_value,
                data_b: san_truly_rank,
                data_m: '',
                round_level: 0,
                icon_colors: san_colors,
            }, true));
        }

    }

    svg = setSvgBody(svg, 630, 890, card_B7_centers[0], reg_center);
    svg = setSvgBody(svg, 970, 890, card_B7_centers[1], reg_center);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = setImage(svg, 718, 384, 484, 433, hexagon, reg_hexagon, 1);

    return svg;
}