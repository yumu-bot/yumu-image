import {implantImage, replaceText, torus} from "../util.js";

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
        icon: "object-score-aimpp.png",
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
        icon: "object-score-circlesize.png",
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

    // 文字的 <path>
    let icon_title = torus.getTextPath(data.icon_title, 50, 14.88, 18, "left baseline", "#a1a1a1");

    let datas = torus.getTextPath(data.data_b, 56, 44.75, 36, "left baseline", "#fff");

    if (data.data_m) {
        let data_b_x = torus.getTextMetrics(data.data_b, 0, 0, 36, "center", "#fff");
        datas = datas + torus.getTextPath(data.data_m, 56 + data_b_x.width, 44.75, 24, "left baseline", "#fff");
    }

    // 尽量减少文件的读取,少量文字的模板请直接写在代码里(是少量的,东西多了还是要读取模板)
    let svg = `
        <defs>
        </defs>
        <g id="Icon">
        </g>
        <g id="Text">
            ${icon_title}
            ${datas}
        </g>
    `;

    if (data.remark) {
        let remark = torus.getTextPath(data.remark, 200, 14.88, 18, "right baseline", "#646464");
        svg = replaceText(svg, remark, reg_text);
    }
    // ${data.icon} 就是字符串化 data.icon ,另外可能你的参数层级出了问题,看下面的注释
    svg = implantImage(svg, 50, 50, 0, 0, 1, data.icon, reg_text)// 注意 LABEL_OPTION.xx = {icon:"xx.jpg", icon_title: "XX"}
    // 所以此方法的默认参数是 {icon: {icon:"xx.jpg", icon_title: "ACC"}, icon_title: "ACC"}
    // 而你大部分的传入是 {icon:"xx.jpg", icon_title: "ACC"}
    // 我猜测你想展开到data里,看最底下的注释

    // let out_svg = new InsertSvgBuilder(svg).insertImage(data.icon, reg_icon);

    return svg.toString();
}

// ******************************************************************************* 如果你想将 LABEL_OPTION.xx 展开到参数里,请使用下面的方法

export async function _label_E(data = {
    ...LABEL_OPTION.RKS,  //                                                    <--使用这种方式
    data_b: '98',
    data_m: '.36%',
}, reuse = false) {
    // todo
}

// 这样就  data = {icon:"xx.jpg", icon_title: "XX", remark:'xxx', data_b:'', data_m:''}