import {getGameMode} from "./util.js";

const ModInt = {
    "NM": 0,
    "NF": 1,
    "EZ": 2,
    "NV": 4,
    "HD": 8,
    "HR": 16,
    "SD": 32,
    "DT": 64,
    "RX": 128,
    "HT": 256,
    "NC": 512 + 64,
    "FL": 1024,
    "AT": 2048,
    "SO": 4096,
    "AP": 8192,
    "PF": 16384,
}
const ModBonusSTD = {
    "NM": 1,
    "NF": 1,
    "EZ": 0.5,
    "NV": 1,
    "HD": 1.06,
    "HR": 1.06,
    "SD": 1,
    "DT": 1.12,
    "RX": 0.1,
    "HT": 0.3,
    "NC": 1.12,
    "FL": 1.12,
    "AT": 1,
    "SO": 0.9,
    "AP": 1,
    "PF": 1,
}
const ModBonusTAIKO = {
    "NM": 1,
    "NF": 1,
    "EZ": 0.5,
    "NV": 1,
    "HD": 1.06,
    "HR": 1.06,
    "SD": 1,
    "DT": 1.12,
    "RX": 0.1,
    "HT": 0.3,
    "NC": 1.12,
    "FL": 1.12,
    "AT": 1,
    "SO": 0.9,
    "AP": 1,
    "PF": 1,
}
const ModBonusCATCH = {
    "NM": 1,
    "NF": 1,
    "EZ": 0.5,
    "NV": 1,
    "HD": 1.06,
    "HR": 1.12,
    "SD": 1,
    "DT": 1.12,
    "RX": 0.1,
    "HT": 0.5,
    "NC": 1.12,
    "FL": 1.12,
    "AT": 1,
    "SO": 0.9,
    "AP": 1,
    "PF": 1,
}
const ModBonusMANIA = {
    "NM": 1,
    "NF": 1,
    "EZ": 0.5,
    "NV": 1,
    "HD": 1,
    "HR": 1,
    "SD": 1,
    "DT": 1,
    "RX": 0,
    "HT": 0.5,
    "NC": 1,
    "FL": 1,
    "AT": 1,
    "SO": 0,
    "AP": 1,
    "PF": 1,
    "MR": 1,
    "FI": 1,
}

export function hasMod(modInt = 0, mod = '') {
    return ModInt[mod] ? (modInt & ModInt[mod]) !== 0 : false;
}

export function hasAnyMod(modInt = 0, mods = ['']) {
    if (!mods) return false;
    for (const v of mods) {
        if ((ModInt[v] & modInt) !== 0) {
            return true;
        }
    }
    return false;
}

export function hasAllMod(modInt = 0, mod = ['']) {
    if (!mod) return false;
    const all = getModInt(mod);
    return (all & modInt) === all;
}

export function getModFullName(mod = 'NM') {
    switch (mod.toUpperCase()) {
        case "4K":
            return '4Keys';
        case "5K":
            return '5Keys';
        case "6K":
            return '6Keys';
        case "7K":
            return '7Keys';
        case "8K":
            return '8Keys';
        case "9K":
            return '9Keys';
        case "AP":
            return 'AutoPilot';
        case "AU":
            return 'Autoplay';
        case "CN":
            return 'Cinema';
        case "CP":
            return 'Co-op';
        case "DT":
            return 'DoubleTime';
        case "EZ":
            return 'Easy';
        case "FI":
            return 'FadeIn';
        case "FL":
            return 'Flashlight';
        case "HD":
            return 'Hidden';
        case "HR":
            return 'HardRock';
        case "HT":
            return 'HalfTime';
        case "MR":
            return 'Mirror';
        case "NC":
            return 'NightCore';
        case "NF":
            return 'NoFail';
        case "PF":
            return 'Perfect';
        case "RD":
            return 'Random';
        case "RX":
            return 'Relax';
        case "SD":
            return 'SuddenDeath';
        case "SO":
            return 'SponOut';
        case "TD":
            return 'TouchDevice';
        case "TP":
            return 'TargetPractice';
        default:
            return 'NoMod';
    }
}

export function getModInt(mods = ['']) {
    if (Array.isArray(mods) && mods.length > 0) {
        return mods.map(v => {
            return ModInt[v] ? ModInt[v] : 0
        }).reduce((sum, v) => sum | v);
    } else if (typeof mods === 'number') {
        return Math.round(mods);
    } else {
        return 0;
    }
}

export function addMod(modInt = 0, mod = '') {
    return ModInt[mod] ? modInt | ModInt[mod] : modInt;
}

export function getAllMod(modInt) {
    let mods = [];
    for (const [mod, i] of Object.entries(ModInt)) {
        if (modInt & i) {
            mods.push(mod);
        }
    }
    return mods;
}

export function delMod(modInt = 0, mod = '') {
    return ModInt[mod] ? modInt & ~ModInt[mod] : modInt;
}

//计算近似V3分数，奖励分没法算
export function getV3Score(acc = 0.0, combo = 1, maxcombo = 1, mods = [''], gamemode = 'osu', miss = 0) {

    let score;
    let mode = getGameMode(gamemode, 1);
    let modBonus = [];
    let bonus = 1;
    let comboScore;
    let accScore;
    let accIndex;

    switch (mode) {
        case 'o' : {
            modBonus = ModBonusSTD;
            comboScore = 700000;
            accScore = 300000;
            accIndex = 10;
        }
            break;
        case 't' : { //这里大饼是8，该怎么算呢
            modBonus = ModBonusTAIKO;
            comboScore = 250000;
            accScore = 750000;
            accIndex = 3.6;
        }
            break;
        case 'c' : { //实现没做好，暂时使用 std 的方案
            modBonus = ModBonusCATCH;
            comboScore = 600000;
            accScore = 400000;
            accIndex = 1;
        }
            break;
        case 'm' : { //骂娘不需要转换
            //骂娘的acc是 x^(2+2x)，非常陡峭的函数

            modBonus = ModBonusMANIA;
            comboScore = 10000;
            accScore = 990000;
            accIndex = 10;

        } break;
    }

    //主计算
    let minBreakCount = Math.max(Math.floor(maxcombo / combo), 1); //理论上最少的连击中断次数
    let minComboLeft = Math.max(maxcombo - minBreakCount * combo, 0); // 理论上最少的剩余连击
    let minMissCount = Math.max(Math.floor(miss / minBreakCount), 0); // 理论上最少的失误平均
    let minMissLeft = Math.max(miss - minMissCount * minBreakCount, 0); // 理论上最少的剩余失误

    let maxMapComboSum = getComboSum(maxcombo, mode); //理论上最大的连击除数
    let maxPlayerComboSum = getComboSum((combo - minMissCount), mode) * minBreakCount + getComboSum((minComboLeft - minMissLeft), mode);// 理论上玩家得到的连击被除数

    for (const v of mods) {
        bonus *= modBonus[v];
    }

    score = Math.floor(bonus * (accScore * Math.pow(acc, accIndex) + (comboScore * maxPlayerComboSum / maxMapComboSum)));

    return score;

    //连击求和。
    function getComboSum(n = 0, mode = 'o') {

        // catch 的上限是 200 combo,,,
        if (mode === 'c' && n > 200) {
            return Stirling(200) + ((n - 200) * log4(200));
        } else if (n > 400) {
            return Stirling(400) + ((n - 400) * log4(400));
        } else if (n >= 10) {
            return Stirling(n);
        } else if (n >= 1) {
            // 10以下斯特林公式不太精确
            let pow = 2;
            for (let i = 2; i <= n; i++) {
                pow *= i;
            }
            return log4(pow);
        } else {
            return 0;
        }

        // 使用Stirling(斯特林)公式计算对数求和（对数内阶乘）
        // 近似就是 ln(1)+ln(2)+…+ln(N) 约等于 0.5 * ln2pi + (N + 0.5) * lnN - N
        // 由于第一项是ln2，最大是ln400，则计算公式应为 sum = 0.5 * ln2pi + (N + 0.5) * lnN - N + ln2
        // 差点忘了，原公式是 log 4 ()，所以下面的才是正确的
        function Stirling(n = 0) {
            if (n >= 2) {
                return 0.5 * log4(2 * n * Math.PI) + n * (log4(n) - log4(Math.E)) + log4(2);
            } else {
                return 0;
            }
        }

    }

    //v3 获取连击指数，if n=1, f(n)=ln2, if n<=400, f(n)=ln(n), if n>400, f(n)=ln(400)，约等于6
    function getComboIndex(n = 0) {
        if (n > 400) {
            return log4(400);
        } else if (n >= 2) {
            return log4(n);
        } else if (n === 1) {
            return log4(2);
        } else {
            return 0;
        }
    }

    //换底，math没有4为底的对数
    function log4(n = 0) {
        if (n > 0) {
            return Math.log(n) / Math.log(4);
        } else {
            return 0;
        }
    }

}