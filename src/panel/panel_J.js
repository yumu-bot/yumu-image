import {exportPng, getExportFileV3Path, readTemplate} from "../util.js";

export async function panel_J(data = {
    // A1卡
    card_A1: {
        background: getExportFileV3Path('PanelObject/A_CardA1_BG.png'),
        avatar: getExportFileV3Path('PanelObject/A_CardA1_Avatar.png'),
        sub_icon1: getExportFileV3Path('PanelObject/A_CardA1_SubIcon1.png'),
        sub_icon2: getExportFileV3Path('PanelObject/A_CardA1_SubIcon2.png'),
        name: 'Muziyami',
        rank_global: 28075,
        rank_country: 577,
        country: 'CN',
        acc: 95.27,
        level: 100,
        progress: 32,
        pp: 4396,
    },

    // J卡 max: 5x2（第一个是bp1-5，第二个是bp96-100（最后5个，在给之前记得加个判断，如果bp小于10则不给
    top_5_card_Js:[{
        map_cover: getExportFileV3Path('beatmap-defaultBG.jpg'),
        map_background: getExportFileV3Path('beatmap-defaultBG.jpg'),
        map_title_romanized: '',
        map_artist: '',
        map_difficulty_name: '',
        star_rating: 0,
        score_rank: 'F',
        accuracy: 0, //%
        combo: 0, //x
        mods_arr: [],
        pp: 0 //pp
    },{},{},{},{}],

    last_5_card_Js:[{
        map_cover: getExportFileV3Path('beatmap-defaultBG.jpg'),
        map_background: getExportFileV3Path('beatmap-defaultBG.jpg'),
        map_title_romanized: '',
        map_artist: '',
        map_difficulty_name: '',
        star_rating: 0,
        score_rank: 'F',
        accuracy: 0, //%
        combo: 0, //x
        mods_arr: [],
        pp: 0 //pp
    },{},{},{},{}],

    // L卡 max: 3x3K（1个L有3个K
    card_L:{
        icon: getExportFileV3Path('object-score-length.png'),
        icon_title: 'Length',
        bar_chart: [], //柱状图

        max_b: '7:',
        max_m: '04',
        mid_b: '7:',
        mid_m: '04',
        min_b: '7:',
        min_m: '04',

        card_Ks: [{
            map_background: 'beatmap-defaultBG.jpg',
            star_rating: '4.35',
            score_rank: 'D',
            bp_ranking: '', // 这里空字符串
            bp_pp: 'bp1' // 这里给bp_ranking
        },{

        },{

        }],
    },

    // J1标签 max: 4
    label_J1s: [{
        mod: 'DT',
        count: 88,
        pp: 1611,
    },{

    },{

    },{

    }],

    // J2标签 max: 6
    label_J2s: [{
        index: 1,
        avatar: getExportFileV3Path('avatar-guest.png'),
        name: 'Sotrash',
        count: 88,
        pp: 1611,
    },{},{},{}],

    // J3标签 max: 2+4
    label_J3s: [{
        rank: 'PF',
        percent: 98.99,
        count: 88,
        pp: 1611,
    },{},{},{}],

    //其他数据
    bp_mapper_count: 34, //bp上有多少不同的麻婆
    user_pp: 4096,
    user_bonus_pp: 367,
    game_mode: 'osu',

}) {
    let svg = readTemplate('template/Panel_J.svg');

    return await exportPng(svg);
}