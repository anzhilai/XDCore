package com.anzhilai.core.toolkit.websocket;

import com.alibaba.fastjson.JSON;
import org.springframework.web.socket.WebSocketSession;

public class BaseRequest {
    public enum CMD_ENUM {
        login, heartbeat, report_catch_state, sync_user, unlock_record, scan_qrcode,//设备请求命令
        add_user, update_user, find_by_id, remove_user, clear_all, remote_unlock, reboot, config, upgrade,//平台下发命令
    }

    private String cmd = "";
    private String dev_id = null;
    private String msg_id = null;

    public BaseRequest() {
    }

    public BaseRequest(CMD_ENUM cmd) {
        this.cmd = cmd.name();
    }

    public String getCmd() {
        return cmd;
    }

    public void setCmd(String cmd) {
        this.cmd = cmd;
    }

    public String getDev_id() {
        return dev_id;
    }

    public void setDev_id(String dev_id) {
        this.dev_id = dev_id;
    }

    public String getMsg_id() {
        return msg_id;
    }

    public void setMsg_id(String msg_id) {
        this.msg_id = msg_id;
    }

    public void handMessage(WebSocketSession session) {

    }

    public boolean replyMessage(WebSocketSession session, Object message) {
        return replyMessage(session, JSON.toJSONString(message));
    }

    public boolean replyMessage(WebSocketSession session, String message) {
        return SocketMessageHander.sendMessage(getDev_id(), session, message, false);
    }
}
