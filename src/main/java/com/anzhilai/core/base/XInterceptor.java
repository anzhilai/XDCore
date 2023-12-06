package com.anzhilai.core.base;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * XInterceptor 注解用于定义拦截器，可以设置拦截器的路径模式和优先级。
 * 优先级用于控制拦截器的执行顺序，数值越小优先级越高，上限为99。
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface XInterceptor {
    /**
     * 获取拦截器的路径模式，默认值为"/**"，表示拦截所有路径。
     * @return 拦截器的路径模式数组。
     */
    String[] pathPatterns() default "/**";
    /**
     * 获取拦截器的优先级，默认值为99。
     * @return 拦截器的优先级。
     */
    int priority() default 99;
}
