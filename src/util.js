import fs from 'fs';
import os from "os";
import TextToSVG from 'text-to-svg';
import axios from "axios";
import exports from 'convert-svg-to-png';

const svgToPng = async (svg) => await exports.convert(svg);

const UTF8Encoder = new TextEncoder('utf8');

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

export function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

export class SaveFiles{
    files = [];
    tmpDir = '';
    constructor() {
        let tmp = randomString(6);
        while (fs.existsSync(`${os.tmpdir()}/${tmp}`)){
            tmp = randomString(6);
        }
        this.tmpDir = `${os.tmpdir()}/${tmp}/`;
        fs.mkdirSync(this.tmpDir);
    };
    saveSvgText(text){
        let f = randomString(4)+'.svg';
        while (this.files.includes(f)) {
            f = randomString(4)+'.svg';
        }
        this.files.push(f);

        fs.writeFileSync(this.tmpDir + f, UTF8Encoder.encode(text));
    };
    save(file){
        let f = randomString(4);
        while (this.files.includes(f)) {
            f = randomString(4);
        }
        this.files.push(f);
        fs.writeFileSync(this.tmpDir + f, file);
    };

    getAllPath(){
        return this.files.map(f => this.tmpDir + f);
    };

    remove() {
        fs.rmSync(this.tmpDir, {recursive: true});
    };
}