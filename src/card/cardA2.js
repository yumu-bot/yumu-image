import {readTemplate, implantImage, replaceText, torus, getMapStatusPath, PuHuiTi} from "../util.js";

export async function card_A2(data = {
    background: 'PanelObject/A_CardA1_BG.png',
    map_status: '',

    title1: '',
    title2: '',
    title3: '',
    title_font: '',
    left1: '',
    left2: '',
    left3: '',
    right1: '',
    right2: '',
    right3b: '',
    right3m: '',

}, reuse = false) {
    // 读取模板
    let svg = readTemplate('template/Card_A2.svg');

    // 路径定义
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CA2-1\);">)/;
    let reg_top_icons = /(?<=<g id="TopIcons">)/;

    // 文字定义

    let title_font;
    if (data.title_font === 'torus') title_font = torus;
    if (data.title_font === 'PuHuiTi') title_font = PuHuiTi;

    let title1 = title_font.getTextPath(data.title1, 20, 46.6, 36, 'left baseline', '#fff');
    let title2 = title_font.getTextPath(data.title2, 20, 77.4, 24, 'left baseline', '#fff');
    let title3 = title_font.getTextPath(data.title3, 20, 107.4, 24, 'left baseline', '#fff');

    let left1 = title_font.getTextPath(data.left1, 20, 140.836, 24, 'left baseline', '#fff');
    let left2 = title_font.getTextPath(data.left2, 20, 165.836, 24, 'left baseline', '#fff');
    let left3 = title_font.getTextPath(data.left3, 20, 191.836, 24, 'left baseline', '#fff');

    let right1 = title_font.getTextPath(data.right1, 420, 114.836, 24, 'right baseline', '#fff');
    let right2 = title_font.getTextPath(data.right2, 420, 141.836, 24, 'right baseline', '#fff');
    let right3 = title_font.getTextPath(data.right3b,
            420 - title_font.getTextWidth(data.right3m, 48),
            191.59, 60, 'right baseline', '#fff') +
        title_font.getTextPath(data.right3m, 420, 191.59, 48, 'right baseline', '#fff');

    // 插入谱面状态
    let status = getMapStatusPath(data.map_status);
    let background = data.background || '';

    svg = implantImage(svg,430,210,0,0,0.5, background, reg_background)
    svg = implantImage(svg,50,50,370,10,1, status, reg_top_icons)

    svg = replaceText(svg, title1, reg_text);
    svg = replaceText(svg, title2, reg_text);
    svg = replaceText(svg, title3, reg_text);
    svg = replaceText(svg, right1, reg_text);
    svg = replaceText(svg, right2, reg_text);
    svg = replaceText(svg, right3, reg_text);
    svg = replaceText(svg, left1, reg_text);
    svg = replaceText(svg, left2, reg_text);
    svg = replaceText(svg, left3, reg_text);

    return svg.toString();
}