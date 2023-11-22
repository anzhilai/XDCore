import dayjs from 'dayjs';
import {fixedZero} from "./XTools";

/**
 * 时间相关工具
 */
export default class XDate {

  static moment(date?: dayjs.ConfigType) {
    return dayjs(date);
  }

  static dayjs(date?: dayjs.ConfigType) {
    return dayjs(date);
  }

  static format(date, format = "YYYY-MM-DD HH:mm:ss") {
    return dayjs(date).format(format);
  }

  static toFormatString(date, format = "YYYY-MM-DD HH:mm:ss") {
    return dayjs(date).format(format);
  }

  static toFormatString年月日(date) {
    return dayjs(date).format("YYYY-MM-DD");
  }

  static toFormatString年月日时分秒(date) {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  }

  static stringToMoment(strdate) {
    if (strdate) {
      if (strdate == "") {
        return undefined;
      } else {
        let format = "YYYY-MM-DD HH:mm:ss"
        return dayjs(strdate, format);
      }
    }
    return undefined;
  }

  static ToDate(date) {
    if (date) {
      if (date == "") {
        return undefined;
      } else {
        if (typeof date === "string") {
          let str = date.substring(0, 19);
          str = str.replace(/-/g, '/');
          return new Date(str);
        }
        return date;
      }
    }
    return undefined;
  }

  static stringToDate(strdate) {
    if (strdate) {
      if (strdate == "") {
        return undefined;
      } else {
        let str = strdate.substring(0, 19);
        str = str.replace(/-/g, '/');
        return new Date(str);
      }
    }
    return undefined;
  }

  static getDateStr(dd, AddDayCount) {
    if (!(dd instanceof Date)) {
      dd = getDateTime(dd)
    }
    if (!AddDayCount) {
      AddDayCount = 0;
    }
    const newDate = new Date()
    newDate.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
    var y = newDate.getFullYear()
    var m = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)// 获取当前月份的日期，不足10补0
    var d = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()// 获取当前几号，不足10补0
    return y + '-' + m + '-' + d
  }

  static getWeekFirstDate(date) {
    if (typeof (date) == 'string') {
      const time = Date.parse(date)
      date = new Date(time);
    }
    const day = date.getDay();
    let offsize = day > 0 ? ((date.getDay() - 1) * (-1)) : -6;
    return XDate.getDateStr(date, offsize);
  }

  static DateToString(date, format = "YYYY-MM-DD HH:mm:ss") {
    return dayjs(date).format(format);
  }

  static DateNowToString(format = "YYYY-MM-DD HH:mm:ss") {
    return dayjs().format(format);
  }

}


export function stringToDate(strdate) {
  if (strdate) {
    if (strdate == "") {
      return undefined;
    } else {
      let str = strdate.substring(0, 19);
      str = str.replace(/-/g, '/');
      return new Date(str);
    }
  }
  return undefined;
}

export function formatDateTime(inputTime) {
  let date = new Date(inputTime);
  let y = date.getFullYear();
  let m: any = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d: any = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h: any = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute: any = date.getMinutes();
  let second: any = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

export function dateFormat(fmt, date) {
  if (!date) {
    date = new Date();
  }
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
    ;
  }
  ;
  return fmt;
}

export function getTimeSpan(timediff) {
  let result = "";
  let hours = Math.floor(timediff / (60 * 60));
  if (hours > 0) {
    timediff -= hours * (60 * 60);
    result += hours + "小时"
  }
  let mins = Math.floor(timediff / (60));
  if (mins > 0) {
    timediff -= mins * (60);
  }
  if (hours > 0 || mins > 0) {
    result += mins + "分"
  }
  let secs = Math.floor(timediff);
  if (secs > 0) {
    timediff -= secs;
  }
  result += secs + "秒";
  return result;
}


export function getDateTime(dateStr) {
  let datetime = null;
  if (dateStr instanceof Date) {
    datetime = dateStr;
  } else if (dateStr instanceof String) {
    datetime = new Date(dateStr.replace(/-/g, "/"));
  } else {
    datetime = new Date(dateStr);
  }
  return datetime;
}

export function getDateGap(startTime, endTime) {
  if (!(startTime instanceof Date)) {
    startTime = getDateTime(startTime)
  }
  if (!(endTime instanceof Date)) {
    endTime = getDateTime(endTime)
  }
  let time = 1 * 24 * 60 * 60 * 1000;//1天
  var startDay = Math.floor(startTime.getTime() / time);
  var endDay = Math.floor(endTime.getTime() / time);
  return Math.abs(startDay - endDay)
}


export function getDateEnd(dd, AddDayCount) {
  if (!(dd instanceof Date)) {
    dd = getDateTime(dd)
  }
  if (!AddDayCount) {
    AddDayCount = 0;
  }
  dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
  return y + '-' + m + '-' + d + " " + "23:59:59";
}

export function momentToString(m) {
  return m.format('YYYY-MM-DD HH:mm:ss');
}


export function momentToDate(m) {
  return m.toDate();
}

export function DateToMoment(d) {
  return dayjs(d);
}


export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  if (type === 'today') {//今天
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [dayjs(now), dayjs(now.getTime() + (oneDay - 1000))];
  }
  if (type == "yesterday1") {//昨天
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [dayjs(now.getTime() - oneDay), dayjs(now.getTime() - 1000)];
  }
  if (type == "yesterday2") {//前天
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [dayjs(now.getTime() - oneDay - oneDay), dayjs(now.getTime() - oneDay - 1000)];
  }
  if (type === 'week') {//本周
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }
    const beginTime = now.getTime() - (day * oneDay);
    return [dayjs(beginTime), dayjs(beginTime + ((7 * oneDay) - 1000))];
  }
  if (type === 'lastmonth') {//上个月
    const last = dayjs(now).add(-1, 'months').toDate();
    const year = last.getFullYear();
    const month = last.getMonth();
    const nextDate = dayjs(last).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();
    return [dayjs(`${year}-${fixedZero(month + 1)}-01 00:00:00`), dayjs(dayjs(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }
  if (type === 'month') {//本月
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = dayjs(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();
    return [dayjs(`${year}-${fixedZero(month + 1)}-01 00:00:00`), dayjs(dayjs(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }
  if (type === 'year') {
    const year = now.getFullYear();
    return [dayjs(`${year}-01-01 00:00:00`), dayjs(`${year}-12-31 23:59:59`)];
  }
}

