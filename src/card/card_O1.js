import {getExportFileV3Path, implantImage, implantSvgBody, replaceText} from "../util.js";
import {torus} from "../font.js";
import {label_M1} from "../component/label.js";

export async function card_O1(data = {
    background: getExportFileV3Path('card-default.png'),
    avatar: getExportFileV3Path('avatar-guest.png'),

    name: 'Who',
    groups: []
}, reuse = false) {
    // 读取模板
    let svg =`   <defs>
            <clipPath id="clippath-CO1-1">
              <rect width="390" height="210" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CO1-2">
              <rect x="145" y="15" width="100" height="100" rx="10" ry="10" style="fill: none;"/>
            </clipPath>
          </defs>
          <g id="Background_CO1">
            <rect width="100" height="100" rx="20" ry="20" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CO1-1);">
            </g>
          </g>
          <g id="Label_CO1">
          </g>
          <g id="Avatar_CO1">
            <g style="clip-path: url(#clippath-CO1-2);">
            </g>
          </g>
          <g id="Text_CO1">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CO1">)/;
    const reg_label = /(?<=<g id="Label_CO1">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CO1-1\);">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CO1-2\);">)/;

    // 插入文本
    const title = torus.getTextPath(data.name, 195, 155, 36, 'center baseline', '#fff');

    svg = replaceText(svg, title, reg_text);

    // 插入标签，如果空的，给一个默认的标识
    const groups = (data.groups.length >= 1) ? data.groups : [{
        "colour": "#382E32",
        "id": -1,
        "identifier": "user",
        "name": "Normal User",
        "short_name": "USER",
    }];
    const group_count = Math.min(groups.length, 4);

    for (let i = 0; i < group_count; i++) {
        const v = groups[i];
        const w = group_count * 90 - 10;
        const sx = (390 - w) / 2;
        const x = sx + i * 90;
        const y = 170;

        const labelM1 = await label_M1(v, true);
        svg = implantSvgBody(svg, x, y, labelM1, reg_label);
    }
    // 插入头像
    svg = implantImage(svg, 100, 100, 145, 15, 1, data.avatar, reg_avatar);

    // 插入背景
    svg = implantImage(svg, 390, 210, 0, 0, 0.6, data.background, reg_background);

    return svg.toString();
}
