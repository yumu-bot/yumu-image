import {
    exportJPEG, getPanelHeight, getPanelNameSVG, implantSvgBody,
    readTemplate, putCustomBanner,
    replaceText,
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A4(data);
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
        const svg = await panel_A4(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * bp/tbp 多成绩面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A4(data = {
    "user": {},
    "scores": [],
    "rank": [1,3,4,5,6],
    "panel" : "",

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

    // 面板文字
    let panel_name

    switch (data?.panel) {
        case "T": {
            panel_name = getPanelNameSVG('Today Bests (!ymt)', 'T', 'v0.5.0 DX');
        } break;
        case "BS": {
            panel_name = getPanelNameSVG('Best Scores (!ymbs)', 'BS', 'v0.5.0 DX');
        } break;
        case "BQ": {
            panel_name = getPanelNameSVG('Best Scores Query (!ymbq)', 'BQ', 'v0.5.0 DX');
        } break;
        default: {
            getPanelNameSVG('Today BP / BP (!ymt / !ymb)', 'B', 'v0.5.0 DX');
        } break;
    }

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1卡
    const me_card_a1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = implantSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入H卡
    let cardHs = [];
    for (const i in data.scores) {
        const f = await card_H(await PanelGenerate.bp2CardH(data.scores[i], data.rank[i], false));

        cardHs.push(f);
    }

    // 插入图片和部件（新方法
    svg = putCustomBanner(svg, reg_banner, data.me?.profile?.banner);

    // 计算面板高度
    const rowTotal = (cardHs !== []) ? Math.ceil(cardHs.length / 2) : 0;

    const panelHeight = getPanelHeight(cardHs?.length, 110, 2, 290, 40, 40);
    const cardHeight = panelHeight - 290;

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    //天选之子H卡提出来
    const tianxuanzhizi = (cardHs.length % 2 === 1) ? cardHs.pop() : '';
    svg = implantSvgBody(svg, 510, 330 + (rowTotal - 1) * 150, tianxuanzhizi, reg_bp_list);

    //插入H卡
    for (let i = 0; i < cardHs.length; i++) {
        const ix = (i + 1) % 2;
        const iy = Math.floor(i / 2);

        const x = (ix === 1) ? 40 : 980;
        const y = 330 + iy * 150;

        svg = implantSvgBody(svg, x, y, cardHs[i], reg_bp_list);
    }

    return svg.toString();
}