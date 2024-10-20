import {getGameMode, isEmptyArray} from "./util.js";

const ModInt = {
    null: 0,
    "NM": 0,
    "NF": 1,
    "EZ": 1 << 1,
    "TD": 1 << 2,
    "HD": 1 << 3,
    "HR": 1 << 4,
    "SD": 1 << 5,
    "DT": 1 << 6,
    "RX": 1 << 7,
    "HT": 1 << 8,
    "NC": (1 << 9) + (1 << 6),
    "FL": 1 << 10,
    "AT": 1 << 11,
    "SO": 1 << 12,
    "AP": 1 << 13,
    "PF": 1 << 14,
    "4K": 1 << 15,
    "5K": 1 << 16,
    "6K": 1 << 17,
    "7K": 1 << 18,
    "8K": 1 << 19,
    "nK": 1015808, // 4+..+8
    "FI": 1 << 20,
    "RD": 1 << 21,
    "CN": 1 << 22,
    "TP": 1 << 23,
    "9K": 1 << 24,
    "CO": 1 << 25,
    "1K": 1 << 26,
    "3K": 1 << 27,
    "2K": 1 << 28,
    "V2": 1 << 29,
    "MR": 1 << 30,
}
const ModBonusSTD = {
    null: 1,
    "NM": 1,
    "NF": 0.5,
    "EZ": 0.5,
    "TD": 1,
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
    null: 1,
    "NM": 1,
    "NF": 0.5,
    "EZ": 0.5,
    "TD": 1,
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
    null: 1,
    "NM": 1,
    "NF": 0.5,
    "EZ": 0.5,
    "TD": 1,
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
    null: 1,
    "NM": 1,
    "NF": 0.5,
    "EZ": 0.5,
    "TD": 1,
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

export function hasModChangedSR(mod = '') {
    return (mod === 'DT' || mod === 'NC' || mod === 'HT' || mod === 'DC' || mod === 'HR' || mod === 'EZ' || mod === 'FL')
}

export function matchAnyMods(mods = [{acronym: ''}], list = []) {
    if (isEmptyArray(mods) || isEmptyArray(list)) return false

    for (const m of mods) {
        if (matchAnyMod(m, list) === true) {
            return true
        }
    }

    return false
}

export function matchAnyMod(mod = {acronym: ''}, list = []) {
    for (const s of list) {
        if (mod?.acronym?.toString().toUpperCase() === s?.toString().toUpperCase()) {
            return true;
        }
    }

    return false
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

export function getModMultiplier(mods = [], gamemode = 'o') {
    const mode = getGameMode(gamemode, 1);
    let modList = [];
    let multiplier = 1;

    switch (mode) {
        case 'o':
            modList = ModBonusSTD;
            break;
        case 't':
            modList = ModBonusTAIKO;
            break;
        case 'c':
            modList = ModBonusCATCH;
            break;
        case 'm':
            modList = ModBonusMANIA;
            break;
    }

    for (const v of mods) {
        multiplier *= modList[v];
    }

    return multiplier;
}