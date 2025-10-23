import {
    exportJPEG, getAvatar, getImageFromV3,
    setTexts, round, getGameMode, getBanner, setText
} from "../util/util.js";
import {TahomaRegular} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_Epsilon2(data);
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
        const svg = await panel_Epsilon2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 怀旧头像，2013 年左右的 osu 内卡片
 * @param data
 * @return {Promise<string>}
 */
export async function panel_Epsilon2(data = {
    user: {}
}) {
    const user = data?.user

    // 导入模板
    let svg = `<?xml version="1.0" encoding="UTF-8"?> 
    <svg xmlns="http://www.w3.org/2000/svg" width="332" height="87" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 332 87">
    <defs>
        <clipPath id="clippath-avatar">
            <rect x="5" y="6" width="75" height="75" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-progress">
        </clipPath>
    </defs>
    <g id="Base">
    </g>
    <g id="Background">
    </g>
    <g id="Progress" style="clip-path: url(#clippath-progress);">
        <rect x="127" y="70" width="195" height="7" rx="3.5" ry="3.5" style="fill: #B0F1BB;"/>
    </g>
    <g id="Avatar" style="clip-path: url(#clippath-avatar);">
    </g>
    <g id="Text">
    </g>
    <g id="Overlay">
    </g>
    </svg>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base">)/;
    const reg_background = /(?<=<g id="Background">)/;
    const reg_avatar = /(?<=<g id="Avatar" style="clip-path: url\(#clippath-avatar\);">)/;
    const reg_text = /(?<=<g id="Text">)/;
    const reg_overlay = /(?<=<g id="Overlay">)/;
    const reg_progress = /(?<=<clipPath id="clippath-progress">)/;

    const base = PanelDraw.LinearGradientRect(0, 0, 332, 87, 0,
        ['#3A3F57', '#0C0E1A'], 1, [0, 100], [0, 100]
    )

    const avatar = PanelDraw.Image(5, 6, 75, 75, await getAvatar(user.avatar_url))

    const avatar_base = PanelDraw.Rect(5, 6, 75, 75, 0, '#B0F1BB', 1)

    const avatar_overlay = PanelDraw.StrokeRect(5, 6, 75, 75, 0, '#B0F1BB', 1, 1)

    const name_text = TahomaRegular.cutStringTail(user?.username ?? 'Unknown', 20, 235, true)

    const name = getShadowPath(name_text, 90, 22, 20)

    let pp_text

    if (user?.pp > 0) {
        pp_text = 'pp: ' + Math.round(user?.pp ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' '
    } else {
        pp_text = ''
    }

    const pp_score_text = pp_text + 'Score:' + round(user?.statistics?.total_score, 1, -1).toLowerCase()

    const pp_score = getShadowPath(pp_score_text, 89, 40, 14)

    const acc_text = 'Accuracy:' + round((user?.accuracy ?? 0), 2) + '%'

    const acc = getShadowPath(acc_text, 88, 56, 14)

    const lv_text = 'Lv' + (user?.level_current ?? 0)

    const lv = getShadowPath(lv_text, 89, 72, 14)

    const lv_progress = PanelDraw.Rect(127, 70, 195 * ((user?.level_progress ?? 0) / 100), 7, 0, '#B0F1BB')

    const lv_stroke = PanelDraw.StrokeRect(127, 70, 195, 7, 3.5, '#fff', 1, 1)

    const mode = PanelDraw.Image(291, 9, 33, 33, getGameModePath(user?.mode), 0.3)

    let rank_color
    if ((user?.statistics?.global_rank ?? 1001) <= 1000) {
        rank_color = '#ffff00'
    } else {
        rank_color = '#fff'
    }

    const rank = TahomaRegular.getTextPath('#' + (user?.statistics?.global_rank ?? 0), 324, 66, 48, 'right baseline', rank_color, 0.3)

    const background = PanelDraw.Image(0, 0, 332, 87, await getBanner(user?.cover_url), 0.6)

    svg = setTexts(svg, [base, avatar_base], reg_base)
    svg = setText(svg, background, reg_background)
    svg = setText(svg, avatar, reg_avatar)
    svg = setText(svg, lv_progress, reg_progress)
    svg = setTexts(svg, [avatar_overlay, lv_stroke], reg_overlay)
    svg = setTexts(svg, [name, pp_score, acc, lv, mode, rank], reg_text)

    return svg.toString();
}

function getGameModePath(mode) {
    let path = ''

    switch (getGameMode(mode, 1)) {
        case 'o': path = 'mode-osu-small.png'; break;
        case 't': path = 'mode-taiko-small.png'; break;
        case 'c': path = 'mode-fruits-small.png'; break;
        case 'm': path = 'mode-mania-small.png'; break;
    }

    return getImageFromV3(path)
}

function getShadowPath(text, x, y, size, anchor = 'left baseline', fill = '#fff', fill2 = '#000') {
    return TahomaRegular.getTextPath(text, x + 1, y + 1, size, anchor, fill2) +
        TahomaRegular.getTextPath(text, x, y, size, anchor, fill)
}
