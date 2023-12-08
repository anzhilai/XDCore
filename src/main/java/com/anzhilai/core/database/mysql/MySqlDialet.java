package com.anzhilai.core.database.mysql;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Types;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;

public class MySqlDialet {


    private static Map<String, Integer> jdbcTypes; // Name to value
    private static Map<Integer, String> jdbcTypeValues; // value to Name
    private static Map<Integer, Class<?>> jdbcJavaTypes; // jdbc type to java

    // type
    static {
        jdbcTypes = new TreeMap<String, Integer>();
        jdbcTypeValues = new TreeMap<Integer, String>();
        jdbcJavaTypes = new TreeMap<Integer, Class<?>>();
        Field[] fields = Types.class.getFields();
        for (int i = 0, len = fields.length; i < len; ++i) {
            if (Modifier.isStatic(fields[i].getModifiers())) {
                try {
                    String name = fields[i].getName();
                    Integer value = (Integer) fields[i].get(Types.class);
                    jdbcTypes.put(name, value);
                    jdbcTypeValues.put(value, name);
                } catch (IllegalArgumentException e) {
                } catch (IllegalAccessException e) {
                }
            }
        }
        // 初始化jdbcJavaTypes：
        jdbcJavaTypes.put(Types.LONGNVARCHAR, String.class); // -16
        // 字符串
        jdbcJavaTypes.put(Types.NCHAR, String.class); // -15 字符串
        jdbcJavaTypes.put(Types.NVARCHAR, String.class); // -9 字符串
        jdbcJavaTypes.put((Types.ROWID), String.class); // -8 字符串
        jdbcJavaTypes.put((Types.BIT), Boolean.class); // -7 布尔
        jdbcJavaTypes.put((Types.TINYINT), Byte.class); // -6 数字
        jdbcJavaTypes.put((Types.BIGINT), Long.class); // -5 数字
        jdbcJavaTypes.put((Types.LONGVARBINARY), Blob.class); // -4
        // 二进制
        jdbcJavaTypes.put((Types.VARBINARY), Blob.class); // -3 二进制
        jdbcJavaTypes.put((Types.BINARY), Blob.class); // -2 二进制
        jdbcJavaTypes.put((Types.LONGVARCHAR), String.class); // -1
        // 字符串
        // jdbcJavaTypes.put((Types.NULL), String.class); // 0 /
        jdbcJavaTypes.put((Types.CHAR), String.class); // 1 字符串
        jdbcJavaTypes.put((Types.NUMERIC), BigDecimal.class); // 2
        // 数字/BigDecimal
        jdbcJavaTypes.put((Types.DECIMAL), BigDecimal.class); // 3
        // 数字/BigDecimal
        jdbcJavaTypes.put((Types.INTEGER), Integer.class); // 4 数字
        jdbcJavaTypes.put((Types.SMALLINT), Short.class); // 5 数字
        jdbcJavaTypes.put((Types.FLOAT), Double.class); // 6
        // 数字/BigDecimal
        jdbcJavaTypes.put((Types.REAL), Float.class); // 7
        // 数字/BigDecimal
        jdbcJavaTypes.put((Types.DOUBLE), Double.class); // 8 数字
        // //BigDecimal
        jdbcJavaTypes.put((Types.VARCHAR), String.class); // 12 字符串
        jdbcJavaTypes.put((Types.BOOLEAN), Boolean.class); // 16 布尔
        // jdbcJavaTypes.put((Types.DATALINK), String.class); // 70 /
        jdbcJavaTypes.put((Types.DATE), Date.class); // 91 日期
        jdbcJavaTypes.put((Types.TIME), Date.class); // 92 日期
        jdbcJavaTypes.put((Types.TIMESTAMP), Date.class); // 93 日期
        jdbcJavaTypes.put((Types.OTHER), Object.class); // 1111 其他类型？
        // jdbcJavaTypes.put((Types.JAVA_OBJECT), Object.class); //
        // 2000
        // jdbcJavaTypes.put((Types.DISTINCT), String.class); // 2001
        // jdbcJavaTypes.put((Types.STRUCT), String.class); // 2002
        // jdbcJavaTypes.put((Types.ARRAY), String.class); // 2003
        jdbcJavaTypes.put((Types.BLOB), Blob.class); // 2004 二进制
        jdbcJavaTypes.put((Types.CLOB), Clob.class); // 2005 大文本
        // jdbcJavaTypes.put((Types.REF), String.class); // 2006
        // jdbcJavaTypes.put((Types.SQLXML), String.class); // 2009
        jdbcJavaTypes.put((Types.NCLOB), Clob.class); // 2011 大文本
    }

    public static int getJdbcCode(String jdbcName) {
        return jdbcTypes.get(jdbcName);
    }

    public static String getJdbcName(int jdbcCode) {
        return jdbcTypeValues.get(jdbcCode);
    }

    public static Class<?> jdbcTypeToJavaType(int jdbcType) {
        return jdbcJavaTypes.get(jdbcType);
    }

    public static boolean isJavaNumberType(int jdbcType) {
        Class<?> type = jdbcJavaTypes.get(jdbcType);
        return (type == null) ? false : (Number.class.isAssignableFrom(type)) ? true : false;
    }
}
