package com.anzhilai.core.framework;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Component
public class AnnotationScan implements ApplicationListener<ContextRefreshedEvent> {

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (event.getApplicationContext().getParent() == null) {// 根容器为Spring容器
            Map<String, Object> beans = event.getApplicationContext().getBeansWithAnnotation(Controller.class);
        }
    }
}
