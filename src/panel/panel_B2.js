import {
    exportJPEG,
    getImageFromV3,
    getMapBG,
    getPanelNameSVG,
    getRoundedNumberStr,
    getRoundedNumberStrLarge,
    getRoundedNumberStrSmall,
    implantImage,
    implantSvgBody,
    readTemplate, replaceText,
    replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A2} from "../card/card_A2.js";
import {card_B1} from "../card/card_B1.js";
import {card_B2} from "../card/card_B2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRankBG, getRankFromValue, hasLeaderBoard} from "../util/star.js";
import {getRankColor} from "../util/color.js";
import {LABEL_MM} from "../component/label.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B2(data);
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
        const svg = await panel_B2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 骂娘谱面某种信息面板, 不玩骂娘看不懂
 * @param data
 * @return {Promise<string>}
 */
export async function panel_B2(data = {
    beatmap: {},

    map_minus: {
        value_list: [],
        sub_list: [],
        abbr_list: [],

        stream: [],
        jack: [],
    }

}) {
    let svg = readTemplate('template/Panel_B.svg');

    const m = data?.map_minus;

    const data_arr = m?.value_list || [];
    const sub_arr = m?.sub_list || [];
    const abbr_arr = m?.abbr_list || [];

    const map_minus_mania = {
        RC: data_arr[0],
        LN: data_arr[1],
        CO: data_arr[2],
        PR: data_arr[3],
        SP: data_arr[4],
        ST: data_arr[5],
    }

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    // 画六个标识
    svg = replaceText(svg , PanelDraw.HexagonIndex(abbr_arr.slice(0, 6), 960, 600, 260, Math.PI / 3), reg_hexagon);

    // 插入图片和部件（新方法
    const banner = await getMapBG(data.beatmap.beatmapset.id, 'cover', hasLeaderBoard(data.beatmap.ranked));
    svg = implantImage(svg, 1920, 330, 0, 0, 0.8, banner, reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('Map Minus v0.7 - Entering \'Firmament Castle \"Velier\"\' ~ 0.6x \"Perfect Snap\" (!ymmm)', 'MM', 'v0.5.0 DX');

    // 计算数值

    const total = m?.star || 0;

    const total_path = torus.get2SizeTextPath(getRoundedNumberStrLarge(total, 3), getRoundedNumberStrSmall(total, 3), 60, 36, 960, 614, 'center baseline', '#fff');

    // 插入文字
    svg = replaceTexts(svg, [panel_name, total_path], reg_index);

    // A2定义

    const cardA2 = await card_A2(await PanelGenerate.beatMap2CardA2(data.beatmap));
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 获取卡片
    let cardB1s = [];
    let hexagons = [];
    let cardB2s = [];

    for (let i = 0; i < 6; i++) {
        const abbr = abbr_arr[i];
        if (typeof map_minus_mania[abbr] !== 'number') continue;

        const value = map_minus_mania[abbr];
        const rank = getRankFromValue(value);
        const color = getRankColor(rank);
        const background = getRankBG(rank);

        cardB1s.push(await card_B1({

            label: LABEL_MM[abbr],
            background: background,
            value: value,
            round_level: 3,
            rank: rank,
            color: color,

        }, false));
        hexagons.push(map_minus_mania[abbr] / 9); //9星以上是X
    }

    svg = implantSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC', Math.PI / 3), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        svg = implantSvgBody(svg, 40, 350 + j * 115, cardB1s[j], reg_left);
    }

    const rank_ov = getRankFromValue(total);
    const color_ov = getRankColor(rank_ov);
    const background_ov = getRankBG(rank_ov);

    cardB2s.push(await card_B2({
        label: LABEL_MM.OV,
        background: background_ov,
        value: total,
        round_level: 3,
        rank: rank_ov,
        color: color_ov,
    }));

    cardB2s.push(await card_B2({
        label: LABEL_MM.SV,
        value: 'NaN',
        round_level: 3,
    }));

    //todo NaN

    svg = implantSvgBody(svg, 630, 860, cardB2s[0], reg_center);
    svg = implantSvgBody(svg, 970, 860, cardB2s[1], reg_center);

    // todo 临时的值
    function drawChart(array = [], index = 0, name = "null", x = 0, y = 0, color = '#fff') {
        return PanelDraw.LineChart(array, 0, 0, 1370 + x, 445 + y, 150, 95, color, 0.7, 0.2, 3) + torus.getTextPath(name + ": " + getRoundedNumberStr(index, 2), 75 + 1370 + x, - 35 + 445 + y, 24, 'center baseline', '#fff')
    }

    svg = replaceTexts(svg, [
        drawChart(m?.stream, sub_arr[0], 'S', 0, 0, '#39B449'),
        drawChart(m?.jack, sub_arr[1], 'J', 170, 0, '#8DC73D'),

        drawChart(m?.release, sub_arr[2], 'R', 0, 115, '#00A8EC'),
        drawChart(m?.shield, sub_arr[3], 'E', 170, 115, '#0071BC'),
        drawChart(m?.reverse_shield, sub_arr[4], 'V', 340, 115, '#0054A6'),

        drawChart(m?.bracket, sub_arr[5], 'B', 0, 230, '#FFF100'),
        drawChart(m?.hand_lock, sub_arr[6], 'H', 170, 230, '#FFE11D'),
        drawChart(m?.overlap, sub_arr[7], 'O', 340, 230, '#EFC72A'),

        drawChart(m?.grace, sub_arr[13], 'G', 0, 345, '#FF9800'),
        drawChart(m?.delayed_tail, sub_arr[14], 'Y', 170, 345, '#EB6100'),

        drawChart(m?.speed_jack, sub_arr[10], 'K', 0, 460, '#D32F2F'),
        drawChart(m?.trill, sub_arr[11], 'I', 170, 460, '#EA68A2'),
        drawChart(m?.burst, sub_arr[12], 'U', 340, 460, '#EB6877'),

        drawChart(m?.rice_density, sub_arr[8], 'C', 0, 575, '#920783'),
        drawChart(m?.ln_density, sub_arr[9], 'D', 170, 575, '#9922EE'),

    ], reg_right);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);

    return svg.toString();
}

function getTypeImage(type = "DEFAULT") {
    let image = ''

    switch (type) {
        default: image = 'default'
    }

    return getImageFromV3('Mods', image + '.png')
}