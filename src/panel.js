import {InsertSvgBuilder, readImage, readTemplate, torus} from "./util.js";
import {card_H} from "./card.js";


export async function panel_E(data = {
    bg_background: readImage("image/E_Background.jpg"),
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
}, reuse = false) {

    let reg_bg_background = '${bg_background}';
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

    let svg = readTemplate('template/Panel_E.svg');

    let out_svg = new InsertSvgBuilder(svg)
        .insertImage(data.bg_background, reg_bg_background)
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
        .insertImage(data.star, reg_star);

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

