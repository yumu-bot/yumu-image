import {cutStringTail, PuHuiTi, torus} from "./font.js";
import moment from "moment";
import {
    getImageFromV3,
    getGameMode,
    getMapStatus,
    getMatchNameSplitted,
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
    getKeyDifficulty,
    isNotEmptyString,
    floor,
    floors,
    getFormattedTime,
    getTimeDifferenceShort,
    getMapBackground, getDiffBackground, getTime, thenPush, round, rounds,
} from "./util.js";
import {getBadgeColor, getRankColor, getRankColors, getStarRatingColor, getStarRatingColors} from "./color.js";
import {
    getScoreTypeImage,
    hasLeaderBoard,
} from "./star.js";
import {
    getCHUNITHMRatingBG,
    getMaimaiCategory,
    getMaimaiCover, getMaimaiDifficultyColor, getMaimaiDXStarLevel,
    getMaimaiMaximumRating,
    getMaimaiPlate, getMaimaiRankBG,
    getMaimaiRatingBG, getMaimaiType
} from "./maimai.js";
import {getRandomBannerPath} from "./mascotBanner.js";
import {PanelDraw} from "./panelDraw.js";
import {card_H2} from "../card/card_H2.js";
import {getLazerModsWidth} from "./mod.js";

//公用方法
//把参数变成面板能读懂的数据
export const PanelGenerate = {
    // panel A7 有细微的改动，请注意

    /**
     *
     * @param {{} | null} user
     * @param historyUser
     */
    user2CardA1: async (user, historyUser) => {
        if (isNullOrEmptyObject(user)) return {
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


        /**
         * @type {string}
         */
        const background = user?.profile?.card || await getBanner(user?.cover_url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        const sub_icon1 = user?.is_supporter ? getImageFromV3('object-card-supporter.png') : '';
        const country = user?.country?.code || 'CN';

        const is_team_member = user.team != null

        const left1 = user?.statistics?.global_rank ? ('#' + user.statistics.global_rank) :
            (user?.rank_highest?.rank ?
                '#' + user.rank_highest.rank + '^ (' + getTimeDifference(user.rank_highest.updated_at) + ')' :
                    '#0');
        const left2 = country + (user?.statistics?.country_rank ? ('#' + user.statistics.country_rank) : '');

        const isBot = user?.is_bot;
        const level = user?.statistics?.level_current || 0;
        const progress = user?.statistics?.level_progress || 0;
        const acc = floor(user?.statistics?.hit_accuracy, 2) || '0';
        const right2 = isBot ? '' : (level + progress > 0 ? (acc + '% Lv.' + level + '(' + progress + '%)') : acc + '%')
        const right3b = isBot ? 'Bot' : (user?.pp ? Math.round(user?.pp).toString() : '');
        const right3m = isBot ? '' : (user?.pp ? 'PP' :
            (user?.statistics?.level_current === 1 && user?.statistics?.level_progress === 0 ? 'NOT PLAYED' : 'AFK'));

        //历史记录功能！
        const pp_d = (historyUser != null) ? Math.round((user.pp - historyUser?.statistics?.pp) * 100) / 100 : 0
        const right1 = (pp_d > 0) ? '+' + pp_d + 'PP' :
            ((pp_d < 0) ? pp_d + 'PP' : (is_team_member ? '[' + user.team.short_name + ']' : ''))

        return {
            background: background,
            avatar: avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            sub_banner: '',
            country: country,
            team_url: user?.team?.flag_url,

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
            background: background,
            avatar: avatar,
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

        const left1 = user?.statistics?.global_rank ? ('#' + user.statistics.global_rank) : '#0';
        const left2 = country + ' ' + (user?.id?.toString() || '0');
        // (user.statistics.country_rank ? '#' + user.statistics.country_rank : '#-') microUser 没有country rank

        const isBot = user.is_bot;
        const level = user?.statistics?.level_current || 0;
        const progress = user?.statistics?.level_progress || 0;
        const acc = floor(user?.statistics?.hit_accuracy, 2) || '0';

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
        const right2 = isBot ? '' : (level + progress > 0 ? (acc + '% Lv.' + level + '(' + progress + '%)') : acc + '%')
        const right3b = isBot ? '' : (user?.statistics?.pp ? Math.round(user.statistics.pp).toString() : '');
        const right3m = isBot ? 'Bot' : (user?.statistics?.pp ? 'PP' : 'AFK');

        return {
            background: background,
            avatar: avatar,
            sub_icon1: sub_icon1,
            sub_icon2: sub_icon2,
            sub_banner: '',

            country: country,
            team_url: null,

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

    microTeamMember2CardA1: async (user, is_leader = false) => {
        const background = await getBanner(user?.cover?.url, true);
        const avatar = await getAvatar(user?.avatar_url, true);

        const sub_icon1 = (user.is_supporter) ? getImageFromV3('object-card-supporter.png') : ''

        const country = user?.country_code || 'CN';

        const is_secret = user?.last_visit == null

        const left1 = '[' + (user?.team?.short_name || '?') + ']'
        const right1 = '(' + (is_secret ? '?' : getTimeDifference(user?.last_visit)) + ')'
        const left2 = is_leader ? 'leader' : 'member'
        const right2 = 'last visit: ' + (is_secret ? '?' : getFormattedTime(user?.last_visit, 'YYYY-MM-DD HH:mm'))
        const right3m = (user.is_online === true) ? 'Online' : 'Offline'

        return {
            background: background,
            avatar: avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            sub_banner: '',

            country: country,
            team_url: user?.team?.flag_url,

            top1: user?.username,
            left1: left1,
            left2: left2,
            right1: right1,
            right2: right2,
            right3m: right3m,
        }
    },

    /*
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

        const mods_arr = score?.mods ?? [];
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
        const score_number = floors(player_score, -4)

        const top1 = score?.user?.username || score?.user_name || 'Unknown';

        const left1 = score?.user?.country?.name || 'Unknown';
        const left2 = 'P' + (score?.match?.slot + 1) + rating_str + pp_str;
        const right2 = acc_str + ' '
            + rank + mods + ' ' + combo_str;
        const right3b = score_number.integer
        const right3m = score_number.decimal

        return {
            background: background,
            avatar: avatar,
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

     */

    maiPlayer2CardA1: async (user) => {
        if (isNullOrEmptyObject(user)) return {
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

        const background = getMaimaiRatingBG(user?.rating);

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

    chuPlayer2CardA1: async (user = {
        name: 'Muz',
        probername: 'Muziya',
        rating: 12.51,
        base: 7.82,
        additional: 4.12,
        average: 12.65
    }) => {
        const background = getCHUNITHMRatingBG(user.rating);
        const rating = rounds(user.rating, 2)

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
            left2: (user?.average > 0) ? 'B30 Avg.: ' + floor(user.average, 2) : '',
            right1: '',
            right2:  (user?.base > 0) ? 'Rating: ' + floor(user.base, 2)  + ' + ' + floor(user.additional, 2) : 'Rating:',
            right3b: rating.integer,
            right3m: rating.decimal,
        };
    },

    guest2CardA1: async (data = {
        user: {
            cover: {
                url: 'https://assets.ppy.sh/user-profile-covers/416662/ab631986bb61f181551b8dbea87285874d09a920584bd5ff0250410b2b44a9a3.jpeg',
                custom_url: 'https://assets.ppy.sh/user-profile-covers/416662/ab631986bb61f181551b8dbea87285874d09a920584bd5ff0250410b2b44a9a3.jpeg'
            },
            user_id: 416662,
            avatar_url: 'https://a.ppy.sh/416662?1718654531.jpeg',
            default_group: 'default',
            id: 416662,
            is_active: false,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: false,
            pm_friends_only: false,
            username: 'Hollow Wings',
            country_code: 'CN',
            country: { code: 'CN', name: 'China' },
            is_mutual: false,
            statistics_rulesets: {}
        },
        received: 0,
        received_ranked: 0,
        sent: 5,
        sent_ranked: 5,
    }) => {
        const user = data.user

        const background = await readNetImage(user.cover.url, true, getRandomBannerPath());
        const avatar = await getAvatar(user.avatar_url, true)


        let sub_icon1 = ''

        if (user.is_supporter) {
            sub_icon1 = getImageFromV3('object-card-supporter.png')
        }

        let right3b = ''
        let right3m = '-'

        if ((data?.sent_ranked || 0) + (data?.received_ranked || 0) > 0) {
            right3b = data?.sent_ranked || '0'
            right3m = ' [' + (data?.received_ranked || '0') + ']'
        }


        return {
            background: background,
            avatar: avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            sub_banner: '',
            country: user.country_code,

            top1: user.username,
            top2: '',

            left1: 'sent to: ' + data.sent,
            left2: 'received from: ' + data.received,
            right1: 'Ranked GDs:',
            right2: '(sent [received])',
            right3b: right3b,
            right3m: right3m,
        };
    },

    maiSong2CardA2: async (song = {}, version = "ANY") => {
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

        if (version === "ANY") {
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
            } else if (song_id >= 100) {
                right3b = "(10)"
            } else if (song_id >= 10) {
                right3b = "(100)"
            } else {
                right3b = "(1000)"
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

    matchRating2CardA2: async (match = {}, beatmap = null, is_match_start = false) => {
        const red_wins = match?.team_point_map?.red || 0;
        const blue_wins = match?.team_point_map?.blue || 0;

        const stat = match?.match
        const is_team_vs = match?.is_team_vs;
        const star = floor(match?.average_star || 0, 2);

        const sid = match?.first_map_sid || beatmap?.beatmapset?.id || 0
        const background = beatmap != null ? await getDiffBackground(beatmap) :
            await readNetImage('https://assets.ppy.sh/beatmaps/' + sid + '/covers/list.jpg', true)

        const split = getMatchNameSplitted(stat?.name)

        let title2;
        const title1 = split.name;
        if (isNotEmptyString(split.team1)) {
            title2 = split.team1 + ' vs ' + split.team2;
        } else {
            title2 = '';
        }

        const left1 = 'Round: ' + match?.round_count;
        const left2 = 'Player: ' + match?.player_count;
        const left3 = 'Score: ' + match?.score_count;

        const right1 = 'Average Star ' + star + '*';
        const right2 = 'MID ' + stat?.id || 0;

        if (match.is_skipping === true) {
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
                right3b: '',
                right3m: 'Warm Up',
                isTeamVS: is_team_vs,
            };
        }

        const right3b = is_team_vs ? ((red_wins + blue_wins <= 0) ? 'TeamVs' : (red_wins + ' : ' + blue_wins)) :
            (match?.round_count + (is_match_start ? 1 : 0)).toString()
        const right3m = is_team_vs ? '' : 'x';

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
            isTeamVS: is_team_vs,
        };
    },

    beatmap2CardA2: async (b) => {
        const background = await getMapBackground(b, 'list');
        const map_status = b.status;
        const sr = floors(b.difficulty_rating, 2)
        const title1 = b.beatmapset.title;
        const title2 = b.beatmapset.artist;
        const title3 = b.version;
        const left1 = '';
        const left2 = b.beatmapset.creator;
        const left3 = b.id ? 'B' + b.id : 'B0';
        const right1 = '';
        const right2 = getBeatmapStats(b);
        const right3b = sr.integer
        const right3m = sr.decimal + '*';

        function getBeatmapStats(beatmap) {
            const cs = round(beatmap.cs, 1);
            const ar = round(beatmap.ar, 1);
            const od = round(beatmap.od, 1);
            const hp = round(beatmap.hp, 1);

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

            right3b_size: 60,
            right3m_size: 48,
        };
    },


    beatMapSet2CardA2: async (s) => {
        const background = await readNetImage(s?.covers?.cover, hasLeaderBoard(s?.ranked));
        const map_status = s?.status;
        const play_count = floors(s?.play_count, 2);
        const title1 = s?.title_unicode;
        const title2 = s?.artist_unicode;
        const title3 = s?.creator;
        const left1 = '';
        const left2 = getMapStatus(s?.ranked);
        const left3 = s?.id ? ('S' + s.id) : 'S0';
        const right1 = 'Favorite ' + s?.favourite_count;
        const right2 = 'Play Counts';
        const right3b = play_count.integer
        const right3m = play_count.decimal

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

        const sr = floors(b?.difficulty_rating, 2)

        const right3b = sr.integer
        const right3m = sr.decimal + '*';

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
            await readNetImage('https://assets.ppy.sh/beatmaps/' + cursor?.id + '/covers/list.jpg', true) :
            await readNetImage(first_beatmapset?.covers?.list || last_beatmapset?.covers?.list, true);
        const map_status = rule;
        const title1 = 'Search:';
        const title2 = search ? 'Sort: ' + search.sort : "Sort: Default";
        const title3 = '';
        const left1 = 'time duration:';

        const left2 = isNotNull(cursor) ? moment(parseInt(cursor.approved_date)).format("MM-DD HH:mm:ss") :
            (isNotNull(first_beatmapset?.ranked_date) ?
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
        const ranked = s?.ranked ?? -2;

        const has_leaderboard = hasLeaderBoard(ranked)

        const background = await readNetImage(s?.covers['list@2x'], has_leaderboard);

        const map_status = s?.status || 'graveyard';

        const isQualified = ranked === 3;
        const isRanked = has_leaderboard && ! isQualified;

        const title1 = s.title_unicode || 'Unknown Title';
        const title2 = s.artist_unicode || 'Unknown Artist';
        const title3 = s.creator || 'Unknown Mapper';
        const left1 = '';
        const left2 = '#' + rank || '#0';
        const left3 = 's' + s.id || 's0';

        const right1 = isQualified ? 'Expected:' : (isRanked ? 'Ranked:' : 'Submitted:')

        const right2 = (isQualified || isRanked) ? getFormattedTime(ranked_date) : getFormattedTime(submitted_date)

        let right3b;
        let right3m;

        if (isQualified) {
            const now = moment().subtract(8, 'hours')
            const expected = moment(ranked_date, 'YYYY-MM-DD[T]HH:mm:ss[Z]')

            const days = expected.diff(now, "days")
            const hours = expected.diff(now, "hours") % 24
            const minutes = expected.diff(now, "minutes") % 60

            if (expected.isBefore(now)) {
                right3b = '...';
                right3m = '';
            } else if (days > 0) {
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
    },

    team2CardA2: async (team) => {
        const background = await readNetImage(team.flag)

        const title1 = team?.name || 'Team'
        const title2 = (team?.application?.toLowerCase() || '?') + ' // ' + getGameMode(team?.ruleset, 2)

        const left1 = 'RKS: ' + (team?.ranked_score || 0)
        const left2 = 'PC: ' + Math.round(team?.play_count || 0)
        const left3 = getFormattedTime(team.formed, "YYYY-MM", "MMMM YYYY") // Open Close

        const right1 = 'TeamID: #' + (team?.id || 0).toString()
        const right2 = 'Rank: #' + (team.rank || '0')
        const right3b = Math.round(team?.pp || 0).toString()
        const right3m = 'PP'

        return {
            background: background,
            map_status: '',

            title1: title1,
            title2: title2,
            title_font: torus,
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    /**
     * 注意，这个方法直接返回生成好的 card_H2
     * @param scores
     * @param has_custom_panel
     * @param hue
     * @return {Promise<{scores: *[], has_custom_panel: boolean, hue: number}>}
     */
    score2CardH2: async (scores = [], has_custom_panel = false, hue = 342) => {
        let promiseHs = []
        let h2s = []

        for (const s of scores) {
            const star = s?.beatmap?.difficulty_rating || 0
            const star_rrect_color = getStarRatingColor(star)
            const star_text_color = (star < 4) ? '#1c1719' : '#fff'

            const rank = s?.legacy_rank || 'F'
            const rank_rrect_color = getRankColor(rank)
            const rank_text_color = (rank === 'X' || rank === 'XH') ? '#1c1719' : '#fff';

            const time = getTime(s?.beatmap?.total_length)

            const data = {
                background: await getMapBackground(s, 'list'),
                title: Math.round(s?.pp).toString() || '0',
                title_m: 'PP',

                left: floor(star, 2),
                left_color: star_text_color,
                left_rrect_color: star_rrect_color,

                right: rank,
                right_color: rank_text_color,
                right_rrect_color: rank_rrect_color,

                bottom_left: s?.beatmap_id.toString() || '0',
                bottom_right: time.minute + ":" + time.seconds,
            }

            promiseHs.push(card_H2(data))
        }

        await Promise.allSettled(
            promiseHs
        ).then(results => thenPush(results, h2s))

        return {
            scores: h2s,
            has_custom_panel: has_custom_panel,
            hue: hue,
        }
    },

    score2CardC: async (s, identifier = 1, use_cache = null) => {
        const cache = requireNonNullElse(use_cache, hasLeaderBoard(s?.beatmap?.ranked ?? s?.beatmap?.status))

        const cover = await readNetImage(s?.beatmapset?.covers?.list, cache);
        const background = await readNetImage(s?.beatmapset?.covers?.cover, cache);
        const type = getScoreTypeImage(s.is_lazer)

        const time_diff = getTimeDifferenceShort(s.ended_at, 0);

        let mods_width = getLazerModsWidth(s?.mods, 60, 160, 'right', 6, true, false)

        const acc = floor((s?.legacy_accuracy * 100), 2) + '%'
        const combo = (s.max_combo || 0) + 'x'

        const difficulty_name = s.beatmap.version ? torus.cutStringTail(
            getKeyDifficulty(s.beatmap), 24,
            500 - 10 - mods_width - torus.getTextWidth('[] -   ()' + acc + combo + time_diff, 24), true) : '';

        const rank = s?.legacy_rank
        const color_index = (rank === 'SSH' || rank === 'SS' || rank === 'XH' || rank === 'X') ? '#2A2226' : '#fff';

        const artist = torus.cutStringTail(s.beatmapset.artist, 24,
            500 - 10 - mods_width - torus.getTextWidth(' // ' + s.beatmapset.creator, 24), true);

        const title2 = (s.beatmapset.title === s.beatmapset.title_unicode) ? '' : (s?.beatmapset?.title_unicode || '');
        const index_b = (s?.pp <= 10000) ? Math.round(s?.pp).toString() : floor(s?.pp, 1, -1);

        // 这是大概的进度
        const approximate_progress = (s?.total_hit > 0) ? (s?.score_hit / s?.total_hit) : 1
        const index_l = (s?.passed === false || rank === 'F') ? Math.round(approximate_progress * 100) + '%' : ''

        const star = s?.beatmap?.difficulty_rating || 0
        const star_color = getStarRatingColor(star)
        const star2_color = getStarRatingColors(star)
        const rank2_color = getRankColors(rank)

        const color_label12 = (star < 4) ? '#1c1719' : '#fff'

        const label2 = s?.beatmap?.id?.toString() || ''

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
            label1: floor(star, 1),
            label2: label2,
            label3: '',
            label4: '',
            label5: '#' + identifier,
            mods_arr: s.mods ?? [],

            color_title2: '#bbb',
            color_right: rank2_color,
            color_left: star2_color,
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

    fixedBestScore2CardC: async (s, rank = 1, rank_after = null) => {
        let mods_width = getLazerModsWidth(s?.mods, 60, 160, 'right', 6, true, false)

        /*
        switch (s?.mods?.length) {
            case 0:
                mods_width = 0;
                break;
            case 1:
                mods_width = 100;
                break;
            default:
                mods_width = 160;
        }

         */

        const is_after = (typeof rank_after == "number")

        const card_c = await PanelGenerate.score2CardC(s, rank, true)

        if (is_after) {
            const time_diff = getTimeDifferenceShort(s.ended_at, 0);
            const rank_after_str = ' -> ' + rank_after;
            const difficulty_name = s.beatmap.version ?
                torus.cutStringTail(getKeyDifficulty(s.beatmap), 24,
                    500 - 10 - mods_width - torus.getTextWidth('[] - BP ()' + rank + rank_after_str + time_diff, 24), true)
                : '';

            return {
                ...card_c,
                left2: '[' + difficulty_name + '] - BP' + rank + rank_after_str + ' (' + time_diff + ')',
            }
        } else {
            return card_c
        }
    },

    badge2CardC2: async (badge = {
        "awarded_at": "2022-07-03T15:23:25+00:00",
        "description": "osu!catch World Cup 2022 3rd Place (China)",
        "image@2x_url": "https://assets.ppy.sh/profile-badges/cwc-2022/cwc2022-3rd@2x.png",
        "image_url": "https://assets.ppy.sh/profile-badges/cwc-2022/cwc2022-3rd.png",
        "url": "https://osu.ppy.sh/wiki/en/Tournaments/CWC/2022"
    }, index = 0) => {
        const title = badge?.description || ""
        const image_url = isNotEmptyString(badge?.["image@2x_url"]) ? badge?.["image@2x_url"] : badge?.image_url;
        const image = await readNetImage(image_url, true);

        let title_cut = cutStringTail("torus", title, 36, 610, false);
        let title_exceed;

        if (title_cut.length === title.toString().length) {
            title_exceed = '';
        } else {
            title_exceed = title.toString().substring(title_cut.length);
        }

        const index_text = index > 0 ? ('#' + index) : ''
        const left2 = index_text + ' // award at: ' + getFormattedTime(badge?.awarded_at, 'YYYY-MM-DD HH:mm:ss +8', 'YYYY-MM-DD[T]HH:mm:ssZ') + ' (' + getTimeDifference(badge?.awarded_at, 'YYYY-MM-DD[T]HH:mm:ssZ', moment().subtract(8, "hours"), true) + ')'

        const color = getBadgeColor(badge?.description)

        return {
            background: image,
            cover: image,

            title: title_cut,
            left1: title_exceed,
            left2: left2,

            label1: '',
            label2: '',

            color_rrect: color,
            color_title_text: '#fff',
            color_label_rrect1: '',
            color_label_rrect2: '',
            color_label_text: '#fff',
            color_left1_text: '#fff',
            color_left2_text: '#bbb',
        }
    },

    skill2CardK: async (skill = {score: {}, skill: []}) => {
        const background = await getMapBackground(skill.score, 'list');

        return {
            background: background,
            star: skill?.score?.beatmap?.difficulty_rating || 0,
            skill: skill?.skill,
            skill_color: '#fff',
            hexagon_color: '#bbb',
            mods: skill?.score?.mods,
            rank: skill?.score?.rank,
        }
    },

    bp2ComponentJ: async (bp) => {
        const background = await getMapBackground(bp, 'list');

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
            mods_arr: bp.mods ?? [],
            pp: Math.round(bp.pp) || 0 //pp
        }
    },

    maiScore2CardI3: async (score = {
        "achievements": 100.5133,
        "ds": 10.4,
        "dxScore": 1125,
        "fc": "fc",
        "fs": "sync",
        "level": "10",
        "level_index": 2,
        "level_label": "Expert",
        "ra": 234,
        "rate": "sssp",
        "song_id": 10319,
        "title": "幻想のサテライト",
        "alias": "幻想的卫星",
        "artist": "豚乙女",
        "charter": "mai-Star",
        "type": "DX",
        "max": 234,
        "position": 0,
    }) => {
        const achievement_text = (score?.achievements || 0).toFixed(4).toString()

        const rating = Math.round(score?.ra || 0)
        const rating_max = getMaimaiMaximumRating(score?.ds)
        const rating_max_text = (rating >= rating_max) ? (' [MAX]') : (' [' + rating_max + ']')

        const too_bright = (score?.level_index || 0) === 4 || (score?.level_index || 0) === 1;

        const difficulty_color = getMaimaiDifficultyColor(score?.level_index || 0)

        function drawCombo(combo = '') {
            let combo_image

            switch (combo) {
                case 'fc': combo_image = 'fullcombo'; break;
                case 'fcp': combo_image = 'fullcomboplus'; break;
                case 'ap': combo_image = 'allperfect'; break;
                case 'app': combo_image = 'allperfectplus'; break;
                default: combo_image = 'clear'; break;
            }

            return PanelDraw.Image(0, 0, 27, 30, getImageFromV3('Maimai', `object-icon-combo-${combo_image}.png`))
        }

        function drawSync(sync = '') {
            let sync_image;
            switch (sync) {
                case 'sync': sync_image = 'sync'; break;
                case 'fs': sync_image = 'fullsync'; break;
                case 'fsp': sync_image = 'fullsyncplus'; break;
                case 'fsd': sync_image = 'fullsyncdx'; break;
                case 'fsdp': sync_image = 'fullsyncdxplus'; break;
                default: sync_image = 'solo'; break;
            }

            return PanelDraw.Image(0, 0, 27, 30, getImageFromV3('Maimai', `object-icon-sync-${sync_image}.png`))
        }

        let difficulty

        if (score?.ds <= 0) {
            difficulty = score?.level || '?'
        } else {
            difficulty = score?.ds?.toString() || '?'
        }

        return {
            background: getMaimaiRankBG(score?.rate || ''),
            cover: await getMaimaiCover(score?.song_id || 0),
            rank: getImageFromV3('Maimai', `object-score-${score?.rate || 'd'}2.png`),
            type: getMaimaiType(score?.type),
            level: getMaimaiDXStarLevel(score?.dxScore, score?.max),

            title: score?.title || '',
            title2: score?.alias || '',
            left1: score?.artist || '',
            left2: score?.charter || '',
            left3: rating.toString(),
            left4: rating_max_text,
            index_b: achievement_text.slice(0, -3),
            index_m: achievement_text.slice(-3),
            index_r: '%',
            index_b_size: 32,
            index_m_size: 20,
            index_r_size: 18,
            label1: difficulty,
            label2: score?.position >= 1 ? ('#' + score.position) : '',
            label3: score?.song_id?.toString() || '?',

            color_text: '#fff',
            color_label1: too_bright ? '#1c1719' : '#fff',
            color_label2: too_bright ? '#1c1719' : '#fff',
            color_label3: too_bright ? '#1c1719' : '#fff',

            color_left: difficulty_color,
            color_rrect1: difficulty_color,
            color_rrect2: difficulty_color,
            color_rrect3: difficulty_color,

            component1: drawCombo(score?.fc),
            component2: drawSync(score?.fs),
            component3: '',

            left3_is_right: false,
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
                        data_b: floors(beatmap.cs, 1).integer,
                        data_m: floors(beatmap.cs, 1).decimal,
                    },
                    label2: {
                        icon: getImageFromV3("object-score-approachrate.png"),
                        icon_title: 'AR',
                        data_b: floors(beatmap.ar, 1).integer,
                        data_m: floors(beatmap.ar, 1).decimal,
                    },
                    label3: {
                        icon: getImageFromV3("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: floors(beatmap.od, 1).integer,
                        data_m: floors(beatmap.od, 1).decimal,
                    },

                    max_width: label_width,
                };

            case 't' :
                return {
                    label1: {
                        icon: getImageFromV3("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: floors(beatmap.od, 1).integer,
                        data_m: floors(beatmap.od, 1).decimal
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
                        data_b: floors(beatmap.hp, 1).integer,
                        data_m: floors(beatmap.hp, 1).decimal
                    },

                    max_width: label_width,
                };

            case 'c':
                return {
                    label1: {
                        icon: getImageFromV3("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: floors(beatmap.cs, 1).integer,
                        data_m: floors(beatmap.cs, 1).decimal,
                    },
                    label2: {
                        icon: getImageFromV3("object-score-approachrate.png"),
                        icon_title: 'AR',
                        data_b: floors(beatmap.ar, 1).integer,
                        data_m: floors(beatmap.ar, 1).decimal,
                    },
                    label3: {
                        icon: getImageFromV3("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: floors(beatmap.hp, 1).integer,
                        data_m: floors(beatmap.hp, 1).decimal
                    },

                    max_width: label_width,
                };

            case 'm' :
                return {
                    label1: {
                        icon: getImageFromV3("object-score-circlesize.png"),
                        icon_title: 'CS',
                        data_b: floors(beatmap.cs, 1).integer,
                        data_m: floors(beatmap.cs, 1).decimal,
                    },
                    label2: {
                        icon: getImageFromV3("object-score-overalldifficulty.png"),
                        icon_title: 'OD',
                        data_b: floors(beatmap.od, 1).integer,
                        data_m: floors(beatmap.od, 1).decimal,
                    },
                    label3: {
                        icon: getImageFromV3("object-score-healthpoint.png"),
                        icon_title: 'HP',
                        data_b: floors(beatmap.hp, 1).integer,
                        data_m: floors(beatmap.hp, 1).decimal
                    },

                    max_width: label_width,
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

    beatmap2ComponentIM: async (s) => {
        if (!s) return '';

        const background = await readNetImage(s?.covers?.list, true);
        const map_status = s?.status;
        const play_count = floors(s?.play_count, 1)
        const title1 = s?.title_unicode || s?.title;
        const title2 = s?.artist_unicode || s?.artist;
        const left1 = '';
        const left2 = '*' + s?.favourite_count;
        const left3 = s?.id ? 'S' + s.id : '0';
        const right1 = 'Play Counts';
        const right2b = play_count.integer
        const right2m = play_count.decimal

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