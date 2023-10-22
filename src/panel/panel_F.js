import {
    exportJPEG,
    getExportFileV3Path,
    getMatchNameSplitted,
    getDecimals,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText, readNetImage, getPanelNameSVG, getGameMode, getRoundedNumberStr
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_C} from "../card/card_C.js";
import {getMapAttributes} from "../util/compute-pp.js";
import moment from "moment";
import {getRandomBannerPath} from "../util/mascotBanner.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_F(data);
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
        const svg = await panel_F(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_F(data = {
    // A2卡
    match: {
        background: "https://assets.ppy.sh/beatmaps/113458/covers/cover.jpg?1650639448", //给我他们最后一局的谱面背景即可
        match_title: 'MP5 S11: (肉蛋葱鸡) vs (超级聊天)', //match name
        match_round: 11,
        match_time: '20:25-22:03',//比赛开始到比赛结束。如果跨了一天，需要加24小时 match start_time
        match_time_start: 0, //本来要的是比赛开始的日期 match start_time '2020-03-21'
        match_time_end: 0,
        mpid: 59438351,
        wins_team_red: 5,
        wins_team_blue: 6,
        wins_team_none: 0,//如果不是team vs，总共的局数

        is_team_vs: true,// 比赛有哪怕一局不是team vs，都是false
    },

    // C卡 events
    scores: [
        {
            statistics: {
                // 谱面部分参数
                background: getExportFileV3Path('beatmap-DLfailBG.jpg'),
                title: 'Back to Marie',
                artist: 'Kumagai Eri(cv.Seto Asami)',
                mapper: 'Yunomi', //creator
                difficulty: 'Catharsis',
                status: 'ranked',
                bid: 1000684,
                delete: false,
                // 星级,四维在这里算(考虑到dt的影响

                is_team_vs: true, // TFF表示平局，当然，这个很少见
                is_team_red_win: false, //如果不是team vs，这个值默认false
                is_team_blue_win: true, //如果不是team vs，这个值默认false
                score_team_red: 1144770,
                score_team_blue: 1146381,
                score_total: 2291151,
                wins_team_red_before: 5, //这局之前红赢了几局？从0开始，不是 team vs 默认0
                wins_team_blue_before: 4,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0
            },
            red: [
                {
                    player_name: 'na-gi', //妈的 为什么get match不给用户名啊
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 464277,
                    player_mods: [],
                    player_rank: 1, //一局比赛里的分数排名，1v1或者team都一样
                }, {
                    player_name: '- Rainbow -',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 412096,
                    player_mods: [],
                    player_rank: 2
                }, {
                    player_name: 'Guozi on osu',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 268397,
                    player_mods: [],
                    player_rank: 6,
                }],
            blue: [
                {
                    player_name: 'Greystrip_VoV',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 403437,
                    player_mods: ['HD'],
                    player_rank: 3,
                }, {
                    player_name: 'Mars New',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 371937,
                    player_mods: [],
                    player_rank: 4,
                }, {
                    player_name: 'No Rank',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 371007,
                    player_mods: [],
                    player_rank: 5,
                }],
            none: [{

            }]
        },{
            statistics: {
                is_team_vs: true, // TFF表示平局，当然，这个很少见
                is_team_red_win: false, //如果不是team vs，这个值默认false
                is_team_blue_win: false, //如果不是team vs，这个值默认false
                score_team_red: 1144770,
                score_team_blue: 1146381,
                score_total: 2291151,
                wins_team_red_before: 5, //这局之前红赢了几局？从0开始，不是 team vs 默认0
                wins_team_blue_before: 5,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0
            },
            red: [{
                player_name: 'na-gi', //妈的 为什么get match不给用户名啊
                player_avatar: getExportFileV3Path('avatar-guest.png'),
                player_score: 464277,
                player_mods: [],
                player_rank: 1, //一局比赛里的分数排名，1v1或者team都一样
            }, {
                player_name: '- Rainbow -',
                player_avatar: getExportFileV3Path('avatar-guest.png'),
                player_score: 412096,
                player_mods: [],
                player_rank: 2
            }, {
                player_name: 'Guozi on osu',
                player_avatar: getExportFileV3Path('avatar-guest.png'),
                player_score: 268397,
                player_mods: [],
                player_rank: 6,
            }],
            blue: [
                {
                    player_name: 'Greystrip_VoV',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 403437,
                    player_mods: ['HD'],
                    player_rank: 3,
                }, {
                    player_name: 'Mars New',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 371937,
                    player_mods: [],
                    player_rank: 4,
                }, {
                    player_name: 'No Rank',
                    player_avatar: getExportFileV3Path('avatar-guest.png'),
                    player_score: 371007,
                    player_mods: [],
                    player_rank: 5,
                }],
            none: [{

            }]
        }],

}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_F.svg');

    // 路径定义
    let reg_height = '${height}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PF-1\);">)/;
    let reg_card_c = /(?<=<g id="CardC">)/;
    let reg_card_a2 = /(?<=<g id="CardA2">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Match Monitor Now (!ymmn)', 'Now', 'v0.3.0 EA');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);

    // 导入成绩卡（C卡

    let card_Cs = [];
    for (const i of data.scores) {
        card_Cs.push(await card_C(i, true));
    }

    for (const i in card_Cs) {
        svg = implantSvgBody(svg, 510, 330 + i * 250, card_Cs[i], reg_card_c)
    }

    // 测试用代码，毕竟本地跑没法 promise
    /*
    let beatmap_arr = [{
        // 谱面部分参数

        background: getExportFileV3Path('beatmap-DLfailBG.jpg'),
        title: 'Deleted Map',
        artist: '?',
        mapper: '?', //creator
        difficulty: '?',
        status: '',

        bid: 0,
        star_rating: 9.96,
        cs: 0,
        ar: 0,
        od: 0,
    },{
        background: getExportFileV3Path('beatmap-DLfailBG.jpg'),
        title: 'Deleted Map',
        artist: '?',
        mapper: '?', //creator
        difficulty: '?',
        status: '',

        bid: 0,
        star_rating: 9.96,
        cs: 0,
        ar: 0,
        od: 0,
    }];
     */

    let beatmap_arr = await Promise.all(data.scores.map(async (e) => {
        const d = e.statistics;

        let mods;
        if (data.match.is_team_vs) {
            mods = e.red[0].player_mods;
        } else {
            mods = e.none[0].player_mods || '';
        }
        let mod_int = 0;
        if (mods.indexOf("DT") !== -1) mod_int = 64;

        if (d.delete) {
            const bid = d.bid || 0;

            return {
                background: getExportFileV3Path('beatmap-DLfailBG.jpg'),
                title: 'Deleted Map',
                artist: '?',
                mapper: '?', //creator
                difficulty: '?',
                status: '',

                bid: bid,
                star_rating: 0,
                cs: 0,
                ar: 0,
                od: 0,
                mode: null,
            }
        }
        const attr = await getMapAttributes(d.bid, mod_int);
        const cs = getRoundedNumberStr(attr.cs, 2);
        const ar = getRoundedNumberStr(attr.ar, 2);
        const od = getRoundedNumberStr(attr.od, 2);
        const mode = d.mode ? d.mode.toLowerCase() : 'osu';

        return {
            background: d.background,
            title: d.title,
            artist: d.artist,
            mapper: d.mapper, //creator
            difficulty: d.difficulty,
            status: d.status,

            bid: d.bid,
            star_rating: attr.stars,
            cs: cs,
            ar: ar,
            od: od,
            mode: mode,
        }
    }));



    // 导入谱面卡(A2卡
    async function implantBeatMapCardA2(object, x, y) {

        const background = object.background || getExportFileV3Path('beatmap-DLfailBG.jpg');
        const title1 = object.title || 'Unknown Title';
        const title2 = object.artist || 'Unknown Artist';
        const title3 = object.mapper || 'God Made This';
        const left2 = object.difficulty || 'Tragic Love Extra';
        const left3 = 'b' + (object.bid || 0);

        const status = object.status;
        let right2;

        switch (getGameMode(object.mode, 1)) {
            case 'o': {
                right2 = 'CS' + (object.cs || 0) +
                    ' AR' + (object.ar || 0) +
                    ' OD' + (object.od || 0);
                break;
            }
            case 't': {
                right2 = 'OD' + (object.od || 0);
                break;
            }
            case 'c': {
                right2 = 'CS' + (object.cs || 0) +
                    ' AR' + (object.ar || 0);
                break;
            }
            case 'm': {
                right2 = (object.cs || 0) +
                    'Key OD' + (object.od || 0);
                break;
            }
            default: {
                right2 = '-';
            }
        }

        const right3b = getDecimals(object.star_rating,2);
        const right3m = getDecimals(object.star_rating,3) + '*';

        const card_A2_beatmap_impl =
            await card_A2({
                data,
                background: background,
                title1: title1,
                title2: title2,
                title3: title3,
                title_font: 'torus',
                left2: left2,
                left3: left3,
                map_status: status,
                right2: right2,
                right3b: right3b,
                right3m: right3m,
            }, true);

        svg = implantSvgBody(svg, x, y, card_A2_beatmap_impl, reg_card_a2);
    }

    //导入谱面卡的同时计算面板高度和背景高度
    let panel_height = 330;
    let background_height = 40;
    for (const index in beatmap_arr) {
        await implantBeatMapCardA2(beatmap_arr[index], 40, 330 + index * 250);
        panel_height += 250;
        background_height += 250;
    }
    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const background = await readNetImage(data.match.background, getExportFileV3Path('beatmap-DLfailBG.jpg')) ;
    const title = getMatchNameSplitted(data.match.match_title);
    const title1 = title[0];
    const title2 = (title[1] && title[2]) ? (title[1] + ' vs ' + title[2]) : '';
    const left1 = data.match.match_round + 'x Rounds';
    let left2 = moment(data.match.match_time, 'HH:mm[-]').add(8, 'hours').format('HH:mm') + '~';

    if (data.match.match_time.slice(-1) === '-') {
        left2 += 'Continuing';
    } else {
        left2 += moment(data.match.match_time, '[-]HH:mm').add(8, 'hours').format('HH:mm');
    }

    const left3 = moment(data.match.match_time_start, 'X').add(8, 'hours').format('YYYY-MM-DD');
    const avg_star = beatmap_arr
        .filter(b => b.star_rating > 0)
        .map(b => b.star_rating);
    const right1 = avg_star ? 'AVG.SR ' + (avg_star.reduce((pv, cv) => {return pv + cv}, 0) / avg_star.length).toFixed(2) : 0;
    const right2 = 'MP' + data.match.mpid;
    const wins_team_red = data.match.wins_team_red || 0;
    const wins_team_blue = data.match.wins_team_blue || 0;
    const right3b = data.match.is_team_vs ? (wins_team_red + ' : ' + wins_team_blue) : 'h2h';

    const card_A2_impl =
        await card_A2({
            data,
            background: background,
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
    svg = implantSvgBody(svg,40,40,card_A2_impl,reg_maincard);

    return svg.toString();
}