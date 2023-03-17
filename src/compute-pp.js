import fs from "fs";
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
    max_combo: 0,
    mods: [],
    mods_int: 0,
}

export async function calcPerformancePoints(bid, score = statistics, mode) {
    mode = mode.toLowerCase() || 'osu';

    const osuFilePath = await getOsuFilePath(bid, mode);

    let beatMap = new Beatmap({
        path: osuFilePath,
    });
    let mode_int;
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
    let calculator = new Calculator({
        mode: mode_int,
        mods: (score.mods && score.mods.length === 0) ? getModInt(score.mods) : mode_int,
        combo: score.combo,
        nMisses: score.count_miss,
        n50: score.count_50,
        n100: score.count_100,
        n300: score.count_300,
    })

    const currAttrs = calculator.performance(beatMap);
    const now_pp = currAttrs.pp;
    if (score?.max_combo) {
        calculator.combo(score.max_combo);
        const full_pp = currAttrs.pp;
        return {
            pp: now_pp,
            full_pp: full_pp
        };
    } else {
        return {
            pp: now_pp,
        };
    }

}

async function getOsuFilePath(bid, mode) {
    const filePath = `${OSU_BUFFER_PATH}/${bid}.osu`;
    mode = mode || 'osu';
    try {
        fs.accessSync(filePath);
    } catch (e) {
        let data = await axios.get(`https://osu.ppy.sh/${mode}/${bid}`);
        if (data.status === 200) {
            fs.writeFileSync(filePath, data.data, {flag: 'a'});
        } else {
            throw new Error("download error: " + data.statusText);
        }
    }
    return filePath;
}