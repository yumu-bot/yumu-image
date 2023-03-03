import {
    exportPng,
    getExportFileV3Path,
    getMatchNameSplitted,
    getNowTimeStamp,
    getRandomBannerPath,
    getStarRatingObject,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText,
    torus
} from "../util.js";
import {card_A2} from "../card/card_A2.js";
import {card_C} from "../card/card_C.js";

export async function panel_F (data = {

    // A2卡
    match: {
        background: 'PanelObject/A_CardA1_BG.png', //给我他们最后一局的谱面背景即可
        match_title: 'MP5 S11: (肉蛋葱鸡) vs (超级聊天)', //match name
        match_round: 11,
        match_time: '20:25-22:03',//比赛开始到比赛结束。如果跨了一天，需要加24小时 match start_time
        match_date: '2020-03-21',//比赛开始的日期 match start_time
        average_star_rating: 5.46,//算
        mpid: 59438351,
        wins_team_red: 5,
        wins_team_blue: 6,
        wins_team_none: 0,//如果不是team vs，总共的局数

        is_team_vs: true,// 比赛有哪怕一局不是team vs，都是false
    },

    beatmap: [{
        background: getExportFileV3Path('PanelObject/A_CardA1_BG.png'),
        title: 'Kan Saete Kuyashiiwa',
        artist: 'ZUTOMAYO',
        mapper: 'Nathan', //creator
        difficulty: 'Luscent\'s Extra',
        status: 'ranked',
        bid: 2167576,
        star_rating: 5.63,

        //这些数据event没有，需要get beatmap attribute
        cs: 4,
        ar: 9,
        od: 8,

    }],
    // C卡 events
    scores: [{
        statistics: {
            is_team_vs: true, // TFF表示平局，当然，这个很少见
            is_team_red_win: true, //如果不是team vs，这个值默认false
            is_team_blue_win: true, //如果不是team vs，这个值默认false
            score_team_red: 1144770,
            score_team_blue: 1146381,
            score_total: 2567413,
            wins_team_red_before: 5, //这局之前红赢了几局？从0开始，不是 team vs 默认0
            wins_team_blue_before: 5,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0
        },
        red: [{
            player_name: 'na-gi', //妈的 为什么get match不给用户名啊
            player_avatar: getExportFileV3Path('PanelObject/F_LabelF1_Avatar.png'),
            player_score: 464277,
            player_mods: [],
            player_rank: 1, //一局比赛里的分数排名，1v1或者team都一样
        }, {
            player_name: '- Rainbow -',
            player_avatar: getExportFileV3Path('PanelObject/F_LabelF1_Avatar.png'),
            player_score: 412096,
            player_mods: [],
            player_rank: 2
        }, {
            player_name: 'Guozi on osu',
            player_avatar: getExportFileV3Path('PanelObject/F_LabelF1_Avatar.png'),
            player_score: 0,//268397,
            player_mods: [],
            player_rank: 6,
        }],
        blue: [{
            player_name: 'Greystrip_VoV',
            player_avatar: getExportFileV3Path('PanelObject/F_LabelF1_Avatar.png'),
            player_score: 403437,
            player_mods: ['HD'],
            player_rank: 3,
        }, {
            player_name: 'Mars New',
            player_avatar: getExportFileV3Path('PanelObject/F_LabelF1_Avatar.png'),
            player_score: 371937,
            player_mods: [],
            player_rank: 4,
        }, {
            player_name: 'No Rank',
            player_avatar: getExportFileV3Path('PanelObject/F_LabelF1_Avatar.png'),
            player_score: 371007,
            player_mods: [],
            player_rank: 5,
        }],
        none: [{

        }]
    },{
        statistics: {
            is_team_vs: true, // TFF表示平局，当然，这个很少见
            is_team_red_win: true, //如果不是team vs，这个值默认false
            is_team_blue_win: true, //如果不是team vs，这个值默认false
            score_team_red: 1144770,
            score_team_blue: 1146381,
            score_total: 2567413,
            wins_team_red_before: 5, //这局之前红赢了几局？从0开始，不是 team vs 默认0
            wins_team_blue_before: 5,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0,
        },
        red:[],
        blue:[],
        none:[],
    }],

    // 面板文字
    index_powered: 'powered by Yumubot v0.3.0 EA // Match Monitor Now (!ymmn)',
    index_request_time: 'request time: ' + getNowTimeStamp(),
    index_panel_name: 'MN v3.6',

}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_F.svg');

    // 路径定义
    let reg_height = '${height}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PF-1\);">)/;
    let reg_card_c = /(?<=<g id="CardC">)/;
    let reg_card_a2 = /(?<=<g id="CardA2">)/;


    // 文字定义
    let index_powered = torus.getTextPath(data.index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    let index_request_time = torus.getTextPath(data.index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    let index_panel_name = torus.getTextPath(data.index_panel_name,
        607.5, 83.67, 48, "center baseline", "#fff");


    // 插入主面板的文字
    svg = replaceText(svg, index_powered, reg_index);
    svg = replaceText(svg, index_request_time, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);

    // 导入成绩卡（C卡

    let card_Cs = [];
    for (const i of data.scores) {
        card_Cs.push(await card_C(i, true));
    }

    for (const i in card_Cs) {
        svg = implantSvgBody(svg, 510, 330 + i * 250, card_Cs[i], reg_card_c)
    }


    // 导入谱面卡(A2卡
    async function implantBeatMapCardA2(object, x, y) {

        let title1 = object.title || 'Unknown Title';
        let title2 = object.artist || 'Unknown Artist';
        let title3 = object.mapper || 'God Made This';
        let left2 = object.difficulty || 'Tragic Love Extra';
        let left3 = 'b' + (object.bid || 0);

        let status = object.status;
        let right2 =
            'CS' + (object.cs || 0) +
            ' AR' + (object.ar || 0) +
            ' OD' + (object.od || 0);

        let right3b = getStarRatingObject(object.star_rating,2);
        let right3m = getStarRatingObject(object.star_rating,3) + '*';

        let card_A2_beatmap_impl =
            await card_A2({
                data,
                title1: title1,
                title2: title2,
                title3: title3,
                title_font: 'torus',
                left2: left2,
                left3: left3,
                map_status: status,
                right2: right2,
                right3b: right3b,
                right3m: right3m,
            }, true);

        svg = implantSvgBody(svg, x, y, card_A2_beatmap_impl, reg_card_a2);
    }

    let beatmap_arr = data.beatmap;
    let beatmap_nameSpace = Object.keys(beatmap_arr);
    let beatmap_rowSum = 0; //总共的行数

    for (let i = 0; i < beatmap_nameSpace.length; i++) {
        let beatmap_number = beatmap_nameSpace[i];

        await implantBeatMapCardA2(beatmap_arr[beatmap_number],40,330 + beatmap_rowSum * 250);
        beatmap_rowSum += 1;
    }


    // 导入比赛简介卡（A2卡
    let title = getMatchNameSplitted(data.match.match_title);
    let title1 = title[0];
    let title2 = title[1] + ' vs ' + title[2];
    let left1 = data.match.match_round ? 'Round ' + data.match.match_round : '-';
    let left2 = data.match.match_time;
    let left3 = data.match.match_date;
    let right1 = 'AVG.SR ' + data.match.average_star_rating;
    let right2 = 'mp' + data.match.mpid || 0;
    let wins_team_red = data.match.wins_team_red || 0;
    let wins_team_blue = data.match.wins_team_blue || 0;
    let right3b = wins_team_red + ' : ' + wins_team_blue;

    let card_A2_impl =
        await card_A2({data,
            title1: title1,
            title2: title2,
            title_font: 'PuHuiTi',
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
        },  true);
    svg = implantSvgBody(svg,40,40,card_A2_impl,reg_maincard);

    return await exportPng(svg);
}