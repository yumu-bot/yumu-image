import {PanelDraw} from "../util/panelDraw.js";
import {getMultipleTextPath, poppinsBold} from "../util/font.js";
import {
    calculateTan, getImage,
    getImageFromV3,
    getLocalPathFromV3, normalize,
} from "../util/util.js";
import {colorArray, PanelColor} from "../util/color.js";

export function card_F4(match_score = {}, max_combo = 0, max_score = 0, min_score = 0, min_accuracy = 0, compare_score = 0, avatar_path = getImageFromV3('avatar-guest.png')) {
    const {
        user, rank = 'F', match: stat, ranking = 0, score = 0, legacy_total_score = 0, mods = []
    } = match_score;

    const {
        username, id
    } = user

    const {
        pass
    } = stat


    const skew_0 = calculateTan(160, 10)
    const skew_32 = calculateTan(160 - 32, 10)
    const skew_70 = calculateTan(160 - 70, 10)
    const skew_100 = calculateTan(160 - 100, 10)

    const skew_avatar = calculateTan(100, 10)

    const avatar_clip = PanelDraw.RoundedParallelogram(skew_100, 0, 140, 100, skew_avatar, 0, 5, 'none', 1)

    const avatar = getImage(skew_100 - 2, 0, 140 + 16, 100, avatar_path)

    const name = poppinsBold.getTextPath(
        poppinsBold.cutStringTail(username, 30, 230),
        150 + skew_32, 32, 30, 'left baseline', '#fff', 1, true)

    const score_rrect_base = PanelDraw.RoundedParallelogram(150, 0, 230, 20, skew_70, 0, 5, PanelColor.top(), 1)

    const is_max_score = score >= max_score

    const score_rrect_colors = is_max_score ? colorArray.iridescent : colorArray.cyan

    const score_rrect_width = normalize(score, max_score, min_score - 1, 230, 20)

    const score_rrect = PanelDraw.LinearGradientParallelogram(150, 0, score_rrect_width, 20, skew_70, 0, 5, score_rrect_colors)

    const base = PanelDraw.RoundedParallelogram(0, 0, 400, 160, skew_0, 0, 5, PanelColor.middle(), 1)

    const base_clip = PanelDraw.RoundedParallelogram(0, 0, 400, 160, skew_0, 0, 5, 'none', 1)

    const base_shadowed = PanelDraw.Shadow(base, 2, 2, 1, PanelColor.base())

    return `
<clipPath id="clippath-CF3-1">
    ${avatar_clip}
</clipPath>
<clipPath id="clippath-CF3-2">
    ${base_clip}
</clipPath>
<g>
    ${base_shadowed}
    ${score_rrect_base}
    ${score_rrect}
    
    ${name}
    
    <g id="Avatar_CF3" clip-path="url(#clippath-CF3-1)">
        ${avatar}
    </g>
</g>
    `
}