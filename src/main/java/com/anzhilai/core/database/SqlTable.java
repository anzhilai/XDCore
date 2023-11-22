package com.anzhilai.core.database;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.XColumn;
import com.anzhilai.core.base.XIndex;
import com.anzhilai.core.base.XTable;
import com.anzhilai.core.framework.SystemSessionManager;
import com.anzhilai.core.framework.SystemSpringConfig;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.log4j.Logger;
import org.hibernate.dialect.Dialect;

import javax.persistence.Table;
import java.lang.reflect.Field;
import java.sql.*;
import java.util.*;
import java.util.Date;

public class SqlTable {
    private static Logger log = Logger.getLogger(SqlTable.class);

    private static int ExeSql(String sql, Object... params) throws SQLException {
        final ArrayList<Integer> retList = new ArrayList<>();
        log.info(sql);
        SystemSessionManager.getSession().doWork(true, conn -> {
            retList.add(new QueryRunner().update(conn, sql, params));
        });
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return 0;
    }

    private static DataTable ListSql(String sql, Object... params) throws SQLException {
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

    public static Dialect defalutDialect = null;

    static {
        try {
            defalutDialect = SystemSpringConfig.getBean(Dialect.class);
        } catch (Exception e) {
        }
    }

    public static Dialect GetDialect() {
        Dialect dialect = defalutDialect;
        BaseDataSource dataSource = SystemSessionManager.getThreadDataSource();
        if (dataSource != null && dataSource.dialect != null) {
            dialect = dataSource.dialect;
        }
        return dialect;
    }


    // 获取一个引用
    public static String getQuote(String name) {
        Dialect dialect = GetDialect();
        return dialect.openQuote() + name + dialect.closeQuote();
    }

    public static String getDbType(Class clazz, XColumn xc) {
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

    public static String getDbType(Class clazz, long length, int precision, int scale) {
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

    public static String getDbType(TableColType type, long length, int precision, int scale) {
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

    public static <T extends BaseModel> void CheckTable(Class<T> clazz) {
        if (!clazz.isAnnotationPresent(XTable.class) && !clazz.isAnnotationPresent(Table.class)) {
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
            BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
            if (BaseDataSource.CheckSqlException(e) || (baseDataSource != null && baseDataSource.CheckException(e))) {
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

    public static List<Class> GetSuperclass(Class clazz, List<Class> list) {
        if (clazz != null && clazz != Object.class) {
            GetSuperclass(clazz.getSuperclass(), list);
            list.add(clazz);
        }
        return list;
    }

    //mysql表名
    public static DataTable GetTables() throws SQLException {
        BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
        if (baseDataSource != null) {
            return baseDataSource.GetTables();
        }
        String sql = "show tables";
        DataTable dt = ListSql(sql);
        for (Map<String, Object> row : dt.Data) {
            String 表名 = TypeConvert.ToString(row.get(row.keySet().toArray()[0]));
            row.put("表名", 表名);
            row.put(BaseModel.F_id, 表名);
        }
        return dt;
    }

    public static void CreateTable(String tableName, String id, boolean isPrimaryKey) throws SQLException {
        Dialect dialect = SqlTable.GetDialect();
        String sql = "";
        sql += "CREATE TABLE IF NOT EXISTS " + SqlTable.getQuote(tableName) + " (";
        sql += SqlTable.getQuote(id) + " " + dialect.getTypeName(Types.VARCHAR, 255, 0, 0) + (isPrimaryKey ? " NOT NULL,PRIMARY KEY (" + id + ")" : " NULL");
        sql += ")";
        ExeSql(sql);
    }

    public static void DropTable(String tableName) throws SQLException {
        String sql = "DROP TABLE " + SqlTable.getQuote(tableName);
        ExeSql(sql);
    }

    public static void RenameTable(String oldTableName, String newTableName) throws SQLException {
        String sql = "ALTER TABLE " + SqlTable.getQuote(oldTableName) + " RENAME TO " + SqlTable.getQuote(newTableName);
        ExeSql(sql);
    }

    public static void RenameTableColumn(String tableName, String oldColumnName, String newColumnName, TableColType colType, long length, int precision, int scale) throws SQLException {
//        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " RENAME COLUMN " + SqlTable.getQuote(oldColumnName) + " TO " + SqlTable.getQuote(newColumnName);
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " CHANGE COLUMN " + SqlTable.getQuote(oldColumnName) + " " + SqlTable.getQuote(newColumnName) + " " + getDbType(colType, length, precision, scale);
        ExeSql(sql);
    }

    public static void CreateTablePrimaryKey(String tableName, String primaryKeyName, List<String> cols) throws SQLException {
        String primaryKey = "";
        for (String col : cols) {
            primaryKey += "," + SqlTable.getQuote(col);
        }
        primaryKey = StrUtil.CutStart(primaryKey, ",");
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " ADD CONSTRAINT " + SqlTable.getQuote(primaryKeyName) + " PRIMARY KEY (" + primaryKey + ")";
        ExeSql(sql);
    }

    public static void DropTablePrimaryKey(String tableName) throws SQLException {
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " DROP PRIMARY KEY";
        ExeSql(sql);
    }

    public static void CreateTableUniqueIndex(String tableName, String indexName, String columnName) throws SQLException {
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " ADD UNIQUE INDEX " + SqlTable.getQuote(indexName) + "(" + SqlTable.getQuote(columnName) + ")";
        ExeSql(sql);
    }

    public static void DropTableUniqueIndex(String tableName, String indexName) throws SQLException {
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " DROP INDEX " + SqlTable.getQuote(indexName);
        ExeSql(sql);
    }

    public static enum TableColType {
        文本, 日期, 整数, 浮点数, 大字段, 文本大字段, 布尔值
    }

    public static void AddTableColumn(String tableName, String colName, TableColType colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = SqlTable.GetDialect();
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " ADD " + SqlTable.getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public static void AddTableColumn(String tableName, String colName, Class colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = SqlTable.GetDialect();
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " ADD " + SqlTable.getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public static void ModifyTableColumn(String tableName, String colName, TableColType colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = SqlTable.GetDialect();
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " MODIFY " + SqlTable.getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public static void ModifyTableColumn(String tableName, String colName, Class colType, long length, int precision, int scale, String comment, boolean hasNull) throws SQLException {
        Dialect dialect = SqlTable.GetDialect();
        String sql = "ALTER TABLE " + SqlTable.getQuote(tableName) + " MODIFY " + SqlTable.getQuote(colName) + " " + getDbType(colType, length, precision, scale) + " " + (hasNull ? "DEFAULT NULL" : "NOT NULL") + " " + dialect.getColumnComment(comment);
        ExeSql(sql);
    }

    public static void DropColumn(String table, String col) throws SQLException {
        String sql = "ALTER TABLE " + SqlTable.getQuote(table) + " DROP COLUMN " + SqlTable.getQuote(col);// 删除列
        ExeSql(sql);
    }

    public static void CreateTable(Class clazz, String tableName) throws SQLException {
        boolean hasDefaultValue = true;
        boolean hasIndex = true;
        boolean hasPrimaryKey = true;
        BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
        if (baseDataSource != null) {
            hasDefaultValue = baseDataSource.hasDefaultValue;
            hasIndex = baseDataSource.hasIndex;
            hasPrimaryKey = baseDataSource.hasPrimaryKey;
        }
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
            boolean createIdIndex = true;
            if (baseDataSource != null) {
                createIdIndex = baseDataSource.createIdIndex;
            }
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
        if (baseDataSource != null) {
            sql = baseDataSource.CreateTableBefore(sql, clazz, tableName);
        }
        ExeSql(sql.toString());
    }

    public static void AlterTableColumn(Class clazz, String tableName, String columnName) throws SQLException {
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

    public static void AlterTable(Class clazz, String tableName, DataTable dt) throws SQLException {
        BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
        boolean hasIndex = true;
        String sqlindex = "show index from " + tableName;
        if (baseDataSource != null) {
            hasIndex = baseDataSource.hasIndex;
            sqlindex = baseDataSource.GetTableIndex(tableName);
            if (baseDataSource.AlterTable(clazz, tableName, dt)) {
                return;
            }
        }
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
                if (baseDataSource != null) {
                    String indexName = baseDataSource.GetTableIndexName(tableName, icolumns);
                    if (StrUtil.isNotEmpty(indexName)) {
                        ikey = indexName;
                    }
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


}
