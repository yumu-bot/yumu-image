import {
    exportJPEG, getPanelHeight, getPanelNameSVG, implantImage,
    implantSvgBody, readTemplate,
    replaceText,
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";

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
    "score": [],

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
        case "PS": {
            panel_name = getPanelNameSVG('Passed Scores (!ymp)', 'PS', 'v0.5.0 DX');
        } break;
        case "RS": {
            panel_name = getPanelNameSVG('Recent Scores (!ymr)', 'RS', 'v0.5.0 DX');
        } break;
        case "SS": {
            panel_name = getPanelNameSVG('Scores (!ymss)', 'SS', 'v0.5.0 DX');
        } break;
        default: {
            panel_name = getPanelNameSVG('Multi Scores (!ymps / !ymrs)', 'SS', 'v0.5.0 DX');
        } break;
    }

    // 导入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1卡
    const me_card_a1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = implantSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入H卡
    let cardHs = [];
    for (const i in data.score) {
        const v = data.score[i];

        const f = await card_H(
            await PanelGenerate.score2CardH(v, parseInt(i) + 1));
        cardHs.push(f);
    }

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 计算面板高度
    const rowTotal = Math.ceil((cardHs?.length || 0) / 2);

    const panelHeight = getPanelHeight(cardHs?.length, 110, 2, 290, 40);
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