import {
    floor, getAvatar, getBanner, getImage, getImageFromV3, getMapBackground, getMapStatusImage,
    getPanelNameSVG, getRandomString,
    getSvgBody, getTimeDifferenceShort, isBlankString, isNotBlankString, isNotEmptyArray, isNotNull, round,
    rounds, setCustomBanner,
    setSvgBody,
    setText,
    setTexts, thenPush
} from "../util/util.js";
import {createImageRouter, createSvgRouter} from "../util/image.js";
import {getPlayerRatingColor, getStarRatingColor, PanelColor} from "../util/color.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {label_E5, LABEL_IM, label_J4, label_J6, label_J7} from "../component/label.js";
import {PanelDraw} from "../util/panelDraw.js";
import {poppinsBold, torusBold} from "../util/font.js";
import {card_D2} from "../card/card_D2.js";
import {imageDownloader, toTask} from "../util/download.js";

export const router = createImageRouter(panel_M2);

export const router_svg = createSvgRouter(panel_M2);

/**
 * 麻婆信息面板 v2, 展示麻婆谱面的
 * !im xxx
 * @param data
 * @return {Promise<string>}
 */
export async function panel_M2(data = {
    user: {},
    most_popular_beatmapset: [{
        id: 1087774,
        covers: [Object],
        play_count: 272162,
        favourite_count: 503,
        rating: 9.4598,
    }],
    genre: [232, 85, 17, 35, 106, 5, 13, 1, 102, 7, 3, 40, 1],
    language: [222, 9, 111, 113, 101, 1, 0, 0, 0, 0, 0, 0, 0, 5],
    difficulty_arr: [90, 80, 125, 115, 56, 10, 1, 2],
    length_arr: [58, 115, 116, 49, 74, 42, 18, 7],
    recent_activity: [{
        approval: 'ranked',
        beatmapset: [Object],
        created_at: '2026-06-01T14:47:43Z',
        id: 1020995053,
        is_mapping: true,
        type: 'BeatmapsetApprove',
        user: [Object]
    }, {
        beatmapset: [Object],
        created_at: '2026-05-25T08:01:29Z',
        id: 1018343518,
        is_mapping: true,
        type: 'BeatmapsetUpdate',
        user: [Object]
    }],
    most_recent_ranked_beatmapset: [{
        type: 'host',
        id: 2490202,
        title: 'Sick Enough to Die (feat. Mellow)',
        covers: [Object],
        beatmaps: [Array],
        ranked_date: '2026-06-01T14:47:43+08:00'
    }],
    favorite: 2380,
    playcount: 2340576,
    guest_owners: [{
        user: [Object], received: 1, received_ranked: 0, sent: 5, sent_ranked: 5
    }, {
        user: [Object], received: 6, received_ranked: 5, sent: 0, sent_ranked: 0
    }, {
        user: [Object], received: 1, received_ranked: 0, sent: 5, sent_ranked: 5
    }, {
        user: [Object], received: 0, received_ranked: 0, sent: 5, sent_ranked: 5
    }, {
        user: [Object], received: 4, received_ranked: 4, sent: 4, sent_ranked: 0
    }, {
        user: [Object], received: 0, received_ranked: 0, sent: 5, sent_ranked: 4
    }, {
        user: [Object], received: 0, received_ranked: 0, sent: 4, sent_ranked: 3
    }],
    associated_bids: [
        5445153, 5605060, 5347107, 5412734, 4976441, 5278725,
        5295436, 3387258, 4996446, 5041682, 5031555, 3280425,
        4646728, 4653954, 3666991, 4642260, 2683150, 4390138,
        4637992, 4447713, 4362204, 3614185, 3365288, 4170619,
        2752762, 4005957, 4004662, 3919786, 3464150, 3211104,
        3672118, 3586860, 3411896, 3141864, 3035869, 3004678,
        3171783, 2900406, 2887638, 2968832, 2790736, 2640653,
        2514342, 2432816, 2443502, 2294936, 5638534, 5029351,
        4770363, 4305343, 4306580, 4170594, 4044309, 4168612,
        3810792, 3701403, 3637982, 3705697, 3596740, 3538721,
        3526890, 3549399, 3522611, 3419703, 3469122, 5088732,
        3210939, 3052527, 3276038, 3509000, 2947743, 2741221,
        3475819, 2635712, 2637309, 3323143, 2557829, 2438988,
        2371234, 2711177, 2353856, 2771581, 3096553, 2252242,
        2260115, 3639969, 2245215
    ],
    total_guest: 87,
    total_guest_ranked: 87,
    total_diff: 479,
    average_rating: 0.0,
    average_length: 0.0,
    average_difficulty: 0.0,
}) {
    // 自设定义
    const has_custom_panel = false;

    const {
        user = {},
        most_popular_beatmapset = [],
        recent_activity = [],
        most_recent_ranked_beatmapset = [],
        guest_owners = [],
        associated_bids = [],
        genre = [],
        language = [],
        favorite = 0,
        playcount = 0,
        total_guest = 0,
        total_guest_ranked = 0,
        total_diff = 0,
        average_rating = 0,
        average_length = 0,
        average_difficulty = 0,
        difficulty_arr = [],
        length_arr = []
    } = data;

    const ra = recent_activity?.slice(0, 10) ?? []
    const ms = most_popular_beatmapset?.slice(0, 6) ?? []
    const rr = most_recent_ranked_beatmapset?.slice(0, 6) ?? []

    const hue = user?.profile_hue ?? 342

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PM2-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PM2-BG">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PM2-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PM2-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PM2-BG)" style="clip-path: url(#clippath-PM2-BG);">
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
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PM2-1\);">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/
    // const reg_background = /(?<=<g filter="url\(#blur-PM2-BG\)" style="clip-path: url\(#clippath-PM2-BG\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG("I'm Mapper v2", 'IM');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 下图

    const promise_d2s = ms.map(b => toTask('beatmapset', b.id, () => getMapBackground(b, 'list')))

    const promise_d4ss = rr.map(r => toTask('beatmapset', r.id, () => getMapBackground(r, 'list')))

    const promise_d4s = ra.map(a => toTask('beatmapset', a.beatmapset?.id, () => getMapBackground(a?.beatmapset, 'list')))

    const promise_a1 = toTask('avatar', user.id, () => getAvatar(user?.avatar_url))

    const promise_a12 = toTask('cover', user.id, () => getBanner(user?.cover_url))

    const promise_j6s = guest_owners.map(g => toTask('avatar', g.user.id, () => getAvatar(g.user.id)))

    const taskList = [
        ...promise_d2s,
        ...promise_d4ss,
        ...promise_d4s,
        promise_a1,
        promise_a12,
        ...promise_j6s
    ];

    const images = await imageDownloader(taskList);

    const cardA1 = await card_A1(
        PanelGenerate.user2CardA1(user, null, images.get(`avatar_${user.id}`), images.get(`cover_${user.id}`))
    );

    const componentM1 = component_M1(
        PanelMGenerate.attr2componentM1(
        user, total_guest_ranked, total_guest, total_diff, favorite, playcount, average_rating, has_custom_panel, hue));
    const componentM2 = component_M2(
        await PanelMGenerate.beatmapset2componentM2(
            ms, images, has_custom_panel, hue
        )
    )
    const componentM3 = component_M3(
        PanelMGenerate.genre2componentM3(genre, has_custom_panel, hue)
    )
    const componentM4 = component_M4(
        PanelMGenerate.language2componentM4(language, has_custom_panel, hue)
    )
    const componentM5 = component_M5(
        PanelMGenerate.recentActivities2componentM5(ra, images, has_custom_panel, hue)
    )
    const componentM6 = component_M6(
        PanelMGenerate.recentlyRanked2componentM6(rr, images, associated_bids, has_custom_panel, hue)
    )
    const componentM7 = component_M7(
        PanelMGenerate.difficulty2componentM7(difficulty_arr, average_difficulty, has_custom_panel, hue)
    )
    const componentM8 = component_M8(
        PanelMGenerate.length2componentM8(length_arr, average_length, has_custom_panel, hue)
    )
    const componentM9 = await component_M9(
        PanelMGenerate.guest2componentM9(guest_owners, images, has_custom_panel, hue)
    )

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const bodyM1 = getSvgBody(40, 330, componentM1)
    const bodyM2 = getSvgBody(40, 740, componentM2)
    const bodyM3 = getSvgBody(550, 330, componentM3)
    const bodyM4 = getSvgBody(970, 330, componentM4)
    const bodyM5 = getSvgBody(550, 740, componentM5)
    const bodyM6 = getSvgBody(1040, 740, componentM6)
    const bodyM7 = getSvgBody(1390, 330, componentM7)
    const bodyM8 = getSvgBody(1390, 535, componentM8)
    const bodyM9 = getSvgBody(1390, 740, componentM9)

    svg = setCustomBanner(svg, user?.profile?.banner, reg_banner);

    svg = setTexts(svg, [bodyM1, bodyM2, bodyM3, bodyM4, bodyM5, bodyM6, bodyM7, bodyM8, bodyM9], reg_component);

    return svg
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_M1 = (
    data = {
        rank: 0,
        pending: 0,
        slot: 0,
        guest_ranked: 0,
        guest: 0,
        difficulty: 0,
        favourite: 0,
        play_count: 0,
        average_rating: 0,

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OM1">`
    const hide = data.has_custom_panel === true

    const half_slot = data.slot / 2

    const fav = rounds(data.favourite, -4)
    const pc = rounds(data.play_count, -4)

    const labels = [
        {
            ...LABEL_IM.RANK,
            data_b: String(data.rank),
            data_m: '',
            bar_progress: getProgress(data.rank, LABEL_IM.RANK.bar_min, LABEL_IM.RANK.bar_max),
            hide: hide
        }, {
            ...LABEL_IM.PENDING,
            data_b: String(data.pending),
            data_m: ` [${data.slot}]`,
            bar_min: LABEL_IM.RANK.bar_min,
            bar_mid: half_slot,
            bar_max: data.slot,
            bar_progress: getProgress(data.pending, LABEL_IM.RANK.bar_min, data.slot),
            hide: hide
        }, {
            ...LABEL_IM.GUEST,
            data_b: String(data.guest_ranked),
            data_m: ` [${data.guest}]`,
            bar_progress: getProgress(data.guest_ranked, LABEL_IM.GUEST.bar_min, LABEL_IM.GUEST.bar_max),
            hide: hide
        }, {
            ...LABEL_IM.DIFFICULTY,
            data_b: String(data.difficulty),
            data_m: '',
            bar_progress: getProgress(data.difficulty, LABEL_IM.DIFFICULTY.bar_min, LABEL_IM.DIFFICULTY.bar_max),
            hide: hide
        }, {
            ...LABEL_IM.FAVOURITE,
            data_b: fav.integer,
            data_m: fav.decimal,
            max_width: 450,
            bar_progress: getProgress(data.favourite, LABEL_IM.FAVOURITE.bar_min, LABEL_IM.FAVOURITE.bar_max),
            hide: hide
        }, {
            ...LABEL_IM.PLAY_COUNT,
            data_b: pc.integer,
            data_m: pc.decimal,
            max_width: 450,
            bar_progress: getProgress(data.play_count, LABEL_IM.PLAY_COUNT.bar_min, LABEL_IM.PLAY_COUNT.bar_max),
            hide: hide
        }
    ]

    const string_e5s = labels.slice(0, 6).map((label, i) => {
        let x, y;

        if (i < 4) {
            x = 15 + 235 * (i % 2);
            y = 45 + 80 * Math.floor(i / 2);
        } else {
            x = 15;
            y = 45 + 80 * (i - 2);
        }

        return getSvgBody(x, y, label_E5(label));
    }).join('');

    const rating_progress = getProgress(data.average_rating, 0, 10, 0)

    const count_base = PanelDraw.Rect(20, 368, 450, 10, 5, PanelColor.top(data.hue))

    const count_good = PanelDraw.Rect(20, 368, 450 * rating_progress, 10, 5, '#006899')

    const count_bad = PanelDraw.Rect(20, 368, 450, 10, 5, '#854317')

    const rating = poppinsBold.getTextPath(`Player Rating: ${Math.round(data.average_rating * 10) / 10}`, 490 - 15, 27, 18, 'right baseline', '#fff', 1)

    const title = hide ? '' : poppinsBold.getTextPath('Mapping Statistics', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 490, 390, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, count_base, count_bad, count_good, rating, title, string_e5s, '</g>'].join('');
}

const component_M2 = (
    data = {
        card_d2s: [],

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OM2">`
    const hide = data.has_custom_panel === true

    const d2s = data?.card_d2s || []

    let string_d2s = []

    for (let i = 0; i < d2s.length; i++) {
        const x = i % 3
        const y = Math.floor(i / 3)

        string_d2s.push(getSvgBody(10 + x * 160, 40 + y * 130, d2s[i]))
    }

    const title = hide ? '' : poppinsBold.getTextPath('Most Popular Beatmaps', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 490, 300, 20, PanelColor.middle(data.hue), 1)

    return svg + rrect + string_d2s.join('\n') + title + '</g>'
}

const component_M3 = (data = {
    genre: [],

    has_custom_panel: false,
    hue: 342,
}) => {
    let svg = '<g id="Component_M3">'
    const hide = data.has_custom_panel === true

    /**
     * @type number[]
     */
    const genre = data?.genre || []

    // 绘制标签
    let max_width
    let x_count

    if (genre.length <= 2) {
        max_width = 380
        x_count = 1
    } else if (genre.length <= 4) {
        max_width = 185
        x_count = 2
    } else {
        max_width = 120
        x_count = 3
    }

    let string_genre_label = '';

    const genre_sum = Math.max(genre.reduce((prev, curr) => {return prev + curr}, 0) || 0, 1);

    /**
     * @type {{value: number, percent: number, color: string, name: string}[]}
     */
    const genre_data = genre.map((v, i) => ({
        value: v,
        percent: v / genre_sum,
        color: [
            '#AAA',
            '#EC6841', '#F19149', '#F7B551', '#FFF45C',
            '#B3D465', '#7FC269', '#31B16C', '#12B4B1',
            '#00B7EE', '#1456EB', '#1D39EB', '#7E30E1'][i],
        name: [
            'unspecified',
            'video game', 'anime', 'rock', 'pop',
            'other', 'novelty', 'hip hop', 'electronic',
            'metal', 'classical', 'folk', 'jazz'][i],
    })).filter(item => item.value !== 0);

    genre_data.sort((a, b) => b.value - a.value);

    for (let i = 0; i < Math.min(genre_data.length, 6); i++) {
        const { value, percent, color, name} = genre_data[i];

        const x = i % x_count
        const y = Math.floor(i / x_count)

        const label = label_J4({
            icon_title: name,
            abbr: name,
            remark: Math.round(percent * 100) + '%',
            data_b: String(value).padStart(3, '0'),

            bar_progress: percent,
            bar_color: color,
            max_width: max_width,
            hide: data.has_custom_panel,
            hue: data.hue,
        })

        string_genre_label += getSvgBody(10 + x * (max_width + 10), 250 + y * 70, label)
    }

    // 插入饼图
    let genre_svg = '';
    genre_data.reduce((prev, curr) => {
        const {percent, color} = curr

        const curr_percent = prev + percent;

        genre_svg += PanelDraw.Pie(200, 136, 95, curr_percent, prev, color);

        return curr_percent;
    }, 0);

    genre_svg += PanelDraw.Image(200 - 95, 136 - 95, 190, 190, getImageFromV3('object-piechart-overlay2.png'), 1);

    const title = hide ? '' : poppinsBold.getTextPath('Genre', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 400, 390, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, genre_svg, string_genre_label, title, '</g>']
}

const component_M4 = (data = {
    language: [],

    has_custom_panel: false,
    hue: 342,
}) => {
    let svg = '<g id="Component_M4">'
    const hide = data.has_custom_panel === true

    /**
     * @type number[]
     */
    const language = data?.language || []

    // 绘制标签
    let max_width
    let x_count

    if (language.length <= 2) {
        max_width = 380
        x_count = 1
    } else if (language.length <= 4) {
        max_width = 185
        x_count = 2
    } else {
        max_width = 120
        x_count = 3
    }

    let string_language_label = '';

    const language_sum = Math.max(language.reduce((prev, curr) => {return prev + curr}, 0) || 0, 1);

    /**
     * @type {{value: number, percent: number, color: string, name: string, abbr: string}[]}
     */
    const language_data = language.map((v, i) => ({
        value: v,
        percent: v / language_sum,
        color: [
            '#AAA',
            '#EC6841', '#F19149', '#F7B551', '#FFF45C',
            '#B3D465', '#7FC269', '#31B16C', '#12B4B1',
            '#00B7EE', '#1456EB', '#1D39EB', '#7E30E1',
            '#EA68A2'][i],
        name: [
            "unspecified",
            "english", "japanese", "chinese", "instrumental",
            "korean", "french", "german", "swedish",
            "spanish", "italian", "russian", "polish",
            "other"][i],
        abbr: [
            "unspecified",
            "en", "ja", "zh", "inst",
            "ko", "fr", "de", "sw",
            "es", "it", "ru", "pl",
            "other"][i],
    })).filter(item => item.value !== 0);

    language_data.sort((a, b) => b.value - a.value);

    for (let i = 0; i < Math.min(language_data.length, 6); i++) {
        const { value, percent, color, name, abbr} = language_data[i];

        const x = i % x_count
        const y = Math.floor(i / x_count)

        const label = label_J4({
            icon_title: name,
            abbr: abbr,
            remark: Math.round(percent * 100) + ' %',
            data_b: String(value).padStart(3, '0'),

            bar_progress: percent,
            bar_color: color,
            max_width: max_width,
            hide: data.has_custom_panel,
            hue: data.hue,
        })

        string_language_label += getSvgBody(10 + x * (max_width + 10), 250 + y * 70, label)
    }

    // 插入饼图
    let language_svg = '';
    language_data.reduce((prev, curr) => {
        const {percent, color} = curr

        const curr_percent = prev + percent;

        language_svg += PanelDraw.Pie(200, 136, 95, curr_percent, prev, color);

        return curr_percent;
    }, 0);

    language_svg += PanelDraw.Image(200 - 95, 136 - 95, 190, 190, getImageFromV3('object-piechart-overlay2.png'), 1);

    const title = hide ? '' : poppinsBold.getTextPath('Language', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 400, 390, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, language_svg, string_language_label, title, '</g>']
}

const component_M5 = (data = {
    label_m1s: [],

    has_custom_panel: false,
    hue: 342,
}) => {
    let svg = '<g id="Component_M5">'
    const hide = data.has_custom_panel === true

    const m1s = (data.label_m1s ?? []).map(v => label_M1(v))

    const string_m1s = []

    if (m1s.length <= 5) {
        for (let i = 0; i < m1s.length; i++) {
            const v = m1s[i]
            const x = 15
            const y = 40 + i * 52

            string_m1s.push(
                getSvgBody(x, y, v)
            )
        }
    } else {
        for (let i = 0; i < Math.min(m1s.length, 10); i++) {
            const v = m1s[i]
            const x = 15 + (i % 2) * 225
            const y = 40 + Math.floor(i / 2) * 52

            string_m1s.push(
                getSvgBody(x, y, v)
            )
        }
    }

    const title = hide ? '' : poppinsBold.getTextPath('Recently Activities', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 470, 300, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, string_m1s.join('\n'), title, '</g>'].join('\n')
}

const component_M6 = (data = {
    label_m1s: [],

    has_custom_panel: false,
    hue: 342,
}) => {
    let svg = '<g id="Component_M6">'
    const hide = data.has_custom_panel === true

    const m1s = (data.label_m1s ?? []).map(v => label_M1(v))

    const string_m1s = []

    for (let i = 0; i < m1s.length; i++) {
        const v = m1s[i]
        const x = 15
        const y = 40 + i * 52

        string_m1s.push(
            getSvgBody(x, y, v)
        )
    }

    const title = hide ? '' : poppinsBold.getTextPath('Recently Ranked Maps', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 330, 300, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, string_m1s.join('\n'), title, '</g>'].join('\n')
}


const component_M7 = (data = {
    difficulty: [],
    average_difficulty: 0.0,

    has_custom_panel: false,
    hue: 342,
}) => {
    let svg = '<g id="Component_M7">'
    const hide = data.has_custom_panel === true

    const chart = PanelDraw.BarChart(data.difficulty, 0, 0, 15, 40 + 120, 460, 115, 4, 4, [
        '#4ffffd', '#7cff4f', '#f6f05c', '#ff6868',
        '#ff4e6f', '#c645b8', '#6563de', '#18158e'
    ], 0, 2, null, 0.8)

    let star_text = []

    const star_arr = ['0', '2', '2.8', '4', '5.3', '6.5', '8', '10', '...']

    for (let i = 0; i < star_arr.length; i++) {
        const star = star_arr[i]
        star_text.push(poppinsBold.getTextPath(star, 15 - 2 + i * (460 / 8), 175, 14, 'center baseline'))
    }

    const star_average_text = poppinsBold.getTextPath(
        `Average: ${round(data.average_difficulty, 2)}*`
        , 475, 27, 18, 'right baseline')

    const title = hide ? '' : poppinsBold.getTextPath('Difficulty Distribution', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 490, 185, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, chart, star_average_text, star_text.join('\n'), title, '</g>'].join('\n')
}

const component_M8 = (data = {
    length: [],
    average_length: 0.0,

    has_custom_panel: false,
    hue: 342,
}) => {
    let svg = '<g id="Component_M8">'
    const hide = data.has_custom_panel === true

    const chart = PanelDraw.BarChart(data.length, 0, 0, 15, 40 + 120, 460, 115, 4, 4, [
        '#4ffffd', '#7cff4f', '#f6f05c', '#ff6868',
        '#ff4e6f', '#c645b8', '#6563de', '#18158e'
    ], 0, 2, null, 0.8)

    let lengths = []

    const length_arr = ['0', '1:00', '1:40', '2:20', '3:00', '3:40', '4:20', '5:00', '...']

    for (let i = 0; i < length_arr.length; i++) {
        const length = length_arr[i]

        lengths.push(poppinsBold.getTextPath(length, 15 - 2 + i * (460 / 8), 175, 14, 'center baseline'))
    }

    const length_minute_str = Math.floor(data.average_length / 60).toString();
    const length_second_str = Math.floor(data.average_length % 60).toString().padStart(2, '0');

    const length_average_text = poppinsBold.getTextPath(
        `Average: ${length_minute_str}:${length_second_str}`
        , 475, 27, 18, 'right baseline')

    const title = hide ? '' : poppinsBold.getTextPath('Length Distribution', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 490, 185, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, chart, length_average_text, lengths.join('\n'), title, '</g>'].join('\n')
}

const component_M9 = async (
    data = {
        guest: [],
        images: new Map(),
        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OJ9">
    </g>`
    const hide = data.has_custom_panel === true

    const guest = data?.guest || []

    const most_sex = guest[0]

    const labels = []

    if (isNotNull(most_sex)) {
        // J6 单人版
        const label = await label_J7(guest2LabelJ7(most_sex, 1, data.images), data.hue)
        labels.push(label)
    }

    for (let i = 1; i < Math.min(guest.length, 7); i++) {
        const x = (i - 1) % 2
        const y = Math.floor((i - 1) / 2)

        const label = await label_J6(guest2LabelJ6(guest[i], i + 1, data.images), data.hue)

        labels.push(getSvgBody(10 + x * 235, 105 + y * 65, label))
    }

    const title = hide ? '' : poppinsBold.getTextPath('Most In-depth Cooperation GDer', 15, 27, 18, 'left baseline', '#fff', 1)
    const rrect = hide ? '' : PanelDraw.Rect(0, 0, 490, 300, 20, PanelColor.middle(data.hue), 1)

    return [svg, rrect, labels.join('\n'), title].join('\n')
}

// 私有转换方式
const PanelMGenerate = {
    attr2componentM1: (user = {}, guest_ranked, guest, difficulty, favourite, play_count, average_rating, has_custom_panel = false, hue) => {
        return {
            rank: user?.ranked_beatmapset_count ?? 0,
            pending: user?.pending_beatmapset_count ?? 0,
            slot: getPendingSlot(user?.is_supporter, user?.ranked_beatmapset_count),
            guest_ranked: guest_ranked ?? 0,
            guest: guest ?? 0,
            difficulty: difficulty ?? 0,
            favourite: favourite ?? 0,
            play_count: play_count ?? 0,
            average_rating: average_rating ?? 0,

            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    beatmapset2componentM2: async (beatmapsets = [], images, has_custom_panel = false, hue) => {
        return {
            card_d2s: await beatmapset2CardD2s(beatmapsets, images),
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    genre2componentM3: (genre = [], has_custom_panel = false, hue) => {
        return {
            genre: genre,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    language2componentM4: (language = [], has_custom_panel = false, hue) => {
        return {
            language: language,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    recentActivities2componentM5: (recent_activity = [], images, has_custom_panel = false, hue) => {

        const activities = recent_activity ?? [];

        let m1s = []

        const full_width = activities.length <= 5

        let max_width
        let short_level

        if (full_width) {
            max_width = 440
            short_level = 2
        } else {
            max_width = 215
            short_level = 0
        }

        for (const a of activities) {
            const id = a?.beatmapset?.id ?? 0
            const type = a?.type
            const approval = a?.approval

            const time_diff = getTimeDifferenceShort(a?.created_at, short_level)
            const top = a?.beatmapset?.title?.split(' - ')?.[1]?.trim() ?? 'Unknown'

            const bottom = `${time_diff} // ${full_width ? ActivityConfig.getOperate(type, approval) : ActivityConfig.getAbbreviation(type, approval)}`

            const data = {
                image: images.get(`beatmapset_${id}`),
                top: top,
                bottom: bottom,

                color_arr: [],
                opacity_arr: [],

                right_image: ActivityConfig.getPath(type, approval),
                right_color: ActivityConfig.getColor(type, approval),

                max_width: max_width,
                has_custom_panel: has_custom_panel,
                hue: hue,
            }

            m1s.push(data)
        }

        return {
            label_m1s: m1s,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    recentlyRanked2componentM6: (recently_ranked = [], images, associated_bids = [], has_custom_panel = false, hue) => {
        const recently = recently_ranked ?? [];

        const associated_set = new Set(associated_bids);

        let m1s = []
        const max_width = 300

        for (const set of recently) {
            const id = set?.id ?? 0
            const bs = set.beatmaps ?? []

            const is_host = set?.type !== 'guest'

            const creator = is_host ? '' : ` [${set?.creator ?? '?'}]`

            const top = (set?.title ?? 'Unknown') + creator

            let color_arr = []
            let opacity_arr = []

            bs.forEach((b) => {
                color_arr.push(getStarRatingColor(b.difficulty_rating))

                if (associated_set.has(b.id)) {
                    opacity_arr.push(1)
                } else {
                    opacity_arr.push(0.4)
                }
            })

            const data = {
                image: images.get(`beatmapset_${id}`),
                top: top,
                bottom: undefined,

                color_arr: color_arr,
                opacity_arr: opacity_arr,

                right_image: undefined,
                right_color: undefined,

                max_width: max_width,
                has_custom_panel: has_custom_panel,
                hue: hue,
            }

            m1s.push(data)
        }

        return {
            label_m1s: m1s,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    difficulty2componentM7: (difficulty, average_difficulty, has_custom_panel = false, hue) => {
        return {
            difficulty: difficulty,
            average_difficulty: average_difficulty,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    length2componentM8: (length, average_length, has_custom_panel = false, hue) => {
        return {
            length: length,
            average_length: average_length,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    guest2componentM9: (guest, images, has_custom_panel = false, hue) => {
        return {
            guest: guest,
            images: images,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },
}


const beatmapset2CardD2s = async (beatmapsets, images) => {
    let promises = []
    let d2s = []

    for (const s of beatmapsets) {
        const rating = s?.rating || 0
        const rating_rrect_color = getPlayerRatingColor(rating)
        const rating_text_color = (rating < 9.2 && rating > 8) ? '#1c1719' : '#fff'

        const pc_value = s?.play_count ?? 0
        let play_count

        if (pc_value >= 200_0000) {
            play_count = rounds(pc_value, 2)
        } else {
            play_count = rounds(pc_value, -4)
        }

        const favourite = round(s?.favourite_count, 1)

        const cachedBg = images.get(`beatmapset_${s.id}`);

        /**
         * @type {Promise<*>}
         */
        const background = cachedBg
            ? Promise.resolve(cachedBg)
            : getMapBackground(s, 'list');

        const data = {
            background: background,
            top_image: getMapStatusImage(s.ranked),

            title: play_count.integer,
            title_m: play_count.decimal,

            left: floor(rating, 1),
            left_color: rating_text_color,
            left_rrect_color: rating_rrect_color,

            right: '',
            right_color: 'none',
            right_rrect_color: 'none',

            sub_title: 'PC',

            bottom_left: String(s?.beatmapset_id ?? s?.id ?? 0),
            bottom_right: `${favourite} Fav`,
        }

        promises.push(card_D2(data))
    }

    await Promise.allSettled(promises)
        .then(results => thenPush(results, d2s))

    return d2s
}

const guest2LabelJ6 = (guest = {
    user: [Object], received: 1, received_ranked: 0, sent: 5, sent_ranked: 5
}, index, images) => {
    const user = guest.user

    return {
        image: images.get(`avatar_${user.id}`) ?? user.avatar_url,
        title: user.username,
        index: index,
        top: `${guest.received_ranked}/${guest.received} [${guest.sent_ranked}/${guest.sent}]`,
    }
}

const guest2LabelJ7 = (guest = {
    user: [Object], received: 1, received_ranked: 0, sent: 5, sent_ranked: 5
}, index, images) => {
    const user = guest.user

    return {
        image: images.get(`avatar_${user.id}`) ?? user.avatar_url,
        title: user.username,
        index: index,
        top_b: String(guest.received_ranked),
        top_m: ` / ${guest.received} Received`,
        bottom_b: String(guest.sent_ranked),
        bottom_m: ` / ${guest.sent} Sent`,
    }
}


const ActivityConfig = {
    // 核心数据映射表
    MAP: {
        'BeatmapsetApprove': {
            ranked: {path: 'object-beatmap-ranked.png', color: '#4fc3f7', operate: 'Ranked', abbr: 'Rank'},
            qualified: {path: 'object-beatmap-qualified.png', color: '#aeea00', operate: 'Qualified', abbr: 'Qua'},
            _default: {path: 'object-beatmap-qualified.png', color: '#4caf50', operate: 'Approved', abbr: 'App'}
        },
        'BeatmapsetDelete': {path: 'object-beatmap-deleted.png', color: '#DB567E', operate: 'Delete', abbr: 'Del'},
        'BeatmapsetRevive': {path: 'object-beatmap-restored.png', color: '#8964CD', operate: 'Revive', abbr: 'Rev'},
        'BeatmapsetUpdate': {path: 'object-beatmap-uploaded.png', color: '#ff9800', operate: 'Update', abbr: 'Upd'},
        'BeatmapsetUpload': {path: 'object-beatmap-submitted.png', color: '#ffff00', operate: 'Upload', abbr: 'Upl'}
    },

    // 内部私有方法：获取具体配置项
    _getConfig(type, approval) {
        const item = this.MAP[type];
        if (!item) return null;

        // 如果存在针对 approval 的细分，优先匹配，否则匹配默认值
        if (item._default || item[approval]) {
            return item[approval] || item._default;
        }
        return item;
    },

    // 1. 获取路径
    getPath(type = '', approval = '') {
        // 保留原逻辑：Approve 类型下若 approval 不对，路径返回空字符串
        if (type === 'BeatmapsetApprove' && !['ranked', 'qualified'].includes(approval)) {
            return '';
        }
        const config = this._getConfig(type, approval);
        return config && config.path ? getImageFromV3(config.path) : '';
    },

    // 2. 获取颜色
    getColor(type = '', approval = '') {
        const config = this._getConfig(type, approval);
        return config ? config.color : '#fff';
    },

    // 3. 获取操作名称
    getOperate(type = '', approval = '') {
        const config = this._getConfig(type, approval);
        return config ? config.operate : '';
    },

    getAbbreviation(type = '', approval = '') {
        const config = this._getConfig(type, approval);
        return config ? config.abbr : '';
    }
};

// bottom: 保底
const getProgress = (x, min, max, bottom = 1 / 16) => {
    const result = (Math.min(Math.max(x, min), max) - min) / (max - min)

    return Math.max(result, bottom);
}

function getPendingSlot(isSupporter = false, ranked = 0) {
    let slot;
    if (isSupporter) {
        slot = 8 + Math.min(ranked, 12);
    } else {
        slot = 4 + Math.min(ranked, 4);
    }
    return slot;
}

const label_M1 = (data = {
    image: getImageFromV3('beatmap-DLfailBG.jpg'),
    top: '',
    bottom: '',

    color_arr: [],
    opacity_arr: [],

    right_image: '',
    right_color: '',

    max_width: 215,
    has_custom_panel: false,
    hue: 324,
}) => {
    const id = getRandomString(6)

    const max_width = data?.max_width ?? 215

    const has_right_image = isNotBlankString(data?.right_image)
    const is_difficulty_mode = isBlankString(data.bottom) && isNotEmptyArray(data.color_arr)

    const additional_mask = has_right_image ? getImage(max_width - 37, 5, 30, 30, data.right_image) : ''

    let svg = `<g id="Label_M1_${id}">
<defs>
    <clipPath id="clippath_M1_${id}">
        <rect x="0" y="0" rx="20" ry="20" width="60" height="40" style="fill: none;"/>
    </clipPath>
    <mask id="mask_M1_${id}">
        ${additional_mask}
    </mask>
</defs>
`

    const text_width = max_width - 40 - 8 - 8 - (has_right_image ? 60 : 20)

    const top = torusBold.getTextPath(
        torusBold.cutStringTail(data?.top ?? '', 16, text_width),
        68, 16, 16, 'left baseline', '#fff', 1)
    const bottom = torusBold.getTextPath(
        torusBold.cutStringTail(data?.bottom ?? '', 16, text_width), 68, 34, 16, 'left baseline', '#fff', 1)

    const base = PanelDraw.Rect(0, 0, max_width - (has_right_image ? 40 : 0), 40, 20, PanelColor.top(data.hue))

    const additional_image = has_right_image ?
        `<g mask="url(#mask_M1_${id})">
        <rect x="${max_width - 80}" y="0" rx="20" ry="20" width="80" height="40" style="fill: ${PanelColor.base(data.hue)};"/></g>`: ''

    const additional_base = has_right_image ? PanelDraw.Rect(max_width - 80, 0, 80, 40, 20, data?.right_color ?? PanelColor.top(data.hue)) : ''

    const image = `<g clip-path="url(#clippath_M1_${id})">${getImage(0, 0, 60, 40, data.image)}</g>`

    let rrect_length = 0
    let color_array = []

    if (is_difficulty_mode) {
        for (let i = 0; i < data?.color_arr?.length ?? 0; i++) {
            const opacity = data?.opacity_arr?.[i] ?? 1
            const v = data.color_arr?.[i] ?? '#aaa'

            const x = 68 + rrect_length
            const y = 22

            const r = PanelDraw.Rect(x, y, 8, 14, 4, v, opacity)

            color_array.push(r)

            rrect_length += (8 + 3)

            if (rrect_length > (text_width + 3)) {
                break
            }
        }
    }

    return [svg, additional_base, base, additional_image, image, top, bottom, color_array.join('\n'), '</g>'].join('')
}