import {
    exportJPEG, getImage,
    getImageFromV3,
    getImageOrElse,
    getMapBackground,
    getNowTimeStamp,
    getOrNull, getPanelNameSVG, getSvgBody,
    round
} from "../util/util.js";
import {getBeatmapFilePath, getLongestBPM, isSVMode, normalizeBpm, parseBeatmapFile} from "../util/file.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {torusBold} from "../util/font.js";
import {card_A2} from "../card/card_A2.js";
import {PanelDraw} from "../util/panelDraw.js";
import {component_V2} from "../component/component_V2.js";

export async function router(req, res) {
    try {
        const data = req.fields || {};
        const svg = await panel_V2(data);
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
        const svg = await panel_V2(data);
        res.set('Content-Type', 'image/svg+xml'); //svg+xml
        res.send(svg);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.stack);
    }
    res.end();
}

/**
 * 下落式谱面预览面板
 * !v:3
 * @param data
 * @return {Promise<string>}
 */
export async function panel_V2(
    data = {
        beatmap: {},
        page: 1,
        mode: 'taiko',
        rows: 5,
    })
{

    const lane_height = 35
    const lane_gap = 30
    const lane_per_page = 50
    const bar_per_lane = 4
    const beats_per_lane = bar_per_lane * 4;
    const minute_interval = 60000;

    const max_width = 1920 - 40
    const background_bleed = 0

    const path = await getBeatmapFilePath(data.beatmap.id)
    const {timings, notes, general} = await parseBeatmapFile(path)
    const first_note_time = notes?.[0]?.time ?? 0

    const only_red = timings.filter(t => t.type === 'red');

    /** @type {number} */
    const first_time = notes[0]?.time ?? 0

    /** @type {number} */
    const last_time = notes[notes.length - 1]?.end_time ?? notes[notes.length - 1]?.time ?? 0
    /** @type {number} */
    const last_timeline_time = timings[timings.length - 1]?.time ?? 0

    // 算标准bpm
    const {bpm} = getLongestBPM(only_red, last_time)
    const normalized_bpm = normalizeBpm(bpm)
    const beat_length = minute_interval / normalized_bpm

    // 1. 计算最后一个音符所在的绝对拍数位置
    const total_beats = (last_time - first_time) / beat_length;

    // 2. 计算一页总共能显示多少拍
    const beats_per_page = beats_per_lane * lane_per_page;


    // 如果 total_beats 是 100，每页能放 32 拍，则需要 ceil(3.125) = 4 页
    const total_pages = Math.max(1, Math.ceil(total_beats / beats_per_page));


    // 1. 计算当前页的小节范围
    const page = (data.page || 1);
    const start_bar = (Math.min(Math.max(page, 1), total_pages) - 1) * lane_per_page * bar_per_lane;
    const page_start_beat = start_bar * 4;

    // 2. 初始化 x 个切片桶
    const chunks = Array.from({ length: lane_per_page }, (_, i) => ({
        index: i,
        start_bar: start_bar + (i * bar_per_lane), // 当前切片起始小节
        notes: [],
        timings: []
    }));

    // 使用一个很小的 epsilon (1ms 级别对应的 beat 长度)
    const epsilon = 0.005;

    for (const note of notes) {
        const beat = (note.time - first_time) / beat_length;
        const end_beat = (note.type === 'circle') ? beat : ((note.end_time - first_time) / beat_length);

        // 1. 过滤：如果整个音符都在当前页之前或之后，直接跳过
        if (end_beat < page_start_beat || beat >= page_start_beat + beats_per_page) {
            continue;
        }

        // start_lane 计算时增加 epsilon
        const start_lane = Math.max(0, Math.floor((beat - page_start_beat + epsilon) / beats_per_lane));

        let end_lane;
        if (note.type === 'circle') {
            end_lane = start_lane;
        } else {
            end_lane = Math.min(lane_per_page - 1, Math.floor((end_beat - page_start_beat - epsilon) / beats_per_lane));
        }

        end_lane = Math.max(start_lane, end_lane);

        // 3. 遍历并裁剪
        for (let c = start_lane; c <= end_lane; c++) {
            const lane_start_beat = page_start_beat + (c * beats_per_lane);
            const lane_end_beat = lane_start_beat + beats_per_lane;

            chunks[c]?.notes?.push({
                ...note,
                beat: beat,
                end_beat: end_beat,
                render_start: Math.max(beat, lane_start_beat),
                render_end: Math.min(end_beat, lane_end_beat)
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
        const timing_beat_length = current.beat_length;

        // 有人在乱搞
        if (!timing_beat_length || timing_beat_length < 2) {
            continue;
        }

        // 从当前红点开始，以“拍”为单位步进
        for (let time = current.time; time < next_time; time += timing_beat_length) {

            // 跳过红线重合点
            if (Math.abs(time - current.time) < 1) {
                continue;
            }

            if (Math.abs(time - first_note_time) <= 500) continue; // 跳过第一个物件（这里会有 bpm 指示线

            // 计算当前拍是在这个红线段落里的第几拍
            const beat_index = Math.round((time - current.time) / timing_beat_length);

            // 如果能被 meter 整除，说明是小节线（Bar Line），否则是拍子线（Beat Line）
            const is_bar = (beat_index % current.meter) === 0;

            const t = Math.round(time);
            // 这里要用全局的那个
            const beat = (t - first_time) / beat_length;

            const until_next = next_time - time;
            const is_near_next = next && (until_next < timing_beat_length * 0.1);

            full_line.push({
                time: t,
                beat_length: current.beat_length,
                beat: beat,
                sv: current.sv,
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


    const latest = Math.max(last_timeline_time, last_time)

    // 插入分钟线
    for (let t = 0; t <= latest; t += minute_interval) {
        if (t === 0) continue; // 跳过 0ms

        const beat = (t - first_time) / beat_length

        full_line.push({
            time: t,
            type: 'minute',
            beat: beat,
        });
    }

    // 添加最后的时间点
    const offset = latest % minute_interval;

    // 只有当偏移量足够大（>= 5秒）时，才添加最后一条线
    // 注意：如果 offset 很大，说明它离上一条线很远；如果 offset 很小，说明刚过分钟线不久
    if (offset >= 5000) {
        // 依然需要向下取秒
        const last_second = Math.floor(latest / 1000) * 1000;

        full_line.push({
            time: last_second,
            type: 'minute_latest',
            beat: (latest - first_time) / beat_length,
        });
    }

    // 添加预览点
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


    full_line.sort((a, b) => {
        if (a.time !== b.time) {
            return a.time - b.time;
        }
        if (a.beat_length != null && b.beat_length == null) return -1;
        if (a.beat_length == null && b.beat_length != null) return 1;
        return 0;
    });


    // 绿线基准速度机制
    const duration_map = new Map();

    for (let i = 0; i < full_line.length; i++) {
        const current = full_line[i];

        // 我们只关心绿线的速度表现
        if (current.beat_length != null && current.sv != null) {
            const next_time = (i < full_line.length - 1) ? full_line[i + 1].time : last_time;
            const duration = next_time - current.time;

            if (duration > 0) {
                // 同样需要四舍五入处理浮点精度，以便归类
                const speed_val = Math.round((current.beat_length * current.sv) / 10) * 10;

                if (speed_val >= 10) {
                    const current_total_duration = duration_map.get(speed_val) || 0;
                    duration_map.set(speed_val, current_total_duration + duration);
                }
            }
        }
    }

    let significant_speed = 1.0;
    let max_standard_duration = -1;

    for (const [speed, duration] of duration_map.entries()) {
        if (duration > max_standard_duration) {
            max_standard_duration = duration;
            significant_speed = speed;
        }
    }

    let max_sv = -Infinity;
    let min_sv = Infinity;

    // 赋予标准 SV 并记录极值
    full_line.forEach(current => {
        if (current.beat_length != null && current.sv != null) {
            const current_speed = current.beat_length * current.sv;
            // 计算标准 SV
            const standard = current_speed / significant_speed;
            current.standard_sv = standard;

            // 记录最大值和最小值
            if (standard > max_sv) max_sv = standard;
            if (standard < min_sv) min_sv = standard;
        }
    });


    for (const line of full_line) {
        // 1. 过滤：不在当前页范围内的直接跳过
        if (line.beat < page_start_beat || line.beat >= page_start_beat + beats_per_page) {
            continue;
        }

        // 2. 计算对应的 chunk 索引
        // 使用与 note 相同的索引计算逻辑
        const c = Math.floor((line.beat - page_start_beat + epsilon) / beats_per_lane);

        // 3. 压入对应 chunk 的 timings 数组
        if (chunks[c]) {
            chunks[c].timings.push(line);
        }
    }

    for (let i = full_line.length - 1; i >= 0; i--) {
        const current = full_line[i];

        const next_line = (i === full_line.length - 1) ? null : full_line[i + 1];

        if (current.type === 'green') {
            current.next_standard_sv = next_line ? next_line.standard_sv : last_time;
            current.next_beat = next_line ? next_line.beat : total_beats;
        }
    }

    // 切片逻辑
    let max_used_lane_index = -1;
    // 遍历当前页的所有切片，找出最后一个包含音符或时间线的切片索引
    for (let i = 0; i < lane_per_page; i++) {
        if (chunks[i].notes.length > 0 || chunks[i].timings.length > 0) {
            max_used_lane_index = i;
        }
    }

    // 添加虚拟红线
    const first_chunk = chunks[0];

    const first_red = only_red?.[0]
    const first_red_line_time = first_red?.time ?? 0

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

    const actual_lane_count = Math.max(1, max_used_lane_index + 1);

    const total_height = 290 + 40 + (actual_lane_count * lane_height) + ((actual_lane_count - 1) * lane_gap) + 40;

    const [card_a2_deferred, background_deferred] = await Promise.allSettled([
        PanelGenerate.beatmap2CardA2(data?.beatmap),
        getMapBackground(data.beatmap, 'cover')
    ]);

    const card_a2 = getOrNull(card_a2_deferred)
    const banner = getImageOrElse(background_deferred, getImageFromV3('card-default.png'))


    let sv_text = ''

    const sv_mode = isSVMode(full_line, max_sv, min_sv)

    if (sv_mode) {
        sv_text = `sv: min ${round(min_sv, 2)}x, max ${round(max_sv, 2)}x // `
    }

    const request_time = sv_text + 'request time: ' + getNowTimeStamp()

    let svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="1920" height="${total_height}" viewBox="0 0 1920 ${total_height}">
<defs>
    <filter id="don" x="0" y="0" width="100%" height="100%">
      <feFlood flood-color="#D32F2F" result="targetColor" />
      
      <feComposite in="SourceGraphic" in2="targetColor" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="multipliedBase" />
      
      <feImage href="${getImageFromV3('Component', 'taikohitcircleoverlay.png')}" result="overlayImage" 
               preserveAspectRatio="xMidYMid slice" />
               
      <feMerge>
        <feMergeNode in="multipliedBase" />
        <feMergeNode in="overlayImage" />
      </feMerge>
    </filter>
    
    <filter id="ka" x="0" y="0" width="100%" height="100%">
      <feFlood flood-color="#4FACFE" result="targetColor" />
      
      <feComposite in="SourceGraphic" in2="targetColor" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="multipliedBase" />
      
      <feImage href="${getImageFromV3('Component', 'taikohitcircleoverlay.png')}" result="overlayImage" 
               preserveAspectRatio="xMidYMid slice" />
               
      <feMerge>
        <feMergeNode in="multipliedBase" />
        <feMergeNode in="overlayImage" />
      </feMerge>
    </filter>
    
   
    <filter id="don2" x="0" y="0" width="100%" height="100%">
      <feFlood flood-color="#D32F2F" result="targetColor" />
      
      <feComposite in="SourceGraphic" in2="targetColor" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="multipliedBase" />
      
      <feImage href="${getImageFromV3('Component', 'taikobigcircleoverlay.png')}" result="overlayImage" 
               preserveAspectRatio="xMidYMid slice" />
               
      <feMerge>
        <feMergeNode in="multipliedBase" />
        <feMergeNode in="overlayImage" />
      </feMerge>
    </filter>
    
    <filter id="ka2" x="0" y="0" width="100%" height="100%">
      <feFlood flood-color="#4FACFE" result="targetColor" />
      
      <feComposite in="SourceGraphic" in2="targetColor" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="multipliedBase" />
      
      <feImage href="${getImageFromV3('Component', 'taikobigcircleoverlay.png')}" result="overlayImage" 
               preserveAspectRatio="xMidYMid slice" />
               
      <feMerge>
        <feMergeNode in="multipliedBase" />
        <feMergeNode in="overlayImage" />
      </feMerge>
    </filter>

  <symbol id="note" viewBox="0 0 128 128" preserveAspectRatio="none">
    ${getImage(0, 0, 128, 128, getImageFromV3('Component', 'taikohitcircle.png'), 1, 'none')}
  </symbol>
  <symbol id="big" viewBox="0 0 128 128" preserveAspectRatio="none">
    ${getImage(0, 0, 128, 128, getImageFromV3('Component', 'taikobigcircle.png'), 1, 'none')}
  </symbol>
  <symbol id="roll-end" viewBox="0 0 68 124" preserveAspectRatio="none">
    ${getImage(0, 0, 68, 124, getImageFromV3('Component', 'taiko-roll-end.png'), 1, 'none')}
  </symbol>
  <symbol id="roll-middle" viewBox="0 0 1 124" preserveAspectRatio="none">
    ${getImage(0, 0, 1, 124, getImageFromV3('Component', 'taiko-roll-middle.png'), 1, 'none')}
  </symbol>
  <symbol id="spinner-approach" viewBox="0 0 390 390" preserveAspectRatio="none">
    ${getImage(0, 0, 390, 390, getImageFromV3('Component', 'spinner-approachcircle.png'), 1, 'none')}
  </symbol>
  <symbol id="spinner-circle" viewBox="0 0 32 32" preserveAspectRatio="none">
    ${getImage(0, 0, 32, 32, getImageFromV3('Component', 'spinner-circle.png'), 1, 'none')}
  </symbol>
  <clipPath id="banner">
    ${PanelDraw.Rect(0, 0, 1920, 290, 40, 'none')}
</clipPath>
</defs>
<g>
    ${PanelDraw.Rect(0, 0, 1920, total_height, 40, '#2A2226')}
    ${PanelDraw.Rect(0, 290, 1920, total_height - 290, 40, '#382E32')}
    
    <g clip-path="url(#banner)">
        ${getImage(0, 0, 1920, 320, banner, 0.7)}
    </g>
    
    ${PanelDraw.Rect(510, 40, 195, 60, 15, '#382E32')}
    
    ${getSvgBody(40, 40, card_A2(card_a2))}
    ${getPanelNameSVG('Beatmap View (!ymv) ~ Not even close to donscore', 'V', request_time)}
    ${torusBold.getTextPath(
        'page: ' + Math.max(1, Math.min(data.page || 1, total_pages)) + ' of ' + (total_pages), 1920 / 2, total_height - 15, 20, 'center baseline', '#fff', 0.6
    )}
</g>
`;

    const components = []
    const backgrounds = []

    for (let i = 0; i < actual_lane_count; i++) {
        const component = component_V2(chunks[i], lane_height, max_width, beats_per_lane, max_sv, min_sv, sv_mode);

        const x = 20;
        // -10 是确保下面不会撞到 page 1 of 2 这样的标识
        const y = 290 + 40 + i * (lane_height + lane_gap) - 10

        if (i % 2 !== 0) {
            // 奇数行，但是从 0 开始
            backgrounds.push(PanelDraw.Rect(0, y - background_bleed, 1920, lane_height + background_bleed * 2, 0, '#46393F'))
        }

        components.push(getSvgBody(x, y, component))
    }

    svg += backgrounds.join('\n') + components.join('\n');

    svg += `</svg>`;

    return svg;
}