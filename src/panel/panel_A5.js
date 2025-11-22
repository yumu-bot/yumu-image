import {
    exportJPEG, getPanelHeight, getPanelNameSVG, setImage,
    setSvgBody, readTemplate,
    setText, thenPush, getSvgBody,
} from "../util/util.js";
import {card_C} from "../card/card_C.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {card_I4} from "../card/card_I4.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A5(data);
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
        const svg = await panel_A5(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 成绩pr面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A5(data = {
    "panel": "",
    "user": {},
    "history_user": null,
    "rank": [],
    "score": [],
    "compact": false,

}) {

    // 导入模板
    let svg = readTemplate('template/Panel_A4.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_me = /(?<=<g id="Me_Card_A1">)/;
    const reg_bp_list = /(?<=<g id="List_Card_H">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA4-1\);">)/;

    const scores = data.score ?? []

    // 面板文字
    let panel_name

    switch (data?.panel) {
        case "PS": {
            panel_name = getPanelNameSVG('Passed Scores (!ymp)', 'PS')
        } break;
        case "RS": {
            panel_name = getPanelNameSVG('Recent Scores (!ymr)', 'RS');
        } break;
        case "SS": {
            panel_name = getPanelNameSVG('Beatmap Scores (!ymss)', 'SS');
        } break;
        default: {
            panel_name = getPanelNameSVG('Multi Scores (!ymps / !ymrs)', 'SS');
        } break;
    }

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const me_card_a1 = await card_A1(await PanelGenerate.user2CardA1(data.user, data?.history_user));
    svg = setSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入C或I4卡

    if (data?.compact === true) {
        const params = []

        await Promise.allSettled(
            scores.map((v, i) => {
                return PanelGenerate.score2CardI4(v, data.rank[i])
            })
        ).then(results => thenPush(results, params))

        const card_I4s = params.map((param) => {
            return card_I4(param)
        })

        // 插入图片和部件（新方法
        svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

        // 计算面板高度
        // const row_total = Math.ceil((card_Is?.length || 0) / 2);

        const panel_height = getPanelHeight(card_I4s?.length, 130, 5, 290, 15);
        const card_height = panel_height - 290;

        svg = setText(svg, panel_height, reg_panelheight);
        svg = setText(svg, card_height, reg_cardheight);

        //插入C卡
        let string_I4s = ''

        for (let i = 0; i < card_I4s.length; i++) {
            const ix = i % 5;
            const iy = Math.floor(i / 5);

            const x = 40 + ix * 372;
            const y = 330 + iy * 145;

            string_I4s += getSvgBody(x, y, card_I4s[i])
        }

        svg = setText(svg, string_I4s, reg_bp_list);
    } else {
        const params = []

        await Promise.allSettled(
            scores.map((v, i) => {
                return PanelGenerate.score2CardC(v, data.rank[i])
            })
        ).then(results => thenPush(results, params))

        const card_Cs = params.map((param) => {
            return card_C(param)
        })

        // 插入图片和部件（新方法
        svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

        // 计算面板高度
        const rowTotal = Math.ceil((card_Cs?.length || 0) / 2);

        const panel_height = getPanelHeight(card_Cs?.length, 110, 2, 290, 40);
        const card_height = panel_height - 290;

        svg = setText(svg, panel_height, reg_panelheight);
        svg = setText(svg, card_height, reg_cardheight);

        //天选之子C卡提出来
        const luckyDog = (card_Cs.length % 2 === 1) ? card_Cs.pop() : '';
        svg = setSvgBody(svg, 510, 330 + (rowTotal - 1) * 150, luckyDog, reg_bp_list);

        //插入C卡
        let string_Cs = ''

        for (let i = 0; i < card_Cs.length; i++) {
            const ix = (i + 1) % 2;
            const iy = Math.floor(i / 2);

            const x = (ix === 1) ? 40 : 980;
            const y = 330 + iy * 150;

            string_Cs += getSvgBody(x, y, card_Cs[i])
        }

        svg = setText(svg, string_Cs, reg_bp_list);
    }

    return svg.toString();
}