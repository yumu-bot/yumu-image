import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, initPath, readImage} from "./src/util.js";
import {router as PanelA1Router} from "./src/panel/panel_A1.js";
import {router as PanelA2Router} from "./src/panel/panel_A2.js";
import {router as PanelA3Router} from "./src/panel/panel_A3.js";
import {router as PanelA4Router} from "./src/panel/panel_A4.js";
import {router as PanelBRouter} from "./src/panel/panel_B.js";
import {router as PanelB2Router} from "./src/panel/panel_B2.js";
import {router as PanelCRouter} from "./src/panel/panel_C.js";
import {router as PanelDRouter} from "./src/panel/panel_D.js";
import {router as PanelERouter} from "./src/panel/panel_E.js";
import {router as PanelFRouter} from "./src/panel/panel_F.js";
import {router as PanelJRouter} from "./src/panel/panel_J.js";

import {router as panelAlphaRouter} from "./src/panel/panel_Alpha.js"; //drawLine
import {router as panelBetaRouter} from "./src/panel/panel_Beta.js"; //scoreSpecial
import {router as panelGammaRouter} from "./src/panel/panel_Gamma.js"; //怎么，看不过去密集的设计？

import {router as MarkdownRouter} from "./src/markdown.js";
import {router as GetMapAttrRouter} from "./src/mapAttributes.js";

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
app.post('/panel_B', PanelBRouter);
app.post('/panel_B2', PanelB2Router);
app.post('/panel_C', PanelCRouter);
app.post('/panel_D', PanelDRouter);
app.post('/panel_E', PanelERouter);
app.post('/panel_F', PanelFRouter);
app.post('/panel_J', PanelJRouter);

app.post('/panel_Alpha', panelAlphaRouter);
app.post('/panel_Beta', panelBetaRouter);
app.post('/panel_Gamma', panelGammaRouter);

app.post('/md', MarkdownRouter);
app.post('/attr', GetMapAttrRouter);

app.post('/testApi', async (req, res) => {
    console.log(req.fields)
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
