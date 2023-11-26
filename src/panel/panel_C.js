import {
    exportJPEG, getExportFileV3Path, getMapBG, getMatchNameSplitted,
    getPanelNameSVG,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    getRoundedNumberStr,
    implantImage,
    implantSvgBody, readNetImage,
    readTemplate,
    replaceText, transformSvgBody
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import moment from "moment";

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
    const cardA2 = await card_A2(await matchData2CardA2(data), true);

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

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

    const rowTotal = rowVS + Math.floor(noneArr.length / 2);

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
            player_background = getExportFileV3Path('card-red.png');
            isTeamVS = true;
            break;
        case 'blue':
            team_color = '#00A0E9';
            player_background = getExportFileV3Path('card-blue.png');
            isTeamVS = true;
            break;
        default:
            team_color = '#aaa';
            player_background = getExportFileV3Path('card-gray.png');
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
            ' // ' +
            p.win +
            'x Round(s)';
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
        index_b: getRoundedNumberLargerStr(p.mra, 3),
        index_m: getRoundedNumberSmallerStr(p.mra, 3),
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

async function matchData2CardA2(data){
    const redWins = data.teamPoint.red || 0;
    const blueWins = data.teamPoint.blue || 0;

    const isTeamVS = data.teamVS;
    const star = getRoundedNumberStr(data.averageStar || 0, 3);

    const background = await getMapBG(data.firstMapSID, 'list@2x', false);

    const isContainVS = data.matchStat.name.toLowerCase().match('vs');
    let title, title1, title2;
    if (isContainVS) {
        title = getMatchNameSplitted(data.matchStat.name);
        title1 = title[0];
        title2 = title[1] + ' vs ' + title[2];
    } else {
        title1 = data.matchStat.name;
        title2 = '';
    }

    //这里的时间戳不需要 .add(8, 'hours')
    const left1 = 'R' + data.roundCount + ' P' + data.playerCount + ' S' + data.scoreCount;
    let left2;

    if (data.matchEnd) {
        left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-' + moment(data.matchStat.end_time, 'X').format('HH:mm');
    } else if (data.hasCurrentGame) {
        left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-playing';
    } else {
        left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-continuing';
    }

    const left3 = moment(data.matchStat.start_time, 'X').format('YYYY/MM/DD');

    const right1 = 'SR ' + star + '*';
    const right2 = 'mp' + data.matchStat.id || 0;
    const right3b = isTeamVS ? (redWins + ' : ' + blueWins) : data.roundCount.toString();
    const right3m = isTeamVS ? '' : 'x';

    return {
        background: background,
        map_status: '',

        title1: title1,
        title2: title2,
        title_font: 'PuHuiTi',
        left1: left1,
        left2: left2,
        left3: left3,
        right1: right1,
        right2: right2,
        right3b: right3b,
        right3m: right3m,
        isTeamVS: isTeamVS,
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

