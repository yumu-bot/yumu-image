import {
    exportJPEG,
    getExportFileV3Path,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText, getPanelNameSVG,
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A1} from "../card/card_A1";

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

export async function panel_F2(data = {
    // A2卡
    match: {
        noneUsers: [],
        matchInfo: {
            id: 59438351,
            name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
            start_time: 1584793502,
            end_time: 1584799428
        },
        averageStar: 0,
        rounds: 1,
        redUsers: [{
            name: 'na-gi', //妈的 为什么get match不给用户名啊
            country: 'CN',
            avatar: getExportFileV3Path('avatar-guest.png'),
            cover: getExportFileV3Path('Banner/b3.png'),
            score: 464277,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 0.9641876243,
            mods: [],
            grade: 'A',
            rank: 1, //一局比赛里的分数排名，1v1或者team都一样
        }, {
            name: '- Rainbow -',
            country: 'CN',
            avatar: getExportFileV3Path('avatar-guest.png'),
            cover: getExportFileV3Path('Banner/b3.png'),
            score: 412096,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 0.9641876243,
            mods: [],
            grade: 'A',
            rank: 2
        }, {
            name: 'Guozi on osu',
            country: 'CN',
            avatar: getExportFileV3Path('avatar-guest.png'),
            cover: getExportFileV3Path('Banner/b3.png'),
            score: 268397,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 0.9641876243,
            mods: [],
            grade: 'A',
            rank: 6,
        }],
        isTeamVs: true,
        sid: 1001507,
        blueWins: 5,
        redWins: 6,
        blueUsers: [{
            name: 'Greystrip_VoV',
            country: 'CN',
            avatar: getExportFileV3Path('avatar-guest.png'),
            cover: getExportFileV3Path('Banner/b3.png'),
            score: 403437,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 1.0245644,
            mods: ['HD'],
            grade: 'B',
            rank: 3,
        }, {
            name: 'Mars New',
            country: 'CN',
            avatar: getExportFileV3Path('avatar-guest.png'),
            cover: getExportFileV3Path('Banner/b3.png'),
            score: 371937,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 0.9641876243,
            mods: [],
            grade: 'A',
            rank: 4,
        }, {
            name: 'No Rank',
            country: 'CN',
            avatar: getExportFileV3Path('avatar-guest.png'),
            cover: getExportFileV3Path('Banner/b3.png'),
            score: 371007,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 0.9641876243,
            mods: [],
            grade: 'A',
            rank: 5,
        }],
    },
}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_F2.svg');

    // 路径定义
    let reg_height = '${height}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PF-2\);">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Match Rounds (!ymmr)', 'MR', 'v0.3.2 FT');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);

    // 导入玩家卡（A1 的同时计算面板高度和背景高度
    let panel_height = 330;
    let background_height = 40;

    const isTeamVS = data.match.isTeamVs;
    const isRedWin = data.match.redWins;
    const isBlueWin = data.match.blueWins;

    const redData = data.match.redUsers || [];
    const blueData = data.match.blueUsers || [];
    const noneData = data.match.noneUsers || [];

    if (isTeamVS) {
        let redArr = [];
        let blueArr = [];

        for (const v of redData) {
            const f = await card_A1(await PanelGenerate.matchUser2CardA1(v), true);
            redArr.push(f);
        }

        for (const v of blueData) {
            const f = await card_A1(await PanelGenerate.matchUser2CardA1(v), true);
            blueArr.push(f);
        }
        
        //计算高度
        const hr = Math.ceil(redData.length / 2);
        const hb = Math.ceil(blueData.length / 2);
        const h = Math.max(hr, hb);
        panel_height += h * 250;
        background_height += h * 250;

        const rr = h * 2 - redArr.length;
        const rb = h * 2 - blueArr.length;

        for (let i = 0; i < hr - 1; i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j;
                implantCardA1(svg, redArr[index], reg_card_a1, i + 1, j + 1, 2, 'red');
            }
        }

        for (let i = 0; i < hb - 1; i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j;
                implantCardA1(svg, blueArr[index], reg_card_a1, i + 1,j + 1, 2, 'blue');
            }
        }

        //天选之子 好像只有 0 1 两种可能
        if (rr === 1) {
            implantCardA1(svg, redArr[redArr.length - 1], reg_card_a1, h, hr, 1, 'red');
        }

        //天选之子 好像只有 0 1 两种可能
        if (rb === 1) {
            implantCardA1(svg, blueArr[blueArr.length - 1], reg_card_a1, h, hb, 1, 'blue');
        }

    } else {
        let noneArr = [];

        for (const v of noneData) {
            const f = await card_A1(await PanelGenerate.matchUser2CardA1(v), true);
            noneArr.push(f);
        }
        
        //计算高度
        const h = Math.ceil(noneArr.length / 4);
        const r = h * 4 - noneArr.length;

        panel_height += h * 250;
        background_height += h * 250;

        for (let i = 0; i < h - 1; i++) {
            for (let j = 0; j < 4; j++) {
                const index = i * 4 + j;
                implantCardA1(svg, noneArr[index], reg_card_a1, i + 1, j + 1, 4, 'none');
            }
        }

        //天选之子 有 1,2,3
        if (r > 0) {
            for (let m = 0; m < r; m++) {
                const index = (h - 1) * 4 + m;
                implantCardA1(svg, noneArr[index], reg_card_a1, h,m + 1,  r, 'none');
            }
        }
    }

    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const f = await card_A2(await PanelGenerate.matchInfo2CardA2(data.match), true);
    svg = implantSvgBody(svg, 40, 40, f, reg_maincard);

    return svg.toString();
}

//渲染单张卡片
function implantCardA1(svg, replace, reg, row = 1, column = 1, maxColumn = 1, team = 'red') {
    let startX = 40;

    switch (team) {
        case "red": {
            switch (maxColumn) {
                case 1: startX = 275; break;
                case 2: startX = 40; break;
            }
        } break;
        case "blue": {
            switch (maxColumn) {
                case 1: startX = 1215; break;
                case 2: startX = 980; break;
            }
        } break;
        case "none": {
            switch (maxColumn) {
                case 1: startX = 715; break;
                case 2: startX = 510; break;
                case 3: startX = 275; break;
                case 4: startX = 40; break;
            }
        } break;
    }

    const x = startX + 470 * (column - 1);
    const y = 330 + 150 * (row - 1);

    return implantSvgBody(svg, x, y, replace, reg);
}