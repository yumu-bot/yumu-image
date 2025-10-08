import {torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

//drawManiaVariantRank, cr country rank, gr global rank
export function component_D7(data = {
   mode: 'osu', country: 'CN', pp4k: 0, pp7k: 0, gr4k: 0, gr7k: 0, cr4k: 0, cr7k: 0
}) {
    if (data.mode === 'mania') {

        //4K: 4396PP // #114514 CN#1919
        const key4 = '4K: ' + data.pp4k + 'PP // #' + data.gr4k + ' ' + data.country + '#'  + data.cr4k;
        const key7 = '7K: ' + data.pp7k + 'PP // #' + data.gr7k + ' ' + data.country + '#'  + data.cr7k;

        const maxWidth = Math.max(torus.getTextWidth(key4, 24), torus.getTextWidth(key7, 24));
        const rrect = PanelDraw.Rect(1880 - 40 - maxWidth, 200, maxWidth + 40, 70, 20, '#382E32', 1);

        return rrect +
            torus.getTextPath(key4, 1860 - maxWidth, 228, 24, 'left baseline', '#fff') +
            torus.getTextPath(key7, 1860 - maxWidth, 258, 24, 'left baseline', '#fff');
    } else return '';
}