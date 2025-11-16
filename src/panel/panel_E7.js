import {
    ar2ms,
    cs2px,
    exportJPEG,
    getAvatar,
    getBeatMapTitlePath,
    getKeyDifficulty, getDifficultyIndex,
    getFileSize,
    getGameMode,
    getImageFromV3,
    getMapStatusImage,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    isBlankString,
    isEmptyArray,
    isNotEmptyArray,
    od2ms,
    readTemplate,
    setText,
    setTexts,
    floor,
    floors, getDiffBackground, rounds, getSvgBody
} from "../util/util.js";
import {getRankBackground} from "../util/star.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {extra, getMultipleTextPath, poppinsBold, torus} from "../util/font.js";
import {getRankColor, getStarRatingColor} from "../util/color.js";
import {label_E5, LABELS} from "../component/label.js";
import {drawLazerMods} from "../util/mod.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_E7(data);
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
        const svg = await panel_E7(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_E7(
    data = {
        match: {
            match: {
                match: [Object],
                events: [Array],
                users: [Array],
                first_event_id: 2421331035,
                latest_event_id: 2421331570,
                name: 'test4',
                id: 117301572,
                start_time: '2025-02-25T14:49:34Z',
                is_match_end: false
            },
            is_team_vs: false,
            score_count: 0,
            player_count: 0,
            first_map_bid: 0,
            round_count: 0,
            average_star: 0
        },
        mode: 'MANIA',
        players: [
            {
                id: 7003013,
                user_id: 7003013,
                bot: false,
                deleted: false,
                online: true,
                supporter: false,
                avatar_url: 'https://a.ppy.sh/7003013?1704285435.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: true,
                is_supporter: false,
                last_visit: '2025-02-25T14:49:22',
                pm_friends_only: false,
                username: 'Muziyami',
                country_code: 'CN',
                country: [Object]
            }
        ],
        beatmap: {
            bpm: 190.1,
            hp: 8,
            cs: 7,
            ar: 5,
            od: 8,
            beatmapset_id: 571547,
            difficulty_rating: 3.34,
            id: 1212852,
            mode: 'MANIA',
            status: 'ranked',
            total_length: 31,
            user_id: 4715184,
            version: "Kaito's 7K Hard",
            beatmapset: {
                offset: 0,
                source: '君の名は。',
                status: 'ranked',
                title: 'Zen Zen Zense',
                video: false,
                ranked: 1,
                storyboard: false,
                tags: 'kimi no na wa your name acoustic cover protastic101 linktaylord kaito-kun radwimps',
                ratings: [Array],
                bpm: 190,
                status_int: 1,
                artist: 'Gom (HoneyWorks)',
                artist_unicode: 'Gom（HoneyWorks）',
                covers: [Object],
                creator: 'Antalf',
                favourite_count: 808,
                id: 571547,
                nsfw: false,
                play_count: 1904695,
                preview_url: '//b.ppy.sh/preview/571547.mp3',
                spotlight: false,
                title_unicode: '前前前世',
                user_id: 8793773,
                can_be_hyped: false,
                discussion_locked: false,
                is_scoreable: true,
                last_updated: '2017-05-10T00:45:22Z',
                legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/556751',
                nominations_summary: [Object],
                ranked_date: '2017-05-17T01:00:51Z',
                submitted_date: '2017-02-11T19:25:45Z',
                availability: [Object],
                has_leader_board: true,
                preview_name: 'Gom (HoneyWorks) - Zen Zen Zense (Antalf) [571547]',
                public_rating: 9.110088070456365
            },
            checksum: '8e39df437bb3de2764ff0a5d1b300b18',
            failtimes: { fail: [Array], exit: [Array] },
            max_combo: 518,
            accuracy: 8,
            convert: false,
            count_circles: 332,
            count_sliders: 39,
            count_spinners: 0,
            drain: 8,
            hit_length: 30,
            is_scoreable: true,
            last_updated: '2017-05-10T00:45:23Z',
            owners: [ [Object] ],
            mode_int: 3,
            passcount: 32599,
            playcount: 52813,
            ranked: 1,
            url: 'https://osu.ppy.sh/beatmaps/1212852',
            has_leader_board: true,
            preview_name: "Gom (HoneyWorks) - Zen Zen Zense (Antalf) [Kaito's 7K Hard]",
            retries: [
                0,   0,   0,  0,   1,   0,  0,   0,   0,   0,   0,   0,
                0,   0,   0,  0,   0,   0,  0,   1,   0,  20,  46, 132,
                122,  88,  91, 99,  98, 163, 78, 101, 190, 239, 233,  96,
                45,  40,  69, 46,  29,  34, 62,  36,  53,  67,  52,  74,
                96, 137, 144, 89, 186, 111, 72,  37,  49,  16,  46,  17,
                46,  16,  66, 13,  51,  16, 23,  14,  49,  25,  47,  16,
                23,  26,   4,  6,  27,  30, 24,  29,  36,  35,  41,  18,
                18,   8,  26, 19,  20,  19,  4,   2,   2,   0,   1,   2,
                6,  12,   0,  5
            ],
            fail: 15638,
            fails: [
                0,   0,   0,   9,   0,   0,  18,   9,   9,   0,   0,   0,
                0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
                0, 380, 406, 237, 160, 290, 346, 274, 196, 380, 665, 935,
                475, 481, 260, 179, 142, 135, 117, 102,  94,  94, 171, 245,
                159, 169, 226, 407, 512, 893, 592, 403, 183, 160, 182, 118,
                139,  62, 123, 124,  90,  70,  43,  50,  19,  83,  97, 122,
                81,  49,  69,  42,  33,  47,  34,  57,  42,  38,  66, 127,
                116,  69, 102,  99, 113, 134,  79, 180, 316, 319, 251, 267,
                235, 601,  59, 178
            ],
            retry: 4230
        },
        density: [
            16, 13, 12, 14, 11, 13, 15, 13,
            14, 17, 12, 12, 15, 17, 13, 14,
            13, 12, 11, 13, 11, 12, 18, 11,
            15,  3,  2
        ],
        original: { cs: 7, ar: 5, od: 8, hp: 8, bpm: 190.1, drain: 30, total: 31 }
    }
) {
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');
    // 路径定义
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/;
    const reg_background = /(?<=<g filter="url\(#blur-PE-BG\)" style="clip-path: url\(#clippath-PE-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/;
    const reg_card_e1 = /(?<=<g id="Card_E1">)/;

    // 导入文字
    svg = setText(svg, getPanelNameSVG('Match Start (passive module)', 'ST'), reg_index);

    // 需要参数
    const match = data?.match || {}
    const players = data?.players || []
    const length = players?.length || 0

    const rounds = (match.match.events || []).filter(e => {return e.game != null})
    const last_round = isNotEmptyArray(rounds) ? rounds[rounds.length - 1] : {}

    const mode = getGameMode(data?.mode, 0, last_round?.mode);

    let rank
    if (length <= 1) rank = 'F'
    if (length <= 2) rank = 'D'
    if (length <= 4) rank = 'C'
    if (length <= 6) rank = 'B'
    if (length <= 8) rank = 'A'
    if (length <= 10) rank = 'S'
    if (length <= 12) rank = 'SH'
    if (length <= 14) rank = 'X'
    if (length <= 16) rank = 'XH'

    // 图片定义
    const background = getRankBackground(rank);
    const banner = await getDiffBackground(data.beatmap);

    // 卡片定义
    const cardA2 = card_A2(await PanelGenerate.matchRating2CardA2(data.match, data.beatmap, true));
    const componentE1 = component_E1(PanelEGenerate.score2componentE1(data.beatmap, mode));
    const componentE2 = component_E2(PanelEGenerate.score2componentE2(data.beatmap, data.density, rank));
    const componentE3 = component_E3(PanelEGenerate.score2componentE3(data.beatmap, data.original));
    const componentE4 = component_E4(PanelEGenerate.score2componentE4(data.beatmap));
    const componentE5 = component_E5(PanelEGenerate.score2componentE5(data.beatmap));
    const componentE6 = component_E6(await PanelEGenerate.score2componentE6(data.beatmap));
    const componentE8 = component_E8(PanelEGenerate.score2componentE8(data.mods));
    const componentE11 = component_E11(await PanelEGenerate.score2componentE11(data.beatmap));
    const componentE12 = component_E12(PanelEGenerate.score2componentE12(last_round, length));
    const componentE13 = await component_E13(PanelEGenerate.score2componentE13(players));


    // 导入卡片
    const bodyA2 = getSvgBody(40, 40, cardA2)
    const bodyE1 = getSvgBody(40, 330, componentE1)
    const bodyE2 = getSvgBody(40, 500, componentE2)
    const bodyE3 = getSvgBody(40, 770, componentE3)
    const bodyE4 = getSvgBody(550, 330, componentE4)
    const bodyE5 = getSvgBody(1280, 330, componentE5)
    const bodyE6 = getSvgBody(550, 880, componentE6)
    const bodyE8 = getSvgBody(1390, 500, componentE8)
    const bodyE11 = getSvgBody(550, 290, componentE11)
    const bodyE12 = getSvgBody(1390, 330, componentE12)
    const bodyE13 = getSvgBody(1390, 600, componentE13)

    svg = setText(svg, bodyA2, reg_card_a1)

    svg = setTexts(svg, [bodyE1, bodyE2, bodyE3, bodyE4, bodyE5, bodyE6, bodyE8, bodyE11, bodyE12, bodyE13], reg_card_e1)

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.6);

    if (getFileSize(banner) / 1024 >= 500) {
        svg = setImage(svg, 0, 0, 1920, 320, banner, reg_banner, 0.8, "xMidYMin slice");
    } else {
        svg = setImage(svg, 0, 0, 1920, 320, banner, reg_banner, 0.8);
    }

    return svg.toString();
}


const card_E7 = async (
    data = {
        avatar: '',
        name: '',
        name_color: 'none',

        show_name: false,
    }) => {

    let svg = `
            <defs>
                <clipPath id="clippath-CE7-1">
                    <circle cx="50" cy="40" r="40" style="fill: none;"/>
                </clipPath>
            </defs>
        <g id="Base_CE7">
        </g>
        <g id="Background_CE7" style="clip-path: url(#clippath-CE7-1);">
        </g>
        <g id="Text_CE7">
        </g>
    `;
    if (isBlankString(data?.avatar)) return ''

    const reg_text = /(?<=<g id="Text_CE7">)/;
    const reg_avatar = /(?<=<g id="Background_CE7" style="clip-path: url\(#clippath-CE7-1\);">)/;

    const avatar = await getAvatar(data?.avatar);
    const name = (data?.show_name === true) ? torus.getTextPath(
        torus.cutStringTail(data?.name, 18, 104)
        , 50, 100, 18, 'center baseline', data?.name_color) : ''

    svg = setImage(svg, 10, 0, 80, 80, avatar, reg_avatar, 1)
    svg = setText(svg, name, reg_text)

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

    const star_number = floors(star, 2)

    const text_arr = [
        {
            font: "poppinsBold",
            text: star_number.integer,
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: star_number.decimal,
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

    const background = data?.background

    const rect = PanelDraw.Rect(0, 0, 820, 160, 20, '#382e32', 1);

    svg = setTexts(svg, [t.title, t.title_unicode, bid, creator, diff], reg_label);
    svg = setImage(svg, 0, 0, 820, 160, background, reg_background, 0.4);
    svg = setText(svg, rect, reg_base);

    return svg;
}

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

    const mods = drawLazerMods(data.mods, 480, 4, 70, 450, 'right', 8, true).svg

    const title = poppinsBold.getTextPath('Mods', 15, 28, 18, 'left baseline');

    const rect = PanelDraw.Rect(0, 0, 490, 80, 20, '#382e32', 1);

    svg = setText(svg, mods, reg_mods);
    svg = setText(svg, title, reg_text);
    svg = setText(svg, rect, reg_base);

    return svg;
}

const component_E11 = (
    data = {
        background: ''
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

    const cover = data?.background
    const hexagon = getImageFromV3('object-beatmap-hexagon.png')
    const base = getImageFromV3('object-beatmap-mask.png')

    svg = setImage(svg, 200, 75, 420, 450, hexagon, reg_overlay, 1)
    svg = setImage(svg, 220, 95, 380, 410, cover, reg_cover, 1)
    svg = setImage(svg, 200, 75, 420, 450, base, reg_base, 1)

    return svg;
}

const component_E12 = (
    data = {
        scoring_type: '',
        team_type: '',
        vs_type: '',
        player_count: 1,
    }
) => {

    // 读取模板
    let svg =
        `   <defs>
            <clipPath id="clippath-OE12-1">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE12-2">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE12-3">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE12-4">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE12-5">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE12-6">
                <rect id="SR_Base" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <linearGradient id="grad-OE12-12" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(79,172,254); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(0,242,254); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE12-13" x1="0%" y1="0" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(94,220,91); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(202,248,129); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE12-14" x1="0%" y1="0" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(252,172,70); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(254,220,69); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE12-15" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(231,72,138); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,120,107); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OE12-16" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(79,172,254); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(0,242,254); stop-opacity:1" />
            </linearGradient>
          </defs>
          <g id="Base_OE12">
            <rect id="Base" x="0" y="0" width="490" height="150" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="Star" x="15" y="105" width="460" height="30" rx="15" ry="15" style="fill: url(#grad-OE12-12); fill-opacity: 0.2"/>
          </g>
          <g id="Rect_OE12">
            <g id="Clip_OE12-6" style="clip-path: url(#clippath-OE12-6);">
            
            </g>
            <g id="Clip_OE12-5" style="clip-path: url(#clippath-OE12-5);">
            
            </g>
            <g id="Clip_OE12-4" style="clip-path: url(#clippath-OE12-4);">
            
            </g>
            <g id="Clip_OE12-3" style="clip-path: url(#clippath-OE12-3);">
            
            </g>
            <g id="Clip_OE12-2" style="clip-path: url(#clippath-OE12-2);">
            
            </g>
          </g>
          <g id="Text_OE12">
          </g>`;

    const reg_text = /(?<=<g id="Text_OE12">)/;
    /*
    const reg_clip2 = /(?<=<g id="Clip_OE12-2" style="clip-path: url\(#clippath-OE12-2\);">)/;
    const reg_clip3 = /(?<=<g id="Clip_OE12-3" style="clip-path: url\(#clippath-OE12-3\);">)/;
    const reg_clip4 = /(?<=<g id="Clip_OE12-4" style="clip-path: url\(#clippath-OE12-4\);">)/;
    const reg_clip5 = /(?<=<g id="Clip_OE12-5" style="clip-path: url\(#clippath-OE12-5\);">)/;

     */
    const reg_clip6 = /(?<=<g id="Clip_OE12-6" style="clip-path: url\(#clippath-OE12-6\);">)/; //181,100,217 | 238,96,156


    const text_arr = [
        {
            font: "poppinsBold",
            text: data?.team_type,
            size: 84,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: ' ' + data?.vs_type,
            size: 48,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: ' / ' + data?.scoring_type,
            size: 24,
            color: '#fff',
        },
    ]

    const texts = getMultipleTextPath(text_arr, 20, 88, "left baseline");

    const title = poppinsBold.getTextPath('Scoring Type', 475, 28, 18, 'right baseline', '#fff')

    const width = Math.max((data?.player_count || 0) / 16 * 460, 30)

    const player_rect = PanelDraw.Rect(15, 105, width, 30, 15, "url(#grad-OE12-16)", 1);
    const player_text = poppinsBold.getTextPath(data?.player_count.toString(), 15 + width - 10, 128, 24, 'right baseline', '#fff');

    svg = setText(svg, player_rect, reg_clip6);
    svg = setTexts(svg, [texts, title, player_text], reg_text);

    return svg;

}

const component_E13 = async (
    data = {
        players: [],
    }
) => {
    let svg = `
        <g id="Base_OE13">
        </g>
        <g id="Avatar_OE13">
        </g>
        <g id="Text_OE13">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE13">)/;
    const reg_avatar = /(?<=<g id="Avatar_OE13">)/;
    const reg_base = /(?<=<g id="Base_OE13">)/;

    const title = poppinsBold.getTextPath('Lobby', 15, 28, 18, 'left baseline', '#fff');

    const length = data.players?.length || 0

    if (length <= 12) {
        outer : for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 3; j++) {
                const k = i * 4 + j

                if (k >= length) break outer;
                const e7 = await card_E7(PanelEGenerate.player2cardE7(data.players[k], true))

                svg = setSvgBody(svg, j * 118 + 18, i * 135 + 40, e7, reg_avatar)
            }
        }
    } else {
        outer : for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
                const k = i * 4 + j

                if (k >= length) break outer;
                const e7 = await card_E7(PanelEGenerate.player2cardE7(data.players[k], false))

                svg = setSvgBody(svg, j * 118 + 18, i * 100 + 40, e7, reg_avatar)
            }
        }
    }

    const rect = PanelDraw.Rect(0, 0, 490, 440, 20, '#382e32', 1);

    svg = setText(svg, title, reg_text);
    svg = setText(svg, rect, reg_base);

    return svg.toString()
}

// 私有转换方式
const PanelEGenerate = {
    player2cardE7: (player, show_name = false) => {
        return {
            avatar: player?.avatar_url || '',
            name: player?.username || '',
            name_color: '#fff',

            show_name: show_name,
        }
    },

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

        const bpm = floors(b?.bpm, 2)
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
            }, {
                ...LABELS.CS,
                ...stat2label(b?.cs, cs2px(b?.cs, mode),
                    getProgress(b?.cs, cs_min, cs_max), original.cs, isDisplayCS),
                bar_min: cs_min,
                bar_mid: cs_mid,
                bar_max: cs_max,
            }, {
                ...LABELS.AR,
                ...stat2label(b?.ar, ar2ms(b?.ar, mode),
                    getProgress(b?.ar, ar_min, ar_max), original.ar, isDisplayAR),
                bar_min: ar_min,
                bar_mid: ar_mid,
                bar_max: ar_max,
            }, {
                ...LABELS.OD,
                ...stat2label(b?.od, od2ms(b?.od, mode),
                    getProgress(b?.od, od_min, od_max), original.od, isDisplayOD),
                bar_min: od_min,
                bar_mid: od_mid,
                bar_max: od_max,
            }, {
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

    score2componentE6: async (b) => {
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
            background: await getDiffBackground(b),
            creator: creators,
        }
    },

    score2componentE8: (mods) => {
        return {
            mods: mods,
        }
    },

    score2componentE11: async (b) => {
        return {
            background: await getDiffBackground(b),
        }
    },

    score2componentE12: (event = {}, player_count = 1) => {
        let scoring_type;
        switch (event?.game?.scoring_type) {
            case "score":
                scoring_type = 'score V1';
                break
            case "scorev2":
                scoring_type = 'score V2';
                break
            case "accuracy":
                scoring_type = 'accuracy';
                break
            case "combo":
                scoring_type = 'combo';
                break
            default:
                scoring_type = 'unknown';
                break
        }

        let team_type;
        let vs_type;
        switch (event?.game?.team_type) {
            case "team-vs":
                team_type = 'VS';
                vs_type = 'TEAM';
                break
            case "head-to-head":
                team_type = 'VS';
                vs_type = 'H2H';
                break
            case "tag-coop":
                team_type = 'TAG';
                vs_type = 'COOP';
                break
            case "tag-team-vs":
                team_type = 'TAG';
                vs_type = 'VS';
                break
            default:
                team_type = '?';
                vs_type = '?';
                break
        }

        return {
            scoring_type: scoring_type,
            team_type: team_type,
            vs_type: vs_type,
            player_count: player_count,
        }
    },

    score2componentE13: (players) => {
        return {
            players: players
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
