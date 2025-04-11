import {
    exportJPEG, getImageFromV3,
    getGameMode,
    getMapBG, getPanelNameSVG,
    setImage,
    setSvgBody, readTemplate, setText, getMatchDuration, getNowTimeStamp, od2ms, ar2ms, cs2px, rounds,
} from "../util/util.js";
import {calcMap, getDensityArray} from "../util/compute-pp.js";
import {data2Label, stat2DataM} from "./panel_E.js";
import {card_A2} from "../card/card_A2.js";
import {card_E1} from "../card/card_E1.js";
import {card_E3} from "../card/card_E3.js";
import {card_E5} from "../card/card_E5.js";
import {LABELS} from "../component/label.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getModInt, hasAnyMod, hasMod, matchAnyMods} from "../util/mod.js";
import {hasLeaderBoard, rankSS2X} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_E3(data);
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
        const svg = await panel_E3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 对局当前谱面
 * @param data
 * @return {Promise<string>}
 */
// E面板重构计划
export async function panel_E3(data = {
    expected: {},
    match: {}, // match calculate class
    beatmap: {}

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
    const request_time = 'match time: ' + getMatchDuration(data?.match) + ' // request time: ' + getNowTimeStamp();
    const panel_name = getPanelNameSVG('Match Listener - Match Start! (!ymml)', 'ST', request_time);
    svg = setText(svg, panel_name, reg_index);

    // 构建成绩

    const bid = data.beatmap.id;
    const stat = {
        acc: data.expected.accuracy * 100 || 100,
        combo: data.expected.combo > 0 ? data.expected.combo : data.beatmap.max_combo,
        mods: data.expected.mods || [],
        nMisses: data.expected.miss || 0,
    }
    const mode = data.expected.mode || data.beatmap.mode || 'osu';

    const calcTotal = await calcMap(bid, stat, mode, hasLeaderBoard(data.beatmap.ranked));
    const calcPP = calcTotal[0];

    let calcNC = [];
    let calcFC = [];

    for (let i = 1; i < 12; i++) {
        calcNC.push(calcTotal[i] || 0);
        calcFC.push(calcTotal[i + 11] || 0);
    }

    const rank = rankSS2X(getApproximateRankSP(data.expected.accuracy, data.expected.miss, data.beatmap.mode, data.expected.mods));
    // 卡片定义
    const cardA2 = card_A2(await PanelGenerate.matchRating2CardA2(data.match));
    const cardE1 = await card_E1(await beatmap2CardE1(data.beatmap, data.expected.mode || data.beatmap.mode, calcPP));
    const cardE5 = await card_E5(await expect2CardE5(data.expected, rank, data.beatmap.mode, data.beatmap.max_combo, calcPP, calcNC, calcFC));
    const cardE3 = await card_E3(await beatmap2CardE3(data.beatmap, rank, calcPP));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA2, reg_card_a1);
    svg = setSvgBody(svg, 0, 290, cardE1, reg_card_e1);
    svg = setSvgBody(svg, 880, 330, cardE5, reg_card_e2);
    svg = setSvgBody(svg, 880, 770, cardE3, reg_card_e3);

    // 图片定义
    const background = getImageFromV3(`object-score-backimage-${rank}.jpg`);
    const banner = await getMapBG(data.beatmap.beatmapset.id, 'cover', hasLeaderBoard(data.beatmap.ranked));

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.6);
    svg = setImage(svg, 0, 0, 1920, 330, banner, reg_banner, 0.8);

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
        combo: max_combo || expected.combo,
        pp: calcPP.pp.pp || 0,
        miss: expected.miss || 0,

        advanced_judge: expected2AdvancedJudge(rank, expected.miss, expected.mods),

        ncStats: expectedNC2Statistics(calcNC),
        fcStats: expectedFC2Statistics(calcFC),
        statistics_max: getStatMax(calcNC, calcFC),

        max_combo: calcPP.attr.max_combo || 0,
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
        density_arr: await getDensityArray(beatmap.id, beatmap.mode, hasLeaderBoard(beatmap.ranked)),
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

    const fail_sum = beatmap.fails ? beatmap.fails.reduce((s, v) => s + v) : 0;
    const retry_sum = beatmap.retries ? beatmap.retries.reduce((s, v) => s + v) : 0;
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
    const bpm_b = rounds(bpm, 2).integer
    const bpm_m = rounds(bpm, 2).decimal

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
    const cs_b = rounds(calcPP.attr.cs, 1).integer;
    const cs_m = stat2DataM(hasCSChanged, calcPP.attr.cs, beatmap.cs);

    const ar_r = ar2ms(calcPP.attr.ar, mode);
    const ar_b = rounds(calcPP.attr.ar, 1).integer;
    const ar_m = stat2DataM(hasARChanged, calcPP.attr.ar, beatmap.ar);

    const od_r = od2ms(calcPP.attr.od, mode);
    const od_b = rounds(calcPP.attr.od, 1).integer;
    const od_m = stat2DataM(hasODChanged, calcPP.attr.od, beatmap.accuracy);

    const hp_r = '-';
    const hp_b = rounds(calcPP.attr.hp, 1).integer;
    const hp_m = stat2DataM(hasHPChanged, calcPP.attr.hp, beatmap.drain);

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