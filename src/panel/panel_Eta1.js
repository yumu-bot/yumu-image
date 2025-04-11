import {
    exportJPEG,
    getImageFromV3,
    getNowTimeStamp,
    getPanelNameSVG,
    getTimeDifference,
    setImage,
    setSvgBody,
    setText,
    setTexts,
    round, getFormattedTime, isASCII, getMapBG, getAvatar, getGameMode, rounds
} from "../util/util.js";
import {
    getRankBG
} from "../util/star.js";
import {getMultipleTextPath, poppinsBold, PuHuiTi} from "../util/font.js";
import {PanelColor} from "../util/color.js";
import {getMascotName, getRandomMascotTransparentPath} from "../util/mascotBanner.js";
import {PanelDraw} from "../util/panelDraw.js";
import {matchAnyMod} from "../util/mod.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Eta1(data);
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
        const svg = await panel_Eta1(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 千变万化成绩面板：1：yf_bmp
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Eta1(data = {
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
        <clipPath id="clippath-PETA1-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PETA1-BG">
        <rect width="1920" height="1080" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PETA1-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PETA1-1);">
        </g>
    </g>
    <g id="Background">
        <rect width="1920" height="1080" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PETA1-BG)" style="clip-path: url(#clippath-PETA1-BG);">
        </g>
    </g>
    <g id="Component">
    </g>
    <g id="Text">
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_background = /(?<=<g filter="url\(#blur-PETA1-BG\)" style="clip-path: url\(#clippath-PETA1-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_text = /(?<=<g id="Text">)/;
    const reg_component = /(?<=<g id="Component">)/;

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

    const panel_name = getPanelNameSVG('the Myriads of Changes (Not from yf_bmp)', '', request_time, 'v0.6.0 MY');

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    const no_diagram_here = poppinsBold.getTextPath('No Diagram Here', 1630, 830, 48, 'center baseline', '#666')

    svg = setImage(svg, 1520, 708, 242, 216, getImageFromV3('object-hexagon.png'), reg_component, 0.4)

    const footnote = PuHuiTi.getTextPath('基于抄袭制作，完全不确保可用性', 1880, 985, 30, 'right baseline', '#666')
    const footnote2 = poppinsBold.getTextPath('Designed by yf_apng', 1880, 1035, 30, 'right baseline', '#666')

    svg = setTexts(svg, [no_diagram_here, footnote, footnote2], reg_text);

    // 评级
    const rank = data?.score?.legacy_rank
    svg = setImage(svg, 1360, 210, 560, 560, getImageFromV3(`object-score-${rank}2.png`), reg_index, 1);

    // 图片定义
    const background = getRankBG(rank, data?.score?.passed);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.5);

    // 卡片定义
    const componentEta1 = component_Eta1(await PanelEta1Generate.score2componentEta1(data.score));
    const componentEta2 = component_Eta2(await PanelEta1Generate.score2componentEta2(data.score, data.user, data.attributes));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, componentEta1, reg_component);
    svg = setSvgBody(svg, 40, 290, componentEta2, reg_component);

    return svg.toString()
}


// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_Eta1 = (
    data = {
        cover: '',

        title: '',
        title_unicode: '',
        beatmap_id: 0,
        star_rating: 0.00,
        difficulty_name: '',
        bpm: 0,
        cs: 0,
        ar: 0,
        od: 0,
        hp: 0,
    }) => {

    // 读取模板
    let svg =
        `<defs>
            <clipPath id="clippath-OPETA1-1">
                <rect id="Cover" width="300" height="210" rx="30" ry="30" style="fill: none;"/>
            </clipPath>
         </defs>
          <g id="Base_OPETA1">
            <rect id="Base" x="0" y="0" width="1840" height="210" rx="30" ry="30" style="fill: #382e32;" opacity="0.5"/>
          </g>
          <g id="BG_OPETA1" style="clip-path: url(#clippath-OPETA1-1);">
          </g>
          <g id="Text_OPETA1">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA1">)/;
    const reg_cover = /(?<=<g id="BG_OPETA1" style="clip-path: url\(#clippath-OPETA1-1\);">)/;

    svg = setImage(svg, 0, 0, 300, 210, data?.cover, reg_cover)

    const title_text = poppinsBold.cutStringTail(data?.title, 72, 1080)
    const title2_width = 1080 - poppinsBold.getTextWidth(title_text, 72);
    const title2_font = isASCII(data?.title_unicode) ? poppinsBold : PuHuiTi

    const title = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: title_text + ' ',
            size: 72,
            color: '#fff'
        }, {
            font: title2_font,
            text: data?.title === data?.title_unicode ? '' : title2_font.cutStringTail(data?.title_unicode, 24, title2_width),
            size: 24,
            color: '#fff'
        }], 340, 85, 'left baseline'
    )

    const difficulty_text = poppinsBold.cutStringTail(data?.difficulty_name, 48, 460)
    const remain_text = '    BPM ' + round(data?.bpm, 2)
        + '    CS ' + round(data?.cs, 1)
        + '    AR ' + round(data?.ar, 1)
        + '    OD ' + round(data?.od, 1)
        + '    HP ' + round(data?.hp, 1)

    const difficulty = getMultipleTextPath(
        [{
            font: poppinsBold,
            text: difficulty_text,
            size: 48,
            color: '#fff'
        }, {
            font: poppinsBold,
            text: remain_text,
            size: 36,
            color: '#aaa'
        }], 340, 165, 'left baseline'
    )

    const star = poppinsBold.getTextPath('b/' + data?.beatmap_id + '   *' + round(data.star_rating, 2), 1840 - 80, 85, 36, 'right baseline', '#aaa')

    const gg4u = poppinsBold.getTextPath('GG4U.', 1840 - 80, 165, 24, 'right baseline', '#666')

    svg = setTexts(svg, [title, difficulty, star, gg4u], reg_text)

    return svg.toString()
}

const component_Eta2 = (data = {
    avatar: '',
    name: '',

    mode: '',
    statistics: {},
    combo: 0,
    max_combo: 0,
    accuracy: 0,
    score: 0,
    pp: 0,
    full_pp: 0,
    perfect_pp: 0,
    rank: 'F',

    advanced_judge: '',
}) => {
    // 读取模板
    let svg =
        `<defs>
            <clipPath id="clippath-OPETA2-1">
                <rect id="Cover" width="1320" height="750" rx="30" ry="30" style="fill: none;"/>
            </clipPath>
         </defs>
          <g id="Base_OPETA2">
            <rect id="Base" x="0" y="0" width="1320" height="750" rx="30" ry="30" style="fill: #382e32;" opacity="0.5"/>
          </g>
          <g id="Mascot_OPETA2" style="clip-path: url(#clippath-OPETA2-1);">
          </g>
          <g id="Rotate_OPETA2" transform="translate(290 20)" opacity="0.5">
            <rect id="Base" x="0" y="0" width="370" height="290" rx="20" ry="20" style="fill: #382e32;"/>
            <g id="Name_OPETA2">
            </g>
            <g id="Avatar_OPETA2">
            </g>
          </g>
          <g id="Text_OPETA2">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA2">)/;
    const reg_name = /(?<=<g id="Name_OPETA2">)/;
    const reg_avatar = /(?<=<g id="Avatar_OPETA2">)/;
    const reg_mascot = /(?<=<g id="Mascot_OPETA2" style="clip-path: url\(#clippath-OPETA2-1\);">)/;

    const name = poppinsBold.getTextPath(data?.name, 185, 265, 30, 'center baseline', '#fff')
    const name_title = poppinsBold.getTextPath('PLAYER 01', 24, 48, 30, 'left baseline', '#fff')

    svg = setImage(svg, 100, 60, 170, 170, data?.avatar, reg_avatar)
    svg = setTexts(svg, [name, name_title], reg_name)

    svg = setImage(svg, -650, 0, 1822, 750, getRandomMascotTransparentPath(getMascotName(data?.mode)), reg_mascot)

    const titles = poppinsBold.getTextPath('JUD.', 700, 52, 30, 'left baseline', '#fff')
        + poppinsBold.getTextPath('COMBO', 700, 282, 30, 'left baseline', '#fff')
        + poppinsBold.getTextPath('ACC.', 700, 372, 30, 'left baseline', '#fff')
        + poppinsBold.getTextPath('SCORE', 700, 462, 30, 'left baseline', '#fff')
        + poppinsBold.getTextPath('STATUS', 700, 572, 30, 'left baseline', '#fff')
        + poppinsBold.getTextPath('PP', 700, 632, 30, 'left baseline', '#fff')

    let judges

    switch (getGameMode(data.mode, 1)) {
        case 'o': {
            judges = poppinsBold.getTextPath('GR', 870, 66, 48, 'center baseline', '#8DCFF4')
                + poppinsBold.getTextPath('OK', 870, 66 + 64, 48, 'center baseline', '#79C471')
                + poppinsBold.getTextPath('MH', 870, 66 + 128, 48, 'center baseline', '#FEF668')
                + poppinsBold.getTextPath('MS', 870 + 240, 66 + 128, 48, 'center baseline', '#ED6C9E')
                + poppinsBold.getTextPath(data.statistics?.great, 870 + 420, 66, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.ok, 870 + 420, 66 + 64, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.meh, 870 + 180, 66 + 128, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.miss, 870 + 420, 66 + 128, 48, 'right baseline', '#fff')
        } break;
        case 't': {
            judges = poppinsBold.getTextPath('GR', 870, 66, 48, 'center baseline', '#8DCFF4')
                + poppinsBold.getTextPath('OK', 870, 66 + 64, 48, 'center baseline', '#79C471')
                + poppinsBold.getTextPath('MS', 870, 66 + 128, 48, 'center baseline', '#ED6C9E')
                + poppinsBold.getTextPath(data.statistics?.great, 870 + 420, 66, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.ok, 870 + 420, 66 + 64, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.miss, 870 + 420, 66 + 128, 48, 'right baseline', '#fff')
        } break;
        case 'c': {
            judges = poppinsBold.getTextPath('GR', 870, 66, 48, 'center baseline', '#8DCFF4')
                + poppinsBold.getTextPath('L', 870, 66 + 64, 48, 'center baseline', '#79C471')
                + poppinsBold.getTextPath('S', 870, 66 + 64, 48, 'center baseline', '#FEF668')
                + poppinsBold.getTextPath('MD', 870, 66 + 128, 48, 'center baseline', '#A1A1A1')
                + poppinsBold.getTextPath('MS', 870 + 240, 66 + 128, 48, 'center baseline', '#ED6C9E')
                + poppinsBold.getTextPath(data.statistics?.great, 870 + 420, 66, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.large_tick_hit, 870 + 180, 66 + 64, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.small_tick_hit, 870 + 420, 66 + 64, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.small_tick_miss, 870 + 180, 66 + 128, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.miss, 870 + 420, 66 + 128, 48, 'right baseline', '#fff')
        } break;
        case 'm': {
            judges = poppinsBold.getTextPath('PF', 870, 66, 48, 'center baseline', '#8DCFF4')
                + poppinsBold.getTextPath('GR', 870 + 240, 66, 48, 'center baseline', '#FEF668')
                + poppinsBold.getTextPath('GD', 870, 66 + 64, 48, 'center baseline', '#79C471')
                + poppinsBold.getTextPath('OK', 870 + 240, 66 + 64, 48, 'center baseline', '#5E8AC6')
                + poppinsBold.getTextPath('MH', 870, 66 + 128, 48, 'center baseline', '#A1A1A1')
                + poppinsBold.getTextPath('MS', 870 + 240, 66 + 128, 48, 'center baseline', '#ED6C9E')
                + poppinsBold.getTextPath(data.statistics?.perfect, 870 + 180, 66, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.great, 870 + 420, 66, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.good, 870 + 180, 66 + 64, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.ok, 870 + 420, 66 + 64, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.meh, 870 + 180, 66 + 128, 48, 'right baseline', '#fff')
                + poppinsBold.getTextPath(data.statistics?.miss, 870 + 420, 66 + 128, 48, 'right baseline', '#fff')
        } break;
    }

    const combo = poppinsBold.get2SizeTextPath(data?.combo?.toString(), 'x', 60, 48, 1290, 294, 'right baseline', '#fff')
    const max_combo = poppinsBold.get2SizeTextPath('/ ', data?.max_combo?.toString(), 24, 30, 1290, 332, 'right baseline', '#aaa')

    const acc = rounds((data?.accuracy || 0) * 100, 2)
    const accuracy = poppinsBold.get2SizeTextPath(acc.integer, acc.decimal + '%', 60, 48, 1290, 384, 'right baseline', '#fff')

    const sc = rounds(data?.score, -4)
    const score = poppinsBold.get2SizeTextPath(sc.integer, sc.decimal, 60, 48, 1290, 474,  'right baseline', '#fff')

    const advanced_judge = data.advanced_judge
    const advanced_judge_color = advancedJudge2Color(advanced_judge)

    const status = poppinsBold.getTextPath(advanced_judge?.toUpperCase(), 1290, 582, 60, 'right baseline', advanced_judge_color)

    const pp = poppinsBold.getTextPath(Math.round(data?.pp).toString(), 1290, 676, 90, 'right baseline', advanced_judge_color)
    const nearly_fc = (data?.full_pp - data?.pp > 0) && (data?.full_pp - data?.pp < 2)

    const pp_compare = poppinsBold.get2SizeTextPath('/ ',
        Math.round(nearly_fc ? data?.perfect_pp : data?.full_pp) + (nearly_fc ? ' SS' : ' FC'),
        24, 36, 1290, 720, 'right baseline', advanced_judge_color)

    const rrects = PanelDraw.Rect(834 - 40, 314 - 290, 6, 180, 3, '#666', 0.5)
        + PanelDraw.Rect(730 - 40, 514 - 290, 600, 6, 3, '#666', 0.5)
        + PanelDraw.Rect(730 - 40, 794 - 290, 600, 6, 3, '#666', 0.5)

    svg = setTexts(svg, [titles, judges, rrects, combo, max_combo, accuracy, score, status, pp, pp_compare], reg_text)
    return svg.toString()
}


// 私有转换方式
const PanelEta1Generate = {
    score2componentEta1: async (score) => {
        return {
            cover: await getMapBG(score?.beatmapset?.id, 'list@2x'),

            title: score?.beatmapset?.title,
            title_unicode: score?.beatmapset?.title_unicode,
            beatmap_id: score?.beatmap_id,
            star_rating: score?.beatmap.difficulty_rating || 0,
            difficulty_name: score?.beatmap?.version,
            bpm: score?.beatmap?.bpm,
            cs: score?.beatmap?.cs,
            ar: score?.beatmap?.ar,
            od: score?.beatmap?.od,
            hp: score?.beatmap?.hp,
        }
    },

    score2componentEta2: async (score, user, attr) => {
        return {
            avatar: await getAvatar(user?.avatar_url),
            name: user?.username || 'Unknown',

            mode: score?.mode,
            statistics: score?.statistics,
            combo: score?.max_combo,
            max_combo: score?.beatmap?.max_combo,
            accuracy: score?.accuracy,
            score: score?.is_lazer ? (score?.total_score || 0) : (score?.legacy_total_score || 0),
            pp: score?.pp || 0,
            full_pp: attr?.full_pp || 0,
            perfect_pp: attr?.perfect_pp || 0,
            rank: score?.legacy_rank,

            advanced_judge: score2AdvancedJudge(score),
        }
    },
}


//老面板的score_categorize
const score2AdvancedJudge = (score) => {
    const isTaikoPF = getGameMode(score?.mode, 1) === 't' && (score.rank === 'XH' || score.rank === 'X');
    const isPF = score?.perfect || isTaikoPF;

    if (matchAnyMod(score?.mods, ['NF']) || score?.rank === 'F') {
        return 'played';
    } else if (isPF) {
        return 'perfect';
    } else if (score?.statistics?.count_miss === 0) {
        return 'nomiss';
    } else if (score?.rank !== 'F') {
        return 'clear';
    } else {
        return 'played';
    }
}

const advancedJudge2Color = (judge = '') => {
    switch (judge) {
        case "perfect": return '#FEF668';
        case "clear": return '#8DCFF4';
        case "nomiss": return '#79C471';
        default: return '#ED6C9E';
    }
}