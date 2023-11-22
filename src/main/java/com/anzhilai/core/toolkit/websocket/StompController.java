package com.anzhilai.core.toolkit.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

//@Controller
public class StompController {

    @MessageMapping("/app")
    @SendTo("/topic/app")
    String echoMessageMapping(String message) {
        System.out.println(message);
        return "server:" + message;
    }
}
