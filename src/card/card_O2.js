import {getExportFileV3Path, implantImage, replaceText, torus} from "../util.js";

export async function card_O2(data = {
    background: getExportFileV3Path('card-default.png'),
    avatar: getExportFileV3Path('avatar-guest.png'),

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
    let svg =`   <defs>
            <clipPath id="clippath-CO2-1"/>
              <rect width="390" height="210" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CO2-2">
              <rect x="145" y="15" width="100" height="100" rx="10" ry="10" style="fill: none;"/>
            </clipPath>
          </defs>
          <g id="Background_CO2">
            <rect width="100" height="100" rx="20" ry="20" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CO2-1);">
            </g>
          </g>
          <g id="Label_CO2">
          </g>
          <g id="Avatar_CO2">
            <g style="clip-path: url(#clippath-CO2-2);">
            </g>
          </g>
          <g id="Text_CO2">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CO2">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CO2-1\);">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CO2-2\);">)/;

    // 插入文本
    const title = torus.getTextPath(data.name, 195, 155, 36, 'center baseline', '#fff');

    svg = replaceText(svg, title, reg_text);

    // 插入头像
    svg = implantImage(svg, 100, 100, 145, 15, 1, data.avatar, reg_avatar);

    // 插入背景
    svg = implantImage(svg, 390, 210, 0, 0, 0.6, data.background, reg_background);

    return svg.toString();
}
