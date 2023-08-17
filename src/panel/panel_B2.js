import {
    exportImage,
    getPanelNameSVG,
    implantSvgBody,
    PanelGenerate,
    readTemplate,
    replaceText
} from "../util.js";
import {card_A2} from "../card/card_A2.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B2(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportImage(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}
export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

// E面板重构计划
export async function panel_B2(data = {
    beatMap: {
        "beatmapset_id": 13019,
        "difficulty_rating": 4.76,
        "id": 48416,
        "mode": "osu",
        "status": "approved",
        "total_length": 202,
        "user_id": 231631,
        "version": "BASARA",
        "accuracy": 7,
        "ar": 9,
        "bpm": 130,
        "convert": false,
        "count_circles": 789,
        "count_sliders": 80,
        "count_spinners": 1,
        "cs": 4,
        "deleted_at": null,
        "drain": 8,
        "hit_length": 185,
        "is_scoreable": true,
        "last_updated": "2014-05-18T17:22:13Z",
        "mode_int": 0,
        "passcount": 139943,
        "playcount": 1871185,
        "ranked": 2,
        "url": "https://osu.ppy.sh/beatmaps/48416",
        "checksum": "bcfbb61d5a6156fa9fb0708432c79d88",
        "beatmapset": {
            "artist": "Daisuke Achiwa",
            "artist_unicode": "Daisuke Achiwa",
            "covers": {
                "cover": "https://assets.ppy.sh/beatmaps/13019/covers/cover.jpg?1622032274",
                "cover@2x": "https://assets.ppy.sh/beatmaps/13019/covers/cover@2x.jpg?1622032274",
                "card": "https://assets.ppy.sh/beatmaps/13019/covers/card.jpg?1622032274",
                "card@2x": "https://assets.ppy.sh/beatmaps/13019/covers/card@2x.jpg?1622032274",
                "list": "https://assets.ppy.sh/beatmaps/13019/covers/list.jpg?1622032274",
                "list@2x": "https://assets.ppy.sh/beatmaps/13019/covers/list@2x.jpg?1622032274",
                "slimcover": "https://assets.ppy.sh/beatmaps/13019/covers/slimcover.jpg?1622032274",
                "slimcover@2x": "https://assets.ppy.sh/beatmaps/13019/covers/slimcover@2x.jpg?1622032274"
            },
            "creator": "100pa-",
            "favourite_count": 1593,
            "hype": null,
            "id": 13019,
            "nsfw": false,
            "offset": 0,
            "play_count": 2862911,
            "preview_url": "//b.ppy.sh/preview/13019.mp3",
            "source": "Ar tonelico II",
            "spotlight": false,
            "status": "approved",
            "title": "BASARA",
            "title_unicode": "BASARA",
            "track_id": null,
            "user_id": 231631,
            "video": false,
            "bpm": 130,
            "can_be_hyped": false,
            "deleted_at": null,
            "discussion_enabled": true,
            "discussion_locked": false,
            "is_scoreable": true,
            "last_updated": "2010-09-08T10:10:59Z",
            "legacy_thread_url": "https://osu.ppy.sh/community/forums/topics/24360",
            "nominations_summary": {
                "current": 0,
                "required": 2
            },
            "ranked": 2,
            "ranked_date": "2010-12-28T22:17:38Z",
            "storyboard": false,
            "submitted_date": "2010-02-12T10:17:22Z",
            "tags": "ar tonelico ii 2",
            "availability": {
                "download_disabled": false,
                "more_information": null
            },
            "ratings": []
        },
        "failtimes": {
            "fail": [],
            "exit": []
        },
        "max_combo": 987
    },

    mapMinus: {
        rice: [],
        longNote: [],
        speedVariation: [],
        stamina: [],
        speed: [],
        precision: [],
    }

}, reuse = false) {
    let svg = readTemplate('template/Panel_B.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="Hexagon">)/;

    //A2定义
    const cardA2 = await card_A2(await PanelGenerate.beatmap2CardA2(data.beatMap), true);

    console.log(data.mapMinus);


    // 面板文字
    const panel_name = getPanelNameSVG('Map Minus v3.0.Alpha !ymmm', 'MM');

    //梯形积分
    const rc = data.mapMinus.rice.reduce(function (prev, curr){
        return prev + curr;
    });
    const ln = data.mapMinus.longNote.reduce(function (prev, curr){
        return prev + curr;
    });
    const sv = data.mapMinus.speedVariation.reduce(function (prev, curr){
        return prev + curr;
    });
    const st = data.mapMinus.stamina.reduce(function (prev, curr){
        return prev + curr;
    });
    const sp = data.mapMinus.speed.reduce(function (prev, curr){
        return prev + curr;
    });
    const pr = data.mapMinus.precision.reduce(function (prev, curr){
        return prev + curr;
    });
    console.log(rc, ln, sv, st, sp, pr);

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

    return svg.toString();
}