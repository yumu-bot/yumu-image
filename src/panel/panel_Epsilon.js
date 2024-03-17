import {
    exportJPEG, getAvatar,
    getImageFromV3,
    implantImage, readTemplate,
    replaceText
} from "../util/util.js";
import {TahomaRegular} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Epsilon(data);
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
        const svg = await panel_Epsilon(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 头像, 面积贴图专用
 * @param data
 * @param reuse
 * @return {Promise<string>}
 */
export async function panel_Epsilon(data = {
    username: "",
    uid: 0,
    avatar_url: "https://a.ppy.sh/",
}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_Epsilon.svg');

    // 路径定义
    const reg_base = /(?<=<g id="Base">)/;
    const reg_avatar = /(?<=<g id="Avatar">)/;
    const reg_text = /(?<=<g id="Text">)/;

    const image = await getAvatar(data?.avatar_url);
    const name = TahomaRegular.getTextPath(
        TahomaRegular.cutStringTail(data.username || 'Unknown', 60, 460, true),
        230, 435, 60, 'center baseline', '#000'
    );

    svg = implantImage(svg, 460, 460, 0, 0, 1, getImageFromV3('panel-oldavatar.png'), reg_base);
    svg = implantImage(svg, 320, 320, 70, 40, 1, image, reg_avatar);
    svg = replaceText(svg, name, reg_text);

    return svg.toString();
}