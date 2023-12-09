package com.anzhilai.core.framework;

import com.anzhilai.core.database.DBSession;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.LockUtil;
import com.anzhilai.core.toolkit.ScanUtil;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class BaseApplication implements DisposableBean, WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

    public String[] GetScanPackages() {
        return new String[]{"com.anzhilai"};
    }

    public String[] GetScanExcludePackages() {
        return new String[]{};
    }

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

    @Bean //设置任务调度线程池,各自任务用各自的线程,一般池子的大小与任务数相同
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(100);
        GlobalValues.taskScheduler = taskScheduler;
        return taskScheduler;
    }

    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        GlobalValues.baseAppliction = this;
        GlobalValues.checkDebug();
        this.init();
//        factory.setPort(GlobalValues.CurrentPort);
    }

    public void init() {
    }

    public void AfterExecuteSQl(SqlInfo su) throws Exception {

    }


    private final ThreadLocal<DBSession> DBSessionHOLDER = new ThreadLocal<>();
    public synchronized DBSession GetSession() {
        DBSession session  = DBSessionHOLDER.get();
        if(session==null){
            session = new DBSession();
            DBSessionHOLDER.set(session);
        }
        return session;
    }
    public void SessionStart() {
        GetSession().beginTransaction();
    }
    public void SessionRollBack()  {
        GetSession().rollbackTransaction();
        DBSessionHOLDER.remove();
    }
    public void SessionEnd()  {
        GetSession().commitTransaction();
        DBSessionHOLDER.remove();
    }

    /**
     * 上传文件路径
     *
     * @return
     */
    public String GetUploadFilePath() {
        return "uploadFiles";
    }

    /**
     * 临时文件路径
     *
     * @return
     */
    public String GetTempFilePath() {
        return "tempFiles";
    }

    /**
     * libOffice地址
     *
     * @return
     * @throws Exception
     */
    public String GetLibOfficePath() throws Exception {
        return "";
    }


    @Override
    public void destroy() {
        LockUtil.UnLockAll();
    }
}
