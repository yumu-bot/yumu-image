import {
    exportJPEG, getPanelHeight, getPanelNameSVG, setSvgBody,
    readTemplate, setCustomBanner,
    setText, getNowTimeStamp, getSvgBody, thenPush,
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
    "panel": "",
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
    const request_time = 'scores count: ' + ((data?.scores || []).length || 0 )+ ' // request time: ' + getNowTimeStamp();

    switch (data?.panel) {
        case "T": {
            panel_name = getPanelNameSVG('Today Bests (!ymt)', 'T', request_time);
        } break;
        case "BS": {
            panel_name = getPanelNameSVG('Best Scores (!ymbs)', 'BS', request_time);
        } break;
        default: {
            panel_name = getPanelNameSVG('Today BP / BP (!ymt / !ymb)', 'B', request_time);
        } break;
    }

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const me_card_a1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = setSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入H卡
    const params = []

    await Promise.allSettled(
        data.scores.map((v, i) => {
            return PanelGenerate.score2CardH(v, data.rank[i], true)
        })
    ).then(results => thenPush(results, params))

    const cardHs = params.map((param) => {
        return card_H(param)
    })

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, reg_banner, data.me?.profile?.banner);

    // 计算面板高度
    const rowTotal = (cardHs !== []) ? Math.ceil(cardHs.length / 2) : 0;

    const panelHeight = getPanelHeight(cardHs?.length, 110, 2, 290, 40, 40);
    const cardHeight = panelHeight - 290;

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    //天选之子H卡提出来
    const luckyDog = (cardHs.length % 2 === 1) ? cardHs.pop() : '';
    svg = setSvgBody(svg, 510, 330 + (rowTotal - 1) * 150, luckyDog, reg_bp_list);

    //插入H卡
    let stringHs = ''

    for (let i = 0; i < cardHs.length; i++) {
        const ix = (i + 1) % 2;
        const iy = Math.floor(i / 2);

        const x = (ix === 1) ? 40 : 980;
        const y = 330 + iy * 150;

        stringHs += getSvgBody(x, y, cardHs[i])
    }

    svg = setText(svg, stringHs, reg_bp_list);

    return svg.toString();
}