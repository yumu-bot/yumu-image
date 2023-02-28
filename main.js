import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, readImage, readNetImage, SaveFiles} from "./src/util.js";
import {panel_E} from "./src/panel/panel_E.js";
import {panel_H} from "./src/panel/panel_H.js";

const app = express();
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: CACHE_PATH,
    autoClean: true,
    multiples: true,
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
    try {
        console.log(req.fields);
        let data = req.fields;
        const f = new SaveFiles();
        const card_a1 = {
            background: f.save(await readNetImage(data.cover_url)),
            avatar: f.save(await readNetImage(data.avatar_url)),
            sub_icon1: data['support_level'] > 0 ? 'PanelObject/A_CardA1_SubIcon1.png' : '',
            sub_icon2: '',
            name: data['username'],
            rank_global: data['globalRank'],
            rank_country: data['countryRank'],
            country: data?.country['countryCode'],
            acc: data['accuracy'],
            level: data['levelProgress'],
            progress: data['accuracy'],
            pp: data['pp'],
        };

        const label_data = {}

        const png = readImage("");
        // res.set('Content-Type', 'image/png');
        res.send("ok");
    } catch (e) {
        res.status(500).send(e.stack);
    }
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
        ...req.fields,
        ...fs,
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