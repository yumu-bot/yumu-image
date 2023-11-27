import {torus} from "../util/font.js";
import {label_E, LABEL_OPTION} from "../component/label.js";
import {getRoundedNumberLargerStr, getRoundedNumberSmallerStr, implantSvgBody, replaceText} from "../util/util.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_E4(data = {
    calcPP: {

    },
    statistics: {
        "count_50" : 1,
        "count_100" : 13,
        "count_300" : 1586,
        "count_geki" : 370,
        "count_katu" : 12,
        "count_miss" : 0,
    }
}, reuse = false) {
    let svg = '<g id="Card_E4"></g>';

    // 路径定义
    const reg = /(?<=<g id="Card_E4">)/;

    const mode_int = data.calcPP.pp_all.mode || 0;

    let label1 = '', label2 = '', label3 = '';
    let column = 0;

    switch (mode_int) {
        case 0: {
            column = 3;
            label1 = await label_E(await ppVariants2LabelE(data.calcPP, 'aim'), true);
            label2 = await label_E(await ppVariants2LabelE(data.calcPP, 'spd'), true);
            label3 = await label_E(await ppVariants2LabelE(data.calcPP, 'acc'), true);
        } break;
        case 1: {
            column = 2;
            label2 = await label_E(await ppVariants2LabelE(data.calcPP, 'diff'), true);
            label3 = await label_E(await ppVariants2LabelE(data.calcPP, 'acc'), true);
        } break;
        case 3: {
            column = 1;
            label3 = await label_E(await statistics2LabelE(data.calcPP, data.statistics), true);
        } break;
    }

    const rrect = column > 0 ? PanelDraw.Rect(1880 - 40 - column * 210, 200, 40 + column * 210, 70, 20, '#382E32', 1) : '';

    svg = implantSvgBody(svg, 1230, 210, label1, reg);
    svg = implantSvgBody(svg, 1440, 210, label2, reg);
    svg = implantSvgBody(svg, 1650, 210, label3, reg);
    svg = replaceText(svg, rrect, reg);

    return svg;
}

async function statistics2LabelE(calcPP, stat) {

    const sum = stat.count_geki + stat.count_300 + stat.count_katu + stat.count_100 + stat.count_50 + stat.count_miss;
    const pp_acc = (sum !== 0) ? (stat.count_geki * 320 + stat.count_300 * 300 + stat.count_katu * 200 + stat.count_100 * 100 + stat.count_50 * 50) / (sum * 320) : 0

    return {
        ...LABEL_OPTION.PPACC,
        remark: calcPP.perfect_pp ? Math.round(calcPP.pp / calcPP.perfect_pp * 100) + '% PP' : '-',
        data_b: getRoundedNumberLargerStr(pp_acc * 100, 3),
        data_m: getRoundedNumberSmallerStr(pp_acc * 100, 3) + '%',
        title_font: torus,
    };
}

async function ppVariants2LabelE(calcPP, verPP = '') {

    let version, option;
    switch (verPP) {
        case 'aim': {
            version = 'ppAim';
            option = LABEL_OPTION.AIMPP;
        } break;
        case 'spd': {
            version = 'ppSpeed';
            option = LABEL_OPTION.SPDPP;
        } break;
        case 'acc': {
            version = 'ppAcc';
            option = LABEL_OPTION.ACCPP;
        } break;
        case 'diff' : {
            version = 'ppDifficulty';
            option = LABEL_OPTION.DIFFPP;
        } break;
        default: {
            version = 'pp';
            option = LABEL_OPTION.PP;
        }
    }

    const nowPP = calcPP.pp_all[`${version}`] || 0;
    const fcPP = calcPP.perfect_pp_all[`${version}`] || 0;

    const isDisplayFC = fcPP >= nowPP;
    const isDisplayPP = (nowPP <= 1000 && isDisplayFC);

    const percent = isDisplayFC ? (Math.round(nowPP / fcPP * 100).toString() + '%') : '-%';

    return {
        ...option,
        remark: percent,
        data_b: Math.round(nowPP).toString(),
        data_m: isDisplayPP ? ('/' + Math.round(fcPP).toString() + ' PP') : '/' + Math.round(fcPP).toString(),
        title_font: torus,
    };
}
