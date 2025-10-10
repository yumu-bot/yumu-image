import puppeteer from "puppeteer";

const browser = await puppeteer.launch({args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"]});
const page = await browser.newPage();

const path = `${process.cwd()}/template/Card_Alpha/index.html`;

export async function router(req, res) {
    try {
        const data = await component_MD(req.fields.md || "# Error: no value", req.fields.width || 600);
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



export async function component_MD(md = "", width = 1080, height = 600) {
    await page.setViewport({
        width: width,
        height: height,
        isMobile: false,
    });
    await page.goto('file://' + path);
    await page.evaluate(([markdownStr]) => {
        window.setStr(markdownStr);
    }, [md]);

    /*
    await page.waitForSelector('article', {
        timeout: 2000
    });

     */

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

