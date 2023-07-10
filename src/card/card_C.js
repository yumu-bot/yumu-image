import {
    getExportFileV3Path,
    implantImage,
    implantSvgBody,
    readNetImage,
    readTemplate,
    replaceText,
    torus,
    torusRegular
} from "../util.js";
import {label_F1, label_F2, label_F3} from "../component/label.js";

export async function card_C(data = {
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
        player_name: 'No Rank',
        player_avatar: getExportFileV3Path('avatar-guest.png'),
        player_score: 371007,
        player_mods: [],
        player_rank: 1,
    }]
}, reuse = false) {
    //读取面板
    let svg = readTemplate("template/Card_C.svg");

    // 路径定义
    let reg_text = /(?<=<g id="Text">)/;
    let reg_bodycard = /(?<=<g id="BodyCard">)/;
    let reg_redpoint = /(?<=<g id="RedPoint">)/;
    let reg_bluepoint = /(?<=<g id="BluePoint">)/;
    let reg_pluspoint = /(?<=<g id="PlusPoint">)/;
    let reg_scorebar = /(?<=<g id="ScoreBar">)/;
    let reg_backcolor = '${backcolor}';
    let reg_h2hfirstavatar = /(?<=<g style="clip-path: url\(#clippath-CC-1\);">)/;

    // 色板定义
    const red_color_list = ['#D56E74', '#CB3554', '#801D34', '#601025',
        '#61003F', '#811554', '#CA2C82', '#D46DA1',
        '#925C9F', '#792984', '#4F1056', '#3B0041',
        '#110043', '#1D105A', '#302787', '#59509E']
    const blue_color_list = ['#55B1EF', '#009DEA', '#006899', '#004E74',
        '#002D59', '#0D3F75', '#1B62B2', '#587EC2',
        '#5867AF', '#28479B', '#182B66', '#0B1C4D',
        '#110043', '#1D105A', '#302787', '#59509E']
    const none_color_list = ['#fff', '#aaa', '#ccc', '#888',
        '#eee', '#999', '#bbb', '#777',
        '#fff', '#aaa', '#ccc', '#888',
        '#eee', '#999', '#bbb', '#777']

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
            svg = implantSvgBody(svg, 30 + 16 * i, 176, red_point, reg_redpoint);
        }

        for (let i = 0; i < data.statistics.wins_team_blue_before; i++) {
            svg = implantSvgBody(svg, 1338 - 16 * i, 176, blue_point, reg_bluepoint);
        }

        // 上左右分数
        let isTeamVs = data.statistics.is_team_vs; //none特供
        let mid_x = isTeamVs ? Math.min(Math.max((red_score / total_score * 1330), 400), 930) + 20 + 5 : 0;
        let delta_score = isTeamVs ? Math.abs(red_score - blue_score) : 0;
        let red_font;
        let blue_font;

        //上底色、左右分数和最亮的那个得点
        if (data.statistics.is_team_red_win) {
            svg = replaceText(svg, red_color_list[1], reg_backcolor); //其实 1 才是最正的那个颜色
            red_font = torus;
            blue_font = torusRegular;
            svg = implantSvgBody(svg, 30 + 16 * Math.max((data.statistics.wins_team_red_before - 1), 0), 176, red_point_plus, reg_pluspoint);

        } else if (data.statistics.is_team_blue_win) {
            svg = replaceText(svg, blue_color_list[1], reg_backcolor);
            red_font = torusRegular;
            blue_font = torus;
            svg = implantSvgBody(svg, 1338 - 16 * Math.max((data.statistics.wins_team_blue_before - 1), 0), 176, blue_point_plus, reg_pluspoint);

        } else {
            red_font = torusRegular;
            blue_font = torusRegular;
            svg = replaceText(svg, '#382e32', reg_backcolor);
        }

        let red_text = (red_score !== 0) ? red_font.getTextPath(red_score.toString(), mid_x - 5, 196.836, 24, 'right baseline', '#fff') : '';
        let blue_text = (blue_score !== 0) ? blue_font.getTextPath(blue_score.toString(), mid_x + 5, 196.836, 24, 'left baseline', '#fff') : '';
        let delta_text = (delta_score !== 0) ? torus.getTextPath(delta_score.toString(), mid_x, 132.877, 18, 'center baseline', '#fff') : '';

        svg = replaceText(svg, red_text, reg_text);
        svg = replaceText(svg, blue_text, reg_text);
        svg = replaceText(svg, delta_text, reg_text);

    } else {
        //个人赛时

        //个人赛取最大值，因为此时第一号并不一定是第一名
        let first_index = 0;
        let first_score = 0;
        let none_arr = data.none || [{player_score: 0}];

        none_arr.forEach((v, i) => {
            if (v.player_score >= first_score) {
                first_score = v.player_score ;
                first_index = i;
            }
        })

        //个人赛主计算
        let total_score = data.statistics.score_total;
        let none_text = (total_score !== 0) ? torus.getTextPath(total_score.toString(), 670, 196.836, 24, 'center baseline', '#fff') : '';

        svg = replaceText(svg, '#382e32', reg_backcolor);
        svg = replaceText(svg, none_text, reg_text);
        svg = implantImage(svg, 1380, 210, 0, 0, 0.3, await readNetImage(data.none[first_index].player_avatar, getExportFileV3Path('avatar-guest.png')), reg_h2hfirstavatar);
    }

    // 导入成绩
    let red_score_arr = [];
    let blue_score_arr = [];
    let none_score_arr = [];

    if (data.red) {
        for (let i = 0; i < data.red.length; i++) {
            red_score_arr.push(data.red[i].player_score);
        }
    }
    if (data.blue) {
        for (let i = 0; i < data.blue.length; i++) {
            blue_score_arr.push(data.blue[i].player_score);
        }
    }
    if (data.none) {
        for (let i = 0; i < data.none.length; i++) {
            none_score_arr.push(data.none[i].player_score);
        }
    }


    // 计算长度
    let red_width_arr;
    let blue_width_arr;
    let none_width_arr;

    //主分支
    const red_length = data.red ? data.red.length : 0;
    const blue_length = data.blue ? data.blue.length : 0;
    const none_length = data.none ? data.none.length : 0;
    const is_team_vs = data.statistics.is_team_vs;

    if ((is_team_vs && (red_length + blue_length) <= 8) || (!is_team_vs && none_length <= 8)) { //data.statistics
        if (is_team_vs) {
            red_width_arr = getTeamVsWidthArray(data, 'red', true);
            blue_width_arr = getTeamVsWidthArray(data, 'blue', true);
            if (red_width_arr !== []) {
                await implantCardC(data, 'red', red_score_arr, red_width_arr, true);
            }
            if (blue_width_arr !== []) {
                await implantCardC(data, 'blue', blue_score_arr, blue_width_arr, true);
            }
        } else {
            none_width_arr = getTeamVsWidthArray(data, 'none', true);
            if (none_width_arr !== []) {
                await implantCardC(data, 'none', none_score_arr, none_width_arr, true);
            }
        }
    } else {
        //特殊分支，比较麻烦，还需要针对超短的数据
        if (is_team_vs) {
            red_width_arr = getTeamVsWidthArray(data, 'red', false);
            blue_width_arr = getTeamVsWidthArray(data, 'blue', false);
            if (red_width_arr !== []) {
                await implantCardC(data, 'red', red_score_arr, red_width_arr, false);
            }
            if (blue_width_arr !== []) {
                await implantCardC(data, 'blue', blue_score_arr, blue_width_arr, false);
            }
        } else {
            none_width_arr = getTeamVsWidthArray(data, 'none', false);
            if (none_width_arr !== []) {
                await implantCardC(data, 'none', none_score_arr, none_width_arr, false);
            }
        }
    }

    // 导入卡片的主函数
    async function implantCardC(data, team = 'none', teamScoreArr = [0], teamWidthArr = [0], isLess4 = true) {

        let startX;
        let startY = 140; //分数条上沿
        let direction; //正数表示从左往右渲染
        let isReverse; //下面的分数矩形是否该反向渲染，蓝队和1v1是右对齐
        let colorList; //颜色表
        let isWin; //是否获胜，1v1默认true
        let scoreTextColor; //分数的数字颜色，如果是 none，则使用1c色

        //获取赋值方向和初始坐标
        switch (team.toLowerCase()) {
            case 'blue':
                direction = -1;
                isReverse = true;
                startX = 1360;
                colorList = blue_color_list;
                isWin = data.statistics.is_team_blue_win;
                scoreTextColor = '#fff';
                break;
            case 'red':
                direction = 1;
                isReverse = false;
                startX = 20;
                colorList = red_color_list;
                isWin = data.statistics.is_team_red_win;
                scoreTextColor = '#fff';
                break;
            case 'none':
                direction = -1;
                isReverse = true;
                startX = 1360;
                colorList = none_color_list;
                isWin = true;
                scoreTextColor = '#1C1719';
                break;
        }

        let less = countLessMinWidth(teamWidthArr, 100);

        if (isLess4) {
            //主调用
            await implantMain ();

        } else if (less === 0) {
            await implantMain ();

        } else if (less <= 12) {
            //特殊调用：需要使用 label F2 / F3
            await implantSpecial (less);
        } else {
            return '';
        }

        //特殊调用
        async function implantSpecial (less = 0) {

            let calculateX = startX;
            let rectSum = 0;
            let rectColor = '';

            //画分数低于最低值的选手
            /*
            if (less <= 4) {
                //比较小的F2
                for (let i = teamWidthArr.length - less; i < teamWidthArr.length; i++) {
                    let j = teamScoreArr.length - 1 - i; //取反，实际上是从小到大用
                    let k = i - (teamWidthArr.length - less) + 1;//从 1 开始

                    if (data[`${team}`]) {
                        await implantRoundLabelF2(
                            data[`${team}`][j],
                            isReverse ? startX - 100 : startX,
                            startY - 35 * k, //从 1 开始
                            isWin);
                    }
                }
            } else
                */
                if (less <= 12) {
                //最小的 F3
                for (let i = 0; i < less / 4; i++) {
                    // i 是横坐标，最大只能有 3 个 i
                    for (let j = 0; j <= 3; j++) {
                        // j 是纵坐标，0-3
                        let k = teamWidthArr.length - less + (i * 3 + j);
                        let width = teamWidthArr[k];

                        if (data[`${team}`][k]) {
                            await implantRoundLabelF3(
                                data[`${team}`][k],
                                !isReverse ? startX + 34 * i : startX - 30 - 34 * i,
                                startY - 35 - 34 * j, //从 1 开始
                                isWin);
                            //结算
                            calculateX += width * direction; //red 往右，是加起来， none，blue 往左
                        }
                    }
                }
            }

            //结算一次，把位置空出来
            //calculateX += 100 * direction; //red 往右，是加起来， none，blue 往左

            //画分数高于最低值的选手
            for (let i = 0; i < (teamWidthArr.length - less); i++) {
                let j = teamScoreArr.length - less - 1 - i; //取反，实际上是从小到大用
                let width = teamWidthArr[j];

                if (data[`${team}`]) {
                    await implantRoundLabelF1(
                        data[`${team}`][j],
                        calculateX + (width * direction / 2 - 50),
                        startY - 130,
                        isWin,
                        scoreTextColor);
                }

                //结算
                calculateX += width * direction; //red 往右，是加起来， none，blue 往左
            }

            calculateX = startX; //画矩形的calculateX归0

            //画矩形
            for (let i = 0; i < teamWidthArr.length; i++) {
                let j = teamScoreArr.length - 1 - i; //取反，实际上是从小到大用
                let width = teamWidthArr[j];

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

        //主调用，也是一般的调用方法
        async function implantMain () {

            let calculateX = startX;
            let rectSum = 0;
            let rectColor = '';

            for (let i = 0; i < teamWidthArr.length; i++) {
                let j = teamScoreArr.length - 1 - i; //以前叫startAssign + push * i
                let width = teamWidthArr[j];

                // 画F标签
                if (data[`${team}`]) {
                    await implantRoundLabelF1(
                        data[`${team}`][j],
                        calculateX + (width * direction / 2 - 50),
                        startY - 130,
                        isWin,
                        scoreTextColor);
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

        //计算小于额定宽度的选手的数量
        function countLessMinWidth(teamWidthArr = [0], minWidth = 0) {
            let count = 0;

            teamWidthArr.forEach((v,i) => {
                if (v < minWidth) {
                    count ++;
                }
            })

            return count;
        }
    }

    //计算每个队内选手应该获得的宽度
    function getTeamVsWidthArray(data, team = 'none', isLess4 = true) {
        let isTeamVs = data.statistics.is_team_vs;
        let teamMinWidth;
        let playerMinWidth;

        if (!data[team]) return [];

        let team_width_arr = [];
        let total_score = data.statistics.score_total;
        let team_score;
        if (isTeamVs) {
            if (isLess4) {
                team_score = data.statistics[`score_team_${team}`];
                teamMinWidth = 400;
                playerMinWidth = 100;
            } else {
                team_score = data.statistics[`score_team_${team}`];
                teamMinWidth = 20;
                playerMinWidth = 20;
            }
        } else {
            team_score = total_score;
            teamMinWidth = 0;
            playerMinWidth = 0;
        }

        //获取分数，从小到大排列
        let team_score_arr = [];
        for (const i of data[team]) {
            team_score_arr.unshift(i.player_score);
        }

        //获取每个人需要的宽度、用于计算的值
        let team_width_calc = Math.min(Math.max(team_score / total_score * 1330, teamMinWidth), 1330 - teamMinWidth);
        let team_score_calc = team_score;

        for (const i of team_score_arr) {
            let width = team_width_calc * i / team_score_calc
            //常规的限宽分支
            if (width < playerMinWidth) { //原来是100
                team_width_arr.unshift(playerMinWidth);
                team_width_calc -= playerMinWidth;
                team_score_calc -= i;
            } else {
                //特殊分支和常规的不限宽分支
                team_width_arr.unshift(width);
            }
        }
        return team_width_arr;
    }



    // 插入F1 - F3标签的功能函数

    async function implantRoundLabelF1(object, x, y, isWin, scoreTextColor) {
        let label_F1_impl =
            await label_F1({
                avatar: object.player_avatar || '',
                name: object.player_name || '',
                mods_arr: object.player_mods || '',
                score: object.player_score || '',
                rank: object.player_rank || '',
                maxWidth: 100,
                isWin: isWin,
                scoreTextColor: scoreTextColor,
            })
        svg = implantSvgBody(svg, x, y, label_F1_impl, reg_bodycard);
    }

    async function implantRoundLabelF2(object, x, y, isWin, scoreTextColor) {
        let label_F2_impl =
            await label_F2({
                avatar: object.player_avatar || '',
                name: object.player_name || '',
                rank: object.player_rank || '',
                isWin: isWin,
                scoreTextColor: scoreTextColor,
            })
        svg = implantSvgBody(svg, x, y, label_F2_impl, reg_bodycard);
    }


    async function implantRoundLabelF3(object, x, y, isWin) {
        let label_F3_impl =
            await label_F3({
                avatar: object.player_avatar || '',
                isWin: isWin,
            })
        svg = implantSvgBody(svg, x, y, label_F3_impl, reg_bodycard);
    }

    function implantScoreBar(color = '#D7D7D7', x, y, w, h) {
        let RRect = `<rect width="${w}" height="${h}" rx="15" ry="15" style="fill: ${color};"/>`
        svg = implantSvgBody(svg, x, y, RRect, reg_scorebar)
    }

    return svg.toString();
}