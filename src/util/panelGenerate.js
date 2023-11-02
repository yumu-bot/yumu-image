import {torus} from "./font.js";
import moment from "moment";
import {
    getApproximateRank,
    getDecimals,
    getExportFileV3Path,
    getGameMode,
    getMapBG,
    getMatchNameSplitted,
    getRoundedNumberLargerStr,
    getRoundedNumberSmallerStr,
    getRoundedNumberStr,
    getTimeDifference, isReload,
    readNetImage,
} from "./util.js";
import {getRankColor, getStarRatingColor} from "./color.js";
import {getModInt, hasMod} from "./mod.js";

//公用方法
//把参数变成面板能读懂的数据（router
export const PanelGenerate = {
    user2CardA1: async (user) => {
        const background = await readNetImage(user?.cover_url || user?.cover?.url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user?.avatar_url || user?.avatar?.url, false, getExportFileV3Path('avatar-guest.png'));

        const sub_icon1 = user.is_supporter ? getExportFileV3Path('object-card-supporter.png') : '';
        const country = user?.country.countryCode || 'CN';

        const left1 = user.globalRank ? '#' + user.globalRank : '#0';
        const left2 = country + (user.countryRank ? '#' + user.countryRank : '#0');

        const isBot = user.is_bot;
        const level = user.levelCurrent || 0;
        const progress = user.levelProgress || 0;
        const acc = getRoundedNumberStr(user.accuracy, 3) || 0;
        const right2 = isBot ? '' : (acc + '% Lv.' + level + '(' + progress + '%)');
        const right3b = isBot ? '' : (user.pp ? Math.round(user.pp).toString() : '');
        const right3m = isBot ? 'Bot' : (user.pp ? 'PP' : (user.levelCurrent === 1 && user.levelProgress === 0 ? 'NOT PLAYED' : 'AFK'));

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            country: country,

            top1: user.username,
            left1: left1,
            left2: left2,
            right1: '',
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },

    mapper2CardA1: async (user) => {
        const background = await readNetImage(user?.cover_url || user?.cover?.url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user?.avatar_url || user?.avatar?.url, false, getExportFileV3Path('avatar-guest.png'));

        const sub_icon1 = user.is_supporter ? getExportFileV3Path('object-card-supporter.png') : '';
        const country = user?.country.countryCode || 'CN';

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

            top1: user.username,
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
        const level = microUser.statistics.level_current || 0;
        const progress = microUser.statistics.level_progress || 0;
        const acc = getRoundedNumberStr(microUser.statistics.hit_accuracy, 3) || 0;
        const right2 = isBot ? '' : (acc + '% Lv.' + level + '(' + progress + '%)');
        const right3b = isBot ? '' : (microUser.statistics.pp ? Math.round(microUser.statistics.pp).toString() : '');
        const right3m = isBot ? 'Bot' : (microUser.statistics.pp ? 'PP' : 'AFK');

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',

            country: country,

            top1: microUser.username,
            left1: left1,
            left2: left2,
            right1: '',
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };
    },


    //panel F2 用的转换
    matchUser2CardA1: async (user = {
        id: null,
        userName: null,
        accuracy: 0.8590575010808473,
        mods: [ 'NF', 'HD' ],
        score: 185232,
        mode: 'OSU',
        passed: true,
        perfect: 0,
        statistics: {
            count_50: 14,
            count_100: 141,
            count_300: 613,
            count_geki: 49,
            count_katu: 72,
            count_miss: 3
        },
        rank: 'F',
        pp: null,
        match: { slot: 3, team: 'red', pass: true },
        osuUser: {
            id: 11355787,
            username: 'na-gi',
            uid: 11355787,
            avatar_url: 'https://a.ppy.sh/11355787?1590115432.jpeg',
            playmode: 'DEFAULT',
            support_level: 0,
            cover: {
                url: 'https://assets.ppy.sh/user-profile-covers/11355787/fbab99aa8812f95f53fa8534cda1aec9f9edde6a8608dd052dc93caa0b64315c.jpeg',
                custom_url: 'https://assets.ppy.sh/user-profile-covers/11355787/fbab99aa8812f95f53fa8534cda1aec9f9edde6a8608dd052dc93caa0b64315c.jpeg'
            },
            country: { countryCode: 'CN', countryName: 'China' }
        },
        uid: 8926316,
        user_id: 8926316,
        max_combo: 231,
        mode_int: 0,
        created_at: 1584794973,
        best_id: null,

        team: null,
        total_score: 0,
        total_player: 0,
    }) => {
        if (!user) return '';

        const score = user.score || 0;
        const total_score = user.total_score || 0;
        const total_player = user.total_player || 0;
        const rating = total_score !== 0 ? Math.round(score * total_player / total_score * 100) / 100 : 0;
        const team_str = (user.match.team === 'red') ? 'teamred' : ((user.match.team === 'blue') ? 'teamblue' : 'headtohead');
        const pp_str = (user.pp != null) ? ' (' + Math.round(user.pp) + 'PP) ' : '';
        const mods_arr = user.mods || [];
        const rank = user.match.pass === false ? 'F' : getApproximateRank({statistics: user.statistics, mode: user.mode});

        let mods = '';
        if (mods_arr.length > 0) {
            mods = '+';
            for (const v of mods_arr) {
                mods += v;
            }
        }

        const background = await readNetImage(user.osuUser.cover.url || user.osuUser.custom_url, false, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user.osuUser.avatar_url, false, getExportFileV3Path('avatar-guest.png'));
        const country = user.osuUser?.country?.countryCode || 'UN';

        const top1 = user.osuUser.username || 'Unknown';
        
        const left1 = user.osuUser?.country?.countryName || 'Unknown';
        const left2 = 'P' + (user.match.slot + 1) + ' r' + rating + ' ' + pp_str;
        const sub_icon1 = getExportFileV3Path('object-card-' + team_str + '.png')
        const right2 = (Math.round((user.accuracy || 0) * 10000) / 100) + '%' + ' '
            + rank + ' ' + mods + ' ' + (user.max_combo || 0) + 'x';
        const right3b = getRoundedNumberLargerStr(score, 0);
        const right3m = getRoundedNumberSmallerStr(score, 0);

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
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

        /*

        const mod_str = (user.mods != null && user.mods.length > 0) ? ' +' + getAllMod(getModInt(user.mods)) : '';
        const team_str = (user.team === 'red') ? 'teamred' : ((user.team === 'blue') ? 'teamblue' : 'headtohead');

        const background = await readNetImage(user.cover, getExportFileV3Path('card-default.png'));
        const avatar = await readNetImage(user.avatar, getExportFileV3Path('avatar-guest.png'));

        const country = user.country || 'CN';

        const top1 = user.name || 'Unknown';
        const left2 = '#' + user.rank + ' *' + (Math.round(user.rating * 100) / 100);
        const sub_icon1 = getExportFileV3Path('object-card-' + team_str + '.png')
        const right2 = (Math.round(user.accuracy * 10000) / 100) + '% '
            + user.grade + mod_str + ' ' + user.combo + 'x';
        const right3b = getRoundedNumberLargerStr(user.score, 0);
        const right3m = getRoundedNumberSmallerStr(user.score, 0);

        return {
            background,
            avatar,
            sub_icon1: sub_icon1,
            sub_icon2: '',
            country: country,

            top1: top1,
            left1: country,
            left2: left2,
            right1: '',
            right2: right2,
            right3b: right3b,
            right3m: right3m,
        };

         */

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

    matchBeatmap2CardA2: async (beatmap) => {
        const background = beatmap.background || getExportFileV3Path('beatmap-DLfailBG.jpg');
        const title1 = beatmap.title || 'Unknown Title';
        const title2 = beatmap.artist || 'Unknown Artist';
        const title3 = beatmap.mapper || 'God Made This';
        const left2 = beatmap.difficulty || 'Tragic Love Extra';
        const left3 = 'b' + (beatmap.bid || 0);

        const status = beatmap.status;
        let right2;

        switch (getGameMode(beatmap.mode, 1)) {
            case 'o': {
                right2 = 'CS' + (beatmap.cs || 0) +
                    ' AR' + (beatmap.ar || 0) +
                    ' OD' + (beatmap.od || 0);
                break;
            }
            case 't': {
                right2 = 'OD' + (beatmap.od || 0);
                break;
            }
            case 'c': {
                right2 = 'CS' + (beatmap.cs || 0) +
                    ' AR' + (beatmap.ar || 0);
                break;
            }
            case 'm': {
                right2 = (beatmap.cs || 0) +
                    'Key OD' + (beatmap.od || 0);
                break;
            }
            default: {
                right2 = '-';
            }
        }

        const right3b = getDecimals(beatmap.star_rating,2);
        const right3m = getDecimals(beatmap.star_rating,3) + '*';

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
        const title2 = search ? 'Sort: ' + search.sort : "Sort: Default"; //getSortName(search.sort)
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

        function getSortName(sort = 'ranked_asc') {
            switch (sort.toLowerCase()) {
                case 'title_asc':
                    return 'Title ^';
                case 'title_desc':
                    return 'Title v';
                case 'artist_asc':
                    return 'Artist ^';
                case 'artist_desc':
                    return 'Artist v';
                case 'difficulty_asc':
                    return 'Star Rating ^';
                case 'difficulty_desc':
                    return 'Star Rating v';
                case 'rating_asc':
                    return 'Map Rating ^';
                case 'rating_desc':
                    return 'Map Rating v';
                case 'plays_asc':
                    return 'Play Count ^';
                case 'plays_desc':
                    return 'Play Count v';
                case 'relevance_asc':
                    return 'Relevance ^';
                case 'ranked_desc':
                    return 'Ranked Time v';
                default:
                    return 'Default (Rel v/RT ^)';
            }
        }

    },

    searchMap2CardA2: async (beatmapsets, rank) => {
        const ranked_date = beatmapsets.ranked_date || '';
        const submitted_date = beatmapsets.submitted_date || '';

        const background = await getMapBG(beatmapsets.id, 'list@2x', beatmapsets.ranked);
        const map_status = beatmapsets.status || 'graveyard';

        const isRanked = (map_status === 'ranked' || map_status === 'loved' || map_status === 'approved');
        const isQualified = (map_status === 'qualified');

        const title1 = beatmapsets.title || 'Unknown Title';
        const title2 = beatmapsets.artist || 'Unknown Artist';
        const title3 = beatmapsets.creator || 'Unknown Mapper';
        const title_font = torus;
        const left1 = '';
        const left2 = '#' + rank || '#0';
        const left3 = 's' + beatmapsets.id || 's0';
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

    //给F面板的
    match2CardA2: async (match, beatmap_arr = []) => {
        const background = await readNetImage(beatmap_arr ? beatmap_arr[0].background : '', false, getExportFileV3Path('beatmap-DLfailBG.jpg')) ;
        const title = getMatchNameSplitted(match.match_title);
        const title1 = title[0];
        const title2 = (title[1] && title[2]) ? (title[1] + ' vs ' + title[2]) : '';
        const left1 = match.match_round + 'x Rounds';
        let left2 = moment(match.match_time, 'HH:mm[-]').add(8, 'hours').format('HH:mm') + '~';

        if (match.match_time.slice(-1) === '-') {
            left2 += 'Continuing';
        } else {
            left2 += moment(match.match_time, '[-]HH:mm').add(8, 'hours').format('HH:mm');
        }

        const left3 = moment(match.match_time_start, 'X').add(8, 'hours').format('YYYY-MM-DD');
        const avg_star = beatmap_arr ? beatmap_arr
            .filter(b => b.star_rating > 0)
            .map(b => b.star_rating) : 0;
        const right1 = avg_star ? 'AVG.SR ' + (avg_star.reduce((pv, cv) => {return pv + cv}, 0) / avg_star.length).toFixed(2) : 0;
        const right2 = 'MP' + match.mpid;
        const wins_team_red = match.wins_team_red || 0;
        const wins_team_blue = match.wins_team_blue || 0;
        const right3b = match.is_team_vs ? (wins_team_red + ' : ' + wins_team_blue) : 'h2h';

        return {
            background: background,
            title1: title1,
            title2: title2,
            title_font: 'PuHuiTi',
            left1: left1,
            left2: left2,
            left3: left3,
            right1: right1,
            right2: right2,
            right3b: right3b,
        }
    },

    //给panel_C用的，期待可以和上面合并
    matchInfo2CardA2: async (data = {
        /*
        noneUsers: [],
        matchInfo: {
            id: 59438351,
            name: 'MP5S11:(肉蛋葱鸡) VS (超级聊天)',
            start_time: 1584793502,
            end_time: 1584799428
        },
        averageStar: 0,
        rounds: 1,
        redUsers: [[Object], [Object], [Object], [Object], [Object]],
        isTeamVs: true,
        blueWins: 5,
        redWins: 6,
        blueUsers: [[Object], [Object], [Object], [Object], [Object], [Object]],

        sid: 1001507,
        background: '',

         */
    }) => {
        const wins_team_red = data.redWins || 0;
        const wins_team_blue = data.blueWins || 0;
        const isTeamVS = data.isTeamVs;
        const isContainVS = data.matchInfo.name.toLowerCase().match('vs');
        const star = getDecimals(data.averageStar, 2) + getDecimals(data.averageStar, 3);

        const background = data.sid ? await getMapBG(data.sid, 'list@2x', false) : data.background;

        let title, title1, title2;
        if (isContainVS) {
            title = getMatchNameSplitted(data.matchInfo.name);
            title1 = title[0];
            title2 = title[1] + ' vs ' + title[2];
        } else {
            title1 = data.matchInfo.name;
            title2 = '';
        }

        //这里的时间戳不需要 .add(8, 'hours')
        const left1 = (data.rounds || 0) + 'x Rounds';
        const left2 = (data.matchInfo.end_time) ? moment(data.matchInfo.start_time, 'X').format('HH:mm') + '~' + moment(data.matchInfo.end_time, 'X').format('HH:mm') :
            moment(data.matchInfo.start_time, 'X').format('HH:mm') + '~' + 'Continuing';
        const left3 = moment(data.matchInfo.start_time, 'X').format('YYYY-MM-DD');

        const right1 = 'AVG.SR ' + star;
        const right2 = 'MP' + data.matchInfo.id || 0;
        const right3b = isTeamVS ? (wins_team_red + ' : ' + wins_team_blue) : 'h2h';

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
            isTeamVS: isTeamVS,
        };
    },

    userMatchData2CardH: async (user) => {

        let team_color;
        switch (user.team.toLowerCase()) {
            case 'red':
                team_color = '#D32F2F';
                break;
            case 'blue':
                team_color = '#00A0E9';
                break;
            default:
                team_color = '#aaa';
                break;
        }

        return {
            team: user.team.toLowerCase(),
            team_color: team_color,
            player_name: user.username,
            player_avatar: await readNetImage(user.userData?.avatar_url, false, getExportFileV3Path('PanelObject/I_CardH_Avatar.png')),
            player_banner: await readNetImage(user.userData?.cover?.url, false, getExportFileV3Path('PanelObject/I_CardH_BG.png')),
            player_score: user.scores.reduce(function (prev, curr) {
                return prev + curr;
            }),
            player_win: user.wins,
            player_lose: user.lost,
            player_rank: user.index || 0,
            player_rws: (user.rws * 100) || 0, // 场均胜利分配，是个 0-100 之间的值 MRA v3.2 功能
            player_mra: user.mra, // 木斗力
            player_Label_V1: user.playerLabelV1,
            player_Label_V2: user.playerLabelV2,
            //mra_color: '#F09450', // 玩家分类颜色 MRA v1.2 功能
            //label_class: 'Ever-Victorious Main Force', //玩家分类PRO MRA v3.4 功能
            //class_color: '#fff', //部分字体需要显示为黑色
            //label_mvp: (user.index === 1) ? 'MVP' : '',
        };
    },

    beatmap2CardH: async (beatmap, calcPP, rank = 1) => {
        const cover = await getMapBG(beatmap.beatmapset.id, 'list@2x', isReload(beatmap.ranked));
        const background = await getMapBG(beatmap.beatmapset.id, 'slimcover', isReload(beatmap.ranked));
        // const background = beatmap ? await getDiffBG(beatmap.id, getExportFileV3Path('beatmap-DLfailBG.jpg')) : '';
        // 这个不要下载，请求量太大

        const time_diff = getTimeDifference(beatmap.create_at_str);

        let mods_width;
        switch (beatmap.mods.length) {
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

        const difficulty_name = beatmap.beatmap.version ? torus.cutStringTail(beatmap.beatmap.version, 24,
            500 - 20 - mods_width - torus.getTextWidth('[] - # ()' + rank + time_diff, 24), true) : '';
        const color_index = (beatmap.rank === 'XH' || beatmap.rank === 'X') ? '#2A2226' : '#fff';

        const artist = torus.cutStringTail(beatmap.beatmapset.artist, 24,
            500 - 20 - mods_width - torus.getTextWidth(' // ' + beatmap.beatmapset.creator, 24), true);

        const title2 = (beatmap.beatmapset.title === beatmap.beatmapset.title_unicode) ? null : beatmap.beatmapset.title_unicode;
        const index_b = (calcPP.pp < 2000) ? Math.round(calcPP.pp).toString() : 'Inf.';

        return {
            background: background,
            cover: cover,
            title: beatmap.beatmapset.title || '',
            title2: title2,
            left1: artist + ' // ' + beatmap.beatmapset.creator,
            left2: '[' + difficulty_name + '] - #' + rank + ' (' + time_diff + ')',
            index_b: index_b,
            index_m: 'PP',
            index_b_size: 48,
            index_m_size: 36,
            label1: '',
            label2: '',
            label3: '',
            label4: '',
            mods_arr: beatmap.mods || [],

            color_title2: '#bbb',
            color_right: getRankColor(beatmap.rank),
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
        const cover = await getMapBG(bp.beatmapset.id, 'list@2x', isReload(bp.beatmap.ranked));
        const background = await getMapBG(bp.beatmapset.id, 'cover@2x', isReload(bp.beatmap.ranked));

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