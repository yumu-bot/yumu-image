import {
    getImageFromV3, getGameMode,
    getRoundedNumberStrLarge,
    getRoundedNumberStrSmall, getDecimals,
    implantImage, replaceText, replaceTexts, getAvatar,
} from "../util/util.js";
import {extra, torus, PuHuiTi} from "../util/font.js";
import {getModColor, getStarRatingColor, getUserRankColor} from "../util/color.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getModFullName} from "../util/mod.js";

export const LABELS = {
    UNDEFINED: {
        icon: getImageFromV3("object-score-min.png"),
        icon_title: 'Undefined',
        remark: '未知',
        abbr: 'UN',
        color_remark: '#ccc',
    },
    ACC: {
        icon: getImageFromV3("object-score-accuracy.png"),
        icon_title: 'Accuracy',
        color_remark: '#fff',
    },
    COMBO: {
        icon: getImageFromV3("object-score-combo.png"),
        icon_title: 'Combo',
        color_remark: '#fff',
    },
    PP: {
        icon: getImageFromV3("object-score-pp.png"),
        icon_title: 'PP',
        color_remark: '#fff',
    },
    LOSSPP: {
        icon: getImageFromV3("object-score-pp.png"),
        icon_title: 'Loss PP',
        color_remark: '#fff',
    },
    PPACC: {
        icon: getImageFromV3("object-score-accuracy.png"),
        icon_title: 'PP Acc',
        color_remark: '#fff',
    },
    AIMPP: {
        icon: getImageFromV3("object-score-aimpp.png"),
        icon_title: 'AimPP',
        color_remark: '#aaa',
    },
    SPDPP: {
        icon: getImageFromV3("object-score-spdpp.png"),
        icon_title: 'SpeedPP',
        color_remark: '#aaa',
    },
    ACCPP: {
        icon: getImageFromV3("object-score-accpp.png"),
        icon_title: 'AccPP',
        color_remark: '#aaa',
    },
    RATIO: {
        icon: getImageFromV3("object-score-longnote.png"),
        icon_title: 'P/G Rate',
        color_remark: '#fff',
    },
    DIFFPP: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: 'DiffPP',
        color_remark: '#aaa',
    },
    ACC2: {
        icon: getImageFromV3("object-score-accuracy2.png"),
        icon_title: 'Accuracy',
        color_remark: '#fff',
    },
    COMBO2: {
        icon: getImageFromV3("object-score-combo2.png"),
        icon_title: 'Combo',
        color_remark: '#fff',
    },
    PP2: {
        icon: getImageFromV3("object-score-pp2.png"),
        icon_title: 'PP',
        color_remark: '#fff',
    },
    SCORE2: {
        icon: getImageFromV3("object-score-score2.png"),
        icon_title: 'Score',
        color_remark: '#fff',
    },
    BPM: {
        icon: getImageFromV3("object-score-beatsperminute.png"),
        icon_title: 'BPM',
        color_remark: '#aaa',
    },
    LENGTH: {
        icon: getImageFromV3("object-score-length.png"),
        icon_title: 'Length',
        color_remark: '#aaa',
    },
    CS: {
        icon: getImageFromV3("object-score-circlesize.png"),
        icon_title: 'CS',
        color_remark: '#aaa',
    },
    AR: {
        icon: getImageFromV3("object-score-approachrate.png"),
        icon_title: 'AR',
        color_remark: '#aaa',
    },
    OD: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: 'OD',
        color_remark: '#aaa',
    },
    HP: {
        icon: getImageFromV3("object-score-healthpoint.png"),
        icon_title: 'HP',
        color_remark: '#aaa',
    },
    RKS: {
        icon: getImageFromV3("object-score-max.png"),
        icon_title: 'Ranked Score',
        remark: '进榜分',
        abbr: 'RKS',
        color_remark: '#aaa',
    },
    TTS: {
        icon: getImageFromV3("object-score-aimpp.png"),
        icon_title: 'Total Score',
        remark: '总分',
        abbr: 'TTS',
        color_remark: '#aaa',
    },
    PC: {
        icon: getImageFromV3("object-score-combo.png"),
        icon_title: 'Play Count',
        remark: '游玩次数',
        abbr: 'PC',
        color_remark: '#ccc',
    },
    PT: {
        icon: getImageFromV3("object-score-length.png"),
        icon_title: 'Play Time',
        remark: '游玩时间',
        abbr: 'PT',
        color_remark: '#ccc',
    },
    TTH: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: 'Total Hits',
        remark: '击打次数',
        abbr: 'TTH',
        color_remark: '#ccc',
    },
    RMP: {
        icon: getImageFromV3("object-score-approachrate.png"),
        icon_title: 'Played Ranked Map',
        remark: '',
        color_remark: '#aaa',
    },
    MPC: {
        icon: getImageFromV3("object-score-approachrate.png"),
        icon_title: 'Played Map',
        remark: '玩过',
        color_remark: '#aaa',
    },
    REP: {
        icon: getImageFromV3("object-score-circlesize.png"),
        icon_title: 'Replay',
        remark: '回放',
        color_remark: '#aaa',
    },
    FAN: {
        icon: getImageFromV3("object-score-healthpoint.png"),
        icon_title: 'Follower',
        remark: '粉丝',
        color_remark: '#aaa',
    },
    MDL: {
        icon: getImageFromV3("object-score-rice.png"),
        icon_title: 'Medal',
        remark: '奖章',
        color_remark: '#aaa',
    },
    SR: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: 'Star Rating',
    },
}

export const LABEL_PPP = {
    // pp+ 的
    AIM: {
        icon: getImageFromV3("object-score-max.png"),
        icon_title: '移动',
        remark: 'Aim',
        data_b: 'Aim',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    JMP: {
        icon: getImageFromV3("object-score-approachrate.png"),
        icon_title: '跳',
        remark: 'Jump Aim',
        data_b: 'Jump',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    FLW: {
        icon: getImageFromV3("object-score-spdpp.png"),
        icon_title: '串',
        remark: 'Flow Aim',
        data_b: 'Flow',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    SPD: {
        icon: getImageFromV3("object-score-beatsperminute.png"),
        icon_title: '速度',
        remark: 'Speed',
        data_b: 'Spd',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    STA: {
        icon: getImageFromV3("object-score-length.png"),
        icon_title: '耐力',
        remark: 'Stamina',
        data_b: 'Sta',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    PRE: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: '小圈',
        remark: 'Precision',
        data_b: 'Pre',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },

    ACC: {
        icon: getImageFromV3("object-score-accuracy.png"),
        icon_title: '准度',
        remark: 'Accuracy',
        data_b: 'Acc',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },

    OVA: {
        icon: getImageFromV3("object-score-aimpp.png"),
        icon_title: '综合',
        remark: 'Overall',
        data_b: 'Ova',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
}

export const LABEL_MM = {

    RC: {
        icon: getImageFromV3("object-score-rice.png"),
        icon_title: '米',
        remark: 'Rice',
        data_b: 'RC',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    LN: {
        icon: getImageFromV3("object-score-longnote.png"),
        icon_title: '面',
        remark: 'Long Note',
        data_b: 'LN',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    CO: {
        icon: getImageFromV3("object-score-circlesize.png"),
        icon_title: '协调',
        remark: 'Coordinate',
        data_b: 'CO',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    ST: {
        icon: getImageFromV3("object-score-healthpoint.png"),
        icon_title: '耐力',
        remark: 'Stamina',
        data_b: 'ST',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    SP: {
        icon: getImageFromV3("object-score-max.png"),
        icon_title: '速度',
        remark: 'Speed',
        data_b: 'SP',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    PR: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: '彩率',
        remark: 'Precision',
        data_b: 'PR',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    SV: {
        icon: getImageFromV3("object-score-beatsperminute.png"),
        icon_title: '变速',
        remark: 'S.Variation',
        data_b: 'SV',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    OV: {
        icon: getImageFromV3("object-score-aimpp.png"),
        icon_title: '综合',
        remark: 'Overall',
        data_b: 'OV',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },

}

export const LABEL_PPM = {
    ACC: {
        icon: getImageFromV3("object-score-accuracy.png"),
        icon_title: '准度',
        remark: 'Accuracy',
        data_b: 'Acc',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    PTT: {
        icon: getImageFromV3("object-score-max.png"),
        icon_title: '潜力',
        remark: 'Potential',
        data_b: 'Ptt',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    STA: {
        icon: getImageFromV3("object-score-length.png"),
        icon_title: '耐力',
        remark: 'Stamina',
        data_b: 'Sta',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    STB: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: '稳定',
        remark: 'Stability',
        data_b: 'Stb',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    PRE: {
        icon: getImageFromV3("object-score-overalldifficulty.png"),
        icon_title: '彩率',
        remark: 'Precision',
        data_b: 'Pre',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    EFT: {
        icon: getImageFromV3("object-score-healthpoint.png"),
        icon_title: '肝力',
        remark: 'Effort',
        data_b: 'Eft',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    STH: {
        icon: getImageFromV3("object-score-beatsperminute.png"),
        icon_title: '强度',
        remark: 'Strength',
        data_b: 'Sth',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    OVA: {
        icon: getImageFromV3("object-score-aimpp.png"),
        icon_title: '综合',
        remark: 'Overall',
        data_b: 'Ova',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
    SAN: {
        icon: getImageFromV3("object-score-spdpp.png"),
        icon_title: '理智',
        remark: 'Sanity',
        data_b: 'San',
        data_m: '',
        color_remark: '#aaa',
        title_font: PuHuiTi,
    },
};

export const RANK_OPTION = {
    PF: {
        icon: getImageFromV3('object-score-PF-small.png'),
        icon_title: 'Perfect FC',
    },

    FC: {
        icon: getImageFromV3('object-score-FC-small.png'),
        icon_title: 'Full Combo',
    },

    SSH: {
        icon: getImageFromV3('object-score-XH-small.png'),
        icon_title: 'SSH',
    },

    XH: {
        icon: getImageFromV3('object-score-XH-small.png'),
        icon_title: 'SSH',
    },

    X: {
        icon: getImageFromV3('object-score-X-small.png'),
        icon_title: 'SS',
    },

    SS: {
        icon: getImageFromV3('object-score-X-small.png'),
        icon_title: 'SS',
    },

    SH: {
        icon: getImageFromV3('object-score-SH-small.png'),
        icon_title: 'SH',
    },

    S: {
        icon: getImageFromV3('object-score-S-small.png'),
        icon_title: 'S',
    },

    A: {
        icon: getImageFromV3('object-score-A-small.png'),
        icon_title: 'A',
    },

    B: {
        icon: getImageFromV3('object-score-B-small.png'),
        icon_title: 'B',
    },

    C: {
        icon: getImageFromV3('object-score-C-small.png'),
        icon_title: 'C',
    },

    D: {
        icon: getImageFromV3('object-score-D-small.png'),
        icon_title: 'D',
    },
};


export async function label_C1(data = {
    avatar: '',
    name: 'Guozi on osu',
    mods_arr: [],
    score: 268397,
    rank: 6,
    maxWidth: 100,
    isWin: true,
    scoreTextColor : '#fff',

}) {
    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LC1-1">
      <circle cx="50" cy="50" r="50" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LC1">
    <circle cx="50" cy="50" r="50" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LC1-1);">
    </g>
  </g>
  <g id="Mods_LC1">
  </g>
  <g id="Label_LC1">
  </g>
  <g id="Text_LC1">
  </g>`

    //正则
    let reg_text = /(?<=<g id="Text_LC1">)/;
    let reg_mod = /(?<=<g id="Mods_LC1">)/;
    let reg_label = /(?<=<g id="Label_LC1">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LC1-1\);">)/;

    //插入模组
    let insertMod = (mod, i, offset_x) => {
        let x = offset_x + i * 10;
        let mod_color = getModColor(mod);

        if (mod === 'NF') return ''; //不画NF的图标，因为没必要
        return PanelDraw.Circle(x, 90, 10, mod_color);
    }

    let mods_arr = data?.mods_arr || ['']
    let mods_arr_length = mods_arr.length;

    mods_arr.forEach((val, i) => {
        svg = replaceText(svg, insertMod(val, i, 100 - mods_arr_length * 10), reg_mod);
    });

    //定义文本
    let text_name = torus.cutStringTail(data.name || '', 18, data.maxWidth || 100);
    let name = torus.getTextPath(text_name, 50, 118.877, 18, 'center baseline', '#fff');

    let score_b = getRoundedNumberStrLarge(data.score || 0, 5);
    let score_m = getRoundedNumberStrSmall(data.score || 0, 5);

    let score = torus.get2SizeTextPath(score_b, score_m, 24, 18, 50, 152.836, 'center baseline', data.scoreTextColor);

    let rank = torus.getTextPath(data.rank.toString() || '0', 15, 15.877, 18, 'center baseline', '#fff');

    let label_color = `
    <rect x="0" y="0" width="30" height="20" rx="10" ry="10" style="fill: ${getUserRankColor(data.rank) || '#46393f'};"/>`;

    //插入文本
    svg = replaceTexts(svg, [name, score, rank], reg_text);
    svg = replaceText(svg, label_color, reg_label);

    //插入图片，如果输了就变灰
    const opacity = data?.isWin ? 1 : 0.3;
    const avatar = await getAvatar(data.avatar, true);

    svg = implantImage(svg, 100, 100, 0, 0, opacity, avatar, reg_avatar);

    return svg.toString();
}

export async function label_C2(data = {
    avatar: '',
    name: 'Guozi on osu',
    mods_arr: [], //这个用不到
    score: 268397,
    rank: 6,
    maxWidth: 100,
    label_color: '#46393f',
    isWin: true,

}) {

    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LC2-1">
      <circle cx="15" cy="15" r="15" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LC2">
    <circle cx="15" cy="15" r="15" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LC2-1);">
    </g>
  </g>
  <g id="Label_LC2">
  </g>
  <g id="Text_LC2">
  </g>`

    //正则
    let reg_text = /(?<=<g id="Text_LC2">)/;
    let reg_label = /(?<=<g id="Label_LC2">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LC2-1\);">)/;

    //定义文本
    let text_name = torus.cutStringTail(data.name || '', 18, data.maxWidth || 100);
    let name = torus.getTextPath(text_name, 32, 13.877, 18, 'left baseline', '#fff');

    let score_b = getRoundedNumberStrLarge(data.score || 0, 3);
    let score_m = getRoundedNumberStrSmall(data.score || 0, 3);

    let score = torus.getTextPath(score_b + score_m, 52, 27.877, 14,'left baseline', '#fff');

    let rank = torus.getTextPath(data.rank.toString() || '0', 40, 27.877, 14, 'center baseline', '#fff');

    let label_color = `
    <rect x="30" y="16" width="20" height="14" rx="7" ry="7" style="fill: ${getUserRankColor(data.rank) || '#46393f'};"/>`;

    //插入文本
    svg = replaceTexts(svg, [name, score, rank], reg_text);
    svg = replaceText(svg, label_color, reg_label);

    //插入图片，如果输了就变灰
    const opacity = data?.isWin ? 1 : 0.3;
    const avatar = await getAvatar(data.avatar, true);

    //插入图片
    svg = implantImage(svg, 30, 30, 0, 0, opacity, avatar, reg_avatar);

    return svg.toString();
}

export async function label_C3(data = {
    avatar: '',
    isWin: true,

}) {
    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LC3-1">
      <circle cx="15" cy="15" r="15" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LC3">
    <circle cx="15" cy="15" r="15" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LC3-1);">
    </g>
  </g>`

    //正则
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LC3-1\);">)/;

    //插入图片，如果输了就变灰
    const opacity = data?.isWin ? 1 : 0.3;
    const avatar = await getAvatar(data.avatar, true);

    svg = implantImage(svg, 30, 30, 0, 0, opacity, avatar, reg_avatar);

    return svg.toString();
}


/**
 * panel D 在 0.4.0 升级的 label（放在右最左边），归类为 label_D1
 * @param data
 * @return {Promise<string>}
 */
export async function label_D1(data = {
    ...LABELS.ACC,
    remark: '-1.64%',
    data_b: '98',
    data_m: '.36%',
    abbr: 'ACC',
    color_remark: '#aaa',
    remark_font: torus,
}) {
    // 正则表达式
    const reg_text = /(?<=<g id="Text_LD1">)/;
    const reg_icon = /(?<=<g id="Icon_LD1">)/;

    // 文字的 <path>
    //原来是 x=50，感觉位置怪怪的
    const icon_title = torus.getTextPath(data.icon_title, 145, 68.88, 18, "right baseline", "#ccc");
    const abbr = torus.getTextPath(data.abbr, 180, 110, 36, "center baseline", "#fff");

    const number_data = torus.get2SizeTextPath(data.data_b, data.data_m, 48, 36, 177.5, 154.88, "center baseline", "#fff"); //这里向左偏移2.5居中

    let svg = `
        <g id="Icon_LD1">
        </g>
        <g id="Text_LD1">
            ${abbr}
            ${icon_title}
            ${number_data}
        </g>
    `;

    if (data.remark) {
        const remark_font = data.remark_font || torus;
        const remark = remark_font.getTextPath(data.remark, 210, 68.88, 18, "left baseline", data.color_remark);
        svg = replaceText(svg, remark, reg_text);
    }
    svg = implantImage(svg, 74, 74, 142.5, 0, 1, data.icon, reg_icon) //应该是 75

    return svg.toString();
}

/**
 * panel D 在 0.4.0 升级的 label（放在右下角），归类为 label_D2
 * @param data
 * @return {Promise<string>}
 */
export async function label_D2(data = {
    ...LABELS.ACC,
    remark: '-1.64%',
    data_b: '98',
    data_m: '.36%',
    abbr: 'ACC',
    color_remark: '#aaa',
    remark_font: torus,
}) {
    // 正则表达式
    const reg_text = /(?<=<g id="Text_LD2">)/;
    const reg_icon = /(?<=<g id="Icon_LD2">)/;

    // 文字的 <path>
    //原来是 x=50，感觉位置怪怪的
    const icon_title = torus.getTextPath(data.icon_title, 56, 14.88, 18, "left baseline", "#aaa");

    const abbr = torus.getTextPath(data.abbr, 420, 44.75, 24, "right baseline", "#aaa");
    const number_data = torus.get2SizeTextPath(data.data_b, data.data_m, 36, 24, 56, 44.75, "left baseline", "#fff");

    let svg = `
        <g id="Icon_LD2">
        </g>
        <g id="Text_LD2">
            ${abbr}
            ${icon_title}
            ${number_data}
        </g>
    `;
    if (data.remark) {
        const remark_font = data.remark_font || torus;
        const remark = remark_font.getTextPath(data.remark, 420, 14.88, 18, "right baseline", data.color_remark);
        svg = replaceText(svg, remark, reg_text);
    }
    svg = implantImage(svg, 50, 50, 0, 0, 1, data.icon, reg_icon)

    return svg.toString();
}

/**
 * label_B、label_D 与 label_E 一样
 * @param data
 * @return {Promise<string>}
 */
export async function label_E(data = {
    ...LABELS.ACC,
    remark: '-1.64%',
    data_b: '98',
    data_m: '.36%',
    color_remark: '#aaa',
    remark_font: torus,
    title_font: torus,
}) {
    // 正则表达式
    const reg_text = /(?<=<g id="Text_LE">)/;
    const reg_icon = /(?<=<g id="Icon_LE">)/;

    // 文字的 <path>
    //原来是 x=50，感觉位置怪怪的
    const title_font = data.title_font || torus;
    const icon_title = title_font.getTextPath(data.icon_title, 56, 14.88, 18, "left baseline", "#aaa");

    const number_data = torus.get2SizeTextPath(data.data_b, data.data_m, 36, 24, 56, 44.75, "left baseline", "#fff");

    let svg = `
        <g id="Icon_LE">
        </g>
        <g id="Text_LE">
            ${icon_title}
            ${number_data}
        </g>
    `;

    if (data.remark) {
        const remark_font = data.remark_font || torus;
        const remark = remark_font.getTextPath(data.remark, 200, 14.88, 18, "right baseline", data.color_remark);
        svg = replaceText(svg, remark, reg_text);
    }
    svg = implantImage(svg, 50, 50, 0, 0, 1, data.icon, reg_icon)

    return svg.toString();
}

//BPA-J1-Mod标签
export async function label_J1(data = {
    mod: 'DT',
    count: 88,
    pp: 1611,
}) {

    //正则
    let reg_text = /(?<=<g id="Text_LJ1">)/;
    let reg_modcolor = '${mod_color}';

    //定义文本
    let mod = data.mod || '';

    let mod_abbr = torus.getTextPath(mod, 35, 36.795, 30, 'center baseline', '#fff');
    let mod_fullname = torus.getTextPath(getModFullName(mod), 75 ,12.877, 18, 'left baseline', '#fff');
    let mod_count = torus.getTextPath(data.count + 'x', 75 ,28.877, 18, 'left baseline', '#aaa');
    let pp = torus.get2SizeTextPath(
        Math.round(data.pp).toString() || '0', 'PP',
        30, 18,
        210, 54.795,
        'right baseline', '#fff');

    let mod_color = getModColor(mod);

    let svg = `<g id="Mod">\n <path d="m56.357,4.496l11.865,18c2.201,3.339,2.201,7.668,0,11.007l-11.865,18c-1.85,2.807-4.987,4.496-8.349,4.496h-26.142c-3.362,0-6.499-1.689-8.349-4.496L1.651,33.504c-2.201-3.339-2.201-7.668,0-11.007L13.516,4.496C15.366,1.689,18.503,0,21.865,0h26.142c3.362,0,6.499,1.689,8.349,4.496Z" style="fill: ${mod_color};"/>\n </g>\n <g id="Text_LJ1">\n </g>`;

    //插入文本
    svg = replaceTexts(svg, [mod_abbr, mod_fullname, mod_count, pp], reg_text);
    svg = replaceText(svg, mod_color, reg_modcolor);

    return svg.toString();
}

//BPA-J2-谱师标签
export async function label_J2(data = {
    index: 1,
    avatar: 'https://a.ppy.sh/',
    name: 'Sotrash',
    count: 88,
    pp: 1611,
}) {

    //正则
    let reg_text = /(?<=<g id="Text_LJ2">)/;
    let reg_index = /(?<=<g id="Index_LJ2">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LJ2\);">)/;

    //定义文本
    let index = torus.getTextPath(data.index.toString(), 14,  21.836, 24, 'center baseline', '#fff');
    let name = torus.getTextPath(
        torus.cutStringTail(data.name, 24, 160, true),
        87.867, 21.836, 24,  'left baseline', '#fff');
    let count = torus.get2SizeTextPath(data.count.toString(), 'x',24, 18, 87.867, 49.836, 'left baseline', '#aaa');
    let pp = torus.get2SizeTextPath(Math.round(data.pp).toString() || '0',
        'PP',
        30,
        18,
        248,
        76.795,
        'right baseline',
        '#fff')
    let index_color = getUserRankColor(data.index);

    let svg = `  <defs>
    <clipPath id="clippath-LJ2">
      <rect x="8" y="8" width="70" height="70" rx="10" ry="10" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Head_LJ2">
    <rect x="8" y="8" width="70" height="70" rx="10" ry="10" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LJ2);">
    </g>
    <circle cx="14" cy="14" r="14" style="fill: ${index_color};"/>
  </g>
  <g id="Index_LJ2">
  </g>
  <g id="Text_LJ2">
  </g>`;

    //插入文本
    svg = replaceTexts(svg, [name, count, pp], reg_text);
    svg = replaceText(svg, index, reg_index);

    //插入图片
    const avatar = await getAvatar(data.avatar, true);
    svg = implantImage(svg, 70, 70, 8, 8, 1, avatar, reg_avatar);

    return svg.toString();
}


//BPA-J3-评级标签
export async function label_J3(data = {
    icon: getImageFromV3('object-score-XH-small.png'),
    map_count: 100,
    pp_percentage: 0.667, //占raw pp的比
    pp_count: 12345,
}) {
    let svg = `  
  <g id="Icon_LJ3">
  </g>
  <g id="Text_LJ3">
  </g>`;

    //正则
    let reg_text = /(?<=<g id="Text_LJ3">)/;
    let reg_icon = /(?<=<g id="Icon_LJ3">)/;

    //定义文本
    let map_count = torus.get2SizeTextPath(
        data.map_count.toString() || '0',
        'x',
        36,
        24,
        150,
        26,
        'right baseline',
        '#fff'
    );

    let pp_percentage = torus.getTextPath(
        (data.pp_percentage * 100).toFixed(1).toString() + '%' || '0%',
        2, //0
        52,
        16, //18
        'left baseline',
        '#aaa'
    );

    let pp_count = torus.get2SizeTextPath(
        Math.round(data.pp_count).toString() || '0',
        'PP',
        24,
        18,
        150,
        52,
        'right baseline',
        '#aaa'
    );

    //插入文本
    svg = replaceText(svg, map_count, reg_text);
    svg = replaceText(svg, pp_percentage, reg_text);
    svg = replaceText(svg, pp_count, reg_text);

    //插入图片
    svg = implantImage(svg, 40, 40, 0, 0, 1,
        data.icon || getImageFromV3('object-score-F-small.png'), reg_icon);

    return svg.toString();
}

//Q-M1-难度标签
export async function label_M1(data = {
    mode: 'osu',
    difficulty_name: 'Skystar\'s Tragic Love Extra',
    star_rating: 5.46,
    maxWidth: 0,
    star: getImageFromV3('object-beatmap-star.png'),

    hasAvatar: false,
    uid: 7003013
}) {

    let svg = `
    <clipPath id="clippath-LM1">
      <circle cx="26" cy="25" r="18" style="fill: none;"/>
    </clipPath>
  <g id="RRect_LM1">
  </g>
  <g id="Icon_LM1">
  </g>
  <g id="Avatar_LM1" style="clip-path: url(#clippath-LM1);">
  </g>
  <g id="Text_LM1">
  </g>`;

    //正则
    const reg_text = /(?<=<g id="Text_LM1">)/;
    const reg_icon = /(?<=<g id="Icon_LM1">)/;
    const reg_rrect = /(?<=<g id="RRect_LM1">)/;
    const reg_avatar = /(?<=<g id="Avatar_LM1" style="clip-path: url\(#clippath-LM1\);">)/;

    //定义文本
    const diff_name_path = torus.getTextPath(
        torus.cutStringTail(data.difficulty_name, 18, data.maxWidth - 50 - 10, true),
        50, 20, 18, 'left baseline', '#fff');
    const star_rating_path = torus.get2SizeTextPath(
        getDecimals(data.star_rating, 2),
        getDecimals(data.star_rating, 3),
        24,
        18,
        50,
        42,
        'left baseline',
        '#fff'
    );
    const mode_icon_color = getStarRatingColor(data.star_rating);
    let mode_icon_path = extra.getTextPath(
        getGameMode(data.mode, -1),
        8, 38.5, 38, 'left baseline', mode_icon_color);

    //如果可以放头像，那么不需要SR，改为放头像
    if (data.hasAvatar) {
        mode_icon_path = '';

        const uid = data.uid || 0;
        const avatar = await getAvatar(uid, false);

        svg = implantImage(svg, 36, 36, 8, 7, 1, avatar, reg_avatar);
    }

    //插入文本
    svg = replaceTexts(svg, [diff_name_path, star_rating_path, mode_icon_path], reg_text);

    //星数
    let sr_b = getDecimals(data.star_rating, 0);
    let sr_m = getDecimals(data.star_rating, 1);
    let sr_m_scale = Math.pow(sr_m, 0.8);

    //超宽处理
    const dot3 = torus.getTextPath('...',data.maxWidth - 18 ,44 ,18,'right baseline', '#BE2CFA');

    if (sr_b >= 10) {
        sr_b = 10;
        sr_m_scale = 0;
    }

    if (data.maxWidth <= 262 && sr_b >= 7) {
        sr_b = 7;
        sr_m_scale = 0;
        svg = replaceText(svg, dot3, reg_icon);
    }


    for (let i = 1; i <= sr_b; i++) {
        let sr_b_svg = `<g style="clip-path: url(#clippath-PE-R${i});">
            <image id="M1Label${i}Star" width="18" height="18" transform="translate(${15 * (i - 1) + 90} 26)" xlink:href="${data.star}"/>
        </g>`;
        svg = replaceText(svg, sr_b_svg, reg_icon);
    }

    const sr_m_svg = `<g style="clip-path: url(#clippath-PE-R${sr_b + 1});">
        <image id="M1Label${sr_b + 1}Star" width="18" height="18" transform="translate(${15 * sr_b + 90} 26) translate(${9 * (1 - sr_m_scale)} ${9 * (1 - sr_m_scale)}) scale(${sr_m_scale})" xlink:href="${data.star}"/>
        </g>`;

    svg = replaceText(svg, sr_m_svg, reg_icon);

    //插入矩形

    const rrect_sr_path = PanelDraw.Rect(0, 0, data.maxWidth, 50, 25, mode_icon_color, 0.15);
    const rrect_base_path = PanelDraw.Rect(0, 0, data.maxWidth, 50, 25, '#46393F');

    svg = replaceText(svg, rrect_sr_path, reg_rrect);
    svg = replaceText(svg, rrect_base_path, reg_rrect);

    return svg.toString();
}

//Q-M2-客串谱师标签
export async function label_M2(data = {
    host_uid: 873961,
    uid: 873961,
}) {

    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LM2">
      <circle cx="50" cy="50" r="50" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="RRect_LM2">
  </g>
  <g id="Avatar_LM2">
    <circle cx="50" cy="50" r="50" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LM2);">
    </g>
  </g>
  <g id="Bid_LM2">
  </g>
  <g id="Label_LM2">
  </g>
  <g id="Text_LM2">
  </g>`

    //正则
    // const reg_text = /(?<=<g id="Text_LM2">)/;
    const reg_label = /(?<=<g id="Label_LM2">)/;
    //const reg_rrect = /(?<=<g id="RRect_LM2">)/;
    const reg_bid = /(?<=<g id="Bid_LM2">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LM2\);">)/;

    //定义文本
    const uid = data.uid || 0;
    const avatar = await getAvatar(uid, false);

    let host = 'G';
    let host_color = '#382E32'
    let host_rrect_color = '#B8D3E0';

    if (data.host_uid === data.uid && data.uid > 0) {
        host = 'H';
        host_color = '#B8D3E0';
        host_rrect_color = '#382E32';
    }

    const host_text = torus.getTextPath(host, 15, 15.877, 18, 'center baseline', host_color);
    const host_rrect = PanelDraw.Rect(0, 0, 30, 20, 10, host_rrect_color);

    // const name_width = torus.getTextWidth(data.uid, 18);
    // const name_text = torus.getTextPath(data.uid, 50, 89.5, 18, 'center baseline', host_color);
    // const name_rrect = PanelDraw.Rect(100 - name_width / 2 - 5, 85, name_width + 10, 20, 10, host_rrect_color);

    //插入文本
    svg = implantImage(svg, 100, 100, 0, 0, 1, avatar, reg_avatar);
    svg = replaceText(svg, host_text, reg_label);
    svg = replaceText(svg, host_rrect, reg_bid);
    // svg = replaceText(svg, name_text, reg_label);
    // svg = replaceText(svg, name_rrect, reg_rrect);

    return svg.toString();
}

//Q-M3-四维标签
export async function label_M3(data = {
    label1: {
    },
    label2: {
    },
    label3: {
    },

    maxWidth: 650 / 3,
}) {

    let svg = `
  <g id="Icon_LM3">
  </g>
  <g id="Text_LM3">
  </g>`;

    //正则
    const reg_text = /(?<=<g id="Text_LM3">)/;
    const reg_icon = /(?<=<g id="Icon_LM3">)/;

    //定义位置
    //const max_width = data.maxWidth;
    //如果是一排6个，那么需要缩减一下！
    //230731更新，这里不需要缩减了，长的太丑
    const interval = 4; //(max_width > 650 / 3) ? 98 : 70;
    const label_width = 66;

    const hasLabel2 = (data.label2.icon_title !== '');

    const label1_x = hasLabel2 ? (- interval - (label_width * 3 / 2)) : ((- interval / 2) - label_width);
    const label2_x = - (label_width / 2);
    const label3_x = hasLabel2 ? (interval + (label_width / 2)) : (interval / 2);

    //定义文本
    const label1_text = torus.get2SizeTextPath(
        data.label1.data_b, data.label1.data_m, 24, 18, 30 + label1_x, 20, 'left baseline', '#fff');
    const label2_text = torus.get2SizeTextPath(
        data.label2.data_b, data.label2.data_m, 24, 18, 30 + label2_x, 20, 'left baseline', '#fff');
    const label3_text = torus.get2SizeTextPath(
        data.label3.data_b, data.label3.data_m, 24, 18, 30 + label3_x, 20, 'left baseline', '#fff');

    svg = replaceTexts(svg, [label1_text, label2_text, label3_text], reg_text);

    svg = implantImage(svg, 25, 25, label1_x, 0, 1, data.label1.icon, reg_icon);
    svg = implantImage(svg, 25, 25, label2_x, 0, 1, data.label2.icon, reg_icon);
    svg = implantImage(svg, 25, 25, label3_x, 0, 1, data.label3.icon, reg_icon);

    return svg.toString();
}


//MSL-N1-成绩标签
export async function label_N(data = {
    icon: getImageFromV3("object-score-acc2.png"),
    icon_title: 'ACC',
    data_b: '98.',
    data_m: '36%',
}) {
    let svg = `
  <g id="Icon_LN1">
  </g>
  <g id="Text_LN1">
  </g>`;

    //正则
    const reg_text = /(?<=<g id="Text_LN1">)/;
    const reg_icon = /(?<=<g id="Icon_LN1">)/;

    //定义文本
    const label_text = torus.get2SizeTextPath(
        data.data_b, data.data_m, 22, 18, 25, 17, 'left baseline', '#fff'); // lS 18/ sS 14/ y15

    svg = replaceText(svg, label_text, reg_text);
    svg = implantImage(svg, 20, 20, 0, 0, 1, data.icon, reg_icon)

    return svg.toString();
}

//IM-O-玩家牌（getUser - groups）
export async function label_O(data = {
    "colour": "#A347EB",
    "id": 28,
    "identifier": "bng",
    "name": "Beatmap Nominators",
    "short_name": "BN",
}) {

    //导入模板
    let svg = `  
  <g id="RRect_LO1">
  </g>
  <g id="Text_LO1">
  </g>`

    //正则
    const reg_text = /(?<=<g id="Text_LO1">)/;
    const reg_rrect = /(?<=<g id="RRect_LO1">)/;

    //定义文本
    const text = torus.getTextPath(data.short_name, 40, 22, 24, 'center baseline', '#fff');
    const base_rrect = PanelDraw.Rect(0, 0, 80, 28, 14, data.colour);

    //插入文本
    svg = replaceText(svg, text, reg_text);
    svg = replaceText(svg, base_rrect, reg_rrect);

    return svg.toString();
}
