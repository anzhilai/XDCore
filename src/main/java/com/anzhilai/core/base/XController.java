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
    /**
     * 获取控制器的名称。
     * @return 控制器的名称。
     */
    String name()  default "";
    /**
     * 获取MQTT操作类型。
     * @return MQTT操作类型。
     */
    String mqtt() default "";
    /**
     * 获取MQTT或者WebSocket的主题名称。
     * @return 主题名称。
     */
    String topic() default "";
    /**
     * 获取输入参数说明。
     * @return 输入参数。
     */
    String input() default "";
    /**
     * 获取输出参数说明。
     * @return 输出参数。
     */
    String output() default "";
    /**
     * 获取通信协议类型。
     * @return 通信协议类型。
     */
    ProtocolType type() default ProtocolType.http;
    /**
     * 判断是否开启自定义的事务。
     * @return 开启事务为true，否则为false。
     */
    boolean transactional() default true;

    /**
     * 获取登录状态。
     * @return 登录状态。
     */
    LoginState isLogin() default LoginState.Default;
    /**
     * 定义协议类型。
     */
    enum ProtocolType {
        http,mqtt,webSocket
    }
    /**
     * 定义登录状态。
     */
    enum LoginState {
        Default, Yes, No
    }
}
