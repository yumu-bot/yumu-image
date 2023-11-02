import {
    exportJPEG, getDecimals,
    getExportFileV3Path,
    getGameMode,
    getMapBG, getPanelNameSVG,
    implantImage,
    implantSvgBody, isReload,
    readTemplate, replaceText,
} from "../util/util.js";
import {calcMap, getDensityArray} from "../util/compute-pp.js";
import {ar2ms, cs2px, data2Label, od2ms, stat2DataM} from "./panel_E.js";
import {card_A1} from "../card/card_A1.js";
import {card_E1} from "../card/card_E1.js";
import {card_E2} from "../card/card_E2.js";
import {card_E3} from "../card/card_E3.js";
import {LABEL_OPTION} from "../component/label.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {hasAnyMod} from "../util/mod.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_E2(data);
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
        const svg = await panel_E2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

// E面板重构计划
export async function panel_E2(data = {
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
    beatmap: {
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
            "ratings": [0, 0, 0, 0, 0]
        },
        "failtimes": {
            "fail": [],
            "exit": []
        },
        "max_combo": 987
    },

    expected: {
        "accuracy" : 0.9861,
        "mods" : [ ],
        "score" : 80666662, //这个是mania里用到的
        "max_combo" : 2077,
        "user" : {
            "id" : 17064371,
            "cover" : null,
            "avatar" : "https://a.ppy.sh/17064371?1675693670.jpeg",
            "pmOnly" : false,
            "avatar_url" : "https://a.ppy.sh/17064371?1675693670.jpeg",
            "cover_url" : null,
            "default_group" : "default",
            "is_active" : true,
            "is_bot" : false,
            "is_deleted" : false,
            "is_online" : false,
            "is_supporter" : true,
            "last_visit" : [ 2023, 7, 29, 13, 45, 43, 833335215 ],
            "pm_friends_only" : false,
            "username" : "-Spring Night-",
            "country_code" : "TW",
            "country" : null,
            "statistics" : null
        },
    },
}, reuse = false){
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_e1 = /(?<=<g id="Card_E1">)/;
    const reg_card_e2 = /(?<=<g id="Card_E2">)/;
    const reg_card_e3 = /(?<=<g id="Card_E3">)/;

    // 导入文字
    svg = replaceText(svg, getPanelNameSVG(
        'Map Statistics (!ymm)', 'Map', 'v0.3.2 FT'), reg_index);

    // 构建成绩

    const bid = data.beatmap.id;
    const stat = {
        acc: data.expected.accuracy || 1,
        combo: data.expected.max_combo || data.beatmap.max_combo,
        mods: data.expected.mods || [],
    }
    const mode = data.beatmap.mode || 'osu';

    const calcTotal = await calcMap(bid, stat, mode, isReload(data.beatmap.ranked));
    const calcPP = calcTotal[0];
    let calcNC = [];
    let calcFC = [];

    for (let i = 1; i < 12; i++) {
        calcNC.push(calcTotal[i] || 0);
        calcFC.push(calcTotal[i + 11] || 0);
    }

    const rank = getApproximateRankFromAcc(data.expected.accuracy, data.beatmap.mode);

    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user), true);
    const cardE1 = await card_E1(await beatmap2CardE1(data.beatmap, calcPP), true);
    const cardE2 = await card_E2(await expect2CardE2(data.expected, rank, calcPP, calcNC, calcFC), true);
    const cardE3 = await card_E3(await beatmap2CardE3(data.beatmap, rank, calcPP), true);

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = implantSvgBody(svg, 0, 290, cardE1, reg_card_e1);
    svg = implantSvgBody(svg, 880, 330, cardE2, reg_card_e2);
    svg = implantSvgBody(svg, 880, 770, cardE3, reg_card_e3);

    // 图片定义
    const background = getExportFileV3Path('object-score-backimage-' + rank + '.jpg');
    const banner = await getMapBG(data.beatmap.beatmapset.id, 'slimcover', isReload(data.beatmap.ranked));

    // 导入图片
    svg = implantImage(svg, 1920, 1080, 0, 0, 0.8, background, reg_background);
    svg = implantImage(svg, 1920, 330, 0, 0, 0.6, banner, reg_banner);

    return svg.toString();
}

async function beatmap2CardE1(beatmap, calcPP) {
    return {
        mode: beatmap.mode || 'osu',
        star: calcPP.attr.stars || 0,
        cover: beatmap.beatmapset.covers["list@2x"],
        title: beatmap.beatmapset.title || '',
        title_unicode: beatmap.beatmapset.title_unicode || '',
        version: beatmap.version || '',
        artist: beatmap.beatmapset.artist || '',
        creator: beatmap.beatmapset.creator || '',
        id: beatmap.id || 0,
        status: beatmap.beatmapset.status || 'unranked',
        favourite_count: beatmap.beatmapset.favourite_count || 0,
        play_count: beatmap.beatmapset.play_count || 0,
    }
}

async function expect2CardE2(expect, rank = 'F', calcPP, calcNC = [0], calcFC = [0]) {
    const isFC = expect.max_combo >= calcPP.attr.maxCombo;
    const isPF = rank === 'XH' || rank === 'X';
    const isBest = false;

    const labels = (mode = 'osu', calcPP = calcPP) => {

    }

    return {
        rank: rank || 'F',
        mods: expect.mods || [],
        accuracy: expect.accuracy || 0,
        combo: expect.max_combo || 0,
        pp: calcPP.pp.pp || 0,

    }
}

async function beatmap2CardE3(beatmap, rank, calcPP) {
    const pass_arr = beatmap2PassPercents(beatmap);

    return {
        density_arr: await getDensityArray(beatmap.id, beatmap.mode,
            !(beatmap.ranked && (beatmap.ranked === 1 || beatmap.ranked === 2 || beatmap.ranked === 4))),
        retry_arr: beatmap.exit || [],
        fail_arr: beatmap.fail || [],

        public_rating: beatmap2PublicRating(beatmap),
        pass_percent: pass_arr[0],
        retry_percent: pass_arr[1],
        fail_percent: pass_arr[2],

        labels: beatmap2Labels(beatmap, calcPP),
        rank: rank,
        star: calcPP.attr.stars,
        score_progress: 1,
    }
}

const getApproximateRankFromAcc = (acc = 1, mode = 'osu') => {
    let rank = 'F';

    switch (getGameMode(mode, 1)) {
        case 'o' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc >= 0.9317) {
                rank = 'S';
            } else if (acc >= 0.8333) {
                rank = 'A';
            } else if (acc >= 0.75) {
                rank = 'B';
            } else if (acc >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;

        case 't' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc >= 0.95) {
                rank = 'S';
            } else if (acc >= 0.9) {
                rank = 'A';
            } else if (acc >= 0.8) {
                rank = 'B';
            } else if (acc >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;

        case 'c' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc > 0.98) {
                rank = 'S';
            } else if (acc > 0.94) {
                rank = 'A';
            } else if (acc > 0.90) {
                rank = 'B';
            } else if (acc > 0.85) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;

        case 'm' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc >= 0.95) {
                rank = 'S';
            } else if (acc >= 0.90) {
                rank = 'A';
            } else if (acc >= 0.80) {
                rank = 'B';
            } else if (acc >= 0.70) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;
    }

    return rank;
}

//132行的方法，获取大众评分
const beatmap2PublicRating = (beatmap) => {
    const ratings = beatmap.beatmapset.ratings;

    const rating_sum = ratings ? ratings.reduce((s, v) => s + v) : 0;
    const rating_weight_val = ratings ? ratings.reduce((s, v, i) => s + v * i) : 0;
    return (rating_sum !== 0) ? Math.floor(rating_weight_val / rating_sum * 100) / 100 : 0;
}

//137行的方法，获取通过率等
const beatmap2PassPercents = (beatmap) => {
    let arr = [];

    const pc = beatmap.playcount || 0;
    const pass = beatmap.passcount || 0;

    const fail_sum = beatmap.fail ? beatmap.fail.reduce((s, v) => s + v) : 0;
    const retry_sum = beatmap.exit ? beatmap.exit.reduce((s, v) => s + v) : 0;
    const not_pass_sum = fail_sum + retry_sum; //虚假的未通过人数
    const not_pass_real_percent = (pc !== 0) ? ((pc - pass) / pc) : 0; //真实的未通过率

    const isNotDiv0 = (not_pass_sum !== 0);

    const fail_percent = isNotDiv0 ? (fail_sum / not_pass_sum * not_pass_real_percent * 100).toFixed(0) : 0;
    const retry_percent = isNotDiv0 ? (retry_sum / not_pass_sum * not_pass_real_percent * 100).toFixed(0) : 0;
    const pass_percent = isNotDiv0 ? (100 - fail_percent - retry_percent).toFixed(0) : 0;

    arr.push(pass_percent, retry_percent, fail_percent)
    return arr;
}

//406-473行的方法，打包成标签 console.time("label");
const beatmap2Labels = (beatmap, calcPP) => {
    const mode = getGameMode(beatmap.mode, 1);
    const bpm = calcPP.attr.bpm;
    const mod_int = calcPP.attr.mods_int;

    let length = beatmap.total_length || 0;
    let drain = beatmap.hit_length || 0;

    if (hasAnyMod(mod_int, ["DT", "NC"])) {
        length *= (2 / 3);
        drain *= (2 / 3);
    } else if (hasAnyMod(mod_int, ["HT", "DC"])) {
        length *= (3 / 2);
        drain *= (3 / 2);
    }

    const bpm_r = (bpm > 0) ? (60000 / bpm).toFixed(0) + 'ms' : '-';
    const bpm_b = getDecimals(bpm, 2);
    const bpm_m = getDecimals(bpm, 3);

    const length_r = Math.floor(drain / 60) + ':' + (drain % 60).toFixed(0).padStart(2, '0');
    const length_b = Math.floor(length / 60) + ':';
    const length_m = (length % 60).toFixed(0).padStart(2, '0');

    let isDisplayCS = true;
    let isDisplayAR = true;
    let isDisplayOD = true;
    switch (mode) {
        case 't' : isDisplayAR = false; isDisplayCS = false; break;
        case 'c' : isDisplayOD = false; break;
        case 'm' : isDisplayAR = false; break;
    }

    const hasCSChanged = ((mode === 'o' || mode === 'c') && hasAnyMod(mod_int, ["EZ", "HR"]));
    const hasARChanged = ((mode === 'o' || mode === 'c') && hasAnyMod(mod_int, ["EZ", "HR", "DT", "HT", "NC", "DC"]));
    const hasODChanged = ((mode === 'o' || mode === 't') && hasAnyMod(mod_int, ["EZ", "HR", "DT", "HT", "NC", "DC"]));
    const hasHPChanged = ((mode !== 'm') && hasAnyMod(mod_int, ["EZ", "HR"]));

    const cs_r = cs2px(calcPP.attr.cs, mode);
    const cs_b = getDecimals(calcPP.attr.cs, 2);
    const cs_m = stat2DataM(hasCSChanged, calcPP.attr.cs, beatmap.cs);

    const ar_r = ar2ms(calcPP.attr.ar, mode);
    const ar_b = getDecimals(calcPP.attr.ar, 2);
    const ar_m = stat2DataM(hasARChanged, calcPP.attr.ar, beatmap.ar);

    const od_r = od2ms(calcPP.attr.od, mode);
    const od_b = getDecimals(calcPP.attr.od, 2);
    const od_m = stat2DataM(hasODChanged, calcPP.attr.od, beatmap.accuracy);

    const hp_r = '-';
    const hp_b = getDecimals(calcPP.attr.hp, 2);
    const hp_m = stat2DataM(hasHPChanged, calcPP.attr.hp, beatmap.drain);

    return [{
        ...LABEL_OPTION.BPM,
        ...data2Label(bpm_r, bpm_b, bpm_m, true),
    },{
        ...LABEL_OPTION.LENGTH,
        ...data2Label(length_r, length_b, length_m, true),
    },{
        ...LABEL_OPTION.CS,
        ...data2Label(cs_r, cs_b, cs_m, isDisplayCS),
    },{
        ...LABEL_OPTION.AR,
        ...data2Label(ar_r, ar_b, ar_m, isDisplayAR),
    },{
        ...LABEL_OPTION.OD,
        ...data2Label(od_r, od_b, od_m, isDisplayOD),
    },{
        ...LABEL_OPTION.HP,
        ...data2Label(hp_r, hp_b, hp_m, true),
    }];
}