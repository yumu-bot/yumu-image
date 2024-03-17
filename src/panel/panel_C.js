import {
    exportJPEG, getImageFromV3, getPanelNameSVG,
    getRoundedNumberStrLarge,
    getRoundedNumberStrSmall,
    getRoundedNumberStr,
    implantSvgBody, readNetImage,
    readTemplate, replaceBanner,
    replaceText, transformSvgBody
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_C(data);
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
        const svg = await panel_C(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 比赛评分1号, 是木斗力的那个
 * @param data
 * @return {Promise<string>}
 */
export async function panel_C(data = {}) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    // 路径定义
    let reg_cardheight = '${cardheight}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Yumu Rating v3.5 (!ymra)', 'MRA', 'v0.3.2 FT');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A2卡
    const matchInfo = await card_A2(await PanelGenerate.matchData2CardA2(data));

    // 插入图片和部件（新方法
    svg = replaceBanner(svg, reg_banner);
    svg = implantSvgBody(svg, 40, 40, matchInfo, reg_maincard);

    // 导入H卡
    let cardHs = [];
    const isTeamVS = data.teamVS;
    const playerDataList = data.playerDataList || [];

    let redArr = [];
    let blueArr = [];
    let noneArr = [];

    for (const v of playerDataList) {
        const team = v.team;
        switch (team) {
            case "red": redArr.push(v); break;
            case "blue": blueArr.push(v); break;
            default : noneArr.push(v); break;
        }
    }

    const rowVS = Math.max(redArr.length, blueArr.length) || 0;
    //后面天选之子会修改 noneArr，所以在这里调出
    const rowTotal = rowVS + Math.ceil(noneArr.length / 2);

    if (isTeamVS) {
        //渲染红队
        for (let i = 0; i < redArr.length; i++) {
            cardHs.push(
                await drawCardH(await playerData2CardH(redArr[i]), i + 1 ,1, 2));
        }
        //渲染蓝队
        for (let i = 0; i < blueArr.length; i++) {
            cardHs.push(
                await drawCardH(await playerData2CardH(blueArr[i]), i + 1 ,2, 2));
        }
    } else {
        //渲染不在队伍（无队伍）
        const rowFull = Math.floor(noneArr.length / 2) + 1;
        const luckyDog = (noneArr.length % 2 === 1) ? noneArr.pop() : null;

        for (let i = 0; i < noneArr.length; i += 2) {
            for (let j = 0; j < 2; j++) {
                cardHs.push(
                    await drawCardH(await playerData2CardH(noneArr[i + j]), rowVS + i / 2 + 1, j + 1, 2));
            }
        }

        if (luckyDog != null) {
            cardHs.push(
                await drawCardH(await playerData2CardH(luckyDog), rowVS + rowFull, 1, 1));
        }
    }

    svg = replaceText(svg, cardHs, reg_maincard);

    // 计算面板高度
    let panelHeight, cardHeight;

    if (rowTotal) {
        panelHeight = 330 + 150 * rowTotal;
        cardHeight = 40 + 150 * rowTotal;
    } else {
        panelHeight = 1080;
        cardHeight = 790;
    }

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    return svg.toString();
}

async function playerData2CardH(p = {}) {

    let team_color;
    let player_background;
    let isTeamVS;

    switch (p.team) {
        case 'red':
            team_color = '#D32F2F';
            player_background = getImageFromV3('card-red.png');
            isTeamVS = true;
            break;
        case 'blue':
            team_color = '#00A0E9';
            player_background = getImageFromV3('card-blue.png');
            isTeamVS = true;
            break;
        default:
            team_color = '#aaa';
            player_background = getImageFromV3('card-gray.png');
            isTeamVS = false;
            break;
    }

    const rws = Math.round(p.rws * 10000) / 100;

    let left1;
    if (isTeamVS) {
        left1 = getRoundedNumberStr(p.tts, 3) +
            ' // ' + p.win + 'W-' + p.lose + 'L (' +
            Math.round((p.win / (p.win + p.lose)) * 100) + '%)';
    } else {
        left1 = getRoundedNumberStr(p.tts, 3) +
            ' // ' + p.win + 'W-' + (p.win + p.lose) + 'P';
    }

    const left2 = '#' + (p.ranking || 0) + ' (' + rws + ')';

    const pClass = p.playerClass;
    const color_index = (pClass.name === "Strongest Marshal" || pClass.name === "Competent Marshal" || pClass.name === "Indomitable Marshal") ? "#2A2226" : "#FFF";

    return {
        background: player_background,
        cover: await readNetImage(p.player.avatar_url, false),
        title: p.player.username || 'UID:' + p.player.id,
        title2: p.player.country.countryCode || '',
        left1: left1,
        left2: left2,
        index_b: getRoundedNumberStrLarge(p.mra, 3),
        index_m: getRoundedNumberStrSmall(p.mra, 3),
        index_b_size: 48,
        index_m_size: 36,
        label1: '',
        label2: '',
        label3: pClass.name,
        label4: pClass.nameCN,
        mods_arr: [],

        color_title2: '#aaa',
        color_right: pClass.color,
        color_left: team_color,
        color_index: color_index,
        color_label1: '',
        color_label2: '',
        color_label3: '#382E32',
        color_label4: '#382E32',
        color_left12: '#bbb', //左下两排字的颜色

        font_title2: 'torus',
        font_label4: 'PuHuiTi',
    };
}
async function drawCardH(data = {}
    , row = 1, column = 1, maxColumn = 2) {
    let x;
    let y;
    let x_base;

    switch (maxColumn) {
        case 2:
            x_base = 40;
            break;
        case 1:
            x_base = 510;
            break;
    }

    x = x_base + 940 * (column - 1);
    y = 330 + 150 * (row - 1);

    const body = await card_H(data, true);

    return transformSvgBody(x, y, body);
}

