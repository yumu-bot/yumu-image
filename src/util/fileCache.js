class FileCache {
    constructor(maxSize = 50) {
        this.cache = new Map();
        this.expiredTime = 24 * 60 * 60 * 1000; // 默认 1 天
        this.maxSize = maxSize; // 最大缓存条目数
    }

    // 设置缓存
    set(key, data, expired = this.expiredTime) {
        // 如果已存在，先删除，确保新值插入到 Map 的末尾（代表最新使用）
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // 如果超出容量，删除 Map 中的第一个元素（最旧的）
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        const expiry = Date.now() + expired;
        this.cache.set(key, { data, expiry });
        return true;
    }

    // 获取缓存
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        // 检查是否过期
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        // --- LRU 核心操作 ---
        // 重新插入，将其标记为“最新访问”
        this.cache.delete(key);
        this.cache.set(key, item);

        return item.data;
    }

    // 删除缓存
    delete(key) {
        return this.cache.delete(key);
    }

    // 清空缓存
    clear() {
        this.cache.clear();
    }

    // 清理过期缓存
    cleanup() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now > value.expiry) {
                this.cache.delete(key);
            }
        }
    }
}

export default FileCache

export { FileCache };