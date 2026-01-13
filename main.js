import express from "express";
import formidable from "express-formidable";
import {CACHE_PATH, deleteBeatMapFromDatabase, initPath, OSU_BUFFER_PATH, IMG_BUFFER_PATH} from "./src/util/util.js";
import {router as MarkdownRouter} from "./src/panel/markdown.js";
import moment from "moment";
import puppeteer from "puppeteer";

initPath();
//这里放测试代码

// 覆盖默认的 launch 方法
const originalLaunch = puppeteer.launch;
puppeteer.launch = function(options = {}) {
    const newOptions = {
        ...options,
        headless: options.headless === undefined ? 'new' : options.headless
    };
    return originalLaunch.call(this, newOptions);
};

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

// panel

app.post('/md', MarkdownRouter);
// app.post('/attr', GetMapAttrRouter);

app.post('/del', (req, res) => {
    try {
        const bid = req.fields['bid'];
        deleteBeatMapFromDatabase(bid)
    } catch (e) {
        res.status(500).send({status: e.message})
    }
    res.status(200).send({status: 'ok'})
});

app.post('/panel_test', async (req, res) => {
    console.log(req.fields)
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send({
        status: "ok",
    });
})

// 定义所有面板后缀
const panelSuffixes = [
    'A1', 'A2', 'A3', 'A4', 'A5',
    'A6', 'A7', 'A8', 'A9', 'A10',
    'A11', 'A12', 'A13', 'A14', 'A15',
    'B1', 'B2', 'B3',
    'C', 'C2',
    'D', 'D2', 'D3',
    'E5', 'E6', 'E7', 'E10',
    'F', 'F3',
    'H',
    'J', 'J2',
    'K', 'M', 'N', 'T', 'U',
    'Alpha', 'Beta', 'Gamma', 'Delta',
    'Epsilon', 'Epsilon2', 'Zeta',
    'Eta1', 'Eta2', 'Eta3', 'Eta4', 'Theta',
    'MA', 'MA2', 'MD', 'MF', 'ME', 'MI', 'MS'
];

// 批量导入和注册
panelSuffixes.forEach(suffix => {
    import(`./src/panel/panel_${suffix}.js`)
        .then(module => {
            app.post(`/panel_${suffix}`, module.router);
        })
        .catch(error => {
            console.error(`Failed to load panel_${suffix}:`, error);
        });
});

// 注册 svg
panelSuffixes.forEach(suffix => {
    import(`./src/panel/panel_${suffix}.js`)
        .then(module => {
            app.post(`/panel_${suffix}/svg`, module.router_svg);
        })
        .catch(error => {
            console.error(`Failed to load panel_${suffix}:`, error);
        });
});

const port = process.env.PORT ?? 1611

app.listen(port, () => {
    console.log(`\n== YumuBot 绘图模块初始化成功。 ==\n当前时间：${moment(moment.now()).format("YYYY-MM-DD HH-mm-ss")}\n监听端口: ${port}\n`);
    console.log("主缓存目录: ", CACHE_PATH);
    console.log("图像缓存: ", IMG_BUFFER_PATH);
    console.log("谱面文件缓存: ", OSU_BUFFER_PATH);
})
