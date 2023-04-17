import fs from 'fs';
import os from "os";
import crypto from 'crypto';
import TextToSVG from 'text-to-svg';
import axios from "axios";
import exports from 'convert-svg-to-png';
import https from "https";
import path from "path";
import moment from "moment";

const path_util = path;
export const CACHE_PATH = path_util.join(os.tmpdir(), "/n-bot");
export const EXPORT_FILE_V3 = process.env.EXPORT_FILE

const IMG_BUFFER_PATH = process.env.BUFFER_PATH || CACHE_PATH + "/buffer";
const FLAG_PATH = process.env.FLAG_PATH || CACHE_PATH + "/flag"
export const OSU_BUFFER_PATH = IMG_BUFFER_PATH + "/osu";
const MD5 = crypto.createHash("md5");

export function initPath() {
    fs.access(CACHE_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    fs.access(OSU_BUFFER_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    fs.access(FLAG_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    return path;
}

const mascot_pic_sum_arr = [24, 12, 3, 2, 4, 1, 2, 2, 2]; //吉祥物的对应的照片数量，和随机banner一样的
// pippi、Mocha, Aiko, Alisa, Chirou, Tama, Taikonator, Yuzu, Mani, Mari

const bannerTotal = 100;//banner 数量
const mascotBGTotal = 13;//吉祥物 BG 数量

const svgToPng = async (svg) => await exports.convert(svg);

const UTF8Encoder = new TextEncoder('utf8');

const textToSVGTorusSB = TextToSVG.loadSync("font/Torus-SemiBold.ttf");
const textToSVGPuHuiTi = TextToSVG.loadSync("font/AlibabaPuHuiTi-2-75-SemiBold.ttf"); //v1版本是 Alibaba-PuHuiTi-Medium.ttf
const textToSVGextra = TextToSVG.loadSync("font/extra.gamemode.ttf");
const textToSVGTorusRegular = TextToSVG.loadSync("font/Torus-Regular.ttf");


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

export async function readNetImage(path = '', defaultImagePath) {
    if (!path.startsWith("http")) {
        return defaultImagePath || "";
    }
    const bufferName = MD5.copy().update(path).digest('hex');
    const bufferPath = `${IMG_BUFFER_PATH}/${bufferName}`;
    try {
        fs.accessSync(bufferPath, fs.constants.F_OK);
        if (fs.statSync(bufferPath).size <= 4 * 1024) {
            throw Error("size err");
        }
        return bufferPath;
    } catch (e) {
        //no file
    }
    let data;
    try {
        data = (await axios.get(path, {responseType: 'arraybuffer'})).data;
    } catch (e) {
        console.error("download error", e);
        return defaultImagePath || getExportFileV3Path('error.png');
    }
    fs.writeFileSync(bufferPath, data, 'binary');
    return bufferPath;
}

export const exportPng = svgToPng;

export const torus = {};

torus.getTextPath = getTextPath_torus;
torus.get2SizeTextPath = get2SizeTextPath_torus;
torus.getTextMetrics = getTextMetrics_torus;
torus.getTextWidth = getTextWidth_torus;
torus.cutStringTail = cutStringTail_torus;

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

function getTextWidth_torus(
    text = '',
    size = 0,
) {
    return textToSVGTorusSB.getMetrics(text, {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "Torus",
        attributes: {
            fill: '#fff'
        }
    }).width
}

function cutStringTail_torus(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    if (torus.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...';
    let dot3_width = isDot3Needed ? torus.getTextWidth(dot3, size) : 0;
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; torus.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


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

function get2SizeTextPath_torus(largerText, smallerText, largeSize, smallSize, x, y, anchor, color) {
    let width_b = torus.getTextWidth(largerText, largeSize);
    let width_m = torus.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = torus.getTextPath(largerText, x, y, largeSize, anchor, color) +
            torus.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = torus.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            torus.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = torus.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            torus.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color);
    }

    return out;
}

export const torusRegular = {};

torusRegular.getTextPath = getTextPath_torusRegular;
torusRegular.get2SizeTextPath = get2SizeTextPath_torusRegular;
torusRegular.getTextMetrics = getTextMetrics_torusRegular;
torusRegular.getTextWidth = getTextWidth_torusRegular;
torusRegular.cutStringTail = cutStringTail_torusRegular;

function getTextPath_torusRegular(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGTorusRegular.getPath(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TorusRegular",
        attributes: {
            fill: fill
        }
    })
}

function getTextMetrics_torusRegular(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left top',
    fill = '#fff'
) {
    return textToSVGTorusRegular.getMetrics(text, {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TorusRegular",
        attributes: {
            fill: fill
        }
    })
}

function getTextWidth_torusRegular(
    text = '',
    size = 0,
) {
    return textToSVGTorusRegular.getMetrics(text, {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "TorusRegular",
        attributes: {
            fill: '#fff'
        }
    }).width
}

function cutStringTail_torusRegular(
    text = '',
    size = 36,
    maxWidth = 0,
) {
    if (torusRegular.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...'
    let dot3_width = torusRegular.getTextWidth(dot3, size);
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; torusRegular.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return out_text.slice(0, -1) + dot3; //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 torusRegular 字体 SVG 路径
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

function get2SizeTextPath_torusRegular(largerText, smallerText, largeSize, smallSize, x, y, anchor, color) {
    let width_b = torusRegular.getTextWidth(largerText, largeSize);
    let width_m = torusRegular.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = torusRegular.getTextPath(largerText, x, y, largeSize, anchor, color) +
            torusRegular.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = torusRegular.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            torusRegular.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = torusRegular.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            torusRegular.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color);
    }

    return out;
}


export const PuHuiTi = {};

PuHuiTi.getTextPath = getTextPath_PuHuiTi;
PuHuiTi.getTextMetrics = getTextMetrics_PuHuiTi;
PuHuiTi.getTextWidth = getTextWidth_PuHuiTi;
PuHuiTi.cutStringTail = cutStringTail_PuHuiTi;

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

function getTextWidth_PuHuiTi(
    text = '',
    size = 0,
) {
    return textToSVGTorusSB.getMetrics(text, {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "PuHuiTi",
        attributes: {
            fill: '#fff'
        }
    }).width
}

function cutStringTail_PuHuiTi(
    text = '',
    size = 36,
    maxWidth = 0,
) {
    if (PuHuiTi.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...'
    let dot3_width = PuHuiTi.getTextWidth(dot3, size);
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; PuHuiTi.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return out_text.slice(0, -1) + dot3; //因为超长才能跳出，所以裁去超长的那个字符
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
    let replace = `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${image}" style="opacity: ${opacity};" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>`
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
 * @function 数字处理（缩进数字，与主bot的DataUtil - getRoundedNumberStr效果一样
 * @return {String} 返回大数字的字符串
 * @param number 数字
 * @param level 等级，现在支持lv -1, 0, 1, 2, 3 注意配套使用
 * lv3是保留一位数,0-999-1.0K-99K-0.1M-99M
 * lv2是保留四位数
 * lv1是保留两位数,945671 -> 945.67K
 * lv0是只把前四位数放大，且补足到7位，无单位 7945671 -> 794 5671, 12450 -> 001 2450 0 -> 0000000
 * lv-1是只把前四位数放大，且不补足，无单位 7945671 -> 794 5671, 12450 -> 1 2450
 */
export function getRoundedNumberLargerStr(number = 0, level = 0) {
    let o;

    const SpecialRoundedLargeNum = (number) => {
        let p = 0;

        if (number <= Math.pow(10, 8)) {
            p = 4; //5671 1234 -> 5671

        } else if (number <= Math.pow(10, 12)) {
            p = 8; //794 5671 1234 -> 794

        } else if (number <= Math.pow(10, 16)) {
            p = 12; //794 5671 1234 0000 -> 794

        } else {
            return '';
        }
        let re = Math.floor(number / Math.pow(10, p));

        if (re === 0) {
            return ''
        } else {
            return re.toString()
        }
    }

    if (level === -1) {
        if (number <= Math.pow(10, 7)) {
            return number.toString().padStart(7, '0').slice(0, -4);// 4 5671 -> 004

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

    if (level === 1 || level === 2) {
        while (number >= 1000 || number <= -1000) {
            number /= 1000;
        }
    }

    //如果小数太小，可不要小数点
    if (number - Math.floor(number) >= 0.0001) {
        o = Math.floor(number).toString() + '.';
    } else {
        o = Math.floor(number).toString();
    }

    let s0 = '0.';
    let s1 = number.toString().slice(0, 1) + '.';
    let s2 = number.toString().slice(0, 2);

    if (level === 3) {
        if (number < Math.pow(10, 3)) {
            o = Math.floor(number).toString();
        } else if (number < Math.pow(10, 4)) {
            o = s1;
        } else if (number < Math.pow(10, 5)) {
            o = s2;
        } else if (number < Math.pow(10, 6)) {
            o = s0;
        } else if (number < Math.pow(10, 7)) {
            o = s1;
        } else if (number < Math.pow(10, 8)) {
            o = s2;
        } else if (number < Math.pow(10, 9)) {
            o = s0;
        } else if (number < Math.pow(10, 10)) {
            o = s1;
        } else if (number < Math.pow(10, 11)) {
            o = s2;
        } else if (number < Math.pow(10, 12)) {
            o = s0;
        } else if (number < Math.pow(10, 13)) {
            o = s1;
        } else if (number < Math.pow(10, 14)) {
            o = s2;
        } else if (number < Math.pow(10, 15)) {
            o = s0;
        } else if (number < Math.pow(10, 16)) {
            o = s1;
        } else o = Math.floor(number).toString();
    }
    return o;
}

/**
 * @function 数字处理（缩进数字，与主bot的DataUtil - getRoundedNumberStr效果一样
 * @return {String} 返回小数字的字符串
 * @param number 数字
 * @param level 等级，现在支持lv -1, 0, 1, 2, 3 注意配套使用
 */
export function getRoundedNumberSmallerStr(number = 0, level = 0) {
    let o;

    const SpecialRoundedSmallNum = (number) => {
        let s = 0;

        if (number < Math.pow(10, 8)) {
            s = -4; //5671 1234 -> 1234

        } else if (number < Math.pow(10, 12)) {
            s = -8; //794 5671 1234 -> 5671 1234

        } else if (number < Math.pow(10, 16)) {
            s = -12; //794 5671 1234 0000 -> 5671 1234 0000

        } else if (number < Math.pow(10, 20)) {
            s = -16;

        }

        o = number.toString().slice(s);
        return o;

    }

    if (level === -1) {
        if (number <= Math.pow(10, 4)) {
            return number.toString().padStart(4, '0');// 000 0671 -> 0671

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
        while (number >= 1000 || number <= -1000) {
            number /= 1000;
        }
        let numStr = number.toString();

        if (numStr.indexOf('.') === -1) {
            return unit;
        } else {
            o = numStr.slice(numStr.indexOf('.') + 1, numStr.indexOf('.') + 3);
            return o + unit;
        }
    }

    if (level === 2) {
        while (number >= 1000 || number <= -1000) {
            number /= 1000;
        }
        let numStr = number.toString();

        if (numStr.indexOf('.') === -1) {
            return unit;
        } else {
            o = numStr.slice(numStr.indexOf('.') + 1, numStr.indexOf('.') + 5);
            return o + unit;
        }
    }

    let s0 = Math.floor(number).toString().slice(0, 1);
    let s1 = Math.floor(number).toString().slice(1, 2);

    if (level === 3) {
        if (number < Math.pow(10, 3)) {
            o = unit;
        } else if (number < Math.pow(10, 4)) {
            o = s1 + unit;
        } else if (number < Math.pow(10, 5)) {
            o = unit;
        } else if (number < Math.pow(10, 6)) {
            o = s0 + unit;
        } else if (number < Math.pow(10, 7)) {
            o = s1 + unit;
        } else if (number < Math.pow(10, 8)) {
            o = unit;
        } else if (number < Math.pow(10, 9)) {
            o = s0 + unit;
        } else if (number < Math.pow(10, 10)) {
            o = s1 + unit;
        } else if (number < Math.pow(10, 11)) {
            o = unit;
        } else if (number < Math.pow(10, 12)) {
            o = s0 + unit;
        } else if (number < Math.pow(10, 13)) {
            o = s1 + unit;
        } else if (number < Math.pow(10, 14)) {
            o = unit;
        } else if (number < Math.pow(10, 15)) {
            o = s0 + unit;
        } else if (number < Math.pow(10, 16)) {
            o = s1 + unit;
        } else o = '';
    }
    return o;
}

//只给 level 1, 2, 3 提供单位
function getRoundedNumberUnit(number = 0, level = 0) {
    let unit;
    let m = 3;

    if (level === 1 || level === 2) {

        if (number < Math.pow(10, 3)) {  //level==1->100 level==2->1000
            unit = '';
        } else if (number < Math.pow(10, 6)) {
            unit = 'K';
        } else if (number < Math.pow(10, 9)) {
            unit = 'M';
        } else if (number < Math.pow(10, 12)) {
            unit = 'G';
        } else if (number < Math.pow(10, 15)) {
            unit = 'T';
        } else if (number < Math.pow(10, 18)) {
            unit = 'P';
        } else if (number < Math.pow(10, 21)) {
            unit = 'E';
        } else if (number < Math.pow(10, 24)) {
            unit = 'Z';
        } else {
            unit = ''
        }

    } else if (level === 3) {

        if (number < Math.pow(10, 3)) { //0.1K，但是数据还没到1K的位置，就给100了
            unit = '';
        } else if (number < Math.pow(10, 5)) { // 1000 -> 1.0K 99 000 -> 99K 从这开始，和上面相比就要减一了
            unit = 'K';
        } else if (number < Math.pow(10, 8)) {
            unit = 'M';
        } else if (number < Math.pow(10, 11)) {
            unit = 'G';
        } else if (number < Math.pow(10, 14)) {
            unit = 'T';
        } else if (number < Math.pow(10, 17)) {
            unit = 'P';
        } else if (number < Math.pow(10, 20)) {
            unit = 'E';
        } else if (number < Math.pow(10, 23)) {
            unit = 'Z';
        } else {
            unit = ''
        }

    } else {

        return '';
    }

    return unit;
}

//色彩管理。或许开个 color util 会更好？=====================================================================================

export function getStarRatingColor(SR = 0) {

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
        r0 = 66;
        g0 = 144;
        b0 = 251;
        r1 = 79;
        g1 = 192;
        b1 = 255;
        s = (SR - 0.1) / (1.25 - 0.1)

    } else if (SR < 2) {
        r0 = 79;
        g0 = 192;
        b0 = 255;
        r1 = 79;
        g1 = 255;
        b1 = 213;
        s = (SR - 1.25) / (2 - 1.25)

    } else if (SR < 2.5) {
        r0 = 79;
        g0 = 255;
        b0 = 213;
        r1 = 124;
        g1 = 255;
        b1 = 79;
        s = (SR - 2) / (2.5 - 2)

    } else if (SR < 3.3) {
        r0 = 124;
        g0 = 255;
        b0 = 79;
        r1 = 246;
        g1 = 240;
        b1 = 92;
        s = (SR - 2.5) / (3.3 - 2.5)

    } else if (SR < 4.2) {
        r0 = 246;
        g0 = 240;
        b0 = 92;
        r1 = 255;
        g1 = 104;
        b1 = 104;
        s = (SR - 3.3) / (4.2 - 3.3)

    } else if (SR < 4.9) {
        r0 = 255;
        g0 = 104;
        b0 = 104;
        r1 = 255;
        g1 = 78;
        b1 = 111;
        s = (SR - 4.2) / (4.9 - 4.2)

    } else if (SR < 5.8) {
        r0 = 255;
        g0 = 78;
        b0 = 111;
        r1 = 198;
        g1 = 69;
        b1 = 184;
        s = (SR - 4.9) / (5.8 - 4.9)

    } else if (SR < 6.7) {
        r0 = 198;
        g0 = 69;
        b0 = 184;
        r1 = 101;
        g1 = 99;
        b1 = 222;
        s = (SR - 5.8) / (6.7 - 5.8)

    } else if (SR < 7.7) {
        r0 = 101;
        g0 = 99;
        b0 = 222;
        r1 = 24;
        g1 = 21;
        b1 = 142;
        s = (SR - 6.7) / (7.7 - 6.7)

    } else if (SR < 9) {
        r0 = 24;
        g0 = 21;
        b0 = 142;
        r1 = 0;
        g1 = 0;
        b1 = 0;
        s = (SR - 7.7) / (9 - 7.7)
    }

    // https://zhuanlan.zhihu.com/p/37800433/ 伽马的作用

    r2 = Math.pow((1 - s) * Math.pow(r0, gamma) + s * Math.pow(r1, gamma), 1 / gamma);
    g2 = Math.pow((1 - s) * Math.pow(g0, gamma) + s * Math.pow(g1, gamma), 1 / gamma);
    b2 = Math.pow((1 - s) * Math.pow(b0, gamma) + s * Math.pow(b1, gamma), 1 / gamma);

    let colorR = Math.round(r2).toString(16).padStart(2, '0')
    let colorG = Math.round(g2).toString(16).padStart(2, '0')
    let colorB = Math.round(b2).toString(16).padStart(2, '0')

    color = '#' + colorR + colorG + colorB

    if (SR < 0.1) {
        color = '#AAAAAA';
    } else if (SR >= 9) {
        color = '#000';
    }

    return color;
}

export function getModColor(Mod = '') {
    let color;
    switch (Mod) {
        case "NF":
            color = '#00A0E9';
            break;
        case "EZ":
            color = '#22AC38';
            break;
        case "HD":
            color = '#F8B551';
            break;
        case "HR":
            color = '#D32F2F';
            break;
        case "SD":
            color = '#FF9800';
            break;
        case "DT":
            color = '#0068B7';
            break;
        case "RX":
            color = '#BFC31F';
            break;
        case "HT":
            color = '#BDBDBD';
            break;
        case "NC":
            color = '#601986';
            break;
        case "FL":
            color = '#000';
            break;
        case "AT":
            color = '#00B7EE';
            break;
        case "CN":
            color = '#00B7EE';
            break;
        case "SO":
            color = '#B28850';
            break;
        case "AP":
            color = '#B3D465';
            break;
        case "PF":
            color = '#FFF100';
            break;
        case "XK":
            color = '#616161';
            break;
        case "RD":
            color = '#009944';
            break;
        case "TD":
            color = '#7ECEF4';
            break;

        case "NM":
            color = '#22AC38';
            break;
        case "FM":
            color = '#00A0E9';
            break;
        case "EX":
            color = '#FF9800';
            break;
        case "TB":
            color = '#000';
            break;

        case "RC":
            color = '#22AC38';
            break;
        case "LN":
            color = '#00A0E9';
            break;
        case "HB":
            color = '#FF9800';
            break;
        case "SV":
            color = '#920783';
            break;

        case "SP":
            color = '#EA68A2';
            break;

        default:
            color = 'none';
            break;
    }

    return color;
}

export function getRankColor(Rank = 'F') {
    let color;
    switch (Rank) {
        case "XH":
            color = '#FAFAFA';
            break;
        case "X":
            color = '#FFFF00';
            break;
        case "SH":
            color = '#BDBDBD';
            break;
        case "SP":
            color = '#E86100';
            break; // S+
        case "S":
            color = '#FF9800';
            break;
        case "A":
            color = '#22AC38';
            break;
        case "B":
            color = '#00A0E9';
            break;
        case "C":
            color = '#601986';
            break;
        case "D":
            color = '#D32F2F';
            break;
        case "F":
            color = '#616161';
            break;
        default:
            color = '#fff';
            break;
    }

    return color;
}

/**
 * @function 获取数据在某组数组中的对应位置的色彩。色彩是PS中蓝色往左到深蓝色。
 * @return {String} 返回色彩
 * @param base 数据
 * @param staffArray 从小到大，用于标定的正数数组。必须有13个元素。蓝-1-2-绿-3-黄-橙-4-红-5-粉-6-紫-深蓝
 * @param brightness 亮度。2-蜡笔色、1-浅色、0-纯色、-1暗色、-2深黑。
 */
export function getColorInSpectrum(base = 0, staffArray = [0], brightness = 0) {
    if (staffArray.length !== 13) throw new Error('staffArray length should be exactly 13')

    let colorArr = [];

    let colorB2Arr = [
        '#7FCEF4', '#85CCC9', '#8AC998', '#ACD598',
        '#CCE199', '#FFF899', '#FACC89', '#F6B380',
        '#F29B76', '#F29C9F', '#F19FC2', '#C491BF',
        '#AA89BE', '#8F82BC'];
    let colorB1Arr = [
        '#00B7EE', '#12B4B1', '#31B16C', '#7FC269',
        '#B3D465', '#FFF45C', '#F7B551', '#F19149',
        '#EC6841', '#EB6877', '#EA68A2', '#AD5DA1',
        '#8957A1', '#5F52A0'];
    let colorB0Arr = [
        '#00A1E9', '#009E97', '#009944', '#23AC39',
        '#8FC41F', '#FFF100', '#F39800', '#EB6101',
        '#E60013', '#E50050', '#E4007F', '#930883',
        '#601986', '#1D2088'];
    let colorB_1Arr = [
        '#0075A9', '#00736D', '#007130', '#0D7D25',
        '#648C0C', '#B7AB00', '#AD6B00', '#A84200',
        '#A40000', '#A40036', '#A4005B', '#6A005F',
        '#450062', '#110B64'];
    let colorB_2Arr = [
        '#005982', '#005853', '#005620', '#005F16',
        '#496A00', '#8A8100', '#834F00', '#7F2E00',
        '#7D0000', '#7D0023', '#7E0043', '#500047',
        '#32004A', '#05004C'];

    switch (brightness) {
        case 2:
            colorArr = colorB2Arr;
            break;
        case 1:
            colorArr = colorB1Arr;
            break;
        case 0:
            colorArr = colorB0Arr;
            break;
        case -1:
            colorArr = colorB_1Arr;
            break;
        case -2:
            colorArr = colorB_2Arr;
            break;
    }

    if (base >= staffArray[12]) {
        return colorArr[13];
    }

    for (let i = 0; i < 13; i++) {
        if (base < staffArray[i]) {
            return colorArr[i];
        }
    }
}

/**
 * @function 预处理星数成想要的部分。
 * @return 返回 8, 0.34, 8., 34。前两个是数据，后两个是字符串
 * @param starRating 星数
 * @param whichData 要哪个数据？可输入0, 1, 2, 3, 4，分别是整数、小数、整数带小数点部分、纯小数部分（两位以下，纯小数部分（一位以下
 */
export function getStarRatingObject(starRating = 0, whichData = 0) {

    //去除小数，保留两位
    let sr = starRating || 0;

    //避免浮点缺陷
    let sr_b = Math.floor(sr);
    let sr_m = Math.round((sr - sr_b) * 100) / 100;

    let text_sr_b;
    if (sr_m === 0) {
        text_sr_b = sr_b.toString();
    } else {
        text_sr_b = sr_b + '.';
    }

    let text_sr_m = sr_m.toString().slice(2, 4);
    if (text_sr_m.slice(1) === '0') {
        text_sr_m = text_sr_m.slice(0, 1);
    } else if (text_sr_m === '00') {
        text_sr_m = '';
    }

    let text_sr_mm = sr_m.toString().slice(2, 3);
    if (text_sr_m.slice(1) === '0') {
        text_sr_m = text_sr_m.slice(0, 1);
    }

    if (sr_b >= 20) {
        text_sr_b = '20';
        text_sr_m = '+';
        text_sr_mm = '+'
    }

    switch (whichData) {
        case 0:
            return sr_b;
        case 1:
            return sr_m;
        case 2:
            return text_sr_b;
        case 3:
            return text_sr_m;
        case 4:
            return text_sr_mm;
    }

}

/**
 * @function 随机提供游戏模式对应的吉祥物名字
 * @return {String} 返回吉祥物名字
 * @param gamemode 游戏模式，'osu' 'taiko' 等
 */
export function getMascotName(gamemode = 'osu') {
    gamemode = gamemode.toLowerCase();

    // pippi、Mocha, Aiko, Alisa, Chirou, Tama, Taikonator, Yuzu, Mani, Mari
    let arr = mascot_pic_sum_arr;

    let t_sum = 0;
    let t_arr = [];

    let m_sum = 0;
    let m_arr = [];

    for (let i = 1; i < 7; i++) {
        t_sum += arr[i];
        t_arr.push(t_sum);
    }

    for (let i = 8; i < 10; i++) {
        m_sum += arr[i];
        m_arr.push(m_sum);
    }

    let tr = getRandom(t_sum);
    let mr = getRandom(m_sum);

    let t = 0;
    let m = 0;

    for (let i = 0; i < t_arr.length; i++) {
        if (t_arr[i] >= tr) {
            t = i;
            break;
        }
    }

    for (let i = 0; i < m_arr.length; i++) {
        if (m_arr[i] >= mr) {
            m = i;
            break;
        }
    }

    switch (gamemode) {
        case 'osu':
            return 'pippi';
        case 'taiko': {
            switch (t) {
                case 0 :
                    return 'Mocha';
                case 1 :
                    return 'Aiko';
                case 2 :
                    return 'Alisa';
                case 3 :
                    return 'Chirou';
                case 4 :
                    return 'Tama';
                case 5 :
                    return 'Taikonator';
            }
            break;
        }
        case 'fruits':
            return 'Yuzu';
        case 'mania': {
            switch (m) {
                case 0 :
                    return 'Mani';
                case 1 :
                    return 'Mari';
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
export function getMascotPath(mascotname = 'pippi') {
    let i;
    let path;

    switch (mascotname) {
        case 'pippi':
            i = 0;
            break;
        case 'Mocha':
            i = 1;
            break;
        case 'Aiko':
            i = 2;
            break;
        case 'Alisa':
            i = 3;
            break;
        case 'Chirou':
            i = 4;
            break;
        case 'Tama':
            i = 5;
            break;
        case 'Taikonator':
            i = 6;
            break;
        case 'Yuzu':
            i = 7;
            break;
        case 'Mani':
            i = 8;
            break;
        case 'Mari':
            i = 8;
            break;
    }
    path = getRandom(mascot_pic_sum_arr[i]);

    return getExportFileV3Path(`Mascots/${mascotname}_${path}.png`);
}

/**
 * @function 获取随机的头图路径
 * @return {String} 返回头图路径
 */
export function getRandomBannerPath() {
    let i = getRandom(bannerTotal)
    return getExportFileV3Path(`Banner/b${i}.png`);
}

/**
 * @function 获取随机的吉祥物背景路径
 * @return {String} 返回吉祥物背景路径
 */
export function getRandomMascotBGPath() {
    let i = getRandom(mascotBGTotal)
    return getExportFileV3Path(`Background/${i}.png`);
}

/**
 * @function 修整数组，太短则在前面补0，太长则卡掉前面的
 * @return {Number[]} 返回裁剪好的数组
 * @param arr 需要裁剪的数组
 * @param target_length 需要的数组长度
 */
export function modifyArrayToFixedLength(arr = [0], target_length = 0) {
    if (arr.length < target_length) {
        for (let i = (target_length - arr.length); i > 0; i--) {
            arr.unshift(0);
        }
        return arr;

    } else {
        return arr.slice(arr.length - target_length);
    }
}

/**
 * @function 取最大值数组，太短则在前面补0，太长则取最大值，继承于DataUtil: get group 26方法
 * @return {Number[]} 返回处理好的数组
 * @param arr 需要处理的数组
 * @param target_length 需要的数组长度
 */
export function maximumArrayToFixedLength(arr = [0], target_length = 0) {
    if (arr.length < target_length) {
        for (let i = arr.length; i > 0; i--) {
            arr.unshift(0);
        }
        return arr;

    } else {
        let steps = (arr.length - 1) / (target_length - 1);
        let out = [arr[0]];
        let stepSum = steps;
        let maxItem = 0;
        arr.forEach((item, i) => {
            if (i < stepSum) {
                maxItem = Math.max(maxItem, item);
            } else {
                out.push(Math.max(maxItem, arr[i]));
                maxItem = 0;
                stepSum += steps;
            }
        })

        //有时候最后一位取不到，只能靠这个方法来解决了
        if (out.length < target_length) out.push(arr[arr.length - 1])

        return out;
    }
}

/**
 * @function 获取游戏模式
 * @return {String} 游戏模式
 * @param gamemode 默认游戏模式，osu taiko catch mania
 * @param level 等级，0为不变，2为全写 osu!standard，-1为获取他们的unicode字符 \uE801，1为简写 o t m c
 */
export function getGameMode(gamemode = 'osu', level = 0) {
    gamemode = gamemode.toLowerCase();
    switch (level) {
        case 1:
            switch (gamemode) {
                case 'osu':
                    return 'o';
                case 'taiko':
                    return 't';
                case 'fruits':
                    return 'c';
                case 'catch':
                    return 'c'; //我怀疑现在的接水果给的不是fruits
                case 'mania':
                    return 'm';
            } break;
        case 2:
            switch (gamemode) {
                case 'osu':
                    return 'osu!standard';
                case 'taiko':
                    return 'osu!taiko';
                case 'fruits':
                    return 'osu!catch';
                case 'catch':
                    return 'osu!catch'; //我怀疑现在的接水果给的不是fruits
                case 'mania':
                    return 'osu!mania';
            } break;
        case -1:
            switch (gamemode) {
                case 'osu':
                    return '\uE800';
                case 'taiko':
                    return '\uE803';
                case 'fruits':
                    return '\uE801';
                case 'catch':
                    return '\uE801'; //我怀疑现在的接水果给的不是fruits
                case 'mania':
                    return '\uE802';
            } break;
    }
}

/**
 * @function 拆分svg头尾，只保留身体，方便插入
 */
export function getSVGBody (V3Path = '') {
    let reg1 = '<?xml version="1.0" encoding="UTF-8"?>';
    let reg2 = /<svg?[A-Za-z0-9\"\=:./ ]*\>?/;
    let reg3 = '</svg>'

    var data = fs.readFileSync(V3Path, "utf-8")
        .replace(reg1, '')
        .replace(reg2, '')
        .replace(reg3, '');

    return data;
}

/**
 * @function 获取谱面状态的路径
 */
export function getMapStatusV3Path(status = 'notsubmitted') {
    switch (status) {
        case "ranked":
        case "approved":
            return getExportFileV3Path('object-beatmap-ranked.png');
        case "qualified":
            return getExportFileV3Path('object-beatmap-qualified.png');
        case "loved":
            return getExportFileV3Path('object-beatmap-loved.png');
        default:
            return getExportFileV3Path('object-beatmap-unranked.png');
    }
}

//获取现在的时间 (UTC+8)
export function getNowTimeStamp() {
    return moment().format("YYYY-MM-DD kk:mm:ss.SSS Z");
    /*
const t = new Date;
    t.getFullYear() + '-' +
    t.getMonth() + '-' +
    t.getDay() + ' ' +
    t.getHours() + ':' +
    t.getMinutes() + ':' +
    t.getSeconds() + '.' +
    t.getMilliseconds();

     */
}

/**
 * @function 获取分割好的比赛名字
 * @return {String[]}0 - 比赛名称 1 - 左边队伍 2 - 右边队伍
 * @param text 输入比赛名字
 */
export function getMatchNameSplitted(text = '') {
    let out = []
    let name = '';
    let team1 = '';
    let team2 = '';
    let isTeam1 = true;
    let position = 0;

    for (let i = 0; i < text.length; i++) {
        let char = text.slice(i, i + 1);

        if (char === '：' || char === ':') {
            name = text.slice(0, i);
        }

        if (char === '(' || char === '（') {
            position = i
        }

        if (char === ')' || char === '）') {
            if (isTeam1) {
                team1 = text.slice(position + 1, i)
                isTeam1 = false;
            } else {
                team2 = text.slice(position + 1, i)
            }
        }
    }
    out.push(name, team1, team2)
    return out;
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

export class SaveFiles {
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
    let path = `${FLAG_PATH}/${code}`;
    try {
        fs.accessSync(path, fs.constants.W_OK);
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

export async function getFlagPath(code = "cn", x, y) {
    let svg = await getFlagSvg(code);
    let len = svg.length;
    return `<g transform="translate(${x} ${y}) scale(1.45)">` + svg.substring(60, len - 6) + '</g>';
}

const Mod = {
    "NM": 0,
    "NF": 1,
    "EZ": 2,
    "NV": 4,
    "HD": 8,
    "HR": 16,
    "SD": 32,
    "DT": 64,
    "RX": 128,
    "HT": 256,
    "NC": 512 + 64,
    "FL": 1024,
    "AT": 2048,
    "SO": 4096,
    "AP": 8192,
    "PF": 16384,
}

export function ar2ms(ar, mode = 'o') {
    if (mode === 'o' || mode === 'c') {
        if (0 < ar - 5) {
            if (ar > 11) return '300ms';
            return Math.floor(1200 - (150 * (ar - 5))) + 'ms';
        } else {
            return Math.floor(1800 - (120 * ar)) + 'ms';
        }
    } else {
        return '-'
    }
}

export function od2ms(od, mode = 'o') {
    let ms;
    switch (mode) {
        case 'o': {
            if (od > 11) return '14ms';
            ms = (80 - (6 * od)).toFixed(2);
            break;
        }
        case 't': {
            if (od > 10) return '17ms';
            ms = (50 - (3 * od)).toFixed(2);
            break;
        }
        case 'c': {
            return '-';
        }
        case 'm': {
            if (od > 11) return '31ms';
            ms = (64 - (3 * od)).toFixed(2);
            break;
        }
    }
    if (ms.substr(-2) === '00') return ms.slice(0, -3) + 'ms';
    if (ms.substr(-1) === '0') return ms.slice(0, -1) + 'ms';
    return ms + 'ms';
}

export function cs2px(cs, mode = 'o') {
    if (mode === 'o') {
        let osupixel = (54.4 - 4.48 * cs).toFixed(2);
        if (osupixel.substr(-2) === '00') return osupixel.slice(0, -3) + 'px';
        if (osupixel.substr(-1) === '0') return osupixel.slice(0, -1) + 'px';
        return osupixel + 'px';
    } else if (mode === 'm') {
        return cs.toFixed(0) + 'Keys'
    } else {
        return '-';
    }
}

export function hasMod(modInt = 0, mod = '') {
    return Mod[mod] ? (modInt & Mod[mod]) !== 0 : false;
}

export function hasAnyMod(modInt = 0, mod = ['']) {
    if (!mod) return false;
    for (const v of mod) {
        if ((Mod[v] & modInt) !== 0) {
            return true;
        }
    }
    return false;
}

export function hasAllMod(modInt = 0, mod = ['']) {
    if (!mod) return false;
    const all = getModInt(mod);
    return (all & modInt) === all;
}

export function getModInt(mod = ['']) {
    return mod.map(v => {
        return Mod[v] ? Mod[v] : 0
    }).reduce((sum, v) => sum | v);
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

//获取一个1到目标数的随机值
export function getRandom(range = 1) {
    return Math.floor(parseInt(moment().format("SSS")) / 1000 * (range - 1)) + 1;
}
