import {createImageRouter, createSvgRouter} from "../util/image.js";

export const router = createImageRouter(panel_V3);

export const router_svg = createSvgRouter(panel_V3);

/**
 * 接水果谱面预览面板
 * !v:2
 * @param data
 * @return {Promise<string>}
 */
export async function panel_V3(
    data = {
        beatmap: {},
        page: 1,
        mode: 'fruits',
        rows: 5,
        variation: false,
    })
{


}