import {
    getExportFileV3Path,
    getStarRatingObject,
    implantImage,
    implantSvgBody,
    replaceText,
    torus
} from "../util.js";
import moment from "moment";
import {card_K} from "./card_K.js";

export async function card_L(data = {
    name: 'Length', //Length, Combo, SR
    card_K: [ //第一个是最大值，第二个是中值（不是平均值），第三个是最小值。如果bp不足2个，中值和最小值留null，如果bp不足3个，中值留null
        {
            "index": 985, //这个得自己算，和对应的数据有关系。length给秒数（整数），combo给连击（整数），star rating给星数（小数）
            "ranking": 1, //排名，得自己计数，bp是bp几
            "list@2x": "https://assets.ppy.sh/beatmaps/382400/covers/list@2x.jpg?1622096843", //bp.beatmapset.covers['list@2x']
            "difficulty_rating": 6.38, //bp.beatmap.difficulty_rating
            "rank": "A", //bp.rank
        }, {

        }
    ],

}, reuse = false) {

    // 正则

    let reg_text = /(?<=<g id="Text_CL">)/;
    let reg_label_l = /(?<=<g id="Label_CL">)/;
    let reg_rrect = /(?<=<g id="RRect_CL">)/;
    let reg_card_k = /(?<=<g id="CardK_CL">)/;


    // 读取模板
    let svg = '<g id="CardK_CL">\n' +
        '  </g>\n' +
        '  <g id="Label_CL">\n' +
        '    <g id="Max_CL">\n' +
        '      <circle cx="90" cy="51" r="14.5" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 4px;"/>\n' +
        '      <polyline points="83 50 90 44 97 50" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 3px;"/>\n' +
        '      <polyline points="83 57 90 51 97 57" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 3px;"/>\n' +
        '    </g>\n' +
        '    <g id="Mid_CL">\n' +
        '      <circle cx="170" cy="51" r="14.5" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 4px;"/>\n' +
        '      <line x1="163" y1="51" x2="177" y2="51" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 3px;"/>\n' +
        '    </g>\n' +
        '    <g id="Min_CL">\n' +
        '      <circle cx="250" cy="51" r="14.5" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 4px;"/>\n' +
        '      <polyline points="243 44 250 51 257 44" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 3px;"/>\n' +
        '      <polyline points="243 51 250 58 257 51" style="fill: none; stroke: #fff550; stroke-miterlimit: 10; stroke-width: 3px;"/>\n' +
        '    </g>\n' +
        '  </g>\n' +
        '  <g id="RRect_CL">\n' +
        '  </g>\n' +
        '  <g id="Text_CL">\n' +
        '  </g>';

    // 定义文字
    const card_name = data.name;
    let card_icon;

    let index_arr = []; // max, mid, min;
    let index_b_arr = [];
    let index_m_arr = [];

    for (const i in data.card_K) {
        index_arr.push(data.card_K[i]['index']);
    }

    switch (card_name) {
        case 'Length': {
            for (const v of index_arr) {
                const minute = Math.floor(v / 60);
                let second = v - minute * 60;
                if (second < 10) second = '0' + second;

                index_b_arr.push(minute + ':');
                index_m_arr.push(second.toString());
            }
            card_icon = getExportFileV3Path('object-score-length.png');
        } break;

        case 'Combo': {
            for (const v of index_arr) {
                index_b_arr.push(v.toString());
                index_m_arr.push('x');
            }
            card_icon = getExportFileV3Path('object-score-combo.png');
        } break;

        case 'SR': {
            for (const v of index_arr) {
                index_b_arr.push(getStarRatingObject(v, 2).toString());
                index_m_arr.push(getStarRatingObject(v, 3).toString());
            }
            card_icon = getExportFileV3Path('object-score-beatsperminute.png');
        } break;
    }

    for (const i in index_arr) {
        let index = torus.get2SizeTextPath(index_b_arr[i],
            index_m_arr[i],
            24,
            18,
            90 + 80 * i,
            91.303,
            'center baseline',
            '#fff'
            )
        svg = replaceText(svg, index, reg_text);
    }

    // 导入K卡
    let cardKs = [];

    for (const v of data.card_K) {
        const h = await card_K({
            map_background: v["list@2x"],
            star_rating: v.difficulty_rating,
            score_rank: v.rank,
            bp_pp: ('bp ' + v.ranking.toString()), //把这个位置用来做ranking的显示了
            bp_remark: '',// PP
        },true);
        cardKs.push(h);
    }

    for (const i in cardKs) {
        svg = implantSvgBody(svg, 55 + i * 80, 100, cardKs[i], reg_card_k);
    }

    // 导入不明所以的矩形

    let rrect_svg = '';
    const rrect_arr = [];
    const rrect_max = 30;

    for (let i = 0; i < 30; i++) {
        let rrect_width = 30 - i; // rrect_arr[i] / rrect_max * 30
        rrect_svg += `<rect x="${10 + 30 - rrect_width}" y="${60 + i * 3}" width="${rrect_width}" height="2" style="fill: #fff550;"/>\n`
    }

    svg = implantSvgBody(svg, 0, 0, rrect_svg, reg_rrect);

    // 替换文字

    const name = torus.getTextPath(card_name, 60, 22.836, 24, 'left baseline', '#fff');

    svg = replaceText(svg, name, reg_text);

    // 替换图片

    svg = implantImage(svg, 50, 50, 0, 0, 1, card_icon, reg_label_l);

    return svg.toString();
}