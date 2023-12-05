package com.anzhilai.core.base;

import com.anzhilai.core.database.AjaxResult;
import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.DoubleUtil;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class BaseModelTree extends BaseModel {
    public static final String RootParentId = "0";
    public static final String TreePathSplit = "/";

    public static final String F_Children = "children";
    public static final String F_Parent = "parent";
    public static final String F_Parentids = "Parentids";

    @XColumn
    @XIndex
    public String Parentid;
    public static final String F_Parentid = "Parentid";

    @Column(name = F_Parentid)
    public String getParentid() {
        return Parentid;
    }

    public void setParentid(String value) {
        this.Parentid = value;
    }

    BaseModelTree parent;

    public BaseModelTree GetParent() throws SQLException {
        if (parent == null) {
            parent = GetObjectById(this.getClass(), this.Parentid);
        }
        return parent;
    }

    //TreePath是树的一个重要属性,会带来很大便利,任何树的数据都有存这个属性,但主要作为冗余字段存在
    @XColumn(length = 1000)
    @XIndex
    public String TreePath;
    public static final String F_TreePath = "TreePath";

    @XColumn(length = 1000)
    @XIndex
    public String TreeName;
    public static final String F_TreeName = "TreeName";

    //0000001，0000001000002，0000011，这样的结构才能排序清楚吧
    @XColumn(length = 1000)
    @XIndex
    public String TreeOrder;
    public static final String F_TreeOrder = "TreeOrder";

    //树的层级，供查询使用
    @XColumn
    @XIndex
    public int TreeLevel;
    public static final String F_TreeLevel = "TreeLevel";

    @XColumn
    public int IsTreeLeaf = 1;
    public final static String F_IsTreeLeaf = "IsTreeLeaf";

    public Boolean IsRoot() {
        return RootParentId.equals(this.Parentid);
    }

    public String GetNameField() {
        return "";
    }

    public boolean IsDefaultAscOrder() {
        return true;
    }


    public SqlInfo GetOrderCond() throws SQLException {
        BaseModelTree parent = GetParent();
        if (parent != null) {
            return new SqlInfo().WhereLike(F_TreePath).AddParam(parent.TreePath + "%");
        }
        return null;
    }

    @Override
    public void Save() throws Exception {
        if (StrUtil.isEmpty(this.getParentid())) this.setParentid(RootParentId);
        this.SaveTreeValidate();
        boolean isNew = this.IsNew();
        BaseModelTree old = null;
        if (isNew) {
            this.id = GetUniqueId();
        } else {
            old = GetObjectById(this.getClass(), this.id);
        }
        BaseModelTree pjg = GetParent();
        String nameField = GetNameField();
        String orderField = GetDefaultOrderField();

        if (pjg != null) {
            if ((pjg.TreePath + "/").contains("/" + this.id + "/")) {
                throw new XException(this.GetValue(nameField) + "的父节点不能选择自己或者下级!");
            }
            pjg.Update(BaseModelTree.F_IsTreeLeaf, 0);
            if (StrUtil.isNotEmpty(nameField)) {
                this.TreeName = pjg.TreeName + TreePathSplit + this.GetValue(nameField);
            }
            this.TreePath = pjg.TreePath + TreePathSplit + this.id;
            this.TreeLevel = pjg.TreeLevel + 1;
        } else {
            if (StrUtil.isNotEmpty(nameField)) {
                this.TreeName = TreePathSplit + this.GetValue(nameField);
            }
            this.TreePath = TreePathSplit + this.id;
            this.TreeLevel = 0;
        }
        if (!isNew) {
            if (old != null && StrUtil.isNotEmpty(old.TreePath)) {
                if (!old.TreePath.equals(this.TreePath)) {
                    int level = this.TreeLevel - old.TreeLevel;
                    String table = GetTableName(this.getClass());
                    SqlInfo su = new SqlInfo().CreateUpdate(table);
                    su.Set(BaseModelTree.F_TreeLevel + "=" + table + "." + BaseModelTree.F_TreeLevel + "+" + level);
                    su.Append(BaseModelTree.F_TreePath + " = REPLACE(" + table + "." + BaseModelTree.F_TreePath + ",?,?)").AddParam(old.TreePath + "/").AddParam(this.TreePath + "/");
                    if (StrUtil.isNotEmpty(nameField)) {
                        su.Append(BaseModelTree.F_TreeName + " = REPLACE(" + table + "." + BaseModelTree.F_TreeName + ",?,?)").AddParam(old.TreeName + "/").AddParam(this.TreeName + "/");
                    }
                    su.Where(table + "." + BaseModelTree.F_TreePath + " like ?").AddParam(old.TreePath + "/%");

                    BaseQuery.ExecuteSql(su);
                } else {    //修改所有的下级
                    if (StrUtil.isNotEmpty(nameField) && !this.TreeName.equals(old.TreeName)) {
                        String table = GetTableName(this.getClass());
                        SqlInfo su = new SqlInfo().CreateUpdate(table);
                        su.Set(BaseModelTree.F_TreeName + " = REPLACE(" + table + "." + BaseModelTree.F_TreeName + ",?,?)").AddParam(old.TreeName + "/").AddParam(this.TreeName + "/");
                        su.Where(table + "." + BaseModelTree.F_TreePath + " like ?").AddParam(old.TreePath + "/%");

                        BaseQuery.ExecuteSql(su);
                    }
                }
            }
        }

        super.Save();

        if (old != null && StrUtil.isNotEqual(this.Parentid, old.Parentid)) {
            BaseModelTree oldpjg = GetObjectById(this.getClass(), old.Parentid);
            if (oldpjg != null) {
                if (!oldpjg.HasChildren()) {
                    oldpjg.Update(BaseModelTree.F_IsTreeLeaf, 1);
                }
            }

        }
    }

    public AjaxResult SaveTreeValidate() throws Exception {

        if (Parentid.equals(id)) {
            throw new XException("自己不能做自己的父节点!");
        }
        String err = "";
        List<Map> listunique = this.GetListUniqueFieldAndValues();
        if (listunique.size() > 0) {
            for (Map f : listunique) {
                if (!f.containsKey(F_Parentid)) {
                    f.put(F_Parentid, this.getParentid());
                }
                if (!this.IsUnique(f)) {
                    err = f + "已存在";
                    break;
                }
            }
        }
        if (StrUtil.isNotEmpty(err)) {
            throw new XException(err);
        }
        return AjaxResult.True();
    }

    @Override
    public boolean Delete() throws Exception {
        if (StrUtil.isEmpty(Parentid)) {
            BaseModel old = GetObjectById(getClass(), id);
            if (old != null) {
                this.SetValuesByMap(old.ToMap());
            } else {
                return false;
            }
        }
        // 这里不直接批量删除子类第一是因为要递归向下删除,且删除之前要进行是否可删除的校验.
        String table = GetTableName(this.getClass());

        SqlInfo su = new SqlInfo().CreateSelect().AppendColumn(table, F_id).From(table).WhereEqual(F_Parentid).AddParam(this.id);
        DataTable dt = BaseQuery.ListSql(su, null);
        for (Map m : dt.Data) {
            BaseModelTree model = TypeConvert.CreateNewInstance(this.getClass());
            model.id = (TypeConvert.ToString(m.get(F_id)));
            model.Delete();
        }
        boolean ret = super.Delete();
        if (ret && !RootParentId.equals(Parentid)) {      //将父级设为叶子节点
            SqlInfo su2 = new SqlInfo().CreateSelect();
            su2.AppendCountColumn(table, F_id, F_id);
            su2.From(table);
            su2.Where(F_Parentid + "=?").AddParam(Parentid);
            if (BaseQuery.LongSql(su2) == 0) {
                BaseModelTree model = TypeConvert.CreateNewInstance(this.getClass());
                model.id = (Parentid);
                model.Update(BaseModelTree.F_IsTreeLeaf, 1);
            }
        }
        return ret;
    }

    public double GetMaxValue(SqlInfo sqlWhere) throws SQLException {
        String orderField = GetDefaultOrderField();
        double order = 0;
        int addNum = 1;
        if (StrUtil.isNotEmpty(orderField)) {
            BaseModelTree parent = this.GetParent();
            String table = GetTableName(this.getClass());
            SqlInfo su = new SqlInfo().CreateSelect(" max(" + orderField + ") ").From(table);
            if (sqlWhere != null) {
                su.Where(sqlWhere.ToWhere()).AddParams(sqlWhere.GetParamsList());
            } else {
                if (parent != null) {
                    su.WhereLike(F_TreePath).AddParam(parent.TreePath);
                }
            }
            Object value = BaseQuery.ObjectSql(su);
            if (value != null) {//获取当前节点内的最大值
                order = TypeConvert.ToDouble(value);
                //比最大值大的序号
                SqlInfo si = new SqlInfo().CreateSelect().AppendColumn(table, GetDefaultOrderField()).From(table);
                si.Where(GetDefaultOrderField() + ">?").AddParam(order);
                si.AppendOrderBy(table, GetDefaultOrderField(), true);
                si.AppendLimitOffset(1, 0);
                value = BaseQuery.ObjectSql(si);
                if (value != null) {
                    double d = TypeConvert.ToDouble(value);
                    order = DoubleUtil.divide(DoubleUtil.add(d, order), 2d, 10000);
                    addNum = 0;
                }
            }
        }
        if (addNum > 0) {
            order = Math.ceil(order) + addNum;
        }
        return order;
    }

    private int get10Pow(int value) {
        int ret = 10;
        while (true) {
            if (value < ret) {
                break;
            }
            ret *= 10;
        }
        return ret;
    }

    public void AppendChild(BaseQuery bq, BaseModelTree model) throws Exception {
        model.Parentid = this.id;
        double order = model.GetMaxNextOrderNum();
        model.SetValue(model.GetDefaultOrderField(), order);
        model.Save();
        boolean isAsc = IsDefaultAscOrder();
        //查询子节点列表
        String table = GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateSelect();
        su.AppendColumn(table, F_id);
        su.From(table);
        su.WhereLike(F_TreePath).AddParam(model.TreePath + "/%");
        su.AppendOrderBy(table, GetDefaultOrderField(), isAsc);
        DataTable dt = BaseQuery.ListSql(su, null);
        SqlInfo si = new SqlInfo().CreateSelect().AppendColumn(table, GetDefaultOrderField()).From(table);
        if (isAsc) {
            si.Where(GetDefaultOrderField() + ">?").AddParam(order);
        } else {
            si.Where(GetDefaultOrderField() + "<?").AddParam(order);
        }
        si.AppendOrderBy(table, GetDefaultOrderField(), !isAsc);
        si.AppendLimitOffset(1, 0);
        Object obj = bq.ObjectSql(si);
        double d = order + get10Pow(dt.Data.size() + 2) * 100;
        if (obj != null) {
            d = TypeConvert.ToDouble(obj);
        }
        double diff = DoubleUtil.divide(DoubleUtil.sub(d, order), (double) get10Pow(dt.Data.size() + 2), 10000);
        String _id = this.id;
        int num = 1;
        for (Map<String, Object> row : dt.Data) {
            double orderNum = 0;
            if (isAsc) {
                orderNum = DoubleUtil.add(order, diff * num);
            } else {
                orderNum = DoubleUtil.sub(order, diff * num);
            }
            this.id = TypeConvert.ToString(row.get(F_id));
            this.Update(this.GetDefaultOrderField(), orderNum);
            num++;
        }
        this.id = _id;
    }

    //树是升序排序
    public void MoveOrderBefore(BaseQuery bq, BaseModel target) throws Exception {
        double targetNum = TypeConvert.ToDouble(target.GetValue(target.GetDefaultOrderField()));
        boolean isAsc = IsDefaultAscOrder();
        //查询树列表
        String table = GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateSelect();
        su.AppendColumn(table, F_id);
        su.From(table);
        su.WhereLike(F_TreePath).AddParam(this.TreePath + "%");
        su.AppendOrderBy(table, GetDefaultOrderField(), isAsc);
        DataTable dt = BaseQuery.ListSql(su, null);
        SqlInfo si = new SqlInfo().CreateSelect().AppendColumn(table, GetDefaultOrderField()).From(table);
        if (isAsc) {
            si.Where(GetDefaultOrderField() + "<?").AddParam(targetNum);
        } else {
            si.Where(GetDefaultOrderField() + ">?").AddParam(targetNum);
        }
        si.AppendOrderBy(table, GetDefaultOrderField(), !isAsc);
        si.AppendLimitOffset(1, 0);
        Object value = bq.GetValue(si);
        double m = 0;
        if (isAsc) {
            m = DoubleUtil.sub(targetNum, 100d);
        } else {
            m = DoubleUtil.add(targetNum, 100d);
        }
        if (value != null) {
            m = TypeConvert.ToDouble(value);
        }
        //等分多少份
        double diff = DoubleUtil.divide(DoubleUtil.sub(targetNum, m), (double) get10Pow(dt.Data.size() + 2), 10000);
        String _id = this.id;
        int num = 1;
        for (Map<String, Object> row : dt.Data) {
            this.id = TypeConvert.ToString(row.get(F_id));
            double orderNum = 0;
            if (isAsc) {
                orderNum = DoubleUtil.add(m, diff * num);
            } else {
                orderNum = DoubleUtil.sub(m, diff * num);
            }
            this.Update(this.GetDefaultOrderField(), orderNum);
            if (_id.equals(this.id)) {
                this.SetValue(this.GetDefaultOrderField(), orderNum);
            }
            num++;
        }
        this.id = _id;
    }

    //继承,多态
    public Map<String, Object> GetTreeList(HttpServletRequest request) throws Exception {
        BaseQuery qm = CreateQueryModel();
        qm.InitFromRequest(request);
        Map<String, Object> m = new HashMap<>();
        String id = TypeConvert.ToString(RequestUtil.GetParameter(request, F_id));
        if (StrUtil.isNotEmpty(id)) {
            qm.id = id;
            DataTable dt = this.GetList(qm);
            if (dt.Data.size() > 0) {
                m.put("id" + id, dt.Data.get(0));
            }
        }
        String pid = TypeConvert.ToString(RequestUtil.GetParameter(request, F_Parentid));
        if (StrUtil.isNotEmpty(pid)) {
            qm.id = "";
            qm.Parentid = pid;
            qm.NotPagination();
            DataTable dt = this.GetList(qm);
            m.put(pid, dt.Data);
        }
        String[] pids = (String[]) TypeConvert.ToType(String[].class, RequestUtil.GetParameter(request, F_Parentids));
        if (pids != null) {
            for (String s : pids) {
                qm.id = "";
                qm.Parentid = s;
                qm.Parentids = null;
                qm.NotPagination();
                DataTable dt = this.GetList(qm);
                m.put(s, dt.Data);
            }
        }
        return m;
    }

    public DataTable GetListChildren() throws Exception {
        if (this.HasChildren()) {
            BaseQuery bq = this.CreateQueryModel();
            bq.Parentid = this.id;
            return this.GetList(bq);
        }
        return new DataTable();
    }

    public boolean HasChildren() throws SQLException {
        String table = GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateSelect().AppendColumn(table, F_id).From(table).WhereEqual(F_Parentid).AddParam(this.id).AppendLimitOffset(1, 0);
        DataTable dt = BaseQuery.ListSql(su, null);
        return dt.Data.size() > 0;
    }

    public DataTable GetTreePathInfo(String id) throws Exception {
        DataTable dt = new DataTable();
        BaseModelTree info = GetObjectById(this.getClass(), id);
        if (info != null) {
            String treepath = info.TreePath;
            String[] trees = treepath.split(TreePathSplit);
            for (String t : trees) {
                BaseModelTree bmt = GetObjectById(this.getClass(), t);
                if (bmt != null) {
                    dt.AddRow(bmt.ToMap());
                }
            }
        }
        return dt;
    }

    public static <T extends BaseModelTree> T GetObjectByTreePath(Class<T> type, String treePath) throws Exception {
        if (StrUtil.isEmpty(treePath)) {
            return null;
        }
        String[] ids = treePath.split(BaseModelTree.TreePathSplit);
        if (ids.length > 0) {
            return GetObjectById(type, ids[ids.length - 1]);
        }
        return null;
    }

    public static int GetMaxLevelFromTreeTable(DataTable dt) {
        int maxlevel = 1;
        for (Map m : dt.Data) {
            int l = TypeConvert.ToInteger(m.get(BaseModelTree.F_TreeLevel));
            if (maxlevel < l) {
                maxlevel = l;
            }
        }
        maxlevel = maxlevel + 1;
        return maxlevel;
    }

    public void SetParentRowsForQueryTree(DataTable dt) throws Exception {
        HashMap hash = new HashMap();
        for (Map m : dt.Data) {
            String treepath = TypeConvert.ToString(m.get(BaseModelTree.F_TreePath));
            String[] trees = treepath.split(BaseModelTree.TreePathSplit);
            for (String t : trees) {
                if (!hash.containsKey(t) && dt.GetRowByIDField(t) == null) {
                    BaseModelTree bmt = (BaseModelTree) GetObjectById(this.getClass(), t);
                    if (bmt != null) {
                        dt.AddRow(bmt.ToMap());
                    }
                    hash.put(t, bmt);
                }
            }
        }
    }

    //    @Override
    public String ImportFromExcelCustomSetValue(HttpServletRequest request, Map excelDataRow) throws Exception {
        String 上级列名 = TypeConvert.ToTypeValue(String.class, RequestUtil.GetParameter(request, "上级列名"));
        if (StrUtil.isNotEmpty(上级列名)) {
            BaseModel p = GetObjectByFieldValue(this.getClass(), 上级列名, excelDataRow.get(上级列名));
            if (p != null) {
                this.Parentid = p.id;
            } else {
                return "上级列名:" + 上级列名 + excelDataRow.get(上级列名) + "不存在";
            }
        }
        return "";
    }

}
