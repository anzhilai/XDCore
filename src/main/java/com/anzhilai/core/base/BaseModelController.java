package com.anzhilai.core.base;

import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.database.AjaxResult;
import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.toolkit.*;
import com.anzhilai.core.toolkit.*;
import com.anzhilai.core.toolkit.report.WordUtil;
import org.apache.log4j.Logger;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

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
        return (Class<T>) types[i];
    }

    public Class<T> GetClass() {
        return GetGenericClass(this.getClass(), 0);
    }

    @XController(name = "查询名称", input = "", output = "当前模型的名称")
    @RequestMapping(value = "/getname", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String getname(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String name = BaseModel.GetTableName(GetClass());
        name = PinyinUtil.GetHanzi(name);
        return AjaxResult.True(name).ToJson();
    }

    @XController(name = "统计值", input = "统计数据的过滤条件", output = "对单列的统计结果")
    @RequestMapping(value = "/statvalue", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statvalue(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = GetClass().newInstance();
        Object s = model.GetStat(model.CreateQueryModel().InitFromRequest(request));
        if (StrUtil.isEmpty(s)) {
            s = "0";
        }
        return AjaxResult.True(s).ToJson();
    }

    @XController(name = "统计列表", input = "统计数据的过滤条件", output = "对特定列进行GroupBy，统计结果列表")
    @RequestMapping(value = "/statlist", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statlist(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = GetClass().newInstance();
        BaseStatistic statistic = model.CreateStatisticModel();
        if (statistic != null) {
            DataTable dt = statistic.run(model.CreateQueryModel().InitFromRequest(request));
            return dt.ToJson();
        }
        DataTable dt = model.GetStatGroup(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }

    @XController(name = "查询列表", input = "查询过滤条件", output = "查询结果DataTable")
    @RequestMapping(value = "/querylist", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String querylist(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = GetClass().newInstance();
        DataTable dt = model.GetList(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }

    @XController(name = "查询单值", input = "查询过滤条件", output = "查询结果中排序第一的记录值")
    @RequestMapping(value = "/queryvalue", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String queryvalue(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = GetClass().newInstance();
        BaseQuery bq = model.CreateQueryModel().InitFromRequest(request);
        DataTable dt = model.GetList(bq);
        if (dt.Data.size() > 0) {
            Map m = dt.Data.get(0);
            if (StrUtil.isNotEmpty(bq.QueryField)) {
                return AjaxResult.True(m.get(bq.QueryField)).ToJson();
            }
            return AjaxResult.True(m).ToJson();
        }
        return AjaxResult.False("数据为空").ToJson();
    }

    @XController(name = "查询详细信息", input = "数据的唯一值id", output = "以Map形式返回整条记录")
    @RequestMapping(value = "/queryinfo", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String queryinfo(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        String id = RequestUtil.GetString(request, BaseModel.F_id);
        T t = BaseModel.GetObjectById(GetClass(), id);
        if (t != null) {
            return AjaxResult.True(t.ToMap()).ToJson();
        } else {
            t = GetClass().getDeclaredConstructor().newInstance();
            t.SetValuesByRequest(request);
            return AjaxResult.True(t.ToMap()).ToJson();
        }
    }


    @XController(name = "查询所有列", input = "无", output = "根据领域模型返回所有数据字段")
    @RequestMapping(value = "/querycolumns", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String querycolumns(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        Map<String, Field> columnTypeMap = SqlCache.GetColumnFieldMap(GetClass());
        DataTable dt = new DataTable();
        List<Map> DataColumns = new ArrayList<>();
        Collection<String> lm = columnTypeMap.keySet();
        for (String columnName : lm) {
            if (columnName.equals(BaseModel.F_CreateTime) || columnName.equals(BaseModel.F_UpdateTime) ||
                    columnName.equals(BaseModel.F_CreateUser) || columnName.equals(BaseModel.F_UpdateUser)) {
                continue;
            }
            Field field = columnTypeMap.get(columnName);
            Map m = DataTable.CreateColumnMap(columnName, field.getType(), true);
            XColumn xc = field.getAnnotation(XColumn.class);
            if (xc != null) {
                if (StrUtil.isNotEmpty(xc.foreignTable())) {
                    m.put("foreignTable", xc.foreignTable());
                }
            }
            DataColumns.add(m);
        }
        return AjaxResult.True(DataColumns).ToJson();
    }

    @XController(name = "树详情", input = "数据唯一值id", output = "树模型数据的TreePath记录")
    @RequestMapping(value = "/treeinfo", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String treeinfo(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        T bm = GetClass().newInstance();
        if (bm instanceof BaseModelTree) {
            BaseModelTree bmt = (BaseModelTree) bm;
            String id = RequestUtil.GetParameter(request, BaseModel.F_id);
            DataTable dt = bmt.GetTreePathInfo(id);
            return dt.ToJson();
        }
        return AjaxResult.Error("读取树详情失败").ToJson();
    }

    @XController(name = "保存", input = "领域模型的数据信息", output = "根据id如果存在则更新不存在则插入")
    @RequestMapping(value = "/save", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String save(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String id = RequestUtil.GetString(request, BaseModel.F_id);
        T model = BaseModel.GetObjectById(GetClass(), id);
        if (model == null) {
            model = GetClass().newInstance();
        }
        model.SetValuesByRequest(request);
        model.Save();
        AjaxResult ar = AjaxResult.True(model);
        return ar.ToJson();
    }

    @XController(name = "插入", input = "领域模型的数据信息", output = "直接插入数据")
    @RequestMapping(value = "/insert", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String insert(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = GetClass().newInstance();
        model.SetValuesByRequest(request);
        model.Save();
        AjaxResult ar = AjaxResult.True(model);
        return ar.ToJson();
    }


    @XController(name = "删除和批量删除", input = "领域模型id或者id集合", output = "根据id或者id集合删除领域模型数据")
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
            return AjaxResult.Error("记录不存在!").ToJson();
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
                    T model = GetClass().newInstance();
                    BaseQuery bq = model.CreateQueryModel().InitFromRequest(request);
                    BaseModel.Delete(GetClass(), bq);
                    return AjaxResult.True().ToJson();
                }
                return AjaxResult.Error("无法删除!").ToJson();
            }
        }
    }

    @XController(name = "修改排序字段", input = "修改字段的目标id", output = "修改结果")
    @RequestMapping(value = "/moverows", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String moverows(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T t = GetClass().newInstance();
        String orderField = t.GetOrderField();
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


    @XController(name = "保存一组单值", input = "领域模型的数据字段和值", output = "根据id更新特定的字段的值")
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
                    t = GetClass().newInstance();
                }
                ms.put(id, t);
            }
            String foreignKey = TypeConvert.ToString(m.get(BaseModel.F_foreignKey));
            String foreignField = TypeConvert.ToString(m.get(BaseModel.F_foreignField));
            Object foreignValue = m.get(BaseModel.F_foreignValue);
            String columnField = TypeConvert.ToString(m.get(BaseModel.F_columnField));
            if (StrUtil.isEmpty(foreignKey)) {
                err += t.ValidateAndSetValue(columnField, m.get(columnField), true);
            } else {
                if (foreignValue != null) {
                    err += t.ValidateAndSetValue(foreignKey, foreignValue, true);
                } else {
                    if (StrUtil.isEmpty(foreignField)) {
                        foreignField = columnField;
                    }
                    String err2 = t.ValidateAndSetForeignKeyValue(foreignKey, m.get(columnField), foreignField);
                    if (StrUtil.isEmpty(err2)) {
                        m.put(foreignKey, t.GetValue(foreignKey));
                        listforeign.add(m);
                    }
                    err += err2;
                }
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


    @XController(name = "上传文件", transactional = false, input = "上传文件", output = "保存上传文件")
    @RequestMapping(value = "/upload", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String upload(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        List<String> files = HttpUtil.uploadRequest(request);
        return AjaxResult.True(files).ToJson();
    }

    @XController(name = "预览显示", isLogin = XController.LoginState.No, transactional = false, input = "文件名称和类型", output = "下载对应文件")
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
            return AjaxResult.Error("文件不存在").ToJson();
        }
        return null;
    }

    @XController(name = "下载文件", isLogin = XController.LoginState.No, transactional = false, input = "文件名称和类型", output = "下载对应文件")
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
            return AjaxResult.Error("文件不存在").ToJson();
        }
        return null;
    }

    @XController(name = "导出数据", input = "过滤条件", output = "根据过滤条件导出领域模型数据Excel")
    @RequestMapping(value = "/export_excel", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String export_excel(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        T bm = GetClass().newInstance();
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


    @XController(name = "导入数据", input = "上传Excel文件", output = "根据领域模型数据导入Excel")
    @RequestMapping(value = "/import_excel", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String import_excel(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        T bm = GetClass().newInstance();
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

    @XController(name = "开启工作流", input = "数据的唯一值id", output = "成功或失败")
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
