package com.anzhilai.core.toolkit.mqtt;


import com.alibaba.fastjson.JSON;
import com.anzhilai.core.base.XController;
import com.anzhilai.core.toolkit.StrUtil;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.advisory.AdvisorySupport;
import org.apache.activemq.command.ActiveMQMessage;
import org.apache.activemq.command.ConnectionId;
import org.apache.activemq.command.ConnectionInfo;
import org.apache.activemq.command.RemoveInfo;
import org.apache.log4j.Logger;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import javax.jms.*;
import java.lang.reflect.Method;
import java.util.concurrent.ConcurrentHashMap;

public class MqttClientUtil extends BaseMqttClient {

    private static final Logger log = Logger.getLogger(MqttClientUtil.class);
    public static BaseMqttConfig config;
    public ConnectionFactory factory;
    public MessageConsumer consumer;
    public MessageListener messageListener;
    public Connection connection;

    public boolean init() {
        this.url = config.getUrl();
        this.userName = config.getUsername();
        this.password = config.getPassword();
        this.topicFilters = config.getTopicFilters();
        if (!this.validateUrl()) {
            return false;
        }
        this.factory = new ActiveMQConnectionFactory(config.getUsername(), config.getPassword(), config.getActivemqUrl());
        if (StrUtil.isEmpty(config.clientId)) {
            config.clientId = MqttClient.generateClientId();
        }
        this.clientId = config.clientId;
        return super.init();
    }

    @Override
    public void connectSuccess() {
        try {
            client.subscribe(config.clientId);
            connection = factory.createConnection();
            final Session session = connection.createSession(false/*支持事务*/, Session.AUTO_ACKNOWLEDGE);
            Destination queue = AdvisorySupport.getConnectionAdvisoryTopic();
            consumer = session.createConsumer(queue);
            consumer.setMessageListener(messageListener);
            connection.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static ConcurrentHashMap<String, Method> hashControllerMethod = new ConcurrentHashMap<>();

    public static void AddControllerMethod(Class type) {
        for (Method method : type.getMethods()) {
            Class<?>[] types = method.getParameterTypes();
            if (method.isAnnotationPresent(XController.class) && types.length == 1 && types[0] == MQTTRequest.class) {
                XController methodMapping = method.getAnnotation(XController.class);
                String operation = methodMapping.mqtt();
                hashControllerMethod.put(operation, method);
            }
        }
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String content = new String(message.getPayload(), "utf-8");
        if (!message.isRetained()) {//新协议统一处理
            MQTTRequest request = MQTTRequest.Parse(content);
            if (hashControllerMethod.containsKey(request.operation)) {
                Method m = hashControllerMethod.get(request.operation);
                try {
                    Object response = m.invoke(null, request);
                    if (response != null) {
                        Publish("/" + request.sendid, JSON.toJSONString(response));
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }
    }

    public void Publish(String topic, String msg) throws Exception {
        try {
            if (client != null && !client.isConnected()) {
                getClient().publish(topic, new MqttMessage(msg.getBytes("UTF-8")));
            } else {
                log.error("消息服务器未连接");
            }
        } catch (Exception ex) {
            log.error(topic + "发送失败" + msg);
        }
    }

    public MqttClient getClient() throws MqttException {
        if (client != null && !client.isConnected()) {
            log.info("connectionLost");
            try {
                StartConnect();
            } catch (Exception e) {
                log.info("connectionLost", e);
            }
        }
        return client;
    }

    private static MqttClientUtil clientInstance;
    public static ConcurrentHashMap<String, String> hashMap = new ConcurrentHashMap<>();

    public static MqttClientUtil getClientInstance() throws Exception {
        if (clientInstance == null) {
            clientInstance = new MqttClientUtil();
            clientInstance.messageListener = new MessageListener() {
                @Override
                public void onMessage(Message message) {
                    System.out.println(message);
                    if (message instanceof ActiveMQMessage) {
                        ActiveMQMessage mqMessage = (ActiveMQMessage) message;
                        if (mqMessage.getDataStructure() instanceof ConnectionInfo) {
                            ConnectionInfo ci = (ConnectionInfo) mqMessage.getDataStructure();
                            ConnectionId connectid = ci.getConnectionId();
                            String id = ci.getClientId();
                            hashMap.put(connectid.getValue(), id);
                            try {
                                config.Online(id);
//                                ZNSB智能设备 znsb = ZNSB智能设备.GetObjectById(ZNSB智能设备.class, id);
//                                if (znsb != null) {
//                                    znsb.Update(ZNSB智能设备.F_设备状态, ZNSB智能设备.SBZT设备状态.在线.toString());
//                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        } else if (mqMessage.getDataStructure() instanceof RemoveInfo) {
                            RemoveInfo ri = (RemoveInfo) mqMessage.getDataStructure();
                            if (ri.getObjectId() instanceof ConnectionId) {
                                ConnectionId connectid = (ConnectionId) ri.getObjectId();
                                if (hashMap.containsKey(connectid.getValue())) {
                                    String id = hashMap.get(connectid.getValue());
                                    hashMap.remove(connectid.getValue());
                                    try {
                                        config.Offline(id);
//                                        ZNSB智能设备 znsb = ZNSB智能设备.GetObjectById(ZNSB智能设备.class, id);
//                                        if (znsb != null) {
//                                            znsb.Update(ZNSB智能设备.F_设备状态, ZNSB智能设备.SBZT设备状态.离线.toString());
//                                        }
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            }
                        }
                    }
                }
            };
            clientInstance.init();
        }
        return clientInstance;
    }
}
