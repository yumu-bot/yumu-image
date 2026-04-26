

export function component_V(
    chunk = {
        index: 1,
        start_bar: 0,
        notes: [],
        timings: []
    }, total_key = 4, max_height = 710, beats_per_bucket = 32,
) {
    const slit = getKeyOverlay(total_key, false)

    let svg = `<g class="note-${chunk.index}">`;

    const line_width = 10
    const note_height = 5
    const total_width = total_key * line_width

    // 画 timing
    svg += `<g class="timing-${chunk.index}">`;

    // --- 绘制背景和轨道边界 ---
    // 绘制轨道左右侧的竖线
    svg += `<line x1="0" y1="0" x2="0" y2="710" stroke="#555" stroke-width="1" />`;
    svg += `<line x1="${total_width}" y1="0" x2="${total_width}" y2="710" stroke="#555" stroke-width="1" />`;

    // --- 绘制 Timing Lines (水平线) ---
    for (let i = 0; i <= beats_per_bucket; i++) {
        // 计算当前拍子在桶内的相对 Y 坐标
        // 0 拍在底部 (710), 32 拍在顶部 (0)
        const y = 710 - (i / beats_per_bucket) * 710;

        // 判断是小节线还是节拍线
        const isBarLine = i % 4 === 0; // 假设是 4/4 拍

        if (isBarLine) {
            // 小节线：颜色更亮，贯穿整个轨道
            svg += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" stroke="rgba(255,0,0,0.8)" stroke-width="1" />`;
        } else {
            // 节拍线：颜色更暗，或者只在轨道中间
            svg += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />`;
        }
    }
    svg += `</g>`;

    // 画 note
    for (const note of chunk.notes) {
        if (note.type === 'circle') {
            const relative = note.render_start - chunk.start_bar * 4;
            const y = max_height - ((relative / beats_per_bucket) * max_height);

            const key = getKey(note.x, total_key)
            const x = key * line_width

            svg += `<use href="#note${slit[key]}" x="${x}" y="${y - note_height / 2}" width="${line_width}" height="${note_height}" />`
        } else if (note.type === 'ln') {
            const relative_start = note.render_start - chunk.start_bar * 4;
            const relative_end = note.render_end - chunk.start_bar * 4;

            const start_y = max_height - ((relative_start / beats_per_bucket) * max_height);
            const end_y = max_height - ((relative_end / beats_per_bucket) * max_height);

            const key = getKey(note.x, total_key)
            const x = key * line_width

            const height = Math.min(max_height, Math.abs(start_y - end_y))

            svg += `<use href="#ln${slit[key]}" x="${x}" y="${end_y}" width="${line_width}" height="${height}" />`

            // 2. 只有当 render_start 等于原始 beat 时，才渲染头部的 Note 节点
            // 允许极小的浮点误差 (0.0001)
            if (Math.abs(note.render_start - note.beat) < 0.0001) {
                if (start_y >= 0 && start_y <= 710) {
                    svg += `<use href="#note${slit[key]}" x="${x}" y="${start_y - note_height / 2}" width="${line_width}" height="${note_height}" />`;
                }
            }

            // 3. 只有当 render_end 等于原始 end_beat 时，才渲染尾部的 Note 节点
            if (Math.abs(note.render_end - note.end_beat) < 0.0001) {
                if (end_y >= 0 && end_y <= 710) {
                    svg += `<use href="#note${slit[key]}" x="${x}" y="${end_y - note_height / 2}" width="${line_width}" height="${note_height}" />`;
                }
            }
        }
    }

    svg += `</g>`;


    return svg;
}

function getKeyOverlay(total_key = 4, is_special = false) {
    // 场景 A: 特殊排列 (s, 1, 2, 1, 2...)
    if (is_special && total_key % 2 === 0) {
        const result = ['s'];
        for (let i = 0; i < total_key - 1; i++) {
            // 交替添加 1 和 2
            result.push(i % 2 === 0 ? '1' : '2');
        }
        return result;
    }

    // 场景 B: 标准对称排列 (1, 2, 2, 1 或 1, 2, s, 2, 1)
    const half = Math.floor(total_key / 2);

    const side = [];
    for (let i = 0; i < half; i++) {
        side.push(i % 2 === 0 ? '1' : '2');
    }

    return total_key % 2 === 0
        ? [...side, ...[...side].reverse()]
        : [...side, 's', ...[...side].reverse()];
}

/**
 * 返回 0 ~ total_key - 1
 * @param x
 * @param total_key
 * @return {number}
 */
function getKey(x = 0, total_key = 4) {
    return Math.max(Math.min(Math.floor(x * total_key / 512), total_key - 1), 0)
}