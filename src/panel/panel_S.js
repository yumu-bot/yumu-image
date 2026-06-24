import {createImageRouter, createSvgRouter} from "../util/image.js";
import {PanelColor} from "../util/color.js";
import {getAvatar, getPanelNameSVG, setText} from "../util/util.js";
import {beatmapset2Task, imageDownloader, toTask, user2Task} from "../util/download.js";

export const router = createImageRouter(panel_S);

export const router_svg = createSvgRouter(panel_S);


/**
 * 快速匹配信息面板
 * !ri xxx
 * @param data
 * @return {Promise<string>}
 */
export async function panel_S(data = {
    user: {}, recently: [{
        duration: 488, room_id: 3056562, players: [7003013, 11925374], wins: [2, 1],

        rounds: [{
            list_id: 36598725, beatmap_id: 3221246, beatmapset_id: 1496234, difficulty_rating: 5.08154, covers: {
                cover: 'https://assets.ppy.sh/beatmaps/1496234/covers/cover.jpg?1633531234',
                'cover@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/cover@2x.jpg?1633531234',
                card: 'https://assets.ppy.sh/beatmaps/1496234/covers/card.jpg?1633531234',
                'card@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/card@2x.jpg?1633531234',
                list: 'https://assets.ppy.sh/beatmaps/1496234/covers/list.jpg?1633531234',
                'list@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/list@2x.jpg?1633531234',
                slimcover: 'https://assets.ppy.sh/beatmaps/1496234/covers/slimcover.jpg?1633531234',
                'slimcover@2x': 'https://assets.ppy.sh/beatmaps/1496234/covers/slimcover@2x.jpg?1633531234',
                fullsize: 'https://assets.ppy.sh/beatmaps/1496234/covers/fullsize.jpg?1633531234'
            }, scores: [[Object], [Object]], winner: 11925374
        }, {
            list_id: 36598939, beatmap_id: 2794531, beatmapset_id: 1349715, difficulty_rating: 5.56279, covers: {
                cover: 'https://assets.ppy.sh/beatmaps/1349715/covers/cover.jpg?1650706242',
                'cover@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/cover@2x.jpg?1650706242',
                card: 'https://assets.ppy.sh/beatmaps/1349715/covers/card.jpg?1650706242',
                'card@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/card@2x.jpg?1650706242',
                list: 'https://assets.ppy.sh/beatmaps/1349715/covers/list.jpg?1650706242',
                'list@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/list@2x.jpg?1650706242',
                slimcover: 'https://assets.ppy.sh/beatmaps/1349715/covers/slimcover.jpg?1650706242',
                'slimcover@2x': 'https://assets.ppy.sh/beatmaps/1349715/covers/slimcover@2x.jpg?1650706242',
                fullsize: 'https://assets.ppy.sh/beatmaps/1349715/covers/fullsize.jpg?1650706242'
            }, scores: [[Object], [Object]], winner: 7003013
        }, {
            list_id: 36599062, beatmap_id: 848586, beatmapset_id: 377930, difficulty_rating: 5.32558, covers: {
                cover: 'https://assets.ppy.sh/beatmaps/377930/covers/cover.jpg?1740230999',
                'cover@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/cover@2x.jpg?1740230999',
                card: 'https://assets.ppy.sh/beatmaps/377930/covers/card.jpg?1740230999',
                'card@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/card@2x.jpg?1740230999',
                list: 'https://assets.ppy.sh/beatmaps/377930/covers/list.jpg?1740230999',
                'list@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/list@2x.jpg?1740230999',
                slimcover: 'https://assets.ppy.sh/beatmaps/377930/covers/slimcover.jpg?1740230999',
                'slimcover@2x': 'https://assets.ppy.sh/beatmaps/377930/covers/slimcover@2x.jpg?1740230999',
                fullsize: 'https://assets.ppy.sh/beatmaps/377930/covers/fullsize.jpg?1740230999'
            }, scores: [[Object], [Object]], winner: 7003013
        }]
    }, {duration: 309, room_id: 3056481, rounds: [Array]}, {
        duration: 516,
        room_id: 3056394,
        rounds: [Array]
    }, {duration: 603, room_id: 3056273, rounds: [Array]}],

    stats: {
        play_time: 6424,
        map_count: 41,
        average_combo: 429,
        average_difficulty: 5.41,
        average_accuracy: 0.9131573170731703
    },

    surrounding: [{
        id: 10023264,
        username: 'Yorukah',
        country: [Object],
        wins: 12,
        playcount: 16,
        rating: 1643,
        rank: 9669,
        absolute_rank: 9669,
        provisional: false
    }, {
        id: 25395114,
        username: 'RJA',
        country: [Object],
        wins: 8,
        playcount: 14,
        rating: 1643,
        rank: 9670,
        absolute_rank: 9670,
        provisional: false
    }, {
        id: 17537769,
        username: 'krkz',
        country: [Object],
        wins: 8,
        playcount: 14,
        rating: 1643,
        rank: 9671,
        absolute_rank: 9671,
        provisional: true
    }, {
        id: 7003013,
        username: 'Muziyami',
        country: [Object],
        wins: 9,
        playcount: 14,
        rating: 1643,
        rank: 9672,
        absolute_rank: 9672,
        provisional: false
    }, {
        id: 19995212,
        username: 'paced',
        country: [Object],
        wins: 8,
        playcount: 13,
        rating: 1643,
        rank: 9673,
        absolute_rank: 9673,
        provisional: false
    }, {
        id: 15543581,
        username: 'ClemouDouard',
        country: [Object],
        wins: 7,
        playcount: 13,
        rating: 1643,
        rank: 9674,
        absolute_rank: 9674,
        provisional: false
    }, {
        id: 17621384,
        username: 'Seriak',
        country: [Object],
        wins: 6,
        playcount: 12,
        rating: 1643,
        rank: 9675,
        absolute_rank: 9675,
        provisional: false
    }], rating: 1.1240942774099782, total_players: 96500
}) {
    const {
        user = {},
        recently = [],
        stats = {},
        surrounding = [],
        rating = 0,
        total_players = 0,
    } = data

    const hue = user?.profile_hue ?? 342

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PS-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PS-BG">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PS-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PS-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PS-BG)" style="clip-path: url(#clippath-PS-BG);">
        </g>
    </g>
    <g id="Component">
    </g>
    <g id="Card_A1">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: ${PanelColor.middle(hue)};"/>
    </g>
    <g id="Index">
    </g>
</svg>`

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PS-1\);">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/

    // 面板文字
    const panel_name = getPanelNameSVG("Ranked Play Info", 'RI');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 下图
    const promised_a1s = user2Task(user)

    const promise_s2s = beatmapset2Task(recently.flatMap(r => r.rounds), 'list')

    const promise_s1s = recently.flatMap(
        r => r.rounds
            .flatMap(rs => rs.scores)
            .map(ss => ss.user))
        .map(u => toTask('avatar', u.id,
            () => getAvatar(u))
        )

    const promise_s3s = surrounding.map(u => toTask('avatar', u.id,
        () => getAvatar(u.id))
    )

    const tasks = [
        ...promised_a1s,
        ...promise_s2s,
        ...promise_s1s,
        ...promise_s3s
    ];

    const images = await imageDownloader(tasks);

    return svg
}