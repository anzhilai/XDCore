package com.anzhilai.core.base;

import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.DoubleUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.toolkit.StrUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * 基础统计类
 * 提供一种高效的多维统计算法，通过继承可以扩展多种业务场景
 */
public abstract class BaseStatistic {

    public final static String DimID = "id";
    public final static String DimParentID = "Parentid";
    public final static String DimLevelID = "DimLevelID";
    public final static String DimParentFilterID = "DimParentFilterID";
    public final static String DimFilterID = "DimFilterID";
    public final static String DimIsAddRow = "DimIsAddRow";
    public final static String DimIsLeaf = "DimIsLeaf";


    protected DataTable dtdata;  //排序好的数据
    //按那些字段进行统计
    public List<String> statFields = new ArrayList<String>(); //统计属性列表

    /**
     * 默认构造函数
     */
    public BaseStatistic() {
        this.dtdata = new DataTable();
    }

    /**
     * 带数据参数的构造函数
     *
     * @param _dtdata 数据表
     */
    public BaseStatistic(DataTable _dtdata) {
        this.dtdata = _dtdata;
    }

    /**
     * 带多个参数的构造函数
     *
     * @param _dtdata    数据表
     * @param _listField 统计属性列表
     */
    public BaseStatistic(DataTable _dtdata, List<String> _listField) {
        this.dtdata = _dtdata;
        statFields = _listField;
    }

    /**
     * 获取要统计的数据表
     *
     * @return 数据表
     */
    public DataTable GetData() {
        return this.dtdata;
    }

    /**
     * 设置要统计的数据表
     *
     * @param dt 数据表
     */
    public void SetData(DataTable dt) {
        this.dtdata = dt;
    }

    /**
     * 创建内置的查询模型
     *
     * @param <T> 查询模型类型
     * @return 查询模型
     */
    public <T extends BaseQuery> T CreateQueryModel() {
        return null;
    }

    protected BaseQuery query;

    /**
     * 根据维度获取过滤条件
     *
     * @param dim        维度
     * @param dimColumns 维度属性列表
     * @param mapdata    数据映射
     * @return 过滤条件
     */
    String getFilter(int dim, List<String> dimColumns, Map mapdata) {
        String f = "";
        for (int i = 0; i <= dim; i++) {
            String dcolumn = dimColumns.get(i);
            if (dcolumn.startsWith("tree")) {
                f += dcolumn + " and ";
            } else {
                String v = TypeConvert.ToString(mapdata.get(dcolumn));
                f += dcolumn + "='" + v + "' and ";
            }
        }
        f = StrUtil.CutEnd(f, " and ");
        return f;
    }

    /**
     * 获取树的名称字段
     *
     * @param column 字段名
     * @return 树的名称字段名
     */
    public String GetTreeNameField(String column) {
        return column + "Name";
    }

    /**
     * 从树形数据中扩展数据
     *
     * @param dtdata    数据表
     * @param treeField 树字段
     * @param dttree    树形数据表
     * @param nameField 名称字段
     * @param treelevel 树形层级
     * @return 扩展的字段列表
     */
    public List<String> ExtendDataFromTree(DataTable dtdata, String treeField, DataTable dttree, String nameField, int treelevel) {
        List<String> extendFields = new ArrayList<>();

        for (int i = 0; i < treelevel; i++) {
            extendFields.add(treeField + i);
        }
        for (int j = dtdata.Data.size() - 1; j >= 0; j--) {
            Map<String, Object> mapdata = dtdata.Data.get(j);
            String treeid = TypeConvert.ToString(mapdata.get(treeField));
            Map md = dttree.GetRowByIDField(treeid);
            if (md != null) {
                String path = TypeConvert.ToString(md.get(BaseModelTree.F_TreePath));
                String[] treepaths = StrUtil.split(path, BaseModelTree.TreePathSplit);
                for (int i = 0; i < treelevel; i++) {
                    if (i < treepaths.length) {
                        mapdata.put(treeField + i, treepaths[i]);
                        Map mm = dttree.GetRowByIDField(treepaths[i]);
                        if (mm != null) {
                            mapdata.put(GetTreeNameField(treeField + i), mm.get(nameField));
                        }
                    }
                }
            } else {//找不到，删除垃圾数据
                dtdata.Data.remove(j);
            }
        }
        return extendFields;
    }

    protected HashMap<String, Map<String, Object>> hashdata = new HashMap<>();
    protected HashMap<String, Integer> hashorder = new HashMap<>();

    protected DataTable run() throws Exception {
        return this.run(null);
    }

    /**
     * 运行统计查询
     *
     * @return 运行结果
     * @throws Exception 异常
     */
    protected DataTable run(StatRunnable runnable) throws Exception {
        DataTable dtresult = GetSchema();

        int rootorder = 1;
        int rowid = 0;
        List<String> dimColumns = new ArrayList<>();
        dimColumns.addAll(statFields);
        for (Map<String, Object> mapdata : dtdata.Data) {
            if (!IsStatisticRow(mapdata)) {
                continue;
            }
            int dim = 0;
            for (String c : dimColumns) {
                String f = getFilter(dim, dimColumns, mapdata);
                if (!hashdata.containsKey(f)) {
                    Map<String, Object> newrow = new HashMap<>();
                    rowid++;
                    newrow.put(DimID, TypeConvert.ToString(rowid));
                    newrow.put(DimFilterID, f);
                    newrow.put(DimLevelID, dim);
                    if (dim == 0) {
                        newrow.put(DimParentID, "0");

                        if (runnable != null) {
                            runnable.forEachRow(true, rootorder, dim, c, newrow, mapdata, dtresult);
                        } else {
                            NotContainsMethod(rootorder, dim, c, newrow, mapdata, dtresult);
                        }
                        if (IsAddRow(newrow)) {
                            newrow.put(DimIsAddRow, true);
                            dtresult.AddRow(newrow);
                            hashorder.put(f, rootorder);
                            rootorder++;
                        } else {
                            newrow.put(DimIsAddRow, false);
                        }
                    } else {
                        String pf = getFilter(dim - 1, dimColumns, mapdata);

                        Map<String, Object> pdr = null;//查找父对象
                        while (true) {
                            pdr = hashdata.get(pf);
                            if (pdr == null) {
                                break;
                            }
                            if (TypeConvert.ToBoolean(pdr.get(DimIsAddRow))) {
                                break;
                            }
                            pf = TypeConvert.ToString(pdr.get(DimParentFilterID));
                        }
                        if (!hashorder.containsKey(pf)) {
                            hashorder.put(pf, 1);
                        }
                        int ord = hashorder.get(pf);
                        newrow.put(DimParentFilterID, pf);
                        if (pdr == null) {//没有父节点时，自己就是父节点
//                            newrow.put(DimFilterID, f);
//                            newrow.put(DimLevelID, 0);
                            newrow.put(DimParentID, "0");
                        } else {
                            newrow.put(DimParentID, pdr.get(DimID));
                        }

                        if (runnable != null) {
                            runnable.forEachRow(true, ord, dim, c, newrow, mapdata, dtresult);
                        } else {
                            NotContainsMethod(ord, dim, c, newrow, mapdata, dtresult);
                        }
                        if (IsAddRow(newrow)) {
                            newrow.put(DimIsAddRow, true);
                            int position = -1;
                            if (pdr != null) {
                                int index = dtresult.IndexOfRow(pdr);
                                for (int i = index + 1; i < dtresult.Data.size(); i++) {
                                    Map cdr = dtresult.Data.get(i);
                                    String cdrpf = TypeConvert.ToString(cdr.get(DimFilterID));
                                    if (!cdrpf.contains(pf)) {
                                        position = i;
                                        break;
                                    }
                                }
                            }
                            if (position == -1) {
                                dtresult.AddRow(newrow);
                            } else {
                                dtresult.InsertRow(newrow, position);
                            }

                            hashorder.put(pf, hashorder.get(pf) + 1);
                        } else {
                            newrow.put(DimIsAddRow, false);
                        }
                    }
                    hashdata.put(f, newrow);
                } else {
                    Map<String, Object> oldrow = hashdata.get(f);

                    if (runnable != null) {
                        int order = 0;
                        if (hashorder.containsKey(f)) {
                            order = hashorder.get(f);
                        }
                        runnable.forEachRow(false, order, dim, c, oldrow, mapdata, dtresult);
                    } else {
                        ContainsMethod(c, oldrow, mapdata);
                    }
                }
                dim++;

            }
            ForEachRow(mapdata);
        }
        AfterRun(dtresult);
        return dtresult;
    }

    DataTable dtSchema;

    /**
     * 获取数据架构（表头）
     *
     * @return 数据架构
     * @throws Exception 异常
     */
    protected DataTable GetSchema() throws Exception {
        if (dtSchema == null) {
            dtSchema = new DataTable();
        }
        return this.dtSchema;
    }

    /**
     * 设置数据架构（表头）
     *
     * @param dtSchema 数据结构
     */
    protected void SetSchema(DataTable dtSchema) {
        this.dtSchema = dtSchema;
    }

    /**
     * 创建新的行
     *
     * @return 新的行数据
     * @throws Exception 异常
     */
    public Map CreateNewRow() throws Exception {
        return null;
    }

    /**
     * 获取数据
     *
     * @param query 查询模型
     * @return 数据表
     * @throws Exception 异常
     */
    public DataTable GetData(BaseQuery query) throws Exception {
        return this.dtdata;
    }

    /**
     * 从请求中创建查询模型
     *
     * @param request Http请求
     * @throws Exception 异常
     */
    public void CreateQueryModelFromRequest(HttpServletRequest request) throws Exception {
    }


    /**
     * 判断是否是统计行
     *
     * @param map 数据映射
     * @return 是否是统计行的布尔值
     */
    protected boolean IsStatisticRow(Map<String, Object> map) {
        return true;
    }

    /**
     * 判断是否添加行
     *
     * @param row 数据行
     * @return 是否添加行的布尔值
     */
    protected boolean IsAddRow(Map<String, Object> row) {
        return true;
    }

    /**
     * 遍历数据行
     *
     * @param map 数据映射
     */
    protected void ForEachRow(Map<String, Object> map) {
    }

    /**
     * 判断是否删除行
     *
     * @param map 数据映射
     * @return 是否删除行的布尔值
     */
    protected boolean IsRowDelete(Map<String, Object> map) {
        return false;
    }

    /**
     * 统计结果运行后的操作
     *
     * @param dtresult 统计结果数据表
     */
    protected void AfterRun(DataTable dtresult) {
        List<Map> ldelete = new ArrayList<>();
        for (Map m : dtresult.Data) {
//            m.remove(DimFilterID);
//            m.remove(DimParentFilterID);
            if (IsRowDelete(m)) {
                ldelete.add(m);
            }
        }
        for (Map m : ldelete) {
            dtresult.Data.remove(m);
        }
    }

    /**
     * 遍历统计数据时第一次遇到新的值
     *
     * @param order     排序值
     * @param level     层级
     * @param column    字段名
     * @param mapresult 映射结果
     * @param mapdata   映射数据
     * @param dtresult  数据结果
     */
    protected void NotContainsMethod(int order, int level, String column, Map<String, Object> mapresult, Map<String, Object> mapdata, DataTable dtresult) {
    }

    /**
     * 遍历统计数据时再一次遇到同样的值
     *
     * @param column    字段名
     * @param mapresult 映射结果
     * @param mapdata   映射数据
     */
    protected void ContainsMethod(String column, Map<String, Object> mapresult, Map<String, Object> mapdata) {
    }

    public interface StatRunnable {
        void forEachRow(boolean isFirst, int order, int level, String column, Map<String, Object> mapResult, Map<String, Object> mapData, DataTable dtResult) throws Exception;
    }

    /**
     * 运行统计查询
     *
     * @param query 查询模型
     * @return 运行结果
     * @throws Exception 异常
     */
    public DataTable GetResult(BaseQuery query) throws Exception {
        this.query = query;
        this.dtdata = this.GetData(query);
        return this.run();
    }

    public final static String F_StatResultValue = "StatResultValue";
    public final static String F_DimRowJson = "DimRowJson";
    public final static String F_DimColumnJson = "DimColumnJson";
    public final static String F_IndicatorJson = "IndicatorJson";

    public static class StatDimension {
        public String Field;
        public String DisplayName;
        public String DateType;
        public String Order;

        public enum E_DateType {
            Year, Quarter, Month, Day, Week
        }
    }

    public static class StatIndicator {
        public String Field;
        public String DisplayName;
        public String Order;
        public String StatType;
        public String ColumnFilter;
        public String ColumnField;
        public Map ColumnTitle;

        public enum E_StatType {
            Value, Count, Sum, Avg, Max, Min
        }
    }

    public static class StatResultValue {
        public String RowFilter;
        public String ColumnFilter;
    }


    public List<StatDimension> ListRowDimension;
    public List<StatDimension> ListColumnDimension;
    public List<StatIndicator> ListIndicator;
    protected List<StatIndicator> ListLeafColumnsIndicator;


    protected void InitStatSchema() {
        this.dtSchema = new DataTable();
        dtSchema.CreateColumnTitleMap("id", false);
        if (this.ListRowDimension != null) {
            for (StatDimension si : this.ListRowDimension) {
                Map col = dtSchema.CreateColumnTitleMap(si.Field, si.DisplayName, true, null, null);
                col.put("lock", true);
            }
        }

        this.ListLeafColumnsIndicator = new ArrayList<>();

        if (ListColumnDimension != null && !ListColumnDimension.isEmpty()) {
            List<List<String>> listColumnData = new ArrayList<>();
            for (StatDimension sd : ListColumnDimension) {
                sd.DateType = TypeConvert.ToString(sd.DateType);
                List<String> list = new ArrayList<>();
                for (Map m : dtdata.Data) {
                    String o = "";
                    Object value = m.get(sd.Field);
                    if (value != null && StrUtil.isNotEmpty(sd.DateType)) {
                        Date date = TypeConvert.ToDate(value);
                        if (StatDimension.E_DateType.Year.name().equalsIgnoreCase(sd.DateType)) {
                            o = DateUtil.GetString年(date);
                        } else if (StatDimension.E_DateType.Quarter.name().equalsIgnoreCase(sd.DateType)) {
                            o = DateUtil.GetString年季(date);
                        } else if (StatDimension.E_DateType.Month.name().equalsIgnoreCase(sd.DateType)) {
                            o = DateUtil.GetString年月(date);
                        } else if (StatDimension.E_DateType.Week.name().equalsIgnoreCase(sd.DateType)) {
                            o = DateUtil.GetString年周(date);
                        } else {
                            sd.DateType = StatDimension.E_DateType.Day.name();
                            o = DateUtil.GetString年月日(date);
                        }
                        m.put(sd.Field + "_" + sd.DateType, o);
                    } else {
                        o = TypeConvert.ToString(m.get(sd.Field));
                    }
                    if (!list.contains(o)) {
                        list.add(o);
                    }
                }
                listColumnData.add(list);
            }

            List<StatIndicator> listNextColumns = new ArrayList<>();
            int i = 0;
            List<String> pre = listColumnData.get(i);
            for (String p : pre) {
                StatDimension sd = ListColumnDimension.get(i);
                String s = sd.Field + (StrUtil.isNotEmpty(sd.DateType) ? "_" + sd.DateType : "") + " = '" + p + "'";
                Map columnTitle = dtSchema.CreateColumnTitleMap(s, sd.Field + "=" + p, true, null, null);
                columnTitle.put("align", "center");
                StatIndicator si = new StatIndicator();
                si.DisplayName = p;
                si.ColumnFilter = s;
                si.ColumnTitle = columnTitle;
                listNextColumns.add(si);
            }
            i++;
            while (i < listColumnData.size()) {
                StatDimension sd = ListColumnDimension.get(i);
                List<StatIndicator> listPreColumns = listNextColumns;
                listNextColumns = new ArrayList<>();
                List<String> nextdata = listColumnData.get(i);
                for (StatIndicator sip : listPreColumns) {
                    for (String d : nextdata) {
                        String s = sip.ColumnFilter + " && " + sd.Field + (StrUtil.isNotEmpty(sd.DateType) ? "_" + sd.DateType : "") + " = '" + d + "'";
                        Map columnTitle = dtSchema.CreateColumnTitleMap(s, sd.Field + "=" + d, true, null, sip.ColumnTitle);
                        columnTitle.put("align", "center");
                        StatIndicator si = new StatIndicator();
                        si.DisplayName = d;
                        si.ColumnFilter = s;
                        si.ColumnTitle = columnTitle;
                        listNextColumns.add(si);
                    }
                }
                i++;
            }
            for (StatIndicator nextcol : listNextColumns) {
                for (StatIndicator si : this.ListIndicator) {
                    StatIndicator ssi = new StatIndicator();
                    ssi.ColumnFilter = nextcol.ColumnFilter;
                    ssi.ColumnField = nextcol.ColumnFilter;
                    ssi.DisplayName = si.DisplayName;
                    ssi.Field = si.Field;
                    ssi.StatType = si.StatType;
                    ssi.Order = si.Order;
                    if (this.ListIndicator.size() > 1) {
                        ssi.ColumnField = "StatIndicator:" + ssi.StatType.toLowerCase() + "(" + ssi.Field + ")," + ssi.ColumnFilter;
                        AddStatIndicatorToSchema(ssi, nextcol.ColumnTitle);
                    }
                    this.ListLeafColumnsIndicator.add(ssi);
                }
            }
        } else {
            this.ListLeafColumnsIndicator.addAll(this.ListIndicator);
            for (StatIndicator si : this.ListLeafColumnsIndicator) {
                si.ColumnField = "StatIndicator:" + si.StatType.toLowerCase() + "(" + si.Field + "),";
                AddStatIndicatorToSchema(si, null);
            }
        }
    }

    void AddStatIndicatorToSchema(StatIndicator si, Map parent) {
        Map columnTitle = null;
        if (!StatIndicator.E_StatType.Value.name().equalsIgnoreCase(si.StatType)) {
            if (StatIndicator.E_StatType.Count.name().equalsIgnoreCase(si.StatType)) {
                columnTitle = dtSchema.CreateColumnTitleMap(si.ColumnField, si.DisplayName, true, Integer.class, parent);
            } else {
                columnTitle = dtSchema.CreateColumnTitleMap(si.ColumnField, si.DisplayName, true, Double.class, parent);
            }
        } else {
            columnTitle = dtSchema.CreateColumnTitleMap(si.ColumnField, si.DisplayName, true, String.class, parent);
        }
        if (columnTitle != null) {
            columnTitle.put("align", "center");
        }
    }

    void InitStatDimenstion() {
        for (StatDimension sd : this.ListRowDimension) {
            if (this.dtdata.DataSchema != null && Date.class.equals(this.dtdata.DataSchema.get(sd.Field))) {
                if (StatDimension.E_DateType.Day.name().equalsIgnoreCase(sd.DateType)) {
                    for (Map m : dtdata.Data) {
                        Date date = TypeConvert.ToDate(m.get(sd.Field));
                        if (date != null) {
                            String day = DateUtil.GetString年月日(date);
                            m.put(sd.Field + sd.DateType.toLowerCase(), day);
                        }
                    }
                    this.statFields.add(sd.Field + sd.DateType.toLowerCase());
                } else if (StatDimension.E_DateType.Week.name().equalsIgnoreCase(sd.DateType)) {
                    for (Map m : dtdata.Data) {
                        Date date = TypeConvert.ToDate(m.get(sd.Field));
                        if (date != null) {
                            String Week = DateUtil.GetString年周(date);
                            m.put(sd.Field + sd.DateType.toLowerCase(), Week);
                        }
                    }
                    this.statFields.add(sd.Field + sd.DateType.toLowerCase());
                } else if (StatDimension.E_DateType.Month.name().equalsIgnoreCase(sd.DateType)) {
                    for (Map m : dtdata.Data) {
                        Date date = TypeConvert.ToDate(m.get(sd.Field));
                        if (date != null) {
                            String Month = DateUtil.GetString年月(date);
                            m.put(sd.Field + sd.DateType.toLowerCase(), Month);
                        }
                    }
                    this.statFields.add(sd.Field + sd.DateType.toLowerCase());
                } else if (StatDimension.E_DateType.Quarter.name().equalsIgnoreCase(sd.DateType)) {
                    for (Map m : dtdata.Data) {
                        Date date = TypeConvert.ToDate(m.get(sd.Field));
                        if (date != null) {
                            String Month = DateUtil.GetString年季(date);
                            m.put(sd.Field + sd.DateType.toLowerCase(), Month);
                        }
                    }
                    this.statFields.add(sd.Field + sd.DateType.toLowerCase());
                } else if (StatDimension.E_DateType.Year.name().equalsIgnoreCase(sd.DateType)) {
                    for (Map m : dtdata.Data) {
                        Date date = TypeConvert.ToDate(m.get(sd.Field));
                        if (date != null) {
                            String Year = DateUtil.GetString年(date);
                            m.put(sd.Field + sd.DateType.toLowerCase(), Year);
                        }
                    }
                    this.statFields.add(sd.Field + sd.DateType.toLowerCase());
                }
            } else {
                this.statFields.add(sd.Field);
            }
        }
    }

    /**
     * 运行统计查询
     *
     * @param query 查询模型
     * @return 运行结果
     * @throws Exception 异常
     */
    public DataTable GetResultList(BaseQuery query) throws Exception {
        DataTable dtresult = this.GetResultTreeList(query);
        int maxlevel = this.statFields.size() - 1;
        List<Map> ldelete = new ArrayList<>();
        for (Map m : dtresult.Data) {
            int level = TypeConvert.ToInteger(m.get(DimLevelID));
            if (level != maxlevel) {
                ldelete.add(m);
            }
        }
        for (Map m : ldelete) {
            dtresult.Data.remove(m);
        }
        return dtresult;
    }

    /**
     * 运行统计查询
     *
     * @param query 查询模型
     * @return 运行结果
     * @throws Exception 异常
     */
    public DataTable GetResultTreeList(BaseQuery query) throws Exception {
        if (this.ListIndicator == null) {
            return null;
        }
        if (this.ListRowDimension == null) {
            return this.GetResultValues(query);
        }
        this.query = query;
        this.dtdata = this.GetData(query);

        this.InitStatSchema();

        this.InitStatDimenstion();
        DataTable dt = this.run(new StatRunnable() {
            @Override
            public void forEachRow(boolean isFirst, int order, int level, String column, Map<String, Object> mapResult, Map<String, Object> mapData, DataTable dtResult) throws Exception {
                mapResult.put(column, mapData.get(column));
                if (level + 1 == statFields.size()) {
                    mapResult.put("IsTreeLeaf", 1);
                } else {
                    mapResult.put("IsTreeLeaf", 0);
                }
                mapResult.put("TreeLevel", level);
                if (isFirst) {
                    for (StatIndicator si : ListIndicator) {
                        if (StatIndicator.E_StatType.Value.name().equalsIgnoreCase(si.StatType)) {
                            mapResult.put(si.Field, mapData.get(si.Field));
                        }
                    }
                }
                CalStatIndicatorResult(mapData, mapResult);
            }
        });
        List<Map> leafColMaps = dt.GetLeafColumnTitleMaps();
        for (Map col : leafColMaps) {
            boolean isnull = true;
            for (Map m : dt.Data) {
                if (m.get(col.get(dt.Col_field)) != null) {
                    isnull = false;
                }
            }
            if (isnull) {
                dt.DeleteColumnTitleMap(col);
            }
        }
        return dt;
    }

    void CalStatIndicatorResult(Map mapData, Map mapResult) {
        for (StatIndicator si : this.ListLeafColumnsIndicator) {
            boolean can = true;
            String field = si.Field;
            if (StrUtil.isNotEmpty(si.ColumnField)) {
                field = si.ColumnField;
            }
            if (StrUtil.isNotEmpty(si.ColumnFilter)) {
                can = dtdata.CheckMapCond(mapData, si.ColumnFilter);
            }
            if (can) {
                if (StatIndicator.E_StatType.Count.name().equalsIgnoreCase(si.StatType)) {
                    mapResult.put(field, TypeConvert.ToInteger(mapResult.get(field)) + 1);
                } else if (StatIndicator.E_StatType.Sum.name().equalsIgnoreCase(si.StatType)) {
                    mapResult.put(field, DoubleUtil.add(TypeConvert.ToDouble(mapResult.get(field)), TypeConvert.ToDouble(mapData.get(si.Field))));
                } else if (StatIndicator.E_StatType.Max.name().equalsIgnoreCase(si.StatType)) {
                    double d = TypeConvert.ToDouble(mapData.get(si.Field));
                    if (mapResult.get(field) == null) {
                        mapResult.put(field, d);
                    } else {
                        double r = TypeConvert.ToDouble(mapResult.get(field));
                        if (r < d) {
                            mapResult.put(field, r);
                        }
                    }
                } else if (StatIndicator.E_StatType.Min.name().equalsIgnoreCase(si.StatType)) {
                    double d = TypeConvert.ToDouble(mapData.get(si.Field));
                    if (mapResult.get(field) == null) {
                        mapResult.put(field, d);
                    } else {
                        double r = TypeConvert.ToDouble(mapResult.get(field));
                        if (r > d) {
                            mapResult.put(field, r);
                        }
                    }
                } else if (StatIndicator.E_StatType.Avg.name().equalsIgnoreCase(si.StatType)) {
                    mapResult.put(field + "count", TypeConvert.ToInteger(mapResult.get(field + "count")) + 1);
                    mapResult.put(field + "sum", DoubleUtil.add(TypeConvert.ToDouble(mapResult.get(field + "sum")), TypeConvert.ToDouble(mapData.get(si.Field))));
                    mapResult.put(field, DoubleUtil.divide(TypeConvert.ToDouble(mapResult.get(field + "sum")), TypeConvert.ToDouble(mapResult.get(field + "count")), 2));
                }
            }
        }
    }

    /**
     * 运行统计查询
     *
     * @param query 查询模型
     * @return 运行结果
     * @throws Exception 异常
     */
    public DataTable GetResultValues(BaseQuery query) throws Exception {
        this.query = query;
        this.dtdata = this.GetData(query);
        this.InitStatSchema();
        DataTable dt = this.GetSchema();
        for (Map mapData : dtdata.Data) {
            Map mapResult = dt.NewRow();
            for (StatIndicator si : this.ListIndicator) {
                if (StatIndicator.E_StatType.Value.name().equalsIgnoreCase(si.StatType)) {
                    mapResult.put(si.DisplayName, mapData.get(si.Field));
                }
            }
            CalStatIndicatorResult(mapData, mapResult);
        }
        return dt;
    }


    /**
     * 运行统计查询
     *
     * @param query 查询模型
     * @return 运行结果
     * @throws Exception 异常
     */
    public DataTable GetResultDetailList(BaseQuery query, StatResultValue value) throws Exception {
        this.query = query;
        Long PageIndex = query.PageIndex;
        Long PageSize = query.PageSize;
        query.PageIndex = -1L;
        query.PageSize = -1L;
        this.dtdata = this.GetData(query);
        query.PageIndex = PageIndex;
        query.PageSize = PageSize;
        this.InitStatSchema();
        DataTable dt = new DataTable();
        dt.DataColumns = this.dtdata.DataColumns;
        for (Map col : dt.DataColumns) {
            col.put("visible", true);
        }
        for (Map mapData : dtdata.Data) {
            if (dtdata.CheckMapCond(mapData, value.ColumnFilter) && dtdata.CheckMapCond(mapData, value.RowFilter)) {
                dt.AddRow(mapData);
            }
        }
        return dt;
    }
}
