package com.anzhilai.core.database;

import com.anzhilai.core.base.XQuery;
import com.anzhilai.core.toolkit.StrUtil;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * SQL语句辅助生成的信息类
 * Created on 2017-04-26.
 */
public class SqlInfo {
    private static Logger log = Logger.getLogger(SqlInfo.class);

    public enum E_SqlType {
        insert, delete, update, select
    }
    public E_SqlType sqlType = null;
    /**
     * SQL语句缓存
     */
    StringBuffer sb = new StringBuffer();
    /**
     * 构造方法
     */
    public SqlInfo(){
    }

    /**
     * 创建select语句
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateSelect() {
        sqlType = E_SqlType.select;
        sb.append("select ");
        return this;
    }
    /**
     * 创建select语句
     * @param columns 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateSelect(String columns) {
        sqlType = E_SqlType.select;
        sb.append("select "+columns+" ");
        return this;
    }
    /**
     * 创建带有distinct的select语句
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateSelectDistinct() {
        sqlType = E_SqlType.select;
        sb.append("select distinct ");
        return this;
    }
    /**
     * 创建select * from语句
     * @param fromtable 表名
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateSelectAll(String fromtable) {
        sqlType = E_SqlType.select;
        sb.append("select * from " + fromtable + " ");
        TableList.add(fromtable);
        return this;
    }

    /**
     * 追加内容到SQL语句中
     * @param content 要追加的内容
     * @return SqlInfo当前实例
     */
    public SqlInfo Append(String content) {
        sb.append(" " + content + ", ");
        return this;
    }
    /**
     * 追加统计语句
     * @param fromTable 数据表
     * @param statType 统计类型
     * @param statField 统计字段
     * @param asName 统计字段别名
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendStat(String fromTable, String statType, String statField, String asName) {
        sb.append(" "+statType+"(" + fromTable + "." + statField + ") as "+asName + ", ");
        return this;
    }

    /**
     * 查询列定义
     */
    public class QueryColumn {
        public String table;
        public String column;
        public String asColumn;
        public XQuery.QueryType type = XQuery.QueryType.custom;
        public Object value;
        public Class<?> clazz;
        /**
         * 构造方法
         * @param t 表名
         * @param c 列名
         */
        public QueryColumn(String t, String c) {
            table = t;
            column = c;
        }
        /**
         * 构造方法
         * @param t 表名
         * @param c 列名
         * @param s XQuery.QueryType
         */
        public QueryColumn(String t, String c, XQuery.QueryType s) {
            table = t;
            column = c;
            type = s;
        }
    }
    /**
     * 查询列列表
     */
    public List<QueryColumn> listQueryColumn = new ArrayList<>();
    /**
     * 追加列
     * @param table 表名
     * @param column 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendColumn(String table, String column) {
        sb.append(" " + table + "." + column + ", ");
        if(!"*".equals(column.trim())){
            listQueryColumn.add(new QueryColumn(table,column));
        }
        return this;
    }
    /**
     * 追加列，并设置别名
     * @param table 表名
     * @param column 列名
     * @param asName 列别名
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendColumn(String table, String column, String asName) {
        sb.append(" " + table + "." + column + " as " + asName + ", ");
        QueryColumn qc = new QueryColumn(table,column, XQuery.QueryType.like);
        qc.asColumn = asName;
        listQueryColumn.add(qc);
        return this;
    }
    /**
     * 追加列，并设置类型和类
     */
    public SqlInfo AppendColumn(String table, String column, XQuery.QueryType type, Class<?> clazz) {
        sb.append(" ").append(table).append(".").append(column).append(", ");
        QueryColumn qc = new QueryColumn(table,column,type);
        qc.clazz = clazz;
        listQueryColumn.add(qc);
        return this;
    }

    /**
     * 追加列，并设置别名、类型和类
     * @param table 表名
     * @param column 列名
     * @param asName 列别名
     * @param type 列类型
     * @param clazz 列类
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendColumn(String table, String column, String asName, XQuery.QueryType type, Class<?> clazz) {
        sb.append(" " + table + "." + column + " as " + asName + ", ");
        QueryColumn qc = new QueryColumn(table,column,type);
        qc.asColumn = asName;
        qc.clazz = clazz;
        listQueryColumn.add(qc);
        return this;
    }
    /**
     * 追加求和列
     * @param table 表名
     * @param column 列名
     * @param asName 列别名
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendSumColumn(String table, String column, String asName) {
        sb.append(" sum( "+table+"." + column + ") as "+asName+", ");
        return this;
    }
    /**
     * 追加计数列
     * @param table 表名
     * @param column 列名
     * @param asName 列别名
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendCountColumn(String table, String column, String asName) {
        sb.append(" count( "+table+"." + column + ") as "+asName+", ");
        return this;
    }
    /**
     * 结束列追加
     * @return SqlInfo当前实例
     */
    public SqlInfo EndColumn() {
        CutEnd(sb, ", ");
        return this;
    }
    /**
     * 当前主表名
     */
    public String CurrentMainTable;
    /**
     * 表名列表
     */
    public List<String> TableList = new ArrayList<String>() {
        @Override
        public boolean add(String s) {
            if (this.contains(s)) {
                return false;
            }
            return super.add(s);
        }
    };

    /**
     * sql中from表的子语句
     */
    public StringBuffer sbtable = new StringBuffer();
    /**
     * 设置主表
     * @param tableName 表名
     * @return SqlInfo当前实例
     */
    public SqlInfo SetMainTable(String tableName){
        CurrentMainTable = tableName;
        this.TableList.add(tableName);
        return this;
    }
    /**
     * From语句
     * @param table 表名
     * @return SqlInfo当前实例
     */
    public SqlInfo From(String table) {
        return From(table, null);
    }
    /**
     * From语句
     * @param table 表名
     * @param asName 别名
     * @return SqlInfo当前实例
     */
    public SqlInfo From(String table, String asName) {
        CurrentMainTable = table;
        sbtable.append(" " + table + " ");
        if (StrUtil.isNotEmpty(asName)) {
            sbtable.append("as " + asName + " ");
            TableList.add(asName);
        } else {
            TableList.add(table);
        }
        return this;
    }

    public enum JoinType{
        leftJoin,innerJoin,rightJoin
    }
    /**
     * 加入表连接语句
     * @param joinType 连接类型
     * @param joinsql 连接语句
     * @param asTable 表别名
     * @param asTableField 表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo JoinTableSql(JoinType joinType, String joinsql, String asTable, String asTableField, String othertable, String otherTableField) {

        this.JoinTableSql(joinType,joinsql,asTable,asTable + "." + asTableField +" = " + othertable + "." + otherTableField + " ");
        return this;
    }
    /**
     * 加入表连接语句
     * @param joinType 连接类型
     * @param joinsql 连接语句
     * @param asTable 表别名
     * @param oncond 连接条件
     * @return SqlInfo当前实例
     */
    public SqlInfo JoinTableSql(JoinType joinType, String joinsql, String asTable, String oncond) {
        if (joinType.name().equals(JoinType.innerJoin.name())) {
            sbtable.append(" inner join ");
        } else if (joinType.name().equals(JoinType.leftJoin.name())) {
            sbtable.append(" left join ");
        } else if (joinType.name().equals(JoinType.rightJoin.name())) {
            sbtable.append(" right join ");
        }
        sbtable.append(" (" + joinsql + ") as "+asTable+" on (" + oncond+")");
        TableList.add(asTable);
        return this;
    }
    /**
     * 内连接
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param currentTableField 当前表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo InnerJoin(String joinTable, String joinTableField, String currentTableField) {
        sbtable.append(" inner join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + CurrentMainTable + "." + currentTableField + " ");
        TableList.add(joinTable);
        return this;
    }

    /**
     * 内连接
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo InnerJoin(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" inner join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTable);
        return this;
    }
    /**
     * 内连接
     * @param joinTable 连接表
     * @param joinTableAs 连接表别名
     * @param joinTableField 连接表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo InnerJoin(String joinTable, String joinTableAs, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" inner join " + joinTable +" as "+joinTableAs+ " on " + joinTableAs + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTableAs);
        return this;
    }
    /**
     * 左连接
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param currentTableField 当前表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo LeftJoin(String joinTable, String joinTableField, String currentTableField) {
        sbtable.append(" left join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + CurrentMainTable + "." + currentTableField + " ");
        TableList.add(joinTable);
        return this;
    }
    /**
     * 左连接
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo LeftJoin(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" left join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTable);
        return this;
    }
    /**
     * 左连接
     * @param joinTable 连接表
     * @param joinTableAs 连接表别名
     * @param joinTableField 连接表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo LeftJoin(String joinTable, String joinTableAs, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" left join " + joinTable+" as "+joinTableAs+ " on " + joinTableAs + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTableAs);
        return this;
    }
    /**
     * 右连接
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param currentTableField 当前表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo RightJoin(String joinTable, String joinTableField, String currentTableField) {
        sbtable.append(" right join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + CurrentMainTable + "." + currentTableField + " ");
        TableList.add(joinTable);
        return this;
    }
    /**
     * 右连接
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo RightJoin(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" right join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTable);
        return this;
    }
    /**
     * 连接条件为AND
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo JoinAnd(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" and " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        return this;
    }
    /**
     * 连接条件为AND
     * @param and 连接条件
     * @return SqlInfo当前实例
     */
    public SqlInfo JoinAnd(String and) {
        sbtable.append(" and " + and);
        return this;
    }
    /**
     * 连接条件为AND并相等
     * @param table 表名
     * @param tableField 表字段
     * @param value 值
     * @return SqlInfo当前实例
     */
    public SqlInfo JoinOnAndEqual(String table, String tableField, String value) {
        sbtable.append(" and " + table + "." + tableField + "=?");
        AddParam(value);
        return this;
    }

    /**
     * where条件子语句缓存
     */
    public StringBuffer sbwhere = new StringBuffer();


    /**
     * 参数列表
     */
    ArrayList<Object> params = new ArrayList<>();
    /**
     * 添加参数
     * @param o 参数值
     * @return SqlInfo当前实例
     */
    public SqlInfo AddParam(Object o){
        params.add(o);
        return this;
    }
    /**
     * 添加参数列表
     * @param list 参数列表
     * @return SqlInfo当前实例
     */
    public SqlInfo AddParams(List<Object> list){
        params.addAll(list);
        return this;
    }
    /**
     * 获取参数数组
     * @return 参数数组
     */
    public Object[] GetParams(){
        return params.toArray();
    }
    /**
     * 获取参数列表
     * @return 参数列表
     */
    public List<Object> GetParamsList(){
        return params;
    }
    /**
     * 添加Where条件
     * @param cond 条件语句
     * @return SqlInfo当前实例
     */
    public SqlInfo Where(String cond) {
        sbwhere.append(" " + cond + " ");
        return this;
    }
    /**
     * 添加相等的Where条件
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo WhereEqual(String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" " + field + " = ? ");
        }
        return this;
    }
    /**
     * 添加相等的Where条件
     * @param table 表名
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo WhereEqual(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" (" + table + "." + field + " = ?) ");
        }
        return this;
    }
    /**
     * 添加LIKE的Where条件
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo WhereLike(String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" " + field + " like ? ");
        }
        return this;
    }
    /**
     * 添加LIKE的Where条件
     * @param table 表名
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo WhereLike(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" (" + table + "." + field + " like ?) ");
        }
        return this;
    }

    /**
     * 添加AND条件
     * @param cond 条件语句
     * @return SqlInfo当前实例
     */
    public SqlInfo And(String cond) {
        if (StrUtil.isNotEmpty(cond)) {
            sbwhere.append(" and (" + cond + ") ");
        }
        return this;
    }
    /**
     * 添加AND条件
     * @param joinTable 连接表
     * @param joinTableField 连接表字段
     * @param othertable 其他表
     * @param otherTableField 其他表字段
     * @return SqlInfo当前实例
     */
    public SqlInfo And(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbwhere.append(" and " + joinTable + "." + joinTableField + " ");
        sbwhere.append(" = " + othertable + "." + otherTableField + " ");
        return this;
    }
    /**
     * 添加相等的AND条件
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo AndEqual(String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" and (" + field + "=?) ");
        }
        return this;
    }
    /**
     * 添加AND条件，判断是否为null
     * @param field 列名
     * @param isnullornot 是否为null
     * @return SqlInfo当前实例
     */
    public SqlInfo AndIsNull(String field,boolean isnullornot) {
        if (StrUtil.isNotEmpty(field)) {
            if(isnullornot){
                sbwhere.append(" and (" + field + " is null) ");
            }else{
                sbwhere.append(" and (" + field + " is not null) ");
            }

        }
        return this;
    }
    /**
     * 添加相等的AND条件
     * @param table 表名
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo AndEqual(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" and ("+table+"." + field + "=?) ");
        }
        return this;
    }
    /**
     * 添加LIKE的AND条件
     * @param table 表名
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo AndLike(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" and ("+table+"." + field + " like ?) ");
        }
        return this;
    }
    /**
     * 添加OR条件
     * @param cond 条件语句
     * @return SqlInfo当前实例
     */
    public SqlInfo Or(String cond) {
        if (StrUtil.isNotEmpty(cond)) {
            sbwhere.append(" or (" + cond + ") ");
        }
        return this;
    }
    /**
     * 添加相等的OR条件
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo OrEqual(String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" or (" + field + "=?) ");
        }
        return this;
    }
    /**
     * 添加相等的OR条件
     * @param table 表名
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo OrEqual(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" or ("+table+"." + field + "=?) ");
        }
        return this;
    }
    /**
     * 添加LIKE的OR条件
     * @param table 表名
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo OrLike(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            if (StrUtil.isNotEmpty(table)) {
                sbwhere.append(" or (" + table + "." + field + " like ?) ");
            } else {
                sbwhere.append(" or (" + field + " like ?) ");
            }
        }
        return this;
    }

    /**
     * IN条件
     * @param table 表名
     * @param column 列名
     * @param values 值数组
     * @return SqlInfo当前实例
     */
    public SqlInfo In(String table, String column, Object[] values) {
        sbwhere.append(" and " + table + "." + column + " in (");
        for (Object s : values) {
            sbwhere.append("?,");
            AddParam(s);
        }
        CutEnd(sbwhere, ",");
        sbwhere.append(")");
        return this;
    }

    /**
     * group by子语句缓存
     */
    public StringBuffer sbgroupby = new StringBuffer();
    /**
     * 追加group by
     * @param cond 条件
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendGroupBy(String cond) {
        return AppendGroupBy(null, cond);
    }
    /**
     * 追加group by
     * @param table 表名
     * @param cond 条件
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendGroupBy(String table, String cond) {
        if (sbgroupby.length() == 0) {
            sbgroupby.append(" group by ");
        } else {
            sbgroupby.append(" , ");
        }
        if (StrUtil.isNotEmpty(table)) {
            sbgroupby.append(table + ".");
        }
        sbgroupby.append(cond);
        return this;
    }
    /**
     * order by语句缓存
     */
    public StringBuffer sborderby = new StringBuffer();
    /**
     * 创建带有排序的列
     * @param table 表名
     * @param column 列名
     * @param isAsc 是否升序
     * @return SqlInfo当前实例
     */
    public static String CreateOrderBy(String table, String column, boolean isAsc) {
        if (isAsc) {
            return table + "." + column + " asc ";
        } else {
            return table + "." + column + " desc ";
        }
    }
    /**
     * 创建带有排序的列
     * @param table 表名
     * @param column 列名
     * @param isAsc 是否升序
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendOrderBy(String table, String column, boolean isAsc) {
        if(!sborderby.toString().contains("order by")){
            sborderby.append(" order by ");
        }
        if(StrUtil.isNotEmpty(table)){
            sborderby.append(table + ".");
        }
        if (isAsc) {
            sborderby.append(column + " asc ");
        } else {
            sborderby.append(column + " desc ");
        }
        sborderby.append(",");
        return this;
    }
    /**
     * 创建带有排序的列
     * @param OrderBy 排序语句
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendOrderBy(String OrderBy) {
        sborderby.append(OrderBy);
        return this;
    }

    /**
     * limit语句缓存
     */
    public StringBuffer sblimit = new StringBuffer();
    /**
     * 添加分页limit和offset
     * @param limit limit值
     * @param offset offset值
     * @return SqlInfo当前实例
     */
    public SqlInfo AppendLimitOffset(int limit, int offset) {
        sblimit.append(" limit " + limit + " offset " + offset + " ");
        return this;
    }

    /**
     * 创建update语句
     * @param table 表名
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateUpdate(String table) {
        sqlType = E_SqlType.update;
        sb.append("update " + table + " set ");
        CurrentMainTable = table;
        TableList.add(table);
        return this;
    }
    /**
     * 创建update语句
     * @param table 表名
     * @param asName 别名
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateUpdate(String table, String asName) {
        sqlType = E_SqlType.update;
        sb.append("update " + table + " as " + asName + " set ");
        CurrentMainTable = table;
        TableList.add(table);
        return this;
    }
    /**
     * 设置更新的条件
     * @param cond 条件
     * @return SqlInfo当前实例
     */
    public SqlInfo Set(String cond) {
        sb.append(" " + cond + ", ");
        return this;
    }

    public List<String> updateColumns = new ArrayList<>();
    /**
     * 设置更新的列
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo SetEqual(String field) {
        updateColumns.add(field);
        sb.append(" " + field + "=?, ");
        return this;
    }
    /**
     * 创建delete语句
     * @param table 表名
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateDelete(String table) {
        sqlType = E_SqlType.delete;
        sb.append("delete from " + table + " ");
        TableList.add(table);
        CurrentMainTable = table;
        return this;
    }
    /**
     * insert into语句缓存
     */
    public StringBuffer sbinsert = new StringBuffer();
    /**
     * 创建insert into语句
     * @param table 表名
     * @return SqlInfo当前实例
     */
    public SqlInfo CreateInsertInto(String table) {
        sqlType = E_SqlType.insert;
        sb.append("insert into " + table + " (");
        CurrentMainTable = table;
        return this;
    }
    /**
     * 添加values子句
     * @param field 列名
     * @return SqlInfo当前实例
     */
    public SqlInfo Values(String field) {
        sb.append( field + ", ");
        sbinsert.append("?"+ ", ");
        return this;
    }
    /**
     * 插入新的insert的value语句
     * @return SqlInfo当前实例
     */
    public SqlInfo NewInsertValue() {
        sbinsert.append("), (");
        return this;
    }
    /**
     * 将SqlInfo对象转换为where子句字符串
     * @return where子句字符串
     */
    public String ToWhere() {
        String s="";
        if (sbwhere.length() > 0) {
            CutStart(sbwhere, " and ");
            CutStart(sbwhere, " or ");
            CutEnd(sbwhere, " and ");
            CutEnd(sbwhere, " or ");
            s+=sbwhere.toString();
        }
        return s;
    }
    /**
     * 将SqlInfo对象转换为table子句字符串
     * @return table子句字符串
     */
    public String ToTable(){
        String s="";
        if (sbtable.length() > 0) {
            s += sbtable.toString();
        }
        return s;
    }
    /**
     * 将SqlInfo对象转换为total子句字符串
     * @return total子句字符串
     */
    public String ToTotal() {
        String s = "select count(*) ";
        String sbStr = sb.toString();
        Matcher matcher = Pattern.compile("\\(\\s?DISTINCT", Pattern.CASE_INSENSITIVE).matcher(sbStr);
        if ((sbStr.contains("distinct ") || sbStr.contains("DISTINCT ")) && !matcher.find()) {
            int index = sbStr.indexOf("distinct ");
            if (index == -1) {
                index = sbStr.indexOf("DISTINCT ");
            }
            if (index >= 0) {
                sbStr = sbStr.substring(index + "DISTINCT ".length());
                String colName = sbStr.split(",")[0].trim().split(" ")[0];
                s = "select count(DISTINCT " + colName + ") ";
            }
        }
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        if (sbgroupby.length() > 0) {
            s = "select count(*) from (" + s + sbgroupby.toString() + ") as t";
        }
        return s;
    }
    /**
     * 转换为查询行数的SqlInfo对象
     * @param field 字段名
     * @return 转换得到的SqlInfo对象
     */
    public SqlInfo ToCountTotal(String field) {
        String s = "select count("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    /**
     * 转换为行数总和的SqlInfo对象
     * @param field 字段名
     * @return 转换得到的SqlInfo对象
     */
    public SqlInfo ToSumTotal(String field) {
        String s = "select sum("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    /**
     * 转换为行数平均值的SqlInfo对象
     * @param field 字段名
     * @return 转换得到的SqlInfo对象
     */
    public SqlInfo ToAvgTotal(String field) {
        String s = "select avg("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    /**
     * 转换为最大值的SqlInfo对象
     * @param field 字段名
     * @return 转换得到的SqlInfo对象
     */
    public SqlInfo ToMaxTotal(String field) {
        String s = "select max("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    /**
     * 转换为最小值的SqlInfo对象
     * @param field 字段名
     * @return 转换得到的SqlInfo对象
     */
    public SqlInfo ToMinTotal(String field) {
        String s = "select min("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    /**
     * 将SqlInfo对象转换为SQL语句字符串
     * @return SQL语句字符串
     */
    public String ToSql() {
        String s = "";
        if (sb.length() > 0) {
            CutEnd(sb, ", ");
            s = sb.toString();
        }
        if (sbtable.length() > 0) {
            s += " from ";
            s += sbtable.toString();
        }
        if(sbinsert.length()>0){
            CutEnd(sbinsert, ", ");
            s+=")";
            s+=" values( "+sbinsert.toString()+")";
        }
        if (sbwhere.length() > 0) {
            CutStart(sbwhere, " and ");
            CutStart(sbwhere, " or ");
            CutEnd(sbwhere, " and ");
            CutEnd(sbwhere, " or ");
            if (s.contains("from") || s.contains("update") || s.contains("delete") || s.contains("insert")) {
                s += " where ";
            }
            s += sbwhere.toString();
        }
        if (sbgroupby.length() > 0) {
            s += sbgroupby.toString();
        }
        if (sborderby.length() > 0) {
            CutEnd(sborderby, ",");
            s += sborderby.toString();
        }
        if (sblimit.length() > 0) {
            s += sblimit.toString();
        }
        return s;
    }
    /**
     * 删除字符串开始部分
     * @param sb 字符串缓存
     * @param s 要删除的字符串
     */
    void CutStart(StringBuffer sb, String s) {
        if (sb.indexOf(s) == 0) {
            sb.delete(0, s.length());
        }
    }
    /**
     * 删除字符串末尾部分
     * @param sb 字符串缓存
     * @param s 要删除的字符串
     */
    void CutEnd(StringBuffer sb, String s) {
        int index = sb.lastIndexOf(s);
        if (index + s.length() < sb.length()) {
            return;
        }
        if (index != -1) {
            sb.delete(index, index + s.length());
        }
    }
}
