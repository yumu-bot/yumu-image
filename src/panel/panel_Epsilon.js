import {
    getAvatar,
    getFlagPath,
    getImageFromV3,
    isNotEmptyArray,
    setImage,
    setTexts
} from "../util/util.js";
import {PuHuiTi, TahomaBold, TahomaRegular} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {hex2OKLabBrightness} from "../util/color.js";
import {compositeToWebP, createBufferRouter, createSvgRouter, exportWEBP} from "../util/image.js";
import {isASCII} from "../util/text.js";

export const router = createBufferRouter(panel_Epsilon);

export const router_svg = createSvgRouter(panel_Epsilon_Svg);

export async function panel_Epsilon(data = {
    user: {}
}) {
    const user = data?.user

    // 计算高度
    const has_group_or_title = isNotEmptyArray(user.groups) || user?.title != null

    const height = has_group_or_title ? 560 : 515 // 460

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
    const reg_text = /(?<=<g id="Text">)/;

    const is_supporter = user.supporter === true

    const group = user?.groups?.[0]

    const image = await getAvatar(user);

    const name_text = user?.username ?? 'Unknown'

    const is_ascii = isASCII(name_text)

    const name_font = (is_ascii) ? TahomaRegular : PuHuiTi

    let name_size = (is_ascii) ? 60 : 58

    const name_width = name_font.getTextWidth(name_text, 60)

    if (name_width > 460) {
        name_size -= 10
    }

    const name = name_font.getTextPath(
        name_font.cutStringTail(name_text, name_size, 460, true),
        230, 435, name_size, 'center baseline', '#000'
    );
    const country = await getFlagPath(user?.country_code ?? user?.country?.code, is_supporter ? 95 : 207.5, (has_group_or_title ? 510 : 465) - 3, 30)

    const group_name_color = group?.colour || '#000'

    let group_name_text

    if (user?.title != null) {
        // 多头衔只取最上面那个
        group_name_text = user?.title?.split(' / ')?.[0]
    } else {
        group_name_text = (group?.name ?? '')
            .replaceAll("(Probationary)", "(Prob)")
            .replaceAll("Nominators", "Nominator")
    }

    group_name_text = TahomaBold.cutStringTail(group_name_text, 28, 460)

    const group_name = TahomaBold.getTextPath(group_name_text, 230, 482, 28, 'center baseline', group_name_color)

    const group_name_shadow = (hex2OKLabBrightness(group_name_color) >= 0.7) ?
        TahomaBold.getTextPath(group_name_text, 230 + 1, 482 + 1, 28, 'center baseline', '#000')
        : ''

    const supporter = is_supporter ? PanelDraw.Image(162, has_group_or_title ? 510 : 465, 200, 30, getImageFromV3('object-user-supporter.png')) : ''

    svg = setImage(svg, 0, 0, 460, 460, getImageFromV3('panel-oldavatar.png'), reg_background, 1);
    // svg = setImage(svg, 70, 40, 320, 320, image, reg_avatar, 1);
    svg = setTexts(svg, [name, country, group_name, group_name_shadow, supporter], reg_text);

    const svg_buffer = await exportWEBP(svg)

    return await compositeToWebP(svg_buffer, image, {
        x: 70, y: 40, width: 320, height: 320
    })
}

/**
 * 头像, 面积贴图专用
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Epsilon_Svg(data = {
    user: {}
}) {
    const user = data?.user

    // 计算高度
    const has_group_or_title = isNotEmptyArray(user.groups) || user?.title != null

    const height = has_group_or_title ? 560 : 515 // 460

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

    const group = user?.groups?.[0]

    const image = await getAvatar(user);

    const name_text = user?.username ?? 'Unknown'

    const is_ascii = isASCII(name_text)

    const name_font = (is_ascii) ? TahomaRegular : PuHuiTi

    let name_size = (is_ascii) ? 60 : 58

    const name_width = name_font.getTextWidth(name_text, 60)

    if (name_width > 460) {
        name_size -= 10
    }

    const name = name_font.getTextPath(
        name_font.cutStringTail(name_text, name_size, 460, true),
        230, 435, name_size, 'center baseline', '#000'
    );
    const country = await getFlagPath(user?.country_code ?? user?.country?.code, is_supporter ? 95 : 207.5, (has_group_or_title ? 510 : 465) - 3, 30)

    const group_name_color = group?.colour || '#000'

    let group_name_text

    if (user?.title != null) {
        // 多头衔只取最上面那个
        group_name_text = user?.title?.split(' / ')?.[0]
    } else {
        group_name_text = (group?.name ?? '')
            .replaceAll("(Probationary)", "(Prob)")
            .replaceAll("Nominators", "Nominator")
    }

    group_name_text = TahomaBold.cutStringTail(group_name_text, 28, 460)

    const group_name = TahomaBold.getTextPath(group_name_text, 230, 482, 28, 'center baseline', group_name_color)

    const group_name_shadow = (hex2OKLabBrightness(group_name_color) >= 0.7) ?
        TahomaBold.getTextPath(group_name_text, 230 + 1, 482 + 1, 28, 'center baseline', '#000')
        : ''

    const supporter = is_supporter ? PanelDraw.Image(162, has_group_or_title ? 510 : 465, 200, 30, getImageFromV3('object-user-supporter.png')) : ''

    svg = setImage(svg, 0, 0, 460, 460, getImageFromV3('panel-oldavatar.png'), reg_background, 1);
    svg = setImage(svg, 70, 40, 320, 320, image, reg_avatar, 1);
    svg = setTexts(svg, [name, country, group_name, group_name_shadow, supporter], reg_text);

    return svg;
}
