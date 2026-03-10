import {
    exportJPEG, getGameMode,
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
    abbreviates: [],
    scores: [{
        score: {},
        skill: [],
    }],
    total: 0,
    dan: {},

    vs_user: {},
    vs_skill: [],
    vs_abbreviates: [],
    vs_scores: [{
        score: {},
        skill: [],
    }],
    vs_total: 0,
    vs_dan: {},

    panel: "KV",
}) {

    const DEFAULT_ABBR = ["RC", "ST", "SP", "LN", "CO", "PR", "SV"]

    const MAPPER = {
        "reform": LABEL_MM.RF,
        "underjoy": LABEL_MM.UJ,
        "regular": LABEL_MM.RG,
        "ln": LABEL_MM.JL,
    }

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

    if (is_vs) {

        let overall = rounds((data?.total - data?.vs_total) || 0, 2)

        middle = poppinsBold.get2SizeTextPath(overall.integer, overall.decimal,
            60, 48, 960, 614, 'center baseline', '#fff');
    } else {
        let overall = rounds(data.total, 2)

        middle = poppinsBold.get2SizeTextPath(overall.integer, overall.decimal,
            60, 48, 960, 614, 'center baseline', '#fff');
    }

    // 重新排序

    let hexagon_order
    let label_order

    if (getGameMode(mode, 1) === 'm') {
        hexagon_order = ["RC", "LN", "CO", "PR", "SP", "ST"];
        label_order = ["RC", "ST", "SP", "LN", "CO", "PR"];
    } else {
        hexagon_order = ["RC", "LN", "CO", "PR", "SP", "ST"];
        label_order = ["RC", "LN", "CO", "PR", "SP", "ST"];
    }

    const value_map = {};

    const abbr_list = data?.abbreviates ?? DEFAULT_ABBR;

    const skill_list = data?.skill || [];

    abbr_list.forEach((key, index) => {
        value_map[key] = skill_list[index] ?? 0;
    });

    const hexagon_values = hexagon_order.map(key => value_map[key] / 10);
    const values = label_order.map(key => value_map[key]);

    // 画六个标识
    svg = setText(svg, PanelDraw.HexagonIndex(hexagon_order, 960, 600, 260, Math.PI / 3), reg_hexagon);

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

        const string_Ks = card_Ks.map((k, i) => {
            // i 严格为数字，直接参与数学运算
            const x = i % 2;
            const y = Math.floor(i / 2);

            const posX = 1370 + x * 255;
            const posY = 350 + y * 138;

            return getSvgBody(posX, posY, k);
        }).join('\n');

        string_body += string_Ks;
    }

    // B 卡片

    const vs_value_map = {};

    const vs_skill_list = data?.vs_skill || [];

    abbr_list.forEach((key, index) => {
        vs_value_map[key] = vs_skill_list[index] ?? 0;
    });

    const vs_hexagon_values = hexagon_order.map(key => vs_value_map[key] / 10);
    const vs_values = label_order.map(key => vs_value_map[key]);

    const card_B6s = []
    const card_B6v = []
    const card_B7s = []

    for (let i = 0; i < 6; i++) {
        const value = values[i]

        const abbr = label_order[i]
        const rank = getRankFromValue(value)
        const icon_colors = getRankColors(rank)

        card_B6s.push(card_B6({
            ...LABEL_MM[abbr],
            value: value,
            delta: is_vs ? value - (vs_values[i] ?? 0) : null,
            icon_colors: icon_colors,
            round_level: 2
        }, false));
    }

    svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagon_values, 960, 600, 230, '#00A8EC', Math.PI / 3), reg_hexagon);

    if (is_vs) {
        for (let i = 0; i < 6; i++) {
            const value = vs_values[i] ?? 0

            const abbr = label_order[i]
            const vs_rank = getRankFromValue(value)
            const icon_colors = getRankColors(vs_rank)

            card_B6v.push(card_B6({
                ...LABEL_MM[abbr],
                value: value,
                delta: is_vs ? value - (values[i] ?? 0) : null,
                icon_colors: icon_colors,
                round_level: 2
            }, true));
        }

        svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(vs_hexagon_values, 960, 600, 230, '#FF0000', Math.PI / 3), reg_hexagon);

        for (let j = 0; j < 6; j++) {
            string_body += getSvgBody(1350, 340 + j * 115, card_B6v[j]);
        }
    }

    for (let j = 0; j < 6; j++) {
        string_body += getSvgBody(40, 340 + j * 115, card_B6s[j]);
    }

    if (is_vs) {
        const my_dan = Object.values(data?.dan || {}).reduce((max, curr) => {
            return (curr?.level ?? -1) > (max.level ?? -1) ? curr : max;
        }, { level: 0, grade: "-" });

        let my_dan_level = my_dan.level
        let my_dan_grade = my_dan.grade
        let my_dan_label =  MAPPER[my_dan.name] ?? LABEL_MM.DN

        const rank_my = getRankFromValue(my_dan_level);
        const colors_my = getRankColors(rank_my);

        card_B7s.push(card_B7({
            ...my_dan_label,
            value: my_dan_level,
            data_b: my_dan_grade,
            data_m: '',
            icon_colors: colors_my,
            round_level: 0
        }));

        const other_dan = Object.values(data?.vs_dan || {}).reduce((max, curr) => {
            return (curr?.level ?? -1) > (max.level ?? -1) ? curr : max;
        }, { level: 0, grade: "-" });

        let other_dan_level = other_dan.level
        let other_dan_grade = other_dan.grade
        let other_dan_label =  MAPPER[other_dan.name] ?? LABEL_MM.DN

        const rank_other = getRankFromValue(other_dan_level);
        const colors_other = getRankColors(rank_other);

        card_B7s.push(card_B7({
            ...other_dan_label,
            value: other_dan_level,
            data_b: other_dan_grade,
            data_m: '',
            icon_colors: colors_other,
            round_level: 0
        }, true));
    } else {
        let dan_rc
        let dan_rc_label

        if (data?.dan?.reform != null) {
            dan_rc = data?.dan?.reform;
            dan_rc_label = LABEL_MM.RF
        } else {
            dan_rc = data?.dan?.regular;
            dan_rc_label = LABEL_MM.RG
        }

        const rank_rc = getRankFromValue(dan_rc?.level);
        const colors_ov = getRankColors(rank_rc);

        card_B7s.push(card_B7({
            ...dan_rc_label,
            value: dan_rc?.level,
            data_b: dan_rc?.grade,
            data_m: '',
            icon_colors: colors_ov,
            round_level: 0
        }));

        let dan_ln
        let dan_ln_label

        if (data?.dan?.underjoy != null) {
            dan_ln = data?.dan?.underjoy;
            dan_ln_label = LABEL_MM.UJ
        } else {
            dan_ln = data?.dan?.ln;
            dan_ln_label = LABEL_MM.JL
        }

        const rank_ln = getRankFromValue(dan_ln?.level);
        const colors_ln = getRankColors(rank_ln);

        card_B7s.push(card_B7({
            ...dan_ln_label,
            value: dan_ln?.level,
            data_b: dan_ln?.grade,
            data_m: '',
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