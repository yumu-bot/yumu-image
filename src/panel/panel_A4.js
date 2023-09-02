import {
    exportJPEG, getPanelNameSVG, getRandomBannerPath,
    implantImage,
    implantSvgBody,
    PanelGenerate, readTemplate,
    replaceText,
} from "../util.js";
import {card_H} from "../card/card_H.js";
import {card_A1} from "../card/card_A1.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A4(data);
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
        const svg = await panel_A4(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_A4(data = {
    "me": {
        "id": 17064371,
        "pp": 6279.61,
        "username": "-Spring Night-",
        "occupation": null,
        "discord": null,
        "interests": null,
        "playCount": 36485,
        "globalRank": 30495,
        "countryRank": 529,
        "accuracy": 98.3481,
        "levelCurrent": 101,
        "levelProgress": 15,
        "bot": false,
        "maxCombo": 3430,
        "playTime": 4617717,
        "totalHits": 17074899,
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
        "playmode": "OSU",
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
            "countryCode": "TW",
            "countryName": "Taiwan"
        },
    },

    "bps": [
        {
            "accuracy" : 0.9940625,
            "mods" : [ ],
            "passed" : true,
            "perfect" : false,
            "pp" : 373.032,
            "rank" : "S",
            "replay" : false,
            "score" : 80666662,
            "statistics" : {
                "pp" : null,
                "ss" : null,
                "ssh" : null,
                "s" : null,
                "sh" : null,
                "a" : null,
                "ranked" : null,
                "count_50" : 1,
                "count_100" : 13,
                "count_300" : 1586,
                "count_geki" : 370,
                "count_katu" : 12,
                "count_miss" : 0,
                "ranked_score" : null,
                "total_score" : null,
                "hit_accuracy" : null,
                "play_count" : null,
                "play_time" : null,
                "total_hits" : null,
                "maximum_combo" : null,
                "is_ranked" : null,
                "global_rank" : null,
                "replays_watched_by_others" : null,
                "country_rank" : null,
                "level_current" : null,
                "level_progress" : null,
                "country_rank_7k" : null,
                "country_rank_4k" : null,
                "rank_7k" : null,
                "rank_4k" : null,
                "pp_7k" : null,
                "pp_4k" : null
            },
            "user" : {
                "id" : 17064371,
                "cover" : null,
                "avatar" : "https://a.ppy.sh/17064371?1675693670.jpeg",
                "pmOnly" : false,
                "avatar_url" : "https://a.ppy.sh/17064371?1675693670.jpeg",
                "cover_url" : null,
                "default_group" : "default",
                "is_active" : true,
                "is_bot" : false,
                "is_deleted" : false,
                "is_online" : false,
                "is_supporter" : true,
                "last_visit" : [ 2023, 7, 29, 13, 45, 43, 833335215 ],
                "pm_friends_only" : false,
                "username" : "-Spring Night-",
                "country_code" : "TW",
                "country" : null,
                "statistics" : null
            },
            "weight" : {
                "percentage" : 100.0,
                "pp" : 373.032
            },
            "best_id" : 4457155373,
            "max_combo" : 2077,
            "user_id" : 17064371,
            "created_at" : [ 2023, 6, 17, 11, 24, 22 ],
            "id" : 4457155373,
            "mode" : "OSU",
            "mode_int" : 0,
            "beatmap" : {
                "id" : 2993974,
                "mode" : "osu",
                "status" : "ranked",
                "version" : "Starlight",
                "ar" : 9.4,
                "cs" : 3.8,
                "bpm" : 177.0,
                "convert" : false,
                "passcount" : 102749,
                "playcount" : 1209979,
                "ranked" : 1,
                "url" : "https://osu.ppy.sh/beatmaps/2993974",
                "beatMapRatingList" : null,
                "beatMapRetryList" : null,
                "beatMapFailedList" : null,
                "beatMapRating" : 0.0,
                "beatMapRetryCount" : 0,
                "beatMapFailedCount" : 0,
                "beatmapset_id" : 1456709,
                "difficulty_rating" : 6.17,
                "mode_int" : 0,
                "total_length" : 332,
                "hit_length" : 331,
                "user_id" : 12308923,
                "accuracy" : 9.0,
                "drain" : 5.0,
                "max_combo" : null,
                "is_scoreable" : true,
                "last_updated" : "2021-06-10T02:08:31Z",
                "checksum" : "05176a860021955266cc9d3b20e26850",
                "count_sliders" : 443,
                "count_spinners" : 2,
                "count_circles" : 1155,
                "fail" : null,
                "exit" : null,
                "beatmapset" : null
            },
            "beatmapset" : {
                "video" : false,
                "availabilityDownloadDisable" : null,
                "availabilityInformation" : null,
                "fromDatabases" : false,
                "id" : 1456709,
                "user_id" : 12308923,
                "bpm" : null,
                "artist" : "Kano",
                "artist_unicode" : "鹿乃",
                "title" : "Stella-rium (Asterisk MAKINA Remix)",
                "title_unicode" : "Stella-rium (Asterisk MAKINA Remix)",
                "creator" : "Vaporfly",
                "favourite_count" : 779,
                "nsfw" : false,
                "play_count" : 1209979,
                "preview_url" : "//b.ppy.sh/preview/1456709.mp3",
                "source" : "放課後のプレアデス",
                "status" : "ranked",
                "legacy_thread_url" : null,
                "tags" : null,
                "storyboard" : null,
                "covers" : {
                    "cover" : "https://assets.ppy.sh/beatmaps/1456709/covers/cover.jpg?1623290934",
                    "cover@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/cover@2x.jpg?1623290934",
                    "card" : "https://assets.ppy.sh/beatmaps/1456709/covers/card.jpg?1623290934",
                    "card@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/card@2x.jpg?1623290934",
                    "list" : "https://assets.ppy.sh/beatmaps/1456709/covers/list.jpg?1623290934",
                    "list@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/list@2x.jpg?1623290934",
                    "slimcover" : "https://assets.ppy.sh/beatmaps/1456709/covers/slimcover.jpg?1623290934",
                    "slimcover@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/slimcover@2x.jpg?1623290934"
                },
                "ratings" : null,
                "spotlight" : false,
                "beatmaps" : null,
                "ranked_date" : null
            },
            "create_at_str" : "2023-06-17T11:24:22Z"
        }
    ],
    "rank": [1,3,4,5,6],

}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_A4.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_me = /(?<=<g id="Me_Card_A1">)/;
    const reg_bp_list = /(?<=<g id="List_Card_H">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA4-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Today BP / BP (!ymt / !ymb)', 'BP', 'v0.3.1 EA');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1卡
    const me_card_a1 = await card_A1(await PanelGenerate.user2CardA1(data.me), true);
    svg = implantSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入H卡
    let cardHs = [];
    for (const i in data.bps) {
        const bp_generated = await PanelGenerate.bp2CardH(data.bps[i], data.rank[i]);
        const f = await card_H(bp_generated, true);

        cardHs.push(f);
    }

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8, getRandomBannerPath(), reg_banner);

    // 计算面板高度
    const rowTotal = (cardHs !== []) ? Math.ceil(cardHs.length / 2) : 0;
    let panelHeight, cardHeight;

    if (rowTotal >= 0) {
        panelHeight = 330 + 150 * rowTotal;
        cardHeight = 40 + 150 * rowTotal;
    } else {
        panelHeight = 1080;
        cardHeight = 790;
    }

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    //天选之子H卡提出来
    const tianxuanzhizi = (cardHs.length % 2 === 1) ? cardHs.pop() : '';
    svg = implantSvgBody(svg, 510, 330 + (rowTotal - 1) * 150, tianxuanzhizi, reg_bp_list);

    //插入H卡
    for (let i = 0; i < cardHs.length; i++) {
        const ix = (i + 1) % 2;
        const iy = Math.floor(i / 2);

        const x = (ix === 1) ? 40 : 980;
        const y = 330 + iy * 150;

        svg = implantSvgBody(svg, x, y, cardHs[i], reg_bp_list);
    }

    return svg.toString();
}