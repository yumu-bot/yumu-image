import {
    exportJPEG, getFormattedTime,
    getNowTimeStamp,
    getPanelNameSVG, setImage,
    isEmptyArray, isNotNull, readTemplate,
    setText, setTexts, floors, getSvgBody, getMapBackground, thenPush,
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMultipleTextPath, poppinsBold} from "../util/font.js";
import {card_F3} from "../card/card_F3.js";
import {card_F2} from "../card/card_F2.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_F3(data);
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
        const svg = await panel_F3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 每轮的比赛对局面板
 * @param data
 * @return {Promise<string>}
 */
async function panel_F3(
    data = {
        match: {
            match: {
                match: [Object],
                events: [Array],
                users: [Array],
                first_event_id: 2421331035,
                latest_event_id: 2421353613,
                name: 'test4',
                id: 117301572,
                start_time: '2025-02-25T14:49:34Z',
                is_match_end: false
            },
            average_star: 3.991101208855124,
            team_point_map: { blue: 17 },
            is_team_vs: true,
            round_count: 17,
            player_count: 1,
            first_map_bid: 4156068,
            score_count: 17
        },
        round: {
            id: 612178469,
            beatmap: {
                od: 9.4,
                bpm: 213.25,
                cs: 4,
                ar: 9.4,
                hp: 5,
                beatmapset_id: 2112089,
                difficulty_rating: 5.0604400634765625,
                id: 4523375,
                mode: 'OSU',
                status: 'ranked',
                total_length: 39,
                user_id: 12315824,
                version: "Aku's Overdose",
                beatmapset: [Object],
                checksum: 'f1f6a69c88ef25a2d32e733890429776',
                max_combo: 277,
                accuracy: 9.4,
                convert: false,
                count_circles: 58,
                count_sliders: 95,
                count_spinners: 0,
                drain: 5,
                hit_length: 39,
                mode_int: 2,
                passcount: 2691,
                playcount: 18010,
                preview_name: "Wire - Brazil (Vaqu) [Aku's Overdose]",
                has_leader_board: true,
                fails: [Array],
                retry: 0,
                fail: 0,
                retries: [Array]
            },
            beatmap_id: 4523375,
            start_time: '2025-02-25T16:52:30Z',
            end_time: '2025-02-25T16:53:19Z',
            mode_int: 2,
            scores: [ [Object] ],
            team_type: 'team-vs',
            scoring_type: 'score',
            mode: 'CATCH',
            winning_team_score: 359840,
            is_team_vs: true,
            winning_team: 'blue',
            blue_team_score: 359840,
            red_team_score: 0,
            total_team_score: 359840
        },
        index: 16,
        panel: "MR"
    }

) {
    // 导入模板
    let svg = readTemplate('template/Panel_F2.svg');

    // 路径定义
    const reg_height = '${height}'
    const reg_panelheight = '${panelheight}'
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_bodycard = /(?<=<g id="BodyCard">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PF-2\);">)/;

    // 类
    const match = data?.match
    const round = data?.round || {}
    const stat = match?.match?.match || {}
    // const team_point_map = match?.team_point_map || {}

    // 面板文字
    const match_time = isNotNull(stat?.end_time) ? ('match ends at: ' + getFormattedTime(stat?.end_time))  :
        ('match starts at: ' + getFormattedTime(stat?.start_time) + ' - in progress')

    const request_time = match_time + ' // request time: ' + getNowTimeStamp();
    let panel_name

    if (data?.panel === "RR") {
        panel_name = getPanelNameSVG('Round Results v2 (passive module)', 'RR', request_time);
    } else {
        panel_name = getPanelNameSVG('Match Rounds v2 (!ymro)', 'RO', request_time);
    }

    // 插入文字
    svg = setText(svg, panel_name, reg_index)

    // 定义模式
    const is_team_vs = (round.team_type === 'team-vs' || round.team_type === '')

    // 导入比赛简介卡（A2卡
    const f = card_A2(await PanelGenerate.matchRating2CardA2(match, round.beatmap, false));

    const info_svg = getSvgBody(40, 40, f)

    // 导入谱面（A2卡
    const b = card_A2(await PanelGenerate.matchBeatMap2CardA2(round?.beatmap));

    const beatmap_svg = getSvgBody(1450, 40, b);

    svg = setTexts(svg, [info_svg, beatmap_svg], reg_maincard)

    // 导入身体卡片
    const score_banner = drawScoreBanner(round, is_team_vs)

    const score_banner_svg = getSvgBody(0, 330, score_banner)

    const reds = round.scores.filter(s => {
        return s.match.team === 'red'
    })
    const blues = round.scores.filter(s => {
        return s.match.team === 'blue'
    })

    const body_card = await drawBodyCard(is_team_vs, reds, blues, round.scores, round.beatmap.max_combo)

    const body_card_svg = getSvgBody(0, 450, body_card)

    svg = setTexts(svg, [score_banner_svg, body_card_svg], reg_bodycard)

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, await getMapBackground(round?.beatmap, 'cover'), reg_banner, 0.8);

    const card_height = is_team_vs ?
        (Math.max(reds.length, blues.length) > 6 ?
            (Math.ceil((Math.max(reds.length, blues.length) - 6) / 2) * 195 + 790) : 790) :
        (round.scores.length > 12 ? (195 + 790) : 790)

    svg = setText(svg, card_height + (1080 - 790), reg_panelheight);
    svg = setText(svg, card_height, reg_height);

    return svg.toString();
}

// 绘制横幅
function drawScoreBanner(round = {}, is_team_vs = false) {
    let svg = ''

    const winning_team = round.winning_team

    const base_rrect = PanelDraw.Rect(-40, 0, 980, 120, 20, '#382E32') + PanelDraw.Rect(980, 0, 980, 120, 20, '#382E32')

    let left_rrect
    let right_rrect

    let left_text
    let right_text

    let left_score
    let right_score

    if (is_team_vs) {
        const left_opacity = (winning_team === 'red') ? 1 : 0.2
        const right_opacity = (winning_team === 'blue') ? 1 : 0.2

        left_rrect = PanelDraw.LinearGradientRect(-40, 0, 980, 120, 20,
           ["#801D34", "#E50050"],
            left_opacity,
        )

        right_rrect = PanelDraw.LinearGradientRect(980, 0, 980, 120, 20,
            ["#00A0E9", "#006899"],
            right_opacity,
        )

        left_text = poppinsBold.getTextPath((winning_team === 'red') ? 'WIN!' : ((winning_team === null) ? 'TIE...' : 'LOSE...'),
            40, 84, 72, 'left baseline', '#fff', 0.5)
        right_text = poppinsBold.getTextPath((winning_team === 'blue') ? 'WIN!' : ((winning_team === null) ? 'TIE...' : 'LOSE...'),
            1880, 84, 72, 'right baseline', '#fff', 0.5)

        const rs = floors(round.red_team_score, -4)
        left_score = getMultipleTextPath([
            {
                font: poppinsBold,
                text: (winning_team === 'blue') ? ((round.red_team_score - round.blue_team_score).toString() + '   ') : '',
                size: 30,
                color: '#ccc',
            }, {
                font: poppinsBold,
                text: rs.integer,
                size: 72,
                color: '#fff',
            }, {
                font: poppinsBold,
                text: rs.decimal,
                size: 48,
                color: '#fff',
            },
        ], 900, 85, 'right baseline')

        const bs = floors(round.blue_team_score, -4)
        right_score = getMultipleTextPath([
            {
                font: poppinsBold,
                text: bs.integer,
                size: 72,
                color: '#fff',
            }, {
                font: poppinsBold,
                text: bs.decimal,
                size: 48,
                color: '#fff',
            }, {
                font: poppinsBold,
                text: (winning_team === 'red') ? ('   ' + (round.blue_team_score - round.red_team_score).toString()) : '',
                size: 30,
                color: '#ccc',
            }
        ], 1020, 85, 'left baseline')

    } else {
        left_rrect = PanelDraw.LinearGradientRect(-40, 0, 980, 120, 20,
            ["#ccc", "#fff"],
            0.6,
        )


        right_rrect = PanelDraw.LinearGradientRect(980, 0, 980, 120, 20,
            ["#fff", "#ccc"],
            0.8,
        )

        left_text = poppinsBold.getTextPath('TOTAL', 40, 84, 72, 'left baseline', '#fff', 0.5)
        right_text = poppinsBold.getTextPath('AVERAGE', 1880, 84, 72, 'right baseline', '#fff', 0.5)

        const ts = floors(round.total_team_score, -4)
        left_score = getMultipleTextPath([
            {
                font: poppinsBold,
                text: ts.integer,
                size: 72,
                color: '#fff',
            }, {
                font: poppinsBold,
                text: ts.decimal,
                size: 48,
                color: '#fff',
            },
        ], 900, 85, 'right baseline')

        const as = floors((round.total_team_score / round.scores.length) || 0, -4)
        right_score = getMultipleTextPath([
            {
                font: poppinsBold,
                text: as.integer,
                size: 72,
                color: '#fff',
            }, {
                font: poppinsBold,
                text: as.decimal,
                size: 48,
                color: '#fff',
            },
        ], 1020, 85, 'left baseline')

    }

    svg += ('<g>' + (base_rrect + left_rrect + right_rrect + left_score + right_score + left_text + right_text) + '</g>')

    return svg.toString()
}

// 绘制主卡
async function drawBodyCard(is_team_vs = false, reds = [], blues = [], scores = [], max_combo) {
    if (is_team_vs) {
        return getSvgBody(510, 40, await drawVSCard(reds, blues, max_combo, false))
            + getSvgBody(980, 40, await drawVSCard(blues, reds, max_combo, true))
    } else {
        return getSvgBody(40, 40, await drawH2HCard(scores, max_combo))
    }
}

async function drawH2HCard(scores = [], max_combo = 0) {
    if (isEmptyArray(scores)) return ''

    let svg = ''
    let promise1 = []
    let promise2 = []

    let p1 = []
    let p2 = []

    let p1_size
    const length = scores.length

    if (length <= 4) {
        p1_size = length
    } else if (length <= 6) {
        p1_size = 3
    } else if (length <= 8) {
        p1_size = 2
    } else if (length <= 10) {
        p1_size = 1
    } else {
        p1_size = 0
    }

    const compare_score = (scores?.length >= 2) ? (scores[0].score || scores[0]?.legacy_total_score) : Math.max.apply(Math, scores.map(v => {return v?.score || v?.legacy_total_score || 0}))

    for (const i in scores) {
        const s = scores[i]

        if (i < p1_size) {
            promise1.push(card_F2(s, max_combo, compare_score))
        } else {
            promise2.push(card_F3(s, max_combo, compare_score))
        }
    }

    await Promise.allSettled(
        promise1
    ).then(results => thenPush(results, p1))

    await Promise.allSettled(
        promise2
    ).then(results => thenPush(results, p2))

    let p1_solo_offset
    switch (length) {
        case 1: p1_solo_offset = 960 - 430 / 2 - 40; break
        case 2: p1_solo_offset = 960 - 430 - 60; break
        case 3: p1_solo_offset = 960 - 430 * 3 / 2 - 80; break
        default: p1_solo_offset = 0; break
    }

    for (const i in p1) {
        svg += getSvgBody(p1_solo_offset + 470 * i, 0, p1[i])
    }

    if (p1_size > 0) {
        for (const i in p2) {
            const x = i % (4 - p1_size)
            const y = Math.floor(i / (4 - p1_size))

            svg += getSvgBody(470 * (x + p1_size), 195 * y, p2[i])
        }
    } else {
        for (const i in p2) {
            const x = i % 4
            const y = Math.floor(i / 4)

            svg += getSvgBody(470 * (x + p1_size), 195 * y, p2[i])
        }
    }

    return svg.toString()
}

async function drawVSCard(team_scores = [], enemy_scores = [], max_combo = 0, to_right = true) {
    if (isEmptyArray(team_scores)) return ''

    let svg = ''
    let p1 = []
    let p2 = []

    const e = enemy_scores.length

    let p1_size

    if (team_scores.length <= 2) {
        p1_size = team_scores.length
    } else if (team_scores.length <= 4) {
        p1_size = 1
    } else {
        p1_size = 0
    }

    for (const i in team_scores) {
        const s = team_scores[i]

        const compare = (e > 1) ? enemy_scores[Math.round(i / (team_scores.length - 1) * (e - 1))] : enemy_scores[0]

        const compare_score = (e > 0) ? (compare?.score || compare?.legacy_total_score || 0) : 0

        if (i < p1_size) {
            p1.push(await card_F2(s, max_combo, compare_score))
        } else {
            p2.push(await card_F3(s, max_combo, compare_score))
        }
    }

    const sign = (to_right === true) ? 1 : -1

    for (const i in p1) {
        svg += getSvgBody(470 * sign * i, 0, p1[i])
    }

    if (p1_size === 0) {
        for (const i in p2) {
            const x = i % 2
            const y = Math.floor(i / 2)

            svg += getSvgBody(470 * sign * x, 195 * y, p2[i])
        }
    } else {
        for (const i in p2) {
            svg += getSvgBody(470 * sign, 195 * i, p2[i])
        }
    }

    return svg.toString()
}