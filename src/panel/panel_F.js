import {
    exportJPEG,
    implantSvgBody,
    readTemplate,
    replaceText,
    getPanelNameSVG,
    putCustomBanner, getPanelHeight, getNowTimeStamp, getMatchDuration
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_C} from "../card/card_C.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_F(data);
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
        const svg = await panel_F(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 对局面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_F(data = {
    match: {
        matchEnd: true,
        match: {
            name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
            id: 59438351,
            start_time: 1584793502,
            end_time: 1584799428
        },
        events: [],
        users: [],
        first_event_id: 1361962243,
        latest_event_id: 1362015297,
        current_game_id: null
    },
    matchData: {
        teamVs: true,
        averageStar: 5.236081123352051,
        firstMapSID: 1001507,
        playerDataList: [],
        teamPointMap: { red: 8, blue: 5 },
        roundCount: 13,
        playerCount: 11,
        scoreCount: 82
    },
    rounds: [
        {
            mode: 'osu',
            mods: [],
            winningTeamScore: 505657,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310430020,
            beatmap_id: 2167576,
            start_time: 1584794145,
            end_time: 1584794439,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [],
            winningTeamScore: 686658,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310431140,
            beatmap_id: 1567613,
            start_time: 1584794644,
            end_time: 1584794783,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1018967,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310431873,
            beatmap_id: 907200,
            start_time: 1584794973,
            end_time: 1584795193,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1457248,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310432805,
            beatmap_id: 1501761,
            start_time: 1584795377,
            end_time: 1584795619,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1788145,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310433743,
            beatmap_id: 1649420,
            start_time: 1584795772,
            end_time: 1584795985,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1380483,
            teamScore: [Object],
            winningTeam: 'blue',
            id: 310434904,
            beatmap_id: 1557405,
            start_time: 1584796255,
            end_time: 1584796405,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1946290,
            teamScore: [Object],
            winningTeam: 'blue',
            id: 310435821,
            beatmap_id: 1058266,
            start_time: 1584796652,
            end_time: 1584796909,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1814300,
            teamScore: [Object],
            winningTeam: 'blue',
            id: 310437250,
            beatmap_id: 2127734,
            start_time: 1584797232,
            end_time: 1584797394,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [],
            winningTeamScore: 1951160,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310438019,
            beatmap_id: 169090,
            start_time: 1584797543,
            end_time: 1584797702,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1732445,
            teamScore: [Object],
            winningTeam: 'blue',
            id: 310438890,
            beatmap_id: 1624962,
            start_time: 1584797898,
            end_time: 1584798149,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 2283324,
            teamScore: [Object],
            winningTeam: 'blue',
            id: 310440193,
            beatmap_id: 1714705,
            start_time: 1584798418,
            end_time: 1584798567,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [Array],
            winningTeamScore: 1806035,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310440938,
            beatmap_id: 1674896,
            start_time: 1584798716,
            end_time: 1584798848,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        },
        {
            mode: 'osu',
            mods: [],
            winningTeamScore: 1146381,
            teamScore: [Object],
            winningTeam: 'red',
            id: 310441611,
            beatmap_id: 1000684,
            start_time: 1584798967,
            end_time: 1584799293,
            mod_int: null,
            scoring_type: 'scorev2',
            team_type: 'team-vs',
            beatmap: [Object],
            scores: [Array]
        }
    ],
    scores: [],
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_F.svg');

    // 路径定义
    let reg_height = '${height}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PF-1\);">)/;
    let reg_card_c = /(?<=<g id="CardC">)/;
    let reg_card_a2 = /(?<=<g id="CardA2">)/;

    // 面板文字
    const request_time = 'match time: ' + getMatchDuration(data?.match) + ' // request time: ' + getNowTimeStamp();
    const panel_name = getPanelNameSVG('Match Now (!ymmn)', 'MN', 'v0.5.0 DX', request_time);

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = putCustomBanner(svg, reg_banner);

    // 导入成绩卡（C卡

    let card_Cs = [];
    let redWins = 0;
    let blueWins = 0;

    for (const v of data?.rounds) {
        if (v.winningTeam === 'red') {
            redWins ++;
        }

        if (v.winningTeam === 'blue') {
            blueWins ++;
        }

        card_Cs.push(await card_C(await round2CardC(v, redWins, blueWins)));
    }

    for (const i in card_Cs) {
        svg = implantSvgBody(svg, 510, 330 + i * 250, card_Cs[i], reg_card_c)
    }

    //导入谱面卡 A2卡
    const rounds = data?.rounds || [];

    let beatmap_arr = [];
    rounds.forEach(v => {beatmap_arr.push(v?.beatmap)});


    const panel_height = getPanelHeight(beatmap_arr?.length, 210, 1, 330, 40, 40)
    let background_height = panel_height - 290;

    for (const i in beatmap_arr) {
        const b = await card_A2(await PanelGenerate.matchBeatMap2CardA2(beatmap_arr[i]));
        svg = implantSvgBody(svg, 40, 330 + i * 250, b, reg_card_a2);
    }

    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const matchInfo = await card_A2(await PanelGenerate.matchCal2CardA2(data));
    svg = implantSvgBody(svg,40,40, matchInfo, reg_maincard);

    return svg.toString();
}

async function round2CardC(round = {}
    , red_before = 0, blue_before = 0) {

    const scoreArr = round?.scores || [];
    let redArr = [], blueArr = [], noneArr = [];

    for (const v of scoreArr) {
        const f = await score2LabelC2(v);

        switch (v?.match?.team) {
            case 'red': redArr.push(f); break;
            case 'blue': blueArr.push(f); break;
            default : noneArr.push(f); break;
        }
    }

    async function score2LabelC2(score = {}) {
        return {
            player_name: score?.user?.username, //妈的 为什么get match不给用户名啊
            player_avatar: score?.user?.avatar_url,
            player_score: score.score,
            player_mods: score.mods,
            player_rank: score.ranking, //一局比赛里的分数排名，1v1或者team都一样
        }
    }

    return {
        statistics: {
            is_team_vs: round.team_type === 'team-vs', // TFF表示平局，当然，这个很少见
            is_team_red_win: round.winningTeam === 'red', //如果不是team vs，这个值默认false
            is_team_blue_win: round.winningTeam === 'blue', //如果不是team vs，这个值默认false

            score_team_red: round?.teamScore?.red,
            score_team_blue: round?.teamScore?.blue,
            score_total: round?.teamScore?.total,
            wins_team_red_before: red_before, //这局之前红赢了几局？从0开始，不是 team vs 默认0
            wins_team_blue_before: blue_before,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0
        },
        red: redArr,
        blue: blueArr,
        none: noneArr,
    }
}
