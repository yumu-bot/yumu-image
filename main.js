
import {CACHE_PATH, IMG_BUFFER_PATH, initPath, OSU_BUFFER_PATH} from "./src/util/util.js";
import puppeteer from "puppeteer";
import {WsClient} from "./src/util/websocket.js";
import moment from "moment";

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
    'K', 'M', 'N', 'R', 'T', 'U', 'V',
    'Alpha', 'Beta', 'Gamma', 'Delta',
    'Epsilon', 'Epsilon2', 'Zeta',
    'Eta1', 'Eta2', 'Eta3', 'Eta4', 'Theta',
    'MA', 'MA2', 'MD', 'MF', 'ME', 'MI', 'MS', 'MV'
];

const panelHandlers = new Map();

async function initPanels() {
    for (const suffix of panelSuffixes) {
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
    }
}

function adaptHandler(originalRouter) {
    return async (payload) => {
        return new Promise(async (resolve, reject) => {
            const req = {
                body: payload,
                fields: payload
            };

            const res = {
                set: () => res,
                setHeader: () => res,

                status: (code) => {
                    if (code >= 400) console.warn(`渲染状态码警报: ${code}`);
                    return res;
                },

                // 成功返回数据
                send: (data) => resolve(data),
                json: (data) => resolve(data),

                end: () => {
                }
            };

            try {
                await originalRouter(req, res);
            } catch (err) {
                reject(err);
            }
        });
    };
}

async function start() {
    // 每个进程都加载渲染器
    await initPanels();
    console.log(`进程 [${process.pid}] 渲染器就绪`);

    // 每个进程都作为客户端连接 Kotlin
    const client = new WsClient(`ws://localhost:${port}/render-ws`);

    client.on('open', () => {
        console.log(`进程 [${process.pid}] 已连接到 Kotlin 服务端`);
        client.send({
            type: 'AUTH',
            pid: process.pid
        });

        // --- 新增：JS 主动心跳 ---
        // 每 25 秒主动发一次心跳（略小于服务端的 30s，确保不超时）
        if (client.heartbeatTimer) {
            clearInterval(client.heartbeatTimer);
        }

        client.heartbeatTimer = setInterval(() => {
            if (client.ws && client.ws.readyState === 1) { // 1 代表 OPEN
                // 发送一个自定义的心跳包，确保服务端接收并重置超时计数
                client.send({ type: 'HEARTBEAT', pid: process.pid, timestamp: Date.now() });
            }

        }, 25000);
    });

    client.on('message', async (data) => {
        const msg = JSON.parse(data.toString());

        if (!msg.messageId) return;

        try {
            const handler = panelHandlers.get(msg.path);
            const result = await handler(msg.payload);

            // 1. 将 UUID 转为 Buffer (36字节)
            const idBuffer = Buffer.from(msg.messageId, 'utf-8');

            // 2. 合并：[36字节UUID][图片数据]
            const finalBuffer = Buffer.concat([idBuffer, result]);

            // 3. 直接通过 WebSocket 发送二进制 (ws 库会自动识别 Buffer 为 binary frame)
            client.ws.send(finalBuffer);
        } catch (err) {
            // 如果出错，依然通过 JSON 发送错误信息
            client.send({ messageId: msg.messageId, status: 'error', error: err.message });
        }
    });

    client.on('close', () => {
        if (client.heartbeatTimer) clearInterval(client.heartbeatTimer);
        client.ws.removeAllListeners();
        client.ws = null;
    })
}

await start();

console.log(`\n== YumuBot 绘图模块初始化成功。 ==\n当前时间：${moment(moment.now()).format("YYYY-MM-DD HH-mm-ss")}\nWS 监听端口: ${port}\n`);
console.log("主缓存目录: ", CACHE_PATH);
console.log("图像缓存: ", IMG_BUFFER_PATH);
console.log("谱面文件缓存: ", OSU_BUFFER_PATH);