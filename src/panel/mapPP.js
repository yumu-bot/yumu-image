import {calcPerformancePoints} from "../util/compute-pp.js";
import {hasLeaderBoard} from "../util/star.js";
import {getModInt} from "../util/mod.js";


export async function router(req, res) {
    const data = req.fields;
    res.set('Content-Type', 'application/json');
    try {
        const out = await getBPFix(data);
        res.send(out);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

const dataTemp = {
    scores: [
        {
            beatmap: {}, mods: [''], mode_int: 0, statistics: 0, max_combo: 0,
        },
    ]
};

async function getBPFix(data = dataTemp) {
    let tasks = data.scores.map(async ({beatmap, mods, mode_int, statistics, max_combo}) => {
        let stat;
        const mods_int = getModInt(mods);

        switch (mode_int) {
            case 0:
            case 1: stat = {
                count_50 : statistics.count_50,
                count_100 : statistics.count_100,
                count_300 : statistics.count_300 + statistics.count_miss,
                count_geki : statistics.count_geki + statistics.count_katu,
                count_katu : 0,
                count_miss : 0,
                mode_int: mode_int,
                mods_int: mods_int,
                combo: max_combo,
            }; break;
            case 2:
            case 3: stat = {
                count_50 : statistics.count_50,
                count_100 : statistics.count_100,
                count_300 : statistics.count_300 + statistics.count_miss,
                count_geki : statistics.count_geki,
                count_katu : statistics.count_katu,
                count_miss : 0,
                mode_int: mode_int,
                mods_int: mods_int,
                combo: max_combo,
            }; break;
        }

        const pp = await calcPerformancePoints(beatmap?.id, stat, mode_int, hasLeaderBoard(beatmap?.ranked));
        return {
            id: beatmap?.id,
            fixPP: pp.full_pp,
        }
    })

    let f = await Promise.all(tasks);
    return JSON.stringify(f);
}