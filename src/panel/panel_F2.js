import {
    exportJPEG, getFormattedTime,
    getMapBG, getNowTimeStamp,
    getPanelNameSVG, implantImage,
    implantSvgBody, readTemplate,
    replaceText,
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {hasLeaderBoard} from "../util/star.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_F2(data);
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
        const svg = await panel_F2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 每轮的比赛对局面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_F2(data = {}) {
    // 导入模板
    let svg = readTemplate('template/Panel_F2.svg');

    // 路径定义
    const reg_height = '${height}'
    const reg_panelheight = '${panelheight}'
    const reg_maincard = /(?<=<g id="MainCard">)/;
    const reg_bodycard = /(?<=<g id="BodyCard">)/;
    const reg_index = /(?<=<g id="Index">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PF-2\);">)/;

    // 面板文字
    const request_time = 'match time: ' +
        getFormattedTime(data?.stat?.start_time, 'YYYY/MM/DD HH:mm') + ' - in progress'
        + ' // request time: ' + getNowTimeStamp();
    const panel_name = getPanelNameSVG('Match Rounds (!ymmr)', 'MR', 'v0.5.0 DX', request_time);

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入玩家卡（A1 的同时计算面板高度和背景高度
    let panel_height = 330;
    let background_height = 40;

    const round = data.round
    const scoreArr = round.scores || [];
    let redArr = [], blueArr = [], noneArr = [];

    scoreArr.forEach(
        (v) => {
            switch (v.match.team) {
                case 'red':
                    redArr.push(v);
                    break;
                case 'blue':
                    blueArr.push(v);
                    break;
                default :
                    noneArr.push(v);
                    break;
            }
        }
    )

    const isTeamVS = ((round?.team_type || round?.teamType) === "team-vs");
    const totalScore = round?.team_score?.total || round?.team_score?.total || 0;

    const player_count = scoreArr.length;

    if (isTeamVS) {
        let redA1 = [];
        let blueA1 = [];

        for (const v of redArr) {
            v.total_score = totalScore;
            v.total_player = player_count;
            const f = await card_A1(await PanelGenerate.matchScore2CardA1(v));
            redA1.push(f);
        }

        for (const v of blueArr) {
            v.total_score = totalScore;
            v.total_player = player_count;
            const f = await card_A1(await PanelGenerate.matchScore2CardA1(v));
            blueA1.push(f);
        }

        //计算高度
        const hr4 = Math.floor(redArr.length / 2);
        const hb4 = Math.floor(blueArr.length / 2);

        const rr = redA1.length - hr4 * 2;
        const rb = blueA1.length - hb4 * 2;

        const h = Math.max(Math.ceil(redArr.length / 2), Math.ceil(blueArr.length / 2));
        panel_height += h * 250;
        background_height += h * 250;

        const hasRemain = (rr > 0 || rb > 0);

        //天选之子 好像只有 0 1 两种可能
        if (rr === 1) {
            svg = implantCardA1(svg, redA1[0], reg_bodycard, 1, 1, 1, 'red');
        }

        //天选之子 好像只有 0 1 两种可能
        if (rb === 1) {
            svg = implantCardA1(svg, blueA1[0], reg_bodycard, 1, 1, 1, 'blue');
        }

        for (let i = 0; i < hr4; i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j + rr;
                svg = implantCardA1(svg, redA1[index], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 2, 'red');
            }
        }

        for (let i = 0; i < hb4; i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j + rb;
                svg = implantCardA1(svg, blueA1[index], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 2, 'blue');
            }
        }

    } else {
        let noneA1 = [];

        for (const v of noneArr) {
            v.total_score = totalScore;
            v.total_player = player_count;
            const f = await card_A1(await PanelGenerate.matchScore2CardA1(v));
            noneA1.push(f);
        }

        //计算高度
        const h4 = Math.floor(noneA1.length / 4);
        const r = noneA1.length - (h4 * 4);
        const hasRemain = (r > 0);

        panel_height += Math.ceil(noneA1.length / 4) * 250;
        background_height += Math.ceil(noneA1.length / 4) * 250;

        //天选之子 有 1,2,3
        if (r > 0) {
            for (let m = 0; m < r; m++) {
                svg = implantCardA1(svg, noneA1[m], reg_bodycard, 1, m + 1, r, 'none');
            }
        }

        for (let i = 0; i < h4; i++) {
            for (let j = 0; j < 4; j++) {
                const index = r + i * 4 + j;
                svg = implantCardA1(svg, noneA1[index], reg_bodycard, hasRemain ? (i + 2) : (i + 1), j + 1, 4, 'none');
            }
        }
    }

    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 这里是渲染真实的谱面
    const beatmap = round?.beatmap; 

    // 导入比赛简介卡（A2卡
    const f = await card_A2(await PanelGenerate.roundInfo2CardA2(data));
    svg = implantSvgBody(svg, 40, 40, f, reg_maincard);

    // 导入谱面（A2卡
    const b = await card_A2(await PanelGenerate.matchBeatMap2CardA2(beatmap));
    svg = implantSvgBody(svg, 1450, 40, b, reg_maincard);


    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, await getMapBG(beatmap.beatmapset_id, 'cover', hasLeaderBoard(beatmap.beatmapset.ranked)), reg_banner);

    return svg.toString();
}

//渲染单张卡片
function implantCardA1(svg, replace, reg, row = 1, column = 1, maxColumn = 1, team = 'red') {
    let startX = 40;

    switch (team) {
        case "red": {
            switch (maxColumn) {
                case 1:
                    startX = 275;
                    break;
                case 2:
                    startX = 40;
                    break;
            }
        }
            break;
        case "blue": {
            switch (maxColumn) {
                case 1:
                    startX = 1215;
                    break;
                case 2:
                    startX = 980;
                    break;
            }
        }
            break;
        case "none": {
            switch (maxColumn) {
                case 1:
                    startX = 745;
                    break;
                case 2:
                    startX = 510;
                    break;
                case 3:
                    startX = 275;
                    break;
                case 4:
                    startX = 40;
                    break;
            }
        }
            break;
    }

    const x = startX + 470 * (column - 1);
    const y = 330 + 250 * (row - 1);

    svg = implantSvgBody(svg, x, y, replace, reg);
    return svg;
}