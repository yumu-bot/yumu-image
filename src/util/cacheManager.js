import { createClient } from "redis";
import { LRUCache } from "lru-cache";
import {loggerTime} from "./util.js";

// 10 万条，最大 19.2 MB，存活 7 天
export const LRU_MAX = Number(process.env.LRU_MAX) || 100000;
export const LRU_MAX_SIZE = Number(process.env.LRU_MAX_SIZE) || 20 * 1024 * 1024;
export const LRU_TIME_TO_LIVE = Number(process.env.LRU_TTL) || 1000 * 60 * 60 * 24 * 7;

export const LRU_TEMPLATE_MAX = Number(process.env.LRU_TEMPLATE_MAX) || 100;
export const LRU_TEMPLATE_MAX_SIZE = Number(process.env.LRU_TEMPLATE_MAX_SIZE) || 100 * 40 * 1024;
export const LRU_TEMPLATE_TIME_TO_LIVE = Number(process.env.LRU_TEMPLATE_TTL) || LRU_TIME_TO_LIVE

const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

// 1. 初始化本地内存
const image_lru_cache = new LRUCache({
    max: LRU_MAX,

    maxSize: LRU_MAX_SIZE,

    sizeCalculation: (value, key) => {
        return key.length * 2 + 64;
    },

    ttl: LRU_TIME_TO_LIVE,
    updateAgeOnGet: true,
});

const template_lru_cache = new LRUCache({
    max: LRU_TEMPLATE_MAX,

    maxSize: LRU_TEMPLATE_MAX_SIZE,

    sizeCalculation: (value, key) => {
        return (key.length * 2) + Buffer.byteLength(value, 'utf8');
    },

    ttl: LRU_TEMPLATE_TIME_TO_LIVE,
    updateAgeOnGet: true,
});

let redisClient = null;
let useRedis = false;
let lastLogStatus = null; // 用于防止重复打印相同日志的标记位

// 封装一个安静的日志工具，相同状态只打印一次
function logOnce(status, type, message) {
    if (lastLogStatus !== status) {
        console[type](loggerTime(message));
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
                if (val !== null) {
                    image_lru_cache.set(key, val);
                    return val;
                }
            } catch (e) {

            }
        }
        return image_lru_cache.get(key);
    },

    async set(key, value) {
        image_lru_cache.set(key, value);

        if (useRedis && redisClient?.isOpen) {
            try {
                await redisClient.set(key, value, { EX: 604800 });
            } catch (e) {
                // 静默失败，不打日志
            }
        }
    },

    async delete(key) {
        image_lru_cache.delete(key);
        if (useRedis && redisClient?.isOpen) {
            try {
                await redisClient.del(key);
            } catch (e) {
                // 静默失败，不打日志
            }
        }
    },

    async fetch(key, fetchFn = () => { return null }) {
        const cached = await this.get(key);

        if (cached != null) {
            return cached;
        }

        const fresh = await fetchFn();

        if (fresh != null) {
            await this.set(key, fresh);
        }

        return fresh;
    },
};

// 模板直接 LRU
export const templateManager = {
    get(key) {
        return template_lru_cache.get(key);
    },

    set(key, value) {
        template_lru_cache.set(key, value);
    },

    delete(key) {
        template_lru_cache.delete(key)
    },

    // 🚀 新增同步 fetch 方法
    fetch(key, fetchFn = () => { return null }) {
        const cached = this.get(key);
        if (cached != null) {
            return cached;
        }

        const fresh = fetchFn();

        if (fresh != null) {
            this.set(key, fresh);
        }

        return fresh;
    }
}