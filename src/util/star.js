import {getImageFromV3} from "./util.js";

//SS和X的转换
export const rankSS2X = (rank = 'SS') => {
    switch (rank) {
        case "SS":
            return 'X';
        case "SSH":
            return 'XH';
        default:
            return rank;
    }
}

/**
 * 谱面是否有榜
 * @param ranked
 * @return {boolean} 谱面是否有榜
 */
export const hasLeaderBoard = (ranked) => {
    if (typeof ranked === "number") {
        return (ranked > 1e-6);
    } else if (typeof ranked === "string") {
        return (ranked === 'ranked' || ranked === 'qualified' || ranked === 'approved' || ranked === 'loved');
    } else {
        return false;
    }
}

// 获取评级背景。把 S+ 和 X+ 统一一下。
export const getRankBackground = (rank = 'F', passed = true) => {
    let convert = rank
    if (passed === false) convert = 'F';
    if (rank === 'X+' || rank === 'SS') convert = 'X';
    if (rank === 'SSH') convert = 'XH';
    if (rank === 'S+') convert = 'S';
    if (rank === 'EX') convert = 'PF';

    return getImageFromV3(`object-score-backimage-${convert}.webp`)
}

export const getRankBackgroundForI4 = (rank = 'F', passed = true) => {
    let convert = rank
    if (passed === false) convert = 'F';
    if (rank === 'X+' || rank === 'EX' || rank === 'X' || rank === 'SS') convert = 'SSS';
    if (rank === 'SSH' || rank === 'XH') convert = 'PF';
    if (rank === 'S+') convert = 'S';
    if (rank === 'S') convert = 'X';

    return getImageFromV3(`object-score-backimage-${convert}.webp`)
}

const DEFAULT_BOUNDARY = [10, 8, 6.5, 5.3, 4, 2.8, 2, 0.1]
const DEFAULT_RANKS = ['EX', 'SS', 'S+', 'S', 'A', 'B', 'C', 'D']

// 从数字获得评级。默认是获取星数的评级，也可以自定义边界或评级名字。如果想跳过某评级（比如 S+），将其所在位（比如这里是 3 号位）的数字设置为和前一位等同。SS 和 D 无法跳过。
export const getRankFromValue = (value = 0, boundary = DEFAULT_BOUNDARY, ranks = DEFAULT_RANKS) => {
    if (typeof value != 'number') return 'F';

    if (boundary?.length < 8) boundary = DEFAULT_BOUNDARY;
    if (ranks?.length < 8) ranks = DEFAULT_RANKS

    for (let i = 0; i < ranks.length; i++) {
        const b = boundary[i];
        const r = ranks[i];

        if (value >= b) return r;
    }

    return 'F';
}

/**
 *
 * @param is_lazer
 * @param version {number | string}
 * @param score_type
 * @return {string}
 */
export function getScoreTypeImage(is_lazer, version = '', score_type) {
    if (score_type === "sb_score") {
        return getImageFromV3('object-type-ppysb' + version + '.png');
    }

    switch (is_lazer) {
        case null:
            return ''
        case true:
            return getImageFromV3('object-type-lazer' + version + '.png');
        case false:
            return getImageFromV3('object-type-stable' + version + '.png');
    }
}

/**
 * 一个类似于 maimai DX 星级的东西
 * @param stat
 * @param stat_max
 * @param mode
 * @return {number}
 */
export function getOsuDXRatingStar(stat = {}, stat_max = {}, mode = 'o') {
    let dx_max = 0
    let dx = 0

    switch (mode) {
        case "o": {
            dx = stat.great * 3 + stat.ok + stat.meh * 0.5
            dx_max = stat_max.great * 3
        } break;
        case "t": {
            dx = stat.great * 3 + stat.ok * 1.5
            dx_max = stat_max.great * 3
        } break;
        case "c": {
            dx = stat.small_tick_hit * 3 + stat.large_tick_hit * 2 + stat.great
            dx_max = stat_max.small_tick_hit * 3 + stat_max.large_tick_hit * 2 + stat_max.great
        } break;
        case "m": {
            dx = stat.perfect * 3 + stat.great * 2 + stat.good

            dx_max = stat_max.perfect * 3
        } break;
    }

    if (dx_max === 0) return 0

    const div = dx / dx_max;

    switch (mode) {
        case "o": case "t": case "c": {
            if (div >= 0.9975) {
                return 5
            } else if (div >= 0.995) {
                return 4
            } else if (div >= 0.99) {
                return 3
            } else if (div >= 0.97) {
                return 2
            } else if (div >= 0.95) {
                return 1
            } else {
                return 0
            }
        }
        case "m": {
            if (div >= 0.97) {
                return 5
            } else if (div >= 0.95) {
                return 4
            } else if (div >= 0.93) {
                return 3
            } else if (div >= 0.9) {
                return 2
            } else if (div >= 0.85) {
                return 1
            } else {
                return 0
            }
        }
    }
}
