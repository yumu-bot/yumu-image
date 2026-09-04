import { isAbsolute, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

/**
 * SVG → PNG 渲染服务(长驻 + WebView 池化)。
 *
 * 设计要点:
 * - 用 Bun.WebView(而非 puppeteer)渲染 SVG,池化复用,不每次新建。
 * - SVG 在内存中生成后放进全局缓存并生成 key,服务按 key 返回 SVG,
 *   让浏览器(WebView)截图。
 * - 解析 util.js 生成的 HTTP_XXX 前缀,把本地文件缓存正确返回给 SVG 里的 <image>。
 * - 只依赖 Bun 运行时 + 系统 Chrome,无 puppeteer。
 */

// —— 与 src/util/util.js 保持一致的路径配置 ——
// util.js 中: EXPORT_FILE_V3 = process.env.EXPORT_FILE || "";
//             IMG_BUFFER_PATH  = process.env.BUFFER_PATH || join(tmpdir(), "n-bot", "buffer");
const EXPORT_FILE_V3 = process.env.EXPORT_FILE || "";
const IMG_BUFFER_PATH = process.env.BUFFER_PATH || join(tmpdir(), "n-bot", "buffer");

const HTTP_EXPORT_FILE_V3 = "/EXPORT_FILE_V3";
const HTTP_IMG_BUFFER_PATH = "/IMG_BUFFER_PATH";
const HTTP_OTHER_PATH = "/OTHER_PATH";

const PORT = Number(process.env.SVG_RENDER_PORT) || 8488;
const HOSTNAME = process.env.SVG_RENDER_HOST || "127.0.0.1";
const POOL_SIZE = Number(process.env.SVG_RENDER_POOL_SIZE) || 4;
const MAX_SVG_CACHE = Number(process.env.SVG_CACHE_SIZE) || 200;
const LOAD_TIMEOUT_MS = Number(process.env.SVG_LOAD_TIMEOUT) || 15000;

function parseSize(svg: string): { width: number; height: number } {
    const w = /<svg[^>]*\bwidth\s*=\s*"([\d.]+)"/i.exec(svg)?.[1];
    const h = /<svg[^>]*\bheight\s*=\s*"([\d.]+)"/i.exec(svg)?.[1];
    return {
        width: Math.round(Number(w) || 1920),
        height: Math.round(Number(h) || 1080),
    };
}

// —— 全局 SVG 内存缓存(key -> svg) ——
const svgCache = new Map<string, string>();

function cacheSvg(svg: string): string {
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
    private readonly idle: Bun.WebView[] = [];
    private readonly waiters: Array<(view: Bun.WebView) => void> = [];
    private total = 0;

    constructor(private readonly max: number) {}

    async acquire(): Promise<Bun.WebView> {
        const idle = this.idle.pop();
        if (idle) return idle;

        if (this.total < this.max) {
            this.total++;
            try {
                // Linux 上 webkit 后端不可用,必须用 chrome。
                // Chrome 只 spawn 一次,后续 view 复用同一进程(Target.createTarget)。
                return new Bun.WebView({ backend: "chrome" });
            } catch (err) {
                this.total--;
                throw err;
            }
        }

        return new Promise((resolveView) => this.waiters.push(resolveView));
    }

    release(view: Bun.WebView): void {
        const next = this.waiters.shift();
        if (next) next(view);
        else this.idle.push(view);
    }

    async closeAll(): Promise<void> {
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
// 这里对"缺一个斜杠"的历史写法做了容忍(去掉剩余部分前导斜杠)。
function resolveLocalFile(pathname: string): BunFile | null {
    let decoded: string;
    try {
        decoded = decodeURIComponent(pathname);
    } catch {
        return null;
    }

    for (const [prefix, base] of [
        [HTTP_EXPORT_FILE_V3, EXPORT_FILE_V3],
        [HTTP_IMG_BUFFER_PATH, IMG_BUFFER_PATH],
    ] as const) {
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
function safeFile(base: string, rel: string): BunFile | null {
    const baseAbs = resolve(base);
    const target = resolve(baseAbs, rel);
    if (target !== baseAbs && !target.startsWith(baseAbs + sep)) return null;
    return Bun.file(target);
}

// —— 渲染 ——
async function renderSvg(svg: string, origin: string, pool: WebViewPool, key?: string): Promise<Buffer> {
    const { width, height } = parseSize(svg);
    const actualKey = key ?? cacheSvg(svg);

    const view = await pool.acquire();
    try {
        // 先导航一次建立会话,再把视口精确设成 SVG 尺寸
        await view.navigate("about:blank");
        await view.resize(width, height);
        await view.navigate(`${origin}/?key=${actualKey}`);

        // 轮询等待注入页把 SVG 加载完并标记 document.title = "loaded"
        const deadline = Date.now() + LOAD_TIMEOUT_MS;
        let title = "";
        while (Date.now() < deadline) {
            title = (await view.evaluate("document.title")) as string;
            if (title === "loaded") break;
            await Bun.sleep(50);
        }
        if (title !== "loaded") {
            console.warn(`[SVG] 加载超时,仍尝试截图 (key=${actualKey})`);
        }

        return await view.screenshot({ encoding: "buffer" });
    } finally {
        pool.release(view);
    }
}

export function createSvgRenderServer() {
    const pool = new WebViewPool(POOL_SIZE);

    const server = Bun.serve({
        hostname: HOSTNAME,
        port: PORT,
        async fetch(req) {
            const url = new URL(req.url);
            const { pathname } = url;

            // WebView 内部访问统一走 127.0.0.1
            const origin = `http://127.0.0.1:${server.port}`;

            // 1) 注入页:WebView 截图入口
            if (req.method === "GET" && (pathname === "/" || pathname === "/index.html")) {
                return new Response(Bun.file(new URL("./index.html", import.meta.url)), {
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

            // 3) 按 key 渲染缓存的 SVG 为 PNG
            if (req.method === "GET" && pathname.startsWith("/png/")) {
                const key = pathname.slice("/png/".length);
                const svg = svgCache.get(key);
                if (!svg) return new Response("SVG Not Found", { status: 404 });
                try {
                    const png = await renderSvg(svg, origin, pool, key);
                    return new Response(png, { headers: { "Content-Type": "image/png" } });
                } catch (err) {
                    return new Response(`render failed: ${(err as Error).message}`, { status: 500 });
                }
            }

            // 4) 提交 SVG 渲染任务:缓存 + 用 WebView 截图,返回 key 与 PNG
            if (req.method === "POST" && (pathname === "/render" || pathname === "/")) {
                let svg: string;
                const contentType = req.headers.get("content-type") || "";
                if (contentType.includes("json")) {
                    const body = (await req.json().catch(() => ({}))) as { svg?: string };
                    svg = body.svg ?? "";
                } else {
                    svg = await req.text();
                }
                if (!svg || !svg.trim()) {
                    return new Response("empty svg", { status: 400 });
                }

                const key = cacheSvg(svg);
                try {
                    const png = await renderSvg(svg, origin, pool, key);
                    return Response.json({
                        key,
                        width: parseSize(svg).width,
                        height: parseSize(svg).height,
                        png: Buffer.from(png).toString("base64"),
                    });
                } catch (err) {
                    svgCache.delete(key);
                    return Response.json({ key, error: (err as Error).message }, { status: 500 });
                }
            }

            // 5) 本地文件缓存:解析 HTTP_XXX 前缀
            const file = resolveLocalFile(pathname);
            if (file) {
                if (!(await file.exists())) {
                    return new Response("Not Found", { status: 404 });
                }
                return new Response(file);
            }

            // 6) 健康检查
            if (req.method === "GET" && pathname === "/health") {
                return Response.json({ ok: true, pool: pool.stats(), cache: svgCache.size });
            }

            return new Response("Not Found", { status: 404 });
        },
    });

    return {
        server,
        pool,
        renderSvg: (svg: string) => renderSvg(svg, `http://127.0.0.1:${server.port}`, pool),
    };
}

async function main() {
    const { server } = createSvgRenderServer();
    console.log(`[SVG] 渲染服务已启动: http://${HOSTNAME}:${server.port}`);
    console.log(`[SVG] WebView 池大小: ${POOL_SIZE}, SVG 缓存上限: ${MAX_SVG_CACHE}`);
    console.log(`[SVG] 本地文件前缀: ${HTTP_EXPORT_FILE_V3} -> ${EXPORT_FILE_V3 || "(未设置 EXPORT_FILE)"}`);
    console.log(`[SVG] 本地文件前缀: ${HTTP_IMG_BUFFER_PATH} -> ${IMG_BUFFER_PATH}`);
    console.log(`[SVG] 本地文件前缀: ${HTTP_OTHER_PATH} -> (绝对路径)`);
}

// 直接运行: bun template/svgTemplate/render.ts
if (import.meta.main) {
    main().catch((err) => {
        console.error("render failed:", err);
        process.exit(1);
    });
}
