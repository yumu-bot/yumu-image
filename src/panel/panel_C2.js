import {
    floor,
    floors,
    getFormattedTime,
    getNowTimeStamp,
    getPanelHeight,
    getPanelNameSVG,
    getSvgBody,
    readNetImage,
    readTemplate,
    setImage,
    setSvgBody,
    setText,
    setTexts
} from "../util/util.js";
import {card_C} from "../card/card_C.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";

import {ADVANCED_IMAGE_FORMAT, createImageRouter, createSvgRouter} from "../util/image.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {avatars2Task, beatmapset2Task, imageDownloader} from "../util/download.js";
import {isNotEmptyString, splitMatchName} from "../util/text.js";

export const router = createImageRouter(panel_C2, undefined, ADVANCED_IMAGE_FORMAT);
export const router_svg = createSvgRouter(panel_C2);

/**
 * 系列斗力 SRA
 * @param data
 * @return {Promise<string>}
 */
export async function panel_C2(data = {

    matches: [{
        match: [Object],
        events: [Array],
        users: [Array],
        first_event_id: 2436785566,
        latest_event_id: 2436803356,
        end_time: '2025-05-10T13:48:12Z',
        id: 118049637,
        is_match_end: true,
        name: 'YHC: (對) vs (89岁扶墙打串)',
        start_time: '2025-05-10T12:20:12Z'
    }, {
        match: [Object],
        events: [Array],
        users: [Array],
        first_event_id: 2436781472,
        latest_event_id: 2436803687,
        end_time: '2025-05-10T13:49:37Z',
        id: 118049393,
        is_match_end: true,
        name: 'YHC: (萌萌图大队) vs(断幺一番一千点)',
        start_time: '2025-05-10T11:58:43Z'
    }],
    average_star: 5.281768560409546,
    first_map_bid: 646713,
    first_map_sid: 286460,
    is_team_vs: true,
    match_count: 2,
    player_count: 22,
    player_data_list: [{
        player: [Object],
        arc: 20,
        dra: 2.198817088146556,
        era: 2.135328439379976,
        lose: 7,
        mra: 2.15437503400995,
        player_class: [Object],
        ranking: 1,
        rws: 0.08384404108162359,
        team: 'blue',
        total: 6397735,
        win: 2
    }, ],
    round_count: 20,
    score_count: 127,
    statistics: {
        id: 118049393,
        start_time: '2025-05-10T11:58:43Z',
        end_time: '2025-05-10T13:49:37Z',
        name: 'YHC: (萌萌图大队) vs(断幺一番一千点)...'
    }
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    const {
        matches = [],
        player_data_list = [],
    } = data;

    const first_set = (matches?.[0]?.events ?? [])?.find(e => e.beatmap_id != null)?.beatmap?.beatmapset ?? {}

    const users = player_data_list.map(p => p.player) ?? []

    // 路径定义
    let reg_card_height = '${cardheight}'
    let reg_panel_height = '${panelheight}'
    let reg_main_card = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;

    // 面板文字
    const start_time = getFormattedTime(data?.statistics?.start_time, 'YYYY/MM/DD HH:mm')
    const end_time = getFormattedTime(data?.statistics?.end_time, 'YYYY/MM/DD HH:mm')
    const request_time = 'series duration: ' + start_time + ' - ' + end_time + ' // request time: ' + getNowTimeStamp();

    const panel_name = getPanelNameSVG('Yumu Series Rating v3.5 (!ymsa)', 'SA', request_time);

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 预加载
    const promise_a2 = beatmapset2Task(first_set)
    const promise_cs = avatars2Task(users)

    const tasks = [promise_a2, ...promise_cs];

    const images = await imageDownloader(tasks);

    // 导入A2卡
    const series_a2 = card_A2(await seriesRating2CardA2(data, images.get(`list@2x_${first_set.id}`)));

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.7);
    svg = setSvgBody(svg, 40, 40, series_a2, reg_main_card);

    // 导入H卡
    /**
     *
     * @type {string[]}
     */
    let card_cs = [];

    let arr = [...player_data_list]

    //渲染不在队伍（无队伍）
    const none_row = Math.floor(arr.length / 2) + 1;
    const lucky_dog = (arr.length % 2 === 1) ? arr.pop() : null;

    for (let i = 0; i < arr.length; i += 2) {
        for (let j = 0; j < 2; j++) {
            card_cs.push(cardC2Svg(PanelGenerate.matchPlayer2CardC(arr[i + j], true, images, false, true), i / 2 + 1, j + 1, 2));
        }
    }

    if (lucky_dog != null) {
        card_cs.push(cardC2Svg(PanelGenerate.matchPlayer2CardC(lucky_dog, true, images, false, true), none_row, 1, 1));
    }

    svg = setTexts(svg, card_cs, reg_main_card);

    // 计算面板高度
    const panel_height = getPanelHeight(arr?.length, 110, 2, 290, 40, 40);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panel_height);
    svg = setText(svg, card_height, reg_card_height);

    return svg;
}

async function seriesRating2CardA2(series = {}, background = null) {
    const {
        average_star = 0,
        match_count = 0,
        round_count = 0,
        player_count = 0,
        score_count = 0,
        first_map_sid = 0,
        statistics: stats
    } = series

    const star = floor(average_star, 2);

    const bg = background ?? await readNetImage('https://assets.ppy.sh/beatmaps/' + first_map_sid + '/covers/list@2x.jpg', true);

    const {
        name: title1,
        team1,
        team2
    } = splitMatchName(stats?.name)

    let title2;
    if (isNotEmptyString(team1)) {
        title2 = team1 + ' vs ' + team2;
    } else {
        title2 = '';
    }

    //这里的时间戳不需要 .add(8, 'hours')
    const left2 = 'Match: ' + match_count + ' // Round: ' + round_count
    const left3 = 'Player: ' + player_count + ' // Score: ' + score_count

    const right1 = 'Average Star ' + star + '*';
    const right2 = 'Scores per Player';

    const sp_number = floors(score_count / player_count, 2)

    const right3b = player_count > 0 ? sp_number.integer : "0";
    const right3m = player_count > 0 ? sp_number.decimal : "";

    return {
        background: bg,
        map_status: '',

        title1: title1,
        title2: title2,
        title_font: 'PuHuiTi',
        left1: '',
        left2: left2,
        left3: left3,
        right1: right1,
        right2: right2,
        right3b: right3b,
        right3m: right3m,
        isTeamVS: false,
    };
}

function cardC2Svg(data = {}, row = 1, column = 1, maxColumn = 2) {
    let x;
    let y;
    let x_base;

    switch (maxColumn) {
        case 2:
            x_base = 40;
            break;
        case 1:
            x_base = 510;
            break;
    }

    x = x_base + 940 * (column - 1);
    y = 330 + 150 * (row - 1);

    const body = card_C(data);

    return getSvgBody(x, y, body);
}