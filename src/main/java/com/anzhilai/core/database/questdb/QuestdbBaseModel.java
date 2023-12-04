package com.anzhilai.core.database.questdb;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;

import java.sql.SQLException;
import java.util.Date;

public class QuestdbBaseModel extends BaseModel {
    public String partitionColumn = F_CreateTime;//一定是时间类型
    public String partitionType = "MONTH";//分区类型 DAY MONTH YEAR

    public QuestdbBaseModel() {
//        Date date = AddHour(new Date());
//        CreateTime = date;
//        UpdateTime = date;
        CreateUser = "";
        UpdateUser = "";
    }

    public static Date AddHour(Date date) {
        if (date == null) {
            return null;
        }
        return DateUtil.AddHour(date, 8);//加上8小时
    }

    public void ToDate() {//转换时间
    }

    //删除数据，通过分区删除数据
    public static <T extends QuestdbBaseModel> void DeletePartition(Class<T> clazz, Date date) throws Exception {
        //http执行函数
        //http://localhost:9000/exec?query=select%20*%20from%20my_table_MONTH
        QuestdbBaseModel baseModel = TypeConvert.CreateNewInstance(clazz);
        if (StrUtil.isNotEmpty(baseModel.partitionColumn)) {
            String sql = "ALTER TABLE " + BaseModel.GetTableName(clazz) + " DROP PARTITION WHERE " + baseModel.partitionColumn + " < to_timestamp('" + DateUtil.GetDateString(date) + "', 'yyyy-MM-dd')";
            SqlInfo su = new SqlInfo();
            su.Append(sql);
            BaseQuery.ExecuteSql(su);
        }
    }

    public static <T extends BaseModel> T GetObjectById(Class<T> type, String id) throws SQLException {
        if (StrUtil.isEmpty(id)) {
            return null;
        } else {
            SqlInfo su = (new SqlInfo()).CreateSelectAll(GetTableName(type)).Where("id='" + id + "' limit 0,1");
            T bm = BaseQuery.InfoSql(type, su);
            return bm;
        }
    }
}
