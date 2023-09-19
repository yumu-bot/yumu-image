import {
    exportJPEG, getExportFileV3Path, getPanelNameSVG,
    getRandomBannerPath, getTimeDifference,
    implantImage, implantSvgBody, PanelDraw,
    PanelGenerate,
    readTemplate,
    replaceText, replaceTexts
} from "../util.js";
import {torus} from "../font.js";
import {card_A1} from "../card/card_A1.js";
import {card_O1} from "../card/card_O1.js";
import {card_O2} from "../card/card_O2.js";
import {card_O3} from "../card/card_O3.js";
import {card_O4} from "../card/card_O4.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_M(data);
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
        "nominated_beatmapset_count": null,
        "beatmap_playcounts_count": 6766,
        "unranked_beatmapset_count": 2,
        "favourite_beatmapset_count": 84,
        "graveyard_beatmapset_count": 112,
        "groups": [],
        "guest_beatmapset_count": 23,
        "loved_beatmapset_count": 0,
        "mapping_follower_count": 56,
        "has_supported": true,
        "join_date": "2020-05-15T14:10:44+00:00",
        "kudosu": {
            "total": 391,
            "available": 391
        },
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
        }],//根据游玩数量排序，走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，给6张即可。

    most_recent_ranked_beatmap: {},//需要判断，如果玩家的ranked_and_approved_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）是uid所指的人的那张谱面即可。如果没有结果返回空
    most_recent_ranked_guest_diff: {}, //需要判断，如果玩家的guest_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）不是uid所指的人的那张谱面即可。如果没有结果返回空


    difficulty_arr: [], //星数数组。0-2 2-2.8 2.8-4 4-5.3 5.3-6.5 6.5-8 8-10 10-无穷，包括前面不包括后面
    length_arr: [], //0到10，给上面搜过的谱面里这个数据的总和即可："ratings": [];

    // 这是啥
    genre: [0, 0, 0, 1, 0, 1, 0], //unspecified, video game, anime, rock, pop, other, novelty, hip hop, electronic, metal, classical, folk, jazz
    //搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any

    //Get User Recent Activity，需要筛选出"type": "beatmapsetUpdate", "type": "beatmapsetRanked",类似的种类，获取100条（两页
    recent_activity: [
        {
            "created_at": "2023-08-26T10:10:40+00:00",
            "createdAt": "2023-08-26T10:10:40+00:00",
            "id": 806548619,
            "type": "beatmapsetDelete",
            "beatmapset": {
                "title": "Suzumisiro - Candy Melody",
                "url": "/beatmapsets/1576867"
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
        {
            "created_at": "2023-08-19T09:02:58+00:00",
            "createdAt": "2023-08-19T09:02:58+00:00",
            "id": 805399429,
            "type": "beatmapsetApprove",
            "approval": "ranked",
            "beatmapset": {
                "title": "Mitsukiyo - Midsummer cat",
                "url": "/beatmapsets/2021170"
            },
            "user": {
                "username": "Setu",
                "url": "/users/12190421"
            }
        }
    ]
}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_M.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index_PM">)/;
    const reg_me_A1 = /(?<=<g id="Me_Card_A1">)/;

    const reg_me = /(?<=<g id="Me_PM">)/;
    const reg_popular = /(?<=<g id="Popular_PM">)/;
    const reg_difficulty = /(?<=<g id="Difficulty_PM">)/;
    const reg_activity = /(?<=<g id="Activity_PM">)/;
    const reg_recent = /(?<=<g id="Recent_PM">)/;
    const reg_length = /(?<=<g id="Length_PM">)/;
    const reg_genre = /(?<=<g id="Genre_PM">)/;

    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PM1-1\);">)/;
    const reg_genre_pie = /(?<=<g style="clip-path: url\(#clippath-PM1-2\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('I\'m Mapper (!ymim)', 'IM', 'v0.3.2 FT');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1
    const cardA1 = await card_A1(await PanelGenerate.mapper2CardA1(data.user), true);

    // 导入O1
    const cardO1 = await card_O1(await PanelGenerate.user2CardO1(data.user), true);

    // 导入O2
    for (let i = 0; i < Math.min(data.most_popular_beatmap.length, 6); i++) {
        const x = 510 + (i % 3) * 305;
        const y = 380 + Math.floor(i / 3) * 145;

        const cardO2 = await card_O2(await PanelGenerate.beatmap2CardO2(data.most_popular_beatmap[i]), true);
        svg = implantSvgBody(svg, x, y, cardO2, reg_popular);
    }

    // 导入一些标签
    const popular_title = torus.getTextPath('Most Popular Beatmap', 510, 365, 30, 'left baseline', '#fff');
    const difficulty_title = torus.getTextPath('Difficulty', 1470, 365, 30, 'left baseline', '#fff');
    const length_title = torus.getTextPath('Length', 1470, 615, 30, 'left baseline', '#fff');
    const genre_title = torus.getTextPath('Genre', 60, 730, 30, 'left baseline', '#fff');
    const activity_title = torus.getTextPath('Recent Activity', 510, 730, 30, 'left baseline', '#fff');
    const recent_title = torus.getTextPath('Recent Host/Guest', 1120, 730, 30, 'left baseline', '#fff');

    const diff_index = torus.getTextPath('  0       2       2.8      4       5.3      6.5       8       10      ...',
        1450, 550, 18, 'left baseline', '#fff');
    const length_index = torus.getTextPath('  0   1:00   1:30   2:00   2:30   3:00   3:30   4:00    ...',
        1450, 800, 18, 'left baseline', '#fff');
    svg = replaceTexts(svg, [diff_index, length_index, popular_title, difficulty_title, length_title, genre_title, activity_title, recent_title], reg_index);

    // 导入难度
    const diff_rrect = PanelDraw.BarChart(data.difficulty_arr, null, 0, 1460, 380 + 145, 410, 145, 4, 4, '#E6AD59', null, 2)
    svg = replaceText(svg, diff_rrect, reg_difficulty);

    // 导入评价
    const length_rrect = PanelDraw.BarChart(data.length_arr, null, 0, 1460, 380 + 145 + 250, 410, 145, 4, 4, '#88BD6F', null, 2)
    svg = replaceText(svg, length_rrect, reg_length);

    // 导入风格饼图
    const genre_arr = data.genre || [];
    const genre_color = ['#AAA',
        '#D56E4B', '#DD8D52', '#E6AD59', '#FFF767',
        '#ADCE6D', '#88BD6F', '#62AE70', '#5EB0AB',
        '#55B1EF', '#587EC2', '#5867AF', '#75569E'
    ]
    const genre_name = ['unspecified', 'video game', 'anime', 'rock', 'pop', 'other', 'novelty', 'hip hop', 'electronic', 'metal', 'classical', 'folk', 'jazz'];
    const genre_sum = genre_arr.reduce((prev, curr) => {return prev + curr}, 0);

    let genre_svg = '';
    genre_arr.reduce((prev, curr, i) => {
        const curr_percent = prev + curr / genre_sum;
        const color = genre_color[i];
        genre_svg += PanelDraw.PieChart(curr_percent, 150, 825, 100, prev, color);
        return curr_percent;
    }, 0);

    genre_svg += PanelDraw.Image(150 - 70, 825 - 70, 140, 140, getExportFileV3Path('object-piechart-overlay2.png'), 1);
    svg = replaceText(svg, genre_svg, reg_genre_pie);

    // 导入曲风饼图的排序
    let sortMap = new Map();
    let sortKey = [];
    let sortValue = [];

    genre_color.forEach((v, i) => {
        sortMap.set(i, genre_arr[i])
    })
    const arrayObj = Array.from(sortMap);
    arrayObj.sort(function (prev,curr) {
        return curr[1] - prev[1];
    })
    for (const [key, value] of arrayObj) {
        sortKey.push(key);
        sortValue.push(value);
    }

    let cardO3s = [];
    cardO3s.push(await card_O3({title: 'Total', number: genre_sum, color: '#AAA'}, true));
    for (let i = 0; i < 10; i++) {
        cardO3s.push(await card_O3({
            title: genre_name[sortKey[i]], number: sortValue[i], color: genre_color[sortKey[i]]
        }, true));
    }

    svg = implantSvgBody(svg, 60, 910, cardO3s.shift(), reg_genre);
    for (let i = 0; i < 10; i++) {
        if (i < 8) {
            svg = implantSvgBody(svg, 260, 710 + 40 * i, cardO3s[i], reg_genre);
        } else {
            svg = implantSvgBody(svg, 60, 950 + 40 * (i - 8), cardO3s[i], reg_genre);
        }
    }

    // 导入最近活动卡
    let cardO4s = [];
    const recent_activity = data.recent_activity || [];

    for (let i = 0; i < Math.min(recent_activity.length, 7); i++) {
        const v = recent_activity[i];
        const delta_time = getTimeDifference(v.created_at, 'X');

        cardO4s.push(await card_O4({
            type: v.type, approval: v.approval, title: v.beatmapset.title, time: delta_time,
        }, true));
    }

    for (let i = 0; i < Math.min(recent_activity.length, 7); i++) {
        svg = implantSvgBody(svg, 510, 750 + 40 * i, cardO4s[i], reg_activity);
    }

    // 导入最近卡
    const O2g = await PanelGenerate.beatmap2CardO2(data.most_recent_ranked_guest_diff);
    const O2g_title2 = data.most_recent_ranked_guest_diff ? data.most_recent_ranked_guest_diff.creator + ' (' + data.most_recent_ranked_guest_diff.artist  + ')' : '';

    const cardO2h = await card_O2(await PanelGenerate.beatmap2CardO2(data.most_recent_ranked_beatmap), true);
    const cardO2g = await card_O2({...O2g, title2: O2g_title2}, true);

    svg = implantSvgBody(svg, 1120, 745, cardO2h, reg_recent);
    svg = implantSvgBody(svg, 1120, 890, cardO2g, reg_recent);


    // 插入1号卡标签
    const rank_str = data.user.ranked_and_approved_beatmapset_count ? data.user.ranked_and_approved_beatmapset_count.toString() : '0';
    const pending_str = data.user.unranked_beatmapset_count ? data.user.unranked_beatmapset_count.toString() : '0'
    const pending_slot_str = getPendingSlot(data.user.is_supporter, data.user.ranked_and_approved_beatmapset_count).toString();
    const guest_str = data.user.guest_beatmapset_count ? data.user.guest_beatmapset_count.toString() : '0';

    const rank = torus.getTextPath(rank_str, 120, 616, 42, 'center baseline', '#fff');
    const pending = torus.get2SizeTextPath(pending_str, '/' + pending_slot_str, 42, 30, 255, 616, 'center baseline', '#fff');
    const guest = torus.getTextPath(guest_str, 390, 616, 42, 'center baseline', '#fff');

    const rank_index = torus.getTextPath('Ranked', 120, 648, 24, 'center baseline', '#aaa');
    const pending_index = torus.getTextPath('Pending', 255, 648, 24, 'center baseline', '#aaa');
    const guest_index = torus.getTextPath('Guest', 390, 648, 24, 'center baseline', '#aaa');

    svg = replaceTexts(svg, [rank, pending, guest], reg_difficulty);
    svg = replaceTexts(svg, [rank_index, pending_index, guest_index], reg_recent);

    // 插入8号卡标签
    const favorite_str = data.user.favourite_beatmapset_count ? data.user.favourite_beatmapset_count.toString() : '0';
    const kudosu_str = data.user.kudosu.total ? data.user.kudosu.total.toString() : '0'
    const comment_str = data.user.comments_count ? data.user.comments_count.toString() : '0';
    const nominated_str = data.user.nominated_beatmapset_count ? data.user.nominated_beatmapset_count.toString() : '0';
    const loved_str = data.user.loved_beatmapset_count ? data.user.loved_beatmapset_count.toString() : '0'
    const graveyard_str = data.user.graveyard_beatmapset_count ? data.user.graveyard_beatmapset_count.toString() : '0';

    const favorite = torus.getTextPath(favorite_str, 1530, 882, 42, 'center baseline', '#fff');
    const kudosu = torus.getTextPath(kudosu_str, 1665, 882, 42, 'center baseline', '#fff');
    const comment = torus.getTextPath(comment_str, 1800, 882, 42, 'center baseline', '#fff');
    const nominated = torus.getTextPath(nominated_str, 1530, 978, 42, 'center baseline', '#fff');
    const loved = torus.getTextPath(loved_str, 1665, 978, 42, 'center baseline', '#fff');
    const graveyard = torus.getTextPath(graveyard_str, 1800, 978, 42, 'center baseline', '#fff');

    const favorite_index = torus.getTextPath('Favorite', 1530, 916, 24, 'center baseline', '#aaa');
    const kudosu_index = torus.getTextPath('Kudosu', 1665, 916, 24, 'center baseline', '#aaa');
    const comment_index = torus.getTextPath('Comment', 1800, 916, 24, 'center baseline', '#aaa');
    const nominated_index = torus.getTextPath('Nominated', 1530, 1012, 24, 'center baseline', '#aaa');
    const loved_index = torus.getTextPath('Loved', 1665, 1012, 24, 'center baseline', '#aaa');
    const graveyard_index = torus.getTextPath('Graveyard', 1800, 1012, 24, 'center baseline', '#aaa');

    svg = replaceTexts(svg, [favorite, kudosu, comment, nominated, loved, graveyard], reg_activity);
    svg = replaceTexts(svg, [favorite_index, kudosu_index, comment_index, nominated_index, loved_index, graveyard_index], reg_length);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_me_A1);
    svg = implantSvgBody(svg, 60, 350, cardO1, reg_me);

    return svg.toString();
}

function getPendingSlot(isSupporter = false, ranked = 0) {
    let slot;
    if (isSupporter) {
        slot = 8 + Math.min(ranked, 12);
    } else {
        slot = 4 + Math.min(ranked, 4);
    }
    return slot;
}
