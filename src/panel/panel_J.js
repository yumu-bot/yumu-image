import {
    exportJPEG, getExportFileV3Path, getGameMode, getPanelNameSVG,
    implantImage,
    implantSvgBody, maximumArrayToFixedLength, modifyArrayToFixedLength, readNetImage,
    readTemplate,
    replaceText, replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A1} from "../card/card_A1.js";
import {card_J} from "../card/card_J.js";
import {card_L} from "../card/card_L.js";
import {label_J1, label_J2, label_J3, RANK_OPTION} from "../component/label.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getModColor, getRankColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRandomBannerPath, pp2UserBG} from "../util/mascotBanner.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_J(data);
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
        const svg = await panel_J(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
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
                "pp_7K": null,
                "pp_4K": null,
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
            length: 719, //length给秒数（整数）
            combo: 719, //combo给连击（整数）
            ranking: 1, //排名，得自己计数，bp是bp几
            cover: "https://assets.ppy.sh/beatmaps/382400/covers/list@2x.jpg?1622096843", //bp.beatmapset.covers['list@2x']
            star: 6.38, // 实际star
            rank: "A", // bp.rank
            mods: ['HR']
        },
    ],

    bpSR: [
        {
            length: 719, //length给秒数（整数）
            combo: 719, //combo给连击（整数）
            ranking: 1, //排名，得自己计数，bp是bp几
            cover: "https://assets.ppy.sh/beatmaps/382400/covers/list@2x.jpg?1622096843", //bp.beatmapset.covers['list@2x']
            star: 6.38, // 实际star
            rank: "A", // bp.rank
            mods: ['HR']
        },
    ],

    bpCombo: [
        {
            length: 719, //length给秒数（整数）
            combo: 719, //combo给连击（整数）
            ranking: 1, //排名，得自己计数，bp是bp几
            cover: "https://assets.ppy.sh/beatmaps/382400/covers/list@2x.jpg?1622096843", //bp.beatmapset.covers['list@2x']
            star: 6.38, // 实际star
            rank: "A", // bp.rank
            mods: ['HR']
        },
    ], //数据格式同上

    bpBPM: [], //这个有意义吗？

    favorite_mappers_count: 34,
    // 最喜爱谱师，只需要给6个
    favorite_mappers: [
        {
            avatar_url: "https://a.ppy.sh/17064371?1675693670.jpeg",
            username: "-Spring Night-",
            map_count: 50,
            pp_count: 16247,
        },
        {
            avatar_url: "https://a.ppy.sh/17064371?1675693670.jpeg",
            username: "-Spring Night-",
            map_count: 50,
            pp_count: 16247,
        },
        {
            avatar_url: "https://a.ppy.sh/17064371?1675693670.jpeg",
            username: "-Spring Night-",
            map_count: 50,
            pp_count: 16247,
        },
        {
            avatar_url: "https://a.ppy.sh/17064371?1675693670.jpeg",
            username: "-Spring Night-",
            map_count: 50,
            pp_count: 16247,
        },
    ],

    // 右上角的 BP 分布，给数组
    pp_raw_arr: [240, 239, 238, 236, 234, 240, 221, 204, 200, 190, 190, 189, 187, 174, 166, 164], //给加权前的 pp
    rank_arr: ['A', 'SS', 'SS', 'B'], //给评级的统计数据。
    rank_elect_arr: ['SS', 'A', 'B'], //给根据数量排名的评级，越靠前数量越多

    bp_length_arr: [24, 59, 81, 75], //bp长度的统计数据

    mods_attr: [
        {
            index: "HD",
            map_count: 50,
            pp_count: 4396,
            percent: 0.26,
        },
        {
            index: "DT",
            map_count: 12,
            pp_count: 17,
            percent: 0.74,
        }
    ],

    rank_attr: [ //第一个给Perfect数量（真FC），第二个给FC数量（包括真假FC），第三个之后到第八个都给评级数量。越牛逼的越靠上
        {
            index: "FC",
            map_count: 50,
            pp_count: 16247,
            percent: 0.5,
        },
        {
            index: "SS",
            map_count: 50,
            pp_count: 16247,
            percent: 0.4,
        },
        {
            index: "SH",
            map_count: 50,
            pp_count: 16247,
            percent: 0.1,
        },
    ],

    pp_raw: 10985,
    pp: 13340,

    game_mode: 'osu',


}) {
    let svg = readTemplate('template/Panel_J.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PJ-1\);">)/;
    let reg_pan_mod = /(?<=<g style="clip-path: url\(#clippath-PJ-2\);">)/;
    let reg_pan_rank = /(?<=<g style="clip-path: url\(#clippath-PJ-3\);">)/;
    let reg_topbp = /(?<=<g id="TopBP">)/;
    let reg_lastbp = /(?<=<g id="LastBP">)/;
    let reg_card_l = /(?<=<g id="Card_L">)/;
    let reg_label_j1 = /(?<=<g id="Label_J1">)/;
    let reg_label_j2 = /(?<=<g id="Label_J2">)/;
    let reg_label_j3 = /(?<=<g id="Label_J3">)/;
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_pp_graph = /(?<=<g id="BPRankGraph">)/;
    let reg_rrect = /(?<=<g id="BPRanksR">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-PJ-BG\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('BP Analysis v2 (!ymba)', 'BPA', 'v0.3.1 EA');

    const pp = data.pp.toFixed(0) || 0;
    const pp_raw = data.pp_raw.toFixed(0) || 0;
    const pp_bonus = Math.max(pp - pp_raw, 0).toFixed(0);
    const game_mode = getGameMode(data.game_mode.toString(), 2);
    const pp_path = torus.get2SizeTextPath(pp.toString(),
        ' PP (' + pp_raw + '+' + pp_bonus + ')',
        36,
        24,
        1860,
        374.754,
        'right baseline',
        '#fff');

    const game_mode_path = torus.getTextPath(game_mode, 1860, 401.836, 24, 'right baseline', '#fff');

    const mappers_count_path = torus.get2SizeTextPath(
        data.favorite_mappers_count.toString(),
        ' mappers',
        36,
        24,
        1500,
        724.754,
        'right baseline',
        '#aaa'
    )

    // 插入文字
    svg = replaceTexts(svg, [panel_name, pp_path, game_mode_path, mappers_count_path], reg_index);

    // A1卡构建
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.card_A1), true);

    // J卡构建
    let cardJs_top = [];
    let cardJs_last = [];

    for (const i in data.bpTop5) {
        const h = await card_J(await PanelGenerate.bp2CardJ(data.bpTop5[i]), true);
        cardJs_top.push(h);
    }

    for (const i in data.bpLast5) {
        const h = await card_J(await PanelGenerate.bp2CardJ(data.bpLast5[i]), true);
        cardJs_last.push(h);
    }

    // L卡构建
    let cardLs = [];

    const L1 = await card_L({name: 'Length', card_K: data.bpLength}, true);
    const L2 = await card_L({name: 'Combo', card_K: data.bpCombo}, true);
    const L3 = await card_L({name: 'Star Rating', card_K: data.bpSR}, true);

    cardLs.push(L1, L2, L3);

    // Mod 标签 J1 构建

    let labelJ1s = [];

    for (const v of data.mods_attr) {
        const h = await label_J1({
            mod: v.index || 'None',
            count: v.map_count,
            pp: v.pp_count,
        });

        labelJ1s.push(h);
    }

    if (labelJ1s < 1) { //摆烂机制
        svg = implantImage(svg, 185, 185, 750, 600, 1, getExportFileV3Path('sticker_qiqi_secretly_observing.png'), reg_label_j1);
    }

    // 谱师标签 J2 构建

    let labelJ2s = [];

    for (const i in data.favorite_mappers) {
        const h = await label_J2({
            index: parseInt(i) + 1 || 0,
            avatar: await readNetImage(data.favorite_mappers[i].avatar_url, false, getExportFileV3Path('avatar-guest.png')),
            name: data.favorite_mappers[i].username || 'Unknown',
            count: data.favorite_mappers[i].map_count || 0,
            pp: data.favorite_mappers[i].pp_count || 0,
        });

        labelJ2s.push(h);
    }

    // 模组标签 J3 构建

    let labelJ3s = [];

    for (const v of data.rank_attr) {
        const h = await label_J3({

            ...RANK_OPTION[v.index],
            map_count: v.map_count,
            pp_percentage: v.percent, //占raw pp的比
            pp_count: v.pp_count,
        });

        labelJ3s.push(h);
    }

    // 绘制bp的pp曲线
    let pp_raw_arr = modifyArrayToFixedLength(data.pp_raw_arr, 100, false);

    let pp_max = Math.max.apply(Math, pp_raw_arr);
    let pp_min = Math.min.apply(Math, pp_raw_arr);
    let pp_mid = (pp_max + pp_min) / 2;

    const PPChart = PanelDraw.LineChart(pp_raw_arr, pp_max, pp_min, 1040, 610, 780, 215, '#FFCC22', 1, 0, 4);
    svg = replaceText(svg, PPChart, reg_pp_graph);

    // 绘制纵坐标，注意max在下面
    let rank_axis_y_max = Math.round(pp_max);
    let rank_axis_y_mid = Math.round(pp_mid);
    let rank_axis_y_min = Math.round(pp_min);

    let rank_axis =
        torus.getTextPath(rank_axis_y_max.toString(), 1010, 402.836, 24, 'center baseline', '#fc2') +
        torus.getTextPath(rank_axis_y_mid.toString(), 1010, 509.836, 24, 'center baseline', '#fc2') +
        torus.getTextPath(rank_axis_y_min.toString(), 1010, 616.836, 24, 'center baseline', '#fc2');

    svg = replaceText(svg, rank_axis, reg_pp_graph);

    // 绘制bp长度矩形，并且获取长度的优先值。需要给这些bp扩充到100，不然比例会有问题

    // 导入数据
    let bp_length_100_arr = data.bp_length_arr;
    let rank_100_arr = data.rank_arr;

    for (let i = data.bp_length_arr.length; i < 100; i++) {
        bp_length_100_arr.push(0);
        rank_100_arr.push('F');
    }

    const bp_length_arr = maximumArrayToFixedLength(bp_length_100_arr, 39, false);

    //根据优先值获取颜色数组
    const rank_elect_arr = data.rank_elect_arr;
    const color_elect_arr = getBarChartColorArray(rank_100_arr, rank_elect_arr, 39, '#616161'); //这是F的颜色

    //矩形绘制
    const bp_length_max = Math.max.apply(Math, bp_length_arr);
    const bp_length_min = Math.min.apply(Math, bp_length_arr);
    const bp_length_delta = Math.min(Math.max(bp_length_max - bp_length_min, 0.1), 360); //最大六分钟
    const start_y = 610;

    let svg_rrect = '';

    bp_length_arr.forEach((v, i) => {
        const height = Math.max(Math.min((v - bp_length_min) / bp_length_delta * 90, 90), 16);
        svg_rrect += PanelDraw.Rect(1042 + 20 * i, start_y - height, 16, height, 8, color_elect_arr[i]);
    });

    svg = replaceText(svg, svg_rrect, reg_rrect);

    //矩形上面的字绘制
    const bp_length_max_b = Math.floor(bp_length_max / 60).toString();
    const bp_length_max_m = (bp_length_max % 60) < 10 ? '0' + (bp_length_max % 60) : (bp_length_max % 60).toString();

    const bp_length_text = torus.getTextPath(`${bp_length_max_b}:${bp_length_max_m}`,
        1050 + bp_length_arr.findIndex((v) => v === bp_length_max) * 20,
        515 + 90 - Math.min(bp_length_max, 5) / 5 * 90, //本来是90，缩减一点
        16,
        'center baseline',
        '#aaa');

    svg = replaceText(svg, bp_length_text, reg_rrect);

    // 插入两个饼图
    let mod_svg = '';
    data.mods_attr.reduce((prev, curr) => {
        const curr_percent = prev + curr.percent;
        const color = getModColor(curr.index);
        mod_svg += PanelDraw.PieChart(curr_percent, 842, 470, 100, prev, color);
        return curr_percent;
    }, 0);

    mod_svg += PanelDraw.Image(842 - 70, 470 - 70, 140, 140, getExportFileV3Path('object-piechart-overlay2.png'), 1);

    let rank_svg = '';
    data.rank_attr.reduce((prev, curr) => {
        if (curr.index === 'FC') return 0; //排去FC
        const curr_percent = prev + curr.percent;
        const color = getRankColor(curr.index);
        rank_svg += PanelDraw.PieChart(curr_percent, 1630, 815, 100, prev, color);
        return curr_percent;
    }, 0);

    rank_svg += PanelDraw.Image(1630 - 70, 815 - 70, 140, 140, getExportFileV3Path('object-piechart-overlay2.png'), 1);

    svg = replaceText(svg, mod_svg, reg_pan_mod);
    svg = replaceText(svg, rank_svg, reg_pan_rank);

    // 插入图片和部件（新方法
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_maincard);

    for (const i in cardJs_top) {
        svg = implantSvgBody(svg, 55, 380 + i * 95, cardJs_top[i], reg_topbp);
    }

    for (const i in cardJs_last) {
        svg = implantSvgBody(svg, 380, 380 + i * 95, cardJs_last[i], reg_lastbp);
    }

    for (const i in cardLs) {
        svg = implantSvgBody(svg, 50 + i * 305, 880, cardLs[i], reg_card_l);
    }

    for (let i = 0; i < 4; i++) {
        svg = implantSvgBody(svg, 740, 570 + 70 * i, labelJ1s[i], reg_label_j1);
    }

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            svg = implantSvgBody(svg, 992 + 260 * i, 742 + 95 * j, labelJ2s[i * 3 + j], reg_label_j2);
        }
    }

    for (let i = 0; i < 6; i++) {
        if (i < 1) { //本来是i < 2，但是没有pf评级了
            svg = implantSvgBody(svg, 1555, 902 + 66 * i, labelJ3s[i], reg_label_j3);
        } else {
            svg = implantSvgBody(svg, 1715, 702 + 66 * (i - 1), labelJ3s[i], reg_label_j3);
        }
    }

    const background = pp2UserBG(data.pp || 0);
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantImage(svg, 1920, 1080, 0, 280, 0.6, background, reg_background);

    return svg;
}

/**
 * @function 根据选举的优先级来给条形图返回上色用的颜色数组
 * @return {string[]} 曲线的 svg
 * @param dataArr 条形图的数据数组，包含了选举信息
 * @param electArr 选举出的数组，越靠前越高级，但是需要放在下层
 * @param length 返回的数组长度，一般来说这肯定小于等于 dataArr。
 * @param defaultValue 填充的默认值
 */
function getBarChartColorArray (dataArr = [''], electArr = [''], length = 0, defaultValue) {
    let arr = new Array(length).fill(defaultValue);

    for (const v of electArr) {
        let steps = (dataArr.length - 1) / (length - 1);
        let stepSum = steps;
        let stepCount = 0;
        let color = getRankColor(v);

        dataArr.forEach((v0, i) => {
            if (i < stepSum) {
                if (v0.toUpperCase() === v.toUpperCase()) arr.splice(stepCount, 1, color);
            } else {
                stepSum += steps;
                stepCount ++;
            }
        })
    }

    //有时候取不到最后一位，所以需要补足
    const arr_last_value = dataArr[dataArr.length - 1];
    if (arr[length - 1] === defaultValue) arr.splice(length - 1, 1, getRankColor(arr_last_value));

    return arr;
}