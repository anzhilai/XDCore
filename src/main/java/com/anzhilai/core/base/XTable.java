package com.anzhilai.core.base;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
/**
 * 数据模型的表注解
 * 用于定义表格的相关信息，如表名和描述。
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

}
