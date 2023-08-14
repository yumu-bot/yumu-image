import fs from "fs";
import readline from "readline";
import axios from "axios";
import {Beatmap, Calculator} from "rosu-pp";
import {getGameMode, getModInt, OSU_BUFFER_PATH} from "./util.js";

const statistics = {
    count_50: 0,
    count_100: 0,
    count_300: 0,
    count_geki: 0,
    count_katu: 0,
    count_miss: 0,
    combo: 0,
    mods: [],
    mods_int: 0,
}

export async function getMapAttributes(bid, mods, mode_int = 0) {
    const osuFilePath = await getOsuFilePath(bid, getGameMode(mode_int), false);
    const beatMap = new Beatmap({
        path: osuFilePath,
    });
    let calculator = new Calculator({
        mods: mods,
    })
    return {
        ...calculator.difficulty(beatMap),
        ...calculator.mapAttributes(beatMap)
    };
}

export async function calcPerformancePoints(bid, score = statistics, mode, reload = false) {
    let mode_int = score.mods_int;
    if (!score.mods_int) {
        if (mode && typeof mode === 'string') {
            mode = mode ? mode.toLowerCase() : 'osu';
            switch (mode) {
                case 'osu':
                    mode_int = 0;
                    break;
                case 'taiko':
                    mode_int = 1;
                    break;
                case 'fruits':
                case 'catch':
                    mode_int = 2;
                    break;
                case 'mania':
                    mode_int = 3;
                    break;
            }
        } else {
            switch (mode) {
                default:
                case 0:
                    mode_int = 0;
                    mode = 'osu';
                    break;
                case 1:
                    mode_int = 1;
                    mode = 'taiko';
                    break;
                case 2:
                    mode_int = 2;
                    mode = 'fruits';
                    break;
                case 3:
                    mode_int = 3;
                    mode = 'mania';
                    break;
            }
        }
    }

    const osuFilePath = await getOsuFilePath(bid, mode, reload);
    let beatMap = new Beatmap({
        path: osuFilePath,
    });

    const mods = (score.mods_int) ? score.mods_int : ((score.mods && score.mods.length !== 0) ? getModInt(score.mods) : 0);
    let calculator = new Calculator({
        mode: mode_int,
        mods: mods,
        combo: score.combo,
        nMisses: score.count_miss,
        n50: score.count_50,
        n100: score.count_100,
        n300: score.count_300,
        nGeki: score.count_geki,
        nKatu: score.count_katu,
    })

    const now_pp = calculator.performance(beatMap);
    const difficulty = calculator.difficulty(beatMap);
    const attr = {
        ...calculator.mapAttributes(beatMap),
        stars: difficulty.stars,
        maxCombo: difficulty.maxCombo,
        mods_int: mods,
    };
    const maxCombo = difficulty.maxCombo;
    calculator.combo(maxCombo);
    calculator.n300(score.count_300 + score.count_miss);
    calculator.nMisses(0);
    const full_pp = calculator.performance(beatMap);

    const score_progress = await getScoreProgress(bid, score, mode);

    calculator = new Calculator({
        mode: mode_int,
        mods: mods,
        combo: maxCombo,
        n300: score.count_miss + score.count_50 + score.count_100 + score.count_300,
        nGeki: score.count_miss + score.count_50 + score.count_100 + score.count_300 + score.count_geki + score.count_katu,
    })
    const perfect_pp = calculator.performance(beatMap);

    return {
        pp: now_pp.pp,
        pp_all: now_pp,
        full_pp: full_pp.pp,
        full_pp_all: full_pp,
        perfect_pp: perfect_pp.pp,
        perfect_pp_all: perfect_pp,
        attr: attr,
        score_progress: score_progress,
    };

}

async function getOsuFilePath(bid, mode, reload = false) {
    mode = mode ? mode.toLowerCase() : 'osu';
    const filePath = `${OSU_BUFFER_PATH}/${bid}-${mode}.osu`;

    try {
        if (!reload) {
            fs.accessSync(filePath);
        }
    } catch (e) {
        reload = true;
    }

    if (reload) {
        let data = await axios.get(`https://osu.ppy.sh/osu/${bid}`);
        if (data.status === 200) {
            fs.writeFileSync(filePath, data.data, {flag: 'w'});
        } else {
            throw new Error("download error: " + data.statusText);
        }
    }
    return filePath;
}

export async function getDensityArray(bid, mode) {
    const timeList = await getHitObjectTimeList(bid, mode);

    const arrayLength = 26;
    const dataList = new Array(arrayLength).fill(0);

    const step = Math.floor((timeList[timeList.length - 1] - timeList[0]) / arrayLength) + 1;
    let stepEnd = timeList[0] + step;
    let item = 0;
    for (const tm of timeList) {
        if (tm >= stepEnd) {
            item++;
            if (item >= arrayLength) {
                dataList[item - 1]++;
                break;
            }
            stepEnd += step;
        }
        dataList[item]++;
    }
    return dataList;
}

//根据分数返回玩家目前的进度
export async function getScoreProgress(bid, statistics, mode) {

    const statTotal = getStatisticsTotal(statistics, mode);
    const timeList = await getHitObjectTimeList(bid, mode);
    const length = timeList.length;

    const startTime = timeList[0] || 0;
    const endTime = timeList[length - 1] || 0;
    const duration = endTime - startTime;

    let progress = 1; //返回的进度

    for (const i in timeList) {
        const v = timeList[i];

        if (i >= statTotal - 1) {
            progress = Math.min((v - startTime) / duration, 1)
            break;
        }
    }

    return progress;
}

async function getHitObjectTimeList(bid, mode) {
    const filePath = await getOsuFilePath(bid, mode);
    const input = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: input,
        crlfDelay: Infinity,
    });
    const isCatch = (mode === 'fruits' || mode === 'catch');

    let record = false;
    const timeList = [];
    for await (const l of rl) {
        if (l === '[HitObjects]') {
            record = true;
            continue;
        }
        if (record) {
            const time = parseInt(l.split(',')[2]);

            if (isCatch) {
                // 接水果滑条要看成多个大果
                const objectType = parseInt(l.split(',')[3]);

                const isSlider = ((objectType & (1 << 2 - 1)) >> 1) !== 0;
                const reverse = isSlider ? parseInt(l.split(',')[5]): 0; //滑动次数，没有折返就是1，有就是大于等于2

                const times = new Array(reverse).fill(time);
                timeList.push(time, ...times);

            } else {
                timeList.push(time);
            }
        }
    }
    return timeList;
}

function getStatisticsTotal(statistics = {}, mode = 'osu') {
    const n320 = statistics.count_geki || 0;
    const n300 = statistics.count_300 || 0;
    const n200 = statistics.count_katu || 0;
    const n100 = statistics.count_100 || 0;
    const n50 = statistics.count_50 || 0;
    const n0 = statistics.count_miss || 0;

    switch (mode) {
        case 'osu':
            return n300 + n100 + n50 + n0;
        case 'taiko':
            return n300 + n100 + n0;
        case 'fruits':
        case 'catch':
            return n300 + n0; //目前问题是，这个玩意没去掉miss中果，会偏大
        case 'mania':
            return n320 + n300 + n200 + n100 + n50 + n0;
    }
}