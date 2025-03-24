import {
    getImageFromV3,
    getFlagPath,
    setImage,
    readTemplate,
    setText, setTexts, isASCII, readNetImage,
} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";


export async function card_A1(data = {
    background: getImageFromV3('card-default.png'),
    avatar: getImageFromV3('avatar-guest.png'),
    sub_icon1: getImageFromV3('object-card-supporter.png'),
    sub_icon2: '',
    sub_banner: '',

    country: null,
    team_url: null,

    top1: 'Muziyami',
    top2: '',
    left1: '#28075',
    left2: 'CN#1611',
    right1: '',
    right2: '98.7% Lv.93(24%)',
    right3b: '4396',
    right3m: 'PP',
}) {
    // 读取模板
    let svg = readTemplate('template/Card_A1.svg');

    // 路径定义
    const reg_text = /(?<=<g id="Text">)/;
    const reg_banner = /(?<=<g id="Banner" style="clip-path: url\(#clippath-CA1-6\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CA1-1\);">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CA1-2\);">)/;
    const reg_country_flag = /(?<=<g style="clip-path: url\(#clippath-CA1-3\);">)/;
    const reg_sub_icon1 = /(?<=<g style="clip-path: url\(#clippath-CA1-4\);">)/;
    const reg_sub_icon2 = /(?<=<g style="clip-path: url\(#clippath-CA1-5\);">)/;
    const reg_team_flag = /(?<=<g style="clip-path: url\(#clippath-CA1-7\);">)/;

    // 文本定义
    const right_width = torus.getTextWidth(data.right3b, 60) + torus.getTextWidth(data.right3m, 48);

    const font_top1 = isASCII(data.top1) ? torus : PuHuiTi
    const font_top2 = isASCII(data.top2) ? torus : PuHuiTi
    const font_left1 = isASCII(data.left1) ? torus : PuHuiTi
    const font_left2 = isASCII(data.left2) ? torus : PuHuiTi
    const size_left1 = isASCII(data.left1) ? 24 : 22
    const size_left2 = isASCII(data.left2) ? 24 : 22

    let top1_size;
    if (data.top1?.length > 8 && torus.getTextWidth(data.top1, 42) > 290) {
        top1_size = 36;
    } else {
        top1_size = 42
    }

    if (! isASCII(data.top1)) {
        top1_size -= 4;
    }

    const top1 = font_top1.getTextPath(font_top1.cutStringTail(data.top1, top1_size, 290), 130, 53.672, top1_size, "left baseline", "#fff");
    const top2 = font_top2.getTextPath(font_top2.cutStringTail(data.top2, 24, 290), 130, 85.836, 24, "left baseline", "#fff");
    const left1 = font_left1.getTextPath(font_left1.cutStringTail(data.left1, size_left1, 390 - right_width), 20, 165.836, size_left1, "left baseline", "#fff");
    const left2 = font_left2.getTextPath(font_left2.cutStringTail(data.left2, size_left2, 390 - right_width), 20, 191.836, size_left2, "left baseline", "#fff");

    const right1 = torus.getTextPath(data.right1, 420, 114.836 - 2, 24, 'right baseline', '#fff');
    const right2 = torus.getTextPath(data.right2, 420, 141.836, 24, "right baseline", "#fff");
    const right3 = torus.get2SizeTextPath(data.right3b, data.right3m, 60, 48, 420, 191.59, 'right baseline', '#fff');

    const icon_offset = (data.team_url != null) ? 90 : 0

    const flag_svg = await getFlagPath(data.country, 135, 64, 44); //x +5px
    svg = setImage(svg, 200, 72, 76, 38, await readNetImage(data.team_url, true, ''), reg_team_flag, 1, 'xMidYMid meet')

    // 替换内容
    svg = setText(svg, flag_svg, reg_country_flag); //高44宽60吧
    svg = setTexts(svg, [top1, left1, left2, right1, right2, right3], reg_text);
    svg = setTexts(svg, [top1, top2, left1, left2, right1, right2, right3], reg_text);
    // 替换图片

    svg = setImage(svg, 0, 0, 430, 210, data.background, reg_background, 0.6);
    svg = setImage(svg, 20, 20, 100, 100, data.avatar, reg_avatar, 1);
    svg = setImage(svg, 200 + icon_offset, 70, 40, 40, data?.sub_icon1 || '', reg_sub_icon1, 1); //x +5px
    svg = setImage(svg, 250 + icon_offset, 70, 40, 40, data?.sub_icon2 || '', reg_sub_icon2, 1); //x +5px
    svg = setImage(svg, 70, 68, 320, 52, data?.sub_banner || '', reg_banner, 1);

    return svg.toString();
}