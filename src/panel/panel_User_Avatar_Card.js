import {compileTemplate, exportJPEG} from "../util/util.js";

/**
 * get user avatar card params
 * @param {string} banner
 * @param {string} avatar
 * @param {string} color
 * @param {string} name
 */
function generateParams(banner, avatar, color, name) {
    return {banner, avatar, color, name}
}

const userAvatarCardTemplate = compileTemplate("template/test/User_Avatar_Card.svg");

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

async function panel(data) {
    return userAvatarCardTemplate(data);
}
