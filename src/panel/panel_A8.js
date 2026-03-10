import {
    exportJPEG,
    getPanelNameSVG,
    setSvgBody,
    setText,
    setCustomBanner, readTemplate, getPanelHeight, thenPush, getSvgBody
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A2} from "../card/card_A2.js";
import {card_A3} from "../card/card_A3.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A8(data);
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
        const svg = await panel_A8(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 搜索谱面
 * !o
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A8(
    data = {
        beatmapsets: [{
            offset: 0,
            source: 'beatmania IIDX',
            status: 'ranked',
            title: 'Critical Crystal',
            video: false,
            ranked: 1,
            storyboard: false,
            tags: '21 spada blue dragon dance speed rizqy',
            bpm: 191,
            artist: 'Seiryu',
            artist_unicode: '青龍',
            covers: [Object],
            creator: 'SanadaYukimura',
            favourite_count: 1851,
            id: 376340,
            nsfw: false,
            play_count: 2899044,
            preview_url: '//b.ppy.sh/preview/376340.mp3',
            spotlight: true,
            title_unicode: 'Critical Crystal',
            user_id: 2633753,
            can_be_hyped: false,
            discussion_locked: false,
            is_scoreable: true,
            last_updated: '2016-02-20T15:24:13Z',
            legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/385198',
            nominations_summary: [Object],
            ranked_date: '2016-02-28T03:21:01Z',
            submitted_date: '2015-11-13T17:04:43Z',
            availability: [Object],
            beatmaps: [Array],
            pack_tags: [Array],
            has_leader_board: true,
            top_diff: [Object],
            public_rating: 0,
            preview_name: 'Seiryu - Critical Crystal (SanadaYukimura) [376340]'
        },],
        total: 2715,
        cursor_string: 'eyJfc2NvcmUiOjIyOS4zOTAwOCwiaWQiOjE0MDc0NDd9',
        cursor: {id: 1407447},
        search: {sort: 'relevance_desc', g: 0, l: 0},
        result_count: 50,
    }
) {
    // 导入模板
    let svg = readTemplate('template/Panel_A2.svg');
    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_search_a2 = /(?<=<g id="Search_Card_A2">)/;
    const reg_card_a3 = /(?<=<g id="Map_Card_A2">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA2-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Search Result (!ymo)', 'O');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A2卡
    const beatmap_arr = data?.beatmapsets || [];
    const result_count = Math.min(data?.result_count || 0, beatmap_arr?.length || 0);

    const search_result = await PanelGenerate.searchResult2CardA2(
        data.total,
        data.cursor,
        data.search,
        result_count,
        data.rule || 'Qualified',
        beatmap_arr[0],
        beatmap_arr[beatmap_arr.length - 1],
    );

    const search_cardA2 = card_A2(search_result);
    svg = setSvgBody(svg, 40, 40, search_cardA2, reg_search_a2);

    //导入其他卡
    const cardA3s = []

    await Promise.allSettled(
        beatmap_arr.map((map) => {
            return card_A3(map)
        })
    ).then(results => thenPush(results, cardA3s))

    const string_a3s = cardA3s.map((a3, i) => {
        // i 在 map 中严格为 Number 类型，计算更直接
        const x = i % 3;
        const y = Math.floor(i / 3);

        // 计算坐标：3列布局，横向间距 620，纵向间距 230
        const posX = 40 + 620 * x;
        const posY = 330 + 230 * y;

        return getSvgBody(posX, posY, a3);
    }).join('\n');

    svg = setText(svg, string_a3s, reg_card_a3)

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, null, reg_banner);

    // 计算面板高度
    const panel_height = getPanelHeight(result_count, 210, 3, 290, 20);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);
    return svg;
}