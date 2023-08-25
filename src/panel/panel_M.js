import {exportImage} from "../util.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_M(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportImage(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_M(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_M(data = {
    user: {
        "avatar_url": "https://a.ppy.sh/5645691?1691564120.jpeg",
        "country_code": "CN",
        "default_group": "bng_limited",
        "id": 5645691,
        "is_active": true,
        "is_bot": false,
        "is_deleted": false,
        "is_online": false,
        "is_supporter": true,
        "last_visit": "2023-08-22T11:49:45+00:00",
        "pm_friends_only": false,
        "profile_colour": "#6B3FA0",
        "username": "MeAqua tete",
        "cover_url": "https://assets.ppy.sh/user-profile-covers/5645691/ad8c427134b573afd0b4d10cfdd645ab0e333acdef6df4f22e77ce80401dc67e.jpeg",
        "discord": "TamagoKun233",
        "has_supported": true,
        "interests": "Everything except mapping",
        "join_date": "2015-01-17T03:12:16+00:00",
        "kudosu": {
            "total": 1506,
            "available": 1501
        },
        "location": "Shanghai, China",
        "max_blocks": 200,
        "max_friends": 1000,
        "occupation": "Contact me in QQ: 576719320",
        "playmode": "osu",
        "playstyle": [
            "mouse",
            "keyboard",
            "tablet"
        ],
        "post_count": 310,
        "profile_order": [
            "me",
            "beatmaps",
            "recent_activity",
            "top_ranks",
            "kudosu",
            "medals",
            "historical"
        ],
        "title": "Trial Nominator",
        "title_url": null,
        "twitter": "lide0315",
        "website": null,
        "country": {
            "code": "CN",
            "name": "China"
        },
        "cover": {
            "custom_url": "https://assets.ppy.sh/user-profile-covers/5645691/ad8c427134b573afd0b4d10cfdd645ab0e333acdef6df4f22e77ce80401dc67e.jpeg",
            "url": "https://assets.ppy.sh/user-profile-covers/5645691/ad8c427134b573afd0b4d10cfdd645ab0e333acdef6df4f22e77ce80401dc67e.jpeg",
            "id": null
        },
        "account_history": [],
        "active_tournament_banner": null,
        "badges": [],
        "beatmap_playcounts_count": 3527,
        "comments_count": 284,
        "favourite_beatmapset_count": 92,
        "follower_count": 578,
        "graveyard_beatmapset_count": 34,
        "groups": [
            {
                "colour": "#A347EB",
                "has_listing": true,
                "has_playmodes": true,
                "id": 32,
                "identifier": "bng_limited",
                "is_probationary": true,
                "name": "Beatmap Nominators (Probationary)",
                "short_name": "BN",
                "playmodes": [
                    "osu"
                ]
            }
        ],
        "guest_beatmapset_count": 16,
        "loved_beatmapset_count": 0,
        "mapping_follower_count": 535,
        "monthly_playcounts": [
            {
                "start_date": "2023-08-01",
                "count": 67
            }
        ],
        "nominated_beatmapset_count": 44,
        "page": {
            "html": ""
        },
        "pending_beatmapset_count": 2,
        "previous_usernames": [
            "576719320",
            "My Angel Yuki",
            "AngelSnow",
            "Present"
        ],
        "rank_highest": {
            "rank": 25138,
            "updated_at": "2019-02-22T08:58:46Z"
        },
        "ranked_beatmapset_count": 28,
        "replays_watched_counts": [
            {
                "start_date": "2023-05-01",
                "count": 1
            }
        ],
        "scores_best_count": 100,
        "scores_first_count": 0,
        "scores_pinned_count": 2,
        "scores_recent_count": 2,
        "statistics": {
            "count_100": 772289,
            "count_300": 7860498,
            "count_50": 86631,
            "count_miss": 335994,
            "level": {
                "current": 100,
                "progress": 18
            },
            "global_rank": 49323,
            "global_rank_exp": null,
            "pp": 5573.24,
            "pp_exp": 0,
            "ranked_score": 9594733086,
            "hit_accuracy": 98.4671,
            "play_count": 47696,
            "play_time": 2244568,
            "total_score": 45602477761,
            "total_hits": 8719418,
            "maximum_combo": 2353,
            "replays_watched_by_others": 48,
            "is_ranked": true,
            "grade_counts": {
                "ss": 11,
                "ssh": 31,
                "s": 66,
                "sh": 439,
                "a": 874
            },
            "country_rank": 942,
            "rank": {
                "country": 942
            }
        },
        "support_level": 1,
        "user_achievements": [],
        "rank_history": {
            "mode": "osu",
            "data": []
        },
        "rankHistory": {
            "mode": "osu",
            "data": []
        },
        "ranked_and_approved_beatmapset_count": 28,
        "unranked_beatmapset_count": 2
    }, //getUser

    most_popular_beatmap: [
        {
            "video": false,
            "availabilityDownloadDisable": false,
            "fromDatabases": false,
            "id": 1972258,
            "user_id": 17064371,
            "bpm": 168.0,
            "artist": "Anisphia (CV: Senbongi Sayaka), Euphyllia (CV: Iwami Manaka)",
            "artist_unicode": "アニスフィア (CV: 千本木彩花), ユフィリア (CV: 石見舞菜香)",
            "title": "Only for you",
            "title_unicode": "Only for you",
            "creator": "-Spring Night-",
            "favourite_count": 3,
            "nsfw": false,
            "play_count": 273,
            "preview_url": "//b.ppy.sh/preview/1972258.mp3",
            "source": "転生王女と天才令嬢の魔法革命",
            "status": "pending",
            "legacy_thread_url": "https://osu.ppy.sh/community/forums/topics/1748003",
            "tags": "tensei oujo to tensai reijou no mahou kakumei the magical revolution of the reincarnated princess and the genius young lady tv anime ed ending japanese pop jpop j-pop yuri gay lesbian erisu",
            "storyboard": false,
            "covers": {
                "cover": "https://assets.ppy.sh/beatmaps/1972258/covers/cover.jpg?1691157563",
                "cover@2x": "https://assets.ppy.sh/beatmaps/1972258/covers/cover@2x.jpg?1691157563",
                "card": "https://assets.ppy.sh/beatmaps/1972258/covers/card.jpg?1691157563",
                "card@2x": "https://assets.ppy.sh/beatmaps/1972258/covers/card@2x.jpg?1691157563",
                "list": "https://assets.ppy.sh/beatmaps/1972258/covers/list.jpg?1691157563",
                "list@2x": "https://assets.ppy.sh/beatmaps/1972258/covers/list@2x.jpg?1691157563",
                "slimcover": "https://assets.ppy.sh/beatmaps/1972258/covers/slimcover.jpg?1691157563",
                "slimcover@2x": "https://assets.ppy.sh/beatmaps/1972258/covers/slimcover@2x.jpg?1691157563"
            },
            "spotlight": false,
            "beatmaps": [{
                "id": 4092433,
                "mode": "osu",
                "status": "pending",
                "version": "Anisphia",
                "ar": 9.0,
                "cs": 4.5,
                "bpm": 168.0,
                "convert": false,
                "passcount": 4,
                "playcount": 13,
                "ranked": 0,
                "url": "https://osu.ppy.sh/beatmaps/4092433",
                "beatMapRating": 0.0,
                "beatMapRetryCount": 0,
                "beatMapFailedCount": 0,
                "beatmapset_id": 1972258,
                "difficulty_rating": 5.61,
                "mode_int": 0,
                "total_length": 236,
                "hit_length": 235,
                "user_id": 17064371,
                "accuracy": 8.5,
                "drain": 5.0,
                "max_combo": 1300,
                "is_scoreable": false,
                "last_updated": "2023-08-04T13:58:57Z",
                "checksum": "5fbb06a39a4f2145bb8bed8e5d8ca51a",
                "count_sliders": 321,
                "count_spinners": 4,
                "count_circles": 624
            }, {
                "id": 4092434,
                "mode": "osu",
                "status": "pending",
                "version": "Euphyllia",
                "ar": 8.0,
                "cs": 4.0,
                "bpm": 168.0,
                "convert": false,
                "passcount": 0,
                "playcount": 1,
                "ranked": 0,
                "url": "https://osu.ppy.sh/beatmaps/4092434",
                "beatMapRating": 0.0,
                "beatMapRetryCount": 0,
                "beatMapFailedCount": 0,
                "beatmapset_id": 1972258,
                "difficulty_rating": 4.05,
                "mode_int": 0,
                "total_length": 235,
                "hit_length": 89,
                "user_id": 17064371,
                "accuracy": 7.0,
                "drain": 5.0,
                "max_combo": 381,
                "is_scoreable": false,
                "last_updated": "2023-08-04T13:58:58Z",
                "checksum": "839abf5a5984f2b5e779c6bbbf4e4050",
                "count_sliders": 102,
                "count_spinners": 2,
                "count_circles": 156
            }, {
                "id": 4102609,
                "mode": "osu",
                "status": "pending",
                "version": "Sun_Smile's Expert",
                "ar": 9.3,
                "cs": 3.6,
                "bpm": 168.0,
                "convert": false,
                "passcount": 6,
                "playcount": 41,
                "ranked": 0,
                "url": "https://osu.ppy.sh/beatmaps/4102609",
                "beatMapRating": 0.0,
                "beatMapRetryCount": 0,
                "beatMapFailedCount": 0,
                "beatmapset_id": 1972258,
                "difficulty_rating": 5.94,
                "mode_int": 0,
                "total_length": 237,
                "hit_length": 237,
                "user_id": 8664140,
                "accuracy": 8.4,
                "drain": 5.0,
                "max_combo": 1310,
                "is_scoreable": false,
                "last_updated": "2023-08-04T13:58:58Z",
                "checksum": "d39c20132a417a4d68c9181c291c9235",
                "count_sliders": 288,
                "count_spinners": 4,
                "count_circles": 712
            }]
        }, {}
    ],//根据游玩数量排序，走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，给6张即可。

    most_recent_ranked_beatmap: {},//需要判断，如果玩家的ranked_and_approved_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）是uid所指的人的那张谱面即可。如果没有结果返回空
    most_recent_ranked_guest_diff: {}, //需要判断，如果玩家的guest_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）不是uid所指的人的那张谱面即可。如果没有结果返回空

    // 这是啥
    genre: [0, 0, 0, 1, 0, 1, 0], //unspecified, video game, anime, rock, pop, other, novelty, hip hop, electronic, metal, classical, folk, jazz
    //搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any

    difficulty_arr: [], //星数数组。0-2 2-2.8 2.8-4 4-5.3 5.3-6.5 6.5-8 8-10 10-无穷，包括前面不包括后面
    player_feedback_arr: [], //0到10，给上面搜过的谱面里这个数据的总和即可："ratings": [];

    //Get User Recent Activity，需要筛选出"type": "beatmapsetUpdate", "type": "beatmapsetRanked",类似的种类，获取100条（两页
    recent_activity: [
        {
            "created_at": "2023-08-14T04:12:51+00:00",
            "createdAt": "2023-08-14T04:12:51+00:00",
            "id": 804554294,
            "type": "beatmapsetUpdate",
            "beatmapset": {
                "title": "beemyu - Shopping ChipTune",
                "url": "/s/1953400"
            },
            "user": {
                "username": "Muziyami",
                "url": "/u/7003013"
            }
        },
        {
            "created_at": "2023-08-13T13:45:32+00:00",
            "createdAt": "2023-08-13T13:45:32+00:00",
            "id": 804445276,
            "type": "beatmapsetUpdate",
            "beatmapset": {
                "title": "beemyu - Shopping ChipTune",
                "url": "/s/1953400"
            },
            "user": {
                "username": "Muziyami",
                "url": "/u/7003013"
            }
        },
    ]
}, reuse = false) {
    let svg = '';

    return svg.toString();
}