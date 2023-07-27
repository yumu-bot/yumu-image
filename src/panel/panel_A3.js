import {
    exportPng,
    getNowTimeStamp,
    getRandomBannerPath,
    implantImage,
    implantSvgBody,
    PanelGenerate,
    readTemplate,
    replaceText,
    replaceTexts,
    torus
} from "../util.js";
import {card_A2} from "../card/card_A2.js";
import {card_N1} from "../card/card_N1.js";

export async function router(req, res) {
    try {
        const data = await panel_A3(req.fields || {});
        res.set('Content-Type', 'image/jpeg');
        res.send(data);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

export async function panel_A3(data = {
    "beatmap": {
        "beatmapset_id": 13019,
        "difficulty_rating": 4.76,
        "id": 48416,
        "mode": "osu",
        "status": "approved",
        "total_length": 202,
        "user_id": 231631,
        "version": "BASARA",
        "accuracy": 7,
        "ar": 9,
        "bpm": 130,
        "convert": false,
        "count_circles": 789,
        "count_sliders": 80,
        "count_spinners": 1,
        "cs": 4,
        "deleted_at": null,
        "drain": 8,
        "hit_length": 185,
        "is_scoreable": true,
        "last_updated": "2014-05-18T17:22:13Z",
        "mode_int": 0,
        "passcount": 139943,
        "playcount": 1871185,
        "ranked": 2,
        "url": "https://osu.ppy.sh/beatmaps/48416",
        "checksum": "bcfbb61d5a6156fa9fb0708432c79d88",
        "beatmapset": {
            "artist": "Daisuke Achiwa",
            "artist_unicode": "Daisuke Achiwa",
            "covers": {
                "cover": "https://assets.ppy.sh/beatmaps/13019/covers/cover.jpg?1622032274",
                "cover@2x": "https://assets.ppy.sh/beatmaps/13019/covers/cover@2x.jpg?1622032274",
                "card": "https://assets.ppy.sh/beatmaps/13019/covers/card.jpg?1622032274",
                "card@2x": "https://assets.ppy.sh/beatmaps/13019/covers/card@2x.jpg?1622032274",
                "list": "https://assets.ppy.sh/beatmaps/13019/covers/list.jpg?1622032274",
                "list@2x": "https://assets.ppy.sh/beatmaps/13019/covers/list@2x.jpg?1622032274",
                "slimcover": "https://assets.ppy.sh/beatmaps/13019/covers/slimcover.jpg?1622032274",
                "slimcover@2x": "https://assets.ppy.sh/beatmaps/13019/covers/slimcover@2x.jpg?1622032274"
            },
            "creator": "100pa-",
            "favourite_count": 1593,
            "hype": null,
            "id": 13019,
            "nsfw": false,
            "offset": 0,
            "play_count": 2862911,
            "preview_url": "//b.ppy.sh/preview/13019.mp3",
            "source": "Ar tonelico II",
            "spotlight": false,
            "status": "approved",
            "title": "BASARA",
            "title_unicode": "BASARA",
            "track_id": null,
            "user_id": 231631,
            "video": false,
            "bpm": 130,
            "can_be_hyped": false,
            "deleted_at": null,
            "discussion_enabled": true,
            "discussion_locked": false,
            "is_scoreable": true,
            "last_updated": "2010-09-08T10:10:59Z",
            "legacy_thread_url": "https://osu.ppy.sh/community/forums/topics/24360",
            "nominations_summary": {
                "current": 0,
                "required": 2
            },
            "ranked": 2,
            "ranked_date": "2010-12-28T22:17:38Z",
            "storyboard": false,
            "submitted_date": "2010-02-12T10:17:22Z",
            "tags": "ar tonelico ii 2",
            "availability": {
                "download_disabled": false,
                "more_information": null
            },
            "ratings": []
        },
        "failtimes": {
            "fail": [],
            "exit": []
        },
        "max_combo": 987
    },


    "scores": [
        {
            "accuracy": 0.9882943143812709,
            "best_id": 4399593261,
            "created_at": "2023-03-17T09:18:25Z",
            "id": 4399593261,
            "max_combo": 943,
            "mode": "osu",
            "mode_int": 0,
            "mods": [
                "HD",
                "DT"
            ],
            "passed": true,
            "perfect": false,
            "pp": 566.194,
            "rank": "A",
            "replay": true,
            "score": 15905693,
            "statistics": {
                "count_100": 9,
                "count_300": 588,
                "count_50": 0,
                "count_geki": 135,
                "count_katu": 8,
                "count_miss": 1
            },
            "type": "score_best_osu",
            "user_id": 7892320,
            "current_user_attributes": {
                "pin": null
            },
            "user": {
                "avatar_url": "https://a.ppy.sh/7892320?1682816993.png",
                "country_code": "KR",
                "default_group": "default",
                "id": 7892320,
                "is_active": true,
                "is_bot": false,
                "is_deleted": false,
                "is_online": false,
                "is_supporter": true,
                "last_visit": null,
                "pm_friends_only": false,
                "profile_colour": null,
                "username": "mx10002",
                "country": {
                    "code": "KR",
                    "name": "South Korea"
                },
                "cover": {
                    "custom_url": "https://assets.ppy.sh/user-profile-covers/7892320/33a28c19f958fdec86d058a054ca7435a3b559784111a5c6eee78b22552aab81.jpeg",
                    "url": "https://assets.ppy.sh/user-profile-covers/7892320/33a28c19f958fdec86d058a054ca7435a3b559784111a5c6eee78b22552aab81.jpeg",
                    "id": null
                }
            }
        },
        {
            "accuracy": 1,
            "best_id": 3340006101,
            "created_at": "2020-11-26T01:07:20Z",
            "id": 3340006101,
            "max_combo": 945,
            "mode": "osu",
            "mode_int": 0,
            "mods": [
                "HD",
                "HR"
            ],
            "passed": true,
            "perfect": true,
            "pp": 345.155,
            "rank": "XH",
            "replay": true,
            "score": 15369469,
            "statistics": {
                "count_100": 0,
                "count_300": 598,
                "count_50": 0,
                "count_geki": 144,
                "count_katu": 0,
                "count_miss": 0
            },
            "type": "score_best_osu",
            "user_id": 3328742,
            "current_user_attributes": {
                "pin": null
            },
            "user": {
                "avatar_url": "https://a.ppy.sh/3328742?1680518887.png",
                "country_code": "US",
                "default_group": "default",
                "id": 3328742,
                "is_active": true,
                "is_bot": false,
                "is_deleted": false,
                "is_online": false,
                "is_supporter": true,
                "last_visit": "2023-07-22T10:44:12+00:00",
                "pm_friends_only": false,
                "profile_colour": null,
                "username": "Trail Mix",
                "country": {
                    "code": "US",
                    "name": "United States"
                },
                "cover": {
                    "custom_url": "https://assets.ppy.sh/user-profile-covers/3328742/bc1fd5cd4ae4307dc8e34a3a41aa3fc7ce39fcc15bc6d9f27d60022e95dd5db7.jpeg",
                    "url": "https://assets.ppy.sh/user-profile-covers/3328742/bc1fd5cd4ae4307dc8e34a3a41aa3fc7ce39fcc15bc6d9f27d60022e95dd5db7.jpeg",
                    "id": null
                }
            }
        },],


}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_A3.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_beatmap_a2 = /(?<=<g id="Beatmap_Card_A2">)/;
    const reg_list_n1 = /(?<=<g id="List_Card_N1">)/;
    const reg_list_n2 = /(?<=<g id="List_Card_N2">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA3-1\);">)/;

    // 面板文字
    const index_powered = 'powered by Yumubot v0.3.1 EA // Map Score List (!yml)';
    const index_request_time = 'request time: ' + getNowTimeStamp();
    const index_panel_name = 'List';

    const index_powered_path = torus.getTextPath(index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    const index_request_time_path = torus.getTextPath(index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    const index_panel_name_path = torus.getTextPath(index_panel_name,
        607.5, 83.67, 48, "center baseline", "#fff");

    // 插入文字
    svg = replaceTexts(svg, [index_powered_path, index_request_time_path, index_panel_name_path], reg_index);

    // 导入A2卡
    const beatmap_generated = await PanelGenerate.beatmap2CardA2(data.beatmap);
    const beatmap_a2 = await card_A2(beatmap_generated, true);
    svg = implantSvgBody(svg, 40, 40, beatmap_a2, reg_beatmap_a2);


    // 导入N1卡
    let cardN1s = [];
    for (const i in data.scores) {
        const i0 = Math.max((parseInt(i) - 1), 0)
        const f = await card_N1({
            score: data.scores[i],
            score_rank: parseInt(i) + 1 || 0,
            compare_score: data.scores[i0].score,
        })

        cardN1s.push(f);
    }

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8, getRandomBannerPath(), reg_banner);

    // 计算面板高度
    const rowTotal = (cardN1s !== []) ? Math.ceil(cardN1s.length / 2) : 0;
    let panelHeight, cardHeight;

    if (rowTotal >= 0) {
        panelHeight = 360 + 72 * rowTotal;
        cardHeight = 70 + 72 * rowTotal;
    } else {
        panelHeight = 1080;
        cardHeight = 790;
    }

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    //插入N1卡
    for (let i = 0; i < cardN1s.length; i++) {
        const x = (i < rowTotal) ? 40 : 965;
        const y = (i < rowTotal) ? (330 + i * 72) : (330 + (i - rowTotal) * 72);

        svg = implantSvgBody(svg, x, y, cardN1s[i], reg_list_n1);
    }

    return await exportPng(svg);
}