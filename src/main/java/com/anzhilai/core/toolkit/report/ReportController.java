package com.anzhilai.core.toolkit.report;

import com.anzhilai.core.base.*;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import com.anzhilai.core.base.*;
import com.anzhilai.core.database.DataTable;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
@XController(name = "ReportController")
@Transactional(rollbackFor = {Exception.class})
@RequestMapping("/report")
public class ReportController  extends BaseController {

    @XController(name = "Excel导出")
    @RequestMapping(value = "/{pinyin}/export_excel", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String export_excel(@PathVariable String pinyin, HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String name = RequestUtil.GetString(request, "下载文件名称");
        String[] cols = RequestUtil.GetStringArray(request,"选择导出列");

        BaseModel model =GetModelInstance(pinyin);
        if(model!=null){
            BaseQuery queryModel = model.CreateQueryModel().InitFromRequest(request).NotPagination();
            boolean isTree = TypeConvert.ToBoolean(queryModel.IsTree);
            if (isTree) {
                queryModel.Parentids = null;
                queryModel.IsTree = false;
            }
            DataTable dt = model.GetList(queryModel);
            ExcelDataTable excelDataTable = new ExcelDataTable(dt);
            excelDataTable.filterCol(cols);
            if (isTree && excelDataTable.excelCols.size() > 0) {
                excelDataTable.excelCols.get(0).align = DataTable.RowAlign.left.name();
                String field = excelDataTable.excelCols.get(0).field;
                for (Map row : dt.Data) {
                    int treelevel = TypeConvert.ToInteger(row.get(BaseModelTree.F_TreeLevel));
                    String firstName = TypeConvert.ToString(row.get(field));
                    String space = "";
                    for (int i = 0; i < treelevel; i++) {
                        space += "  ";
                    }
                    row.put(field, space+ firstName);
                }
            }
            if (StrUtil.isNotEmpty(name)) {
                excelDataTable.title = name;
            } else {
                excelDataTable.title = BaseModel.GetTableName(GetModelClass(pinyin));
            }
            ExcelWriteFormatUtils.exportXls(response, excelDataTable.title, excelDataTable);
        }
        return null;
    }

}
