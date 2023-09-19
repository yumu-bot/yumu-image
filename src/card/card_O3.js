import {PanelDraw, replaceTexts} from "../util.js";
import {torus} from "../font.js";

export async function card_O3(data = {
    title: '',
    number: 0,
    color: '#fff',
}, reuse = false) {
    // 读取模板
    let svg =`
          <g id="Background_CO3">
            <rect width="190" height="30" rx="10" ry="10" style="fill: #46393F;"/>
          </g>
          <g id="Text_CO3">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CO3">)/;

    // 插入文本
    if (data.number === 0) return '';

    const color = data.color || '#fff';
    const num = data.number ? data.number.toString() : '0';

    const circle = PanelDraw.Circle(15, 15, 7, color);
    const title = torus.getTextPath(data.title, 30, 20, 18, 'left baseline', color);
    const number = torus.getTextPath(num, 180, 22, 24, 'right baseline', color);

    svg = replaceTexts(svg, [circle, title, number], reg_text);

    return svg.toString();
}