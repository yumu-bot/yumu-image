import {
    exportJPEG, getImageFromV3, getMapBG, getPanelNameSVG,
    getRoundedNumberStrLarge,
    getRoundedNumberStrSmall,
    getRoundedNumberStr,
    implantImage,
    implantSvgBody, readTemplate,
    replaceText, transformSvgBody, getPanelHeight, getAvatar
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import moment from "moment";
import {PuHuiTi, torus} from "../util/font.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_C2(data);
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
        const svg = await panel_C2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 比赛评分2号, 不是木斗力那个
 * @param data
 * @return {Promise<string>}
 */
export async function panel_C2(data = {}) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    // 路径定义
    let reg_cardheight = '${cardheight}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Yumu Series Rating v3.5 (!ymsa)', 'SA', 'v0.5.0 DX');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A2卡
    const cardA2 = await card_A2(await seriesData2CardA2(data));

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 导入H卡
    let cardHs = [];
    const players = data?.seriesData?.playerDataList || [];

    let dataArr = [];

    for (const v of players) {
        dataArr.push(v);
    }
    //渲染不在队伍（无队伍）
    const rowFull = Math.floor(dataArr.length / 2) + 1;
    const luckyDog = (dataArr.length % 2 === 1) ? dataArr.pop() : null;

    for (let i = 0; i < dataArr.length; i += 2) {
        for (let j = 0; j < 2; j++) {
            cardHs.push(
                await drawCardH(await playerData2CardH(dataArr[i + j]), i / 2 + 1, j + 1, 2));
        }
    }

    if (luckyDog != null) {
        cardHs.push(
            await drawCardH(await playerData2CardH(luckyDog), rowFull, 1, 1));
    }

    svg = replaceText(svg, cardHs, reg_maincard);

    // 计算面板高度
    const panelHeight = getPanelHeight(dataArr?.length, 110, 2, 290, 40, 40);
    const cardHeight = panelHeight - 290;

    svg = replaceText(svg, panelHeight, reg_panelheight);
    svg = replaceText(svg, cardHeight, reg_cardheight);

    return svg.toString();
}

async function playerData2CardH(p = {}) {
    const rws = Math.round(p.rws * 10000) / 100;

    const left1 = getRoundedNumberStr(p.total, 3) +
            ' // ' + p.win + 'W-' + p.lose + 'L (' +
            Math.round((p.win / (p.win + p.lose)) * 100) + '%)';


    const left2 = '#' + (p.ranking || 0) + ' (' + rws + ')';

    const pClass = p.playerClass;
    const color_index = (pClass.name === "Strongest Marshal" || pClass.name === "Competent Marshal" || pClass.name === "Indomitable Marshal") ? "#2A2226" : "#FFF";

    let pubg;
    switch (pClass.color) {
        case "#FFF100": pubg = 'object-score-backimage-X.jpg'; break;
        case "#FF9800": pubg = 'object-score-backimage-S.jpg'; break;
        case "#22AC38": pubg = 'object-score-backimage-A.jpg'; break;
        case "#B3D465": pubg = 'object-score-backimage-A.jpg'; break;
        case "#0068B7": pubg = 'object-score-backimage-B.jpg'; break;
        case "#BDBDBD": pubg = 'object-score-backimage-XH.jpg'; break;
        case "#00A0E9": pubg = 'object-score-backimage-B.jpg'; break;
        case "#9922EE": pubg = 'object-score-backimage-C.jpg'; break;
        case "#E4007F": pubg = 'object-score-backimage-C.jpg'; break;
        case "#EB6877": pubg = 'object-score-backimage-D.jpg'; break;
        case "#D32F2F": pubg = 'object-score-backimage-D.jpg'; break;
        default: pubg = 'object-score-backimage-F.jpg'; break;
    }

    const avatar = await getAvatar(p.player.avatar_url, true);

    return {
        background: getImageFromV3(pubg),
        cover: avatar,
        title: p?.player?.username || 'UID:' + p.player.id,
        title2: p?.player?.country?.countryCode || '',
        left1: left1,
        left2: left2,
        index_b: getRoundedNumberStrLarge(p?.mra, 3),
        index_m: getRoundedNumberStrSmall(p?.mra, 3),
        index_b_size: 48,
        index_m_size: 36,
        label1: '',
        label2: '',
        label3: pClass?.name,
        label4: pClass?.nameCN,
        mods_arr: [],

        color_title2: '#aaa',
        color_right: pClass?.color,
        color_left: pClass?.color,
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

async function seriesData2CardA2(data){
    const s_data = data?.seriesData
    const s_stat = data?.series?.seriesStat

    const star = getRoundedNumberStr(s_data?.averageStar || 0, 3);

    const background = await getMapBG(s_data?.firstMapSID, 'list@2x', false);

    const title = s_stat?.name || "";
    let title1, title2;
    const title_cut = PuHuiTi.cutStringTail(title, 36, 390,false);
    if (title_cut.length === title.toString().length) {
        title1 = title;
        title2 = '';
    } else {
        title1 = title_cut;
        title2 = title.toString().substring(title_cut.length);
    }

    //这里的时间戳不需要 .add(8, 'hours')
    const left1 = 'M' + s_data?.matchCount +
        ' R' + s_data?.roundCount +
        ' P' + s_data?.playerCount +
        ' S' + s_data?.scoreCount;

    const left2 = moment(s_stat?.start_time, 'X').format('YYYY/MM/DD HH:mm')
    const left3 = moment(s_stat?.end_time, 'X').format('YYYY/MM/DD HH:mm');

    const right1 = 'SR ' + star + '*';
    const right2 = 'Scores/Player'; // + data.matchStat.id || 0;
    const right3b = s_data?.playerCount > 0 ? getRoundedNumberStrLarge(s_data?.scoreCount / s_data?.playerCount, 3) : "0";
    const right3m = s_data?.playerCount > 0 ? getRoundedNumberStrSmall(s_data?.scoreCount / s_data?.playerCount, 3) : "";

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
        isTeamVS: false,
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

    const body = await card_H(data);

    return transformSvgBody(x, y, body);
}

