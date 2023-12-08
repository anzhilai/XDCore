package com.anzhilai.core.database;

import com.alibaba.fastjson.JSON;
import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.MapHandler;
import org.apache.log4j.Logger;

import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.*;

public class SqlExe {
    private static Logger log = Logger.getLogger(SqlExe.class);

    public static Object ObjectSql(SqlInfo su) throws SQLException {
        Map<String, Object> m = MapSql(su);
        if (m.keySet().size() > 0) {
            return m.get(m.keySet().toArray()[0]);
        }
        return null;
    }

    // 用于统计行数的sql
    public static long LongSql(SqlInfo su) throws SQLException {
        return TypeConvert.ToLong(ObjectSql(su));
    }

    public static double DoubleSql(SqlInfo su) throws SQLException {
        return TypeConvert.ToDouble(ObjectSql(su));
    }

    public static DataTable ListSql(SqlInfo su, BaseQuery pageInfo) throws SQLException {
        return CheckTableAndRun(su, () -> _ListSql(su, pageInfo));
    }

    private static DataTable _ListSql(SqlInfo su, BaseQuery pageInfo) throws SQLException {
        final ArrayList<DataTable> retList = new ArrayList<>();
        DBSession.getSession().doWork(db -> {
            String _sql = su.ToSql();
            boolean hasPage = false;
            if (pageInfo != null) {
                if (pageInfo.PageSize > 0 && pageInfo.PageIndex >= 0 && !StrUtil.isEmpty(pageInfo.totalSql)) {
                    hasPage = true;
                    SqlInfo sutotal = new SqlInfo().Append(pageInfo.totalSql).AddParams(Arrays.asList(su.GetParams()));
                    pageInfo.Total = LongSql(sutotal);
                }
                if (pageInfo.UseOrderBy && !StrUtil.isEmpty(pageInfo.OrderBy) && !_sql.toUpperCase().contains(" ORDER BY ")) {
                    _sql += " ORDER BY " + pageInfo.OrderBy;
                }
                if (pageInfo.PageSize > 0 && pageInfo.PageIndex >= 0 && !_sql.toUpperCase().contains(" LIMIT ")) {
                    //_sql += " LIMIT " + pageInfo.PageSize + " OFFSET " + pageInfo.PageIndex;
                    _sql = db.GetLimitString(pageInfo, _sql);
                }
            }
            Map<String, Object> totalResult = null;
            if (pageInfo != null && pageInfo.totalMode != null) {
                totalResult = new HashMap<>();
                for (String f : pageInfo.totalMode.keySet()) {
                    String mode = TypeConvert.ToString(pageInfo.totalMode.get(f));
                    if (mode.equals(BaseQuery.E_StatType.count.name())) {
                        totalResult.put(f, LongSql(su.ToCountTotal(f)));
                    } else if (mode.equals(BaseQuery.E_StatType.sum.name())) {
                        totalResult.put(f, DoubleSql(su.ToSumTotal(f)));
                    } else if (mode.equals(BaseQuery.E_StatType.avg.name())) {
                        totalResult.put(f, DoubleSql(su.ToAvgTotal(f)));
                    } else if (mode.equals(BaseQuery.E_StatType.min.name())) {
                        totalResult.put(f, DoubleSql(su.ToMinTotal(f)));
                    } else if (mode.equals(BaseQuery.E_StatType.max.name())) {
                        totalResult.put(f, DoubleSql(su.ToMaxTotal(f)));
                    }
                }
            }
            QueryRunner qr = new QueryRunner();
            SqlListHandler handler = new SqlListHandler();
            List<Map<String, Object>> lm;
            if (su.isOutLog) {
                log.info(_sql);
                log.info(JSON.toJSONString(su.GetParams()));
            }
            lm = qr.query(db.getConnection(), _sql, handler, db.handleSqlParams(su.GetParams()));
            DataTable dt = new DataTable(db.handleSqlListResult(lm), handler.DataSchema);
            dt.DbDataSchema = handler.DbDataSchema;

            for (String dc : handler.DataColumns) {
                Map mf = DataTable.CreateColumnMap(dc, handler.DataSchema.get(dc), false);

                dt.DataColumns.add(mf);
            }
            if (pageInfo != null) {
                if (hasPage) {
                    dt.Total = pageInfo.Total;
                } else {
                    dt.Total = (long) dt.Data.size();
                }
            }
            dt.TotalResult = totalResult;
            db.handleDataTable(dt);
            retList.add(dt);
        });
        if (GlobalValues.baseAppliction != null) {
            GlobalValues.baseAppliction.ExecuteSqlInfo(false, su);
        }
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return new DataTable();
    }


    public static <T extends BaseModel> T InfoSql(Class<T> clazz, SqlInfo su) throws SQLException {
        su.TableList.add(BaseModel.GetTableName(clazz));
        return CheckTableAndRun(su, () -> _InfoSql(clazz, su));
    }

    public static <T extends BaseModel> T _InfoSql(Class<T> clazz, SqlInfo su) throws SQLException {
        final ArrayList<T> retList = new ArrayList<T>();
        DBSession.getSession().doWork(db -> {
            QueryRunner qr = new QueryRunner();
            MapHandler map = new MapHandler();
            Map<String, Object> lm;
            lm = qr.query(db.getConnection(), su.ToSql(), map, db.handleSqlParams(su.GetParams()));
            if (lm != null) {
                T bm = null;
                try {
                    bm =TypeConvert.CreateNewInstance(clazz);
                    bm.SetValuesByMap(db.handleSqlMapResult(lm));
                    retList.add(bm);
                } catch (InstantiationException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException | NoSuchMethodException | InvocationTargetException e) {
                    e.printStackTrace();
                }
            }
        });
        T bm = null;
        if (retList.size() > 0) bm = retList.get(0);
        if (GlobalValues.baseAppliction != null) {
            GlobalValues.baseAppliction.ExecuteSqlInfo(false, su);
        }
        return bm;
    }

    public static Map<String, Object> MapSql(SqlInfo su) throws SQLException {
        return CheckTableAndRun(su, () -> _MapSql(su));
    }

    // 执行一段SQL, 返回一个Map
    public static Map<String, Object> _MapSql(SqlInfo su) throws SQLException {
        final ArrayList<Map<String, Object>> retList = new ArrayList<>();
        DBSession.getSession().doWork(db -> {
            QueryRunner qr = new QueryRunner();
            MapHandler map = new MapHandler();
            Map<String, Object> lm;
            String sql = su.ToSql();
            if (su.isOutLog) {
                log.info(sql);
                log.info(JSON.toJSONString(su.GetParams()));
            }
            lm = qr.query(db.getConnection(), sql, map, db.handleSqlParams(su.GetParams()));
            if (lm == null) lm = new HashMap<>();
            retList.add(db.handleSqlMapResult(lm));
        });
        if (GlobalValues.baseAppliction != null) {
            GlobalValues.baseAppliction.ExecuteSqlInfo(false, su);
        }
        return retList.get(0);
    }

    public static int ExecuteSql(SqlInfo su) throws SQLException {
        int ret = CheckTableAndRun(su, () -> _ExecuteSql(su));
        try {
            if (GlobalValues.baseAppliction != null) {
                GlobalValues.baseAppliction.ExecuteSqlInfo(true, su);
                GlobalValues.baseAppliction.ResetCache(su);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }

    // 执行一段SQL, 返回受到影响的行数
    public static int _ExecuteSql(SqlInfo su) throws SQLException {
        final ArrayList<Integer> retList = new ArrayList<>();
        DBSession.getSession().doWork(db -> {
            String sql = su.ToSql();
            if (su.isOutLog) {
                log.info(sql);
                log.info(JSON.toJSONString(su.GetParams()));
            }
            retList.add(new QueryRunner().update(db.getConnection(), sql, db.handleSqlParams(su.GetParams())));
        });
        if (retList.size() > 0) {
            return retList.get(0);
        }
        return 0;
    }

    public static int SaveData(String table, Map<String, Object> params, String[] primaryKey, boolean isInsert) throws SQLException {
        return SaveData(table, params, primaryKey == null ? null : Arrays.asList(primaryKey), isInsert);
    }

    public static int SaveData(String table, Map<String, Object> params, List<String> primaryKey, boolean isInsert) throws SQLException {
        DBBase db = DBSession.getSession().GetCurrentDB();
        int ret = 0;
        table = db.getQuote(table);
        SqlInfo insertSql = new SqlInfo();
        SqlInfo updateSql = new SqlInfo();
        insertSql.CreateInsertInto(table);
        updateSql.CreateUpdate(table);
        for (String col : params.keySet()) {
            Object value = params.get(col);
            col = db.getQuote(col);
            insertSql.Values(col);
            insertSql.AddParam(value);
            if (primaryKey != null && !primaryKey.contains(col)) {//主键则不更新
                updateSql.SetEqual(col);
                updateSql.AddParam(value);
            }
        }
        for (String col : primaryKey) {
            Object value = params.get(col);
            col = db.getQuote(col);
            updateSql.AndEqual(table, col);
            updateSql.AddParam(value);
        }
        boolean insertData = isInsert;
        if (!insertData) {
            if (primaryKey == null || primaryKey.size() == 0) {//直接插入数据
                insertData = true;
            } else {
                ret = ExecuteSql(updateSql);
                insertData = ret == 0;
            }
        }
        if (insertData) {
            ret = ExecuteSql(insertSql);
        }
        return ret;
    }

    //批量插入
    public static int InsertDatas(String table, List<Map<String, Object>> paramList, List<String> keys) throws SQLException {
        DBBase db = DBSession.getSession().GetCurrentDB();
        int ret = 0;
        if (paramList.size() > 0) {
            table = db.getQuote(table);
            SqlInfo insertSql = new SqlInfo();
            insertSql.CreateInsertInto(table);
            for (String col : keys) {
                col = db.getQuote(col);
                insertSql.Values(col);
            }
            for (int i = 0, size = paramList.size(); i < size; i++) {
                Map<String, Object> row = paramList.get(i);
                for (String col : keys) {
                    insertSql.AddParam(row.get(col));
                }
                if (i != size - 1) {//不是最后一个
                    insertSql.NewInsert();
                }
            }
            ret = ExecuteSql(insertSql);
        }
        return ret;
    }

    public static int DeleteData(String table, Map<String, Object> whereMap) throws SQLException {
        DBBase db = DBSession.getSession().GetCurrentDB();
        table = db.getQuote(table);
        SqlInfo deleteSql = new SqlInfo();
        deleteSql.CreateDelete(table);
        if (whereMap != null) {
            for (String col : whereMap.keySet()) {
                Object value = whereMap.get(col);
                col = db.getQuote(col);
                deleteSql.AndEqual(table, col);
                deleteSql.AddParam(value);
            }
        }
        return ExecuteSql(deleteSql);
    }


    public interface Runnable {
        Object run() throws SQLException;
    }

    public static <T extends Object> T CheckTableAndRun(SqlInfo su, Runnable run) throws SQLException {
        try {
            return (T) run.run();
        } catch (Exception e) {
            if (CheckSqlException(e)) {
                for (String table : su.TableList) {
                    Class<BaseModel> _class = SqlCache.GetClassByTableName(table);
                    if (_class != null) {
                        DBSession.getSession().GetCurrentDB().CheckTable(_class);
                    }
                }
            }
            return (T) run.run();
        }
    }

    public static boolean CheckSqlException(Exception e) {
        boolean ret = false;
        String message = TypeConvert.ToString(e.getMessage()).trim();
        if (message.toLowerCase().contains("error executing work")) {
            if (e.getCause() != null) {
                message = TypeConvert.ToString(e.getCause().getMessage()).trim();
            }
        }
        if (message.toLowerCase().contains("invalid column")
                || message.toLowerCase().contains("no such column")
                || message.toLowerCase().contains("unknown column")
                || message.toLowerCase().contains("doesn't exist")
                || message.toLowerCase().contains("does not exist")
                || message.toLowerCase().contains("no such table")) {
            ret = true;
        }
        return ret;
    }

}
