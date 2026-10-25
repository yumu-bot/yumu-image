import {
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { homedir, hostname } from "node:os";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const PROFILE_PREFIX = "instance-";
const LOCK_SUFFIX = ".lock";

const activeProfileNames = new Set();

// 无锁目录可能刚 mkdir 尚未写锁，保留竞态窗口，避免并发启动互删。
const ORPHAN_GRACE_MS = 10 * 60 * 1000;

function envRoot() {
    const configured = process.env.CHROME_PROFILE_ROOT || process.env.SVG_CHROME_PROFILE_ROOT;
    return configured ? resolve(configured) : null;
}

export function getChromeProfileRoot() {
    const configured = envRoot();
    if (configured) return configured;

    if (process.platform === "win32") {
        const base = process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local");
        return resolve(base, "yumu-image", "chrome-profiles");
    }

    const cacheHome = process.env.XDG_CACHE_HOME || join(homedir(), ".cache");
    return resolve(cacheHome, "yumu-image", "chrome-profiles");
}

function pidAlive(pid) {
    if (!Number.isInteger(pid) || pid <= 0) return false;
    try {
        process.kill(pid, 0);
        return true;
    } catch (err) {
        return err?.code === "EPERM";
    }
}

function readLock(lockPath) {
    try {
        const lock = JSON.parse(readFileSync(lockPath, "utf8"));
        return lock && typeof lock === "object" ? lock : null;
    } catch {
        return null;
    }
}

function mtimeMs(path) {
    try {
        return statSync(path).mtimeMs;
    } catch {
        return 0;
    }
}

function safeRemove(path) {
    try {
        rmSync(path, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
    } catch (err) {
        console.warn(`[ChromeProfile] 无法清理 ${path}: ${err?.message || err}`);
    }
}

function cleanupStaleProfiles(root) {
    let entries;
    try {
        entries = readdirSync(root, { withFileTypes: true });
    } catch {
        return;
    }

    const dirs = new Set();
    const locks = new Set();

    for (const entry of entries) {
        if (!entry.name.startsWith(PROFILE_PREFIX)) continue;
        if (entry.isDirectory()) {
            dirs.add(entry.name);
        } else if (entry.isFile() && entry.name.endsWith(LOCK_SUFFIX)) {
            locks.add(entry.name);
        }
    }

    const now = Date.now();
    const currentHost = hostname();

    for (const lockName of locks) {
        const dirName = lockName.slice(0, -LOCK_SUFFIX.length);
        const lockPath = join(root, lockName);
        const dirPath = join(root, dirName);
        const lock = readLock(lockPath);

        if (activeProfileNames.has(dirName)) {
            dirs.delete(dirName);
            continue;
        }

        if (!lock) {
            if (now - mtimeMs(lockPath) < ORPHAN_GRACE_MS) {
                dirs.delete(dirName);
                continue;
            }
            safeRemove(dirPath);
            safeRemove(lockPath);
            dirs.delete(dirName);
            continue;
        }

        if (lock.hostname && lock.hostname !== currentHost) {
            dirs.delete(dirName);
            continue;
        }

        if (lock.pid !== process.pid && pidAlive(lock.pid)) {
            dirs.delete(dirName);
            continue;
        }

        safeRemove(dirPath);
        safeRemove(lockPath);
        dirs.delete(dirName);
    }

    for (const dirName of dirs) {
        if (activeProfileNames.has(dirName)) continue;
        const dirPath = join(root, dirName);
        if (now - mtimeMs(dirPath) < ORPHAN_GRACE_MS) continue;
        safeRemove(dirPath);
    }
}

// 只处理本服务 profile root；绝不扫描 /tmp 下其他实例的 .bun-chrome。
export function cleanupStaleChromeProfiles() {
    const root = getChromeProfileRoot();
    try {
        mkdirSync(root, { recursive: true, mode: 0o700 });
    } catch (err) {
        console.warn(`[ChromeProfile] 无法创建 profile 根目录 ${root}: ${err?.message || err}`);
        return;
    }
    cleanupStaleProfiles(root);
}

export function acquireChromeProfile() {
    const root = getChromeProfileRoot();

    try {
        mkdirSync(root, { recursive: true, mode: 0o700 });
    } catch (err) {
        throw new Error(
            `无法创建 Chromium profile 根目录 ${root}: ${err?.message || err}。` +
            ` 可通过 CHROME_PROFILE_ROOT 指定一个可写目录。`
        );
    }

    cleanupStaleProfiles(root);

    const name = `${PROFILE_PREFIX}${process.pid}-${randomUUID().slice(0, 8)}`;
    const dir = join(root, name);
    const lockPath = join(root, `${name}${LOCK_SUFFIX}`);

    try {
        mkdirSync(dir, { recursive: true, mode: 0o700 });
    } catch (err) {
        throw new Error(`无法创建 Chromium profile ${dir}: ${err?.message || err}`);
    }

    const lock = {
        pid: process.pid,
        hostname: hostname(),
        createdAt: new Date().toISOString(),
        dir,
    };

    try {
        writeFileSync(lockPath, JSON.stringify(lock), { flag: "wx", mode: 0o600 });
    } catch (err) {
        safeRemove(dir);
        throw new Error(`无法写入 Chromium profile 锁 ${lockPath}: ${err?.message || err}`);
    }

    activeProfileNames.add(name);
    let released = false;

    return {
        dir,
        root,
        name,
        lockPath,
        release() {
            if (released) return;
            released = true;
            activeProfileNames.delete(name);
            safeRemove(dir);
            safeRemove(lockPath);
        },
    };
}
