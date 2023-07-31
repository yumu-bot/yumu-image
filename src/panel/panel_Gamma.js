import {
    exportImage,
    extra,
    getDecimals,
    getExportFileV3Path,
    getGameMode,
    getNowTimeStamp,
    getRandomBannerPath,
    getUserRankColor,
    implantImage,
    implantSvgBody,
    PanelGenerate,
    readImage,
    readNetImage,
    readTemplate,
    replaceText,
    replaceTexts,
    torus,
    torusRegular
} from "../util.js";
import {card_H} from "../card/card_H.js";
import {card_A1} from "../card/card_A1.js";

export async function router(req, res) {
    try {
        let routeData = {};
        switch (req.fields.panel) {
            case 'info': routeData = await PanelGamma.infoVersion(req.fields); break;
            case 'score': routeData = await PanelGamma.scoreVersion(req.fields); break;
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
        const background = await readNetImage(data.user?.cover_url || data.user?.cover?.url, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(data.user?.avatar_url || data.user?.avatar?.url, getExportFileV3Path('avatar-guest.png'));

        return {
            background: background,
            avatar: avatar,
            mode: data.user.playmode,
            left1: '#' + data.user.globalRank,
            left2: data.user.country.countryCode + '#' + data.user.countryRank,
            left3: data.user.playCount + 'PC',
            down1: data.user.follower_count + 'Fans',
            down2: 'u ' + data.user.id,
            center0b: Math.round(data.user.pp),
            center0m: 'PP',
            center1b: data.user.username,
            center1m: '',
            center2: getDecimals(data.user.accuracy, 2) + getDecimals(data.user.accuracy, 3)
            + '% // Lv.' + data.user.levelCurrent,

            panel: 'info',
        };
    },

    scoreVersion: async (data= {
        score: {
            "id": 1343310463,
            "user_id": 7003013,
            "accuracy": 0.96875,
            "mods": [],
            "score": 851494,
            "max_combo": 41,
            "passed": true,
            "perfect": false,
            "statistics": {
                "count_50": 0,
                "count_100": 0,
                "count_300": 26,
                "count_geki": 36,
                "count_katu": 0,
                "count_miss": 2
            },
            "rank": "S",
            "created_at": "2021-08-18T12:34:53+00:00",
            "best_id": 441054683,
            "pp": null,
            "mode": "mania",
            "mode_int": 3,
            "replay": true,
            "beatmap": {
                "beatmapset_id": 1320263,
                "difficulty_rating": 0.92,
                "id": 2735119,
                "mode": "mania",
                "status": "loved",
                "total_length": 30,
                "user_id": 259972,
                "version": "[10K] [MX00] new beginnings",
                "accuracy": 0,
                "ar": 5,
                "bpm": 130,
                "convert": false,
                "count_circles": 64,
                "count_sliders": 0,
                "count_spinners": 0,
                "cs": 10,
                "deleted_at": null,
                "drain": 0,
                "hit_length": 28,
                "is_scoreable": true,
                "last_updated": "2021-02-17T09:18:50+00:00",
                "mode_int": 3,
                "passcount": 729,
                "playcount": 1909,
                "ranked": 4,
                "url": "https://osu.ppy.sh/beatmaps/2735119",
                "checksum": "fcd0138d3e6604237298d3f5cdd2f7a7"
            },
            "beatmapset": {
                "artist": "Various Artists",
                "artist_unicode": "Various Artists",
                "covers": {
                    "cover": "https://assets.ppy.sh/beatmaps/1320263/covers/cover.jpg?1622203051",
                    "cover@2x": "https://assets.ppy.sh/beatmaps/1320263/covers/cover@2x.jpg?1622203051",
                    "card": "https://assets.ppy.sh/beatmaps/1320263/covers/card.jpg?1622203051",
                    "card@2x": "https://assets.ppy.sh/beatmaps/1320263/covers/card@2x.jpg?1622203051",
                    "list": "https://assets.ppy.sh/beatmaps/1320263/covers/list.jpg?1622203051",
                    "list@2x": "https://assets.ppy.sh/beatmaps/1320263/covers/list@2x.jpg?1622203051",
                    "slimcover": "https://assets.ppy.sh/beatmaps/1320263/covers/slimcover.jpg?1622203051",
                    "slimcover@2x": "https://assets.ppy.sh/beatmaps/1320263/covers/slimcover@2x.jpg?1622203051"
                },
                "creator": "Jakads",
                "favourite_count": 268,
                "hype": null,
                "id": 1320263,
                "nsfw": false,
                "play_count": 73853,
                "preview_url": "//b.ppy.sh/preview/1320263.mp3",
                "source": "",
                "status": "loved",
                "title": "4+6K Pack 1",
                "title_unicode": "4+6K Pack 1",
                "user_id": 259972,
                "video": false
            },
            "user": {
                "avatar_url": "https://a.ppy.sh/7003013?1627924902.jpeg",
                "country_code": "CN",
                "default_group": "default",
                "id": 7003013,
                "is_active": true,
                "is_bot": false,
                "is_deleted": false,
                "is_online": true,
                "is_supporter": true,
                "last_visit": "2021-08-18T12:33:56+00:00",
                "pm_friends_only": false,
                "profile_colour": null,
                "username": "Muziyami"
            }
        },

        panel: "score",
    }) => {
        const background = readImage(getExportFileV3Path('object-score-backimage-' + data.score.rank + '.jpg'));
        const avatar = await readNetImage(data.score.beatmapset.covers["list@2x"], getExportFileV3Path('beatmap-defaultBG.jpg'));

        return {
            background: background,
            avatar: avatar,
            mode: data.score.mode,
            left1: data.score.beatmapset.title,
            left2: data.score.beatmapset.artist,
            left3: data.score.beatmap.version,
            down1: data.score.score,
            down2: 'b ' + data.score.beatmap.id,
            center0b: getDecimals(data.score.beatmap.difficulty_rating, 2),
            center0m: getDecimals(data.score.beatmap.difficulty_rating, 3) + '*',
            center1b: data.score.pp || '-',
            center1m: 'PP',
            center2: getDecimals(data.score.accuracy * 100, 2) +
                getDecimals(data.score.accuracy * 100, 3)
                + '% // ' + (data.score.max_combo || 0) + 'x',

            panel: 'score',
        };
    },
};