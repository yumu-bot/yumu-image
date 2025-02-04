import fs from 'fs';
import os from "os";
import crypto from 'crypto';
import axios, {AxiosError} from "axios";
import https from "https";
import path from "path";
import moment from "moment";
import {cutStringTail, getTextPath, PuHuiTi, torus} from "./font.js";
import {API} from "../svg-to-image/API.js";
import JPEGProvider from '../svg-to-image/JPEGProvider.js';
import PNGProvider from '../svg-to-image/PNGProvider.js';
import {getRandom, getRandomBannerPath} from "./mascotBanner.js";

const exportsJPEG = new API(new JPEGProvider());
const exportsPNG = new API(new PNGProvider());

const path_util = path;
const MD5 = crypto.createHash("md5");
/**
 * 文件路径初始化
 */
export const CACHE_PATH = path_util.join(os.tmpdir(), "/n-bot");
export const EXPORT_FILE_V3 = process.env.EXPORT_FILE || "";
export const SUPER_KEY = process.env.SUPER_KEY || "";
export const OSU_BUFFER_PATH = process.env.OSU_FILE_PATH || CACHE_PATH + "/osufile";

const IMG_BUFFER_PATH = process.env.BUFFER_PATH || CACHE_PATH + "/buffer";
const FLAG_PATH = process.env.FLAG_PATH || EXPORT_FILE_V3 + "Flags" //CACHE_PATH + "/flag";

export function initPath() {
    axios.defaults.timeout = 4000;// 2000
    axios.defaults.retry = 5;
    axios.defaults.retryDelay = 2000;// 1000
    axios.defaults.proxy = {
        host: '127.0.0.1',
        port: 7890,
        protocol: "http",
    }
    // axios 重试策略
    axios.interceptors.response.use((response) => response, (error) => {
        const {config, response} = error;

        config.__errTime = config.__errTime || 0;
        config.__retryCount = config.__retryCount || 1;

        if (response?.status === 429) {
            let backoff = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, (Math.pow(2, config.__retryCount) * 1000) || config.retryDelay || 1);  // 指数退避
            });
            return backoff.then(function () {
                return axios(config);
            })
        } else if (error.code === 'ECONNABORTED' && !config.__no_wait && config.__errTime <= config.retry) {
            console.log(`${config.method} ${config.url} timeout, re send: ${config.__errTime}`);
            config.__errTime += 1;
            let backoff = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, config.retryDelay || 1);
            });
            if (config.__errTime >= 2) {
                config.timeout += config.__errTime * 2000;
            }
            return backoff.then(function () {
                return axios(config);
            });
        }
        //console.error("request err", config);
        return Promise.reject(error);
    })
    fs.access(CACHE_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    fs.access(OSU_BUFFER_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    fs.access(FLAG_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    console.log("主缓存目录: ", CACHE_PATH);
    console.log("图像缓存: ", IMG_BUFFER_PATH);
    console.log("谱面文件缓存: ", OSU_BUFFER_PATH);

    Number.prototype.fixed = function () {
        return fixed(this);
    }

    return path;
}

// pippi、Mocha, Aiko, Alisa, Chirou, Tama, Taikonator, Yuzu, Mani, Mari

export const exportJPEG = async (svg) => await exportsJPEG.convert(svg, {quality: 100});
export const exportPNG = async (svg) => await exportsPNG.convert(svg);

const UTF8Encoder = new TextEncoder('utf8');

export function readTemplate(path = '') {
    return fs.readFileSync(path, 'utf8');
}

export function readFile(path = '') {
    try {
        return fs.readFileSync(path, 'binary');
    } catch (e) {
        return undefined;
    }
}

/**
 * 获取来自 v3 的图片
 * @param path
 * @return {string} Buffer 图片流
 */
export function readImageFromV3(path = '') {
    return fs.readFileSync(getImageFromV3(path), 'binary');
}

/**
 * 获取来自 v3 的图片链接，可用于 SVG 图片插入
 * @param path
 * @return {string} 图片链接
 */
export function getImageFromV3(...paths) {
    return path_util.join(EXPORT_FILE_V3, ...paths);
}

/**
 * @function 获得难度背景
 * @param {number} bid bid
 * @param {number} sid sid
 */
export async function getDiffBG(bid, sid, cover = 'cover', use_cache = true, is_dmca = false, default_image_path = getImageFromV3('card-default.png')) {
    let path;

    try {
        // data 为背景文件在文件系统中的绝对路径字符串 不是文件本身

        const res = await getBGFromDatabase(bid, sid);
        path = res.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            console.error("本地背景读取超时");
        } else {
            console.error("本地背景读取失败", e);
        }
        path = await getMapBG(sid, cover, use_cache, default_image_path);
    } finally {
        asyncBeatMapFromDatabase(bid, sid);

        if (isPictureIntacted(path)) {
            return path;
        } else {
            if (is_dmca === false) {
                deleteBeatMapFromDatabase(bid);
            }

            return await getMapBG(sid, cover, use_cache, default_image_path);
        }
    }
}

/**
 * 获取图片
 */
export async function getBGFromDatabase(bid, sid) {
    return await axios.get(`http://127.0.0.1:47150/api/file/local/bg/${bid}`, {
        proxy: {},
        headers: {
            "SET_ID": sid,
            "AuthorizationX": SUPER_KEY,
        },
        timeout: 1500,
        __no_wait: true,
    });
}

/**
 * 向服务器提交异步任务
 */
export function asyncBeatMapFromDatabase(bid, sid) {
    axios.get(`http://127.0.0.1:47150/api/file/local/async/${bid}`, {
        proxy: {},
        headers: {
            "SET_ID": sid,
            "AuthorizationX": SUPER_KEY,
        }
    }).catch(_ => {
    })
}


/**
 * 向服务器提交删除谱面任务
 */
export function deleteBeatMapFromDatabase(bid) {
    axios.get(`http://127.0.0.1:47150/api/file/remove/bid/${bid}`, {
        proxy: {},
        headers: {
            "AuthorizationX": SUPER_KEY,
        }
    }).catch(_ => {
    })
}

/**
 * @return boolean
 */
function isBlankStringOrNotNull(str) {
    if (typeof str !== "string") {
        try {
            str.toString().trim()?.length === 0
        } catch (e) {
            return false
        }
    } else {
        return str?.trim()?.length === 0
    }
}

/**
 * @return boolean
 */
function isEmptyStringOrNotNull(str) {
    if (typeof str !== "string") {
        try {
            str.toString()?.length === 0
        } catch (e) {
            return false
        }
    } else {
        return str?.length === 0
    }
}

/**
 * @return boolean
 */
export function isBlankString(str) {
    return isNull(str) || isBlankStringOrNotNull(str)
}

/**
 * @return boolean
 */
export function isEmptyString(str) {
    return isNull(str) || isEmptyStringOrNotNull(str)
}

/**
 * @return boolean
 */
export function isEmptyArray(arr) {
    return isNull(arr) || !(Array.isArray(arr)) || (Array.isArray(arr) && arr?.length == 0)
}

// {} 和 [] 不为空
/**
 * @return boolean
 */
export function isNull(object) {
    return (object === null) || (object === undefined) || (typeof object === "undefined")
}

/**
 * @return boolean
 */
export function isNullOrEmptyObject(object) {
    return isNull(object) || isEmptyObject(object)
}

/**
 * @return boolean
 */
export function isEmptyObject(object) {
    return Object?.keys(object)?.length === 0
}

/**
 * @return boolean
 */
export function isASCII(str = '') {
    if (isBlankString(str)) return false

    const pattern = /^[\x00-\x7F]+$/; // ASCII范围的Unicode编码
    return pattern.test(str);
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

// 'none' 不包括在内
/**
 * @return boolean
 */
export function isHexColor(str) {
    return isNotBlankString(str) && (str?.toString()?.slice(0, 1) === '#')
}

// {} 和 [] 不为空
/**
 * @return boolean
 */
export function isNotNull(object) {
    return !isNull(object)
}

/**
 * @return boolean
 */
export function isNotNullOrEmptyObject(object) {
    return !isNullOrEmptyObject(object)
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
 * @return boolean
 */
export function isNotEmptyArray(arr = []) {
    return !isEmptyArray(arr)
}

/**
 * @return boolean
 */
export function isNotNumber(str = '') {
    return !isNumber(str)
}

export function requireNonNullElse(obj, obj2) {
    if (isNull(obj)) {
        if (isNull(obj2)) {
            throw Error("保底输入了空值！")
        } else return obj2
    } else return obj
}

/**
 * 根据谱面罗马音和原文，返回方便展示的字形
 * @param font
 * @param fon2
 * @param title
 * @param title_unicode
 * @param size
 * @param size2
 * @param maximum_width
 * @return {title: ..., title_unicode: ...,}
 */
export function getBeatMapTitlePath(font = "torus", font2 = "PuHuiTi", title = '', title_unicode = '', artist = null, x = 0, y = 0, y2 = 0, size = 36, size2 = 24, maximum_width = 780, anchor = "center baseline", color = "#fff", color2 = color) {

    let title_text;
    let title_unicode_text;

    //如果相等，第二段不显示
    if (title === title_unicode) {
        let title_cut = cutStringTail(font, title, size, maximum_width, false);
        let title_exceed;

        if (title_cut.length === title.toString().length) {
            if (typeof artist === "string") {
                title_exceed = artist;
            } else {
                title_exceed = '';
            }
        } else {
            title_exceed = title.toString().substring(title_cut.length);
        }

        title_text = getTextPath(font, title_cut, x, y, size, anchor, color);
        title_unicode_text = getTextPath(font,
            cutStringTail(font, title_exceed, size2, maximum_width, true),
            x, y2, size2, anchor, color2);
    } else {
        const title_str = cutStringTail(font, title, size, maximum_width, true);
        title_text = getTextPath(font, title_str, x, y, size, anchor, color);

        const title_unicode_str = cutStringTail(font2, title_unicode, size2, maximum_width, true)
        title_unicode_text = getTextPath(font2, title_unicode_str, x, y2, size2, anchor, color2);
    }

    return {
        title: title_text,
        title_unicode: title_unicode_text,
    }
}

/**
 * 读取文件，判断 JPG, PNG, GIF 图片是否完整
 * @param path 位于文件系统的绝对路径
 * @return {boolean}
 */
export function isPictureIntacted(path = '') {
    if (isBlankString(path)) return false;

    let f;

    try {
        f = fs.readFileSync(path, 'binary');
    } catch (e) {
        // No Such File
        return false;
    }
    return (f.startsWith('\xff\xd8')
            && f.endsWith('\xff\xd9'))
        || // JFIF JPG
        (f.startsWith('\x89\x50\x4E\x47\x0D\x0A\x1A\x0A')
            && f.endsWith('\x49\x45\x4e\x44\xae\x42\x60\x82'))
        || // PNG
        (f.startsWith("\x47\x49\x46\x38\x39\x61")
            && f.endsWith('\x00\x3b')); // GIF
}

export function isPicturePng(path = '') {
    let f;
    try {
        f = fs.readFileSync(path, 'binary');
    } catch (e) {
        // No Such File
        return false;
    }
    return f.startsWith('\x89\x50\x4E\x47\x0D\x0A\x1A\x0A') // PNG or APNG
}

/**
 * 判断文件大小
 * @param path 本地文件路径
 * @return {number|number} 文件 Byte，除以 1024 就是 KByte，不是 bit
 */
export function getFileSize(path = "") {
    let size;
    try {
        fs.accessSync(path, fs.constants.F_OK);
        size = fs.statSync(path).size;
    } catch (e) {
        // No Such File
        return -1;
    }

    return size;
}


/**
 * 获取谱面 BG
 * @param {number} sid
 * @param {string} [cover]
 * @param {boolean} [use_cache] 是否用缓存，false 强制更新
 * @param {string} [default_image_path] 出现错误时返回的失败图
 * @return {Promise<string>} 返回位于文件系统的绝对路径
 */
export async function getMapBG(sid = 0, cover = 'cover', use_cache = true, default_image_path = getImageFromV3('card-default.png')) {
    if (sid === 0 || isNotNumber(sid)) return default_image_path

    const bg = await readNetImage('https://assets.ppy.sh/beatmaps/' + sid + '/covers/' + cover + '.jpg', use_cache, default_image_path);

    // 部分官网的 list@2x 分辨率特别低，尺寸小于 15 KB，比如这个图 728088 list@2x
    if (cover === 'list@2x' && fs.statSync(bg).size <= 15 * 1024) {
        return await readNetImage('https://assets.ppy.sh/beatmaps/' + sid + '/covers/cover.jpg', use_cache, default_image_path);
    }

    return bg;
}

/**
 * 获取玩家头像。如果为空返回 avatar-guest.png
 * @param link
 * @param use_cache 如果用到的是链接，那读缓存也没问题
 * @param default_image_path
 * @return {Promise<string>}
 */
export async function getAvatar(link, use_cache = true, default_image_path = getImageFromV3('avatar-guest.png')) {
    if (isBlankString(link) || link == "https://a.ppy.sh/") {
        return default_image_path;
    } else if (isNumber(link)) {
        return await readNetImage('https://a.ppy.sh/' + link, use_cache, default_image_path);
    } else {
        return await readNetImage(link + '', use_cache, default_image_path);
    }
}

/**
 * 获取玩家横幅。如果为空返回 Banner/c1-c9.png
 * @param link
 * @param use_cache
 * @param default_image_path
 * @return {Promise<string>}
 */
export async function getBanner(link, use_cache = true, default_image_path = getImageFromV3("Banner/c" + getRandom(8) + ".png")) {
    if (isBlankString(link)) {
        return default_image_path;
    } else if (link.startsWith("https://assets.ppy.sh/beatmaps/")) {
        return await readNetImage(link, use_cache, getImageFromV3('beatmap-DLfailBG.jpg'))
    } else {
        return await readNetImage(link, use_cache, default_image_path);
    }
}

/**
 * 下载文件, 并且位于文件系统的绝对路径
 * @return {Promise<string>} 位于文件系统的绝对路径
 */
export async function readNetImage(path = '', use_cache = true, default_image_path = getImageFromV3('beatmap-DLfailBG.jpg')) {
    const error = getImageFromV3('error.png');

    if (!path || !path.startsWith("http")) {
        return readFile(path);
    }

    if (path.endsWith('avatar-guest.png')) {
        return getImageFromV3('avatar-guest.png');
    }

    const bufferName = MD5.copy().update(path).digest('hex');
    const bufferPath = `${IMG_BUFFER_PATH}/${bufferName}`;

    if (use_cache === true) {
        let size;

        try {
            fs.accessSync(bufferPath, fs.constants.F_OK);
            size = fs.statSync(bufferPath).size;
        } catch (e) {
            use_cache = false;
        }

        // 尝试仅在使用缓存的时候检测
        if (use_cache === true && (size > 4 * 1024) && isPictureIntacted(bufferPath)) {
            return bufferPath;
        } else {
            use_cache = false;
        }
    }
    let req;
    let data;

    if (use_cache === false) {
        try {
            req = await axios.get(path, {responseType: 'arraybuffer'});
            data = req.data;
        } catch (e) {
            console.error("download error", e);
            return default_image_path || error;
        }
    }

    if (req && req.status === 200) {
        fs.writeFileSync(bufferPath, data, 'binary');
        return bufferPath;
    } else {
        return default_image_path || error;
    }
}

/**
 * @param {number | string} base
 * @param {number | string} replace
 * @param {RegExp | string} reg
 */
export function replaceText(base = '', replace = '', reg = /.*/) {
    return base.replace(reg, replace);
}

export function replaceTexts(base = '', replaces = [''], reg = /.*/) {
    if (Array.isArray(replaces)) {
        for (const v of replaces) {
            base = base.replace(reg, v);
        }
    } else if (typeof replaces == "string") {
        base = base.replace(reg, replaces);
    }
    return base;
}

export function implantImage(base = '', w, h, x, y, opacity, image = '', reg = /.*/, ratio = "xMidYMid slice", rotate90 = false) {
    let replace

    if (image != null) {
        if (x === 0 && y === 0) {
            replace = `<image width="${w}" height="${h}" xlink:href="${image}"
            style="opacity: ${opacity}" preserveAspectRatio="${ratio}" vector-effect="non-scaling-stroke"/>`
        } else if (rotate90 == false) {
            replace = `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${image}"
            style="opacity: ${opacity}" preserveAspectRatio="${ratio}" vector-effect="non-scaling-stroke"/>`
        } else {
            // 注意这里 h w 是反的，因为转了 90 度
            replace = `<g transform="translate(${x} ${y}) rotate(270) translate(w)">
            <image width="${h}" height="${w}" xlink:href="${image}" 
            style="opacity: ${opacity}" preserveAspectRatio="${ratio}" vector-effect="non-scaling-stroke"/> </g>`
        }
    } else {
        return base;
    }

    return base.replace(reg, replace);
}

//如果不需要修改位置，用replaceText就行
export function implantSvgBody(base = '', x = 0, y = 0, replace = '', reg = /.*/) {
    if (x !== 0 || y !== 0) replace = `<g transform="translate(${x} ${y})">` + replace + '</g>';
    return base.replace(reg, replace);
}

//如果不需要修改位置，用replaceText就行
export function transformSvgBody(x = 0, y = 0, body = '') {
    if (x !== 0 || y !== 0) return `<g transform="translate(${x} ${y})">` + body + '</g>';
    return body;
}

export function makeSvgBodyToSvg(svgBody = '', w, h) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}">
${svgBody}
</svg>`;
}

// 数字处理并显示

/**
 * 第二版处理数字。如果要分开，请使用 rounds
 * @param number 数字
 * @param level 保留的位数，如果是负数，则是按多少位分割。正数用于小数，负数用于特别大的数
 * @param sub_level 不同的分支等级，0 无变化，-1 尽可能缩短，1 补足 7 位，2 留空格
 * @returns {string}
 */
export function round(number = 0, level = 0, sub_level = 0) {
    const r = rounds(number, level, sub_level)
    return r.integer + r.decimal
}

/**
 * 第二版处理数字
 * @param number 数字
 * @param level 保留的位数，如果是负数，则是按多少位分割。正数用于小数，decimal
 * @param sub_level 不同的分支等级，0 无变化，-1 尽可能缩短，1 补足 7 位，2 留空格，3 附加输出分好的整数部分和小数部分
 * @returns {{integer: string, decimal: string} | {integer: string, decimal: string, int: number, dec: number}}
 */
export function rounds(number = 0, level = 0, sub_level = 0) {
    if (isNotNumber(number)) return {
        integer: (number || '') + '',
        decimal: '',
    }

    let int_str = ''
    let dec_str = ''

    // 尽可能缩短
    if (sub_level === -1) {
        {
            const s0 = '0.';
            const s1 = number.toString().slice(0, 1) + '.';
            const s2 = number.toString().slice(0, 2);

            if (number < Math.pow(10, 3)) {
                int_str = Math.floor(number).toString();
            } else if (number < Math.pow(10, 4)) {
                int_str = s1;
            } else if (number < Math.pow(10, 5)) {
                int_str = s2;
            } else if (number < Math.pow(10, 6)) {
                int_str = s0;
            } else if (number < Math.pow(10, 7)) {
                int_str = s1;
            } else if (number < Math.pow(10, 8)) {
                int_str = s2;
            } else if (number < Math.pow(10, 9)) {
                int_str = s0;
            } else if (number < Math.pow(10, 10)) {
                int_str = s1;
            } else if (number < Math.pow(10, 11)) {
                int_str = s2;
            } else if (number < Math.pow(10, 12)) {
                int_str = s0;
            } else if (number < Math.pow(10, 13)) {
                int_str = s1;
            } else if (number < Math.pow(10, 14)) {
                int_str = s2;
            } else if (number < Math.pow(10, 15)) {
                int_str = s0;
            } else if (number < Math.pow(10, 16)) {
                int_str = s1;
            } else {
                int_str = Math.floor(number).toString()
            }
        }

        {
            const u = unit(number, -1);
            const s0 = Math.floor(number).toString().slice(0, 1);
            const s1 = Math.floor(number).toString().slice(1, 2);

            if (number < Math.pow(10, 3)) {
                dec_str = u;
            } else if (number < Math.pow(10, 4)) {
                dec_str = s1 + u;
            } else if (number < Math.pow(10, 5)) {
                dec_str = u;
            } else if (number < Math.pow(10, 6)) {
                dec_str = s0 + u;
            } else if (number < Math.pow(10, 7)) {
                dec_str = s1 + u;
            } else if (number < Math.pow(10, 8)) {
                dec_str = u;
            } else if (number < Math.pow(10, 9)) {
                dec_str = s0 + u;
            } else if (number < Math.pow(10, 10)) {
                dec_str = s1 + u;
            } else if (number < Math.pow(10, 11)) {
                dec_str = u;
            } else if (number < Math.pow(10, 12)) {
                dec_str = s0 + u;
            } else if (number < Math.pow(10, 13)) {
                dec_str = s1 + u;
            } else if (number < Math.pow(10, 14)) {
                dec_str = u;
            } else if (number < Math.pow(10, 15)) {
                dec_str = s0 + u;
            } else if (number < Math.pow(10, 16)) {
                dec_str = s1 + u;
            } else {
                dec_str = '';
            }
        }
    } else if (level >= 0) {
        // 3.02 -> 3 / 0.02000000004

        const u = unit(number, 0)

        while (number >= 1000 || number <= -1000) {
            number /= 1000;
        }

        const int = Math.floor(number)
        const dec = Math.round((number - int) * Math.pow(10, level)) / Math.pow(10, level)

        int_str = int.toString()
        dec_str = dec.toString().slice(2, 2 + level)

        while (dec_str.length > 0 && dec_str.charAt(dec_str.length - 1) === '0') {
            dec_str.slice(0, dec_str.length - 1)
        }

        if (dec_str.length > 0) {
            int_str += '.'
            dec_str += u
        } else {
            dec_str = u
        }
    } else {
        const str = (sub_level === 1) ? Math.floor(number).toString().padStart(7, '0') : Math.floor(number).toString()
        const times = Math.abs(level)

        let s = 0;

        if (number < Math.pow(10, times)) {
            s = Math.floor(number).toString().length
        } else if (number < Math.pow(10, 2 * times)) {
            s = -times; //5671 1234 -> 1234
        } else if (number < Math.pow(10, 3 * times)) {
            s = -2 * times; //794 5671 1234 -> 5671 1234
        } else if (number < Math.pow(10, 4 * times)) {
            s = -3 * times; //794 5671 1234 0000 -> 5671 1234 0000
        } else if (number < Math.pow(10, 5 * times)) {
            s = -4 * times;
        }

        int_str = str.slice(0, s)
        dec_str = str.slice(s)

        // 加空格
        if (sub_level === 2) {
            let space_str = "";

            for (const i in dec_str) {
                if (i % 4 == 0) {
                    space_str += " ";
                }

                space_str += dec_str.charAt(i);
            }

            dec_str = space_str
        }

    }

    if (sub_level === 3) {
        return {
            integer: int_str,
            decimal: dec_str,

            int: parseInt(int_str, 10),
            dec: parseFloat('0.' + dec_str),
        }
    } else {
        return {
            integer: int_str,
            decimal: dec_str,
        }
    }
}

/**
 * 重写了获取单位的逻辑
 * @param number 数字
 * @param pattern 种类，0 常规，-1 缩短，1 中文语境
 * @returns {string}
 */
function unit(number = 0, pattern = 0) {
    switch (pattern) {
        case 0: {
            if (number < Math.pow(10, 3)) {
                return '';
            } else if (number < Math.pow(10, 6)) {
                return 'K';
            } else if (number < Math.pow(10, 9)) {
                return 'M'; //Million
            } else if (number < Math.pow(10, 12)) {
                return 'B'; //Billion
            } else if (number < Math.pow(10, 15)) {
                return 'T'; //Trillion
            } else if (number < Math.pow(10, 18)) {
                return 'Q'; //Quadrillion
            } else if (number < Math.pow(10, 21)) {
                return 'U'; //Quintillion
            } else if (number < Math.pow(10, 24)) {
                return 'S'; //Sextillion
            } else {
                return 'Z' //Zillion 反正很多
            }
        }

        case -1: {
            if (number < Math.pow(10, 3)) { //0.1K，但是数据还没到1K的位置，就给100了
                return '';
            } else if (number < Math.pow(10, 5)) { // 1000 -> 1.0K 99 000 -> 99K 从这开始，和上面相比就要减一了
                return 'K';
            } else if (number < Math.pow(10, 8)) {
                return 'M';
            } else if (number < Math.pow(10, 11)) {
                return 'B';
            } else if (number < Math.pow(10, 14)) {
                return 'T';
            } else if (number < Math.pow(10, 17)) {
                return 'Q';
            } else if (number < Math.pow(10, 20)) {
                return 'U';
            } else if (number < Math.pow(10, 23)) {
                return 'S';
            } else {
                return 'Z'
            }
        }

        case 1: {
            if (number < Math.pow(10, 4)) {  //level==1->100 level==2->1000
                return '';
            } else if (number < Math.pow(10, 8)) {
                return 'w'; //万
            } else if (number < Math.pow(10, 12)) {
                return 'e'; //亿
            } else if (number < Math.pow(10, 16)) {
                return 'ew'; //亿万
            } else if (number < Math.pow(10, 20)) {
                return 'ee'; //亿亿
            } else {
                return ''
            }
        }

        default:
            return ''
    }
}

/**
 * @function 修整数组，太短则在前面补0，太长则卡掉前面的
 * @return {[]} 返回裁剪好的数组
 * @param arr 需要裁剪的数组
 * @param target_length 需要的数组长度
 * @param direction 如果是真，则在前面补，如果是假，则在后面补
 */
export function modifyArrayToFixedLength(arr = [0], target_length = 0, direction = true, empty_object = 0) {
    if (arr.length < target_length) {
        for (let i = (target_length - arr.length); i > 0; i--) {
            if (direction) arr.unshift(empty_object);
            else arr.push(empty_object);
        }
        return arr;

    } else {
        if (direction) return arr.slice(arr.length - target_length);
        else return arr.slice(-target_length);
    }
}

/**
 * @function 取最大值数组，太短则在前面 (false是后面) 补0，太长则取最大值，继承于DataUtil: get group 26方法
 * @return {Number[]} 返回处理好的数组
 * @param arr 需要处理的数组
 * @param target_length 需要的数组长度
 * @param direction 方向，如果是真截断前面的
 */
export function maximumArrayToFixedLength(arr = [0], target_length = 0, direction = true) {
    if (arr.length < target_length) {
        for (let i = target_length - arr.length; i > 0; i--) {
            direction ? arr.unshift(0) : arr.push(0);
        }
        return arr;

    } else {
        const steps = (arr.length - 1) / (target_length - 1);
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
 * @function 格式化游戏模式
 * @return {String} 游戏模式
 * @param mode 将被格式化的游戏模式，osu taiko catch mania
 * @param level 等级，0为不变，2为全写 osu!standard，-1为获取他们的unicode字符 \uE801，1为简写 o t m c，-2 获取他们的 mode int
 */
export function getGameMode(mode = '', level = 0, default_mode = 'default') {
    let modeStr;

    //如果是输入数字，则修改
    if (typeof mode === "number") {
        if (level === -2) return mode;
        switch (mode) {
            case -1: {
                modeStr = 'default';
                break;
            }
            case 0: {
                modeStr = 'osu';
                break;
            }
            case 1: {
                modeStr = 'taiko';
                break;
            }
            case 2: {
                modeStr = 'catch';
                break;
            }
            case 3: {
                modeStr = 'mania';
                break;
            }
            default: {
                modeStr = 'osu';
                break;
            }
        }
    } else if (typeof mode == "string") {
        modeStr = mode.toString().toLowerCase();
    } else {
        return default_mode;
    }

    if (modeStr == 'default') return default_mode;

    switch (level) {
        case -2:
            switch (modeStr) {
                case 'osu':
                    return 0;
                case 'taiko':
                    return 1;
                case 'fruits':
                    return 2;
                case 'catch':
                    return 2; //我怀疑现在的接水果给的不是fruits
                case 'mania':
                    return 3;
                default:
                    return 0;
            }
            break;
        case -1:
            switch (modeStr) {
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
                default:
                    return '';
            }
            break;
        case 1:
            switch (modeStr) {
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
                default:
                    return '?';
            }
            break;
        case 2:
            switch (modeStr) {
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
                default:
                    return 'default';
            }
            break;
        default:
            return modeStr;
    }
}

/**
 * @function 拆分svg头尾，只保留身体，方便插入
 */
export function getSVGBody(V3Path = '') {
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
 * 获取谱面状态的英文
 * @param ranked
 * @param {number} ranked 谱面状态，是那个数字
 */

export function getMapStatus(ranked = 0) {
    switch (ranked) {
        case -2:
            return 'Graveyard';
        case -1:
            return 'WIP';
        case 0:
            return 'Pending';
        case 1:
            return 'Ranked';
        case 2:
            return 'Approved';
        case 3:
            return 'Qualified';
        case 4:
            return 'Loved';
        default:
            return '';
    }
}

/**
 * @function 获取谱面状态的路径
 * @param {number, String} status 谱面状态，可以是数字可以是字符串
 */
export function getMapStatusImage(status = 0) {
    let path = '';

    if (typeof status === 'number') {
        switch (status) {
            case -2:
                path = 'object-beatmap-unranked.png';
                break; //graveyarded
            case -1:
                path = 'object-beatmap-unranked.png';
                break; //wip也在这里
            case 0:
                path = 'object-beatmap-unranked.png';
                break; //pending在这里
            case 1:
                path = 'object-beatmap-ranked.png';
                break;
            case 2:
                path = 'object-beatmap-ranked.png';
                break; //approved在这里
            case 3:
                path = 'object-beatmap-qualified.png';
                break;
            case 4:
                path = 'object-beatmap-loved.png';
                break;
            default:
                path = 'error.png';
                break;
        }
    } else {
        switch (status.toLowerCase()) {
            case "ranked":
            case "approved":
                path = 'object-beatmap-ranked.png';
                break;
            case "qualified":
                path = 'object-beatmap-qualified.png';
                break;
            case "loved":
                path = 'object-beatmap-loved.png';
                break;
            case "":
                path = 'error.png';
                break;
            default:
                path = 'object-beatmap-unranked.png';
                break;
        }
    }

    return getImageFromV3(path);
}

//获取现在的时间 (UTC+8)
export function getNowTimeStamp() {
    return moment().format("YYYY-MM-DD HH:mm:ss[ +8]");
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
 * @param text 输入比赛名字
 */
export function getMatchNameSplitted(text = '') {

    if (isNull(text)) return {
        name: '',
        team1: '',
        team2: '',
    }

    const reg = /(?<name>[^:：]*)?[:：]\s*([(（]?(?<team1>[^()（）]*)[)）]?)?\s*[Vv][Ss]\s*([(（]?(?<team2>[^()（）]*)[)）])?/

    const capture_groups = reg.exec(text)?.groups

    const name = capture_groups?.name || ''
    const team1 = capture_groups?.team1 || ''
    const team2 = capture_groups?.team2 || ''

    //转换失败的保底机制
    if (isEmptyString(team1) || isEmptyString(team2)) {
        return {
            name: requireNonNullElse(text, ''),
            team1: '',
            team2: '',
        }
    } else return {
        name: requireNonNullElse(name, ''),
        team1: requireNonNullElse(team1, ''),
        team2: requireNonNullElse(team2, ''),
    }
}

export function binary2Base64Text(buffer) {
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
            let path = this.f_util.save(await exportJPEG(svg.getSvgText()));
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
            out = await exportJPEG(this.svg);
            this.f_util.remove();
        }
        return out;
    }
}

function fixed(i) {
    return parseFloat(i.toFixed(2));
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

export async function getFlagPath(code = "cn", x, y, h = 30) {
    if (typeof code != 'string') return '';

    //避免腾讯封掉青天白日旗
    const image = getImageFromV3('flag-TW.png')
    if (code.toLowerCase() == "tw") {
        if (fs.existsSync(image)) {
            return `<g transform="translate(${x - 2}, ${y + 4 + 2})"><image width="${(h - 4) * 1.5}" height="${(h - 4)}" xlink:href="${image}"
            style="opacity: 1" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/></g>`
        } else {
            code = "cn"
        }
    }

    const svg = await getFlagSvg(code);
    const len = svg.length;
    const scale = h / 30;
    return `<g transform="translate(${x} ${y}) scale(${scale})">` + svg.substring(60, len - 6) + '</g>';
}

/**
 * 获取时间差
 * @param compare
 * @param format
 * @param now 这个时间是 UTC 时间。如果你输入的时间已经是本地时间（北京时间），这里需要输入 moment();
 * @return {string}
 */

export function getTimeDifference(compare = '', format = 'YYYY-MM-DD[T]HH:mm:ss[Z]', now = moment().subtract(8, "hours")) {
    const compare_moment = moment(compare, format);

    if (compare_moment == null) return '-';

    const years = compare_moment.diff(now, "years");
    const months = compare_moment.diff(now, "months");
    const days = compare_moment.diff(now, "days");
    const hours = compare_moment.diff(now, "hours");
    const minutes = compare_moment.diff(now, "minutes");

    if (Math.abs(years) > 0) {
        return years + 'y';
    } else if (Math.abs(months) > 0) {
        return months + 'mo';
    } else if (Math.abs(days) > 0) {
        return days + 'd';
    } else if (Math.abs(hours) > 0) {
        return hours + 'h';
    } else if (Math.abs(minutes) > 0) {
        return minutes + 'm';
    } else {
        return 'now';
    }
}

export const getTime = (seconds = 0) => {
    const m = Math.floor(seconds / 60).toString()
    const s = (seconds % 60).toString().padStart(2, '0')
    return m + ':' + s
}

/**
 * 获取从秒转换成dhms的时间，如果要获取 分:秒 的格式，请使用 getTime
 * @param seconds 秒
 * @return {string} 时间字符串，比如 3d5h20m 只有到 minute 的等级时才会有 s
 */
export const getTimeByDHMS = (seconds = 0, has_whitespace = false) => {
    return _getTimeByDHMS(seconds, has_whitespace).b + _getTimeByDHMS(seconds, has_whitespace).m
}

//获取从秒转换成dhms的时间
export const getTimeByDHMSLarge = (seconds = 0, has_whitespace) => {
    return _getTimeByDHMS(seconds, has_whitespace).b
}

//获取从秒转换成dhms的时间
export const getTimeByDHMSSmall = (seconds = 0, has_whitespace) => {
    return _getTimeByDHMS(seconds, has_whitespace).m
}

//获取从秒转换成dhms的时间
const _getTimeByDHMS = (seconds = 0, has_whitespace = false) => {
    let pt_b = '-';
    let pt_m = '';
    if (seconds != null && seconds > 0) {
        const s = Math.abs(seconds);

        const days = Math.floor(s / 86400);
        const hours = Math.floor((s % 86400) / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const sec = s % 60;

        if (has_whitespace) {
            if (days > 0) {
                pt_b = days.toString();
                pt_m = 'd ' + hours + 'h ' + minutes + 'm';
            } else if (hours > 0) {
                pt_b = hours.toString();
                pt_m = 'h ' + minutes + 'm';
            } else if (minutes > 0) {
                pt_b = minutes.toString();
                pt_m = 'm ' + sec + 's';
            } else if (sec > 0) {
                pt_b = sec.toString();
                pt_m = 's';
            } else if (hours > -1) {
                pt_b = '0';
                pt_m = 's';
            } else {
                pt_b = '-';
                pt_m = '';
            }
        } else {
            if (days > 0) {
                pt_b = days.toString();
                pt_m = 'd' + hours + 'h' + minutes + 'm';
            } else if (hours > 0) {
                pt_b = hours.toString();
                pt_m = 'h' + minutes + 'm';
            } else if (minutes > 0) {
                pt_b = minutes.toString();
                pt_m = 'm' + sec + 's';
            } else if (sec > 0) {
                pt_b = sec.toString();
                pt_m = 's';
            } else if (hours > -1) {
                pt_b = '0';
                pt_m = 's';
            } else {
                pt_b = '-';
                pt_m = '';
            }
        }

    }

    return {
        b: pt_b,
        m: pt_m,
    }
}

/**
 * 公用方法：获取面板高度
 * @param cardCount 卡片数量
 * @param cardHeight 卡片高度
 * @param cardPerRow 每行卡片数量，2，4
 * @param bannerHeight banner 高度 290
 * @param interval 卡片之间的距离，一般是 40
 * @param spacing 卡片区域上下的距离，一般是 40
 * @return {number}
 */
export const getPanelHeight = (cardCount = 0, cardHeight = 110, cardPerRow = 2, bannerHeight = 330, interval = 40, spacing = 40) => {
    if (cardPerRow == 0) return (bannerHeight + spacing);
    const row = Math.ceil((cardCount || 0) / cardPerRow);

    if (row >= 0) {
        return (bannerHeight + 2 * spacing) + (cardHeight + interval) * row - interval;
    } else {
        return 1080;
    }
}

//公用方法：给面板上名字
export function getPanelNameSVG(name = '?? (!test)', index = '?', version = 'v0.0.0 Dev', request_time = 'request time: ' + getNowTimeStamp(), powered = 'Yumubot') {

    // powered by Yumubot v0.5.0 DX // Score (!ymp / !ymr / !yms)
    const powered_text = torus.getTextPath(
        "powered by " + powered.toString() + " " + version.toString() + " \/\/ " + name.toString(),
        20, 26.84, 24, "left baseline", "#fff");
    const request_time_text = torus.getTextPath(request_time.toString(),
        1900, 26.84, 24, "right baseline", "#fff");
    const index_text = torus.getTextPath(index.toString(),
        607.5, 83.67, 48, "center baseline", "#fff");

    //导入文字
    return (powered_text + '\n' + request_time_text + '\n' + index_text);
}

// 公用方法：获取比赛的时间和状态，用于右上角。这里的时间戳不需要 .add(8, 'hours')
export function getMatchDuration(match) {
    const start = moment(match?.match?.start_time, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours');
    const end = moment(match?.match?.end_time, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours');

    let str;

    if (match?.is_match_end) {
        let delta = '';
        if (start.days() != end.days()) {
            delta = '(+' + end.diff(start, 'days') + 'days)';
        }

        str = start.format('YYYY/MM/DD HH:mm') + ' - ' + end.format('HH:mm') + delta;
    } else {
        str = start.format('YYYY/MM/DD HH:mm') + ' - in progress';
    }

    return str;
}

/**
 * @param svg
 * @param reg_banner
 * @param {string?} custom
 */
export function putCustomBanner(svg, reg_banner, custom, custom_opacity = 0.8) {
    if (custom) {
        return implantImage(svg, 1920, 320, 0, 0, custom_opacity, custom, reg_banner);
    } else {
        return implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    }
}

export const cs2px = (cs, mode = 'o') => {
    switch (mode) {
        case 'o': {
            const osupixel = (54.4 - 4.48 * cs).toFixed(2);
            if (osupixel.substr(-3) === '.00') return osupixel.slice(0, -3) + 'px';
            if (osupixel.substr(-2) === '.0') return osupixel.slice(0, -2) + 'px';
            else return osupixel + 'px';
        }
        case 'm': {
            return cs.toFixed(0) + ' Keys'
        }
        default: {
            return '-';
        }
    }
}

export const ar2ms = (ar, mode = 'o') => {
    switch (mode) {
        case 'o':
        case 'c': {
            if (ar > 5) {
                if (ar > 11) return '300ms';
                else return Math.floor(1200 - (150 * (ar - 5))) + 'ms';
            } else {
                return Math.floor(1800 - (120 * ar)) + 'ms';
            }
        }
        default: {
            return '-'
        }
    }
}

export const od2ms = (od, mode = 'o') => {
    let ms;
    switch (mode) {
        case 'o': {
            if (od > 11) return '14ms';
            ms = Math.floor(80 - (6 * od)).toString();
            break;
        }
        case 't': {
            if (od > 10) return '17ms';
            ms = Math.floor(50 - (3 * od)).toString();
            break;
        }
        case 'c': {
            return '-';
        }
        case 'm': {
            if (od > 11) return '31ms';
            if (od < 0) return '64ms';
            ms = Math.floor(64 - (3 * od)).toString();
            break;
        }
        default: {
            ms = '0';
        }
    }
    if (ms.substr(-3) === '.00') return ms.slice(0, -3) + 'ms';
    if (ms.substr(-2) === '.0') return ms.slice(0, -2) + 'ms';
    else return ms + 'ms';
}

// 添加 key 数
export function getDifficultyName(beatmap) {
    let difficulty_text = (beatmap?.version || '').toString()

    if (beatmap?.mode_int === 3) {
        const pattern = /^\[\d+K].*/g

        if (pattern.test(difficulty_text) === false) {
            const key = Math.round(beatmap.cs)
            const remove_pattern = new RegExp("\\s*" + key + "K\\s*", "g");

            difficulty_text = '[' + key + 'K] ' + difficulty_text.replace(remove_pattern, ' ').trim()
        }
    }

    return difficulty_text
}

export function compileTemplate(path) {
    const template = readTemplate(path);
    const fnBody = "return `" + template.replace(/`/g, '\\`') + "`;";
    return new Function("obj", fnBody);
}
