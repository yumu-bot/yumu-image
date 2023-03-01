import fs from "fs";
import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, readImage} from "./src/util.js";
import {panel_C} from "./src/panel/Panel_C.js";
import {panel_D} from "./src/panel/panel_D.js";
import {panel_E} from "./src/panel/panel_E.js";
import {panel_F} from "./src/panel/panel_F.js";
import {panel_H} from "./src/panel/panel_H.js";
import {panel_I} from "./src/panel/panel_I.js";
import {card_D} from "./src/card/cardD.js";
import {card_H} from "./src/card/cardH.js";

//    已经部署在机器上了,提交前请注释掉测试代码
/*
fs.writeFileSync("image/out/card_A1.png", await card_A1());
 */

fs.mkdirSync(CACHE_PATH, {recursive: true});
console.time('F')
fs.writeFileSync("image/out/panel_F.png", await panel_F());
console.timeEnd('F')
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
        const f = checkJsonData(req);
        const png = await panel_D(f);
        res.set('Content-Type', 'image/png');
        res.send(png);
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

app.listen(process.env["PORT"] | 8555, () => {
    console.log(`== Done. ==http://localhost:${process.env["PORT"] | 8555}\n cache path: ${CACHE_PATH}`);
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