package com.anzhilai.core.database.questdb;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.database.DBBase;
import com.anzhilai.core.toolkit.ScanUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.hibernate.dialect.Dialect;

import java.sql.Connection;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class QuestDbDB extends DBBase {
    public QuestDbDialect dialect = new QuestDbDialect();

    @Override
    public Dialect GetDialect() {
        return dialect;
    }

    public QuestDbDB(Connection conn) {
        super(conn);
        hasDefaultValue = false;
        hasIndex = false;
        hasPrimaryKey = false;
    }

    public String GetLimitString(BaseQuery pageInfo, String sql) {
        return sql + " LIMIT " + pageInfo.PageIndex + "," + (pageInfo.PageIndex + pageInfo.PageSize);
    }

    @Override
    public StringBuilder CreateTableBefore(StringBuilder sql, Class clazz, String tableName) {
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

    public void ScanPackages(String... basePackages) {
        if (basePackages != null) {
            for (String basePackage : basePackages) {
                Set<Class<?>> classes = ScanUtil.getClasses(basePackage);
                for (Class<?> aClass : classes) {
                    if (BaseModel.class.isAssignableFrom(aClass)) {
                        CheckTable((Class<BaseModel>) aClass);
                    }
                }
            }
        }
    }
}
