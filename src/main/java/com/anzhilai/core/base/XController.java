package com.anzhilai.core.base;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * 该注解用于定义接口类和接口方法的属性,名称和权限,若在接口类上设置的权限,则默认类中的全部方法都是这个权限.
 * 若是否登录为是时,只允许登录用户类型的所设置的用户类以及他的子类登录.
 * 若是否登录为默认时,接口方法默认使用的是接口类上设置的是否登录权限,若接口类为默认时,默认为需要登录.
 * 接口方法上若登录用户类型是默认值BaseModel时,优先使用接口类上定义的登录用户类型
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface XController {
    String name()  default "";

    String mqttOperation() default "";

    String topic() default "";

    String input() default "";

    String output() default "";

    String description() default "";

    ProtocolType type() default ProtocolType.http;

    boolean transactional() default true;//开启事务

    enum ProtocolType {
        http,mqtt
    }

    LoginState isLogin() default LoginState.Default;

    enum LoginState {
        Default, Yes, No
    }
}
