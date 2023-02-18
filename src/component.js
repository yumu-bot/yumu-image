import {
    getExportFileV3Path,
    readTemplate,
    implantImage,
    replaceText,
    torus
} from "./util.js";

export const LABEL_OPTION = {
    ACC: {
        icon: "object-score-accpp.png",
        icon_title: 'Accuracy'
    },
    COMBO: {
        icon: "object-score-combo.png",
        icon_title: 'Combo'
    },
    PP: {
        icon: "object-score-pp.png",
        icon_title: 'PP'
    },
    BPM: {
        icon: "object-score-beatsperminute.png",
        icon_title: 'BPM'
    },
    LENGTH: {
        icon: "object-score-length.png",
        icon_title: 'Length'
    },
    CS: {
        icon: "object-score-circlesize.png",
        icon_title: 'CS'
    },
    AR: {
        icon: "object-score-approachrate.png",
        icon_title: 'AR'
    },
    OD: {
        icon: "object-score-overalldifficulty.png",
        icon_title: 'OD'
    },
    HP: {
        icon: "object-score-healthpoint.png",
        icon_title: 'HP'
    },
    RKS: {
        icon: "object-score-max.png",
        icon_title: 'Ranked Score',
        remark: 'RS',
    },
    TTS: {
        icon: "object-score-circlesize.png",
        icon_title: 'Total Score',
        remark: 'TTS',
    },
    PC: {
        icon: "object-score-combo.png",
        icon_title: 'Play Count',
        remark: 'PC',
    },
    PT: {
        icon: "object-score-length.png",
        icon_title: 'Play Time',
        remark: 'PT',
    },
    MPL: {
        icon: "object-score-approachrate.png",
        icon_title: 'Map Played',
        remark: '',
    },
    REP: {
        icon: "object-score-aimpp.png",
        icon_title: 'Rep be Watched',
        remark: '',
    },
    FAN: {
        icon: "object-score-healthpoint.png",
        icon_title: 'Follower',
        remark: 'Fans',
    },
    TTH: {
        icon: "object-score-overalldifficulty.png",
        icon_title: 'Total Hits',
        remark: 'TTH',
    },
}

//label_D 与 label_E 一样
export async function label_D(data = {
    icon: LABEL_OPTION.RKS,
    icon_title: 'Ranked Score',
    remark: 'RS',
    data_b: '98.',
    data_m: '4 K',
}, reuse = false) {

    await label_E(data,false)
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
    svg = implantImage(svg,50,50,0,0,1,`${data.icon}`,reg_text)

    // let out_svg = new InsertSvgBuilder(svg).insertImage(data.icon, reg_icon);

    return svg.toString();
}