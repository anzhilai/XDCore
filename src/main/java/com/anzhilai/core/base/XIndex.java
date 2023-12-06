package com.anzhilai.core.base;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * XIndex 注解用于定义索引的相关属性，如名称、列和唯一性。
 */
@Target({ElementType.TYPE,ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface XIndex {
    /**
     * 获取索引的名称。
     * @return 索引的名称。
     */
    String name() default "";
    /**
     * 获取索引所对应的列。
     * @return 索引所对应的列数组。
     */
    String[] columns() default {};
    /**
     * 判断索引是否具有唯一性。
     * @return 如果索引是唯一的，返回 true；否则返回 false。
     */
    boolean unique() default false;
}
