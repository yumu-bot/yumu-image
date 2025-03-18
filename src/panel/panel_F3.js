import {
    exportJPEG, getAvatar, getFormattedTime, getImageFromV3,
    getMapBG, getNowTimeStamp,
    getPanelNameSVG, implantImage,
    implantSvgBody, isEmptyArray, isNotNull, readTemplate,
    replaceText, replaceTexts, round, rounds, transformSvgBody,
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRankBG, hasLeaderBoard} from "../util/star.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMultipleTextPath, poppinsBold} from "../util/font.js";
import {getUserRankColor} from "../util/color.js";
import {getModRRectPath} from "../util/mod.js";

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
export async function panel_F3(
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
        panel_name = getPanelNameSVG('Round Results v2 (passive module)', 'RR', 'v0.5.1 DX', request_time);
    } else {
        panel_name = getPanelNameSVG('Match Rounds v2 (!ymmr)', 'MR', 'v0.5.1 DX', request_time);
    }

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index)

    // 定义模式
    const is_team_vs = (round.team_type === 'team-vs' || round.team_type === '')

    // 导入比赛简介卡（A2卡
    const f = card_A2(await PanelGenerate.matchRating2CardA2(match, round.beatmap, false)); // await PanelGenerate.roundInfo2CardA2(round, stat.name, team_point_map, stat.id, data.index)
    svg = implantSvgBody(svg, 40, 40, f, reg_maincard);

    // 导入谱面（A2卡
    const b = card_A2(await PanelGenerate.matchBeatMap2CardA2(round?.beatmap));
    svg = implantSvgBody(svg, 1450, 40, b, reg_maincard);

    // 导入身体卡片
    svg = implantSvgBody(svg, 0, 330, drawScoreBanner(round, is_team_vs), reg_bodycard)

    /*
    svg = implantSvgBody(svg, 40, 490, await card_P2(round.scores[0], round.beatmap.max_combo, round.scores[0].score), reg_bodycard)

     */

    const reds = round.scores.filter(s => {
        return s.match.team === 'red'
    })
    const blues = round.scores.filter(s => {
        return s.match.team === 'blue'
    })

    svg = implantSvgBody(svg, 0, 450, await drawBodyCard(is_team_vs, reds, blues, round.scores, round.beatmap.max_combo), reg_index)

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, await getMapBG(round?.beatmap.beatmapset_id, 'cover', hasLeaderBoard(round?.beatmap.beatmapset.ranked)), reg_banner);

    const card_height = is_team_vs ?
        (Math.max(reds.length, blues.length) > 6 ?
            (Math.ceil((Math.max(reds.length, blues.length) - 6) / 2) * 195 + 790) : 790) :
        (round.scores.length > 12 ? (195 + 790) : 790)

    svg = replaceText(svg, card_height + (1080 - 790), reg_panelheight);
    svg = replaceText(svg, card_height, reg_height);

    return svg.toString();
}

async function card_P1(match_score = {}, max_combo = 0, compare_score = 0) {
    // 读取模板
    let svg = `   
        <defs>
        <clipPath id="clippath-CP1-1">
            <circle cx="215" cy="205" r="150" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-CP1-2">
            <rect x="0" y="0" rx="20" ry="20" width="430" height="550" style="fill: none;"/>
        </clipPath>
        <filter id="inset-shadow-CP1-1" height="150%" width="150%" x="-25%" y="-25%" filterUnits="userSpaceOnUse">
            <feFlood flood-color="#000"/>
            <feComposite in2="SourceGraphic" operator="out"/>
            <feMorphology operator="dilate" radius="10" />
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
            <feComposite in2="SourceGraphic" operator="atop"/>
        </filter>
        <filter id="blur-CP1-1" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
        </defs>
          <g id="Base_CP1">
            <rect x="0" y="0" rx="20" ry="20" width="430" height="550" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CP1-2);" filter="url(#blur-CP1-1)">
            </g>
          </g>
          <g id="Shadow_CP1" style="clip-path: url(#clippath-CP1-1);" filter="url(#inset-shadow-CP1-1)">
            <circle cx="215" cy="205" r="150" style="fill: #fff;"/>
            <g style="clip-path: url(#clippath-CP1-1);">
            </g>
          </g>
          <g id="Mod_CP1">
          </g>
          <g id="Text_CP1">
          </g>`;

    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CP1-2\);" filter="url\(#blur-CP1-1\)">)/
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CP1-1\);">)/
    const reg_text = /(?<=<g id="Text_CP1">)/
    const reg_mod = /(?<=<g id="Mod_CP1">)/

    svg = implantImage(svg, 300, 300, 65, 55, 1, await getAvatar(match_score?.user?.avatar_url || match_score?.user_id, true), reg_avatar)

    svg = implantImage(svg, 430, 550, 0, 0, 0.6, getRankBG(match_score?.rank, match_score?.match?.pass), reg_background)

    const name = poppinsBold.getTextPath(poppinsBold.cutStringTail(match_score?.user?.username, 48, 430), 430 / 2, 426, 48, 'center baseline', '#fff')

    const ranking = PanelDraw.Rect(20, 26, 84, 48, 20, getUserRankColor(match_score?.ranking))
        + getMultipleTextPath([{
                font: poppinsBold,
                text: (match_score?.ranking || 0).toString(),
                size: 40,
                color: '#fff',
            }, {
                font: poppinsBold,
                text: getOrdinal(match_score?.ranking || 0),
                size: 30,
                color: '#fff',
            },
        ], 62, 64, 'center baseline')

    const rank = getImageFromV3(`object-score-${match_score?.rank}2.png`)

    svg = implantImage(svg, 90, 90, 330, 10, 1, rank, reg_text)

    const judge_data = getMatchScoreAdvancedJudge(match_score, max_combo)

    const judge = PanelDraw.Rect(20, 332, 84, 40, 20, judge_data.color)
        + poppinsBold.getTextPath(judge_data.judge, 62, 362, 30, 'center baseline', '#fff')

    const miss_count = poppinsBold.getTextPath(match_score?.statistics?.count_miss || 0, 366, 362, 30, 'right baseline', '#fff')

    svg = implantImage(svg, 32, 32, 372, 336, 1, getImageFromV3('object-hit0.png'), reg_text)

    const score_score = rounds(match_score?.score || 0, -4)

    const score = getMultipleTextPath([
        {
            font: poppinsBold,
            text: score_score.integer,
            size: 56,
            color: '#fff',
        }, {
            font: poppinsBold,
            text: score_score.decimal,
            size: 40,
            color: '#fff',
        },
    ], 430 / 2, 490, 'center baseline')

    const delta_data = getDeltaScore(match_score?.score || 0, compare_score || 0)
    const delta_score = rounds(delta_data.delta, -4)

    const delta = getMultipleTextPath([
        {
            font: poppinsBold,
            text: delta_data.sign + delta_score.integer,
            size: 30,
            color: delta_data.color,
        }, {
            font: poppinsBold,
            text: delta_score.decimal,
            size: 24,
            color: delta_data.color,
        },
    ], 430 / 2, 530, 'center baseline')

    const mods = (match_score?.mods || [])
        .filter(it => it !== "NF")
    let mods_path = ''

    if (mods.length === 0) mods.push("NM")

    const interval = mods.length > 3 ? 45 : 90
    const x_offset = (430 - (mods.length * interval - 6)) / 2

    mods.forEach((mod, index) => {
        const x = x_offset + interval * index

        mods_path += getModRRectPath(mod, x, 332, 84, 42, 20, 32, poppinsBold, 30)
    })

    svg = replaceText(svg, mods_path, reg_mod)

    svg = replaceTexts(svg, [name, ranking, judge, miss_count, score, delta], reg_text)

    return svg.toString()
}


async function card_P2(match_score = {}, max_combo = 0, compare_score = 0) {
    // 读取模板
    let svg = `   
        <defs>
        <clipPath id="clippath-CP2-1">
            <circle cx="80" cy="80" r="65" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-CP2-2">
            <rect x="0" y="0" rx="20" ry="20" width="430" height="160" style="fill: none;"/>
        </clipPath>
        <filter id="inset-shadow-CP2-1" height="150%" width="150%" x="-25%" y="-25%" filterUnits="userSpaceOnUse">
            <feFlood flood-color="#000"/>
            <feComposite in2="SourceGraphic" operator="out"/>
            <feMorphology operator="dilate" radius="5" />
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            <feComposite in2="SourceGraphic" operator="atop"/>
        </filter>
        <filter id="blur-CP2-1" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
        </defs>
          <g id="Base_CP2">
            <rect x="0" y="0" rx="20" ry="20" width="430" height="160" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CP2-2);" filter="url(#blur-CP2-1)">
            </g>
          </g>
          <g id="Shadow_CP2" style="clip-path: url(#clippath-CP2-1);" filter="url(#inset-shadow-CP2-1)">
            <circle cx="80" cy="80" r="65" style="fill: #fff;"/>
            <g style="clip-path: url(#clippath-CP2-1);">
            </g>
          </g>
          <g id="Mod_CP2">
          </g>
          <g id="Text_CP2">
          </g>`;

    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CP2-2\);" filter="url\(#blur-CP2-1\)">)/
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CP2-1\);">)/
    const reg_text = /(?<=<g id="Text_CP2">)/
    const reg_mod = /(?<=<g id="Mod_CP2">)/

    svg = implantImage(svg, 130, 130, 15, 15, 1, await getAvatar(match_score?.user?.avatar_url || match_score?.user_id, true), reg_avatar)

    svg = implantImage(svg, 430, 160, 0, 0, 0.6, getRankBG(match_score?.rank, match_score?.match?.pass), reg_background)

    const name = poppinsBold.getTextPath(poppinsBold.cutStringTail(match_score?.user?.username, 36, 270), 160, 48, 36, 'left baseline', '#fff')

    const ranking = PanelDraw.Rect(15, 15, 50, 25, 12.5, getUserRankColor(match_score?.ranking))
        + getMultipleTextPath(
            [{
                font: poppinsBold,
                text: (match_score?.ranking || 0).toString(),
                size: 24,
                color: '#fff'
            }, {
                font: poppinsBold,
                text: getOrdinal(match_score?.ranking || 0),
                size: 16,
                color: '#fff'
            }
            ],
            40, 36, 'center baseline'
        )

    const rank = getImageFromV3(`object-score-${match_score?.rank}2.png`)

    svg = implantImage(svg, 90, 90, 340, 70, 1, rank, reg_text)

    const judge_data = getMatchScoreAdvancedJudge(match_score, max_combo)

    /*

    const judge = PanelDraw.Rect(160, 62, 84, 40, 20, judge_data.color)
        + poppinsBold.getTextPath(judge_data.judge, 202, 94, 30, 'center baseline', '#fff')

     */

    const judge = PanelDraw.Rect(15, 120, 50, 25, 12.5, judge_data.color)
        + poppinsBold.getTextPath(judge_data.judge, 40, 140, 22, 'center baseline', '#fff')

    const miss = match_score?.statistics?.count_miss || 0
    const miss_count = poppinsBold.getTextPath(miss >= 1000 ? round(miss, 1, -1) : miss, 306, 94, 30, 'right baseline', '#fff')

    svg = implantImage(svg, 32, 32, 310, 66, 1, getImageFromV3('object-hit0.png'), reg_text)

    const score_score = rounds(match_score?.score || 0, -4)

    const score = getMultipleTextPath([
        {
            font: poppinsBold,
            text: score_score.integer,
            size: 40,
            color: '#fff',
        }, {
            font: poppinsBold,
            text: score_score.decimal,
            size: 30,
            color: '#fff',
        },
    ], 160, 144, 'left baseline')

    const delta_data = getDeltaScore(match_score?.score || 0, compare_score || 0)
    const delta_score = round(delta_data.delta, -4)

    const delta = poppinsBold.getTextPath(delta_data.sign + delta_score, 340, 114, 18, 'right baseline', delta_data.color)

    const mods = (match_score?.mods || [])
        .filter(it => it !== "NF")

    if (mods.length === 0) mods.push("NM")

    let mods_path = ''

    /*
    mods.forEach((mod, index) => {
        const x = 25 + 15 * index
        mods_path += getModCirclePath(mod, x, 135, 10, true)
    })
     */

    const interval = mods.length > 2 ? 20 : 30

    mods.forEach((mod, index) => {
        const x = 160 + interval * index

        mods_path += getModRRectPath(mod, x, 64, 70, 40, 20, 30, poppinsBold, 30)
    })

    svg = replaceText(svg, mods_path, reg_mod)

    svg = replaceTexts(svg, [name, ranking, judge, miss_count, score, delta], reg_text)

    return svg.toString()
}


function getMatchScoreAdvancedJudge(match_score = {}, max_combo = 0) {
    const stat = match_score?.statistics || {}

    const is_perfect = match_score?.rank === 'X' || match_score?.rank === 'XH'
    const is_fc = (match_score?.perfect === true) || (match_score?.perfect === 1)
    const is_almost_fc = match_score.max_combo > max_combo * 0.9
    const is_mania_fc = (match_score.mode_int === 3 && stat?.count_50 === 0 && stat?.count_100 === 0)

    let judge
    let color

    if (match_score.rank === 'F') {
        judge = 'L'
        color = '#9E040D'
    } else if (is_perfect) {
        judge = 'PF'
        color = '#FF9800'
    } else if (is_fc) {
        judge = 'FC+'
        color = '#B3D465'
    } else if (stat?.count_miss === 0) {
        if (is_almost_fc || is_mania_fc) {
            judge = 'FC'
            color = '#009944'
        } else {
            judge = 'FC-'
            color = '#B7AB00'
        }
    } else if (is_almost_fc || is_mania_fc) {
        judge = 'C+'
        color = '#00A1E9'
    } else {
        judge = 'C'
        color = '#0068B7'
    }

    return {
        judge: judge,
        color: color
    }
}

function getDeltaScore(score = 0, compare = 0) {
    return {
        sign: (score < compare) ? '-' : '+',
        delta: Math.abs(score - compare),
        color: (score < compare) ? '#ffcdd2' : '#c2e5c3',
    }
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

        left_rrect = PanelDraw.GradientRect(-40, 0, 980, 120, 20, [
            {
                offset: "0%",
                color: "#801D34",
                opacity: 1,
            }, {
                offset: "100%",
                color: "#E50050",
                opacity: 1,
            },
        ], left_opacity, {
            x1: "20%",
            y1: "0%",
            x2: "80%",
            y2: "0%",
        })

        // PanelDraw.Rect(-40, 0, 980, 120, 20, '#E50050', left_opacity)

        right_rrect = PanelDraw.GradientRect(980, 0, 980, 120, 20, [
            {
                offset: "0%",
                color: "#00A0E9",
                opacity: 1,
            }, {
                offset: "100%",
                color: "#006899",
                opacity: 1,
            },
        ], right_opacity, {
            x1: "20%",
            y1: "0%",
            x2: "80%",
            y2: "0%",
        })

        // PanelDraw.Rect(980, 0, 980, 120, 20, '#00A0E9', right_opacity)

        left_text = poppinsBold.getTextPath((winning_team === 'red') ? 'WIN!' : ((winning_team === null) ? 'TIE...' : 'LOSE...'),
            40, 84, 72, 'left baseline', '#fff', 0.5)
        right_text = poppinsBold.getTextPath((winning_team === 'blue') ? 'WIN!' : ((winning_team === null) ? 'TIE...' : 'LOSE...'),
            1880, 84, 72, 'right baseline', '#fff', 0.5)

        const rs = rounds(round.red_team_score, -4)
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

        const bs = rounds(round.blue_team_score, -4)
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
        left_rrect = PanelDraw.GradientRect(-40, 0, 980, 120, 20, [
            {
                offset: "0%",
                color: "#ccc",
                opacity: 1,
            }, {
                offset: "100%",
                color: "#fff",
                opacity: 1,
            },
        ], 0.6, {
            x1: "20%",
            y1: "0%",
            x2: "80%",
            y2: "0%",
        })

        // PanelDraw.Rect(-40, 0, 980, 120, 20, '#fff', 0.2)
        right_rrect = PanelDraw.GradientRect(980, 0, 980, 120, 20, [
            {
                offset: "0%",
                color: "#fff",
                opacity: 1,
            }, {
                offset: "100%",
                color: "#ccc",
                opacity: 1,
            },
        ], 0.8, {
            x1: "20%",
            y1: "0%",
            x2: "80%",
            y2: "0%",
        })
            //PanelDraw.Rect(980, 0, 980, 120, 20, '#fff', 0.4)

        left_text = poppinsBold.getTextPath('TOTAL', 40, 84, 72, 'left baseline', '#fff', 0.5)
        right_text = poppinsBold.getTextPath('AVERAGE', 1880, 84, 72, 'right baseline', '#fff', 0.5)

        const ts = rounds(round.total_team_score, -4)
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

        const as = rounds((round.total_team_score / round.scores.length) || 0, -4)
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

        return transformSvgBody(510, 40, await drawVSCard(reds, blues, max_combo, false))
            + transformSvgBody(980, 40, await drawVSCard(blues, reds, max_combo, true))
    } else {
        return transformSvgBody(40, 40, await drawH2HCard(scores, max_combo))
    }
}

async function drawH2HCard(scores = [], max_combo = 0) {
    if (isEmptyArray(scores)) return ''

    let svg = ''
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

    const compare_score = (scores?.length > 2) ? scores[0].score : Math.max.apply(Math, scores.map(v => {return v?.score}))

    for (const i in scores) {
        const s = scores[i]

        if (i < p1_size) {
            p1.push(await card_P1(s, max_combo, compare_score))
        } else {
            p2.push(await card_P2(s, max_combo, compare_score))
        }
    }

    let p1_solo_offset
    switch (length) {
        case 1: p1_solo_offset = 960 - 430 / 2 - 40; break
        case 2: p1_solo_offset = 960 - 430 - 60; break
        case 3: p1_solo_offset = 960 - 430 * 3 / 2 - 80; break
        default: p1_solo_offset = 0; break
    }

    for (const i in p1) {
        svg += transformSvgBody(p1_solo_offset + 470 * i, 0, p1[i])
    }

    if (p1_size > 0) {
        for (const i in p2) {
            const x = i % (4 - p1_size)
            const y = Math.floor(i / (4 - p1_size))

            svg += transformSvgBody(470 * (x + p1_size), 195 * y, p2[i])
        }
    } else {
        for (const i in p2) {
            const x = i % 4
            const y = Math.floor(i / 4)

            svg += transformSvgBody(470 * (x + p1_size), 195 * y, p2[i])
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
        const compare_score = (e >= 1) ? (enemy_scores[Math.round(i / (team_scores.length - 1) * (e - 1))]?.score || 0) : 0

        if (i < p1_size) {
            p1.push(await card_P1(s, max_combo, compare_score))
        } else {
            p2.push(await card_P2(s, max_combo, compare_score))
        }
    }

    const sign = (to_right === true) ? 1 : -1

    for (const i in p1) {
        svg += transformSvgBody(470 * sign * i, 0, p1[i])
    }

    if (p1_size === 0) {
        for (const i in p2) {
            const x = i % 2
            const y = Math.floor(i / 2)

            svg += transformSvgBody(470 * sign * x, 195 * y, p2[i])
        }
    } else {
        for (const i in p2) {
            svg += transformSvgBody(470 * sign, 195 * i, p2[i])
        }
    }

    return svg.toString()
}

/**
 * 获取序数词
 * @param number
 * @returns {string}
 */
function getOrdinal(number = 1) {
    switch (number) {
        case 11: case 12: case 13: return 'th'
        default: {
            switch (number % 10) {
                case 1: return 'st'
                case 2: return 'nd'
                case 3: return 'rd'
                default: return 'th'
            }
        }
    }
}