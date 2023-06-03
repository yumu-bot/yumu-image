import {
    exportPng,
    getExportFileV3Path, getGameMode,
    getNowTimeStamp,
    getRandomBannerPath,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText,
    torus
} from "../util.js";
import {card_A1} from "../card/card_A1.js";
import {card_B1} from "../card/card_B1.js";
import {card_B2} from "../card/card_B2.js";

export async function router(req, res) {
    const data = req.fields;
    const png = await panel_B(data);
    res.set('Content-Type', 'image/png');
    res.send(png);
}

const VALUE_NAMES = ['ACC', 'PTT', 'STA', 'STB', 'PRE', 'EFT', 'STH'] // OVA 跟 SAN 单独处理

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
        ACC: 0.1195,
        PTT: 0.85,
        STA: 0.76,
        STB: 0.543,
        EFT: 0.645,
        STH: 0.984,
        OVA: 0.746,
        SAN: 125.45,
    },
    card_b_2: {
        ACC: 0.64,
        PTT: 0.8743,
        STA: 0.7658,
        STB: 0.353,
        EFT: 0.995,
        STH: 1.004,
        OVA: 0.746,
        SAN: 5.45,
    },

    //其他统计数据
    statistics: {
        isVS: false, //是PPMVS吗？不是则false
        gameMode: 0, // 这里改用mode_int
    }

}) {
    let svg = readTemplate('template/Panel_B.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    let reg_left = /(?<=<g id="Left">)/;
    let reg_right = /(?<=<g id="Right">)/;
    let reg_center = /(?<=<g id="Center">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_hexagon = /(?<=<g id="Hexagon">)/;

    // 条件定义
    const isVS = data.statistics.isVS;
    let game_mode = getGameMode(data.statistics.gameMode, 0);

    // 面板文字
    const index_powered = 'powered by Yumubot v0.3.0 EA // PP Minus v2.4 (!ppm/!ppmvs)';
    const index_request_time = 'request time: ' + getNowTimeStamp();
    const index_panel_name = 'PPM';

    // sub_icon1 传的 countryCode , sub_icon2 是 撒泼特等级,如果不是0就是撒泼特,这俩你自行判断一下
    if (data.card_A1[0].sub_icon2 > 0) {
        data.card_A1[0].sub_icon1 = getExportFileV3Path('object-card-supporter.png');
        data.card_A1[0].sub_icon2 = null;
    }
    if (data.card_A1[1].sub_icon2 > 0) {
        data.card_A1[1].sub_icon1 = getExportFileV3Path('object-card-supporter.png');
        data.card_A1[1].sub_icon2 = null;
    }

    const index_powered_path = torus.getTextPath(index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    const index_request_time_path = torus.getTextPath(index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    const index_panel_name_path = torus.getTextPath(index_panel_name,
        607.5, 83.67, 48, "center baseline", "#fff");
    const game_mode_path = torus.getTextPath(game_mode, 960, 614, 60, 'center baseline', '#fff');

    // 插入图片和部件（新方法

    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 插入主面板的文字
    svg = replaceText(svg, index_powered_path, reg_index);
    svg = replaceText(svg, index_request_time_path, reg_index);
    svg = replaceText(svg, index_panel_name_path, reg_index);
    svg = replaceText(svg, game_mode_path, reg_index);

    // 主计算
    svg = implantSvgBody(svg, 40, 40, await card_A1(data.card_A1[0], true), reg_card_a1);

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
        if (!data.card_b_1[name]) continue;
        card_B1_lefts.push(await card_B1({parameter: name, number: data.card_b_1[name] * 100}, true, false));
        number_left.push(data.card_b_1[name] * 100 * scale_left);
    }

    svg = implantSvgBody(svg, 0, 0, drawHexagon(number_left, '#00A8EC'), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        svg = implantSvgBody(svg, 40, 350 + j * 115, card_B1_lefts[j], reg_left);
    }

    // 如果是vs，渲染右边的人
    if (isVS) {
        svg = implantSvgBody(svg, 1450, 40, await card_A1(data.card_A1[1], true), reg_card_a1);

        for (const name of VALUE_NAMES) {
            if (!data.card_b_2[name]) continue;
            card_B1_rights.push(await card_B1({parameter: name, number: data.card_b_2[name] * 100}, true, true));
            number_right.push(data.card_b_2[name] * 100 * scale_right);
        }

        svg = implantSvgBody(svg, 0, 0, drawHexagon(number_right, '#FF0000'), reg_hexagon);

        for (const j in card_B1_rights) {
            svg = implantSvgBody(svg, 1350, 350 + j * 115, card_B1_rights[j], reg_right)
        }
        card_B2_centers.push(await card_B2({parameter: "OVA", number: data.card_b_1.OVA * 100}, true));
        card_B2_centers.push(await card_B2({parameter: "OVA", number: data.card_b_2.OVA * 100}, true));
    } else {
        card_B2_centers.push(await card_B2({parameter: "OVA", number: data.card_b_1.OVA * 100}, true));
        card_B2_centers.push(await card_B2({parameter: "SAN", number: data.card_b_1.SAN}, true));
    }
        svg = implantSvgBody(svg, 630, 860, card_B2_centers[0], reg_center);
        svg = implantSvgBody(svg, 970, 860, card_B2_centers[1], reg_center);

    // 画六个标识
    svg = implantSvgBody(svg, 0, 0, drawHexIndex(game_mode), reg_hexagon);

    // 画六边形和其他

    const hexagon = getExportFileV3Path('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);


    return await exportPng(svg);
}

function drawHexIndex(gamemode = 'osu') {
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
        if (gamemode === 'mania') {
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

function drawHexagon(data = [0,0,0,0,0,0], color = '#00A8EC') {
    let cx = 960;
    let cy = 600;
    let r = 230 // 中点到边点的距离

    let line = `<path d="M `;
    let circle = '';

    for (let i = 0; i < 6; i++){
        let std_data = Math.min(Math.max((data[i] - 60), 0.1) / 4 * 10, 100);

        let PI_3 = Math.PI / 3;
        let x = cx - r * Math.cos(PI_3 * i) * std_data / 100;
        let y = cy - r * Math.sin(PI_3 * i) * std_data / 100;
        line += `${x} ${y} L `;
        circle += `<circle cx="${x}" cy="${y}" r="10" style="fill: ${color};"/>`;
    }

    line = line.substr(0, line.length - 2);
    let line1 = `Z" style="fill: none; stroke-width: 6; stroke: ${color}; opacity: 1;"/> `
    let line2 = `Z" style="fill: ${color}; stroke-width: 6; stroke: none; opacity: 0.3;"/> `
    line = line + line1 + line + line2 + circle;
    return line;
}