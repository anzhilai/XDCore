package com.anzhilai.core.database;

import org.apache.commons.dbutils.BasicRowProcessor;
import org.apache.commons.dbutils.RowProcessor;
import org.apache.commons.dbutils.handlers.AbstractListHandler;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

public class TableSqlHandler extends AbstractListHandler<Map<String, Object>> {

    /**
     * The RowProcessor implementation to use when converting rows into Maps.
     */
    private final RowProcessor convert;

    /**
     * Creates a new instance of MapListHandler using a
     * <code>BasicRowProcessor</code> for conversion.
     */
    public TableSqlHandler() {
        this(new BasicRowProcessor());
    }

    /**
     * Creates a new instance of MapListHandler.
     *
     * @param convert The <code>RowProcessor</code> implementation to use when
     *                converting rows into Maps.
     */
    public TableSqlHandler(RowProcessor convert) {
        super();
        this.convert = convert;
    }

    public Map<String, Class<?>> DataSchema;
    public Map<String, String> DbDataSchema;

    public List<String> DataColumns;

    @Override
    public List<Map<String, Object>> handle(ResultSet rs) throws SQLException {
        DbDataSchema = new LinkedHashMap<String, String>();
        DataSchema = new LinkedHashMap<String, Class<?>>();
        DataColumns = new ArrayList();
        ResultSetMetaData rsmd = rs.getMetaData();
        int cols = rsmd.getColumnCount();

        for (int i = 1; i <= cols; i++) {
            String columnName = rsmd.getColumnLabel(i);
            if (null == columnName || 0 == columnName.length()) {
                columnName = rsmd.getColumnName(i);
            }
            String dbCol = rsmd.getColumnTypeName(i);
            int precision = rsmd.getPrecision(i);
            if (precision > 0 && !dbCol.equalsIgnoreCase("datetime") && !dbCol.equalsIgnoreCase("date")) {
                if (precision > 100000) {//715827882
                    dbCol = "LONGTEXT";
                } else {
                    dbCol += "(" + precision + ")";
                }
            }
            DbDataSchema.put(columnName, dbCol);
            DataColumns.add(columnName);
            DataSchema.put(columnName, TableSqlJDBCTypes.jdbcTypeToJavaType(rsmd.getColumnType(i)));
        }

        List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
        while (rs.next()) {
            rows.add(this.handleRow(rs));
        }
        return rows;
    }

    /**
     * Converts the <code>ResultSet</code> row into a <code>Map</code> object.
     *
     * @param rs <code>ResultSet</code> to process.
     * @return A <code>Map</code>, never null.
     * @throws SQLException if a database access error occurs
     * @see AbstractListHandler#handle(ResultSet)
     */
    @Override
    protected Map<String, Object> handleRow(ResultSet rs) throws SQLException {

        return this.convert.toMap(rs);
    }

}
