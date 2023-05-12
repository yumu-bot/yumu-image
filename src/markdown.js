import puppeteer from "puppeteer";

const browser = await puppeteer.launch({args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"]});
const page = await browser.newPage();

const path = `${process.cwd()}/template/markDownTemplate/index.html`;

export async function Markdown(md = "", width = 600) {

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
    const buffer = await body.screenshot({omitBackground: false, encoding: 'binary'});

    await page.evaluate(() => {
        window.setStr(null);
    });

    return buffer;

}