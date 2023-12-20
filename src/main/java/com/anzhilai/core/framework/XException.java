package com.anzhilai.core.framework;

import com.anzhilai.core.database.AjaxResult;

/**
 * 自定义异常类，
 * 向前台返回错误信息，同时记录错误到日志信息中。
 */
public class XException extends Exception {
    /**
     * 获取错误代码。
     * @return 错误代码。
     */
    public String code;
    /**
     * 默认构造函数。
     */
    public XException() {
        super();
    }
    /**
     * 带有AjaxResult对象的构造函数。
     * @param ar AjaxResult对象。
     */
    public XException(AjaxResult ar) {
        this("");
    }
    /**
     * 带有错误信息的构造函数。
     * @param message 错误信息。
     */
    public XException(String message) {
        this(message, "");
    }
    /**
     * 带有错误信息和错误代码的构造函数。
     * @param message 错误信息。
     * @param code 错误代码。
     */
    public XException(String message, String code) {
        super(message);
        this.setCode(code);
    }
    /**
     * 获取错误代码。
     * @return 错误代码。
     */
    public String getCode() {
        return code;
    }
    /**
     * 设置错误代码。
     * @param code 错误代码。
     */
    public void setCode(String code) {
        this.code = code;
    }
}
