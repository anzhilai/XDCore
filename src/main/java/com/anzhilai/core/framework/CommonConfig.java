package com.anzhilai.core.framework;

import com.anzhilai.core.toolkit.TypeConvert;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "common-config")
public class CommonConfig {
    protected String version = "";
    public String getVersion() {
        return version;
    }
    public void setVersion(String Version) {
        this.version = Version;
    }

    protected boolean startWeixin = false;
    public boolean isStartWeixin() {
        return startWeixin;
    }
    public void setStartWeixin(boolean startWeixin) {
        this.startWeixin = startWeixin;
    }


    protected boolean startMqtt = false;
    public boolean isStartMqtt() {
        return startMqtt;
    }
    public void setStartMqtt(boolean startMqtt) {
        this.startMqtt = startMqtt;
    }

    protected String uploadFilePath = "";
    public String getUploadFilePath() {
        return uploadFilePath;
    }
    public void setUploadFilePath(String uploadFilePath) {
        this.uploadFilePath = uploadFilePath;
    }

    protected String tempFilePath = "";
    public String getTempFilePath() {
        return tempFilePath;
    }
    public void setTempFilePath(String TempFilePath) {
        this.tempFilePath = TempFilePath;
    }

    protected String templatePath = "";
    public String getTemplatePath() {
        return templatePath;
    }
    public void setTemplatePath(String templatePath) {
        this.templatePath = templatePath;
    }

    protected boolean privateDeploy = false;
    public boolean isPrivateDeploy() {
        return privateDeploy;
    }
    public void setPrivateDeploy(boolean privateDeploy) {
        this.privateDeploy = privateDeploy;
    }

    protected String libOfficePath = "";
    public String getLibOfficePath() {
        return libOfficePath;
    }
    public void setLibOfficePath(String libOfficePath) {
        this.libOfficePath = libOfficePath;
    }

    protected String allowAdmin = "";
    public String getAllowAdmin() {
        return allowAdmin;
    }
    public void setAllowAdmin(String allowAdmin) {
        this.allowAdmin = allowAdmin;
    }


    public static CommonConfig getInstance(){
        return SpringConfig.getBean(CommonConfig.class);
    }

    public static String GetCommonConfigValue(String key){
        Yaml yaml = new Yaml();
        LinkedHashMap map = yaml.load(BaseApplication.class.getClassLoader().getResourceAsStream("application.yml"));
        Map cmm = (Map)map.get("common-config");
        return TypeConvert.ToString(cmm.get(key));
    }
}
