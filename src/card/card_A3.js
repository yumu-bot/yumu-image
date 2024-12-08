import {
    getBeatMapTitlePath,
    getGameMode,
    getImageFromV3, getMapStatus, getRoundedNumberStr,
    implantImage, implantSvgBody,
    isNotBlankString,
    isNotEmptyArray, readNetImage,
    replaceText, replaceTexts, transformSvgBody
} from "../util/util.js";
import {extra, PuHuiTi, torus, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMapStatusColor, getStarRatingColor} from "../util/color.js";
import {hasLeaderBoard} from "../util/star.js";

export async function card_A3(beatmapset = {}) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CA3-1">
              <rect x="170" width="430" height="175" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CA3-2">
              <rect width="210" height="210" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CA3-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            </filter>
          </defs>
          <g id="Base_CA3">
           </g>
          <g id="Background_CA3">
            <g style="clip-path: url(#clippath-CA3-1);" filter="url(#blur-CA3-1)">
            </g>
          </g>
          <g id="Cover_CA3">
            <g style="clip-path: url(#clippath-CA3-2);">
            </g>
          </g>
          <g id="Text_CA3">
          </g>
          <g id="Label_CA3">
          </g>`;


    // 路径定义
    const reg_label = /(?<=<g id="Label_CA3">)/;
    const reg_text = /(?<=<g id="Text_CA3">)/;
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CA3-2\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CA3-1\);" filter="url\(#blur-CA3-1\)">)/;
    const reg_base = /(?<=<g id="Base_CA3">)/;

    // 文本定义
    /*
    const title = torus.getTextPath(
        torus.cutStringTail(beatmapset?.title || '', 36, 390 - 20),
        225, 40 - 2, 36, 'left baseline', '#fff'
    )

    const is_title_unicode_shown = beatmapset?.title !== beatmapset?.title_unicode

    const title_unicode = is_title_unicode_shown ? PuHuiTi.getTextPath(
        PuHuiTi.cutStringTail(beatmapset?.title_unicode || '', 18, 390 - 20),
        225, 70 - 2, 18, 'left baseline', '#aaa'
    ) : ''

     */

    const titles = getBeatMapTitlePath("torus", "PuHuiTi",
        beatmapset?.title || '', beatmapset?.title_unicode || '', null,
        225, 40 - 2, 70 - 2, 36, 18, 390 - 20, 'left baseline', '#fff', '#aaa');

    const artist = torus.getTextPath(
        torus.cutStringTail(beatmapset?.artist || '', 24, 390 - 20),
        225, 100, 24, 'left baseline', '#ccc'
    )

    const mapper_map = new Map()

    if (isNotEmptyArray(beatmapset.beatmaps)) {
        beatmapset.beatmaps.forEach(v => {
            if (isNotEmptyArray(v.owners)) {
                v.owners.forEach(o => {
                    mapper_map.set(o.id, o.username)
                })
            }
        })
    }

    const mapper_arr = Array.from(mapper_map.values())

    let mappers = beatmapset?.creator || ''

    if (isNotEmptyArray(mapper_arr)) {
        mappers += ' (' + mapper_arr.join(', ') + ')'
    }

    const mapper = torus.getTextPath(
        torus.cutStringTail(mappers, 24, 390 - 20),
        225, 130, 24, 'left baseline', '#ccc'
    )

    const image = await readNetImage(beatmapset.covers["list@2x"], hasLeaderBoard(beatmapset.ranked))

    const fav = label_A8({
        image: getImageFromV3('object-beatmap-favorite.png'),
        text: getRoundedNumberStr(beatmapset.favourite_count, 2),
        color: '#1c1719',
    })

    const pc = label_A8({
        image: getImageFromV3('object-beatmap-playcount.png'),
        text: getRoundedNumberStr(beatmapset.play_count, 2),
        color: '#1c1719',
    })

    const sid = label_A8({
        image: null,
        has_text: null,
        text: (beatmapset.id).toString(),
        color: '#1c1719',
    })

    const status = label_A8({
        image: null,
        has_text: null,
        text: getMapStatus(beatmapset.ranked).toUpperCase(),
        color: getMapStatusColor(beatmapset.ranked),
    })

    const difficulty = drawDifficultyLabels(beatmapset.beatmaps)

    const base = PanelDraw.Rect(0, 0, 600, 210, 20, '#382E32', 1)
        + PanelDraw.Rect(0, 0, 600, 210, 20, getMapStatusColor(beatmapset.ranked), 0.2)
        + PanelDraw.Rect(170, 0, 430, 175, 20, '#382E32', 1) // 背景图片层底板

    // 导入
    svg = replaceTexts(svg, [titles.title, titles.title_unicode, artist, mapper], reg_text)

    svg = implantSvgBody(svg, 210 + 10, 175, difficulty, reg_label)
    svg = implantSvgBody(svg, 210 + 10, 144, fav.svg, reg_label)
    svg = implantSvgBody(svg, 210 + 10 + 10 + fav.width, 144, pc.svg, reg_label)
    svg = implantSvgBody(svg, 600 - sid.width - 10, 144, sid.svg, reg_label)
    svg = implantSvgBody(svg, 10, 10, status.svg, reg_label)

    svg = implantImage(svg, 430, 175, 170, 0, 0.4, image, reg_background)
    svg = implantImage(svg, 210, 210, 0, 0, 1, image, reg_cover)

    svg = replaceText(svg, base, reg_base)

    return svg.toString()
}

/** 绘制谱面难度标签
 * 有四种类型。
 * 第一，全显示，这样就是 (mode) [] star1 [] star2...
 * 第二，半显示，这样就是 (mode) [] []
 * 第三，只显示数量，这样就是 (mode) 2
 * @param beatmaps
 */
function drawDifficultyLabels(beatmaps = []) {

    let svg = '<g id="Difficulty_A8"> \n';

    const max_width = 390 - 10 //忽略了左侧 10 px 的最大宽度

    const full_labels = beatmaps.map(v => {
        return label_A8({
            image: null,
            has_text: true,
            text: getRoundedNumberStr(v.difficulty_rating, 3),
            color: getStarRatingColor(v.difficulty_rating)
        })
    })

    const half_labels = beatmaps.map(v => {
        return label_A8({
            image: null,
            has_text: false,
            text: getRoundedNumberStr(v.difficulty_rating, 3),
            color: getStarRatingColor(v.difficulty_rating)
        })
    })

    // [0, 0, 0, 1, 2]
    const ruleset_arr = beatmaps.map(v => {
        return v.mode_int
    })
    const ruleset_set = new Set(ruleset_arr)
    const ruleset_count = ruleset_set.size
    let ruleset_current = -1
    let x = 10

    const half_labels_width = half_labels.reduce((prev, curr) => {
        return prev + curr.width + 10
    }, 0)
    const full_labels_width = full_labels.reduce((prev, curr) => {
        return prev + curr.width + 10
    }, 0)

    if (half_labels_width + (ruleset_count * 40) > max_width) {
        // 第三
        for (const i in ruleset_arr) {
            const mode = ruleset_arr[i]

            if (mode !== ruleset_current) {
                ruleset_current = mode

                const diff_icon = extra.getTextPath(getGameMode(mode, -1),
                    x - 8, 32 - 4, 30, 'left baseline', '#fff', 1)
                svg += diff_icon
                x += 28

                const count = ruleset_arr.filter(v => {
                    return v === ruleset_current
                }).length

                const count_width = torusBold.getTextWidth(count.toString(), 20)
                const count_text = torusBold.getTextPath(count.toString(), x, 24, 20, 'left baseline', '#fff', 1)

                svg += count_text
                x += (18 + count_width)
            }
        }
    } else if (full_labels_width + (ruleset_count * 40) > max_width) {
        let current_label_full_width = half_labels_width + (ruleset_count * 40)

        // 尝试找出主难度的位置
        const top_diff_index = []
        for (const k of Array.from(ruleset_set)) {
            top_diff_index.push(findLastIndex(ruleset_arr, (v) => Math.abs(v - k) < 1e-6))
        }
        // 第二

        let j = 0
        for (const i in ruleset_arr) {
            const mode = ruleset_arr[i]

            if (mode !== ruleset_current) {
                ruleset_current = mode

                const diff_icon = extra.getTextPath(getGameMode(mode, -1),
                    x - 8, 32 - 4, 30, 'left baseline', '#fff', 1)
                svg += diff_icon
                x += 28
            }

            // 是主难度
            if (top_diff_index[j] - i < 1e-6) {

                if (current_label_full_width + full_labels[i].width <= max_width) {
                    // 主难度尝试使用全宽

                    current_label_full_width -= half_labels[i].width
                    current_label_full_width += full_labels[i].width

                    const label = full_labels[i]
                    svg += transformSvgBody(x, 5, label.svg)
                    x += (label.width + 18)
                } else {
                    // 使用全宽会超宽，因此放弃

                    const label = half_labels[i]
                    svg += transformSvgBody(x, 5, label.svg)
                    x += (label.width + 18)
                }

                j++
            } else {
                // 正常渲染非主难度

                const label = half_labels[i]
                svg += transformSvgBody(x, 5, label.svg)
                x += (label.width + 4)
            }
        }

    } else {
        // 尝试找出主难度的位置
        const top_diff_index = []
        for (const k of Array.from(ruleset_set)) {
            top_diff_index.push(findLastIndex(ruleset_arr, (v) => Math.abs(v - k) < 1e-6))
        }

        // 第一

        let j = 0
        for (const i in ruleset_arr) {
            const mode = ruleset_arr[i]

            if (mode !== ruleset_current) {
                ruleset_current = mode

                const diff_icon = extra.getTextPath(getGameMode(mode, -1),
                    x - 8, 32 - 4, 30, 'left baseline', '#fff', 1)
                svg += diff_icon
                x += 28
            }

            // 是主难度
            if (top_diff_index[j] - i < 1e-6) {
                const label = full_labels[i]
                svg += transformSvgBody(x, 5, label.svg)
                x += (label.width + 18)

                j++
            } else {
                // 正常渲染非主难度

                const label = full_labels[i]
                svg += transformSvgBody(x, 5, label.svg)
                x += (label.width + 4)
            }
        }
    }

    svg += '</g>'

    return svg.toString()
}

/**
 * 私有标签
 * @param data
 * @return {{svg: string, width: number}}
 */
function label_A8(data = {
    image: null,
    has_text: true, // true：没图片的时候，显示字段。有图片的时候默认显示字段
    text: '',
    color: 'none',
}) {
    let svg = `
        <g id="Base_LA8">
        </g>
        <g id="Text_LA8">
        </g>
        <g id="Icon_LA8">
        </g>
    `;

    const reg_base = /(?<=<g id="Base_LA8">)/;
    const reg_text = /(?<=<g id="Text_LA8">)/;
    const reg_icon = /(?<=<g id="Icon_LA8">)/;

    const text_width = torusBold.getTextWidth(data?.text || '', 20)
    let width = text_width + 16
    let text_middle = width / 2

    if (isNotBlankString(data.image)) {
        // [image] text
        width += 22
        text_middle += 22
        svg = implantImage(svg, 18, 18, 6, 3.5, 1, data.image, reg_icon)

    } else if (data.has_text === true) {
        // [] text
        width += 10
        text_middle += 10

        svg = replaceText(svg, PanelDraw.Rect(0, 0, 14, 25, 7, data?.color || 'none', 1), reg_icon)
    } else if (data.has_text === false) {
        // []

        svg = replaceText(svg, PanelDraw.Rect(0, 0, 14, 25, 7, data?.color || 'none', 1), reg_icon)

        return {
            width: 14,
            svg: svg,
        }
    }

    const text = torusBold.getTextPath(data?.text, text_middle, 19, 20, 'center baseline', '#fff', 1)
    const base = PanelDraw.Rect(0, 0, width, 25, 7, data?.color || 'none', 0.4)

    svg = replaceText(svg, text, reg_text)
    svg = replaceText(svg, base, reg_base)

    return {
        width: width,
        svg: svg,
    }
}

function findLastIndex(array = [], predicate = () => {}) {
    let index = array.length;
    while (index--) {
        if (predicate(array[index])) {
            return index;
        }
    }
    return -1; // 如果没有找到匹配项，返回-1
}