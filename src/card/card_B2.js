import {
    getImageFromV3, implantImage, implantSvgBody,
    readTemplate, replaceTexts, rounds,
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_E, LABELS} from "../component/label.js";

// 详细文档参考 card_B1
export async function card_B2(data = {
    label: null,
    background: null,
    value: 11.45141919810,
    round_level: 1,
    rank: 'F',
    color: '#aaa',
}) {
    //读取面板
    let svg = readTemplate("template/Card_B2.svg");

    // 路径定义
    let reg_label = /(?<=<g id="Label">)/;
    let reg_text = /(?<=<g id="Text">)/;
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-B2-1\);">)/;

    //导入标签
    const label = await label_E(data?.label || LABELS.UNDEFINED);

    svg = implantSvgBody(svg, 20, 15, label, reg_label);

    //添加评级和值和背景
    const number = rounds(data?.value, data?.round_level)
    const number_b = number.integer
    const number_m = number.decimal

    const rank_text = torus.getTextPath(data?.rank, 305, 64, 56, 'right baseline', data?.color); //68?

    const number_text = torus.get2SizeTextPath(number_b, number_m,60, 36, 160, 140, 'center baseline', '#fff');

    svg = replaceTexts(svg, [rank_text, number_text], reg_text);
    svg = implantImage(svg,320, 160, 0, 0, 0.3, data?.background || getImageFromV3('object-score-backimage-F.jpg'), reg_background);

    return svg.toString();
}