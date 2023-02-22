import {label_E, LABEL_OPTION} from "../component/label.js";
import {card_A1} from "../card/cardA1.js";
import {
    getGameMode,
    getMascotName, getMascotPath, getRandomBannerPath, getRandomMascotBGPath,
    getRoundedNumberLargerStr, getRoundedNumberSmallerStr,
    implantImage,
    implantSvgBody,
    InsertSvgBuilder, maximumArrayToFixedLength, modifyArrayToFixedLength,
    readTemplate, replaceText, torus
} from "../util.js";
import {card_J} from "../card/cardJ.js";
import {card_K} from "../card/cardK.js";

export async function panel_D (data = {
    // A1卡
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

    // D标签
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

    // J卡
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
            score_rank: 'B',
            accuracy: '71.44', //%
            combo: '241', //x
            mods_arr: ['EZ', 'HD', 'DT'],
            pp: '64' //pp

        },
        card_J_3: {

        },
    },

    // K卡
    bp_list:{
        card_K_1: {
            map_background: 'PanelObject/D_CardK_Background.png',
            star_rating: '2.7',
            score_rank: 'X',
            bp_ranking: '1',
            bp_pp: '369'
        },
        card_K_2: {
            map_background: 'PanelObject/D_CardK_Background.png',
            star_rating: '6.21',
            score_rank: 'S',
            bp_ranking: '2',
            bp_pp: '304'
        },
        card_K_3: {

        },
        card_K_4: {

        },
        card_K_5: {

        },
        card_K_6: {

        },
        card_K_7: {

        },
        card_K_8: {
            
        },
    },

    // 面板文字
    index_powered: 'powered by Yumubot // UserInfo (!ymi)',
    index_request_time: 'request time: 2023-10-4 17:59:58 UTC+8',
    index_panel_name: 'I v3.6',

    // 用户数据
    rank_country: '581',
    rank_global: '114514',
    country: 'CN',
    bonus_pp: '471',
    om4k_pp: '2754',
    om7k_pp: '1045',
    game_mode: 'osu', // osu taiko catch mania

    grade_XH: 65472,
    grade_X: 75038,
    grade_SH: 9961,
    grade_S: 9527,
    grade_A: 1435,

    // ranking固定？90个值，bp固定39个值，pc固定43个值。可以传原数组，其他的交给面板完成
    user_ranking_arr: [24954,24973,24997,25020,25044,25069,25092,25108,25138,25158,25177,25198,25221,25249,25273,25306,25326,25340,25368,25393,25419,25403,25430,25465,25346,25370,25403,25433,25461,25486,25501,25533,25560,25592,25615,25636,25664,25666,25687,25715,25741,25759,25792,25824,25849,25879,25898,25928,25956,25989,26024,26055,26082,26105,26133,26139,26171,26203,26239,26262,26294,26323,26351,26383,26411,26443,26285,26305,26326,26338,26367,26404,26434,26442,26457,26487,26519,26533,26563,26602,26621,26645,26663,26687,26704,26736,26762,26779,26793,26774],

    //过去90天内的bp新增数量，可以提供90个值。有算法
    user_bp_arr: [1, 2, 4, 5, 2, 7, 1, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 1, 0, 5, 0, 2, 0, 0, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 4, 2, 5, 8, 5, 4, 2, 5, 13, 2, 6, 4, 7, 5, 6, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7],

    user_pc_arr: [41,56,468,256,278,430,478,277,260,183,458,395,531,236,462,280,450,375,316,192,202,129,177,139,465,89,80,111,273,370,226,28,71,61,126,510,418,715,552,245,183,144,122,247,170,212,693,770,346,474,830,724,806,870,950,752,999,837,574,766,1091,752,423,454,586,366,459,316,127,216,418,467,292,190,292,384,249],

    //返回上面数组最后一个元素对应的年月日
    user_pc_last_date: '2022-05-01',

    user_lv: '24',
    user_progress: '98', //%


}, reuse = false) {

    // 导入模板
    let svg = readTemplate('template/Panel_D.svg');

    // 路径定义
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_cardj = /(?<=<g id="CardJ">)/;
    let reg_cardk = /(?<=<g id="CardK">)/;
    let reg_label = /(?<=<g id="LabelDR">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_mascot_name = /(?<=<g id="MascotName">)/;
    let reg_progress = /(?<=<g id="Progress">)/;
    let reg_progressR = /(?<=<g id="ProgressRRect">)/;
    let reg_grade_text = /(?<=<g id="GradeText">)/;
    let reg_grade_image = /(?<=<g id="GradeImage">)/;
    let reg_ranking_graph = /(?<=<g id="RankingGraph">)/;
    let reg_ranking_text = /(?<=<g id="RankingText">)/;
    let reg_bp_activity_graph = /(?<=<g id="BPActivityR">)/;
    let reg_user_data_text = /(?<=<g id="UserDataText">)/;
    let reg_pc_activity_graph = /(?<=<g id="UserActivityR">)/;

    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PD-1\);">)/;
    let reg_mascot_bg = /(?<=<g style="clip-path: url\(#clippath-PD-2\);">)/;
    let reg_mascot = /(?<=filter="url\(#inset-shadow-PD-4\)">)/;


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
    let card_K_1_impl =
        await card_K(data.bp_list.card_K_1, true);
    let card_K_2_impl =
        await card_K(data.bp_list.card_K_2, true);
    let card_K_3_impl =
        await card_K(data.bp_list.card_K_3, true);
    let card_K_4_impl =
        await card_K(data.bp_list.card_K_4, true);
    let card_K_5_impl =
        await card_K(data.bp_list.card_K_5, true);
    let card_K_6_impl =
        await card_K(data.bp_list.card_K_6, true);
    let card_K_7_impl =
        await card_K(data.bp_list.card_K_7, true);
    let card_K_8_impl =
        await card_K(data.bp_list.card_K_8, true);

    // 文字定义
    let index_powered = torus.getTextPath(data.index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    let index_request_time = torus.getTextPath(data.index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    let tm_ipn =
        torus.getTextMetrics(data.index_panel_name,
            0, 0, 48, "left baseline", "#fff");
    let ipn_x = 607.5 - tm_ipn.width / 2;
    let index_panel_name = torus.getTextPath(data.index_panel_name,
        ipn_x, 83.67, 48, "left baseline", "#fff");

    let rank_country_text = ' ' + (data.country || '') + '#' + (data.rank_country || '0');

    let rank_global = torus.getTextPath('#' + data.rank_global || '0',
        1860 - torus.getTextWidth(rank_country_text, 24),
        374.754, 36, "right baseline", "#fff");
    let rank_country = torus.getTextPath(rank_country_text, 1860, 374.754, 24, "right baseline", "#a1a1a1");

    // 绘制rank曲线
    let user_ranking_max = Math.max.apply(Math, data.user_ranking_arr);
    let user_ranking_min = Math.min.apply(Math, data.user_ranking_arr);
    let user_ranking_mid = (user_ranking_max + user_ranking_min) / 2;

    function RFRankChart (arr, color, max, min){
        const step = 780 / arr.length
        const start_x = 1042; //往右挪了2px
        const start_y = 610;
        const delta = max - min;

        // M S 大写是绝对坐标 S 是 smooth cubic Bezier curve (平滑三次贝塞尔?)
        let path_svg = `<svg> <path d="M ${start_x} ${start_y - ((max - arr.shift()) / delta * 230)} S `;

        arr.forEach((item,i) => {
            let lineto_x = start_x + step * (i+1)
            let lineto_y = start_y - ((max - item) / delta * 230);
            path_svg += `${lineto_x} ${lineto_y} ${lineto_x + step/8} ${lineto_y} ` // 第一个xy是点位置，第二个是控制点位置
        })
        path_svg += `" style="fill: none; stroke: ${color}; stroke-miterlimit: 10; stroke-width: 4px;"/> </svg>`
        svg = replaceText(svg, path_svg, reg_ranking_graph);
    }

    RFRankChart(data.user_ranking_arr, '#FFCC22', user_ranking_max, user_ranking_min);

    // 绘制BP活动
    let bp_arr = maximumArrayToFixedLength(data.user_bp_arr,39)

    let user_bp_activity_max = Math.max.apply(Math, bp_arr);
    let user_bp_activity_max_fixed = Math.max(user_bp_activity_max, 5); //保底机制

    function RFBPActivityChart (arr, color, max){
        const step = 20
        const start_x = 1042;
        const start_y = 610;

        let rect_svg =`<g>`

        arr.forEach((item,i) => {
            let lineto_x = start_x + step * (i)
            let lineto_y = start_y - Math.max(((item + 1) / (max + 1) * 90), 16); //+1 和 16 都是保底机制
            rect_svg += `<rect id="RFBPrect${i}" x="${lineto_x}" y="${lineto_y}" width="16" height="${start_y - lineto_y}" rx="8" ry="8" style="fill: ${color};"/>`
        })
        rect_svg += `</g>`

        svg = replaceText(svg, rect_svg, reg_bp_activity_graph);
    }

    let bp_activity_text = torus.getTextPath(`BP+${user_bp_activity_max}`,
        1050 + bp_arr.findIndex((item) => item === user_bp_activity_max) * 20,
        515 + 90 * (5 - Math.min(user_bp_activity_max, 5)),
        16,
        'center baseline',
        '#a1a1a1');

    svg = replaceText(svg, bp_activity_text, reg_ranking_text)

    RFBPActivityChart (bp_arr, '#a1a1a1', user_bp_activity_max_fixed);

    // 绘制纵坐标，注意max在下面
    let rank_axis_y_min = getRoundedNumberLargerStr(user_ranking_min,3) + getRoundedNumberSmallerStr(user_ranking_min,3);
    let rank_axis_y_mid = getRoundedNumberLargerStr(user_ranking_mid,3) + getRoundedNumberSmallerStr(user_ranking_mid,3);
    let rank_axis_y_max = getRoundedNumberLargerStr(user_ranking_max,3) + getRoundedNumberSmallerStr(user_ranking_max,3);

    let rank_axis =
        torus.getTextPath(rank_axis_y_min, 1010, 402.836, 24, 'center baseline','#fc2') +
        torus.getTextPath(rank_axis_y_mid, 1010, 509.836, 24, 'center baseline','#fc2') +
        torus.getTextPath(rank_axis_y_max, 1010, 616.836, 24, 'center baseline','#fc2');

    svg = replaceText(svg, rank_axis, reg_ranking_text)

    // 绘制PC
    let pc_arr = modifyArrayToFixedLength(data.user_pc_arr,43)

    let user_pc_activity_max = Math.max.apply(Math, pc_arr);
    let user_pc_activity_max_fixed = Math.max(user_pc_activity_max, 5); //保底机制

    function RBPCChart (arr, color, max){
        const step = 20
        const start_x = 1002;
        const start_y = 1000;

        let rect_svg =`<g>`

        arr.forEach((item,i) => {
            let lineto_x = start_x + step * (i)
            let lineto_y = start_y - Math.max(((item + 1) / (max + 1) * 90), 16); //+1 和 16 都是保底机制
            if (item !== 0){
                rect_svg += `<rect id="RFBPrect${i}" x="${lineto_x}" y="${lineto_y}" width="16" height="${start_y - lineto_y}" rx="8" ry="8" style="fill: ${color};"/>`
            } else {
                rect_svg += `<rect id="RFBPrect${i}" x="${lineto_x}" y="${lineto_y}" width="16" height="${start_y - lineto_y}" rx="8" ry="8" style="fill: #a1a1a1;"/>`
            }
        })
        rect_svg += `</g>`

        svg = replaceText(svg, rect_svg, reg_pc_activity_graph);
    }

    RBPCChart (pc_arr, '#8dcff4', user_pc_activity_max_fixed)

    let pc_activity_text = torus.getTextPath(`${user_pc_activity_max}PC`,
        1010 + pc_arr.findIndex((item) => item === user_pc_activity_max) * 20,
        905 + 90 * (5 - Math.min(user_pc_activity_max, 5)),
        16,
        'center baseline',
        '#a1a1a1');

    svg = replaceText(svg, pc_activity_text, reg_user_data_text)

    // 绘制月份
    let last_year = data.user_pc_last_date.slice(0,4);
    let last_month = data.user_pc_last_date.slice(5,7);
    let first_year;
    let first_month;
    let mid_year;
    let mid_month;

    // 减42个月
    if (parseInt(last_month) <= 6) {
        first_year = (parseInt(last_year) - 4).toString().padStart(2,'0');
        first_month = (parseInt(last_month) + 6).toString().padStart(2,'0');
    } else {
        first_year = (parseInt(last_year) - 3).toString().padStart(2,'0');
        first_month = (parseInt(last_month) - 6).toString().padStart(2,'0');
    }

    // 减21个月
    if (parseInt(last_month) <= 9) {
        mid_year = (parseInt(last_year) - 2).toString().padStart(2,'0');
        mid_month = (parseInt(last_month) + 3).toString().padStart(2,'0');
    } else {
        mid_year = (parseInt(last_year) - 1).toString().padStart(2,'0');
        mid_month = (parseInt(last_month) - 9).toString().padStart(2,'0');
    }
    
    let user_pc_first_date = torus.getTextPath(
        first_year + '-' + first_month,
        995,
        1024.836,
        24,
        'left baseline',
        '#a1a1a1');
    let user_pc_mid_date = torus.getTextPath(
        mid_year + '-' + mid_month,
        1430,
        1024.836,
        24,
        'center baseline',
        '#a1a1a1');
    let user_pc_last_date = torus.getTextPath(
        data.user_pc_last_date.slice(0,7),
        1865,
        1024.836,
        24,
        'right baseline',
        '#a1a1a1');

    svg = replaceText(svg, user_pc_first_date, reg_user_data_text);
    svg = replaceText(svg, user_pc_mid_date, reg_user_data_text);
    svg = replaceText(svg, user_pc_last_date, reg_user_data_text);

    // 插入吉祥物
    let mascot_name_data = getMascotName(data.game_mode);
    let mascot_link = getMascotPath(mascot_name_data);

    svg = implantImage(svg, 560, 710, 40, 330, 1, mascot_link, reg_mascot);

    // 插入进度
    let mascot_name_width = torus.getTextWidth(mascot_name_data || '',36)
    let user_lv_text_width = torus.getTextWidth(' Lv.', 24);
    let user_lv_width = torus.getTextWidth(data.user_lv || 0, 36);
    let user_progress_width =
        torus.getTextWidth(data.user_progress || 0, 36) +
        torus.getTextWidth('%', 24);

    let mascot_mark1_rrect_width =
        mascot_name_width +
        user_lv_width +
        user_lv_text_width + 30;
    let mascot_mark2_rrect_width = user_progress_width + 30;

    let mascot_mark1 =
        torus.getTextPath(mascot_name_data || '',
            75,
            380.754,
            36,
            "left baseline",
            "#fff") +
        torus.getTextPath(' Lv.',
            75 + mascot_name_width,
            380.754,
            24,
            "left baseline",
            "#fff") +
        torus.getTextPath(data.user_lv || 0,
            75 + mascot_name_width + user_lv_text_width,
            380.754,
            36,
            "left baseline",
            "#fff");

    let mascot_mark2 = torus.getTextPath(data.user_progress || 0,
        565 - torus.getTextWidth('%', 24),
        380.754,
        36,
        "right baseline",
        "#fff") +
        torus.getTextPath('%',
        565,
        380.754,
        24,
        "right baseline",
        "#fff") ;

    let mascot_mark1_rrect = `<rect x="60" y="350" width="${mascot_mark1_rrect_width}" height="40" rx="12" ry="12" style="fill: #54454c; opacity: .7;"/>`
    let mascot_mark2_rrect = `<rect x="${580 - mascot_mark2_rrect_width}" y="350" width="${mascot_mark2_rrect_width}" height="40" rx="12" ry="12" style="fill: #54454c; opacity: .7;"/>`

    let progress_rrect = `<rect id="ProgressR" x="60" y="1016" width="${520 * (data.user_progress || 0) / 100}" height="4" rx="2" ry="2" style="fill: #fc2;"/>`

    // 插入右下面板右上提示
    let game_mode = getGameMode(data.game_mode, 1);
    let bonus_pp = data.bonus_pp || 0;
    let om4k_pp = data.om4k_pp || 0;
    let om7k_pp = data.om7k_pp || 0;
    let user_data_text;

    if (game_mode !== 'osu!mania'){
        user_data_text = game_mode + ' (bonus: ' + parseInt(bonus_pp) + ' PP)';
    }
    else {
        user_data_text = game_mode + ' (bonus: ' + parseInt(bonus_pp) + ' PP // 4K: '
            + parseInt(om4k_pp) + ' PP // 7K: ' + parseInt(om7k_pp) + ' PP)';
    }

    let user_data = torus.getTextPath(
        user_data_text,
        1860,
        725.836,
        24,
        'right baseline',
        '#a1a1a1');

    svg = replaceText(svg, user_data, reg_user_data_text);

    // 评级数量
    let grade_X = torus.getTextPath(data.grade_X.toString(), 685,998.795,30,'center baseline','#fff')
    let grade_S = torus.getTextPath(data.grade_S.toString(), 790,998.795,30,'center baseline','#fff')
    let grade_A = torus.getTextPath(data.grade_A.toString(), 895,998.795,30,'center baseline','#fff')
    let grade_XH = torus.getTextPath(`(${data.grade_XH})`, 685,1024.877,18,'center baseline','#a1a1a1')
    let grade_SH = torus.getTextPath(`(${data.grade_SH})`, 790,1024.877,18,'center baseline','#a1a1a1')

    svg = replaceText(svg, grade_X, reg_grade_text);
    svg = replaceText(svg, grade_S, reg_grade_text);
    svg = replaceText(svg, grade_A, reg_grade_text);
    svg = replaceText(svg, grade_XH, reg_grade_text);
    svg = replaceText(svg, grade_SH, reg_grade_text);

    // 插入文字

    svg = replaceText(svg, index_powered, reg_index);
    svg = replaceText(svg, index_request_time, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);
    svg = replaceText(svg, mascot_mark1, reg_mascot_name);
    svg = replaceText(svg, mascot_mark1_rrect, reg_mascot_name);
    svg = replaceText(svg, mascot_mark2, reg_progress);
    svg = replaceText(svg, mascot_mark2_rrect, reg_progress);
    svg = replaceText(svg, progress_rrect, reg_progressR);
    svg = replaceText(svg, rank_global, reg_ranking_text)
    svg = replaceText(svg, rank_country, reg_ranking_text)

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);
    svg = implantImage(svg,1920,1080,0,280,0.5,getRandomMascotBGPath(),reg_mascot_bg);
    svg = implantImage(svg, 31,39,669,930,1,'object-score-X-small.png',reg_grade_image);
    svg = implantImage(svg, 25,35,777,932,1,'object-score-S-small.png',reg_grade_image);
    svg = implantImage(svg, 30,34,880,933,1,'object-score-A-small.png',reg_grade_image);

    svg = implantSvgBody(svg,40,40,card_A1_impl,reg_maincard);
    svg = implantSvgBody(svg,635,380,card_J_1_impl,reg_cardj);
    svg = implantSvgBody(svg,635,475,card_J_2_impl,reg_cardj);
    svg = implantSvgBody(svg,635,570,card_J_3_impl,reg_cardj);

    svg = implantSvgBody(svg,635,735,card_K_1_impl,reg_cardk);
    svg = implantSvgBody(svg,715,735,card_K_2_impl,reg_cardk);
    svg = implantSvgBody(svg,795,735,card_K_3_impl,reg_cardk);
    svg = implantSvgBody(svg,875,735,card_K_4_impl,reg_cardk);
    svg = implantSvgBody(svg,635,795,card_K_5_impl,reg_cardk);
    svg = implantSvgBody(svg,715,795,card_K_6_impl,reg_cardk);
    svg = implantSvgBody(svg,795,795,card_K_7_impl,reg_cardk);
    svg = implantSvgBody(svg,875,795,card_K_8_impl,reg_cardk);

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