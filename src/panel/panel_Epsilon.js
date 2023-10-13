import {exportJPEG, getAvatar, getExportFileV3Path, readNetImage, readTemplate} from "../util.js";

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
    const reg_text = /(?<=<g id="Text">)/;
    const reg_avatar = /(?<=<g id="Avatar">)/;

    const image = await getAvatar(data.uid || 0);

}