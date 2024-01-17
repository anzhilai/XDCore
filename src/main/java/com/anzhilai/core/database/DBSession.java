package com.anzhilai.core.database;

import com.alibaba.druid.pool.DruidDataSource;
import com.anzhilai.core.database.kingbase.KingbaseDb;
import com.anzhilai.core.database.mysql.MySqlDB;
import com.anzhilai.core.database.questdb.QuestDbDB;
import com.anzhilai.core.database.sqlite.SqliteDB;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.framework.SpringConfig;
import com.anzhilai.core.toolkit.StrUtil;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 数据库会话类
 * 提供数据库操作的事务能力
 */
public class DBSession {

    /**
     * 当前数据库
     */
    protected DBBase CurrentDB;

    /**
     * 默认数据库
     */
    protected DBBase DefaultDB;

    /**
     * 自定义的缓存映射
     */
    public Map<String, Object> CacheMap = new ConcurrentHashMap<>();

    /**
     * 数据库操作回调
     */
    public interface DbRunnable {
        /**
         * 运行方法
         *
         * @throws Exception 异常信息
         */
        void run() throws Exception;
    }

    /**
     * 使用指定数据库，并执行操作
     *
     * @param db       数据库
     * @param runnable 数据库操作回调
     * @param <T>      数据库类型
     * @throws Exception 异常信息
     */
    public <T extends DBBase> void UseDB(T db, DbRunnable runnable) throws Exception {
        if (db == null) {
            return;
        }
        DBBase t = CurrentDB;
        try {
            CurrentDB = db;
            db.beginTransaction();
            runnable.run();
            db.commit();
        } catch (SQLException e) {
            db.rollback();
            throw e;
        } finally {
            db.closeConnection();
            CurrentDB = t;
        }
    }

    /**
     * 数据库操作接口
     */
    public interface Work {
        /**
         * 执行方法
         *
         * @param db 数据库
         * @throws SQLException SQL异常
         */
        void execute(DBBase db) throws SQLException;
    }

    /**
     * 设置当前数据库
     *
     * @param db 数据库
     */
    public void SetCurrentDB(DBBase db) {
        CurrentDB = db;
    }

    /**
     * 使用默认数据库
     */
    public void UseDefaultDB() {
        CurrentDB = DefaultDB;
    }

    /**
     * 设置默认数据库
     *
     * @param db 数据库
     */
    public void SetDefaultDB(DBBase db) {
        DefaultDB = db;
        CurrentDB = db;
    }

    /**
     * 获取当前数据库
     *
     * @return 当前数据库
     */
    public DBBase GetCurrentDB() {
        if (CurrentDB == null) {
            DruidDataSource dataSource = SpringConfig.getBean(DruidDataSource.class);
            try {
                CurrentDB = CreateDB(dataSource);
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if (DefaultDB == null) {
            DefaultDB = CurrentDB;
        }
        return CurrentDB;
    }

    /**
     * 执行数据库操作
     *
     * @param work 数据库操作
     * @throws SQLException SQL异常
     */
    public void doWork(Work work) throws SQLException {
        DBBase db = GetCurrentDB();
        if (db != null) {
            work.execute(db);
            if (!db.isTransactionActive()) {
                db.closeConnection();
            }
        }
    }

    /**
     * 开启事务
     */
    public void beginTransaction() {
        DBBase db = GetCurrentDB();
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
    public void commitTransaction() {
        DBBase db = null;
        try {
            db = GetCurrentDB();
            if (db != null) {
                db.commit();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            if (db != null) {
                db.closeConnection();
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
        } finally {
            if (db != null) {
                db.closeConnection();
            }
        }
    }

    /**
     * 关闭当前数据库连接
     */
    public void Close() {
        GlobalValues.baseAppliction.CloseSession();
        DBBase db = GetCurrentDB();
        if (db != null) {
            db.closeConnection();
        }
    }

    @Override
    protected void finalize() throws Throwable {
        this.Close();
        super.finalize();
    }

    /**
     * 获取数据库会话实例
     *
     * @return 数据库会话实例
     */
    public synchronized static DBSession GetSession() {
        return GlobalValues.baseAppliction.GetSession();
    }

    public static Map<String, DataSource> hashDataSource = new ConcurrentHashMap<>();

    /**
     * 获取或创建数据库连接池
     *
     * @param url  数据库地址
     * @param user 用户名
     * @param pwd  密码
     * @return 数据源
     * @throws SQLException SQL异常
     */
    public static DataSource GetOrCreateDBPool(String url, String user, String pwd) {
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
     *
     * @param dataSource 连接池
     * @return 数据库实例
     * @throws SQLException SQL异常
     */
    public static DBBase CreateDB(DruidDataSource dataSource) throws SQLException {
        String url = dataSource.getUrl();
        if (url.toLowerCase().contains("jdbc:mysql")) {
            return new MySqlDB(dataSource);
        } else if (url.toLowerCase().contains("jdbc:sqlite")) {
            return new SqliteDB(url.split("jdbc:sqlite:")[1]);
        } else if (url.toLowerCase().contains("questdb")) {
            return new QuestDbDB(dataSource);
        } else if (url.toLowerCase().contains("jdbc:kingbase")) {
            return new KingbaseDb(dataSource);
        }
        return new MySqlDB(dataSource);
//        return null;
    }
}
