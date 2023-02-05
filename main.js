import fs from "fs";
import express from "express";
import formidable from "express-formidable";
import {card_A1, card_D, card_H, Panel_H} from "./src/card.js";
import {CACHE_PATH, getFlagSvg, readImage} from "./src/util.js";

console.time("1")
fs.writeFileSync("image/out/cardA1.png", await card_A1());
console.timeEnd("1")

console.time("2")
fs.writeFileSync("image/out/cardD.png", await card_D());
console.timeEnd("2")

console.time("3")
fs.writeFileSync("image/out/cardH.png", await card_H());
console.timeEnd("3")

console.time("4")
fs.writeFileSync("image/out/panel_H.png", await Panel_H());
console.timeEnd("4")

console.time("5")
fs.writeFileSync("image/out/cn.svg", await getFlagSvg("CN"));
console.timeEnd("5")

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