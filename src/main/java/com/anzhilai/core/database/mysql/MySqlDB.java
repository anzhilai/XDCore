package com.anzhilai.core.database.mysql;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.database.DBBase;
import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.database.SqlExe;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.TypeConvert;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Map;

public class MySqlDB extends DBBase {



    public MySqlDB(Connection conn){
        super(conn);
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
    public void closeDataSource() {
        super.closeDataSource();
        if (connection != null) {
            try {
                connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public DataTable GetTables() throws SQLException {
        String sql = "show tables";
        DataTable dt = SqlExe.ListSql(new SqlInfo().Append(sql),null);
        for (Map<String, Object> row : dt.Data) {
            String 表名 = TypeConvert.ToString(row.get(row.keySet().toArray()[0]));
            row.put("表名", 表名);
            row.put(BaseModel.F_id, 表名);
        }
        return dt;
    }
}
