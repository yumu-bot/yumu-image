import {label_D, LABEL_OPTION} from "../component/label.js";
import {card_A1} from "../card/cardA1";
import {implantSvgBody, readTemplate} from "../util";

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
            data_b: '98.',
            data_m: '3G',
        },
        tts: {
            data_b: '547.',
            data_m: '3G',
        },
        pc: {
            data_b: '19',
            data_m: '2048',
        },
        pt: {
            data_b: '210.',
            data_m: '1d',
        },
        mpl: {
            data_b: '1',
            data_m: '7748',
        },
        rep: {
            data_b: '4396',
            data_m: '',
        },
        fan: {
            data_b: '1076',
            data_m: '',
        },
        tth: {
            data_b: '29.',
            data_m: '82M',
        },
    },

    recent_play: {
        Card_J_1: {
            map_cover: 'PanelObject/D_CardJ_Cover.png',
            map_background: 'PanelObject/D_CardJ_Background.png',
            map_title_romanized: 'Fia is a Cheater',
            map_difficulty_name: 'Fushimi Rio also cheated',
            star_rating: '4.86',
            score_rank: 'S',
            accuracy: '98.36', //%
            combo: '536', //x
            mods_arr: ['HD', 'HR', 'DT', 'NF'],
            pp: '736' //pp
        },
        Card_J_2: {

        },
        Card_J_3: {

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

    // 卡片定义
    let label_rks =
        await label_D({...LABEL_OPTION.RKS, ...data.label_data.rks}, true);
    let label_tts =
        await label_D({...LABEL_OPTION.TTS, ...data.label_data.tts}, true);
    let label_pc =
        await label_D({...LABEL_OPTION.PC, ...data.label_data.pc}, true);
    let label_pt =
        await label_D({...LABEL_OPTION.PT, ...data.label_data.pt}, true);

    let label_mpl =
        await label_D({...LABEL_OPTION.MPL, ...data.label_data.mpl}, true);
    let label_rep =
        await label_D({...LABEL_OPTION.REP, ...data.label_data.rep}, true);
    let label_fan =
        await label_D({...LABEL_OPTION.FAN, ...data.label_data.fan}, true);
    let label_tth =
        await label_D({...LABEL_OPTION.TTH, ...data.label_data.tth}, true);

    let card_A1_impl =
        await card_A1(data.card_A1, true);

    // 插入图片和部件（新方法
    svg = implantSvgBody(svg,40,40,card_A1_impl,reg_maincard);

    svg = implantSvgBody(svg,1230,680,label_acc,reg_mod);
    svg = implantSvgBody(svg,1440,680,label_combo,reg_mod);
    svg = implantSvgBody(svg,1650,680,label_pp,reg_mod);
    svg = implantSvgBody(svg,1440,790,label_bpm,reg_mod);
    svg = implantSvgBody(svg,1650,790,label_length,reg_mod);
    svg = implantSvgBody(svg,1440,870,label_cs,reg_mod);
    svg = implantSvgBody(svg,1650,870,label_ar,reg_mod);
    svg = implantSvgBody(svg,1440,950,label_od,reg_mod);
    svg = implantSvgBody(svg,1650,950,label_hp,reg_mod);

}