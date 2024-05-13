import {
    getImageFromV3, getRoundedNumberStrLarge,
    getRoundedNumberStrSmall, implantImage, implantSvgBody,
    readTemplate, replaceText, replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_E, LABEL_PPM} from "../component/label.js";
import {getRankColor} from "../util/color.js";

export async function card_B6(data = {
    parameter: 'RC',
    number: 11.45141919810,
    level: 6
}, isReverse = false) {
    //这个是基于B1，B4卡片改过来的
    //读取面板
    let svg = readTemplate("template/Card_B1.svg");

    // 路径定义
    const reg_label = /(?<=<g id="Label">)/;
    const reg_text = /(?<=<g id="Text">)/;
    const reg_bg1 = /(?<=<g style="clip-path: url\(#clippath-B1-1\);">)/;
    const reg_bg2 = /(?<=<g style="clip-path: url\(#clippath-B1-2\);">)/;
    const reg_rect = '${reg_rect}';

    //导入标签
    const parameter = data.parameter.toUpperCase();

    const label = await label_E({...LABEL_PPM[parameter]});

    //判断是左标签右评级还是左评级右标签。
    let card_x = 20;
    let judge_x_center = 470;

    if (isReverse) {
        card_x = 120;
        judge_x_center = 60;
    }

    //如果是右标签，则替换rect的x
    svg = replaceText(svg, card_x, reg_rect);

    svg = implantSvgBody(svg, card_x + 20, 22, label, reg_label);

    //添加评级和值和背景
    const rank = getPlusRank(data.level);
    const roman = getPlusRoman(data.level);
    const color = getRankColor(rank);
    const background = getPlusBG(rank);
    const number_b = getRoundedNumberStrLarge(data.number,-2);
    const number_m = getRoundedNumberStrSmall(data.number,-2);

    const rank_text = torus.getTextPath(roman, judge_x_center, 68, 60, 'center baseline', color);
    const number_text = torus.get2SizeTextPath(number_b, number_m,60, 36, 370 + card_x, 68, 'right baseline', '#fff');

    svg = replaceTexts(svg, [rank_text, number_text], reg_text);

    if (isReverse) {
        svg = implantImage(svg,390, 95, card_x, 0, 0.3, background, reg_bg2);
    } else {
        svg = implantImage(svg,390, 95, card_x, 0, 0.3, background, reg_bg1);
    }

    return svg.toString();
}

function getPlusBG(rank = 'F') {
    if (rank === 'X+' || rank === 'SS') rank = 'X';
    if (rank === 'S+') rank = 'S';
    return getImageFromV3(`object-score-backimage-${rank}.jpg`)
}

function getPlusRank(data = 0) {
    let rank;

    if (data >= 11) {
        rank = 'X+';
    } else if (data >= 9) {
        rank = 'SS';
    } else if (data >= 7) {
        rank = 'S+';
    } else if (data >= 5) {
        rank = 'S';
    } else if (data >= 3) {
        rank = 'A';
    } else if (data >= 2) {
        rank = 'B';
    } else if (data >= 1) {
        rank = 'C';
    } else if (data >= 0.5) {
        rank = 'D';
    } else {
        rank = 'F';
    }

    return rank;
}

function getPlusRoman(data = 0) {
    const number_arr = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'EX'];

    if (data < 1) return 'F';
    if (data > 11) return 'EX';

    return number_arr[Math.round(data - 1)];
}