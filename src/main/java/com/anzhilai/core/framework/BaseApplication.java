package com.anzhilai.core.framework;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseTask;
import com.anzhilai.core.database.DBBase;
import com.anzhilai.core.database.DBSession;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.*;
import jdk.internal.net.http.RequestPublishers;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletException;
import java.lang.reflect.Modifier;
import java.net.InetAddress;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 基础应用入口类
 * 实现DisposableBean和WebServerFactoryCustomizer接口
 * 实现日志，类库扫描，会话管理，事务调度和系统启动初始化等操作
 */
public abstract class BaseApplication extends SpringBootServletInitializer implements DisposableBean, WebServerFactoryCustomizer<ConfigurableWebServerFactory>, ApplicationListener<WebServerInitializedEvent> {
    private static Logger log = LogUtil.getLogger(BaseApplication.class);

    /**
     * 获取应用程序名称
     *
     * @return 名称
     */
    public String GetApplicationName() {
        return "XDApplication";
    }

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
     * 任务名称和对应的具体任务实例的哈希映射表
     */
    public Map<String, BaseTask> hashMapTask = new ConcurrentHashMap<>();

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

    /**
     * 注册利用JsonSchema生成数据的领域模型
     *
     * @throws Exception 异常
     */
    public void RegisterJsonSchema(List<Map> listschema)throws Exception {

    }

    protected Map GetJsonSchemaFromModel(Class<? extends BaseModel> clazz) throws Exception {
        BaseModel bm= TypeConvert.CreateNewInstance(clazz);
        Map m = new HashMap();
        m.put("name",bm.GetJsonSchemaName());
        m.put("schema",bm.GetJsonSchema());
        m.put("url",SqlCache.hashMapClassRootUrl.get(BaseModel.GetTableName(clazz))+"/save_json");
        return m;
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

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(this.getClass());
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        this.logger = LogFactory.getLog(this.getClass());
        WebApplicationContext rootAppContext = this.createRootApplicationContext(servletContext);
        if (rootAppContext != null) {
            servletContext.addListener(new ContextLoaderListener(rootAppContext) {
                public void contextInitialized(ServletContextEvent event) {
                    onApplicationEvent(null);
                }
            });
        } else {
            this.logger.debug("No ContextLoaderListener registered, as createRootApplicationContext() did not return an application context");
        }
    }

    public void initDb() {
        try {
            DBBase db = DBSession.GetSession().GetCurrentDB();
            for (Class<?> aClass : GlobalValues.baseAppliction.GetScanClasses()) {
                if (BaseModel.class.isAssignableFrom(aClass)) {
                    db.CheckTable((Class<BaseModel>) aClass);
                }
                SqlCache.AddController(aClass);
                if (BaseTask.class.isAssignableFrom(aClass) && !aClass.equals(BaseTask.class)) {
                    Class<BaseTask> ac = (Class<BaseTask>) aClass;
                    if (Modifier.isAbstract(ac.getModifiers())) {//是抽象类
                        return;
                    }
                    BaseTask task = TypeConvert.CreateNewInstance(ac);
                    if (task != null && StrUtil.isNotEmpty(task.GetName())) {
                        GlobalValues.baseAppliction.hashMapTask.put(task.GetName(), task);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 监听应用事件
     *
     * @param event Web服务器初始化事件
     */
    @Override
    public void onApplicationEvent(WebServerInitializedEvent event) {
        try {
            GlobalValues.CurrentIP = InetAddress.getLocalHost().getHostAddress();
            if (event != null) {
                GlobalValues.CurrentPort = event.getWebServer().getPort();
                initDb();
            }
            GlobalValues.baseAppliction.init();
        } catch (Exception e) {
            e.printStackTrace();
        }
        LogUtil.SetDailyRollingLogger("logs" + GlobalValues.CurrentPort + "/log.log");
        log.info("ExecutingPath::" + PathUtil.getExecutingPath());
        log.info("xdevelop ok!!!" + GlobalValues.CurrentIP + ":" + GlobalValues.CurrentPort);
    }

    /**
     * 销毁方法，实现DisposableBean接口
     */
    @Override
    public void destroy() {
        LockUtil.UnLockAll();
    }
}
