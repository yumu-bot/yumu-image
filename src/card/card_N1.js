import {
    getDecimals,
    getExportFileV3Path,
    getFlagPath, getGameMode, getModColor, getRoundedNumberLargerStr, getRoundedNumberSmallerStr,
    implantImage, implantSvgBody,
    readNetImage,
    replaceText,
    torus
} from "../util.js";
import moment from "moment";
import {label_N1, LABEL_OPTION} from "../component/label.js";

export async function card_N1(data = {
    score: {
        "accuracy": 0.9882943143812709,
        "best_id": 4399593261,
        "created_at": "2023-03-17T09:18:25Z",
        "id": 4399593261,
        "max_combo": 943,
        "mode": "osu",
        "mode_int": 0,
        "mods": [
            "HD",
            "DT"
        ],
        "passed": true,
        "perfect": false,
        "pp": 566.194,
        "rank": "A",
        "replay": true,
        "score": 15905693,
        "statistics": {
            "count_100": 9,
            "count_300": 588,
            "count_50": 0,
            "count_geki": 135,
            "count_katu": 8,
            "count_miss": 1
        },
        "type": "score_best_osu",
        "user_id": 7892320,
        "current_user_attributes": {
            "pin": null
        },
        "user": {
            "avatar_url": "https://a.ppy.sh/7892320?1682816993.png",
            "country_code": "KR",
            "default_group": "default",
            "id": 7892320,
            "is_active": true,
            "is_bot": false,
            "is_deleted": false,
            "is_online": false,
            "is_supporter": true,
            "last_visit": null,
            "pm_friends_only": false,
            "profile_colour": null,
            "username": "mx10002",
            "country": {
                "code": "KR",
                "name": "South Korea"
            },
            "cover": {
                "custom_url": "https://assets.ppy.sh/user-profile-covers/7892320/33a28c19f958fdec86d058a054ca7435a3b559784111a5c6eee78b22552aab81.jpeg",
                "url": "https://assets.ppy.sh/user-profile-covers/7892320/33a28c19f958fdec86d058a054ca7435a3b559784111a5c6eee78b22552aab81.jpeg",
                "id": null
            }
        }
    },

    score_rank: 1,
    compare_score: 15905693,
}, reuse = false) {
    // 读取模板
    let svg =`   <defs>
            <clipPath id="clippath-CN-1">
              <rect width="915" height="62" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CN-2">
              <circle cx="95" cy="31" r="25" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CN-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="3" result="blur"/>
            </filter>
          </defs>
          <g id="Background_CN_1">
            <rect width="915" height="62" rx="20" ry="20" style="fill: #382E32;"/>
            <circle cx="145" cy="31" r="25" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CN-1);" filter="url(#blur-CN-1)">
            </g>
          </g>
          <g id="Avatar_CN_1">
            <g style="clip-path: url(#clippath-CN-2);">
            </g>
          </g>
          <g id="Text_CN_1">
          </g>
          <g id="Mod_CN_1">
          </g>
          <g id="Label_CN_1">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CN_1">)/;
    const reg_avatar = /(?<= <g style="clip-path: url\(#clippath-CN-2\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CN-1\);" filter="url\(#blur-CN-1\)">)/;
    const reg_label = /(?<=<g id="Label_CN_1">)/;
    const reg_mod = /(?<=<g id="Mod_CN_1">)/;

    //导入背景和头像

    const rank = getExportFileV3Path('object-score-' + data.score.rank + '-small.png')
    const avatar = await readNetImage(data.score.user.avatar_url,  getExportFileV3Path('avatar-guest.png'));
    const background = await readNetImage(data.score.user.cover.url, getExportFileV3Path('avatar-guest.png'));
    const name = torus.getTextPath(
        torus.cutStringTail(data.score.user.username, 26, 210, true), //最大宽度220px，给后面排名留了50px
        130, 26, 26, 'left baseline', '#fff'); //lS24 sS16 / y 24
    const flagSvg = await getFlagPath(data.score.user.country_code, 130, 32, 20);

    const score_date = getScoreDate(data);

    const country_date_rank = torus.getTextPath(
        data.score.user.country_code + ' #' + data.score_rank + ' (' + score_date + ')',
        162, 50, 18, 'left baseline', '#fff')

    // 导入N1标签
    const acc = data.score.accuracy * 100;
    const combo = data.score.max_combo;
    const pp = Math.round(data.score.pp);
    const score = data.score.score;

    const delta_score = (data.compare_score - score !== 0) ? ((score - data.compare_score).toString()) : '-0';
    const delta_score_text = torus.getTextPath(delta_score.toString(), 580 - 10, 36 + 17, 18, 'right baseline', '#aaa');

    const n1_acc = await label_N1({
        ...LABEL_OPTION.ACC2,
        data_b: getDecimals(acc, 2),
        data_m: getDecimals(acc, 3) + '%',
    }, true);
    const n1_combo = await label_N1({
        ...LABEL_OPTION.COMBO2,
        data_b: combo.toString(),
        data_m: 'x',
    }, true);
    const n1_pp = await label_N1({
        ...LABEL_OPTION.COMBO2,
        data_b: pp.toString(),
        data_m: 'PP',
    }, true);
    const n1_score = await label_N1({
        ...LABEL_OPTION.COMBO2,
        data_b: getRoundedNumberLargerStr(score, -1),
        data_m: getRoundedNumberSmallerStr(score, -1),
    }, true);

    // 导入评价，x和y是矩形的左上角
    const stat_interval = 5;
    const stat_x = 580
    const stat_y = 46;
    const stat_min_width = 10;
    const stat_full_width = 325;

    const mode = getGameMode(data.score.mode_int, 1);
    console.log(mode)
    const stat_arr = getStatArr(data, mode);
    const stat_width_arr = getStatWidthArr(data, mode, stat_min_width, stat_full_width, stat_interval);
    const stat_color_arr = getStatColorArr(mode);

    let width_sum = 0;
    for (const i in stat_arr) {
        const stat = stat_arr[i];
        const width = stat_width_arr[i];
        const color = stat_color_arr[i];

        if (stat > 0) {
            const stat_text = torus.getTextPath(stat.toString(),
                stat_x + width_sum + width / 2,
                stat_y - 5, 14, 'center baseline', '#fff');
            const svg_rect = `<rect id="L${i}RRect" x="${stat_x + width_sum}" y="${stat_y}" width="${width}" height="10" rx="5" ry="5" style="fill: ${color};"/>`;

            svg = replaceText(svg, stat_text, reg_label);
            svg = replaceText(svg, svg_rect, reg_label);

            //结算
            width_sum += (width + stat_interval);
        }
    }


    // 插入模组，因为先插的在上面，所以从左边插
    const insertMod = (mod, i, offset_x) => {
        const x = offset_x + i * 24;

        // 模组 svg 化
        const mod_abbr_path = torus.getTextPath(mod.toString(), (x + 20), 21, 16, 'center baseline', '#fff');
        return `<rect x="${x}" y="6" width="40" height="20" rx="10" ry="10" style="fill:${getModColor(mod)};"/>\n${mod_abbr_path}\n`;
    }

    const mods_arr = data.score.mods || ['']
    const mods_arr_length = mods_arr.length;

    if (mods_arr_length <= 4 && mods_arr_length > 0) {
        mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, 2 * i, 900 + 10 - mods_arr_length * 48), reg_mod);
        });
    } else if (mods_arr_length > 4) {
        mods_arr.forEach((val, i) => {
            svg = replaceText(svg, insertMod(val, i, 900 + 10 - mods_arr_length * 48), reg_mod);
        });
    }

    // 插入图片和部件（新方法
    svg = implantImage(svg,40,40,15,10,1, rank, reg_label);
    svg = implantImage(svg,50,50,70,6,1, avatar, reg_avatar);
    svg = implantImage(svg,915,62,0,0,0.3, background, reg_background);
    svg = replaceText(svg, name, reg_text);
    svg = replaceText(svg, flagSvg, reg_text);
    svg = replaceText(svg, country_date_rank, reg_text);
    svg = implantSvgBody(svg, 350, 6, n1_acc, reg_label);
    svg = implantSvgBody(svg, 460, 6, n1_combo, reg_label);
    svg = implantSvgBody(svg, 570, 6, n1_pp, reg_label);
    svg = implantSvgBody(svg, 350, 36, n1_score, reg_label);
    svg = replaceText(svg, delta_score_text, reg_label);

    return svg.toString();

    function getScoreDate(data) {
        const score_date = moment(data.score.created_at, 'YYYY-MM-DD[T]HH:mm:ss[Z]').utcOffset(960);

        const years = score_date.diff(moment(), "years");
        const months = score_date.diff(moment(), "months");
        const days = score_date.diff(moment(), "days");
        const hours = score_date.diff(moment(), "hours");
        const minutes = score_date.diff(moment(), "minutes");

        if (years < 0) {
            return years + 'y';
        } else if (months < 0) {
            return months + 'mo';
        } else if (days < 0) {
            return days + 'd';
        } else if (hours < 0) {
            return hours + 'h';
        } else if (minutes < 0) {
            return minutes + 'm';
        } else {
            return 'just now';
        }
    }

    function getStatWidthArr (data, mode = 'o', minWidth = 10, fullWidth = 325, interval = 5) {
        const c320 = data.score.statistics.count_geki;
        const c300 = data.score.statistics.count_300;
        const c200 = data.score.statistics.count_katu;
        const c100 = data.score.statistics.count_100;
        const c50 = data.score.statistics.count_50;
        const c0 = data.score.statistics.count_miss;

        // 分配应该统计的参数
        let stat_arr = getStatArr(data, mode);
        let stat_sum = 0;
        switch (mode) {
            case 'o': {
                stat_sum = c300 + c100 + c50 + c0;
            } break;
            case 't': {
                stat_sum = c300 + c100 + c0;
            } break;
            case 'c': {
                stat_sum = c300 + c100 + c50 + c0;
            } break;
            case 'm': {
                stat_sum = c320 + c300 + c200 + c100 + c50 + c0;
            } break;
        }

        let stat_width_arr = [];
        let remain_width = fullWidth;
        let remain_width_calc;
        let stat_sum_calc = stat_sum;

        if (stat_sum > 0) {

            //先减去间距，如果是0就不用考虑这个间距
            remain_width -= (interval * (stat_arr.length - 1));
            for (const v of stat_arr) {
                if (v === 0) remain_width += interval;
            }
            remain_width_calc = remain_width;

            //筛选出太短的
            for (const v of stat_arr) {
                if ((v / stat_sum) < (minWidth / remain_width) && v > 0) {
                    stat_sum_calc -= v;
                    remain_width_calc -= minWidth;
                }
            }

            //赋值
            for (const v of stat_arr) {
                if (v === 0) {
                    stat_width_arr.push(0);
                } else if ((v / stat_sum) < (minWidth / remain_width)) {
                    stat_width_arr.push(minWidth);
                } else {
                    stat_width_arr.push(v / stat_sum_calc * remain_width_calc);
                }
            }
        }

        return stat_width_arr;
    }

    function getStatArr(data, mode = 'o') {
        const c320 = data.score.statistics.count_geki;
        const c300 = data.score.statistics.count_300;
        const c200 = data.score.statistics.count_katu;
        const c100 = data.score.statistics.count_100;
        const c50 = data.score.statistics.count_50;
        const c0 = data.score.statistics.count_miss;

        let stat_arr = [];
        switch (mode) {
            case 'o': {
                stat_arr.push(c300, c100, c50, c0);
            } break;
            case 't': {
                stat_arr.push(c300, c100, c0);
            } break;
            case 'c': {
                stat_arr.push(c300, c100, c50, c0);
            } break;
            case 'm': {
                stat_arr.push(c320, c300, c200, c100, c50, c0);
            } break;
        }
        return stat_arr;
    }

    function getStatColorArr(mode = 'o') {
        let stat_color_arr = [];

        switch (mode) {
            case 'o':
            case 'c':
                stat_color_arr = ['#8DCEF4', '#79C471', '#FEF668', '#ED6C9E'];
                break;
            case 't':
                stat_color_arr = ['#8DCEF4', '#79C471', '#ED6C9E'];
                break;
            case 'm':
                stat_color_arr = ['#8DCEF4', '#FEF668', '#79C471', '#5E8AC6',
                    '#A1A1A1', '#ED6C9E'];
                break;
        }
        return stat_color_arr;
    }
}