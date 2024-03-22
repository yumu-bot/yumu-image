import {getModInt, hasMod} from "./mod.js";
import {getGameMode} from "./util.js";

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
export const hasLeaderBoard = (ranked = 0) => {
    return (typeof ranked === "number") && (ranked === 1 || ranked === 2 || ranked === 4);
}
