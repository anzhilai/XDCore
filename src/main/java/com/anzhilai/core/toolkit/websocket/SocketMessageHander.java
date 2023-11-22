package com.anzhilai.core.toolkit.websocket;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.anzhilai.core.toolkit.StrUtil;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class SocketMessageHander {
    private static HashMap<String, WebSocketSession> deviceMap = new HashMap<>();//保存所有的session
    private static HashMap<WebSocketSession, StringBuffer> messageCache = new HashMap<>();//粘包处理
    private static HashMap<WebSocketSession, String> deviceIdMap = new HashMap<>();

    //给所有设备发送消息
    public static void sendAllMessage(String message, boolean saveMessage) {
        List<String> list = new ArrayList<String>();
        list.addAll(deviceMap.keySet());
        for (String id : list) {
            sendMessage(id, message, saveMessage);
        }
    }

    //给单一设备发送消息
    public static boolean sendMessage(String id, Object message, boolean saveMessage) {
        return sendMessage(id, deviceMap.get(id), JSON.toJSONString(message), saveMessage);
    }

    //给单一设备发送消息
    public static boolean sendMessage(String id, String message, boolean saveMessage) {
        return sendMessage(id, deviceMap.get(id), message, saveMessage);
    }

    public static boolean sendMessage(String id, WebSocketSession session, String message, boolean saveMessage) {
        boolean ret = false;
        if (session != null) {
            try {
                synchronized (session) {
                    session.sendMessage(new TextMessage(message));
                }
                ret = true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (saveMessage && !ret) {//保存消息
            try {
//                ZNSB智能设备离线消息 obj = new ZNSB智能设备离线消息();
//                obj.set发送时间(new Date());
//                obj.set智能设备id(id);
//                obj.set消息内容(message);
//                obj.Save();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return ret;
    }

    public static void closeWebSocketSession(WebSocketSession session) {
        messageCache.remove(session);
        String id = deviceIdMap.remove(session);
        if (StrUtil.isNotEmpty(id)) {
//            ZNSB智能设备.设置设备离线(id);
            deviceMap.remove(id);
        }
    }


    public static void handMessage(WebSocketSession session, String message) {
        try {
            if (messageCache.get(session) == null) {
                messageCache.put(session, new StringBuffer());
            }
            StringBuffer buffer = messageCache.get(session);
            buffer.append(message);
            message = buffer.toString();
            if (message.startsWith("{") && message.endsWith("}")) {
                JSONObject jsonObject = JSON.parseObject(message);
                buffer.setLength(0);
                String cmdKey = "cmd";
                if (jsonObject != null && jsonObject.containsKey(cmdKey)) {
//                    BaseRequest baseRequest = null;
//                    String cmd = jsonObject.getString(cmdKey);
//                    switch (BaseRequest.CMD_ENUM.valueOf(cmd)) {
//                        case login:
//                            baseRequest = TypeUtils.castToJavaBean(jsonObject, c);
//                            break;
//                        case heartbeat:
//                            baseRequest = TypeUtils.castToJavaBean(jsonObject, 设备心跳Request.class);
//                            break;
//                        case report_catch_state:
//                            baseRequest = TypeUtils.castToJavaBean(jsonObject, 设备上报用户人脸提取状态Request.class);
//                            break;
//                        case sync_user:
//                            baseRequest = TypeUtils.castToJavaBean(jsonObject, 设备同步用户数据Request.class);
//                            break;
//                        case unlock_record:
//                            baseRequest = TypeUtils.castToJavaBean(jsonObject, 设备上报开门记录Request.class);
//                            break;
//                        case scan_qrcode:
//                            baseRequest = TypeUtils.castToJavaBean(jsonObject, 设备上报二维码扫描结果Request.class);
//                            break;
//                    }
//                    if (baseRequest != null) {
//                        String id = baseRequest.getDev_id();
//                        if (deviceMap.containsKey(id)) {//如果存在了id
//                            WebSocketSession oldSession = deviceMap.get(id);
//                            if (session != oldSession) {
//                                oldSession.close();
//                                deviceIdMap.remove(session);
//                                messageCache.remove(session);
//                            }
//                        }
//                        deviceMap.put(id, session);
//                        deviceIdMap.put(session, id);
//                        baseRequest.handMessage(session);
//                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
