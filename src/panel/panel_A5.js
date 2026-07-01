import {
    getNowTimeStamp,
    getPanelHeight,
    getPanelNameSVG,
    getSvgBody,
    readTemplate,
    setImage,
    setSvgBody,
    setText,
    thenPush,
} from "../util/util.js";
import {card_C} from "../card/card_C.js";
import {card_A1} from "../card/card_A1.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {card_I4} from "../card/card_I4.js";

import {ADVANCED_IMAGE_FORMAT, createImageRouter, createSvgRouter} from "../util/image.js";
import {imageDownloader, scores2Task, user2Task} from "../util/download.js";

const createDynamicImageRouter = (panelFn) => {
    return (...args) => {
        // 获取原始数据
        const req = args[0] || {};
        const fields = req.fields || {};

        // 默认的格式
        let targetFormat = undefined; // 传 undefined 会走默认的 DEFAULT_IMAGE_FORMAT

        // 核心逻辑：如果 compact 为 true
        if (fields.compact === true) {
            fields.compact = false;
            targetFormat = ADVANCED_IMAGE_FORMAT;
        }

        // 动态生成真正的路由
        // 这里的 data_loader 直接返回我们修改后的 fields 即可
        const realRouter = createImageRouter(panelFn, () => fields, targetFormat);

        // 执行生成的路由
        return realRouter(...args);
    };
};

export const router = createDynamicImageRouter(panel_A5);
export const router_svg = createSvgRouter(panel_A5);

/**
 * 成绩pr面板
 * @param data
 * @return {Promise<string>}
 */
export async function panel_A5(data = {
    "panel": "",
    "user": {},
    "history_user": null,
    "rank": [],
    "scores": [],
    "compact": false,
    match_id: undefined,

}) {

    // 导入模板
    let svg = readTemplate('template/Panel_A4.svg');

    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_me = /(?<=<g id="Me_Card_A1">)/;
    const reg_bp_list = /(?<=<g id="List_Card_H">)/;
    const reg_cardheight = '${cardheight}';
    const reg_panelheight = '${panelheight}';
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PA4-1\);">)/;

    const scores = data.scores ?? []

    // 面板文字
    let panel_name

    switch (data?.panel) {
        case "PS": {
            panel_name = getPanelNameSVG('Passed Scores (!ymps)', 'PS')
        } break;
        case "RS": {
            panel_name = getPanelNameSVG('Recent Scores (!ymrs)', 'RS');
        } break;
        case "MR": {
            const request_time2 = 'matchID: ' + (data?.match_id ?? 0) + ' // request time: ' + getNowTimeStamp();
            panel_name = getPanelNameSVG('Match Recent Scores (!ymmr)', 'MR', request_time2);
        } break;
        case "SS": {
            panel_name = getPanelNameSVG('Beatmap Scores (!ymss)', 'SS');
        } break;
        default: {
            panel_name = getPanelNameSVG('Multi Scores (!ymps / !ymrs)', 'SS');
        } break;
    }

    // 导入文字
    svg = setText(svg, panel_name, reg_index);

    const is_compact = data?.compact === true

    const promise_a1s = user2Task(data.user)
    const promise_ls = scores2Task(data.score, 'list')
    const promise_cs = is_compact ? [] : scores2Task(data.score, 'cover')

    const tasks = [
        ...promise_a1s,
        ...promise_ls,
        ...promise_cs,
    ];

    const images = await imageDownloader(tasks);

    // 导入A1卡
    const me = await card_A1(PanelGenerate.user2CardA1(data.user, data?.history_user, images.get(`avatar_${data.user.id}`), images.get(`banner_${data.user.id}`)));
    svg = setSvgBody(svg, 40, 40, me, reg_me);

    // 导入C或I4卡

    if (is_compact) {
        const params = []

        await Promise.allSettled(
            scores.map((v, i) => {
                const list = images.get(`list_${v.beatmapset_id ?? v.beatmapset.id}`)
                return PanelGenerate.score2CardI4(v, data.rank[i], list)
            })
        ).then(results => thenPush(results, params))

        const card_I4s = params.map((param) => {
            return card_I4(param)
        })

        // 插入图片和部件（新方法
        svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.7);

        // 计算面板高度
        // const row_total = Math.ceil((card_Is?.length || 0) / 2);

        const panel_height = getPanelHeight(card_I4s?.length, 130, 5, 290, 15);
        const card_height = panel_height - 290;

        svg = setText(svg, panel_height, reg_panelheight);
        svg = setText(svg, card_height, reg_cardheight);

        //插入C卡
        let string_I4s = []

        for (let i = 0; i < card_I4s.length; i++) {
            const ix = i % 5;
            const iy = Math.floor(i / 5);

            const x = 40 + ix * 372;
            const y = 330 + iy * 145;

            string_I4s.push(getSvgBody(x, y, card_I4s[i]))
        }

        svg = setText(svg, string_I4s.join('\n'), reg_bp_list);
    } else {
        const params = []

        await Promise.allSettled(
            scores.map((v, i) => {
                const list = images.get(`list_${v?.beatmapset_id ?? v?.beatmapset?.id}`)
                const cover = images.get(`cover_${v?.beatmapset_id ?? v?.beatmapset?.id}`)

                return PanelGenerate.score2CardC(v, data.rank[i], list, cover)
            })
        ).then(results => thenPush(results, params))

        const card_Cs = params.map((param) => {
            return card_C(param)
        })

        // 插入图片和部件（新方法
        svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.7);

        // 计算面板高度
        const rowTotal = Math.ceil((card_Cs?.length || 0) / 2);

        const panel_height = getPanelHeight(card_Cs?.length, 110, 2, 290, 40);
        const card_height = panel_height - 290;

        svg = setText(svg, panel_height, reg_panelheight);
        svg = setText(svg, card_height, reg_cardheight);

        //天选之子C卡提出来
        const luckyDog = (card_Cs.length % 2 === 1) ? card_Cs.pop() : '';
        svg = setSvgBody(svg, 510, 330 + (rowTotal - 1) * 150, luckyDog, reg_bp_list);

        //插入C卡
        let string_Cs = []

        for (let i = 0; i < card_Cs.length; i++) {
            const ix = (i + 1) % 2;
            const iy = Math.floor(i / 2);

            const x = (ix === 1) ? 40 : 980;
            const y = 330 + iy * 150;

            string_Cs.push(getSvgBody(x, y, card_Cs[i]))
        }

        svg = setText(svg, string_Cs.join('\n'), reg_bp_list);
    }

    return svg;
}