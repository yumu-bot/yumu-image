import * as path_util from 'path';
import TextToSVG from "text-to-svg";

class FontInstance {
    constructor(file, family) {
        this.name = family;
        const font_path = path_util.resolve('font', file);
        this.font = TextToSVG.loadSync(font_path);

        // 绑定方法，确保 this 指向正确，同时方便外部直接解构
        this.getTextPath = this.getTextPath.bind(this);
        this.getTextMetrics = this.getTextMetrics.bind(this);
        this.getTextWidth = this.getTextWidth.bind(this);
        this.cutStringTail = this.cutStringTail.bind(this);
    }

    getTextPath(
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
        /**
         * @type {String}
         */
        let shadow_path

        if (shadow === false) {
            shadow_path = ''
        } else {
            const shadow_options = {
                x: x + 2,
                y: y + 2,
                fontSize: size,
                anchor: anchor,
                fontFamily: this.name,
                kerning: true,
                attributes: {
                    fill: '#1c1719'
                }
            }

            shadow_path = this.font.getPath(preprocessingText(text), shadow_options)
        }

        const options = {
            x: x,
            y: y,
            fontSize: size,
            anchor: anchor,
            fontFamily: this.name,
            kerning: true,
            attributes: {
                "fill": fill,
                "fill-opacity": opacity,
                "stroke": stroke,
                "stroke-width": stroke_width,
                "stroke-opacity": stroke_opacity,
            }
        }

        const path = this.font.getPath(preprocessingText(text), options)

        return shadow_path.concat(path)
    }

    /**
     * 获取大小双字号混排的 SVG 路径（内置于类中）
     * @return {String}
     */
    get2SizeTextPath(
        largerText,
        smallerText,
        largeSize,
        smallSize,
        x,
        y,
        anchor = 'center baseline',
        color = '#fff'
    ) {
        let out;

        const parts = anchor.split(/\s+/).filter(Boolean);
        const horizontal = parts[0] || "center";
        const vertical = parts[1] || "baseline";

        switch (horizontal.slice(0, 1)) {
            case 'l': {
                const width_b = this.getTextWidth(largerText, largeSize);

                out = this.getTextPath(largerText, x, y, largeSize, anchor, color) +
                    this.getTextPath(smallerText, x + width_b, y, smallSize, anchor, color);
            } break
            case 'r': {
                const width_m = this.getTextWidth(smallerText, smallSize);

                out = this.getTextPath(largerText, x - width_m, y, largeSize, anchor, color) +
                    this.getTextPath(smallerText, x, y, smallSize, anchor, color);
            } break
            default: {
                const width_b = this.getTextWidth(largerText, largeSize);
                const width_m = this.getTextWidth(smallerText, smallSize);

                const width_a = (width_b + width_m) / 2; // 全长的一半长

                out = this.getTextPath(largerText, x - width_a, y, largeSize, `left ${vertical}`, color) +
                    this.getTextPath(smallerText, x + width_a, y, smallSize, `right ${vertical}`, color);
            } break
        }

        return out;
    }

    getTextMetrics(text = '', x = 0, y = 0, size = 36, anchor = 'left baseline', fill = '#fff') {
        return this.font.getMetrics(preprocessingText(text), {
            x: x,
            y: y,
            fontSize: size,
            anchor: anchor,
            fontFamily: this.name,
            attributes: {
                fill: fill
            }
        })
    }

    /**
     *
     * @param text {string | number}
     * @param size {number}
     * @return {number}
     */
    getTextWidth(text = '', size = 0) {
        return this.font.getWidth(preprocessingText(text), {
            fontSize: size,
        }) ?? 0;
    }

    /**
     * 智能文本裁切（二分法优化版）
     * @param {string | number} text - 输入文本
     * @param {number} size - 字体大小
     * @param {number} max_width - 最大限制宽度
     * @param {boolean} is_dot3_needed - 超长时是否需要追加 "..."
     * @return {string}
     */
    cutStringTail(text = '', size = 36, max_width = 100, is_dot3_needed = true) {
        // 1. 如果整行文本本身就没超宽，直接返回原文本
        if (this.getTextWidth(text, size) <= max_width) {
            return text;
        }

        const safe_text = preprocessingText(text)

        const dot3 = '...';
        // 2. 根据是否需要 "..." 动态计算留给文本的实际目标宽度
        const dot3_width = is_dot3_needed ? this.getTextWidth(dot3, size) : 0;
        const target_width = max_width - dot3_width;

        // 3. 极端边界：如果扣除 "..." 后连 1 像素都不剩了，直接返回 "..." 或空
        if (target_width <= 0) {
            return is_dot3_needed ? dot3 : '';
        }

        let low = 0;
        let high = safe_text.length;
        let best = 0;

        // 4. 二分查找：寻找能塞进 targetWidth 的最大字符截取长度
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const current_width = this.getTextWidth(safe_text.substring(0, mid), size);

            if (current_width <= target_width) {
                best = mid;   // 记录当前最稳妥的截取字符数
                low = mid + 1;      // 尝试往右探测，看能不能塞下更多字符
            } else {
                high = mid - 1;     // 超宽了，向左收缩查找范围
            }
        }

        // 5. 组装最终结果
        const sliced = safe_text.substring(0, best);
        return is_dot3_needed ? sliced + dot3 : sliced;
    }
}

export const torus = new FontInstance("Torus-SemiBold.ttf", "Torus");
export const PuHuiTi = new FontInstance("AlibabaPuHuiTi3.0-75SemiBold-CJKTGv4.3.ttf", "PuHuiTi");
export const extra = new FontInstance("extra.gamemode.ttf", "Extra");
export const torusRegular = new FontInstance("Torus-Regular.ttf", "TorusRegular");
export const torusBold = new FontInstance("Torus-Bold.ttf", "TorusBold");
export const poppinsBold = new FontInstance("Poppins-Bold.ttf", "PoppinsBold");
export const lineSeedSans = new FontInstance("LINESeedSans_Bd.ttf", "LineSeedSansBold");
export const TahomaRegular = new FontInstance("ft71.ttf", "TahomaRegular");
export const TahomaBold = new FontInstance("tahomabd.ttf", "TahomaBold");
export const BerlinBold = new FontInstance("BerlinsansExpert-Bold.ttf", "BerlinBold");

/*
// 统一使用 EndfieldByButan.ttf 的备用定义方式

// 1. 创建唯一的 Endfield 实例
const endfieldInstance = new FontInstance("EndfieldByButan.ttf", "EndfieldByButan");

// 2. 其余常量直接引用这个实例
// 这样在代码中调用 torus.getTextWidth() 时，实际上调用的是同一个实例的方法
export const torus = endfieldInstance;
export const PuHuiTi = endfieldInstance;
export const torusRegular = endfieldInstance;
export const torusBold = endfieldInstance;
export const poppinsBold = endfieldInstance;
export const lineSeedSans = endfieldInstance;
export const TahomaRegular = endfieldInstance;
export const TahomaBold = endfieldInstance;
export const BerlinBold = endfieldInstance;

// 3. 额外处理 extra（因为它使用不同的文件）
export const extra = new FontInstance("extra.gamemode.ttf", "Extra");

*/

/**
 *
 * @param text {number|string}
 * @return {string}
 */
function preprocessingText(text = '') {
    return String(text ?? '');

    // return endfieldMapper(String(text))
}

const char_mapper = [
    'g', 'k', 'a', 'm', 'z', 't', 'l', 'b', 'd', 'q', 'i', 'y', 'f', 'u',
    'c', 'x', 'b', 'h', 's', 'j', 'o', 'p', 'r', 'n', 'w', 'e', 'y', 'g',
    't', 'j', 'm', 'e', 'v', 'c', 'h', 'd', 'x', 's', 'a', 'n', 'q', 'o',
    'l', 'k', 'r', 'v', 'w', 'i', 'y', 'p', 'j', 'z', 'q', 'u', 'h', 'e'
]

const default_mapper = new Map([
    [0x23, 0x2E],
    [0x24, 0x2E],
    [0x25, 0x2E],
    [0x26, 0x2E],
    [0x40, 0x2E],
    [0x5C, 0x2F],
    [0x5E, 0x2F],
    [0x3B, 0x3A],
    [0x5F, 0x2D],
    [0x60, 0x5B],

    [0x3000, 0x20], // space

]);

// 以下是转换为 Endfield 文字的映射
function endfieldMapper(text = '') {

    // https://www.bilibili.com/video/BV1PtdyBMEED 01:52 处


    let result = []

    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i)

        if (code >= 0xFF01 && code <= 0xFF5E) {
            code -= 0xFEE0;
        }

        if (default_mapper.has(code)) {
            result.push(String.fromCharCode(default_mapper.get(code)))
        } else if (code >= 0x7B) {
            result.push(char_mapper[code % 56] ?? '.')
        } else {
            // 情况 3: 其余情况直出原字符
            result.push(String.fromCharCode(code))
        }
    }

    return result.join('')
}

const font_map = {
    // 键名为小写或特定缩写，值指向你导出的 FontInstance 实例
    "torus": torus,
    "torusregular": torusRegular,
    "torusbold": torusBold,
    "tahomaregular": TahomaRegular,
    "tahomabold": TahomaBold,
    "puhuiti": PuHuiTi,
    "extra": extra,
    "poppinsbold": poppinsBold,
    "lineseedsans": lineSeedSans,
    "berlinbold": BerlinBold
};

const default_font = PuHuiTi

/**
 * @param font {FontInstance | Object | String}
 * @return {FontInstance}
 */
function getFontInstance(font) {
    if (!font) return default_font;

    if (typeof font === 'object' && typeof font.getTextWidth === 'function') {
        return font;
    }

    let name;

    // 2. 如果传入的是旧版的 `{ torus: torus }` 形式的对象
    if (typeof font === "object") {
        const value = Object.values(font)[0];
        name = value?.name || (value ? value.toString() : '');
    } else {
        // 3. 如果传入的是字符串
        name = font.toString();
    }

    const lookupKey = name.toLowerCase();

    return font_map[lookupKey] || default_font;
}

/**
 * 获取多个字体组合成的字形路径
 * @param {Array} array - 字体片段数组
 * @param {number} x - 起点 X
 * @param {number} y - 起点 Y
 * @param {string} anchor - 对齐方式 ('center baseline' | 'left baseline' | 'right baseline')
 * @param {number} opacity
 * @param {boolean} shadow - 是否开启阴影
 * @return {String}
 */
export function getMultipleTextPath(array = [{
    font: "torus",
    text: '',
    size: 24,
    color: '#fff',
}], x = 0, y = 0, anchor = "center baseline", opacity = 1, shadow = false) {
    if (!array || array.length === 0) return '';

    // 1. 先纯粹地计算出总宽度
    let total_width = 0;
    for (const v of array) {
        const instance = getFontInstance(v.font);
        const text = preprocessingText(v.text);
        const size = v?.size || 24;
        total_width += instance.getTextWidth(text, size);
    }

    // 2. 根据对齐方式，确定整行文本的起始绝对 X 坐标
    const parts = anchor.split(/\s+/).filter(Boolean);
    const horizontal = parts[0] || "center";
    const vertical = parts[1] || "baseline";

    let start_x = x;
    if (horizontal === "center") {
        start_x = x - (total_width / 2);
    } else if (horizontal === "right") {
        start_x = x - total_width;
    } // left 情况下 start_x 就等于 x

    /**
     * @type {string[]}
     */
    let out = [];
    let current_x = start_x; // 当前片段的起点 X 坐标

    // 3. 顺序拼接每个片段
    for (const v of array) {
        const instance = getFontInstance(v.font);
        const text = v.text || '';
        const size = v?.size ?? 24;
        const color = v?.color || '#fff';

        // 每一个片段本身，相对于它自己的起始点，依然是 "left" 对齐
        out.push(instance.getTextPath(text, current_x, y, size, `left ${vertical}`, color, opacity, shadow));

        // 移动到下一个片段的起点
        const width = instance.getTextWidth(text, size);
        current_x += width;
    }

    return out.join('\n');
}

/**
 * 3. 重写：高能获取文本宽度
 * @param font {FontInstance | String}
 * @param text {String | Number}
 * @param size {Number}
 * @return {number}
 */
export function getTextWidth(font = "torus", text = '', size = 24) {
    const instance = getFontInstance(font);
    return instance.getTextWidth(text, size);
}

/**
 * 4. 重写：获取 SVG 路径
 * @param font {FontInstance | String}
 * @param text {String | Number}
 * @param x {Number}
 * @param y {Number}
 * @param size {Number}
 * @param anchor {String}
 * @param fill {String}
 * @return {String}
 */
export function getTextPath(font = "torus", text = '', x = 0, y = 0, size = 24, anchor = 'left baseline', fill = '#fff') {
    const instance = getFontInstance(font);
    return instance.getTextPath(text, x, y, size, anchor, fill);
}

/**
 * 5. 重写：高性能二分法文本裁剪
 * @return {string}
 */
export function cutStringTail(font = "torus", text = '', size = 24, max_width = 0, is_dot3_needed = true) {
    const instance = getFontInstance(font);
    return instance.cutStringTail(text, size, max_width, is_dot3_needed);
}
