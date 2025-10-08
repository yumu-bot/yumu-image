import {
    exportJPEG,
    getPanelHeight,
    getPanelNameSVG,
    readNetImage,
    setCustomBanner,
    setSvgBody,
    setText
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {torusBold} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A11(data);
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
        const svg = await panel_A11(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 客串谱师信息面板
 * !gd xxx #page
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A11(data = {
    user: {},
    guest_differs: [
        {
            user: {
                cover: {
                    url: 'https://assets.ppy.sh/user-profile-covers/416662/ab631986bb61f181551b8dbea87285874d09a920584bd5ff0250410b2b44a9a3.jpeg',
                    custom_url: 'https://assets.ppy.sh/user-profile-covers/416662/ab631986bb61f181551b8dbea87285874d09a920584bd5ff0250410b2b44a9a3.jpeg'
                },
                user_id: 416662,
                avatar_url: 'https://a.ppy.sh/416662?1718654531.jpeg',
                default_group: 'default',
                id: 416662,
                is_active: false,
                is_bot: false,
                is_deleted: false,
                is_online: false,
                is_supporter: false,
                pm_friends_only: false,
                username: 'Hollow Wings',
                country_code: 'CN',
                country: { code: 'CN', name: 'China' },
                is_following: false,
                statistics_rulesets: {}
            },
            received: 0,
            received_ranked: 0,
            sent: 5,
            sent_ranked: 5,
        }
    ],
    page: 1,
    max_page: 1
}) {
    // 提前准备
    const user = data.user
    const guests = data.guest_differs || []

    // 计算面板高度
    const panel_height = getPanelHeight(guests.length, 210, 4, 290, 40, 40)
    const card_height = panel_height - 290

    // 导入模板
    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="${panel_height}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 ${panel_height}">
    <defs>
        <clipPath id="clippath-PA11-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PA11-2">
            <rect x="480" y="330" width="1410" height="240" rx="0" ry="0" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Banner">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: #1c1719;"/>
        <g style="clip-path: url(#clippath-PA11-1);">
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
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA11-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Guest Difficulty Owners (!ymgd)', 'GD');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    const page = torusBold.getTextPath(
        'page: ' + (data.page || 0) + ' of ' + (data.max_page || 0), 1920 / 2, panel_height - 15, 20, 'center baseline', '#fff', 0.6
    )

    svg = setText(svg, page, reg_body)

    // 主卡
    svg = setSvgBody(svg, 40, 40, await card_A1(await PanelGenerate.mapper2CardA1(user)), reg_main);

    // 队员
    for (const i in guests) {
        const v = guests[i]

        const x = i % 4
        const y = Math.floor(i / 4)

        const member = await card_A1(await PanelGenerate.guest2CardA1(v))

        svg = setSvgBody(svg, 40 + 470 * x, 330 + 250 * y, member, reg_body)
    }

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, reg_banner, await readNetImage(user.banner));

    return svg.toString()
}