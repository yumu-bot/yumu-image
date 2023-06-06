import {exportPng, readTemplate} from "../util.js";

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
        "monthlyPlaycounts": [
            {
                "startDate": "2020-05-01",
                "count": 43
            },
            {
                "startDate": "2020-06-01",
                "count": 809
            },
            {
                "startDate": "2020-07-01",
                "count": 671
            },
            {
                "startDate": "2020-08-01",
                "count": 1417
            },
            {
                "startDate": "2020-09-01",
                "count": 2060
            },
            {
                "startDate": "2020-10-01",
                "count": 1504
            },
            {
                "startDate": "2020-11-01",
                "count": 2291
            },
            {
                "startDate": "2020-12-01",
                "count": 3004
            },
            {
                "startDate": "2021-01-01",
                "count": 2615
            },
            {
                "startDate": "2021-02-01",
                "count": 1552
            },
            {
                "startDate": "2021-03-01",
                "count": 1861
            },
            {
                "startDate": "2021-04-01",
                "count": 1715
            },
            {
                "startDate": "2021-05-01",
                "count": 1631
            },
            {
                "startDate": "2021-06-01",
                "count": 1313
            },
            {
                "startDate": "2021-07-01",
                "count": 580
            },
            {
                "startDate": "2021-08-01",
                "count": 226
            },
            {
                "startDate": "2021-09-01",
                "count": 345
            },
            {
                "startDate": "2021-10-01",
                "count": 135
            },
            {
                "startDate": "2021-11-01",
                "count": 108
            },
            {
                "startDate": "2021-12-01",
                "count": 114
            },
            {
                "startDate": "2022-01-01",
                "count": 85
            },
            {
                "startDate": "2022-02-01",
                "count": 255
            },
            {
                "startDate": "2022-03-01",
                "count": 1478
            },
            {
                "startDate": "2022-04-01",
                "count": 1317
            },
            {
                "startDate": "2022-05-01",
                "count": 1262
            },
            {
                "startDate": "2022-06-01",
                "count": 1112
            },
            {
                "startDate": "2022-07-01",
                "count": 1061
            },
            {
                "startDate": "2022-08-01",
                "count": 550
            },
            {
                "startDate": "2022-09-01",
                "count": 548
            },
            {
                "startDate": "2022-10-01",
                "count": 647
            },
            {
                "startDate": "2022-11-01",
                "count": 474
            },
            {
                "startDate": "2022-12-01",
                "count": 908
            },
            {
                "startDate": "2023-01-01",
                "count": 742
            },
            {
                "startDate": "2023-02-01",
                "count": 549
            },
            {
                "startDate": "2023-03-01",
                "count": 665
            },
            {
                "startDate": "2023-04-01",
                "count": 692
            },
            {
                "startDate": "2023-05-01",
                "count": 686
            },
            {
                "startDate": "2023-06-01",
                "count": 124
            }
        ],
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
        "profile_order": [
            "me",
            "top_ranks",
            "recent_activity",
            "medals",
            "historical",
            "beatmaps",
            "kudosu"
        ],
        "previous_usernames": [
            "coooool"
        ],
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
        "kudosu": {
            "total": 0,
            "available": 0
        },
        "rank_history": {
            "mode": "OSU",
            "history": [
                34768,
                34791,
                34814,
                34835,
                34864,
                34901,
                34909,
                34932,
                34927,
                34942,
                34976,
                34795,
                34774,
                34286,
                33368,
                33387,
                33410,
                33432,
                33457,
                33476,
                33491,
                33504,
                33461,
                33472,
                33474,
                33503,
                33410,
                33423,
                33450,
                33477,
                33501,
                33532,
                33553,
                33573,
                33592,
                33616,
                33634,
                33654,
                33679,
                33695,
                33716,
                33555,
                33568,
                32953,
                32982,
                33002,
                33023,
                33045,
                33045,
                33057,
                33073,
                33080,
                33100,
                33125,
                33145,
                33167,
                33179,
                33199,
                33211,
                33237,
                33268,
                33298,
                32386,
                32418,
                32445,
                32464,
                32485,
                32461,
                32493,
                32515,
                32526,
                32173,
                32195,
                32220,
                31603,
                31599,
                31617,
                31642,
                31634,
                31655,
                30936,
                30947,
                30970,
                30988,
                31002,
                31014,
                30440,
                30453,
                30474,
                30495
            ]
        }
    },
    bp: [
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
    ]
}) {
    let svg = readTemplate('template/Panel_J.svg');

    return await exportPng(svg);
}