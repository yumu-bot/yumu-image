import moment from "moment";
import {getImageFromV3} from "./util.js";

const mascot_pic_sum_arr = [79, 35, 7, 5, 14, 1, 3, 5, 5, 7]; //吉祥物的对应的照片数量，和随机banner一样的
const bannerTotal = 160; //banner 数量
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
    path = getRandom(mascot_pic_sum_arr[i]);

    return getImageFromV3(`Mascots/${mascotname}_${path}.png`);
}

/**
 * @function 获取随机的头图路径
 * @return {String} 返回横幅路径
 */
export function getRandomBannerPath() {
    const i = getRandom(bannerTotal)
    return getImageFromV3(`Banner/b${i}.png`);
}

/**
 * @function 获取随机的吉祥物背景路径
 * @return {String} 返回吉祥物背景路径
 */
export function getRandomMascotBGPath() {
    const i = getRandom(mascotBGTotal)
    return getImageFromV3(`Background/${i}.png`);
}

//通过 PP 获取玩家颜色（的背景图！pp2Rank
export function pp2UserBG(pp = 0) {
    let rank;

    if (pp >= 15000) rank = 'PF';
    else if (pp >= 10000) rank = 'X';
    else if (pp >= 8000) rank = 'XH';
    else if (pp >= 6000) rank = 'S';
    else if (pp >= 4000) rank = 'A';
    else if (pp >= 3000) rank = 'B';
    else if (pp >= 2000) rank = 'C';
    else if (pp >= 1000) rank = 'D';
    else rank = 'F';

    return getImageFromV3('object-score-backimage-' + rank + '.jpg');
}

//获取一个1到目标数的随机整数。如果range小于1，则返回0-1的随机小数。
export function getRandom(range = 0) {
    if (range > 1) {
        return Math.round(parseInt(moment().format("SSS")) / 999 * (range - 1)) + 1;
    } else if (range === 1) {
        return 1;
    } else {
        return parseInt(moment().format("SSS")) / 999;
    }
}