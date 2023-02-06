import {InsertSvgBuilder, readImage, readTemplate, replaceText, torus} from "./util.js";

export async function label_E(data = {
    icon: readImage("image/E_Label_Icon.png"),
    icon_title: 'Accuracy',
    remark: '-1.64%',
    data_b: '98',
    data_m: '.36%',
}, reuse = false) {
    // 正则表达式
    let reg_text = /(?<=<g id="Text">)/;
    let reg_icon = '${icon}';

    // 文字的 <path>
    let icon_title = torus.getTextPath(data.icon_title, 50, 14.88, 18, "left baseline", "#a1a1a1");
    let remark = torus.getTextPath(data.remark, 200, 14.88, 18, "right baseline", "#646464");

    let data_b_x = torus.getTextMetrics(data.data_b, 0, 0, 36, "center", "#fff");

    let datas = torus.getTextPath(data.data_b, 56, 44.75, 36, "left baseline", "#fff") +
        torus.getTextPath(data.data_m, 56 + data_b_x.width, 44.75, 24, "left baseline", "#fff");

    // 读取模板
    let svg = readTemplate('template/Label_E.svg');
    // 替换模板内容,replaceText(模板, 内容, 正则)
    svg = replaceText(svg, icon_title, reg_text);
    svg = replaceText(svg, remark, reg_text);
    svg = replaceText(svg, datas, reg_text);
    // 替换图片

    let out_svg = new InsertSvgBuilder(svg).insertImage(data.icon, reg_icon);

    return out_svg.export(reuse);
}