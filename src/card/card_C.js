import {implantSvgBody, readTemplate, replaceText} from "../util.js";
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
    let reg_text = /(?<=<g id="Text">)/
    let reg_bodycard = /(?<=<g id="BodyCard">)/
    let reg_background = /(?<=<g style="clip-path: url\(#clippath-CD-1\);">)/
    let reg_mod_color = '${mod_color}';

    // 导入F系列标签

    // 计算长度
    let red_width_arr = [];
    let blue_width_arr = [];
    let none_width_arr = [];

    if (data.red.length + data.blue.length <= 8 || data.none.length <= 8) {
        red_width_arr = getTeamVsWidthArrayNormal(data, 'red');
        blue_width_arr = getTeamVsWidthArrayNormal(data, 'blue');
        none_width_arr = getTeamVsWidthArrayNormal(data, 'none');
    }

    //当队伍人数小于等于4时，计算每个值的长度（正常
    function getTeamVsWidthArrayNormal (data, team = 'none'){
        if (!data[team]) return [];

        let team_width_arr = [];
        let total_score;
        let team_score = data.statistics[`score_team_${team}`] | 0;

        //获取分数，从小到大排列
        let team_score_arr = [];
        for (const i of data[team]) {
            team_score_arr.unshift(i.player_score);
        }

        team_score_arr.forEach((item) => {
            team_score += item;
        })

        total_score = data.statistics.score_total | 0;

        //获取每个人需要的宽度、用于计算的值
        let team_width_calc = Math.min(Math.max(team_score / total_score * 1330, 400), 1030);
        let team_score_calc = team_score;

        for (let i of team_score_arr) {
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
                avatar: object.player_avatar,
                name: object.player_name,
                mods_arr: object.player_mods,
                score: object.player_score,
                rank: object.player_rank,
                maxWidth: 100,
                label_color: getUserRankColor(object.player_rank),
            })
        svg = implantSvgBody(svg, x, y, label_F1_impl, reg_bodycard);
    }

    async function implantRoundLabelF2(object, x, y) {
        let label_F2_impl =
            await label_F2({
                avatar: object.player_avatar,
                name: object.player_name,
                label_color: getUserRankColor(object.player_rank),
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

    //获取玩家名次的背景色，给一二三名赋予特殊的颜色
    function getUserRankColor (rank = 0) {
        switch (rank) {
            case 1: return '#B7AA00'; //冠军
            case 2: return '#A0A0A0'; //亚军
            case 3: return '#AC6A00'; //季军
            default: return '#46393f'
        }
    }




    // 文字定义


    // 替换文字

    svg = replaceText(svg, 'hi', reg_text);

    return svg.toString();
}