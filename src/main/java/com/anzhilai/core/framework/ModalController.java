package com.anzhilai.core.framework;

import com.anzhilai.core.base.*;
import com.anzhilai.core.toolkit.*;
import com.anzhilai.core.base.*;
import com.anzhilai.core.database.AjaxResult;
import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.toolkit.*;
import com.anzhilai.core.toolkit.encrypt.RSAUtil;
import com.anzhilai.core.toolkit.image.VerifyCodeUtils;
import com.anzhilai.core.toolkit.image.VerifyImageUtil;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.*;

@Controller
@XController(name = "ModalController")
@Transactional(rollbackFor = {Exception.class})
@RequestMapping("/")
public class ModalController extends BaseController {

    @XController(name = "平台数据同步")
    @RequestMapping(value = "/xdevelop", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String xdevelop(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        String name = RequestUtil.GetString(request, "name");//项目名称
        String MenuData = RequestUtil.GetString(request, "MenuData");//
        if (StrUtil.isEmpty(MenuData)) {
            return AjaxResult.False("MenuData不能为空").ToJson();
        }
        if (StrUtil.isEmpty(name)) {
            return AjaxResult.False("name不能为空").ToJson();
        }
        File file功能菜单 = new File(GlobalValues.GetUploadFilePath(MenuData));
        if (!file功能菜单.exists()) {
            return AjaxResult.False("MenuData文件不存在").ToJson();
        }
        String[] packageNames = RequestUtil.GetStringArray(request, "packageName");//
        List<Object> 领域模型s = new ArrayList<>();
        List<String> listName = new ArrayList<>();
        listName.add(BaseController.class.getSimpleName());//
        this.Add数据模型(领域模型s, listName, BaseModel.class, BaseModel.class.getSimpleName());
        this.Add数据模型(领域模型s, listName, BaseModelTree.class, BaseModelTree.class.getSimpleName());
        this.Add服务模型(领域模型s, listName, BaseModelController.class, "");
        for (String classname : SqlCache.hashMapClasses.keySet()) {
            Class<?> clazz = SqlCache.hashMapClasses.get(classname);
            if (packageNames != null && packageNames.length > 0) {
                boolean isContains = false;
                for (String packageName : packageNames) {
                    if (clazz.getName().contains(packageName)) {
                        isContains = true;
                        break;
                    }
                }
                if (!isContains) {
                    continue;
                }
            }
            this.Add数据模型(领域模型s, listName, clazz, classname);
            Class<?> clazzCtl = SqlCache.hashMapController.get(classname);
            if (clazzCtl != null) {
                this.Add服务模型(领域模型s, listName, clazzCtl, classname);
            }
        }
        String dir = GlobalValues.GetTempPath();
        File file领域模型 = new File(dir + File.separator + BaseModel.GetUniqueId() + ".dat");
        FileUtil.WriteStringToFile(file领域模型.getPath(), TypeConvert.ToJson(领域模型s));
        File file详情 = new File(dir + File.separator + BaseModel.GetUniqueId() + ".dat");
        Map<String, Object> info = new HashMap<>();
        info.put("项目名称", name);
        FileUtil.WriteStringToFile(file详情.getPath(), TypeConvert.ToJson(info));
        try {
            response.setContentType("application/x-msdownload");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            response.setHeader("Content-Disposition",
                    "attachment; filename=" + new String((name + ".zip").getBytes("UTF-8"), "ISO_8859_1"));
            ZipUtil zipHelper = new ZipUtil(response.getOutputStream());
            zipHelper.addEntry("xdevelop/", "domainModel.dat", file领域模型);
            zipHelper.addEntry("xdevelop/", "menuData.dat", file功能菜单);
            zipHelper.addEntry("xdevelop/", "info.dat", file详情);
            zipHelper.closeZos();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            file功能菜单.delete();
            file领域模型.delete();
            file详情.delete();
        }
        return null;
    }

    public void Add服务模型(List<Object> 领域模型s, List<String> listName, Class<?> clazzCtl, String 关联模型) throws Exception {
        if (clazzCtl.getSuperclass() != Object.class) {
            this.Add服务模型(领域模型s, listName, clazzCtl.getSuperclass(), "");
        }
        String 模型名称 = clazzCtl.getSimpleName();
        if (listName.contains(模型名称)) {
            return;
        }
        Map 领域服务模型 = new HashMap();
        领域模型s.add(领域服务模型);
        listName.add(模型名称);
        领域服务模型.put("模型名称", 模型名称);
        领域服务模型.put("模型类型", "服务模型");
        领域服务模型.put("命名空间", clazzCtl.getPackage().getName());
        if (StrUtil.isNotEmpty(关联模型)) {
            领域服务模型.put("关联模型列表", new String[]{关联模型});
        }
        String 继承模型名称 = clazzCtl.getSuperclass() != Object.class ? clazzCtl.getSuperclass().getSimpleName() : "";
        if (BaseController.class.getSimpleName().equals(继承模型名称)) {
            继承模型名称 = "";
        }
        领域服务模型.put("继承模型名称", 继承模型名称);
        List<Object> 服务接口列表 = new ArrayList<>();
        领域服务模型.put("服务接口列表", 服务接口列表);
        RequestMapping crm = clazzCtl.getAnnotation(RequestMapping.class);
        String url0 = crm != null && crm.value().length > 0 ? crm.value()[0] : "";
        领域服务模型.put("模型标识", url0.replaceFirst("/", ""));
        XController xcc = clazzCtl.getAnnotation(XController.class);
        if (xcc != null) {
            领域服务模型.put("模型描述", xcc.description());
        }
        Method[] methods = clazzCtl.getMethods();   //clazzCtl.getDeclaredMethods();
        for (Method method : methods) {
            xcc = method.getAnnotation(XController.class);
            if (xcc != null) {
                RequestMapping rm = method.getAnnotation(RequestMapping.class);
                String url1 = TypeConvert.ToString(rm.value().length > 0 ? rm.value()[0] : "");
                Map 服务接口 = new HashMap();
                服务接口.put("接口名称", xcc.name());
                服务接口.put("接口描述", xcc.description());
                服务接口.put("输入描述", xcc.input());
                服务接口.put("输出描述", xcc.output());
                服务接口.put("接口类型", rm.method().length > 0 ? rm.method()[0].name() : "");
                服务接口.put("接口Url", url1);
                if (method.getDeclaringClass().equals(clazzCtl)
                        && !ScanUtil.IsMethodOverridden(method, clazzCtl.getSuperclass())) {
                    服务接口.put("是否继承", "否");
                } else {
                    服务接口.put("是否继承", "是");
                    continue;//继承不输出
                }
                服务接口列表.add(服务接口);
            }
        }
    }

    public void Add数据模型(List<Object> 领域模型s, List<String> listName, Class<?> clazz, String 模型名称) throws Exception {
        if (clazz.getSuperclass() != Object.class) {
            this.Add数据模型(领域模型s, listName, clazz.getSuperclass(), clazz.getSuperclass().getSimpleName());
        }
        if (listName.contains(模型名称)) {
            return;
        }
        Map 领域数据模型 = new HashMap();
        领域模型s.add(领域数据模型);
        listName.add(模型名称);
        领域数据模型.put("模型名称", 模型名称);
        领域数据模型.put("模型类型", "数据模型");
        领域数据模型.put("模型标识", 模型名称);
        领域数据模型.put("命名空间", clazz.getPackage().getName());
        领域数据模型.put("继承模型名称", clazz.getSuperclass() != Object.class ? clazz.getSuperclass().getSimpleName() : "");
        XTable xt = clazz.getAnnotation(XTable.class);
        if (xt != null) {
            领域数据模型.put("模型描述", xt.description());
        }
        List<Object> 数据字段列表 = new ArrayList<>();
        领域数据模型.put("数据字段列表", 数据字段列表);
        ArrayList<Field> classfields = new ArrayList<>();
        classfields.addAll(Arrays.asList(clazz.getFields()));
        for (Field field : classfields) {
            String columnName = field.getName();
            XColumn xc = field.getAnnotation(XColumn.class);
            if (xc != null) {
                Map 数据字段 = new HashMap();
                数据字段.put("字段名称", columnName);
                String 字段类型 = "文本";
                if (field.getType() == String.class) {
                    if (xc.text()) {
                        字段类型 = "长文本";
                    } else {
                        字段类型 = "文本";
                    }
                } else if (field.getType() == Integer.class || field.getType() == int.class) {
                    字段类型 = "整数";
                } else if (field.getType() == Double.class || field.getType() == double.class) {
                    字段类型 = "浮点数";
                } else if (field.getType() == Float.class || field.getType() == float.class) {
                    字段类型 = "浮点数";
                } else if (field.getType() == Date.class) {
                    字段类型 = "日期";
                }
                数据字段.put("字段类型", 字段类型);//SqlTable.getDbType(field.getType(), xc)
                数据字段.put("是否主键", "id".equals(columnName) ? "是" : "否");
                数据字段.put("是否可空", xc.nullable() ? "是" : "否");
                数据字段.put("是否唯一", xc.unique() ? "是" : "否");
                数据字段.put("长度", xc.length());
                数据字段.put("精度", xc.precision());
                数据字段.put("scale", xc.scale());
                数据字段.put("blob", xc.text());
                数据字段.put("字段描述", xc.description());
                if (field.getDeclaringClass().equals(clazz)) {
                    数据字段.put("是否继承", "否");
                } else {
                    数据字段.put("是否继承", "是");
                    continue;//继承不输出
                }
                数据字段列表.add(数据字段);
            }
        }
    }

    @XController(name = "上传文件", isLogin = XController.LoginState.Yes, transactional = false)
    @RequestMapping(value = "/upload", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String upload(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        List<String> files = HttpUtil.uploadRequest(request);
        return AjaxResult.True(files).ToJson();
    }

    @XController(name = "下载文件", isLogin = XController.LoginState.No, transactional = false)
    @RequestMapping(value = "/download_file", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String download_file(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        String filename = RequestUtil.GetParameter(request, "filename");
        String name = RequestUtil.GetParameter(request, "name");
        if (StrUtil.isEmpty(filename) || "undefined".equals(filename)) {
            return null;
        }
        File file = new File(GlobalValues.GetUploadFilePath(filename));
        if (StrUtil.isEmpty(name)) {
            name = file.getName();
        }
        if (file.exists()) {
            response.setHeader("Content-Disposition",
                    "attachment; filename=" + new String((name).getBytes("UTF-8"), "ISO_8859_1"));
            HttpUtil.exportFile(response, file.getPath(), "application/x-msdownload");
            return null;
        } else {
            return AjaxResult.Error("文件不存在").ToJson();
        }
    }

    //验证码加解密
    public static final String PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZVRhYExG0Zz14LMT61hKpw22Z1lLfC1l2BYdEZUyBREqCqS/2dQnnVIeR4eypwcmcoky6WVeaVh5oPbdU+KC5IqexkYuoyETLoIB07IFl+SJG1r9G9RrV6DTVNttvWt0oxW9jnaIv6spWp3dY5hIUSkUjqOaG9RqLkGvnGKdXLQIDAQAB";
    private static final String PRIVATE_KEY = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJlVGFgTEbRnPXgsxPrWEqnDbZnWUt8LWXYFh0RlTIFESoKpL/Z1CedUh5Hh7KnByZyiTLpZV5pWHmg9t1T4oLkip7GRi6jIRMuggHTsgWX5IkbWv0b1GtXoNNU2229a3SjFb2Odoi/qyland1jmEhRKRSOo5ob1GouQa+cYp1ctAgMBAAECgYEAjdLhw4VP2PetKZzvTbv4Y0G5/JL68AeFZd7TMPYpf191M8nd7S5wTKIpC0xXJOVz4AdWxP6iQsTpNy3uhw+5SFWvZ9/yZiPTZ/zckyGA4QKmdXO6dNVfGQUJfU/C2Pa3fgGlqhI1tajXIdOGcyFBHZAprh99MGJPhcN7bVDVw8ECQQDRSe9Aa/DJxW0ppumlqcEkDfApm7aYjh2zEu5P+efOXNJck/NaRN2xa3NwOQQM1wg6UhX8isyGJu7Jj7T6qdk5AkEAu43/eJnV4n/2BjCvV53iuqUIRtIFRsRR9KR7GJQbeKradG4X7GboiGQnvyCBMW0fOub5VF4GtLf/c3s4UvgxlQJAVsJvjCUzDHHrbvjioupcRrYAeT8z0soXRcTzRfQzRDj2e6pZl3I09Pe2Qy9fnnMF1idxNd/UKUi6dJQ+UitXAQJAVxonHvcyobITq+RISkSE23FxWpKG6Mqb1SXeFRgTegK+2XuXmK5iJ5V78ANEfJPVASHrgQb5zkv1UshS7BVf0QJBAKVtIrHTEOOw2Bhq+eCRr8oiXtJXm4fhm7yZV0rU8fYlbGyzYtiw5NOXo/hCRrUXAL+WvrljslFiYnCtSG6nkyk=";

    @XController(name = "获取验证码", isLogin = XController.LoginState.No, transactional = false)
    @RequestMapping(value = "/verify_code", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String verify_code(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        String type = RequestUtil.GetString(request, "type");
        Map<String, Object> params = null;
        if ("slide".equals(type)) {
            String key = RequestUtil.GetString(request, "key");
            boolean validate = false;
            if (StrUtil.isNotEmpty(key)) {
                validate = ValidateSlideCode(key);
                params = new HashMap<>();
                params.put("validate", validate);
            }
            if (!validate) {
                File root = new File(GlobalValues.GetTemplateFilePath("imgs"));
                if (root.exists()) {
                    ArrayList<File> imgs = new ArrayList<>();
                    for (File f : root.listFiles()) {
                        if (f.isFile()) {
                            imgs.add(f);
                        }
                    }
                    if (imgs.size() > 0) {
                        File img = imgs.get(new Random().nextInt(imgs.size()));
                        VerifyImageUtil.VerifyImage verifyImage = VerifyImageUtil.getVerifyImage(img.getPath());
                        String verifyCode = DateUtil.GetDateTimeString(new Date()) + "_" + verifyImage.XPosition;
                        params = new HashMap<>();
                        params.put("validate", validate);
                        params.put("key", RSAUtil.encrypt(verifyCode, PUBLIC_KEY)); //公钥加密
                        params.put("top", verifyImage.YPosition);
                        params.put("bgImg", verifyImage.srcImage);
                        params.put("cutImg", verifyImage.cutImage);
                    }
                }
            }
            if (params == null) {
                return AjaxResult.False("模板图片不存在").ToJson();
            }
        } else {
            int length = RequestUtil.GetIntParameter(request, "length");
            int w = RequestUtil.GetIntParameter(request, "w");
            int h = RequestUtil.GetIntParameter(request, "h");
            if (length <= 0) {
                length = 4;
            }
            if (w <= 0) {
                w = 200;
            }
            if (h <= 0) {
                h = 80;
            }
            String verifyCode = DateUtil.GetDateTimeString(new Date()) + "_" + VerifyCodeUtils.generateVerifyCode(length);
            ByteArrayOutputStream out = new ByteArrayOutputStream();//输出图片
            VerifyCodeUtils.outputImage(w, h, out, verifyCode);
            params = new HashMap<>();
            params.put("key", RSAUtil.encrypt(verifyCode, PUBLIC_KEY)); //公钥加密
            params.put("img", java.util.Base64.getEncoder().encodeToString(out.toByteArray()));
        }
        return AjaxResult.True(params).ToJson();
    }

    /**
     * 验证滑动验证码图片
     */
    public static boolean ValidateSlideCode(String valueKey) throws Exception {
        int index = valueKey.indexOf("_");
        if (index == -1) {
            return false;
        }
        String realValue = valueKey.substring(0, index);
        String value = DecryptVerifyCode(valueKey.substring(index + 1));
        double ok = TypeConvert.ToDouble(value);
        double value1 = TypeConvert.ToDouble(realValue);
        return Math.abs(ok - value1) <= 10;
    }

    /**
     * 解密数字验证码
     */
    public static String DecryptVerifyCode(String key) throws Exception {
        String[] strs = RSAUtil.decrypt(key, PRIVATE_KEY).split("_");//私钥解密;
        Date date = TypeConvert.ToDate(strs[0]);
        if (Math.abs(new Date().getTime() - date.getTime()) > 1000 * 60 * 10) {//10分钟有效
            throw new XException("验证码时间已过期");
        }
        return strs[1];
    }

    @XController(name = "获取测试数据", isLogin = XController.LoginState.No)
    @RequestMapping(value = "/get_test_data", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String get_test_data(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {
        return AjaxResult.True().ToJson();
    }

    @XController(name = "保存测试数据", isLogin = XController.LoginState.No)
    @RequestMapping(value = "/save_test_data", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String save_test_data(HttpServletRequest request, HttpServletResponse response, HttpSession session, Model model) throws Exception {

        return AjaxResult.True().ToJson();
    }

    @XController(name = "查询基本列表", input = "查询过滤条件", output = "查询结果DataTable")
    @RequestMapping(value = "/queryplainlist", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String queryplainlist(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String className = RequestUtil.GetString(request, "className");
        if (SqlCache.hashMapClasses.containsKey(className)) {
            BaseModel model = SqlCache.hashMapClasses.get(className).newInstance();
            DataTable dt = model.GetPlainList(model.CreateQueryModel().InitFromRequest(request));
            return dt.ToJson();
        } else {
            return AjaxResult.False("模型不存在").ToJson();
        }
    }

    @XController(name = "保存基本数据", input = "领域模型的数据信息", output = "根据id如果存在则更新不存在则插入")
    @RequestMapping(value = "/innersave", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String innersave(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        String className = RequestUtil.GetString(request, "className");
        if (SqlCache.hashMapClasses.containsKey(className)) {
            Class<BaseModel> _class = SqlCache.hashMapClasses.get(className);
            String id = RequestUtil.GetString(request, BaseModel.F_id);
            BaseModel model = BaseModel.GetObjectById(_class, id);
            if (model == null) {
                model = _class.newInstance();
            }
            model.SetValuesByRequest(request);
            model.InnerSave();
            AjaxResult ar = AjaxResult.True(model);
            return ar.ToJson();
        } else {
            return AjaxResult.False("模型不存在").ToJson();
        }
    }

    @XController(name = "上传数据", input = "文件和路径", output = "成功或失败", transactional = false)
    @RequestMapping(value = "/innerupload", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String innerupload(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        if (request instanceof StandardMultipartHttpServletRequest) {
            StandardMultipartHttpServletRequest fileRequest = (StandardMultipartHttpServletRequest) request;
            String path = fileRequest.getParameter("path");
            MultipartFile mf = fileRequest.getFile("file");
            if (StrUtil.isNotEmpty(path) && mf != null) {
                File f = new File(GlobalValues.GetUploadFilePath(path));
                File fo = new File(f.getParent());
                fo.mkdirs();
                mf.transferTo(f);
                return AjaxResult.True().ToJson();
            }
        }
        return AjaxResult.False("上传失败").ToJson();
    }
}
