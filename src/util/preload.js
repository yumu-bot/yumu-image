import {IMG_BUFFER_PATH, isPictureIntacted, thenPush} from "./util.js";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";

// 主程序的运算速度足够快，将预加载放在绘图模块中来
// 几把 js 的 fs 怎么这么慢
export class Preloader {
    /**
     *
     * @param urls
     * @return {Promise<*[]>}
     */
    async preload(urls = []) {
        /**
         * @type {[data: any, status: number, path: string]}
         */
        const results = [];

        await Promise.allSettled(
            urls.map(url => this.download(url))
        ).then(r => thenPush(r, results))

        results.filter(r => r.status !== 200 && r.status !== 201)
            .forEach(r => console.log(`预加载失败：${r.path}`));

        results
            .filter(r => r.status === 200)
            .map(r => this.save(r))
            .filter(s => s.status !== 200)
            .forEach(s => console.log(`预保存失败：${s.status} ${s.path}`))
    }

    /**
     *
     * @param response {{data: *, status: number, path: string}}
     * @return {{status: number, success: boolean, path: string}}
     */
    save(response) {
        let boolean
        if (response.status === 200) {
            fs.writeFileSync(response.path, response.data, 'binary');
            boolean = true
        } else {
            boolean = false
        }

        return {
            status: response.status,
            path: response.path,
            success: boolean
        }
    }

    /**
     * util 的 下载方法
     * @param path
     * @return {Promise<{data: any, status: number, path: string}>}
     */
    async download(path) {
        const MD5 = crypto.createHash("md5");
        const bufferName = MD5.copy().update(path).digest('hex');
        const bufferPath = `${IMG_BUFFER_PATH}/${bufferName}`;

        let size

        try {
            fs.accessSync(bufferPath, fs.constants.F_OK);
            size = fs.statSync(bufferPath).size;
        } catch (e) {
            size = -1
        }

        // 有缓存
        if ((size > 4 * 1024) && isPictureIntacted(bufferPath)) {
            return {
                data: null,
                status: 201,
                path: bufferPath,
            };
        }

        let req;

        try {
            req = await axios.get(path, {responseType: 'arraybuffer'});
            return {
                data: req.data,
                status: req.status,
                path: bufferPath,
            }
        } catch (e) {
            console.error("download error", e);
            return {
                data: null,
                status: 400,
                path: bufferPath,
            }
        }
    }
}

export const PreloadConverter = {

    /**
     * 预加载玩家头像
     * @param users {[*]}
     * @return []
     * @constructor
     */
    Avatar: (users) => {
        return users
            .map(user => user.avatar_url)
            .filter(url => url != null)
    },


    /**
     * 预加载玩家头像
     * @param scores {[*]}
     * @return [string]
     * @constructor
     */
    ScoreAvatar: (scores) => {
        return scores
            .map(score => score.user)
            .map(user => user.avatar_url)
            .filter(url => url != null)
    },


    /**
     * 预加载玩家封面
     * @param users {[*]}
     * @return [string]
     * @constructor
     */
    Cover: (users) => {
        return users
            .map(user => user.cover?.url)
            .filter(url => url != null)
    },

    /**
     * 预加载玩家封面
     * @param scores {[*]}
     * @return [string]
     * @constructor
     */
    ScoreCover: (scores) => {
        return scores
            .map(score => score.user)
            .map(user => user.cover?.url)
            .filter(url => url != null)
    },
}