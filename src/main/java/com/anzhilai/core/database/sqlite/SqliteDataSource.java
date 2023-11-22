package com.anzhilai.core.database.sqlite;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.base.XColumn;
import com.anzhilai.core.base.XIndex;
import com.anzhilai.core.database.SqlTable;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.framework.SystemSessionManager;
import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.LockUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.database.BaseDataSource;
import com.anzhilai.core.database.DataTable;
import org.hibernate.jdbc.Work;

import java.io.File;
import java.lang.reflect.Field;
import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class SqliteDataSource extends BaseDataSource {
    private static SqliteDataSource sqliteDataSource = null;
    public static final String MEMORY_DB_PATH = ":memory:";//内存数据库

    public static SqliteDataSource GetMainSqliteDataSource() {
        if (sqliteDataSource == null) {
            sqliteDataSource = new SqliteDataSource();
            if (GlobalValues.baseAppliction != null && StrUtil.isNotEmpty(GlobalValues.baseAppliction.DatasourceUrl)) {
                String path = GlobalValues.baseAppliction.DatasourceUrl.replaceAll("jdbc:sqlite:", "");
                sqliteDataSource.dbPath = new File(path).getAbsoluteFile().getPath();
            }
            sqliteDataSource.isMainDataSource = true;
        }
        return sqliteDataSource;
    }

    //连接打开后一直不关闭
    private Connection conn;

    public SqliteDataSource(String... basePackages) {
        super(new SQLiteDialect(), basePackages);
        createIdIndex = false;
    }

    public void beginTransaction() throws SQLException {
        super.beginTransaction();
        this.lockDb();
    }

    public void lockDb() {
        LockUtil.Lock(getLockKey());
    }

    public void unLockDb() {
        LockUtil.UnLock(getLockKey());
    }

    public void handleDataTable(DataTable dataTable) {
        if (dataTable.Data.size() > 0) {
            List<String> listKey = new ArrayList<>();//时间转换
            for (String col : dataTable.DataSchema.keySet()) {
                if (Date.class.isAssignableFrom(dataTable.DataSchema.get(col))) {
                    listKey.add(col);
                }
            }
            for (Map<String, Object> row : dataTable.Data) {
                for (String col : listKey) {
                    Object value = row.get(col);
                    if (value != null) {
                        row.put(col, new Date(TypeConvert.ToLong(value)));
                    }
                }
            }
        }
    }

    //获取索引名称
    public String GetTableIndexName(String tableName, String... colName) {
        String ret = "index_" + tableName + "_";
        for (String str : colName) {
            ret += str;
        }
        return ret;
    }

    //查询索引列表
    public String GetTableIndex(String tableName) {
        return "select name as Key_name from sqlite_master where type = 'index' AND tbl_name = '" + tableName + "'";
    }

    public SqliteDataSource init(String path) {
        try {
            if (MEMORY_DB_PATH.equals(path)) {
                this.dbPath = path;
            } else {
                this.dbPath = new File(path).getAbsoluteFile().getPath();
            }
            Class.forName("org.sqlite.JDBC");
            this.conn = DriverManager.getConnection("jdbc:sqlite:" + this.dbPath);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return this;
    }

    public String GetLimitString(BaseQuery pageInfo, String sql) {
        return sql + " LIMIT " + pageInfo.PageIndex + "," + pageInfo.PageSize;
    }

    @Override
    public Connection newConnection() throws SQLException {
        if (this.isMainDataSource) {
            this.lockDb();
        }
        if (conn == null || conn.isClosed()) {
            init(this.dbPath);
        }
        return conn;
    }

    @Override
    public void close(Connection connection) throws SQLException {
        super.close(connection);
        if (this.isMainDataSource) {
            this.unLockDb();
        }
    }

    public void commit() throws SQLException {
        if (this.isMainDataSource) {
            Connection connection = threadConnectionMap.remove(Thread.currentThread().getId());
            if (connection != null) {
                try {
                    connection.commit();
                } catch (Exception e) {
                    throw e;
                } finally {
                    this.close(connection);
                }
            }
        } else {
            super.commit();
        }
    }

    public void rollback() throws SQLException {
        if (this.isMainDataSource) {
            Connection connection = threadConnectionMap.remove(Thread.currentThread().getId());
            if (connection != null) {
                try {
                    connection.rollback();
                } catch (Exception e) {
                    throw e;
                } finally {
                    this.close(connection);
                }
            }
        } else {
            super.rollback();
        }
    }

    public void doWork(Work work) throws SQLException {
        if (this.isMainDataSource) {
            Connection con = null;
            boolean autoCommit = true;
            boolean existsConnection = false;
            try {
                existsConnection = threadConnectionMap.containsKey(Thread.currentThread().getId());
                con = getConnection();
                autoCommit = con.getAutoCommit();
                work.execute(con);
            } catch (SQLException e) {
                throw e;
            } finally {
                if (!existsConnection && autoCommit) {
                    close(con);
                }
            }
        } else {
            super.doWork(work);
        }
    }

    @Override
    public DataTable GetTables() throws SQLException {
        String sql = "select name from sqlite_master where type='table' order by name";
        DataTable dt = ListSql(sql);
        for (Map<String, Object> row : dt.Data) {
            String 表名 = TypeConvert.ToString(row.get(row.keySet().toArray()[0]));
            row.put("表名", 表名);
            row.put(BaseModel.F_id, 表名);
        }
        return dt;
    }

    @Override
    public void closeDataSource() {
        if (conn != null) {
            try {
                conn.close();
                conn = null;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        this.unLockDb();
    }

    protected static void ExeSql(String sql, Object... params) throws SQLException {
        SystemSessionManager.getSession().doWork(true, conn -> {
            PreparedStatement statement = conn.prepareStatement(sql);
            if (params != null) {
                for (int i = 0; i < params.length; i++) {
                    statement.setObject(i, params[i]);
                }
            }
            statement.execute();
        });
    }

    //sqlite 自己处理表的修改
    @Override
    public boolean AlterTable(Class clazz, String tableName, DataTable dt) throws SQLException {
        String sqlindex = GetTableIndex(tableName);
        Field[] fields = clazz.getFields();
        boolean reset = false;
        String columns = "";
        for (Field field : fields) {
            XColumn xc = field.getAnnotation(XColumn.class);
            String columnName = field.getName();
            if (xc != null) {
                if (StrUtil.isNotEmpty(xc.name())) {
                    columnName = xc.name();
                }
                boolean has = false;
                boolean sametype = false;
                for (String col : dt.DataSchema.keySet()) {
                    if (columnName.equals(col)) {
                        columns += "," + SqlTable.getQuote(columnName);
                        has = true;
                        if (SqlTable.getDbType(field.getType(), xc).equals(SqlTable.getDbType(dt.DataSchema.get(col), xc))) {
                            sametype = true;
                        } else {
                            sametype = false;
                        }
                    }
                }
                if (!has || !sametype) {
                    reset = true;
                }
            }
        }
        DataTable dtindex = ListSql(sqlindex);
        if (reset) {//需要重新初始化表
            String oldTableName = "_" + tableName + "_old_" + DateUtil.GetDateString(new Date(), "yyyyMMdd_hhmmss");
            String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " RENAME TO " + SqlTable.getQuote(oldTableName);
            ExeSql(sql);
            for (Map mi : dtindex.Data) {
                String indexName = TypeConvert.ToString(mi.get("Key_name"));
                if (indexName.startsWith("index_")) {
                    sql = "DROP INDEX " + SqlTable.getQuote(indexName);
                    ExeSql(sql);
                }
            }
            SqlTable.CreateTable(clazz, tableName);
            //合并数据
            columns = columns.replaceFirst(",", "");
            sql = "INSERT INTO " + SqlTable.getQuote(tableName) + "(" + columns + ") SELECT " + columns + " FROM " + SqlTable.getQuote(oldTableName);
            ExeSql(sql);
        } else {
            for (Field field : fields) {
                XColumn xc = field.getAnnotation(XColumn.class);
                String columnName = field.getName();
                if (xc != null) {
                    if (StrUtil.isNotEmpty(xc.name())) {
                        columnName = xc.name();
                    }
                    XIndex xi = field.getAnnotation(XIndex.class);
                    if (xi != null) {
                        String icolumns = StrUtil.join(xi.columns());
                        if (StrUtil.isEmpty(icolumns)) {
                            icolumns = columnName;
                        }
                        String ikey = icolumns + "_index";
                        String indexName = GetTableIndexName(tableName, icolumns);
                        if (StrUtil.isNotEmpty(indexName)) {
                            ikey = indexName;
                        }
                        boolean has = false;
                        for (Map mi : dtindex.Data) {
                            String iname = TypeConvert.ToString(mi.get("Key_name"));
                            if (ikey.equals(iname)) {
                                has = true;
                            }
                        }
                        if (!has) {//创建索引
                            StringBuilder sindex = new StringBuilder();
                            // create index 索引名 using hash on 表名(列名);
                            if (xi.unique()) {
                                sindex.append(" create UNIQUE index ");
                            } else {
                                sindex.append(" create index ");
                            }
                            sindex.append(ikey);
                            sindex.append(" on ").append(tableName).append("(").append(icolumns).append(")");
                            ExeSql(sindex.toString());
                        }
                    }
                }
            }
        }
        return true;
    }

    //备份数据库
    public void BackupByFile(File file) throws SQLException {
        try (Statement statement = this.getConnection().createStatement()) {
            statement.execute("backup to " + file.getPath());
        } catch (Exception e) {
            throw e;
        }
    }

    //恢复数据库
    public void RestoreByFile(File file) throws SQLException {
        if (file.exists()) {
            try (Statement statement = this.getConnection().createStatement()) {
                statement.execute("restore from " + file.getPath());
            } catch (Exception e) {
                throw e;
            }
        }
    }
}
