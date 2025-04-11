import {
    exportJPEG, getPanelHeight,
    getPanelNameSVG, setSvgBody,
    readTemplate, setCustomBanner,
    setText
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_M} from "../card/card_M.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_A2(data);
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
        const svg = await panel_A2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 查询谱面的面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A2(data = {
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
        "beatmaps": [
            {
                "beatmapset_id": 1884753,
                "difficulty_rating": 5.25,
                "id": 3880594,
                "mode": "osu",
                "status": "qualified",
                "total_length": 135,
                "user_id": 7003013,
                "version": "Extra",
                "accuracy": 8.5,
                "ar": 9,
                "bpm": 168,
                "convert": false,
                "count_circles": 202,
                "count_sliders": 221,
                "count_spinners": 2,
                "cs": 4.2,
                "deleted_at": null,
                "drain": 5.5,
                "hit_length": 133,
                "is_scoreable": true,
                "last_updated": "2023-07-11T15:44:20Z",
                "mode_int": 0,
                "passcount": 32,
                "playcount": 129,
                "ranked": 3,
                "url": "https://osu.ppy.sh/beatmaps/3880594",
                "checksum": "5ab3f382dc7601eb3a3b0b34256c5f59",
                "max_combo": 744
            },
            {
                "beatmapset_id": 1884753,
                "difficulty_rating": 4.23,
                "id": 3880863,
                "mode": "osu",
                "status": "qualified",
                "total_length": 135,
                "user_id": 7003013,
                "version": "Insane",
                "accuracy": 7,
                "ar": 8.5,
                "bpm": 168,
                "convert": false,
                "count_circles": 139,
                "count_sliders": 193,
                "count_spinners": 4,
                "cs": 4,
                "deleted_at": null,
                "drain": 5,
                "hit_length": 129,
                "is_scoreable": true,
                "last_updated": "2023-07-11T15:44:21Z",
                "mode_int": 0,
                "passcount": 66,
                "playcount": 204,
                "ranked": 3,
                "url": "https://osu.ppy.sh/beatmaps/3880863",
                "checksum": "00583b3f9e3aa112de783fc304ac3b1f",
                "max_combo": 613
            },
            {
                "beatmapset_id": 1884753,
                "difficulty_rating": 3.32,
                "id": 3880864,
                "mode": "osu",
                "status": "qualified",
                "total_length": 135,
                "user_id": 3766224,
                "version": "Kobayakawa Sae's Hard",
                "accuracy": 6,
                "ar": 8,
                "bpm": 168,
                "convert": false,
                "count_circles": 93,
                "count_sliders": 122,
                "count_spinners": 6,
                "cs": 4,
                "deleted_at": null,
                "drain": 4,
                "hit_length": 133,
                "is_scoreable": true,
                "last_updated": "2023-07-11T15:44:22Z",
                "mode_int": 0,
                "passcount": 51,
                "playcount": 149,
                "ranked": 3,
                "url": "https://osu.ppy.sh/beatmaps/3880864",
                "checksum": "1ad7ffb20a515eb1c803ab8288431748",
                "max_combo": 412
            },
            {
                "beatmapset_id": 1884753,
                "difficulty_rating": 2.13,
                "id": 3880865,
                "mode": "osu",
                "status": "qualified",
                "total_length": 135,
                "user_id": 1061213,
                "version": "Patchouli-R's Normal",
                "accuracy": 4,
                "ar": 5,
                "bpm": 168,
                "convert": false,
                "count_circles": 69,
                "count_sliders": 90,
                "count_spinners": 6,
                "cs": 3,
                "deleted_at": null,
                "drain": 3,
                "hit_length": 114,
                "is_scoreable": true,
                "last_updated": "2023-07-11T15:44:22Z",
                "mode_int": 0,
                "passcount": 45,
                "playcount": 134,
                "ranked": 3,
                "url": "https://osu.ppy.sh/beatmaps/3880865",
                "checksum": "ada93214c2e5c6585bd7064e7b985560",
                "max_combo": 288
            },
            {
                "beatmapset_id": 1884753,
                "difficulty_rating": 1.69,
                "id": 3881560,
                "mode": "osu",
                "status": "qualified",
                "total_length": 135,
                "user_id": 7003013,
                "version": "Easy",
                "accuracy": 2,
                "ar": 3,
                "bpm": 168,
                "convert": false,
                "count_circles": 52,
                "count_sliders": 90,
                "count_spinners": 4,
                "cs": 2.2,
                "deleted_at": null,
                "drain": 2,
                "hit_length": 127,
                "is_scoreable": true,
                "last_updated": "2023-07-11T15:44:23Z",
                "mode_int": 0,
                "passcount": 49,
                "playcount": 135,
                "ranked": 3,
                "url": "https://osu.ppy.sh/beatmaps/3881560",
                "checksum": "244d46706e662aeb86c996176b03008c",
                "max_combo": 304
            },
            {
                "beatmapset_id": 1884753,
                "difficulty_rating": 5.95,
                "id": 3984789,
                "mode": "osu",
                "status": "qualified",
                "total_length": 135,
                "user_id": 873961,
                "version": "Skystar's Extra",
                "accuracy": 9,
                "ar": 9.2,
                "bpm": 168,
                "convert": false,
                "count_circles": 208,
                "count_sliders": 239,
                "count_spinners": 2,
                "cs": 4.5,
                "deleted_at": null,
                "drain": 6,
                "hit_length": 133,
                "is_scoreable": true,
                "last_updated": "2023-07-11T15:44:23Z",
                "mode_int": 0,
                "passcount": 55,
                "playcount": 257,
                "ranked": 3,
                "url": "https://osu.ppy.sh/beatmaps/3984789",
                "checksum": "574fd409c942675e61b80d0bd94c3601",
                "max_combo": 796
            }
        ],
        "pack_tags": []
    }
    ]


}) {
    // 导入模板
    let svg = readTemplate('template/Panel_A2.svg');
    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_search_a2 = /(?<=<g id="Search_Card_A2">)/;
    let reg_card_m = /(?<=<g id="Map_Card_M">)/;
    let reg_card_a2 = /(?<=<g id="Map_Card_A2">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA2-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Qualified Map List (!ymq)', 'Q')

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

    // 如果卡片超过12张，则使用紧促型面板，并且不渲染卡片 M
    if (result_count <= 12) {
        for (let i = 0; i < result_count; i++) {
            const v = beatmap_arr[i]

            const m = await card_M(v);

            const a2 = card_A2(
                await PanelGenerate.searchMap2CardA2(v, i + 1)
            );

            svg = setSvgBody(svg, 40, 330 + 250 * i, a2, reg_card_a2);
            svg = setSvgBody(svg, 510, 330 + 250 * i, m, reg_card_m);
        }
    } else {
        //紧凑型面板
        for (let i = 0; i < result_count; i++) {
            const a2 = card_A2(
                await PanelGenerate.searchMap2CardA2(beatmap_arr[i], i + 1)
            );

            const x = i % 4;
            const y = Math.floor(i / 4);
            svg = setSvgBody(svg, 40 + 470 * x, 330 + 250 * y, a2, reg_card_a2);
        }
    }

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, reg_banner);

    // 计算面板高度
    const panelHeight = result_count <= 12 ?
        getPanelHeight(result_count, 210, 1, 290, 40) :
        getPanelHeight(result_count, 210, 4, 290, 40);
    const cardHeight = panelHeight - 290;

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);
    return svg.toString();
}