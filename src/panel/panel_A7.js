import {
    exportJPEG, getPanelHeight, getPanelNameSVG, setSvgBody,
    readTemplate, setCustomBanner,
    setText, thenPush, getSvgBody,
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {torusBold} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A7(data);
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
        const svg = await panel_A7(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * bf 理论最好成绩面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A7(data = {
    "user": {
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
        "pending_beatmapset_count": 1,
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
            "count_ss": 37,
            "count_ssh": 10,
            "count_s": 1122,
            "count_sh": 62,
            "count_a": 1951,
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

    "scores": [
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
                "count_ss" : null,
                "count_ssh" : null,
                "count_s" : null,
                "count_sh" : null,
                "count_a" : null,
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
                "pm_only" : false,
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
            "create_at_str" : "2023-06-17T11:24:22Z",

            fc_pp : 114.514,
            index: 68,
            index_after: 76,

        }
    ],

    page: 1,
    max_page: 1

    //ranks: []
}) {
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
    const panel_name = getPanelNameSVG('BP Fixed (!ymbf)', 'BF');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const a1 = await PanelGenerate.user2CardA1(data?.user)

    // 修改 A1 展示，让测试 PP 在下面
    const theoretical_pp = data?.pp || data?.user?.pp || 0;
    const delta = Math.round(theoretical_pp - data?.user?.pp);

    const right1 = delta > 1 ? '+' + delta + 'PP' : '';

    const me_card_a1 = await card_A1({...a1,
        right1: right1,
        right2: 'fixed "choked S / miss <= 1%"',
        right3b: Math.round(theoretical_pp).toString(),
        right3m: 'PP',
    });
    svg = setSvgBody(svg, 40, 40, me_card_a1, reg_me);

    // 导入H卡
    const paramHs = []

    await Promise.allSettled(
        data.scores.map((bp) => {
            return PanelGenerate.fixedBestScore2CardH(bp, bp?.index, bp?.index_after)
        })
    ).then(results => thenPush(results, paramHs))

    const cardHs = paramHs.map((card_h, i) => {
        const bp = data.scores[i]

        const deltaPP = Math.round(bp?.fc_pp - bp?.pp);

        return card_H({
            ...card_h,

            index_b: bp?.fc_pp > 0 ? Math.round(bp.fc_pp).toString() : '',
            index_l: (deltaPP > 0 ? '+' : '') + deltaPP + 'PP',
            index_l_size: 24,
        })
    })

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, reg_banner, data.user?.profile?.banner);

    // 计算面板高度
    const rowTotal = (cardHs !== []) ? Math.ceil(cardHs.length / 2) : 0;

    const panel_height = getPanelHeight(cardHs?.length, 110, 2, 290, 40, 40);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    //天选之子H卡提出来
    const luckyDog = (cardHs.length % 2 === 1) ? cardHs.pop() : '';
    svg = setSvgBody(svg, 510, 330 + (rowTotal - 1) * 150, luckyDog, reg_bp_list);

    //插入H卡
    let stringHs = ''

    for (let i = 0; i < cardHs.length; i++) {
        const ix = (i + 1) % 2;
        const iy = Math.floor(i / 2);

        const x = (ix === 1) ? 40 : 980;
        const y = 330 + iy * 150;

        stringHs += getSvgBody(x, y, cardHs[i])
    }

    svg = setText(svg, stringHs, reg_bp_list);

    const page = torusBold.getTextPath(
        'page: ' + (data.page || 0) + ' of ' + (data.max_page || 0), 1920 / 2, panel_height - 15, 20, 'center baseline', '#fff', 0.6
    )

    svg = setText(svg, page, reg_bp_list)

    return svg.toString();
}