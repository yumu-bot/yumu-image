import {
    exportJPEG, getImageFromV3, getPanelNameSVG, setImage,
    setSvgBody, readTemplate,
    setText, setTexts, getAvatar, readNetImage, getSvgBody
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_A1} from "../card/card_A1.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRankFromValue} from "../util/star.js";
import {LABEL_PPP} from "../component/label.js";
import {getRankColor, getRankColors} from "../util/color.js";
import {card_B6} from "../card/card_B6.js";
import {card_B7} from "../card/card_B7.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_B3(data);
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
        const svg = await panel_B3(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * PP+
 * @param data
 * @return {Promise<string>}
 */
export async function panel_B3(data = {
    isUser: false,
    isVs: false,
    me: {
        id: 2274671,
        mode: 'osu',
        status: 'ranked',
        retries: [
            0,   0,   0, 999, 1611, 739, 378, 297,  27, 252, 279, 486,
            487, 288, 524, 306,  342, 189, 180,  99, 171, 171,  18,  99,
            27,  90,  54, 344,  126,  73, 117,  99,  99, 199, 100,  81,
            54,  37,  36, 108,  171, 117,  27,  81,  38,   9,  23,  27,
            18,   0,   9,   9,    0,  19,  27,  27,   9,  36,  45,  18,
            18,  18,   9,   0,   45,  55,  72,  19,  18,  36,  54,  20,
            9,  72,  27,  18,   63, 145,  18,   9,   9,   9,   9,  72,
            27,  19,   0,  18,   27,  73,  45,  45,   0,  36,  36,  36,
            81,  72,  27,   9
        ],
        fails: [
            9,  54,  72, 774, 3335, 1425, 742, 1542, 947, 423, 522, 324,
            806, 433, 309, 738,  333,  252, 200,  252, 279, 379, 108, 135,
            63,  27,  63,  99,  315,  155, 270,  325, 180, 200, 189, 136,
            163, 126,  72, 164,  414,  261,  81,  100, 144,  81, 271, 217,
            126,  36,  18,   9,   64,   54,  81,   72,  45,  18,  18,  72,
            37,   9,  45,   0,    1,   18,   9,   27,  55,  18,  27,  46,
            18,  54,  45,  18,   18,   45,  90,   72,   9,  18,  27,  45,
            46,  19,   9,  45,   36,    9,  99,   27,   0,  27,   0,  18,
            81,  54,  72,  18
        ],
        convert: false,
        ranked: 1,
        url: 'https://osu.ppy.sh/beatmaps/2274671',
        retry: 11671,
        fail: 20433,
        ar: 9.3,
        od: 8,
        hp: 6,
        cs: 4,
        bpm: 160,
        sid: 1087774,
        beatmapset_id: 1087774,
        difficulty_rating: 5.41,
        total_length: 192,
        user_id: 7003013,
        version: 'Brilliant Dreamland',
        beatmapset: {
            artist: 'Wang Rui',
            covers: [Object],
            creator: 'Muziyami',
            nsfw: false,
            offset: 0,
            source: '小女花不弃',
            spotlight: false,
            status: 'ranked',
            title: 'Tao Hua Xiao',
            video: false,
            ranked: 1,
            storyboard: true,
            tags: 'peach blossom cpop c-pop pop chinese 古风 oriental bilibili cover rearrangement 纳兰寻风 na lan xun feng 西门振 xi men zhen 青萝子 qing luo zi op opening xiao nv hua bu qi i will never let you go houshou hari dacaigou kisaki dahkjdas -ovo-',
            ratings: [Array],
            mappers: [],
            nominators: [],
            public_rating: 9.444444444444443,
            bpm: 162,
            sid: 1087774,
            artist_unicode: '汪睿',
            favourite_count: 423,
            id: 1087774,
            play_count: 212555,
            preview_url: '//b.ppy.sh/preview/1087774.mp3',
            title_unicode: '桃花笑',
            user_id: 7003013,
            can_be_hyped: false,
            discussion_locked: false,
            is_scoreable: true,
            last_updated: 1646464010,
            legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/1005413',
            nominations_summary: [Object],
            ranked_date: 1647193324,
            submitted_date: 1577976073,
            availability: [Object]
        },
        checksum: '7d479062a03c7cde63513138c622d5c1',
        max_combo: 1262,
        accuracy: 8,
        count_circles: 432,
        count_sliders: 405,
        count_spinners: 1,
        drain: 6,
        hit_length: 189,
        is_scoreable: true,
        last_updated: 1646464011,
        mode_int: 0,
        passcount: 6097,
        playcount: 39439
    },

    my: {
        accuracy: 1,
        combo: 956,
        difficulty: {
            jumpAim: 2.057429815359158,
            flowAim: 1.3343698283241225,
            aim: 2.082723073148153,
            precision: 1.193626673055268,
            speed: 2.295319821384985,
            stamina: 1.7423563404156794,
            accuracy: 1.0466624054636704,
            total: 4.423171865176093
        },
        performance: {
            jumpAim: 33.055684811958265,
            flowAim: 9.017781576662994,
            aim: 34.28985561056539,
            precision: 6.454708242741545,
            speed: 43.24087594391863,
            stamina: 18.91366977015664,
            accuracy: 50.00175442319033,
            total: 129.40998690547733
        },
        skill: {
            jumpAim: 33.96563157211957,
            flowAim: 9.266020304016731,
            aim: 35.2337762462058,
            precision: 6.632391472923614,
            speed: 47.16221874374648,
            stamina: 20.62887514360274,
            accuracy: 4.471821737893736,
            total: 337.4939954788446
        },

        advanced_stats: {}
    },

    other: {

    },

    others: {

    },


}) {
    let svg = readTemplate('template/Panel_B.svg');

    const abbr = ['JMP', 'FLW', 'ACC', 'STA', 'SPD', 'PRE']; //决定顺序
    const order = ['jumpAim', 'flowAim', 'precision', 'speed', 'stamina', 'accuracy', 'aim', 'total']

    const LV_BOUNDARY = [11, 9, 7, 5, 3, 1, 0.75, 0.25];

    const isUser = data?.isUser;
    const isVs = data?.isVs;

    const me = data?.me || [];
    const my = data?.my || [];
    const other = data?.other || [];
    const others = data?.others || [];

    const values = order.map(key => my[key]);
    const vs_values = order.map(key => others[key]);

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PB-1\);">)/;
    const reg_left = /(?<=<g id="Left">)/;
    const reg_right = /(?<=<g id="Right">)/;
    const reg_center = /(?<=<g id="Center">)/;
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_hexagon = /(?<=<g id="HexagonChart">)/;

    // 画六个标识
    svg = setText(svg, PanelDraw.HexagonIndex(abbr, 960, 600, 230+30, Math.PI / 3), reg_hexagon);

    // 插入图片和部件（新方法

    let banner;
    let panel_name;
    let type;

    // 获取卡片
    let card_left;
    let card_right = "";

    let label_left = [];
    let label_right = [];
    let graph_left = [];
    let graph_right = [];
    let card_center = [];

    if (isUser) {
        banner = await getAvatar(data?.me?.cover_url, true);

        const levels = my?.advanced_stats?.index ?? []
        const vs_levels = others?.advanced_stats?.index ?? []

        if (isVs) {
            type = 'PX+'
            panel_name = getPanelNameSVG('PP Plus: User VS (!ympx)', 'PX');

            card_left = await card_A1(await PanelGenerate.user2CardA1(me));
            card_right = await card_A1(await PanelGenerate.user2CardA1(other));

            drawUserPlus(label_left, values, vs_values, levels, graph_left, abbr, false);
            drawUserPlus(label_right, vs_values, values, vs_levels, graph_right, abbr, true);

            const value_o1 = my?.performance?.total;
            const level_o1 = my?.advanced_stats?.advanced;

            const rank_o1 = getRoman(level_o1);
            const fake_rank_o1 = getRankFromValue(level_o1, LV_BOUNDARY);
            const icon_colors_o1 = getRankColors(fake_rank_o1);

            card_center.push(card_B7({
                ...LABEL_PPP.OVA,

                value: value_o1,
                data_b: rank_o1,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o1,
                round_level: -2,
            }));

            const value_o2 = others?.performance?.total;
            const level_o2 = others?.advanced_stats?.advanced;

            const rank_o2 = getRoman(level_o2);
            const fake_rank_o2 = getRankFromValue(level_o2, LV_BOUNDARY);
            const icon_colors_o2 = getRankColors(fake_rank_o2);

            card_center.push(card_B7({
                ...LABEL_PPP.OVA,

                value: value_o2,
                data_b: rank_o2,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o2,
                round_level: -2,
            }, true));
        } else {
            type = 'PP+'
            panel_name = getPanelNameSVG('PP Plus: User (!ympp)', 'PP');

            card_left = await card_A1(await PanelGenerate.user2CardA1(me));

            drawUserPlus(label_left, values, [], levels, graph_left, abbr, false);

            const value_o1 = my?.performance?.aim;
            //const rank_o1 = getRankFromValue(value_o1, [6900, 4900, 3800, 3075, 2525, 1975, 1700, 1300]);

            const level_o1 = my?.advanced_stats?.index[my?.advanced_stats?.index.length - 1] || 0;
            const rank_o1 = getRoman(level_o1)

            const fake_rank_o1 = getRankFromValue(value_o1, [6900, 4900, 3800, 3075, 2525, 1975, 1700, 1300]);
            const icon_colors_o1 = getRankColor(fake_rank_o1);

            card_center.push(card_B7({
                ...LABEL_PPP.AIM,

                value: value_o1,
                data_b: rank_o1,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o1,
                round_level: -2,
            }));

            const value_o2 = my?.performance?.total;
            const level_o2 = my?.advanced_stats?.advanced;

            const rank_o2 = getRoman(level_o2);
            const fake_rank_o2 = getRankFromValue(level_o2, LV_BOUNDARY);
            const icon_colors_o2 = getRankColors(fake_rank_o2);

            card_center.push(card_B7({
                ...LABEL_PPP.OVA,

                value: value_o2,
                data_b: rank_o2,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o2,
                round_level: -2,
            }, true));
        }

    } else {
        banner = await readNetImage(me?.beatmapset?.covers?.cover, true);
        if (isVs) {
            type = 'PA+'
            panel_name = getPanelNameSVG('PP Plus: BeatMap (!ympa)', 'PA');

            card_left = card_A2(await PanelGenerate.beatmap2CardA2(me));
            card_right = card_A2(await PanelGenerate.beatmap2CardA2(other));

            drawMapPlus(label_left, values, vs_values, graph_left, abbr, false);
            drawMapPlus(label_right, vs_values, values, graph_right, abbr, true);

            const value_o1 = me?.difficulty?.total;
            const rank_o1 = getRankFromValue(value_o1);
            const icon_colors_o1 = getRankColors(rank_o1);

            card_center.push(card_B7({
                ...LABEL_PPP.OVA,

                value: value_o1,
                data_b: rank_o1,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o1,
                round_level: -2,
            }));

            const value_o2 = others?.difficulty?.total;
            const rank_o2 = getRankFromValue(value_o2);
            const icon_colors_o2 = getRankColor(rank_o2);

            card_center.push(card_B7({
                ...LABEL_PPP.OVA,

                value: value_o2,
                data_b: rank_o2,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o2,
                round_level: -2,
            }, true));
        } else {
            type = 'PA+'
            panel_name = getPanelNameSVG('PP Plus: BeatMap (!ympa)', 'PA');

            card_left = card_A2(await PanelGenerate.beatmap2CardA2(me));

            drawMapPlus(label_left, my, [], graph_left, abbr, false);

            const value_o1 = my?.difficulty?.aim;

            //todo 这个是临时边界，我不知道 aim 的边界是多少
            const rank_o1 = getRankFromValue(value_o1, [7, 6, 5, 4.5, 4, 3, 2, 1]); 
            const icon_colors_o1 = getRankColors(rank_o1);

            card_center.push(card_B7({
                ...LABEL_PPP.AIM,

                value: value_o1,
                data_b: rank_o1,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o1,
                round_level: -2,
            }));

            const value_o2 = my?.difficulty?.total;
            const rank_o2 = getRankFromValue(value_o2);
            const icon_colors_o2 = getRankColor(rank_o2);

            card_center.push(card_B7({
                ...LABEL_PPP.OVA,

                value: value_o2,
                data_b: rank_o2,
                data_m: '',
                delta: null,
                icon_colors: icon_colors_o2,
                round_level: -2,
            }, true));
        }
    }

    // 清算
    svg = setImage(svg, 0, 0, 1920, 320, banner, reg_banner, 0.8);

    // A2定义
    
    
    svg = setTexts(svg, [
        getSvgBody(40, 40, card_left), getSvgBody(1450, 40, card_right)
    ], reg_maincard)
    
    let strings = ''

    if (label_left.length > 0) {
        for (let j = 0; j < 6; j++) {
            strings += getSvgBody(40, 350 + j * 115, label_left[j]);
        }
    }

    if (label_right.length > 0) {
        for (let j = 0; j < 6; j++) {
            strings += getSvgBody(40, 350 + j * 115, label_right[j]);
        }
    }

    strings += getSvgBody(630, 860, card_center[0]);
    strings += getSvgBody(970, 860, card_center[1]);
    
    svg = setText(svg, strings, reg_center)

    // 插入文字
    const type_path = torus.getTextPath(type, 960, 614, 60, 'center baseline', '#fff');
    svg = setTexts(svg, [panel_name, type_path], reg_index);

    // 画六边形和其他
    if (graph_left.length > 0) {
        svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(graph_left, 960, 600, 230, '#00A8EC',
            Math.PI / 3), reg_hexagon);
    }

    if (graph_right.length > 0) {
        svg = setSvgBody(svg, 0, 0, PanelDraw.HexagonChart(graph_right, 960, 600, 230, '#FF0000',
            Math.PI / 3), reg_hexagon);
    }

    const hexagon = getImageFromV3('object-hexagon.png');
    svg = setImage(svg, 718, 384, 484, 433, hexagon, reg_hexagon, 1);

    return svg;
}

const getRoman = (level = 0) => {
    if (typeof level != "number") return '-'

    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

    if (level <= 0) {
        return '-'
    } else if (level < 1) {
        // 0 - 1
        return '.' + Math.round(level * 100);
    } else if (level < 11) {
        // 1 - 10
        return roman[Math.round(level - 1)]
    } else {
        // 11+
        return 'EX'
    }
}

function drawMapPlus(svgs, values, vs_values = null, graph, abbr_arr, at_right = false) {
    for (let i = 0; i < 6; i++) {
        const abbr = abbr_arr[i]; //STA
        const value = values[i]; //1234
        const vs_value = vs_values?.[i];

        const rank = getRankFromValue(value, [4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]); //这个 4 非常难拿
        const colors = getRankColors(rank);

        if (typeof value !== 'number') continue;

        svgs.push(
            card_B6({
                ...LABEL_PPP[abbr],

                value: value,
                delta: (vs_value == null) ? null : (value - vs_value),
                icon_colors: colors,
                round_level: 2,

                // pp+ / map 的这个范围要变一下
                limit: 4,
                max: 6,
            }, at_right)
        );

        graph.push(Math.pow(value / 4, 0.8));
    }
}


function drawUserPlus(svgs, values, vs_values = [], levels = [], graph, abbr_arr, at_right = false) {
    // 用于算假 rank 的边界值
    const lv_boundary = [11, 9, 7, 5, 3, 1, 0.75, 0.25];

    const GRAPH_MAX = [5800, 1400, 3200, 2800, 3800, 1200]

    for (let i = 0; i < 6; i++) {
        const abbr = abbr_arr[i]; //STA
        const value = values[i]; //1234
        const vs_value = vs_values?.[i]; //1234

        const level = levels[i]; //lv.10 plus?.advanced_stats?.index
        const rank = getRoman(level); //I

        const fake_rank = getRankFromValue(level, lv_boundary); //并不用于显示
        const colors = getRankColors(fake_rank);

        if (typeof value !== 'number') continue;

        svgs.push(
            card_B6({
                ...LABEL_PPP[abbr],

                value: value,
                data_b: rank,
                data_m: '',
                delta: (vs_value == null) ? null : (value - vs_value),
                icon_colors: colors,
                round_level: -2,
            }, at_right)
        );

        graph.push(Math.pow(value / GRAPH_MAX[i], 0.8));
    }
}