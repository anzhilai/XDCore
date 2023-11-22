package com.anzhilai.core.base;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * 注解定义拦截器,优先级上限不可超过99
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface XInterceptor {
    String[] pathPatterns() default "/**";

    int priority() default 99;
}
