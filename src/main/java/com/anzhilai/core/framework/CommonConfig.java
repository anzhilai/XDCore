package com.anzhilai.core.framework;

import com.anzhilai.core.toolkit.FileUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * CommonConfig类用于管理公共配置信息
 *
 * @Component 注解用于将该类标记为Spring组件
 * @ConfigurationProperties 注解用于读取配置文件中以"common-config"为前缀的属性
 */
@Component
@ConfigurationProperties(prefix = "common-config")
public class CommonConfig {
    protected String version = "";

    /**
     * 获取版本号
     *
     * @return 版本号
     */
    public String getVersion() {
        return version;
    }

    /**
     * 设置版本号
     *
     * @param Version 版本号
     */
    public void setVersion(String Version) {
        this.version = Version;
    }

    protected boolean startWeixin = false;

    /**
     * 判断是否启动微信
     *
     * @return 是否启动微信
     */
    public boolean isStartWeixin() {
        return startWeixin;
    }

    /**
     * 设置是否启动微信
     *
     * @param startWeixin 是否启动微信
     */
    public void setStartWeixin(boolean startWeixin) {
        this.startWeixin = startWeixin;
    }


    protected boolean startMqtt = false;

    /**
     * 判断是否启动MQTT
     *
     * @return 是否启动MQTT
     */
    public boolean isStartMqtt() {
        return startMqtt;
    }

    /**
     * 设置是否启动MQTT
     *
     * @param startMqtt 是否启动MQTT
     */
    public void setStartMqtt(boolean startMqtt) {
        this.startMqtt = startMqtt;
    }

    protected String uploadFilePath = "";

    /**
     * 获取上传文件路径
     *
     * @return 上传文件路径
     */
    public String getUploadFilePath() {
        return uploadFilePath;
    }

    /**
     * 设置上传文件路径
     *
     * @param uploadFilePath 上传文件路径
     */
    public void setUploadFilePath(String uploadFilePath) {
        this.uploadFilePath = uploadFilePath;
    }

    protected String tempFilePath = "";

    /**
     * 获取临时文件路径
     *
     * @return 临时文件路径
     */
    public String getTempFilePath() {
        return tempFilePath;
    }

    /**
     * 设置临时文件路径
     *
     * @param TempFilePath 临时文件路径
     */
    public void setTempFilePath(String TempFilePath) {
        this.tempFilePath = TempFilePath;
    }

    protected String templatePath = "";

    /**
     * 获取模板文件路径
     *
     * @return 模板文件路径
     */
    public String getTemplatePath() {
        return templatePath;
    }

    /**
     * 设置模板文件路径
     *
     * @param templatePath 模板文件路径
     */
    public void setTemplatePath(String templatePath) {
        this.templatePath = templatePath;
    }

    protected boolean privateDeploy = false;

    /**
     * 判断是否私有部署
     *
     * @return 是否私有部署
     */
    public boolean isPrivateDeploy() {
        return privateDeploy;
    }

    /**
     * 设置是否私有部署
     *
     * @param privateDeploy 是否私有部署
     */
    public void setPrivateDeploy(boolean privateDeploy) {
        this.privateDeploy = privateDeploy;
    }

    protected String libOfficePath = "";

    /**
     * 获取LibOffice路径
     *
     * @return LibOffice路径
     */
    public String getLibOfficePath() {
        return libOfficePath;
    }

    /**
     * 设置LibOffice路径
     *
     * @param libOfficePath LibOffice路径
     */
    public void setLibOfficePath(String libOfficePath) {
        this.libOfficePath = libOfficePath;
    }

    protected String allowAdmin = "";

    /**
     * 获取允许管理员
     *
     * @return 允许管理员
     */
    public String getAllowAdmin() {
        return allowAdmin;
    }

    /**
     * 设置允许管理员
     *
     * @param allowAdmin 允许管理员
     */
    public void setAllowAdmin(String allowAdmin) {
        this.allowAdmin = allowAdmin;
    }

    /**
     * 获取CommonConfig实例
     *
     * @return CommonConfig实例
     */
    public static CommonConfig getInstance() {
        return SpringConfig.getBean(CommonConfig.class);
    }


    protected static Map commonConfig = null;

    /**
     * 获取自定义CommonConfig属性值
     *
     * @param key 属性键
     * @return 属性值
     */
    public static String GetCustomConfigValue(String key) {
        if (commonConfig == null) {
            LinkedHashMap map = new Yaml().load(FileUtil.readToString(GlobalValues.GetApplicationPath() + File.separator + "application.yml"));
            commonConfig = (Map) map.get("common-config");
        }
        return TypeConvert.ToString(commonConfig.get(key));
    }
}
