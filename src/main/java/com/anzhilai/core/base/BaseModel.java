package com.anzhilai.core.base;

import com.anzhilai.core.database.*;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.framework.XException;
import com.anzhilai.core.toolkit.DoubleUtil;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.toolkit.*;
import com.anzhilai.core.toolkit.uuid.ShortUUID;
import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.*;
/**
 * 基础模型类
 * 是所有数据模型的基类，提供公共的属性和方法，包括基本的增删改查功能等
 */
public abstract class BaseModel {
    public static Logger log = Logger.getLogger(BaseModel.class);

    /**
     * 默认数据表的主键字段
     */
    @XColumn(name = F_id, unique = true, nullable = false, length = 128)
    public String id;
    public final static String F_id = "id";
    public final static String F_ids = "ids";
    public final static String F_json = "json";

    /**
     * 获得一个唯一id,一般用于生成id
     *
     * @return 唯一id
     */
    public static String GetUniqueId() {
        return ShortUUID.getUUID();
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
     * 校验字段
     */
    @XColumn(text = true)
    public String ValidateCode;
    public final static String F_ValidateCode = "ValidateCode";
    /**
     * 设置默认排序是否为升序
     *
     * @return 若为升序则返回true，否则返回false
     */
    public boolean IsDefaultAscOrder() {
        return false;
    }
    /**
     * 设置默认的排序字段
     *
     * @return 排序字段默认为OrderNum，也可以由具体业务指定，但只有OrderNum能够进行顺序的拖拽调整
     */
    public String GetDefaultOrderField() {
        return F_OrderNum;
    }
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
        DataTable dt = SqlExe.ListSql(su, null);
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
     * 表列的原始字段
     */
    public static final String F_originField = "originField";

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
     * @param field 外键表的值对应的字段名，如xx名称
     * @param value 外键表字段对应的值
     * @return 错误信息，若无错误则返回空字符串
     * @throws Exception
     */
    public String ValidateAndSetForeignKey(String foreignKey, String field, Object value) throws Exception {
        String err = "";
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        Field m = columnTypeMap.get(foreignKey);
        if (m != null) {
            String vid = null;
            if (StrUtil.isNotEmpty(value)) {
                String sv = TypeConvert.ToString(value);
                vid = "";
                if (foreignKey.endsWith("s")) {
                    List<String> fvalues = new ArrayList<>();
                    sv = sv.replace("，", ",");
                    String[] fvs = StrUtil.split(sv, ",");
                    fvalues.addAll(Arrays.asList(fvs));
                    List<String> fkids = new ArrayList<>();
                    for (String fvalue : fvalues) {
                        BaseModel mm = GetForeignObjectByFieldValue(foreignKey, field, fvalue);
                        if (mm == null) {
                            err += field + "不存在" + fvalue + "\r\n";
                        } else {
                            fkids.add(mm.id);
                        }
                    }
                    vid = StrUtil.join(fkids);
                } else {
                    BaseModel mm = GetForeignObjectByFieldValue(foreignKey, field, sv);
                    if (mm == null) {
                        err += field + "不存在" + sv + "\r\n";
                    } else {
                        vid = mm.id;
                    }
                }
            }
            if (StrUtil.isEmpty(err)) {
                m.setAccessible(true);
                m.set(this, vid);
            }
        } else {
            err += foreignKey+"不存在";
        }
        return err;
    }
    /**
     * 从外键字段关联的外键表中根据字段和值获取对应的外键对象
     *
     * @param foreignField  外键字段
     * @param field  字段
     * @param value  值
     * @return 外键对象
     * @throws Exception
     */
    public BaseModel GetForeignObjectByFieldValue(String foreignField, String field, Object value) throws Exception {
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
        Field m = columnTypeMap.get(foreignField);
        XColumn xc = m.getAnnotation(XColumn.class);
        String foreignTable = xc.foreignTable();
        if (StrUtil.isNotEmpty(foreignTable)&&StrUtil.isNotEmpty(field)) {
            BaseModel mm = BaseModel.GetObjectByFieldValue(SqlCache.GetClassByTableName(foreignTable), field, value);
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
     * @param listNotSetRequestValueFields   不需要设置的字段列表
     */
    public void SetValuesByMap(Map<String, Object> map, List<String> listNotSetRequestValueFields) {
        List<String> listnotset = new ArrayList<>();
        listnotset.addAll(listNotSetRequestValueFields);
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
     * @param listNotSetRequestValueFields  不需要设置的字段列表
     */
    public void SetValuesByRequest(HttpServletRequest request, List<String> listNotSetRequestValueFields) {
        Map map = request.getParameterMap();
        List<String> listnotset = new ArrayList<>();
        listnotset.addAll(listNotSetRequestValueFields);
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

    /**
     * 获取下一个最大的序号
     *
     * @return 序号
     */
    public double GetMaxNextOrderNum() throws SQLException {
        return GetMaxValue(F_OrderNum,null)+100;
    }

    /**
     * 根据条件获取一个字段的最大值
     *
     * @return 字段的最大值
     */
    public double GetMaxValue(String field,SqlInfo sqlCond) throws SQLException {
        double v = 0;
        if (StrUtil.isNotEmpty(field)) {
            SqlInfo su = new SqlInfo().CreateSelect(" max(" + field + ") ")
                    .From(GetTableName(this.getClass()));
            if (sqlCond != null) {
                su.Where(sqlCond.ToWhere()).AddParams(sqlCond.GetParamsList());
            }
            v = Math.ceil(TypeConvert.ToDouble(SqlExe.ObjectSql(su)));
        }
        return v;
    }

    /**
     * 将当前对象的顺序移动到目标对象之前
     *
     * @param bq     查询对象
     * @param target 目标对象
     * @throws Exception 异常
     */
    public void MoveOrderBefore(BaseQuery bq, BaseModel target) throws Exception {
        double targetNum = TypeConvert.ToDouble(target.OrderNum);
        boolean isAsc = IsDefaultAscOrder();
        String table = GetTableName(this.getClass());
        SqlInfo si = new SqlInfo().CreateSelect().AppendColumn(table, F_OrderNum)
                .From(table);
        if (isAsc) {//升序
            si.Where(F_OrderNum+ "<?").AddParam(targetNum);
        } else {//降序
            si.Where(F_OrderNum + ">?").AddParam(targetNum);
        }
        si.AppendOrderBy(table,F_OrderNum, !isAsc);
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
        this.OrderNum = m;
        this.Update(F_OrderNum, m);
    }
    /**
     * 获取表中需要判断记录唯一的字段和对应值的键值对列表
     *
     * @return 需要判断记录唯一的字段和对应值的键值对列表
     */
    public List<Map> GetListUniqueFieldAndValues() {
        return new ArrayList<>();
    }
    /**
     * 判断对象在表中是否唯一
     *
     * @param map  需要对比的字段和值的一组键值对
     * @return 若唯一则返回true，否则返回false
     * @throws Exception
     */
    public boolean IsUnique(Map map) throws Exception {
        BaseModel bm = GetObjectByMapValue(this.getClass(), map);
        if (bm != null) {
            if (bm.id.equals(this.id)) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
    /**
     * 返回生成模型数据对应的JsonSchema
     *
     * @return JsonSchema字符串
     */
    public String GetAISchema(){
        return "";
    }

    /**
     * 保存对象
     *
     * @throws Exception 异常
     */
    public void Save() throws Exception {
        if (TypeConvert.ToDouble(this.OrderNum) == 0) {
            this.OrderNum = this.GetMaxNextOrderNum();
        }
        // 先进行唯一值校验,校验通过之后再进行子级的保存校验
        String err = "";
        List<Map> listunique = this.GetListUniqueFieldAndValues();
        if (listunique.size() > 0) {
            for (Map m : listunique) {
                if (!this.IsUnique(m)) {
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
        if (IsNew(this)) {
            if (!Insert()) throw new XException("插入数据失败!");
        } else {
            if (!Update()) {
                if (!Insert()) throw new XException("更新数据失败!");
            }
        }
    }
    /**
     * 不做验证，直接保存
     *
     * @throws Exception 异常
     */
    public void SaveWithoutValidate() throws Exception {
        if (IsNew(this)) {
            if (!_Insert()) throw new XException("插入数据失败!");
        } else {
            if (!_Update()) {
                if (!_Insert()) throw new XException("更新数据失败!");
            }
        }
    }
    /**
     * 插入数据并记录插入日志
     *
     * @throws SQLException 异常
     * @return 是否插入成功
     */
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
    /**
     * 插入数据
     *
     * @throws SQLException 异常
     * @return 是否插入成功
     */
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
        return SqlExe.ExecuteSql(su) > 0;
    }
    /**
     * 更新数据并记录更新日志
     *
     * @throws SQLException 异常
     * @return 是否更新成功
     */
    private boolean Update() throws SQLException {
        this.UpdateTime = (new Date());
        if (!BaseModel.IsNew(GlobalValues.GetSessionUser())) {
            this.UpdateUser = (GlobalValues.GetSessionUser().id);
        }
        return _Update();
    }
    /**
     * 更新数据
     *
     * @throws SQLException 异常
     * @return 是否更新成功
     */
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
        return SqlExe.ExecuteSql(su) > 0;
    }
    /**
     * 更新字段数据
     *
     * @param fields 字段数组
     * @throws SQLException 异常
     * @return 更新的记录数
     */
    public int UpdateFields(String... fields) throws SQLException {
        Map<String, Object> m = new HashMap<>();
        for (String s : fields) {
            m.put(s, GetValue(s));
        }
        return Update(m);
    }
    /**
     * 更新字段数据
     *
     * @param field 字段
     * @param value 值
     * @throws SQLException 异常
     * @return 更新的记录数
     */
    public int Update(String field, Object value) throws SQLException {
        Map<String, Object> m = new HashMap<>();
        m.put(field, value);
        return Update(m);
    }
    /**
     * 更新字段数据
     *
     * @param m 字段和值的键值对
     * @throws SQLException 异常
     * @return 更新的记录数
     */
    public int Update(Map<String, Object> m) throws SQLException {
        return Update(m, F_id, this.id);
    }
    /**
     * 更新字段数据
     *
     * @param m         字段和值的键值对
     * @param field 条件字段
     * @param value 条件值
     * @throws SQLException 异常
     * @return 更新的记录数
     */
    public int Update(Map<String, Object> m, String field, Object value) throws SQLException {
        if (m.keySet().size() == 0) {
            return 0;
        }
        m.put(F_UpdateTime, new Date());
        if (!BaseModel.IsNew(GlobalValues.GetSessionUser())) {
            m.put(F_UpdateUser, (GlobalValues.GetSessionUser().id));
        }
        int i;
        String tableName = BaseModel.GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateUpdate(tableName);
        for (String key : m.keySet()) {
            su.SetEqual(key).AddParam(m.get(key));
        }
        su.WhereEqual(field).AddParam(value);

        try {
            i = SqlExe.ExecuteSql(su);
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

    /**
     * 删除数据
     *
     * @throws Exception 异常
     * @return 是否删除成功
     */
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
    /**
     * 删除数据
     *
     * @param type 类型
     * @param id   id
     * @throws Exception 异常
     * @return 是否删除成功
     */
    public static <T extends BaseModel> boolean Delete(Class<T> type, String id) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type))
                .WhereEqual(F_id).AddParam(id);
        return SqlExe.ExecuteSql(su) > 0;
    }
    /**
     * 删除数据
     *
     * @param type  类型
     * @param field 字段名
     * @param v     字段值
     * @throws Exception 异常
     * @return 是否删除成功
     */
    public static <T extends BaseModel> boolean Delete(Class<T> type, String field, Object v) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type))
                .WhereEqual(field).AddParam(v);
        return SqlExe.ExecuteSql(su) > 0;
    }
    /**
     * 删除数据
     *
     * @param type   类型
     * @param field  字段名
     * @param v      字段值
     * @param field2 字段名2
     * @param v2     字段值2
     * @throws Exception 异常
     * @return 是否删除成功
     */
    public static <T extends BaseModel> boolean Delete(Class<T> type, String field, Object v, String field2, Object v2) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type))
                .WhereEqual(field).AddParam(v).AndEqual(field2).AddParam(v2);
        return SqlExe.ExecuteSql(su) > 0;
    }
    /**
     * 删除数据
     *
     * @param type 类型
     * @param v    删除的条件键值对
     * @throws Exception 异常
     * @return 是否删除成功
     */
    public static <T extends BaseModel> boolean Delete(Class<T> type, Map<String, Object> v) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type));
        for (String key : v.keySet()) {
            su.AndEqual(key).AddParam(v.get(key));
        }
        return SqlExe.ExecuteSql(su) > 0;
    }
    /**
     * 删除数据
     *
     * @param type 类型
     * @param bq   查询对象
     * @throws Exception 异常
     * @return 是否删除成功
     */
    public static <T extends BaseModel> boolean Delete(Class<T> type, BaseQuery bq) throws Exception {
        SqlInfo su = new SqlInfo().CreateDelete(BaseModel.GetTableName(type));
        bq.CreateSql(su);
        return SqlExe.ExecuteSql(su) > 0;
    }
    /**
     * 使用缓存，根据id获取对象
     *
     * @param type 类型
     * @param id   id
     * @throws SQLException 异常
     * @return 对象
     */
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

    /**
     * 根据id获取对象
     *
     * @param type 类型
     * @param id   id
     * @throws SQLException 异常
     * @return 对象
     */
    public static <T extends BaseModel> T GetObjectById(Class<T> type, String id) throws SQLException {
        if (StrUtil.isEmpty(id)) {
            return null;
        }
        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(F_id).AddParam(id);
        T bm = SqlExe.InfoSql(type, su);
        return bm;
    }

    /**
     * 根据字段值获取对象
     *
     * @param type  类型
     * @param field 字段名
     * @param v     字段值
     * @throws Exception 异常
     * @return 对象
     */
    public static <T extends BaseModel> T GetObjectByFieldValue(Class<T> type, String field, Object v) throws Exception {
        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(field).AddParam(v);
        T bm = SqlExe.InfoSql(type, su);
        return bm;
    }
    /**
     * 根据两个字段值获取对象
     *
     * @param type    类型
     * @param field1  字段名1
     * @param v1      字段值1
     * @param field2  字段名2
     * @param v2      字段值2
     * @throws Exception 异常
     * @return 对象
     */
    public static <T extends BaseModel> T GetObjectByTwoFieldValue(Class<T> type, String field1, Object v1, String field2, Object v2) throws Exception {

        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(field1).AddParam(v1).AndEqual(field2).AddParam(v2);

        T bm = SqlExe.InfoSql(type, su);
        return bm;
    }

    /**
     * 根据三个字段值获取对象
     *
     * @param type    类型
     * @param field1  字段名1
     * @param v1      字段值1
     * @param field2  字段名2
     * @param v2      字段值2
     * @param field3  字段名3
     * @param v3      字段值3
     * @throws Exception 异常
     * @return 对象
     */
    public static <T extends BaseModel> T GetObjectByThreeFieldValue(Class<T> type, String field1, Object v1, String field2, Object v2, String field3, Object v3) throws Exception {

        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type))
                .WhereEqual(field1).AddParam(v1).AndEqual(field2).AddParam(v2).AndEqual(field3).AddParam(v3);

        T bm = SqlExe.InfoSql(type, su);
        return bm;
    }
    /**
     * 根据map键值对获取对象
     *
     * @param type 类型
     * @param map  键值对
     * @throws Exception 异常
     * @return 对象
     */
    public static <T extends BaseModel> T GetObjectByMapValue(Class<T> type, Map<String, Object> map) throws Exception {
        SqlInfo su = new SqlInfo().CreateSelectAll(GetTableName(type));
        for (String s : map.keySet()) {
            su.AndEqual(s).AddParam(map.get(s));
        }
        T bm = SqlExe.InfoSql(type, su);
        return bm;
    }
    /**
     * 获取表名
     *
     * @param clazz 类型
     * @return 表名
     */
    public static <T extends BaseModel> String GetTableName(Class<T> clazz) {
        String tb = SqlCache.GetTableName(clazz);
        if (StrUtil.isEmpty(tb)) {
            tb = clazz.getSimpleName();
            XTable table = clazz.getAnnotation(XTable.class);
            if (table != null && StrUtil.isNotEmpty(table.name())) {
                tb = table.name();
            }
            SqlCache.SetTableName(clazz, tb);
        }
        return tb;
    }

    /**
     * 创建一个查询对象，通常是一个内部类
     *
     * @param <T> 查询对象的类型
     * @return 查询对象
     */
    public <T extends BaseQuery> T CreateQueryModel() {
        return (T) new BaseQuery(this);
    }

    /**
     * 创建查询SqlInfo对象
     *
     * @return SqlInfo对象
     */
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

    /**
     * 根据一个查询对象，构造一个Select语句返回数据列表
     *
     * @param bq 查询模型对象
     * @return 数据列表DataTable
     */
    public DataTable GetList(BaseQuery bq) throws Exception {
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
            DataTable dataTable = SqlExe.ListSql(su, null);

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
    /**
     * 获取统计结果
     *
     * @param bq 查询对象
     * @throws Exception 异常
     * @return 统计结果
     */
    public Object GetStat(BaseQuery bq) throws Exception {
        String table = GetTableName(this.getClass());
        SqlInfo su = new SqlInfo().CreateSelect().AppendStat(table, bq.StatType, bq.StatField, "value");
        su.From(table);
        return bq.GetValue(su);
    }
    /**
     * 获取分组统计结果
     *
     * @param bq 查询对象
     * @throws Exception 异常
     * @return 分组统计结果
     */
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

    /**
     * 导入数据到对象中
     *
     * @param dt            数据集
     * @param uniquecolumn  唯一字段
     * @param onlyValidate  是否只校验
     * @throws Exception 异常
     * @return 错误信息
     */
    public String ImportData(DataTable dt, String uniquecolumn, boolean onlyValidate) throws Exception {
        String err = "";
        for (Map<String, Object> m : dt.Data) {

            BaseModel bm = null;
            if (StrUtil.isNotEmpty(uniquecolumn)) {
                bm = GetObjectByFieldValue(this.getClass(), uniquecolumn, m.get(uniquecolumn));
            }
            if (bm == null) {
                bm =  TypeConvert.CreateNewInstance(this.getClass());
            }
            Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(this.getClass());
            for (String key : m.keySet()) {
                if (columnTypeMap.containsKey(key)) {
                    err += bm.ValidateAndSetValue(key, m.get(key), false);
                }
            }
            err += bm.SaveValidate();
            if (!onlyValidate) {
                bm.Save();
            }
        }
        return err;
    }
    /**
     * 获取上传的文件路径列表
     *
     * @return 文件路径列表
     */
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

    /**
     * 初始化测试数据，由业务类实现
     *
     * @throws Exception 异常
     */
    public void InitTestData() throws Exception {

    }
    /**
     * 删除测试数据，由业务类实现
     *
     * @throws Exception 异常
     */
    public void DeleteTestData() throws Exception {

    }


}
