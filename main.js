import {
    CACHE_PATH, EXPORT_FILE_V3, getProxyAgent,
    IMG_BUFFER_PATH,
    initPath,
    loggerTime,
    OSU_BUFFER_PATH
} from "./src/util/util.js";
import {WsClient} from "./src/util/websocket.js";
import {closeRenderer} from "./src/util/svgRenderer.js";
import {getChromeProfileRoot, cleanupStaleChromeProfiles} from "./src/util/chromeProfile.js";
import moment from "moment";

initPath();

process.on('unhandledRejection', (reason) => {
    console.error('未捕获的 Promise 拒绝:', reason);
});

const port = process.env.PORT ?? 8388

const panelSuffixes = [
    'A1', 'A2', 'A3', 'A4', 'A5',
    'A6', 'A7', 'A8', 'A9', 'A10',
    'A11', 'A12', 'A13', 'A14', 'A15',
    'A16',
    'B1', 'B2', 'B3', 'B4',
    'C', 'C2',
    'D', 'D2', 'D3',
    'E5', 'E6', 'E7', 'E10',
    'F', 'F3', 'F4',
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
                panelHandlers.set(`panel_${suffix}`, adaptHandler(module.router, suffix));
            }
            if (module.router_svg) {
                panelHandlers.set(`panel_${suffix}/svg`, adaptHandler(module.router_svg, suffix));
            }
        } catch (error) {
            console.error(`Failed to load panel_${suffix}:`, error);
        }
    });

    await Promise.all(loadPromises);
    console.log(`panel loader succeed! ${panelHandlers.size / 2} loaded.`);
}

function adaptHandler(originalRouter, suffix) {
    return async (payload) => {
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`${suffix}：渲染任务超时未响应，强制熔断释放内存`));
            }, 30000);

            let isErrorStatus = false;
            let currentStatusCode = 200;

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
                        console.warn(`${suffix}：渲染状态码警报: ${code}`);
                        isErrorStatus = true;
                    }
                    return res;
                },
                send: (data) => {
                    clearTimeout(timer);
                    if (isErrorStatus) {
                        const errorMsg = typeof data === 'object' ? (data.message || data.error || JSON.stringify(data)) : String(data);
                        reject(new Error(`${suffix}：[HTTP ${currentStatusCode}] ${errorMsg}`));
                    } else {
                        resolve(data);
                    }
                },
                json: (data) => {
                    clearTimeout(timer);
                    if (isErrorStatus) {
                        const errorMsg = data.message || data.error || JSON.stringify(data);
                        reject(new Error(`${suffix}：[HTTP ${currentStatusCode}] ${errorMsg}`));
                    } else {
                        resolve(data);
                    }
                },
                end: () => {
                    clearTimeout(timer);
                    if (isErrorStatus) {
                        reject(new Error(`${suffix}：[HTTP ${currentStatusCode}] 异常结束且未返回具体数据`));
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

const MAX_CONCURRENT = Math.max(1, Number(process.env.MAX_CONCURRENT) || 1);
const MAX_QUEUE_SIZE = Math.max(1, Number(process.env.MAX_QUEUE_SIZE) || 10);
const SHUTDOWN_DRAIN_TIMEOUT_MS = Math.max(1000, Number(process.env.SHUTDOWN_DRAIN_TIMEOUT) || 15000);
const SHUTDOWN_CLOSE_TIMEOUT_MS = Math.max(1000, Number(process.env.SHUTDOWN_CLOSE_TIMEOUT) || 15000);

let currentTasks = 0;
const taskQueue = [];
let wsClient = null;
let shuttingDown = false;
let shutdownPromise = null;

async function gracefulShutdown(code = 0, reason = "unknown") {
    if (shutdownPromise) return shutdownPromise;

    shuttingDown = true;
    console.log(loggerTime(`[退出] 收到 ${reason}，停止接收新任务...`));

    shutdownPromise = (async () => {
        let exitCode = code;

        try {
            while (taskQueue.length > 0) {
                const {msg} = taskQueue.shift();
                try {
                    wsClient?.send({
                        messageId: msg.messageId,
                        status: 'error',
                        error: '服务正在退出，任务已取消',
                    });
                } catch {}
            }

            const deadline = Date.now() + SHUTDOWN_DRAIN_TIMEOUT_MS;
            while (currentTasks > 0 && Date.now() < deadline) {
                await Bun.sleep(50);
            }

            if (currentTasks > 0) {
                console.warn(loggerTime(`[退出] 等待在途任务超时，仍有 ${currentTasks} 个任务未结束`));
            }

            try {
                if (wsClient?.heartbeatTimer) {
                    clearInterval(wsClient.heartbeatTimer);
                    wsClient.heartbeatTimer = null;
                }
                wsClient?.close();
            } catch (err) {
                console.warn(loggerTime(`[退出] 关闭 WS 失败: ${err?.message || err}`));
            }
            wsClient = null;

            const closeResult = await Promise.race([
                closeRenderer()
                    .then(() => "closed")
                    .catch((err) => {
                        console.error(loggerTime(`[退出] 关闭渲染器失败: ${err?.stack || err}`));
                        return "closed";
                    }),
                Bun.sleep(SHUTDOWN_CLOSE_TIMEOUT_MS).then(() => "timeout"),
            ]);

            if (closeResult === "timeout") {
                console.warn(loggerTime(`[退出] 关闭渲染器超时 (${SHUTDOWN_CLOSE_TIMEOUT_MS}ms)，强制退出`));
            }
        } catch (err) {
            console.error(loggerTime(`[退出] 清理过程异常: ${err?.stack || err}`));
            if (exitCode === 0) exitCode = 1;
        } finally {
            console.log(loggerTime(`[退出] 进程 [${process.pid}] 退出，退出码 ${exitCode}`));
            process.exit(exitCode);
        }
    })();

    return shutdownPromise;
}

process.on('SIGINT', () => {
    void gracefulShutdown(0, 'SIGINT');
});
process.on('SIGTERM', () => {
    void gracefulShutdown(0, 'SIGTERM');
});
process.on('uncaughtException', (err) => {
    console.error(loggerTime('[进程崩溃] 捕获到未处理的异常:'), err);
    void gracefulShutdown(1, 'uncaughtException');
});

async function start() {
    cleanupStaleChromeProfiles();
    if (shuttingDown) return;

    await initPanels();
    if (shuttingDown) return;

    console.log(loggerTime(`进程 [${process.pid}] 渲染器就绪`));

    const client = wsClient = new WsClient(`ws://localhost:${port}/render-ws`);

    client.on('open', () => {
        if (shuttingDown) {
            client.close();
            return;
        }

        console.log(loggerTime(`[WS] 进程 [${process.pid}] 已连接到 Kotlin 服务端`));
        client.send({
            type: 'AUTH',
            pid: process.pid
        });

        if (client.heartbeatTimer) {
            clearInterval(client.heartbeatTimer);
        }

        client.heartbeatTimer = setInterval(() => {
            if (shuttingDown) return;

            if (client.ws && client.ws.readyState === WebSocket.OPEN) {
                client.send({type: 'HEARTBEAT', pid: process.pid, timestamp: Date.now()});
            }

        }, 25000);
    });

    async function processQueue() {
        if (shuttingDown || currentTasks >= MAX_CONCURRENT || taskQueue.length === 0) return;

        currentTasks++;
        const {msg} = taskQueue.shift();

        try {
            const handler = panelHandlers.get(msg.path);
            if (!handler) throw new Error(`找不到对应的面板路由: ${msg.path}`);

            let result = await handler(msg.payload);

            if (!Buffer.isBuffer(result)) {
                if (result && typeof result === 'object' && (result.error || result.status !== 'ok')) {
                    throw new Error(result.error || result.message || JSON.stringify(result));
                }
                result = Buffer.from(JSON.stringify(result || {}), 'utf-8');
            }

            const idBuffer = Buffer.from(msg.messageId, 'utf-8');
            const finalBuffer = Buffer.concat([idBuffer, result]);

            const ws = client.ws;
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                console.error(loggerTime("[WS] 连接已断开，丢弃该任务结果"));
            } else if (ws.bufferedAmount > 30 * 1024 * 1024) {
                console.error(loggerTime("[WS] 缓冲区过载，丢弃该任务防止崩溃"));
            } else {
                ws.send(finalBuffer);
            }
        } catch (err) {
            client.send({messageId: msg.messageId, status: 'error', error: err.message});
        } finally {
            currentTasks--;
            msg.payload = null;
            if (!shuttingDown) {
                setTimeout(processQueue, 50);
            }
        }
    }

    client.on('message', (data) => {
        if (shuttingDown) return;

        let msg;
        try {
            msg = JSON.parse(data.toString());
        } catch (err) {
            console.warn(loggerTime(`[WS] 无法解析消息: ${err?.message || err}`));
            return;
        }

        if (!msg?.messageId) return;

        if (taskQueue.length >= MAX_QUEUE_SIZE) {
            console.warn(loggerTime("[WS] 任务队列已满，拒绝接收新任务"));
            client.send({messageId: msg.messageId, status: 'error', error: '任务队列已满，请稍后重试'});
            return;
        }

        taskQueue.push({msg});
        processQueue();
    });
}

try {
    await start();
} catch (err) {
    console.error(loggerTime(`[启动] 初始化失败: ${err?.stack || err}`));
    await gracefulShutdown(1, 'startup');
}

if (!shuttingDown) {
    console.log(`\n== YumuBot 绘图模块初始化成功。 ==\n当前时间：${moment(moment.now()).format("YYYY-MM-DD HH-mm-ss")}\nWS 监听端口: ${port}\n`);
    console.log("静态资源目录: ", EXPORT_FILE_V3);
    console.log("主缓存目录: ", CACHE_PATH);
    console.log("图像缓存: ", IMG_BUFFER_PATH);
    console.log("谱面文件缓存: ", OSU_BUFFER_PATH);
    console.log("Chromium profile 根目录: ", getChromeProfileRoot());
    console.log("当前代理: ", getProxyAgent()?.proxy?.host ?? 'undefined');
}
