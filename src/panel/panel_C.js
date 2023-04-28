import {
    exportPng,
    getExportFileV3Path,
    getMatchNameSplitted,
    getNowTimeStamp,
    getRandomBannerPath,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText,
    torus
} from "../util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";

export async function panel_C(data = {
    // A2卡
    match: {
        background: getExportFileV3Path('PanelObject/A_CardA1_BG.png'), //给我他们最后一局的谱面背景即可
        match_title: 'MP5 S11: (肉蛋葱鸡) vs (超级聊天)', //比赛标题
        match_round: 11,
        match_time: '20:25-22:03',//比赛开始到比赛结束。如果跨了一天，需要加24小时
        match_date: '2020-03-21',//比赛开始的日期
        average_star_rating: 5.46,
        mpid: 59438351,
        wins_team_red: 5,
        wins_team_blue: 6,
    },
    // H卡
    player: {
        red: [{
            team: 'red',
            team_color: '#D32F2F',
            player_name: 'na-gi',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 464277,
            player_win: 5,
            player_lose: 1,
            player_rank: 1,
            player_rws: 0, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 1.22, // 木斗力
            mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: '',
        }, {
            team: 'red',
            team_color: '#D32F2F',
            player_name: '- Rainbow -',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 412096,
            player_win: 5,
            player_lose: 1,
            player_rank: 2,
            player_rws: 0, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 1.08, // 木斗力
            mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: '',
        }, {
            team: 'red',
            team_color: '#D32F2F',
            player_name: 'Guozi on Osu',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 268397,
            player_win: 5,
            player_lose: 1,
            player_rank: 6,
            player_rws: 0, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 0.70, // 木斗力
            mra_color: '#D32F2F', // 玩家分类颜色 MRA v1.2 功能
            label_class: '1611 Dust', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: 'MVP',
        }],
        blue: [{
            team: 'blue',
            team_color: '#00A0E9',
            player_name: 'Mars New',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 371937,
            player_win: 5,
            player_lose: 1,
            player_rank: 4,
            player_rws: 32.44, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 0.97, // 木斗力
            mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: '',
        }, {
            team: 'blue',
            team_color: '#00A0E9',
            player_name: 'No Rank',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 371007,
            player_win: 5,
            player_lose: 1,
            player_rank: 5,
            player_rws: 32.36, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 0.97, // 木斗力
            mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: '',
        }, {
            team: 'blue',
            team_color: '#00A0E9',
            player_name: 'GreySTrip_VoV',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 403437,
            player_win: 5,
            player_lose: 1,
            player_rank: 3,
            player_rws: 35.19, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 1.06, // 木斗力
            mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: '',
        }],
        none: [{
            team: 'none',
            team_color: '#a1a1a1',
            player_name: 'Fushimi Rio',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 57434,
            player_win: 5,
            player_lose: 1,
            player_rank: 4,
            player_rws: 32.44,
            player_mra: 0.97,
            mra_color: '#fefefe',
            label_class: 'Fia',
            class_color: '#000',
            label_mvp: '',
        }],// 没分队的
    },

    // 面板文字
    index_powered: 'powered by Yumubot v0.3.0 EA // Yumu Rating v3.5 (!ymra)',
    index_request_time: 'request time: ' + getNowTimeStamp(),
    index_panel_name: 'MRA',


}) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    // 路径定义
    let reg_height = '${height}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;
    let reg_bodycard = /(?<=<g id="BodyCard">)/;


    // 文字定义
    let index_powered = torus.getTextPath(data.index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    let index_request_time = torus.getTextPath(data.index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    let index_panel_name = torus.getTextPath(data.index_panel_name,
        607.5, 83.67, 48, "center baseline", "#fff");

    // 导入A2卡
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

    // 插入主面板的文字
    svg = replaceText(svg, index_powered, reg_index);
    svg = replaceText(svg, index_request_time, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);
    svg = implantSvgBody(svg,40,40,card_A2_impl,reg_maincard);

    // 插入主体卡片

    let rowTotal;

    async function BodyCard(data) {
        let arr2 = data.player;
        let rowSum = 0; //总共的行数

        //渲染红队
        for (let i = 0; i < arr2['red'].length; i++) {
            await implantCardH(arr2['red'][i],i+1 ,1, 2);
        }

        //渲染蓝队
        for (let i = 0; i < arr2['blue'].length; i++) {
            await implantCardH(arr2['blue'][i],i+1 ,2, 2);
        }

        rowSum += Math.max(arr2['red'].length, arr2['blue'].length)

        //渲染不在队伍（无队伍）
        let tianxuanzhizi;
        if (arr2['none'].length % 2 !== 0){
            tianxuanzhizi = arr2['none'].pop();
        }

        for (let i = 0; i < arr2['none'].length / 2; i++) {
            let i2 = 0;

            for (let j = 0; j < 2; j++) {
                await implantCardH(arr2['none'][i2], rowSum + j + 1, 2);
                i2 ++;
            }
        }
        rowSum += arr2['none'].length / 2;

        if (tianxuanzhizi){
            await implantCardH(tianxuanzhizi, rowSum + 1, 1,1);
            rowSum ++;
        }
        rowTotal = rowSum;
    }

    async function implantCardH(object, row = 1, column = 1, maxColumn = 2) {
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

        let left1 = getRoundedNumberLargerStr(object.player_score, 3) +
            getRoundedNumberSmallerStr(object.player_score, 3) +
            ' // ' +
            object.player_win +
            'W-' + object.player_lose +
            'L (' +
            Math.floor(Math.round(
                object.player_win / (object.player_win + object.player_lose))) * 100 +
            '%)';
        let left2 = '#' +
            (object.player_rank || 0)+
            ' (' +
            Math.round(object.player_rws * 100)/100 +
            ')';
        let index_b = getRoundedNumberLargerStr(object.player_mra, 3);
        let index_m = getRoundedNumberSmallerStr(object.player_mra, 3);

        let color_label3 = '#382E32';
        let color_label4 = '#382E32';

        let card_H_impl =
            await card_H({
                background: object.player_banner,
                cover: object.player_avatar,
                title: object.player_name,
                left1: left1,
                left2: left2,
                index_b: index_b,
                index_m: index_m,
                label3: object.label_class,
                label4: object.label_mvp,
                color_label3: color_label3,
                color_label4: color_label4,
                color_left: object.team_color,
                color_right: object.mra_color,
                color_index: object.class_color,

            }, true);

        svg = implantSvgBody(svg, x, y, card_H_impl, reg_bodycard);
    }

    await BodyCard(data);

    // 计算面板高度
    let panelHeight;
    if (rowTotal) {
        panelHeight = 330 + 150 * rowTotal
    } else {
        panelHeight = 1080;
    }

    svg = replaceText(svg, panelHeight, reg_height);

    return await exportPng(svg);
}

