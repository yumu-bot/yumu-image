import {
    exportJPEG, getExportFileV3Path, getMapBG, getMatchNameSplitted,
    getPanelNameSVG,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    getRoundedNumberStr,
    implantImage,
    implantSvgBody, readNetImage,
    readTemplate,
    replaceText, transformSvgBody
} from "../util/util.js";
import {card_H} from "../card/card_H.js";
import {card_A2} from "../card/card_A2.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import moment from "moment";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_C(data);
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
        const svg = await panel_C(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_C(
    data =
        {
            matchStat: {
                id: 59438351,
                name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
                start_time: 1584793502,
                end_time: 1584799428
            },
            hasCurrentGame: false,
            playerDataList: [
                {
                    player: [Object],
                    team: 'blue',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 1,
                    win: 7,
                    lose: 5,
                    eraindex: 0.09090909090909091,
                    rwsindex: 0.09090909090909091,
                    draindex: 0.09090909090909091,
                    era: 2.18242204189389,
                    dra: 1.1648470050186592,
                    mra: 1.8771495308313209,
                    rwss: [Array],
                    rws: 0.7446077527288638,
                    rras: [Array],
                    amg: 1.4472341577504555,
                    tmg: 17.366809893005467,
                    mq: 1.6103210527296923,
                    tts: 8661974
                },
                {
                    player: [Object],
                    team: 'red',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 2,
                    win: 4,
                    lose: 8,
                    eraindex: 0.18181818181818182,
                    rwsindex: 0.45454545454545453,
                    draindex: 0.18181818181818182,
                    era: 1.6028313074664968,
                    dra: 0.9484438019153412,
                    mra: 1.40651505580115,
                    rwss: [Array],
                    rws: 0.30590008993423623,
                    rras: [Array],
                    amg: 1.178369572076636,
                    tmg: 14.140434864919632,
                    mq: 1.311158474009897,
                    tts: 5931781
                },
                {
                    player: [Object],
                    team: 'red',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 3,
                    win: 5,
                    lose: 6,
                    eraindex: 0.2727272727272727,
                    rwsindex: 0.18181818181818182,
                    draindex: 0.2727272727272727,
                    era: 1.433774576692575,
                    dra: 0.8115457889927602,
                    mra: 1.2471059403826303,
                    rwss: [Array],
                    rws: 0.5176202917582933,
                    rras: [Array],
                    amg: 1.0999463586348155,
                    tmg: 12.09940994498297,
                    mq: 1.2238978528092652,
                    tts: 6117850
                },
                {
                    player: [Object],
                    team: 'blue',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 4,
                    win: 5,
                    lose: 3,
                    eraindex: 0.36363636363636365,
                    rwsindex: 0.36363636363636365,
                    draindex: 0.5454545454545454,
                    era: 1.2134904285274848,
                    dra: 0.5353831002533243,
                    mra: 1.0100582300452365,
                    rwss: [Array],
                    rws: 0.4100026850941131,
                    rras: [Array],
                    amg: 0.9977594141084678,
                    tmg: 7.982075312867742,
                    mq: 1.1101955972318558,
                    tts: 3056718
                },
                {
                    player: [Object],
                    team: 'red',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 5,
                    win: 3,
                    lose: 8,
                    eraindex: 0.45454545454545453,
                    rwsindex: 0.6363636363636364,
                    draindex: 0.36363636363636365,
                    era: 1.0475938549218045,
                    dra: 0.6793723226939348,
                    mra: 0.9371273952534436,
                    rwss: [Array],
                    rws: 0.1803608938316818,
                    rras: [Array],
                    amg: 0.9208021563785563,
                    tmg: 10.12882372016412,
                    mq: 1.0245661283451841,
                    tts: 4213115
                },
                {
                    player: [Object],
                    team: 'blue',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 6,
                    win: 6,
                    lose: 4,
                    eraindex: 0.5454545454545454,
                    rwsindex: 0.2727272727272727,
                    draindex: 0.45454545454545453,
                    era: 0.8827840945691336,
                    dra: 0.5663316846725156,
                    mra: 0.7878483716001482,
                    rwss: [Array],
                    rws: 0.4277923980596815,
                    rras: [Array],
                    amg: 0.8443490571481143,
                    tmg: 8.443490571481142,
                    mq: 0.9394976309096492,
                    tts: 3607347
                },
                {
                    player: [Object],
                    team: 'blue',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 7,
                    win: 1,
                    lose: 2,
                    eraindex: 0.6363636363636364,
                    rwsindex: 1,
                    draindex: 0.7272727272727273,
                    era: 0.8653558260789321,
                    dra: 0.16827269664611166,
                    mra: 0.656230887249086,
                    rwss: [Array],
                    rws: 0.04871860969274499,
                    rras: [Array],
                    amg: 0.8362643106049186,
                    tmg: 2.5087929318147557,
                    mq: 0.9305018250168916,
                    tts: 1493278
                },
                {
                    player: [Object],
                    team: 'blue',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 8,
                    win: 2,
                    lose: 1,
                    eraindex: 0.7272727272727273,
                    rwsindex: 0.7272727272727273,
                    draindex: 0.9090909090909091,
                    era: 0.6325713596452965,
                    dra: 0.14654387095210542,
                    mra: 0.48676311303733916,
                    rwss: [Array],
                    rws: 0.1475355067675017,
                    rras: [Array],
                    amg: 0.728278631398342,
                    tmg: 2.184835894195026,
                    mq: 0.8103473830501833,
                    tts: 824972
                },
                {
                    player: [Object],
                    team: 'red',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 9,
                    win: 2,
                    lose: 1,
                    eraindex: 0.8181818181818182,
                    rwsindex: 0.8181818181818182,
                    draindex: 1,
                    era: 0.622945690387567,
                    dra: 0.1456453810627511,
                    mra: 0.4797555975901222,
                    rwss: [Array],
                    rws: 0.08660930495851112,
                    rras: [Array],
                    amg: 0.7238134089179146,
                    tmg: 2.171440226753744,
                    mq: 0.8053789805792722,
                    tts: 718575
                },
                {
                    player: [Object],
                    team: 'red',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 10,
                    win: 1,
                    lose: 3,
                    eraindex: 0.9090909090909091,
                    rwsindex: 0.9090909090909091,
                    draindex: 0.8181818181818182,
                    era: 0.2953528058013918,
                    dra: 0.153422457215848,
                    mra: 0.2527737012257286,
                    rwss: [Array],
                    rws: 0.06335557336343138,
                    rras: [Array],
                    amg: 0.571847340531797,
                    tmg: 2.287389362127188,
                    mq: 0.6362880577923868,
                    tts: 795730
                },
                {
                    player: [Object],
                    team: 'blue',
                    scores: [Array],
                    playerClass: [Object],
                    ranking: 11,
                    win: 5,
                    lose: 0,
                    eraindex: 1,
                    rwsindex: 0.5454545454545454,
                    draindex: 0.6363636363636364,
                    era: 0.22087801401543664,
                    dra: 0.18019189057664858,
                    mra: 0.2086721769838002,
                    rwss: [Array],
                    rws: 0.22134304765709478,
                    rras: [Array],
                    amg: 0.537299455537643,
                    tmg: 2.6864972776882152,
                    mq: 0.5978470175257273,
                    tts: 1113317
                }
            ],
            players: [
                {
                    id: 8692802,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/8692802?1699028089.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: true,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'Guozi on Osu',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 11355787,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/11355787?1590115432.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: true,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'na-gi',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 8742486,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/8742486?1698424380.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: false,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: '- Rainbow -',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 714369,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/714369?1656186410.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: true,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'GreySTrip_VoV',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 13960915,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/13960915?1632311898.gif',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: true,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'LittleStone',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 10436444,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/10436444?1675267430.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: true,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'No rank',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 9995042,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/9995042?1501344672.jpg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: false,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'MakuraPillow',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 8926316,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/8926316?1622459224.png',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: false,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'Mars New',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 6073139,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/6073139?1663173590.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: true,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'CamelliNya',
                    country_code: 'TW',
                    country: [Object]
                },
                {
                    id: 7879154,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/7879154?1696588290.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: false,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'RioTail',
                    country_code: 'CN',
                    country: [Object]
                },
                {
                    id: 1862358,
                    pmOnly: false,
                    avatar_url: 'https://a.ppy.sh/1862358?1591680736.jpeg',
                    default_group: 'default',
                    is_active: true,
                    is_bot: false,
                    is_deleted: false,
                    is_online: false,
                    is_supporter: false,
                    last_visit: [Array],
                    pm_friends_only: false,
                    username: 'Phirida',
                    country_code: 'CN',
                    country: [Object]
                }
            ],
            rounds: [
                {
                    id: 310430020,
                    mode: 'osu',
                    mods: [],
                    beatmap: [Object],
                    winningTeamScore: 407537,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 4,
                    beatmap_id: 2167576,
                    start_time: 1584794145,
                    end_time: 1584794439,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310431140,
                    mode: 'osu',
                    mods: [],
                    beatmap: [Object],
                    winningTeamScore: 563779,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 4,
                    beatmap_id: 1567613,
                    start_time: 1584794644,
                    end_time: 1584794783,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310431873,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 890732,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 907200,
                    start_time: 1584794973,
                    end_time: 1584795193,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310432805,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1379338,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1501761,
                    start_time: 1584795377,
                    end_time: 1584795619,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310433743,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1782250,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1649420,
                    start_time: 1584795772,
                    end_time: 1584795985,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310434904,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1086293,
                    winningTeam: 'red',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1557405,
                    start_time: 1584796255,
                    end_time: 1584796405,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310435821,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1511187,
                    winningTeam: 'red',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1058266,
                    start_time: 1584796652,
                    end_time: 1584796909,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310437250,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1483834,
                    winningTeam: 'red',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 2127734,
                    start_time: 1584797232,
                    end_time: 1584797394,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310438019,
                    mode: 'osu',
                    mods: [],
                    beatmap: [Object],
                    winningTeamScore: 1678926,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 169090,
                    start_time: 1584797543,
                    end_time: 1584797702,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310438890,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1683652,
                    winningTeam: 'red',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1624962,
                    start_time: 1584797898,
                    end_time: 1584798149,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310440193,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1651834,
                    winningTeam: 'red',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1714705,
                    start_time: 1584798418,
                    end_time: 1584798567,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310440938,
                    mode: 'osu',
                    mods: [Array],
                    beatmap: [Object],
                    winningTeamScore: 1753432,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1674896,
                    start_time: 1584798716,
                    end_time: 1584798848,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                },
                {
                    id: 310441611,
                    mode: 'osu',
                    mods: [],
                    beatmap: [Object],
                    winningTeamScore: 1144770,
                    winningTeam: 'blue',
                    winningTeamPlayerCount: 3,
                    beatmap_id: 1000684,
                    start_time: 1584798967,
                    end_time: 1584799293,
                    mod_int: null,
                    scoring_type: 'scorev2',
                    team_type: 'team-vs',
                    scores: [Array]
                }
            ],
            teamPoint: { red: 5, blue: 8 },
            averageStar: 5.099231,
            firstMapSID: 1087774,
            roundCount: 13,
            playerCount: 11,
            scoreCount: 164,
            teamVS: true,
            matchEnd: true
        }



) {
    // 导入模板
    let svg = readTemplate('template/Panel_C.svg');

    // 路径定义
    let reg_cardheight = '${cardheight}'
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PC-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Yumu Rating v3.5 (!ymra)', 'MRA', 'v0.3.2 FT');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A2卡
    const cardA2 = await card_A2(await matchData2CardA2(data), true);

    // 插入图片和部件（新方法
    svg = implantImage(svg, 1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_maincard);

    // 导入H卡
    let cardHs = [];
    const isTeamVS = data.teamVS;
    const playerDataList = data.playerDataList || [];

    let redArr = [];
    let blueArr = [];
    let noneArr = [];

    for (const v of playerDataList) {
        const team = v.team || "none";
        switch (team) {
            case "red": redArr.push(v); break;
            case "blue": blueArr.push(v); break;
            case "none": noneArr.push(v); break;
        }
    }

    const rowVS = Math.max(redArr.length, blueArr.length) || 0;
    if (isTeamVS) {
        //渲染红队
        for (let i = 0; i < redArr.length; i++) {
            cardHs.push(
                await drawCardH(await playerData2CardH(redArr[i]), i + 1 ,1, 2));
        }
        //渲染蓝队
        for (let i = 0; i < blueArr.length; i++) {
            cardHs.push(
                await drawCardH(await playerData2CardH(blueArr[i]), i + 1 ,2, 2));
        }
    } else {
        //渲染不在队伍（无队伍）
        const rowFull = Math.floor(noneArr.length / 2) + 1;
        const luckyDog = (noneArr.length % 2 === 1) ? noneArr.pop() : null;

        for (let i = 0; i < noneArr.length; i += 2) {
            for (let j = 0; j < 2; j++) {
                cardHs.push(
                    await drawCardH(await playerData2CardH(noneArr[i + j]), rowVS + i / 2 + 1, j + 1, 2));
            }
        }

        if (luckyDog != null) {
            cardHs.push(
                await drawCardH(await playerData2CardH(luckyDog), rowVS + rowFull, 1, 1));
        }
    }

    svg = replaceText(svg, cardHs, reg_maincard);

    const rowTotal = rowVS + Math.floor(noneArr.length / 2);

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

    return svg.toString();
}

async function playerData2CardH(p = {
    player: {
        id: 11355787,
        pmOnly: false,
        avatar_url: 'https://a.ppy.sh/11355787?1590115432.jpeg',
        default_group: 'default',
        is_active: true,
        is_bot: false,
        is_deleted: false,
        is_online: false,
        is_supporter: true,
        last_visit: [ 2023, 11, 16, 10, 35, 14 ],
        pm_friends_only: false,
        username: 'na-gi',
        country_code: 'CN',
        country: { countryCode: 'CN', countryName: 'China' }
    }
                                    ,
    team: 'red',
    scores: [Array],
    playerClass: { name: 'Strongest Marshal', nameCN: '最强元帅', color: -3840 }
                                    ,
    ranking: 2,
    win: 4,
    lose: 8,
    rws: 0.30590008993423623,
    mra: 1.40651505580115,
    tts: 5931781,
    dra: 0.9484438019153412,
    rras: [Array],
    era: 1.6028313074664968,
    rwss: [Array],
    mq: 1.311158474009897,
    tmg: 14.140434864919632,
    amg: 1.178369572076636,
    draindex: 0.18181818181818182,
    rwsindex: 0.45454545454545453,
    eraindex: 0.18181818181818182
}
) {

    let team_color;
    let player_background;
    let isTeamVS;

    switch (p.team) {
        case 'red':
            team_color = '#D32F2F';
            player_background = getExportFileV3Path('card-red.png');
            isTeamVS = true;
            break;
        case 'blue':
            team_color = '#00A0E9';
            player_background = getExportFileV3Path('card-blue.png');
            isTeamVS = true;
            break;
        default:
            team_color = '#aaa';
            player_background = getExportFileV3Path('card-gray.png');
            isTeamVS = false;
            break;
    }

    const rws = Math.round(p.rws * 10000) / 100;

    let left1;
    if (isTeamVS) {
        left1 = getRoundedNumberStr(p.tts, 3) +
            ' // ' + p.win + 'W-' + p.lose + 'L (' +
            Math.round((p.win / (p.win + p.lose)) * 100) + '%)';
    } else {
        left1 = getRoundedNumberStr(p.tts, 3) +
            ' // ' +
            p.win +
            'x Round(s)';
    }

    const left2 = '#' + (p.ranking || 0) + ' (' + rws + ')';

    const pClass = p.playerClass;
    const color_index = (pClass.name === "Strongest Marshal" || pClass.name === "Competent Marshal" || pClass.name === "Indomitable Marshal") ? "#2A2226" : "#FFF";

    return {
        background: player_background,
        cover: await readNetImage(p.player.avatar_url, true),
        title: p.player.username || 'UID:' + p.player.id,
        title2: p.player.country.countryCode || '',
        left1: left1,
        left2: left2,
        index_b: getRoundedNumberLargerStr(p.mra, 3),
        index_m: getRoundedNumberSmallerStr(p.mra, 3),
        index_b_size: 48,
        index_m_size: 36,
        label1: '',
        label2: '',
        label3: pClass.name,
        label4: pClass.nameCN,
        mods_arr: [],

        color_title2: '#aaa',
        color_right: '#' + ((pClass.color << 8) >>> 8).toString(16).padStart(6, "0"),
        color_left: team_color,
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

async function matchData2CardA2(data){
    const redWins = data.teamPoint.red || 0;
    const blueWins = data.teamPoint.blue || 0;

    const isTeamVS = data.teamVS;
    const star = getRoundedNumberStr(data.averageStar || 0, 3);

    const background = await getMapBG(data.firstMapSID, 'list@2x', false);

    const isContainVS = data.matchStat.name.toLowerCase().match('vs');
    let title, title1, title2;
    if (isContainVS) {
        title = getMatchNameSplitted(data.matchStat.name);
        title1 = title[0];
        title2 = title[1] + ' vs ' + title[2];
    } else {
        title1 = data.matchStat.name;
        title2 = '';
    }

    //这里的时间戳不需要 .add(8, 'hours')
    const left1 = 'R' + data.roundCount + ' P' + data.playerCount + ' S' + data.scoreCount;
    let left2;

    if (data.matchEnd) {
        left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-' + moment(data.matchStat.end_time, 'X').format('HH:mm');
    } else if (data.hasCurrentGame) {
        left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-playing';
    } else {
        left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-continuing';
    }

    const left3 = moment(data.matchStat.start_time, 'X').format('YYYY/MM/DD');

    const right1 = 'SR ' + star + '*';
    const right2 = 'mp' + data.matchStat.id || 0;
    const right3b = isTeamVS ? (redWins + ' : ' + blueWins) : data.roundCount + 'x';

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
        isTeamVS: isTeamVS,
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

    const body = await card_H(data, true);

    return transformSvgBody(x, y, body);
}

