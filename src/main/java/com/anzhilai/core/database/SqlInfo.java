package com.anzhilai.core.database;

import com.anzhilai.core.base.XQuery;
import com.anzhilai.core.toolkit.StrUtil;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by  on 2017-04-26.
 */
public class SqlInfo {
    private static Logger log = Logger.getLogger(SqlInfo.class);
    public static boolean OUT_LOG = true;
    public boolean isOutLog;

    public enum E_SqlType {
        insert, delete, update, select
    }
    public E_SqlType sqlType = null;
    StringBuffer sb = new StringBuffer();

    public SqlInfo() {
        isOutLog = OUT_LOG;
    }

    public SqlInfo CutStart(StringBuffer sb, String s) {
        if (sb.indexOf(s) == 0) {
            sb.delete(0, s.length());
        }
        return this;
    }

    public SqlInfo CutEnd(StringBuffer sb, String s) {
        int index = sb.lastIndexOf(s);
        if (index + s.length() < sb.length()) {
            return this;
        }
        if (index != -1) {
            sb.delete(index, index + s.length());
        }
        return this;
    }

    public SqlInfo CreateSelect() {
        sqlType = E_SqlType.select;
        sb.append("select ");
        return this;
    }
    public SqlInfo CreateSelect(String columns) {
        sqlType = E_SqlType.select;
        sb.append("select "+columns+" ");
        return this;
    }

    public SqlInfo CreateSelectDistinct() {
        sqlType = E_SqlType.select;
        sb.append("select distinct ");
        return this;
    }

    public SqlInfo CreateSelectAll(String fromtable) {
        sqlType = E_SqlType.select;
        sb.append("select * from " + fromtable + " ");
        TableList.add(fromtable);
        return this;
    }


    public SqlInfo Append(String content) {
        sb.append(" " + content + ", ");
        return this;
    }
    public SqlInfo AppendStat(String fromTable, String statType, String statField, String asName) {
        sb.append(" "+statType+"(" + fromTable + "." + statField + ") as "+asName + ", ");
        return this;
    }


    public class QueryColumn {
        public String table;
        public String column;
        public String asColumn;
        public XQuery.QueryType type = XQuery.QueryType.custom;
        public Object value;
        public Class<?> clazz;

        public QueryColumn(String t, String c) {
            table = t;
            column = c;
        }

        public QueryColumn(String t, String c, XQuery.QueryType s) {
            table = t;
            column = c;
            type = s;
        }
    }

    public List<QueryColumn> listQueryColumn = new ArrayList<>();

    public SqlInfo AppendColumnCalc(String column, String asName) {
        sb.append(" " + column + ", ");
        QueryColumn qc = new QueryColumn(null, column, XQuery.QueryType.like);
        qc.asColumn = asName;
        listQueryColumn.add(qc);
        return this;
    }

    public SqlInfo AppendColumn(String table, String column) {
        sb.append(" " + table + "." + column + ", ");
        if(!"*".equals(column.trim())){
            listQueryColumn.add(new QueryColumn(table,column));
        }
        return this;
    }

    public SqlInfo AppendColumn(String table, String column, String asName) {
        sb.append(" " + table + "." + column + " as " + asName + ", ");
        QueryColumn qc = new QueryColumn(table,column, XQuery.QueryType.like);
        qc.asColumn = asName;
        listQueryColumn.add(qc);
        return this;
    }

    public SqlInfo AppendColumn(String table, String column, XQuery.QueryType type, Class<?> clazz) {
        sb.append(" ").append(table).append(".").append(column).append(", ");
        QueryColumn qc = new QueryColumn(table,column,type);
        qc.clazz = clazz;
        listQueryColumn.add(qc);
        return this;
    }


    public SqlInfo AppendColumn(String table, String column, String asName, XQuery.QueryType type, Class<?> clazz) {
        sb.append(" " + table + "." + column + " as " + asName + ", ");
        QueryColumn qc = new QueryColumn(table,column,type);
        qc.asColumn = asName;
        qc.clazz = clazz;
        listQueryColumn.add(qc);
        return this;
    }

    public SqlInfo AppendSumColumn(String table, String column, String asName) {
        sb.append(" sum( "+table+"." + column + ") as "+asName+", ");
        return this;
    }
    public SqlInfo AppendCountColumn(String table, String column, String asName) {
        sb.append(" count( "+table+"." + column + ") as "+asName+", ");
        return this;
    }
    public SqlInfo EndColumn() {
        CutEnd(sb, ", ");
        return this;
    }

    public String CurrentMainTable;
    public List<String> TableList = new ArrayList<String>() {
        @Override
        public boolean add(String s) {
            if (this.contains(s)) {
                return false;
            }
            return super.add(s);
        }
    };
    public StringBuffer sbtable = new StringBuffer();

    public SqlInfo SetMainTable(String tableName){
        CurrentMainTable = tableName;
        this.TableList.add(tableName);
        return this;
    }

    public SqlInfo From(String table) {
        return From(table, null);
    }

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

    public SqlInfo JoinTableSql(JoinType joinType, String joinsql, String asTable, String asTableField, String othertable, String otherTableField) {

        this.JoinTableSql(joinType,joinsql,asTable,asTable + "." + asTableField +" = " + othertable + "." + otherTableField + " ");
        return this;
    }
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
    public SqlInfo InnerJoin(String joinTable, String joinTableField, String currentTableField) {
        sbtable.append(" inner join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + CurrentMainTable + "." + currentTableField + " ");
        TableList.add(joinTable);
        return this;
    }


    public SqlInfo InnerJoin(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" inner join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTable);
        return this;
    }

    public SqlInfo InnerJoin(String joinTable, String joinTableAs, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" inner join " + joinTable +" as "+joinTableAs+ " on " + joinTableAs + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTableAs);
        return this;
    }

    public SqlInfo LeftJoin(String joinTable, String joinTableField, String currentTableField) {
        sbtable.append(" left join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + CurrentMainTable + "." + currentTableField + " ");
        TableList.add(joinTable);
        return this;
    }

    public SqlInfo LeftJoin(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" left join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTable);
        return this;
    }
    public SqlInfo LeftJoin(String joinTable, String joinTableAs, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" left join " + joinTable+" as "+joinTableAs+ " on " + joinTableAs + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTableAs);
        return this;
    }

    public SqlInfo RightJoin(String joinTable, String joinTableField, String currentTableField) {
        sbtable.append(" right join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + CurrentMainTable + "." + currentTableField + " ");
        TableList.add(joinTable);
        return this;
    }

    public SqlInfo RightJoin(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" right join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTable);
        return this;
    }

    public SqlInfo FullJoin(String joinTable, String joinTableField, String currentTableField) {
        sbtable.append(" full join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + CurrentMainTable + "." + currentTableField + " ");
        TableList.add(joinTable);
        return this;
    }

    public SqlInfo FullJoin(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" full join " + joinTable + " on " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        TableList.add(joinTable);
        return this;
    }

    public SqlInfo JoinAnd(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbtable.append(" and " + joinTable + "." + joinTableField + " ");
        sbtable.append(" = " + othertable + "." + otherTableField + " ");
        return this;
    }

    public SqlInfo JoinAnd(String and) {
        sbtable.append(" and " + and);
        return this;
    }

    public SqlInfo JoinOnAndEqual(String table, String tableField, String value) {
        sbtable.append(" and " + table + "." + tableField + "=?");
        AddParam(value);
        return this;
    }


    public StringBuffer sbwhere = new StringBuffer();



    ArrayList<Object> params = new ArrayList<>();
    public SqlInfo AddParam(Object o){
        params.add(o);
        return this;
    }
    public SqlInfo AddParams(List<Object> list){
        params.addAll(list);
        return this;
    }
    public Object[] GetParams(){
        return params.toArray();
    }
    public List<Object> GetParamsList(){
        return params;
    }
    public SqlInfo Where(String cond) {
        sbwhere.append(" " + cond + " ");
        return this;
    }
    public SqlInfo WhereEqual(String field) {
        WhereOption(field,"=");
        return this;
    }
    public SqlInfo WhereEqual(String table, String field) {
        WhereOption(table, field, "=");
        return this;
    }
    public SqlInfo WhereLike(String field) {
        WhereOption(field,"like");
        return this;
    }
    public SqlInfo WhereLike(String table, String field) {
        WhereOption(table, field, "like");
        return this;
    }
    protected SqlInfo WhereOption(String field, String option) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" " + field + " " + option + " ? ");
        }
        return this;
    }
    protected SqlInfo WhereOption(String table, String field, String option) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" (" + table + "." + field + " " + option + " ?) ");
        }
        return this;
    }
    public SqlInfo And(String cond) {
        if (StrUtil.isNotEmpty(cond)) {
            sbwhere.append(" and (" + cond + ") ");
        }else{
            //sbwhere.append(" and ");
        }
        return this;
    }

    public SqlInfo And(String joinTable, String joinTableField, String othertable, String otherTableField) {
        sbwhere.append(" and " + joinTable + "." + joinTableField + " ");
        sbwhere.append(" = " + othertable + "." + otherTableField + " ");
        return this;
    }

    public SqlInfo AndEqual(String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" and (" + field + "=?) ");
        }
        return this;
    }

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

    public SqlInfo AndEqual(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" and ("+table+"." + field + "=?) ");
        }
        return this;
    }
    public SqlInfo AndLike(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" and ("+table+"." + field + " like ?) ");
        }
        return this;
    }
    public SqlInfo Or(String cond) {
        if (StrUtil.isNotEmpty(cond)) {
            sbwhere.append(" or (" + cond + ") ");
        }else{
            //sbwhere.append(" or ");
        }
        return this;
    }

    public SqlInfo OrEqual(String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" or (" + field + "=?) ");
        }
        return this;
    }
    public SqlInfo OrEqual(String table, String field) {
        if (StrUtil.isNotEmpty(field)) {
            sbwhere.append(" or ("+table+"." + field + "=?) ");
        }
        return this;
    }
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

    public SqlInfo And_FIND_IN_SET(String cond, String table, String column) {
        return And(" FIND_IN_SET (" + cond + "," + table + "." + column + ") ");
    }

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

    public SqlInfo LeftBracket() {
        sbwhere.append(" ( ");
        return this;
    }

    public SqlInfo RightBracket() {
        sbwhere.append(" ) ");
        return this;
    }

    public StringBuffer sbgroupby = new StringBuffer();

    public SqlInfo AppendGroupBy(String cond) {
        return AppendGroupBy(null, cond);
    }

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

    public StringBuffer sborderby = new StringBuffer();

    public static String CreateOrderBy(String table, String column, boolean isAsc) {
        if (isAsc) {
            return table + "." + column + " asc ";
        } else {
            return table + "." + column + " desc ";
        }
    }
    public static String AddOrderBy(String table, String column, boolean isAsc) {
        if (isAsc) {
            return ","+table + "." + column + " asc ";
        } else {
            return ","+table + "." + column + " desc ";
        }
    }

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

    public SqlInfo AppendOrderBy(String OrderBy) {
        sborderby.append(OrderBy);
        return this;
    }


    public StringBuffer sblimit = new StringBuffer();

    public SqlInfo AppendLimitOffset(int limit, int offset) {
        sblimit.append(" limit " + limit + " offset " + offset + " ");
        return this;
    }


    public SqlInfo CreateUpdate(String table) {
        sqlType = E_SqlType.update;
        sb.append("update " + table + " set ");
        CurrentMainTable = table;
        TableList.add(table);
        return this;
    }

    public SqlInfo CreateUpdate(String table, String asName) {
        sqlType = E_SqlType.update;
        sb.append("update " + table + " as " + asName + " set ");
        CurrentMainTable = table;
        TableList.add(table);
        return this;
    }

    public SqlInfo Set(String cond) {
        sb.append(" " + cond + ", ");
        return this;
    }
    public List<String> updateColumns = new ArrayList<>();
    public SqlInfo SetEqual(String field) {
        updateColumns.add(field);
        sb.append(" " + field + "=?, ");
        return this;
    }

    public SqlInfo CreateDelete(String table) {
        sqlType = E_SqlType.delete;
        sb.append("delete from " + table + " ");
        TableList.add(table);
        CurrentMainTable = table;
        return this;
    }
    public StringBuffer sbinsert = new StringBuffer();
    public SqlInfo CreateInsertInto(String table) {
        sqlType = E_SqlType.insert;
        sb.append("insert into " + table + " (");
        CurrentMainTable = table;
        return this;
    }
    public SqlInfo Values(String field) {
        sb.append( field + ", ");
        sbinsert.append("?"+ ", ");
        return this;
    }
    public SqlInfo NewInsert() {
        sbinsert.append("), (");
        return this;
    }
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
    public String ToTable(){
        String s="";
        if (sbtable.length() > 0) {
            s += sbtable.toString();
        }
        return s;
    }
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

    public SqlInfo ToCountTotal(String field) {
        String s = "select count("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    public SqlInfo ToSumTotal(String field) {
        String s = "select sum("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    public SqlInfo ToAvgTotal(String field) {
        String s = "select avg("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    public SqlInfo ToMaxTotal(String field) {
        String s = "select max("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }
    public SqlInfo ToMinTotal(String field) {
        String s = "select min("+field+") ";
        s += " from "+ToTable();
        String where = ToWhere();
        if (StrUtil.isNotEmpty(where)) {
            s += " where " + where;
        }
        return new SqlInfo().Append(s).AddParams(this.GetParamsList());
    }

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

    public static String MergeAndCond(List<String> list) {
        String ss = "";
        for (String s : list) {
            ss += "(" + s + ")" + " and ";
        }
        return StrUtil.CutEnd(ss, " and ");
    }
    public static String MergeOrCond(List<String> list) {
        String ss = "";
        for (String s : list) {
            ss += "(" + s + ")" + " or ";
        }
        return StrUtil.CutEnd(ss, " or ");
    }







}
