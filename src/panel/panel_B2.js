import {
    exportJPEG,
    getImageFromV3,
    getMapBG,
    getPanelNameSVG,
    implantImage,
    implantSvgBody,
    readTemplate, replaceText,
    replaceTexts, round, rounds
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
        values: [],
        bases: [],
        abbreviates: [],
    },

    type: "",
    type_percent: 0.7,

}) {
    let svg = readTemplate('template/Panel_B.svg');

    const m = data?.map_minus;

    const value_arr = m?.values || [];
    const base_arr = m?.bases || [];
    const abbr_arr = m?.abbreviates || [];

    const map_minus_mania = {
        RC: value_arr[0],
        LN: value_arr[1],
        CO: value_arr[2],
        PR: value_arr[3],
        SP: value_arr[4],
        ST: value_arr[5],
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
    svg = replaceText(svg, PanelDraw.HexagonIndex(abbr_arr.slice(0, 6), 960, 600, 260, Math.PI / 3), reg_hexagon);

    // 插入图片和部件（新方法
    const banner = await getMapBG(data.beatmap.beatmapset.id, 'cover', hasLeaderBoard(data.beatmap.ranked));
    svg = implantImage(svg, 1920, 330, 0, 0, 0.8, banner, reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('Map Minus v0.8 - Entering \'Firmament Castle \"Velier\"\' ~ 0.6x \"Perfect Snap\" (!ymmm)', 'MM', 'v0.5.0 DX');

    // 计算数值
    const delta = (m?.star || 0) - (data.beatmap?.difficulty_rating || 0);
    const total_number = rounds(delta, 2)
    const total_path = torus.get2SizeTextPath((delta > 0 ? '+' : '') + total_number.integer, total_number.decimal, 60, 36, 960, 614, 'center baseline', (delta >= 0 ? '#c2e5c3' : '#ffcdd2'));

    // 插入文字
    svg = replaceTexts(svg, [panel_name, total_path], reg_index);

    // A2定义
    const cardA2 = card_A2(await PanelGenerate.beatMap2CardA2(data.beatmap));
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
            round_level: 2,
            rank: rank,
            color: color,

        }, false));
        hexagons.push(map_minus_mania[abbr] / 9); //9星以上是X
    }

    svg = implantSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC', Math.PI / 3), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        const card_order = [0, 5, 4, 1, 2, 3]
        const k = card_order[j]

        svg = implantSvgBody(svg, 40, 350 + j * 115, cardB1s[k], reg_left);
    }

    const rank_ov = getRankFromValue(total);
    const color_ov = getRankColor(rank_ov);
    const background_ov = getRankBG(rank_ov);

    cardB2s.push(await card_B2({
        label: LABEL_MM.OV,
        background: background_ov,
        value: total,
        round_level: 2,
        rank: rank_ov,
        color: color_ov,
    }));

    cardB2s.push(await card_B2({
        label: LABEL_MM.SV,
        value: 'NaN',
        round_level: 2,
    }));

    //todo NaN

    svg = implantSvgBody(svg, 630, 860, cardB2s[0], reg_center);
    svg = implantSvgBody(svg, 970, 860, cardB2s[1], reg_center);

    // 插入种类（测试中）
    const type_image = getTypeImage(data?.type, data?.type_percent)
    const type_percent = data?.type_percent > 0 ?
        torus.getTextPath(Math.round(data?.type_percent * 100) + '%', 1685 + 195/2, 210 - 8, 16, 'center baseline', '#fff')
        : ''

    svg = replaceText(svg, type_percent, reg_right)
    svg = implantImage(svg, 195, 60, 1685, 210, 1, type_image, reg_right)

    // todo 临时的值
    function drawChart(array = [], index = 0, name = "null", x = 0, y = 0, color = '#fff') {
        return PanelDraw.LineChart(array, 0, 0, 1370 + x, 445 + y, 150, 95, color, 0.7, 0.2, 3) + torus.getTextPath(name + ": " + round(index, 1), 75 + 1370 + x, -35 + 445 + y, 24, 'center baseline', '#fff')
    }

    svg = replaceTexts(svg, [
        drawChart(m?.stream, base_arr[0], 'S', 0, 0, '#39B449'),
        drawChart(m?.jack, base_arr[1], 'J', 170, 0, '#8DC73D'),

        drawChart(m?.release, base_arr[2], 'R', 0, 115, '#00A8EC'),
        drawChart(m?.shield, base_arr[3], 'E', 170, 115, '#0071BC'),
        drawChart(m?.reverse_shield, base_arr[4], 'V', 340, 115, '#0054A6'),

        drawChart(m?.bracket, base_arr[5], 'B', 0, 230, '#FFF100'),
        drawChart(m?.hand_lock, base_arr[6], 'H', 170, 230, '#FFE11D'),
        drawChart(m?.overlap, base_arr[7], 'O', 340, 230, '#EFC72A'),

        drawChart(m?.grace, base_arr[8], 'G', 0, 345, '#FF9800'),
        drawChart(m?.delayed_tail, base_arr[9], 'Y', 170, 345, '#EB6100'),

        drawChart(m?.speed_jack, base_arr[10], 'K', 0, 460, '#D32F2F'),
        drawChart(m?.trill, base_arr[11], 'I', 170, 460, '#EA68A2'),
        drawChart(m?.burst, base_arr[12], 'U', 340, 460, '#EB6877'),

        drawChart(m?.rice_density, base_arr[13], 'C', 0, 575, '#920783'),
        drawChart(m?.ln_density, base_arr[14], 'D', 170, 575, '#9922EE'),

    ], reg_right);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);

    return svg.toString();
}

function getTypeImage(type = "DEFAULT", type_percent = 1) {
    let image = ''

    if (type_percent < 0.3) {
        type = "DEFAULT"
    }

    switch (type.toString().toUpperCase()) {
        case "EASY_JUMP_TRILL":
        case "HARD_JUMP_TRILL":
            image = 'jump_trill'
            break
        case "JACK":
        case "HARD_JACK":
            image = 'jack'
            break
        case "SPEED_STREAM":
            image = 'speed_stream'
            break
        case "STAMINA_RICE":
            image = 'stamina'
            break
        case "EASY_COORDINATE":
        case "HARD_COORDINATE":
            image = 'coordinate'
            break
        case "EASY_RELEASE":
        case "HARD_RELEASE":
            image = 'release'
            break
        case "EASY_STREAM":
        case "HARD_STREAM":
            image = 'stream'
            break
        case "EASY_HYBRID":
        case "HARD_HYBRID":
            image = 'hybrid'
            break
        case "SHORT_LN":
            image = 'short_long_note'
            break
        case "IRREGULAR_LN":
            image = 'irregular_release'
            break
        case "SINGLE_LINE":
            image = 'single_track'
            break
        case "OVERESTIMATED_SR":
            image = 'easy'
            break
        case "UNDERESTIMATED_SR":
            image = 'extreme'
            break
        case "CLASSIC":
            image = 'rice'
            break
        case "MODERN":
            image = 'long_note'
            break
        case "BURST":
            image = 'burst'
            break
        case "AWMRONE":
            image = 'awmrone'
            break
        case "DEFAULT":
            image = 'default'
            break
        default:
            return ''
    }

    return getImageFromV3('Mods', image + '.png')
}