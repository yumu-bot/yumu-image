import {
    exportJPEG, floor, getAvatar, getKeyDifficulty, getMapBackground, getPanelNameSVG, getSvgBody,
    readNetImage, requireNonNullElse, setImage, setSvgBody, setText,
    setTexts, thenPush
} from "../util/util.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {poppinsBold, torus} from "../util/font.js";
import {hasLeaderBoard} from "../util/star.js";
import {PanelDraw} from "../util/panelDraw.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";

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
export async function panel_T(data = {
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


}) {
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
    const panel_name = getPanelNameSVG('Popular Beatmap (!ympu)', 'PU');
    svg = setText(svg, panel_name, reg_index);

    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    const card_a2 = card_A2(await popularInfo2cardA2(data.info, data.max_retry?.beatmap))

    svg = setSvgBody(svg, 40, 40, card_a2, reg_main)

    const popular_arr = data?.popular || []
    const popular_params = []

    await Promise.allSettled(
        popular_arr.map((v) => {
            return popularBeatmap2cardH(v)
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

    svg = setTexts(svg, [componentT1, componentT2], reg_body)

    
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

    await Promise.allSettled([PanelGenerate.beatMap2CardA2(max_retry.beatmap), getAvatar(max_retry.user, true)])
        .then(results => thenPush(results, async))

    const name = poppinsBold.getTextPath(max_retry.user?.username, 665, 222, 30, 'center baseline', '#fff')

    const tries = poppinsBold.get2SizeTextPath((max_retry.count || 0).toString(), ' tries', 30, 24, 665, 258, 'center baseline', '#fff')

    const rrect = PanelDraw.Rect(0, 0, 880, 280, 20, '#382E32')

    svg = setTexts(svg, [
        getSvgBody(20, 20, async[0]), name, tries, rrect
    ], reg)

    svg = setImage(svg, 665 - 70, 120 - 70, 140, 140, async[1], reg_avatar)

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
        title3: '',
        left1: '',
        left2: 'member count: ' + (info?.member_count || 0),
        left3: 'score count: ' + (info?.score_count || 0),
        right1: '',
        right2: 'player count:',
        right3b: right3b,
        right3m: '',
    };
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

    const cover = await readNetImage(popular?.beatmapset?.covers?.list, cache);
    const background = await readNetImage(popular?.beatmapset?.covers?.cover, cache);

    const acc = floor((popular?.accuracy * 100), 2) + '%'
    const combo = (popular.combo || 0) + 'x'

    const difficulty_name = popular.beatmap.version ? torus.cutStringTail(
        getKeyDifficulty(popular.beatmap), 24,
        500 - 10 - torus.getTextWidth('[] -   ' + acc + combo, 24), true) : '';

    const color_arr = ['#FFF100', '#FF9800', '#009944', '#00A0E9', '#9922EE']
    const star_color = color_arr[(identifier || 1) - 1]
    const color_index = (identifier || 1) <= 1 ? '#2A2226' : '#fff';

    const artist = torus.cutStringTail(popular.beatmapset.artist, 24,
        500 - 10 - torus.getTextWidth(' // ' + popular.beatmapset.creator, 24), true);

    const title2 = (popular.beatmapset.title === popular.beatmapset.title_unicode) ? '' : (popular?.beatmapset?.title_unicode || '');

    const index_b = (popular.count || 0).toString()
    const index_l = (popular.player_count || 0).toString() + 'x'

    const star = popular?.beatmap?.difficulty_rating || 0
    const color_label12 = (star < 4) ? '#1c1719' : '#fff'
    const label2 = popular?.beatmap?.id?.toString() || ''

    return {
        background: background,
        cover: cover,
        type: '',

        title: popular.beatmapset.title || '',
        title2: title2,
        left1: artist + ' // ' + popular.beatmapset.creator,
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
        color_right: star_color,
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