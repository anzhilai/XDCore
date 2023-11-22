package com.anzhilai.core.toolkit.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
public class WebSocketHandler implements org.springframework.web.socket.WebSocketHandler {

    private static AtomicInteger onlineCount = new AtomicInteger(0);

    private static final ArrayList<WebSocketSession> sessions = new ArrayList<>();

    private final Logger LOGGER = LoggerFactory.getLogger(WebSocketHandler.class);

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        int onlineNum = addOnlineCount();
        LOGGER.info("Oprn a WebSocket. Current connection number: " + onlineNum);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        SocketMessageHander.closeWebSocketSession(session);
        int onlineNum = subOnlineCount();
        LOGGER.info("Close a webSocket. Current connection number: " + onlineNum);
    }

    @Override
    public void handleMessage(WebSocketSession wsSession, WebSocketMessage<?> message) throws Exception {
        if (message.getClass() == TextMessage.class) {
            String data = ((TextMessage) message).getPayload().trim();
            LOGGER.info("Receive a message from client: " + data);
            SocketMessageHander.handMessage(wsSession, data);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        LOGGER.error("Exception occurs on webSocket connection. disconnecting....");
        if (session.isOpen()) {
            session.close();
        }
        sessions.remove(session);
        subOnlineCount();
    }

    /*
     * 是否支持消息拆分发送：如果接收的数据量比较大，最好打开(true), 否则可能会导致接收失败。
     * 如果出现WebSocket连接接收一次数据后就自动断开，应检查是否是这里的问题。
     */
    @Override
    public boolean supportsPartialMessages() {
        return true;
    }


    public static int getOnlineCount() {
        return onlineCount.get();
    }

    public static int addOnlineCount() {
        return onlineCount.incrementAndGet();
    }

    public static int subOnlineCount() {
        return onlineCount.decrementAndGet();
    }

}
