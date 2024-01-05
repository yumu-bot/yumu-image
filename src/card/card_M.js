import {
    getExportFileV3Path, getMapBG, implantImage, implantSvgBody, isReload, replaceText,
} from "../util/util.js";
import {torus} from "../util/font.js";
import {label_A1, label_A2, label_A3} from "../component/label.js";
import {PanelGenerate} from "../util/panelGenerate.js";

export async function card_M(s = {
    "artist": "HOYO-MiX",
    "artist_unicode": "HOYO-MiX",
    "covers": {
        "cover": "https://assets.ppy.sh/beatmaps/1884753/covers/cover.jpg?1689090283",
        "cover@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/cover@2x.jpg?1689090283",
        "card": "https://assets.ppy.sh/beatmaps/1884753/covers/card.jpg?1689090283",
        "card@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/card@2x.jpg?1689090283",
        "list": "https://assets.ppy.sh/beatmaps/1884753/covers/list.jpg?1689090283",
        "list@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/list@2x.jpg?1689090283",
        "slimcover": "https://assets.ppy.sh/beatmaps/1884753/covers/slimcover.jpg?1689090283",
        "slimcover@2x": "https://assets.ppy.sh/beatmaps/1884753/covers/slimcover@2x.jpg?1689090283"
    },
    "creator": "Muziyami",
    "favourite_count": 48,
    "hype": {
        "current": 26,
        "required": 5
    },
    "id": 1884753,
    "nsfw": false,
    "offset": 0,
    "play_count": 5465,
    "preview_url": "//b.ppy.sh/preview/1884753.mp3",
    "source": "原神",
    "spotlight": false,
    "status": "qualified",
    "title": "Surasthana Fantasia",
    "title_unicode": "净善的遐歌",
    "track_id": null,
    "user_id": 7003013,
    "video": true,
    "bpm": 168,
    "can_be_hyped": true,
    "deleted_at": null,
    "discussion_enabled": true,
    "discussion_locked": false,
    "is_scoreable": true,
    "last_updated": "2023-07-11T15:44:20Z",
    "legacy_thread_url": "https://osu.ppy.sh/community/forums/topics/1675223",
    "nominations_summary": {
        "current": 2,
        "required": 2
    },
    "ranked": 3,
    "ranked_date": "2023-07-11T18:17:58Z",
    "storyboard": false,
    "submitted_date": "2022-11-13T14:52:11Z",
    "tags": "genshin impact yuanshen jing shan de xia ge スラサタンナ幻想曲 boundless bliss nahida na xi da 纳西妲 ナヒーダ 小吉祥草王 クラクサナリデビ クサナリ lesser lord kusanali 布耶尔 buer 白草净华 physic of purity 无垠无忧 無垠無憂 mugen muyuu vgm trailer spoiler 所聞遍計 所闻遍计 한계도 걱정도 없이 나히다 hua ling 花玲 tamura yukari 田村ゆかり 须弥 sumeru スメール ost chinese original sound track soundtrack video game videogame instrumental electronic future bass theme @hoyo-mix 草神 dendro archon sfuture艺术团 sfutureart yu-peng chen 陈宇鹏 陈致逸 yijun jiang 姜以君 the stellar moments vol. 3 album 闪耀的群星3 輝く星々vol.3 volume three patchouli-r kobayakawa sae hngjss [charlie lam] skystar chorus character demo aranara 兰那罗 アランナラ 米哈游 mihoyo hoyoverse",
    "availability": {
        "download_disabled": false,
        "more_information": null
    },
    "beatmaps": [
        {
            "beatmapset_id": 1884753,
            "difficulty_rating": 5.25,
            "id": 3880594,
            "mode": "osu",
            "status": "qualified",
            "total_length": 135,
            "user_id": 7003013,
            "version": "Extra",
            "accuracy": 8.5,
            "ar": 9,
            "bpm": 168,
            "convert": false,
            "count_circles": 202,
            "count_sliders": 221,
            "count_spinners": 2,
            "cs": 4.2,
            "deleted_at": null,
            "drain": 5.5,
            "hit_length": 133,
            "is_scoreable": true,
            "last_updated": "2023-07-11T15:44:20Z",
            "mode_int": 0,
            "passcount": 32,
            "playcount": 129,
            "ranked": 3,
            "url": "https://osu.ppy.sh/beatmaps/3880594",
            "checksum": "5ab3f382dc7601eb3a3b0b34256c5f59",
            "max_combo": 744
        },
        {
            "beatmapset_id": 1884753,
            "difficulty_rating": 4.23,
            "id": 3880863,
            "mode": "osu",
            "status": "qualified",
            "total_length": 135,
            "user_id": 7003013,
            "version": "Insane",
            "accuracy": 7,
            "ar": 8.5,
            "bpm": 168,
            "convert": false,
            "count_circles": 139,
            "count_sliders": 193,
            "count_spinners": 4,
            "cs": 4,
            "deleted_at": null,
            "drain": 5,
            "hit_length": 129,
            "is_scoreable": true,
            "last_updated": "2023-07-11T15:44:21Z",
            "mode_int": 0,
            "passcount": 66,
            "playcount": 204,
            "ranked": 3,
            "url": "https://osu.ppy.sh/beatmaps/3880863",
            "checksum": "00583b3f9e3aa112de783fc304ac3b1f",
            "max_combo": 613
        },
        {
            "beatmapset_id": 1884753,
            "difficulty_rating": 3.32,
            "id": 3880864,
            "mode": "osu",
            "status": "qualified",
            "total_length": 135,
            "user_id": 3766224,
            "version": "Kobayakawa Sae's Hard",
            "accuracy": 6,
            "ar": 8,
            "bpm": 168,
            "convert": false,
            "count_circles": 93,
            "count_sliders": 122,
            "count_spinners": 6,
            "cs": 4,
            "deleted_at": null,
            "drain": 4,
            "hit_length": 133,
            "is_scoreable": true,
            "last_updated": "2023-07-11T15:44:22Z",
            "mode_int": 0,
            "passcount": 51,
            "playcount": 149,
            "ranked": 3,
            "url": "https://osu.ppy.sh/beatmaps/3880864",
            "checksum": "1ad7ffb20a515eb1c803ab8288431748",
            "max_combo": 412
        },
        {
            "beatmapset_id": 1884753,
            "difficulty_rating": 2.13,
            "id": 3880865,
            "mode": "osu",
            "status": "qualified",
            "total_length": 135,
            "user_id": 1061213,
            "version": "Patchouli-R's Normal",
            "accuracy": 4,
            "ar": 5,
            "bpm": 168,
            "convert": false,
            "count_circles": 69,
            "count_sliders": 90,
            "count_spinners": 6,
            "cs": 3,
            "deleted_at": null,
            "drain": 3,
            "hit_length": 114,
            "is_scoreable": true,
            "last_updated": "2023-07-11T15:44:22Z",
            "mode_int": 0,
            "passcount": 45,
            "playcount": 134,
            "ranked": 3,
            "url": "https://osu.ppy.sh/beatmaps/3880865",
            "checksum": "ada93214c2e5c6585bd7064e7b985560",
            "max_combo": 288
        },
        {
            "beatmapset_id": 1884753,
            "difficulty_rating": 1.69,
            "id": 3881560,
            "mode": "osu",
            "status": "qualified",
            "total_length": 135,
            "user_id": 7003013,
            "version": "Easy",
            "accuracy": 2,
            "ar": 3,
            "bpm": 168,
            "convert": false,
            "count_circles": 52,
            "count_sliders": 90,
            "count_spinners": 4,
            "cs": 2.2,
            "deleted_at": null,
            "drain": 2,
            "hit_length": 127,
            "is_scoreable": true,
            "last_updated": "2023-07-11T15:44:23Z",
            "mode_int": 0,
            "passcount": 49,
            "playcount": 135,
            "ranked": 3,
            "url": "https://osu.ppy.sh/beatmaps/3881560",
            "checksum": "244d46706e662aeb86c996176b03008c",
            "max_combo": 304
        },
        {
            "beatmapset_id": 1884753,
            "difficulty_rating": 5.95,
            "id": 3984789,
            "mode": "osu",
            "status": "qualified",
            "total_length": 135,
            "user_id": 873961,
            "version": "Skystar's Extra",
            "accuracy": 9,
            "ar": 9.2,
            "bpm": 168,
            "convert": false,
            "count_circles": 208,
            "count_sliders": 239,
            "count_spinners": 2,
            "cs": 4.5,
            "deleted_at": null,
            "drain": 6,
            "hit_length": 133,
            "is_scoreable": true,
            "last_updated": "2023-07-11T15:44:23Z",
            "mode_int": 0,
            "passcount": 55,
            "playcount": 257,
            "ranked": 3,
            "url": "https://osu.ppy.sh/beatmaps/3984789",
            "checksum": "574fd409c942675e61b80d0bd94c3601",
            "max_combo": 796
        }
    ],
    "pack_tags": []
}, reuse = false) {
    // 读取模板
    let svg =`   <defs>
            <clipPath id="clippath-CM-1">
              <rect width="1370" height="210" rx="20" ry="20" style="fill: none;"/>
            </clipPath>
            <filter id="blur-CM-1" height="110%" width="110%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="userSpaceOnUse" stdDeviation="5" result="blur"/>
            </filter>
          </defs>
          <g id="Background_CM">
            <rect width="1370" height="210" rx="20" ry="20" style="fill: #382E32;"/>
            <g style="clip-path: url(#clippath-CM-1);" filter="url(#blur-CM-1)">
            </g>
          </g>
          <g id="Label_CM">
          </g>
          <g id="Text_CM">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CM">)/;
    const reg_background = /(?<=<g style="clip-path: url\(#clippath-CM-1\);" filter="url\(#blur-CM-1\)">)/;
    const reg_label = /(?<=<g id="Label_CM">)/;

    // 导入M1标签
    let labelM1s = [];
    let labelM2s = [];
    let labelM3s = [];

    // 如果难度超过6个，则使用紧促型面板，并且不渲染标签M2，M3
    const label_count = s?.beatmaps?.length || 0;
    let label_width;

    // 构建M卡
    if (label_count <= 6) {
        //正常面板
        label_width = (1360 / label_count) - 10;

        for (const v of s.beatmaps) {
            const f1 = await label_A1({
                mode: v.mode,
                difficulty_name: v.version,
                star_rating: v.difficulty_rating,
                maxWidth: label_width,
                star: getExportFileV3Path('object-beatmap-star.png'),
                hasAvatar: false,
                uid: v.user_id,
            }, true);
            const f2 = await label_A2({
                host_uid: s.user_id,
                uid: v.user_id,
            }, true);
            const g3 = await PanelGenerate.searchDiff2LabelM3(v, label_width);
            const f3 = await label_A3(g3, true);

            labelM1s.push(f1);
            labelM2s.push(f2);
            labelM3s.push(f3);
        }

        //插入到svg中
        for (let i = 0; i < label_count; i++) {
            svg = implantSvgBody(svg, 10 + (label_width + 10) * i, 150, labelM1s[i], reg_label);
            svg = implantSvgBody(svg, 10 + (label_width + 10) * i + (label_width / 2) - 50, 10, labelM2s[i], reg_label);
            svg = implantSvgBody(svg, 10 + (label_width + 10) * i + (label_width / 2) + 5, 120, labelM3s[i], reg_label); //往右偏一点，好看，记得改相似的地方

        }
    } else if (label_count <= 18) {
        //紧促面板，最大不超18个，超了不管了 7 8 9 10 11 12

        const label_compact_slot_count = Math.floor((label_count - 7) / 2) + 1; //需要压缩的空位数量  1 1 2 2 3 3
        const label_normal_count = 6 - label_compact_slot_count; //剩下的正常卡数量，也是slot数量 5 5 4 4 3 3
        const label_compact_count = label_count - label_normal_count; //需要压缩的卡数量 2 3 5 6 8 9

        const label_compact_x = label_compact_slot_count; //1 1 2 2 3 3
        const label_compact_y = Math.floor(label_compact_count / label_compact_x); //2 3 5 6 8 9 -> 2 3 2 3 2 3
        const label_compact_remain = label_compact_count - (label_compact_x * label_compact_y);//这是在最紧密堆积 6x3 之后，还剩在堆积上面的数量，0 0 1 0 2 0

        label_width = 650 / 3; // 6卡标准配置
        const label_compact_remain_width = (label_compact_remain >= 0) ?
            (label_compact_x * (label_width + 10) / label_compact_remain - 10)
            : 0; //还剩在堆积上面的卡的宽度，要么是0要么是 x宽度 /剩下的

        let labelM1c = [];
        let labelM1r = [];

        // 处理方法：先渲染能 compact 的，再渲染剩在堆积上的，再渲染正常卡
        // 1. compact normal
        for (let i = 0; i < (label_compact_count - label_compact_remain); i++) {
            const v = s.beatmaps[i];
            const f1c = await label_A1({
                mode: v.mode,
                difficulty_name: v.version,
                star_rating: v.difficulty_rating,
                maxWidth: label_width,
                star: getExportFileV3Path('object-beatmap-star.png'),
                hasAvatar: true,
                uid: v.user_id,
            }, true);

            labelM1c.push(f1c);
        }

        // 2. compact remain
        for (let j = (label_compact_count - label_compact_remain); j < label_compact_count; j++) {
            const v = s.beatmaps[j];
            const f1r = await label_A1({
                mode: v.mode,
                difficulty_name: v.version,
                star_rating: v.difficulty_rating,
                maxWidth: label_compact_remain_width,
                star: getExportFileV3Path('object-beatmap-star.png'),
                hasAvatar: true,
                uid: v.user_id,
            }, true);

            labelM1r.push(f1r);
        }

        // 3. normal
        for (let k = label_compact_count; k < label_count; k++) {
            const v = s.beatmaps[k];
            const f1 = await label_A1({
                mode: v.mode,
                difficulty_name: v.version,
                star_rating: v.difficulty_rating,
                maxWidth: label_width,
                star: getExportFileV3Path('object-beatmap-star.png'),
                hasAvatar: false,
                uid: v.user_id,
            }, true);
            const f2 = await label_A2({
                host_uid: s.user_id,
                uid: v.user_id,
            }, true);
            const g3 = await PanelGenerate.searchDiff2LabelM3(v, label_width);
            const f3 = await label_A3(g3, true);

            labelM1s.push(f1);
            labelM2s.push(f2);
            labelM3s.push(f3);
        }

        //插入到svg中
        // 1. compact normal
        for (let ly = 0; ly < label_compact_y; ly++) {
            for (let lx = 0; lx < label_compact_x; lx++) {
                svg = implantSvgBody(svg, 10 + (label_width + 10) * lx, 150 - 60 * ly, labelM1c[lx + ly * label_compact_x], reg_label);
            }
        }

        // 2. compact remain
        for (let mx = 0; mx < label_compact_remain; mx++) {
            svg = implantSvgBody(svg, 10 + (label_compact_remain_width + 10) * mx, 150 - 60 * label_compact_y, labelM1r[mx], reg_label);
        }

        // 3. normal
        for (let n = 0; n < label_normal_count; n++) {
            const nx = n + label_compact_slot_count

            svg = implantSvgBody(svg, 10 + (label_width + 10) * nx, 150, labelM1s[n], reg_label);
            svg = implantSvgBody(svg, 10 + (label_width + 10) * nx + (label_width / 2) - 50, 10, labelM2s[n], reg_label);
            svg = implantSvgBody(svg, 10 + (label_width + 10) * nx + (label_width / 2) + 5, 120, labelM3s[n], reg_label); //往右偏一点，好看，记得改相似的地方
        }

        //给个备注，说明这个地方有多少个diff
        const diff_count = torus.getTextPath('Total: ' + label_count + 'x', 20, 21, 18, 'left baseline', '#fff')

        svg = replaceText(svg, diff_count, reg_text);

    } else {
        //只压缩前 18 个。
        const label_width = 650 / 3;
        let labelM1c = [];

        // 1. compact normal
        for (let i = 0; i < 18; i++) {
            const v = s.beatmaps[i];
            const f1c = await label_A1({
                mode: v.mode,
                difficulty_name: v.version,
                star_rating: v.difficulty_rating,
                maxWidth: label_width,
                star: getExportFileV3Path('object-beatmap-star.png'),
                hasAvatar: true,
                uid: v.user_id,
            }, true);

            labelM1c.push(f1c);
        }

        for (let ly = 0; ly < 3; ly++) {
            for (let lx = 0; lx < 6; lx++) {
                svg = implantSvgBody(svg, 10 + (label_width + 10) * lx, 150 - 60 * ly, labelM1c[lx + ly * 3], reg_label);
            }
        }

        //给个备注，说明这个地方有多少个diff
        const diff_count = torus.getTextPath('Diffs: ' + label_count + 'x', 20, 20, 18, 'left baseline', '#fff')

        svg = replaceText(svg, diff_count, reg_text);
    }

    //导入背景

    const background = await getMapBG(s.id, 'list@2x', isReload(s.ranked));
    svg = implantImage(svg,1370,210,0,0,0.5, background, reg_background);

    return svg.toString();
}