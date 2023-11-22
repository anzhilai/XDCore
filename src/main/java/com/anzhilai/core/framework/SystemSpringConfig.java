package com.anzhilai.core.framework;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseStatistic;
import com.anzhilai.core.base.BaseTask;
import com.anzhilai.core.base.XInterceptor;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.database.SqlTable;
import com.anzhilai.core.toolkit.LogUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.hibernate.dialect.Dialect;
import org.springframework.beans.BeansException;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 *
 */
@Configuration
@EnableWebSocket //websocket
@EnableTransactionManagement
public class SystemSpringConfig implements WebMvcConfigurer, ApplicationContextAware, ApplicationListener<WebServerInitializedEvent> {
    private static ApplicationContext applicationContext = null;
    private static final String FAVICON_URL = "/favicon.ico";
    private static final String ROOT_URL = "/";


    //websocket start
//    @Autowired
//    private WebSocketHandler webSocketHandler;
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(webSocketHandler, "/wsapi")
//                .setAllowedOrigins("*");
//    }
    //websocket end


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("file:./static/", "classpath:/static/")
                .setCacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS).cachePublic());
        WebMvcConfigurer.super.addResourceHandlers(registry);
    }

    /**
     * 配置servlet处理
     */
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        List<XInterceptor> list = new ArrayList<>();//添加排序功能
        HashMap<XInterceptor, Class<?>> inters = new HashMap<>();
        if (GlobalValues.baseAppliction == null) {
        }
        for (Class<?> aClass : GlobalValues.baseAppliction.GetScanClasses()) {
            GlobalValues.baseAppliction.ScanClass(aClass);
            if (BaseModel.class.isAssignableFrom(aClass)) {
                SqlTable.CheckTable((Class<BaseModel>) aClass);
            }
            SqlCache.AddController(aClass);
            if (BaseStatistic.class.isAssignableFrom(aClass)) {
                SqlCache.AddStatistic(aClass);
            }
            if (BaseTask.class.isAssignableFrom(aClass)) {
                SqlCache.AddTask(aClass);
            }
            if (HandlerInterceptor.class.isAssignableFrom(aClass)) {
                XInterceptor systemInterceptor = aClass.getAnnotation(XInterceptor.class);
                if (systemInterceptor != null) {
                    Class<?> lastAClass = inters.get(systemInterceptor);
                    if (lastAClass != null) {
                        if (!aClass.isAssignableFrom(lastAClass)) {
                            inters.put(systemInterceptor, aClass);
                            list.add(systemInterceptor);
                        }
                    } else {
                        inters.put(systemInterceptor, aClass);
                        list.add(systemInterceptor);
                    }
                }
            }
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


    @Override
    public void setApplicationContext(ApplicationContext arg0) throws BeansException {
        if (SystemSpringConfig.applicationContext == null) {
            SystemSpringConfig.applicationContext = arg0;
        }
    }

    @Bean
    public Dialect getDialect() throws IllegalAccessException, ClassNotFoundException, InstantiationException {
        HibernateJpaVendorAdapter bean = SystemSpringConfig.getBean(HibernateJpaVendorAdapter.class);
        String dialect = TypeConvert.ToString(bean.getJpaPropertyMap().getOrDefault("hibernate.dialect", ""));
        return (Dialect) Class.forName(dialect).newInstance();
    }

    // 获取applicationContext
    public static ApplicationContext getStaticApplicationContext() {
        return applicationContext;
    }

    // 通过name获取 Bean.
    public static <T> T getBean(String name) {
        return (T) getStaticApplicationContext().getBean(name);
    }

    // 通过class获取Bean.
    public static <T> T getBean(Class<T> clazz) {
        return getStaticApplicationContext().getBean(clazz);
    }

    // 通过name,以及Clazz返回指定的Bean
    public static <T> T getBean(String name, Class<T> clazz) {
        return getStaticApplicationContext().getBean(name, clazz);
    }

    @Override
    public void onApplicationEvent(WebServerInitializedEvent event) {
        try {
            GlobalValues.CurrentIP = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        GlobalValues.CurrentPort = event.getWebServer().getPort();
        LogUtil.SetDailyRollingLogger("logs" + GlobalValues.CurrentPort + "/log.log");
    }
}
