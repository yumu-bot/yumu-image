
export async function card_E2(data = {
    rank: 'SS',
    mods: ["DT", "NF"],
    score: 2274671,
    accuracy: 98.36,
    combo: 5724,
    pp: 1919,
    mode: 'OSU',

    advanced_judge: 'nomiss', //进阶评级，也就是面板圆环下面那个玩意
    acc_index: '~ S',
    max_combo: 5724,
    full_pp: 810,
    max_pp: 1919,
    statistics: [{
        index: '300',
        stat: 9999,
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#8DCFF4',
    }, {
        index: '100',
        stat: 9999,
        index_color: '#fff',
        stat_color: '#fff',
        rrect_color: '#79C471',
    }],
    statistics_max: 9999,

    isFC: true,
    isPF: true,
    isBest: true,

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