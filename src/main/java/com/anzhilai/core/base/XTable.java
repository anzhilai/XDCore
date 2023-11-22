package com.anzhilai.core.base;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface XTable {
    String name() default "";

    String catalog() default "";

    String schema() default "";
    String[] requests() default "";

    String description() default "";

    XIndex[] indexes() default {};
}
