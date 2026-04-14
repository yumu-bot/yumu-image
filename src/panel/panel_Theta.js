import {
    exportJPEG,
    getImage,
    getImageFromV3,
    getImageFromV3Cache,
    setImage,
    setText,
    setTexts,
    thenPush
} from "../util/util.js";
import {PuHuiTi} from "../util/font.js";
import {getMaimaiCover, getMaimaiRatingPlate} from "../util/maimai.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Theta(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Theta(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 舞萌前辈面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Theta(data = {
    me: {
        name: 'Muz', probername: 'Muziya', dan: 0, plate: '', rating: 14579, plate_id: 0
    },

    other: {
        name: '573', probername: '573_', dan: 12, plate: '', rating: 14954, plate_id: 0
    },

    my_dist: 14579,
    other_dist: 14954,

    my: [1568, 1761, 1763, 1730, 302],
    others: [308, 252, 1429, 753, 1504],
    status: 'DOOMED'
}) {
    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 1200">
    <g id="Background_PT">
    </g>
    <g id="Card_PT">
    </g>
    <g id="Plate_PT">
    </g>
    <g id="Index_PT">
    </g>
</svg>`

    const texts = {
        if_win: '我赢了的话',
        intercourse: '前辈要和我交往哦',
    }

    const doomed = {
        'DOOMED': '完了',
        'DAMN': '不好',
        'DRAW': '那就来吧',
        'DOMINATE': '找死',
        'UNKNOWN': '好吧',
    }

    const regs = {
        index: /(?<=<g id="Index_PT">)/,
        plate: /(?<=<g id="Plate_PT">)/,
        card: /(?<=<g id="Card_PT">)/,
        background: /(?<=<g id="Background_PT">)/,
    };

    svg = setImage(svg, 0, 0, 1200, 1200, getImageFromV3('Maimai', 'background-versus.jpg'), regs.background)

    const text = PuHuiTi.getTextPath(texts.if_win, 550, 220, 80, 'left baseline', '#000')
        + PuHuiTi.getTextPath(texts.intercourse, 550, 300, 80, 'left baseline', '#000')
        + PuHuiTi.getTextPath((doomed[data?.status] ?? doomed.UNKNOWN) + '...', 950, 840, 80, 'center baseline', '#000')


    svg = setText(svg, text, regs.index)

    const me = drawPlate(data?.me?.rating ?? 16384, 680, 620)
    const other = drawPlate(data?.other?.rating ?? 16384, 680, 20)

    svg = setTexts(svg, [me, other], regs.plate)

    const my = await drawCover(data?.my, 0, 960)
    const others = await drawCover(data?.others, 0, 360)

    svg = setTexts(svg, [my.join('\n'), others.join('\n')], regs.card)

    return svg
}

async function drawCover(covers = [0], x = 0, y = 0) {
    const cv = []

    covers.forEach((song_id) => {
        cv.push(getMaimaiCover(song_id))
    })

    const results = []

    await Promise.allSettled(cv)
        .then((res) => thenPush(res, results))

    const images = []

    results.forEach((image, index) => {
        const image_x = x + index * 240
        images.push(getImage(image_x, y, 240, 240, image))
    })

    return images
}

function drawPlate(rating = 0, x = 0, y = 0) {
    const plate = getImage(x, y, 498, 96, getMaimaiRatingPlate(rating))

    const rating_str = rating.toString();
    const offset = 39;
    let current_x = x + 386; // 从最右边的数字位置开始

    const ratings = []

    for (let i = rating_str.length - 1; i >= 0; i--) {
        const digit = rating_str[i];
        const digit_image = getImageFromV3Cache('Maimai', 'UI', `UI_NUM_Drating_${digit}.png`);
        ratings.push(getImage(current_x, y + 24, 45, 51, digit_image))
        current_x -= offset; // 向左移动
    }

    return '<g>' + plate + ratings.join('\n') + '</g>'
}