import {
    exportJPEG,
    getExportFileV3Path,
    getPanelNameSVG,
    getRoundedNumberStr,
    implantImage,
    implantSvgBody, readNetImage,
    readTemplate,
    replaceText,
    replaceTexts, transformSvgBody
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_O1} from "../card/card_O1.js";
import {PuHuiTi, torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_N(data);
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
        const svg = await panel_N(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_N(
    data =
        {
            beatmapset: {
                artist: 'Wang Rui',
                covers: {
                    cover: 'https://assets.ppy.sh/beatmaps/1087774/covers/cover.jpg?1646464034',
                    'cover@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/cover@2x.jpg?1646464034',
                    card: 'https://assets.ppy.sh/beatmaps/1087774/covers/card.jpg?1646464034',
                    'card@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/card@2x.jpg?1646464034',
                    list: 'https://assets.ppy.sh/beatmaps/1087774/covers/list.jpg?1646464034',
                    'list@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/list@2x.jpg?1646464034',
                    slimcover: 'https://assets.ppy.sh/beatmaps/1087774/covers/slimcover.jpg?1646464034',
                    'slimcover@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/slimcover@2x.jpg?1646464034'
                },
                creator: 'Muziyami',
                nsfw: false,
                offset: 0,
                source: '小女花不弃',
                spotlight: false,
                status: 'ranked',
                title: 'Tao Hua Xiao',
                video: false,
                ranked: 1,
                storyboard: true,
                tags: 'peach blossom cpop c-pop pop chinese 古风 oriental bilibili cover rearrangement 纳兰寻风 na lan xun feng 西门振 xi men zhen 青萝子 qing luo zi op opening xiao nv hua bu qi i will never let you go houshou hari dacaigou kisaki dahkjdas -ovo-',
                converts: [
                    [Object], [Object], [Object],
                    [Object], [Object], [Object],
                    [Object], [Object], [Object],
                    [Object], [Object], [Object],
                    [Object], [Object], [Object],
                    [Object], [Object], [Object],
                    [Object], [Object], [Object]
                ],
                description: {
                    description: ""
                },
                genre: { id: 5, name: 'Pop' },
                language: { id: 4, name: 'Chinese' },
                ratings: [
                    0, 7, 4, 0,  3,
                    1, 1, 7, 3, 41,
                    270
                ],
                mappers: [
                    {
                        id: 4284198,
                        username: 'Houshou Hari',
                        active: true,
                        bot: false,
                        uid: 4284198,
                        osuMode: 'DEFAULT',
                        supporter: false,
                        online: false,
                        deleted: false,
                        avatar_url: 'https://a.ppy.sh/4284198?1679674871.jpeg',
                        country_code: 'CN',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: false,
                        is_supporter: false,
                        last_visit: 1706025282,
                        pm_friends_only: false
                    },
                    {
                        id: 5062396,
                        username: 'dahkjdas',
                        active: true,
                        bot: false,
                        uid: 5062396,
                        osuMode: 'DEFAULT',
                        supporter: false,
                        online: false,
                        deleted: false,
                        avatar_url: 'https://a.ppy.sh/5062396?1693129184.jpeg',
                        country_code: 'CN',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: false,
                        is_supporter: false,
                        last_visit: 1706197695,
                        pm_friends_only: false
                    },
                    {
                        id: 12208924,
                        username: '-OvO-',
                        active: true,
                        bot: false,
                        uid: 12208924,
                        osuMode: 'DEFAULT',
                        supporter: true,
                        online: false,
                        deleted: false,
                        avatar_url: 'https://a.ppy.sh/12208924?1697903109.jpeg',
                        country_code: 'CN',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: false,
                        is_supporter: true,
                        pm_friends_only: false
                    }
                ]
                ,
                nominators: [{
                    "avatar_url": "https://a.ppy.sh/3076909?1617850669.jpeg",
                    "country_code": "CN",
                    "default_group": "bng",
                    "id": 3076909,
                    "is_active": true,
                    "is_bot": false,
                    "is_deleted": false,
                    "is_online": false,
                    "is_supporter": true,
                    "last_visit": "2024-01-24T18:32:08+00:00",
                    "pm_friends_only": false,
                    "profile_colour": "#A347EB",
                    "username": "Mafumafu",
                    "groups": [
                        {
                            "colour": "#A347EB",
                            "has_listing": true,
                            "has_playmodes": true,
                            "id": 28,
                            "identifier": "bng",
                            "is_probationary": false,
                            "name": "Beatmap Nominators",
                            "short_name": "BN",
                            "playmodes": [
                                "osu"
                            ]
                        },
                        {
                            "colour": "#999999",
                            "has_listing": true,
                            "has_playmodes": false,
                            "id": 16,
                            "identifier": "alumni",
                            "is_probationary": false,
                            "name": "osu! Alumni",
                            "short_name": "ALM",
                            "playmodes": null
                        }
                    ]
                }],
                publicRating: 9.43620178041543,
                bpm: 162,
                sid: 1087774,
                artist_unicode: '汪睿',
                favourite_count: 404,
                id: 1087774,
                play_count: 200351,
                preview_url: '//b.ppy.sh/preview/1087774.mp3',
                title_unicode: '桃花笑',
                user_id: 7003013,
                can_be_hyped: false,
                discussion_locked: false,
                is_scoreable: true,
                last_updated: 1646464010,
                legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/1005413',
                nominations_summary: { current: 4, required: 4 },
                ranked_date: 1647193324,
                submitted_date: 1577976073,
                availability: { download_disabled: false, more_information: null },
                beatmaps: [
                    [Object], [Object],
                    [Object], [Object],
                    [Object], [Object],
                    [Object], [Object],
                    [Object], [Object],
                    [Object]
                ],
                current_nominations: [ [Object], [Object], [Object], [Object] ],
                pack_tags: [ 'S1152' ],
                recent_favourites: [
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object], [Object], [Object],
                    [Object], [Object]
                ],
                related_users: [
                    [Object], [Object],
                    [Object], [Object],
                    [Object], [Object],
                    [Object], [Object]
                ],
                user: {
                    id: 7003013,
                    username: 'Muziyami',
                    discord: 'YumeMuzi#5619',
                    interests: 'yuyuko❤',
                    location: 'China',
                    occupation: 'Elite Graveyarded Mapper',
                    twitter: 'YumeMuzi',
                    website: 'https://github.com/YumeMuzi',
                    badges: [Array],
                    monthlyPlaycounts: [Array],
                    page: [Object],
                    replaysWatchedCounts: [Array],
                    PP: 6196.65,
                    active: true,
                    online: false,
                    bot: false,
                    deleted: false,
                    osuMode: 'OSU',
                    pp: 6196.65,
                    uid: 7003013,
                    globalRank: 36161,
                    maxCombo: 2801,
                    levelProgress: 48,
                    playTime: 2347198,
                    totalHits: 8890988,
                    countryRank: 680,
                    accuracy: 99.0353,
                    levelCurrent: 100,
                    playCount: 23831,
                    supporter: false,
                    commentsCount: 682,
                    avatar_url: 'https://a.ppy.sh/7003013?1704285435.jpeg',
                    country_code: 'CN',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: false,
                    last_visit: 1706212237,
                    pm_friends_only: false,
                    cover_url: 'https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg',
                    has_supported: true,
                    join_date: 1440765767,
                    max_blocks: 100,
                    max_friends: 500,
                    playmode: 'osu',
                    playstyle: [Array],
                    post_count: 252,
                    profile_order: [Array],
                    country: [Object],
                    cover: [Object],
                    kudosu: [Object],
                    account_history: [],
                    active_tournament_banners: [],
                    beatmap_playcounts_count: 6892,
                    comments_count: 682,
                    favourite_beatmapset_count: 85,
                    follower_count: 505,
                    graveyard_beatmapset_count: 113,
                    groups: [],
                    guest_beatmapset_count: 26,
                    loved_beatmapset_count: 0,
                    mapping_follower_count: 61,
                    nominated_beatmapset_count: 0,
                    pending_beatmapset_count: 3,
                    previous_usernames: [Array],
                    rank_highest: [Object],
                    ranked_beatmapset_count: 4,
                    scores_best_count: 100,
                    scores_first_count: 0,
                    scores_pinned_count: 3,
                    scores_recent_count: 0,
                    statistics: [Object],
                    support_level: 0,
                    user_achievements: [Array],
                    rank_history: [Object]
                }
            },
            more: {
                minSR: '1',
                problemCount: 12,
                hostCount: 5,
                notSolvedCount: 0,
                totalLength: 191,
                suggestCount: 165,
                guestCount: 6,
                totalCount: 11,
                maxSR: '5',
                tags: [
                    'peach',    'blossom',       'cpop',
                    'c-pop',    'pop',           'chinese',
                    '古风',     'oriental',      'bilibili',
                    'cover',    'rearrangement', '纳兰寻风',
                    'na',       'lan',           'xun',
                    'feng',     '西门振',        'xi',
                    'men',      'zhen',          '青萝子',
                    'qing',     'luo',           'zi',
                    'op',       'opening',       'xiao',
                    'nv',       'hua',           'bu',
                    'qi',       'i',             'will',
                    'never',    'let',           'you',
                    'go',       'houshou',       'hari',
                    'dacaigou', 'kisaki',        'dahkjdas',
                    '-ovo-'
                ]
            },
            hype: [
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 12190421,
                    did: 2936590,
                    id: 2936590,
                    beatmapset_id: 1087774,
                    user_id: 12190421,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1646658201,
                    updated_at: 1646658201,
                    last_post_at: 1646658201,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2935129,
                    id: 2935129,
                    beatmapset_id: 1087774,
                    user_id: 13806900,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1646588360,
                    updated_at: 1646650945,
                    last_post_at: 1646588506,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2934953,
                    id: 2934953,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1646583508,
                    updated_at: 1646650947,
                    last_post_at: 1646586897,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2919985,
                    bid: 2315666,
                    id: 2919985,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 13806900,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1645897852,
                    updated_at: 1645897852,
                    last_post_at: 1645897852,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2919957,
                    bid: 2315667,
                    id: 2919957,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315667,
                    user_id: 13806900,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1645897162,
                    updated_at: 1645897162,
                    last_post_at: 1645897162,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912955,
                    bid: 2315669,
                    id: 2912955,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1645563282,
                    updated_at: 1645616936,
                    last_post_at: 1645616936,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 19591339,
                    did: 2871352,
                    id: 2871352,
                    beatmapset_id: 1087774,
                    user_id: 19591339,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1643628907,
                    updated_at: 1643628907,
                    last_post_at: 1643628907,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 24232404,
                    did: 2854458,
                    id: 2854458,
                    beatmapset_id: 1087774,
                    user_id: 24232404,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1642826932,
                    updated_at: 1642826932,
                    last_post_at: 1642826932,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 25397797,
                    did: 2845000,
                    id: 2845000,
                    beatmapset_id: 1087774,
                    user_id: 25397797,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1642400657,
                    updated_at: 1642400657,
                    last_post_at: 1642400657,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 17481469,
                    did: 2837077,
                    id: 2837077,
                    beatmapset_id: 1087774,
                    user_id: 17481469,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1642045608,
                    updated_at: 1642045608,
                    last_post_at: 1642045608,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 1074648,
                    did: 2828782,
                    id: 2828782,
                    beatmapset_id: 1087774,
                    user_id: 1074648,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641701516,
                    updated_at: 1641705199,
                    last_post_at: 1641705199,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 20384257,
                    did: 2821337,
                    id: 2821337,
                    beatmapset_id: 1087774,
                    user_id: 20384257,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641393732,
                    updated_at: 1641393732,
                    last_post_at: 1641393732,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 2360046,
                    did: 2815615,
                    id: 2815615,
                    beatmapset_id: 1087774,
                    user_id: 2360046,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641147073,
                    updated_at: 1641147073,
                    last_post_at: 1641147073,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 16022233,
                    did: 2814225,
                    id: 2814225,
                    beatmapset_id: 1087774,
                    user_id: 16022233,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641089886,
                    updated_at: 1641089886,
                    last_post_at: 1641089886,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 16665557,
                    did: 2813178,
                    id: 2813178,
                    beatmapset_id: 1087774,
                    user_id: 16665557,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641047803,
                    updated_at: 1641047803,
                    last_post_at: 1641047803,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 12190421,
                    did: 2936590,
                    id: 2936590,
                    beatmapset_id: 1087774,
                    user_id: 12190421,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1646658201,
                    updated_at: 1646658201,
                    last_post_at: 1646658201,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2935129,
                    id: 2935129,
                    beatmapset_id: 1087774,
                    user_id: 13806900,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1646588360,
                    updated_at: 1646650945,
                    last_post_at: 1646588506,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2934953,
                    id: 2934953,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1646583508,
                    updated_at: 1646650947,
                    last_post_at: 1646586897,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2919985,
                    bid: 2315666,
                    id: 2919985,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 13806900,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1645897852,
                    updated_at: 1645897852,
                    last_post_at: 1645897852,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2919957,
                    bid: 2315667,
                    id: 2919957,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315667,
                    user_id: 13806900,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1645897162,
                    updated_at: 1645897162,
                    last_post_at: 1645897162,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912955,
                    bid: 2315669,
                    id: 2912955,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1645563282,
                    updated_at: 1645616936,
                    last_post_at: 1645616936,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 19591339,
                    did: 2871352,
                    id: 2871352,
                    beatmapset_id: 1087774,
                    user_id: 19591339,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1643628907,
                    updated_at: 1643628907,
                    last_post_at: 1643628907,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 24232404,
                    did: 2854458,
                    id: 2854458,
                    beatmapset_id: 1087774,
                    user_id: 24232404,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1642826932,
                    updated_at: 1642826932,
                    last_post_at: 1642826932,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 25397797,
                    did: 2845000,
                    id: 2845000,
                    beatmapset_id: 1087774,
                    user_id: 25397797,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1642400657,
                    updated_at: 1642400657,
                    last_post_at: 1642400657,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 17481469,
                    did: 2837077,
                    id: 2837077,
                    beatmapset_id: 1087774,
                    user_id: 17481469,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1642045608,
                    updated_at: 1642045608,
                    last_post_at: 1642045608,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 1074648,
                    did: 2828782,
                    id: 2828782,
                    beatmapset_id: 1087774,
                    user_id: 1074648,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641701516,
                    updated_at: 1641705199,
                    last_post_at: 1641705199,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 20384257,
                    did: 2821337,
                    id: 2821337,
                    beatmapset_id: 1087774,
                    user_id: 20384257,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641393732,
                    updated_at: 1641393732,
                    last_post_at: 1641393732,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 2360046,
                    did: 2815615,
                    id: 2815615,
                    beatmapset_id: 1087774,
                    user_id: 2360046,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641147073,
                    updated_at: 1641147073,
                    last_post_at: 1641147073,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 16022233,
                    did: 2814225,
                    id: 2814225,
                    beatmapset_id: 1087774,
                    user_id: 16022233,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641089886,
                    updated_at: 1641089886,
                    last_post_at: 1641089886,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 16665557,
                    did: 2813178,
                    id: 2813178,
                    beatmapset_id: 1087774,
                    user_id: 16665557,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1641047803,
                    updated_at: 1641047803,
                    last_post_at: 1641047803,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 9293623,
                    did: 2786669,
                    id: 2786669,
                    beatmapset_id: 1087774,
                    user_id: 9293623,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1639902168,
                    updated_at: 1639902168,
                    last_post_at: 1639902168,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 10562723,
                    did: 2706780,
                    id: 2706780,
                    beatmapset_id: 1087774,
                    user_id: 10562723,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1636256489,
                    updated_at: 1636256489,
                    last_post_at: 1636256489,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 10562723,
                    did: 2705672,
                    id: 2705672,
                    beatmapset_id: 1087774,
                    user_id: 10562723,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1636213230,
                    updated_at: 1636213230,
                    last_post_at: 1636213230,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 26070638,
                    did: 2627901,
                    id: 2627901,
                    beatmapset_id: 1087774,
                    user_id: 26070638,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1632595182,
                    updated_at: 1632595182,
                    last_post_at: 1632595182,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 5863409,
                    did: 2601573,
                    id: 2601573,
                    beatmapset_id: 1087774,
                    user_id: 5863409,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1631438049,
                    updated_at: 1631609192,
                    last_post_at: 1631438049,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2599999,
                    id: 2599999,
                    beatmapset_id: 1087774,
                    user_id: 13806900,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1631377291,
                    updated_at: 1631609191,
                    last_post_at: 1631377291,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13248033,
                    did: 2594286,
                    id: 2594286,
                    beatmapset_id: 1087774,
                    user_id: 13248033,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1631110268,
                    updated_at: 1631361827,
                    last_post_at: 1631166671,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 18184144,
                    did: 2576125,
                    id: 2576125,
                    beatmapset_id: 1087774,
                    user_id: 18184144,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1630306979,
                    updated_at: 1630332777,
                    last_post_at: 1630332777,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 18489362,
                    did: 2572954,
                    id: 2572954,
                    beatmapset_id: 1087774,
                    user_id: 18489362,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1630176766,
                    updated_at: 1630332767,
                    last_post_at: 1630332765,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 9603470,
                    did: 2556843,
                    id: 2556843,
                    beatmapset_id: 1087774,
                    user_id: 9603470,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1629530049,
                    updated_at: 1629530049,
                    last_post_at: 1629530049,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6716801,
                    did: 1492912,
                    id: 1492912,
                    beatmapset_id: 1087774,
                    user_id: 6716801,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1586012011,
                    updated_at: 1586012011,
                    last_post_at: 1586012011,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 15698395,
                    did: 1458290,
                    id: 1458290,
                    beatmapset_id: 1087774,
                    user_id: 15698395,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1584620421,
                    updated_at: 1584620421,
                    last_post_at: 1584620421,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 8697654,
                    did: 1444147,
                    id: 1444147,
                    beatmapset_id: 1087774,
                    user_id: 8697654,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1584014238,
                    updated_at: 1584014238,
                    last_post_at: 1584014238,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 8697654,
                    did: 1444145,
                    bid: 2274674,
                    id: 1444145,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274674,
                    user_id: 8697654,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1584014227,
                    updated_at: 1584014227,
                    last_post_at: 1584014227,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 3662737,
                    did: 1427971,
                    id: 1427971,
                    beatmapset_id: 1087774,
                    user_id: 3662737,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1583237930,
                    updated_at: 1583242409,
                    last_post_at: 1583237930,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 12208924,
                    did: 1376445,
                    id: 1376445,
                    beatmapset_id: 1087774,
                    user_id: 12208924,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1580444052,
                    updated_at: 1580444052,
                    last_post_at: 1580444052,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 12764539,
                    did: 1375602,
                    id: 1375602,
                    beatmapset_id: 1087774,
                    user_id: 12764539,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1580396916,
                    updated_at: 1580444807,
                    last_post_at: 1580444807,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 10458474,
                    did: 1375587,
                    id: 1375587,
                    beatmapset_id: 1087774,
                    user_id: 10458474,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1580394935,
                    updated_at: 1580394935,
                    last_post_at: 1580394935,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 11225846,
                    did: 1364445,
                    id: 1364445,
                    beatmapset_id: 1087774,
                    user_id: 11225846,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1579681558,
                    updated_at: 1579698763,
                    last_post_at: 1579698763,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13914343,
                    did: 1361298,
                    id: 1361298,
                    beatmapset_id: 1087774,
                    user_id: 13914343,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1579495918,
                    updated_at: 1579508481,
                    last_post_at: 1579508436,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 12417445,
                    did: 1352343,
                    id: 1352343,
                    beatmapset_id: 1087774,
                    user_id: 12417445,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1578979674,
                    updated_at: 1579155086,
                    last_post_at: 1579155082,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 12518076,
                    did: 1351527,
                    id: 1351527,
                    beatmapset_id: 1087774,
                    user_id: 12518076,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1578933435,
                    updated_at: 1579155090,
                    last_post_at: 1579155090,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6333728,
                    did: 1339478,
                    id: 1339478,
                    beatmapset_id: 1087774,
                    user_id: 6333728,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1578209801,
                    updated_at: 1578209962,
                    last_post_at: 1578209962,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 13107354,
                    did: 1339473,
                    id: 1339473,
                    beatmapset_id: 1087774,
                    user_id: 13107354,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1578209699,
                    updated_at: 1578209940,
                    last_post_at: 1578209933,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6984103,
                    did: 1335322,
                    id: 1335322,
                    beatmapset_id: 1087774,
                    user_id: 6984103,
                    message_type: 'hype',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1577989433,
                    updated_at: 1578027652,
                    last_post_at: 1578027652,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: false,
                    sid: 1087774,
                    uid: 6984103,
                    did: 1335202,
                    bid: 2274671,
                    id: 1335202,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274671,
                    user_id: 6984103,
                    message_type: 'praise',
                    can_be_resolved: false,
                    can_grant_kudosu: false,
                    created_at: 1577985163,
                    updated_at: 1578033925,
                    last_post_at: 1578033924,
                    kudosu_denied: false,
                    starting_post: [Object]
                }
            ],
            discussion: [
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2931910,
                    bid: 3188581,
                    id: 2931910,
                    beatmapset_id: 1087774,
                    beatmap_id: 3188581,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1646454300,
                    updated_at: 1646463882,
                    last_post_at: 1646463879,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2927102,
                    bid: 3188581,
                    id: 2927102,
                    beatmapset_id: 1087774,
                    beatmap_id: 3188581,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1646236309,
                    updated_at: 1646321368,
                    last_post_at: 1646282857,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2919991,
                    bid: 2315668,
                    id: 2919991,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 13806900,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645897985,
                    updated_at: 1645938700,
                    last_post_at: 1645938697,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 1541323,
                    did: 2914566,
                    id: 2914566,
                    beatmapset_id: 1087774,
                    user_id: 1541323,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645635496,
                    updated_at: 1645952930,
                    last_post_at: 1645952925,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912967,
                    id: 2912967,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645563910,
                    updated_at: 1645627289,
                    last_post_at: 1645627284,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912952,
                    id: 2912952,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645563149,
                    updated_at: 1645622052,
                    last_post_at: 1645621796,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912946,
                    bid: 2315667,
                    id: 2912946,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315667,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645563037,
                    updated_at: 1645614785,
                    last_post_at: 1645614785,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912943,
                    bid: 2315667,
                    id: 2912943,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315667,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562870,
                    updated_at: 1645614827,
                    last_post_at: 1645614827,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912934,
                    bid: 2315666,
                    id: 2912934,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562446,
                    updated_at: 1645614708,
                    last_post_at: 1645614706,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912929,
                    bid: 2315666,
                    id: 2912929,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562186,
                    updated_at: 1645614673,
                    last_post_at: 1645614673,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912927,
                    bid: 2315666,
                    id: 2912927,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562096,
                    updated_at: 1645614628,
                    last_post_at: 1645614628,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912924,
                    bid: 2315666,
                    id: 2912924,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561971,
                    updated_at: 1645614531,
                    last_post_at: 1645614531,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912914,
                    bid: 2315668,
                    id: 2912914,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561570,
                    updated_at: 1645614278,
                    last_post_at: 1645614278,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912907,
                    bid: 2315669,
                    id: 2912907,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561355,
                    updated_at: 1645613854,
                    last_post_at: 1645613851,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912904,
                    bid: 2315668,
                    id: 2912904,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561221,
                    updated_at: 1645614432,
                    last_post_at: 1645614432,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912897,
                    bid: 2315668,
                    id: 2912897,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645560953,
                    updated_at: 1645618072,
                    last_post_at: 1645618072,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912886,
                    id: 2912886,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645560528,
                    updated_at: 1645622050,
                    last_post_at: 1645622047,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912874,
                    bid: 2315669,
                    id: 2912874,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645559898,
                    updated_at: 1645613553,
                    last_post_at: 1645613553,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912873,
                    bid: 2315669,
                    id: 2912873,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645559743,
                    updated_at: 1645613230,
                    last_post_at: 1645613230,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912867,
                    bid: 2315669,
                    id: 2912867,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645559535,
                    updated_at: 1645613059,
                    last_post_at: 1645613059,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912847,
                    bid: 2315669,
                    id: 2912847,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645558910,
                    updated_at: 1645612934,
                    last_post_at: 1645612934,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912826,
                    bid: 2315669,
                    id: 2912826,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645557749,
                    updated_at: 1645616924,
                    last_post_at: 1645616924,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912761,
                    id: 2912761,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645556189,
                    updated_at: 1645621397,
                    last_post_at: 1645621397,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 7047319,
                    did: 2889518,
                    id: 2889518,
                    beatmapset_id: 1087774,
                    user_id: 7047319,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1644512046,
                    updated_at: 1644680229,
                    last_post_at: 1644680228,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 7047319,
                    did: 2887493,
                    id: 2887493,
                    beatmapset_id: 1087774,
                    user_id: 7047319,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1644410045,
                    updated_at: 1646027034,
                    last_post_at: 1646027034,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798752,
                    bid: 2274671,
                    id: 2798752,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274671,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640416835,
                    updated_at: 1641191766,
                    last_post_at: 1641191764,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798723,
                    bid: 3188581,
                    id: 2798723,
                    beatmapset_id: 1087774,
                    beatmap_id: 3188581,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640414983,
                    updated_at: 1646321372,
                    last_post_at: 1641192234,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798716,
                    id: 2798716,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640414735,
                    updated_at: 1641185821,
                    last_post_at: 1641185818,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798707,
                    id: 2798707,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640414037,
                    updated_at: 1641185833,
                    last_post_at: 1641185829,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798682,
                    bid: 2274675,
                    id: 2798682,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274675,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640413205,
                    updated_at: 1641192221,
                    last_post_at: 1641192219,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798677,
                    bid: 2274673,
                    id: 2798677,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274673,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640412623,
                    updated_at: 1646282958,
                    last_post_at: 1646282958,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798674,
                    id: 2798674,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640412507,
                    updated_at: 1641185407,
                    last_post_at: 1641185405,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798672,
                    bid: 2274673,
                    id: 2798672,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274673,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640412394,
                    updated_at: 1641192428,
                    last_post_at: 1641192425,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797945,
                    id: 2797945,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640367538,
                    updated_at: 1641383979,
                    last_post_at: 1641383489,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797934,
                    bid: 2293736,
                    id: 2797934,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640367226,
                    updated_at: 1641192795,
                    last_post_at: 1641192793,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2931910,
                    bid: 3188581,
                    id: 2931910,
                    beatmapset_id: 1087774,
                    beatmap_id: 3188581,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1646454300,
                    updated_at: 1646463882,
                    last_post_at: 1646463879,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2927102,
                    bid: 3188581,
                    id: 2927102,
                    beatmapset_id: 1087774,
                    beatmap_id: 3188581,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1646236309,
                    updated_at: 1646321368,
                    last_post_at: 1646282857,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 13806900,
                    did: 2919991,
                    bid: 2315668,
                    id: 2919991,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 13806900,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645897985,
                    updated_at: 1645938700,
                    last_post_at: 1645938697,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 1541323,
                    did: 2914566,
                    id: 2914566,
                    beatmapset_id: 1087774,
                    user_id: 1541323,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645635496,
                    updated_at: 1645952930,
                    last_post_at: 1645952925,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912967,
                    id: 2912967,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645563910,
                    updated_at: 1645627289,
                    last_post_at: 1645627284,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912952,
                    id: 2912952,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645563149,
                    updated_at: 1645622052,
                    last_post_at: 1645621796,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912946,
                    bid: 2315667,
                    id: 2912946,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315667,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645563037,
                    updated_at: 1645614785,
                    last_post_at: 1645614785,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912943,
                    bid: 2315667,
                    id: 2912943,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315667,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562870,
                    updated_at: 1645614827,
                    last_post_at: 1645614827,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912934,
                    bid: 2315666,
                    id: 2912934,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562446,
                    updated_at: 1645614708,
                    last_post_at: 1645614706,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912929,
                    bid: 2315666,
                    id: 2912929,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562186,
                    updated_at: 1645614673,
                    last_post_at: 1645614673,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912927,
                    bid: 2315666,
                    id: 2912927,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645562096,
                    updated_at: 1645614628,
                    last_post_at: 1645614628,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912924,
                    bid: 2315666,
                    id: 2912924,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315666,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561971,
                    updated_at: 1645614531,
                    last_post_at: 1645614531,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912914,
                    bid: 2315668,
                    id: 2912914,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561570,
                    updated_at: 1645614278,
                    last_post_at: 1645614278,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912907,
                    bid: 2315669,
                    id: 2912907,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561355,
                    updated_at: 1645613854,
                    last_post_at: 1645613851,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912904,
                    bid: 2315668,
                    id: 2912904,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645561221,
                    updated_at: 1645614432,
                    last_post_at: 1645614432,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912897,
                    bid: 2315668,
                    id: 2912897,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315668,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645560953,
                    updated_at: 1645618072,
                    last_post_at: 1645618072,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912886,
                    id: 2912886,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645560528,
                    updated_at: 1645622050,
                    last_post_at: 1645622047,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912874,
                    bid: 2315669,
                    id: 2912874,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645559898,
                    updated_at: 1645613553,
                    last_post_at: 1645613553,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912873,
                    bid: 2315669,
                    id: 2912873,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645559743,
                    updated_at: 1645613230,
                    last_post_at: 1645613230,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912867,
                    bid: 2315669,
                    id: 2912867,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645559535,
                    updated_at: 1645613059,
                    last_post_at: 1645613059,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912847,
                    bid: 2315669,
                    id: 2912847,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645558910,
                    updated_at: 1645612934,
                    last_post_at: 1645612934,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912826,
                    bid: 2315669,
                    id: 2912826,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645557749,
                    updated_at: 1645616924,
                    last_post_at: 1645616924,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 6291741,
                    did: 2912761,
                    id: 2912761,
                    beatmapset_id: 1087774,
                    user_id: 6291741,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1645556189,
                    updated_at: 1645621397,
                    last_post_at: 1645621397,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 7047319,
                    did: 2889518,
                    id: 2889518,
                    beatmapset_id: 1087774,
                    user_id: 7047319,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1644512046,
                    updated_at: 1644680229,
                    last_post_at: 1644680228,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 7047319,
                    did: 2887493,
                    id: 2887493,
                    beatmapset_id: 1087774,
                    user_id: 7047319,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1644410045,
                    updated_at: 1646027034,
                    last_post_at: 1646027034,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798752,
                    bid: 2274671,
                    id: 2798752,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274671,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640416835,
                    updated_at: 1641191766,
                    last_post_at: 1641191764,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798723,
                    bid: 3188581,
                    id: 2798723,
                    beatmapset_id: 1087774,
                    beatmap_id: 3188581,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640414983,
                    updated_at: 1646321372,
                    last_post_at: 1641192234,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798716,
                    id: 2798716,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640414735,
                    updated_at: 1641185821,
                    last_post_at: 1641185818,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798707,
                    id: 2798707,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640414037,
                    updated_at: 1641185833,
                    last_post_at: 1641185829,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798682,
                    bid: 2274675,
                    id: 2798682,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274675,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640413205,
                    updated_at: 1641192221,
                    last_post_at: 1641192219,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798677,
                    bid: 2274673,
                    id: 2798677,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274673,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640412623,
                    updated_at: 1646282958,
                    last_post_at: 1646282958,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798674,
                    id: 2798674,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640412507,
                    updated_at: 1641185407,
                    last_post_at: 1641185405,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2798672,
                    bid: 2274673,
                    id: 2798672,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274673,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640412394,
                    updated_at: 1641192428,
                    last_post_at: 1641192425,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797945,
                    id: 2797945,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640367538,
                    updated_at: 1641383979,
                    last_post_at: 1641383489,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797934,
                    bid: 2293736,
                    id: 2797934,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640367226,
                    updated_at: 1641192795,
                    last_post_at: 1641192793,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797930,
                    bid: 2293736,
                    id: 2797930,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640367156,
                    updated_at: 1641192941,
                    last_post_at: 1641192939,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797924,
                    bid: 2293736,
                    id: 2797924,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640367036,
                    updated_at: 1641192900,
                    last_post_at: 1641192898,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797914,
                    bid: 2293736,
                    id: 2797914,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640366764,
                    updated_at: 1641192757,
                    last_post_at: 1641192756,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797912,
                    bid: 2293736,
                    id: 2797912,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640366739,
                    updated_at: 1641197072,
                    last_post_at: 1641197070,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797900,
                    bid: 2293736,
                    id: 2797900,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 4682629,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640366477,
                    updated_at: 1641192616,
                    last_post_at: 1641192613,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797889,
                    id: 2797889,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640366106,
                    updated_at: 1641383983,
                    last_post_at: 1641383862,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797884,
                    bid: 2274672,
                    id: 2797884,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274672,
                    user_id: 4682629,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640365971,
                    updated_at: 1641196525,
                    last_post_at: 1641196524,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797883,
                    bid: 2274672,
                    id: 2797883,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274672,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640365913,
                    updated_at: 1641196754,
                    last_post_at: 1641196752,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797875,
                    id: 2797875,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640365792,
                    updated_at: 1641383941,
                    last_post_at: 1641383941,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797865,
                    bid: 2274672,
                    id: 2797865,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274672,
                    user_id: 4682629,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640365549,
                    updated_at: 1641196539,
                    last_post_at: 1641196536,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 4682629,
                    did: 2797847,
                    id: 2797847,
                    beatmapset_id: 1087774,
                    user_id: 4682629,
                    message_type: 'problem',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1640364752,
                    updated_at: 1641383958,
                    last_post_at: 1641383948,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786181,
                    id: 2786181,
                    beatmapset_id: 1087774,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639872991,
                    updated_at: 1640098235,
                    last_post_at: 1640098233,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786180,
                    bid: 2354446,
                    id: 2786180,
                    beatmapset_id: 1087774,
                    beatmap_id: 2354446,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639872933,
                    updated_at: 1639912014,
                    last_post_at: 1639911824,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786178,
                    bid: 2274676,
                    id: 2786178,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274676,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639872554,
                    updated_at: 1639911597,
                    last_post_at: 1639911597,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786177,
                    bid: 2293736,
                    id: 2786177,
                    beatmapset_id: 1087774,
                    beatmap_id: 2293736,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639872530,
                    updated_at: 1639915459,
                    last_post_at: 1639915457,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786170,
                    bid: 2274673,
                    id: 2786170,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274673,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639872078,
                    updated_at: 1639912006,
                    last_post_at: 1639912004,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786169,
                    bid: 2274675,
                    id: 2786169,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274675,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639871984,
                    updated_at: 1639912287,
                    last_post_at: 1639912286,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786168,
                    bid: 2274675,
                    id: 2786168,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274675,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639871972,
                    updated_at: 1639912407,
                    last_post_at: 1639912405,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786166,
                    bid: 2274675,
                    id: 2786166,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274675,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639871908,
                    updated_at: 1639912216,
                    last_post_at: 1639912214,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786164,
                    bid: 2274675,
                    id: 2786164,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274675,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639871866,
                    updated_at: 1639912457,
                    last_post_at: 1639912456,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2786162,
                    id: 2786162,
                    beatmapset_id: 1087774,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639871724,
                    updated_at: 1640098287,
                    last_post_at: 1640098283,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 11626462,
                    did: 2783932,
                    bid: 2315669,
                    id: 2783932,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 11626462,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639782926,
                    updated_at: 1639911112,
                    last_post_at: 1639911112,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 11626462,
                    did: 2783921,
                    bid: 2315669,
                    id: 2783921,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 11626462,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639782418,
                    updated_at: 1639907181,
                    last_post_at: 1639907181,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 11626462,
                    did: 2783904,
                    bid: 2315669,
                    id: 2783904,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 11626462,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639781367,
                    updated_at: 1639907081,
                    last_post_at: 1639907081,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 11626462,
                    did: 2783895,
                    bid: 2315669,
                    id: 2783895,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 11626462,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639780725,
                    updated_at: 1639907034,
                    last_post_at: 1639907034,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 11626462,
                    did: 2783888,
                    bid: 2315669,
                    id: 2783888,
                    beatmapset_id: 1087774,
                    beatmap_id: 2315669,
                    user_id: 11626462,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639779727,
                    updated_at: 1639906939,
                    last_post_at: 1639906939,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2778619,
                    bid: 3188581,
                    id: 2778619,
                    beatmapset_id: 1087774,
                    beatmap_id: 3188581,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639527722,
                    updated_at: 1639741492,
                    last_post_at: 1639741492,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2778617,
                    bid: 2274671,
                    id: 2778617,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274671,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639527614,
                    updated_at: 1639810800,
                    last_post_at: 1639810780,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2778616,
                    bid: 2274671,
                    id: 2778616,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274671,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639527580,
                    updated_at: 1639810845,
                    last_post_at: 1639810843,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
                {
                    resolved: true,
                    sid: 1087774,
                    uid: 5364763,
                    did: 2778613,
                    bid: 2274671,
                    id: 2778613,
                    beatmapset_id: 1087774,
                    beatmap_id: 2274671,
                    user_id: 5364763,
                    message_type: 'suggestion',
                    can_be_resolved: true,
                    can_grant_kudosu: true,
                    created_at: 1639527515,
                    updated_at: 1639912596,
                    last_post_at: 1639912596,
                    kudosu_denied: false,
                    starting_post: [Object]
                },
            ]
        }

) {
    // 导入模板
    let svg = readTemplate('template/Panel_N.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index_PN">)/;
    const reg_beatmap_A2 = /(?<=<g id="BeatMap_A2">)/;

    const reg_me = /(?<=<g id="Me_PN">)/;
    const reg_guest = /(?<=<g id="Guest_PN">)/;
    const reg_progress = /(?<=<g id="Progress_PN">)/;
    const reg_tag = /(?<=<g id="Tag_PN">)/;
    const reg_discussion = /(?<=<g id="Discussion_PN">)/;
    const reg_favorite = /(?<=<g id="Favorite_PN">)/;
    const reg_genre = /(?<=<g id="Genre_PN">)/;

    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PN1-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Nomination (!ymn)', 'N', 'v0.4.0 UU');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1
    const cardA2 = await card_A2(await PanelGenerate.beatMapSet2CardA2(data?.beatmapset));

    // 导入O1
    const cardO1 = await card_O1(await PanelGenerate.user2CardO1(data?.beatmapset?.user));

    // 导入一些标签
    const guest_title = torus.getTextPath('Guest Mappers', 60, 730, 30, 'left baseline', '#fff');
    const tag_title = torus.getTextPath('Tags', 60, 910, 30, 'left baseline', '#fff');
    const progress_title = torus.getTextPath('Ranking Progress', 510, 365, 30, 'left baseline', '#fff');
    const discussion_title = torus.getTextPath('Modding Discussion', 510, 645, 30, 'left baseline', '#fff');
    const favorite_title = torus.getTextPath('Favorites', 1630, 645, 30, 'left baseline', '#fff');
    const genre_title = torus.getTextPath('G/L', 1630, 925, 30, 'left baseline', '#fff');

    svg = replaceTexts(svg, [favorite_title, tag_title, progress_title, discussion_title, guest_title, genre_title], reg_index);

    // 插入1号卡标签
    const total_length = data?.more?.totalLength || 0;

    const diff_str_b = data?.more?.hostCount.toString() || '0';
    const diff_str_m = data?.more?.totalCount.toString() || '0';
    const star_str_b = data?.more?.minSR || '0';
    const star_str_m = data?.more?.maxSR || '0';
    const length_str_b = Math.floor(total_length / 60).toString();
    const length_str_m = (total_length % 60).toString().padStart(2, "0");

    const diff = torus.get2SizeTextPath(diff_str_b, '/' + diff_str_m, 42, 30, 120, 616, 'center baseline', '#fff');
    const star = (data?.more?.minSR !== "") ? torus.get2SizeTextPath(star_str_b, '~' + star_str_m, 42, 30, 255, 616, 'center baseline', '#fff') :
        torus.getTextPath(star_str_m,255, 616, 42,'center baseline', '#fff')
    ;
    const length = torus.get2SizeTextPath(length_str_b, ':' + length_str_m, 42, 30, 390, 616, 'center baseline', '#fff');

    const diff_index = torus.getTextPath('Diff', 120, 648, 24, 'center baseline', '#aaa');
    const star_index = torus.getTextPath('SR', 255, 648, 24, 'center baseline', '#aaa');
    const length_index = torus.getTextPath('Length', 390, 648, 24, 'center baseline', '#aaa');

    svg = replaceTexts(svg, [diff, star, length], reg_index);
    svg = replaceTexts(svg, [diff_index, star_index, length_index], reg_index);

    // 插入8号卡标签
    const pack_str = data?.beatmapset?.pack_tags[0] || "null";

    const stat_str = 'Not Solved ' + data?.more?.notSolvedCount
        + ' // Problem ' + data?.more?.problemCount
        + ' // Suggestion ' + data?.more?.suggestCount
        + ' // Pack ' + pack_str
        + ' // Rate ' + getRoundedNumberStr(data?.beatmapset?.publicRating, 2);

    const stat = torus.getTextPath(stat_str, 1570, 1025, 18, 'right baseline', '#aaa');

    svg = replaceTexts(svg, [stat], reg_discussion);

    // 导入 Tag
    const tag = getTagPanel(data?.more?.tags, 60, 940);

    // 导入 Guest
    const guest = await getGuestPanel(data?.beatmapset?.mappers, 54, 745);

    // 导入 Progress
    const progress = await getRankingProgressPanel(data?.beatmapset, data?.hype, 490, 330)

    // 导入 Favorite
    const favorite = await getFavoritePanel(data?.beatmapset?.recent_favourites, 1620, 660);

    svg = replaceText(svg, tag, reg_tag);
    svg = replaceText(svg, guest, reg_guest);
    svg = replaceText(svg, progress, reg_progress);
    svg = replaceText(svg, favorite, reg_favorite);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, await readNetImage(data?.beatmapset?.covers?.["cover@2x"], false), reg_banner);
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_beatmap_A2);
    svg = implantSvgBody(svg, 60, 350, cardO1, reg_me);

    return svg.toString();
}

async function getGuestPanel(guest = [], x = 54, y = 745) {
    let svg = "<g>";

    if (guest.length > 4) {
        for (const i in guest) {
            if (i >= 16) break;

            const u = guest[i];
            const dx = (i % 8) * 51 + x;
            const dy = Math.floor(i / 8) * 51 + y;

            svg += (`<g transform="translate(${dx} ${dy})">` + await label_N3(u) + '</g>');
        }
    } else {
        for (const i in guest) {
            const u = guest[i];
            const dx = i * 102 + x;

            svg += (`<g transform="translate(${dx} ${y})">` + await label_N4(u) + '</g>');
        }
    }

    svg += '</g>';
    return svg;
}

function getTagPanel(tags = [""], x, y, size = 18, color = '#3399CC', max_width = 390, max_column = 4) {
    let line = "";
    let column = 1;
    let out = "";

    const blank_width = PuHuiTi.getTextWidth(' ', size);

    for (const t of tags) {
        const width = PuHuiTi.getTextWidth(line, size);
        const t_width = PuHuiTi.getTextWidth(t, size);

        if (width < max_width && (width + t_width + blank_width) >= max_width) {
            out += PuHuiTi.getTextPath(line, x, y + 26 * (column - 1), size, 'left baseline', color);
            column ++;
            line = t;
        } else {
            if (line !== "") {
                line = line + ' ' + t;
            } else {
                line = t;
            }
        }

        if (column > max_column) {
            break;
        }
    }

    return out;
}

async function getRankingProgressPanel(s = {}, hype = [], x = 490, y = 330) {
    const hype_count = s?.hype ? s?.hype?.current : hype?.length;
    let hype_slot = 615 / 185; // 一般来说是 hype 相比于正常一格的长度比
    const nom_count = s?.nominations_summary?.current;
    const nom_slot = s?.nominations_summary?.required;
    const qua_count = (nom_count === nom_slot && nom_count !== 0) ? 1 : 0
    const rnk_count = (s?.ranked === 1) ? 1 : 0

    const isSpecialRanked = s?.ranked === 2 || s?.ranked === 4;


    const total_length = 1350;
    const slot = (nom_slot + (isSpecialRanked ? 1 : 2)); //特殊上架，只需要一个槽位

    //格子长度，包括一段空缺
    let slot_length = total_length / (hype_slot + slot);

    //分配长度
    if (slot_length <= 105) {
        slot_length = 105;
    }

    hype_slot = total_length - slot_length * slot;

    const x_hype = 20 + x;
    const x_nom = hype_slot + 5 + 20 + x;
    const x_qua = hype_slot + 5 + nom_slot * slot_length + 20 + x; //特殊上架的状态位置
    const x_rnk = hype_slot + 5 + (nom_slot + 1) * slot_length + 20 + x; //特殊上架不考虑

    const y_index = 67 + y;
    const y_rrect = 78 + y;
    const y_nominator = 110 + y;

    //分支
    let index = torus.getTextPath('Hype ' + hype_count + '/' + 5, x_hype, y_index, 24, 'left baseline')
        + torus.getTextPath('Nomination ' + nom_count + '/' + nom_slot, x_nom, y_index, 24, 'left baseline');
    let rrect = "";
    let icon = "";

    rrect += drawHype(x_hype, y_rrect, hype_slot * Math.min(1, hype_count / 5), hype_slot);
    rrect += drawRRect(nom_count, nom_slot, x_nom, y_rrect, slot_length - 5, '#B3FD66');

    const nominator = await drawNominators(x_nom, y_nominator, s?.nominators, slot_length)

    if (s?.ranked === 2) {
        //特殊上架 approved
        index += torus.getTextPath('Approved', x_qua, y_index, 24, 'left baseline');
        rrect += drawRRect(1, 1, x_qua, y_rrect, slot_length - 5, '#D7FEA6');
        icon += drawIcons(true, x_qua + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-qualified.png')
    } else if (s?.ranked === 4) {
        //特殊上架 loved
        index += torus.getTextPath('Loved', x_qua, y_index, 24, 'left baseline');
        rrect += drawRRect(1, 1, x_qua, y_rrect, slot_length - 5, '#FF66AA');
        icon += drawIcons(true, x_qua + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-loved.png')

    } else {
        //正常
        index += (torus.getTextPath('Qualified', x_qua, y_index, 24, 'left baseline') +
            torus.getTextPath('Ranked', x_rnk, y_index, 24, 'left baseline'));
        rrect += drawRRect(qua_count, 1, x_qua, y_rrect, slot_length - 5, '#D7FEA6') +
            drawRRect(rnk_count, 1, x_rnk, y_rrect, slot_length - 5, '#fff');
        icon += drawIcons(qua_count >= 1, x_qua + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-qualified.png') +
            drawIcons(rnk_count >= 1, x_rnk + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-ranked.png');
    }

    return (index + rrect + nominator + icon);

    //细分方法

    async function drawNominators(x, y, bn = [], slot_length) {
        let out = "";
        const half = (slot_length - 5) / 2;

        for (const i in bn) {
            const u = bn[i];
            const dx = x + (i * slot_length) + half - 50;

            out += await label_N1(dx, y, u, slot_length);
        }

        return out;
    }

    function drawIcons(isDraw = true, x, y, link) {
        if (isDraw) {
            return PanelDraw.Image(x, y, 50, 50, getExportFileV3Path(link));
        } else {
            return '';
        }
    }


    function drawHype(x, y, length, blank_length = length, color = '#82BA44', full_color = '#46393F') {
        return PanelDraw.Rect(x, y, blank_length, 15, 7.5, full_color) + PanelDraw.Rect(x, y, length, 15, 7.5, color);
    }


    function drawRRect(count, slot, x, y, length, color = '#fff', full_color = '#46393F') {
        let out = "";

        for (let i = 0; i < slot; i++) {
            out += PanelDraw.Rect(x + (length + 5) * i, y, length, 15, 7.5, full_color);
        }

        for (let j = 0; j < count; j++) {
            out += PanelDraw.Rect(x + (length + 5) * j, y, length, 15, 7.5, color);
        }
        return out;
    }

}

async function getFavoritePanel(fav = [], x = 1620, y = 660) {
    let svg = "<g>";

    for (const i in fav) {
        if (i >= 20) break;

        const u = fav[i];
        const dx = (i % 5) * 51 + x;
        const dy = Math.floor(i / 5) * 51 + y;

        svg += (`<g transform="translate(${dx} ${dy})">` + await label_N3(u) + '</g>');
    }

    svg += '</g>';
    return svg;
}

// label 内置比较好


async function label_N1(x = 0, y = 0, u = {}, max_width = 100) {
    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LN1">
      <circle cx="50" cy="50" r="50" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="RRect_LN1">
  </g>
  <g id="Avatar_LN1">
    <circle cx="50" cy="50" r="50" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LN1);">
    </g>
  </g>
  <g id="Label_LN1">
  </g>
  <g id="Text_LN1">
  </g>`
    //正则
    const reg_text = /(?<=<g id="Text_LN1">)/;
    const reg_label = /(?<=<g id="Label_LN1">)/;
    //const reg_rrect = /(?<=<g id="RRect_LN1">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LN1\);">)/;

    //定义文本
    const avatar = await readNetImage(u?.avatar_url, false, getExportFileV3Path('avatar-guest.png'));

    //获取用户组或者玩家组简称
    const abbr_text = (g = u?.default_group) => {
        switch (g) {
            case "bng": return 'B';
            case "nat": return 'N';
            case "gmt": return 'G';
            case "alm": return 'A';
            case "ppy": return 'Y';
            case "bot": return 'T';
            case "dev": return 'D';
            case "spt": return 'S';
            case "lvd": return 'L';
            case "bsc": return 'C';
            default: return '';
        }
    }
    const abbr_color = u?.profile_colour || 'none';

    const abbr = torus.getTextPath(abbr_text(u?.default_group), 15, 15.877, 18, 'center baseline', '#fff');
    const abbr_rrect = PanelDraw.Rect(0, 0, 30, 20, 10, abbr_color);

    const name = torus.getTextPath(
        torus.cutStringTail(u?.username, 18, Math.max(max_width, 100), true)
        , 50, 118, 18, 'center baseline', '#fff');
    const uid = torus.getTextPath(u?.id.toString(), 50, 138, 16, 'center baseline', '#fff');

    //插入文本
    svg = implantImage(svg, 100, 100, 0, 0, 1, avatar, reg_avatar);
    svg = replaceText(svg, abbr, reg_text);
    svg = replaceText(svg, abbr_rrect, reg_label);
    svg = replaceText(svg, name, reg_text);
    svg = replaceText(svg, uid, reg_text);

    return transformSvgBody(x, y, svg);
}

async function label_N3(u = {}) {

    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LN3-1">
      <circle cx="22.5" cy="22.5" r="22.5" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LN3">
    <circle cx="22.5" cy="22.5" r="22.5" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LN3-1);">
    </g>
  </g>
  <g id="Label_LN3">
  </g>`

    //正则
    let reg_label = /(?<=<g id="Label_LN3">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LN3-1\);">)/;

    //定义文本
    const label_color = PanelDraw.Circle(37.5, 37.5, 7.5, u?.profile_colour || 'none');

    //插入文本
    svg = replaceText(svg, label_color, reg_label);

    //插入图片
    svg = implantImage(svg, 45, 45, 0, 0, 1, await readNetImage(u?.avatar_url, false, getExportFileV3Path('avatar-guest.png')), reg_avatar);

    return svg.toString();
}

async function label_N4(u = {}) {

    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LN4-1">
      <circle cx="48" cy="35" r="35" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LN4">
    <circle cx="48" cy="35" r="35" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LN4-1);">
    </g>
  </g>
  <g id="Label_LN4">
  </g>
  <g id="Text_LN4">
  </g>`

    //正则
    let reg_text = /(?<=<g id="Text_LN4">)/;
    let reg_label = /(?<=<g id="Label_LN4">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LN4-1\);">)/;

    //定义文本
    let name = torus.getTextPath(
        torus.cutStringTail(u?.username || '', 18, 96)
        , 48, 88, 18, 'center baseline', '#fff');

    const label_color = PanelDraw.Circle(73, 60, 10, u?.profile_colour || 'none');

    //插入文本
    svg = replaceText(svg, name, reg_text);
    svg = replaceText(svg, label_color, reg_label);

    //插入图片
    svg = implantImage(svg, 70, 70, 13, 0, 1, await readNetImage(u?.avatar_url, false, getExportFileV3Path('avatar-guest.png')), reg_avatar);

    return svg.toString();
}
