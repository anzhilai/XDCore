package com.anzhilai.core.toolkit.websocket;

public class SBConfig {
    private String device_name = "门禁机";
    private String admin_pwd = "admin";
    private String logo = "";
    private boolean support_qrcode = true;
    private String face_verify_threshold = "0.88";
    private int recognize_interval = 3;
    private int face_quality = 30;
    private int live_threshold = 40;
    private boolean support_live = true;
    private boolean upload_face_pic = false;

    public String getDevice_name() {
        return device_name;
    }

    public void setDevice_name(String device_name) {
        this.device_name = device_name;
    }

    public String getAdmin_pwd() {
        return admin_pwd;
    }

    public void setAdmin_pwd(String admin_pwd) {
        this.admin_pwd = admin_pwd;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public boolean isSupport_qrcode() {
        return support_qrcode;
    }

    public void setSupport_qrcode(boolean support_qrcode) {
        this.support_qrcode = support_qrcode;
    }

    public String getFace_verify_threshold() {
        return face_verify_threshold;
    }

    public void setFace_verify_threshold(String face_verify_threshold) {
        this.face_verify_threshold = face_verify_threshold;
    }

    public int getRecognize_interval() {
        return recognize_interval;
    }

    public void setRecognize_interval(int recognize_interval) {
        this.recognize_interval = recognize_interval;
    }

    public int getFace_quality() {
        return face_quality;
    }

    public void setFace_quality(int face_quality) {
        this.face_quality = face_quality;
    }

    public int getLive_threshold() {
        return live_threshold;
    }

    public void setLive_threshold(int live_threshold) {
        this.live_threshold = live_threshold;
    }

    public boolean isSupport_live() {
        return support_live;
    }

    public void setSupport_live(boolean support_live) {
        this.support_live = support_live;
    }

    public boolean isUpload_face_pic() {
        return upload_face_pic;
    }

    public void setUpload_face_pic(boolean upload_face_pic) {
        this.upload_face_pic = upload_face_pic;
    }
}
