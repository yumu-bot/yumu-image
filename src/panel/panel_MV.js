import {
    exportJPEG, getImageFromV3,
    getPanelNameSVG, getSvgBody, isASCII, isNotBlankString,
    readTemplate, round,
    setImage,
    setText, setTexts,
    thenPush
} from "../util/util.js";
import {colorArray} from "../util/color.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {BerlinBold, poppinsBold, PuHuiTi, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getMaimaiCover, getMaimaiDifficultyColors, getMaimaiPlate, getMaimaiRankBG} from "../util/maimai.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MV(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MV(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * MAIMAI 牌子完成度列表。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MV(
    data = {
        user: {
            name: 'Muz',
            probername: 'Muziya',
            dan: 0,
            rating: 14660,
            base: 0,
            additional: 0
        },
        plate: 1,
        plate_list: [
            { star: '15', count: 0, finished: 0 },
            { star: '14+', count: 9, finished: 9, progress: [Array] },
            { star: '14', count: 20, finished: 20, progress: [Array] },
            { star: '13+', count: 25, finished: 25, progress: [Array] },
            {star: '13', count: 42, finished: 42, progress: [
                    {
                        title: 'Shooting Shower～DANCE TIME(シンディ)～',
                        song_id: 11570,
                        score: {
                            independent_id: 115703,
                            achievements: 100.7895,
                            ds: 13,
                            dxScore: 1514,
                            fc: 'fcp',
                            fs: 'fsd',
                            level: '13',
                            level_index: 3,
                            level_label: 'Master',
                            ra: 292,
                            rate: 'sssp',
                            song_id: 11570,
                            title: 'Shooting Shower～DANCE TIME(シンディ)～',
                            type: 'DX',
                            max: 0,
                            position: 0,
                            bpm: 0,
                            is_utage: false,
                            is_deluxe: true
                        },
                        required: 'sss',
                        completed: true
                    },

                ]},
            { star: '12+', count: 29, finished: 29, progress: [Array] },
            { star: '12-', count: 367, finished: 89 }

        ],
        count_15: 492,
        finished_15: 214,
        count_12: 367,
        finished_12: 89,
    }
) {
    let svg = readTemplate('template/Panel_MA.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_card_i = /(?<=<g id="CardI">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MA1-1\);">)/;

    const panel_name = getPanelNameSVG('Maimai Version Plate (!ymmv)', 'MV');

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.maiPlayer2CardA1(data.user));

    const componentMV = component_MV(
        {
            count_15: data.count_15,
            finished_12: data.finished_12,
            finished_15: data.finished_15,
            plate: await getMaimaiPlate(data?.plate),
            count_12: data.count_12,
        }
    )

    // 插入卡片
    const body_a1 = getSvgBody(40, 40, cardA1)
    const body_mv = getSvgBody(1300, 40, componentMV)

    svg = setTexts(svg, [body_a1, body_mv], reg_card_a1);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath("maimai"), reg_banner, 0.8);

    // 临时
    const plate_list = data?.plate_list || []

    let data_mv = [];

    const param_progress = plate_list
        .filter(item =>
            item.progress &&
            Array.isArray(item.progress) &&
            item.progress.length > 0)
        .flatMap(item => item.progress);

    await Promise.allSettled(
        param_progress.map((param) => {
            return card_MV(progress2CardMV(param))
        })
    ).then(results => thenPush(results, data_mv))

    // 假设 offsets = [0, 2, 3]
    // 含义：跳过 -> 空位 -> 放置 2 个卡片 -> 空位 -> 放置 3 个卡片
    let offsets = data?.plate_list.map(item => item?.count ?? 0) || [];
    let offsets_info = data?.plate_list.map(item => {
        const { progress, ...rest } = item;

        return {
            ...rest
        }
    })

    let mix_pool = [];
    let data_pool = [...data_mv]; // 复制一份数据池，方便剪切

    // 遍历所有的 offsets 和对应的 info
    offsets.forEach((count, index) => {
        if (count === 0) return;

        mix_pool.push({
            isGap: true,
            info: offsets_info[index] // 直接把 info 存进去，渲染时更方便
        });

        if (count > data_pool.length) {
            return;
        }

        const splice = data_pool.splice(0, count)

        mix_pool.push(...splice)
    });

    // 4. 如果 offsets 跑完了，池子里还有剩下的（虽然按逻辑不应该有），也补上去
    if (data_pool.length > 0) {
        mix_pool.push(...data_pool);
    }

    // --- 渲染逻辑 ---
    const final_length = mix_pool.length;
    const mv_height = Math.max(Math.ceil(final_length / 12) * 146 - 20, 0);

    let string_sd = '';
    let base_sd = '';

    mix_pool.forEach((item, i) => {
        const x = i % 12;
        const y = Math.floor(i / 12);

        // 检查是否是我们标记的“空位”对象
        if (item && item.isGap) {
            const info = item.info

            let end_index
            if (info.star !== "12-") {
                end_index = i + info.count
            } else {
                end_index = i
            }

            const colors = getLevelColor(info.star);

            const area = drawArea(i, end_index, colors, 0.4);
            const label = getSvgBody(40 + (135 + 20) * x, 330 + 146 * y, label_MV({ ...info, colors: colors }));


            base_sd += (area + label);
        } else if (item !== null) {
            // 正常渲染卡片
            string_sd += getSvgBody(40 + (135 + 20) * x, 330 + 146 * y, item);
        }
    });

    // 计算面板高度
    const card_height = mv_height + 80
    const panel_height = card_height + 290

    svg = setTexts(svg, [string_sd, base_sd], reg_card_i)

    svg = setText(svg, panel_height, reg_panelheight);
    svg = setText(svg, card_height, reg_cardheight);

    return svg
}

function progress2CardMV(progress = {
    title: 'Shooting Shower～DANCE TIME(シンディ)～',
    song_id: 11570,
    star: 13,
    index: 3,
    score: {
        independent_id: 115703,
        achievements: 100.7895,
        ds: 13,
        dxScore: 1514,
        fc: 'fcp',
        fs: 'fsd',
        level: '13',
        level_index: 3,
        level_label: 'Master',
        ra: 292,
        rate: 'sssp',
        song_id: 11570,
        title: 'Shooting Shower～DANCE TIME(シンディ)～',
        type: 'DX',
        max: 0,
        position: 0,
        bpm: 0,
        is_utage: false,
        is_deluxe: true
    },
    required: 'sss',
    completed: true
},) {
    return {
        left1_text: (progress.song_id ?? 0).toString(),
        left2_text: (progress.star ?? 0).toString(),

        left1_colors: (progress.song_id >= 10000) ? colorArray.amber : colorArray.deep_blue,
        left2_colors: getMaimaiDifficultyColors(progress.index),

        left2_text_color: progress.index >= 4 ? '#1C1719' : '#fff',

        title_text: progress.title ?? '',
        song_id: progress.song_id,

        rank: progress.score?.rate,
        combo: progress.score?.fc,
        sync: progress.score?.fs,

        required: progress.required,
        completed: progress.completed,
    }
}

function component_MV(data = {
    plate: '',
    count_15: 0,
    finished_15: 0,
    count_12: 0,
    finished_12: 0,
}){

    // 读取模板
    let svg =
        `   <defs>
            <clipPath id="clippath-OV-1">
                <rect id="SR_Base" x="20" y="118" width="540" height="30" rx="15" ry="15" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-OV-2">
                <rect id="Plate_Base" x="20" y="20" width="540" height="87" rx="5" ry="5" style="fill: none;"/>
            </clipPath>
            <linearGradient id="grad-OV-12" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(79,172,254); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(0,242,254); stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad-OV-13" x1="0%" y1="0" x2="100%" y2="50%">
                <stop offset="0%" style="stop-color:rgb(94,220,91); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(202,248,129); stop-opacity:1" />
            </linearGradient>
          </defs>
          <g id="Base_OV">
            <rect id="Base" x="0" y="0" width="580" height="210" rx="20" ry="20" style="fill: #382e32;"/>
            <rect id="Star" x="20" y="118" width="540" height="30" rx="15" ry="15" style="fill: url(#grad-OV-12); fill-opacity: 0.2"/>
          </g>
          <g id="Rect_OV">
            <g id="Clip_OV-3" style="clip-path: url(#clippath-OV-1);">
            
            </g>
            <g id="Clip_OV-2" style="clip-path: url(#clippath-OV-1);">
            
            </g>
          </g>
          <g id="Plate_OV" style="clip-path: url(#clippath-OV-2);">
          </g>
          <g id="Text_OV">
          </g>`;

    const reg_text = /(?<=<g id="Text_OV">)/;
    const reg_plate = /(?<=<g id="Plate_OV" style="clip-path: url\(#clippath-OV-2\);">)/;
    const reg_clip2 = /(?<=<g id="Clip_OV-2" style="clip-path: url\(#clippath-OV-1\);">)/;
    const reg_clip3 = /(?<=<g id="Clip_OV-3" style="clip-path: url\(#clippath-OV-1\);">)/;

    svg = setImage(svg, 20, 20, 540, 87, data?.plate, reg_plate)

    const progress_12 = (data.finished_12 / data.count_12) ?? 0
    const progress_15 = (data.finished_15 / data.count_15) ?? 0

    let width_12
    let width_15

    if (progress_12 <= 0) {
        width_12 = 0
    } else {
        width_12 = Math.max(Math.round(progress_12 * 540), 30)
    }

    if (progress_15 <= 0) {
        width_15 = 0
    } else {
        width_15 = Math.max(Math.round(progress_15 * 540), 30)
    }

    let color_12 = getProgressColor(progress_12, colorArray.blue)
    let color_15 = getProgressColor(progress_15)
    let finished_12_color
    let finished_15_color

    if (progress_12 >= 0.7) {
        finished_12_color = '#382E32'
    } else {
        finished_12_color = '#FFF'
    }

    if (progress_15 >= 0.7) {
        finished_15_color = '#382E32'
    } else {
        finished_15_color = '#FFF'
    }

    const progress_12_rect = PanelDraw.LinearGradientRect(20, 118, width_12, 30, 15, color_12);
    const progress_15_rect = PanelDraw.LinearGradientRect(20, 118, width_15, 30, 15, color_15);

    svg = setText(svg, progress_12_rect, reg_clip2)
    svg = setText(svg, progress_15_rect, reg_clip3)

    const title_12 = poppinsBold.getTextPath('0-12:', 20, 172, 22, 'left baseline')

    const percent_12 = poppinsBold.getTextPath(
        round(progress_12 * 100, 1) + '% [' + (data.count_12 ?? 0) + ']',
        20, 198, 22, 'left baseline'
    )

    const finished_12_width = poppinsBold.getTextWidth((data.finished_12 ?? 0).toString(), 22)
    const finished_15_width = poppinsBold.getTextWidth((data.finished_15 ?? 0).toString(), 22)

    let finished_15_offset

    if (width_15 - width_12 >= (finished_15_width + 20)) {
        finished_15_offset = 20 + width_15 - 10
    } else {
        finished_15_offset = 580 - 30
    }

    let finished_12_offset
    let finished_12_anchor

    if (width_12 >= (finished_12_width + 20) && width_15 - width_12 >= (finished_15_width + 20)) {
        finished_12_offset = 20 + width_12 - 10
        finished_12_anchor = 'right baseline'
    } else {
        finished_12_offset = 30
        finished_12_anchor = 'left baseline'
    }

    const finished_12 = poppinsBold.getTextPath((data.finished_12 ?? 0).toString(),
        finished_12_offset, 140, 22, finished_12_anchor, finished_12_color)

    const main_15_text = round(progress_15 * 100, 1)?.toString();
    const percent_15_text = '% [' + (data.count_15 ?? 0) + ']'

    const main_15_width = Math.round(poppinsBold.getTextWidth(main_15_text, 48) +
        poppinsBold.getTextWidth(percent_15_text, 36))

    const title_15 = poppinsBold.getTextPath('12+:',
        580 - 20 - main_15_width - 10, 172, 22, 'right baseline')

    const main_15 = poppinsBold.get2SizeTextPath(
        main_15_text, percent_15_text, 48, 36, 580 - 20 - main_15_width, 194, 'left baseline'
    )

    const finished_15 = poppinsBold.getTextPath((data.finished_15 ?? 0).toString(),
        finished_15_offset, 140, 22, 'right baseline', finished_15_color)

    svg = setTexts(svg, [title_12, percent_12, finished_12, title_15, main_15, finished_15], reg_text)

    return svg
}

/**
 *
 * @param start_index 当前所在的位置，从 0 开始
 * @param end_index 结束所在的位置，从 0 开始
 * @param colors 颜色，要求后一个亮度更高一点
 * @param opacity
 * @param position_x
 * @param position_y
 */
function drawArea(start_index, end_index, colors = ['none'], opacity = 1, position_x = [100, 0], position_y = [80, 20]) {
    if (start_index > end_index) {
        return ''
    }

    const r = 15

    const global_x = 40
    const global_y = 330

    const step_x = 135 + 20
    const step_y = 126 + 20

    const start_x = start_index % 12
    const start_y = Math.floor(start_index / 12)

    const end_x = end_index % 12
    const end_y = Math.floor(end_index / 12)

    const x = global_x + start_x * step_x - 10
    const y = global_y + start_y * step_y - 10

    const x2 = global_x + (end_x + 1) * step_x - 10
    const y2 = global_y + (end_y + 1) * step_y - 10

    if ((start_x === 0 && end_x === 11) || (start_y === end_y)) {
        // 同一层
        const w = step_x * (end_x - start_x + 1)
        const h = step_y * (end_y - start_y + 1)

        return PanelDraw.LinearGradientRect(x, y, w, h, r, colors, opacity, position_x, position_y)
    } else if (start_x === 0) {
        // 只有右下角缺
        const notches = {
            bottom_right: {
                type: 'concave', w: (11 - end_x) * step_x, h: step_y
            }
        }

        const x2p = global_x + 11 * step_x + 145

        return PanelDraw.RectCornerGradient(x, y, x2p, y2, r, notches, colors, opacity, position_x, position_y)
    } else if (end_x === 11) {
        // 只有左上角缺
        const notches = {
            top_left: {
                type: 'concave', w: (start_x) * step_x, h: step_y
            }
        }

        const xp = global_x - 10

        return PanelDraw.RectCornerGradient(xp, y, x2, y2, r, notches, colors, opacity, position_x, position_y)
    } else {
        // 左上右下都缺

        const notches = {
            top_left: {
                type: 'concave', w: (start_x) * step_x, h: step_y
            },

            bottom_right: {
                type: 'concave', w: (11 - end_x) * step_x, h: step_y
            }
        }

        const xp = global_x - 10

        const x2p = global_x + 12 * step_x - 10

        return PanelDraw.RectCornerGradient(xp, y, x2p, y2, r, notches, colors, opacity, position_x, position_y)
    }
}

function label_MV(data = {
    star: '15', count: 0, finished: 0, colors: ['none']
}) {

    // 模板
    let svg = `<g id="Base-LV">
        <rect x="10" y="10" width="115" height="106" rx="10" ry="10" style="fill: #46393F;"/>
    </g>
    <g id="Background-LV">
        <rect x="108" y="20" width="10" height="85" rx="5" ry="5" style="fill: #54454C;"/>
    </g>
    <g id="Text-LV">
    </g>`

    // 正则
    const reg_text = /(?<=<g id="Text-LV">)/;
    const reg_background = /(?<=<g id="Background-LV">)/;

    const level_text = (data?.star ?? '??')
    const level = BerlinBold.getTextPath(level_text, 64 + 1, 50 + 1, 48, 'center baseline', '#1C1719', 1) +
        BerlinBold.getTextPath(level_text, 64, 50, 48, 'center baseline', '#fff', 1)

    const ratio_text = (data?.finished ?? 0) + ' / ' + (data?.count ?? 0)
    const ratio = poppinsBold.getTextPath(ratio_text, 64 + 1, 80 + 1, 16, 'center baseline', '#1C1719') + poppinsBold.getTextPath(ratio_text, 64, 80, 16, 'center baseline', '#fff')

    const percent_value = ((data?.finished ?? 0) / (data?.count ?? 0)) ?? 0
    const percent_text = Math.round(100 * percent_value).toString() + '%'
    const percent = poppinsBold.getTextPath(percent_text, 64 + 1, 104 + 1, 16, 'center baseline', '#1C1719') + poppinsBold.getTextPath(percent_text, 64, 104, 16, 'center baseline', '#fff')

    const percent_colors = getProgressColor(percent_value)
    const percent_rrect = PanelDraw.LinearGradientRect(108, 20 + 85 - percent_value * 85, 10, percent_value * 85, 5, percent_colors, 1,
        [50, 50], [100, 0])

    const background_rrect = PanelDraw.LinearGradientRect(10, 10, 115, 106, 10, data?.colors, 0.8,
        [100, 0], [80, 20])

    svg = setText(svg, background_rrect, reg_background)
    svg = setTexts(svg, [level, ratio, percent, percent_rrect], reg_text)

    return svg
}

async function card_MV(data = {
    left1_text: '',
    left2_text: '',

    left1_colors: colorArray.blue,
    left2_colors: colorArray.blue,

    left2_text_color: '#fff',

    song_id: 0,

    title_text: '',

    rank: '',
    combo: '',
    sync: '',

    required: '',
    completed: false,
}) {

    // 模板
    let svg = `
    <defs>
    <clipPath id="clippath-CV-1">
        <rect width="135" height="126" rx="10" ry="10" style="fill: none;"/>
    </clipPath>
    <clipPath id="clippath-CV-2">
         <rect x="-5" y="111" width="145" height="20" rx="10" ry="10" style="fill: none;"/>
    </clipPath>
    </defs>
    <g id="Base-CV">
        <rect width="135" height="126" rx="10" ry="10" style="fill: #382E32;"/>
    </g>
    <g id="Background-CV">
        <g style="clip-path: url(#clippath-CV-1);">
        </g>
    </g>
    <g id="Rank-CV">
        <rect x="-5" y="111" width="145" height="20" rx="10" ry="10" style="fill: #46393f;"/>
        <g style="clip-path: url(#clippath-CV-2);">
        </g>
    </g>
    <g id="Overlay-CV">
    </g>
    <g id="Text-CV">
    </g>`


    // 正则
    const reg_text = /(?<=<g id="Text-CV">)/;
    const reg_overlay = /(?<=<g id="Overlay-CV">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CV-1\);">)/
    const reg_rank = /(?<=<g style="clip-path: url\(#clippath-CV-2\);">)/

    const title_text = PuHuiTi.cutStringTail(data.title_text, 15, 130)

    const title_ascii = isASCII(title_text)
    let title

    if (title_ascii) {
        title = torusBold.getTextPath(title_text, 135 / 2, 126, 16, 'center baseline')
    } else {
        title = PuHuiTi.getTextPath(title_text, 135 / 2, 126, 15, 'center baseline')
    }

    // 左侧覆盖部分
    const left1_width = torusBold.getTextWidth(data?.left1_text, 16)
    const left1_rrect_width = Math.max(40, left1_width + 10)
    const left1 = torusBold.getTextPath(data?.left1_text, -5 + (left1_rrect_width / 2), 10, 16,
        'center baseline', '#fff')
    const left1_rrect = PanelDraw.LinearGradientRect(-5, -5, left1_rrect_width, 20, 10, data?.left1_colors, 1,
        [100, 0], [80, 20])

    const left2_width = torusBold.getTextWidth(data?.left2_text, 16)
    const left2_rrect_width = Math.max(40, left2_width + 10)
    const left2 = torusBold.getTextPath(data?.left2_text, -5 + (left2_rrect_width / 2), 35, 16,
        'center baseline', data?.left2_text_color || '#fff')
    const left2_rrect = PanelDraw.LinearGradientRect(-5, 20, left2_rrect_width, 20, 10, data?.left2_colors, 1,
        [100, 0], [80, 20])

    const rank = getMaimaiRankBG(data.rank)

    const image = getImageFromRequired(data.required, data.rank, data.combo, data.sync)

    let completed_opacity
    if (data.completed === true) {
        completed_opacity = 0.2
    } else {
        completed_opacity = 1
    }

    const song_cover = await getMaimaiCover(data.song_id)

    svg = setTexts(svg, [title, left1, left1_rrect, left2, left2_rrect], reg_text)
    svg = setImage(svg, -5, 92, 145, 60, rank, reg_rank, 0.6)
    svg = setImage(svg, 0, -5, 135, 135, song_cover, reg_background, completed_opacity)
    svg = setImage(svg, image.x, image.y, image.w, image.h, image.image, reg_overlay)

    return svg
}

function getImageFromRequired(required = '', rank = '', combo = '', sync = '') {
    let image
    let x
    let y
    let w
    let h

    switch (required) {
        case 'ap':
        case 'fc': {
            let c = ''

            switch (combo) {
                case 'fc':
                    c = 'object-icon-combo-fullcombo.png';
                    break;
                case 'fcp':
                    c = 'object-icon-combo-fullcomboplus.png';
                    break;
                case 'ap':
                    c = 'object-icon-combo-allperfect.png';
                    break;
                case 'app':
                    c = 'object-icon-combo-allperfectplus.png';
                    break;
                default:
                    c = 'object-icon-combo-clear.png';
                    break;
            }
            image = getImageFromV3('Maimai', c)
            x = 109; y = -8;
            w = 36; h = 40;
        } break;

        case 'fsd': {
            let s = ''

            switch (sync?.fs) {
                case 'sync':
                    s = 'object-icon-sync-sync.png';
                    break;
                case 'fs':
                    s = 'object-icon-sync-fullsync.png';
                    break;
                case 'fsp':
                    s = 'object-icon-sync-fullsyncplus.png';
                    break;
                case 'fsd':
                    s = 'object-icon-sync-fullsyncdx.png';
                    break;
                case 'fsdp':
                    s = 'object-icon-sync-fullsyncdxplus.png';
                    break;
                default:
                    s = 'object-icon-sync-solo.png';
                    break;
            }
            image = getImageFromV3('Maimai', s)
            x = 109;
            y = -8;
            w = 36;
            h = 40;
        } break;

        default: {
            if (isNotBlankString(rank)) {
                image = getImageFromV3('Maimai', `object-score-${rank || 'd'}2.png`)
            } else {
                image = ''
            }

            x = 84;
            y = -10;
            w = 56;
            h = 30;
        }
    }

    return {
        image: image,
        x: x,
        y: y,
        w: w,
        h: h,
    }
}

function getProgressColor(percent = 0, default_color = colorArray.gray) {
    const thresholds = [0.5, 0.6, 0.7, 0.8, 0.9, 1];
    const values = [
        colorArray.red,
        colorArray.purple,
        colorArray.cyan,
        colorArray.light_green,
        colorArray.light_yellow,
        colorArray.rainbow
    ];

    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (percent >= thresholds[i]) {
            return values[i];
        }
    }

    return default_color;
}


function getLevelColor(level = '15', default_color = colorArray.green) {
    const thresholds = ['15', '14+', '14', '13+', '13', '12+', '12-'];
    const values = [
        colorArray.sakura,
        colorArray.peach,
        colorArray.purple,
        colorArray.magenta,
        colorArray.red,
        colorArray.amber,
        colorArray.yellow
    ];

    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (level === thresholds[i]) {
            return values[i];
        }
    }

    return default_color;
}