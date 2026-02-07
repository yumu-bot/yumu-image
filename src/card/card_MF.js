import {
    setImage,
    setSvgBody, isASCII, isNotBlankString, setText,
    setTexts,
    getSvgBody, isNotEmptyArray, getImageFromV3Cache
} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";
import {label_A8} from "./card_A3.js";
import {
    getMaimaiCategory,
    getMaimaiCover,
    getMaimaiType,
    getMaimaiVersionBG, getMaimaiVersionColor
} from "../util/maimai.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_MF(song = {
    "id": "8",
    "title": "True Love Song",
    "type": "SD",
    "ds": [
        5.0,
        7.2,
        10.2,
        12.4
    ],
    "level": [
        "5",
        "7",
        "10",
        "12"
    ],
    "cids": [
        1,
        2,
        3,
        4
    ],
    "charts": [
        {
            "notes": [
                63,
                23,
                8,
                2
            ],
            "charter": "-"
        },
        {
            "notes": [
                85,
                27,
                6,
                4
            ],
            "charter": "-"
        },
        {
            "notes": [
                110,
                56,
                9,
                2
            ],
            "charter": "譜面-100号"
        },
        {
            "notes": [
                263,
                14,
                19,
                6
            ],
            "charter": "ニャイン"
        }
    ],
    "basic_info": {
        "title": "True Love Song",
        "artist": "Kai/クラシック「G線上のアリア」",
        "genre": "舞萌",
        "bpm": 150,
        "release_date": "",
        "from": "maimai",
        "is_new": false
    },
    "alias": "爱歌",
    "highlight": [0, 1],
}) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CMF-1">
              <rect x="135" width="310" height="175" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CMF-2">
              <rect width="175" height="175" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CMF-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            </filter>
          </defs>
          <g id="Base_CMF">
           </g>
          <g id="Background_CMF">
            <g style="clip-path: url(#clippath-CMF-1);" filter="url(#blur-CMF-1)">
            </g>
          </g>
          <g id="Cover_CMF">
            <g style="clip-path: url(#clippath-CMF-2);">
            </g>
          </g>
          <g id="Text_CMF">
          </g>
          <g id="Label_CMF">
          </g>`;


    // 路径定义
    const reg_label = /(?<=<g id="Label_CMF">)/;
    const reg_text = /(?<=<g id="Text_CMF">)/;
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CMF-2\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CMF-1\);" filter="url\(#blur-CMF-1\)">)/;
    const reg_base = /(?<=<g id="Base_CMF">)/;

    // 文本定义
    let title_str
    let left1_str
    let left2_str

    if (isNotBlankString(song.alias)) {
        title_str = song?.basic_info?.title ?? ''
        left1_str = song.alias
        left2_str = song?.basic_info?.artist ?? ''
    } else {
        title_str = song?.basic_info?.title ?? ''
        left1_str = song?.basic_info?.artist ?? ''
    }

    const title_font = isASCII(title_str) ? torus : PuHuiTi
    const left1_font = isASCII(left1_str) ? torus : PuHuiTi
    const left2_font = isASCII(left2_str) ? torus : PuHuiTi

    const title_size = isASCII(title_str) ? 26 : 24
    const left1_size = isASCII(left1_str) ? 20 : 18
    const left2_size = isASCII(left2_str) ? 20 : 18

    const title = title_font.getTextPath(
        title_font.cutStringTail(title_str, title_size, 255),
        187, 34, title_size, 'left baseline', '#fff'
    )

    const left1 = left1_font.getTextPath(
        left1_font.cutStringTail(left1_str, left1_size, 255),
        187, 64, left1_size, 'left baseline', '#bbb'
    )

    const left2 = left2_font.getTextPath(
        left2_font.cutStringTail(left2_str, left2_size, 255),
        187, 90, left2_size, 'left baseline', '#bbb'
    )

    svg = setTexts(svg, [title, left1, left2], reg_text)

    const difficulty = drawDifficultyLabels(song.ds, song.level, song.highlight)

    const image = await getMaimaiCover(song.song_id)

    const genre = label_A8({
        image: getImageFromV3Cache('object-beatmap-favorite.png'),
        text: getMaimaiCategory(song.basic_info.genre),
        color: '#1c1719',
    })

    const bpm = label_A8({
        image: getImageFromV3Cache('object-beatmap-playcount.png'),
        text: Math.round(song.basic_info.bpm).toString(),
        color: '#1c1719',
    })

    const sid = label_A8({
        image: null,
        has_text: null,
        text: song.id,
        color: '#1c1719',
    })

    const base = PanelDraw.Rect(0, 0, 445, 210, 20, getMaimaiVersionColor(song.basic_info.from), 0.3)
        + PanelDraw.Rect(0, 0, 445, 175, 20, '#382E32', 1) // 背景图片层底板

    svg = setSvgBody(svg, 15, 175, difficulty, reg_label)
    svg = setSvgBody(svg, 183, 114, genre.svg, reg_label)
    svg = setSvgBody(svg, 183, 144, bpm.svg, reg_label)
    svg = setSvgBody(svg, 445 - sid.width - 10, 144, sid.svg, reg_label)

    svg = setImage(svg, 5, 5, 60, 40, getMaimaiType(song.type), reg_label, 1)
    svg = setImage(svg, 80, 128, 90, 45, getMaimaiVersionBG(song.basic_info.from), reg_label, 1)

    svg = setImage(svg, 135, 0, 310, 175, image, reg_background, 0.3)
    svg = setImage(svg, 0, 0, 175, 175, image, reg_cover, 1)

    svg = setText(svg, base, reg_base)

    return svg.toString()
}

function drawDifficultyLabels(ds = [], level = [], highlight = []) {
    const color_plate = ['#7CC576', '#FFF568', '#F26D7D', '#A864A8',
        '#FAD7F7']

    let labels = []
    let svg = ''

    if (ds.length < 4) {
        // 宴会场
        labels.push(label_A8({
            image: null,
            has_text: true,
            text: level[0],
            color: '#F06EA9'
        }))
    } else {
        for (let i = 0; i < ds.length; i++) {
            let is_highlight

            if (isNotEmptyArray(highlight)) {
                is_highlight = highlight.findIndex((num) => num === i) >= 0
            } else {
                is_highlight = true
            }


            labels.push(label_A8({
                image: null,
                has_text: true,
                text: ds[i],
                color: color_plate[i],
                is_highlight: is_highlight,
            }))
        }
    }

    let x = 0

    for (const label of labels) {
        svg += getSvgBody(x, 5, label.svg)
        x += (label.width + 8)
    }

    return svg.toString()
}