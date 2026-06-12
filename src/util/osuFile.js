import path from "path";
import {accessAsync, OSU_BUFFER_PATH, PROXY_AGENT} from "./util.js";
import fs from "fs";
import axios from "axios";
import readline from "readline";
import {controlPointsToPath, parseControlPoints} from "./sliderPath.js";

export async function getBeatmapFilePath(beatmap_id) {

    const filePath = path.join(OSU_BUFFER_PATH, `${beatmap_id}.osu`);

    if (await accessAsync(filePath)) {
        return filePath
    }

    const req =
        await axios.get(`https://osu.ppy.sh/osu/${beatmap_id}`, {
            responseType: 'arraybuffer',
            timeout: 10000,

            // 暂时不用代理——太脏了
            proxy: false,
            httpsAgent: PROXY_AGENT,
            httpAgent: PROXY_AGENT
        });

    const file = req.data;

    fs.writeFileSync(filePath, file)

    return filePath
}

export async function parseBeatmapFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const lines = readline.createInterface({input: fileStream});

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

            // 有人在这里写 1E-30
            const length_raw = parseFloat(parts[1]);

            const length = red ? Math.max(length_raw, 1e-10) : null
            const sv = red ? null : 100 / (0 - parseFloat(parts[1]))
            const bpm = getBPM(length)

            const sample = getSample(parseInt(parts[3]))

            const effect_mask = parseInt(parts[7])

            const effect = {
                kiai: (effect_mask & 1) !== 0,
                ignore: (effect_mask & 8) !== 0,
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

            const x = parseInt(parts[0])

            const y = parseInt(parts[1])

            const start_time = parseFloat(parts[2])

            const type_mask = parseInt(parts[3])

            let type

            if ((type_mask & (1 << 0)) !== 0) {
                type = 'circle'
            } else if ((type_mask & (1 << 1)) !== 0) {
                type = 'slider'
            } else if ((type_mask & (1 << 3)) !== 0) {
                type = 'spinner'
            } else if ((type_mask & (1 << 7)) !== 0) {
                type = 'ln'
            }

            const color_skip = (type_mask >> 4) & 0x07

            const new_combo = (type_mask & (1 << 2)) !== 0

            const hit_sound_mask = parseInt(parts[4])

            const hit_sound = {
                normal: (hit_sound_mask & (1 << 0)) !== 0,
                whistle: (hit_sound_mask & (1 << 1)) !== 0,
                finish: (hit_sound_mask & (1 << 2)) !== 0,
                clap: (hit_sound_mask & (1 << 3)) !== 0
            };

            let slider_points
            let slide_count
            let visual_length

            if (type === 'slider') {
                // 其他模式的控制点不重要
                if (general.mode === 0 || general.mode === 2) {
                    const control_points = parseControlPoints(parts[5], x, y)

                    slider_points = controlPointsToPath(control_points, 0.5)
                } else {
                    slider_points = null
                }
                slide_count = parseInt(parts[6])
                visual_length = parseInt(parts[7])
            } else {
                slider_points = null
                slide_count = null
                visual_length = null
            }

            let sample_set

            switch (type) {
                case 'slider':
                    sample_set = parts[9];
                    break;
                default: {
                    sample_set = parts[5];
                }
                break;
            }

            const sample_parts = (sample_set ?? "0:0:0:0:").split(':')

            let end_time

            // mania
            if (type === 'ln') {
                end_time = parseInt(sample_parts.shift())
            } else if (type === 'spinner') {
                end_time = parseInt(parts[5])
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
                x: x,
                y: y,
                time: start_time,
                type: type,
                color_skip: color_skip,
                new_combo: new_combo,
                hit_sound: hit_sound,
                end_time: end_time,
                sample: sample,
                visual_length: visual_length,
                slide_count: slide_count,
                slider_points: slider_points,
            });
        }

        if (isDifficulty && trimmed.length > 0 && trimmed.includes(':')) {
            const [key, value] = trimmed.split(':').map(s => s.trim());

            switch (key) {
                case 'HPDrainRate':
                    difficulty.hp = parseFloat(value);
                    break;
                case 'CircleSize':
                    difficulty.cs = parseFloat(value);
                    break;
                case 'OverallDifficulty':
                    difficulty.od = parseFloat(value);
                    break;
                case 'ApproachRate':
                    difficulty.ar = parseFloat(value);
                    break;
                case 'SliderMultiplier':
                    difficulty.slider_multiplier = parseFloat(value);
                    break;
                case 'SliderTickRate':
                    difficulty.slider_tick_rate = parseFloat(value);
                    break;
            }
        }

        if (isGeneral && trimmed.length > 0 && trimmed.includes(':')) {
            const [key, value] = trimmed.split(':').map(s => s.trim());

            switch (key) {
                case 'Mode':
                    general.mode = parseInt(value);
                    break;
                case 'PreviewTime':
                    general.preview = parseInt(value);
                    break;
                case 'StackLeniency':
                    general.stack_leniency = parseFloat(value);
                    break;
                case 'SampleSet':
                    general.sample = value;
                    break;
                case 'SpecialStyle':
                    general.special_style = parseInt(value) === 1;
                    break;
            }
        }
    }


    // 绿线修正：通过记录红线来赋予绿线 beat_length
    let current_beat_length = 60000 / 120;

    // 如果 timings 数组可能乱序，建议先进行排序
    timings.sort((a, b) => {
        if (a.time !== b.time) {
            return a.time - b.time;
        }
        if (a.beat_length != null && b.beat_length == null) return -1;
        if (a.beat_length == null && b.beat_length != null) return 1;
        return 0;
    });

    timings.forEach(line => {
        if (line.type === 'red') {
            // 如果是红线，更新当前的基准 beat_length
            current_beat_length = line.beat_length;
        } else {
            // 如果是绿线，将其 beat_length 设定为当前红线的值
            line.beat_length = current_beat_length;
        }
    });

    // 滑条修正：计算添加 end_time
    notes.forEach(note => {
        if (note.type === 'slider') {
            let timing = timings[0];
            for (let i = 0; i < timings.length; i++) {
                if (timings[i].time <= note.time) {
                    timing = timings[i];
                } else {
                    break;
                }
            }

            // 2. 获取 SV (Slider Velocity) 倍率
            // 如果是红线，SV 默认为 1.0
            const sv = timing.type === 'green' ? timing.sv : 1.0;

            // 3. 计算单次滑动时长 (毫秒)

            // 单次滑动的时长
            const slide_time =
                (note.visual_length * timing.beat_length) /
                ((difficulty.slider_multiplier ?? 0) * 100 * sv);

            // 4. 计算总时长并赋值 end_time
            // 总时长 = 单次时长 * 滑动次数 (slide_count)
            note.end_time = note.time + (slide_time * (note?.slide_count ?? 1));
        }
    });

    // 音符修正：对结束时间排序
    notes.sort((a, b) => {
        if (a.time !== b.time) {
            return a.time - b.time;
        }

        if (a.end_time === null && b.end_time !== null) return -1;
        if (a.end_time !== null && b.end_time === null) return 1;

        if (a.end_time !== null && b.end_time !== null) {
            if (a.end_time !== b.end_time) {
                return a.end_time - b.end_time;
            }
        }

        return a.x - b.x;
    });

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

export function getLongestBPM(only_red = [], last_time = 0) {
    const bpm_map = new Map();

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

        if (!bpm || bpm < 0.1 || bpm > 10000) {
            continue;
        }

        const currentDuration = bpm_map.get(bpm) || 0;

        bpm_map.set(Math.round(bpm * 100) / 100, currentDuration + duration);
    }

    // 遍历 Map 找出最长的一个
    let longestBpm = 120;
    let maxDuration = 0;

    for (const [bpm, duration] of bpm_map.entries()) {
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

/**
 * 将 bpm 限制在 120 - 300 的范围内
 * @param raw_bpm
 * @param min 120
 * @param max 300
 * @return {number}
 */
export function normalizeBpm(raw_bpm, min = 120, max = 300) {
    if (!Number.isFinite(raw_bpm)) {
        return max;
    } else if (raw_bpm <= 0) {
        return min;
    }

    let result = raw_bpm;

    if (result > max) {
        const folds = Math.ceil(Math.log2(result / max));
        result = result / Math.pow(2, folds);
    }

    else if (result < min) {
        const folds = Math.ceil(Math.log2(min / result));
        result = result * Math.pow(2, folds);
    }

    return Math.min(Math.max(result, min), max);
}

/**
 *
 * @param full_line
 * @return {boolean}
 */
export function isSVMode(full_line) {
    // 在赋予标准 SV 后计算
    const sv_values = full_line
        .filter(l => l.standard_sv != null)
        .map(l => l.standard_sv);

    if (sv_values.length > 0) {
        const mean = Math.max(sv_values.reduce((a, b) => a + b, 0) / sv_values.length, 1e-4);
        const variance = sv_values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sv_values.length;
        const std_dev = Math.sqrt(variance);
        const cv = std_dev / mean; // 变异系数

        return cv > 0.25;
    }

    return false
}