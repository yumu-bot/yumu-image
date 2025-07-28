import {
    exportJPEG,
    getBeatMapTitlePath,
    getGameMode,
    getImageFromV3,
    getMapStatusImage,
    getNowTimeStamp,
    getPanelNameSVG,
    getTimeDifference,
    setImage,
    setSvgBody,
    readTemplate,
    setText,
    setTexts,
    getFileSize,
    od2ms,
    ar2ms,
    cs2px,
    isNotBlankString,
    isNotNumber,
    getKeyDifficulty,
    isNumber,
    floors,
    floor, getFormattedTime, isEmptyArray, getDifficultyIndex, getDiffBackground, rounds, getSvgBody
} from "../util/util.js";
import {
    getRankBackground, getScoreTypeImage
} from "../util/star.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {extra, getMultipleTextPath, getTextWidth, poppinsBold, PuHuiTi} from "../util/font.js";
import {getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {label_E5, LABELS} from "../component/label.js";
import {getModMultiplier, getModPath} from "../util/mod.js";

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
    panel: "",
    user: {},

    density: {},
    progress: 1,
    original: {},
    attributes: {
        effective_miss_count: 1.0078382838283828,
        pp: 201.40540077771928,
        pp_acc: 51.6400779167333,
        pp_aim: 85.3547123277813,
        pp_flashlight: 0,
        pp_speed: 56.031742770816585,
        pp_difficulty: 0,
        stars: 5.359699675204284,
        full_pp: 221.08364861738923,
        perfect_pp: 238.41765087602147
    },

    score: {
        mods: [],
        mode: 'OSU',
        pp: 5.7076308198503005,
        classic_total_score: 319362,
        preserve: true,
        processed: true,
        ranked: false,
        maximum_statistics: {
            perfect: 0,
            great: 116,
            good: 0,
            ok: 0,
            meh: 0,
            miss: 0,
            ignore_hit: 68,
            ignore_miss: 0,
            large_tick_hit: 10,
            large_tick_miss: 0,
            small_tick_hit: 0,
            small_tick_miss: 0,
            slider_tail_hit: 68,
            large_bonus: 20,
            small_bonus: 0
        },
        statistics: {
            perfect: 0,
            great: 104,
            good: 0,
            ok: 3,
            meh: 5,
            miss: 4,
            ignore_hit: 68,
            ignore_miss: 10,
            large_tick_hit: 8,
            large_tick_miss: 2,
            small_tick_hit: 0,
            small_tick_miss: 0,
            slider_tail_hit: 66,
            large_bonus: 12
        },
        total_score_without_mods: 593320,
        beatmap_id: 3787814,
        best_id: 0,
        id: 3706199494,
        rank: 'A',
        type: 'solo_score',
        user_id: 7003013,
        accuracy: 0.924724,
        // 这个是否为空可以判断成绩的种类
        build_id: 7739,
        ended_at: '2024-10-19T08:02:52Z',
        is_perfect_combo: false,
        legacy_perfect: false,
        legacy_score_id: 0,
        legacy_total_score: 0,
        max_combo: 86,
        passed: true,
        ruleset_id: 0,
        started_at: '2024-10-19T08:02:06Z',
        total_score: 593320,
        replay: false,
        current_user_attributes: {pin: null},
        beatmap: {
            id: 3787814,
            mode: 'osu',
            status: 'graveyard',
            retries: [Array],
            fails: [Array],
            convert: false,
            ranked: -2,
            url: 'https://osu.ppy.sh/beatmaps/3787814',
            retry: 0,
            fail: 27,
            ar: 7,
            od: 5,
            cs: 3.5,
            bpm: 185,
            beatMapID: 3787814,
            hp: 4,
            previewName: 'MixBadGun - NMDB to the Black World (Muziyami) [H*rd]',
            beatmapset_id: 1844042,
            difficulty_rating: 2.8238842,
            total_length: 37,
            user_id: 7003013,
            version: 'H*rd',
            beatmapset: [Object],
            checksum: 'a681f568d6b66a2b770d3a1fe76ddece',
            max_combo: 194,
            accuracy: 5,
            count_circles: 47,
            count_sliders: 68,
            count_spinners: 1,
            drain: 4,
            hit_length: 37,
            is_scoreable: false,
            last_updated: '2022-09-27T12:45:10Z',
            mode_int: 0,
            passcount: 100,
            playcount: 188,
            owners: [
                {
                    "id": 1653229,
                    "username": "_Stan"
                },
                {
                    "id": 3793196,
                    "username": "Critical_Star"
                },
                {
                    "id": 6117525,
                    "username": "ruka"
                },
                {
                    "id": 7082178,
                    "username": "[Crz]Satori"
                },
                {
                    "id": 7590894,
                    "username": "ExNeko"
                },
                {
                    "id": 10125072,
                    "username": "U1d"
                },
                {
                    "id": 10500832,
                    "username": "[Crz]xz1z1z"
                },
                {
                    "id": 13026904,
                    "username": "tyrcs"
                }
            ]

        },
        beatmapset: {
            artist: 'MixBadGun',
            covers: [Object],
            creator: 'Muziyami',
            nsfw: false,
            offset: 0,
            source: '',
            spotlight: false,
            status: 'graveyard',
            title: 'NMDB to the Black World',
            video: true,
            ranked: -2,
            storyboard: false,
            tags: 'vocaloid 黒塗り世界宛て書簡 致涂黑世界的书信 重音テトkasane teto フロクロ frog96 furokuro kuronuri sekai ate shokan nanban dainuno nan man da bu letter to the black world 玄景龙 mc 喊麦 快手 youtube poop music ytpmv otomad 音mad 鬼畜 bilibili chinese japanese pop ballad meme nmdbrrc cut short version',
            ratings: [Array],
            mappers: [],
            nominators: [],
            public_rating: 0,
            bpm: 185,
            sid: 1844042,
            artist_unicode: '坏枪',
            favourite_count: 5,
            id: 1844042,
            play_count: 1270,
            preview_url: '//b.ppy.sh/preview/1844042.mp3',
            title_unicode: '黒塗り世界宛て南蛮大布',
            user_id: 7003013,
            can_be_hyped: false,
            discussion_locked: false,
            is_scoreable: false,
            last_updated: 1664282709,
            legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/1641939',
            nominations_summary: [Object],
            submitted_date: 1662537776,
            availability: [Object]
        },

        legacy_rank: 'F',
        legacy_accuracy: 0.0,

        user: {},
    },

    position: 0,

}) {
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');

    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_index_plus = /(?<=<g id="IndexPlus">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_e1 = /(?<=<g id="Card_E1">)/;
    const reg_card_e2 = /(?<=<g id="Card_E2">)/;
    const reg_card_e3 = /(?<=<g id="Card_E3">)/;

    const is_lazer = data?.score?.is_lazer
    svg = setImage(svg, 1725, 220, 170, 70, getScoreTypeImage(is_lazer, 2, data?.score?.type), reg_index_plus, 1)

    // 面板文字
    let score_time;
    let delta_time;

    if (data?.score?.ended_at != null) {
        score_time = getFormattedTime(data?.score?.ended_at)
        delta_time = getTimeDifference(data?.score?.ended_at)
    } else {
        score_time = getFormattedTime(data?.score?.started_at)
        delta_time = getTimeDifference(data?.score?.started_at)
    }

    let request_time = ''

    if (data.position != null && data.position > 0) {
        request_time += 'position: #' + data.position + ' // '
    }

    request_time += 'score time: ' + score_time + ' (' + delta_time + ') // request time: ' + getNowTimeStamp();

    let panel_name

    switch (data?.panel) {
        case "B": {
            panel_name = getPanelNameSVG('Best Score (!ymb)', 'B', request_time);
        } break;
        case "P": {
            panel_name = getPanelNameSVG('Passed Score (!ymp)', 'P', request_time);
        } break;
        case "R": {
            panel_name = getPanelNameSVG('Recent Score (!ymr)', 'R', request_time);
        } break;
        case "S": {
            panel_name = getPanelNameSVG('Score (!yms)', 'S', request_time);
        } break;
        case "L": {
            panel_name = getPanelNameSVG('Leader Board (!yml)', 'L', request_time);
        } break;
        case "T": {
            panel_name = getPanelNameSVG('Today Bests (!ymt)', 'T', request_time);
        } break;
        default: {
            panel_name = getPanelNameSVG('Excellent Score (!ymp / !ymr / !yms)', 'S', request_time);
        } break;
    }

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    // 评级
    const rank = data?.score?.legacy_rank
    svg = setImage(svg, 665, 290, 590, 590, getImageFromV3(`object-score-${rank}2.png`), reg_index, 1);

    // 图片定义
    const background = getRankBackground(rank, data?.score?.passed);
    const banner = await getDiffBackground(data?.score, 'cover');

    // 卡片定义
    const cardA1 = await card_A1(await PanelGenerate.user2CardA1(data.user));
    const componentE1 = component_E1(PanelEGenerate.score2componentE1(data.score));
    const componentE2 = component_E2(PanelEGenerate.score2componentE2(data.score, data.density, data.progress));
    const componentE3 = component_E3(PanelEGenerate.score2componentE3(data.score, data.original));
    const componentE4 = component_E4(PanelEGenerate.score2componentE4(data.score));
    const componentE5 = component_E5(PanelEGenerate.score2componentE5(data.score));
    const componentE6 = component_E6(await PanelEGenerate.score2componentE6(data.score));
    const componentE7 = component_E7(PanelEGenerate.score2componentE7(data.score, data.attributes));
    const componentE8 = component_E8(PanelEGenerate.score2componentE8(data.score, is_lazer));
    const componentE9 = component_E9(PanelEGenerate.score2componentE9(data.score));
    const componentE10 = component_E10(PanelEGenerate.score2componentE10(data.score, data.attributes, data.progress, is_lazer));
    const componentE10P = component_E10P(PanelEGenerate.score2componentE10P(data.score));

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
    svg = setSvgBody(svg, 1390, 770, componentE10P, reg_card_e3);
    svg = setSvgBody(svg, 1390, 770, componentE10, reg_card_e3);

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
            text: floors(star, 2).integer,
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: floors(star, 2).decimal,
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

    const public_rating = poppinsBold.getTextPath(floor(data?.public_rating, 1) + ' / 10', 475, 28, 18, 'right baseline', '#fff');
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

    let string_e5s = ''

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            const e5 = label_E5(labels[i + 2 * j]);

            string_e5s += getSvgBody(15 + 235 * i, 38 + 76 * j, e5);
        }
    }

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = setTexts(svg, [string_e5s, title, rect], reg_label)

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

    const fav = poppinsBold.getTextPath(floor(data?.favorite, 1, -1), 78, 25, 16, 'right baseline', '#fff')
    const pc = poppinsBold.getTextPath(floor(data?.playcount, 1, -1), 78, 47, 16, 'right baseline', '#fff')

    svg = setTexts(svg, [fav, pc], reg_text);
    svg = setImage(svg, 12, 10 - 1, 18, 18, getImageFromV3('object-beatmap-favorite.png'), reg_text, 1);
    svg = setImage(svg, 12, 32, 18, 18, getImageFromV3('object-beatmap-playcount.png'), reg_text, 1);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E6 = (
    data = {
        title: '',
        title_unicode: '',
        artist: '',
        difficulty_name: '',
        creator: '',
        bid: 0,
        sid: 0,
        background: '',
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

    const background = data?.background;

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
        fl_pp: 0,
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
                text: floors(data?.score, -4, (data?.mods.length <= 4) ? 1 : 0).integer,
                size: 56,
            },
            {
                font: 'poppinsBold',
                text: floors(data?.score, -4, (data?.mods.length <= 4) ? 1 : 0).decimal,
                size: 36,
            }
        ],
        20, 62, 'left baseline')

    const title = (data?.mods.length > 0) ? '' : poppinsBold.getTextPath('Score', 475, 28, 18, 'right baseline');

    const rect = PanelDraw.Rect(0, 0, 490, 80, 20, '#382e32', 1);

    svg = setText(svg, mods, reg_mods);
    svg = setTexts(svg, [title, score], reg_text);
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
                text: floors((data?.accuracy || 0) * 100, 2).integer,
                size: 60,
            },
            {
                font: 'poppinsBold',
                text: floors((data?.accuracy || 0) * 100, 2).decimal + ' %',
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
        statistics: [],
        statistics_max: [],
        statistics_full: [],

        effective_miss_count: 0,
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

    const title = poppinsBold.getTextPath('Judgment', 15, 28, 18, 'left baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    const statistics = getStatisticsSVG(data.statistics, data.statistics_max, data.statistics_full, 64, 45, 360, 20, 16, 16) // 345

    let ratio_text;

    if (data.ratio === Infinity) {
        ratio_text = 'Infinity'
    } else if (data.ratio === 0) {
        ratio_text = '0'
    } else if (data.ratio < 0.9) {
        ratio_text = ('1 : ' + floor(1 / data.ratio, 1))
    } else if (data.ratio <= 1) {
        ratio_text = ('1 : ' + floor(1 / data.ratio, 2))
    } else if (data.ratio <= 1.1) {
        ratio_text = (floor(data.ratio, 2) + ' : 1')
    } else {
        ratio_text = (floor(data.ratio, 1) + ' : 1')
    }

    const perfect_great_ratio = (getGameMode(data?.mode, 1) === 'm') ?
        poppinsBold.getTextPath(
            'MAX : 300 = ' + ratio_text, 475, 28, 18, 'right baseline', '#fff'
        )
        : ''

    const is_effective_miss_shown =
        (getGameMode(data?.mode, 1) === 'o' || getGameMode(data?.mode, 1) === 't')
        && isNumber(data?.effective_miss_count)
        && (Math.abs(data?.effective_miss_count - Math.round(data?.effective_miss_count)) > 1e-3)

    const effective_miss_text = 'equivalent miss: ' + floor(data?.effective_miss_count || 0, 2)

    const effective_miss = is_effective_miss_shown ?
        poppinsBold.getTextPath(
            effective_miss_text, 475, 28, 18, 'right baseline', '#fff'
        )
        : ''

    svg = setTexts(svg, [title, statistics, perfect_great_ratio, effective_miss], reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E10P = (
    data = {
        mode: '',
        rainbow_rank: '',
        rainbow_crown: ''
    }) => {
    let svg = `
        <g id="Crown_OE11">
        </g>
        <g id="Rank_OE11">
        </g>
    `;
    if (data?.mode !== 1) return ''

    const reg_rank = /(?<=<g id="Rank_OE11">)/;
    const reg_crown = /(?<=<g id="Crown_OE11">)/;

    svg = isNotBlankString(data?.rainbow_rank) ?
        setImage(svg, 20, 160, 100, 100, getImageFromV3(data?.rainbow_rank), reg_rank, 1) :
        setImage(svg, 20, 160, 100, 100, getImageFromV3(data?.rainbow_crown), reg_crown, 1)
    svg = isNotBlankString(data?.rainbow_rank) ?
        setImage(svg, 140, 160, 100, 100, getImageFromV3(data?.rainbow_crown), reg_crown, 1) : svg

    return svg.toString();
}


// 私有转换方式
const PanelEGenerate = {
    score2componentE1: (score) => {
        const sr = score?.beatmap.difficulty_rating || 0;
        const mode = score?.mode || 'osu';
        const name = getDifficultyIndex(score?.beatmap?.version, sr, mode, score?.mods)

        return {
            name: name,
            star: sr,
            mode: mode,
        }
    },

    score2componentE2: (score, density = [], progress = 0) => {
        return {
            density_arr: density,
            retry_arr: score?.beatmap?.retries || [],
            fail_arr: score?.beatmap?.fails || [],

            star: score?.beatmap?.difficulty_rating || 0,

            public_rating: score?.beatmap?.beatmapset?.public_rating,

            pass: score?.beatmap?.passcount || 0,
            play: score?.beatmap?.playcount || 0,
            progress: progress,

            color: getRankColor(score.legacy_rank),
        }
    },

    score2componentE3: (score, original) => {
        const mode = getGameMode(score?.ruleset_id, 1);

        const bpm = rounds(score?.beatmap?.bpm, 2)
        const bpm_r = (score?.beatmap?.bpm > 0) ? (60000 / score?.beatmap?.bpm).toFixed(0) + 'ms' : '-';
        const bpm_b = bpm.integer
        const bpm_m = bpm.decimal
        const bpm_p = getProgress(score?.beatmap?.bpm, 90, 270);

        const length_r = Math.floor(score?.beatmap?.total_length / 60) + ':' + (score?.beatmap?.total_length % 60).toFixed(0).padStart(2, '0');
        const length_b = Math.floor(score?.beatmap?.hit_length / 60) + ':';
        const length_m = (score?.beatmap?.hit_length % 60).toFixed(0).padStart(2, '0');
        const length_p = getProgress(score?.beatmap?.hit_length, 30, 270);

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
            }
                break;
            case 'c' : {
                od_min = 0;
                od_mid = 0;
                od_max = 0;
                isDisplayOD = false;
            }
                break;
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
            }
                break;
        }

        return {
            labels: [{
                ...LABELS.BPM,
                remark: bpm_r,
                data_b: bpm_b,
                data_m: bpm_m,
                data_a: '',
                bar_progress: bpm_p,
            }, {
                ...LABELS.LENGTH,
                remark: length_r,
                data_b: length_b,
                data_m: length_m,
                data_a: '',
                bar_progress: length_p,
            },  {
                ...((mode === 'm') ? LABELS.KEY : LABELS.CS),
                ...stat2label(score?.beatmap?.cs, cs2px(score?.beatmap?.cs, mode),
                    getProgress(score?.beatmap?.cs, cs_min, cs_max), original.cs, isDisplayCS),
                bar_min: cs_min,
                bar_mid: cs_mid,
                bar_max: cs_max,
            }, {
                ...LABELS.AR,
                ...stat2label(score?.beatmap?.ar, ar2ms(score?.beatmap?.ar, mode),
                    getProgress(score?.beatmap?.ar, ar_min, ar_max), original.ar, isDisplayAR),
                bar_min: ar_min,
                bar_mid: ar_mid,
                bar_max: ar_max,
            }, {
                ...LABELS.OD,
                ...stat2label(score?.beatmap?.od, od2ms(score?.beatmap?.od, mode),
                    getProgress(score?.beatmap?.od, od_min, od_max), original.od, isDisplayOD),
                bar_min: od_min,
                bar_mid: od_mid,
                bar_max: od_max,
            }, {
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

    score2componentE6: async (score) => {
        let creators = ''
        const owners = score?.beatmap?.owners || []
        if (isEmptyArray(owners)) {
            creators = score?.beatmapset?.creator || ''
        } else {
            for (const o of owners) {
                creators += (o?.username || ('U' + (o?.id || '?'))) + ', '
            }

            creators = creators.slice(0, -2)
        }

        return {
            title: score?.beatmapset?.title || '',
            title_unicode: score?.beatmapset?.title_unicode || '',
            artist: score?.beatmapset?.artist || '',
            difficulty_name: getKeyDifficulty(score?.beatmap),
            bid: score?.beatmap?.id || 0,
            sid: score?.beatmapset?.id || 0,
            background: await getDiffBackground(score, 'cover'),
            creator: creators,
            status: score?.beatmap?.status || 'pending',
        }
    },

    score2componentE7: (score, attr) => {
        const is_fc = (score?.max_combo / score?.beatmap?.max_combo) > 0.98
            || getGameMode(score?.ruleset_id, 1) === 'm'
            || getGameMode(score?.ruleset_id, 1) === 't'

        return {
            pp: score?.pp || 0,
            full_pp: attr?.full_pp || 0,
            perfect_pp: attr?.perfect_pp || 0,

            aim_pp: attr?.pp_aim || 0,
            spd_pp: attr?.pp_speed || 0,
            acc_pp: attr?.pp_acc || 0,
            fl_pp: attr?.pp_flashlight || 0,
            diff_pp: attr?.pp_difficulty || 0,

            is_fc: is_fc,

            mode: score?.ruleset_id,
        }
    },

    score2componentE8: (score, is_lazer = false) => {
        return {
            score: is_lazer ? (score?.total_score || 0) : (score?.legacy_total_score || 0),
            mods: score?.mods || [],
        }
    },

    score2componentE9: (score) => {
        /**
         * @type {number}
         */
        const max_combo = ((score.ruleset_id === 3) ?
            score?.maximum_statistics?.perfect + (score?.maximum_statistics?.legacy_combo_increase || 0) :
            score?.beatmap?.max_combo) || 0

        return {
            accuracy: score?.legacy_accuracy,
            combo: score?.max_combo || 0,
            max_combo: max_combo || 0,
        }
    },

    score2componentE10: (score, attr, progress, is_lazer = false) => {
        let ratio;

        if (score.statistics.great === 0) {
            if (score.statistics.perfect === 0) {
                ratio = 0;
            } else {
                ratio = Infinity;
            }
        } else if (score.statistics.perfect === 0) {
            ratio = 0;
        } else {
            ratio = score.statistics.perfect / score.statistics.great
        }

        return {
            statistics: score2Statistics(score.statistics, score.ruleset_id, is_lazer),
            statistics_max: score2StatisticsMax(score.maximum_statistics, score.statistics, score.ruleset_id, is_lazer, progress),

            // 仅限 standard, taiko 使用
            effective_miss_count: attr?.effective_miss_count,

            // 仅限 catch 使用
            statistics_full: (score.ruleset_id !== 2) ? [] : [
                score.maximum_statistics.great,
                score.maximum_statistics.large_tick_hit,
                score.maximum_statistics.small_tick_hit
            ],

            // 仅限 mania 使用
            ratio: ratio,
            mode: score.ruleset_id,
        }
    },

    score2componentE10P: (score) => {
        /*
        const s = score.statistics
        const m = score.maximum_statistics

        const rainbow_rating = (((s?.great || 0) + 0.5 * (s?.ok || 0)) /
            (m?.great || 0) * (progress || 0) + 0.0001 * ((s?.small_bonus || 0) + (s?.ignore_hit || 0)))
            || ((score?.accuracy || 0) * (progress || 0))

         */

        const rainbow_rating = (score?.total_score_without_mods > 0) ?
            (score.total_score_without_mods / 1000000) :
            (score?.total_score || score?.legacy_total_score || 0) / (1000000 * getModMultiplier(score?.mods || [], score?.ruleset_id || 0))

        let rainbow_rank;

        if (score.rank === 'X' || score.rank === 'XH') {
            rainbow_rank = 'object-score-kiwami-rainbow.png'
        } else if (rainbow_rating < 0.5 - 1e-4) {
            rainbow_rank = 'object-score-jimaodan.png'
        } else if (rainbow_rating < 0.6 - 1e-4) {
            rainbow_rank = 'object-score-iki-iron.png'
        } else if (rainbow_rating < 0.7 - 1e-4) {
            rainbow_rank = 'object-score-iki-bronze.png'
        } else if (rainbow_rating < 0.8 - 1e-4) {
            rainbow_rank = 'object-score-iki-silver.png'
        } else if (rainbow_rating < 0.9 - 1e-4) {
            rainbow_rank = 'object-score-miyabi-gold.png'
        } else if (rainbow_rating < 0.95 - 1e-4) {
            rainbow_rank = 'object-score-miyabi-pink.png'
        } else if (rainbow_rating < 1 - 1e-4) {
            rainbow_rank = 'object-score-miyabi-purple.png'
        } else {
            rainbow_rank = 'object-score-kiwami-rainbow.png'
        }

        let rainbow_crown;

        if (score?.passed === false) {
            rainbow_crown = 'object-score-don-failed.png'
        } else if (score?.statistics?.miss === 0) {
            if (score?.statistics?.ok === 0) {
                rainbow_crown = 'object-score-crown-rainbow.png'
            } else {
                rainbow_crown = 'object-score-crown-gold.png'
            }
        } else {
            rainbow_crown = 'object-score-crown-silver.png'
        }

        return {
            mode: score?.ruleset_id,
            rainbow_rank: rainbow_rank,
            rainbow_crown: rainbow_crown
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

    const stat_number = rounds(stat, 1)

    const stat_b = stat_number.integer
    const stat_m = stat_number.decimal

    if (isDisplay) return {
        remark: remark,
        data_b: stat_b,
        data_m: stat_m,
        data_a: hasChanged ? (' [' + floor(original, 1) + ']') : '',
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


//老面板的newJudge
const score2Statistics = (statistics, mode, is_lazer = false) => {
    const s = statistics

    let stats = [];

    if (is_lazer) {
        switch (getGameMode(mode, 1)) {
            case 'o': {
                stats.push({
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '100',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '50',
                    stat: s.meh,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                }, {}, {}, {}, {
                    index: 'TICK',
                    stat: s.large_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: 'END',
                    stat: s.slider_tail_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {}, {
                    index: 'O+',
                    stat: s.large_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: 'O?',
                    stat: s.small_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                });
                break;
            }

            case 't': {
                stats.push({
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '150',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                }, {}, {}, {}, {}, {}, {}, {
                    index: 'O+',
                    stat: s.large_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '==',
                    stat: s.small_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: '()',
                    stat: s.ignore_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#A1A1A1',
                });
                break;
            }

            case 'c': {
                stats.push({
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '100',
                    stat: s.large_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '50',
                    stat: s.small_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {}, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                }, {}, {}, {}, {
                    index: 'MD',
                    stat: s.small_tick_miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#A1A1A1',
                }, {}, {}, {
                    index: 'BNN',
                    stat: s.large_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                });
                break;
            }

            case 'm': {
                stats.push({
                    index: 'MAX',
                    stat: s.perfect,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: '200',
                    stat: s.good,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '100',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#5E8AC6',
                }, {
                    index: '50',
                    stat: s.meh,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#A1A1A1',
                }, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                });
                break;
            }
        }
    } else {
        switch (getGameMode(mode, 1)) {
            case 'o': {
                stats.push({
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '100',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '50',
                    stat: s.meh,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {}, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                });
                break;
            }

            case 't': {
                stats.push({
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '150',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                });
                break;
            }

            case 'c': {
                stats.push({
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '100',
                    stat: s.large_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '50',
                    stat: s.small_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {}, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                }, {
                    index: 'MD',
                    stat: s.small_tick_miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#A1A1A1',
                });
                break;
            }

            case 'm': {
                stats.push({
                    index: 'MAX',
                    stat: s.perfect,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: '200',
                    stat: s.good,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: '100',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#5E8AC6',
                }, {
                    index: '50',
                    stat: s.meh,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#A1A1A1',
                }, {
                    index: '0',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                });
                break;
            }

        }
    }

    return stats;
}

//老面板的sumJudge
const score2StatisticsMax = (max_statistics, statistics, mode, is_lazer = false) => {
    const m = max_statistics
    const s = statistics

    if (is_lazer) {
        // Deluxe
        switch (getGameMode(mode, 1)) {
            case 'o': {
                const max = m.great
                const tick = m.large_tick_hit
                const end = m.slider_tail_hit
                const bonus = m.large_bonus
                const spin = m.small_bonus

                return [max, max, max, max, 0, 0,
                    0, tick, end, 0, bonus, spin]
            }
            case 't': {
                const max = m.great
                const large = m.large_bonus
                const drumroll = m.small_bonus
                const spinner = m.ignore_hit
                return [max, max, max, 0, 0, 0,
                    0, 0, 0, large, drumroll, spinner]
            }
            case 'c': {
                const max = Math.max(m.great, m.large_tick_hit, m.small_tick_hit)
                const droplet = m.small_tick_hit
                const banana = m.large_bonus
                return [max, max, max, 0, max, 0,
                    0, 0, droplet, 0, 0, banana]
            }
            case 'm': {
                const max = Math.max((s.great + s.perfect), s.good, s.ok, s.meh, s.miss)
                return [max, max, max, max, max, max]
            }
        }
    } else {
        // Standard
        switch (getGameMode(mode, 1)) {
            case 'o': {
                const max = m.great
                return [max, max, max, 0, max]
            }
            case 't': {
                const max = m.great
                return [max, max, max]
            }
            case 'c': {
                const max = Math.max(m.great, m.small_tick_hit)
                const droplet = m.small_tick_hit
                return [max, max, max, 0, max, droplet]
            }
            case 'm': {
                const max = Math.max((s.great + s.perfect), s.good, s.ok, s.meh, s.miss)
                return [max, max, max, max, max, max]
            }
        }
    }
}

function getStatisticsSVG(statistics = [], max_statistics = [], full_statistics = [], x, y, w, height, interval, font_h) {
    let svg = '';

    // Standard
    for (let i = 0; i < Math.min(statistics?.length, 6); i++) {
        const v = statistics[i]
        const m = max_statistics[i]

        if (isNotNumber(v.stat)) continue

        const rrect_y = y + i * (height + interval);
        const text_y = rrect_y + font_h;
        const index_text_x = x - 10;
        const stat_text_x = x + w + (v.stat < 10000 ? 10 : 5);

        const index = v.index.toString();
        const stat = v.stat.toString();

        const color = v.rrect_color;

        const index_text = poppinsBold.getTextPath(index.toString(),
            index_text_x, text_y, 18, "right baseline", v.index_color);
        const stat_text = poppinsBold.getTextPath(stat.toString(),
            stat_text_x, text_y, 18, "left baseline", v.stat_color);

        svg += (index_text + stat_text);

        if (v.stat > 0) {
            const rect_width = w * v.stat / m;
            svg += PanelDraw.Rect(x, rrect_y, Math.max(rect_width, height), height, height / 2, color);
        }

        const f = (w * full_statistics[i] / m)
        const back_rrect_width = isNumber(f) ? Math.min(f, w) : w

        svg += PanelDraw.Rect(x, rrect_y, back_rrect_width, height, height / 2, color, 0.1);
    }

    // Deluxe
    if (statistics?.length > 6) {
        for (let i = 6; i < Math.min(statistics?.length, 12); i++) {
            const v = statistics[i]
            const m = max_statistics[i]

            if (isNotNumber(v.stat)) continue

            const deluxe_width = (w / 2) - 50
            const deluxe_x = (i < 9) ? x : (x + (w / 2) + 50)

            const rrect_y = (i < 9) ? y + (i - 6 + 3) * (height + interval) : y + (i - 9 + 3) * (height + interval);
            const text_y = rrect_y + font_h;
            const index_text_x = deluxe_x - 10;
            const stat_text_x = deluxe_x + deluxe_width + (v.stat < 10000 ? 10 : 5);

            const index = v.index.toString();
            const stat = v.stat.toString();

            const color = v.rrect_color;

            const index_text = poppinsBold.getTextPath(index,
                index_text_x, text_y, 18, "right baseline", v.index_color);
            const stat_text = poppinsBold.getTextPath(stat,
                stat_text_x, text_y, 18, "left baseline", v.stat_color);

            svg += (index_text + stat_text);

            if (v.stat > 0) {
                const rect_width = deluxe_width * v.stat / m;
                svg += PanelDraw.Rect(deluxe_x, rrect_y, Math.max(rect_width, height), height, height / 2, color, 0.4); // 这些附加数据不要太亮
            }

            svg += PanelDraw.Rect(deluxe_x, rrect_y, deluxe_width, height, height / 2, color, 0.1);
        }
    }


    return svg;
}
