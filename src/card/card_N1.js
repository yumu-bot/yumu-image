
export async function card_N1(data = {


}, reuse = false) {
    // 读取模板
    let svg =`   <defs>
            <clipPath id="clippath-CN-1">
              <rect width="1370" height="210" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <clipPath id="clippath-CN-2">
              <circle cx="145" cy="31" r="25" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CN-1" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            </filter>
          </defs>
          <g id="Background_CN_1">
            <rect width="1370" height="210" rx="20" ry="20" style="fill: #382E32;"/>
            <circle cx="145" cy="31" r="25" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CN-1);" filter="url(#blur-CN-1)">
                
            </g>
          </g>
          <g id="Avatar_CN_1">
          </g>
          <g id="Text_CN_1">
          </g>`;
}