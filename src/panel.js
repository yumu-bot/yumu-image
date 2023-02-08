import {extra, InsertSvgBuilder, PuHuiTi, readImage, readTemplate, replaceText, torus} from "./util.js";
import {card_A1, card_H} from "./card.js";
import {label_E} from "./component.js";


export async function panel_E(data = {
    card_A1:{
        background: readImage("image/A_CardA1_BG.png"),
        avatar: readImage("image/A_CardA1_Avatar.png"),
        country_flag: readImage("image/A_CardA1_CountryFlag.png"),
        sub_icon1: readImage("image/A_CardA1_SubIcon1.png"),
        sub_icon2: readImage("image/A_CardA1_SubIcon2.png"),
        name: 'Muziyami',
        rank_global: '#28075',
        rank_country: 'CN#577',
        info: '95.27% Lv.100(32%)',
        pp_b: '4396',
        pp_m: 'PP',
    },
    label_acc:{
        icon: readImage("image/object-score-accpp.png"),
        icon_title: 'Accuracy',
        remark: '-1.64%',
        data_b: '98.',
        data_m: '36%',
    },
    label_combo:{
        icon: readImage("image/object-score-combo.png"),
        icon_title: 'Combo',
        remark: '9999x',
        data_b: '547',
        data_m: 'x',
    },
    label_pp:{
        icon: readImage("image/object-score-pp.png"),
        icon_title: 'PP',
        remark: '',
        data_b: '2048.',
        data_m: '2',
    },
    label_bpm:{
        icon: readImage("image/object-score-beatsperminute.png"),
        icon_title: 'BPM',
        remark: '154.4ms',
        data_b: '210.',
        data_m: '1',
    },
    label_length:{
        icon: readImage("image/object-score-length.png"),
        icon_title: 'Length',
        remark: '3:04',
        data_b: '3:',
        data_m: '06',
    },
    label_cs:{
        icon: readImage("image/object-score-circlesize.png"),
        icon_title: 'CS',
        remark: '154px',
        data_b: '4.',
        data_m: '2',
    },
    label_ar:{
        icon: readImage("image/object-score-accpp.png"),
        icon_title: 'AR',
        remark: '450ms',
        data_b: '10.',
        data_m: '3 (9)',
    },
    label_od:{
        icon: readImage("image/object-score-approachrate.png"),
        icon_title: 'OD',
        remark: '16ms',
        data_b: '9.',
        data_m: '82 (8.1)',
    },
    label_hp:{
        icon: readImage("image/object-score-healthpoint.png"),
        icon_title: 'HP',
        remark: '-',
        data_b: '6.',
        data_m: '1',
    },

    // 成绩评级

    score_stats:{
        judge_stat_sum: '12580',
        judge_1: {
            index: '320',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_2: {
            index: '300',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_3:{
            index: '200',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_4:{
            index: '100',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_5:{
            index: '50',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_6: {
            index: '0',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_7: null,
    },

    // 面板图片
    banner: readImage("image/E_Banner.png"),
    judge_background: readImage("image/E_Background.jpg"),
    judge_fc: readImage("image/E_JudgeFullCombo.png"),
    judge_nm: readImage("image/E_JudgeNoMiss.png"),
    judge_cl: readImage("image/E_JudgeClear.png"),
    judge_pl: readImage("image/E_JudgePlayed.png"),
    colored_circle: readImage("image/E_ColoredCircle.png"),
    colored_ring: readImage("image/E_ColoredRing.png"),
    score_rank: readImage("image/E_ScoreRank.png"),
    mod1: readImage("image/E_Mod.png"),
    mod2: readImage("image/E_Mod.png"),
    mod3: readImage("image/E_Mod.png"),
    mod4: readImage("image/E_Mod.png"),
    mod5: readImage("image/E_Mod.png"),
    star: readImage("image/E_Star.png"),
    map_background: readImage("image/E_MapCover.jpg"),
    map_hexagon: readImage("image/E_Hexagon.png"),
    map_favorite: readImage("image/E_Favorite.png"),
    map_playcount: readImage("image/E_PlayCount.png"),
    map_status: readImage("image/E_MapStatus.png"),

    // 面板文字

    index_lu: 'powered by Yumubot // Score (!ymp / !ymr)',
    index_ru: 'request time: 2023-10-4 17:59:58 UTC+8',
    index_panel_name: 'S v3.6',
    lucard_sr_b: '6.',
    lucard_sr_m: '5',
    lucard_gamemode: '\uE800', // osu! 模式图标
    lums_fav: '3.9K',
    lums_pc: '78.2M',

    lbmt_title_romanized: 'Hyakukakai to Shirotokkuri',
    lbmt_title_unicode: '百花魁と白徳利',
    lbmt_difficulty: 'Expert',
    lbmt_artist_mapper_bid: 'Ponkichi // yf_bmp // b3614136',

    mu_score_b: '21',
    mu_score_m: '47483647',

    // 面板颜色和特性
    color_lucard_gamemode: '#7ac943',
    gamemode: 'osu',

},reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');

    // 路径定义
    let reg_banner = '${banner}';
    let reg_judge_background = '${judge_background}';
    let reg_judge_fc = '${judge_fc}';
    let reg_judge_nm = '${judge_nm}';
    let reg_judge_cl = '${judge_cl}';
    let reg_judge_pl = '${judge_pl}';
    let reg_colored_circle = '${colored_circle}';
    let reg_colored_ring = '${colored_ring}';
    let reg_score_rank = '${score_rank}';
    let reg_mod1 = '${mod1}';
    let reg_mod2 = '${mod2}';
    let reg_mod3 = '${mod3}';
    let reg_mod4 = '${mod4}';
    let reg_mod5 = '${mod5}';
    let reg_star = '${star}';
    let reg_map_background = '${map_background}';
    let reg_map_hexagon = '${map_hexagon}';
    let reg_map_favorite = '${map_favorite}';
    let reg_map_playcount = '${map_playcount}';
    let reg_map_status = '${map_status}';

    let reg_index = /(?<=<g id="Index">)/;

    // 卡片定义
    let label_acc = await label_E(data.label_acc,true);
    let label_combo = await label_E(data.label_combo,true);
    let label_pp = await label_E(data.label_pp,true);
    let label_bpm = await label_E(data.label_bpm,true);
    let label_length = await label_E(data.label_length,true);
    let label_cs = await label_E(data.label_cs,true);
    let label_ar = await label_E(data.label_ar,true);
    let label_od = await label_E(data.label_od,true);
    let label_hp = await label_E(data.label_hp,true);
    let card_A1_impl = await card_A1(data.card_A1, true);

    // 文字定义
    let index_lu = torus.getTextPath(data.index_lu, 10, 26.84, 24, "left baseline", "#fff");
    let index_ru = torus.getTextPath(data.index_ru, 1910, 26.84, 24, "right baseline", "#fff");
    let tm_index_panel_name =
        torus.getTextMetrics(data.index_panel_name, 0, 0, 48, "left baseline", "#fff");
    let index_panel_name_x = 607.5 - tm_index_panel_name.width / 2;
    let index_panel_name = torus.getTextPath(data.index_panel_name, index_panel_name_x, 83.67, 48, "left baseline", "#fff");

    let tm_lucard_sr_b =
        torus.getTextMetrics(data.lucard_sr_b, 0, 0, 48, "left baseline", "#fff");
    let tm_lucard_sr_m =
        torus.getTextMetrics(data.lucard_sr_m, 0, 0, 36, "left baseline", "#fff");
    let tm_lucard_sr_x = 160 - (tm_lucard_sr_b.width + tm_lucard_sr_m.width)/2;
    let lucard_sr = torus.getTextPath(data.lucard_sr_b, tm_lucard_sr_x, 373.67, 48, "left baseline", "#fff") +
        torus.getTextPath(data.lucard_sr_m, tm_lucard_sr_x + tm_lucard_sr_b.width, 373.67, 36, "left baseline", "#fff");
    let lucard_gamemode = extra.getTextPath(data.lucard_gamemode, 48, 376.24, 48, "left baseline", data.color_lucard_gamemode);

    let lums_fav = torus.getTextPath(data.lums_fav, 840, 353.84, 24, "right baseline", "#fff");
    let lums_pc = torus.getTextPath(data.lums_pc, 840, 380.84, 24, "right baseline", "#fff");

    let lbmt_title_romanized = torus.getTextPath(data.lbmt_title_romanized, 440, 883.67, 48, "center baseline", "#fff");
    let lbmt_title_unicode = PuHuiTi.getTextPath(data.lbmt_title_unicode, 440, 931.6, 36, "center baseline", "#fff");
    let lbmt_difficulty = torus.getTextPath(data.lbmt_difficulty, 440, 1004.75, 36, "center baseline", "#fff");
    let lbmt_artist_mapper_bid = torus.getTextPath(data.lbmt_artist_mapper_bid, 440, 1036.84, 24, "center baseline", "#fff");

    let mu_score = torus.getTextPath(data.mu_score_b, 1215, 409.43, 84, "left baseline", "#fff") +
        torus.getTextPath(data.mu_score_m, 1215 +
            torus.getTextMetrics(data.mu_score_b, 0, 0, 84, "left baseline", "#fff").width,
            409.43, 60, "left baseline", "#fff");

    // 成绩评级
    // 我不会写，写第一个位置哈，其他的y往下偏移40就行

    const judge = (i, data, sum) => {
        let font_y = 412.79 + i * 40;
        let font_index_x = 1266;
        let font_stat_x = 1792;

        let index = torus.getTextPath(data.index,
            font_index_x, font_y, 30, "right baseline", data.index_color);
        let stat = torus.getTextPath(data.stat,
            font_stat_x, font_y, 30, "left baseline", data.stat_color);
        svg = replaceText(svg, index, reg_index);
        svg = replaceText(svg, stat, reg_index);
        if (data.stat > 0) {
            let rect_width = 500 * data.stat / sum
            let svg_rect = `<rect id="L${i}RRect" x="1280" y="${390 + 40 * i}" width="${Math.max(rect_width, 20)}" height="28" rx="10" ry="10" style="fill: ${data.rrect_color};"/>`;
            svg = replaceText(svg, svg_rect, /(?<=<g id="MMScoreRRect">)/);
        }
    };

    for (let i = 1; i <= 6; i++) {
        if (data.score_stats[`judge_${i}`]) {
            judge(i, data.score_stats[`judge_${i}`], data.score_stats.judge_stat_sum);
        }
    }

    // 插入文字和颜色
    svg = replaceText(svg, index_lu, reg_index);
    svg = replaceText(svg, index_ru, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);
    svg = replaceText(svg, lucard_sr, reg_index);
    svg = replaceText(svg, lucard_gamemode, reg_index);
    svg = replaceText(svg, lums_fav, reg_index);
    svg = replaceText(svg, lums_pc, reg_index);
    svg = replaceText(svg, lbmt_title_romanized, reg_index);
    svg = replaceText(svg, lbmt_title_unicode, reg_index);
    svg = replaceText(svg, lbmt_difficulty, reg_index);
    svg = replaceText(svg, lbmt_artist_mapper_bid, reg_index);
    svg = replaceText(svg, mu_score, reg_index);

    // 插入图片
    let out_svg = new InsertSvgBuilder(svg)
        .insertImage(data.banner, reg_banner)
        .insertImage(data.judge_background, reg_judge_background)
        .insertImage(data.judge_fc, reg_judge_fc)
        .insertImage(data.judge_nm, reg_judge_nm)
        .insertImage(data.judge_cl, reg_judge_cl)
        .insertImage(data.judge_pl, reg_judge_pl)
        .insertImage(data.colored_circle, reg_colored_circle)
        .insertImage(data.colored_ring, reg_colored_ring)
        .insertImage(data.score_rank, reg_score_rank)
        .insertImage(data.mod1, reg_mod1)
        .insertImage(data.mod2, reg_mod2)
        .insertImage(data.mod3, reg_mod3)
        .insertImage(data.mod4, reg_mod4)
        .insertImage(data.mod5, reg_mod5)
        .insertImage(data.star, reg_star)
        .insertImage(data.map_background, reg_map_background)
        .insertImage(data.map_hexagon, reg_map_hexagon)
        .insertImage(data.map_favorite, reg_map_favorite)
        .insertImage(data.map_playcount, reg_map_playcount)
        .insertImage(data.map_status, reg_map_status);
    await out_svg.insertSvg(card_A1_impl, 40, 40);
    await out_svg.insertSvg(label_acc, 1230, 680);
    await out_svg.insertSvg(label_combo, 1440, 680);
    await out_svg.insertSvg(label_pp, 1650, 680);
    await out_svg.insertSvg(label_bpm, 1440, 790);
    await out_svg.insertSvg(label_length, 1650, 790);
    await out_svg.insertSvg(label_cs, 1440, 870);
    await out_svg.insertSvg(label_ar, 1650, 870);
    await out_svg.insertSvg(label_od, 1440, 950);
    await out_svg.insertSvg(label_hp, 1650, 950);

    return out_svg.export(reuse);
}

export async function panel_I(data = {
    background: readImage("image/I_CardH_BG.png"),
    avatar: readImage("image/I_CardH_Avatar.png"),
    name: 'Muziyami',
    info: '39.2M // 99W-0L 100%',
    rank: '#1',
    pp_b: '264',
    pp_m: 'pp',
    color_score: '#fbb03b',
    color_base: '#3fa9f5',
}) {
    let reg_background = '${background}'
    //
    let reg_height = /(?<=id="Background">[\s\S]*height=")\d+/
    let reg_cards = /(?<=<g id="cardH">)/
    let reg_text = /(?<=<g id="Text">)/;

    const get = (path, x, y) => {
        return `<image width="900" height="110" x="${x}" y="${y}" xlink:href="${path}" />`
    }

    let bg1 = await card_H(data, true);
    data.pp_b = '15';
    let bg2 = await card_H(data, true);


    let a1 = torus.getTextPath("24", 20, 97, 24, 'left center', "#fff");
    let a2 = torus.getTextPath("16", 120, 97, 16, 'left center', "#fff");
    let a3 = torus.getTextPath("12", 220, 97, 12, 'left center', "#fff");
    let svg = readTemplate("template/Panel_I.svg");

    svg = svg.replace(reg_text, a1);
    svg = svg.replace(reg_text, a2);
    svg = svg.replace(reg_text, a3);


    let out_svg = new InsertSvgBuilder(svg);
    await out_svg.insertSvg(bg1, 10, 100);
    await out_svg.insertSvg(bg2, 10, 400);
    await out_svg.insertSvg(bg1, 300, 210);
    await out_svg.insertSvg(bg2, 300, 510);
    return out_svg.export();
}

