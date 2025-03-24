import {
    getImageFromV3,
    setImage,
    setText, setTexts
} from "../util/util.js";
import {torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_F4(data = {
    user: {
        ssh: 0,
        ss: 0,
        sh: 0,
        s: 0,
        a: 0,
    },
    historyUser: {}
}) {
    // 读取模板
    let svg = `
          <g id="Base_CF4">
          </g>
          <g id="Grade_CF4">
          </g>
          <g id="Text_CF4">
          </g>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base_CF4">)/;
    const reg_grade = /(?<=<g id="Grade_CF4">)/;
    const reg_text = /(?<=<g id="Text_CF4">)/;

    // 导入评级图片
    svg = setImage(svg, 49, 50, 31, 39, getImageFromV3('object-score-X-small.png'), reg_grade, 1);
    svg = setImage(svg, 157, 52, 25, 35, getImageFromV3('object-score-S-small.png'), reg_grade, 1);
    svg = setImage(svg, 260, 53, 30, 34, getImageFromV3('object-score-A-small.png'), reg_grade, 1);

    // 导入评级的数量
    const grade_X = torus.getTextPath((data.user.ss + data.user.ssh).toString(), 65, 118.795, 30, 'center baseline', '#fff');
    const grade_S = torus.getTextPath((data.user.s + data.user.sh).toString(), 170, 118.795, 30, 'center baseline', '#fff');
    const grade_A = torus.getTextPath(data.user.a.toString(), 275, 118.795, 30, 'center baseline', '#fff');
    const grade_XH = torus.getTextPath(`(+${data.user.ssh})`, 65, 144.877, 18, 'center baseline', '#aaa');
    const grade_SH = torus.getTextPath(`(+${data.user.sh})`, 170, 144.877, 18, 'center baseline', '#aaa');

    svg = setTexts(svg, [grade_X, grade_S, grade_A, grade_XH, grade_SH], reg_text);

    // 导入文本

    const grade_title = torus.getTextPath('Grades', 15, 35.795, 30, 'left baseline', '#fff');

    svg = setText(svg, grade_title, reg_text);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 340, 160, 20, '#382e32');

    svg = setText(svg, base_rrect, reg_base);

    return svg;
}