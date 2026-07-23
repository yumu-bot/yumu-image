import {
    getMatchDuration,
    getNowTimeStamp,
    getPanelHeight,
    getPanelNameSVG,
    getSvgBody,
    readTemplate,
    setCustomBanner,
    setSvgBody,
    setText
} from "../util/util.js";
import {card_C} from "../card/card_C.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {ADVANCED_IMAGE_FORMAT, createImageRouter, createSvgRouter} from "../util/image.js";
import {avatars2Task, beatmapset2Task, imageDownloader} from "../util/download.js";

export const router = createImageRouter(panel_C, undefined, ADVANCED_IMAGE_FORMAT);

export const router_svg = createSvgRouter(panel_C);

/**
 * 木斗力面板 (!ymra)
 * @param data
 * @return {Promise<string>}
 */
export async function panel_C(
    data = {
        match: {
            match: {
                id: 59438351,
                start_time: '2020-03-21T12:25:02Z',
                end_time: '2020-03-21T14:03:48Z',
                name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)'
            },
            events: [
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object], [Object], [Object], [Object],
                [Object], [Object], [Object]
            ],
            users: [
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object]
            ],
            first_event_id: 1361962243,
            latest_event_id: 1362015297,
            name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
            id: 59438351,
            start_time: '2020-03-21T12:25:02Z',
            end_time: '2020-03-21T14:03:48Z',
            is_match_end: true,
            current_game_id: 310441611
        },
        team_point_map: { red: 1, blue: 1 },
        skip_ignore_map: {skip: 2, ignore: 0},
        player_data_list: [
            {
                player: [Object],
                team: 'blue',
                total: 8661974,
                era: 2.1824220418938887,
                dra: 2.3296940100373185,
                mra: 2.2266036323369174,
                rws: 0.15572318352897652,
                ranking: 0,
                win: 60,
                lose: 96,
                player_class: {
                    english: '',
                    chinese: '',
                    color: '',
                    category: ''
                },
                arc: 13
            },
        ],
        is_team_vs: true,
        average_star: 5.223287765796368,
        first_map_bid: 2167576,
        first_map_sid: 1001507
    }

) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    const {
        match,
        skip_ignore_map: {
            skip,
            ignore,
        },
        player_data_list = [],
        is_team_vs,
    } = data;

    const {
        events = [],
        users = [],
    } = match

    const first_set = events.find(e => e.beatmap_id != null)?.beatmap?.beatmapset ?? {}

    // 路径定义
    let reg_card_height = '${cardheight}'
    let reg_panel_height = '${panelheight}'
    let reg_main_card = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;

    // 面板文字
    const skip_text = skip > 0 ? `skip: ${skip} // ` : ''
    const ignore_text = ignore > 0 ? `ignore: ${ignore} // ` : ''

    const request_time = skip_text + ignore_text + 'match time: ' + getMatchDuration(match) + ' // request time: ' + getNowTimeStamp();
    const panel_name = getPanelNameSVG('Yumu Rating v3.5 (!ymra)', 'RA', request_time);

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 预加载
    const promise_a2 = beatmapset2Task(first_set)
    const promise_cs = avatars2Task(users)

    const tasks = [
        promise_a2,
        ...promise_cs
    ];

    const images = await imageDownloader(tasks);

    const stat_a2 = card_A2(await PanelGenerate.matchRating2CardA2(data, images.get(`list@2x_${first_set.id}`)));

    svg = setCustomBanner(svg, null, reg_banner);
    svg = setSvgBody(svg, 40, 40, stat_a2, reg_main_card);

    let card_cs = [];

    let red_arr = [];
    let blue_arr = [];
    let none_arr = [];

    for (let p of player_data_list) {

        switch (p?.team) {
            case "red":
                red_arr.push(p);
                break;
            case "blue":
                blue_arr.push(p);
                break;
            default :
                none_arr.push(p);
                break;
        }
    }

    const vs_row = Math.max(red_arr.length, blue_arr.length) || 0;
    //后面天选之子会修改 noneArr，所以在这里调出
    const total_row = vs_row + Math.ceil(none_arr.length / 2);

    if (is_team_vs) {
        //渲染红队
        for (let i = 0; i < red_arr.length; i++) {
            card_cs.push(
                cardC2Svg(PanelGenerate.matchPlayer2CardC(red_arr[i], true, images), i + 1, 1, 2));
        }
        //渲染蓝队
        for (let i = 0; i < blue_arr.length; i++) {
            card_cs.push(
                cardC2Svg(PanelGenerate.matchPlayer2CardC(blue_arr[i], true, images), i + 1, 2, 2));
        }
    } else {
        //渲染不在队伍（无队伍）
        const none_row = Math.floor(none_arr.length / 2) + 1;
        const lucky_dog = (none_arr.length % 2 === 1) ? none_arr.pop() : null;

        for (let i = 0; i < none_arr.length; i += 2) {
            for (let j = 0; j < 2; j++) {
                card_cs.push(
                    cardC2Svg(PanelGenerate.matchPlayer2CardC(none_arr[i + j], false, images), vs_row + i / 2 + 1, j + 1, 2));
            }
        }

        if (lucky_dog) {
            card_cs.push(
                cardC2Svg(PanelGenerate.matchPlayer2CardC(lucky_dog, false, images), vs_row + none_row, 1, 1));
        }
    }

    svg = setText(svg, card_cs.join('\n'), reg_main_card);

    // 计算面板高度

    const panel_height = getPanelHeight(total_row * 2, 110, 2, 290, 40, 40);
    const card_height = panel_height - 290;

    svg = setText(svg, panel_height, reg_panel_height);
    svg = setText(svg, card_height, reg_card_height);

    return svg;
}

function cardC2Svg(data = {}
    , row = 1, column = 1, maxColumn = 2) {
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

