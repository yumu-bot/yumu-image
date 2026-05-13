import {round, rounds} from "../util/util.js";
import {torusBold} from "../util/font.js";

export function component_V2(
    chunk = {
        index: 1,
        start_bar: 0,
        notes: [],
        timings: [],
        initial_sv: 1.0
    }, lane_height = 30, lane_width = 1920 - 40, beats_per_lane = 32, max_sv = 1.1, min_sv = 0, sv_mode = false
) {
    let svg = '';

    const small_height = 20
    const small_width = 20

    const big_height = 28
    const big_width = 28

    const drumroll_small_height = 20
    const drumroll_small_width = 20 / 2

    const drumroll_big_height = 28
    const drumroll_big_width = 28 / 2

    const spinner_approach_size = 30
    const spinner_circle_size = 15

    const text_under_delta = 14

    // 画 timing
    svg += `<g class="timing-${chunk.index}">`;

    // --- 绘制背景和轨道边界 ---

    svg += `<line x1="0" y1="0.5" x2="${lane_width}" y2="${lane_height - 0.5}" fill="#46393F" fill-opacity="1" />`;

    // 绘制轨道上下侧的竖线
    svg += `<line x1="0" y1="0" x2="${lane_width}" y2="0" stroke="#555" stroke-width="1" />`;
    svg += `<line x1="0" y1="${lane_height}" x2="${lane_width}" y2="${lane_height}" stroke="#555" stroke-width="1" />`;

    let reds = ''
    let greens = ''
    let yellows = ''
    let others = ''
    let sv_points = []

    let green_count = 0

    let before_bpm = -1
    let before_sv = -1

    for (const timing of chunk.timings) {
        const relative = timing.beat - chunk.start_bar * 4;
        const x = (relative / beats_per_lane) * lane_width;

        switch (timing.type) {
            case 'red': case 'virtual': {
                // 渲染 BPM 红线

                if (Math.abs(timing.bpm - before_bpm) < 1e-4) {
                    reds += torusBold.getTextPath('=', x, -4, 16, 'center baseline', '#F990AB')
                } else if (timing.bpm < 1000) {
                    const bpm = rounds(timing.bpm, 2)

                    reds += torusBold.get2SizeTextPath(bpm.integer, bpm.decimal, 16, 12, x, -4, 'center baseline', '#F990AB')
                } else {
                    reds += torusBold.getTextPath('+', x, -4, 16, 'center baseline', '#F990AB')
                }

                reds += `<line x1="${x}" y1="0" x2="${x}" y2="${lane_height}" stroke="#D32F2F" stroke-width="2" />`;

                before_bpm = timing.bpm
            } break

            case 'bar': {
                // 渲染 普通小节线
                if (!timing.is_near_next) {
                    others += torusBold.getTextPath(timing.measure_index.toString(), x, -4, 14, 'center baseline', '#fff', 0.6)
                }

                others += `<line x1="${x}" y1="0" x2="${x}" y2="${lane_height}" stroke="#ccc" stroke-width="1.5" />`;
            } break

            case 'beat': {
                // 渲染 普通拍子线
                others += `<line x1="${x}" y1="0" x2="${x}" y2="${lane_height}" stroke="#666" stroke-width="1" />`;
            } break

            case 'preview': {
                // 渲染 预览线
                yellows += torusBold.getTextPath('PV', x, lane_height + text_under_delta, 14, 'center baseline', '#F6F05C')
                yellows += `<line x1="${x}" y1="0" x2="${x}" y2="${lane_height}" stroke="#F6F05C" stroke-width="2"/>`;
            } break

            case 'minute':  {
                // 渲染 时间线
                const min = Math.floor(timing.time / 60000)

                others += torusBold.get2SizeTextPath(min + ':', '00', 14, 10, x, lane_height + text_under_delta, 'center baseline', '#00B7EE', '#00B7EE')
                others += `<line x1="${x}" y1="0" x2="${x}" y2="${lane_height}" stroke="#00B7EE" stroke-width="1.5" stroke-dasharray="2,2" />`;
            } break

            case 'minute_latest': {
                // 渲染 时间线
                const total = Math.floor(timing.time / 1000);
                const min = Math.floor(total / 60);
                const sec = total % 60;

                others += torusBold.get2SizeTextPath(min + ':', String(sec).padStart(2, '0'), 14, 10, x, lane_height + text_under_delta, 'center baseline', '#00B7EE', '#00B7EE')
                others += `<line x1="${x}" y1="0" x2="${x}" y2="${lane_height}" stroke="#00B7EE" stroke-width="1.5" stroke-dasharray="2,2" />`;
            } break

            case 'green': {
                if (sv_mode) {
                    const current_sv = timing.standard_sv || 1.0;
                    //const next_sv = timing.next_standard_sv || 1.0;

                    // 计算当前 SV 的 Y 位置
                    const center_y = lane_height / 2
                    let sv_y = getY(current_sv, center_y, max_sv, min_sv)

                    // 计算当前线和下一条线的 Y 坐标
                    const relative_start = timing.beat - chunk.start_bar * 4;
                    const relative_end = timing.next_beat - chunk.start_bar * 4; // 直接使用反向遍历存的值

                    const x_start = (relative_start / beats_per_lane) * lane_width
                    const x_end = (relative_end / beats_per_lane) * lane_width

                    const draw_x_left = Math.min(lane_width, Math.max(0, x_start));
                    const draw_x_right = Math.min(lane_width, Math.max(0, x_end));

                    // 需要考虑最前面绘制的线
                    if (green_count === 0 && relative_start > 0 && timing.prev_standard_sv != null) {
                        const prev_sv = timing.prev_standard_sv ?? 1.0

                        let sv_y0 = getY(prev_sv, center_y, max_sv, min_sv)

                        sv_points.push({ x: 0, y: sv_y0 }, { x: draw_x_left, y: sv_y0 })
                    }

                    if (draw_x_left !== draw_x_right) {
                        sv_points.push({ x: draw_x_left, y: sv_y }, { x: draw_x_right, y: sv_y })
                    }
                } else {
                    // 原来的线

                    // 渲染 SV 绿线
                    if (Math.abs(timing.sv - before_sv) < 1e-4) {
                        greens += torusBold.getTextPath('=', x, lane_height + text_under_delta, 14, 'center baseline', '#CAF881')
                    } else {
                        greens += torusBold.getTextPath(round(timing.sv, 2).replace('0.', '.'), x, lane_height + text_under_delta, 14, 'center baseline', '#CAF881')
                    }

                    greens += `<line x1="${x}" y1="0" x2="${x}" y2="${lane_height}" opacity="0.8" stroke="#CAF881" stroke-width="1" stroke-dasharray="2,2" />`;
                    before_sv = timing.sv
                }

                green_count ++
            }
        }
    }

    // 无绿线时
    if (sv_points.length === 0 && chunk.notes?.length > 0 && sv_mode) {
        const sv = chunk.initial_sv ?? 1.0
        const center_y = lane_height / 2

        const y = getY(sv, center_y, max_sv, min_sv)

        let opacity

        if (Math.abs(sv - 1.0) < 1e-4) {
            opacity = 0.2
        } else {
            opacity = 0.5
        }

        greens += `<line x1="0" y1="${y}" x2="${lane_width}" y2="${y}" stroke="#CAF881" stroke-width="3" opacity="${opacity}" />`
    } else {
        const pointsStr = sv_points.map(p => `${p.x},${p.y}`).join(' ');

        others += `<polyline 
            points="${pointsStr}" 
            fill="none" 
            stroke="#CAF881" 
            stroke-width="3" 
            opacity="0.5" 
            stroke-linejoin="round" 
            stroke-linecap="round" 
        />`;

    }

    svg += (others + greens + reds + yellows);

    svg += `</g>` + `<g class="note-${chunk.index}">`;

    // 画 note
    for (const note of chunk.notes) {
        if (note.type === 'circle') {
            const relative = note.render_start - chunk.start_bar * 4;
            const x = (relative / beats_per_lane) * lane_width;

            const ka = note.hit_sound.clap || note.hit_sound.whistle
            const big = note.hit_sound.finish

            const width = big ? big_width : small_width
            const height = big ? big_height : small_height

            const y = (lane_height - height) / 2

            let filter
            let href = (big) ? "big" : "note"

            if (ka) {
                filter = (big) ? "ka2" : "ka"
            } else {
                filter = (big) ? "don2" : "don"
            }

            svg += `<use href="#${href}" filter="url(#${filter})" x="${x - width / 2}" y="${y}" width="${width}" height="${height}" />`

        } else if (note.type === 'slider') {
            const relative_start = note.render_start - chunk.start_bar * 4;
            const relative_end = note.render_end - chunk.start_bar * 4;

            const start_x = Math.round((relative_start / beats_per_lane) * lane_width)
            const end_x = Math.round((relative_end / beats_per_lane) * lane_width)

            const big = note.hit_sound.finish

            const drumroll_height = big ? drumroll_big_height : drumroll_small_height
            const drumroll_width = big ? drumroll_big_width : drumroll_small_width

            const delta_x = Math.abs(start_x - end_x)

            let roll_width = Math.max(Math.min(lane_width, delta_x), 0)

            // 移除一些异常的条子
            if (roll_width < 3) {
                continue
            }

            const y = (lane_height - drumroll_height) / 2

            svg += `<use href="#roll-middle" x="${start_x}" y="${y}" width="${roll_width}" height="${drumroll_height}" opacity="0.6"/>`

            // 3. 只有当 render_end 等于原始 end_beat 时，才渲染尾部的 Note 节点
            if (Math.abs(note.render_end - note.end_beat) < 1) {
                if (end_x >= 0 && end_x <= lane_width) {
                    svg += `<use href="#roll-end" shape-rendering="crispEdges" 
                        x="0" 
                        y="0" 
                        width="${drumroll_width}" 
                        height="${drumroll_height}" 
                        transform="translate(${end_x}, ${y}) scale(-1, 1)"
                        />`;

                    svg += `<use href="#roll-end" shape-rendering="crispEdges" x="${end_x}" y="${y}" width="${drumroll_width}" height="${drumroll_height}"/>`
                }
            }


            // 2. 只有当 render_start 等于原始 beat 时，才渲染头部的 Note 节点
            // 允许极小的浮点误差 (0.0001)
            if (Math.abs(note.render_start - note.beat)< 1e-4) {
                if (start_x >= 0 && start_x <= lane_width) {
                    svg += `<use href="#roll-end" shape-rendering="crispEdges" 
                        x="0" 
                        y="0" 
                        width="${drumroll_width}" 
                        height="${drumroll_height}" 
                        transform="translate(${start_x}, ${y}) scale(-1, 1)"
                        />`;

                    svg += `<use href="#roll-end" shape-rendering="crispEdges" x="${start_x}" y="${y}" width="${drumroll_width}" height="${drumroll_height}"/>`
                }
            }
        } else if (note.type === 'spinner') {
            const relative = note.render_start - chunk.start_bar * 4;
            const x = (relative / beats_per_lane) * lane_width;

            svg += `<use href="#spinner-approach" x="${x- spinner_approach_size / 2}" y="${(lane_height - spinner_approach_size) / 2}" width="${spinner_approach_size}" height="${spinner_approach_size}"/>` +
                `<use href="#spinner-circle" x="${x - spinner_circle_size / 2}" y="${(lane_height - spinner_circle_size) / 2}" width="${spinner_circle_size}" height="${spinner_circle_size}"/>`
        }
    }

    svg += `</g>`;


    return svg;

}

function getY(sv = 1.0, center = 0, max_sv = 1.0, min_sv = 1.0) {
    let sv_y0;
    if (sv >= 1.0) {
        const range = Math.max(max_sv, 1.0) - 1.0;
        sv_y0 = center + (range === 0 ? 0 : ((Math.min(sv, 5) * -1.0 - 1.0) / range) * center);
    } else {
        const range = 1.0 - Math.min(min_sv, 1.0);
        sv_y0 = center - (range === 0 ? 0 : ((1.0 - Math.max(sv, 0)) * -1.0 / range) * center);
    }

    return sv_y0
}