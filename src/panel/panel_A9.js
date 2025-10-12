import {
    exportJPEG,
    getPanelNameSVG,
    setSvgBody,
    setText,
    setCustomBanner,
    getPanelHeight,
    readNetImage,
    setImage,
    getImageFromV3,
    isNotEmptyString,
    thenPush,
    getSvgBody,
    getImage
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A2} from "../card/card_A2.js";
import {card_A1} from "../card/card_A1.js";
import {component_MD} from "../component/component_MD.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A9(data);
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
        const svg = await panel_A9(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 战队信息
 * !tm
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A9(
    data = {
        id: 2789,
        name: 'sana',
        abbr: 'sana',
        formed: 'February 2025',
        banner: 'https://assets.ppy.sh/teams/header/2789/25c711a5e9a294035cab85a020f27db99156120d68fe982a1c274a069e66878d.jpeg',
        flag: 'https://assets.ppy.sh/teams/flag/2789/b4c19754b39eeebab2ff7dc3b809450293227248ce41cf46bef2ef172739d917.gif',
        users: [],
        ruleset: 'OSU',
        application: 'Open',
        rank: 5276,
        pp: 5689,
        ranked_score: 10003720968,
        play_count: 29348,
        members: 1,
        description: 'sana yuki'
    }
) {

    // 提前准备
    const members = data.users
    const leader = members.shift()

    // 计算面板高度
    const panel_height = getPanelHeight(members.length, 210, 4, 290, 40, 40) + 250
    const card_height = panel_height - 290

    // 导入模板
    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="${panel_height}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 ${panel_height}">
    <defs>
        <clipPath id="clippath-PA9-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PA9-2">
            <rect x="480" y="330" width="1410" height="240" rx="0" ry="0" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Banner">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: #1c1719;"/>
        <g style="clip-path: url(#clippath-PA9-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="${card_height}" rx="20" ry="20" style="fill: #2a2226;"/>
    </g>
    <g id="Main_Card">
    </g>
    <g id="Body_Card">
    </g>
    <g id="Description_Card" style="clip-path: url(#clippath-PA9-2);">
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
    const reg_des = /(?<=<g id="Description_Card" style="clip-path: url\(#clippath-PA9-2\);">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA9-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Team (!ymtm)', 'TM');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 主卡
    svg = setSvgBody(svg, 40, 40, card_A2(await PanelGenerate.team2CardA2(data)), reg_main);

    // 介绍
    if (isNotEmptyString(data?.description)) {
        const markdown = data.description
            .replaceAll("<br />", " ")
            .replaceAll(new RegExp("<\/?[\\s\\S]*?\/?>", 'g'), '') // 必须用懒惰，不然等死吧
        const alpha = (markdown.length > 0) ? await component_MD(markdown, 1370, 0) : {}

        /*
        const image = `<image width="1410" height="${}" transform="translate(510 320)" xlink:href="${alpha.image}" style="opacity: 1" vector-effect="non-scaling-stroke"/>`
        svg = replaceText(svg, image, reg_des)

         */

        svg = (markdown.length > 0) ?
            setImage(svg, 510, 320, 1410, Math.min(Math.round(alpha.height * 1410 / 1370), 240), alpha.image, reg_des, 1, 'xMidYMin slice')
            : svg
    }

    // 队长
    svg = setSvgBody(svg, 40, 330, await card_A1(await PanelGenerate.microTeamMember2CardA1(leader, true)), reg_body)

    svg = setImage(svg, 0, 290, 510, 290, getImageFromV3('backlight-golden.png'), reg_body, 1)

    // 队员
    const paramA1s = []

    await Promise.allSettled(
        members.map((member) => {
            return PanelGenerate.microTeamMember2CardA1(member, false)
        })
    ).then(results => thenPush(results, paramA1s))


    const cardA1s = []

    await Promise.allSettled(
        paramA1s.map((param) => {
            return card_A1(param)
        })
    ).then(results => thenPush(results, cardA1s))

    let stringA1s = ''
    let imageA1s = ''

    for (const i in cardA1s) {
        const a1 = cardA1s[i]

        const x = i % 4
        const y = Math.floor(i / 4)

        stringA1s += getSvgBody(40 + 470 * x, 330 + 250 + 250 * y, a1)

        if (members[i]?.is_online === true) {
            imageA1s += getImage(40 + 470 * x - 40, 330 + 250 + 250 * y - 40, 510, 290, getImageFromV3('backlight-green.png'), 1)
        }
    }

    svg = setText(svg, stringA1s, reg_body)
    svg = setText(svg, imageA1s, reg_body)

    /*
    for (const i in members) {
        const v = members[i]

        const x = i % 4
        const y = Math.floor(i / 4)

        const member = await card_A1(await PanelGenerate.microTeamMember2CardA1(v, false))

        svg = setSvgBody(svg, 40 + 470 * x, 330 + 250 + 250 * y, member, reg_body)

        if (v?.is_online === true) {
            svg = setImage(svg, 40 + 470 * x - 40, 330 + 250 + 250 * y - 40, 510, 290, getImageFromV3('backlight-green.png'), reg_body, 1)
        }
    }

     */

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, await readNetImage(data.banner), reg_banner);

    return svg.toString();
}