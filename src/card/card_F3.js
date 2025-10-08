import {PanelDraw} from "../util/panelDraw.js";
import {getMultipleTextPath, poppinsBold} from "../util/font.js";
import {floor, floors, getAvatar, getImageFromV3, setImage, setText, setTexts} from "../util/util.js";
import {getRankBackground} from "../util/star.js";
import {getUserRankColor} from "../util/color.js";
import {drawLazerMods} from "../util/mod.js";

export async function card_F3(match_score = {}, max_combo = 0, compare_score = 0) {
    // 读取模板
    let svg = `   
        <defs>
        <clipPath id="clippath-CP2-1">
            <circle cx="80" cy="80" r="65" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-CP2-2">
            <rect x="0" y="0" rx="20" ry="20" width="430" height="160" style="fill: none;"/>
        </clipPath>
        <filter id="inset-shadow-CP2-1" height="150%" width="150%" x="-25%" y="-25%" filterUnits="userSpaceOnUse">
            <feFlood flood-color="#000"/>
            <feComposite in2="SourceGraphic" operator="out"/>
            <feMorphology operator="dilate" radius="5" />
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            <feComposite in2="SourceGraphic" operator="atop"/>
        </filter>
        <filter id="blur-CP2-1" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
        </defs>
          <g id="Base_CP2">
            <rect x="0" y="0" rx="20" ry="20" width="430" height="160" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CP2-2);" filter="url(#blur-CP2-1)">
            </g>
          </g>
          <g id="Shadow_CP2" style="clip-path: url(#clippath-CP2-1);" filter="url(#inset-shadow-CP2-1)">
            <circle cx="80" cy="80" r="65" style="fill: #fff;"/>
            <g style="clip-path: url(#clippath-CP2-1);">
            </g>
          </g>
          <g id="Mod_CP2">
          </g>
          <g id="Text_CP2">
          </g>`;

    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CP2-2\);" filter="url\(#blur-CP2-1\)">)/
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CP2-1\);">)/
    const reg_text = /(?<=<g id="Text_CP2">)/
    const reg_mod = /(?<=<g id="Mod_CP2">)/

    svg = setImage(svg, 15, 15, 130, 130, await getAvatar(match_score?.user?.avatar_url || match_score?.user_id, true), reg_avatar, 1)

    svg = setImage(svg, 0, 0, 430, 160, getRankBackground(match_score?.rank, match_score?.match?.pass), reg_background, 0.6)

    const name = poppinsBold.getTextPath(poppinsBold.cutStringTail(match_score?.user?.username, 36, 270), 160, 48, 36, 'left baseline', '#fff')

    const ranking = PanelDraw.Rect(15, 15, 50, 25, 12.5, getUserRankColor(match_score?.ranking))
        + getMultipleTextPath(
            [{
                font: poppinsBold,
                text: (match_score?.ranking || 0).toString(),
                size: 24,
                color: '#fff'
            }, {
                font: poppinsBold,
                text: getOrdinal(match_score?.ranking || 0),
                size: 16,
                color: '#fff'
            }
            ],
            40, 36, 'center baseline'
        )

    const rank = getImageFromV3(`object-score-${match_score?.rank}2.png`)

    svg = setImage(svg, 340, 70, 90, 90, rank, reg_text, 1)

    const judge_data = getMatchScoreAdvancedJudge(match_score, max_combo)

    /*

    const judge = PanelDraw.Rect(160, 62, 84, 40, 20, judge_data.color)
        + poppinsBold.getTextPath(judge_data.judge, 202, 94, 30, 'center baseline', '#fff')

     */

    const judge = PanelDraw.Rect(15, 120, 50, 25, 12.5, judge_data.color)
        + poppinsBold.getTextPath(judge_data.judge, 40, 140, 22, 'center baseline', '#fff')

    const miss = match_score?.statistics?.miss || 0
    const miss_count = poppinsBold.getTextPath(miss >= 1000 ? floor(miss, 1, -1) : miss, 306, 94, 30, 'right baseline', '#fff')

    svg = setImage(svg, 310, 66, 32, 32, getImageFromV3('object-hit0.png'), reg_text, 1)

    const score_score = floors(match_score?.score || match_score?.legacy_total_score || 0, -4)

    const score = getMultipleTextPath([
        {
            font: poppinsBold,
            text: score_score.integer,
            size: 40,
            color: '#fff',
        }, {
            font: poppinsBold,
            text: score_score.decimal,
            size: 30,
            color: '#fff',
        },
    ], 160, 144, 'left baseline')

    const delta_data = getDeltaScore(match_score?.score || match_score?.legacy_total_score || 0, compare_score || 0)
    const delta_score = floor(delta_data.delta, -4)

    const delta = poppinsBold.getTextPath(delta_data.sign + delta_score, 340, 114, 18, 'right baseline', delta_data.color)

    const mods = (match_score?.mods || [])
        .filter(it => it.acronym !== "NF")

    if (mods.length === 0) mods.push("NM")

    const mods_path = drawLazerMods(mods, 160, 70 - 6, 40, 110, 'left', 5, false).svg

    /*
    let mods_path = ''

    const interval = mods.length > 2 ? 20 : 30

    mods.forEach((mod, index) => {
        const x = 160 + interval * index

        mods_path += getModRRectPath(mod, x, 64, 70, 40, 20, 30, poppinsBold, 30)
    })

     */

    svg = setText(svg, mods_path, reg_mod)

    svg = setTexts(svg, [name, ranking, judge, miss_count, score, delta], reg_text)

    return svg.toString()
}

function getDeltaScore(score = 0, compare = 0) {
    return {
        sign: (score < compare) ? '-' : '+',
        delta: Math.abs(score - compare),
        color: (score < compare) ? '#ffcdd2' : '#c2e5c3',
    }
}

function getMatchScoreAdvancedJudge(match_score = {}, max_combo = 0) {
    const stat = match_score?.statistics || {}

    const is_perfect = match_score?.rank === 'X' || match_score?.rank === 'XH'
    const is_fc = (match_score?.perfect === true) || (match_score?.perfect === 1)
    const is_almost_fc = match_score.max_combo > max_combo * 0.9
    const is_mania_fc = (match_score.mode_int === 3 && stat?.meh === 0 && stat?.ok === 0)

    let judge
    let color

    if (match_score.rank === 'F') {
        judge = 'L'
        color = '#9E040D'
    } else if (is_perfect) {
        judge = 'PF'
        color = '#FF9800'
    } else if (is_fc) {
        judge = 'FC+'
        color = '#B3D465'
    } else if (stat?.miss === 0) {
        if (is_almost_fc || is_mania_fc) {
            judge = 'FC'
            color = '#009944'
        } else {
            judge = 'FC-'
            color = '#B7AB00'
        }
    } else if (is_almost_fc || is_mania_fc) {
        judge = 'C+'
        color = '#00A1E9'
    } else {
        judge = 'C'
        color = '#0068B7'
    }

    return {
        judge: judge,
        color: color
    }
}

/**
 * 获取序数词
 * @param number
 * @returns {string}
 */
function getOrdinal(number = 1) {
    switch (number) {
        case 11: case 12: case 13: return 'th'
        default: {
            switch (number % 10) {
                case 1: return 'st'
                case 2: return 'nd'
                case 3: return 'rd'
                default: return 'th'
            }
        }
    }
}
