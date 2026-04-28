import {exportJPEG, getImage, getImageFromV3, getMapBackground, getPanelNameSVG, getSvgBody,} from "../util/util.js";
import {component_V} from "../component/component_V.js";
import {PanelDraw} from "../util/panelDraw.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A2} from "../card/card_A2.js";
import {torusBold} from "../util/font.js";
import {getBeatmapFilePath, getLongestBPM, parseBeatmapFile} from "../util/file.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_V(data);
        res.set('Content-Type', 'image/jpeg');
        res.send(await exportJPEG(svg));
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

export async function router_svg(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_V(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 谱面预览面板
 * !v
 * @param data
 * @return {Promise<string>}
 */
export async function panel_V(
    data = {
        beatmap: {},
        page: 1,
        mode: 'osu',
        rows: 5,
    })
{


    const path = await getBeatmapFilePath(data.beatmap.id)
    const {timings, notes, difficulty, general} = await parseBeatmapFile(path)

    const key = Math.round(difficulty.cs)

    notes.sort((a, b) => a.time - b.time);

    const only_red = timings.sort((a, b) => a.time - b.time).filter(t => t.type === 'red');

    const first_time = notes[0]?.time ?? 0
    const last_time = notes[notes.length - 1]?.time ?? 0

    // 算标准bpm
    const {bpm} = getLongestBPM(only_red, last_time)
    const beat_length = 60000 / bpm

    const lane_width = 10
    const chunk_gap = 30
    const chunk_width = chunk_gap + key * lane_width;

    const bucket = Math.floor(((1920 - chunk_gap) / chunk_width))

    const rows = data?.rows ?? 5
    const chunks_per_page = bucket * rows;

    const bar_per_bucket = 4;
    const beats_per_bucket = bar_per_bucket * 4;

    const chunk_x = (1920 - (bucket * chunk_width - chunk_gap)) / 2


    // 1. 计算最后一个音符所在的绝对拍数位置
    const total_beats = (last_time - first_time) / beat_length;

    // 2. 计算一页总共能显示多少拍
    const beats_per_page = beats_per_bucket * chunks_per_page;

    // 如果 total_beats 是 100，每页能放 32 拍，则需要 ceil(3.125) = 4 页
    const total_pages = Math.max(1, Math.ceil(total_beats / beats_per_page));

    // 1. 计算当前页的小节范围
    const page = (data.page || 1);
    const start_bar = (Math.min(Math.max(page, 1), total_pages) - 1) * chunks_per_page * bar_per_bucket;

    // 2. 初始化 x 个切片桶
    const chunks = Array.from({ length: chunks_per_page }, (_, i) => ({
        index: i,
        start_bar: start_bar + (i * bar_per_bucket), // 当前切片起始小节
        notes: [],
        timings: []
    }));

    const pageStartBeat = start_bar * 4;
    const totalBeatsPerPage = chunks_per_page * beats_per_bucket;

    // 使用一个很小的 epsilon (1ms 级别对应的 beat 长度)
    const epsilon = 0.005;

    for (const note of notes) {
        const beat = (note.time - first_time) / beat_length;
        const end_beat = (note.type === 'ln') ? ((note.end_time - first_time) / beat_length) : beat;


        // 1. 过滤：如果整个音符都在当前页之前或之后，直接跳过
        if (end_beat < pageStartBeat || beat >= pageStartBeat + totalBeatsPerPage) {
            continue;
        }


        // start_chunk 计算时增加 epsilon，如果是 31.999，会变成 32.004，从而 floor 到 1 而不是 0
        const start_chunk = Math.max(0, Math.floor((beat - pageStartBeat + epsilon) / beats_per_bucket));

        let end_chunk;
        if (note.type === 'circle') {
            end_chunk = start_chunk;
        } else {
            // end_chunk 保持之前的逻辑，或者也微调 epsilon
            end_chunk = Math.min(chunks_per_page - 1, Math.floor((end_beat - pageStartBeat - epsilon) / beats_per_bucket));
        }

        // 兜底：确保 end 不小于 start
        end_chunk = Math.max(start_chunk, end_chunk);

        // 3. 遍历并裁剪
        for (let c = start_chunk; c <= end_chunk; c++) {
            const chunkStartBeat = pageStartBeat + (c * beats_per_bucket);
            const chunkEndBeat = chunkStartBeat + beats_per_bucket;

            chunks[c]?.notes?.push({
                ...note,
                beat: beat,
                end_beat: end_beat,
                render_start: Math.max(beat, chunkStartBeat),
                render_end: Math.min(end_beat, chunkEndBeat)
            });
        }
    }

    const full_line = []

    // 插入小节和拍子线
    for (let i = 0; i < only_red.length; i++) {
        const current = only_red[i];
        const next = only_red[i + 1];

        const next_time = (i < only_red.length - 1) ? next.time : last_time;

        // 每一拍的长度
        const beat_length = current.beat_length;

        // 从当前红点开始，以“拍”为单位步进
        for (let time = current.time; time < next_time; time += beat_length) {

            // 跳过红线重合点
            if (Math.abs(time - current.time) < 1) {
                continue;
            }

            // 计算当前拍是在这个红线段落里的第几拍
            const beat_index = Math.round((time - current.time) / beat_length);

            // 如果能被 meter 整除，说明是小节线（Bar Line），否则是拍子线（Beat Line）
            const is_bar = (beat_index % current.meter) === 0;

            const t = Math.round(time);
            const beat = (t - first_time) / beat_length;

            const until_next = next_time - time;
            const is_near_next = next && (until_next < beat_length * 0.1);

            full_line.push({
                time: t,
                beat_length: current.beat_length,
                beat: beat,
                sv: -1,
                measure_index: is_bar ? (beat_index / current.meter) + 1 : null,
                is_near_next: is_near_next,
                meter: current.meter,
                sample: current.sample,
                sample_group: current.sample_group,
                volume: current.volume,
                type: is_bar ? 'bar' : 'beat',
                effect: current.effect,
                bpm: current.bpm,
            })
        }
    }

    const min_interval = 60000;
    const last_note_time = notes[notes.length - 1]?.time ?? 0;

    // 插入分钟线
    for (let t = 0; t <= last_note_time; t += min_interval) {
        if (t === 0) continue; // 跳过 0ms

        const beat = (t - first_time) / beat_length

        full_line.push({
            time: t,
            type: 'minute',
            beat: beat,
        });
    }

    if (general.preview > 0) {
        full_line.push({
            time: general.preview,
            type: 'preview',
            beat: (general.preview - first_time) / beat_length,
        })
    }

    timings.forEach(v => full_line.push({
        ...v,
        beat: (v.time - first_time) / beat_length
    }))

    full_line.sort((a, b) => a.time - b.time)

    for (const line of full_line) {
        // 1. 过滤：不在当前页范围内的直接跳过
        if (line.beat < pageStartBeat || line.beat >= pageStartBeat + totalBeatsPerPage) {
            continue;
        }

        // 2. 计算对应的 chunk 索引
        // 使用与 note 相同的索引计算逻辑
        const c = Math.floor((line.beat - pageStartBeat + epsilon) / beats_per_bucket);

        // 3. 压入对应 chunk 的 timings 数组
        if (chunks[c]) {
            chunks[c].timings.push(line);
        }
    }

    let max_used_chunk_index = -1;
    // 遍历当前页的所有切片，找出最后一个包含音符或时间线的切片索引
    for (let i = 0; i < chunks_per_page; i++) {
        if (chunks[i].notes.length > 0 || chunks[i].timings.length > 0) {
            max_used_chunk_index = i;
        }
    }

    // 添加虚拟红线
    const first_chunk = chunks[0];

    const first_red = only_red?.[0]
    const first_red_line_time = first_red?.time ?? 0
    const first_note_time = notes?.[0]?.time ?? 0

    const has_red_line_around_first_note = Math.abs(first_red_line_time - first_note_time) <= beat_length;

    if (!has_red_line_around_first_note && first_chunk.notes.length > 0) {
        const first = notes[0];

        const virtual = {
            time: first.time,
            beat: first.beat,
            type: 'virtual',
            bpm: first_red.bpm
        };

        first_chunk.timings.unshift(virtual);

        // 剔除过于接近虚拟红线的小节拍子线
        const threshold = 0.5;

        first_chunk.timings = first_chunk.timings.filter(t => {
            if (t === virtual) return true;

            return !((t.type === 'beat' || t.type === 'bar') && Math.abs(t.beat - virtual.beat) < threshold);
        });
    }

    // 如果当前页完全没有内容（例如超出页码或空谱面），默认至少显示 1 行
    // 否则，根据最大切片索引计算需要几行（索引从 0 开始，除以 bucket 即可算出所在行）
    const actual_rows = max_used_chunk_index === -1 ? 1 : Math.floor(max_used_chunk_index / bucket) + 1;

    // 4. 组装 SVG

    const row_height = 710;
    const row_gap = 20;
    const total_height = 290 + 40 + (actual_rows * row_height) + ((actual_rows - 1) * row_gap) + 40;

    let svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="1920" height="${total_height}" viewBox="0 0 1920 ${total_height}">
<defs>
  <symbol id="note1" viewBox="0 0 256 150" preserveAspectRatio="none">
    ${getImage(0, 0, 256, 150, getImageFromV3('Component', 'mania-note1.png'), 1, 'none')}
  </symbol>
  <symbol id="note2" viewBox="0 0 256 150" preserveAspectRatio="none">
    ${getImage(0, 0, 256, 150, getImageFromV3('Component', 'mania-note2.png'), 1, 'none')}
  </symbol>
  <symbol id="notes" viewBox="0 0 256 150" preserveAspectRatio="none">
    ${getImage(0, 0, 256, 150, getImageFromV3('Component', 'mania-noteS.png'), 1, 'none')}
  </symbol>
  <symbol id="ln1" viewBox="0 0 256 64" preserveAspectRatio="none">
    ${getImage(0, 0, 256, 64, getImageFromV3('Component', 'mania-note1L.png'), 1, 'none')}
  </symbol>
  <symbol id="ln2" viewBox="0 0 256 64" preserveAspectRatio="none">
    ${getImage(0, 0, 256, 64, getImageFromV3('Component', 'mania-note2L.png'), 1, 'none')}
  </symbol>
  <symbol id="lns" viewBox="0 0 256 64" preserveAspectRatio="none">
    ${getImage(0, 0, 256, 64, getImageFromV3('Component', 'mania-noteSL.png'), 1, 'none')}
  </symbol>
  <clipPath id="banner">
    ${PanelDraw.Rect(0, 0, 1920, 290, 40, 'none')}
</clipPath>
</defs>
<g>
    ${PanelDraw.Rect(0, 0, 1920, total_height, 40, '#2A2226')}
    ${PanelDraw.Rect(0, 290, 1920, total_height - 290, 40, '#382E32')}
    
    <g clip-path="url(#banner)">
        ${getImage(0, 0, 1920, 320, await getMapBackground(data.beatmap, 'cover'), 0.7)}
    </g>
    
    ${PanelDraw.Rect(510, 40, 195, 60, 15, '#382E32')}
    
    ${getSvgBody(40, 40, card_A2(await PanelGenerate.beatmap2CardA2(data?.beatmap)))}
    ${getPanelNameSVG('Beatmap View (!ymv)', 'V')}
    ${torusBold.getTextPath(
        'page: ' + Math.max(1, Math.min(data.page || 1, total_pages)) + ' of ' + (total_pages), 1920 / 2, total_height - 15, 20, 'center baseline', '#fff', 0.6
    )}
</g>

`;

    const render_chunks_count = actual_rows * bucket;

    for (let i = 0; i < render_chunks_count; i++) {
        const component = component_V(chunks[i], key, row_height, beats_per_bucket, general.special_style);

        const r = Math.floor(i / bucket); // 属于第几行
        const c = i % bucket;             // 属于第几列

        const x = c * chunk_width + chunk_x;
        const y = 290 + 40 + r * (row_height + row_gap); // 按行数往下推

        svg += getSvgBody(x, y, component);
    }

    svg += `</svg>`;

    return svg;
}