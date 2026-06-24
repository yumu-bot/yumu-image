import {createImageRouter, createSvgRouter} from "../util/image.js";
import {colorArray, getGlobalRankPercentColor, getGlobalRankPercentName, PanelColor} from "../util/color.js";
import {
    getAvatar, getFlagPath, getGameMode, getImage,
    getPanelNameSVG, getRandomString,
    getSvgBody, readNetImage,
    rotateSvgBody, rounds,
    setCustomBanner,
    setSvgBody,
    setText,
    setTexts, thenPush
} from "../util/util.js";
import {beatmapset2Task, imageDownloader, toTask, user2Task} from "../util/download.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {extra, getMultipleTextPath, poppinsBold, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {label_E5, LABEL_S} from "../component/label.js";

export const router = createImageRouter(panel_S);

export const router_svg = createSvgRouter(panel_S);


/**
 * 快速匹配信息面板
 * !ri xxx
 * @param data
 * @return {Promise<string>}
 */
export async function panel_S(data = {
    user: {}, recently: [],

    stats: {
        play_time: 6424,
        map_count: 41,
        average_combo: 429,
        average_difficulty: 5.41,
        average_accuracy: 0.9131573170731703
    },

    surrounding: [{
        id: 17621384,
        username: 'Seriak',
        country: [Object],
        wins: 6,
        playcount: 12,
        rating: 1643,
        rank: 9675,
        absolute_rank: 9675,
        provisional: false
    }], rating: 1.1240942774099782, total_players: 96500
}) {
    // 自设定义
    const has_custom_panel = false;

    const {
        user = {},
        mode = 'osu',
        recently = [],
        stats = {},
        surrounding = [],
        rating: mu_rating = 0,
        total_players = 0,
    } = data

    const {
        first_placements = 0,
        plays = 0,
        rank = 0,
        rating: mm_rating = 0,
    } = user?.matchmaking_stats?.[0] ?? {}

    const hue = user?.profile_hue ?? 342

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PS-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PS-BG">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PS-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PS-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PS-BG)" style="clip-path: url(#clippath-PS-BG);">
        </g>
    </g>
    <g id="Component">
    </g>
    <g id="Card_A1">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: ${PanelColor.middle(hue)};"/>
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PS-1\);">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/

    // 面板文字
    const panel_name = getPanelNameSVG("Ranked Play Info", 'RI');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 下图
    const promised_a1s = user2Task(user)

    const promise_s2s = beatmapset2Task(recently.flatMap(r => r.rounds), 'list')

    const promise_s1s = recently.flatMap(
        r => r.rounds
            .flatMap(rs => rs.scores)
            .map(ss => ss?.user ?? {}))
        .map(u => toTask('avatar', u.id,
            () => getAvatar(u))
        )

    const promise_s3s = surrounding.map(u => toTask('avatar', u.id,
        () => getAvatar(u.id))
    )

    const tasks = [
        ...promised_a1s,
        ...promise_s2s,
        ...promise_s1s,
        ...promise_s3s
    ];

    const images = await imageDownloader(tasks);

    const cardA1 = await card_A1(
        PanelGenerate.user2CardA1(user, null, images.get(`avatar_${user.id}`), images.get(`banner_${user.id}`))
    );

    const componentS1 = component_S1(
        PanelSGenerate.rank2componentS1(
             rank, total_players, mode, has_custom_panel, hue
        ));
    const componentS2 = component_S2(
        PanelSGenerate.rating2componentS2(
            mu_rating, mm_rating, has_custom_panel, hue
        ));
    const componentS3 = component_S3(
        PanelSGenerate.stats2componentS3(
            stats, plays, has_custom_panel, hue
        ));
    const componentS4 = await component_S4(
        PanelSGenerate.recently2componentS4(
            recently, user?.id, images, has_custom_panel, hue
        ));
    const componentS5 = component_S5(
        PanelSGenerate.rate2componentS5(
            first_placements, plays, has_custom_panel, hue
        ));
    const componentS6 = await component_S6(
        PanelSGenerate.surrounding2componentS6(
            surrounding, images, has_custom_panel, hue
        ));

    const bodyS1 = getSvgBody(40, 330, componentS1)
    const bodyS2 = getSvgBody(40, 700, componentS2)
    const bodyS3 = getSvgBody(500, 330, componentS3)
    const bodyS4 = getSvgBody(500, 560, componentS4)
    const bodyS5 = getSvgBody(1450, 330, componentS5)
    const bodyS6 = getSvgBody(1450, 500, componentS6)

    svg = setCustomBanner(svg, user?.profile?.banner, reg_banner);

    svg = setTexts(svg, [bodyS1, bodyS2, bodyS3, bodyS4, bodyS5, bodyS6], reg_component);

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);
    
    return svg
}

const RANK_RULES = [
    { limit: 0.0005, name: 'Radiant',  color: colorArray.radiant }, // 前 0.05%
    { limit: 0.005,  name: 'Rhodium',  color: colorArray.rhodium }, // 前 0.5%
    { limit: 0.04,   name: 'Platinum', color: colorArray.platinum },// 前 4%
    { limit: 0.15,   name: 'Gold',     color: colorArray.gold },    // 前 15%
    { limit: 0.40,   name: 'Silver',   color: colorArray.silver },  // 前 40%
    { limit: 0.75,   name: 'Bronze',   color: colorArray.bronze },  // 前 75%
    { limit: 1.0,    name: 'Iron',     color: colorArray.iron },    // 剩余部分
];

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_S1 = (
    data = {
        rank: 0,
        total_players: 0,
        mode: 'osu',

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S1">`
    const hide = data.has_custom_panel === true

    const percent = data.rank / Math.max(data.total_players, 1)

    const colors = getGlobalRankPercentColor(data.rank, percent, RANK_RULES)
    const ranks = getGlobalRankPercentName(data.rank, percent, RANK_RULES)

    const base = rotateSvgBody(PanelDraw.LinearGradientRect(215 - 80, 150 - 80, 160, 160, 20, colors, 1, [100, 0], [60, 40]), 215,  150, 45)

    const random = getRandomString(6)

    const title = hide ? '' : poppinsBold.getTextPath('Rank', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 430, 340, 20, PanelColor.middle(data.hue), 1)

    const mode = extra.getTextPath(
        getGameMode(data.mode, -1), 215, 205 - 10, 128, 'center baseline', '#fff'
    )

    const mode_base = PanelDraw.LinearGradientRect(
        215 - 60, 150 - 60, 60 * 2, 60 * 2, 0, [PanelColor.base(data.hue), PanelColor.middle(data.hue)], 1, [80, 20], [60, 40]
    )

    const rank = poppinsBold.getTextPath(ranks, 215, 305, 30, 'center baseline', '#fff', 1)

    svg += `
    <defs>
        <mask id="Mask_S1_${random}">
            ${mode}
        </mask>
    </defs>
    ${rrect}
    ${base}
    <g mask="url(#Mask_S1_${random})">
        ${mode_base}
    </g>
    ${rank}
    ${title}
`

    return svg;
}

const component_S2 = (
    data = {
        mu_rating: 0,
        mm_rating: 0,

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S2">`
    const hide = data.has_custom_panel === true

    const rating_round = rounds(data.mu_rating, 2)

    const rating = poppinsBold.get2SizeTextPath(
        rating_round.integer, rating_round.decimal, 90, 72, 215, 205, 'center baseline', '#fff'
    )

    const elo = poppinsBold.getTextPath(String(data?.mm_rating), 215, 305, 30, 'center baseline', '#fff', 1)

    const arc = PanelDraw.RoundedArcBar(215, 40 + 270 / 2, 210 / 2, 270 / 2, -45, 225, PanelColor.top(data.hue))

    const angle = (225 + 45)

    let green_angle

    if (data.mu_rating < 1) {
        green_angle = -45 + data.mu_rating * angle / 2
    } else {
        green_angle = -45 + (Math.min(1, data.mu_rating - 1) + 1) * angle / 2
    }

    const arc_green = PanelDraw.RoundedArcBar(215, 40 + 270 / 2, 210 / 2, 270 / 2, -45, green_angle, '#fff')

    const defs = `
    <defs>
        <mask id="arc-mask-1">
            ${arc_green}
        </mask>
    </defs>`

    const arc_light_body = `
    <g mask="url(#arc-mask-1)">
        ${PanelDraw.LinearGradientRect(80, 40, 270, 270, 0, colorArray.cyan)}}
    </g>`

    const title = hide ? '' : poppinsBold.getTextPath('Rating', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 430, 340, 20, PanelColor.middle(data.hue), 1)

    return [svg, defs, rrect, title, elo, rating, arc, arc_light_body, '</g>'].join('')
}

const component_S3 = (
    data = {
        playcounts: 0,
        count: 0,
        time: 0,
        combo: 0,
        difficulty: 0.0,
        accuracy: 0.0,

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S3">`
    const hide = data.has_custom_panel === true

    const sr = rounds(data.difficulty, 2)
    const acc = rounds((data?.accuracy ?? 0) * 100, 2)

    const total_sec = data.time; // 假设 data.time 是传入的秒数

    const hours = Math.floor(total_sec / 3600);
    const minutes = Math.floor((total_sec % 3600) / 60);
    const seconds = total_sec % 60;

    const labels = [
        {
            ...LABEL_S.PC,
            data_b: String(data.playcounts),
            data_m: '',
            bar_progress: getProgress(data.playcounts, LABEL_S.PC.bar_min, LABEL_S.PC.bar_max),
            hide: hide,
            max_width: 280,
        }, {
            ...LABEL_S.MAP_PC,
            data_b: String(data.count),
            data_m: '',
            bar_progress: getProgress(data.count, LABEL_S.MAP_PC.bar_min, LABEL_S.MAP_PC.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.SR,
            data_b: sr.integer,
            data_m: sr.decimal,
            bar_progress: getProgress(data.difficulty, LABEL_S.SR.bar_min, LABEL_S.SR.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.PT,
            data_b: `${hours}h`,
            data_m: ` ${minutes}m ${seconds}s`,
            bar_progress: getProgress(hours, LABEL_S.PT.bar_min, LABEL_S.PT.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.COMBO,
            data_b: String(data.combo),
            data_m: '',
            bar_progress: getProgress(data.combo, LABEL_S.COMBO.bar_min, LABEL_S.COMBO.bar_max),
            hide: hide,
            max_width: 280,
        },{
            ...LABEL_S.ACC,
            data_b: acc.integer,
            data_m: `${acc.decimal}%`,
            bar_progress: getProgress((data?.accuracy ?? 0) * 100, LABEL_S.ACC.bar_min, LABEL_S.ACC.bar_max),
            hide: hide,
            max_width: 280,
        },
    ]

    const string_e5s = labels.map((label, i) => {
        let x, y;

        x = 15 + 300 * (i % 3);
        y = 40 + 75 * Math.floor(i / 3);

        return getSvgBody(x, y, label_E5(label));
    }).join('');


    const title = hide ? '' : poppinsBold.getTextPath('Mapping Statistics', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 920, 200, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, title, string_e5s, '</g>'].join('')
}


const component_S4 = async (
    data = {
        recently: [],
        me: 7003013,
        images: new Map(),

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S4">`
    const hide = data.has_custom_panel === true

    const recently = (data?.recently ?? [])

    const card_s1s = []
    const string_s1s = []

    const results = await Promise.allSettled(recently.map((v) => {
        return card_S1(v, data.me, data.images, data.hue)
    }))

    thenPush(results, card_s1s)

    for (let i = 0; i < 4; i++) {
        const s1 = card_s1s[i]

        const y = 40 + i * 110

        string_s1s.push(getSvgBody(20, y, s1))
    }

    const title = hide ? '' : poppinsBold.getTextPath('Match History', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 920, 480, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, title, string_s1s.join('\n'), '</g>'].join('')
}

const component_S5 = (
    data = {
        first_placements: 0,
        plays: 0,

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S5">`
    const hide = data.has_custom_panel === true

    const first = data?.first_placements ?? 0
    const play = data?.plays ?? 0

    const wr = first / Math.max(1, play)

    const wr_round = rounds(wr * 100, 2)

    const text_arr = [{
        font: "poppinsBold", text: wr_round.integer, size: 84, color: '#fff',
    }, {
        font: "poppinsBold", text: wr_round.decimal + '%', size: 48, color: '#fff',
    }, {
        font: "poppinsBold", text: ` [${first}/${play}]`, size: 24, color: '#fff',
    },]

    const progress = wr > 1e-4 ? Math.min(Math.max(wr * 395, 30), 395) : 0

    const win_rate = getMultipleTextPath(text_arr, 20, 88, 'left baseline')

    const win_rrect = PanelDraw.LinearGradientRect(20, 105, progress, 30, 15, colorArray.light_green)
    const lose_rrect = PanelDraw.LinearGradientRect(20, 105, 395, 30, 15, colorArray.red)

    const title = hide ? '' : poppinsBold.getTextPath('Win Rate', 430 - 15, 27, 18, 'right baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 430, 150, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, title, lose_rrect, win_rrect, win_rate, '</g>'].join('')
}

const component_S6 = async (
    data = {
        surrounding: [],
        images: new Map(),

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_S6">`
    const hide = data.has_custom_panel === true

    const surrounding = (data?.surrounding ?? [])

    const card_s2s = []
    const string_s2s = []

    const results = await Promise.allSettled(surrounding.map((v) => {
        return card_S2({
            avatar: data.images.get(`avatar_${v.id}`) ?? getAvatar(v.id),
            country: v.country?.code ?? 'XX',
            name: v.username ?? 'Unknown',
            wins: v.wins ?? 0,
            playcount: v.playcount ?? 0,
            rank: v.rank ?? 0,
            provisional: v.provisional ?? false,
            has_custom_panel: data.has_custom_panel,
            hue: data.hue
        })
    }))

    thenPush(results, card_s2s)

    for (let i = 0; i < 7; i++) {
        const s2 = card_s2s[i]

        const y = 45 + i * 70

        string_s2s.push(getSvgBody(20, y, s2))
    }

    const title = hide ? '' : poppinsBold.getTextPath('Your Ranking', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 430, 540, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, title, string_s2s.join('\n'), '</g>'].join('')
}

const card_S1 = async (
    recent = {
        duration: 488, room_id: 3056562, players: [7003013, 11925374], wins: [2, 1], names: ["Player1", "Player2"],

        rounds: [],
    },

    me = 7003013,
    images = new Map(),
    hue,
) => {
    let svg = `<g id="Card_S1">`

    const random = getRandomString(6)

    const defs = `<defs>
    <clipPath id="clippath-S1-1-${random}">
        ${PanelDraw.Rect(110, 0, 60, 60, 20, 'none')}
    </clipPath>
    <clipPath id="clippath-S1-2-${random}">
        ${PanelDraw.Rect(710, 0, 60, 60, 20, 'none')}
    </clipPath>
</defs>`

    const progress_width = 255

    const left_id = recent?.players?.[0]
    const right_id = recent?.players?.[1]

    const rounds = (recent?.rounds ?? [])?.sort((a, b) => {
        const aa = a?.list_id ?? 0;
        const bb = b?.list_id ?? 0;
        return aa - bb;
    });

    const last_round = rounds?.[rounds.length - 1]

    const left_first = recent?.wins?.[0] ?? 0
    const right_first = recent?.wins?.[1] ?? 0

    const left_remain_health = last_round?.scores?.[0]?.health
    const right_remain_health = last_round?.scores?.[1]?.health

    let left_win
    let left_highlight = left_id === me
    let right_win
    let right_highlight = right_id === me

    if (left_remain_health > right_remain_health) {
        left_win = true
        right_win = false
    } else if (left_remain_health < right_remain_health) {
        left_win = false
        right_win = true
    } else {
        left_win = last_round?.winner === left_id
        right_win = last_round?.winner === right_id
    }

    const label_left = getSvgBody(0, 0, label_S1(left_win,
        ! left_highlight, hue))
    const label_right = getSvgBody(790, 0, label_S1(right_win,
        ! right_highlight, hue))

    const rrect = PanelDraw.Rect(
        110, 0, 660, 90, 20, PanelColor.top(hue)
    )

    const top = PanelDraw.Rect(
        110, 0, 660, 60, 20, PanelColor.overlay(hue)
    )

    const base_health = PanelDraw.Rect(
        180, 38, progress_width, 15, 7.5, PanelColor.top(hue)
    ) + PanelDraw.Rect(
        445, 38, progress_width, 15, 7.5, PanelColor.top(hue)
    )

    const label_s2s = []

    const last7 = rounds.slice(-7);

    for (const [i, v] of last7.entries()) {
        const x = 125 + 81 * i;
        const y = 65

        const cover = images.get(`list_${v.beatmapset_id}`)
            ?? await readNetImage(`https://assets.ppy.sh/beatmaps/${v.beatmapset_id}/covers/list.jpg`, false);

        const l = getSvgBody(x, y, label_S2(cover, v?.winner === me, hue));

        label_s2s.push(l);
    }

    const left_progress = Math.min(Math.max((left_remain_health / 1000000) ?? 0, 0), 1)
    const right_progress = Math.min(Math.max((right_remain_health / 1000000) ?? 0, 0), 1)

    let left_progress_width
    let right_progress_width

    if (left_progress < 1e-4) {
        left_progress_width = 0
    } else {
        left_progress_width = Math.max(left_progress * progress_width, 15)
    }

    if (right_progress < 1e-4) {
        right_progress_width = 0
    } else {
        right_progress_width = Math.max(right_progress * progress_width, 15)
    }

    const left_width = torusBold.getTextWidth(String(left_remain_health), 12)
    const right_width = torusBold.getTextWidth(String(right_remain_health), 12)

    let left_health_text
    let right_health_text

    if ((1 - left_progress) * progress_width > left_width + 12) {
        left_health_text = torusBold.getTextPath(
            String(left_remain_health), 440 - 5 - 8 - left_progress_width, 49, 12,
            'right baseline', '#fff')
    } else {
        left_health_text = torusBold.getTextPath(
            String(left_remain_health), 440 - 5 + 8 - left_progress_width, 49, 12,
            'left baseline', '#fff')
    }

    if ((1 - right_progress) * progress_width > right_width + 12) {
        right_health_text = torusBold.getTextPath(
            String(right_remain_health), 440 + 5 + 8 + right_progress_width, 49, 12,
            'left baseline', '#fff')
    } else {
        right_health_text = torusBold.getTextPath(
            String(right_remain_health), 440 + 5 - 8 + right_progress_width, 49, 12,
            'right baseline', '#fff')
    }

    const vs_text = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: String(left_first),
            size: 30,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: '  vs  ',
            size: 18,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: String(right_first),
            size: 30,
            color: '#fff'
        }], 440, 30, 'center baseline'
    )

    const left_health = PanelDraw.LinearGradientRect(
        440 - 5 - left_progress_width, 38, left_progress_width, 15, 7.5, colorArray.red, 1, [0, 100]
    )

    const right_health = PanelDraw.LinearGradientRect(
        440 + 5, 38, right_progress_width, 15, 7.5, colorArray.cyan, 1, [100, 0]
    )

    const left_indicator = PanelDraw.LinearGradientRect(
        180, 12, 15, 15, 7.5, colorArray.red, 1, [50, 50], [100, 0]
    )

    const right_indicator = PanelDraw.LinearGradientRect(
        685, 12, 15, 15, 7.5, colorArray.cyan, 1, [50, 50], [100, 0]
    )

    const left_name = poppinsBold.getTextPath(
        recent?.names?.[0] ?? "Unknown", 204, 25, 18, 'left baseline', left_win ? '#fff' : '#aaa'
    )

    const right_name = poppinsBold.getTextPath(
        recent?.names?.[1] ?? "Unknown", 676, 25, 18, 'right baseline', right_win ? '#fff' : '#aaa'
    )

    const left_a = images.get(`avatar_${left_id}`) ?? await getAvatar(left_id)
    const right_a = images.get(`avatar_${right_id}`) ?? await getAvatar(right_id)

    const left_avatar = `<g clip-path="url(#clippath-S1-1-${random})">
        ${getImage(110, 0, 60, 60, left_a)}
</g>`
    const right_avatar = `<g clip-path="url(#clippath-S1-2-${random})">
        ${getImage(710, 0, 60, 60, right_a)}
</g>`

    return [svg, defs, rrect, top, base_health, left_health, right_health,
        left_indicator, right_indicator, left_avatar, right_avatar,
        label_left, label_right, label_s2s.join('\n'),
        left_health_text, right_health_text, vs_text, left_name, right_name,
        '</g>'].join('')
}


const card_S2 = async (data = {
    avatar: '',
    country: 'XX',
    name: '',
    wins: 0,
    playcount: 0,
    rank: 0,
    provisional: false,
    has_custom_panel: false,
    hue: 342
}) => {
    let svg = `<g id="Card_S2">`
    const hide = data.has_custom_panel === true

    const random = getRandomString(6)

    let defs = `<defs>
        <clipPath id="Card_S2_${random}">
            ${PanelDraw.Rect(0, 0, 55, 55, 15, 'none')}
        </clipPath>
    </defs>`

    const avatar = `<g clip-path="url(#Card_S2_${random})">
    ${getImage(0, 0, 55, 55, data.avatar)}
</g>`

    const country = await getFlagPath(data.country, 65, 6 - 4, 24)

    const rrect = hide ? '' : PanelDraw.Rect(
        0, 0, 400, 55, 15, PanelColor.top(data.hue)
    )

    const name = poppinsBold.getTextPath(
        data.name, 105, 25, 24, 'left baseline', '#fff'
    )

    const sub = poppinsBold.getTextPath(
        `${data.wins} Wins [${data.playcount} Plays]`,
        65, 48, 16, 'left baseline', '#fff'
    )

    const provisional = data?.provisional ? '*' : ''

    const rank = poppinsBold.get2SizeTextPath(
        '#', `${data.rank}${provisional}`, 16, 24,
        385, 38, 'right baseline', '#fff'
    )

    return [svg, defs, rrect, avatar, country, name, sub, rank, '</g>'].join('')
}


const label_S1 = (win_condition, not_highlight, hue) => {
    let svg = `<g id="Label_S1">`

    let colors
    let char
    let text
    let offset

    switch (win_condition) {
        case true: {
            colors = colorArray.light_green
            char = 'W'
            text = 'Win!'
            offset = 1
        } break;
        case false: {
            colors = colorArray.red
            char = 'L'
            text = 'Lose...'
            offset = 2
        } break;
        default: {
            colors = colorArray.gray
            char = 'Q'
            text = 'Quit...'
            offset = 2
        } break;
    }

    const texts = torusBold.getTextPath(text, 45 + offset, 75, 16, 'center baseline', PanelColor.base(hue))

    const chars = torusBold.getTextPath(char, 45, 52, 48, 'center baseline', PanelColor.base(hue))

    const base = PanelDraw.Rect(0, 0, 90, 90, 20, PanelColor.middle(hue), 1)

    let opacity = 1

    if (not_highlight) {
        opacity = 0.2
    }

    const color = PanelDraw.LinearGradientRect(0, 0, 90, 90, 20, colors, opacity, [80, 20], [60, 40])


    return [svg, base, color, texts, chars, '</g>'].join('')
}


const label_S2 = (cover = '', win_condition, hue) => {
    let svg = `<g id="Label_S2">`

    let colors
    let char

    const random = getRandomString(6)

    switch (win_condition) {
        case true: {
            colors = colorArray.light_green
            char = 'W'
        } break;
        case false: {
            colors = colorArray.red
            char = 'L'
        } break;
        default: {
            colors = colorArray.gray
            char = 'Q'
        } break;
    }

    const defs = `<defs>
        <clipPath id="clippath-S2-${random}">
            ${PanelDraw.Rect(0, 0, 40, 20, 5, 'none')}    
        </clipPath>
    </defs>`

    const image = `<g clip-path="url(#clippath-S2-${random}">
        ${PanelDraw.Image(0, 0, 40, 20, cover)}
    </g>`

    const chars = torusBold.getTextPath(char, 55, 15, 14, 'center baseline', PanelColor.base(hue))

    const rrect = PanelDraw.LinearGradientRect(45, 0, 20, 20, 5, colors, 1, [80, 20], [60, 40])


    return [svg, defs, rrect, chars, image, '</g>'].join('')
}


const PanelSGenerate = {
    rank2componentS1: (rank = 0, total_players = 0, mode = 'osu', has_custom_panel = false, hue) => {
        return {
            rank: rank,
            total_players: total_players,
            mode: mode,
            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    rating2componentS2: (mu_rating = 0, mm_rating = 0, has_custom_panel = false, hue) => {
        return {
            mu_rating: mu_rating,
            mm_rating: mm_rating,
            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    stats2componentS3: (stats = {}, plays = 0, has_custom_panel = false, hue) => {

        return {
            playcounts: plays,
            count: stats?.count ?? 0,
            time: stats?.time ?? 0,
            combo: stats?.combo ?? 0,
            difficulty: stats?.difficulty ?? 0,
            accuracy: stats?.accuracy ?? 0,

            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    recently2componentS4: (recently = [], me, images, has_custom_panel = false, hue) => {

        return {
            recently: recently,
            me: me,
            images: images,

            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    rate2componentS5: (first_placements, plays, has_custom_panel, hue) => {
        return {
            first_placements: first_placements,
            plays: plays,

            has_custom_panel: has_custom_panel,
            hue: hue
        }
    },

    surrounding2componentS6: (surrounding, images, has_custom_panel, hue) => {
        return {
            surrounding: surrounding,
            images: images,

            has_custom_panel: has_custom_panel,
            hue: hue
        }
    }
}


// bottom: 保底
const getProgress = (x, min, max, bottom = 1 / 16) => {
    const result = (Math.min(Math.max(x, min), max) - min) / (max - min)

    return Math.max(result, bottom);
}