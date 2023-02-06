import {exportPng, getBase64Text, readImage, readTemplate, replaceText, SaveFiles} from "./util.js";
import {card_A1, card_H} from "./card.js";


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



}, getSVG = false) {

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


    svg = replaceText(svg, getBase64Text(data.bg_background), reg_bg_background);
    svg = replaceText(svg, getBase64Text(data.judge_fc), reg_judge_fc);
    svg = replaceText(svg, getBase64Text(data.judge_nm), reg_judge_nm);
    svg = replaceText(svg, getBase64Text(data.judge_cl), reg_judge_cl);
    svg = replaceText(svg, getBase64Text(data.judge_pl), reg_judge_pl);
    svg = replaceText(svg, getBase64Text(data.colored_circle), reg_colored_circle);
    svg = replaceText(svg, getBase64Text(data.colored_ring), reg_colored_ring);
    svg = replaceText(svg, getBase64Text(data.score_rank), reg_score_rank);
    svg = replaceText(svg, getBase64Text(data.mod1), reg_mod1);
    svg = replaceText(svg, getBase64Text(data.mod2), reg_mod2);
    svg = replaceText(svg, getBase64Text(data.mod3), reg_mod3);
    svg = replaceText(svg, getBase64Text(data.mod4), reg_mod4);
    svg = replaceText(svg, getBase64Text(data.mod5), reg_mod5);
    svg = replaceText(svg, getBase64Text(data.star), reg_star);


    return getSVG ? svg : exportPng(svg);
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

    const get = (path,x, y) => {
        return `<image width="900" height="110" x="${x}" y="${y}" xlink:href="${path}" />`
    }

    let bg1 = await card_H(data, true);
    let bg2 = await card_H(data, true);
    const f = new SaveFiles();
    f.saveSvgText(bg1);
    f.saveSvgText(bg2);
    let svg = readTemplate("template/Panel_I.svg");
    svg = svg.replace(reg_height, "100");



    let out = await exportPng(svg);
    f.remove()
    return out;
}

