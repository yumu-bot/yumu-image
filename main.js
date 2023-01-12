import fs from "fs";
import express from 'express';
import axios from "axios";
import {cardD, cardH} from "./src/card.js";

fs.writeFileSync("image/out/cardD.png", await cardD());
fs.writeFileSync("image/out/cardH.png", await cardH());

const app = express();

app.get('/', (req, res, next) => {
    res.send("hi");
})

app.get('/convert', async (req, res, next) => {
    let bg = await axios.get('https://assets.ppy.sh/beatmaps/1759729/covers/cover.jpg?1653987125', {responseType: 'arraybuffer'});
    const f = {
        background: bg.data,
        title: "Zan'ei",
        artist: 'kakichoco // Lasse',
        info: '[Illusion] - b3601629',
        mod: 'NM',
        star_b: '6',
        star_m: '.23*',
    }
    const png = await cardD(f);
    res.set('Content-Type', 'image/png');
    res.send(png);
})

app.listen(8555, () => {
    console.log('ok');
})