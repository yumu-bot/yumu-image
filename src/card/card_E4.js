import {torus} from "../font.js";
import {label_E, LABEL_OPTION} from "../component/label.js";
import {implantSvgBody, PanelDraw, replaceText} from "../util.js";

export async function card_E4(data = {
    calcPP: {

    },
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
            column = 3;
            label2 = await label_E(await ppVariants2LabelE(data.calcPP, 'diff'), true);
            label3 = await label_E(await ppVariants2LabelE(data.calcPP, 'acc'), true);
        } break;
        case 2: {
            column = 3;
            label3 = await label_E(await ppVariants2LabelE(data.calcPP, 'diff'), true);
        } break;
    }

    const rrect = column > 0 ? PanelDraw.Rect(1880 - 40 - column * 210, 200, 40 + column * 210, 70, 20, '#382E32', 1) : '';

    svg = implantSvgBody(svg, 1230, 210, label1, reg);
    svg = implantSvgBody(svg, 1440, 210, label2, reg);
    svg = implantSvgBody(svg, 1650, 210, label3, reg);
    svg = replaceText(svg, rrect, reg);

    return svg;

    /*
    let t1 = '', t2 = '', t3 = '', b1 = '', b2 = '', b3 = '', m1 = '', m2 = '', m3 = '';
    let row = 0;

    switch (mode_int) {
        case 0: {
            row = 3;
            const aimPP = data.calcPP.pp_all.ppAim || 0;
            const spdPP = data.calcPP.pp_all.ppSpeed || 0;
            const accPP = data.calcPP.pp_all.ppAcc || 0;

            const aimPF = data.calcPP.perfect_pp_all.ppAim || 0;
            const spdPF = data.calcPP.perfect_pp_all.ppSpeed || 0;
            const accPF = data.calcPP.perfect_pp_all.ppAcc || 0;
            
            t1 = 'AimPP: ';
            b1 = Math.round(aimPP).toString();
            m1 = ' PP / ' + Math.round(aimPF).toString() + ' PP ' +
                (aimPF !== 0 ? Math.round(aimPP / aimPF * 100) + '%' : '0%');

            t2 = 'SpdPP: ';
            b2 = Math.round(spdPP).toString();
            m2 = ' PP / ' + Math.round(spdPF).toString() + ' PP ' +
                (spdPF !== 0 ? Math.round(spdPP / spdPF * 100) + '%' : '0%');

            t3 = 'AccPP: ';
            b3 = Math.round(accPP).toString();
            m3 = ' PP / ' + Math.round(accPF).toString() + ' PP ' +
                (accPF !== 0 ? Math.round(accPP / accPF * 100) + '%' : '0%');

        } break;

        case 1: {
            row = 2;
            const diffPP = data.calcPP.pp_all.ppDifficulty || 0;
            const accPP = data.calcPP.pp_all.ppAcc || 0;

            const diffPF = data.calcPP.perfect_pp_all.ppDifficulty || 0;
            const accPF = data.calcPP.perfect_pp_all.ppAcc || 0;
            
            t2 = 'DiffPP: ';
            b2 = Math.round(diffPP).toString();
            m2 = ' PP / ' + Math.round(diffPF).toString() + ' PP ' +
                (diffPF !== 0 ? Math.round(diffPP / diffPF * 100) + '%' : '0%');

            t3 = 'AccPP: ';
            b3 = Math.round(accPP).toString();
            m3 = ' PP / ' + Math.round(accPF).toString() + ' PP ' +
                (accPF !== 0 ? Math.round(accPP / accPF * 100) + '%' : '0%');
        } break;

        case 2: {
            row = 1;
            const diffPP = data.calcPP.pp_all.ppDifficulty || 0;

            const diffPF = data.calcPP.perfect_pp_all.ppDifficulty || 0;

            t3 = 'DiffPP: ';
            b3 = Math.round(diffPP).toString();
            m3 = ' PP / ' + Math.round(diffPF).toString() + ' PP ' +
                (diffPF !== 0 ? Math.round(diffPP / diffPF * 100) + '%' : '0%');

        } break;
    }
    
    const wt1 = torus.getTextWidth(t1, 24);
    const wb1 = torus.getTextWidth(b1, 32);
    const wm1 = torus.getTextWidth(m1, 24);

    const wt2 = torus.getTextWidth(t2, 24);
    const wb2 = torus.getTextWidth(b2, 32);
    const wm2 = torus.getTextWidth(m2, 24);

    const wt3 = torus.getTextWidth(t3, 24);
    const wb3 = torus.getTextWidth(b3, 32);
    const wm3 = torus.getTextWidth(m3, 24);

    const maxWidth = Math.max(wt1 + wb1 + wm1, wt2 + wb2 + wm2, wt3 + wb3 + wm3);
    const rrect = row > 0 ? PanelDraw.Rect(1880 - 40 - maxWidth, 270 - row * 32 - 6, maxWidth + 40, row * 32 + 6, 20, '#382E32', 1) : '';

    const x = 1860 - maxWidth;

    const line1 = torus.getTextPath(t1, x, 198, 24, 'left baseline', '#aaa') +
        torus.getTextPath(b1, x + wt1, 198, 32, 'left baseline', '#fff') +
        torus.getTextPath(m1, x + wt1 + wb1, 198, 24, 'left baseline', '#aaa');

    const line2 = torus.getTextPath(t2, x, 228, 24, 'left baseline', '#aaa') +
        torus.getTextPath(b2, x + wt2, 228, 32, 'left baseline', '#fff') +
        torus.getTextPath(m2, x + wt2 + wb2, 228, 24, 'left baseline', '#aaa');

    const line3 = torus.getTextPath(t3, x, 258, 24, 'left baseline', '#aaa') +
        torus.getTextPath(b3, x + wt3, 258, 32, 'left baseline', '#fff') +
        torus.getTextPath(m3, x + wt3 + wb3, 258, 24, 'left baseline', '#aaa');

    return rrect + line1 + line2 + line3;

     */
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

    const isDisplayFC = (fcPP >= nowPP && fcPP > 0);
    const isDisplayPP = (fcPP <= 1000 && isDisplayFC);

    const percent = isDisplayFC ? (Math.round(nowPP / fcPP * 100).toString() + '%') : '-%';

    return {
        ...option,
        remark: percent,
        data_b: Math.round(nowPP).toString(),
        data_m: isDisplayPP ? ('/' + Math.round(fcPP).toString() + ' PP') : '/' + Math.round(fcPP).toString(),
        title_font: torus,
    };
}
