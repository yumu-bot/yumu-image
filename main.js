import fs from "fs";
import express from "express";
import formidable from "express-formidable";
import {card_D, card_H, card_A1} from "./src/card.js";
import {readImage} from "./src/util.js";
import {label_E} from "./src/component.js";
import {panel_E, panel_I} from "./src/panel.js"

fs.writeFileSync("image/out/card_A1.png", await card_A1());
fs.writeFileSync("image/out/card_D.png", await card_D());
fs.writeFileSync("image/out/card_H.png", await card_H());

fs.writeFileSync("image/out/label_E.png", await label_E());

fs.writeFileSync("image/out/panel_E.png", await panel_E());
fs.writeFileSync("image/out/panel_I.png", await panel_I());

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
    const f = checkJsonData(req, ["background", "avatar"]);
    const png = await card_H(f);
    res.set('Content-Type', 'image/png');
    console.log(f);
    res.send(png);
})

app.listen(8555, () => {
    console.log('ok - http://localhost:8555');
    console.log(CACHE_PATH)
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

//  form data: json text{ xxx: xxx} img: file ...
function checkJsonData(req) {
    let json = JSON.parse(req.fields['json']);
    let files = json['file']
    if (files) {
        for (const fileName of Object.keys(files)) {
            if (req.files[files[fileName]]) {
                json[fileName] = readImage(req.files[files[fileName]].path);
            }
        }
    }
    return {
        ...json,
    };
}