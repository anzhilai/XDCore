package com.anzhilai.core.database.questdb;

import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.database.DBBase;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;

import javax.sql.DataSource;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class QuestDbDB extends DBBase {

    public QuestDbDB(DataSource dataSource) {
        super(dataSource);
        isAllowNullValue = false;
        isCreateUniqueIndex = false;
        isCreatePrimaryKey = false;
    }

    public String GetLimitString(BaseQuery pageInfo, String sql) {
        return sql + " LIMIT " + pageInfo.PageIndex + "," + (pageInfo.PageIndex + pageInfo.PageSize);
    }

    @Override
    protected StringBuilder BeforeCreateTable(StringBuilder sql, Class clazz, String tableName) {
        try {
            QuestdbBaseModel model = (QuestdbBaseModel) TypeConvert.CreateNewInstance(clazz);
            if (StrUtil.isNotEmpty(model.partitionColumn)) {
                sql.append(" timestamp(" + model.partitionColumn + ") PARTITION BY " + model.partitionType);
                return new StringBuilder(sql.toString().replace("\"" + model.partitionColumn + "\" date", "\"" + model.partitionColumn + "\" timestamp"));
            }
            return sql;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return sql;
    }

    public Object[] handleSqlParams(Object[] params) {
        if (params != null) {
            for (int i = 0; i < params.length; i++) {
                Object obj = params[i];
                if (obj != null && obj.getClass() == Date.class) {
                    params[i] = ((Date) obj).getTime();
                }
            }
        }
        return params;
    }

    public Map<String, Object> handleSqlMapResult(Map<String, Object> map) {
        if (map != null) {
            Object[] keys = map.keySet().toArray();
            for (Object key : keys) {
                Object value = map.get(key);
                if (value != null && value.getClass() == Timestamp.class) {
                    Timestamp timestamp = (Timestamp) value;
                    timestamp.setTime(timestamp.getTime() + 8 * 60 * 60 * 1000);//+8小时
                    map.put((String) key, timestamp);
                }
            }
        }
        return map;
    }

    public List<Map<String, Object>> handleSqlListResult(List<Map<String, Object>> list) {
        if (list != null) {
            for (Map<String, Object> map : list) {
                handleSqlMapResult(map);
            }
        }
        return list;
    }

    public void RegisterTypes(){
        registerColumnType(Types.BOOLEAN, "boolean");
        registerColumnType(Types.BIT, "byte");
//        registerColumnType(Types.short, "short");
        registerColumnType(Types.CHAR, "char");
        registerColumnType(Types.INTEGER, "int");
        registerColumnType(Types.FLOAT, "float");
//        registerColumnType(Types.symbol, "symbol");
        registerColumnType(Types.VARCHAR, "string");
        registerColumnType(Types.LONGVARCHAR, "string");
        registerColumnType(Types.BIGINT, "long");
        registerColumnType(Types.DATE, "date");
        registerColumnType(Types.TIMESTAMP, "date");
        registerColumnType(Types.DOUBLE, "double");
        registerColumnType(Types.BINARY, "binary");
        registerColumnType(Types.CLOB, "string");
        registerColumnType(Types.NCLOB, "string");
    }
}
