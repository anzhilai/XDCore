package com.anzhilai.core.toolkit;

import com.anzhilai.core.database.DataTable;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

public class ExcelWriteUtil {
    public static final String CHARSET_NAME = "utf-8";

    public static String exportPath(HttpServletRequest request) {
        String dateName = "";
        Calendar date = Calendar.getInstance();
        dateName += String.valueOf(date.get(Calendar.YEAR));
        dateName += String.format("%02d", (date.get(Calendar.MONTH) + 1));
        dateName += String.format("%02d", (date.get(Calendar.DATE)));
        dateName += String.format("%02d", (date.get(Calendar.HOUR_OF_DAY)));
        dateName += String.format("%02d", (date.get(Calendar.MINUTE)));
        dateName += String.format("%02d", (date.get(Calendar.SECOND)));
        dateName += String.format("%03d", (date.get(Calendar.MILLISECOND)));
        dateName += "_" + String.format("%05d", (new Random(10000)).nextInt());
        String filePath = request.getSession().getServletContext().getRealPath("") + "/export/xls/" + dateName + ".xls";
        return filePath;
    }

    public static boolean exportXls(HttpServletRequest request, HttpServletResponse response, String name, String title, DataTable dt) {
        return exportXls(request, response, name, title, dt, null);
    }

    public static boolean exportXls(HttpServletRequest request, HttpServletResponse response, String name, String title, DataTable dt, List<String> cols) {
        return exportXls(request, response, name, title, dt, cols, null);
    }

    public static boolean exportXls(HttpServletRequest request, HttpServletResponse response, String name, String title, DataTable dt, List<String> cols, WriteXlsHandler handler) {
        boolean ret = false;
        OutputStream output = null;
        FileInputStream fis = null;
        try {
            response.reset();
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename="
                    + new String(name.getBytes(CHARSET_NAME), "ISO_8859_1") + ".xls");
            output = response.getOutputStream();
            writeXls(output, title, dt, cols, handler);
            output.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            close(fis);
            close(output);
        }
        return ret;
    }

    public static boolean writeXls(String filePath, String title, DataTable dt) {
        return writeXls(filePath, title, dt, null);
    }

    public static boolean writeXls(String filePath, String title, DataTable dt, List<String> cols) {
        boolean ret = false;
        File file = new File(filePath);
        file.getParentFile().mkdirs();
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(file);
            ret = writeXls(out, title, dt, cols, null);
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            close(out);
        }
        return ret;
    }

    public static XSSFCellStyle getCellStyle(XSSFWorkbook workbook, boolean isTitle) {
        XSSFFont font = workbook.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 12);// 字体大小
        font.setBold(isTitle);// 加粗
        XSSFCellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setFont(font);
        cellStyle.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
        cellStyle.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
        cellStyle.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
        cellStyle.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        cellStyle.setWrapText(true);
        return cellStyle;
    }

    public static boolean writeXls(OutputStream output, String title, DataTable dt, List<String> cols, WriteXlsHandler handler) {
        boolean ret = false;
        if (dt != null) {
            XSSFWorkbook workbook = null;
            try {
                workbook = new XSSFWorkbook();
                String _title = "数据";
                if (StrUtil.isNotEmpty(title)) {
                    _title = title;
                }
                cols = getCols(dt, cols);
                XSSFCellStyle titleCellStyle = getCellStyle(workbook, true);
                XSSFCellStyle cellStyle = getCellStyle(workbook, false);
                XSSFSheet sheet = workbook.createSheet(_title);// 设置sheet名字
                for (int i = 0; i < cols.size(); i++) {// 设置宽度
                    sheet.setColumnWidth(i, 5000);// 定义第1列，及其宽度
                }

                int startRowNum = 0;
                for (int col = 0; col < cols.size(); col++) {
                    XSSFRow row1 = sheet.getRow(startRowNum);
                    if (row1 == null) {
                        row1 = sheet.createRow(startRowNum);
                    }
                    row1.setHeight((short) 1000);
                    XSSFCell cell = row1.getCell(col);
                    if (cell == null) {
                        cell = row1.createCell(col);
                    }
                    cell.setCellStyle(titleCellStyle);
                    cell.setCellValue(cols.get(col));
                }
                startRowNum++;
                String value = null;
                for (int row = 0, len = dt.Data.size(); row < len; row++) {
                    int _row = row + startRowNum;// 加上标题两行
                    XSSFRow row1 = sheet.getRow(_row);
                    if (row1 == null) {
                        row1 = sheet.createRow(_row);
                    }
                    row1.setHeight((short) 800);
                    Map<String, Object> map = dt.Data.get(row);
                    for (int col = 0; col < cols.size(); col++) {
                        String key = cols.get(col);
                        if (handler == null || !handler.handerImage(key, map, sheet, col, _row)) {
                            if (map.get(key) == null) {
                                value = "";
                            } else {
                                value = map.get(key).toString();
                            }
                            XSSFCell cell = row1.getCell(col);
                            if (cell == null) {
                                cell = row1.createCell(col);
                            }
                            cell.setCellStyle(cellStyle);
                            cell.setCellValue(value);
                        }
                    }
                }
                if (handler != null) {
                    handler.sheetComplete(sheet);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (workbook != null) {
                    try {
                        workbook.write(output);
                        ret = true;
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    try {
                        workbook.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return ret;
    }

    public static boolean writeAllXls(String filePath, List<String> titles, List<DataTable> dts, List<String> cols) {
        boolean ret = false;
        File file = new File(filePath);
        file.getParentFile().mkdirs();
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(file);
            ret = writeAllXls(out, titles, dts, cols, null);
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            close(out);
        }
        return ret;
    }

    public static boolean writeAllXls(OutputStream outputStream, List<String> titles, List<DataTable> dts, List<String> cols, WriteXlsHandler handler) {
        boolean ret = false;
        if (dts != null && dts.size() == titles.size()) {
            XSSFWorkbook workbook = null;
            try {
                workbook = new XSSFWorkbook();
                XSSFCellStyle titleCellStyle = getCellStyle(workbook, true);
                XSSFCellStyle cellStyle = getCellStyle(workbook, false);
                int w = 0;
                for (DataTable dt : dts) {//循环创建多个Sheet
                    List<String> _cols = getCols(dt, cols);
                    XSSFSheet sheet = workbook.createSheet(titles.get(w));// 设置sheet名字
                    for (int i = 0; i < _cols.size(); i++) {// 设置宽度
                        sheet.setColumnWidth(i, 5000);// 定义第1列，及其宽度
                    }
                    if (_cols.size() > 0) {
                        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, _cols.size() - 1));
                    }
                    XSSFRow row0 = sheet.getRow(0);
                    if (row0 == null) {
                        row0 = sheet.createRow(0);
                    }
                    row0.setHeight((short) 1000);
                    XSSFCell cell0 = row0.getCell(0);
                    if (cell0 == null) {
                        cell0 = row0.createCell(0);
                    }
                    cell0.setCellValue(titles.get(w));
                    cell0.setCellStyle(titleCellStyle);

                    XSSFRow row1 = sheet.getRow(1);
                    if (row1 == null) {
                        row1 = sheet.createRow(1);
                    }
                    row1.setHeight((short) 1000);
                    for (int i = 0; i < _cols.size(); i++) {
                        cell0 = row1.getCell(i);
                        if (cell0 == null) {
                            cell0 = row1.createCell(i);
                        }
                        cell0.setCellValue(_cols.get(i));
                        cell0.setCellStyle(titleCellStyle);
                    }
                    String value = null;
                    for (int row = 0, len = dt.Data.size(); row < len; row++) {
                        int _row = row + 2;// 加上标题两行
                        Map<String, Object> map = dt.Data.get(row);
                        row0 = sheet.getRow(_row);
                        if (row0 == null) {
                            row0 = sheet.createRow(_row);
                        }
                        row0.setHeight((short) 800);
                        for (int col = 0; col < _cols.size(); col++) {
                            String key = _cols.get(col);
                            if (handler == null || !handler.handerImage(key, map, sheet, col, _row)) {
                                if (map.get(key) == null) {
                                    value = "";
                                } else {
                                    value = map.get(key).toString();
                                }
                                cell0 = row0.getCell(col);
                                if (cell0 == null) {
                                    cell0 = row0.createCell(col);
                                }
                                cell0.setCellValue(value);
                                cell0.setCellStyle(cellStyle);
                            }
                        }
                    }
                    if (handler != null) {
                        handler.sheetComplete(sheet);
                    }
                    w++;
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (workbook != null) {
                    try {
                        workbook.write(outputStream);
                        ret = true;
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    try {
                        workbook.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return ret;
    }

    /**
     * 合并单元格
     *
     * @param sheet
     * @param type  :row,col
     */
    public static void mergeCells(XSSFSheet sheet, String type) throws Exception {
        mergeCells(sheet, type, 0, 0);
    }

    /**
     * 合并单元格
     *
     * @param sheet
     * @param type  :row,col
     * @param index
     * @param start
     */
    public static void mergeCells(XSSFSheet sheet, String type, int index, int start) throws Exception {
        String lastStr = null;
        int lastIndex = -1;
        if (type.equals("row")) {// 合并第index行，相同的字符
            if (index < sheet.getLastRowNum()) {
                XSSFRow row = sheet.getRow(index);
                for (int i = start, len = row.getLastCellNum(); i < len; i++) {
                    String text = row.getCell(i).getStringCellValue().trim();
                    if (!text.equals(lastStr)) {
                        if (lastIndex != -1) {
                            sheet.addMergedRegion(new CellRangeAddress(index, index, lastIndex, i - 1));
                        }
                        lastStr = text;
                        lastIndex = i;
                    }
                }
                if (lastIndex != -1) {
                    int i = row.getLastCellNum();
                    sheet.addMergedRegion(new CellRangeAddress(index, index, lastIndex, i - 1));
                }
            }
        } else {
            if (index < sheet.getRow(0).getLastCellNum()) {
                for (int i = start, len = sheet.getLastRowNum(); i < len; i++) {
                    XSSFRow row = sheet.getRow(i);
                    String text = row.getCell(index).getStringCellValue().trim();
                    if (!text.equals(lastStr)) {
                        if (lastIndex != -1) {
                            sheet.addMergedRegion(new CellRangeAddress(lastIndex, i - 1, index, index));
                        }
                        lastStr = text;
                        lastIndex = i;
                    }
                }
                if (lastIndex != -1) {
                    int i = sheet.getLastRowNum();
                    sheet.addMergedRegion(new CellRangeAddress(lastIndex, i - 1, index, index));
                }
            }
        }
    }

    /**
     * 导入excel
     *
     * @param file
     * @param handler
     * @return
     */
    public static boolean inportXls(File file, InportXlsHandler handler) {
        boolean isOk = false;
        XSSFWorkbook workbook = null;
        try {
            workbook = new XSSFWorkbook(file);// 读取xls文档
            if (workbook != null && workbook.getNumberOfSheets() > 0) {
                XSSFSheet sheet = workbook.getSheetAt(0);// 第1个
                int rows = sheet.getLastRowNum();
                int columns = sheet.getRow(0).getLastCellNum();
                if (rows > 2) {// 行数大于两行
                    HashMap<Integer, String> keys = new HashMap<Integer, String>();
                    String key = null, value = null;
                    for (int j = 0; j < columns; j++) {
                        key = sheet.getRow(1).getCell(j).getStringCellValue().trim();
                        keys.put(j, key);
                    }
                    HashMap<String, String> data = null;
                    for (int r = 2; r < rows; r++) {// 第3行开始
                        data = new HashMap<String, String>();
                        for (int j = 0; j < columns; j++) {
                            value = sheet.getRow(r).getCell(j).getStringCellValue().trim();
                            data.put(keys.get(j), value);
                        }
                        handler.handerRow(r, data);
                    }
                }
                isOk = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (workbook != null) {
                try {
                    workbook.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return isOk;
    }

    public static List<String> getCols(DataTable dt, List<String> cols) {
        if (cols == null) {
            cols = new ArrayList<String>();
            if (dt != null && dt.DataSchema != null && dt.DataSchema.size() > 0) {
                for (String key : dt.DataSchema.keySet()) {
                    cols.add(key);
                }
            } else {
                if (dt != null && dt.Data.size() > 0) {
                    Map<String, Object> map = dt.Data.get(0);
                    ArrayList<String> _cols = new ArrayList<String>();
                    _cols.add("id");
                    _cols.add("Parentid");
                    _cols.add("children");
                    _cols.add("CreateTime");
                    _cols.add("UpdateTime");
                    for (String key : map.keySet()) {
                        boolean exists = false;
                        for (String _col : _cols) {
                            if (key.equalsIgnoreCase(_col)) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            cols.add(key);
                        }
                    }
                }
            }
        }
        return cols;
    }


    public interface InportXlsHandler {
        public void handerRow(int row, HashMap<String, String> data);
    }

    public interface WriteXlsHandler {
        /**
         * 用于处理图片,或者格式化
         */
        public boolean handerImage(String key, Map<String, Object> map, XSSFSheet sheet, int col, int row);

        public void sheetComplete(XSSFSheet sheet);
        // //处理图片
        // GRJC干扰监测 obj = new GRJC干扰监测();
        // obj.setid((String) map.get("ID"));
        // obj.set任务id((String) map.get("任务ID"));
        // File _file = new File(obj.getUploadFileDirPath(request)
        // + "/" + value);
        // if (_file.exists()) {
        // WritableImage image = new WritableImage(col, _row,
        // 1, 1, _file);
        // sheet.addImage(image);
        // }
    }

    public static void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
