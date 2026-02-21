import {
    exportJPEG,
    getImageFromV3,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    readTemplate, setText,
    setTexts, floor, floors, getMapBackground, getSvgBody
} from "../util/util.js";
import {poppinsBold} from "../util/font.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRankFromValue} from "../util/star.js";
import {getRankColors} from "../util/color.js";
import {LABEL_MM} from "../component/label.js";
import {card_B6} from "../card/card_B6.js";
import {card_B7} from "../card/card_B7.js";

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
 * Skill 信息面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_B2(data = {
    beatmap: {},

    map_minus: {
        skills: [],
        bases: [],
        abbreviates: [],
    },

    rating: 0.0,
    dan: {
        "reform_level": "2",
        "reform_grade": "10+",
        "ln_level": "2",
        "ln_grade": "10+",
    },

    type: "",
    type_percent: 0.7,

}) {
    let svg = readTemplate('template/Panel_B.svg');

    const m = data?.map_minus;

    const value_arr = m?.skills ?? m.values ?? [];
    const base_arr = m?.bases ?? [];
    const abbr_arr = m?.abbreviates ?? [];

    const map_minus_mania = {
        RC: value_arr[0],
        ST: value_arr[1],
        SP: value_arr[2],
        LN: value_arr[3],
        CO: value_arr[4],
        PR: value_arr[5],
    }

    const show_arr = ['RC', 'LN', 'CO', 'PR', 'SP', 'ST']

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    // 画六个标识
    svg = setText(svg, PanelDraw.HexagonIndex(show_arr, 960, 600, 260, Math.PI / 3), reg_hexagon);

    // 插入图片和部件（新方法
    const banner = await getMapBackground(data.beatmap, 'cover');
    svg = setImage(svg, 0, 0, 1920, 320, banner, reg_banner, 0.8);

    // 面板文字
    const panel_name = getPanelNameSVG('Map Minus v6.1 - Entering \'Firmament Castle \"Velier\"\' ~ 0.6x \"Perfect Snap\" (!ymmm)', 'MM');

    // 计算数值
    const total = (m?.rating ?? m?.stars ?? 0)
    const total_number = floors(total, 2)
    const total_path = poppinsBold.get2SizeTextPath(total_number.integer, total_number.decimal, 60, 36, 960, 614, 'center baseline', '#fff')


    // 插入文字
    svg = setTexts(svg, [panel_name, total_path], reg_index);

    // A2定义
    const cardA2 = card_A2(await PanelGenerate.beatmap2CardA2(data.beatmap));
    svg = setSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 获取卡片
    let cardB6s = [];
    let hexagons;
    let cardB7s = [];

    for (let i = 0; i < 6; i++) {
        const abbr = abbr_arr[i];
        if (typeof map_minus_mania[abbr] !== 'number') {
            cardB6s.push('')
            continue;
        }

        const value = map_minus_mania[abbr];
        const rank = getRankFromValue(value);
        const icon_colors = getRankColors(rank);

        cardB6s.push(card_B6({
            ...LABEL_MM[abbr],
            value: value,
            icon_colors: icon_colors,
            round_level: 2
        }, false));
    }

    hexagons = show_arr.map(name => {return map_minus_mania[name] / 9})

    svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC', Math.PI / 3), reg_hexagon);

    let string_b6s = ''

    for (let j = 0; j < 6; j++) {
        string_b6s += getSvgBody(40, 340 + j * 115, cardB6s[j])
    }

    svg = setText(svg, string_b6s, reg_left)

    const rank_ov = getRankFromValue(m.dan?.reform_level);
    const colors_ov = getRankColors(rank_ov);

    cardB7s.push(card_B7({
        ...LABEL_MM.RD,
        value: m.dan?.reform_level,
        data_b: m.dan?.reform_grade,
        data_m: '',
        max: 15,
        icon_colors: colors_ov,
        round_level: 0
    }));

    const rank_ln = getRankFromValue(m.dan?.ln_level);
    const colors_ln = getRankColors(rank_ln);

    cardB7s.push(card_B7({
        ...LABEL_MM.LD,
        value: m.dan?.ln_level,
        data_b: m.dan?.lv_grade,
        data_m: '',
        max: 14,
        icon_colors: colors_ln,
        round_level: 0,
    }, true));

    //todo NaN

    svg = setSvgBody(svg, 630, 890, cardB7s[0], reg_center);
    svg = setSvgBody(svg, 970, 890, cardB7s[1], reg_center);

    // 插入种类（测试中）
    const type_image = ''
    const type_percent = ''

    svg = setText(svg, type_percent, reg_right)
    svg = setImage(svg, 1685, 210, 195, 60, type_image, reg_right, 1)

    // todo 临时的值
    function drawChart(array = [], index = 0, name = "null", x = 0, y = 0, color = '#fff') {
        return PanelDraw.LineChart(array, 0, 0, 1370 + x, 445 + y, 150, 95, color, 0.7, 0.2, 3) + poppinsBold.getTextPath(name + ": " + floor(index, 1), 75 + 1370 + x, -35 + 445 + y, 24, 'center baseline', '#fff')
    }

    svg = setTexts(svg, [
        drawChart(m?.stream, base_arr[0], 'S', 0, 0, '#39B449'),
        drawChart(m?.bracket, base_arr[1], 'B', 170, 0, '#8DC73D'),
        drawChart(m?.jack, base_arr[2], 'J', 340, 0, '#C2D92F'),

        drawChart(m?.fatigue, base_arr[3], 'F', 0, 115, '#920783'),

        drawChart(m?.trill, base_arr[4], 'T', 0, 230, '#D32F2F'),
        drawChart(m?.burst, base_arr[5], 'U', 170, 230, '#EB6877'),

        drawChart(m?.release, base_arr[6], 'R', 0, 345, '#00A8EC'),
        drawChart(m?.shield, base_arr[7], 'E', 170, 345, '#0071BC'),
        drawChart(m?.reverse_shield, base_arr[8], 'V', 340, 345, '#0054A6'),

        drawChart(m?.hand_lock, base_arr[9], 'H', 0, 460, '#FFF100'),
        drawChart(m?.overlap, base_arr[10], 'O', 170, 460, '#EFC72A'),

        drawChart(m?.grace, base_arr[11], 'G', 0, 575, '#FF9800'),
        drawChart(m?.delayed_tail, base_arr[12], 'Y', 170, 575, '#EB6100'),

    ], reg_right);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = setImage(svg, 718, 384, 484, 433, hexagon, reg_hexagon, 1);

    return svg;
}
