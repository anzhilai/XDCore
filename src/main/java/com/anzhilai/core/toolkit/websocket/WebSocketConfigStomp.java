package com.anzhilai.core.toolkit.websocket;


import com.anzhilai.core.framework.SystemSpringConfig;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import java.util.HashMap;
import java.util.Map;

//@Configuration
//@EnableWebSocketMessageBroker
public class WebSocketConfigStomp extends AbstractWebSocketMessageBrokerConfigurer {

    public Map<String, String> onlineUser = new HashMap<>();

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.setInterceptors(new ChannelInterceptorAdapter() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                switch (accessor.getCommand()) {
                    case CONNECT:
//                        System.out.println(accessor.getSessionId() + " CONNECT");
                        break;
                    case DISCONNECT:
                        String id = onlineUser.remove(accessor.getSessionId());
                        System.out.println("logout " + id);
                        login(id, false);
                        break;
                    case SEND:
                        onMessage(message, accessor);
                        break;
                }
                return message;
            }

            public boolean preReceive(MessageChannel channel) {
                return true;
            }
        });
    }

    private void onMessage(Message<?> message, StompHeaderAccessor accessor) {
        try {
            String key = "simpDestination";
            if (message.getHeaders().containsKey(key)) {
                if ("login".equals(TypeConvert.ToString(message.getHeaders().get(key)))) {
                    String data = new String((byte[]) message.getPayload()).trim();
                    Map<String, Object> map = TypeConvert.FastFromMapJson(data);
                    if ("login".equals(TypeConvert.ToString(map.get("type")))) {
                        String id = TypeConvert.ToString(map.get("id"));
                        onlineUser.put(accessor.getSessionId(), id);
                        login(id, true);
                        System.out.println("login:" + id);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void login(String id, boolean login) {
        if (StrUtil.isNotEmpty(id)) {
            try {
//                ZNSB智能设备 obj = new ZNSB智能设备();
//                obj.setid(id);
//                if (login) {
//                    obj.set设备状态(ZNSB智能设备.SBZT设备状态.在线.name());
//                } else {
//                    obj.set设备状态(ZNSB智能设备.SBZT设备状态.离线.name());
//                }
//                obj.UpdateField(ZNSB智能设备.F_设备状态);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 注册stomp的端点
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 允许使用socketJs方式访问，访问点为webSocketServer，允许跨域
        // 在网页上我们就可以通过这个链接
        // http://localhost:8080/webSocketServer
        // 来和服务器的WebSocket连接
        registry.addEndpoint("/webSocketServer").setAllowedOrigins("*")
                .addInterceptors(new WebSocketHandlerInterceptor()).withSockJS();
    }

    /**
     * 配置信息代理
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 订阅Broker名称
        registry.enableSimpleBroker("/queue", "/topic");
        // 全局使用的消息前缀（客户端订阅路径上会体现出来）
        registry.setApplicationDestinationPrefixes("/app");
        // 点对点使用的订阅前缀（客户端订阅路径上会体现出来），不设置的话，默认也是/user/
        // registry.setUserDestinationPrefix("/user/");
    }


    //客户端只要订阅了/topic/subscribeTest主题，调用这个方法即可
    public void templateTest() {
        SimpMessagingTemplate messagingTemplate = SystemSpringConfig.getBean(SimpMessagingTemplate.class);
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend("/topic/subscribeTest", ("服务器主动推的数据"));
        }
    }

}
