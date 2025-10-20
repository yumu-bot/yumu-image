import {
    getGameMode,
    isEmptyArray,
    isEmptyString,
    isNumber,
    floor,
    rounds,
    floors, isNotEmptyArray, getImageFromV3Cache
} from "./util.js";
import {getModColor, hex2hsl, hsl2hex} from "./color.js";
import {torus, torusBold} from "./font.js";
import {PanelDraw} from "./panelDraw.js";
import moment from "moment";

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
export const getModName = (mod = {acronym: ""} || "") => {
    if (typeof mod === 'string') {
        return mod
    } else if (typeof mod === 'object') {
        return mod?.acronym || ''
    } else return ''
}

export function getLazerModsWidth(mods = [], height = 100, max_width = Infinity, align = 'left', interval = 8, allow_expanded = true, allow_name = true) {
    return drawLazerMods(mods, 0, 0, height, max_width, align, interval, allow_expanded, allow_name, true).width
}

/**
 * 新版绘制标准六边形模组：模组宽 135px 或 235px（含有额外信息），会根据高度来缩放（默认 100px）
 * @param mods 必须是 LazerMod 类，含有模组颜色等信息。注意，如果传入 [ { acronym: '' } ]，会识别为 NM。
 * @param x
 * @param y 如果是从之前的模组绘制转来，这里在 height = 70 的情况下需要 -6
 * @param height 默认 100。如果是从之前的模组绘制转来，这里填 70
 * @param max_width 最大宽度，会影响模组缩小的方式
 * @param align 对齐方式，可输入 left、right、center
 * @param interval 间隔，默认为 8
 * @param allow_expanded 如果为真，则会在模组含有扩展属性，并且宽度足够的时候展示它。如果为假，则不会尝试展示扩展属性
 * @param allow_name 如果为真，则会在模组不含扩展属性，并且宽度足够的时候展示名称。如果为假，则不会尝试展示名称
 * @param only_width 如果为真，则只会返回有效的宽度。
 * @return {{svg: string, width: number}}
 */
export function drawLazerMods(mods = [], x = 0, y = 0, height = 100, max_width = Infinity, align = 'left', interval = 8, allow_expanded = true, allow_name = true, only_width = false) {
    if (isEmptyArray(mods)) return {
        svg: '',
        width: 0,
    }

    const scale = height / 100

    const mods_has_settings = []
    const mods_no_settings = []

    mods.forEach((mod) => {
        if (mod?.settings != null) {
            mods_has_settings.push(mod)
        } else {
            mods_no_settings.push(mod)
        }
    })

    const mods_sorted = mods_has_settings.concat(mods_no_settings)

    // 完全展开，不含设置的模组显示模组名
    const full_width = getLazerModWidth(mods_sorted.length, 235, scale, interval)

    // 只展开含有设置的模组，不含设置的模组不显示模组名
    const standard_width = getLazerModWidth(mods_has_settings.length, 235, scale, interval)
        + getLazerModWidth(mods_no_settings.length, 135, scale, interval)
        + getLazerModInterval(mods_has_settings, mods_no_settings, scale, interval)

    // 只展开含有设置的模组，不含设置的模组不显示模组名并重叠
    const half_width = getLazerModWidth(mods_has_settings.length, 235, scale, interval)
        + getLazerModWidth(mods_no_settings.length, 135, scale, interval - 135 * scale / 2)
        + getLazerModInterval(mods_has_settings, mods_no_settings, scale, 235 * scale - (interval - 135 * scale / 2))

    // 只展开含有设置的模组，不含设置的模组不显示模组名并最小重叠
    const minimum_width = getLazerModWidth(mods_has_settings.length, 235, scale, interval)
        + getLazerModWidth(mods_no_settings.length, 135, scale, interval - 135 * scale * 3 / 4)
        + getLazerModInterval(mods_has_settings, mods_no_settings, scale, 235 * scale - (interval - 135 * scale * 3 / 4))

    let total_width
    let lx

    // 展示默认属性
    let is_expanded

    // 展示模组名
    let is_name

    // 展示压缩过后的模组名
    let is_side_name

    let no_settings_offset
    let has_settings_offset

    // 有含有属性的模组
    const has_expanded_mod = isNotEmptyArray(mods_has_settings)

    if (full_width <= max_width && allow_name === true) {
        total_width = full_width

        is_expanded = allow_expanded
        is_name = true
        is_side_name = false
        no_settings_offset = interval + 235 * scale
        has_settings_offset = interval + 235 * scale
    } else if (standard_width <= max_width) {
        total_width = standard_width

        is_expanded = allow_expanded
        is_name = false
        is_side_name = false
        no_settings_offset = interval + 135 * scale
        has_settings_offset = interval + 235 * scale
    } else if (half_width <= max_width) {
        total_width = half_width

        is_expanded = allow_expanded
        is_name = false
        is_side_name = false
        no_settings_offset = interval + (135 / 2) * scale
        has_settings_offset = interval + 235 * scale
    } else if (minimum_width <= max_width && has_expanded_mod) {
        total_width = minimum_width

        is_expanded = allow_expanded
        is_name = false
        is_side_name = true
        no_settings_offset = interval + (135 * 3 / 4) * scale
        has_settings_offset = interval + 235 * scale
    } else {
        total_width = max_width

        is_expanded = false
        is_name = false
        is_side_name = true
        no_settings_offset = Math.max((max_width + interval - 135 * scale) / (mods_sorted.length), 4)
        //(max_width - 135 * scale * mods_sorted.length) / (mods_sorted.length - 1)
        has_settings_offset = no_settings_offset
    }

    switch (align) {
        case 'right': lx = x - scale * (((is_expanded && has_expanded_mod) || is_name) ? 235 : 135); break;
        case 'center': lx = x - total_width / 2; break;
        default: lx = x
    }

    let svg = '';

    let delta_x = 0

    mods_sorted.forEach((v, i) => {

        // 最上面的模组不需要显示名称，因为必然能看清图标
        if (i === mods_sorted.length - 1) {
            is_side_name = false
        }

        if (i === 0) {
            delta_x = 0
        } else if (is_name || (is_expanded && v?.settings != null)) {
            if (align === 'right') {
                delta_x -= has_settings_offset
            } else {
                delta_x += has_settings_offset
            }
        } else {
            if (align === 'right') {
                delta_x -= no_settings_offset
            } else {
                delta_x += no_settings_offset
            }
        }

        if (!only_width) {
            svg += getLazerModPath(v, lx + delta_x, y, height, is_expanded, is_name, is_side_name);
        }
    });

    return {
        svg: svg,
        width: total_width,
    }
}

function getLazerModWidth(count = 0, mod_width = 135, scale = 1, interval = 8) {
    return Math.max(count * (mod_width * scale + interval) - interval, 0)
}

function getLazerModInterval(mods1 = [], mods2 = [], scale = 1, interval = 8) {
    if (isNotEmptyArray(mods1) && isNotEmptyArray(mods2)) {
        return scale * interval
    } else {
        return 0
    }
}

/**
 *
 * 新版绘制标准六边形模组：模组宽 135px 或 235px（含有额外信息），会根据高度来缩放（默认 100px）
 * @param mod 必须是 LazerMod 类，含有模组颜色等信息
 * @param x
 * @param y 如果是从之前的模组绘制转来，这里在 height = 70 的情况下需要 -6
 * @param height 默认 100。如果是从之前的模组绘制转来，这里填 70
 * @param allow_expanded 如果为真，则会在模组含有扩展属性，并且宽度足够的时候展示它。如果为假，则不会尝试展示扩展属性
 * @param allow_name 如果为真，则会在模组不含扩展属性，并且宽度足够的时候展示名称。如果为假，则不会尝试展示名称
 * @param allow_side_name 如果为真，则会在以上都为假时，尝试在模组右下角显示名称。
 * @return {string}
 */
function getLazerModPath(mod = {
    acronym: "",
    color: "",
    settings: null,
}, x = 0, y = 0, height = 100, allow_expanded = true, allow_name = true, allow_side_name = false) {
    const scale = height / 100

    const mod_name = mod?.acronym || 'NM'
    const mod_color = mod?.color || getModColor(mod_name)

    // 避免重名
    const index = mod_name + Math.floor(Math.random() * 1000000) + moment().toDate().getMilliseconds()

    const hsl = hex2hsl(mod_color)

    const is_dark = hsl.l <= 0.3

    let line_color;
    let background_color;

    if (is_dark) {
        line_color = hsl2hex(hsl.h, hsl.s, 0.1)
        background_color = hsl2hex(hsl.h, hsl.s, 0.9)
    } else {
        line_color = hsl2hex(hsl.h, hsl.s, Math.max(hsl.l, 0.5))
        background_color = hsl2hex(hsl.h, hsl.s, 0.2)
    }

    const has_settings = mod.settings != null

    // def 这里放图标和字体

    const def_settings = (has_settings) ? getMaskFromImage(91 * scale, 2 * scale, 40 * scale, 28 * scale,
            getImageFromV3Cache('Mods', 'at.png'), `mask-M-Settings-${index}`)
        : ''

    // y 本来是 8
    const def_icon = getMaskFromImage(7.5 * scale, 10 * scale, 120 * scale, 84 * scale,
        getImageFromV3Cache('Mods', mod_name?.toLowerCase() + '.png'), `mask-M-Icon-${index}`)

    const def_mod_base = getMaskFromImage(0, 3 * scale, 135 * scale, 97 * scale,
        getImageFromV3Cache('Mods', 'mod-icon.png'), `mask-M-Base-${index}`)

    let def_mod_name
    let def_mod_extender

    let show_extender = true

    if (allow_expanded && has_settings) {
        def_mod_name = getMaskFromPath(getLazerModAdditionalPath(getLazerModAdditional(mod), "#fff", scale), `mask-M-Name-${index}`)
    } else if (allow_name) {
        def_mod_name = getMaskFromPath(getLazerModNamePath(mod_name, "#fff", scale),
            `mask-M-Name-${index}`)
    } else {
        def_mod_name = ''
        show_extender = false
    }

    if (show_extender) {
        def_mod_extender = getMaskFromImage(100 * scale, 17 * scale, 135 * scale, 68 * scale,
            getImageFromV3Cache('Mods', 'mod-icon-extender.png'), `mask-M-Extender-${index}`
        )
    } else {
        def_mod_extender = ''
    }

    // g 这里放色块
    const color_settings = PanelDraw.Rect(91 * scale, 2 * scale, 40 * scale, 28 * scale, 0, line_color, 1)
    const color_icon = PanelDraw.Rect(7.5 * scale, 8 * scale, 120 * scale, 84 * scale, 0, background_color, 1)
    const color_mod_base = PanelDraw.Rect(0, 3 * scale, 135 * scale, 97 * scale, 0, line_color, 1)
    const color_mod_name = show_extender ?
        PanelDraw.Rect(130 * scale, 0, 105 * scale, 100 * scale, 0, line_color, 1)
        : ''
    const color_mod_extender = show_extender ?
        PanelDraw.Rect(100 * scale, 17 * scale, 135 * scale, 68 * scale, 0, background_color, 1)
        : ''

    const settings_base = (has_settings) ?
        PanelDraw.Circle((95 + 16) * scale, 16 * scale, 16 * scale, background_color)
        : ''

    const side_name = (!show_extender && allow_side_name) ? `<g transform="rotate(-60 ${92 * scale} ${72 * scale})">`
        + torusBold.getTextPath(mod?.acronym || '', 92 * scale, 72 * scale, 20 * scale, 'left top', background_color)
        + '</g>' : ''

    // 拼合 svg

    let body = `<defs>`
        + def_settings
        + def_icon
        + def_mod_base
        + def_mod_name
        + def_mod_extender
        + `</defs>`
        + `<g id="Extender_M_${index}" mask="url(#mask-M-Extender-${index})">` + (show_extender ? color_mod_extender : '') + '</g>'
        + `<g id="Name_M_${index}" mask="url(#mask-M-Name-${index})">` + (show_extender ? color_mod_name : '') + '</g>'
        + `<g id="Base_M_${index}" mask="url(#mask-M-Base-${index})">` + color_mod_base + '</g>'
        + `<g id="Icon_M_${index}" mask="url(#mask-M-Icon-${index})">` + color_icon + '</g>'
        + `<g id="Settings_Base_M_${index}">` + settings_base + '</g>'
        + `<g id="Side_Name_M_${index}">` + side_name + '</g>'
        + `<g id="Settings_M_${index}" mask="url(#mask-M-Settings-${index})">` + ((has_settings) ? color_settings : '') + '</g>'

    return `<g id="Mod_${index}" transform="translate(${x} ${y})">` + body + '</g>';
    
    function getMaskFromImage(x, y, w, h, link = '', mask = 'mask') {
        return `
        <mask id="${mask}">
            <image x="${x}" y="${y}" width="${w}" height="${h}" xlink:href="${link}"/> 
        </mask>
    `
    }

    function getMaskFromPath(path = '', mask = 'mask') {
        return `
        <mask id="${mask}">
            ${path}
        </mask>
    `
    }

    function getLazerModAdditionalPath(additional = {
        large: '',
        small: '',
    }, color = '#fff', scale = 1) {
        return torusBold.get2SizeTextPath(
            additional.large, additional.small,
            48 * scale, 30 * scale, 176 * scale, 66 * scale, 'center baseline', color)
    }

    function getLazerModNamePath(name = 'NM', color = '#fff', scale = 1) {
        return torusBold.getTextPath(
            name, 176 * scale, 66 * scale, 48 * scale, 'center baseline', color)
    }
}

/**
 *
 * @param mod
 * @return {{large: string, small: string}}
 */
function getLazerModAdditional(mod = {}) {
    const s = mod?.settings;

    if (s == null || typeof mod === "string") return {
        large: mod?.acronym?.toString() || mod?.toString() || '',
        small: '',
    }

    let large = ''
    let small = ''

    if (matchAnyMod(mod, ['DT', 'NC', 'HT', 'DC']) && isNumber(s?.speed_change)) {
        const r = rounds(s.speed_change, 2)

        large = r.integer
        small = r.decimal + 'x'
    } else if (matchAnyMod(mod, ['WU', 'WD']) && isNumber(s?.final_rate)) {
        const r = rounds(s.final_rate, 2)

        large = r.integer
        small = r.decimal + 'x'
    } else if (matchMod(mod, 'EZ') && isNumber(s?.extra_lives)) {
        large = s.extra_lives
        small = '+'
    } else if (matchMod(mod, 'AS') && isNumber(s?.initial_rate)) {
        const r = rounds(s.initial_rate, 2)

        large = r.integer
        small = r.decimal + 'x'
    } else if (matchMod(mod, 'AC')) {

        if (isNumber(s?.minimum_accuracy)) {
            large += Math.round(s?.minimum_accuracy * 100).toString()
        } else {
            large += '90'
        }

        if (s?.accuracy_judge_mode === "1") {
            small = '+'
        } else {
            small = '%'
        }

    } else if (matchMod(mod, 'SR')) {
        if (s?.one_sixth_conversion === false) {
            if (s?.one_eighth_conversion === true) {
                large = '-1'
                small = '/8'
            } else if (s?.one_third_conversion === true) {
                large = '-1'
                small = '/3'
            }

        } else {
            large = '-1'
            small = '/6'
        }
    } else if (matchMod(mod, 'DA')) {
        if (s?.extended_limits === true) {
            large += '<>'
        } else if (isNumber(s?.scroll_speed)) {
            const f = floors(s?.scroll_speed, 1)

            large = 'v' + f.integer
            small = f.decimal+ 'x'
        } else if (s?.hard_rock_offsets === true) {
            large = 'HR'
        }
    } else {
        large = 'DA'
        small = ''
    }

    return {
        large: large,
        small: small,
    }
}

/**
 * **已经弃用**<br>
 * 绘画标准六边形模组：模组宽 90，模组文字的偏移量 42，间隔 10
 * @param mods
 * @param x 基准点 x
 * @param y 基准点 y
 * @param align 方向，支持向左、向右、居中
 * @param max_width 模组最大宽度
 */
export function getModsBody(mods = [{acronym: ""}], x, y, align = 'left', max_width = Infinity) {
    const length = (mods || [])?.length || 0
    const mod_width = 90
    const text_height = 42

    if (length === 0) return ''

    const interval = Math.min(10, (max_width - length * mod_width) / (length - 1))

    let lx

    const total_width = Math.min(max_width, interval * (length - 1) + length * mod_width)

    switch (align) {
        case 'right': lx = x - mod_width; break;
        case 'center': lx = x - total_width / 2; break;
        default: lx = x
    }

    let svg = '';

    mods.forEach((v, i) => {
        let delta_x

        if (align === 'right') {
            delta_x = -i * (interval + mod_width)
        } else {
            delta_x = i * (interval + mod_width)
        }

        svg += getModPath(v, lx + delta_x, y, mod_width, text_height, true);
    });

    return svg;

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
 * @param mod {{acronym: string, color: string} | string}
 * @param cx
 * @param cy
 * @param r
 * @param dont_show_nf
 * @returns {string}
 */
export function getModCirclePath(mod = {acronym: "", color: ''}, cx = 0, cy = 0, r = 5, dont_show_nf = false){
    const mod_name = getModName(mod)
    if (isEmptyString(mod_name)) return ''

    if (dont_show_nf === true && (mod_name === 'NF')) return ''; //不画NF的图标，因为没必要

    let mod_color = mod?.color || getModColor(mod_name);

    return PanelDraw.Circle(cx, cy, r, mod_color);
}

/**
 * **已经弃用**<br>
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

        // SR
        one_sixth_conversion: null,
        one_third_conversion: null,
        one_eighth_conversion: null,

        // DA
        extended_limits: null,
        scroll_speed: null,
        hard_rock_offsets: null,
    }
}) {
    const s = mod?.settings;
    if (s == null || typeof mod === "string") return ''

    let info = ''

    if (matchAnyMod(mod, ['DT', 'NC', 'HT', 'DC']) && isNumber(s?.speed_change)) {
        info = s?.speed_change?.toString() + 'x'
    }

    if (matchAnyMod(mod, ['WU', 'WD']) && isNumber(s?.final_rate)) {
        info = s?.final_rate?.toString() + 'x'
    }

    if (matchMod(mod, 'EZ') && isNumber(s?.extra_lives)) {
        info = s?.extra_lives?.toString() + '+'
    }

    if (matchMod(mod, 'AS') && isNumber(s?.initial_rate)) {
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

    if (matchMod(mod, 'SR')) {
        if (s?.one_sixth_conversion === false) {
            if (s?.one_eighth_conversion === true) {
                info = '-1/8'
            } else if (s?.one_third_conversion === true) {
                info = '-1/3'
            }

        } else {
            info = '-1/6'
        }
    }

    if (matchMod(mod, 'DA')) {
        if (s?.extended_limits === true) {
            info = '^11'
        } else if (isNumber(s?.scroll_speed)) {
            info = 'v' + floor(s?.scroll_speed, 1) + 'x'
        } else if (s?.hard_rock_offsets === true) {
            info = 'HR'
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

/**
 *
 * @param {string[]|number} mods
 * @returns {number}
 */
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

/*

export function getAllMod(modInt) {
    let mods = [];
    for (const [mod, i] of Object.entries(ModInt)) {
        if (modInt & i) {
            mods.push(mod);
        }
    }
    return mods;
}

 */

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
        const i = modList[v?.acronym] || 1

        multiplier *= i
    }

    return multiplier;
}