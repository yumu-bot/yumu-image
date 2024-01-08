import puppeteer from "puppeteer";
import {base64Text2PngStr} from "../util/util.js";

const browser = await puppeteer.launch({args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"]});
const page = await browser.newPage();

const path = `${process.cwd()}/template/Card_Alpha/index.html`;

export async function router(req, res) {
    try {
        const data = await card_Alpha(req.fields.md || "# Error: no value", req.fields.width || 600);
        res.set('Content-Type', 'image/jpeg');
        res.send(data);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

export async function getCardAlpha(markdown = "", width = 600) {
    try {
        const data = await card_Alpha(markdown || "# Error: no value", width);
        return base64Text2PngStr(data.image)
    } catch (e) {

    }
}

async function card_Alpha(md = "", width = 600) {
    await page.setViewport({
        width: width,
        height: 1080,
        isMobile: false,
    });
    await page.goto('file://' + path);
    await page.evaluate(([markdownStr]) => {
        window.setStr(markdownStr);
    }, [md]);
    await page.waitForSelector('article', {
        timeout: 2000
    });
    const body = await page.$('body');
    const box = await body.boundingBox()
    const buffer = await body.screenshot({omitBackground: true, encoding: 'binary'});

    await page.evaluate(() => {
        window.setStr(null);
    });

    return {
        image: buffer,
        width: box.width,
        height: box.height,
    };

}