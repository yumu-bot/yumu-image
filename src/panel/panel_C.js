import {
    exportJPEG, getImageFromV3, getPanelNameSVG,
    setSvgBody, readTemplate, setCustomBanner,
    setText, getSvgBody, getPanelHeight, getAvatar, getMatchDuration, getNowTimeStamp, round, rounds
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_C(data);
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
        const svg = await panel_C(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

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
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'red',
                total: 5931781,
                era: 1.602831307466496,
                dra: 1.8968876038306823,
                mra: 1.6910481963757518,
                rws: 0.28895869270118807,
                ranking: 0,
                win: 96,
                lose: 60,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'red',
                total: 6117850,
                era: 1.4337745766925736,
                dra: 1.6230915779855204,
                mra: 1.4905696770804575,
                rws: 0.32511577364068933,
                ranking: 0,
                win: 88,
                lose: 55,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'blue',
                total: 3056718,
                era: 1.2134904285274843,
                dra: 1.0707662005066485,
                mra: 1.1706731601212335,
                rws: 0.0824295694221074,
                ranking: 0,
                win: 40,
                lose: 64,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'red',
                total: 4213115,
                era: 1.0475938549218036,
                dra: 1.3587446453878695,
                mra: 1.1409390920616234,
                rws: 0.2238940383733162,
                ranking: 0,
                win: 88,
                lose: 55,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'blue',
                total: 3607347,
                era: 0.8827840945691331,
                dra: 1.1326633693450312,
                mra: 0.9577478770019026,
                rws: 0.07782256916500134,
                ranking: 0,
                win: 50,
                lose: 80,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'blue',
                total: 1493278,
                era: 0.8653558260789316,
                dra: 0.3365453932922233,
                mra: 0.706712696242919,
                rws: 0.10738337660851119,
                ranking: 0,
                win: 15,
                lose: 24,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'blue',
                total: 824972,
                era: 0.6325713596452961,
                dra: 0.29308774190421083,
                mra: 0.5307262743229705,
                rws: 0.05932470642939672,
                ranking: 0,
                win: 15,
                lose: 24,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'red',
                total: 718575,
                era: 0.6229456903875666,
                dra: 0.2912907621255022,
                mra: 0.5234492119089473,
                rws: 0.14001763895717406,
                ranking: 1,
                win: 24,
                lose: 15,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'red',
                total: 795730,
                era: 0.2953528058013916,
                dra: 0.306844914431696,
                mra: 0.2988004383904829,
                rws: 0.11628873379333274,
                ranking: 0,
                win: 32,
                lose: 20,
                player_class: [Object],
                arc: 13
            },
            {
                player: [Object],
                team: 'blue',
                total: 1113317,
                era: 0.2208780140154365,
                dra: 0.36038378115329717,
                mra: 0.2627297441567947,
                rws: 0.04803596062983229,
                ranking: 0,
                win: 25,
                lose: 40,
                player_class: [Object],
                arc: 13
            }
        ],
        is_team_vs: true,
        average_star: 5.223287765796368,
        first_map_bid: 2167576,
        first_map_sid: 1001507
    }

) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    // 路径定义
    let reg_cardheight = '${cardheight}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;

    // 面板文字
    const request_time = 'match time: ' + getMatchDuration(data?.match) + ' // request time: ' + getNowTimeStamp();
    const panel_name = getPanelNameSVG('Yumu Rating v3.5 (!ymra)', 'RA', 'v0.5.0 DX', request_time);

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A2卡
    const matchInfo = card_A2(await PanelGenerate.matchRating2CardA2(data));

    // 插入图片和部件（新方法
    svg = setCustomBanner(svg, reg_banner);
    svg = setSvgBody(svg, 40, 40, matchInfo, reg_maincard);

    // 导入H卡
    let cardHs = [];

    const isTeamVS = data?.is_team_vs;
    const playerData = data?.player_data_list;

    let redArr = [];
    let blueArr = [];
    let noneArr = [];

    for (let p of playerData) {

        switch (p?.team) {
            case "red":
                redArr.push(p);
                break;
            case "blue":
                blueArr.push(p);
                break;
            default :
                noneArr.push(p);
                break;
        }
    }


    const rowVS = Math.max(redArr.length, blueArr.length) || 0;
    //后面天选之子会修改 noneArr，所以在这里调出
    const rowTotal = rowVS + Math.ceil(noneArr.length / 2);

    if (isTeamVS) {
        //渲染红队
        for (let i = 0; i < redArr.length; i++) {
            cardHs.push(
                await drawCardH(await playerData2CardH(redArr[i]), i + 1, 1, 2));
        }
        //渲染蓝队
        for (let i = 0; i < blueArr.length; i++) {
            cardHs.push(
                await drawCardH(await playerData2CardH(blueArr[i]), i + 1, 2, 2));
        }
    } else {
        //渲染不在队伍（无队伍）
        const rowFull = Math.floor(noneArr.length / 2) + 1;
        const luckyDog = (noneArr.length % 2 === 1) ? noneArr.pop() : null;

        for (let i = 0; i < noneArr.length; i += 2) {
            for (let j = 0; j < 2; j++) {
                cardHs.push(
                    await drawCardH(await playerData2CardH(noneArr[i + j]), rowVS + i / 2 + 1, j + 1, 2));
            }
        }

        if (luckyDog != null) {
            cardHs.push(
                await drawCardH(await playerData2CardH(luckyDog), rowVS + rowFull, 1, 1));
        }
    }

    svg = setText(svg, cardHs, reg_maincard);

    // 计算面板高度

    const panelHeight = getPanelHeight(rowTotal * 2, 110, 2, 290, 40, 40);
    const cardHeight = panelHeight - 290;

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    return svg.toString();
}

async function playerData2CardH(p = {}) {
    let team_color;
    let player_background;
    let isTeamVS;

    switch (p?.team) {
        case 'red':
            team_color = '#D32F2F';
            player_background = getImageFromV3('card-red.png');
            isTeamVS = true;
            break;
        case 'blue':
            team_color = '#00A0E9';
            player_background = getImageFromV3('card-blue.png');
            isTeamVS = true;
            break;
        default:
            team_color = '#aaa';
            player_background = getImageFromV3('card-gray.png');
            isTeamVS = false;
            break;
    }

    const rws = Math.round(p?.rws * 10000) / 100;

    let left1;
    if (isTeamVS) {
        left1 = round(p?.total, 2) +
            ' // ' + p?.win + 'W-' + p?.lose + 'L (' +
            Math.round((p?.win / (p?.win + p?.lose)) * 100) + '%)';
    } else {
        left1 = round(p?.total, 2) +
            ' // ' + p?.win + 'W-' + (p?.win + p?.lose) + 'P';
    }

    const left2 = '#' + (p?.ranking || 0) + ' (' + rws + ')';

    const player_class = p?.player_class;
    const color_index = (player_class?.name === "Strongest Marshal" || player_class?.name === "Competent Marshal" || player_class?.name === "Indomitable Marshal") ? "#2A2226" : "#FFF";

    const avatar = await getAvatar(p.player.avatar_url, true);
    const mra_number = (p?.player?.id === 685188) ? {
        integer: '0',
        decimal: '.01',
    } : rounds(p?.mra, 2)

    return {
        background: player_background,
        cover: avatar,
        title: p?.player?.username || ('UID:' + p.player.id),
        title2: p?.player?.country?.country_code || '',
        left1: left1,
        left2: left2,
        index_b: mra_number.integer,
        index_m: mra_number.decimal,
        index_b_size: 48,
        index_m_size: 36,
        label1: '',
        label2: '',
        label3: player_class?.name,
        label4: player_class?.name_cn,
        mods_arr: [],

        color_title2: '#aaa',
        color_right: player_class?.color,
        color_left: team_color,
        color_index: color_index,
        color_label1: '',
        color_label2: '',
        color_label3: '#382E32',
        color_label4: '#382E32',
        color_left12: '#bbb', //左下两排字的颜色

        font_title2: 'torus',
        font_label4: 'PuHuiTi',
    };
}

async function drawCardH(data = {}
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

    const body = await card_H(data);

    return getSvgBody(x, y, body);
}

