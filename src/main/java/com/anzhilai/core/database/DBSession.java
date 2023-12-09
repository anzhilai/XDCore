package com.anzhilai.core.database;

import com.alibaba.druid.pool.DruidDataSource;
import com.anzhilai.core.database.mysql.MySqlDB;
import com.anzhilai.core.database.questdb.QuestDbDB;
import com.anzhilai.core.database.sqlite.SqliteDB;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.framework.SpringConfig;
import com.anzhilai.core.toolkit.StrUtil;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 数据库会话类
 */
public class DBSession {

    /**
     * 当前数据库
     */
    DBBase CurrentDB;

    /**
     * 默认数据库
     */
    DBBase DefaultDB;

    /**
     * 自定义的缓存映射
     */
    public Map<String,Object> CacheMap = new ConcurrentHashMap<>();
    /**
     * 数据库操作回调
     */
    public interface DbRunnable {
        /**
         * 运行方法
         * @throws Exception 异常信息
         */
        void run() throws Exception;
    }

    /**
     * 使用指定数据库，并执行操作
     * @param db 数据库
     * @param runnable 数据库操作回调
     * @param <T> 数据库类型
     * @throws Exception 异常信息
     */
    public <T extends DBBase> void UseDB(T db, DbRunnable runnable) throws Exception {
        if(db==null){
            return;
        }
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
    /**
     * 数据库操作接口
     */
    public interface Work {
        /**
         * 执行方法
         * @param db 数据库
         * @throws SQLException SQL异常
         */
        void execute(DBBase db) throws SQLException;
    }

    /**
     * 设置当前数据库
     * @param db 数据库
     */
    public void SetCurrentDB(DBBase db){
        CurrentDB = db;
    }

    /**
     * 使用默认数据库
     */
    public void UseDefaultDB(){
        CurrentDB = DefaultDB;
    }

    /**
     * 设置默认数据库
     * @param db 数据库
     */
    public void setDefaultDB(DBBase db){
        DefaultDB = db;
        CurrentDB = db;
    }
    /**
     * 获取当前数据库
     * @return 当前数据库
     */
    public DBBase GetCurrentDB() {
        if(CurrentDB==null){
            DruidDataSource dataSource = SpringConfig.getBean(DruidDataSource.class);
            try {
                CurrentDB = CreateDB(dataSource.getConnection());
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(DefaultDB==null){
            DefaultDB=CurrentDB;
        }
        return CurrentDB;
    }
    /**
     * 执行数据库操作
     * @param work 数据库操作
     * @throws SQLException SQL异常
     */
    public void doWork(Work work) throws SQLException {
        DBBase odb =GetCurrentDB();
        if (odb != null) {
            work.execute(odb);
            return;
        }

    }
    /**
     * 开启事务
     */
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
    /**
     * 提交事务
     */
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

    /**
     * 回滚事务
     */
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


    /**
     * 获取数据库会话实例
     * @return 数据库会话实例
     */
    public synchronized static DBSession GetSession() {
        return GlobalValues.baseAppliction.GetSession();
    }

    public static Map<String, DataSource> hashDataSource = new ConcurrentHashMap<>();
    /**
     * 创建数据库连接池
     * @param url 数据库地址
     * @param user 用户名
     * @param pwd 密码
     * @return 数据源
     * @throws SQLException SQL异常
     */
    public static DataSource CreateDBPool(String url, String user, String pwd) {
        DataSource dataSource = hashDataSource.get(url);
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
            hashDataSource.put(url, dataSource);
        }
        return dataSource;
    }

    /**
     * 根据连接类型创建数据库实例
     * @param conn 连接
     * @return 数据库实例
     * @throws SQLException SQL异常
     */
    public static DBBase CreateDB(Connection conn) throws SQLException {
        DatabaseMetaData metaData = conn.getMetaData();
        String driver = metaData.getDriverName();
        if(driver.toLowerCase().contains("mysql")){
            return new MySqlDB(conn);
        }else if(driver.toLowerCase().contains("sqlite")){
            return new SqliteDB(conn);
        }else if(driver.toLowerCase().contains("questdb")){
            return new QuestDbDB(conn);
        }
        return new MySqlDB(conn);
    }
}
