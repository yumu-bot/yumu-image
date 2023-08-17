import {
    getExportFileV3Path,
    getRankColor,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr, implantImage, implantSvgBody,
    readTemplate, replaceTexts, torus
} from "../util.js";
import {label_E, PPM_OPTION} from "../component/label.js";

export async function card_B2(data = {
    parameter: 'ACC',
    number: 11.45141919810
}, reuse = false) {
    //读取面板
    let svg = readTemplate("template/Card_B2.svg");

    // 路径定义
    let reg_label = /(?<=<g id="Label">)/;
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-B2-1\);">)/;

    //导入标签
    let parameter = data.parameter.toUpperCase();

    let label = await label_E({...PPM_OPTION[parameter]}, true);

    svg = implantSvgBody(svg, 20, 15, label, reg_label);

    //添加评级和值和背景
    let rank = getPPMRank(data.number);
    let color = getPPMColor(rank);
    let background = getRankBG(rank);
    let number_b = getRoundedNumberLargerStr(data.number,2);
    let number_m = getRoundedNumberSmallerStr(data.number,2);

    let rank_text;

    if (parameter !== 'SAN') {
        rank_text = torus.getTextPath(rank, 305, 58, 60, 'right baseline', color);
    } else {
        let sanityGrade = getSanityGrade (data.number);
        rank_text = torus.getTextPath(sanityGrade, 305, 58, 60, 'right baseline', color);
    }

    let number_text = torus.get2SizeTextPath(number_b, number_m,60, 36, 160, 140, 'center baseline', '#fff');

    svg = replaceTexts(svg, [rank_text, number_text], reg_text);
    svg = implantImage(svg,320, 160, 0, 0, 0.3, background, reg_background);

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
function getSanityGrade (data = 0) {
    let grade;

    if (data >= 120) {
        grade = '?';
    } else if (data >= 100) {
        grade = '++';
    } else if (data >= 95) {
        grade = '+';
    } else if (data >= 90) {
        grade = '-';
    } else if (data >= 80) {
        grade = '--';
    } else if (data >= 70) {
        grade = '!';
    } else if (data >= 60) {
        grade = '!!';
    } else if (data >= 20) {
        grade = '!!!';
    } else {
        grade = 'X';
    }

    return grade;
}

function getPPMColor (rank = 'F') {
    return getRankColor(rank);
}