package com.anzhilai.core.base;

import com.anzhilai.core.framework.GlobalValues;
import org.springframework.scheduling.support.CronTrigger;

import java.util.concurrent.ScheduledFuture;

// 整个系统的定时器的基础类
//@Component
public class BaseTask {
    // cronExpression的配置说明，具体使用以及参数请百度google
    // 字段 允许值 允许的特殊字符
    // 秒 0-59 , - * /
    // 分 0-59 , - * /
    // 小时 0-23 , - * /
    // 日期 1-31 , - * ? / L W C
    // 月份 1-12 或者 JAN-DEC , - * /
    // 星期 1-7 或者 SUN-SAT , - * ? / L C #
    // 年（可选） 留空, 1970-2099 , - * /
    // - 区间
    // * 通配符
    // ? 你不想设置那个字段
    // 下面只例出几个式子
    //
    // CRON表达式 含义
    // 每隔5秒执行一次：*/5 * * * * ?

    // 每隔1分钟执行一次：0 */1 * * * ?
    // 每隔2小时执行一次：0 * */2 * * ?
    // 0 0/30 9-17 * * ? 朝九晚五工作时间内每半小时
    // "0 0 12 * * ?" 每天中午十二点触发
    // "0 15 10 ? * *" 每天早上10：15触发
    // "0 15 10 * * ?" 每天早上10：15触发
    // "0 15 10 * * ? *" 每天早上10：15触发
    // "0 15 10 * * ? 2005" 2005年的每天早上10：15触发
    // "0 * 14 * * ?" 每天从下午2点开始到2点59分每分钟一次触发
    // "0 0/5 14 * * ?" 每天从下午2点开始到2：55分结束每5分钟一次触发
    // "0 0/5 14,18 * * ?" 每天的下午2点至2：55和6点至6点55分两个时间段内每5分钟一次触发
    // "0 0-5 14 * * ?" 每天14:00至14:05每分钟一次触发
    // "0 10,44 14 ? 3 WED" 三月的每周三的14：10和14：44触发
    // "0 15 10 ? * MON-FRI" 每个周一、周二、周三、周四、周五的10：15触发

    //@Scheduled(fixedDelay = 5000)        //fixedDelay = 5000表示当前方法执行完毕5000ms后，Spring scheduling会再次调用该方法
    //@Scheduled(fixedRate = 5000)        //fixedRate = 5000表示当前方法开始执行5000ms后，Spring scheduling会再次调用该方法
    //@Scheduled(initialDelay = 1000, fixedRate = 5000)   //initialDelay = 1000表示延迟1000ms执行第一次任务
    //@Scheduled(cron = "0 0/1 * * * ?")  //cron接受cron表达式，根据cron表达式确定定时规则
    //(1)cron：cron表达式，指定任务在特定时间执行;
    //(2)fixedDelay：表示上一次任务执行完成后多久再次执行，参数类型为long，单位ms;
    //(3)fixedDelayString：与fixedDelay含义一样，只是参数类型变为String;
    //(4)fixedRate：表示按一定的频率执行任务，参数类型为long，单位ms;
    //(5)fixedRateString: 与fixedRate的含义一样，只是将参数类型变为String;
    //(6)initialDelay：表示延迟多久再第一次执行任务，参数类型为long，单位ms;
    //(7)initialDelayString：与initialDelay的含义一样，只是将参数类型变为String;
    //(8)zone：时区，默认为当前时区，一般没有用到。
    public static ScheduledFuture future;
    public void Schedule(int time){
        if(future!=null) {
            future.cancel(true);
        }
        if(time<0||time>23){
            time  =3;
        }
        //每天凌晨3点触发
        future =  GlobalValues.taskScheduler.schedule(new Runnable() {
            @Override
            public void run() {

            }
        }, new CronTrigger("0 0 " + time + " * * ?"));
    }
    public static final String TIME_每天中午12点 = "0 0 12 * * ?";

    public static final String TIME_每天早上10点15触发 = "0 15 10 ? * *";

    public static final String TIME_每天午夜12点 = "0 0 0 * * ?";

    public static Boolean IsRun = true;// 应该只要有一台服务器作为定时器的运行服务器,怎么做呢?
}
