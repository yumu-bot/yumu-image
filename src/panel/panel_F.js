import {
    exportJPEG,
    implantSvgBody,
    readTemplate,
    replaceText,
    getPanelNameSVG,
    putCustomBanner, getPanelHeight, getNowTimeStamp, getMatchDuration, isNotNull, isNotEmptyArray
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
export async function panel_F(
    data = {
        match: {
            match: {
                id: 116281503,
                start_time: '2024-11-23T13:24:27Z',
                end_time: '2024-11-23T14:30:06Z',
                name: 'FRDT: (喜欢我的话请给我钱吧) vs (我们站在桥上看风景)'
            },
            events: [
                [Object], [Object]
            ],
            users: [
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object]
            ],
            first_event_id: 2400727928,
            latest_event_id: 2400743601,
            name: 'FRDT: (喜欢我的话请给我钱吧) vs (我们站在桥上看风景)',
            id: 116281503,
            start_time: '2024-11-23T13:24:27Z',
            end_time: '2024-11-23T14:30:06Z',
            current_game_id: 605701082,
            is_match_end: true
        },
        player_data_list: [
            {
                player: [Object],
                team: 'red',
                total: 7131318,
                era: 2.409392955909547,
                dra: 3.32713040312523,
                mra: 2.684714190074252,
                rws: 0.2635810036318896,
                ranking: 1,
                win: 5,
                lose: 2,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'red',
                total: 979179,
                era: 2.241279980893068,
                dra: 0.45214934420171227,
                mra: 1.7045407898856613,
                rws: 0.321379691072398,
                ranking: 2,
                win: 1,
                lose: 0,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 4676598,
                era: 1.5253184232645483,
                dra: 2.121219335121382,
                mra: 1.7040886968215982,
                rws: 0.12662065991089874,
                ranking: 3,
                win: 2,
                lose: 4,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'red',
                total: 1498317,
                era: 1.4568271569878393,
                dra: 0.6882058564108698,
                mra: 1.2262407668147484,
                rws: 0.2792749071999805,
                ranking: 4,
                win: 2,
                lose: 0,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 2734480,
                era: 1.2026700431760864,
                dra: 1.2363866435735449,
                mra: 1.212785023295324,
                rws: 0.09589009752078287,
                ranking: 5,
                win: 2,
                lose: 2,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'red',
                total: 1674484,
                era: 0.9370008858904217,
                dra: 0.8175143553483543,
                mra: 0.9011549267278014,
                rws: 0.14010494803606763,
                ranking: 6,
                win: 2,
                lose: 1,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'red',
                total: 2609236,
                era: 0.7343125839609195,
                dra: 1.222937809497593,
                mra: 0.8809001516219215,
                rws: 0.14493501439913356,
                ranking: 7,
                win: 4,
                lose: 1,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 2206038,
                era: 0.816201190923976,
                dra: 1.0234658758355475,
                mra: 0.8783805963974475,
                rws: 0.06334786626225819,
                ranking: 8,
                win: 1,
                lose: 3,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'red',
                total: 3065247,
                era: 0.6420163626673259,
                dra: 1.3912509879016661,
                mra: 0.8667867502376279,
                rws: 0.12637293863535617,
                ranking: 9,
                win: 4,
                lose: 2,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 613499,
                era: 1.015316628611717,
                dra: 0.28329158460139187,
                mra: 0.7957091154086193,
                rws: 0,
                ranking: 10,
                win: 0,
                lose: 1,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 1493264,
                era: 0.7826617513149234,
                dra: 0.7537407675786031,
                mra: 0.7739854561940273,
                rws: 0,
                ranking: 11,
                win: 0,
                lose: 3,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 1473871,
                era: 0.596783365506359,
                dra: 0.6769350268669793,
                mra: 0.6208288639145451,
                rws: 0.11159444886673577,
                ranking: 12,
                win: 1,
                lose: 2,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'red',
                total: 967789,
                era: 0.6398033636415603,
                dra: 0.46314071555183595,
                mra: 0.586804569214643,
                rws: 0.1111516025878635,
                ranking: 13,
                win: 1,
                lose: 1,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'red',
                total: 978393,
                era: 0.5020406404849433,
                dra: 0.425191286239161,
                mra: 0.4789858342112086,
                rws: 0.07473635800633968,
                ranking: 14,
                win: 1,
                lose: 1,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 413943,
                era: 0.4335165257525749,
                dra: 0.20315749109752268,
                mra: 0.3644088153560592,
                rws: 0,
                ranking: 15,
                win: 0,
                lose: 1,
                player_class: [Object],
                arc: 7
            },
            {
                player: [Object],
                team: 'blue',
                total: 2046514,
                era: 0.0648581410141856,
                dra: 0.9142825170486069,
                mra: 0.31968545382451197,
                rws: 0.044756806467039334,
                ranking: 16,
                win: 2,
                lose: 4,
                player_class: [Object],
                arc: 7
            }
        ],
        round_count: 7,
        score_count: 56,
        player_count: 16,
        first_map_bid: 794779,
        is_team_vs: true,
        team_point_map: {red: 5, blue: 2},
        average_star: 6.1233713286263605
    }
) {
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

    // 导入成绩卡（C卡\
    const events = (data?.match?.events || []).filter(value => {
        return isNotNull(value.game) && isNotEmptyArray(value.game.scores)
    })

    const card_Cs = [];
    let redWins = 0;
    let blueWins = 0;

    for (const v of events) {
        if (v.winning_team === 'red') {
            redWins++;
        }

        if (v.winning_team === 'blue') {
            blueWins++;
        }

        card_Cs.push(await card_C(await event2CardC(v, redWins, blueWins)));
    }

    for (const i in card_Cs) {
        svg = implantSvgBody(svg, 510, 330 + i * 250, card_Cs[i], reg_card_c)
    }

    //导入谱面卡 A2卡
    const beatmap_arr = [];
    events.forEach(v => {
        beatmap_arr.push(v?.game?.beatmap)
    });


    const panel_height = getPanelHeight(beatmap_arr?.length, 210, 1, 330, 40, 40)
    const background_height = panel_height - 290;

    for (const i in beatmap_arr) {
        const b = await card_A2(await PanelGenerate.matchBeatMap2CardA2(beatmap_arr[i]));
        svg = implantSvgBody(svg, 40, 330 + i * 250, b, reg_card_a2);
    }

    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const matchInfo = await card_A2(await PanelGenerate.matchRating2CardA2(data, beatmap_arr[0]));
    svg = implantSvgBody(svg, 40, 40, matchInfo, reg_maincard);

    return svg.toString();
}

async function event2CardC(
    event = {
        id: 2400731946,
        detail: {type: 'other', text: 'FRDT: (喜欢我的话请给我钱吧) vs (我们站在桥上看风景)'},
        timestamp: '2024-11-23T13:41:52Z',
        game: {
            id: 605697970,
            beatmap: {},
            beatmap_id: 794779,
            start_time: '2024-11-23T13:41:52Z',
            end_time: '2024-11-23T13:44:07Z',
            mode_int: 0,
            mods: ['NF'],
            scores: [
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object]
            ],
            team_type: 'team-vs',
            scoring_type: 'scorev2',
            mode: 'OSU',
            winning_team_score: 3046798,
            winning_team: 'red',
            is_team_vs: true
        },
        type: 'Other',
        text: 'FRDT: (喜欢我的话请给我钱吧) vs (我们站在桥上看风景)'
    }
    , red_before = 0, blue_before = 0) {
    const round = event?.game || {}
    const scores = round?.scores || []

    let red_arr = [], blue_arr = [], none_arr = [];

    for (const v of scores) {
        const f = await score2LabelC2(v);

        switch (v?.match?.team) {
            case 'red':
                red_arr.push(f);
                break;
            case 'blue':
                blue_arr.push(f);
                break;
            default :
                none_arr.push(f);
                break;
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
            is_team_red_win: round.winning_team === 'red', //如果不是team vs，这个值默认false
            is_team_blue_win: round.winning_team === 'blue', //如果不是team vs，这个值默认false

            score_team_red: round.red_team_score,
            score_team_blue: round.blue_team_score,
            score_total: round.total_team_score,
            wins_team_red_before: red_before, //这局之前红赢了几局？从0开始，不是 team vs 默认0
            wins_team_blue_before: blue_before,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0
        },
        red: red_arr,
        blue: blue_arr,
        none: none_arr,
    }
}
