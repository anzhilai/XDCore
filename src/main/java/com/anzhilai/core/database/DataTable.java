package com.anzhilai.core.database;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseModelTree;
import com.anzhilai.core.base.BaseQuery;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import net.sf.jsqlparser.expression.*;
import net.sf.jsqlparser.expression.operators.conditional.AndExpression;
import net.sf.jsqlparser.expression.operators.conditional.OrExpression;
import net.sf.jsqlparser.expression.operators.relational.*;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.schema.Column;
import net.sf.jsqlparser.util.deparser.ExpressionDeParser;
import org.apache.log4j.Logger;

import java.util.*;

/**
 * 内存表格,可以序列化为Json
 * 一个内存数据表结构，支持从数据库读出列表的封装，包括数据的列属性。
 */
public class DataTable {
    private static Logger log = Logger.getLogger(DataTable.class);
    /**
     * 所有的数据列表
     */
    public List<Map<String, Object>> Data;
    /**
     * 数据库列数据的类型
     */
    public Map<String, String> DbDataSchema;
    /**
     * 列数据的类型
     */
    public Map<String, Class<?>> DataSchema;
    /**
     * 列的配置列表
     */
    public List<Map> DataColumns = new ArrayList<>();
    /**
     * 总数据数，用于分页
     */
    public Long Total = 0L;
    /**
     * 不同列的统值
     */
    public Map<String, Object> TotalResult;

    /**
     * 构造方法
     */
    public DataTable() {
        this(new ArrayList<>());
    }

    /**
     * 构造方法
     *
     * @param data 行数据
     */
    public DataTable(List<Map<String, Object>> data) {
        this(data, new LinkedHashMap<>());
    }

    /**
     * 构造方法
     *
     * @param data   行数据
     * @param schema 列数据的类型
     */
    public DataTable(List<Map<String, Object>> data, Map<String, Class<?>> schema) {
        super();
        Data = data;
        DataSchema = schema;
    }

    /**
     * 克隆一个DataTable对象
     *
     * @return DataTable对象副本
     */
    public DataTable Clone() {
        DataTable result = new DataTable();
        for (Map row : Data) {
            Map _map = new HashMap();
            _map.putAll(row);
            result.Data.add(_map);
        }
        return result;
    }

    /**
     * 获取行数据
     *
     * @return 行数据
     */
    public List<Map<String, Object>> getData() {
        return Data;
    }

    /**
     * 设置行数据
     *
     * @param data 行数据
     */
    public void setData(List<Map<String, Object>> data) {
        this.Data = data;
    }

    /**
     * 获取列数据的类型
     *
     * @return 列数据的类型
     */
    public Map<String, Class<?>> getDataSchema() {
        return DataSchema;
    }

    /**
     * 设置列数据的类型
     *
     * @param dataSchema 列数据的类型
     */
    public void setDataSchema(Map<String, Class<?>> dataSchema) {
        DataSchema = dataSchema;
    }

    /**
     * 合并两个DataTable对象
     *
     * @param dt 要合并的DataTable对象
     * @return 合并后的DataTable对象
     */
    public DataTable MergeTable(DataTable dt) {
        this.Data.addAll(dt.Data);
        return this;
    }

    /**
     * 添加一列
     *
     * @param name   列名
     * @param _class 列的类型
     */
    public void AddColumn(String name, Class _class) {
        this.DataSchema.put(name, _class);
        CreateColumnTitleMap(name);
    }

    /**
     * 添加一行
     *
     * @param m 行数据
     */
    public void AddRow(Map<String, Object> m) {
        this.getData().add(m);
        Total++;
    }

    /**
     * 添加多行
     *
     * @param list 多行数据
     */
    public void AddRows(List<Map> list) {
        for (Map m : list) {
            this.getData().add(m);
            Total++;
        }
    }

    /**
     * 在指定位置插入一行
     *
     * @param m        行数据
     * @param position 插入的位置
     */
    public void InsertRow(Map<String, Object> m, int position) {
        this.getData().add(position, m);
        Total++;
    }

    /**
     * 获取行在DataTable中的索引
     *
     * @param m 行数据
     * @return 索引值
     */
    public int IndexOfRow(Map<String, Object> m) {
        return this.getData().indexOf(m);
    }

    String idField;
    HashMap<String, Map<String, Object>> hashRow = new HashMap<>();

    /**
     * 初始化根据ID字段Hash的映射关系
     */
    public void InitHashByIDField() {
        InitHashByIDField(BaseModel.F_id);
    }

    /**
     * 初始化根据指定ID字段Hash的映射关系
     *
     * @param field ID字段名
     */
    public void InitHashByIDField(String field) {
        idField = field;
        for (Map m : this.Data) {
            hashRow.put(TypeConvert.ToString(m.get(idField)), m);
        }
    }

    /**
     * 根据ID值获取对应的行数据
     *
     * @param id ID值
     * @return 行数据
     */
    public Map<String, Object> GetRowByIDField(String id) {
        if (hashRow.size() < this.Data.size()) {
            this.InitHashByIDField();
        }
        if (hashRow.containsKey(id)) {
            return hashRow.get(id);
        }
        return null;
    }

    /**
     * 根据条件进行过滤，返回新的DataTable对象
     *
     * @param expr 过滤条件
     * @return 新的DataTable对象
     */
    public DataTable FilterToNewTable(String expr) {
        DataTable dt = new DataTable();
        dt.setDataSchema(this.DataSchema);
        for (Map m : this.Data) {
            if (CheckMapCond(m, expr)) {
                dt.AddRow(m);
            }
        }
        return dt;
    }

    /**
     * 检查Map是否满足条件
     *
     * @param map  要检查的Map对象
     * @param expr 过滤条件
     * @return 满足条件返回true，否则返回false
     */
    public boolean CheckMapCond(Map map, String expr) {
        final Stack<Object> stack = new Stack<Object>();
        if (StrUtil.isEmpty(expr)) {
            return true;
        }
        Expression parseExpression = null;
        try {
            parseExpression = CCJSqlParserUtil.parseExpression(expr);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        ExpressionDeParser deparser = new ExpressionDeParser() {
            @Override
            public void visit(AndExpression and) {
                super.visit(and);
                Boolean b1 = (Boolean) stack.pop();
                Boolean b2 = (Boolean) stack.pop();
                stack.push(b1 & b2);
            }

            @Override
            public void visit(OrExpression or) {
                super.visit(or);
                Boolean b1 = (Boolean) stack.pop();
                Boolean b2 = (Boolean) stack.pop();
                stack.push(b1 || b2);
            }

            @Override
            public void visit(Column column) {
                super.visit(column);
                stack.push(column.getColumnName());
            }

            @Override
            public void visit(EqualsTo var1) {
                super.visit(var1);
                CheckCompareResult(stack, map, "=");
//                String key = var1.getLeftExpression().toString();
//                Object v = var1.getRightExpression().getASTNode().jjtGetValue();
            }

            @Override
            public void visit(NotEqualsTo var1) {
                super.visit(var1);
                CheckCompareResult(stack, map, "!=");
            }

            @Override
            public void visit(GreaterThan var1) {
                super.visit(var1);
                CheckCompareResult(stack, map, ">");
            }

            @Override
            public void visit(GreaterThanEquals var1) {
                super.visit(var1);
                CheckCompareResult(stack, map, ">=");
            }

            @Override
            public void visit(MinorThan var1) {
                super.visit(var1);
                CheckCompareResult(stack, map, "<");
            }

            @Override
            public void visit(MinorThanEquals var1) {
                super.visit(var1);
                CheckCompareResult(stack, map, "<=");
            }

            @Override
            public void visit(IsNullExpression var1) {
                super.visit(var1);
                String c = (String) stack.pop();
                if (map.containsKey(c)) {
                    Object mv = map.get(c);
                    if (var1.isNot()) {
                        if (mv == null) {
                            stack.push(false);
                        } else {
                            stack.push(true);
                        }
                    } else {
                        if (mv == null) {
                            stack.push(true);
                        } else {
                            stack.push(false);
                        }
                    }
                } else {
                    stack.push(false);
                }
            }

            @Override
            public void visit(LikeExpression var1) {
                super.visit(var1);
                Object v = stack.pop();
                String c = (String) stack.pop();
                if (map.containsKey(c)) {
                    String mv = TypeConvert.ToString(map.get(c));
                    String vv = TypeConvert.ToString(v);
                    if (var1.isNot()) {
                        if (mv.contains(vv.replace("%", ""))) {
                            stack.push(false);
                        } else {
                            stack.push(true);
                        }
                    } else {
                        if (mv.contains(vv.replace("%", ""))) {
                            stack.push(true);
                        } else {
                            stack.push(false);
                        }
                    }

                } else {
                    stack.push(false);
                }
            }

            @Override
            public void visit(StringValue var1) {
                super.visit(var1);
                stack.push(var1.getValue());
            }

            @Override
            public void visit(LongValue var1) {
                super.visit(var1);
                stack.push(var1.getValue());

            }

            @Override
            public void visit(NullValue var1) {
                super.visit(var1);
                stack.push(null);
            }

            @Override
            public void visit(DoubleValue var1) {
                super.visit(var1);
                stack.push(var1.getValue());
            }

            @Override
            public void visit(DateValue var1) {
                super.visit(var1);
                stack.push(var1.getValue());
            }

            @Override
            public void visit(InExpression inExpression) {
                super.visit(inExpression);
                Boolean flag = false;
                if (stack.size() > 1) {
                    String field = null;
                    int index = 0;
                    for (; index < stack.size(); index++) {
                        Object o = stack.get(index);
                        if (!(o instanceof Boolean)) {
                            field = (String) o;
                            break;
                        }
                    }
                    for (int i = stack.size() - 1; i > index; i--) {
                        Object v = stack.pop();
                        if (map.containsKey(field)) {
                            Object mv = map.get(field);
                            if (mv != null) {
                                v = TypeConvert.ToType(mv.getClass(), v);
                                flag = flag || TypeConvert.CompareValue(mv, v) == 0;
                            }
                        }
                    }
                    stack.pop();
                }
                stack.push(inExpression.isNot() ? !flag : flag);
            }

        };
        StringBuilder b = new StringBuilder();
        deparser.setBuffer(b);
        parseExpression.accept(deparser);
        if (stack.size() > 0) {
            return (Boolean) stack.pop();
        }
        return false;
    }

    void CheckCompareResult(Stack stack, Map map, String type) {
        Object v = stack.pop();
        String c = (String) stack.pop();
        if (map.containsKey(c)) {
            Object mv = map.get(c);
            if (mv != null) {
                v = TypeConvert.ToType(mv.getClass(), v);
                boolean result = false;
                if (type.equals("=")) {
                    result = TypeConvert.CompareValue(mv, v) == 0;
                } else if (type.equals("!=")) {
                    result = TypeConvert.CompareValue(mv, v) != 0;
                } else if (type.equals(">")) {
                    result = TypeConvert.CompareValue(mv, v) > 0;
                } else if (type.equals(">=")) {
                    result = TypeConvert.CompareValue(mv, v) >= 0;
                } else if (type.equals("<")) {
                    result = TypeConvert.CompareValue(mv, v) < 0;
                } else if (type.equals("<=")) {
                    result = TypeConvert.CompareValue(mv, v) <= 0;
                }
                if (result) {
                    stack.push(true);
                } else {
                    stack.push(false);
                }
            } else {
                if (v == null) {
                    stack.push(true);
                } else {
                    stack.push(false);
                }
            }
        } else {
            stack.push(false);
        }
    }


    /**
     * 新增一行的方法
     *
     * @return 新增的行数据
     */
    public Map<String, Object> NewRow() {
        return NewRow(new HashMap<String, Object>());
    }

    /**
     * 新增一行的方法
     *
     * @param m 新增的行数据
     * @return 新增的行数据
     */
    public Map<String, Object> NewRow(Map<String, Object> m) {
        this.Data.add(m);
        return m;
    }

    /**
     * 设置默认字段值
     *
     * @param field        字段名
     * @param defaultValue 默认值
     */
    public void SetDefaultFieldValue(String field, String defaultValue) {
        Map<String, Object> fieldValues = new HashMap<>();
        fieldValues.put(field, defaultValue);
        this.SetDefaultFieldValue(fieldValues);
    }

    /**
     * 设置默认字段值
     *
     * @param fieldValues 字段和默认值映射
     */
    public void SetDefaultFieldValue(Map<String, Object> fieldValues) {
        if (fieldValues == null) {
            return;
        }
        for (Map<String, Object> m : this.Data) {
            for (String field : fieldValues.keySet()) {
                String value = TypeConvert.ToString(m.get(field));
                if (StrUtil.isEmpty(value)) {
                    m.put(field, fieldValues.get(field));
                }
            }
        }
    }

    /**
     * 取当前对象的行的数量
     *
     * @return 行的数量
     */
    public int Size() {
        if (Data == null) {
            return 0;
        }
        return Data.size();
    }

    /**
     * 判断是否存在该列
     *
     * @param columnName 列名
     * @return 存在该列则返回true，否则返回false
     */
    public boolean HasColumn(String columnName) {
        if (this.Data == null) {
            return false;
        }
        if (getDataSchema().containsKey(columnName)) {
            return true;
        }
        if (this.Size() > 0) {
            Set<String> keys = this.Data.get(0).keySet();
            return keys.contains(columnName);
        }
        return false;
    }

    /**
     * 以列中的数据为判断依据获取一个列中值等于value的第一行
     *
     * @param columnName 列名
     * @param value      值
     * @return 符合条件的行数据
     */
    public Map<String, Object> GetRowByColumnValue(String columnName, Object value) {
        if (this.HasColumn(columnName)) {
            for (Map<String, Object> row : this.Data) {
                if ((value == null && row.get(columnName) == null) || (value != null && value.equals(row.get(columnName)))) {
                    return row;
                }
            }
        }
        return null;
    }

    /**
     * 获取某一列的全部数据
     *
     * @param columnName 列名
     * @return 列数据列表
     */
    public List<Object> GetValueListByColumn(String columnName) {
        List<Object> list = new ArrayList<>();
        if (!this.HasColumn(columnName)) return list;
        for (Map<String, Object> m : this.Data) {
            list.add(m.get(columnName));
        }
        return list;
    }

    public final String Col_field = "field";
    public final String Col_title = "title";
    public final String Col_children = "children";

    /**
     * 创建列标题的Map对象
     *
     * @param field   列名
     * @param title   标题
     * @param visible 是否可见
     * @param parent  父标题
     * @return 列标题的Map对象
     */
    public Map CreateColumnTitleMap(String field, String title, boolean visible, Class type, Map parent) {
        Map mapc = new HashMap();
        mapc.put(Col_field, field);
        mapc.put(Col_title, title);
        mapc.put("visible", visible);
        if (type != null) {
            if (type.equals(String.class)) {
                mapc.put("align", "left");
            } else if (type.isAssignableFrom(Number.class)) {
                mapc.put("align", "right");
            }
            mapc.put("type", TypeConvert.ToTypeString(type));
            mapc.put("classType", type.getSimpleName());
        }
        mapc.put("sorter", false);
        if (parent != null) {
            List<Map> list = (List<Map>) parent.get(Col_children);
            if (list == null) {
                list = new ArrayList<>();
                parent.put(Col_children, list);
            }
            list.add(mapc);
        } else {
            this.DataColumns.add(mapc);
        }
        return mapc;
    }

    /**
     * 创建列标题的Map对象
     *
     * @param field 列名
     * @return 列标题的Map对象
     */
    public Map CreateColumnTitleMap(String field) {
        return CreateColumnTitleMap(field, field, true, null, null);
    }

    /**
     * 创建列标题的Map对象
     *
     * @param field   列名
     * @param visible 是否可见
     * @return 列标题的Map对象
     */
    public Map CreateColumnTitleMap(String field, boolean visible) {
        return CreateColumnTitleMap(field, field, visible, null, null);
    }

    public List<Map> GetLeafColumnTitleMaps() {
        return GetLeafColumnTitleMaps(this.DataColumns, new ArrayList<>());
    }

    public List<Map> GetLeafColumnTitleMaps(List<Map> columns, List<Map> list) {
        for (Map m : columns) {
            List<Map> sublist = (List<Map>) m.get(Col_children);
            if (sublist != null && sublist.size() > 0) {
                this.GetLeafColumnTitleMaps(sublist, list);
            } else {
                list.add(m);
            }
        }
        return list;
    }

    public boolean DeleteColumnTitleMap(Map col) {
        boolean ret = false;
        for (Map m : this.DataColumns) {
            if (m.equals(col)) {
                this.DataColumns.remove(m);
                ret = true;
            } else {
                ret = this.recurseDeleteColumnTitleMap(col, m);
            }
            if (ret) {
                break;
            }
        }
        return ret;
    }

    boolean recurseDeleteColumnTitleMap(Map col, Map parent) {
        boolean ret = false;
        List<Map> sublist = (List<Map>) parent.get(Col_children);
        if (sublist != null) {
            for (Map m : sublist) {
                if (m.equals(col)) {
                    sublist.remove(m);
                    if (sublist.isEmpty()) {
                        DeleteColumnTitleMap(parent);
                    }
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }

    /**
     * 将DataTable对象转换为分页对象要求的JSON字符串
     *
     * @param pagination 分页对象
     * @return 分页对象要求的JSON字符串
     */
    public String ToPageJson(BaseQuery pagination) {
        Map<String, Object> m = new HashMap<String, Object>();
        m.put("rows", this.Data);
        m.put("total", this.Data.size());
        if (pagination != null) {
            if (this.Data.size() > pagination.PageSize && pagination.PageSize > 0) {
                int endIndex = TypeConvert.ToInteger(pagination.PageIndex + pagination.PageSize);
                endIndex = endIndex > this.Data.size() ? this.Data.size() : endIndex;
                List<Map<String, Object>> d = this.Data.subList(TypeConvert.ToInteger(pagination.PageIndex), endIndex);
                m.put("rows", d);
            }
        }
        if (this.DataColumns.size() > 0) {
            m.put("columns", this.DataColumns);
        }
        if (this.TotalResult != null && this.TotalResult.keySet().size() > 0) {
            m.put("totalResult", this.TotalResult);
        }
        AjaxResult ar = AjaxResult.True();
        ar.setValue(m);
        return ar.ToJson();
    }

    /**
     * 将DataTable对象转换为树形结构的JSON字符串
     */
    public void ToTreeFirstLevel() {
        List<Map<String, Object>> delete = new ArrayList<>();
        for (Map<String, Object> d : this.Data) {
            String pid = TypeConvert.ToString(d.get(BaseModelTree.F_Parentid));
            Map<String, Object> pObj = GetRowByIDField(pid);
            if (pObj != null) {
                delete.add(d);
            }
        }
        for (Map<String, Object> d : delete) {
            this.Data.remove(d);
        }
    }

    /**
     * 将DataTable对象转换为树形结构
     *
     * @return 转换后的树形结构
     */
    public DataTable ToTree() {
        List<Map<String, Object>> delete = new ArrayList<>();
        for (Map<String, Object> d : this.Data) {
            String pid = TypeConvert.ToString(d.get(BaseModelTree.F_Parentid));
            Map<String, Object> pObj = GetRowByIDField(pid);
            if (pObj != null) {
                List<Map<String, Object>> t = (List<Map<String, Object>>) pObj.get(BaseModelTree.F_Children);
                if (t == null) {
                    t = new ArrayList<>();
                    pObj.put(BaseModelTree.F_Children, t);
                }
                t.add(d);
                delete.add(d);
            }
        }
        for (Map<String, Object> d : delete) {
            this.Data.remove(d);
        }
        return this;
    }

    /**
     * 将DataTable对象转换为JSON字符串
     *
     * @return JSON字符串
     */
    public String ToJson() {
        Map<String, Object> m = new HashMap<>();
        m.put("rows", this.Data);
        if (Total > this.Data.size()) {
            m.put("total", Total);
        } else {
            m.put("total", this.Data.size());
        }
        if (this.DataColumns.size() > 0) {
            m.put("columns", this.DataColumns);
        }
        if (this.TotalResult != null && this.TotalResult.keySet().size() > 0) {
            m.put("totalResult", this.TotalResult);
        }
        AjaxResult ar = AjaxResult.True();
        ar.setValue(m);
        return ar.ToJson();
    }

    /**
     * 将DataTable转换而成的json数据再解析回DataTable类型
     *
     * @param json JSON字符串
     * @return 解析后的DataTable对象
     */
    public static DataTable FromListJson(String json) {
        List<Map<String, Object>> l = TypeConvert.FromListMapJson(json);
        DataTable dt = new DataTable(l);
        return dt;
    }


}
