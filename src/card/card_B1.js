import {
    getImageFromV3,
    implantImage, implantSvgBody, isNumber,
    readTemplate, replaceText, replaceTexts, round, rounds
} from "../util/util.js";
import {torus, torusBold} from "../util/font.js";
import {label_E, LABELS} from "../component/label.js";

export async function card_B1(data = {
    label: null,
    background: null,
    value: 11.45141919810,
    delta: 0,
    round_level: 1,
    rank: 'F',
    color: '#aaa',
    rank_size: 60,
}, at_right = false) {
    //读取面板
    let svg = readTemplate("template/Card_B1.svg");

    // 路径定义
    const reg_label = /(?<=<g id="Label">)/;
    const reg_text = /(?<=<g id="Text">)/;
    const reg_bg1 = /(?<=<g style="clip-path: url\(#clippath-B1-1\);">)/;
    const reg_bg2 = /(?<=<g style="clip-path: url\(#clippath-B1-2\);">)/;
    const reg_rect = '${reg_rect}';

    //导入标签
    const label = await label_E(data?.label || LABELS.UNDEFINED);

    //判断是左标签右评级还是左评级右标签。
    const card_x = at_right ? 120 : 20;
    const rank_x_center = at_right ? 60 : 470;

    //如果是右标签，则替换rect的x
    svg = replaceText(svg, card_x, reg_rect);

    svg = implantSvgBody(svg, card_x + 20, 22, label, reg_label);

    //添加评级和值和背景
    const number = rounds(data?.value, data?.round_level)
    const number_b = number.integer
    const number_m = number.decimal

    const rank_text = torus.getTextPath(data?.rank, rank_x_center, 68, data?.rank_size || 60, 'center baseline', data?.color);
    const number_text = torus.get2SizeTextPath(number_b, number_m,60, 36, 370 + card_x, 68, 'right baseline', '#fff');

    const getSign = (T) => {
        if (typeof T === 'number') {
            return (T > 0) ? '+' : ((T < 0) ? '-': '');
        } else return '';
    }

    const getColor = (T) => {
        const increase = '#c2e5c3'; //'#93D02E';
        const decrease = '#ffcdd2'; // '#DE6055';
        const none = 'none';

        if (typeof T === 'number') {
            return (T > 0) ? increase : ((T < 0) ? decrease: none);
        } else return '';
    }

    const delta_text = isNumber(data?.delta) ? torusBold.getTextPath(
        getSign(data?.delta) + round(Math.abs(data?.delta), 2),  at_right ? 340 : 240, 68, 20, 'right baseline', getColor(data?.delta)) : ''

    svg = replaceTexts(svg, [rank_text, number_text, delta_text], reg_text);

    const reg_bg = (at_right) ? reg_bg2 : reg_bg1;

    svg = implantImage(svg,390, 95, card_x, 0, 0.3, data?.background || getImageFromV3('object-score-backimage-F.jpg'), reg_bg);

    return svg.toString();
}
