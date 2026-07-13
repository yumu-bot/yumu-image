import JPEGProvider from '../svg-to-image/JPEGProvider.js';
import PNGProvider from '../svg-to-image/PNGProvider.js';
import WEBPProvider from '../svg-to-image/WEBPProvider.js';
import {API} from "../svg-to-image/API.js";
import sharp from "sharp";
import fs from "fs";

const DEFAULT_BASE_FORMAT = 'jpeg'

const DEFAULT_ADVANCED_FORMAT = 'webp'

export const DEFAULT_IMAGE_FORMAT = process.env.IMAGE_FORMAT ?? DEFAULT_BASE_FORMAT

export const ADVANCED_IMAGE_FORMAT = process.env.ADVANCED_FORMAT ?? DEFAULT_ADVANCED_FORMAT

const FILE_SIZE_THRESHOLD = 64 * 1024;

const exportsJPEG = new API(new JPEGProvider());
const exportsPNG = new API(new PNGProvider());
const exportsWEBP = new API(new WEBPProvider());

// 1. 基础的、通用的 Puppeteer 参数
const base_args = [
    '--js-flags="--max-old-space-size=512"',
    '--disable-breakpad',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-sandbox',
    '--no-zygote',
    '--no-first-run',
    '--disable-web-security',
    '--allow-file-access-from-files',
    '--disable-blink-features=AutomationControlled',
    '--disable-infobars'
];

// 2. 根据操作系统，动态追加硬件加速参数
if (process.platform === 'win32') {
    // Windows 环境：本地测试，强行注入 NVIDIA/ANGLE 独显参数，享受无横线超高速
    base_args.push(
        '--disable-gpu',                  // 禁用 GPU 硬件加速（最核心的开关）
        '--disable-gpu-compositing',      // 禁用 GPU 合成，强制页面图层混色也走 CPU
        '--use-gl=swiftshader',           // 强制将 WebGL 和 3D 渲染降级为 CPU 软渲染器（SwiftShader）
        '--window-position=-32000,-32000',
        '--disable-features=CalculateNativeWinOcclusion', // 关闭原生窗口遮挡计算（防止检测桌面状态）
        '--disable-features=TabHoverCardImages',          // 关闭标签卡预览图生成（防止后台隐蔽生成UI图层）
        '--disable-backgrounding-occluded-windows',       // 关闭被遮挡窗口的后台化逻辑（强制保持无UI逻辑）
        '--disable-renderer-backgrounding',               // 关闭渲染器后台化
        '--no-pings',                                     // 关掉所有内置的链路打点检测
        '--mute-audio'                                    // 彻底关闭音频（有时音频通道初始化也会触发系统音频合成器的窗体通知）
    );
} else {
    // Linux 生产环境：为了绝对安全防闪退，使用默认配置（通常会自动跌落到系统的软渲染）
    // 如果你以后在 Linux 上配置好了 AMD 驱动，可以在这里单独给 Linux 加别的参数

    // 如果你发现 Linux 默认依然闪退，可以取消下面这行的注释，强制它走 CPU 软渲染
    // base_args.push('--use-angle=swiftshader');
    base_args.push(
        '--use-gl=egl',                // 使用 EGL 作为图形渲染后端
        '--enable-features=Vulkan',     // 强烈建议开启 Vulkan，AMD 在 Linux 上的 Vulkan 性能极佳
        '--ignore-gpu-blocklist',       // 强制无视 Chromium 对服务器 GPU 的黑名单限制
        '--disable-gpu-sandbox'         // 必须禁用 GPU 沙盒，否则 headless 模式下浏览器无权访问显卡硬件
    );
}

export const PUPPETEER_OPTIONS = {
    pipe: true,
    headless: true,
    args: base_args
};

export const exportJPEG = async (svg) => await exportsJPEG.convert(svg, {
    quality: 90,
    puppeteer: PUPPETEER_OPTIONS
});

export const exportPNG = async (svg) => await exportsPNG.convert(svg, {
    puppeteer: PUPPETEER_OPTIONS
});

export const exportWEBP = async (svg) => await exportsWEBP.convert(svg, {
    quality: 90,
    puppeteer: PUPPETEER_OPTIONS
});

const EXPORTERS = {
    jpeg: { fn: exportJPEG, mime: 'image/jpeg', format: 'jpeg' },
    jpg:  { fn: exportJPEG, mime: 'image/jpeg', format: 'jpeg' },
    png:  { fn: exportPNG,  mime: 'image/png', format: 'png' },
    webp: { fn: exportWEBP, mime: 'image/webp', format: 'webp' }
};

/**
 * 封装统一的异常处理和响应结束逻辑
 */
async function handleRouter(res, contentType, callback) {
    try {
        await callback();
    } catch (e) {
        console.error(e);
        // 如果在发送前报错，可以安全地设置状态码
        if (!res.headersSent) {
            res.status(500).send(e.stack);
        }
    } finally {
        // 确保连接一定会关闭
        if (!res.writableEnded) {
            res.end();
        }
    }
}
/**
 * 图像路由工厂
 * @param {Function} panelFn - 对应的面板生成函数，如 panel_B1, panel_A2 等
 * @param {Function} [data_loader] - 可选的闭包/回调函数，用于自定义如何从 req 中提取数据
 * @param {string} format - 格式，支持 jpeg，png，webp
 */
export function createImageRouter(panelFn, data_loader = (req) => req.fields || {}, format = DEFAULT_IMAGE_FORMAT) {
    const exporter = getExporter(format)

    return async (req, res) => {
        await handleRouter(res, exporter.mime, async () => {
            let data = await data_loader(req, res);

            if (data === null) {
                return;
            }

            const svg = await panelFn(data);
            const buffer = await exporter.fn(svg);

            res.set('Content-Type', exporter.mime);
            res.send(buffer);
        });
    };
}

/**
 * SVG 路由工厂
 * @param {Function} panelFn - 对应的面板生成函数
 * @param {Function} [data_loader] - 可选的闭包/回调函数，用于自定义如何从 req 中提取数据
 */
export function createSvgRouter(panelFn, data_loader = (req) => req.fields || {}) {
    return async (req, res) => {
        await handleRouter(res, 'image/svg+xml', async () => {
            const data = await data_loader(req, res);

            if (data === null) {
                return;
            }

            const svg = await panelFn(data);
            res.set('Content-Type', 'image/svg+xml');
            res.send(Buffer.from(svg));
        });
    };
}

/**
 * 使用 sharp 测试文件，如果没问题就放行
 * @param path
 * @param fails_delete 如果失败，则删除这个文件
 * @return {Promise<boolean>}
 */
export async function isPictureIntact(path = '', fails_delete = true) {
    if (!path || typeof path !== 'string' || path.trim() === '') return false;

    try {
        await sharp(path).metadata();
        return true;
    } catch (e) {
        if (!fails_delete) return false;

        if (e.code === 'ENOENT') {
            return false;
        }

        try {
            await fs.promises.unlink(path);
        } catch (unlink_error) {
            console.error(`删除损坏文件失败: ${unlink_error.message}`);
        }

        return false;
    }
}

export async function isPicturePng(path = '') {
    if (!path || typeof path !== 'string' || path.trim() === '') return false;

    try {
        const metadata = await sharp(path).metadata();
        // sharp 会将标准 PNG 和 APNG 都识别为 'png'
        return metadata.format === 'png';
    } catch (e) {
        // 文件不存在或文件损坏
        return false;
    }
}

export async function convertPicture(buffer, target_format = 'webp', from_format = null) {
    const exporter = getExporter(target_format)
    const target = exporter.format

    try {
        // pages:1 只保留第一张
        let pipeline = sharp(buffer, {pages: 1});

        let could_process = true;
        if (target === 'png' || target === 'gif') {
            pipeline = pipeline.png({ palette: true, quality: 100, compressionLevel: 6 });
        } else if (target === 'webp') {
            pipeline = pipeline.webp({ quality: 90 });
        } else if (target === 'jpeg' || target === 'jpg') {
            pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
        } else {
            could_process = false;
        }

        if (could_process) {
            return {
                buffer: await pipeline.toBuffer(),
                format: target,
            }
        } else if (from_format != null) {
            return {
                buffer: buffer,
                format: from_format
            }
        } else {
            const meta = await pipeline.metadata();

            return {
                buffer: buffer,
                format: meta.format
            }
        }
    } catch (convert_err) {
        console.error(`[转换失败]`, convert_err.message);
        return null
    }
}

/**
 * 大文件尝试压缩到 webp，小文件不做压缩
 * @param buffer
 * @param max_width
 * @param max_height
 * @param max_file_size {number}
 * @return {Promise<*>}
 */
export async function compressLargePicture2Webp(buffer, max_width = 1920, max_height = null, max_file_size = FILE_SIZE_THRESHOLD) {
    try {
        if (buffer.length <= max_file_size) {
            return buffer;
        }

        let pipeline = sharp(buffer, { animated: true });
        const meta = await pipeline.metadata();

        if (!meta.format || !meta.width || !meta.height) {
            return buffer; // 无效图片，返回原图
        }

        // 3. 判断是否需要缩放
        const src_width = meta.width;
        const src_height = meta.height;

        const over_dimensions = (max_width && src_width > max_width) ||
            (max_height && src_height > max_height);

        if (meta.format === 'webp' && !over_dimensions) {
            return buffer;
        } else if (over_dimensions) {
            pipeline = pipeline.resize({
                width: max_width || undefined,
                height: max_width || undefined,
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        const isLosslessFormat =
            meta.format === 'png'
            || meta.format === 'gif'
            || (meta.format === 'webp' && isLosslessWebP(buffer));

        if (isLosslessFormat) {
            return await pipeline
                .webp({
                    lossless: true,
                    effort: 6
                })
                .toBuffer();
        } else {
            return await pipeline
                .webp({
                    quality: 90,
                    effort: 6,
                    alphaQuality: 80
                })
                .toBuffer();
        }

    } catch (compress_err) {
        // 如果 sharp 内部处理报错（如动图解析失败等），安全返回原 buffer
        console.error(`[压缩失败，原样返回]`, compress_err.message);
        return buffer;
    }
}

/**
 * 压缩图片，接近 1比1 的压缩成 128 x 128，其他最长压缩到 1920 px
 * @param buffer {Buffer}
 * @param max_width
 * @param max_height
 * @return {Promise<Buffer>}
 */
export async function compressPicture(buffer, max_width = 1920, max_height = null) {
    try {
        // pages:1 只保留第一张
        let pipeline = sharp(buffer, {pages: 1});
        const meta = await pipeline.metadata();

        const src_width = meta.width || 0;
        const src_height = meta.height || 0;

        let final_width = max_width;
        let final_height = max_height;

        const need_resize = (final_width && src_width > final_width) || (final_height && src_height > final_height);

        if (need_resize) {
            pipeline = pipeline.resize({
                width: final_width || undefined,
                height: final_height || undefined,
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        let could_process = true;
        if (meta.format === 'png' || meta.format === 'gif') {
            pipeline = pipeline.png({ palette: true, quality: 100, compressionLevel: 6 });
        } else if (meta.format === 'webp') {
            pipeline = pipeline.webp({ quality: 90 });
        } else if (meta.format === 'jpeg' || meta.format === 'jpg') {
            pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
        } else {
            could_process = false;
        }

        if (could_process) {
            return await pipeline.toBuffer();
        } else {
            return buffer
        }
    } catch (compress_err) {
        console.error(`[压缩失败，原样返回]`, compress_err.message);
        return buffer
    }

}

function getExporter(format) {
    const fmt = format.toLowerCase();
    let exporter = EXPORTERS[fmt];

    if (!exporter) {
        console.warn(`Unsupported image format: ${format}. Available formats: jpeg, png, webp. using ${DEFAULT_BASE_FORMAT} instead.`);
        exporter = EXPORTERS[DEFAULT_BASE_FORMAT?.toLowerCase()]
    }

    return exporter;
}

/**
 * @param buffer {Buffer}
 * @return {string}
 */
function getMimeType(buffer) {
    if (!buffer || buffer.length < 4) {
        return 'image/png'; // 兜底
    }

    // 转换为十六进制大写字符串
    const hex = buffer.toString('hex', 0, 4).toUpperCase();

    // 1. 判断 PNG (89 50 4E 47)
    if (hex.startsWith('89504E47')) return 'image/png';

    // 2. 判断 GIF (47 49 46 38)
    if (hex.startsWith('47494638')) return 'image/gif';

    // 3. 判断 JPEG/JPG (FF D8 FF)
    if (hex.startsWith('FFD8FF')) return 'image/jpeg';

    // 4. 判断 BMP (42 4D)
    if (hex.startsWith('424D')) return 'image/bmp';

    // 5. 判断 WEBP (前4字节为 RIFF '52494646'，且 8-11 字节为 WEBP)
    if (hex.startsWith('52494646') && buffer.length > 11) {
        const webpSign = buffer.toString('ascii', 8, 12);
        if (webpSign === 'WEBP') return 'image/webp';
    }

    return 'image/png'; // 默认兜底
}

function isLosslessWebP(imageBuffer) {
    try {
        // 将 Buffer 前 12 个字节转为字符串以便检查
        const header = imageBuffer.slice(0, 12).toString('ASCII');

        // 检查是否为 WebP 格式
        if (!header.startsWith('RIFF') || !header.endsWith('WEBP')) {
            return false; // 不是 WebP 格式
        }

        // 关键一步：检查第 12 个字节（索引 12）开始的 4 个字符
        // 如果是 'VP8L' 则为无损，如果是 'VP8 ' 则为有损
        const chunkType = imageBuffer.slice(12, 16).toString('ascii');
        return chunkType === 'VP8L';
    } catch (error) {
        console.error('检测 WebP 格式失败:', error);
        return false;
    }
}

/**
 * 转换二进制为带正确 MIME 的 Base64 文本
 * @param {Buffer|ArrayBuffer|string} buffer
 */
export function binary2Base64Text(buffer) {
    // 确保是 Node.js Buffer
    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer, 'binary');

    // 获取精准的 MIME 类型
    const mimeType = getMimeType(buf);

    // 转换为 Base64
    const data = buf.toString('base64');

    return `data:${mimeType};base64,${data}`;
}