import JPEGProvider from '../svg-to-image/JPEGProvider.js';
import PNGProvider from '../svg-to-image/PNGProvider.js';
import WEBPProvider from '../svg-to-image/WEBPProvider.js';
import {API} from "../svg-to-image/API.js";
import sharp from "sharp";
import fs from "fs";
import WebP from "node-webpmux";
import UPNG from 'upng-js';

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
    '--no-sandbox',
    '--disable-breakpad',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--js-flags="--max-old-space-size=1024"',
    '--disable-gpu-compositing',        // 所有平台都禁用合成阶段的 GPU（规避显存同步冲突）
    '--disable-features=UseSkiaRenderer', // 强制 GPU 加速渲染
    '--ignore-gpu-blocklist',            // 无视黑名单
    '--disable-breakpad',
    '--no-zygote',
    '--no-first-run',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
];

// 2. 根据操作系统，动态追加硬件加速参数
if (process.platform === 'win32') {
    // Windows：强制 ANGLE + 独显
    base_args.push(
        '--use-angle=angle',            // 使用 ANGLE 层
        '--use-angle=default',          // 让 ANGLE 自动选 D3D11
        '--disable-gpu-sandbox',         // 允许 GPU 进程访问硬件

        '--window-position=-32000,-32000',
        '--disable-features=CalculateNativeWinOcclusion', // 关闭原生窗口遮挡计算（防止检测桌面状态）
        '--disable-features=TabHoverCardImages',          // 关闭标签卡预览图生成（防止后台隐蔽生成UI图层）
        '--disable-backgrounding-occluded-windows',       // 关闭被遮挡窗口的后台化逻辑（强制保持无UI逻辑）
        '--disable-renderer-backgrounding',               // 关闭渲染器后台化
        '--no-pings',                                     // 关掉所有内置的链路打点检测
        '--mute-audio'
);
} else if (process.platform === 'linux') {
    base_args.push(
        '--use-gl=egl',                 // 使用 EGL 后端
        '--enable-features=Vulkan',     // 启用 Vulkan 加速
        '--disable-gpu-sandbox',        // Linux headless 必须
        '--enable-features=WebGL2ComputeContext'
    );
} else {
    // macOS（如果你以后要部署）
    base_args.push(
        '--use-gl=angle',               // macOS 用 ANGLE 的 Metal 后端
        '--enable-features=UseMetal'
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
export function createBufferRouter(panelFn, data_loader = (req) => req.fields || {}, format = 'webp') {
    const mime = getExporter(format).mime

    return async (req, res) => {
        await handleRouter(res, mime, async () => {
            let data = await data_loader(req, res);

            if (data === null) {
                return;
            }

            const buffer = await panelFn(data);

            res.set('Content-Type', mime);
            res.send(buffer);
        });
    };
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

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

/**
 * 通过读取文件头（前8字节）判断是否为 PNG/APNG
 * 此方法不依赖任何图像处理库，只检查文件签名
 *
 */
export async function isPicturePng(path = '') {
    if (!path || typeof path !== 'string' || path.trim() === '') {
        return false;
    }

    try {
        // 只读取前8个字节就够了
        const fileHandle = await fs.promises.open(path, 'r');
        try {
            const buffer = Buffer.alloc(8);
            const { bytesRead } = await fileHandle.read(buffer, 0, 8, 0);

            // 如果文件 小于8字节，肯定不是合法PNG
            if (bytesRead < 8) {
                return false;
            }

            // 比较文件签名
            return buffer.equals(PNG_SIGNATURE);
        } finally {
            await fileHandle.close();
        }
    } catch (e) {
        // 文件不存在、无权限或其他IO错误
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
 * @return {Promise<Buffer>}
 */
export async function compressLargePicture2Webp(buffer, max_width = 1920, max_height = null, max_file_size = FILE_SIZE_THRESHOLD) {
    try {
        if (buffer.length <= max_file_size) {
            return buffer;
        }

        let pipeline = sharp(buffer, {
            animated: true,
            pages: -1,
            limitInputPixels: true
        });
        const meta = await pipeline.metadata();

        // sharp 对 apng 的支持不好
        if (meta.format === 'png' && await isApng(buffer)) {
            return buffer
        }

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
                height: max_height || undefined,
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        const isLosslessFormat = meta.format === 'gif' || (meta.format === 'webp' && isLosslessWebP(buffer));

        if (isLosslessFormat) {
            const options = {
                lossless: true,
                effort: 6,
                loop: meta.loop || 0  // 保持循环设置
            };


            // 只有在有延迟数据时才设置
            if (meta.delay) {
                options.delay = Array.isArray(meta.delay) ? meta.delay : [meta.delay];
            }

            return await pipeline
                .webp(options)
                .toBuffer();
        } else {
            const options = {
                quality: 90,
                effort: 6,
                alphaQuality: 80,
                loop: meta.loop || 0
            };

            // 只有在有延迟数据时才设置
            if (meta.delay) {
                options.delay = Array.isArray(meta.delay) ? meta.delay : [meta.delay];
            }

            return await pipeline
                .webp(options)
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

/**
 *
 * @param background 背景图片，需要大一点
 * @param animated 放在前面的动态图
 * @param options 设置动态图的位置宽高，以及成图的质量
 * @return {Promise<*>}
 */
export async function compositeToWebP(background, animated, options = {}) {
    const {
        x = 0,
        y = 0,
        width = null,
        height = null,
        quality = 90,
        loop = 0
    } = options;

    // 1. 获取背景的元数据和 Buffer
    const bg_metadata = await sharp(background).metadata();
    const background_buffer = await sharp(background).toBuffer();

    // 2. 先获取 animated 的基础元数据
    let apng_frames = null;

    // 3. 核心修正：如果格式是 PNG，通过 upng-js 重新验证它是否为 APNG
    let animated_buffer;

    function streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', (err) => reject(err));
        });
    }

    if (Buffer.isBuffer(animated)) {
        animated_buffer = animated;
    } else if (typeof animated === 'string') {
        animated_buffer = await fs.promises.readFile(animated);
    } else if (animated && typeof animated.pipe === 'function') {
        animated_buffer = await streamToBuffer(animated);
    }

    let pages
    let delays

    if (isApngFromBuffer(animated_buffer)) {
        // 确保转换为 Buffer 供 UPNG 解码
        const img = UPNG.decode(animated_buffer);

        // 如果 upng 解出来帧数大于 1，说明这确实是一个 APNG
        if (img.frames && img.frames.length > 1) {
            pages = img.frames.length;
            delays = img.frames.map(f => f.delay);

            // 将 APNG 的每帧 RGBA 像素数据包装为 sharp 认识的单帧 PNG
            apng_frames = UPNG.toRGBA8(img).map((rgba8Frame) => {
                return sharp(Buffer.from(rgba8Frame), {
                    raw: {
                        width: img.width,
                        height: img.height,
                        channels: 4
                    }
                }).png();
            });
        }
    } else {
        // 原来的获取
        const animated_metadata = await sharp(animated, { animated: true }).metadata();

        pages = animated_metadata.pages ?? 1;
        delays = animated_metadata.delay || Array(pages).fill(100);
    }

    await WebP.Image.initLib();
    const frames = [];

    // 4. 逐帧合成
    for (let i = 0; i < pages; i++) {
        let frame_pipeline;

        if (apng_frames) {
            // APNG 分支：直接使用 upng-js 拆解出来的单帧 sharp 实例
            frame_pipeline = apng_frames[i];
        } else {
            // GIF / WebP 分支：使用 sharp 原生的逐帧读取
            frame_pipeline = sharp(animated, {
                animated: true,
                page: i,
                pages: 1
            });
        }

        // 尺寸缩放
        if (width || height) {
            frame_pipeline = frame_pipeline.resize({
                width: width || undefined,
                height: height || undefined,
                fit: 'inside'
            });
        }

        const frame_buffer = await frame_pipeline.webp({ lossless: true }).toBuffer();

        // 与背景合成
        const composite_webp_buffer = await sharp(background_buffer)
            .composite([{ input: frame_buffer, left: x, top: y }])
            .webp({ quality: quality })
            .toBuffer();

        const current_delay = Array.isArray(delays) ? (delays[i] || 100) : delays;

        const frame_generated = await WebP.Image.generateFrame({
            buffer: composite_webp_buffer,
            delay: current_delay,
            x: 0,
            y: 0,
            blend: true,
            dispose: false
        });

        frames.push(frame_generated);
    }

    return await WebP.Image.save(null, {
        width: bg_metadata.width,
        height: bg_metadata.height,
        frames: frames,
        loops: loop
    });
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
 * 通过读取 PNG 内部数据块，判断是否为 APNG
 * @param input {string | Buffer}
 * @returns true 表示是 APNG，false 表示是静态 PNG 或非 PNG
 */
export async function isApng(input) {
    let buffer;

    if (typeof input === 'string') {
        // 读取整个文件，但只解析到找到 acTL 为止
        // 实际上我们可以只读取前 1MB，因为 acTL 通常在文件开头
        const fileHandle = await fs.promises.open(input, 'r');
        try {
            // 读取前 1MB 足够，acTL 通常在前几个数据块中
            buffer = Buffer.alloc(1024 * 1024);
            const { bytesRead } = await fileHandle.read(buffer, 0, buffer.length, 0);
            buffer = buffer.subarray(0, bytesRead);
        } finally {
            await fileHandle.close();
        }
    } else {
        buffer = input;
    }

    return isApngFromBuffer(buffer);
}

/**
 *
 * 从 Buffer 判断是否为 APNG
 * 通过查找 PNG 数据块中的 acTL（动画控制块）
 * @param buffer {Buffer}
 */
export function isApngFromBuffer(buffer) {
    // 1. 检查 PNG 签名 (8字节)
    const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
        return false; // 不是 PNG
    }

    // 2. 从第 8 字节开始解析数据块
    let offset = 8;

    while (offset + 12 <= buffer.length) {
        // 每个数据块结构: [长度:4] [类型:4] [数据:长度] [CRC:4]
        const chunkLength = buffer.readUInt32BE(offset);
        const chunkType = buffer.subarray(offset + 4, offset + 8).toString('ascii');

        // 3. 如果找到 acTL 块，说明是 APNG
        if (chunkType === 'acTL') {
            return true;
        }

        // 4. 如果遇到 IEND 块，还没有 acTL，说明是静态 PNG
        if (chunkType === 'IEND') {
            return false;
        }

        // 5. 移动到下一个数据块（长度 + 类型 + 数据 + CRC）
        // 注意：数据块长度 = chunkLength，加上 4(长度) + 4(类型) + 4(CRC) = 12 字节头部/尾部
        offset += 12 + chunkLength;
    }

    // 如果扫描完还没找到 acTL，默认不是 APNG
    return false;
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