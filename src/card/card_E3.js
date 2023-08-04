export async function card_E3(data = {
    density_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],
    retry_arr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 18, 360, 396, 234, 45, 81, 54, 63, 90, 153, 135, 36, 9, 63, 54, 36, 144, 54, 9, 9, 36, 18, 45, 45, 36, 108, 63, 9, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 27, 0, 18, 0, 0, 0, 18, 18, 18, 0, 0, 0, 9, 18, 9, 0, 9, 9, 0, 9, 0, 9, 18, 9, 0, 0, 27, 0, 0, 0, 0, 27, 9, 9, 0, 9, 9, 0, 0, 0, 9, 0, 0, 9, 9, 0, 9],
    fail_arr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 54, 9, 36, 27, 9, 18, 0, 0, 18, 18, 45, 27, 27, 18, 90, 36, 18, 36, 0, 18, 45, 36, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 45, 27, 9, 0, 18, 90, 9, 0, 0, 9, 9, 9, 27, 0, 9, 27, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 9, 0, 9, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 0],

    public_rating: 9.42,
    pass_percent: 56,
    retry_percent: 42,
    fail_percent: 2,

    labels: [{
        remark: '-1.64%',
        data_b: '98',
        data_m: '.36%',
    },{
        remark: '7:27',
        data_b: '7:',
        data_m: '27',
    }],
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