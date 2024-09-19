import {
    exportJPEG, getPanelNameSVG, implantImage,
    implantSvgBody, readTemplate,
    replaceText
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_I} from "../card/card_I.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MA(data);
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
        const svg = await panel_MA(data);
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
export async function panel_MA(data = {
    user: {},
    scores: [{
        "achievements": 100.5133,
        "ds": 10.4,
        "dxScore": 1125,
        "fc": "fc",
        "fs": "sync",
        "level": "10",
        "level_index": 2,
        "level_label": "Expert",
        "ra": 234,
        "rate": "sssp",
        "song_id": 10319,
        "title": "幻想のサテライト",
        "artist": "豚乙女",
        "charter": "mai-Star",
        "type": "DX",
        "max": 234,
        "position": null,
    },],

    // 仅 b35+b15 使用
    scores_latest: [],
}) {
    let svg = readTemplate('template/Panel_MA.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_card_i = /(?<=<g id="CardI">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MA1-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Maimai Multiple Scores (!ymx)', 'SS', 'v0.4.1 SE');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await PanelGenerate.maimaiPlayer2CardA1(data.user));

    const standard = data?.scores || []
    const deluxe = data?.scores_latest || []

    // 导入i卡
    let cardI1 = [];
    let cardI2 = [];

    for (const s of standard) {
        cardI1.push(await card_I(maiScore2CardI(s))) ;
    }

    for (const s of deluxe) {
        cardI2.push(await card_I(maiScore2CardI(s))) ;
    }


    // 插入卡片
    svg = implantSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const I1_height = Math.ceil(cardI1.length / 4) * 150
    const I2_height = Math.ceil(cardI2.length / 4) * 150

    for (const i in cardI1) {
        const x = i % 4;
        const y = Math.floor(i / 4);

        svg = implantSvgBody(svg, 40 + 470 * x, 330 + 150 * y, cardI1[i], reg_card_i);
    }

    for (const i in cardI2) {
        const x = i % 4;
        const y = Math.floor(i / 4);

        svg = implantSvgBody(svg, 40 + 470 * x, 330 + 150 * y + I1_height, cardI2[i], reg_card_i);
    }

    // 导入图片
    svg = implantImage(svg, 1920, 330, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 计算面板高度
    const cardHeight = I1_height + I2_height + 40
    const panelHeight = cardHeight + 290

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    return svg.toString()
}

function maiScore2CardI(score) {
    return {
        id: score?.song_id || 0,
        difficulty: score?.ds || 0,
        rating: score?.ra || 0,
        max: score?.max || 0,
        achievements: score?.achievements || 0,
        score: score?.dxScore || 0,
        index: score?.level_index || '',
        position: score.position,

        title: score?.title || '',
        artist: score?.artist || '',
        charter: score?.charter || '',
        rank: score?.rate || '',

        combo: score?.fc,
        sync: score?.fs,
        type: score?.type,
    }
}