import {exportPng, PanelGenerate, readTemplate} from "../util.js";
import {card_A1} from "../card/card_A1";
import {card_J} from "../card/card_J";

export async function router(req, res) {
    try {
        const data = await panel_J(req.fields || {});
        res.set('Content-Type', 'image/png');
        res.send(data);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

export async function panel_J(data = {
    card_A1: {
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
            "pp7K": null,
            "pp4K": null,
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
    bpTop5: [
        {
            "accuracy": 0.9738946378174976,
            "mods": [],
            "passed": true,
            "perfect": false,
            "pp": 328.307,
            "rank": "A",
            "replay": false,
            "score": 182165120,
            "statistics": {
                "pp": null,
                "ss": null,
                "ssh": null,
                "s": null,
                "sh": null,
                "a": null,
                "ranked": null,
                "pp7K": null,
                "pp4K": null,
                "count_50": 1,
                "count_100": 76,
                "count_300": 2045,
                "count_geki": 361,
                "count_katu": 38,
                "count_miss": 4,
                "ranked_score": null,
                "total_score": null,
                "hit_accuracy": null,
                "play_count": null,
                "play_time": null,
                "total_hits": null,
                "maximum_combo": null,
                "is_ranked": null,
                "global_rank": null,
                "replays_watched_by_others": null,
                "country_rank": null
            },
            "user": {
                "id": 17064371,
                "avatar": "https://a.ppy.sh/17064371?1675693670.jpeg",
                "statustucs": null,
                "pmOnly": false,
                "avatar_url": "https://a.ppy.sh/17064371?1675693670.jpeg",
                "cover_url": null,
                "default_group": "default",
                "is_active": true,
                "is_bot": false,
                "is_deleted": false,
                "is_online": false,
                "is_supporter": true,
                "last_visit": [
                    2023,
                    6,
                    5,
                    12,
                    43,
                    41,
                    201052174
                ],
                "pm_friends_only": false,
                "username": "-Spring Night-",
                "country_code": "TW",
                "country": null,
                "cover": null,
                "statistics": null
            },
            "weight": {
                "percentage": 100,
                "pp": 328.307
            },
            "best_id": 4444205653,
            "max_combo": 3054,
            "user_id": 17064371,
            "created_at": [
                2023,
                5,
                26,
                11,
                59,
                37
            ],
            "id": 4444205653,
            "mode": "OSU",
            "mode_int": 0,
            "beatmap": {
                "id": 1001682,
                "mode": "osu",
                "status": "ranked",
                "version": "Myth",
                "ar": 9.5,
                "cs": 4,
                "bpm": 200,
                "convert": false,
                "passcount": 908838,
                "playcount": 15727856,
                "ranked": 1,
                "url": "https://osu.ppy.sh/beatmaps/1001682",
                "beatMapRatingList": null,
                "beatMapRetryList": null,
                "beatMapFailedList": null,
                "beatMapRating": 0,
                "beatMapRetryCount": 0,
                "beatMapFailedCount": 0,
                "beatmapset_id": 382400,
                "difficulty_rating": 6.38,
                "mode_int": 0,
                "total_length": 441,
                "hit_length": 398,
                "user_id": 4610047,
                "accuracy": 9,
                "drain": 6.2,
                "max_combo": null,
                "is_scoreable": true,
                "last_updated": "2017-02-01T14:38:47Z",
                "checksum": "1e8f966c7a8f992cb2f3f5bab7d55925",
                "count_sliders": 587,
                "count_spinners": 5,
                "count_circles": 1534,
                "fail": null,
                "exit": null,
                "beatmapset": null
            },
            "beatmapset": {
                "video": false,
                "availabilityDownloadDisable": null,
                "availabilityInformation": null,
                "fromDatabases": false,
                "id": 382400,
                "user_id": 4610047,
                "bpm": null,
                "artist": "DragonForce",
                "artist_unicode": "DragonForce",
                "title": "Through the Fire and Flames",
                "title_unicode": "Through the Fire and Flames",
                "creator": "Ponoyoshi",
                "favourite_count": 7269,
                "nsfw": false,
                "play_count": 15727856,
                "preview_url": "//b.ppy.sh/preview/382400.mp3",
                "source": "",
                "status": "ranked",
                "legacy_thread_url": null,
                "tags": null,
                "storyboard": null,
                "covers": {
                    "cover": "https://assets.ppy.sh/beatmaps/382400/covers/cover.jpg?1622096843",
                    "cover@2x": "https://assets.ppy.sh/beatmaps/382400/covers/cover@2x.jpg?1622096843",
                    "card": "https://assets.ppy.sh/beatmaps/382400/covers/card.jpg?1622096843",
                    "card@2x": "https://assets.ppy.sh/beatmaps/382400/covers/card@2x.jpg?1622096843",
                    "list": "https://assets.ppy.sh/beatmaps/382400/covers/list.jpg?1622096843",
                    "list@2x": "https://assets.ppy.sh/beatmaps/382400/covers/list@2x.jpg?1622096843",
                    "slimcover": "https://assets.ppy.sh/beatmaps/382400/covers/slimcover.jpg?1622096843",
                    "slimcover@2x": "https://assets.ppy.sh/beatmaps/382400/covers/slimcover@2x.jpg?1622096843"
                },
                "ratings": null
            },
            "create_at_str": "2023-05-26T11:59:37Z"
        },
    ],

    bpLast5: [],

    bpLength: [ //第一个是最大值，第二个是中值（不是平均值），第三个是最小值。如果bp不足2个，中值和最小值留null，如果bp不足3个，中值留null
        {
            "index": 154, //这个得自己算，和对应的数据有关系。length给秒数（整数），combo给连击（整数），star rating给星数（小数）
            "ranking": 1, //排名，得自己计数，bp是bp几
            "list@2x": "https://assets.ppy.sh/beatmaps/382400/covers/list@2x.jpg?1622096843", //bp.beatmapset.covers['list@2x']
            "difficulty_rating": 6.38, //bp.beatmap.difficulty_rating
            "rank": "A", //bp.rank
        },
    ],

    bpCombo: [], //数据格式同上

    bpSR: [],

    // 最喜爱谱师，只需要给6个
    favorite_mappers:[
        {
            "avatar_url": "https://a.ppy.sh/17064371?1675693670.jpeg",
            "username": "-Spring Night-",
            "map_count": 50,
            "pp_count": 16247,
        },
        {
            "avatar_url": "https://a.ppy.sh/17064371?1675693670.jpeg",
            "username": "-Spring Night-",
            "map_count": 50,
            "pp_count": 16247,
        },
    ],

    // 右上角的 BP 分布，给数组
    pp_arr: [114, 514, 1919, 810], //给pp
    rank_arr: ['A','SS','B'], //给评级的统计数据。
    rank_count_arr: [0,0,0,0,0,0,0], //给评级的统计数据。依次为：SSH、SS、SH、S、A、B、C、D的数量

    rank_attr: [ //第一个给Perfect数量（真FC），第二个给FC数量（包括真假FC），第三个之后到第八个都给评级数量。越牛逼的越靠上
        {
            "index": "PF",
            "map_count": 50,
            "pp_count": 16247,
            "percent": 0.94, //这里是pp_count 除以 (总PP - 奖励PP) 得到的值，0-1
        },
        {
            "index": "FC",
            "map_count": 50,
            "pp_count": 16247,
            "percent": 0.94,
        },
        {
            "index": "SS",
            "map_count": 50,
            "pp_count": 16247,
            "percent": 0.94,
        },
    ]

    //

}) {
    let svg = readTemplate('template/Panel_J.svg');

    //

    // A1卡构建
    let cardA1 = await card_A1(PanelGenerate.user2CardA1(data.card_A1), true);

    // J卡构建
    let cardJs_top = [];
    let cardJs_last = [];

    for (const bp in data.bpTop5) {
        cardJs_top.push(await card_J(PanelGenerate.bp2CardJ(bp), true));
    }

    for (const bp in data.bpLast5) {
        cardJs_last.push(await card_J(PanelGenerate.bp2CardJ(bp), true));
    }

    //

    return await exportPng(svg);
}