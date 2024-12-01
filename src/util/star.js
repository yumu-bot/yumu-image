import {getModInt, hasMod, matchAnyMods} from "./mod.js";
import {getGameMode, getImageFromV3} from "./util.js";

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
 * 获取大致星数，用于不需要展示星数的场合，比如多成绩
 * @param star 原星数
 * @param mods 模组搭配，比如 ['EZ', 'DT']
 */
export const getApproximateStarRating = (star = 0, mods = ['']) => {
    const modsInt = getModInt(mods);

    if (typeof star !== "number") return 0;

    if (hasMod(modsInt, 'DT') || hasMod(modsInt, 'NC')) {
        star = 1.3 * Math.pow(star, 1.06);
    }

    if (hasMod(modsInt, 'HR')) {
        star = Math.pow(star, 1.06);
    }

    if (hasMod(modsInt, 'FL')) {
        star = 1.32 * Math.pow(star, 0.92);
    }

    if (hasMod(modsInt, 'HT')) {
        star = 0.84 * Math.pow(star, 0.96);
    }

    if (hasMod(modsInt, 'EZ')) {
        star *= 0.92;
    }

    return star;
}
// 从新版成绩中，获取稳定版的准确率
// 去他妈的，写主程序里去了
export const getStableAccuracyFromLazerScore = (score) => {
    if (getScoreType(score.build_id) !== 'stable') return score?.accuracy || 0

    const m = score.maximum_statistics
    const s = score.statistics

    let total = m.great

    switch (score?.ruleset_id) {
        case 0: {
            const hit = s.great + 1/3 * s.ok + 1/6 * s.meh
            return hit / total
        }
        case 1 : {
            return (s.great + 1/2 * s.ok) / total
        }

        case 2 : {
            const hit = s.great + s.large_tick_hit + s.small_tick_hit
            total = m.great + m.large_tick_hit + m.small_tick_hit

            return hit / total

        }

        case 3 : {
            const hit = s.perfect + s.great + 2/3 * s.good + 1/3 * s.ok + 1/6 * s.meh
            total = m.perfect
            return hit / total

        }
    }

    return 0
}

// 从新版成绩中，获取稳定版的评级
// 去他妈的，写主程序里去了
export const getStableRankFromLazerScore = (score) => {
    if (score?.passed === false) return 'F'
    if (getScoreType(score.build_id) !== 'stable') return score?.rank

    const m = score.maximum_statistics
    const s = score.statistics

    let rank = 'F'
    const hasMiss = (s.miss > 0)

    const accuracy = getStableAccuracyFromLazerScore(score)
    const p300 = s.great / m.great

    switch (score?.ruleset_id) {
        case 0: {
            const is50over1p = (s.meh / m.great > 0.01);

            if (p300 === 1) {
                rank = 'SS';
            } else if (p300 >= 0.9) {
                rank = hasMiss ? 'A' : (is50over1p ? 'A' : 'S');
            } else if (p300 >= 0.8) {
                rank = hasMiss ? 'B' : 'A';
            } else if (p300 >= 0.7) {
                rank = hasMiss ? 'C' : 'B';
            } else if (p300 >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
        break;
        case 1 : {

            if (p300 === 1) {
                rank = 'SS';
            } else if (p300 >= 0.9) {
                rank = hasMiss ? 'A' : 'S';
            } else if (p300 >= 0.8) {
                rank = hasMiss ? 'B' : 'A';
            } else if (p300 >= 0.7) {
                rank = hasMiss ? 'C' : 'B';
            } else if (p300 >= 0.6) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
            break;

        case 2 : {

            if (accuracy === 1) {
                rank = 'SS';
            } else if (accuracy > 0.98) {
                rank = 'S';
            } else if (accuracy > 0.94) {
                rank = 'A';
            } else if (accuracy > 0.90) {
                rank = 'B';
            } else if (accuracy > 0.85) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
            break;

        case 3 : {
            if (accuracy === 1) {
                rank = 'SS';
            } else if (accuracy >= 0.95) {
                rank = 'S';
            } else if (accuracy >= 0.90) {
                rank = 'A';
            } else if (accuracy >= 0.80) {
                rank = 'B';
            } else if (accuracy >= 0.70) {
                rank = 'C';
            } else {
                rank = 'D';
            }
        }
            break;
    }

    const isSilver = matchAnyMods(score.mods, ['HD', 'FL', 'BL', 'CO']);
    if ((rank === 'SS' || rank === 'S') && isSilver) rank += 'H';

    return rank
}


// 获取可能的评级
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
}, showFailed = false) => {
    if (!score.passed && showFailed) return 'F';

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
            const alt_acc = acc || (nG + n300 + nK * 2 / 3 + n100 / 3 + n50 / 6) / (nG + n300 + n100 + n50 + nK + n0);

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

/**
 * 谱面是否有榜
 * @param ranked
 * @return {boolean} 谱面是否有榜
 */
export const hasLeaderBoard = (ranked) => {
    if (typeof ranked === "number") {
        return (ranked === 1 || ranked === 2 || ranked === 4);
    } else if (typeof ranked === "string") {
        return (ranked === 'qualified' || ranked === 'ranked' || ranked === 'loved');
    } else {
        return false;
    }
}

// 获取评级背景。把 S+ 和 X+ 统一一下。
export const getRankBG = (rank = 'F', passed = true) => {
    if (passed === false) rank = 'F';
    if (rank === 'X+' || rank === 'SS') rank = 'X';
    if (rank === 'SSH') rank = 'XH';
    if (rank === 'S+') rank = 'S';
    return getImageFromV3(`object-score-backimage-${rank}.jpg`)
}

// 从数字获得评级。默认是获取星数的评级，也可以自定义边界或评级名字。如果想跳过某评级（比如 S+），将其所在位（比如这里是 3 号位）的数字设置为和前一位等同。SS 和 D 无法跳过。
export const getRankFromValue = (value = 0, boundary = [9, 7, 6.5, 5.3, 4, 2.8, 2, 0.1], ranks = ['X+', 'SS', 'S+', 'S', 'A', 'B', 'C', 'D']) => {
    if (typeof value != 'number') return 'F';

    if (boundary?.length < 8) boundary = [9, 7, 6.5, 5.3, 4, 2.8, 2, 0.1];
    if (ranks?.length < 8) ranks = ['X+', 'SS', 'S+', 'S', 'A', 'B', 'C', 'D']

    for (let i = 0; i < ranks.length; i++) {
        const b = boundary[i];
        const r = ranks[i];

        if (value >= b) return r;
    }

    return 'F';
}

export function getScoreTypeImage(is_lazer, version = '') {
    switch (is_lazer) {
        case null:
            return ''
        case true:
            return getImageFromV3('object-type-lazer' + version + '.png');
        case false:
            return getImageFromV3('object-type-stable' + version + '.png');
    }
}
