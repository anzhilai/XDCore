package com.anzhilai.core.database;

import com.alibaba.druid.pool.DruidDataSource;
import com.anzhilai.core.database.mysql.MySqlDB;
import com.anzhilai.core.database.questdb.QuestDbDB;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.framework.SpringConfig;
import com.anzhilai.core.toolkit.StrUtil;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;


public class DBSession {

    DBBase CurrentDB;
    DBBase DefaultDB;
    public interface DbRunnable {
        void run() throws Exception;
    }


    public <T extends DBBase> void UseDB(T db, DbRunnable runnable) throws Exception {
        DBBase t = CurrentDB;
        CurrentDB=db;
        try {
            db.beginTransaction();
            runnable.run();
            db.commit();
        } catch (SQLException e) {
            db.rollback();
            throw e;
        } finally {
            db.close();
        }
        CurrentDB = t;
    }

    public interface Work {
        void execute(DBBase db) throws SQLException;
    }

    public void SetCurrentDB(DBBase db){
        CurrentDB = db;
    }
    public void UseDefaultDB(){
        CurrentDB = DefaultDB;
    }

    public DBBase GetCurrentDB() {
        if(CurrentDB==null){
            DruidDataSource dataSource = SpringConfig.getBean(DruidDataSource.class);
            try {
                CurrentDB = new MySqlDB(dataSource.getConnection());
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(DefaultDB==null){
            DefaultDB=CurrentDB;
        }
        return CurrentDB;
    }

    public void doWork(Work work) throws SQLException {
        DBBase odb =GetCurrentDB();
        if (odb != null) {
            work.execute(odb);
            return;
        }

    }

    public void beginTransaction() {
        DBBase db =GetCurrentDB();
        if (db != null) {
            try {
                db.beginTransaction();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }

    public void commitTransaction(){
        DBBase db = GetCurrentDB();
        if (db != null) {
            try {
                db.commit();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }

    public void rollbackTransaction() {
        DBBase db = null;
        try {
            db = GetCurrentDB();
            if (db != null) {
                db.rollback();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }finally {
            db.close();
        }
    }



    public synchronized static DBSession GetSession() {
        return GlobalValues.baseAppliction.GetSession();
    }

    public static Map<String, DataSource> hashDataSource = new ConcurrentHashMap<>();
    public static DataSource CreateDBPool(String poolName, String url, String user, String pwd) throws SQLException {
        DataSource dataSource = hashDataSource.get(poolName);
        if (dataSource == null && StrUtil.isNotEmpty(url) && StrUtil.isNotEmpty(user) && StrUtil.isNotEmpty(pwd)) {
            Properties properties = new Properties();
            properties.put("jdbcUrl", url);
            properties.put("dataSource.user", user);
            properties.put("dataSource.password", pwd);
            properties.put("dataSource.sslmode", "disable");
            properties.put("dataSource.cachePrepStmts", "true");
            properties.put("dataSource.prepStmtCacheSize", "250");
            properties.put("dataSource.prepStmtCacheSqlLimit", "2048");
            properties.put("maximumPoolSize", 15);
            properties.put("minimumIdle", 5);
            dataSource = new HikariDataSource(new HikariConfig(properties));
            hashDataSource.put(poolName, dataSource);
        }
        return dataSource;
    }

    public enum E_DBType {
        mysql, questdb,sqlite
    }

    public static DBBase CreateDB(E_DBType type, String poolName, String url, String user, String pwd) throws SQLException {
        DataSource dataSource = CreateDBPool(poolName, url, user, pwd);
        DBBase db = null;
        Connection conn = null;
        if (dataSource != null) {
            conn = dataSource.getConnection();
        }
        if (E_DBType.mysql.name().equals(type.name())) {
            db = new MySqlDB(conn);
        } else if (E_DBType.questdb.name().equals(type.name())) {
            db = new QuestDbDB(conn);
        }
        return db;
    }
}
