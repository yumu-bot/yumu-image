import {
    exportJPEG,
    getBeatMapTitlePath,
    getDecimals,
    getDiffBG,
    getGameMode,
    getImageFromV3,
    getMapStatusImage,
    getNowTimeStamp,
    getPanelNameSVG,
    getRoundedNumberStr,
    getRoundedNumberStrLarge,
    getRoundedNumberStrSmall,
    getTimeDifference,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText,
    replaceTexts, getFileSize
} from "../util/util.js";
import moment from "moment";
import {getApproximateRank, getRankBG, hasLeaderBoard} from "../util/star.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {extra, getMultipleTextPath, getTextWidth, poppinsBold, PuHuiTi, torus} from "../util/font.js";
import {getModColor, getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {label_E5, LABELS} from "../component/label.js";
import {ar2ms, cs2px, od2ms} from "./panel_E.js";
import {getV3Score} from "../util/mod.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_E5(data);
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
        const svg = await panel_E5(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 超级成绩面板
 * @param data
 * @return {Promise<string>}
 */
// E面板升级计划
export async function panel_E5(data = {
    user: {},

    density: {},
    progress: 1,
    original: {},
    attributes: {},

    score: {
        accuracy: 0.9361111111111111,
        osuMods: [ 'HD' ],
        passed: true,
        perfect: false,
        rank: 'A',
        replay: true,
        score: 1444022,
        statistics: {
            countAll: 240,
            null: true,
            count_50: 0,
            count_100: 20,
            count_300: 218,
            count_geki: 0,
            count_katu: 0,
            count_miss: 2
        },
        type: 'score_best_osu',
        legacy: true,
        user: {
            id: 7003013,
            pmOnly: false,
            userID: 7003013,
            avatar_url: 'https://a.ppy.sh/7003013?1704285435.jpeg',
            default_group: 'default',
            is_active: true,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: false,
            last_visit: [Array],
            pm_friends_only: false,
            username: 'Muziyami',
            country_code: 'CN'
        },
        mods: [ 'HD' ],
        createTimePretty: [ 2024, 7, 9, 18, 45, 11 ],
        pp: 183.94418,
        uid: 7003013,
        best_id: 4651668661,
        max_combo: 303,
        user_id: 7003013,
        create_at_str: '2024-07-09T10:45:11Z',
        id: 4651668661,
        mode: 'OSU',
        mode_int: 0,
        beatmap: {
            id: 4645012,
            mode: 'osu',
            status: 'qualified',
            convert: false,
            retry: 0,
            fail: 0,
            od: 8.3,
            cs: 4,
            ar: 9.3,
            osuMode: 'OSU',
            hp: 5,
            bpm: 144,
            beatMapID: 4645012,
            beatmapset_id: 2195334,
            difficulty_rating: 5.2104692,
            total_length: 53,
            user_id: 9590557,
            version: 'Extra',
            beatmapset: [Object],
            max_combo: 414,
            accuracy: 8.3,
            count_circles: 70,
            count_sliders: 170,
            count_spinners: 0,
            drain: 5,
            hit_length: 53,
            mode_int: 0,
            passcount: 58,
            playcount: 190
        },
        beatmapset: {
            artist: 'Lei Lei',
            covers: [Object],
            nsfw: false,
            source: '',
            status: 'qualified',
            title: 'Wo Ai Wan Dian Wei',
            storyboard: false,
            mappers: [],
            nominators: [],
            publicRating: 0,
            fromDatabase: false,
            sid: 2195334,
            artist_unicode: '雷雷',
            favourite_count: 3,
            id: 2195334,
            play_count: 519,
            title_unicode: '我爱玩典韦',
            user_id: 9590557,
            legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/1933407'
        }
    },

}) {
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_e1 = /(?<=<g id="Card_E1">)/;
    const reg_card_e2 = /(?<=<g id="Card_E2">)/;
    const reg_card_e3 = /(?<=<g id="Card_E3">)/;

    // 面板文字
    let score_time;
    let delta_time;

    if (data?.score?.create_at_str != null) {
        score_time = moment(data?.score?.create_at_str, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hour').format("YYYY-MM-DD HH:mm:ss [+8]");
        delta_time = getTimeDifference(data?.score?.create_at_str)
    } else {
        //created_at 是北京时间，所以处理的时候不需要 +8
        //[ 2024, 4, 22, 17, 32, 12, 473533397 ]
        score_time = moment(data?.score?.created_at, '[\[] YYYY, MM, DD, HH, mm, ss, SSSSSSSSS [\]]').format("YYYY-MM-DD HH:mm:ss [+8]")
        delta_time = getTimeDifference(data?.score?.created_at, '[\[] YYYY, MM, DD, HH, mm, ss, SSSSSSSSS [\]]', moment())
    }

    const request_time = 'score time: ' + score_time + ' (' + delta_time + ') // request time: ' + getNowTimeStamp();

    // 导入文字
    svg = replaceText(svg, getPanelNameSVG('Excellent Score (!ymp / !ymr / !yms)', 'S', 'v0.4.1 SE', request_time), reg_index);

    // 评级
    svg = implantImage(svg, 590, 590, 665, 290, 1, getImageFromV3(`object-score-${data?.score?.rank || 'F'}2.png`), reg_index);

    // 图片定义
    const background = getRankBG((data?.score?.rank || getApproximateRank(data?.score)));
    const banner = await getDiffBG(data?.score?.beatmap?.id, data?.score?.beatmapset?.id, 'cover', hasLeaderBoard(data.score.beatmap.ranked));

    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    const componentE1 = component_E1(PanelEGenerate.score2componentE1(data.score));
    const componentE2 = component_E2(PanelEGenerate.score2componentE2(data.score, data.density, data.progress));
    const componentE3 = component_E3(PanelEGenerate.score2componentE3(data.score, data.original));
    const componentE4 = component_E4(PanelEGenerate.score2componentE4(data.score));
    const componentE5 = component_E5(PanelEGenerate.score2componentE5(data.score));
    const componentE6 = await component_E6(PanelEGenerate.score2componentE6(data.score));
    const componentE7 = component_E7(PanelEGenerate.score2componentE7(data.score, data.attributes));
    const componentE8 = component_E8(PanelEGenerate.score2componentE8(data.score));
    const componentE9 = component_E9(PanelEGenerate.score2componentE9(data.score));
    const componentE10 = component_E10(PanelEGenerate.score2componentE10(data.score));

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = implantSvgBody(svg, 40, 330, componentE1, reg_card_e1);
    svg = implantSvgBody(svg, 40, 500, componentE2, reg_card_e1);
    svg = implantSvgBody(svg, 40, 770, componentE3, reg_card_e1);
    svg = implantSvgBody(svg, 550, 330, componentE4, reg_card_e2);
    svg = implantSvgBody(svg, 1280, 330, componentE5, reg_card_e2);
    svg = implantSvgBody(svg, 570, 880, componentE6, reg_card_e2);
    svg = implantSvgBody(svg, 1390, 330, componentE7, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 500, componentE8, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 600, componentE9, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 770, componentE10, reg_card_e3);

    // 导入图片
    svg = implantImage(svg, 1920, 1080, 0, 0, 0.6, background, reg_background);

    if (getFileSize(banner) / 1024 >= 400) {
        svg = implantImage(svg, 1920, 330, 0, 200, 0.8, banner, reg_banner);
    } else {
        svg = implantImage(svg, 1920, 330, 0, 0, 0.8, banner, reg_banner);
    }

    return svg.toString();
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_E1 = (
    data = {
        name: '',
        star: 0,
        mode: ''
    }) => {

    // 读取模板
    let svg =
        `   <defs>
            <clipPath id="clippath-OE1-1">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE1-2">
            
            </clipPath>
            <linearGradient id="grad-OE1-3" x1="0%" y1="0" x2="100%" y2="0">
                <stop offset="0%" style="stop-color:rgb(66,144,251); stop-opacity:1" />
                <stop offset="14%" style="stop-color:rgb(79,192,255); stop-opacity:1" />
                <stop offset="22%" style="stop-color:rgb(79,255,213); stop-opacity:1" />
                <stop offset="28%" style="stop-color:rgb(124,255,79); stop-opacity:1" />
                <stop offset="37%" style="stop-color:rgb(246,240,92); stop-opacity:1" />
                <stop offset="47%" style="stop-color:rgb(255,104,104); stop-opacity:1" />
                <stop offset="55%" style="stop-color:rgb(255,78,111); stop-opacity:1" />
                <stop offset="65%" style="stop-color:rgb(198,69,184); stop-opacity:1" />
                <stop offset="75%" style="stop-color:rgb(101,99,222); stop-opacity:1" />
                <stop offset="86%" style="stop-color:rgb(24,21,142); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(0,0,0); stop-opacity:1" />
            </linearGradient>
          </defs>
          <g id="Base_OE1">
            <rect id="Base" x="0" y="0" width="490" height="150" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE1-3); fill-opacity: 0.2"/>
          </g>
          <g id="Star_OE1" style="clip-path: url(#clippath-OE1-2);">
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE1-3); fill-opacity: 0.9"/>
          </g>
          <g id="Text_OE1">
          </g>
          <g id="Overlay_OE1">
          </g>`;

    const reg_text = /(?<=<g id="Text_OE1">)/;
    const reg_star = /(?<=<clipPath id="clippath-OE1-2">)/;

    const star = data?.star || 0;
    const star_rrect = PanelDraw.Rect(15, 105, Math.max((Math.min((star / 9), 1) * 460), 20), 30, 15, 'none')

    const ruleset = extra.getTextPath(getGameMode(data.mode, -1), 20 - 2, 88 - 10, 72, 'left baseline', getStarRatingColor(star))

    const text_arr = [
        {
            font: "poppinsBold",
            text: getRoundedNumberStrLarge(star, 3),
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: getRoundedNumberStrSmall(star, 3),
            size: 48,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: ' / ' + data?.name,
            size: 24,
            color: '#fff',
        },
    ]

    const texts = getMultipleTextPath(text_arr, 105, 88, "left baseline");

    const title = poppinsBold.getTextPath('Star Rating', 475, 28, 18, 'right baseline', '#fff')

    svg = replaceText(svg, star_rrect, reg_star)
    svg = replaceTexts(svg, [ruleset, texts, title], reg_text);

    return svg;
};

const component_E2 = (
    data = {
        density_arr: [],
        retry_arr: [],
        fail_arr: [],

        public_rating: 0,
        star: 0,

        pass: 0,
        play: 0,
        progress: 1,

        color: '#fff'
    }) => {

    let svg = '';

    svg += PanelDraw.Rect(0, 0, 490, 250, 20, '#382e32');

    const title1 = poppinsBold.getTextPath('Density', 15, 28, 18, 'left baseline', '#fff');
    const title2 = poppinsBold.getTextPath('Retry & Fail', 15, 138, 18, 'left baseline', '#fff');

    const pass_percent = data?.play > 0 ? Math.round(data?.pass / data?.play * 100) : 0;

    const public_rating = poppinsBold.getTextPath(getRoundedNumberStr(data?.public_rating, 2) + ' / 10', 475, 28, 18, 'right baseline', '#fff');
    const percent = poppinsBold.getTextPath(data?.pass + ' / ' + data?.play + ' [' + pass_percent + '%]', 475, 138, 18, 'right baseline', '#fff');


    // 评级或难度分布矩形的缩放，SR1为0.1倍，SR8为1倍
    let density_scale = 1;
    if (data.star <= 1) {
        density_scale = 0.1;
    } else if (data.star <= 8) {
        density_scale = Math.sqrt(((data.star - 1) / 7 * 0.9) + 0.1); //类似对数增长，比如4.5星高度就是原来的 0.707 倍
    }

    const density_arr_max = Math.max.apply(Math, data.density_arr) / density_scale;
    const density = PanelDraw.LineChart(data.density_arr, density_arr_max, 0, 15, 115, 460, 80, data.color, 1, 0.4, 3);

    const fail_index = data.progress < 1 ? PanelDraw.Rect(20 + (457 * data.progress) + 1.5, 35, 3, 80, 1.5, '#ed6c9e') : '';

    //中下的失败率重试率图像
    const rf_arr = data.fail_arr ? data.fail_arr.map(function (v, i) {
        return v + data.retry_arr[i];
    }) : [];
    const rf_max = Math.max.apply(Math, rf_arr);
    const retry = PanelDraw.BarChart(rf_arr, rf_max, 0,
        15, 235, 460, 80, 2, 0, '#f6d659');
    const fail = PanelDraw.BarChart(data.fail_arr, rf_max, 0,
        15, 235, 460, 80, 2, 0, '#ed6c9e');

    svg += (density + retry + fail + fail_index + title1 + title2 + public_rating + percent);

    return svg;
};

const component_E3 = (
    data = {
        labels: [],
    }) => {
    let svg = `
        <g id="Labels_OE3">
        </g>
    `;

    const labels = data?.labels || [];
    const reg_label = /(?<=<g id="Labels_OE3">)/;

    const title = poppinsBold.getTextPath('Statistics', 15, 28, 18, 'left baseline', '#fff');

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            const e5 = label_E5(labels[i + 2 * j]);

            svg = implantSvgBody(svg, 15 + 235 * i, 38 + 76 * j, e5, reg_label);
        }
    }

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = replaceTexts(svg, [title, rect], reg_label)

    return svg;
}

const component_E4 = (
    data = {
        image: '',
    }) => {
    let svg = `
        <g id="Base_OE4">
        </g>
        <g id="Status_OE4">
        </g>
    `;

    const reg_status = /(?<=<g id="Status_OE4">)/;
    const reg_base = /(?<=<g id="Base_OE4">)/;
    const rect = PanelDraw.Rect(0, 0, 90, 60, 20, '#382e32', 1);

    svg = implantImage(svg, 50, 50, 20, 5, 1, data?.image, reg_status);
    svg = replaceText(svg, rect, reg_base);

    return svg;
}

const component_E5 = (
    data = {
        favorite: 0,
        playcount: 0,
    }) => {
    let svg = `
        <g id="Base_OE5">
        </g>
        <g id="Text_OE5">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE5">)/;
    const reg_base = /(?<=<g id="Base_OE5">)/;
    const rect = PanelDraw.Rect(0, 0, 90, 60, 20, '#382e32', 1);

    const fav = poppinsBold.getTextPath(getRoundedNumberStr(data?.favorite, 1), 78, 25, 16, 'right baseline', '#fff')
    const pc = poppinsBold.getTextPath(getRoundedNumberStr(data?.playcount, 1), 78, 47, 16, 'right baseline', '#fff')

    svg = replaceTexts(svg, [fav, pc], reg_text);
    svg = implantImage(svg, 18, 16, 12, 10, 1, getImageFromV3('object-beatmap-favorite.png'), reg_text);
    svg = implantImage(svg, 18, 18, 12, 32, 1, getImageFromV3('object-beatmap-playcount.png'), reg_text);
    svg = replaceText(svg, rect, reg_base);

    return svg;
}

const component_E6 = async (
    data = {
        title: '',
        title_unicode: '',
        artist: '',
        difficulty_name: '',
        creator: '',
        bid: 0,
        sid: 0,
        status: 'pending',
    }) => {
    let svg = `   <defs>
            <clipPath id="clippath-OE6-1">
                <rect id="BG_Base" x="0" y="0" width="780" height="160" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            </defs>
        <g id="Base_OE6">
        </g>
        <g id="Background_OE6" style="clip-path: url(#clippath-OE6-1);">
        </g>
        <g id="Labels_OE6">
        </g>
    `;

    const reg_label = /(?<=<g id="Labels_OE6">)/;
    const reg_background = /(?<=<g id="Background_OE6" style="clip-path: url\(#clippath-OE6-1\);">)/;
    const reg_base = /(?<=<g id="Base_OE6">)/;

    const t = getBeatMapTitlePath("poppinsBold", "PuHuiTi",
        data?.title || '', data?.title_unicode || '', data?.artist || '', 780 / 2, 55, 98, 48, 24, 780 - 20);

    const diff_text = poppinsBold.cutStringTail(data?.difficulty_name || '', 30,
        780 - 40 - 20
        - poppinsBold.getTextWidth(data?.creator || '', 24)
        - poppinsBold.getTextWidth('b' + (data?.bid || 0), 24)
        , true)

    const diff = poppinsBold.getTextPath(diff_text, 780 / 2, 142, 30, 'center baseline', '#fff');
    const creator = poppinsBold.getTextPath(data?.creator || '', 20, 142, 24, 'left baseline', '#fff');
    const bid = poppinsBold.getTextPath('b' + (data?.bid || 0), 780 - 20, 142, 24, 'right baseline', '#fff');

    const background = await getDiffBG(data?.bid, data?.sid, 'cover', hasLeaderBoard(data?.status));

    const rect = PanelDraw.Rect(0, 0, 780, 160, 20, '#382e32', 1);

    svg = replaceTexts(svg, [t.title, t.title_unicode, bid, creator, diff], reg_label);
    svg = implantImage(svg, 780, 160, 0, 0, 0.6, background, reg_background);
    svg = replaceText(svg, rect, reg_base);

    return svg;
}

const component_E7 = (
    data = {
        pp: 0,
        full_pp: 0,
        perfect_pp: 0,

        aim_pp: 0,
        spd_pp: 0,
        acc_pp: 0,
        fl_pp:  0,
        diff_pp: 0,

        is_fc: true,

        mode: 'osu',
    }) => {

    // 读取模板
    let svg =
        `   <defs>
            <clipPath id="clippath-OE7-1">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-2">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-3">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-4">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-5">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-6">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <linearGradient id="grad-OE7-12" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(79,172,254); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(0,242,254); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE7-13" x1="0%" y1="0" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(94,220,91); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(202,248,129); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE7-14" x1="0%" y1="0" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(252,172,70); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(254,220,69); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE7-15" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(231,72,138); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,120,107); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE7-16" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(79,172,254); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(0,242,254); stop-opacity:1" />
            </linearGradient>
          </defs>
          <g id="Base_OE7">
            <rect id="Base" x="0" y="0" width="490" height="150" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE7-12); fill-opacity: 0.2"/>
          </g>
          <g id="Rect_OE7">
            <g id="Clip_OE7-6" style="clip-path: url(#clippath-OE7-6);">
            
            </g>
            <g id="Clip_OE7-5" style="clip-path: url(#clippath-OE7-5);">
            
            </g>
            <g id="Clip_OE7-4" style="clip-path: url(#clippath-OE7-4);">
            
            </g>
            <g id="Clip_OE7-3" style="clip-path: url(#clippath-OE7-3);">
            
            </g>
            <g id="Clip_OE7-2" style="clip-path: url(#clippath-OE7-2);">
            
            </g>
          </g>
          <g id="Text_OE7">
          </g>`;

    const reg_text = /(?<=<g id="Text_OE7">)/;
    const reg_clip2 = /(?<=<g id="Clip_OE7-2" style="clip-path: url\(#clippath-OE7-2\);">)/;
    const reg_clip3 = /(?<=<g id="Clip_OE7-3" style="clip-path: url\(#clippath-OE7-3\);">)/;
    const reg_clip4 = /(?<=<g id="Clip_OE7-4" style="clip-path: url\(#clippath-OE7-4\);">)/;
    const reg_clip5 = /(?<=<g id="Clip_OE7-5" style="clip-path: url\(#clippath-OE7-5\);">)/;
    const reg_clip6 = /(?<=<g id="Clip_OE7-6" style="clip-path: url\(#clippath-OE7-6\);">)/; //181,100,217 | 238,96,156

    const pf_percent = data?.perfect_pp > 0 ? (data?.pp / data?.perfect_pp) : 0;
    const fc_percent = data?.full_pp > 0 ? (data?.pp / data?.full_pp) : 0;

    let is_fc = data?.is_fc;

    const over = 460 - poppinsBold.getTextWidth(Math.round(data?.perfect_pp || 0), 24) - 30 < (460 * fc_percent);
    if (over) is_fc = true;


    let reference_pp; // 参考 PP，有时是 FC PP，有时是 SS PP

    let percent;
    let reference_pp_text;
    let fc_pp_text;
    let percent_type;

    if (is_fc) {
        reference_pp = data?.perfect_pp;

        percent = pf_percent;
        percent_type = 'SS'
        fc_pp_text = '';
    } else {
        reference_pp = data?.full_pp;

        percent = fc_percent;
        percent_type = 'FC'
        fc_pp_text = Math.round(data?.perfect_pp || 0);
    }

    reference_pp_text = ' / ' + Math.round(reference_pp) + ' ' + percent_type +' [' + Math.round(percent * 100) + '%]';

    const fc_pp = poppinsBold.getTextPath(fc_pp_text, 475 - 15, 128, 24, 'right baseline', '#fff')

    const text_arr = [
        {
            font: "poppinsBold",
            text: Math.round(data?.pp || 0),
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: ' PP',
            size: 48,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: reference_pp_text,
            size: 24,
            color: '#fff',
        },
    ]

    const texts = getMultipleTextPath(text_arr, 20, 88, "left baseline");

    const title = poppinsBold.getTextPath('Performance Points', 475, 28, 18, 'right baseline', '#fff')

    switch (getGameMode(data?.mode, 1)) {
        case 'o': {
            const sum = data?.aim_pp + data?.spd_pp + data?.acc_pp + data?.fl_pp || 0;

            const aim_width = getChildPPWidth(data?.aim_pp, sum, data?.pp, reference_pp);
            const spd_width = getChildPPWidth(data?.spd_pp, sum, data?.pp, reference_pp);
            const acc_width = getChildPPWidth(data?.acc_pp, sum, data?.pp, reference_pp);
            const fl_width = getChildPPWidth(data?.fl_pp, sum, data?.pp, reference_pp);

            const aim_rect = PanelDraw.Rect(15, 105, aim_width, 30, 15, "url(#grad-OE7-12)", 1);
            const spd_rect = PanelDraw.Rect(15, 105, aim_width + spd_width, 30, 15, "url(#grad-OE7-13)", 1);
            const acc_rect = PanelDraw.Rect(15, 105, aim_width + spd_width + acc_width, 30, 15, "url(#grad-OE7-14)", 1);
            const fl_rect = PanelDraw.Rect(15, 105, aim_width + spd_width + acc_width + fl_width, 30, 15, "url(#grad-OE7-15)", 1);

            const aim_text = getChildPPPath(data?.aim_pp, 15, 128, 24, aim_width, aim_width, 10);
            const spd_text = getChildPPPath(data?.spd_pp, 15, 128, 24, aim_width + spd_width, spd_width, 10);
            const acc_text = getChildPPPath(data?.acc_pp, 15, 128, 24, aim_width + spd_width + acc_width, acc_width, 10);
            const fl_text = getChildPPPath(data?.fl_pp, 15, 128, 24, aim_width + spd_width + acc_width + fl_width, fl_width, 10);

            svg = replaceText(svg, aim_rect, reg_clip2);
            svg = replaceText(svg, spd_rect, reg_clip3);
            svg = replaceText(svg, acc_rect, reg_clip4);
            svg = replaceText(svg, fl_rect, reg_clip5);
            svg = replaceTexts(svg, [aim_text, spd_text, acc_text, fl_text], reg_text);
            break;
        }

        case 't': {
            const sum = data?.diff_pp + data?.acc_pp || 0;

            const diff_width = getChildPPWidth(data?.diff_pp, sum, data?.pp, reference_pp);
            const acc_width = getChildPPWidth(data?.acc_pp, sum, data?.pp, reference_pp);

            const diff_rect = PanelDraw.Rect(15, 105, diff_width, 30, 15, "url(#grad-OE7-12)", 1);
            const acc_rect = PanelDraw.Rect(15, 105, diff_width + acc_width, 30, 15, "url(#grad-OE7-13)", 1);

            const diff_text = getChildPPPath(data?.diff_pp, 15, 128, 24, diff_width, diff_width, 10);
            const acc_text = getChildPPPath(data?.acc_pp, 15, 128, 24, diff_width + acc_width, acc_width, 10);

            svg = replaceText(svg, diff_rect, reg_clip3);
            svg = replaceText(svg, acc_rect, reg_clip4);
            svg = replaceTexts(svg, [diff_text, acc_text], reg_text);
            break;
        }
    }

    // 保底 PP
    const pp_width = (data?.pp > 0) ? ((data?.pp / reference_pp) * 460) : 0;
    const pp_rect = PanelDraw.Rect(15, 105, pp_width, 30, 15, "url(#grad-OE7-16)", 1);
    svg = replaceText(svg, pp_rect, reg_clip6);

    svg = replaceTexts(svg, [texts, title, fc_pp], reg_text);

    return svg;

    // 在有值的时候最低是 min_width，没有值则是 0
    // 注意！这个值加起来的和，总会比原来的成绩 PP 的宽度大一点点（因为最短限制为 30）
    function getChildPPWidth(child_pp = 0, child_sum_pp = 0, pp = 0, full_pp = 0, max_width = 460, min_width = 30) {
        const pp_width = (pp / full_pp) * max_width;
        const child_pp_width = (child_pp / child_sum_pp) * pp_width;
        return (child_pp > 0) ? Math.max(min_width, child_pp_width) : 0;
    }

    function getChildPPPath(child_pp = 0, x = 0, y = 0, size = 24, width = 30, max_width = 30, interval = 0) {
        const pp_str = Math.round(child_pp).toString();
        const shown = isTextShown('poppinsBold', child_pp, size, max_width, interval);
        const slight = isTextSlightlyWider('poppinsBold', child_pp, size, max_width, interval);

        return shown ?
            poppinsBold.getTextPath(pp_str, x + width - interval, y, size, 'right baseline', '#382c32') :
            (slight ? poppinsBold.getTextPath(pp_str, x + width - (1/2 * max_width), y, size, 'center baseline', '#382c32') : '');
    }

    // 宽度大于最大宽 + 2x 间距
    function isTextShown(font = 'poppinsBold', pp = 0, size = 24, max_width = 0, interval = 0) {
        return typeof pp === "number" && max_width > 0 && (max_width - 2 * interval >= getTextWidth(font, Math.round(pp).toString(), size));
    }

    // 宽度大于最大宽 - 1/2x 间距
    function isTextSlightlyWider(font = 'poppinsBold', pp = 0, size = 24, max_width = 0, interval = 0) {
        return typeof pp === "number" && max_width > 0 && (max_width + 1/2 * interval >= getTextWidth(font, Math.round(pp).toString(), size));
    }
};

const component_E8 = (
    data = {
        score: 0,
        mods: [],
    }) => {
    let svg = `
        <g id="Base_OE8">
        </g>
        <g id="Mods_OE8">
        </g>
        <g id="Text_OE8">
        </g>
    `;

    const reg_mods = /(?<=<g id="Mods_OE8">)/;
    const reg_text = /(?<=<g id="Text_OE8">)/;
    const reg_base = /(?<=<g id="Base_OE8">)/;

    const mods = getModsSVG(data.mods, 390, 10, 90, 42, 50); // y = 15
    const score = getMultipleTextPath([
            {
                font: 'poppinsBold',
                text: getRoundedNumberStrLarge(data?.score, -1),
                size: 56,
            },
            {
                font: 'poppinsBold',
                text: getRoundedNumberStrSmall(data?.score, -1),
                size: 36,
            }
        ],
        20, 62, 'left baseline')

    const title = (data?.mods.length > 0) ? '' : poppinsBold.getTextPath('Score', 475, 28, 18, 'right baseline');

    const rect = PanelDraw.Rect(0, 0, 490, 80, 20, '#382e32', 1);

    svg = replaceText(svg, mods, reg_mods);
    svg = replaceTexts(svg, [title, score], reg_text);
    svg = replaceText(svg, rect, reg_base);

    return svg;
}

const component_E9 = (
    data = {
        accuracy: 0,
        combo: 0,
        max_combo: 0,
    }) => {
    let svg = `
        <g id="Base_OE9">
        </g>
        <g id="Text_OE9">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE9">)/;
    const reg_base = /(?<=<g id="Base_OE9">)/;

    const title = poppinsBold.getTextPath('Accuracy', 15, 28, 18, 'left baseline', '#fff');
    const title2 = poppinsBold.getTextPath('Combo', 15, 98, 18, 'left baseline', '#fff');

    const accuracy = getMultipleTextPath([
            {
                font: 'poppinsBold',
                text: getRoundedNumberStrLarge((data?.accuracy || 0) * 100, 3),
                size: 60,
            },
            {
                font: 'poppinsBold',
                text: getRoundedNumberStrSmall((data?.accuracy || 0) * 100, 3) + ' %',
                size: 36
            }
        ],
        470, 62, 'right baseline')

    const combo = getMultipleTextPath([
            {
                font: 'poppinsBold',
                text: data?.combo || 0,
                size: 60,
            },
            {
                font: 'poppinsBold',
                text: ' / ' + data?.max_combo || 0,
                size: 36,
            }
        ],
        470, 132, 'right baseline')

    const rect = PanelDraw.Rect(0, 0, 490, 150, 20, '#382e32', 1);

    svg = replaceTexts(svg, [title, title2, accuracy, combo], reg_text);
    svg = replaceText(svg, rect, reg_base);

    return svg;
}

const component_E10 = (
    data = {
        statistics: [],
        statistics_max: 0,

        ratio: 0,
        mode: '',
    }) => {
    let svg = `
        <g id="Base_OE10">
        </g>
        <g id="Text_OE10">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE10">)/;
    const reg_base = /(?<=<g id="Base_OE10">)/;

    const title = poppinsBold.getTextPath('Judges', 15, 28, 18, 'left baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    const statistics = getStatisticsSVG(data.statistics, data.statistics_max, 64, 45, 360, 20, 16, 16) // 345

    let ratio_text;

    if (data.ratio === Infinity) {
        ratio_text = 'P : G = Infinity'
    } else if (data.ratio === 0) {
        ratio_text = 'P : G = 0'
    } else if (data.ratio >= 1) {
        ratio_text = 'P : G = ' + getRoundedNumberStr(data.ratio, 2) +' : 1';
    } else {
        ratio_text = 'P : G = 1 : ' + getRoundedNumberStr(1 / data.ratio, 2)
    }

    const perfect_great_ratio = (getGameMode(data?.mode, 1) === 'm') ?
        poppinsBold.getTextPath(
            ratio_text, 475, 28, 18, 'right baseline', '#fff'
        )
        : ''

    svg = replaceTexts(svg, [title, statistics, perfect_great_ratio], reg_text);
    svg = replaceText(svg, rect, reg_base);

    return svg;
}

// 私有转换方式
const PanelEGenerate = {
    score2componentE1: (score) => {

        // sr 2 difficulty name
        const sr = score?.beatmap.difficulty_rating || 0;

        const mode = score?.mode || 'osu';

        let name;

        switch (getGameMode(mode, 1)) {
            case "t": {
                if (sr < 0.1) name = 'NEW';
                else if (sr < 2) name = 'KANTAN';
                else if (sr < 2.8) name = 'FUTSUU';
                else if (sr < 4) name = 'MUZUKASHII';
                else if (sr < 5.3) name = 'ONI';
                else if (sr < 6.5) name = 'INNER ONI';
                else if (sr >= 6.5) name = 'URA ONI';
                else name = 'UNKNOWN';
                break;
            }
            case "c": {
                if (sr < 0.1) name = 'NEW';
                else if (sr < 2) name = 'CUP';
                else if (sr < 2.8) name = 'SALAD';
                else if (sr < 4) name = 'PLATTER';
                else if (sr < 5.3) name = 'RAIN';
                else if (sr < 6.5) name = 'OVERDOSE';
                else if (sr >= 6.5) name = 'DELUGE';
                else name = 'UNKNOWN';
                break;
            }
            case "m": {
                if (sr < 0.1) name = 'NEW';
                else if (sr < 2) name = 'EZ';
                else if (sr < 2.8) name = 'NM';
                else if (sr < 4) name = 'HD';
                else if (sr < 5.3) name = 'MX';
                else if (sr < 6.5) name = 'SC';
                else if (sr >= 6.5) name = 'SHD';
                else name = 'UNKNOWN';
                break;
            }
            default: {
                if (sr < 0.1) name = 'NEW';
                else if (sr < 2) name = 'EASY';
                else if (sr < 2.8) name = 'NORMAL';
                else if (sr < 4) name = 'HARD';
                else if (sr < 5.3) name = 'INSANE';
                else if (sr < 6.5) name = 'EXPERT';
                else if (sr >= 6.5) name = 'ULTRA';
                else name = 'UNKNOWN';
                break;
            }
        }

        return {
            name: name,
            star: sr,
            mode: mode,
        }
    },

    score2componentE2: (score, density = [], progress = 0) => {
        return {
            density_arr: density,
            retry_arr: score?.beatmap?.retryList || [],
            fail_arr: score?.beatmap?.failList || [],

            star: score?.beatmap?.difficulty_rating || 0,

            public_rating: score?.beatmap?.beatmapset?.publicRating,

            pass: score?.beatmap?.passcount || 0,
            play: score?.beatmap?.playcount || 0,
            progress: progress,

            color: getRankColor(score.rank),
        }
    },

    score2componentE3: (score, original) => {
        const mode = getGameMode(score.mode, 1);

        const bpm_r = (score?.beatmap?.bpm > 0) ? (60000 / score?.beatmap?.bpm).toFixed(0) + 'ms' : '-';
        const bpm_b = getDecimals(score?.beatmap?.bpm, 2);
        const bpm_m = getDecimals(score?.beatmap?.bpm, 3);
        const bpm_p = getProgress(score?.beatmap?.bpm, 90, 270);

        const length_r = Math.floor(score?.beatmap?.total_length / 60) + ':' + (score?.beatmap?.total_length % 60).toFixed(0).padStart(2, '0');
        const length_b = Math.floor(score?.beatmap?.hit_length / 60) + ':';
        const length_m = (score?.beatmap?.hit_length % 60).toFixed(0).padStart(2, '0');
        const length_p = getProgress(score?.beatmap?.hit_length, 30, 210);

        let isDisplayCS = true;
        let isDisplayAR = true;
        let isDisplayOD = true;

        let cs_min = 2;
        let cs_mid = 4;
        let cs_max = 6;
        let ar_min = 7.5;
        let ar_mid = 9;
        let ar_max = 10.5;
        let od_min = 5.5;
        let od_mid = 8;
        let od_max = 10.5;
        let hp_min = 4;
        let hp_mid = 6;
        let hp_max = 8;

        switch (mode) {
            case 't' : {
                cs_min = 0;
                cs_mid = 0;
                cs_max = 0;
                ar_min = 0;
                ar_mid = 0;
                ar_max = 0;
                od_min = 4;
                od_mid = 6;
                od_max = 8;
                isDisplayAR = false;
                isDisplayCS = false;
            } break;
            case 'c' : {
                od_min = 0;
                od_mid = 0;
                od_max = 0;
                isDisplayOD = false;
            } break;
            case 'm' : {
                cs_min = 4;
                cs_mid = 6;
                cs_max = 8;
                ar_min = 0;
                ar_mid = 0;
                ar_max = 0;
                hp_min = 7;
                hp_mid = 8.5;
                hp_max = 10;
                isDisplayAR = false;
            } break;
        }

        return {
            labels: [{
                ...LABELS.BPM,
                remark: bpm_r,
                data_b: bpm_b,
                data_m: bpm_m,
                data_a: '',
                bar_progress: bpm_p,
            },{
                ...LABELS.LENGTH,
                remark: length_r,
                data_b: length_b,
                data_m: length_m,
                data_a: '',
                bar_progress: length_p,
            },{
                ...LABELS.CS,
                ...stat2label(score?.beatmap?.cs, cs2px(score?.beatmap?.cs, mode),
                    getProgress(score?.beatmap?.cs, cs_min, cs_max), original.cs, isDisplayCS),
                bar_min: cs_min,
                bar_mid: cs_mid,
                bar_max: cs_max,
            },{
                ...LABELS.AR,
                ...stat2label(score?.beatmap?.ar, ar2ms(score?.beatmap?.ar, mode),
                    getProgress(score?.beatmap?.ar, ar_min, ar_max), original.ar, isDisplayAR),
                bar_min: ar_min,
                bar_mid: ar_mid,
                bar_max: ar_max,
            },{
                ...LABELS.OD,
                ...stat2label(score?.beatmap?.od, od2ms(score?.beatmap?.od, mode),
                    getProgress(score?.beatmap?.od, od_min, od_max), original.od, isDisplayOD),
                bar_min: od_min,
                bar_mid: od_mid,
                bar_max: od_max,
            },{
                ...LABELS.HP,
                ...stat2label(score?.beatmap?.hp, '-',
                    getProgress(score?.beatmap?.hp, hp_min, hp_max), original.hp, true),
                bar_min: hp_min,
                bar_mid: hp_mid,
                bar_max: hp_max,
            }]
        };
    },

    score2componentE4: (score) => {
        return {
            image: getMapStatusImage(score?.beatmap?.ranked)
        }
    },

    score2componentE5: (score) => {
        return {
            favorite: score?.beatmapset?.favourite_count || 0,
            playcount: score?.beatmapset?.play_count || 0,
        }
    },

    score2componentE6: (score) => {
        return {
            title: score?.beatmapset?.title || '',
            title_unicode: score?.beatmapset?.title_unicode || '',
            artist: score?.beatmapset?.artist || '',
            difficulty_name: score?.beatmap?.version || '',
            bid: score?.beatmap?.id || 0,
            sid: score?.beatmapset?.id || 0,
            creator: score?.beatmapset?.creator || '',
            status: score?.beatmap?.status || 'pending',
        }
    },

    score2componentE7: (score, attr) => {
        const is_fc = (score?.max_combo / score?.beatmap?.max_combo) > 0.98
            || getGameMode(score?.mode, 1) === 'm'
            || getGameMode(score?.mode, 1) === 't'

        return {
            pp: score?.pp || 0,
            full_pp: attr?.full_pp || 0,
            perfect_pp: attr?.perfect_pp || 0,

            aim_pp: attr?.aim_pp || 0,
            spd_pp: attr?.spd_pp || 0,
            acc_pp: attr?.acc_pp || 0,
            fl_pp: attr?.fl_pp || 0,
            diff_pp: attr?.diff_pp || 0,

            is_fc: is_fc,

            mode: score?.mode,
        }
    },

    score2componentE8: (score) => {
        const s = score?.score || 0
        const score_v3 = (s > 0) ? s : getV3Score(score?.accuracy, score?.max_combo, score?.beatmap?.max_combo, score?.mods, score?.mode, score?.statistics?.count_miss);

        return {
            score: score_v3,
            mods: score?.mods || [],
        }
    },

    score2componentE9: (score) => {
        return {
            accuracy: score?.accuracy || 0,
            combo: score?.max_combo || 0,
            max_combo: score?.beatmap.max_combo || 0,
        }
    },

    score2componentE10: (score) => {
        let ratio;

        if (score.statistics.count_300 === 0) {
            if (score.statistics.count_geki === 0) {
                ratio = 0;
            } else {
                ratio = Infinity;
            }
        } else if (score.statistics.count_geki === 0) {
            ratio = 0;
        } else {
            ratio = score.statistics.count_geki / score.statistics.count_300
        }

        return {
            statistics: score2Statistics(score),
            statistics_max: score2StatisticsMax(score),

            ratio: ratio,
            mode: score.mode,
        }
    },
}

// bottom: 保底
const getProgress = (x, min, max, bottom = 1 / 16) => {
    const result = (Math.min(Math.max(x, min), max) - min) / (max - min)

    return Math.max(result, bottom);
}

const stat2label = (stat, remark, progress, original, isDisplay) => {
    const hasChanged = Math.abs(original - stat) > 0.1;

    const stat_b = getDecimals(stat, 2);
    const stat_m = getDecimals(stat, 4);

    if (isDisplay) return {
        remark: remark,
        data_b: stat_b,
        data_m: stat_m,
        data_a: hasChanged ? (' [' + getDecimals(original, 2) + getDecimals(original, 4) + ']') : '',
        bar_progress: progress,
    }
    else return {
        remark: '-',
        data_b: '-',
        data_m: '',
        data_a: '',
        bar_progress: null,
    }
}

// 同 panelE 的方法，注意这里 x 是第一个 mod 的左下角
const getModsSVG = (mods = [""], x, y, mod_w, text_h, interval) => {
    let svg = '';
    const length = mods ? mods.length : 0;

    if (length <= 2 && length > 0) {
        mods.forEach((v, i) => {
            svg += insertMod(v, x - ((length - 1) * 2 * interval) + (2 * i * interval), y, mod_w, text_h);
        });
    } else if (length > 2) {
        mods.forEach((v, i) => {
            svg += insertMod(v, x - ((length - 1) * interval) + (i * interval), y, mod_w, text_h);
        });
    }

    function insertMod(mod, x, y, w, text_h){
        const color = getModColor(mod);
        const mod_abbr = torus.getTextPath(mod.toString(), x + (w / 2), y + text_h, 36, 'center baseline', '#fff');

        return `<path transform="translate(${x} ${y})"  d="m70.5,4l15,20c2.667,3.556,2.667,8.444,0,12l-15,20c-1.889,2.518-4.852,4-8,4H27.5c-3.148,0-6.111-1.482-8-4l-15-20c-2.667-3.556-2.667-8.444,0-12L19.5,4C21.389,1.482,24.352,0,27.5,0h35c3.148,0,6.111,1.482,8,4Z" style="fill: ${color};"/>\n` + mod_abbr + '\n';
    }

    return svg;
}


//老面板的newJudge
const score2Statistics = (score) => {
    const n320 = score.statistics.count_geki;
    const n300 = score.statistics.count_300;
    const n200 = score.statistics.count_katu;
    const n100 = score.statistics.count_100;
    const n50 = score.statistics.count_50;
    const n0 = score.statistics.count_miss;

    let statistics = [];
    const mode = getGameMode(score.mode, 1);

    switch (mode) {
        case 'o': {
            statistics.push({
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '100',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {
                index: '50',
                stat: n50,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#FEF668',
            }, {}, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            });
            break;
        }

        case 't': {
            statistics.push({
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '150',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {}, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            });
            break;
        }

        case 'c': {
            statistics.push({
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '100',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {
                index: '50',
                stat: n50,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#FEF668',
            }, {}, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            }, {
                index: 'MD',
                stat: n200,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#A1A1A1',
            });
            break;
        }

        case 'm': {
            statistics.push({
                index: 'MAX',
                stat: n320,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '300',
                stat: n300,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#FEF668',
            }, {
                index: '200',
                stat: n200,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {
                index: '100',
                stat: n100,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#5E8AC6',
            }, {
                index: '50',
                stat: n50,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#A1A1A1',
            }, {
                index: '0',
                stat: n0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            });
            break;
        }

    }

    return statistics;
}

//老面板的sumJudge
const score2StatisticsMax = (score) => {
    const n320 = score.statistics.count_geki;
    const n300 = score.statistics.count_300;
    const n200 = score.statistics.count_katu;
    const n100 = score.statistics.count_100;
    const n50 = score.statistics.count_50;
    const n0 = score.statistics.count_miss;

    const mode = getGameMode(score.mode, 1);

    switch (mode) {
        case 'o':
            return n300 + n100 + n50 + n0;
        case 't':
            return n300 + n100 + n0;
        case 'c':
            return Math.max(n300 + n100 + n0, n50, n200); //小果miss(katu)也要传过去的
        case 'm':
            return Math.max(n320 + n300, n200, n100, n50, n0);
        default:
            return n320 + n300 + n200 + n100 + n50 + n0;
    }
}

function getStatisticsSVG(stat = [], stat_max = 0, x, y, w, height, interval, font_h) {
    let svg = '';

    stat.forEach((v, i) => {
        const text_y = y + font_h + i * (height + interval);
        const index_text_x = x - 10;
        const stat_text_x = x + w + 10;

        const index = (v.index === 0) ? '0' : (v.index || '');
        const stat = (v.stat === 0) ? '0' : (v.stat || '');

        const color = v.rrect_color;

        const index_text = poppinsBold.getTextPath(index.toString(),
            index_text_x, text_y, 18, "right baseline", v.index_color);
        const stat_text = poppinsBold.getTextPath(stat.toString(),
            stat_text_x, text_y, 18, "left baseline", v.stat_color);

        svg += (index_text + stat_text);

        if (v.stat > 0) {
            const rect_width = w * v.stat / stat_max;
            svg += PanelDraw.Rect(x, y + (height + interval) * i, Math.max(rect_width, height), height, height / 2, color);
        }

        if (typeof v.stat === "number") {
            svg += PanelDraw.Rect(x, y + (height + interval) * i, w, height, height / 2, color, 0.1);
        }
    });

    return svg;
}
