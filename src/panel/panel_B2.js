import {
    exportJPEG, getImageFromV3, getGameMode, getMapBG,
    getPanelNameSVG, getRoundedNumberStrLarge, getRoundedNumberStrSmall, implantImage,
    implantSvgBody, readTemplate,
    replaceText, replaceTexts, getRoundedNumberStr
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A2} from "../card/card_A2.js";
import {card_B4} from "../card/card_B4.js";
import {card_B5} from "../card/card_B5.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {hasLeaderBoard} from "../util/star.js";

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
    beatMap: {},

    mapMinus: {
        valueList: [],
        subList: [],

        stream: [],
        jack: [],
    }

}) {
    let svg = readTemplate('template/Panel_B.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    // 画六个标识
    svg = implantSvgBody(svg, 0, 0, drawHexIndex(getGameMode(data.beatMap.mode, 0)), reg_hexagon);

    // 插入图片和部件（新方法
    const banner = await getMapBG(data.beatMap.beatmapset.id, 'cover', hasLeaderBoard(data.beatMap.ranked));
    svg = implantImage(svg, 1920, 330, 0, 0, 0.6, banner, reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('Map Minus v0.62 - Entering \'Firmament Castle \"Velier\"\' ~ 0.6x \"Perfect Snap\" (!ymmm)', 'MM', 'v0.4.0 UU');

    // 计算数值

    const m = data?.mapMinus;

    const data_arr = m?.valueList || [];
    const sub_arr = m?.subList || [];

    const map_minus_mania = {
        RC: data_arr[0],
        LN: data_arr[1],
        CO: data_arr[2],
        ST: data_arr[3],
        SP: data_arr[4],
        PR: data_arr[5],
    }

    const total = m?.star || 0;

    const total_path = torus.get2SizeTextPath(getRoundedNumberStrLarge(total, 3), getRoundedNumberStrSmall(total, 3), 60, 36, 960, 614, 'center baseline', '#fff');

    // 插入文字
    svg = replaceTexts(svg, [panel_name, total_path], reg_index);

    // A2定义

    const cardA2 = await card_A2(await PanelGenerate.beatmap2CardA2(data.beatMap));
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 获取卡片
    let cardB4s = [];
    let hexagons = [];
    let cardB5s = [];

    for (let i = 0; i < 6; i++) {
        const abbr = m?.abbrList[i];

        if (typeof map_minus_mania[abbr] !== 'number') continue;
        cardB4s.push(await card_B4({parameter: abbr, number: map_minus_mania[abbr]}, false));
        hexagons.push(map_minus_mania[abbr] / 9); //9星以上是X
    }

    svg = implantSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC'), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        svg = implantSvgBody(svg, 40, 350 + j * 115, cardB4s[j], reg_left);
    }

    cardB5s.push(await card_B5({parameter: "OV", number: total}));
    cardB5s.push(await card_B5({parameter: "SV", number: "-"})); //todo NaN

    svg = implantSvgBody(svg, 630, 860, cardB5s[0], reg_center);
    svg = implantSvgBody(svg, 970, 860, cardB5s[1], reg_center);

    // todo 临时的值
    function drawChart(array = [], index = 0, name = "null", x = 0, y = 0, color = '#fff') {
        return PanelDraw.LineChart(array, 0, 0, 1370 + x, 445 + y, 150, 95, color, 0.7, 0.2, 3) + torus.getTextPath(name + ": " + getRoundedNumberStr(index, 2), 75 + 1370 + x, - 35 + 445 + y, 24, 'center baseline', '#fff')
    }

    svg = replaceTexts(svg, [
        drawChart(m?.stream, sub_arr[0], 'S', 0, 0, '#39B449'),
        drawChart(m?.jack, sub_arr[1], 'J', 170, 0, '#8DC73D'),

        drawChart(m?.release, sub_arr[2], 'R', 0, 115, '#00A8EC'),
        drawChart(m?.shield, sub_arr[3], 'E', 170, 115, '#0071BC'),
        drawChart(m?.reverseShield, sub_arr[4], 'V', 340, 115, '#0054A6'),

        drawChart(m?.bracket, sub_arr[5], 'B', 0, 230, '#FFF100'),
        drawChart(m?.handLock, sub_arr[6], 'H', 170, 230, '#FFE11D'),
        drawChart(m?.overlap, sub_arr[7], 'O', 340, 230, '#EFC72A'),

        drawChart(m?.riceDensity, sub_arr[8], 'C', 0, 345, '#FF9800'),
        drawChart(m?.lnDensity, sub_arr[9], 'D', 170, 345, '#EB6100'),

        drawChart(m?.speedJack, sub_arr[10], 'K', 0, 460, '#D32F2F'),
        drawChart(m?.trill, sub_arr[11], 'I', 170, 460, '#EA68A2'),
        drawChart(m?.burst, sub_arr[12], 'U', 340, 460, '#EB6877'),

        drawChart(m?.grace, sub_arr[13], 'G', 0, 575, '#920783'),
        drawChart(m?.delayedTail, sub_arr[14], 'Y', 170, 575, '#9922EE'),

    ], reg_right);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);

    return svg.toString();
}

function drawHexIndex(mode = 'osu') {
    const cx = 960;
    const cy = 600;
    const r = 230 + 30; // 中点到边点的距离

    let svg = '<g id="Rect"></g><g id="IndexText"></g>';
    const reg_rrect = /(?<=<g id="Rect">)/;
    const reg_text = /(?<=<g id="IndexText">)/;

    const VALUE_NORMAL = ['RC', 'LN', 'CO', 'ST', 'SP', 'PR'];
    const VALUE_MANIA = ['RC', 'LN', 'CO', 'ST', 'SP', 'PR'];

    for (let i = 0; i < 6; i++){
        let param;
        if (mode === 'mania') {
            param = VALUE_MANIA[i];
        } else {
            param = VALUE_NORMAL[i];
        }

        const PI_3 = Math.PI / 3;
        const x = cx - r * Math.cos(PI_3 * i);
        const y = cy - r * Math.sin(PI_3 * i);

        const param_text = torus.getTextPath(param, x, y + 8, 24, 'center baseline', '#fff');
        svg = replaceText(svg, param_text, reg_text)

        const param_width = torus.getTextWidth(param, 24);
        const rrect = PanelDraw.Rect(x - param_width / 2 - 20, y - 15, param_width + 40, 30, 15, '#54454C');
        svg = replaceText(svg, rrect, reg_rrect);

    }
    return svg;
}