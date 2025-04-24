import {
    exportJPEG,
    getImageFromV3, getPanelNameSVG,
    setImage,
    setSvgBody, setText,
    setTexts,
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelDraw} from "../util/panelDraw.js";
import {torus} from "../util/font.js";
import {getRankBackground, getRankFromValue} from "../util/star.js";
import {getRankColor} from "../util/color.js";
import {card_B1} from "../card/card_B1.js";
import {LABEL_MM} from "../component/label.js";
import {card_B2} from "../card/card_B2.js";
import {card_A1} from "../card/card_A1.js";
import {card_K} from "../card/card_K.js";

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

    vs_user: {},
    vs_skill: [0],
    vs_scores: [{
        score: {},
        skill: [],
    }],
    vs_total: 0,

    panel: "KV",
}) {
    const VALUE_NORMAL = ["RC", "LN", "CO", "PR", "SP", "ST"];
    const VALUE_MANIA = ["RC", "LN", "CO", "PR", "SP", "ST"];

    const skills = data?.scores?.length > 10 ? data?.scores.slice(0, 10) : (data?.scores || [])

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
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
        <rect y="290" width="1920" height="790" rx="20" ry="20" style="fill: #2a2226;"/>
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
    const is_vs = data?.panel === 'KV'

    // 画六个标识
    svg = setText(svg, PanelDraw.HexagonIndex((mode === 'mania') ? VALUE_MANIA : VALUE_NORMAL, 960, 600, 260, Math.PI / 3), reg_hexagon);

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    // 面板文字
    const panel_name = is_vs ?
        getPanelNameSVG('Skill VS v4.0 (!ymkv)', 'KV') :
        getPanelNameSVG('Skill v4.0 (!ymk)', 'K')

    // 插入文字
    svg = setTexts(svg, [panel_name, mode_path], reg_index);

    // A1 定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = setSvgBody(svg, 40, 40, cardA1, reg_main);

    // K 定义，或是 A1
    if (is_vs) {
        const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.vs_user));
        svg = setSvgBody(svg, 1920 - 470, 40, cardA1, reg_main);
    } else {
        const card_Ks = []

        for (const i in skills) {
            const k = skills[i]

            const s2h = await PanelGenerate.skill2CardK(k)
            const ck = card_K(s2h)

            card_Ks.push(ck)
        }

        for (const i in card_Ks) {
            const k = card_Ks[i]
            const x = i % 2
            const y = Math.floor(i / 2)

            svg = setSvgBody(svg, 1370 + x * 255, 350 + y * 138, k, reg_body)
        }
    }

    // B 卡片

    const card_B1s = []
    const card_B1v = []
    const card_B2s = []

    const hexagons = []
    for (let i = 0; i < 6; i++) {
        const value = data?.skill[i] || 0

        const name = (mode === 'mania') ? VALUE_MANIA[i] : VALUE_NORMAL[i]
        const rank = getRankFromValue(value)
        const color = getRankColor(rank)
        const background = getRankBackground(rank)

        const b1_data = {
            label: LABEL_MM[name?.toUpperCase()],
            background: background,
            value: value,
            delta: is_vs ? value - data?.vs_skill[i] : null,
            round_level: 2,
            rank: rank,
            color: color,
        }

        card_B1s.push(
            await card_B1(b1_data, false)
        )

        hexagons.push(value / 10)
    }

    svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC', Math.PI / 3), reg_hexagon);

    if (is_vs) {
        const hexagons = []
        for (let i = 0; i < 6; i++) {
            const value = data?.vs_skill[i] || 0

            const name = (mode === 'mania') ? VALUE_MANIA[i] : VALUE_NORMAL[i]
            const rank = getRankFromValue(value)
            const color = getRankColor(rank)
            const background = getRankBackground(rank)

            const b1_data = {
                label: LABEL_MM[name?.toUpperCase()],
                background: background,
                value: value,
                delta: value - data?.skill[i] ,
                round_level: 2,
                rank: rank,
                color: color,
            }

            card_B1v.push(
                await card_B1(b1_data, true)
            )

            hexagons.push(value / 10)
        }

        svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#FF0000', Math.PI / 3), reg_hexagon);

        for (let j = 0; j < 6; j++) {
            const card_order = [0, 5, 4, 1, 2, 3]
            const k = card_order[j]

            svg = setSvgBody(svg, 1350, 350 + j * 115, card_B1v[k], reg_body);
        }
    }

    for (let j = 0; j < 6; j++) {
        const card_order = [0, 5, 4, 1, 2, 3]
        const k = card_order[j]

        svg = setSvgBody(svg, 40, 350 + j * 115, card_B1s[k], reg_body);
    }

    const rank_ov = getRankFromValue(data?.total);
    const color_ov = getRankColor(rank_ov);
    const background_ov = getRankBackground(rank_ov);

    card_B2s.push(await card_B2({
        label: LABEL_MM.OV,
        background: background_ov,
        value: data?.total,
        round_level: 2,
        rank: rank_ov,
        color: color_ov,
    }));

    if (is_vs) {
        const rank_ov = getRankFromValue(data?.vs_total);
        const color_ov = getRankColor(rank_ov);
        const background_ov = getRankBackground(rank_ov);

        card_B2s.push(await card_B2({
            label: LABEL_MM.OV,
            background: background_ov,
            value: data?.vs_total,
            round_level: 2,
            rank: rank_ov,
            color: color_ov,
        }));
    } else {
        card_B2s.push(await card_B2({
            label: LABEL_MM.SV,
            value: 'NaN',
            round_level: 2,
        }));
    }

    svg = setSvgBody(svg, 630, 860, card_B2s[0], reg_body);
    svg = setSvgBody(svg, 970, 860, card_B2s[1], reg_body);

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = setImage(svg, 718, 384, 484, 433, hexagon, reg_hexagon, 1);

    return svg.toString()
}