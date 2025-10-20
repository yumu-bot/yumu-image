class FileCache {
    constructor() {
        this.cache = new Map();
        this.expiredTime = 24 * 60 * 60 * 1000; // 一天默认缓存时间
    }

    // 设置缓存
    set(key, data, expired = this.expiredTime) {
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

export default FileCache;