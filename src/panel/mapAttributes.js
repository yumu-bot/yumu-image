import {getMapAttributes} from "../util/compute-pp.js";

export async function router(req, res) {
    const data = req.fields;
    res.set('Content-Type', 'application/json');
    try {
        const out = await getAttr(data);
        res.send(out);
    } catch (e) {
        res.status(500).send(e.stack);
        //res.json({ error: e }) 这个或许有用？

        //res.status(500);
        //res.render('error', {error: e});
    }
}

const dataTemp = {
    modeInt: 0,
    maps: [
        {
            id: 0, bid: 0, mods: 0,
        },
    ]
};

async function getAttr(data = dataTemp) {

    let tasks = data.maps.map(async ({id, bid, mods}) => {
        let r =
            await getMapAttributes(bid, mods, data.modeInt);
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
            combo: r.maxCombo,
        };
    })

    let f = await Promise.all(tasks);
    return JSON.stringify(f);
}
