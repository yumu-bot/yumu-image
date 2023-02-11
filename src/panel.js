import {
    extra,
    InsertSvgBuilder,
    PuHuiTi,
    readExportFileV3,
    readImage,
    readTemplate,
    replaceText,
    torus
} from "./util.js";
import {card_A1, card_H} from "./card.js";
import {label_E, LABEL_OPTION} from "./component.js";

export async function panel_E(data = {
    card_A1: {
        background: readImage("image/A_CardA1_BG.png"),
        avatar: readImage("image/A_CardA1_Avatar.png"),
        country_flag: readImage("image/A_CardA1_CountryFlag.png"),
        sub_icon1: readImage("image/A_CardA1_SubIcon1.png"),
        sub_icon2: readImage("image/A_CardA1_SubIcon2.png"),
        name: 'Muziyami',
        rank_global: '#28075',
        rank_country: 'CN#577',
        info: '95.27% Lv.100(32%)',
        pp_b: '4396',
        pp_m: 'PP',
    },
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
        judge_stat_sum: '1385',
        judge_1: {
            index: '320',
            stat: '911',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_2: {
            index: '300',
            stat: '430',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#FEF668',
        },
        judge_3: {
            index: '200',
            stat: '41',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#79C471',
        },
        judge_4: {
            index: '100',
            stat: '0',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#5E8AC6',
        },
        judge_5: {
            index: '50',
            stat: '0',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#A1A1A1',
        },
        judge_6: {
            index: '0',
            stat: '3',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#ED6C9E',
        },
        judge_7: null,
    },

    // 谱面密度
    map_density_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],
    // 重试和失败数组 retry / fail 注意，retry叫exit
    map_retry_arr: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        27,
        18,
        360,
        396,
        234,
        45,
        81,
        54,
        63,
        90,
        153,
        135,
        36,
        9,
        63,
        54,
        36,
        144,
        54,
        9,
        9,
        36,
        18,
        45,
        45,
        36,
        108,
        63,
        9,
        0,
        0,
        0,
        0,
        27,
        0,
        0,
        0,
        0,
        0,
        27,
        0,
        18,
        0,
        0,
        0,
        18,
        18,
        18,
        0,
        0,
        0,
        9,
        18,
        9,
        0,
        9,
        9,
        0,
        9,
        0,
        9,
        18,
        9,
        0,
        0,
        27,
        0,
        0,
        0,
        0,
        27,
        9,
        9,
        0,
        9,
        9,
        0,
        0,
        0,
        9,
        0,
        0,
        9,
        9,
        0,
        9
    ],
    map_fail_arr: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        9,
        54,
        9,
        36,
        27,
        9,
        18,
        0,
        0,
        18,
        18,
        45,
        27,
        27,
        18,
        90,
        36,
        18,
        36,
        0,
        18,
        45,
        36,
        27,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        18,
        0,
        45,
        27,
        9,
        0,
        18,
        90,
        9,
        0,
        0,
        9,
        9,
        9,
        27,
        0,
        9,
        27,
        0,
        0,
        0,
        0,
        9,
        9,
        0,
        0,
        0,
        0,
        0,
        9,
        0,
        9,
        18,
        18,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        9,
        9,
        0
    ],

    // 面板图片
    banner: readImage("image/E_Banner.png"),
    judge_background: readImage("image/E_Background.jpg"),
    score_rank: readImage("image/E_ScoreRank.png"),
    star: readImage("image/E_Star.png"),
    map_background: readImage("image/E_MapCover.jpg"),
    map_hexagon: readImage("image/E_Hexagon.png"),
    map_favorite: readImage("image/E_Favorite.png"),
    map_playcount: readImage("image/E_PlayCount.png"),
    map_status: readImage("image/E_MapStatus.png"),

    // 面板文字

    index_leftup: 'powered by Yumubot // Score (!ymp / !ymr)',
    index_rightup: 'request time: 2023-10-4 17:59:58 UTC+8',
    index_panel_name: 'S v3.6',
    srcard_starrating_b: '2.',
    srcard_starrating_m: '6',
    srcard_gamemode: '\uE800', // osu! 模式图标
    map_status_fav: '3.9K',
    map_status_pc: '78.2M',

    map_text_title_romanized: 'Hyakukakai to Shirotokkuri',
    map_text_title_unicode: '百花魁と白徳利',
    map_text_difficulty: 'Expert',
    map_text_artist_mapper_bid: 'Ponkichi // yf_bmp // b3614136',

    main_score_b: '21',
    main_score_m: '47483647',

    map_public_rating: '9.8', //大众评分，就是大家给谱面打的分，结算后往下拉的那个星星就是
    map_retry_percent: '54', //重试率%
    map_fail_percent: '13.2', //失败率%

    score_acc_progress: '44.3', //acc 虽然上面给了，但是那个是给面板渲染的，而且这里有可能还有乘一个进度

    // 面板颜色和特性
    color_gamemode: '#7ac943',
    score_categorize: "fullcombo", // played, clear, nomiss, fullcombo

}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_E.svg');
    // 路径定义
    let reg_banner = '${banner}';
    let reg_judge_background = '${judge_background}';
    let reg_score_rank = '${score_rank}';
    let reg_mod = /(?<=<g id="RUMods">)/
    let reg_star = '${star}';
    let reg_map_background = '${map_background}';
    let reg_map_hexagon = '${map_hexagon}';
    let reg_map_favorite = '${map_favorite}';
    let reg_map_playcount = '${map_playcount}';
    let reg_map_status = '${map_status}';

    let reg_index = /(?<=<g id="Index">)/;

    // 卡片定义
    console.time("label");
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

    let card_A1_impl = await card_A1(data.card_A1, true);
    console.timeEnd("label");
    console.time("txt");

    // 文字定义
    let index_lu = torus.getTextPath(data.index_leftup, 10, 26.84, 24, "left baseline", "#fff");
    let index_ru = torus.getTextPath(data.index_rightup, 1910, 26.84, 24, "right baseline", "#fff");
    let tm_ipn =
        torus.getTextMetrics(data.index_panel_name, 0, 0, 48, "left baseline", "#fff");
    let ipn_x = 607.5 - tm_ipn.width / 2;
    let index_panel_name = torus.getTextPath(data.index_panel_name, ipn_x, 83.67, 48, "left baseline", "#fff");

    let tm_sr_b =
        torus.getTextMetrics(data.srcard_starrating_b, 0, 0, 48, "left baseline", "#fff");
    let tm_sr_m =
        torus.getTextMetrics(data.srcard_starrating_m, 0, 0, 36, "left baseline", "#fff");
    let tm_sr_x = 160 - (tm_sr_b.width + tm_sr_m.width) / 2;
    let srcard_starrating = torus.getTextPath(data.srcard_starrating_b, tm_sr_x, 373.67, 48, "left baseline", "#fff") +
        torus.getTextPath(data.srcard_starrating_m, tm_sr_x + tm_sr_b.width, 373.67, 36, "left baseline", "#fff");
    let srcard_gamemode = extra.getTextPath(data.srcard_gamemode, 48, 376.24, 48, "left baseline", data.color_gamemode);

    let map_status_fav = torus.getTextPath(data.map_status_fav, 840, 353.84, 24, "right baseline", "#fff");
    let map_status_pc = torus.getTextPath(data.map_status_pc, 840, 380.84, 24, "right baseline", "#fff");

    let map_text_title_romanized = torus.getTextPath(data.map_text_title_romanized, 440, 883.67, 48, "center baseline", "#fff");
    let map_text_title_unicode = PuHuiTi.getTextPath(data.map_text_title_unicode, 440, 931.6, 36, "center baseline", "#fff");
    let map_text_difficulty = torus.getTextPath(data.map_text_difficulty, 440, 1004.75, 36, "center baseline", "#fff");
    let map_text_artist_mapper_bid = torus.getTextPath(data.map_text_artist_mapper_bid, 440, 1036.84, 24, "center baseline", "#fff");

    let main_score = torus.getTextPath(data.main_score_b, 1215, 409.43, 84, "left baseline", "#fff") +
        torus.getTextPath(data.main_score_m, 1215 +
            torus.getTextMetrics(data.main_score_b, 0, 0, 84, "left baseline", "#fff").width,
            409.43, 60, "left baseline", "#fff");

    let title_density = torus.getTextPath("Density", 900, 802.88, 18, "left baseline", "#a1a1a1");
    let title_retryfail = torus.getTextPath("Retry // Fail", 900, 922.63, 18, "left baseline", "#a1a1a1");
    let map_public_rating = torus.getTextPath("Rating " + data.map_public_rating,
        1420, 802.88, 18, "right baseline", "#a1a1a1");
    let map_retryfail_percent = torus.getTextPath("R " + data.map_retry_percent + "% // F " + data.map_fail_percent + "%",
        1420, 922.63, 18, "right baseline", "#a1a1a1");

    console.timeEnd("txt");
    console.time("stats");
    // 成绩评级

    const Stats = (i, data, sum) => {
        let font_y = 412.79 + i * 40;
        let font_index_x = 1266;
        let font_stat_x = 1792;

        let index = torus.getTextPath(data.index,
            font_index_x, font_y, 30, "right baseline", data.index_color);
        let stat = torus.getTextPath(data.stat,
            font_stat_x, font_y, 30, "left baseline", data.stat_color);
        svg = replaceText(svg, index, reg_index);
        svg = replaceText(svg, stat, reg_index);
        if (data.stat > 0) {
            let rect_width = 500 * data.stat / sum
            let svg_rect = `<rect id="L${i}RRect" x="1280" y="${390 + 40 * i}" width="${Math.max(rect_width, 20)}" height="28" rx="10" ry="10" style="fill: ${data.rrect_color};"/>`;
            svg = replaceText(svg, svg_rect, /(?<=<g id="MMScoreRRect">)/);
        }
    };

    for (let i = 1; i <= 6; i++) {
        if (data.score_stats[`judge_${i}`]) {
            Stats(i, data.score_stats[`judge_${i}`], data.score_stats.judge_stat_sum);
        }
    }

    // 评级或难度分布
    // 百度的方法，这也太暴力了吧 我不是很理解,为什么要用 eval ? eval是执行一段js代码的字符串,既然是在写js代码,直接写上
    const density_arr_max = Math.max.apply(Math, data.map_density_arr);

    data.map_density_arr.forEach((item, i) => {
        let map_density_rrect_color = '#8DCFF4';
        let rect_height = Math.max((85 * item / density_arr_max), 16);
        let svg_rect = `<rect id="D${i}RRect" x="${900 + i * 20}" y="${900 - rect_height}" width="16" height="${rect_height}" rx="10" ry="10" style="fill: ${map_density_rrect_color};"/>`;
        svg = replaceText(svg, svg_rect, /(?<=<g id="JudgeRRects">)/);
    })

    // 星数
    // 纯文本纯天然无污染！（就是挺奇怪的，怎么href需要下到bot的根目录了
    let sr_b = parseInt(data.srcard_starrating_b); // 缩放让小星星不会太小 parseInt 可以处理小数点 ====================================
    let sr_m_scale = Math.pow(parseFloat("0." + data.srcard_starrating_m), 0.8); //========================= 我观察了一下逻辑,就是取小数点吧

    if (sr_b >= 10) {
        sr_b = 10;
        sr_m_scale = 0
    }

    for (let i = 1; i <= sr_b; i++) {
        let sr_b_svg = `<g style="clip-path: url(#clippath-PE-R${i});">
            <image id="EPanel${i}Star" width="40" height="40" transform="translate(40 ${35 * (i - 1) + 396})" xlink:href=${readExportFileV3("E_Star.png")}/>
        </g>`;
        svg = replaceText(svg, sr_b_svg, /(?<=<g id="LUStars">)/);
    }

    let sr_m_svg = `<g style="clip-path: url(#clippath-PE-R${sr_b + 1});">
        <image id="EPanel${sr_b + 1}Star" width="40" height="40" transform="translate(40 ${35 * sr_b + 396}) translate(${20 * (1 - sr_m_scale)} ${20 * (1 - sr_m_scale)}) scale(${sr_m_scale})"
        xlink:href="nowbot-image/image/E_Star.png"/>
        </g>`;

    svg = replaceText(svg, sr_m_svg, /(?<=<g id="LUStars">)/);

    //最右下的失败率
    const RFrect = (data) => {
        let rect_svg = `<rect id="BaseRRect" x="1440" y="1020" width="420" height="4" rx="2" ry="2" style="fill: #a1a1a1;"/>
      <rect id="RetryRRect" x="1440" y="1020" width="${4.2 * (Number(data.map_fail_percent) + Number(data.map_retry_percent))}" height="4" rx="2" ry="2" style="fill: #f6d659;"/>
      <rect id="FailRRect" x="1440" y="1020" width="${4.2 * data.map_fail_percent}" height="4" rx="2" ry="2" style="fill: #ed6c9e;"/>`

        svg = replaceText(svg, rect_svg, /(?<=<g id="RBRetryFailRRect">)/);
    }

    RFrect(data);

    //中下的失败率重试率图像
    /*
    const RFGraph = (arr, color) => {
        const step = 520 / arr.length
        const max = Math.max.apply(Math, arr);
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
    */

    const RFGraph = (arr, color, max) => {
        const step = 520 / arr.length //一步好像刚好5.2px
        const start_x = 900;
        const start_y = 1020;

        let rect_svg =`<g>`

        arr.forEach((item,i) => {
            let lineto_x = start_x + step * (i)
            let lineto_y = start_y - (item / max * 90);
            rect_svg += `<rect id="RFrect${i}" x="${lineto_x}" y="${lineto_y}" width="${step}" height="${start_y - lineto_y}" rx="2" ry="2" style="fill: ${color};"/>`
        })
        rect_svg += `</g>`
        svg = replaceText(svg, rect_svg, /(?<=<g id="RetryFailGraphArea">)/);
    }

    let RFarr = data.map_fail_arr.map(function(v, i) {return v + data.map_retry_arr[i];});

    RFGraph(data.map_fail_arr, '#ed6c9e', Math.max.apply(Math, RFarr));
    RFGraph(RFarr, '#f6d659', Math.max.apply(Math, RFarr)); // 这里是retry


    // 成绩分类（中间四个照片）
    const ScoreCategory = (sc) => {
        let pl_link = 'default';
        let cl_link = 'default';
        let nm_link = 'default';
        let fc_link = 'default';

        if (sc === "played") {pl_link = ''}
        if (sc === "clear") {cl_link = ''}
        if (sc === "nomiss") {nm_link = ''}
        if (sc === "fullcombo") {fc_link = ''}

        let score_svg = `
      <image width="150" height="40" transform="translate(1060 690)" xlink:href="nowbot-image/image/object-score-fullcombo${fc_link}.png"/>
      <image width="150" height="40" transform="translate(900 690)" xlink:href="nowbot-image/image/object-score-nomiss${nm_link}.png"/>
      <image width="150" height="40" transform="translate(1060 640)" xlink:href="nowbot-image/image/object-score-clear${cl_link}.png"/>
      <image width="150" height="40" transform="translate(900 640)" xlink:href="nowbot-image/image/object-score-play${pl_link}.png"/>`

        svg = replaceText(svg, score_svg, /(?<=<g id="LBPassStat">)/);
    }

    ScoreCategory(data.score_categorize);

    //成绩圆环显示 中点1075 485 x900-1210 y330-640 r=105px
    const Ring = (acc) => {
        let a;//assist points 中继点
        let rad = 2 * Math.PI * acc / 100; //弧度

        const mx = 1055;
        const my = 485;
        const r = 105 * Math.sqrt(2);//正方形的外接圆
        let cx = mx + r * Math.sin(rad);
        let cy = my - r * Math.cos(rad);
        let c = `${cx} ${cy} `;//control point 控制点

        if (acc <= 12.5) {
            a = "";
        } else if (acc <= 37.5) {
            a = "1210 330 ";
        } else if (acc <= 62.5) {
            a = "1210 330 1210 640";
        } else if (acc <= 87.5) {
            a = "1210 330 1210 640 900 640";
        } else {
            a = "1210 330 1210 640 900 640 900 330";
        }

        let clippath =
            `<clipPath id="clippath-PE-CC">
        <polygon id="RingMask" points="1055 485 1055 330 ${a} ${c} 1055 485" style="fill: none;"/>
        </clipPath>`;

        svg = replaceText(svg, clippath, /(?<=<defs>)/);

        let ring_svg =
            `<image id="ColoredCircle" width="210" height="210" transform="translate(950 380)" xlink:href="nowbot-image/image/object-score-coloredcircle.png"/><g style="clip-path: url(#clippath-PE-CC);">
        <image width="270" height="270" transform="translate(920 350)" xlink:href="nowbot-image/image/object-score-coloredring.png"/>
      </g>`

        svg = replaceText(svg, ring_svg, /(?<=<g id="LURank">)/);
    }

    Ring(data.score_acc_progress);


    // 插入文字和颜色
    svg = replaceText(svg, index_lu, reg_index);
    svg = replaceText(svg, index_ru, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);
    svg = replaceText(svg, srcard_starrating, reg_index);
    svg = replaceText(svg, srcard_gamemode, reg_index);
    svg = replaceText(svg, map_status_fav, reg_index);
    svg = replaceText(svg, map_status_pc, reg_index);
    svg = replaceText(svg, map_text_title_romanized, reg_index);
    svg = replaceText(svg, map_text_title_unicode, reg_index);
    svg = replaceText(svg, map_text_difficulty, reg_index);
    svg = replaceText(svg, map_text_artist_mapper_bid, reg_index);
    svg = replaceText(svg, main_score, reg_index);
    svg = replaceText(svg, title_density, reg_index);
    svg = replaceText(svg, title_retryfail, reg_index);
    svg = replaceText(svg, map_public_rating, reg_index);
    svg = replaceText(svg, map_retryfail_percent, reg_index);

    // 插入模组
    let insertMod = (i, mod) => {
        let offset_x = 1760 - i * 50;
        return `<image transform="translate(${offset_x} 350)" width="90" height="64" xlink:href="${mod}"/>`;
    }

    let all_mod = ['HD', 'HR', 'DT', 'NF'];
    if (all_mod.length <= 2) {
        all_mod.forEach((val, i) => {
            svg = replaceText(svg, insertMod(2 * i, `\${${val}}`), reg_mod);
        });
    } else {
        all_mod.forEach((val, i) => {
            svg = replaceText(svg, insertMod(i, `\${${val}}`), reg_mod);
        });
    }

    console.timeEnd("stats");
    console.time("img");
    // 插入图片
    let out_svg = new InsertSvgBuilder(svg)
        .insertImage(data.banner, reg_banner)
        .insertImage(data.judge_background, reg_judge_background)
        .insertImage(data.score_rank, reg_score_rank)
        .insertImage(data.star, reg_star)
        .insertImage(data.map_background, reg_map_background)
        .insertImage(data.map_hexagon, reg_map_hexagon)
        .insertImage(data.map_favorite, reg_map_favorite)
        .insertImage(data.map_playcount, reg_map_playcount)
        .insertImage(data.map_status, reg_map_status);
    all_mod.forEach((v) => {
        out_svg.insertImage(readImage("image/E_Mod.png"), `\${${v}}`);
    })
    console.timeEnd("img");
    console.time("svg");
    console.time("svgA1");
    await out_svg.insertSvg(card_A1_impl, 40, 40);
    console.timeEnd("svgA1");
    console.time("svg2");
    await out_svg.insertSvg(label_acc, 1230, 680);
    console.timeEnd("svg2");
    console.time("svg3");
    await out_svg.insertSvg(label_combo, 1440, 680);
    console.timeEnd("svg3");
    console.time("svg4");
    await out_svg.insertSvg(label_pp, 1650, 680);
    console.timeEnd("svg4");
    console.time("svg5");
    await out_svg.insertSvg(label_bpm, 1440, 790);
    console.timeEnd("svg5");
    console.time("svg6");
    await out_svg.insertSvg(label_length, 1650, 790);
    console.timeEnd("svg6");
    console.time("svg7");
    await out_svg.insertSvg(label_cs, 1440, 870);
    console.timeEnd("svg7");
    console.time("svg8");
    await out_svg.insertSvg(label_ar, 1650, 870);
    console.timeEnd("svg8");
    console.time("svg9");
    await out_svg.insertSvg(label_od, 1440, 950);
    console.timeEnd("svg9");
    console.time("svg10");
    await out_svg.insertSvg(label_hp, 1650, 950);
    console.timeEnd("svg10");
    console.timeEnd("svg");
    console.time("export");
    let o = out_svg.export(reuse);
    console.timeEnd("export");
    return o;
}

export async function panel_I(data = {
    background: readImage("image/I_CardH_BG.png"),
    avatar: readImage("image/I_CardH_Avatar.png"),
    name: 'Muziyami',
    info: '39.2M // 99W-0L 100%',
    rank: '#1',
    pp_b: '264',
    pp_m: 'pp',
    color_score: '#fbb03b',
    color_base: '#3fa9f5',
}) {
    let reg_background = '${background}'
    //
    let reg_height = /(?<=id="Background">[\s\S]*height=")\d+/
    let reg_cards = /(?<=<g id="cardH">)/
    let reg_text = /(?<=<g id="Text">)/;

    const get = (path, x, y) => {
        return `<image width="900" height="110" x="${x}" y="${y}" xlink:href="${path}" />`
    }

    let bg1 = await card_H(data, true);
    data.pp_b = '15';
    let bg2 = await card_H(data, true);


    let a1 = torus.getTextPath("24", 20, 97, 24, 'left center', "#fff");
    let a2 = torus.getTextPath("16", 120, 97, 16, 'left center', "#fff");
    let a3 = torus.getTextPath("12", 220, 97, 12, 'left center', "#fff");
    let svg = readTemplate("template/Panel_I.svg");

    svg = svg.replace(reg_text, a1);
    svg = svg.replace(reg_text, a2);
    svg = svg.replace(reg_text, a3);


    let out_svg = new InsertSvgBuilder(svg);
    await out_svg.insertSvg(bg1, 10, 100);
    await out_svg.insertSvg(bg2, 10, 400);
    await out_svg.insertSvg(bg1, 300, 210);
    await out_svg.insertSvg(bg2, 300, 510);
    return out_svg.export();
}

