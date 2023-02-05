import {exportPng, readImage, readTemplate, SaveFiles} from "./util.js";
import {card_H} from "./card.js";

export async function panel_I(data = {
    background: readImage("image/I_CardH_BG.png"),
    avatar: readImage("image/I_CardH_Avatar.png"),
    name: 'Muziyami',
    info: '39.2M // 99W-0L 100%',
    rank: '#1',
    pp_b: '264',
    pp_m: 'pp',
    color_score: '#fbb03b',
    color_base: '#3fa9f5',
}) {
    let reg_background = '${background}'
    //
    let reg_height = /(?<=id="Background">[\s\S]*height=")\d+/
    let reg_cards = /(?<=<g id="cardH">)/

    const get = (path,x, y) => {
        return `<image width="900" height="110" x="${x}" y="${y}" xlink:href="${path}" />`
    }

    let bg1 = await card_H(data, true);
    let bg2 = await card_H(data, true);
    const f = new SaveFiles();
    f.saveSvgText(bg1);
    f.saveSvgText(bg2);
    let svg = readTemplate("template/Panel_I.svg");
    svg = svg.replace(reg_height, "100");



    let out = await exportPng(svg);
    f.remove()
    return out;
}

