import {
    exportImage, getExportFileV3Path, getGameMode,
    getPanelNameSVG, getRandomBannerPath, getRoundedNumberLargerStr, getRoundedNumberSmallerStr, implantImage,
    implantSvgBody, PanelDraw,
    PanelGenerate,
    readTemplate,
    replaceText, replaceTexts, torus
} from "../util.js";
import {card_A2} from "../card/card_A2.js";
import {card_B4} from "../card/card_B4.js";
import {card_B5} from "../card/card_B5.js";

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

const VALUE_NAMES = ['RC', 'LN', 'SV', 'ST', 'SP', 'PR']

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

    // 画六个标识
    svg = implantSvgBody(svg, 0, 0, drawHexIndex(getGameMode(data.beatMap.mode, 0)), reg_hexagon);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 面板文字
    const panel_name = getPanelNameSVG('Map Minus v3.0.Alpha !ymmm', 'MM');

    // 计算数值
    const rc_arr = data.mapMinus.rice || [];
    const ln_arr = data.mapMinus.longNote || [];
    const sv_arr = data.mapMinus.speedVariation || [];
    const st_arr = data.mapMinus.stamina || [];
    const sp_arr = data.mapMinus.speed || [];
    const pr_arr = data.mapMinus.precision || [];

    const rcd_arr = data.mapMinus.riceDensity || [];
    const lnd_arr = data.mapMinus.longNoteDensity || [];

    const rc = getSum(rc_arr);
    const ln = getSum(ln_arr);
    const sv = getSum(sv_arr);
    const st = getSum(st_arr);
    const sp = getSum(sp_arr);
    const pr = getSum(pr_arr);

    const rcd = getSum(rcd_arr);
    const lnd = getSum(lnd_arr);

    const map_minus_mania = {
        RC: getValue(rc, rc_arr),
        LN: getValue(ln, ln_arr),
        SV: getValue(sv, sv_arr),
        ST: getValue(st, st_arr),
        SP: getValue(sp, sp_arr),
        PR: getValue(pr, pr_arr),
    }

    const total = (rc + ln + sv + st + sp + pr) / 6;
    const total_path = torus.get2SizeTextPath(getRoundedNumberLargerStr(total, 3), getRoundedNumberSmallerStr(total, 3), 60, 36, 960, 614, 'center baseline', '#fff');

    // 插入文字
    svg = replaceTexts(svg, [panel_name, total_path], reg_index);

    // A2定义
    const cardA2 = await card_A2(await PanelGenerate.beatmap2CardA2(data.beatMap), true);
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 获取卡片
    let cardB4s = [];
    let hexagons = [];
    let cardB5s = [];

    for (const name of VALUE_NAMES) {
        if (typeof map_minus_mania[name] !== 'number') continue;
        cardB4s.push(await card_B4({parameter: name, number: map_minus_mania[name]}, true, false));
        hexagons.push(map_minus_mania[name]);
    }

    svg = implantSvgBody(svg, 0, 0, PanelDraw.Hexagon(hexagons, 960, 600, 230, '#00A8EC'), reg_hexagon);

    for (let j = 0; j < 6; j++) {
        svg = implantSvgBody(svg, 40, 350 + j * 115, cardB4s[j], reg_left);
    }

    cardB5s.push(await card_B5({parameter: "RCD", number: getValue(rcd, rcd_arr)}, true));
    cardB5s.push(await card_B5({parameter: "LND", number: getValue(lnd, lnd_arr)}, true));

    svg = implantSvgBody(svg, 630, 860, cardB5s[0], reg_center);
    svg = implantSvgBody(svg, 970, 860, cardB5s[1], reg_center);

    // todo 临时的折线图
    const s_arr = data.mapMinus.stream || [];
    const s_c = PanelDraw.LineChart(s_arr, 0, 0, 1370, 465, 150, 95, '#00A8EC', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, s_c, reg_right);
    const j_arr = data.mapMinus.jack || [];
    const j_c = PanelDraw.LineChart(j_arr, 0, 0, 1370 + 170, 465, 150, 95, '#0071BC', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, j_c, reg_right);
    const b_arr = data.mapMinus.bracket || [];
    const b_c = PanelDraw.LineChart(b_arr, 0, 0, 1370 + 465, 350, 150, 95, '#0054A6', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, b_c, reg_right);

    const h_arr = data.mapMinus.handLock || [];
    const h_c = PanelDraw.LineChart(h_arr, 0, 0, 1370, 465 + 115, 150, 95, '#8DC73D', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, h_c, reg_right);
    const o_arr = data.mapMinus.overlap || [];
    const o_c = PanelDraw.LineChart(o_arr, 0, 0, 1370 + 170, 465 + 115, 150, 95, '#39B449', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, o_c, reg_right);
    const r_arr = data.mapMinus.release || [];
    const r_c = PanelDraw.LineChart(r_arr, 0, 0, 1370 + 340, 465 + 115, 150, 95, '#00A550', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, r_c, reg_right);

    const e_arr = data.mapMinus.shield || [];
    const e_c = PanelDraw.LineChart(e_arr, 0, 0, 1370, 465 + 345, 150, 95, '#F8941B', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, e_c, reg_right);
    const c_arr = data.mapMinus.riceDensity || [];
    const c_c = PanelDraw.LineChart(c_arr, 0, 0, 1370 + 170, 465 + 345, 150, 95, '#F26420', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, c_c, reg_right);
    const d_arr = data.mapMinus.longNoteDensity || [];
    const d_c = PanelDraw.LineChart(d_arr, 0, 0, 1370 + 340, 465 + 345, 150, 95, '#ED1622', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, d_c, reg_right);

    const k_arr = data.mapMinus.speedJack || [];
    const k_c = PanelDraw.LineChart(k_arr, 0, 0, 1370, 465 + 460, 150, 95, '#EC008C', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, k_c, reg_right);
    const i_arr = data.mapMinus.trill || [];
    const i_c = PanelDraw.LineChart(i_arr, 0, 0, 1370 + 170, 465 + 460, 150, 95, '#92248F', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, i_c, reg_right);
    const u_arr = data.mapMinus.burst || [];
    const u_c = PanelDraw.LineChart(u_arr, 0, 0, 1370 + 340, 465 + 460, 150, 95, '#662B91', 1, 0.3, 3)
    svg = implantSvgBody(svg, 0, 0, u_c, reg_right);


    // 画六边形和其他
    const hexagon = getExportFileV3Path('object-hexagon.png');
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
    let cx = 960;
    let cy = 600;
    let r = 230 + 30; // 中点到边点的距离

    let svg = '<g id="RRect"></g><g id="IndexText"></g>';
    let reg_rrect = /(?<=<g id="RRect">)/;
    let reg_text = /(?<=<g id="IndexText">)/;

    const VALUE_NORMAL = ['RC', 'LN', 'SV', 'ST', 'SP', 'PR'];
    const VALUE_MANIA = ['RC', 'LN', 'SV', 'ST', 'SP', 'PR'];

    for (let i = 0; i < 6; i++){
        let param;
        if (mode === 'mania') {
            param = VALUE_MANIA[i];
        } else {
            param = VALUE_NORMAL[i];
        }

        let PI_3 = Math.PI / 3;
        let x = cx - r * Math.cos(PI_3 * i);
        let y = cy - r * Math.sin(PI_3 * i);

        let param_text = torus.getTextPath(param, x, y + 8, 24, 'center baseline', '#fff');
        svg = replaceText(svg, param_text, reg_text)

        let param_width = torus.getTextWidth(param, 24);
        let rrect = `<rect width="${param_width + 40}" height="30" rx="15" ry="15" style="fill: #54454C;"/>`
        svg = implantSvgBody(svg, x - param_width / 2 - 20, y - 15, rrect, reg_rrect);

    }
    return svg;
}