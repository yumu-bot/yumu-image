
export function getStarRatingColor(SR = 0) {
    let color;
    let r0 = 0;
    let g0 = 0;
    let b0 = 0;
    let r1 = 0;
    let b1 = 0;
    let g1 = 0;
    let r2;
    let b2;
    let g2;
    let s = 0;
    let gamma = 2.2; //伽马值


    if (SR < 1.25) {
        r0 = 66;
        g0 = 144;
        b0 = 251;
        r1 = 79;
        g1 = 192;
        b1 = 255;
        s = (SR - 0.1) / (1.25 - 0.1)

    } else if (SR < 2) {
        r0 = 79;
        g0 = 192;
        b0 = 255;
        r1 = 79;
        g1 = 255;
        b1 = 213;
        s = (SR - 1.25) / (2 - 1.25)

    } else if (SR < 2.5) {
        r0 = 79;
        g0 = 255;
        b0 = 213;
        r1 = 124;
        g1 = 255;
        b1 = 79;
        s = (SR - 2) / (2.5 - 2)

    } else if (SR < 3.3) {
        r0 = 124;
        g0 = 255;
        b0 = 79;
        r1 = 246;
        g1 = 240;
        b1 = 92;
        s = (SR - 2.5) / (3.3 - 2.5)

    } else if (SR < 4.2) {
        r0 = 246;
        g0 = 240;
        b0 = 92;
        r1 = 255;
        g1 = 104;
        b1 = 104;
        s = (SR - 3.3) / (4.2 - 3.3)

    } else if (SR < 4.9) {
        r0 = 255;
        g0 = 104;
        b0 = 104;
        r1 = 255;
        g1 = 78;
        b1 = 111;
        s = (SR - 4.2) / (4.9 - 4.2)

    } else if (SR < 5.8) {
        r0 = 255;
        g0 = 78;
        b0 = 111;
        r1 = 198;
        g1 = 69;
        b1 = 184;
        s = (SR - 4.9) / (5.8 - 4.9)

    } else if (SR < 6.7) {
        r0 = 198;
        g0 = 69;
        b0 = 184;
        r1 = 101;
        g1 = 99;
        b1 = 222;
        s = (SR - 5.8) / (6.7 - 5.8)

    } else if (SR < 7.7) {
        r0 = 101;
        g0 = 99;
        b0 = 222;
        r1 = 24;
        g1 = 21;
        b1 = 142;
        s = (SR - 6.7) / (7.7 - 6.7)

    } else if (SR < 9) {
        r0 = 24;
        g0 = 21;
        b0 = 142;
        r1 = 0;
        g1 = 0;
        b1 = 0;
        s = (SR - 7.7) / (9 - 7.7)
    }

    // https://zhuanlan.zhihu.com/p/37800433/ 伽马的作用

    r2 = Math.pow((1 - s) * Math.pow(r0, gamma) + s * Math.pow(r1, gamma), 1 / gamma);
    g2 = Math.pow((1 - s) * Math.pow(g0, gamma) + s * Math.pow(g1, gamma), 1 / gamma);
    b2 = Math.pow((1 - s) * Math.pow(b0, gamma) + s * Math.pow(b1, gamma), 1 / gamma);

    let colorR = Math.round(r2).toString(16).padStart(2, '0')
    let colorG = Math.round(g2).toString(16).padStart(2, '0')
    let colorB = Math.round(b2).toString(16).padStart(2, '0')

    color = '#' + colorR + colorG + colorB

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

export function getModColor(Mod = '') {
    let color;
    switch (Mod) {
        case "NF":
            color = '#0068B7';
            break;
        case "EZ":
            color = '#22AC38';
            break;
        case "HD":
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
            color = '#9E005E';
            break;
        case "IV":
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
            color = '#EA68A2';
            break;

        case "NM":
            color = '#22AC38';
            break;
        case "FM":
            color = '#00A0E9';
            break;
        case "EX": //没错，以下这两个都是表示难一点的图
            color = '#FF9800';
            break;
        case "DF":
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
            color = '#920783';
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

/**
 * @function 获取评级颜色
 * @return {String} 返回色彩
 * @param {String} 输入评级
 */
export function getRankColor(Rank = 'F') {
    if (typeof Rank !== 'string') return 'none';
    let color;
    switch (Rank.toUpperCase()) {
        case "XH":
        case "SSH":
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