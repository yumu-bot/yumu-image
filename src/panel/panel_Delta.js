import {
    exportLossLessImage,
    getExportFileV3Path,
    getModColor,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    implantImage,
    implantSvgBody,
    lineSeedSans,
    poppinsBold,
    readNetImage,
    readTemplate,
    replaceTexts
} from "../util.js";
import {getMapAttributes} from "../compute-pp.js";

export async function router(req, res) {
    console.log(req)
    try {
        const svg = await panel_Delta(req);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportLossLessImage(svg));
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

export async function router_svg(req, res) {
    try {
        const svg = await panel_Delta(req);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_Delta(data = {
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

    round: 'Qualifier',
    mod: 'NM',
    position: '1',
}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_Delta.svg');
    console.log(data.beatMap)
    console.log(data.beatmap)

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_text = /(?<=<g id="Text">)/;
    const reg_stat = /(?<=<g id="Stat">)/;
    const reg_base = /(?<=<g id="Base">)/;
    const reg_background = /(?<=<g id="Background">)/;
    const reg_sr = /(?<=<g id="SR" filter="url\(#clippath-PDelta-SR\)">)/;
    const reg_cs = /(?<=<g id="CS" filter="url\(#clippath-PDelta-CS\)">)/;
    const reg_ar = /(?<=<g id="AR" filter="url\(#clippath-PDelta-AR\)">)/;
    const reg_od = /(?<=<g id="OD" filter="url\(#clippath-PDelta-OD\)">)/;
    const reg_length = /(?<=<g id="LH" clip-path="url\(#clippath-PDelta-LH\)">)/;

    const kita_color = '#C31542';
    const ryou_color = '#40ABF7';
    const hitori_color = '#FF82A0';
    const nijika_color = '#FBCF5B';

    // 谱面重计算
    const mod_str = data.mod ? data.mod.toString() : 'NM';
    const position_str = data.position ? data.position.toString() : '';
    const mod_color = getModColor(mod_str);

    let mod_int = 0;
    if (mod_str.indexOf("DT") !== -1) mod_int = 64;

    const id = data.beatMap.id || 0;
    const attr = await getMapAttributes(id, mod_int);


    const length_num = (mod_str === 'DT') ? (data.beatMap.total_length / 1.5) : data.beatMap.total_length;

    const length_minute_str = Math.floor(length_num / 60).toString();
    const length_second_str = Math.floor(length_num % 60).toString().padStart(2, '0');
    const bpm_str = Math.round(attr.bpm).toString();
    const star_str = getRoundedNumberLargerStr(attr.stars, 2) + getRoundedNumberSmallerStr(attr.stars, 2);
    const cs_str = getRoundedNumberLargerStr(attr.cs, 2) + getRoundedNumberSmallerStr(attr.cs, 2);
    const ar_str = getRoundedNumberLargerStr(attr.ar, 2) + getRoundedNumberSmallerStr(attr.ar, 2);
    const od_str = getRoundedNumberLargerStr(attr.od, 2) + getRoundedNumberSmallerStr(attr.od, 2);
    const round = lineSeedSans.getTextPath(
        lineSeedSans.cutStringTail(data.round || 'Unknown', 42, 783 - 20, true)
        , 391.5, 538, 42, 'center baseline', '#282425');

    // 定义文字
    const title = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data.beatMap.beatmapset.title, 106, 920, true)
        , 1450, 318, 106, 'center baseline', '#fff');
    const artist = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data.beatMap.beatmapset.artist, 68, 920, true)
        , 1450, 414, 68, 'center baseline', '#fff');
    const difficulty = poppinsBold.getTextPath(
        '[' + poppinsBold.cutStringTail(data.beatMap.version, 64, 920, true) + ']'
        , 1450, 500, 64, 'center baseline', '#F9D4BA');

    const bid = poppinsBold.getTextPath('BID: ' + data.beatMap.id, 1450, 566, 42, 'center baseline', '#F9D4BA');
    const bpm = poppinsBold.getTextPath(bpm_str, 1720, 970, 54, 'center baseline', '#282425');
    const mod = poppinsBold.getTextPath(mod_str + position_str, 1453, 166, 68, 'center baseline', '#fff');

    const star = poppinsBold.getTextPath(star_str, 1360, 696, 48, 'left baseline', '#fff');
    const cs = poppinsBold.getTextPath(cs_str, 1360, 788, 48, 'left baseline', '#fff');
    const ar = poppinsBold.getTextPath(ar_str, 1360, 880, 48, 'left baseline', '#fff');
    const od = poppinsBold.getTextPath(od_str, 1360, 972, 48, 'left baseline', '#fff');

    const length = poppinsBold.getTextPath(length_minute_str + ':' + length_second_str, 1662.5, 820, 58, 'center baseline', '#fff');

    // 插入文字
    svg = replaceTexts(svg, [round, title, artist, difficulty, bid, bpm, mod, star, cs, ar, od, length], reg_text);

    // 插入图片和部件（新方法
    const mod_rrect = `<rect x="1360" y="100" width="186" height="82" rx="0" ry="0" style="fill: ${mod_color};"/>`
    const sr_rrect = `<rect x="1010" y="674" width="${336 * Math.max(Math.min(attr.stars, 11), 0) / 11}" height="8" rx="4" ry="4" style="fill: ${nijika_color};"/>`
    const cs_rrect = `<rect x="1010" y="766" width="${336 * Math.max(Math.min(attr.cs, 11), 0) / 11}" height="8" rx="4" ry="4" style="fill: ${kita_color};"/>`
    const ar_rrect = `<rect x="1010" y="858" width="${336 * Math.max(Math.min(attr.ar, 11), 0) / 11}" height="8" rx="4" ry="4" style="fill: ${ryou_color};"/>`
    const od_rrect = `<rect x="1010" y="950" width="${336 * Math.max(Math.min(attr.od, 11), 0) / 11}" height="8" rx="4" ry="4" style="fill: ${hitori_color};"/>`

    const length_pie = drawPieChart(Math.min(length_num / 600, 1), 1662.5, 797.5, 200, mod_color)

    svg = implantSvgBody(svg, 0, 0, mod_rrect, reg_stat);
    svg = implantSvgBody(svg, 0, 0, sr_rrect, reg_sr);
    svg = implantSvgBody(svg, 0, 0, cs_rrect, reg_cs);
    svg = implantSvgBody(svg, 0, 0, ar_rrect, reg_ar);
    svg = implantSvgBody(svg, 0, 0, od_rrect, reg_od);
    svg = implantSvgBody(svg, 0, 0, length_pie, reg_length);

    const image = await readNetImage(data.beatMap.beatmapset.covers["list@2x"], 'beatmap-DLfailBG.jpg')

    svg = implantImage(svg, 1080, 1080, -30, 0, 1, image, reg_background);
    svg = implantImage(svg, 1920, 1080, 0, 0, 1, getExportFileV3Path('panel-kita.png'), reg_base);
    svg = implantImage(svg, 153, 153, 1586, 721, 1, getExportFileV3Path('panel-kita-center.png'), reg_index);

    return svg.toString();
}

function drawPieChart(num = 1.0, cx, cy, r, color = '#fff') {
    const pi = Math.PI;
    let radMin = 0;
    let radMax = num * 2 * pi;

    let assist = getAssistPoint(radMin, radMax, cx, cy, r);

    let xMin = cx + r * Math.sin(radMin);
    let yMin = cy - r * Math.cos(radMin);
    let xMax = cx + r * Math.sin(radMax);
    let yMax = cy - r * Math.cos(radMax);

    return `<polygon id="Polygon" points="${cx} ${cy} ${xMin} ${yMin} ${assist}${xMax} ${yMax} ${cx} ${cy}" style="fill: ${color};"/>`; //这里assist后面的空格是故意删去的

    //获取中继点，这个点可以让区域控制点完美处于圆的外围
    function getAssistPoint(radMin = 0, radMax = 0, cx = 0, cy = 0, r = 100) {
        //r给控制点的圆的半径，比内部圆大很多
        const pi = Math.PI;
        if (radMax < radMin) return '';

        let out;
        let assist_arr = [];

        assist_arr.push('',
            (cx + r) + ' ' + (cy - r) + ' ',
            (cx + r) + ' ' + (cy + r) + ' ',
            (cx - r) + ' ' + (cy + r) + ' ',
            (cx - r) + ' ' + (cy - r) + ' ');

        if (radMin < pi / 4) {
            if (radMax < pi / 4) out = ' ';
            else if (radMax < 3 * pi / 4) out = (assist_arr[1]);
            else if (radMax < 5 * pi / 4) out = (assist_arr[1] + assist_arr[2]);
            else if (radMax < 7 * pi / 4) out = (assist_arr[1] + assist_arr[2] + assist_arr[3]);
            else out = (assist_arr[1] + assist_arr[2] + assist_arr[3] + assist_arr[4]);
        } else if (radMin < 3 * pi / 4) {
            if (radMax < 3 * pi / 4) out = ' ';
            else if (radMax < 5 * pi / 4) out = (assist_arr[2]);
            else if (radMax < 7 * pi / 4) out = (assist_arr[2] + assist_arr[3]);
            else out = (assist_arr[2] + assist_arr[3] + assist_arr[4]);
        } else if (radMin < 5 * pi / 4) {
            if (radMax < 5 * pi / 4) out = ' ';
            else if (radMax < 7 * pi / 4) out = (assist_arr[3]);
            else out = (assist_arr[3] + assist_arr[4]);
        } else if (radMin < 7 * pi / 4) {
            if (radMax < 7 * pi / 4) out = ' ';
            else out = (assist_arr[4]);
        } else {
            out = '';
        }
        return out;
    }
}