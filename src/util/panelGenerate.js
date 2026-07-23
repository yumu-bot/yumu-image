import {cutStringTail, PuHuiTi, torus} from "./font.js";
import moment from "moment";
import {
    getGameMode,
    getMapStatus,
    getTimeDifference,
    readNetImage,
    getAvatar,
    getBanner,
    isNullOrEmptyObject,
    isNotNull,
    isNotEmptyArray,
    getTimeByDHMS,
    getKeyDifficulty,
    floor,
    floors,
    getFormattedTime,
    getTimeDifferenceShort,
    getMapBackground, getDiffBackground, getTime, thenPush, round, rounds, getImageFromV3, getImageOrElse,
    getIndexOrNull, normalize, getRatioString, od2ms, ar2ms, cs2px,
} from "./util.js";
import {
    colorArray,
    getBadgeColor, getGlobalRankPercentColor, getPlayerClassBackground, getPlayerClassColors,
    getRankColor,
    getRankColors,
    getStarRatingColor,
    getStarRatingColors
} from "./color.js";
import {
    getOsuDXRatingStar,
    getScoreTypeImage,
    hasLeaderBoard, rankSS2X,
} from "./star.js";
import {
    getCHUNITHMRatingBG,
    getMaimaiCategory,
    getMaimaiCover, getMaimaiDifficultyColor, getMaimaiDXStarLevel,
    getMaimaiMaximumRating, getMaimaiPlate,
    getMaimaiRankBG,
    getMaimaiRatingBG, getMaimaiType
} from "./maimai.js";
import {PanelDraw} from "./panelDraw.js";
import {card_D2} from "../card/card_D2.js";
import {getLazerModsWidth} from "./mod.js";
import {getBannerLocal} from "./mascotBanner.js";
import {splitMatchName, isASCII, isNotBlankString, isNotEmptyString} from "./text.js";
import {LABELS} from "../component/label.js";

//公用方法
//把参数变成面板能读懂的数据
export const PanelGenerate = {
    // panel A7 有细微的改动，请注意

    /**
     *
     * @param {{} | null} user
     * @param historyUser
     * @param avatar 如果下好了图片，发这里
     * @param background 如果下好了图片，发这里
     */
    user2CardA1: (user, historyUser = null, avatar = null, background = null) => {
        if (isNullOrEmptyObject(user)) return {
            background: getImageFromV3('card-default.webp'),
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
        const bg = background ?? user?.profile?.card ?? user?.cover_url ?? user?.cover?.url

        /**
         * @type {string}
         */
        const av = avatar ?? user?.avatar_url;

        const sub_icon1 = user?.is_supporter ? getImageFromV3('object-card-supporter.png') : '';
        const country = user?.country?.code || 'CN';

        const is_team_member = user.team != null

        let left1_colors = getGlobalRankPercentColor(user?.statistics?.global_rank, user?.statistics?.global_rank_percent)

        const left1 = user?.statistics?.global_rank ? ('#' + user.statistics.global_rank) :
            (user?.rank_highest?.rank ?
                '#' + user.rank_highest.rank + '^ (' + getTimeDifference(user.rank_highest.updated_at) + ')' :
                    '#0');
        const left2 = country + (user?.statistics?.country_rank ? ('#' + user.statistics.country_rank) : '');

        const isBot = user?.is_bot;

        const isNotPlayed = user?.statistics?.level_current <= 1 && user?.statistics?.level_progress === 0
        const hasEstimated = user?.estimate_pp > 0

        const level = user?.statistics?.level_current || 0;
        const progress = user?.statistics?.level_progress || 0;
        const acc = floor(user?.statistics?.hit_accuracy, 2) || '0';
        const right2 = isBot ? '' : (isNotPlayed ? (acc + '%') : (acc + '% Lv.' + level + '(' + progress + '%)'))

        let status = 'AFK';

        if (isBot)              status = 'BOT';
        else if (user?.pp > 0)  status = 'HAS_PP';
        else if (isNotPlayed)   status = 'NOT_PLAYED';
        else if (hasEstimated)  status = 'ESTIMATED';

        const config = {
            'BOT':        { b: '',  m: 'BOT' },
            'HAS_PP':     { b: Math.round(user.pp).toString(), m: 'PP' },
            'NOT_PLAYED': { b: '',  m: 'NOT_PLAYED' },
            'ESTIMATED':  { b: Math.round(user.estimate_pp).toString(), m: '?' },
            'AFK':        { b: '',  m: 'AFK' }
        };

        const right3b = config[status].b;
        const right3m = config[status].m;

        //历史记录功能！
        const pp_d = (historyUser != null) ? Math.round((user.pp - historyUser?.statistics?.pp) * 100) / 100 : 0
        const right1 = (pp_d > 0) ? '+' + pp_d + 'PP' :
            ((pp_d < 0) ? pp_d + 'PP' : (is_team_member ? '[' + user.team.short_name + ']' : ''))

        return {
            background: (isNotEmptyString(bg)) ? bg : getBannerLocal(),
            avatar: av,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            sub_banner: '',
            country: country,
            team_url: user?.team?.flag_url,

            top1: user?.username,
            left1: left1,
            left1_colors: left1_colors,
            left1_stroke: '#fff',
            left1_stroke_width: 2,
            left2: left2,
            right1: right1,
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    mapper2CardA1: (user, avatar = null, background = null) => {
        const sub_icon1 = user.is_supporter ? getImageFromV3('object-card-supporter.png') : '';
        const country = user?.country?.code || 'CN';

        const left2 = 'U' + user.id;

        const right2 = 'Mapping Followers';
        const right3b = user.mapping_follower_count ? user.mapping_follower_count.toString() : '0';
        const right3m = 'x';

        const av = avatar ?? user?.avatar_url;
        const bg = background ?? user?.profile?.card ?? user?.cover_url ?? user?.cover?.url;

        return {
            background: bg,
            avatar: av,
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

    microUser2CardA1: (user, type = null, show_mutual = false, avatar = null, background = null) => {
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

            case "uid": right1 = `U${user?.id ?? 0}`; break;
            default: right1 = ""; break;
        }

        const right2 = isBot ? '' : (level + progress > 0 ? (acc + '% Lv.' + level + '(' + progress + '%)') : acc + '%')
        const right3b = isBot ? '' : (user?.statistics?.pp ? Math.round(user.statistics.pp).toString() : '');
        const right3m = isBot ? 'Bot' : (user?.statistics?.pp ? 'PP' : 'AFK');

        /**
         * @type {string}
         */
        const bg = background ?? user?.profile?.card ?? user?.cover_url ?? user?.cover?.url;

        /**
         * @type {string}
         */
        const av = avatar ?? user?.avatar_url;

        return {
            background: bg,
            avatar: av,
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

    microTeamMember2CardA1: (user, is_leader = false) => {
        const sub_icon1 = (user.is_supporter) ? getImageFromV3('object-card-supporter.png') : ''

        const country = user?.country_code || 'CN';

        const is_secret = user?.last_visit == null

        const left1 = '[' + (user?.team?.short_name || '?') + ']'
        const right1 = '(' + (is_secret ? '?' : getTimeDifference(user?.last_visit)) + ')'
        const left2 = is_leader ? 'leader' : 'member'
        const right2 = 'last visit: ' + (is_secret ? '?' : getFormattedTime(user?.last_visit, 'YYYY-MM-DD HH:mm'))
        const right3m = is_secret ? '?' : ((user.is_online === true) ? 'Online' : 'Offline')

        return {
            background: user?.cover?.url,
            avatar: user?.avatar_url,
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
            right3b: '',
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
        const bg_str = 'object-score-backimage-' + rank + '.webp';
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

    maiPlayer2CardA1: async (user, statistics = null) => {
        if (isNullOrEmptyObject(user)) return {
            background: getImageFromV3('card-default.webp'),
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

        let dan
        const dan_arr = ['初', '二', '三', '四', '五', '六', '七', '八', '九', '十']

        if (user.dan === 0) dan = '初学者'
        else if (user.dan <= 10) dan = dan_arr[user.dan - 1] + '段'
        else if (user.dan <= 20) dan = '真' + dan_arr[user.dan - 11] + '段'
        else if (user.dan === 21) dan = '真皆伝'
        else if (user.dan === 22) dan = '裏皆伝'
        else dan = ''

        if (statistics == null) {

            const background = getMaimaiRatingBG(user?.rating);

            const plate_image = await getMaimaiPlate(user.plate_id)

            let top2;
            let left1;
            let sub_banner;

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
            }
        } else {
            const stat = statistics

            const background = getMaimaiRatingBG(stat?.page_rating);

            const left1 = 'count: ' + (stat?.count ?? 0);
            const left2 = 'total: ' + (stat?.total_rating ?? 0);

            const percent = Math.round((stat?.page_rating / user.rating * 100) ?? 0) + '%'

            return {
                background: background,
                avatar: getImageFromV3('Maimai', 'avatar-guest.png'),
                sub_icon1: '',
                sub_icon2: '',
                sub_banner: '',
                country: null,

                top1: user.name,
                top2: user.probername,

                left1: left1,
                left2: left2,
                right1: '',
                right2: 'Rating: ' + (user?.rating ?? 0) + ' (' + percent +')',
                right3b: stat?.page_rating ?? 0,
                right3m: '',
            }
        }
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

    guest2CardA1: (data = {
        user: {
            id: 416662,
            username: 'Hollow Wings',
        },
        received: 0,
        received_ranked: 0,
        sent: 5,
        sent_ranked: 5,
    }, images = new Map()) => {
        const user = data.user

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

        const avatar = images.get(`avatar_${user.id}`) ?? ('https://a.ppy.sh/' + (user.id ?? ''))

        return {
            background: getBannerLocal(),
            avatar: avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            sub_banner: '',
            country: null, //user.country_code,

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
        const background = await getMaimaiCover(song?.song_id);

        const title1 = song?.basic_info?.title || '-'
        const title2 = song?.basic_info?.artist || '-'

        const left1 = song?.alias || ''
        const left2 = (song?.basic_info?.from || '-')
            .replaceAll("でらっくす", 'DX')
            .replaceAll(" PLUS", '+')
        const left3 = getMaimaiCategory(song?.basic_info?.genre)

        const right1 = song?.basic_info?.bpm ? ('BPM ' + song?.basic_info?.bpm.toString()) : ''

        let right3b, right3m
        let song_id = song?.song_id || 0

        if (version === "ANY") {
            if (song_id >= 10000) {
                song_id %= 10000
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

    matchRating2CardA2: async (match = {}, beatmap = null, is_match_start = false, beatmap_background = null) => {
        const {
            match: stat,
            team_point_map: {
                red = 0,
                blue = 0,
            },
            is_team_vs = false,
            average_star = 0,
            first_map_sid,

            round_count = 0,
            player_count = 0,
            score_count = 0,

            is_skipping = false,
        } = match

        const star = floor(average_star, 2);

        const sid = first_map_sid ?? beatmap?.beatmapset?.id ?? beatmap?.beatmapset?.beatmapset_id ?? 0
        const background = beatmap_background ?? (beatmap != null ? await getDiffBackground(beatmap) :
            await readNetImage('https://assets.ppy.sh/beatmaps/' + sid + '/covers/list@2x.jpg', false))

        const {
            name: title1,
            team1,
            team2
        } = splitMatchName(stat?.name)

        let title2;
        if (isNotEmptyString(team1)) {
            title2 = team1 + ' vs ' + team2;
        } else {
            title2 = '';
        }

        const left1 = 'Round: ' + round_count;
        const left2 = 'Player: ' + player_count;
        const left3 = 'Score: ' + score_count;

        const right1 = 'Average Star ' + star + '*';
        const right2 = 'MID ' + stat?.id || 0;

        if (is_skipping === true) {
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

        const right3b = is_team_vs ? ((red + blue <= 0) ? 'TeamVs' : (red + ' : ' + blue)) :
            (round_count + (is_match_start ? 1 : 0)).toString()
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
        const background = await getMapBackground(b, 'list@2x');
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


    beatmapset2CardA2: async (s, background = null) => {
        const b = background ?? await getMapBackground(s, 'cover');
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
            background: b,
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

    matchBeatMap2CardA2: async (b = {}, images = new Map()) => {
        const set = b?.beatmapset ?? {}

        const background = images.get(`list@2x_${set.id}`) ?? await getMapBackground(b, 'list@2x');

        const title1 = set?.title || 'Deleted Beatmap';
        const title2 = set?.artist || '-';
        const title3 = set?.creator || '-';
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

    searchResult2CardA2: async (total, cursor, search, result_count, rule, first_beatmapset, last_beatmapset, background) => {
        const bg = background ??
            await readNetImage(first_beatmapset?.covers?.['list@2x'] || last_beatmapset?.covers?.['list@2x'] , true);
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
            background: bg,
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

    searchMap2CardA2: async (s, rank, background) => {
        const ranked_date = s.ranked_date || '';
        const submitted_date = s.submitted_date || '';
        const ranked = s?.ranked ?? -2;

        const has_leaderboard = hasLeaderBoard(ranked)

        const bg = background ?? await getMapBackground(s, 'list@2x');

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
            background: bg,
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
        const background = await readNetImage(team.flag_url)

        const is_open = team?.is_open ? 'Open' : 'Closed'
        const stats = team.statistics

        const title1 = team?.name || 'Team'
        const title2 = getGameMode(team?.default_ruleset_id, 2) + ' // ' + (is_open) + ' // ' + (team?.empty_slots || 0)
        + ' Slots'

        const left1 = 'RKS: ' + round(stats?.ranked_score || 0, -4, 0)
        const left2 = 'PC: ' + Math.round(stats?.play_count || 0)
        const left3 = getFormattedTime(team.created_at, "YYYY-MM") // Open Close

        const right1 = 'TeamID: #' + (stats?.team_id || 0).toString()
        const right2 = 'Rank: #' + (stats?.rank || '0')
        const right3b = Math.round(stats?.performance || 0).toString()
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
     * @param scores
     * @return {Promise<*[]>}
     */
    score2CardD2: async (scores = []) => {
        let promises = []
        let d2s = []

        for (const s of scores) {
            const star = s?.beatmap?.difficulty_rating || 0
            const star_rrect_color = getStarRatingColor(star)
            const star_text_color = (star < 4) ? '#1c1719' : '#fff'

            const rank = s?.legacy_rank || 'F'
            const rank_rrect_color = getRankColor(rank)
            const rank_text_color = (rank === 'X' || rank === 'XH') ? '#1c1719' : '#fff';

            const time = getTime(s?.beatmap?.total_length)

            const data = {
                background: getMapBackground(s, 'list@2x'),
                title: Math.round(s?.pp).toString() || '0',
                title_m: 'PP',

                left: floor(star, 2),
                left_color: star_text_color,
                left_rrect_color: star_rrect_color,

                right: rank,
                right_color: rank_text_color,
                right_rrect_color: rank_rrect_color,

                bottom_left: String(s?.beatmap_id ?? 0),
                bottom_right: time.minute + ":" + time.seconds,
            }

            promises.push(card_D2(data))
        }

        await Promise.allSettled(promises)
            .then(results => thenPush(results, d2s))

        return d2s
    },



    score2CardC: async (s, identifier = 1, cover = null, background = null) => {
        const results = (cover === null || background === null)
            ? await Promise.allSettled([
                getMapBackground(s, 'list@2x'),
                getMapBackground(s, 'cover')
            ]) : [];

        const cv = cover ?? getIndexOrNull(results, 0)
        const bg = background ?? getIndexOrNull(results, 1)

        const type = getScoreTypeImage(s.is_lazer)

        const time_diff = getTimeDifferenceShort(s.ended_at, 0);

        const mods_width = getLazerModsWidth(s?.mods, 60, 160, 'right', 6, true, false)

        const acc = floor((s?.legacy_accuracy * 100), 2) + '%'
        const combo = (s.max_combo || 0) + 'x'

        const difficulty_name = s.beatmap.version ? torus.cutStringTail(
            getKeyDifficulty(s.beatmap), 24,
            500 - 10 - mods_width - torus.getTextWidth('[] -   ()' + acc + combo + time_diff, 24), true) : '';

        const rank = s?.legacy_rank
        const color_index = (rank === 'SSH' || rank === 'SS' || rank === 'XH' || rank === 'X') ? '#2A2226' : '#fff';

        const artist = torus.cutStringTail(s.beatmapset.artist, 24,
            500 - 10 - mods_width - torus.getTextWidth(' // ' + s.beatmapset.creator, 24), true);

        const title2 = (s?.beatmapset?.title === s?.beatmapset?.title_unicode) ? '' : (s?.beatmapset?.title_unicode || '');
        const index_b = (s?.pp <= 10000) ? Math.round(s?.pp).toString() : floor(s?.pp, 1, -1);

        // 这是大概的进度
        const approximate_progress = (s?.total_hit > 0) ? (s?.score_hit / s?.total_hit) : 1
        const index_l = (s?.passed === false || rank === 'F') ? Math.round(approximate_progress * 100) + '%' : ''

        const star = s?.beatmap?.difficulty_rating || 0
        const star_color = getStarRatingColor(star)
        const star2_color = getStarRatingColors(star)
        const rank2_color = getRankColors(rank)

        const color_label12 = (star < 4) ? '#1c1719' : '#fff'

        const label2 = s?.beatmap_id?.toString() ?? s?.beatmap?.id?.toString() ?? ''

        let left1
        let left2
        let title

        if (s.beatmapset?.creator != null && star > 0) {
            title = s?.beatmapset?.title ?? ''
            left1 = artist + ' // ' + (s.beatmapset?.creator ?? '')
            left2 = '[' + difficulty_name + '] - ' + acc + ' ' + combo + ' (' + time_diff + ')'
        } else {
            title = 'Deleted Beatmap'
            left1 = ''
            left2 = acc + ' ' + combo + ' (' + time_diff + ')'
        }

        return {
            background: bg,
            cover: cv,
            type: type,

            title: title,
            title2: title2,
            left1: left1,
            left2: left2,
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

    topScore2CardC: async (s, identifier = 1) => {
        const mods_width = getLazerModsWidth(s?.mods, 60, 160, 'right', 6, true, false)

        const artist = torus.cutStringTail(s.beatmapset.artist, 24,
            500 - 10 - mods_width - torus.getTextWidth(' // ' + s?.user?.username, 24), true);

        const left1 = artist + ' // ' + s?.user?.username

        const cover = await getAvatar(s?.user);

        const card_C = await PanelGenerate.score2CardC(s, identifier)

        return {
            ...card_C,
            left1: left1,
            cover: cover,
        };
    },

    fixedBestScore2CardC: async (s, rank = 1, rank_after = null) => {
        let mods_width = getLazerModsWidth(s?.mods, 60, 160, 'right', 6, true, false)

        const is_after = (typeof rank_after == "number")

        const card_c = await PanelGenerate.score2CardC(s, rank)

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

    mostPlayed2CardC: async (mp, identifier = 1) => {
        const cover = await getMapBackground(mp, 'list@2x');
        const background = await getMapBackground(mp, 'cover');

        const difficulty_name = mp.version ? torus.cutStringTail(
            getKeyDifficulty(mp), 24,
            500 - 10, true) : '';

        const artist = torus.cutStringTail(mp.beatmapset.artist, 24,
            500 - 10, true);

        const title2 = (mp.beatmapset.title === mp.beatmapset.title_unicode) ? '' : (mp?.beatmapset?.title_unicode || '');

        let color_index = '#fff'
        let rank2_color

        const pc = mp.current_user_playcount ?? 0

        if (pc > 1000) {
            color_index = '#2A2226'
            rank2_color = colorArray.rainbow
        } else if (pc > 500) {
            rank2_color = colorArray.light_yellow
        } else if (pc > 300) {
            rank2_color = colorArray.amber
        } else if (pc > 200) {
            rank2_color = colorArray.light_green
        } else if (pc > 100) {
            rank2_color = colorArray.green
        } else if (pc > 75) {
            rank2_color = colorArray.blue
        } else if (pc > 50) {
            rank2_color = colorArray.deep_blue
        } else if (pc > 40) {
            rank2_color = colorArray.purple
        } else if (pc > 30) {
            rank2_color = colorArray.magenta
        } else if (pc > 20) {
            rank2_color = colorArray.pink
        } else if (pc > 10) {
            rank2_color = colorArray.red
        } else {
            rank2_color = colorArray.deep_gray
        }

        const mode = ' (' + (mp?.mode ?? 'osu') + ')'

        const star = mp?.difficulty_rating || 0
        const star_color = getStarRatingColor(star)
        const star2_color = getStarRatingColors(star)

        const color_label12 = (star < 4) ? '#1c1719' : '#fff'

        const label2 = mp?.id?.toString() || ''

        return {
            background: background,
            cover: cover,
            type: '',

            title: mp.beatmapset.title || '',
            title2: title2,
            left1: artist + ' // ' + mp.beatmapset.creator,
            left2: '[' + difficulty_name + ']' + mode,
            index_b: pc,
            index_m: '',
            index_l: 'PC',
            index_b_size: 48,
            index_m_size: 36,
            index_l_size: 24,
            label1: floor(star, 1),
            label2: label2,
            label3: '',
            label4: '',
            label5: '#' + identifier,
            mods_arr: [],

            color_title2: '#bbb',
            color_right: rank2_color.toReversed(),
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

    // 0.8.3 方法
    matchPlayer2CardC: (
        player = {},
        is_team_vs = false,
        images = new Map(),
        use_team_color = true,
        show_associated_round = false
    ) => {
        const {
            win = 0,
            lose = 0,
            rws = 0,
            mra = 0,
            ranking = 0,
            total = 0,
            arc = 0,
            player_class = {},
            team = '',
            player: user,
        } = player

        const {
            english,
            chinese,
            // color,
            category
        } = player_class

        const {
            id,
            username,
            country_code
        } = user

        const config = TEAM_CONFIG[team] || TEAM_CONFIG.default

        const team_color = config.color
        const player_background = use_team_color ? getImageFromV3(config.bg) : getPlayerClassBackground(category)

        const rws_100 = Math.round(rws * 10000) / 100

        const total_count = win + lose

        const win_rate = Math.round((win / Math.max(total_count, 1)) * 100)

        const total_score_floor = floor(total, 2)

        const left1 = `${total_score_floor} // ${
            is_team_vs
                ? `${win}W-${lose}L (${win_rate}%)`
                : `${win}W-${total_count}P`
        }`;

        let associated = ''

        if (show_associated_round) {
            const associated_rate = Math.round((total_count / Math.max(arc, 1)) * 100)

            associated = ` // ${total_count}P-${arc}T (${associated_rate}%)`
        }

        const left2 = `#${ranking} (${rws_100})${associated}`;

        const color_index = (category === 'BC') ? "#2A2226" : "#FFF";
        const colors = getPlayerClassColors(category)

        const avatar = images.get(`avatar_${id}`) ?? getImageFromV3('avatar-guest.png')
        const mra_floor = floors(mra, 2)

        return {
            background: player_background,
            cover: avatar,
            title: username ?? ('UID:' + id),
            title2: country_code ?? '',
            left1: left1,
            left2: left2,
            index_b: mra_floor.integer,
            index_m: mra_floor.decimal,
            index_b_size: 48,
            index_m_size: 36,
            label1: '',
            label2: '',
            label3: english,
            label4: chinese,
            mods_arr: [],

            color_title2: '#aaa',
            color_right: colors,
            color_left: team_color.toReversed(),
            color_index: color_index,
            color_label1: '',
            color_label2: '',
            color_label3: '#382E32',
            color_label4: '#382E32',
            color_left12: '#bbb', //左下两排字的颜色

            font_title2: 'torus',
            font_label4: 'PuHuiTi',
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
        const left2 = index_text + ' // award at: ' + getFormattedTime(badge?.awarded_at, 'YYYY-MM-DD HH:mm:ss +8', 'YYYY-MM-DD[T]HH:mm:ssZ') + ' (' + getTimeDifference(badge?.awarded_at, 'YYYY-MM-DD[T]HH:mm:ssZ', moment().subtract(8, "hours"), 1) + ')'

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

    score2CardC3: async (score, index = 1, decrypted = false, list = null, cover = null) => {
        const tasks = [];

        // 只有当 list 为 null 时才执行默认的获取逻辑
        if (list === null) {
            tasks.push(getMapBackground(score, 'list@2x'));
        } else {
            tasks.push(Promise.resolve(list));
        }

        // 只有当 cover 为 null 时才执行默认的获取逻辑
        if (cover === null) {
            tasks.push(getMapBackground(score, 'cover'));
        } else {
            tasks.push(Promise.resolve(cover));
        }

        const results = await Promise.allSettled(tasks);

        const [cv, bg] = results.map(r => getImageOrElse(r));

        const index_text = index > 0 ? ('#' + index) : ''
        const bid_text = score.beatmap.id.toString()

        const title = score.beatmapset.title ?? ''
        const title2 = score.beatmapset.title_unicode ?? ''
        const artist = score.beatmapset.artist ?? ''
        const creator = score.beatmapset.creator ?? ''
        const version = score.beatmap.version ?? ''

        const star = score.beatmap.difficulty_rating
        const color = getStarRatingColor(star)

        const text_color = (star < 4) ? '#1c1719' : '#fff'

        return {
            background: bg,
            cover: decrypted ? cv : null,

            title: title,
            title2: title2,
            left1: (artist + ' // ' + creator),
            left2: `[${version}]`,

            label1: index_text,
            label2: decrypted ? bid_text : null,

            color_rrect: color,
            color_title_text: '#fff',
            color_title2_text: '#bbb',
            color_label_rrect1: color,
            color_label_rrect2: decrypted ? color : '',
            color_label_text: text_color,
            color_left1_text: '#fff',
            color_left2_text: '#bbb',

            blur: decrypted ? 5 : 30,
        }
    },

    skill2CardK: async (skill = {score: {}, skill: []}) => {
        const background = await getMapBackground(skill.score, 'list@2x');

        return {
            background: background,
            star: skill?.score?.beatmap?.difficulty_rating || 0,
            skill: skill?.skill,
            skill_sum: skill?.skill_sum ?? 0,
            skill_color: '#fff',
            hexagon_color: '#bbb',
            mods: skill?.score?.mods,
            rank: skill?.score?.rank,
        }
    },

    bp2ComponentJ: async (bp) => {
        const background = await getMapBackground(bp, 'list@2x');

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

        const is_utage = score?.level_label?.slice(0, 1) === 'U' || score?.level?.toString().includes('?')
        const too_bright = Array.of(1, 4).includes(score?.level_index || 0)

        const difficulty_color = getMaimaiDifficultyColor(score?.level_index || 0, is_utage)

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

    score2CardI4: async (s, identifier = 1, cover = null) => {
        const cv = cover ?? await getMapBackground(s, 'list@2x')

        const rank_color = getRankColors(s?.legacy_rank)
        const type = getScoreTypeImage(s.is_lazer)

        const acc = floors((s?.legacy_accuracy * 100), 2)
        const combo = (s.max_combo || 0) + 'x'

        const rank = getImageFromV3('object-score-' + rankSS2X(s?.legacy_rank) + '-small2.png')

        const title2_original_text = (s.beatmapset.title === s.beatmapset.title_unicode) ? '' : (s?.beatmapset?.title_unicode ?? '');

        const title2_font = isASCII(title2_original_text) ? torus : PuHuiTi;
        const title2_size = isASCII(title2_original_text) ? 16 : 14;

        const title2 = title2_font.cutStringTail(title2_original_text, title2_size, 65);

        const title2_width = title2_font.getTextWidth(title2, title2_size)

        const artist_max_width = 185 - torus.getTextWidth(' // ' + s.beatmapset.creator, 16) - title2_width

        const artist = torus.cutStringTail(s.beatmapset.artist, 16, artist_max_width, true);

        const left1 = artist + ' // ' + (s?.beatmapset?.creator ?? '')
        const left2 = s?.beatmap.version
        const left3 = acc.integer
        const left4 = acc.decimal + '% ' + combo

        const index_b = (s?.pp <= 10000) ? Math.round(s?.pp).toString() : floor(s?.pp, 1, -1);

        const star = s?.beatmap?.difficulty_rating || 0
        const star_color = getStarRatingColor(star)

        const color_label12 = (star < 4) ? '#1c1719' : '#fff'

        const label2 = '#' + identifier

        const level = getOsuDXRatingStar(s.statistics, s.maximum_statistics, getGameMode(s.mode, 1))
        return {
            // background: background,
            cover: cv,
            rank: rank,
            type: type,
            level: level,  // 星星数量

            title: s.beatmapset.title || '',
            title2: title2, // 外号
            left1: left1,
            left2: left2,
            left3: left3, // 大号字
            left4: left4, // 小号字
            index_b: index_b,
            index_m: 'PP',
            index_b_size: 32,
            index_m_size: 20,
            label1: floor(star, 1),
            label2: label2,

            color_text: '#fff',
            color_label1: color_label12,
            color_label2: color_label12,

            color_left: star_color,
            color_rrect1: star_color,
            color_rrect2: star_color,

            color_backgrounds: rank_color,

            mods: s?.mods, // mod

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

    user2CardO1: async (user, avatar = null, background = null) => {
        const b = background ?? await getBanner(user);
        const a = avatar ?? await getAvatar(user);

        return {
            background: b,
            avatar: a,

            name: user?.username || (user?.id ? "ID: " + user?.id : "Unknown"),
            groups: user?.groups || [],
        };
    },

    beatmap2ComponentIM: async (s) => {
        if (!s) return '';

        const background = await getMapBackground(s, 'list@2x');
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


    beatmap2componentE3: (beatmap, original, ruleset_id = 0) => {

        const {
            bpm = 0,
            total_length = 0,
            hit_length = 0,
            count_circles: circles = 0,
            count_sliders: sliders = 0,
            cs, ar, od, hp
        } = beatmap;

        const bpm_rounds = rounds(bpm, 2);
        const bpm_r = bpm > 0 ? `${(60000 / bpm).toFixed(0)}ms` : '-';
        const bpm_b = bpm_rounds.integer;
        const bpm_m = bpm_rounds.decimal;
        const bpm_p = normalize(bpm, 270, 90, 1, 1e-4);

        const length_r = `${Math.floor(total_length / 60)}:${(total_length % 60).toFixed(0).padStart(2, '0')}`;
        const length_b = `${Math.floor(hit_length / 60)}:`;
        const length_m = (hit_length % 60).toFixed(0).padStart(2, '0');
        const length_p = normalize(hit_length, 270, 30, 1, 1e-4);

        let display_cs = true;
        let display_ar = true;
        let display_od = true;

        // 默认配置 (std / ruleset_id: 0)
        let cs_config = { min: 2, mid: 4, max: 6 };
        let ar_config = { min: 7.5, mid: 9, max: 10.5 };
        let od_config = { min: 5.5, mid: 8, max: 10.5 };
        let hp_config = { min: 4, mid: 6, max: 8 };

        let index = '';
        const ratio = getRatioString(circles / sliders);

        // 根据模式调整配置
        switch (ruleset_id) {
            case 0:
                index = `CR & SL: ${circles} / ${sliders} [${ratio}]`;
                break;

            case 1: // Taiko
                cs_config = { min: 0, mid: 0, max: 0 };
                ar_config = { min: 0, mid: 0, max: 0 };
                od_config = { min: 4, mid: 6, max: 8 };
                display_ar = false;
                display_cs = false;
                break;

            case 2: // Catch
                od_config = { min: 0, mid: 0, max: 0 };
                display_od = false;
                break;

            case 3: // Mania
                cs_config = { min: 4, mid: 6, max: 8 };
                ar_config = { min: 0, mid: 0, max: 0 };
                hp_config = { min: 7, mid: 8, max: 9 };
                display_ar = false;
                index = `RC & LN: ${circles} / ${sliders} [${ratio}]`;
                break;
        }

        // 4. 解构 original 的数据
        const {
            cs: original_cs = 0,
            ar: original_ar = 0,
            od: original_od = 0,
            hp: original_hp = 0
        } = original ?? {};

        // 5. 导出统一格式的对象
        return {
            labels: [
                {
                    ...LABELS.BPM,
                    remark: bpm_r,
                    data_b: bpm_b,
                    data_m: bpm_m,
                    data_a: '',
                    bar_progress: bpm_p,
                },
                {
                    ...LABELS.LENGTH,
                    remark: length_r,
                    data_b: length_b,
                    data_m: length_m,
                    data_a: '',
                    bar_progress: length_p,
                },
                {
                    ...((ruleset_id === 3) ? LABELS.KEY : LABELS.CS),
                    ...stat2label(cs, cs2px(cs, ruleset_id),
                        normalize(cs, cs_config.max, cs_config.min, 1, 1e-4),
                        original_cs, display_cs),
                    bar_min: cs_config.min,
                    bar_mid: cs_config.mid,
                    bar_max: cs_config.max,
                },
                {
                    ...LABELS.AR,
                    ...stat2label(ar, ar2ms(ar, ruleset_id), normalize(ar, ar_config.max, ar_config.min, 1, 1e-4), original_ar, display_ar),
                    bar_min: ar_config.min,
                    bar_mid: ar_config.mid,
                    bar_max: ar_config.max,
                },
                {
                    ...LABELS.OD,
                    ...stat2label(od, od2ms(od, ruleset_id), normalize(od, od_config.max, od_config.min, 1, 1e-4), original_od, display_od),
                    bar_min: od_config.min,
                    bar_mid: od_config.mid,
                    bar_max: od_config.max,
                },
                {
                    ...LABELS.HP,
                    ...stat2label(hp, '-', normalize(hp, hp_config.max, hp_config.min, 1, 1e-4), original_hp, true),
                    bar_min: hp_config.min,
                    bar_mid: hp_config.mid,
                    bar_max: hp_config.max,
                }
            ],
            index
        };
    },

    score2componentE3: (score, original) => {
        return PanelGenerate.beatmap2componentE3(score.beatmap, original, score.ruleset_id)
    },
}

const TEAM_CONFIG = {
    red:  { color: colorArray.red,  bg: 'card-red.webp' },
    blue: { color: colorArray.blue, bg: 'card-blue.webp' },
    default: { color: colorArray.gray, bg: 'card-gray.webp' }
};

const stat2label = (stat, remark, progress, original, is_display = true) => {
    const changed = Math.abs(original - stat) > 0.1;

    const stat_number = rounds(stat, 1)

    const stat_b = stat_number.integer
    const stat_m = stat_number.decimal

    if (is_display) {
        return {
            remark: remark,
            data_b: stat_b,
            data_m: stat_m,
            data_a: changed ? (' [' + round(original, 1) + ']') : '',
            bar_progress: progress,
        }
    } else {
        return {
            remark: '-', data_b: '-', data_m: '', data_a: '', bar_progress: null,
        }
    }
}