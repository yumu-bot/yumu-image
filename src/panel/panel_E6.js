import {
    ar2ms,
    cs2px,
    exportJPEG,
    getBeatMapTitlePath,
    getDiffBG,
    getKeyDifficulty, getDifficultyIndex,
    getFileSize,
    getFormattedTime,
    getGameMode,
    getImageFromV3,
    getMapStatusImage,
    getNowTimeStamp,
    getPanelNameSVG, getTimeDifference,
    setImage,
    setSvgBody, isEmptyArray,
    isNotEmptyString,
    od2ms,
    readTemplate,
    setText,
    setTexts,
    round,
    rounds
} from "../util/util.js";
import {getRankBG, hasLeaderBoard} from "../util/star.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {extra, getMultipleTextPath, getTextWidth, poppinsBold} from "../util/font.js";
import {getRankColor, getStarRatingColor} from "../util/color.js";
import {label_E5, LABELS} from "../component/label.js";
import {getModPath, matchAnyMods} from "../util/mod.js";


export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_E6(data);
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
        const svg = await panel_E6(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_E6(data = {
    user: {},

    density: {},
    original: {},
    pp: [],
    attributes: {},
    expected: {},

    beatmap: {},
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

    // 导入文字
    const has_ranked_date = isNotEmptyString(data?.beatmap?.beatmapset?.ranked_date)
    const ranked_time = (has_ranked_date) ?
        'ranked time: ' + getFormattedTime(data.beatmap.beatmapset.ranked_date) :
        'updated time: ' + getFormattedTime(data.beatmap.last_updated)

    const delta_time = (has_ranked_date) ?
        getTimeDifference(data.beatmap.beatmapset.ranked_date) : getTimeDifference(data.beatmap.last_updated)

    const request_time = ranked_time + ' (' + delta_time + ') // request time: ' + getNowTimeStamp();

    svg = setText(svg, getPanelNameSVG('Map Statistics (!ymm)', 'M', request_time), reg_index);

    // 需要参数
    const mode = getGameMode(data?.expected?.mode, 0, data?.beatmap?.mode);
    const rank = rank2rank(getApproximateRankSP(data?.expected?.accuracy, data?.expected?.miss, mode, data?.expected?.mods));

    // 图片定义
    const background = getRankBG(rank);
    const banner = await getDiffBG(data?.beatmap?.id, data?.beatmap?.beatmapset?.id, 'cover', hasLeaderBoard(data?.beatmap.ranked),
        data?.beatmap?.beatmapset?.availability?.more_information != null);

    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    const componentE1 = component_E1(PanelEGenerate.score2componentE1(data.beatmap, mode));
    const componentE2 = component_E2(PanelEGenerate.score2componentE2(data.beatmap, data.density, rank));
    const componentE3 = component_E3(PanelEGenerate.score2componentE3(data.beatmap, data.original));
    const componentE4 = component_E4(PanelEGenerate.score2componentE4(data.beatmap));
    const componentE5 = component_E5(PanelEGenerate.score2componentE5(data.beatmap));
    const componentE6 = await component_E6(PanelEGenerate.score2componentE6(data.beatmap));
    const componentE7 = component_E7(PanelEGenerate.score2componentE7(data.beatmap, data.expected, data.attributes, data.pp));
    const componentE8 = component_E8(PanelEGenerate.score2componentE8(data.expected));
    const componentE9 = component_E9(PanelEGenerate.score2componentE9(data.beatmap, data.expected));
    const componentE10 = component_E10(PanelEGenerate.score2componentE10(data.beatmap, data.expected, data.pp));
    const componentE11 = await component_E11(PanelEGenerate.score2componentE11(data.beatmap));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = setSvgBody(svg, 40, 330, componentE1, reg_card_e1);
    svg = setSvgBody(svg, 40, 500, componentE2, reg_card_e1);
    svg = setSvgBody(svg, 40, 770, componentE3, reg_card_e1);
    svg = setSvgBody(svg, 550, 330, componentE4, reg_card_e2);
    svg = setSvgBody(svg, 1280, 330, componentE5, reg_card_e2);
    svg = setSvgBody(svg, 550, 880, componentE6, reg_card_e2);
    svg = setSvgBody(svg, 1390, 330, componentE7, reg_card_e3);
    svg = setSvgBody(svg, 1390, 500, componentE8, reg_card_e3);
    svg = setSvgBody(svg, 1390, 600, componentE9, reg_card_e3);
    svg = setSvgBody(svg, 1390, 770, componentE10, reg_card_e3);
    svg = setSvgBody(svg, 550, 290, componentE11, reg_card_e3);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.6);

    if (getFileSize(banner) / 1024 >= 500) {
        svg = setImage(svg, 0, 0, 1920, 330, banner, reg_banner, 0.8, "xMidYMin slice");
    } else {
        svg = setImage(svg, 0, 0, 1920, 330, banner, reg_banner, 0.8);
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
            text: rounds(star, 2).integer,
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: rounds(star, 2).decimal,
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

    svg = setText(svg, star_rrect, reg_star)
    svg = setTexts(svg, [ruleset, texts, title], reg_text);

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

    const public_rating = poppinsBold.getTextPath(round(data?.public_rating, 1) + ' / 10', 475, 28, 18, 'right baseline', '#fff');
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

    /*
    const fail_index = data.progress < 1 ? PanelDraw.Rect(20 + (457 * data.progress) + 1.5, 35, 3, 80, 1.5, '#ed6c9e') : '';

     */

    //中下的失败率重试率图像
    const rf_arr = data.fail_arr ? data.fail_arr.map(function (v, i) {
        return v + data.retry_arr[i];
    }) : [];
    const rf_max = Math.max.apply(Math, rf_arr);
    const retry = PanelDraw.BarChart(rf_arr, rf_max, 0,
        15, 235, 460, 80, 2, 0, '#f6d659');
    const fail = PanelDraw.BarChart(data.fail_arr, rf_max, 0,
        15, 235, 460, 80, 2, 0, '#ed6c9e');

    svg += (density + retry + fail + title1 + title2 + public_rating + percent);

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

            svg = setSvgBody(svg, 15 + 235 * i, 38 + 76 * j, e5, reg_label);
        }
    }

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = setTexts(svg, [title, rect], reg_label)

    return svg;
}

const component_E4 = (
    data = {
        image: ''
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

    svg = setImage(svg, 20, 5, 50, 50, data?.image, reg_status, 1);
    svg = setText(svg, rect, reg_base);

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

    const fav = poppinsBold.getTextPath(round(data?.favorite, 1, -1), 78, 25, 16, 'right baseline', '#fff')
    const pc = poppinsBold.getTextPath(round(data?.playcount, 1, -1), 78, 47, 16, 'right baseline', '#fff')

    svg = setTexts(svg, [fav, pc], reg_text);
    svg = setImage(svg, 12, 10 - 1, 18, 18, getImageFromV3('object-beatmap-favorite.png'), reg_text, 1);
    svg = setImage(svg, 12, 32, 18, 18, getImageFromV3('object-beatmap-playcount.png'), reg_text, 1);
    svg = setText(svg, rect, reg_base);

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
        is_dmca: false,
    }) => {
    let svg = `   <defs>
            <clipPath id="clippath-OE6-1">
                <rect id="BG_Base" x="0" y="0" width="820" height="160" rx="20" ry="20" style="fill: none;"/>
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
        data?.title || '', data?.title_unicode || '', data?.artist || '', 820 / 2, 55, 98, 48, 24, 820 - 20);

    const diff_text = poppinsBold.cutStringTail(data?.difficulty_name || '', 30,
        820 - 40 - 10
        - 2 * Math.max(
            poppinsBold.getTextWidth(poppinsBold.cutStringTail(data?.creator || '', 24, 240, true), 24),
            poppinsBold.getTextWidth('b' + (data?.bid || 0), 24)
        ), true)

    const diff = poppinsBold.getTextPath(diff_text, 820 / 2, 142, 30, 'center baseline', '#fff');
    const creator = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data?.creator || '', 24, 240, true),
        20, 142, 24, 'left baseline', '#fff');
    const bid = poppinsBold.getTextPath('b' + (data?.bid || 0), 820 - 20, 142, 24, 'right baseline', '#fff');

    const background = await getDiffBG(data?.bid, data?.sid, 'cover', hasLeaderBoard(data?.status), data.is_dmca);

    const rect = PanelDraw.Rect(0, 0, 820, 160, 20, '#382e32', 1);

    svg = setTexts(svg, [t.title, t.title_unicode, bid, creator, diff], reg_label);
    svg = setImage(svg, 0, 0, 820, 160, background, reg_background, 0.4);
    svg = setText(svg, rect, reg_base);

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

    const pf_percent = data?.perfect_pp > 0 ? (data?.pp / data?.perfect_pp) : 1;
    const fc_percent = data?.full_pp > 0 ? (data?.pp / data?.full_pp) : 1;

    let is_fc = data?.is_fc;

    const over = 460 - poppinsBold.getTextWidth(Math.round(data?.perfect_pp || 0).toString(), 24) - 30 < (460 * fc_percent);
    if (over) is_fc = true;

    let reference_pp; // 参考 PP，有时是 FC PP，有时是 SS PP

    let percent;
    let reference_pp_text;
    let fc_pp_text;
    let percent_type;

    if (getGameMode(data?.mode, 1) === 'm' && fc_percent < 0.95 && pf_percent < 0.95) {
        // mania 的争取 FC 模式
        reference_pp = data?.full_pp;

        percent = fc_percent;
        percent_type = 'FC'
        fc_pp_text = Math.round(data?.perfect_pp || 0);
    } else if (is_fc) {
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

    const is_perfect = (percent_type === 'SS' && Math.round(percent * 100) > 100 - 1e-7)
        || (Math.round(data?.perfect_pp || 0) - Math.round(data?.pp || 0)) < 1e-4

    if (is_perfect) {
        reference_pp_text = ' / PERFECT';
    } else {
        reference_pp_text = ' / ' + Math.round(reference_pp) + ' ' + percent_type + ' [' + Math.round(percent * 100) + '%]';
    }

    const fc_pp = poppinsBold.getTextPath(fc_pp_text, 475 - 15, 128, 24, 'right baseline', '#fff')

    const text_arr = [
        {
            font: "poppinsBold",
            text: Math.round(data?.pp || 0).toString(),
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

    svg = setTexts(svg, [texts, title, fc_pp], reg_text);

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

            svg = setText(svg, aim_rect, reg_clip2);
            svg = setText(svg, spd_rect, reg_clip3);
            svg = setText(svg, acc_rect, reg_clip4);
            svg = setText(svg, fl_rect, reg_clip5);
            svg = setTexts(svg, [aim_text, spd_text, acc_text, fl_text], reg_text);
            break;
        }

        case 't': {
            const sum = data?.diff_pp + data?.acc_pp || 0;

            const diff_width = getChildPPWidth(data?.diff_pp, sum, data?.pp, reference_pp);
            const acc_width = getChildPPWidth(data?.acc_pp, sum, data?.pp, reference_pp);

            const diff_rect = PanelDraw.Rect(15, 105, diff_width, 30, 15, "url(#grad-OE7-13)", 1);
            const acc_rect = PanelDraw.Rect(15, 105, diff_width + acc_width, 30, 15, "url(#grad-OE7-14)", 1);

            const diff_text = getChildPPPath(data?.diff_pp, 15, 128, 24, diff_width, diff_width, 10);
            const acc_text = getChildPPPath(data?.acc_pp, 15, 128, 24, diff_width + acc_width, acc_width, 10);

            svg = setText(svg, diff_rect, reg_clip3);
            svg = setText(svg, acc_rect, reg_clip4);
            svg = setTexts(svg, [diff_text, acc_text], reg_text);
            break;
        }
    }

    // 保底 PP
    const pp_width = (reference_pp > 0) ? ((data?.pp / reference_pp) * 460) : 460;
    const pp_rect = PanelDraw.Rect(15, 105, pp_width, 30, 15, "url(#grad-OE7-16)", 1);
    svg = setText(svg, pp_rect, reg_clip6);

    return svg;

    // 在有值的时候最低是 min_width，没有值则是 0
    // 注意！这个值加起来的和，总会比原来的成绩 PP 的宽度大一点点（因为最短限制为 30）
    function getChildPPWidth(child_pp = 0, child_sum_pp = 0, pp = 0, full_pp = 0, max_width = 460, min_width = 30) {
        const pp_width = (pp / full_pp) * max_width;
        const child_pp_width = (child_pp / child_sum_pp) * pp_width;
        return (child_pp > 0) ? Math.max(min_width, child_pp_width) : 0;
    }

    function getChildPPPath(child_pp = 0, x = 0, y = 0, size = 24, offset = 30, width = 30, interval = 0, max_width = 460) {
        const pp_str = Math.round(child_pp).toString();
        const shown = isTextShown('poppinsBold', child_pp, size, width, interval);
        const slight = isTextSlightlyWider('poppinsBold', child_pp, size, width, interval);

        return shown ?
            poppinsBold.getTextPath(pp_str, x + Math.min(offset, max_width) - interval, y, size, 'right baseline', '#382c32') :
            (slight ? poppinsBold.getTextPath(pp_str, x + Math.min(offset, max_width) - (1 / 2 * width), y, size, 'center baseline', '#382c32') : '');
    }

    // 宽度大于最大宽 + 2x 间距
    function isTextShown(font = 'poppinsBold', pp = 0, size = 24, width = 0, interval = 0) {
        return typeof pp === "number" && width > 0 && (width - 2 * interval >= getTextWidth(font, Math.round(pp).toString(), size));
    }

    // 宽度大于最大宽 - 1/2x 间距
    function isTextSlightlyWider(font = 'poppinsBold', pp = 0, size = 24, width = 0, interval = 0) {
        return typeof pp === "number" && width > 0 && (width + 1/2 * interval >= getTextWidth(font, Math.round(pp).toString(), size));
    }
};

const component_E8 = (
    data = {
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

    const title = poppinsBold.getTextPath('Mods', 15, 28, 18, 'left baseline');

    const rect = PanelDraw.Rect(0, 0, 490, 80, 20, '#382e32', 1);

    svg = setText(svg, mods, reg_mods);
    svg = setText(svg, title, reg_text);
    svg = setText(svg, rect, reg_base);

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
                text: rounds((data?.accuracy || 0) * 100, 2).integer,
                size: 60,
            },
            {
                font: 'poppinsBold',
                text: rounds((data?.accuracy || 0) * 100, 2).decimal + ' %',
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

    svg = setTexts(svg, [title, title2, accuracy, combo], reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E10 = (
    data = {
        statistics_nc: [],
        statistics_fc: [],
        statistics_max: 0,

        misses: 0,
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

    const title = poppinsBold.getTextPath('Acc / PP Graph', 15, 28, 18, 'left baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    const statistics_nc = getStatisticsSVG(data.statistics_nc, data.statistics_max, 64, 45, 360, 20, 16, 16) // 345
    const statistics_fc = getStatisticsSVG(data.statistics_fc, data.statistics_max, 64, 45, 360, 20, 16, 16) // 345

    let misses_text = 'miss : ' + (data.misses || '0');

    const misses = (data.misses > 0) ?
        poppinsBold.getTextPath(
            misses_text, 475, 28, 18, 'right baseline', '#fff'
        )
        : ''

    svg = setTexts(svg, [title, statistics_nc, statistics_fc, misses], reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E11 = async (
    data = {
        bid: 0,
        sid: 0,
        ranked: 'pending',
        is_dmca: false,
    }) => {
    let svg = `
            <defs>
                <clipPath id="clippath-OE11-1">
                    <polygon points="410 80 220 190 220 410 410 520 600 410 600 190 410 80" style="fill: none;"/>
                </clipPath>
            </defs>
        <g id="Base_OE11">
        </g>
        <g id="Background_OE11" style="clip-path: url(#clippath-OE11-1);">
        </g>
        <g id="Overlay_OE11">
        </g>
    `;

    const reg_overlay = /(?<=<g id="Overlay_OE11">)/;
    const reg_cover = /(?<=<g id="Background_OE11" style="clip-path: url\(#clippath-OE11-1\);">)/;
    const reg_base = /(?<=<g id="Base_OE11">)/;

    const cover = await getDiffBG(data?.bid, data?.sid, 'list@2x', hasLeaderBoard(data?.ranked), data.is_dmca);
    const hexagon = getImageFromV3('object-beatmap-hexagon.png')
    const base = getImageFromV3('object-beatmap-mask.png')

    svg = setImage(svg, 200, 75, 420, 450, hexagon, reg_overlay, 1)
    svg = setImage(svg, 220, 95, 380, 410, cover, reg_cover, 1)
    svg = setImage(svg, 200, 75, 420, 450, base, reg_base, 1)

    return svg;
}

// 私有转换方式
const PanelEGenerate = {
    score2componentE1: (b, mode) => {
        const sr = b?.difficulty_rating || 0;
        const name = getDifficultyIndex(b?.version, sr, mode)

        return {
            name: name,
            star: sr,
            mode: mode,
        }
    },

    score2componentE2: (b, density = [], rank) => {
        return {
            density_arr: density,
            retry_arr: b?.retries || [],
            fail_arr: b?.fails || [],

            star: b?.difficulty_rating || 0,

            public_rating: b?.beatmapset?.public_rating,

            pass: b?.passcount || 0,
            play: b?.playcount || 0,
            progress: 1,

            color: getRankColor(rank),
        }
    },

    score2componentE3: (b, original) => {
        const mode = getGameMode(b.mode, 1);

        const bpm = rounds(b?.bpm, 2)
        const bpm_r = (b?.bpm > 0) ? (60000 / b?.bpm).toFixed(0) + 'ms' : '-';
        const bpm_b = bpm.integer
        const bpm_m = bpm.decimal
        const bpm_p = getProgress(b?.bpm, 90, 270);

        const length_r = Math.floor(b?.total_length / 60) + ':' + (b?.total_length % 60).toFixed(0).padStart(2, '0');
        const length_b = Math.floor(b?.hit_length / 60) + ':';
        const length_m = (b?.hit_length % 60).toFixed(0).padStart(2, '0');
        const length_p = getProgress(b?.hit_length, 30, 270);

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
                hp_mid = 8;
                hp_max = 9;
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
                ...stat2label(b?.cs, cs2px(b?.cs, mode),
                    getProgress(b?.cs, cs_min, cs_max), original.cs, isDisplayCS),
                bar_min: cs_min,
                bar_mid: cs_mid,
                bar_max: cs_max,
            },{
                ...LABELS.AR,
                ...stat2label(b?.ar, ar2ms(b?.ar, mode),
                    getProgress(b?.ar, ar_min, ar_max), original.ar, isDisplayAR),
                bar_min: ar_min,
                bar_mid: ar_mid,
                bar_max: ar_max,
            },{
                ...LABELS.OD,
                ...stat2label(b?.od, od2ms(b?.od, mode),
                    getProgress(b?.od, od_min, od_max), original.od, isDisplayOD),
                bar_min: od_min,
                bar_mid: od_mid,
                bar_max: od_max,
            },{
                ...LABELS.HP,
                ...stat2label(b?.hp, '-',
                    getProgress(b?.hp, hp_min, hp_max), original.hp, true),
                bar_min: hp_min,
                bar_mid: hp_mid,
                bar_max: hp_max,
            }]
        };
    },

    score2componentE4: (b) => {
        return {
            image: getMapStatusImage(b?.ranked)
        }
    },

    score2componentE5: (b) => {
        return {
            favorite: b?.beatmapset?.favourite_count || 0,
            playcount: b?.beatmapset?.play_count || 0,
        }
    },

    score2componentE6: (b) => {
        let creators = ''
        const owners = b?.owners || []
        if (isEmptyArray(owners)) {
            creators = b?.beatmapset?.creator || ''
        } else {
            for (const o of owners) {
                creators += (o?.username || ('U' + (o?.id || '?'))) + ', '
            }

            creators = creators.slice(0, -2)
        }

        return {
            title: b?.beatmapset?.title || '',
            title_unicode: b?.beatmapset?.title_unicode || '',
            artist: b?.beatmapset?.artist || '',
            difficulty_name: getKeyDifficulty(b) || '',
            bid: b?.id || 0,
            sid: b?.beatmapset?.id || 0,
            creator: creators,
            status: b?.status || 'pending',
            is_dmca: b?.beatmapset?.availability?.more_information != null
        }
    },

    score2componentE7: (b, expected, attr, pp) => {
        const is_fc = (expected?.combo / b?.max_combo) > 0.98
            || getGameMode(expected?.mode, 1) === 'm'
            || getGameMode(expected?.mode, 1) === 't'

        return {
            pp: attr?.pp || 0,
            full_pp: pp[0] || 0,
            perfect_pp: pp[1] || 0,

            aim_pp: attr?.pp_aim || 0,
            spd_pp: attr?.pp_speed || 0,
            acc_pp: attr?.pp_acc || 0,
            fl_pp: attr?.pp_flashlight || 0,
            diff_pp: attr?.pp_difficulty || 0,

            is_fc: is_fc,

            mode: b?.mode,
        }
    },

    score2componentE8: (expected) => {
        return {
            mods: expected?.mods || [],
        }
    },

    score2componentE9: (b, expected) => {
        return {
            accuracy: expected?.accuracy || 0,
            combo: expected?.combo || 0,
            max_combo: b.max_combo || 0,
        }
    },

    score2componentE10: (b, expected, pp) => {
        return {
            statistics_nc: expectedNC2Statistics(pp),
            statistics_fc: expectedFC2Statistics(pp),
            statistics_max: getStatMax(pp),

            misses: expected.misses || 0,
            mode: b?.mode,
        }
    },

    score2componentE11: (b) => {
        return {
            bid: b?.id,
            sid: b?.beatmapset?.id || b?.beatmap.beatmapset_id,
            ranked: b?.ranked,
            is_dmca: b?.beatmapset?.availability?.more_information != null
        }
    },
}

//SS和X的转换
const rank2rank = (rank = 'SS') => {
    switch (rank) {
        case "SS": return 'X';
        case "SSH": return 'XH';
        default: return rank;
    }
}

const getApproximateRankSP = (acc = 1, miss = 0, mode = 'osu', mods = [{acronym: ''}]) => {
    let rank = 'F';
    const hasMiss = miss > 0;

    switch (getGameMode(mode, 1)) {
        case 'o' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc >= 0.9317) {
                if (hasMiss) {
                    rank = 'A';
                } else {
                    rank = 'S';
                }
            } else if (acc >= 0.8333) {
                if (hasMiss) {
                    rank = 'B';
                } else {
                    rank = 'A';
                }
            } else if (acc >= 0.75) {
                if (hasMiss) {
                    rank = 'C';
                } else {
                    rank = 'B';
                }
            } else if (acc >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;

        case 't' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc >= 0.95) {
                if (hasMiss) {
                    rank = 'A';
                } else {
                    rank = 'S';
                }
            } else if (acc >= 0.9) {
                if (hasMiss) {
                    rank = 'B';
                } else {
                    rank = 'A';
                }
            } else if (acc >= 0.8) {
                if (hasMiss) {
                    rank = 'C';
                } else {
                    rank = 'B';
                }
            } else if (acc >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;

        case 'c' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc > 0.98) {
                rank = 'S';
            } else if (acc > 0.94) {
                rank = 'A';
            } else if (acc > 0.90) {
                rank = 'B';
            } else if (acc > 0.85) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;

        case 'm' : {

            if (acc === 1) {
                rank = 'SS';
            } else if (acc >= 0.95) {
                rank = 'S';
            } else if (acc >= 0.90) {
                rank = 'A';
            } else if (acc >= 0.80) {
                rank = 'B';
            } else if (acc >= 0.70) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        } break;
    }

    const isSilver = matchAnyMods(mods, ['HD', 'FI', 'FL', 'BL'])
    if ((rank === 'SS' || rank === 'S') && isSilver) rank += 'H';

    return rank;
}

// bottom: 保底
const getProgress = (x, min, max, bottom = 1 / 16) => {
    const result = (Math.min(Math.max(x, min), max) - min) / (max - min)

    return Math.max(result, bottom);
}

const stat2label = (stat, remark, progress, original, isDisplay) => {
    const hasChanged = Math.abs(original - stat) > 0.1;

    const stat_number = rounds(stat, 1)

    const stat_b = stat_number.integer
    const stat_m = stat_number.decimal

    if (isDisplay) return {
        remark: remark,
        data_b: stat_b,
        data_m: stat_m,
        data_a: hasChanged ? (' [' + round(original, 1) + ']') : '',
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
const getModsSVG = (mods = [{ acronym: '' }], x, y, mod_w, text_h, interval) => {
    let svg = '';

    const length = mods ? mods.length : 0;

    let multiplier = 1

    if (length > 0 && length <= 2) {
        multiplier = 2
    } else if (length > 2 && length <= 4) {
        multiplier = 5/4
    } else if (length > 4 && length <= 6) {
        multiplier = 1
    } else if (length > 6 && length <= 8) {
        multiplier = 2/3
    } else if (length > 8) {
        multiplier = 7/12
    }

    mods.forEach((v, i) => {
        svg += getModPath(v, x + (i - (length - 1)) * multiplier * interval, y, mod_w, text_h, true);
    });

    return svg;
}

const getStatMax = (pp) => {
    let max = 0

    for (const p of pp) {
        max = Math.max(max, p);
    }

    return max;
}

const expectedFC2Statistics = (pp) => {
    let statistics = [];
    statistics.push({
        index: '100',
        stat: Math.round(pp[1]),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#88C5F3',
    }, {
        index: '99',
        stat: Math.round(pp[2]),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#8CC4C1',
    }, {
        index: '98',
        stat: Math.round(pp[3]),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#8FC295',
    }, {
        index: '96',
        stat: Math.round(pp[4]),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#A7CE95',
    }, {
        index: '94',
        stat: Math.round(pp[5]),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#C4DB95',
    }, {
        index: '92',
        stat: Math.round(pp[6]),
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#FFF995',
    });
    return statistics;
}

const expectedNC2Statistics = (pp = []) => {
    let statistics = [];
    statistics.push({
        index: '100',
        stat: Math.round(pp[7]),
        index_color: '#fff',
        stat_color: 'none',
        rrect_color: '#55B1EF',
    }, {
        index: '99',
        stat: Math.round(pp[8]),
        index_color: '#fff',
        stat_color: 'none',
        rrect_color: '#5EB0AB',
    }, {
        index: '98',
        stat: Math.round(pp[9]),
        index_color: '#fff',
        stat_color: 'none',
        rrect_color: '#62AE70',
    }, {
        index: '96',
        stat: Math.round(pp[10]),
        index_color: '#fff',
        stat_color: 'none',
        rrect_color: '#88BD6F',
    }, {
        index: '94',
        stat: Math.round(pp[11]),
        index_color: '#fff',
        stat_color: 'none',
        rrect_color: '#ADCE6D',
    }, {
        index: '92',
        stat: Math.round(pp[12]),
        index_color: '#fff',
        stat_color: 'none',
        rrect_color: '#FFF767',
    });
    return statistics;
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
