import {
    exportJPEG,
    getImage,
    getImageFromV3, getMapBackground, getPanelNameSVG,
    getSvgBody,
    OSU_BUFFER_PATH,
} from "../util/util.js";
import fs from "fs";
import readline from "readline";
import axios from "axios";
import {component_V} from "../component/component_V.js";
import {PanelDraw} from "../util/panelDraw.js";
import {PanelGenerate} from "../util/panelGenerate.js";
import {card_A2} from "../card/card_A2.js";
import {torusBold} from "../util/font.js";
import path from "path";

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
    const bar_per_bucket = 4;
    const beats_per_bucket = bar_per_bucket * 4;

    const chunk_x = (1920 - (bucket * chunk_width - chunk_gap)) / 2


    // 1. 计算最后一个音符所在的绝对拍数位置
    const total_beats = (last_time - first_time) / beat_length;

    // 2. 计算一页总共能显示多少拍
    const beats_per_page = bucket * beats_per_bucket;

    // 如果 total_beats 是 100，每页能放 32 拍，则需要 ceil(3.125) = 4 页
    const total_pages = Math.max(1, Math.ceil(total_beats / beats_per_page));

    // 1. 计算当前页的小节范围
    const page = (data.page || 1);
    const start_bar = (Math.min(Math.max(page, 1), total_pages) - 1) * bucket * bar_per_bucket;

    // 2. 初始化 x 个切片桶
    const chunks = Array.from({ length: bucket }, (_, i) => ({
        index: i,
        start_bar: start_bar + (i * bar_per_bucket), // 当前切片起始小节
        notes: [],
        timings: []
    }));

    const pageStartBeat = start_bar * 4;
    const totalBeatsPerPage = bucket * beats_per_bucket;
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
            end_chunk = Math.min(bucket - 1, Math.floor((end_beat - pageStartBeat - epsilon) / beats_per_bucket));
        }

        // 兜底：确保 end 不小于 start
        end_chunk = Math.max(start_chunk, end_chunk);

        // 3. 遍历并裁剪
        for (let c = start_chunk; c <= end_chunk; c++) {
            const chunkStartBeat = pageStartBeat + (c * beats_per_bucket);
            const chunkEndBeat = chunkStartBeat + beats_per_bucket;

            chunks[c].notes.push({
                ...note,
                beat: beat,
                end_beat: end_beat,
                render_start: Math.max(beat, chunkStartBeat),
                render_end: Math.min(end_beat, chunkEndBeat)
            });
        }
    }

    const full_line = []

    for (let i = 0; i < only_red.length; i++) {
        const current = only_red[i];
        const nextTime = (i < only_red.length - 1) ? only_red[i + 1].time : last_time;

        // 每一拍的长度
        const beatDuration = current.beat_length;

        // 从当前红点开始，以“拍”为单位步进
        for (let time = current.time; time < nextTime; time += beatDuration) {

            // 跳过红线重合点
            if (Math.abs(time - current.time) < 1) {
                continue;
            }

            // 计算当前拍是在这个红线段落里的第几拍
            const beatIndexInSegment = Math.round((time - current.time) / beatDuration);

            // 如果能被 meter 整除，说明是小节线（Bar Line），否则是拍子线（Beat Line）
            const isBarLine = (beatIndexInSegment % current.meter) === 0;

            const t = Math.round(time);
            const logicalBeat = (t - first_time) / beat_length;

            full_line.push({
                time: t,
                beat_length: current.beat_length,
                beat: logicalBeat,
                sv: -1,
                measure_index: isBarLine ? (beatIndexInSegment / current.meter) + 1 : null,
                meter: current.meter,
                sample: current.sample,
                sample_group: current.sample_group,
                volume: current.volume,
                type: isBarLine ? 'bar' : 'beat',
                effect: current.effect,
                bpm: current.bpm,
            })
        }
    }

    timings.forEach(v => full_line.push({
        ...v,
        beat: (v.time - first_time) / beat_length
    }))

    if (general.preview > 0) {
        full_line.push({
            time: general.preview,
            type: 'preview',
            beat: (general.preview - first_time) / beat_length,
        })
    }

    full_line.sort((a, b) => a.time - b.time).forEach(v =>
        v.render_beat = (v.time - first_time) / beat_length
    );

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

    // 4. 组装 SVG

    let svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="1920" height="1080" viewBox="0 0 1920 1080">
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
    ${PanelDraw.Rect(0, 0, 1920, 1080, 40, '#2A2226')}
    ${PanelDraw.Rect(0, 290, 1920, 790, 40, '#382E32')}
    
    <g clip-path="url(#banner)">
        ${getImage(0, 0, 1920, 320, await getMapBackground(data.beatmap, 'cover'), 0.7)}
    </g>
    
    ${PanelDraw.Rect(510, 40, 195, 60, 15, '#382E32')}
    
    ${getSvgBody(40, 40, card_A2(await PanelGenerate.beatmap2CardA2(data?.beatmap)))}
    ${getPanelNameSVG('Beatmap View (!ymv)', 'V')}
    ${torusBold.getTextPath(
        'page: ' + Math.max(1, Math.min(data.page || 1, total_pages)) + ' of ' + (total_pages), 1920 / 2, 1080 - 15, 20, 'center baseline', '#fff', 0.6
    )}
</g>

`;

    for (let i = 0; i < bucket; i++) {
        const component = component_V(chunks[i], key, 710, beats_per_bucket, general.special_style);

        svg += getSvgBody(i * chunk_width + chunk_x, 290 + 40, component)
    }

    svg += `</svg>`;

    return svg;
}

async function getBeatmapFilePath(beatmap_id) {

    const filePath = path.join(OSU_BUFFER_PATH, `${beatmap_id}.osu`);

    if (fs.existsSync(filePath)) {
        return filePath
    }

    const req =
        await axios.get(`https://osu.ppy.sh/osu/${beatmap_id}`, {responseType: 'arraybuffer', timeout: 10000});

    const file = req.data;

    fs.writeFileSync(filePath, file)

    return filePath
}

async function parseBeatmapFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const lines = readline.createInterface({ input: fileStream });

    let timings = [];
    let notes = [];

    let isTiming = false;
    let isNote = false;
    let isDifficulty = false;
    let isGeneral = false;

    let difficulty = {
        hp: 0,
        cs: 0,
        od: 0,
        ar: 0
    };

    let general = {
        mode: 0,
        preview: 0,
        stack_leniency: 0,
        sample: 'default',
        special_style: false,
    }

    for await (const line of lines) {
        const trimmed = String(line).trim();

        if (trimmed === '[General]') {
            isGeneral = true;
            continue;
        }

        if (trimmed === '[TimingPoints]') {
            isTiming = true;
            continue;
        }

        if (trimmed === '[HitObjects]') {
            isNote = true;
            continue;
        }

        if (trimmed === '[Difficulty]') {
            isDifficulty = true;
            continue;
        }

        if ((trimmed.startsWith('[') || trimmed === '')) {
            if (isGeneral) {
                isGeneral = false
            }

            if (isTiming) {
                isTiming = false;
            }

            if (isNote) {
                isNote = false
            }

            if (isDifficulty) {
                isDifficulty = false
            }
        }


        if (isTiming && trimmed.length > 0) {
            const parts = trimmed.split(',');

            const red = parseInt(parts[6]) === 1

            const length = red ? parseFloat(parts[1]) : null
            const sv = red ? null : 100 / (0 - parseFloat(parts[1]))
            const bpm = getBPM(length)

            const sample = getSample(parseInt(parts[3]))

            const effectMask = parseInt(parts[7])

            const effect = {
                kiai: (effectMask & 1) !== 0,
                ignore: (effectMask & 8) !== 0,
            };

            timings.push({
                time: parseInt(parts[0]),
                beat_length: length,
                sv: sv,
                meter: parseInt(parts[2]),
                sample: sample,
                sample_group: parseInt(parts[4]),
                volume: parseInt(parts[5]),
                type: red ? 'red' : 'green',
                effect: effect,
                bpm: bpm,
            });
        }

        if (isNote && trimmed.length > 0) {
            const parts = trimmed.split(',');

            const start_time = parseFloat(parts[2])

            const typeMask = parseInt(parts[3])

            let type

            if ((typeMask & (1 << 0)) !== 0) {
                type = 'circle'
            } else if ((typeMask & (1 << 1)) !== 0) {
                type = 'slider'
            } else if ((typeMask & (1 << 3)) !== 0) {
                type = 'spinner'
            } else if ((typeMask & (1 << 7)) !== 0) {
                type = 'ln'
            }

            const color_skip = (typeMask >> 4) & 0x07

            const new_combo = (typeMask & (1 << 2)) !== 0

            const hit_sound_mask = parseInt(parts[4])

            const hit_sound = {
                normal:  (hit_sound_mask & (1 << 0)) !== 0,
                whistle: (hit_sound_mask & (1 << 1)) !== 0,
                finish:  (hit_sound_mask & (1 << 2)) !== 0,
                clap:    (hit_sound_mask & (1 << 3)) !== 0
            };

            let sample_set

            switch (type) {
                case 'slider': sample_set = parts[10]; break;
                default: {
                    sample_set = parts[5];
                } break;
            }

            const sample_parts = sample_set.split(':')

            // mania
            let end_time

            if (type === 'ln') {
                end_time = parseInt(sample_parts.shift())
            } else {
                end_time = null
            }

            const sample = {
                normal: getSample(parseInt(sample_parts[0])),
                additional: getSample(parseInt(sample_parts[1])),
                sample_group: parseInt(sample_parts[2]),
                volume: parseInt(sample_parts[3]),
                file: sample_parts[4] ?? null
            }

            notes.push({
                x: parseInt(parts[0]),
                y: parseInt(parts[1]),
                time: start_time,
                type: type,
                color_skip: color_skip,
                new_combo: new_combo,
                hit_sound: hit_sound,
                end_time: end_time,
                sample: sample,
            });
        }

        if (isDifficulty && trimmed.length > 0 && trimmed.includes(':')) {
            const [key, value] = trimmed.split(':').map(s => s.trim());

            switch(key) {
                case 'HPDrainRate': difficulty.hp = parseFloat(value); break;
                case 'CircleSize':  difficulty.cs = parseFloat(value); break;
                case 'OverallDifficulty': difficulty.od = parseFloat(value); break;
                case 'ApproachRate': difficulty.ar = parseFloat(value); break;
            }
        }

        if (isGeneral && trimmed.length > 0 && trimmed.includes(':')) {
            const [key, value] = trimmed.split(':').map(s => s.trim());

            switch(key) {
                case 'Mode': general.mode = parseInt(value); break;
                case 'PreviewTime':  general.preview = parseInt(value); break;
                case 'StackLeniency': general.stack_leniency = parseFloat(value); break;
                case 'SampleSet': general.sample = value; break;
                case 'SpecialStyle': general.special_style = parseInt(value) === 1; break;
            }
        }
    }

    return {
        timings: timings,
        notes: notes,
        difficulty: difficulty,
        general: general,
    }
}

/**
 * @param int
 * @return {string}
 */
function getSample(int = 0) {
    let sample

    switch (int) {
        case 0: sample = 'default'; break;
        case 1: sample = 'normal'; break;
        case 2: sample = 'soft'; break;
        case 3: sample = 'drum'; break;
    }

    return sample;
}

function getBPM(length = 0) {
    if (length == null) return null

    return Math.round(60000 * 1000 / length) / 1000
}

function getLongestBPM(only_red = [], last_time = 0) {
    const bpmMap = new Map();

    for (let i = 0; i < only_red.length; i++) {
        const current = only_red[i];

        // 确定该区间的结束时间
        // 如果是最后一个点，使用传入的 last_time，否则使用下一个点的时间
        const nextTime = (i < only_red.length - 1) ? only_red[i + 1].time : last_time;
        const duration = nextTime - current.time;

        // 排除无效区间
        if (duration <= 0) continue;

        // 累加到 Map
        const bpm = current.bpm;

        const currentDuration = bpmMap.get(bpm) || 0;

        bpmMap.set(Math.round(bpm), currentDuration + duration);
    }

    // 遍历 Map 找出最长的一个
    let longestBpm = 120;
    let maxDuration = 0;

    for (const [bpm, duration] of bpmMap.entries()) {
        if (duration > maxDuration) {
            maxDuration = duration;
            longestBpm = bpm;
        }
    }

    return {
        bpm: longestBpm,
        duration: maxDuration
    };
}