import {getMapStatusImage, setImage, isASCII, setTexts} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";

export function component_IM2(data = {
    background: '',
    map_status: '',

    title1: '',
    title2: '',
    left1: '',
    left2: '',
    left3: '',
    right1: '',
    right2b: '',
    right2m: '',
}) {
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
    const title1_font = isASCII(data?.title1) ? torus : PuHuiTi;
    const title2_font = isASCII(data?.title2) ? torus : PuHuiTi;
    const left1_font = isASCII(data?.left1) ? torus : PuHuiTi;
    const left2_font = isASCII(data?.left2) ? torus : PuHuiTi;
    const left3_font = isASCII(data?.left3) ? torus : PuHuiTi;

    const title1_size = isASCII(data?.title1) ? 24 : 22;
    const title2_size = isASCII(data?.title2) ? 18 : 16;
    const left1_size = isASCII(data?.left1) ? 18 : 16;
    const left2_size = isASCII(data?.left2) ? 18 : 16;
    const left3_size = isASCII(data?.left3) ? 18 : 16;

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
    const title1 = title1_font.getTextPath(title1_font.cutStringTail(data.title1, title1_size, title_maxWidth)
        , 16, 27, title1_size, 'left baseline', '#fff');
    const title2 = title2_font.getTextPath(title2_font.cutStringTail(data.title2, title2_size, title_maxWidth)
        , 16, 51, title2_size, 'left baseline', '#fff');
    const left1 = left1_font.getTextPath(left1_font.cutStringTail(data.left1, left1_size, left1_maxWidth)
        , 16, 75, left1_size, 'left baseline', '#fff');
    const left2 = left2_font.getTextPath(left2_font.cutStringTail(data.left2, left2_size, left2_maxWidth)
        , 16, 97, left2_size, 'left baseline', '#fff');
    const left3 = left3_font.getTextPath(left3_font.cutStringTail(data.left3, left3_size, left2_maxWidth)
        , 16, 119, left3_size, 'left baseline', '#fff');
    const right1 = torus.getTextPath(data.right1, 280, 75, 18, 'right baseline', '#fff');
    const right2 = torus.get2SizeTextPath(data.right2b, data.right2m, 48, 36, 280, 119, 'right baseline', '#fff');

    svg = setTexts(svg, [title1, title2, left1, left2, left3, right1, right2], reg_text);

    // 插入背景
    const status = getMapStatusImage(data.map_status || '');
    const background = data.background || '';
    svg = data.map_status ? setImage(svg, 244, 8, 40, 40, status, reg_top_icons, 1) : svg;
    svg = setImage(svg, 0, 0, 290, 130, background, reg_background, 0.6);

    return svg.toString();
}
