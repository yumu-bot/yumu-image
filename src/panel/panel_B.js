import {
    exportImage,
    getExportFileV3Path,
    getGameMode, getPanelNameSVG,
    getRandomBannerPath,
    implantImage,
    implantSvgBody, PanelDraw,
    readTemplate,
    replaceText, replaceTexts,
    torus
} from "../util.js";
import {card_A1} from "../card/card_A1.js";
import {card_B1} from "../card/card_B1.js";
import {card_B2} from "../card/card_B2.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportImage(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}
export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B(data);
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
export async function panel_B(data = {
    // A1卡
    card_A1: [{
        background: getExportFileV3Path('card-default.png'),
        avatar: getExportFileV3Path('avatar-guest.png'),
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

    card_b_1: {
        ACC: 1.1195, // 0-1
        PTT: 0.85,
        STA: 0.76,
        STB: 0.543,
        EFT: 0.645,
        STH: 0.984,
        OVA: 99.4, // 0-100
        SAN: 125.45, // 0-100
    },
    card_b_2: {
        ACC: 0.64, // 0-1
        PTT: 0.8743,
        STA: 0.7658,
        STB: 0.353,
        EFT: 0.995,
        STH: 1.004,
        OVA: 74.6, // 0-100
        SAN: 5.45, // 0-100
    },

    //其他统计数据
    statistics: {
        isVS: false, //是PPMVS吗？不是则false
        gameMode: 0, // 这里改用mode_int
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
    const reg_hexagon = /(?<=<g id="Hexagon">)/;

    // 条件定义
    const isVS = data.statistics.isVS;
    const mode = getGameMode(data.statistics.gameMode, 0);

    // sub_icon1 传的 countryCode , sub_icon2 是 撒泼特等级,如果不是0就是撒泼特,这俩你自行判断一下
    if (data.card_A1[0].sub_icon2 > 0) {
        data.card_A1[0].sub_icon1 = getExportFileV3Path('object-card-supporter.png');
        data.card_A1[0].sub_icon2 = null;
    } else {
        data.card_A1[0].sub_icon1 = null;
        data.card_A1[0].sub_icon2 = null;
    }
    if (data.card_A1[1]) {
        if (data.card_A1[1].sub_icon2 > 0) {
            data.card_A1[1].sub_icon1 = getExportFileV3Path('object-card-supporter.png');
            data.card_A1[1].sub_icon2 = null;
        } else {
            data.card_A1[1].sub_icon1 = null;
            data.card_A1[1].sub_icon2 = null;
        }
    }

    const game_mode_path = torus.getTextPath(mode, 960, 614, 60, 'center baseline', '#fff');

    // 画六个标识
    svg = implantSvgBody(svg, 0, 0, drawHexIndex(mode), reg_hexagon);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('PP Minus v2.4 (!ppm/!ppmvs)', 'PPM', 'v0.3.2 FT');

    // 插入文字
    svg = replaceTexts(svg, [panel_name, game_mode_path], reg_index);
    svg = implantSvgBody(svg, 40, 40, await card_A1(data.card_A1[0], true), reg_maincard);

    // 主计算

    let card_B1_lefts = [];
    let card_B1_rights = [];
    let card_B2_centers = [];

    let number_left = [];
    let number_right = [];
    let scale_left = 1;
    let scale_right = 1;

    if (isVS) {
        let mePP = data.card_A1[0].pp || 0;
        let yourPP = data.card_A1[1].pp || 0;

        if (mePP >= yourPP && yourPP > 0) {
            scale_right = yourPP / mePP;
        } else if (mePP < yourPP && mePP > 0) {
            scale_left = mePP / yourPP;
        }
    }

    // 获取卡片
    for (const name of VALUE_NAMES) {
        if (typeof data.card_b_1[name] !== 'number') continue;
        card_B1_lefts.push(await card_B1({parameter: name, number: data.card_b_1[name] * 100}, true, false));
        number_left.push(Math.min(Math.max((data.card_b_1[name] * scale_left - 0.6), 0.01) / 4 * 10, 1));
    }
    svg = implantSvgBody(svg, 0, 0, PanelDraw.Hexagon(number_left, 960, 600, 230, '#00A8EC'), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        svg = implantSvgBody(svg, 40, 350 + j * 115, card_B1_lefts[j], reg_left);
    }

    // 如果是vs，渲染右边的人
    if (isVS) {
        svg = implantSvgBody(svg, 1450, 40, await card_A1(data.card_A1[1], true), reg_maincard);

        for (const name of VALUE_NAMES) {
            if (typeof data.card_b_2[name] !== 'number') continue;
            card_B1_rights.push(await card_B1({parameter: name, number: data.card_b_2[name] * 100}, true, true));
            number_right.push(Math.min(Math.max((data.card_b_2[name] * scale_right - 0.6), 0.01) / 4 * 10, 1));
        }

        svg = implantSvgBody(svg, 0, 0, PanelDraw.Hexagon(number_right, 960, 600, 230, '#FF0000'), reg_hexagon);

        for (const j in card_B1_rights) {
            svg = implantSvgBody(svg, 1350, 350 + j * 115, card_B1_rights[j], reg_right)
        }
        card_B2_centers.push(await card_B2({parameter: "OVA", number: data.card_b_1.OVA}, true));
        card_B2_centers.push(await card_B2({parameter: "OVA", number: data.card_b_2.OVA}, true));
    } else {
        card_B2_centers.push(await card_B2({parameter: "OVA", number: data.card_b_1.OVA}, true));
        card_B2_centers.push(await card_B2({parameter: "SAN", number: data.card_b_1.SAN}, true));
    }
    svg = implantSvgBody(svg, 630, 860, card_B2_centers[0], reg_center);
    svg = implantSvgBody(svg, 970, 860, card_B2_centers[1], reg_center);

    //如果不是vs，则插入B3卡
    /*
    if (!isVS) {
        const cardB3 = await card_B3({game_mode: mode}, true);
        svg = implantSvgBody(svg, 1350, 330, cardB3, reg_right);
    }

     */

    // 画六边形和其他
    const hexagon = getExportFileV3Path('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);

    return svg.toString();
}

function drawHexIndex(mode = 'osu') {
    let cx = 960;
    let cy = 600;
    let r = 230 + 30; // 中点到边点的距离

    let svg = '<g id="RRect"></g><g id="IndexText"></g>';
    let reg_rrect = /(?<=<g id="RRect">)/;
    let reg_text = /(?<=<g id="IndexText">)/;

    const VALUE_NORMAL = ['ACC', 'PTT', 'STA', 'STB', 'EFT', 'STH'];
    const VALUE_MANIA = ['ACC', 'PTT', 'STA', 'PRE', 'EFT', 'STH'];

    for (let i = 0; i < 6; i++){
        let param;
        if (mode === 'mania') {
            param = VALUE_MANIA[i];
        } else {
            param = VALUE_NORMAL[i];
        }

        let PI_3 = Math.PI / 3;
        let x = cx - r * Math.cos(PI_3 * i);
        let y = cy - r * Math.sin(PI_3 * i);

        let param_text = torus.getTextPath(param, x, y + 8, 24, 'center baseline', '#fff');
        svg = replaceText(svg, param_text, reg_text)

        let param_width = torus.getTextWidth(param, 24);
        let rrect = `<rect width="${param_width + 40}" height="30" rx="15" ry="15" style="fill: #54454C;"/>`
        svg = implantSvgBody(svg, x - param_width / 2 - 20, y - 15, rrect, reg_rrect);

    }
    return svg;
}

