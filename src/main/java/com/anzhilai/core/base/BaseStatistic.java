package com.anzhilai.core.base;

import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.toolkit.StrUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.*;


public class BaseStatistic {
    protected DataTable dtdata;  //排序好的数据
    public static String DimID = "id";
    public static String DimParentID = "Parentid";
    public static String DimLevelID = "DimLevelID";
    public static String DimParentFilterID = "DimParentFilterID";
    public static String DimFilterID = "DimFilterID";
    public static String DimIsAddRow = "DimIsAddRow";
    public static String DimIsLeaf = "DimIsLeaf";

    //按那些字段进行统计
    public List<String> statFields = new ArrayList<String>(); //统计属性列表

    public BaseStatistic() {
        this.dtdata = new DataTable();
    }

    public BaseStatistic(DataTable _dtdata) {
        this.dtdata = _dtdata;
    }

    public BaseStatistic(DataTable _dtdata, List<String> _listField) {
        this.dtdata = _dtdata;
        statFields = _listField;
    }

    public DataTable GetData(){
        return this.dtdata;
    }
    public void SetData(DataTable dt){
        this.dtdata = dt;
    }

    public <T extends BaseQuery> T CreateQueryModel() {
        return null;
    }

    public String getFilter(int dim, List<String> dimColumns, Map mapdata) {
        String f = "";
        for (int i = 0; i <= dim; i++) {
            String dcolumn = dimColumns.get(i);
            if (dcolumn.startsWith("tree")) {
                f += dcolumn + " and ";
            } else {
                String v = GetDataValue(mapdata, dcolumn);
                f += dcolumn + "='" + v + "' and ";
            }
        }
        f = StrUtil.CutEnd(f, " and ");
        return f;
    }

    public String GetTreeNameField(String column) {
        return column + "Name";
    }

    public String GetExtendDataTreeId(Map mapdata, String treeField) {
        return TypeConvert.ToString(mapdata.get(treeField));
    }

    public List<String> ExtendDataFromTree(DataTable dtdata, String treeField, DataTable dttree, String nameField, int treelevel) {
        List<String> extendFields = new ArrayList<>();

        for (int i = 0; i < treelevel; i++) {
            extendFields.add(treeField + i);
        }
        for (int j = dtdata.Data.size() - 1; j >= 0; j--) {
            Map<String, Object> mapdata = dtdata.Data.get(j);
            String treeid = GetExtendDataTreeId(mapdata, treeField);
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

    protected BaseQuery query;


    public DataTable run(BaseQuery query) throws Exception {
        this.query = query;
        this.dtdata = this.GetData(query);
        return this.run();
    }

    protected HashMap<String, Map<String, Object>> hashdata = new HashMap<>();
    protected HashMap<String, Integer> hashorder = new HashMap<>();

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

    /// <summary>
    /// 获取架构
    /// </summary>
    /// <returns></returns>
    protected DataTable GetSchema() throws Exception {
        DataTable dt = new DataTable();
        return dt;
    }

    public Map CreateNewRow() throws Exception {
        return null;
    }

    public DataTable GetData(BaseQuery query) throws Exception {
        return this.dtdata;
    }
    public void CreateQueryModelFromRequest(HttpServletRequest request) throws Exception {}
    public String GetDataValue(Map mapdata, String column) {
        return TypeConvert.ToString(mapdata.get(column));
    }

    protected boolean IsStatisticRow(Map<String, Object> map) {
        return true;
    }

    protected boolean IsAddRow(Map<String, Object> row) {
        return true;
    }

    protected void ForEachRow(Map<String, Object> map) {
    }

    protected boolean IsRowDelete(Map<String, Object> map) {
        return false;
    }

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

    protected void NotContainsMethod(int order, int level, String column, Map<String, Object> mapresult, Map<String, Object> mapdata, DataTable dtresult) {
    }

    protected void ContainsMethod(String column, Map<String, Object> mapresult, Map<String, Object> mapdata) {
    }

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

    public DataTable FormatList年月日(DataTable dt, String nameField, Date begin, Date end) throws Exception {
        DataTable dtresult = this.GetSchema();
        Map<String, List> map = FormatHashByField(dt, nameField);
        for (Date t = begin; DateUtil.HasBefore(t, end); t = DateUtil.AddDay(t, 1)) {
            String nyr = DateUtil.GetString年月日(t);
            FormatAddRow(map, dtresult, dt, nameField, nyr);
        }
        return dtresult;
    }

    public DataTable FormatList年月(DataTable dt, String nameField, Date begin, Date end) throws Exception {
        DataTable dtresult = this.GetSchema();
        Map<String, List> map = FormatHashByField(dt, nameField);
        for (Date t = DateUtil.getFirstOfMonth(begin); DateUtil.HasBefore(t, end); t = DateUtil.AddMonth(t, 1)) {
            String nyr = DateUtil.GetString年月(t);
            FormatAddRow(map, dtresult, dt, nameField, nyr);
        }
        return dtresult;
    }

    public DataTable FormatList年(DataTable dt, String nameField, Date begin, Date end) throws Exception {
        DataTable dtresult = this.GetSchema();
        Map<String, List> map = FormatHashByField(dt, nameField);
        for (Date t = DateUtil.getFirstOfMonth(begin); DateUtil.HasBefore(t, end); t = DateUtil.AddMonth(t, 12)) {
            String nyr = DateUtil.GetString年(t);
            FormatAddRow(map, dtresult, dt, nameField, nyr);
        }
        return dtresult;
    }

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

    public void SetDefaultFieldValue(DataTable dt, String field, String defaultValue) {
        Map<String, Object> info = new HashMap<>();
        info.put(field, defaultValue);
        this.SetDefaultFieldValue(dt, info);
    }

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
