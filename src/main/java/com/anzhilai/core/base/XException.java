package com.anzhilai.core.base;

import com.anzhilai.core.database.AjaxResult;

// 提示性错误, 仅仅向前台返回错误信息,不会打印错误
public class XException extends Exception {

    public String code;

    public XException() {
        super();
    }

    public XException(AjaxResult ar) {
        this("");
    }

    public XException(String message) {
        this(message, "");
    }

    public XException(String message, String code) {
        super(message);
        this.setCode(code);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
