import {
    exportJPEG,
    setSvgBody,
    readTemplate,
    setText,
    getPanelNameSVG,
    setCustomBanner, getPanelHeight, getNowTimeStamp, getMatchDuration, isNotNull, isNotEmptyArray, getSvgBody, thenPush
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_F} from "../card/card_F.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {matchAnyMods} from "../util/mod.js";

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
                id: 0,
                start_time: '2024-11-23T13:24:27Z',
                end_time: '2024-11-23T14:30:06Z',
                name: ''
            },
            events: [
                [Object], [Object]
            ],
            users: [
                [Object],
            ],
            first_event_id: 2400727928,
            latest_event_id: 2400743601,
            name: '',
            id: 116281503,
            start_time: '2024-11-23T13:24:27Z',
            end_time: '2024-11-23T14:30:06Z',
            current_game_id: 605701082,
            is_match_end: true
        },
        player_data_list: [{
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
        },],
        round_count: 7,
        score_count: 56,
        player_count: 16,
        first_map_bid: 794779,
        is_team_vs: true,
        team_point_map: {red: 5, blue: 2},
        skip_ignore_map: {skip: 2, ignore: 0, easy: 0.5},
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
    const panel_name = getPanelNameSVG('Match Now (!ymmn)', 'MN', request_time);

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, null, reg_banner);

    // 导入成绩卡（C卡\
    const games = (data?.match?.events || []).filter(value => {
        return isNotNull(value.game) && isNotEmptyArray(value.game.scores)
    })

    const events = games.slice((data?.skip_ignore_map?.skip || 0), games.length - (data?.skip_ignore_map?.ignore || 0))

    let red_wins_before = 0;
    let blue_wins_before = 0;

    const event_Cs = []
    const param_Cs = []
    const card_Cs = []

    for (const v of events) {
        if (v?.game?.winning_team === 'red') {
            red_wins_before++;
        }

        if (v?.game?.winning_team === 'blue') {
            blue_wins_before++;
        }

        event_Cs.push(event2CardC(v, red_wins_before, blue_wins_before, data?.skip_ignore_map?.easy || 1))

        // card_Cs.push(await card_C(await event2CardC(v, red_wins_before, blue_wins_before)));
    }

    await Promise.allSettled(
        event_Cs
    ).then(results => thenPush(results, param_Cs))

    await Promise.allSettled(
        param_Cs.map((p) => {
            return card_F(p)
        })
    ).then(results => thenPush(results, card_Cs))

    let stringCs = ''

    for (const i in card_Cs) {
        stringCs += getSvgBody(510, 330 + i * 250, card_Cs[i])
    }

    svg = setText(svg, stringCs, reg_card_c)

    //导入谱面卡 A2卡
    const beatmap_arr = [];
    events.forEach(v => {
        beatmap_arr.push(v?.game?.beatmap)
    });

    const card_A2s = []

    await Promise.allSettled(
        beatmap_arr.map((b) => {
            return PanelGenerate.matchBeatMap2CardA2(b)
        })
    ).then(results => thenPush(results, card_A2s))

    let stringA2s = ''

    for (const i in card_A2s) {
        stringA2s += getSvgBody(40, 330 + i * 250, card_A2(card_A2s[i]));
    }

    svg = setText(svg, stringA2s, reg_card_a2)

    const panel_height = getPanelHeight(beatmap_arr?.length, 210, 1, 290, 40, 40)
    const background_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const matchInfo = card_A2(await PanelGenerate.matchRating2CardA2(data, beatmap_arr[0]));
    svg = setSvgBody(svg, 40, 40, matchInfo, reg_maincard);

    return svg.toString();
}

async function event2CardC(
    event = {
        id: 0,
        detail: {
            type: 'other',
            text: ''
        },
        timestamp: '2024-11-23T13:41:52Z',
        game: {},
        type: '',
        text: ''
    }
    , red_before = 0, blue_before = 0, easy = 1) {
    const round = event?.game || {}
    const scores = round?.scores || []

    let red_arr = [], blue_arr = [], none_arr = [];

    for (const v of scores) {
        const f = await score2LabelC2(v, easy);

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

    async function score2LabelC2(score = {}, easy = 1) {
        let s = score?.score || score?.legacy_total_score

        if (matchAnyMods(score?.mods, ["EZ"]) && easy !== 1) {
            s = Math.round(s * easy)
        }

        return {
            player_name: score?.user?.username, //妈的 为什么get match不给用户名啊
            player_avatar: score?.user?.avatar_url,
            player_score: s,
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
