import {label_E, LABEL_OPTION} from "../component/label.js";
import {card_A1} from "../card/card_A1.js";
import {
    exportJPEG,
    getExportFileV3Path,
    getGameMode,
    getMascotName,
    getMascotPath,
    getPanelNameSVG,
    getRandomBannerPath,
    getRandomMascotBGPath,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    implantImage,
    implantSvgBody,
    maximumArrayToFixedLength,
    modifyArrayToFixedLength, PanelDraw,
    PanelGenerate,
    readNetImage,
    readTemplate,
    replaceText,
    replaceTexts,
} from "../util.js";
import {torus} from "../font.js";
import {card_J} from "../card/card_J.js";
import {card_K} from "../card/card_K.js";

export async function router(req, res) {
    try {
        const data = await routerD(req);
        const svg = await panel_D(data);
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
        const data = await routerD(req);
        const svg = await panel_D(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

async function routerD(req) {

    let user = req.fields?.user;
    const card_a1 = await PanelGenerate.user2CardA1(user);

    const label_data = {
        rks: {
            data: user?.statistics?.ranked_score,
        },
        tts: {
            data: user?.statistics?.total_score,
        },
        pc: {
            data: user?.statistics?.play_count,
        },
        pt: {
            data_b: '0.',
            data_m: '0d',
        },
        mpl: {
            data: user?.beatmap_playcounts_count,
        },
        rep: {
            data: user?.statistics?.replays_watched_by_others,
        },
        fan: {
            data: user?.follower_count,
        },
        tth: {
            data: user?.totalHits,
        },
    }

    if (user?.statistics?.total_score) {
        let d = Math.floor(user?.statistics?.play_time / 86400);
        let d_f = Math.floor(user?.statistics?.play_time % 86400 / 864).toString().padStart(2, '0')
        label_data.pt.data_b = `${d}.`;
        label_data.pt.data_m = `${d_f}d`;
    }

    let reList = req.fields['re-list'];
    const recent_play = [];
    for (const re of reList) {
        const covers_card = await readNetImage(re.beatmapset.covers.card, getExportFileV3Path('beatmap-defaultBG.jpg')); //card获取快
        let d = {
            map_cover: covers_card,
            map_background: covers_card,
            map_title_romanized: re.beatmapset.title,
            map_artist: re.beatmapset.artist,
            map_difficulty_name: re.beatmap.version,
            star_rating: Math.round(re.beatmap.difficulty_rating * 100) / 100,
            score_rank: re.rank,
            accuracy: Math.round(re.accuracy * 10000) / 100, //这玩意传进来就是零点几？  是
            combo: re.max_combo, //x
            mods_arr: re.mods,
            pp: re.pp ? Math.round(re.pp) : 0 //pp
        }
        recent_play.push(d);
    }

    let bpList = req.fields['bp-list'];
    const bp_list = [];

    for (const bp of bpList) {
        let d = {
            map_background: await readNetImage(bp.beatmapset.covers.list, getExportFileV3Path('beatmap-defaultBG.jpg')),
            star_rating: bp.beatmap.difficulty_rating,
            score_rank: bp.rank,
            bp_pp: bp.pp,
        }
        bp_list.push(d);
    }

    const mpc = user.monthlyPlaycounts;
    let fd = mpc?.[0]?.startDate;
    const dataArr = [];
    if (fd) {
        const mpcObj = mpc.reduce((obj, {startDate, count}) => {
            obj[startDate] = count;
            return obj;
        }, {});
        let [year, month, day] = fd.split('-').map(Number);
        const nowDate = new Date();
        const thisYear = nowDate.getUTCFullYear();
        const thisMonth = nowDate.getUTCMonth() + 1;
        // 如果修改起始日期 参考下面例子
        //  year = thisYear - 1; //修改年
        //  month = month === 12 ? 1 : month + 1; //修改月
        // fd = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-'); //修改要传递的起始日期
        while (true) {
            if (year >= thisYear && month >= thisMonth) {
                break;
            }

            const key = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-');

            if (key in mpcObj) {
                dataArr.push(mpcObj[key]);
            } else {
                dataArr.push(0);
            }

            if (month < 12) {
                month += 1;
            } else {
                month = 1;
                year += 1;
            }
        }
        fd = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-');
    } else {
        const nowDate = new Date();
        const thisYear = nowDate.getUTCFullYear();
        const thisMonth = nowDate.getUTCMonth() + 1;
        fd = `${thisYear}-${thisMonth.toString().padStart(2, '0')}-01`;
    }

    const op = {
        rank_country: user?.statistics?.country_rank,
        rank_global: user?.statistics?.global_rank,
        country: user?.country['countryCode'],
        bonus_pp: req.fields['bonus_pp'], // 416.6667
        om4k_pp: user.statistics.pp_4k,
        om7k_pp: user.statistics.pp_7k,
        om4k_rank_country: user.statistics.country_rank_4k,
        om4k_rank_global: user.statistics.rank_4k,
        om7k_rank_country: user.statistics.country_rank_7k,
        om7k_rank_global: user.statistics.rank_7k,
        game_mode: req.fields?.mode, // osu taiko catch mania

        grade_XH: user?.statistics?.ssh,
        grade_X: user?.statistics?.ss,
        grade_SH: user?.statistics?.sh,
        grade_S: user?.statistics?.s,
        grade_A: user?.statistics?.a,

        user_lv: user['levelCurrent'],
        user_progress: Math.floor(user['levelProgress']), //%

        user_bp_arr: req.fields['bp-time'],
        user_ranking_arr: user?.rank_history.history,
        user_pc_arr: dataArr,
        user_pc_last_date: fd
    }
    return {
        ...op, card_A1: card_a1, label_data: label_data, recent_play: recent_play, bp_list: bp_list,
    };
}

export async function panel_D(data = {
    // A1卡
    card_A1: {
        background: getExportFileV3Path('card-default.png'),
        avatar: getExportFileV3Path('avatar-guest.png'),
        sub_icon1: getExportFileV3Path('object-card-supporter.png'),
        sub_icon2: '',
        country: 'CN',

        top1: 'Muziyami',
        left1: '#28075',
        left2: 'CN#1611',
        right1: '',
        right2: '98.7% Lv.93(24%)',
        right3b: '4396',
        right3m: 'PP',
    },

    // D标签
    label_data: {
        rks: {
            data: 2147483647,
        },
        tts: {
            data: 1919810114,
        },
        pc: {
            data: 192048,
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

    // J卡 max: 3
    recent_play: [
        {
            map_cover: getExportFileV3Path('beatmap-defaultBG.jpg'),
            map_background: getExportFileV3Path('beatmap-defaultBG.jpg'),
            map_title_romanized: 'Fia is a Cheater',
            map_artist: 'Fushimi',
            map_difficulty_name: 'Xin mei sang zui jiu',
            star_rating: '4.86',
            score_rank: 'XH',
            accuracy: '100', //%
            combo: '536', //x
            mods_arr: ['HD', 'HR', 'DT', 'NF', 'FL'],
            pp: '736' //pp
        },
    ],

    // K卡 max: 8
    bp_list: [
        {
            map_background: getExportFileV3Path('beatmap-defaultBG.jpg'),
            star_rating: 2.7,
            score_rank: 'X',
            bp_ranking: 1,
            bp_pp: '369PP'
        }, {
            map_background: getExportFileV3Path('beatmap-defaultBG.jpg'),
            star_rating: 2.7,
            score_rank: 'X',
            bp_ranking: 2,
            bp_pp: '369PP'
        }
    ],


    // 用户数据
    rank_country: 581,
    rank_global: 114514,
    country: 'CN',
    bonus_pp: 471,
    om4k_pp: 2754,
    om7k_pp: 1045,
    om4k_rank_country: 581,
    om4k_rank_global: 114514,
    om7k_rank_country: 581,
    om7k_rank_global: 114514,
    game_mode: 'osu', // osu taiko catch(fruits) mania

    grade_XH: 65472,
    grade_X: 75038,
    grade_SH: 9961,
    grade_S: 9527,
    grade_A: 1435,

    // ranking固定？90个值，bp固定39个值，pc固定43个值。可以传原数组，其他的交给面板完成
    user_ranking_arr: [24954, 24973, 24997, 25020, 25044, 25069, 25092, 25108, 25138, 25158, 25177, 25198, 25221, 25249, 25273, 25306, 25326, 25340, 25368, 25393, 25419, 25403, 25430, 25465, 25346, 25370, 25403, 25433, 25461, 25486, 25501, 25533, 25560, 25592, 25615, 25636, 25664, 25666, 25687, 25715, 25741, 25759, 25792, 25824, 25849, 25879, 25898, 25928, 25956, 25989, 26024, 26055, 26082, 26105, 26133, 26139, 26171, 26203, 26239, 26262, 26294, 26323, 26351, 26383, 26411, 26443, 26285, 26305, 26326, 26338, 26367, 26404, 26434, 26442, 26457, 26487, 26519, 26533, 26563, 26602, 26621, 26645, 26663, 26687, 26704, 26736, 26762, 26779, 26793, 26774],

    //过去90天内的bp新增数量，可以提供90个值。有算法
    user_bp_arr: [1, 2, 4, 5, 2, 7, 1, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 1, 0, 5, 0, 2, 0, 0, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 4, 2, 5, 8, 5, 4, 2, 5, 13, 2, 6, 4, 7, 5, 6, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7],

    user_pc_arr: [41, 56, 468, 256, 278, 430, 478, 277, 260, 183, 458, 395, 531, 236, 462, 280, 450, 375, 316, 192, 202, 129, 177, 139, 465, 89, 80, 111, 273, 370, 226, 28, 71, 61, 126, 510, 418, 715, 552, 245, 183, 144, 122, 247, 170, 212, 693, 770, 346, 474, 830, 724, 806, 870, 950, 752, 999, 837, 574, 766, 1091, 752, 423, 454, 586, 366, 459, 316, 127, 216, 418, 467, 292, 190, 292, 384, 249],

    //返回上面数组最后一个元素对应的年月日
    user_pc_last_date: '2022-05-01',

    user_lv: 24, //和A卡一致
    user_progress: 98, //和A卡一致


}, reuse = false) {

    // 导入模板
    let svg = readTemplate('template/Panel_D.svg');

    // 路径定义
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_cardj = /(?<=<g id="CardJ">)/;
    const reg_cardk = /(?<=<g id="CardK">)/;
    const reg_label = /(?<=<g id="LabelDR">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_mascot_name = /(?<=<g id="MascotName">)/;
    const reg_progress = /(?<=<g id="Progress">)/;
    const reg_progressR = /(?<=<g id="ProgressRRect">)/;
    const reg_grade_text = /(?<=<g id="GradeText">)/;
    const reg_grade_image = /(?<=<g id="GradeImage">)/;
    const reg_ranking_graph = /(?<=<g id="RankingGraph">)/;
    const reg_ranking_text = /(?<=<g id="RankingText">)/;
    const reg_bp_activity_graph = /(?<=<g id="BPActivityR">)/;
    const reg_user_data_text = /(?<=<g id="UserDataText">)/;
    const reg_pc_activity_graph = /(?<=<g id="UserActivityR">)/;

    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PD-1\);">)/;
    const reg_mascot_bg = /(?<=<g style="clip-path: url\(#clippath-PD-2\);">)/;
    const reg_mascot = /(?<=filter="url\(#inset-shadow-PD-4\)">)/;


    // 卡片定义
    const rks_b = getRoundedNumberLargerStr(data.label_data.rks.data, 4);
    const rks_m = getRoundedNumberSmallerStr(data.label_data.rks.data, 4);
    const tts_b = getRoundedNumberLargerStr(data.label_data.tts.data, 4);
    const tts_m = getRoundedNumberSmallerStr(data.label_data.tts.data, 4);
    const pc_b = getRoundedNumberLargerStr(data.label_data.pc.data, 0);
    const pc_m = getRoundedNumberSmallerStr(data.label_data.pc.data, 0);
    const mpl_b = getRoundedNumberLargerStr(data.label_data.mpl.data, 0);
    const mpl_m = getRoundedNumberSmallerStr(data.label_data.mpl.data, 0);
    const rep_b = getRoundedNumberLargerStr(data.label_data.rep.data, 0);
    const rep_m = getRoundedNumberSmallerStr(data.label_data.rep.data, 0);
    const fan_b = getRoundedNumberLargerStr(data.label_data.fan.data, 0);
    const fan_m = getRoundedNumberSmallerStr(data.label_data.fan.data, 0);
    const tth_b = getRoundedNumberLargerStr(data.label_data.tth.data, 4);
    const tth_m = getRoundedNumberSmallerStr(data.label_data.tth.data, 4);

    const label_rks =
        await label_E({...LABEL_OPTION.RKS, data_b: rks_b, data_m: rks_m}, true);
    const label_tts =
        await label_E({...LABEL_OPTION.TTS, data_b: tts_b, data_m: tts_m}, true);
    const label_pc =
        await label_E({...LABEL_OPTION.PC, data_b: pc_b, data_m: pc_m}, true);
    const label_pt =
        await label_E({...LABEL_OPTION.PT, ...data.label_data.pt}, true);

    const label_mpl =
        await label_E({...LABEL_OPTION.MPL, data_b: mpl_b, data_m: mpl_m}, true);
    const label_rep =
        await label_E({...LABEL_OPTION.REP, data_b: rep_b, data_m: rep_m}, true);
    const label_fan =
        await label_E({...LABEL_OPTION.FAN, data_b: fan_b, data_m: fan_m}, true);
    const label_tth =
        await label_E({...LABEL_OPTION.TTH, data_b: tth_b, data_m: tth_m}, true);

    const right1 = (data.game_mode === 'mania') ?
        data.card_A1.right2
        : '';
    const right2 = (data.game_mode === 'mania') ?
        '4K: ' + (Math.round(data.om4k_pp) || 0) + 'PP // 7K: ' + (Math.round(data.om7k_pp) || 0) + 'PP'
        : data.card_A1.right2;

    const card_A1_impl =
        await card_A1({...data.card_A1, right1: right1, right2: right2}, true);

    let card_Js = [];
    for (const j of data.recent_play) {
        card_Js.push(await card_J(j, true));
    }

    let card_Ks = [];
    for (const i in data.bp_list) {
        data.bp_list[i].bp_ranking = 1 + parseInt(i);
        card_Ks.push(await card_K(data.bp_list[i], true))
    }

    // 面板文字
    const panel_name = getPanelNameSVG('Information (!ymi)', 'Info', 'v0.3.0 EA');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    const rank_text = torus.get2SizeTextPath(
        '#' + (data.rank_global || '0'), ' ' + (data.country || '') + '#' + (data.rank_country || '0'),
        36, 24, 1860, 374.754, 'right baseline', '#fff', '#aaa');

    const variant_text = drawManiaVariantRank(data.game_mode, data.country, data.om4k_rank_global, data.om7k_rank_global, data.om4k_rank_country, data.om7k_rank_country)

    // 绘制rank曲线。
    const ranking_arr = modifyArrayToFixedLength(data.user_ranking_arr, 90, true);
    let ranking_nonzero_arr = [];

    const user_ranking_max = Math.max.apply(Math, ranking_arr);

    //处理rank数组，如果有0，补最大值
    ranking_arr.forEach((v) => {
        if (v === 0) v = user_ranking_max;
        ranking_nonzero_arr.push(v);
    });

    const user_ranking_min = Math.min.apply(Math, ranking_nonzero_arr);
    const user_ranking_mid = (user_ranking_max + user_ranking_min) / 2;
    
    svg = replaceText(svg,
        PanelDraw.LineChart(ranking_nonzero_arr, user_ranking_min, user_ranking_max,1040, 610, 780, 215, '#FFCC22', 1, 0, 4, true) //这里min和max换位置
        , reg_ranking_graph);

    // 绘制 BP活动 直方图

    const bp_arr = maximumArrayToFixedLength(data.user_bp_arr, 39);

    const user_bp_activity_max = Math.max.apply(Math, bp_arr);

    let bp_activity_text = torus.getTextPath(`BP+${user_bp_activity_max}`,
        1050 + bp_arr.findIndex((item) => item === user_bp_activity_max) * 20,
        520 - 5 + 75 - (user_bp_activity_max / Math.max(5, user_bp_activity_max)) * 75,
        16,
        'center baseline',
        '#a1a1a1');

    svg = replaceText(svg, bp_activity_text, reg_ranking_text)

    svg = replaceText(svg, PanelDraw.BarChart(bp_arr, null, 0, 1042, 610, 780, 90, 8, 4, '#8DCFF4', 5, 16), reg_bp_activity_graph)

    // 绘制纵坐标，注意max在下面
    let rank_axis_y_min = getRoundedNumberLargerStr(user_ranking_min, 1) + getRoundedNumberSmallerStr(user_ranking_min, 1);
    let rank_axis_y_mid = getRoundedNumberLargerStr(user_ranking_mid, 1) + getRoundedNumberSmallerStr(user_ranking_mid, 1);
    let rank_axis_y_max = getRoundedNumberLargerStr(user_ranking_max, 1) + getRoundedNumberSmallerStr(user_ranking_max, 1);

    let rank_axis =
        torus.getTextPath(rank_axis_y_min, 1010, 402.836, 24, 'center baseline', '#fc2') +
        torus.getTextPath(rank_axis_y_mid, 1010, 509.836, 24, 'center baseline', '#fc2') +
        torus.getTextPath(rank_axis_y_max, 1010, 616.836, 24, 'center baseline', '#fc2');

    svg = replaceText(svg, rank_axis, reg_ranking_text)

    // 绘制PC
    const pc_arr = modifyArrayToFixedLength(data.user_pc_arr, 43, true)

    const user_pc_activity_max = Math.max.apply(Math, pc_arr);

    const pc_activity_text = torus.getTextPath(`${user_pc_activity_max}PC`,
        1010 + pc_arr.findIndex((item) => item === user_pc_activity_max) * 20,
        910 - 5 + 75 - (user_pc_activity_max / Math.max(1000, user_pc_activity_max)) * 75,
        16,
        'center baseline',
        '#a1a1a1');

    svg = replaceText(svg, pc_activity_text, reg_user_data_text);

    svg = replaceText(svg, PanelDraw.BarChart(pc_arr, null, 0, 1002, 1000, 860, 90, 8, 4, '#8dcff4', 1000, 16, '#aaa'), reg_pc_activity_graph);

    // 绘制月份
    const last_year = data.user_pc_last_date.slice(0, 4);
    const last_month = data.user_pc_last_date.slice(5, 7);
    let first_year;
    let first_month;
    let mid_year;
    let mid_month;

    // 减42个月
    if (parseInt(last_month) <= 6) {
        first_year = (parseInt(last_year) - 4).toString().padStart(2, '0');
        first_month = (parseInt(last_month) + 6).toString().padStart(2, '0');
    } else {
        first_year = (parseInt(last_year) - 3).toString().padStart(2, '0');
        first_month = (parseInt(last_month) - 6).toString().padStart(2, '0');
    }

    // 减21个月
    if (parseInt(last_month) <= 9) {
        mid_year = (parseInt(last_year) - 2).toString().padStart(2, '0');
        mid_month = (parseInt(last_month) + 3).toString().padStart(2, '0');
    } else {
        mid_year = (parseInt(last_year) - 1).toString().padStart(2, '0');
        mid_month = (parseInt(last_month) - 9).toString().padStart(2, '0');
    }

    const user_pc_first_date = torus.getTextPath(
        first_year + '-' + first_month,
        995,
        1024.836,
        24,
        'left baseline',
        '#a1a1a1');
    const user_pc_mid_date = torus.getTextPath(
        mid_year + '-' + mid_month,
        1430,
        1024.836,
        24,
        'center baseline',
        '#a1a1a1');
    const user_pc_last_date = torus.getTextPath(
        data.user_pc_last_date.slice(0, 7),
        1865,
        1024.836,
        24,
        'right baseline',
        '#a1a1a1');

    svg = replaceTexts(svg, [user_pc_first_date, user_pc_mid_date, user_pc_last_date], reg_user_data_text);

    // 插入吉祥物
    const mascot_name_data = getMascotName(data.game_mode);
    const mascot_link = getMascotPath(mascot_name_data);

    svg = implantImage(svg, 560, 710, 40, 330, 1, mascot_link, reg_mascot);

    // 插入进度
    const mascot_name_width = torus.getTextWidth((mascot_name_data || 'pippi'), 36)
    const user_lv_text_width = torus.getTextWidth(' Lv.', 24);
    const user_lv_width = torus.getTextWidth((data.user_lv.toString() || '0'), 36);
    const user_progress_width =
        torus.getTextWidth((data.user_progress.toString() || '0'), 36) +
        torus.getTextWidth('%', 24);

    const mascot_mark1_rrect_width =
        mascot_name_width +
        user_lv_width +
        user_lv_text_width + 30;
    const mascot_mark2_rrect_width = user_progress_width + 30;

    const mascot_mark1 =
        torus.getTextPath((mascot_name_data || 'pippi'),
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
        torus.getTextPath((data.user_lv.toString() || '0'),
            75 + mascot_name_width + user_lv_text_width,
            380.754,
            36,
            "left baseline",
            "#fff");

    const mascot_mark2 = torus.getTextPath((data.user_progress.toString() || '0'),
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
            "#fff");

    const mascot_mark1_rrect = PanelDraw.Rect(60, 350, mascot_mark1_rrect_width, 40, 12, '#54454c', 0.7);
    const mascot_mark2_rrect = PanelDraw.Rect(580 - mascot_mark2_rrect_width, 350, mascot_mark2_rrect_width, 40, 12, '#54454c', 0.7);

    const progress_rrect = PanelDraw.Rect(60, 1016, 520 * (data.user_progress || 0) / 100, 4, 2, '#FFCC22');

    // 插入右下面板右上提示
    const bonus_pp = Math.round(Math.max(data.bonus_pp, 0)) || 0;
    const user_data_text = getGameMode(data.game_mode, 2) + ' (bonus: ' + bonus_pp + ' PP)';

    const user_data = torus.getTextPath(
        user_data_text,
        1860,
        725.836,
        24,
        'right baseline',
        '#a1a1a1');

    svg = replaceText(svg, user_data, reg_user_data_text);

    // 评级数量
    const grade_X = torus.getTextPath((data.grade_X + data.grade_XH).toString(), 685, 998.795, 30, 'center baseline', '#fff')
    const grade_S = torus.getTextPath((data.grade_S + data.grade_SH).toString(), 790, 998.795, 30, 'center baseline', '#fff')
    const grade_A = torus.getTextPath(data.grade_A.toString(), 895, 998.795, 30, 'center baseline', '#fff')
    const grade_XH = torus.getTextPath(`(+${data.grade_XH})`, 685, 1024.877, 18, 'center baseline', '#a1a1a1')
    const grade_SH = torus.getTextPath(`(+${data.grade_SH})`, 790, 1024.877, 18, 'center baseline', '#a1a1a1')

    svg = replaceTexts(svg, [grade_X, grade_S, grade_A, grade_XH, grade_SH, ], reg_grade_text);

    // 插入文字
    svg = replaceTexts(svg, [mascot_mark1, mascot_mark1_rrect], reg_mascot_name);
    svg = replaceTexts(svg, [mascot_mark2, mascot_mark2_rrect], reg_progress);
    svg = replaceTexts(svg, [rank_text, variant_text], reg_ranking_text);
    svg = replaceText(svg, progress_rrect, reg_progressR);

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantImage(svg, 1920, 1080, 0, 280, 0.5, getRandomMascotBGPath(), reg_mascot_bg);
    svg = implantImage(svg, 31, 39, 669, 930, 1, getExportFileV3Path('object-score-X-small.png'), reg_grade_image);
    svg = implantImage(svg, 25, 35, 777, 932, 1, getExportFileV3Path('object-score-S-small.png'), reg_grade_image);
    svg = implantImage(svg, 30, 34, 880, 933, 1, getExportFileV3Path('object-score-A-small.png'), reg_grade_image);

    svg = implantSvgBody(svg, 40, 40, card_A1_impl, reg_maincard);

    for (const i in card_Js) {
        svg = implantSvgBody(svg, 635, 380 + i * 95, card_Js[i], reg_cardj)
    }

    for (const i in card_Ks) {
        svg = implantSvgBody(svg, 635 + (i % 4 * 80), (i < 4 ? 735 : 795), card_Ks[i], reg_cardk)
    }

    svg = implantSvgBody(svg, 1000, 755, label_rks, reg_label);
    svg = implantSvgBody(svg, 1220, 755, label_tts, reg_label);
    svg = implantSvgBody(svg, 1440, 755, label_pc, reg_label);
    svg = implantSvgBody(svg, 1660, 755, label_pt, reg_label);
    svg = implantSvgBody(svg, 1000, 835, label_mpl, reg_label);
    svg = implantSvgBody(svg, 1220, 835, label_rep, reg_label);
    svg = implantSvgBody(svg, 1440, 835, label_fan, reg_label);
    svg = implantSvgBody(svg, 1660, 835, label_tth, reg_label);

    return svg.toString();
}

//cr country rank, gr global rank
function drawManiaVariantRank(mode = 'osu', country = 'CN', gr4k = 0, gr7k = 0, cr4k = 0, cr7k = 0) {
    if (mode === 'mania') {
        const key4 = torus.get2SizeTextPath('4K: #' + (gr4k || 0), ' #'  + (cr4k || 0),
            24, 24, 1860, 404, 'right baseline', '#fff', '#aaa');

        const key7 = torus.get2SizeTextPath('7K: #' + (gr7k || 0), ' #'  + (cr7k || 0),
            24, 24, 1860, 430, 'right baseline', '#fff', '#aaa');

        return key4 + key7;
    } else return '';
}