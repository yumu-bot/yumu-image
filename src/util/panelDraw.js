//把数组变成可视化的图表
import {torus} from "./font.js";
import {replaceText} from "./util.js";

export const PanelDraw = {
    Image: (x = 0, y = 0, w = 100, h = 100, link = '', opacity = 1) => {
        return `<image width="${w}" height="${h}" transform="translate(${x} ${y})" xlink:href="${link}" style="opacity: ${opacity};" preserveAspectRatio="xMidYMid slice" vector-effect="non-scaling-stroke"/>`;
    },

    Rect: (x = 0, y = 0, w = 0, h = 0, r = 0, color = '#fff', opacity = 1) => {
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" opacity="${opacity}" style="fill: ${color};"/>`;
    },

    Circle: (cx = 0, cy = 0, r = 0, color = '#fff') => {
        return `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill: ${color};"/>`;
    },

    Polygon: (x = 0, y = 0, controls = '', ex = 0, ey = 0, color = '#fff') => {
        return `<polygon points="${x} ${y} ${controls} ${ex} ${ey}" style="fill: ${color};"/>`
    },

    //柱状图，Histogram，max 如果填 null，即用数组的最大值。max_undertake是数组的最大值小于这个值时的 保底机制
    BarChart: (arr = [0], max = null, min = 0, x = 900, y = 1020, w = 520, h = 90, r = 0, gap = 0, color = '#fff', max_undertake = 0, floor = 0, minColor = '#aaa', opacity = 1) => {
        if (arr == null) return '';

        const arr_max = (typeof max === 'number') ? max :
            ((typeof max_undertake === 'number') ? Math.max(Math.max.apply(Math, arr), max_undertake) : Math.max.apply(Math, arr));
        const arr_min = (typeof min === 'number') ? min : Math.min.apply(Math, arr);
        const step = w / arr.length; //如果是100个，一步好像刚好5.2px
        const width = step - gap; //实际宽度
        let rect_svg = '<g>';

        arr.forEach((v, i) => {
            const isFloor = (v - arr_min) / (arr_max - arr_min) * h <= floor;
            const isMin = (v <= arr_min);

            const height = isFloor ? floor : Math.min((v - arr_min) / (arr_max - arr_min), 1) * h;
            const rectColor = isMin ? minColor : color;
            const x0 = x + step * i;
            const y0 = y - height;

            rect_svg += PanelDraw.Rect(x0, y0, width, height, r, rectColor, opacity);
        })

        return (rect_svg + '</g>').toString();
    },

    //折线图，max/min 如果填 0，即用数组的最大值
    LineChart: (arr = [0], max = 0, min = 0, x = 900, y = 900, w = 520, h = 90, color, path_opacity = 1, area_opacity = 0, stroke_width = 3, is0toMin = false) => {
        if (arr == null) return '';
        const arr_max = (max === 0) ? Math.max.apply(Math, arr) : max;
        const arr_min = (min === 0) ? Math.min.apply(Math, arr) : min;
        const delta = Math.abs(arr_max - arr_min);
        const step = w / arr.length;
        const x0 = x + step / 4; //为了居中，这里要加上最后1步除以4的距离
        const y0 = y;

        const initial = (delta > 0) ? ((arr.shift() - arr_min) / (arr_max - arr_min) * h) : 0;

        let path_svg = `<svg> <path d="M ${x0} ${y0 - initial} S `;
        let area_svg = path_svg;

        arr.forEach((v, i) => {
            const height = (delta > 0) ? ((v - arr_min) / (arr_max - arr_min) * h) : 0;
            const lineto_x = x0 + step * (i + 1);
            const lineto_y = (v === 0 && is0toMin) ? y0 : y0 - height; //如果数值为 0，则画在最小值的地方

            path_svg += `${lineto_x} ${lineto_y} ${lineto_x + step / 2} ${lineto_y} `; // 第一个xy是点位置，第二个是控制点位置
            area_svg += `${lineto_x} ${lineto_y} ${lineto_x + step / 2} ${lineto_y} `;
        })

        path_svg += `" style="fill: none; stroke: ${color}; opacity: ${path_opacity}; stroke-miterlimit: 10; stroke-width: ${stroke_width}px;"/> </svg>`
        area_svg += `L ${x0 + w - step / 2} ${y0} L ${x0} ${y0} Z" style="fill: ${color}; stroke: none; fill-opacity: ${area_opacity};"/> </svg>`//这里要减去最后1步除以2，我也不知道为什么

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

    // 六边形图的标识，offset 是直接加在弧度上（弧度制，比如 π/3 = 60°），r 是中点到边点的距离，一般比 Hexagon 大一点
    HexagonIndex: (data = ['A', 'B', 'C', 'D', 'E', 'F'], cx = 960, cy = 600, r = 230 + 30, offset = 0, text_color = '#fff', background_color = '#54454C') => {
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
     * @function 绘制饼图，需要搭配一个圆当 Mask
     * @return {String} 圆饼图的 svg
     * @param curr 数据，0-1
     * @param cx 中心横坐标
     * @param cy 中心纵坐标
     * @param r 半径
     * @param prev 起始位置，0-1（已经除以过 2π
     * @param color 颜色
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
        return PanelDraw.Polygon(cx, cy, controls, cx, cy, color);

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
    }
}