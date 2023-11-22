package com.anzhilai.core.database;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.framework.SystemSessionManager;
import com.anzhilai.core.toolkit.ScanUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.commons.dbutils.QueryRunner;
import org.hibernate.dialect.Dialect;
import org.hibernate.engine.spi.RowSelection;
import org.hibernate.jdbc.Work;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

/*
 *使用其他连接池
 */
public abstract class BaseDataSource {

    public Map<Long, Connection> threadConnectionMap = new HashMap<>();
    public String dbPath = null;
    public boolean isMainDataSource = false;
    public Dialect dialect;
    public String[] basePackages;
    public boolean createIdIndex = true;
    public boolean hasDefaultValue = true;
    public boolean hasIndex = true;
    public boolean hasPrimaryKey = true;
    //连接池
    public HikariDataSource hikariDataSource;
    public HikariConfig hikariConfig;

    public BaseDataSource(Dialect dialect, String... basePackages) {
        if (dialect != null) {
            this.dialect = dialect;
        }
        this.basePackages = basePackages;
    }

    public String GetTableIndexName(String tableName, String... colName) {
        return null;
    }

    public String GetTableIndex(String tableName) {
        return "show index from " + tableName;
    }

    public StringBuilder CreateTableBefore(StringBuilder sql, Class clazz, String tableName) {
        return sql;
    }

    public String GetLimitString(BaseQuery pageInfo, String sql) {
        String _sql_ = "_sql_";
        RowSelection rowSelection = new RowSelection();
        rowSelection.setFirstRow(pageInfo.PageIndex.intValue());
        rowSelection.setFetchSize(pageInfo.PageSize.intValue());
        rowSelection.setMaxRows(pageInfo.PageIndex.intValue() * pageInfo.PageSize.intValue());
        String limitSql = dialect.getLimitHandler().processSql(_sql_, rowSelection);
//        String limitSql = dialect.getLimitString(_sqlKey, pageInfo.PageIndex.intValue(), pageInfo.PageSize.intValue());
        int length = limitSql.indexOf("?");
        if (length >= 0) {
            if (limitSql.lastIndexOf("?") == length) {//只有一个参数
                limitSql = limitSql.replace("?", pageInfo.PageSize + "");
            } else {
                limitSql = limitSql.replaceFirst("\\?", pageInfo.PageIndex + "");
                limitSql = limitSql.replaceFirst("\\?", pageInfo.PageSize + "");
            }
        }
        return limitSql.replace(_sql_, sql);
    }

    public static boolean CheckSqlException(Exception e) {
        boolean ret = false;
        String message = TypeConvert.ToString(e.getMessage()).trim();
        if (message.toLowerCase().contains("error executing work")) {
            if (e.getCause() != null) {
                message = TypeConvert.ToString(e.getCause().getMessage()).trim();
            }
        }
        if (message.toLowerCase().contains("invalid column")
                || message.toLowerCase().contains("no such column")
                || message.toLowerCase().contains("unknown column")
                || message.toLowerCase().contains("doesn't exist")
                || message.toLowerCase().contains("does not exist")
                || message.toLowerCase().contains("no such table")) {
            ret = true;
        }
        return ret;
    }

    public boolean CheckException(Exception e) {
        return false;
    }

    //扫描包名
    public void ScanPackages() {
        if (basePackages != null) {
            for (String basePackage : basePackages) {
                Set<Class<?>> classes = ScanUtil.getClasses(basePackage);
                for (Class<?> aClass : classes) {
                    if (BaseModel.class.isAssignableFrom(aClass)) {
                        SqlTable.CheckTable((Class<BaseModel>) aClass);
                    }
                }
            }
        }
    }


    public void beginTransaction() throws SQLException {
        this.setAutoCommit(false);
    }

    public void setAutoCommit(boolean autoCommit) throws SQLException {
        Connection connection = getConnection();
        connection.setAutoCommit(autoCommit);
        threadConnectionMap.put(Thread.currentThread().getId(), connection);
    }

    public Connection GetThreadConnection() throws SQLException {
        Connection connection = getConnection();
        threadConnectionMap.put(Thread.currentThread().getId(), connection);
        return connection;
    }

    public void SetThreadConnection(Connection connection) throws SQLException {
        threadConnectionMap.put(Thread.currentThread().getId(), connection);
    }

    public Connection RemoveThreadConnection() throws SQLException {
        return threadConnectionMap.remove(Thread.currentThread().getId());
    }

    public void CloseThreadConnection() {
        try {
            Connection connection = threadConnectionMap.remove(Thread.currentThread().getId());
            this.close(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void commit() throws SQLException {
        Connection connection = threadConnectionMap.get(Thread.currentThread().getId());
        if (connection != null && !connection.isClosed()) {
            try {
                connection.commit();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public void rollback() throws SQLException {
        Connection connection = threadConnectionMap.get(Thread.currentThread().getId());
        if (connection != null && !connection.isClosed()) {
            try {
                connection.rollback();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public void close(Connection connection) throws SQLException {
        if (connection != null) {
            connection.close();
        }
    }

    public void closeDataSource() {
        if (hikariDataSource != null) {
            hikariDataSource.close();
        }
    }

    public Connection getConnection() throws SQLException {
        Connection connection = threadConnectionMap.get(Thread.currentThread().getId());
        if (connection != null && !connection.isClosed()) {
            return connection;
        } else {
            if (hikariDataSource != null) {//连接池获取连接
                return hikariDataSource.getConnection();
            }
            return newConnection();
        }
    }

    public void doWork(Work work) throws SQLException {
        try {
            work.execute(getConnection());
        } catch (SQLException e) {
            throw e;
        }
    }

    public Object[] handleSqlParams(Object[] params) {
        return params;
    }

    public Map<String, Object> handleSqlResult(Map<String, Object> map) {
        return map;
    }

    public List<Map<String, Object>> handleSqlResult(List<Map<String, Object>> list) {
        return list;
    }

    public void handleDataTable(DataTable dataTable) {
    }

    public abstract Connection newConnection() throws SQLException;

    public DataTable GetTables() throws SQLException {
        return new DataTable();
    }


    protected static void ExeSql(String sql, Object... params) throws SQLException {
        SystemSessionManager.getSession().doWork(true, conn -> {
            new QueryRunner().update(conn, sql, params);
        });
    }

    protected static DataTable ListSql(String sql, Object... params) throws SQLException {
        final ArrayList<DataTable> retList = new ArrayList<>();
        SystemSessionManager.getSession().doWork(false, conn -> {
            QueryRunner qr = new QueryRunner();
            TableSqlHandler list = new TableSqlHandler();
            List<Map<String, Object>> lm;
            lm = qr.query(conn, sql, list, params);
            DataTable dt = new DataTable(lm, list.DataSchema);
            dt.DbDataSchema = list.DbDataSchema;
            BaseDataSource dataSource = SystemSessionManager.getThreadDataSource();
            if (dataSource != null) {
                dataSource.handleDataTable(dt);
            }
            retList.add(dt);
        });
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return null;
    }

    public boolean AlterTable(Class clazz, String tableName, DataTable dt) throws SQLException {
        return false;
    }

    public String getLockKey() {
        String lockKey = StrUtil.isEmpty(this.dbPath) ? "" : this.dbPath;
        return lockKey;
    }

    public void lockDb() {
    }

    public void unLockDb() {
    }

    /**
     * 初始化连接池
     *
     * @param properties
     */
    public void initConnPool(Properties properties) {
        hikariConfig = new HikariConfig(properties);
        hikariDataSource = new HikariDataSource(hikariConfig);
    }

    public static Properties GetConnectProperties(String jdbcUrl, String user, String pwd, int maximumPoolSize, int minimumIdle) {
        Properties properties = new Properties();
        properties.put("jdbcUrl", jdbcUrl);
        properties.put("dataSource.user", user);
        properties.put("dataSource.password", pwd);
        properties.put("dataSource.sslmode", "disable");
        properties.put("dataSource.cachePrepStmts", "true");
        properties.put("dataSource.prepStmtCacheSize", "250");
        properties.put("dataSource.prepStmtCacheSqlLimit", "2048");
        properties.put("maximumPoolSize", maximumPoolSize);
        properties.put("minimumIdle", minimumIdle);
        return properties;
    }
}
