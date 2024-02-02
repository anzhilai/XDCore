package com.anzhilai.core.base;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
/**
 * 数据模型的表注解
 * 通过注解在类名上，对应数据库中的一张表，或者在数据库中直接生成一张表。
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface XTable {
    /**
     * 获取表格的名称。
     * @return 表格的名称。
     */
    String name() default "";
    /**
     * 获取表格的描述信息。
     * @return 表格的描述信息。
     */
    String description() default "";

    String[] validateFields() default "";

}
