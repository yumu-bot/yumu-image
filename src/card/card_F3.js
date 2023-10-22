import {
    getMapBG, implantSvgBody,
    replaceText
} from "../util/util.js";
import {torus} from "../util/font.js";
import {card_K} from "./card_K.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getModInt, hasMod} from "../util/mod.js";

export async function card_F3(data = {
    bp: [{
        accuracy: 0.9983416252072969,
        mods: [ 'HD' ],
        passed: true,
        perfect: true,
        pp: 245.363,
        rank: 'SH',
        replay: true,
        score: 7625753,
        statistics: {
            count_50: 0,
            count_100: 1,
            count_300: 401,
            count_geki: 114,
            count_katu: 1,
            count_miss: 0
        },
        user: {
            id: 9794030,
            avatar: 'https://a.ppy.sh/9794030?1689442698.jpeg',
            pmOnly: false,
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
        weight: { percentage: 69.83373, pp: 171.34613 },
        best_id: 4280526255,
        max_combo: 600,
        user_id: 9794030,
        created_at: [ 2022, 9, 27, 12, 1, 36 ],
        id: 4280526255,
        mode: 'OSU',
        mode_int: 0,
        beatmap: {
            id: 1982050,
            mode: 'osu',
            status: 'ranked',
            version: "Kaguya_Sama's Extra",
            ar: 9.5,
            cs: 4,
            bpm: 108,
            convert: false,
            passcount: 12285,
            playcount: 59715,
            ranked: 1,
            url: 'https://osu.ppy.sh/beatmaps/1982050',
            beatMapFailedCount: 0,
            beatMapRetryCount: 0,
            beatMapRating: 0,
            beatmapset_id: 318425,
            difficulty_rating: 5.55,
            mode_int: 0,
            total_length: 102,
            hit_length: 102,
            user_id: 9326064,
            accuracy: 8.8,
            drain: 5.5,
            is_scoreable: true,
            last_updated: '2019-04-06T18:48:01Z',
            checksum: '546572114dec84e7dbbdddda45a03fa9',
            count_sliders: 183,
            count_spinners: 0,
            count_circles: 219
        },
        beatmapset: {
            video: true,
            fromDatabases: false,
            mapperUID: 2732340,
            sid: 318425,
            mapperName: 'Taeyang',
            ranked: true,
            rating: 0,
            id: 318425,
            user_id: 2732340,
            artist: 'Forte Escape',
            artist_unicode: 'Forte Escape',
            title: 'Ask to Wind',
            title_unicode: '바람에게 부탁해',
            creator: 'Taeyang',
            favourite_count: 144,
            nsfw: false,
            play_count: 314154,
            preview_url: '//b.ppy.sh/preview/318425.mp3',
            source: 'DJMAX',
            status: 'ranked',
            covers: [Object],
            spotlight: false
        },
        create_at_str: '2022-09-27T12:01:36Z'
    }]
}, reuse = false) {
    // 读取模板
    let svg = `
          <g id="Base_CF3">
          </g>
          <g id="Card_K">
          </g>
          <g id="Text_CF3">
          </g>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base_CF3">)/;
    const reg_card_k = /(?<=<g id="Card_K">)/;
    const reg_text = /(?<=<g id="Text_CF3">)/;

    // 导入K卡
    let card_Ks = [];
    for (const i in data.bp) {
        card_Ks.push(await card_K(
            await bp2CardK(data.bp[i], parseInt(i) + 1), true));
    }

    for (const i in card_Ks) {
        svg = implantSvgBody(svg, 15 + (i % 4 * 80), (i < 4 ? 50 : 110), card_Ks[i], reg_card_k);
    }

    // 导入文本
    const bp_title = torus.getTextPath('BPs', 15, 35.795, 30, 'left baseline', '#fff');

    svg = replaceText(svg, bp_title, reg_text);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 340, 175, 20, '#382e32');

    svg = replaceText(svg, base_rrect, reg_base);

    return svg;
}

const bp2CardK = async (bp, bp_ranking = 1) => {
    //随便搞个颜色，就不需要去获取一遍谱面了
    const mod_int = getModInt(bp.mods);
    let star_rating = bp.beatmap.difficulty_rating || 0;
    if (hasMod(mod_int, 'DT') || hasMod(mod_int, 'NC')) {
        star_rating *= 1.5;
    } else if (hasMod(mod_int, 'HT')) {
        star_rating *= 0.75;
    } else if (hasMod(mod_int, 'HR')) {
        star_rating *= 1.078;
    } else if (hasMod(mod_int, 'EZ')) {
        star_rating *= 0.9;
    } else if (hasMod(mod_int, 'FL')) {
        star_rating *= 1.3;
    }

    return {
        map_background: await getMapBG(bp.beatmapset.id, 'list@2x'),
        star_rating: star_rating,
        score_rank: bp.rank,
        bp_ranking: bp_ranking, //感觉暂时不使用这个也可以
        bp_pp: bp.pp,
        bp_remark: 'PP',// PP
    }
}