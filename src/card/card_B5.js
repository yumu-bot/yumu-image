import {
    getExportFileV3Path, getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr, implantImage, implantSvgBody,
    readTemplate, replaceTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_E, PPM_OPTION} from "../component/label.js";
import {getRankColor} from "../util/color.js";

export async function card_B5(data = {
    parameter: 'RC',
    number: 11.45141919810
}, reuse = false) {
    //这个是基于B2卡片改过来的
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
    const rank = getMMRank(data.number);
    const color = getRankColor(rank);
    const background = getMMBG(rank);
    const number_b = getRoundedNumberLargerStr(data.number,3);
    const number_m = getRoundedNumberSmallerStr(data.number,3);

    let rank_text = torus.getTextPath(rank, 305, 58, 60, 'right baseline', color);
    let number_text = torus.get2SizeTextPath(number_b, number_m,60, 36, 160, 140, 'center baseline', '#fff');

    svg = replaceTexts(svg, [rank_text, number_text], reg_text);
    svg = implantImage(svg,320, 160, 0, 0, 0.3, background, reg_background);

    return svg.toString();
}

function getMMBG(rank = 'F') {
    if (rank === 'X+' || rank === 'SS') rank = 'X';
    if (rank === 'S+') rank = 'S';
    return getExportFileV3Path(`object-score-backimage-${rank}.jpg`)
}

function getMMRank (data = 0) {
    let rank;

    if (data >= 8) {
        rank = 'X+';
    } else if (data >= 7) {
        rank = 'SS';
    } else if (data >= 6) {
        rank = 'S+';
    } else if (data >= 5) {
        rank = 'S';
    } else if (data >= 4) {
        rank = 'A';
    } else if (data >= 3) {
        rank = 'B';
    } else if (data >= 2) {
        rank = 'C';
    } else if (data > 0) {
        rank = 'D';
    } else {
        rank = 'F';
    }

    return rank;
}