package com.anzhilai.core.toolkit.mqtt;

//@Configuration
//@ConfigurationProperties(prefix = "mqtt")
public abstract class BaseMqttConfig {
//    @Value("${mqtt.url}")
//    public String url;
//    @Value("${mqtt.username}")
//    public String username;
//    @Value("${mqtt.password}")
//    public String password;
//    @Value("${mqtt.caFile}")
//    public String caFile;
//    @Value("${mqtt.activemqUrl}")
//    public String activemqUrl;
//    public String[] topicFilters = {"/Server"};//订阅的消息

    public String clientId;

    //设备上线
    public abstract void Online(String id) throws Exception;

    //设备下线
    public abstract void Offline(String id) throws Exception;

    public abstract String getUrl();

    public abstract String getUsername();

    public abstract String getPassword();

    public abstract String getCaFile();

    public abstract String getActivemqUrl();

    public abstract String[] getTopicFilters();

}
