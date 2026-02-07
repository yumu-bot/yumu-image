import fs from "fs";
import {downloadImage, downloadImageWithPuppeteer, getImageFromV3, getImageFromV3Cache, isEmptyString} from "./util.js";
import {colorArray} from "./color.js";

/**
 *
 * @param song_id
 * @returns {Promise<string>}
 */
export async function getMaimaiCover(song_id = 0) {
    let raw_id;
    let path_id;

    if (song_id == null || !Number.isInteger(song_id)) {
        raw_id = 0;
        path_id = '00000'
    } else if (song_id >= 10000) {
        raw_id = song_id % 10000
        path_id = (raw_id + 10000).toString()
    } else {
        raw_id = song_id
        path_id = song_id.toString().padStart(5, '0')
    }

    const path = getImageFromV3('Maimai', 'Cover', `${path_id}.png`);

    if (fs.existsSync(path)) {
        return path
    } else if (raw_id > 0) {
        const lxns = `https://assets2.lxns.net/maimai/jacket/${raw_id}.png`

        return await downloadImageWithPuppeteer(lxns, path, getImageFromV3('Maimai', 'Cover', '00000.png'))
    } else {
        return getImageFromV3('Maimai', 'Cover', '00000.png')
    }
}

export function getMaimaiDXStarColor(star = 0) {
    if (star >= 5) return '#fbf365'
    else if (star >= 3) return '#ffb84d'
    else if (star >= 1) return '#6fc576'
    else return 'none'
}

export function getMaimaiDXStarLevel(dx = 0, dx_max = 0) {
    if (typeof dx_max !== "number" || dx_max <= 0) return 0

    const div = dx / dx_max;

    if (div >= 0.97) {
        return 5
    } else if (div >= 0.95) {
        return 4
    } else if (div >= 0.93) {
        return 3
    } else if (div >= 0.9) {
        return 2
    } else if (div >= 0.85) {
        return 1
    } else {
        return 0
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
            out = 'object-score-backimage-F.jpg';
            break;
    }

    return getImageFromV3(out)
}

// 图片推荐尺寸：320 * 52，左侧有 50 px 的头像框
export function getMaimaiPlateLegacy(plate_name = "") {
    if (isEmptyString(plate_name)) return ''

    const path = getImageFromV3("Maimai", "Plate", plate_name + ".png")
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

//图片推荐尺寸：720 * 116，左侧有 110 px 的头像框
export async function getMaimaiPlate(plate_id = 0) {
    if (plate_id == null || plate_id === 0) {
        return ''
    }

    const path = getImageFromV3('Maimai', 'Plate', `${plate_id}.png`);
    const default_path = getImageFromV3('Maimai', 'Plate', '0.png')

    if (fs.existsSync(path)) {
        return path
    } else if (plate_id > 0) {
        return await downloadImage(`https://assets2.lxns.net/maimai/plate/${plate_id}.png`, path, default_path)
    } else {
        return default_path
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
            return getImageFromV3Cache('Maimai', 'object-type-deluxe.png');
        case 'SD':
            return getImageFromV3Cache('Maimai', 'object-type-standard.png');
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
        case "maimai MiLK PLUS":
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

export function getMaimaiVersionColor(version = '') {
    switch (version) {
        case "maimai":
        case "maimai PLUS":
            return '#00A29D'
        case "maimai GreeN":
        case "maimai GreeN PLUS":
            return '#D0FD00'
        case "maimai ORANGE":
        case "maimai ORANGE PLUS":
            return '#FF6400'
        case "maimai PiNK":
        case "maimai PiNK PLUS":
            return '#FE006F'
        case "maimai MURASAKi":
        case "maimai MURASAKi PLUS":
            return '#A863A8'
        case "maimai MiLK":
        case "maimai MiLK PLUS":
        case "MiLK PLUS":
            return '#fff'
        case "maimai FiNALE":
            return '#C69C6E'
        case "maimai でらっくす":
        case "maimai でらっくす PLUS":
            return '#7ECEF4'
        case "maimai でらっくす Splash":
        case "maimai でらっくす Splash PLUS":
            return '#79DDB4'
        case "maimai でらっくす UNiVERSE":
        case "maimai でらっくす UNiVERSE PLUS":
            return '#00A0E9'
        case "maimai でらっくす FESTiVAL":
        case "maimai でらっくす FESTiVAL PLUS":
            return '#C59EFE'
        case "maimai でらっくす BUDDiES":
        case "maimai でらっくす BUDDiES PLUS":
            return '#FFCD43'
        case "maimai でらっくす PRiSM":
        case "maimai でらっくす PRiSM PLUS":
            return '#7DFDDD'
        case "maimai でらっくす CiRCLE":
        case "maimai でらっくす CiRCLE PLUS":
            return '#FF43B5'
        default:
            return ''
    }
}

export function getMaimaiVersionAbbreviation(version = '') {
    switch (version) {
        case "maimai":
            return 'MAI'
        case "maimai PLUS":
            return 'MAI+'
        case "maimai GreeN":
            return 'GRN'
        case "maimai GreeN PLUS":
            return 'GRN+'
        case "maimai ORANGE":
            return 'ORG'
        case "maimai ORANGE PLUS":
            return 'ORG+'
        case "maimai PiNK":
            return 'PNK'
        case "maimai PiNK PLUS":
            return 'PNK+'
        case "maimai MURASAKi":
            return 'MSK'
        case "maimai MURASAKi PLUS":
            return 'MSK+'
        case "maimai MiLK":
            return 'MLK'
        case "MiLK PLUS":
            return 'MLK+'
        case "maimai FiNALE":
            return 'FNL'
        case "maimai でらっくす":
            return 'DX'
        case "maimai でらっくす PLUS":
            return 'DX+'
        case "maimai でらっくす Splash":
            return 'SPL'
        case "maimai でらっくす Splash PLUS":
            return 'SPL+'
        case "maimai でらっくす UNiVERSE":
            return 'UNI'
        case "maimai でらっくす UNiVERSE PLUS":
            return 'UNI+'
        case "maimai でらっくす FESTiVAL":
            return 'FES'
        case "maimai でらっくす FESTiVAL PLUS":
            return 'FES+'
        case "maimai でらっくす BUDDiES":
            return 'BUD'
        case "maimai でらっくす BUDDiES PLUS":
            return 'BUD+'
        case "maimai でらっくす PRiSM":
            return 'PRS'
        case "maimai でらっくす PRiSM PLUS":
            return 'PRS+'
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
        case "niconicoボーカロイド":
            return "niconico & VOCALOID";

        case "流行&动漫":
        case "POPSアニメ":
            return "POPS & ANIME";

        case "其他游戏":
        case "ゲームバラエティ":
            return "GAME & VARIETY";

        case "音击&中二节奏":
        case "オンゲキCHUNITHM":
            return "Ongeki & CHUNITHM";

        case "宴会場":
        case "宴会场":
            return "U * TA * GE";

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
    const colors = [
        colorArray.green,
        colorArray.yellow,
        colorArray.red,
        colorArray.purple,
        colorArray.sakura,
        colorArray.magenta

        // ['#009944', '#109900'],
        // ['#fff100', '#ffbb00'],
        // ['#f44336', '#f43681'],
        // ['#9922ee', '#cc22ee'],
        // ['#f7d8fe', '#fed8ec'],
        // ['#d46da1', '#d46d60'] // 默认颜色
    ]

    return colors[index] || colors[5]
}

export async function getCHUNITHMCover(song_id = 0) {
    const song = song_id.toString()
    const path = getImageFromV3('Chunithm', 'Cover', `${song}.png`);

    if (fs.existsSync(path)) {
        return path
    } else if (song_id > 0) {
        return await downloadImageWithPuppeteer(`https://assets2.lxns.net/chunithm/jacket/${song}.png`, path, getImageFromV3('Chunithm', 'Cover', '0.png'))
    } else {
        return getImageFromV3('Chunithm', 'Cover', '0.png')
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

    let rating

    if (score >= 1009000) rating = difficulty + 2.15
    else if (score >= 1007500) rating = difficulty + 2 + 0.15 * (score - 1007500) / (1009000 - 1007500)
    else if (score >= 1005000) rating = difficulty + 1.5 + 0.5 * (score - 1005000) / (1007500 - 1005000)
    else if (score >= 1000000) rating = difficulty + 1 + 0.5 * (score - 1000000) / (1005000 - 1000000)
    else if (score >= 975000) rating = difficulty + (score - 975000) / (1000000 - 975000)
    else if (score >= 925000) rating = difficulty - 3 + (score - 925000) / (975000 - 925000)
    else if (score >= 900000) rating = difficulty - 5 + 2 * (score - 900000) / (925000 - 900000)
    else if (score >= 800000) rating = (difficulty - 5) * (0.5 + 0.5 * (score - 800000) / (900000 - 800000))
    else if (score >= 500000) rating = (difficulty - 5) * (0.5 * (score - 500000) / (800000 - 500000))
    else rating = 0

    return Math.floor(Math.max(rating, 0) * 100) / 100
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