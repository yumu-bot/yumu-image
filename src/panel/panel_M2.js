import {getPanelNameSVG, getSvg, getSvgBody, setSvgBody, setText, setTexts} from "../util/util.js";


import {createImageRouter, createSvgRouter} from "../util/image.js";
import {PanelColor} from "../util/color.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export const router = createImageRouter(panel_M2);

export const router_svg = createSvgRouter(panel_M2);

/**
 * 麻婆信息面板 v2, 展示麻婆谱面的
 * !im xxx
 * @param data
 * @return {Promise<string>}
 */
export async function panel_M2(data = {
    user: {},
    most_popular_beatmap: [{
        anime_cover: true,
        artist: 'Wang Rui',
        artist_unicode: '汪睿',
        availability: [Object],
        beatmaps: [Array],
        bpm: 162,
        can_be_hyped: false,
        covers: [Object],
        creator: 'Muziyami',
        discussion_locked: false,
        favourite_count: 503,
        genre_id: 5,
        has_leader_board: true,
        id: 1087774,
        is_scoreable: true,
        language_id: 4,
        last_updated: '2022-03-05T07:06:50+08:00',
        legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/1005413',
        mappers: [],
        nominations_summary: [Object],
        nominators: [],
        nsfw: false,
        offset: 0,
        pack_tags: [Array],
        play_count: 272162,
        preview_name: 'Wang Rui - Tao Hua Xiao (Muziyami)',
        preview_url: '//b.ppy.sh/preview/1087774.mp3',
        ranked: 1,
        ranked_date: '2022-03-13T17:42:04+08:00',
        rating: 9.4598,
        ratings: [Array],
        related_tags: [],
        source: '小女花不弃',
        spotlight: false,
        status: 'ranked',
        storyboard: true,
        submitted_date: '2020-01-02T14:41:13+08:00',
        tags: 'peach blossom cpop c-pop pop chinese 古风 oriental bilibili cover rearrangement 纳兰寻风 na lan xun feng 西门振 xi men zhen 青萝子 qing luo zi op opening xiao nv hua bu qi i will never let you go houshou hari dacaigou kisaki dahkjdas -ovo-',
        title: 'Tao Hua Xiao',
        title_unicode: '桃花笑',
        user_id: 7003013,
        video: false
    }],
    genre: [232, 85, 17, 35, 106, 5, 13, 1, 102, 7, 3, 40, 1],
    language: [222, 9, 111, 113, 101, 1, 0, 0, 0, 0, 0, 0, 0, 5],
    difficulty_arr: [90, 80, 125, 115, 56, 10, 1, 2],
    length_arr: [58, 115, 116, 49, 74, 42, 18, 7],
    recent_activity: [{
        approval: 'ranked',
        beatmapset: [Object],
        created_at: '2026-06-01T14:47:43Z',
        id: 1020995053,
        is_mapping: true,
        type: 'BeatmapsetApprove',
        user: [Object]
    }, {
        beatmapset: [Object],
        created_at: '2026-05-25T08:01:29Z',
        id: 1018343518,
        is_mapping: true,
        type: 'BeatmapsetUpdate',
        user: [Object]
    }],
    most_recent_ranked_beatmap: [{
        anime_cover: false,
        artist: 'MC MONG',
        artist_unicode: 'MC몽',
        availability: [Object],
        beatmaps: [Array],
        bpm: 122,
        can_be_hyped: false,
        covers: [Object],
        creator: 'Muziyami',
        discussion_locked: false,
        favourite_count: 26,
        genre_id: 5,
        has_leader_board: true,
        id: 2490202,
        is_scoreable: true,
        language_id: 6,
        last_updated: '2026-05-25T08:01:28+08:00',
        legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/2204922',
        mappers: [],
        nominations_summary: [Object],
        nominators: [],
        nsfw: false,
        offset: 0,
        pack_tags: [],
        play_count: 2578,
        preview_name: 'MC MONG - Sick Enough to Die (feat. Mellow) (Muziyami)',
        preview_url: '//b.ppy.sh/preview/2490202.mp3',
        ranked: 1,
        ranked_date: '2026-06-01T14:47:43+08:00',
        rating: 8.66667,
        ratings: [Array],
        related_tags: [],
        source: '',
        spotlight: false,
        status: 'ranked',
        storyboard: false,
        submitted_date: '2026-01-08T23:06:52+08:00',
        tags: 'siyuyuko blue brand 2nd trauma part 2 박장근 김건우 송기홍 korean pop kpop k-pop qq speed qq飞车 english mc夢 mc梦 신동현 shin donghyun hiphop hip hop electronic 节奏大 师 rhythm master 死一样的痛过',
        title: 'Sick Enough to Die (feat. Mellow)',
        title_unicode: '죽을 만큼 아파서 (feat. 멜로우)',
        user_id: 7003013,
        video: false
    }],
    most_recent_ranked_guest_diff: [{
        anime_cover: false,
        artist: 'Xeami',
        artist_unicode: '世阿弥',
        availability: [Object],
        beatmaps: [Array],
        bpm: 208,
        can_be_hyped: false,
        covers: [Object],
        creator: '09kami',
        discussion_locked: false,
        favourite_count: 33,
        genre_id: 6,
        has_leader_board: true,
        id: 2444103,
        is_scoreable: true,
        language_id: 5,
        last_updated: '2026-05-11T05:16:03+08:00',
        legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/2136492',
        mappers: [],
        nominations_summary: [Object],
        nominators: [],
        nsfw: false,
        offset: 0,
        pack_tags: [Array],
        play_count: 9688,
        preview_name: 'Xeami - Ryougen no Mai (09kami)',
        preview_url: '//b.ppy.sh/preview/2444103.mp3',
        ranked: 1,
        ranked_date: '2026-05-23T01:44:34+08:00',
        rating: 9.21429,
        ratings: [Array],
        related_tags: [],
        source: '太鼓の達人',
        spotlight: false,
        status: 'ranked',
        storyboard: false,
        submitted_date: '2025-10-03T11:06:20+08:00',
        tags: 'smallboat minakami yuki koiyuki flower pw384 regraz mafumafu muziyami _lai 太鼓の达人12 ド～ン！と増量版 清水达也 tatsh りょうげんのまい ryogen ナムコオリジナル cyanocitcho cryacho namco original video game music japanese instrumental zeami taiko no tatsujin [hatsune miku] sorairokarasu iroseka inazuma 384059043 electronic folk',
        title: 'Ryougen no Mai',
        title_unicode: '燎原ノ舞',
        user_id: 443031,
        video: false
    }],
    favorite: 2380,
    playcount: 2340576,
    guest_differs: [{
        user: [Object], received: 1, received_ranked: 0, sent: 5, sent_ranked: 5
    }, {
        user: [Object], received: 6, received_ranked: 5, sent: 0, sent_ranked: 0
    }, {
        user: [Object], received: 1, received_ranked: 0, sent: 5, sent_ranked: 5
    }, {
        user: [Object], received: 0, received_ranked: 0, sent: 5, sent_ranked: 5
    }, {
        user: [Object], received: 4, received_ranked: 4, sent: 4, sent_ranked: 0
    }, {
        user: [Object], received: 0, received_ranked: 0, sent: 5, sent_ranked: 4
    }, {
        user: [Object], received: 0, received_ranked: 0, sent: 4, sent_ranked: 3
    }],
    guest_bids: [
        5445153, 5605060, 5347107, 5412734, 4976441, 5278725,
        5295436, 3387258, 4996446, 5041682, 5031555, 3280425,
        4646728, 4653954, 3666991, 4642260, 2683150, 4390138,
        4637992, 4447713, 4362204, 3614185, 3365288, 4170619,
        2752762, 4005957, 4004662, 3919786, 3464150, 3211104,
        3672118, 3586860, 3411896, 3141864, 3035869, 3004678,
        3171783, 2900406, 2887638, 2968832, 2790736, 2640653,
        2514342, 2432816, 2443502, 2294936, 5638534, 5029351,
        4770363, 4305343, 4306580, 4170594, 4044309, 4168612,
        3810792, 3701403, 3637982, 3705697, 3596740, 3538721,
        3526890, 3549399, 3522611, 3419703, 3469122, 5088732,
        3210939, 3052527, 3276038, 3509000, 2947743, 2741221,
        3475819, 2635712, 2637309, 3323143, 2557829, 2438988,
        2371234, 2711177, 2353856, 2771581, 3096553, 2252242,
        2260115, 3639969, 2245215
    ],
    total_gds: 87,
    total_diffs: 479
}) {
    // 自设定义
    const has_custom_panel = false;

    const {
        user = {},
        most_popular_beatmap = [],
        recent_activity = [],
        most_recent_ranked_beatmap = [],
        guest_differs = [],
        favorite = 0,
        playcount = 0,
        total_gds = 0,
        total_diffs = 0,
        difficulty_arr = [],
        length_arr = []
    } = data;

    const hue = user?.profile_hue ?? 342

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PM2-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PM2-BG">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PM2-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="BannerBase">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: ${PanelColor.base(hue)}"/>
    </g>
    <g id="Banner">
        <g style="clip-path: url(#clippath-PM2-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="30" ry="30" style="fill: ${PanelColor.bottom(hue)};"/>
        <g filter="url(#blur-PM2-BG)" style="clip-path: url(#clippath-PM2-BG);">
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
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PM2-1\);">)/;
    const reg_component = /(?<=<g id="Component">)/;
    const reg_card_a1 = /(?<=<g id="Card_A1">)/
    const reg_background = /(?<=<g filter="url\(#blur-PM2-BG\)" style="clip-path: url\(#clippath-PM2-BG\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG("I'm Mapper v2", 'IM');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    const cardA1 = await card_A1(
        PanelGenerate.user2CardA1(user)
    );
    const componentM1 = component_M1(
        PanelMGenerate.attr2componentM1(
        user, total_gds, favorite, playcount, has_custom_panel, hue));

    // 导入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const bodyM1 = getSvgBody(40, 330, componentM1)

    svg = setTexts(svg, [bodyM1], reg_component);

    return svg
}

// yumu v4.0 规范，一切与面板强相关，并且基本不考虑复用的元素归类为组件，不占用卡片命名区域
const component_M1 = (
    data = {
        rank: 0,
        pending: 0,
        slot: 0,
        guest: 0,
        total: 0,
        favourite: 0,
        play_count: 0,

        has_custom_panel: false,
        hue: 342,
    }
) => {
    let svg = `<g id="Component_OM1">
    </g>`

    return svg
}

// 私有转换方式
const PanelMGenerate = {
    attr2componentM1: (user = {}, guest, total, favourite, play_count, has_custom_panel = false, hue) => {
        return {
            rank: user?.ranked_beatmapset_count ?? 0,
            pending: user?.pending_beatmapset_count ?? 0,
            slot: getPendingSlot(user?.is_supporter, user?.ranked_beatmapset_count),
            guest: guest ?? 0,
            total: total ?? 0,
            favourite: favourite ?? 0,
            play_count: play_count ?? 0,

            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    }
}



function getPendingSlot(isSupporter = false, ranked = 0) {
    let slot;
    if (isSupporter) {
        slot = 8 + Math.min(ranked, 12);
    } else {
        slot = 4 + Math.min(ranked, 4);
    }
    return slot;
}