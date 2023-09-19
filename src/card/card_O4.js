import {getExportFileV3Path, implantImage, PanelDraw, replaceText, replaceTexts} from "../util.js";
import {torus} from "../font.js";

export async function card_O4(data = {
    type: '',
    approval: '',
    title: '',
    time: 'now'
}, reuse = false) {
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

    const title_str = torus.cutStringTail('(' + time + ') ' + operate + ' \"' + data.title, 18, 490 - 5, true) + '\"'; //这里 5 是给引号的

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

    return getExportFileV3Path(path);
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
            if (approval === 'ranked') return 'Ranked';
            else if (approval === 'qualified') return 'Qualified';
            else return '';
        }
        case 'beatmapsetDelete': return 'Deleted';
        case 'beatmapsetRevive': return 'Revived';
        case 'beatmapsetUpdate': return 'Updated';
        case 'beatmapsetUpload': return 'Upload';
        default : return '';
    }
}