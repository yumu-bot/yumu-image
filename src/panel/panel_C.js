import {
    exportImage,
    getExportFileV3Path,
    getMatchNameSplitted,
    getNowTimeStamp, getPanelNameSVG,
    getRandomBannerPath,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    implantImage,
    implantSvgBody,
    PanelGenerate,
    readTemplate,
    replaceText, replaceTexts,
    torus
} from "../util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";

export async function router(req, res) {
    try {
        const redUsers = req.fields?.redUsers;
        const blueUsers = req.fields?.blueUsers;
        const noneUsers = req.fields?.noneUsers;
        const matchInfo = req.fields?.matchInfo;
        const sid = req.fields?.sid;
        const redWins = req.fields?.redWins;
        const blueWins = req.fields?.blueWins;
        const isTeamVS = req.fields?.isTeamVS;

        const match = await PanelGenerate.matchInfo2CardA2(matchInfo, sid, redWins, blueWins, isTeamVS);

        let redArr = [];
        let blueArr = [];
        let noneArr = [];

        for (const i in redUsers) {
            let h = await PanelGenerate.userMatchData2CardH(redUsers[i]);
            redArr.push(h);
        }

        for (const i in blueUsers) {
            let h = await PanelGenerate.userMatchData2CardH(blueUsers[i]);
            blueArr.push(h);
        }

        for (const i in noneUsers) {
            let h = await PanelGenerate.userMatchData2CardH(noneUsers[i]);
            noneArr.push(h);
        }

        const player = {red: redArr, blue: blueArr, none: noneArr};

        const c_data = {match: match, player: player}

        const png = await panel_C(c_data);
        res.set('Content-Type', 'image/jpeg');
        res.send(png);
    } catch (e) {
        console.error("e", e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_C(data = {
    // A2卡
    match: {
        background: getExportFileV3Path('card-default.png'), //给我他们最后一局的谱面背景即可
        match_title: 'MP5 S11: (肉蛋葱鸡) vs (超级聊天)', //比赛标题
        match_round: 11,
        match_time: '20:25-22:03',//比赛开始到比赛结束。如果跨了一天，需要加24小时
        match_date: '2020-03-21',//比赛开始的日期
        average_star_rating: 5.46,
        mpid: 59438351,
        wins_team_red: 5,
        wins_team_blue: 6,
        is_team_vs : true,
    },
    // H卡
    player: {
        red: [{
            /*
            team: 'red',
            team_color: '#D32F2F',
            player_name: 'na-gi',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 464277,
            player_win: 5,
            player_lose: 1,
            player_rank: 1,
            player_rws: 0, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 1.22, // 木斗力
            mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: '',
        }, {
            team: 'red',
            team_color: '#D32F2F',
            player_name: '- Rainbow -',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 412096,
            player_win: 5,
            player_lose: 1,
            player_rank: 2,
            player_rws: 0, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 1.08, // 木斗力
            mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: '',
        }, {
            team: 'red',
            team_color: '#D32F2F',
            player_name: 'Guozi on Osu',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 268397,
            player_win: 5,
            player_lose: 1,
            player_rank: 6,
            player_rws: 0, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: 0.70, // 木斗力
            mra_color: '#D32F2F', // 玩家分类颜色 MRA v1.2 功能
            label_class: '1611 Dust', //玩家分类PRO MRA v3.4 功能
            class_color: '#fff', //部分字体需要显示为黑色
            label_mvp: 'MVP',
            */
        }],
        blue: [{
            /*
           team: 'blue',
           team_color: '#00A0E9',
           player_name: 'Mars New',
           player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
           player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
           player_score: 371937,
           player_win: 5,
           player_lose: 1,
           player_rank: 4,
           player_rws: 32.44, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
           player_mra: 0.97, // 木斗力
           mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
           label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
           class_color: '#fff', //部分字体需要显示为黑色
           label_mvp: '',
       }, {
           team: 'blue',
           team_color: '#00A0E9',
           player_name: 'No Rank',
           player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
           player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
           player_score: 371007,
           player_win: 5,
           player_lose: 1,
           player_rank: 5,
           player_rws: 32.36, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
           player_mra: 0.97, // 木斗力
           mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
           label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
           class_color: '#fff', //部分字体需要显示为黑色
           label_mvp: '',
       }, {
           team: 'blue',
           team_color: '#00A0E9',
           player_name: 'GreySTrip_VoV',
           player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
           player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
           player_score: 403437,
           player_win: 5,
           player_lose: 1,
           player_rank: 3,
           player_rws: 35.19, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
           player_mra: 1.06, // 木斗力
           mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
           label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
           class_color: '#fff', //部分字体需要显示为黑色
           label_mvp: '',

            */
        }],
        none: [{
            /*
            team: 'none',
            team_color: '#a1a1a1',
            player_name: 'Fushimi Rio',
            player_avatar: getExportFileV3Path('PanelObject/I_CardH_Avatar.png'),
            player_banner: getExportFileV3Path('PanelObject/I_CardH_BG.png'),
            player_score: 57434,
            player_win: 5,
            player_lose: 1,
            player_rank: 4,
            player_rws: 32.44,
            player_mra: 0.97,
            mra_color: '#fefefe',
            label_class: 'Fia',
            class_color: '#000',
            label_mvp: '',

             */
        }],// 没分队的
    },

}) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    // 路径定义
    let reg_cardheight = '${cardheight}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;
    let reg_bodycard = /(?<=<g id="BodyCard">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Yumu Rating v3.5 (!ymra)', 'MRA', 'v0.3.0 EA');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A2卡
    let title, title1, title2;
    let isTeamVS = true;
    if (data.match.wins_team_red <= 0 && data.match.wins_team_blue <= 0) {
        isTeamVS = false;
    }

    let isContainVS = data.match.match_title.toLowerCase().match('vs')

    if (isContainVS){
        title = getMatchNameSplitted(data.match.match_title);
        title1 = title[0];
        title2 = title[1] + ' vs ' + title[2];
    } else {
        title1 = data.match.match_title;
        title2 = '';
    }

    let left1 = data.match.match_round ? 'Round ' + data.match.match_round : '-';
    let left2 = data.match.match_time || 'time?';
    let left3 = data.match.match_date || 'date?';
    let right1 = 'AVG.SR ' + data.match.average_star_rating;
    let right2 = 'mp' + data.match.mpid || 0;
    let wins_team_red = data.match.wins_team_red || 0;
    let wins_team_blue = data.match.wins_team_blue || 0;
    let right3b;

    if (isTeamVS) {
        right3b = wins_team_red + ' : ' + wins_team_blue;
    } else {
        right3b = '-';
    }


    let card_A2_impl =
        await card_A2({data,
            title1: title1,
            title2: title2,
            title_font: 'PuHuiTi',
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
        },  true);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);
    svg = implantSvgBody(svg,40,40,card_A2_impl,reg_maincard);

    // 插入主体卡片

    let rowTotal;

    async function BodyCard(data) {
        let arr2 = data.player;
        let rowSum = 0; //总共的行数

        //渲染红队
        for (let i = 0; i < arr2['red'].length; i++) {
            await implantCardH(arr2['red'][i],i+1 ,1, 2);
        }

        //渲染蓝队
        for (let i = 0; i < arr2['blue'].length; i++) {
            await implantCardH(arr2['blue'][i],i+1 ,2, 2);
        }

        rowSum += Math.max(arr2['red'].length, arr2['blue'].length)

        //渲染不在队伍（无队伍）
        if (arr2['none']) {
            let tianxuanzhizi;
            if (arr2['none'].length % 2 === 1){
                tianxuanzhizi = arr2['none'].pop();
            }

            for (let i = 0; i < arr2['none'].length; i += 2) {
                for (let j = 0; j < 2; j++) {
                    await implantCardH(arr2['none'][(i + j)], rowSum + i/2 + 1, j + 1, 2, isTeamVS);
                }
            }
            rowSum += arr2['none'].length / 2;

            if (tianxuanzhizi){
                await implantCardH(tianxuanzhizi, rowSum + 1, 1, 1, isTeamVS);
                rowSum ++;
            }
        }
        rowTotal = rowSum;
    }

    async function implantCardH(object, row = 1, column = 1, maxColumn = 2, isVS = true) {
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

        let left1;

        if (isVS) {
            left1 = getRoundedNumberLargerStr(object.player_score, 3) +
                getRoundedNumberSmallerStr(object.player_score, 3) +
                ' // ' +
                object.player_win +
                'W-' + object.player_lose +
                'L (' +
                Math.round((object.player_win / (object.player_win + object.player_lose)) * 100) +
                '%)';
        } else {
            left1 = getRoundedNumberLargerStr(object.player_score, 3) +
                getRoundedNumberSmallerStr(object.player_score, 3) +
                ' // ' +
                object.player_win +
                'x Round(s)';
        }

        let left2 = '#' +
            (object.player_rank || 0)+
            ' (' +
            Math.round(object.player_rws * 100)/100 +
            ')';
        let index_b = getRoundedNumberLargerStr(object.player_mra, 3);
        let index_m = getRoundedNumberSmallerStr(object.player_mra, 3);

        let color_label3 = '#382E32';
        let color_label4 = '#382E32';

        let label_en = getPlayerLabelItems(object, 0);
        let label_zh = getPlayerLabelItems(object, 1);
        let mra_color = getPlayerLabelItems(object, 2);
        let class_color = getPlayerLabelItems(object, 3);

        let card_H_impl =
            await card_H({
                background: object.player_banner,
                cover: object.player_avatar,
                title: object.player_name,
                left1: left1,
                left2: left2,
                index_b: index_b,
                index_m: index_m,
                label3: label_en,
                label4: label_zh,
                color_label3: color_label3,
                color_label4: color_label4,
                color_left: object.team_color,
                color_right: mra_color,
                color_index: class_color,

                font_label4: 'PuHuiTi',

            }, true);

        svg = implantSvgBody(svg, x, y, card_H_impl, reg_bodycard);
    }

    await BodyCard(data);

    // 获取玩家标签的各项物品，0 是全称，1 是 中文称呼，2 是 v1.2 的九色卡色标，3 是文字的颜色
    function getPlayerLabelItems(object, whichData = 0) {
        const v1 = object.player_Label_V1;
        const v2 = object.player_Label_V2;

        let en;
        let zh;
        let back_color;
        let text_color = '#fff';

        switch (v1) {
            case 'BC': back_color = '#FFF100'; text_color = '#382E32'; break;
            case 'CA': back_color = '#FF9800'; break;
            case 'MF': back_color = '#22AC38'; break;
            case 'SP': back_color = '#B3D465'; break;
            case 'WF': back_color = '#0068B7'; break;
            case 'GE': back_color = '#BDBDBD'; break;
            case 'GU': back_color = '#00A0E9'; break;
            case 'SU': back_color = '#9922EE'; break;
            case 'SG': back_color = '#E4007F'; break;
            case 'NO': back_color = '#EB6877'; break;
            case 'FU': back_color = '#D32F2F'; break;
            default: back_color = '#382E32';
        }

        switch (v2) {
            case 'SMA': en = 'Strongest Marshal'; zh = '最强元帅'; break;
            case 'CMA': en = 'Competent Marshal'; zh = '称职元帅'; break;
            case 'IMA': en = 'Indomitable Marshal'; zh = '不屈元帅'; break;
            case 'EGE': en = 'Ever-Victorious General'; zh = '常胜将军'; break;
            case 'AGE': en = 'Assiduous General'; zh = '勤奋将军'; break;
            case 'SGE': en = 'Striven General'; zh = '尽力将军'; break;
            case 'BMF': en = 'Breakthrough Main Force'; zh = '突破主力'; break;
            case 'RMF': en = 'Reliable Main Force'; zh = '可靠主力'; break;
            case 'SMF': en = 'Staunch Main Force'; zh = '坚守主力'; break;
            case 'EAS': en = 'Elite Assassin'; zh = '精锐刺客'; break;
            case 'NAS': en = 'Normal Assassin'; zh = '普通刺客'; break;
            case 'FAS': en = 'Fake Assassin'; zh = '冒牌刺客'; break;
            case 'GCW': en = 'Gold Collar Worker'; zh = '金领工人'; break;
            case 'WCW': en = 'White Collar Worker'; zh = '白领工人'; break;
            case 'BCW': en = 'Blue Collar Worker'; zh = '蓝领工人'; break;
            case 'KPS': en = 'Key Person'; zh = '关键人'; break;
            case 'CMN': en = 'Common Man'; zh = '普通人'; break;
            case 'PSB': en = 'Passer-by'; zh = '路人甲'; break;
            case 'MAC': en = 'Major Character'; zh = '主要角色'; break;
            case 'MIC': en = 'Minor Character'; zh = '次要角色'; break;
            case 'FIG': en = 'Figurant'; zh = '群众演员'; break;
            case 'SAM': en = 'Stable as Mountain'; zh = '稳如泰山'; break;
            case 'HAS': en = 'Hard as Stone'; zh = '坚若磐石'; break;
            case 'SIN': en = 'Seriously Injured'; zh = '伤痕累累'; break;
            case 'ANI': en = 'Advanced Ninja'; zh = '上等忍者'; break;
            case 'MNI': en = 'Mediocre Ninja'; zh = '普通忍者'; break;
            case 'LCS': en = 'Lower-class'; zh = '不入流'; break;
            case 'LKD': en = 'Lucky Dog'; zh = '幸运儿'; break;
            case 'QAP': en = 'Qualified Apprentice'; zh = '合格学徒'; break;
            case 'BGN': en = 'Beginner'; zh = '初学者'; break;
            case 'LSS': en = 'Life-saving Straw'; zh = '救命稻草'; break;
            case 'LSP': en = 'Little Spark'; zh = '点点星火'; break;
            case 'BDT': en = 'Burnt Dust'; zh = '湮灭尘埃'; break;
            default: en = 'Unknown'; zh = '未知'; break;
        }

        switch (whichData) {
            case 0: return en;
            case 1: return zh;
            case 2: return back_color;
            case 3: return text_color;
        }
    }

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

    return await exportImage(svg);
}

