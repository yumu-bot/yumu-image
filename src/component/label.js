import {
    getExportFileV3Path,
    getModColor,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    implantImage,
    replaceText,
    torus
} from "../util.js";

export const LABEL_OPTION = {
    ACC: {
        icon: getExportFileV3Path("object-score-accpp.png"),
        icon_title: 'Accuracy'
    },
    COMBO: {
        icon: getExportFileV3Path("object-score-combo.png"),
        icon_title: 'Combo'
    },
    PP: {
        icon: getExportFileV3Path("object-score-pp.png"),
        icon_title: 'PP'
    },
    BPM: {
        icon: getExportFileV3Path("object-score-beatsperminute.png"),
        icon_title: 'BPM'
    },
    LENGTH: {
        icon: getExportFileV3Path("object-score-length.png"),
        icon_title: 'Length'
    },
    CS: {
        icon: getExportFileV3Path("object-score-circlesize.png"),
        icon_title: 'CS'
    },
    AR: {
        icon: getExportFileV3Path("object-score-approachrate.png"),
        icon_title: 'AR'
    },
    OD: {
        icon: getExportFileV3Path("object-score-overalldifficulty.png"),
        icon_title: 'OD'
    },
    HP: {
        icon: getExportFileV3Path("object-score-healthpoint.png"),
        icon_title: 'HP'
    },
    RKS: {
        icon: getExportFileV3Path("object-score-max.png"),
        icon_title: 'Ranked Score',
        remark: 'RS',
    },
    TTS: {
        icon: getExportFileV3Path("object-score-aimpp.png"),
        icon_title: 'Total Score',
        remark: 'TTS',
    },
    PC: {
        icon: getExportFileV3Path("object-score-combo.png"),
        icon_title: 'Play Count',
        remark: 'PC',
    },
    PT: {
        icon: getExportFileV3Path("object-score-length.png"),
        icon_title: 'Play Time',
        remark: 'PT',
    },
    MPL: {
        icon: getExportFileV3Path("object-score-approachrate.png"),
        icon_title: 'Map Played',
        remark: '',
    },
    REP: {
        icon: getExportFileV3Path("object-score-circlesize.png"),
        icon_title: 'Rep be Watched',
        remark: '',
    },
    FAN: {
        icon: getExportFileV3Path("object-score-healthpoint.png"),
        icon_title: 'Follower',
        remark: 'Fans',
    },
    TTH: {
        icon: getExportFileV3Path("object-score-overalldifficulty.png"),
        icon_title: 'Total Hits',
        remark: 'TTH',
    },
}

//label_D 与 label_E 一样

export async function label_E(data = {
    ...LABEL_OPTION.ACC,
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
        let remark = torus.getTextPath(data.remark, 200, 14.88, 18, "right baseline", "#fff");
        svg = replaceText(svg, remark, reg_text);
    }
    svg = implantImage(svg, 50, 50, 0, 0, 1, data.icon, reg_text)

    return svg.toString();
}

export async function label_F1(data = {
    avatar: 'PanelObject/F_LabelF1_Avatar.png',
    name: 'Guozi on osu',
    mods_arr: [],
    score: 268397,
    rank: 6,
    maxWidth: 100,
    label_color: '#46393f',

}, reuse = false) {
    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LF1-1">
      <circle cx="50" cy="50" r="50" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar">
    <circle cx="50" cy="50" r="50" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LF1-1);">
    </g>
  </g>
  <g id="Mods">
  </g>
  <g id="Label">
  </g>
  <g id="Text">
  </g>`

    //正则
    let reg_text = /(?<=<g id="Text">)/;
    let reg_mod = /(?<=<g id="Mods">)/;
    let reg_label = /(?<=<g id="Label">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LF1-1\);">)/;

    //插入模组
    let insertMod = (mod, i, offset_x) => {
        let x = offset_x + i * 10;
        let mod_color = getModColor(mod);

        return `<circle id="Mod${i}" cx="${x}" cy="90" r="10" style="fill: ${mod_color};"/>`;
    }

    let mods_arr = data.mods_arr ? data.mods_arr : ['']
    let mods_arr_length = mods_arr.length;

    mods_arr.forEach((val, i) => {
        svg = replaceText(svg, insertMod(val, i, 100 - mods_arr_length * 10), reg_mod);
    });

    //定义文本
    let text_name = torus.cutStringTail(data.name || '', 18, data.maxWidth || 100);
    let name = torus.getTextPath(text_name, 50, 118.877, 18, 'center baseline', '#fff');

    let score_b = getRoundedNumberLargerStr(data.score || 0, 1);
    let score_m = getRoundedNumberSmallerStr(data.score || 0, 1);

    let score = torus.get2SizeTextPath(score_b, score_m, 24, 18, 50, 152.836, 'center baseline', '#fff');

    let rank = torus.getTextPath(data.rank.toString() || '0', 15, 15.877, 18, 'center baseline', '#fff');

    let label_color = `
    <rect x="0" y="0" width="30" height="20" rx="10" ry="10" style="fill: ${data.label_color || '#46393f'};"/>`;

    //插入文本
    svg = replaceText(svg, name, reg_text);
    svg = replaceText(svg, score, reg_text);
    svg = replaceText(svg, rank, reg_text);
    svg = replaceText(svg, label_color, reg_label);

    //插入图片
    svg = implantImage(svg, 100, 100, 0, 0, 1, data.avatar || getExportFileV3Path('avatar-guest.png'), reg_avatar);

    return svg.toString();
}
