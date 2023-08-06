import {
    exportImage,
    getApproximateRank,
    getDecimals,
    getExportFileV3Path,
    getGameMode,
    getNowTimeStamp,
    getPanelNameSVG,
    hasAnyMod,
    implantImage,
    implantSvgBody,
    PanelGenerate,
    readNetImage,
    readTemplate,
    replaceText
} from "../util.js";
import {calcPerformancePoints, getDensityArray} from "../compute-pp.js";
import moment from "moment";
import {LABEL_OPTION} from "../component/label.js";
import {card_A1} from "../card/card_A1.js";
import {card_E1} from "../card/card_E1.js";
import {card_E2} from "../card/card_E2.js";
import {card_E3} from "../card/card_E3.js";

export async function router(req, res) {
    try {
        const data = await panel_E0(req.fields || {});
        res.set('Content-Type', 'image/jpeg');
        res.send(data);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

// E面板重构计划
export async function panel_E0(data = {
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

    score: {
        "accuracy" : 0.9861,
        "mods" : [ ],
        "passed" : true,
        "perfect" : false,
        "pp" : 373.032,
        "rank" : "S",
        "replay" : false,
        "score" : 80666662,
        "statistics" : {
            "pp" : null,
            "ss" : null,
            "ssh" : null,
            "s" : null,
            "sh" : null,
            "a" : null,
            "ranked" : null,
            "count_50" : 1,
            "count_100" : 13,
            "count_300" : 1586,
            "count_geki" : 370,
            "count_katu" : 12,
            "count_miss" : 0,
            "ranked_score" : null,
            "total_score" : null,
            "hit_accuracy" : null,
            "play_count" : null,
            "play_time" : null,
            "total_hits" : null,
            "maximum_combo" : null,
            "is_ranked" : null,
            "global_rank" : null,
            "replays_watched_by_others" : null,
            "country_rank" : null,
            "level_current" : null,
            "level_progress" : null,
            "country_rank_7k" : null,
            "country_rank_4k" : null,
            "rank_7k" : null,
            "rank_4k" : null,
            "pp_7k" : null,
            "pp_4k" : null
        },
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
        "weight" : {
            "percentage" : 100.0,
            "pp" : 373.032
        },
        "best_id" : 4457155373,
        "max_combo" : 2077,
        "user_id" : 17064371,
        "created_at" : [ 2023, 6, 17, 11, 24, 22 ],
        "id" : 4457155373,
        "mode" : "OSU",
        "mode_int" : 0,
        "beatmap" : {
            "id" : 2993974,
            "mode" : "osu",
            "status" : "ranked",
            "version" : "Starlight",
            "ar" : 9.4,
            "cs" : 3.8,
            "bpm" : 177.0,
            "convert" : false,
            "passcount" : 102749,
            "playcount" : 1209979,
            "ranked" : 1,
            "url" : "https://osu.ppy.sh/beatmaps/2993974",
            "beatMapRatingList" : null,
            "beatMapRetryList" : null,
            "beatMapFailedList" : null,
            "beatMapRating" : 0.0,
            "beatMapRetryCount" : 0,
            "beatMapFailedCount" : 0,
            "beatmapset_id" : 1456709,
            "difficulty_rating" : 6.17,
            "mode_int" : 0,
            "total_length" : 332,
            "hit_length" : 331,
            "user_id" : 12308923,
            "accuracy" : 9.0,
            "drain" : 5.0,
            "max_combo" : null,
            "is_scoreable" : true,
            "last_updated" : "2021-06-10T02:08:31Z",
            "checksum" : "05176a860021955266cc9d3b20e26850",
            "count_sliders" : 443,
            "count_spinners" : 2,
            "count_circles" : 1155,
            "fail" : null,
            "exit" : null,
            "beatmapset" : null
        },
        "beatmapset" : {
            "video" : false,
            "availabilityDownloadDisable" : null,
            "availabilityInformation" : null,
            "fromDatabases" : false,
            "id" : 1456709,
            "user_id" : 12308923,
            "bpm" : null,
            "artist" : "Kano",
            "artist_unicode" : "鹿乃",
            "title" : "Stella-rium (Asterisk MAKINA Remix)",
            "title_unicode" : "Stella-rium (Asterisk MAKINA Remix)",
            "creator" : "Vaporfly",
            "favourite_count" : 779,
            "nsfw" : false,
            "play_count" : 1209979,
            "preview_url" : "//b.ppy.sh/preview/1456709.mp3",
            "source" : "放課後のプレアデス",
            "status" : "ranked",
            "legacy_thread_url" : null,
            "tags" : null,
            "storyboard" : null,
            "covers" : {
                "cover" : "https://assets.ppy.sh/beatmaps/1456709/covers/cover.jpg?1623290934",
                "cover@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/cover@2x.jpg?1623290934",
                "card" : "https://assets.ppy.sh/beatmaps/1456709/covers/card.jpg?1623290934",
                "card@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/card@2x.jpg?1623290934",
                "list" : "https://assets.ppy.sh/beatmaps/1456709/covers/list.jpg?1623290934",
                "list@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/list@2x.jpg?1623290934",
                "slimcover" : "https://assets.ppy.sh/beatmaps/1456709/covers/slimcover.jpg?1623290934",
                "slimcover@2x" : "https://assets.ppy.sh/beatmaps/1456709/covers/slimcover@2x.jpg?1623290934"
            },
            "ratings" : null,
            "spotlight" : false,
            "beatmaps" : null,
            "ranked_date" : null
        },
        "create_at_str" : "2023-06-17T11:24:22Z"
    },

}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_E0.svg');

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_e1 = /(?<=<g id="Card_E1">)/;
    const reg_card_e2 = /(?<=<g id="Card_E2">)/;
    const reg_card_e3 = /(?<=<g id="Card_E3">)/;

    // 面板文字
    const score_time = moment(data.score.create_at_str, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours').format("YYYY-MM-DD HH:mm:ss[ +8]");
    const request_time = 'score time: ' + score_time + ' // request time: ' + getNowTimeStamp();

    // 导入文字
    svg = replaceText(svg, getPanelNameSVG(
        'Score (!ymp / !ymr / !yms)', 'Score', '0.3.2 FT', request_time
    ), reg_index);

    // 成绩重计算
    const score_statistics = {
        ...data.score.statistics,
        combo: data.score.max_combo,
        mods: data.score.mods,
    }

    const calcPP = await calcPerformancePoints(data.score.beatmap.id, score_statistics, data.score.mode, !(data.score.beatmap.ranked && data.score.beatmap.ranked === 1));
    /*
    const calcPP = {
        pp: 10,
        pp_all: 0,
        full_pp: 20,
        full_pp_all: 0,
        perfect_pp: 40,
        perfect_pp_all: 0,
        attr: {
            mode: 0,
            version: 14,
            nCircles: 1,
            nSliders: 1,
            nSpinners: 1,
            ar: 9.7,
            cs: 4,
            hp: 5.6,
            od: 9.3,
            arHitWindow: 500,
            odHitWindow: 23.733332951863606,
            clockRate: 1.5,
            bpm: 234.00023400023397,
            stars: 10.6,
            maxCombo: 457,
        },
    }

     */

    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user), true);
    const cardE1 = await card_E1(await score2CardE1(data.score, calcPP), true);
    const cardE2 = await card_E2(await score2CardE2(data.score, calcPP), true);
    const cardE3 = await card_E3(await score2CardE3(data.score, calcPP), true);

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = implantSvgBody(svg, 0, 290, cardE1, reg_card_e1);
    svg = implantSvgBody(svg, 880, 330, cardE2, reg_card_e2);
    svg = implantSvgBody(svg, 880, 770, cardE3, reg_card_e3);

    // 图片定义
    const background = getExportFileV3Path('object-score-backimage-' + data.score.rank + '.jpg');
    const banner = await readNetImage(data.score.beatmapset.covers.slimcover, getExportFileV3Path('beatmap-DLfailBG.jpg'));

    // 导入图片
    svg = implantImage(svg, 1920, 1080, 0, 0, 0.8, background, reg_background);
    svg = implantImage(svg, 1920, 330, 0, 0, 0.6, banner, reg_banner);

    return await exportImage(svg);
}

async function score2CardE1(score, calcPP) {
    return {
        mode: score.mode || 'OSU',
        star: calcPP.attr.stars || 0,
        cover: score.beatmapset.covers["list@2x"],
        title: score.beatmapset.title || '',
        title_unicode: score.beatmapset.title_unicode || '',
        version: score.beatmap.version || '',
        artist: score.beatmapset.artist || '',
        creator: score.beatmapset.creator || '',
        id: score.beatmap.id || 0,
        status: score.beatmapset.status || 'unranked',
        favourite_count: score.beatmapset.favourite_count || 0,
        play_count: score.beatmapset.play_count || 0,
    }
}

async function score2CardE2(score, calcPP) {
    const isFC = score.perfect || (score.beatmap.max_combo === score.max_combo) || score.statistics.count_miss === 0;
    const isPF = score.perfect || score.rank === 'XH' || score.rank === 'X';
    const isBest = !(score.best_id === null);

    return {
        rank: score.rank || 'F',
        mods: score.mods || [],
        score: score.score || 0,
        accuracy: score.accuracy || 0,
        combo: score.max_combo || 0,
        pp: calcPP.pp || 0,
        mode: score.mode || '',


        advanced_judge: score2AdvancedJudge(score), //进阶评级，也就是面板圆环下面那个玩意
        acc_index: score2AccIndex(score),
        max_combo: calcPP.attr.maxCombo || 0,
        full_pp: calcPP.full_pp || 0,
        max_pp: calcPP.perfect_pp || 0,
        statistics: score2Statistics(score),
        statistics_max: score2StatisticsMax(score),

        isFC: isFC,
        isPF: isPF,
        isBest: isBest,
    }
}

async function score2CardE3(score, calcPP) {
    const pass_arr = score2PassPercents(score);

    return {
        density_arr: await getDensityArray(score.beatmap.id, score.mode),
        retry_arr: score.beatmap.exit || [],
        fail_arr: score.beatmap.fail || [],

        public_rating: score2PublicRating(score),
        pass_percent: pass_arr[0],
        retry_percent: pass_arr[1],
        fail_percent: pass_arr[2],

        labels: score2Labels(score, calcPP),
        rank: score.rank,
        star: calcPP.attr.stars,
    }
}

//老面板的score_categorize
const score2AdvancedJudge = (score) => {
    const isTaikoPF = getGameMode(score.mode, 1) === 't' && (score.rank === 'XH' || score.rank === 'X');
    const isPF = score.perfect || isTaikoPF;

    if (score.mods.includes('NF')) {
        return 'played';
    } else if (isPF) {
        return 'perfect';
    } else if (score.statistics.count_miss === 0) {
        return 'nomiss';
    } else if (score.rank !== 'F') {
        return 'clear';
    } else {
        return 'played';
    }
}

//即util里的getAccIndexDeluxe
const score2AccIndex = (score) => {
    const mode = getGameMode(score.mode, 1);
    const nGeki = score.statistics.count_geki;
    const n300 = score.statistics.count_300;
    const n100 = score.statistics.count_100;
    const n50 = score.statistics.count_50;
    const n0 = score.statistics.count_miss;
    let nTotal;
    let nNotMiss;

    let hasMiss = false;
    if (n0 !== 0) hasMiss = true;

    let has1p50 = false;
    if ((n50 / (n300 + n100 + n50 + n0)) >= 0.01) has1p50 = true;

    const rank = score.rank;

    switch (mode) {
        case 'o' : return getIndexStd();
        case 't' : return getIndexTaiko();
        case 'c' : return getIndexCatch();
        case 'm' : return getIndexMania();
        default: return '-';
    }

    function getIndexStd() {
        nNotMiss = n300 + n100 + n50;
        nTotal = nNotMiss + n0;

        switch (rank) {
            case 'XH' :
            case 'X' : return 'AP';
            case 'SH' :
            case 'S' : return '^SS';
            case 'A' : {
                if (hasMiss) {
                    if (nNotMiss === n300) {
                        return '-x SS';
                    } else if (0.9 * nNotMiss <= n300) {
                        return '-x S';
                    } else {
                        return '-' + Math.ceil(0.9 * nTotal - n300) + ' S';
                    }
                } else {
                    if (has1p50) {
                        return '-[50] S';
                    } else {
                        if (0.9 * nTotal <= n300) {
                            // 如果没有不好的评级，甚至能到SS
                            return '-' + Math.ceil(nTotal - n300) + ' SS';
                        } else {
                            return '-' + Math.ceil(0.9 * nTotal - n300) + ' S';
                        }
                    }
                }
            }
            case 'B' :
                if (hasMiss) {
                    if (nNotMiss === n300) {
                        return '-x SS';
                    } else if (0.9 * nNotMiss <= n300) {
                        return '-x S';
                    } else if (0.8 * nNotMiss <= n300) {
                        return '-x A';
                    } else {
                        return '-' + Math.ceil(0.8 * nTotal - n300) + ' A';
                    }
                } else {
                    // 如果没有不好的评级，甚至能到SS
                    if (0.8 * nTotal > n300) {
                        return '-' + Math.ceil(0.8 * nTotal - n300) + ' A';
                    } else if (0.9 * nTotal > n300) {
                        return '-' + Math.ceil(0.9 * nTotal - n300) + ' S';
                    } else {
                        return '-' + Math.ceil(nTotal - n300) + ' SS';
                    }
                }
            case 'C' :
                if (hasMiss) {
                    if (nNotMiss === n300) {
                        return '-x SS';
                    } else if (0.9 * nNotMiss <= n300) {
                        return '-x S';
                    } else if (0.8 * nNotMiss <= n300) {
                        return '-x A';
                    } else if (0.7 * nNotMiss <= n300) {
                        return '-x B';
                    } else {
                        return '-' + Math.ceil(0.7 * nTotal - n300) + ' A';
                    }
                } else {
                    // 如果没有不好的评级，甚至能到SS
                    if (0.7 * nTotal > n300) {
                        return '-' + Math.ceil(0.7 * nTotal - n300) + ' B';
                    } else if (0.8 * nTotal > n300) {
                        return '-' + Math.ceil(0.8 * nTotal - n300) + ' A';
                    } else if (0.9 * nTotal > n300) {
                        return '-' + Math.ceil(0.9 * nTotal - n300) + ' S';
                    } else {
                        return '-' + Math.ceil(nTotal - n300) + ' SS';
                    }
                }
            case 'D' :
                if (hasMiss) {
                    if (0.6 * nTotal <= n300) {
                        return '-x C';
                    } else {
                        return '-' + Math.ceil(0.6 * nTotal - n300) + ' C';
                    }
                } else {
                    return 'no miss?'
                }
            default :
                return '~ ' + getApproximateRank(score);
        }
    }

    function getIndexTaiko() {
        nNotMiss = n300 + n100;
        nTotal = nNotMiss + n0;

        switch (rank) {
            case 'XH' :
            case 'X' : return 'AP';
            case 'SH' :
            case 'S' : return '^SS';
            case 'A' : {
                if (hasMiss) {
                    if (nNotMiss === n300) {
                        return '-x SS';
                    } else if (0.9 * nNotMiss <= n300) {
                        return '-x S';
                    } else {
                        return '-';
                    }
                } else {
                    if (0.9 * nTotal <= n300) {
                        // 如果没有不好的评级，甚至能到SS
                        return '-' + Math.ceil(nTotal - n300) + ' SS';
                    } else {
                        return '-' + Math.ceil(0.9 * nTotal - n300) + ' S';
                    }
                }
            }
            case 'B' :
                if (hasMiss) {
                    if (nNotMiss === n300) {
                        return '-x SS';
                    } else if (0.9 * nNotMiss <= n300) {
                        return '-x S';
                    } else if (0.8 * nNotMiss <= n300) {
                        return '-x A';
                    } else {
                        return '-' + Math.ceil(0.8 * nTotal - n300) + ' A';
                    }
                } else {
                    // 如果没有不好的评级，甚至能到SS
                    if (0.8 * nTotal > n300) {
                        return '-' + Math.ceil(0.8 * nTotal - n300) + ' A';
                    } else if (0.9 * nTotal > n300) {
                        return '-' + Math.ceil(0.9 * nTotal - n300) + ' S';
                    } else {
                        return '-' + Math.ceil(nTotal - n300) + ' SS';
                    }
                }
            case 'C' :
                if (hasMiss) {
                    if (nNotMiss === n300) {
                        return '-x SS';
                    } else if (0.9 * nNotMiss <= n300) {
                        return '-x S';
                    } else if (0.8 * nNotMiss <= n300) {
                        return '-x A';
                    } else if (0.7 * nNotMiss <= n300) {
                        return '-x B';
                    } else {
                        return '-' + Math.ceil(0.7 * nTotal - n300) + ' A';
                    }
                } else {
                    // 如果没有不好的评级，甚至能到SS
                    if (0.7 * nTotal > n300) {
                        return '-' + Math.ceil(0.7 * nTotal - n300) + ' B';
                    } else if (0.8 * nTotal > n300) {
                        return '-' + Math.ceil(0.8 * nTotal - n300) + ' A';
                    } else if (0.9 * nTotal > n300) {
                        return '-' + Math.ceil(0.9 * nTotal - n300) + ' S';
                    } else {
                        return '-' + Math.ceil(nTotal - n300) + ' SS';
                    }
                }
            case 'D' :
                if (hasMiss) {
                    if (0.6 * nTotal <= n300) {
                        return '-x C';
                    } else {
                        return '-' + Math.ceil(0.6 * nTotal - n300) + ' C';
                    }
                } else {
                    return 'no miss?'
                }
            default : return '~ ' + getApproximateRank(score);
        }
    }

    function getIndexCatch() {
        switch (rank) {
            case 'XH' :
            case 'X' : return 'AP';
            case 'SH' :
            case 'S' : return '^SS';
            case 'A' : return '^S';
            case 'B' : return '^A';
            case 'C' : return '^B';
            case 'D' : return '^C';
            default : return '~ ' + getApproximateRank(score);
        }
    }

    function getIndexMania() {
        switch (rank) {
            case 'F' : return '~ ' + getApproximateRank(score);
            default : {
                const precision = nGeki / n300;
                if (nGeki >= n300) {
                    if (n300 !== 0) {
                        return precision.toFixed(1) + 'x';
                    } else if (nGeki !== 0) {
                        return 'MAX';
                    } else return '???';
                } else if (nGeki < n300) {
                    if (nGeki !== 0) {
                        return precision.toFixed(2) + 'x';
                    } else if (n300 !== 0) {
                        return 'MIN';
                    } else return '???';
                } else {
                    return '???';
                }
            }
        }
    }
}

//老面板的newJudge
const score2Statistics = (score) => {
    const n320 = score.statistics.count_geki;
    const n300 = score.statistics.count_300;
    const n200 = score.statistics.count_katu;
    const n100 = score.statistics.count_100;
    const n50 = score.statistics.count_50;
    const n0 = score.statistics.count_miss;

    const statistics = [];
    const mode = getGameMode(score.mode, 1);

    switch (mode) {
        case 'o': {
            statistics.push({
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '100',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {
                index: '50',
                stat: n50,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#FEF668',
            }, {}, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            });
            break;
        }

        case 't': {
            statistics.push({
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '150',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {}, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            });
            break;
        }

        case 'c': {
            statistics.push({
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '100',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {
                index: '50',
                stat: n50,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#FEF668',
            }, {}, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            }, {
                index: 'MD',
                stat: n200,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#A1A1A1',
            });
            break;
        }

        case 'm': {
            statistics.push({
                index: '320',
                stat: n320,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#FEF668',
            }, {
                index: '200',
                stat: n200,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {
                index: '100',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#5E8AC6',
            }, {
                index: '50',
                stat: n50,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#A1A1A1',
            }, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            });
            break;
        }

    }

    return statistics;
}

//老面板的sumJudge
const score2StatisticsMax = (score) => {
    const n320 = score.statistics.count_geki;
    const n300 = score.statistics.count_300;
    const n200 = score.statistics.count_katu;
    const n100 = score.statistics.count_100;
    const n50 = score.statistics.count_50;
    const n0 = score.statistics.count_miss;

    const mode = getGameMode(score.mode, 1);

    switch (mode) {
        case 'o':
            return n300 + n100 + n50 + n0;
        case 't':
            return n300 + n100 + n0;
        case 'c':
            return Math.max(n300 + n100 + n0, n50, n200); //小果miss(katu)也要传过去的
        case 'm':
            return Math.max(n320 + n300, n200, n100, n50, n0);
        default:
            return n320 + n300 + n200 + n100 + n50 + n0;
    }
}

//132行的方法，获取大众评分
const score2PublicRating = (score) => {
    const ratings = score.beatmapset.ratings;

    const rating_sum = ratings ? ratings.reduce((s, v) => s + v) : 0;
    const rating_weight_val = ratings ? ratings.reduce((s, v, i) => s + v * i) : 0;
    return (rating_sum !== 0) ? Math.floor(rating_weight_val / rating_sum * 100) / 100 : 0;
}

//137行的方法，获取通过率等
const score2PassPercents = (score) => {
    let arr = [];

    const pc = score.beatmap.playcount || 0;
    const pass = score.beatmap.passcount || 0;

    const fail_sum = score.beatmap.fail ? score.beatmap.fail.reduce((s, v) => s + v) : 0;
    const retry_sum = score.beatmap.exit ? score.beatmap.exit.reduce((s, v) => s + v) : 0;
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
const score2Labels = (score, calcPP) => {
    const mode = getGameMode(score.mode, 1);
    const bpm = calcPP.attr.bpm;
    const mod_int = calcPP.attr.mods_int;

    let length = score.beatmap.total_length || 0;
    let drain = score.beatmap.hit_length || 0;

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
    const hasHPChanged = ((mode !== 'm') && hasAnyMod(mod_int, ["EZ", "HR", "DT", "HT", "NC", "DC"]));

    const cs_r = cs2px(calcPP.attr.cs, mode);
    const cs_b = getDecimals(calcPP.attr.cs, 2);
    const cs_m = stat2DataM(hasCSChanged, calcPP.attr.cs, score.beatmap.cs);

    const ar_r = ar2ms(calcPP.attr.ar, mode);
    const ar_b = getDecimals(calcPP.attr.ar, 2);
    const ar_m = stat2DataM(hasARChanged, calcPP.attr.ar, score.beatmap.ar);

    const od_r = od2ms(calcPP.attr.od, mode);
    const od_b = getDecimals(calcPP.attr.od, 2);
    const od_m = stat2DataM(hasODChanged, calcPP.attr.od, score.beatmap.accuracy);

    const hp_r = '-';
    const hp_b = getDecimals(calcPP.attr.hp, 2);
    const hp_m = stat2DataM(hasHPChanged, calcPP.attr.hp, score.beatmap.drain);

    return [{
        ...LABEL_OPTION.BPM,
        ...data2Label(bpm_r, bpm_b, bpm_m, true),
    },{
        ...LABEL_OPTION.LENGTH,
        ...data2Label(length_r, length_b, length_m, true),
    },{
        ...LABEL_OPTION.CS,
        ...data2Label(cs_r, cs_b, cs_m, isDisplayAR),
    },{
        ...LABEL_OPTION.AR,
        ...data2Label(ar_r, ar_b, ar_m, isDisplayCS),
    },{
        ...LABEL_OPTION.OD,
        ...data2Label(od_r, od_b, od_m, isDisplayOD),
    },{
        ...LABEL_OPTION.HP,
        ...data2Label(hp_r, hp_b, hp_m, true),
    }];
}

const cs2px = (cs, mode = 'o') => {
    if (mode === 'o') {
        let osupixel = (54.4 - 4.48 * cs).toFixed(2);
        if (osupixel.substr(-3) === '.00') return osupixel.slice(0, -3) + 'px';
        if (osupixel.substr(-2) === '.0') return osupixel.slice(0, -2) + 'px';
        return osupixel + 'px';
    } else if (mode === 'm') {
        return cs.toFixed(0) + ' Keys'
    } else {
        return '-';
    }
}

const ar2ms = (ar, mode = 'o') => {
    if (mode === 'o' || mode === 'c') {
        if (ar > 5) {
            if (ar > 11) return '300ms';
            return Math.floor(1200 - (150 * (ar - 5))) + 'ms';
        } else {
            return Math.floor(1800 - (120 * ar)) + 'ms';
        }
    } else {
        return '-'
    }
}

const od2ms = (od, mode = 'o') => {
    let ms;
    switch (mode) {
        case 'o': {
            if (od > 11) return '14ms';
            ms = Math.floor(80 - (6 * od)).toString();
            break;
        }
        case 't': {
            if (od > 10) return '17ms';
            ms = Math.floor(50 - (3 * od)).toString();
            break;
        }
        case 'c': {
            return '-';
        }
        case 'm': {
            if (od > 11) return '31ms';
            if (od < 0) return '64ms';
            ms = Math.floor(64 - (3 * od)).toString();
            break;
        }
    }
    if (ms.substr(-3) === '.00') return ms.slice(0, -3) + 'ms';
    if (ms.substr(-2) === '.0') return ms.slice(0, -2) + 'ms';
    return ms + 'ms';
}

const stat2DataM = (hasChanged = false, after = 0, before = 0) => {
    return getDecimals(after, 4) + (hasChanged ? (' (' + getDecimals(before, 2) + getDecimals(before, 4) + ')') : '');
}

const data2Label = (remark, data_b, data_m, isDisplay = true) => {

    if (isDisplay) return {
        remark: remark,
        data_b: data_b,
        data_m: data_m,
    }
    else return {
        remark: '-',
        data_b: '-',
        data_m: '',
    }
}

