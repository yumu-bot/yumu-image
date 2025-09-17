import {
    getImageFromV3,
    getGameMode,
    setSvgBody,
    setTexts, floors, rounds
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_E, LABELS} from "../component/label.js";
import {PanelDraw} from "../util/panelDraw.js";
import {drawLazerMods} from "../util/mod.js";

export async function card_E5(data = {
    rank: 'F',
    mods: [],
    accuracy: 0.98,
    combo: 0,
    pp: 0,
    full_pp: 0,
    max_pp: 0,
    mode: 'osu',
    miss: 0,

    advanced_judge: 'played',

    ncStats: [{
        index: '100',
        stat: 1054.6,
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#8DCFF4',
    }],
    fcStats: [],
    statistics_max: 9999,

    isFC: true,
    isPF: true,
}) {
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
    const isFC = data.isFC;

    // 文字定义
    const pp_number = floors(data.pp, 1)
    const pp_large = torus.get2SizeTextPath(pp_number.integer, pp_number.decimal + 'PP',
        84, 60, 335, 79.43, 'left baseline', '#FFF');

    // 导入文字
    svg = setTexts(svg, [pp_large], reg_text);

    // 部件定义
    const mods = drawLazerMods(data.mods, 880 + 90, 20 - 6, 70, 300, 'right', 6, true).svg;
    const rank = getRankSVG(data.rank, 100, 75);
    const mask = getMaskSVG(data.accuracy, mode, 175, 155, 230); //105 * 2
    const ring = getRingSVG(40, 20, 270, 270);
    const ring_index = getRingIndexSVG(mode, 70, 50, 210, 210);

    const advanced = getAdvancedJudgeSVG(data.advanced_judge, 20, 310)
    const best = '';
    const statisticsNC = getStatisticsRRect(data.ncStats, data.statistics_max, 400, 60, 500)
    const statisticsFC = getStatisticsSVG(data.fcStats, data.statistics_max, 400, 100, 500, 28, 12, 22.79)

    const acc_number = rounds(data.accuracy * 100, 2)

    const acc = await label_E({...((mode === 'm') ? LABELS.PPACC : LABELS.ACC),
        remark: (data.miss > 0) ? '-' + data.miss : '-',
        data_b: acc_number.integer,
        data_m: acc_number.decimal + '%',
    });
    const combo = await label_E({...LABELS.COMBO,
        remark: isFC ? 'FC' : (data.max_combo + 'x'),
        data_b: data.combo ? data.combo.toString() : '0',
        data_m: 'x',
    });
    const losspp = await label_E({...LABELS.LOSSPP,
            remark: (data.max_pp > 0) ? (Math.round(data.pp / data.max_pp * 100) - 100) + '%' : '-%',
            data_b: Math.round(data.pp - data.max_pp).toString(),
            data_m: 'PP',
        });

// 导入部件
    svg = setSvgBody(svg, 0, 0, mods, reg_mods);
    svg = setSvgBody(svg, 0, 0, rank, reg_overlay);
    svg = setSvgBody(svg, 0, 0, mask, reg_mask);
    svg = setSvgBody(svg, 0, 0, ring, reg_ring);
    svg = setSvgBody(svg, 0, 0, ring_index, reg_overlay);

    svg = setSvgBody(svg, 0, 0, advanced, reg_advanced);
    svg = setSvgBody(svg, 0, 0, best, reg_overlay);
    svg = setSvgBody(svg, 0, 0, statisticsNC, reg_label);
    svg = setSvgBody(svg, 0, 0, statisticsFC, reg_label);

    svg = setSvgBody(svg, 350, 350, acc, reg_label);
    svg = setSvgBody(svg, 560, 350, combo, reg_label);
    svg = setSvgBody(svg, 770, 350, losspp, reg_label);

    return svg.toString();
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

    const pf = getImageFromV3(`object-score-perfect${pf_link}.png`);
    const nm = getImageFromV3(`object-score-nomiss${nm_link}.png`);
    const cl = getImageFromV3(`object-score-clear${cl_link}.png`);
    const pl = getImageFromV3(`object-score-play${pl_link}.png`);

    svg += (`<image width="150" height="40" transform="translate(${x + xp} ${y + yp})" xlink:href="${pf}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
        + `<image width="150" height="40" transform="translate(${x} ${y + yp})" xlink:href="${nm}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
        + `<image width="150" height="40" transform="translate(${x + xp} ${y})" xlink:href="${cl}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
        + `<image width="150" height="40" transform="translate(${x} ${y})" xlink:href="${pl}" style="opacity: 1;" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>\n`
    )

    return svg;
}

function getRingIndexSVG(mode = 'o', x, y, w, h) {
    let ring_name;
    switch (mode) {
        case 't':
        case 'm': ring_name = 'taikomania'; break;
        case 'c': ring_name = 'catch'; break;
        default: ring_name = 'osu'; break;
    }

    const ring = getImageFromV3(`object-score-coloredcircle-${ring_name}.png`);

    return `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${ring}"/>`;
}

function getRingSVG(x, y, w, h) {
    const index = getImageFromV3('object-score-coloredring.png');
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

function getRankSVG(rank = 'XH', x, y) {
    const path = getImageFromV3(`object-score-${rank}.png`);

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

function getStatisticsSVG(stat = [], stat_max = 0, x, y, w, height, interval, font_h) {
    let svg = '';

    stat.forEach((v, i) => {
        const text_y = y + font_h + i * (height + interval);
        const index_text_x = x - 14;
        const stat_text_x = x + w + 12;

        const index = (v.index === 0) ? '0' : (v.index || '');
        const stat = (v.stat === 0) ? '0' : (v.stat || '');

        const color = v.rrect_color;

        const index_text = torus.getTextPath(index.toString(),
            index_text_x, text_y, 30, "right baseline", v.index_color);
        const stat_text = torus.getTextPath(stat.toString(),
            stat_text_x, text_y, 30, "left baseline", v.stat_color);

        svg += (index_text + stat_text);

        if (v.stat > 0) {
            const rect_width = w * v.stat / stat_max;
            svg += PanelDraw.Rect(x, y + (height + interval) * i, Math.max(rect_width, height), height, height / 2, color);
        }

        /*
        if (typeof v.stat === "number") {
            svg += PanelDraw.Rect(x, y + (height + interval) * i, w, height, height / 2, color, 0.1);
        }

         */
    });

    return svg;
}

function getStatisticsRRect(stat = [], stat_max = 0, x, y, w) {
    let svg = '';

    stat.forEach((v, i) => {
        const color = v.rrect_color;
        if (v.stat > 0) {
            const rect_width = w * v.stat / stat_max;
            svg += PanelDraw.Rect(x, y + 40 * (i + 1), Math.max(rect_width, 20), 28, 10, color);
        }
    });

    return svg;
}
