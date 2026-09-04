import { isAbsolute, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

/**
 * 基于 Bun.WebView 的 SVG / HTML 渲染模块(长驻 + WebView 池化)。
 */

// —— 与 src/util/util.js 保持一致的路径配置 ——
// util.js 中: EXPORT_FILE_V3 = process.env.EXPORT_FILE || "";
//             IMG_BUFFER_PATH  = process.env.BUFFER_PATH || join(tmpdir(), "n-bot", "buffer");
const EXPORT_FILE_V3 = process.env.EXPORT_FILE || "";
const IMG_BUFFER_PATH = process.env.BUFFER_PATH || join(tmpdir(), "n-bot", "buffer");

const HTTP_EXPORT_FILE_V3 = "/EXPORT_FILE_V3";
const HTTP_IMG_BUFFER_PATH = "/IMG_BUFFER_PATH";
const HTTP_OTHER_PATH = "/OTHER_PATH";

const POOL_SIZE = Number(process.env.SVG_RENDER_POOL_SIZE) || 4;
const MAX_SVG_CACHE = Number(process.env.SVG_CACHE_SIZE) || 200;
const LOAD_TIMEOUT_MS = Number(process.env.SVG_LOAD_TIMEOUT) || 15000;

function parseSize(svg) {
    const w = /<svg[^>]*\bwidth\s*=\s*"([\d.]+)"/i.exec(svg)?.[1];
    const h = /<svg[^>]*\bheight\s*=\s*"([\d.]+)"/i.exec(svg)?.[1];
    return {
        width: Math.round(Number(w) || 1920),
        height: Math.round(Number(h) || 1080),
    };
}

// —— 全局 SVG 内存缓存(key -> svg) ——
const svgCache = new Map();

function cacheSvg(svg) {
    const key = randomUUID().replace(/-/g, "");
    // 简单 FIFO 淘汰,避免内存无限增长
    if (svgCache.size >= MAX_SVG_CACHE) {
        const oldest = svgCache.keys().next().value;
        if (oldest !== undefined) svgCache.delete(oldest);
    }
    svgCache.set(key, svg);
    return key;
}

// —— WebView 池 ——
class WebViewPool {
    idle = [];
    waiters = [];
    total = 0;

    constructor(max) {
        this.max = max;
    }

    async acquire() {
        const idle = this.idle.pop();
        if (idle) return idle;

        if (this.total < this.max) {
            this.total++;
            try {
                return new Bun.WebView();
            } catch (err) {
                this.total--;
                throw err;
            }
        }

        return new Promise((resolveView) => this.waiters.push(resolveView));
    }

    release(view) {
        const next = this.waiters.shift();
        if (next) next(view);
        else this.idle.push(view);
    }

    async closeAll() {
        for (const view of this.idle) {
            try { view.close(); } catch {}
        }
        this.idle.length = 0;
        this.total = 0;
    }

    stats() {
        return { idle: this.idle.length, total: this.total, waiting: this.waiters.length };
    }
}

// —— 本地文件解析(HTTP_XXX 前缀 -> 本地路径) ——
// util.js 的映射(反向):
//   /EXPORT_FILE_V3/<rel>  -> EXPORT_FILE_V3 + <rel>
//   /IMG_BUFFER_PATH/<rel>  -> IMG_BUFFER_PATH + <rel>
//   /OTHER_PATH/<abs>       -> <abs>(绝对路径)
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

// 限定在 base 目录内,防止 ../ 越界
function safeFile(base, rel) {
    const baseAbs = resolve(base);
    const target = resolve(baseAbs, rel);
    if (target !== baseAbs && !target.startsWith(baseAbs + sep)) return null;
    return Bun.file(target);
}

// —— SVG 注入页(截图入口)。background 由 ?bg= 控制 ——
const INJECTOR_HTML = `<!doctype html>
<html>
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
      const text = await res.text();
      document.getElementById("stage").innerHTML = text;

      // 若 SVG 里有 <image>, 等它们加载完
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

// —— 静态目录挂载(供 markdown 模板等需要相对资源引用的页面) ——
const staticMounts = new Map();   // prefix -> 已解析的 base 目录
const staticMountByDir = new Map(); // 已解析的 base 目录 -> prefix

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

// —— 长驻服务(懒加载单例) ——
let serverPromise = null;

function ensureServer() {
    if (!serverPromise) {
        serverPromise = (async () => {
            const pool = new WebViewPool(POOL_SIZE);

            const server = Bun.serve({
                hostname: "127.0.0.1",
                port: 0, // 自动分配空闲端口
                async fetch(req) {
                    const url = new URL(req.url);
                    const { pathname } = url;

                    // 1) SVG 注入页
                    if (req.method === "GET" && pathname === "/__injector") {
                        return new Response(INJECTOR_HTML, {
                            headers: { "Content-Type": "text/html; charset=utf-8" },
                        });
                    }

                    // 2) 按 key 返回缓存的 SVG
                    if (req.method === "GET" && pathname.startsWith("/svg/")) {
                        const key = pathname.slice("/svg/".length);
                        const svg = svgCache.get(key);
                        if (!svg) return new Response("SVG Not Found", { status: 404 });
                        return new Response(svg, {
                            headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
                        });
                    }

                    // 3) 静态目录挂载(相对资源引用,如 markdown 模板)
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

                    // 4) 本地文件缓存:解析 HTTP_XXX 前缀
                    const file = resolveLocalFile(pathname);
                    if (file) {
                        if (!(await file.exists())) {
                            return new Response("Not Found", { status: 404 });
                        }
                        return new Response(file);
                    }

                    // 5) 健康检查
                    if (req.method === "GET" && pathname === "/health") {
                        return Response.json({ ok: true, pool: pool.stats(), cache: svgCache.size });
                    }

                    return new Response("Not Found", { status: 404 });
                },
            });

            return { server, pool, origin: `http://127.0.0.1:${server.port}` };
        })();
    }
    return serverPromise;
}

// 轮询等待某个脚本表达式为真,超时返回 false(不抛错)
async function waitFor(view, script, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        let ok = false;
        try {
            ok = Boolean(await view.evaluate(script));
        } catch {}
        if (ok) return true;
        await Bun.sleep(50);
    }
    return false;
}

/**
 * 将 SVG 渲染成 PNG / JPEG / WebP(Buffer)。
 *
 * @param {string} svg - SVG 文本
 * @param {Object} [options]
 * @param {'png'|'jpeg'|'webp'} [options.format='png'] - 输出格式
 * @param {number} [options.quality] - JPEG/WebP 质量(0-100),PNG 忽略
 * @param {string} [options.background] - 背景色;未指定时 JPEG 默认白色,其余默认透明
 * @return {Promise<Buffer>}
 */
export async function renderSvg(svg, options = {}) {
    const { format = "png", quality, background } = options;

    const { pool, origin } = await ensureServer();
    const { width, height } = parseSize(svg);
    const key = cacheSvg(svg);

    const bg = background !== undefined
        ? background
        : (format === "jpeg" || format === "jpg" ? "#FFFFFF" : "transparent");

    const url = `${origin}/__injector?key=${key}&bg=${encodeURIComponent(bg)}`;

    const view = await pool.acquire();
    try {
        // 先导航一次建立会话,再把视口精确设成 SVG 尺寸
        await view.navigate("about:blank");
        await view.resize(width, height);
        await view.navigate(url);

        const loaded = await waitFor(view, `document.title === "loaded"`, LOAD_TIMEOUT_MS);
        if (!loaded) {
            console.warn(`[SVG] 加载超时,仍尝试截图 (key=${key})`);
        }

        return await view.screenshot({ encoding: "buffer", format, quality });
    } finally {
        pool.release(view);
    }
}

/**
 * 将 markdown 渲染成图片(复用 markdown 模板目录下的 index.html + assets)。
 *
 * @param {string} markdown - markdown 文本
 * @param {Object} [options]
 * @param {string} options.templateDir - markdown 模板目录的绝对路径(含 index.html)
 * @param {number} [options.width=1080] - 初始视口宽度
 * @param {number} [options.height=600] - 初始视口高度
 * @param {'png'|'jpeg'|'webp'} [options.format='png'] - 输出格式
 * @param {number} [options.quality] - JPEG/WebP 质量
 * @return {Promise<{image: Buffer, width: number, height: number}>}
 */
export async function renderMarkdown(markdown, options = {}) {
    const { templateDir, width = 1080, height = 600, format = "png", quality } = options;

    const { pool, origin } = await ensureServer();
    const prefix = mountStatic(templateDir);
    const url = `${origin}${prefix}index.html`;

    const view = await pool.acquire();
    try {
        await view.navigate("about:blank");
        await view.resize(width, height);
        await view.navigate(url);

        if (!(await waitFor(view, `typeof window.setStr === 'function'`, LOAD_TIMEOUT_MS))) {
            throw new Error(`等待 window.setStr 超时`);
        }

        await view.evaluate(`window.setStr(${JSON.stringify(markdown)});`);

        if (!(await waitFor(view, `!!document.querySelector('article')`, LOAD_TIMEOUT_MS))) {
            throw new Error(`等待 article 超时`);
        }

        // 等待 article 内的图片加载完成
        await view.evaluate(`Promise.all(Array.from(document.querySelectorAll('article img')).map((el) => new Promise((r) => { el.addEventListener('load', r, { once: true }); el.addEventListener('error', r, { once: true }); }))).then(() => true)`);

        const dims = await view.evaluate(`(() => { const r = document.body.getBoundingClientRect(); return { width: Math.max(1, Math.ceil(r.width)), height: Math.max(1, Math.ceil(r.height)) }; })()`);

        await view.resize(dims.width, dims.height);
        await view.evaluate(`document.documentElement.style.background = "#FFFFFF"; document.body.style.background = "#FFFFFF";`);

        const image = await view.screenshot({ encoding: "buffer", format, quality });

        await view.evaluate(`window.setStr(null);`);

        return { image, width: dims.width, height: dims.height };
    } finally {
        pool.release(view);
    }
}

/**
 * 关闭内部 WebView 池(进程退出前可选调用)。
 */
export async function closeRenderer() {
    if (!serverPromise) return;
    const { pool } = await serverPromise;
    await pool.closeAll();
}
