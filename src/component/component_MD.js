import puppeteer from "puppeteer";
import path from "path";

const path_util = path;

const browser = await puppeteer.launch({args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"]});
const page = await browser.newPage();

const template_path = `${process.cwd()}/template/Card_Alpha`;

export async function router(req, res) {
    try {
        const data = await component_MD(req.fields.md || "# Error: no value", req.fields.width || 1920);
        res.set('Content-Type', 'image/jpeg');
        res.send(data);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
}

/*
export async function component_MD(markdown = "", width = 1920, height = 600) {

    return await markdownToScreenshot(markdown, {width, height, quality: -1});
}

 */

/**
 * 将 Markdown 转换为截图并返回 base64
 * @param {string} markdown - Markdown 文本
 * @param {Object} options - 配置选项
 * @returns {Promise<string>} - base64 编码的 PNG 图片
 */
/*
async function markdownToScreenshot(markdown, options = {}) {
    const {
        width = 1920,
        height = 600,
        quality = 80
    } = options;

    let browser;
    try {
        // 启动 headless 浏览器
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 设置视口大小
        await page.setViewport({
            width: width,
            height: height,
            isMobile: false,
        });

        // 将 Markdown 转换为 HTML
        const htmlContent = await markdownToHTML(markdown);

        // 设置页面内容
        await page.goto('file://' + path);

        await page.evaluate(([html]) => {
            document.body.innerHTML = html;
        }, [htmlContent]);

        // 等待内容渲染完成

        await page.waitForFunction(() => {
            return document.readyState === 'complete' &&
                document.body.children.length > 0;
        }, { timeout: 2000 });

        let opt

        if (options.quality > 0 && options.quality <= 100) {
            opt = {
                encoding: 'base64',
                type: 'jpeg',
                quality: quality,
                omitBackground: false
            }
        } else {
            opt = {
                encoding: 'base64',
                type: 'png',
                omitBackground: false
            }
        }

        // 截图并获取 base64

        const body = await page.$('body');
        const box = await body.boundingBox()
        const buffer = await body.screenshot(opt);

        return {
            image: 'data:image/png;base64,' + buffer,
            width: box.width,
            height: box.height,
        }

    } catch (error) {
        console.error('截图生成失败:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
*/

/**
 * 将 Markdown 转换为完整的 HTML 页面
 * @param {string} markdown - Markdown 文本
 * @returns {Promise<string>} - 完整的 HTML 字符串
 */

/*
async function markdownToHTML(markdown) {
    // 将 Markdown 转换为 HTML

    const contentHTML = await marked.parse(markdown);

    let reg_body = /(?<=<body>)/;

    return readTemplate(path).replace(reg_body, contentHTML)
}
*/

function resolveMarkdownImages(markdown = "", markdown_dir = "", template_path = "") {

    const regex = /!\[(.*?)]\((.*?)\)/g;

    return markdown.replace(regex, (match, image_text, image_url) => {
        // 跳过绝对路径和网络路径
        if (image_url.startsWith('http://') ||
            image_url.startsWith('https://') ||
            image_url.startsWith('/')) {
            return match;
        }

        // 解析图片的绝对路径
        const absolute_image_path = path_util.resolve(markdown_dir, image_url);

        // 计算相对于目标目录的相对路径（使用正斜杠）
        let relative_path = path_util.relative(template_path, absolute_image_path);
        relative_path = relative_path.replace(/\\/g, '/'); // 将反斜杠转换为正斜杠

        return `![${image_text}](${relative_path})`;
    });


}


/**
 * 获取 md 页面
 * @param markdown
 * @param width
 * @param height
 * @param markdown_dir 如果这个 markdown 有图片，可以在这里定位这个 markdown 的绝对路径，此时图片才能正常显示
 * @return {Promise<{image: string, width: number, height: number}>}
 */
export async function component_MD(markdown = "", width = 1080, height = 600, markdown_dir = null) {
    await page.setViewport({
        width: width,
        height: height,
        isMobile: false,
    });

    let md
    if (markdown_dir) {
        md = resolveMarkdownImages(markdown, markdown_dir, template_path)
    } else {
        md = markdown
    }

    await page.goto('file://' + template_path + "/index.html");
    await page.evaluate(([markdownStr]) => {
        window.setStr(markdownStr);
    }, [md]);

    // 等待网络空闲，确保所有资源加载完成
    await page.waitForNetworkIdle();

    await page.waitForSelector('article', {
        timeout: 2000
    });

    const body = await page.$('body');
    const box = await body.boundingBox()
    const buffer = await body.screenshot({type: "png", omitBackground: false, encoding: 'base64'});

    await page.evaluate(() => {
        window.setStr(null);
    });

    return {
        image: 'data:image/png;base64,' + buffer,
        width: box.width,
        height: box.height,
    };

}

