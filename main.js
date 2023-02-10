import fs from "fs";
import express from "express";
import formidable from "express-formidable";
import {card_D, card_H} from "./src/card.js";
import {CACHE_PATH, readImage} from "./src/util.js";

/*
//    已经部署在机器上了,提交前请注释掉测试代码
fs.writeFileSync("image/out/card_A1.png", await card_A1());
 */
fs.mkdirSync(CACHE_PATH, {recursive: true});

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

app.post('/card-D', async (req, res) => {
    const f = checkData(req, ["background"]);
    const png = await card_D(f);
    res.set('Content-Type', 'image/png');
    res.send(png);
})

app.post('/card-H', async (req, res) => {
    const f = checkData(req, ["background", "avatar"]);
    const png = await card_H(f);
    res.set('Content-Type', 'image/png');
    res.send(png);
})

app.post('/card-H1', async (req, res) => {
    try {
        const f = checkJsonData(req, ["background", "avatar"]);
        const png = await card_H(f);
        res.set('Content-Type', 'image/png');
        res.send(png);
    } catch (e) {
        res.status(500).send(e.stack);
    }
})

app.listen(process.env["PORT"] | 8555, () => {
    console.log(` ok - http://localhost:${process.env["PORT"] | 8555}\n cache path: ${CACHE_PATH}`);
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