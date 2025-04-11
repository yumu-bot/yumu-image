import {
    exportJPEG, getPanelHeight, getPanelNameSVG, setImage,
    setSvgBody, readTemplate,
    setText
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {card_A4} from "../card/card_A4.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MF(data);
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
        const svg = await panel_MF(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * maimai 多成绩列表。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MF(data = {
    user: {},
    songs: [{
        "id": "8",
        "title": "True Love Song",
        "type": "SD",
        "ds": [
            5.0,
            7.2,
            10.2,
            12.4
        ],
        "level": [
            "5",
            "7",
            "10",
            "12"
        ],
        "cids": [
            1,
            2,
            3,
            4
        ],
        "charts": [
            {
                "notes": [
                    63,
                    23,
                    8,
                    2
                ],
                "charter": "-"
            },
            {
                "notes": [
                    85,
                    27,
                    6,
                    4
                ],
                "charter": "-"
            },
            {
                "notes": [
                    110,
                    56,
                    9,
                    2
                ],
                "charter": "譜面-100号"
            },
            {
                "notes": [
                    263,
                    14,
                    19,
                    6
                ],
                "charter": "ニャイン"
            }
        ],
        "basic_info": {
            "title": "True Love Song",
            "artist": "Kai/クラシック「G線上のアリア」",
            "genre": "舞萌",
            "bpm": 150,
            "release_date": "",
            "from": "maimai",
            "is_new": false
        },
        "alias": "爱歌"
    },],
}) {
    let svg = readTemplate('template/Panel_MA.svg')

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_card_i = /(?<=<g id="CardI">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MA1-1\);">)/;

    // 插入文字
    svg = setText(svg, getPanelNameSVG('Maimai Find (!ymmf)', 'MF'), reg_index);

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 330, getRandomBannerPath("maimai"), reg_banner, 0.8);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.maimaiPlayer2CardA1(data.user));

    // 导入A4卡
    const card_a4 = []

    for (const s of data.songs) {
        card_a4.push(await card_A4(s))
    }

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    for (let i = 0; i < card_a4.length; i++) {
        const x = i % 4
        const y = Math.floor(i / 4)

        svg = setSvgBody(svg,
            40 + x * 470, 330 + y * 230, card_a4[i], reg_card_i)
    }

    // 计算面板高度
    const panelHeight = getPanelHeight(card_a4.length, 210, 4, 290, 20, 40)
    const cardHeight = panelHeight - 290

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    return svg.toString()
}