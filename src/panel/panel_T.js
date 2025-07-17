import {
    exportJPEG,
    floor,
    getAvatar,
    getFormattedTime,
    getGameMode,
    getKeyDifficulty,
    getMapBackground, getNowTimeStamp,
    getPanelNameSVG,
    getSvgBody,
    readNetImage,
    requireNonNullElse,
    setImage,
    setSvgBody,
    setText,
    setTexts,
    thenPush
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {poppinsBold, torus} from "../util/font.js";
import {hasLeaderBoard} from "../util/star.js";
import {PanelDraw} from "../util/panelDraw.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {getModColor, getStarRatingColor, PanelColor} from "../util/color.js";
import {label_T} from "../component/label.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_T(data);
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
        const svg = await panel_T(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 流行谱面面板
 * !pu group #day
 * @param data
 * @return {Promise<string>}
 */
export async function panel_T(
    /*
    data = {
    info: {
        group_id: 0,
        member_count: 0,
        player_count: 0,
        score_count: 0,
        mode: 'osu'
    },
    popular: [{
        beatmap_id: 1,
        count: 0,
        accuracy: 0,
        combo: 0,
        player_count: 0,
        max_retry: {
            beatmap_id: 0,
            count: 0,
            user_id: 0,
            user: null,
            beatmap: null,
        },
        beatmap: {}
    }, ],

    max_retry: {
        beatmap_id: 0,
        count: 0,
        user_id: 0,
        user: null,
        beatmap: null,
    },

    mod_attr: [{
        index: "",
        count: 0,
        pp: 0.0,
    }],

    mod_max_percent: 0.0,

    pp_attr: [{
        index: "0",
        count: 0,
        pp: 0.0,
    }],

    pp_max_percent: 0.0,


}

     */
    data = {
        info: {
            group_id: 722292097,
            member_count: 14,
            player_count: 4,
            beatmap_count: 4,
            score_count: 1098,
            mode: 'DEFAULT',
            start_time: '',
            end_time: '',
        },
        popular: [
            {
                beatmap_id: 1071125,
                count: 17,
                accuracy: 0.8761652410030365,
                combo: 240,
                player_count: 2,
                max_retry: [Object],
                beatmap: [Object]
            },
            {
                beatmap_id: 4884071,
                count: 5,
                accuracy: 0.8246882200241089,
                combo: 214,
                player_count: 2,
                max_retry: [Object],
                beatmap: [Object]
            },
            {
                beatmap_id: 4957833,
                count: 5,
                accuracy: 0.9229454040527344,
                combo: 276,
                player_count: 2,
                max_retry: [Object],
                beatmap: [Object]
            },
            {
                beatmap_id: 1863246,
                count: 3,
                accuracy: 0.9060603380203247,
                combo: 543,
                player_count: 2,
                max_retry: [Object],
                beatmap: [Object]
            },
            {
                beatmap_id: 4749713,
                count: 3,
                accuracy: 0.9628576834996542,
                combo: 465,
                player_count: 2,
                max_retry: [Object],
                beatmap: [Object]
            }
        ],
        max_retry: {
            beatmap_id: 1620144,
            count: 12,
            user_id: 32452774,
            user: {
                cover: [Object],
                avatar_url: 'https://a.ppy.sh/32452774?1732545143.jpeg',
                default_group: 'default',
                id: 32452774,
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: false,
                is_supporter: true,
                pm_friends_only: false,
                username: 'Nana Sakura',
                country_code: 'CN',
                country: [Object],
                is_mutual: false,
                groups: [],
                statistics_rulesets: [Object]
            },
            beatmap: {
                beatmapset_id: 757146,
                difficulty_rating: 5.73,
                id: 1620144,
                mode: 'OSU',
                status: 'ranked',
                total_length: 38,
                user_id: 987334,
                version: "Bonsai's BasS-TYPE",
                beatmapset: [Object],
                checksum: '9ccc293efc8024effc53a8f320b4371a',
                failtimes: [Object],
                max_combo: 162,
                ar: 9,
                bpm: 149.3,
                convert: false,
                count_circles: 162,
                count_sliders: 0,
                count_spinners: 0,
                cs: 6.2,
                hit_length: 38,
                is_scoreable: true,
                last_updated: '2018-04-27T22:58:26Z',
                owners: [Array],
                mode_int: 0,
                passcount: 896247,
                playcount: 2966823,
                ranked: 1,
                url: 'https://osu.ppy.sh/beatmaps/1620144',
                od: 9,
                hp: 6,
                has_leader_board: true,
                preview_name: "Tanaka Hirokazu - C-TYPE (Arf) [Bonsai's BasS-TYPE]",
                retries: [Array],
                fails: [Array],
                retry: 548083,
                fail: 1380228
            }
        },
        mod_attr: [
            { index: 'HD', count: 197, percent: 0.17941712204007285 },
            { index: 'DT', count: 80, percent: 0.07285974499089254 },
            { index: 'HR', count: 34, percent: 0.030965391621129327 },
            { index: 'NC', count: 14, percent: 0.012750455373406194 },
            { index: 'HT', count: 12, percent: 0.01092896174863388 },
            { index: 'PF', count: 4, percent: 0.0036429872495446266 },
            { index: 'TD', count: 3, percent: 0.00273224043715847 },
            { index: 'NF', count: 2, percent: 0.0018214936247723133 },
            { index: 'DA', count: 2, percent: 0.0018214936247723133 },
            { index: 'BM', count: 1, percent: 0.0009107468123861566 },
            { index: 'ST', count: 1, percent: 0.0009107468123861566 },
            { index: 'EZ', count: 1, percent: 0.0009107468123861566 }
        ],
        mod_max_percent: 0.17941712204007285,
        pp_attr: [
            { index: '100', count: 390, percent: 0.3551912568306011 },
            { index: '200', count: 127, percent: 0.11566484517304189 },
            { index: '50', count: 229, percent: 0.20856102003642987 },
            { index: '0', count: 51, percent: 0.04644808743169399 },
            { index: '300', count: 3, percent: 0.00273224043715847 }
        ],
        pp_max_percent: 0.3551912568306011
    }
) {
// 导入模板
    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PT-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PT-2">
            <rect x="480" y="330" width="1410" height="240" rx="0" ry="0" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Banner">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: #1c1719;"/>
        <g style="clip-path: url(#clippath-PT-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="20" ry="20" style="fill: #2a2226;"/>
    </g>
    <g id="Main_Card">
    </g>
    <g id="Body_Card">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: #382e32;"/>
    </g>
    <g id="Index">
    </g>
</svg>
`
    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_body = /(?<=<g id="Body_Card">)/;
    const reg_main = /(?<=<g id="Main_Card">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PT-1\);">)/;


    // 插入文字和图片
    const start_time = getFormattedTime(data?.info?.start_time, 'YYYY/MM/DD HH:mm', 'YYYY-MM-DD[T]HH:mm:ss[Z]', 0)
    const end_time = getFormattedTime(data?.info?.end_time, 'YYYY/MM/DD HH:mm', 'YYYY-MM-DD[T]HH:mm:ss[Z], 0')
    const request_time = 'duration: ' + start_time + ' - ' + end_time + ' // request time: ' + getNowTimeStamp();

    const panel_name = getPanelNameSVG('Popular Beatmap (!ympu)', 'PU', request_time);
    svg = setText(svg, panel_name, reg_index);

    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    const card_a2 = card_A2(await popularInfo2cardA2(data.info, data.max_retry?.beatmap))

    svg = setSvgBody(svg, 40, 40, card_a2, reg_main)

    const popular_arr = data?.popular || []
    const popular_params = []

    await Promise.allSettled(
        popular_arr.map((v, i) => {
            return popularBeatmap2cardH(v, i + 1, true)
        })
    ).then(results => thenPush(results, popular_params))

    const populars = popular_params.map((v) => {
        return card_H(v)
    })

    // 渲染
    const componentT1 = getSvgBody(40, 330,
        component_T1(populars)
    )

    const componentT2 = getSvgBody(1000, 330,
        await component_T2(data?.max_retry)
    )

    const componentT3 = getSvgBody(1000, 630,
        component_T3(data.mod_attr, data.mod_max_percent)
    )

    const componentT4 = getSvgBody(1450, 630,
        component_T4(data.pp_attr, data.pp_max_percent)
    )


    svg = setTexts(svg, [componentT1, componentT2, componentT3, componentT4], reg_body)

    
    return svg.toString()
}


// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_T1 = (populars = []) => {
    let svg = `<g id="Component_OT1">
    </g>`

    const reg = /(?<=<g id="Component_OT1">)/;

    let popular_svg = ''

    for (let i = 0; i < 5; i++) {
        const x = 20
        const y = 50 + i * 135

        popular_svg += getSvgBody(x, y, populars[i])
    }

    const title = poppinsBold.getTextPath('Most Popular Beatmaps', 20, 32, 18, 'left baseline', '#fff')

    /*
    const count = poppinsBold.getTextPath('Score Count: ' + (data.score_count || 0), 920, 32, 18, 'right baseline', '#fff')

     */

    const base = PanelDraw.Rect(0, 0, 940, 710, 20, '#382E32')

    svg = setTexts(svg, [popular_svg, title, base], reg)

    return svg.toString()
}

const component_T2 = async (max_retry = {
    beatmap_id: 0,
    count: 0,
    user_id: 0,
    user: null,
    beatmap: null,
}) => {
    let svg = `
    <defs>
        <clipPath id="clippath-OT2-1">
            <circle cx="665" cy="120" r="70" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Component_OT2">
    </g>
    <g id="Avatar_OT2">
        <g clip-path="url(#clippath-OT2-1)"> 
        </g>
    </g>`

    const reg = /(?<=<g id="Component_OT2">)/;
    const reg_avatar = /(?<=<g clip-path="url\(#clippath-OT2-1\)">)/

    const async = []

    await Promise.allSettled([PanelGenerate.beatMap2CardA2(max_retry.beatmap), getAvatar(max_retry.user.avatar_url, true)])
        .then(results => thenPush(results, async))

    const title = poppinsBold.getTextPath('Max Retry', 20, 32, 18, 'left baseline', '#fff')

    const name = poppinsBold.getTextPath(max_retry.user?.username, 665, 222, 30, 'center baseline', '#fff')

    const tries = poppinsBold.get2SizeTextPath((max_retry.count || 0).toString(), ' tries', 30, 24, 665, 258, 'center baseline', '#fff')

    const rrect = PanelDraw.Rect(0, 0, 880, 280, 20, '#382E32')

    svg = setTexts(svg, [
        getSvgBody(20, 50, card_A2(async[0])), title, name, tries, rrect
    ], reg)

    svg = setImage(svg, 665 - 70, 120 - 70, 140, 140, async[1], reg_avatar)

    return svg.toString()
}

const component_T3 = (attr = [], max_percent = 1) => {
    let svg = `<g id="Component_OT3">
    </g>`

    const reg = /(?<=<g id="Component_OT3">)/;

    let mod_svg

    attr.reduce((prev, curr) => {
        const curr_percent = prev + curr.percent;
        const color = getModColor(curr.index);

        mod_svg += PanelDraw.Pie(215, 126, 100, curr_percent, prev, color);

        return curr_percent;
    }, 0)

    // 绘制标签
    let max_width
    let x_count

    if (attr.length <= 4) {
        max_width = 400
        x_count = 1
    } else if (attr.length <= 8) {
        max_width = 195
        x_count = 2
    } else {
        max_width = 126.66
        x_count = 3
    }

    let string_mod_label = '';

    for (let i = 0; i < Math.min(attr.length, 12); i++) {
        const v = attr[i]

        const x = i % x_count
        const y = Math.floor(i / x_count)

        const title = (v?.index || '?')

        const label = label_T({
            icon_title: title,
            abbr: title,
            data_b: (v?.count || 0).toString().padStart(3, '0'),

            bar_progress: (v?.percent || 0) / max_percent,
            bar_color: getModColor(v?.index),
            max_width: max_width,
        })

        string_mod_label += getSvgBody(15 + x * (max_width + 10), 245 + y * 40, label)
    }

    const title = poppinsBold.getTextPath('Mods', 20, 32, 18, 'left baseline', '#fff')

    const rrect = PanelDraw.Rect(0, 0, 430, 410, 20, PanelColor.middle())
    const circle = PanelDraw.Circle(215, 126, 100, PanelColor.top())

    svg = setTexts(svg, [title, mod_svg, string_mod_label, circle, rrect], reg)
    return svg.toString()
}

const component_T4 = (attr = [], max_percent = 1) => {
    let svg = `<g id="Component_OT4">
    </g>`

    const reg = /(?<=<g id="Component_OT4">)/;

    let pp_svg

    attr.reduce((prev, curr) => {
        const curr_percent = prev + curr.percent;
        const color = getPPColor(curr.index);

        pp_svg += PanelDraw.Pie(215, 126, 100, curr_percent, prev, color);

        return curr_percent;
    }, 0)

    // 绘制标签
    let max_width
    let x_count

    if (attr.length <= 4) {
        max_width = 400
        x_count = 1
    } else if (attr.length <= 8) {
        max_width = 195
        x_count = 2
    } else {
        max_width = 126.66
        x_count = 3
    }

    let string_pp_label = '';

    for (let i = 0; i < Math.min(attr.length, 12); i++) {
        const v = attr[i]

        const x = i % x_count
        const y = Math.floor(i / x_count)

        const title = getPPIndex(v?.index || '?')

        const label = label_T({
            icon_title: title,
            abbr: title,
            data_b: (v?.count || 0).toString().padStart(3, '0'),

            bar_progress: (v?.percent || 0) / max_percent,
            bar_color: getPPColor(v?.index),
            max_width: max_width,
        })

        string_pp_label += getSvgBody(15 + x * (max_width + 10), 245 + y * 40, label)
    }

    const title = poppinsBold.getTextPath('PP', 20, 32, 18, 'left baseline', '#fff')

    const rrect = PanelDraw.Rect(0, 0, 430, 410, 20, PanelColor.middle())
    const circle = PanelDraw.Circle(215, 126, 100, PanelColor.top())

    svg = setTexts(svg, [title, pp_svg, string_pp_label, circle, rrect], reg)
    return svg.toString()
}

async function popularInfo2cardA2(info = {}, beatmap = {}) {
    const background = await getMapBackground(beatmap, 'list@2x')
    const right3b = (info?.player_count || 0).toString()

    return {
        background: background,
        map_status: '',

        title1: 'Popular Beatmap',
        title2: 'Group: ' + (info?.group_id || 0),
        title3: 'mode: ' + getGameMode(info?.mode, 2),
        left1: 'member count: ' + (info?.member_count || 0),
        left2: 'beatmap count: ' + (info?.beatmap_count || 0),
        left3: 'score count: ' + (info?.score_count || 0),
        right1: '',
        right2: 'player count:',
        right3b: right3b,
        right3m: '',
    };
}

function getPPIndex(index = "0") {
    let bar_index
    switch (index) {
        case "0": bar_index = '0-50'; break;
        case "50": bar_index = '50-100'; break;
        case "100": bar_index = '100-200'; break;
        case "200": bar_index = '200-300'; break;
        case "300": bar_index = '300-400'; break;
        case "400": bar_index = '400-500'; break;
        case "500": bar_index = '500-600'; break;
        case "600": bar_index = '600+'; break;
        default: bar_index = '?'; break;
    }

    return bar_index
}

function getPPColor(index = "0") {
    let bar_color
    switch (index) {
        case "0": bar_color = '#00B7EE'; break;
        case "50": bar_color = '#31B16C'; break;
        case "100": bar_color = '#FFF45C'; break;
        case "200": bar_color = '#F19149'; break;
        case "300": bar_color = '#EC6841'; break;
        case "400": bar_color = '#EA68A2'; break;
        case "500": bar_color = '#AD5DA1'; break;
        case "600": bar_color = '#5F52A0'; break;
        default: bar_color = '#aaa'; break;
    }

    return bar_color
}

async function popularBeatmap2cardH(popular = {
    beatmap_id: 1,
    count: 0,
    accuracy: 0,
    combo: 0,
    player_count: 0,
    max_retry: {
        beatmap_id: 0,
        count: 0,
        user_id: 0,
        user: null,
        beatmap: null,
    },
    beatmap: {}
}, identifier = 1, use_cache = null) {
    const cache = requireNonNullElse(use_cache, hasLeaderBoard(popular?.beatmap?.ranked || popular?.beatmap?.status))

    const cover = await readNetImage(popular?.beatmap?.beatmapset?.covers?.list, cache);
    const background = await readNetImage(popular?.beatmap?.beatmapset?.covers?.cover, cache);

    const acc = floor((popular?.accuracy * 100), 2) + '%'
    const combo = (popular.combo || 0) + 'x'

    const difficulty_name = popular.beatmap.version ? torus.cutStringTail(
        getKeyDifficulty(popular.beatmap), 24,
        500 - 10 - torus.getTextWidth('[] -   ' + acc + combo, 24), true) : '';

    const color_arr = ['#FFF100', '#FF9800', '#009944', '#00A0E9', '#9922EE']
    const rrect_color = color_arr[(identifier || 1) - 1]
    const color_index = (identifier || 1) <= 1 ? '#2A2226' : '#fff';

    const artist = torus.cutStringTail(popular?.beatmap?.beatmapset?.artist, 24,
        500 - 10 - torus.getTextWidth(' // ' + popular?.beatmap?.beatmapset?.creator, 24), true);

    const title2 = (popular?.beatmap?.beatmapset?.title === popular?.beatmap?.beatmapset?.title_unicode) ? '' : (popular?.beatmap?.beatmapset?.title_unicode || '');

    const index_b = (popular.count || 0).toString()
    const index_l = (popular.player_count || 0).toString() + 'x'

    const star = popular?.beatmap?.difficulty_rating || 0
    const star_color = getStarRatingColor(star)
    const color_label12 = (star < 4) ? '#1c1719' : '#fff'
    const label2 = popular?.beatmap?.id?.toString() || ''

    return {
        background: background,
        cover: cover,
        type: '',

        title: popular?.beatmap?.beatmapset?.title || '',
        title2: title2,
        left1: artist + ' // ' + popular?.beatmap.beatmapset?.creator,
        left2: '[' + difficulty_name + '] - ' + acc + ' ' + combo,
        index_b: index_b,
        index_m: 'PC',
        index_l: index_l,
        index_b_size: 48,
        index_m_size: 36,
        index_l_size: 24,
        label1: floor(star, 1),
        label2: label2,
        label3: '',
        label4: '',
        label5: '#' + identifier,
        mods_arr: [],

        color_title2: '#bbb',
        color_right: rrect_color,
        color_left: star_color,
        color_index: color_index,
        color_label1: star_color,
        color_label2: star_color,
        color_label3: '',
        color_label4: '',
        color_label5: star_color,
        color_label12: color_label12,
        color_left12: '#bbb',

        font_title2: 'PuHuiTi',
        font_label4: 'torus',
    }
}