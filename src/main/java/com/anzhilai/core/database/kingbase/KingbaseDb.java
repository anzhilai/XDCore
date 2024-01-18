package com.anzhilai.core.database.kingbase;

import com.anzhilai.core.database.DBBase;

import javax.sql.DataSource;
import java.sql.Types;

public class KingbaseDb extends DBBase {
    public KingbaseDb() {
        this(null);
    }

    public KingbaseDb(DataSource dataSource) {
        super(dataSource);
        isCreateIdIndex = false;
        useDbType = false;
    }

    public String getSelectGUIDString() {
        return "select sys_guid_name()";
    }

    /**
     * 获取表索引SQL
     *
     * @param tableName 表名
     * @return 索引SQL
     */
    public String GetTableIndexSql(String tableName) {
        return "SELECT indexname AS Key_name FROM sys_indexes WHERE tablename = '" + tableName + "'";
    }

    public String GetTableIndexName(String tableName, String colName) {
        return tableName + "_" + colName + "_index";
    }

    public void RegisterTypes() {
        super.RegisterTypes();
        this.registerColumnType(Types.BOOLEAN, "bool");
        this.registerColumnType(Types.BIT, "bit");
        this.registerColumnType(Types.CLOB, "clob");
        this.registerColumnType(Types.BLOB, "blob");
        this.registerColumnType(Types.BINARY, "bytea");
        this.registerColumnType(Types.FLOAT, "float");
    }
}
