import {getMascotName, getMascotPath, implantImage, PanelDraw, replaceText, replaceTexts} from "../util.js";
import {torus} from "../font.js";


export async function card_F1(data = {
    mode: 'osu',
    level_current: 90,
    level_progress: 24,
}, reuse = false) {
    // 读取模板
    let svg = `   
   <defs>
        <clipPath id="clippath-CF1-1">
            <rect x="0" y="0" width="560" height="710" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <filter id="inset-shadow-CF1-1" height="150%" width="150%" x="-25%" y="-25%" filterUnits="userSpaceOnUse">
            <feFlood flood-color="#000"/>
            <feComposite in2="SourceGraphic" operator="out"/>
            <feMorphology operator="dilate" radius="15" />
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
            <feComposite in2="SourceGraphic" operator="atop"/>
        </filter>
        </defs>
          <g id="Base_CF1">
          </g>
          <g id="Mascot_CF1">
            <g style="clip-path: url(#clippath-CF1-1);" filter="url(#inset-shadow-CF1-1)">
            </g>
          </g>
          <g id="RRect_CF1">
          </g>
          <g id="Text_CF1">
          </g>`;

    // 路径定义
    const reg_base = /(?<=<g id="Base_CF1">)/;
    const reg_mascot = /(?<=<g style="clip-path: url\(#clippath-CF1-1\);" filter="url\(#inset-shadow-CF1-1\)">)/;
    const reg_rrect = /(?<=<g id="RRect_CF1">)/;
    const reg_text = /(?<=<g id="Text_CF1">)/;

    // 获取吉祥物
    const mascot_name_data = getMascotName(data.mode || 'osu');
    const mascot_link = getMascotPath(mascot_name_data);

    svg = implantImage(svg, 560, 710, 0, 0, 1, mascot_link, reg_mascot);

    // 插入进度
    const mascot_name_width = torus.getTextWidth(mascot_name_data, 36);

    const user_lv_text_width = torus.getTextWidth(' Lv.', 24);
    const user_lv_width = torus.getTextWidth((data.level_current.toString() || '0'), 36);
    const user_progress_width =
        torus.getTextWidth((data.level_progress.toString() || '0'), 36) +
        torus.getTextWidth('%', 24);

    const mascot_mark1_rrect_width =
        mascot_name_width +
        user_lv_width +
        user_lv_text_width + 30;
    const mascot_mark2_rrect_width = user_progress_width + 30;

    const mascot_mark1 =
        torus.getTextPath((mascot_name_data || 'pippi'),
            35,
            50.754,
            36,
            "left baseline",
            "#fff") +
        torus.getTextPath(' Lv.',
            35 + mascot_name_width,
            50.754,
            24,
            "left baseline",
            "#fff") +
        torus.getTextPath((data.level_current.toString() || '0'),
            35 + mascot_name_width + user_lv_text_width,
            50.754,
            36,
            "left baseline",
            "#fff");

    const mascot_mark2 = torus.get2SizeTextPath(data.level_progress.toString(), '%', 36, 24, 525, 50.754, 'right baseline', '#fff');

    const mascot_mark1_rrect = PanelDraw.Rect(20, 20, mascot_mark1_rrect_width, 40, 12, '#54454c', 0.7);

    const mascot_mark2_rrect = PanelDraw.Rect(540 - mascot_mark2_rrect_width, 20, mascot_mark2_rrect_width, 40, 12, '#54454c', 0.7);

    // 导入底部的指示矩形
    const progress_base = PanelDraw.Rect(20, 686, 520, 4, 2, '#54454c');

    const progress_rrect = PanelDraw.Rect(20, 686, 520 * (data.level_progress || 0) / 100, 4, 2, '#FFCC22');

    // 导入
    svg = replaceTexts(svg, [mascot_mark1, mascot_mark2], reg_text);
    svg = replaceTexts(svg, [mascot_mark1_rrect, mascot_mark2_rrect, progress_rrect, progress_base], reg_rrect);

    // 导入基础矩形
    const base_rrect = PanelDraw.Rect(0, 0, 560, 710, 20, '#382e32');

    svg = replaceText(svg, base_rrect, reg_base);

    return svg;
}