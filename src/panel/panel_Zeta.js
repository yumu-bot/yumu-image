import {compileTemplate, exportJPEG, getAvatar, readNetImage} from "../util/util.js";
import {call_core} from "../../color/wasm_wrapper.js"
import {readFileSync} from "fs";
export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Zeta(data);
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
        const svg = await panel_Zeta(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * @param {string} data.banner
 * @param {string} data.avatar
 * @param {string} data.color
 * @param {string} data.name
 * @returns {Promise<String>}
 */
async function panel_Zeta(data) {
    data.avatar = await getAvatar(data.avatar);
    data.banner = await readNetImage(data.banner);
    const banner_data = readFileSync(data.banner);
    const color = call_core(new Uint8Array(banner_data), 5);
    data.color = color[0].to_hex();
    const userAvatarCardTemplate = compileTemplate("template/test/User_Avatar_Card.svg");

    return userAvatarCardTemplate(data);
}
