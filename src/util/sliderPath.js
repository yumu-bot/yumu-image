/**
 *
 * @param text
 * @param x
 * @param y
 * @return {{type: string, points: [{x: *, y: *}]}|{type: string, points: *[]}}
 */
export function parseControlPoints(text = '', x, y) {
    const parts = text.split('|');
    const type = parts.shift(); // 提取类型 (P, B, L, C)

    const points = [
        { x: x, y: y } // 必须包含起始点
    ];

    parts.forEach(p => {
        const [point_x, point_y] = p.split(':').map(v => parseInt(v));
        if (!isNaN(point_x) && !isNaN(point_y)) {
            points.push({ point_x, point_y });
        }
    });

    // 2. 如果不是 B 类型，直接返回平铺的点
    if (type !== 'B') {
        return { type, points: points };
    }

    // 3. 针对 B 类型进行嵌套分段 (处理红点)
    const segments = [];
    let current = [];

    for (let i = 0; i < points.length; i++) {
        const curr = points[i];
        const prev = points[i - 1];

        // 判定红点：当前点和前一个点坐标完全一致
        if (prev && curr.x === prev.x && curr.y === prev.y) {
            // 结束当前段
            if (current.length > 0) {
                segments.push(current);
            }
            // 开启新段，并将当前点（红点）作为新段的起点
            current = [curr];
        } else {
            current.push(curr);
        }
    }

    // 放入最后一段
    if (current.length > 0) {
        segments.push(current);
    }

    return {
        type: type,
        points: segments
    };
}

/**
 * 合并算法
 * @return {[{x:0, y:0}]}
 */
export function controlPointsToPath(slider = {type: 'L', points: [{ x: 0, y: 0 }, { x: 0, y: 0 }]}, step = 0.5) {
    const type = slider.type
    const points = slider.points

    let path

    if (type === 'L') {
        path = linearToPath(points, step)
    } else if (type === 'P') {
        switch (points.length) {
            case 3: path = perfectCircleToPath(points, step); break
            case 2: path = linearToPath(points, step); break
            default: path = bezierToPath([points], step); break
        }
    } else if (type === 'B') {
        path = bezierToPath(points, step);
    } else if (type === 'C') {
        path = catmullSplineToPath(points, step);
    }

    return path
}

/**
 * 根据 visual_length 修正路径
 * @param {Array} slider_path - 初始生成的平铺点数组 [{x,y}, ...]
 * @param {number} visual_length - 目标 osu!pixel 长度
 * @returns {Array} 修正后的点数组
 */
function fitPathToLength(slider_path, visual_length) {
    if (slider_path.length < 2) return slider_path;

    let current_length = 0;
    const result = [slider_path[0]];

    for (let i = 1; i < slider_path.length; i++) {
        const p1 = slider_path[i - 1];
        const p2 = slider_path[i];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        if (current_length + dist >= visual_length) {
            // 情况 A：当前路径已经达到或超过了要求的长度 -> 进行截断
            const remaining = visual_length - current_length;
            const ratio = remaining / dist;
            result.push({
                x: p1.x + (p2.x - p1.x) * ratio,
                y: p1.y + (p2.y - p1.y) * ratio
            });
            return result; // 已经满足长度，提前结束
        }

        current_length += dist;
        result.push(p2);
    }

    // 情况 B：遍历完所有点长度仍不足 -> 沿最后的方向延伸 L 直线
    if (current_length < visual_length) {
        const last = slider_path[slider_path.length - 1];
        const before_last = slider_path[slider_path.length - 2];
        const dist = Math.hypot(last.x - before_last.x, last.y - before_last.y);

        const remaining = visual_length - current_length;
        const ratio = remaining / dist;

        result.push({
            x: last.x + (last.x - before_last.x) * ratio,
            y: last.y + (last.y - before_last.y) * ratio
        });
    }

    return result;
}

function linearToPath(
    points,
    step = 0.5
) {
    const p1 = points[0] ?? {x: 0, y: 0}
    const p2 = points[1] ?? {x: 0, y: 0}
    const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);

    const count = Math.max(Math.ceil(distance / step), 1);

    const result = [];
    for (let i = 0; i <= count; i++) {
        const t = i / count;
        result.push({
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
        });
    }
    return result;
}

function deCasteljau(points, t) {
    let curr = [...points];
    while (curr.length > 1) {
        let next = [];
        for (let i = 0; i < curr.length - 1; i++) {
            next.push({
                x: (1 - t) * curr[i].x + t * curr[i + 1].x,
                y: (1 - t) * curr[i].y + t * curr[i + 1].y
            });
        }
        curr = next;
    }
    return curr[0];
}

function bezierToPath(control_points = [[{x: 0, y: 0}, {x: 0, y: 0}]], step = 0.5) {
    let approximate_length = 0;
    for (let i = 0; i < control_points.length - 1; i++) {
        approximate_length += Math.hypot(
            control_points[i + 1].x - control_points[i].x,
            control_points[i + 1].y - control_points[i].y
        );
    }

    const count = Math.max(Math.ceil(approximate_length * 1.5 / step), 20);
    const points = [];

    for (let i = 0; i <= count; i++) {
        const t = i / count;
        points.push(deCasteljau(control_points, t)); // 使用你之前的 De Casteljau 函数
    }

    return points;
}

/**
 * 向心 Catmull-Rom 插值 (Centripetal Catmull-Rom)
 */
function getCentripetalCatmullPoints(p0, p1, p2, p3, step = 0.5) {
    const alpha = 0.5; // 向心参数

    function getT(t, pA, pB) {
        const dist = Math.hypot(pB.x - pA.x, pB.y - pA.y);
        return Math.pow(dist, alpha) + t;
    }

    const t0 = 0;
    const t1 = getT(t0, p0, p1);
    const t2 = getT(t1, p1, p2);
    const t3 = getT(t2, p2, p3);

    // 估算 P1 到 P2 的距离来决定采样数
    const approxDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const count = Math.max(Math.ceil(approxDist / step), 1);
    const points = [];

    for (let i = 0; i < count; i++) {
        const t = t1 + (i / count) * (t2 - t1);

        const a1 = add(mul(p0, (t1-t)/(t1-t0)), mul(p1, (t-t0)/(t1-t0)));
        const a2 = add(mul(p1, (t2-t)/(t2-t1)), mul(p2, (t-t1)/(t2-t1)));
        const a3 = add(mul(p2, (t3-t)/(t3-t2)), mul(p3, (t-t2)/(t3-t2)));

        const b1 = add(mul(a1, (t2-t)/(t2-t0)), mul(a2, (t-t0)/(t2-t0)));
        const b2 = add(mul(a2, (t3-t)/(t3-t1)), mul(a3, (t-t1)/(t3-t1)));

        const c = add(mul(b1, (t2-t)/(t2-t1)), mul(b2, (t-t1)/(t2-t1)));
        points.push(c);
    }
    return points;
}

// 向量辅助运算
function add(v1, v2) { return { x: v1.x + v2.x, y: v1.y + v2.y }; }
function mul(v, s) { return { x: v.x * s, y: v.y * s }; }

function catmullSplineToPath(points = [], step = 0.5) {
    if (points.length < 2) return points;

    let result = [];
    // 我们需要处理从第一个点到最后一个点的每一段
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i === 0 ? points[i] : points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = (i + 2 >= points.length) ? points[i + 1] : points[i + 2];

        result.push(...getCentripetalCatmullPoints(p0, p1, p2, p3, step));
    }

    // 加上最后一个点
    result.push(points[points.length - 1]);
    return result;
}

/**
 * 完美圆弧 (P) 插值
 * @param {Array} points 三个点 [{x,y}, {x,y}, {x,y}]
 * @param {number} step 采样步长（像素）
 */
function perfectCircleToPath(points, step = 0.5) {
    if (points.length < 3) return points;

    const [p1, p2, p3] = points;

    // 1. 计算外接圆圆心
    const D = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));

    // 如果 D 为 0，说明三点共线
    if (Math.abs(D) < 0.0001) {
        return linearToPath(p1, p3, step); // 退化为直线
    }

    const centerX = ((p1.x ** 2 + p1.y ** 2) * (p2.y - p3.y) + (p2.x ** 2 + p2.y ** 2) * (p3.y - p1.y) + (p3.x ** 2 + p3.y ** 2) * (p1.y - p2.y)) / D;
    const centerY = ((p1.x ** 2 + p1.y ** 2) * (p3.x - p2.x) + (p2.x ** 2 + p2.y ** 2) * (p1.x - p3.x) + (p3.x ** 2 + p3.y ** 2) * (p2.x - p1.x)) / D;

    const radius = Math.hypot(p1.x - centerX, p1.y - centerY);

    // 2. 计算起始角度、中间角度和结束角度
    const start_angle = Math.atan2(p1.y - centerY, p1.x - centerX);
    const mid_angle = Math.atan2(p2.y - centerY, p2.x - centerX);
    const end_angle = Math.atan2(p3.y - centerY, p3.x - centerX);

    // 3. 确定旋转方向和总跨度
    // 我们需要通过中间点 p2 来确定弧线的方向
    let delta_end = end_angle - start_angle;
    let delta_mid = mid_angle - start_angle;

    // 弧度标准化处理
    while (delta_end < -Math.PI) delta_end += Math.PI * 2;
    while (delta_end > Math.PI) delta_end -= Math.PI * 2;
    while (delta_mid < -Math.PI) delta_mid += Math.PI * 2;
    while (delta_mid > Math.PI) delta_mid -= Math.PI * 2;

    // 如果中间点不在起始点和终点之间，说明需要绕远路（跨越 PI）
    if (Math.sign(delta_mid) !== Math.sign(delta_end) || Math.abs(delta_mid) > Math.abs(delta_end)) {
        delta_end = Math.sign(delta_end) * (Math.PI * 2 - Math.abs(delta_end));
    }

    // 4. 进行插值采样
    const arc_length = Math.abs(delta_end) * radius;
    const count = Math.max(Math.ceil(arc_length / step), 1);
    const path = [];

    for (let i = 0; i <= count; i++) {
        const t = i / count;
        const current_angle = start_angle + delta_end * t;
        path.push({
            x: centerX + Math.cos(current_angle) * radius,
            y: centerY + Math.sin(current_angle) * radius
        });
    }

    return path;
}
