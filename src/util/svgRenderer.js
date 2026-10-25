import { isAbsolute, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { acquireChromeProfile } from "./chromeProfile.js";

const EXPORT_FILE_V3 = process.env.EXPORT_FILE || "";
const IMG_BUFFER_PATH = process.env.BUFFER_PATH || join(tmpdir(), "n-bot", "buffer");

const HTTP_EXPORT_FILE_V3 = "/EXPORT_FILE_V3";
const HTTP_IMG_BUFFER_PATH = "/IMG_BUFFER_PATH";
const HTTP_OTHER_PATH = "/OTHER_PATH";

const POOL_SIZE = Math.max(1, Number(process.env.SVG_RENDER_POOL_SIZE) || 1);
const MAX_SVG_CACHE = Math.max(1, Number(process.env.SVG_CACHE_SIZE) || 32);
const LOAD_TIMEOUT_MS = Math.max(1000, Number(process.env.SVG_LOAD_TIMEOUT) || 15000);
const CLEANUP_TIMEOUT_MS = Math.max(500, Number(process.env.SVG_CLEANUP_TIMEOUT) || 3000);
const ACQUIRE_TIMEOUT_MS = Math.max(1000, Number(process.env.SVG_ACQUIRE_TIMEOUT) || 30000);
const IDLE_KEEP_RAW = Number(process.env.SVG_IDLE_KEEP ?? 1);
const IDLE_KEEP = Number.isFinite(IDLE_KEEP_RAW) ? Math.max(0, IDLE_KEEP_RAW) : 1;
const IDLE_TIMEOUT_MS = Math.max(1000, Number(process.env.SVG_IDLE_TIMEOUT) || 60000);
const RENDER_ATTEMPTS = Math.max(1, Number(process.env.SVG_RENDER_ATTEMPTS) || 2);
const SHUTDOWN_TIMEOUT_MS = Math.max(1000, Number(process.env.SVG_SHUTDOWN_TIMEOUT) || 10000);
const RENDER_TIMEOUT_MS = Math.max(1000, Number(process.env.SVG_RENDER_TIMEOUT) || 20000);

const CHROME_EXTRA_ARGS = (process.env.SVG_CHROME_ARGS || "")
    .split(/\s+/)
    .map((arg) => arg.trim())
    .filter(Boolean)
    .filter((arg) => !arg.startsWith("--user-data-dir"));

const CHROME_ARGS = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    ...CHROME_EXTRA_ARGS,
];

function parseSize(svg) {
    const w = /<svg[^>]*\bwidth\s*=\s*"([\d.]+)"/i.exec(svg)?.[1];
    const h = /<svg[^>]*\bheight\s*=\s*"([\d.]+)"/i.exec(svg)?.[1];
    return {
        width: clampDimension(w, 1920),
        height: clampDimension(h, 1080),
    };
}

function clampDimension(value, fallback) {
    const number = Math.round(Number(value));
    if (!Number.isFinite(number) || number < 1) return fallback;
    // Bun.WebView.resize 只接受 [1, 16384]。
    return Math.min(number, 16384);
}

const svgCache = new Map();

function cacheSvg(svg) {
    const key = randomUUID().replace(/-/g, "");
    if (svgCache.size >= MAX_SVG_CACHE) {
        const oldest = svgCache.keys().next().value;
        if (oldest !== undefined) svgCache.delete(oldest);
    }
    svgCache.set(key, svg);
    return key;
}

function errorMessage(err) {
    if (typeof err === "string") return err;
    return err?.message || String(err ?? "");
}

class RendererResetError extends Error {
    constructor(message) {
        super(message);
        this.name = "RendererResetError";
        this.code = "ERR_RENDERER_RESET";
    }
}

class RendererClosedError extends Error {
    constructor(message) {
        super(message);
        this.name = "RendererClosedError";
        this.code = "ERR_RENDERER_CLOSED";
    }
}

class RenderTimeoutError extends Error {
    constructor(message, code = "ERR_RENDER_TIMEOUT") {
        super(message);
        this.name = "RenderTimeoutError";
        this.code = code;
    }
}

const BROWSER_FATAL_PATTERNS = [
    /chrome process/i,
    /closed the pipe/i,
    /pipe.*closed/i,
    /target closed/i,
    /browser.*(?:closed|disconnected|crash|exited)/i,
    /webview closed/i,
    /devtools.*(?:closed|disconnected)/i,
];

function isBrowserFatalError(err) {
    if (err?.code === "ERR_BROWSER_CLOSED") return true;
    const message = errorMessage(err);
    return BROWSER_FATAL_PATTERNS.some((pattern) => pattern.test(message));
}

function isRetryableError(err) {
    if (err?.code === "ERR_RENDERER_RESET" ||
        err?.code === "ERR_INVALID_STATE" ||
        err?.code === "ERR_RENDER_TIMEOUT") {
        return true;
    }
    return isBrowserFatalError(err);
}

class WebViewPool {
    #idle = [];
    #waiters = [];
    #views = new Set();
    #viewEpoch = new WeakMap();
    #total = 0;
    #closed = false;
    #epoch = 0;
    #sweepTimer = null;

    constructor(max, factory) {
        this.max = Math.max(1, max);
        this.factory = factory;
    }

    get closed() {
        return this.#closed;
    }

    async acquire() {
        if (this.#closed) {
            throw new RendererClosedError("渲染池已关闭");
        }

        while (this.#idle.length > 0) {
            const item = this.#idle.pop();
            if (this.#views.has(item.view)) return item.view;
        }

        if (this.#total < this.max) {
            return this.#create();
        }

        return new Promise((resolveWaiter, rejectWaiter) => {
            const waiter = {
                resolve: resolveWaiter,
                reject: rejectWaiter,
                active: true,
                timer: null,
            };

            waiter.timer = setTimeout(() => {
                if (!waiter.active) return;
                waiter.active = false;
                const index = this.#waiters.indexOf(waiter);
                if (index >= 0) this.#waiters.splice(index, 1);
                rejectWaiter(new Error(`等待空闲 WebView 超时 (${ACQUIRE_TIMEOUT_MS}ms)`));
            }, ACQUIRE_TIMEOUT_MS);
            waiter.timer.unref?.();

            this.#waiters.push(waiter);
        });
    }

    #create() {
        if (this.#closed) {
            throw new RendererClosedError("渲染池已关闭");
        }

        this.#total++;
        try {
            const view = this.factory();
            this.#views.add(view);
            this.#viewEpoch.set(view, this.#epoch);
            return view;
        } catch (err) {
            this.#total = Math.max(0, this.#total - 1);
            throw err;
        }
    }

    release(view) {
        if (!view) return;
        if (!this.#views.has(view)) return;

        if (this.#closed) {
            this.#destroy(view);
            return;
        }

        const waiter = this.#nextWaiter();
        if (waiter) {
            clearTimeout(waiter.timer);
            waiter.active = false;
            waiter.resolve(view);
            return;
        }

        this.#idle.push({ view, since: Date.now() });
        this.#trimIdle();

        if (this.#sweepTimer) {
            clearTimeout(this.#sweepTimer);
            this.#sweepTimer = null;
        }
        this.#scheduleSweep();
    }

    #nextWaiter() {
        while (this.#waiters.length > 0) {
            const waiter = this.#waiters.shift();
            if (waiter.active) return waiter;
        }
        return null;
    }

    #trimIdle() {
        while (this.#idle.length > IDLE_KEEP) {
            const item = this.#idle.shift();
            this.#destroy(item.view);
        }
    }

    #destroy(view) {
        if (!this.#views.has(view)) return;
        this.#views.delete(view);
        if (this.#idle.length > 0) {
            this.#idle = this.#idle.filter((item) => item.view !== view);
        }
        this.#total = Math.max(0, this.#total - 1);
        try {
            view.close();
        } catch {}
    }

    invalidate(view, err) {
        const known = view && this.#views.has(view);
        if (known) this.#destroy(view);

        const fatal = isBrowserFatalError(err);
        if (fatal && !this.#closed) {
            // 只有当前代 view 能触发 reset，避免旧 view 的并发报错误杀刚重建的页面。
            const epoch = view ? this.#viewEpoch.get(view) : this.#epoch;
            if (epoch === this.#epoch) this.reset();
        }
        return fatal;
    }

    reset() {
        if (this.#closed) return;

        this.#epoch++;
        if (this.#sweepTimer) {
            clearTimeout(this.#sweepTimer);
            this.#sweepTimer = null;
        }
        this.#idle.length = 0;

        for (const view of [...this.#views]) {
            this.#destroy(view);
        }
        this.#total = 0;

        for (const waiter of this.#waiters.splice(0)) {
            waiter.active = false;
            clearTimeout(waiter.timer);
            waiter.reject(new RendererResetError("Chromium 已退出,渲染池已重置,请重试"));
        }

        try {
            Bun.WebView.closeAll();
        } catch (err) {
            console.warn(`[SVG] 重启 Chromium 前清理失败: ${errorMessage(err)}`);
        }
    }

    #scheduleSweep() {
        if (this.#sweepTimer || this.#closed || this.#idle.length === 0) return;

        const oldest = this.#idle[0].since;
        const delay = Math.max(1000, Math.min(IDLE_TIMEOUT_MS, oldest + IDLE_TIMEOUT_MS - Date.now()));

        this.#sweepTimer = setTimeout(() => {
            this.#sweepTimer = null;
            this.#sweepIdle();
        }, delay);
        this.#sweepTimer.unref?.();
    }

    #sweepIdle() {
        if (this.#closed) return;

        const now = Date.now();
        const kept = [];
        for (const item of this.#idle) {
            if (now - item.since >= IDLE_TIMEOUT_MS) {
                this.#destroy(item.view);
            } else {
                kept.push(item);
            }
        }
        this.#idle = kept;
        this.#trimIdle();

        if (this.#idle.length > 0) this.#scheduleSweep();
    }

    async closeAll() {
        if (this.#closed) return;

        this.#closed = true;
        this.#epoch++;

        if (this.#sweepTimer) {
            clearTimeout(this.#sweepTimer);
            this.#sweepTimer = null;
        }

        for (const view of [...this.#views]) {
            this.#destroy(view);
        }
        this.#idle.length = 0;
        this.#total = 0;

        for (const waiter of this.#waiters.splice(0)) {
            waiter.active = false;
            clearTimeout(waiter.timer);
            waiter.reject(new RendererClosedError("渲染池已关闭"));
        }

        try {
            Bun.WebView.closeAll();
        } catch (err) {
            console.warn(`[SVG] 关闭 Chromium 失败: ${errorMessage(err)}`);
        }
    }

    stats() {
        return {
            idle: this.#idle.length,
            total: this.#total,
            waiting: this.#waiters.length,
            epoch: this.#epoch,
            max: this.max,
            closed: this.#closed,
        };
    }
}

function resolveLocalFile(pathname) {
    let decoded;
    try {
        decoded = decodeURIComponent(pathname);
    } catch {
        return null;
    }

    for (const [prefix, base] of [
        [HTTP_EXPORT_FILE_V3, EXPORT_FILE_V3],
        [HTTP_IMG_BUFFER_PATH, IMG_BUFFER_PATH],
    ]) {
        if (decoded.startsWith(prefix)) {
            const rel = decoded.slice(prefix.length).replace(/^\/+/, "");
            if (!rel) return null;
            return safeFile(base, rel);
        }
    }

    if (decoded.startsWith(HTTP_OTHER_PATH)) {
        const abs = decoded.slice(HTTP_OTHER_PATH.length);
        if (!abs || !isAbsolute(abs)) return null;
        return Bun.file(abs);
    }

    return null;
}

function safeFile(base, rel) {
    const baseAbs = resolve(base);
    const target = resolve(baseAbs, rel);
    if (target !== baseAbs && !target.startsWith(baseAbs + sep)) return null;
    return Bun.file(target);
}

const INJECTOR_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>loading</title>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: transparent; overflow: hidden; }
    #stage { width: 100%; height: 100%; }
    #stage svg { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="stage"></div>
  <script type="module">
    (async () => {
      const params = new URLSearchParams(location.search);
      const key = params.get("key");
      const bg = params.get("bg");
      if (bg) document.body.style.background = bg;
      const res = await fetch("/svg/" + encodeURIComponent(key ?? ""));

      document.getElementById("stage").innerHTML = await res.text();

      const imgs = Array.from(document.querySelectorAll("#stage image"));
      if (imgs.length) {
        await Promise.all(imgs.map((el) =>
          new Promise((resolve) => {
            el.addEventListener("load", resolve, { once: true });
            el.addEventListener("error", resolve, { once: true });
          }),
        ));
      }
      document.title = "loaded";
    })();
  </script>
</body>
</html>`;

const staticMounts = new Map();
const staticMountByDir = new Map();

function mountStatic(baseDir) {
    const resolvedDir = resolve(baseDir);
    const existing = staticMountByDir.get(resolvedDir);
    if (existing) return existing;

    const prefix = `/__static/${staticMounts.size}/`;
    staticMounts.set(prefix, resolvedDir);
    staticMountByDir.set(resolvedDir, prefix);
    return prefix;
}

const MIME_BY_EXT = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
};

function mimeFor(filePath) {
    const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
    return MIME_BY_EXT[ext] || "application/octet-stream";
}

let serverPromise = null;
let chromeProfile = null;
let shuttingDown = false;
let closePromise = null;
const activeJobs = new Set();

function ensureProfile() {
    if (!chromeProfile) {
        chromeProfile = acquireChromeProfile();
        console.log(`[SVG] Chromium profile: ${chromeProfile.dir}`);
    }
    return chromeProfile;
}

function createView(profileDir) {
    if (typeof Bun.WebView !== "function") {
        throw new Error("当前 Bun 版本不支持 Bun.WebView,请升级到 1.4.2 或更高版本");
    }

    // Bun 1.4.x 的 argv 必须放在 backend 内；url:false 强制本进程 spawn，
    // dataStore.directory 即 --user-data-dir，且由首个 view 决定整个 Chromium。
    return new Bun.WebView({
        backend: {
            type: "chrome",
            url: false,
            argv: [...CHROME_ARGS],
            stdout: "ignore",
            stderr: "ignore",
        },
        dataStore: { directory: profileDir },
        headless: true,
    });
}

function ensureServer() {
    if (shuttingDown) {
        return Promise.reject(new RendererClosedError("渲染器正在退出"));
    }
    if (serverPromise) return serverPromise;

    const promise = (async () => {
        const profile = ensureProfile();
        const pool = new WebViewPool(POOL_SIZE, () => createView(profile.dir));

        const server = Bun.serve({
            hostname: "127.0.0.1",
            port: 0,
            async fetch(req) {
                const url = new URL(req.url);
                const { pathname } = url;

                if (req.method === "GET" && pathname === "/__injector") {
                    return new Response(INJECTOR_HTML, {
                        headers: { "Content-Type": "text/html; charset=utf-8" },
                    });
                }

                if (req.method === "GET" && pathname.startsWith("/svg/")) {
                    const key = pathname.slice("/svg/".length);
                    const svg = svgCache.get(key);
                    if (!svg) return new Response("SVG Not Found", { status: 404 });
                    return new Response(svg, {
                        headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
                    });
                }

                if (req.method === "GET") {
                    for (const [prefix, base] of staticMounts) {
                        if (pathname === prefix || pathname.startsWith(prefix)) {
                            const rel = (pathname.slice(prefix.length) || "index.html").replace(/^\/+/, "");
                            const file = safeFile(base, rel);
                            if (file) {
                                if (await file.exists()) {
                                    return new Response(file, {
                                        headers: { "Content-Type": mimeFor(rel) },
                                    });
                                }
                            }
                        }
                    }
                }

                const file = resolveLocalFile(pathname);
                if (file) {
                    if (!(await file.exists())) {
                        return new Response("Not Found", { status: 404 });
                    }
                    return new Response(file);
                }

                if (req.method === "GET" && pathname === "/health") {
                    return Response.json({
                        ok: true,
                        shuttingDown,
                        pool: pool.stats(),
                        cache: svgCache.size,
                    });
                }

                return new Response("Not Found", { status: 404 });
            },
        });

        return {
            server,
            pool,
            origin: `http://127.0.0.1:${server.port}`,
            profile,
        };
    })();

    serverPromise = promise;
    promise.catch(() => {
        if (serverPromise === promise) serverPromise = null;
    });

    return promise;
}

function withTimeout(promise, timeoutMs, message, code = "ERR_RENDER_TIMEOUT") {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new RenderTimeoutError(message, code)), timeoutMs);
    });

    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function waitFor(view, script, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (shuttingDown) {
            throw new RendererClosedError("渲染器正在退出");
        }

        let ok = false;
        try {
            const remaining = Math.max(500, Math.min(5000, deadline - Date.now()));
            ok = Boolean(await withTimeout(
                view.evaluate(script),
                remaining,
                "页面脚本执行超时",
            ));
        } catch (err) {
            if (shuttingDown || isRetryableError(err)) throw err;
        }

        if (ok) return true;
        await Bun.sleep(50);
    }
    return false;
}

async function cleanupView(view) {
    if (!view || shuttingDown) return;

    try {
        await withTimeout(
            view.evaluate(`(() => {
                try {
                    if (typeof window.setStr === "function") window.setStr(null);
                } catch {}
                try {
                    const stage = document.getElementById("stage");
                    if (stage) stage.replaceChildren();
                    if (document.body) document.body.replaceChildren();
                } catch {}
                return true;
            })()`),
            CLEANUP_TIMEOUT_MS,
            "清理页面内容超时",
        );
    } catch (err) {
        // evaluate 超时后仍可能在页面中执行，归还会让下一次 evaluate 撞 ERR_INVALID_STATE。
        if (isBrowserFatalError(err) || err?.code === "ERR_RENDER_TIMEOUT") throw err;
    }

    await withTimeout(
        view.navigate("about:blank"),
        CLEANUP_TIMEOUT_MS,
        "重置页面超时",
    );
}

async function withPooledView(pool, task) {
    let lastError;

    for (let attempt = 1; attempt <= RENDER_ATTEMPTS; attempt++) {
        if (shuttingDown) throw new RendererClosedError("渲染器正在退出");

        let view = null;
        try {
            view = await pool.acquire();
            return await withTimeout(
                task(view),
                RENDER_TIMEOUT_MS,
                `渲染任务超时 (${RENDER_TIMEOUT_MS}ms)`,
                "ERR_RENDER_TASK_TIMEOUT",
            );
        } catch (err) {
            lastError = err;
            const fatal = view ? pool.invalidate(view, err) : false;
            view = null;

            if (attempt < RENDER_ATTEMPTS && (fatal || isRetryableError(err))) {
                console.warn(`[SVG] 渲染失败,第 ${attempt} 次重试: ${errorMessage(err)}`);
                continue;
            }
            throw err;
        } finally {
            if (view) {
                try {
                    await cleanupView(view);
                    pool.release(view);
                } catch (cleanupErr) {
                    pool.invalidate(view, cleanupErr);
                }
            }
        }
    }

    throw lastError;
}

function trackRender(task) {
    if (shuttingDown) {
        return Promise.reject(new RendererClosedError("渲染器正在退出"));
    }

    const job = Promise.resolve().then(task);
    activeJobs.add(job);
    job.then(
        () => activeJobs.delete(job),
        () => activeJobs.delete(job),
    );
    return job;
}

export function renderSvg(svg, options = {}) {
    return trackRender(async () => {
        const { format = "png", quality, background } = options;

        const { pool, origin } = await ensureServer();
        const { width, height } = parseSize(svg);
        const key = cacheSvg(svg);

        try {
            const bg = background !== undefined
                ? background
                : (format === "jpeg" || format === "jpg" ? "#FFFFFF" : "transparent");

            const url = `${origin}/__injector?key=${key}&bg=${encodeURIComponent(bg)}`;

            return await withPooledView(pool, async (view) => {
                await view.navigate("about:blank");
                await view.resize(width, height);
                await view.navigate(url);

                const loaded = await waitFor(view, `document.title === "loaded"`, LOAD_TIMEOUT_MS);
                if (!loaded) {
                    console.warn(`[SVG] 加载超时,仍尝试截图 (key=${key})`);
                }

                if (format === "webp") {
                    try {
                        return await view.screenshot({ encoding: "buffer", format: "webp", quality });
                    } catch (err) {
                        console.warn(`[SVG] 后端不支持 webp，降级: ${errorMessage(err)}`);

                        const png = await view.screenshot({ encoding: "buffer", format: "png" });
                        return await sharp(png).webp({ quality: quality ?? 80 }).toBuffer();
                    }
                }

                return await view.screenshot({ encoding: "buffer", format, quality });
            });
        } finally {
            svgCache.delete(key);
        }
    });
}

export function renderMarkdown(markdown, options = {}) {
    return trackRender(async () => {
        let { templateDir, width = 1080, height = 600, format = "png", quality } = options;

        width = clampDimension(width, 1080);
        height = clampDimension(height, 3840);

        const { pool, origin } = await ensureServer();
        const prefix = mountStatic(templateDir);
        const url = `${origin}${prefix}index.html`;

        return await withPooledView(pool, async (view) => {
            await view.navigate("about:blank");
            await view.resize(width, height);
            await view.navigate(url);

            if (!(await waitFor(view, `typeof window.setStr === 'function'`, LOAD_TIMEOUT_MS))) {
                throw new Error(`等待 window.setStr 超时`);
            }

            await view.evaluate(`(() => { window.setStr(${JSON.stringify(markdown)}); })()`);

            if (!(await waitFor(view, `!!document.querySelector('article')`, LOAD_TIMEOUT_MS))) {
                throw new Error(`等待 article 超时`);
            }

            await view.evaluate(`(async () => {
                const imgs = Array.from(document.querySelectorAll('article img'));
                await Promise.all(imgs.map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                    });
                }));
                return true;
            })()`);

            const dims = await view.evaluate(`(() => {
                const r = document.body.getBoundingClientRect();
                return {
                    width: Math.max(1, Math.ceil(r.width)),
                    height: Math.max(1, Math.ceil(r.height))
                };
            })()`);

            await view.resize(
                clampDimension(dims?.width, width),
                clampDimension(dims?.height, height),
            );

            await view.evaluate(`(() => {
                document.documentElement.style.background = "#FFFFFF";
                document.body.style.background = "#FFFFFF";
            })()`);

            const image = await view.screenshot({ encoding: "buffer", format, quality });

            return {
                image,
                width: clampDimension(dims?.width, width),
                height: clampDimension(dims?.height, height),
            };
        });
    });
}

export function closeRenderer() {
    if (closePromise) return closePromise;

    closePromise = (async () => {
        shuttingDown = true;

        const deadline = Date.now() + SHUTDOWN_TIMEOUT_MS;
        while (activeJobs.size > 0 && Date.now() < deadline) {
            const remaining = Math.max(0, deadline - Date.now());
            await Promise.race([
                Promise.allSettled([...activeJobs]),
                Bun.sleep(Math.min(remaining, 100)),
            ]);
        }

        if (activeJobs.size > 0) {
            console.warn(`[SVG] 退出等待超时,仍有 ${activeJobs.size} 个渲染任务未结束`);
        }

        const pendingServer = serverPromise;
        serverPromise = null;

        const state = pendingServer
            ? await pendingServer.catch((err) => {
                console.warn(`[SVG] 关闭时等待渲染服务失败: ${errorMessage(err)}`);
                return null;
            })
            : null;

        if (state) {
            try {
                state.server.stop(true);
            } catch (err) {
                console.warn(`[SVG] 停止本地渲染服务失败: ${errorMessage(err)}`);
            }

            try {
                await state.pool.closeAll();
            } catch (err) {
                console.warn(`[SVG] 关闭 WebView 池失败: ${errorMessage(err)}`);
            }
        }

        try {
            Bun.WebView.closeAll();
        } catch {}

        svgCache.clear();
        staticMounts.clear();
        staticMountByDir.clear();

        const profile = chromeProfile ?? state?.profile ?? null;
        chromeProfile = null;
        if (profile) {
            profile.release();
        }
    })();

    return closePromise;
}
