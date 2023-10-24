import {
    exportJPEG,
    getExportFileV3Path,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText, getPanelNameSVG, getRoundedNumberStr
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_C} from "../card/card_C.js";
import {getMapAttributes} from "../util/compute-pp.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelGenerate} from "../util/panelGenerate.js";

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
            blue: [{
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
    
    //导入谱面卡(A2卡 的同时计算面板高度和背景高度
    let panel_height = 330;
    let background_height = 40;
    for (const index in beatmap_arr) {
        const b = await PanelGenerate.matchBeatmap2CardA2(beatmap_arr[index]);
        svg = implantSvgBody(svg, 40, 330 + index * 250, b, reg_card_a2);
        
        panel_height += 250;
        background_height += 250;
    }
    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡

    const m = await PanelGenerate.match2CardA2(data.match, beatmap_arr);
    const card_A2_impl = await card_A2(m, true);
    svg = implantSvgBody(svg,40,40, card_A2_impl, reg_maincard);

    return svg.toString();
}