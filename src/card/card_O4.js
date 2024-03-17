import {getImageFromV3, implantImage, replaceText} from "../util/util.js";
import {torus} from "../util/font.js";

export async function card_O4(data = {
    type: '',
    approval: '',
    title: '',
    time: 'now',
    sid: 0
}) {
    // 读取模板
    let svg =`
          <g id="Background_CO4">
            <rect width="550" height="30" rx="10" ry="10" style="fill: #46393F;"/>
          </g>
          <g id="Image_CO4">
          </g>
          <g id="Text_CO4">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CO4">)/;
    const reg_image = /(?<=<g id="Image_CO4">)/;

    // 插入文本
    if (!data.type) return '';

    const type = getActivityTypeV3Path(data.type, data.approval);
    const color = getActivityTypeColor(data.type, data.approval);
    const operate = getActivityTypeOperate(data.type, data.approval);
    const time = data.time;
    const sid = data.sid;
    const title_song_title = data.title.substring(data.title.indexOf(' - ') + 3) || data.title;

    const title_other_str = sid ? '() \"\" (S)' + time + operate + sid : '() \"\"' + time + operate
    const title_max_width = 490 - torus.getTextWidth(title_other_str, 18);
    const title_cut_str = torus.cutStringTail(title_song_title, 18, title_max_width, true);
    const title_str = sid ?
        '(' + time + ') ' + operate + ' \"'  + title_cut_str + '\" (S' + sid + ')'
        : '(' + time + ') ' + operate + ' \"'  + title_cut_str + '\"';

    const title = torus.getTextPath(title_str, 40, 20, 18, 'left baseline', color);

    svg = implantImage(svg, 30, 30, 5, 0, 1, type, reg_image);
    svg = replaceText(svg, title, reg_text);

    return svg.toString();
}

function getActivityTypeV3Path(type = '', approval = '') {
    let path = '';

    switch (type) {
        case 'beatmapsetApprove': {
            if (approval === 'ranked') path = 'object-beatmap-ranked.png';
            else if (approval === 'qualified') path = 'object-beatmap-qualified.png';
            else return '';
        } break;
        case 'beatmapsetDelete': path = 'object-beatmap-deleted.png'; break;
        case 'beatmapsetRevive': path = 'object-beatmap-restored.png'; break;
        case 'beatmapsetUpdate': path = 'object-beatmap-uploaded.png'; break;
        case 'beatmapsetUpload': path = 'object-beatmap-submitted.png'; break;
        default : return '';
    }

    return getImageFromV3(path);
}

function getActivityTypeColor(type = '', approval = '') {

    switch (type) {
        case 'beatmapsetApprove': {
            if (approval === 'ranked') return '#6ACCFE';
            else if (approval === 'qualified') return '#A5CC00';
            else return '#fff';
        }
        case 'beatmapsetDelete': return '#D56E74';
        case 'beatmapsetRevive': return '#D46DA1';
        case 'beatmapsetUpdate': return '#ADCE6D';
        case 'beatmapsetUpload': return '#FFF767';
        default : return '#fff';
    }
}

function getActivityTypeOperate(type = '', approval = '') {

    switch (type) {
        case 'beatmapsetApprove': {
            if (approval === 'ranked') return 'Rank';
            else if (approval === 'qualified') return 'Qua';
            else return '';
        }
        case 'beatmapsetDelete': return 'Del';
        case 'beatmapsetRevive': return 'Rev';
        case 'beatmapsetUpdate': return 'Upd';
        case 'beatmapsetUpload': return 'Upl';
        default : return '';
    }
}