package com.anzhilai.core.toolkit;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {

    public static final String FORMAT_DATE = "yyyy-MM-dd";
    public static final String FORMAT_DATE2 = "yyyy/MM/dd";
    public static final String FORMAT_TIME = "HH:mm:ss";
    public static final String FORMAT_DATETIME = FORMAT_DATE + " " + FORMAT_TIME;
    public static final String FORMAT_DATE3 = "yyyyMMdd";

    public static SimpleDateFormat simpleFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm");//如2016-08-10 20:40


    public static String getTimeSpan(long timediff) {
        String result = "";
        int hours = TypeConvert.ToInteger(Math.floor(timediff / (60 * 60)));
        if (hours > 0) {
            timediff -= hours * (60 * 60);
            result += hours + "小时";
        }
        int mins = TypeConvert.ToInteger(Math.floor(timediff / (60)));
        if (mins > 0) {
            timediff -= mins * (60);
        }
        if (hours > 0 || mins > 0) {
            result += mins + "分";
        }
        int secs = TypeConvert.ToInteger(Math.floor(timediff));
        if (secs > 0) {
            timediff -= secs;
        }
        result += secs + "秒";
        return result;
    }



    public static long CompareHourMinuteSecond(Calendar time1, Calendar time2) {
        time1.set(2018, 10, 22);
        time2.set(2018, 10, 22);
        return time1.getTimeInMillis() - time2.getTimeInMillis();
    }

    public static int Get时间天数差(Date fromDate, Date toDate) {
        fromDate.setHours(0);
        fromDate.setMinutes(0);
        fromDate.setSeconds(0);
        long from = fromDate.getTime();
        long to = toDate.getTime();
        int days = (int) ((to - from) / (1000 * 60 * 60 * 24)) + 1; //取整之后加一
        return days;
    }

    public static int Get时间小时差(Date fromDate, Date toDate) {
        long from = fromDate.getTime();
        long to = toDate.getTime();
        int days = (int) ((to - from) / (1000 * 60 * 60));
        return days;
    }

    //region 日期时间转换为某天时间的开始和时间的结束
    // 获得今天的开始时时间
    public static Date GetNowDayStart() {
        return SetDayTimeStart(new Date());
    }

    // 获得今天的结束时的时间
    public static Date GetNowDayEnd() {
        return SetDayTimeEnd(new Date());
    }

    // 将 d 的时间部分设置为一天的开始
    public static Date SetDayTimeStart(Date d) {
        if (d == null) {
            return null;
        }
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTime();
    }

    //获取这个月最后一天
    public static Date GetMonthLastDay(int year,int month){
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month - 1, 1, 0, 0, 0);
        calendar.set(Calendar.DAY_OF_MONTH,calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        return calendar.getTime();
    }

    // 将 d 的时间部分设置为一天的结束
    public static Date SetDayTimeEnd(Date d) {
        if (d == null) {
            return null;
        }
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        return c.getTime();
    }
    //endregion

    //设置当前日期为星期一
    public static Date SetDateInMonday(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int weekDay = calendar.get(Calendar.DAY_OF_WEEK) - 1;
        if (weekDay == 0) {
            weekDay = 7;//星期天
        }
        int _day = weekDay - 1;//和星期一的相差天数
        if (_day > 0) {
            calendar.add(Calendar.DATE, -_day);
        }
        return calendar.getTime();
    }


    // 日期距离现在过去了多少天
    public static long DayIsNowAfterDay(Date 天) {
        long m = new Date().getTime() - 天.getTime();
        return TypeConvert.ToLong(Math.floor(m / (1000 * 3600 * 24.0)));
    }


    // 日期相差多少天
    public static long DaysOfTwo(Date d1, Date d2) {
        long m = Math.abs(d1.getTime() - d2.getTime());
        return TypeConvert.ToLong(Math.floor(m / (1000 * 3600 * 24.0)));
    }

    // 日期相差多少周
    public static long WeekOfTwo(Date d1, Date d2) {
        long m = Math.abs(d1.getTime() - d2.getTime());
        return TypeConvert.ToLong(Math.floor(m / (1000 * 3600 * 24.0 * 7)));
    }

    // 日期相差多少月
    public static int MonthOfTwo(Date d1, Date d2) {
        Calendar c1 = Calendar.getInstance();
        Calendar c2 = Calendar.getInstance();
        c1.setTime(d1);
        c2.setTime(d2);
        int year1 = c1.get(Calendar.YEAR);
        int year2 = c2.get(Calendar.YEAR);
        int month1 = c1.get(Calendar.MONTH) + 1 + year1 * 12;
        int month2 = c2.get(Calendar.MONTH) + 1 + year2 * 12;
        return Math.abs(month1 - month2);
    }

    //region 日期的之前之后之间判断

    // 天 的日期 在不在 今天 之后, 包括等于
    public static boolean DayHasNowAfter(Date 天) {
        return DayHasAfter(天, new Date());
    }

    // 天 的日期 在不在 今天 之前, 包括等于
    public static boolean DayHasNowBefore(Date 天) {
        return DayHasBefore(天, new Date());
    }

    // 天 的日期 在不在 开始的日期 之后, 包括等于
    public static boolean DayHasAfter(Date 天, Date 开始) {
        return HasAfter(SetDayTimeStart(天), SetDayTimeStart(开始));
    }

    // 天 的日期 在不在 结束的日期 之前, 包括等于
    public static boolean DayHasBefore(Date 天, Date 结束) {
        return HasBefore(SetDayTimeEnd(天), SetDayTimeEnd(结束));
    }

    // 天 的 日期 在不在 开始的日期 与 结束的日期 之间, 包括等于
    public static boolean DayHasBetween(long 天, long 开始, long 结束) {
        return DayHasBetween(new Date(天), new Date(开始), new Date(结束));
    }

    public static boolean DayHasBetween(Date 天, Date 开始, Date 结束) {
        return DayHasAfter(天, 开始) && DayHasBefore(天, 结束);
    }
    //endregion

    public static boolean IsEqual(Date t1, Date t2){
        return t1.equals(t2);
    }

    //region 日期时间的之前之后之间判断
    // 时间 在不在 开始 之后, 包括等于
    public static boolean HasAfter(Date 时间, Date 开始) {
        if (时间 == null || 开始 == null) return false;
        return 开始.getTime() <= 时间.getTime();
    }

    // 时间 在不在 结束 之前, 包括等于
    public static boolean HasBefore(Date 时间, Date 结束) {
        if (时间 == null || 结束 == null) return false;
        return 结束.getTime() >= 时间.getTime();
    }

    // 时间 在不在 现在 之前, 包括等于
    public static boolean HasNowBefore(Date 时间) {
        return HasBefore(时间, new Date());
    }

    // 时间 在不在 开始 与 结束 之间, 包括等于
    public static boolean HasBetween(Date 时间, Date 开始, Date 结束) {
        return HasAfter(时间, 开始) && HasBefore(时间, 结束);
    }
    //endregion

    // 使 D 增加 day 天
    public static Date AddDay(Date d, int day) {
        return DateUtil.Add(d, Calendar.DATE, day);
    }

    // 使 D 增加 month 月
    public static Date AddMonth(Date d, int month) {
        return DateUtil.Add(d, Calendar.MONTH, month);
    }

    public static Date AddHour(Date d, double hour) {
        int m = (int) hour * 60;
        return DateUtil.Add(d, Calendar.MINUTE, m);
    }

    public static Date AddMinite(Date d, int minite) {
        return DateUtil.Add(d, Calendar.MINUTE, minite);
    }

    public static int GetHour(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        return c.get(Calendar.HOUR_OF_DAY);
    }

    public static int GetMinite(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        return c.get(Calendar.MINUTE);
    }

    // 使 D 增加 week 周
    public static Date AddWeek(Date d, int week) {
        return DateUtil.Add(d, Calendar.WEEK_OF_YEAR, week);
    }

    public static Date Add(Date d, int type, int num) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        c.add(type, num);
        return c.getTime();
    }

    // 获取一个只有时间的Date
    public static Date NewTime(int hou, int min) {
        Calendar c = Calendar.getInstance();
        c.set(1970, 0, 1, hou, min, 0);
        return c.getTime();
    }

    public static Date GetDate(Date dt) {
        Calendar c = Calendar.getInstance();
        c.setTime(dt);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    public static Date Now(){
        return new Date();
    }

    public static Date Today(){
        return GetDate(new Date());
    }

    // 获取一个只有日期的Date
    public static Date NewDate(int year, int month, int date) {
        Calendar c = Calendar.getInstance();
        c.set(year, month - 1, date, 0, 0, 0);
        return c.getTime();
    }

    // 获取指定日期时间的Date
    public static Date NewDateTime(int year, int month, int date, int hou, int min) {
        Calendar c = Calendar.getInstance();
        c.set(year, month - 1, date, hou, min, 0);
        return c.getTime();
    }

    public static String GetStringHour(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        String s = c.get(Calendar.HOUR) + "点";
        return s;
    }

    public static String GetString年月日(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        String s = c.get(Calendar.YEAR) + "年" + (c.get(Calendar.MONTH) + 1) + "月" + c.get(Calendar.DATE) + "日";
        return s;
    }

    public static String GetString年月周(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        String s = c.get(Calendar.YEAR) + "年" + (c.get(Calendar.MONTH) + 1) + "月" + c.get(Calendar.WEEK_OF_MONTH) + "周";
        return s;
    }

    public static String GetString年周(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        String s = c.get(Calendar.YEAR) + "年" + c.get(Calendar.WEEK_OF_YEAR) + "周";
        return s;
    }

    public static String GetString年月(Date d) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy年MM月");
        return simpleDateFormat.format(d);
//        Calendar c = Calendar.getInstance();
//        c.setTime(d);
//
//        String s = c.get(Calendar.YEAR) + "年" + (c.get(Calendar.MONTH) + 1) + "月";
//        return s;
    }
    public static String GetString年季(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        int j = (c.get(Calendar.MONTH)/3)+1;
        String s = c.get(Calendar.YEAR) + "年" + j + "季度" ;
        return s;
    }
    public static String GetString年(Date d) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy年");
        return simpleDateFormat.format(d);
    }

    public static String GetString星期(Date d) {
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        int weekDay = c.get(Calendar.DAY_OF_WEEK);
        if (Calendar.MONDAY == weekDay) {
            return "星期一";
        }
        if (Calendar.TUESDAY == weekDay) {
            return "星期二";
        }
        if (Calendar.WEDNESDAY == weekDay) {
            return "星期三";
        }
        if (Calendar.THURSDAY == weekDay) {
            return "星期四";
        }
        if (Calendar.FRIDAY == weekDay) {
            return "星期五";
        }
        if (Calendar.SATURDAY == weekDay) {
            return "星期六";
        }
        if (Calendar.SUNDAY == weekDay) {
            return "星期日";
        }
        return "";
    }
    public static String GetString年月日2(Date value) {
        return ToString(value, FORMAT_DATE);
    }
    public static String GetDateString(Date value) {
        return ToString(value, FORMAT_DATE);
    }

    public static String GetDateString(Date date, String pattern) {
        return ToString(date, pattern);
    }

    public static String GetTimeString(Date value) {
        return ToString(value, FORMAT_TIME);
    }

    public static String GetDateTimeString(Date value) {
        return ToString(value, FORMAT_DATETIME);
    }

    public static String GetTimestamp() {
        return ToTimestamp(new Date());
    }

    public static String ToTimestamp(Date value) {
        return ToLongTimestamp(value).substring(0, 10);
    }

    public static String GetLongTimestamp() {
        return ToLongTimestamp(new Date());
    }

    public static String ToLongTimestamp(Date value) {
        String time = TypeConvert.ToString(value.getTime());
        return time;
    }

    /**
     * 目标时间距离现在过去了多少毫秒
     *
     * @param value
     * @return
     */
    public static long BeforeTimestamp(Date value) {
        return System.currentTimeMillis() - value.getTime();
    }

    //计算两个时间相差的月份
    public static double BetweenMonths(Date date1, Date date2) {
        if (date1.getTime() > date2.getTime()) {
            Date date = date1;
            date1 = date2;
            date2 = date;
        }
        ZoneId zoneId = ZoneId.systemDefault();
        LocalDate localDate1 = date1.toInstant().atZone(zoneId).toLocalDate();
        LocalDate localDate2 = date2.toInstant().atZone(zoneId).toLocalDate();

        Period period = Period.between(localDate1, localDate2);
        double ret = period.getYears() * 12 + period.getMonths();
        int day = period.getDays();
        if (day > 0) {
            int monthDay = (int) ((DateUtil.AddMonth(date1, 1).getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));//一个月有多少天
            double value = DoubleUtil.divide((double) day, (double) monthDay, 2);
            ret = DoubleUtil.add(ret, value);
        }
        return ret;
    }

    //这个月的第一天
    public static Date getFirstOfMonth(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.add(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    //这个月的最后一天
    public static Date getLastOfMonth(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.add(Calendar.MONTH, 1);
        c.set(Calendar.DAY_OF_MONTH, 1);
        c.add(Calendar.DATE, -1);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        return c.getTime();
    }

    //上个月的第一天
    public static Date getFirstOfMonth2(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.add(Calendar.MONTH, -1);
        c.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    //上个月的最后一天
    public static Date getLastOfMonth2(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.add(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);
        c.add(Calendar.DATE, -1);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        return c.getTime();
    }


    //今年的第一天
    public static Date getFirstOfMonth3(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.set(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    //今年的最后一天
    public static Date getLastOfMonth3(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.add(Calendar.YEAR, 1);
        c.set(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天
        c.add(Calendar.DATE, -1);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        return c.getTime();
    }

    //去年的第一天
    public static Date getFirstOfMonth4(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.add(Calendar.YEAR, -1);
        c.set(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    //去年的最后一天
    public static Date getLastOfMonth4(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        c.set(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天
        c.add(Calendar.DATE, -1);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        return c.getTime();
    }


    public static Date getFirstOfWeek(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        int d = 0;
        if (c.get(Calendar.DAY_OF_WEEK) == 1) {
            d = -6;
        } else {
            d = 2 - c.get(Calendar.DAY_OF_WEEK);
        }
        c.add(Calendar.DAY_OF_WEEK, d);
        return c.getTime();
    }

    public static Date getLastOfWeek(Date value) {
        Calendar c = Calendar.getInstance();
        c.setTime(value);
        int d = 0;
        if (c.get(Calendar.DAY_OF_WEEK) == 1) {
            d = -6;
        } else {
            d = 2 - c.get(Calendar.DAY_OF_WEEK);
        }
        c.add(Calendar.DAY_OF_WEEK, d);
        c.add(Calendar.DAY_OF_WEEK, 6);
        return c.getTime();
    }


    public static String ToString(Date value, String format) {
        if (value == null) {
            value = new Date();
        }
        SimpleDateFormat df = new SimpleDateFormat(format);
        return df.format(value);
    }

    public static final String YYYYMMDD = "yyyy-MM-dd";
    public static final String YYYYMMDD_ZH = "yyyy年MM月dd日";
    public static final int  FIRST_DAY_OF_WEEK = Calendar.MONDAY; //中国周一是一周的第一天

    /*** 取得日期：年
     *
     *@paramdate
     *@return

     */

    public static int getYear(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  year = c.get(Calendar.YEAR);
        return year;

    }

    /*** 取得日期：年
     *
     *@paramdate
     *@return

     */

    public static int getMonth(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  month = c.get(Calendar.MONTH);
        return  month + 1;

    }

    /*** 取得日期：年
     *
     *@paramdate
     *@return

     */

    public static int getDay(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  da = c.get(Calendar.DAY_OF_MONTH);
        return da;

    }

    /*** 取得当天日期是周几
     *
     *@paramdate
     *@return

     */

    public static int getWeekDay(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  week_of_year = c.get(Calendar.DAY_OF_WEEK);
        return  week_of_year - 1;

    }

    /*** 取得一年的第几周
     *
     *@paramdate
     *@return

     */

    public static int getWeekOfYear(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  week_of_year = c.get(Calendar.WEEK_OF_YEAR);
        return week_of_year;

    }

    /*** 取得月的剩余天数
     *
     *@paramdate
     *@return

     */

    public static int getRemainDayOfMonth(Date date) {
        int  dayOfMonth = getDayOfMonth(date);
        int  day = getPassDayOfMonth(date);
        return  dayOfMonth - day;

    }

    /*** 取得月已经过的天数
     *
     *@paramdate
     *@return

     */

    public static int getPassDayOfMonth(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);
        return c.get(Calendar.DAY_OF_MONTH);

    }

    /*** 取得月天数
     *
     *@paramdate
     *@return

     */

    public static int getDayOfMonth(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);
        return c.getActualMaximum(Calendar.DAY_OF_MONTH);

    }



    /*** 取得季度剩余天数
     *
     *@paramdate
     *@return

     */

    public static int  getRemainDayOfSeason(Date date) {
        return  getDayOfSeason(date) - getPassDayOfSeason(date);

    }


    /*** 取得季度月
     *
     *@paramdate
     *@return

     */

    public static Date[] getSeasonDate(Date date) {
        Date[] season = new Date[3];

        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  nSeason = getSeason(date);
        if (nSeason == 1) {//第一季度

            c.set(Calendar.MONTH, Calendar.JANUARY);

            season[0] = c.getTime();

            c.set(Calendar.MONTH, Calendar.FEBRUARY);

            season[1] = c.getTime();

            c.set(Calendar.MONTH, Calendar.MARCH);

            season[2] = c.getTime();

        } else if (nSeason == 2) {//第二季度

            c.set(Calendar.MONTH, Calendar.APRIL);

            season[0] = c.getTime();

            c.set(Calendar.MONTH, Calendar.MAY);

            season[1] = c.getTime();

            c.set(Calendar.MONTH, Calendar.JUNE);

            season[2] = c.getTime();

        } else if (nSeason == 3) {//第三季度

            c.set(Calendar.MONTH, Calendar.JULY);

            season[0] = c.getTime();

            c.set(Calendar.MONTH, Calendar.AUGUST);

            season[1] = c.getTime();

            c.set(Calendar.MONTH, Calendar.SEPTEMBER);

            season[2] = c.getTime();

        } else if (nSeason == 4) {//第四季度

            c.set(Calendar.MONTH, Calendar.OCTOBER);

            season[0] = c.getTime();

            c.set(Calendar.MONTH, Calendar.NOVEMBER);

            season[1] = c.getTime();

            c.set(Calendar.MONTH, Calendar.DECEMBER);

            season[2] = c.getTime();

        }
        return season;

    }


    /***
     *@paramstrDate
     *@return

     */

    public static Date parseDate(String strDate) {
        return  parseDate(strDate, null);

    }

    /*** parseDate
     *
     *@paramstrDate
     *@parampattern
     *@return

     */

    public static Date parseDate(String strDate, String pattern) {
        Date date = null;
        try {
            if (pattern == null) {
                pattern = YYYYMMDD;

            }

            SimpleDateFormat format = new SimpleDateFormat(pattern);

            date = format.parse(strDate);

        } catch (Exception e) {


        }
        return date;

    }

    /*** format date
     *
     *@paramdate
     *@return

     */

    public static String formatDate(Date date) {
        return  formatDate(date, null);

    }

    /*** format date
     *
     *@paramdate
     *@parampattern
     *@return
     */
    public static String formatDate(Date date, String pattern) {
        String strDate = null;
        try {
            if (pattern == null) {
                pattern = YYYYMMDD;

            }

            SimpleDateFormat format = new SimpleDateFormat(pattern);

            strDate = format.format(date);

        } catch (Exception e) {


        }
        return strDate;

    }


    /*** getWeekBeginAndEndDate
     *
     *@paramdate
     *@parampattern
     *@return

     */

    public static String getWeekBeginAndEndDate(Date date, String pattern) {
        Date monday = getMondayOfWeek(date);

        Date sunday = getSundayOfWeek(date);
        return  formatDate(monday, pattern) + " - "

                + formatDate(sunday, pattern);

    }

    /*** 根据日期取得对应周周一日期
     *
     *@paramdate
     *@return

     */

    public static Date getMondayOfWeek(Date date) {
        Calendar monday = Calendar.getInstance();

        monday.setTime(date);

        monday.setFirstDayOfWeek(FIRST_DAY_OF_WEEK);

        monday.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        return monday.getTime();

    }

    /*** 根据日期取得对应周周日日期
     *
     *@paramdate
     *@return

     */

    public static Date getSundayOfWeek(Date date) {
        Calendar sunday = Calendar.getInstance();

        sunday.setTime(date);

        sunday.setFirstDayOfWeek(FIRST_DAY_OF_WEEK);

        sunday.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        return sunday.getTime();

    }

    /*** 取得月第一天
     *
     *@paramdate
     *@return

     */

    public static Date getFirstDateOfMonth(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);

        c.set(Calendar.DAY_OF_MONTH, c.getActualMinimum(Calendar.DAY_OF_MONTH));
        return c.getTime();

    }

    /*** 取得月最后一天
     *
     *@paramdate
     *@return

     */

    public static Date getLastDateOfMonth(Date date) {
        Calendar c = Calendar.getInstance();

        c.setTime(date);

        c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
        return c.getTime();

    }

    /*** 取得季度第一天
     *
     *@paramdate
     *@return

     */

    public static Date getFirstDateOfSeason(Date date) {
        return  getFirstDateOfMonth(getSeasonDate(date)[0]);

    }

    /*** 取得季度最后一天
     *
     *@paramdate
     *@return

     */

    public static Date getLastDateOfSeason(Date date) {
        return  getLastDateOfMonth(getSeasonDate(date)[2]);

    }


    /*** 取得季度天数
     *
     *@paramdate
     *@return

     */

    public static int getDayOfSeason(Date date) {
        int  day = 0;

        Date[] seasonDates = getSeasonDate(date);
        for (Date date2 : seasonDates) {
            day += getDayOfMonth(date2);

        }
        return day;

    }
    /*** 取得季度已过天数
     *
     *@paramdate
     *@return

     */

    public static int  getPassDayOfSeason(Date date) {
        int  day = 0;

        Date[] seasonDates = getSeasonDate(date);

        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  month = c.get(Calendar.MONTH);
        if (month == Calendar.JANUARY || month == Calendar.APRIL || month == Calendar.JULY || month == Calendar.OCTOBER) {//季度第一个月

            day = getPassDayOfMonth(seasonDates[0]);

        } else if (month == Calendar.FEBRUARY || month == Calendar.MAY || month == Calendar.AUGUST || month == Calendar.NOVEMBER) {//季度第二个月

            day = getDayOfMonth(seasonDates[0]) + getPassDayOfMonth(seasonDates[1]);

        } else if (month == Calendar.MARCH || month == Calendar.JUNE || month == Calendar.SEPTEMBER || month == Calendar.DECEMBER) {//季度第三个月

            day = getDayOfMonth(seasonDates[0]) + getDayOfMonth(seasonDates[1]) + getPassDayOfMonth(seasonDates[2]);

        }
        return day;

    }

    /***
     * 1 第一季度 2 第二季度 3 第三季度 4 第四季度
     *
     *@paramdate
     *@return

     */

    public static int  getSeason(Date date) {
        int  season = 0;

        Calendar c = Calendar.getInstance();

        c.setTime(date);
        int  month = c.get(Calendar.MONTH);
        switch (month) {
            case Calendar.JANUARY:case Calendar.FEBRUARY:case Calendar.MARCH:

                season = 1;
                break;
            case Calendar.APRIL:case Calendar.MAY:case Calendar.JUNE:

                season = 2;
                break;
            case Calendar.JULY:case Calendar.AUGUST:case Calendar.SEPTEMBER:

                season = 3;
                break;
            case Calendar.OCTOBER:case Calendar.NOVEMBER:case Calendar.DECEMBER:

                season = 4;
                break;
            default:
                break;

        } return season;

    }
}
