import {createImageRouter, createSvgRouter} from "../util/image.js";
import {colorArray, getGlobalRankPercentColor, getGlobalRankPercentName, PanelColor} from "../util/color.js";
import {
    getAvatar, getGameMode,
    getPanelNameSVG, getRandomString,
    getSvgBody,
    rotateSvgBody, rounds,
    setCustomBanner,
    setSvgBody,
    setText,
    setTexts
} from "../util/util.js";
import {beatmapset2Task, imageDownloader, toTask, user2Task} from "../util/download.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {extra, poppinsBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {label_E5, LABEL_S} from "../component/label.js";

export const router = createImageRouter(panel_S);

export const router_svg = createSvgRouter(panel_S);


/**
 * 快速匹配信息面板
 * !ri xxx
 * @param data
 * @return {Promise<string>}
 */
export async function panel_S(data = {
    user: {
        "avatar_url": "https://a.ppy.sh/7003013?1779120246.jpeg",
        "country_code": "CN",
        "default_group": "default",
        "id": 7003013,
        "is_active": true,
        "is_bot": false,
        "is_deleted": false,
        "is_online": false,
        "is_supporter": false,
        "last_visit": "2026-06-24T06:10:50+00:00",
        "pm_friends_only": false,
        "profile_colour": null,
        "username": "Muziyami",
        "cover_url": "https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg",
        "discord": "YumeMuzi#5619",
        "has_supported": true,
        "interests": "yuyuko❤",
        "join_date": "2015-08-28T12:42:47+00:00",
        "location": "China",
        "max_blocks": 100,
        "max_friends": 500,
        "occupation": "Elite Humblebragging Mapper",
        "playmode": "osu",
        "playstyle": [
            "keyboard",
            "tablet"
        ],
        "post_count": 268,
        "profile_hue": 226,
        "profile_order": [
            "me",
            "recent_activity",
            "top_ranks",
            "beatmaps",
            "historical",
            "medals",
            "kudosu"
        ],
        "title": null,
        "title_url": null,
        "twitter": "YumeMuzi",
        "website": "https://github.com/YumeMuzi",
        "country": {
            "code": "CN",
            "name": "China"
        },
        "cover": {
            "custom_url": "https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg",
            "url": "https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg",
            "id": null
        },
        "is_restricted": false,
        "kudosu": {
            "available": 452,
            "total": 452
        },
        "account_history": [],
        "active_tournament_banner": null,
        "active_tournament_banners": [],
        "badges": [
            {
                "awarded_at": "2020-08-31T11:08:44+00:00",
                "description": "Mirai. Tournament 2020 Winning Team",
                "image@2x_url": "https://assets.ppy.sh/profile-badges/miraidot-2020@2x.png",
                "image_url": "https://assets.ppy.sh/profile-badges/miraidot-2020.png",
                "url": ""
            }
        ],
        "beatmap_playcounts_count": 7743,
        "comments_count": 806,
        "current_season_stats": null,
        "current_user_attributes": {
            "has_blocked": false
        },
        "daily_challenge_user_stats": {
            "daily_streak_best": 1,
            "daily_streak_current": 0,
            "last_update": "2025-01-02T00:00:00+00:00",
            "last_weekly_streak": "2025-01-02T00:00:00+00:00",
            "playcount": 2,
            "top_10p_placements": 1,
            "top_50p_placements": 2,
            "user_id": 7003013,
            "weekly_streak_best": 1,
            "weekly_streak_current": 0
        },
        "favourite_beatmapset_count": 84,
        "follower_count": 594,
        "graveyard_beatmapset_count": 123,
        "groups": [],
        "guest_beatmapset_count": 48,
        "loved_beatmapset_count": 0,
        "mapping_follower_count": 90,
        matchmaking_stats: [
            {
                "first_placements": 9,
                "is_rating_provisional": false,
                "plays": 14,
                "pool_id": 38,
                "rank": 9718,
                "rating": 1643,
                "total_points": 0,
                "user_id": 7003013,
                "pool": {
                    "active": true,
                    "id": 38,
                    "name": "RP: Season 0",
                    "ruleset_id": 0,
                    "type": "ranked_play",
                    "variant_id": 0
                }
            }
        ],
        "monthly_playcounts": [
            {
                "start_date": "2015-08-01",
                "count": 41
            },
        ],
        "nominated_beatmapset_count": 0,
        "page": {
            "html": ""
        },
        "pending_beatmapset_count": 0,
        "previous_usernames": [
            "lp_Blue"
        ],
        "rank_highest": {
            "rank": 22319,
            "updated_at": "2021-11-10T12:57:03Z"
        },
        "ranked_beatmapset_count": 11,
        "replays_watched_counts": [

            {
                "start_date": "2026-06-01",
                "count": 3
            }
        ],
        "scores_best_count": 200,
        "scores_first_count": 0,
        "scores_pinned_count": 3,
        "scores_recent_count": 0,
        "session_verification_method": null,
        "session_verified": true,
        "statistics": {
            "count_100": 762976,
            "count_300": 8447842,
            "count_50": 87571,
            "count_miss": 295880,
            "level": {
                "current": 100,
                "progress": 52
            },
            "global_rank": 50084,
            "global_rank_percent": 0.014154104065616893,
            "global_rank_exp": null,
            "pp": 6440.74,
            "pp_exp": 0,
            "ranked_score": 31972666816,
            "hit_accuracy": 98.8602,
            "accuracy": 0.9886020000000001,
            "play_count": 24774,
            "play_time": 2445868,
            "total_score": 79104921197,
            "total_hits": 9298389,
            "maximum_combo": 2801,
            "replays_watched_by_others": 286,
            "is_ranked": true,
            "grade_counts": {
                "ss": 34,
                "ssh": 119,
                "s": 172,
                "sh": 996,
                "a": 1739
            },
            "country_rank": 907,
            "rank": {
                "country": 907
            }
        },
        "statistics_rulesets": {
            "osu": {
                "count_100": 762976,
                "count_300": 8447842,
                "count_50": 87571,
                "count_miss": 295880,
                "level": {
                    "current": 100,
                    "progress": 52
                },
                "global_rank": 50084,
                "global_rank_percent": 0.014154104065616893,
                "global_rank_exp": null,
                "pp": 6440.74,
                "pp_exp": 0,
                "ranked_score": 31972666816,
                "hit_accuracy": 98.8602,
                "accuracy": 0.9886020000000001,
                "play_count": 24774,
                "play_time": 2445868,
                "total_score": 79104921197,
                "total_hits": 9298389,
                "maximum_combo": 2801,
                "replays_watched_by_others": 286,
                "is_ranked": true,
                "grade_counts": {
                    "ss": 34,
                    "ssh": 119,
                    "s": 172,
                    "sh": 996,
                    "a": 1739
                }
            },
            "taiko": {
                "count_100": 112102,
                "count_300": 979958,
                "count_50": 0,
                "count_miss": 78942,
                "level": {
                    "current": 49,
                    "progress": 88
                },
                "global_rank": 11947,
                "global_rank_percent": 0.027163755587589298,
                "global_rank_exp": null,
                "pp": 3500.96,
                "pp_exp": 0,
                "ranked_score": 269302263,
                "hit_accuracy": 97.9757,
                "accuracy": 0.979757,
                "play_count": 2953,
                "play_time": 258718,
                "total_score": 815077866,
                "total_hits": 1092060,
                "maximum_combo": 1086,
                "replays_watched_by_others": 13,
                "is_ranked": true,
                "grade_counts": {
                    "ss": 10,
                    "ssh": 1,
                    "s": 128,
                    "sh": 27,
                    "a": 226
                }
            },
            "fruits": {
                "count_100": 46632,
                "count_300": 692080,
                "count_50": 329156,
                "count_miss": 139714,
                "level": {
                    "current": 74,
                    "progress": 8
                },
                "global_rank": 5379,
                "global_rank_percent": 0.014798165566685282,
                "global_rank_exp": null,
                "pp": 3150.22,
                "pp_exp": 0,
                "ranked_score": 1296272167,
                "hit_accuracy": 99.1369,
                "accuracy": 0.991369,
                "play_count": 1973,
                "play_time": 145173,
                "total_score": 2683318830,
                "total_hits": 1067868,
                "maximum_combo": 1264,
                "replays_watched_by_others": 15,
                "is_ranked": true,
                "grade_counts": {
                    "ss": 18,
                    "ssh": 1,
                    "s": 160,
                    "sh": 1,
                    "a": 87
                }
            },
            "mania": {
                "count_100": 667512,
                "count_300": 3936750,
                "count_50": 34035,
                "count_miss": 149206,
                "level": {
                    "current": 75,
                    "progress": 78
                },
                "global_rank": 76687,
                "global_rank_percent": 0.06332263189359334,
                "global_rank_exp": null,
                "pp": 3404.78,
                "pp_exp": 0,
                "ranked_score": 711675053,
                "hit_accuracy": 95.9769,
                "accuracy": 0.959769,
                "play_count": 6018,
                "play_time": 511461,
                "total_score": 2873398000,
                "total_hits": 4638297,
                "maximum_combo": 3520,
                "replays_watched_by_others": 12,
                "is_ranked": true,
                "grade_counts": {
                    "ss": 12,
                    "ssh": 2,
                    "s": 232,
                    "sh": 169,
                    "a": 230
                }
            }
        },
        "support_level": 0,
        "team": null,
        "user_achievements": [
            {
                "achieved_at": "2026-06-03T16:03:35Z",
                "achievement_id": 358
            },
        ],
        "rank_history": {
            "mode": "osu",
            "data": [
                47600,
                47626,
                47659,
                47687,
                47713,
                47746,
                47782,
                47812,
                47839,
                47865,
                47894,
                47922,
                47956,
                47984,
                48014,
                48038,
                48063,
                48083,
                48114,
                48135,
                48160,
                48186,
                48222,
                48255,
                48269,
                48298,
                48317,
                48337,
                48359,
                48402,
                48434,
                48451,
                48475,
                48494,
                48531,
                48567,
                48589,
                48624,
                48652,
                48679,
                48708,
                48723,
                48749,
                48771,
                48796,
                48823,
                48849,
                48877,
                48897,
                48922,
                48951,
                48974,
                49007,
                49030,
                49053,
                49072,
                49099,
                49138,
                49170,
                49202,
                49233,
                49253,
                49291,
                49317,
                49346,
                49372,
                49382,
                49415,
                49445,
                49468,
                49501,
                49528,
                49567,
                49594,
                49630,
                49663,
                49692,
                49716,
                49747,
                49767,
                49809,
                49841,
                49876,
                49915,
                49953,
                49991,
                50016,
                50047,
                50084,
                50084
            ]
        },
        "ranked_and_approved_beatmapset_count": 11,
        "unranked_beatmapset_count": 0
    }, recently: [{
        duration: 488, room_id: 3056562, players: [7003013, 11925374], wins: [2, 1],

        rounds: [{
            list_id: 36598725, beatmap_id: 3221246, beatmapset_id: 1496234, difficulty_rating: 5.08154, covers: {
                cover: 'https://assets.ppy.sh/beatmaps/1496234/covers/cover.jpg?1633531234',
                'cover@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/cover@2x.jpg?1633531234',
                card: 'https://assets.ppy.sh/beatmaps/1496234/covers/card.jpg?1633531234',
                'card@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/card@2x.jpg?1633531234',
                list: 'https://assets.ppy.sh/beatmaps/1496234/covers/list.jpg?1633531234',
                'list@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/list@2x.jpg?1633531234',
                slimcover: 'https://assets.ppy.sh/beatmaps/1496234/covers/slimcover.jpg?1633531234',
                'slimcover@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/slimcover@2x.jpg?1633531234',
                fullsize: 'https://assets.ppy.sh/beatmaps/1496234/covers/fullsize.jpg?1633531234'
            }, scores: [[Object], [Object]], winner: 11925374
        }, {
            list_id: 36598939, beatmap_id: 2794531, beatmapset_id: 1349715, difficulty_rating: 5.56279, covers: {
                cover: 'https://assets.ppy.sh/beatmaps/1349715/covers/cover.jpg?1650706242',
                'cover@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/cover@2x.jpg?1650706242',
                card: 'https://assets.ppy.sh/beatmaps/1349715/covers/card.jpg?1650706242',
                'card@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/card@2x.jpg?1650706242',
                list: 'https://assets.ppy.sh/beatmaps/1349715/covers/list.jpg?1650706242',
                'list@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/list@2x.jpg?1650706242',
                slimcover: 'https://assets.ppy.sh/beatmaps/1349715/covers/slimcover.jpg?1650706242',
                'slimcover@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/slimcover@2x.jpg?1650706242',
                fullsize: 'https://assets.ppy.sh/beatmaps/1349715/covers/fullsize.jpg?1650706242'
            }, scores: [[Object], [Object]], winner: 7003013
        }, {
            list_id: 36599062, beatmap_id: 848586, beatmapset_id: 377930, difficulty_rating: 5.32558, covers: {
                cover: 'https://assets.ppy.sh/beatmaps/377930/covers/cover.jpg?1740230999',
                'cover@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/cover@2x.jpg?1740230999',
                card: 'https://assets.ppy.sh/beatmaps/377930/covers/card.jpg?1740230999',
                'card@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/card@2x.jpg?1740230999',
                list: 'https://assets.ppy.sh/beatmaps/377930/covers/list.jpg?1740230999',
                'list@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/list@2x.jpg?1740230999',
                slimcover: 'https://assets.ppy.sh/beatmaps/377930/covers/slimcover.jpg?1740230999',
                'slimcover@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/slimcover@2x.jpg?1740230999',
                fullsize: 'https://assets.ppy.sh/beatmaps/377930/covers/fullsize.jpg?1740230999'
            }, scores: [[Object], [Object]], winner: 7003013
        }]
    }, {duration: 309, room_id: 3056481, rounds: [Array]}, {
        duration: 516,
        room_id: 3056394,
        rounds: [Array]
    }, {duration: 603, room_id: 3056273, rounds: [Array]}],

    stats: {
        play_time: 6424,
        map_count: 41,
        average_combo: 429,
        average_difficulty: 5.41,
        average_accuracy: 0.9131573170731703
    },

    surrounding: [{
        id: 10023264,
        username: 'Yorukah',
        country: [Object],
        wins: 12,
        playcount: 16,
        rating: 1643,
        rank: 9669,
        absolute_rank: 9669,
        provisional: false
    }, {
        id: 25395114,
        username: 'RJA',
        country: [Object],
        wins: 8,
        playcount: 14,
        rating: 1643,
        rank: 9670,
        absolute_rank: 9670,
        provisional: false
    }, {
        id: 17537769,
        username: 'krkz',
        country: [Object],
        wins: 8,
        playcount: 14,
        rating: 1643,
        rank: 9671,
        absolute_rank: 9671,
        provisional: true
    }, {
        id: 7003013,
        username: 'Muziyami',
        country: [Object],
        wins: 9,
        playcount: 14,
        rating: 1643,
        rank: 9672,
        absolute_rank: 9672,
        provisional: false
    }, {
        id: 19995212,
        username: 'paced',
        country: [Object],
        wins: 8,
        playcount: 13,
        rating: 1643,
        rank: 9673,
        absolute_rank: 9673,
        provisional: false
    }, {
        id: 15543581,
        username: 'ClemouDouard',
        country: [Object],
        wins: 7,
        playcount: 13,
        rating: 1643,
        rank: 9674,
        absolute_rank: 9674,
        provisional: false
    }, {
        id: 17621384,
        username: 'Seriak',
        country: [Object],
        wins: 6,
        playcount: 12,
        rating: 1643,
        rank: 9675,
        absolute_rank: 9675,
        provisional: false
    }], rating: 1.1240942774099782, total_players: 96500
}) {
    // 自设定义
    const has_custom_panel = false;

    const {
        user = {},
        mode = 'osu',
        recently = [],
        stats = {},
        surrounding = [],
        rating: mu_rating = 0,
        total_players = 0,
    } = data

    const {
        first_placements = 0,
        is_rating_provisional = 0,
        plays = 0,
        rank = 0,
        rating: mm_rating = 0,
    } = user?.matchmaking_stats?.[0] ?? {}

    const hue = user?.profile_hue ?? 342

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PS-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PS-BG">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PS-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PS-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PS-BG)" style="clip-path: url(#clippath-PS-BG);">
        </g>
    </g>
    <g id="Component">
    </g>
    <g id="Card_A1">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: ${PanelColor.middle(hue)};"/>
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PS-1\);">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/

    // 面板文字
    const panel_name = getPanelNameSVG("Ranked Play Info", 'RI');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 下图
    const promised_a1s = user2Task(user)

    const promise_s2s = beatmapset2Task(recently.flatMap(r => r.rounds), 'list')

    const promise_s1s = recently.flatMap(
        r => r.rounds
            .flatMap(rs => rs.scores)
            .map(ss => ss?.user ?? {}))
        .map(u => toTask('avatar', u.id,
            () => getAvatar(u))
        )

    const promise_s3s = surrounding.map(u => toTask('avatar', u.id,
        () => getAvatar(u.id))
    )

    const tasks = [
        ...promised_a1s,
        ...promise_s2s,
        ...promise_s1s,
        ...promise_s3s
    ];

    const images = await imageDownloader(tasks);

    const cardA1 = await card_A1(
        PanelGenerate.user2CardA1(user, null, images.get(`avatar_${user.id}`), images.get(`banner_${user.id}`))
    );

    const componentS1 = component_S1(
        PanelSGenerate.rank2componentS1(
             rank, total_players, mode, has_custom_panel, hue
        ));
    const componentS2 = component_S2(
        PanelSGenerate.rating2componentS2(
            mu_rating, mm_rating, has_custom_panel, hue
        ));
    const componentS3 = component_S3(
        PanelSGenerate.stats2componentS3(
            stats, plays, has_custom_panel, hue
        ));
    const componentS4 = component_S4(
        PanelSGenerate.recently2componentS4(
            recently, has_custom_panel, hue
        ));
    const componentS5 = ''
    const componentS6 = ''

    const bodyS1 = getSvgBody(40, 330, componentS1)
    const bodyS2 = getSvgBody(40, 700, componentS2)
    const bodyS3 = getSvgBody(550, 330, componentS3)
    const bodyS4 = getSvgBody(970, 330, componentS4)
    const bodyS5 = getSvgBody(550, 740, componentS5)
    const bodyS6 = getSvgBody(1040, 740, componentS6)

    svg = setCustomBanner(svg, user?.profile?.banner, reg_banner);

    svg = setTexts(svg, [bodyS1, bodyS2, bodyS3, bodyS4, bodyS5, bodyS6], reg_component);

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    
    return svg
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_S1 = (
    data = {
        rank: 0,
        total_players: 0,
        mode: 'osu',

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S1">`
    const hide = data.has_custom_panel === true

    const percent = data.rank / Math.max(data.total_players, 1)

    const colors = getGlobalRankPercentColor(data.rank, percent)
    const ranks = getGlobalRankPercentName(data.rank, percent)

    const base = rotateSvgBody(PanelDraw.LinearGradientRect(215 - 80, 150 - 80, 160, 160, 20, colors, 1, [100, 0], [60, 40]), 215,  150, 45)

    const random = getRandomString(6)

    const title = hide ? '' : poppinsBold.getTextPath('Rank', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 430, 340, 20, PanelColor.middle(data.hue), 1)

    const mode = extra.getTextPath(
        getGameMode(data.mode, -1), 215, 205 - 10, 128, 'center baseline', '#fff'
    )

    const mode_base = PanelDraw.LinearGradientRect(
        215 - 60, 150 - 60, 60 * 2, 60 * 2, 0, [PanelColor.base(data.hue), PanelColor.middle(data.hue)], 1, [80, 20], [60, 40]
    )

    const rank = poppinsBold.getTextPath(ranks, 215, 305, 30, 'center baseline', '#fff', 1)

    svg += `
    <defs>
        <mask id="Mask_S1_${random}">
            ${mode}
        </mask>
    </defs>
    ${rrect}
    ${base}
    <g mask="url(#Mask_S1_${random})">
        ${mode_base}
    </g>
    ${rank}
    ${title}
`


    return svg;
}

const component_S2 = (
    data = {
        mu_rating: 0,
        mm_rating: 0,

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S2">`
    const hide = data.has_custom_panel === true

    const rating_round = rounds(data.mu_rating, 2)

    const rating = poppinsBold.get2SizeTextPath(
        rating_round.integer, rating_round.decimal, 90, 72, 215, 205, 'center baseline', '#fff'
    )

    const elo = poppinsBold.getTextPath(String(data?.mm_rating), 215, 305, 30, 'center baseline', '#fff', 1)

    const arc = PanelDraw.RoundedArcBar(215, 40 + 270 / 2, 210 / 2, 270 / 2, -45, 225, PanelColor.top(data.hue))

    const angle = (225 + 45)

    let green_angle

    if (data.mu_rating < 1) {
        green_angle = -45 + data.mu_rating * angle / 2
    } else {
        green_angle = -45 + (Math.min(1, data.mu_rating - 1) + 1) * angle / 2
    }

    const arc_green = PanelDraw.RoundedArcBar(215, 40 + 270 / 2, 210 / 2, 270 / 2, -45, green_angle, '#fff')

    const defs = `
    <defs>
        <mask id="arc-mask-1">
            ${arc_green}
        </mask>
    </defs>`

    const arc_green_body = `
    <g mask="url(#arc-mask-1)">
        ${PanelDraw.LinearGradientRect(80, 40, 270, 270, 0, colorArray.light_green)}}
    </g>`

    const title = hide ? '' : poppinsBold.getTextPath('Rating', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 430, 340, 20, PanelColor.middle(data.hue), 1)

    return [svg, defs, rrect, title, elo, rating, arc, arc_green_body, '</g>'].join('')
}

const component_S3 = (
    data = {
        playcounts: 0,
        counts: 0,
        time: 0,
        combo: 0,
        difficulty: 0.0,
        accuracy: 0.0,

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S3">`
    const hide = data.has_custom_panel === true

    const sr = rounds(data.difficulty, 2)
    const acc = rounds((data?.accuracy ?? 0) * 100, 2)

    const total_sec = data.time; // 假设 data.time 是传入的秒数

    const hours = Math.floor(total_sec / 3600);
    const minutes = Math.floor((total_sec % 3600) / 60);
    const seconds = total_sec % 60;

    const labels = [
        {
            ...LABEL_S.PC,
            data_b: String(data.playcounts),
            data_m: '',
            bar_progress: getProgress(data.playcounts, LABEL_S.PC.bar_min, LABEL_S.PC.bar_max),
            hide: hide,
            max_width: 280,
        }, {
            ...LABEL_S.MAP_PC,
            data_b: String(data.counts),
            data_m: '',
            bar_progress: getProgress(data.counts, LABEL_S.MAP_PC.bar_min, LABEL_S.MAP_PC.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.SR,
            data_b: sr.integer,
            data_m: sr.decimal,
            bar_progress: getProgress(data.difficulty, LABEL_S.SR.bar_min, LABEL_S.SR.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.PT,
            data_b: `${hours}h`,
            data_m: ` ${minutes}m ${seconds}s`,
            bar_progress: getProgress(hours, LABEL_S.PT.bar_min, LABEL_S.PT.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.COMBO,
            data_b: String(data.combo),
            data_m: '',
            bar_progress: getProgress(data.combo, LABEL_S.COMBO.bar_min, LABEL_S.COMBO.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.ACC,
            data_b: acc.integer,
            data_m: `${acc.decimal}%`,
            bar_progress: getProgress((data?.accuracy ?? 0) * 100, LABEL_S.ACC.bar_min, LABEL_S.ACC.bar_max),
            hide: hide,
            max_width: 280,
        },
    ]

    const string_e5s = labels.map((label, i) => {
        let x, y;

        x = 15 + 300 * (i % 3);
        y = 40 + 75 * Math.floor(i / 3);

        return getSvgBody(x, y, label_E5(label));
    }).join('');


    const title = hide ? '' : poppinsBold.getTextPath('Mapping Statistics', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 920, 200, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, title, string_e5s, '</g>'].join('')
}



const component_S4 = (
    data = {
        recently: [],

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S4">`
    const hide = data.has_custom_panel === true
}


const PanelSGenerate = {
    rank2componentS1: (rank = 0, total_players = 0, mode = 'osu', has_custom_panel = false, hue) => {
        return {
            rank: rank,
            total_players: total_players,
            mode: mode,
            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    rating2componentS2: (mu_rating = 0, mm_rating = 0, has_custom_panel = false, hue) => {
        return {
            mu_rating: mu_rating,
            mm_rating: mm_rating,
            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    stats2componentS3: (stats = {}, plays = 0, has_custom_panel = false, hue) => {

        return {
            playcounts: plays,
            counts: stats?.counts ?? 0,
            time: stats?.time ?? 0,
            combo: stats?.combo ?? 0,
            difficulty: stats?.difficulty ?? 0,
            accuracy: stats?.accuracy ?? 0,

            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    recently2componentS4: (recently = [], has_custom_panel = false, hue) => {

        return {
            recently: recently,

            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },
}


// bottom: 保底
const getProgress = (x, min, max, bottom = 1 / 16) => {
    const result = (Math.min(Math.max(x, min), max) - min) / (max - min)

    return Math.max(result, bottom);
}