import {compileTemplate, exportJPEG, getAvatar, readNetImage} from "../util/util.js";

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

/**
 * @param {string} data.banner
 * @param {string} data.avatar
 * @param {string} data.color
 * @param {string} data.name
 * @returns {Promise<String>}
 */
async function panel(data) {
    data.avatar = await getAvatar(data.avatar);
    data.banner = await readNetImage(data.banner);
    return userAvatarCardTemplate(data);
}
