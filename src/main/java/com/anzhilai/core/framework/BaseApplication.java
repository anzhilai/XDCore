package com.anzhilai.core.framework;

import com.anzhilai.core.database.DBSession;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.LockUtil;
import com.anzhilai.core.toolkit.ScanUtil;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * 基础应用类
 * 实现DisposableBean和WebServerFactoryCustomizer接口
 */
public class BaseApplication implements DisposableBean, WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
    /**
     * 获取需要扫描的包
     *
     * @return 需要扫描的包数组
     */
    public String[] GetScanPackages() {
        return new String[]{"com.anzhilai"};
    }

    /**
     * 获取需要排除的包
     *
     * @return 需要排除的包数组
     */
    public String[] GetScanExcludePackages() {
        return new String[]{};
    }

    /**
     * 获取需要扫描的类
     *
     * @return 需要扫描的类列表
     */
    public List<Class> GetScanClasses() {
        List<Class> list = new ArrayList<>();
        for (String basePackage : GetScanPackages()) {
            Set<Class<?>> classes = ScanUtil.getClasses(basePackage);
            for (Class<?> aClass : classes) {
                boolean exists = false;
                for (String packpage : GetScanExcludePackages()) {
                    if (aClass.getName().startsWith(packpage)) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    list.add(aClass);
                }
            }
        }
        return list;
    }

    /**
     * 设置任务调度线程池
     * 各个任务使用各自的线程
     * 一般池子的大小与任务数相同
     *
     * @return 任务调度线程池
     */
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(100);
        GlobalValues.taskScheduler = taskScheduler;
        return taskScheduler;
    }

    /**
     * 自定义Web服务器工厂
     *
     * @param factory 可配置的Web服务器工厂
     */
    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        GlobalValues.baseAppliction = this;
        GlobalValues.checkDebug();

    }

    /**
     * 初始化方法，子类可以覆盖此方法进行初始化操作
     */
    public void init() throws Exception {
    }

    /**
     * 执行SQL语句后的处理方法
     *
     * @param su SQL信息
     * @throws Exception 异常
     */
    public void AfterExecuteSQl(SqlInfo su) throws Exception {

    }


    protected final ThreadLocal<DBSession> DBSessionHOLDER = new ThreadLocal<>();

    /**
     * 获取数据库会话
     *
     * @return 数据库会话
     */
    public synchronized DBSession GetSession() {
        DBSession session = DBSessionHOLDER.get();
        if (session == null) {
            session = new DBSession();
            DBSessionHOLDER.set(session);
        }
        return session;
    }

    /**
     * 关闭数据库会话
     */
    public void CloseSession() {
        DBSessionHOLDER.remove();
    }


    /**
     * 开始数据库会话事务
     */
    public void SessionStart() {
        GetSession().beginTransaction();
    }

    /**
     * 回滚数据库会话事务
     */
    public void SessionRollBack() {
        GetSession().rollbackTransaction();
        DBSessionHOLDER.remove();
    }

    /**
     * 结束数据库会话事务
     */
    public void SessionEnd() {
        GetSession().commitTransaction();
        DBSessionHOLDER.remove();
    }

    /**
     * 销毁方法，实现DisposableBean接口
     */
    @Override
    public void destroy() {
        LockUtil.UnLockAll();
    }
}
