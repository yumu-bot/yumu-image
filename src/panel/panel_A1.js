import {
    exportJPEG, getPanelHeight, getPanelNameSVG,
    setSvgBody,
    readTemplate, setCustomBanner,
    setText
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A1(data);
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
        const svg = await panel_A1(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 好友列表
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A1(data = {
    me_card_A1: {
        "id": 17064371,
        "pp": 6279.61,
        "username": "-Spring Night-",
        "occupation": null,
        "discord": null,
        "interests": null,
        "playCount": 36485,
        "global_rank": 30495,
        "country_rank": 529,
        "accuracy": 98.3481,
        "level_current": 101,
        "levelProgress": 15,
        "bot": false,
        "max_combo": 3430,
        "play_time": 4617717,
        "total_hits": 17074899,
        "deleted": false,
        "online": false,
        "supporter": true,
        "avatar_url": "https://a.ppy.sh/17064371?1675693670.jpeg",
        "cover_url": "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
        "default_group": "default",
        "is_active": true,
        "is_bot": false,
        "is_deleted": false,
        "is_online": false,
        "is_supporter": true,
        "last_visit": null,
        "pm_friends_only": false,
        "mode": "OSU",
        "unranked_beatmapset_count": 1,
        "ranked_beatmapset_count": 0,
        "ranked_and_approved_beatmapset_count": 0,
        "beatmap_playcounts_count": 6765,
        "mapping_follower_count": 5,
        "has_supported": true,
        "join_date": "2020-05-15T14:10:44+00:00",
        "max_friends": 500,
        "comments_count": 11,
        "support_level": 2,
        "post_count": 2,
        "follower_count": 308,
        "raw": null,
        "statistics": {
            "pp": 6279.61,
            "ss": 37,
            "ssh": 10,
            "s": 1122,
            "sh": 62,
            "a": 1951,
            "ranked": true,
            "pp_7K": null,
            "pp_4K": null,
            "count_50": 210333,
            "count_100": 1884554,
            "count_300": 14980012,
            "count_geki": null,
            "count_katu": null,
            "count_miss": 493039,
            "ranked_score": 40881075082,
            "total_score": 142776445598,
            "hit_accuracy": 98.3481,
            "play_count": 36485,
            "play_time": 4617717,
            "total_hits": 17074899,
            "maximum_combo": 3430,
            "is_ranked": true,
            "global_rank": 30495,
            "replays_watched_by_others": 25,
            "country_rank": 529
        },
        "cover": {
            "url": "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
            "custom_url": "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg"
        },
        "country": {
            "country_code": "TW",
            "country_name": "Taiwan"
        },
    },

    friend_card_A1: [{
        "id": 17064371,
        "pp": 6279.61,
        "username": "-Spring Night-",
        "occupation": null,
        "discord": null,
        "interests": null,
        "playCount": 36485,
        "global_rank": 30495,
        "country_rank": 529,
        "accuracy": 98.3481,
        "level_current": 101,
        "levelProgress": 15,
        "bot": false,
        "max_combo": 3430,
        "play_time": 4617717,
        "total_hits": 17074899,
        "deleted": false,
        "online": false,
        "supporter": true,
        "avatar_url": "https://a.ppy.sh/17064371?1675693670.jpeg",
        "cover_url": "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
        "default_group": "default",
        "is_active": true,
        "is_bot": false,
        "is_deleted": false,
        "is_online": false,
        "is_supporter": true,
        "last_visit": null,
        "pm_friends_only": false,
        "mode": "OSU",
        "unranked_beatmapset_count": 1,
        "ranked_beatmapset_count": 0,
        "ranked_and_approved_beatmapset_count": 0,
        "beatmap_playcounts_count": 6765,
        "mapping_follower_count": 5,
        "has_supported": true,
        "join_date": "2020-05-15T14:10:44+00:00",
        "max_friends": 500,
        "comments_count": 11,
        "support_level": 2,
        "post_count": 2,
        "follower_count": 308,
        "raw": null,
        "statistics": {
            "pp": 6279.61,
            "ss": 37,
            "ssh": 10,
            "s": 1122,
            "sh": 62,
            "a": 1951,
            "ranked": true,
            "pp_7K": null,
            "pp_4K": null,
            "count_50": 210333,
            "count_100": 1884554,
            "count_300": 14980012,
            "count_geki": null,
            "count_katu": null,
            "count_miss": 493039,
            "ranked_score": 40881075082,
            "total_score": 142776445598,
            "hit_accuracy": 98.3481,
            "play_count": 36485,
            "play_time": 4617717,
            "total_hits": 17074899,
            "maximum_combo": 3430,
            "is_ranked": true,
            "global_rank": 30495,
            "replays_watched_by_others": 25,
            "country_rank": 529
        },
        "cover": {
            "url": "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
            "custom_url": "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg"
        },
        "country": {
            "country_code": "TW",
            "country_name": "Taiwan"
        },
    }],

    type: "null"
}) {
    let svg = readTemplate('template/Panel_A1.svg');
    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_me_card_a1 = /(?<=<g id="Me_Card_A1">)/;
    let reg_friend_card_a1 = /(?<=<g id="Friend_Card_A1">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA1-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Friends (!ymf)', 'F', 'v0.5.0 DX');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const me_cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.me_card_A1));

    let friend_cardA1s = [];

    for (const i in data.friend_card_A1) {
        const f = await card_A1(await PanelGenerate.microUser2CardA1(data.friend_card_A1[i], data?.type, true));
        friend_cardA1s.push(f);
    }

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, reg_banner, data.me_card_A1?.profile?.banner);

    svg = setSvgBody(svg, 40, 40, me_cardA1, reg_me_card_a1);

    for (const i in friend_cardA1s) {
        const x = i % 4;
        const y = Math.floor(i / 4);

        svg = setSvgBody(svg, 40 + 470 * x, 330 + 250 * y, friend_cardA1s[i], reg_friend_card_a1);
    }

    // 计算面板高度
    const panelHeight = getPanelHeight(friend_cardA1s?.length, 210, 4, 290, 40);
    const cardHeight = panelHeight - 290;

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    return svg.toString();

}
/*
function getDXRatingBGPath(pp = 0) {
    let path = '';
    if (typeof pp !== 'number') pp = 0;

    if (pp >= 15000) path = 'backlight-rainbow.png';
    else if (pp >= 14500) path = 'backlight-platinum.png';
    else if (pp >= 14000) path = 'backlight-golden.png';
    else if (pp >= 13000) path = 'backlight-silver.png';
    else if (pp >= 12000) path = 'backlight-bronze.png';
    else if (pp >= 10000) path = 'backlight-purple.png';
    else if (pp >= 7000) path = 'backlight-red.png';
    else if (pp >= 4000) path = 'backlight-yellow.png';
    else if (pp >= 2000) path = 'backlight-green.png';
    else if (pp >= 1000) path = 'backlight-blue.png';
    else return '';

    return getExportFileV3Path(path);
}

 */