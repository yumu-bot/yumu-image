import {
    getExportFileV3Path,
    getRankColor,
    implantSvgBody,
    PanelDraw, replaceTexts,
    torus
} from "../util.js";
import {label_E} from "../component/label.js";

export async function card_E3(data = {
    density_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],
    retry_arr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 18, 360, 396, 234, 45, 81, 54, 63, 90, 153, 135, 36, 9, 63, 54, 36, 144, 54, 9, 9, 36, 18, 45, 45, 36, 108, 63, 9, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 27, 0, 18, 0, 0, 0, 18, 18, 18, 0, 0, 0, 9, 18, 9, 0, 9, 9, 0, 9, 0, 9, 18, 9, 0, 0, 27, 0, 0, 0, 0, 27, 9, 9, 0, 9, 9, 0, 0, 0, 9, 0, 0, 9, 9, 0, 9],
    fail_arr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 54, 9, 36, 27, 9, 18, 0, 0, 18, 18, 45, 27, 27, 18, 90, 36, 18, 36, 0, 18, 45, 36, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 45, 27, 9, 0, 18, 90, 9, 0, 0, 9, 9, 9, 27, 0, 9, 27, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 9, 0, 9, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 0],

    public_rating: 9.42,
    pass_percent: 56,
    retry_percent: 42,
    fail_percent: 2,

    labels: [{
        icon: getExportFileV3Path("object-score-beatsperminute.png"),
        icon_title: 'BPM',
        color_remark: '#aaa',
        remark: '-1.64%',
        data_b: '98',
        data_m: '.36%',
    },{
        icon: getExportFileV3Path("object-score-beatsperminute.png"),
        icon_title: 'BPM',
        color_remark: '#aaa',
        remark: '7:27',
        data_b: '7:',
        data_m: '27',
    }],
    rank: 'F',
    star: 9.99,
    score_progress: 0.98,
}, reuse = false) {
    // 读取模板
    let svg = `
          <g id="Base_CE3">
            <rect id="RBCard" width="1000" height="270" rx="20" ry="20" style="fill: #382e32;"/>
          </g>
          <g id="Graph_CE3">
          </g>
          <g id="Label_CE3">
          </g>
          <g id="Text_CE3">
          </g>`;

    // 路径定义
    const reg_label = /(?<=<g id="Label_CE3">)/;
    const reg_graph = /(?<=<g id="Graph_CE3">)/;
    const reg_text = /(?<=<g id="Text_CE3">)/;

    // 预设值定义
    const rank_color = getRankColor(data.rank);

    // 文字定义
    const density = torus.getTextPath("Density", 20, 32.88, 18, "left baseline", "#aaa");
    const retry_fail = torus.getTextPath("Retry // Fail", 20, 152.63, 18, "left baseline", "#aaa");
    const public_rating = torus.getTextPath("Players Feedback: " + data.public_rating,
            540, 32.88, 18, "right baseline", "#aaa");
    const percent = torus.getTextPath( "P "
            + data.pass_percent
            + "% // R "
            + data.retry_percent
            + "% // F "
            + data.fail_percent
            + "%",
            540, 152.63, 18, "right baseline", "#aaa");

    // 导入文字
    svg = replaceTexts(svg, [density, retry_fail, public_rating, percent], reg_text);

    // 部件定义
    // 评级或难度分布矩形的缩放，SR1为0.1倍，SR8为1倍
    let density_scale = 1;
    if (data.star <= 1) {
        density_scale = 0.1;
    } else if (data.star <= 8) {
        density_scale = Math.sqrt(((data.star - 1) / 7 * 0.9) + 0.1); //类似对数增长，比如4.5星高度就是原来的 0.707 倍
    }
    const density_arr_max = Math.max.apply(Math, data.density_arr) / density_scale;
    const density_graph = PanelDraw.LineChart(data.density_arr, density_arr_max, 0, 20, 130, 520, 90, rank_color, 1, 0.4, 3);
    const fail_index_rrect = data.rank === 'F' ? PanelDraw.RRect(20 + (520 * data.score_progress) - 1.5, 40, 3, 90, 1.5, '#ed6c9e') : '';

    //中下的失败率重试率图像
    const retry_fail_sum_arr = data.fail_arr ? data.fail_arr.map(function (v, i) {
        return v + data.retry_arr[i];
    }) : [];
    const retry_fail_sum_arr_max = Math.max.apply(Math, retry_fail_sum_arr);
    const retry_graph = PanelDraw.BarChart(retry_fail_sum_arr, retry_fail_sum_arr_max, 0,
        20, 250, 520, 90, 0, '#f6d659', 1);
    const fail_graph = PanelDraw.BarChart(data.fail_arr, retry_fail_sum_arr_max, 0,
        20, 250, 520, 90, 0, '#ed6c9e', 1);

    let labels = '';
    for (const v of data.labels) {
        const i = data.labels.indexOf(v);

        const d = await label_E(v, true);
        const x = (i % 2) * 210;
        const y = Math.floor(i / 2) * 80;

        labels += `<g transform="translate(${x} ${y})">` + d + '</g>';
    }

    const fail_rrect = PanelDraw.RRect(560, 250, 4.2 * data.fail_percent, 4, 2, '#ed6c9e');
    const retry_rrect = PanelDraw.RRect(560, 250, (4.2 * data.fail_percent + 4.2 * data.retry_percent), 4, 2, '#f6d659');
    const base_rrect = PanelDraw.RRect(560, 250, 420, 4, 2, '#aaa');

    // 导入部件
    svg = implantSvgBody(svg, 0, 0, fail_index_rrect, reg_label);
    svg = implantSvgBody(svg, 0, 0, density_graph, reg_graph);
    svg = implantSvgBody(svg, 0, 0, fail_graph, reg_graph);
    svg = implantSvgBody(svg, 0, 0, retry_graph, reg_graph);
    svg = implantSvgBody(svg, 560, 20, labels, reg_label);

    svg = implantSvgBody(svg, 0, 0, fail_rrect, reg_label);
    svg = implantSvgBody(svg, 0, 0, retry_rrect, reg_label);
    svg = implantSvgBody(svg, 0, 0, base_rrect, reg_label);

    return svg.toString();
}
