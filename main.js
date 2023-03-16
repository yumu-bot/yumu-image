import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, getExportFileV3Path, initPath, readImage, readNetImage} from "./src/util.js";
import {panel_D} from "./src/panel/panel_D.js";
import {panel_E} from "./src/panel/panel_E.js";
import fs from "fs";

initPath();
console.time('E')
fs.writeFileSync("image/out/panel_E.png", await panel_E());
console.timeEnd('E')

/*
console.time()
console.time('C')
fs.writeFileSync("image/out/panel_C.png", await panel_C());
console.timeEnd('C')
console.time('D')
fs.writeFileSync("image/out/panel_D.png", await panel_D());
console.timeEnd('D')
console.time('E')
fs.writeFileSync("image/out/panel_E.png", await panel_E());
console.timeEnd('E')
console.time('F')
fs.writeFileSync("image/out/panel_F.png", await panel_F());
console.timeEnd('F')
console.time('H')
fs.writeFileSync("image/out/panel_H.png", await panel_H());
console.timeEnd('H')
console.time('I')
fs.writeFileSync("image/out/panel_I.png", await panel_I());
console.timeEnd('I')
console.timeEnd()
 */

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
                accuracy: Math.floor(re.accuracy * 10000) / 100, //这玩意传进来就是零点几？
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
            bonus_pp: req.fields['pp-bonus'] | '-', // 416.6667
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
        const label_data = {
            acc: newLabel('-', Math.floor(score * 100), `${Math.floor(score * 10000) % 100}%`),
            combo: newLabel(`${score.beatmap.max_combo}x`, score.max_combo, 'x'),
            pp: newLabel('', `${Math.floor(score.pp)}.`, `${Math.floor(score.pp * 100) % 100}`),
            bpm: newLabel('', score.beatmap.bpm, `${Math.floor(score.beatmap.bpm * 100) % 100 ? Math.floor(score.beatmap.bpm * 100) % 100 : ''}`),
            length: newLabel(`${Math.floor(score.beatmap.total_length / 60)}:${Math.floor(score.beatmap.total_length) % 60}`, `${Math.floor(score.beatmap.total_length / 60)}:`, Math.floor(score.beatmap.total_length) % 60),
            cs: newLabel('', `${Math.floor(score.beatmap.cs)}.`, Math.floor(score.beatmap.cs * 100) % 100),
            ar: newLabel('', `${Math.floor(score.beatmap.ar)}.`, Math.floor(score.beatmap.ar * 100) % 100),
            od: newLabel('', `${Math.floor(score.beatmap.accuracy)}.`, Math.floor(score.beatmap.accuracy * 100) % 100),
            hp: newLabel('-', `${Math.floor(score.beatmap.drain)}.`, Math.floor(score.beatmap.drain * 100) % 100),
        };
        const newJudge = (n320, n300, n200, n100, n50, n0, gamemode) => {
            const judges = [];

            if (n320 && gamemode === 'mania') { //只有mania有n320
                judges.push({
                    index: '320',
                    stat: n320,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#8DCFF4',
                })
            } // else judges.push({}); //好像不用顶掉这个

            if (n300) {
                switch (gamemode){
                    case 'osu': {
                        judges.push({
                            index: '300',
                            stat: n300,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#8DCFF4',
                        }); break;
                    }

                    case 'taiko': {
                        judges.push({
                            index: '300',
                            stat: n300,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#8DCFF4',
                        }); break;
                    }

                    case 'fruits': {
                        judges.push({
                            index: '300',
                            stat: n300,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#8DCFF4',
                        }); break;
                    }

                    case 'mania': {
                        judges.push({
                            index: '300',
                            stat: n300,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#FEF668',
                        }); break;
                    }
                }

            } else judges.push({});

            if (n200 && gamemode === 'mania') {
                judges.push({
                    index: '200',
                    stat: n200,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#79C471',
                })
            } // else judges.push({}); //好像不用顶掉这个

            if (n100) {

                switch (gamemode) {
                    case 'osu': {
                        judges.push({
                            index: '100',
                            stat: n100,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#79C471',
                        }); break;
                    }
                    case 'taiko': {
                        judges.push({
                            index: '100',
                            stat: n100,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#79C471',
                        }); break;
                    }
                    case 'fruits': {
                        judges.push({
                            index: '100',
                            stat: n100,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#79C471',
                        }); break;
                    }
                    case 'mania': {
                        judges.push({
                            index: '100',
                            stat: n100,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#5E8AC6',
                        }); break;
                    }
                }

            } else judges.push({});

            if (n50) {
                switch (gamemode) {
                    case 'osu': {
                        judges.push({
                            index: '50',
                            stat: n50,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#5E8AC6',
                        }); break;
                    }
                    case 'mania': {
                        judges.push({
                            index: '50',
                            stat: n50,
                            index_color: '#fff',
                            stat_color: '#fff',
                            rrect_color: '#A1A1A1',
                        }); break;
                    }
                }
            } else judges.push({});

            if (n0) {
                judges.push({
                    index: '0',
                    stat: n0,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#ED6C9E',
                })
            } else judges.push({});

            if (n200 && gamemode === 'fruits') { //ctb的n200 （丢小果
                judges.push({}); //留空格？
                judges.push({
                    index: 'MD',
                    stat: n200,
                    index_color: '#fff',
                    stat_color: '#fff',
                    rrect_color: '#A1A1A1',
                })
            }

            return judges;
        }

        const sumJudge = (n320, n300, n200, n100, n50, n0, gamemode) => {
            switch (gamemode) {
                case 'osu': return n300 + n100 + n50 + n0;
                case 'taiko': return n300 + n100 + n0;
                case 'fruits': return Math.max( n300 + n100 + n50 + n0, n200); //小果miss(katu)也要传过去的
                case 'mania': return n320 + n300 + n200 + n100 + n50 + n0;
                default: return n320 + n300 + n200 + n100 + n50 + n0;
            }
        }

        const score_stats = {
            judge_stat_sum: sumJudge(score.statistics.count_geki, score.statistics.count_300, score.statistics.count_katu, score.statistics.count_100, score.statistics.count_50, score.statistics.count_miss, score.mode.toLowerCase()),
            judges: newJudge(score.statistics.count_geki, score.statistics.count_300, score.statistics.count_katu, score.statistics.count_100, score.statistics.count_50, score.statistics.count_miss, score.mode.toLowerCase())
        }

        const data = {
            map_density_arr: [],
            map_retry_arr: [],
            map_fail_arr: [],
            mods_arr: score.mods,

            map_background: await readNetImage(score.beatmapset.covers["list@2x"], getExportFileV3Path('beatmap-defaultBG.jpg')),
            //很糊的全图
            star: getExportFileV3Path('object-beatmap-star.png'),
            map_hexagon: getExportFileV3Path('object-beatmap-hexagon.png'),
            map_favorite: getExportFileV3Path('object-beatmap-favorite.png'),
            map_playcount: getExportFileV3Path('object-beatmap-playcount.png'),
            map_status: 'ranked',

            score_rank: score.rank,
            star_rating: score.beatmap.difficulty_rating,
            score: score.score,
            score_acc_progress: Math.floor(score.accuracy * 10000) / 100,

            game_mode: score.mode.toLowerCase(),
            map_status_fav: score.beatmapset.favourite_count,
            map_status_pc: score.beatmapset.play_count,

            map_title_romanized: score.beatmapset.title,
            map_title_unicode: score.beatmapset.title_unicode,
            map_difficulty: score.beatmap.version,
            map_artist_mapper_bid: `${score.beatmapset.artist} // ${score.beatmapset.creator} // ${score.beatmap.id}`,
            map_public_rating: '9.8', //大众评分，就是大家给谱面打的分，结算后往下拉的那个星星就是
            map_retry_percent: '54', //重试率%
            map_fail_percent: '13.2', //失败率%

            score_categorize: '',

            card_A1: card_a1,
            label_data: label_data,
            score_stats: score_stats,
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