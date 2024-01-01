import {
    exportJPEG,
    getExportFileV3Path,
    getMapBG, getMatchNameSplitted, getNowTimeStamp,
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
        MatchStat: {
            id: 111413376,
            name: 'Lazy2',
            start_time: 1700708849,
            end_time: null
        },
        MatchRound: {
            id: 577138928,
            mode: 'osu',
            mods: [],
            beatmap: {
                id: 1954530,
                mode: 'osu',
                status: 'loved',
                version: "JackT's Hyper",
                beatMapRating: 0,
                beatMapFailedCount: 0,
                beatMapRetryCount: 0,
                beatmapset_id: 778719,
                difficulty_rating: 3.48,
                total_length: 134,
                user_id: 12510704,
                beatmapset: [Object]
            },
            redTeamScore: 0,
            blueTeamScore: 0,
            totalTeamScore: 10097436,
            winningTeamScore: 2333618,
            winningTeam: 'none',
            beatmap_id: 1954530,
            start_time: 1701810083,
            end_time: 1701810240,
            mod_int: null,
            scoring_type: 'score',
            team_type: 'head-to-head',
            scores: [
                {
                    accuracy: 0.857397504456328,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 802544,
                    statistics: {
                        count_50: 14,
                        count_100: 55,
                        count_300: 300,
                        count_geki: 111,
                        count_katu: 39,
                        count_miss: 5
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 32516779,
                        pmOnly: false,
                        avatar_url: 'https://a.ppy.sh/32516779?1700814736.jpeg',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: false,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'UNK_CHaoticz',
                        country_code: 'DE',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 1,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 135,
                    mode_int: 0,
                    user_id: 32516779,
                    match: { slot: 1, team: 'none', pass: true },
                    user_name: 'UNK_CHaoticz'
                },
                {
                    accuracy: 0.6274509803921569,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: false,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 202562,
                    statistics: {
                        count_50: 18,
                        count_100: 110,
                        count_300: 195,
                        count_geki: 56,
                        count_katu: 63,
                        count_miss: 51
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 23326520,
                        pmOnly: false,
                        avatar_url: 'https://osu.ppy.sh/images/layout/avatar-guest.png',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: false,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'Hell12',
                        country_code: 'RU',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 2,
                    pass: false,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 77,
                    mode_int: 0,
                    user_id: 23326520,
                    match: { slot: 2, team: 'none', pass: false },
                    user_name: 'Hell12'
                },
                {
                    accuracy: 0.8827985739750446,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 2383898,
                    statistics: {
                        count_50: 1,
                        count_100: 63,
                        count_300: 309,
                        count_geki: 111,
                        count_katu: 53,
                        count_miss: 1
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 34895894,
                        pmOnly: false,
                        avatar_url: 'https://osu.ppy.sh/images/layout/avatar-guest.png',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: false,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: '2137gruby2137',
                        country_code: 'PL',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 3,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 356,
                    mode_int: 0,
                    user_id: 34895894,
                    match: { slot: 3, team: 'none', pass: true },
                    user_name: '2137gruby2137'
                },
                {
                    accuracy: 0.9786096256684492,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 6604066,
                    statistics: {
                        count_50: 0,
                        count_100: 12,
                        count_300: 362,
                        count_geki: 155,
                        count_katu: 11,
                        count_miss: 0
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 25473354,
                        pmOnly: true,
                        avatar_url: 'https://a.ppy.sh/25473354?1655166201.jpeg',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: true,
                        last_visit: [Array],
                        pm_friends_only: true,
                        username: '2G2BT',
                        country_code: 'RU',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 4,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 710,
                    mode_int: 0,
                    user_id: 25473354,
                    match: { slot: 4, team: 'none', pass: true },
                    user_name: '2G2BT'
                },
                {
                    accuracy: 0.8587344028520499,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 1085616,
                    statistics: {
                        count_50: 13,
                        count_100: 54,
                        count_300: 301,
                        count_geki: 111,
                        count_katu: 39,
                        count_miss: 6
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 8342913,
                        pmOnly: false,
                        avatar_url: 'https://a.ppy.sh/8342913?1700869393.jpeg',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: true,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'A Y A K A S H I',
                        country_code: 'DE',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 6,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 221,
                    mode_int: 0,
                    user_id: 8342913,
                    match: { slot: 6, team: 'none', pass: true },
                    user_name: 'A Y A K A S H I'
                },
                {
                    accuracy: 0.8560606060606061,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 1173954,
                    statistics: {
                        count_50: 7,
                        count_100: 63,
                        count_300: 298,
                        count_geki: 109,
                        count_katu: 47,
                        count_miss: 6
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 4646772,
                        pmOnly: false,
                        avatar_url: 'https://a.ppy.sh/4646772?1464856082.png',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: true,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'Nak0Nak0',
                        country_code: 'BG',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 7,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 207,
                    mode_int: 0,
                    user_id: 4646772,
                    match: { slot: 7, team: 'none', pass: true },
                    user_name: 'Nak0Nak0'
                },
                {
                    accuracy: 0.9090909090909091,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 1098342,
                    statistics: {
                        count_50: 0,
                        count_100: 33,
                        count_300: 329,
                        count_geki: 127,
                        count_katu: 28,
                        count_miss: 12
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 34063022,
                        pmOnly: false,
                        avatar_url: 'https://a.ppy.sh/34063022?1690637216.jpeg',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: true,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'Lynx050723',
                        country_code: 'GB',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 8,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 204,
                    mode_int: 0,
                    user_id: 34063022,
                    match: { slot: 8, team: 'none', pass: true },
                    user_name: 'Lynx050723'
                },
                {
                    accuracy: 0.9745989304812834,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'HD' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 3743617,
                    statistics: {
                        count_50: 1,
                        count_100: 10,
                        count_300: 361,
                        count_geki: 153,
                        count_katu: 10,
                        count_miss: 2
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 30037368,
                        pmOnly: false,
                        avatar_url: 'https://osu.ppy.sh/images/layout/avatar-guest.png',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: false,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'Simplesmina',
                        country_code: 'PL',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 9,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 458,
                    mode_int: 0,
                    user_id: 30037368,
                    match: { slot: 9, team: 'none', pass: true },
                    user_name: 'Simplesmina'
                },
                {
                    accuracy: 0.9269162210338681,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 1886022,
                    statistics: {
                        count_50: 4,
                        count_100: 36,
                        count_300: 334,
                        count_geki: 132,
                        count_katu: 31,
                        count_miss: 0
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 4054002,
                        pmOnly: false,
                        avatar_url: 'https://a.ppy.sh/4054002?1615214155.jpeg',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: false,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'Metaryu',
                        country_code: 'FR',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 10,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 284,
                    mode_int: 0,
                    user_id: 4054002,
                    match: { slot: 10, team: 'none', pass: true },
                    user_name: 'Metaryu'
                },
                {
                    accuracy: 0.9050802139037433,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [ 'HR' ],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 2017213,
                    statistics: {
                        count_50: 1,
                        count_100: 46,
                        count_300: 323,
                        count_geki: 123,
                        count_katu: 39,
                        count_miss: 4
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 9423808,
                        pmOnly: false,
                        avatar_url: 'https://a.ppy.sh/9423808?1576620171.jpeg',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: false,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'i3andres',
                        country_code: 'PA',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 11,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 312,
                    mode_int: 0,
                    user_id: 9423808,
                    match: { slot: 11, team: 'none', pass: true },
                    user_name: 'i3andres'
                },
                {
                    accuracy: 0.8770053475935828,
                    timestamp: null,
                    mode: 'OSU',
                    mods: [],
                    passed: true,
                    perfect: false,
                    pp: null,
                    rank: 'F',
                    replay: false,
                    score: 1827218,
                    statistics: {
                        count_50: 6,
                        count_100: 57,
                        count_300: 308,
                        count_geki: 115,
                        count_katu: 43,
                        count_miss: 3
                    },
                    type: 'legacy_match_score',
                    user: {
                        id: 15724782,
                        pmOnly: false,
                        avatar_url: 'https://a.ppy.sh/15724782?1667741796.jpeg',
                        default_group: 'default',
                        is_active: true,
                        is_bot: false,
                        is_deleted: false,
                        is_online: true,
                        is_supporter: false,
                        last_visit: [Array],
                        pm_friends_only: false,
                        username: 'Avania',
                        country_code: 'RU',
                        country: [Object]
                    },
                    ranking: null,
                    slot: 15,
                    pass: true,
                    team: 'none',
                    best_id: null,
                    id: null,
                    max_combo: 314,
                    mode_int: 0,
                    user_id: 15724782,
                    match: { slot: 15, team: 'none', pass: true },
                    user_name: 'Avania'
                }
            ]
        },
        index: 87
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

    // 面板文字
    const panel_name = getPanelNameSVG('Match Rounds (!ymmr)', 'MR', 'v0.4.0 UU', 'roundID: ' + data?.MatchRound?.id + ' // request time: ' + getNowTimeStamp());

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

    const isTeamVS = (data?.MatchRound?.team_type === "team-vs");

    const redTeamScore = data?.MatchRound?.redTeamScore || 0;
    const blueTeamScore = data?.MatchRound?.blueTeamScore || 0;
    const totalScore = data?.MatchRound?.totalTeamScore || 0;//isTeamVS ? redTeamScore + blueTeamScore : getTotalScore(noneArr);
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
        const hr4 = Math.floor(redArr.length / 2);
        const hb4 = Math.floor(blueArr.length / 2);

        const rr = redA1.length - hr4 * 2;
        const rb = blueA1.length - hb4 * 2;

        const h = Math.max(Math.ceil(redArr.length / 2), Math.ceil(blueArr.length / 2));
        panel_height += h * 250;
        background_height += h * 250;

        const hasRemain = (rr > 0 || rb > 0);

        //天选之子 好像只有 0 1 两种可能
        if (rr === 1) {
            svg = implantCardA1(svg, redA1[0], reg_bodycard, 1, 1, 1, 'red');
        }

        //天选之子 好像只有 0 1 两种可能
        if (rb === 1) {
            svg = implantCardA1(svg, blueA1[0], reg_bodycard, 1, 1, 1, 'blue');
        }

        for (let i = 0; i < hr4; i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j + rr;
                svg = implantCardA1(svg, redA1[index], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 2, 'red');
            }
        }

        for (let i = 0; i < hb4; i++) {
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
        const h4 = Math.floor(noneA1.length / 4);
        const r = noneA1.length - (h4 * 4);
        const hasRemain = (r > 0);

        panel_height += Math.ceil(noneA1.length / 4) * 250;
        background_height += Math.ceil(noneA1.length / 4) * 250;

        //天选之子 有 1,2,3
        if (r > 0) {
            for (let m = 0; m < r; m++) {
                svg = implantCardA1(svg, noneA1[m], reg_bodycard, 1, m + 1,  r, 'none');
            }
        }

        for (let i = 0; i < h4; i++) {
            for (let j = 0; j < 4; j++) {
                const index = r + i * 4 + j;
                svg = implantCardA1(svg, noneA1[index], reg_bodycard, hasRemain ? (i + 2) : (i + 1), j + 1, 4, 'none');
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
                case 1: startX = 745; break;
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
    const b = beatmapMods || [];
    const arr = b.concat(scoreMods).sort();

    let out = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== out[out.length - 1]) {
            out.push(arr[i]);
        }
    }
    return out;
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
        ...beatmapLite,
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

    let right3b;
    let right3m = '';

    if (round.winningTeam != null) {
        if (isTeamVS) {
            if (redTeamScore > blueTeamScore) {
                right1 = ' << ' + (redTeamScore - blueTeamScore) + ' << ';
            } else if (redTeamScore < blueTeamScore) {
                right1 = ' >> ' + (redTeamScore - blueTeamScore) + ' >> ';
            } else {
                right1 = ' << 0 >> '
            }
            right2 = redTeamScore + ' - ' + blueTeamScore;
            right3b = '';
            right3m = round.winningTeam + ' wins';
        } else {
            right1 = 'Players ' + round?.scores?.length;
            right2 = 'Total ' + totalScore;
            right3b = 'h2h';
        }
    } else {
        right1 = 'd ' + Math.abs(redTeamScore - blueTeamScore);
        right2 = redTeamScore + ' - ' + blueTeamScore;
        right3b = 'draw';
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
        right3b: right3b,
        right3m: right3m,
        isTeamVS: isTeamVS,
    };
}