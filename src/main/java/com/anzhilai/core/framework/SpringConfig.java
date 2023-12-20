package com.anzhilai.core.framework;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseTask;
import com.anzhilai.core.base.XInterceptor;
import com.anzhilai.core.database.DBBase;
import com.anzhilai.core.database.DBSession;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.toolkit.LogUtil;
import com.anzhilai.core.toolkit.PathUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

import java.lang.reflect.Modifier;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Spring的上下文配置类，包含一些配置和方法
 */
@Configuration
@EnableWebSocket
@EnableTransactionManagement
public class SpringConfig implements WebMvcConfigurer, ApplicationContextAware, ApplicationListener<WebServerInitializedEvent> {
    private static Logger log = LogUtil.getLogger(SpringConfig.class);

    private static ApplicationContext applicationContext = null;
    private static final String FAVICON_URL = "/favicon.ico";
    private static final String ROOT_URL = "/";

    /**
     * 添加资源处理器
     *
     * @param registry 资源处理器注册表
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("file:./static/", "classpath:/static/")
                .setCacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS).cachePublic());
        WebMvcConfigurer.super.addResourceHandlers(registry);
    }

    /**
     * 配置servlet处理
     *
     * @param configurer 默认servlet处理器配置器
     */
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    /**
     * 添加拦截器
     *
     * @param registry 拦截器注册表
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        List<XInterceptor> list = new ArrayList<>();//添加排序功能
        HashMap<XInterceptor, Class<?>> inters = new HashMap<>();

        try {
            for (Class<?> aClass : GlobalValues.baseAppliction.GetScanClasses()) {
                if (HandlerInterceptor.class.isAssignableFrom(aClass)) {
                    XInterceptor interceptor = aClass.getAnnotation(XInterceptor.class);
                    if (interceptor != null) {
                        Class<?> lastAClass = inters.get(interceptor);
                        if (lastAClass != null) {
                            if (!aClass.isAssignableFrom(lastAClass)) {
                                inters.put(interceptor, aClass);
                                list.add(interceptor);
                            }
                        } else {
                            inters.put(interceptor, aClass);
                            list.add(interceptor);
                        }
                    }
                }
            }
        } catch (Exception throwables) {
            throwables.printStackTrace();
        }
        list.sort(new Comparator<XInterceptor>() {
            @Override
            public int compare(XInterceptor t0, XInterceptor t1) {
                return t0.priority() - t1.priority();
            }
        });
        for (XInterceptor systemInterceptor : list) {
            Class<?> aClass = inters.remove(systemInterceptor);
            registry.addInterceptor((HandlerInterceptor) getBean(aClass)).addPathPatterns(systemInterceptor.pathPatterns()).excludePathPatterns(ROOT_URL, FAVICON_URL);
        }
    }

    /**
     * 设置应用上下文
     *
     * @param arg0 应用上下文
     * @throws BeansException 抛出Bean异常
     */
    @Override
    public void setApplicationContext(ApplicationContext arg0) throws BeansException {
        if (SpringConfig.applicationContext == null) {
            SpringConfig.applicationContext = arg0;
        }
    }

    /**
     * 获取静态应用上下文
     *
     * @return 应用上下文
     */
    public static ApplicationContext getStaticApplicationContext() {
        return applicationContext;
    }

    /**
     * 通过名称获取Bean
     *
     * @param name Bean名称
     * @return Bean对象
     */
    public static <T> T getBean(String name) {
        return (T) getStaticApplicationContext().getBean(name);
    }

    /**
     * 通过类获取Bean
     *
     * @param clazz Bean类
     * @return Bean对象
     */
    public static <T> T getBean(Class<T> clazz) {
        return getStaticApplicationContext().getBean(clazz);
    }

    /**
     * 通过名称和类获取指定的Bean
     *
     * @param name  Bean名称
     * @param clazz Bean类
     * @return Bean对象
     */
    public static <T> T getBean(String name, Class<T> clazz) {
        return getStaticApplicationContext().getBean(name, clazz);
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
            GlobalValues.CurrentPort = event.getWebServer().getPort();
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
            GlobalValues.baseAppliction.init();
        } catch (Exception e) {
            e.printStackTrace();
        }
        LogUtil.SetDailyRollingLogger("logs" + GlobalValues.CurrentPort + "/log.log");
        log.info("ExecutingPath::" + PathUtil.getExecutingPath());
        log.info("xdevelop ok!!!" + GlobalValues.CurrentIP + ":" + GlobalValues.CurrentPort);
    }
}
