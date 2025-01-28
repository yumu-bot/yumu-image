import moment from "moment";
import {getImageFromV3} from "./util.js";

const mascot_pic_sum_arr = [79, 35, 7, 5, 14, 1, 3, 5, 5, 7]; //吉祥物的对应的照片数量，和随机banner一样的
const mascot_transparency_sum_arr = [2, 1, 0, 0, 1, 0, 0, 1, 0, 1];
const defaultBannerTotal = 170; //默认 banner 数量
const maimaiBannerTotal = 30; //maimai banner 数量
const mascotBGTotal = 13; //吉祥物 BG 数量


/**
 * @function 随机提供游戏模式对应的吉祥物名字
 * @return {String} 返回吉祥物名字
 * @param mode 游戏模式，'osu' 'taiko' 等
 */
export function getMascotName(mode = 'osu') {
    mode = mode.toLowerCase();

    // pippi, Mocha, Aiko, Alisa, Chirou, Tama, Taikonator, Yuzu, Mani, Mari
    const arr = mascot_pic_sum_arr;

    const t_sum = arr[1] + arr[2] + arr[3] + arr[4] + arr[5] + arr[6];
    const m_sum = arr[8] + arr[9];

    const t_rand = getRandom(t_sum);
    const m_rand = getRandom(m_sum);

    let t = 1;
    let m = 8;

    let sum = 0;

    for (let i = 1; i <= 6; i++) {
        sum += arr[i];

        if (t_rand <= sum) {
            t = i;
            break;
        }
    }

    sum = 0;

    for (let i = 8; i <= 9; i++) {
        sum += arr[i];

        if (m_rand <= sum) {
            m = i;
            break;
        }
    }

    switch (mode) {
        case 'osu':
            return 'pippi';
        case 'taiko': {
            switch (t) {
                case 1 :
                    return 'Mocha';
                case 2 :
                    return 'Aiko';
                case 3 :
                    return 'Alisa';
                case 4 :
                    return 'Chirou';
                case 5 :
                    return 'Tama';
                case 6 :
                    return 'Taikonator';
                default :
                    return 'Mocha';
            }
        }
        case 'fruits':
        case 'catch':
            return 'Yuzu';
        case 'mania': {
            switch (m) {
                case 8 :
                    return 'Mani';
                case 9 :
                    return 'Mari';
            }
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
            i = 9;
            break;
    }
    path = getRandom(Math.max(1, mascot_pic_sum_arr[i]));

    return getImageFromV3('Mascots', `${mascotname}_${path}.png`);
}

/**
 * @function 获取随机的头图路径
 * @return {String} 返回横幅路径
 */
export function getRandomBannerPath(type = "default", index = 0) {
    if (moment().isBefore(moment("2025/02/01 00:00", "YYYY/MM/DD HH:mm"))) {
        return getImageFromV3('Banner', 'a2.png');
    }

    if (type === "maimai") {
        const i = index || getRandom(maimaiBannerTotal)
        return getImageFromV3('Banner', `d${i}.png`);
    } else {
        const i = index || getRandom(defaultBannerTotal)
        return getImageFromV3('Banner', `b${i}.png`);
    }

}

/**
 * @function 获取随机的吉祥物背景路径
 * @return {String} 返回吉祥物背景路径
 */
export function getRandomMascotBGPath() {
    const i = getRandom(mascotBGTotal)
    return getImageFromV3('Background', `${i}.png`);
}

/**
 * @function 获取随机的吉祥物看板
 * @return {String} 返回吉祥物看板路径
 */
export function getRandomMascotTransparentPath(mascot_name = 'pippi') {
    let i;
    let path;

    let name = mascot_name

    switch (mascot_name) {
        case 'pippi':
            i = 0;
            break;
        case 'Mocha':
            i = 1;
            break;
        case 'Aiko':
            i = 1;
            name = 'Mocha'
            break;
        case 'Alisa':
            i = 1;
            name = 'Mocha'
            break;
        case 'Chirou':
            i = 4;
            break;
        case 'Tama':
            i = 4;
            name = 'Chirou'
            break;
        case 'Taikonator':
            i = 4;
            name = 'Chirou'
            break;
        case 'Yuzu':
            i = 7;
            break;
        case 'Mani':
            i = 9;
            name = 'Mari'
            break;
        case 'Mari':
            i = 9;
            break;
    }
    path = getRandom(Math.max(1, mascot_transparency_sum_arr[i]));

    return getImageFromV3('Mascots', 'Transparent', `${name}_${path}.png`)
}

//通过 PP 获取玩家颜色（的背景图！pp2Rank，最后一个是默认的
export function pp2UserBG(pp = 0, boundary = [], ranks = []) {
    if (boundary == null || boundary.length < 8) boundary = [15000, 10000, 8000, 6000, 4000, 3000, 2000, 1000]
    if (ranks == null || ranks.length < 8) ranks = ['PF', 'X', 'XH', 'S', 'A', 'B', 'C', 'D']

    let rank = 'F';

    for (let i = 0; i < 8; i++) {
        const b = boundary[i];

        if (pp >= b) {
            rank = ranks[i];
            break;
        }
    }

    return getImageFromV3(`object-score-backimage-${rank}.jpg`);
}

//获取一个1到目标数的随机整数。如果range小于1，则返回0-1的随机小数。
export function getRandom(range = 0) {
    if (range > 1) {
        return Math.round((- Math.random() + 1) * (range - 1)) + 1
        //return Math.round(parseInt(moment().format("SSS")) / 999 * (range - 1)) + 1;
    } else if (range === 1) {
        return 1;
    } else {
        return (- Math.random() + 1)
        //return parseInt(moment().format("SSS")) / 999;
    }
}
