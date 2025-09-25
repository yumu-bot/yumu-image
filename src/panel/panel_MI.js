import {
    exportJPEG, getPanelNameSVG, setImage,
    setSvgBody, readTemplate,
    setText, getSvgBody, thenPush
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {card_I3} from "../card/card_I3.js";
import {torusBold} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MI(data);
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
        const svg = await panel_MI(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * maimai 筛选的多成绩列表。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MI(data = {
    "user": {},
    "score": [{}],
    "page": 1,
    "max_page": 1,
    "type": "fc",
}) {

    let svg = readTemplate('template/Panel_MA.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_card_i = /(?<=<g id="CardI">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MA1-1\);">)/;

    // 面板文字
    let panel_name

    if (data?.type === 'fc') {
        panel_name = getPanelNameSVG('Maimai Full Combo Scores (!ymxc)', 'XC');
    } else if (data?.type === 'ap') {
        panel_name = getPanelNameSVG('Maimai All Perfect Scores (!ymxp)', 'XP');
    } else {
        panel_name = getPanelNameSVG('Maimai Multiple Scores (!ymx)', 'X');
    }

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.maimaiPlayer2CardA1(data.user));

    const scores = data?.score || []

    // 导入i卡
    let params = [];

    await Promise.allSettled(
        scores.map((s) => {
            return PanelGenerate.maiScore2CardI3(s)
        })
    ).then(results => thenPush(results, params))

    const cards = params.map((sd) => {return card_I3(sd)})

    let string_card = ''

    for (const i in cards) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        string_card += getSvgBody(40 + (352 + 20) * x, 330 + 150 * y, cards[i]);
    }

    svg = setText(svg, string_card, reg_card_i)

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath("maimai"), reg_banner, 0.8);

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    // 计算面板高度

    const i_height = Math.ceil(cards.length / 5) * 150

    const card_height = i_height + 80 - 20
    const panel_height = card_height + 290

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    const page = torusBold.getTextPath(
        'page: ' + (data.page || 0) + ' of ' + (data.max_page || 0), 1920 / 2, panel_height - 15, 20, 'center baseline', '#fff', 0.6
    )

    svg = setText(svg, page, reg_card_i)

    return svg.toString()
}