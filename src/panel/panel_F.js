import {
    exportJPEG,
    implantSvgBody,
    readTemplate,
    replaceText,
    getPanelNameSVG,
    getRoundedNumberStr,
    replaceBanner
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {card_C} from "../card/card_C.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getMapAttributes} from "../util/compute-pp.js";
import {getModInt} from "../util/mod.js";

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

/**
 * 对局面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_F(data = {}) {
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
    const panel_name = getPanelNameSVG('Match Now (!ymmn)', 'MN', 'v0.4.0 UU');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = replaceBanner(svg, reg_banner);

    // 导入成绩卡（C卡

    let card_Cs = [];
    let redWins = 0;
    let blueWins = 0;

    for (const v of data?.roundList) {
        if (v.winningTeam === 'red') {
            redWins ++;
        }

        if (v.winningTeam === 'blue') {
            blueWins ++;
        }

        card_Cs.push(await card_C(await round2CardC(v, redWins, blueWins)));
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
    const rounds = data?.roundList || [];

    const beatmap_arr = await Promise.all(rounds.map(async (e) => {
        const beatmap = e.beatmap;
        const mods = e.mods;

        if (beatmap == null) return {}

        const mod_int = getModInt(mods);

        const attr = await getMapAttributes(beatmap.id, mod_int);
        const cs = getRoundedNumberStr(attr.cs, 2);
        const ar = getRoundedNumberStr(attr.ar, 2);
        const od = getRoundedNumberStr(attr.od, 2);
        const mode = beatmap.mode ? beatmap.mode.toLowerCase() : 'osu';

        return {
            ...beatmap,

            difficulty_rating: attr?.stars || beatmap?.difficulty_rating,
            cs: cs,
            ar: ar,
            od: od,
            mode: mode,
        }
    }));

    //导入谱面卡(A2卡 的同时计算面板高度和背景高度
    let panel_height = 330;
    let background_height = 40;
    let avg_sr_arr = [];
    for (const i in beatmap_arr) {
        const b = await card_A2(await PanelGenerate.matchBeatmap2CardA2(beatmap_arr[i]));
        svg = implantSvgBody(svg, 40, 330 + i * 250, b, reg_card_a2);

        avg_sr_arr.push(beatmap_arr[i].difficulty_rating || 0);

        panel_height += 250;
        background_height += 250;
    }
    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    let averageStar = 0;
    let starSize = 0;

    avg_sr_arr.forEach(v => {
        if (v > 0) {
            averageStar += v;
            starSize++;
        }
    })

    if (starSize > 0) {
        averageStar /= starSize;
    } else {
        averageStar = 0;
    }

    // 导入比赛简介卡（A2卡
    const matchInfo = await card_A2(await PanelGenerate.matchData2CardA2(data, averageStar));
    svg = implantSvgBody(svg,40,40, matchInfo, reg_maincard);

    return svg.toString();
}

async function round2CardC(round = {}, red_before = 0, blue_before = 0) {

    const scoreArr = round?.scores || [];
    let redArr = [], blueArr = [], noneArr = [];

    for (const v of scoreArr) {
        const f = await score2LabelF2(v);
        switch (v?.match?.team) {
            case 'red': redArr.push(f); break;
            case 'blue': blueArr.push(f); break;
            default : noneArr.push(f); break;
        }
    }

    async function score2LabelF2(score = {}
    ) {
        return {
            player_name: score?.user_name, //妈的 为什么get match不给用户名啊
            player_avatar: score?.user?.avatar_url,
            player_score: score.score,
            player_mods: score.mods,
            player_rank: score.ranking, //一局比赛里的分数排名，1v1或者team都一样
        }
    }

    return {
        statistics: {
            is_team_vs: round.team_type === 'team-vs', // TFF表示平局，当然，这个很少见
            is_team_red_win: round.winningTeam === 'red', //如果不是team vs，这个值默认false
            is_team_blue_win: round.winningTeam === 'blue', //如果不是team vs，这个值默认false
            score_team_red: round.redTeamScore,
            score_team_blue: round.blueTeamScore,
            score_total: round.totalTeamScore,
            wins_team_red_before: red_before, //这局之前红赢了几局？从0开始，不是 team vs 默认0
            wins_team_blue_before: blue_before,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0
        },
        red: redArr,
        blue: blueArr,
        none: noneArr,
    }
}
