import {
    exportJPEG, getPanelHeight,
    getPanelNameSVG,
    setSvgBody, readTemplate,
    setText, setImage, getMapBackground, thenPush, getSvgBody
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_N} from "../card/card_N.js";
import {PanelGenerate} from "../util/panelGenerate.js";

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
    "start": 1,
    "is_legacy": false,
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
    const panel_name = getPanelNameSVG('Leader Board (!yml)', 'L')

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A2卡
    const beatmap_generated = await PanelGenerate.beatMap2CardA2(data.beatmap);
    const beatmap_a2 = card_A2(beatmap_generated);
    svg = setSvgBody(svg, 40, 40, beatmap_a2, reg_beatmap_a2);


    // 导入N1卡
    let promiseN1s = [];
    for (const i in data.scores) {
        const i0 = Math.max((parseInt(i) - 1), 0)

        const is_legacy = data?.is_legacy || false

        let compare_score;
        if (is_legacy) {
            compare_score = data.scores[i0].legacy_total_score
        } else {
            compare_score = data.scores[i0].total_score
        }

        const f = card_N({
            score: data.scores[i],
            score_rank: (parseInt(i) + (data?.start || 1)) || 0,
            compare_score: compare_score,
            is_legacy: is_legacy
        })

        promiseN1s.push(f);
    }

    let cardN1s = [];

    await Promise.allSettled(promiseN1s).then(results => thenPush(results, cardN1s))

    // 插入图片和部件
    svg = setImage(svg, 0, 0, 1920, 320, await getMapBackground(data.beatmap, 'cover'), reg_banner, 0.8);
    // svg = putCustomBanner(svg, reg_banner, await getMapBG(data.beatmap.beatmapset.id, 'cover', hasLeaderBoard(data.beatmap.ranked)));

    // 计算面板高度
    const rowTotal = Math.ceil((cardN1s?.length || 0) / 2);

    const panelHeight = getPanelHeight(cardN1s?.length, 62, 2, 290, 10, 40);
    const cardHeight = panelHeight - 290;

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    let stringN1s = ''

    //插入N1卡
    for (let i = 0; i < cardN1s.length; i++) {
        const x = (i < rowTotal) ? 40 : 965;
        const y = (i < rowTotal) ? (330 + i * 72) : (330 + (i - rowTotal) * 72);

        stringN1s += getSvgBody(x, y, cardN1s[i])
    }

    svg = setText(svg, stringN1s, reg_list_n1)

    return svg.toString();
}