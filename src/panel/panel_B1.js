import {
    exportJPEG,
    getImageFromV3,
    getGameMode, getPanelNameSVG,
    implantImage,
    implantSvgBody, readTemplate,
    replaceText, replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A1} from "../card/card_A1.js";
import {card_B1} from "../card/card_B1.js";
import {card_B2} from "../card/card_B2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {LABEL_PPM} from "../component/label.js";
import {getRankColor} from "../util/color.js";
import {getRankBG, getRankFromValue} from "../util/star.js";

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
    card_A1: [{
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

    const BOUNDARY = [120, 100, 95, 90, 80, 70, 60, 10];
    const SANITY_BOUNDARY = [120, 100, 95, 90, 80, 70, 60, 0];
    const SANITY_RANKS = ['?', '++', '+', '-', '--', '!?', '!', '!!', 'X'];

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
    const isVS = data.statistics.isVS;
    const mode = getGameMode(data.statistics.gameMode, 0);

    const game_mode_path = torus.getTextPath(mode, 960, 614, 60, 'center baseline', '#fff');

    // 画六个标识
    svg = replaceText(svg, PanelDraw.HexagonIndex((mode === 'mania') ? VALUE_MANIA : VALUE_NORMAL), reg_hexagon);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('PP Minus v2.4 (!ympm/!ympv)', 'PM', 'v0.4.0 UU');

    // 插入文字
    svg = replaceTexts(svg, [panel_name, game_mode_path], reg_index);

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
        if (typeof data?.card_b_1[name] !== 'number') continue;

        const value = (data?.card_b_1[name] || 0) * 100;
        const rank = getRankFromValue(value, BOUNDARY)
        const color = getRankColor(rank)
        const background = getRankBG(rank);

        card_B1_lefts.push(await card_B1({
            label: LABEL_PPM[name?.toUpperCase()],
            background: background,
            value: value,
            round_level: 2,
            rank: rank,
            color: color,

        }, false));
        number_left.push(Math.min(Math.max((data.card_b_1[name] * scale_left - 0.6), 0.01) / 4 * 10, 1));
    }
    svg = replaceText(svg, PanelDraw.HexagonChart(number_left, 960, 600, 230, '#00A8EC'), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        svg = implantSvgBody(svg, 40, 350 + j * 115, card_B1_lefts[j], reg_left);
    }

    // 我自己的卡片
    const cardA1m = await card_A1(await PanelGenerate.user2CardA1(data.card_A1[0]));
    svg = implantSvgBody(svg, 40, 40, cardA1m, reg_maincard);

    // 如果是vs，渲染右边的人
    if (isVS) {
        const cardA1y = await card_A1(await PanelGenerate.user2CardA1(data.card_A1[1]));
        svg = implantSvgBody(svg, 1450, 40, cardA1y, reg_maincard);

        for (const name of VALUE_NAMES) {
            if (typeof data.card_b_2[name] !== 'number') continue;

            const value = (data?.card_b_2[name] || 0) * 100;
            const rank = getRankFromValue(value, BOUNDARY)
            const color = getRankColor(rank)
            const background = getRankBG(rank);

            card_B1_rights.push(await card_B1({
                label: LABEL_PPM[name?.toUpperCase()],
                background: background,
                value: value,
                round_level: 2,
                rank: rank,
                color: color,

            }, true));
            number_right.push(Math.min(Math.max((data.card_b_2[name] * scale_right - 0.6), 0.01) / 4 * 10, 1));
        }

        svg = replaceText(svg, PanelDraw.HexagonChart(number_right, 960, 600, 230, '#FF0000'), reg_hexagon);

        for (const j in card_B1_rights) {
            svg = implantSvgBody(svg, 1350, 350 + j * 115, card_B1_rights[j], reg_right)
        }
        
        const value_1 = data?.card_b_1.OVA || 0;
        const rank_1 = getRankFromValue(value_1, BOUNDARY);
        const bg_1 = getRankBG(rank_1);
        const color_1 = getRankColor(rank_1);

        card_B2_centers.push(await card_B2({
            label: LABEL_PPM.OVA,
            background: bg_1,
            value: value_1,
            round_level: 0,
            rank: rank_1,
            color: color_1,
        }));


        const value_2 = data?.card_b_2.OVA || 0;
        const rank_2 = getRankFromValue(value_2, BOUNDARY);
        const bg_2 = getRankBG(rank_2);
        const color_2 = getRankColor(rank_2);

        card_B2_centers.push(await card_B2({
            label: LABEL_PPM.OVA,
            background: bg_2,
            value: value_2,
            round_level: 0,
            rank: rank_2,
            color: color_2,
        }));

    } else {
        const value_1 = data?.card_b_1.OVA || 0;
        const rank_1 = getRankFromValue(value_1, BOUNDARY);
        const bg_1 = getRankBG(rank_1);
        const color_1 = getRankColor(rank_1);

        card_B2_centers.push(await card_B2({
            label: LABEL_PPM.OVA,
            background: bg_1,
            value: value_1,
            round_level: 0,
            rank: rank_1,
            color: color_1,
        }));

        const san_value = Math.round(data?.card_b_1.SAN || 0);
        const san_rank = getRankFromValue(san_value, SANITY_BOUNDARY); // 用于颜色判断的 rank
        const san_bg = getRankBG(san_rank);
        const san_color = getRankColor(san_rank);
        const san_truly_rank = getRankFromValue(san_value, SANITY_BOUNDARY, SANITY_RANKS); // SAN 指示器

        card_B2_centers.push(await card_B2({
            label: LABEL_PPM.SAN,
            background: san_bg,
            value: san_value,
            round_level: 0,
            rank: san_truly_rank,
            color: san_color,
        }));
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
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);

    return svg.toString();
}