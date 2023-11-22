package com.anzhilai.core.toolkit.report;

import com.anzhilai.core.toolkit.FileUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.database.DataTable;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class HtmlToDocUtils {

    public static final String TD_DELETE_HTML = "<td width=\"0\"></td>";

    public static void main(String[] args) throws Exception {
        List<Object> list = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            HashMap<String, Object> m = new HashMap<>();
            if (i < 10) {
                m.put("装备代码", "装备代码" + i);
                m.put("品名程式", "品名程式" + i);
                m.put("生产厂商", "生产厂商" + i);
                m.put("单位", "单位" + i);
                m.put("品级", "品级" + i);
                m.put("序列号", "" + i);
                m.put("通知数", "" + i);
                m.put("实发数", "" + i);
                m.put("备注", "备注" + i);
            }
            list.add(m);
        }

        //核心API采用了极简设计，只需要一行代码
        String path = "C:\\Users\\tangbin\\Desktop\\调拨单格式\\newDat.docx";
        String outPath = "C:\\Users\\tangbin\\Desktop\\调拨单格式\\out_newDat.docx";
        WordUtil.compileToWord(path, outPath, new HashMap<String, Object>() {{
            put("标题", "这是一个标题");
            put("型号列表表格", list);
        }});
    }

    public static void main2(String[] args) throws Exception {
        String path = "C:\\Users\\tangbin\\Desktop\\调拨单格式\\test.htm";
        File file = new File(path);
        if (file.exists()) {
            String headerContent = "";//页眉页脚
            String headerPath = file.getParentFile().getPath() + File.separator + file.getName() + ".files"
                    + File.separator + "header.htm";
            if (new File(headerPath).exists()) {
                headerContent = HtmlToDoc.readFile(headerPath);
            }
            String docPath = "C:\\Users\\tangbin\\Desktop\\调拨单格式\\test.doc";
            String content = HtmlToDoc.readFile(path);
            DataTable dataTable = new DataTable();
            HashMap<String, Object> m = null;
            for (int i = 0; i < 10; i++) {
                m = new HashMap<>();
                m.put("装备代码", "装备代码" + i);
                m.put("品名程式", "品名程式" + i);
                m.put("生产厂商", "生产厂商" + i);
                m.put("单位", "单位" + i);
                m.put("品级", "品级" + i);
                m.put("序列号", "序列号" + i);
                m.put("通知数", "通知数" + i);
                m.put("实发数", "实发数" + i);
                m.put("备注", "备注" + i);
                dataTable.AddRow(m);
            }
            content = replaceTable(content, null, dataTable, m.keySet().toArray(new String[m.keySet().size()]));
            content = replaceParams(content, "备注1", "测试标题！！！");
            if (StrUtil.isNotEmpty(headerContent)) {
                headerContent = replaceParams(content, "备注1", "测试标题！！！");//替换其他变量
                FileUtil.WriteStringToFile(headerPath, headerContent);//重新写入
            }
            HtmlToDoc.writeWord(docPath, content);// 转成doc
        }
    }

    public static String replaceTables(String content, String tableTitle, ArrayList<String> dtTitles, ArrayList<ArrayList<String>> dtCols, ArrayList<DataTable> dtList) {
        return replaceTables(content, tableTitle, dtTitles, dtCols, dtCols, dtList);
    }

    public static String replaceTables(String content, String tableTitle, ArrayList<String> dtTitles, ArrayList<ArrayList<String>> dtCols, ArrayList<ArrayList<String>> dtShowCols, ArrayList<DataTable> dtList) {
        String titleKey = "h3";
        int startIndex = content.indexOf(tableTitle);
        if (startIndex != -1) {
            String startStr = content.substring(0, startIndex);
            int start = startStr.lastIndexOf("<" + titleKey);
            content = content.substring(startIndex);// 分开

            String titleStr = startStr.substring(start);// 标题字符串
            startStr = startStr.substring(0, start);// 前面的字符

            start = content.indexOf("/" + titleKey + ">");
            titleStr += content.substring(0, start + ("/" + titleKey + ">").length());

            content = content.substring(start + ("/" + titleKey + ">").length());
            String[] strs = splitHtmlKey(content, "table");// 从开始查询table

            String tableStartStr = strs[0];
            String table = strs[1];
            String endStr = strs[2];

            String[] tableStrs = splitHtmlKey(table, "tr");
            String tr = tableStrs[1];

            String[] trStrs = splitHtmlKey(tr, "td");
            String td = trStrs[1];

            String html = "";
            Object obj;
            String _titleStr, _trhtml, _table, value;
            ArrayList<String> cols, cols2;
            DataTable dt;
            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (int i = 0, len = dtTitles.size(); i < len; i++) {
                dt = dtList.get(i);
                cols = dtCols.get(i);
                cols2 = dtShowCols.get(i);
                _titleStr = titleStr.replaceFirst(tableTitle, dtTitles.get(i));
                _trhtml = "";
                // 写入标题
                _trhtml += trStrs[0];
                for (int j = 0, len2 = cols.size(); j < len2; j++) {
                    _trhtml += td.replaceFirst("内容", cols2.get(j));
                }
                _trhtml += trStrs[2];
                // 写入数据
                for (Map<String, Object> map : dt.Data) {
                    _trhtml += trStrs[0];
                    for (int j = 0, len2 = cols.size(); j < len2; j++) {
                        obj = map.get(cols.get(j));
                        value = "";
                        if (obj != null) {
                            if (obj.getClass() == java.util.Date.class) {
                                value = sf.format((java.util.Date) obj);
                            } else {
                                value = obj.toString();
                            }
                        }
                        _trhtml += td.replaceFirst("内容", value);
                    }
                    _trhtml += trStrs[2];
                }
                _table = tableStrs[0] + _trhtml + tableStrs[2];
                html += _titleStr + tableStartStr + _table;
            }
            // content = startStr + titleStr + tableStartStr + table + endStr;
            content = startStr + html + endStr;
        }
        return content;
    }

    public static String replaceTable(String content, String tableTitle, DataTable dt, String[] keys) {
        boolean replace = false;
        String endStr = "";
        String startStr = "";
        if (StrUtil.isNotEmpty(tableTitle)) {
            int startIndex = content.indexOf(tableTitle);
            if (startIndex != -1) {
                startStr = content.substring(0, startIndex);
                content = content.substring(startIndex + tableTitle.length());// 去掉标记字符串tableTitle
                replace = true;
            }
        } else {
            replace = true;
        }
        if (replace) {
            // 查询table
            String[] strs = splitHtmlKey(content, "table");// 从开始查询table
            startStr += strs[0];
            content = strs[1];
            endStr = strs[2];

            // System.out.println(content);// table
            int num = 1;
            while (true) {
                strs = splitHtmlKey(content, "tr", num);
                if (strs[1].contains(getReplaceKey(keys[0]))) {
                    break;
                } else {
                    num++;
                }
            }
            startStr += strs[0];
            content = strs[1];// 当前tr的值
            endStr = strs[2] + endStr;

            if (dt != null) {
                String trHtml = content;
                content = "";
                SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                for (Map<String, Object> map : dt.Data) {// 字符替换
                    String tr = trHtml;
                    for (String key : keys) {
                        Object obj = map.get(key);
                        String value = "";
                        if (obj != null) {
                            if (obj.getClass() == java.util.Date.class) {
                                value = sf.format((java.util.Date) obj);
                            } else {
                                value = obj.toString();
                            }
                        }
                        tr = replaceParams(tr, key, value);
                    }
                    content += tr;
                }
            }
            // System.out.println(startStr);
            // System.out.println("****************************************");
            // System.out.println(content);// 多行tr字符
            // System.out.println("****************************************");
            // System.out.println(endStr);
            content = startStr + content + endStr;
        }
        return content;
    }

    /**
     * 查询html标记，返回标记字符数组
     *
     * @param content
     * @param key
     * @return
     */

    public static String[] splitHtmlKey(String content, String key) {
        return splitHtmlKey(content, key, 1);
    }

    public static String[] splitHtmlKey(String content, String key, int num) {
        String startStr = "", endStr = "";
        int start = -2;
        for (int i = 0; i < num; i++) {
            if (start == -1) {
                return new String[]{startStr, content, endStr};
            } else if (start == -2) {
                start = content.indexOf("<" + key);
            } else {
                start = content.indexOf("<" + key, start + ("<" + key).length());
            }
        }
        if (start >= 0) {
            int end = content.indexOf("/" + key + ">", start);
            // 字符处理
            startStr = content.substring(0, start);
            endStr = content.substring(end + ("/" + key + ">").length());
            content = content.substring(start, end + ("/" + key + ">").length());
        }
        return new String[]{startStr, content, endStr};
    }

    // public static String[] splitHtmlKeyToLast(String content, String key) {
    // return splitHtmlKeyToLast(content, key, 1);
    // }
    // public static String[] splitHtmlKeyToLast(String content, String key,
    // int num) {
    // String startStr = "", endStr = "";
    // int start = content.lastIndexOf("<" + key);
    // if (start >= 0) {
    // int end = content.indexOf("/" + key + ">", start);
    // // 字符处理
    // startStr = content.substring(0, start);
    // endStr = content.substring(end + ("/" + key + ">").length());
    // content = content
    // .substring(start, end + ("/" + key + ">").length());
    // }
    // return new String[] { startStr, content, endStr };
    // }

    public static String mergeCells(String content, int indexTable, String type, int index, int start) throws Exception {
        String[] strs = splitHtmlKey(content, "table", indexTable);// 查询第二行的tr
        ArrayList<String[]> trList = new ArrayList<String[]>();
        ArrayList<String[]> tdList = new ArrayList<String[]>();
        ArrayList<String[]> tdList2 = new ArrayList<String[]>();

        String startStr = strs[0];
        String str = strs[1];
        String endStr = strs[2];
        while (true) {
            strs = splitHtmlKey(str, "tr");
            if (strs[2].equals("")) {
                break;
            } else {
                trList.add(strs);
                str = strs[2];
                tdList.add(splitHtmlKey(strs[1], "td", index + 1));// 查询td
            }
        }
        String lastStr = null;
        int lastIndex = -1;
        if (type.equals("row")) {// 合并第index行，相同的字符
            if (index < trList.size()) {
                strs = trList.get(index);
                str = strs[1];
                // 查询当前行所有的td
                while (true) {
                    strs = splitHtmlKey(str, "td");
                    if (strs[2].equals("")) {
                        break;
                    } else {
                        tdList2.add(strs);// 查询td
                        str = strs[2];
                    }
                }
                for (int i = start, len = tdList2.size(); i < len; i++) {
                    String[] _strs = tdList2.get(i);// td的值
                    String text = splitHtmlKey(_strs[1], "span")[1];
                    if (text.equals(TD_DELETE_HTML)) {
                        text = "";
                    } else {
                        text = text.substring(text.indexOf(">") + 1, text.lastIndexOf("</span>"));
                    }
                    // System.out.println(text);
                    if (!text.equals(lastStr)) {
                        if (lastIndex != -1) {
                            for (int d = 1; d < i - lastIndex; d++) {
                                tdList2.get(d + lastIndex)[1] = TD_DELETE_HTML;// 删除多余的td
                            }
                            String td = tdList2.get(lastIndex)[1];
                            tdList2.get(lastIndex)[1] = td.replaceAll("<td ", "<td colspan=\"" + (i - lastIndex) + "\" ");
                        }
                        lastStr = text;
                        lastIndex = i;
                    }
                }
                if (lastIndex != -1) {
                    int j = tdList2.size();
                    for (int d = 1; d < j - lastIndex; d++) {
                        tdList2.get(d + lastIndex)[1] = TD_DELETE_HTML;// 删除多余的td
                    }
                    String td = tdList2.get(lastIndex)[1];
                    tdList2.get(lastIndex)[1] = td.replaceAll("<td ", "<td colspan=\"" + (j - lastIndex) + "\" ");
                }
                String _content = "";
                for (int i = 0, len = tdList2.size(); i < len; i++) {
                    String[] _strs = tdList2.get(i);
                    _content += _strs[0];
                    _content += _strs[1];// td的值
                    if (i + 1 == len) {
                        _content += strs[2];
                    }
                }
                tdList.get(index)[0] = "";
                tdList.get(index)[1] = _content + str;
                tdList.get(index)[2] = "";
            }
        } else {// 合并例
            for (int i = start, len = trList.size(); i < len; i++) {
                strs = trList.get(i);
                String[] _strs = tdList.get(i);// td的值
                String text = splitHtmlKey(_strs[1], "span")[1];
                if (text.equals(TD_DELETE_HTML)) {
                    text = "";
                } else {
                    text = text.substring(text.indexOf(">") + 1, text.lastIndexOf("</span>"));
                }
                if (!text.equals(lastStr)) {
                    if (lastIndex != -1) {
                        for (int d = 1; d < i - lastIndex; d++) {
                            tdList.get(d + lastIndex)[1] = TD_DELETE_HTML;// 删除多余的td
                        }
                        String td = tdList.get(lastIndex)[1];
                        tdList.get(lastIndex)[1] = td.replaceAll("<td ", "<td rowspan=\"" + (i - lastIndex) + "\" ");
                    }
                    lastStr = text;
                    lastIndex = i;
                }
            }
            if (lastIndex != -1) {
                int j = trList.size();
                for (int d = 1; d < j - lastIndex; d++) {
                    tdList.get(d + lastIndex)[1] = TD_DELETE_HTML;// 删除多余的td
                }
                String td = tdList.get(lastIndex)[1];
                tdList.get(lastIndex)[1] = td.replaceAll("<td ", "<td rowspan=\"" + (j - lastIndex) + "\" ");
            }
        }

        String _content = startStr;
        for (int i = 0, len = trList.size(); i < len; i++) {
            strs = trList.get(i);
            _content += strs[0];
            String[] _strs = tdList.get(i);
            _content += _strs[0];
            _content += _strs[1];// td的值
            _content += _strs[2];
            if (i + 1 == len) {
                _content += strs[2];
            }
        }
        _content += endStr;
        // System.out.println(content.equals(_content)
        // + "*********************************************");
        return _content;
    }

    public static String delHTMLTag(String htmlStr) {
        String regEx_span = "<span[^>]*?>[\\s\\S]*?<\\/span>";
        Pattern p_span = Pattern.compile(regEx_span, Pattern.CASE_INSENSITIVE);
        Matcher m_span = p_span.matcher(htmlStr);
        if (m_span.find()) {
            System.out.println(m_span.group());
        }
        return htmlStr; // 返回文本字符串
    }

    public static String getReplaceKey(String key) {
        return "变量" + key + "变量";
    }

    public static String replaceParams(String content, String key, String value) {
        return content.replaceFirst(getReplaceKey(key), value);
    }
}
