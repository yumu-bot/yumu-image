import {
    exportImage,
    extra,
    getDecimals,
    getExportFileV3Path,
    getGameMode,
    implantImage,
    readImage,
    readNetImage,
    readTemplate,
    replaceTexts,
    torus,
    torusRegular
} from "../util.js";

export async function router(req, res) {
    try {
        let routeData = {};
        const classification = req.fields?.panel;
        switch (classification) {
            case 'info': routeData = await PanelGamma.infoVersion(req.fields?.user); break;
            case 'score': routeData = await PanelGamma.scoreVersion(req.fields?.score.score); break;
        }

        const data = await panel_Gamma(routeData);
        res.set('Content-Type', 'image/jpeg');
        res.send(data);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

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
}, reuse = false) {
    // 导入模板
    let svg = readTemplate('template/Panel_Gamma.svg');

    // 路径定义
    const reg_text = /(?<=<g id="Text">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-PGamma-BG\);" filter="url\(#blur-PGamma-BG\)">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-PGamma-MC\);">)/;
    const reg_map_hexagon = /(?<=<g id="Hexagon">)/; // 移到上一层

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
        24, 18, 440, 60, 'center baseline', '#fff');
    const center1 = torus.get2SizeTextPath(data.center1b, data.center1m,
        36, 24, 440, 270, 'center baseline', '#fff');
    const center2 = torus.getTextPath(data.center2, 440, 300, 18, 'center baseline', '#fff');

    const mode = extra.getTextPath(getGameMode(data.mode, -1), 29, 220, 324, 'center baseline', '#3C3639');
    const hexagon = getExportFileV3Path('object-beatmap-hexagon2.png');

    // 插入文字
    svg = replaceTexts(svg, [left1, left2, left3, down1, down2, center0, center1, center2, mode], reg_text);

    // 插入图片和部件（新方法
    svg = implantImage(svg, 148, 160, 366, 70, 1, data.avatar, reg_avatar);
    svg = implantImage(svg, 400, 360, 240, 0, 0.4, data.background, reg_background);
    svg = implantImage(svg, 148, 160, 366, 70, 1, hexagon, reg_map_hexagon);

    return await exportImage(svg);
}

const PanelGamma = {
    infoVersion: async (data) => {
        const background = await readNetImage(data?.cover_url || data?.cover?.url, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(data?.avatar_url || data?.avatar?.url, getExportFileV3Path('avatar-guest.png'));

        return {
            background: background,
            avatar: avatar,
            mode: data.playmode,
            left1: '#' + data.globalRank,
            left2: data.country.countryCode + '#' + data.countryRank,
            left3: data.playCount + 'PC',
            down1: data.follower_count + 'Fans',
            down2: 'u ' + data.id,
            center0b: Math.round(data.pp),
            center0m: 'PP',
            center1b: data.username,
            center1m: '',
            center2: getDecimals(data.accuracy, 2) + getDecimals(data.accuracy, 3)
            + '% // Lv.' + data.levelCurrent,

            panel: 'info',
        };
    },

    scoreVersion: async (data) => {
        const background = readImage(getExportFileV3Path('object-score-backimage-' + data.rank + '.jpg'));
        const avatar = await readNetImage(data.beatmapset.covers["list@2x"], getExportFileV3Path('beatmap-defaultBG.jpg'));

        return {
            background: background,
            avatar: avatar,
            mode: data.mode,
            left1: data.beatmapset.title,
            left2: data.beatmapset.artist,
            left3: data.beatmap.version,
            down1: data.score,
            down2: 'b ' + data.beatmap.id,
            center0b: getDecimals(data.beatmap.difficulty_rating, 2),
            center0m: getDecimals(data.beatmap.difficulty_rating, 3) + '*',
            center1b: data.pp || '-',
            center1m: 'PP',
            center2: getDecimals(data.accuracy * 100, 2) +
                getDecimals(data.accuracy * 100, 3)
                + '% // ' + (data.max_combo || 0) + 'x',

            panel: 'score',
        };
    },
};