import {torusBold} from "../util/font.js";
import {round, rounds} from "../util/util.js";

export function component_V(
    chunk = {
        index: 1,
        start_bar: 0,
        notes: [],
        timings: []
    }, total_key = 4, max_height = 710, beats_per_bucket = 32, is_special = false, max_sv = 1.1, min_sv = 0
) {
    const overlay = getKeyOverlay(total_key, is_special)

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

    let reds = ''
    let greens = ''
    let yellows = ''
    let others = ''

    let green_count = 0

    const sv_mode = min_sv <= 0.2 && max_sv >= 3

    for (const timing of chunk.timings) {
        const relative = timing.beat - chunk.start_bar * 4;
        const y = 710 - ((relative / beats_per_bucket) * 710);

        switch (timing.type) {
            case 'red': case 'virtual': {
                // 渲染 BPM 红线
                if (timing.bpm < 1000) {

                    const bpm = rounds(timing.bpm, 2)

                    const has_dot = bpm.integer.includes('.')

                    reds += torusBold.getTextPath(bpm.integer.replace('.', ''), -2, y + 3, 14, 'right baseline', '#F990AB')
                        + torusBold.getTextPath((has_dot ? '.' : '') + bpm.decimal, -2, y + 3 + 10, 12, 'right baseline', '#F990AB')
                } else {
                    reds += torusBold.getTextPath('1K+', -2, y + 3, 14, 'right baseline', '#F990AB')
                }

                reds += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" stroke="#D32F2F" stroke-width="2" />`;
            } break

            case 'bar': {
                // 渲染 普通小节线
                if (!timing.is_near_next) {
                    others += torusBold.getTextPath(timing.measure_index.toString(), -2, y + 3, 14, 'right baseline', '#fff', 0.6)
                }

                others += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" stroke="#ccc" stroke-width="1.5" />`;
            } break

            case 'beat': {
                // 渲染 普通拍子线
                others += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" stroke="#666" stroke-width="1" />`;
            } break

            case 'preview': {
                // 渲染 预览线
                yellows += torusBold.getTextPath('PV', total_width + 2, y + 3, 14, 'left baseline', '#F6F05C')
                yellows += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" stroke="#F6F05C" stroke-width="2"/>`;
            } break

            case 'minute': {
                // 渲染 时间线
                const min = Math.round(timing.time / 60000)

                others += torusBold.get2SizeTextPath(min + ':', '00', 14, 10, total_width + 2, y + 3, 'left baseline', '#00B7EE', '#00B7EE')
                others += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" stroke="#00B7EE" stroke-width="1.5" stroke-dasharray="2,2" />`;
            } break

            case 'green': {
                green_count ++

                // 渲染 SV 绿线
                greens += torusBold.getTextPath(round(timing.sv, 2).replace('0.', '.'), total_width + 2, y + 3, 14, 'left baseline', '#CAF881')

                if (sv_mode) {
                    const current_sv = timing.standard_sv || 1.0;
                    const next_sv = timing.next_standard_sv || 1.0;

                    // 计算当前 SV 的 X 位置
                    const center_x = total_width / 2
                    let sv_x;
                    if (current_sv >= 1.0) {
                        const range = Math.max(max_sv, 1.01) - 1.0;
                        sv_x = center_x + (range === 0 ? 0 : ((Math.min(current_sv, 10) - 1.0) / range) * center_x);
                    } else {
                        const range = 1.0 - Math.min(min_sv, 0.99);
                        sv_x = center_x - (range === 0 ? 0 : ((1.0 - Math.max(current_sv, 0)) / range) * center_x);
                    }

                    let sv_x2;
                    if (next_sv >= 1.0) {
                        const range = Math.max(max_sv, 1.01) - 1.0;
                        sv_x2 = center_x + (range === 0 ? 0 : ((Math.min(next_sv, 10) - 1.0) / range) * center_x);
                    } else {
                        const range = 1.0 - Math.min(min_sv, 0.99);
                        sv_x2 = center_x - (range === 0 ? 0 : ((1.0 - Math.max(next_sv, 0)) / range) * center_x);
                    }

                    // 计算当前线和下一条线的 Y 坐标
                    const relative_start = timing.beat - chunk.start_bar * 4;
                    const relative_end = timing.next_beat - chunk.start_bar * 4; // 直接使用反向遍历存的值

                    const y_start = max_height - ((relative_start / beats_per_bucket) * max_height);
                    const y_end = max_height - ((relative_end / beats_per_bucket) * max_height);

                    // 绘制竖线：从当前开始位置向上拉到下一条线开始的位置
                    // 限制在当前 chunk 的高度范围内 (0 - 710)
                    const draw_y_bottom = Math.min(max_height, Math.max(0, y_start));
                    const draw_y_top = Math.min(max_height, Math.max(0, y_end));

                    if (draw_y_bottom !== draw_y_top) {
                        others += `<line x1="${sv_x}" y1="${draw_y_bottom}" x2="${sv_x}" y2="${draw_y_top}" stroke="#CAF881" stroke-width="3" opacity="0.3" />`
                            + `<line x1="${sv_x}" y1="${draw_y_top}" x2="${sv_x2}" y2="${draw_y_top}" stroke="#CAF881" stroke-width="3" opacity="0.3" />`;

                    }
                } else {
                    // 原来的线
                    greens += `<line x1="0" y1="${y}" x2="${total_width}" y2="${y}" opacity="0.8" stroke="#CAF881" stroke-width="1" stroke-dasharray="2,2" />`;
                }
            }
        }
    }

    // 太密集，这些线也不能要了
    if (green_count > 16) {
        greens = ''
    } else if (green_count === 0 && chunk.notes?.length > 0 && sv_mode) {
        greens += `<line x1="${total_width / 2}" y1="${0}" x2="${total_width / 2}" y2="${max_height}" stroke="#CAF881" stroke-width="3" opacity="0.2" />`
    }

    svg += (others + greens + reds + yellows);

    svg += `</g>`;

    // 画 note
    for (const note of chunk.notes) {
        if (note.type === 'circle') {
            const relative = note.render_start - chunk.start_bar * 4;
            const y = max_height - ((relative / beats_per_bucket) * max_height);

            const key = getKey(note.x, total_key)
            const x = key * line_width

            svg += `<use href="#note${overlay[key]}" x="${x}" y="${y - note_height / 2}" width="${line_width}" height="${note_height}" />`
        } else if (note.type === 'ln') {
            const relative_start = note.render_start - chunk.start_bar * 4;
            const relative_end = note.render_end - chunk.start_bar * 4;

            const start_y = max_height - ((relative_start / beats_per_bucket) * max_height);
            const end_y = max_height - ((relative_end / beats_per_bucket) * max_height);

            const key = getKey(note.x, total_key)
            const x = key * line_width

            const height = Math.min(max_height, Math.abs(start_y - end_y))

            svg += `<use href="#ln${overlay[key]}" x="${x}" y="${end_y}" width="${line_width}" height="${height}" opacity="0.6"/>`

            // 2. 只有当 render_start 等于原始 beat 时，才渲染头部的 Note 节点
            // 允许极小的浮点误差 (0.0001)
            if (Math.abs(note.render_start - note.beat) < 0.001) {
                if (start_y >= 0 && start_y <= 710) {
                    svg += `<use href="#note${overlay[key]}" x="${x}" y="${start_y - note_height / 2}" width="${line_width}" height="${note_height}" />`;
                }
            }

            // 3. 只有当 render_end 等于原始 end_beat 时，才渲染尾部的 Note 节点
            /*
            if (Math.abs(note.render_end - note.end_beat) < 1) {
                if (end_y >= 0 && end_y <= 710) {
                    svg += `<use href="#note${overlay[key]}" x="${x}" y="${end_y - note_height / 2}" width="${line_width}" height="${note_height}" />`;
                }
            }

             */
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