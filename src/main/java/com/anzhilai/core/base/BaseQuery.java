package com.anzhilai.core.base;

import com.alibaba.fastjson.JSON;
import com.anzhilai.core.database.*;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.framework.SystemSessionManager;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.MapHandler;
import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.*;


public class BaseQuery {
    private static Logger log = Logger.getLogger(BaseQuery.class);

    public static final String F_PAGE_SIZE = "pageSize";
    public static final String F_PAGE_INDEX = "pageIndex";
    public static final String F_ORDER_BY = "orderBy";
    public static final String F_TotalMode = "totalMode";


    public BaseQuery() {
    }

    public BaseQuery(BaseModel bm) {
        this.model = bm;
        if (bm != null) {
            String orderfield = bm.GetOrderField();
//            if (StrUtil.isNotEmpty(orderfield)) {
//                this.OrderBy = SqlInfo.CreateOrderBy(BaseModel.GetTableName(bm.getClass()), orderfield, true);
//            }
        }
    }

    public boolean hasDataRight = true;
    public String UserID;
    public String UserTreePath;

    @XQuery(table = "BaseQuery", type = XQuery.QueryType.equal)
    public String id;

    public BaseQuery Setid(String v) {
        this.id = v;
        return this;
    }

    @XQuery(table = "BaseQuery", type = XQuery.QueryType.equal)
    public String Parentid;

    public BaseQuery SetParentid(String v) {
        this.Parentid = v;
        return this;
    }

    @XQuery(table = "BaseQuery", type = XQuery.QueryType.equal)
    public Integer IsTreeLeaf;

    public BaseQuery SetIsTreeLeaf(Integer v) {
        this.IsTreeLeaf = v;
        return this;
    }

    @XQuery(table = "BaseQuery", column = BaseModelTree.F_id, type = XQuery.QueryType.in)
    public String[] ids;

    public BaseQuery Setids(String[] v) {
        this.ids = v;
        return this;
    }

    @XQuery(table = "BaseQuery", column = BaseModelTree.F_Parentid, type = XQuery.QueryType.in)
    public String[] Parentids;

    public BaseQuery SetParentids(String[] v) {
        this.Parentids = v;
        return this;
    }

    @XQuery(table = "BaseQuery", column = BaseModelTree.F_TreeName, type = XQuery.QueryType.like)
    public String TreeName;

    public BaseQuery SetTreeName(String v) {
        this.TreeName = v;
        return this;
    }

    @XQuery(table = "BaseQuery", column = BaseModel.F_UpdateTime, type = XQuery.QueryType.greatEqual)
    public Date UpdateTimeStart;

    public BaseQuery SetUpdateTimeStart(Date v) {
        this.UpdateTimeStart = v;
        return this;
    }

    @XQuery(table = "BaseQuery", column = BaseModel.F_UpdateTime, type = XQuery.QueryType.lessEqual)
    public Date UpdateTimeEnd;

    public BaseQuery SetUpdateTimeEnd(Date v) {
        this.UpdateTimeEnd = v;
        return this;
    }

    @XQuery(type = XQuery.QueryType.none)
    public String[] KeywordFields;
    @XQuery(type = XQuery.QueryType.none)
    public String KeywordValue = "";

    public Boolean IsTree;
    public Boolean IsTreeAllData;
    public boolean IsSearch = false;
    public Boolean IsTable;

    public String CustomFilterCond;

    public Boolean IsDefaultAsc;
    public Long Total = 0L;//总行数
    public Long PageIndex = -1L;//当前行数
    public Long PageSize = -1L;// 10L;//每页行数
    public boolean UseOrderBy = true;
    public String OrderBy = "";//排序字段

    public transient HttpServletRequest request = null;//不反射这个字段

    public String selectSql;
    public String totalSql;//根据上面生成的SQL语句

    public Map<String, Object> totalMode;

    public enum StatTypeEnum {
        sum, count, avg, max, min
    }

    public String StatType;
    public String StatField;
    public String QueryField;
    public String[] GroupField;


    BaseModel model;

    public BaseModel getModel() {
        return model;
    }

    public boolean isTreeModal() {
        return model instanceof BaseModelTree;
    }


    List<SqlInfo> listCustomSqlCond = new ArrayList<>();

    public void ClearCustomSqlCond() {
        listCustomSqlCond.clear();
    }

    public void AddCustomSqlCond(SqlInfo su) {
        listCustomSqlCond.add(su);
    }

    public String toJson() {
        Field[] fields = this.getClass().getFields();
        Map<String, Object> m = new HashMap();
        try {
            for (Field f : fields) {
                m.put(f.getName(), f.get(this));
            }
        } catch (Exception ex) {

        }
        String json = TypeConvert.ToJson(m);
        return json;
    }


    public void CreateSql(SqlInfo su) throws Exception {
        BaseUser bu = GlobalValues.GetSessionUser();
        if (bu != null && this.hasDataRight) {
            bu.SetQueryListDataRight(this, su);
        }

        CreateQueryCond(su);

        for (SqlInfo sucond : listCustomSqlCond) {
            String where = sucond.ToWhere();
            if (StrUtil.isNotEmpty(where)) {
                su.And(where);
            }
            su.AddParams(sucond.GetParamsList());
        }

        if (StrUtil.isNotEmpty(this.KeywordValue)) {
            CreatKeyWordCond(su);
        }
        if (su.listQueryColumn.size() > 0) {
            CreatQueryColumnCond(su);
            CreateCustomFilterCond(su);
        }
        if (this.UseOrderBy && StrUtil.isEmpty(this.OrderBy) && su.sborderby.length() == 0) {
            if (model != null && StrUtil.isNotEmpty(model.GetOrderField())) {
                String maintable = BaseModel.GetTableName(model.getClass());
                this.OrderBy = SqlInfo.CreateOrderBy(maintable, model.GetOrderField(), model.IsDefaultAscOrder());
            } else {
                this.OrderBy = SqlInfo.CreateOrderBy(su.CurrentMainTable, BaseModel.F_CreateTime, false);
            }
        }
    }


    public DataTable GetList(SqlInfo su) throws Exception {
        this.CreateSql(su);
        this.totalSql = su.ToTotal();
        DataTable dt = ListSql(su, this);
        return ToTreeFirstLevel(dt);
    }

    public DataTable GetListNoPage(SqlInfo su) throws Exception {
        this.CreateSql(su);
        return ListSql(su, null);
    }

    public Object GetValue(SqlInfo su) throws Exception {
        this.CreateSql(su);
        return ObjectSql(su);
    }


    public void InitComplete() {

    }

    public DataTable ToTreeFirstLevel(DataTable dt) {
        if (this.IsTree != null) {
            if (this.IsTree && this.Parentids == null && !this.IsSearch && dt != null) {     // 对树的第一次查询，只返回根节点
                if (this.IsTreeAllData != null && this.IsTreeAllData) {

                } else {
                    dt.ToTreeFirstLevel();
                }
            }
        }
        return dt;
    }

    public DataTable FilterTable(DataTable dt) {
        if (this.IsTree == null) {
            this.IsTree = false;
        }
        DataTable result = new DataTable();
        if (this.IsTree) {
            if (this.Parentids == null && !this.IsSearch) {
                dt.ToTreeFirstLevel();
            }
        }
        for (Map m : dt.Data) {
            boolean has = CheckMap(m);
            if (has) {
                result.Data.add(m);
            }
        }
        result.DataColumns = dt.DataColumns;
        return result;
    }

    boolean CheckMap(Map m) {
        boolean has = true;
        if (this.Parentids != null && this.Parentids.length > 0) {
            has = false;
            for (String pid : this.Parentids) {
                if (pid.equals(m.get(BaseModelTree.F_Parentid)) || pid.equals(m.get(BaseModelTree.F_id))) {
                    has = true;
                    break;
                }
            }
        }
        if (this.KeywordFields != null && StrUtil.isNotEmpty(this.KeywordValue)) {
            has = false;
            for (String kfc : this.KeywordFields) {
                if (m.containsKey(kfc)) {
                    String v = TypeConvert.ToString(m.get(kfc));
                    if (v.contains(this.KeywordValue)) {
                        has = true;
                        break;
                    }
                }
            }
        }
        return has;
    }

    public BaseQuery NotPagination() {
        this.PageSize = -1L;
        this.PageIndex = -1L;
        return this;
    }

    public BaseQuery InitFromMap(Map params) throws IllegalAccessException {
        if (params == null) {
            return this;
        }
        Field[] fields = this.getClass().getFields();
        for (Field f : fields) {
            if (f.getType().equals(String[].class)) {
                String[] ss = StrUtil.split(TypeConvert.ToString(params.get(f.getName())));
                if (ss != null && ss.length > 0) {
                    if (ss.length == 1 && StrUtil.isEmpty(ss[0])) {
                        continue;
                    }
                    f.set(this, ss);
                }
            } else {
                Object o = params.get(f.getName());
                if (o != null && StrUtil.isNotEmpty(o) && !"undefined".equals(TypeConvert.ToString(o))) {
                    if (f.getType().equals(Date.class)) {
                        o = TypeConvert.ToDate(o);
                    } else {
                        o = TypeConvert.ToType(f.getType(), o);
                    }
                    f.set(this, o);
                }
            }
        }
        this.InitComplete();
        String pz = TypeConvert.ToString(params.get(F_PAGE_SIZE));
        if (StrUtil.isNotEmpty(pz)) {
            this.PageSize = TypeConvert.ToLong(pz);
        }
        String pi = TypeConvert.ToString(params.get(F_PAGE_INDEX));
        if (StrUtil.isNotEmpty(pi)) {
            this.PageIndex = TypeConvert.ToLong(pi);
        }
        String orderBy = TypeConvert.ToString(params.get(F_ORDER_BY));
        if (StrUtil.isNotEmpty(orderBy)) {
            this.OrderBy = orderBy;
        }
        String totalMode = TypeConvert.ToString(params.get(F_TotalMode));
        if (StrUtil.isNotEmpty(totalMode)) {
            this.totalMode = TypeConvert.FromMapJson(totalMode);
        }
        return this;
    }

    public BaseQuery InitFromRequest(HttpServletRequest _request) throws IllegalAccessException {
        if (_request == null) {
            return this;
        }
        request = _request;
        List<Field> fields = new ArrayList<>();
        for (Field f : this.getClass().getFields()) {
            fields.add(f);
        }
        for (Field f : this.getClass().getDeclaredFields()) {
            fields.add(f);
        }
        for (Field f : fields) {
            f.setAccessible(true);
            if (f.getType().equals(String[].class)) {
                String[] ss = RequestUtil.GetStringArray(request, f.getName());
                if (ss != null && ss.length > 0) {
                    if (ss.length == 1 && StrUtil.isEmpty(ss[0])) {
                        continue;
                    }
                    f.set(this, ss);
                }
            } else {
                Object o = RequestUtil.GetParameter(request, f.getName());
                if (o != null && StrUtil.isNotEmpty(o) && !"undefined".equals(TypeConvert.ToString(o))) {
                    if (f.getType().equals(Date.class)) {
                        o = TypeConvert.ToDate(o);
                    } else {
                        o = TypeConvert.ToType(f.getType(), o);
                    }
                    f.set(this, o);
                }
            }
        }
        this.InitComplete();
        String pz = RequestUtil.GetParameter(request, F_PAGE_SIZE);
        if (StrUtil.isNotEmpty(pz)) {
            this.PageSize = TypeConvert.ToLong(pz);
        }
        String pi = RequestUtil.GetParameter(request, F_PAGE_INDEX);
        if (StrUtil.isNotEmpty(pi)) {
            this.PageIndex = TypeConvert.ToLong(pi);
        }
        String orderBy = RequestUtil.GetParameter(request, F_ORDER_BY);
        if (StrUtil.isNotEmpty(orderBy)) {
            this.OrderBy = orderBy;
        }
        String totalMode = RequestUtil.GetString(request, F_TotalMode);
        if (StrUtil.isNotEmpty(totalMode)) {
            this.totalMode = TypeConvert.FromMapJson(totalMode);
        }
        return this;
    }


    public void CreatKeyWordCond(SqlInfo su) {
        if (this.KeywordFields != null && StrUtil.isNotEmpty(this.KeywordValue)) {
            String value = this.KeywordValue.trim();//or 处理
            Map<String, String> valueMap = null;//and 处理
            if (this.KeywordFields.length > 1) {
                String[] values = this.KeywordValue.split(" ");
                if (values.length > 1) {//存在多个参数
                    valueMap = new HashMap<>();
                    for (int i = 0; i < this.KeywordFields.length; i++) {
                        if (i < values.length && StrUtil.isNotEmpty(values[i])) {
                            valueMap.put(this.KeywordFields[i], values[i]);
                        }
                    }
                }
            }
            List<String> kfc = Arrays.asList(this.KeywordFields);
            SqlInfo suc = new SqlInfo();
            for (SqlInfo.QueryColumn qc : su.listQueryColumn) {
                if (kfc.contains(qc.column) && StrUtil.isNotEmpty(qc.column)) {
                    if (valueMap != null) {
                        if (valueMap.containsKey(qc.column)) {
                            suc.AndLike(qc.table, qc.column);
                            suc.AddParam("%%" + valueMap.get(qc.column) + "%%");
                        }
                    } else {
                        suc.OrLike(qc.table, qc.column);
                        suc.AddParam("%%" + value + "%%");
                    }
                } else if (kfc.contains(qc.asColumn) && StrUtil.isNotEmpty(qc.asColumn)) {
                    if (valueMap != null) {
                        if (valueMap.containsKey(qc.asColumn)) {
                            suc.AndLike(qc.table, qc.column);
                            suc.AddParam("%%" + valueMap.get(qc.asColumn) + "%%");
                        }
                    } else {
                        suc.OrLike(qc.table, qc.column);
                        suc.AddParam("%%" + value + "%%");
                    }
                }
            }
            String where = suc.ToWhere();
            if (StrUtil.isNotEmpty(where)) {
                su.And(where);
            }
            su.AddParams(suc.GetParamsList());
        }
    }

    public SqlInfo.QueryColumn GetQueryColumn(List<SqlInfo.QueryColumn> listQueryColumn, String column) {
        SqlInfo.QueryColumn queryColumn = null;
        SqlInfo.QueryColumn _queryColumn = null;
        for (SqlInfo.QueryColumn qc : listQueryColumn) {
            if (qc.asColumn != null && qc.asColumn.equals(column)) {//先通过别名查找
                queryColumn = qc;
                break;
            }
            if (qc.column.equals(column)) {
                _queryColumn = qc;
            }
        }
        if (queryColumn == null) {
            queryColumn = _queryColumn;
        }
        return queryColumn;
    }

    public void CreateCustomFilterCond(SqlInfo su) {
        List<Map<String, Object>> list = TypeConvert.FromListMapJson(this.CustomFilterCond);
        if (list != null) {
            SqlInfo sor = new SqlInfo();
            for (Map<String, Object> m : list) {
                List listitems = (List) m.get("items");
                if (listitems != null) {
                    SqlInfo sand = new SqlInfo();
                    for (Object item : listitems) {
                        Map mitem = (Map) item;
                        String column = TypeConvert.ToString(mitem.get("columnName"));
                        String relation = TypeConvert.ToString(mitem.get("relationValue"));
                        String resultvalue = TypeConvert.ToString(mitem.get("resultValue"));
                        if (StrUtil.isNotEmpty(column) && StrUtil.isNotEmpty(relation) &&
                                (StrUtil.isNotEmpty(resultvalue) || ("为空".equals(relation) || "不为空".equals(relation)))) {
                            String type = TypeConvert.ToString(mitem.get("resultType"));
                            Object result = TypeConvert.ToType(TypeConvert.FromTypeString(type), resultvalue);
                            SqlInfo.QueryColumn qc = GetQueryColumn(su.listQueryColumn, column);
                            if (qc != null) {
                                if ("包含".equals(relation)) {
                                    if (TypeConvert.IsJSONString(resultvalue)) {
                                        String incond = qc.table + "." + qc.column + " in ( ";
                                        List<Object> values = TypeConvert.FromListJson(resultvalue);
                                        for (Object v : values) {
                                            incond += "?,";
                                            sand.AddParam(v);
                                        }
                                        incond = StrUtil.CutEnd(incond, ",");
                                        incond += ")";
                                        sand.And(incond);
                                    } else {
                                        String cond = qc.table + "." + qc.column + " like ? ";
                                        sand.And(cond).AddParam("%%" + TypeConvert.ToString(result) + "%%");
                                    }

                                } else if ("不包含".equals(relation)) {
                                    if (TypeConvert.IsJSONString(resultvalue)) {
                                        String incond = qc.table + "." + qc.column + " not in ( ";
                                        List<Object> values = TypeConvert.FromListJson(resultvalue);
                                        for (Object v : values) {
                                            incond += "?,";
                                            sand.AddParam(v);
                                        }
                                        incond = StrUtil.CutEnd(incond, ",");
                                        incond += ")";
                                        sand.And(incond);
                                    } else {
                                        String cond = qc.table + "." + qc.column + " not like ? ";
                                        sand.And(cond).AddParam("%%" + TypeConvert.ToString(result) + "%%");
                                    }

                                } else if ("为空".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " is null ";
                                    sand.And(cond);
                                } else if ("不为空".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " is not null ";
                                    sand.And(cond);
                                } else if ("等于".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " =? ";
                                    sand.And(cond).AddParam(result);
                                } else if ("不等于".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " <>? ";
                                    sand.And(cond).AddParam(result);
                                } else if ("大于等于".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " >=? ";
                                    sand.And(cond).AddParam(result);
                                } else if ("小于等于".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " <=? ";
                                    sand.And(cond).AddParam(result);
                                }
                            }
                        }
                    }
                    if (StrUtil.isNotEmpty(sand.ToWhere())) {
                        sor.Or(sand.ToWhere()).AddParams(sand.GetParamsList());
                    }
                }
            }
            if (StrUtil.isNotEmpty(sor.ToWhere())) {
                su.And(sor.ToWhere()).AddParams(sor.GetParamsList());
            }
        }
    }

    public void CreatQueryColumnCond(SqlInfo su) {
        String filterKey = "filter";
        for (SqlInfo.QueryColumn qc : su.listQueryColumn) {
            if (qc.type.equals(XQuery.QueryType.none)) {
                continue;
            }
            if (StrUtil.isNotEmpty(qc.column)) {
                Object o = RequestUtil.GetParameter(this.request, filterKey + qc.column);
                if (o == null && StrUtil.isNotEmpty(qc.asColumn)) {
                    o = RequestUtil.GetParameter(this.request, filterKey + qc.asColumn);
                }
                if (o != null) {
                    Class t = qc.clazz;
                    if (t == null) {
                        try {
                            Class clazz = SqlCache.GetClassByTableName(qc.table);
                            Field f = clazz.getDeclaredField(qc.column);
                            t = f.getType();
                        } catch (Exception e) {
                            continue;
                        }
                    }
                    if (qc.type.equals(XQuery.QueryType.custom)) {
                        if (t.equals(String.class)) {
                            String cond = qc.table + "." + qc.column + " like ? ";
                            su.And(cond).AddParam("%%" + TypeConvert.ToString(o) + "%%");
                        } else if (t.equals(Date.class) || t.equals(Double.class) || t.equals(Integer.class) || t.equals(int.class) || t.equals(double.class)) {
                            String v = TypeConvert.ToString(o);
                            String[] vs = v.split("\\|");
                            if (vs.length > 0 && StrUtil.isNotEmpty(vs[0])) {
                                su.And(qc.table + "." + qc.column + " >= ? ");
                                su.AddParam(TypeConvert.ToType(t, vs[0]));
                            }
                            if (vs.length > 1 && StrUtil.isNotEmpty(vs[1])) {
                                su.And(qc.table + "." + qc.column + " <= ? ");
                                su.AddParam(TypeConvert.ToType(t, vs[1]));
                            }
                        }
                    } else {
                        String op = XQuery.QueryType.GetOperate(qc.type);
                        if (qc.type.equals(XQuery.QueryType.like)) {

                        }
                        if (qc.type.equals(XQuery.QueryType.range)) {

                        }
                    }
                }
            }
        }
    }

    public void CreateQueryCond(SqlInfo su) throws Exception {
        Field[] fields = this.getClass().getFields();
        for (Field f : fields) {
            Object o = f.get(this);
            if (o != null && StrUtil.isNotEmpty(o) && !"undefined".equals(TypeConvert.ToString(o))) {

                XQuery cs = f.getAnnotation(XQuery.class);
                if (cs == null) {
                    continue;
                }
                String column = StrUtil.isEmpty(cs.column()) ? f.getName() : cs.column();
                String table = cs.table();
                if ("BaseQuery".equals(table) || StrUtil.isEmpty(table)) {
                    if (this.model != null) {
                        table = BaseModel.GetTableName(this.model.getClass());
                    }
                }
                if (StrUtil.isNotEmpty(table)) {
                    column = table + "." + column;
                }
                if (cs.type() == XQuery.QueryType.none) {
                    continue;
                }
                if (!"undefined".equals(o) && !"".equals(o)) {
                    String op = XQuery.QueryType.GetOperate(cs.type());
                    if (cs.type() == XQuery.QueryType.in && (this.IsTree != null && this.IsTree == true) && BaseModelTree.F_Parentid.equals(cs.column())) {
                        String incond = table + "." + BaseModelTree.F_id + " in ( ";
                        String incond2 = column + " in ( ";
                        String[] values = TypeConvert.ToStringArray(o);
                        for (String v : values) {
                            incond += "?,";
                            su.AddParam(v);
                        }
                        for (String v : values) {
                            incond2 += "?,";
                            su.AddParam(v);
                        }
                        incond = StrUtil.CutEnd(incond, ",");
                        incond += ")";

                        incond2 = StrUtil.CutEnd(incond2, ",");
                        incond2 += ")";

                        incond = "(" + incond + " or " + incond2 + ")";
                        su.And(incond);

                    } else if (cs.type() == XQuery.QueryType.in || cs.type() == XQuery.QueryType.notIn) {
                        String incond = "";
                        if (cs.type() == XQuery.QueryType.notIn) {
                            incond = column + " not in ( ";
                        } else {
                            incond = column + " in ( ";
                        }

                        String[] values = TypeConvert.ToStringArray(o);
                        for (String v : values) {
                            incond += "?,";
                            su.AddParam(v);
                        }
                        incond = StrUtil.CutEnd(incond, ",");
                        incond += ")";
                        su.And(incond);
                    } else if (cs.type() == XQuery.QueryType.custom) {
                        su.And(TypeConvert.ToString(o));
                    } else if (cs.type() == XQuery.QueryType.equalOrNull) {
                        su.And(column + " = ? or " + column + " is null ").AddParam(TypeConvert.ToType(f.getType(), o));
                    } else if (cs.type() == XQuery.QueryType.isnullORnot) {
                        if ("是".equals(o) || TypeConvert.ToBoolean(o)) {
                            su.And(column + " is null ");
                        } else {
                            su.And(column + " is not null ");
                        }
                    } else if (cs.type() == XQuery.QueryType.range) {
                        String value = TypeConvert.ToString(o);
                        String[] values = value.split("\\|");
                        if (values.length > 0 && StrUtil.isNotEmpty(values[0])) {
                            su.And(column + " >= ? ").AddParam(TypeConvert.ToType(f.getType(), values[0]));
                        }
                        if (values.length > 1 && StrUtil.isNotEmpty(values[1])) {
                            su.And(column + " <= ? ").AddParam(TypeConvert.ToType(f.getType(), values[1]));
                        }
                    } else {
                        if (o instanceof String[]) {
                            String[] strs = (String[]) o;
                            if (strs.length > 0) {
                                String cc = "(";
                                for (String s : strs) {
                                    cc += column + " " + op + " ?  or ";
                                    if (cs.type() == XQuery.QueryType.like) {
                                        su.AddParam("%%" + s + "%%");
                                    } else if (cs.type() == XQuery.QueryType.notLike) {
                                        su.AddParam("%%" + s + "%%");
                                    } else if (cs.type() == XQuery.QueryType.leftlike) {
                                        su.AddParam(s + "%%");
                                    } else if (cs.type() == XQuery.QueryType.rightlike) {
                                        su.AddParam("%%" + s);
                                    } else {
                                        su.AddParam(TypeConvert.ToType(f.getType(), s));
                                    }
                                }
                                cc = StrUtil.CutEnd(cc, "or ");
                                cc += ")";
                                su.And(cc);
                            }
                        } else {
                            su.And(column + " " + op + " ? ");
                            if (cs.type() == XQuery.QueryType.like) {
                                su.AddParam("%%" + TypeConvert.ToString(o) + "%%");
                            } else if (cs.type() == XQuery.QueryType.notLike) {
                                su.AddParam("%%" + TypeConvert.ToString(o) + "%%");
                            } else if (cs.type() == XQuery.QueryType.leftlike) {
                                su.AddParam(TypeConvert.ToString(o) + "%%");
                            } else if (cs.type() == XQuery.QueryType.rightlike) {
                                su.AddParam("%%" + TypeConvert.ToString(o));
                            } else {
                                su.AddParam(TypeConvert.ToType(f.getType(), o));
                            }
                        }
                    }
                }

            }
        }
    }

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
        return CheckSqlException(su, () -> _ListSql(su, pageInfo));
    }

    private static DataTable _ListSql(SqlInfo su, BaseQuery pageInfo) throws SQLException {
        final ArrayList<DataTable> retList = new ArrayList<>();
        SystemSessionManager.getSession().doWork(false, conn -> {
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
                    BaseDataSource dataSource = SystemSessionManager.getThreadDataSource();
                    if (dataSource != null) {
                        _sql = dataSource.GetLimitString(pageInfo, _sql);
                    } else {
                        _sql += " LIMIT " + pageInfo.PageSize + " OFFSET " + pageInfo.PageIndex;
                    }
                }
            }
            Map<String, Object> totalResult = null;
            if (pageInfo != null && pageInfo.totalMode != null) {
                totalResult = new HashMap<>();
                for (String f : pageInfo.totalMode.keySet()) {
                    String mode = TypeConvert.ToString(pageInfo.totalMode.get(f));
                    if (mode.equals(StatTypeEnum.count.name())) {
                        totalResult.put(f, LongSql(su.ToCountTotal(f)));
                    } else if (mode.equals(StatTypeEnum.sum.name())) {
                        totalResult.put(f, DoubleSql(su.ToSumTotal(f)));
                    } else if (mode.equals(StatTypeEnum.avg.name())) {
                        totalResult.put(f, DoubleSql(su.ToAvgTotal(f)));
                    } else if (mode.equals(StatTypeEnum.min.name())) {
                        totalResult.put(f, DoubleSql(su.ToMinTotal(f)));
                    } else if (mode.equals(StatTypeEnum.max.name())) {
                        totalResult.put(f, DoubleSql(su.ToMaxTotal(f)));
                    }
                }
            }
            QueryRunner qr = new QueryRunner();
            TableSqlHandler handler = new TableSqlHandler();
            List<Map<String, Object>> lm;
            if (su.isOutLog) {
                log.info(_sql);
                log.info(JSON.toJSONString(su.GetParams()));
            }
            lm = qr.query(conn, _sql, handler, handleSqlParams(su.GetParams()));
            DataTable dt = new DataTable(handleSqlResult(lm), handler.DataSchema);
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
            BaseDataSource dataSource = SystemSessionManager.getThreadDataSource();
            if (dataSource != null) {
                dataSource.handleDataTable(dt);
            }
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
        return CheckSqlException(su, () -> _InfoSql(clazz, su));
    }

    public static <T extends BaseModel> T _InfoSql(Class<T> clazz, SqlInfo su) throws SQLException {
        final ArrayList<T> retList = new ArrayList<T>();
        SystemSessionManager.getSession().doWork(false, conn -> {
            QueryRunner qr = new QueryRunner();
            MapHandler map = new MapHandler();
            Map<String, Object> lm;
            lm = qr.query(conn, su.ToSql(), map, handleSqlParams(su.GetParams()));
            if (lm != null) {
                T bm = null;
                try {
                    bm =TypeConvert.CreateNewInstance(clazz);
                    bm.SetValuesByMap(handleSqlResult(lm));
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
        return CheckSqlException(su, () -> _MapSql(su));
    }

    // 执行一段SQL, 返回一个Map
    public static Map<String, Object> _MapSql(SqlInfo su) throws SQLException {
        final ArrayList<Map<String, Object>> retList = new ArrayList<>();
        SystemSessionManager.getSession().doWork(false, conn -> {
            QueryRunner qr = new QueryRunner();
            MapHandler map = new MapHandler();
            Map<String, Object> lm;
            String sql = su.ToSql();
            if (su.isOutLog) {
                log.info(sql);
                log.info(JSON.toJSONString(su.GetParams()));
            }
            lm = qr.query(conn, sql, map, handleSqlParams(su.GetParams()));
            if (lm == null) lm = new HashMap<>();
            retList.add(handleSqlResult(lm));
        });
        if (GlobalValues.baseAppliction != null) {
            GlobalValues.baseAppliction.ExecuteSqlInfo(false, su);
        }
        return retList.get(0);
    }

    public static int ExecuteSql(SqlInfo su) throws SQLException {
        int ret = CheckSqlException(su, () -> _ExecuteSql(su));
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
        SystemSessionManager.getSession().doWork(true, conn -> {
            String sql = su.ToSql();
            if (su.isOutLog) {
                log.info(sql);
                log.info(JSON.toJSONString(su.GetParams()));
            }
            retList.add(new QueryRunner().update(conn, sql, handleSqlParams(su.GetParams())));
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
        int ret = 0;
        table = SqlTable.getQuote(table);
        SqlInfo insertSql = new SqlInfo();
        SqlInfo updateSql = new SqlInfo();
        insertSql.CreateInsertInto(table);
        updateSql.CreateUpdate(table);
        for (String col : params.keySet()) {
            Object value = params.get(col);
            col = SqlTable.getQuote(col);
            insertSql.Values(col);
            insertSql.AddParam(value);
            if (primaryKey != null && !primaryKey.contains(col)) {//主键则不更新
                updateSql.SetEqual(col);
                updateSql.AddParam(value);
            }
        }
        for (String col : primaryKey) {
            Object value = params.get(col);
            col = SqlTable.getQuote(col);
            updateSql.AndEqual(table, col);
            updateSql.AddParam(value);
        }
        boolean insertData = isInsert;
        if (!insertData) {
            if (primaryKey == null || primaryKey.size() == 0) {//直接插入数据
                insertData = true;
            } else {
                ret = BaseQuery.ExecuteSql(updateSql);
                insertData = ret == 0;
            }
        }
        if (insertData) {
            ret = BaseQuery.ExecuteSql(insertSql);
        }
        return ret;
    }

    //批量插入
    public static int InsertDatas(String table, List<Map<String, Object>> paramList, List<String> keys) throws SQLException {
        int ret = 0;
        if (paramList.size() > 0) {
            table = SqlTable.getQuote(table);
            SqlInfo insertSql = new SqlInfo();
            insertSql.CreateInsertInto(table);
            for (String col : keys) {
                col = SqlTable.getQuote(col);
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
            ret = BaseQuery.ExecuteSql(insertSql);
        }
        return ret;
    }

    public static int DeleteData(String table, Map<String, Object> whereMap) throws SQLException {
        table = SqlTable.getQuote(table);
        SqlInfo deleteSql = new SqlInfo();
        deleteSql.CreateDelete(table);
        if (whereMap != null) {
            for (String col : whereMap.keySet()) {
                Object value = whereMap.get(col);
                col = SqlTable.getQuote(col);
                deleteSql.AndEqual(table, col);
                deleteSql.AddParam(value);
            }
        }
        return BaseQuery.ExecuteSql(deleteSql);
    }

    public static Object[] handleSqlParams(Object[] params) {
        BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
        if (baseDataSource != null) {
            return baseDataSource.handleSqlParams(params);
        }
        return params;
    }

    public static Map<String, Object> handleSqlResult(Map<String, Object> map) {
        BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
        if (baseDataSource != null) {
            return baseDataSource.handleSqlResult(map);
        }
        return map;
    }

    public static List<Map<String, Object>> handleSqlResult(List<Map<String, Object>> list) {
        BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
        if (baseDataSource != null) {
            return baseDataSource.handleSqlResult(list);
        }
        return list;
    }

    public interface Runnable {
        Object run() throws SQLException;
    }

    public static <T extends Object> T CheckSqlException(SqlInfo su, Runnable run) throws SQLException {
        try {
            return (T) run.run();
        } catch (Exception e) {
            BaseDataSource baseDataSource = SystemSessionManager.getThreadDataSource();
            if (BaseDataSource.CheckSqlException(e) || (baseDataSource != null && baseDataSource.CheckException(e))) {
                for (String table : su.TableList) {
                    Class<BaseModel> _class = SqlCache.GetClassByTableName(table);
                    if (_class != null) {
                        SqlTable.CheckTable(_class);
                    }
                }
            }
            return (T) run.run();
        }
    }

    public static void main(String[] args) {
        String[] a1 = " 1".split(" ");
        String[] a2 = " 1 ".split(" ");
        String[] a3 = " 1 2".split(" ");
        String[] a4 = "1 2 3".split(" ");
        String[] a5 = "  1 ".split(" ");
        System.out.println(a5);
    }
}
