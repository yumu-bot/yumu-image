import {
    exportJPEG, getMapBG, getPanelHeight,
    getPanelNameSVG,
    implantSvgBody, readTemplate, putCustomBanner,
    replaceText
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_N} from "../card/card_N.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {hasLeaderBoard} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A3(data);
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
        const svg = await panel_A3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * rank图 单图成绩排行
 * @param data
 * @return {Promise<string>}
 */
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
            "classic_total_score": 6178113,
            "preserve": true,
            "processed": true,
            "ranked": true,
            "maximum_statistics": {
                "great": 407,
                "legacy_combo_increase": 201
            },
            "mods": [
                {
                    "acronym": "DT"
                },
                {
                    "acronym": "HR"
                },
                {
                    "acronym": "HD"
                },
                {
                    "acronym": "CL"
                }
            ],
            "statistics": {
                "ok": 11,
                "great": 396
            },
            "beatmap_id": 1786111,
            "best_id": null,
            "id": 1660540401,
            "rank": "SH",
            "type": "solo_score",
            "user_id": 11592896,
            "accuracy": 0.981982,
            "build_id": null,
            "ended_at": "2022-12-26T13:10:49Z",
            "has_replay": true,
            "is_perfect_combo": true,
            "legacy_perfect": true,
            "legacy_score_id": 4344841537,
            "legacy_total_score": 7667511,
            "max_combo": 608,
            "passed": true,
            "pp": 773.991,
            "ruleset_id": 0,
            "started_at": null,
            "total_score": 1124277,
            "replay": true,
            "current_user_attributes": {
                "pin": null
            },
            "user": {
                "avatar_url": "https://a.ppy.sh/11592896?1729090646.png",
                "country_code": "GB",
                "default_group": "default",
                "id": 11592896,
                "is_active": true,
                "is_bot": false,
                "is_deleted": false,
                "is_online": false,
                "is_supporter": false,
                "last_visit": "2024-10-24T23:32:34+00:00",
                "pm_friends_only": false,
                "profile_colour": null,
                "username": "rudj",
                "country": {
                    "code": "GB",
                    "name": "United Kingdom"
                },
                "cover": {
                    "custom_url": "https://assets.ppy.sh/user-profile-covers/11592896/95dd37554b724dfb11b8257e647ab854366135396db70c2be9a1f515252413cf.png",
                    "url": "https://assets.ppy.sh/user-profile-covers/11592896/95dd37554b724dfb11b8257e647ab854366135396db70c2be9a1f515252413cf.png",
                    "id": null
                }
            }
        },],


}) {
    // 导入模板
    let svg = readTemplate('template/Panel_A3.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_beatmap_a2 = /(?<=<g id="Beatmap_Card_A2">)/;
    const reg_list_n1 = /(?<=<g id="List_Card_N1">)/;
    // const reg_list_n2 = /(?<=<g id="List_Card_N2">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA3-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Leader Board (!yml)', 'L', 'v0.5.0 DX');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A2卡
    const beatmap_generated = await PanelGenerate.beatMap2CardA2(data.beatmap);
    const beatmap_a2 = await card_A2(beatmap_generated);
    svg = implantSvgBody(svg, 40, 40, beatmap_a2, reg_beatmap_a2);


    // 导入N1卡
    let cardN1s = [];
    for (const i in data.scores) {
        const i0 = Math.max((parseInt(i) - 1), 0)
        const f = await card_N({
            score: data.scores[i],
            score_rank: parseInt(i) + 1 || 0,
            compare_score: data.scores[i0].total_score,
        })

        cardN1s.push(f);
    }

    // 插入图片和部件（新方法
    // svg = implantImage(svg,1920,320,0,0,0.8, getRandomBannerPath(), reg_banner);
    svg = putCustomBanner(svg, reg_banner,
        await getMapBG(data.beatmap.beatmapset.id, 'cover', hasLeaderBoard(data.beatmap.ranked)));

    // 计算面板高度
    const rowTotal = Math.ceil((cardN1s?.length || 0) / 2);

    const panelHeight = getPanelHeight(cardN1s?.length, 62, 2, 290, 10, 40);
    const cardHeight = panelHeight - 290;

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    //插入N1卡
    for (let i = 0; i < cardN1s.length; i++) {
        const x = (i < rowTotal) ? 40 : 965;
        const y = (i < rowTotal) ? (330 + i * 72) : (330 + (i - rowTotal) * 72);

        svg = implantSvgBody(svg, x, y, cardN1s[i], reg_list_n1);
    }

    return svg.toString();
}