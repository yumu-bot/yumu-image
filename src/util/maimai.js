import fs from "fs";
import {getImageFromV3, readNetImage} from "./util.js";

export async function getMaimaiBG(song_id = 0) {
    if (typeof song_id == "number" && fs.existsSync(getImageFromV3('Maimai/' + song_id + '.png'))) {
        return getImageFromV3('Maimai/' + song_id + '.png')
    } else {
        let id;

        if (song_id == null) {
            id = 1;
        } else if (song_id === 1235) {
            id = song_id + 10000; // 这是水鱼的 bug，不关我们的事
        } else if (song_id > 10000 && song_id < 11000) {
            id = song_id - 10000;
        } else {
            id = song_id;
        }
        return await readNetImage('https://www.diving-fish.com/covers/' + id.toString().padStart(5, '0') + '.png', true, getImageFromV3('Maimai/00000.png'))
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

export function getMaimaiLevelBG(rating = 0) {
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
            return getImageFromV3('Maimai/object-type-deluxe.png');
        case 'SD':
            return getImageFromV3('Maimai/object-type-standard.png');
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
            v = 'object-version-maimai-murasaki.png';
            break;
        case "MiLK PLUS":
            v = 'object-version-maimai-murasaki-plus.png';
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
            v = 'object-version-maimai-dx-prism-plus.png';
            break;
        default:
            return ''
    }

    return getImageFromV3('Maimai/' + v)
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