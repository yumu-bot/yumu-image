import {
    exportJPEG,
    getImageFromV3, getPanelHeight,
    getPanelNameSVG,
    implantImage,
    implantSvgBody,
    replaceText,
    replaceTexts,
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelDraw} from "../util/panelDraw.js";
import {torus} from "../util/font.js";
import {getRankBG, getRankFromValue} from "../util/star.js";
import {getRankColor} from "../util/color.js";
import {card_B1} from "../card/card_B1.js";
import {LABEL_MM} from "../component/label.js";
import {card_B2} from "../card/card_B2.js";
import {card_A1} from "../card/card_A1.js";
import {card_H} from "../card/card_H.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_K(data);
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
        const svg = await panel_K(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 技巧分析
 * @param data
 * @return {Promise<string>}
 */
export async function panel_K(data = {
    user: {},
    skill: [0],
    scores: [{
        score: {},
        skill: [],
    }],
    total: 0,
}) {
    const VALUE_NORMAL = ["RC", "LN", "CO", "PR", "SP", "ST"];
    const VALUE_MANIA = ["RC", "LN", "CO", "PR", "SP", "ST"];

    const skills = data?.scores?.length > 10 ? data?.scores.slice(0, 10) : (data?.scores || [])

    const panel_height = getPanelHeight(skills.length, 110, 2, 290, 40, 40) + 1080 - 290
    const card_height = panel_height - 290

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="${panel_height}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 ${panel_height}">
    <defs>
        <clipPath id="clippath-PK-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Banner">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: #1c1719;"/>
        <g style="clip-path: url(#clippath-PK-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="${card_height}" rx="20" ry="20" style="fill: #2a2226;"/>
        <rect x="40" y="330" width="530" height="710" rx="20" ry="20" style="fill: #382E32;"/>
        <rect x="1350" y="330" width="530" height="710" rx="20" ry="20" style="fill: #382E32;"/>
        <rect x="610" y="330" width="700" height="710" rx="20" ry="20" style="fill: #382E32;"/>
    </g>
    <g id="HexagonChart">
    </g>
    <g id="BodyCard">
    </g>
    <g id="MainCard">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: #382e32;"/>
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PK-1\);">)/;
    const reg_body = /(?<=<g id="BodyCard">)/;
    const reg_main = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    // 条件定义
    const mode = 'mania'
    const mode_path = torus.getTextPath(mode, 960, 614, 60, 'center baseline', '#fff');

    // 画六个标识
    svg = replaceText(svg, PanelDraw.HexagonIndex((mode === 'mania') ? VALUE_MANIA : VALUE_NORMAL, 960, 600, 260, Math.PI / 3), reg_hexagon);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('(Test) Skill v4.0 (!ymk)', 'K', 'v0.5.1 DX');

    // 插入文字
    svg = replaceTexts(svg, [panel_name, mode_path], reg_index);

    // A2 定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_main);

    // H 定义
    const card_Hs = []

    for (const i in skills) {
        const k = skills[i]

        const s2h = await PanelGenerate.score2CardH(k.score, (parseInt(i) + 1), true)
        const h = await card_H({...s2h,
            index_b: '',
            index_m: '',
            hexagon_arr: k.skill})

        card_Hs.push(h)
    }

    for (const i in card_Hs) {
        const v = card_Hs[i]
        const x = i % 2
        const y = Math.floor(i / 2)

        svg = implantSvgBody(svg, 40 + x * 940, y * 150 + 1080, v, reg_body)
    }

    // B 卡片
    const card_B1s = []
    const card_B2s = []
    const hexagons = []

    for (let i = 0; i < 6; i++) {
        const value = data?.skill[i] || 0

        const name = (mode === 'mania') ? VALUE_MANIA[i] : VALUE_NORMAL[i]
        const rank = getRankFromValue(value)
        const color = getRankColor(rank)
        const background = getRankBG(rank)

        const b1_data = {
            label: LABEL_MM[name?.toUpperCase()],
            background: background,
            value: value,
            round_level: 2,
            rank: rank,
            color: color,
        }

        card_B1s.push(
            await card_B1(b1_data, false)
        )

        hexagons.push(value / 9)
    }

    svg = implantSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC', Math.PI / 3), reg_hexagon);


    for (let j = 0; j < 6; j++) {
        const card_order = [0, 4, 5, 1, 2, 3]
        const k = card_order[j]

        svg = implantSvgBody(svg, 40, 350 + j * 115, card_B1s[k], reg_body);
    }

    const rank_ov = getRankFromValue(data?.total);
    const color_ov = getRankColor(rank_ov);
    const background_ov = getRankBG(rank_ov);

    card_B2s.push(await card_B2({
        label: LABEL_MM.OV,
        background: background_ov,
        value: data?.total,
        round_level: 2,
        rank: rank_ov,
        color: color_ov,
    }));

    card_B2s.push(await card_B2({
        icon: getImageFromV3("object-score-beatsperminute.png"),
        remark: 'empty',
        data_b: '-',
        data_m: '',
        value: 'NaN',
        round_level: 2,
    }));

    svg = implantSvgBody(svg, 630, 860, card_B2s[0], reg_body);
    svg = implantSvgBody(svg, 970, 860, card_B2s[1], reg_body);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);

    return svg.toString()
}