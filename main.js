import fs from "fs";
import express from "express";
import os from "os";
import formidable from "express-formidable";
import {cardD, cardH} from "./src/card.js";
import {readImage} from "./src/util.js";

fs.writeFileSync("image/out/cardD.png", await cardD());
fs.writeFileSync("image/out/cardH.png", await cardH());

const app = express();
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: os.tmpdir(),
    autoClean: true,
    multiples: true,
}));

app.get('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    console.log("-----")
    next();
})
app.get('/', (req, res) => {
    res.send("hi");
})

app.post('/convert', async (req, res) => {
    let form = req.fields;
    let bg = [];
    if (req.files["bg"]){
        console.log(req.files['bg'].path);
        bg = readImage(req.files['bg'].path);
    }

    const f = {
        ...form,
        background: bg,
    }
    const png = await cardD(f);
    res.set('Content-Type', 'image/png');
    res.send(png);
})

app.listen(8555, () => {
    console.log('ok - http://localhost:8555');
    console.log(os.tmpdir())
})