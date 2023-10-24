import {
    exportJPEG,
    getExportFileV3Path,
    implantImage,
    implantSvgBody,
    readTemplate,
    replaceText, getPanelNameSVG, getRoundedNumberStr,
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getMapAttributes} from "../util/compute-pp.js";

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
        matchInfo: {
            id: 59438351,
            name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
            start_time: 1584793502,
            end_time: 1584799428
        },
        averageStar: 0,
        rounds: 1,
        isTeamVs: true,
        sid: 1001507,
        blueWins: 5,
        redWins: 6,
        noneUsers: [],
        redUsers: [{
            name: 'na-gi', //妈的 为什么get match不给用户名啊
            country: 'CN',
            avatar: "https://a.ppy.sh/17064371?1675693670.jpeg",
            cover: "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
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
            avatar: "https://a.ppy.sh/17064371?1675693670.jpeg",
            cover: "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
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
            avatar: "https://a.ppy.sh/17064371?1675693670.jpeg",
            cover: "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
            score: 268397,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 0.9641876243,
            mods: [],
            grade: 'A',
            rank: 6,
        }],
        blueUsers: [{
            name: 'Greystrip_VoV',
            country: 'CN',
            avatar: "https://a.ppy.sh/17064371?1675693670.jpeg",
            cover: "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
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
            avatar: "https://a.ppy.sh/17064371?1675693670.jpeg",
            cover: "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
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
            avatar: "https://a.ppy.sh/17064371?1675693670.jpeg",
            cover: "https://assets.ppy.sh/user-profile-covers/17064371/4569c736003fcc6fbd0c75ac618784c60a8732f5fa2d704974600d440baee205.jpeg",
            score: 371007,
            accuracy: 0.965414652,
            combo: 1475,
            rating: 0.9641876243,
            mods: [],
            grade: 'A',
            rank: 5,
        }],
    },

    beatmap: {
        // 谱面部分参数
        background: 'https://assets.ppy.sh/beatmaps/1087774/covers/cover@2x.jpg',
        title: 'Back to Marie',
        artist: 'Kumagai Eri(cv.Seto Asami)',
        mapper: 'Yunomi', //creator
        difficulty: 'Catharsis',
        status: 'ranked',
        bid: 1000684,
        delete: false,
    },
}, reuse = false) {
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
            v.team = 'red';
            const f = await card_A1(await PanelGenerate.matchUser2CardA1(v), true);
            redArr.push(f);
        }

        for (const v of blueData) {
            v.team = 'blue';
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
                svg = implantCardA1(svg, redArr[index], reg_bodycard, i + 1, j + 1, 2, 'red');
            }
        }

        for (let i = 0; i < hb - 1; i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j;
                svg = implantCardA1(svg, blueArr[index], reg_bodycard, i + 1, j + 1, 2, 'blue');
            }
        }

        //天选之子 好像只有 0 1 两种可能
        if (rr === 1) {
            svg = implantCardA1(svg, redArr[redArr.length - 1], reg_bodycard, hr, 1, 1, 'red');
        }

        //天选之子 好像只有 0 1 两种可能
        if (rb === 1) {
            svg = implantCardA1(svg, blueArr[blueArr.length - 1], reg_bodycard, hb, 1, 1, 'blue');
        }

    } else {
        let noneArr = [];

        for (const v of noneData) {
            v.team = 'none';
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
                svg = implantCardA1(svg, noneArr[index], reg_bodycard, i + 1, j + 1, 4, 'none');
            }
        }

        //天选之子 有 1,2,3
        if (r > 0) {
            for (let m = 0; m < r; m++) {
                const index = (h - 1) * 4 + m;
                svg = implantCardA1(svg, noneArr[index], reg_bodycard, h,m + 1,  r, 'none');
            }
        }
    }

    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const f = await card_A2(await PanelGenerate.matchInfo2CardA2(data.match), true);
    svg = implantSvgBody(svg, 40, 40, f, reg_maincard);

    // 导入谱面（A2卡

    const b = await card_A2(await PanelGenerate.matchBeatmap2CardA2(
        await getBeatmapAttr(data.beatmap, isTeamVS ?
            (isRedWin ? data.match.redUsers[0].mods :
                (isBlueWin ? data.match.blueUsers[0].mods : [])) : data.match.noneUsers[0].mods)
        /*
        {
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
        }

         */
    ), true);
    svg = implantSvgBody(svg, 1450, 40, b, reg_maincard);

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
    const y = 330 + 250 * (row - 1);

    svg = implantSvgBody(svg, x, y, replace, reg);
    return svg;
}

async function getBeatmapAttr (stat = {
    // 谱面部分参数
    background: getExportFileV3Path('beatmap-DLfailBG.jpg'),
    title: 'Back to Marie',
    artist: 'Kumagai Eri(cv.Seto Asami)',
    mapper: 'Yunomi', //creator
    difficulty: 'Catharsis',
    status: 'ranked',
    bid: 1000684,
    delete: false,
}, mods = []) {

    let mod_int = 0;
    if (mods.indexOf("DT") !== -1) mod_int = 64;

    if (stat.delete) {
        const bid = stat.bid || 0;

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

    const attr = await getMapAttributes(stat.bid, mod_int);

    const cs = getRoundedNumberStr(attr.cs, 2);
    const ar = getRoundedNumberStr(attr.ar, 2);
    const od = getRoundedNumberStr(attr.od, 2);
    const mode = stat.mode ? stat.mode.toLowerCase() : 'osu';

    return {
        background: stat.background,
        title: stat.title,
        artist: stat.artist,
        mapper: stat.mapper, //creator
        difficulty: stat.difficulty,
        status: stat.status,

        bid: stat.bid,
        star_rating: attr.stars,
        cs: cs,
        ar: ar,
        od: od,
        mode: mode,
    }
}