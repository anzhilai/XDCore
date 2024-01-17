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
    }

    public String getSelectGUIDString() {
        return "select sys_guid_name()";
    }

    public void RegisterTypes() {
        super.RegisterTypes();
        this.registerColumnType(Types.BOOLEAN, "bool");
        this.registerColumnType(Types.BIT, "bit");
        this.registerColumnType(Types.CLOB, "clob");
        this.registerColumnType(Types.BLOB, "blob");
        this.registerColumnType(Types.BINARY, "bytea");
    }
}
