import {
    getPanelHeight,
    getPanelNameSVG,
    getSvgBody,
    readTemplate,
    setCustomBanner,
    setSvgBody,
    setText,
    thenPush
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_A5} from "../card/card_A5.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {torusBold} from "../util/font.js";

import {createImageRouter, createSvgRouter} from "../util/image.js";
import {avatars2Task, beatmapsets2Task, imageDownloader} from "../util/download.js";

export const router = createImageRouter(panel_A2);
export const router_svg = createSvgRouter(panel_A2);

/**
 * 查询谱面的面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A2(data = {
    search: {
        //现在的搜索规则是？返回 qualified, ranked, loved, pending, graveyard。当然这个面板应该是默认 qualified 吧。
        rule: 'qualified',
        result_count: 1,

        // api 给的信息
        "total": 116,
        "search": {
            "sort": "ranked_asc"
        },
        "cursor": {
            "queued_at": "1689344095000", //目前结果的尾巴那张图的点图时间
            "approved_date": "1689344095000",
            "id": "1954777" //目前结果的尾巴那张图的sid
        },

        /*
        "beatmapsets": [],
        */
        "beatmapsets":[{
            "artist": "HOYO-MiX",
            "artist_unicode": "HOYO-MiX",
            "covers": {
                "cover": "https://assets.ppy.sh/beatmaps/1884753/covers/cover.jpg?1689090283",
                "cover@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/cover@2x.jpg?1689090283",
                "card": "https://assets.ppy.sh/beatmaps/1884753/covers/card.jpg?1689090283",
                "card@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/card@2x.jpg?1689090283",
                "list": "https://assets.ppy.sh/beatmaps/1884753/covers/list.jpg?1689090283",
                "list@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/list@2x.jpg?1689090283",
                "slimcover": "https://assets.ppy.sh/beatmaps/1884753/covers/slimcover.jpg?1689090283",
                "slimcover@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/slimcover@2x.jpg?1689090283"
            },
            "creator": "Muziyami",
            "favourite_count": 48,
            "hype": {
                "current": 26,
                "required": 5
            },
            "id": 1884753,
            "nsfw": false,
            "offset": 0,
            "play_count": 5465,
            "preview_url": "//b.ppy.sh/preview/1884753.mp3",
            "source": "原神",
            "spotlight": false,
            "status": "qualified",
            "title": "Surasthana Fantasia",
            "title_unicode": "净善的遐歌",
            "track_id": null,
            "user_id": 7003013,
            "video": true,
            "bpm": 168,
            "can_be_hyped": true,
            "deleted_at": null,
            "discussion_enabled": true,
            "discussion_locked": false,
            "is_scoreable": true,
            "last_updated": "2023-07-11T15:44:20Z",
            "legacy_thread_url": "https://osu.ppy.sh/community/forums/topics/1675223",
            "nominations_summary": {
                "current": 2,
                "required": 2
            },
            "ranked": 3,
            "ranked_date": "2023-07-11T18:17:58Z",
            "storyboard": false,
            "submitted_date": "2022-11-13T14:52:11Z",
            "tags": "genshin impact yuanshen jing shan de xia ge スラサタンナ幻想曲 boundless bliss nahida na xi da 纳西妲 ナヒーダ 小吉祥草王 クラクサナリデビ クサナリ lesser lord kusanali 布耶尔 buer 白草净华 physic of purity 无垠无忧 無垠無憂 mugen muyuu vgm trailer spoiler 所聞遍計 所闻遍计 한계도 걱정도 없이 나히다 hua ling 花玲 tamura yukari 田村ゆかり 须弥 sumeru スメール ost chinese original sound track soundtrack video game videogame instrumental electronic future bass theme @hoyo-mix 草神 dendro archon sfuture艺术团 sfutureart yu-peng chen 陈宇鹏 陈致逸 yijun jiang 姜以君 the stellar moments vol. 3 album 闪耀的群星3 輝く星々vol.3 volume three patchouli-r kobayakawa sae hngjss [charlie lam] skystar chorus character demo aranara 兰那罗 アランナラ 米哈游 mihoyo hoyoverse",
            "availability": {
                "download_disabled": false,
                "more_information": null
            },
            "beatmaps": [],
            "pack_tags": []
        }
        ]


    },
    page: 1,
    max_page: 12,
}) {
    const {
        search
    } = data

    const {
        beatmapsets,
        result_count
    } = search

    const count = Math.min(result_count || 0, beatmapsets?.length || 0);
    // 如果卡片超过12张，则使用紧促型面板，并且不渲染卡片 A5
    const is_compact = count > 12

    // 导入模板
    let svg = readTemplate('template/Panel_A2.svg');
    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_search_a2 = /(?<=<g id="Search_Card_A2">)/;
    let reg_card_a5 = /(?<=<g id="Map_Card_M">)/;
    let reg_card_a2 = /(?<=<g id="Map_Card_A2">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA2-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Qualified Map List (!ymq)', 'Q')

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, null, reg_banner);

    // 导入A2卡

    const mapper_ids = [
        ...new Set(
            beatmapsets.flatMap(s => s.beatmaps ?? [])
                .map(b => b.user_id)
                .filter(id => id != null)
        )
    ]

    const promise_a2s = beatmapsets2Task(beatmapsets)
    const promise_a5s = is_compact ? [] : avatars2Task(mapper_ids, (id) => id)

    const tasks = [
        ...promise_a2s,
        ...promise_a5s
    ]

    const images = await imageDownloader(tasks);

    const search_result = await PanelGenerate.searchResult2CardA2(
        search.total,
        search.cursor,
        search.search,
        count,
        search.rule || 'Qualified',
        beatmapsets[0],
        beatmapsets[beatmapsets.length - 1],
        images.get(`list@2x_${beatmapsets[0].id}`)
    );

    const search_cardA2 = card_A2(search_result);
    svg = setSvgBody(svg, 40, 40, search_cardA2, reg_search_a2);

    //紧凑型面板
    if (is_compact) {
        const lite_sets = (beatmapsets || []).slice(0, count)

        const paramA2s = []

        await Promise.allSettled(
            lite_sets.map((v, i) => {
                return PanelGenerate.searchMap2CardA2(v, i + 1, images.get(`list@2x_${v.id}`))
            })
        ).then(results => thenPush(results, paramA2s))

        let string_a2s = []

        for (let i = 0; i < count; i++) {
            const x = i % 4;
            const y = Math.floor(i / 4);

            string_a2s.push(getSvgBody(40 + 470 * x, 330 + 250 * y, card_A2(paramA2s[i])))
        }

        svg = setText(svg, string_a2s.join('\n'), reg_card_a2)
    } else {
        const paramA2s = []

        await Promise.allSettled(
            beatmapsets.map((v, i) => {
                return PanelGenerate.searchMap2CardA2(v, i + 1, images.get(`list@2x_${v.id}`))
            })
        ).then(results => thenPush(results, paramA2s))

        const paramA5s = []

        await Promise.allSettled(
            beatmapsets.map((v) => {
                return card_A5(v, images)
            })
        ).then(results => thenPush(results, paramA5s))

        let string_a2s = []
        let string_a5s = []

        for (let i = 0; i < count; i++) {
            const a2 = paramA2s[i]
            const a5 = paramA5s[i]

            string_a2s.push(getSvgBody(40, 330 + 250 * i, card_A2(a2)))
            string_a5s.push(getSvgBody(510, 330 + 250 * i, a5))
        }

        svg = setText(svg, string_a2s.join('\n'), reg_card_a2)
        svg = setText(svg, string_a5s.join('\n'), reg_card_a5)
    }

    // 计算面板高度
    const panel_height = count <= 12 ?
        getPanelHeight(count, 210, 1, 290, 40) :
        getPanelHeight(count, 210, 4, 290, 40);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    const page = torusBold.getTextPath(
        'page: ' + (data.page || 0) + ' of ' + (data.max_page || 0), 1920 / 2, panel_height - 15, 20, 'center baseline', '#fff', 0.6
    )

    svg = setText(svg, page, reg_card_a2)
    return svg;
}