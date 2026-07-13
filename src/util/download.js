import {getAvatar, getBanner, getMapBackground} from "./util.js";

/**
 *
 * @param type {string}
 * @param id {number}
 * @param fn {() => Promise}
 * @return {{type: string, id: number, fn: () => Promise}}
 */
export const toTask = (type, id, fn) => {
    return {
        type: type,
        id: id,
        fn: fn,
    }
}

/**
 * Yumubot 0.8 测试：所有图片使用一个 settled
 * 优先保留前面出现过的 id，复用任务
 *
 * images.forEach((v, k) => console.log(`${k}: ${v}`));
 * @param tasks {[{type: string, id: number, fn: () => Promise}]}
 * @return Promise<Map>
 */
export const imageDownloader = async (tasks = []) => {
    const image = new Map();
    const seenKeys = new Set();
    const uniqueTasks = [];

    tasks.forEach(task => {
        if (!task?.id || !task?.type) return;

        const uniqueKey = `${task.type}_${task.id}`;

        if (!seenKeys.has(uniqueKey)) {
            seenKeys.add(uniqueKey);
            uniqueTasks.push(task);
        }
    });

    const promises = uniqueTasks.map(task => typeof task.fn === 'function' ? task.fn() : task.promise);

    await Promise.allSettled(promises).then(results => {
        results.forEach((result, index) => {
            const currentTask = uniqueTasks[index];
            const uniqueKey = `${currentTask.type}_${currentTask.id}`;

            if (result.status === 'fulfilled') {
                image.set(uniqueKey, result.value)
            }
        });
    });

    return image;
};

/**
 * @param {[]} users
 * @param idFn {Function}
 * @return {{type: string, id: number, fn: (function(): Promise)}[]}
 */
export const avatars2Task = (users = [], idFn = (user) => user.user_id ?? user.id) => {
    return (users ?? []).map(user => toTask('avatar', idFn(user), () => getAvatar(user)))
}

/**
 * @param {[]} users
 * @return {{type: string, id: number, fn: (function(): Promise)}[]}
 */
export const users2Task = (users = []) => {
    return (users ?? []).flatMap(user => user2Task(user))
}

/**
 * @param user
 * @return {[{type: string, id: number, fn: (function(): Promise)}, {type: string, id: number, fn: (function(): Promise)}]}
 */
export const user2Task = (user = {}) => {
    const task1 = toTask('avatar', user.user_id ?? user.id, () => getAvatar(user))
    const task2 = toTask('banner', user.user_id ?? user.id, () => getBanner(user))
    return [task1, task2]
}

export const beatmapset2Task = (
    beatmapset = {},
    id,
    targetSet,
    type = 'list@2x',
) => {
    const finalID = id ?? (beatmapset.beatmapset_id ?? beatmapset?.beatmapset?.id ?? beatmapset?.id);
    const finalSet = targetSet ?? beatmapset;

    return toTask(type, finalID, () => {
        return getMapBackground(finalSet, type);
    });
};

/**
 * 批量处理：支持传入映射闭包
 * @param beatmapsets
 * @param idFn {Function}
 * @param setFn {Function}
 * @param type {string}
 * @return {{type: string, id: number, fn: (function(): Promise)}[]}
 */
export const beatmapsets2Task = (
    beatmapsets = [],
    idFn = (set) => set.beatmapset_id ?? set?.beatmapset?.id ?? set?.id,
    setFn = (set) => set?.beatmapset ?? set,
    type = 'list@2x',
) => {
    return (beatmapsets ?? []).map(set =>
        beatmapset2Task(set, idFn(set), setFn(set), type)
    );
};

export const scores2Task = (scores = [], cover_type = 'list@2x') => {
    return scores.map(
        (score) => toTask(cover_type, score.beatmapset_id ?? score?.beatmapset?.id,
            () => getMapBackground(score, cover_type)
        )
    )
}