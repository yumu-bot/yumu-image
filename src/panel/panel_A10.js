import {
    exportJPEG,
    getPanelNameSVG,
    setSvgBody,
    setText,
    setCustomBanner, getPanelHeight, readNetImage
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A1} from "../card/card_A1.js";
import {card_H3} from "../card/card_H3.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A10(data);
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
        const svg = await panel_A10(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 主页奖牌
 * !bd
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A10(
    data = {
        user: {
            badges: []
        }
    }
) {
    // 提前准备
    const user = data.user
    const badges = user.badges || []

    // 计算面板高度
    const panel_height = getPanelHeight(badges.length, 110, 2, 290, 40, 40)
    const card_height = panel_height - 290

    // 导入模板
    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="${panel_height}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 ${panel_height}">
    <defs>
        <clipPath id="clippath-PA10-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PA10-2">
            <rect x="480" y="330" width="1410" height="240" rx="0" ry="0" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Banner">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: #1c1719;"/>
        <g style="clip-path: url(#clippath-PA10-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="${card_height}" rx="20" ry="20" style="fill: #2a2226;"/>
    </g>
    <g id="Main_Card">
    </g>
    <g id="Body_Card">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: #382e32;"/>
    </g>
    <g id="Index">
    </g>
</svg>
`
    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_body = /(?<=<g id="Body_Card">)/;
    const reg_main = /(?<=<g id="Main_Card">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA10-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Badge (!ymbd)', 'BD');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 主卡
    svg = setSvgBody(svg, 40, 40, await card_A1(await PanelGenerate.user2CardA1(user)), reg_main);

    // 队员
    for (const i in badges) {
        const v = badges[i]

        const x = i % 2
        const y = Math.floor(i / 2)

        const member = await card_H3(await PanelGenerate.badge2CardH3(v, parseInt(i) + 1))

        svg = setSvgBody(svg, 40 + 940 * x, 330 + 150 * y, member, reg_body)
    }

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, reg_banner, await readNetImage(data.banner));

    return svg.toString();
}