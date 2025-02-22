import {
    exportJPEG,
    getPanelNameSVG,
    implantSvgBody,
    replaceText,
    putCustomBanner, getPanelHeight, readNetImage, implantImage, getImageFromV3
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A2} from "../card/card_A2.js";
import {card_A1} from "../card/card_A1.js";
import {card_Alpha} from "../card/card_Alpha.js";

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
        id: 657,
        name: 'Love Manga Time Kirara',
        abbr: 'LMTK',
        formed: 'February 2025',
        users: [
            {
                id: 32596858,
                username: 'Qleen0723',
                active: true,
                user_id: 32596858,
                osu_mode: 'DEFAULT',
                default_osu_mode: 'DEFAULT',
                bot: false,
                current_osu_mode: 'DEFAULT',
                online: false,
                deleted: false,
                supporter: true,
                avatar_url: 'https://a.ppy.sh/32596858?1738645696.jpeg',
                country_code: 'JP',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: false,
                is_supporter: true,
                last_visit: '2025-02-22T11:17:51Z',
                pm_friends_only: false,
                country: [Object],
                cover: [Object],
                groups: [],
                team: [Object]
            }
        ],
        ruleset: 'OSU',
        banner: 'https://assets.ppy.sh/teams/header/657/a1e254236ea098432b717eb5a1dfcf5c00e29381aff5ae851c5a3784ad8c417f.jpeg',
        flag: 'https://assets.ppy.sh/teams/flag/657/6153f4c6cb602578c2be9c1ee87ba189245656c0561afda3e288593de91159b1.jpeg',
        application: 'Open',
        description: 'JP<br />このteamは、まんがタイムきららおよびその姉妹誌内の作品が好きな方のためのteam(全ゲームモード対応、ランク制限なし)となっています。<br />そのため、このteamに参加リクエストを送ると大体の方はOsu!内のDMにて、私(Qleen0723)から、クイズか愛を証明してほしいと伝えます。<br />愛の証明は画像で行います。これに合格すれば加入することができます。(ただし私のようにmapperの方でまんがタイムきららおよびその姉妹誌内の作品をソースとした譜面の製作経験がある方(Ranked,Lovedかそうでないかは無関係です)<br />あるいは、Osu!に貼ってあるX(Twitter)のリンクがあり、その上資格が十分だと判断できる投稿内容があるなどの場合はこれなしで、入ることができる場合があります。)<br />なお、このteam内の方からの招待である場合はこれらの審査なしで入ることが可能です。<br />愛の証明の例<br /><a rel="nofollow" href="https://ibb.co/hx5LMgrV"><img alt="" src="https://i.ppy.sh/53417e2654fb22a4bc6c8016c8e1f67cce7646a6/68747470733a2f2f692e6962622e636f2f32303257364652642f323032352d30322d32302d3230303534372e706e67" loading="lazy" style="aspect-ratio: 1.3352; width: 1705px;" /></a><br />また、こteamでは、英語圏の方の加入も許可してます。あらかじめご了承ください。<br />ルール<br />1.まんがタイムきららおよびその姉妹誌内の作品が好きであること。複数作品でも、特定の一つの作品でも、ガチな方も、ライトな方も歓迎します。ただし、そういうのが全くない方はお断りさせていただきます。<br /><br />2.team内でのチャットは公序良俗に反しないようにお願いします。具体的には、他プレイヤーはもちろん、漫画の作者などへの誹謗中傷も禁止となっております。<br /><br />3.このルールに従わない場合かつ、明らかな悪意のあるものでない場合、一回目は私(Qleen0723)からDMにて警告とその理由を伝えます。二回目あるいは明らかな悪意がある場合は私(Qleen0723)から、kickしたことと、理由をDMにて伝えます。<br /><br />4.これらのルールは私(Qleen0723)により改変および追加される場合があります。<br /><br />EN<br />This team is for people who like Manga Time Kirara and its sister magazines.(For all game mode,All rank) Therefore, when you send a request to join this team, I (Qleen0723) will usually tell you in a DM in Osu! Proof of love will be done with a picture. If you pass this, you can join. (However, if    you are a mapper like me and have experience in creating music scores based on works in Manga Time Kirara and its sister magazines (Ranked, Loved or not is irrelevant), or if you have a link to X (Twitter) posted on Osu! X (Twitter) link posted on Osu! and you have posted enough content to qualify).Please note that if you are invited by someone in this TEAM, you can enter without these examinations.<br />Examples of Proof of Love<br /><a rel="nofollow" href="https://ibb.co/hx5LMgrV"><img alt="" src="https://i.ppy.sh/53417e2654fb22a4bc6c8016c8e1f67cce7646a6/68747470733a2f2f692e6962622e636f2f32303257364652642f323032352d30322d32302d3230303534372e706e67" loading="lazy" style="aspect-ratio: 1.3352; width: 1705px;" /></a><br />This team is Japanese main team, Please understand in advance.<br />Rules<br />1. You must be a fan of Manga Time Kirara and its sister magazines. Whether it is multiple works or one specific work, both hardcore and light-hearted people are welcome. However, we will decline those who are not like that at all.<br /><br />2. Please do not chat in the TEAM in a way that is offensive to public order and morals. Specifically, slander and libel against other players as well as comic book authors, etc. are prohibited.<br /><br />3. If you do not follow this rule and it is not obviously malicious, I (Qleen0723) will warn you and give you a reason for the warning via DM the first time. The second time, or if it is clearly malicious, I (Qleen0723) will DM you to let you know that you have been kicked and why.<br /><br />4.These rules may be changed or added by me (Qleen0723).<br /><br />5.It was Translated with DeepL.com, If feel some difficult to understand, Please tell me.'
    }) {

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
    const panel_name = getPanelNameSVG('Team (!ymtm)', 'TM', 'v0.5.1 DX');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 主卡
    svg = implantSvgBody(svg, 40, 40, card_A2(await PanelGenerate.team2CardA2(data)), reg_main);

    // 介绍

    const markdown = data.description
        //.replaceAll('<br />', '\n\n')
        .replaceAll(new RegExp("<\/?[\\s\\S]*?\/?>", 'g'), '') // 必须用懒惰，不然等死吧

    const alpha = markdown.length > 0 ? await card_Alpha(markdown, 1370, 0) : null

    /*
    const image = `<image width="1410" height="${}" transform="translate(510 320)" xlink:href="${alpha.image}" style="opacity: 1" vector-effect="non-scaling-stroke"/>`
    svg = replaceText(svg, image, reg_des)

     */

    svg = (markdown.length > 0) ?
        implantImage(svg, 1410, Math.min(Math.round(alpha.height * 1410 / 1370), 240),
        510, 320, 1, alpha.image, reg_des, 'xMidYMin slice')
        : svg

    // 队长
    svg = implantSvgBody(svg, 40, 330, await card_A1(await PanelGenerate.microTeamMember2CardA1(leader, true)), reg_body)

    svg = implantImage(svg, 510, 290, 0, 290, 1, getImageFromV3('backlight-golden.png'), reg_body)

    // 队员
    for (const i in members) {
        const v = members[i]

        const x = i % 4
        const y = Math.floor(i / 4)

        const member = await card_A1(await PanelGenerate.microTeamMember2CardA1(v, false))

        svg = implantSvgBody(svg, 40 + 450 * x, 330 + 250 + 250 * y, member, reg_main);
    }

    // 插入图片和部件（新方法
    svg = putCustomBanner(svg, reg_banner, await readNetImage(data.banner));

    return svg.toString();
}