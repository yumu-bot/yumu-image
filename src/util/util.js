import fs from 'fs';
import os from "os";
import crypto from 'crypto';
import axios from "axios";
// import exportsJPEG from 'convert-svg-to-jpeg';
// import exportsPNG from 'convert-svg-to-png';
import https from "https";
import path from "path";
import moment from "moment";
import {torus} from "./font.js";
import {getModInt, hasMod} from "./mod.js";
import {API} from "../svg-to-image/API.js";
import JPEGProvider from '../svg-to-image/JPEGProvider.js';
import PNGProvider from '../svg-to-image/PNGProvider.js';

const exportsJPEG = new API(new JPEGProvider());
const exportsPNG = new API(new PNGProvider());

const path_util = path;
const MD5 = crypto.createHash("md5");
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
        } else if (error.code === 'ECONNABORTED' && config.__errTime <= config.retry) {
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
        console.error("request err", config);
        return Promise.reject(error);
    })
    fs.access(CACHE_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    fs.access(OSU_BUFFER_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    fs.access(FLAG_PATH, fs.constants.F_OK, (e) => !e || fs.mkdirSync(e.path, {recursive: true}));
    console.log("缓存目录: ", CACHE_PATH);
    console.log("图像缓存", IMG_BUFFER_PATH);
    console.log("osu文件缓存", OSU_BUFFER_PATH);

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

export function readImage(path = '') {
    try {
        return fs.readFileSync(path, 'binary');
    } catch (e) {
        return undefined;
    }
}

export function readExportFileV3(path = '') {
    return fs.readFileSync(path_util.join(EXPORT_FILE_V3, path), 'binary');
}

export function getExportFileV3Path(path = '') {
    return path_util.join(EXPORT_FILE_V3, path);
}

/**
 * @function 获得难度背景
 * @param {number} bid bid
 * @param {number} sid sid
 */
export async function getDiffBG(bid, sid, cover = 'cover@2x', reload = true, defaultImagePath = getExportFileV3Path('card-default.png')) {
    try {
        const res = await axios.get(`http://127.0.0.1:47150/api/file/local/bg/${bid}`, {
            proxy: {},
            headers: {
                "SET_ID": sid,
                "AuthorizationX": SUPER_KEY,
            }
        });
        // data 为背景文件在文件系统中的绝对路径 字符串
        // 不是文件本身
        const data = res.data;
        if (data) return data;
    } catch (e) {
        return await getMapBG(sid, cover, reload, defaultImagePath);
    } finally {
        // 向服务器提交异步任务
        axios.get(`http://127.0.0.1:47150/api/file/local/async/${bid}`, {
            proxy: {},
            headers: {
                "SET_ID": sid,
                "AuthorizationX": SUPER_KEY,
            }
        }).catch(_ => {
        })
    }
}

/**
 * @param {number} sid
 * @param {string} [cover]
 * @param {boolean} [reload] 是否强制更新
 * @param {string} [defaultImagePath] 出现错误时返回的失败图
 * @return {Promise<string>} 返回位于文件系统的绝对路径
 */
export async function getMapBG(sid = 0, cover = 'cover@2x', reload = true, defaultImagePath = getExportFileV3Path('card-default.png')) {
    return await readNetImage('https://assets.ppy.sh/beatmaps/' + sid + '/covers/' + cover + '.jpg', reload, defaultImagePath);
}

export async function getAvatar(uid = 0, reload = true, defaultImagePath = getExportFileV3Path('avatar-guest.png')) {
    return await readNetImage('https://a.ppy.sh/' + uid, reload, defaultImagePath);
}

/**
 * 下载文件, 并且位于文件系统的绝对路径
 * @return {Promise<string>} 位于文件系统的绝对路径
 */
export async function readNetImage(path = '', reload = true, defaultImagePath = getExportFileV3Path('beatmap-DLfailBG.jpg')) {
    const error = getExportFileV3Path('error.png');

    if (!path || !path.startsWith("http")) {
        return readImage(path);
    }
    const bufferName = MD5.copy().update(path).digest('hex');
    const bufferPath = `${IMG_BUFFER_PATH}/${bufferName}`;

    try {
        if (!reload) {
            fs.accessSync(bufferPath, fs.constants.F_OK);
            if (fs.statSync(bufferPath).size <= 4 * 1024) {
                throw Error("size err");
            }
            return bufferPath;
        }
    } catch (e) {
        reload = true;
    }
    let req;
    let data;

    if (reload) {
        try {
            req = await axios.get(path, {responseType: 'arraybuffer'});
            data = req.data;
        } catch (e) {
            console.error("download error", e);
            return defaultImagePath || error;
        }
    }

    if (req && req.status === 200) {
        fs.writeFileSync(bufferPath, data, 'binary');
        return bufferPath;
    } else {
        return defaultImagePath || error;
    }
}


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

export function implantImage(base = '', w, h, x, y, opacity, image = '', reg = /.*/) {
    if (image != null) {
        if (x === 0 && y === 0) {
            const replace = `<image width="${w}" height="${h}" xlink:href="${image}" style="opacity: ${opacity};" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>`
            return base.replace(reg, replace);
        } else {
            const replace = `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${image}" style="opacity: ${opacity};" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>`
            return base.replace(reg, replace);
        }
    } else {
        return base;
    }
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
 * @function 数字处理（去掉数字尾巴的0000
 * @return {String} 返回处理好的字符串
 * @param number 数字
 */
export function getRoundedTailNumber(number = 0) {
    const numberStr = (number !== null) ? number.toString() : '';

    for (let i = 0; i < numberStr.length; i++) {

    }

    if (numberStr.substr(-3) === '.00') return numberStr.slice(0, -3);
    if (numberStr.substr(-2) === '.0') return numberStr.slice(0, -2);
}


/**
 * @function 数字处理（缩进数字，与主bot的DataUtil - getRoundedNumberStr效果一样
 * @return {String} 返回小数字的字符串
 * @param number 数字
 * @param level 等级，现在支持lv -1, 0, 1, 2, 3, 4 注意配套使用
 * lv5是保留两位数，但是是为了比赛特殊设置的，进位使用了万-亿的设置
 * lv4是保留四位数 945671 -> 945.6710K
 * lv3是保留两位数,945671 -> 945.67K
 * lv2是保留一位数
 * lv1是保留一位数且尽可能缩短,0-999-1.0K-99K-0.1M-99M
 * lv0是只把前四位数放大，且不补足，无单位 7945671 -> 794 5671, 12450 -> 1 2450
 * lv-1是只把前四位数放大，且补足到7位，无单位 7945671 -> 794 5671, 12450 -> 001 2450 0 -> 0000000
 */
export function getRoundedNumberStr(number = 0, level = 0, level2 = level) {
    if (typeof number === 'number') return getRoundedNumberLargerStr(number, level) + getRoundedNumberSmallerStr(number, level2);
    else return '0';
}

/**
 * @function 数字处理（大数字）（缩进数字，与主bot的DataUtil - getRoundedNumberStr效果一样
 * @return {String} 返回大数字的字符串
 * @param number 数字
 * @param level 等级，现在支持lv -1, 0, 1, 2, 3, 4 注意配套使用
 */
export function getRoundedNumberLargerStr(number = 0, level = 0) {

    switch (level) {
        case -1:
            return f_1();
            break;
        case 0:
            return f0();
            break;
        case 1:
            return f1();
            break;
        case 2:
        case 3:
        case 4:
            return f2_4();
            break;
        case 5:
            return f5();
            break;
    }

    function f_1() {
        if (number <= Math.pow(10, 7)) {
            return number.toString().padStart(7, '0').slice(0, -4);// 4 5671 -> 004

        } else {
            return SpecialRoundedLargeNum(number);
        }
    }

    function f0() {
        if (number <= Math.pow(10, 4)) {
            return Math.floor(number).toString()

        } else {
            return SpecialRoundedLargeNum(number);
        }
    }


    function f1() {
        let o;
        let s0 = '0.';
        let s1 = number.toString().slice(0, 1) + '.';
        let s2 = number.toString().slice(0, 2);

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
        return o;
    }

    //旧 level
    function f2_4() {
        while (Math.abs(number) >= 1000) {
            number /= 1000;
        }

        //如果小数太小，可不要小数点
        let o;
        let b = 0.1;//boundary
        if (level === 3) b = 0.01;
        if (level === 4) b = 0.0001;
        if (Math.abs(number - Math.floor(number)) >= b) {
            o = Math.floor(number).toString() + '.';
        } else {
            o = Math.floor(number).toString();
        }
        return o;
    }

    function f5() {
        while (Math.abs(number) >= 10000) {
            number /= 10000;
        }

        //如果小数太小，可不要小数点
        let o;
        if (Math.abs(number - Math.floor(number)) >= 0.01) {
            o = Math.floor(number).toString() + '.';
        } else {
            o = Math.floor(number).toString();
        }
        return o;
    }

    function SpecialRoundedLargeNum(number) {
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

}

/**
 * @function 数字处理（小数字）（缩进数字，与主bot的DataUtil - getRoundedNumberStr效果一样
 * @return {String} 返回小数字的字符串
 * @param number 数字
 * @param level 等级，现在支持lv -1, 0, 1, 2, 3, 4, 5 注意配套使用
 */
export function getRoundedNumberSmallerStr(number = 0, level = 0) {

    switch (level) {
        case -1:
            return f_1();
            break;
        case 0:
            return f0();
            break;
        case 1:
            return f1();
            break;
        case 2:
        case 3:
        case 4:
            return f2_4();
            break;
        case 5:
            return f5();
            break;
    }

    function f_1() {
        if (number <= Math.pow(10, 4)) {
            return number.toString().padStart(4, '0');// 000 0671 -> 0671
        } else {
            return SpecialRoundedSmallNum(number);
        }
    }

    function f0() {
        if (number <= Math.pow(10, 4)) {
            return ''
        } else {
            return SpecialRoundedSmallNum(number);
        }
    }

    function f1() {
        let o;
        let unit = getRoundedNumberUnit(number, level);
        let s0 = Math.floor(number).toString().slice(0, 1);
        let s1 = Math.floor(number).toString().slice(1, 2);

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
        return o;
    }

    //旧 level

    function f2_4() {
        let o;
        let unit = getRoundedNumberUnit(number, level);
        while (number >= 1000 || number <= -1000) {
            number /= 1000;
        }
        let numStr = number.toString();

        if (numStr.indexOf('.') === -1) {
            return unit;
        } else {
            switch (level) {
                case 2:
                    o = numStr.slice(numStr.indexOf('.') + 1, numStr.indexOf('.') + 2);
                    break;
                case 3:
                    o = numStr.slice(numStr.indexOf('.') + 1, numStr.indexOf('.') + 3);
                    break;
                case 4:
                    o = numStr.slice(numStr.indexOf('.') + 1, numStr.indexOf('.') + 5);
                    break;
            }

            if (parseInt(o) !== 0) {
                return o + unit;
            } else {
                return unit;
            }
            ;
        }
    }

    function f5() {
        let o;
        let unit = getRoundedNumberUnit(number, level);
        while (number >= 10000 || number <= -10000) {
            number /= 10000;
        }
        let numStr = number.toString();

        if (numStr.indexOf('.') === -1) {
            return unit;
        } else {
            o = numStr.slice(numStr.indexOf('.') + 1, numStr.indexOf('.') + 3);
        }

        if (o === '00') o = '';
        if (o.substring(1) === '0') o = o.slice(0, 1);

        return o + unit;
    }

    function SpecialRoundedSmallNum(number) {
        let s = 0;
        let o;

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
}

//只给 level 1, 2, 3, 4 提供单位
function getRoundedNumberUnit(number = 0, level = 0) {
    let unit;
    let m = 3;

    switch (level) {
        case 1:
            return f1();
            break;
        case 2:
        case 3:
        case 4:
            return f2_4();
            break;
        case 5:
            return f5();
            break;
    }

    function f2_4() {

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
        return unit;
    }

    function f1() {

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
        return unit;
    }

    function f5() {

        if (number < Math.pow(10, 4)) {  //level==1->100 level==2->1000
            unit = '';
        } else if (number < Math.pow(10, 8)) {
            unit = 'w';
        } else if (number < Math.pow(10, 12)) {
            unit = 'e';
        } else if (number < Math.pow(10, 16)) {
            unit = 'T';
        } else if (number < Math.pow(10, 20)) {
            unit = 'j';
        } else {
            unit = ''
        }
        return unit;
    }
}

/*
export function getV3Score(v1score = 0, acc = 0.0, combo = 1, maxcombo = 1, mods = [''], gamemode = 'osu') {

    let score = 1000000;
    let mode = getGameMode(gamemode, 1);
    let modBonus = [];
    let bonus = 1;
    let comboRate = 0.7;
    let accRate = 0.3;
    let accIndex = 10;

    switch (mode) {
        case 'o' : {
            modBonus = ModBonusSTD;
            comboRate = 0.7;
            accRate = 0.3;
            accIndex = 3.6;
        }
            break;
        case 't' : {
            modBonus = ModBonusTAIKO;
            comboRate = 0.25;
            accRate = 0.75;
            accIndex = 3.6;
        }
            break;
        case 'c' : { //实现没做好，暂时使用 std 的方案
            modBonus = ModBonusCATCH;
            comboRate = 0.7;
            accRate = 0.3;
            accIndex = 3.6;
        }
            break;
        case 'm' : { //骂娘不需要转换

            //modBonus = ModBonusMANIA;
            //comboRate = 0.01;
            //accRate = 0.99;
            //accIndex = 10;


            return v1score;
        }
            break;
    }

    for (const v of mods) {
        bonus *= modBonus[v];
    }

    let comboScore = comboRate * (combo / Math.max(maxcombo, 1));
    let accScore = accRate * Math.pow(acc, accIndex);

    return Math.floor(score * bonus * (comboScore + accScore));

}
*/

//色彩管理。或许开个 color util 会更好？=====================================================================================


/**
 * @function 预处理星数（或其他小数）成想要的部分。不止星数！
 * @return 返回 8, 0.34, 8., 34。前两个是数据，后两个是字符串
 * @param number 小数
 * @param whichData 要哪个数据？可输入0-4，分别是0整数、1小数、2整数带小数点部分、3纯小数部分（两位以下，4纯小数部分（一位以下
 */
export function getDecimals(number = 0, whichData = 0) {

    //去除小数，保留两位
    let sr = (Math.round(number * 100) / 100) || 0;

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
 * @function 修整数组，太短则在前面补0，太长则卡掉前面的
 * @return {Number[]} 返回裁剪好的数组
 * @param arr 需要裁剪的数组
 * @param target_length 需要的数组长度
 * @param direction 如果是真，则在前面补，如果是假，则在后面补
 */
export function modifyArrayToFixedLength(arr = [0], target_length = 0, direction = true) {
    if (arr.length < target_length) {
        for (let i = (target_length - arr.length); i > 0; i--) {
            if (direction) arr.unshift(0);
            else arr.push(0);
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
export function getGameMode(mode = '', level = 0) {
    let modeStr = 'default';

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
    } else if (mode !== '') {
        modeStr = (mode + '').toLowerCase();
    }

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
 * @function 获取谱面状态的路径
 * @param {number} status 谱面状态，可以是数字可以是字符串
 */
export function getMapStatusV3Path(status = 0) {
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

    return getExportFileV3Path(path);
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

    //转换失败的保底机制
    if (name === '' || team1 === '' || team2 === '') name = text;
    out.push(name, team1, team2)
    return out;
}

export function base64Text2PngStr(buffer) {
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

    const svg = await getFlagSvg(code);
    const len = svg.length;
    const scale = h / 30;
    return `<g transform="translate(${x} ${y}) scale(${scale})">` + svg.substring(60, len - 6) + '</g>';
}

//获取时间差
export function getTimeDifference(compare = '', format = 'YYYY-MM-DD[T]HH:mm:ss[Z]', now = moment()) {
    const compare_moment = moment(compare, format).add(8, "hours");

    if (!compare_moment) return '-';

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

//公用方法：给面板上名字
export function getPanelNameSVG(name = '?? (!test)', index = '?', version = 'v0.0.0 Dev', request_time = 'request time: ' + getNowTimeStamp(), powered = 'Yumubot') {

    // powered by Yumubot v0.3.2 EA // Score (!ymp / !ymr / !yms)
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

//SS和X的转换
export const rankSS2X = (rank = 'SS') => {
    switch (rank) {
        case "SS": return 'X';
        case "SSH": return 'XH';
        default: return rank;
    }
}

export const getApproximateRank = (score = {
    statistics: {
        count_50: 0,
        count_100: 0,
        count_300: 0,
        count_geki: 0,
        count_katu: 0,
        count_miss: 0
    },
    mode: 'osu',
    mods: ['']
}, showF = false) => {
    if (score.rank === 'F' && showF) return 'F';

    let rank = 'F';
    let nTotal;

    const n300 = score.statistics.count_300;
    const n100 = score.statistics.count_100;
    const n50 = score.statistics.count_50;
    const n0 = score.statistics.count_miss;
    const nG = score.statistics.count_geki;
    const nK = score.statistics.count_katu;
    const acc = score.accuracy;
    const hasMiss = (n0 > 0);

    switch (getGameMode(score.mode, 1)) {
        case 'o' : {
            nTotal = n300 + n100 + n50 + n0;

            const is50over1p = (n50 / nTotal > 0.01);

            if (n300 === nTotal) {
                rank = 'SS';
            } else if (n300 / nTotal >= 0.9) {
                rank = hasMiss ? 'A' : (is50over1p ? 'A' : 'S');
            } else if (n300 / nTotal >= 0.8) {
                rank = hasMiss ? 'B' : 'A';
            } else if (n300 / nTotal >= 0.7) {
                rank = hasMiss ? 'C' : 'B';
            } else if (n300 / nTotal >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
            break;

        case 't' : {
            nTotal = n300 + n100 + n0;

            if (n300 === nTotal) {
                rank = 'SS';
            } else if (n300 / nTotal >= 0.9) {
                rank = hasMiss ? 'A' : 'S';
            } else if (n300 / nTotal >= 0.8) {
                rank = hasMiss ? 'B' : 'A';
            } else if (n300 / nTotal >= 0.7) {
                rank = hasMiss ? 'C' : 'B';
            } else if (n300 / nTotal >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
            break;

        case 'c' : {
            const alt_acc = acc || (n300 + n100 + n50) / (n300 + n100 + n50 + nK + n0);

            if (acc === 1) {
                rank = 'SS';
            } else if (alt_acc > 0.98) {
                rank = 'S';
            } else if (alt_acc > 0.94) {
                rank = 'A';
            } else if (alt_acc > 0.90) {
                rank = 'B';
            } else if (alt_acc > 0.85) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
            break;

        case 'm' : {
            const alt_acc = acc || (nG + n300 + nK * 2/3 + n100 * 1/3 + n50 * 1/6) / (nG + n300 + n100 + n50 + nK + n0);

            if (alt_acc === 1) {
                rank = 'SS';
            } else if (alt_acc >= 0.95) {
                rank = 'S';
            } else if (alt_acc >= 0.90) {
                rank = 'A';
            } else if (alt_acc >= 0.80) {
                rank = 'B';
            } else if (alt_acc >= 0.70) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
            break;
    }

    const isSilver = hasMod(getModInt(score.mods), 'HD') || hasMod(getModInt(score.mods), 'FL');
    if ((rank === 'SS' || rank === 'S') && isSilver) rank += 'H';

    return rank;
}

//根据谱面的上架状态决定谱面文件和背景是否需要缓存
export const isReload = (ranked = 0) => {
    return !(ranked && (ranked === 1 || ranked === 2 || ranked === 4
        || ranked === 'ranked' || ranked === 'approved' || ranked === 'loved'
    )); //ranked, approved, loved
}