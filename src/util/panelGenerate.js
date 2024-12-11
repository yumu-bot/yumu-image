import {PuHuiTi, torus} from "./font.js";
import moment from "moment";
import {
    getDecimals,
    getImageFromV3,
    getGameMode,
    getMapBG,
    getMapStatus,
    getMatchNameSplitted,
    getRoundedNumberStrLarge,
    getRoundedNumberStrSmall,
    getRoundedNumberStr,
    getTimeDifference,
    readNetImage,
    getAvatar,
    getBanner,
    isNullOrEmptyObject,
    isNotBlankString,
    isNotNull,
    isNotEmptyArray,
    getTimeByDHMS,
    requireNonNullElse,
    getDifficultyName, getDiffBG,
} from "./util.js";
import {getRankColor, getStarRatingColor} from "./color.js";
import {
    getApproximateRank,
    getScoreTypeImage,
    hasLeaderBoard,
    rankSS2X
} from "./star.js";
import {getCHUNITHMRatingBG, getMaimaiCategory, getMaimaiCover, getMaimaiPlate, getMaimaiRatingBG} from "./maimai.js";

//公用方法
//把参数变成面板能读懂的数据（router
export const PanelGenerate = {
    // panel A7 有细微的改动，请注意
    user2CardA1: async (user, historyUser) => {
        if (user == null) return {
            background: getImageFromV3('card-default.png'),
            avatar: getImageFromV3('sticker_qiqi_secretly_observing.png'),
            sub_icon1: '',
            sub_icon2: '',
            sub_banner: '',
            country: 'CN',

            top1: 'YumuBot',
            left1: '#0',
            left2: 'CN#0',
            right1: '',
            right2: '',
            right3b: 'Bot',
            right3m: '',
        }


        const background = user?.profile?.card || await getBanner(user?.cover_url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        const sub_icon1 = user?.is_supporter ? getImageFromV3('object-card-supporter.png') : '';
        const country = user?.country?.code || 'CN';

        const left1 = user?.statistics?.global_rank ?
            '#' + user.statistics.global_rank : (user?.rank_highest?.rank ?
                    '#' + user.rank_highest.rank + '^ (' + moment(user.rank_highest.updated_at, "X").year() + ')' : '#0'
            );
        const left2 = country + (user?.statistics?.country_rank ? ('#' + user.statistics.country_rank) : '');

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
            sub_banner: '',
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
        const background = await getBanner(user?.cover_url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        const sub_icon1 = user.is_supporter ? getImageFromV3('object-card-supporter.png') : '';
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
            sub_banner: '',
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

    microUser2CardA1: async (user, type = null, show_mutual = false) => {
        const background = await getBanner(user?.cover?.url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        let sub_icon1 = ''
        let sub_icon2 = ''

        if (show_mutual) {
            if (user.is_mutual) {
                if (user.is_supporter) {
                    sub_icon1 = getImageFromV3('object-card-supporter.png')
                    sub_icon2 = getImageFromV3('object-card-mutual.png')
                } else {
                    sub_icon1 = getImageFromV3('object-card-mutual.png')
                }
            } else {
                if (user.is_supporter) {
                    sub_icon1 = getImageFromV3('object-card-supporter.png')
                    sub_icon2 = getImageFromV3('object-card-follower.png')
                } else {
                    sub_icon1 = getImageFromV3('object-card-follower.png')
                }
            }
        } else if (user.is_supporter) {
            sub_icon1 = getImageFromV3('object-card-supporter.png')
        }

        const country = user?.country_code || 'CN';

        const left1 = user.statistics.global_rank ? '#' + user.statistics.global_rank : '#0';
        const left2 = country + ' ' + (user?.id?.toString() || '0');
        // (user.statistics.country_rank ? '#' + user.statistics.country_rank : '#-') microUser 没有country rank

        const isBot = user.is_bot;
        const level = user?.statistics?.level_current || 0;
        const progress = user?.statistics?.level_progress || 0;
        const acc = getRoundedNumberStr(user?.statistics?.hit_accuracy, 3) || 0;

        let right1

        switch (type) {
            case "time": right1 = isNotEmptyArray(user?.last_visit) ?
                ('Seen: ' + user?.last_visit[0]?.toString()?.slice(-2) + '-' + user?.last_visit[1] + '-' + user?.last_visit[2])
                : ''; break;
            case "play_count": right1 = 'PC: ' + (user?.statistics?.play_count || 0) ; break;
            case "play_time": right1 = 'PT: ' + getTimeByDHMS(user?.statistics?.play_time, false); break;
            case "total_hits": right1 = 'TTH: ' + (user?.statistics?.total_hits || 0) ; break;

            case "online": right1 = (user?.is_online === true) ? 'online' : 'offline'; break;
            default: right1 = ""; break;
        }
        const right2 = isBot ? '' : (acc + '% Lv.' + level + '(' + progress + '%)');
        const right3b = isBot ? '' : (user?.statistics?.pp ? Math.round(user.statistics.pp).toString() : '');
        const right3m = isBot ? 'Bot' : (user?.statistics?.pp ? 'PP' : 'AFK');

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
            sub_icon2: sub_icon2,
            sub_banner: '',

            country: country,

            top1: user?.username,
            left1: left1,
            left2: left2,
            left3: '',
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },


    //panel F2 用的转换
    matchScore2CardA1: async (score) => {
        if (isNullOrEmptyObject(score)) return '';

        const player_score = score.score || 0;
        const total_score = score.total_score || 0;
        const total_player = score.total_player || 0;

        const rating = (total_score > 0) ? Math.round(player_score * total_player / total_score * 100) / 100 : 0;
        const rating_str = rating > 0 ? (' *' + rating + ' ') : ' '
        const pp_str = (score?.pp > 0) ? ' (' + Math.round(score.pp) + 'PP) ' : '';
        const acc_str = (Math.round((score?.accuracy || 0) * 10000) / 100) + '%'
        const combo = score?.max_combo || score?.max_combo || 0
        const combo_str = combo > 0 ? (combo + 'x') : ''

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

        const background = getImageFromV3(bg_str);
        const avatar = await getAvatar(score?.user?.avatar_url, false);
        const country = score?.user?.country?.code || 'CN';

        const top1 = score?.user?.username || score?.user_name || 'Unknown';

        const left1 = score?.user?.country?.name || 'Unknown';
        const left2 = 'P' + (score?.match?.slot + 1) + rating_str + pp_str;
        const right2 = acc_str + ' '
            + rank + mods + ' ' + combo_str;
        const right3b = getRoundedNumberStrLarge(player_score, 0);
        const right3m = getRoundedNumberStrSmall(player_score, 0);

        return {
            background,
            avatar,
            sub_icon1: getImageFromV3(icon_str) ,
            sub_icon2: '',
            sub_banner: '',
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

    maimaiPlayer2CardA1: async (user) => {
        const background = getMaimaiRatingBG(user.rating);

        let dan
        const dan_arr = ['初', '二', '三', '四', '五', '六', '七', '八', '九', '十']

        if (user.dan === 0) dan = '初学者'
        else if (user.dan <= 10) dan = dan_arr[user.dan - 1] + '段'
        else if (user.dan <= 20) dan = '真' + dan_arr[user.dan - 11] + '段'
        else if (user.dan === 21) dan = '真皆伝'
        else if (user.dan === 22) dan = '裏皆伝'
        else dan = ''

        let top2;
        let left1;
        let sub_banner;

        const plate_image = getMaimaiPlate(user.platename)

        if (isNotBlankString(plate_image)) {
            top2 = ''
            left1 = user.probername
            sub_banner = plate_image
        } else {
            top2 = user.probername
            left1 = ''
            sub_banner = ''
        }

        return {
            background: background,
            avatar: getImageFromV3('Maimai', 'avatar-guest.png'),
            sub_icon1: '',
            sub_icon2: '',
            sub_banner: sub_banner,
            country: null,

            top1: user.name,
            top2: top2,

            left1: left1,
            left2: dan,
            right1: '',
            right2:  (user?.base > 0) ? 'Rating: ' + user.base  + ' + ' + user.additional : 'Rating:',
            right3b: user.rating,
            right3m: '',
        };
    },

    chunithmPlayer2CardA1: async (user = {
        name: 'Muz',
        probername: 'Muziya',
        rating: 12.51,
        base: 7.82,
        additional: 4.12,
        average: 12.65
    }) => {
        const background = getCHUNITHMRatingBG(user.rating);

        return {
            background: background,
            avatar: getImageFromV3('Chunithm', 'avatar-guest.png'),
            sub_icon1: '',
            sub_icon2: '',
            sub_banner: '',
            country: null,

            top1: user.name,
            top2: user.probername,

            left1: '',
            left2: (user?.average > 0) ? 'B30 Avg.: ' + getRoundedNumberStr(user.average, 3) : '',
            right1: '',
            right2:  (user?.base > 0) ? 'Rating: ' + getRoundedNumberStr(user.base, 3)  + ' + ' + getRoundedNumberStr(user.additional, 3) : 'Rating:',
            right3b: getRoundedNumberStrLarge(user.rating, 3),
            right3m: getRoundedNumberStrSmall(user.rating, 3),
        };
    },

    maimaiSong2CardA2: async (song = {}, has_deluxe = false, has_standard = false) => {
        const background = await getMaimaiCover(song?.id);

        const title1 = song?.basic_info?.title || '-'
        const title2 = song?.basic_info?.artist || '-'

        const left1 = song?.alias || ''
        const left2 = (song?.basic_info?.from || '-')
            .replaceAll("でらっくす", 'DX')
            .replaceAll(" PLUS", '+')
        const left3 = getMaimaiCategory(song?.basic_info?.genre)

        const right1 = song?.basic_info?.bpm ? ('BPM ' + song?.basic_info?.bpm.toString()) : ''

        let right3b, right3m
        let song_id = song?.id || 0

        if (has_deluxe && has_standard) {
            if (song_id < 10000) {
                // do nothing
            } else if (song_id >= 10000 && song_id < 100000) {
                song_id -= 10000
            } else if (song_id >= 100000 && song_id < 110000) {
                song_id -= 110000
            } else if (song_id >= 110000 && song_id < 120000) {
                song_id -= 120000
            } else if (song_id >= 120000 && song_id < 130000) {
                song_id -= 130000
            }

            if (song_id >= 1000) {
                right3b = "(1)"
            } else {
                right3b = "(10)"
            }

        } else {
            right3b = ''
        }

        right3m = song_id.toString()

        return {
            background: background,
            map_status: '',

            title1: title1,
            title2: title2,
            title3: '',
            title_font: '', // ?
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: "songID:",
            right3b: right3b,
            right3m: right3m,

            right3b_size: 36,
            right3m_size: 60,
        };
    },

    matchRating2CardA2: async (r = {}, beatmap = null) => {
        const redWins = r?.team_point_map?.red || 0;
        const blueWins = r?.team_point_map?.blue || 0;

        const isTeamVS = r?.is_team_vs;
        const star = getRoundedNumberStr(r?.average_star || 0, 3);

        const bid = r?.first_map_bid || 0
        const sid = beatmap?.beatmapset?.id || 0
        const background = (bid !== 0) ? await getDiffBG(r?.first_map_bid, sid, 'list@2x', false)
            : await getMapBG(sid, 'list@2x', hasLeaderBoard(beatmap?.ranked))

        const isContainVS = r?.match?.name.toLowerCase().match('vs');
        let title, title1, title2;
        if (isContainVS) {
            title = getMatchNameSplitted(r?.match?.name);
            title1 = title[0];
            title2 = title[1] + ' vs ' + title[2];
        } else {
            title1 = r?.match?.name;
            title2 = '';
        }

        const left1 = 'Rounds ' + r?.round_count;
        const left2 = 'Players ' + r?.player_count;
        const left3 = 'Scores ' + r?.score_count;

        const right1 = 'AVG.SR ' + star + '*';
        const right2 = 'MID ' + r?.match?.id || 0;
        const right3b = isTeamVS ? ((redWins + blueWins <= 0) ? 'TeamVs' : (redWins + ' : ' + blueWins)) : r?.round_count.toString()
        const right3m = isTeamVS ? '' : 'x';

        return {
            background: background,
            map_status: '',

            title1: title1,
            title2: title2,
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

    beatMap2CardA2: async (b) => {
        const background = await getMapBG(b.beatmapset.id, 'list@2x', hasLeaderBoard(b.ranked));
        const map_status = b.status;
        const title1 = b.beatmapset.title;
        const title2 = b.beatmapset.artist;
        const title3 = b.version;
        const left1 = '';
        const left2 = b.beatmapset.creator;
        const left3 = b.id ? 'B' + b.id : 'B0';
        const right1 = '';
        const right2 = getBeatmapStats(b);
        const right3b = getDecimals(b.difficulty_rating, 2);
        const right3m = getDecimals(b.difficulty_rating, 3) + '*';

        function getBeatmapStats(beatmap) {
            const cs = Math.round(beatmap.cs * 10) / 10;
            const ar = Math.round(beatmap.ar * 10) / 10;
            const od = Math.round(beatmap.accuracy * 10) / 10;
            const hp = Math.round(beatmap.drain * 10) / 10;

            switch (getGameMode(beatmap.mode_int, 1)) {
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
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },


    beatMapSet2CardA2: async (s) => {
        const background = await readNetImage(s?.covers?.cover, hasLeaderBoard(s?.ranked));
        const map_status = s?.status;
        const title1 = s?.title_unicode;
        const title2 = s?.artist_unicode;
        const title3 = s?.creator;
        const left1 = '';
        const left2 = getMapStatus(s?.ranked);
        const left3 = s?.id ? ('S' + s.id) : 'S0';
        const right1 = 'Favorite ' + s?.favourite_count;
        const right2 = 'Play Counts';
        const right3b = getRoundedNumberStrLarge(s?.play_count, 3);
        const right3m = getRoundedNumberStrSmall(s?.play_count, 3);

        return {
            background: background,
            map_status: map_status,

            title1: title1,
            title2: title2,
            title3: title3,
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    matchBeatMap2CardA2: async (b = {}) => {
        const background = await readNetImage(b?.beatmapset?.covers['cover@2x'], true);

        const title1 = b?.beatmapset?.title || 'Deleted Beatmap';
        const title2 = b?.beatmapset?.artist || '-';
        const title3 = b?.beatmapset?.creator || '-';
        const left2 = b?.version || '-';
        const left3 = 'b' + (b?.id || 0);

        const status = b?.status;
        let right2;

        switch (getGameMode(b?.mode_int, 1)) {
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
            left2: left2,
            left3: left3,
            map_status: status,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    searchResult2CardA2: async (total, cursor, search, result_count, rule, first_beatmapset, last_beatmapset) => {
        const background = cursor ?
            await getMapBG(cursor?.id, 'list@2x', true) : await readNetImage(first_beatmapset.covers?.list, true);
        const map_status = rule;
        const title1 = 'Search:';
        const title2 = search ? 'Sort: ' + search.sort : "Sort: Default";
        const title3 = '';
        const left1 = 'time duration:';

        const left2 = isNotNull(cursor) ? moment(parseInt(cursor.approved_date)).format("MM-DD HH:mm:ss") :
            (isNotNull(first_beatmapset.ranked_date) ?
                moment(first_beatmapset.ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours').format("YYYY-MM-DD HH:mm") : 'null');
        const left3 = (isNotNull(last_beatmapset.ranked_date) ?
            moment(last_beatmapset.ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]').add(8, 'hours').format("YYYY-MM-DD HH:mm") : 'null');
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
        const ranked = s?.ranked || -2;

        const background = await readNetImage(s?.covers['list@2x'], hasLeaderBoard(ranked));
        const map_status = s?.status || 'graveyard';

        const isQualified = ranked === 3;
        const isRanked = hasLeaderBoard(ranked) && ! isQualified;

        const title1 = s.title || 'Unknown Title';
        const title2 = s.artist || 'Unknown Artist';
        const title3 = s.creator || 'Unknown Mapper';
        const left1 = '';
        const left2 = '#' + rank || '#0';
        const left3 = 's' + s.id || 's0';
        const right1 = isQualified ? 'Expected:' :
            (isRanked ? 'Ranked:' :
                'Submitted:');

        const right2 = isQualified ? getApproximateRankedTime(ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]') :
            (isRanked ? moment(ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]').utcOffset(960).format("YYYY-MM-DD HH:mm") :
                moment(submitted_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]').utcOffset(960).format("YYYY-MM-DD HH:mm"));
        let right3b;
        let right3m;

        const days = getApproximateLeftRankedTime(ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]', 0);
        const hours = getApproximateLeftRankedTime(ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]', 1);
        const minutes = getApproximateLeftRankedTime(ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]', 2);

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

    // 给panel_A5用的
    score2CardH: async (s, identifier = 1, use_cache = null) => {
        const cache = requireNonNullElse(use_cache, hasLeaderBoard(s?.beatmap?.ranked || s?.beatmap?.status))

        const cover = await readNetImage(s?.beatmapset?.covers?.list, cache);
        const background = await readNetImage(s?.beatmapset?.covers?.cover, cache);
        const type = getScoreTypeImage(s.is_lazer)

        const time_diff = getTimeDifference(s.ended_at);

        let mods_width;
        switch (s?.mods?.length) {
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
                mods_width = 0;
        }

        const acc = getRoundedNumberStr((s?.legacy_accuracy * 100), 3) + '%'
        const combo = (s.max_combo || 0) + 'x'

        const difficulty_name = s.beatmap.version ? torus.cutStringTail(
            getDifficultyName(s.beatmap), 24,
            500 - 10 - mods_width - torus.getTextWidth('[] -   ()' + acc + combo + time_diff, 24), true) : '';

        const rank = s?.legacy_rank
        const color_index = (rank === 'SSH' || rank === 'SS' || rank === 'XH' || rank === 'X') ? '#2A2226' : '#fff';

        const artist = torus.cutStringTail(s.beatmapset.artist, 24,
            500 - 10 - mods_width - torus.getTextWidth(' // ' + s.beatmapset.creator, 24), true);

        const title2 = (s.beatmapset.title === s.beatmapset.title_unicode) ? null : s.beatmapset.title_unicode;
        const index_b = (s?.pp <= 10000) ? Math.round(s?.pp).toString() : getRoundedNumberStr(s?.pp, 1);

        // 这是大概的进度
        const approximate_progress = (s?.total_hit > 0) ? (s?.score_hit / s?.total_hit) : 1
        const index_l = (s?.passed === false || s?.legacy_rank === 'F') ? Math.round(approximate_progress * 100) + '%' : ''

        const star = s?.beatmap?.difficulty_rating || 0

        const star_color = getStarRatingColor(star)
        const color_label12 = (star < 4) ? '#000' : '#fff'

        return {
            background: background,
            cover: cover,
            type: type,

            title: s.beatmapset.title || '',
            title2: title2,
            left1: artist + ' // ' + s.beatmapset.creator,
            left2: '[' + difficulty_name + '] - ' + acc + ' ' + combo + ' (' + time_diff + ')',
            index_b: index_b,
            index_m: 'PP',
            index_l: index_l,
            index_b_size: 48,
            index_m_size: 36,
            index_l_size: 24,
            label1: getRoundedNumberStr(star, 2),
            label2: s?.beatmap?.id?.toString() || '',
            label3: '',
            label4: '',
            label5: '#' + identifier,
            mods_arr: s.mods || [],

            color_title2: '#bbb',
            color_right: getRankColor(s?.legacy_rank),
            color_left: star_color,
            color_index: color_index,
            color_label1: star_color,
            color_label2: star_color,
            color_label3: '',
            color_label4: '',
            color_label5: star_color,
            color_label12: color_label12,
            color_left12: '#bbb',

            font_title2: 'PuHuiTi',
            font_label4: 'torus',
        }
    },

    // panel A7 有细微的改动，请注意
    fixedBestScore2CardH: async (s, rank = 1, rank_after = null) => {
        let mods_width;
        switch (s?.mods?.length) {
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
                mods_width = 0;
        }

        const is_after = (typeof rank_after == "number")

        const card_h = await PanelGenerate.score2CardH(s, rank, true)

        if (is_after) {
            const time_diff = getTimeDifference(s.ended_at);
            const rank_after_str = ' -> ' + rank_after;
            const difficulty_name = s.beatmap.version ?
                torus.cutStringTail(getDifficultyName(s.beatmap), 24,
                    500 - 10 - mods_width - torus.getTextWidth('[] - BP ()' + rank + rank_after_str + time_diff, 24), true)
                : '';

            return {
                ...card_h,
                left2: '[' + difficulty_name + '] - BP' + rank + rank_after_str + ' (' + time_diff + ')',
            }
        } else {
            return card_h
        }
    },

    bp2CardJ: async (bp) => {
        const background = await getMapBG(bp.beatmapset.id, 'list@2x', hasLeaderBoard(bp.beatmap.ranked));

        return {
            cover: background,
            background: background,
            type: getScoreTypeImage(bp.is_lazer),

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
                        icon: getImageFromV3("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: getDecimals(beatmap.cs, 2),
                        data_m: getDecimals(beatmap.cs, 3)
                    },
                    label2: {
                        icon: getImageFromV3("object-score-approachrate.png"),
                        icon_title: 'AR',
                        data_b: getDecimals(beatmap.ar, 2),
                        data_m: getDecimals(beatmap.ar, 3)
                    },
                    label3: {
                        icon: getImageFromV3("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: getDecimals(beatmap.accuracy, 2),
                        data_m: getDecimals(beatmap.accuracy, 3)
                    },

                    maxWidth: label_width,
                };

            case 't' :
                return {
                    label1: {
                        icon: getImageFromV3("object-score-overalldifficulty.png"),
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
                        icon: getImageFromV3("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: getDecimals(beatmap.drain, 2),
                        data_m: getDecimals(beatmap.drain, 3)
                    },

                    maxWidth: label_width,
                };

            case 'c':
                return {
                    label1: {
                        icon: getImageFromV3("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: getDecimals(beatmap.cs, 2),
                        data_m: getDecimals(beatmap.cs, 3)
                    },
                    label2: {
                        icon: getImageFromV3("object-score-approachrate.png"),
                        icon_title: 'AR',
                        data_b: getDecimals(beatmap.ar, 2),
                        data_m: getDecimals(beatmap.ar, 3)
                    },
                    label3: {
                        icon: getImageFromV3("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: getDecimals(beatmap.drain, 2),
                        data_m: getDecimals(beatmap.drain, 3)
                    },

                    maxWidth: label_width,
                };

            case 'm' :
                return {
                    label1: {
                        icon: getImageFromV3("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: getDecimals(beatmap.cs, 2),
                        data_m: getDecimals(beatmap.cs, 3)
                    },
                    label2: {
                        icon: getImageFromV3("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: getDecimals(beatmap.accuracy, 2),
                        data_m: getDecimals(beatmap.accuracy, 3)
                    },
                    label3: {
                        icon: getImageFromV3("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: getDecimals(beatmap.drain, 2),
                        data_m: getDecimals(beatmap.drain, 3)
                    },
                };
        }
    },

    user2CardO1: async (user) => {
        const background = await getBanner(user?.cover_url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        return {
            background,
            avatar,

            name: user?.username || (user?.id ? "ID: " + user?.id : "Unknown"),
            groups: user?.groups || [],
        };
    },

    beatmap2CardO2: async (s) => {
        if (!s) return '';

        const background = await getMapBG(s?.id, 'list', hasLeaderBoard(s.status));
        const map_status = s?.status;
        const title1 = s?.title_unicode || s?.title;
        const title2 = s?.artist_unicode || s?.artist;
        const left1 = '';
        const left2 = '*' + s?.favourite_count;
        const left3 = s?.id ? 'S' + s.id : '0';
        const right1 = 'Play Counts';
        const right2b = getRoundedNumberStrLarge(s?.play_count, 2);
        const right2m = getRoundedNumberStrSmall(s?.play_count, 2);

        return {
            background: background,
            map_status: map_status,

            title1: title1,
            title2: title2,
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2b: right2b,
            right2m: right2m,
        };
    },
}