import {
    exportJPEG, getFormattedTime, getImageFromV3, getNowTimeStamp,
    getPanelNameSVG,
    getSvgBody, getTimeDifference,
    readTemplate,
    setImage, setSvgBody,
    setText,
    setTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {getRankFromValue} from "../util/star.js";
import {colorArray, getRankColors} from "../util/color.js";
import {card_B6} from "../card/card_B6.js";
import {LABEL_ETX} from "../component/label.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_B7} from "../card/card_B7.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B4(data);
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
        const svg = await panel_B4(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_B4(data = {
    me: {},

    my: {
        star: 5.17715127,
        no_mod: 0,
        hidden: 0,
        hard_rock: 0,
        double_time: 0,
        free_mod: 0,
        outdated: true,
        provisional: true,
        updated_at: '2026-02-17T18:17:05.623Z'
    }

}) {
    let svg = readTemplate('template/Panel_B.svg')

    const is_vs = data?.other != null

    const BOUNDARY = [10, 8, 6, 5.5, 5, 4.5, 4, 0];

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_main = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    const game_mode_path = torus.getTextPath('ETX', 960, 614, 60, 'center baseline', '#fff');

    const order = ['SR', 'NM', 'HD', 'HR', 'DT', 'FM']

    // 画六个标识
    svg = setText(svg, PanelDraw.HexagonIndex(order, 960,  600, 260, 0), reg_hexagon);

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.7);


    // 面板文字
    let panel_name

    if (is_vs) {
        const myTime = `${getFormattedTime(data.my.updated_at)} (${getTimeDifference(data.my.updated_at)})`;
        const othersTime = `(${getTimeDifference(data.others.updated_at)})`;

        const request_time = `updated at: ${myTime}, ${othersTime} // request time: ${getNowTimeStamp()}`;

        panel_name = getPanelNameSVG('ETX Duel Rating (!ymex/!ymev)', 'EV', request_time)
    } else {
        const myTime = `${getFormattedTime(data.my.updated_at)} (${getTimeDifference(data.my.updated_at)})`;
        const request_time = `updated at: ${myTime} // request time: ${getNowTimeStamp()}`;

        panel_name = getPanelNameSVG('ETX Duel Rating VS (!ymex/!ymev)', 'EX', request_time)
    }

    // 插入文字
    svg = setTexts(svg, [panel_name, game_mode_path], reg_index);


    // 主计算
    let card_B1_lefts = [];
    let card_B1_rights = [];
    let card_B7_centers = [];

    let number_left = [];
    let number_right = [];

    const key_order = ['star', 'no_mod', 'hidden', 'hard_rock', 'double_time', 'free_mod']

    const value_map = data?.my || []
    const vs_value_map = data?.others || []

    const values = key_order.map(key => value_map[key]);
    const vs_values = key_order.map(key => vs_value_map[key]);

    // 获取卡片
    for (let i = 0; i < 6; i++) {
        const abbr = order[i]

        const value = (values[i] ?? 0);
        const rank = getRankFromValue(value, BOUNDARY)
        const icon_colors = getRankColors(rank)

        card_B1_lefts.push(card_B6({
            ...LABEL_ETX[abbr],

            value: value,
            delta: is_vs ? (value - (vs_values[i] ?? 0)) : null,
            icon_colors: icon_colors,
            round_level: 2,
        }, false));

        number_left.push(Math.min(Math.max((value - 4), 0.01) / 3.5, 1));
    }

    svg = setText(svg, PanelDraw.HexagonChart(number_left, 960, 600, 230, '#00A8EC'), reg_hexagon);

    const string_b1s = card_B1_lefts
        .slice(0, 6)
        .map((card, j) => {
            const posX = 40;
            const posY = 340 + j * 115;

            return getSvgBody(posX, posY, card);
        })
        .join('\n');

    svg = setText(svg, string_b1s, reg_left)

    // 我自己的卡片
    const cardA1m = await card_A1(PanelGenerate.user2CardA1(data.me));
    svg = setSvgBody(svg, 40, 40, cardA1m, reg_main);


    // 如果是vs，渲染右边的人
    if (is_vs) {
        const cardA1o = await card_A1(PanelGenerate.user2CardA1(data.other));
        svg = setSvgBody(svg, 1450, 40, cardA1o, reg_main);

        for (let i = 0; i < 6; i++) {
            const abbr = order[i]

            const value = (vs_values[i] ?? 0);
            const rank = getRankFromValue(value, BOUNDARY)
            const icon_colors = getRankColors(rank)

            card_B1_rights.push(card_B6({
                ...LABEL_ETX[abbr],

                value: value,
                delta: is_vs ? (value - (values[i] ?? 0)) : null,
                icon_colors: icon_colors,
                round_level: 1,
            }, true));

            number_right.push(Math.min(Math.max((value - 4), 0.01) / 3.5, 1));
        }

        svg = setText(svg, PanelDraw.HexagonChart(number_right, 960, 600, 230, '#FF0000'), reg_hexagon);

        const string_b1v = card_B1_rights
            .slice(0, 6)
            .map((card, j) => {
                // j 确定为数字，计算垂直偏移
                const x = 1350;
                const y = 340 + j * 115;

                return getSvgBody(x, y, card);
            })
            .join('\n');

        svg = setText(svg, string_b1v, reg_right);

        const effective_me = !data.my?.outdated

        card_B7_centers.push(card_B7({
            ...LABEL_ETX.EF,

            value: (effective_me) ? 1 : 0,
            data_b: (effective_me) ? 'Y' : 'N',
            data_m: '',
            icon_colors: ((effective_me) ? colorArray.blue : colorArray.deep_blue).toReversed(),
            colors: colorArray.blue
        }));

        const effective_other = !data.others?.outdated

        card_B7_centers.push(card_B7({
            ...LABEL_ETX.EF,

            value: (effective_other) ? 1 : 0,
            data_b: (effective_other) ? 'Y' : 'N',
            data_m: '',
            icon_colors: ((effective_other) ? colorArray.red : colorArray.deep_red).toReversed(),
            colors: colorArray.red
        }, true));

    } else {
        const effective_me = !data.my?.outdated

        card_B7_centers.push(card_B7({
            ...LABEL_ETX.EF,

            value: (effective_me) ? 1 : 0,
            data_b: (effective_me) ? 'Y' : 'N',
            data_m: '',
            icon_colors: ((effective_me) ? colorArray.blue : colorArray.deep_blue).toReversed(),
            colors: colorArray.blue
        }));

        const permanent_me = !data.my?.provisional

        card_B7_centers.push(card_B7({
            ...LABEL_ETX.PE,

            value: (permanent_me) ? 1 : 0,
            data_b: (permanent_me) ? 'Y' : 'N',
            data_m: '',
            icon_colors: ((permanent_me) ? colorArray.red : colorArray.deep_red).toReversed(),
            colors: colorArray.red
        }, true));
    }

    svg = setSvgBody(svg, 630, 890, card_B7_centers[0], reg_center);
    svg = setSvgBody(svg, 970, 890, card_B7_centers[1], reg_center);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = setImage(svg, 718, 384, 484, 433, hexagon, reg_hexagon, 1);

    return svg
}