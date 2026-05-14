import {
    exportJPEG,
    getImage,
    getImageFromV3,
    getImageOrElse,
    getMapBackground, getNowTimeStamp,
    getOrNull,
    getPanelNameSVG,
    getSvgBody, round,
} from "../util/util.js";
import {component_V} from "../component/component_V.js";
import {PanelDraw} from "../util/panelDraw.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A2} from "../card/card_A2.js";
import {torusBold} from "../util/font.js";
import {getBeatmapFilePath, getLongestBPM, normalizeBpm, parseBeatmapFile} from "../util/osuFile.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_V3(data);
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
        const svg = await panel_V3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 接水果谱面预览面板
 * !v:2
 * @param data
 * @return {Promise<string>}
 */
export async function panel_V3(
    data = {
        beatmap: {},
        page: 1,
        mode: 'fruits',
        rows: 5,
        variation: false,
    })
{


}