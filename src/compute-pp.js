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
    mods: [],
    mods_int: 0,
}

export async function calcPerformancePoints(bid, score = statistics, mode) {
    let mode_int;
    if (mode && typeof mode === 'string') {
        mode = mode || mode.toLowerCase() || 'osu';
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

    const osuFilePath = await getOsuFilePath(bid, mode);

    let beatMap = new Beatmap({
        path: osuFilePath,
    });

    let calculator = new Calculator({
        mode: mode_int,
        mods: (score.mods && score.mods.length === 0) ? getModInt(score.mods) : mode_int,
        combo: score.combo,
        nMisses: score.count_miss,
        n50: score.count_50,
        n100: score.count_100,
        n300: score.count_300,
    })

    const now_pp = calculator.performance(beatMap);
    const maxCombo = calculator.difficulty(beatMap).maxCombo
    calculator.combo(maxCombo);
    calculator.n300(score.count_300 + score.count_miss);
    calculator.nMisses(0);
    const full_pp = calculator.performance(beatMap);
    return {
        pp: now_pp.pp,
        pp_all: now_pp,
        full_pp: full_pp.pp,
        full_pp_all: full_pp,
    };

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
