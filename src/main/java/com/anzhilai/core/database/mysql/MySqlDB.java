package com.anzhilai.core.database.mysql;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.database.DBBase;
import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.database.SqlExe;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.TypeConvert;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Map;

public class MySqlDB extends DBBase {

    public MySqlDB() {
    }

    public MySqlDB(DataSource dataSource) {
        super(dataSource);
    }

    /**
     * 初始化单个连接
     */
    public MySqlDB init(String url, String username, String password) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return this;
    }

    @Override
    public DataTable GetTables() throws SQLException {
        String sql = "show tables";
        DataTable dt = SqlExe.ListSql(new SqlInfo().Append(sql), null);
        for (Map<String, Object> row : dt.Data) {
            String 表名 = TypeConvert.ToString(row.get(row.keySet().toArray()[0]));
            row.put("表名", 表名);
            row.put(BaseModel.F_id, 表名);
        }
        return dt;
    }


    @Override
    public char closeQuote() {
        return '`';
    }

    @Override
    public char openQuote() {
        return '`';
    }


    public void RegisterTypes(){
        registerColumnType( Types.BIT, "bit" );
        registerColumnType( Types.BIGINT, "bigint" );
        registerColumnType( Types.SMALLINT, "smallint" );
        registerColumnType( Types.TINYINT, "tinyint" );
        registerColumnType( Types.INTEGER, "integer" );
        registerColumnType( Types.CHAR, "char(1)" );
        registerColumnType( Types.FLOAT, "float" );
        registerColumnType( Types.DOUBLE, "double precision" );
        registerColumnType( Types.BOOLEAN, "bit" ); // HHH-6935
        registerColumnType( Types.DATE, "date" );
        registerColumnType( Types.TIME, "time" );
        registerColumnType( Types.TIMESTAMP, "datetime" );
        registerColumnType( Types.VARBINARY, "longblob" );
        registerColumnType( Types.VARBINARY, 16777215, "mediumblob" );
        registerColumnType( Types.VARBINARY, 65535, "blob" );
        registerColumnType( Types.VARBINARY, 255, "tinyblob" );
        registerColumnType( Types.BINARY, "binary($l)" );
        registerColumnType( Types.LONGVARBINARY, "longblob" );
        registerColumnType( Types.LONGVARBINARY, 16777215, "mediumblob" );
        registerColumnType( Types.NUMERIC, "decimal($p,$s)" );
        registerColumnType( Types.BLOB, "longblob" );
//		registerColumnType( Types.BLOB, 16777215, "mediumblob" );
//		registerColumnType( Types.BLOB, 65535, "blob" );
        registerColumnType( Types.CLOB, "longtext" );
        registerColumnType( Types.NCLOB, "longtext" );
//		registerColumnType( Types.CLOB, 16777215, "mediumtext" );
//		registerColumnType( Types.CLOB, 65535, "text" );

        registerColumnType( Types.VARCHAR, "longtext" );
//		registerColumnType( Types.VARCHAR, 16777215, "mediumtext" );
//		registerColumnType( Types.VARCHAR, 65535, "text" );
        registerColumnType( Types.VARCHAR, 65535, "varchar($l)" );
        registerColumnType( Types.LONGVARCHAR, "longtext" );


    }
}
