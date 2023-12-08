package com.anzhilai.core.toolkit.report;

import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.database.DataTable;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Date;

public class ExcelWriteFormatUtils2 {
    public static final String CHARSET_NAME = "utf-8";

    public static boolean exportXls(HttpServletResponse response, String name, ExcelDataTable dt) {
        return exportXls(response, name, ".xls", dt);
    }

    public static boolean exportXls(HttpServletResponse response, String name, String exName, ExcelDataTable dt) {
        OutputStream output = null;
        FileInputStream fis = null;
        try {
            response.reset();
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename="
                    + new String(name.getBytes(CHARSET_NAME), "ISO_8859_1") + exName);
            output = response.getOutputStream();
            writeXls(output, dt);
            output.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            close(fis);
            close(output);
        }
        return true;
    }


    public static boolean writeXls(OutputStream outputStream, ExcelDataTable dt) {
        boolean ret = false;
        if (dt != null) {
            XSSFWorkbook workbook = null;
            FileInputStream fileInputStream = null;
            try {
                XSSFSheet sheet;
                if (StrUtil.isNotEmpty(dt.tempExcelPath) && new File(dt.tempExcelPath).exists()) {
                    fileInputStream = new FileInputStream(dt.tempExcelPath);
                    workbook = new XSSFWorkbook(fileInputStream);
                    sheet = workbook.getSheetAt(0);
                } else {
                    dt.writeTitle = true;
                    workbook = new XSSFWorkbook();
                    sheet = workbook.createSheet(dt.title);// 设置sheet名字
                    // 设置宽度
                    for (int i = 0; i < dt.excelCols.size(); i++) {
                        sheet.setColumnWidth(i, dt.excelCols.get(i).width);// 定义第1列，及其宽度
                    }
                }

                XSSFFont font = workbook.createFont();
                font.setFontName("Arial");
                font.setFontHeightInPoints(dt.fontSize);// 字体大小
                font.setBold(dt.fontBold);// 加粗
                XSSFCellStyle XSSFCellStyle_center = workbook.createCellStyle();
                XSSFCellStyle_center.setFont(font);
                XSSFCellStyle_center.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center.setVerticalAlignment(VerticalAlignment.CENTER);
                XSSFCellStyle_center.setAlignment(HorizontalAlignment.CENTER);
                XSSFCellStyle_center.setWrapText(true);

                XSSFCellStyle XSSFCellStyle_center_bg = workbook.createCellStyle();
                XSSFCellStyle_center_bg.setFont(font);
                XSSFCellStyle_center_bg.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center_bg.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center_bg.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center_bg.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_center_bg.setVerticalAlignment(VerticalAlignment.CENTER);
                XSSFCellStyle_center_bg.setAlignment(HorizontalAlignment.CENTER);
                XSSFCellStyle_center_bg.setWrapText(true);
                XSSFCellStyle_center_bg.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
                XSSFCellStyle_center_bg.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                XSSFCellStyle XSSFCellStyle_left = workbook.createCellStyle();
                XSSFCellStyle_left.setFont(font);
                XSSFCellStyle_left.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left.setVerticalAlignment(VerticalAlignment.CENTER);
                XSSFCellStyle_left.setAlignment(HorizontalAlignment.LEFT);
                XSSFCellStyle_left.setWrapText(true);

                XSSFCellStyle XSSFCellStyle_left_bg = workbook.createCellStyle();
                XSSFCellStyle_left_bg.setFont(font);
                XSSFCellStyle_left_bg.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left_bg.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left_bg.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left_bg.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_left_bg.setVerticalAlignment(VerticalAlignment.CENTER);
                XSSFCellStyle_left_bg.setAlignment(HorizontalAlignment.LEFT);
                XSSFCellStyle_left_bg.setWrapText(true);
                XSSFCellStyle_left_bg.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
                XSSFCellStyle_left_bg.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                XSSFCellStyle XSSFCellStyle_right = workbook.createCellStyle();
                XSSFCellStyle_right.setFont(font);
                XSSFCellStyle_right.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right.setVerticalAlignment(VerticalAlignment.CENTER);
                XSSFCellStyle_right.setAlignment(HorizontalAlignment.RIGHT);
                XSSFCellStyle_right.setWrapText(true);

                XSSFCellStyle XSSFCellStyle_right_bg = workbook.createCellStyle();
                XSSFCellStyle_right_bg.setFont(font);
                XSSFCellStyle_right_bg.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right_bg.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right_bg.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right_bg.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                XSSFCellStyle_right_bg.setVerticalAlignment(VerticalAlignment.CENTER);
                XSSFCellStyle_right_bg.setAlignment(HorizontalAlignment.RIGHT);
                XSSFCellStyle_right_bg.setWrapText(true);
                XSSFCellStyle_right_bg.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
                XSSFCellStyle_right_bg.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                //设置标题
                for (int row = 0; dt.writeTitle && row < dt.maxTitleRows; row++) {
                    XSSFRow row1 = sheet.getRow(row);
                    if (row1 == null) {
                        row1 = sheet.createRow(row);
                    }
                    row1.setHeight((short) 1000);
                    for (int col = 0; col < dt.excelCols.size(); col++) {
                        XSSFCellStyle wcf = XSSFCellStyle_center;
                        if (ExcelDataTable.RowAlign.left.name().equals(dt.excelCols.get(col).align)) {
                            wcf = XSSFCellStyle_left;
                        } else if (ExcelDataTable.RowAlign.right.name().equals(dt.excelCols.get(col).align)) {
                            wcf = XSSFCellStyle_right;
                        }
                        XSSFCell XSSFCell = row1.getCell(col);
                        if (XSSFCell == null) {
                            XSSFCell = row1.createCell(col);
                        }
                        XSSFCell.setCellStyle(wcf);
                    }
                    for (int col = 0; col < dt.excelCols.size(); col++) {
                        ExcelDataTable.ExcelCol excelCol = dt.getTitleExcelCol(row, col);
                        if (excelCol != null) {
                            XSSFCell XSSFCell = row1.getCell(col);
                            XSSFCell.setCellValue(excelCol.title);
                            if (excelCol.colSpan > 1 || excelCol.rowSpan > 1) {//合并单元格
                                sheet.addMergedRegion(new CellRangeAddress(excelCol.row, excelCol.row + excelCol.colSpan - 1, excelCol.col, excelCol.col + excelCol.rowSpan - 1));
                            }
                        }
                    }
                }
                if (dt.insertRow) {
                    sheet.shiftRows(dt.maxTitleRows, sheet.getLastRowNum(), dt.Data.size()); //从第几行向下移动多少行
                }
                //设置内容
                for (int row = 0, len = dt.Data.size(); row < len; row++) {
                    XSSFRow row1 = sheet.getRow(row + dt.maxTitleRows);
                    if (row1 == null) {
                        row1 = sheet.createRow(row + dt.maxTitleRows);
                    }
                    row1.setHeight((short) 800);
                    for (int col = 0; col < dt.excelCols.size(); col++) {
                        Object value = dt.getDataValue(row, col);
                        XSSFCellStyle wcf = XSSFCellStyle_center;
                        XSSFCellStyle wcfBg = XSSFCellStyle_center_bg;
                        if (ExcelDataTable.RowAlign.left.name().equals(dt.excelCols.get(col).align)) {
                            wcf = XSSFCellStyle_left;
                            wcfBg = XSSFCellStyle_left_bg;
                        } else if (ExcelDataTable.RowAlign.right.name().equals(dt.excelCols.get(col).align)) {
                            wcf = XSSFCellStyle_right;
                            wcfBg = XSSFCellStyle_right_bg;
                        }
                        XSSFCell XSSFCell = row1.getCell(col);
                        if (XSSFCell == null) {
                            XSSFCell = row1.createCell(col);
                        }
                        if (value != null) {
                            Class<?> type = value.getClass();
                            if (type.equals(Integer.class) || type.equals(int.class)) {
                                XSSFCell.setCellValue(TypeConvert.ToInteger(value));
                            } else if (type.equals(Double.class) || type.equals(double.class)) {
                                XSSFCell.setCellValue(TypeConvert.ToDouble(value));
                            } else if (Date.class.isAssignableFrom(type)) {
                                Date t = TypeConvert.ToDate(value);
                                if (t != null) {
                                    if (dt.excelCols.get(col).hasTime) {
                                        XSSFCell.setCellValue(DateUtil.GetDateTimeString(t));
                                    } else {
                                        XSSFCell.setCellValue(DateUtil.GetDateString(t));
                                    }
                                }
                            } else {
                                XSSFCell.setCellValue(TypeConvert.ToString(value));
                            }
                        }
                        if (dt.hasBg(row, col)) {
                            XSSFCell.setCellStyle(wcfBg);
                        } else {
                            XSSFCell.setCellStyle(wcf);
                        }
                    }
                    dt.renderOver(sheet);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (fileInputStream != null) {
                    try {
                        fileInputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
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
