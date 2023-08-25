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

    most_popular_beatmap:[
        {
            "artist": "Dark PHOENiX",
            "artist_unicode": "Dark PHOENiX",
            "covers": {
                "cover": "https://assets.ppy.sh/beatmaps/2022219/covers/cover.jpg?1691586075",
                "cover@2x": "https://assets.ppy.sh/beatmaps/2022219/covers/cover@2x.jpg?1691586075",
                "card": "https://assets.ppy.sh/beatmaps/2022219/covers/card.jpg?1691586075",
                "card@2x": "https://assets.ppy.sh/beatmaps/2022219/covers/card@2x.jpg?1691586075",
                "list": "https://assets.ppy.sh/beatmaps/2022219/covers/list.jpg?1691586075",
                "list@2x": "https://assets.ppy.sh/beatmaps/2022219/covers/list@2x.jpg?1691586075",
                "slimcover": "https://assets.ppy.sh/beatmaps/2022219/covers/slimcover.jpg?1691586075",
                "slimcover@2x": "https://assets.ppy.sh/beatmaps/2022219/covers/slimcover@2x.jpg?1691586075"
            },
            "creator": "Muziyami",
            "favourite_count": 1,
            "hype": null,
            "id": 2022219,
            "nsfw": false,
            "offset": 0,
            "play_count": 136,
            "preview_url": "//b.ppy.sh/preview/2022219.mp3",
            "source": "東方妖々夢　～ Perfect Cherry Blossom.",
            "spotlight": false,
            "status": "graveyard",
            "title": "Yuuga ni Sakase, Sumizome no Sakura",
            "title_unicode": "幽雅に咲かせ、墨染の桜",
            "track_id": null,
            "user_id": 7003013,
            "video": false,
            "bpm": 144,
            "can_be_hyped": false,
            "deleted_at": null,
            "discussion_enabled": true,
            "discussion_locked": false,
            "is_scoreable": false,
            "last_updated": "2023-07-12T12:42:37Z",
            "legacy_thread_url": "https://osu.ppy.sh/community/forums/topics/1789565",
            "nominations_summary": {
                "current": 0,
                "required": 2
            },
            "ranked": -2,
            "ranked_date": null,
            "storyboard": true,
            "submitted_date": "2023-07-07T12:31:36Z",
            "tags": "東方project 優雅に咲かせ、墨染の桜 ～ border of life touhou zun 西行寺 幽々子 幽幽子 saigyouji yuyuko bloom nobly cherry blossoms of sumizome video game electronic metal arrow realize c77 comic market 2009 instrumental arrangement 稲井ゆう inai yuu yu- 玉井祐也 yuya tamai utopialyric 姫川紫音 himekawa shion yhc hidden cup season 3 s3 tiebreaker tb",
            "availability": {
                "download_disabled": false,
                "more_information": null
            },
            "beatmaps": [
                {
                    "beatmapset_id": 2022219,
                    "difficulty_rating": 5.67,
                    "id": 4211648,
                    "mode": "osu",
                    "status": "graveyard",
                    "total_length": 248,
                    "user_id": 7003013,
                    "version": "Untouchable Hidden Border",
                    "accuracy": 8,
                    "ar": 9.3,
                    "bpm": 180,
                    "convert": false,
                    "count_circles": 808,
                    "count_sliders": 537,
                    "count_spinners": 3,
                    "cs": 4,
                    "deleted_at": null,
                    "drain": 5,
                    "hit_length": 246,
                    "is_scoreable": false,
                    "last_updated": "2023-07-12T12:42:38Z",
                    "mode_int": 0,
                    "passcount": 59,
                    "playcount": 113,
                    "ranked": -2,
                    "url": "https://osu.ppy.sh/beatmaps/4211648",
                    "checksum": "089e72fb69b912ca1d050a0b3366add1",
                    "max_combo": 1973
                }
            ],
            "pack_tags": []
        },{

    }
    ],//根据游玩数量排序，走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，给6张即可。

    most_recent_ranked_beatmap: {},//需要判断，如果玩家的ranked_and_approved_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）是uid所指的人的那张谱面即可。如果没有结果返回空
    most_recent_ranked_guest_diff: {}, //需要判断，如果玩家的guest_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）不是uid所指的人的那张谱面即可。如果没有结果返回空

    genre: [0,0,0,1,0,1,0], //unspecified, video game, anime, rock, pop, other, novelty, hip hop, electronic, metal, classical, folk, jazz
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