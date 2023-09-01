import {
    getExportFileV3Path,
    getMapStatusV3Path,
    implantImage,
    readTemplate,
    replaceTexts,
} from "../util.js";
import {torus, PuHuiTi} from "../font.js";

export async function card_A2(data = {
    background: getExportFileV3Path('card-default.png'),
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

    //赋予字体
    let title_font;
    if (data.title_font === 'PuHuiTi') {
        title_font = PuHuiTi;
    } else {
        title_font = torus;
    }

    // 宽度限制
    const title1_maxWidth = data.map_status ? 350 : 390;
    const title_maxWidth = 390;

    const right3_width = torus.getTextWidth(data.right3b, 60) + torus.getTextWidth(data.right3m, 48);
    const left_maxWidth = 390 - right3_width;

    // 文字定义

    const title1 = title_font.getTextPath(
        title_font.cutStringTail(data.title1, 36, title1_maxWidth),
        20, 46.6, 36, 'left baseline', '#fff');
    const title2 = title_font.getTextPath(
        title_font.cutStringTail(data.title2, 24, title_maxWidth),
        20, 77.4, 24, 'left baseline', '#fff');
    const title3 = title_font.getTextPath(
        title_font.cutStringTail(data.title3, 24, title_maxWidth),
        20, 107.4, 24, 'left baseline', '#fff');

    const left1 = torus.getTextPath(
        torus.cutStringTail(data.left1, 20, left_maxWidth, true),
        20, 140.836, 24, 'left baseline', '#fff');
    const left2 = torus.getTextPath(
        torus.cutStringTail(data.left2, 20, left_maxWidth, true),
        20, 165.836, 24, 'left baseline', '#fff');
    const left3 = torus.getTextPath(
        torus.cutStringTail(data.left3, 20, left_maxWidth, true),
        20, 191.836, 24, 'left baseline', '#fff');

    const right1 = torus.getTextPath(data.right1, 420, 114.836, 24, 'right baseline', '#fff');
    const right2 = torus.getTextPath(data.right2, 420, 141.836, 24, 'right baseline', '#fff');
    const right3 = torus.get2SizeTextPath(data.right3b, data.right3m, 60, 48, 420, 191.59, 'right baseline', '#fff');
        /*
        torus.getTextPath(data.right3b,
            420 - torus.getTextWidth(data.right3m, 48),
            191.59, 60, 'right baseline', '#fff') +
        torus.getTextPath(data.right3m, 420, 191.59, 48, 'right baseline', '#fff');

         */

    // 插入谱面状态
    let status = getMapStatusV3Path(data.map_status || '');
    let background = data.background || getExportFileV3Path('beatmap-DLfailBG.jpg');

    svg = implantImage(svg,430,210,0,0,0.5, background, reg_background);
    svg = data.map_status ? implantImage(svg,50,50,370,10,1, status, reg_top_icons) : svg;

    svg = replaceTexts(svg, [title1, title2, title3, right1, right2, right3, left1, left2, left3], reg_text);

    return svg.toString();
}