import TextToSVG from "text-to-svg";
import {isEmptyArray} from "./util.js";

const textToSVGTorusSB = TextToSVG.loadSync("font/Torus-SemiBold.ttf");
const textToSVGPuHuiTi = TextToSVG.loadSync("font/AlibabaPuHuiTi3.0-75SemiBold-CJKTGv4.3.ttf");
const textToSVGextra = TextToSVG.loadSync("font/extra.gamemode.ttf");
const textToSVGTorusRegular = TextToSVG.loadSync("font/Torus-Regular.ttf");
const textToSVGTorusBold = TextToSVG.loadSync("font/Torus-Bold.ttf");
const textToSVGpoppinsBold = TextToSVG.loadSync("font/Poppins-Bold.ttf");
const textToSVGlineSeedSansBold = TextToSVG.loadSync("font/LINESeedSans_Bd.ttf");
const textToSVGTahomaRegular = TextToSVG.loadSync("font/ft71.ttf");
const textToSVGTahomaBold = TextToSVG.loadSync("font/tahomabd.ttf");
const textToSVGBerlinBold = TextToSVG.loadSync("font/BerlinsansExpert-Bold.ttf");

/*
const textToSVGTorusSB = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGPuHuiTi = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGextra = TextToSVG.loadSync("font/extra.gamemode.ttf"); // 这个不一样
const textToSVGTorusRegular = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGTorusBold = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGpoppinsBold = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGlineSeedSansBold = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGTahomaRegular = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGTahomaBold = TextToSVG.loadSync("font/EndfieldByButan.ttf");
const textToSVGBerlinBold = TextToSVG.loadSync("font/EndfieldByButan.ttf");

 */

function preprocessingText(text = '') {
    return text + ""

    // return endfieldMapper(text + "")
}


// 以下是转换为 Endfield 文字的映射
function endfieldMapper(text = '') {

    // https://www.bilibili.com/video/BV1PtdyBMEED 01:52 处
    const mapper = [
        'g', 'k', 'a', 'm', 'z', 't', 'l', 'b', 'd', 'q', 'i', 'y', 'f', 'u',
        'c', 'x', 'b', 'h', 's', 'j', 'o', 'p', 'r', 'n', 'w', 'e', 'y', 'g',
        't', 'j', 'm', 'e', 'v', 'c', 'h', 'd', 'x', 's', 'a', 'n', 'q', 'o',
        'l', 'k', 'r', 'v', 'w', 'i', 'y', 'p', 'j', 'z', 'q', 'u', 'h', 'e'
    ]

    const defaultMapper = new Map([
        [0x23, 0x2E],
        [0x24, 0x2E],
        [0x25, 0x2E],
        [0x26, 0x2E],
        [0x40, 0x2E],
        [0x5C, 0x2F],
        [0x5E, 0x2F],
        [0x3B, 0x3A],
        [0x5F, 0x2D],
        [0x60, 0x5B]
    ]);

    let result = []

    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i)

        if (defaultMapper.has(code)) {
            result.push(String.fromCharCode(defaultMapper.get(code)))
        } else if (!isPrivateUse(code) && code >= 0x7B) {
            result.push(mapper[code % 56] ?? '.')
        } else {
            // 情况 3: 其余情况直出原字符
            result.push(text[i])
        }
    }

    return result.join('')
}

function isPrivateUse(code) {
    return (code >= 0xE000 && code <= 0xF8FF) ||
        (code >= 0xF0000 && code <= 0xFFFFF) ||
        (code >= 0x100000 && code <= 0x10FFFF);
}

/** 获取多个字体组合成的字形
 * 数组类的组成是：
 * font: torus,
 * text: '',
 * size: 24,
 * color: '#fff',
 * @param array
 * @param x
 * @param y
 * @param anchor
 * @param shadow
 * @return {string}
 */
export function getMultipleTextPath(array = [{
    font: "torus" || torus,
    text: '',
    size: 24,
    color: '#fff',
}], x = 0, y = 0, anchor = "center baseline", shadow = false) {
    if (isEmptyArray(array)) return '';

    let width_array = []; // 累计宽度
    let total_width = 0;

    // 获取宽度

    for (const i in array) {
        const v = array[i];

        const font = v.font;
        const text = v.text;
        const size = v?.size || 24;

        const width = getTextWidth(font, text, size);

        total_width += width;
        width_array.push(total_width);
    }

    // 全部往后移一位，前面加 0
    total_width = width_array.pop();
    width_array.unshift(0);

    let out = '';

    for (const i in array) {
        const v = array[i];
        const w = width_array[i];

        const font = v.font;
        const text = v.text;
        const size = v?.size ?? 24;
        const color = v?.color || '#fff';

        switch (anchor) {
            case "center baseline": {
                if (shadow !== false) {
                    out += getTextPath(font, text, x - (total_width / 2) + w + 2, y + 2, size, "left baseline", '#1c1719');
                }
                out += getTextPath(font, text, x - (total_width / 2) + w, y, size, "left baseline", color);
                break;
            }
            case "left baseline": {
                if (shadow !== false) {
                    out += getTextPath(font, text, x + w + 2, y + 2, size, "left baseline", '#1c1719');
                }
                out += getTextPath(font, text, x + w, y, size, "left baseline", color);
                break;
            }
            case "right baseline": {
                if (shadow !== false) {
                    out += getTextPath(font, text, x - total_width + w + 2, y + 2, size, "left baseline", '#1c1719');
                }
                out += getTextPath(font, text, x - total_width + w, y, size, "left baseline", color);
                break;
            }
        }
    }

    return out;
}


export const BerlinBold = {};

BerlinBold.name = "BerlinBold";
BerlinBold.getTextPath = getTextPath_BerlinBold;
BerlinBold.get2SizeTextPath = get2SizeTextPath_BerlinBold;
BerlinBold.getTextMetrics = getTextMetrics_BerlinBold;
BerlinBold.getTextWidth = getTextWidth_BerlinBold;
BerlinBold.cutStringTail = cutStringTail_BerlinBold;

/**
 * @return {string}
 */
function getTextPath_BerlinBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    shadow = false,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return ((shadow === false) ? '' :
            textToSVGBerlinBold.getPath(preprocessingText(text), {
                x: x + 2,
                y: y + 2,
                fontSize: size,
                anchor: anchor,
                fontFamily: "BerlinBold",
                kerning: true,
                attributes: {
                    fill: '#1c1719'
                }
            })
    ) + textToSVGBerlinBold.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "BerlinBold",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_BerlinBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGBerlinBold.getMetrics(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "BerlinBold",
        attributes: {
            fill: fill
        }
    })
}

/**
 * @return {number}
 */
function getTextWidth_BerlinBold(
    text = '',
    size = 0,
) {
    return textToSVGBerlinBold.getMetrics(preprocessingText(text), {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "BerlinBold",
        attributes: {
            fill: '#fff'
        }
    }).width
}

/**
 * @return {string}
 */
function cutStringTail_BerlinBold(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

    if (BerlinBold.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...';
    let dot3_width = isDot3Needed ? BerlinBold.getTextWidth(dot3, size) : 0;
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; BerlinBold.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 BerlinBold 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 */

function get2SizeTextPath_BerlinBold(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'center baseline', color = '#fff') {
    let width_b = BerlinBold.getTextWidth(largerText, largeSize);
    let width_m = BerlinBold.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = BerlinBold.getTextPath(largerText, x, y, largeSize, anchor, color) +
            BerlinBold.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = BerlinBold.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            BerlinBold.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = BerlinBold.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            BerlinBold.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color);
    }

    return out;
}

export const TahomaRegular = {};

TahomaRegular.name = "TahomaRegular"
TahomaRegular.getTextPath = getTextPath_TahomaRegular;
TahomaRegular.get2SizeTextPath = get2SizeTextPath_TahomaRegular;
TahomaRegular.getTextMetrics = getTextMetrics_TahomaRegular;
TahomaRegular.getTextWidth = getTextWidth_TahomaRegular;
TahomaRegular.cutStringTail = cutStringTail_TahomaRegular;

/**
 * @return {string}
 */
function getTextPath_TahomaRegular(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGTahomaRegular.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TahomaRegular",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_TahomaRegular(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGTahomaRegular.getMetrics(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TahomaRegular",
        attributes: {
            fill: fill
        }
    })
}

/**
 * @return {number}
 */
function getTextWidth_TahomaRegular(
    text = '',
    size = 0,
) {
    return textToSVGTahomaRegular.getMetrics(preprocessingText(text), {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "TahomaRegular",
        attributes: {
            fill: '#fff'
        }
    }).width
}

/**
 * @return {string}
 */
function cutStringTail_TahomaRegular(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

    if (TahomaRegular.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...';
    let dot3_width = isDot3Needed ? TahomaRegular.getTextWidth(dot3, size) : 0;
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; TahomaRegular.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 TahomaRegular 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 */

function get2SizeTextPath_TahomaRegular(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'center baseline', color = '#fff') {
    let width_b = TahomaRegular.getTextWidth(largerText, largeSize);
    let width_m = TahomaRegular.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = TahomaRegular.getTextPath(largerText, x, y, largeSize, anchor, color) +
            TahomaRegular.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = TahomaRegular.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            TahomaRegular.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = TahomaRegular.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            TahomaRegular.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color);
    }

    return out;
}

export const TahomaBold = {};

TahomaBold.name = "TahomaBold"
TahomaBold.getTextPath = getTextPath_TahomaBold;
TahomaBold.get2SizeTextPath = get2SizeTextPath_TahomaBold;
TahomaBold.getTextMetrics = getTextMetrics_TahomaBold;
TahomaBold.getTextWidth = getTextWidth_TahomaBold;
TahomaBold.cutStringTail = cutStringTail_TahomaBold;

/**
 * @return {string}
 */
function getTextPath_TahomaBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGTahomaBold.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TahomaBold",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_TahomaBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGTahomaBold.getMetrics(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TahomaBold",
        attributes: {
            fill: fill
        }
    })
}

/**
 * @return {number}
 */
function getTextWidth_TahomaBold(
    text = '',
    size = 0,
) {
    return textToSVGTahomaBold.getMetrics(preprocessingText(text), {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "TahomaBold",
        attributes: {
            fill: '#fff'
        }
    }).width
}

/**
 * @return {string}
 */
function cutStringTail_TahomaBold(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

    if (TahomaBold.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...';
    let dot3_width = isDot3Needed ? TahomaBold.getTextWidth(dot3, size) : 0;
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; TahomaBold.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 TahomaBold 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 */

function get2SizeTextPath_TahomaBold(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'center baseline', color = '#fff') {
    let width_b = TahomaBold.getTextWidth(largerText, largeSize);
    let width_m = TahomaBold.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = TahomaBold.getTextPath(largerText, x, y, largeSize, anchor, color) +
            TahomaBold.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = TahomaBold.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            TahomaBold.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = TahomaBold.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            TahomaBold.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color);
    }

    return out;
}

export const poppinsBold = {};

poppinsBold.name = "poppinsBold"
poppinsBold.getTextPath = getTextPath_poppinsBold;
poppinsBold.get2SizeTextPath = get2SizeTextPath_poppinsBold;
poppinsBold.getTextMetrics = getTextMetrics_poppinsBold;
poppinsBold.getTextWidth = getTextWidth_poppinsBold;
poppinsBold.cutStringTail = cutStringTail_poppinsBold;

/**
 * @return {string}
 */
function getTextPath_poppinsBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGpoppinsBold.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "poppinsBold",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_poppinsBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGpoppinsBold.getMetrics(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "poppinsBold",
        attributes: {
            fill: fill
        }
    })
}

/**
 * @return {number}
 */
function getTextWidth_poppinsBold(
    text = '',
    size = 0,
) {
    return textToSVGpoppinsBold.getMetrics(preprocessingText(text), {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "poppinsBold",
        attributes: {
            fill: '#fff'
        }
    }).width
}

/**
 * @return {string}
 */
function cutStringTail_poppinsBold(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

    if (poppinsBold.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...';
    let dot3_width = isDot3Needed ? poppinsBold.getTextWidth(dot3, size) : 0;
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; poppinsBold.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 poppinsBold 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 */

function get2SizeTextPath_poppinsBold(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'center baseline', color = '#fff') {
    let width_b = poppinsBold.getTextWidth(largerText, largeSize);
    let width_m = poppinsBold.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = poppinsBold.getTextPath(largerText, x, y, largeSize, anchor, color) +
            poppinsBold.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = poppinsBold.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            poppinsBold.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = poppinsBold.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            poppinsBold.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color);
    }

    return out;
}

export const lineSeedSans = {};

lineSeedSans.name = "lineSeedSans"
lineSeedSans.getTextPath = getTextPath_lineSeedSans;
lineSeedSans.get2SizeTextPath = get2SizeTextPath_lineSeedSans;
lineSeedSans.getTextMetrics = getTextMetrics_lineSeedSans;
lineSeedSans.getTextWidth = getTextWidth_lineSeedSans;
lineSeedSans.cutStringTail = cutStringTail_lineSeedSans;

/**
 * @return {string}
 */
function getTextPath_lineSeedSans(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGlineSeedSansBold.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "lineSeedSans",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_lineSeedSans(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGlineSeedSansBold.getMetrics(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "lineSeedSans",
        attributes: {
            fill: fill
        }
    })
}

/**
 * @return {number}
 */
function getTextWidth_lineSeedSans(
    text = '',
    size = 0,
) {
    return textToSVGlineSeedSansBold.getMetrics(preprocessingText(text), {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "lineSeedSans",
        attributes: {
            fill: '#fff'
        }
    }).width
}

/**
 * @return {string}
 */
function cutStringTail_lineSeedSans(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

    if (lineSeedSans.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...';
    let dot3_width = isDot3Needed ? lineSeedSans.getTextWidth(dot3, size) : 0;
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; lineSeedSans.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 lineSeedSans 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 */

function get2SizeTextPath_lineSeedSans(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'center baseline', color = '#fff') {
    let width_b = lineSeedSans.getTextWidth(largerText, largeSize);
    let width_m = lineSeedSans.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = lineSeedSans.getTextPath(largerText, x, y, largeSize, anchor, color) +
            lineSeedSans.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);

    } else if (anchor === "right baseline") {
        out = lineSeedSans.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            lineSeedSans.getTextPath(smallerText, x, y, smallSize, anchor, color);

    } else if (anchor === "center baseline") {
        out = lineSeedSans.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            lineSeedSans.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color);
    }

    return out;
}

export const torus = {};

torus.name = "torus"
torus.getTextPath = getTextPath_torus;
torus.get2SizeTextPath = get2SizeTextPath_torus;
torus.getTextMetrics = getTextMetrics_torus;
torus.getTextWidth = getTextWidth_torus;
torus.cutStringTail = cutStringTail_torus;

/**
 * @return {string}
 */
function getTextPath_torus(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGTorusSB.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "Torus",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_torus(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGTorusSB.getMetrics(preprocessingText(text), {
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

/**
 * @return {number}
 */
function getTextWidth_torus(
    text = '',
    size = 0,
) {
    return textToSVGTorusSB.getMetrics(preprocessingText(text), {
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

/**
 * @return {string}
 */
function cutStringTail_torus(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

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
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 * @param color2 {String} 十六进制颜色，#FFF，可不输入
 */

function get2SizeTextPath_torus(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'left baseline', color = '#fff', color2 = color) {
    let width_b = torus.getTextWidth(largerText, largeSize);
    let width_m = torus.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = torus.getTextPath(largerText, x, y, largeSize, anchor, color) +
            torus.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color2);

    } else if (anchor === "right baseline") {
        out = torus.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            torus.getTextPath(smallerText, x, y, smallSize, anchor, color2);

    } else if (anchor === "center baseline") {
        out = torus.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            torus.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color2);
    }

    return out;
}

export const torusBold = {};

torusBold.name = "torusBold"
torusBold.getTextPath = getTextPath_torusBold;
torusBold.get2SizeTextPath = get2SizeTextPath_torusBold;
torusBold.getTextMetrics = getTextMetrics_torusBold;
torusBold.getTextWidth = getTextWidth_torusBold;
torusBold.cutStringTail = cutStringTail_torusBold;

/**
 * @return {string}
 */
function getTextPath_torusBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGTorusBold.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TorusBold",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_torusBold(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGTorusBold.getMetrics(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TorusBold",
        attributes: {
            fill: fill
        }
    })
}

/**
 * @return {number}
 */
function getTextWidth_torusBold(
    text = '',
    size = 0,
) {
    return textToSVGTorusBold.getMetrics(preprocessingText(text), {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "TorusBold",
        attributes: {
            fill: '#fff'
        }
    }).width
}

/**
 * @return {string}
 */
function cutStringTail_torusBold(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

    if (torusBold.getTextWidth(text, size) <= maxWidth) {
        return text;
    }

    let dot3 = '...';
    let dot3_width = isDot3Needed ? torusBold.getTextWidth(dot3, size) : 0;
    let out_text = '';
    maxWidth -= dot3_width;

    for (let i = 0; torusBold.getTextWidth(out_text, size) < maxWidth; i++) {
        out_text += text.slice(i, i + 1);
    }

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 torusBold 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 * @param color2 {String} 十六进制颜色，#FFF，可不输入
 */

function get2SizeTextPath_torusBold(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'left baseline', color = '#fff', color2 = color) {
    let width_b = torusBold.getTextWidth(largerText, largeSize);
    let width_m = torusBold.getTextWidth(smallerText, smallSize);
    let width_a = (width_b + width_m) / 2; // 全长的一半长

    let out;

    if (anchor === "left baseline") {
        out = torusBold.getTextPath(largerText, x, y, largeSize, anchor, color) +
            torusBold.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color2);

    } else if (anchor === "right baseline") {
        out = torusBold.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
            torusBold.getTextPath(smallerText, x, y, smallSize, anchor, color2);

    } else if (anchor === "center baseline") {
        out = torusBold.getTextPath(largerText, x - width_a, y, largeSize, "left baseline", color) +
            torusBold.getTextPath(smallerText, x + width_a, y, smallSize, "right baseline", color2);
    }

    return out;
}

export const torusRegular = {};

torusRegular.name = "torusRegular"
torusRegular.getTextPath = getTextPath_torusRegular;
torusRegular.get2SizeTextPath = get2SizeTextPath_torusRegular;
torusRegular.getTextMetrics = getTextMetrics_torusRegular;
torusRegular.getTextWidth = getTextWidth_torusRegular;
torusRegular.cutStringTail = cutStringTail_torusRegular;

/**
 * @return {string}
 */
function getTextPath_torusRegular(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGTorusRegular.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "TorusRegular",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_torusRegular(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGTorusRegular.getMetrics(preprocessingText(text), {
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

/**
 * @return {number}
 */
function getTextWidth_torusRegular(
    text = '',
    size = 0,
) {
    return textToSVGTorusRegular.getMetrics(preprocessingText(text), {
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

/**
 * @return {string}
 */
function cutStringTail_torusRegular(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

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

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}


/**
 * @function 获取大小文本的 torusRegular 字体 SVG 路径
 * @return {String}
 * @param largerText {String} 较大的文本
 * @param smallerText {String} 较小的文本
 * @param largeSize {Number} 大文本尺寸
 * @param smallSize {Number} 小文本尺寸
 * @param x {Number} 锚点横坐标
 * @param y {Number} 锚点纵坐标
 * @param anchor {String} 锚点种类。目前只支持left baseline right baseline center baseline。
 * @param color {String} 十六进制颜色，#FFF
 */

function get2SizeTextPath_torusRegular(largerText, smallerText, largeSize, smallSize, x, y, anchor = 'center baseline', color = '#fff') {
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

PuHuiTi.name = "PuHuiTi"
PuHuiTi.getTextPath = getTextPath_PuHuiTi;
PuHuiTi.getTextMetrics = getTextMetrics_PuHuiTi;
PuHuiTi.getTextWidth = getTextWidth_PuHuiTi;
PuHuiTi.cutStringTail = cutStringTail_PuHuiTi;

/**
 * @return {string}
 */
function getTextPath_PuHuiTi(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGPuHuiTi.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "PuHuiTi",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_PuHuiTi(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGextra.getMetrics(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "PuHuiTi",
        attributes: {
            fill: fill
        }
    });
}

/**
 * @return {number}
 */
function getTextWidth_PuHuiTi(
    text = '',
    size = 0,
) {
    return textToSVGPuHuiTi.getMetrics(preprocessingText(text), {
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

/**
 * @return {string}
 */
function cutStringTail_PuHuiTi(
    text = '',
    size = 36,
    maxWidth = 0,
    isDot3Needed = true,
) {
    text = preprocessingText(text)

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

    return isDot3Needed ? out_text.slice(0, -1) + dot3 : out_text.slice(0, -1); //因为超长才能跳出，所以裁去超长的那个字符
}

export const extra = {};

extra.name = "extra"
extra.getTextPath = getTextPath_extra;
extra.getTextMetrics = getTextMetrics_extra;
extra.getTextWidth = getTextWidth_extra;

/**
 * @return {string}
 */
function getTextPath_extra(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff',
    opacity = 1,
    stroke = 'none',
    stroke_width = 0,
    stroke_opacity = 1,
) {
    return textToSVGextra.getPath(preprocessingText(text), {
        x: x,
        y: y,
        fontSize: size,
        anchor: anchor,
        fontFamily: "extra",
        attributes: {
            "fill": fill,
            "fill-opacity": opacity,
            "stroke": stroke,
            "stroke-width": stroke_width,
            "stroke-opacity": stroke_opacity,
        }
    })
}

function getTextMetrics_extra(
    text = '',
    x = 0,
    y = 0,
    size = 36,
    anchor = 'left baseline',
    fill = '#fff'
) {
    return textToSVGextra.getMetrics(preprocessingText(text), {
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

/**
 * @return {number}
 */
function getTextWidth_extra(
    text = '',
    size = 0,
) {
    return textToSVGextra.getMetrics(preprocessingText(text), {
        x: 0,
        y: 0,
        fontSize: size,
        anchor: 'center baseline',
        fontFamily: "extra",
        attributes: {
            fill: '#fff'
        }
    }).width
}

function getFontName(font = torus) {
    if (typeof font == "object") return Object.values(font)[0]
    else return font?.toString()
}

/**
 * @return {number}
 */
export function getTextWidth(font = "torus", text = '', size = 24) {
    const name = getFontName(font)

    if (name === "torus") return torus.getTextWidth(text, size);
    if (name === "torusRegular") return torusRegular.getTextWidth(text, size);
    if (name === "torusBold") return torusBold.getTextWidth(text, size);
    if (name === "TahomaRegular") return TahomaRegular.getTextWidth(text, size);
    if (name === "TahomaBold") return TahomaBold.getTextWidth(text, size);
    if (name === "PuHuiTi") return PuHuiTi.getTextWidth(text, size);
    if (name === "extra") return extra.getTextWidth(text, size);
    if (name === "poppinsBold") return poppinsBold.getTextWidth(text, size);
    if (name === "lineSeedSans") return lineSeedSans.getTextWidth(text, size);
    if (name === "BerlinBold") return BerlinBold.getTextWidth(text, size);
    return 0;
}

export function getTextPath(font = "torus", text = '', x, y, size = 24, anchor, fill) {
    const name = getFontName(font)

    if (name === "torus") return torus.getTextPath(text, x, y, size, anchor, fill);
    if (name === "torusRegular") return torusRegular.getTextPath(text, x, y, size, anchor, fill);
    if (name === "torusBold") return torusBold.getTextPath(text, x, y, size, anchor, fill);
    if (name === "TahomaRegular") return TahomaRegular.getTextPath(text, x, y, size, anchor, fill);
    if (name === "TahomaBold") return TahomaBold.getTextPath(text, x, y, size, anchor, fill);
    if (name === "PuHuiTi") return PuHuiTi.getTextPath(text, x, y, size, anchor, fill);
    if (name === "extra") return extra.getTextPath(text, x, y, size, anchor, fill);
    if (name === "poppinsBold") return poppinsBold.getTextPath(text, x, y, size, anchor, fill);
    if (name === "lineSeedSans") return lineSeedSans.getTextPath(text, x, y, size, anchor, fill);
    if (name === "BerlinBold") return BerlinBold.getTextPath(text, x, y, size, anchor, fill);
    return '';
}

export function cutStringTail(font = "torus", text = '', size = 24, max_width = 0, is_dot3_needed = true) {
    const name = getFontName(font)

    if (name === "torus") return torus.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "torusRegular") return torusRegular.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "torusBold") return torusBold.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "TahomaRegular") return TahomaRegular.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "TahomaBold") return TahomaBold.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "PuHuiTi") return PuHuiTi.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "extra") return extra.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "poppinsBold") return poppinsBold.cutStringTail(text, size, max_width, is_dot3_needed);
    if (name === "lineSeedSans") return lineSeedSans.cutStringTail(text, size, max_width, is_dot3_needed);
    return text;
}