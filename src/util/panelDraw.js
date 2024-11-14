//把数组变成可视化的图表
import {torus} from "./font.js";
import {isEmptyArray, isNumber, replaceText} from "./util.js";
import {hex2rgbColor} from "./color.js";

export const PanelDraw = {
    Image: (x = 0, y = 0, w = 100, h = 100, link = '', opacity = 1) => {
        return `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${link}" style="opacity: ${opacity};" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>`;
    },

    Rect: (x = 0, y = 0, w = 0, h = 0, r = 0, color = '#fff', opacity = 1) => {
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" style="fill: ${color}; fill-opacity: ${opacity}"/>`;
    },

    GradientRect: (x = 0, y = 0, w = 0, h = 0, r = 0, colors = [
        {
            offset: "0%",
            color: "#FFF",
            opacity: 1,
        }
    ], opacity = 1, position = {
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "0%",
    }) => {
        let out = `<g><defs>
                <linearGradient id="grad${x * y * w * h}" x1="${position.x1}" y1="${position.y1}" x2="${position.x2}" y2="${position.y2}">`

        for (const c of colors) {
            out += `<stop offset="${c.offset}" style="stop-color:rgb(${hex2rgbColor(c.color)});stop-opacity:${c.opacity}" />`
        }

        out += `</linearGradient>
                </defs>
                <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" style="fill: url(#grad${x * y * w * h}); fill-opacity: ${opacity}"/></g>`;

        return out
    },

    Circle: (cx = 0, cy = 0, r = 0, color = '#fff', opacity = 1) => {
        return `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill: ${color}; fill-opacity: ${opacity}"/>`;
    },

    /**
     * 发光圆圈。
     * @param cx 圆心的横坐标
     * @param cy 圆心的纵坐标
     * @param r 圆半径
     * @param base_color 圆圈内的颜色
     * @param luminous_color 圆圈外发光的颜色
     * @param lr 发光半径
     * @param name 避免重名的名称，可以自己设定一个，也可以让程序自己算
     * @return {string}
     * @constructor
     */

    LuminousCircle: (cx = 0, cy = 0, r = 0, base_color = '#fff', luminous_color = '#fff', lr = 0.75 * r, name = (cx * cy * r).toString()) => {
        const full = (r + lr)
        const stop = (full > 0) ? Math.round(Math.min(Math.abs(r / full), 1) * 100) : 50

        return `
        <g>
            <defs>
            <radialGradient id="RadialGradient${name}">
              <stop offset="0%" stop-color="${base_color}"/>
              <stop offset="${stop}%" stop-color="${base_color}"/>
              <stop offset="${stop}%" stop-color="${luminous_color}"/>
              <stop offset="100%" stop-color="transparent"/>
            </radialGradient>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="${full}" fill="url(#RadialGradient${name})" />
        </g>`;
    },

    Polygon: (x = 0, y = 0, controls = '', ex = 0, ey = 0, color = '#fff', opacity = 1) => {
        return `<polygon points="${x} ${y} ${controls} ${ex} ${ey}" style="fill: ${color}; fill-opacity: ${opacity}"/>`
    },

    /**
     * 绘制圆弧（其实可以画椭圆弧，到时候再说吧
     * @param x
     * @param y
     * @param x2
     * @param y2
     * @param r
     * @param color
     * @param opacity
     * @param type 0 小弧，1 大弧
     * @param direction 0 逆时针，1 顺时针
     * @return {string}
     * @constructor
     */
    Arc: (x = 0, y = 0, x2 = 0, y2 = 0, r = 0, color = '#fff', opacity = 1, type = 0, direction = 0) => {
        return `<path d="M ${x} ${y} A ${r} ${r} 0 ${type} ${direction} ${x2} ${y2}" style="stroke: ${color}; stroke-opacity: ${opacity}"/>`
    },

    /**
     * 绘制饼图。无需使用遮罩。
     * @param cx 饼图中心 x 坐标
     * @param cy 饼图中心 y 坐标
     * @param r 饼图半径
     * @param current 当前进度，0-1
     * @param previous 之前进度，0-1
     * @param color 颜色
     * @param opacity
     * @param direction 0 逆时针，1 顺时针
     * @return {string}
     * @constructor
     */
    Pie: (cx = 0, cy = 0, r = 0, current = 0, previous = 0, color = '#fff', opacity = 1, direction = 1) => {
        const pi = Math.PI;
        let rad_curr = 2 * pi * current;
        let rad_prev = 2 * pi * previous;

        //如果小于start，则变换位置
        if (rad_curr < rad_prev) {
            rad_prev = rad_prev + rad_curr;
            rad_curr = rad_prev - rad_curr;
            rad_prev = rad_prev - rad_curr;
        }

        let sin_sign;
        const cos_sign = -1

        if (direction === 1) {
            sin_sign = 1
        } else {
            sin_sign = -1
        }

        const x1 = cx + r * sin_sign * Math.sin(rad_prev);
        const y1 = cy + r * cos_sign * Math.cos(rad_prev);

        const x2 = cx + r * sin_sign * Math.sin(rad_curr);
        const y2 = cy + r * cos_sign * Math.cos(rad_curr);

        // 绘制弧线时，使用长弧或者短弧 0 小弧，1 大弧
        const type = Math.abs(current - previous) >= 0.5 ? 1 : 0

        return `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${type} ${direction} ${x2} ${y2} L ${cx} ${cy} L ${x1} ${y1} Z" style="fill: ${color}; fill-opacity: ${opacity}"/>`
    },

    Diamond: (x = 0, y = 0, w = 0, h = 0, color = '#fff', opacity = 1) => {
        const top = (x + w/2) + ' ' + y;
        const right = (x + w) + ' ' + (y + h/2);
        const bottom = (x + w/2) + ' ' + (y + h);
        const left = x + ' ' + (y + h/2);

        return `<polygon points="${top} ${right} ${bottom} ${left} ${top}" style="fill: ${color}; fill-opacity: ${opacity}"/>`
    },

    //柱状图，Histogram，max 如果填 0，即用数组的最大值。max_undertake是数组的最大值小于这个值时的 保底机制
    BarChart: (arr = [0], max = 0, min = 0, x = 900, y = 1020, w = 520, h = 90, r = 0, gap = 0, color = '#fff' || ['#fff'], max_undertake = 0, floor = 0, minColor = '#aaa', opacity = 1, is_reverse = false) => {
        if (isEmptyArray(arr)) return '';

        const arr_max = (isNumber(max) && max > 0) ? max :
            (isNumber(max_undertake) ? Math.max(Math.max.apply(Math, arr), max_undertake) : Math.max.apply(Math, arr));
        const arr_min = (isNumber(min) && min > 0) ? min : Math.min.apply(Math, arr);
        const step = w / arr.length; //如果是100个，一步好像刚好5.2px
        const width = step - gap; //实际宽度
        let rect_svg = '<g>';

        arr.forEach((v, i) => {
            let rrect_color;
            if (Array.isArray(color)) {
                rrect_color = color[Math.min(color.length - 1, i)]
            } else {
                rrect_color = color
            }

            const isFloor = (v - arr_min) / (arr_max - arr_min) * h <= floor;
            const isMin = (v <= arr_min) && typeof minColor === "string";

            const height = isFloor ? floor : Math.min((v - arr_min) / (arr_max - arr_min), 1) * h;
            const rectColor = isMin ? minColor : rrect_color;
            const x0 = x + step * i;
            const y0 = is_reverse ? y : (y - height);

            rect_svg += PanelDraw.Rect(x0, y0, width, height, r, rectColor, opacity);
        })

        return (rect_svg + '</g>').toString();
    },

    /**
     * 折线图，max/min
     * @param arr
     * @param max 如果填 0，即用数组的最大值
     * @param min 如果填 0，即用数组的最小值
     * @param x 图像左下角 x
     * @param y 图像左下角 y
     * @param w
     * @param h
     * @param color 折线颜色
     * @param path_opacity 折线透明度
     * @param area_opacity 区域透明度
     * @param stroke_width 折线宽度
     * @param is0toMin 如果数值为 0，则画在最小值的地方，适用于个人排名之类的情况
     * @return {string}
     * @constructor
     */
    LineChart: (arr = [0], max = 0, min = 0, x = 900, y = 900, w = 520, h = 90, color, path_opacity = 1, area_opacity = 0, stroke_width = 3, is0toMin = false) => {
        if (isEmptyArray(arr) || arr?.length < 1) return '';
        const arr_max = (max === 0) ? Math.max.apply(Math, arr) : max;
        const arr_min = (min === 0) ? Math.min.apply(Math, arr) : min;
        const delta = Math.abs(arr_max - arr_min);
        const step = w / (arr.length - 1);

        const initial = (delta > 0) ? ((arr[0] - arr_min) / (arr_max - arr_min) * h) : 0;

        let path_svg = `<svg> <path d="M ${x} ${y - initial} S `;
        let area_svg = path_svg;

        for (let i = 1; i < arr.length; i++) {
            const v = arr[i]

            const height = (delta > 0) ? ((v - arr_min) / (arr_max - arr_min) * h) : 0;
            const lineto_x = x + step * i;
            const lineto_y = (v === 0 && is0toMin) ? y : y - height; //如果数值为 0，则画在最小值的地方

            // 图像点位置
            const position_point = `${lineto_x} ${lineto_y} `

            path_svg += position_point;
            area_svg += position_point;

            if (i < (arr.length - 1)) {
                // 贝塞尔曲线的控制点位置
                const control_point = `${lineto_x + step / 2} ${lineto_y} `

                path_svg += control_point
                area_svg += control_point
            } else {
                // 最后一个控制点与结束点相同，否则会导致渲染错误
                path_svg += position_point
                area_svg += position_point
            }
        }


        path_svg += `" style="fill: none; stroke: ${color}; opacity: ${path_opacity}; stroke-miterlimit: 10; stroke-width: ${stroke_width}px;"/> </svg>`
        area_svg += `L ${x + w} ${y} L ${x} ${y} Z" style="fill: ${color}; stroke: none; fill-opacity: ${area_opacity};"/> </svg>`

        return (path_svg + area_svg).toString();
    },

    //六边形图，data 是 0-1，offset 是直接加在弧度上（弧度制，比如 π/3 = 60°）
    HexagonChart: (data = [0, 0, 0, 0, 0, 0], cx = 960, cy = 600, r = 230, line_color = '#fff', offset = 0) => {
        if (data?.length < 6) return '';

        const PI_3 = Math.PI / 3;
        let line = `<path d="M `;
        let circle = '';

        for (let i = 0; i < 6; i++) {
            const std_data = Math.min(Math.max(data[i], 0), 1);

            const x = cx - r * Math.cos(PI_3 * i + offset) * std_data;
            const y = cy - r * Math.sin(PI_3 * i + offset) * std_data;
            line += `${x} ${y} L `;
            circle += PanelDraw.Circle(x, y, 10, line_color);
        }

        line = line.substr(0, line.length - 2);
        const line1 = `Z" style="fill: none; stroke-width: 6; stroke: ${line_color}; opacity: 1;"/> `
        const line2 = `Z" style="fill: ${line_color}; stroke-width: 6; stroke: none; opacity: 0.3;"/> `
        return line + line1 + line + line2 + circle;
    },

    // 六边形图的标识，offset 是直接加在弧度上（弧度制，比如 π/3 = 60°），r 是中点到边点的距离，一般比 Hexagon 230 大一点 + 30
    HexagonIndex: (data = ['A', 'B', 'C', 'D', 'E', 'F'], cx = 960, cy = 600, r = 260, offset = 0, text_color = '#fff', background_color = '#54454C') => {
        if (data?.length < 6) return '';
        const PI_3 = Math.PI / 3;

        let svg = '<g id="Rect"></g><g id="IndexText"></g>';
        const reg_rrect = /(?<=<g id="Rect">)/;
        const reg_text = /(?<=<g id="IndexText">)/;

        for (let i = 0; i < 6; i++){
            const value = data[i];

            const x = cx - r * Math.cos(PI_3 * i + offset);
            const y = cy - r * Math.sin(PI_3 * i + offset);

            const param_text = torus.getTextPath(value, x, y + 8, 24, 'center baseline', text_color);
            svg = replaceText(svg, param_text, reg_text)
            const param_width = torus.getTextWidth(value, 24);
            const rrect = PanelDraw.Rect(x - param_width / 2 - 20, y - 15, param_width + 40, 30, 15, background_color);
            svg = replaceText(svg, rrect, reg_rrect);

        }
        return svg;
    },

    /**
     * @function 绘制饼图，需要搭配一个圆当 Mask。**请使用重构后的 Pie 功能。**
     * @return {String} 圆饼图的 svg
     * @param curr
     * @param cx 中心横坐标
     * @param cy 中心纵坐标
     * @param r 半径
     * @param prev
     * @param color
     */
    PieChart: (curr = 1.0, cx = 0, cy = 0, r = 100, prev = 0, color = '#fff') => {
        const pi = Math.PI;
        let radCurr = 2 * pi * curr;
        let radPrev = 2 * pi * prev;

        //如果小于start，则变换位置
        if (radCurr < radPrev) {
            radPrev = radPrev + radCurr;
            radCurr = radPrev - radCurr;
            radPrev = radPrev - radCurr;
        }

        //获取中继点，这个点可以让区域控制点完美处于圆的外围
        const assist = getAssistPoint(radPrev, radCurr, cx, cy, r);

        const xMin = cx + r * Math.sin(radPrev);
        const yMin = cy - r * Math.cos(radPrev);
        const xMax = cx + r * Math.sin(radCurr);
        const yMax = cy - r * Math.cos(radCurr);

        const controls = `${xMin} ${yMin} ${assist}${xMax} ${yMax}`; //这里assist后面的空格是故意删去的
        return PanelDraw.Polygon(cx, cy, controls, cx, cy, color, 1);

        //获取中继点
        function getAssistPoint(radMin = 0, radMax = 0, cx = 0, cy = 0, r = 100) {
            //r给控制点的圆的半径，比内部圆大很多
            const pi = Math.PI;
            if (radMax < radMin) return '';

            let assist;
            const assist_arr = ['',
                (cx + r) + ' ' + (cy - r) + ' ',
                (cx + r) + ' ' + (cy + r) + ' ',
                (cx - r) + ' ' + (cy + r) + ' ',
                (cx - r) + ' ' + (cy - r) + ' '];

            if (radMin < pi / 4) {
                if (radMax < pi / 4) assist = '';
                else if (radMax < 3 * pi / 4) assist = (assist_arr[1]);
                else if (radMax < 5 * pi / 4) assist = (assist_arr[1] + assist_arr[2]);
                else if (radMax < 7 * pi / 4) assist = (assist_arr[1] + assist_arr[2] + assist_arr[3]);
                else assist = (assist_arr[1] + assist_arr[2] + assist_arr[3] + assist_arr[4]);
            } else if (radMin < 3 * pi / 4) {
                if (radMax < 3 * pi / 4) assist = '';
                else if (radMax < 5 * pi / 4) assist = (assist_arr[2]);
                else if (radMax < 7 * pi / 4) assist = (assist_arr[2] + assist_arr[3]);
                else assist = (assist_arr[2] + assist_arr[3] + assist_arr[4]);
            } else if (radMin < 5 * pi / 4) {
                if (radMax < 5 * pi / 4) assist = '';
                else if (radMax < 7 * pi / 4) assist = (assist_arr[3]);
                else assist = (assist_arr[3] + assist_arr[4]);
            } else if (radMin < 7 * pi / 4) {
                if (radMax < 7 * pi / 4) assist = '';
                else assist = (assist_arr[4]);
            } else {
                assist = '';
            }
            return assist.toString();
        }
    },

    // 散点图
    Scatter: (x = 0, y = 0, w = 0, h = 0, r = 0, opacity = 1, data_x = [0], data_y = [0], colors = ['none'], x_min = 0, x_max = 0, y_min = 0, y_max = 0,
    ) => {
        let svg = '<g>'

        if (isEmptyArray(data_x) || isEmptyArray(data_y) || isEmptyArray(colors)) return ''

        for (const i in data_x) {
            const dx = data_x[i]
            const dy = data_y[i]
            const color = colors[i]

            const cx = x + ((dx - x_min) / (x_max - x_min) || dx)
            const cy = y + ((dy - y_min) / (y_max - y_min) || dy)

            svg += PanelDraw.Circle(cx, cy, r, color, opacity)
        }

        svg += '</g>'
        return svg.toString()
    },
}

export const RainbowRect = PanelDraw.GradientRect(510, 40, 195, 60, 15, [
    {
        offset: "0%",
        color: "#d56e74",
        opacity: 1,
    },{
        offset: "14%",
        color: "#dd8d52",
        opacity: 1,
    },{
        offset: "28%",
        color: "#fff767",
        opacity: 1,
    },{
        offset: "42%",
        color: "#88bd6f",
        opacity: 1,
    },{
        offset: "57%",
        color: "#55b1ef",
        opacity: 1,
    },{
        offset: "71%",
        color: "#59509e",
        opacity: 1,
    },{
        offset: "86%",
        color: "#925c9f",
        opacity: 1,
    }
], 0.4, {
    x1: "0%",
    y1: "45%",
    x2: "100%",
    y2: "55%",
})