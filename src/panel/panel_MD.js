import {
    exportJPEG,
    getImageFromV3,
    getPanelNameSVG, setImage,
    setSvgBody, isNotBlankString, isNotEmptyArray,
    readTemplate,
    setText, floor,
} from "../util/util.js";
import {card_A1} from "../card/card_A1.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {
    getMaimaiCover,
    getMaimaiRankBG,
    getMaimaiType, getMaimaiDXStarLevel, getMaimaiDifficultyColor, getMaimaiRatingBG, getMaimaiPlate,
} from "../util/maimai.js";
import {PanelDraw} from "../util/panelDraw.js";
import {card_I3} from "../card/card_I3.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_MD(data);
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
        const svg = await panel_MD(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * maimai 歌曲成绩。
 * @param data
 * @return {Promise<string>}
 */
export async function panel_MD(data = {
    user: {},

    scores_latest: [],
    scores: [],
    rating: 16497,
    count: 46,
    size: 50,
}) {

    let svg = readTemplate('template/Panel_MA.svg');

    // 路径定义
    let reg_index = /(?<=<g id="Index">)/;
    let reg_card_a1 = /(?<=<g id="CardA1">)/;
    let reg_card_i = /(?<=<g id="CardI">)/;
    let reg_cardheight = '${cardheight}';
    let reg_panelheight = '${panelheight}';
    let reg_banner = /(?<=<g style="clip-path: url\(#clippath-MA1-1\);">)/;

    // 面板文字
    const panel_name = getPanelNameSVG('Maimai Distribution (!ymmd)', 'MD');
    // 插入文字
    svg = setText(svg, panel_name, reg_index);

    // 导入A1卡
    const cardA1 = await card_A1(await maimaiDistPlayer2CardA1(data.user, data.rating, data.count, data.size));

    const standard = data?.scores || []
    const deluxe = data?.scores_latest || []

    // 导入i卡
    let card_sd = [];
    let card_dx = [];

    for (const s of standard) {
        card_sd.push(card_I3(await maiDistribution2CardI3(s))) ;
    }

    for (const s of deluxe) {
        card_dx.push(card_I3(await maiDistribution2CardI3(s))) ;
    }

    // 插入卡片
    svg = setSvgBody(svg, 40, 40, cardA1, reg_card_a1);

    const sd_height = Math.ceil(card_sd.length / 5) * 150
    let dx_offset = 0 // 偏移值
    const dx_height = Math.ceil(card_dx.length / 5) * 150

    for (const i in card_sd) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        svg = setSvgBody(svg, 40 + (352 + 20) * x, 330 + 150 * y, card_sd[i], reg_card_i);
    }

    if (isNotEmptyArray(card_sd) && isNotEmptyArray(card_dx)) dx_offset = 20

    for (const i in card_dx) {
        const x = i % 5;
        const y = Math.floor(i / 5);

        svg = setSvgBody(svg, 40 + (352 + 20) * x, 330 + 150 * y + sd_height + dx_offset, card_dx[i], reg_card_i);
    }

    // 导入图片
    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath("maimai"), reg_banner, 0.8);

    // 计算面板高度
    const cardHeight = sd_height + dx_height + dx_offset + 80 - 15
    const panelHeight = cardHeight + 290

    svg = setText(svg, panelHeight, reg_panelheight);
    svg = setText(svg, cardHeight, reg_cardheight);

    return svg.toString()
}

async function maiDistribution2CardI3(dist = {
    score: {
        "achievements": 100.5133,
        "ds": 10.4,
        "dxScore": 1125,
        "fc": "fc",
        "fs": "sync",
        "level": "10",
        "level_index": 2,
        "level_label": "Expert",
        "ra": 234,
        "rate": "sssp",
        "song_id": 10319,
        "title": "幻想のサテライト",
        "alias": "幻想的卫星",
        "artist": "豚乙女",
        "charter": "mai-Star",
        "type": "DX",
        "max": 234,
        "position": 0,
    }, chart: {
        cnt: 40548,
        diff: '13',
        fit_diff: 13.087111508862211,
        avg: 98.89086608957203,
        avg_dx: 1822.3576501923646,
        std_dev: 1.893239577489891,
        dist: [
            67, 32, 41, 51,
            95, 627, 1071, 2488,
            2567, 4395, 3527, 4448,
            9914, 11225
        ],
        fc_dist: [22077, 15301, 2717, 406, 47]
    },
    rating: 0
}) {
    const achievement_text = (dist.score?.achievements || 0).toFixed(4).toString()

    const fit_rating = Math.round(dist?.rating || 0)
    const rating = Math.round(dist.score?.ra || 0)

    const too_bright = (dist.score?.level_index || 0) === 4 || (dist.score?.level_index || 0) === 1;

    const difficulty_color = getMaimaiDifficultyColor(dist.score?.level_index || 0)
    const level = (dist.chart.fit_diff > 0) ? ((floor(dist.chart.fit_diff, 2)) + ' [' + dist.score?.ds + ']') : dist.score?.ds

    return {
        background: getMaimaiRankBG(dist.score?.rate || ''),
        cover: await getMaimaiCover(dist.score?.song_id || 0),
        rank: getImageFromV3('Maimai', `object-score-${dist.score?.rate || 'd'}2.png`),
        type: getMaimaiType(dist.score?.type),
        level: getMaimaiDXStarLevel(dist.score?.dxScore, dist.score?.max),

        title: dist.score?.title || '',
        title2: dist.score?.alias || '',
        left1: dist.score?.artist || '',
        left2: dist.score?.charter || '',
        left3: fit_rating,
        left4: ' <- ' + rating,
        index_b: achievement_text.slice(0, -3),
        index_m: achievement_text.slice(-3),
        index_r: '%',
        index_b_size: 32,
        index_m_size: 20,
        index_r_size: 18,
        label1: level,
        label2: dist.score?.position >= 1 ? ('#' + dist.score.position) : '',
        label3: dist.score?.song_id?.toString() || '?',

        color_text: '#fff',
        color_label1: too_bright ? '#1c1719' : '#fff',
        color_label2: too_bright ? '#1c1719' : '#fff',
        color_label3: too_bright ? '#1c1719' : '#fff',

        color_left: difficulty_color,
        color_rrect1: difficulty_color,
        color_rrect2: difficulty_color,
        color_rrect3: difficulty_color,

        component1: drawCombo(dist.score?.fc),
        component2: drawSync(dist.score?.fs),
        component3: '',

        left3_is_right: false,
    }
}

function drawCombo(combo = '') {
    let combo_image

    switch (combo) {
        case 'fc': combo_image = 'fullcombo'; break;
        case 'fcp': combo_image = 'fullcomboplus'; break;
        case 'ap': combo_image = 'allperfect'; break;
        case 'app': combo_image = 'allperfectplus'; break;
        default: combo_image = 'clear'; break;
    }

    return PanelDraw.Image(0, 0, 27, 30, getImageFromV3('Maimai', `object-icon-combo-${combo_image}.png`))
}

function drawSync(sync = '') {
    let sync_image;
    switch (sync) {
        case 'sync': sync_image = 'sync'; break;
        case 'fs': sync_image = 'fullsync'; break;
        case 'fsp': sync_image = 'fullsyncplus'; break;
        case 'fsd': sync_image = 'fullsyncdx'; break;
        case 'fsdp': sync_image = 'fullsyncdxplus'; break;
        default: sync_image = 'solo'; break;
    }

    return PanelDraw.Image(0, 0, 27, 30, getImageFromV3('Maimai', `object-icon-sync-${sync_image}.png`))
}

// 私有转换
const maimaiDistPlayer2CardA1 = async (user, dist_rating, count, size) => {
    const background = getMaimaiRatingBG(dist_rating || user.rating);

    let dan
    const dan_arr = ['初', '二', '三', '四', '五', '六', '七', '八', '九', '十']

    if (user.dan === 0) dan = '初学者'
    else if (user.dan <= 10) dan = dan_arr[user.dan - 1] + '段'
    else if (user.dan <= 20) dan = '真' + dan_arr[user.dan - 11] + '段'
    else if (user.dan === 21) dan = '真皆伝'
    else if (user.dan === 22) dan = '裏皆伝'
    else dan = ''

    let top2;
    let left1;
    let sub_banner;

    const plate_image = await getMaimaiPlate(user.plate_id)

    if (isNotBlankString(plate_image)) {
        top2 = ''
        left1 = user.probername
        sub_banner = plate_image
    } else {
        top2 = user.probername
        left1 = ''
        sub_banner = ''
    }

    return {
        background: background,
        avatar: getImageFromV3('Maimai', 'avatar-guest.png'),
        sub_icon1: '',
        sub_icon2: '',
        sub_banner: sub_banner,
        country: null,

        top1: user.name,
        top2: top2,

        left1: left1,
        left2: dan,
        right1: 'Harder: ' + count + ' (' + Math.round((count/size * 100) || 0) + '%)',
        right2:  (dist_rating > 0) ? ('Rating: ' + user.rating + ' (' + (dist_rating - user.rating) + ')') : 'Rating:',
        right3b: (dist_rating > 0) ? dist_rating : user.rating,
        right3m: '',
    };
}