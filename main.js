import {
    CACHE_PATH,
    getBrowserInstance,
    getProxyAgent,
    IMG_BUFFER_PATH,
    initPath,
    loggerTime,
    OSU_BUFFER_PATH
} from "./src/util/util.js";
import puppeteer from "puppeteer";
import {WsClient} from "./src/util/websocket.js";
import moment from "moment";
import {panel_S} from "./src/panel/panel_S.js";
import {exportWEBP} from "./src/util/image.js";
import fs from "fs";

initPath();
//这里放测试代码

console.time('S')
fs.writeFileSync("image/out/panel_S.png", await exportWEBP(await panel_S()));
console.timeEnd('S')

// 覆盖默认的 launch 方法
const originalLaunch = puppeteer.launch;
puppeteer.launch = function(options = {}) {
    const newOptions = {
        ...options,
        headless: options.headless === undefined ? 'new' : options.headless
    };
    return originalLaunch.call(this, newOptions);
};

/*

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
    'A16',
    'B1', 'B2', 'B3', 'B4',
    'C', 'C2',
    'D', 'D2', 'D3',
    'E5', 'E6', 'E7', 'E10',
    'F', 'F3',
    'H',
    'J', 'J2',
    'K', 'M', 'N', 'R', 'T', 'U', 'V',
    'Alpha', 'Beta', 'Gamma', 'Delta',
    'Epsilon', 'Epsilon2', 'Zeta',
    'Eta1', 'Eta2', 'Eta3', 'Eta4', 'Theta',
    'MA', 'MA2', 'MD', 'MF', 'ME', 'MI', 'MS', 'MV'
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

 */

process.on('unhandledRejection', (reason) => {
    console.error('未捕获的 Promise 拒绝:', reason);
    // 记录日志，但不让进程死掉
});


const port = process.env.PORT ?? 8388

// 定义所有面板后缀
const panelSuffixes = [
    'A1', 'A2', 'A3', 'A4', 'A5',
    'A6', 'A7', 'A8', 'A9', 'A10',
    'A11', 'A12', 'A13', 'A14', 'A15',
    'A16',
    'B1', 'B2', 'B3', 'B4',
    'C', 'C2',
    'D', 'D2', 'D3',
    'E5', 'E6', 'E7', 'E10',
    'F', 'F3',
    'H',
    'J', 'J2',
    'K', 'M', 'M2', 'N',
    'R', 'S', 'T', 'U',
    'V', 'V2',
    'Alpha', 'Beta', 'Gamma', 'Delta',
    'Epsilon', 'Epsilon2', 'Zeta',
    'Eta1', 'Eta2', 'Eta3', 'Eta4', 'Theta',
    'MA', 'MA2', 'MD', 'MF', 'ME', 'MI', 'MS', 'MV'
];

const panelHandlers = new Map();

async function initPanels() {
    const loadPromises = panelSuffixes.map(async (suffix) => {
        try {
            const module = await import(`./src/panel/panel_${suffix}.js`);

            if (module.router) {
                panelHandlers.set(`panel_${suffix}`, adaptHandler(module.router));
            }
            if (module.router_svg) {
                panelHandlers.set(`panel_${suffix}/svg`, adaptHandler(module.router_svg));
            }
        } catch (error) {
            console.error(`Failed to load panel_${suffix}:`, error);
        }
    });

    await Promise.all(loadPromises);
    console.log(`panel loader succeed! ${panelHandlers.size / 2} loaded.`);
}

function adaptHandler(originalRouter) {
    return async (payload) => {
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("渲染任务超时未响应，强制熔断释放内存"));
            }, 30000);

            let isErrorStatus = false;
            let currentStatusCode = 200; // 记录当前的状态码

            const req = {
                body: payload,
                fields: payload
            };

            const res = {
                set: () => res,
                setHeader: () => res,
                status: (code) => {
                    currentStatusCode = code;
                    if (code >= 400) {
                        console.warn(`渲染状态码警报: ${code}`);
                        isErrorStatus = true;
                    }
                    return res;
                },
                send: (data) => {
                    clearTimeout(timer);
                    if (isErrorStatus) {
                        const errorMsg = typeof data === 'object' ? (data.message || data.error || JSON.stringify(data)) : String(data);
                        reject(new Error(`[HTTP ${currentStatusCode}] ${errorMsg}`));
                    } else {
                        resolve(data);
                    }
                },
                json: (data) => {
                    clearTimeout(timer);
                    if (isErrorStatus) {
                        const errorMsg = data.message || data.error || JSON.stringify(data);
                        reject(new Error(`[HTTP ${currentStatusCode}] ${errorMsg}`));
                    } else {
                        resolve(data);
                    }
                },
                end: () => {
                    clearTimeout(timer);
                    if (isErrorStatus) {
                        reject(new Error(`[HTTP ${currentStatusCode}] 异常结束且未返回具体数据`));
                    } else {
                        resolve(null);
                    }
                }
            };

            try {
                await originalRouter(req, res);
            } catch (err) {
                clearTimeout(timer);
                reject(err);
            }
        });
    };
}

const MAX_CONCURRENT = 1;
let currentTasks = 0;
const taskQueue = [];
const MAX_QUEUE_SIZE = 10

async function start() {
    // 每个进程都加载渲染器
    await initPanels();
    console.log(loggerTime(`进程 [${process.pid}] 渲染器就绪`));

    // 每个进程都作为客户端连接 Kotlin
    const client = new WsClient(`ws://localhost:${port}/render-ws`);

    client.on('open', () => {
        console.log(loggerTime(`[WS] 进程 [${process.pid}] 已连接到 Kotlin 服务端`));
        client.send({
            type: 'AUTH',
            pid: process.pid
        });

        if (client.heartbeatTimer) {
            clearInterval(client.heartbeatTimer);
        }

        client.heartbeatTimer = setInterval(() => {
            if (client.ws && client.ws.readyState === 1) {
                // 发送一个自定义的心跳包，确保服务端接收并重置超时计数
                client.send({ type: 'HEARTBEAT', pid: process.pid, timestamp: Date.now() });
            }

        }, 25000);
    });


    async function processQueue() {
        if (currentTasks >= MAX_CONCURRENT || taskQueue.length === 0) return;

        currentTasks++;
        const { msg } = taskQueue.shift();

        try {
            const handler = panelHandlers.get(msg.path);
            if (!handler) throw new Error(`找不到对应的面板路由: ${msg.path}`);

            let result = await handler(msg.payload);

            if (!Buffer.isBuffer(result)) {
                if (result && typeof result === 'object' && (result.error || result.status !== 'ok')) {
                    throw new Error(result.error || result.message || JSON.stringify(result));
                }
                // 如果是正常的 JSON 响应，将其转换为 Buffer，防止 Buffer.concat 崩溃
                result = Buffer.from(JSON.stringify(result || {}), 'utf-8');
            }

            // 合并 Buffer (如果是图片)
            const idBuffer = Buffer.from(msg.messageId, 'utf-8');
            const finalBuffer = Buffer.concat([idBuffer, result]);

            // 检查缓冲区压力
            if (client.ws.bufferedAmount > 30 * 1024 * 1024) {
                console.error(loggerTime("[WS] 缓冲区过载，丢弃该任务防止崩溃"));
            } else {
                client.ws.send(finalBuffer);
            }
        } catch (err) {
            client.send({ messageId: msg.messageId, status: 'error', error: err.message });
        } finally {
            currentTasks--;
            msg.payload = null;
            setTimeout(processQueue, 50);
        }
    }

    client.on('message', (data) => {
        if (taskQueue.length >= MAX_QUEUE_SIZE) {
            console.warn(loggerTime("[WS] 任务队列已满，拒绝接收新任务"));
            return;
        }

        const msg = JSON.parse(data.toString());
        if (!msg.messageId) return;

        taskQueue.push({ msg });
        processQueue();
    });

    client.on('close', () => {
        if (client.heartbeatTimer) clearInterval(client.heartbeatTimer);
        client.ws.removeAllListeners();
        client.ws = null;
    })
}

await start();

await getBrowserInstance(true)

console.log(`\n== YumuBot 绘图模块初始化成功。 ==\n当前时间：${moment(moment.now()).format("YYYY-MM-DD HH-mm-ss")}\nWS 监听端口: ${port}\n`);
console.log("主缓存目录: ", CACHE_PATH);
console.log("图像缓存: ", IMG_BUFFER_PATH);
console.log("谱面文件缓存: ", OSU_BUFFER_PATH);
console.log("当前代理: ", getProxyAgent()?.proxy?.host ?? 'undefined');