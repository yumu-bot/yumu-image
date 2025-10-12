import {
    exportJPEG,
    getImageFromV3,
    getGameMode,
    setImage,
    readTemplate,
    setTexts,
    getAvatar,
    getBanner,
    getTimeByDHMS,
    getTimeDifference,
    setText,
    isNotEmptyArray, floor, floors, getMapBackground,
} from "../util/util.js";
import {extra, torus, torusRegular} from "../util/font.js";
import {getRankFromValue} from "../util/star.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRankColor} from "../util/color.js";
import moment from "moment";

export async function router(req, res) {
    try {
        let data = {};
        const classification = req.fields?.panel;

        switch (classification) {
            case 'info': data = await PanelGamma.infoVersion(req.fields?.user); break;
            case 'score': data = await PanelGamma.scoreVersion(req.fields?.score); break;
            case 'sanity': data = await PanelGamma.sanityVersion(req.fields); break;
            default: res.status(400).send()
        }

        const svg = await panel_Gamma(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
}
export async function router_svg(req, res) {
    try {
        let data = {};
        const classification = req.fields?.panel;

        switch (classification) {
            case 'info': data = await PanelGamma.infoVersion(req.fields?.user); break;
            case 'score': data = await PanelGamma.scoreVersion(req.fields?.score); break;
            case 'sanity': data = await PanelGamma.sanityVersion(req.fields); break;
            default: res.status(400).send()
        }

        const svg = await panel_Gamma(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 简略信息面板, 似乎user info和score info集成在一起
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Gamma(data = {
    background: getImageFromV3('card-default.png'),
    avatar: getImageFromV3('avatar-guest.png'),
    mode: '',
    left1: '',
    left2: '',
    left3: '',

    down1: '',
    down2: '',

    down_left1: '',
    down_left2: '',
    down_left3: '',
    down_right1: '',
    down_right2: '',
    down_right3: '',
    down_left_color: 'none',

    background_color: '',

    center0b: '',
    center0m: '',
    center1b: '',
    center1m: '',
    center2: '',

    panel: '', //score, info
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_Gamma.svg');

    // 路径定义
    const reg_text = /(?<=<g id="Text">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-PGamma-BG\);" filter="url\(#blur-PGamma-BG\)">)/;
    const reg_background_color = /(?<=<g id="Background">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-PGamma-MC\);">)/;
    const reg_map_hexagon = /(?<=<g id="HexagonChart">)/; // 移到上一层
    const reg_index = /(?<=<g id="Index">)/;

    const is_sanity = data?.panel === 'sanity';
    const is_score = data?.panel === 'score';

    // 定义文字
    const left1 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.left1 || '', 16, 190, true),
        40, 40, 16, 'left baseline', '#fff');
    const left2 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.left2 || '', 16, 190, true),
        40, 60, 16, 'left baseline', '#fff');
    const left3 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.left3 || '', 16, 190, true),
        40, 150, 16, 'left baseline', '#fff');
    const down1 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.down1 || '', 16, 190, true),
        200, 310, 16, 'right baseline', '#fff');
    const down2 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.down2 || '', 16, 190, true),
        200, 330, 16, 'right baseline', '#fff');

    const down_left1 = torusRegular.getTextPath(data?.down_left1 || '', 40, 340, 16, 'left baseline', '#fff');
    const down_left23 = torus.get2SizeTextPath(data?.down_left2 || '', ' ' + (data?.down_left3 || ''),
        36, 24,  100, 340, 'left baseline', data?.down_left_color);

    const down_right1 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.down_right1 || '', 16, 190, true),
        200, 255, 16, 'right baseline', '#fff');
    const down_right2 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.down_right2 || '', 16, 190, true),
        200, 275, 16, 'right baseline', '#fff');
    const down_right3 = torusRegular.getTextPath(torusRegular.cutStringTail(data?.down_right3 || '', 16, 190, true),
        200, 295, 16, 'right baseline', '#fff');

    const center0 = torus.get2SizeTextPath(data?.center0b || '', data?.center0m || '',
        24, 18, 440, 65, 'center baseline', '#fff');
    const center1 = torus.get2SizeTextPath(data?.center1b || '', data?.center1m || '',
        36, 24, 440, 280, 'center baseline', '#fff');
    const center2 = torus.getTextPath(data.center2, 440, 310, 18, 'center baseline', '#fff');

    const mode = extra.getTextPath(getGameMode(data.mode, -1), 29, 220, 324, 'center baseline', '#fff', 0.1); //3C3639
    const hexagon = getImageFromV3('object-beatmap-hexagon2.png');

    // 插入文字
    svg = setTexts(svg, [left1, left2, left3, down1, down2, down_left1, down_left23, down_right1, down_right2, down_right3, center0, center1, center2, mode], reg_text);

    // 定义装饰条
    const bar1 = PanelDraw.Rect(28, 30, 2, 120, 1, '#fff', 1);
    const bar2 = is_sanity ?
        PanelDraw.Rect(210, 243, 2, 52, 1, '#fff', 1) :
        PanelDraw.Rect(210, 298, 2, 32, 1, '#fff', 1);
    const bar3 = is_sanity ? PanelDraw.Rect(28, 310, 2, 32, 1, '#fff', 1) : '';

    svg = setTexts(svg, [bar1, bar2, bar3], reg_index);

    // 插入图片和部件（新方法

    const base = PanelDraw.Rect(0, 0, 240, 360, 0, '#2A2226', 1)
    const background_color = PanelDraw.Rect(0, 0, 240, 360, 0, data?.background_color || 'none', 0.1)
    svg = setText(svg, [base, background_color], reg_background_color)
    svg = setText(svg, background_color, reg_background) // 这个是用来给中间分界线处的渐变上色的

    svg = setImage(svg, 366, 80, 148, 160, data.avatar, reg_avatar, 1);
    svg = setImage(svg, 240, 0, 400, 360, data.background, reg_background, is_score ? 1 : 0.6);
    svg = setImage(svg, 366, 80, 148, 160, hexagon, reg_map_hexagon, 1);

    return svg.toString();
}

const PanelGamma = {
    infoVersion: async (user) => {
        const background = await getBanner(user?.cover_url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        const join = moment(user?.join_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours');
        const date = user?.join_date ? join.format('YYYY-MM-DD') : 'Unknown';
        const difference = user?.join_date ? (' (' + getTimeDifference(join) + ')') : '';

        return {
            background: background,
            avatar: avatar,
            mode: user?.rank_history?.mode || 'osu',
            left1: 'RANK / #' + (user?.global_rank || 0),
            left2: (user?.country?.code || 'UN') + ' / #' + (user?.country_rank || '0'),
            left3: 'JOIN / ' + date + difference,
            down1: 'FAN / ' + user?.follower_count || '0',
            down2: 'UID / ' + user?.id || '0',
            center0b: Math.round(user?.pp || 0).toString(),
            center0m: 'PP',
            center1b: user?.username || 'Unknown',
            center1m: '',
            center2: floor(user?.accuracy, 2) + '% // Lv.' + user.level_current,

            background_color: '#2a2226',
            panel: 'info',
        };
    },

    scoreVersion: async (score) => {
        const background = getImageFromV3('object-score-backimage-' + score.rank + '.jpg');
        const avatar = await getMapBackground(score, "list");

        /*
        // 成绩重计算
        const score_statistics = {
            ...score.statistics,
            combo: score.max_combo,
            mods: score.mods,
            accuracy: score.accuracy,
        }
        const calcPP = await calcPerformancePoints(score.beatmap.id, score_statistics, score.mode, hasLeaderBoard(score.beatmap.ranked));

         */

        const mods_arr = score.mods ?? [];
        let mod_str = '';

        if (isNotEmptyArray(mods_arr)) {
            mod_str += ' +';

            for (const v of mods_arr) {
                mod_str += ((v?.acronym || v.toString()) + ', ');
            }

            mod_str = mod_str.slice(0, -2);
        }

        const getStatistics = (score) => {
            switch (getGameMode(score.mode, 1)) {
                case 'o': {
                    return score.statistics.great + ' / '
                        + score.statistics.ok + ' / '
                        + score.statistics.meh + ' / '
                        + score.statistics.miss;
                }
                case 't': {
                    return score.statistics.great + ' / '
                        + score.statistics.ok + ' / '
                        + score.statistics.miss;
                }
                case 'c': {
                    return score.statistics.great + ' / '
                        + score.statistics.large_tick_hit + ' / '
                        + score.statistics.small_tick_hit + ' / '
                        + score.statistics.miss + ' (-'
                        + score.statistics.small_tick_miss + ')';
                }
                case 'm': {
                    return (score.statistics.great + score.statistics.perfect) + ' (+'
                        + score.statistics.perfect + ') / '
                        + score.statistics.good + ' / '
                        + score.statistics.ok + ' / '
                        + score.statistics.meh + ' / '
                        + score.statistics.miss;
                }
            }
        }

        const sr = floors(score.beatmap.difficulty_rating, 2)

        return {
            background: background,
            avatar: avatar,
            mode: score.mode,
            left1: score.beatmapset.title,
            left2: score.beatmapset.artist,
            left3: score.beatmap.version,
            down1: getStatistics(score),
            down2: 'b' + score.beatmap.id,
            center0b: sr.integer,
            center0m: sr.decimal + '*',
            center1b: Math.round(score.pp).toString(),
            center1m: 'PP',
            center2: floor((score?.accuracy || 0) * 100, 2) + '% // ' + (score.max_combo || 0) + 'x // ' + score.rank + mod_str,

            background_color: '#2a2226',
            panel: 'score',
        };
    },

    sanityVersion: async (s = {}) => {
        const user = s?.users ? (s?.users[0] || s?.users) : {};

        const background = await getBanner(user?.cover_url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        const sanity = (s?.my?.SAN || 1.2) * 100;
        const sanity_rank = getRankFromValue(sanity, [120, 100, 95, 90, 80, 70, 60, 0], ['?', '++', '+', '-', '--', '!?', '!', '!!', 'X']);
        const sanity_color = getRankColor(
            getRankFromValue(sanity, [120, 100, 95, 90, 80, 70, 60, 0])
        );

        const join = moment(user?.join_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours');
        const date = user?.join_date ? join.format('YYYY-MM-DD') : 'Unknown';
        const difference = user?.join_date ? (' (' + getTimeDifference(join) + ')') : '';

        return {
            background: background,
            avatar: avatar,
            mode: user?.rank_history?.mode || 'osu',
            left1: 'RANK / #' + (user?.global_rank || 0),
            left2: (user?.country?.code || 'UN') + ' / #' + (user?.country_rank || '0'),
            left3: 'JOIN / ' + date + difference,

            down_left1: 'SANITY',
            down_left2: Math.round(sanity).toString(),

            // SANITY_BOUNDARY, SANITY_RANKS
            down_left3: sanity_rank,
            down_right1: 'PC / ' + (user?.play_count || 0),
            down_right2: 'TTH / ' + (user?.total_hits || 0),
            down_right3: 'PT / ' + getTimeByDHMS((user?.play_time || 0), true),
            down_left_color: sanity_color,

            center0b: Math.round(user?.pp || 0).toString(),
            center0m: 'PP',
            center1b: user?.username || 'Unknown',
            center1m: '',

            center2: floor(user?.accuracy, 2) + '% // Lv.' + (user?.level_current || '0'),

            background_color: sanity_color,
            panel: 'sanity',
        };
    },
};
