import {exportPng, getExportFileV3Path} from "../util.js";

export async function panel_J(data = {
    // A1卡
    card_A1: {
        background: getExportFileV3Path('PanelObject/A_CardA1_BG.png'),
        avatar: getExportFileV3Path('PanelObject/A_CardA1_Avatar.png'),
        sub_icon1: getExportFileV3Path('PanelObject/A_CardA1_SubIcon1.png'),
        sub_icon2: getExportFileV3Path('PanelObject/A_CardA1_SubIcon2.png'),
        name: 'Muziyami',
        rank_global: 28075,
        rank_country: 577,
        country: 'CN',
        acc: 95.27,
        level: 100,
        progress: 32,
        pp: 4396,
    },

    // H卡


    // J标签
    label_data: {

    }

}) {
    let svg = '';

    return await exportPng(svg);
}