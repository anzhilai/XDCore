package com.anzhilai.core.database;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.toolkit.TypeConvert;
import org.hibernate.dialect.MySQL55Dialect;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Map;

public class MySQLDataSource extends BaseDataSource {

    //连接打开后一直不关闭
    private Connection conn;

    public MySQLDataSource(String... basePackages) {
        super(new MySQL55Dialect(), basePackages);
    }

    /**
     * 初始化单个连接
     */
    public MySQLDataSource init(String url, String username, String password) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return this;
    }

    @Override
    public Connection newConnection() throws SQLException {
        return conn;
    }

    @Override
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

    @Override
    public void closeDataSource() {
        super.closeDataSource();
        if (conn != null) {
            try {
                conn.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
