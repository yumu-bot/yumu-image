import {
    exportJPEG,
    getPanelNameSVG,
    setSvgBody,
    setText,
    readTemplate, getPanelHeight, thenPush, getSvgBody, setImage
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A1} from "../card/card_A1.js";
import {card_C} from "../card/card_C.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {torusBold} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A12(data);
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
        const svg = await panel_A12(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 最多游玩 E
 !e:mp
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A12(
    data = {
        "user": {},
        "most_played": [],
        "page": 1,
        "max_page": 1,
    }
) {
    // 导入模板
    let svg = readTemplate('template/Panel_A4.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_me = /(?<=<g id="Me_Card_A1">)/;
    const reg_most_list = /(?<=<g id="List_Card_H">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA4-1\);">)/;

    // 面板文字
    let panel_name = getPanelNameSVG('Player Most Played (!yme)', 'EM')

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const me_card_a1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = setSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入H卡
    const params = []

    await Promise.allSettled(
        data.most_played.map((v, i) => {
            return PanelGenerate.mostPlayed2CardC(v, ((data?.page ?? 0) - 1) * 50 + i + 1)
        })
    ).then(results => thenPush(results, params))

    const card_cs = params.map((param) => {
        return card_C(param)
    })

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    // 计算面板高度
    const rowTotal = Math.ceil((card_cs?.length || 0) / 2);

    const panel_height = getPanelHeight(card_cs?.length, 110, 2, 290, 40);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    //天选之子H卡提出来
    const luckyDog = (card_cs.length % 2 === 1) ? card_cs.pop() : '';
    svg = setSvgBody(svg, 510, 330 + (rowTotal - 1) * 150, luckyDog, reg_most_list);

    //插入H卡
    let stringHs = ''

    for (let i = 0; i < card_cs.length; i++) {
        const ix = (i + 1) % 2;
        const iy = Math.floor(i / 2);

        const x = (ix === 1) ? 40 : 980;
        const y = 330 + iy * 150;

        stringHs += getSvgBody(x, y, card_cs[i])
    }

    svg = setText(svg, stringHs, reg_most_list);

    const page = torusBold.getTextPath(
        'page: ' + (data.page || 0) + ' of ' + (data.max_page || 0), 1920 / 2, panel_height - 15, 20, 'center baseline', '#fff', 0.6
    )

    svg = setText(svg, page, reg_most_list)

    return svg.toString();
}