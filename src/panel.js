import {InsertSvgBuilder, readImage, readTemplate, torus} from "./util.js";
import {card_H} from "./card.js";
import {label_E} from "./component.js";


export async function panel_E(data = {
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
},reuse = false) {

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

    let label_acc = await label_E(data.label_acc,true);
    let label_combo = await label_E(data.label_combo,true);
    let label_pp = await label_E(data.label_pp,true);
    let label_bpm = await label_E(data.label_bpm,true);
    let label_length = await label_E(data.label_length,true);
    let label_cs = await label_E(data.label_cs,true);
    let label_ar = await label_E(data.label_ar,true);
    let label_od = await label_E(data.label_od,true);
    let label_hp = await label_E(data.label_hp,true);

    let svg = readTemplate('template/Panel_E.svg');

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
        .insertImage(data.map_status, reg_map_status)
        .insertSvg(label_acc, 1230, 680)
        .insertSvg(label_combo, 1440, 680)
        .insertSvg(label_pp, 1650, 680)
        .insertSvg(label_bpm, 1440, 790)
        .insertSvg(label_length, 1650, 790)
        .insertSvg(label_cs, 1440, 870)
        .insertSvg(label_ar, 1650, 870)
        .insertSvg(label_od, 1440, 950)
        .insertSvg(label_hp, 1650, 950)

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


    return new InsertSvgBuilder(svg)
        .insertSvg(bg1, 10, 100)
        .insertSvg(bg2, 10, 400)
        .insertSvg(bg1, 300, 210)
        .insertSvg(bg2, 300, 510)
        .export();
}

