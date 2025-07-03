import {
    getImageFromV3,
    setImage,
    setText,
    setTexts,
    floor
} from "../util/util.js";
import {torusBold} from "../util/font.js";
import {getRankColor, getStarRatingColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getModCirclePath} from "../util/mod.js";

export function card_K(data = {
    background: '',
    star: 0,
    skill: [ 3.9850707, 3.2580092, 3.869737, 1.9129845, 4.86813, 4.008765 ],
    skill_color: '#fff',
    hexagon_color: '#fff',
    mods: [{acronym: ''}],
    rank: 'S',
}) {

    // 正则
    const reg_text = /(?<=<g id="Text">)/;
    const reg_hexagon = /(?<=<g id="Hexagon">)/;
    const reg_overlay = /(?<=<g id="Overlay">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CK-1\);">)/;

    // 读取模板

    let svg = `
  <defs>
    <clipPath id="clippath-CK-1">
      <rect width="235" height="118" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Base">
    <rect width="235" height="118" rx="20" ry="20" style="fill: #46393f;"/>
  </g>
  <g id="Background">
    <g style="clip-path: url(#clippath-CK-1);">
    </g>
  </g>
  <g id="Hexagon">
  </g>
  <g id="Text">
  </g>
  <g id="Overlay">
  </g>`;

    const star_color = getStarRatingColor(data?.star)
    const star_text_color = data?.star < 4 ? '#1c1719' : '#fff'
    const star_rrect = PanelDraw.Rect(10, 10, 40, 20, 10, star_color)
    const star = torusBold.getTextPath(floor((data?.star || 0), 2), 30, 26, 18, 'center baseline', star_text_color)

    const rank_color = getRankColor(data?.rank)
    const rank_text_color = data?.rank === 'X' || data?.rank === 'XH' ? '#1c1719' : '#fff'
    const rank_rrect = PanelDraw.Rect(185, 10, 40, 20, 10, rank_color)
    const rank = torusBold.getTextPath(data?.rank || 'F', 205, 26, 18, 'center baseline', rank_text_color)

    const mods = data?.mods || []

    for (let i = 0; i < mods.length; ++i) {
        const mod = mods[i]

        if (i < 3) {
            svg = setText(svg, getModCirclePath(mod, 10 + 6 + i * 15, 90 + 6, 6), reg_overlay)
        } else {
            svg = setText(svg, getModCirclePath(mod, 10 + 6 + (i - 3) * 15, 90 + 6 - 15, 6), reg_overlay)
        }
    }

    const skill = data?.skill || []

    const hexagon = PanelDraw.HexagonChart(skill.map(v => Math.pow(v / 10, 0.5)), 235 / 2, 118 / 2, 45, data?.hexagon_color, Math.PI / 3, 3, 3)
    const hexagon_index = PanelDraw.HexagonIndex(skill.map(v => floor(v, 1)), 235 / 2, 118 / 2, 50, Math.PI / 3, data?.skill_color, 'none', 20)
    const hexagon_background = getImageFromV3('object-hexagon.png')

    const skill_sort = skill.sort((a, b) => b - a)
    const skill_sort_sum = skill_sort[0] * 0.5 + skill_sort[1] * 0.3 + skill_sort[2] * 0.2 + skill_sort[3] * 0.15 + skill_sort[4] * 0.1
    const skill_sum = torusBold.getTextPath(floor(skill_sort_sum, 2), 235 / 2, 68, 20, 'center baseline', '#FFF')

    svg = setText(svg, skill_sum, reg_overlay)
    svg = setTexts(svg,[star, star_rrect, rank, rank_rrect], reg_text);

    svg = setTexts(svg, [hexagon_index, hexagon], reg_hexagon)
    svg = setImage(svg, 72.5, 19, 90, 80, hexagon_background, reg_hexagon, 1)

    svg = setImage(svg, 0, 0, 235, 148, data?.background, reg_background, 0.4)

    return svg.toString()
}
