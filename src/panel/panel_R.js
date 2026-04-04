import {
    ar2ms,
    averageArrayToFixedLength,
    cs2px,
    exportJPEG,
    floor,
    getAvatar,
    getBeatMapTitlePath,
    getGameMode,
    getGenre,
    getImage,
    getImageFromV3,
    getLanguage,
    getPanelNameSVG,
    getRandomString,
    getSvgBody,
    isASCII,
    od2ms,
    readNetImage,
    round,
    rounds,
    setImage,
    setText,
    setTexts,
} from "../util/util.js";
import {hasLeaderBoard} from "../util/star.js";
import {PanelDraw} from "../util/panelDraw.js";
import {extra, poppinsBold, PuHuiTi} from "../util/font.js";
import {
    changeHexLightness,
    colorArray,
    getStarRatingColor,
    getStarTextColor,
    getTagCategoryColor
} from "../util/color.js";
import {label_E5, LABELS} from "../component/label.js";
import {drawLazerMods} from "../util/mod.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_R(data);
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
        const svg = await panel_R(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

// 进阶谱面信息 !m
async function panel_R(data = {
    set: {
        "related_tags": [{
            id: 19,
            ruleset_id: 0,
            description: 'Focuses heavily on jumps, i.e. circles spaced far apart that require the player to move towards, slow down to hit, then speed up to move towards the next object.',
            category: 'skillset',
            type: 'jumps'
        },
            {
                id: 2,
                description: 'Accessible and straightforward map design.',
                category: 'expression',
                type: 'simple'
            }
        ]
    },
    beatmap: {
        beatmapset_id: 1087774,
        difficulty_rating: 5.37737,
        id: 2274671,
        mode: 'OSU',
        status: 'ranked',
        total_length: 192,
        user_id: 7003013,
        version: 'Brilliant Dreamland',
        beatmapset: {
            anime_cover: false,
            artist: 'Wang Rui',
            artist_unicode: '汪睿',
            availability: [Object],
            bpm: 0,
            covers: [Object],
            creator: 'Muziyami',
            current_nominations: [Array],
            discussion_locked: false,
            favourite_count: 498,
            genre: [Object],
            genre_id: 0,
            has_leader_board: true,
            id: 1087774,
            is_scoreable: false,
            language: [Object],
            language_id: 0,
            last_updated: '2026-03-12T11:40:03.9137813+08:00',
            mappers: [Array],
            nominators: [Array],
            nsfw: false,
            offset: 0,
            pack_tags: [Array],
            play_count: 266699,
            preview_name: 'Wang Rui - Tao Hua Xiao (Muziyami)',
            preview_url: '',
            public_rating: 0,
            ranked: 1,
            ranked_date: '2022-03-13T17:42:04Z',
            rating: 0,
            ratings: [],
            related_users: [Array],
            source: '小女花不弃',
            spotlight: false,
            status: 'ranked',
            storyboard: false,
            submitted_date: '2020-01-02T14:41:13Z',
            tags: 'peach blossom cpop c-pop pop chinese 古风 oriental bilibili cover rearrangement 纳兰寻风 na lan xun feng 西门振 xi men zhen 青萝子 qing luo zi op opening xiao nv hua bu qi i will never let you go houshou hari dacaigou kisaki dahkjdas -ovo-',
            title: 'Tao Hua Xiao',
            title_unicode: '桃花笑',
            user_id: 7003013,
            video: false
        },
        checksum: '7d479062a03c7cde63513138c622d5c1',
        failtimes: {fail: [Array], exit: [Array]},
        max_combo: 1262,
        od: 8,
        ar: 9.3,
        bpm: 160,
        convert: false,
        count_circles: 432,
        count_sliders: 405,
        count_spinners: 1,
        cs: 4,
        hp: 6,
        hit_length: 189,
        is_scoreable: true,
        last_updated: '2022-03-05T07:06:51Z',
        owners: [[Object]],
        mode_int: 0,
        passcount: 8446,
        playcount: 49132,
        ranked: 1,
        url: 'https://osu.ppy.sh/beatmaps/2274671',
        current_user_playcount: 0,
        fail: 24078,
        fails: [9, 90, 90, 828, 3884, 1722, 859, 1902, 1199, 504, 585, 378, 968, 487, 363, 873, 396, 297, 245, 288, 306, 460, 108, 135, 63, 45, 63, 108, 351, 164, 324, 370, 216, 227, 225, 145, 199, 153, 81, 182, 576, 306, 90, 109, 162, 108, 325, 244, 135, 36, 18, 18, 64, 72, 81, 81, 63, 27, 18, 72, 37, 18, 45, 0, 1, 27, 9, 27, 64, 27, 27, 46, 27, 81, 45, 36, 18, 54, 108, 72, 18, 18, 27, 45, 64, 19, 27, 54, 45, 9, 108, 27, 0, 36, 9, 27, 99, 81, 81, 18],
        has_leader_board: true,
        mapper_ids: [7003013],
        original_details: {ar: 9.3, cs: 4, od: 8, hp: 6, bpm: 160, drain: 189, total: 192},
        preview_name: 'Wang Rui - Tao Hua Xiao (Muziyami) [Brilliant Dreamland]',
        retries: [0, 0, 0, 1215, 1926, 928, 432, 342, 27, 288, 297, 558, 541, 351, 614, 360, 378, 234, 198, 162, 198, 234, 18, 126, 36, 108, 54, 425, 180, 109, 144, 126, 99, 226, 118, 90, 81, 37, 63, 126, 234, 171, 27, 90, 38, 9, 23, 27, 18, 0, 9, 9, 9, 28, 36, 27, 18, 45, 54, 18, 18, 27, 9, 0, 54, 64, 72, 37, 27, 45, 72, 29, 9, 72, 36, 27, 63, 154, 36, 18, 9, 9, 9, 81, 27, 19, 0, 18, 27, 82, 45, 45, 0, 45, 45, 36, 90, 90, 90, 18],
        retry: 13993,
        total_notes: 838,
        tags: []
    },
    expected: {
        mode: 'OSU', accuracy: 1, combo: 1262, misses: 0, mods: [], is_lazer: false
    },
    pp_list: [219.5492609283136,

        219.5492609283136, 189.09453024152134, 167.83665464688332, 142.32408577885963, 127.17856557740535, 116.7276379369499,

        219.5492609283136, 189.09453024152134, 167.83665464688332, 142.32408577885963, 127.17856557740535, 116.7276379369499],
    original: {cs: 4, ar: 9.3, od: 8, hp: 6, bpm: 160, drain: 189, total: 192}
}) {
    // 导入模板

    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
  <defs>
    <clipPath id="clippath-PR-1">
      <rect width="1920" height="1080" rx="0" ry="0" style="fill: none;"/>
    </clipPath>
    <filter id="blur-PR-1" height="130%" width="130%" x="-15%" y="-15%" filterUnits="userSpaceOnUse">
        <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.4 0.4 0.4 0.4"/>
        </feComponentTransfer>
    </filter>
  </defs>
  <g id="Background">
    <rect width="1920" height="1080" rx="0" ry="0" style="fill: #1c1719;"/>
    <g style="clip-path: url(#clippath-PR-1);" filter="url(#blur-PR-1)">
    </g>
  </g>
  <g id="BodyCard">
  </g>
  <g id="Index">
  </g>
</svg>
`

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-PR-1\);" filter="url\(#blur-PR-1\)">)/
    const reg_body = /(?<=<g id="BodyCard">)/;

    const {
        beatmapset = {}, beatmap = {}, expected = {}, pp_list = [0], original = {}
    } = data

    const set = beatmapset

    // 图片定义
    const background = await readNetImage(set?.covers?.fullsize, hasLeaderBoard(set?.ranked))

    const host_avatar = await getAvatar(set?.user?.avatar_url, true)

    const users = beatmapset?.related_users || [];

    // 1. 并行执行所有 getAvatar 异步请求
    const avatarData = await Promise.all(
        users.map(async (user) => {
            const processedUrl = await getAvatar(user.avatar_url);
            return [user.id, processedUrl];
        })
    );

    // 2. 将结果存入 Map 供后续 O(1) 查询
    const avatarMap = new Map(avatarData);

    const body_R1 = component_R1(background, expected.mods);

    const body_R2 = component_R2(set?.user?.username, host_avatar, set?.genre_id, set?.language_id, set?.source, set?.tags, set?.related_tags);

    const body_R3 = component_R3(beatmap?.passcount, beatmap?.playcount, beatmap?.retry, beatmap?.fail, beatmap?.retries, beatmap?.fails)

    const body_R4 = component_R4(beatmap, expected?.mode, original)

    const body_R5 = component_R5(expected, pp_list, beatmap?.max_combo)

    const body_R6 = component_R6(background, set)

    const body_R7 = component_R7(set, beatmap, avatarMap)

    svg = setTexts(svg, [body_R1, body_R2, body_R3, body_R4, body_R5, body_R6, body_R7], reg_body)

    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.4)

    // 卡片定义
    const panel_name = getPanelNameSVG('Map Statistics v2 (!ymm)', '');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    return svg
}

const component_R1 = (background, mods = []) => {
    const polygon = PanelDraw.RoundedPolygon([{x: -30, y: 40}, {x: 848, y: 40}, {x: 786, y: 400}, {
        x: -30,
        y: 400
    }], 20, '#382e32', 1)

    const shadowed = PanelDraw.Shadow(polygon, 10, 10, 5, '#1c1719', 0.2)

    const image = getImage(0, 40, 850, 360, background)

    const mod_svg = drawLazerMods(mods, 770, 320, 70, 750, 'right', 8, true, true)

    return `
    <g>
    <defs>
    <clipPath id="clippath-OR-1">
    ${polygon}
</clipPath>
</defs>
<g>
    ${shadowed}
</g>
<g id="Background" style="clip-path: url(#clippath-OR-1)">
    ${image}
</g>
<g>
    ${mod_svg.svg}
</g>
</g>
    `
}


const component_R2 = (host_name, avatar, genre_id, language_id, source = '', tags = '', related_tags = []) => {

    const host = getSvgBody(15, 445, card_R1({
        image: avatar, title: 'Host', content: host_name
    }, 270))

    const polygon = PanelDraw.RoundedPolygon([{x: -30, y: 430}, {x: 780, y: 430}, {x: 747, y: 610}, {
        x: -30,
        y: 610
    }], 20, '#382e32', 0.6)

    const shadowed = PanelDraw.Shadow(polygon, 10, 10, 5, '#1c1719', 0.2)

    const g = getGenre(genre_id)

    const genre = getSvgBody(295, 445, card_R1({
        image: getImageFromV3(`object-genre-${normalize(g)}2.png`), title: 'Genre', content: capitalize(g)
    }, 230))

    const l = getLanguage(language_id)

    const language = getSvgBody(535, 445, card_R1({
        image: getImageFromV3(`object-language-${normalize(l)}.png`), title: 'Language', content: capitalize(l)
    }, 220))

    const source_title = PanelDraw.Shadow(poppinsBold.getTextPath('Source', 15, 535, 20, 'left baseline', '#aaa'), 2, 2, 2, '#1c1719')

    let source_font
    let source_size

    if (isASCII(source)) {
        source_font = poppinsBold
        source_size = 20
    } else {
        source_font = PuHuiTi
        source_size = 18
    }

    const source_string1 = source_font.cutStringTail(source, source_size, 265, false)
    const source_string2 = source_font.cutStringTail(source?.substring(source_string1.length), source_size, 265, true)

    const source_text = PanelDraw.Shadow(source_font.getTextPath(source_string1, 15, 565, source_size, 'left baseline', '#B8D3E0'), 2, 2, 1, '#1c1719') + PanelDraw.Shadow(source_font.getTextPath(source_string2, 15, 595, source_size, 'left baseline', '#B8D3E0'), 2, 2, 1, '#1c1719')

    const tags_title = PanelDraw.Shadow(poppinsBold.getTextPath('Tags', 295, 535, 20, 'left baseline', '#aaa'), 2, 2, 1, '#1c1719')

    // 1. 默认先尝试使用 PoppinsBold (20号) 进行裁切
    let currentFont = poppinsBold;
    let currentSize = 20;

    let str1 = currentFont.cutStringTail(tags, currentSize, 445, false);
    let rest = tags?.substring(str1.length) || "";
    let str2 = currentFont.cutStringTail(rest, currentSize, 445, true);

    // 2. 检查裁切出的两个字符串是否包含非 ASCII 字符
    // 如果其中任何一段不是纯英文/符号，则全量切换到 PuHuiTi
    if (!isASCII(str1) || !isASCII(str2)) {
        currentFont = PuHuiTi;
        currentSize = 18;

        // 3. 使用中文字体重新裁切
        str1 = currentFont.cutStringTail(tags, currentSize, 445, false);
        rest = tags?.substring(str1.length)?.trimStart() || "";
        str2 = currentFont.cutStringTail(rest, currentSize, 445, true);
    }

    // 最终使用的变量
    const tags_font = currentFont;
    const tags_size = currentSize;
    const tags_string1 = str1;
    const tags_string2 = str2;

    const tags_text = PanelDraw.Shadow(tags_font.getTextPath(tags_string1, 295, 565, tags_size, 'left baseline', '#B8D3E0'), 2, 2, 1, '#1c1719') + PanelDraw.Shadow(tags_font.getTextPath(tags_string2, 295, 595, tags_size, 'left baseline', '#B8D3E0'), 2, 2, 1, '#1c1719')

    let width_remain = 390

    const related = []

    for (let i = 0; i < related_tags.length; i++) {
        const tag = related_tags[i]

        const type = tag?.type
        const color = getTagCategoryColor(tag?.category)

        const width = Math.round(poppinsBold.getTextWidth(type, 18))

        const rrect_width = width + 20

        if ((rrect_width + 6) > width_remain) {
            break
        } else {

            const text = poppinsBold.getTextPath(capitalize(type), 360 + width_remain - rrect_width / 2, 533, 18, 'center baseline', '#fff')

            const rrect = PanelDraw.Rect(360 + width_remain - rrect_width, 515, rrect_width, 25, 12.5, '#382E32') +  PanelDraw.Rect(360 + width_remain - rrect_width, 515, rrect_width, 25, 12.5, color, 0.2)

            related.push((rrect + text))

            width_remain -= (rrect_width + 6)
        }
    }

    return shadowed + host + genre + language + source_title + tags_title + source_text + tags_text + related.join('\n')
}

const component_R3 = (
    pass_count, play_count, retry_sum, quit_sum, retry_arr = [0], quit_arr = [0]
) => {
    // const playing = Math.max(play_count - quit_sum - retry_sum - pass_count, 0)

    const maximum = Math.max(play_count, pass_count + retry_sum + quit_sum)

    const pass_rate  = maximum > 0 ? Math.min(1, pass_count / maximum) : 0;
    const retry_rate = maximum > 0 ? Math.min(1, retry_sum / maximum) : 0;
    const quit_rate  = maximum > 0 ? Math.min(1, quit_sum / maximum) : 0;

    let pass_width = 0
    let retry_width = 0
    let quit_width = 0

    if (pass_rate > 0) {
        pass_width = Math.max(pass_rate * 220, 20)
    }

    if (retry_rate > 0) {
        retry_width = Math.max(retry_rate * 220, 20)
    }

    if (quit_rate > 0) {
        quit_width = Math.max(quit_rate * 220, 20)
    }

    const titles = PanelDraw.Shadow(poppinsBold.getTextPath('Pass', 15, 667, 20, 'left baseline', '#aaa') + poppinsBold.getTextPath('Retry', 255, 667, 20, 'left baseline', '#aaa') + poppinsBold.getTextPath('Quit', 495, 667, 20, 'left baseline', '#aaa'), 2, 2, 1, '#1c1719')

    const bases = PanelDraw.Rect(15, 680, 220, 20, 10, '#382E32') + PanelDraw.Rect(255, 680, 220, 20, 10, '#382E32') + PanelDraw.Rect(495, 680, 220, 20, 10, '#382E32')

    const progresses = PanelDraw.LinearGradientRect(15, 680, pass_width, 20, 10, colorArray.light_green) + PanelDraw.LinearGradientRect(255, 680, retry_width, 20, 10, colorArray.yellow) + PanelDraw.LinearGradientRect(495, 680, quit_width, 20, 10, colorArray.red)

    const rates = PanelDraw.Shadow(poppinsBold.getTextPath(Math.round(100 * pass_rate) + '%', 230, 667, 20, 'right baseline', '#fff') + poppinsBold.getTextPath(Math.round(100 * retry_rate) + '%', 470, 667, 20, 'right baseline', '#fff') + poppinsBold.getTextPath(Math.round(100 * quit_rate) + '%', 710, 667, 20, 'right baseline', '#fff'), 2, 2, 1, '#1c1719')

    const retry_draw_arr = averageArrayToFixedLength(retry_arr, 36)
    const quit_draw_arr = averageArrayToFixedLength(quit_arr, 36)

    //中下的失败率重试率图像
    const retry_fail_sum_arr = quit_draw_arr.map(function (v, i) {
        return v + retry_draw_arr[i];
    })
    const retry_fail_sum_arr_max = Math.max.apply(Math, retry_fail_sum_arr);

    const retry_graph = PanelDraw.BarChart(retry_fail_sum_arr, retry_fail_sum_arr_max, 0, 15, 715 + 55, 690, 55, 4, 4, '#f6d659');
    const fail_graph = PanelDraw.BarChart(quit_draw_arr, retry_fail_sum_arr_max, 0, 15, 715 + 55, 690, 55, 4, 4, '#ed6c9e');

    const polygon = PanelDraw.RoundedPolygon([{x: -30, y: 640}, {x: 742, y: 640}, {x: 714, y: 785}, {
        x: -30,
        y: 785
    }], 20, '#382e32', 0.6)

    const shadowed = PanelDraw.Shadow(polygon, 10, 10, 5, '#1c1719', 0.2)

    return shadowed + bases + progresses + rates + titles + retry_graph + fail_graph
}

const component_R4 = (beatmap, expected_mode, original) => {
    const mode = getGameMode(expected_mode, 1);

    const bpm = rounds(beatmap?.bpm, 2)
    const bpm_r = (beatmap?.bpm > 0) ? (60000 / beatmap?.bpm).toFixed(0) + 'ms' : '-';
    const bpm_b = bpm.integer
    const bpm_m = bpm.decimal
    const bpm_p = getProgress(beatmap?.bpm, 90, 270);

    const length_r = Math.floor(beatmap?.total_length / 60) + ':' + (beatmap?.total_length % 60).toFixed(0).padStart(2, '0');
    const length_b = Math.floor(beatmap?.hit_length / 60) + ':';
    const length_m = (beatmap?.hit_length % 60).toFixed(0).padStart(2, '0');
    const length_p = getProgress(beatmap?.hit_length, 30, 270);

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

    const labels = [{
        ...LABELS.BPM, remark: bpm_r, data_b: bpm_b, data_m: bpm_m, data_a: '', bar_progress: bpm_p,
    }, {
        ...LABELS.LENGTH, remark: length_r, data_b: length_b, data_m: length_m, data_a: '', bar_progress: length_p,
    }, {
        ...((mode === 'm') ? LABELS.KEY : LABELS.CS), ...stat2label(beatmap?.cs, cs2px(beatmap?.cs, mode), getProgress(beatmap?.cs, cs_min, cs_max), original?.cs ?? 0, isDisplayCS),
        bar_min: cs_min,
        bar_mid: cs_mid,
        bar_max: cs_max,
    }, {
        ...LABELS.AR, ...stat2label(beatmap?.ar, ar2ms(beatmap?.ar, mode), getProgress(beatmap?.ar, ar_min, ar_max), original?.ar ?? 0, isDisplayAR),
        bar_min: ar_min,
        bar_mid: ar_mid,
        bar_max: ar_max,
    }, {
        ...LABELS.OD, ...stat2label(beatmap?.od, od2ms(beatmap?.od, mode), getProgress(beatmap?.od, od_min, od_max), original?.od ?? 0, isDisplayOD),
        bar_min: od_min,
        bar_mid: od_mid,
        bar_max: od_max,
    }, {
        ...LABELS.HP, ...stat2label(beatmap?.hp, '-', getProgress(beatmap?.hp, hp_min, hp_max), original?.hp ?? 0, true),
        bar_min: hp_min,
        bar_mid: hp_mid,
        bar_max: hp_max,
    }]

    const string_e5s = labels.slice(0, 6).map((label, i) => {
        const x = 15 + 235 * (i % 2);
        const y = 830 + 76 * Math.floor(i / 2);
        return getSvgBody(x, y, label_E5(label));
    }).join('');


    const polygon = PanelDraw.RoundedPolygon([{x: -30, y: 815}, {x: 526, y: 815}, {x: 481, y: 1060}, {
        x: -30,
        y: 1060
    }], 20, '#382e32', 0.6)

    const shadowed = PanelDraw.Shadow(polygon, 10, 10, 5, '#1c1719', 0.2)

    return shadowed + string_e5s
}

const component_R5 = (expected, pp_list = [0], max_combo) => {

    function getPP(pp) {
        if ((pp || 0) > 10000) {
            return round(pp || 0, -1).toString()
        } else {
            return Math.round(pp || 0).toString()
        }
    }

    const current = pp_list[0] || 0
    const perfect = pp_list[1] || 0

    const percent99 = pp_list[2] || 0
    const percent98 = pp_list[3] || 0
    const percent96 = pp_list[4] || 0
    const percent94 = pp_list[5] || 0
    const percent92 = pp_list[6] || 0

    const exp_combo = (expected?.combo || 0)

    let title1_str
    let pp1_str
    let title2_str
    let pp2_str

    if (current >= perfect - 0.5) {
        // 默认的设定

        title1_str = 'SS'
        pp1_str = getPP(perfect)
        title2_str = '98% FC'
        pp2_str = getPP(percent98)
    } else if (exp_combo >= max_combo * 0.9) {
        // 全连
        title1_str = 'SS'
        pp1_str = getPP(perfect)
        title2_str = 'You'
        pp2_str = getPP(current)
    } else if (current >= percent98 - 0.5) {
        title1_str = '99% FC'
        pp1_str = getPP(percent99)
        title2_str = 'You'
        pp2_str = getPP(current)
    } else if (current >= percent96 - 0.5) {
        title1_str = '98% FC'
        pp1_str = getPP(percent98)
        title2_str = 'You'
        pp2_str = getPP(current)
    } else if (current >= percent94 - 0.5) {
        title1_str = '96% FC'
        pp1_str = getPP(percent96)
        title2_str = 'You'
        pp2_str = getPP(current)
    } else if (current >= percent92 - 0.5) {
        title1_str = '94% FC'
        pp1_str = getPP(percent94)
        title2_str = 'You'
        pp2_str = getPP(current)
    } else {
        title1_str = '92% FC'
        pp1_str = getPP(percent92)
        title2_str = 'You'
        pp2_str = getPP(current)
    }


    const title1 = PanelDraw.Shadow(poppinsBold.getTextPath(title1_str, 565, 848, 20, 'left baseline', '#aaa'), 2, 2, 1, '#1c1719')

    const pp1 = PanelDraw.Shadow(poppinsBold.get2SizeTextPath(pp1_str, 'PP', 36, 24, 618, 888, 'center baseline', '#fff'), 2, 2, 1, '#1c1719')

    const title2 = PanelDraw.Shadow(poppinsBold.getTextPath(title2_str, 555, 924, 20, 'left baseline', '#aaa'), 2, 2, 1, '#1c1719')

    const pp2 = PanelDraw.Shadow(poppinsBold.get2SizeTextPath(pp2_str, 'PP', 36, 24, 608, 964, 'center baseline', '#fff'), 2, 2, 1, '#1c1719')

    const combo_title = PanelDraw.Shadow(poppinsBold.getTextPath('Combo', 545, 1000, 20, 'left baseline', '#aaa'), 2, 2, 1, '#1c1719')

    const combo = PanelDraw.Shadow(poppinsBold.get2SizeTextPath(max_combo?.toString() || '0', 'x', 36, 24, 598, 1040, 'center baseline', '#fff'), 2, 2, 1, '#1c1719')

    const polygon = PanelDraw.RoundedPolygon([{x: 550, y: 815}, {x: 708, y: 815}, {x: 666, y: 1060}, {
        x: 508,
        y: 1060
    }], 20, '#382e32', 0.6)

    const shadowed = PanelDraw.Shadow(polygon, 10, 10, 5, '#1c1719', 0.2)

    return shadowed + combo_title + combo + title2 + pp2 + title1 + pp1
}

const component_R6 = (background, beatmapset) => {

    const polygon = PanelDraw.RoundedPolygon([{x: 910, y: 40}, {x: 1950, y: 40}, {x: 1950, y: 210}, {
        x: 880,
        y: 210
    }], 20, '#382e32', 1)

    const clip = PanelDraw.RoundedPolygon([{x: 910 + 24, y: 40}, {x: 1950, y: 40}, {x: 1950, y: 210}, {
        x: 880 + 24,
        y: 210
    }], 20, '#382e32', 1)

    const shadowed = PanelDraw.Shadow(polygon, 10, 10, 5, '#1c1719', 0.2)

    const white = PanelDraw.RoundedPolygon([{x: 910, y: 40}, {x: 960, y: 40}, {x: 930, y: 210}, {
        x: 880,
        y: 210
    }], 20, '#fff', 1)

    const lighten = PanelDraw.Shadow(white, 0, 0, 10, '#fff', 0.6)


    const image = getImage(880, 40, 1920 - 880, 210 - 40, background, 0.4)


    const t = getBeatMapTitlePath("poppinsBold", "PuHuiTi", beatmapset?.title || '', beatmapset?.title_unicode || '', null, 955, 95, 144, 48, 30, 960, 'left baseline', '#fff', '#ccc', 948);

    const title = PanelDraw.Shadow(t.title, 4, 4, 4, '#1c1719')

    const title_unicode = PanelDraw.Shadow(t.title_unicode, 4, 4, 4, '#1c1719')

    const artist = PanelDraw.Shadow(poppinsBold.getTextPath(beatmapset?.artist || '', 942, 190, 30, 'left baseline', '#fff'), 4, 4, 4, '#1c1719')

    const set_id = PanelDraw.Shadow(poppinsBold.getTextPath('S ' + (beatmapset?.id || ''), 1900, 190, 30, 'right baseline', '#fff'), 4, 4, 4, '#1c1719')

    return `
    <g>
    <defs>
    <clipPath id="clippath-OR-6">
    ${clip}
</clipPath>
</defs>
<g>
    ${shadowed}
    ${lighten}
    ${clip}
</g>
<g id="BG" style="clip-path: url(#clippath-OR-6)">
    ${image}
</g>
<g>
    ${title}
    ${title_unicode}
    ${artist}
    ${set_id}
</g>
</g>
    `
}

const component_R7 = (beatmapset = {
    beatmaps: [{}],
}, beatmap, avatarMap) => {
    const beatmaps = beatmapset?.beatmaps || []

    const r3s = []

    let position = 0

    for (let i = 0; i < beatmaps?.length || 0; i++) {
        const b = beatmaps[i]
        const is_current = beatmap.id === b.id

        const ids = Array.from(b?.owners || []).map((it) => it.id);

        if (is_current) {
            position = i
        }

        const avatars = ids.map(id => avatarMap.get(id));

        const r3 = {
            id: b.id,
            star: b.difficulty_rating,
            owners: b.owners || [],
            difficulty_name: b.version,
            is_current: is_current,
            mode: b.mode,
            avatars: avatars,
        }

        r3s.push(r3)
    }

    // 排版逻辑

    function getXOffset(height, offset = 918) {
        // tan 10
        const tan = Math.tan(Math.PI / 18)

        return offset - Math.round(height * tan)
    }

    function getCurveOffset(position, index, per_height = 100) {
        // tan 10
        const tan = Math.tan(Math.PI / 18)

        const offset = Math.round(per_height * tan)

        // 后面的 +20 为了让这个难度更加突出
        if (position > index) {
            return (position - index) * (20 - offset) + 20
        } else if (position < index) {
            return (index - position) * (15 + offset) + 20
        } else {
            return 0
        }

    }


    if (r3s.length <= 8) {
        // 可完全展示

        return r3s.map((v, i) => {
            const y = 230 + i * 100

            const x = getXOffset(y) + getCurveOffset(position, i)
            const w = 1920 - x

            const card = card_R3(v, w)

            return getSvgBody(x, y, card)
        }).join('\n')
    } else {
        // 默认目标展示 9 个
        let limit = 9;
        const total = r3s.length;

        // 1. 初始计算：尝试让 position 处于窗口中心（第 5 位，索引为 4）
        let start = position - 4;

        // 2. 基础边界修正
        if (start < 0) start = 0;
        if (start + limit > total) {
            start = Math.max(0, total - limit);
        }

        // 3. 特殊逻辑：如果窗口已经触底（包含最后一个元素）
        // 且当前 position 就是最后一个元素，则将 limit 改为 8
        if (start + limit === total && position === total - 1) {
            limit = 8;
            // 重新计算 start 确保依然展示最后 8 个
            start = Math.max(0, total - 8);
        }

        // 4. 提取并渲染
        return r3s.slice(start, start + limit).map((v, i) => {
            const originalIndex = start + i;

            // y 坐标：i 是 0 到 8 (或 0 到 7)
            const y = 230 + i * 100;

            const x = getXOffset(y) + getCurveOffset(position, originalIndex);
            const w = 1920 - x;

            const card = card_R3(v, w);
            return getSvgBody(x, y, card);
        }).join('\n');
    }
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

    if (isDisplay) {
        return {
            remark: remark,
            data_b: stat_b,
            data_m: stat_m,
            data_a: hasChanged ? (' [' + floor(original, 1) + ']') : '',
            bar_progress: progress,
        }
    } else {
        return {
            remark: '-', data_b: '-', data_m: '', data_a: '', bar_progress: null,
        }
    }
}

function getStarSVGs(star_path = '', sr_b = 0, sr_m = 0, spacing = 25, w = 30, h = 30) {
    let svg = '';
    const sr_m_scale = Math.pow(sr_m, 0.8);
    const w0_5 = w / 2;
    const h0_5 = h / 2; // 用于缩放中心点计算

    // 1. 生成完整的星星
    for (let i = 1; i <= sr_b; i++) {
        // 修改：translate 的参数从 (0, Y) 改为 (X, 0)
        const sr_b_svg = `<image id="Star${i}" width="${w}" height="${h}" transform="translate(${spacing * (i - 1)} 0)" xlink:href="${star_path}"/>\n`;
        svg += sr_b_svg;
    }

    // 2. 生成最后一颗缩小的星星（如果有）
    // 修改：translate 同样改为水平位移，并确保缩放中心在星星中心

    if (sr_m <= 0) return svg

    const x_pos = spacing * sr_b;
    const sr_m_svg = `<image id="Star${sr_b + 1}" width="${w}" height="${h}" transform="translate(${x_pos} 0) translate(${w0_5 * (1 - sr_m_scale)} ${h0_5 * (1 - sr_m_scale)}) scale(${sr_m_scale})" xlink:href="${star_path}"/>\n`;

    return svg + sr_m_svg;
}


const card_R1 = (data = {
    image: '', title: '', content: ''
}, max_width = 270) => {
    const clip = PanelDraw.Circle(30, 30, 30, 'none')

    const base = PanelDraw.Circle(30, 30, 30, '#46393f')

    const random = getRandomString(6)

    const title_str = poppinsBold.cutStringTail(data?.title || '', 20, max_width - 70 - 5)

    const title = poppinsBold.getTextPath(title_str, 70, 18, 20, 'left baseline', '#aaa', 1)

    const title_shadow = PanelDraw.Shadow(title, 2, 2, 2, '#1c1719')


    const content_str = poppinsBold.cutStringTail(data?.content || '', 24, max_width - 70 - 5)

    const content = poppinsBold.getTextPath(content_str, 70, 50, 24, 'left baseline', '#fff', 1)

    const content_shadow = PanelDraw.Shadow(content, 2, 2, 2, '#1c1719')

    const image = getImage(0, 0, 60, 60, data?.image || '')

    return `
    <g>
    <defs>
    <clipPath id="clippath-CR-${random}">
    ${clip}
</clipPath>
</defs>
<g>
    ${base}
</g>
<g id="Image_${random}" style="clip-path: url(#clippath-CR-${random})">
    ${image}
</g>
<g id="Text">
    ${title_shadow}
    ${content_shadow}
</g>
</g>
    `
}

const card_R3 = (data = {
    id: 0, star: 0.0, difficulty_name: '', owners: [], is_current: false, mode: 'OSU', avatars: []
}, max_width = 960) => {

    const polygon = PanelDraw.RoundedPolygon([{x: 0, y: 0}, {x: max_width + 30, y: 0}, {
        x: max_width + 30,
        y: 90
    }, {x: -15.87, y: 90}], 20, '#382e32', 1)

    const clip = PanelDraw.RoundedPolygon([{x: 22, y: 0}, {x: max_width + 30, y: 0}, {
        x: max_width + 30,
        y: 90
    }, {x: 22 - 15.87, y: 90}], 20, '#382e32', 1)

    const rating_text_color = getStarTextColor(data.star)
    const rating_color = getStarRatingColor(data.star)
    const text_color = data.is_current ? '#fff' : '#ccc'
    const title_color = data.is_current ? '#aaa' : '#888'

    const rating_brighter = changeHexLightness(rating_color, 0.2)

    const star_cover = PanelDraw.RoundedPolygon([{x: 22, y: 0}, {x: max_width + 30, y: 0}, {
        x: max_width + 30,
        y: 90
    }, {x: 22 - 15.87, y: 90}], 20, (data.is_current) ? rating_brighter : rating_color, 0.2)

    const shadowed = PanelDraw.Shadow(polygon, 10, 10, 5, '#1c1719', 0.2)

    const color = PanelDraw.RoundedPolygon([{x: 0, y: 0}, {x: 50, y: 0}, {x: 50 - 15.87, y: 90}, {
        x: -15.87,
        y: 90
    }], 20, (data.is_current) ? rating_brighter : rating_color, 1)

    const lighten = (data.is_current) ? PanelDraw.Shadow(color, 0, 0, 10, '#fff', 0.6) : color

    // star

    const star = rounds(data.star, 2, 3)

    const rating_rrect_width = 40 + poppinsBold.getTextWidth(star.integer + star.decimal, 24) + 10

    const mode = extra.getTextPath(getGameMode(data.mode, -1), 30, 74, 26, 'left baseline', rating_text_color)

    const rating_rrect = PanelDraw.Rect(24, 50, rating_rrect_width, 30, 15, '#fff')

    const rating = poppinsBold.getTextPath(star.integer + star.decimal, 62, 74, 24, 'left baseline', rating_text_color)

    const star_components_width = Math.ceil(data.star) * 25

    const id_width = poppinsBold.getTextWidth('B ' + data?.id, 24)

    const left_max_width = 24 + rating_rrect_width + 15 - 5 + star_components_width + 10 + id_width + 10

    const star_components = getSvgBody(24 + rating_rrect_width + 10 - 5, 54 - 5, getStarSVGs(getImageFromV3('overall-difficulty.png'), star.int, star.dec))

    const rating_gradient = PanelDraw.LinearGradientRect(20, 50, max_width - 30, 30, 0, [rating_color, rating_brighter], 1, [50, 50], [100, 0])

    const multiple = (data?.owners?.length > 1) ? '...' : ''

    const main_mapper_name = data?.owners[0]?.username + multiple

    const mapper_width = poppinsBold.getTextWidth(main_mapper_name, 24) + 20

    // 100 是 mapper 这个标题的长度 + 20
    const right_max_width = 10 + Math.max(mapper_width, 100)

    const avatar_max_width = max_width - left_max_width - right_max_width

    const avatar_theory_width = 60 + 30 * Math.max(data?.owners?.length - 1, 0)

    let max_avatar_count

    if (avatar_theory_width <= avatar_max_width) {
        // 无事发生
        max_avatar_count = data?.owners?.length
    } else {
        // 必须缩短
        max_avatar_count = Math.max(Math.floor((avatar_max_width - 60) / 30), 1)
    }

    const avatar_final_width = 60 + 30 * Math.max(max_avatar_count - 1, 0)

    // 位置确定，开始绘画
    const mapper_title = PanelDraw.Shadow(poppinsBold.getTextPath('Mapper', max_width - right_max_width + 10, 34, 20, 'left baseline', title_color), 4, 4, 4, '#1c1719')

    const mapper_text = PanelDraw.Shadow(poppinsBold.getTextPath(main_mapper_name, max_width - right_max_width + 10, 66, 24, 'left baseline', text_color), 4, 4, 4, '#1c1719')

    let avatar_array = []

    for (let i = 0; i < max_avatar_count; i++) {
        const x = max_width - right_max_width - 60 - (30 * i)
        const y = 14

        const clip = PanelDraw.Circle(x + 30, y + 30, 30, '#382e32')
        const avatar = getImage(x, y, 60, 60, data.avatars?.[i])
        const random = getRandomString(6)

        avatar_array.push(`
            <g>
    <defs>
    <clipPath id="clippath-R3-${random}">
    ${clip}
</clipPath>
</defs>
<g id="Avatar" style="clip-path: url(#clippath-R3-${random})">
    ${avatar}
</g>
</g>
`)
    }

    const bid = PanelDraw.Shadow(poppinsBold.getTextPath('B ' + data?.id, max_width - 10 - avatar_final_width - 10 - right_max_width, 72, 24, 'right baseline', text_color), 4, 4, 4, '#1c1719')

    const difficulty = PanelDraw.Shadow(poppinsBold.getTextPath(poppinsBold.cutStringTail(data.difficulty_name, 30, max_width - 10 - avatar_final_width - 10 - right_max_width), 32, 36, 30, 'left baseline', text_color), 4, 4, 4, '#1c1719')

    // 右侧

    const random = getRandomString(6)

    return `
    <g>
    <defs>
        <mask id="card-r3-mask-${random}">
            ${star_components}
        </mask>
        <mask id="card-r3-mask-rrect-${random}">
            ${rating_rrect}
        </mask>
</defs>
<g>
    ${shadowed}
    ${lighten}
    ${clip}
    ${star_cover}
</g>
<g mask="url(#card-r3-mask-${random})">
    ${rating_gradient}
</g>
<g mask="url(#card-r3-mask-rrect-${random})">
    ${rating_gradient}
</g>
<g>
    ${avatar_array.join('\n')}
    ${difficulty}
    ${bid}
    ${mapper_title}
    ${mapper_text}
    ${rating}
    ${mode}
</g>
</g>
    `
}


const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const normalize = (s) => s.replaceAll(" ", "_")