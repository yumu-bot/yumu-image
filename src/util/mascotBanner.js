import moment from "moment";
import {getImageFromV3} from "./util.js";
import mascot_data from '../config/mascot.json' with { type: 'json' };

const mascot_pic_sum_arr = [79, 35, 7, 5, 14, 1, 3, 5, 5, 7]; //吉祥物的对应的照片数量，和随机banner一样的
const mascot_transparency_sum_arr = [2, 1, 0, 0, 1, 0, 0, 1, 0, 1];
const defaultBannerTotal = 200; //默认 banner 数量
const maimaiBannerTotal = 70; //maimai banner 数量
const mascotBGTotal = 13; //吉祥物 BG 数量

// 导入一些特殊 banner，比如 7 号是潘多拉，11号是 Splash 的改版 Shabi
export function getMaimaiBannerIndex(song) {
    if (!song) return 0;

    const BANNER_MAP = {
        11069: 2,
        834: 7,
        567: 17,
        417: 28,
        10734: 35,
        734: 35,
        838: 42,
        11591: 45,
        647: 48,
        11662: 51,
        11663: 53,
        844: 54,
        606: 56,
        270: 59,
        11355: 62,
        11820: 64,
        11512: 69,
        11629: 70,
    };

    // 优先检查特定ID
    if (song.id && BANNER_MAP[song.id] !== undefined) {
        return BANNER_MAP[song.id];
    }

    // 然后检查from字段
    if (song.from === "maimai でらっくす Splash" ||
        song.from === "maimai でらっくす Splash PLUS") {
        return 11;
    }

    return 0;
}

/**
 * 用来根据老版本的吉祥物获取横幅版的吉祥物，返回内有 y 需要往上挪
 * @param mode
 * @param window_height
 * @return {{mascot: string, y: number}}
 */
export function getMascotBanner(
    mode = 'osu',
    window_height = 140
) {
    const mascot_name = getMascotName(mode)
    const index = getMascotIndex(mascot_name)

    // const w = 560
    const h = 710

    const offset = Math.max(0, Math.min((mascot_data?.[mascot_name]?.[index - 1] ?? 50) / 100, 1));

    const y = Math.max(0, offset * h - (window_height / 2))

    return {
        mascot: getImageFromV3('Mascots', `${mascot_name}_${index}.png`),
        y: -y
    }
}

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
 * @param mascot_name 吉祥物名字
 */
export function getMascotPath(mascot_name = 'pippi') {
    let index = getMascotIndex(mascot_name);

    return getImageFromV3('Mascots', `${mascot_name}_${index}.png`);
}

function getMascotIndex(mascot_name = 'pippi') {
    let i;

    switch (mascot_name) {
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

    return getRandom(Math.max(1, mascot_pic_sum_arr[i]));
}

/**
 * @function 获取随机的头图路径
 * @return {String} 返回横幅路径
 */
export function getRandomBannerPath(type = "default", index = 0) {
    if (moment().isBefore(moment("2025/02/23 10:00", "YYYY/MM/DD HH:mm"))) {
        return getImageFromV3('Banner', 'a3.png');
    }

    if (type === "maimai") {
        const i = index || getWeightedRandom(maimaiBannerTotal)
        return getImageFromV3('Banner', `d${i}.png`);
    } else {
        const i = index || getWeightedRandom(defaultBannerTotal)
        return getImageFromV3('Banner', `b${i}.png`);
    }
}

function getWeightedRandom(max = 1, first_weight = 1, last_weight = 3) {
    // 处理特殊情况：如果 max 为 1，直接返回 1
    if (max <= 1) return 1;

    // 计算总权重 (等差数列求和公式)
    const total_weight = (first_weight + last_weight) * max / 2;

    // 生成随机数
    let random_value = Math.random() * total_weight;

    // 找到对应的编号
    for (let i = 1; i <= max; i++) {
        // 动态计算当前项的权重：线性插值公式
        // weight = a + (i-1) * d, 其中 d = (last - first) / (max - 1)
        const weight = first_weight + (i - 1) * (last_weight - first_weight) / (max - 1);

        random_value -= weight;
        if (random_value <= 0) {
            return i;
        }
    }

    return max;
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

/**
 * 通过玩家全球排行和百分比获取背景图片
 * @param user OsuUser
 * @return {string}
 */
export function getGlobalRankPercentBGFromUser(user = {}) {
    const rank = (user?.statistics?.global_rank ?? 0)

    const percent = user?.statistics?.global_rank_percent ?? (rank / 1000)

    return getGlobalRankPercentBG(rank, percent)
}

/**
 * 通过玩家全球排行和百分比获取背景图片
 * @param global_rank
 * @param global_rank_percent
 * @return {string}
 */
function getGlobalRankPercentBG(global_rank = 0, global_rank_percent = 1.0) {
    let rank

    if (global_rank <= 100 && global_rank >= 1) {
        rank = 'PF'
    } else if (global_rank_percent < 0.0005) {
        rank = 'SSS'
    } else if (global_rank_percent < 0.0025) {
        rank = 'A'
    } else if (global_rank_percent < 0.005) {
        rank = 'B'
    } else if (global_rank_percent < 0.025) {
        rank = 'X'
    } else if (global_rank_percent < 0.05) {
        rank = 'XH'
    } else if (global_rank_percent < 0.25) {
        rank = 'SP'
    } else if (global_rank_percent < 0.5) {
        rank = 'SH'
    } else {
        rank = 'F'
    }

    return getImageFromV3(`object-score-backimage-${rank}.jpg`);
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

/**
 * 获取一个1到目标数的随机整数。如果range小于1，则返回0-1的随机小数。
 * @param range
 * @return {number}
 */
export function getRandom(range = 0) {
    if (range > 1) {
        return Math.floor(Math.random() * range ?? 1) + 1
        //return Math.round(parseInt(moment().format("SSS")) / 999 * (range - 1)) + 1;
    } else if (range === 1) {
        return 1;
    } else {
        return Math.random()
        //return parseInt(moment().format("SSS")) / 999;
    }
}