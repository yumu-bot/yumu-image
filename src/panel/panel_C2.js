import {
    exportJPEG,
    getImageFromV3,
    getPanelNameSVG,
    setImage,
    setSvgBody,
    readTemplate,
    setText,
    getSvgBody,
    getPanelHeight,
    getAvatar,
    floor,
    floors,
    readNetImage,
    getNowTimeStamp,
    getFormattedTime,
    setTexts
} from "../util/util.js";
import {card_C} from "../card/card_C.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PuHuiTi, torus} from "../util/font.js";
import {getCompetitorColors} from "../util/color.js";

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
 * 系列斗力 SRA
 * @param data
 * @return {Promise<string>}
 */
export async function panel_C2(data = {
    match_count: 0,
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    // 路径定义
    let reg_cardheight = '${cardheight}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;

    // 面板文字

    const start_time = getFormattedTime(data?.statistics?.start_time, 'YYYY/MM/DD HH:mm')
    const end_time = getFormattedTime(data?.statistics?.end_time, 'YYYY/MM/DD HH:mm')
    const request_time = 'series duration: ' + start_time + ' - ' + end_time + ' // request time: ' + getNowTimeStamp();

    const panel_name = getPanelNameSVG('Yumu Series Rating v3.5 (!ymsa)', 'SA', request_time);

    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A2卡
    const cardA2 = card_A2(await seriesRating2CardA2(data));

    // 插入图片和部件（新方法
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);
    svg = setSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 导入H卡
    /**
     *
     * @type {string[]}
     */
    let cardHs = [];
    const players = data?.player_data_list || [];

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
                drawCardH(await playerData2CardH(dataArr[i + j]), i / 2 + 1, j + 1, 2));
        }
    }

    if (luckyDog != null) {
        cardHs.push(
            drawCardH(await playerData2CardH(luckyDog), rowFull, 1, 1));
    }

    svg = setTexts(svg, cardHs, reg_maincard);

    // 计算面板高度
    const panelHeight = getPanelHeight(dataArr?.length, 110, 2, 290, 40, 40);
    const cardHeight = panelHeight - 290;

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    return svg.toString();
}

async function playerData2CardH(p = {}) {
    const rws = Math.round(p.rws * 10000) / 100;

    const left1 = floor(p.total, 2) +
            ' // ' + p.win + 'W-' + p.lose + 'L (' +
            Math.round((p.win / (p.win + p.lose)) * 100) + '%)';


    const left2 = '#' + (p.ranking || 0) + ' (' + rws + ')';

    const player_class = p.player_class;
    const color_index = (player_class.name === "Strongest Marshal" || player_class.name === "Competent Marshal" || player_class.name === "Indomitable Marshal") ? "#2A2226" : "#FFF";

    const background = getCompetitorBackground(player_class.color)
    const colors = getCompetitorColors(player_class.color)

    const avatar = await getAvatar(p.player.avatar_url, true);
    const mra_number = floors(p?.mra, 2)

    return {
        background: background,
        cover: avatar,
        title: p?.player?.username || 'UID:' + p.player.id,
        title2: p?.player?.country?.country_code || '',
        left1: left1,
        left2: left2,
        index_b: mra_number.integer,
        index_m: mra_number.decimal,
        index_b_size: 48,
        index_m_size: 36,
        label1: '',
        label2: '',
        label3: player_class?.name,
        label4: player_class?.name_cn,
        mods_arr: [],

        color_title2: '#aaa',
        color_right: colors,
        color_left: colors,
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

async function seriesRating2CardA2(sr){
    const star = floor(sr?.average_star || 0, 2);

    const background = await readNetImage('https://assets.ppy.sh/beatmaps/' + sr?.first_map_sid + '/covers/list.jpg', true);

    const title = sr?.statistics?.name || "";
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
    const left2 = 'Match: ' + sr?.match_count + ' // Round: ' + sr?.round_count
    const left3 = 'Player: ' + sr?.player_count + ' // Score: ' + sr?.score_count

    const right1 = 'Average Star ' + star + '*';
    const right2 = 'Scores per Player'; // + data.matchStat.id || 0;

    const sp_number = floors(sr?.score_count / sr?.player_count, 2)

    const right3b = sr?.player_count > 0 ? sp_number.integer : "0";
    const right3m = sr?.player_count > 0 ? sp_number.decimal : "";

    return {
        background: background,
        map_status: '',

        title1: title1,
        title2: title2,
        title_font: 'PuHuiTi',
        left1: '',
        left2: left2,
        left3: left3,
        right1: right1,
        right2: right2,
        right3b: right3b,
        right3m: right3m,
        isTeamVS: false,
    };
}

function drawCardH(data = {}
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

    const body = card_C(data);

    return getSvgBody(x, y, body);
}

function getCompetitorBackground(color) {
    let bg;

    switch (color) {
        case "#FFF100": bg = 'object-score-backimage-X.jpg'; break;
        case "#FF9800": bg = 'object-score-backimage-S.jpg'; break;
        case "#22AC38": bg = 'object-score-backimage-A.jpg'; break;
        case "#B3D465": bg = 'object-score-backimage-A.jpg'; break;
        case "#0068B7": bg = 'object-score-backimage-B.jpg'; break;
        case "#BDBDBD": bg = 'object-score-backimage-XH.jpg'; break;
        case "#00A0E9": bg = 'object-score-backimage-B.jpg'; break;
        case "#9922EE": bg = 'object-score-backimage-C.jpg'; break;
        case "#E4007F": bg = 'object-score-backimage-C.jpg'; break;
        case "#EB6877": bg = 'object-score-backimage-D.jpg'; break;
        case "#D32F2F": bg = 'object-score-backimage-D.jpg'; break;
        default: bg = 'object-score-backimage-F.jpg'; break;
    }

    return getImageFromV3(bg);
}

