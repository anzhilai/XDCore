package com.anzhilai.core.base;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface XColumn {
    String name() default "";

    boolean unique() default false;

    boolean blob() default false;

    boolean text() default false;

    boolean mediumtext() default false;

    boolean nullable() default true;

    boolean insertable() default true;

    boolean updatable() default true;

    String columnDefinition() default "";

    String table() default "";

    String foreignTable() default "";

    int length() default 255;

    int precision() default 0;

    int scale() default 0;

    String description() default "";

    boolean filepath() default false;
}
