import {
    exportJPEG,
    getExportFileV3Path,
    getMapBG,
    getPanelNameSVG,
    getRoundedNumberStr,
    implantImage,
    implantSvgBody, readTemplate,
    replaceText,
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getMapAttributes} from "../util/compute-pp.js";
import {getModInt} from "../util/mod.js";

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
    matchInfo: {
        id: 59438351,
        name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
        start_time: 1584793502,
        end_time: 1584799428
    },
    averageStar: 0,
    rounds: 1,
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

    beatmap: {
        mode: 'osu',
        status: 'ranked',
        version: "Ayyri's Hard",
        id: 2127734,
        beatmapset_id: 1006608,
        difficulty_rating: 3.8,
        total_length: 214,
        user_id: 3388410,
        beatmapset: {
            video: false,
            fromDatabases: false,
            sid: 1006608,
            mapperName: 'Mordred',
            mapperUID: 7265097,
            ranked: true,
            rating: 0,
            id: 1006608,
            user_id: 7265097,
            artist: 'Iguchi Yuka',
            artist_unicode: '井口裕香',
            title: 'HELLO to DREAM',
            title_unicode: 'HELLO to DREAM',
            creator: 'Mordred',
            favourite_count: 154,
            nsfw: false,
            play_count: 235125,
            preview_url: '//b.ppy.sh/preview/1006608.mp3',
            source: 'ダンジョンに出会いを求めるのは間違っているだろうかⅡ',
            status: 'ranked',
            covers: [Object],
            spotlight: false
        },
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

    const redData = data.redUsers || [];
    const blueData = data.blueUsers || [];
    const noneData = data.noneUsers || [];

    const isTeamVS = (data.noneUsers.length === 0);
    const redTeamScore = isTeamVS ? getTotalScore(redData) : 0;
    const blueTeamScore = isTeamVS ? getTotalScore(blueData) : 0;
    const totalScore = isTeamVS ? redTeamScore + blueTeamScore : getTotalScore(noneData);
    const totalPlayer = isTeamVS ? redData.length + blueData.length : noneData.length;

    const isRedWin = (redTeamScore > blueTeamScore);
    const isBlueWin = (redTeamScore < blueTeamScore);

    if (isTeamVS) {
        let redArr = [];
        let blueArr = [];

        for (const v of redData) {
            v.team = 'red';
            v.total_score = totalScore;
            v.total_player = totalPlayer;
            const f = await card_A1(await PanelGenerate.matchUser2CardA1(v), true);
            redArr.push(f);
        }

        for (const v of blueData) {
            v.team = 'blue';
            v.total_score = totalScore;
            v.total_player = totalPlayer;
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

        const hasRemain = (rr > 0 || rb > 0);

        //天选之子 好像只有 0 1 两种可能
        if (rr === 1) {
            svg = implantCardA1(svg, redArr[0], reg_bodycard, 1, 1, 1, 'red');
        }

        //天选之子 好像只有 0 1 两种可能
        if (rb === 1) {
            svg = implantCardA1(svg, blueArr[0], reg_bodycard, 1, 1, 1, 'blue');
        }

        for (let i = 0; i < (rr > 0 ? (hr - 1) : hr); i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j + rr;
                svg = implantCardA1(svg, redArr[index], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 2, 'red');
            }
        }

        for (let i = 0; i < (rb > 0 ? (hb - 1) : hb); i++) {
            for (let j = 0; j < 2; j++) {
                const index = i * 2 + j + rb;
                svg = implantCardA1(svg, blueArr[index], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 2, 'blue');
            }
        }

    } else {
        let noneArr = [];

        for (const v of noneData) {
            v.team = 'none';
            v.total_score = totalScore;
            v.total_player = totalPlayer;
            const f = await card_A1(await PanelGenerate.matchUser2CardA1(v), true);
            noneArr.push(f);
        }
        
        //计算高度
        const h = Math.ceil(noneArr.length / 4);
        const r = h * 4 - noneArr.length;
        const hasRemain = (r > 0);

        panel_height += h * 250;
        background_height += h * 250;

        //天选之子 有 1,2,3
        if (r > 0) {
            for (let m = 0; m < r; m++) {
                svg = implantCardA1(svg, noneArr[m], reg_bodycard, 1, m + 1,  r, 'none');
            }
        }

        for (let i = 0; i < (hasRemain ? (h - 1) : h); i++) {
            for (let j = 0; j < 4; j++) {
                const index = i * 4 + j;
                svg = implantCardA1(svg, noneArr[index + r], reg_bodycard, hasRemain ? i + 2 : i + 1, j + 1, 4, 'none');
            }
        }
    }

    svg = replaceText(svg, panel_height, reg_panelheight);
    svg = replaceText(svg, background_height, reg_height);

    // 导入比赛简介卡（A2卡
    const f = await card_A2(await PanelGenerate.matchInfo2CardA2({
        ...data,
        background: await getMapBG(data.beatmap.beatmapset_id, 'cover@2x', !data.beatmap.beatmapset.ranked),
        isTeamVs: isTeamVS,
        blueWins: (isBlueWin ? 1 : 0),
        redWins: (isRedWin ? 1 : 0),
    }), true);
    svg = implantSvgBody(svg, 40, 40, f, reg_maincard);

    // 导入谱面（A2卡
    const b = await card_A2(await PanelGenerate.matchBeatmap2CardA2(
        await getBeatmapAttr(data.beatmap,
            isTeamVS ?
                (isRedWin ? (data.redUsers[0].mods || []) :
                (isBlueWin ? (data.blueUsers[0].mods || []) : []))
            : (data.noneUsers[0].mods || [])),
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

async function getBeatmapAttr(beatmapLite = {
    // 谱面部分参数
    mode: 'osu',
    status: 'ranked',
    version: "Ayyri's Hard",
    id: 2127734,
    beatmapset_id: 1006608,
    difficulty_rating: 3.8,
    total_length: 214,
    user_id: 3388410,
    beatmapset: {
        video: false,
        fromDatabases: false,
        sid: 1006608,
        mapperName: 'Mordred',
        mapperUID: 7265097,
        ranked: true,
        rating: 0,
        id: 1006608,
        user_id: 7265097,
        artist: 'Iguchi Yuka',
        artist_unicode: '井口裕香',
        title: 'HELLO to DREAM',
        title_unicode: 'HELLO to DREAM',
        creator: 'Mordred',
        favourite_count: 154,
        nsfw: false,
        play_count: 235125,
        preview_url: '//b.ppy.sh/preview/1006608.mp3',
        source: 'ダンジョンに出会いを求めるのは間違っているだろうかⅡ',
        status: 'ranked',
        covers: [Object],
        spotlight: false
    },
}, mods = []) {

    if (!beatmapLite) {
        return {
            background: getExportFileV3Path('beatmap-DLfailBG.jpg'),
            title: 'Deleted Map',
            artist: '?',
            mapper: '?', //creator
            difficulty: '?',
            status: '',

            bid: 0,
            star_rating: 0,
            cs: 0,
            ar: 0,
            od: 0,
            mode: null,
        }
    }

    const attr = await getMapAttributes(beatmapLite.id, getModInt(mods));

    const cs = getRoundedNumberStr(attr.cs, 2);
    const ar = getRoundedNumberStr(attr.ar, 2);
    const od = getRoundedNumberStr(attr.od, 2);
    const mode = beatmapLite.mode ? beatmapLite.mode.toLowerCase() : 'osu';

    return {
        background: await getMapBG(beatmapLite.beatmapset.sid, 'list@2x', !beatmapLite.beatmapset.ranked),
        title: beatmapLite.beatmapset.title,
        artist: beatmapLite.beatmapset.artist,
        mapper: beatmapLite.beatmapset.creator, //creator
        difficulty: beatmapLite.version,
        status: beatmapLite.status,

        bid: beatmapLite.id,
        star_rating: attr.stars,
        cs: cs,
        ar: ar,
        od: od,
        mode: mode,
    }
}

function getTotalScore(arr = []) {
    let r = 0;
    for (const v of arr) {
        r += (v?.score || 0);
    }
    return r;
}