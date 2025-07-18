import {
    getImageFromV3,
    setImage,
    setSvgBody,
    setText, floors,
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_I4} from "./card_I4.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function card_L(data = {
    name: 'Length', //Length, Combo, SR
    card_K: [ //第一个是最大值，第二个是中值（不是平均值），第三个是最小值。如果bp不足2个，中值和最小值留null，如果bp不足3个，中值留null
        {
            length: 0, //length给秒数（整数）
            combo: 0, //combo给连击（整数）
            ranking: 1, //排名，得自己计数，bp是bp几
            cover: null, //bp.beatmapset.covers['list@2x']
            star: 0, // 实际star
            rank: "F", // bp.rank
            mods: ['']
        },
    ],

}) {

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



    switch (card_name) {
        case 'Length': {
            for (const i in data.card_K) {
                index_arr.push(data.card_K[i].length);
            }

            for (const v of index_arr) {
                const minute = Math.floor(v / 60);
                let second = v - minute * 60;
                if (second < 10) second = '0' + second;

                index_b_arr.push(minute + ':');
                index_m_arr.push(second.toString());
            }
            card_icon = getImageFromV3('object-score-length.png');
        } break;

        case 'Combo': {
            for (const i in data.card_K) {
                index_arr.push(data.card_K[i].combo);
            }

            for (const v of index_arr) {
                index_b_arr.push(v.toString());
                index_m_arr.push('x');
            }
            card_icon = getImageFromV3('object-score-combo.png');
        } break;

        case 'Star Rating': {
            for (const i in data.card_K) {
                index_arr.push(data.card_K[i].star);
            }

            for (const v of index_arr) {
                const vn = floors(v, 2)

                index_b_arr.push(vn.integer);
                index_m_arr.push(vn.decimal);
            }
            card_icon = getImageFromV3('object-score-beatsperminute.png');
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
        svg = setText(svg, index, reg_text);
    }

    // 导入K卡
    let cardKs = [];

    for (const v of data.card_K) {
        const h = await card_I4({
            map_background: v.cover,
            star_rating: v.star,
            score_rank: v.rank,
            bp_pp: ('#' + (v.ranking || 0)), //把这个位置用来做ranking的显示了
            bp_remark: '',// PP
        });
        cardKs.push(h);
    }

    for (const i in cardKs) {
        svg = setSvgBody(svg, 55 + i * 80, 100, cardKs[i], reg_card_k);
    }

    // 导入不明所以的矩形

    let rrect_svg = '';

    for (let i = 0; i < 30; i++) {
        let rrect_width = 30 - i;
        rrect_svg += PanelDraw.Rect(
            10 + 30 - rrect_width,
            60 + i * 3,
            rrect_width,
            2,
            0,
            '#fff550'
        );
    }

    svg = setSvgBody(svg, 0, 0, rrect_svg, reg_rrect);

    // 替换文字

    const name = torus.getTextPath(card_name, 60, 22.836, 24, 'left baseline', '#fff');

    svg = setText(svg, name, reg_text);

    // 替换图片

    svg = setImage(svg, 0, 0, 50, 50, card_icon, reg_label_l, 1);

    return svg.toString();
}