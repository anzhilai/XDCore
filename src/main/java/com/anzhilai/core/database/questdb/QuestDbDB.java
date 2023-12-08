package com.anzhilai.core.database.questdb;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.database.DBBase;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.database.SqlTable;
import com.anzhilai.core.database.DBSession;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class QuestDbDB extends DBBase {
    public static QuestDbDB dataSource;


    //初始化QuestDbDataSource连接池
    public static QuestDbDB init(String url, String user, String pwd) {
        if (StrUtil.isNotEmpty(url) && StrUtil.isNotEmpty(user) && StrUtil.isNotEmpty(pwd)) {
            try {
                int maximumPoolSize = 15;
                int minimumIdle = 5;
                QuestDbDB dataSource = new QuestDbDB(new String[]{});
                dataSource.initConnPool(QuestDbDB.GetConnectProperties(url, user, pwd, maximumPoolSize, minimumIdle));
                QuestDbDB.dataSource = dataSource;
                //扫描所有继承QuestdbBaseModel的包
                try {
                    for (String table : SqlCache.hashMapClasses.keySet()) {
                        Class<BaseModel> _class = SqlCache.hashMapClasses.get(table);
                        if (QuestdbBaseModel.class.isAssignableFrom(_class)) {
                            SqlTable.CheckTable(_class);
                        }
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                } finally {

                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return QuestDbDB.dataSource;
    }

    public QuestDbDB(String... basePackages) {
        super(new QuestDbDialect(), basePackages);
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
            QuestdbBaseModel model = (QuestdbBaseModel)TypeConvert.CreateNewInstance(clazz);
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

    public Map<String, Object> handleSqlResult(Map<String, Object> map) {
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

    public List<Map<String, Object>> handleSqlResult(List<Map<String, Object>> list) {
        if (list != null) {
            for (Map<String, Object> map : list) {
                handleSqlResult(map);
            }
        }
        return list;
    }

}
