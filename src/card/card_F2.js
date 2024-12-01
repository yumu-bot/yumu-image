import {
    getImageFromV3, getGameMode, getMapBG, getRoundedNumberStr,
    implantImage,
    implantSvgBody, replaceText, getDifficultyName
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_J} from "./card_J.js";
import {calcPerformancePoints} from "../util/compute-pp.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getModInt} from "../util/mod.js";
import {getScoreTypeImage, hasLeaderBoard} from "../util/star.js";

export async function card_F2(data = {
    recent: [
        {
            accuracy: 0.9242601246105919,
            mods: [ 'HD' ],
            passed: true,
            perfect: false,
            pp: 15.7001,
            rank: 'B',
            replay: true,
            score: 2647816,
            statistics: {
                count_50: 5,
                count_100: 70,
                count_300: 767,
                count_geki: 149,
                count_katu: 49,
                count_miss: 14
            },
            user: {
                id: 9794030,
                avatar: 'https://a.ppy.sh/9794030?1689442698.jpeg',
                pm_only: false,
                avatar_url: 'https://a.ppy.sh/9794030?1689442698.jpeg',
                default_group: 'default',
                is_active: true,
                is_bot: false,
                is_deleted: false,
                is_online: false,
                is_supporter: false,
                last_visit: [Array],
                pm_friends_only: false,
                username: 'SIyuyuko',
                country_code: 'CN'
            },
            best_id: 4518169991,
            max_combo: 207,
            user_id: 9794030,
            created_at: [ 2023, 10, 8, 13, 11, 20 ],
            id: 23509231244,
            mode: 'OSU',
            mode_int: 0,
            beatmap: {
                id: 4044160,
                mode: 'osu',
                status: 'ranked',
                version: "Calvaria's Another",
                ar: 9,
                cs: 5,
                bpm: 110,
                convert: false,
                passcount: 160,
                playcount: 1306,
                ranked: 1,
                url: 'https://osu.ppy.sh/beatmaps/4044160',
                beatMapFailedCount: 0,
                beatMapRetryCount: 0,
                beatMapRating: 0,
                beatmapset_id: 1751172,
                difficulty_rating: 5.1,
                mode_int: 0,
                total_length: 229,
                hit_length: 203,
                user_id: 12381096,
                accuracy: 8,
                drain: 5,
                is_scoreable: true,
                last_updated: '2023-09-15T03:11:55Z',
                checksum: '6eb6623607646fd874f63ffe1bbe0329',
                count_sliders: 429,
                count_spinners: 0,
                count_circles: 427
            },
            beatmapset: {
                video: false,
                fromDatabases: false,
                mapperUID: 11839745,
                sid: 1751172,
                mapperName: 'VoiceCore',
                ranked: true,
                rating: 0,
                id: 1751172,
                user_id: 11839745,
                artist: "Snail's House",
                artist_unicode: "Snail's House",
                title: 'Biscuit Funk',
                title_unicode: 'Biscuit Funk',
                creator: 'VoiceCore',
                favourite_count: 60,
                nsfw: false,
                play_count: 12245,
                preview_url: '//b.ppy.sh/preview/1751172.mp3',
                source: '',
                status: 'ranked',
                covers: [Object],
                spotlight: false
            },
            create_at_str: '2023-10-08T13:11:20Z'
        },
    ],
}) {
    // 读取模板
    let svg = `
          <g id="Base_CF2">
          </g>
          <g id="Card_J">
          </g>
          <g id="Text_CF2">
          </g>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base_CF2">)/;
    const reg_card_j = /(?<=<g id="Card_J">)/;
    const reg_text = /(?<=<g id="Text_CF2">)/;

    // 导入J卡
    let card_Js = [];
    for (const j of data.recent) {
        const mod_int = getModInt(j.mods || []);
        const stat = {
            ...j.statistics,
            combo: j.max_combo,
            mods: j.mods,
            mods_int: mod_int,
        }

        const calcPP = await calcPerformancePoints(j.beatmap.id, stat, getGameMode(j.mode, 0), false);

        card_Js.push(await card_J(await score2CardJ(j, calcPP)));
    }

    if (card_Js < 1) {
        svg = implantImage(svg, 185, 185, 697.5 - 620, 405 - 330, 1, getImageFromV3('sticker_qiqi_fallen.png'), reg_card_j);
    }

    for (const i in card_Js) {
        svg = implantSvgBody(svg, 15, 50 + i * 95, card_Js[i], reg_card_j);
    }

    // 导入文本
    const recent_title = torus.getTextPath('Recents', 15, 35.795, 30, 'left baseline', '#fff');

    svg = replaceText(svg, recent_title, reg_text);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 340, 335, 20, '#382e32');

    svg = replaceText(svg, base_rrect, reg_base);

    return svg;
}

const score2CardJ = async (score, calcPP) => {
    const background = await getMapBG(score.beatmapset.id, 'cover', hasLeaderBoard(score.beatmap.ranked));

    return {
        cover: background,
        background: background,
        type: getScoreTypeImage(score.is_lazer),

        title: score.beatmapset.title || '',
        artist: score.beatmapset.artist || '',
        difficulty_name: getDifficultyName(score.beatmap) || '',
        star_rating: calcPP.attr.stars,
        score_rank: score.rank,
        accuracy: getRoundedNumberStr(score.accuracy * 100, 3), //%
        combo: score.max_combo, //x
        mods_arr: score.mods || [],
        pp: Math.round(calcPP.pp) //pp
    }
}