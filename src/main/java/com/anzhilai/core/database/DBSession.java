package com.anzhilai.core.database;

import com.anzhilai.core.database.mysql.MySqlDB;
import com.anzhilai.core.database.questdb.QuestDbDB;
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


    public interface DbRunnable<T> {
        void run(T db) throws Exception;
    }

    public void UseDB(DBBase db) {

    }

    public void RemoveDB(){
    }

    public <T extends DBBase> void UseDB(T db, DbRunnable<T> runnable) throws Exception {
        UseDB(db);
        try {
            db.beginTransaction();
            runnable.run(db);
            db.commit();
        } catch (SQLException e) {
            db.rollback();
            throw e;
        } finally {
            db.close();
            RemoveDB();
        }
    }

    public interface Work {
        void execute(DBBase db) throws SQLException;
    }

    public void SetCurrentDB(){

    }

    public DBBase GetCurrentDB() {
        DBBase db = null;
        if (db == null) {
            db = null;
        }
        if (db == null) {
            try {
                db = CreateDB(E_DBType.mysql, "", "", "", "");
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return db;
    }

    public void doWork(Work work) throws SQLException {
        DBBase odb =null;
        if (odb != null) {
            work.execute(odb);
            return;
        }

    }

    public void beginTransaction() throws SQLException {
        DBBase db =null;
        if (db != null) {
            db.beginTransaction();
        }
    }

    public void commitTransaction() throws SQLException {
        DBBase db = null;
        if (db != null) {
            db.commit();
        }
    }

    public void rollbackTransaction() {
        DBBase db = null;
        if (db != null) {
            try {
                db.rollback();
            } catch (SQLException throwables) {
                db.close();
            }
        }

    }



    public static Map<String, DataSource> hashDataSource = new ConcurrentHashMap<>();

    public synchronized static DBSession getSession() {
        DBSession sessionManager = null;

        return sessionManager;
    }

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
