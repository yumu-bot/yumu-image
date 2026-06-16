import JPEGProvider from '../svg-to-image/JPEGProvider.js';
import PNGProvider from '../svg-to-image/PNGProvider.js';
import WEBPProvider from '../svg-to-image/WEBPProvider.js';
import {API} from "../svg-to-image/API.js";

const FORMAT = process.env.IMAGE_FORMAT ?? 'webp'

const exportsJPEG = new API(new JPEGProvider());
const exportsPNG = new API(new PNGProvider());
const exportsWEBP = new API(new WEBPProvider());

export const PUPPETEER_OPTIONS = {
    pipe: true,
    headless: true,
    args: [
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
    ]
};

export const exportJPEG = async (svg) => await exportsJPEG.convert(svg, {
    quality: 90,
    puppeteer: PUPPETEER_OPTIONS
});

export const exportPNG = async (svg) => await exportsPNG.convert(svg, {
    puppeteer: PUPPETEER_OPTIONS
});

export const exportWEBP = async (svg) => await exportsWEBP.convert(svg, {
    quality: 80,
    puppeteer: PUPPETEER_OPTIONS
});

const EXPORTERS = {
    jpeg: { fn: exportJPEG, mime: 'image/jpeg' },
    jpg:  { fn: exportJPEG, mime: 'image/jpeg' },
    png:  { fn: exportPNG,  mime: 'image/png' },
    webp: { fn: exportWEBP, mime: 'image/webp' }
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
export function createImageRouter(panelFn, data_loader = (req) => req.fields || {}, format = FORMAT) {
    // 标准化格式名称为小写
    const fmt = format.toLowerCase();
    let exporter = EXPORTERS[fmt];

    if (!exporter) {
        console.warn(`Unsupported image format: ${format}. Available formats: jpeg, png, webp. using jpeg instead.`);
        exporter = EXPORTERS.jpeg
    }

    return async (req, res) => {
        await handleRouter(res, exporter.mime, async () => {
            const data = await data_loader(req, res);

            if (data === null) {
                return;
            }

            const svg = await panelFn(data);
            const imageData = await exporter.fn(svg);

            res.set('Content-Type', exporter.mime);
            res.send(imageData);
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