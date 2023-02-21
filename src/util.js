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

const mascot_pic_sum_arr = [5,0,0,0,0,0,0,0,0]; //吉祥物的对应的照片数量，和随机banner一样的

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
    let replace = `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${getExportFileV3Path(image)}" style="opacity: ${opacity};"/>`
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

// 数字处理并显示

/**
 * @function 获取大小文本的 torus 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点横坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 */

export function get2SizeTorusTextPath (largerText, smallerText, largeSize, smallSize, x, y, anchor,color) {
    let width_b = torus.getTextMetrics(largerText, x, y, largeSize, anchor, color).width;
    let width_m = torus.getTextMetrics(smallerText, x, y, smallSize, anchor, color).width;
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = torus.getTextPath(largerText, x, y, largeSize, anchor, color) +
        torus.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = torus.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            torus.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = torus.getTextPath(largerText, x - width_a, y, largeSize, anchor, color) +
        torus.getTextPath(smallerText, x + width_a, y, smallSize, anchor, color);
    }

    return out;
}

/**
 * @function 数字处理（缩进数字，与主bot的DataUtil - getRoundedNumberStr效果一样
 * @return {String} 返回大数字的字符串
 * @param number 数字
 * @param level 等级，现在支持lv -1, 0, 1, 2 注意配套使用
 */
export function getRoundedNumberLargerStr (number = 0, level = 0) {
    let o;

    // lv0是只把前四位数放大，且补足到7位，无单位 7945671 -> 794 5671, 12450 -> 001 2450 0 -> 0000000
    // lv-1是只把前四位数放大，且不补足，无单位 7945671 -> 794 5671, 12450 -> 1 2450

    const SpecialRoundedLargeNum = (number) => {
        let p = 0;

        if (number <= Math.pow(10, 8)) {
            p = 4; //5671 1234 -> 5671

        } else if (number <= Math.pow(10, 12)) {
            p = 8; //794 5671 1234 -> 794

        }  else if (number <= Math.pow(10, 16)) {
            p = 12; //794 5671 1234 0000 -> 794

        } else {
            return '';
        }
        let re = Math.floor(number / Math.pow(10, p));

        if (re === 0){
            return ''
        } else {
            return re.toString()
        }
    }

    if (level === -1) {
        if (number <= Math.pow(10, 7)) {
            return number.toString().padStart(7,'0').slice(0, -4);// 4 5671 -> 004

        } else {
            return SpecialRoundedLargeNum(number);
        }
    }

    if (level === 0) {
        if (number <= Math.pow(10, 4)) {
            return Math.floor(number).toString()

        } else {
            return SpecialRoundedLargeNum(number);
        }
    }

    //旧 level

    if (level === 1) {
        while (number >= 100 || number <= -100) { number /= 100;}
    }

    if (level === 2) {
        while (number >= 1000 || number <= -1000) { number /= 1000;}
    }

        //如果小数太小，可不要小数点
        if (number - Math.floor(number) >= 0.0001) {
            o = Math.floor(number).toString() + '.';
        } else {
            o = Math.floor(number).toString()
        }

        return o;
}

/**
 * @function 数字处理（缩进数字，与主bot的DataUtil - getRoundedNumberStr效果一样
 * @return {String} 返回小数字的字符串
 * @param number 数字
 * @param level 等级，现在支持lv -1, 0, 1, 2 注意配套使用
 */
export function getRoundedNumberSmallerStr (number = 0, level = 0) {
    let o;

    const SpecialRoundedSmallNum = (number) => {
        let s = 0;

        if (number <= Math.pow(10, 8)) {
            s = -4; //5671 1234 -> 1234

        } else if (number <= Math.pow(10, 12)) {
            s = -8; //794 5671 1234 -> 5671 1234

        }  else if (number <= Math.pow(10, 16)) {
            s = -12 ; //794 5671 1234 0000 -> 5671 1234 0000

        }

        o = number.toString().slice(s);
        return o;

    }

    if (level === -1) {
        if (number <= Math.pow(10, 4)) {
            return number.toString().padStart(4,'0');// 000 0671 -> 0671

        } else {
            return SpecialRoundedSmallNum(number);

        }
    }

    if (level === 0) {
        if (number <= Math.pow(10, 4)) {
            return ''
        } else {
        return SpecialRoundedSmallNum(number);

        }
    }

    //旧 level

    let unit = getRoundedNumberUnit(number, level)

    if (level === 1) {
        while (number >= 100 || number <= -100) { number /= 100; }
        o = (number - Math.floor(number)).toString().slice(2,4);
        return o + unit;
    }

    if (level === 2) {
        while (number >= 1000 || number <= -1000) { number /= 1000; }
        o = (number - Math.floor(number)).toString().slice(2,6);

        return o + unit;
    }
}

function getRoundedNumberUnit (number = 0, level = 0) {
    let unit;
    let m = 1 + level;

    if (level < 1 || level > 2) return '';

    if (number < Math.pow(10, m)) {  //level==1->100 level==2->1000
        unit = '';
    } else if (number < Math.pow(10, (m += 3))) {
        unit = 'K';
    } else if (number < Math.pow(10, (m += 3))) {
        unit = 'M';
    } else if (number < Math.pow(10, (m += 3))) {
        unit = 'G';
    } else if (number < Math.pow(10, (m += 3))) {
        unit = 'T';
    } else if (number < Math.pow(10, (m += 3))) {
        unit = 'P';
    } else if (number < Math.pow(10, (m += 3))) {
        unit = 'E';
    } else if (number < Math.pow(10, m + 3)) {
        unit = 'Z';
    } else {
        unit = ''
    }
    return unit;
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
    let r2;
    let b2;
    let g2;
    let s = 0;
    let gamma = 2.2; //伽马值


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

    // https://zhuanlan.zhihu.com/p/37800433/ 伽马的作用

    r2 = Math.pow((1 - s) * Math.pow(r0, gamma) + s * Math.pow(r1, gamma), 1 / gamma);
    g2 = Math.pow((1 - s) * Math.pow(g0, gamma) + s * Math.pow(g1, gamma), 1 / gamma);
    b2 = Math.pow((1 - s) * Math.pow(b0, gamma) + s * Math.pow(b1, gamma), 1 / gamma);

    let colorR = Math.round(r2).toString(16).padStart(2,'0')
    let colorG = Math.round(g2).toString(16).padStart(2,'0')
    let colorB = Math.round(b2).toString(16).padStart(2,'0')

    color = '#' + colorR + colorG + colorB

    if (SR < 0.1){
        color = '#AAAAAA';
    } else if (SR >= 9) {
        color = '#000';
    }

    return color;
}

export function getModColor(Mod = ''){
    let color;
    switch (Mod) {
        case "NF": color = '#00A0E9'; break;
        case "EZ": color = '#22AC38'; break;
        case "HD": color = '#F8B551'; break;
        case "HR": color = '#D32F2F'; break;
        case "SD": color = '#FF9800'; break;
        case "DT": color = '#0068B7'; break;
        case "RX": color = '#BFC31F'; break;
        case "HT": color = '#BDBDBD'; break;
        case "NC": color = '#601986'; break;
        case "FL": color = '#000'; break;
        case "AT": color = '#00B7EE'; break;
        case "CN": color = '#00B7EE'; break;
        case "SO": color = '#B28850'; break;
        case "AP": color = '#B3D465'; break;
        case "PF": color = '#FFF100'; break;
        case "XK": color = '#616161'; break;
        case "RD": color = '#009944'; break;
        case "TD": color = '#7ECEF4'; break;
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
        case "SP": color = '#E86100'; break; // S+
        case "S": color = '#FF9800'; break;
        case "A": color = '#22AC38'; break;
        case "B": color = '#00A0E9'; break;
        case "C": color = '#601986'; break;
        case "D": color = '#D32F2F'; break;
        case "F": color = '#616161'; break;
        default: color = '#fff'; break;
    }

    return color;
}

/**
 * @function 随机提供游戏模式对应的吉祥物名字
 * @return {String} 返回吉祥物名字
 * @param gamemode 游戏模式，'osu' 'taiko' 等
 */
export function getMascotName (gamemode = 'osu') {
    let r = Math.random(),
        //on = 1, //pippi
        tn = 6, //Mocha, Aiko, Alisa, Chirou, Tama, Taikonator
        //cn = 1, //Yuzu
        mn = 2, //Mani, Mari

        t = Math.floor(tn * r) + 1,
        m = Math.floor(mn * r) + 1;

    switch (gamemode) {
        case 'osu':
            return 'pippi';
        case 'taiko': {
            switch (t) {
                case 1 : return 'Mocha';
                case 2 : return 'Aiko';
                case 3 : return 'Alisa';
                case 4 : return 'Chirou';
                case 5 : return 'Tama';
                case 6 : return 'Taikonator';
            }
            break;
        }
        case 'catch': return 'Yuzu';
        case 'mania': {
            switch (m) {
                case 1 : return 'Mani';
                case 2 : return 'Mari';
            }
            break;
        }
    }
}
/**
 * @function 提供吉祥物名字对应的链接
 * @return {String} 返回吉祥物链接
 * @param mascotname 吉祥物名字
 */
export function getMascotPath (mascotname = 'pippi') {
    let r = Math.random();
    let i;
    let path;

    switch (mascotname){
        case 'pippi': i = 0; break;
        case 'Mocha': i = 1; break;
        case 'Aiko': i = 2; break;
        case 'Alisa': i = 3; break;
        case 'Chirou': i = 4; break;
        case 'Tama': i = 5; break;
        case 'Taikonator': i = 6; break;
        case 'Yuzu': i = 7; break;
        case 'Mani': i = 8; break;
        case 'Mari': i = 8; break;
    }

    path = Math.floor(mascot_pic_sum_arr[i] * r) + 1;

    return `Mascots/${mascotname}_${path}.png`;
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