import { createClient } from "redis";
import { LRUCache } from "lru-cache";

const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

// 1. 初始化本地内存
const localCache = new LRUCache({
    max: 50000,
    maxSize: 20 * 1024 * 1024,
    sizeCalculation: (value, key) => String(key).length + String(value).length,
    ttl: 7 * 60 * 60 * 1000
});

let redisClient = null;
let useRedis = false;
let lastLogStatus = null; // 用于防止重复打印相同日志的标记位

// 封装一个安静的日志工具，相同状态只打印一次
function logOnce(status, type, message) {
    if (lastLogStatus !== status) {
        console[type](message);
        lastLogStatus = status;
    }
}

// 2. 初始化 Redis
async function initCache() {
    redisClient = createClient({
        url: `redis://127.0.0.1:${REDIS_PORT}`,
        socket: {
            // 【优化】指数退避重连策略，且完全不打印任何重试 log
            reconnectStrategy: (retries) => {
                // 随着失败次数增加，间隔拉长：5s, 10s, 20s, 40s... 最大 10 min重试一次
                return Math.min(5000 * Math.pow(2, retries - 1), 10 * 60 * 1000);
            }
        }
    });

    // 物理连接中，保持绝对沉默，不报任何 log

    redisClient.on('ready', () => {
        logOnce('ready', 'log', '[Cache] Redis 连接成功且就绪，已启用集中式缓存');
        useRedis = true;
    });

    redisClient.on('error', () => {
        // 当彻底没有 Redis 环境时，底层会持续报错，这里通过 logOnce 压制
        // 只有从“正常”变成“异常”的那一下会打印，后续重复的错误直接静音
        logOnce('error', 'warn', `[Cache] Redis 当前不可用 (正在后台静默等待重连...)`);
        useRedis = false;
    });

    redisClient.on('end', () => {
        logOnce('end', 'warn', '[Cache] Redis 物理连接断开');
        useRedis = false;
    });

    try {
        // 第一次连接尝试
        await redisClient.connect();
    } catch (err) {
        // 即使没有 Redis 环境，这里抓到错也只是安静地过去，后台重连策略会自动接管
        useRedis = false;
    }
}

// 启动初始化
initCache().catch(err => {console.error(err)});

// 3. 统一对外暴露的缓存管理对象
export const cacheManager = {
    async get(key) {
        if (useRedis && redisClient?.isOpen) {
            try {
                const val = await redisClient.get(key);
                if (val !== null) return val;
            } catch (e) {
                // 运行时单次偶发报错，不打印任何日志，直接静默降级走本地 LRU
            }
        }
        return localCache.get(key);
    },

    async set(key, value) {
        localCache.set(key, value);

        if (useRedis && redisClient?.isOpen) {
            try {
                await redisClient.set(key, value, { EX: 604800 });
            } catch (e) {
                // 静默失败，不打日志
            }
        }
    },

    async del(key) {
        localCache.delete(key);
        if (useRedis && redisClient?.isOpen) {
            try {
                await redisClient.del(key);
            } catch (e) {
                // 静默失败，不打日志
            }
        }
    }
};