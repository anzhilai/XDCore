package com.anzhilai.core.database;

import com.anzhilai.core.base.*;
import com.anzhilai.core.database.mysql.SqlListHandler;
import com.anzhilai.core.database.mysql.TypeNames;
import com.anzhilai.core.database.questdb.QuestdbBaseModel;
import com.anzhilai.core.toolkit.ScanUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.commons.dbutils.QueryRunner;

import java.lang.reflect.Field;
import java.sql.*;
import java.util.Date;
import java.util.*;

/*
 *使用其他连接
 */
public abstract class DBBase {

    public DBBase() {
        RegisterTypes();
    }

    public DBBase(Connection conn) {
        RegisterTypes();
        this.connection = conn;
    }
    public boolean createIdIndex = true;
    public boolean hasDefaultValue = true;
    public boolean hasIndex = true;
    public boolean hasPrimaryKey = true;

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

    public void close() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
            } catch (SQLException e) {
                e.printStackTrace();
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

    public void handleDataTable(DataTable dataTable) {
    }

    int ExeSql(String sql, Object... params) throws SQLException {
        final ArrayList<Integer> retList = new ArrayList<>();
        retList.add(new QueryRunner().update(getConnection(), sql, params));
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return 0;
    }

    DataTable ListSql(String sql, Object... params) throws SQLException {
        final ArrayList<DataTable> retList = new ArrayList<>();
        QueryRunner qr = new QueryRunner();
        SqlListHandler list = new SqlListHandler();
        List<Map<String, Object>> lm;
        lm = qr.query(getConnection(), sql, list, params);
        DataTable dt = new DataTable(lm, list.DataSchema);
        this.handleDataTable(dt);
        retList.add(dt);
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return null;
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

    public void CreateTable(String tableName, String id, boolean isPrimaryKey) throws Exception {
        String sql = "";
        sql += "CREATE TABLE IF NOT EXISTS " + this.getQuote(tableName) + " (";
        sql += getQuote(id) + " " + getTypeName(Types.VARCHAR, 255, 0, 0) + (isPrimaryKey ? " NOT NULL,PRIMARY KEY (" + id + ")" : " NULL");
        sql += ")";
        ExeSql(sql);
    }

    public void DropTable(String tableName) throws Exception {
        String sql = "DROP TABLE " + getQuote(tableName);
        ExeSql(sql);
    }

    public void RenameTable(String oldTableName, String newTableName) throws Exception {
        String sql = "ALTER TABLE " + getQuote(oldTableName) + " RENAME TO " + getQuote(newTableName);
        ExeSql(sql);
    }

    public void RenameTableColumn(String tableName, String oldColumnName, String newColumnName, TableColType colType, long length, int precision, int scale) throws Exception {
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

    public void AddTableColumn(String tableName, String colName, TableColType colType, long length, int precision, int scale, String comment, boolean hasNull) throws Exception {

        String sql = "ALTER TABLE " + getQuote(tableName) + " ADD " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + getColumnComment(comment);
        ExeSql(sql);
    }

    public void AddTableColumn(String tableName, String colName, Class colType, long length, int precision, int scale, String comment, boolean hasNull) throws Exception {

        String sql = "ALTER TABLE " + getQuote(tableName) + " ADD " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + getColumnComment(comment);
        ExeSql(sql);
    }

    public void ModifyTableColumn(String tableName, String colName, TableColType colType, long length, int precision, int scale, String comment, boolean hasNull) throws Exception {

        String sql = "ALTER TABLE " + getQuote(tableName) + " MODIFY " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + getColumnComment(comment);
        ExeSql(sql);
    }

    public void ModifyTableColumn(String tableName, String colName, Class colType, long length, int precision, int scale, String comment, boolean hasNull) throws Exception {
        String sql = "ALTER TABLE " + getQuote(tableName) + " MODIFY " + getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + getColumnComment(comment);
        ExeSql(sql);
    }

    public String getColumnComment(String comment){
        return "";
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

    public void AlterTableColumn(Class clazz, String tableName, String columnName) throws Exception {
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



    //扫描包名
    public void ScanPackagesCheckTable(String... basePackages) throws Exception {
        if (basePackages != null) {
            for (String basePackage : basePackages) {
                Set<Class<?>> classes = ScanUtil.getClasses(basePackage);
                for (Class<?> aClass : classes) {
                    if (QuestdbBaseModel.class.isAssignableFrom(aClass)) {
                        CheckTable((Class<BaseModel>) aClass);
                    }
                }
            }
        }
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

        String limitSql =sql;
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



    public void RegisterTypes(){
        registerColumnType( Types.BIT, "bit" );
        registerColumnType( Types.BOOLEAN, "boolean" );
        registerColumnType( Types.TINYINT, "tinyint" );
        registerColumnType( Types.SMALLINT, "smallint" );
        registerColumnType( Types.INTEGER, "integer" );
        registerColumnType( Types.BIGINT, "bigint" );
        registerColumnType( Types.FLOAT, "float($p)" );
        registerColumnType( Types.DOUBLE, "double precision" );
        registerColumnType( Types.NUMERIC, "numeric($p,$s)" );
        registerColumnType( Types.REAL, "real" );

        registerColumnType( Types.DATE, "date" );
        registerColumnType( Types.TIME, "time" );
        registerColumnType( Types.TIMESTAMP, "timestamp" );

        registerColumnType( Types.VARBINARY, "bit varying($l)" );
        registerColumnType( Types.LONGVARBINARY, "bit varying($l)" );
        registerColumnType( Types.BLOB, "blob" );

        registerColumnType( Types.CHAR, "char($l)" );
        registerColumnType( Types.VARCHAR, "varchar($l)" );
        registerColumnType( Types.LONGVARCHAR, "varchar($l)" );
        registerColumnType( Types.CLOB, "clob" );

        registerColumnType( Types.NCHAR, "nchar($l)" );
        registerColumnType( Types.NVARCHAR, "nvarchar($l)" );
        registerColumnType( Types.LONGNVARCHAR, "nvarchar($l)" );
        registerColumnType( Types.NCLOB, "nclob" );
    }


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

    public String getDbType(TableColType type, long length, int precision, int scale) throws SQLException {
        if (type.equals(TableColType.大字段)) {
            return getTypeName(Types.BLOB);
        }
        if (type.equals(TableColType.文本大字段)) {
            return getTypeName(Types.CLOB);
        }
        if (type.equals(TableColType.日期)) {
            return getTypeName(Types.TIMESTAMP);
        }
        if (type.equals(TableColType.整数)) {
            return getTypeName(Types.INTEGER);
        }
        if (type.equals(TableColType.浮点数)) {
            return getTypeName(Types.DOUBLE);
        }
        if (type.equals(TableColType.布尔值)) {
            return getTypeName(Types.BIT);
        }
        if (type.equals(TableColType.文本)) {
            return getTypeName(Types.VARCHAR, length, precision, scale);
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
     * Get the name of the database type associated with the given
     * {@link java.sql.Types} typecode.
     *
     * @param code The {@link java.sql.Types} typecode
     * @return the database type name
     * @throws SQLException If no mapping was specified for that type.
     */
    public String getTypeName(int code) throws SQLException {
        final String result = typeNames.get( code );
        if ( result == null ) {
            throw new SQLException( "No default type mapping for (java.sql.Types) " + code );
        }
        return result;
    }

    /**
     * Get the name of the database type associated with the given
     * {@link java.sql.Types} typecode with the given storage specification
     * parameters.
     *
     * @param code The {@link java.sql.Types} typecode
     * @param length The datatype length
     * @param precision The datatype precision
     * @param scale The datatype scale
     * @return the database type name
     * @throws SQLException If no mapping was specified for that type.
     */
    public String getTypeName(int code, long length, int precision, int scale) throws SQLException {
        final String result = typeNames.get( code, length, precision, scale );
        if ( result == null ) {
            throw new SQLException(
                    String.format( "No type mapping for java.sql.Types code: %s, length: %s", code, length )
            );
        }
        return result;
    }

    private final TypeNames typeNames = new TypeNames();
    /**
     * Subclasses register a type name for the given type code and maximum
     * column length. <tt>$l</tt> in the type name with be replaced by the
     * column length (if appropriate).
     *
     * @param code The {@link java.sql.Types} typecode
     * @param capacity The maximum length of database type
     * @param name The database type name
     */
    protected void registerColumnType(int code, long capacity, String name) {
        typeNames.put( code, capacity, name );
    }

    /**
     * Subclasses register a type name for the given type code. <tt>$l</tt> in
     * the type name with be replaced by the column length (if appropriate).
     *
     * @param code The {@link java.sql.Types} typecode
     * @param name The database type name
     */
    protected void registerColumnType(int code, String name) {
        typeNames.put( code, name );
    }

    // identifier quoting support ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * The character specific to this dialect used to begin a quoted identifier.
     *
     * @return The dialect's specific open quote character.
     */
    public char openQuote() {
        return '"';
    }

    /**
     * The character specific to this dialect used to close a quoted identifier.
     *
     * @return The dialect's specific close quote character.
     */
    public char closeQuote() {
        return '"';
    }

    /**
     * Apply dialect-specific quoting.
     * <p/>
     * By default, the incoming value is checked to see if its first character
     * is the back-tick (`).  If so, the dialect specific quoting is applied.
     *
     * @param name The value to be quoted.
     * @return The quoted (or unmodified, if not starting with back-tick) value.
     * @see #openQuote()
     * @see #closeQuote()
     */
    public final String quote(String name) {
        if ( name == null ) {
            return null;
        }

        if ( name.charAt( 0 ) == '`' ) {
            return openQuote() + name.substring( 1, name.length() - 1 ) + closeQuote();
        }
        else {
            return name;
        }
    }

    // 获取一个引用
    public String getQuote(String name) {
        return openQuote() + name + closeQuote();
    }
}
