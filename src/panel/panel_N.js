import {
    exportJPEG, getAvatar,
    getImageFromV3,
    getPanelNameSVG,
    getRoundedNumberStr,
    implantImage,
    implantSvgBody, isEmptyArray, readNetImage,
    readTemplate,
    replaceText,
    replaceTexts, transformSvgBody
} from "../util/util.js";
import {card_A2} from "../card/card_A2.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_O1} from "../card/card_O1.js";
import {PuHuiTi, torus} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_N(data);
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
        const svg = await panel_N(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function panel_N(
    data = {}
) {
    // 导入模板
    let svg = readTemplate('template/Panel_N.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index_PN">)/;
    const reg_beatmap_A2 = /(?<=<g id="BeatMap_A2">)/;

    const reg_me = /(?<=<g id="Me_PN">)/;
    const reg_guest = /(?<=<g id="Guest_PN">)/;
    const reg_progress = /(?<=<g id="Progress_PN">)/;
    const reg_tag = /(?<=<g id="Tag_PN">)/;
    const reg_discussion = /(?<=<g id="Discussion_PN">)/;
    const reg_favorite = /(?<=<g id="Favorite_PN">)/;
    const reg_genre = /(?<=<g id="Genre_PN">)/;

    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PN1-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Nomination (!ymn)', 'N', 'v0.5.0 DX');

    // 插入文字
    svg = replaceText(svg, panel_name, reg_index);

    // 导入A1
    const cardA2 = await card_A2(await PanelGenerate.beatMapSet2CardA2(data?.beatmapset));

    // 导入O1
    const cardO1 = await card_O1(await PanelGenerate.user2CardO1(data?.beatmapset?.user));

    // 导入一些标签
    const guest_title = torus.getTextPath('Guest Mappers', 60, 730, 30, 'left baseline', '#fff');
    const tag_title = torus.getTextPath('Tags', 60, 910, 30, 'left baseline', '#fff');
    const progress_title = torus.getTextPath('Ranking Progress', 510, 365, 30, 'left baseline', '#fff');
    const discussion_title = torus.getTextPath('Modding Discussion', 510, 645, 30, 'left baseline', '#fff');
    const favorite_title = torus.getTextPath('Favorites', 1630, 645, 30, 'left baseline', '#fff');
    const genre_title = torus.getTextPath('G/L', 1630, 925, 30, 'left baseline', '#fff');

    svg = replaceTexts(svg, [favorite_title, tag_title, progress_title, discussion_title, guest_title, genre_title], reg_index);

    // 插入1号卡标签
    const total_length = data?.more?.total_length || 0;

    const diff_str_b = data?.more?.host_count.toString() || '0';
    const diff_str_m = data?.more?.total_count.toString() || '0';
    const star_str_b = data?.more?.min_star || '0';
    const star_str_m = data?.more?.max_star || '0';
    const length_str_b = Math.floor(total_length / 60).toString();
    const length_str_m = (total_length % 60).toString().padStart(2, "0");

    const diff = torus.get2SizeTextPath(diff_str_b, '/' + diff_str_m, 42, 30, 120, 616, 'center baseline', '#fff');
    const star = (data?.more?.min_star !== "") ? torus.get2SizeTextPath(star_str_b, '~' + star_str_m, 42, 30, 255, 616, 'center baseline', '#fff') :
        torus.getTextPath(star_str_m,255, 616, 42,'center baseline', '#fff')
    ;
    const length = torus.get2SizeTextPath(length_str_b, ':' + length_str_m, 42, 30, 390, 616, 'center baseline', '#fff');

    const diff_index = torus.getTextPath('Diff', 120, 648, 24, 'center baseline', '#aaa');
    const star_index = torus.getTextPath('Star', 255, 648, 24, 'center baseline', '#aaa');
    const length_index = torus.getTextPath('Length', 390, 648, 24, 'center baseline', '#aaa');

    svg = replaceTexts(svg, [diff, star, length], reg_index);
    svg = replaceTexts(svg, [diff_index, star_index, length_index], reg_index);

    // 插入8号卡标签
    const pack_tags = data?.beatmapset?.pack_tags || []

    const stat_str = '(?) Not Solved ' + (data?.more?.not_solved_count || 0)
        + ' // (!) Problem ' + (data?.more?.problem_count || 0)
        + ' // ( ) Suggestion ' + (data?.more?.suggest_count || 0)
        + ' // (*) Praise ' + (data?.more?.praise_count || 0)
        + ' // Pack ' + (pack_tags[0] || "null")
        + ' // Rate ' + getRoundedNumberStr(data?.beatmapset?.public_rating, 2);

    const stat = torus.getTextPath(stat_str, 1570, 645, 18, 'right baseline', '#aaa');

    svg = replaceTexts(svg, [stat], reg_discussion);

    // 导入 Tag
    const tag = getTagPanel(data?.more?.tags, 60, 940);

    // 导入 Guest
    const guest = await getGuestPanel(data?.beatmapset?.mappers, 54, 745);

    // 导入 Progress
    const progress = await getRankingProgressPanel(data?.beatmapset, data?.hype, data?.users, data?.more, 490, 330)

    // 导入 Favorite
    const favorite = await getFavoritePanel(data?.beatmapset?.recent_favourites, 1620, 660);

    // 导入 Discussion
    const discussion = await getDisscussionPanel(data?.discussion, data?.users, 510, 660);

    // 导入 Favorite
    const genre = getGenrePanel(data?.beatmapset?.genre, data?.beatmapset?.language);

    svg = replaceText(svg, tag, reg_tag);
    svg = replaceText(svg, guest, reg_guest);
    svg = replaceText(svg, progress, reg_progress);
    svg = replaceText(svg, favorite, reg_favorite);
    svg = replaceText(svg, discussion, reg_discussion);
    svg = replaceText(svg, genre, reg_genre);

    // 插入图片和部件（新方法
    const cover = await readNetImage(data?.beatmapset?.covers?.cover, true);
    svg = implantImage(svg,1920, 320, 0, 0, 0.8, cover, reg_banner);
    svg = implantSvgBody(svg, 40, 40, cardA2, reg_beatmap_A2);
    svg = implantSvgBody(svg, 60, 350, cardO1, reg_me);

    return svg.toString();
}

function getTagPanel(tags = [""], x, y, size = 18, color = '#3399CC', max_width = 390, max_row = 4) {
    let line = "";
    let row = 1;
    let out = "";

    const blank_width = PuHuiTi.getTextWidth(' ', size);

    for (const t of tags) {
        const width = PuHuiTi.getTextWidth(line, size);
        const t_width = PuHuiTi.getTextWidth(t, size);

        if (width < max_width && (width + t_width + blank_width) >= max_width) {
            out += PuHuiTi.getTextPath(line, x, y + 26 * (row - 1), size, 'left baseline', color);
            row ++;
            line = t;
        } else {
            if (line !== "") {
                line = line + ' ' + t;
            } else {
                line = t;
            }
        }

        if (row > max_row) {
            break;
        }
    }

    return out;
}

async function getGuestPanel(guest = [], x = 54, y = 745) {
    let out = "";

    if (isEmptyArray(guest)) {
        //摆烂机制
        out += PanelDraw.Image(180, -5, 80, 80, getImageFromV3('sticker_qiqi_oh.png'))
        out += torus.getTextPath('Solo Set!', 215, 100, 18, 'center baseline', '#fff')
    } else if (guest.length > 4) {
        //常规：N3
        for (const i in guest) {
            if (i >= 16) break;

            const u = guest[i];
            const dx = (i % 8) * 51;
            const dy = Math.floor(i / 8) * 51;

            out += (`<g transform="translate(${dx} ${dy})">` + await label_N3(u) + '</g>');
        }
    } else {
        //小图：N4
        for (const i in guest) {
            const u = guest[i];
            const dx = i * 102;

            out += (`<g transform="translate(${dx} 0)">` + await label_N4(u) + '</g>');
        }
    }

    return transformSvgBody(x, y, out);
}

async function getRankingProgressPanel(s = {}, hype = [], users = [], more, x = 490, y = 330) {
    const hype_count = s?.hype?.current || more?.hypeCount || 0;
    let hype_slot = 615 / 185; // 一般来说是 hype 相比于正常一格的长度比

    const summary = s?.nominations_summary || []

    const nom_count = summary?.current || 0;
    const nom_slot = (summary?.required_meta?.main_ruleset + summary?.required_meta?.non_main_ruleset) || 2;
    const qua_count = (nom_count === nom_slot && nom_count !== 0) ? 1 : 0
    const rnk_count = (s?.ranked === 1) ? 1 : 0

    const isSpecialRanked = s?.ranked === 2 || s?.ranked === 4;


    const total_length = 1350;
    const slot = (nom_slot + (isSpecialRanked ? 1 : 2)); //特殊上架，只需要一个槽位

    //格子长度，包括一段空缺
    let slot_length = total_length / (hype_slot + slot);

    //分配长度
    if (slot_length <= 105) {
        slot_length = 105;
    }

    hype_slot = total_length - slot_length * slot;

    const x_hype = 20 + x;
    const x_nom = hype_slot + 5 + 20 + x;
    const x_qua = hype_slot + 5 + nom_slot * slot_length + 20 + x; //特殊上架的状态位置
    const x_rnk = hype_slot + 5 + (nom_slot + 1) * slot_length + 20 + x; //特殊上架不考虑

    const y_index = 67 + y;
    const y_rrect = 78 + y;
    const y_nominator = 110 + y;

    //分支
    let index = torus.getTextPath('Hype ' + hype_count + '/' + 5, x_hype, y_index, 24, 'left baseline')
        + torus.getTextPath('Nomination ' + nom_count + '/' + nom_slot, x_nom, y_index, 24, 'left baseline');
    let rrect = "";
    let icon = "";

    rrect += drawHype(x_hype, y_rrect, hype_slot * Math.min(1, hype_count / 5), hype_slot);
    rrect += drawRRect(nom_count, nom_slot, x_nom, y_rrect, slot_length - 5, '#B3FD66');

    const nominator = await drawNominators(x_nom, y_nominator, s?.nominators, slot_length)

    if (s?.ranked === 2) {
        //特殊上架 approved
        index += torus.getTextPath('Approved', x_qua, y_index, 24, 'left baseline');
        rrect += drawRRect(1, 1, x_qua, y_rrect, slot_length - 5, '#D7FEA6');
        icon += drawIcons(true, x_qua + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-qualified.png')
    } else if (s?.ranked === 4) {
        //特殊上架 loved
        index += torus.getTextPath('Loved', x_qua, y_index, 24, 'left baseline');
        rrect += drawRRect(1, 1, x_qua, y_rrect, slot_length - 5, '#FF66AA');
        icon += drawIcons(true, x_qua + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-loved.png')

    } else {
        //正常
        index += (torus.getTextPath('Qualified', x_qua, y_index, 24, 'left baseline') +
            torus.getTextPath('Ranked', x_rnk, y_index, 24, 'left baseline'));
        rrect += drawRRect(qua_count, 1, x_qua, y_rrect, slot_length - 5, '#D7FEA6') +
            drawRRect(rnk_count, 1, x_rnk, y_rrect, slot_length - 5, '#fff');
        icon += drawIcons(qua_count >= 1, x_qua + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-qualified.png') +
            drawIcons(rnk_count >= 1, x_rnk + (slot_length - 5) / 2 - 25, y_nominator, 'object-beatmap-ranked.png');
    }

    const hype_arr = await renderDiscussion(hype, users, 510, 435, 1, 145, hype_slot);

    return (index + rrect + nominator + icon + hype_arr);

}

async function getDisscussionPanel(discussion, user, x, y) {
    return await renderDiscussion(discussion, user, x, y, 4, 360, 1060);
}

async function getFavoritePanel(fav = [], x = 1620, y = 660) {
    let svg = "<g>";

    for (const i in fav) {
        if (i >= 20) break;

        const u = fav[i];
        const dx = (i % 5) * 51 + x;
        const dy = Math.floor(i / 5) * 51 + y;

        svg += (`<g transform="translate(${dx} ${dy})">` + await label_N3(u) + '</g>');
    }

    svg += '</g>';
    return svg;
}

function getGenrePanel(genre, language) {
    const g = label_N6(1625, 940, 'genre', genre?.name);
    const l = label_N6(1745, 940, 'language', language?.name);
    return g + l;
}

// label
async function label_N1(x = 0, y = 0, u = {}, max_width = 100) {
    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LN1">
      <circle cx="50" cy="50" r="50" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="RRect_LN1">
  </g>
  <g id="Avatar_LN1">
    <circle cx="50" cy="50" r="50" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LN1);">
    </g>
  </g>
  <g id="Label_LN1">
  </g>
  <g id="Text_LN1">
  </g>`
    //正则
    const reg_text = /(?<=<g id="Text_LN1">)/;
    const reg_label = /(?<=<g id="Label_LN1">)/;
    //const reg_rrect = /(?<=<g id="RRect_LN1">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LN1\);">)/;

    //定义文本
    const avatar = await getAvatar(u?.avatar_url, true);
    const abbr_color = u?.profile_colour || 'none';

    //获取用户组或者玩家组简称
    const group2AbbrText = (g = u?.default_group) => {
        switch (g) {
            case "bng": return 'B';
            case "bng_limited": return 'P';
            case "nat": return 'N';
            case "gmt": return 'G';
            case "alm": return 'A';
            case "ppy": return 'Y';
            case "bot": return 'T';
            case "dev": return 'D';
            case "spt": return 'S';
            case "lvd": return 'L';
            case "bsc": return 'C';
            default: return '';
        }
    }

    const abbr = torus.getTextPath(group2AbbrText(u?.default_group), 15, 15.877, 18, 'center baseline', '#fff');
    const abbr_rrect = PanelDraw.Rect(0, 0, 30, 20, 10, abbr_color);

    const name = torus.getTextPath(
        torus.cutStringTail(u?.username, 18, Math.max(max_width, 100), true)
        , 50, 118, 18, 'center baseline', '#fff');
    const uid = torus.getTextPath(u?.id.toString(), 50, 138, 16, 'center baseline', '#fff');

    //插入文本
    svg = implantImage(svg, 100, 100, 0, 0, 1, avatar, reg_avatar);
    svg = replaceText(svg, abbr, reg_text);
    svg = replaceText(svg, abbr_rrect, reg_label);
    svg = replaceText(svg, name, reg_text);
    svg = replaceText(svg, uid, reg_text);

    return transformSvgBody(x, y, svg);
}

async function label_N2(u = {}, p = {}, x, y, max_width = 100, lines = [""], row = 1) {

    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LN2-1">
      <circle cx="20" cy="20" r="20" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LN2">
    <circle cx="20" cy="20" r="20" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LN2-1);">
    </g>
  </g>
  <g id="Label_LN2">
  </g>
  <g id="Text_LN2">
  </g>`

    //正则
    const reg_text = /(?<=<g id="Text_LN2">)/;
    const reg_label = /(?<=<g id="Label_LN2">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LN2-1\);">)/;

    //定义文本，限宽 40
    const name_str = torus.cutStringTail(u?.username || ('ID:' + (u?.id || 0)), 18, Math.max(max_width - 46 - 15, 40));
    const name_length = torus.getTextWidth(name_str, 18);
    const name = torus.getTextPath(name_str, 46, 14, 18, 'left baseline', '#fff');

    const type = (p?.resolved && p?.can_be_resolved) ? 'resolved' : p?.message_type;
    const comment_color = (type === 'resolved') ? '#888' : '#fff';
    const comment = renderMessage(46, 34, 18, lines, row, comment_color); //这部分偏移是需要计算的

    const diff_str = torus.cutStringTail((p?.can_be_resolved) ? (p?.difficulty || "General") : "",
        18, Math.max(max_width - 46 - 30 - name_length, 0),true);
    const diff = torus.getTextPath(diff_str, 46 + 30 + name_length, 14, 14, 'left baseline', '#fff');

    const label_type = PanelDraw.Image(46 + name_length + 5, -2, 20, 20, getImageFromV3(`object-type-${type}.png`));

    //插入文本
    svg = replaceText(svg, name, reg_text);
    svg = replaceText(svg, diff, reg_text);
    svg = replaceText(svg, comment, reg_text);
    svg = replaceText(svg, label_type, reg_label);

    //插入图片
    const avatar = await getAvatar(u?.avatar_url, true);
    svg = implantImage(svg, 40, 40, 0, 0, 1, avatar, reg_avatar);

    return transformSvgBody(x, y, svg.toString());
}

async function label_N3(u = {}) {
    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LN3-1">
      <circle cx="22.5" cy="22.5" r="22.5" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LN3">
    <circle cx="22.5" cy="22.5" r="22.5" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LN3-1);">
    </g>
  </g>
  <g id="Label_LN3">
  </g>`

    //正则
    let reg_label = /(?<=<g id="Label_LN3">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LN3-1\);">)/;

    //定义文本
    const label_color = PanelDraw.Circle(37.5, 37.5, 7.5, u?.profile_colour || 'none');

    //插入文本
    svg = replaceText(svg, label_color, reg_label);

    //插入图片
    const avatar = await getAvatar(u?.avatar_url, true);
    svg = implantImage(svg, 45, 45, 0, 0, 1, avatar, reg_avatar);

    return svg.toString();
}

async function label_N4(u = {}) {
    //导入模板
    let svg = `  <defs>
    <clipPath id="clippath-LN4-1">
      <circle cx="48" cy="35" r="35" style="fill: none;"/>
    </clipPath>
  </defs>
  <g id="Avatar_LN4">
    <circle cx="48" cy="35" r="35" style="fill: #46393f;"/>
    <g style="clip-path: url(#clippath-LN4-1);">
    </g>
  </g>
  <g id="Label_LN4">
  </g>
  <g id="Text_LN4">
  </g>`

    //正则
    let reg_text = /(?<=<g id="Text_LN4">)/;
    let reg_label = /(?<=<g id="Label_LN4">)/;
    let reg_avatar = /(?<=<g style="clip-path: url\(#clippath-LN4-1\);">)/;

    //定义文本
    let name = torus.getTextPath(
        torus.cutStringTail(u?.username || '', 18, 96)
        , 48, 88, 18, 'center baseline', '#fff');

    const label_color = PanelDraw.Circle(73, 60, 10, u?.profile_colour || 'none');

    //插入文本
    svg = replaceText(svg, name, reg_text);
    svg = replaceText(svg, label_color, reg_label);

    //插入图片
    const avatar = await getAvatar(u?.avatar_url, true);
    svg = implantImage(svg, 70, 70, 13, 0, 1, avatar, reg_avatar);

    return svg.toString();
}

function label_N6(x = 0, y = 0, type = 'genre', name = '') {
    let svg = `
  <g id="Label_LN6">
  </g>
  <g id="Text_LN6">
  </g>`

    //正则
    const reg_text = /(?<=<g id="Text_LN6">)/;
    const reg_label = /(?<=<g id="Label_LN6">)/;

    const text = torus.getTextPath(name, 60, 84, 18, 'center baseline', '#fff'
    );

    const file = name.replaceAll(" ", "_").toLowerCase() || 'unspecified';
    const label = getImageFromV3(`object-${type}-${file}.png`);


    //插入文本
    svg = replaceText(svg, text, reg_text);

    //插入图片
    svg = implantImage(svg, 64, 64, 28, 0, 1, label, reg_label);

    return transformSvgBody(x, y, svg.toString());
}

/**
 * 分隔消息变成消息块
 * @param comment
 * @param size
 * @param max_width 最大宽度
 * @param max_row 最大行
 * @return {{row: number, lines: *[], font_width: number}}
 */
function splitMessage(comment = "", size = 18, max_width = 100, max_row = 4) {
    let lines = [];
    let row = 0;
    const new_comment = comment.replaceAll(/[\n\r\v\f\u2028\u2029]+/g, ", ");

    //实际字体的最大宽度
    let font_width = 0;
    let line = "";

    for (let i = 0; i < new_comment?.length; i++) {
        const c = new_comment.charAt(i);

        const width = PuHuiTi.getTextWidth(line, size);
        const t_width = PuHuiTi.getTextWidth(c, size);

        if (width < max_width && (width + t_width) >= max_width) {
            row ++;
            if (row > max_row) {
                const last = lines.pop();
                lines.push(last.slice(0, -3) + '...');
                row --;
                break;
            }
            lines.push(line);
            line = c;
        } else {
            line += c;
        }

        font_width = Math.max(width, font_width);

    }

    //太短的评论直接push
    if (row < 1) {
        lines.push(comment);
        row = 1;
        font_width = PuHuiTi.getTextWidth(comment, 18)
    } else if (row < max_row && line.length > 0) {
        //还有剩下的字符串
        lines.push(line);
        row ++;
        font_width = Math.max(PuHuiTi.getTextWidth(line, 18), font_width);
    } else if (row >= max_row && line.length > 0) {
        //还有剩下的字符串，但是没地方放了！
        const last = lines.pop();
        lines.push(last.slice(0, -3) + '...');
    }

    return {
        lines: lines,
        row: row,
        font_width: font_width,
    }
}

/**
 * 把上面的消息块打印出来
 * @param x
 * @param y
 * @param size
 * @param lines
 * @param row
 * @param color 消息颜色
 * @return {string} SVG 体
 */
function renderMessage(x = 0, y = 0, size = 18, lines = [""], row = 1, color = '#fff') {
    let out = "";
    for (let i = 0; i < row; i++) {
        const s = lines[i];
        // y+2: 普惠体的偏移
        out += PuHuiTi.getTextPath(s, x, y + 2 + i * 20, size, 'left baseline', color);
    }
    return out;
}

//N2+ hype maxrow 是 1， 145， 300
async function renderDiscussion(discussion = [], user = [], x = 0, y = 0, max_row = 4, max_height = 360, max_width = 1060) {
    let out = "";
    let sum_x = 0;
    let sum_y = 0;
    let column = 1;

    let label_max_width = 0;

    for (const d of discussion) {
        let u = null;
        for (const us of user) {
            if (us.id === d.uid) {
                u = us;
                break;
            }
        }

        // 计算还剩多少位置
        const remain_height = max_height - sum_y;

        // 分段函数，row 和 高度 对应关系：1-50,2-65,3-85,4-105
        function height2Row(height = 0, max_row = 1) {
            let row;

            if (height <= 65) {
                row = 1;
            } else if (height <= 85) {
                row = 2;
            } else if (height <= 105) {
                row = 3;
            } else {
                row = 4;
            }

            return Math.min(row, max_row)
        }

        const remain_row = height2Row(remain_height, max_row);

        const split = splitMessage(d?.starting_post?.message, 18,
            Math.max(Math.min((max_width / 2) - 25, max_width - sum_x - column * 25), 0), remain_row); //宽度实时变化，取最小值
        //25是头像

        const text_lines = split.lines;
        const text_row = split.row;
        label_max_width = Math.max(label_max_width, split.font_width + 46 + 15); //46是头像和空隙，15是label之间的空隙

        //15是图片
        out += await label_N2(u, d, sum_x, sum_y, label_max_width, text_lines, remain_row)

        // 分段函数，row 和 高度 对应关系：1-50,2-65,3-85,4-105
        sum_y += (text_row <= 2) ? (35 + 15 * text_row) : (25 + 20 * text_row);

        if (sum_y >= (max_height - 40)) { //不足以再填下一个标签
            sum_x += label_max_width + 10; //右侧的那个图片需要再多给点宽度
            sum_y = 0;
            column ++;
            label_max_width = 0;
        }

        if (max_width - sum_x <= 100) { //太窄
            break;
        }
    }

    return transformSvgBody(x, y, out.toString());
}

//细分方法
async function drawNominators(x, y, bn = [], slot_length) {
    let out = "";
    const half = (slot_length - 5) / 2;

    for (const i in bn) {
        const u = bn[i];
        const dx = x + (i * slot_length) + half - 50;

        out += await label_N1(dx, y, u, slot_length);
    }

    return out;
}

function drawIcons(isDraw = true, x, y, link) {
    if (isDraw) {
        return PanelDraw.Image(x, y, 50, 50, getImageFromV3(link));
    } else {
        return '';
    }
}

function drawHype(x, y, length, blank_length = length, color = '#82BA44', full_color = '#46393F') {
    return PanelDraw.Rect(x, y, blank_length, 15, 7.5, full_color) + PanelDraw.Rect(x, y, length, 15, 7.5, color);
}

function drawRRect(count, slot, x, y, length, color = '#fff', full_color = '#46393F') {
    let out = "";

    for (let i = 0; i < slot; i++) {
        out += PanelDraw.Rect(x + (length + 5) * i, y, length, 15, 7.5, full_color);
    }

    for (let j = 0; j < count; j++) {
        out += PanelDraw.Rect(x + (length + 5) * j, y, length, 15, 7.5, color);
    }
    return out;
}
