package com.anzhilai.core.framework;

import com.anzhilai.core.base.XInterceptor;
import com.anzhilai.core.base.XTable;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.AnnotationBeanNameGenerator;
import org.springframework.core.type.ClassMetadata;
import org.springframework.core.type.classreading.MetadataReader;
import org.springframework.core.type.classreading.MetadataReaderFactory;
import org.springframework.core.type.filter.TypeFilter;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RequestMapping;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ExcludeFilters extends AnnotationBeanNameGenerator implements TypeFilter {
    private static Class<? extends BaseApplication> MainClass = null;
    private static String[] ExcludePackages = new String[]{};
    public static List<Class<? extends BaseApplication>> AppClass = new ArrayList<>();

    public static void Init(Class<? extends BaseApplication> mainClass, String... excludePackages) {
        if (MainClass == null) {
            MainClass = mainClass;
            if (excludePackages != null) {
                ExcludePackages = excludePackages;
            }
        }
    }

    @Override
    public String generateBeanName(BeanDefinition definition, BeanDefinitionRegistry registry) {
        return definition.getBeanClassName();
    }

    @Override
    public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) {
        ClassMetadata classMetadata = metadataReader.getClassMetadata();
        String className = classMetadata.getClassName();
        boolean exists = false;
        try {
            if ((MainClass != null && className.endsWith("Application"))) {
                Class _class = Class.forName(className);
                if (_class != MainClass && BaseApplication.class.isAssignableFrom(_class)) {
                    AppClass.add(_class);
                    removeAnnotation(_class);
                    exists = true;
                }
            }
            if (!exists) {
                for (String name : ExcludePackages) {
                    if (className.contains(name) || className.matches(name)) {
                        removeAnnotation(Class.forName(className));
                        exists = true;
                        break;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return exists;
    }

    public void removeAnnotation(Class _class) throws Exception {
        removeAnnotation(_class, XTable.class);
        removeAnnotation(_class, Component.class);
        removeAnnotation(_class, SpringBootApplication.class);
        removeAnnotation(_class, Controller.class);
        removeAnnotation(_class, RequestMapping.class);
        removeAnnotation(_class, Repository.class);
        removeAnnotation(_class, XInterceptor.class);
        removeAnnotation(_class, ControllerAdvice.class);
    }

    public void removeAnnotation(Class _class, Class annotationclass) throws Exception {
        if (_class.isAnnotationPresent(annotationclass)) {
            Method method = Class.class.getDeclaredMethod("getDeclaredAnnotationMap");
            method.setAccessible(true);
            Map<Class<? extends Annotation>, Annotation> annotations = (Map<Class<? extends Annotation>, Annotation>) method.invoke(_class);
            annotations.remove(annotationclass);
        }
    }

}

