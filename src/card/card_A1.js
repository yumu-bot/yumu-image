import {
    getAvatar,
    getBanner,
    getFlagPath,
    getImageFromV3, getImageOrElse, getRandomString,
    isASCII,
    readNetImage,
    readTemplate,
    setImage,
    setText,
    setTexts, toPromise,
} from "../util/util.js";
import {PuHuiTi, torus} from "../util/font.js";

export async function card_A1(data = {}) {
    // 1. 初始化默认值与基础设置
    const {
        background = getImageFromV3('card-default.png'),
        avatar = getImageFromV3('avatar-guest.png'),
        sub_icon1 = getImageFromV3('object-card-supporter.png'),
        sub_icon2 = '',
        sub_banner = '',
        country = null,
        team_url = null,
        top1 = '',
        top2 = '',
        left1 = '',
        left2 = '',
        right1 = '',
        right2 = '',
        right3b = '',
        right3m = '',
        left1_stroke = '',
        left1_stroke_width = 1
    } = data;

    let svg = readTemplate('template/Card_A1.svg');

    // 2. 预计算字体与尺寸 (将判断逻辑抽离，保持主干清爽)
    const isTop1ASCII = isASCII(top1);
    const font_top1 = isTop1ASCII ? torus : PuHuiTi;
    const font_left1 = isASCII(left1) ? torus : PuHuiTi;
    const font_left2 = isASCII(left2) ? torus : PuHuiTi;

    const size_left1 = isASCII(left1) ? 24 : 22;
    const size_left2 = isASCII(left2) ? 24 : 22;

    let top1_size = (top1?.length > 8 && torus.getTextWidth(top1, 42) > 290) ? 36 : 42;
    if (!isTop1ASCII) top1_size -= 4;

    const right_width = torus.getTextWidth(right3b, 60) + torus.getTextWidth(right3m, 48);

    // 3. 处理渐变色 (使用短路运算符更简洁)
    const colors = (Array.isArray(data.left1_colors) && data.left1_colors.length > 1)
        ? data.left1_colors
        : ['#fff', '#fff'];

    const grad_id = `grad_CA1_${getRandomString(6)}`;
    const gradient = `
        <linearGradient id="${grad_id}" x1="60%" y1="90%" x2="40%" y2="10%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="100%" stop-color="${colors[1]}" />
        </linearGradient>`;

    // 4. 生成文本路径 (一次性计算所有路径)
    const paths = {
        t1: font_top1.getTextPath(font_top1.cutStringTail(top1, top1_size, 290), 130, 53.672, top1_size, "left baseline", "#fff"),
        t2: (isASCII(top2) ? torus : PuHuiTi).getTextPath(torus.cutStringTail(top2, 24, 290), 130, 85.836, 24, "left baseline", "#fff"),

        l1_base: font_left1.getTextPath(font_left1.cutStringTail(left1, size_left1, 390 - right_width), 20, 165.836, size_left1, "left baseline", left1_stroke, 1, left1_stroke, left1_stroke_width),
        l1_top: font_left1.getTextPath(font_left1.cutStringTail(left1, size_left1, 390 - right_width), 20, 165.836, size_left1, "left baseline", `url(#${grad_id})`, 1),
        l2: font_left2.getTextPath(font_left2.cutStringTail(left2, size_left2, 390 - right_width), 20, 191.836, size_left2, "left baseline", "#fff"),

        r1: torus.getTextPath(right1, 420, 112.836, 24, 'right baseline', '#fff'),
        r2: torus.getTextPath(right2, 420, 141.836, 24, "right baseline", "#fff"),
        r3: torus.get2SizeTextPath(right3b, right3m, 60, 48, 420, 191.59, 'right baseline', '#fff')
    };

    // 5. 并行处理资源加载

    const [backgrounds, avatars, flag_svg, team_img] =
        (await Promise.allSettled([
            toPromise(background, () => getBanner(background, true)),
            toPromise(avatar, () => getAvatar(avatar, true)),
            getFlagPath(country, 135, 64, 44),
            readNetImage(team_url ?? '', true, ''),
        ])).map((res) => getImageOrElse(res))

    // 6. 批量替换 (逻辑收口)
    const icon_offset = (team_url != null) ? 90 : 0;
    const reg = {
        text: /(?<=<g id="Text">)/,
        banner: /(?<=<g id="Banner" style="clip-path: url\(#clippath-CA1-6\);">)/,
        bg: /(?<=<g style="clip-path: url\(#clippath-CA1-1\);">)/,
        avatar: /(?<=<g style="clip-path: url\(#clippath-CA1-2\);">)/,
        country: /(?<=<g style="clip-path: url\(#clippath-CA1-3\);">)/,
        icon1: /(?<=<g style="clip-path: url\(#clippath-CA1-4\);">)/,
        icon2: /(?<=<g style="clip-path: url\(#clippath-CA1-5\);">)/,
        team: /(?<=<g style="clip-path: url\(#clippath-CA1-7\);">)/,
        defs: /(?<=<defs>)/
    };

    svg = setText(svg, gradient, reg.defs);
    svg = setText(svg, flag_svg, reg.country);

    // 合并文本替换，修复原代码的二次覆盖问题
    svg = setTexts(svg, [paths.t1, paths.t2, paths.l1_top, paths.l1_base, paths.l2, paths.r1, paths.r2, paths.r3], reg.text);

    // 图片替换
    svg = setImage(svg, 0, 0, 430, 210, backgrounds, reg.bg, 0.6);
    svg = setImage(svg, 20, 20, 100, 100, avatars, reg.avatar, 1);
    svg = setImage(svg, 200, 72, 76, 38, team_img, reg.team, 1, 'xMidYMid meet');
    svg = setImage(svg, 200 + icon_offset, 70, 40, 40, sub_icon1, reg.icon1, 1);
    svg = setImage(svg, 250 + icon_offset, 70, 40, 40, sub_icon2, reg.icon2, 1);
    svg = setImage(svg, 70, 68, 320, 52, sub_banner, reg.banner, 1);

    return svg;
}