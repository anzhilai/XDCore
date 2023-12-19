package com.anzhilai.core.database;


import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.toolkit.TypeConvert;

import java.util.HashMap;
import java.util.Map;


/**
 * 服务结果封装类
 * 服务调用的返回结果，包装了服务执行的结果，成功和异常信息。
 */
public class AjaxResult {

    /**
     * 表示操作是否成功的标识。
     */
    private boolean Success;
    /**
     * 操作结果的消息内容。
     */
    private String Message;
    /**
     * 操作结果的数据内容。
     */
    private Object Value;
    /**
     * 私有化构造函数，不允许外部实例化，根据操作是否成功来初始化对象。
     * @param success 操作是否成功的标识。
     */
    private AjaxResult(boolean success) {
        Success = success;
        if(success){
            this.Message =  "操作成功";;
        }else{
            this.Message = "操作失败";
        }
    }
    /**
     * 获取操作是否成功的标识。
     * @return 操作是否成功的标识。
     */
    public boolean isSuccess() {
        return Success;
    }
    /**
     * 获取操作结果的消息内容。
     * @return 操作结果的消息内容。
     */
    public String getMessage() {
        return Message;
    }
    /**
     * 设置操作结果的消息内容。
     * @param message 操作结果的消息内容。
     * @return 返回当前AjaxResult对象，便于链式调用。
     */
    public AjaxResult setMessage(String message) {
        Message = message;
        return this;
    }
    /**
     * 获取操作结果的数据内容。
     * @return 操作结果的数据内容。
     */
    public Object getValue() {
        return Value;
    }
    /**
     * 设置操作结果的数据内容。
     * @param value 操作结果的数据内容。
     * @return 返回当前AjaxResult对象，便于链式调用。
     */
    public AjaxResult setValue(Object value) {
        Value = value;
        return this;
    }
    /**
     * 向操作结果中添加数据内容。
     * @param k 键名。
     * @param v 键值对中的值。
     * @return 返回当前AjaxResult对象，便于链式调用。
     */
    public AjaxResult AddValue(String k, Object v) {
        if (Value == null) {
            Value = new HashMap<String, Object>();
        }
        Map<String, Object> map =(Map<String, Object>) this.Value;
        if (v instanceof BaseModel) {
            v = ((BaseModel) v).ToMap();
        }
        map.put(k, v);
        return this;
    }
    /**
     * 将操作结果转换为JSON格式字符串。
     * @return 操作结果转换后的JSON格式字符串。
     */
    public String ToJson() {
        String dateFormat = "yyyy-MM-dd HH:mm:ss";
        if (Value instanceof BaseModel) {
            BaseModel bm = (BaseModel) Value;
            Value = bm.ToMap();
        }
        return TypeConvert.ToJson(this, dateFormat);
    }

    /**
     * 创建一个操作成功的AjaxResult对象。
     * @return 返回一个操作成功的AjaxResult对象。
     */
    public static AjaxResult True() {
        return new AjaxResult(true);
    }
    /**
     * 创建一个操作成功的AjaxResult对象，并设置数据内容。
     * @return 返回一个操作成功的AjaxResult对象。
     */
    public static AjaxResult True(Object val) {
        AjaxResult ar = True();
        ar.Value = val;
        return ar;
    }
    /**
     * 创建一个操作失败的AjaxResult对象，并设置消息。
     * @return 返回一个操作失败的AjaxResult对象。
     */
    public static AjaxResult False(String msg) {
        return new AjaxResult(false).setMessage(msg);
    }

}
