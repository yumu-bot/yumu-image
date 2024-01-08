import {
    getExportFileV3Path,
    implantImage,
    replaceText, replaceTexts
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
    svg = implantImage(svg, 31, 39, 49, 50, 1, getExportFileV3Path('object-score-X-small.png'), reg_grade);
    svg = implantImage(svg, 25, 35, 157, 52, 1, getExportFileV3Path('object-score-S-small.png'), reg_grade);
    svg = implantImage(svg, 30, 34, 260, 53, 1, getExportFileV3Path('object-score-A-small.png'), reg_grade);

    // 导入评级的数量
    const grade_X = torus.getTextPath((data.user.ss + data.user.ssh).toString(), 65, 118.795, 30, 'center baseline', '#fff');
    const grade_S = torus.getTextPath((data.user.s + data.user.sh).toString(), 170, 118.795, 30, 'center baseline', '#fff');
    const grade_A = torus.getTextPath(data.user.a.toString(), 275, 118.795, 30, 'center baseline', '#fff');
    const grade_XH = torus.getTextPath(`(+${data.user.ssh})`, 65, 144.877, 18, 'center baseline', '#aaa');
    const grade_SH = torus.getTextPath(`(+${data.user.sh})`, 170, 144.877, 18, 'center baseline', '#aaa');

    svg = replaceTexts(svg, [grade_X, grade_S, grade_A, grade_XH, grade_SH], reg_text);

    // 导入文本

    const grade_title = torus.getTextPath('Grades', 15, 35.795, 30, 'left baseline', '#fff');

    svg = replaceText(svg, grade_title, reg_text);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 340, 160, 20, '#382e32');

    svg = replaceText(svg, base_rrect, reg_base);

    return svg;
}