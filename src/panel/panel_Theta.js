import {exportJPEG} from "../util/util.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Theta(data);
        res.set('Content-Type', 'image/png');
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
        const svg = await panel_Theta(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 *
 * @returns {Promise<String>}
 */
async function panel_Theta(data) {

    return ""
}