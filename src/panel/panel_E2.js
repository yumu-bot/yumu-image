import {
    exportJPEG, getImageFromV3,
    getGameMode,
    getPanelNameSVG,
    setImage,
    setSvgBody, readTemplate, setText, od2ms, ar2ms, cs2px, floors, getMapBackground,
} from "../util/util.js";
import {data2Label, stat2DataM} from "./panel_E.js";
import {card_A1} from "../card/card_A1.js";
import {card_E1} from "../card/card_E1.js";
import {card_E3} from "../card/card_E3.js";
import {card_E5} from "../card/card_E5.js";
import {LABELS} from "../component/label.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getModInt, hasAnyMod, hasMod, matchAnyMods} from "../util/mod.js";

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

/**
 * 铺面完整的成绩信息, pp类的
 * @param data
 * @return {Promise<string>}
 */
// E面板重构计划
export async function panel_E2(data = {
    expected: { accuracy: 1, combo: 1262, mods: [ 'HD' ], miss: 0, mode: 'osu'},
    user: {
        id: 7003013,
        pp: 6196.46,
        username: 'Muziyami',
        occupation: 'Elite Graveyarded Mapper',
        discord: 'YumeMuzi#5619',
        interests: 'yuyuko❤',
        monthly_playcounts: [[Object],],
        supporter: false,
        uid: 7003013,
        bot: false,
        online: true,
        deleted: false,
        total_hits: 8881602,
        playCount: 23796,
        country_rank: 666,
        level_current: 100,
        accuracy: 99.0353,
        levelProgress: 48,
        global_rank: 35559,
        play_time: 2344876,
        max_combo: 2801,
        avatar_url: 'https://a.ppy.sh/7003013?1689405046.jpeg',
        cover_url: 'https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg',
        default_group: 'default',
        is_active: true,
        is_bot: false,
        is_deleted: false,
        is_online: true,
        is_supporter: false,
        last_visit: '2023-12-24T16:18:11+00:00',
        pm_friends_only: false,
        mode: 'OSU',
        nominated_beatmapset_count: 0,
        favourite_beatmapset_count: 85,
        graveyard_beatmapset_count: 116,
        pending_beatmapset_count: 0,
        ranked_beatmapset_count: 4,
        ranked_and_approved_beatmapset_count: 4,
        guest_beatmapset_count: 26,
        loved_beatmapset_count: 0,
        groups: [],
        beatmap_playcounts_count: 6873,
        mapping_follower_count: 62,
        has_supported: true,
        profile_order: [
            'me',
            'recent_activity',
            'top_ranks',
            'beatmaps',
            'historical',
            'medals',
            'kudosu'
        ],
        previous_usernames: [ 'lp_Blue' ],
        join_date: '2015-08-28T12:42:47+00:00',
        max_friends: 500,
        comments_count: 674,
        support_level: 0,
        post_count: 244,
        follower_count: 495,
        team: {
            flag_url: "https://assets.ppy.sh/teams/flag/79/a383b50aec24e020947674e4d545a1fd1ac9867e2a241b8286ba8553d6d9ff22.png",
            id: 79,
            name: "team cool",
            short_name: "COOL"
        },
        statistics: {
            pp: 6196.46,
            count_ss: 32,
            count_ssh: 120,
            count_sh: 977,
            count_s: 177,
            count_a: 1341,
            ranked: true,
            count_50: 84547,
            count_100: 733056,
            count_300: 8063999,
            count_miss: 286537,
            ranked_score: 29744806255,
            total_score: 75196638028,
            hit_accuracy: 99.0353,
            play_count: 23796,
            play_time: 2344876,
            total_hits: 8881602,
            maximum_combo: 2801,
            is_ranked: true,
            global_rank: 35559,
            replays_watched_by_others: 251,
            country_rank: 666,
            level_current: 100,
            level_progress: 48
        },
        cover: {
            url: 'https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg',
            custom_url: 'https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg'
        },
        country: { country_code: 'CN', country_name: 'China' },
        kudosu: { total: 391, available: 391 },
        rank_history: { mode: 'OSU', data: [Array] }
    },
    beatmap: {
        id: 2274671,
        mode: 'osu',
        status: 'ranked',
        version: 'Brilliant Dreamland',
        ar: 9.3,
        cs: 4,
        bpm: 160,
        convert: false,
        passcount: 5485,
        playcount: 36298,
        ranked: 1,
        url: 'https://osu.ppy.sh/beatmaps/2274671',
        beatMapFailedList: [
            0,  54,  63, 720, 3110, 1317, 697, 1443, 920, 396, 495, 297,
            752, 415, 246, 684,  315,  234, 182,  234, 270, 361,  81, 117,
            54,  27,  63,  90,  315,  137, 261,  298, 153, 200, 153, 136,
            118, 117,  72, 119,  369,  243,  63,  100, 117,  72, 262, 181,
            117,  36,  18,   9,   64,   45,  72,   72,  45,  18,  18,  72,
            37,   9,  45,   0,    1,   18,   9,   27,  55,  18,  27,  46,
            18,  54,  45,  18,   18,   45,  81,   63,   9,  18,  27,  36,
            46,  19,   9,  45,   36,    9,  90,   27,   0,  27,   0,  18,
            81,  54,  72,  18
        ],
        beatMapRetryCount: 11059,
        beatMapFailedCount: 18984,
        beatMapRetryList: [
            0,   0,   0, 972, 1503, 712, 342, 297,  27, 234, 261, 441,
            424, 279, 497, 297,  342, 180, 171,  90, 171, 162,  18,  99,
            27,  90,  54, 317,  126,  73, 108,  99,  90, 190,  91,  81,
            54,  37,  27,  99,  171, 108,  27,  72,  29,   9,  23,  27,
            9,   0,   9,   9,    0,  19,  18,  27,   9,  36,  45,  18,
            18,  18,   9,   0,   36,  55,  72,  19,  18,  36,  45,  20,
            9,  72,  27,  18,   63, 109,  18,   9,   9,   9,   0,  72,
            27,  19,   0,  18,   27,  73,  45,  45,   0,  36,  36,  36,
            81,  72,  27,   9
        ],
        beatMapRating: 0,
        beatmapset_id: 1087774,
        difficulty_rating: 5.41,
        mode_int: 0,
        total_length: 192,
        hit_length: 189,
        user_id: 7003013,
        accuracy: 8,
        drain: 6,
        max_combo: 1262,
        is_scoreable: true,
        last_updated: '2022-03-05T07:06:51Z',
        checksum: '7d479062a03c7cde63513138c622d5c1',
        count_sliders: 405,
        count_spinners: 1,
        count_circles: 432,
        beatmapset: {
            video: false,
            availabilityDownloadDisable: false,
            fromDatabases: false,
            ratingList: [Array],
            ranked: true,
            rating: 0.9447129909365559,
            sid: 1087774,
            mapperUID: 7003013,
            mapperName: 'Muziyami',
            id: 1087774,
            user_id: 7003013,
            bpm: 162,
            artist: 'Wang Rui',
            artist_unicode: '汪睿',
            title: 'Tao Hua Xiao',
            title_unicode: '桃花笑',
            creator: 'Muziyami',
            favourite_count: 401,
            nsfw: false,
            play_count: 196607,
            preview_url: '//b.ppy.sh/preview/1087774.mp3',
            source: '小女花不弃',
            status: 'ranked',
            legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/1005413',
            tags: 'peach blossom cpop c-pop pop chinese 古风 oriental bilibili cover rearrangement 纳兰寻风 na lan xun feng 西门振 xi men zhen 青萝子 qing luo zi op opening xiao nv hua bu qi i will never let you go houshou hari dacaigou kisaki dahkjdas -ovo-',
            storyboard: true,
            covers: [Object],
            ratings: [Array],
            spotlight: false,
            last_updated: 1646464010,
            ranked_date: 1647193324
        }
    }

}){
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
    svg = setText(svg, getPanelNameSVG('Map Statistics (!ymm)', 'M'), reg_index);

    // 构建成绩

    const bid = data.beatmap.id;
    const stat = {
        acc: data?.expected?.accuracy * 100 || 100,
        combo: data?.expected?.combo || data.beatmap.max_combo,
        mods: data?.expected?.mods || [],
        nMisses: data?.expected?.miss || 0,
    }
    const mode = getGameMode(data?.expected?.mode, 0, data?.beatmap?.mode);

    const calcTotal = {}
    const calcPP = calcTotal[0];

    let calcNC = [];
    let calcFC = [];

    for (let i = 1; i < 12; i++) {
        calcNC.push(calcTotal[i] || 0);
        calcFC.push(calcTotal[i + 11] || 0);
    }

    const rank = rank2rank(getApproximateRankSP(data.expected.accuracy, data.expected.miss, mode, data.expected.mods));


    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    const cardE1 = await card_E1(await beatmap2CardE1(data.beatmap, mode, calcPP));
    const cardE5 = await card_E5(await expect2CardE5(data.expected, rank, mode, data.beatmap.max_combo, calcPP, calcNC, calcFC));
    const cardE3 = await card_E3(await beatmap2CardE3(data.beatmap, rank, calcPP));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = setSvgBody(svg, 0, 290, cardE1, reg_card_e1);
    svg = setSvgBody(svg, 880, 330, cardE5, reg_card_e2);
    svg = setSvgBody(svg, 880, 770, cardE3, reg_card_e3);

    // 图片定义
    const background = getImageFromV3('object-score-backimage-' + rank + '.jpg');
    const banner = await getMapBackground(data.beatmap, 'cover');

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.6);
    svg = setImage(svg, 0, 0, 1920, 320, banner, reg_banner, 0.8);

    return svg.toString();
}

async function beatmap2CardE1(beatmap, mode, calcPP) {
    return {
        ranked: beatmap?.ranked || 0,
        mode: mode || 'osu',
        star: calcPP.attr.stars || 0,
        cover: beatmap.beatmapset.covers["list@2x"],
        title: beatmap.beatmapset.title || '',
        title_unicode: beatmap.beatmapset.title_unicode || '',
        version: beatmap.version || '',
        artist: beatmap.beatmapset.artist || '',
        creator: beatmap.beatmapset.creator || '',
        sid: beatmap.beatmapset.id || 0,
        bid: beatmap.id || 0,
        status: beatmap.beatmapset.status || 'unranked',
        favourite_count: beatmap.beatmapset.favourite_count || 0,
        play_count: beatmap.beatmapset.play_count || 0,
    }
}

async function expect2CardE5(expected, rank = 'F', mode = 'osu', max_combo = 0, calcPP, calcNC = [0], calcFC = [0]) {
    const isFC = expected.combo >= calcPP.attr.max_combo && expected.miss <= 0;
    const isPF = rank === 'XH' || rank === 'X';

    return {
        rank: rank || 'F',
        mode: mode,
        mods: expected.mods || [],
        accuracy: expected.accuracy || 0,
        combo: expected.combo || max_combo,
        pp: calcPP.pp.pp || 0,
        miss: expected.miss || 0,

        advanced_judge: expected2AdvancedJudge(rank, expected.miss, expected.mods),

        ncStats: expectedNC2Statistics(calcNC),
        fcStats: expectedFC2Statistics(calcFC),
        statistics_max: getStatMax(calcNC, calcFC),

        max_combo: calcPP.attr.max_combo || max_combo || 0,
        full_pp: calcNC?.[10]?.pp || 0,
        max_pp: calcFC?.[10]?.pp || 0,

        isFC: isFC,
        isPF: isPF,
    }
}

const expected2AdvancedJudge = (rank = 'F', miss = 0, mods = ['NF']) => {
    const isPF = rank === 'XH' || rank === 'X' || rank === 'SSH' || rank === 'SS';

    if (hasMod(getModInt(mods), 'NF') || rank === 'F') {
        return 'played';
    } else if (isPF) {
        return 'perfect';
    } else if (miss === 0) {
        return 'nomiss';
    } else if (rank !== 'F') {
        return 'clear';
    } else {
        return 'played';
    }
}

const getStatMax = (calcNC, calcFC) => {
    let pps = []
    let max = 0;

    for (const n of calcNC) {
        pps.push(n.pp)
    }
    for (const n of calcFC) {
        pps.push(n.pp)
    }
    for (const p of pps) {
        max = Math.max(max, p);
    }
    return max;
}


const expectedFC2Statistics = (calcFC) => {
    let statistics = [];
    statistics.push({
        index: '100',
        stat: Math.round(calcFC[10].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#88C5F3',
    }, {
        index: '99',
        stat: Math.round(calcFC[9].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#8CC4C1',
    }, {
        index: '98',
        stat: Math.round(calcFC[8].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#8FC295',
    }, {
        index: '96',
        stat: Math.round(calcFC[6].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#A7CE95',
    }, {
        index: '94',
        stat: Math.round(calcFC[4].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#C4DB95',
    }, {
        index: '92',
        stat: Math.round(calcFC[2].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#FFF995',
    });
    return statistics;
}

const expectedNC2Statistics = (calcNC) => {
    let statistics = [];
    statistics.push({
        index: '100',
        stat: Math.round(calcNC[10].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#55B1EF',
    }, {
        index: '99',
        stat: Math.round(calcNC[9].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#5EB0AB',
    }, {
        index: '98',
        stat: Math.round(calcNC[8].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#62AE70',
    }, {
        index: '96',
        stat: Math.round(calcNC[6].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#88BD6F',
    }, {
        index: '94',
        stat: Math.round(calcNC[4].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#ADCE6D',
    }, {
        index: '92',
        stat: Math.round(calcNC[2].pp),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#FFF767',
    });
    return statistics;
}

async function beatmap2CardE3(beatmap, rank, calcPP) {
    const pass_arr = beatmap2PassPercents(beatmap);

    return {
        density_arr: [],
        retry_arr: beatmap.retries || [],
        fail_arr: beatmap.fails || [],

        public_rating: beatmap?.beatmapset?.public_rating, //beatmap2PublicRating(beatmap),
        pass_percent: pass_arr[0],
        retry_percent: pass_arr[1],
        fail_percent: pass_arr[2],

        labels: beatmap2Labels(beatmap, calcPP),
        rank: rank,
        star: calcPP.attr.stars,
        score_progress: 1,
    }
}

//SS和X的转换
const rank2rank = (rank = 'SS') => {
    switch (rank) {
        case "SS": return 'X';
        case "SSH": return 'XH';
        default: return rank;
    }
}

const getApproximateRankSP = (acc = 1, miss = 0, mode = 'osu', mods = ['']) => {
    let rank = 'F';
    const hasMiss = miss > 0;

    switch (getGameMode(mode, 1)) {
        case 'o' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc >= 0.9317) {
                if (hasMiss) {
                    rank = 'A';
                } else {
                    rank = 'S';
                }
            } else if (acc >= 0.8333) {
                if (hasMiss) {
                    rank = 'B';
                } else {
                    rank = 'A';
                }
            } else if (acc >= 0.75) {
                if (hasMiss) {
                    rank = 'C';
                } else {
                    rank = 'B';
                }
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
                if (hasMiss) {
                    rank = 'A';
                } else {
                    rank = 'S';
                }
            } else if (acc >= 0.9) {
                if (hasMiss) {
                    rank = 'B';
                } else {
                    rank = 'A';
                }
            } else if (acc >= 0.8) {
                if (hasMiss) {
                    rank = 'C';
                } else {
                    rank = 'B';
                }
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

    const isSilver = matchAnyMods(mods, ['HD', 'FI', 'FL', 'BL'])
    if ((rank === 'SS' || rank === 'S') && isSilver) rank += 'H';

    return rank;
}

//137行的方法，获取通过率等
const beatmap2PassPercents = (beatmap) => {
    let arr = [];

    const pc = beatmap.playcount || 0;
    const pass = beatmap.passcount || 0;

    const fail_sum = beatmap?.fails ? beatmap?.fails.reduce((s, v) => s + v) : 0;
    const retry_sum = beatmap?.retries ? beatmap?.retries.reduce((s, v) => s + v) : 0;
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
    const bpm_b = floors(bpm, 2).integer
    const bpm_m = floors(bpm, 2).decimal

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
    const cs_b = floors(calcPP.attr.cs, 1).integer;
    const cs_m = stat2DataM(hasCSChanged, calcPP.attr.cs, beatmap.cs);

    const ar_r = ar2ms(calcPP.attr.ar, mode);
    const ar_b = floors(calcPP.attr.ar, 1).integer;
    const ar_m = stat2DataM(hasARChanged, calcPP.attr.ar, beatmap.ar);

    const od_r = od2ms(calcPP.attr.od, mode);
    const od_b = floors(calcPP.attr.od, 1).integer;
    const od_m = stat2DataM(hasODChanged, calcPP.attr.od, beatmap.od);

    const hp_r = '-';
    const hp_b = floors(calcPP.attr.hp, 1).integer;
    const hp_m = stat2DataM(hasHPChanged, calcPP.attr.hp, beatmap.hp);

    return [{
        ...LABELS.BPM,
        ...data2Label(bpm_r, bpm_b, bpm_m, true),
    },{
        ...LABELS.LENGTH,
        ...data2Label(length_r, length_b, length_m, true),
    },{
        ...LABELS.CS,
        ...data2Label(cs_r, cs_b, cs_m, isDisplayCS),
    },{
        ...LABELS.AR,
        ...data2Label(ar_r, ar_b, ar_m, isDisplayAR),
    },{
        ...LABELS.OD,
        ...data2Label(od_r, od_b, od_m, isDisplayOD),
    },{
        ...LABELS.HP,
        ...data2Label(hp_r, hp_b, hp_m, true),
    }];
}