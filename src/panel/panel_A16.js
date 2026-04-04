import {
    exportJPEG, getPanelHeight,
    getPanelNameSVG,
    setSvgBody, readTemplate,
    setText, setImage, getMapBackground, getSvgBody, renderInBatch, getNowTimeStamp
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A4} from "../card/card_A4.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A16(data);
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
        const svg = await panel_A16(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 群内成绩排行
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A16(data = {
    "beatmap": {},
    "scores": [],
    "mode": "osu",
    "group": 10086,
    "page": 1,
    "max_page": 1,
}) {
    // 导入模板
    let svg = readTemplate('template/panel_A3.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_beatmap_a2 = /(?<=<g id="Beatmap_Card_A2">)/;
    const reg_list_n1 = /(?<=<g id="List_Card_N1">)/;
    // const reg_list_n2 = /(?<=<g id="List_Card_N2">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA3-1\);">)/;

    // 面板文字

    const request_time = 'groupID: ' + (data.group ?? 'unknown') + ' // request time: ' + getNowTimeStamp()
    // 插入文字
    svg = setText(svg, getPanelNameSVG('Group Leader Board (!ymlg)', 'LG', request_time), reg_index, );

    /**
     * @type {number}
     */
    const bind = data?.user?.user_id ?? 0
    const ss = data.scores ?? []

    let promise_a4s = [];
    for (let i = 0; i < ss.length; i++) {
        const s0 = ss[Math.max(i - 1, 0)]
        const s = ss[i]

        let compare_score;

        const is_legacy = s0.legacy_total_score > 0

        if (is_legacy) {
            const l = s0.legacy_total_score ?? s0.total_score

            if (l > 0) {
                compare_score = l
            } else {
                compare_score = s0.total_score
            }
        } else {
            compare_score = s0.total_score
        }

        const promise_a4 = card_A4({
            bind: bind,
            score: s,
            score_rank: (i + ((data?.page ?? 1) - 1) * 50 + 1) ?? 1,
            compare_score: compare_score,
            is_legacy: is_legacy
        })

        promise_a4s.push(promise_a4);
    }


    // 导入N1卡
    // 导入A2卡

    const [beatmap_generated, cardA4s] = await renderInBatch(
        data.beatmap, promise_a4s, (b) => PanelGenerate.beatmap2CardA2(b),
        s => s, {}, ''
    )

    const beatmap_a2 = card_A2(beatmap_generated);
    svg = setSvgBody(svg, 40, 40, beatmap_a2, reg_beatmap_a2);

    // 插入图片和部件
    svg = setImage(svg, 0, 0, 1920, 320, await getMapBackground(data.beatmap, 'cover'), reg_banner, 0.7);

    // 计算面板高度
    const row_total = Math.ceil((cardA4s?.length || 0) / 2);

    const panel_height = getPanelHeight(cardA4s?.length, 62, 2, 290, 10, 40);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    const string_a4s = cardA4s.map((a4, i) => {
        const isFirstColumn = i < row_total;

        const x = isFirstColumn ? 40 : 965;
        const y = 330 + (isFirstColumn ? i : i - row_total) * 72;

        return getSvgBody(x, y, a4);
    }).join('\n');

    svg = setText(svg, string_a4s, reg_list_n1)

    return svg;
}