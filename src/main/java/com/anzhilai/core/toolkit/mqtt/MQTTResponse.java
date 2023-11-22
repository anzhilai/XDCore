package com.anzhilai.core.toolkit.mqtt;

import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.database.AjaxResult;

import java.util.Date;

public class MQTTResponse extends MQTTRequest {

    public String ToJson() {
        String json = TypeConvert.ToJson(this);
        return json;
    }

    public static MQTTResponse ToMQTTResponse(MQTTRequest request, AjaxResult body) {
        MQTTResponse message = new MQTTResponse();
        message.sendid = request.sendid;
        message.messageid = request.messageid;
        message.timestamp = new Date().getTime();
        message.operation = request.operation + "Result";
        message.body = TypeConvert.FromMapJson(body.ToJson());
        return message;
    }

}
