package com.anzhilai.core.database;

import com.anzhilai.core.base.*;
import com.anzhilai.core.database.mysql.MySqlDB;
import com.anzhilai.core.database.mysql.MySqlDialet;
import com.anzhilai.core.database.sqlite.SqliteDB;
import com.anzhilai.core.framework.SpringConfig;
import com.anzhilai.core.toolkit.ScanUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.hibernate.dialect.Dialect;
import org.hibernate.engine.spi.RowSelection;
import org.hibernate.jdbc.Work;

import javax.sql.DataSource;
import java.lang.reflect.Field;
import java.sql.*;
import java.util.*;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

/*
 *使用其他连接
 */
public abstract class DBBase {

    public static Map<String, DataSource> hashDataSource = new ConcurrentHashMap<>();
    public static DataSource CreateDBPool(String url, String user, String pwd) throws SQLException {
        DataSource dataSource = hashDataSource.get(url);
        if(dataSource==null){
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
            hashDataSource.put(url,dataSource);
        }
        return dataSource;
    }
    public static DBBase CreateDB(String type,String url, String user, String pwd) throws SQLException {
        DataSource dataSource = CreateDBPool(url,user,pwd);
        DBBase db = null;
        if(url.contains("")){
            db=new MySqlDB(dataSource.getConnection());
        }
        return db;
    }

    public static DBBase CreateDB(Connection conn){
        return new MySqlDB(conn);
    }


    public DBBase(){

    }
    public DBBase(Connection conn){
        this.connection = conn;
    }

    protected Connection connection;
    public Connection getConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            return connection;
        }
        return null;
    }

    public void beginTransaction() throws SQLException {
        Connection connection = getConnection();
        connection.setAutoCommit(false);
    }

    public void commit() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            try {
                connection.commit();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public void rollback() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            try {
                connection.rollback();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public void close()  {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }

    public Object[] handleSqlParams(Object[] params) {
        return params;
    }

    public Map<String, Object> handleSqlMapResult(Map<String, Object> map) {
        return map;
    }

    public List<Map<String, Object>> handleSqlListResult(List<Map<String, Object>> list) {
        return list;
    }

    public void handleDataTable(DataTable dataTable) { }

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


    public Dialect GetDialect() {
        return this.dialect;
    }


    int ExeSql(String sql, Object... params) throws SQLException {
        final ArrayList<Integer> retList = new ArrayList<>();
        DBSession.getSession().doWork( db -> {
            retList.add(new QueryRunner().update(db.getConnection(), sql, params));
        });
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return 0;
    }

     DataTable ListSql(String sql, Object... params) throws SQLException {
        final ArrayList<DataTable> retList = new ArrayList<>();
        DBSession.getSession().doWork( db -> {
            QueryRunner qr = new QueryRunner();
            SqlListHandler list = new SqlListHandler();
            List<Map<String, Object>> lm;
            lm = qr.query(db.getConnection(), sql, list, params);
            DataTable dt = new DataTable(lm, list.DataSchema);
            this.handleDataTable(dt);
            retList.add(dt);
        });
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return null;
    }

    public Class<?> jdbcTypeToJavaType(int jdbcType) {
        return MySqlDialet.jdbcTypeToJavaType(jdbcType);
    }

    // 获取一个引用
    public String getQuote(String name) {
        Dialect dialect = GetDialect();
        return dialect.openQuote() + name + dialect.closeQuote();
    }

    public String getDbType(Class clazz, XColumn xc) {
        Dialect dialect = GetDialect();
        if (clazz.equals(String.class) && xc.columnDefinition().equals("text")) {
            return dialect.getTypeName(Types.CLOB);
        }
        if (clazz.equals(String.class) && xc.text()) {
            return dialect.getTypeName(Types.CLOB);
        }
        if (clazz.equals(String.class) && xc.mediumtext()) {
            return dialect.getTypeName(Types.CLOB);
        }
        return getDbType(clazz, xc.length(), xc.precision(), xc.scale());
    }

    public String getDbType(Class clazz, long length, int precision, int scale) {
        Dialect dialect = GetDialect();
        if (clazz.equals(Byte[].class)) {
            return dialect.getTypeName(Types.BLOB);
        }
        if (clazz.equals(Clob.class)) {
            return dialect.getTypeName(Types.CLOB);
        }
        if (clazz.equals(Blob.class)) {
            return dialect.getTypeName(Types.CLOB);
        }
        if (clazz.equals(Date.class)) {
            return dialect.getTypeName(Types.TIMESTAMP);
        }
        if (clazz.equals(Integer.class) || clazz.equals(int.class)) {
            return dialect.getTypeName(Types.INTEGER);
        }
        if (clazz.equals(Float.class) || clazz.equals(float.class)) {
            return dialect.getTypeName(Types.FLOAT);
        }
        if (clazz.equals(Long.class) || clazz.equals(long.class)) {
            return dialect.getTypeName(Types.BIGINT);
        }
        if (clazz.equals(Double.class) || clazz.equals(double.class)) {
            return dialect.getTypeName(Types.DOUBLE);
        }
        if (clazz.equals(Boolean.class) || clazz.equals(boolean.class)) {
            return dialect.getTypeName(Types.BIT);
        }
        return dialect.getTypeName(Types.VARCHAR, length, precision, scale);
    }

    public String getDbType(TableColType type, long length, int precision, int scale) {
        Dialect dialect = GetDialect();
        if (type.equals(TableColType.大字段)) {
            return dialect.getTypeName(Types.BLOB);
        }
        if (type.equals(TableColType.文本大字段)) {
            return dialect.getTypeName(Types.CLOB);
        }
        if (type.equals(TableColType.日期)) {
            return dialect.getTypeName(Types.TIMESTAMP);
        }
        if (type.equals(TableColType.整数)) {
            return dialect.getTypeName(Types.INTEGER);
        }
        if (type.equals(TableColType.浮点数)) {
            return dialect.getTypeName(Types.DOUBLE);
        }
        if (type.equals(TableColType.布尔值)) {
            return dialect.getTypeName(Types.BIT);
        }
        if (type.equals(TableColType.文本)) {
            return dialect.getTypeName(Types.VARCHAR, length, precision, scale);
        }
        return dialect.getTypeName(Types.VARCHAR, length, precision, scale);
    }

    public <T extends BaseModel> void CheckTable(Class<T> clazz) {
        if (!clazz.isAnnotationPresent(XTable.class)) {
            return;
        }
        SqlCache.RemoveClass(clazz);
        SqlCache.AddClass(clazz);
        String tablename = BaseModel.GetTableName(clazz);
        String sql = "select * from " + tablename + " limit 1";
        DataTable dt = null;
        try {
            dt = ListSql(sql);
            if (dt == null) {
                CreateTable(clazz, tablename);
                dt = ListSql(sql);
            }
            if (dt != null) {
                AlterTable(clazz, tablename, dt);
            }
        } catch (Exception e) {
            if (SqlExe.CheckSqlException(e)) {
                try {
                    CreateTable(clazz, tablename);
                    dt = ListSql(sql);
                    AlterTable(clazz, tablename, dt);
                } catch (SQLException sqlException) {
                    sqlException.printStackTrace();
                }
                return;
            }
            e.printStackTrace();
        }
    }

    public List<Class> GetSuperclass(Class clazz, List<Class> list) {
        if (clazz != null && clazz != Object.class) {
            GetSuperclass(clazz.getSuperclass(), list);
            list.add(clazz);
        }
        return list;
    }

    //mysql表名
    public DataTable GetTables() throws SQLException {

        String sql = "show tables";
        DataTable dt = ListSql(sql);
        for (Map<String, Object> row : dt.Data) {
            String 表名 = TypeConvert.ToString(row.get(row.keySet().toArray()[0]));
            row.put("表名", 表名);
            row.put(BaseModel.F_id, 表名);
        }
        return dt;
    }

    public void CreateTable(String tableName, String id, boolean isPrimaryKey) throws SQLException {
        Dialect dialect = this.GetDialect();
        String sql = "";
        sql += "CREATE TABLE IF NOT EXISTS " + this.getQuote(tableName) + " (";
        sql += getQuote(id) + " " + dialect.getTypeName(Types.VARCHAR, 255, 0, 0) + (isPrimaryKey ? " NOT NULL,PRIMARY KEY (" + id + ")" : " NULL");
        sql += ")";
        ExeSql(sql);
    }

    public void DropTable(String tableName) throws SQLException {
        String sql = "DROP TABLE " + getQuote(tableName);
        ExeSql(sql);
    }

    public void RenameTable(String oldTableName, String newTableName) throws SQLException {
        String sql = "ALTER TABLE " + getQuote(oldTableName) + " RENAME TO " + getQuote(newTableName);
        ExeSql(sql);
    }

    public void RenameTableColumn(String tableName, String oldColumnName, String newColumnName, TableColType colType, long length, int precision, int scale) throws SQLException {
//        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " RENAME COLUMN " + SqlTable.getQuote(oldColumnName) + " TO " + SqlTable.getQuote(newColumnName);
        String sql = "ALTER TABLE " + getQuote(tableName) + " CHANGE COLUMN " + getQuote(oldColumnName) + " " + getQuote(newColumnName) + " " + getDbType(colType, length, precision, scale);
        ExeSql(sql);
    }

    public void CreateTablePrimaryKey(String tableName, String primaryKeyName, List<String> cols) throws SQLException {
        String primaryKey = "";
        for (String col : cols) {
            primaryKey += "," + getQuote(col);
        }
        primaryKey = StrUtil.CutStart(primaryKey, ",");
        String sql = "ALTER TABLE " + getQuote(tableName) + " ADD CONSTRAINT " + getQuote(primaryKeyName) + " PRIMARY KEY (" + primaryKey + ")";
        ExeSql(sql);
    }

    public void DropTablePrimaryKey(String tableName) throws SQLException {
        String sql = "ALTER TABLE " + getQuote(tableName) + " DROP PRIMARY KEY";
        ExeSql(sql);
    }

    public void CreateTableUniqueIndex(String tableName, String indexName, String columnName) throws SQLException {
        String sql = "ALTER TABLE " + getQuote(tableName) + " ADD UNIQUE INDEX " + getQuote(indexName) + "(" + getQuote(columnName) + ")";
        ExeSql(sql);
    }

    public void DropTableUniqueIndex(String tableName, String indexName) throws SQLException {
        String sql = "ALTER TABLE " + getQuote(tableName) + " DROP INDEX " + getQuote(indexName);
        ExeSql(sql);
    }

    public enum TableColType {
        文本, 日期, 整数, 浮点数, 大字段, 文本大字段, 布尔值
    }

    public void AddTableColumn(String tableName, String colName, TableColType colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = GetDialect();
        String sql = "ALTER TABLE " + getQuote(tableName) + " ADD " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public void AddTableColumn(String tableName, String colName, Class colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = GetDialect();
        String sql = "ALTER TABLE " + getQuote(tableName) + " ADD " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public void ModifyTableColumn(String tableName, String colName, TableColType colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = GetDialect();
        String sql = "ALTER TABLE " + getQuote(tableName) + " MODIFY " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public void ModifyTableColumn(String tableName, String colName, Class colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = GetDialect();
        String sql = "ALTER TABLE " + getQuote(tableName) + " MODIFY " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public void DropColumn(String table, String col) throws SQLException {
        String sql = "ALTER TABLE " + getQuote(table) + " DROP COLUMN " + getQuote(col);// 删除列
        ExeSql(sql);
    }

    public void CreateTable(Class clazz, String tableName) throws SQLException {

        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE IF NOT EXISTS ").append(getQuote(tableName)).append(" (");
        Field[] fields = clazz.getFields();
        List<Class> list = GetSuperclass(clazz, new ArrayList<>());//按照顺序创建列名
        for (Class _super : list) {
            for (Field field : fields) {
                if (field.getDeclaringClass() != _super) {
                    continue;
                }
                XColumn xc = field.getAnnotation(XColumn.class);
                String columnName = field.getName();
                if (xc != null) {
                    if (StrUtil.isNotEmpty(xc.name())) {
                        columnName = xc.name();
                    }
                    sql.append(getQuote(columnName));
                    sql.append(' ').append(getDbType(field.getType(), xc));
                    if (hasDefaultValue) {
                        if (columnName.equals(BaseModel.F_id) || !xc.nullable()) {
                            sql.append(' ').append(" NOT NULL ");
                        } else {
                            sql.append(' ').append(" DEFAULT NULL ");
                        }
                    }
                    sql.append(',');
                }
            }
        }
        if (hasPrimaryKey) {
            sql.append(" PRIMARY KEY (" + BaseModel.F_id + ")");
            sql.append(',');
        }
        if (hasIndex) {

            if (createIdIndex) {
                sql.append(" UNIQUE INDEX id_index(" + BaseModel.F_id + ")");
                sql.append(")  DEFAULT CHARSET=utf8");
            } else {
                sql.deleteCharAt(sql.length() - 1);
                sql.append(")");
            }
        } else {
            sql.deleteCharAt(sql.length() - 1);
            sql.append(")");
        }
        sql = this.CreateTableBefore(sql, clazz, tableName);
        ExeSql(sql.toString());
    }

    public void AlterTableColumn(Class clazz, String tableName, String columnName) throws SQLException {
        Field[] fields = clazz.getFields();
        for (Field field : fields) {
            XColumn xc = field.getAnnotation(XColumn.class);
            if (field.getName().equals(columnName)) {
                StringBuilder sql = new StringBuilder();
                sql.append("ALTER TABLE ").append(getQuote(tableName)).append(" MODIFY COLUMN  ");
                sql.append(getQuote(columnName));
                sql.append(' ').append(getDbType(field.getType(), xc));
                if (!xc.nullable()) {
                    sql.append(' ').append(" NOT NULL ");
                } else {
                    sql.append(' ').append(" DEFAULT NULL ");
                }
                ExeSql(sql.toString());
            }
        }
    }

    public void AlterTable(Class clazz, String tableName, DataTable dt) throws SQLException {

        String sqlindex = GetTableIndex(tableName);
        DataTable dtindex = hasIndex ? ListSql(sqlindex) : new DataTable();
        List<String> listindex = new ArrayList<>();
        //        show index from mytable;// Table  Key_name Column_name index_type

        Field[] fields = clazz.getFields();
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
                        has = true;
                        //todo:: 需要保存并验证上一次的xc
                        if (getDbType(field.getType(), xc).equals(getDbType(dt.DataSchema.get(col), xc))) {
                            sametype = true;
                            if (field.getType() == String.class && dt.DbDataSchema.containsKey(col) && !"string".equals(getDbType(field.getType(), xc))) {
                                boolean isVarchar = dt.DbDataSchema.get(col).toLowerCase().contains("varchar");
                                boolean longtext = getDbType(field.getType(), xc).toLowerCase().contains("longtext");
                                if ((isVarchar && longtext) || (!isVarchar && !longtext)) {
                                    sametype = false;
                                }
                            }
                        } else {
                            sametype = false;
                        }
                    }
                }
                if (!has) {
                    sametype = true;
                    StringBuilder sql = new StringBuilder();
                    sql.append("ALTER TABLE ").append(getQuote(tableName)).append("   ADD COLUMN  ");
                    sql.append(getQuote(columnName));
                    sql.append(' ').append(getDbType(field.getType(), xc));
                    if (!xc.nullable()) {
                        sql.append(' ').append(" NOT NULL ");
                    } else {
                        sql.append(' ').append(" DEFAULT NULL ");
                    }
                    ExeSql(sql.toString());
                }
                //类型不同，修改类型
                if (!sametype) {
                    StringBuilder sql = new StringBuilder();
                    sql.append("ALTER TABLE ").append(getQuote(tableName)).append(" MODIFY COLUMN  ");
                    sql.append(getQuote(columnName));
                    sql.append(' ').append(getDbType(field.getType(), xc));
                    if (!xc.nullable()) {
                        sql.append(' ').append(" NOT NULL ");
                    } else {
                        sql.append(' ').append(" DEFAULT NULL ");
                    }
                    ExeSql(sql.toString());
                }

            }
            if (!hasIndex) {
                continue;
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
                        listindex.add(ikey);
                    }
                }
                if (!has) {
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
        //        alter table mytable drop index mdl_tag_use_ix;//mdl_tag_use_ix是上表查出的索引名，key_name
    }































    public String dbPath = null;
    public Dialect dialect;
    public String[] basePackages;
    public boolean createIdIndex = true;
    public boolean hasDefaultValue = true;
    public boolean hasIndex = true;
    public boolean hasPrimaryKey = true;
    //连接池
    public HikariDataSource hikariDataSource;
    public HikariConfig hikariConfig;

    public DBBase(Dialect dialect, String... basePackages) {
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





    //扫描包名
    public void ScanPackages() {
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


    public void closeDataSource() {
        if (hikariDataSource != null) {
            hikariDataSource.close();
        }
    }



    public String getLockKey() {
        String lockKey = StrUtil.isEmpty(this.dbPath) ? "" : this.dbPath;
        return lockKey;
    }

    public void lockDb() {
    }

    public void unLockDb() {
    }


}
