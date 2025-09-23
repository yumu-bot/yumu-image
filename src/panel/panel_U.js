import {
    exportJPEG,
    getAvatar,
    getBanner, getFlagPath,
    getGameMode,
    getImage,
    getImageFromV3, getPanelNameSVG, getSvgBody,
    getTimeDifference, setImage, setSvgBody, setText, setTexts, thenPush
} from "../util/util.js";
import {extra, torusBold} from "../util/font.js";
import {PanelDraw} from "../util/panelDraw.js";
import {getRandomBannerPath} from "../util/mascotBanner.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A1} from "../card/card_A1.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_U(data);
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
        const svg = await panel_U(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 最佳朋友面板
 * !f @
 * @param data
 * @return {Promise<string>}
 */
export async function panel_U(
    data = {
        user: {

        },

        partner: {

        },

        statistics: {
            user_bind: false,
            partner_bind: false,
            is_following: false,
            is_followed: false,
            user_following: 0,
            partner_following: 0,
        }
    }
) {
// 导入模板
    let svg = `
    <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
    <defs>
        <clipPath id="clippath-PU-1">
            <rect width="1920" height="320" rx="20" ry="20" style="fill: none;"/>
        </clipPath>
        <clipPath id="clippath-PU-2">
            <rect x="0" y="290" width="1920" height="790" rx="40" ry="40" style="fill: none;"/>
        </clipPath>
        <filter id="blur-PU-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
        </filter>
        <linearGradient id="linear-PU-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="linear-PU-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
        </linearGradient>
        <mask id="mask-PU-1">
            <rect width="1220" height="790" rx="40" ry="40" fill="url(#linear-PU-1)"/>
        </mask>
        <mask id="mask-PU-2">
            <rect x="700" width="1220" height="790" rx="40" ry="40" fill="url(#linear-PU-2)"/>
        </mask>
    </defs>
    <g id="Banner">
        <rect width="1920" height="320" rx="20" ry="20" style="fill: #1c1719;"/>
        <g style="clip-path: url(#clippath-PU-1);">
        </g>
    </g>
    <g id="Background">
        <rect y="290" width="1920" height="790" rx="20" ry="20" style="fill: #2a2226;"/>
    </g>
    <g id="Background_Additional">
        <g id="Background_Blur" style="clip-path: url(#clippath-PU-2);" filter="url(#blur-PU-1)">
        </g>
        <g id="Background_Left" mask="url(#mask-PU-1)">
        </g>
        <g id="Background_Right" mask="url(#mask-PU-2)">
        </g>
        <g id="Background_Silk">
        </g>
    </g>
    <g id="Main_Card">
    </g>
    <g id="Body_Card">
    </g>
    <g id="IndexBase">
        <rect x="510" y="40" width="195" height="60" rx="15" ry="15" style="fill: #382e32;"/>
    </g>
    <g id="Index">
    </g>
</svg>
`
    // 路径定义
    const reg_index = /(?<=<g id="Index">)/;
    const reg_body = /(?<=<g id="Body_Card">)/;
    const reg_main = /(?<=<g id="Main_Card">)/;
    const reg_banner = /(?<=<g style="clip-path: url\(#clippath-PU-1\);">)/;

    const reg_background_blur = /(?<=<g id="Background_Blur" style="clip-path: url\(#clippath-PU-2\);" filter="url\(#blur-PU-1\)">)/;
    const reg_background_left = /(?<=<g id="Background_Left" mask="url\(#mask-PU-1\)">)/;
    const reg_background_right = /(?<=<g id="Background_Right" mask="url\(#mask-PU-2\)">)/;
    const reg_background_silk = /(?<=<g id="Background_Silk">)/;
    
    const stat = data.statistics

    let background_blur = ''
    let background_silk = ''
    let mutual_pippi = ''

    let left_label
    let right_label
    let left_background = ''
    let right_background = ''
    let center_label = ''

    if (stat.is_following === true && stat.is_followed === true) {
        // mutual 模式
        background_blur = getImage(
            0, 290, 1920, 1080 - 290,
            getImageFromV3('object-score-backimage-S.jpg'))

        background_silk = getImage(
            0, 474, 1920, 388,
            getImageFromV3('online-background-silk.png'))

        mutual_pippi = getImage(
            (1920 - 528) / 2, 1920 - 750, 528, 750,
            getImageFromV3('online-supporter-pippi.png'))

        center_label = getSvgBody(760, 960, label_U2({
            image: null,
            color1: '#F58EE8',
            color2: '#A764CF',
            text: 'Best Friends',
            text_color: '#fff',
            center: 200,
            towards_right: true,
        }))

        left_label = getSvgBody(540, 960, label_U2({
            image: null,
            color1: '#F193E7',
            color2: '#F66E8F',
            text: 'Mutual',
            text_color: '#fff',
            center: 200 - 80,
            towards_right: true,
        }))

        right_label = getSvgBody(980, 960, label_U2({
            image: null,
            color1: '#F193E7',
            color2: '#F66E8F',
            text: 'Mutual',
            text_color: '#fff',
            center: 200 + 80,
            towards_right: false,
        }))
    } else {
        let left_image
        let left_color1
        let left_color2
        let left_text
        let left_text_color = '#fff'

        let right_image
        let right_color1
        let right_color2
        let right_text
        let right_text_color = '#fff'

        if (stat.is_following === true) {
            left_image = getImageFromV3('online-supporter-required.png')
            left_color1 = '#49F9D7'
            left_color2 = '#54EC8B'
            left_text = 'Following'
            left_background = getImageFromV3('object-score-backimage-A.jpg')
        } else if (stat.is_following === false) {
            left_image = getImageFromV3('online-not-found.png')
            left_color1 = '#507DA0'
            left_color2 = '#253A4B'
            left_text = 'Not Following'
            left_background = getImageFromV3('object-score-backimage-SH.jpg')
        } else {
            left_image = getImageFromV3('online-avatar-guest.png')
            left_color1 = '#54454C'
            left_color2 = '#382E32'
            left_text = 'Unknown'
            left_text_color = '#aaa'
            left_background = getImageFromV3('object-score-backimage-F.jpg')
        }
        
        left_label = getSvgBody(540, 960, label_U2({
            image: left_image,
            color1: left_color1,
            color2: left_color2,
            text: left_text,
            text_color: left_text_color,
            center: 200,
            towards_right: true,
        }))

        if (stat.is_followed === true) {
            right_image = getImageFromV3('online-supporter-required.png')
            right_color1 = '#49F9D7'
            right_color2 = '#54EC8B'
            right_text = 'Following'
            right_background = getImageFromV3('object-score-backimage-A.jpg')
        } else if (stat.is_followed === false) {
            right_image = getImageFromV3('online-not-found.png')
            right_color1 = '#507DA0'
            right_color2 = '#253A4B'
            right_text = 'Not Following'
            right_background = getImageFromV3('object-score-backimage-SH.jpg')
        } else {
            right_image = getImageFromV3('online-avatar-guest.png')
            right_color1 = '#54454C'
            right_color2 = '#382E32'
            right_text = 'Unknown'
            right_text_color = '#aaa'
            right_background = getImageFromV3('object-score-backimage-F.jpg')
        }

        right_label = getSvgBody(980, 960, label_U2({
            image: right_image,
            color1: right_color1,
            color2: right_color2,
            text: right_text,
            text_color: right_text_color,
            center: 200,
            towards_right: false,
        }))
    }

    // 构造
    const panel_name = getPanelNameSVG('Cupid Friends (!ymf)', 'F');
    svg = setText(svg, panel_name, reg_index);

    svg = setImage(svg, 0, 0, 1920, 320, getRandomBannerPath(), reg_banner, 0.8);

    const card_a1 = await card_A1(await PanelGenerate.user2CardA1(null, null))

    svg = setSvgBody(svg, 40, 40, card_a1, reg_main)

    let u1s = []

    await Promise.allSettled(
        [
            card_U1(data.user, data.user?.pm_friends_only === false, stat.user_bind, stat.user_following),
            card_U1(data.partner, data.partner?.pm_friends_only === false, stat.partner_bind, stat.partner_following),
        ]
    ).then(results => thenPush(results, u1s))

    svg = setText(svg, background_blur, reg_background_blur)
    svg = setText(svg, left_background, reg_background_left)
    svg = setText(svg, right_background, reg_background_right)
    svg = setText(svg, background_silk + mutual_pippi, reg_background_silk)
    svg = setTexts(svg, [
        getSvgBody(40, 330, u1s[0]),
        getSvgBody(1420, 330, u1s[1]),
        left_label, right_label, center_label
    ], reg_body)
    
    return svg.toString()
}

async function card_U1(
    user= {},
    allow_private_message = false,
    is_bind = false,
    following = 0,
) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CU1-1">
              <rect x="0" width="460" height="710" rx="40" ry="40" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CU1-2">
              <circle cx="230" cy="140" r="100" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CU1-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="15" result="blur"/>
            </filter>
          </defs>
          <g id="Base_CU1">
            <rect width="460" height="710" rx="40" ry="40" style="fill: #382E32;"/>
          </g>
          <g id="Background_CU1">
            <rect width="460" height="710" rx="40" ry="40" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CU1-1);" filter="url(#blur-CU1-1)">
            </g>
          </g>
          <g id="Avatar_CU1">
            <circle cx="230" cy="140" r="100" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CU1-2);">
            </g>
          </g>
          <g id="Text_CU1">
          </g>
          <g id="Icon_CU1">
          </g>
          <g id="Label_CU1">
          </g>`;


    // 路径定义
    const reg_text = /(?<=<g id="Text_CU1">)/;
    const reg_icon = /(?<=<g id="Icon_CU1">)/;
    const reg_label = /(?<=<g id="Label_CU1">)/;
    const reg_avatar = /(?<=<g style="clip-path: url\(#clippath-CU1-2\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CU1-1\);" filter="url\(#blur-CU1-1\)">)/;

    // 导入背景和头像
    const background = user?.profile?.card || await getBanner(user?.cover_url, true);
    const avatar = await getAvatar(user?.avatar_url)

    const mode_icon = extra.getTextMetrics(getGameMode(user?.mode, -1), 30, 68, 40, 'left baseline', '#fff')

    const supporter_icon = (user?.is_supporter) ? getImage(460 - 70, 30, 40, 40, getImageFromV3('object-card-supporter.png')) : ''

    const name = torusBold.getTextPath(
        torusBold.cutStringTail(user?.username, 60, 460 - 10),
        230, 300, 60, 'center baseline')

    const global_rank = torusBold.getTextPath(
        user?.statistics?.global_rank ? ('#' + user.statistics.global_rank) :
            (user?.rank_highest?.rank ?
                '#' + user.rank_highest.rank + '^ (' + getTimeDifference(user.rank_highest.updated_at) + ')' :
                '#0'),
        190, 360, 30, 'right baseline'
    )

    const country_flag = await getFlagPath(user.country, 200, 320, 44)

    const country_rank = torusBold.getTextPath(
        '#' + (user?.country_rank || '0'),
        270, 360, 30, 'right baseline'
    )

    const pp = torusBold.get2SizeTextPath(
        Math.round(user?.pp || 0).toString(), ' PP', 72, 48, 230, 442, 'center baseline'
    )

    const label_following = label_U1({
        icon: getImageFromV3('Icons', 'player-follow.png'),

        title: 'Following',
        large: (following < 0) ? '?' : (following?.toString() || '0'),
        small: ' / ' + (user?.max_friends || '500'),

        color1: '#FD5392',
        color2: '#F86F64',
        width: 420
    })

    const label_follower = label_U1({
        icon: getImageFromV3('Icons', 'player.png'),

        title: 'Follower',
        large: (user?.follower_count?.toString() || '0'),
        small: ' (+' + (user?.mapping_follower_count || '0') + ')',

        color1: '#F988E7',
        color2: '#9F56CB',
        width: 420
    })

    const label_bind = label_U1({
        icon: getImageFromV3('Icons', 'collections.png'),

        title: 'Bind',
        large: is_bind ? 'ON' : 'OFF',
        small: '',

        color1: is_bind ? '#F2F047' : '#507DA0',
        color2: is_bind ? '#1ED94F' : '#253A4B',
        width: 200
    })

    const label_pm_allowed = label_U1({
        icon: getImageFromV3('Icons', 'collections.png'),

        title: 'DM',
        large: allow_private_message ? 'ON' : 'OFF',
        small: '',

        color1: allow_private_message ? '#01F2FE' : '#507DA0',
        color2: allow_private_message ? '#4FACFE' : '#253A4B',
        width: 200
    })

    const labels = getSvgBody(20, 470, label_following)
        + getSvgBody(20, 550, label_follower)
        + getSvgBody(20, 630, label_bind)
        + getSvgBody(240, 470, label_pm_allowed)

    // 构建
    svg = setImage(svg, 0, 0, 460, 710, background, reg_background)
    svg = setImage(svg, 130, 40, 100, 100, avatar, reg_avatar)
    svg = setText(svg, labels, reg_label)
    svg = setTexts(svg, [mode_icon, supporter_icon], reg_icon)
    svg = setTexts(svg, [pp, name, country_rank, global_rank, country_flag], reg_text)

    return svg.toString()
}

function label_U1(data = {
    icon: '',

    title: '',
    large: '',
    small: '',

    color1: '#382E32',
    color2: '#382E32',
    width: 200 // 420
}) {
    const width = data?.width || 420

    const icon = getImage(16, 16, 30, 30, data?.icon)

    const base = PanelDraw.Rect(0, 0, width, 60, 30, '#46393F')

    const rrect = PanelDraw.GradientRect(0, 0, width, 60, 30, [{
        offset: '0%',
        color: data?.color1,
        opacity: 1,
    }, {
        offset: '100%',
        color: data?.color2,
        opacity: 1,
    }], 0.4, {
        x1: '0%', y1: '40%', x2: '100%', y2: '60%'
    })

    const icon_background = PanelDraw.Circle(10, 8, 22, '#54454C', 1)

    const title = torusBold.getTextPath(data?.title || '', 60, 20, 18, 'left baseline')

    const value = torusBold.get2SizeTextPath(
        data?.large || '', data?.small || '', 40, 30, width - 20, 45, 'right baseline'
    )

    const svg = '<g>' + base + rrect + value + title + icon_background + icon + '</g>'

    return svg.toString()
}


function label_U2(data = {
    image: null,

    color1: '#382E32',
    color2: '#382E32',

    text: '',
    text_color: '#fff',

    center: 200,
    towards_right: true, // 图片朝向
}) {
    const base = PanelDraw.Rect(0, 0, 400, 80, 40, '#382E32')

    const rrect = PanelDraw.GradientRect(0, 0, 400, 80, 40, [{
        offset: '0%',
        color: data?.color1,
        opacity: 1,
    }, {
        offset: '100%',
        color: data?.color2,
        opacity: 1,
    }], 0.4, {
        x1: '0%', y1: '40%', x2: '100%', y2: '60%'
    })

    const text = torusBold.getTextPath(data?.text || '', data?.center || '200', 56, 48, 'center baseline', data?.text_color || '#fff')

    const direction = data?.towards_right ? '1' : '-1'

    const image = data?.image ? `<image width="400" height="370" transform="translate(0 -370) scale(${direction}, 1)" xlink:href="${data?.image}" style="opacity: 1" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>` : ''

    const svg = '<g>' + base + rrect + text + image + '</g>'

    return svg.toString()
}