package com.anzhilai.core.toolkit.report;

import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.database.DataTable;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Date;

public class ExcelWriteFormatUtils {
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
            HSSFWorkbook workbook = null;
            FileInputStream fileInputStream = null;
            try {
                HSSFSheet sheet;
                if (StrUtil.isNotEmpty(dt.tempExcelPath) && new File(dt.tempExcelPath).exists()) {
                    fileInputStream = new FileInputStream(dt.tempExcelPath);
                    workbook = new HSSFWorkbook(fileInputStream);
                    sheet = workbook.getSheetAt(0);
                } else {
                    dt.writeTitle = true;
                    workbook = new HSSFWorkbook();
                    sheet = workbook.createSheet(dt.title);// 设置sheet名字
                    // 设置宽度
                    for (int i = 0; i < dt.excelCols.size(); i++) {
                        sheet.setColumnWidth(i, dt.excelCols.get(i).width);// 定义第1列，及其宽度
                    }
                }

                HSSFFont font = workbook.createFont();
                font.setFontName("Arial");
                font.setFontHeightInPoints((short) 12);// 字体大小
                font.setBold(true);// 加粗
                HSSFCellStyle hssfCellStyle_center = workbook.createCellStyle();
                hssfCellStyle_center.setFont(font);
                hssfCellStyle_center.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center.setVerticalAlignment(VerticalAlignment.CENTER);
                hssfCellStyle_center.setAlignment(HorizontalAlignment.CENTER);
                hssfCellStyle_center.setWrapText(true);

                HSSFCellStyle hssfCellStyle_center_bg = workbook.createCellStyle();
                hssfCellStyle_center_bg.setFont(font);
                hssfCellStyle_center_bg.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center_bg.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center_bg.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center_bg.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_center_bg.setVerticalAlignment(VerticalAlignment.CENTER);
                hssfCellStyle_center_bg.setAlignment(HorizontalAlignment.CENTER);
                hssfCellStyle_center_bg.setWrapText(true);
                hssfCellStyle_center_bg.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
                hssfCellStyle_center_bg.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                HSSFCellStyle hssfCellStyle_left = workbook.createCellStyle();
                hssfCellStyle_left.setFont(font);
                hssfCellStyle_left.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left.setVerticalAlignment(VerticalAlignment.CENTER);
                hssfCellStyle_left.setAlignment(HorizontalAlignment.LEFT);
                hssfCellStyle_left.setWrapText(true);

                HSSFCellStyle hssfCellStyle_left_bg = workbook.createCellStyle();
                hssfCellStyle_left_bg.setFont(font);
                hssfCellStyle_left_bg.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left_bg.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left_bg.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left_bg.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_left_bg.setVerticalAlignment(VerticalAlignment.CENTER);
                hssfCellStyle_left_bg.setAlignment(HorizontalAlignment.LEFT);
                hssfCellStyle_left_bg.setWrapText(true);
                hssfCellStyle_left_bg.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
                hssfCellStyle_left_bg.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                HSSFCellStyle hssfCellStyle_right = workbook.createCellStyle();
                hssfCellStyle_right.setFont(font);
                hssfCellStyle_right.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right.setVerticalAlignment(VerticalAlignment.CENTER);
                hssfCellStyle_right.setAlignment(HorizontalAlignment.RIGHT);
                hssfCellStyle_right.setWrapText(true);

                HSSFCellStyle hssfCellStyle_right_bg = workbook.createCellStyle();
                hssfCellStyle_right_bg.setFont(font);
                hssfCellStyle_right_bg.setBorderTop(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right_bg.setBorderRight(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right_bg.setBorderLeft(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right_bg.setBorderBottom(BorderStyle.THIN); // 设置单元格的边框为粗体
                hssfCellStyle_right_bg.setVerticalAlignment(VerticalAlignment.CENTER);
                hssfCellStyle_right_bg.setAlignment(HorizontalAlignment.RIGHT);
                hssfCellStyle_right_bg.setWrapText(true);
                hssfCellStyle_right_bg.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
                hssfCellStyle_right_bg.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                //设置标题
                for (int row = 0; dt.writeTitle && row < dt.maxTitleRows; row++) {
                    HSSFRow row1 = sheet.getRow(row);
                    if (row1 == null) {
                        row1 = sheet.createRow(row);
                    }
                    row1.setHeight((short) 1000);
                    for (int col = 0; col < dt.excelCols.size(); col++) {
                        HSSFCellStyle wcf = hssfCellStyle_center;
                        if (DataTable.RowAlign.left.name().equals(dt.excelCols.get(col).align)) {
                            wcf = hssfCellStyle_left;
                        } else if (DataTable.RowAlign.right.name().equals(dt.excelCols.get(col).align)) {
                            wcf = hssfCellStyle_right;
                        }
                        HSSFCell hssfCell = row1.getCell(col);
                        if (hssfCell == null) {
                            hssfCell = row1.createCell(col);
                        }
                        hssfCell.setCellStyle(wcf);
                    }
                    for (int col = 0; col < dt.excelCols.size(); col++) {
                        ExcelDataTable.ExcelCol excelCol = dt.getTitleExcelCol(row, col);
                        if (excelCol != null) {
                            HSSFCell hssfCell = row1.getCell(col);
                            hssfCell.setCellValue(excelCol.title);
                            if (excelCol.colSpan > 1 || excelCol.rowSpan > 1) {//合并单元格
                                sheet.addMergedRegion(new CellRangeAddress(excelCol.row, excelCol.row + excelCol.colSpan - 1, excelCol.col, excelCol.col + excelCol.rowSpan - 1));
                            }
                        }
                    }
                }
                //设置内容
                for (int row = 0, len = dt.Data.size(); row < len; row++) {
                    HSSFRow row1 = sheet.getRow(row + dt.maxTitleRows);
                    if (row1 == null) {
                        row1 = sheet.createRow(row + dt.maxTitleRows);
                    }
                    row1.setHeight((short) 800);
                    for (int col = 0; col < dt.excelCols.size(); col++) {
                        Object value = dt.getDataValue(row, col);
                        HSSFCellStyle wcf = hssfCellStyle_center;
                        HSSFCellStyle wcfBg = hssfCellStyle_center_bg;
                        if (DataTable.RowAlign.left.name().equals(dt.excelCols.get(col).align)) {
                            wcf = hssfCellStyle_left;
                            wcfBg = hssfCellStyle_left_bg;
                        } else if (DataTable.RowAlign.right.name().equals(dt.excelCols.get(col).align)) {
                            wcf = hssfCellStyle_right;
                            wcfBg = hssfCellStyle_right_bg;
                        }
                        HSSFCell hssfCell = row1.getCell(col);
                        if (hssfCell == null) {
                            hssfCell = row1.createCell(col);
                        }
                        if (value != null) {
                            Class<?> type = value.getClass();
                            if (type.equals(Integer.class) || type.equals(int.class)) {
                                hssfCell.setCellValue(TypeConvert.ToInteger(value));
                            } else if (type.equals(Double.class) || type.equals(double.class)) {
                                hssfCell.setCellValue(TypeConvert.ToDouble(value));
                            } else if (Date.class.isAssignableFrom(type)) {
                                Date t = TypeConvert.ToDate(value);
                                if (t != null) {
                                    if (dt.excelCols.get(col).hasTime) {
                                        hssfCell.setCellValue(DateUtil.GetDateTimeString(t));
                                    } else {
                                        hssfCell.setCellValue(DateUtil.GetDateString(t));
                                    }
                                }
                            } else {
                                hssfCell.setCellValue(TypeConvert.ToString(value));
                            }
                        }
                        if (dt.hasBg(row, col)) {
                            hssfCell.setCellStyle(wcfBg);
                        } else {
                            hssfCell.setCellStyle(wcf);
                        }
                    }
                }
                for (int i = 0; i < dt.excelCols.size(); i++) {//设置列约束
                    if (dt.colIsStringArray(i)) {
                        setDataValidationView(sheet, 1, dt.Data.size() + 1, i, i, (String[]) dt.getColType(i));
                    } else {
                        setDataValidationView(sheet, 1, dt.Data.size() + 1, i, i, (Class) dt.getColType(i));
                    }
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


    /**
     * 设置下拉框元素
     *
     * @param firstRow 起始行
     * @param endRow   结束行
     * @param firstCol 起始列
     * @param endCol   结束列
     * @param list     下拉框选项
     * @return
     */
    public static HSSFDataValidation setDataValidationView(HSSFSheet sheet, int firstRow, int endRow, int firstCol, int endCol, String[] list) {
        //加载下拉列表内容
        DVConstraint constraint = DVConstraint.createExplicitListConstraint(list);
        //设置数据有效性加载在哪个单元格上。
        //四个参数分别是：起始行、终止行、起始列、终止列
        CellRangeAddressList regions = new CellRangeAddressList(firstRow, endRow, firstCol, endCol);
        //数据有效性对象
        HSSFDataValidation data_validation_list = new HSSFDataValidation(regions, constraint);
        String title = "请输入字典";
        String message = "如:";
        for (String str : list) {
            message += str + ",";
        }
        if (list.length > 0) {
            message = message.substring(0, message.length() - 1);
        }
        data_validation_list.createPromptBox(title, message);
        //设置出错警告样式 0是停止 1是警告 2是信息
        data_validation_list.setErrorStyle(0);
        sheet.addValidationData(data_validation_list);
        return data_validation_list;
    }


    /**
     * 设置注释文字
     *
     * @param sheet    工作表对象
     * @param hssfCell cell框
     * @param message  提示信息
     */
    public static void setCellComment(HSSFSheet sheet, HSSFCell hssfCell, String message) {
        //创建绘图对象
        HSSFPatriarch drawingPatriarch = sheet.createDrawingPatriarch();
        //前四个参数是坐标点,后四个参数是编辑和显示批注时的大小.
        HSSFComment comment = drawingPatriarch.createComment(new HSSFClientAnchor(0, 1, 0, 1, (short) 2, 2, (short) 2, 3));
        comment.setString(new HSSFRichTextString(message));
        hssfCell.setCellComment(comment);
    }


    /**
     * 设置必填项文本长度
     *
     * @param shell    需要操作的HSSFSheet
     * @param firstRow 起始行
     * @param endRow   结束行
     * @param firstCol 起始列
     * @param endCol   结束列
     * @param type     类型
     * @return
     */

    public static void setDataValidationView(HSSFSheet shell, int firstRow, int endRow, int firstCol, int endCol, Class type) {
        setDataValidationView(shell, firstRow, endRow, firstCol, endCol, type, "", "");
    }

    public static HSSFDataValidation setDataValidationView(HSSFSheet shell, int firstRow, int endRow, int firstCol, int endCol, Class type, String title, String message) {
        //构造constraint对象
        //DVConstraint constraint = DVConstraint.createCustomFormulaConstraint("6");
        HSSFDataValidationHelper dvHelper = new HSSFDataValidationHelper(shell);
        //构造constraint对象 设置有效性验证为 文本长度 最小长度为1
        DVConstraint constraint = null;
        if (type == int.class || type == Integer.class) {
            title = "请输入整数";
            message = "如:1";
            constraint = (DVConstraint) dvHelper.createIntegerConstraint(DataValidationConstraint.OperatorType.BETWEEN, String.valueOf(Integer.MIN_VALUE), String.valueOf(Integer.MAX_VALUE));//数字
        } else if (type == Date.class) {
            title = "请输入时间";
            message = "如:2020-12-15";
            constraint = (DVConstraint) dvHelper.createDateConstraint(DataValidationConstraint.OperatorType.BETWEEN, "1900-01-01", "9999-12-31", "yyyy-MM-dd");//日期
        } else if (type == float.class || type == Float.class || type == double.class || type == Double.class) {
            title = "请输入数字";
            message = "如:1";
            constraint = (DVConstraint) dvHelper.createNumericConstraint(DataValidationConstraint.ValidationType.DECIMAL, DataValidationConstraint.OperatorType.BETWEEN, String.valueOf(Double.MIN_VALUE), String.valueOf(Double.MAX_VALUE));//数字
        } else {
            return null;
        }
        //constraint = (DVConstraint) dvHelper.createTextLengthConstraint(DataValidationConstraint.OperatorType.GREATER_OR_EQUAL, String.valueOf(1), String.valueOf(20));
        //constraint = (DVConstraint)dvHelper.createTimeConstraint(DataValidationConstraint.OperatorType.BETWEEN,"","","");//时间
        //四个参数分别是：起始行、终止行、起始列、终止列
        CellRangeAddressList regions = new CellRangeAddressList(firstRow, endRow, firstCol, endCol);
        //数据有效性对象
        HSSFDataValidation data_validation_view = new HSSFDataValidation(regions, constraint);
        //设置提示标题,内容
        data_validation_view.createPromptBox(title, message);
        //忽略空值
        data_validation_view.setEmptyCellAllowed(false);
        data_validation_view.createErrorBox("您输入信息或格式有误", "请按提示信息输入");
        //设置出错警告样式 0是停止 1是警告 2是信息
        data_validation_view.setErrorStyle(0);
        /*有的excel版本默认是false
        data_validation_view.setShowErrorBox(true);*/
        data_validation_view.setShowPromptBox(true);
        shell.addValidationData(data_validation_view);
        return data_validation_view;
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
