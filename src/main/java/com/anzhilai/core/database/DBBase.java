package com.anzhilai.core.database;

import com.anzhilai.core.base.*;
import com.anzhilai.core.database.mysql.SqlListHandler;
import com.anzhilai.core.database.mysql.TypeNames;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.commons.dbutils.QueryRunner;

import javax.sql.DataSource;
import java.lang.reflect.Field;
import java.sql.*;
import java.util.Date;
import java.util.*;

/**
 * 基础数据库操作类
 * 提供连接数据源的基本操作，数据库连接及库表管理等
 */
public abstract class DBBase {
    /**
     * 构造函数，用以初始化属性
     */
    public DBBase() {
        RegisterTypes();
    }

    /**
     * 构造函数，用以初始化属性和连接
     *
     * @param dataSource 数据库连接池
     */
    public DBBase(DataSource dataSource) {
        RegisterTypes();
        this.dataSource = dataSource;
    }

    protected boolean isCreateIdIndex = true;
    protected boolean isAllowNullValue = true;
    protected boolean isCreateUniqueIndex = true;
    protected boolean isCreatePrimaryKey = true;
    protected boolean useDbType = true;

    protected DataSource dataSource;
    protected Connection connection;

    /**
     * 获取或打开数据库连接对象
     *
     * @return 数据库连接对象
     * @throws SQLException SQL异常
     */
    public Connection getOrOpenConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            return connection;
        }
        if (dataSource != null) {
            connection = dataSource.getConnection();
        }
        return connection;
    }

    /**
     * 关闭数据库连接
     */
    public void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 开始事务
     *
     * @throws SQLException SQL异常
     */
    public void beginTransaction() throws SQLException {
        Connection connection = getOrOpenConnection();
        connection.setAutoCommit(false);
    }

    /**
     * 是否开启事务
     *
     * @throws SQLException SQL异常
     */
    public boolean isTransactionActive() throws SQLException {
        return !connection.getAutoCommit();
    }

    /**
     * 是否关闭连接
     */
    public boolean IsClosed() {
        try {
            return connection == null || connection.isClosed();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 提交事务
     *
     * @throws SQLException SQL异常
     */
    public void commit() throws SQLException {
        if (connection != null && !connection.isClosed() && isTransactionActive()) {
            try {
                if(isTransactionActive()) {
                    connection.commit();
                }
            } catch (Exception e) {
                throw e;
            }
        }
    }

    /**
     * 回滚事务
     *
     * @throws SQLException SQL异常
     */
    public void rollback() throws SQLException {
        if (connection != null && !connection.isClosed() && isTransactionActive()) {
            try {
                connection.rollback();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    /**
     * 处理SQL参数
     *
     * @param params SQL参数
     * @return 处理后的SQL参数
     */
    public Object[] handleSqlParams(Object[] params) {
        return params;
    }

    /**
     * 处理SQL结果映射为Map
     *
     * @param map SQL查询结果Map
     * @return 处理后的SQL查询结果Map
     */
    public Map<String, Object> handleSqlMapResult(Map<String, Object> map) {
        return map;
    }

    /**
     * 处理SQL结果映射为List
     *
     * @param list SQL查询结果List
     * @return 处理后的SQL查询结果List
     */
    public List<Map<String, Object>> handleSqlListResult(List<Map<String, Object>> list) {
        return list;
    }

    /**
     * 处理DataTable对象
     *
     * @param dataTable 数据库查询结果表
     */
    public void handleDataTable(DataTable dataTable) {
    }

    /**
     * 执行SQL语句并返回受影响的行数
     *
     * @param sql    SQL语句
     * @param params SQL参数
     * @return 受影响的行数
     * @throws SQLException SQL异常
     */
    protected int ExeSql(String sql, Object... params) throws SQLException {
        final ArrayList<Integer> retList = new ArrayList<>();
        retList.add(new QueryRunner().update(getOrOpenConnection(), sql, params));
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return 0;
    }

    /**
     * 查询SQL语句并返回DataTable对象
     *
     * @param sql    SQL语句
     * @param params SQL参数
     * @return 查询结果DataTable对象
     * @throws SQLException SQL异常
     */
    protected DataTable ListSql(String sql, Object... params) throws SQLException {
        final ArrayList<DataTable> retList = new ArrayList<>();
        QueryRunner qr = new QueryRunner();
        SqlListHandler list = new SqlListHandler();
        list.useDbType = true;
        List<Map<String, Object>> lm;
        lm = qr.query(getOrOpenConnection(), sql, list, params);
        DataTable dt = new DataTable(lm, list.DataSchema);
        dt.DbDataSchema = list.DbDataSchema;
        this.handleDataTable(dt);
        retList.add(dt);
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return null;
    }

    /**
     * 检查数据库表是否存在，不存在则创建
     *
     * @param clazz 类对象
     * @param <T>   类型参数
     */
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

    /**
     * 获取类的父类列表
     *
     * @param clazz 类对象
     * @param list  父类列表
     * @return 父类列表
     */
    List<Class> GetParentClassList(Class clazz, List<Class> list) {
        if (clazz != null && clazz != Object.class) {
            GetParentClassList(clazz.getSuperclass(), list);
            list.add(clazz);
        }
        return list;
    }

    /**
     * 获取所有表的信息
     *
     * @return 所有表的信息
     * @throws SQLException SQL异常
     */
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

    /**
     * 创建数据库表
     *
     * @param clazz     类对象
     * @param tableName 表名
     * @throws SQLException SQL异常
     */
    public void CreateTable(Class clazz, String tableName) throws SQLException {

        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE IF NOT EXISTS ").append(getQuote(tableName)).append(" (");
        Field[] fields = clazz.getFields();
        List<Class> list = GetParentClassList(clazz, new ArrayList<>());//按照顺序创建列名
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
                    if (isAllowNullValue) {
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
        if (isCreatePrimaryKey) {
            sql.append(" PRIMARY KEY (" + BaseModel.F_id + ")");
            sql.append(',');
        }
        if (isCreateUniqueIndex) {
            if (isCreateIdIndex) {
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
        sql = this.BeforeCreateTable(sql, clazz, tableName);
        ExeSql(sql.toString());
    }

    /**
     * 修改数据库表
     *
     * @param clazz     类对象
     * @param tableName 表名
     * @param dt        数据表
     * @throws SQLException SQL异常
     */
    public void AlterTable(Class clazz, String tableName, DataTable dt) throws SQLException {

        String sqlindex = GetTableIndexSql(tableName);
        DataTable dtindex = isCreateUniqueIndex ? ListSql(sqlindex) : new DataTable();
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
                if (dt.DataSchema.size() > 0) {
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
            }
            if (!isCreateUniqueIndex) {
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
    }

    /**
     * 获取表索引名称
     *
     * @param tableName 表名
     * @param colName   列名
     * @return 索引名称
     */
    public String GetTableIndexName(String tableName, String colName) {
        return null;
    }

    /**
     * 获取表索引SQL
     *
     * @param tableName 表名
     * @return 索引SQL
     */
    public String GetTableIndexSql(String tableName) {
        return "show index from " + tableName;
    }

    /**
     * 创建表之前的操作
     *
     * @param sql       SQL语句
     * @param clazz     类对象
     * @param tableName 表名
     * @return 修改后的SQL语句
     */
    protected StringBuilder BeforeCreateTable(StringBuilder sql, Class clazz, String tableName) {
        return sql;
    }

    /**
     * 获取分页查询SQL
     *
     * @param pageInfo 分页信息
     * @param sql      SQL语句
     * @return 分页查询SQL
     */
    public String GetLimitString(BaseQuery pageInfo, String sql) {
        return sql + " LIMIT " + pageInfo.PageSize + " OFFSET " + pageInfo.PageIndex;
    }

    /**
     * 注册数据库类型
     */
    public void RegisterTypes() {
        registerColumnType(Types.BIT, "bit");
        registerColumnType(Types.BOOLEAN, "boolean");
        registerColumnType(Types.TINYINT, "tinyint");
        registerColumnType(Types.SMALLINT, "smallint");
        registerColumnType(Types.INTEGER, "integer");
        registerColumnType(Types.BIGINT, "bigint");
        registerColumnType(Types.FLOAT, "float($p)");
        registerColumnType(Types.DOUBLE, "double precision");
        registerColumnType(Types.NUMERIC, "numeric($p,$s)");
        registerColumnType(Types.REAL, "real");

        registerColumnType(Types.DATE, "date");
        registerColumnType(Types.TIME, "time");
        registerColumnType(Types.TIMESTAMP, "timestamp");

        registerColumnType(Types.VARBINARY, "bit varying($l)");
        registerColumnType(Types.LONGVARBINARY, "bit varying($l)");
        registerColumnType(Types.BLOB, "blob");

        registerColumnType(Types.CHAR, "char($l)");
        registerColumnType(Types.VARCHAR, "varchar($l)");
        registerColumnType(Types.LONGVARCHAR, "varchar($l)");
        registerColumnType(Types.CLOB, "clob");

        registerColumnType(Types.NCHAR, "nchar($l)");
        registerColumnType(Types.NVARCHAR, "nvarchar($l)");
        registerColumnType(Types.LONGNVARCHAR, "nvarchar($l)");
        registerColumnType(Types.NCLOB, "nclob");
    }

    /**
     * 获取数据库列名类型
     *
     * @param clazz 类对象
     * @param xc    列属性注解
     * @return 数据库列名类型
     * @throws SQLException SQL异常
     */
    public String getDbType(Class clazz, XColumn xc) throws SQLException {
        if (clazz.equals(String.class) && xc.columnDefinition().equals("text")) {
            return getTypeName(Types.CLOB);
        }
        if (clazz.equals(String.class) && xc.text()) {
            return getTypeName(Types.CLOB);
        }
        if (clazz.equals(String.class) && xc.mediumtext()) {
            return getTypeName(Types.CLOB);
        }
        return getDbType(clazz, xc.length(), xc.precision(), xc.scale());
    }

    /**
     * 获取数据库列名类型
     *
     * @param clazz     类对象
     * @param length    长度
     * @param precision 精度
     * @param scale     小数位数
     * @return 数据库列名类型
     * @throws SQLException SQL异常
     */
    public String getDbType(Class clazz, long length, int precision, int scale) throws SQLException {
        if (clazz.equals(Byte[].class)) {
            return getTypeName(Types.BLOB);
        }
        if (clazz.equals(Clob.class)) {
            return getTypeName(Types.CLOB);
        }
        if (clazz.equals(Blob.class)) {
            return getTypeName(Types.CLOB);
        }
        if (clazz.equals(Date.class)) {
            return getTypeName(Types.TIMESTAMP);
        }
        if (clazz.equals(Integer.class) || clazz.equals(int.class)) {
            return getTypeName(Types.INTEGER);
        }
        if (clazz.equals(Float.class) || clazz.equals(float.class)) {
            return getTypeName(Types.FLOAT);
        }
        if (clazz.equals(Long.class) || clazz.equals(long.class)) {
            return getTypeName(Types.BIGINT);
        }
        if (clazz.equals(Double.class) || clazz.equals(double.class)) {
            return getTypeName(Types.DOUBLE);
        }
        if (clazz.equals(Boolean.class) || clazz.equals(boolean.class)) {
            return getTypeName(Types.BIT);
        }
        return getTypeName(Types.VARCHAR, length, precision, scale);
    }


    /**
     * Characters used as opening for quoting SQL identifiers
     */
    public static final String QUOTE = "`\"[";

    /**
     * Characters used as closing for quoting SQL identifiers
     */
    public static final String CLOSED_QUOTE = "`\"]";

    /**
     * 获取数据库类型名称
     *
     * @param code 数据库类型编码
     * @return 数据库类型名称
     * @throws SQLException SQL异常
     */
    public String getTypeName(int code) throws SQLException {
        final String result = typeNames.get(code);
        if (result == null) {
            throw new SQLException("No default type mapping for (java.sql.Types) " + code);
        }
        return result;
    }

    /**
     * 获取数据库类型名称
     *
     * @param code      数据库类型编码
     * @param length    长度
     * @param precision 精度
     * @param scale     小数位数
     * @return 数据库类型名称
     * @throws SQLException SQL异常
     */
    public String getTypeName(int code, long length, int precision, int scale) throws SQLException {
        final String result = typeNames.get(code, length, precision, scale);
        if (result == null) {
            throw new SQLException(
                    String.format("No type mapping for java.sql.Types code: %s, length: %s", code, length)
            );
        }
        return result;
    }

    private final TypeNames typeNames = new TypeNames();

    /**
     * 注册数据库类型映射
     *
     * @param code     数据库类型编码
     * @param capacity 容量
     * @param name     类型名称
     */
    protected void registerColumnType(int code, long capacity, String name) {
        typeNames.put(code, capacity, name);
    }

    /**
     * 注册数据库类型映射
     *
     * @param code 数据库类型编码
     * @param name 类型名称
     */
    protected void registerColumnType(int code, String name) {
        typeNames.put(code, name);
    }

    /**
     * 获取数据库标识符开头的字符
     *
     * @return 数据库标识符开头的字符
     */
    public char openQuote() {
        return '"';
    }

    /**
     * 获取数据库标识符结尾的字符
     *
     * @return 数据库标识符结尾的字符
     */
    public char closeQuote() {
        return '"';
    }

    /**
     * 对数据库标识符进行转义
     *
     * @param name 数据库标识符
     * @return 转义后的数据库标识符
     */
    public final String quote(String name) {
        if (name == null) {
            return null;
        }

        if (name.charAt(0) == '`') {
            return openQuote() + name.substring(1, name.length() - 1) + closeQuote();
        } else {
            return name;
        }
    }

    /**
     * 获取带引号的数据库标识符
     *
     * @param name 数据库标识符
     * @return 带引号的数据库标识符
     */
    public String getQuote(String name) {
        return openQuote() + name + closeQuote();
    }
}
