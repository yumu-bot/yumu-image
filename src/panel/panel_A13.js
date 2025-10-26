import {
    exportJPEG,
    getPanelNameSVG,
    setSvgBody,
    setText,
    setCustomBanner, readTemplate, getPanelHeight, thenPush, getSvgBody
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A3} from "../card/card_A3.js";
import {card_A1} from "../card/card_A1.js";
import {torusBold} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A13(data);
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
        const svg = await panel_A13(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 玩家谱面
 * !e:f
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A13(
    data = {
        "user": {},
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
        "page": 1,
        "max_page": 1,
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
    const panel_name = getPanelNameSVG('My Beatmapsets (!yme)', 'E');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A2卡
    const beatmap_arr = data?.beatmapsets || [];
    const result_count = beatmap_arr?.length ?? 3;

    const user_a1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    svg = setSvgBody(svg, 40, 40, user_a1, reg_search_a2);

    //导入其他卡
    const card_a3s = []

    await Promise.allSettled(
        beatmap_arr.map((map) => {
            return card_A3(map)
        })
    ).then(results => thenPush(results, card_a3s))

    let string_a3s = ''

    for (const i in card_a3s) {
        const a3 = card_a3s[i]

        const x = i % 3
        const y = Math.floor(i / 3)

        string_a3s += getSvgBody(40 + 620 * x, 330 + 230 * y, a3)
    }

    svg = setText(svg, string_a3s, reg_card_a3)

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, null, reg_banner);

    // 计算面板高度
    const panel_height = getPanelHeight(result_count, 210, 3, 290, 20);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    const page = torusBold.getTextPath(
        'page: ' + (data.page || 0) + ' of ' + (data.max_page || 0), 1920 / 2, panel_height - 15, 20, 'center baseline', '#fff', 0.6
    )

    svg = setText(svg, page, reg_card_a3)

    return svg.toString();
}