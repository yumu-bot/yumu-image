import {
    getMatchNameSplitted,
    getNowTimeStamp,
    getRandomBannerPath,
    implantImage,
    implantSvgBody,
    InsertSvgBuilder, readImage,
    readTemplate,
    replaceText,
    torus
} from "../util.js";
import {card_H} from "../card/cardH.js";
import {card_A2} from "../card/cardA2.js";

export async function panel_C(data = {
    // A2卡
    card_A2: {
        background: 'PanelObject/A_CardA1_BG.png', //给我他们最后一局的谱面背景即可
        match_title: 'MP5 S11: (肉蛋葱鸡) vs (超级聊天)', //比赛标题
        match_round: 11,
        match_time: '20:25-22:03',
        match_date: '2020-03-21',
        average_star_rating: 5.46,
        average_drain_time: '3:46',
        wins_team_red: 5,
        wins_team_blue: 6,
    },
    // H卡
    card_H: {
        background: readImage("image/I_CardH_BG.png"),
        avatar: readImage("image/I_CardH_Avatar.png"),
        name: 'Muziyami',
        info: '39.2M // 99W-0L 100%',
        rank: '#1',
        pp_b: '264',
        pp_m: 'pp',
        color_score: '#fbb03b',
        color_base: '#3fa9f5',
    },

    // 面板文字
    index_powered: 'powered by Yumubot // Yumu Rating v3.5 Public (!ymra)',
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


    // 文字定义
    let index_powered = torus.getTextPath(data.index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    let index_request_time = torus.getTextPath(data.index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    let index_panel_name = torus.getTextPath(data.index_panel_name,
        607.5, 83.67, 48, "center baseline", "#fff");

    // 切割比赛标题给A2卡
    let title = getMatchNameSplitted(data.card_A2.match_title);
    let title1 = title[0];
    let title2 = title[1] + ' vs ' + title[2];
    let left1 = data.card_A2.match_round ? 'Round ' + data.card_A2.match_round : '-';
    let left2 = data.card_A2.match_time;
    let left3 = data.card_A2.match_date;
    let right1 = 'AVG.SR ' + data.card_A2.average_star_rating;
    let right2 = 'AVG.Time ' + data.card_A2.average_drain_time;
    let wins_team_red = data.card_A2.wins_team_red || 0;
    let wins_team_blue = data.card_A2.wins_team_blue || 0;
    let right3b = wins_team_red + ' : ' + wins_team_blue;

    // 导入A2卡
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
            right3b: right3b}, true);
    // 导入H卡

    // 计算面板高度
    let rowTotal;
    let panelHeight;
    if (rowTotal) {
        panelHeight = 330 + 150 * rowTotal
    } else {
        panelHeight = 1080;
    }

    svg = replaceText(svg, panelHeight, reg_height);

    // 插入文字
    svg = replaceText(svg, index_powered, reg_index);
    svg = replaceText(svg, index_request_time, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);
    svg = implantSvgBody(svg,40,40,card_A2_impl,reg_maincard);

    let out_svg = new InsertSvgBuilder(svg);
    return out_svg.export();
}

