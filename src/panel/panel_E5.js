import {
    exportJPEG, getDecimals, getDiffBG, getGameMode, getImageFromV3,
    getNowTimeStamp,
    getPanelNameSVG, getRoundedNumberStr, getRoundedNumberStrLarge, getRoundedNumberStrSmall,
    getTimeDifference, implantImage, implantSvgBody,
    readTemplate,
    replaceText, replaceTexts
} from "../util/util.js";
import moment from "moment";
import {getApproximateRank, hasLeaderBoard} from "../util/star.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {extra, getMultipleTextPath, poppinsBold} from "../util/font.js";
import {getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {LABELS} from "../component/label.js";
import {ar2ms, cs2px, od2ms, stat2DataM} from "./panel_E.js";

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
    let svg = readTemplate('template/Panel_E5.svg');

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_e1 = /(?<=<g id="Card_E1">)/;
    const reg_card_e2 = /(?<=<g id="Card_E2">)/;
    const reg_card_e3 = /(?<=<g id="Card_E3">)/;
    const reg_card_e4 = /(?<=<g id="Card_E4">)/;

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
    svg = replaceText(svg, getPanelNameSVG('Score (!ymp / !ymr / !yms)', 'S', 'v0.4.0 UU', request_time), reg_index);


    // 图片定义
    const background = getImageFromV3('object-score-backimage-' + (data?.score?.rank || getApproximateRank(data?.score)) + '.jpg');
    const banner = await getDiffBG(data?.score?.beatmap?.id, data?.score?.beatmapset?.id, 'cover', hasLeaderBoard(data.score.beatmap.ranked));

    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    const componentE1 = component_E1(PanelEGenerate.score2componentE1(data.score));
    const componentE2 = component_E2(PanelEGenerate.score2componentE2(data.score, data.density, data.progress));
    const componentE3 = component_E3(PanelEGenerate.score2componentE3(data.score, data.original));

    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    svg = implantSvgBody(svg, 40, 330, componentE1, reg_card_e1);
    svg = implantSvgBody(svg, 40, 500, componentE2, reg_card_e2);
    svg = implantSvgBody(svg, 40, 770, componentE3, reg_card_e3);

    // 导入图片
    svg = implantImage(svg, 1920, 1080, 0, 0, 0.4, background, reg_background);
    svg = implantImage(svg, 1920, 330, 0, 0, 0.6, banner, reg_banner);

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
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE1-3); fill-opacity: 0.8"/>
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

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            const e5 = labels[i + j];
            svg = implantSvgBody(svg, 15 + 235 * i, 38 + 76 * j, e5, reg_label);
        }
    }

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

            public_rating: score?.beatmap?.beatmapset?.publicRating,

            pass: score?.beatmap?.passcount || 0,
            play: score?.beatmap?.playcount || 0,
            progress: progress,

            color: getRankColor(score.rank),
        }
    },

    score2componentE3: (score, original) => {
        const mode = getGameMode(score.mode, 1);


        const bpm_r = (score?.bpm > 0) ? (60000 / score?.bpm).toFixed(0) + 'ms' : '-';
        const bpm_b = getDecimals(score?.bpm, 2);
        const bpm_m = getDecimals(score?.bpm, 3);
        const bpm_p = getProgress(score?.bpm, 120, 240);

        const length_r = Math.floor(score?.total_length / 60) + ':' + (score?.total_length % 60).toFixed(0).padStart(2, '0');
        const length_b = Math.floor(score?.drain / 60) + ':';
        const length_m = (score?.drain % 60).toFixed(0).padStart(2, '0');
        const length_p = getProgress(score?.drain, 30, 210);

        let isDisplayCS = true;
        let isDisplayAR = true;
        let isDisplayOD = true;

        switch (mode) {
            case 't' : isDisplayAR = false; isDisplayCS = false; break;
            case 'c' : isDisplayOD = false; break;
            case 'm' : isDisplayAR = false; break;
        }

        const cs_r = cs2px(score?.cs, mode);
        const cs_b = getDecimals(score?.cs, 2);
        const cs_m = stat2DataM(hasCSChanged, calcPP.attr.cs, score.beatmap.cs);

        const ar_r = ar2ms(calcPP.attr.ar, mode);
        const ar_b = getDecimals(calcPP.attr.ar, 2);
        const ar_m = stat2DataM(hasARChanged, calcPP.attr.ar, score.beatmap.ar);

        const od_r = od2ms(calcPP.attr.od, mode);
        const od_b = getDecimals(calcPP.attr.od, 2);
        const od_m = stat2DataM(hasODChanged, calcPP.attr.od, score.beatmap.accuracy);

        const hp_r = '-';
        const hp_b = getDecimals(calcPP.attr.hp, 2);
        const hp_m = stat2DataM(hasHPChanged, calcPP.attr.hp, score.beatmap.drain);

        return {
            labels: [{
                ...LABELS.BPM,
                ...stat2label(bpm_r, bpm_b, bpm_m, true),
            },{
                ...LABELS.LENGTH,
                ...stat2label(length_r, length_b, length_m, true),
            },{
                ...LABELS.CS,
                ...stat2label(cs_r, cs_b, cs_m, isDisplayCS),
            },{
                ...LABELS.AR,
                ...stat2label(ar_r, ar_b, ar_m, isDisplayAR),
            },{
                ...LABELS.OD,
                ...stat2label(od_r, od_b, od_m, isDisplayOD),
            },{
                ...LABELS.HP,
                ...stat2label(hp_r, hp_b, hp_m, true),
            }]
        };
    },
}

// bottom: 保底
const getProgress = (x, min, max, bottom = 1 / 16) => {
    const result = (Math.min(Math.max(x, min), max) - min) / (max - min)

    return Math.max(result, bottom);
}

const stat2label = (data, original, isDisplay) => {

    const hasCSChanged = Math.abs(original - data) > 0.1

    const stat_b = getDecimals(data, 2);
    const stat_m = stat2DataM(hasCSChanged, calcPP.attr.cs, score.beatmap.cs);

    if (isDisplay) return {
        remark: remark,
        data_b: data_b,
        data_m: data_m,
    }
    else return {
        remark: '-',
        data_b: '-',
        data_m: '',
    }
}

