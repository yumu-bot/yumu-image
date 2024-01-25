import {PuHuiTi, torus} from "./font.js";
import moment from "moment";
import {
    getApproximateRank,
    getAvatar,
    getDecimals,
    getExportFileV3Path,
    getGameMode,
    getMapBG, getMapStatus,
    getMatchNameSplitted,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    getRoundedNumberStr,
    getTimeDifference,
    isReload,
    rankSS2X,
    readNetImage,
} from "./util.js";
import {getRankColor, getStarRatingColor} from "./color.js";
import {getModInt, hasMod} from "./mod.js";

//公用方法
//把参数变成面板能读懂的数据（router
export const PanelGenerate = {
    user2CardA1: async (user, historyUser) => {
        if (user == null) return {
            background: getExportFileV3Path('card-default.png'),
            avatar: getExportFileV3Path('sticker_qiqi_secretly_observing.png'),
            sub_icon1: '',
            sub_icon2: '',
            country: 'CN',

            top1: 'YumuBot',
            left1: '#0',
            left2: 'CN#0',
            right1: '',
            right2: '',
            right3b: 'Bot',
            right3m: '',
        }

        const background = await readNetImage(user?.cover_url || user?.cover?.url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user?.avatar_url || user?.avatar?.url, false, getExportFileV3Path('avatar-guest.png'));

        const sub_icon1 = user?.is_supporter ? getExportFileV3Path('object-card-supporter.png') : '';
        const country = user?.country?.code || 'CN';

        const left1 = '#' + (user?.statistics?.global_rank || '0');
        const left2 = country + '#' + (user?.statistics?.country_rank || '0');

        const isBot = user?.is_bot;
        const level = user?.statistics?.level_current || 0;
        const progress = user?.statistics?.level_progress || 0;
        const acc = getRoundedNumberStr(user?.statistics?.hit_accuracy, 3) || 0;
        const right2 = isBot ? '' : (acc + '% Lv.' + level + '(' + progress + '%)');
        const right3b = isBot ? 'Bot' : (user?.pp ? Math.round(user?.pp).toString() : '');
        const right3m = isBot ? '' : (user?.pp ? 'PP' :
            (user?.statistics?.level_current === 1 && user?.statistics?.level_progress === 0 ? 'NOT PLAYED' : 'AFK'));

        //历史记录功能！
        const pp_d = historyUser ? Math.round((user.pp - historyUser?.statistics?.pp) * 100) / 100 : 0
        const right1 = (pp_d > 0) ? '+' + pp_d + 'PP' : ((pp_d < 0) ? pp_d + 'PP' : '');

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            country: country,

            top1: user?.username,
            left1: left1,
            left2: left2,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    mapper2CardA1: async (user) => {
        const background = await readNetImage(user?.cover_url || user?.cover?.url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user?.avatar_url || user?.avatar?.url, false, getExportFileV3Path('avatar-guest.png'));

        const sub_icon1 = user.is_supporter ? getExportFileV3Path('object-card-supporter.png') : '';
        const country = user?.country?.code || 'CN';

        const left2 = 'U' + user.id;

        const right2 = 'Mapping Followers';
        const right3b = user.mapping_follower_count ? user.mapping_follower_count.toString() : '0';
        const right3m = 'x';

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            country: country,

            top1: user?.username,
            left1: country,
            left2: left2,
            right1: '',
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    microUser2CardA1: async (microUser) => {
        const background = await readNetImage(microUser?.cover_url || microUser?.cover?.url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(microUser?.avatar_url || microUser?.avatar?.url, false, getExportFileV3Path('avatar-guest.png'));
        const sub_icon1 = microUser.is_supporter ? getExportFileV3Path('object-card-supporter.png') : '';

        const country = microUser?.country_code || 'CN';

        const left1 = microUser.statistics.global_rank ? '#' + microUser.statistics.global_rank : '#0';
        const left2 = country + (microUser.statistics.country_rank ? '#' + microUser.statistics.country_rank : '#-'); //microUser 没有country rank

        const isBot = microUser.is_bot;
        const level = microUser?.statistics?.level_current || 0;
        const progress = microUser?.statistics?.level_progress || 0;
        const acc = getRoundedNumberStr(microUser?.statistics?.hit_accuracy, 3) || 0;
        const right2 = isBot ? '' : (acc + '% Lv.' + level + '(' + progress + '%)');
        const right3b = isBot ? '' : (microUser?.statistics?.pp ? Math.round(microUser.statistics.pp).toString() : '');
        const right3m = isBot ? 'Bot' : (microUser?.statistics?.pp ? 'PP' : 'AFK');

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',

            country: country,

            top1: microUser?.username,
            left1: left1,
            left2: left2,
            right1: '',
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },


    //panel F2 用的转换
    score2CardA1: async (score = {
        accuracy: 0.9329874621703416,
        timestamp: null,
        mode: 'OSU',
        mods: [ 'NF', 'HD' ],
        passed: true,
        perfect: false,
        pp: null,
        rank: 'F',
        replay: false,
        score: 363522,
        user: {
            id: 10436444,
            pmOnly: false,
            avatar_url: 'https://a.ppy.sh/10436444?1675267430.jpeg',
            default_group: 'default',
            is_active: true,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: true,
            last_visit: [Array],
            pm_friends_only: false,
            username: 'No rank',
            country_code: 'CN',
            country: [Object]
        },

        statistics: {
            count_50: 10,
            count_100: 53,
            count_300: 700,
            count_geki: 92,
            count_katu: 37,
            count_miss: 8
        },
        type: 'legacy_match_score',
        best_id: null,
        id: null,
        max_combo: 452,
        mode_int: 0,
        user_id: 10436444,
        match: { slot: 5, team: 'red', pass: true },
        user_name: 'No rank',

        total_score : 4,
        total_player : 12,
    }) => {
        if (!score) return '';

        const player_score = score.score || 0;
        const total_score = score.total_score || 0;
        const total_player = score.total_player || 0;
        const rating = (total_score > 0) ? Math.round(player_score * total_player / total_score * 100) / 100 : 0;
        const pp_str = (score?.pp > 0) ? ' (' + Math.round(score.pp) + 'PP) ' : '';
        const mods_arr = score?.mods || [];
        const rank = rankSS2X(getApproximateRank(score, true));
        const bg_str = 'object-score-backimage-' + rank + '.jpg';
        const icon_str = (!score.match.team || score.match.team === 'none') ? 'object-card-headtohead.png'
            : 'object-card-team' + score.match.team + '.png';

        let mods = '';
        if (mods_arr.length > 0) {
            mods = ' +';
            for (const v of mods_arr) {
                mods += v;
            }
        }

        const background = getExportFileV3Path(bg_str);
        const avatar = await getAvatar(score?.user_id, false, getExportFileV3Path('avatar-guest.png'));
        const country = score?.user?.country?.code || 'CN';

        const top1 = score?.user?.username || score?.user_name || 'Unknown';

        const left1 = score?.user?.country?.name || 'Unknown';
        const left2 = 'P' + (score?.match?.slot + 1) + ' *' + rating + ' ' + pp_str;
        const right2 = (Math.round((score?.accuracy || 0) * 10000) / 100) + '%' + ' '
            + rank + mods + ' ' + (score?.max_combo || 0) + 'x';
        const right3b = getRoundedNumberLargerStr(player_score, 0);
        const right3m = getRoundedNumberSmallerStr(player_score, 0);

        return {
            background,
            avatar,
            sub_icon1: getExportFileV3Path(icon_str) ,
            sub_icon2: '',
            country: country,

            top1: top1,
            left1: left1,
            left2: left2,
            right1: '',
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    //主程序给的avgStar不靠谱，不如自己算
    matchData2CardA2: async (data, averageStar = 0) => {
        const redWins = data.teamPoint.red || 0;
        const blueWins = data.teamPoint.blue || 0;

        const isTeamVS = data.teamVS;
        const star = getRoundedNumberStr(averageStar || data.averageStar || 0, 3);

        const background = await getMapBG(data.firstMapSID, 'list@2x', false);

        const isContainVS = data.matchStat.name.toLowerCase().match('vs');
        let title, title1, title2;
        if (isContainVS) {
            title = getMatchNameSplitted(data.matchStat.name);
            title1 = title[0];
            title2 = title[1] + ' vs ' + title[2];
        } else {
            title1 = data.matchStat.name;
            title2 = '';
        }

        //这里的时间戳不需要 .add(8, 'hours')
        const left1 = 'R' + data.roundCount + ' P' + data.playerCount + ' S' + data.scoreCount;
        let left2;

        if (data.matchEnd) {
            left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-' + moment(data.matchStat.end_time, 'X').format('HH:mm');
        } else if (data.hasCurrentGame) {
            left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-playing';
        } else {
            left2 = moment(data.matchStat.start_time, 'X').format('HH:mm') + '-continuing';
        }

        const left3 = moment(data.matchStat.start_time, 'X').format('YYYY/MM/DD');

        const right1 = (averageStar > 0) ? 'SR ' + star + '*' : 'SR ~' + star + '*';
        const right2 = 'mp' + data.matchStat.id || 0;
        const right3b = isTeamVS ? (redWins + ' : ' + blueWins) : data.roundCount.toString();
        const right3m = isTeamVS ? '' : 'x';

        return {
            background: background,
            map_status: '',

            title1: title1,
            title2: title2,
            title_font: 'PuHuiTi',
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
            isTeamVS: isTeamVS,
        };
    },

    beatmap2CardA2: async (beatmap) => {
        const background = await getMapBG(beatmap.beatmapset.id, 'list@2x', isReload(beatmap.ranked));
        const map_status = beatmap.status;
        const title1 = beatmap.beatmapset.title;
        const title2 = beatmap.beatmapset.artist;
        const title3 = beatmap.version;
        const title_font = torus;
        const left1 = '';
        const left2 = beatmap.beatmapset.creator;
        const left3 = beatmap.id ? 'B' + beatmap.id : 'B0';
        const right1 = '';
        const right2 = getBeatmapStats(beatmap);
        const right3b = getDecimals(beatmap.difficulty_rating, 2);
        const right3m = getDecimals(beatmap.difficulty_rating, 3) + '*';

        function getBeatmapStats(beatmap) {
            const cs = Math.round(beatmap.cs * 10) / 10;
            const ar = Math.round(beatmap.ar * 10) / 10;
            const od = Math.round(beatmap.accuracy * 10) / 10;
            const hp = Math.round(beatmap.drain * 10) / 10;

            switch (getGameMode(beatmap.mode, 1)) {
                case 'o':
                    return 'CS' + cs + ' AR' + ar + ' OD' + od;
                case 't':
                    return 'OD' + od + ' HP' + hp;
                case 'c':
                    return 'CS' + cs + ' AR' + ar + ' HP' + hp;
                case 'm':
                    return cs + 'Keys OD' + od + ' HP' + hp;
            }
        }

        return {
            background: background,
            map_status: map_status,

            title1: title1,
            title2: title2,
            title3: title3,
            title_font: title_font,
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },



    beatMapSet2CardA2: async (s = {
        artist: 'Wang Rui',
        covers: {
            cover: 'https://assets.ppy.sh/beatmaps/1087774/covers/cover.jpg?1646464034',
            'cover@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/cover@2x.jpg?1646464034',
            card: 'https://assets.ppy.sh/beatmaps/1087774/covers/card.jpg?1646464034',
            'card@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/card@2x.jpg?1646464034',
            list: 'https://assets.ppy.sh/beatmaps/1087774/covers/list.jpg?1646464034',
            'list@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/list@2x.jpg?1646464034',
            slimcover: 'https://assets.ppy.sh/beatmaps/1087774/covers/slimcover.jpg?1646464034',
            'slimcover@2x': 'https://assets.ppy.sh/beatmaps/1087774/covers/slimcover@2x.jpg?1646464034'
        },
        creator: 'Muziyami',
        nsfw: false,
        offset: 0,
        source: '小女花不弃',
        spotlight: false,
        status: 'ranked',
        title: 'Tao Hua Xiao',
        video: false,
        ranked: 1,
        storyboard: true,
        tags: 'peach blossom cpop c-pop pop chinese 古风 oriental bilibili cover rearrangement 纳兰寻风 na lan xun feng 西门振 xi men zhen 青萝子 qing luo zi op opening xiao nv hua bu qi i will never let you go houshou hari dacaigou kisaki dahkjdas -ovo-',
        converts: [
            [Object], [Object], [Object],
            [Object], [Object], [Object],
            [Object], [Object], [Object],
            [Object], [Object], [Object],
            [Object], [Object], [Object],
            [Object], [Object], [Object],
            [Object], [Object], [Object]
        ],
        description: {
            description: ""
        },
        genre: { id: 5, name: 'Pop' },
        language: { id: 4, name: 'Chinese' },
        ratings: [
            0, 7, 4, 0,  3,
            1, 1, 7, 3, 41,
            270
        ],
        mappers: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object]
        ],
        nominators: [ [Object] ],
        publicRating: 9.43620178041543,
        sid: 1087774,
        bpm: 162,
        artist_unicode: '汪睿',
        favourite_count: 404,
        id: 1087774,
        play_count: 200243,
        preview_url: '//b.ppy.sh/preview/1087774.mp3',
        title_unicode: '桃花笑',
        user_id: 7003013,
        can_be_hyped: false,
        discussion_locked: false,
        is_scoreable: true,
        last_updated: 1646464010,
        legacy_thread_url: 'https://osu.ppy.sh/community/forums/topics/1005413',
        nominations_summary: { current: 4, required: 4 },
        ranked_date: 1647193324,
        submitted_date: 1577976073,
        availability: { download_disabled: false, more_information: null },
        beatmaps: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object]
        ],
        current_nominations: [ [Object], [Object], [Object], [Object] ],
        pack_tags: [ 'S1152' ],
        recent_favourites: [
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object], [Object], [Object],
            [Object], [Object]
        ],
        related_users: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object]
        ],
        user: {
            id: 7003013,
            username: 'Muziyami',
            discord: 'YumeMuzi#5619',
            interests: 'yuyuko❤',
            location: 'China',
            occupation: 'Elite Graveyarded Mapper',
            twitter: 'YumeMuzi',
            website: 'https://github.com/YumeMuzi',
            badges: [Array],
            monthlyPlaycounts: [Array],
            page: [Object],
            replaysWatchedCounts: [Array],
            PP: 6196.65,
            active: true,
            uid: 7003013,
            bot: false,
            osuMode: 'OSU',
            pp: 6196.65,
            playCount: 23831,
            countryRank: 680,
            levelProgress: 48,
            levelCurrent: 100,
            totalHits: 8890988,
            playTime: 2347198,
            accuracy: 99.0353,
            globalRank: 36155,
            maxCombo: 2801,
            deleted: false,
            online: false,
            commentsCount: 682,
            supporter: false,
            avatar_url: 'https://a.ppy.sh/7003013?1704285435.jpeg',
            country_code: 'CN',
            default_group: 'default',
            is_active: true,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: false,
            last_visit: 1706131787,
            pm_friends_only: false,
            cover_url: 'https://assets.ppy.sh/user-profile-covers/7003013/2c77630af47d21907bd8a286162e6169bdbb4c8306cc0ac1bb088004890562e7.jpeg',
            has_supported: true,
            join_date: 1440765767,
            max_blocks: 100,
            max_friends: 500,
            playmode: 'osu',
            playstyle: [Array],
            post_count: 252,
            profile_order: [Array],
            country: [Object],
            cover: [Object],
            kudosu: [Object],
            account_history: [],
            active_tournament_banners: [],
            beatmap_playcounts_count: 6892,
            comments_count: 682,
            favourite_beatmapset_count: 85,
            follower_count: 505,
            graveyard_beatmapset_count: 113,
            groups: [],
            guest_beatmapset_count: 26,
            loved_beatmapset_count: 0,
            mapping_follower_count: 61,
            nominated_beatmapset_count: 0,
            pending_beatmapset_count: 3,
            previous_usernames: [Array],
            rank_highest: [Object],
            ranked_beatmapset_count: 4,
            scores_best_count: 100,
            scores_first_count: 0,
            scores_pinned_count: 3,
            scores_recent_count: 0,
            statistics: [Object],
            support_level: 0,
            user_achievements: [Array],
            rank_history: [Object]
        }
    }) => {
        const background = await readNetImage(s?.covers["card@2x"], isReload(s?.ranked));
        const map_status = s?.status;
        const title1 = s?.title_unicode;
        const title2 = s?.artist_unicode;
        const title3 = s?.creator;
        const title_font = (s?.title === s?.title_unicode && s?.artist === s?.artist_unicode) ? 'torus' : 'PuHuiTi';
        const left1 = '';
        const left2 = getMapStatus(s?.ranked);
        const left3 = s?.id ? ('S' + s.id) : 'S0';
        const right1 = 'Favorite ' + s?.favourite_count;
        const right2 = 'Play Counts';
        const right3b = getRoundedNumberLargerStr(s?.play_count, 3);
        const right3m = getRoundedNumberSmallerStr(s?.play_count, 3);

        return {
            background: background,
            map_status: map_status,

            title1: title1,
            title2: title2,
            title3: title3,
            title_font: title_font,
            title3_font: 'torus',
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    matchBeatmap2CardA2: async (b) => {

        const background = await readNetImage(b?.beatmapset?.covers['cover@2x'], false);
        const title1 = b?.beatmapset?.title || 'Unknown Title';
        const title2 = b?.beatmapset?.artist || 'Unknown Artist';
        const title3 = b?.beatmapset?.creator || 'God Made This';
        const left2 = b?.version || 'Tragic Love Extra';
        const left3 = 'b' + (b?.id || 0);

        const status = b?.status;
        let right2;

        switch (getGameMode(b?.mode, 1)) {
            case 'o': {
                right2 = 'CS' + (b?.cs || 0) +
                    ' AR' + (b?.ar || 0) +
                    ' OD' + (b?.od || 0);
                break;
            }
            case 't': {
                right2 = 'OD' + (b?.od || 0);
                break;
            }
            case 'c': {
                right2 = 'CS' + (b?.cs || 0) +
                    ' AR' + (b?.ar || 0);
                break;
            }
            case 'm': {
                right2 = (b?.cs || 0) +
                    'Key OD' + (b?.od || 0);
                break;
            }
            default: {
                right2 = '-';
            }
        }

        const right3b = getDecimals(b?.difficulty_rating,2);
        const right3m = getDecimals(b?.difficulty_rating,3) + '*';

        return {
            background: background,
            title1: title1,
            title2: title2,
            title3: title3,
            title_font: 'torus',
            left2: left2,
            left3: left3,
            map_status: status,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    searchResult2CardA2: async (total, cursor, search, result_count, rule, first_beatmapset) => {
        const background = cursor ? await getMapBG(cursor.id, 'list@2x', false) : await readNetImage(first_beatmapset.covers['list@2x'], false, getExportFileV3Path('card-default.png'));
        const map_status = rule;
        const title1 = 'Search:';
        const title2 = search ? 'Sort: ' + search.sort : "Sort: Default";
        const title3 = '';
        const title_font = torus;
        const left1 = 'time duration:';
        const left2 = cursor ? moment(parseInt(cursor.queued_at)).format("MM-DD HH:mm:ss") :
            (first_beatmapset.ranked_date ?
                moment(first_beatmapset.ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours').format("MM-DD HH:mm:ss") : 'null');
        const left3 = moment().format("MM-DD HH:mm:ss");
        const right1 = 'total ' + total + 'x' || 'total 0x';
        const right2 = 'results:';
        const right3b = result_count.toString() || '0';
        const right3m = 'x';

        return {
            background: background,
            map_status: map_status,

            title1: title1,
            title2: title2,
            title3: title3,
            title_font: title_font,
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    searchMap2CardA2: async (s, rank) => {
        const ranked_date = s.ranked_date || '';
        const submitted_date = s.submitted_date || '';

        const background = await getMapBG(s.id, 'list@2x', isReload(s.ranked));
        const map_status = s?.status || 'graveyard';

        const isRanked = (map_status === 'ranked' || map_status === 'loved' || map_status === 'approved');
        const isQualified = (map_status === 'qualified');

        const title1 = s.title || 'Unknown Title';
        const title2 = s.artist || 'Unknown Artist';
        const title3 = s.creator || 'Unknown Mapper';
        const title_font = torus;
        const left1 = '';
        const left2 = '#' + rank || '#0';
        const left3 = 's' + s.id || 's0';
        const right1 = isQualified ? 'Expected:' :
            (isRanked ? 'Ranked:' :
                'Submitted:');

        const right2 = isQualified ? getApproximateRankedTime(ranked_date, 'X') :
            (isRanked ? moment(ranked_date, 'X').utcOffset(960).format("YYYY-MM-DD HH:mm") :
                moment(submitted_date, 'X').utcOffset(960).format("YYYY-MM-DD HH:mm"));
        let right3b;
        let right3m;

        const days = getApproximateLeftRankedTime(ranked_date, 'X', 0);
        const hours = getApproximateLeftRankedTime(ranked_date, 'X', 1);
        const minutes = getApproximateLeftRankedTime(ranked_date, 'X', 2);

        if (isQualified) {
            if (days > 0) {
                right3b = days.toString();
                right3m = 'd' + hours + 'h';
            } else if (hours > 0) {
                right3b = hours.toString();
                right3m = 'h' + minutes + 'm';
            } else if (minutes > 0) {
                right3b = minutes.toString();
                right3m = 'm';
            } else if (hours > -1) {
                right3b = '...';
                right3m = '';
            } else {
                right3b = '-';
                right3m = '';
            }
        } else {
            right3b = '-'
            right3m = '';
        }

        return {
            background: background,
            map_status: map_status,

            title1: title1,
            title2: title2,
            title3: title3,
            title_font: title_font,
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };

        function getApproximateRankedTime(date = '', format = 'YYYY-MM-DD[T]HH:mm:ss[Z]') {

            const dateP7 = moment(date, format).add(8, 'hours').add(7, 'days');
            const dateP7m20 = moment(date, format).add(8, 'hours').add(7, 'days').add(20, 'minutes');

            return dateP7.format("YYYY-MM-DD HH:mm")
                + ' ~ '
                + dateP7m20.format("HH:mm")
                + ' +8'
        }

        function getApproximateLeftRankedTime(date = '', format = 'YYYY-MM-DD[T]HH:mm:ss[Z]', whichData = 0) {
            const dateP7 = moment(date, format).add(8, 'hours').add(7, 'days');

            switch (whichData) {
                case 0:
                    return dateP7.diff(moment(), "days");
                case 1:
                    return dateP7.diff(moment(), "hours") % 24;
                case 2:
                    return dateP7.diff(moment(), "minutes") % 60;
            }
        }
    },

//给panel_A5用的，期待可以和上面合并
    beatmap2CardH: async (b, calcPP, rank = 1) => {
        const cover = await getMapBG(b.beatmapset.id, 'list@2x', isReload(b.ranked));
        const background = await getMapBG(b.beatmapset.id, 'cover@2x', isReload(b.ranked));
        // const background = beatmap ? await getDiffBG(beatmap.id, getExportFileV3Path('beatmap-DLfailBG.jpg')) : '';
        // 这个不要下载，请求量太大

        const time_diff = getTimeDifference(b.create_at_str);

        let mods_width;
        switch (b.mods.length) {
            case 0:
                mods_width = 0;
                break;
            case 1:
                mods_width = 100;
                break;
            case 2:
                mods_width = 140;
                break;
            case 3:
                mods_width = 140;
                break;
            case 4:
                mods_width = 160;
                break;
            case 5:
                mods_width = 180;
                break;
            default:
                mods_width = 180;
        }

        const difficulty_name = b.beatmap.version ? torus.cutStringTail(b.beatmap.version, 24,
            500 - 20 - mods_width - torus.getTextWidth('[] - # ()' + rank + time_diff, 24), true) : '';
        const color_index = (b.rank === 'XH' || b.rank === 'X') ? '#2A2226' : '#fff';

        const artist = torus.cutStringTail(b.beatmapset.artist, 24,
            500 - 20 - mods_width - torus.getTextWidth(' // ' + b.beatmapset.creator, 24), true);

        const title2 = (b.beatmapset.title === b.beatmapset.title_unicode) ? null : b.beatmapset.title_unicode;
        const index_b = (calcPP.pp < 2000) ? Math.round(calcPP.pp).toString() : 'Inf.';

        return {
            background: background,
            cover: cover,
            title: b.beatmapset.title || '',
            title2: title2,
            left1: artist + ' // ' + b.beatmapset.creator,
            left2: '[' + difficulty_name + '] - #' + rank + ' (' + time_diff + ')',
            index_b: index_b,
            index_m: 'PP',
            index_b_size: 48,
            index_m_size: 36,
            label1: '',
            label2: '',
            label3: '',
            label4: '',
            mods_arr: b.mods || [],

            color_title2: '#bbb',
            color_right: getRankColor(b.rank),
            color_left: getStarRatingColor(calcPP.attr.stars),
            color_index: color_index,
            color_label1: '',
            color_label2: '',
            color_label3: '',
            color_label4: '',
            color_left12: '#bbb',

            font_title2: 'PuHuiTi',
            font_label4: 'torus',
        }
    },

    bp2CardH: async (bp, rank = 1) => {
        const cover = await getMapBG(bp.beatmapset.id, 'list@2x', false);
        const background = await getMapBG(bp.beatmapset.id, 'cover@2x', false);

        const time_diff = getTimeDifference(bp.create_at_str);

        let mods_width;
        switch (bp.mods.length) {
            case 0:
                mods_width = 0;
                break;
            case 1:
                mods_width = 100;
                break;
            case 2:
                mods_width = 140;
                break;
            case 3:
                mods_width = 140;
                break;
            case 4:
                mods_width = 160;
                break;
            case 5:
                mods_width = 180;
                break;
            default:
                mods_width = 180;
        }

        const difficulty_name = bp.beatmap.version ? torus.cutStringTail(bp.beatmap.version, 24,
            500 - 20 - mods_width - torus.getTextWidth('[] - BP ()' + rank + time_diff, 24), true) : '';
        const color_index = (bp.rank === 'XH' || bp.rank === 'X') ? '#2A2226' : '#fff';

        const artist = torus.cutStringTail(bp.beatmapset.artist, 24,
            500 - 20 - mods_width - torus.getTextWidth(' // ' + bp.beatmapset.creator, 24), true);

        const title2 = (bp.beatmapset.title === bp.beatmapset.title_unicode) ? null : bp.beatmapset.title_unicode;

        const mod = bp.mods || [];
        //随便搞个颜色得了
        const mod_int = getModInt(mod);
        let star_rating = bp.beatmap.difficulty_rating || 0;
        if (hasMod(mod_int, 'DT') || hasMod(mod_int, 'NC')) {
            star_rating *= 1.4;
        } else if (hasMod(mod_int, 'HR')) {
            star_rating *= 1.078;
        } else if (hasMod(mod_int, 'HT')) {
            star_rating *= 0.75;
        } else if (hasMod(mod_int, 'EZ')) {
            star_rating *= 0.9;
        } else if (hasMod(mod_int, 'FL')) {
            star_rating *= 1.3;
        }

        return {
            background: background,
            cover: cover,
            title: bp.beatmapset.title || '',
            title2: title2,
            left1: artist + ' // ' + bp.beatmapset.creator,
            left2: '[' + difficulty_name + '] - BP' + rank + ' (' + time_diff + ')',
            index_b: Math.round(bp.pp).toString(),
            index_m: 'PP',
            index_b_size: 48,
            index_m_size: 36,
            label1: '',
            label2: '',
            label3: '',
            label4: '',
            mods_arr: bp.mods || [],

            color_title2: '#bbb',
            color_right: getRankColor(bp.rank),
            color_left: getStarRatingColor(star_rating),
            color_index: color_index,
            color_label1: '',
            color_label2: '',
            color_label3: '',
            color_label4: '',
            color_left12: '#bbb',

            font_title2: 'PuHuiTi',
            font_label4: 'torus',
        }
    },

    bp2CardJ: async (bp) => {
        const background = await getMapBG(bp.beatmapset.id, 'list@2x', isReload(bp.beatmap.ranked));

        return {
            cover: background,
            background: background,
            title: bp.beatmapset ? bp.beatmapset.title : 'Unknown Title',
            artist: bp.beatmapset ? bp.beatmapset.artist : 'Unknown Artist',
            difficulty_name: bp.beatmap ? bp.beatmap.version : '-',
            star_rating: bp.beatmap ? bp.beatmap.difficulty_rating : 0,
            score_rank: bp.rank || 'F',
            accuracy: Math.round(bp.accuracy * 10000) / 100 || 0, //%
            combo: bp.max_combo || 0, //x
            mods_arr: bp.mods || [],
            pp: Math.round(bp.pp) || 0 //pp
        }
    },

    searchDiff2LabelM3: async (beatmap, label_width) => {

        switch (getGameMode(beatmap.mode, 1)) {
            case 'o':
            default:
                return {
                    label1: {
                        icon: getExportFileV3Path("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: getDecimals(beatmap.cs, 2),
                        data_m: getDecimals(beatmap.cs, 3)
                    },
                    label2: {
                        icon: getExportFileV3Path("object-score-approachrate.png"),
                        icon_title: 'AR',
                        data_b: getDecimals(beatmap.ar, 2),
                        data_m: getDecimals(beatmap.ar, 3)
                    },
                    label3: {
                        icon: getExportFileV3Path("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: getDecimals(beatmap.accuracy, 2),
                        data_m: getDecimals(beatmap.accuracy, 3)
                    },

                    maxWidth: label_width,
                };

            case 't' :
                return {
                    label1: {
                        icon: getExportFileV3Path("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: getDecimals(beatmap.accuracy, 2),
                        data_m: getDecimals(beatmap.accuracy, 3)
                    },
                    label2: {
                        icon: '',
                        icon_title: '',
                        data_b: '',
                        data_m: ''
                    },
                    label3: {
                        icon: getExportFileV3Path("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: getDecimals(beatmap.drain, 2),
                        data_m: getDecimals(beatmap.drain, 3)
                    },

                    maxWidth: label_width,
                };

            case 'c':
                return {
                    label1: {
                        icon: getExportFileV3Path("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: getDecimals(beatmap.cs, 2),
                        data_m: getDecimals(beatmap.cs, 3)
                    },
                    label2: {
                        icon: getExportFileV3Path("object-score-approachrate.png"),
                        icon_title: 'AR',
                        data_b: getDecimals(beatmap.ar, 2),
                        data_m: getDecimals(beatmap.ar, 3)
                    },
                    label3: {
                        icon: getExportFileV3Path("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: getDecimals(beatmap.drain, 2),
                        data_m: getDecimals(beatmap.drain, 3)
                    },

                    maxWidth: label_width,
                };

            case 'm' :
                return {
                    label1: {
                        icon: getExportFileV3Path("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: getDecimals(beatmap.cs, 2),
                        data_m: getDecimals(beatmap.cs, 3)
                    },
                    label2: {
                        icon: getExportFileV3Path("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: getDecimals(beatmap.accuracy, 2),
                        data_m: getDecimals(beatmap.accuracy, 3)
                    },
                    label3: {
                        icon: getExportFileV3Path("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: getDecimals(beatmap.drain, 2),
                        data_m: getDecimals(beatmap.drain, 3)
                    },
                };
        }
    },

    user2CardO1: async (user) => {
        const background = await readNetImage(user?.cover_url || user?.cover?.url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user?.avatar_url || user?.avatar?.url, false, getExportFileV3Path('avatar-guest.png'));

        return {
            background,
            avatar,

            name: user.username,
            groups: user.groups || [],
        };
    },

    beatmap2CardO2: async (beatmapset) => {
        if (!beatmapset) return '';

        const background = await getMapBG(beatmapset.id, 'list@2x', isReload(beatmapset.status));
        const map_status = beatmapset.status;
        const title1 = beatmapset.title;
        const title2 = beatmapset.artist;
        const title_font = torus;
        const left1 = '';
        const left2 = '*' + beatmapset.favourite_count;
        const left3 = beatmapset.id ? 'S' + beatmapset.id : '0';
        const right1 = 'Play Counts';
        const right2b = getRoundedNumberLargerStr(beatmapset.play_count, 2);
        const right2m = getRoundedNumberSmallerStr(beatmapset.play_count, 2);

        return {
            background: background,
            map_status: map_status,

            title1: title1,
            title2: title2,
            title_font: title_font,
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2b: right2b,
            right2m: right2m,
        };
    },
}