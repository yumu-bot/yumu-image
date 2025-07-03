import {
    exportJPEG, getImageFromV3, getPanelNameSVG, getTimeDifference,
    setImage, setSvgBody, readTemplate,
    setText, setTexts, floor, floors, thenPush, getSvgBody
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A1} from "../card/card_A1.js";
import {card_O1} from "../card/card_O1.js";
import {card_O2} from "../card/card_O2.js";
import {card_O3} from "../card/card_O3.js";
import {card_O4} from "../card/card_O4.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import moment from "moment";

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

/**
 * 麻婆信息面板, 展示麻婆谱面的
 * !im xxx
 * @param data
 * @return {Promise<string>}
 */
export async function panel_M(data = {
    user: {}, //getUser

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
            }, ]
        }],//根据游玩数量排序，走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，给6张即可。

    most_recent_ranked_beatmap: {},//需要判断，如果玩家的ranked_and_approved_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）是uid所指的人的那张谱面即可。如果没有结果返回空
    most_recent_ranked_guest_diff: {}, //需要判断，如果玩家的guest_beatmapset_count不为0，则走search，搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any，筛选出ranked/qualified中。上传时间最靠前，但是谱面主（host）不是uid所指的人的那张谱面即可。如果没有结果返回空


    difficulty_arr: [], //星数数组。0-2 2-2.8 2.8-4 4-5.3 5.3-6.5 6.5-8 8-10 10-无穷，包括前面不包括后面
    length_arr: [], //0到10，给上面搜过的谱面里这个数据的总和即可："ratings": [];

    // 这是啥
    genre: [0, 0, 0, 1, 0, 1, 0], //unspecified, video game, anime, rock, pop, other, novelty, hip hop, electronic, metal, classical, folk, jazz
    //搜索https://osu.ppy.sh/beatmapsets?q=creator%3D（uid）&s=any

    //Get User Recent Activity，需要筛选出 "type": "beatmapsetUpdate", "type": "beatmapsetRanked",类似的种类，获取100条（两页
    recent_activity: [
        {
            "created_at": "2023-08-26T10:10:40+00:00",
            "id": 806548619,
            "type": "beatmapsetDelete",
            "beatmapset": {
                "title": "Suzumisiro - Candy Melody",
                "url": "/beatmapsets/1576867"
            }
        },
        {
            "created_at": "2023-08-13T13:45:32+00:00",
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
    ],
    playcount: 0,
    favorite: 0,
}) {
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
    const panel_name = getPanelNameSVG('I\'m Mapper (!ymim)', 'IM');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1
    const cardA1 = await card_A1(await PanelGenerate.mapper2CardA1(data.user));

    // 导入O1
    const cardO1 = card_O1(await PanelGenerate.user2CardO1(data.user));

    // 导入O2

    const params = []
    const cardO2s = []

    await Promise.allSettled(
        data.most_popular_beatmap.map((v) => {
            return PanelGenerate.beatmap2CardO2(v)
        })
    ).then(results => thenPush(results, params))

    await Promise.allSettled(
        params.map((v) => {
            return card_O2(v)
        })
    ).then(results => thenPush(results, cardO2s))

    let stringO2s = ''

    for (let i = 0; i < Math.min(data.most_popular_beatmap?.length || 0, 6); i++) {
        const x = 510 + (i % 3) * 305;
        const y = 380 + Math.floor(i / 3) * 145;

        stringO2s += getSvgBody(x, y, cardO2s[i]);
    }

    svg = setText(svg, stringO2s, reg_popular)

    if ((data.most_popular_beatmap?.length || 0) < 1) { //摆烂机制
        svg = setImage(svg, 867.5, 410, 185, 185, getImageFromV3('sticker_qiqi_oh.png'), reg_popular, 1);
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
    const length_index = torus.getTextPath('  0    1:00   1:40   2:20   3:00   3:40   4:20   5:00    ...',
        1450, 800, 18, 'left baseline', '#fff');

    // 导入2卡右侧的pc和fav
    const kudosu = floor(data.user.kudosu.total || 0, 2) + ' kds';
    const kudosu_index = torus.getTextPath(kudosu, 1410, 365 - 3, 24, 'right baseline', '#aaa');

    svg = setTexts(svg, [diff_index, length_index, popular_title, difficulty_title, length_title, genre_title, activity_title, recent_title, kudosu_index], reg_index);

    // 导入难度
    const difficulty_arr = data?.difficulty_arr || [];
    const diff_rrect = PanelDraw.BarChart(difficulty_arr, null, 0, 1460, 380 + 145, 410, 145, 4, 4, '#E6AD59', null, 2)
    svg = setText(svg, diff_rrect, reg_difficulty);

    // 导入评价
    const length_rrect = PanelDraw.BarChart(data.length_arr, null, 0, 1460, 380 + 145 + 250, 410, 145, 4, 4, '#88BD6F', null, 2)
    svg = setText(svg, length_rrect, reg_length);

    // 导入风格饼图
    const genre_arr = data.genre || [];
    const genre_color = ['#AAA',
        '#D56E4B', '#DD8D52', '#E6AD59', '#FFF767',
        '#ADCE6D', '#88BD6F', '#62AE70', '#5EB0AB',
        '#55B1EF', '#587EC2', '#5867AF', '#75569E'
    ]
    const genre_name = ['unspecified',
        'video game', 'anime', 'rock', 'pop',
        'other', 'novelty', 'hip hop', 'electronic',
        'metal', 'classical', 'folk', 'jazz'];
    const genre_sum = genre_arr.reduce((prev, curr) => {return prev + curr}, 0) || 0;

    let genre_svg = '';

    if (genre_sum > 0) {
        genre_arr.reduce((prev, curr, i) => {
            const curr_percent = prev + curr / genre_sum;
            const color = genre_color[i];
            genre_svg += PanelDraw.Pie(150, 825, 100, curr_percent, prev, color);
            return curr_percent;
        }, 0);

        genre_svg += PanelDraw.Image(150 - 70, 825 - 70, 140, 140, getImageFromV3('object-piechart-overlay2.png'), 1);

        svg = setText(svg, genre_svg, reg_genre_pie);
    }

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
    cardO3s.push(card_O3({title: 'Total', number: genre_sum, color: '#AAA'}));
    for (let i = 0; i < 10; i++) {
        cardO3s.push(card_O3({
            title: genre_name[sortKey[i]], number: sortValue[i], color: genre_color[sortKey[i]]
        }));
    }

    svg = setSvgBody(svg, 60, 910, cardO3s.shift(), reg_genre);

    let stringO3s = ''

    for (let i = 0; i < 10; i++) {
        if (i < 8) {
            stringO3s += getSvgBody(260, 710 + 40 * i, cardO3s[i]);
        } else {
            stringO3s += getSvgBody(60, 950 + 40 * (i - 8), cardO3s[i]);
        }
    }

    svg = setText(svg, stringO3s, reg_genre)

    // 导入最近活动卡
    let cardO4s = [];
    const recent_activity = data.recent_activity || [];

    await Promise.allSettled(
        recent_activity.slice(0, Math.min(recent_activity.length, 7)).map((v) => {
            const delta_time = getTimeDifference(v.created_at, 'YYYY-MM-DD[T]HH:mm:ss[Z]', moment());

            return card_O4({
                type: v.type,
                approval: v.approval,
                title: v.beatmapset.title,
                time: delta_time,
                background: v.beatmapset?.covers?.list || ('https://assets.ppy.sh/beatmaps/' + v.beatmapset.id + '/covers/list.jpg'),
            })
        })
    ).then(results => thenPush(results, cardO4s))

    let stringO4s = ''

    for (let i = 0; i < Math.min(recent_activity.length, 7); i++) {
        stringO4s += getSvgBody(510, 750 + 40 * i, cardO4s[i]);
    }

    svg = setText(svg, stringO4s, reg_activity)

    if (recent_activity.length < 1) { //摆烂机制
        svg = setImage(svg, 692.5, 770, 185, 185, getImageFromV3('sticker_qiqi_fallen.png'), reg_activity, 1);
    }

    // 导入最近卡
    const O2g_title2 = data.most_recent_ranked_guest_diff ? data.most_recent_ranked_guest_diff.creator + ' (' + data.most_recent_ranked_guest_diff.artist  + ')' : '';

    const O2s = []

    await Promise.allSettled([
        PanelGenerate.beatmap2CardO2(data.most_recent_ranked_beatmap),
        PanelGenerate.beatmap2CardO2(data.most_recent_ranked_guest_diff),
    ]).then(results => thenPush(results, O2s))

    let o2g = eval(O2s[1])

    if (o2g != null) {
        o2g.title2 = O2g_title2
    } else {
        o2g = '';
    }

    const cardO2h = card_O2(O2s[0]);
    const cardO2g = card_O2(o2g);

    const stringO2hg = getSvgBody(1120, 745, cardO2h) + getSvgBody(1120, 890, cardO2g)

    svg = setText(svg, stringO2hg, reg_recent);

    // 插入1号卡标签
    const rank_str = data?.user?.ranked_beatmapset_count.toString() || '0';
    const pending_str = data?.user?.pending_beatmapset_count.toString() || '0';
    const pending_slot_str = getPendingSlot(data.user.is_supporter, data?.user?.ranked_beatmapset_count).toString();
    const guest_str = data?.user?.guest_beatmapset_count.toString() || '0';

    const rank = torus.getTextPath(rank_str, 120, 616, 42, 'center baseline', '#fff');
    const pending = torus.get2SizeTextPath(pending_str, '/' + pending_slot_str, 42, 30, 255, 616, 'center baseline', '#fff');
    const guest = torus.getTextPath(guest_str, 390, 616, 42, 'center baseline', '#fff');

    const rank_index = torus.getTextPath('Ranked', 120, 648, 24, 'center baseline', '#aaa');
    const pending_index = torus.getTextPath('Pending', 255, 648, 24, 'center baseline', '#aaa');
    const guest_index = torus.getTextPath('Guest', 390, 648, 24, 'center baseline', '#aaa');

    svg = setTexts(svg, [rank, pending, guest], reg_difficulty);
    svg = setTexts(svg, [rank_index, pending_index, guest_index], reg_recent);

    // 插入8号卡标签
    const favorite_number = floors(data.favorite, 2)
    const favorite_b_str = favorite_number.integer
    const favorite_m_str = favorite_number.decimal
    const playcount_number = floors(data.playcount, 1)
    const playcount_b_str = playcount_number.integer
    const playcount_m_str = playcount_number.decimal
    const comment_str = floor(data.user.comments_count, -4);
    const nominated_str = floor(data.user.nominated_beatmapset_count, -4);
    const loved_str = floor(data.user.loved_beatmapset_count, -4);
    const graveyard_str = floor(data.user.graveyard_beatmapset_count, -4);

    const favorite = torus.get2SizeTextPath(favorite_b_str, favorite_m_str, 42, 30, 1530, 882, 'center baseline', '#fff');
    const playcount = torus.get2SizeTextPath(playcount_b_str, playcount_m_str, 42, 30, 1665, 882, 'center baseline', '#fff');
    const comment = torus.getTextPath(comment_str, 1800, 882, 42, 'center baseline', '#fff');
    const nominated = torus.getTextPath(nominated_str, 1530, 978, 42, 'center baseline', '#fff');
    const loved = torus.getTextPath(loved_str, 1665, 978, 42, 'center baseline', '#fff');
    const graveyard = torus.getTextPath(graveyard_str, 1800, 978, 42, 'center baseline', '#fff');

    const favorite_index = torus.getTextPath('Favorite', 1530, 916, 24, 'center baseline', '#aaa');
    const playcount_index = torus.getTextPath('Play Count', 1665, 916, 24, 'center baseline', '#aaa');
    const comment_index = torus.getTextPath('Comment', 1800, 916, 24, 'center baseline', '#aaa');
    const nominated_index = torus.getTextPath('Nominated', 1530, 1012, 24, 'center baseline', '#aaa');
    const loved_index = torus.getTextPath('Loved', 1665, 1012, 24, 'center baseline', '#aaa');
    const graveyard_index = torus.getTextPath('Graveyard', 1800, 1012, 24, 'center baseline', '#aaa');

    svg = setTexts(svg, [favorite, playcount, comment, nominated, loved, graveyard], reg_activity);
    svg = setTexts(svg, [favorite_index, playcount_index, comment_index, nominated_index, loved_index, graveyard_index], reg_length);

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);
    svg = setSvgBody(svg, 40, 40, cardA1, reg_me_A1);
    svg = setSvgBody(svg, 60, 350, cardO1, reg_me);

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
