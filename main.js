import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, getExportFileV3Path, initPath, readImage, readNetImage, SaveFiles} from "./src/util.js";
import {panel_D} from "./src/panel/panel_D.js";
import {panel_E} from "./src/panel/panel_E.js";
import {panel_H} from "./src/panel/panel_H.js";

initPath();
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
app.post('/panel_E', async (req, res) => {
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
    const saveFile = new SaveFiles();
    try {
        let user = req.fields?.user;
        const card_a1 = {
            background: saveFile.save(await readNetImage(user.cover_url)),
            avatar: saveFile.save(await readNetImage(user.avatar_url)),
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
            const cover = saveFile.save(await readNetImage(re.beatmapset.covers.cover));
            let d = {
                map_cover: cover,
                map_background: cover,
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
                map_background: saveFile.save(await readNetImage(bp.beatmapset.covers.cover)),
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
            bonus_pp: 1000 / 2.4 * (1 - 0.9994 ** user?.beatmap_playcounts_count), // 416.6667
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
    } finally {
        saveFile.remove();
    }
    res.end();
})

app.post('/panel_H', async (req, res) => {
    try {
        const f = checkJsonData(req);
        const png = await panel_H(f);
        res.set('Content-Type', 'image/png');
        res.send(png);
    } catch (e) {
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