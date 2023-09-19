import {getExportFileV3Path, getMapStatusV3Path, implantImage, replaceTexts} from "../util.js";
import {torus} from "../font.js";

export async function card_O2(data = {
    background: '',
    map_status: '',

    title1: '',
    title2: '',
    title_font: torus,
    left1: '',
    left2: '',
    left3: '',
    right1: '',
    right2b: '',
    right2m: '',
}, reuse = false) {
    // 读取模板
    let svg =`
          <defs>
            <clipPath id="clippath-CO2-1">
              <rect width="290" height="130" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
          </defs>
          <g id="Background_CO2">
            <rect width="290" height="130" rx="20" ry="20" style="fill: #46393F;"/>
            <g style="clip-path: url(#clippath-CO2-1);">
            </g>
          </g>
          <g id="TopIcons_CO2">
          </g>
          <g id="Text_CO2">
          </g>`;
    // 赋予字体
    const title_font = data.title_font || torus;

    // 宽度限制
    const title_maxWidth = data.map_status ? 230 : 270;

    const right1_width = torus.getTextWidth(data.right1, 18);
    const right2_width = torus.getTextWidth(data.right2b, 48) + torus.getTextWidth(data.right2m, 36);
    const left1_maxWidth = 270 - right1_width;
    const left2_maxWidth = 270 - right2_width;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CO2">)/;
    const reg_top_icons = /(?<=<g id="TopIcons_CO2">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CO2-1\);">)/;

    // 插入文本
    const title1 = title_font.getTextPath(title_font.cutStringTail(data.title1, 24, title_maxWidth)
        , 16, 27, 24, 'left baseline', '#fff');
    const title2 = title_font.getTextPath(title_font.cutStringTail(data.title2, 18, title_maxWidth)
        , 16, 51, 18, 'left baseline', '#fff');
    const left1 = title_font.getTextPath(title_font.cutStringTail(data.left1, 18, left1_maxWidth)
        , 16, 75, 18, 'left baseline', '#fff');
    const left2 = title_font.getTextPath(title_font.cutStringTail(data.left2, 18, left2_maxWidth)
        , 16, 97, 18, 'left baseline', '#fff');
    const left3 = title_font.getTextPath(title_font.cutStringTail(data.left3, 18, left2_maxWidth)
        , 16, 119, 18, 'left baseline', '#fff');
    const right1 = title_font.getTextPath(data.right1, 280, 75, 18, 'right baseline', '#fff');
    const right2 = title_font.get2SizeTextPath(data.right2b, data.right2m, 48, 36, 280, 119, 'right baseline', '#fff');

    svg = replaceTexts(svg, [title1, title2, left1, left2, left3, right1, right2], reg_text);

    // 插入背景
    const status = getMapStatusV3Path(data.map_status || '');
    const background = data.background || '';
    svg = data.map_status ? implantImage(svg,40, 40, 240, 8, 1, status, reg_top_icons) : svg;
    svg = implantImage(svg, 290, 130, 0, 0, 0.6, background, reg_background);

    return svg.toString();
}
