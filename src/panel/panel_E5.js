import {
    clamp, clampToInteger,
    floor,
    floors,
    getBeatMapTitlePath,
    getDiffBackground,
    getDifficultyIndex,
    getFormattedTime,
    getGameMode,
    getImageFromV3,
    getKeyDifficulty,
    getMapStatusImage,
    getNowTimeStamp,
    getPanelNameSVG,
    getRatioString,
    getSvgBody,
    getTimeDifference,
    isEmptyArray,
    readTemplate,
    removeGuest,
    round,
    rounds,
    setImage,
    setText,
    setTexts
} from "../util/util.js";
import {getRankBackground, getScoreTypeImage} from "../util/star.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {extra, getMultipleTextPath, getTextWidth, poppinsBold, PuHuiTi} from "../util/font.js";
import {colorArray, getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {label_E5} from "../component/label.js";
import {drawLazerMods, getModMultiplier} from "../util/mod.js";

import {createImageRouter, createSvgRouter} from "../util/image.js";
import {isNotBlankString, isNotNumber, isNumber} from "../util/text.js";

export const router = createImageRouter(panel_E5);

export const router_svg = createSvgRouter(panel_E5);

/**
 * 超级成绩面板
 * @param data
 * @return {Promise<string>}
 */
// E面板升级计划
export async function panel_E5(data = {
    panel: "", user: {}, history_user: null,

    density: {}, progress: 1, original: {}, attributes: {
        effective_miss_count: 1.0078382838283828,
        pp: 201.40540077771928,
        pp_accuracy: 51.6400779167333,
        pp_aim: 85.3547123277813,
        pp_flashlight: 0,
        pp_reading: 0,
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
        accuracy: 0.924724, // 这个是否为空可以判断成绩的种类
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
            lazer_only: false,
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
            original_rating: 2.8238842,
            total_length: 37,
            user_id: 7003013,
            version: 'H*rd',
            beatmapset: [Object],
            checksum: 'a681f568d6b66a2b770d3a1fe76ddece',
            max_combo: 194,
            count_circles: 47,
            count_sliders: 68,
            count_spinners: 1,
            hit_length: 37,
            is_scoreable: false,
            last_updated: '2022-09-27T12:45:10Z',
            mode_int: 0,
            passcount: 100,
            playcount: 188,
            owners: [{
                "id": 1653229, "username": "_Stan"
            }, {
                "id": 3793196, "username": "Critical_Star"
            }, {
                "id": 6117525, "username": "ruka"
            }, {
                "id": 7082178, "username": "[Crz]Satori"
            }, {
                "id": 7590894, "username": "ExNeko"
            }, {
                "id": 10125072, "username": "U1d"
            }, {
                "id": 10500832, "username": "[Crz]xz1z1z"
            }, {
                "id": 13026904, "username": "tyrcs"
            }]

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
            rating: 0,
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
    // 1. 对象解构与默认值处理
    const {
        score = {},
        user = {},
        history_user = null,
        density = {},
        progress = 1,
        original = {},
        attributes = {},
        position = 0,
        panel: panel_type
    } = data;

    const {ended_at, started_at, legacy_rank: rank, passed, is_lazer, type: scoreType} = score;

    // 2. 并行异步任务：模板读取、背景获取、用户卡片数据准备
    const [svgTemplate, banner, cardA1Data] = await Promise.all([readTemplate('template/Panel_E.svg'), getDiffBackground(score), PanelGenerate.user2CardA1(user, history_user)]);

    // 3. 时间逻辑简化
    const timeBase = ended_at || started_at;
    const score_time = getFormattedTime(timeBase);
    const delta_time = getTimeDifference(timeBase);

    const is_recently = panel_type === 'P' || panel_type === 'R'

    const best_info = (score?.best_id > 0 && is_recently) ? 'Personal Best! // ' : ''

    const request_info = (position > 0 && !(position === 1 && is_recently)) ? `position: #${position} // ` : '';

    const request_time = `score time: ${score_time} (${delta_time}) // request time: ${getNowTimeStamp()}`;

    // 4. 面板名称映射表 (取代 switch)
    const panelNameMap = {
        'B': ['Best Score (!ymb)', 'B'],
        'P': ['Passed Score (!ymp)', 'P'],
        'R': ['Recent Score (!ymr)', 'R'],
        'S': ['Score (!yms)', 'S'],
        'L': ['Leader Board (!yml)', 'L'],
        'T': ['Today Bests (!ymt)', 'T'],
    };

    let panel_name_svg;
    if (panel_type === 'MR') {
        const mrTime = `matchID: ${data.match || 0} // request time: ${getNowTimeStamp()}`;
        panel_name_svg = getPanelNameSVG('Match Recent Score (!ymmr)', 'MR', mrTime);
    } else {
        const [title, sign] = panelNameMap[panel_type] || ['Excellent Score (!ymp / !ymr / !yms)', 'S'];
        panel_name_svg = getPanelNameSVG(title, sign, best_info + request_info + request_time);
    }

    // 5. 并行生成复杂的卡片内容
    const cardA1 = await card_A1(cardA1Data);

    // 组件内容生成
    const components = [
        getSvgBody(40, 40, cardA1),
        getSvgBody(40, 330, component_E1(PanelEGenerate.score2componentE1(score))),
        getSvgBody(40, 500, component_E2(PanelEGenerate.score2componentE2(score, density, progress))),
        getSvgBody(40, 770, component_E3(PanelEGenerate.score2componentE3(score, original))),
        getSvgBody(550, 330, component_E4(PanelEGenerate.score2componentE4(score))),
        getSvgBody(1280, 330, component_E5(PanelEGenerate.score2componentE5(score))),
        getSvgBody(550, 880, component_E6(PanelEGenerate.score2componentE6(score, banner))),
        getSvgBody(1390, 330, component_E7(PanelEGenerate.score2componentE7(score, attributes))),
        getSvgBody(1390, 500, component_E8(PanelEGenerate.score2componentE8(score, is_lazer))),
        getSvgBody(1390, 600, component_E9(PanelEGenerate.score2componentE9(score))),
        getSvgBody(1390, 770, component_E10P(PanelEGenerate.score2componentE10P(score, progress))),
        getSvgBody(1390, 770, component_E10(PanelEGenerate.score2componentE10(score, attributes, progress, is_lazer)))
    ];

    // 6. 批量注入 SVG
    let svg = svgTemplate;
    const regs = {
        index_plus: /(?<=<g id="IndexPlus">)/,
        index: /(?<=<g id="Index">)/,
        background: /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/,
        banner: /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/,
        card_a1: /(?<=<g id="Card_A1">)/,
        card_e1: /(?<=<g id="Card_E1">)/
    };

    // 注入装饰图片和文字
    const lazer_only = score?.beatmap?.lazer_only === true

    if (!lazer_only) {
        svg = setImage(svg, 1725, 220, 170, 70, getScoreTypeImage(is_lazer, 2, scoreType), regs.index_plus, 1);
    } else {
        svg = setImage(svg, 1615, 220, 280, 70, getScoreTypeImage(is_lazer, '-only'), regs.index_plus, 1);
    }

    svg = setText(svg, panel_name_svg, regs.index);
    svg = setImage(svg, 665, 290, 590, 590, getImageFromV3(`object-score-${rank}2.png`), regs.index, 1);

    // 注入主背景
    svg = setImage(svg, 0, 0, 1920, 1080, getRankBackground(rank, passed), regs.background, 0.6);

    // 注入 Banner
    svg = setImage(svg, 0, 0, 1920, 320, banner, regs.banner, 0.7);

    // 批量注入所有组件内容 (一次性处理多个 body 字符串)
    svg = setText(svg, components[0], regs.card_a1);
    svg = setTexts(svg, components.slice(1), regs.card_e1);

    return svg;
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_E1 = (data) => {
    const {
        name = '',
        star = 0,
        original = 0,
        ruleset_id = 0
    } = data

    // 读取模板
    let svg = `   <defs>
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

    const star_rrect = PanelDraw.Rect(15, 105, clampToInteger((star / 9) * 460, 460, 20), 30, 15, 'none')

    const ruleset_path = extra.getTextPath(getGameMode(ruleset_id, -1), 20 - 2, 88 - 10, 72, 'left baseline', getStarRatingColor(star))

    const star_floor = floors(star, 2)

    const text_arr = [{
        font: "poppinsBold", text: star_floor.integer, size: 84, color: '#fff',
    }, {
        font: "poppinsBold", text: star_floor.decimal, size: 48, color: '#fff',
    }, {
        font: "poppinsBold", text: ' / ' + name, size: 24, color: '#fff',
    },]

    const texts = getMultipleTextPath(text_arr, 105, 88, "left baseline");

    const show_original = (original > 0 && Math.abs(original - star) > 1e-4)

    const sr_title = (show_original ? `(${floor(original, 2)}) ` : '') + 'Star Rating'

    const title = poppinsBold.getTextPath(sr_title, 475, 28, 18, 'right baseline', '#fff')

    svg = setText(svg, star_rrect, reg_star)
    svg = setTexts(svg, [ruleset_path, texts, title], reg_text);

    return svg;
};

const component_E2 = (data = {}) => {
    const {
        density_arr = [], retry_arr = [], fail_arr = [],
        rating = 0, star = 0, pass = 0, play = 0, progress = 1, color = '#fff'
    } = data;

    const pass_percent = play > 0 ? Math.round(pass / play * 100) : 0;

    // 计算缩放比例
    let density_scale = 1;
    if (star <= 1) density_scale = 0.1;
    else if (star <= 8) density_scale = Math.sqrt(((star - 1) / 7 * 0.9) + 0.1);

    // 使用 ... 展开运算符获取最大值
    const density_max = (density_arr.length ? Math.max(...density_arr) : 0) / density_scale;

    /**
     * @type {number[]}
     */
    const rf_arr = fail_arr.map((v, i) => v + (retry_arr[i] || 0));
    const rf_max = rf_arr.length ? Math.max(...rf_arr) : 0;

    // 组合 SVG 字符串
    return `
        ${PanelDraw.Rect(0, 0, 490, 250, 20, '#382e32')}
        ${poppinsBold.getTextPath('Density', 15, 28, 18, 'left baseline', '#fff')}
        ${poppinsBold.getTextPath('Retry & Fail', 15, 138, 18, 'left baseline', '#fff')}
        ${poppinsBold.getTextPath(`User Rating: ${floor(rating, 1)} / 10`, 475, 28, 18, 'right baseline', '#fff')}
        ${poppinsBold.getTextPath(`Pass: ${pass} / ${play} [${pass_percent}%]`, 475, 138, 18, 'right baseline', '#fff')}
        ${PanelDraw.LineChart(density_arr, density_max, 0, 15, 115, 460, 80, color, 1, 0.4, 3)}
        ${progress < 1 ? PanelDraw.Rect(20 + (457 * progress) + 1.5, 35, 3, 80, 1.5, '#ed6c9e') : ''}
        ${PanelDraw.BarChart(rf_arr, rf_max, 0, 15, 235, 460, 80, 2, 0, '#f6d659')}
        ${PanelDraw.BarChart(fail_arr, rf_max, 0, 15, 235, 460, 80, 2, 0, '#ed6c9e')}
    `;
};

const component_E3 = (data) => {
    let svg = `
        <g id="Labels_OE3">
        </g>
    `;

    const {
        labels = [], index = ''
    } = data

    const reg_label = /(?<=<g id="Labels_OE3">)/;

    const title_path = poppinsBold.getTextPath('Statistics', 15, 28, 18, 'left baseline', '#fff');

    const index_path = poppinsBold.getTextPath(index, 475, 28, 18, 'right baseline', '#fff')

    const string_e5s = labels.slice(0, 6).map((label, i) => {
        const x = 15 + 235 * (i % 2);
        const y = 38 + 76 * Math.floor(i / 2);
        return getSvgBody(x, y, label_E5(label));
    }).join('');

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = setTexts(svg, [string_e5s, title_path, index_path, rect], reg_label);

    return svg;
}

const component_E4 = (data = {
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

const component_E5 = (data = {
    favorite: 0, playcount: 0,
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

const component_E6 = (data) => {
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

    const {
        title = '',
        title_unicode = '',
        artist = '',
        difficulty_name = '',
        creator = '',
        bid = 0,
        // sid = 0,
        background = '',
    } = data

    const reg_label = /(?<=<g id="Labels_OE6">)/;
    const reg_background = /(?<=<g id="Background_OE6" style="clip-path: url\(#clippath-OE6-1\);">)/;
    const reg_base = /(?<=<g id="Base_OE6">)/;

    const t = getBeatMapTitlePath("poppinsBold", "PuHuiTi", title, title_unicode, artist, 820 / 2, 55, 98, 48, 24, 820 - 20);

    const diff_text = poppinsBold.cutStringTail(difficulty_name, 30, 820 - 40 - 10 - 2 * Math.max(poppinsBold.getTextWidth(poppinsBold.cutStringTail(creator, 24, 240, true), 24), poppinsBold.getTextWidth('b' + bid, 24)), true)

    const diff = poppinsBold.getTextPath(diff_text, 820 / 2, 142, 30, 'center baseline', '#fff');
    const creator_path = poppinsBold.getTextPath(poppinsBold.cutStringTail(creator, 24, 240, true), 20, 142, 24, 'left baseline', '#fff');
    const bid_path = poppinsBold.getTextPath('b' + bid, 820 - 20, 142, 24, 'right baseline', '#fff');

    const rect = PanelDraw.Rect(0, 0, 820, 160, 20, '#382e32', 1);

    svg = setTexts(svg, [t.title, t.title_unicode, bid_path, creator_path, diff], reg_label);
    svg = setImage(svg, 0, 0, 820, 160, background, reg_background, 0.4);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E7 = (data) => {

    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-OE7-1">
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
            <linearGradient id="grad-OE7-20" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(99,99,99); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(204,204,204); stop-opacity:1" />
            </linearGradient>
          </defs>
          <g id="Base_OE7">
            <rect id="Base" x="0" y="0" width="490" height="150" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE7-12); fill-opacity: 0.2"/>
          </g>
          <g id="Rect_OE7">
            <g id="Clip_OE7-6" style="clip-path: url(#clippath-OE7-1);">
            
            </g>
            <g id="Clip_OE7-5" style="clip-path: url(#clippath-OE7-1);">
            
            </g>
            <g id="Clip_OE7-4" style="clip-path: url(#clippath-OE7-1);">
            
            </g>
            <g id="Clip_OE7-3" style="clip-path: url(#clippath-OE7-1);">
            
            </g>
            <g id="Clip_OE7-2" style="clip-path: url(#clippath-OE7-1);">
            
            </g>
          </g>
          <g id="Text_OE7">
          </g>`;

    const {
        pp = 0,
        full_pp = 0,
        perfect_pp = 0,
        // aim_pp = 0,
        // spd_pp = 0,
        // acc_pp = 0,
        // reading_pp = 0,
        // fl_pp = 0,
        // diff_pp = 0,
        is_fc = true,
        ruleset_id = 0,
    } = data

    let fc = is_fc

    const reg_text = /(?<=<g id="Text_OE7">)/;
    const reg_clip2 = /(?<=<g id="Clip_OE7-2" style="clip-path: url\(#clippath-OE7-1\);">)/;
    const reg_clip3 = /(?<=<g id="Clip_OE7-3" style="clip-path: url\(#clippath-OE7-1\);">)/;
    const reg_clip4 = /(?<=<g id="Clip_OE7-4" style="clip-path: url\(#clippath-OE7-1\);">)/;
    const reg_clip5 = /(?<=<g id="Clip_OE7-5" style="clip-path: url\(#clippath-OE7-1\);">)/;
    const reg_clip6 = /(?<=<g id="Clip_OE7-6" style="clip-path: url\(#clippath-OE7-1\);">)/; //181,100,217 | 238,96,156

    const pf_percent = perfect_pp > 0 ? (pp / perfect_pp) : 1;
    const fc_percent = full_pp > 0 ? (pp / full_pp) : 1;

    const over = 460 - poppinsBold.getTextWidth(Math.round(perfect_pp || 0).toString(), 24) - 30 < (460 * fc_percent);
    if (over) fc = true;

    let reference_pp; // 参考 PP，有时是 FC PP，有时是 SS PP

    let percent;
    let reference_pp_text;
    let fc_pp_text;
    let percent_type;

    if (ruleset_id === 3 && fc_percent < 0.95 && pf_percent < 0.95) {
        // mania 的争取 FC 模式
        reference_pp = full_pp;

        percent = fc_percent;
        percent_type = 'FC'
        fc_pp_text = Math.round(perfect_pp || 0);
    } else if (fc) {
        reference_pp = perfect_pp;

        percent = pf_percent;
        if (ruleset_id === 3) {
            percent_type = 'PF'
        } else {
            percent_type = 'SS'
        }
        fc_pp_text = '';
    } else {
        reference_pp = full_pp;

        percent = fc_percent;
        percent_type = 'FC'
        fc_pp_text = Math.round(perfect_pp);
    }

    const is_perfect = (percent_type === 'SS' && Math.round(percent * 100) > 100 - 1e-7)
        || (Math.round(perfect_pp) - Math.round(pp)) < 1e-4

    if (is_perfect) {
        reference_pp_text = ' / PERFECT';
    } else {
        reference_pp_text = ' / ' + Math.round(reference_pp) + ' ' + percent_type + ' [' + Math.round(percent * 100) + '%]';
    }

    const fc_pp = poppinsBold.getTextPath(fc_pp_text, 475 - 15, 128, 24, 'right baseline', '#fff')

    const pp_text = Math.round(pp).toString()

    const max_width = poppinsBold.getTextWidth(pp_text, 84) + poppinsBold.getTextWidth(' PP', 48) + poppinsBold.getTextWidth(reference_pp_text, 24)

    let text_arr

    if (max_width <= 465) {
        text_arr = [{
            font: "poppinsBold", text: pp_text, size: 84, color: '#fff',
        }, {
            font: "poppinsBold", text: ' PP', size: 48, color: '#fff',
        }, {
            font: "poppinsBold", text: reference_pp_text, size: 24, color: '#fff',
        },]
    } else {
        const pp_round = rounds(pp, -4)

        const mid_width = poppinsBold.getTextWidth(pp_round.integer, 84) + poppinsBold.getTextWidth(pp_round.decimal + ' PP', 48) + poppinsBold.getTextWidth(reference_pp_text, 24)

        if (mid_width <= 465) {
            text_arr = [{
                font: "poppinsBold", text: pp_round.integer, size: 84, color: '#fff',
            }, {
                font: "poppinsBold", text: pp_round.decimal + ' PP', size: 48, color: '#fff',
            }, {
                font: "poppinsBold", text: reference_pp_text, size: 24, color: '#fff',
            },]
        } else {
            const reference_pp_round = round(Math.round(reference_pp), 2, -1)

            text_arr = [{
                font: "poppinsBold", text: pp_round.integer, size: 84, color: '#fff',
            }, {
                font: "poppinsBold", text: pp_round.decimal + ' PP', size: 48, color: '#fff',
            }, {
                font: "poppinsBold", text: ' / ' + reference_pp_round + ' ' + percent_type, size: 24, color: '#fff',
            },]
        }
    }

    const texts = getMultipleTextPath(text_arr, 20, 88, "left baseline");
    const title = poppinsBold.getTextPath('Performance Points', 475, 28, 18, 'right baseline', '#fff')

    svg = setTexts(svg, [texts, title, fc_pp], reg_text);

    switch (ruleset_id) {
        case 0: {
            const skill_config = [
                { key: 'aim_pp',     grad: 'url(#grad-OE7-12)', clip: reg_clip2 },
                { key: 'spd_pp',     grad: 'url(#grad-OE7-13)', clip: reg_clip3 },
                { key: 'reading_pp', grad: 'url(#grad-OE7-14)', clip: reg_clip4 },
                { key: 'fl_pp',      grad: 'url(#grad-OE7-20)', clip: reg_clip5 },
                { key: 'acc_pp',     grad: 'url(#grad-OE7-15)', clip: reg_clip6 },
            ];

            const sum = skill_config.reduce((acc, skill) => acc + (data?.[skill.key] ?? 0), 0);

            let accumulated_width = 0;
            const texts = [];

            skill_config.forEach(({ key, grad, clip }) => {
                const val = data?.[key];
                if (!val || val < 1e-4) return;

                const pp_str = Math.round(val).toString()

                const width = getChildPPWidth(val, sum, pp, reference_pp);
                accumulated_width += width;

                const rect = PanelDraw.Rect(15, 105, accumulated_width, 30, 15, grad, 1);
                svg = setText(svg, rect, clip);

                const text_path = getChildPPPath(pp_str, 15, 128, 24, accumulated_width, width, 10);
                texts.push(text_path);
            });

            svg = setTexts(svg, texts, reg_text);
            break;
        }

        case 1: {
            const skill_config = [
                { key: 'diff_pp', grad: 'url(#grad-OE7-13)', clip: reg_clip3 },
                { key: 'acc_pp',  grad: 'url(#grad-OE7-15)', clip: reg_clip4 }
            ];

            const sum = skill_config.reduce((acc, skill) => acc + (data?.[skill.key] ?? 0), 0);

            let accumulated_width = 0;
            const texts = [];

            skill_config.forEach(({ key, grad, clip }) => {
                const val = data?.[key];
                if (!val || val < 1e-4) return;

                const pp_str = Math.round(val).toString()

                const width = getChildPPWidth(val, sum, pp, reference_pp);
                accumulated_width += width;

                const rect = PanelDraw.Rect(15, 105, accumulated_width, 30, 15, grad, 1);
                svg = setText(svg, rect, clip);

                const text_path = getChildPPPath(pp_str, 15, 128, 24, accumulated_width, width, 10);
                texts.push(text_path);
            });

            svg = setTexts(svg, texts, reg_text);
            break;
        }
    }

    // 保底 PP
    const pp_width = (reference_pp > 0) ? ((pp / reference_pp) * 460) : 460;
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

    function getChildPPPath(pp_str = '', x = 0, y = 0, size = 24, offset = 30, width = 30, interval = 0, max_width = 460) {
        const shown = isTextShown('poppinsBold', pp_str, size, width, interval);
        const slight = isTextSlightlyWider('poppinsBold', pp_str, size, width, interval);

        return shown ?
            poppinsBold.getTextPath(pp_str, x + Math.min(offset, max_width) - interval, y, size, 'right baseline', '#382c32') :
            (slight ? poppinsBold.getTextPath(pp_str, x + Math.min(offset, max_width) - (1 / 2 * width), y, size, 'center baseline', '#382c32') : '');
    }

    // 宽度大于最大宽 + 2x 间距
    function isTextShown(font = 'poppinsBold', pp_str = '', size = 24, width = 0, interval = 0) {
        return isNotBlankString(pp_str) && width > 0 && (width - 2 * interval >= getTextWidth(font, pp_str, size));
    }

    // 宽度大于最大宽 - 1/2x 间距
    function isTextSlightlyWider(font = 'poppinsBold', pp_str = '', size = 24, width = 0, interval = 0) {
        return isNotBlankString(pp_str) && width > 0 && (width + 1 / 2 * interval >= getTextWidth(font, pp_str, size));
    }
};

const component_E8 = (data = {
    score: 0, mods: [],
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

    const score_data = floors(data?.score, -4, (data?.mods.length <= 4) ? 1 : 0)

    const score_width = poppinsBold.getTextWidth(score_data.integer, 56) + poppinsBold.getTextWidth(score_data.decimal, 36)

    // const mods = getModsBody(data.mods, 480, 10, 'right', 450 - score_width); // y = 15
    const mods = drawLazerMods(data.mods, 480, 4, 70, 450 - score_width, 'right', 6, true).svg

    const score = getMultipleTextPath([{
        font: 'poppinsBold', text: score_data.integer, size: 56,
    }, {
        font: 'poppinsBold', text: score_data.decimal, size: 36,
    }], 20, 62, 'left baseline')

    const title = (data?.mods.length > 0) ? '' : poppinsBold.getTextPath('Score', 475, 28, 18, 'right baseline');

    const rect = PanelDraw.Rect(0, 0, 490, 80, 20, '#382e32', 1);

    svg = setText(svg, mods, reg_mods);
    svg = setTexts(svg, [title, score], reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E9 = (data = {
    accuracy: 0, combo: 0, max_combo: 0,
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

    const acc = floors((data?.accuracy || 0) * 100, 2)

    const accuracy = getMultipleTextPath([{
        font: 'poppinsBold', text: acc.integer, size: 60,
    }, {
        font: 'poppinsBold', text: acc.decimal + ' %', size: 36
    }], 470, 62, 'right baseline')

    const combo = getMultipleTextPath([{
        font: 'poppinsBold', text: (data?.combo || 0).toString(), size: 60,
    }, {
        font: 'poppinsBold', text: ' / ' + (data?.max_combo || 0).toString(), size: 36,
    }], 470, 132, 'right baseline')

    const rect = PanelDraw.Rect(0, 0, 490, 150, 20, '#382e32', 1);

    svg = setTexts(svg, [title, title2, accuracy, combo], reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E10 = (data) => {
    const {
        statistics = [],
        statistics_max = [],
        statistics_full = [],
        effective_miss_count = 0,
        ratio = 0,
        ruleset_id = 0
    } = data;

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

    const statistics_svg = getStatisticsSVG(statistics, statistics_max, statistics_full, 64, 45, 360, 20, 16, 16) // 345

    let ratio_text = getRatioString(ratio);

    const perfect_great_ratio = (ruleset_id === 3) ? poppinsBold.getTextPath('MAX : 300 = ' + ratio_text, 475, 28, 18, 'right baseline', '#fff') : ''

    const is_effective_miss_shown = (ruleset_id === 0 || ruleset_id === 1) && isNumber(effective_miss_count) && (Math.abs(effective_miss_count - Math.round(effective_miss_count)) > 1e-3)

    const effective_miss_text = 'equivalent miss: ' + floor(effective_miss_count || 0, 2)

    const effective_miss = is_effective_miss_shown ? poppinsBold.getTextPath(effective_miss_text, 475, 28, 18, 'right baseline', '#fff') : ''

    svg = setTexts(svg, [title, statistics_svg, perfect_great_ratio, effective_miss], reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E10P = (data) => {
    let svg = `
        <g id="Crown_OE11">
        </g>
        <g id="Rank_OE11">
        </g>
    `;

    const {
        ruleset_id = 0,
        rainbow_rank = '',
        rainbow_crown = ''
    } = data

    if (ruleset_id !== 1) return ''

    const reg_rank = /(?<=<g id="Rank_OE11">)/;
    const reg_crown = /(?<=<g id="Crown_OE11">)/;

    svg = isNotBlankString(rainbow_rank) ? setImage(svg, 20, 160, 100, 100, getImageFromV3(rainbow_rank), reg_rank, 1) : setImage(svg, 20, 160, 100, 100, getImageFromV3(rainbow_crown), reg_crown, 1)
    svg = isNotBlankString(rainbow_rank) ? setImage(svg, 140, 160, 100, 100, getImageFromV3(rainbow_crown), reg_crown, 1) : svg

    return svg;
}


// 私有转换方式
const PanelEGenerate = {
    score2componentE1: (score) => {
        const {
            mods = [],
            beatmap = {},
            ruleset_id = 0
        } = score

        const {
            difficulty_rating = 0,
            original_rating = 0,
            version = ""
        } = beatmap

        const name = getDifficultyIndex(version, difficulty_rating, ruleset_id, mods)

        return {
            name: name, star: difficulty_rating, original: original_rating, ruleset_id: ruleset_id,
        }
    },

    score2componentE2: (score, density, progress) => {
        // 先解构出需要的值，设置默认值
        const {
            beatmap = {},
            beatmapset = {}
        } = score || {};

        const {
            retries = [],
            fails = [],
            difficulty_rating: star = 0,
            passcount: pass = 0,
            playcount: play = 0,
            rating: rating_from_beatmap = 0
        } = beatmap;

        const {
            rating = 0
        } = beatmapset;

        return {
            density_arr: density ?? [],
            retry_arr: retries,
            fail_arr: fails,
            star,
            rating: rating || rating_from_beatmap || 0,
            pass,
            play,
            progress: progress ?? 0,
            color: getRankColor(score?.legacy_rank || ''),
        }
    },

    score2componentE3: (score, original) => PanelGenerate.score2componentE3(score, original),

    score2componentE4: (score) => {
        return {
            image: getMapStatusImage(score?.beatmap?.ranked)
        }
    },

    score2componentE5: (score) => {
        return {
            favorite: score?.beatmapset?.favourite_count || 0, playcount: score?.beatmapset?.play_count || 0,
        }
    },

    score2componentE6: (score, background) => {
        const {
            beatmap = {},
            beatmapset = {},
        } = score

        const {
            owners = [],
            id: bid = 0
        } = beatmap

        const {
            title = '',
            title_unicode = '',
            artist = '',
            creator = '',
            id: sid = 0
        } = beatmapset

        /**
         * @type string
         */
        let creators
        let difficulty = getKeyDifficulty(beatmap)

        if (isEmptyArray(owners)) {
            creators = creator
        } else {
            creators = owners.map(o => {
                return (o?.username ?? ('U' + (o?.id ?? '?')))
            }).join(", ")

            difficulty = removeGuest(difficulty)
        }

        return {
            title: title,
            title_unicode: title_unicode,
            artist: artist,
            difficulty_name: difficulty,
            bid: bid,
            sid: sid,
            background: background,
            creator: creators,
        }
    },

    score2componentE7: (score, attr) => {
        const {
            ruleset_id = 0,
            max_combo: combo = 0,
            beatmap: {
                max_combo = 0,
            },
            pp = 0
        } = score

        const {
            full_pp = 0,
            perfect_pp = 0
        } = attr ?? {}

        const is_fc = (max_combo > 0 && (combo / max_combo) > 0.98) || ruleset_id === 1 || ruleset_id === 3

        /**
         * C osu 的格式为：
         * {
         *   full_pp: 436.8850836253081,
         *   perfect_pp: 438.52808146035187,
         *   accuracy: 119.249566408264,
         *   aim: 261.21521780947194,
         *   aim_estimated_slider_breaks: 0,
         *   combo_based_estimated_miss_count: 0,
         *   effective_miss_count: 0,
         *   flashlight: 0,
         *   pp: 436.8850836253081,
         *   speed: 32.89129279108264,
         *   speed_deviation: 9.067807610428012,
         *   speed_estimated_slider_breaks: 0
         * }
         */
        return {
            pp: pp,
            full_pp: full_pp,
            perfect_pp: perfect_pp,

            aim_pp: attr?.pp_aim ?? attr?.aim ?? 0,
            spd_pp: attr?.pp_speed ?? attr?.speed ?? 0,
            acc_pp: attr?.pp_accuracy ?? attr?.accuracy ?? 0,
            reading_pp: attr?.pp_reading ?? attr?.reading ?? 0,
            fl_pp: attr?.pp_flashlight ?? attr?.flashlight ?? 0,
            diff_pp: attr?.pp_difficulty ?? (ruleset_id === 1 ? Math.max((attr?.pp - attr?.accuracy ?? 0), 0) : 0) ?? 0,

            is_fc: is_fc,

            ruleset_id: ruleset_id,
        }
    },

    score2componentE8: (score, is_lazer = false) => {
        const {
            total_score = 0,
            legacy_total_score = 0,
            mods = []
        } = score

        return {
            score: is_lazer ? total_score : legacy_total_score, mods: mods,
        }
    },

    score2componentE9: (score) => {
        const {
            maximum_statistics: {
                perfect = 0,
                legacy_combo_increase = 0
            },

            ruleset_id = 0,
            beatmap: {
                max_combo: beatmap_combo = 0,
                count_spinners = 0,
                convert = false
            }
        } = score

        /**
         * @type {number}
         */
        let max_combo;

        if (ruleset_id === 3) {
            max_combo = perfect + legacy_combo_increase
        } else if (convert === true && ruleset_id === 2) {
            // 老 bug，standard 转 catch 的谱面，转盘会被当成 1 个连击，但其实没有连击
            max_combo = beatmap_combo - count_spinners
        } else {
            max_combo = beatmap_combo
        }

        return {
            accuracy: score?.legacy_accuracy, combo: score?.max_combo || 0, max_combo: max_combo,
        }
    },

    score2componentE10: (score, attr, progress, is_lazer = false) => {
        const {
            statistics,
            maximum_statistics,
            ruleset_id = 0
        } = score

        const {
            perfect = 0,
            great = 0
        } = statistics

        const {
            effective_miss_count = null
        } = attr


        let ratio;

        if (great === 0) {
            if (perfect === 0) {
                ratio = 0;
            } else {
                ratio = Infinity;
            }
        } else if (perfect === 0) {
            ratio = 0;
        } else {
            ratio = perfect / great
        }

        return {
            statistics: score2Statistics(statistics, ruleset_id, is_lazer),
            statistics_max: score2StatisticsMax(maximum_statistics, statistics, ruleset_id, is_lazer),

            // 仅限 standard, taiko 使用
            effective_miss_count: effective_miss_count,

            // 仅限 catch 使用
            statistics_full: (ruleset_id !== 2)
                ? []
                : [maximum_statistics.great, maximum_statistics.large_tick_hit, maximum_statistics.small_tick_hit],

            // 仅限 mania 使用
            ratio: ratio,
            ruleset_id: ruleset_id,
        }
    },

    score2componentE10P: (score, progress) => {
        const {
            type = '',
            is_lazer = false,
            max_statistics = {},
            statistics = {},
            mods = [],
            total_score_without_mods = 0,
            total_score = 0,
            legacy_total_score = 0,
            ruleset_id = 0,
            legacy_rank = 'F',
            passed = false,
            max_combo: combo = 0,
            accuracy = 0,
            beatmap: {
                max_combo = 0
            }
        } = score

        if (ruleset_id !== 1) {
            return {
                ruleset_id: ruleset_id, rainbow_rank: '', rainbow_crown: ''
            }
        }

        const {
            great = 0,
            ok = 0,
            meh = 0,
            miss = 0,
            large_bonus = 0
        } = statistics

        const {
            great: max_great = 0,
        } = max_statistics

        let rainbow_rating

        if (type === 'sb_score' || !is_lazer) {
            // 对于 sb 服的分数，这里近似处理
            const similar_combo = Math.max(max_combo ?? (max_great) ?? (great + ok + miss), 1)

            const combo_rate = clamp((combo ?? 0) / (similar_combo ?? 1), 0, 1);

            rainbow_rating = (250000 * combo_rate + 750000 * Math.pow(accuracy, 3.6) + large_bonus * 300) / 1000000
        } else {
            rainbow_rating = (total_score_without_mods > 0) ? (total_score_without_mods / 1000000) : (total_score || legacy_total_score || 0) / (1000000 * getModMultiplier(mods ?? [], ruleset_id || 0))
        }

        let rainbow_rank;

        if (legacy_rank === 'X' || legacy_rank === 'XH') {
            rainbow_rank = 'object-score-kiwami-rainbow.png'
        } else if (rainbow_rating < 0.5 - 1e-4) {
            if (progress >= 0.98) {
                // 不合格
                rainbow_rank = 'object-score-don-disqualified.png'
            } else {
                // 投降
                rainbow_rank = 'object-score-jimaodan.png'
            }
        } else if (legacy_rank !== 'F' && ((miss === 1) || (miss === 0 && ok === 1) || (miss === 0 && meh === 1))) {
            // liaoxingyao，性歌
            rainbow_rank = 'object-score-sei-rainbow.png'
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

        if (passed !== true || legacy_rank === 'F') {
            rainbow_crown = 'object-score-don-failed.png'
        } else if (miss === 0) {
            if (ok === 0) {
                rainbow_crown = 'object-score-crown-rainbow.png'
            } else {
                rainbow_crown = 'object-score-crown-gold.png'
            }
        } else {
            rainbow_crown = 'object-score-crown-silver.png'
        }

        return {
            ruleset_id: ruleset_id, rainbow_rank: rainbow_rank, rainbow_crown: rainbow_crown
        }
    },
}

//老面板的newJudge
const score2Statistics = (statistics, mode, is_lazer = false) => {
    const s = statistics

    let stats = [];

    const m = getGameMode(mode, 1)

    if (is_lazer) {
        switch (m) {
            case 'o': {
                stats.push({
                    index: '300', stat: s.great, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.cyan,
                }, {
                    index: '100',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '50', stat: s.meh, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.yellow,
                }, {
                    index: '0', stat: s.miss, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.pink,
                }, {}, {}, {}, {
                    index: 'TICK',
                    stat: s.large_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.cyan,
                }, {
                    index: 'END',
                    stat: s.slider_tail_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.blue,
                }, {}, {
                    index: 'O+',
                    stat: s.large_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.orange,
                }, {
                    index: 'O?',
                    stat: s.small_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.yellow,
                });
                break;
            }

            case 't': {
                stats.push({
                    index: '300', stat: s.great, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.cyan,
                }, {
                    index: '150',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '0', stat: s.miss, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.pink,
                }, {}, {}, {}, {}, {}, {}, {
                    index: 'O+',
                    stat: s.large_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.cyan,
                }, {
                    index: '==',
                    stat: s.small_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.yellow,
                }, {
                    index: '()',
                    stat: s.ignore_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.gray,
                });
                break;
            }

            case 'c': {
                stats.push({
                    index: '300', stat: s.great, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.cyan,
                }, {
                    index: '100',
                    stat: s.large_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '50',
                    stat: s.small_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.yellow,
                }, {}, {}, {}, {}, {
                    index: 'MF',
                    stat: s.miss - s.large_tick_miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.pink,
                }, {
                    index: 'ML',
                    stat: s.small_tick_miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.gray,
                }, {}, {
                    index: 'MD',
                    stat: s.large_tick_miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.deep_red,
                }, {
                    index: 'BNN',
                    stat: s.large_bonus,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.yellow,
                });
                break;
            }

            case 'm': {
                stats.push({
                    index: 'MAX',
                    stat: s.perfect,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.rainbow,
                }, {
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.yellow,
                }, {
                    index: '200',
                    stat: s.good,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '100', stat: s.ok, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.blue,
                }, {
                    index: '50', stat: s.meh, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.gray,
                }, {
                    index: '0', stat: s.miss, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.pink,
                });
                break;
            }
        }
    } else {
        switch (m) {
            case 'o': {
                stats.push({
                    index: '300', stat: s.great, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.cyan,
                }, {
                    index: '100',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '50', stat: s.meh, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.yellow,
                }, {}, {
                    index: '0', stat: s.miss, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.pink,
                });
                break;
            }

            case 't': {
                stats.push({
                    index: '300', stat: s.great, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.cyan,
                }, {
                    index: '150',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '0', stat: s.miss, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.pink,
                });
                break;
            }

            case 'c': {
                stats.push({
                    index: '300', stat: s.great, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.cyan,
                }, {
                    index: '100',
                    stat: s.large_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '50',
                    stat: s.small_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.yellow,
                }, {}, {
                    index: '0', stat: s.miss, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.pink,
                }, {
                    index: 'ML',
                    stat: s.small_tick_miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.gray,
                });
                break;
            }

            case 'm': {
                stats.push({
                    index: 'MAX',
                    stat: s.perfect,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.rainbow,
                }, {
                    index: '300',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.yellow,
                }, {
                    index: '200',
                    stat: s.good,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: colorArray.light_green,
                }, {
                    index: '100', stat: s.ok, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.blue,
                }, {
                    index: '50', stat: s.meh, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.gray,
                }, {
                    index: '0', stat: s.miss, index_color: '#fff', stat_color: '#fff', rrect_color: colorArray.pink,
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
    const mo = getGameMode(mode, 1)

    if (is_lazer) {
        // Deluxe
        switch (mo) {
            case 'o': {
                const max = m.great
                const tick = m.large_tick_hit
                const end = m.slider_tail_hit
                const bonus = m.large_bonus
                const spin = m.small_bonus

                return [max, max, max, max, 0, 0, 0, tick, end, 0, bonus, spin]
            }
            case 't': {
                const max = m.great
                const large = m.large_bonus
                const drumroll = m.small_bonus
                const spinner = m.ignore_hit
                return [max, max, max, 0, 0, 0, 0, 0, 0, large, drumroll, spinner]
            }
            case 'c': {
                const max = Math.max(m.great, m.large_tick_hit, m.small_tick_hit)
                const fruit = Math.max(m.great - m.large_tick_hit, 0)
                const drop = m.large_tick_hit
                const droplet = m.small_tick_hit
                const banana = m.large_bonus
                return [max, max, max, 0, 0, 0, 0, fruit, droplet, 0, drop, banana]
            }
            case 'm': {
                const max = Math.max((s.great + s.perfect), s.good, s.ok, s.meh, s.miss)
                return [max, max, max, max, max, max]
            }
        }
    } else {
        // Standard
        switch (mo) {
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

        const index_text = poppinsBold.getTextPath(index.toString(), index_text_x, text_y, 18, "right baseline", v.index_color);
        const stat_text = poppinsBold.getTextPath(stat.toString(), stat_text_x, text_y, 18, "left baseline", v.stat_color);

        svg += (index_text + stat_text);

        if (v.stat > 0) {
            const rect_width = w * v.stat / m;

            if (Array.isArray(color)) {
                svg += PanelDraw.LinearGradientRect(x, rrect_y, Math.max(rect_width, height), height, height / 2, color);
            } else {
                svg += PanelDraw.Rect(x, rrect_y, Math.max(rect_width, height), height, height / 2, color);
            }
        }

        const f = (w * full_statistics[i] / m)
        const back_rrect_width = isNumber(f) ? Math.min(f, w) : w

        if (Array.isArray(color)) {
            svg += PanelDraw.LinearGradientRect(x, rrect_y, back_rrect_width, height, height / 2, color, 0.1);
        } else {
            svg += PanelDraw.Rect(x, rrect_y, back_rrect_width, height, height / 2, color, 0.1);
        }
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

            const index_text = poppinsBold.getTextPath(index, index_text_x, text_y, 18, "right baseline", v.index_color);
            const stat_text = poppinsBold.getTextPath(stat, stat_text_x, text_y, 18, "left baseline", v.stat_color);

            svg += (index_text + stat_text);

            if (v.stat > 0) {
                const rect_width = deluxe_width * v.stat / m;
                // 这些附加数据不要太亮

                if (Array.isArray(color)) {
                    svg += PanelDraw.LinearGradientRect(deluxe_x, rrect_y, Math.max(rect_width, height), height, height / 2, color, 0.4);
                } else {
                    svg += PanelDraw.Rect(deluxe_x, rrect_y, Math.max(rect_width, height), height, height / 2, color, 0.4);
                }
            }

            if (Array.isArray(color)) {
                svg += PanelDraw.LinearGradientRect(deluxe_x, rrect_y, deluxe_width, height, height / 2, color, 0.1);
            } else {
                svg += PanelDraw.Rect(deluxe_x, rrect_y, deluxe_width, height, height / 2, color, 0.1);
            }

        }
    }


    return svg;
}
