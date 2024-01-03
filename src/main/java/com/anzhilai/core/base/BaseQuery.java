package com.anzhilai.core.base;

import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.database.SqlExe;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.util.*;

/**
 * 基础查询类
 * 查询模型的基类，构建数据库查询中的过滤条件
 */
public class BaseQuery {
    /**
     * 日志
     */
    private static Logger log = Logger.getLogger(BaseQuery.class);
    /**
     * 每页记录数
     */
    public static final String F_PAGE_SIZE = "pageSize";
    /**
     * 当前页码
     */
    public static final String F_PAGE_INDEX = "pageIndex";
    /**
     * 排序字段
     */
    public static final String F_ORDER_BY = "orderBy";
    /**
     * 前端表格列的统计模式
     */
    public static final String F_TotalMode = "totalMode";

    /**
     * 构造函数
     */
    public BaseQuery() {
    }
    /**
     * 构造函数
     * @param bm 基础模型
     */
    public BaseQuery(BaseModel bm) {
        this.model = bm;
    }
    /**
     * 是否有数据权限
     */
    public boolean hasDataRight = true;
    /**
     * 用户ID
     */
    public String UserID;
    /**
     * 用户所在部门的树路径
     */
    public String UserTreePath;
    /**
     * id
     */
    @XQuery(table = "BaseQuery", type = XQuery.QueryType.equal)
    public String id;

    /**
     * 父id
     */
    @XQuery(table = "BaseQuery", type = XQuery.QueryType.equal)
    public String Parentid;
    /**
     * 是否为叶子节点
     */
    @XQuery(table = "BaseQuery", type = XQuery.QueryType.equal)
    public Integer IsTreeLeaf;
    /**
     * ids，数组
     */
    @XQuery(table = "BaseQuery", column = BaseModelTree.F_id, type = XQuery.QueryType.in)
    public String[] ids;
    /**
     * 父ids，数组
     */
    @XQuery(table = "BaseQuery", column = BaseModelTree.F_Parentid, type = XQuery.QueryType.in)
    public String[] Parentids;
    /**
     * 树的层级名称查询
     */
    @XQuery(table = "BaseQuery", column = BaseModelTree.F_TreeName, type = XQuery.QueryType.like)
    public String TreeName;
    /**
     * 记录的更新时间起始
     */
    @XQuery(table = "BaseQuery", column = BaseModel.F_UpdateTime, type = XQuery.QueryType.greatEqual)
    public Date UpdateTimeStart;
    /**
     * 更新时间结束
     */
    @XQuery(table = "BaseQuery", column = BaseModel.F_UpdateTime, type = XQuery.QueryType.lessEqual)
    public Date UpdateTimeEnd;

    /**
     * 表格的关键字查询字段
     */
    @XQuery(type = XQuery.QueryType.none)
    public String[] KeywordFields;
    /**
     * 表格的关键字查询的值
     */
    @XQuery(type = XQuery.QueryType.none)
    public String KeywordValue = "";
    /**
     * 是否为树形结构
     */
    public Boolean IsTree;
    /**
     * 是否为树的全部数据
     */
    public Boolean IsTreeAllData;
    /**
     * 是否为搜索
     */
    public boolean IsSearch = false;
    /**
     * 是否为表格
     */
    public Boolean IsTable;

    /**
     * 总行数
     */
    public Long Total = 0L;
    /**
     * 当前行数
     */
    public Long PageIndex = -1L;
    /**
     * 每页行数
     */
    public Long PageSize = -1L;
    /**
     * 是否使用排序
     */
    public boolean UseOrderBy = true;
    /**
     * 排序字段
     */
    public String OrderBy = "";

    /**
     * 前端的自定义过滤条件
     */
    public String CustomFilterCond;
    /**
     * 根据上面生成的总计SQL语句
     */
    public String totalSql;
    /**
     * 前端表格列的统计模式
     */
    public Map<String, Object> totalMode;
    /**
     * 统计类型枚举
     */
    public enum E_StatType {
        sum, count, avg, max, min
    }
    /**
     * 统计类型
     */
    public String StatType;
    /**
     * 统计字段
     */
    public String StatField;
    /**
     * 分组字段
     */
    public String[] GroupField;


    /**
     * 记录当前请求
     */
    private transient HttpServletRequest request = null;
    BaseModel model;
    /**
     * 获取当前查询的基础模型
     * @return 基础模型对象
     */
    public BaseModel getModel() {
        return model;
    }
    /**
     * 自定义SQL条件列表
     */
    List<SqlInfo> listCustomSqlCond = new ArrayList<>();
    /**
     * 清除自定义SQL条件
     */
    public void ClearCustomSqlCond() {
        listCustomSqlCond.clear();
    }
    /**
     * 添加自定义SQL条件
     * @param su 自定义SQL条件对象
     */
    public void AddCustomSqlCond(SqlInfo su) {
        listCustomSqlCond.add(su);
    }

    /**
     * 根据条件生成SQL语句
     * @param su SQL信息对象
     * @throws Exception 异常
     */
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
            if (model != null && StrUtil.isNotEmpty(model.GetDefaultOrderField())) {
                String maintable = BaseModel.GetTableName(model.getClass());
                this.OrderBy = SqlInfo.CreateOrderBy(maintable, model.GetDefaultOrderField(), model.IsDefaultAscOrder());
            } else {
                this.OrderBy = SqlInfo.CreateOrderBy(su.CurrentMainTable, BaseModel.F_CreateTime, false);
            }
        }
    }

    /**
     * 获取数据列表
     * @param su SQL信息对象
     * @return 数据表
     * @throws Exception 异常
     */
    public DataTable GetList(SqlInfo su) throws Exception {
        this.CreateSql(su);
        this.totalSql = su.ToTotal();
        DataTable dt = SqlExe.ListSql(su, this);
        return ToTreeFirstLevel(dt);
    }
    /**
     * 获取数据列表（无分页）
     * @param su SQL信息对象
     * @return 数据表
     * @throws Exception 异常
     */
    public DataTable GetListNoPage(SqlInfo su) throws Exception {
        this.CreateSql(su);
        return SqlExe.ListSql(su, null);
    }
    /**
     * 获取单个值
     * @param su SQL信息对象
     * @return 单个值
     * @throws Exception 异常
     */
    public Object GetValue(SqlInfo su) throws Exception {
        this.CreateSql(su);
        return SqlExe.ObjectSql(su);
    }

    /**
     * 初始化完毕，用来在子类中重写，扩展初始化
     */
    public void InitComplete() { }
    /**
     * 将数据表转成树形结构的第一层节点
     * @param dt 数据表
     * @return 转换后的数据表
     */
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
    /**
     * 过滤数据表
     * @param dt 数据表
     * @return 过滤后的数据表
     */
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
            if (has) {
                result.Data.add(m);
            }
        }
        result.DataColumns = dt.DataColumns;
        return result;
    }

    /**
     * 禁用分页
     * @return 当前查询对象
     */
    public BaseQuery NotPagination() {
        this.PageSize = -1L;
        this.PageIndex = -1L;
        return this;
    }
    /**
     * 从HttpServletRequest中初始化查询对象
     * @param _request HttpServletRequest对象
     * @return 当前查询对象
     * @throws IllegalAccessException 非法访问异常
     */
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

    /**
     * 生成关键字查询条件
     * @param su SQL信息对象
     */
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

    /**
     * 创建自定义过滤条件
     * @param su SQL信息对象
     */
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

                            SqlInfo.QueryColumn qc = null;
                            SqlInfo.QueryColumn tempqc = null;
                            for (SqlInfo.QueryColumn sqc : su.listQueryColumn) {
                                if (sqc.asColumn != null && sqc.asColumn.equals(column)) {//先通过别名查找
                                    qc = sqc;
                                    break;
                                }
                                if (sqc.column.equals(column)) {
                                    tempqc = sqc;
                                }
                            }
                            if (qc == null) {
                                qc = tempqc;
                            }

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
                                } else if ("大于".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " >? ";
                                    sand.And(cond).AddParam(result);
                                } else if ("小于".equals(relation)) {
                                    String cond = qc.table + "." + qc.column + " <? ";
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
    /**
     * 创建查询字段条件
     * @param su SQL信息对象
     */
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
    /**
     * 创建查询条件SQL
     * @param su SQL信息对象
     * @throws Exception 异常
     */
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

}
