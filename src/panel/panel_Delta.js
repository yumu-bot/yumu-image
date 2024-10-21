import {
    exportPNG,
    getDiffBG,
    getImageFromV3,
    getRoundedNumberStr,
    implantImage,
    implantSvgBody, readTemplate,
    replaceTexts
} from "../util/util.js";
import {lineSeedSans, poppinsBold} from "../util/font.js";
import {getMapAttributes} from "../util/compute-pp.js";
import {getModColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getModInt} from "../util/mod.js";
import {hasLeaderBoard} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Delta(data);
        res.set('Content-Type', 'image/png');
        res.send(await exportPNG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}
export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Delta(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 某个比赛的信息展示
 * @param data
 * @param reuse
 * @return {Promise<string>}
 */
export async function panel_Delta(data = {
    beatmap: {},

    round: 'Qualifier',
    mod: 'NM',
    position: '1',
    hasBG: true
}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_Delta.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_text = /(?<=<g id="Text">)/;
    const reg_stat = /(?<=<g id="Stat">)/;
    const reg_base = /(?<=<g id="Base">)/;
    const reg_background = /(?<=<g id="Background">)/;
    const reg_sr = /(?<=<g id="SR" filter="url\(#clippath-PDelta-SR\)">)/;
    const reg_cs = /(?<=<g id="CS" filter="url\(#clippath-PDelta-CS\)">)/;
    const reg_ar = /(?<=<g id="AR" filter="url\(#clippath-PDelta-AR\)">)/;
    const reg_od = /(?<=<g id="OD" filter="url\(#clippath-PDelta-OD\)">)/;
    const reg_length = /(?<=<g id="LH" clip-path="url\(#clippath-PDelta-LH\)">)/;

    const kita_color = '#C31542';
    const ryou_color = '#40ABF7';
    const hitori_color = '#FF82A0';
    const nijika_color = '#FBCF5B';

    // 谱面重计算
    const mod_str = data.mod ? data.mod.toString().toUpperCase() : 'NM';
    const position_str = data.position ? data.position.toString() : '';
    const mod_color = getModColor(mod_str);

    let mod_int = getModInt([mod_str]);

    const id = data.beatmap.id || 0;
    const attr = await getMapAttributes(id, mod_int);

    const length_num = (mod_str === 'DT') ? (data.beatmap.total_length / 1.5) :
        ((mod_str === 'EZ') ? (data.beatmap.total_length * 1.5) : data.beatmap.total_length);

    const length_minute_str = Math.floor(length_num / 60).toString();
    const length_second_str = Math.floor(length_num % 60).toString().padStart(2, '0');
    const bpm_str = Math.round(attr.bpm).toString();
    const star_str = getRoundedNumberStr(attr.stars, 3);
    const cs_str = getRoundedNumberStr(attr.cs, 2);
    const ar_str = getRoundedNumberStr(attr.ar, 2);
    const od_str = getRoundedNumberStr(attr.od, 2);
    const round = lineSeedSans.getTextPath(
        lineSeedSans.cutStringTail(data.round || 'Unknown', 42, 783 - 20, true)
        , 391.5, 538, 42, 'center baseline', '#282425');

    // 定义文字
    const title = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data.beatmap.beatmapset.title, 106, 880, true)
        , 1450, 318, 106, 'center baseline', '#fff');
    const artist = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data.beatmap.beatmapset.artist, 68, 880, true)
        , 1450, 414, 68, 'center baseline', '#fff');
    const difficulty = poppinsBold.getTextPath(
        '[' + poppinsBold.cutStringTail(data.beatmap.version, 64, 880, true) + ']'
        , 1450, 500, 64, 'center baseline', '#F9D4BA');

    const bid = poppinsBold.getTextPath('BID: ' + data.beatmap.id, 1450, 566, 42, 'center baseline', '#F9D4BA');
    const bpm = poppinsBold.getTextPath(bpm_str, 1720, 970, 54, 'center baseline', '#282425');
    const mod = poppinsBold.getTextPath(mod_str + position_str, 1453, 166, 68, 'center baseline', '#fff');

    const star = poppinsBold.getTextPath(star_str, 1360, 696, 48, 'left baseline', '#fff');
    const cs = poppinsBold.getTextPath(cs_str, 1360, 788, 48, 'left baseline', '#fff');
    const ar = poppinsBold.getTextPath(ar_str, 1360, 880, 48, 'left baseline', '#fff');
    const od = poppinsBold.getTextPath(od_str, 1360, 972, 48, 'left baseline', '#fff');

    const length = poppinsBold.getTextPath(length_minute_str + ':' + length_second_str, 1662.5, 820, 58, 'center baseline', '#fff');

    // 插入文字
    svg = replaceTexts(svg, [round, title, artist, difficulty, bid, bpm, mod, star, cs, ar, od, length], reg_text);

    // 插入图片和部件（新方法
    const mod_rrect = PanelDraw.Rect(1360, 100, 186, 82, 0, mod_color);
    const sr_rrect = PanelDraw.Rect(1010, 674, 336 * Math.max(Math.min(attr.stars, 11), 0) / 11, 8, 4, nijika_color);
    const cs_rrect = PanelDraw.Rect(1010, 766, 336 * Math.max(Math.min(attr.cs, 11), 0) / 11, 8, 4, kita_color);
    const ar_rrect = PanelDraw.Rect(1010, 858, 336 * Math.max(Math.min(attr.ar, 11), 0) / 11, 8, 4, ryou_color);
    const od_rrect = PanelDraw.Rect(1010, 950, 336 * Math.max(Math.min(attr.od, 11), 0) / 11, 8, 4, hitori_color);

    const length_pie = PanelDraw.PieChart(
        Math.min(length_num / 600, 1), 1662.5, 797.5, 200, 0, mod_color);

    svg = implantSvgBody(svg, 0, 0, mod_rrect, reg_stat);
    svg = implantSvgBody(svg, 0, 0, sr_rrect, reg_sr);
    svg = implantSvgBody(svg, 0, 0, cs_rrect, reg_cs);
    svg = implantSvgBody(svg, 0, 0, ar_rrect, reg_ar);
    svg = implantSvgBody(svg, 0, 0, od_rrect, reg_od);
    svg = implantSvgBody(svg, 0, 0, length_pie, reg_length);

    const image = await getDiffBG(data.beatmap.id, data.beatmap.beatmapset.id, 'list@2x', hasLeaderBoard(data.beatmap.status),
        data?.beatmap?.beatmapset?.availability?.more_information != null);

    svg = (data.hasBG === false) ? svg : implantImage(svg, 1080, 1080, -30, 0, 1, image, reg_background);
    svg = implantImage(svg, 1920, 1080, 0, 0, 1, getImageFromV3('panel-kita.png'), reg_base);
    svg = implantImage(svg, 153, 153, 1586, 721, 1, getImageFromV3('panel-kita-center.png'), reg_index);

    return svg.toString();
}