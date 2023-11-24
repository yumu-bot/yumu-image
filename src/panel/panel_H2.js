import {
    exportJPEG, getMapBG, getPanelNameSVG,
    implantImage,
    implantSvgBody, isReload, readTemplate,
    replaceText
} from "../util/util.js";
import {card_D} from "../card/card_D.js";
import {getMapAttributes} from "../util/compute-pp.js";
import {card_A2} from "../card/card_A2.js";
import {getModInt} from "../util/mod.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_H(data);
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
        const svg = await panel_H(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_H (
    data = {
        "id" : 4,
        "info" : "info",
        "name" : "name",
        "banner" : null,
        "status" : "SHOW",
        "categoryList" : [{
            "name" : "NM",
            "info" : "这是NM",
            "color" : -3080247,
            "category" : [{
                "name" : "NM2",
                "bid" : 1219094,
                "creater" : 17064371
            }, {
                "name" : "NM1",
                "bid" : 2993974,
                "creater" : 17064371
            }]
        }, {
            "name" : "HD",
            "info" : "这是HD",
            "color" : -282,
            "category" : [{
                "name" : "HD1",
                "bid" : 1001682,
                "creater" : 17064371
            }]
        }],
        "mapinfo" : [{
            "id" : 1219094,
            "beatmapset_id" : 503213,
            "user_id" : 899031,
            "version" : "Promise",
            "ranked" : 1,
            "status" : "ranked",
            "difficulty_rating" : 6.28,
            "mode_int" : 0,
            "ar" : 9.5,
            "cs" : 4.0,
            "od" : 9.0,
            "hp" : 6.0,
            "hit_length" : 297,
            "total_length" : 297,
            "count_circles" : 928,
            "count_sliders" : 423,
            "count_spinners" : 1,
            "beatmapset" : {
                "id" : 503213,
                "user_id" : 899031,
                "creator" : "Lami",
                "artist" : "Inori Minase",
                "artist_unicode" : "水瀬いのり",
                "title" : "Yume no Tsubomi",
                "title_unicode" : "夢のつぼみ"
            },
            "mode" : "osu"
        }, {
            "id" : 2993974,
            "beatmapset_id" : 1456709,
            "user_id" : 12308923,
            "version" : "Starlight",
            "ranked" : 1,
            "status" : "ranked",
            "difficulty_rating" : 6.17,
            "mode_int" : 0,
            "ar" : 9.4,
            "cs" : 3.8,
            "od" : 9.0,
            "hp" : 5.0,
            "hit_length" : 331,
            "total_length" : 332,
            "count_circles" : 1155,
            "count_sliders" : 443,
            "count_spinners" : 2,
            "beatmapset" : {
                "id" : 1456709,
                "user_id" : 12308923,
                "creator" : "Vaporfly",
                "artist" : "Kano",
                "artist_unicode" : "鹿乃",
                "title" : "Stella-rium (Asterisk MAKINA Remix)",
                "title_unicode" : "Stella-rium (Asterisk MAKINA Remix)"
            },
            "mode" : "osu"
        }, {
            "id" : 1001682,
            "beatmapset_id" : 382400,
            "user_id" : 4610047,
            "version" : "Myth",
            "ranked" : 1,
            "status" : "ranked",
            "difficulty_rating" : 6.38,
            "mode_int" : 0,
            "ar" : 9.5,
            "cs" : 4.0,
            "od" : 9.0,
            "hp" : 6.2,
            "hit_length" : 398,
            "total_length" : 441,
            "count_circles" : 1534,
            "count_sliders" : 587,
            "count_spinners" : 5,
            "beatmapset" : {
                "id" : 382400,
                "user_id" : 4610047,
                "creator" : "Ponoyoshi",
                "artist" : "DragonForce",
                "artist_unicode" : "DragonForce",
                "title" : "Through the Fire and Flames",
                "title_unicode" : "Through the Fire and Flames"
            },
            "mode" : "osu"
        }]
    }
    , reuse = false) {
    // 导入模板
    let svg = readTemplate("template/Panel_H.svg");

    // 路径定义
    let reg_panelheight = '${panelheight}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PH-1\);">)/;
    let reg_bodycard = /(?<=<g id="BodyCard">)/;

    // 卡片定义
    const cardA2 = await card_A2(await pool2cardA2(data), true);

    // 面板文字
    const panel_name = getPanelNameSVG('Mappool (!ymmp)', 'Pool', 'v0.3.2 FT');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 插入主体卡片
    const maps = data.mapinfo || [];
    const lists = data.categoryList || [];

    //执行上面的代码
    svg = replaceText(svg, await BodyCard(maps, lists), reg_bodycard);

    //设置面板高度
    const rowTotal = getRowTotal(lists);
    const panelHeight = rowTotal ? 330 + 150 * rowTotal : 1080;

    svg = replaceText(svg, panelHeight, reg_panelheight);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, getRandomBannerPath(), reg_banner);
    svg = implantSvgBody(svg,40, 40, cardA2, reg_maincard);

    return svg.toString();
}

async function BodyCard(maps = [], lists = []) {
    let svg = '';
    let bids = [];
    let mods = [];

    for (const v of maps) {
        bids.push(v.id);
    }

    for (const v of lists) {
        mods.push(v.name)
    }

    let rowSum = 0; //总共的行数

    for (let i = 0; i < mods.length; i++) {
        const mod = mods[i]; //模组名称
        const category = lists[i].category || [];//一个模组池子
        const mapNum = category.length //一个模组池子里有多少图

        const rowNum = Math.floor(mapNum / 3) + 1 //一个模组池子需要多少行
        const remainder = mapNum - (rowNum - 1) * 3; // 余数
        let row3Num = 0;

        // 获取一个模组池子里有三列的行的数量
        if (remainder === 0) {
            row3Num = rowNum;
        } else {
            row3Num = rowNum - 1
        }

        //渲染
        for (let j = 0; j < row3Num; j++) {
            for (let k = 0; k < 3; k++) {
                const l = 3 * j + k //第二个下标 行数 * 3 + 列数
                const mapinfo = maps[bids.indexOf(category[l].bid)];
                svg += await implantCardD(mapinfo, mod.toUpperCase(), j + 1 + rowSum, k + 1, 3)
            }
        }

        for (let m = 0; m < remainder; m++) {
            const o = 3 * row3Num + m//第二个下标 行数 * 3 + 列数
            const mapinfo = maps[bids.indexOf(category[o].bid)];
            svg += await implantCardD(mapinfo, mod.toUpperCase(), rowNum + rowSum, m + 1, remainder)
        }
        rowSum += rowNum;
    }
    return svg;
}

//渲染单张卡片
async function implantCardD(data, mod = 'NM', row = 1, column = 1, maxColumn = 3) {
    let svg = '<g id="BodyCard"></g>'
    const reg = /(?<=<g id="BodyCard">)/;

    const x = ((3 - maxColumn) * 300 + 80) + 600 * (column - 1);
    const y = 330 + 150 * (row - 1);

    return implantSvgBody(svg, x, y, await card_D(await beatmap2CardD(data, mod), true), reg);
}

async function pool2cardA2(data) {
    const background = data.banner || getRandomBannerPath();

    const title1 = data.name || '';
    const title3 = data.categoryList ? data.categoryList[0].category ? 'creator: ' + data.categoryList[0].category[0].creater : 'creator?' : 'creator?';

    const left2 = data.info ? data.info.toString() : '';
    const left3 = data.status ? data.status.toString() : '';
    const right3b = data.id ? data.id.toString() : '0';

    return {
        background: background,
        map_status: null,

        title1: title1,
        title2: '',
        title3: title3,
        title_font: 'PuHuiTi',
        left1: '',
        left2: left2,
        left3: left3,
        right1: '',
        right2: 'Pool ID:',
        right3b: right3b,
        right3m: '',
    };
}

async function beatmap2CardD(data, mod) {
    let cs = data.cs, ar = data.ar, od = data.od, hp = data.hp;

    //修改四维
    if (mod === 'DT' || mod === 'NC') {
        ar = (ar > 5) ? ((1200 - 750 * (ar - 5) / 5) * 2 / 3 - 1200) / 750 * 5 + 5
            : - ((1200 - 600 * (5 - ar) / 5) * 2 / 3 - 1200) / 600 * 5 + 5 ;
        od = (data.mode_int === 1) ? ( - (50 - (3 * od)) * 2 / 3 + 50) / 3
            : (data.mode_int === 3) ? ( - (64 - (3 * od)) * 2 / 3 + 64) / 3
                : ( - (80 - (6 * od)) * 2 / 3 + 80) / 3;
        hp *= 3 / 4;
    } else if (mod === 'HT' || mod === 'DC') {
        ar = (ar > 5) ? ((1200 - 750 * (ar - 5) / 5) * 3 / 2 - 1200) / 750 * 5 + 5
            : - ((1200 - 600 * (5 - ar) / 5) * 3 / 2 - 1200) / 600 * 5 + 5 ;
        od = (data.mode_int === 1) ? ( - (50 - (3 * od)) * 3 / 2 + 50) / 2
            : (data.mode_int === 3) ? ( - (64 - (3 * od)) * 3 / 2 + 64) / 2
                : ( - (80 - (6 * od)) * 3 / 2 + 80) / 2;
        hp *= 3 / 2;
    } else if (mod === 'HR') {
        ar = Math.min(ar * 1.4, 10);
        cs = Math.min(cs * 1.3, 10);
        od = Math.min(od * 1.4, 10);
        hp = Math.min(hp * 1.4, 10);
    } else if (mod === 'EZ') {
        ar /= 2;
        cs /= 2;
        od /= 2;
        hp /= 2;
    }

    const star = await getStar(data.difficulty_rating, data.id, getModInt([mod]), data.mode_int);

    async function getStar(rawStar = 0, bid = 0, mods, modeInt = 0) {
        if (mod === 'DT' || mod === 'NC' || mod === 'HT' || mod === 'DC' || mod === 'HR' || mod === 'EZ' || mod === 'FL') {
            try {
                const attr = await getMapAttributes(bid, mods, modeInt)
                return attr.stars;
            } catch (e) {
                return rawStar;
            }
        } else {
            return rawStar;
        }
    }

    return {
        background: await getMapBG(data.beatmapset_id, 'cover@2x', isReload(data.ranked)),
        title: data.beatmapset.title || '',
        artist: data.beatmapset.artist || '',
        mapper: data.beatmapset.creator || '',
        difficulty: data.version || '',
        bid: data.id || 0,
        mod: mod,
        cs: cs,
        ar: ar,
        od: od,
        hp: hp,
        star_rating: star,
        game_mode: data.mode,
    }
}

function getRowTotal(lists = []) {
    let row = 0;

    for (const v of lists) {
        const c = lists.category ? lists.category.length : 0;
        const row3 = Math.ceil(c / 3); //一个模组池子需要多少行
        const rowr = c - (row3 - 1) * 3; // 余数

        if (rowr === 0) {
            row += row3;
        } else {
            row += row3 + 1;
        }
    }

    return row;
}