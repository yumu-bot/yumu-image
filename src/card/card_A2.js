import {
    getImageFromV3,
    getMapStatusImage,
    implantImage, isASCII,
    readTemplate,
    replaceTexts,
} from "../util/util.js";
import {torus, PuHuiTi} from "../util/font.js";

export function card_A2(data = {
    background: getImageFromV3('card-default.png'),
    map_status: '',

    title1: '',
    title2: '',
    title3: '',
    left1: '',
    left2: '',
    left3: '',
    right1: '',
    right2: '',
    right3b: '',
    right3m: '',

    right3b_size: 60,
    right3m_size: 48,

}) {
    // 读取模板
    let svg = readTemplate('template/Card_A2.svg');

    // 路径定义
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CA2-1\);">)/;
    let reg_top_icons = /(?<=<g id="TopIcons">)/;

    //赋予字体
    const title_font = isASCII(data?.title1) ? torus : PuHuiTi
    const title2_font = isASCII(data?.title2) ? torus : PuHuiTi
    const title3_font = isASCII(data?.title3) ? torus : PuHuiTi
    const left1_font = isASCII(data?.left1) ? torus : PuHuiTi
    const left2_font = isASCII(data?.left2) ? torus : PuHuiTi
    const left3_font = isASCII(data?.left3) ? torus : PuHuiTi
    const title_size = isASCII(data?.title1) ? 36 : 32
    const title2_size = isASCII(data?.title2) ? 24 : 22
    const title3_size = isASCII(data?.title3) ? 24 : 22
    const left1_size = isASCII(data?.left1) ? 24 : 22
    const left2_size = isASCII(data?.left2) ? 24 : 22
    const left3_size = isASCII(data?.left3) ? 24 : 22

    // 宽度限制
    const title1_maxWidth = data.map_status ? 350 : 390;
    const title_maxWidth = 390;

    const right3_width = torus.getTextWidth(data.right3b, 60) + torus.getTextWidth(data.right3m, 48);
    const left_maxWidth = 390 - right3_width;

    // 文字定义

    const title1 = title_font.getTextPath(
        title_font.cutStringTail(data.title1, title_size, title1_maxWidth),
        20, 46.6 - 1.8, title_size, 'left baseline', '#fff');
    const title2 = title2_font.getTextPath(
        title2_font.cutStringTail(data.title2, title2_size, title_maxWidth),
        20, 77.4, title2_size, 'left baseline', '#fff');
    const title3 = title3_font.getTextPath(
        title3_font.cutStringTail(data.title3, title3_size, title_maxWidth),
        20, 107.4, title3_size, 'left baseline', '#fff');

    const left1 = left1_font.getTextPath(
        torus.cutStringTail(data.left1, left1_size, left_maxWidth, true),
        20, 140.836, left1_size, 'left baseline', '#fff');
    const left2 = left2_font.getTextPath(
        torus.cutStringTail(data.left2, 24, left_maxWidth, true),
        20, 165.836, left2_size, 'left baseline', '#fff');
    const left3 = left3_font.getTextPath(
        torus.cutStringTail(data.left3, 24, left_maxWidth, true),
        20, 191.836, left3_size, 'left baseline', '#fff');

    const right1 = torus.getTextPath(data.right1, 420, 114.836 - 2, 24, 'right baseline', '#fff');
    const right2 = torus.getTextPath(data.right2, 420, 141.836, 24, 'right baseline', '#fff');
    const right3 = torus.get2SizeTextPath(data.right3b, data.right3m,
        data?.right3b_size || 60, data?.right3m_size || 48,
        420, 191.59, 'right baseline', '#fff');

    // 插入谱面状态
    const status = getMapStatusImage(data.map_status || '');
    const background = data.background || getImageFromV3('beatmap-DLfailBG.jpg');

    svg = implantImage(svg, 430, 210, 0, 0, 0.6, background, reg_background);
    svg = data.map_status ? implantImage(svg,50,50,370,10,1, status, reg_top_icons) : svg;

    svg = replaceTexts(svg, [title1, title2, title3, right1, right2, right3, left1, left2, left3], reg_text);

    return svg.toString();
}