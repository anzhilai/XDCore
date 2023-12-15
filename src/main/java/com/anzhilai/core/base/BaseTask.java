package com.anzhilai.core.base;

import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.toolkit.StrUtil;
import org.springframework.scheduling.support.CronTrigger;

import java.util.concurrent.ScheduledFuture;

/**
 * 定时任务的基础类
 * CRON表达式 含义
 * cronExpression的配置说明
 * 字段 允许值 允许的特殊字符
 * 秒 0-59 , - * /
 * 分 0-59 , - * /
 * 小时 0-23 , - * /
 * 日期 1-31 , - * ? / L W C
 * 月份 1-12 或者 JAN-DEC , - * /
 * 星期 1-7 或者 SUN-SAT , - * ? / L C #
 * 年（可选） 留空, 1970-2099 , - * /
 * - 区间
 * * 通配符
 * ? 不想设置那个字段
 */
public abstract class BaseTask {
    public static final String Task_每隔5秒执行一次 = "*/5 * * * * ?";
    public static final String Task_每隔1分钟执行一次 = "0 */1 * * * ?";
    public static final String Task_每隔2小时执行一次 = "0 * */2 * * ?";
    public static final String Task_朝九晚五工作时间内每半小时 = "0 0/30 9-17 * * ?";
    public static final String Task_每天中午十二点触发 = "0 0 12 * * ?";
    public static final String Task_每天早上10点15触发 = "0 15 10 ? * *";
    public static final String Task_2024年的每天早上10点15触发 = "0 15 10 * * ? 2024";
    public static final String Task_每个周一二三四五的10点15触发 = "0 15 10 ? * MON-FRI";
    public static final String Task_每天中午12点 = "0 0 12 * * ?";
    public static final String Task_每天午夜12点 = "0 0 0 * * ?";

    /**
     * 获取任务名称
     */
    public abstract String GetName();


    public enum ScheduleType {
        cron, rate, delay
    }

    /**
     * 获取默认调度规则
     */
    public abstract ScheduleType ScheduleType();

    /**
     * 获取默认调度规则
     */
    public abstract String GetDefaultCron();

    /**
     * 获取默认调度规则
     */
    public abstract long GetDefaultDelay();

    /**
     * 获取默认调度规则
     */
    public abstract long GetDefaultRate();

    /**
     * 执行任务
     */
    public abstract void Run() throws Exception;

    protected ScheduledFuture future;


    /**
     * 动态添加调度任务
     *
     * @param cron 调度规则表达式
     */
    public void Schedule(String cron) {
        this.Cancel();
        if (StrUtil.isNotEmpty(cron)) {
            future = GlobalValues.taskScheduler.schedule(() -> {
                try {
                    Run();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }, new CronTrigger(cron));
        }
    }

    /**
     * 动态添加调度任务
     *
     * @param delay 调度规则表达式
     */
    public void ScheduleWithFixedDelay(long delay) {
        this.Cancel();
        if (delay >= 0) {
            future = GlobalValues.taskScheduler.scheduleWithFixedDelay(() -> {
                try {
                    Run();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }, delay);
        }
    }

    public void Cancel() {
        if (future != null) {
            future.cancel(true);
            future = null;
        }
    }
}
