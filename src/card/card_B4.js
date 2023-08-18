import {
    getExportFileV3Path,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr, getStarRatingColor, implantImage, implantSvgBody,
    readTemplate, replaceText, replaceTexts, torus
} from "../util.js";
import {label_E, PPM_OPTION} from "../component/label.js";

export async function card_B4(data = {
    parameter: 'RC',
    number: 11.45141919810
}, reuse = false, isReverse = false) {
    //这个是基于B1卡片改过来的
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

    const label = await label_E({...PPM_OPTION[parameter]}, true);

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
    const rank = getMMRank(data.number);
    const color = getMMColor(data.number);
    const background = getMMBG(rank);
    const number_b = getRoundedNumberLargerStr(data.number,3);
    const number_m = getRoundedNumberSmallerStr(data.number,3);

    const rank_text = torus.getTextPath(rank, judge_x_center, 68, 60, 'center baseline', color);
    const number_text = torus.get2SizeTextPath(number_b, number_m,60, 36, 370 + card_x, 68, 'right baseline', '#fff');

    svg = replaceTexts(svg, [rank_text, number_text], reg_text);

    if (isReverse) {
        svg = implantImage(svg,390, 95, card_x, 0, 0.3, background, reg_bg2);
    } else {
        svg = implantImage(svg,390, 95, card_x, 0, 0.3, background, reg_bg1);
    }

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

function getMMColor (star = 0) {
    if (star <= 7) {
        return getStarRatingColor(star);
    } else {
        return '#fff'
    }
}