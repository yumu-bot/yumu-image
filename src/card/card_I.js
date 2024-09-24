import {
    getImageFromV3, getRoundedNumberStr,
    implantImage, implantSvgBody, isASCII, replaceText, replaceTexts,
} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMaimaiBG, getMaimaiRankBG, getMaimaiType} from "../util/maimai.js";

// maimai 多成绩面板
export async function card_I(data = {
    id: 0,
    difficulty: 0.0,
    rating: 0,
    achievements: 0.0,
    index: 0,
    position: 0,

    score: 0,
    max: 0,

    title: '',
    artist: '',
    charter: '',
    rank: '',

    combo: '',
    sync: '',
    type: '',
}) {
    // 模板
    let svg = `
    <defs>
    <clipPath id="clippath-CI-1">
        <rect x="140" width="290" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI-2">
         <rect width="80" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CI-3">
         <rect x="20" width="160" height="110" rx="20" ry="20" style="fill: none;"/>
    </clipPath>
        <filter id="blur-CI-BG" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
    </defs>
    <g id="Base-CI">
        <rect width="430" height="110" rx="20" ry="20" style="fill: #46393f;"/>
    </g>
    <g id="Background-CI">
        <g filter="url(#blur-CI-BG)" style="clip-path: url(#clippath-CI-1);">
        </g>
    </g>
    <g id="Difficulty-CI">
        <g style="clip-path: url(#clippath-CI-2);">
        </g>
    </g>
    <g id="Cover-CI">
        <g style="clip-path: url(#clippath-CI-3);">
        </g>
    </g>
    <g id="Rank-CI">
    </g>
    <g id="Overlay-CI">
    </g>
    <g id="Text-CI">
    </g>`;

    // 正则
    const reg_text = /(?<=<g id="Text-CI">)/;
    const reg_overlay = /(?<=<g id="Overlay-CI">)/;
    const reg_rank = /(?<=<g id="Rank-CI">)/;


    const reg_background = /(?<=<g filter="url\(#blur-CI-BG\)" style="clip-path: url\(#clippath-CI-1\);">)/
    const reg_difficulty = /(?<=<g style="clip-path: url\(#clippath-CI-2\);">)/
    const reg_cover = /(?<=<g style="clip-path: url\(#clippath-CI-3\);">)/


    // 文本
    const title_size = isASCII(data?.title) ? 24 : 22;
    const artist_size = isASCII(data?.artist) ? 16 : 14;
    const charter_size = isASCII(data?.charter) ? 16 : 14;

    const title_font = isASCII(data?.title) ? torus : PuHuiTi;
    const artist_font = isASCII(data?.artist) ? torus : PuHuiTi;
    const charter_font = isASCII(data?.charter) ? torus : PuHuiTi;

    const position = data?.position >= 1 ? ('#' + data.position + ' // ') : ''
    const achievement_text = position + (data?.achievements || 0).toFixed(4) + '%'

    const title = title_font.getTextPath(
        title_font.cutStringTail(data?.title, title_size, 230), 190, 24, title_size, 'left baseline', '#fff')
    const artist = artist_font.getTextPath(
        artist_font.cutStringTail(data?.artist, artist_size, 230), 190, 44, artist_size, 'left baseline', '#fff')
    const charter = charter_font.getTextPath(
        charter_font.cutStringTail(data?.charter, charter_size,
            230 - torus.getTextWidth(achievement_text, 16) - 5), 190, 64, charter_size, 'left baseline', '#fff')

    const rating_max = Math.floor(data.difficulty * 1.005 * 22.4) || 0
    const rating = torus.get2SizeTextPath(data?.rating >= rating_max ? ('') : ('[' + rating_max + '] '),
        data?.rating.toString(),
        18, 40, 420, 100, 'right baseline', '#fff')

    const achievement = torus.getTextPath(achievement_text, 420, 64, 16, 'right baseline', '#fff')

    svg = replaceTexts(svg, [title, artist, charter, rating, achievement], reg_text)

    // 图片和矩形
    const difficulty_color = getDifficultyColor(data.index)
    const difficulty_rrect = PanelDraw.Rect(0, 0, 80, 110, 20, difficulty_color, 1)
    svg = replaceText(svg, difficulty_rrect, reg_difficulty);

    const image = await getMaimaiBG(data.id);
    svg = implantImage(svg, 160, 110, 20, 0, 1, image, reg_cover);

    const background = getMaimaiRankBG(data.rank);
    svg = implantImage(svg, 290, 110, 140, 0, 0.4, background, reg_background);

    const rank = getImageFromV3('Maimai/object-score-' + (data?.rank || 'd') + '2.png')
    svg = implantImage(svg, 56, 30, 185 + 2, 75, 1, rank, reg_rank);

    const stars = getDXRatingStars(data.score, data.max);
    svg = implantSvgBody(svg, 248, 86, stars, reg_rank) //注意。这个组件的锚点在左下角

    const combo_sync = getComboAndSync(data.combo, data.sync);
    svg = implantSvgBody(svg, 248, 90, combo_sync, reg_rank)

    // 左侧覆盖部分
    const type = getMaimaiType(data.type);
    svg = implantImage(svg, 45, 30, 128, 0, 1, type, reg_overlay);

    const too_bright = data.index === 4 || data.index === 1;

    const difficulty_text = getRoundedNumberStr(data.difficulty, 2);
    const difficulty = torus.getTextPath(difficulty_text, 50, 22, 18, 'center baseline', too_bright ? '#000' : '#fff')
    const difficulty_base = PanelDraw.Rect(30, 6, 40, 20, 10, difficulty_color, 1)

    const id_width = torus.getTextWidth(data.id.toString(), 18)
    const id_base_width = Math.max(40, id_width + 10)
    const id = torus.getTextPath(data.id.toString(), 30 + (id_base_width / 2), 100, 18, 'center baseline', too_bright ? '#000' : '#fff')
    const id_base = PanelDraw.Rect(30, 84, id_base_width, 20, 10, difficulty_color, 1)

    svg = replaceTexts(svg, [difficulty, id], reg_text)
    svg = replaceTexts(svg, [difficulty_base, id_base], reg_overlay)

    return svg.toString()
}

function getDifficultyColor(index = 0) {
    switch (index) {
        case 1: return '#fff100'
        case 2: return '#d32f2f'
        case 3: return '#9922ee'
        case 4: return '#f7d8fe'
        default: return '#009944'
    }
}

function getDXRatingStars(rating = 0, max = 0) {
    if (typeof max !== "number" || max <= 0) return ''

    const div = rating / max;
    let level
    let color

    if (div >= 0.97) {
        level = 5
        color = '#fdf793'
    } else if (div >= 0.95) {
        level = 4
        color = '#ffcd80'
    } else if (div >= 0.93) {
        level = 3
        color = '#ffcd80'
    } else if (div >= 0.9) {
        level = 2
        color = '#b3d465'
    } else if (div >= 0.85) {
        level = 1
        color = '#b3d465'
    } else {
        return ''
    }

    const diamonds = [
        PanelDraw.Diamond(0, -10, 10, 10, color),
        PanelDraw.Diamond(14, -10, 10, 10, color),
        PanelDraw.Diamond(28, -10, 10, 10, color),
        PanelDraw.Diamond(7, -18, 10, 10, color),
        PanelDraw.Diamond(21, -18, 10, 10, color),
    ]

    let out = '';

    for (let i = 0; i < level; i++) {
        out += diamonds[i];
    }

    return out;
}

function getComboAndSync(combo = '', sync = '') {
    let combo_color

    switch (combo) {
        case 'fc': combo_color = '#b3d465'; break;
        case 'fcp': combo_color = '#d3e6a6'; break;
        case 'ap': combo_color = '#ffcd80'; break;
        case 'app': combo_color = '#fdf793'; break;
        default: combo_color = '#46393f'; break;
    }

    let sync_color;
    switch (sync) {
        case 'sync': sync_color = '#1fbdfe'; break;
        case 'fs': sync_color = '#80d8ff'; break;
        case 'fsp': sync_color = '#e1f6ff'; break;
        case 'fsd': sync_color = '#ffcd80'; break;
        case 'fsdp': sync_color = '#fdf793'; break;
        default: sync_color = '#46393f'; break;
    }

    return '<g>' + (PanelDraw.Circle(5, 5, 5, combo_color)) + '</g><g>' + (PanelDraw.Circle(19, 5, 5, sync_color)) + '</g>'
}