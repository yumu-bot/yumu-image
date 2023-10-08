import {torus} from "../font.js";
import {PanelDraw} from "../util.js";

//drawManiaVariantRank, cr country rank, gr global rank
export function card_F7(mode = 'osu', country = 'CN', pp4k = 0, pp7k = 0, gr4k = 0, gr7k = 0, cr4k = 0, cr7k = 0) {
    if (mode === 'mania') {

        //4K: 4396PP // #114514 CN#1919
        const key4 = '4K: ' + pp4k + 'PP // #' + gr4k + ' ' + country + '#'  + cr4k;
        const key7 = '7K: ' + pp7k + 'PP // #' + gr7k + ' ' + country + '#'  + cr7k;

        const maxWidth = Math.max(torus.getTextWidth(key4, 24), torus.getTextWidth(key7, 24));
        const rrect = PanelDraw.Rect(1880 - 40 - maxWidth, 200, maxWidth + 40, 70, 20, '#382E32', 1);

        return rrect +
            torus.getTextPath(key4, 1860, 228, 24, 'right baseline', '#fff') +
            torus.getTextPath(key7, 1860, 254, 24, 'right baseline', '#fff');
    } else return '';
}