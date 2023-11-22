package com.anzhilai.core.toolkit.report;

import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.database.DataTable;
import org.apache.poi.xssf.usermodel.XSSFSheet;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ExcelDataTable extends DataTable {

    public String title = "";
    public String hasBgKey = "是否可写";

    public List<ExcelCol> allExcelCols = new ArrayList<>();//平铺所有的列
    public List<ExcelCol> excelCols = new ArrayList<>();//最下面的列
    public int maxTitleRows = 1;//标题总行数
    public boolean insertRow = false;
    public short fontSize = 12;//字体大小
    public boolean fontBold = true;//字体加粗
    public boolean writeTitle = true;
    public String tempExcelPath = null;

    public OnRenderValue onRenderValue;

    public static class OnRenderValue {
        public Object renderValue(Object value, String key, Map row) {
            return value;
        }

        public boolean hasBg(String value, String key, Map row) {
            return false;
        }

        public void renderOver(XSSFSheet sheet) {
        }
    }

    public ExcelDataTable(DataTable dt) {
        this.Data = dt.Data;
        this.DataSchema = dt.DataSchema;
        this.DataColumns = dt.DataColumns;
        this.maxTitleRows = initDataColumns(this.DataColumns, 0, 0, new ArrayList<>());
        for (ExcelCol excelCol : allExcelCols) {
            if (excelCol.row + excelCol.colSpan == this.maxTitleRows) {
                excelCols.add(excelCol);
            }
        }
    }

    public void clearExcelCols() {
        this.excelCols.clear();
        this.allExcelCols.clear();
        this.maxTitleRows = 1;
    }

    public void filterCol(String[] cols) {
        if (cols.length > 0) {
            List<ExcelCol> newCols = new ArrayList<>();
            for (String field : cols) {
                for (ExcelCol col : this.excelCols) {
                    if (col.field.equals(field)) {
                        col.col = newCols.size();
                        newCols.add(col);
                        this.excelCols.remove(col);
                        break;
                    }
                }
            }
            this.excelCols = newCols;
            this.allExcelCols = newCols;
        }
    }

    public class ExcelCol {
        public String title;
        public String field;
        public Object type;//类型 ,int.class,Date.class,double.class,new String[]{"是","否"};
        public int row = 0;//当前行
        public int col = 0;//当前列
        public int rowSpan = 1;
        public int colSpan = 1;
        public int width = 5000;//默认值
        public boolean hasTime = false;
        public String align = RowAlign.center.name();
    }

    //*********************************添加列start*********************************

    public ExcelCol addCol(String field) {
        return addCol(field, field);
    }

    public ExcelCol addCol(String field, String title) {
        return addCol(field, title, String.class);
    }

    public ExcelCol addCol(String field, Enum[] type) {
        return addCol(field, field, type);
    }

    public ExcelCol addCol(String field, String title, Enum[] type) {
        String[] types = new String[type.length];
        for (int i = 0; i < type.length; i++) {
            types[i] = type[i].name();
        }
        return addCol(field, title, types);
    }

    public ExcelCol addCol(String field, Class type) {
        return addCol(field, field, type);
    }

    public ExcelCol addCol(String field, String title, Class type) {
        ExcelCol excelCol = new ExcelCol();
        excelCol.field = field;
        excelCol.title = title;
        excelCol.type = type;
        excelCol.col = excelCols.size();
        excelCols.add(excelCol);
        allExcelCols.add(excelCol);
        return excelCol;
    }

    public ExcelCol addCol(String field, String[] type) {
        return addCol(field, field, type);
    }

    public ExcelCol addCol(String field, String title, String[] type) {
        ExcelCol excelCol = new ExcelCol();
        excelCol.field = field;
        excelCol.title = title;
        excelCol.type = type;
        excelCol.col = excelCols.size();
        excelCols.add(excelCol);
        allExcelCols.add(excelCol);
        return excelCol;
    }


    public void reInsertCol(int index, ExcelCol excelCol) {
        if (excelCols.remove(excelCol)) {
            excelCol.col = index;
            excelCols.add(index, excelCol);
            for (ExcelCol col : allExcelCols) {
                if (col.col >= index && col != excelCol) {
                    col.col++;
                }
            }
        }
    }
    //*********************************添加列end*********************************

    private int initDataColumns(List<Map> cols, int rowIndex, int colIndex, ArrayList<ExcelCol> nowExcelCols) {
        int rowNum = 1;//行数量
        boolean hasChildren = false;
        int childRowSpan = 0;
        for (int i = 0; i < cols.size(); i++) {//列的信息
            ExcelCol excelCol = new ExcelCol();
            Map col = cols.get(i);
            String field = TypeConvert.ToString(col.get("field"));
            String title = TypeConvert.ToString(col.get("title"));
            String align = TypeConvert.ToString(col.get("align"));
            if (StrUtil.isEmpty(title)) {
                title = field;
            }
            if (StrUtil.isEmpty(field)) {
                field = title;
            }
            if (StrUtil.isNotEmpty(align)) {
                excelCol.align = align;
            }
            excelCol.title = title;
            excelCol.field = field;
            if (this.DataSchema.containsKey(field)) {
                excelCol.type = this.DataSchema.get(field);
            } else {
                excelCol.type = String.class;
            }
            excelCol.row = rowIndex;
            excelCol.col = i + colIndex + childRowSpan;
            boolean setRowSpan = false;
            if (col.containsKey("children")) {
                List<Map> cols_children = (List<Map>) col.get("children");//有子列
                if (cols_children.size() > 0) {
                    hasChildren = true;
                    setRowSpan = true;
                    ArrayList<ExcelCol> childrenExcelCols = new ArrayList<>();
                    int _rowNum = initDataColumns(cols_children, rowIndex + 1, excelCol.col, childrenExcelCols) + 1;
                    if (_rowNum > rowNum) {
                        rowNum = _rowNum;
                    }
                    int rowSpan = 0;
                    for (ExcelCol child : childrenExcelCols) {
                        rowSpan += child.rowSpan;
                    }
                    excelCol.rowSpan = rowSpan;//跨的行数
                    childRowSpan += (rowSpan - 1);
                }
            }
            if (!setRowSpan) {
                nowExcelCols.add(excelCol);
            }
            allExcelCols.add(excelCol);
        }
        if (hasChildren) {
            for (ExcelCol excelCol : nowExcelCols) {
                if (excelCol.colSpan == 1) {
                    excelCol.colSpan = 0;
                }
                excelCol.colSpan += rowNum;//需要跨列处理
            }
        }
        return rowNum;
    }

    public boolean colIsStringArray(int colIndex) {
        if (colIndex < excelCols.size()) {
            ExcelCol obj = excelCols.get(colIndex);
            return obj.type.getClass().isArray();
        } else {
            return false;
        }
    }

    public Object getColType(int colIndex) {
        if (colIndex < excelCols.size()) {
            return excelCols.get(colIndex).type;
        } else {
            return String.class;
        }
    }

    public ExcelCol getTitleExcelCol(int row, int col) {
        ExcelCol col1 = null;
        for (ExcelCol col2 : allExcelCols) {
            if (col2.row == row && col2.col == col) {
                col1 = col2;
                break;
            }
        }
        return col1;
    }


    public boolean hasBg(int rowIndex, int colIndex) {
        boolean hasbg = false;
        if (rowIndex < Data.size()) {
            Map row = Data.get(rowIndex);
            String field = excelCols.get(colIndex).field;
            String ret = TypeConvert.ToString(row.get(field));
            if (onRenderValue != null) {
                hasbg = onRenderValue.hasBg(ret, field, row);
            }
        }
        return hasbg;
    }

    public Object getDataValue(int rowIndex, int colIndex) {
        Object ret = null;
        if (rowIndex < Data.size()) {
            Map row = Data.get(rowIndex);
            String field = excelCols.get(colIndex).field;
            ret = row.get(field);
            if (onRenderValue != null) {
                ret = onRenderValue.renderValue(ret, field, row);
            }
        }
        return ret;
    }

    public void renderOver(XSSFSheet sheet) {
        if (onRenderValue != null) {
            onRenderValue.renderOver(sheet);
        }
    }

}
