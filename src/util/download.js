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
 * @param taskList {[{type: string, id: number, fn: () => Promise}]}
 * @return Promise<Map>
 */
export const imageDownloader = async (taskList = []) => {
    const image = new Map();
    const seenKeys = new Set();
    const uniqueTasks = [];

    taskList.forEach(task => {
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