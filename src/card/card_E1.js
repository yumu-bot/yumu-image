
export async function card_E1(data = {
    star: 1.7,
    cover: '',
    title: '',
    title_unicode: '',
    version: '',
    artist: '',
    creator: '',
    id: '',
    status: '',
    favourite_count: 0,
    play_count: 0,
}, reuse = false) {
    // 读取模板
    let svg = `   <defs>
            <clipPath id="clippath-CN-1">
              <rect width="915" height="62" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CN-2">
              <circle cx="95" cy="31" r="25" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CN-1" height="120%" width="120%" x="-10%" y="-10%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            </filter>
          </defs>
          <g id="Background_CN_1">
            <rect width="915" height="62" rx="20" ry="20" style="fill: #382E32;"/>
            <circle cx="145" cy="31" r="25" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CN-1);" filter="url(#blur-CN-1)">
            </g>
          </g>
          <g id="Avatar_CN_1">
            <g style="clip-path: url(#clippath-CN-2);">
            </g>
          </g>
          <g id="Text_CN_1">
          </g>
          <g id="Mod_CN_1">
          </g>
          <g id="Label_CN_1">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CN_1">)/;
    const reg_avatar = /(?<= <g style="clip-path: url\(#clippath-CN-2\);">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CN-1\);" filter="url\(#blur-CN-1\)">)/;
    const reg_label = /(?<=<g id="Label_CN_1">)/;
    const reg_mod = /(?<=<g id="Mod_CN_1">)/;

    return svg.toString();
}