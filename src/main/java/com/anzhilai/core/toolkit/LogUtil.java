package com.anzhilai.core.toolkit;

import org.apache.log4j.*;

import java.io.IOException;

public class LogUtil {
    private static boolean isDebug = true;
    private static String TagName = "Log : ";
    private static Logger log = LogUtil.getLogger(LogUtil.class);

    public static Logger getLogger(Class clazz) {
        //设置日志文件
        Logger rootLogger = Logger.getLogger(clazz);

        return rootLogger;
    }

    public static void SetDailyRollingLogger(String logpath) {
        Logger rootLogger = Logger.getRootLogger();
        rootLogger.setLevel(Level.INFO);
        rootLogger.removeAllAppenders();
        PatternLayout patternLayout2 = new PatternLayout();
        patternLayout2.setConversionPattern("[%d{yyyy-MM-dd HH:mm:ss\\} %-5p] [%t] {%c:%L}-%m%n");
        DailyRollingFileAppender dailyRollingFileAppender = null;
        try {
            dailyRollingFileAppender = new DailyRollingFileAppender(patternLayout2, logpath, "'.'yyyy-MM-dd'.log'");
            dailyRollingFileAppender.setImmediateFlush(true);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (dailyRollingFileAppender != null) {
            rootLogger.addAppender(dailyRollingFileAppender);
        }
        PatternLayout patternLayout = new PatternLayout();
        patternLayout.setConversionPattern("[%d{yyyy-MM-dd HH:mm:ss\\} %-5p] [%t] {%c:%L}-%m%n");
        ConsoleAppender consoleAppender = new ConsoleAppender(patternLayout);
        consoleAppender.setTarget("System.out");
        rootLogger.addAppender(consoleAppender);
    }

    public static void i(String info){
        log.info(info);
    }
    public static void i(String info,String content){
        log.info(info+content);
    }
}
