import {createImageRouter, createSvgRouter} from "../util/image.js";
import {readTemplate, setSvgBody} from "../util/util.js";
import {card_F4} from "../card/card_F4.js";
import {avatars2Task, beatmapset2Task, imageDownloader} from "../util/download.js";

export const router = createImageRouter(panel_F4);

export const router_svg = createSvgRouter(panel_F4);

/**
 * 每轮的比赛对局面板
 * @param data
 * @return {Promise<string>}
 */


async function panel_F4(
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
    const {
        match, round, panel
    } = data

    const {
        team_type, beatmap, scores = [], winning_team,
        red_team_score = 0, blue_team_score = 0, total_team_score = 0
    } = round

    const {
        max_combo = 0
    } = beatmap

    const {
        match: stat
    } = match?.match;

    const {
        end_time, start_time
    } = stat

    const users = scores.map((score) => {return score.user})

    const promise_f4s = avatars2Task(users)
    const promise_a2 = beatmapset2Task(beatmap)

    const tasks = [
        ...promise_f4s,
        promise_a2
    ]

    const images = await imageDownloader(tasks);

    const f4 = card_F4(scores[0], 100, 20000000, 500000, 0.96, 30000000, images.get(`avatar_${scores[0].user.id}`))

    svg = setSvgBody(svg, 40, 330, f4, reg_bodycard)

    return svg
}