package com.anzhilai.core.toolkit.report;

import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.toolkit.FileUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.toolkit.ZipUtil;
import com.anzhilai.core.database.DataTable;

import java.util.Map;

public class WordHtmlUtil {
    public String TemplateFile;
    public String FileName;
    public DataTable dataTable;
    public String NameField="名称";
    public String TypeField="类型";
    public String ContentField="内容";
    public String ArgumentField="参数";
    public enum E_DataType {
        变量,表格, 单行,列表,图片
    }
    public WordHtmlUtil(){
    }
    public WordHtmlUtil(String _templateFile,String fileName,DataTable dt){
        FileName = fileName;
        TemplateFile = _templateFile;
        dataTable= dt;
    }
    public void SetData(DataTable dt,String nameField,String typeField,String contentField,String argumentField){
        dt = dataTable;
        NameField = nameField;
        TypeField = typeField;
        ContentField = contentField;
        ArgumentField = argumentField;
    }

    public String CreateWordHtml(){
        String temp =  GlobalValues.GetTempPath();
        ZipUtil.unzip(TemplateFile,temp);
        String file = temp+"/"+FileName+".htm";
        if(!FileUtil.isExist(file)){
            file = temp+"/"+FileName+".html";
            if(!FileUtil.isExist(file)){
                return "";
            }
        }
        String filecontent = FileUtil.readToString(file);
        // 先扩展列表
        for(Map m :dataTable.Data){
            String type = TypeConvert.ToString(m.get(TypeField));
            String name = TypeConvert.ToString(m.get(NameField));
            Object content = m.get(ContentField);
            if(type.equals(E_DataType.列表.name())){

            }
        }
        // 再是表格和变量
        for(Map m :dataTable.Data){
            String type = TypeConvert.ToString(m.get(TypeField));
            String name = TypeConvert.ToString(m.get(NameField));
            String arg = TypeConvert.ToString(m.get(ArgumentField));
            Object content = m.get(ContentField);
            if(type.equals(E_DataType.变量.name())){
                String value = TypeConvert.ToString(content);
                filecontent = instead变量(filecontent,name,value);
            }else if(type.equals(E_DataType.表格.name())){
                DataTable table = (DataTable)content;
//                table= table.FilterToNewTable(arg,null);
                //filecontent = instead表格(filecontent,name,table);
            }else if(type.equals(E_DataType.图片.name())){

            }
        }
        FileUtil.WriteStringToFile(file,filecontent);
        return file;
    }

    public String instead变量(String html, String name,String content)
    {
        String var = "变量"+name+"变量";
        String value = TypeConvert.ToString(content);
        return html.replace(var,value);
    }
//
//    public String instead表格(String html, String name,DataTable table)
//    {
//        String bgname = "表格"+name+"表格";
//        int bgindex = html.indexOf(bgname);
//
//        int bgstart = 0, bgend = 0;
//        string htmlbg = FindHtml_Table(html, bgindex, ref bgstart, ref bgend);
//
//        string htmlstart = html.Substring(0, bgnamestart);
//        string htmlend = html.Substring(bgend);
//
//        int tablebodystart = 0, tablebodyend = 0;
//        string tablebody = FindHtml_TableBody(htmlbg, ref tablebodystart, ref tablebodyend);
//
//        StringBuilder sbtablerows = new StringBuilder();
//        int rowstart = 0, rowend = 0;
//        string rowname = "列名";
//        string htmlrow = FindHtml_TableRow(htmlbg, rowname, ref rowstart, ref rowend);
//        foreach (DataRow dr in dt.Rows)
//        {
//            string temprow = "";
//            if (dt.Columns.Contains(WordUtil.WordTableRowName))
//            {
//                string[] rownames = DBRGConvert.ToString(dr[WordUtil.WordTableRowName]).Split('|');
//                if (!string.IsNullOrEmpty(rownames[0]))
//                {
//                    rowname = rownames[0];
//                }
//                if (rownames.Length > 1)
//                {
//                    temprow = FindHtml_TableRow(htmlbg, rownames[1], ref rowstart, ref rowend);
//
//                    if (string.IsNullOrEmpty(temprow))
//                    {
//                        rowname = "列名";
//                        rownames[1] = rownames[1].Replace(rownames[0], rowname);
//                        if (rownames.Length > 1)
//                        {
//                            temprow = FindHtml_TableRow(htmlbg, rownames[1], ref rowstart, ref rowend);
//                        }
//                    }
//                }
//            }
//            if (string.IsNullOrEmpty(temprow))
//            {
//                temprow = htmlrow;
//            }
//            foreach (DataColumn dc in dt.Columns)
//            {
//                string b = rowname + dc.ColumnName + rowname;
//
//                string content = DBRGConvert.ToString(dr[dc]);
//
//                if (dc.DataType == typeof(double) || dc.DataType == typeof(float) || dc.DataType == typeof(decimal))
//                {
//                    if (dicTableFormat != null)
//                    {
//                        if (dicTableFormat.ContainsKey(dc.ColumnName))
//                        {
//                            content = string.Format(dicTableFormat[dc.ColumnName], dr[dc]);
//                        }
//                    }
//                }
//                if (dc.DataType == typeof(DateTime))
//                {
//                    content = DateUtil.GetDateString(DBRGConvert.ToNullDateTime(dr[dc]));
//                }
//                if (content.Contains("\r\n"))
//                {
//                    int repeatStart = 0, repeatEnd = 0;
//
//                    string repeatPart = FindHtml_P(temprow, b, ref repeatStart, ref repeatEnd);
//                    if (!string.IsNullOrEmpty(repeatPart))
//                    {
//                        string[] contents = content.Split("\r\n".ToArray(), StringSplitOptions.RemoveEmptyEntries);
//                        string repeatResult = string.Empty;
//                        foreach (string str in contents)
//                        {
//                            repeatResult += repeatPart.Replace(b, str) + "\r\n";
//                        }
//                        temprow = temprow.Replace(repeatPart, repeatResult.CutEnd("\r\n"));
//                    }
//                }
//                else
//                {
//                    temprow = temprow.Replace(b, content);
//                }
//            }
//            sbtablerows.Append(temprow);
//        }
//        htmlbg = htmlbg.Substring(0, tablebodystart) + sbtablerows.ToString() + htmlbg.Substring(tablebodyend, htmlbg.Length - tablebodyend);
//
//        String result = htmlstart + htmlbg + htmlend;
//        return result;
//    }


    class FindResult{
        public String result;
        public int start;
        public int end;
        public FindResult SetValue(String r,int s,int e){
            this.result = r;
            this.start = s;
            this.end = e;
            return this;
        }
    }

    FindResult FindHtml_P(String html, String name, int start, int end)
    {
        String substr = "";
        int index = html.indexOf(name);
        if (index > 0)
        {
            start = html.lastIndexOf("<p", index);
            end = html.indexOf("/p>", index) + "/p>".length();
            substr = html.substring(start, end - start);
        }
        return new FindResult().SetValue(substr,start,end);
    }
    FindResult FindHtml_Span(String html, String name, int start, int end)
    {
        String substr = "";
        int index = html.indexOf(name);
        if (index > 0)
        {
            start = html.lastIndexOf("<span", index);
            end = html.indexOf("/span>", index) + "/span>".length();
            substr = html.substring(start, end - start);
        }
        return new FindResult().SetValue(substr,start,end);
    }

    FindResult FindHtml_Table(String html, int startindex, int start, int end)
    {
        String tablestr = "";
        start = html.indexOf("<table", startindex);
        end = html.indexOf("/table>", startindex) + "/table>".length();
        tablestr = html.substring(start, end - start);
        return new FindResult().SetValue(tablestr,start,end);
    }

    FindResult FindHtml_TableBody(String tablehtml, int start, int end)
    {
        String body = "";
        int headend = tablehtml.indexOf("/thead>") + "/thead>".length();
        start = tablehtml.indexOf("<tr", headend);
        end = tablehtml.lastIndexOf("tr>") + "tr>".length();
        body = tablehtml.substring(start, end - start);
        return new FindResult().SetValue(body,start,end);
    }

    FindResult FindHtml_TableRow(String tablehtml, String rowname, int start, int end)
    {
        String row = "";
        int rownamestart = tablehtml.indexOf(rowname);
        if (rownamestart > 0)
        {
            start = tablehtml.lastIndexOf("<tr", rownamestart);
            end = tablehtml.indexOf("/tr>", start) + "/tr>".length();
            row = tablehtml.substring(start, end - start);
        }
        return new FindResult().SetValue(row,start,end);
    }
}
