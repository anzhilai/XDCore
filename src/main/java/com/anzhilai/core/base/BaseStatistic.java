package com.anzhilai.core.base;

import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.toolkit.StrUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * 基础统计类
 */
public abstract class BaseStatistic {

    public static String DimID = "id";
    public static String DimParentID = "Parentid";
    public static String DimLevelID = "DimLevelID";
    public static String DimParentFilterID = "DimParentFilterID";
    public static String DimFilterID = "DimFilterID";
    public static String DimIsAddRow = "DimIsAddRow";
    public static String DimIsLeaf = "DimIsLeaf";

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
     * @param _dtdata 数据表
     */
    public BaseStatistic(DataTable _dtdata) {
        this.dtdata = _dtdata;
    }
    /**
     * 带多个参数的构造函数
     * @param _dtdata 数据表
     * @param _listField 统计属性列表
     */
    public BaseStatistic(DataTable _dtdata, List<String> _listField) {
        this.dtdata = _dtdata;
        statFields = _listField;
    }
    /**
     * 获取要统计的数据表
     * @return 数据表
     */
    public DataTable GetData(){
        return this.dtdata;
    }
    /**
     * 设置要统计的数据表
     * @param dt 数据表
     */
    public void SetData(DataTable dt){
        this.dtdata = dt;
    }
    /**
     * 创建内置的查询模型
     * @param <T> 查询模型类型
     * @return 查询模型
     */
    public <T extends BaseQuery> T CreateQueryModel() {
        return null;
    }
    protected BaseQuery query;

    /**
     * 根据维度获取过滤条件
     * @param dim 维度
     * @param dimColumns 维度属性列表
     * @param mapdata 数据映射
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
     * @param column 字段名
     * @return 树的名称字段名
     */
    public String GetTreeNameField(String column) {
        return column + "Name";
    }

    /**
     * 从树形数据中扩展数据
     * @param dtdata 数据表
     * @param treeField 树字段
     * @param dttree 树形数据表
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


    /**
     * 运行统计查询
     * @param query 查询模型
     * @return 运行结果
     * @throws Exception 异常
     */
    public DataTable run(BaseQuery query) throws Exception {
        this.query = query;
        this.dtdata = this.GetData(query);
        return this.run();
    }

    protected HashMap<String, Map<String, Object>> hashdata = new HashMap<>();
    protected HashMap<String, Integer> hashorder = new HashMap<>();
    /**
     * 运行统计查询
     * @return 运行结果
     * @throws Exception 异常
     */
    public DataTable run() throws Exception {
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
                        NotContainsMethod(rootorder, dim, c, newrow, mapdata, dtresult);
                        if (IsAddRow(newrow)) {
                            newrow.put(DimIsAddRow, true);
                            dtresult.AddRow(newrow);
                            rootorder++;
                            hashorder.put(f, 1);
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
                        NotContainsMethod(ord, dim, c, newrow, mapdata, dtresult);
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
                    ContainsMethod(c, oldrow, mapdata);
                }
                dim++;

            }
            ForEachRow(mapdata);
        }
        AfterRun(dtresult);
        return dtresult;
    }

    /**
     * 获取数据架构（表头）
     * @return 数据架构
     * @throws Exception 异常
     */
    protected DataTable GetSchema() throws Exception {
        DataTable dt = new DataTable();
        return dt;
    }
    /**
     * 创建新的行
     * @return 新的行数据
     * @throws Exception 异常
     */
    public Map CreateNewRow() throws Exception {
        return null;
    }
    /**
     * 获取数据
     * @param query 查询模型
     * @return 数据表
     * @throws Exception 异常
     */
    public DataTable GetData(BaseQuery query) throws Exception {
        return this.dtdata;
    }
    /**
     * 从请求中创建查询模型
     * @param request Http请求
     * @throws Exception 异常
     */
    public void CreateQueryModelFromRequest(HttpServletRequest request) throws Exception {}


    /**
     * 判断是否是统计行
     * @param map 数据映射
     * @return 是否是统计行的布尔值
     */
    protected boolean IsStatisticRow(Map<String, Object> map) {
        return true;
    }
    /**
     * 判断是否添加行
     * @param row 数据行
     * @return 是否添加行的布尔值
     */
    protected boolean IsAddRow(Map<String, Object> row) {
        return true;
    }
    /**
     * 遍历数据行
     * @param map 数据映射
     */
    protected void ForEachRow(Map<String, Object> map) {
    }
    /**
     * 判断是否删除行
     * @param map 数据映射
     * @return 是否删除行的布尔值
     */
    protected boolean IsRowDelete(Map<String, Object> map) {
        return false;
    }
    /**
     * 统计结果运行后的操作
     * @param dtresult 统计结果数据表
     */
    protected void AfterRun(DataTable dtresult) {
        List<Map> ldelete = new ArrayList<>();
        for (Map m : dtresult.Data) {
            m.remove(DimFilterID);
            m.remove(DimParentFilterID);
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
     * @param order 排序值
     * @param level 层级
     * @param column 字段名
     * @param mapresult 映射结果
     * @param mapdata 映射数据
     * @param dtresult 数据结果
     */
    protected void NotContainsMethod(int order, int level, String column, Map<String, Object> mapresult, Map<String, Object> mapdata, DataTable dtresult) {
    }
    /**
     * 遍历统计数据时再一次遇到同样的值
     * @param column 字段名
     * @param mapresult 映射结果
     * @param mapdata 映射数据
     */
    protected void ContainsMethod(String column, Map<String, Object> mapresult, Map<String, Object> mapdata) {
    }
    /**
     * 按字段格式化哈希表
     * @param dt 数据表
     * @param nameField 名称字段
     * @return 格式化后的哈希表
     */
    public Map<String, List> FormatHashByField(DataTable dt, String nameField) {
        Map<String, List> map = new HashMap<>();
        List list = null;
        for (Map row : dt.Data) {
            int level = TypeConvert.ToInteger(row.get(DimLevelID));
            if (level == 0) {
                String name = TypeConvert.ToString(row.get(nameField));
                list = new ArrayList();
                map.put(name, list);
            }
            if (list != null) {
                list.add(row);
            }
        }
        return map;
    }

    /**
     * 按年月日格式化列表
     * @param dt 数据表
     * @param nameField 名称字段
     * @param begin 开始日期
     * @param end 结束日期
     * @return 格式化后的数据表
     * @throws Exception 异常
     */
    public DataTable FormatList年月日(DataTable dt, String nameField, Date begin, Date end) throws Exception {
        DataTable dtresult = this.GetSchema();
        Map<String, List> map = FormatHashByField(dt, nameField);
        for (Date t = begin; DateUtil.HasBefore(t, end); t = DateUtil.AddDay(t, 1)) {
            String nyr = DateUtil.GetString年月日(t);
            FormatAddRow(map, dtresult, dt, nameField, nyr);
        }
        return dtresult;
    }
    /**
     * 按年月格式化列表
     * @param dt 数据表
     * @param nameField 名称字段
     * @param begin 开始日期
     * @param end 结束日期
     * @return 格式化后的数据表
     * @throws Exception 异常
     */
    public DataTable FormatList年月(DataTable dt, String nameField, Date begin, Date end) throws Exception {
        DataTable dtresult = this.GetSchema();
        Map<String, List> map = FormatHashByField(dt, nameField);
        for (Date t = DateUtil.getFirstOfMonth(begin); DateUtil.HasBefore(t, end); t = DateUtil.AddMonth(t, 1)) {
            String nyr = DateUtil.GetString年月(t);
            FormatAddRow(map, dtresult, dt, nameField, nyr);
        }
        return dtresult;
    }
    /**
     * 按年格式化列表
     * @param dt 数据表
     * @param nameField 名称字段
     * @param begin 开始日期
     * @param end 结束日期
     * @return 格式化后的数据表
     * @throws Exception 异常
     */
    public DataTable FormatList年(DataTable dt, String nameField, Date begin, Date end) throws Exception {
        DataTable dtresult = this.GetSchema();
        Map<String, List> map = FormatHashByField(dt, nameField);
        for (Date t = DateUtil.getFirstOfMonth(begin); DateUtil.HasBefore(t, end); t = DateUtil.AddMonth(t, 12)) {
            String nyr = DateUtil.GetString年(t);
            FormatAddRow(map, dtresult, dt, nameField, nyr);
        }
        return dtresult;
    }
    /**
     * 按年月周格式化列表
     * @param dt 数据表
     * @param nameField 名称字段
     * @param begin 开始日期
     * @param end 结束日期
     * @return 格式化后的数据表
     * @throws Exception 异常
     */
    public DataTable FormatList年月周(DataTable dt, String nameField, Date begin, Date end) throws Exception {
        DataTable dtresult = this.GetSchema();
        Map<String, List> map = FormatHashByField(dt, nameField);
        String last = null;
        for (Date t = begin; DateUtil.HasBefore(t, end); t = DateUtil.AddDay(t, 1)) {
            String nyr = DateUtil.GetString年月周(t);
            if (nyr.equals(last)) {
                continue;
            }
            FormatAddRow(map, dtresult, dt, nameField, nyr);
            last = nyr;
        }
        return dtresult;
    }

    private void FormatAddRow(Map<String, List> map, DataTable dtresult, DataTable dt, String nameField, String nyr) throws Exception {
        List list = map.get(nyr);
        if (list != null) {
            dtresult.AddRows(list);
        } else {
            Map m = CreateNewRow();
            m.put(BaseModelTree.F_IsTreeLeaf, 1);
            m.put(DimID, BaseModel.GetUniqueId());
            m.put(DimLevelID, 0);
            m.put(DimParentID, "0");
            m.put(nameField, nyr);
            dtresult.AddRow(m);
        }
    }
    /**
     * 设置默认字段值
     * @param dt 数据表
     * @param field 字段名
     * @param defaultValue 默认值
     */
    public void SetDefaultFieldValue(DataTable dt, String field, String defaultValue) {
        Map<String, Object> info = new HashMap<>();
        info.put(field, defaultValue);
        this.SetDefaultFieldValue(dt, info);
    }
    /**
     * 设置默认字段值
     * @param dt 数据表
     * @param info 默认字段值映射
     */
    public void SetDefaultFieldValue(DataTable dt, Map<String, Object> info) {
        if (info == null) {
            return;
        }
        for (Map<String, Object> m : dt.Data) {
            for (String field : info.keySet()) {
                String value = TypeConvert.ToString(m.get(field));
                if (StrUtil.isEmpty(value)) {
                    m.put(field, info.get(field));
                }
            }
        }
    }
}
