import {
    getImageFromV3,
    getGameMode,
    getMapStatusImage,
    setImage,
    setSvgBody, readNetImage,
    setTexts, getBeatMapTitlePath, floor, floors,
} from "../util/util.js";
import {extra, PuHuiTi, torus} from "../util/font.js";
import {getStarRatingColor} from "../util/color.js";
import {hasLeaderBoard} from "../util/star.js";

export async function card_E1(data = {
    ranked: 1,
    mode: 'OSU',
    star: 1.7,
    background: '',
    cover: '',
    title: '',
    title_unicode: '',
    version: '',
    artist: '',
    creator: '',
    bid: 0,
    sid: 0,
    status: '',
    favourite_count: 0,
    play_count: 0,
}) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CE1-1">
              <polygon points="440 85 250 195 250 415 440 525 630 415 630 195 440 85" style="fill: none;"/>
            </clipPath>
          </defs>
          <g id="Base_CE1">
            <rect id="LStarRRect" x="40" y="40" width="190" height="60" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="RStatusRRect" x="670" y="40" width="190" height="60" rx="20" ry="20" style="fill: #382e32;"/>
          </g>
          <g id="Avatar_CE1" style="clip-path: url(#clippath-CE1-1);">
          </g>
          <g id="Star_CE1">
          </g>
          <g id="Status_CE1">
          </g>
          <g id="Text_CE1">
          </g>
          <g id="Overlay_CE1">
          </g>`;

    // 路径定义
    const reg_cover = /(?<=<g id="Avatar_CE1" style="clip-path: url\(#clippath-CE1-1\);">)/;
    const reg_overlay = /(?<=<g id="Overlay_CE1">)/;
    const reg_star = /(?<=<g id="Star_CE1">)/;
    const reg_status = /(?<=<g id="Status_CE1">)/;
    const reg_text = /(?<=<g id="Text_CE1">)/;

    // 颜色定义
    const sr_color = getStarRatingColor(data.star);

    // 图片定义
    const hexagon = getImageFromV3('object-beatmap-hexagon.png');
    // const cover = await readNetImage(data.cover, hasLeaderBoard(data.ranked));
    // const cover = await getDiffBG(data.bid, data.sid, 'list', hasLeaderBoard(data.ranked));
    const cover = await readNetImage(data.cover, hasLeaderBoard(data.ranked));
    const status = getMapStatusImage(data.status);

    const favorite_count_icon = '<path d="m13,1c3,0,5,2,5,5s-5,7-6,8l-3,3-3-3C5,13,0,9,0,6,0,3.906,2,1,5,1s4,3,4,3c0,0,1-3,4-3Z" style="fill: #fff;"/>';
    const play_count_icon = '<path d="m9,0C4.029,0,0,4.029,0,9s4.029,9,9,9,9-4.029,9-9S13.971,0,9,0Zm-3,14V4l8,5-8,5Z" style="fill: #fff;"/>';

    // 文字定义
    const isSRLegal = (data.star >= 0 && data.star <= 20);

    const sr = floors(data.star, 1, 3)

    const sr_b = isSRLegal ? sr.int : 20;
    const sr_m = isSRLegal ? sr.dec : 0;
    const sr_b_str = isSRLegal ? sr.integer : '20';
    const sr_m_str = isSRLegal ? sr.decimal : '+';

    const sr_text = torus.get2SizeTextPath(sr_b_str, sr_m_str,
        48, 36, 160, 83.67, 'center baseline', '#fff');
    const mode_text = extra.getTextPath(getGameMode(data.mode, -1), 48, 86.24, 48, "left baseline", sr_color);
    const favorite_count_text = torus.getTextPath(
        floor((data.favourite_count), 1)
        , 845, 63.84, 24, "right baseline", "#fff");
    const play_count_text = torus.getTextPath(
        floor((data.play_count), 1)
        , 845, 90.84, 24, "right baseline", "#fff");

    const title = getBeatMapTitlePath("torus", "PuHuiTi", data.title, data.title_unicode, null,
        440, 593.67, 641.6, 48, 36, 860, "center baseline", "#fff", "#fff"
    );

    const title_text = title.title
    const title_unicode_text = title.title_unicode;

    const version_text = torus.getTextPath(
            torus.cutStringTail(data.version, 36, 860),
            440, 714.75, 36, "center baseline", "#fff");

    const mapper_and_bid = ' // ' + (data.creator || '?') + ' // b' + (data.bid || 0)
    const artist = torus.cutStringTail(data.artist || '', 24,
        860 - torus.getTextWidth(mapper_and_bid, 24), true);
    const artist_etc_text = torus.getTextPath(artist + mapper_and_bid, 440, 746.84, 24, "center baseline", "#fff");

    // 导入文字
    svg = setTexts(svg, [sr_text, mode_text, favorite_count_text, play_count_text, title_text, title_unicode_text, version_text,  artist_etc_text], reg_text);
    
    // 导入图片
    svg = setImage(svg, 250, 100, 380, 410, cover, reg_cover, 1);
    svg = setImage(svg, 230, 80, 420, 450, hexagon, reg_overlay, 1);
    svg = setImage(svg, 683, 44, 50, 50, status, reg_status, 1);
    svg = setSvgBody(svg, 746, 48, favorite_count_icon, reg_overlay);
    svg = setSvgBody(svg, 746, 74, play_count_icon, reg_overlay);

    //导入星数
    const star_svg = getStarSVGs(getImageFromV3('object-beatmap-star.png'), sr_b, sr_m, 40, 40);
    svg = setSvgBody(svg, 40, 106, star_svg, reg_star);

    //导出
    return svg.toString();
}

function getStarSVGs(star_path = '', sr_b = 0, sr_m = 0, w = 40, h = 40) {
    let svg = '';
    const sr_m_scale = Math.pow(sr_m, 0.8);
    const w0_5 = w / 2;

    for (let i = 1; i <= sr_b; i++) {
        const sr_b_svg = `<image id="Star${i}" width="${w}" height="${h}" transform="translate(0 ${35 * (i - 1)})" xlink:href="${star_path}"/>\n`;
        svg += sr_b_svg;
    }

    const sr_m_svg = `<image id="Star${sr_b + 1}" width="${w}" height="${h}" transform="translate(0 ${35 * sr_b}) translate(${w0_5 * (1 - sr_m_scale)} ${w0_5 * (1 - sr_m_scale)}) scale(${sr_m_scale})" xlink:href="${star_path}"/>\n`;

    return svg + sr_m_svg;
}