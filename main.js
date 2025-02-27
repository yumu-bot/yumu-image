import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, deleteBeatMapFromDatabase, initPath} from "./src/util/util.js";
import {router as PanelA1Router} from "./src/panel/panel_A1.js";
import {router as PanelA2Router} from "./src/panel/panel_A2.js";
import {router as PanelA3Router} from "./src/panel/panel_A3.js";
import {router as PanelA4Router} from "./src/panel/panel_A4.js";
import {router as PanelA5Router} from "./src/panel/panel_A5.js";
import {router as PanelA6Router} from "./src/panel/panel_A6.js";
import {router as PanelA7Router} from "./src/panel/panel_A7.js";
import {router as PanelA8Router} from "./src/panel/panel_A8.js";
import {router as PanelA9Router} from "./src/panel/panel_A9.js";
import {router as PanelB1Router} from "./src/panel/panel_B1.js";
import {router as PanelB2Router} from "./src/panel/panel_B2.js";
import {router as PanelB3Router} from "./src/panel/panel_B3.js";
import {router as PanelCRouter} from "./src/panel/panel_C.js";
import {router as PanelC2Router} from "./src/panel/panel_C2.js";
import {router as PanelDRouter} from "./src/panel/panel_D.js";
import {router as PanelD2Router} from "./src/panel/panel_D2.js";
import {router as PanelE5Router} from "./src/panel/panel_E5.js";
import {router as PanelE6Router} from "./src/panel/panel_E6.js";
import {router as PanelE7Router} from "./src/panel/panel_E7.js";
import {router as PanelFRouter} from "./src/panel/panel_F.js";
import {router as PanelF3Router} from "./src/panel/panel_F3.js";
import {router as PanelHRouter} from "./src/panel/panel_H.js";
import {router as PanelJRouter} from "./src/panel/panel_J.js";
import {router as PanelJ2Router} from "./src/panel/panel_J2.js";
import {router as PanelKRouter} from "./src/panel/panel_K.js";
import {router as PanelMRouter} from "./src/panel/panel_M.js";
import {router as PanelNRouter} from "./src/panel/panel_N.js";

import {router as panelAlphaRouter} from "./src/panel/panel_Alpha.js";
import {router as panelBetaRouter} from "./src/panel/panel_Beta.js";
import {router as panelGammaRouter} from "./src/panel/panel_Gamma.js";
import {router as panelDeltaRouter} from "./src/panel/panel_Delta.js";
import {router as panelEpsilonRouter} from "./src/panel/panel_Epsilon.js";
import {router as panelZetaRouter} from "./src/panel/panel_Zeta.js";
import {router as MarkdownRouter} from "./src/panel/markdown.js";
import {router as GetMapAttrRouter} from "./src/panel/mapAttributes.js";

import {router as PanelMARouter} from "./src/panel/panel_MA.js";
import {router as PanelMA2Router} from "./src/panel/panel_MA2.js";
import {router as PanelMDRouter} from "./src/panel/panel_MD.js";
import {router as PanelMFRouter} from "./src/panel/panel_MF.js";
import {router as PanelMERouter} from "./src/panel/panel_ME.js";
import {router as PanelMSRouter} from "./src/panel/panel_MS.js";


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

app.post('/panel_A1', PanelA1Router);
app.post('/panel_A2', PanelA2Router);
app.post('/panel_A3', PanelA3Router);
app.post('/panel_A4', PanelA4Router);
app.post('/panel_A5', PanelA5Router);
app.post('/panel_A6', PanelA6Router);
app.post('/panel_A7', PanelA7Router);
app.post('/panel_A8', PanelA8Router);
app.post('/panel_A9', PanelA9Router);
app.post('/panel_B1', PanelB1Router);
app.post('/panel_B2', PanelB2Router);
app.post('/panel_B3', PanelB3Router);
app.post('/panel_C', PanelCRouter);
app.post('/panel_C2', PanelC2Router);
app.post('/panel_D', PanelDRouter);
app.post('/panel_D2', PanelD2Router);
app.post('/panel_E5', PanelE5Router);
app.post('/panel_E6', PanelE6Router);
app.post('/panel_E7', PanelE7Router);
app.post('/panel_F', PanelFRouter);
app.post('/panel_F3', PanelF3Router);
app.post('/panel_H', PanelHRouter);
app.post('/panel_J', PanelJRouter);
app.post('/panel_J2', PanelJ2Router);
app.post('/panel_K', PanelKRouter);
app.post('/panel_M', PanelMRouter);
app.post('/panel_N', PanelNRouter);

app.post('/panel_Alpha', panelAlphaRouter);
app.post('/panel_Beta', panelBetaRouter);
app.post('/panel_Gamma', panelGammaRouter);
app.post('/panel_Delta', panelDeltaRouter);
app.post('/panel_Epsilon', panelEpsilonRouter);
app.post('/panel_Zeta', panelZetaRouter);

app.post('/panel_MA', PanelMARouter);
app.post('/panel_MA2', PanelMA2Router);
app.post('/panel_MD', PanelMDRouter);
app.post('/panel_MF', PanelMFRouter);
app.post('/panel_ME', PanelMERouter);
app.post('/panel_MS', PanelMSRouter);

app.post('/md', MarkdownRouter);
app.post('/attr', GetMapAttrRouter);

app.post('/del', (req, res) => {
    try {
        const bid = req.fields['bid'];
        deleteBeatMapFromDatabase(bid)
    } catch (e) {
        res.status(500).send({status: e.message})
    }
    res.status(200).send({status: 'ok'})
});

app.post('/testApi', async (req, res) => {
    console.log(req.fields)
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send({
        status: "ok",
    });
})

app.listen(process.env.PORT, () => {
    console.log(`\n== YumuBot 绘图模块初始化成功。 ==\n监听端口: ${process.env.PORT}\n`);
})

/*

// form: data:text ... img:file
function checkData(req, files = ['']) {
    let fs = {};
    for (const file of files) {
        if (req.files[file]) {
            fs[file] = readFile(req.files[file].path);
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

 */
