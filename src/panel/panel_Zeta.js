import {compileTemplate, getAvatar, readNetImage} from "../util/util.js";
import {call_core} from "../../color/wasm_wrapper.js"
import {readFileSync} from "fs";
import {createImageRouter, createSvgRouter} from "../util/image.js";

export const router = createImageRouter(panel_Zeta);

export const router_svg = createSvgRouter(panel_Zeta);

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
