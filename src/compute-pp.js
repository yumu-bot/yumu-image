import fs from "fs";
import readline from "readline";
import axios from "axios";
import {Beatmap, Calculator} from "rosu-pp";
import {getModInt, OSU_BUFFER_PATH} from "./util.js";

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

export async function calcPerformancePoints(bid, score = statistics, mode, reload = false) {
    let mode_int;
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

    const osuFilePath = await getOsuFilePath(bid, mode, reload);

    let beatMap = new Beatmap({
        path: osuFilePath,
    });
    const mods = (score.mods && score.mods.length !== 0) ? getModInt(score.mods) : 0;
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
    return {
        pp: now_pp.pp,
        pp_all: now_pp,
        full_pp: full_pp.pp,
        full_pp_all: full_pp,
        attr: attr,
    };

}

async function getOsuFilePath(bid, mode, reload = false) {
    mode = mode ? mode.toLowerCase() : 'osu';
    const filePath = `${OSU_BUFFER_PATH}/${bid}-${mode}.osu`;

    try {
        if (!reload) {
            fs.accessSync(filePath);
            const f = fs.readFileSync(filePath, 'binary');
            let map = new Beatmap().fromBytes(f)
            const attr = new Calculator().difficulty(map);
            if (attr.stars > 10) {
                reload = true;
            }
        }
    } catch (e) {
        reload = true;
    }

    if (reload) {
        let data = await axios.get(`https://osu.ppy.sh/osu/${bid}`);
        if (data.status === 200) {
            const d = data.data;

            fs.writeFileSync(filePath, data.data, {flag: 'a'});

        } else {
            throw new Error("download error: " + data.statusText);
        }
    }
    return filePath;
}

export async function getDensityArray(bid, mode) {
    const filePath = await getOsuFilePath(bid, mode);
    const input = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: input,
        crlfDelay: Infinity,
    });
    let record = false
    const timeList = [];
    for await (const l of rl) {
        if (l === '[HitObjects]') {
            record = true;
            continue;
        }
        if (record) {
            let time = parseInt(l.split(',')[2]);
            timeList.push(time);
        }
    }
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