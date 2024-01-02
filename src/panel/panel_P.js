import {
    exportJPEG, getPanelNameSVG, implantImage, implantSvgBody,
    readTemplate,
    replaceText,
} from "../util/util.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {getCardAlpha} from "../card/card_Alpha.js";
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
    markdown: "can u hear me **hello**",
    width: 1840
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
    const panel_name = getPanelNameSVG('Help', 'H', 'v0.4.0 UU');

    // 插入 Alpha 卡
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(null, null), false);

    // 插入 Alpha 卡
    const markdown = "# BBCode\n" +
        "\n" +
        "**BBCode** is a [markup language](https://en.wikipedia.org/wiki/Markup_language) that is used in the osu! forums and, to a larger extent, the vast majority of forums on the Internet. Used to enable rich text formatting, it is made up of tags that surround text to denote formatting, attributes, embedding, and more. It is used in various places across the osu! website, such as forum posts, signatures, user pages, and beatmap descriptions.\n" +
        "\n" +
        "![The forum post editor with its buttons](img/editor.jpg?1 \"The edit box in the forums\")\n" +
        "\n" +
        "## Behaviour\n" +
        "\n" +
        "Clicking a markup button without highlighting any text will create a set of open and closed tags around the text cursor in the post editor. Highlighting the text before clicking a markup button will surround said text with the tags. \n" +
        "\n" +
        "Users, who wish to combine formatting onto a single section of text, can do so by placing BBCode tags inside of one another. However, the order and nesting of these tags **must be respected** when combining. Failure to do so will break the formatting.\n" +
        "\n" +
        "A set of correct and incorrect usages of nested tags is described below:\n" +
        "\n" +
        "- `[centre][b]text[/b][/centre]` is correct\n" +
        "- `[b][centre]text[/b][/centre]` is incorrect\n" +
        "\n" +
        "## Tags\n"


    const alpha = await getCardAlpha(markdown, data.width);


    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 计算面板高度

    const height = 0;

    let panelHeight, cardHeight;

    if (height > 0) {
        panelHeight = 330 + height;
        cardHeight = 40 + height;
    } else {
        panelHeight = 1080;
        cardHeight = 790;
    }

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1840, 790, 40, 330, 1, alpha, reg_alpha);
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    return svg.toString();
}