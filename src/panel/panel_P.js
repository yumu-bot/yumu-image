import {
    exportJPEG, getPanelNameSVG, implantImage, implantSvgBody,
    readTemplate,
    replaceText,
} from "../util/util.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {card_Alpha} from "../card/card_Alpha.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_P(data);
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
        const svg = await panel_P(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_P(data = {
    user: {},
    markdown: null,
    width: 1840,
    name: ""
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_P.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_alpha = /(?<=<g id="CardAlpha">)/;
    const reg_card_a1 = /(?<=<g id="CardA1">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PP-1\);">)/;

    // 面板文字
    const panel_name = getPanelName(data?.name);

    // 插入 Alpha 卡
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user, null));

    // 插入 Alpha 卡
    const markdown = data?.markdown || "# error: \n If you see this line of text, please afk as soon as possible. \n\n Azer isn't so great? Are you kidding me? When was the last time you saw a player with such aim ability and movement with a tablet? Alex puts the game in another level, and we will be blessed if we ever see a player with his skill and passion for the game again. Cookiezi breaks records. Rafis breaks records. Azer breaks the rules. You can keep your statistics. I prefer the magic.";

    const alpha = await card_Alpha(markdown, data.width);


    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 计算面板高度

    const height = alpha.height;
    const width = alpha.width

    let panelHeight, cardHeight;

    if (height > 0) {
        panelHeight = 330 + height + 40;
        cardHeight = 40 + height + 40;
    } else {
        panelHeight = 1080;
        cardHeight = 790;
    }

    // 插入图片和部件（新方法
    svg = implantImage(svg, width, height, (1920 - width) / 2, 330, 1, alpha.image, reg_alpha);
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    return svg.toString();
}

function getPanelName(name = ""){
    switch (name) {
        case "help": return getPanelNameSVG('Help', 'H', 'v0.4.0 UU');
        default: return getPanelNameSVG('Markdown Messages', 'MD', 'v0.4.0 UU');
    }
}