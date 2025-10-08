import {
    exportJPEG,
} from "../util/util.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B4(data);
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
        const svg = await panel_B4(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * Skill 信息面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_B4(data = {
    user: {},
    pp_minus: {
        accuracy: 0.64, // 0-1
        potential: 0.85,
        stamina: 0.76,
        stability: 0.543,
        effort: 0.645,
        strength: 0.984,

        improvement_indicator: 0, // 0-?
        overall: 0.904
    }

}) {


}