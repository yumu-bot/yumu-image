import {
    exportJPEG,
    getNowTimeStamp,
    getPanelNameSVG,
    getTimeDifference,
    setImage,
    setSvgBody,
    setText,
    setTexts,
    round, getFormattedTime, isASCII, getAvatar, getGameMode, rounds, getDiffBG
} from "../util/util.js";
import {
    getRankBG, hasLeaderBoard
} from "../util/star.js";
import {getMultipleTextPath, PuHuiTi, torus} from "../util/font.js";
import {PanelColor} from "../util/color.js";
import {getModPath} from "../util/mod.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Eta2(data);
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
        const svg = await panel_Eta2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 千变万化成绩面板：2：phira
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Eta2(data = {
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
        <clipPath id="clippath-PETA2-1">
            <rect x="330" y="225" width="260" height="630" rx="40" ry="40" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PETA2-BG">
            <rect width="1920" height="1080" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PETA2-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="100" result="blur"/>
        </filter>
    </defs>
    <g id="Background">
        <rect width="1920" height="1080" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PETA2-BG)" style="clip-path: url(#clippath-PETA2-BG);">
        </g>
    </g>
    <g id="Component">
    </g>
    <g id="Cover" style="clip-path: url(#clippath-PETA2-1);">
    </g>
    <g id="Text">
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_background = /(?<=<g filter="url\(#blur-PETA2-BG\)" style="clip-path: url\(#clippath-PETA2-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_text = /(?<=<g id="Text">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_cover = /(?<=<g id="Cover" style="clip-path: url\(#clippath-PETA2-1\);">)/;

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

    const panel_name = getPanelNameSVG('the Myriads of Changes (Not from Phira)', '', request_time, 'v0.6.0 MY');

    // 导入文字
    const difficulty_text = getDiffIndex(data?.score?.beatmap?.difficulty_rating || 0) + ' SR. ' + round(data?.score?.beatmap?.difficulty_rating, 2)
    const difficulty = torus.getTextPath(difficulty_text, 350, 834, 40, 'left baseline', '#fff')

    svg = setText(svg, panel_name, reg_index);
    svg = setText(svg, difficulty, reg_text);

    // 图片定义
    const background = await getDiffBG(data?.score?.beatmap?.id, data?.score?.beatmapset?.id, 'list@2x', hasLeaderBoard(data?.score?.beatmap?.ranked), data?.score?.beatmap?.beatmapset?.availability?.more_information != null);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.6);
    svg = setImage(svg, 330, 225, 260, 630, background, reg_cover, 0.8);


    // 卡片定义
    const componentEta1 = component_Eta1(PanelEta1Generate.score2componentEta1(data.score, data.attributes));
    const componentEta2 = component_Eta2(await PanelEta1Generate.score2componentEta2(data.user));


    // 导入卡片
    svg = setSvgBody(svg, 330, 225, componentEta1, reg_component);
    svg = setText(svg, componentEta2, reg_component);

    return svg.toString()
}


// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_Eta1 = (data = {
    title: '',
    title_unicode: '',
    
    rank: '',

    score: 0,
    mode: '',
    mods: [],
    statistics: {},

    accuracy: 0,
    combo: 0,
    max_combo: 0,
    pp: 0,
    full_pp: 0,
    perfect_pp: 0,

}) => {
    // 读取模板
    let svg =
        `<defs>
            <clipPath id="clippath-OPETA2-1">
                <rect id="Cover" width="1260" height="630" rx="40" ry="40" style="fill: none;"/>
            </clipPath>
         </defs>
          <g id="Base_OPETA2">
            <rect id="Base" x="0" y="0" width="1260" height="630" rx="40" ry="40" style="fill: #382e32;"/>
          </g>
          <g id="BG_OPETA2" style="clip-path: url(#clippath-OPETA2-1);">
          </g>
          <g id="Text_OPETA2">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA2">)/;
    const reg_cover = /(?<=<g id="BG_OPETA2" style="clip-path: url\(#clippath-OPETA2-1\);">)/;

    svg = setImage(svg, 0, 0, 1260, 630, getRankBG(data.rank), reg_cover, 0.2)

    const title_text = torus.cutStringTail(data?.title, 60, 940)
    const title2_width = 940 - torus.getTextWidth(title_text, 60);
    const title2_font = isASCII(data?.title_unicode) ? torus : PuHuiTi

    const title = getMultipleTextPath(
        [{
            font: torus,
            text: title_text + ' ',
            size: 60,
            color: '#fff'
        }, {
            font: title2_font,
            text: data?.title === data?.title_unicode ? '' : title2_font.cutStringTail(data?.title_unicode, 24, title2_width),
            size: 24,
            color: '#aaa'
        }], 310, 85, 'left baseline'
    )

    const sc = rounds(data?.score || 0, -4, 1)

    const score = getMultipleTextPath(
        [{
            font: torus,
            text: sc.integer,
            size: 96,
            color: '#fff'
        }, {
            font: torus,
            text: sc.decimal + ' ',
            size: 72,
            color: '#fff'
        }, {
            font: torus,
            text: round((data?.accuracy || 0) * 100, 2),
            size: 60,
            color: '#aaa'
        }, {
            font: torus,
            text: '% (' + data?.rank + ')',
            size: 48,
            color: '#aaa'
        }], 310, 220, 'left baseline'
    )

    const mode = torus.getTextPath(getGameMode(data?.mode, 2), 310, 280, 36, 'left baseline')
    const mods = getModsSVG(data.mods, 1130, 535, 90, 42, 50);

    let judges

    switch (getGameMode(data.mode, 1)) {
        case 'o': {
            judges = torus.getTextPath('Great', 310, 335, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Ok', 310, 335 + 100, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Meh', 310, 335 + 200, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Miss', 310 + 300, 335 + 200, 30, 'left baseline', '#aaa')
                + torus.getTextPath(data.statistics?.great, 310, 385, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.ok, 310, 385 + 100, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.meh, 310, 385 + 200, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.miss, 310 + 300, 385 + 200, 48, 'left baseline', '#fff')
        } break
        case 't': {
            judges = torus.getTextPath('Great', 310, 335, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Ok', 310, 335 + 100, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Miss', 310, 335 + 200, 30, 'left baseline', '#aaa')
                + torus.getTextPath(data.statistics?.great, 310, 385, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.ok, 310, 385 + 100, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.miss, 310, 385 + 200, 48, 'left baseline', '#fff')
        } break
        case 'c': {
            judges = torus.getTextPath('Great', 310, 335, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Large Droplet', 310, 335 + 100, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Small Droplet', 310, 335 + 200, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Miss Droplet', 310 + 300, 335 + 100, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Miss', 310 + 300, 335 + 200, 30, 'left baseline', '#aaa')
                + torus.getTextPath(data.statistics?.great, 310, 385, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.large_tick_hit, 310, 385 + 100, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.small_tick_hit, 310, 385 + 200, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.small_tick_miss, 310 + 300, 385 + 100, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.miss, 310 + 300, 385 + 200, 48, 'left baseline', '#fff')
        } break
        case 'm': {
            judges = torus.getTextPath('Perfect', 310, 335, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Great', 310 + 300, 335, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Good', 310, 335 + 100, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Ok', 310 + 300, 335 + 100, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Meh', 310, 335 + 200, 30, 'left baseline', '#aaa')
                + torus.getTextPath('Miss', 310 + 300, 335 + 200, 30, 'left baseline', '#aaa')
                + torus.getTextPath(data.statistics?.perfect, 310, 385, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.great, 310 + 300, 385, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.good, 310, 385 + 100, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.ok, 310 + 300, 385 + 100, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.meh, 310, 385 + 200, 48, 'left baseline', '#fff')
                + torus.getTextPath(data.statistics?.miss, 310 + 300, 385 + 200, 48, 'left baseline', '#fff')
        } break
    }

    const combo = torus.getTextPath('Combo', 310 + 600, 335, 30, 'left baseline', '#aaa')
        + torus.get2SizeTextPath(data?.combo?.toString(), ' / ' + data?.max_combo?.toString(), 48, 30, 310 + 600, 385, 'left baseline', '#fff')

    const pp = torus.getTextPath('PP', 310 + 600, 335 + 100, 30, 'left baseline', '#aaa')
        + torus.get2SizeTextPath(Math.round(data?.pp || 0).toString(),
            ' / ' + Math.round(data?.perfect_pp || 0) + ' (' + Math.round(((data?.pp / data?.perfect_pp) || 0) * 100) + '%)',
            48, 30, 310 + 600, 385 + 100, 'left baseline', '#fff')

    svg = setTexts(svg, [title, score, mode, mods, judges, combo, pp], reg_text)

    return svg.toString()
}

const component_Eta2 = (data = {
    avatar: '',
    name: '',
    pp: 0,
}) => {
    // 读取模板
    let svg =
        `<defs>
            <clipPath id="clippath-OPETA2-2">
                <circle id="Avatar" cx="1816" cy="124" r="64" style="fill: none;"/>
            </clipPath>
         </defs>
          <g id="Avatar_OPETA2" style="clip-path: url(#clippath-OPETA2-2);">
          </g>
          <g id="Text_OPETA2">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA2">)/;
    const reg_avatar = /(?<=<g id="Avatar_OPETA2" style="clip-path: url\(#clippath-OPETA2-2\);">)/;

    const name = torus.getTextPath(data?.name, 1720, 104, 48, 'right baseline', '#fff')
    const pp = torus.getTextPath(Math.round(data?.pp) + ' PP', 1720, 148, 36, 'right baseline', '#aaa')

    svg = setImage(svg, 1752, 60, 128, 128, data?.avatar, reg_avatar)
    svg = setTexts(svg, [name, pp], reg_text)

    return svg.toString()
}


// 私有转换方式
const PanelEta1Generate = {
    score2componentEta1: (score, attr) => {
        return {
            title: score?.beatmapset?.title,
            title_unicode: score?.beatmapset?.title_unicode,

            rank: score?.legacy_rank,

            score: score?.is_lazer ? (score?.total_score || 0) : (score?.legacy_total_score || 0),
            mode: score?.mode,
            mods: score?.mods,
            statistics: score?.statistics,

            accuracy: score?.accuracy,
            combo: score?.max_combo || 0,
            max_combo: score?.beatmap?.max_combo || 0,
            pp: score?.pp || 0,
            full_pp: attr?.full_pp || 0,
            perfect_pp: attr?.perfect_pp || 0,
        }
    },

    score2componentEta2: async (user) => {
        return {
            avatar: await getAvatar(user?.avatar_url),
            name: user?.username || 'Unknown',
            pp: user?.pp || 0,
        }
    },
}

function getDiffIndex(star_rating = 0) {
    let index

    if (star_rating < 0.1) index = '--';
    else if (star_rating < 2) index = 'EZ';
    else if (star_rating < 2.8) index = 'NM';
    else if (star_rating < 4) index = 'HD';
    else if (star_rating < 5.3) index = 'IN';
    else if (star_rating < 6.5) index = 'AT';
    else if (star_rating < 8) index = 'SP';
    else if (star_rating >= 8) index = 'SP+';
    else index = '??';

    return index
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