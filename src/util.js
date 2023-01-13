import fs from 'fs';
import TextToSVG from 'text-to-svg';
import axios from "axios";
import exports from 'convert-svg-to-png';

const svgToPng = async (svg) => await exports.convert(svg);

const textToSVGRegular = TextToSVG.loadSync("font/Torus-SemiBold.ttf");

export function readTemplete(path = '') {
    return fs.readFileSync(path, 'utf8');
}
export function readImage(path = '') {
    return fs.readFileSync(path, 'binary');
}
export async function readNetImage(path = '') {
    if (path.startsWith("http")) {
        return (await axios.get(path, {responseType: 'arraybuffer'})).data;
    }
}

export const exportPng = svgToPng;

export const torus = {};

torus.getTextPath = getTextPath_torus;
torus.getTextMetrics = getTextMetrics_torus;

function getTextPath_torus(
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

function getTextMetrics_torus(
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

export function replaceText(text = '', rep = '', reg = /.*/) {
    return text.replace(reg, rep);
}

export function getBase64Text(buffer) {
    let data = Buffer.from(buffer, 'binary').toString('base64');
    return 'data:image/png;base64,' + data;
}