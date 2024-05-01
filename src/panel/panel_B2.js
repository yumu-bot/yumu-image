import {
    exportJPEG, getImageFromV3, getGameMode, getMapBG,
    getPanelNameSVG, getRoundedNumberStrLarge, getRoundedNumberStrSmall, implantImage,
    implantSvgBody, readTemplate,
    replaceText, replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A2} from "../card/card_A2.js";
import {card_B4} from "../card/card_B4.js";
import {card_B5} from "../card/card_B5.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {hasLeaderBoard} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B2(data);
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
        const svg = await panel_B2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

const VALUE_NAMES = ['RC', 'LN', 'CO', 'ST', 'SP', 'PR']

/**
 * 骂娘谱面某种信息面板, 不玩骂娘看不懂
 * @param data
 * @return {Promise<string>}
 */
export async function panel_B2(data = {
    beatMap: {
        "beatmapset_id": 13019,
        "difficulty_rating": 4.76,
        "id": 48416,
        "mode": "mania",
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
        rice: [0],
        longNote: [0],
        speedVariation: [0],
        stamina: [0],
        speed: [0],
        precision: [0],

        riceDensity: [0],
        longNoteDensity: [0],
    }

}) {
    let svg = readTemplate('template/Panel_B.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    // 画六个标识
    svg = implantSvgBody(svg, 0, 0, drawHexIndex(getGameMode(data.beatMap.mode, 0)), reg_hexagon);

    // 插入图片和部件（新方法
    const banner = await getMapBG(data.beatMap.beatmapset.id, 'cover', hasLeaderBoard(data.beatMap.ranked));
    svg = implantImage(svg, 1920, 330, 0, 0, 0.6, banner, reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('Map Minus - Entering \'Firmament Castle \"Velier\"\' ~ 0.6x \"Perfect Snap\" (!ymmm)', 'MM');

    // 计算数值

    const data_arr = data?.mapMinus?.valueList || [];

    const rc = data_arr[0];
    const ln = data_arr[1];
    const co = data_arr[2];
    const st = data_arr[3];
    const sp = data_arr[4];
    const pr = data_arr[5];

    const rcd = data.beatMap.count_circles / (data.beatMap.hit_length * 2);
    const lnd = data.beatMap.count_sliders / data.beatMap.hit_length;

    const map_minus_mania = {
        RC: rc,
        LN: ln,
        CO: co,
        ST: st,
        SP: sp,
        PR: pr,
    }

    const total = ((0.5 * rc + 0.5 * ln + co + st + sp + 0.5 * pr) / 3.8);

    const total_path = torus.get2SizeTextPath(getRoundedNumberStrLarge(total, 3), getRoundedNumberStrSmall(total, 3), 60, 36, 960, 614, 'center baseline', '#fff');

    // 插入文字
    svg = replaceTexts(svg, [panel_name, total_path], reg_index);

    // A2定义
    /*
    const b = await getMapAttributes(data.beatMap.id
        , 0, data.beatMap.mode_int, hasLeaderBoard(data.beatMap.ranked));

    const beatMap = {
        ...data.beatMap,
        difficulty_rating: b.stars
    }

     */

    const cardA2 = await card_A2(await PanelGenerate.beatmap2CardA2(data.beatMap));
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 获取卡片
    let cardB4s = [];
    let hexagons = [];
    let cardB5s = [];

    for (const name of (VALUE_NAMES)) { // data?.mapMinus?.abbrList ||
        if (typeof map_minus_mania[name] !== 'number') continue;
        cardB4s.push(await card_B4({parameter: name, number: map_minus_mania[name]}, true, false));
        hexagons.push(map_minus_mania[name] / 9); //9星以上是X
    }

    svg = implantSvgBody(svg, 0, 0, PanelDraw.HexagonChart(hexagons, 960, 600, 230, '#00A8EC'), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        svg = implantSvgBody(svg, 40, 350 + j * 115, cardB4s[j], reg_left);
    }

    cardB5s.push(await card_B5({parameter: "OVA", number: total}));
    cardB5s.push(await card_B5({parameter: "SV", number: 0}));

    svg = implantSvgBody(svg, 630, 860, cardB5s[0], reg_center);
    svg = implantSvgBody(svg, 970, 860, cardB5s[1], reg_center);

    // todo 临时的值

    svg = replaceText(svg, torus.getTextPath(data_arr[7].toFixed(3).toString(), 75 + 1370, -50 + 465, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[8].toFixed(3).toString(), 75 + 1370 + 170, -50 + 465, 24, 'center baseline', '#fff'), reg_index);


    svg = replaceText(svg, torus.getTextPath(data_arr[9].toFixed(3).toString(), 75 + 1370, -50 + 465 + 115, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[10].toFixed(3).toString(), 75 + 1370 + 170, -50 + 465 + 115, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[11].toFixed(3).toString(), 75 + 1370 + 340, -50 + 465 + 115, 24, 'center baseline', '#fff'), reg_index);


    svg = replaceText(svg, torus.getTextPath(data_arr[12].toFixed(3).toString(), 75 + 1370, -50 + 465 + 230, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[13].toFixed(3).toString(), 75 + 1370 + 170, -50 + 465 + 230, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[14].toFixed(3).toString(), 75 + 1370 + 340, -50 + 465 + 230, 24, 'center baseline', '#fff'), reg_index);


    svg = replaceText(svg, torus.getTextPath(data_arr[15].toFixed(3).toString(), 75 + 1370, -50 + 465 + 345, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[16].toFixed(3).toString(), 75 + 1370 + 170, -50 + 465 + 345, 24, 'center baseline', '#fff'), reg_index);


    svg = replaceText(svg, torus.getTextPath(data_arr[17].toFixed(3).toString(), 75 + 1370, -50 + 465 + 460, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[18].toFixed(3).toString(), 75 + 1370 + 170, -50 + 465 + 460, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[19].toFixed(3).toString(), 75 + 1370 + 340, -50 + 465 + 460, 24, 'center baseline', '#fff'), reg_index);


    svg = replaceText(svg, torus.getTextPath(data_arr[20].toFixed(3).toString(), 75 + 1370, -50 + 465 + 575, 24, 'center baseline', '#fff'), reg_index);

    svg = replaceText(svg, torus.getTextPath(data_arr[21].toFixed(3).toString(), 75 + 1370 + 170, -50 + 465 + 575, 24, 'center baseline', '#fff'), reg_index);

    // todo 临时的折线图
    /*
    const s_arr = data.mapMinus.stream || [];
    const s_c = PanelDraw.LineChart(s_arr, 0, 0, 1370, 465, 150, 95, '#00A8EC', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, s_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, s_arr).toFixed(3), 75 + 1370, -50 + 465, 24, 'center baseline', '#fff'), reg_index);
    const j_arr = data.mapMinus.jack || [];
    const j_c = PanelDraw.LineChart(j_arr, 0, 0, 1370 + 170, 465, 150, 95, '#0071BC', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, j_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, j_arr).toFixed(3), 75 + 1370 + 170, -50 + 465, 24, 'center baseline', '#fff'), reg_index);
    const b_arr = data.mapMinus.bracket || [];
    const b_c = PanelDraw.LineChart(b_arr, 0, 0, 1370 + 340, 465, 150, 95, '#0054A6', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, b_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, b_arr).toFixed(3), 75 + 1370 + 340, -50 + 465, 24, 'center baseline', '#fff'), reg_index);

    const h_arr = data.mapMinus.handLock || [];
    const h_c = PanelDraw.LineChart(h_arr, 0, 0, 1370, 465 + 115, 150, 95, '#8DC73D', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, h_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, h_arr).toFixed(3), 75 + 1370, -50 + 465 + 115, 24, 'center baseline', '#fff'), reg_index);
    const o_arr = data.mapMinus.overlap || [];
    const o_c = PanelDraw.LineChart(o_arr, 0, 0, 1370 + 170, 465 + 115, 150, 95, '#39B449', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, o_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, o_arr).toFixed(3), 75 + 1370 + 170, -50 + 465 + 115, 24, 'center baseline', '#fff'), reg_index);
    const r_arr = data.mapMinus.release || [];
    const r_c = PanelDraw.LineChart(r_arr, 0, 0, 1370 + 340, 465 + 115, 150, 95, '#00A550', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, r_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, r_arr).toFixed(3), 75 + 1370 + 340, -50 + 465 + 115, 24, 'center baseline', '#fff'), reg_index);

    const e_arr = data.mapMinus.shield || [];
    const e_c = PanelDraw.LineChart(e_arr, 0, 0, 1370, 465 + 345, 150, 95, '#F8941B', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, e_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, e_arr).toFixed(3), 75 + 1370, -50 + 465 + 345, 24, 'center baseline', '#fff'), reg_index);
    const c_arr = data.mapMinus.riceDensity || [];
    const c_c = PanelDraw.LineChart(c_arr, 0, 0, 1370 + 170, 465 + 345, 150, 95, '#F26420', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, c_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, c_arr).toFixed(3), 75 + 1370 + 170, -50 + 465 + 345, 24, 'center baseline', '#fff'), reg_index);
    const d_arr = data.mapMinus.longNoteDensity || [];
    const d_c = PanelDraw.LineChart(d_arr, 0, 0, 1370 + 340, 465 + 345, 150, 95, '#ED1622', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, d_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, d_arr).toFixed(3), 75 + 1370 + 340, -50 + 465 + 345, 24, 'center baseline', '#fff'), reg_index);

    const k_arr = data.mapMinus.speedJack || [];
    const k_c = PanelDraw.LineChart(k_arr, 0, 0, 1370, 465 + 460, 150, 95, '#EC008C', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, k_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, k_arr).toFixed(3), 75 + 1370, -50 + 465 + 460, 24, 'center baseline', '#fff'), reg_index);
    const i_arr = data.mapMinus.trill || [];
    const i_c = PanelDraw.LineChart(i_arr, 0, 0, 1370 + 170, 465 + 460, 150, 95, '#92248F', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, i_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, i_arr).toFixed(3), 75 + 1370 + 170, -50 + 465 + 460, 24, 'center baseline', '#fff'), reg_index);
    const u_arr = data.mapMinus.burst || [];
    const u_c = PanelDraw.LineChart(u_arr, 0, 0, 1370 + 340, 465 + 460, 150, 95, '#662B91', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, u_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.round(Math.max.apply(Math, u_arr)).toFixed(3), 75 + 1370 + 340, -50 + 465 + 460, 24, 'center baseline', '#fff'), reg_index);

    const g_arr = data.mapMinus.grace || [];
    const g_c = PanelDraw.LineChart(g_arr, 0, 0, 1370, 580 + 460, 150, 95, '#FFF100', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, g_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, g_arr).toFixed(3), 75 + 1370, -50 + 580 + 460, 24, 'center baseline', '#fff'), reg_index);
    const y_arr = data.mapMinus.delayedTail || [];
    const y_c = PanelDraw.LineChart(y_arr, 0, 0, 1370 + 170, 580 + 460, 150, 95, '#C3DF9B', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, y_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.max.apply(Math, y_arr).toFixed(3), 75 + 1370 + 170, -50 + 580 + 460, 24, 'center baseline', '#fff'), reg_index);

    let total_arr = [];
    const total_c = PanelDraw.LineChart(total_arr, 0, 0, 1370 + 340, 580 + 460, 150, 95, '#aaa', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, total_c, reg_right);
    svg = replaceText(svg, torus.getTextPath(Math.round(Math.max.apply(Math, total_arr)).toFixed(3), 75 + 1370 + 340, -50 + 580 + 460, 24, 'center baseline', '#fff'), reg_index);

     */


    // 画六边形和其他
    const hexagon = getImageFromV3('object-hexagon.png');
    svg = implantImage(svg, 484, 433, 718, 384, 1, hexagon, reg_hexagon);

    return svg.toString();
}

function getSum(arr = []) {

    const sum = arr.reduce(function (prev, curr){
        return prev + curr;
    }, 0)

    return Number.isNaN(sum) ? 0 : sum;
}

function getValue(sum, arr = []) {

    if (arr === undefined || arr.length === 0) {
        return 0;
    } else {
        return sum * 0.1 + sum / arr.length * 0.9;
    }
}

function drawHexIndex(mode = 'osu') {
    const cx = 960;
    const cy = 600;
    const r = 230 + 30; // 中点到边点的距离

    let svg = '<g id="Rect"></g><g id="IndexText"></g>';
    const reg_rrect = /(?<=<g id="Rect">)/;
    const reg_text = /(?<=<g id="IndexText">)/;

    const VALUE_NORMAL = ['RC', 'LN', 'CO', 'ST', 'SP', 'PR'];
    const VALUE_MANIA = ['RC', 'LN', 'CO', 'ST', 'SP', 'PR'];

    for (let i = 0; i < 6; i++){
        let param;
        if (mode === 'mania') {
            param = VALUE_MANIA[i];
        } else {
            param = VALUE_NORMAL[i];
        }

        const PI_3 = Math.PI / 3;
        const x = cx - r * Math.cos(PI_3 * i);
        const y = cy - r * Math.sin(PI_3 * i);

        const param_text = torus.getTextPath(param, x, y + 8, 24, 'center baseline', '#fff');
        svg = replaceText(svg, param_text, reg_text)

        const param_width = torus.getTextWidth(param, 24);
        const rrect = PanelDraw.Rect(x - param_width / 2 - 20, y - 15, param_width + 40, 30, 15, '#54454C');
        svg = replaceText(svg, rrect, reg_rrect);

    }
    return svg;
}