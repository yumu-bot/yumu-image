import {getImageFromV3, implantSvgBody, readTemplate} from "../util/util.js";

export function card_G(data = {
    background: getImageFromV3('card-default.png'),
    cover: getImageFromV3('Maimai', 'Cover', '00000.png'),
    type: '', //dx 图片
    icon1: '',
    icon2: '',
    icon3: '', //dx 星星

    label1: '',
    label1_size: 36,
    label1_color1: '',
    label1_color2: '',

    label2: '',
    label2_size: 48,
    label2_color1: '',
    label2_color2: '',

    left: '',
    right: '',

    title1: '',

    main_b: '',
    main_m: '',
    main_b_size: 60,
    main_m_size: 36,

    additional_b: '',
    additional_m: '',
    additional_b_size: 24,
    additional_m_size: 14,

    rrect1_percent: 0,
    rrect1_color1: '',
    rrect1_color2: '',


    // 这里太定制了
    component: ''

}) {
    // 读取模板
    let svg = readTemplate('template/Card_A2.svg');

    const reg_text = /<g id="Text">/

    svg = implantSvgBody(svg, 30, 330, data?.component, reg_text)

    return svg.toString()
}