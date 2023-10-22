import {
    getExportFileV3Path,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr, implantImage, implantSvgBody,
    readTemplate, replaceText, replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_E, PPM_OPTION} from "../component/label.js";
import {getRankColor} from "../util/color.js";

export async function card_B1(data = {
    parameter: 'ACC',
    number: 11.45141919810
}, reuse = false, isReverse = false) {
    //读取面板
    let svg = readTemplate("template/Card_B1.svg");

    // 路径定义
    let reg_label = /(?<=<g id="Label">)/;
    let reg_text = /(?<=<g id="Text">)/;
    let reg_bg1 = /(?<=<g style="clip-path: url\(#clippath-B1-1\);">)/;
    let reg_bg2 = /(?<=<g style="clip-path: url\(#clippath-B1-2\);">)/;
    let reg_rect = '${reg_rect}';

    //导入标签
    let parameter = data.parameter.toUpperCase();

    let label = await label_E({...PPM_OPTION[parameter]}, true);

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
    let rank = getPPMRank(data.number);
    let color = getPPMColor(rank);
    let background = getRankBG(rank);
    let number_b = getRoundedNumberLargerStr(data.number,2);
    let number_m = getRoundedNumberSmallerStr(data.number,2);

    let rank_text = torus.getTextPath(rank, judge_x_center, 68, 60, 'center baseline', color);
    let number_text = torus.get2SizeTextPath(number_b, number_m,60, 36, 370 + card_x, 68, 'right baseline', '#fff');

    svg = replaceTexts(svg, [rank_text, number_text], reg_text);

    if (isReverse) {
        svg = implantImage(svg,390, 95, card_x, 0, 0.3, background, reg_bg2);
    } else {
        svg = implantImage(svg,390, 95, card_x, 0, 0.3, background, reg_bg1);
    }

    return svg.toString();
}

function getRankBG(rank = 'F') {
    if (rank === 'X+' || rank === 'SS') rank = 'X';
    if (rank === 'S+') rank = 'S';
    return getExportFileV3Path(`object-score-backimage-${rank}.jpg`)
}

function getPPMRank (data = 0) {
    let rank;

    if (data >= 120) {
        rank = 'X+';
    } else if (data >= 100) {
        rank = 'SS';
    } else if (data >= 95) {
        rank = 'S+';
    } else if (data >= 90) {
        rank = 'S';
    } else if (data >= 80) {
        rank = 'A';
    } else if (data >= 70) {
        rank = 'B';
    } else if (data >= 60) {
        rank = 'C';
    } else if (data > 0) {
        rank = 'D';
    } else {
        rank = 'F';
    }

    return rank;
}

function getPPMColor (rank = 'F') {
    return getRankColor(rank);
}