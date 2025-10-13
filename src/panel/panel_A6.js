import {
    exportJPEG,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    readTemplate,
    setText,
    getNowTimeStamp, EXPORT_FILE_V3,
} from "../util/util.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {component_MD} from "../component/component_MD.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import path from "path";

const path_util = path

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A6(data);
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
        const svg = await panel_A6(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 帮助面板, 新版
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A6(data = {
    user: null,
    markdown: null,
    width: 1840,
    name: ""
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_A6.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_alpha = /(?<=<g id="CardAlpha">)/;
    const reg_card_a1 = /(?<=<g id="CardA1">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PP-1\);">)/;

    // 面板文字
    const panel_name = getPanelName(data?.name);

    let path

    if (data?.name === 'help') {
        path = path_util.join(EXPORT_FILE_V3, 'Help')
    } else {
        path = null
    }

    // 插入 Alpha 卡
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user, null));

    // 插入 Alpha 卡
    const markdown = data?.markdown || "# error: \n\nIf you see this line of text, please **afk as soon as possible**. \n\n如果您看见了这张图片，请**尽快离开键盘**。\n\nAzer isn't so great? Are you kidding me? When was the last time you saw a player with such aim ability and movement with a tablet? Alex puts the game in another level, and we will be blessed if we ever see a player with his skill and passion for the game again. Cookiezi breaks records. Rafis breaks records. Azer breaks the rules. You can keep your statistics. I prefer the magic.\n\nAzer 这么大吗？你在跟我开玩笑吗？您上次看到平板电脑具有这样的瞄准能力和动作的玩家是什么时候？Alex 将游戏推上了另一个台阶，如果我们再次看到一个有技能和热情的玩家，我们将是很幸运的。Cookiezi 打破记录。Rafis 打破记录。Azer 违反了规则。您可以保留统计信息。我更喜欢魔术。\n\n---\n\n觉得挺内啥的，这种事说了你们也不懂，懂得都懂，关于这个事，我简单说两句，至于我的身份，你明白就行，总而言之，这个事呢，现在就是这个情况，具体的呢，大家也都看得到，我因为这个身份上的问题，也得出来说那么几句，可能，你听的不是很明白，但是意思就是那么个意思，我的身份呢，不知道的，你也不用去猜，这种事情见得多了，我只想说懂得都懂，不懂的我也不多解释，毕竟自己知道就好，细细品吧。你们也别来问我怎么了，利益牵扯太大，说了对你我都没好处，当不知道就行了，其余的我只能说这里面水很深，牵扯到很多东西。详细情况你们自己是很难找的，网上大部分已经删除干净了，所以我只能说懂得都懂。懂的人已经基本都获利上岸什么的了，不懂的人永远不懂，关键懂的人都是自己悟的，你也不知道谁是懂的人也没法请教，大家都藏着掖着生怕别人知道自己懂事，懂了就能收割不懂的，你甚至都不知道自己不懂。只是在有些时候，某些人对某些事情不懂装懂，还以为别人不懂。其实自己才是不懂的，别人懂的够多了，不仅懂，还懂的超越了这个范围，但是某些不懂的人让这个懂的人完全教不懂，所以不懂的人永远不懂，只能不懂装懂，别人说懂的都懂，只要点点头就行了，懂了吗？";

    const alpha = await component_MD(markdown, data.width, data?.height ?? 600, path);

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 计算面板高度

    const height = alpha?.height || 0;
    const width = alpha?.width || 1840;

    let panelHeight, cardHeight;

    if (height > 0) {
        panelHeight = 330 + height + 40;
        cardHeight = 40 + height + 40;
    } else {
        panelHeight = 1080;
        cardHeight = 790;
    }

    // 插入图片和部件（新方法
    svg = setImage(svg, (1920 - width) / 2, 330, width, height, alpha.image, reg_alpha, 1);
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    return svg.toString();
}

function getPanelName(name = ""){
    const request_time = 'request time: ' + getNowTimeStamp()

    switch (name) {
        case "group": return getPanelNameSVG('Group Mode', 'GM', request_time);
        case "service": return getPanelNameSVG('Service Count', 'SC', request_time);
        case "switch": return getPanelNameSVG('Service Switch', 'SW', request_time);
        case "wiki": return getPanelNameSVG('Wiki Page', 'W', request_time);
        case "help": return getPanelNameSVG('Help Page', 'H', request_time);
        default: return getPanelNameSVG('Markdown Page', 'MD', request_time);
    }
}