package com.anzhilai.core.toolkit.websocket;

public class BaseResponse {
    private String cmd = "";
    private String dev_id = null;
    private int code = 0;
    private String msg = "success";

    public BaseResponse() {
    }

    public BaseResponse(BaseRequest baseRequest) {
        this.cmd = baseRequest.getCmd();
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

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
