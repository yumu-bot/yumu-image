import {getTextWidth} from "./font.js";
import crypto from "crypto";

/**
 * 计算 stat 文本的 x 坐标，防止重叠
 * @param {number[]} stat_arr - 各项数据值数组
 * @param {number[]} stat_width_arr - 各项柱状图宽度数组
 * @param {number} x - 柱状形起点的 x 坐标 (stat_x)
 * @param {number} stat_interval - 柱子之间的间距 (stat_interval)
 * @param {FontInstance} font - 用于计算字宽的字体对象 (torus)
 * @param {number} font_size - 字体大小 (例如 14)
 * @param {number} min_margin - 文本之间的最小安全间距 (默认为 2px)
 * @returns {Array<{text: string, x: number, index: number}>} 返回可渲染的文本信息数组
 */
export function layoutStatTexts(stat_arr, stat_width_arr, x, stat_interval, font, font_size = 14, min_margin = 2) {
    let items = [];
    let current_x = x;

    for (let i = 0; i < stat_arr.length; i++) {
        const val = stat_arr[i];
        const width = stat_width_arr[i];

        if (val > 0) {
            const text = val.toString();
            const textWidth = getTextWidth(font, text, font_size);
            const initial_center_x = current_x + width / 2;

            items.push({
                index: i,
                text: text,
                width: textWidth,
                x: initial_center_x, // 初始位置（中心点）
            });

            current_x += width + stat_interval;
        }
    }

    if (items.length === 0) return [];

    // 2. 从后往前遍历，防止与右侧文本重叠
    for (let i = items.length - 2; i >= 0; i--) {
        const current = items[i];
        const next = items[i + 1];

        // 当前文本右边缘: current.x + current.width / 2
        // 右侧文本左边缘: next.x - next.width / 2
        const current_right = current.x + current.width / 2;
        const next_left = next.x - next.width / 2;

        // 如果重叠（加上了安全间距）
        if (current_right + min_margin > next_left) {
            // 向左挪动：使当前文本右边缘 = 右侧文本左边缘 - minMargin
            current.x = next_left - min_margin - current.width / 2;
        }
    }

    // 3. 检查第一个文本的左边缘是否超出起始位置 stat_x (即 < startX)
    const first_left = items[0].x - items[0].width / 2;

    if (first_left < x) {
        // 说明左侧越界了，强制从左往右按顺序紧密排列
        let cursor_x = x;
        for (let i = 0; i < items.length; i++) {
            items[i].x = cursor_x + items[i].width / 2;
            cursor_x += items[i].width + min_margin;
        }
    }

    return items;
} // 'none' 不包括在内
/**
 * @return boolean
 */
export function isBlankString(val) {
    if (val == null) return true;

    if (typeof val === 'string') {
        return val.length === 0;
    }

    return String(val).length === 0;
}

/**
 * @return boolean
 */
export function isEmptyString(val) {
    if (val == null) return true;

    if (typeof val === 'string') {
        return val.trim().length === 0;
    }

    return String(val).trim().length === 0;
}

/**
 * @return boolean
 */
/**
 * 判断字符串是否仅包含 ASCII 字符
 * @param {any} str
 * @returns {boolean}
 */
export function isASCII(str) {
    // 确保输入是字符串且不为空
    if (typeof str === 'number') return true
    if (typeof str !== 'string' || str.length === 0) return false;

    for (let i = 0; i < str.length; i++) {
        // ASCII 码点范围是 0 - 127
        // 直接检查字符编码是否超过 382 (0x17E)
        // 这个是 torus 支持的编码范围
        if (str.charCodeAt(i) > 382) {
            return false;
        }
    }
    return true;
}

/**
 * @return boolean
 */
export function isNumber(num) {
    if (typeof num == "number") {
        return !Number.isNaN(num)
    } else if (typeof num == "string") {
        const pattern = /^\s*(-?[0-9]+[.]?[0-9]*)\s*$/;
        return pattern.test(num?.toString());
    } else {
        return false
    }
}

/**
 * @return boolean
 */
export function isHexColor(str) {
    return isNotBlankString(str) && (str?.toString()?.slice(0, 1) === '#' || str?.toString()?.toUpperCase() === "NONE")
}

/**
 * @return boolean
 */
export function isNotBlankString(str = "") {
    return !isBlankString(str)
}

/**
 * @return boolean
 */
export function isNotEmptyString(str = "") {
    return !isEmptyString(str)
}

/**
 * @param str {number|string|null}
 * @return boolean
 */
export function isNotNumber(str = '') {
    return !isNumber(str)
}

export function randomString(e) {
    e = e || 32;
    let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

/**
 * @function 获取分割好的比赛名字
 * @param text 输入比赛名字
 * @return {{name: string, team1: string, team2: string}}
 */
export function splitMatchName(text = '') {
    // 基础防空校验
    if (!text || typeof text !== 'string') {
        return { name: '', team1: '', team2: '' }
    }

    // 清理杂质的工具函数：移除所有全半角括号，并去除首尾空格
    const sanitize = (str = '') => str.replace(/[()（）\[\]【】{}]/g, '').trim()

    // 步骤 1：用英文/中文冒号切第一刀
    // search 支持正则，同时匹配半角 ':' 和全角 '：'
    const colonIndex = text.search(/[:：]/)

    // 如果没有冒号，匹配失败，走到保底机制
    if (colonIndex === -1) {
        return { name: sanitize(text), team1: '', team2: '' }
    }

    // 得到冒号前后的原始字符串
    const rawName = text.slice(0, colonIndex)
    const rawTeams = text.slice(colonIndex + 1)

    // 步骤 2：用 VS 切第二刀（忽略大小写）
    const teamParts = rawTeams.split(/[Vv][Ss]/)

    // 如果冒号后面没有 VS，无法拆出两队，走保底
    if (teamParts.length < 2) {
        return { name: sanitize(text), team1: '', team2: '' }
    }

    // 步骤 3：统一去除各部分的杂质（空格、括号）
    const name = sanitize(rawName)
    const team1 = sanitize(teamParts[0])
    const team2 = sanitize(teamParts[1])

    // 转换失败的保底机制（队名为空时）
    if (!team1 || !team2) {
        return { name: sanitize(text), team1: '', team2: '' }
    }

    return { name, team1, team2 }
}

export function getRandomString(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
        // 64 的二进制是 2^6，所以用 & 63 (00111111) 过滤，完美均匀分布，且比模除更高效
        .map(v => chars[v & 63])
        .join('');
}