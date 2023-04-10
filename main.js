import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, getExportFileV3Path, getGameMode, hasMod, initPath, readImage, readNetImage} from "./src/util.js";
import {panel_D} from "./src/panel/panel_D.js";
import {newJudge, panel_E} from "./src/panel/panel_E.js";
import {calcPerformancePoints, getDensityArray} from "./src/compute-pp.js";

initPath();
//这里放测试代码

const app = express();

app.use(formidable({
    encoding: 'utf-8', uploadDir: CACHE_PATH, autoClean: true, multiples: true,
}));

app.post('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'POST')
    next();
})

//**************************************************** panel ****************************
app.post('/panel_Ex', async (req, res) => {
    try {
        const f = checkJsonData(req);
        const png = await panel_E(f);
        res.set('Content-Type', 'image/png');
        res.send(png);
    } catch (e) {
        res.status(500).send(e.stack);
    }
})

app.post('/panel_D', async (req, res) => {
    try {
        let user = req.fields?.user;
        const card_a1 = await generate.user2CardA1(user);

        const label_data = {
            rks: {
                data: user?.statistics?.ranked_score,
            },
            tts: {
                data: user?.statistics?.total_score,
            },
            pc: {
                data: user?.statistics?.play_count,
            },
            pt: {
                data_b: '0.',
                data_m: '0d',
            },
            mpl: {
                data: user?.beatmap_playcounts_count,
            },
            rep: {
                data: user?.statistics?.replays_watched_by_others,
            },
            fan: {
                data: user?.follower_count,
            },
            tth: {
                data: user?.totalHits,
            },
        }

        if (user?.statistics?.total_score) {
            let d = Math.floor(user?.statistics?.play_time / 86400);
            let d_f = Math.floor(user?.statistics?.play_time % 86400 / 864).toString().padStart(2, '0')
            label_data.pt.data_b = `${d}.`;
            label_data.pt.data_m = `${d_f}d`;
        }

        let reList = req.fields['re-list'];
        const recent_play = [];
        for (const re of reList) {
            const covers_card = await readNetImage(re.beatmapset.covers.card, getExportFileV3Path('beatmap-defaultBG.jpg')); //card获取快
            let d = {
                map_cover: covers_card,
                map_background: covers_card,
                map_title_romanized: re.beatmapset.title,
                map_difficulty_name: re.beatmap.version,
                star_rating: re.beatmap.difficulty_rating,
                score_rank: re.rank,
                accuracy: Math.floor(re.accuracy * 10000) / 100, //这玩意传进来就是零点几？  是
                combo: re.max_combo, //x
                mods_arr: re.mods,
                pp: Math.floor(re.pp) //pp
            }
            recent_play.push(d);
        }

        let bpList = req.fields['bp-list'];
        const bp_list = [];

        for (const bp of bpList) {
            let d = {
                map_background: await readNetImage(bp.beatmapset.covers.list, getExportFileV3Path('beatmap-defaultBG.jpg')),
                star_rating: bp.beatmap.difficulty_rating,
                score_rank: bp.rank,
                bp_pp: bp.pp
            }
            bp_list.push(d);
        }

        const mpc = user.monthlyPlaycounts;
        let fd = mpc?.[0]?.startDate;
        const dataArr = [];
        if (fd) {
            const mpcObj = mpc.reduce((obj, {startDate, count}) => {
                obj[startDate] = count;
                return obj;
            }, {});
            let [year, month, day] = fd.split('-').map(Number);
            const nowDate = new Date();
            const thisYear = nowDate.getUTCFullYear();
            const thisMonth = nowDate.getUTCMonth() + 1;
            // 如果修改起始日期 参考下面例子
            //  year = thisYear - 1; //修改年
            //  month = month === 12 ? 1 : month + 1; //修改月
            // fd = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-'); //修改要传递的起始日期
            while (true) {
                if (year >= thisYear && month >= thisMonth) {
                    break;
                }

                const key = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-');

                if (key in mpcObj) {
                    dataArr.push(mpcObj[key]);
                } else {
                    dataArr.push(0);
                }

                if (month < 12) {
                    month += 1;
                } else {
                    month = 1;
                    year += 1;
                }
            }
            fd = [year, month, day].map(i => i.toString().padStart(2, '0')).join('-');
        } else {
            const nowDate = new Date();
            const thisYear = nowDate.getUTCFullYear();
            const thisMonth = nowDate.getUTCMonth() + 1;
            fd = `${thisYear}-${thisMonth.toString().padStart(2, '0')}-01`;
        }


        const op = {
            rank_country: user?.statistics?.country_rank,
            rank_global: user?.statistics?.global_rank,
            country: user?.country['countryCode'],
            bonus_pp: req.fields['pp-bonus'] || '-', // 416.6667
            om4k_pp: user?.statistics?.pp4K,
            om7k_pp: user?.statistics?.pp7K,
            game_mode: req.fields?.mode, // osu taiko catch mania

            grade_XH: user?.statistics?.ssh,
            grade_X: user?.statistics?.ss,
            grade_SH: user?.statistics?.sh,
            grade_S: user?.statistics?.s,
            grade_A: user?.statistics?.a,

            user_lv: user['levelCurrent'],
            user_progress: Math.floor(user['levelProgress']), //%

            user_bp_arr: req.fields['bp-time'],
            user_ranking_arr: user?.rank_history.history,
            user_pc_arr: dataArr,
            user_pc_last_date: fd
        }
        const d_data = {
            ...op, card_A1: card_a1, label_data: label_data, recent_play: recent_play, bp_list: bp_list,
        }
        const png = await panel_D(d_data);
        res.set('Content-Type', 'image/png');
        res.send(png);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
})

app.post('/panel_E', async (req, res) => {
    try {
        const user = req.fields?.user;
        const score = req.fields?.score;
        const card_a1 = await generate.user2CardA1(user);
        const newLabel = (remark, data_b, data_m) => {
            return {
                remark: remark,
                data_b: data_b,
                data_m: data_m,
            }
        }

        const score_statistics = {
            ...score.statistics,
            combo: score.max_combo,
            mods: score.mods,
        }
        const pp = await calcPerformancePoints(score.beatmap.id, score_statistics, score.mode);

        let map_length = score.beatmap.total_length || 0;
        let map_drain = score.beatmap.hit_length || 0;
        if (hasMod(pp.attr.mods_int, "DT")) {
            map_length = (map_length * 2 / 3).toFixed(0);
            map_drain = (map_drain * 2 / 3).toFixed(0);
        } else if (hasMod(pp.attr.mods_int, "HT")) {
            map_length = (map_length * 3 / 2).toFixed(0);
            map_drain = (map_drain * 3 / 2).toFixed(0);
        }

        let accRemark = '-';
        if (getGameMode(score.mode, 1) === 'm') {
            if (score.statistics.count_geki >= score.statistics.count_300) {
                accRemark = (score.statistics.count_geki / score.statistics.count_300).toFixed(1) + ':1';
            } else {
                accRemark =  '1:'+ (score.statistics.count_300 / score.statistics.count_geki).toFixed(1);
            }
        }

        let labelPoint = score.accuracy % 1;
        let showPoint = (labelPoint <= 0.01) || (labelPoint >= 0.99);

        const label_data = {
            acc: newLabel(accRemark,
                Math.floor(score.accuracy * 100) + (showPoint ? '' : '.'),
                showPoint ? '%' : ((Math.floor(score.accuracy * 10000) % 100) + '%')),
            combo: newLabel(`${score.beatmap.max_combo}x`,
                score.max_combo.toString(),
                'x'),
            pp: pp,
            ar: score.beatmap.ar,
            od: score.beatmap.accuracy,
            cs: score.beatmap.cs,
            hp: score.beatmap.drain,
            length: map_length,
            drain: map_drain,
        };


        const sumJudge = (n320, n300, n200, n100, n50, n0, gamemode) => {
            const mode = getGameMode(gamemode, 1)

            switch (mode) {
                case 'o':
                    return n300 + n100 + n50 + n0;
                case 't':
                    return n300 + n100 + n0;
                case 'c':
                    return Math.max((n300 + n100 + n50 + n0), n200); //小果miss(katu)也要传过去的
                case 'm':
                    return n320 + n300 + n200 + n100 + n50 + n0;
                default:
                    return n320 + n300 + n200 + n100 + n50 + n0;
            }
        }

        const score_stats = {
            judge_stat_sum: sumJudge(score.statistics.count_geki, score.statistics.count_300, score.statistics.count_katu, score.statistics.count_100, score.statistics.count_50, score.statistics.count_miss, score.mode),
            judges: newJudge(score.statistics.count_geki, score.statistics.count_300, score.statistics.count_katu, score.statistics.count_100, score.statistics.count_50, score.statistics.count_miss, score.mode)
        }

        const isTaikoPerfect = getGameMode(score.mode, 1) === 't' && (score.rank === 'XH' || score.rank === 'X');
        let score_categorize;
        if (score.mods.includes('NF')) {
            score_categorize = 'played';
        } else if (score.perfect || isTaikoPerfect) {
            score_categorize = 'perfect';
        } else if (score.statistics.count_miss === 0) {
            score_categorize = 'nomiss';
        } else if (score.rank !== 'F') {
            score_categorize = 'clear'; //failed
        } else {
            score_categorize = 'played';
        }

        const allRatingNum = score.beatmapset.ratings.reduce((s, v) => s + v);
        const allRatingVal = score.beatmapset.ratings.reduce((s, v, i) => s + v * i);
        const map_public_rating = allRatingVal ? Math.floor(allRatingVal / allRatingNum * 100) / 100 : 0;

        const map_fail_sum = score.beatmap.fail.reduce((s, v) => s + v) || 0;
        const map_retry_sum = score.beatmap.exit.reduce((s, v) => s + v) || 0;
        const map_notpass_sum = map_fail_sum + map_retry_sum || 0; //虚假的未通过人数
        const map_notpass_real_percent = (score.beatmap.playcount - score.beatmap.passcount) / score.beatmap.playcount || 1; //真实的未通过率
        const map_fail_percent = (map_fail_sum / map_notpass_sum * map_notpass_real_percent * 100).toFixed(0);
        const map_retry_percent = (map_retry_sum / map_notpass_sum * map_notpass_real_percent * 100).toFixed(0);
        const map_pass_percent = (100 - map_fail_percent - map_retry_percent).toFixed(0);

        const data = {
            map_density_arr: await getDensityArray(score.beatmap.id, score.mode),
            map_fail_arr: score.beatmap.fail,
            map_retry_arr: score.beatmap.exit,
            mods_arr: score.mods,

            map_background: await readNetImage(score.beatmapset.covers["list@2x"], getExportFileV3Path('beatmap-defaultBG.jpg')),
            //很糊的全图
            star: getExportFileV3Path('object-beatmap-star.png'),
            map_hexagon: getExportFileV3Path('object-beatmap-hexagon.png'),
            map_favorite: getExportFileV3Path('object-beatmap-favorite.png'),
            map_playcount: getExportFileV3Path('object-beatmap-playcount.png'),
            map_status: score.beatmap.status.toLowerCase(),

            score_rank: score.rank,
            star_rating: pp.attr.stars,
            score: score.score,
            score_acc_progress: Math.floor(score.accuracy * 10000) / 100,

            game_mode: score.mode.toLowerCase(),
            map_status_fav: score.beatmapset.favourite_count,
            map_status_pc: score.beatmapset.play_count,

            map_title_romanized: score.beatmapset.title,
            map_title_unicode: score.beatmapset.title_unicode,
            map_difficulty: score.beatmap.version,

            map_artist: score.beatmapset.artist,
            map_mapper: score.beatmapset.creator,
            map_bid: score.beatmap.id,

            map_public_rating: map_public_rating.toString(), //大众评分，就是大家给谱面打的分，结算后往下拉的那个星星就是
            map_fail_percent: map_fail_percent, //失败率%
            map_retry_percent: map_retry_percent, //重试率%
            map_pass_percent: map_pass_percent, //通过率%

            score_categorize: score_categorize,

            card_A1: card_a1,
            label_data: label_data,
            score_stats: score_stats,
            attr: pp.attr,
        }
        const png = await panel_E(data);
        res.set('Content-Type', 'image/png');
        res.send(png);
    } catch (e) {
        console.error("e", e);
        res.status(500).send(e.stack);
    }
})

app.listen(process.env.PORT, () => {
    console.log(`== Done. ==http://localhost:${process.env.PORT}\n cache path: ${CACHE_PATH}`);
})

// form: data:text ... img:file
function checkData(req, files = ['']) {
    let fs = {};
    for (const file of files) {
        if (req.files[file]) {
            fs[file] = readImage(req.files[file].path);
        }
    }
    return {
        ...req.fields, ...fs,
    };
}

//  form data: json text{ xxx: xxx, img:"img:xxx"} img: file xxx
const IMAGE_FLAG_START = "img:";

function checkJsonData(req) {
    const parseImage = (obj) => {
        for (const [key, val] of Object.entries(obj)) {
            switch (typeof val) {
                case "string": {
                    if (val.startsWith(IMAGE_FLAG_START)) {
                        let f_name = val.substring(IMAGE_FLAG_START.length);
                        if (!req.files[f_name]) throw Error(`"${f_name}" in ${key} is not file upload`);
                        obj[key] = req.files[f_name].path;
                    }
                }
                    break;
                case "object": {
                    parseImage(val);
                }
                    break;
            }
        }
    }

    let json = JSON.parse(req.fields['json']);
    parseImage(json);
    return json;
}

let generate = {
    user2CardA1: async (user) => {
        return {
            background: await readNetImage(user.cover_url, getExportFileV3Path('card-default.png')),
            avatar: await readNetImage(user.avatar_url, getExportFileV3Path('avatar-guest.png')),
            sub_icon1: user['support_level'] > 0 ? getExportFileV3Path('PanelObject/A_CardA1_SubIcon1.png') : '',
            sub_icon2: '',
            name: user['username'],
            rank_global: user['globalRank'],
            rank_country: user['countryRank'],
            country: user?.country['countryCode'],
            acc: Math.floor(user['accuracy'] * 100) / 100,
            level: user['levelCurrent'],
            progress: Math.floor(user['levelProgress']),
            pp: Math.floor(user['pp']),
        };
    }
}
