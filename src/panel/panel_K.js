import {
    exportJPEG,
    getImageFromV3, getPanelNameSVG, getSvgBody, rounds,
    setImage,
    setSvgBody, setText,
    setTexts,
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelDraw} from "../util/panelDraw.js";
import {poppinsBold} from "../util/font.js";
import {getRankFromValue} from "../util/star.js";
import {getRankColors} from "../util/color.js";
import {LABEL_MM} from "../component/label.js";
import {card_A1} from "../card/card_A1.js";
import {card_K} from "../card/card_K.js";
import {card_B6} from "../card/card_B6.js";
import {card_B7} from "../card/card_B7.js";

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
 * USER SKILL 技巧分析
 * @param data
 * @return {Promise<string>}
 */
export async function panel_K(data = {
    user: {},
    skill: [],
    scores: [{
        score: {},
        skill: [],
    }],
    total: 0,
    dan: {},

    vs_user: {},
    vs_skill: [],
    vs_scores: [{
        score: {},
        skill: [],
    }],
    vs_total: 0,
    vs_dan: {},

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
    const is_vs = data?.panel === 'KV'
    let middle

    let overall = rounds(data.total, 2)

    if (is_vs) {
        middle = poppinsBold.getTextPath('KV', 960, 614, 60, 'center baseline', '#fff');
    } else {
        middle = poppinsBold.get2SizeTextPath(overall.integer, overall.decimal, 60, 48, 960, 614, 'center baseline', '#fff');
    }

    // 画六个标识
    svg = setText(svg, PanelDraw.HexagonIndex((mode === 'mania') ? VALUE_MANIA : VALUE_NORMAL, 960, 600, 260, Math.PI / 3), reg_hexagon);

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    // 面板文字
    const panel_name = is_vs ?
        getPanelNameSVG('Skill VS v6.1 (!ymkv)', 'KV') :
        getPanelNameSVG('Skill v6.1 (!ymk)', 'K')

    // 插入文字
    svg = setTexts(svg, [panel_name, middle], reg_index);

    // A1 定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = setSvgBody(svg, 40, 40, cardA1, reg_main);

    let string_body = ''

    // K 定义，或是 A1
    if (is_vs) {
        const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.vs_user));
        svg = setSvgBody(svg, 1920 - 470, 40, cardA1, reg_main);
    } else {
        const card_Ks = []

        for (const i in skills) {
            const k = skills[i]

            const s2k = await PanelGenerate.skill2CardK(k)
            const ck = card_K(s2k)

            card_Ks.push(ck)
        }

        for (const i in card_Ks) {
            const k = card_Ks[i]
            const x = i % 2
            const y = Math.floor(i / 2)

            string_body += getSvgBody(1370 + x * 255, 350 + y * 138, k)
        }
    }

    // B 卡片

    const card_B6s = []
    const card_B6v = []
    const card_B7s = []

    const hexagons = []
    for (let i = 0; i < 6; i++) {
        const value = data?.skill[i] || 0

        const abbr = (mode === 'mania') ? VALUE_MANIA[i] : VALUE_NORMAL[i]
        const rank = getRankFromValue(value)
        const icon_colors = getRankColors(rank)

        card_B6s.push(card_B6({
            ...LABEL_MM[abbr],
            value: value,
            delta: is_vs ? value - data?.vs_skill[i] : null,
            icon_colors: icon_colors,
            round_level: 2
        }, false));

        hexagons.push(value / 10)
    }

    svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC', Math.PI / 3), reg_hexagon);

    if (is_vs) {
        const hexagons = []
        for (let i = 0; i < 6; i++) {
            const value = data?.vs_skill[i] || 0

            const abbr = (mode === 'mania') ? VALUE_MANIA[i] : VALUE_NORMAL[i]
            const vs_rank = getRankFromValue(value)
            const icon_colors = getRankColors(vs_rank)

            card_B6v.push(card_B6({
                ...LABEL_MM[abbr],
                value: value,
                delta: is_vs ? value - data?.vs_skill[i] : null,
                icon_colors: icon_colors,
                round_level: 2
            }, true));

            hexagons.push(value / 10)
        }

        svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#FF0000', Math.PI / 3), reg_hexagon);

        for (let j = 0; j < 6; j++) {
            const card_order = [0, 5, 4, 1, 2, 3]
            const k = card_order[j]

            string_body += getSvgBody(1350, 340 + j * 115, card_B6v[k]);
        }
    }

    for (let j = 0; j < 6; j++) {
        const card_order = [0, 5, 4, 1, 2, 3]
        const k = card_order[j]

        string_body += getSvgBody(40, 340 + j * 115, card_B6s[k]);
    }

    const rank_dn = getRankFromValue(data.dan?.reform_level);
    const colors_dn = getRankColors(rank_dn);

    card_B7s.push(card_B7({
        ...LABEL_MM.RD,
        value: data.dan?.reform_level,
        data_b: data.dan?.reform_grade,
        data_m: '',
        icon_colors: colors_dn,
        round_level: 0
    }));

    if (is_vs) {
        const rank_dv = getRankFromValue(data?.vs_total);
        const colors_dv = getRankColors(rank_dv);

        card_B7s.push(card_B7({
            ...LABEL_MM.DN,
            value: data.vs_dan?.reform_level,
            data_b: data.vs_dan?.reform_grade,
            data_m: '',
            icon_colors: colors_dv,
            round_level: 2
        }, true));
    } else {
        const rank_ln = getRankFromValue(data.dan?.ln_level);
        const colors_ln = getRankColors(rank_ln);

        card_B7s.push(card_B7({
            ...LABEL_MM.LD,
            value: data.dan?.ln_level,
            data_b: data.dan?.ln_grade,
            data_m: '',
            max: 14,
            icon_colors: colors_ln,
            round_level: 0
        }, true));
    }

    string_body += getSvgBody(630, 890, card_B7s[0]) + getSvgBody(970, 890, card_B7s[1])

    svg = setText(svg, string_body, reg_body)

    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = setImage(svg, 718, 384, 484, 433, hexagon, reg_hexagon, 1);

    return svg
}