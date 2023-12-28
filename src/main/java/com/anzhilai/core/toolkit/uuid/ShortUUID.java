package com.anzhilai.core.toolkit.uuid;

import com.fasterxml.uuid.Generators;


public class ShortUUID  {

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
