import puppeteer from "puppeteer";

const browser = await puppeteer.launch({args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"]});
const page = await browser.newPage();

const path = `${process.cwd()}/template/markDownTemplate/index.html`;

export async function router(req, res) {
    try {
        const data = await Markdown(req.fields.md || "# Error: no value", req.fields.width || 600);
        res.set('Content-Type', 'image/jpeg');
        res.send(data.image);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
}

/**
 *
 * @param {string} md
 * @param {number} [width]
 * @return {Promise<{image: Buffer, width:number, height:number}>}
 */
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
    const box = await body.boundingBox()
    const buffer = await body.screenshot({type:"png", omitBackground: false, encoding: 'binary'});

    await page.evaluate(() => {
        window.setStr(null);
    });

    return {
        image: buffer,
        width: box.width,
        height: box.height,
    };

}
