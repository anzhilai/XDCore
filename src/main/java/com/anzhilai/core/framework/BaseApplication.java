package com.anzhilai.core.framework;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class BaseApplication implements DisposableBean, WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

    @Value("${spring.datasource.url}")
    public String DatasourceUrl;

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
        taskScheduler.setPoolSize(20);
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

    public void ExecuteSqlInfo(boolean isUpdate, SqlInfo su) {

    }

    public void ResetCache(SqlInfo su) throws Exception {

    }

    public void ScanClass(Class<?> aClass) {
    }

    public void init() {
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

    /**
     * 使用用户上传路径
     *
     * @return
     */
    public boolean UseUserUploadPath() {
        return false;
    }

    @Override
    public void destroy() {
        LockUtil.UnLockAll();
    }
}
