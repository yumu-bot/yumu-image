import {
    exportJPEG,
    getNowTimeStamp, getPanelHeight, getPanelNameSVG,
    getSvgBody,
    readTemplate, setCustomBanner,
    setSvgBody,
    setText, setTexts,
    thenPush
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_C} from "../card/card_C.js";
import {torusBold} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A15(data);
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
        const svg = await panel_A15(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 探索谱面
 * !e
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A15(
    data = {

    }
) {

    // 导入模板
    let svg = readTemplate('template/Panel_A4.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_me = /(?<=<g id="Me_Card_A1">)/;
    const reg_bp_list = /(?<=<g id="List_Card_H">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA4-1\);">)/;

    const scores = data.scores ?? []

    // 面板文字
    const request_time = 'scores count: ' + scores.length + ' // request time: ' + getNowTimeStamp();

    // 插入文字
    svg = setText(svg, getPanelNameSVG('Top plays (!ymtp)', 'TP', request_time), reg_index);

    // 导入A1卡
    const me_card_a1 = await card_A1(await PanelGenerate.user2CardA1(null));
    svg = setSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入C卡
    const params = []

    const first_rank = data?.first_score_rank ?? 1


    await Promise.allSettled(
        scores.map((v, i) => {
            return PanelGenerate.topScore2CardC(v, first_rank + i, true)
        })
    ).then(results => thenPush(results, params))

    const card_Cs = params.map((param) => {
        return card_C(param)
    })

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, data.me?.profile?.banner, reg_banner);

    // 计算面板高度
    const rowTotal = (card_Cs !== []) ? Math.ceil(card_Cs.length / 2) : 0;

    const panel_height = getPanelHeight(card_Cs?.length, 110, 2, 290, 40, 40);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    //天选之子H卡提出来
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

    const page = torusBold.getTextPath(
        'page: ' + (data.page || 0) + ' of ' + (data.max_page || 0), 1920 / 2, panel_height - 15, 20, 'center baseline', '#fff', 0.6
    )

    svg = setTexts(svg, [string_Cs, page], reg_bp_list);

    return svg.toString();


}