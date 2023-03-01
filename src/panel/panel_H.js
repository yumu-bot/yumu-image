import {
    getNowTimeStamp,
    getRandomBannerPath,
    implantImage,
    implantSvgBody,
    InsertSvgBuilder,
    readTemplate,
    replaceText,
    torus
} from "../util.js";
import {card_A1} from "../card/cardA1.js";
import {card_D} from "../card/cardD.js";

export async function panel_H (data = {
    // A1卡 应该是A2，但是管他呢
    card_A1: {
        background: 'PanelObject/A_CardA1_BG.png',
        avatar: 'PanelObject/A_CardA1_Avatar.png',
        country_flag: 'PanelObject/A_CardA1_CountryFlag.png',
        sub_icon1: 'PanelObject/A_CardA1_SubIcon1.png',
        sub_icon2: 'PanelObject/A_CardA1_SubIcon2.png',
        name: 'Muziyami',
        rank_global: 28075,
        rank_country: 577,
        country: 'CN',
        acc: 95.27,
        level: 100,
        progress: 32,
        pp: 4396,
    },

    //D卡
    map_pool: {
        NM: [{
            background: 'PanelObject/H_CardD_BG.png',
            title: 'Xin Mei Sang Zui Jiu? Cheater',
            artist: 'Fushimi Rio',
            mapper: 'Fia',
            difficulty: 'OWC HD2',
            bid: '1146381',
            mod: 'NM',
            cs: 7,
            ar: 10.3,
            od: 11,
            hp: 5,
            star_rating: 1.19,
            game_mode: 'osu',
        }, {
            background: 'PanelObject/H_CardD_BG2.png',
            title: 'Blessing',
            artist: 'Nico Nico Chorus',
            mapper: 'Ujimatsu Chiya',
            difficulty: 'Laurier\'s Extra',
            bid: '614239',
            mod: 'NM',
            cs: 4,
            ar: 9,
            od: 8,
            hp: 7,
            star_rating: 1.2,
            game_mode: 'osu',
        }, {
            background: 'PanelObject/H_CardD_BG2.png',
            title: 'Blessing',
            artist: 'Nico Nico Chorus',
            mapper: 'Ujimatsu Chiya',
            difficulty: 'Laurier\'s Extra',
            bid: '614239',
            mod: 'FL',
            cs: 4,
            ar: 9,
            od: 8,
            hp: 7,
            star_rating: 1.3,
            game_mode: 'osu',
        }, {
            background: 'PanelObject/H_CardD_BG2.png',
            title: 'Blessing',
            artist: 'Nico Nico Chorus',
            mapper: 'Ujimatsu Chiya',
            difficulty: 'Laurier\'s Extra',
            bid: '614239',
            mod: 'NM',
            cs: 4,
            ar: 9,
            od: 8,
            hp: 7,
            star_rating: 1.4,
            game_mode: 'osu',
        }, {
            background: 'PanelObject/H_CardD_BG2.png',
            title: 'Blessing',
            artist: 'Nico Nico Chorus',
            mapper: 'Ujimatsu Chiya',
            difficulty: 'Laurier\'s Extra',
            bid: '614239',
            mod: 'NM',
            cs: 4,
            ar: 9,
            od: 8,
            hp: 7,
            star_rating: 1.5,
            game_mode: 'osu',
        }],
        HR: [{
            background: '',
            title: 'Xin Mei Sang Zui Jiu',
            artist: 'Fushimi Rio',
            mapper: 'Fia',
            difficulty: 'Hello',
            bid: '1146381',
            mod: 'HR',
            cs: 7,
            ar: 10.3,
            od: 11,
            hp: 5,
            star_rating: 2.1,
            game_mode: 'osu',
        },{
            background: '',
            title: 'Xin Mei Sang Zui Jiu',
            artist: 'Fushimi Rio',
            mapper: 'Fia',
            difficulty: 'Hello',
            bid: '1146381',
            mod: 'HR',
            cs: 7,
            ar: 10.3,
            od: 11,
            hp: 5,
            star_rating: 2.2,
            game_mode: 'osu',
        }],
        DT: [{
            background: '',
            title: 'Xin Mei Sang Zui Jiu',
            artist: 'Fushimi Rio',
            mapper: 'Fia',
            difficulty: 'Hello',
            bid: '1146381',
            mod: 'DT',
            cs: 7,
            ar: 10.3,
            od: 11,
            hp: 5,
            star_rating: 3.1,
            game_mode: 'osu',
        }],
    },


    // 面板文字
    index_powered: 'powered by Yumubot v0.3.0 EA // Mappool (!ymmp)',
    index_request_time: 'request time: ' + getNowTimeStamp(),
    index_panel_name: 'MP v3.6',

}, reuse = false) {
    // 导入模板
    let svg = readTemplate("template/Panel_H.svg");

    // 路径定义
    let reg_height = '${height}'
    let reg_maincard = /(?<=<g id="MainCard">)/;
    let reg_index = /(?<=<g id="Index">)/;
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-PH-1\);">)/;
    let reg_bodycard = /(?<=<g id="BodyCard">)/;

    // 卡片定义
    let card_A1_impl = await card_A1(data.card_A1, true);


    // 文字定义
    let index_powered = torus.getTextPath(data.index_powered,
        10, 26.84, 24, "left baseline", "#fff");
    let index_request_time = torus.getTextPath(data.index_request_time,
        1910, 26.84, 24, "right baseline", "#fff");
    let index_panel_name = torus.getTextPath(data.index_panel_name,
        607.5, 83.67, 48, "center baseline", "#fff");

    // 插入主体卡片

    /*
    let card_D_NM1_impl =
        await card_D(data.map_pool['NM'][0], true);
    svg = implantSvgBody(svg,80,330,card_D_NM1_impl, reg_card_d);

    let card_D_NM2_impl =
        await card_D(data.map_pool['NM'][1], true);
    svg = implantSvgBody(svg,680,330,card_D_NM2_impl, reg_card_d);

     */

    let rowTotal;

    async function BodyCard(data) {
        let arr2 = data.map_pool;
        let nameSpace = Object.keys(arr2)
        let rowSum = 0; //总共的行数

        for (let i = 0; i < nameSpace.length; i++) {
            let mod = nameSpace[i]; //模组名称
            let mapNum = arr2[mod].length //一个模组池子里有多少图
            let rowNum = Math.floor(mapNum / 3) + 1 //一个模组池子需要多少行
            let remainder = mapNum - (rowNum - 1) * 3; // 余数
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
                    let l = 3 * j + k //第二个下标 行数 * 3 + 列数
                    await implantCardD(arr2[mod][l], j + 1 + rowSum, k + 1, 3)
                }
            }
            for (let m = 0; m < remainder; m++) {
                let o = 3 * row3Num + m//第二个下标 行数 * 3 + 列数
                await implantCardD(arr2[mod][o], rowNum + rowSum, m + 1, remainder)
            }
            rowSum += rowNum
        }
        rowTotal = rowSum;
    }

    //渲染单张卡片
    async function implantCardD(object, row = 1, column = 1, maxColumn = 3) {
        let x;
        let y;
        let x_base;

        switch (maxColumn) {
            case 3:
                x_base = 80;
                break;
            case 2:
                x_base = 380;
                break;
            case 1:
                x_base = 680;
                break;
        }

        x = x_base + 600 * (column - 1);
        y = 330 + 150 * (row - 1);

        let card_D_impl =
            await card_D(object, true);

        svg = implantSvgBody(svg, x, y, card_D_impl, reg_bodycard);
    }

    //执行上面的代码，顺便设置面板高度
    await BodyCard(data);

    let panelHeight;
    if (rowTotal) {
        panelHeight = 330 + 150 * rowTotal
    } else {
        panelHeight = 1080;
    }

    svg = replaceText(svg, panelHeight, reg_height);

    // 插入文字
    svg = replaceText(svg, index_powered, reg_index);
    svg = replaceText(svg, index_request_time, reg_index);
    svg = replaceText(svg, index_panel_name, reg_index);

    // 插入图片和部件（新方法
    svg = implantImage(svg,1920,320,0,0,0.8,getRandomBannerPath(),reg_banner);
    svg = implantSvgBody(svg,40,40,card_A1_impl,reg_maincard);

    let out_svg = new InsertSvgBuilder(svg)

    return out_svg.export(reuse);
}