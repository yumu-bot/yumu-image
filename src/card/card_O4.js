import {getImageFromV3, isBlankString, readNetImage, setImage, setText} from "../util/util.js";
import {torus} from "../util/font.js";

export async function card_O4(data = {
    type: '',
    approval: '',
    title: '',
    time: 'now',
    background: '',
}) {
    // 读取模板
    let svg =`<defs>
        <clipPath id="clippath-CO4">
            <rect width="550" height="30" rx="10" ry="10" style="fill: none;"/>
        </clipPath>
        </defs>
          <g id="Base_CO4">
            <rect width="550" height="30" rx="10" ry="10" style="fill: #46393F;"/>
          </g>
          <g id="Background_CO4" clip-path="url(#clippath-CO4)">
          </g>
          <g id="Image_CO4">
          </g>
          <g id="Text_CO4">
          </g>`;

    // 路径定义
    const reg_text = /(?<=<g id="Text_CO4">)/;
    const reg_image = /(?<=<g id="Image_CO4">)/;
    const reg_background = /(?<=<g id="Background_CO4" clip-path="url\(#clippath-CO4\)">)/;

    // 插入文本
    if (isBlankString(data.type)) return '';

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
    const bg = await readNetImage(data?.background, false)

    svg = setImage(svg, 0, 0, 550, 30, bg, reg_background, 0.3);
    svg = setImage(svg, 5, 0, 30, 30, type, reg_image, 1);
    svg = setText(svg, title, reg_text);

    return svg.toString();
}

function getActivityTypeV3Path(type = '', approval = '') {
    let path = '';

    switch (type) {
        case 'BeatmapsetApprove': {
            if (approval === 'ranked') path = 'object-beatmap-ranked.png';
            else if (approval === 'qualified') path = 'object-beatmap-qualified.png';
            else return '';
        } break;
        case 'BeatmapsetDelete': path = 'object-beatmap-deleted.png'; break;
        case 'BeatmapsetRevive': path = 'object-beatmap-restored.png'; break;
        case 'BeatmapsetUpdate': path = 'object-beatmap-uploaded.png'; break;
        case 'BeatmapsetUpload': path = 'object-beatmap-submitted.png'; break;
        default : return '';
    }

    return getImageFromV3(path);
}

function getActivityTypeColor(type = '', approval = '') {

    switch (type) {
        case 'BeatmapsetApprove': {
            if (approval === 'ranked') return '#4fc3f7';
            else if (approval === 'qualified') return '#aeea00';
            else return '#4caf50';
        }
        case 'BeatmapsetDelete': return '#DB567E';
        case 'BeatmapsetRevive': return '#8964CD';
        case 'BeatmapsetUpdate': return '#ff9800';
        case 'BeatmapsetUpload': return '#ffff00';
        default : return '#fff';
    }
}

function getActivityTypeOperate(type = '', approval = '') {

    switch (type) {
        case 'BeatmapsetApprove': {
            if (approval === 'ranked') return 'Ranked';
            else if (approval === 'qualified') return 'Qualified';
            else return 'Approved';
        }
        case 'BeatmapsetDelete': return 'Delete';
        case 'BeatmapsetRevive': return 'Revive';
        case 'BeatmapsetUpdate': return 'Update';
        case 'BeatmapsetUpload': return 'Upload';
        default : return '';
    }
}