import {getMapAttributes, getMapPerformance} from "../util/compute-pp.js";
import {hasLeaderBoard} from "../util/star.js";

export async function router(req, res) {
    const data = req.fields;
    res.set('Content-Type', 'application/json');
    try {
        const out = await getAttr(data);
        res.send(out);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

const dataTemp = {
    modeInt: 0,
    maps: [
        {
            id: 0, bid: 0, mods: 0, ranked: 0,
        },
    ]
};

async function getAttr(data = dataTemp) {
    let tasks = data.maps.map(async ({id, bid, mods, ranked}) => {

        let r =
            await getMapAttributes(bid, mods, data.modeInt, hasLeaderBoard(ranked));
        let pp =
            await getMapPerformance(bid, mods, data.modeInt, hasLeaderBoard(ranked));
        return {
            id, bid, mods,

            ar: r.ar.fixed(),
            od: r.od.fixed(),
            cs: r.cs.fixed(),
            hp: r.hp.fixed(),

            arWindow: r.arHitWindow.fixed(),
            odWindow: r.odHitWindow.fixed(),

            bpm: r.bpm.fixed(),
            stars: r.stars.fixed(),
            combo: r.max_combo,

            pp: pp.pp,
            ppAim: pp.ppAim,
            ppSpeed: pp.ppSpeed,
            ppAcc: pp.ppAcc,
            ppFlashlight: pp.ppFlashlight,
        };
    })

    let f = await Promise.all(tasks);
    return JSON.stringify(f);
}
