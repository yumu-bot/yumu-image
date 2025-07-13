import {
    exportJPEG, getAvatar, getFlagPath, getImageFromV3,
    setImage, isNotEmptyArray, setTexts
} from "../util/util.js";
import {TahomaBold, TahomaRegular} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Epsilon(data);
        res.set('Content-Type', 'image/png');
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
        const svg = await panel_Epsilon(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 头像, 面积贴图专用
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Epsilon(data = {
    user: {}
}) {
    const user = data?.user

    // 计算高度
    const has_group = isNotEmptyArray(user.groups)

    const height = has_group ? 560 : 515 // 460

    // 导入模板
    let svg = `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" width="460" height="${height}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 ${height}">
    <g id="Base">
        <rect width="460" height="${height}" rx="0" ry="0" style="fill: #f1eefb;"/>
    </g>
    <g id="Background">
    </g>
    <g id="Avatar">
    </g>
    <g id="Text">
    </g>
    </svg>`;

    // 路径定义
    const reg_background = /(?<=<g id="Background">)/;
    const reg_avatar = /(?<=<g id="Avatar">)/;
    const reg_text = /(?<=<g id="Text">)/;

    const is_supporter = user.supporter === true

    const group = has_group ? user.groups[0] : null
    const name_color = group?.colour || '#000'

    const image = await getAvatar(user?.avatar_url, true);

    const name_width = TahomaRegular.getTextWidth(user?.username || 'Unknown', 60)

    let name_size

    if (name_width > 460) {
        name_size = 50
    } else {
        name_size = 60
    }

    const name = TahomaRegular.getTextPath(
        TahomaRegular.cutStringTail(user?.username || 'Unknown', name_size, 460, true),
        230, 435, name_size, 'center baseline', name_color
    );
    const country = await getFlagPath(user?.country?.code, is_supporter ? 95 : 207.5, (has_group ? 510 : 465) - 3, 30)
    const group_name = TahomaBold.getTextPath((group?.name || '').replaceAll("(Probationary)", "(Prob)"), 230, 482, 28, 'center baseline', '#000')

    const supporter = is_supporter ? PanelDraw.Image(162, has_group ? 510 : 465, 200, 30, getImageFromV3('object-user-supporter.png')) : ''

    svg = setImage(svg, 0, 0, 460, 460, getImageFromV3('panel-oldavatar.png'), reg_background, 1);
    svg = setImage(svg, 70, 40, 320, 320, image, reg_avatar, 1);
    svg = setTexts(svg, [name, country, group_name, supporter], reg_text);

    return svg.toString();
}
