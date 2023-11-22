package com.anzhilai.core.database;

import com.fasterxml.uuid.Generators;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.HibernateException;
import org.hibernate.MappingException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.Configurable;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.Type;

import java.io.Serializable;
import java.util.Properties;

public class ShortUUIDIncrementGenerator implements IdentifierGenerator, Configurable {
    private static final Log log = LogFactory.getLog(ShortUUIDIncrementGenerator.class);

    @Override
    public void configure(Type arg0, Properties arg1, ServiceRegistry arg2) throws MappingException {
    }

    @Override
    public Serializable generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object arg1) throws HibernateException {
        return getUUID();
    }

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
