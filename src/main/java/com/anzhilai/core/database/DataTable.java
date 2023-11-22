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

// 该类用于返回一个表格Json
public class DataTable  {
    private static Logger log = Logger.getLogger(DataTable.class);
    public List<Map<String, Object>> Data;//行数据
    public Map<String, String> DbDataSchema;//数据库列数据的类型
    public Map<String, Class<?>> DataSchema;//列数据的类型
    public List<Map> DataColumns;   //列的顺序
    public Long Total=0L;//分页信息
    public Map<String,Object> TotalResult; //统计信息

    public enum RowAlign{
        left, center, right
    }

    //region 构造方法们
    public DataTable() {
        this(new ArrayList<>());
    }

    public DataTable(List<Map<String, Object>> data) {
        this(data, new LinkedHashMap<>());
    }

    public DataTable(List<Map<String, Object>> data, Map<String, Class<?>> schema) {
        super();
        Data = data;
        DataSchema = schema;
        DataColumns = new ArrayList<>();
    }
    //endregion

    public DataTable Clone(){
        DataTable result = new DataTable();
        for (Map row : Data) {
            Map _map = new HashMap();
            _map.putAll(row);
            result.Data.add(_map);
        }
        return result;
    }

    //region GetSet们
    public List<Map<String, Object>> getData() {
        return Data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.Data = data;
    }

    public Map<String, Class<?>> getDataSchema() {
        return DataSchema;
    }

    public void setDataSchema(Map<String, Class<?>> dataSchema) {
        DataSchema = dataSchema;
    }


    public DataTable MergeTable(DataTable dt) {
        this.Data.addAll(dt.Data);
        return this;
    }


    public void AddColumn(String name, Class _class) {
        this.DataSchema.put(name, _class);
        if(DataColumns==null){
            DataColumns = new ArrayList<>();
        }
        DataColumns.add(CreateColumnMap(name));
    }

    public List<Map> GetColumns(){
        return DataColumns;
    }

    public void AddRow(Map<String, Object> m) {
        this.getData().add(m);
        Total++;
    }
    public void AddRows(List<Map> list) {
        for(Map m:list) {
            this.getData().add(m);
            Total++;
        }
    }
    public void InsertRow(Map<String, Object> m, int position) {
        this.getData().add(position, m);
        Total++;
    }

    public int IndexOfRow(Map<String, Object> m) {
        return this.getData().indexOf(m);
    }

    String idField;
    HashMap<String, Map<String, Object>> hashRow = new HashMap<>();

    public void InitHashByIDField() {
        InitHashByIDField(BaseModel.F_id);
    }
    public void InitHashByIDField(String field) {
        idField = field;
        for (Map m : this.Data) {
            hashRow.put(TypeConvert.ToString(m.get(idField)), m);
        }
    }

    public Map<String, Object> GetRowByIDField(String id) {
        if(hashRow.size()<this.Data.size()){
            this.InitHashByIDField();
        }
        if(hashRow.containsKey(id)){
            return hashRow.get(id);
        }
        return null;
    }

    void CheckCompareResult(Stack stack,Map map,String type){
        Object v = stack.pop();
        String c = (String) stack.pop();
        if(map.containsKey(c)){
            Object mv = map.get(c);
            if(mv!=null) {
                v = TypeConvert.ToType(mv.getClass(), v);
                boolean result=false;
                if(type.equals("=")){
                    result =TypeConvert.CompareValue(mv, v) == 0;
                }else if(type.equals("!=")){
                    result =TypeConvert.CompareValue(mv, v) != 0;
                }else if(type.equals(">")){
                    result =TypeConvert.CompareValue(mv, v) > 0;
                }else if(type.equals(">=")){
                    result =TypeConvert.CompareValue(mv, v) >= 0;
                }else if(type.equals("<")){
                    result =TypeConvert.CompareValue(mv, v) < 0;
                }else if(type.equals("<=")){
                    result =TypeConvert.CompareValue(mv, v) <= 0;
                }
                if (result) {
                    stack.push(true);
                } else {
                    stack.push(false);
                }
            }else{
                if(v==null){
                    stack.push(true);
                }else{
                    stack.push(false);
                }
            }
        }else{
            stack.push(false);
        }
    }

    public DataTable FilterToNewTable(String expr){
        DataTable dt = new DataTable();
        dt.setDataSchema(this.DataSchema);
        for(Map m:this.Data){
             if(CheckMapCond(m,expr)){
                 dt.AddRow(m);
             }
        }
        return dt;
    }

    public boolean CheckMapCond(Map map,String expr) {
        final Stack<Object> stack = new Stack<Object>();
        if(StrUtil.isEmpty(expr)){
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
                Boolean b1=(Boolean) stack.pop();
                Boolean b2=(Boolean) stack.pop();
                stack.push(b1&b2);
            }

            @Override
            public void visit(OrExpression or) {
                super.visit(or);
                Boolean b1=(Boolean) stack.pop();
                Boolean b2=(Boolean) stack.pop();
                stack.push(b1||b2);
            }

            @Override
            public void visit(Column column) {
                super.visit(column);
                stack.push(column.getColumnName());
            }

            @Override
            public void visit(EqualsTo var1) {
                super.visit(var1);
                CheckCompareResult(stack,map,"=");
//                String key = var1.getLeftExpression().toString();
//                Object v = var1.getRightExpression().getASTNode().jjtGetValue();
            }
            @Override
            public void visit(NotEqualsTo var1) {
                super.visit(var1);
                CheckCompareResult(stack,map,"!=");
            }
            @Override
            public void visit(GreaterThan var1) {
                super.visit(var1);
                CheckCompareResult(stack,map,">");
            }
            @Override
            public void visit(GreaterThanEquals var1) {
                super.visit(var1);
                CheckCompareResult(stack,map,">=");
            }
            @Override
            public void visit(MinorThan var1) {
                super.visit(var1);
                CheckCompareResult(stack,map,"<");
            }
            @Override
            public void visit(MinorThanEquals var1) {
                super.visit(var1);
                CheckCompareResult(stack,map,"<=");
            }
            @Override
            public void visit(IsNullExpression var1) {
                super.visit(var1);
                String c = (String) stack.pop();
                if(map.containsKey(c)) {
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
                }else{
                    stack.push(false);
                }
            }
            @Override
            public void visit(LikeExpression var1) {
                super.visit(var1);
                Object v = stack.pop();
                String c = (String) stack.pop();
                if(map.containsKey(c)){
                    String mv = TypeConvert.ToString(map.get(c));
                    String vv = TypeConvert.ToString(v);
                    if (var1.isNot()) {
                        if(mv.contains(vv.replace("%",""))){
                            stack.push(false);
                        }else {
                            stack.push(true);
                        }
                    }else{
                        if(mv.contains(vv.replace("%",""))){
                            stack.push(true);
                        }else {
                            stack.push(false);
                        }
                    }

                }else{
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
                if(stack.size()>1){
                    String field = null;
                    int index = 0;
                    for (; index < stack.size(); index++) {
                        Object o = stack.get(index);
                        if(! (o instanceof  Boolean)){
                            field = (String)o;
                            break;
                        }
                    }
                    for (int i = stack.size()-1; i > index; i--) {
                        Object v = stack.pop();
                        if(map.containsKey(field)) {
                            Object mv = map.get(field);
                            if (mv != null) {
                                v = TypeConvert.ToType(mv.getClass(), v);
                                flag = flag || TypeConvert.CompareValue(mv, v) == 0;
                            }
                        }
                    }
                    stack.pop();
                }
                stack.push(inExpression.isNot()?!flag:flag);
            }

        };
        StringBuilder b = new StringBuilder();
        deparser.setBuffer(b);
        parseExpression.accept(deparser);
        if(stack.size()>0){
            return (Boolean) stack.pop();
        }
        return false;
    }



    // 新增一行的方法
    public Map<String, Object> NewRow() {
        return NewRow(new HashMap<String, Object>());
    }

    public Map<String, Object> NewRow(Map<String, Object> m) {
        this.Data.add(m);
        return m;
    }



    // 取当前对象的行的数量
    public int Size() {
        if (Data == null) {
            return 0;
        }
        return Data.size();
    }

    // 判断是否存在该列
    public boolean HasColumn(String columnName) {
        if (getDataSchema().containsKey(columnName)) {
            return true;
        }
        if (this.Size() > 0) {
            Set<String> keys = this.Data.get(0).keySet();
            return keys.contains(columnName);
        }
        return false;
    }

    // 以列中的数据为判断依据获取一个列中值等于value的第一行
    public Map<String, Object> GetRowByColumn(String columnName, Object value) {
        if (this._NotHasByColumn(columnName, value)) return null;
        for (Map<String, Object> row : this.Data) {
            if ((value == null && row.get(columnName) == null) || (value != null && value.equals(row.get(columnName)))) {
                return row;
            }
        }
        return null;
    }

    // 以列中的数据为判断依据判断值在不在一个列中
    public boolean HasValueByColumn(String columnName, Object value) {
        if (this._NotHasByColumn(columnName, value)) return false;
        for (Map<String, Object> row : this.Data) {
            if (value.equals(row.get(columnName))) {
                return true;
            }
        }
        return false;
    }

    // 以列中的数据为判断依据获取一个新的DataTable
    public DataTable GetDataTableByColumn(String columnName, Object value) {
        if (this._NotHasByColumn(columnName, value)) return new DataTable();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map<String, Object> m : this.Data) {
            if (!m.containsKey(columnName)) {
                return new DataTable();
            }
            if (m.get(columnName).equals(value)) {
                list.add(m);
            }
        }
        return new DataTable(list, this.DataSchema);
    }

    // 获取某一列的全部数据
    public List<Object> GetValueListByColumn(String columnName) {
        List<Object> list = new ArrayList<>();
        if (this._NotHasByColumn(columnName)) return list;
        for (Map<String, Object> m : this.Data) {
            list.add(m.get(columnName));
        }
        return list;
    }

    // 以一个列为key.一个列为value循环所有行来生成一个map
    public Map<String, Object> GetMapByDoubleColumn(String keyColumnName, String valueColumnName) {
        Map<String, Object> map = new HashMap<String, Object>();
        if (this._NotHasByColumn(keyColumnName) || this._NotHasByColumn(valueColumnName)) return map;
        for (Map<String, Object> m : this.Data) {
            String key = TypeConvert.ToString(m.get(keyColumnName));
            Object value = m.get(valueColumnName);
            map.put(key, value);
        }
        return map;
    }

    public Map<Object, Map<String, Object>> GetMapByColumn(String keyColumn) {
        HashMap<Object, Map<String, Object>> map = new HashMap<>();
        if (this._NotHasByColumn(keyColumn)) return map;
        for (Map<String, Object> row : this.Data) {
            Map<String, Object> newRow = new HashMap<>(row);
            Object key = newRow.remove(keyColumn);
            map.put(key, newRow);
        }
        return map;
    }

    // 查询列值之前的判断封装,不建议外部调用
    public boolean _NotHasByColumn(String columnName) {
        return _NotHasByColumn(columnName, " ");
    }

    public boolean _NotHasByColumn(String columnName, Object value) {
        return this.Data == null || value == null || !HasColumn(columnName);
    }
    //endregion

    public void PrintSystemOut(){
        for (Object c:this.GetColumns()){
            System.out.print(c+"         ");
        }
        System.out.println("");
        for(Map m:this.Data){
            for (Object c:this.GetColumns()){
                System.out.print(m.get(c)+"         ");
            }
            System.out.println("");
        }
    }

    public Map AddColumnMap(String field){
        Map m = CreateColumnMap(field);
        this.DataColumns.add(m);
        return m;
    }
    public Map AddColumnMap(Map m){
        this.DataColumns.add(m);
        return m;
    }
    public Map AddColumnChildren(String field,List<Map> children){
        Map m = CreateColumnMap(field);
        for(Map mm:this.DataColumns){
            if(field.equals(mm.get("field"))){
                m = mm;
                break;
            }
        }
        if(children!=null){
            m.put("children",children);
        }
        this.DataColumns.add(m);
        return m;
    }
    public Map AddColumnChildren(String pField,String childrenField){
        Map pm = CreateColumnMap(pField);
        for(Map mm:this.DataColumns){
            if(pField.equals(mm.get("field"))){
                pm = mm;
                break;
            }
        }
        Map mc = CreateColumnMap(childrenField);
        List<Map> lmc = (List<Map>)pm.get("children");
        if(lmc==null){
            lmc = new ArrayList<Map>();
            pm.put("children",lmc);
        }
        lmc.add(mc);
        return mc;
    }


    public static Map CreateColumnMap(String field,String title,boolean visible,List children){
        Map mapc =new HashMap();
        mapc.put("field",field);
        mapc.put("title",title);
        if(children!=null){
            mapc.put("children",children);
        }
        mapc.put("visible",visible);
        return mapc;
    }

    public static Map CreateColumnMap(String field,List children){
        return CreateColumnMap(field,field,true,children);
    }
    public static Map CreateColumnMap(String field,String title){
        return CreateColumnMap(field,title,true,null);
    }
    public static Map CreateColumnMap(String field){
        return CreateColumnMap(field,field,true,null);
    }
    public static Map CreateColumnMap(String field,boolean visible){
        return CreateColumnMap(field,field,visible,null);
    }
    public static Map CreateColumnMap(String field,Class t,boolean visible){
        Map m = CreateColumnMap(field,field,visible,null);
        m.put("type",TypeConvert.ToTypeString(t));
        m.put("classType", t.getSimpleName());
        return m;
    }

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
        if(this.DataColumns!=null&&this.DataColumns.size()>0){
            m.put("columns",this.DataColumns);
        }
        if(this.TotalResult!=null&&this.TotalResult.keySet().size()>0){
            m.put("totalResult",this.TotalResult);
        }
        AjaxResult ar = new AjaxResult();
        ar.setValue(m);
        return ar.ToJson("yyyy-MM-dd HH:mm:ss");
    }

    public void ToTreeFirstLevel(){
        List<Map<String, Object>> delete = new ArrayList<>();
        for( Map<String, Object> d:this.Data){
            String pid = TypeConvert.ToString(d.get(BaseModelTree.F_Parentid));
            Map<String, Object> pObj = GetRowByIDField(pid);
            if(pObj != null){
                delete.add(d);
            }
        }
        for( Map<String, Object> d:delete){
            this.Data.remove(d);
        }
    }
    public DataTable ToTree(){
        List<Map<String, Object>> delete = new ArrayList<>();
        for(Map<String, Object> d:this.Data){
            String pid = TypeConvert.ToString(d.get(BaseModelTree.F_Parentid));
            Map<String, Object> pObj = GetRowByIDField(pid);
            if(pObj != null){
                List<Map<String, Object>> t = (List<Map<String, Object>>)pObj.get(BaseModelTree.F_Children);
                if(t == null){
                    t = new ArrayList<>();
                    pObj.put(BaseModelTree.F_Children,t);
                }
                t.add(d);
                delete.add(d);
            }
        }
        for( Map<String, Object> d:delete){
            this.Data.remove(d);
        }
        return this;
    }

    public DataTable TreeToNewTable(){
        DataTable newtable =new DataTable();
        for(Map<String, Object> d:this.Data){
            String pid = TypeConvert.ToString(d.get(BaseModelTree.F_Parentid));
            Map<String, Object> pObj = GetRowByIDField(pid);
            if(pObj != null){
                List<Map<String, Object>> t = (List<Map<String, Object>>)pObj.get(BaseModelTree.F_Children);
                if(t == null){
                    t = new ArrayList<>();
                    pObj.put(BaseModelTree.F_Children,t);
                }
                t.add(d);
            }else{
                newtable.AddRow(d);
            }
        }
        return newtable;
    }

    public DataTable GroupByToNewTable(String groupbyField,Map<String,String> mapFieldToNewField){
        DataTable newtable =new DataTable();
        HashMap<String,Map<String,Object>> hash=new HashMap<>();
        for(Map<String, Object> m:this.Data){
            String groupby = TypeConvert.ToString(m.get(groupbyField));
            if(!hash.containsKey(groupby)){
                hash.put(groupby,m);
                newtable.AddRow(m);
            }

            Map<String,Object> oldm=hash.get(groupby);
            for(String field:mapFieldToNewField.keySet()){
                String nvalue=TypeConvert.ToString(m.get(field));
                String nfield = mapFieldToNewField.get(field);
                List<String> listv=StrUtil.splitToList(TypeConvert.ToString(oldm.get(nfield)));
                if(!listv.contains(nvalue)){
                    listv.add(nvalue);
                }
                oldm.put(nfield,StrUtil.join(listv));
            }
        }
        return newtable;
    }



    public String ToTreeJson(){
        return ToTreeJson("rows");
    }

    public String ToTreeJson(String key){
        if(this.Data==null){
            return ToJson();
        }
        if(this.Data.size()==0){
            return ToJson();
        }
        long to = this.Data.size();
        Map<String, Object> m = new HashMap<>();
        this.ToTree();
        m.put(key, this.Data);
        if (Total>to) {
            m.put("total", Total);
        }else{
            m.put("total",to);
        }
        if(this.TotalResult!=null&&this.TotalResult.keySet().size()>0){
            m.put("totalResult",this.TotalResult);
        }
        AjaxResult ar = new AjaxResult();
        ar.setValue(m);
        return ar.ToJson();
    }
    public String ToListJson(){
        return TypeConvert.ToJson(this.Data);
    }
    public String ToJson() {
        return this.ToJson("yyyy-MM-dd HH:mm:ss");
    }
    public String ToJson(String dateFormat) {
        Map<String, Object> m = new HashMap<>();
        m.put("rows", this.Data);
        if (Total>this.Data.size()) {
            m.put("total", Total);
        }else{
            m.put("total", this.Data.size());
        }
        if(this.DataColumns!=null&&this.DataColumns.size()>0){
            m.put("columns",this.DataColumns);
        }
        if(this.TotalResult!=null&&this.TotalResult.keySet().size()>0){
            m.put("totalResult",this.TotalResult);
        }
        AjaxResult ar = new AjaxResult();
        ar.setValue(m);
        return ar.ToJson(dateFormat);
    }


    // 将DataTable转换而成的json数据再解析回DataTable类型
    public static DataTable FromMapJson(String json) {
        Map<String, Object> m = TypeConvert.FromMapJson(json);
        DataTable dt = new DataTable((List<Map<String, Object>>) m.get("rows"));
        return dt;
    }
    public static DataTable FromListJson(String json) {
        List<Map<String, Object>> l = TypeConvert.FromListMapJson(json);
        DataTable dt = new DataTable(l);
        return dt;
    }


}
