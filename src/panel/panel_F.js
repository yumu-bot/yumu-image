import {
    getMatchDuration,
    getNowTimeStamp,
    getPanelHeight,
    getPanelNameSVG,
    getSvgBody,
    isNotEmptyArray,
    isNotNull,
    readTemplate,
    setCustomBanner,
    setSvgBody,
    setText,
    thenPush
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_F} from "../card/card_F.js";
import {PanelGenerate} from "../util/panelGenerate.js";

import {createImageRouter, createSvgRouter} from "../util/image.js";
import {avatars2Task, beatmapsets2Task, imageDownloader} from "../util/download.js";

export const router = createImageRouter(panel_F);

export const router_svg = createSvgRouter(panel_F);

/**
 * 对局面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_F(
    data = {
        match: {
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
        },

        panel: "QP"
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

    const {
        match: match, panel
    } = data ?? {}

    const {
        // MatchRating.match 是 Match（对局本体），events / users 挂在它上面
        match: {
            events: match_events,
            users: users,
        },
        // skip / ignore / easy 在 MatchRating 上，不在最外层的面板参数里
        skip_ignore_map,
    } = match ?? {}

    // 面板文字
    const request_time = 'match time: ' + getMatchDuration(match.match) + ' // request time: ' + getNowTimeStamp();

    // 临时的
    const qp_mode = panel?.includes("RP") ?? false

    let panel_name

    if (qp_mode) {
        panel_name = getPanelNameSVG('(Quick) Ranked Play (!ymrp)', 'RP', request_time);
    } else {
        panel_name = getPanelNameSVG('Match Now (!ymmn)', 'MN', request_time);
    }

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, null, reg_banner);

    // 导入成绩卡（C卡\
    const games = (match_events ?? []).filter(value => {
        return isNotNull(value.game) && isNotEmptyArray(value.game.scores)
    })

    const events = games.slice((skip_ignore_map?.skip || 0), games.length - (skip_ignore_map?.ignore || 0))

    //导入谱面卡 A2卡
    const beatmaps = [];

    events.forEach(v => {
        beatmaps.push(v?.game?.beatmap)
    });

    // 下载图片
    const promise_fs = avatars2Task(users)
    const promise_a2s = beatmapsets2Task(beatmaps)

    const tasks = [
        ...promise_fs,
        ...promise_a2s,
    ];

    const images = await imageDownloader(tasks);

    let red_wins_before = 0;
    let blue_wins_before = 0;

    const param_Fs = []
    const card_Fs = []

    for (const v of events) {
        if (v?.game?.winning_team === 'red') {
            red_wins_before++;
        }

        if (v?.game?.winning_team === 'blue') {
            blue_wins_before++;
        }

        param_Fs.push(event2ParamF(v, red_wins_before, blue_wins_before, images))
    }

    await Promise.allSettled(
        param_Fs.map((p) => {
            return card_F(p)
        })
    ).then(results => thenPush(results, card_Fs))

    const stringFs = card_Fs
        .map((card, i) => getSvgBody(510, 330 + i * 250, card))
        .join('\n');

    svg = setText(svg, stringFs, reg_card_c)

    const card_A2s = []

    await Promise.allSettled(
        beatmaps.map((b) => {
            return PanelGenerate.matchBeatMap2CardA2(b, images)
        })
    ).then(results => thenPush(results, card_A2s))

    const stringA2s = card_A2s.map((data, i) => {
        const posX = 40;
        const posY = 330 + i * 250;

        return getSvgBody(posX, posY, card_A2(data));
    }).join('\n');

    svg = setText(svg, stringA2s, reg_card_a2)

    const panel_height = getPanelHeight(beatmaps?.length, 210, 1, 290, 40, 40)
    const background_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const first_beatmap = beatmaps?.[0]

    const info_a2 = card_A2(await PanelGenerate.matchRating2CardA2(match, first_beatmap, false, images.get(`list@2x_${first_beatmap?.beatmapset?.id}`)));
    svg = setSvgBody(svg, 40, 40, info_a2, reg_maincard);

    return svg;
}

function event2ParamF(
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
    , red_before = 0, blue_before = 0, images = new Map()) {
    const round = event?.game || {}
    const scores = round?.scores || []

    let red_arr = [], blue_arr = [], none_arr = [];

    for (const v of scores) {
        const f = score2LabelF2(v, images);

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

    function score2LabelF2(score = {}, images = new Map()) {
        // 后端 MatchRating 已经把 easy 倍率乘进带 EZ 的成绩的 total_score 里了，
        // 这里直接用它（legacy_total_score 不会被调整，且 lazer 成绩的 legacy 是 0）。
        // 再乘一次会让 EZ 成绩偏小，和已按倍率计算的总分柱子对不上。
        const s = score?.total_score || score?.legacy_total_score || 0

        const user = score?.user

        return {
            player_name: user?.username,
            player_avatar: images.get(`avatar_${user.id}`) ?? user?.avatar_url,
            player_score: s,
            player_mods: score.mods,
            player_rank: score.ranking,
        }
    }

    return {
        statistics: {
            is_team_vs: round.team_type === 'team-vs',
            is_team_red_win: round.winning_team === 'red',
            is_team_blue_win: round.winning_team === 'blue',

            score_team_red: round.red_team_score,
            score_team_blue: round.blue_team_score,
            score_total: round.total_team_score,
            wins_team_red_before: red_before,
            wins_team_blue_before: blue_before,
        },
        red: red_arr,
        blue: blue_arr,
        none: none_arr,
    }
}
