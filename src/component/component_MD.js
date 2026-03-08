import puppeteer from "puppeteer";
import path from "path";
import {getBrowserInstance} from "../util/util.js";

const path_util = path;

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
    let browser = await getBrowserInstance()
    let page = await browser.newPage();

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

