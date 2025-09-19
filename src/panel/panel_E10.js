import {
    exportJPEG,
    floor,
    floors,
    getAvatar,
    getBanner, getBeatMapTitlePath, getDiffBackground,
    getDifficultyIndex,
    getFlagPath,
    getGameMode,
    getImageFromV3, getKeyDifficulty,
    getMapStatusImage,
    getSvgBody,
    getTimeDifference, isEmptyArray, readNetImage,
    round, rounds,
    setImage,
    setText,
    setTexts
} from "../util/util.js";
import {extra, getMultipleTextPath, getTextWidth, poppinsBold} from "../util/font.js";
import {getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {LABELS} from "../component/label.js";
import {drawLazerMods} from "../util/mod.js";
import {getRankBackground} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_E10(data);
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
        const svg = await panel_E10(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 封面成绩面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_E10(data = {
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
    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <g id="Base">
        <rect width="1920" height="1080" rx="0" ry="0" style="fill: #1c1719;"/>
    </g>
    <g id="Background">
    </g>
    <g id="Component">
    </g>
</svg>
    `

    const reg_component = /(?<=<g id="Component">)/;
    const reg_background = /(?<=<g id="Background">)/;

    const background = await getDiffBackground(data.score)

    const componentE1 = await component_E1(await PanelEGenerate.user2componentE1(data.user))
    const componentE2 = component_E2(PanelEGenerate.score2componentE2(data.score))
    const componentE3 = component_E3(PanelEGenerate.beatmap2componentE3(data.score.beatmap))
    const componentE4 = component_E4(PanelEGenerate.score2componentE4(data.score, data.density))
    const componentE5 = component_E5(PanelEGenerate.score2componentE5(data.score))
    const componentE6 = component_E6(PanelEGenerate.score2componentE6(data.score, data.progress))
    const componentE7 = component_E7(PanelEGenerate.score2componentE7(data.score, data.attributes))
    const componentE8 = component_E8({
        combo: data.score?.max_combo,
        max_combo: data.score?.beatmap?.max_combo,
    })
    const componentE9 = component_E9({
        accuracy: data?.score?.legacy_accuracy,
    })
    const componentE10 = component_E10(PanelEGenerate.score2componentE10(data.score))

    const componentE11 = component_E11(await PanelEGenerate.score2componentE11(data.score, background))

    const bodyE1 = getSvgBody(275, 35, componentE1)
    const bodyE2 = getSvgBody(275, 295, componentE2)
    const bodyE3 = getSvgBody(275, 405, componentE3)
    const bodyE4 = getSvgBody(275, 515, componentE4)
    const bodyE5 = getSvgBody(275, 655, componentE5)
    const bodyE7 = getSvgBody(1145, 35, componentE7)
    const bodyE8 = getSvgBody(1225, 295, componentE8)
    const bodyE9 = getSvgBody(1330, 405, componentE9)
    const bodyE10 = getSvgBody(1330, 515, componentE10)
    const bodyE11 = getSvgBody(275, 825, componentE11)

    const copyright = poppinsBold.getTextPath(
        'powered by Yumubot - Show Panel',
        960, 1080 - 10, 24, 'center baseline', '#fff', 0.3
    )

    svg = setTexts(svg, [bodyE1, bodyE2, bodyE3, bodyE4, bodyE5, componentE6, bodyE7, bodyE8, bodyE9, bodyE10, bodyE11, copyright], reg_component)

    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.6)

    return svg.toString()
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_E1 = async (
    // 这个是 Card A1 的另一个版本
    data = {
        background: getImageFromV3('card-default.png'),
        avatar: getImageFromV3('avatar-guest.png'),

        country: null,
        team_url: null,

        top1: 'Muziyami',
        top2: '4111',
        left: '28075',
        right_b: '4396',
        right_m: 'PP',
    }) => {

    let svg = `
        <defs>
        <clipPath id="clippath-CO1-1">
            <rect width="500" height="230" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-CO1-2">
            <rect x="25" y="25" width="140" height="140" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-CO1-3">
            <rect id="CountryFlag" x="185" y="78" width="60" height="44" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-CO1-4">
            <rect id="TeamFlag" x="400" y="80" rx="5" ry = "5" width="76" height="38" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Background">
        <rect width="500" height="230" rx="20" ry="20" style="fill: #382E32;"/>
        <g style="clip-path: url(#clippath-CO1-1);">
        </g>
    </g>
    <g id="Avatar">
        <rect x="25" y="25" width="140" height="140" rx="20" ry="20" style="fill: #382E32;"/>
        <g style="clip-path: url(#clippath-CO1-2);">
        </g>
    </g>
    <g id="SubIcons">
        <g style="clip-path: url(#clippath-CO1-3);">
        </g>
        <g style="clip-path: url(#clippath-CO1-4);">
        </g>
    </g>
    <g id="Text">
    </g>
    `

    const reg_text = /(?<=<g id="Text">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CO1-1\);">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CO1-2\);">)/;
    const reg_country_flag = /(?<=<g style="clip-path: url\(#clippath-CO1-3\);">)/;
    const reg_team_flag = /(?<=<g style="clip-path: url\(#clippath-CO1-4\);">)/;

    // 文本定义
    const top1 = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data?.top1, 48, 500 - 10 - 185),
        185, 62, 48, 'left baseline', '#fff')

    const top2 = poppinsBold.get2SizeTextPath('#', data?.top2, 18, 30,
        250, 120, 'left baseline', '#fff')

    const left = poppinsBold.get2SizeTextPath('#', data?.left, 18, 30,
        25, 214, 'left baseline', '#fff')

    const right = poppinsBold.get2SizeTextPath(data?.right_b, data?.right_m, 72, 48,
        500 - 20, 230 - 15, 'right baseline', '#fff')

    const flag_svg = await getFlagPath(data.country, 185, 78, 44); //x +5px

    const team = await readNetImage(data.team_url, true, '')

    // 替换内容
    svg = setTexts(svg, [top1, top2, left, right], reg_text)

    // 替换图片
    svg = setImage(svg, 0, 0, 500, 230, data.background, reg_background, 0.6);
    svg = setImage(svg, 25, 25, 140, 140, data.avatar, reg_avatar, 1);
    svg = setText(svg, flag_svg, reg_country_flag);
    svg = setImage(svg, 405, 84, 76, 38, team, reg_team_flag, 1, 'xMidYMid meet')

    return svg.toString();
}

const component_E2 = (
    data = {
        name: 'insane',
        star: 0.0,
        mode: 'osu',
    }
) => {
    let svg = `
          <g id="Text_OE2">
          </g>
    `

    const reg_text = /(?<=<g id="Text_OE2">)/;

    const rrect = PanelDraw.Rect(0, 0, 420, 80, 40, '#382E32', 1)

    const ruleset = extra.getTextPath(getGameMode(data.mode, -1), 12 - 2, 70 - 6, 68, 'left baseline', getStarRatingColor(data.star))

    const star_floor = floors(data.star, 2)

    const text_arr = [
        {
            font: "poppinsBold",
            text: star_floor.integer,
            size: 66,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: star_floor.decimal,
            size: 48,
            color: '#fff',
        },
        {
            font: "poppinsBold",
            text: ' / ' + data?.name,
            size: 30,
            color: '#fff',
        },
    ]

    const texts = getMultipleTextPath(text_arr, 85, 62, "left baseline");

    svg = setTexts(svg, [ruleset, texts, rrect], reg_text)

    return svg.toString()
}

const component_E3 = (
    data = {
        status: 'graveyard',
        rating: 0.0,
    }
) => {
    let svg = `
          <g id="Text_OE3">
          </g>
          <g id="Image_OE3">
          </g>
    `

    const reg_image = /(?<=<g id="Image_OE3">)/;
    const reg_text = /(?<=<g id="Text_OE3">)/;

    const rrect = PanelDraw.Rect(0, 0, 315, 80, 40, '#382E32', 1)

    const status_text = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data.status.toUpperCase(), 30, 315 - 15 - 85)
        , 85, 35, 30)

    const rating_text = poppinsBold.getTextPath(
        round(data.rating, 1),
        85, 68, 30
    )

    const status_image = getMapStatusImage(data.status)

    svg = setImage(svg, 19, 15, 50, 50, status_image, reg_image)

    svg = setTexts(svg, [status_text, rating_text, rrect], reg_text)

    return svg.toString();
}

const component_E4 = (
    data = {
        star: 0.0,
        color: '#fff',
        density_arr: [],
        fail_arr: [],
        retry_arr: [],
    }
) => {
    let svg = `
          <g id="Text_OE4">
          </g>
    `

    const reg_text = /(?<=<g id="Text_OE4">)/;

    const rrect = PanelDraw.Rect(0, 0, 315, 120, 40, '#382E32', 1)

    // 评级或难度分布矩形的缩放，SR1为0.1倍，SR8为1倍
    let density_scale = 1;
    if (data.star <= 1) {
        density_scale = 0.1;
    } else if (data.star <= 8) {
        density_scale = Math.sqrt(((data.star - 1) / 7 * 0.9) + 0.1); //类似对数增长，比如4.5星高度就是原来的 0.707 倍
    }

    const density_arr_max = Math.max.apply(Math, data.density_arr) / density_scale;

    const density = PanelDraw.LineChart(data.density_arr, density_arr_max, 0, 15, 45 + 10, 315 - 30, 45, data.color, 1, 0.4, 3);

    //中下的失败率重试率图像
    const rf_arr = data.fail_arr ? data.fail_arr.map(function (v, i) {
        return v + data.retry_arr[i];
    }) : [];
    const rf_max = Math.max.apply(Math, rf_arr);
    const retry = PanelDraw.BarChart(rf_arr, rf_max, 0,
        15, 110, 315 - 30, 45, 2, 0, '#f6d659');
    const fail = PanelDraw.BarChart(data.fail_arr, rf_max, 0,
        15, 110, 315 - 30, 45, 2, 0, '#ed6c9e');

    svg = setTexts(svg, [density, fail, retry, rrect], reg_text)

    return svg.toString();
}

const component_E5 = (
    data = {
        labels: []
    }
) => {
    let svg = `
          <g id="Text_OE5">
          </g>
    `

    const reg_text = /(?<=<g id="Text_OE5">)/;

    let labels = ''

    for (let i = 0; i < data.labels.length; i++) {
        const x = 165 * (i % 2)
        const y = 55 * Math.floor(i / 2)

        labels += getSvgBody(x, y, label_E10D(data.labels[i]))
    }

    svg = setText(svg, labels, reg_text)

    return svg.toString()
}

const component_E6 = (
    data = {
        top: '',
        bottom: '',
        mods: [],
        rank: 'F',
    }
) => {
    let svg = `
          <g id="Text_OE6">
          </g>
    `

    const reg_text = /(?<=<g id="Text_OE6">)/;

    const texts = poppinsBold.getTextPath(
        data.top, 960, 130, 128, 'center baseline', '#fff'
    ) + poppinsBold.getTextPath(
        data.bottom, 960, 205, 48, 'center baseline', '#fff'
    )

    const mods = drawLazerMods(data.mods, 960, 260 - 6, 70, 350, 'center', 6, true).svg //getModsBody(data.mods, 960, 260, 'center', 350)

    // 评级
    const rank = data?.rank

    svg = setImage(svg, 665, 250, 590, 590, getImageFromV3(`object-score-${rank}2.png`), reg_text, 1);

    svg = setTexts(svg, [texts, mods], reg_text)

    return svg.toString()
}

const component_E7 = (data = {
    pp: 0,
    full_pp: 0,
    perfect_pp: 0,

    aim_pp: 0,
    spd_pp: 0,
    acc_pp: 0,
    fl_pp: 0,
    diff_pp: 0,

    is_fc: false,
    is_pf: false,

    mode: 'o',
    rank: 'F',
    passed: false,
}) => {
    let svg =
        `   <defs>
            <clipPath id="clippath-OE7-1">
                <rect id="SR_Base" x="15" y="125" width="470" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-2">
                <rect id="SR_Base" x="15" y="125" width="470" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-3">
                <rect id="SR_Base" x="15" y="125" width="470" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-4">
                <rect id="SR_Base" x="15" y="125" width="470" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-5">
                <rect id="SR_Base" x="15" y="125" width="470" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-6">
                <rect id="SR_Base" x="15" y="125" width="470" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OE7-7">
                <rect id="BG_Base" x="0" y="0" width="500" height="230" rx="40" ry="40" style="fill: none;"/>
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
            <rect id="Base" x="0" y="0" width="500" height="230" rx="40" ry="40" style="fill: #382e32;"/>
          </g>
          <g id="Background_OE7" style="clip-path: url(#clippath-OE7-7)">
          </g>
          <g id="Rect_OE7">
            <rect id="Star" x="15" y="125" width="470" height="30" rx="15" ry="15" style="fill: url(#grad-OE7-12); fill-opacity: 0.2"/>
            
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
    const reg_clip6 = /(?<=<g id="Clip_OE7-6" style="clip-path: url\(#clippath-OE7-6\);">)/;

    const reg_bg = /(?<=<g id="Background_OE7" style="clip-path: url\(#clippath-OE7-7\)">)/;

    let index_fc_text
    let index_pp_text

    if (data.is_pf === true) {
        index_fc_text = ''
        index_pp_text = 'MAX'
    } else if (data.is_fc === true) {
        index_fc_text = 'PP IF SS'
        index_pp_text = Math.round(data?.perfect_pp || 0).toString()
    } else {
        index_fc_text = 'PP IF FC'
        index_pp_text = Math.round(data?.full_pp || 0).toString()
    }

    const pp_text = poppinsBold.get2SizeTextPath(
        Math.round(data?.pp).toString(), 'PP', 108, 72, 470 / 2, 106, 'center baseline', '#fff'
    )

    const index_text = poppinsBold.get2SizeTextPath(
        index_pp_text, index_fc_text, 60, 48, 470 / 2, 214, 'center baseline', '#fff'
    )

    let reference_pp

    if (data.is_pf === true || data.is_fc === true) {
        reference_pp = data?.perfect_pp
    } else {
        reference_pp = data?.full_pp
    }

    switch (data?.mode) {
        case 'o': {
            const sum = data?.aim_pp + data?.spd_pp + data?.acc_pp + data?.fl_pp || 0;

            const aim_width = getChildPPWidth(data?.aim_pp, sum, data?.pp, reference_pp);
            const spd_width = getChildPPWidth(data?.spd_pp, sum, data?.pp, reference_pp);
            const acc_width = getChildPPWidth(data?.acc_pp, sum, data?.pp, reference_pp);
            const fl_width = getChildPPWidth(data?.fl_pp, sum, data?.pp, reference_pp);

            const aim_rect = PanelDraw.Rect(15, 125, aim_width, 30, 15, "url(#grad-OE7-12)", 1);
            const spd_rect = PanelDraw.Rect(15, 125, aim_width + spd_width, 30, 15, "url(#grad-OE7-13)", 1);
            const acc_rect = PanelDraw.Rect(15, 125, aim_width + spd_width + acc_width, 30, 15, "url(#grad-OE7-14)", 1);
            const fl_rect = PanelDraw.Rect(15, 125, aim_width + spd_width + acc_width + fl_width, 30, 15, "url(#grad-OE7-15)", 1);

            const aim_text = getChildPPPath("AIM", 15, 148, 24, aim_width, aim_width, 10);
            const spd_text = getChildPPPath("SPD", 15, 148, 24, aim_width + spd_width, spd_width, 10);
            const acc_text = getChildPPPath("ACC", 15, 148, 24, aim_width + spd_width + acc_width, acc_width, 10);
            const fl_text = getChildPPPath("FL", 15, 148, 24, aim_width + spd_width + acc_width + fl_width, fl_width, 10);

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

            const diff_rect = PanelDraw.Rect(15, 125, diff_width, 30, 15, "url(#grad-OE7-13)", 1);
            const acc_rect = PanelDraw.Rect(15, 125, diff_width + acc_width, 30, 15, "url(#grad-OE7-14)", 1);

            const diff_text = getChildPPPath("DIFF", 15, 148, 24, diff_width, diff_width, 10);
            const acc_text = getChildPPPath("ACC", 15, 148, 24, diff_width + acc_width, acc_width, 10);

            svg = setText(svg, diff_rect, reg_clip3);
            svg = setText(svg, acc_rect, reg_clip4);
            svg = setTexts(svg, [diff_text, acc_text], reg_text);
            break;
        }
    }

    svg = setTexts(svg, [pp_text, index_text], reg_text);

    // 保底 PP
    const pp_width = (reference_pp > 0) ? ((data?.pp / reference_pp) * 470) : 470;
    const pp_rect = PanelDraw.Rect(15, 125, pp_width, 30, 15, "url(#grad-OE7-16)", 1);
    svg = setText(svg, pp_rect, reg_clip6);

    const background = getRankBackground(data.rank, data?.score?.passed);

    svg = setImage(svg, 0, 0, 500, 230, background, reg_bg, 0.4)

    return svg.toString()


    // 在有值的时候最低是 min_width，没有值则是 0
    // 注意！这个值加起来的和，总会比原来的成绩 PP 的宽度大一点点（因为最短限制为 30）
    function getChildPPWidth(child_pp = 0, child_sum_pp = 0, pp = 0, full_pp = 0, max_width = 470, min_width = 30) {
        const pp_width = (pp / full_pp) * max_width;
        const child_pp_width = (child_pp / child_sum_pp) * pp_width;
        return (child_pp > 0) ? Math.max(min_width, child_pp_width) : 0;
    }

    function getChildPPPath(type = 'AIM', x = 0, y = 0, size = 24, offset = 30, width = 30, interval = 0, max_width = 470) {
        const shown = isTextShown('poppinsBold', type, size, width, interval);
        const slight = isTextSlightlyWider('poppinsBold', type, size, width, interval);

        return shown ?
            poppinsBold.getTextPath(type, x + Math.min(offset, max_width) - interval, y, size, 'right baseline', '#382c32') :
            (slight ? poppinsBold.getTextPath(type, x + Math.min(offset, max_width) - (1 / 2 * width), y, size, 'center baseline', '#382c32') : '');
    }

    // 宽度大于最大宽 + 2x 间距
    function isTextShown(font = 'poppinsBold', type = '', size = 24, width = 0, interval = 0) {
        return typeof type === "string" && width > 0 && (width - 2 * interval >= getTextWidth(font, type, size));
    }

    // 宽度大于最大宽 - 1/2x 间距
    function isTextSlightlyWider(font = 'poppinsBold', type = '', size = 24, width = 0, interval = 0) {
        return typeof type === "string" && width > 0 && (width + 1/2 * interval >= getTextWidth(font, type, size));
    }
}

const component_E8 = (
    data = {
        combo: 0,
        max_combo: 0,
    }
) => {
    let svg = `
          <g id="Text_OE8">
          </g>
    `

    const reg_text = /(?<=<g id="Text_OE8">)/;

    const text = poppinsBold.get2SizeTextPath(
        (data?.combo || 0) + 'x', ' / ' + (data?.max_combo || 0) + 'x', 66, 30, 210, 62
    )

    const rrect = PanelDraw.Rect(0, 0, 420, 80, 40, '#382E32')

    svg = setTexts(svg, [text, rrect], reg_text)

    return svg.toString()
}

const component_E9 = (
    data = {
        accuracy: 0,
    }
) => {
    let svg = `
          <g id="Text_OE9">
          </g>
    `

    const reg_text = /(?<=<g id="Text_OE9">)/;

    const acc_data = rounds(data.accuracy * 100, 2)

    const text = poppinsBold.get2SizeTextPath(
        acc_data.integer, acc_data.decimal + '%', 66, 30, 315 / 2, 62
    )

    const rrect = PanelDraw.Rect(0, 0, 315, 80, 40, '#382E32')

    svg = setTexts(svg, [text, rrect], reg_text)

    return svg.toString()
}

const component_E10 = (
    data = {
        statistics: [],
        max_statistics: [],

        is_lazer: false,
        mode: 'o',
    }
) => {

    let svg = ''

    for (let i = 0; i < data?.statistics?.length; i++) {
        const v = data?.statistics[i]
        const m = data?.max_statistics[i]

        if (v == null) continue

        const y = 50 * i

        svg += getSvgBody(0, y,
            label_E10S({
                ...v,
                max_stat: m
            }
        ))
    }

    return svg.toString()
}

const component_E11 = (
    data = {
        title: '',
        title_unicode: '',
        artist: '',

        bid: 0,
        creator: '',
        difficulty_name: '',

        background: '',
    }
) => {
    let svg = `   <defs>
            <filter id="blur-OE11-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
            </filter>
            <clipPath id="clippath-OE11-1">
                <rect id="BG_Base" x="0" y="0" width="1370" height="220" rx="40" ry="40" style="fill: none;"/>
            </clipPath>
            </defs>
        <g id="Base_OE11">
        </g>
        <g id="Background_OE11" filter="url(#blur-OE11-BG)" style="clip-path: url(#clippath-OE11-1);">
        </g>
        <g id="Text_OE11">
        </g>
    `;

    const reg_text = /(?<=<g id="Text_OE11">)/;
    const reg_background = /(?<=<g id="Background_OE11" filter="url\(#blur-OE11-BG\)" style="clip-path: url\(#clippath-OE11-1\);">)/;
    const reg_base = /(?<=<g id="Base_OE11">)/;

    const t = getBeatMapTitlePath("poppinsBold", "PuHuiTi",
        data?.title || '', data?.title_unicode || '', data?.artist || '', 1370 / 2, 70, 134, 60, 40, 1370 - 20);

    const diff_text = poppinsBold.cutStringTail(data?.difficulty_name || '', 40,
        1370 - 40 - 10
        - 2 * Math.max(
            poppinsBold.getTextWidth(poppinsBold.cutStringTail(data?.creator || '', 36, 320, true), 24),
            poppinsBold.getTextWidth('b' + (data?.bid || 0), 36)
        ), true)

    const diff = poppinsBold.getTextPath(diff_text, 1370 / 2, 194, 40, 'center baseline', '#fff');
    const creator = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(data?.creator || '', 36, 320, true),
        20, 194, 36, 'left baseline', '#fff');
    const bid = poppinsBold.getTextPath('b' + (data?.bid || 0), 1370 - 20, 194, 36, 'right baseline', '#fff');

    const background = data?.background;

    const rect = PanelDraw.Rect(0, 0, 1370, 220, 40, '#382E32', 1);

    svg = setTexts(svg, [t.title, t.title_unicode, bid, creator, diff], reg_text);
    svg = setImage(svg, 0, 0, 1370, 220, background, reg_background, 0.6);
    svg = setText(svg, rect, reg_base);

    return svg.toString()
}


// 私有转换方式
const PanelEGenerate = {
    user2componentE1: async (user) => {
        const background = user?.profile?.card || await getBanner(user?.cover_url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        const left = user?.statistics?.global_rank ? (user.statistics.global_rank.toString()) :
            (user?.rank_highest?.rank ?
                user.rank_highest.rank + '^ (' + getTimeDifference(user.rank_highest.updated_at) + ')' :
                '0')

        const isBot = user?.is_bot;
        const right3b = isBot ? 'Bot' : (user?.pp ? Math.round(user?.pp).toString() : '');
        const right3m = isBot ? '' : (user?.pp ? 'PP' :
            (user?.statistics?.level_current === 1 && user?.statistics?.level_progress === 0 ? 'NOT PLAYED' : 'AFK'));

        return {
            background: background,
            avatar: avatar,

            country: user?.country?.code || 'CN',
            team_url: user?.team?.flag_url,

            top1: user?.username,
            top2: user?.statistics?.country_rank?.toString() || '0',
            left: left,
            right_b: right3b,
            right_m: right3m,
        }
    },

    score2componentE2: (score) => {
        const sr = score?.beatmap.difficulty_rating || 0;
        const mode = score?.mode || 'osu';
        const name = getDifficultyIndex(score?.beatmap?.version, sr, mode, score?.mods)

        return {
            name: name,
            star: sr,
            mode: mode,
        }
    },

    beatmap2componentE3: (beatmap) => {
        return {
            status: beatmap?.status || 'graveyard',
            rating: beatmap?.beatmapset?.public_rating || 0.0,
        }
    },

    score2componentE4: (score, density = []) => {
        return {
            star: score?.beatmap?.difficulty_rating || 0,
            color: getRankColor(score.legacy_rank),

            density_arr: density,
            retry_arr: score?.beatmap?.retries || [],
            fail_arr: score?.beatmap?.fails || [],
        }
    },

    score2componentE5: (score) => {
        const mode = getGameMode(score?.ruleset_id, 1);

        const bpm_data = (score?.beatmap?.bpm >= 1000) ? floor(score?.beatmap?.bpm, 0, -1) : Math.floor(score?.beatmap?.bpm || 0).toString() ;

        const bpm = {
            ...LABELS.BPM,
            data_b: bpm_data,
            data_m: '',
        }

        const length_min = Math.floor(score?.beatmap?.total_length / 60)
        const length_sec = Math.floor(score?.beatmap?.total_length % 60)

        const length_b = length_min >= 100 ? '>100' : length_min.toString()

        const length_m = length_min >= 10 ? 'm' : ':' + length_sec.toFixed(0).padStart(2, '0')

        const length = {
            ...LABELS.LENGTH,
            data_b: length_b,
            data_m: length_m,
        }

        const cs_data = floors(score?.beatmap?.cs, 1)

        const cs = {
            ...(mode === 'm' ? LABELS.KEY : LABELS.CS),
            data_b: cs_data.integer,
            data_m: cs_data.decimal,
        }

        const ar_data = floors(score?.beatmap?.ar, 1)

        const ar = {
            ...LABELS.AR,
            data_b: ar_data.integer,
            data_m: ar_data.decimal,
        }

        const od_data = floors(score?.beatmap?.od, 1)

        const od = {
            ...LABELS.OD,
            data_b: od_data.integer,
            data_m: od_data.decimal,
        }

        const hp_data = floors(score?.beatmap?.hp, 1)

        const hp = {
            ...LABELS.HP,
            data_b: hp_data.integer,
            data_m: hp_data.decimal,
        }

        let labels = []

        const empty = {
            abbr: '',
            data_b: '-',
            data_m: '',
            bar_color: '#382E32',
            is_display: false
        }

        switch (mode) {
            case "o": labels = [bpm, length, cs, ar, od, hp]; break;
            case "t": labels = [bpm, length, empty, empty, od, hp]; break;
            case "c": labels = [bpm, length, cs, ar, empty, hp]; break;
            case "m": labels = [bpm, length, cs, empty, od, hp]; break;
        }

        return {
            labels: labels
        }
    },

    score2componentE6: (score, progress) => {
        const mode = getGameMode(score?.ruleset_id, 1);

        const max_stat = score?.maximum_statistics
        const stat = score?.statistics

        const is_fc = (score?.max_combo / score?.beatmap?.max_combo) > 0.98 && stat?.miss === 0

        let top
        let bottom

        if (mode === 'm') {
            // 注意，这里用的是 lazer 的 accuracy
            if (((score?.accuracy > (1 - 1e-4)) || stat.perfect === max_stat.perfect)) {
                top = 'AP+'
                bottom = 'PERFECT+'
            } else {
                const rate = stat.perfect / stat.great

                let rate_text

                if (rate >= 10) {
                    rate_text = round(rate, 0)
                } else if (rate < 1) {
                    rate_text = round(rate, 2)
                } else {
                    rate_text = round(rate, 1)
                }

                top = rate_text + 'x'
                bottom = 'PG/GR RATE'
            }
        } else if (score?.legacy_rank === 'X' || score?.legacy_rank === 'XH') {
            top = 'AP'
            bottom = 'PERFECT'
        } else if (score?.legacy_perfect === true || score?.is_perfect_combo === true) {
            top = 'FC+'
            bottom = 'FULLCOMBO+'
        } else if (is_fc) {
            top = 'FC'
            bottom = 'FULLCOMBO'
        } else if (stat.miss <= 20 || (stat.miss / score?.total_hits || 1) <= 0.1) {
            top = stat.miss + 'x'
            bottom = 'MISS'
        } else if (score?.legacy_rank !== 'F') {
            top = 'PASS'
            bottom = ''
        } else {
            top = Math.round(progress * 100) + '%'
            bottom = 'PROGRESS'
        }

        return {
            top: top,
            bottom: bottom,
            mods: score?.mods || [],
            rank: score?.legacy_rank || 'F',
        }
    },

    score2componentE7: (score, attr) => {
        const mode = getGameMode(score?.ruleset_id, 1)

        const is_fc = (score?.max_combo / score?.beatmap?.max_combo) > 0.98 || score?.legacy_perfect === true || score?.is_perfect_combo === true

        const is_pf = score?.rank === 'X' || score?.rank === 'XH'

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
            is_pf: is_pf,

            mode: mode,
            rank: score?.legacy_rank,
            passed: score?.passed,
        }
    },

    score2componentE10: (score) => {
        const mode = getGameMode(score?.mode, 1)

        const s = score?.statistics
        const m = score?.maximum_statistics

        let stats = []
        let max_stats = []

        switch (mode) {
            case 'o': {
                stats.push(null, null, {
                    index: 'GR',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: 'OK',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: 'MH',
                    stat: s.meh,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: 'MS',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                });
                break;
            }

            case 't': {
                stats.push(null, null, null, {
                    index: 'GR',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: 'OK',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: 'MS',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                });
                break;
            }

            case 'c': {
                stats.push(null, {
                    index: 'L',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: 'M',
                    stat: s.large_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: 'S',
                    stat: s.small_tick_hit,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: 'MS',
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
                    index: 'PG',
                    stat: s.perfect,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                }, {
                    index: 'GR',
                    stat: s.great,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#FEF668',
                }, {
                    index: 'GD',
                    stat: s.good,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                }, {
                    index: 'OK',
                    stat: s.ok,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#5E8AC6',
                }, {
                    index: 'MH',
                    stat: s.meh,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#A1A1A1',
                }, {
                    index: 'MS',
                    stat: s.miss,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                });
                break;
            }
        }

        switch (mode) {
            case 'o': {
                const max = m.great
                max_stats = [0, 0, max, max, max, max]
            } break;
            case 't': {
                const max = m.great
                max_stats = [0, 0, 0, max, max, max]
            } break;
            case 'c': {
                const max = Math.max(m.great, m.small_tick_hit)
                const droplet = m.small_tick_hit
                max_stats = [0, max, max, max, max, droplet]
            } break;
            case 'm': {
                const max = Math.max((s.great + s.perfect), s.good, s.ok, s.meh, s.miss)
                max_stats = [max, max, max, max, max, max]
            }
        }

        return {
            statistics: stats,
            max_statistics: max_stats,

            is_lazer: score?.is_lazer,
            mode: mode,
        }
    },


    score2componentE11: async (score, background) => {
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
            background: background,
            creator: creators,
        }
    }
}

const label_E10S = (data = {
    index: 'GR',
    stat: 0,
    index_color: '#fff',
    stat_color: '#fff',
    rrect_color: '#8DCFF4',

    max_stat: 1,
}) => {
    const base = PanelDraw.Rect(0, 0, 315, 40, 20, '#382E32')

    const percent = data?.stat / (data?.max_stat || 1)

    const progress = PanelDraw.Rect((315 - 80) * (1 - percent), 0, (315 - 80) * percent + 80, 40, 20, data?.rrect_color, 0.4)

    const top = PanelDraw.Rect(315 - 80, 0, 80, 40, 20, data?.rrect_color, 1)

    const index = poppinsBold.getTextPath(data?.index, 315 - 40, 30, 30, 'center baseline', data?.index_color)

    const stat = poppinsBold.getTextPath(data?.stat?.toString(), 15, 30, 30, 'left baseline', data?.stat_color)

    return '<g id="Label_E10S">' + base + progress + top + stat + index + '</g>'
}

const label_E10D = (data = {
    abbr: '',
    data_b: '-',
    data_m: '',
    bar_color: '#382E32',
    is_display: false,
}) => {
    let svg = '<g id="Label_E10D">'

    svg += PanelDraw.Rect(0, 0, 150, 40, 20, '#382E32')

    svg += PanelDraw.Rect(0, 0, 150, 40, 20, data.bar_color, data?.is_display === false ? 0 : 0.2)

    svg += PanelDraw.Rect(0, 0, 80, 40, 20, data.bar_color, data?.is_display === false ? 0.2 : 1)

    const text_color = data?.is_display === false ? '#aaa' : '#fff'

    const texts = poppinsBold.getTextPath(
        data?.abbr || data?.icon_title, 40, 30, 30, 'center baseline', text_color
    ) + poppinsBold.get2SizeTextPath(data.data_b, data.data_m, 30, 24, 112, 30, 'center baseline', text_color)

    svg += texts

    return svg.toString() + '</g>'
}

