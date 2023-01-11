import fs from 'fs';
import path from 'path';
import TextToSVG from 'text-to-svg';
import exports from 'convert-svg-to-png';

export const svgToPng = async (svg) => await exports.convert(svg);

const textToSVGRegular = TextToSVG.loadSync("font/Torus-SemiBold.ttf");

export function read() {
    return fs.readFileSync("templete/1.svg", 'utf8');
}

export function getTextPath_torus(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGRegular.getPath(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "Torus",
        attributes: {
            fill: fill
        }
    })
}
export function getTextMetrics_torus(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGRegular.getMetrics(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "Torus",
        attributes: {
            fill: fill
        }
    })
}

export function replaceText(text='', rep='', reg=/.*/) {
    return text.replace(reg, rep);
}

export function getBase64Text(buffer) {
    let data = Buffer.from(buffer,'binary').toString('base64');
    return 'data:image/png;base64,' + data;
}

export async function svg1() {
    let reg_text = /(?<=<g id="Text">)/
    let reg_background = '${background}'
    let reg_avatar = '${avatar}'
    let reg_color_score = /(?<=fill: )#fbb03b/
    let reg_color_base = /(?<=fill: )#3fa9f5/

    let bg = fs.readFileSync("templete/Yumu ChocoPanel-SVG-Card1.31.png", 'binary');
    let at = fs.readFileSync("templete/Yumu ChocoPanel-SVG-Card1.32.png", 'binary');

    let r1 = getTextPath_torus("Muziyami", 210, 40, 36, "left center", "#fff");
    let r2 = getTextPath_torus("39.2M // 99W-0L 100%", 210, 70, 24, "left center", "#fff");
    let r3 = getTextPath_torus("#1", 210, 100, 24, "left center", "#fff");
    let r4_1 = getTextMetrics_torus("264", 0, 0, 48, "center", "#fff");
    let r4_2 = getTextMetrics_torus(".15pp", 0, 0, 24, "center", "#fff");
    let p4_x = 815
    let p4_y = 70
    let p1 = p4_x - (r4_1.width + r4_2.width) / 2
    let p2 = p4_x - r4_2.width / 2 + r4_1.width / 2
    let r4 = getTextPath_torus("264", p1, p4_y ,48, "left center", "#fff") + getTextPath_torus(".15pp", p2, p4_y ,24, "left center", "#fff")

    let svg = read();
    svg = replaceText(svg, "#99a25f", reg_color_score);
    svg = replaceText(svg, "#24984d", reg_color_base);
    svg = replaceText(svg, r1, reg_text)
    svg = replaceText(svg, r2, reg_text)
    svg = replaceText(svg, r3, reg_text)
    svg = replaceText(svg, r4, reg_text)

    svg = replaceText(svg, getBase64Text(bg), reg_background);
    svg = replaceText(svg, getBase64Text(at), reg_avatar);

    fs.writeFileSync("templete/2.svg", svg);
    fs.writeFileSync("templete/2.png", await svgToPng(svg));

}
// The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Promise