import {implantSvgBody, readTemplate, replaceText, torus, torusRegular} from "../util.js";
import {label_F1, label_F2, label_F3} from "../component/label.js";

export async function card_C (data = {
    statistics: {
        is_team_vs: true, // TFF表示平局，当然，这个很少见
        is_team_red_win: true, //如果不是team vs，这个值默认false
        is_team_blue_win: true, //如果不是team vs，这个值默认false
        score_team_red: 1144770,
        score_team_blue: 1146381,
        score_total: 2567413,
        wins_team_red_before: 5, //这局之前红赢了几局？从0开始，不是 team vs 默认0
        wins_team_blue_before: 5,//这局之前蓝赢了几局？从0开始，不是 team vs 默认0
    },
    red: [{
        player_name: 'na-gi', //妈的 为什么get match不给用户名啊
        player_avatar: 'PanelObject/F_LabelF1_Avatar.png',
        player_score: 464277,
        player_mods: [],
        player_rank: 1, //一局比赛里的分数排名，1v1或者team都一样
    }, {
        player_name: '- Rainbow -',
        player_avatar: 'PanelObject/F_LabelF1_Avatar.png',
        player_score: 412096,
        player_mods: [],
        player_rank: 2
    }, {
        player_name: 'Guozi on osu',
        player_avatar: 'PanelObject/F_LabelF1_Avatar.png',
        player_score: 268397,
        player_mods: [],
        player_rank: 6,
    }],
    blue: [{
        player_name: 'Greystrip_VoV',
        player_avatar: 'PanelObject/F_LabelF1_Avatar.png',
        player_score: 403437,
        player_mods: ['HD'],
        player_rank: 3,
    }, {
        player_name: 'Mars New',
        player_avatar: 'PanelObject/F_LabelF1_Avatar.png',
        player_score: 371937,
        player_mods: [],
        player_rank: 4,
    }, {
        player_name: 'No Rank',
        player_avatar: 'PanelObject/F_LabelF1_Avatar.png',
        player_score: 371007,
        player_mods: [],
        player_rank: 5,
    }],
    none: [{

    }]
}, reuse = false) {
    //读取面板
    let svg = readTemplate("template/Card_C.svg");

    // 路径定义
    let reg_text = /(?<=<g id="Text">)/;
    let reg_bodycard = /(?<=<g id="BodyCard">)/;
    let reg_redpoint = /(?<=<g id="RedPoint">)/;
    let reg_bluepoint = /(?<=<g id="BluePoint">)/;
    let reg_scorebar = /(?<=<g id="ScoreBar">)/;
    let reg_backcolor = '${backcolor}';

    // 色板定义
    const red_color_list = ['#C32C4A','#851932','#630922','#64003C']
    const blue_color_list = ['#008FE3','#00669F','#004C77','#002D5C']
    const none_color_list = ['#D7D7D7','#C3C3C3','#ADADAD','#7F7F7F'
        ,'#666666','#4B4B4B','#2D2D2D','#000000']

    // 渲染文字和底板
    //组队赛时
    if (data.statistics.is_team_vs) {
        let red_score = data.statistics.score_team_red || 0;
        let blue_score = data.statistics.score_team_blue || 0;
        let total_score = data.statistics.score_total;

        //上左右得点

        let red_point = '<rect width="12" height="24" rx="6" ry="6" style="fill: #C32C4A;"/>';
        let blue_point = '<rect width="12" height="24" rx="6" ry="6" style="fill: #008FE3;"/>';
        let red_point_plus = '<rect width="12" height="24" rx="6" ry="6" style="fill: #DC9997;"/>';
        let blue_point_plus = '<rect width="12" height="24" rx="6" ry="6" style="fill: #91C4F1;"/>';

        for (let i = 0; i < data.statistics.wins_team_red_before; i++) {
            svg = implantSvgBody(svg, 30 + 16 * i,176, red_point, reg_redpoint);
        }

        for (let i = 0; i < data.statistics.wins_team_blue_before; i++) {
            svg = implantSvgBody(svg, 1338 - 16 * i,176, blue_point, reg_bluepoint);
        }

        // 上左右分数
        let mid_x = Math.min(Math.max((red_score / total_score * 1330), 400), 930) + 20 + 5;
        let delta_score = Math.abs(red_score - blue_score) || 0;
        let red_font;
        let blue_font;

        //上底色、左右分数和最亮的那个得点
        if (data.statistics.is_team_red_win) {
            svg = replaceText(svg, red_color_list[0], reg_backcolor);
            red_font = torus;
            blue_font = torusRegular;
            svg = implantSvgBody(svg, 30 + 16 * Math.max(data.statistics.wins_team_red_before - 1, 0),176, red_point_plus, reg_redpoint);

        } else if (data.statistics.is_team_blue_win) {
            svg = replaceText(svg, blue_color_list[0], reg_backcolor);
            red_font = torusRegular;
            blue_font = torus;
            svg = implantSvgBody(svg, 1338 - 16 * Math.max(data.statistics.wins_team_blue_before - 1, 0),176, blue_point_plus, reg_bluepoint);

        } else {
            red_font = torusRegular;
            blue_font = torusRegular;
            svg = replaceText(svg, '', reg_backcolor);
        }

        let red_text = (red_score !== 0) ? red_font.getTextPath(red_score.toString(), mid_x - 5, 196.836, 24, 'right baseline', '#fff') : '';
        let blue_text = (blue_score !== 0) ? blue_font.getTextPath(blue_score.toString(), mid_x + 5, 196.836, 24, 'left baseline', '#fff') : '';
        let delta_text = (delta_score !== 0) ? torus.getTextPath(delta_score.toString(), mid_x, 132.877, 18, 'center baseline', '#fff') : '';

        svg = replaceText(svg, red_text, reg_text);
        svg = replaceText(svg, blue_text, reg_text);
        svg = replaceText(svg, delta_text, reg_text);


    } else { //个人赛时
        //上底色
        svg = replaceText(svg, '', reg_backcolor);
    }

    // 导入成绩
    let red_score_arr = [];
    let blue_score_arr = [];
    let none_score_arr = [];

    if (data.red)
        for (let i = 0; i < data.red.length; i++) {
            red_score_arr.push(data.red[i].player_score);
        }
    if (data.blue)
        for (let i = 0; i < data.blue.length; i++) {
            blue_score_arr.push(data.blue[i].player_score);
        }
    if (data.none)
        for (let i = 0; i < data.none.length; i++) {
            none_score_arr.push(data.none[i].player_score);
        }

    // 计算长度
    let red_width_arr;
    let blue_width_arr;
    let none_width_arr;

    //主分支
    if (data.statistics) { //data.red.length + data.blue.length <= 8 || data.none.length <= 8
        if (data.statistics.is_team_vs) {
            red_width_arr = getTeamVsWidthArrayNormal(data, 'red');
            blue_width_arr = getTeamVsWidthArrayNormal(data, 'blue');
            if (red_width_arr !== []) {
                await implantMainNormal(data, 'red', red_score_arr, red_width_arr);
            }
            if (blue_width_arr !== []) {
                await implantMainNormal(data, 'blue', blue_score_arr, blue_width_arr);
            }
        } else {
            none_width_arr = getTeamVsWidthArrayNormal(data, 'none');
            if (none_width_arr !== []) {
                await implantMainNormal(data, 'none', none_score_arr, none_width_arr);
            }
        }
    } else {
        //比较麻烦，还需要针对超短的数据
        red_width_arr = getTeamVsWidthArrayNormal(data, 'red');
        blue_width_arr = getTeamVsWidthArrayNormal(data, 'blue');
        none_width_arr = getTeamVsWidthArrayNormal(data, 'none');
    }
    
    // 常规方法赋值
    async function implantMainNormal(data, team = 'none', teamScoreArr = [0], teamWidthArr = [0]) {

        let startX;
        let startY = 140; //分数条上沿
        let startAssign; //赋值起始位置
        let direction; //正数表示从左往右渲染
        let push; //正数表示从大到小取值
        let isReverse; //下面的分数矩形是否该反向渲染，只有蓝色矩形是右对齐
        let colorList;

        //获取赋值方向和初始坐标
        switch (team.toLowerCase()) {
            case 'blue':
                direction = -1;
                push = -1;
                isReverse = true;
                startAssign = teamScoreArr.length - 1;
                startX = 1360; //teamWidthArr ? 1360 - teamWidthArr.reduce(function (sum, value) { return sum + value; }) : 1360;
                colorList = blue_color_list;
                break;
            case 'red':
                direction = 1;
                push = -1;
                isReverse = false;
                startAssign = teamScoreArr.length - 1;
                startX = 20;
                colorList = red_color_list;
                break;
            default:
                direction = 1;
                push = 1;
                isReverse = false;
                startAssign = 0;
                startX = 20;
                colorList = none_color_list;
                break;
        }

        //主调用
        let calculateX = startX;
        let rectSum = 0;
        let rectColor = '';

        for (let i = 0; i < teamWidthArr.length; i++) {
            let j = startAssign + push * i;
            let width = teamWidthArr[j];

            // 画F标签
            if (data[`${team}`]) {
                await implantRoundLabelF1(
                    data[`${team}`][j],
                    calculateX + (width * direction / 2 - 50),
                    startY - 130);
            }

            //画矩形
            rectSum += width;
            rectColor = colorList[j];
            if (data[`${team}`]) {
                await implantScoreBar(rectColor,
                    (!isReverse ? startX : (calculateX - width)), //反转的使用位置
                    startY,
                    rectSum,
                    30);
            }

            //结算
            calculateX += width * direction; //red 往右，是加起来， none，blue 往左
        }
    }

    //当队伍人数小于等于4时，计算每个值的长度（正常
    function getTeamVsWidthArrayNormal (data, team = 'none'){
        if (!data[team]) return [];

        let team_width_arr = [];
        let total_score;
        let team_score = data.statistics[`score_team_${team}`] || 0;

        //获取分数，从大到小排列
        let team_score_arr = [];
        for (const i of data[team]) {
            team_score_arr.push(i.player_score);
        }

        total_score = data.statistics.score_total || 0;

        //获取每个人需要的宽度、用于计算的值
        let team_width_calc = Math.min(Math.max(team_score / total_score * 1330, 400), 930);
        let team_score_calc = team_score;

        for (const i of team_score_arr) {
            if ((i / total_score * 1330) < 100) {
                team_width_arr.push(100);
                team_width_calc -= 100;
                team_score_calc -= i;
            } else {
                let i2 = team_width_calc * i / team_score_calc;
                team_width_arr.push(i2);
            }
        }

        return team_width_arr;
    }


    // 插入F1 - F3标签的功能函数

    async function implantRoundLabelF1 (object, x, y) {
        let label_F1_impl =
            await label_F1({
                avatar: object.player_avatar || '',
                name: object.player_name || '',
                mods_arr: object.player_mods || '',
                score: object.player_score || '',
                rank: object.player_rank || '',
                maxWidth: 100,
            })
        svg = implantSvgBody(svg, x, y, label_F1_impl, reg_bodycard);
    }

    async function implantRoundLabelF2(object, x, y) {
        let label_F2_impl =
            await label_F2({
                avatar: object.player_avatar,
                name: object.player_name,
            })
        svg = implantSvgBody(svg, x, y, label_F2_impl, reg_bodycard);
    }


    async function implantRoundLabelF3(object, x, y) {
        let label_F3_impl =
            await label_F3({
                avatar: object.player_avatar,
            })
        svg = implantSvgBody(svg, x, y, label_F3_impl, reg_bodycard);
    }

    function implantScoreBar(color = '#D7D7D7', x, y, w, h) {
        let RRect = `<rect width="${w}" height="${h}" rx="15" ry="15" style="fill: ${color};"/>`
        svg = implantSvgBody(svg, x, y, RRect, reg_scorebar)
    }

    return svg.toString();
}