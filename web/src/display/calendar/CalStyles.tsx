import styled from "styled-components";
import dayjs from "dayjs";
import React from "react";

const CalStyle = styled.div`
.tui-full-calendar-time-schedule-content{
  overflow:auto !important;
}
.tui-full-calendar-weekday-schedule.tui-full-calendar-weekday-schedule-time{
  overflow:hidden;
}`

const CalTemplate = { //配置模板
  milestone: function (schedule) {
    return '<span class="calendar-font-icon ic-milestone-b"/> <span style="background-color: ' + schedule.bgColor + '">' + schedule.title + '</span>';
  },
  milestoneTitle: function () {
    return '<span class="tui-full-calendar-left-content">重要事件</span>';
  },
  task: function (schedule) {
    return '#' + schedule.title;
  },
  taskTitle: function () {
    return '<span class="tui-full-calendar-left-content">任务</span>';
  },
  alldayTitle: function () {
    return '<span class="tui-full-calendar-left-content">全天</span>';
  },
  time: function (schedule) {
    let json:any = {};
    let displayBodys = '';
    try {
      if (schedule.body) {
        json = JSON.parse(schedule.body);
        for (let bodyFieldsKey in json.titleFields) {
          if (json[json.titleFields[bodyFieldsKey]]) {
            displayBodys += '<div>';
            if (json.titleDisPlayFields && json.titleDisPlayFields[json.titleFields[bodyFieldsKey]]) {
              displayBodys += '<span>' + json.titleDisPlayFields[json.titleFields[bodyFieldsKey]] + ' : </span>';
            } else {
              displayBodys += '<span>' + json.titleFields[bodyFieldsKey] + ' : </span>';
            }
            displayBodys += json[json.titleFields[bodyFieldsKey]] + '</div>'
          }
        }
      }
    } catch (e) {
    }
    return displayBodys;
  },
  goingDuration: function (schedule) {
    return '<span class="calendar-icon ic-travel-time"></span>' + schedule.goingDuration + 'min.';
  },
  comingDuration: function (schedule) {
    return '<span class="calendar-icon ic-travel-time"></span>' + schedule.comingDuration + 'min.';
  },
  monthMoreTitleDate: function (date, dayname) {
    var day = date.split('.')[2];

    return '<span class="tui-full-calendar-month-more-title-day">' + day + '</span> <span class="tui-full-calendar-month-more-title-day-label">' + dayname + '</span>';
  },
  monthMoreClose: function () {
    return '<span class="tui-full-calendar-icon tui-full-calendar-ic-close"></span>';
  },
  monthGridHeader: function (dayModel) {
    var date = parseInt(dayModel.date.split('-')[2], 10);
    var classNames = ['tui-full-calendar-weekday-grid-date '];

    if (dayModel.isToday) {
      classNames.push('tui-full-calendar-weekday-grid-date-decorator');
    }

    return '<span class="' + classNames.join(' ') + '">' + date + '</span>';
  },
  monthGridHeaderExceed: function (hiddenSchedules) {
    return '<span class="weekday-grid-more-schedules">+' + hiddenSchedules + '</span>';
  },
  monthGridFooter: function () {
    return '';
  },
  monthGridFooterExceed: function (hiddenSchedules) {
    return '';
  },
  monthDayname: function (model) {
    return (model.label).toString().toLocaleUpperCase();
  },
  weekDayname: function (model) {
    return '<span class="tui-full-calendar-dayname-date">' + model.date + '</span>&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name">' + model.dayName + '</span>';
  },
  weekGridFooterExceed: function (hiddenSchedules) {
    return '+' + hiddenSchedules;
  },
  dayGridTitle: function (viewName) {
    // use another functions instead of 'dayGridTitle'
    // milestoneTitle: function() {...}
    // taskTitle: function() {...}
    // alldayTitle: function() {...}
    var title = '';
    switch (viewName) {
      case 'milestone':
        title = '<span class="tui-full-calendar-left-content">重要事件</span>';
        break;
      case 'task':
        title = '<span class="tui-full-calendar-left-content">任务</span>';
        break;
      case 'allday':
        title = '<span class="tui-full-calendar-left-content">全天</span>';
        break;
    }
    return title;
  },
  popupIsAllDay: function () {
    return '全天';
  },
  popupStateFree: function () {
    return '待完成';
  },
  popupStateBusy: function () {
    return '已完成';
  },
  titlePlaceholder: function () {
    return '主题';
  },
  locationPlaceholder: function () {
    return '地址';
  },
  startDatePlaceholder: function () {
    return '开始时间';
  },
  endDatePlaceholder: function () {
    return '结束时间';
  },
  popupSave: function () {
    return '新增';
  },
  popupUpdate: function () {
    return '保存';
  },
  popupDetailDate: function (isAllDay, start, end) {
    var isSameDate = dayjs(start.getTime()).isSame(end.getTime());
    var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm a';

    if (isAllDay) {
      return dayjs(start.getTime()).format('YYYY.MM.DD hh:mm:ss') + (isSameDate ? '' : ' - ' + dayjs(end.getTime()).format('YYYY.MM.DD hh:mm:ss'));
    }
    return (dayjs(start.getTime()).format('YYYY.MM.DD hh:mm a') + ' - ' + dayjs(end.getTime()).format(endFormat));
  },
  popupDetailLocation: function (schedule) {
    let location=schedule.location;
    if(location){
      if(location.startsWith("http")){
        location=<a href={schedule.location}>点击进入</a>
      }
    }
    return '待办来源 : ' + location;
  },
  popupDetailUser: function (schedule) {
    return '参与者 : ' + (schedule.attendees || []).join(', ');
  },
  popupDetailState: function (schedule) {
    return '代办状态 : ' + schedule.state;
  },
  popupDetailRepeat: function (schedule) {
    return '重复 : ' + schedule.recurrenceRule;
  },
  popupDetailBody: function (schedule) {
    let json:any = {};
    let displayBodys = '';
    try {
      if (schedule.body) {
        json = JSON.parse(schedule.body);
        for (let bodyFieldsKey in json.bodyFields) {
          if (json[json.bodyFields[bodyFieldsKey]]) {
            displayBodys += '<div>';
            if (json.bodyDisplayField && json.bodyDisplayField[json.bodyFields[bodyFieldsKey]]) {
              displayBodys += '<span>' + json.bodyDisplayField[json.bodyFields[bodyFieldsKey]] + ' : </span>';
            } else {
              displayBodys += '<span>' + json.bodyFields[bodyFieldsKey] + ' : </span>';
            }
            displayBodys += json[json.bodyFields[bodyFieldsKey]] + '</div>'
          }
        }
      }
    } catch (e) {
    }
    return displayBodys;
  },
  popupEdit: function () {
    return '编辑';
  },
  popupDelete: function () {
    return '删除';
  }
}

//月样式
const MONTHLY_CUSTOM_THEME = {
  // month header 'dayname'
  'month.dayname.height': '42px',
  'month.dayname.borderLeft': 'none',
  'month.dayname.paddingLeft': '8px',
  'month.dayname.paddingRight': '0',
  'month.dayname.fontSize': '13px',
  'month.dayname.backgroundColor': 'inherit',
  'month.dayname.fontWeight': 'normal',
  'month.dayname.textAlign': 'left',

  // month day grid cell 'day'
  'month.holidayExceptThisMonth.color': '#f3acac',
  'month.dayExceptThisMonth.color': '#bbb',
  'month.weekend.backgroundColor': '#fafafa',
  'month.day.fontSize': '16px',

  // month schedule style
  'month.schedule.borderRadius': '5px',
  'month.schedule.height': '18px',
  'month.schedule.marginTop': '2px',
  'month.schedule.marginLeft': '10px',
  'month.schedule.marginRight': '10px',

  // month more view
  'month.moreView.boxShadow': 'none',
  'month.moreView.paddingBottom': '0',
  'month.moreView.border': '1px solid #9a935a',
  'month.moreView.backgroundColor': '#f9f3c6',
  'month.moreViewTitle.height': '28px',
  'month.moreViewTitle.marginBottom': '0',
  'month.moreViewTitle.backgroundColor': '#f4f4f4',
  'month.moreViewTitle.borderBottom': '1px solid #ddd',
  'month.moreViewTitle.padding': '0 10px',
  'month.moreViewList.padding': '10px'
};

//通用样式
const COMMON_THEME = {
  'common.border': '1px solid #ffbb3b',
  'common.backgroundColor': '#ffbb3b0f',
  'common.holiday.color': '#f54f3d',
  'common.saturday.color': '#3162ea',
  'common.dayname.color': '#333'
};

//周样式
const WEEKLY_CUSTOM_THEME = {
  // week header 'dayname'
  'week.dayname.height': '41px',
  'week.dayname.borderTop': '1px solid #ddd',
  'week.dayname.borderBottom': '1px solid #ddd',
  'week.dayname.borderLeft': '1px solid #ddd',
  'week.dayname.paddingLeft': '5px',
  'week.dayname.backgroundColor': 'inherit',
  'week.dayname.textAlign': 'left',
  'week.today.color': '#b857d8',
  'week.pastDay.color': '#999',

  // week vertical panel 'vpanel'
  'week.vpanelSplitter.border': '1px solid #ddd',
  'week.vpanelSplitter.height': '3px',

  // week daygrid 'daygrid'
  'week.daygrid.borderRight': '1px solid #ddd',
  'week.daygrid.backgroundColor': 'inherit',

  'week.daygridLeft.width': '77px',
  'week.daygridLeft.backgroundColor': '#a8def74d',
  'week.daygridLeft.paddingRight': '5px',
  'week.daygridLeft.borderRight': '1px solid #ddd',

  'week.today.backgroundColor': '#b857d81f',
  'week.weekend.backgroundColor': 'inherit',

  // week timegrid 'timegrid'
  'week.timegridLeft.width': '77px',
  'week.timegridLeft.backgroundColor': '#03a9f44d',
  'week.timegridLeft.borderRight': '1px solid #ddd',
  'week.timegridLeft.fontSize': '12px',
  'week.timegridLeftTimezoneLabel.height': '51px',
  'week.timegridLeftAdditionalTimezone.backgroundColor': '#fdfdfd',

  'week.timegridOneHour.height': '48px',
  'week.timegridHalfHour.height': '24px',
  'week.timegridHalfHour.borderBottom': '1px dotted #f9f9f9',
  'week.timegridHorizontalLine.borderBottom': '1px solid #eee',

  'week.timegrid.paddingRight': '10px',
  'week.timegrid.borderRight': '1px solid #ddd',
  'week.timegridSchedule.borderRadius': '0',
  'week.timegridSchedule.paddingLeft': '0',

  'week.currentTime.color': '#135de6',
  'week.currentTime.fontSize': '12px',
  'week.currentTime.fontWeight': 'bold',

  'week.pastTime.color': '#808080',
  'week.pastTime.fontWeight': 'normal',

  'week.futureTime.color': '#333',
  'week.futureTime.fontWeight': 'normal',

  'week.currentTimeLinePast.border': '1px solid rgba(19, 93, 230, 0.3)',
  'week.currentTimeLineBullet.backgroundColor': '#135de6',
  'week.currentTimeLineToday.border': '1px solid #135de6',
  'week.currentTimeLineFuture.border': '1px solid #135de6',

  // week creation guide style
  'week.creationGuide.color': '#135de6',
  'week.creationGuide.fontSize': '12px',
  'week.creationGuide.fontWeight': 'bold',

  // week daygrid schedule style
  'week.dayGridSchedule.borderRadius': '0',
  'week.dayGridSchedule.height': '18px',
  'week.dayGridSchedule.marginTop': '2px',
  'week.dayGridSchedule.marginLeft': '10px',
  'week.dayGridSchedule.marginRight': '10px'
};

const ThemeConfig = {
  'common.border': '1px solid #e5e5e5',
  'common.backgroundColor': 'white',
  'common.holiday.color': '#ff4040',
  'common.saturday.color': '#333',
  'common.dayname.color': '#333',
  'common.today.color': '#333',

// creation guide style
  'common.creationGuide.backgroundColor': 'rgba(81, 92, 230, 0.05)',
  'common.creationGuide.border': '1px solid #515ce6',

// month header 'dayname'
  'month.dayname.height': '42px',
  'month.dayname.borderLeft': '1px solid #e5e5e5',
  'month.dayname.paddingLeft': '10px',
  'month.dayname.paddingRight': '10px',
  'month.dayname.backgroundColor': 'inherit',
  'month.dayname.fontSize': '12px',
  'month.dayname.fontWeight': 'normal',
  'month.dayname.textAlign': 'left',

// month day grid cell 'day'
  'month.holidayExceptThisMonth.color': 'rgba(255, 64, 64, 0.4)',
  'month.dayExceptThisMonth.color': 'rgba(51, 51, 51, 0.4)',
  'month.weekend.backgroundColor': 'inherit',
  'month.day.fontSize': '14px',

// month schedule style
  'month.schedule.borderRadius': '2px',
  'month.schedule.height': '24px',
  'month.schedule.marginTop': '2px',
  'month.schedule.marginLeft': '8px',
  'month.schedule.marginRight': '8px',

// month more view
  'month.moreView.border': '1px solid #d5d5d5',
  'month.moreView.boxShadow': '0 2px 6px 0 rgba(0, 0, 0, 0.1)',
  'month.moreView.backgroundColor': 'white',
  'month.moreView.paddingBottom': '17px',
  'month.moreViewTitle.height': '44px',
  'month.moreViewTitle.overflow': 'true',
  'month.moreViewTitle.marginBottom': '12px',
  'month.moreViewTitle.backgroundColor': 'inherit',
  'month.moreViewTitle.borderBottom': 'none',
  'month.moreViewTitle.padding': '12px 17px 0 17px',
  'month.moreViewList.padding': '0 17px',

// week header 'dayname'
  'week.dayname.height': '42px',
  'week.dayname.borderTop': '1px solid #e5e5e5',
  'week.dayname.borderBottom': '1px solid #e5e5e5',
  'week.dayname.borderLeft': 'inherit',
  'week.dayname.paddingLeft': '0',
  'week.dayname.backgroundColor': 'inherit',
  'week.dayname.textAlign': 'left',
  'week.today.color': '#333',
  'week.pastDay.color': '#bbb',

// week vertical panel 'vpanel'
  'week.vpanelSplitter.border': '1px solid #e5e5e5',
  'week.vpanelSplitter.height': '3px',

// week daygrid 'daygrid'
  'week.daygrid.borderRight': '1px solid #e5e5e5',
  'week.daygrid.backgroundColor': 'inherit',

  'week.daygridLeft.width': '72px',
  'week.daygridLeft.backgroundColor': 'inherit',
  'week.daygridLeft.paddingRight': '8px',
  'week.daygridLeft.borderRight': '1px solid #e5e5e5',

  'week.today.backgroundColor': 'rgba(81, 92, 230, 0.05)',
  'week.weekend.backgroundColor': 'inherit',

// week timegrid 'timegrid'
  'week.timegridLeft.width': '72px',
  'week.timegridLeft.backgroundColor': 'inherit',
  'week.timegridLeft.borderRight': '1px solid #e5e5e5',
  'week.timegridLeft.fontSize': '11px',
  'week.timegridLeftTimezoneLabel.height': '40px',
  'week.timegridLeftAdditionalTimezone.backgroundColor': 'white',

  'week.timegridOneHour.height': '52px',
  'week.timegridHalfHour.height': '26px',
  'week.timegridHalfHour.borderBottom': 'none',
  'week.timegridHorizontalLine.borderBottom': '1px solid #e5e5e5',

  'week.timegrid.paddingRight': '8px',
  'week.timegrid.borderRight': '1px solid #e5e5e5',
  'week.timegridSchedule.borderRadius': '2px',
  'week.timegridSchedule.paddingLeft': '2px',

  'week.currentTime.color': '#515ce6',
  'week.currentTime.fontSize': '11px',
  'week.currentTime.fontWeight': 'normal',

  'week.pastTime.color': '#bbb',
  'week.pastTime.fontWeight': 'normal',

  'week.futureTime.color': '#333',
  'week.futureTime.fontWeight': 'normal',

  'week.currentTimeLinePast.border': '1px dashed #515ce6',
  'week.currentTimeLineBullet.backgroundColor': '#515ce6',
  'week.currentTimeLineToday.border': '1px solid #515ce6',
  'week.currentTimeLineFuture.border': 'none',

// week creation guide style
  'week.creationGuide.color': '#515ce6',
  'week.creationGuide.fontSize': '11px',
  'week.creationGuide.fontWeight': 'bold',

// week daygrid schedule style
  'week.dayGridSchedule.borderRadius': '2px',
  'week.dayGridSchedule.height': '24px',
  'week.dayGridSchedule.marginTop': '2px',
  'week.dayGridSchedule.marginLeft': '8px',
  'week.dayGridSchedule.marginRight': '8px',
};
