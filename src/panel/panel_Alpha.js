import {exportPng, PuHuiTi} from "../util.js";

export async function router(req, res) {
    try {
        const data = await panel_Alpha(req.fields.strs || []);
        res.set('Content-Type', 'image/png');
        res.send(data);
    } catch (e) {
        res.status(500).send(e.stack);
    }
}

// 别他妈瞎几把乱起了看看隔壁的 Panel J 是干啥的行不
export async function panel_Alpha(strArray = ['']) {
    let maxWidth = 0;
    let befY = 10;
    let textLine = await Promise.all(strArray.map(async (s, index) => {
        const info = await PuHuiTi.getTextMetrics(s, 0, 0, 30);
        const w = info.width;
        const h = info.height;
        const line = PuHuiTi.getTextPath(s, 10, befY + h, 30, 'left', getRandomColor());
        maxWidth = Math.max(maxWidth, w);
        befY += h + 10;
        return line;
    }));
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxWidth + 50}" height="${befY + 20}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${maxWidth + 50} ${befY + 20}">
    <rect width="100%" height="100%" fill="#2A2226" />
    ${textLine.join("\n")}
</svg>`
    return await exportPng(svg);
}

// 这个版本的颜色组，是lazer中hover用户名时显示的颜色
const colorLazerGroup = ["#F5409B", "#E04D4D", "#B2FFF8", "#CBAAFF",
    "#85FFFF", "#FFFF93", "#FFE5DD", "#FFE8FF",
    "#FFFFED", "#FFA6FF", "#FA7C7C", "#62EDFF",
    "#FFFFB6", "#8DE0CA", "#C8FFFF", "#A5C6A3"];
    /*
    ["#4e54c8", "#8f94fb", "#11998e", "#11998e",
    "#FC5C7D", "#FC5C7D", "#74ebd5", "#ACB6E5",
    "#7F00FF", "#7F00FF",];

     */

function getRandomColor() {
    let i = Math.floor(Math.random() * 16);
    return colorLazerGroup[i];
}