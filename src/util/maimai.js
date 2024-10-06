import fs from "fs";
import {getImageFromV3, isEmptyString, readNetImage} from "./util.js";

// 导入一些特殊 banner，比如 7 号是潘多拉，11号是 Splash 的改版 Shabi
export function getMaimaiBannerIndex(song) {
    if (song?.id === 834) return 7;
    if (song?.from === "maimai でらっくす Splash" || song?.from === "maimai でらっくす Splash PLUS") return 11;
    if (song?.id === 417) return 28;

    return 0;
}

export async function getMaimaiCover(song_id = 0) {
    let id;

    if (song_id == null) {
        id = 0;
    } else if (song_id === 1235) {
        id = 11235; // 这是水鱼的 bug，不关我们的事
    } else if (song_id > 10000 && song_id < 11000) {
        id = song_id - 10000;
    } else if (song_id > 100000) {
        id = song_id - 100000;
    } else {
        id = song_id;
    }

    const song = id.toString().padStart(5, '0')
    const path = getImageFromV3('Maimai', 'Cover', `${song}.png`);

    if (fs.existsSync(path)) {
        return path
    } else {
        return await readNetImage(`https://www.diving-fish.com/covers/${song}.png`, true, getImageFromV3('Maimai', 'Cover', '00000.png'))
    }
}

export function getMaimaiRankBG(rank) {
    let out;

    switch (rank) {
        case 'sssp':
            out = 'object-score-backimage-PF.jpg';
            break;
        case 'sss':
            out = 'object-score-backimage-SSS.jpg';
            break;
        case 'ssp':
        case 'ss':
            out = 'object-score-backimage-X.jpg';
            break;
        case 'sp':
        case 's':
            out = 'object-score-backimage-S.jpg';
            break;
        case 'aaa':
        case 'aa':
        case 'a':
            out = 'object-score-backimage-D.jpg';
            break;
        case 'bbb':
        case 'bb':
        case 'b':
            out = 'object-score-backimage-B.jpg';
            break;
        case 'c':
            out = 'object-score-backimage-A.jpg';
            break;
        case 'd':
            out = 'object-score-backimage-F.jpg';
            break;
        default:
            out = 'object-score-backimage-SH.jpg';
            break;
    }

    return getImageFromV3(out)
}

// 图片推荐尺寸：320 * 52，左侧有 50 px 的头像框
export function getMaimaiPlate(platename = "") {
    if (isEmptyString(platename)) return ''

    const path = getImageFromV3("Maimai", "Plate", platename + ".png")
    const default_path = getImageFromV3("Maimai", "Plate", "default.png")
    const base_path = getImageFromV3("Maimai", "Plate", "0.png")

    if (fs.existsSync(path)) {
        return path
    } else if (fs.existsSync(default_path)) {
        return default_path
    } else {
        return base_path
    }
}

export function getMaimaiMaximumRating(ds = 0) {
    return Math.floor((ds || 0) * 1.005 * 22.4)
}

export function isMaimaiMaximumRating(ra = 0, ds = 0) {
    return ra > 0 && ra >= getMaimaiMaximumRating(ds)
}

export function getMaimaiRatingBG(rating = 0) {
    let background;

    if (rating < 1000) background = 'object-score-backimage-F.jpg'
    else if (rating < 2000) background = 'object-score-backimage-B.jpg'
    else if (rating < 4000) background = 'object-score-backimage-A.jpg'
    else if (rating < 7000) background = 'object-score-backimage-SP.jpg'
    else if (rating < 10000) background = 'object-score-backimage-D.jpg'
    else if (rating < 12000) background = 'object-score-backimage-C.jpg'
    else if (rating < 13000) background = 'object-score-backimage-S.jpg'
    else if (rating < 14000) background = 'object-score-backimage-SH.jpg'
    else if (rating < 14500) background = 'object-score-backimage-X.jpg'
    else if (rating < 15000) background = 'object-score-backimage-XH.jpg'
    else background = 'object-score-backimage-PF.jpg'

    return getImageFromV3(background);
}

export function getMaimaiType(type = '') {
    switch (type) {
        case 'DX':
            return getImageFromV3('Maimai', 'object-type-deluxe.png');
        case 'SD':
            return getImageFromV3('Maimai', 'object-type-standard.png');
        default :
            return '';
    }
}

export function getMaimaiVersionBG(version = '') {
    let v

    switch (version) {
        case "maimai":
            v = 'object-version-maimai.png';
            break;
        case "maimai PLUS":
            v = 'object-version-maimai-plus.png';
            break;
        case "maimai GreeN":
            v = 'object-version-maimai-green.png';
            break;
        case "maimai GreeN PLUS":
            v = 'object-version-maimai-green-plus.png';
            break;
        case "maimai ORANGE":
            v = 'object-version-maimai-orange.png';
            break;
        case "maimai ORANGE PLUS":
            v = 'object-version-maimai-orange-plus.png';
            break;
        case "maimai PiNK":
            v = 'object-version-maimai-pink.png';
            break;
        case "maimai PiNK PLUS":
            v = 'object-version-maimai-pink-plus.png';
            break;
        case "maimai MURASAKi":
            v = 'object-version-maimai-murasaki.png';
            break;
        case "maimai MURASAKi PLUS":
            v = 'object-version-maimai-murasaki-plus.png';
            break;
        case "maimai MiLK":
            v = 'object-version-maimai-milk.png';
            break;
        case "MiLK PLUS":
            v = 'object-version-maimai-milk-plus.png';
            break;
        case "maimai FiNALE":
            v = 'object-version-maimai-finale.png';
            break;
        case "maimai でらっくす":
            v = 'object-version-maimai-dx.png';
            break;
        case "maimai でらっくす PLUS":
            v = 'object-version-maimai-dx-plus.png';
            break;
        case "maimai でらっくす Splash":
            v = 'object-version-maimai-dx-splash.png';
            break;
        case "maimai でらっくす Splash PLUS":
            v = 'object-version-maimai-dx-splash-plus.png';
            break;
        case "maimai でらっくす UNiVERSE":
            v = 'object-version-maimai-dx-universe.png';
            break;
        case "maimai でらっくす UNiVERSE PLUS":
            v = 'object-version-maimai-dx-universe-plus.png';
            break;
        case "maimai でらっくす FESTiVAL":
            v = 'object-version-maimai-dx-festival.png';
            break;
        case "maimai でらっくす FESTiVAL PLUS":
            v = 'object-version-maimai-dx-festival-plus.png';
            break;
        case "maimai でらっくす BUDDiES":
            v = 'object-version-maimai-dx-buddies.png';
            break;
        case "maimai でらっくす BUDDiES PLUS":
            v = 'object-version-maimai-dx-buddies-plus.png';
            break;
        case "maimai でらっくす PRiSM":
            v = 'object-version-maimai-dx-prism.png';
            break;
        case "maimai でらっくす PRiSM PLUS":
            return ''
            //v = 'object-version-maimai-dx-prism-plus.png';
            //break;
        default:
            return ''
    }

    return getImageFromV3('Maimai', v)
}

export function getMaimaiVersionAbbreviation(version = '') {
    switch (version) {
        case "maimai":
            return 'MAI'
        case "maimai PLUS":
            return 'MAI-P'
        case "maimai GreeN":
            return 'GRN'
        case "maimai GreeN PLUS":
            return 'GRN-P'
        case "maimai ORANGE":
            return 'ORA'
        case "maimai ORANGE PLUS":
            return 'ORA-P'
        case "maimai PiNK":
            return 'PNK'
        case "maimai PiNK PLUS":
            return 'PNK-P'
        case "maimai MURASAKi":
            return 'MSK'
        case "maimai MURASAKi PLUS":
            return 'MSK-P'
        case "maimai MiLK":
            return 'MLK'
        case "MiLK PLUS":
            return 'MLK-P'
        case "maimai FiNALE":
            return 'FNL'
        case "maimai でらっくす":
            return 'DX'
        case "maimai でらっくす PLUS":
            return 'DX-P'
        case "maimai でらっくす Splash":
            return 'SPL'
        case "maimai でらっくす Splash PLUS":
            return 'SPL-P'
        case "maimai でらっくす UNiVERSE":
            return 'UNI'
        case "maimai でらっくす UNiVERSE PLUS":
            return 'UNI-P'
        case "maimai でらっくす FESTiVAL":
            return 'FES'
        case "maimai でらっくす FESTiVAL PLUS":
            return 'FES-P'
        case "maimai でらっくす BUDDiES":
            return 'BUD'
        case "maimai でらっくす BUDDiES PLUS":
            return 'BUD-P'
        case "maimai でらっくす PRiSM":
            return 'PRS'
        case "maimai でらっくす PRiSM PLUS":
            return 'PRS-P'
        default:
            return ''
    }
}

export function getMaimaiCategory(genre = '') {
    switch (genre.trim()) {
        case "东方Project":
        case "東方Project":
            return "Touhou Project";

        case "maimai":
        case "舞萌":
            return "maimai";

        case "niconico & VOCALOID":
            return "niconico & VOCALOID";

        case "POPSアニメ":
        case "流行&动漫":
            return "POPS & ANIME";

        case "其他游戏":
            return "GAME & VARIETY";

        case "オンゲキCHUNITHM":
        case "音击&中二节奏":
            return "Ongeki & CHUNITHM";

        default:
            return genre.toString();

    }
}

export function getMaimaiDifficultyName(index = 0) {
    switch (index) {
        case 0: return 'BASIC'
        case 1: return 'ADVANCED'
        case 2: return 'EXPERT'
        case 3: return 'MASTER'
        case 4: return 'Re:MASTER'
        default: return 'U.TA.GE'
    }
}

export function getMaimaiDifficultyColor(index = 0) {
    switch (index) {
        case 0: return '#009944'
        case 1: return '#fff100'
        case 2: return '#d32f2f'
        case 3: return '#9922ee'
        case 4: return '#f7d8fe'
        default: return '#d46da1'
    }
}



export function getMaimaiDifficultyColors(index = 0) {
    let color1
    let color2

    switch (index) {
        case 0: {
            color1 = '#009944'
            color2 = '#109900'
            break
        }
        case 1: {
            color1 = '#fff100'
            color2 = '#ffbb00'
            break
        }
        case 2: {
            color1 = '#f44336'
            color2 = '#f43681'
            break
        }
        case 3: {
            color1 = '#9922ee'
            color2 = '#cc22ee'
            break
        }
        case 4: {
            color1 = '#f7d8fe'
            color2 = '#fed8ec'
            break
        }
        default: {
            color1 = '#d46da1'
            color2 = '#d46d60'
            break
        }
    }

    return {
        color1: color1,
        color2: color2,
    }
}



export async function getCHUNITHMCover(song_id = 0) {
    const song = song_id.toString()
    const path = getImageFromV3('Chunithm', 'Cover', `${song}.png`);

    if (fs.existsSync(path)) {
        return path
    } else {
        return await readNetImage(`https://assets2.lxns.net/chunithm/jacket/${song}.png`, true, getImageFromV3('Chunithm', 'Cover', '0.png'))
    }
}

export function getCHUNITHMRankBG(score = 0) {
    let out;

    switch (getCHUNITHMRank(score)) {
        case 'sssp':
        case 'sss':
            out = 'object-score-backimage-PF.jpg';
            break;
        case 'ssp':
        case 'ss':
            out = 'object-score-backimage-SSS.jpg';
            break;
        case 'sp':
        case 's':
            out = 'object-score-backimage-X.jpg';
            break;
        case 'aaa':
        case 'aa':
        case 'a':
            out = 'object-score-backimage-S.jpg';
            break;
        case 'bbb':
        case 'bb':
        case 'b':
            out = 'object-score-backimage-B.jpg';
            break;
        case 'c':
            out = 'object-score-backimage-A.jpg';
            break;
        case 'd':
            out = 'object-score-backimage-F.jpg';
            break;
        default:
            out = 'object-score-backimage-SH.jpg';
            break;
    }

    return getImageFromV3(out)
}

export function getCHUNITHMRating(score = 0, difficulty = 0) {
    if (typeof score != "number") return 0

    if (score >= 1009000) return difficulty + 2.15
    else if (score >= 1007500) return difficulty + 2 + Math.floor((score - 1007500) / 100) * 0.01
    else if (score >= 1005000) return difficulty + 1.5 + Math.floor((score - 1005000) / 50) * 0.01
    else if (score >= 1000000) return difficulty + 1 + Math.floor((score - 1000000) / 100) * 0.01
    else if (score >= 975000) return difficulty + Math.floor((score - 975000) / 250) * 0.01
    else if (score >= 925000) return Math.max(difficulty - 3, 0)
    else if (score >= 900000) return Math.max(difficulty - 5, 0)
    else if (score >= 800000) return Math.max(difficulty - 5, 0) / 2
    else if (score >= 500000) return 0
    else return 0
}

export function getCHUNITHMRank(score = 0) {
    if (typeof score != "number") return 'd'

    if (score >= 1009000) return 'sssp'
    else if (score >= 1007500) return 'sss'
    else if (score >= 1005000) return 'ssp'
    else if (score >= 1000000) return 'ss'
    else if (score >= 975000) return 's'
    else if (score >= 950000) return 'aaa'
    else if (score >= 925000) return 'aa'
    else if (score >= 900000) return 'a'
    else if (score >= 800000) return 'bbb'
    else if (score >= 700000) return 'bb'
    else if (score >= 600000) return 'b'
    else if (score >= 500000) return 'c'
    else return 'd'
}

export function getCHUNITHMRatingBG(rating = 0) {
    let background;

    if (rating < 4) background = 'object-score-backimage-A.jpg'
    else if (rating < 7) background = 'object-score-backimage-SP.jpg'
    else if (rating < 10) background = 'object-score-backimage-D.jpg'
    else if (rating < 12) background = 'object-score-backimage-C.jpg'
    else if (rating < 13.25) background = 'object-score-backimage-S.jpg'
    else if (rating < 14.5) background = 'object-score-backimage-SH.jpg'
    else if (rating < 15.25) background = 'object-score-backimage-X.jpg'
    else if (rating < 16) background = 'object-score-backimage-XH.jpg'
    else background = 'object-score-backimage-PF.jpg'

    return getImageFromV3(background);
}


export function getCHUNITHMDifficultyColor(index = 0) {
    switch (index) {
        case 1: return '#fff100'
        case 2: return '#d32f2f'
        case 3: return '#9922ee'
        case 4: return '#000000'
        default: return '#009944'
    }
}