import {InsertSvgBuilder, readExportFileV3, readTemplate, replaceText, torus} from "./util.js";

export const LABEL_OPTION = {
    ACC: {
        icon: readExportFileV3("object-score-accpp.png"),
        icon_title: 'Accuracy'
    },
    COMBO: {
        icon: readExportFileV3("object-score-combo.png"),
        icon_title: 'Combo'
    },
    PP: {
        icon: readExportFileV3("object-score-pp.png"),
        icon_title: 'PP'
    },
    BPM: {
        icon: readExportFileV3("object-score-beatsperminute.png"),
        icon_title: 'BPM'
    },
    LENGTH: {
        icon: readExportFileV3("object-score-length.png"),
        icon_title: 'Length'
    },
    CS: {
        icon: readExportFileV3("object-score-circlesize.png"),
        icon_title: 'CS'
    },
    AR: {
        icon: readExportFileV3("object-score-approachrate.png"),
        icon_title: 'AR'
    },
    OD: {
        icon: readExportFileV3("object-score-overalldifficulty.png"),
        icon_title: 'OD'
    },
    HP: {
        icon: readExportFileV3("object-score-healthpoint.png"),
        icon_title: 'HP'
    },
}
export async function label_E(data = {
    icon: LABEL_OPTION.ACC,
    icon_title: 'Accuracy',
    remark: '-1.64%',
    data_b: '98',
    data_m: '.36%',
}, reuse = false) {
    // 正则表达式
    let reg_text = /(?<=<g id="Text">)/;
    let reg_icon = '${icon}';

    // 读取模板
    let svg = readTemplate('template/Label_E.svg');

    // 文字的 <path>
    let icon_title = torus.getTextPath(data.icon_title, 50, 14.88, 18, "left baseline", "#a1a1a1");

    if (data.remark) {
        let remark = torus.getTextPath(data.remark, 200, 14.88, 18, "right baseline", "#646464");
        svg = replaceText(svg, remark, reg_text);
    }

    let datas = torus.getTextPath(data.data_b, 56, 44.75, 36, "left baseline", "#fff");

    if (data.data_m) {
        let data_b_x = torus.getTextMetrics(data.data_b, 0, 0, 36, "center", "#fff");
        datas = datas + torus.getTextPath(data.data_m, 56 + data_b_x.width, 44.75, 24, "left baseline", "#fff");
    }


    // 替换模板内容,replaceText(模板, 内容, 正则)
    svg = replaceText(svg, icon_title, reg_text);
    svg = replaceText(svg, datas, reg_text);

    let out_svg = new InsertSvgBuilder(svg).insertImage(data.icon, reg_icon);

    return out_svg.export(reuse);
}