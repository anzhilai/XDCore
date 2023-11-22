package com.anzhilai.core.toolkit.mqtt;

import com.alibaba.fastjson.JSONObject;
import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.database.AjaxResult;

import java.util.Date;
import java.util.Map;

public class MQTTRequest {
    public String messageid = null;
    public String sendid = null;
    public Long timestamp = null;
    public String operation = null;
    public Map<String, Object> body = null;

    public MQTTResponse toMQTTResponse(AjaxResult ajaxResult) {
        return MQTTResponse.ToMQTTResponse(this, ajaxResult);
    }

    public String ToJson() {
        String json = TypeConvert.ToJson(this);
        return json;
    }

    public static MQTTRequest Create(String operation, Map<String, Object> body) {
        MQTTRequest request = new MQTTRequest();
        request.messageid = BaseModel.GetUniqueId();
        request.sendid = MqttClientUtil.config.clientId;
        request.timestamp = new Date().getTime();
        request.operation = operation;
        if (body != null) {
            request.body = body;
        }
        return request;
    }

    public static MQTTRequest Create(String id, String deviceid, String operation, Map<String, Object> body) {
        MQTTRequest request = new MQTTRequest();
        request.messageid = id;
        request.sendid = deviceid;
        request.timestamp = new Date().getTime();
        request.operation = operation;
        request.body = body;
        return request;
    }

    public static MQTTRequest Parse(String json) {
        MQTTRequest request = JSONObject.parseObject(json, MQTTRequest.class);
        return request;
    }
}
