import {
    ar2ms,
    cs2px,
    exportJPEG,
    getAvatar,
    getBeatMapTitlePath,
    getDiffBG,
    getDifficultyName,
    getFileSize,
    getGameMode,
    getImageFromV3,
    getMapStatusImage,
    getPanelNameSVG,
    implantImage,
    implantSvgBody,
    isBlankString,
    isEmptyArray,
    isNotEmptyArray,
    od2ms,
    readTemplate,
    replaceText,
    replaceTexts,
    round,
    rounds
} from "../util/util.js";
import {getRankBG, hasLeaderBoard} from "../util/star.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {extra, getMultipleTextPath, poppinsBold, torus} from "../util/font.js";
import {getModColor, getRankColor, getStarRatingColor} from "../util/color.js";
import {label_E5, LABELS} from "../component/label.js";
import {getModAdditionalInformation} from "../util/mod.js";

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
        density: [
            21, 29, 60, 48, 46, 46, 43, 61,
            15, 38, 71, 47, 45, 39, 45, 42,
            31, 0, 6, 23, 16, 41, 34, 50,
            46, 24, 22
        ],
        mode: 'OSU',
        beatmap: {
            beatmapset_id: 1068409,
            difficulty_rating: 5.17,
            id: 2474678,
            mode: 'OSU',
            status: 'ranked',
            total_length: 301,
            user_id: 10063190,
            version: 'Insane',
            beatmapset: {
                offset: 0,
                status: 'ranked',
                title: 'Hype feat. Such',
                video: false,
                artist: 'PSYQUI',
                artist_unicode: 'PSYQUI',
                covers: [Object],
                creator: 'Smug Nanachi',
                favourite_count: 691,
                id: 1068409,
                nsfw: false,
                play_count: 775865,
                preview_url: '//b.ppy.sh/preview/1068409.mp3',
                spotlight: false,
                title_unicode: 'Hype feat. Such',
                user_id: 10063190,
                preview_name: 'PSYQUI - Hype feat. Such (Smug Nanachi) [1068409]',
                public_rating: 0,
                has_leader_board: true
            },
            max_combo: 0,
            retries: [0],
            fails: [0],
            preview_name: 'PSYQUI - Hype feat. Such (Smug Nanachi) [Insane]',
            retry: 0,
            fail: 0,
            has_leader_board: true
        },
        match: {
            match: {
                match: [Object],
                events: [Array],
                users: [Array],
                first_event_id: 2404410052,
                latest_event_id: 2404414518,
                name: '<6.8* and <7min',
                id: 116463100,
                start_time: '2024-12-11T07:28:32Z',
                is_match_end: false,
                current_game_id: 606844256
            },
            player_data_list: [[Object], [Object], [Object], [Object], [Object]],
            team_point_map: {none: 11},
            is_team_vs: false,
            average_star: 5.935454467426647,
            first_map_bid: 2535520,
            round_count: 11,
            score_count: 27,
            player_count: 5
        },
        players: [
            {
                id: 22765044,
                bot: false,
                deleted: false,
                online: true,
                user_id: 22765044,
                supporter: false,
                avatar_url: 'https://a.ppy.sh/22765044?1689314108.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: true,
                is_supporter: false,
                last_visit: '2024-12-11T08:30:57',
                pm_friends_only: false,
                username: 'SayaBeMySide',
                country_code: 'CN',
                country: [Object]
            },
            {
                id: 32823926,
                bot: false,
                deleted: false,
                online: true,
                user_id: 32823926,
                supporter: false,
                avatar_url: 'https://a.ppy.sh/32823926?1730204073.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: true,
                is_supporter: false,
                last_visit: '2024-12-11T08:30:55',
                pm_friends_only: false,
                username: 'Rui23',
                country_code: 'CN',
                country: [Object]
            },
            {
                id: 26357944,
                bot: false,
                deleted: false,
                online: true,
                user_id: 26357944,
                supporter: false,
                avatar_url: 'https://a.ppy.sh/26357944?1733273465.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: true,
                is_supporter: false,
                last_visit: '2024-12-11T08:30:53',
                pm_friends_only: false,
                username: '0723',
                country_code: 'CN',
                country: [Object]
            },
            {
                id: 16276378,
                bot: false,
                deleted: false,
                online: true,
                user_id: 16276378,
                supporter: false,
                avatar_url: 'https://a.ppy.sh/16276378?1723052275.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: true,
                is_supporter: false,
                last_visit: '2024-12-11T08:30:54',
                pm_friends_only: false,
                username: 'Lezr',
                country_code: 'CN',
                country: [Object]
            },
            {
                id: 27608705,
                bot: false,
                deleted: false,
                online: true,
                user_id: 27608705,
                supporter: true,
                avatar_url: 'https://a.ppy.sh/27608705?1729442880.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: true,
                is_supporter: true,
                last_visit: '2024-12-11T08:30:54',
                pm_friends_only: false,
                username: 'fufuOwO',
                country_code: 'CN',
                country: [Object]
            }
        ]
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
    const reg_card_e2 = /(?<=<g id="Card_E2">)/;
    const reg_card_e3 = /(?<=<g id="Card_E3">)/;

    // 导入文字
    svg = replaceText(svg, getPanelNameSVG('Match Start (passive module)', 'ST', 'v0.5.0 DX'), reg_index);

    // 需要参数
    const match = data?.match || {}
    const players = data?.players || []
    const length = players?.length || 0

    let rounds = (match.match.events || []).filter(e => {return e.game != null})
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
    const background = getRankBG(rank);
    const banner = await getDiffBG(data?.beatmap?.id, data?.beatmap?.beatmapset?.id, 'cover', hasLeaderBoard(data?.beatmap.ranked), data?.beatmap?.beatmapset?.availability?.more_information != null);

    // 卡片定义
    const cardA2 = card_A2(await PanelGenerate.matchRating2CardA2(data.match, data.beatmap, true));
    const componentE1 = component_E1(PanelEGenerate.score2componentE1(data.beatmap, mode));
    const componentE2 = component_E2(PanelEGenerate.score2componentE2(data.beatmap, data.density, rank));
    const componentE3 = component_E3(PanelEGenerate.score2componentE3(data.beatmap, data.original));
    const componentE4 = component_E4(PanelEGenerate.score2componentE4(data.beatmap));
    const componentE5 = component_E5(PanelEGenerate.score2componentE5(data.beatmap));
    const componentE6 = await component_E6(PanelEGenerate.score2componentE6(data.beatmap));
    const componentE8 = component_E8(PanelEGenerate.score2componentE8(data.mods));
    const componentE11 = await component_E11(PanelEGenerate.score2componentE11(data.beatmap));
    const componentE12 = component_E12(PanelEGenerate.score2componentE12(last_round, length));
    const componentE13 = await component_E13(PanelEGenerate.score2componentE13(players));
    // 导入卡片
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_card_a1);
    svg = implantSvgBody(svg, 40, 330, componentE1, reg_card_e1);
    svg = implantSvgBody(svg, 40, 500, componentE2, reg_card_e1);
    svg = implantSvgBody(svg, 40, 770, componentE3, reg_card_e1);
    svg = implantSvgBody(svg, 550, 330, componentE4, reg_card_e2);
    svg = implantSvgBody(svg, 1280, 330, componentE5, reg_card_e2);
    svg = implantSvgBody(svg, 550, 880, componentE6, reg_card_e2);
    svg = implantSvgBody(svg, 1390, 500, componentE8, reg_card_e3);
    svg = implantSvgBody(svg, 550, 290, componentE11, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 330, componentE12, reg_card_e3);
    svg = implantSvgBody(svg, 1390, 600, componentE13, reg_card_e3);

    // 导入图片
    svg = implantImage(svg, 1920, 1080, 0, 0, 0.6, background, reg_background);

    if (getFileSize(banner) / 1024 >= 500) {
        svg = implantImage(svg, 1920, 330, 0, 0, 0.8, banner, reg_banner, "xMidYMin slice");
    } else {
        svg = implantImage(svg, 1920, 330, 0, 0, 0.8, banner, reg_banner);
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

    svg = implantImage(svg, 80, 80, 10, 0, 1, avatar, reg_avatar)
    svg = replaceText(svg, name, reg_text)

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

    const star_number = rounds(star, 2)

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

            svg = implantSvgBody(svg, 15 + 235 * i, 38 + 76 * j, e5, reg_label);
        }
    }

    const rect = PanelDraw.Rect(0, 0, 490, 270, 20, '#382e32', 1);

    svg = replaceTexts(svg, [title, rect], reg_label)

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

    const fav = poppinsBold.getTextPath(round(data?.favorite, 1, -1), 78, 25, 16, 'right baseline', '#fff')
    const pc = poppinsBold.getTextPath(round(data?.playcount, 1, -1), 78, 47, 16, 'right baseline', '#fff')

    svg = replaceTexts(svg, [fav, pc], reg_text);
    svg = implantImage(svg, 18, 18, 12, 10 - 1, 1, getImageFromV3('object-beatmap-favorite.png'), reg_text);
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

    svg = replaceTexts(svg, [t.title, t.title_unicode, bid, creator, diff], reg_label);
    svg = implantImage(svg, 820, 160, 0, 0, 0.4, background, reg_background);
    svg = replaceText(svg, rect, reg_base);

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

    const mods = getModsSVG(data.mods, 390, 10, 90, 42, 50); // y = 15

    const title = poppinsBold.getTextPath('Mods', 15, 28, 18, 'left baseline');

    const rect = PanelDraw.Rect(0, 0, 490, 80, 20, '#382e32', 1);

    svg = replaceText(svg, mods, reg_mods);
    svg = replaceText(svg, title, reg_text);
    svg = replaceText(svg, rect, reg_base);

    return svg;
}

const component_E11 = async (
    data = {
        bid: 0,
        sid: 0,
        ranked: 0,
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

    svg = implantImage(svg, 420, 450, 200, 75, 1, hexagon, reg_overlay)
    svg = implantImage(svg, 380, 410, 220, 95, 1, cover, reg_cover)
    svg = implantImage(svg, 420, 450, 200, 75, 1, base, reg_base)

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

    svg = replaceText(svg, player_rect, reg_clip6);
    svg = replaceTexts(svg, [texts, title, player_text], reg_text);

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

                svg = implantSvgBody(svg, j * 118 + 18, i * 135 + 40, e7, reg_avatar)
            }
        }
    } else {
        outer : for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
                const k = i * 4 + j

                if (k >= length) break outer;
                const e7 = await card_E7(PanelEGenerate.player2cardE7(data.players[k], false))

                svg = implantSvgBody(svg, j * 118 + 18, i * 100 + 40, e7, reg_avatar)
            }
        }
    }

    const rect = PanelDraw.Rect(0, 0, 490, 440, 20, '#382e32', 1);

    svg = replaceText(svg, title, reg_text);
    svg = replaceText(svg, rect, reg_base);

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
        // sr 2 difficulty name
        const sr = b?.difficulty_rating || 0;

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
                else if (sr < 1.8) name = 'CUP';
                else if (sr < 2.5) name = 'SALAD';
                else if (sr < 3.5) name = 'PLATTER';
                else if (sr < 4.6) name = 'RAIN';
                else if (sr < 6) name = 'OVERDOSE';
                else if (sr >= 6) name = 'DELUGE';
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
            difficulty_name: getDifficultyName(b) || '',
            bid: b?.id || 0,
            sid: b?.beatmapset?.id || 0,
            creator: creators,
            status: b?.status || 'pending',
            is_dmca: b?.beatmapset?.availability?.more_information != null
        }
    },

    score2componentE8: (mods) => {
        return {
            mods: mods || [],
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

    function insertMod(mod, x, y, w, text_h) {
        const acronym = mod?.acronym || ''
        const mod_color = getModColor(acronym)
        const additional = getModAdditionalInformation(mod);

        const mod_additional_path = torus.getTextPath(additional, x + (w / 2), y + text_h - 28, 16, 'center baseline', '#fff');
        const mod_abbr_path = torus.getTextPath(acronym, x + (w / 2), y + text_h, 36, 'center baseline', '#fff');

        return `<path transform="translate(${x} ${y})"  d="m70.5,4l15,20c2.667,3.556,2.667,8.444,0,12l-15,20c-1.889,2.518-4.852,4-8,4H27.5c-3.148,0-6.111-1.482-8-4l-15-20c-2.667-3.556-2.667-8.444,0-12L19.5,4C21.389,1.482,24.352,0,27.5,0h35c3.148,0,6.111,1.482,8,4Z" style="fill: ${mod_color};"/>\n` + mod_abbr_path + '\n' + mod_additional_path + '\n';
    }

    return svg;
}
