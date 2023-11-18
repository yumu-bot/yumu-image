import {
    exportJPEG,
    getExportFileV3Path,
    getMapBG, getMatchNameSplitted,
    getPanelNameSVG, getRoundedNumberStr,
    implantImage,
    implantSvgBody, readTemplate,
    replaceText,
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getMapAttributes} from "../util/compute-pp.js";
import {getModInt} from "../util/mod.js";
import moment from "moment";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        console.log(data)
        const svg = await panel_F2(data);
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
        const svg = await panel_F2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_F2(
    data = {
        index: 3,
        MatchStat: {
            id: 59438351,
            name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
            start_time: 1584793502,
            end_time: 1584799428
        },
        MatchRound: {
            id: 310431873,
            mode: 'osu',
            mods: ['NF', 'HD'],
            beatmap: {
                id: 907200,
                mode: 'osu',
                status: 'ranked',
                version: 'Moroi',
                beatMapRetryCount: 0,
                beatMapFailedCount: 0,
                beatMapRating: 0,
                beatmapset_id: 419189,
                difficulty_rating: 4.67,
                total_length: 209,
                user_id: 134572,
                beatmapset: [Object]
            },
            winningTeamScore: 1018967,
            winningTeam: 'red',
            beatmap_id: 907200,
            start_time: 1584794973,
            end_time: 1584795193,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            scores: [
                {
                    accuracy: 0.9076956333765672,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'NF', 'HD' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 295886,
                    statistics: {
                        count_50: 1,
                        count_100: 89,
                        count_300: 670,
                        count_geki: 76,
                        count_katu: 54,
                        count_miss: 11
                    },
                    type: 'legacy_match_score',
                    best_id: null,
                    id: null,
                    max_combo: 401,
                    mode_int: 0,
                    user_id: 6073139,
                    match: { slot: 0, team: 'blue', pass: true },
                    user_name: 'CamelliNya'
                },
                {
                    accuracy: 0.9327712926934717,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'NF', 'HD' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 389974,
                    statistics: {
                        count_50: 1,
                        count_100: 72,
                        count_300: 695,
                        count_geki: 86,
                        count_katu: 47,
                        count_miss: 3
                    },
                    type: 'legacy_match_score',
                    best_id: null,
                    id: null,
                    max_combo: 414,
                    mode_int: 0,
                    user_id: 11355787,
                    match: { slot: 1, team: 'blue', pass: true },
                    user_name: 'na-gi'
                },
                {
                    accuracy: 0.909641158668396,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'NF', 'HD' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 204872,
                    statistics: {
                        count_50: 12,
                        count_100: 70,
                        count_300: 676,
                        count_geki: 82,
                        count_katu: 36,
                        count_miss: 13
                    },
                    type: 'legacy_match_score',
                    best_id: null,
                    id: null,
                    max_combo: 185,
                    mode_int: 0,
                    user_id: 8742486,
                    match: { slot: 2, team: 'blue', pass: true },
                    user_name: '- Rainbow -'
                },
                {
                    accuracy: 0.8590575010808473,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'NF', 'HD' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 185232,
                    statistics: {
                        count_50: 14,
                        count_100: 141,
                        count_300: 613,
                        count_geki: 49,
                        count_katu: 72,
                        count_miss: 3
                    },
                    type: 'legacy_match_score',
                    best_id: null,
                    id: null,
                    max_combo: 231,
                    mode_int: 0,
                    user_id: 8926316,
                    match: { slot: 3, team: 'red', pass: true },
                    user_name: 'Mars New'
                },
                {
                    accuracy: 0.817769130998703,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'NF', 'HD' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 470213,
                    statistics: {
                        count_50: 3,
                        count_100: 207,
                        count_300: 561,
                        count_geki: 45,
                        count_katu: 89,
                        count_miss: 0
                    },
                    type: 'legacy_match_score',
                    best_id: null,
                    id: null,
                    max_combo: 851,
                    mode_int: 0,
                    user_id: 714369,
                    match: { slot: 4, team: 'red', pass: true },
                    user_name: 'GreySTrip_VoV'
                },
                {
                    accuracy: 0.9329874621703416,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'NF', 'HD' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 363522,
                    statistics: {
                        count_50: 10,
                        count_100: 53,
                        count_300: 700,
                        count_geki: 92,
                        count_katu: 37,
                        count_miss: 8
                    },
                    type: 'legacy_match_score',
                    best_id: null,
                    id: null,
                    max_combo: 452,
                    mode_int: 0,
                    user_id: 10436444,
                    match: { slot: 5, team: 'red', pass: true },
                    user_name: 'No rank'
                }
            ]
        }
    }
    , reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_F2.svg');

    // 路径定义
    const reg_height = '${height}'
    const reg_panelheight = '${panelheight}'
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_bodycard = /(?<=<g id="BodyCard">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PF-2\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Match Rounds (!ymmr)', 'MR', 'v0.3.2 FT');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 导入玩家卡（A1 的同时计算面板高度和背景高度
    let panel_height = 330;
    let background_height = 40;

    const scoreArr = data.MatchRound.scores || [];
    let redArr = [], blueArr = [], noneArr = [];

    scoreArr.forEach(
        (v) => {
            switch (v.match.team) {
                case 'red': redArr.push(v); break;
                case 'blue': blueArr.push(v); break;
                default : noneArr.push(v); break;
            }
        }
    )

    const isTeamVS = (data.MatchRound.team_type === "team-vs");

    const redTeamScore = isTeamVS ? getTotalScore(redArr) : 0;
    const blueTeamScore = isTeamVS ? getTotalScore(blueArr) : 0;
    const totalScore = isTeamVS ? redTeamScore + blueTeamScore : getTotalScore(noneArr);
    const playerCount = scoreArr.length;

    if (isTeamVS) {
        let redA1 = [];
        let blueA1 = [];

        for (const v of redArr) {
            v.total_score = totalScore;
            v.total_player = playerCount;
            const f = await card_A1(await PanelGenerate.score2CardA1(v), true);
            redA1.push(f);
        }

        for (const v of blueArr) {
            v.total_score = totalScore;
            v.total_player = playerCount;
            const f = await card_A1(await PanelGenerate.score2CardA1(v), true);
            blueA1.push(f);
        }

        //计算高度
        const hr = Math.ceil(redArr.length / 2);
        const hb = Math.ceil(blueArr.length / 2);
        const h = Math.max(hr, hb);
        panel_height += h * 250;
        background_height += h * 250;

        const rr = h * 2 - redA1.length;
        const rb = h * 2 - blueA1.length;

        const hasRemain = (rr > 0 || rb > 0);

        //天选之子 好像只有 0 1 两种可能
        if (rr === 1) {
            svg = implantCardA1(svg, redA1[0], reg_bodycard, 1, 1, 1, 'red');
        }

        //天选之子 好像只有 0 1 两种可能
        if (rb === 1) {
            svg = implantCardA1(svg, blueA1[0], reg_bodycard, 1, 1, 1, 'blue');
        }

        for (let i = 0; i < (rr > 0 ? (hr - 1) : hr); i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j + rr;
                svg = implantCardA1(svg, redA1[index], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 2, 'red');
            }
        }

        for (let i = 0; i < (rb > 0 ? (hb - 1) : hb); i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j + rb;
                svg = implantCardA1(svg, blueA1[index], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 2, 'blue');
            }
        }

    } else {
        let noneA1 = [];

        for (const v of noneArr) {
            v.total_score = totalScore;
            v.total_player = playerCount;
            const f = await card_A1(await PanelGenerate.score2CardA1(v), true);
            noneA1.push(f);
        }

        //计算高度
        const h = Math.ceil(noneA1.length / 4);
        const r = h * 4 - noneA1.length;
        const hasRemain = (r > 0);

        panel_height += h * 250;
        background_height += h * 250;

        //天选之子 有 1,2,3
        if (r > 0) {
            for (let m = 0; m < r; m++) {
                svg = implantCardA1(svg, noneA1[m], reg_bodycard, 1, m + 1,  r, 'none');
            }
        }

        for (let i = 0; i < (hasRemain ? (h - 1) : h); i++) {
            for (let j = 0; j < 4; j++) {
                const index = i * 4 + j;
                svg = implantCardA1(svg, noneA1[index + r], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 4, 'none');
            }
        }
    }

    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 这里是渲染真实的谱面
    const beatmap = await getBeatmapAttr(data.MatchRound.beatmap, getRoundMods(data.MatchRound?.mods, data.MatchRound?.scores[0]?.mods))

    // 导入比赛简介卡（A2卡
    const f = await card_A2(await roundInfo2CardA2(data.MatchStat, data.MatchRound,
        redTeamScore, blueTeamScore, totalScore, data.index, beatmap.background), true);
    svg = implantSvgBody(svg, 40, 40, f, reg_maincard);

    // 导入谱面（A2卡
    const b = await card_A2(await PanelGenerate.matchBeatmap2CardA2(beatmap), true);
    svg = implantSvgBody(svg, 1450, 40, b, reg_maincard);

    return svg.toString();
}

//渲染单张卡片
function implantCardA1(svg, replace, reg, row = 1, column = 1, maxColumn = 1, team = 'red') {
    let startX = 40;

    switch (team) {
        case "red": {
            switch (maxColumn) {
                case 1: startX = 275; break;
                case 2: startX = 40; break;
            }
        } break;
        case "blue": {
            switch (maxColumn) {
                case 1: startX = 1215; break;
                case 2: startX = 980; break;
            }
        } break;
        case "none": {
            switch (maxColumn) {
                case 1: startX = 715; break;
                case 2: startX = 510; break;
                case 3: startX = 275; break;
                case 4: startX = 40; break;
            }
        } break;
    }

    const x = startX + 470 * (column - 1);
    const y = 330 + 250 * (row - 1);

    svg = implantSvgBody(svg, x, y, replace, reg);
    return svg;
}

function getRoundMods(beatmapMods, scoreMods) {

}

async function getBeatmapAttr(beatmapLite = {}, mods = []) {
    if (!beatmapLite) {
        return {
            background: getExportFileV3Path('beatmap-DLfailBG.jpg'),
            title: 'Deleted Map',
            artist: '?',
            mapper: '?', //creator
            difficulty: '?',
            status: '',

            bid: 0,
            star_rating: 0,
            cs: 0,
            ar: 0,
            od: 0,
            mode: null,
        }
    }

    const attr = await getMapAttributes(beatmapLite.id, getModInt(mods));

    const cs = getRoundedNumberStr(attr.cs, 2);
    const ar = getRoundedNumberStr(attr.ar, 2);
    const od = getRoundedNumberStr(attr.od, 2);
    const mode = beatmapLite.mode ? beatmapLite.mode.toLowerCase() : 'osu';

    return {
        background: await getMapBG(beatmapLite.beatmapset.sid, 'list@2x', !beatmapLite.beatmapset.ranked),
        title: beatmapLite.beatmapset.title,
        artist: beatmapLite.beatmapset.artist,
        mapper: beatmapLite.beatmapset.creator, //creator
        difficulty: beatmapLite.version,
        status: beatmapLite.status,

        bid: beatmapLite.id,
        star_rating: attr.stars,
        cs: cs,
        ar: ar,
        od: od,
        mode: mode,
    }
}

async function roundInfo2CardA2(stat = {
    id: 59438351,
    name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
    start_time: 1584793502,
    end_time: 1584799428
}, round = {
    id: 310431873,
    mode: 'osu',
    mods: ['NF', 'HD'],
    winningTeamScore: 1018967,
    winningTeam: 'red',
    beatmap_id: 907200,
    start_time: 1584794973,
    end_time: 1584795193,
    mod_int: null,
    scoring_type: 'scorev2',
    team_type: 'team-vs',}, redTeamScore, blueTeamScore, totalScore, index = 0, background) {
    const isTeamVS = (round?.team_type === 'team-vs');

    const isContainVS = stat.name.toLowerCase().match('vs');
    let title, title1, title2;
    if (isContainVS) {
        title = getMatchNameSplitted(stat.name);
        title1 = title[0];
        title2 = title[1] + ' vs ' + title[2];
    } else {
        title1 = stat.name;
        title2 = '';
    }

    let left1 = 'R ' + (index + 1);
    const mods = round?.mods || [];

    if (mods.length > 0) {
        left1 += ' +';
        mods.forEach(v => {
            left1 = left1 + v.toString() + ' '
        });
        left1 = left1.trim();
    }

    let left2;
    if (stat.end_time) {
        left2 = moment(stat.start_time, 'X').format('HH:mm') + '-' + moment(stat.end_time, 'X').format('HH:mm');
    } else {
        left2 = moment(stat.start_time, 'X').format('HH:mm') + '-continuing';
    }

    const left3 = moment(stat.start_time, 'X').format('YYYY/MM/DD');

    let right1;
    let right2;

    let right3m;

    if (round.winningTeam != null) {
        if (isTeamVS) {
            right1 = 'Difference ' + Math.abs(redTeamScore - blueTeamScore);
            right2 = redTeamScore + ' - ' + blueTeamScore;
            right3m = round.winningTeam + ' win';
        } else {
            right1 = 'Players ' + round?.scores?.length;
            right2 = 'Total ' + totalScore;
            right3m = 'h2h';
        }
    } else {
        right1 = 'd ' + Math.abs(redTeamScore - blueTeamScore);
        right2 = redTeamScore + ' - ' + blueTeamScore;
        right3m = 'draw';
    }


    return {
        background: background,
        map_status: '',

        title1: title1,
        title2: title2,
        title_font: 'PuHuiTi',
        left1: left1,
        left2: left2,
        left3: left3,
        right1: right1,
        right2: right2,
        right3b: '',
        right3m: right3m,
        isTeamVS: isTeamVS,
    };
}

function getTotalScore(arr = []) {
    let r = 0;
    for (const v of arr) {
        r += (v?.score || 0);
    }
    return r;
}