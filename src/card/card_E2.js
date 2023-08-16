import {
    getDecimals,
    getExportFileV3Path,
    getGameMode,
    getModColor,
    getRoundedNumberLargerStr, getRoundedNumberSmallerStr,
    implantSvgBody, replaceTexts,
    torus
} from "../util.js";
import {label_E, LABEL_OPTION} from "../component/label.js";

export async function card_E2(data = {
    rank: 'SS',
    mods: ["DT", "NF"],
    score: 2274671,
    accuracy: 0.9836,
    combo: 5724,
    pp: 1919,
    mode: 'OSU',

    advanced_judge: 'nomiss', //进阶评级，也就是面板圆环下面那个玩意
    acc_index: '~ S',
    max_combo: 5724,
    full_pp: 810,
    max_pp: 1919,
    statistics: [{
        index: '300',
        stat: 9999,
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#8DCFF4',
    }, {
        index: '100',
        stat: 9999,
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#79C471',
    }],
    statistics_max: 9999,

    isFC: true,
    isPF: true,
    isBest: true,

}, reuse = false) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CE2-1">
            </clipPath>
          </defs>
          <g id="Base_CE2">
            <rect id="RUCard" width="1000" height="420" rx="20" ry="20" style="fill: #382e32;"/>
          </g>
          <g id="Ring_CE2" style="clip-path: url(#clippath-CE2-1);">
          </g>
          <g id="Advanced_CE2">
          </g>
          <g id="Label_CE2">
          </g>
          <g id="Mods_CE2">
          </g>
          <g id="Text_CE2">
          </g>
          <g id="Overlay_CE2">
          </g>`;

    // 路径定义
    const reg_mask = /(?<=<clipPath id="clippath-CE2-1">)/;

    const reg_ring = /(?<=<g id="Ring_CE2" style="clip-path: url\(#clippath-CE2-1\);">)/;
    const reg_advanced = /(?<=<g id="Advanced_CE2">)/;
    const reg_label = /(?<=<g id="Label_CE2">)/;
    const reg_mods = /(?<=<g id="Mods_CE2">)/;
    const reg_text = /(?<=<g id="Text_CE2">)/;
    const reg_overlay = /(?<=<g id="Overlay_CE2">)/;

    // 预设值定义
    const mode = getGameMode(data.mode, 1);
    const isFC = (Math.round(data.pp) === Math.round(data.full_pp)) ? true : data.isFC;
    const isPF = data.isPF;

    // 文字定义
    const score = torus.get2SizeTextPath(getRoundedNumberLargerStr(data.score, -1), getRoundedNumberSmallerStr(data.score, -1), 84, 60, 335, 79.43, 'left baseline', '#FFF');

    // 导入文字
    svg = replaceTexts(svg, [score], reg_text);

    // 部件定义
    const mods = getModsSVG(data.mods, 880, 20, 90, 42, 50);
    const rank = getRankSVG(data.rank, 100, 75);
    const mask = getMaskSVG(data.accuracy, mode, 175, 155, 230); //105 * 2
    const ring = getRingSVG(40, 20, 270, 270);
    const ring_index = getRingIndexSVG(mode, 70, 50, 210, 210);

    const advanced = getAdvancedJudgeSVG(data.advanced_judge, 20, 310)
    const best = getPersonalBestSVG(data.isBest, 20, 20);
    const statistics = getStatisticsSVG(data.statistics, data.statistics_max, 400, 60, 500, 22.79)

    const acc = await label_E({...LABEL_OPTION.ACC,
        remark: data.acc_index,
        data_b: getDecimals(data.accuracy * 100, 2),
        data_m: getDecimals(data.accuracy * 100, 3) + '%',
    }, true);
    const combo = await label_E({...LABEL_OPTION.COMBO,
        remark: isFC ? 'FC' : (data.max_combo + 'x'),
        data_b: data.combo ? data.combo.toString() : '0',
        data_m: 'x',
    }, true);
    const pp = await label_E({...LABEL_OPTION.PP,
        remark: isPF ? 'Max' : (isFC ? ('SS ' + Math.round(data.max_pp) + 'PP') : ('FC ' + Math.round(data.full_pp) + 'PP')),
        data_b: data.pp ? Math.round(data.pp).toString() : '0',
        data_m: 'PP',
    }, true);

    // 导入部件
    svg = implantSvgBody(svg, 0, 0, mods, reg_mods);
    svg = implantSvgBody(svg, 0, 0, rank, reg_overlay);
    svg = implantSvgBody(svg, 0, 0, mask, reg_mask);
    svg = implantSvgBody(svg, 0, 0, ring, reg_ring);
    svg = implantSvgBody(svg, 0, 0, ring_index, reg_overlay);

    svg = implantSvgBody(svg, 0, 0, advanced, reg_advanced);
    svg = implantSvgBody(svg, 0, 0, best, reg_overlay);
    svg = implantSvgBody(svg, 0, 0, statistics, reg_label);

    svg = implantSvgBody(svg, 350, 350, acc, reg_label);
    svg = implantSvgBody(svg, 560, 350, combo, reg_label);
    svg = implantSvgBody(svg, 770, 350, pp, reg_label);

    return svg.toString();
}

//顺便把左上角的 personal best 加了
function getPersonalBestSVG(isBest, x, y) {
    const best_link = (isBest) ? '' : 'default';
    const image = getExportFileV3Path(`object-score-personalbest${best_link}.png`);

    return `<image width="40" height="40" transform="translate(${x} ${y})" xlink:href="${image}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>`
}

// 成绩分类（中间四个照片）
function getAdvancedJudgeSVG(advanced_judge = 'played', x, y) {
    let svg = '';
    const xp = 160;
    const yp = 50;

    let pl_link = 'default';
    let cl_link = 'default';
    let nm_link = 'default';
    let pf_link = 'default';

    switch (advanced_judge) {
        case "played": pl_link = ''; break;
        case "clear": cl_link = ''; break;
        case "nomiss": nm_link = ''; break;
        case "perfect": pf_link = ''; break;
    }

    const pf = getExportFileV3Path(`object-score-perfect${pf_link}.png`);
    const nm = getExportFileV3Path(`object-score-nomiss${nm_link}.png`);
    const cl = getExportFileV3Path(`object-score-clear${cl_link}.png`);
    const pl = getExportFileV3Path(`object-score-play${pl_link}.png`);

    svg += (`<image width="150" height="40" transform="translate(${x + xp} ${y + yp})" xlink:href="${pf}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
        + `<image width="150" height="40" transform="translate(${x} ${y + yp})" xlink:href="${nm}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
        + `<image width="150" height="40" transform="translate(${x + xp} ${y})" xlink:href="${cl}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
        + `<image width="150" height="40" transform="translate(${x} ${y})" xlink:href="${pl}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
    )

    return svg;
}

function getRingSVG(x, y, w, h) {
    const index = getExportFileV3Path('object-score-coloredring.png');
    return `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${index}"/>`;
}

//成绩圆环显示 中点1055 485 x900-1210 y330-640 r=105px
function getMaskSVG(percent = 0, mode = 'o', mx = 0, my = 0, r = 0) {
    let assists;//assist points 中继点
    let rad = 2 * Math.PI * percent; //弧度

    let cx = mx + r * Math.sin(rad);
    let cy = my - r * Math.cos(rad);
    let control = `${cx} ${cy} `;//control point 控制点

    if (percent <= 0.125) {
        assists = '';
    } else if (percent <= 0.375) {
        assists = `${mx + r} ${my - r} `;
    } else if (percent <= 0.625) {
        assists = `${mx + r} ${my - r} ${mx + r} ${my + r} `;
    } else if (percent <= 0.875) {
        assists = `${mx + r} ${my - r} ${mx + r} ${my + r} ${mx - r} ${my + r} `;
    } else {
        assists = `${mx + r} ${my - r} ${mx + r} ${my + r} ${mx - r} ${my + r} ${mx - r} ${my - r} `;
    }

    return `\n<polygon id="Mask" points="${mx} ${my} ${mx} ${my - r} ${assists}${control}${mx} ${my}" style="fill: none;"/>`;
}

function getRingIndexSVG(mode, x, y, w, h) {
    let ring_name;
    switch (mode) {
        case 'o': ring_name = 'osu'; break;
        case 't':
        case 'm': ring_name = 'taikomania'; break;
        case 'c': ring_name = 'catch'; break;
    }

    const ring = getExportFileV3Path(`object-score-coloredcircle-${ring_name}.png`);

    return `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${ring}"/>`;
}

function getRankSVG(rank = 'XH', x, y) {
    const path = getExportFileV3Path(`object-score-${rank}.png`);

    let mx = 0; //很奇怪，输出明明好好的，但是位置不对
    switch (rank) {
        case 'B':
            mx = 3;
            break;
        case 'C':
            mx = -3;
            break;
        case 'D':
            mx = 5;
            break;
        case 'F':
            mx = 3;
            break;
    }

    return `<image width="150" height="150" transform="translate(${x + mx} ${y})" xlink:href="${path}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>`;
}

function getModsSVG(mods = [""], x, y, mod_w, text_h, interval) {
    let svg = '';
    const length = mods ? mods.length : 0;

    if (length <= 2 && length > 0) {
        mods.forEach((v, i) => {
            svg += insertMod(v, x - ((length - 1) * 2 * interval) + (2 * i * interval), y, mod_w, text_h);
        });
    } else if (length > 2) {
        mods.forEach((v, i) => {
            svg += insertMod(v, x - ((length - 1) * interval) + (i * interval), y, mod_w, text_h);
        });
    }

    function insertMod (mod, x, y, w, text_h){
        const color = getModColor(mod);
        const mod_abbr = torus.getTextPath(mod.toString(), x + (w / 2), y + text_h, 36, 'center baseline', '#fff');

        return `<path transform="translate(${x} ${y})"  d="m70.5,4l15,20c2.667,3.556,2.667,8.444,0,12l-15,20c-1.889,2.518-4.852,4-8,4H27.5c-3.148,0-6.111-1.482-8-4l-15-20c-2.667-3.556-2.667-8.444,0-12L19.5,4C21.389,1.482,24.352,0,27.5,0h35c3.148,0,6.111,1.482,8,4Z" style="fill: ${color};"/>\n` + mod_abbr + '\n';
    }

    return svg;
}

function getStatisticsSVG(stat = [], stat_max = 0, x, y, w, font_h) {
    let svg = '';

    stat.forEach((v, i) => {
        const text_y = y + font_h + (i + 1) * 40;
        const index_text_x = x - 14;
        const stat_text_x = x + w + 12;

        const index = (v.index === 0) ? '0' : (v.index || '');
        const stat = (v.stat === 0) ? '0' : (v.stat || '');

        const color = v.rrect_color;

        let index_text = torus.getTextPath(index.toString(),
            index_text_x, text_y, 30, "right baseline", v.index_color);
        let stat_text = torus.getTextPath(stat.toString(),
            stat_text_x, text_y, 30, "left baseline", v.stat_color);

        svg += (index_text + stat_text);

        if (v.stat > 0) {
            const rect_width = w * v.stat / stat_max;
            const svg_rect = `<rect id="L${i}RRect" x="${x}" y="${y + 40 * (i + 1)}" width="${Math.max(rect_width, 20)}" height="28" rx="10" ry="10" style="fill: ${color};"/>`;
            svg += svg_rect;
        }
    });

    return svg;
}