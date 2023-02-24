import {getRandomBannerPath, implantImage, implantSvgBody, readTemplate, replaceText, torus} from "../util.js";
import {card_A1} from "../card/cardA1.js";
import {card_D} from "../card/cardD.js";

export async function panel_H (data = {
    // A1卡 应该是A2，但是管他呢
    card_A1: {
        background: 'PanelObject/A_CardA1_BG.png',
        avatar: 'PanelObject/A_CardA1_Avatar.png',
        country_flag: 'PanelObject/A_CardA1_CountryFlag.png',
        sub_icon1: 'PanelObject/A_CardA1_SubIcon1.png',
        sub_icon2: 'PanelObject/A_CardA1_SubIcon2.png',
        name: 'Muziyami',
        rank_global: '#28075',
        rank_country: 'CN#577',
        info: '95.27% Lv.100(32%)',
        pp_b: '4396',
        pp_m: 'PP',
    },

    map_pool: {
        1: {
            background: '',
            title: 'Xin Mei Sang Zui Jiu',
            artist: 'Fushimi Rio',
            mapper: 'Fia',
            difficulty: 'OWC HD2',
            bid: '1146381',
            mod: 'EZ',
            cs: '4.2',
            ar: '10.3',
            od: '11',
            hp: '6',
            star_rating: '8.88',
            game_mode: 'osu'
        },
        2: {
            background: '',
            title: 'Xin Mei Sang Zui Jiu',
            artist: 'Fushimi Rio',
            mapper: 'Fia',
            difficulty: 'OWC HD2',
            bid: '1146381',
            mod: 'EZ',
            cs: '4.2',
            ar: '10.3',
            od: '11',
            hp: '6',
            star_rating: '8.88',
            game_mode: 'osu'
        },
        3: {
        },
    },


    // 面板文字
    index_powered: 'powered by Yumubot // Mappool (!ymmp)',
    index_request_time: 'request time: 2023-10-4 17:59:58 UTC+8',
    index_panel_name: 'MP v3.6',

}, reuse = false) {
    // 导入模板
    let svg = readTemplate("template/Panel_H.svg");

    // 路径定义
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PH-1\);">)/;

    // 卡片定义
    let card_A1_impl = await card_A1(data.card_A1, true);

    let card_D_1_impl =
        await card_D(data.map_pool["1"], true);

    // 文字定义
    let index_powered = torus.getTextPath(data.index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    let index_request_time = torus.getTextPath(data.index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    let index_panel_name = torus.getTextPath(data.index_panel_name,
        607.5, 83.67, 48, "center baseline", "#fff");

    // 插入文字

    svg = replaceText(svg, index_powered, reg_index);
    svg = replaceText(svg, index_request_time, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);
    svg = implantSvgBody(svg,40,40,card_A1_impl,reg_maincard);
    svg = implantSvgBody(svg,635,380,card_D_1_impl,reg_card_d);
}