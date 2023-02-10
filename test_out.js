const readImage = (e) => {
    return e;
}

let data = {
    card_A1: {
        background: readImage("image/A_CardA1_BG.png"),
        avatar: readImage("image/A_CardA1_Avatar.png"),
        country_flag: readImage("image/A_CardA1_CountryFlag.png"),
        sub_icon1: readImage("image/A_CardA1_SubIcon1.png"),
        sub_icon2: readImage("image/A_CardA1_SubIcon2.png"),
        name: 'Muziyami',
        rank_global: '#28075',
        rank_country: 'CN#577',
        info: '95.27% Lv.100(32%)',
        pp_b: '4396',
        pp_m: 'PP',
    },
    label_acc: {
        icon: readImage("image/object-score-accpp.png"),
        icon_title: 'Accuracy',
        remark: '-1.64%',
        data_b: '98.',
        data_m: '36%',
    },
    label_combo: {
        icon: readImage("image/object-score-combo.png"),
        icon_title: 'Combo',
        remark: '9999x',
        data_b: '547',
        data_m: 'x',
    },
    label_pp: {
        icon: readImage("image/object-score-pp.png"),
        icon_title: 'PP',
        remark: '',
        data_b: '2048.',
        data_m: '2',
    },
    label_bpm: {
        icon: readImage("image/object-score-beatsperminute.png"),
        icon_title: 'BPM',
        remark: '154.4ms',
        data_b: '210.',
        data_m: '1',
    },
    label_length: {
        icon: readImage("image/object-score-length.png"),
        icon_title: 'Length',
        remark: '3:04',
        data_b: '3:',
        data_m: '06',
    },
    label_cs: {
        icon: readImage("image/object-score-circlesize.png"),
        icon_title: 'CS',
        remark: '154px',
        data_b: '4.',
        data_m: '2',
    },
    label_ar: {
        icon: readImage("image/object-score-accpp.png"),
        icon_title: 'AR',
        remark: '450ms',
        data_b: '10.',
        data_m: '3 (9)',
    },
    label_od: {
        icon: readImage("image/object-score-approachrate.png"),
        icon_title: 'OD',
        remark: '16ms',
        data_b: '9.',
        data_m: '82 (8.1)',
    },
    label_hp: {
        icon: readImage("image/object-score-healthpoint.png"),
        icon_title: 'HP',
        remark: '-',
        data_b: '6.',
        data_m: '1',
    },

    // 成绩评级

    score_stats: {
        judge_stat_sum: '12580',
        judge_1: {
            index: '320',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_2: {
            index: '300',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_3: {
            index: '200',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_4: {
            index: '100',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_5: {
            index: '50',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_6: {
            index: '0',
            stat: '1611',
            index_color: '#fff',
            stat_color: '#fff',
            rrect_color: '#8DCFF4',
        },
        judge_7: null,
    },

    // 谱面密度
    map_density_arr: [1, 2, 4, 5, 2, 7, 2, 2, 6, 4, 5, 2, 2, 5, 8, 5, 4, 2, 5, 4, 2, 6, 4, 7, 5, 6],

    // 面板图片
    banner: readImage("image/E_Banner.png"),
    judge_background: readImage("image/E_Background.jpg"),
    judge_fc: readImage("image/E_JudgeFullCombo.png"),
    judge_nm: readImage("image/E_JudgeNoMiss.png"),
    judge_cl: readImage("image/E_JudgeClear.png"),
    judge_pl: readImage("image/E_JudgePlayed.png"),
    colored_circle: readImage("image/E_ColoredCircle.png"),
    colored_ring: readImage("image/E_ColoredRing.png"),
    score_rank: readImage("image/E_ScoreRank.png"),
    mod1: readImage("image/E_Mod.png"),
    mod2: readImage("image/E_Mod.png"),
    mod3: readImage("image/E_Mod.png"),
    mod4: readImage("image/E_Mod.png"),
    mod5: readImage("image/E_Mod.png"),
    star: readImage("image/E_Star.png"),
    map_background: readImage("image/E_MapCover.jpg"),
    map_hexagon: readImage("image/E_Hexagon.png"),
    map_favorite: readImage("image/E_Favorite.png"),
    map_playcount: readImage("image/E_PlayCount.png"),
    map_status: readImage("image/E_MapStatus.png"),

    // 面板文字

    index_leftup: 'powered by Yumubot // Score (!ymp / !ymr)',
    index_rightup: 'request time: 2023-10-4 17:59:58 UTC+8',
    index_panel_name: 'S v3.6',
    srcard_starrating_b: '6.',
    srcard_starrating_m: '5',
    srcard_gamemode: '\uE800', // osu! 模式图标
    map_status_fav: '3.9K',
    map_status_pc: '78.2M',

    map_text_title_romanized: 'Hyakukakai to Shirotokkuri',
    map_text_title_unicode: '百花魁と白徳利',
    map_text_difficulty: 'Expert',
    map_text_artist_mapper_bid: 'Ponkichi // yf_bmp // b3614136',

    main_score_b: '21',
    main_score_m: '47483647',

    map_public_rating: '9.8', //大众评分，就是大家给谱面打的分，结算后往下拉的那个星星就是
    map_retry_percent: '54%', //重试率
    map_fail_percent: '13.2%', //失败率

    // 面板颜色和特性
    color_gamemode: '#7ac943',
    main_gamemode: 'osu',

}

console.log(JSON.stringify(data));