import fs from "fs";
import readline from "readline";
import axios from "axios";
import {Beatmap, Calculator} from "rosu-pp";
import {getGameMode, getModInt, OSU_BUFFER_PATH} from "./util.js";

const stat = {
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

export async function getMapAttributes(bid, mod_int, mode_int = 0, reload = false) {
    const osuFilePath = await getOsuFilePath(bid, getGameMode(mode_int), reload);
    const beatMap = new Beatmap({
        path: osuFilePath,
    });
    let calculator = new Calculator({
        mods: mod_int,
    })
    return {
        ...calculator.difficulty(beatMap),
        ...calculator.mapAttributes(beatMap)
    };
}

//计算谱面的参数
export async function calcMap(bid, statistics = stat, mode, reload = false) {
    const mode_int = statistics.mods_int ? getGameMode(statistics.mods_int, -2) :
        (mode ? getGameMode(mode, -2) : 1);
    const mode_name = mode ? getGameMode(mode, 0) :
        (statistics.mods_int ? getGameMode(statistics.mods_int, 0) : 'osu');

    const osuFilePath = await getOsuFilePath(bid, mode_name, reload);
    let beatMap = new Beatmap({
        path: osuFilePath,
    });

    const mod_int = (statistics.mods_int) ? statistics.mods_int : ((statistics.mods && statistics.mods.length !== 0) ? getModInt(statistics.mods) : 0);

    const combo = statistics.combo || 0;
    const acc = statistics.acc || 1;

    const calcBase = {
        mode: mode_int,
        mods: mod_int,
        combo: combo,
        acc: acc,
    }

    let arr = [];
    let fc_arr = [];
    let calc_N = new Calculator({...calcBase});
    const difficulty = calc_N.difficulty(beatMap);
    let calc_F = new Calculator({...calcBase, combo: difficulty.maxCombo});

    const attr = {
        ...calc_N.mapAttributes(beatMap),
        stars: difficulty.stars,
        maxCombo: difficulty.maxCombo,
        mods_int: mod_int,
    };
    //把原成绩放在第0位
    arr.push({acc: statistics.acc, pp: calc_N.performance(beatMap), attr: attr})

    for (let i = 0; i <= 10; i++) {
        //acc 重新赋值
        const a = 0.9 + 0.01 * i;
        calc_N.acc(a);
        calc_F.acc(a);

        arr.push(calc_N.performance(beatMap));
        fc_arr.push(calc_F.performance(beatMap));
    }

    arr.push(fc_arr); //这个放在 12 - 23位

    return arr;
}

export async function calcPerformancePoints(bid, statistics = stat, mode, reload = false) {
    const mode_int = statistics.mode_int ? getGameMode(statistics.mode_int, -2) :
        (mode ? getGameMode(mode, -2) : 1);
    const mode_name = mode ? getGameMode(mode, 0) :
        (statistics.mode_int ? getGameMode(statistics.mode_int, 0) : 'osu');

    const osuFilePath = await getOsuFilePath(bid, mode_name, reload);
    let beatMap = new Beatmap({
        path: osuFilePath,
    });

    const mod_int = (statistics.mods_int) ? statistics.mods_int : ((statistics.mods && statistics.mods.length !== 0) ? getModInt(statistics.mods) : 0);
    let calculator = new Calculator({
        mode: mode_int,
        mods: mod_int,
        combo: statistics.combo,
        nMisses: statistics.count_miss,
        n50: statistics.count_50,
        n100: statistics.count_100,
        n300: statistics.count_300,
        nGeki: statistics.count_geki,
        nKatu: statistics.count_katu,
    })

    const now_pp = calculator.performance(beatMap);
    const difficulty = calculator.difficulty(beatMap);
    const attr = {
        ...calculator.mapAttributes(beatMap),
        stars: difficulty.stars,
        maxCombo: difficulty.maxCombo,
        mods_int: mod_int,
    };
    const maxCombo = difficulty.maxCombo;
    calculator.combo(maxCombo);
    calculator.n300(statistics.count_300 + statistics.count_miss);
    calculator.nMisses(0);
    const full_pp = calculator.performance(beatMap);

    const score_progress = await getScoreProgress(bid, statistics, mode, reload);

    calculator = new Calculator({
        mode: mode_int,
        mods: mod_int,
        combo: maxCombo,
        n300: statistics.count_miss + statistics.count_50 + statistics.count_100 + statistics.count_300,
        nGeki: statistics.count_miss + statistics.count_50 + statistics.count_100 + statistics.count_300 + statistics.count_geki + statistics.count_katu,
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
    //mode = mode ? mode.toLowerCase() : 'osu';
    const filePath = `${OSU_BUFFER_PATH}/${bid}.osu`;

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

export async function getDensityArray(bid, mode, reload) {
    const timeList = await getHitObjectTimeList(bid, mode, reload);

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
export async function getScoreProgress(bid, statistics, mode, reload) {
    mode = getGameMode(mode, 0);
    const statTotal = await getStatisticsTotal(bid, statistics, mode, reload);
    const timeList = await getHitObjectTimeList(bid, mode, reload);
    const length = timeList.length;

    const startTime = timeList[0] || 0;
    const endTime = timeList[length - 1] || 0;
    const duration = endTime - startTime;

    let progress = 1; //返回的进度

    for (const i in timeList) {
        if (i >= statTotal - 1) {
            const v = timeList[i];

            progress = Math.min((v - startTime) / duration, 1)
            break;
        }
    }

    return progress;
}

async function getHitObjectTimeList(bid, mode, reload) {
    const filePath = await getOsuFilePath(bid, mode, reload);
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

                const isSlider = (((objectType & 2) >> 1) === 1);
                const reverse = isSlider ? parseInt(l.split(',')[6]) : 0; //滑动次数，没有折返就是1，有就是大于等于2

                const times = new Array(reverse).fill(time);
                timeList.push(time, ...times);

            } else {
                timeList.push(time);
            }
        }
    }
    return timeList;
}

async function getStatisticsTotal(bid, statistics = {}, mode = 'osu', reload = false) {
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
        case 'catch': {
            return n300 + n0; //目前问题是，这个玩意没去掉miss中果，会偏大
            //const attr = await getMapAttributes(bid, 0, 2, reload);
            //return attr.nFruits || n300 + n0; //已经解决？ //n300 + n0; //目前问题是，这个玩意没去掉miss中果，会偏大
        }
        case 'mania':
            return n320 + n300 + n200 + n100 + n50 + n0;
    }
}