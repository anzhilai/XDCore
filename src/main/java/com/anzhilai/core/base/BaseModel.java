package com.anzhilai.core.base;

import com.anzhilai.core.database.*;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.toolkit.DoubleUtil;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.toolkit.*;
import org.apache.log4j.Logger;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.*;
/**
 * 基础模型类，是所有数据模型的基类，提供公共的属性和方法。
 */
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class BaseModel {
    public static Logger log = Logger.getLogger(BaseModel.class);

    /**
     * 默认数据表的主键字段
     */
    @XColumn(name = F_id, unique = true, nullable = false, length = 128)
    public String id;
    public final static String F_id = "id";
    public final static String F_ids = "ids";
    /**
     * 获取id属性的值
     *
     * @return id属性的值
     */
    @Id
    @GeneratedValue(generator = "shortUid")
    @GenericGenerator(name = "shortUid", strategy = "com.anzhilai.core.database.ShortUUIDIncrementGenerator")
    @Column(name = F_id, unique = true, nullable = false, length = 128)
    public String getId() {
        return id;
    }
    /**
     * 设置id属性的值
     *
     * @param id id属性的值
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * 获得一个唯一id,一般用于生成id
     *
     * @return 唯一id
     */
    public static String GetUniqueId() {
        return ShortUUIDIncrementGenerator.getUUID();
    }

    /**
     * 判断这个对象是否被保存
     *
     * @return 若对象未保存则返回true，否则返回false
     */
    public boolean IsNew() {
        return StrUtil.isEmpty(id);
    }
    public static boolean IsNew(BaseModel bm) {
        return bm == null || bm.IsNew();
    }

    /**
     * 数据记录的创建时间，记录保存时会自动赋值
     */
    @XColumn
    @XIndex
    public Date CreateTime;
    public final static String F_CreateTime = "CreateTime";
    /**
     * 创建用户
     */
    @XColumn
    public String CreateUser;
    public final static String F_CreateUser = "CreateUser";
    /**
     * 更新时间
     */
    @XColumn
    public Date UpdateTime;
    public final static String F_UpdateTime = "UpdateTime";
    /**
     * 更新用户
     */
    @XColumn
    public String UpdateUser;
    public final static String F_UpdateUser = "UpdateUser";
    /**
     * 排序号
     */
    @XColumn
    @XIndex
    public Double OrderNum;
    public final static String F_OrderNum = "OrderNum";

    /**
     * 保存之前的校验
     *
     * @return 错误信息，若无错误则返回空字符串
     * @throws Exception
     */
    public String SaveValidate() throws Exception {
        return "";
    }

    /**
     * 删除之前的校验
     *
     * @return 错误信息，若无错误则返回空字符串
     * @throws Exception
     */
    public String DeleteValidate() throws Exception {
        return "";
    }

    /**
     * 创建统计模型
     *
     * @return 统计模型对象
     */
    public BaseStatistic CreateStatisticModel(){
        return null;
    }
    /**
     * 判断在其他表中是否有本记录的外键关联
     *
     * @param table  表名
     * @param field  字段名
     * @return 若在其他表中有外键关联则返回true，否则返回false
     * @throws SQLException
     */
    public boolean HasOtherTableValue(String table, String field) throws SQLException {
        SqlInfo su = new SqlInfo().CreateSelect().AppendColumn(table, F_id).From(table)
                .WhereEqual(field).AddParam(this.id).AppendLimitOffset(1, 0);
        DataTable dt = BaseQuery.ListSql(su, null);
        return dt.Data.size() > 0;
    }


    /**
     * 给对象的字段赋值
     *
     * @param columnName 字段名
     * @param value      字段值
     */
    public void SetValue(String columnName, Object value) {
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        if (!columnTypeMap.containsKey(columnName)) return;
        Field m = columnTypeMap.get(columnName);
        if (m != null) {
            try {
                m.setAccessible(true);
                m.set(this, TypeConvert.ToType(m.getType(), value, true));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 获取对象的值
     *
     * @param columnName 字段名
     * @return 字段的值
     */
    public Object GetValue(String columnName) {
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        if (!columnTypeMap.containsKey(columnName)) return null;
        Field m = columnTypeMap.get(columnName);
        if (m != null) {
            try {
                m.setAccessible(true);
                return m.get(this);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }
    /**
     * 外键
     */
    public static final String F_foreignKey = "foreignKey";
    /**
     * 外键表
     */
    public static final String F_foreignTable = "foreignTable";
    /**
     * 外键字段
     */
    public static final String F_foreignField = "foreignField";
    /**
     * 外键值
     */
    public static final String F_foreignValue = "foreignValue";
    /**
     * 字段，一般情况下标识本表的字段或者外键表的字段
     */
    public static final String F_columnField = "columnField";

    /**
     * 验证并设置字段的值
     *
     * @param columnField          字段名
     * @param value                字段值
     * @param allowNull            是否允许为空
     * @return 错误信息，若无错误则返回空字符串
     * @throws Exception
     */
    public String ValidateAndSetValue(String columnField, Object value, boolean allowNull) throws Exception {
        String err = "";
        // 若字段值为空且不允许为空，则返回错误信息
        if (!allowNull && (value == null || "".equals(value))) {
            return err;
        }
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        Field m = columnTypeMap.get(columnField);
        // 判断字段是否为空
        if (m != null) {
            Object vv = TypeConvert.ToType(m.getType(), value, true);
            // 若字段类型不是String，字段值不为空且不为空字符串，值为空时返回错误信息
            if (!String.class.equals(m.getType()) && value != null && !"".equals(value) && vv == null) {
                err += columnField + "数据类型错误\r\n";
            } else {
                m.setAccessible(true);
                m.set(this, vv);
            }
        }
        return err;
    }

    /**
     * 验证并设置外键字段的值
     *
     * @param foreignKey   外键字段名
     * @param value        外键值
     * @param foreignField 外键表的值对应的字段名，如xx名称
     * @return 错误信息，若无错误则返回空字符串
     * @throws Exception
     */
    public String ValidateAndSetForeignKeyValue(String foreignKey, Object value, String foreignField) throws Exception {
        String err = "";
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        Field m = columnTypeMap.get(foreignKey);
        if (m != null) {
            String v = null;
            if (StrUtil.isNotEmpty(value)) {
                String columnValue = TypeConvert.ToString(value);
                v = "";
                if (foreignKey.endsWith("s")) {
                    List<String> fvalues = new ArrayList<>();
                    columnValue = columnValue.replace("，", ",");
                    String[] fvs = StrUtil.split(columnValue, ",");
                    fvalues.addAll(Arrays.asList(fvs));
                    List<String> fkids = new ArrayList<>();
                    for (String fv : fvalues) {
                        BaseModel mm = GetForeignObjectByFieldValue(foreignKey, foreignField, fv);
                        if (mm == null) {
                            err += foreignField + "不存在" + fv + "\r\n";
                        } else {
                            fkids.add(mm.id);
                        }
                    }
                    v = StrUtil.join(fkids);
                } else {
                    BaseModel mm = GetForeignObjectByFieldValue(foreignKey, foreignField, columnValue);
                    if (mm == null) {
                        err += foreignField + "不存在" + columnValue + "\r\n";
                    } else {
                        v = mm.id;
                    }
                }
            }
            if (StrUtil.isEmpty(err)) {
                m.setAccessible(true);
                m.set(this, v);
            }
        } else {
            err += foreignKey+"不存在";
        }
        return err;
    }
    /**
     * 从外键字段关联的外键表中根据外键字段和值获取对应的外键对象
     *
     * @param foreignKey  外键字段
     * @param foreignField  外键表字段
     * @param value  外键值
     * @return 外键对象
     * @throws Exception
     */
    public BaseModel GetForeignObjectByFieldValue(String foreignKey, String foreignField, Object value) throws Exception {
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        Field m = columnTypeMap.get(foreignKey);
        XColumn xc = m.getAnnotation(XColumn.class);
        String foreignTable = xc.foreignTable();
        if (StrUtil.isEmpty(foreignTable)) {
            List<Map<String, String>> list = GetListForeignColumns();
            for (Map<String, String> mfc : list) {
                if (foreignKey.equals(mfc.get(F_foreignKey))) {
                    foreignTable = mfc.get(F_foreignTable);
                    break;
                }
            }
            if (StrUtil.isEmpty(foreignTable)) {
                foreignTable = SqlCache.GetForeignTable(foreignKey);
            }
        }
        if (StrUtil.isNotEmpty(foreignTable)&&StrUtil.isNotEmpty(foreignField)) {
            BaseModel mm = BaseModel.GetObjectByFieldValueUseCache((Class<BaseModel>) SqlCache.GetClassByTableName(foreignTable), foreignField, value);
            return mm;
        }
        return null;
    }


    /**
     * 使用map设置对象的值
     *
     * @param map map
     */
    public void SetValuesByMap(Map<String, Object> map) {
        for (String keyName : map.keySet()) {
            this.SetValue(keyName, map.get(keyName));
        }
    }
    /**
     * 使用map设置对象的值
     *
     * @param map                   map
     * @param listNotSetRequestValueFileds   不需要设置的字段列表
     */
    public void SetValuesByMap(Map<String, Object> map, List<String> listNotSetRequestValueFileds) {
        List<String> listnotset = new ArrayList<>();
        listnotset.addAll(listNotSetRequestValueFileds);
        for (String keyName : map.keySet()) {
            if (listnotset.size() > 0 && listnotset.contains(keyName)) {
                continue;
            }
            this.SetValue(keyName, map.get(keyName));
        }
    }

    /**
     * 使用HttpServletRequest设置对象的值
     *
     * @param request HttpServletRequest对象
     */
    public void SetValuesByRequest(HttpServletRequest request) {
        SetValuesByRequest(request, new ArrayList<>());
    }
    /**
     * 使用HttpServletRequest设置对象的值
     *
     * @param request                  HttpServletRequest对象
     * @param listNotSetRequestValueFileds  不需要设置的字段列表
     */
    public void SetValuesByRequest(HttpServletRequest request, List<String> listNotSetRequestValueFileds) {
        Map map = request.getParameterMap();
        List<String> listnotset = new ArrayList<>();
        listnotset.addAll(listNotSetRequestValueFileds);
        for (String columnName : SqlCache.GetColumnFieldMap(this.getClass()).keySet()) {
            if (listnotset.size() > 0 && listnotset.contains(columnName)) {
                continue;
            }
            if (map.containsKey(columnName)) {
                Object value = null;
                String[] vs = RequestUtil.GetStringArray(request, columnName);
                if (vs != null && vs.length > 1) {
                    value = StrUtil.join(vs);
                } else {
                    value = RequestUtil.GetString(request, columnName);
                }
                if (value != null && !"undefined".equals(value)) {
                    this.SetValue(columnName, value);
                } else {
                    this.SetValue(columnName, null);
                }
            }
        }
    }

    /**
     * 将对象转换为Json字符串
     *
     * @return Json字符串
     */
    public String ToJson() {
        return TypeConvert.ToJson(this.ToMap());
    }

    /**
     * 将对象转换为Map
     *
     * @return 包含对象信息的Map
     */
    public Map<String, Object> ToMap() {
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        Map<String, Object> m = new HashMap<>();
        Collection<String> lm = columnTypeMap.keySet();
        for (String columnName : lm) {
            m.put(columnName, this.GetValue(columnName));
        }
        return m;
    }

    public boolean IsDefaultAscOrder() {
        return false;
    }

    public String GetOrderField() {
        return F_OrderNum;
    }

    public SqlInfo GetOrderCond() throws SQLException {
        return null;
    }

    public String GetNameField() {
        return "";
    }

    public double GetMaxOrder() throws SQLException {
        return GetMaxOrder(GetOrderCond());
    }

    public void SetMaxOrder() throws SQLException {
        String orderField = GetOrderField();
        double order = TypeConvert.ToInteger(this.GetValue(orderField));
        if (order <= 0) {
            order = GetMaxOrder();
            this.SetValue(orderField, order);
        }
    }

    public double GetMaxOrder(SqlInfo sqlWhere) throws SQLException {
        String orderField = GetOrderField();
        double order = 0;
        if (StrUtil.isNotEmpty(orderField)) {
            SqlInfo su = new SqlInfo().CreateSelect(" max(" + orderField + ") ")
                    .From(GetTableName(this.getClass()));
            if (sqlWhere != null) {
                su.Where(sqlWhere.ToWhere()).AddParams(sqlWhere.GetParamsList());
            }
            order = Math.ceil(TypeConvert.ToDouble(BaseQuery.ObjectSql(su)));
        }
        return order + 100;
    }

    //表格是降序排序
    public void MoveOrderBefore(BaseQuery bq, BaseModel target) throws Exception {
        double targetNum = TypeConvert.ToDouble(target.GetValue(target.GetOrderField()));
        boolean isAsc = IsDefaultAscOrder();
        String table = GetTableName(this.getClass());
        SqlInfo si = new SqlInfo().CreateSelect().AppendColumn(table, GetOrderField())
                .From(table);
        if (isAsc) {//升序
            si.Where(GetOrderField() + "<?").AddParam(targetNum);
        } else {//降序
            si.Where(GetOrderField() + ">?").AddParam(targetNum);
        }
        si.AppendOrderBy(table, GetOrderField(), !isAsc);
        si.AppendLimitOffset(1, 0);
        Object value = bq.GetValue(si);
        double m = 0;
        if (isAsc) {
            m = DoubleUtil.sub(targetNum, 100d);
        } else {
            m = DoubleUtil.add(targetNum, 100d);
        }
        if (value != null) {
            double d = TypeConvert.ToDouble(value);
            m = DoubleUtil.divide(DoubleUtil.add(d, targetNum), 2d, 10000);
        }
        this.SetValue(this.GetOrderField(), m);
        this.Update(this.GetOrderField(), m);
    }
    /**
     * 获取表中一个或者多个需要唯一的列或者列的组合
     *
     * @return 唯一值字段组合的列表
     */
    public List<Map> GetUniqueFields() {
        return new ArrayList<>();
    }
    /**
     * 判断对象id在表中是否唯一
     *
     * @param type 表类型
     * @param id   id
     * @param map  map条件
     * @return 若唯一则返回true，否则返回false
     * @throws Exception
     */
    public static boolean IsUnique(Class type, String id, Map map) throws Exception {

        BaseModel bm = GetObjectByMapValue(type, map);
        if (bm != null) {
            if (bm.id.equals(id)) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }


    public void Save() throws Exception {
        // 先进行唯一值校验,校验通过之后再进行子级的保存校验
        String err = "";
        List<Map> listunique = this.GetUniqueFields();
        if (listunique.size() > 0) {
            for (Map m : listunique) {
                if (!BaseModel.IsUnique(this.getClass(), this.id, m)) {
                    for (Object s : m.keySet()) {
                        err += "、" + TypeConvert.ToString(s).replace("id", "");
                    }
                    err = err.replaceFirst("、", "") + " 记录已存在";
                    break;
                }
            }
        }
        if (StrUtil.isNotEmpty(err)) {
            throw new XException(err);
        }
        err = this.SaveValidate();
        if (StrUtil.isNotEmpty(err)) {
            throw new XException(err);
        }
        if (GetValue(GetOrderField()) == null || TypeConvert.ToDouble(GetValue(GetOrderField())) == 0) {
            this.SetMaxOrder();
        }
        if (IsNew(this)) {
            if (!Insert()) throw new XException("插入数据失败!");
        } else {
            if (!Update()) {
                if (!Insert()) throw new XException("更新数据失败!");
            }
        }
    }

    public void InnerSave() throws Exception {
        if (IsNew(this)) {
            if (!_Insert()) throw new XException("插入数据失败!");
        } else {
            if (!_Update()) {
                if (!_Insert()) throw new XException("更新数据失败!");
            }
        }
    }

    private boolean Insert() throws SQLException {
        if (StrUtil.isEmpty(this.id)) {
            this.id = (BaseModel.GetUniqueId());
        }
        this.CreateTime = new Date();
        if (!BaseModel.IsNew(GlobalValues.GetSessionUser())) {
            this.CreateUser = (GlobalValues.GetSessionUser().id);
        }
        this.UpdateTime = this.CreateTime;
        this.UpdateUser = this.CreateUser;
        return this._Insert();
    }

    private boolean _Insert() throws SQLException {
        Class clazz = this.getClass();
        String sql = SqlCache.GetInsertSql(clazz);
        List<String> columns = SqlCache.GetInsertColumns(clazz);
        if (StrUtil.isEmpty(sql) || columns == null) {
            Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
            String tableName = BaseModel.GetTableName(clazz);
            SqlInfo su = new SqlInfo().CreateInsertInto(tableName);
            columns = new ArrayList<>();
            for (String col : columnTypeMap.keySet()) {
                su.Values(col);
                columns.add(col);
            }
            sql = su.ToSql();
            SqlCache.AddInsertSql(clazz, sql, columns);
        }
        SqlInfo su = new SqlInfo().SetMainTable(BaseModel.GetTableName(clazz)).Append(sql);
        for (String c : columns) {
            Object value = this.GetValue(c);
            if (value != null && value.getClass() == Date.class) {
                Timestamp time = new Timestamp(((Date) value).getTime());
                su.AddParam(time);
            } else {
                su.AddParam(value);
            }
        }
        return BaseQuery.ExecuteSql(su) > 0;
    }

    private boolean Update() throws SQLException {
        this.UpdateTime = (new Date());
        if (!BaseModel.IsNew(GlobalValues.GetSessionUser())) {
            this.UpdateUser = (GlobalValues.GetSessionUser().id);
        }
        return _Update();
    }

    private boolean _Update() throws SQLException {
        Class clazz = this.getClass();
        String sql = SqlCache.GetUpdateSql(clazz);
        List<String> columns = SqlCache.GetUpdateColumns(clazz);
        if (StrUtil.isEmpty(sql) || columns == null) {
            String tableName = BaseModel.GetTableName(clazz);
            SqlInfo su = new SqlInfo().CreateUpdate(tableName);
            columns = new ArrayList<>();
            Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
            for (String col : columnTypeMap.keySet()) {
                if (!col.equals(BaseModel.F_id)) {
                    su.SetEqual(col);
                    columns.add(col);
                }
            }
            su.WhereEqual(F_id);
            columns.add(F_id);
            sql = su.ToSql();
            SqlCache.AddUpdateSql(clazz, sql, columns);
        }
        String tableName = BaseModel.GetTableName(clazz);
        SqlInfo su = new SqlInfo().SetMainTable(tableName).Append(sql);
        su.TableList.add(tableName);
        for (String c : columns) {
            Object value = this.GetValue(c);
            if (value != null && value.getClass() == Date.class) {
                Timestamp time = new Timestamp(((Date) value).getTime());
                su.AddParam(time);
            } else {
                su.AddParam(value);
            }
        }
        return BaseQuery.ExecuteSql(su) > 0;
    }

    public int UpdateFields(String... fields) throws SQLException {
        Map<String, Object> m = new HashMap<>();
        for (String s : fields) {
            m.put(s, GetValue(s));
        }
        return Update(m);
    }

    public int Update(String field, Object value) throws SQLException {
        Map<String, Object> m = new HashMap<>();
        m.put(field, value);
        return Update(m);
    }

    public int Update(Map<String, Object> m) throws SQLException {
        return Update(m, F_id, this.id);
    }

    public int Update(Map<String, Object> m, String fieldCond, Object valueCond) throws SQLException {
        if (m.keySet().size() == 0) {
            return 0;
        }
        m.put(F_UpdateTime, new Date());
        return UpdateOnly(m, fieldCond, valueCond);
    }

    public int UpdateOnly(Map<String, Object> m, String fieldCond, Object valueCond) throws SQLException {
        if (m.keySet().size() == 0) {
            return 0;
        }
        int i = 0;
        String tableName = BaseModel.GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateUpdate(tableName);
        for (String key : m.keySet()) {
            su.SetEqual(key).AddParam(m.get(key));
        }
        su.WhereEqual(fieldCond).AddParam(valueCond);

        try {
            i = BaseQuery.ExecuteSql(su);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(su.ToSql());
            String v = "";
            for (Object o : su.GetParams()) {
                v += o.toString() + ",";
            }
            log.error(v);
            throw ex;
        }
        return i;
    }

    public static <T extends BaseModel> int Update(Class<T> type, Map<String, Object> v, Map<String, Object> where) throws Exception {
        SqlInfo su = new SqlInfo().CreateUpdate(BaseModel.GetTableName(type));
        for (String key : v.keySet()) {
            su.SetEqual(key).AddParam(v.get(key));
        }
        if (where != null) {
            for (String key : where.keySet()) {
                su.AndEqual(key).AddParam(where.get(key));
            }
        }
        return BaseQuery.ExecuteSql(su);
    }

    public boolean Delete() throws Exception {
        String err = DeleteValidate();
        if (StrUtil.isNotEmpty(err)) {
            throw new XException(err);
        }
        boolean ret = BaseModel.Delete(this.getClass(), this.id);
        if (ret) {//删除文件
            List<String> files = this.GetUploadFiles();
            for (String file : files) {
                if (StrUtil.isNotEmpty(file)) {
                    for (String str : file.split("^_^")) {
                        String path = GlobalValues.GetUploadFilePath(str);
                        if (FileUtil.isExist(path)) {
                            FileUtil.delFile(path);
                        }
                    }
                }
            }
        }
        return ret;
    }

    public static <T extends BaseModel> boolean Delete(Class<T> type, String id) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type))
                .WhereEqual(F_id).AddParam(id);
        return BaseQuery.ExecuteSql(su) > 0;
    }

    public static <T extends BaseModel> boolean Delete(Class<T> type, String field, Object v) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type))
                .WhereEqual(field).AddParam(v);
        return BaseQuery.ExecuteSql(su) > 0;
    }

    public static <T extends BaseModel> boolean Delete(Class<T> type, String field, Object v, String field2, Object v2) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type))
                .WhereEqual(field).AddParam(v).AndEqual(field2).AddParam(v2);
        return BaseQuery.ExecuteSql(su) > 0;
    }

    public static <T extends BaseModel> boolean Delete(Class<T> type, Map<String, Object> v) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type));
        for (String key : v.keySet()) {
            su.AndEqual(key).AddParam(v.get(key));
        }
        return BaseQuery.ExecuteSql(su) > 0;
    }

    public static <T extends BaseModel> boolean Delete(Class<T> type, BaseQuery bq) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type));
        bq.CreateSql(su);
        return BaseQuery.ExecuteSql(su) > 0;
    }

    public static <T extends BaseModel> T GetObjectByIdUseCache(Class<T> type, String id) throws SQLException {
        Map<String, Object> dataCache = GlobalValues.GetSessionCache();
        String cache = GetTableName(type) + id;
        if (dataCache.containsKey(cache)) {
            return (T) dataCache.get(cache);
        }
        T bm = GetObjectById(type, id);
        dataCache.put(cache, bm);
        return bm;
    }


    public static <T extends BaseModel> T GetObjectByFieldValueUseCache(Class<T> type, String field, Object v) throws Exception {
        Map<String, Object> dataCache = GlobalValues.GetSessionCache();
        String cache = GetTableName(type) + field + v;
        if (dataCache.containsKey(cache)) {
            return (T) dataCache.get(cache);
        }
        T bm = GetObjectByFieldValue(type, field, v);
        dataCache.put(cache, bm);
        return bm;
    }

    public static <T extends BaseModel> T GetObjectByTwoFieldValueUseCache(Class<T> type, String field1, Object v1, String field2, Object v2) throws Exception {
        Map<String, Object> dataCache = GlobalValues.GetSessionCache();
        String cache = GetTableName(type) + field1 + v1 + field2 + v2;
        if (dataCache.containsKey(cache)) {
            return (T) dataCache.get(cache);
        }
        T bm = GetObjectByTwoFieldValue(type, field1, v1, field2, v2);
        dataCache.put(cache, bm);
        return bm;
    }

    public static <T extends BaseModel> T GetObjectByMapValueUseCache(Class<T> type, Map<String, Object> map) throws Exception {
        Map<String, Object> dataCache = GlobalValues.GetSessionCache();
        String cache = GetTableName(type);
        for (String s : map.keySet()) {
            cache += s + map.get(s);
        }
        if (dataCache.containsKey(cache)) {
            return (T) dataCache.get(cache);
        }
        T bm = GetObjectByMapValue(type, map);
        dataCache.put(cache, bm);
        return bm;
    }

    public static <T extends BaseModel> T GetObjectById(Class<T> type, String id) throws SQLException {
        if (StrUtil.isEmpty(id)) {
            return null;
        }
        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(F_id).AddParam(id);
        T bm = BaseQuery.InfoSql(type, su);
        return bm;
    }


    public static <T extends BaseModel> T GetObjectByFieldValue(Class<T> type, String field, Object v) throws Exception {
        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(field).AddParam(v);
        T bm = BaseQuery.InfoSql(type, su);
        return bm;
    }

    public static <T extends BaseModel> T GetObjectByTwoFieldValue(Class<T> type, String field1, Object v1, String field2, Object v2) throws Exception {

        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(field1).AddParam(v1).AndEqual(field2).AddParam(v2);

        T bm = BaseQuery.InfoSql(type, su);
        return bm;
    }

    public static <T extends BaseModel> T GetObjectByThreeFieldValue(Class<T> type, String field1, Object v1, String field2, Object v2, String field3, Object v3) throws Exception {

        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(field1).AddParam(v1).AndEqual(field2).AddParam(v2).AndEqual(field3).AddParam(v3);

        T bm = BaseQuery.InfoSql(type, su);
        return bm;
    }

    public static <T extends BaseModel> T GetObjectByMapValue(Class<T> type, Map<String, Object> map) throws Exception {
        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type));
        for (String s : map.keySet()) {
            su.AndEqual(s).AddParam(map.get(s));
        }
        T bm = BaseQuery.InfoSql(type, su);
        return bm;
    }

    public static <T extends BaseModel> String GetTableName(Class<T> clazz) {
        String tb = SqlCache.GetTableName(clazz);
        if (StrUtil.isEmpty(tb)) {
            tb = clazz.getSimpleName();
            XTable table = clazz.getAnnotation(XTable.class);
            if (table != null && StrUtil.isNotEmpty(table.name())) {
                tb = table.name();
            }
            Table table2 = clazz.getAnnotation(Table.class);
            if (table2 != null && StrUtil.isNotEmpty(table2.name())) {
                tb = table2.name();
            }
            SqlCache.SetTableName(clazz, tb);
        }
        return tb;
    }

    public static <T extends BaseModel> T SetObjectByMap(Class<T> type, Map<String, Object> map) throws Exception {
        T bm = type.newInstance();
        bm.SetValuesByMap(map);
        return bm;
    }

    public <T extends BaseQuery> T CreateQueryModel() {
        return (T) new BaseQuery(this);
    }

    //生成本表的查询sql
    public SqlInfo CreateSqlInfo() {
        String table = GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateSelect();
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        Collection<String> lm = columnTypeMap.keySet();
        for (String columnName : lm) {
            su.AppendColumn(table, columnName);
        }
        su.From(table);
        return su;
    }

    public List<Map<String, String>> GetListForeignColumns() {
        List<Map<String, String>> list = new ArrayList<>();
        return list;
    }

    public DataTable GetList(BaseQuery bq) throws Exception {
        SqlInfo su = CreateSqlInfo();
        return bq.GetList(su);
    }

    public DataTable GetPlainList(BaseQuery bq) throws Exception {
        SqlInfo su = CreateSqlInfo();
        return bq.GetList(su);
    }

    public DataTable CreateForeignKeyNameFields(DataTable dt, String foreignKey, String foreignTable, String foreignField, String nameField) throws Exception {
        Set<String> idList = new HashSet<>();
        for (Map<String, Object> row : dt.Data) {
            String ids = TypeConvert.ToString(row.get(foreignKey));
            if (StrUtil.isNotEmpty(ids)) {
                idList.addAll(StrUtil.splitToList(ids));
            }
        }
        if (idList.size() > 0) {
            SqlInfo su = new SqlInfo().CreateSelect();
            su.AppendColumn(foreignTable, F_id);
            su.AppendColumn(foreignTable, foreignField);
            su.From(foreignTable);
            su.In(foreignTable, F_id, idList.toArray(new String[]{}));
            DataTable dataTable = BaseQuery.ListSql(su, null);

            dataTable.InitHashByIDField();
            for (Map<String, Object> row : dt.Data) {
                String value = "";
                String ids = TypeConvert.ToString(row.get(foreignKey));
                if (StrUtil.isNotEmpty(ids)) {
                    for (String id : StrUtil.splitToList(ids)) {
                        Map<String, Object> data = dataTable.GetRowByIDField(id);
                        if (data != null) {
                            value += "," + TypeConvert.ToString(data.get(foreignField));
                        }
                    }
                }
                row.put(nameField, value.replaceFirst(",", ""));
            }
        }
        return dt;
    }

    public DataTable CreateForeignKeyNameFields(DataTable dt, DataTable foreignTable, String keyField, String foreignIdField, String idField, String foreignNameField, String nameField) throws Exception {
        for (Map<String, Object> row : dt.Data) {
            String ids = "";
            String names = "";
            String id = TypeConvert.ToString(row.get(F_id));
            for (Map m : foreignTable.Data) {
                if (id.equals(TypeConvert.ToString(m.get(keyField)))) {
                    ids += "," + TypeConvert.ToString(m.get(foreignIdField));
                    names += "," + TypeConvert.ToString(m.get(foreignNameField));
                }
            }
            row.put(idField, ids.replaceFirst(",", ""));
            row.put(nameField, names.replaceFirst(",", ""));
        }
        return dt;
    }

    public Object GetStat(BaseQuery bq) throws Exception {
        String table = GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateSelect().AppendStat(table, bq.StatType, bq.StatField, "value");
        su.From(table);
        return bq.GetValue(su);
    }

    public DataTable GetStatGroup(BaseQuery bq) throws Exception {
        if (bq.GroupField == null || bq.GroupField.length == 0) {
            return new DataTable();
        }
        String table = GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateSelect();
        su.AppendStat(table, bq.StatType, bq.StatField, "value");
        for (String field : bq.GroupField) {
            su.AppendColumn(table, field);
        }
        su.From(table);
        for (String field : bq.GroupField) {
            su.AppendGroupBy(table, field);
        }
        su.AppendOrderBy(table, bq.GroupField[0], true);
        return bq.GetListNoPage(su);
    }

    public BaseModel ImportDataSetValue(Map<String, Object> m, String uniquecolumn) throws Exception {
        String err = "";
        BaseModel bm = null;
        if (StrUtil.isNotEmpty(uniquecolumn)) {
            bm = GetObjectByFieldValue(this.getClass(), uniquecolumn, m.get(uniquecolumn));
        }
        if (bm == null) {
            bm = this.getClass().newInstance();
        }
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        for (String key : m.keySet()) {
            if (columnTypeMap.containsKey(key)) {
                err += bm.ValidateAndSetValue(key, m.get(key), false);
            } else {
                List<Map<String, String>> list = GetListForeignColumns();
                for (Map<String, String> mfc : list) {
                    if (key.equals(mfc.get(F_columnField))) {
                        err += bm.ValidateAndSetForeignKeyValue(mfc.get(F_foreignKey), m.get(key), key);
                        break;
                    }
                }
            }
        }
        err += bm.SaveValidate();
        if (StrUtil.isNotEmpty(err)) {
            m.put("错误信息", err);
            m.put("检测状态", "错误");
        }
        return bm;
    }

    public String ImportData(DataTable dt, String uniquecolumn, boolean onlyValidate) throws Exception {
        String err = "";
        for (Map<String, Object> m : dt.Data) {
            BaseModel bm = ImportDataSetValue(m, uniquecolumn);
            err += TypeConvert.ToString(m.get("错误信息"));
            if (!onlyValidate) {
                bm.Save();
            }
        }
        return err;
    }

    public List<String> GetUploadFiles() {
        List<String> files = new ArrayList<>();
        List<String> fields = SqlCache.fileColumns.get(this.getClass());
        if (fields != null) {
            for (String field : fields) {
                String value = TypeConvert.ToString(this.GetValue(field));
                if (StrUtil.isNotEmpty(value)) {
                    files.add(value);
                }
            }
        }
        return files;
    }

    /**
     * 创建工作流，由子类实现
     *
     * @throws Exception
     */
    public void StartWorkFlow() throws Exception {
    }

    /**
     * 工作流回调，由子类实现
     *
     * @param flowState 流程状态
     * @param params    流程参数
     * @throws Exception
     */
    public void WorkFlowCallback(String flowState, Map<String, Object> params) throws Exception {
    }

    ///业务类必须初始化测试数据
    public void InitTestData() throws Exception {

    }

    public void DeleteTestData() throws Exception {

    }


}
