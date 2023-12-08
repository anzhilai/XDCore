package com.anzhilai.core.toolkit.uuid;

import com.fasterxml.uuid.Generators;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.Serializable;
import java.util.Properties;

public class ShortUUID  {
    private static final Log log = LogFactory.getLog(ShortUUID.class);



    public static String getUUID() {
//        Generators.timeBasedGenerator().generate();
//        Generators.randomBasedGenerator().generate();
//        Generators.nameBasedgenerator().generate();
//        Generators.timeBasedReorderedGenerator().generate();
//        Generators.timeBasedEpochGenerator().generate();
//        return UUID.randomUUID().toString().toUpperCase().replaceAll("-", "");
        return Generators.timeBasedGenerator().generate().toString().toUpperCase().replaceAll("-", "");
    }
}
