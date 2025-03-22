import {getGameMode, isEmptyArray, isEmptyString, isNumber} from "./util.js";
import {getModColor} from "./color.js";
import {torus} from "./font.js";
import {PanelDraw} from "./panelDraw.js";

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
    "DC": 0.3,
    "HT": 0.3,
    "NF": 0.5,
    "EZ": 0.5,
    "HD": 1.06,
    "HR": 1.06,
    "DT": 1.1,
    "NC": 1.1,
    "RX": 0.1,
    "FL": 1.12,
    "SO": 0.9,
    "TP": 0.1,
    "DA": 0.5,
    "CL": 0.96,
    "WU": 0.5,
    "WD": 0.5,
    "MG": 0.5,
    "AS": 0.5,
    "SY": 0.8,
}
const ModBonusTAIKO = {
    null: 1,
    "DC": 0.3,
    "HT": 0.3,
    "NF": 0.5,
    "EZ": 0.5,
    "HD": 1.06,
    "HR": 1.06,
    "DT": 1.1,
    "NC": 1.1,
    "RX": 0.1,
    "FL": 1.12,
    "SO": 0.9,
    "DA": 0.5,
    "CL": 0.96,
    "CS": 0.9,
    "WU": 0.5,
    "WD": 0.5,
    "AS": 0.5,
}
const ModBonusCATCH = {
    null: 1,
    "DC": 0.3,
    "HT": 0.3,
    "NF": 0.5,
    "EZ": 0.5,
    "HD": 1.06,
    "HR": 1.12,
    "DT": 1.1,
    "NC": 1.1,
    "RX": 0.1,
    "FL": 1.12,
    "SO": 0.9,
    "DA": 0.5,
    "CL": 0.96,
    "WU": 0.5,
    "WD": 0.5,
}
const ModBonusMANIA = {
    null: 1,
    "DC": 0.3,
    "HT": 0.3,
    "NR": 0.9,
    "NF": 0.5,
    "EZ": 0.5,
    "DA": 0.5,
    "CL": 0.96,
    "CS": 0.9,
    "HO": 0.9,
    "WU": 0.5,
    "WD": 0.5,
    "AS": 0.5,
}

/**
 * 获取模组名称
 * @param mod {{acronym: string}|string}
 * @returns string
 */
const getModName = (mod = {acronym: ""} || "") => {
    if (mod instanceof String) {
        return mod
    } else if (mod instanceof Object) {
        return mod?.acronym || ''
    } else return ''
}

/**
 * 获取标准六边形模组路径
 * @param mod {string | {acronym: string}}
 * @param x
 * @param y
 * @param width
 * @param text_height
 * @param is_additional
 * @returns {string}
 */
export function getModPath(mod = {acronym: ""}, x = 0, y = 24, width = 90, text_height = 42, is_additional = false){
    const mod_name = getModName(mod)
    if (isEmptyString(mod_name)) return ''

    const mod_color = getModColor(mod_name);
    const mod_abbr_path = torus.getTextPath(mod_name.toString(), x + (width / 2), y + text_height, 36, 'center baseline', '#fff');
    const mod_additional = is_additional === true ? getModAdditionalInformation(mod) : ''
    const mod_additional_path = torus.getTextPath(mod_additional, x + (width / 2), y + text_height - 28, 16, 'center baseline', '#fff');

    return `<path transform="translate(${x} ${y})"  d="m70.5,4l15,20c2.667,3.556,2.667,8.444,0,12l-15,20c-1.889,2.518-4.852,4-8,4H27.5c-3.148,0-6.111-1.482-8-4l-15-20c-2.667-3.556-2.667-8.444,0-12L19.5,4C21.389,1.482,24.352,0,27.5,0h35c3.148,0,6.111,1.482,8,4Z" style="fill: ${mod_color};"/>\n` + mod_abbr_path + '\n' + mod_additional_path + '\n';
}

/**
 * 获取圆形模组路径
 * @param mod {string | {acronym: string}}
 * @param cx
 * @param cy
 * @param r
 * @param dont_show_nf
 * @returns {string}
 */
export function getModCirclePath(mod = {acronym: ""}, cx = 0, cy = 0, r = 5, dont_show_nf = false){
    const mod_name = getModName(mod)
    if (isEmptyString(mod_name)) return ''

    if (dont_show_nf === true && (mod_name === 'NF')) return ''; //不画NF的图标，因为没必要

    const mod_color = getModColor(mod_name);

    return PanelDraw.Circle(cx, cy, r, mod_color);
}

/**
 * 获取圆角矩形模组路径
 * @param mod {string | {acronym: string}}
 * @param x
 * @param y
 * @param width
 * @param height
 * @param r
 * @param text_height
 * @param font
 * @param font_size
 * @returns {string}
 */

export function getModRRectPath(mod = {acronym: ""}, x = 0, y = 0, width = 40, height = 20, r = Math.min(width, height) / 2, text_height = 21, font = torus, font_size = 16) {
    const mod_name = getModName(mod)
    if (isEmptyString(mod_name)) return ''

    const mod_color = getModColor(mod_name);
    const mod_abbr_path = font.getTextPath(mod_name.toString(), x + (width / 2), y + text_height, font_size, 'center baseline', '#fff');

    return PanelDraw.Rect(x, y, width, height, r, mod_color, 1) + mod_abbr_path
}

export function hasMod(modInt = 0, mod = '') {
    return ModInt[mod] ? (modInt & ModInt[mod]) !== 0 : false;
}

export function hasModChangedSR(mod_name = '') {
    return (mod_name === 'DT' || mod_name === 'NC' || mod_name === 'HT' || mod_name === 'DC' || mod_name === 'HR' || mod_name === 'EZ' || mod_name === 'FL')
}

export function matchMod(mod = {acronym: ''}, name = '') {
    return mod?.acronym?.toString().toUpperCase() === name?.toString().toUpperCase();
}

export function matchAnyMod(mod = {acronym: ''}, list = []) {
    if (isEmptyArray(list)) return false

    for (const s of list) {
        if (matchMod(mod, s) === true) {
            return true;
        }
    }

    return false
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


/**
 * 展示在模组上的附加信息
 * @param mod {string | {acronym: string, settings: {}}}
 * @returns {string}
 */
export function getModAdditionalInformation(mod = {
    acronym: '',
    settings: {
        speed_change: null,
        final_rate: null,
        initial_rate: null,

        // EZ
        extra_lives: null,

        // AC
        restart: null, // 默认 false
        minimum_accuracy: null, // 如果没有那就是 0.90
        accuracy_judge_mode: null, // "1" 就是 standard，也就是当前值，如果是 null 那就是谱面理论最大
    }
}) {
    const s = mod?.settings;
    if (s == null) return ''

    let info = ''

    if (matchAnyMod(mod, ['DT', 'NC', 'HT', 'DC']) && isNumber(s?.speed_change)) {
        info = s?.speed_change?.toString() + 'x'
    }

    if (matchAnyMod(mod, ['WU', 'WD']) && isNumber(s?.final_rate)) {
        info = s?.final_rate?.toString() + 'x'
    }

    if (matchMod(mod, 'AS') && isNumber(s?.extra_lives)) {
        info = s?.extra_lives?.toString() + '+'
    }

    if (matchMod(mod, 'EZ') && isNumber(s?.initial_rate)) {
        info = s?.initial_rate?.toString() + 'x'
    }

    if (matchMod(mod, 'AC')) {
        if (s?.accuracy_judge_mode === "1") {
            info += '>'
        }

        if (isNumber(s?.minimum_accuracy)) {
            info += Math.round(s?.minimum_accuracy * 100).toString() + '%'
        } else {
            info += '90%'
        }
    }

    return info
}

export function getModFullName(abbr = 'NM') {
    switch (abbr?.toUpperCase()) {
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

        case "DC":
            return 'Daycore';
        case "NR":
            return 'NoRelease';
        case "BL":
            return 'Blinds';
        case "CO":
            return 'Cover';
        case "ST":
            return 'StrictTracking';
        case "AC":
            return 'AccuracyChallenge';
        case "DA":
            return 'DifficultyAdjust';
        case "CL":
            return 'Classic';
        case "AL":
            return 'Alternate';
        case "SG":
            return 'SingleTap';
        case "SW":
            return 'Swap';
        case "DS":
            return 'DualStages';
        case "IN":
            return 'Invert';
        case "CS":
            return 'ConstantSpeed';
        case "HO":
            return 'HoldOff';

        case "TR":
            return 'Transform';
        case "WG":
            return 'Wiggle';
        case "SI":
            return 'SpinIn';
        case "GR":
            return 'Grow';
        case "DF":
            return 'Deflate';
        case "WU":
            return 'WindUp';
        case "WD":
            return 'WindDown';
        case "TC":
            return 'Traceable';
        case "BR":
            return 'BarrelRoll';
        case "AD":
            return 'ApproachDifferent';
        case "MU":
            return 'Muted';
        case "NS":
            return 'NoScope';
        case "MG":
            return 'Magnetised';
        case "RP":
            return 'Repel';
        case "AS":
            return 'AdaptiveSpeed';
        case "FR":
            return 'FreezeFrame';
        case "FF":
            return 'FloatingFruits';
        case "BU":
            return 'Bubbles';
        case "SY":
            return 'Synesthesia';
        case "DP":
            return 'Depth';
        case "BM":
            return 'Bloom';
        default:
            return abbr?.toUpperCase();
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

/**
 * 获取模组倍率 (lazer 基准)
 * @param mods
 * @param game_mode
 * @returns {number} 倍率
 */
export function getModMultiplier(mods = [{acronym: ''}], game_mode = 'o') {
    const mode = getGameMode(game_mode, 1);
    let modList
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
        multiplier *= modList[v?.acronym];
    }

    return multiplier;
}