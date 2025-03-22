import {
    exportJPEG, getMapBG, getPanelHeight,
    getPanelNameSVG,
    implantSvgBody, readTemplate,
    replaceText, implantImage
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_N} from "../card/card_N.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {hasLeaderBoard} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A3(data);
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
        const svg = await panel_A3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * rank图 单图成绩排行
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A3(data = {
    "beatmap": {},
    "scores": [],
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_A3.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_beatmap_a2 = /(?<=<g id="Beatmap_Card_A2">)/;
    const reg_list_n1 = /(?<=<g id="List_Card_N1">)/;
    // const reg_list_n2 = /(?<=<g id="List_Card_N2">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA3-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Leader Board (!yml)', 'L', 'v0.5.0 DX');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A2卡
    const beatmap_generated = await PanelGenerate.beatMap2CardA2(data.beatmap);
    const beatmap_a2 = card_A2(beatmap_generated);
    svg = implantSvgBody(svg, 40, 40, beatmap_a2, reg_beatmap_a2);


    // 导入N1卡
    let cardN1s = [];
    for (const i in data.scores) {
        const i0 = Math.max((parseInt(i) - 1), 0)
        const f = await card_N({
            score: data.scores[i],
            score_rank: parseInt(i) + 1 || 0,
            compare_score: data.scores[i0].total_score,
        })

        cardN1s.push(f);
    }

    // 插入图片和部件
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8,
        await getMapBG(data.beatmap.beatmapset.id, 'cover', hasLeaderBoard(data.beatmap.ranked)), reg_banner);
    // svg = putCustomBanner(svg, reg_banner, await getMapBG(data.beatmap.beatmapset.id, 'cover', hasLeaderBoard(data.beatmap.ranked)));

    // 计算面板高度
    const rowTotal = Math.ceil((cardN1s?.length || 0) / 2);

    const panelHeight = getPanelHeight(cardN1s?.length, 62, 2, 290, 10, 40);
    const cardHeight = panelHeight - 290;

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    //插入N1卡
    for (let i = 0; i < cardN1s.length; i++) {
        const x = (i < rowTotal) ? 40 : 965;
        const y = (i < rowTotal) ? (330 + i * 72) : (330 + (i - rowTotal) * 72);

        svg = implantSvgBody(svg, x, y, cardN1s[i], reg_list_n1);
    }

    return svg.toString();
}