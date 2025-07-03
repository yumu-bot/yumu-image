import {
    exportJPEG,
    getNowTimeStamp,
    getPanelNameSVG,
    getTimeDifference,
    setImage,
    setText,
    setTexts,
    floor,
    getFormattedTime,
    getGameMode,
    getImageFromV3,
    getMapStatus,
    floors,
    getDifficultyIndex, isNotEmptyArray, getAvatar, getDiffBackground
} from "../util/util.js";
import {poppinsBold, torusRegular} from "../util/font.js";
import {getMapStatusColor} from "../util/color.js";
import {getModPath} from "../util/mod.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Eta4(data);
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
        const svg = await panel_Eta4(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 千变万化成绩面板：4：Aloic
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Eta4(data = {
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
    // 导入模板
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PETA4-BG">
            <rect width="1920" height="1080" rx="0" ry="0" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PETA4-BG" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="10" result="blur"/>
        </filter>
    </defs>
    <g id="Background">
        <rect width="1920" height="1080" rx="0" ry="0" style="fill: #fff;"/>
        <g filter="url(#blur-PETA4-BG)" style="clip-path: url(#clippath-PETA4-BG);">
        </g>
    </g>
    <g id="Component">
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_background = /(?<=<g filter="url\(#blur-PETA4-BG\)" style="clip-path: url\(#clippath-PETA4-BG\);">)/;
    const reg_index = /(?<=<g id="Index">)/;
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

    const panel_name = getPanelNameSVG('the Myriads of Changes (Not from Aloic)', '', request_time, 'v0.6.0 MY', '#2A2226');

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    // 图片定义
    const background = await getDiffBackground(data?.score, 'list');

    svg = setImage(svg, 0, 0, 1920, 1080, background, reg_background, 0.5);

    // 卡片定义
    const componentEta1 = component_Eta1(PanelEta1Generate.score2componentEta1(data.score, data.attributes));
    const componentEta2 = component_Eta2(await PanelEta1Generate.score2componentEta2(data.score, data.user, data.attributes));
    const componentEta3 = component_Eta3(PanelEta1Generate.score2componentEta3(data.score, data.attributes));
    const componentEta4 = component_Eta4(PanelEta1Generate.score2componentEta4(data.score));


    // 导入卡片
    svg = setTexts(svg, [componentEta1, componentEta2, componentEta3, componentEta4], reg_component);

    return svg.toString()

}
// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_Eta1 = (
    data = {

        title: '',
        artist: '',
        mapper: '',
        difficulty_name: '',

        mode: '',
        mods: [],
        ranked: 1,

        beatmap_id: 0,
        star_rating: 0.00,
        bpm: 0,
        length: 0,
        cs: 0,
        ar: 0,
        od: 0,
        hp: 0,

        original: {
            cs: 0,
            ar: 0,
            od: 0,
            hp: 0,
        }
    }) => {

    // 读取模板
    let svg =
        `<defs>
            <clipPath id="clippath-OPETA1-1">
                <rect id="Cover" width="300" height="210" rx="30" ry="30" style="fill: none;"/>
            </clipPath>
         </defs>
          <g id="Base_OPETA1">
            <rect id="Base" x="0" y="0" width="360" height="1920" style="fill: #EEE;" opacity="1"/>
          </g>
          <g id="Line_OPETA1">
          </g>
          <g id="Text_OPETA1">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA1">)/;
    const reg_line = /(?<=<g id="Line_OPETA1">)/;

    const titles = poppinsBold.getTextPath('Title', 60, 78, 30, 'left baseline', '#2A2226')
        + poppinsBold.getTextPath('Artist', 60, 158, 30, 'left baseline', '#2A2226')
        + poppinsBold.getTextPath('Mapper', 60, 218, 30, 'left baseline', '#2A2226')
        + poppinsBold.getTextPath('Difficulty', 60, 278, 30, 'left baseline', '#2A2226')
        + poppinsBold.getTextPath('Map Infos', 60, 338, 30, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('Star Rating', 60, 382, 30, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('Bid', 60, 492, 20, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('BPM', 60, 570, 20, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('Length', 210, 570, 20, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('CS', 60, 630, 20, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('AR', 210, 630, 20, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('OD', 60, 690, 20, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('HP', 210, 690, 20, 'left baseline', '#2A2226')

        + torusRegular.getTextPath(getGameMode(data?.mode, 2), 60, 1036, 24, 'left baseline', '#2A2226')

    const infos = torusRegular.getTextPath(torusRegular.cutStringTail(data?.title, 24, 260),
            60, 78 + 22, 24, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(torusRegular.cutStringTail(data?.artist, 24, 260),
            60, 158 + 22, 24, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(torusRegular.cutStringTail(data?.mapper, 24, 260),
            60, 218 + 22, 24, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(torusRegular.cutStringTail(data?.difficulty_name, 24, 260),
            60, 278 + 22, 24, 'left baseline', '#2A2226')
        + torusRegular.get2SizeTextPath(
            floor(data?.star_rating, 2), ' / ' + getDifficultyIndex(data?.difficulty_name, data?.star_rating, data?.mode, data?.mods),
            40, 24, 60, 420, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(data?.beatmap_id?.toString(), 60, 510, 20, 'left baseline', '#2A2226')

    const status_text = getMapStatus(data?.ranked).toUpperCase() || ''
    const status_width = poppinsBold.getTextWidth(status_text, 24)
    const status_color = getMapStatusColor(data?.ranked)

    const status = PanelDraw.Rect(60, 900, status_width + 20, 50, 25, status_color)
        + poppinsBold.getTextPath(status_text, 70, 932, 24, 'left baseline', (status_text === 'GRAVEYARD') ? '#fff' : '#2A2226')

    const length_text = Math.floor(data?.length / 60) + ':' + (data?.length % 60).toFixed(0).padStart(2, '0');

    let stats = torusRegular.getTextPath(floor(data?.bpm), 60, 600, 32, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(length_text, 210, 600, 32, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(
            stat2text(data?.cs, data?.original?.cs), 60, 660, 32, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(
            stat2text(data?.ar, data?.original?.ar), 210, 660, 32, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(
            stat2text(data?.od, data?.original?.od), 60, 720, 32, 'left baseline', '#2A2226')
        + torusRegular.getTextPath(
            stat2text(data?.hp, data?.original?.hp), 210, 720, 32, 'left baseline', '#2A2226')

    const lines =
        PanelDraw.Rect(60, 80, 240, 1, 0, '#2A2226') +
        PanelDraw.Rect(60, 160, 240, 1, 0, '#2A2226') +
        PanelDraw.Rect(60, 220, 240, 1, 0, '#2A2226') +
        PanelDraw.Rect(60, 280, 240, 1, 0, '#2A2226') +
        PanelDraw.Rect(60, 340, 240, 1, 0, '#2A2226')

    svg = setTexts(svg, [titles, infos, status, stats], reg_text)
    svg = setText(svg, lines, reg_line)

    return svg.toString()
}

const component_Eta2 = (data = {
    avatar: '',
    name: '',
    score_time: 0,
    full_pp: 0,
}) => {
    // 读取模板
    let svg =
        `
          <g id="Avatar_OPETA2">
          </g>
          <g id="Text_OPETA2">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA2">)/;
    const reg_avatar = /(?<=<g id="Avatar_OPETA2">)/;

    const titles = poppinsBold.getTextPath('Player Name', 660, 84, 24, 'left baseline', '#2A2226')
        + poppinsBold.getTextPath('Achieved Time', 660, 178, 24, 'left baseline', '#2A2226')
        + poppinsBold.getTextPath('IFFC', 420, 300, 40, 'left baseline', '#2A2226')

    const lines =
        PanelDraw.Rect(660, 86, 400, 1, 0, '#2A2226') +
        PanelDraw.Rect(660, 180, 400, 1, 0, '#2A2226') +
        PanelDraw.Rect(420, 300, 660, 1, 0, '#2A2226')

    const name = poppinsBold.getTextPath(data?.name, 660, 140, 60, 'left baseline', '#2A2226')
    const score_time = poppinsBold.getTextPath(getFormattedTime(data?.score_time, 'YYYY/MM/DD         HH:mm:ss'),
        660, 205, 24, 'left baseline', '#2A2226')

    const full_pp = torusRegular.getTextPath(Math.round((data?.full_pp || 0)) + ' PP', 518, 300, 40, 'left baseline', '#2A2226')

    svg = setImage(svg, 420, 60, 160, 160, data?.avatar, reg_avatar)
    svg = setTexts(svg, [titles, lines, name, score_time, full_pp], reg_text)

    return svg.toString()
}

const component_Eta3 = (data = {
    pp: 0,
    mode: '',

    aim_pp: 0,
    spd_pp: 0,
    acc_pp: 0,
    fl_pp: 0,
    diff_pp: 0,
}) => {
    // 读取模板
    let svg =
        `
          <g id="Text_OPETA3">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA3">)/;

    const pps = poppinsBold.get2SizeTextPath(Math.round(data?.pp).toString(), ' PP', 168, 128, 1560, 225, 'center baseline', '#EA68A2')
        + poppinsBold.getTextPath('Details', 1200, 300, 40, 'left baseline', '#2A2226')

    const line = PanelDraw.Rect(1200, 300, 660, 1, 0, '#2A2226')

    let pp_title = '', pp_value = ''

    switch (getGameMode(data?.mode, 1)) {
        case 'o': {
            pp_title = torusRegular.getTextPath('AIM PP', 1200, 326, 24, 'left baseline', '#2A2226')
                + torusRegular.getTextPath('SPEED PP', 1450, 326, 24, 'left baseline', '#2A2226')
                + torusRegular.getTextPath('ACCURACY PP', 1700, 326, 24, 'left baseline', '#2A2226')

            pp_value = poppinsBold.getTextPath(Math.round(data?.aim_pp).toString().padStart(4, '0'), 1200, 356, 30, 'left baseline', '#2A2226')
                + poppinsBold.getTextPath(Math.round(data?.spd_pp).toString().padStart(4, '0'), 1450, 356, 30, 'left baseline', '#2A2226')
                + poppinsBold.getTextPath(Math.round(data?.acc_pp).toString().padStart(4, '0'), 1700, 356, 30, 'left baseline', '#2A2226')
        } break;
        case 't': {
            pp_title = torusRegular.getTextPath('DIFF PP', 1200, 326, 24, 'left baseline', '#2A2226')
                + torusRegular.getTextPath('ACC PP', 1450, 326, 24, 'left baseline', '#2A2226')

            pp_value = poppinsBold.getTextPath(Math.round(data?.diff_pp).toString().padStart(4, '0'), 1200, 356, 30, 'left baseline', '#2A2226')
                + poppinsBold.getTextPath(Math.round(data?.acc_pp).toString().padStart(4, '0'), 1450, 356, 30, 'left baseline', '#2A2226')
        } break;
        case 'm': {
            pp_title = torusRegular.getTextPath('DIFF PP', 1200, 326, 24, 'left baseline', '#2A2226')

            pp_value = poppinsBold.getTextPath(Math.round(data?.diff_pp).toString().padStart(4, '0'), 1200, 356, 30, 'left baseline', '#2A2226')
        } break;
    }

    svg = setTexts(svg, [pps, line, pp_title, pp_value], reg_text)

    return svg.toString()
}


const component_Eta4 = (data = {
    mode: '',
    mods: [],
    statistics: {},
    combo: 0,
    max_combo: 0,
    accuracy: 0,
    score: 0,
    rank: '',
}) => {
    // 读取模板
    let svg =
        `
          <g id="Text_OPETA4">
          </g>`;

    const reg_text = /(?<=<g id="Text_OPETA4">)/;

    const titles = torusRegular.getTextPath('Accuracy', 420, 750, 40, 'left baseline', '#2A2226')
        + torusRegular.getTextPath('Combo', 420, 918, 40, 'left baseline', '#2A2226')
        + poppinsBold.getTextPath('Enabled Modifiers:', 1380, 900, 40, 'left baseline', '#2A2226')

    const acc = floors((data?.accuracy || 0) * 100, 2)
    const accuracy = poppinsBold.get2SizeTextPath(acc.integer, acc.decimal + '%', 72, 60, 420, 828, 'left baseline', '#2A2226')

    const combo = poppinsBold.get2SizeTextPath(data?.combo, 'x / ' + data?.max_combo + 'x [' + Math.round(data?.combo / data?.max_combo * 100) + '%]', 72, 48, 420, 1000, 'left baseline', '#2A2226')

    svg = setImage(svg, 1420, 400, 360, 360, getImageFromV3(`object-score-${data?.rank}2.png`), reg_text)

    const sc = floors(data?.score, -4, 1)
    const score = poppinsBold.get2SizeTextPath(sc.integer, sc.decimal, 72, 60, 1600, 785, 'center baseline', '#2A2226')

    const mods = getModsSVG(data.mods, 1380 + 300, 930, 90, 42, 50);

    const line = PanelDraw.Rect(1200, 300, 660, 1, 0, '#2A2226')

    let judges
    switch (getGameMode(data?.mode, 1)) {
        case 'o': {
            judges = getJudge(420, 440, data?.statistics?.great, 'GREAT', '#8DCFF4')
                + getJudge(720, 440, data?.statistics?.ok, 'OK', '#79C471')
                + getJudge(420, 590, data?.statistics?.meh, 'MEH', '#FEF668')
                + getJudge(720, 590, data?.statistics?.miss, 'MISS', '#ED6C9E')
        } break;
        case 't': {
            judges = getJudge(420, 440, data?.statistics?.great, 'GREAT', '#8DCFF4')
                + getJudge(720, 440, data?.statistics?.ok, 'OK', '#79C471')
                + getJudge(420, 590, data?.statistics?.miss, 'MISS', '#ED6C9E')
        } break;
        case 'c': {
            judges = getJudge(420, 440, data?.statistics?.great, 'GREAT', '#8DCFF4')
                + getJudge(720, 440, data?.statistics?.large_tick_hit, 'LARGE DROPLET', '#79C471')
                + getJudge(1020, 440, data?.statistics?.small_tick_hit, 'SMALL DROPLET', '#FEF668')
                + getJudge(420, 590, data?.statistics?.small_tick_miss, 'MISS DROPLET', '#A1A1A1')
                + getJudge(720, 590, data?.statistics?.miss, 'MISS', '#ED6C9E')
        } break;
        case 'm': {
            judges = getJudge(420, 440, data?.statistics?.perfect, 'PERFECT', '#8DCFF4')
                + getJudge(720, 440, data?.statistics?.great, 'GREAT', '#FEF668')
                + getJudge(1020, 440, data?.statistics?.ok, 'GOOD', '#79C471')
                + getJudge(420, 590, data?.statistics?.meh, 'OK', '#5E8AC6')
                + getJudge(720, 590, data?.statistics?.miss, 'MEH', '#A1A1A1')
                + getJudge(1020, 590, data?.statistics?.miss, 'MISS', '#ED6C9E')
        } break;
    }

    svg = setTexts(svg, [titles, line, score, mods, accuracy, combo, judges], reg_text)

    return svg.toString()
}

// 私有转换方式
const PanelEta1Generate = {
    score2componentEta1: (score, original) => {
        const mapper = isNotEmptyArray(score?.beatmapset?.owners) ?
            score?.beatmapset?.owners.map((v) => v?.username).join(', ') : (score?.beatmapset?.creator || '')

        return {

            title: score?.beatmapset?.title,
            artist: score?.beatmapset?.artist,
            mapper: mapper,
            difficulty_name: score?.beatmap?.version,

            mode: score?.mode,
            mods: score?.mods,
            ranked: score?.beatmap?.ranked,

            beatmap_id: score?.beatmap_id || 0,
            star_rating: score?.beatmap.difficulty_rating || 0,
            bpm: score?.beatmap?.bpm,
            length: score?.beatmap?.total_length,
            cs: score?.beatmap?.cs,
            ar: score?.beatmap?.ar,
            od: score?.beatmap?.od,
            hp: score?.beatmap?.hp,

            original: {
                cs: original.cs,
                ar: original.ar,
                od: original.od,
                hp: original.hp,
            },
        }
    },

    score2componentEta2: async (score, user, attr) => {
        return {
            avatar: await getAvatar(user?.avatar_url),
            name: user?.username || '',
            score_time: score?.ended_at,
            full_pp: attr?.full_pp || 0,
        }
    },

    score2componentEta3: (score, attr) => {
        return {
            mode: score?.mode,

            pp: score?.pp || 0,

            aim_pp: attr?.pp_aim || 0,
            spd_pp: attr?.pp_speed || 0,
            acc_pp: attr?.pp_acc || 0,
            fl_pp: attr?.pp_flashlight || 0,
            diff_pp: attr?.pp_difficulty || 0,
        }
    },

    score2componentEta4: (score) => {
        return {
            mode: score?.mode,
            mods: score?.mods,
            statistics: score?.statistics,
            combo: score?.max_combo,
            max_combo: score?.beatmap?.max_combo,
            accuracy: score?.accuracy,
            score: score?.is_lazer ? (score?.total_score || 0) : (score?.legacy_total_score || 0),
            rank: score?.legacy_rank,
        }
    },
}

function stat2text(stat, original, isDisplay = true) {
    const hasChanged = Math.abs(original - stat) > 0.1;

    const stat_number = floor(stat, 1)

    return isDisplay ? (stat_number + (hasChanged ? (' [' + floor(original, 1) + ']') : '')) : ''
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

function getJudge(x, y, number, name, color) {
    const name_length = poppinsBold.getTextWidth(name?.toUpperCase(), 30)

    return PanelDraw.Rect(x, y, name_length + 40, 40, 20, color)
        + poppinsBold.getTextPath(name?.toUpperCase(), x + 20,  y + 30, 30, 'left baseline', '#fff')
        + poppinsBold.getTextPath(number, x + 2, y + 96 + 2, 60, 'left baseline', '#1C1719', )
        + poppinsBold.getTextPath(number, x, y + 96, 60, 'left baseline', '#fff')
}