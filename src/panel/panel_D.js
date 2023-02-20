import {label_E, LABEL_OPTION} from "../component/label.js";
import {card_A1} from "../card/cardA1.js";
import {
    getRoundedNumberLargerStr, getRoundedNumberSmallerStr,
    getStarRatingColor,
    implantSvgBody,
    InsertSvgBuilder,
    readTemplate
} from "../util.js";
import {card_J} from "../card/cardJ.js";

export async function panel_D (data = {
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

    label_data: {
        rks: {
            data: '2147483647',
        },
        tts: {
            data: '1919810114',
        },
        pc: {
            data: '192048',
        },
        pt: {
            data_b: '210.',
            data_m: '1d',
        },
        mpl: {
            data: '17748',
        },
        rep: {
            data: '4396',
        },
        fan: {
            data: '1076',
        },
        tth: {
            data: '298074',
        },
    },

    recent_play: {
        card_J_1: {
            map_cover: 'PanelObject/D_CardJ_Cover.png',
            map_background: 'PanelObject/D_CardJ_Background.png',
            map_title_romanized: 'Fia is a Cheater',
            map_difficulty_name: 'Fushimi Rio SB!!!111',
            star_rating: '4.86',
            score_rank: 'XH',
            accuracy: '100', //%
            combo: '536', //x
            mods_arr: ['HD', 'HR', 'DT', 'NF', 'FL'],
            pp: '736' //pp
        },
        card_J_2: {
            map_cover: 'PanelObject/D_CardJ_Cover.png',
            map_background: 'PanelObject/D_CardJ_Background.png',
            map_title_romanized: 'Surasthana Fantasia',
            map_difficulty_name: 'Blessing for yor birthday',
            star_rating: '5.32',
            score_rank: 'D',
            accuracy: '21.44', //%
            combo: '241', //x
            mods_arr: ['EZ', 'HD', 'DT'],
            pp: '4' //pp

        },
        card_J_3: {

        },
    },

    //用户数据
    //bp固定39个值，pc固定43个值，当然也可以传原数组，其他的交给面板完成
    user_ranking_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],
    user_bp_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],
    user_pc_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],

    user_lv: '106',
    user_progress: '36' //%

}, reuse = false) {

    // 导入模板
    let svg = readTemplate('template/Panel_D.svg');

    // 路径定义
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_cardj = /(?<=<g id="CardJ">)/;
    let reg_label = /(?<=<g id="LabelDR">)/;

    // 卡片定义
    let rks_b = getRoundedNumberLargerStr(data.label_data.rks.data,2);
    let rks_m = getRoundedNumberSmallerStr(data.label_data.rks.data,2);
    let tts_b = getRoundedNumberLargerStr(data.label_data.tts.data,2);
    let tts_m = getRoundedNumberSmallerStr(data.label_data.tts.data,2);
    let pc_b = getRoundedNumberLargerStr(data.label_data.pc.data,1);
    let pc_m = getRoundedNumberSmallerStr(data.label_data.pc.data,1);
    let mpl_b = getRoundedNumberLargerStr(data.label_data.mpl.data,0);
    let mpl_m = getRoundedNumberSmallerStr(data.label_data.mpl.data,0);
    let rep_b = getRoundedNumberLargerStr(data.label_data.rep.data,0);
    let rep_m = getRoundedNumberSmallerStr(data.label_data.rep.data,0);
    let fan_b = getRoundedNumberLargerStr(data.label_data.fan.data,0);
    let fan_m = getRoundedNumberSmallerStr(data.label_data.fan.data,0);
    let tth_b = getRoundedNumberLargerStr(data.label_data.tth.data,1);
    let tth_m = getRoundedNumberSmallerStr(data.label_data.tth.data,1);

    let label_rks =
        await label_E({...LABEL_OPTION.RKS, data_b: rks_b, data_m: rks_m}, true);
    let label_tts =
        await label_E({...LABEL_OPTION.TTS, data_b: tts_b, data_m: tts_m}, true);
    let label_pc =
        await label_E({...LABEL_OPTION.PC, data_b: pc_b, data_m: pc_m}, true);
    let label_pt =
        await label_E({...LABEL_OPTION.PT, ...data.label_data.pt}, true);

    let label_mpl =
        await label_E({...LABEL_OPTION.MPL, data_b: mpl_b, data_m: mpl_m}, true);
    let label_rep =
        await label_E({...LABEL_OPTION.REP, data_b: rep_b, data_m: rep_m}, true);
    let label_fan =
        await label_E({...LABEL_OPTION.FAN, data_b: fan_b, data_m: fan_m}, true);
    let label_tth =
        await label_E({...LABEL_OPTION.TTH, data_b: tth_b, data_m: tth_m}, true);

    let card_A1_impl =
        await card_A1(data.card_A1, true);
    let card_J_1_impl =
        await card_J(data.recent_play.card_J_1, true);
    let card_J_2_impl =
        await card_J(data.recent_play.card_J_2, true);
    let card_J_3_impl =
        await card_J(data.recent_play.card_J_3, true);

    // 插入图片和部件（新方法
    svg = implantSvgBody(svg,40,40,card_A1_impl,reg_maincard);
    svg = implantSvgBody(svg,635,380,card_J_1_impl,reg_cardj);
    svg = implantSvgBody(svg,635,475,card_J_2_impl,reg_cardj);
    svg = implantSvgBody(svg,635,570,card_J_3_impl,reg_cardj);

    svg = implantSvgBody(svg,1000,755,label_rks,reg_label);
    svg = implantSvgBody(svg,1220,755,label_tts,reg_label);
    svg = implantSvgBody(svg,1440,755,label_pc,reg_label);
    svg = implantSvgBody(svg,1660,755,label_pt,reg_label);
    svg = implantSvgBody(svg,1000,835,label_mpl,reg_label);
    svg = implantSvgBody(svg,1220,835,label_rep,reg_label);
    svg = implantSvgBody(svg,1440,835,label_fan,reg_label);
    svg = implantSvgBody(svg,1660,835,label_tth,reg_label);


    let out_svg = new InsertSvgBuilder(svg)

    return out_svg.export(reuse);
}