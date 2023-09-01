import {
    getExportFileV3Path,
    getFlagPath,
    implantImage,
    readTemplate,
    replaceText, replaceTexts,
} from "../util.js";
import {torus} from "../font.js";


export async function card_A1(data = {
    background: getExportFileV3Path('card-default.png'),
    avatar: getExportFileV3Path('avatar-guest.png'),
    sub_icon1: getExportFileV3Path('object-card-supporter.png'),
    sub_icon2: '',
    country: 'CN',

    top1: 'Muziyami',
    left1: '#28075',
    left2: 'CN#1611',
    right1: '',
    right2: '98.7% Lv.93(24%)',
    right3m: '4396',
    right3b: 'PP',
}, reuse = false) {
    // 读取模板
    let svg = readTemplate('template/Card_A1.svg');

    // 路径定义
    const reg_text = /(?<=<g id="Text">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CA1-1\);">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CA1-2\);">)/;
    const reg_country_flag = /(?<=<g style="clip-path: url\(#clippath-CA1-3\);">)/;
    const reg_sub_icon1 = /(?<=<g style="clip-path: url\(#clippath-CA1-4\);">)/;
    const reg_sub_icon2 = /(?<=<g style="clip-path: url\(#clippath-CA1-5\);">)/;

    // 文字的 <path>
    const top1 = torus.getTextPath(torus.cutStringTail(data.top1, 42, 290),
        130, 53.672, 42, "left baseline", "#fff"); //48px
    const left1 = torus.getTextPath(data.left1, 20, 165.836, 24, "left baseline", "#fff");
    const left2 = torus.getTextPath(data.left2, 20, 191.836, 24, "left baseline", "#fff");

    const right1 = torus.getTextPath(data.right1, 420, 114.836, 24, 'right baseline', '#fff');
    const right2 = torus.getTextPath(data.right2, 420, 141.836, 24, "right baseline", "#fff");
    const right3 = torus.get2SizeTextPath(data.right3b, data.right3m, 60, 48, 420, 191.59, 'right baseline', '#fff');

    const flagSvg = await getFlagPath(data.country, 135, 64, 44); //x +5px

    // 替换内容
    svg = replaceText(svg, flagSvg, reg_country_flag); //高44宽60吧
    svg = replaceTexts(svg, [top1, left1, left2, right1, right2, right3], reg_text);
    // 替换图片

    svg = implantImage(svg, 430, 210, 0, 0, 0.5, data.background, reg_background);
    svg = implantImage(svg, 100, 100, 20, 20, 1, data.avatar, reg_avatar);
    svg = implantImage(svg, 40, 40, 200, 70, 1, data.sub_icon1, reg_sub_icon1); //x +5px
    svg = implantImage(svg, 40, 40, 250, 70, 1, data.sub_icon2, reg_sub_icon2); //x +5px

    return svg.toString();
}

