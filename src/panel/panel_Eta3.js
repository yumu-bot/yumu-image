import {
    exportJPEG,
    getNowTimeStamp,
    getPanelNameSVG,
    getTimeDifference,
    setImage,
    setSvgBody,
    setText,
    setTexts,
    round, getFormattedTime, isASCII, getGameMode, getImageFromV3, getMapBG
} from "../util/util.js";
import {
    getRankBG
} from "../util/star.js";
import {getMultipleTextPath, poppinsBold, PuHuiTi} from "../util/font.js";
import {getRankColor, getStarRatingColor, PanelColor} from "../util/color.js";
import {getModPath} from "../util/mod.js";
import {getMascotName, getRandomMascotTransparentPath} from "../util/mascotBanner.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Eta3(data);
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
        const svg = await panel_Eta3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 千变万化成绩面板：3：pjsk
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Eta3(data = {
    panel: "",
    user: {
        username: 'ABC',
        pp: 1314.544,
    },

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
        legacy_total_score: 319362,
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
            beatmap_id: 3787814,
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

}) {
    const user = data?.user
    const hue = user?.profile_hue || 342

    // 导入模板
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PETA3-1">
            <rect x="0" y="0" width="1920" height="1080" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PETA3-BG">
            <rect width="1920" height="1080" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PETA3-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="100" result="blur"/>
        </filter>
    </defs>
    <g id="Background">
        <rect width="1920" height="1080" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PETA3-BG)" style="clip-path: url(#clippath-PETA3-BG);">
        </g>
    </g>
    <g id="Mascot" style="clip-path: url(#clippath-PETA3-1);">
    </g>
    <g id="Component">
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_background = /(?<=<g filter="url\(#blur-PETA3-BG\)" style="clip-path: url\(#clippath-PETA3-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_mascot = /(?<=<g id="Mascot" style="clip-path: url\(#clippath-PETA3-1\);">)/;

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

    const request_time = 'score time: ' + score_time + ' (' + delta_time + ') // request time: ' + getNowTimeStamp();

    const panel_name = getPanelNameSVG('the Myriads of Changes (Not from PJSK)', '', 'v0.6.0 MY', request_time);

    // 导入文字
    svg = setText(svg, panel_name, reg_index);
    const result = poppinsBold.getTextPath('RESULT', 0, 250, 300, 'left baseline', '#fff', 0.1)

    // 图片定义
    const background = getRankBG(data?.score?.legacy_rank, data?.score?.passed);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.3);
    svg = setImage(svg, 460, 290, 1920, 790, getRandomMascotTransparentPath(getMascotName(data?.score?.mode)), reg_mascot)


    // 卡片定义
    const componentEta1 = component_Eta1(await PanelEta1Generate.score2componentEta1(data.score));
    const componentEta2 = component_Eta2(PanelEta1Generate.score2componentEta2(data.score, data.user, data.attributes));

    // 导入卡片
    svg = setSvgBody(svg, 180, 40, componentEta1, reg_component);
    svg = setTexts(svg, [componentEta2, result], reg_component);

    return svg.toString()
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_Eta1 = (
    data = {
        cover: '',

        title: '',
        title_unicode: '',

        star_rating: 0.00,

        accuracy: 0.00,
        rank: '',
    }) => {

    // 读取模板
    let svg =
        `<defs>
            <clipPath id="clippath-OPETA1-1">
                <rect id="Cover" x="25" y="20" width="140" height="140" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OPETA1-2">
            </clipPath>
         </defs>
          <g id="Base_OPETA1">
            <rect id="Base" x="0" y="0" width="1560" height="180" rx="40" ry="40" style="fill: #fff;" opacity="0.6"/>
          </g>
          <g id="Diff_OPETA1">
          </g>
          <g id="BG_OPETA1" style="clip-path: url(#clippath-OPETA1-1);">
          </g>
          <g id="Progress_OPETA1" style="clip-path: url(#clippath-OPETA1-2);">
          </g>
          <g id="Text_OPETA1">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA1">)/;
    const reg_progress = /(?<=<clipPath id="clippath-OPETA1-2">)/;
    const reg_progress_base = /(?<=<g id="Progress_OPETA1" style="clip-path: url\(#clippath-OPETA1-2\);">)/;
    const reg_diff = /(?<=<g id="Diff_OPETA1">)/;
    const reg_cover = /(?<=<g id="BG_OPETA1" style="clip-path: url\(#clippath-OPETA1-1\);">)/;

    const sr_color = getStarRatingColor(data?.star_rating)
    const rank_color = getRankColor(data?.rank)

    svg = setTexts(svg, [
        PanelDraw.Rect(390, 100, 190, 55, 10, '#2A2226'),
        PanelDraw.Rect(833, 77, 530, 30, 15, '#2A2226'),
        PanelDraw.Rect(1385, 0, 120, 180, 0, '#2A2226'),
        PanelDraw.Rect(20, 15, 150, 150, 20, sr_color),
        PanelDraw.Rect(200, 100, 380, 55, 10, sr_color),
    ], reg_diff)

    const score_rank = poppinsBold.getTextPath('SCORERANK', 1625 - 180, 165, 14, 'center baseline', rank_color)

    const rank_c = poppinsBold.getTextPath('C', 1250 - 180, 94 - 40, 24, 'center baseline', '#fff')
    const rank_b = poppinsBold.getTextPath('B', 1330 - 180, 94 - 40, 24, 'center baseline', '#fff')
    const rank_a = poppinsBold.getTextPath('A', 1410 - 180, 94 - 40, 24, 'center baseline', '#fff')
    const rank_s = poppinsBold.getTextPath('S', 1490 - 180, 94 - 40, 24, 'center baseline', '#fff')

    const scales = PanelDraw.Rect(1250 - 180 - 3, 112 - 40, 6, 40, 3)
        + PanelDraw.Rect(1330 - 180 - 3, 112 - 40, 6, 40, 3)
        + PanelDraw.Rect(1410 - 180 - 3, 112 - 40, 6, 40, 3)
        + PanelDraw.Rect(1490 - 180 - 3, 112 - 40, 6, 40, 3)

    const title_text = poppinsBold.cutStringTail(data?.title, 60, 530)
    const title2_width = 530 + 220 - poppinsBold.getTextWidth(title_text, 60);
    const title2_font = isASCII(data?.title_unicode) ? poppinsBold : PuHuiTi

    const title = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: (data?.title || '') + ' ',
            size: 48,
            color: '#2A2226'
        }, {
            font: title2_font,
            text: data?.title === data?.title_unicode ? '' : title2_font.cutStringTail(data?.title_unicode, 24, title2_width),
            size: 24,
            color: '#2A2226'
        }], 200, 70, 'left baseline'
    )

    const di = getDiffIndex(data?.star_rating)
    const difficulty = poppinsBold.getTextPath(di, 295, 140, 36, 'center baseline', '#fff')

    const sr = round(data?.star_rating, 2)
    const star_rating = getMultipleTextPath(
        [{
            font: PuHuiTi,
            text: '樂曲',
            size: 24,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: 'SR. ',
            size: 24,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: sr,
            size: 36,
            color: '#fff'
        }], 665 - 180, 140, 'center baseline'
    )

    const progress = PanelDraw.Rect(833, 77, getProgressWidth(data?.accuracy, data?.rank), 30, 15, 'none')

    const progress_base = PanelDraw.GradientRect(833, 77, 530, 30, 15, [{
        offset: "0%",
        color: "#9922EE",
        opacity: 1,
    }, {
        offset: "55%",
        color: "#7FCEF4",
        opacity: 1,
    },{
        offset: "70%",
        color: "#7FC269",
        opacity: 1,
    },{
        offset: "85%",
        color: "#F7B551",
        opacity: 1,
    },{
        offset: "100%",
        color: "#FFFF00",
        opacity: 1,
    },])

    svg = setTexts(svg, [score_rank, rank_c, rank_b, rank_a, rank_s, scales, title, difficulty, star_rating], reg_text)

    svg = setImage(svg, 25, 20, 140, 140, data?.cover, reg_cover)
    svg = setImage(svg, 1545 - 180, 0, 160, 160, getImageFromV3(`object-score-${data?.rank}2.png`), reg_text)

    svg = setText(svg, progress, reg_progress)
    svg = setText(svg, progress_base, reg_progress_base)

    return svg.toString()
}


const component_Eta2 = (data = {
    mode: '',
    mods: [],
    statistics: {},
    combo: 0,
    max_combo: 0,
    accuracy: 0,
    score: 0,
    pp: 0,
    full_pp: 0,
    perfect_pp: 0,

    aim_pp: 0,
    spd_pp: 0,
    acc_pp: 0,
    fl_pp: 0,
    diff_pp: 0,

}) => {
    // 读取模板
    let svg =
        `
          <g id="Base_OPETA2">
          </g>
          <g id="Text_OPETA2">
          </g>`;

    const reg_base = /(?<=<g id="Base_OPETA2">)/;
    const reg_text = /(?<=<g id="Text_OPETA2">)/;

    const mode = getGameMode(data?.mode, 1)

    const mods = getModsSVG(data?.mods, 910, 626, 90, 42, 50);

    const titles = poppinsBold.getTextPath('SCORE', 400, 484, 72, 'right baseline', '#fff')
        + poppinsBold.getTextPath('ACC.', 400, 572, 48, 'right baseline', '#fff')
        + poppinsBold.getTextPath('PP.', 650, 772, 40, 'left baseline', '#fff')
        + poppinsBold.getTextPath('COMBO', 670, 1016, 36, 'left baseline', '#fff')

    const score = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: padStart(data?.score, 8),
            size: 120,
            color: '#aaa'
        }, {
            font: poppinsBold,
            text: data?.score?.toString(),
            size: 120,
            color: '#F06B87'
        }], 1000, 500, 'right baseline'
    )

    const accuracy = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: round((data?.accuracy || 0) * 100, 2),
            size: 48,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: '%',
            size: 30,
            color: '#fff'
        }], 1000, 576, 'right baseline'
    )

    const pp = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: padStart(Math.round(data?.pp), 4),
            size: 72,
            color: '#aaa'
        }, {
            font: poppinsBold,
            text: Math.round(data?.pp)?.toString(),
            size: 72,
            color: '#fff'
        }], 1000, 784, 'right baseline'
    )

    const max_pp = poppinsBold.get2SizeTextPath('/ ', Math.round(data?.perfect_pp).toString(), 30, 36, 1000, 826, 'right baseline')

    const combo = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: padStart(data?.combo, 4),
            size: 36,
            color: '#aaa'
        }, {
            font: poppinsBold,
            text: data?.combo?.toString(),
            size: 36,
            color: '#fff'
        }], 960, 1016, 'right baseline'
    )

    let pp_title = ''
    let pp_value = ''
    let pp_progress = PanelDraw.LinearGradientRect(670, 915, 290,
        40, 20, '#FCAC46', '#FEDC45')

    switch (mode) {
        case 'o': {
            pp_title = poppinsBold.getTextPath('AIM', 670, 904, 30, 'left baseline', '#8DCFF4')
                + poppinsBold.getTextPath('SPD', 815, 904, 30, 'center baseline', '#79C471')
                + poppinsBold.getTextPath('ACC', 960, 904, 30, 'right baseline', '#FEF668')

            pp_value = poppinsBold.getTextPath(Math.round(data?.aim_pp).toString(), 670 + 20, 947, 30, 'left baseline')
                + poppinsBold.getTextPath(Math.round(data?.spd_pp).toString(), 815, 947, 30, 'center baseline')
                + poppinsBold.getTextPath(Math.round(data?.acc_pp).toString(), 960 - 20, 947, 30, 'right baseline')

            const pp_sum = data?.aim_pp + data?.spd_pp + data?.acc_pp

            pp_progress =
                PanelDraw.LinearGradientRect(670, 915, 290,
                    40, 20, '#FCAC46', '#FEDC45')
                + PanelDraw.LinearGradientRect(670, 915, Math.round((data?.aim_pp + data?.spd_pp) / pp_sum * 290), 40, 20, '#5EDC5B', '#CAF881')
                + PanelDraw.LinearGradientRect(670, 915, Math.round((data?.aim_pp) / pp_sum * 290),
                    40, 20, '#4FACFE', '#00F2FE')

        } break;

        case 't': {
            pp_title = poppinsBold.getTextPath('DIFF', 670, 904, 30, 'left baseline', '#79C471')
                + poppinsBold.getTextPath('ACC', 960, 904, 30, 'right baseline', '#FEF668')

            pp_value = poppinsBold.getTextPath(Math.round(data?.diff_pp).toString(), 670 + 20, 947, 30, 'left baseline')
                + poppinsBold.getTextPath(Math.round(data?.acc_pp).toString(), 960 - 20, 947, 30, 'right baseline')

            const pp_sum = data?.diff_pp + data?.acc_pp

            pp_progress =
                PanelDraw.LinearGradientRect(670, 915, 290,
                    40, 20, '#FCAC46', '#FEDC45')
                + PanelDraw.LinearGradientRect(670, 915, Math.round((data?.diff_pp) / pp_sum * 290),
                    40, 20, '#5EDC5B', '#CAF881')
        } break;

        case 'm': {
            pp_title = poppinsBold.getTextPath('DIFF', 960, 904, 30, 'right baseline', '#FEF668')

            pp_value = poppinsBold.getTextPath(Math.round(data?.diff_pp).toString(), 960 - 20, 947, 30, 'right baseline')

            pp_progress = PanelDraw.LinearGradientRect(670, 915, 290,
                    40, 20, '#FCAC46', '#FEDC45')
        } break;
    }

    let judges

    switch (mode) {
        case 'o': {
            judges = poppinsBold.getTextPath('GREAT', 235, 770, 40, 'left baseline', '#8DCFF4')
                + poppinsBold.getTextPath('OK', 235, 770 + 65, 40, 'left baseline', '#79C471')
                + poppinsBold.getTextPath('MEH', 235, 770 + 130, 40, 'left baseline', '#FEF668')
                + poppinsBold.getTextPath('MISS', 235, 770 + 195, 40, 'left baseline', '#ED6C9E')

                + getPadPath(data.statistics?.great, 560, 770)
                + getPadPath(data.statistics?.ok, 560, 770 + 65)
                + getPadPath(data.statistics?.meh, 560, 770 + 130)
                + getPadPath(data.statistics?.miss, 560, 770 + 195)
        } break;
        case 't': {
            judges = poppinsBold.getTextPath('GREAT', 235, 770, 40, 'left baseline', '#8DCFF4')
                + poppinsBold.getTextPath('OK', 235, 770 + 65, 40, 'left baseline', '#79C471')
                + poppinsBold.getTextPath('MISS', 235, 770 + 260, 40, 'left baseline', '#ED6C9E')

                + getPadPath(data.statistics?.great, 560, 770)
                + getPadPath(data.statistics?.ok, 560, 770 + 65)
                + getPadPath(data.statistics?.miss, 560, 770 + 260)
        } break;
        case 'c': {
            judges = poppinsBold.getTextPath('GREAT', 235, 770, 40, 'left baseline', '#8DCFF4')
                + poppinsBold.getTextPath('LARGE D.', 235, 770 + 65, 40, 'left baseline', '#79C471')
                + poppinsBold.getTextPath('SMALL D.', 235, 770 + 130, 40, 'left baseline', '#FEF668')
                + poppinsBold.getTextPath('MISS D.', 235, 770 + 195, 40, 'left baseline', '#A1A1A1')
                + poppinsBold.getTextPath('MISS', 235, 770 + 260, 40, 'left baseline', '#ED6C9E')

                + getPadPath(data.statistics?.great, 560, 770)
                + getPadPath(data.statistics?.large_tick_hit, 560, 770 + 65)
                + getPadPath(data.statistics?.small_tick_hit, 560, 770 + 130)
                + getPadPath(data.statistics?.small_tick_miss, 560, 770 + 195)
                + getPadPath(data.statistics?.miss, 560, 770 + 260)
        } break;
        case 'm': {
            judges = poppinsBold.getTextPath('PERFECT', 235, 770, 40, 'left baseline', '#8DCFF4')
                + poppinsBold.getTextPath('GREAT', 235, 770 + 65, 40, 'left baseline', '#79C471')
                + poppinsBold.getTextPath('GOOD', 235, 770 + 130, 40, 'left baseline', '#FEF668')
                + getMultipleTextPath(
                    [{
                        font: poppinsBold,
                        text: 'OK&',
                        size: 40,
                        color: '#5E8AC6'
                    }, {
                        font: poppinsBold,
                        text: 'MEH',
                        size: 40,
                        color: '#A1A1A1'
                    }], 235, 770 + 195, 'left baseline'
                )
                + poppinsBold.getTextPath('MISS', 235, 770 + 260, 40, 'left baseline', '#ED6C9E')

                + getPadPath(data.statistics?.perfect, 560, 770)
                + getPadPath(data.statistics?.great, 560, 770 + 65)
                + getPadPath(data.statistics?.good, 560, 770 + 130)
                + getPadPath((data.statistics?.ok + data.statistics?.meh), 560, 770 + 195)
                + getPadPath(data.statistics?.miss, 560, 770 + 260)
        } break;
    }

    const rrects = PanelDraw.Rect(213, 728, 380, 58, 20, '#46393F', 0.5)
        + PanelDraw.Rect(213, 728 + 130, 380, 58, 20, '#46393F', 0.5)
        + PanelDraw.Rect(213, 728 + 260, 380, 58, 20, '#46393F', 0.5)
        + PanelDraw.Rect(640, 860, 360, 186, 20, '#46393F', 0.5)

    svg = setTexts(svg, [titles, mods, score, accuracy, pp, max_pp, combo, pp_title, pp_value, pp_progress, judges], reg_text)

    svg = setText(svg, rrects, reg_base)


    return svg.toString()
}

// 私有转换方式
const PanelEta1Generate = {
    score2componentEta1: async (score) => {
        return {
            cover: await getMapBG(score?.beatmapset?.id, 'list@2x'),

            title: score?.beatmapset?.title,
            title_unicode: score?.beatmapset?.title_unicode,

            star_rating: score?.beatmap.difficulty_rating || 0,

            accuracy: score?.accuracy || 0,
            rank: score?.legacy_rank,
        }
    },

    score2componentEta2: (score, user, attr) => {
        return {
            mode: score?.mode,
            mods: score?.mods,
            statistics: score?.statistics,
            combo: score?.max_combo,
            max_combo: score?.beatmap?.max_combo,
            accuracy: score?.accuracy,
            score: score?.legacy_total_score,

            pp: score?.pp || 0,
            full_pp: attr?.full_pp || 0,
            perfect_pp: attr?.perfect_pp || 0,

            aim_pp: attr?.pp_aim || 0,
            spd_pp: attr?.pp_speed || 0,
            acc_pp: attr?.pp_acc || 0,
            fl_pp: attr?.pp_flashlight || 0,
            diff_pp: attr?.pp_difficulty || 0,
        }
    },
}

function getDiffIndex(star_rating = 0) {
    let index

    if (star_rating < 0.1) index = 'NEW';
    else if (star_rating < 2) index = 'EASY';
    else if (star_rating < 2.8) index = 'NORMAL';
    else if (star_rating < 4) index = 'HARD';
    else if (star_rating < 5.3) index = 'INSANE';
    else if (star_rating < 6.5) index = 'EXPERT';
    else if (star_rating < 8) index = 'APPEND';
    else if (star_rating >= 8) index = 'APPEND+';
    else index = '??';

    return index
}

/**
 *
 * @param accuracy
 * @param rank
 * @returns {number}
 */
function getProgressWidth(accuracy = 0, rank = 'F') {
    let min_acc
    let max_acc

    let min
    let max

    if (rank === 'XH' || rank === 'X') {
        return 530
    } else if (rank === 'SH' || rank === 'S') {
        min = 477
        max = 530
        min_acc = 95
        max_acc = 100
    } else if (rank === 'A') {
        min = 397
        max = 477
        min_acc = 90
        max_acc = 95
    } else if (rank === 'B') {
        min = 317
        max = 397
        min_acc = 80
        max_acc = 90
    } else if (rank === 'C') {
        min = 237
        max = 317
        min_acc = 70
        max_acc = 80
    } else if (rank === 'F') {
        min = 0
        max = 40
        min_acc = 0
        max_acc = 100
    } else {
        min = 0
        max = 237
        min_acc = 0
        max_acc = 70
    }

    const acc = (accuracy || 0) * 100
    const index =  Math.min(1, Math.max(0, (acc - min_acc) / (max_acc - min_acc)))

    return min + (max - min) * index
}

function getPadPath(number = 0, x = 0, y = 0, digit = 4, size = 40, anchor = 'right baseline', color1 = '#aaa', color2 = '#fff') {
    return getMultipleTextPath(
        [{
            font: poppinsBold,
            text: padStart(number, digit),
            size: size,
            color: color1
        }, {
            font: poppinsBold,
            text: number?.toString(),
            size: size,
            color: color2
        }], x, y, anchor
    )
}

function padStart(number = 0, digit = 8) {
    const num_string = Math.round(number).toString()
    const pad_length = Math.max(digit - num_string.length, 0)
    let pad = ''

    for (let i = 0; i < pad_length; i++) {
        pad += '0'
    }

    return pad
}

function getModsSVG(mods = [{ acronym: '' }], x, y, mod_w, text_h, interval) {
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