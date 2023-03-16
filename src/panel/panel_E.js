import {
    exportPng,
    extra,
    getExportFileV3Path,
    getMapStatusPath,
    getNowTimeStamp,
    getRandomBannerPath,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    getStarRatingColor,
    getStarRatingObject,
    implantImage,
    implantSvgBody,
    PuHuiTi,
    readTemplate,
    replaceText,
    torus
} from "../util.js";
import {card_A1} from "../card/card_A1.js";
import {label_E, LABEL_OPTION} from "../component/label.js";

export async function panel_E(data = {
    // A1卡
    card_A1: {
        background: getExportFileV3Path('PanelObject/A_CardA1_BG.png'),
        avatar: getExportFileV3Path('PanelObject/A_CardA1_Avatar.png'),
        sub_icon1: getExportFileV3Path('PanelObject/A_CardA1_SubIcon1.png'),
        sub_icon2: getExportFileV3Path('PanelObject/A_CardA1_SubIcon2.png'),
        name: 'Muziyami',
        rank_global: 28075,
        rank_country: 577,
        country: 'CN',
        acc: 95.27,
        level: 100,
        progress: 32,
        pp: 4396,
    },

    // E标签
    label_data: {
        acc: {
            remark: '-1.64%',
            data_b: '98.',
            data_m: '36%',
        },
        combo: {
            remark: '9999x',
            data_b: '547',
            data_m: 'x',
        },
        pp: {
            remark: '',
            data_b: '2048.',
            data_m: '2',
        },
        bpm: {
            remark: '154.4ms',
            data_b: '210.',
            data_m: '1',
        },
        length: {
            remark: '3:04',
            data_b: '3:',
            data_m: '06',
        },
        cs: {
            remark: '154px',
            data_b: '4.',
            data_m: '2',
        },
        ar: {
            remark: '450ms',
            data_b: '10.',
            data_m: '3 (9)',
        },
        od: {
            remark: '16ms',
            data_b: '9.',
            data_m: '82 (8.1)',
        },
        hp: {
            remark: '-',
            data_b: '6.',
            data_m: '1',
        },
    },

    // 成绩评级
    score_stats: {
        judge_stat_sum: 1385,
        judges: [
            {
                index: '320',
                stat: 911,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#8DCFF4',
            }, {
                index: '300',
                stat: 430,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#FEF668',
            }, {
                index: '200',
                stat: 41,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#79C471',
            }, {
                index: '100',
                stat: 0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#5E8AC6',
            }, {
                index: '50',
                stat: 0,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#A1A1A1',
            }, {
                index: '0',
                stat: 3,
                index_color: '#fff',
                stat_color: '#fff',
                rrect_color: '#ED6C9E',
            },
        ],
    },

    // 谱面密度
    map_density_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],

    // 重试和失败数组 retry / fail 注意，retry叫exit
    map_retry_arr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 18, 360, 396, 234, 45, 81, 54, 63, 90, 153, 135, 36, 9, 63, 54, 36, 144, 54, 9, 9, 36, 18, 45, 45, 36, 108, 63, 9, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 27, 0, 18, 0, 0, 0, 18, 18, 18, 0, 0, 0, 9, 18, 9, 0, 9, 9, 0, 9, 0, 9, 18, 9, 0, 0, 27, 0, 0, 0, 0, 27, 9, 9, 0, 9, 9, 0, 0, 0, 9, 0, 0, 9, 9, 0, 9],
    map_fail_arr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 54, 9, 36, 27, 9, 18, 0, 0, 18, 18, 45, 27, 27, 18, 90, 36, 18, 36, 0, 18, 45, 36, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 45, 27, 9, 0, 18, 90, 9, 0, 0, 9, 9, 9, 27, 0, 9, 27, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 9, 0, 9, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 0],

    mods_arr: ['HD', 'HR', 'DT', 'NF'],

    // 面板图片
    map_background: getExportFileV3Path('beatmap-defaultBG.jpg'),
    star: getExportFileV3Path('object-beatmap-star.png'),
    map_hexagon: getExportFileV3Path('object-beatmap-hexagon.png'),
    map_favorite: getExportFileV3Path('object-beatmap-favorite.png'),
    map_playcount: getExportFileV3Path('object-beatmap-playcount.png'),
    map_status: 'ranked', //ranked approved loved graveyard notsubmitted qualified pending workinprogress

    score_rank: 'S',
    star_rating: '4.79',
    score: '2154980',
    score_acc_progress: '97.8', //acc 虽然上面给了，但是那个是给面板渲染的，而且这里有可能还有乘一个进度

    game_mode: 'osu', // osu taiko fruits mania
    map_status_fav: '3.9K',
    map_status_pc: '78.2M',

    map_title_romanized: 'Hyakukakai to Shirotokkuri',
    map_title_unicode: '百花魁と白徳利',
    map_difficulty: 'Expert',
    map_artist_mapper_bid: 'Ponkichi // yf_bmp // b3614136',
    map_public_rating: '9.8', //大众评分，就是大家给谱面打的分，结算后往下拉的那个星星就是
    map_retry_percent: '54', //重试率%
    map_fail_percent: '13.2', //失败率%

    // 面板颜色和特性 颜色已经写成方法
    //color_gamemode: '#7ac943',
    score_categorize: 'fullcombo', // played, clear, nomiss, fullcombo

}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');
    // 路径定义
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PE-BR\);">)/;
    let reg_judge_background = /(?<=<g style="clip-path: url\(#clippath-PE-BG\);">)/;
    let reg_score_rank = /(?<=<g id="LURank">)/;
    let reg_mod = /(?<=<g id="RUMods">)/
    let reg_map_background = /(?<=<g style="clip-path: url\(#clippath-PE-MC\);">)/;
    let reg_map_hexagon = /(?<=<g id="LUMapStatus">)/; // 移到上一层
    let reg_map_favorite = /(?<=<g id="LUMapObject">)/;
    let reg_map_playcount = /(?<=<g id="LUMapObject">)/;
    let reg_map_status = /(?<=<g style="clip-path: url\(#clippath-PE-ST\);">)/;

    let reg_index = /(?<=<g id="Index">)/;

    // 面板文字
    const index_powered = 'powered by Yumubot v0.3.0 EA // Score (!ymp / !ymr / !yms)';
    const index_request_time = 'request time: ' + getNowTimeStamp();
    const index_panel_name = 'S v3.6';

    // 卡片定义
    //console.time("label");
    let label_acc =
        await label_E({...LABEL_OPTION.ACC, ...data.label_data.acc}, true);
    let label_combo =
        await label_E({...LABEL_OPTION.COMBO, ...data.label_data.combo}, true);
    let label_pp =
        await label_E({...LABEL_OPTION.PP, ...data.label_data.pp}, true);
    let label_bpm =
        await label_E({...LABEL_OPTION.BPM, ...data.label_data.bpm}, true);
    let label_length =
        await label_E({...LABEL_OPTION.LENGTH, ...data.label_data.length}, true);
    let label_cs =
        await label_E({...LABEL_OPTION.CS, ...data.label_data.cs}, true);
    let label_ar =
        await label_E({...LABEL_OPTION.AR, ...data.label_data.ar}, true);
    let label_od =
        await label_E({...LABEL_OPTION.OD, ...data.label_data.od}, true);
    let label_hp =
        await label_E({...LABEL_OPTION.HP, ...data.label_data.hp}, true);
    let card_A1_impl =
        await card_A1(data.card_A1, true);
    //console.timeEnd("label");
    //console.time("txt");

    let sr_b = getStarRatingObject(data.star_rating, 0)
    let sr_m = getStarRatingObject(data.star_rating, 1)
    let text_sr_b = getStarRatingObject(data.star_rating, 2)
    let text_sr_m = getStarRatingObject(data.star_rating, 3)

    // 文字定义
    let index_powered_path = torus.getTextPath(index_powered, 10, 26.84, 24, "left baseline", "#fff");
    let index_request_time_path = torus.getTextPath(index_request_time, 1910, 26.84, 24, "right baseline", "#fff");
    let tm_ipn =
        torus.getTextMetrics(index_panel_name, 0, 0, 48, "left baseline", "#fff");
    let ipn_x = 607.5 - tm_ipn.width / 2;
    let index_panel_name_path = torus.getTextPath(index_panel_name, ipn_x, 83.67, 48, "left baseline", "#fff");

    let tm_sr_b =
        torus.getTextMetrics(text_sr_b, 0, 0, 48, "left baseline", "#fff");
    let tm_sr_m =
        torus.getTextMetrics(text_sr_m, 0, 0, 36, "left baseline", "#fff");
    let tm_sr_x = 160 - (tm_sr_b.width + tm_sr_m.width) / 2;
    let star_rating = torus.getTextPath(text_sr_b, tm_sr_x, 373.67, 48, "left baseline", "#fff") +
        torus.getTextPath(text_sr_m, tm_sr_x + tm_sr_b.width, 373.67, 36, "left baseline", "#fff");

    let game_mode_unicode;
    switch (data.game_mode.toLowerCase()) {
        case 'osu' :
            game_mode_unicode = '\uE800';
            break;
        case 'taiko' :
            game_mode_unicode = '\uE803';
            break;
        case 'fruits' :
            game_mode_unicode = '\uE801';
            break;
        case 'mania' :
            game_mode_unicode = '\uE802';
            break;
        default :
            game_mode_unicode = '';
            break;
    }
    let game_mode = extra.getTextPath(game_mode_unicode, 48, 376.24, 48, "left baseline", getStarRatingColor(data.star_rating));

    let map_status_fav = torus.getTextPath(data.map_status_fav, 840, 353.84, 24, "right baseline", "#fff");
    let map_status_pc = torus.getTextPath(data.map_status_pc, 840, 380.84, 24, "right baseline", "#fff");

    let map_title_romanized =
        torus.getTextPath(
            torus.cutStringTail(data.map_title_romanized, 48, 860),
            440, 883.67, 48, "center baseline", "#fff");
    let map_title_unicode;
    //如果两个相等，就不要unicode显示了
    if (data.map_title_romanized !== data.map_title_unicode) {
        map_title_unicode =
            PuHuiTi.getTextPath(
                torus.cutStringTail(data.map_title_unicode, 36, 860),
                440, 931.6, 36, "center baseline", "#fff");
    } else {
        map_title_unicode = '';
    }

    let map_difficulty =
        torus.getTextPath(
            torus.cutStringTail(data.map_difficulty, 36, 860),
            440, 1004.75, 36, "center baseline", "#fff");
    let map_artist_mapper_bid =
        torus.getTextPath(
            torus.cutStringTail(data.map_artist_mapper_bid, 24, 860),
            440, 1036.84, 24, "center baseline", "#fff");

    /*
    let main_score =
        torus.getTextPath(data.main_score_b, 1215, 409.43, 84, "left baseline", "#fff") +
        torus.getTextPath(data.main_score_m, 1215 +
            torus.getTextMetrics(data.main_score_b, 0, 0, 84, "left baseline", "#fff").width,
            409.43, 60, "left baseline", "#fff");
     */

    let main_score = torus.get2SizeTextPath(getRoundedNumberLargerStr(data.score, -1), getRoundedNumberSmallerStr(data.score, -1), 84, 60, 1215, 409.43, 'left baseline', '#FFF');

    let title_density =
        torus.getTextPath("Density", 900, 802.88, 18, "left baseline", "#a1a1a1");
    let title_retryfail =
        torus.getTextPath("Retry // Fail", 900, 922.63, 18, "left baseline", "#a1a1a1");
    let map_public_rating =
        torus.getTextPath("Rating " + data.map_public_rating,
            1420, 802.88, 18, "right baseline", "#a1a1a1");
    let map_retryfail_percent =
        torus.getTextPath("R " + data.map_retry_percent + "% // F " + data.map_fail_percent + "%",
            1420, 922.63, 18, "right baseline", "#a1a1a1");

    //console.timeEnd("txt");
    //console.time("stats");

    // 成绩评级
    const Stats = (i, data, sum) => {
        let font_y = 412.79 + (i + 1) * 40;
        let font_index_x = 1266;
        let font_stat_x = 1792;

        let index = torus.getTextPath(data.index.toString(),
            font_index_x, font_y, 30, "right baseline", data.index_color);
        let stat = torus.getTextPath(data.stat.toString(),
            font_stat_x, font_y, 30, "left baseline", data.stat_color);

        svg = replaceText(svg, index, reg_index);
        svg = replaceText(svg, stat, reg_index);

        if (data.stat > 0) {
            let rect_width = 500 * data.stat / sum
            let svg_rect = `<rect id="L${i}RRect" x="1280" y="${390 + 40 * (i + 1)}" width="${Math.max(rect_width, 20)}" height="28" rx="10" ry="10" style="fill: ${data.rrect_color};"/>`;
            svg = replaceText(svg, svg_rect, /(?<=<g id="MMScoreRRect">)/);
        }
    };

    for (let i = 0; i < 6; i++) {
        if (data?.score_stats?.judges[i]) {
            Stats(i, data?.score_stats?.judges[i], parseInt(data.score_stats.judge_stat_sum));
        }
    }

    // 评级或难度分布
    const density_arr_max = Math.max.apply(Math, data.map_density_arr);

    data.map_density_arr.forEach((item, i) => {
        let map_density_rrect_color = '#8DCFF4';
        let rect_height = Math.max((85 * item / density_arr_max), 16);
        let svg_rect = `<rect id="D${i}RRect" x="${900 + i * 20}" y="${900 - rect_height}" width="16" height="${rect_height}" rx="10" ry="10" style="fill: ${map_density_rrect_color};"/>`;
        svg = replaceText(svg, svg_rect, /(?<=<g id="JudgeRRects">)/);
    })

    // 星数
    function Star(data, sr_b, sr_m) {
        let sr_m_scale = Math.pow(sr_m, 0.8);

        if (sr_b >= 10) {
            sr_b = 10;
            sr_m_scale = 0
        }

        for (let i = 1; i <= sr_b; i++) {
            let sr_b_svg = `<g style="clip-path: url(#clippath-PE-R${i});">
            <image id="EPanel${i}Star" width="40" height="40" transform="translate(40 ${35 * (i - 1) + 396})" xlink:href="${data.star}"/>
        </g>`;
            svg = replaceText(svg, sr_b_svg, /(?<=<g id="LUStars">)/);
        }

        let sr_m_svg = `<g style="clip-path: url(#clippath-PE-R${sr_b + 1});">
        <image id="EPanel${sr_b + 1}Star" width="40" height="40" transform="translate(40 ${35 * sr_b + 396}) translate(${20 * (1 - sr_m_scale)} ${20 * (1 - sr_m_scale)}) scale(${sr_m_scale})" xlink:href="${data.star}"/>
        </g>`;

        svg = replaceText(svg, sr_m_svg, /(?<=<g id="LUStars">)/);
    }

    Star(data, sr_b, sr_m);

    //最右下的失败率
    function RFrect(data) {
        let rect_svg = `<rect id="BaseRRect" x="1440" y="1020" width="420" height="4" rx="2" ry="2" style="fill: #a1a1a1;"/>
      <rect id="RetryRRect" x="1440" y="1020" width="${4.2 * (Number(data.map_fail_percent) + Number(data.map_retry_percent))}" height="4" rx="2" ry="2" style="fill: #f6d659;"/>
      <rect id="FailRRect" x="1440" y="1020" width="${4.2 * data.map_fail_percent}" height="4" rx="2" ry="2" style="fill: #ed6c9e;"/>`

        svg = replaceText(svg, rect_svg, /(?<=<g id="RBRetryFailRRect">)/);
    }

    RFrect(data);

    //中下的失败率重试率图像
    let RFsum_arr = data.map_fail_arr.map(function (v, i) {
        return v + data.map_retry_arr[i];
    });
    let RFarr_max = Math.max.apply(Math, RFsum_arr);

    /*
    let RFdiff_arr = RFsum_arr.map(function(v) {return RFarr_max - v;});

    function RFLineChart (arr, color, max){
        const step = 520 / arr.length
        const start_x = 900;
        const start_y = 1020;

        // M S 大写是绝对坐标 S 是 smooth cubic Bezier curve (平滑三次贝塞尔?)
        // 高度本来是90，但老是超高，缩短一点 0211更新，超高问题得到了解决
        let path_svg = `<svg> <path d="M ${start_x} ${start_y - (arr.shift() / max * 90)} S `;

        arr.forEach((item,i) => {
            let lineto_x = start_x + step * (i+1)
            let lineto_y = start_y - (item / max * 90);
            path_svg += `${lineto_x} ${lineto_y} ${lineto_x + step/2} ${lineto_y} ` // 第一个xy是点位置，第二个是控制点位置
        })
        path_svg += `" style="fill: none; stroke: ${color}; stroke-miterlimit: 10; stroke-width: 3px;"/> </svg>`
        svg = replaceText(svg, path_svg, /(?<=<g id="RetryFailGraphArea">)/);
    }

    RFLineChart(RFdiff_arr, '#a1a1a1', RFarr_max);

     */

    function RFBarChart(arr, color, max) {
        const step = 520 / arr.length //一步好像刚好5.2px
        const start_x = 900;
        const start_y = 1020;

        let rect_svg = `<g>`

        arr.forEach((item, i) => {
            let lineto_x = start_x + step * (i)
            let lineto_y = start_y - (item / max * 90);
            rect_svg += `<rect id="RFrect${i}" x="${lineto_x}" y="${lineto_y}" width="${step}" height="${start_y - lineto_y}" rx="2" ry="2" style="fill: ${color};"/>`
        })
        rect_svg += `</g>`
        svg = replaceText(svg, rect_svg, /(?<=<g id="RetryFailGraphArea">)/);
    }

    RFBarChart(data.map_fail_arr, '#ed6c9e', RFarr_max);
    RFBarChart(RFsum_arr, '#f6d659', RFarr_max); // 这里是retry

    // 成绩分类（中间四个照片）
    function ScoreCategory(sc) {
        let pl_link = 'default';
        let cl_link = 'default';
        let nm_link = 'default';
        let fc_link = 'default';

        if (sc === "played") {
            pl_link = ''
        }
        if (sc === "clear") {
            cl_link = ''
        }
        if (sc === "nomiss") {
            nm_link = ''
        }
        if (sc === "fullcombo") {
            fc_link = ''
        }

        let reg = /(?<=<g id="LBPassStat">)/
        svg = implantImage(svg, 150, 40, 1060, 690, 1, getExportFileV3Path(`object-score-fullcombo${fc_link}.png`), reg)
        svg = implantImage(svg, 150, 40, 900, 690, 1, getExportFileV3Path(`object-score-nomiss${nm_link}.png`), reg)
        svg = implantImage(svg, 150, 40, 1060, 640, 1, getExportFileV3Path(`object-score-clear${cl_link}.png`), reg)
        svg = implantImage(svg, 150, 40, 900, 640, 1, getExportFileV3Path(`object-score-play${pl_link}.png`), reg)
    }

    ScoreCategory(data.score_categorize);

    //成绩圆环显示 中点1075 485 x900-1210 y330-640 r=105px
    function Ring(acc) {
        let a;//assist points 中继点
        let rad = 2 * Math.PI * acc / 100; //弧度

        const mx = 1055;
        const my = 485;
        const r = 105 * Math.sqrt(2);//正方形的外接圆半径
        let cx = mx + r * Math.sin(rad);
        let cy = my - r * Math.cos(rad);
        let c = `${cx} ${cy} `;//control point 控制点

        if (acc <= 12.5) {
            a = '';
        } else if (acc <= 37.5) {
            a = '1210 330 ';
        } else if (acc <= 62.5) {
            a = '1210 330 1210 640';
        } else if (acc <= 87.5) {
            a = '1210 330 1210 640 900 640';
        } else {
            a = '1210 330 1210 640 900 640 900 330';
        }

        let clippath =
            `<clipPath id="clippath-PE-CC">
        <polygon id="RingMask" points="1055 485 1055 330 ${a} ${c} 1055 485" style="fill: none;"/>
        </clipPath>`;

        svg = replaceText(svg, clippath, /(?<=<defs>)/);

        let ring_svg =
            `<image id="ColoredCircle" width="210" height="210" transform="translate(950 380)" xlink:href="${getExportFileV3Path('object-score-coloredcircle.png')}"/><g style="clip-path: url(#clippath-PE-CC);">
        <image width="270" height="270" transform="translate(920 350)" xlink:href="${getExportFileV3Path('object-score-coloredring.png')}"/>
      </g>`

        svg = replaceText(svg, ring_svg, /(?<=<g id="LURank">)/);
    }

    Ring(data.score_acc_progress);

    // 插入文字和颜色
    svg = replaceText(svg, index_powered_path, reg_index);
    svg = replaceText(svg, index_request_time_path, reg_index);
    svg = replaceText(svg, index_panel_name_path, reg_index);
    svg = replaceText(svg, star_rating, reg_index);
    svg = replaceText(svg, game_mode, reg_index);
    svg = replaceText(svg, map_status_fav, reg_index);
    svg = replaceText(svg, map_status_pc, reg_index);
    svg = replaceText(svg, map_title_romanized, reg_index);
    svg = replaceText(svg, map_title_unicode, reg_index);
    svg = replaceText(svg, map_difficulty, reg_index);
    svg = replaceText(svg, map_artist_mapper_bid, reg_index);
    svg = replaceText(svg, main_score, reg_index);
    svg = replaceText(svg, title_density, reg_index);
    svg = replaceText(svg, title_retryfail, reg_index);
    svg = replaceText(svg, map_public_rating, reg_index);
    svg = replaceText(svg, map_retryfail_percent, reg_index);

    // 插入模组，因为先插的在上面，所以从左边插
    let insertMod = (mod, i, offset_x) => {
        let x = offset_x + i * 50;

        return `<image transform="translate(${x} 350)" width="90" height="64" xlink:href="${getExportFileV3Path('Mods/' + mod + '.png')}"/>`;
    }

    let mods_arr = data.mods_arr ? data.mods_arr : ['']
    let mods_arr_length = mods_arr.length;

    if (mods_arr_length <= 2 && mods_arr_length > 0) {
        mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, 2 * i, 1760 - (mods_arr_length - 1) * 100), reg_mod);
        });
    } else if (mods_arr_length > 2) {
        mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, i, 1760 - (mods_arr_length - 1) * 50), reg_mod);
        });
    }

    //console.timeEnd("stats");
    //console.time("img");
    // 插入评级大照片和背景

    function scoreRankSVGShown(rank = 'D') {
        let w = 0; //很奇怪，输出明明好好的，但是位置不对
        switch (rank) {
            case 'B':
                w = 5;
                break;
            case 'C':
                w = -5;
                break;
            case 'D':
                w = 10;
                break;
            case 'F':
                w = 5;
                break;
        }

        svg = implantImage(svg, 1920, 790, 0, 290, 0.8, getExportFileV3Path(`object-score-backimage-${rank}.jpg`), reg_judge_background);
        svg = implantImage(svg, 150 + w, 150, 980, 405, 1, getExportFileV3Path(`object-score-${rank}.png`), reg_score_rank); //微调了x，让它增加了5
    }

    scoreRankSVGShown(data.score_rank);

    //插入新版 banner
    let banner_overlay = getExportFileV3Path('banner-overlay.png');
    let banner_rrect = `<rect width="1920" height="320" rx="20" ry="20" style="fill: ${getStarRatingColor(data.star_rating)}; opacity: 0.8;"/>`;

    if (data.star_rating) {
        svg = implantImage(svg, 1920, 320, 0, 0, 1, banner_overlay, reg_banner);
        svg = replaceText(svg, banner_rrect, reg_banner);
    } else {
        svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    }

    // 插入谱面状态
    let status = getMapStatusPath(data.map_status);

    //console.time('newSVG')
    // 插入图片和部件（新方法 ==============================================================================================
    svg = implantSvgBody(svg, 40, 40, card_A1_impl, reg_maincard);

    svg = implantSvgBody(svg, 1230, 680, label_acc, reg_mod);
    svg = implantSvgBody(svg, 1440, 680, label_combo, reg_mod);
    svg = implantSvgBody(svg, 1650, 680, label_pp, reg_mod);
    svg = implantSvgBody(svg, 1440, 790, label_bpm, reg_mod);
    svg = implantSvgBody(svg, 1650, 790, label_length, reg_mod);
    svg = implantSvgBody(svg, 1440, 870, label_cs, reg_mod);
    svg = implantSvgBody(svg, 1650, 870, label_ar, reg_mod);
    svg = implantSvgBody(svg, 1440, 950, label_od, reg_mod);
    svg = implantSvgBody(svg, 1650, 950, label_hp, reg_mod);

    svg = implantImage(svg, 380, 410, 250, 390, 1, data.map_background, reg_map_background);
    svg = implantImage(svg, 420, 450, 230, 370, 1, data.map_hexagon, reg_map_hexagon);
    svg = implantImage(svg, 18, 18, 746, 364, 1, data.map_favorite, reg_map_favorite);
    svg = implantImage(svg, 18, 16, 746, 338, 1, data.map_playcount, reg_map_playcount);
    svg = implantImage(svg, 50, 50, 683, 334, 1, status, reg_map_status);

    return await exportPng(svg);
}
