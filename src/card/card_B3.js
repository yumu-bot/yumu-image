import {setImage} from "../util/util.js";
import {getMascotName, getMascotPath} from "../util/mascotBanner.js";

export async function card_B3(data = {
    game_mode: 'osu'
}) {
    //读取面板
    let svg = `
    <defs>
        <clipPath id="clippath-PB3-1">
            <rect width="530" height="710" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
    </defs>
    <g id="Mascot">
        <g style="clip-path: url(#clippath-PB3-1);">
        </g>
    </g>
    `

    // 路径定义
    const reg_mascot = /(?<=<g style="clip-path: url\(#clippath-PB3-1\);">)/;

    // 230817 插入吉祥物
    const mascot_name_data = getMascotName(data.game_mode);
    const mascot_link = getMascotPath(mascot_name_data);

    svg = setImage(svg, 0, 0, 530, 710, mascot_link, reg_mascot, 1);

    return svg.toString();

}