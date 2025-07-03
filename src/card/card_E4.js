import {torus} from "../util/font.js";
import {label_E, LABELS} from "../component/label.js";
import {setSvgBody, setText, floors} from "../util/util.js";
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
}) {
    let svg = '<g id="Card_E4"></g>';

    // 路径定义
    const reg = /(?<=<g id="Card_E4">)/;

    const mode_int = data.calcPP.pp_all.mode || 0;

    let label1 = '', label2 = '', label3 = '';
    let column = 0;

    switch (mode_int) {
        case 0: {
            column = 3;
            label1 = await label_E(await ppVariants2LabelE(data.calcPP, 'aim'));
            label2 = await label_E(await ppVariants2LabelE(data.calcPP, 'spd'));
            label3 = await label_E(await ppVariants2LabelE(data.calcPP, 'acc'));
        } break;
        case 1: {
            column = 2;
            label2 = await label_E(await ppVariants2LabelE(data.calcPP, 'diff'));
            label3 = await label_E(await ppVariants2LabelE(data.calcPP, 'acc'));
        } break;
        case 3: {
            column = 1;
            label3 = await label_E(await statistics2PGRatio(data.calcPP, data.statistics));
        } break;
    }

    const rrect = column > 0 ? PanelDraw.Rect(1880 - 40 - column * 210, 200, 40 + column * 210, 70, 20, '#382E32', 1) : '';

    svg = setSvgBody(svg, 1230, 210, label1, reg);
    svg = setSvgBody(svg, 1440, 210, label2, reg);
    svg = setSvgBody(svg, 1650, 210, label3, reg);
    svg = setText(svg, rrect, reg);

    return svg;
}

async function statistics2PGRatio(calcPP, stat) {
    let ratio_b;
    let ratio_m = '';

    const nGeki = stat.count_geki;
    const n300 = stat.count_300;

    const ratio = nGeki / n300;
    if (nGeki >= n300) {
        if (n300 !== 0) {
            const r = floors(ratio, 1)
            ratio_b = r.integer
            ratio_m = r.decimal + 'x';
        } else if (nGeki !== 0) {
            ratio_b = 'Inf.';
        } else ratio_b = '???';
    } else if (nGeki < n300) {
        if (nGeki !== 0) {
            const r = floors(ratio, 2)
            ratio_b = r.integer
            ratio_m = r.decimal + 'x';
        } else if (n300 !== 0) {
            ratio_b = 'MIN';
        } else ratio_b = '???';
    } else {
        ratio_b = '???';
    }

    return {
        ...LABELS.RATIO,
        remark: calcPP.perfect_pp ? Math.round(calcPP.pp / calcPP.perfect_pp * 100) + '% PP' : '-',
        data_b: ratio_b,
        data_m: ratio_m,
        title_font: torus,
    };
}

async function ppVariants2LabelE(calcPP, verPP = '') {

    let version, option;
    switch (verPP) {
        case 'aim': {
            version = 'ppAim';
            option = LABELS.AIMPP;
        } break;
        case 'spd': {
            version = 'ppSpeed';
            option = LABELS.SPDPP;
        } break;
        case 'acc': {
            version = 'ppAcc';
            option = LABELS.ACCPP;
        } break;
        case 'diff' : {
            version = 'ppDifficulty';
            option = LABELS.DIFFPP;
        } break;
        default: {
            version = 'pp';
            option = LABELS.PP;
        }
    }

    const nowPP = calcPP.pp_all[`${version}`] || 0;
    const fc_pp = calcPP.perfect_pp_all[`${version}`] || 0;

    const isDisplayFC = fc_pp >= nowPP;
    //const isDisplayPP = (nowPP <= 1000 && isDisplayFC);

    const percent = isDisplayFC ? (Math.round(nowPP / fc_pp * 100).toString() + '%') : '-%';

    return {
        ...option,
        remark: percent,
        data_b: Math.round(nowPP).toString(),
        data_m: ' / ' + Math.round(fc_pp).toString(),
        title_font: torus,
    };
}
