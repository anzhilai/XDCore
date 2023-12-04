package com.anzhilai.core.database;


import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.toolkit.TypeConvert;

import java.util.HashMap;
import java.util.Map;


/**
 * 这是系统统一返回用的类,所有的对外交互都应该返回这个类转的json
 */
public class AjaxResult {
    public static final String T_TEXT_DEFAULT_SUCCESS = "操作成功";
    public static final String T_TEXT_DEFAULT_FAIL = "操作失败";
    private boolean Success;
    private String Message;
    private String Exception;
    private Object Value;

    //region 构造函数们
    public AjaxResult() {
        this.Success = true;
        this.Message = T_TEXT_DEFAULT_SUCCESS;
    }

    public AjaxResult(String messsge) {
        this.Success = false;
        this.Message = messsge;
    }


    public AjaxResult(boolean success, Object value) {
        this.Success = success;
        this.Message = Success ? T_TEXT_DEFAULT_SUCCESS : T_TEXT_DEFAULT_FAIL;
        this.Exception = null;
        this.Value = value;
    }

    public AjaxResult(AjaxResult ar) {
        this.Success = ar.Success;
        this.Message = ar.Message;
        this.Exception = ar.Exception;
        this.Value = ar.Value;
    }
    //endregion

    //region GetSet们
    public boolean isSuccess() {
        return Success;
    }

    public AjaxResult setSuccess(boolean success) {
        Success = success;
        return this;
    }

    public String getMessage() {
        return Message;
    }

    public AjaxResult setMessage(String message) {
        Message = message;
        return this;
    }

    public String getException() {
        return Exception;
    }

    public AjaxResult setException(String exception) {
        Exception = exception;
        return this;
    }

    public Object getValue() {
        return Value;
    }

    public AjaxResult setValue(Object value) {
        Value = value;
        return this;
    }
    //endregion

    //region 对象方法
    public Map<String, Object> GetMapValue() {
        if (Value == null) {
            Value = new HashMap<String, Object>();
        }
        return (Map<String, Object>) this.Value;
    }

    public AjaxResult AddValue(String k, Object v) {
        Map<String, Object> map = this.GetMapValue();
        if (v instanceof BaseModel) {
            v = ((BaseModel) v).ToMap();
        }
        map.put(k, v);
        return this;
    }

    public String ToJson() {
        return this.ToJson("yyyy-MM-dd HH:mm:ss");
    }
    public String ToDayJson() {
        return this.ToJson("yyyy-MM-dd");
    }

    public String ToJson(String dateFormat) {
        if (Value instanceof BaseModel) {
            BaseModel bm = (BaseModel) Value;
            Value = bm.ToMap();
        }
        return TypeConvert.ToJson(this, dateFormat);
    }

    public void ClearValue() {
        if (Value != null) {
            Value = null;
        }
    }

    //endregion

    //region 类静态方法
    public static AjaxResult True() {
        return new AjaxResult();
    }

    public static AjaxResult True(Object val) {
        AjaxResult ar = True();
        ar.Value = val;
        return ar;
    }
    public static AjaxResult False(String msg) {
        return new AjaxResult(msg);
    }

    public static AjaxResult Error(String msg) {
        return new AjaxResult(msg);
    }

    public static AjaxResult Exception(String msg) {
        AjaxResult aj = new AjaxResult(msg);
        aj.Exception = msg;
        return aj;
    }
    public static AjaxResult Exception(Exception ex) {
        return Exception(ex.getMessage());
    }

    //endregion
}
