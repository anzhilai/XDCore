package com.anzhilai.core.base;

import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.database.AjaxResult;
import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.toolkit.*;
import com.anzhilai.core.toolkit.report.WordUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import sun.reflect.generics.reflectiveObjects.TypeVariableImpl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Api(tags = "基础模型控制器")
public abstract class BaseModelController<T extends BaseModel> extends BaseController {
    public static Logger log = Logger.getLogger(BaseModelController.class);

    /**
     * 快速获取泛型的类型的方法
     *
     * @param objectClass 要取泛型的对应的Class
     * @param i           要取第几个泛型(0开始)
     * @param <T>
     * @return 对应的泛型
     */
    public static <T> Class<T> GetGenericClass(Class<? extends Object> objectClass, int i) {
        ParameterizedType type = (ParameterizedType) objectClass.getGenericSuperclass();
        if (type == null) {
            return null;
        }
        Type[] types = type.getActualTypeArguments();
        if (types[i].getClass() == TypeVariableImpl.class) {
            return (Class<T>) ((TypeVariableImpl) types[i]).getBounds()[0];
        }
        return (Class<T>) types[i];
    }

    public Class<T> GetClass() {
        return GetGenericClass(this.getClass(), 0);
    }

    @ApiOperation(value = "统计值", notes = "对单列的统计结果")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "filter", value = "统计数据的过滤条件", required = true, dataType = "QueryFilter", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/statvalue", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statvalue(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model =  TypeConvert.CreateNewInstance(GetClass());
        Object s = model.GetStat(model.CreateQueryModel().InitFromRequest(request));
        if (StrUtil.isEmpty(s)) {
            s = "0";
        }
        return AjaxResult.True(s).ToJson();
    }

    @ApiOperation(value = "统计列表", notes = "对特定列进行GroupBy，统计结果列表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "filter", value = "统计数据的过滤条件", required = true, dataType = "QueryFilter", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/statlist", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statlist(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model =  TypeConvert.CreateNewInstance(GetClass());
        BaseStatistic statistic = model.CreateStatisticModel();
        if (statistic != null) {
            DataTable dt = statistic.run(model.CreateQueryModel().InitFromRequest(request));
            return dt.ToJson();
        }
        DataTable dt = model.GetStatGroup(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }
    @ApiOperation(value = "查询列表", notes = "查询结果DataTable")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "filter", value = "查询过滤条件", required = true, dataType = "QueryFilter", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/querylist", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String querylist(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = TypeConvert.CreateNewInstance(GetClass());
        DataTable dt = model.GetList(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }

    @ApiOperation(value = "查询详细信息", notes = "以Map形式返回整条记录")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "数据的唯一值id", required = true, dataType = "String", paramType = "query")
    })
    @XController
    @RequestMapping(value = "/queryinfo", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String queryinfo(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        String id = RequestUtil.GetString(request, BaseModel.F_id);
        T t = BaseModel.GetObjectById(GetClass(), id);
        if (t == null) {
            t = TypeConvert.CreateNewInstance(GetClass());
            t.SetValuesByRequest(request);
        }
        return AjaxResult.True(t.ToMap()).ToJson();
    }

    @ApiOperation(value = "树详情", notes = "树模型数据的TreePath记录")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "数据唯一值id", required = true, dataType = "String", paramType = "query")
    })
    @XController
    @RequestMapping(value = "/treeinfo", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String treeinfo(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        T bm =  TypeConvert.CreateNewInstance(GetClass());
        if (bm instanceof BaseModelTree) {
            BaseModelTree bmt = (BaseModelTree) bm;
            String id = RequestUtil.GetParameter(request, BaseModel.F_id);
            DataTable dt = bmt.GetTreePathInfo(id);
            return dt.ToJson();
        }
        return AjaxResult.False("读取树详情失败").ToJson();
    }

    @ApiOperation(value = "保存", notes = "根据id如果存在则更新不存在则插入")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "model", value = "领域模型的数据信息", required = true, dataType = "T", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/save", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String save(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String id = RequestUtil.GetString(request, BaseModel.F_id);
        T model = BaseModel.GetObjectById(GetClass(), id);
        if (model == null) {
            model =  TypeConvert.CreateNewInstance(GetClass());
        }
        model.SetValuesByRequest(request);
        model.Save();
        AjaxResult ar = AjaxResult.True(model);
        return ar.ToJson();
    }

    @ApiOperation(value = "插入", notes = "直接插入数据")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "model", value = "领域模型的数据信息", required = true, dataType = "T", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/insert", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String insert(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model =  TypeConvert.CreateNewInstance(GetClass());
        model.SetValuesByRequest(request);
        model.Save();
        AjaxResult ar = AjaxResult.True(model);
        return ar.ToJson();
    }

    @ApiOperation(value = "删除和批量删除", notes = "根据id或者id集合删除领域模型数据")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "领域模型id", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "ids", value = "领域模型id集合", dataType = "String[]", paramType = "query"),
            @ApiImplicitParam(name = "deleteAll", value = "是否删除所有数据", dataType = "Boolean", paramType = "query")
    })
    @XController
    @RequestMapping(value = "/delete", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String delete(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String id = RequestUtil.GetParameter(request, BaseModel.F_id);
        if (StrUtil.isNotEmpty(id)) {
            T t = BaseModel.GetObjectById(GetClass(), id);
            if (t != null && !t.IsNew()) {
                t.Delete();
                return AjaxResult.True().ToJson();
            }
            return AjaxResult.False("记录不存在!").ToJson();
        } else {
            String[] ids = RequestUtil.GetStringArray(request, BaseModel.F_ids);
            if (ids != null && ids.length > 0) {
                for (String d : ids) {
                    T t = BaseModel.GetObjectById(GetClass(), d);
                    if (t != null) {
                        t.Delete();
                    }
                }
                return AjaxResult.True().ToJson();
            } else {
                String deleteAll = RequestUtil.GetParameter(request, "deleteAll");
                if (StrUtil.isNotEmpty(deleteAll) && TypeConvert.ToBoolean(deleteAll)) {
                    T model =  TypeConvert.CreateNewInstance(GetClass());
                    BaseQuery bq = model.CreateQueryModel().InitFromRequest(request);
                    BaseModel.Delete(GetClass(), bq);
                    return AjaxResult.True().ToJson();
                }
                return AjaxResult.False("无法删除!").ToJson();
            }
        }
    }
    @ApiOperation(value = "修改排序字段", notes = "修改字段的目标id")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "目标id", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "targetId", value = "目标id", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "isTree", value = "是否树模型", dataType = "Boolean", paramType = "query"),
            @ApiImplicitParam(name = "appended", value = "是否追加", dataType = "Boolean", paramType = "query")
    })
    @XController
    @RequestMapping(value = "/moverows", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String moverows(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T t = TypeConvert.CreateNewInstance(GetClass());
        String orderField = t.GetDefaultOrderField();
        if (StrUtil.isNotEmpty(orderField)) {
            String id = RequestUtil.GetString(request, BaseModel.F_id);
            String targetId = RequestUtil.GetString(request, "targetId");
            T t1 = BaseModel.GetObjectById(GetClass(), id);
            T target = BaseModel.GetObjectById(GetClass(), targetId);
            boolean isTree = RequestUtil.GetBooleanParameter(request, "isTree");
            boolean appended = RequestUtil.GetBooleanParameter(request, "appended");
            if (t1 != null && target != null && !id.equals(targetId)) {
                BaseQuery bq = t1.CreateQueryModel();
                bq.InitFromRequest(request);
                bq.id = null;
                if (isTree) {
                    BaseModelTree bt1 = (BaseModelTree) t1;
                    BaseModelTree btEnd = (BaseModelTree) target;
                    if (btEnd.TreePath.contains((bt1.TreePath))) {
                        return AjaxResult.False("不能修改到自己的子节点中").ToJson();
                    }
                    if (appended) {
                        btEnd.AppendChild(bq, bt1);
                    } else {
                        bt1.Parentid = btEnd.Parentid;
                        bt1.MoveOrderBefore(bq, btEnd);
                        bt1.Save();
                    }
                    return AjaxResult.True().ToJson();
                } else {
                    t1.MoveOrderBefore(bq, target);
                    return AjaxResult.True().ToJson();
                }
            }
            return AjaxResult.False("修改失败").ToJson();
        }
        return AjaxResult.False("列表不能修改顺序").ToJson();
    }

    @ApiOperation(value = "保存一组记录的键值", notes = "根据id更新特定的字段的值")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "values", value = "领域模型的数据字段和值", required = true, dataType = "String", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/savevalues", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String savevalues(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String values = RequestUtil.GetString(request, "values");
        List<Map<String, Object>> listmap = TypeConvert.FromListMapJson(values);
        List<Map<String, Object>> listforeign = new ArrayList<>();
        Map<String, T> ms = new HashMap<>();
        String err = "";
        for (Map m : listmap) {
            String id = TypeConvert.ToString(m.get(BaseModel.F_id));
            T t = null;
            if (ms.containsKey(id)) {
                t = ms.get(id);
            } else {
                t = BaseModel.GetObjectById(GetClass(), id);
                if (t == null) {
                    t = TypeConvert.CreateNewInstance(GetClass());
                }
                ms.put(id, t);
            }
            String foreignKey = TypeConvert.ToString(m.get(BaseModel.F_foreignKey));
            String originField = TypeConvert.ToString(m.get(BaseModel.F_originField));
            String columnField = TypeConvert.ToString(m.get(BaseModel.F_columnField));
            if (StrUtil.isEmpty(foreignKey)) {
                err += t.ValidateAndSetValue(columnField, m.get(columnField), true);
            } else {
                if(StrUtil.isEmpty(originField)){
                    originField = columnField;
                }
                String err2 = t.ValidateAndSetForeignKey(foreignKey, originField, m.get(columnField));
                if (StrUtil.isEmpty(err2)) {
                    m.put(foreignKey, t.GetValue(foreignKey));
                    listforeign.add(m);
                }
                err += err2;

            }
        }
        for (String k : ms.keySet()) {
            err += ms.get(k).SaveValidate();
        }
        if (StrUtil.isNotEmpty(err)) {
            return AjaxResult.False(err).ToJson();
        }
        for (String k : ms.keySet()) {
            ms.get(k).Save();
        }
        return AjaxResult.True(listforeign).ToJson();
    }

    @ApiOperation(value = "上传文件", notes = "保存上传文件")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "request", value = "上传文件", required = true, dataType = "HttpServletRequest", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/upload", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String upload(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        List<String> files = HttpUtil.uploadRequest(request);
        return AjaxResult.True(files).ToJson();
    }
    @ApiOperation(value = "预览显示", notes = "下载对应文件")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "path", value = "文件路径", required = true, dataType = "String", paramType = "path")
    })
    @XController(isLogin = XController.LoginState.No)
    @RequestMapping(value = "/preview/{path:.+}")
    @ResponseBody
    public String preview(@PathVariable("path") String path, HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String filePath = GlobalValues.GetUploadFilePath(path);
        if (FileUtil.isExist(filePath)) {
            String name = new File(filePath).getName().toLowerCase();
            if (name.endsWith(".doc") || name.endsWith(".docx") || name.endsWith(".xls") || name.endsWith(".xlsx") || name.endsWith(".ppt") || name.endsWith(".pptx")) {
                String pdfPath = filePath + ".pdf";
                if (!new File(pdfPath).exists()) {
                    if (WordUtil.word2pdf(filePath, pdfPath)) {
                        filePath = pdfPath;
                    }
                } else {
                    filePath = pdfPath;
                }
            }
            String contentType = Files.probeContentType(Paths.get(filePath));
            if (StrUtil.isEmpty(contentType)) {
                HttpUtil.ExportResponse(response, filePath, new File(filePath).getName(), false);
                return null;
            } else {
                File file = new File(filePath);
                response.setContentLength((int) file.length());
                String rangeString = request.getHeader("Range");//如果是video标签发起的请求就不会为null
                if (StrUtil.isNotEmpty(rangeString)) {
                    try {
                        long range = Long.valueOf(rangeString.substring(rangeString.indexOf("=") + 1, rangeString.indexOf("-")));//获取视频播放偏移位置
                        response.setHeader("Content-Range", String.valueOf(range + (file.length() - 1)));//拖动进度条时的断点
                        response.setHeader("Accept-Ranges", "bytes");
                        response.setHeader("Cache-Control", "max-age=31536000, must-revalidate");
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                response.setHeader("Content-Disposition", "inline; filename=" + new String(new File(filePath).getName().getBytes("UTF-8"), "ISO_8859_1"));
                HttpUtil.exportFile(response, filePath, contentType);
            }
        } else {
            return AjaxResult.False("文件不存在").ToJson();
        }
        return null;
    }
    @ApiOperation(value = "下载文件", notes = "下载对应文件")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "filename", value = "文件名称", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "name", value = "显示名称", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "isImage", value = "是否为图片", dataType = "Boolean", paramType = "query")
    })
    @XController(isLogin = XController.LoginState.No)
    @RequestMapping(value = "/download", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String download(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String filename = RequestUtil.GetParameter(request, "filename");
        String name = RequestUtil.GetParameter(request, "name");
        Boolean isImage = RequestUtil.GetBooleanParameter(request, "isImage");
        if (StrUtil.isEmpty(filename) || "undefined".equals(filename)) {
            return null;
        }
        filename = GlobalValues.GetUploadFilePath(filename);
        if (FileUtil.isExist(filename)) {
            if (StrUtil.isEmpty(name)) {
                name = new File(filename).getName();
            }
            HttpUtil.ExportResponse(response, filename, name, isImage);
        } else {
            return AjaxResult.False("文件不存在").ToJson();
        }
        return null;
    }
    @ApiOperation(value = "导出数据", notes = "根据过滤条件导出领域模型数据Excel")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "filter", value = "过滤条件", required = true, dataType = "QueryFilter", paramType = "body"),
            @ApiImplicitParam(name = "template", value = "是否导出模板", dataType = "Boolean", paramType = "query"),
            @ApiImplicitParam(name = "columns", value = "导出列", dataType = "String[]", paramType = "query")
    })
    @XController
    @RequestMapping(value = "/export_excel", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String export_excel(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        T bm =  TypeConvert.CreateNewInstance(GetClass());
        boolean isTemplate = TypeConvert.ToBoolean(RequestUtil.GetParameter(request, "template"));
        String[] cols = RequestUtil.GetStringArray(request, "columns");
        String filename = PinyinUtil.GetHanzi(bm.GetTableName(bm.getClass()));
        BaseQuery bq = bm.CreateQueryModel();
        bq.InitFromRequest(request);
        bq.PageSize = -1L;
        bq.PageIndex = -1L;
        if (isTemplate) {
            bq.id = "-1";
        }
        DataTable dt = bm.GetList(bq);
        String name = filename + "导出数据";
        ArrayList<String> listcol = null;
        if (cols != null && cols.length > 0) {
            listcol = new ArrayList<>();
            for (String c : cols) {
                if (!c.contains("id")) {
                    listcol.add(c);
                }
            }
        }
        if (isTemplate) {
            dt.DataSchema.remove(BaseModel.F_id);
        }
        ExcelWriteUtil.exportXls(request, response, name, name, dt, listcol);
        return null;
    }

    @ApiOperation(value = "导入数据", notes = "根据领域模型数据导入Excel")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "预览模式", value = "是否预览模式", dataType = "Boolean", paramType = "query"),
            @ApiImplicitParam(name = "上传文件列表", value = "上传文件列表", dataType = "String[]", paramType = "query"),
            @ApiImplicitParam(name = "标题行", value = "标题行", dataType = "Integer", paramType = "query"),
            @ApiImplicitParam(name = "页数", value = "页数", dataType = "Integer", paramType = "query"),
            @ApiImplicitParam(name = "唯一列", value = "唯一列", dataType = "String", paramType = "query")
    })
    @XController
    @RequestMapping(value = "/import_excel", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String import_excel(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        T bm = TypeConvert.CreateNewInstance(GetClass());
        boolean 预览模式 = TypeConvert.ToBoolean(RequestUtil.GetParameter(request, "预览模式"));
        String[] 上传文件列表 = TypeConvert.ToTypeValue(String[].class, RequestUtil.GetParameter(request, "上传文件列表"));
        int 标题行 = TypeConvert.ToTypeValue(Integer.class, RequestUtil.GetParameter(request, "标题行"));
        int 页数 = TypeConvert.ToTypeValue(Integer.class, RequestUtil.GetParameter(request, "页数"));
        String 唯一列 = TypeConvert.ToTypeValue(String.class, RequestUtil.GetParameter(request, "唯一列"));

        if (标题行 < 1) {
            return AjaxResult.False("请输入正确的标题行").ToJson();
        }
        if (页数 < 1) {
            return AjaxResult.False("请输入正确的页数").ToJson();
        }
        if (上传文件列表 != null && 上传文件列表.length > 0) {
            String file = GlobalValues.GetUploadFilePath(上传文件列表[0]);
            DataTable dt = ExcelReadUtil.readExcel(file, 页数 - 1, 标题行 - 1);

            if (dt.Data.size() > 0) {
                if (StrUtil.isNotEmpty(唯一列)) {
                    if (!dt.Data.get(0).containsKey(唯一列)) {
                        String err = "文件中不存在唯一列(" + 唯一列 + ")";
                        return AjaxResult.False(err).ToJson();
                    }
                } else {
                    String err = "请输入唯一列";
                    return AjaxResult.False(err).ToJson();
                }
            } else {
                String err = "文件中数据为空";
                return AjaxResult.False(err).ToJson();
            }
            if (预览模式) {
                BaseQuery queryModel = bm.CreateQueryModel().InitFromRequest(request);
                dt = queryModel.FilterTable(dt);
                if (dt.Data.size() > 0) {
                    boolean existsId = false;
                    for (int i = 0; i < dt.DataColumns.size(); i++) {
                        String field = TypeConvert.ToString(dt.DataColumns.get(i).get("field"));
                        if ("id".equals(field)) {
                            existsId = true;
                            break;
                        }
                    }
                    if (!existsId) {
                        for (Map m : dt.Data) {
                            if (!m.containsKey("id")) {
                                m.put("id", BaseModel.GetUniqueId());
                            }
                        }
                    }
                }
                return dt.ToPageJson(queryModel);
            } else {
                List<String> listu = new ArrayList<>();
                String repeat = "";
                for (Map m : dt.Data) {
                    String u = TypeConvert.ToString(m.get(唯一列));
                    if (!listu.contains(u)) {
                        listu.add(u);
                    } else {
                        repeat += u + ", ";
                    }
                }
                String err = "";
                if (StrUtil.isNotEmpty(repeat)) {
                    err += "在唯一列中有重复项" + repeat + "";
                }
                err += bm.ImportData(dt, 唯一列, true);
                if (StrUtil.isEmpty(err)) {
                    bm.ImportData(dt, 唯一列, false);
                    return AjaxResult.True().ToJson();
                } else {
                    return AjaxResult.False(err).ToJson();
                }
            }
        } else {
            if (预览模式) {
                return new DataTable().ToJson();
            }
        }
        return AjaxResult.False("导入文件不存在").ToJson();
    }

    @ApiOperation(value = "开启工作流", notes = "成功或失败")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "数据的唯一值id", required = true, dataType = "String", paramType = "query")
    })
    @XController
    @RequestMapping(value = "/start_work_flow", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String start_work_flow(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        String id = RequestUtil.GetString(request, BaseModel.F_id);
        T t = BaseModel.GetObjectById(GetClass(), id);
        if (t == null) {
            return AjaxResult.False("数据不存在").ToJson();
        }
        t.StartWorkFlow();
        return AjaxResult.True().ToJson();
    }


}
