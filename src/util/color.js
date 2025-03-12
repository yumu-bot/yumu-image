import {isHexColor} from "./util.js";

// Yumu Panel v0.5 颜色自定义，默认的色相全是 342（这也是巧克力面板的原色
export const PanelColor = {
    // 基层，一般看不到这个颜色
    base: (hue = 342) => {
        return hsl2hex(hue || 342, 0.1, 0.1)
    },

    // 底层，一般作为面板的底板
    bottom: (hue = 342) => {
        return hsl2hex(hue || 342, 0.1, 0.15)
    },

    // 中层，一般作为模块的底板
    middle: (hue = 342) => {
        return hsl2hex(hue || 342, 0.1, 0.2)
    },

    // 上层，一般作为卡片的底板
    top: (hue = 342) => {
        return hsl2hex(hue || 342, 0.1, 0.25)
    },

    // 覆盖层，一般覆盖在卡片上
    overlay: (hue = 342) => {
        return hsl2hex(hue || 342, 0.1, 0.3)
    },

    // 最亮层，现在用于某些场景的字太黑的问题
    bright: (hue = 342) => {
        return hsl2hex(hue || 342, 0.1, 0.7)
    },
}

export function changeHexLightness(hex = '#AAAAAA', difference = 0) {
    const hsl = hex2hsl(hex)

    hsl.l = clamp01(hsl.l + difference)

    return hsl2hex(hsl.h, hsl.s, hsl.l)
}

export function changeHexLightnessTo(hex = '#AAAAAA', lightness = 0) {
    const hsl = hex2hsl(hex)

    return hsl2hex(hsl.h, hsl.s, lightness)
}


// 返回的结果是 xxx, xxx, xxx
export function hex2rgbColor(hex = '#AAAAAA') {
    const rgb = hex2rgb(hex);

    return `${rgb.r},${rgb.g},${rgb.b}`
}

export function hex2rgb(hex = '#AAAAAA') {
    if (isHexColor(hex)) {
        if (hex.length === 7) {
            const r = parseInt('0x' + hex.slice(1, 3), 16)
            const g = parseInt('0x' + hex.slice(3, 5), 16)
            const b = parseInt('0x' + hex.slice(5, 7), 16)

            return {
                r: r, g: g, b: b
            }
        } else if (hex.length === 4) {
            const r = parseInt('0x' + hex.slice(1, 2) + hex.slice(1, 2), 16)
            const g = parseInt('0x' + hex.slice(2, 3) + hex.slice(2, 3), 16)
            const b = parseInt('0x' + hex.slice(3, 4) + hex.slice(3, 4), 16)

            return {
                r: r, g: g, b: b
            }
        }
    }

    return {
        r: 0, g: 0, b: 0
    }
}

export function hex2hsl(hex = '#AAAAAA') {
    const rgb = hex2rgb(hex)

    const rgb_max = Math.max(rgb.r, rgb.g, rgb.b)
    const rgb_min = Math.min(rgb.r, rgb.g, rgb.b)
    const delta = rgb_max - rgb_min

    const lightness = (rgb_max + rgb_min) / 2.0
    
    let hue
    let saturation
    
    const del_R = (((rgb_max - rgb.r) / 6.0) + (delta / 2.0)) / delta;
    const del_G = (((rgb_max - rgb.g) / 6.0) + (delta / 2.0)) / delta;
    const del_B = (((rgb_max - rgb.b) / 6.0) + (delta / 2.0)) / delta;

    if (lightness < 0.5) {
        saturation = delta / (rgb_max + rgb_min);
    } else {
        saturation = delta / (2 - rgb_max - rgb_min);
    }

    if (rgb.r === rgb_max) hue = del_B - del_G;
    else if (rgb.g === rgb_max) hue = (1.0 / 3.0) + del_R - del_B;
    else if (rgb.b === rgb_max) hue = (2.0 / 3.0) + del_G - del_R;

    if (hue < 0) hue += 1;
    if (hue > 1) hue -= 1;

    return {
        h: hue, s: saturation, l: lightness
    }
}

export function hsl2hex(hue = 0, saturation = 0, lightness = 0) {

    // Normalize hue to be in the range [0, 6]
    const h = clamp(hue, 360, 0) / 60

    // Calculate chroma (C), a measure of the color intensity
    const chroma = (1 - Math.abs(2 * clamp01(lightness) - 1)) * clamp01(saturation)
    const x = chroma * (1 - Math.abs(h % 2 - 1))
    const m = Math.max(clamp01(lightness) - chroma / 2, 0)

    // Initialize rgb values
    let r = 0, g = 0, b = 0

    // Determine the RGB components based on the hue sector
    if (0 <= h && h < 1) {
        r = chroma
        g = x
        b = 0
    } else if (1 <= h && h < 2) {
        r = x
        g = chroma
        b = 0
    } else if (2 <= h && h < 3) {
        r = 0
        g = chroma
        b = x
    } else if (3 <= h && h < 4) {
        r = 0
        g = x
        b = chroma
    } else if (4 <= h && h < 5) {
        r = x
        g = 0
        b = chroma
    } else if (5 <= h && h <= 6) {
        r = chroma
        g = 0
        b = x
    }

    // Add m to each component to match the desired lightness
    const r_hex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
    const g_hex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
    const b_hex = Math.round((b + m) * 255).toString(16).padStart(2, '0')

    return '#' + r_hex + g_hex + b_hex
}

export function getStarRatingColor(SR = 0) {
    let color;
    let r0 = 0;
    let g0 = 0;
    let b0 = 0;
    let r1 = 0;
    let b1 = 0;
    let g1 = 0;
    let bottom;
    let top;
    const gamma = 2.2; //伽马值


    if (SR < 1.25) {
        r0 = 66;
        g0 = 144;
        b0 = 251;
        r1 = 79;
        g1 = 192;
        b1 = 255;
        bottom = 0.1;
        top = 1.25;

    } else if (SR < 2) {
        r0 = 79;
        g0 = 192;
        b0 = 255;
        r1 = 79;
        g1 = 255;
        b1 = 213;
        bottom = 1.25;
        top = 2;

    } else if (SR < 2.5) {
        r0 = 79;
        g0 = 255;
        b0 = 213;
        r1 = 124;
        g1 = 255;
        b1 = 79;
        bottom = 2;
        top = 2.5;

    } else if (SR < 3.3) {
        r0 = 124;
        g0 = 255;
        b0 = 79;
        r1 = 246;
        g1 = 240;
        b1 = 92;
        bottom = 2.5;
        top = 3.3;

    } else if (SR < 4.2) {
        r0 = 246;
        g0 = 240;
        b0 = 92;
        r1 = 255;
        g1 = 104;
        b1 = 104;
        bottom = 3.3;
        top = 4.2;

    } else if (SR < 4.9) {
        r0 = 255;
        g0 = 104;
        b0 = 104;
        r1 = 255;
        g1 = 78;
        b1 = 111;
        bottom = 4.2;
        top = 4.9;

    } else if (SR < 5.8) {
        r0 = 255;
        g0 = 78;
        b0 = 111;
        r1 = 198;
        g1 = 69;
        b1 = 184;
        bottom = 4.9;
        top = 5.8;

    } else if (SR < 6.7) {
        r0 = 198;
        g0 = 69;
        b0 = 184;
        r1 = 101;
        g1 = 99;
        b1 = 222;
        bottom = 5.8;
        top = 6.7;

    } else if (SR < 7.7) {
        r0 = 101;
        g0 = 99;
        b0 = 222;
        r1 = 24;
        g1 = 21;
        b1 = 142;
        bottom = 6.7;
        top = 7.7;

    } else if (SR < 9) {
        r0 = 24;
        g0 = 21;
        b0 = 142;
        r1 = 0;
        g1 = 0;
        b1 = 0;
        bottom = 7.7;
        top = 9;
    }

    const s = (SR - bottom) / (top - bottom);

    // https://zhuanlan.zhihu.com/p/37800433/ 伽马的作用

    const color2Hex = (c0 = 0, c1 = 0, s = 0) => {
        return clamp(
            Math.round(Math.pow((1 - s) * Math.pow(c0, gamma) + s * Math.pow(c1, gamma), 1 / gamma)
        ), 255, 0).toString(16).padStart(2, '0');
    }

    const gHex = color2Hex(g0, g1, s);
    const bHex = color2Hex(b0, b1, s);
    const rHex = color2Hex(r0, r1, s);

    color = '#' + rHex + gHex + bHex;

    if (SR < 0.1) {
        color = '#AAAAAA';
    } else if (SR >= 9) {
        color = '#000';
    }

    return color;
}

//获取玩家名次的背景色，给一二三名赋予特殊的颜色
export function getUserRankColor(rank = 0) {
    switch (rank) {
        case 1:
            return '#B7AA00'; //冠军
        case 2:
            return '#A0A0A0'; //亚军
        case 3:
            return '#AC6A00'; //季军
        default:
            return '#46393f';
    }
}

/**
 * 获取模组颜色
 * @param mod {string | {acronym: string}}
 * @returns {string}
 */
export function getModColor(mod = '' || {acronym: ''}) {
    if (mod?.acronym != null) mod = mod.acronym

    let color;
    switch (mod.toString().toUpperCase()) {
        case "NF":
            color = '#0068B7';
            break;
        case "EZ":
            color = '#22AC38';
            break;
        case "HD":
        case "FI":
            color = '#F8B551';
            break;
        case "HR":
            color = '#D32F2F';
            break;
        case "SD":
            color = '#FF9800';
            break;
        case "DT":
            color = '#00A0E9';
            break;
        case "RX":
            color = '#BFC31F';
            break;
        case "HT":
            color = '#BDBDBD';
            break;
        case "NC":
            color = '#9922EE';
            break;
        case "FL":
            color = '#000';
            break;
        case "AT":
            color = '#00B7EE';
            break;
        case "CN":
            color = '#00B7EE';
            break;
        case "SO":
            color = '#B28850';
            break;
        case "AP":
            color = '#B3D465';
            break;
        case "PF":
            color = '#FFF100';
            break;
        case "4K":
        case "5K":
        case "6K":
        case "7K":
        case "8K":
        case "9K":
            color = '#616161';
            break;
        case "RD":
            color = '#009944';
            break;
        case "MR":
            color = '#007130';
            break;
        case "TD":
            color = '#7ECEF4';
            break;

        // Lazer 模组

        case "DC":
            color = '#DADADA';
            break;
        case "CO":
            color = '#F8B551';
            break;
        case "BL":
            color = '#EB6100';
            break;
        case "ST":
            color = '#D32F2F';
            break;
        case "AC":
            color = '#9E040D';
            break;

        case "DA":
            color = '#601986';
            break;
        case "CL":
        case "TP":
            color = '#920783';
            break;
        case "AL":
            color = '#F16DAA';
            break;
        case "SG":
            color = '#F59AC3';
            break;
        case "SW":
            color = '#7B0046';
            break;
        case "DS":
        case "BM":
            color = '#9E005E';
            break;
        case "IN":
            color = '#5F5BA8';
            break;
        case "CS":
            color = '#A086BF';
            break;
        case "HO":
            color = '#8781BE';
            break;
        case "TR":
        case "WG":
        case "SI":
        case "GR":
        case "DF":
        case "WU":
        case "WD":
        case "TC":
        case "BR":
        case "AD":
        case "MU":
        case "NS":
        case "MG":
        case "RP":
        case "AS":
        case "FR":
        case "FF":
        case "BU":
        case "SY":
        case "DP":
            color = '#EA68A2';
            break;

        case "NM":
            color = '#22AC38';
            break;
        case "FM":
            color = '#9922EE';
            break;
        case "EX": //没错，以下这两个都是表示难一点的图
            color = '#FF9800';
            break;
        case "DI":
            color = '#FF6100';
            break;
        case "TB":
            color = '#000';
            break;

        case "RC":
            color = '#22AC38';
            break;
        case "LN":
            color = '#00A0E9';
            break;
        case "HB":
            color = '#FF9800';
            break;
        case "SV":
            color = '#9922EE';
            break;

        case "SP":
            color = '#EA68A2';
            break;

        default:
            color = 'none';
            break;
    }

    return color;
}

export function getMapStatusColor(ranked = null) {
    switch (ranked) {
        case -2: return hsl2hex(0, 0, 0)
        case -1: return hsl2hex(20, 1, 0.7)
        case 0: return hsl2hex(45, 1, 0.7)
        case 1: return hsl2hex(90, 1, 0.7)
        case 2: return hsl2hex(90, 1, 0.7)
        case 3: return hsl2hex(200, 1, 0.7)
        case 4: return hsl2hex(333, 1, 0.7)
        default: return 'none'
    }
}

/**
 * @function 获取评级颜色
 * @return {string} 返回色彩
 * @param rank 输入评级
 */
export function getRankColor(rank = 'F') {
    if (typeof rank !== 'string') return 'none';
    let color;
    switch (rank.toString().toUpperCase()) {
        case "PF":
        case "XH":
        case "SSH":
        case "EX":
        case "X+":
            color = '#FAFAFA';
            break;
        case "X":
        case "SS":
            color = '#FFFF00';
            break;
        case "SH":
            color = '#BDBDBD';
            break;
        case "SP":
        case "S+":
            color = '#E86100';
            break; // S+
        case "S":
            color = '#FF9800';
            break;
        case "A":
            color = '#22AC38';
            break;
        case "B":
            color = '#00A0E9';
            break;
        case "C":
            color = '#9922EE';
            break;
        case "D":
            color = '#D32F2F';
            break;
        case "F":
            color = '#616161';
            break;
        case "FC":
            color = '#7ECEF4';
            break;
        default:
            color = 'none';
            break;
    }

    return color;
}

/**
 * @function 获取数据在某组数组中的对应位置的色彩。色彩是PS中蓝色往左到深蓝色。
 * @return {String} 返回色彩
 * @param base 数据
 * @param staffArray 从小到大，用于标定的正数数组。必须有13个元素。蓝-1-2-绿-3-黄-橙-4-红-5-粉-6-紫-深蓝
 * @param brightness 亮度。2-蜡笔色、1-浅色、0-纯色、-1暗色、-2深黑。
 */
export function getColorInSpectrum(base = 0, staffArray = [0], brightness = 0) {
    if (staffArray.length !== 13) throw new Error('staffArray length should be exactly 13')

    let colorArr = [];

    let colorB2Arr = [
        '#7FCEF4', '#85CCC9', '#8AC998', '#ACD598',
        '#CCE199', '#FFF899', '#FACC89', '#F6B380',
        '#F29B76', '#F29C9F', '#F19FC2', '#C491BF',
        '#AA89BE', '#8F82BC'];
    let colorB1Arr = [
        '#00B7EE', '#12B4B1', '#31B16C', '#7FC269',
        '#B3D465', '#FFF45C', '#F7B551', '#F19149',
        '#EC6841', '#EB6877', '#EA68A2', '#AD5DA1',
        '#8957A1', '#5F52A0'];
    let colorB0Arr = [
        '#00A1E9', '#009E97', '#009944', '#23AC39',
        '#8FC41F', '#FFF100', '#F39800', '#EB6101',
        '#E60013', '#E50050', '#E4007F', '#930883',
        '#601986', '#1D2088'];
    let colorB_1Arr = [
        '#0075A9', '#00736D', '#007130', '#0D7D25',
        '#648C0C', '#B7AB00', '#AD6B00', '#A84200',
        '#A40000', '#A40036', '#A4005B', '#6A005F',
        '#450062', '#110B64'];
    let colorB_2Arr = [
        '#005982', '#005853', '#005620', '#005F16',
        '#496A00', '#8A8100', '#834F00', '#7F2E00',
        '#7D0000', '#7D0023', '#7E0043', '#500047',
        '#32004A', '#05004C'];

    switch (brightness) {
        case 2:
            colorArr = colorB2Arr;
            break;
        case 1:
            colorArr = colorB1Arr;
            break;
        case 0:
            colorArr = colorB0Arr;
            break;
        case -1:
            colorArr = colorB_1Arr;
            break;
        case -2:
            colorArr = colorB_2Arr;
            break;
    }

    if (base >= staffArray[12]) {
        return colorArr[13];
    }

    for (let i = 0; i < 13; i++) {
        if (base < staffArray[i]) {
            return colorArr[i];
        }
    }
}

/**
 * 根据名字推断主页奖牌的种类。
 * @param badge_name 奖牌名称
 * @returns {string} 颜色
 */
export function getBadgeColor(badge_name = '') {
    const b = badge_name?.toLowerCase() || ""
    if (b.includes('world cup pooling')) {
        return '#A086BF';
    } else if (b.includes('world cup news post')) {
        return '#5F5BA8';
    } else if (b.includes('world cup art')) {
        return '#8781BE';
    } else if (b.includes('mappers\' guild')) {
        return '#FF9800';
    } else if (b.includes('exemplary')) {
        return '#12B4B1';
    } else if (b.includes('mapper\'s choice')) {
        return '#007130';
    } else if (b.match(/.*(winn(er|ing)|1st|victor(y|ious)|champion).*/g)) {
        return '#FFF100';
    } else if (b.match(/.*((seco|2)nd|top\s?2).*/g)) {
        return '#CCC';
    } else if (b.match(/.*((thi|3)rd|top\s?3).*/g)) {
        return '#AC6A00';
    } else if (b.match(/.*([otmc]wc)|(osu!(catch|mania|taiko)? world cup).*/g)) {
        return '#666';
    } else if (b.includes('mapping')) {
        return '#00A0E9';
    } else if (b.includes('project loved')) {
        return '#EA68A2';
    } else if (b.includes('beatmap nominator')) {
        return '#9922EE';
    } else if (b.includes('nomination assessment team')) {
        return '#D32F2F';
    } else if (b.includes('quality assurance team')) {
        return '#FF6100';
    } else if (b.includes('global moderation team')) {
        return '#22AC38';
    } else if (b.includes('community mentorship program')) {
        return '#0068B7';
    } else if (b.includes('beatmap spotlights')) {
        return '#593350';
    } else if (b.includes('wiki')) {
        return '#BFC31F';
    } else if (b.includes('top scorer')) {
        return '#B3D465';
    } else {
        return '#1c1719'
    }
}

function clamp01(number = 0) {
    return clamp(number, 1, 0)
}

function clamp(number = 0, max = number, min = number) {
    return Math.min(Math.max(number, min), max)
}

