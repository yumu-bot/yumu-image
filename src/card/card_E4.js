import {torus} from "../font.js";
import {getGameMode, PanelDraw} from "../util.js";

export function card_E4(data = {
    calcPP: {

    },
    mode: 'osu'
}, reuse = false) {
    const mode = getGameMode(data.mode, 1);

    let t1 = '', t2 = '', t3 = '', b1 = '', b2 = '', b3 = '', m1 = '', m2 = '', m3 = '';
    let row = 0;

    switch (mode) {
        case "o": {
            row = 3;
            const aimPP = data.calcPP.pp_all.ppAim || 0;
            const spdPP = data.calcPP.pp_all.ppSpeed || 0;
            const accPP = data.calcPP.pp_all.ppAcc || 0;

            const aimPF = data.calcPP.perfect_pp_all.ppAim || 0;
            const spdPF = data.calcPP.perfect_pp_all.ppSpeed || 0;
            const accPF = data.calcPP.perfect_pp_all.ppAcc || 0;
            
            t1 = 'AimPP: ';
            b1 = Math.round(aimPP).toString();
            m1 = ' / ' + Math.round(aimPF).toString() + 'PP ' + 
                (aimPF !== 0 ? Math.round(aimPP / aimPF * 100) + '%' : '0%');

            t2 = 'SpdPP: ';
            b2 = Math.round(spdPP).toString();
            m2 = ' / ' + Math.round(spdPF).toString() + 'PP ' +
                (spdPF !== 0 ? Math.round(spdPP / spdPF * 100) + '%' : '0%');

            t3 = 'AccPP: ';
            b3 = Math.round(accPP).toString();
            m3 = ' / ' + Math.round(accPF).toString() + 'PP ' +
                (accPF !== 0 ? Math.round(accPP / accPF * 100) + '%' : '0%');

        } break;

        case "t": {
            row = 2;
            const diffPP = data.calcPP.pp_all.ppDifficulty || 0;
            const accPP = data.calcPP.pp_all.ppAcc || 0;

            const diffPF = data.calcPP.perfect_pp_all.ppDifficulty || 0;
            const accPF = data.calcPP.perfect_pp_all.ppAcc || 0;
            
            t2 = 'DiffPP: ';
            b2 = Math.round(diffPP).toString();
            m2 = ' / ' + Math.round(diffPF).toString() + 'PP ' +
                (diffPF !== 0 ? Math.round(diffPP / diffPF * 100) + '%' : '0%');

            t3 = 'AccPP: ';
            b3 = Math.round(accPP).toString();
            m3 = ' / ' + Math.round(accPF).toString() + 'PP ' +
                (accPF !== 0 ? Math.round(accPP / accPF * 100) + '%' : '0%');
        } break;

        case "c": {
            row = 1;
            const diffPP = data.calcPP.pp_all.ppDifficulty || 0;

            const diffPF = data.calcPP.perfect_pp_all.ppDifficulty || 0;

            t3 = 'DiffPP: ';
            b3 = Math.round(diffPP).toString();
            m3 = ' / ' + Math.round(diffPF).toString() + 'PP ' +
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
    const rrect = row > 0 ? PanelDraw.Rect(1880 - 40 - maxWidth, 270 - row * 35, maxWidth + 40, row * 35, 20, '#382E32', 1) : '';

    const line1 = torus.getTextPath(t1, 1860 - wb1 - wm1, 198, 24, 'right baseline', '#aaa') +
        torus.getTextPath(b1, 1860 - wm1, 198, 32, 'right baseline', '#fff') +
        torus.getTextPath(m1, 1860, 198, 24, 'right baseline', '#aaa');

    const line2 = torus.getTextPath(t2, 1860 - wb2 - wm2, 228, 24, 'right baseline', '#aaa') +
        torus.getTextPath(b2, 1860 - wm2, 198, 32, 'right baseline', '#fff') +
        torus.getTextPath(m2, 1860, 198, 24, 'right baseline', '#aaa');

    const line3 = torus.getTextPath(t3, 1860 - wb3 - wm3, 258, 24, 'right baseline', '#aaa') +
        torus.getTextPath(b3, 1860 - wm3, 198, 32, 'right baseline', '#fff') +
        torus.getTextPath(m3, 1860, 198, 24, 'right baseline', '#aaa');

    return rrect + line1 + line2 + line3;
}
