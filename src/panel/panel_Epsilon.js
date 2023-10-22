import {
    exportJPEG,
    getAvatar,
    getExportFileV3Path,
    implantImage, readTemplate,
    replaceText
} from "../util/util.js";
import {VeranaSansMR} from "../util/font.js";

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

export async function panel_Epsilon(data = {
    username: "SIyuyuko",
    uid: 7000123,
}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_Epsilon.svg');

    // 路径定义
    const reg_base = /(?<=<g id="Base">)/;
    const reg_avatar = /(?<=<g id="Avatar">)/;
    const reg_text = /(?<=<g id="Text">)/;

    const image = await getAvatar(data.uid || 0);
    const name = VeranaSansMR.getTextPath(
        VeranaSansMR.cutStringTail(data.username || 'Unknown', 60, 460, true),
        230, 435, 60, 'center baseline', '#000'
    );

    svg = implantImage(svg, 460, 460, 0, 0, 1, getExportFileV3Path('panel-oldavatar.png'), reg_base);
    svg = implantImage(svg, 320, 320, 70, 40, 1, image, reg_avatar);
    svg = replaceText(svg, name, reg_text);

    return svg.toString();
}