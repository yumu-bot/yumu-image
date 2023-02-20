import fs from 'fs';
import os from "os";
import TextToSVG from 'text-to-svg';
import axios from "axios";
import exports from 'convert-svg-to-png';
import https from "https";
import path from "path";

const path_util = path;
export const CACHE_PATH = path_util.join(os.tmpdir(), "/n-bot");
export const EXPORT_FILE_V3 = "D:/ExportFileV3/";

const svgToPng = async (svg) => await exports.convert(svg);

const UTF8Encoder = new TextEncoder('utf8');

const textToSVGTorusSB = TextToSVG.loadSync("font/Torus-SemiBold.ttf");
const textToSVGPuHuiTi = TextToSVG.loadSync("font/Alibaba-PuHuiTi-Medium.ttf");
const textToSVGextra = TextToSVG.loadSync("font/extra.gamemode.ttf");

export function readTemplate(path = '') {
    return fs.readFileSync(path, 'utf8');
}

export function readImage(path = '') {
    return fs.readFileSync(path, 'binary');
}

export function readExportFileV3(path = '') {
    return fs.readFileSync(path_util.join(EXPORT_FILE_V3, path), 'binary');
}

export function getExportFileV3Path(path = '') {
    return path_util.join(EXPORT_FILE_V3, path);
}

export async function readNetImage(path = '') {
    if (path.startsWith("http")) {
        return (await axios.get(path, {responseType: 'arraybuffer'})).data;
    }
}

const exportPng = svgToPng;

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
    return textToSVGTorusSB.getPath(text, {
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
    return textToSVGTorusSB.getMetrics(text, {
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

export const PuHuiTi = {};

PuHuiTi.getTextPath = getTextPath_PuHuiTi;
PuHuiTi.getTextMetrics = getTextMetrics_PuHuiTi;

function getTextPath_PuHuiTi(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGPuHuiTi.getPath(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "PuHuiTi",
        attributes: {
            fill: fill
        }
    })
}

export const extra = {};

extra.getTextPath = getTextPath_extra;
extra.getTextMetrics = getTextMetrics_extra;

function getTextPath_extra(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGextra.getPath(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "extra",
        attributes: {
            fill: fill
        }
    })
}

function getTextMetrics_extra(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGTorusSB.getMetrics(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "extra",
        attributes: {
            fill: fill
        }
    })
}

function getTextMetrics_PuHuiTi(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGTorusSB.getMetrics(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "PuHuiTi",
        attributes: {
            fill: fill
        }
    })
}


export function replaceText(base = '', replace = '', reg = /.*/) {
    return base.replace(reg, replace);
}

export function implantImage(base = '', w, h, x, y, opacity, image = '', reg = /.*/) {
    let replace = `\r\n<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${getExportFileV3Path(image)}" style="opacity: ${opacity};"/>`
    return base.replace(reg, replace);
}

export function implantSvgBody(base = '', x, y, replace = '', reg = /.*/) {
    replace = `<g transform="translate(${x} ${y})">` + replace + '</g>'
    return base.replace(reg, replace);
}

export function makeSvgBodyToSvg(svgBody = '', w, h) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}">
${svgBody}
</svg>`;
}

//色彩管理。或许开个 color util 会更好？=====================================================================================

export function getStarRatingColor(SR = 0){

    let color;
    let r0 = 0;
    let g0 = 0;
    let b0 = 0;
    let r1 = 0;
    let b1 = 0;
    let g1 = 0;
    let s = 0;

    if (SR < 0.1){
        color = '#AAAAAA'
    } else if (SR >= 9) {
        color = '#000'
    }

    if (SR < 1.25) {
        r0 = 66; g0 = 144; b0 = 251;
        r1 = 79; g1 = 192; b1 = 255;
        s = (SR - 0.1) / (1.25 - 0.1)

    } else if (SR < 2) {
        r0 = 79; g0 = 192; b0 = 255;
        r1 = 79; g1 = 255; b1 = 213;
        s = (SR - 1.25) / (2 - 1.25)

    } else if (SR < 2.5) {
        r0 = 79; g0 = 255; b0 = 213;
        r1 = 124; g1 = 255; b1 = 79;
        s = (SR - 2) / (2.5 - 2)

    } else if (SR < 3.3) {
        r0 = 124; g0 = 255; b0 = 79;
        r1 = 246; g1 = 240; b1 = 92;
        s = (SR - 2.5) / (3.3 - 2.5)

    } else if (SR < 4.2) {
        r0 = 246; g0 = 240; b0 = 92;
        r1 = 255; g1 = 104; b1 = 104;
        s = (SR - 3.3) / (4.2 - 3.3)

    } else if (SR < 4.9) {
        r0 = 255; g0 = 104; b0 = 104;
        r1 = 255; g1 = 78; b1 = 111;
        s = (SR - 4.2) / (4.9 - 4.2)

    } else if (SR < 5.8) {
        r0 = 255; g0 = 78; b0 = 111;
        r1 = 198; g1 = 69; b1 = 184;
        s = (SR - 4.9) / (5.8 - 4.9)

    } else if (SR < 6.7) {
        r0 = 198; g0 = 69; b0 = 184;
        r1 = 101; g1 = 99; b1 = 222;
        s = (SR - 5.8) / (6.7 - 5.8)

    } else if (SR < 7.7) {
        r0 = 101; g0 = 99; b0 = 222;
        r1 = 24; g1 = 21; b1 = 142;
        s = (SR - 6.7) / (7.7 - 6.7)

    } else if (SR < 9) {
        r0 = 24; g0 = 21; b0 = 142;
        r1 = 0; g1 = 0; b1 = 0;
        s = (SR - 7.7) / (9 - 7.7)

    }

    let colorR = Math.round(r0 + s * (r1 - r0)).toString(16)
    let colorG = Math.round(g0 + s * (g1 - g0)).toString(16)
    let colorB = Math.round(b0 + s * (b1 - b0)).toString(16)
    color = '#' + colorR + colorG + colorB

    return color;
}

export function getModColor(Mod = ''){
    let color;
    switch (Mod) {
        case "NF": color = '#42A5F5'; break;
        case "EZ": color = '#4CAF50'; break;
        case "HD": color = '#FDD835'; break;
        case "HR": color = '#D32F2F'; break;
        case "SD": color = '#FF9800'; break;
        case "DT": color = '#3F51B5'; break;
        case "RX": color = '#CDDC39'; break;
        case "HT": color = '#BDBDBD'; break;
        case "NC": color = '#673AB7'; break;
        case "FL": color = '#000'; break;
        case "AT": color = '#4FC3F7'; break;
        case "CN": color = '#4FC3F7'; break;
        case "SO": color = '#795548'; break;
        case "AP": color = '#DCE775'; break;
        case "PF": color = '#FFFF00'; break;
        case "XK": color = '#616161'; break;
        case "RD": color = '#388E3C'; break;
        case "TD": color = '#81D4FA'; break;
        default: color = '#fff'; break;
    }

    return color;
}

export function getRankColor(Rank = 'F'){
    let color;
    switch (Rank) {
        case "XH": color = '#FAFAFA'; break;
        case "X": color = '#FFFF00'; break;
        case "SH": color = '#BDBDBD'; break;
        case "SP": color = '#FFC107'; break; // S+
        case "S": color = '#FF9800'; break;
        case "A": color = '#4CAF50'; break;
        case "B": color = '#42A5F5'; break;
        case "C": color = '#673AB7'; break;
        case "D": color = '#D32F2F'; break;
        case "F": color = '#616161'; break;
        default: color = '#fff'; break;
    }

    return color;
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

class SaveFiles {
    files = [];
    tmpDir = '';

    constructor() {
        let tmp = randomString(6);
        while (fs.existsSync(`${CACHE_PATH}/${tmp}`)) {
            tmp = randomString(6);
        }
        this.tmpDir = `${CACHE_PATH}/${tmp}/`;
        fs.mkdirSync(this.tmpDir);
    };

    saveSvgText(text) {
        let f = randomString(4) + '.svg';
        while (this.files.includes(f)) {
            f = randomString(4) + '.svg';
        }
        this.files.push(f);

        fs.writeFileSync(this.tmpDir + f, UTF8Encoder.encode(text));
        return this.tmpDir + f;
    };

    save(file) {
        let f = randomString(4);
        while (this.files.includes(f)) {
            f = randomString(4);
        }
        this.files.push(f);
        fs.writeFileSync(this.tmpDir + f, file, 'binary');
        return this.tmpDir + f;
    };

    move(path) {
        let f = randomString(4);
        while (this.files.includes(f)) {
            f = randomString(4);
        }
        this.files.push(f);
        fs.copyFileSync(path, this.tmpDir + f);
        fs.rmSync(path);
        return this.tmpDir + f;
    }

    getAllPath() {
        return this.files.map(f => this.tmpDir + f);
    };

    getDirPath() {
        return this.tmpDir;
    };

    remove() {
        fs.rmSync(this.tmpDir, {force: true, recursive: true});
    };
}

function createImage(w, h, x, y, path) {
    return `<image width="${w}" height="${h}" x="${x}" y="${y}" xlink:href="${path}" />`
}

export class SVG {
    svg;
    tmp_root = [];

    constructor(svg) {
        this.svg = svg;
    }

    setTmpPath(path) {
        this.tmp_root.push(path);
    }

    setTmpPaths(path) {
        this.tmp_root.push.apply(this.tmp_root, path);
    }

    getTmpPath() {
        return this.tmp_root;
    }

    getSvgText() {
        return this.svg;
    }
}

export class InsertSvgBuilder {
    svg;
    reg = /(?=<\/svg>)/
    f_util = new SaveFiles();

    constructor(svg = "") {
        this.svg = svg;
    }

    check(svg) {
        if (svg instanceof SVG) {
            return svg.getSvgText();
        }
        return svg;
    }

    async insertSvg(svg, x, y) {
        return await this.insertSvgReg(svg, x, y, this.reg);
    }

    async insertSvgReg(svg, x, y, reg = /^/) {
        if (svg instanceof SVG) {
            let path = this.f_util.save(await exportPng(svg.getSvgText()));
            svg.getTmpPath().forEach(dir => fs.rmSync(dir, {force: true, recursive: true}));
            let w = parseInt(svg.getSvgText().match(/(?<=<svg[\s\S]+width=")\d+(?=")/)[0]);
            let h = parseInt(svg.getSvgText().match(/(?<=<svg[\s\S]+height=")\d+(?=")/)[0]);
            let img = createImage(w, h, x, y, path);
            this.svg = replaceText(this.svg, img, reg)
            return this;
        }

        let w = parseInt(svg.match(/(?<=<svg[\s\S]+width=")\d+(?=")/)[0]);
        let h = parseInt(svg.match(/(?<=<svg[\s\S]+height=")\d+(?=")/)[0]);
        let path = this.f_util.saveSvgText(svg);
        this.svg = replaceText(this.svg, createImage(w, h, x, y, path), reg);
        return this;
    }

    insertFlag(flag, w, h, x, y) {
        return this.insertFlagReg(flag, w, h, x, y, this.reg);
    }

    insertFlagReg(flag, w, h, x, y, reg = /^/) {
        let path = this.f_util.saveSvgText(flag);
        this.svg = replaceText(this.svg, createImage(w, h, x, y, path), reg);
        return this;
    }

    insertImage(img, reg = /^/) {
        let path;
        if (img.startsWith(CACHE_PATH)) {
            path = this.f_util.move(img);
        } else {
            path = this.f_util.save(img);
        }
        this.svg = replaceText(this.svg, path, reg);
        return this;
    }

    async export(reuse = false) {
        let out;
        if (reuse) {
            out = new SVG(this.svg);
            out.setTmpPaths(this.f_other);
            out.setTmpPath(this.f_util.getDirPath());
        } else {
            out = await exportPng(this.svg);
            this.f_util.remove();
        }
        return out;
    }
}

export async function getFlagSvg(code = "cn") {
    code = code.toUpperCase();
    let flag;
    let path = `image/flag/${code}.svg`;
    try {
        fs.accessSync(path, constants.W_OK);
    } catch (e) {
        let bit_flag = 0x1f1e6;
        let char_code_A = 65;
        let n_1 = bit_flag + code.charCodeAt(0) - char_code_A;
        let n_2 = bit_flag + code.charCodeAt(1) - char_code_A;
        let url = `https://osu.ppy.sh/assets/images/flags/${n_1.toString(16)}-${n_2.toString(16)}.svg`;

        await new Promise((resolve) => {
            https.get(url, res => {
                let out_stream = fs.createWriteStream(path);
                res.pipe(out_stream);
                out_stream.on('finish', () => {
                    resolve();
                })
            })
        })
    }
    flag = fs.readFileSync(path, "utf-8");
    return flag;
}

const Mod = {
    "NM": 0,
    "EZ": 2,
    "HD": 8,
    "HR": 16,
    "DT": 64,
    "HT": 256,
    "FL": 1024,
}

export function hasMod(modInt = 0, mod = '') {
    return Mod[mod] ? (modInt & Mod[mod]) !== 0 : false;
}

export function getModInt(mod = ['']) {
    return mod.map(v => {
        return Mod[v] ? Mod[v] : 0
    }).reduce((sum, v) => sum + v, 0);
}

export function addMod(modInt = 0, mod = '') {
    return Mod[mod] ? modInt | Mod[mod] : modInt;
}

export function getAllMod(modInt) {
    let mods = [];
    for (const [mod, i] of Object.entries(Mod)) {
        if (modInt & i) {
            mods.push(mod);
        }
    }
    return mods;
}

export function delMod(modInt = 0, mod = '') {
    return Mod[mod] ? modInt & ~Mod[mod] : modInt;
}