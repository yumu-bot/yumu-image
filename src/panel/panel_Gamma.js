import {
    exportJPEG,
    getDecimals,
    getExportFileV3Path,
    getGameMode, getMapBG,
    implantImage, isReload,
    readNetImage,
    readTemplate,
    replaceTexts,
} from "../util/util.js";
import {extra, torus, torusRegular} from "../util/font.js";
import {calcPerformancePoints} from "../util/compute-pp.js";

export async function router(req, res) {
    try {
        let data = {};
        const classification = req.fields?.panel;

        switch (classification) {
            case 'info': data = await PanelGamma.infoVersion(req.fields?.user); break;
            case 'score': data = await PanelGamma.scoreVersion(req.fields?.score); break;
        }

        const svg = await panel_Gamma(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
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
    background: getExportFileV3Path('card-default.png'),
    avatar: getExportFileV3Path('avatar-guest.png'),
    mode: 'OSU',
    left1: '123',
    left2: '123',
    left3: '123',
    down1: '123',
    down2: '123',
    center0b: '4.',
    center0m: '36*',
    center1b: 'HyperText',
    center1m: '',
    center2: '95.36% // 1337x',

    panel: 'score', //score, info
}) {
    // 导入模板
    let svg = readTemplate('template/Panel_Gamma.svg');

    // 路径定义
    const reg_text = /(?<=<g id="Text">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-PGamma-BG\);" filter="url\(#blur-PGamma-BG\)">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-PGamma-MC\);">)/;
    const reg_map_hexagon = /(?<=<g id="HexagonChart">)/; // 移到上一层

    // 定义文字
    const left1 = torusRegular.getTextPath(torusRegular.cutStringTail(data.left1, 16, 190, true),
        40, 40, 16, 'left baseline', '#aaa');
    const left2 = torusRegular.getTextPath(torusRegular.cutStringTail(data.left2, 16, 190, true),
        40, 60, 16, 'left baseline', '#aaa');
    const left3 = torusRegular.getTextPath(torusRegular.cutStringTail(data.left3, 16, 190, true),
        40, 150, 16, 'left baseline', '#aaa');
    const down1 = torusRegular.getTextPath(torusRegular.cutStringTail(data.down1, 16, 190, true),
        200, 310, 16, 'right baseline', '#aaa');
    const down2 = torusRegular.getTextPath(torusRegular.cutStringTail(data.down2, 16, 190, true),
        200, 330, 16, 'right baseline', '#aaa');


    const center0 = torus.get2SizeTextPath(data.center0b, data.center0m,
        24, 18, 440, 65, 'center baseline', '#fff');
    const center1 = torus.get2SizeTextPath(data.center1b, data.center1m,
        36, 24, 440, 280, 'center baseline', '#fff');
    const center2 = torus.getTextPath(data.center2, 440, 310, 18, 'center baseline', '#fff');

    const mode = extra.getTextPath(getGameMode(data.mode, -1), 29, 220, 324, 'center baseline', '#3C3639');
    const hexagon = getExportFileV3Path('object-beatmap-hexagon2.png');

    // 插入文字
    svg = replaceTexts(svg, [left1, left2, left3, down1, down2, center0, center1, center2, mode], reg_text);

    // 插入图片和部件（新方法
    let background_opacity = 0.6;
    if (data.panel === 'score') background_opacity = 1;

    svg = implantImage(svg, 148, 160, 366, 80, 1, data.avatar, reg_avatar);
    svg = implantImage(svg, 400, 360, 240, 0, background_opacity, data.background, reg_background);
    svg = implantImage(svg, 148, 160, 366, 80, 1, hexagon, reg_map_hexagon);

    return svg.toString();
}

const PanelGamma = {
    infoVersion: async (user) => {
        const background = await readNetImage(user?.cover_url || user?.cover?.url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user?.avatar_url || user?.avatar?.url, false, getExportFileV3Path('avatar-guest.png'));

        return {
            background: background,
            avatar: avatar,
            mode: user?.rank_history?.mode,
            left1: '#' + user?.globalRank,
            left2: user?.country?.code + ' #' + user?.countryRank,
            left3: 'PC ' + user?.playCount,
            down1: 'Follower ' + user.follower_count,
            down2: 'U ' + user.id,
            center0b: user.pp ? Math.round(user.pp).toString() : '0',
            center0m: 'PP',
            center1b: user.username,
            center1m: '',
            center2: getDecimals(user.accuracy, 2) + getDecimals(user.accuracy, 3)
            + '% // Lv.' + user.levelCurrent,

            panel: 'info',
        };
    },

    scoreVersion: async (score) => {
        const background = getExportFileV3Path('object-score-backimage-' + score.rank + '.jpg');
        const avatar = await getMapBG(score.beatmapset.id, "list", false);

        // 成绩重计算
        const score_statistics = {
            ...score.statistics,
            combo: score.max_combo,
            mods: score.mods,
            accuracy: score.accuracy,
        }
        const calcPP = await calcPerformancePoints(score.beatmap.id, score_statistics, score.mode, isReload(score.beatmap.ranked));
        
        const mod_arr = score.mods || [];
        let mod_str = '';

        if (mod_arr !== []) {
            mod_str += ' +';
            
            for (const v of mod_arr) {
                mod_str += (v.toString() + ', ');
            }
            
            mod_str = mod_str.slice(0, -2);
        }
        
        const getStatistics = (score) => {
            switch (getGameMode(score.mode, 1)) {
                case 'o': {
                    return score.statistics.count_300 + ' / '
                        + score.statistics.count_100 + ' / '
                        + score.statistics.count_50 + ' / '
                        + score.statistics.count_miss;
                }
                case 't': {
                    return score.statistics.count_300 + ' / '
                        + score.statistics.count_100 + ' / '
                        + score.statistics.count_miss;
                }
                case 'c': {
                    return score.statistics.count_300 + ' / '
                        + score.statistics.count_100 + ' / '
                        + score.statistics.count_50 + ' / '
                        + score.statistics.count_miss + ' (-'
                        + score.statistics.count_katu + ')';
                }
                case 'm': {
                    return score.statistics.count_geki + ' (+'
                        + score.statistics.count_300 + ') / '
                        + score.statistics.count_katu + ' / '
                        + score.statistics.count_100 + ' / '
                        + score.statistics.count_50 + ' / '
                        + score.statistics.count_miss;
                }
            }
        }

        return {
            background: background,
            avatar: avatar,
            mode: score.mode,
            left1: score.beatmapset.title,
            left2: score.beatmapset.artist,
            left3: score.beatmap.version,
            down1: getStatistics(score),
            down2: 'b' + score.beatmap.id,
            center0b: getDecimals(calcPP.attr.stars, 2),
            center0m: getDecimals(calcPP.attr.stars, 3) + '*',
            center1b: Math.round(calcPP.pp).toString(),
            center1m: 'PP',
            center2: getDecimals(score.accuracy * 100, 2) +
                getDecimals(score.accuracy * 100, 3)
                + '% // ' + (score.max_combo || 0) + 'x // ' + score.rank + mod_str,

            panel: 'score',
        };
    },
};