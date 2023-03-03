import {getExportFileV3Path, InsertSvgBuilder, readTemplate, replaceText, torus} from "../util.js";
import {card_H} from "../card/card_H.js";

export async function panel_I(data = {
    // A2卡
    card_A2: {
        background: getExportFileV3Path('PanelObject/A_CardA1_BG.png'),
        match_title: 'MP5 S11: (肉蛋葱鸡) vs (超级聊天)',
        match_round: 0,
        match_time: '17:32-22:34',
        match_date: '2021-02-16',
        average_star_rating: 5.46,
        average_drain_time: '3:46'

    },
    // H卡



}) {
    let reg_background = '${background}'
    //
    let reg_height = /(?<=id="Background">[\s\S]*height=")\d+/
    let reg_cards = /(?<=<g id="cardH">)/
    let reg_text = /(?<=<g id="Text">)/;

    const get = (path, x, y) => {
        return `<image width="900" height="110" x="${x}" y="${y}" xlink:href="${path}" />`
    }

    let bg1 = await card_H(data, true);
    data.pp_b = '15';
    let bg2 = await card_H(data, true);


    let a1 = torus.getTextPath("24", 20, 97, 24, 'left center', "#fff");
    let a2 = torus.getTextPath("16", 120, 97, 16, 'left center', "#fff");
    let a3 = torus.getTextPath("12", 220, 97, 12, 'left center', "#fff");
    let svg = readTemplate("template/Panel_I.svg");

    svg = replaceText(svg, a1, reg_text);
    svg = replaceText(svg, a2, reg_text);
    svg = replaceText(svg, a3, reg_text);


    let out_svg = new InsertSvgBuilder(svg);
    await out_svg.insertSvg(bg1, 10, 100);
    await out_svg.insertSvg(bg2, 10, 400);
    await out_svg.insertSvg(bg1, 300, 210);
    await out_svg.insertSvg(bg2, 300, 510);
    return out_svg.export();
}

