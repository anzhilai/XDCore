package com.anzhilai.core.framework;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseUser;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import org.springframework.scheduling.TaskScheduler;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class GlobalValues {


    public static String CurrentIP = "127.0.0.1";
    public static int CurrentPort = -1;//http监听
    //    public static int CurrentHttpsPort = 9091;//https监听
    public static TaskScheduler taskScheduler;
    public static BaseApplication baseAppliction;
    public static boolean isDebug = false;
    static String uploadpath = "";
    static String temppath = "";

    public static void checkDebug() {
        List<String> arguments = ManagementFactory.getRuntimeMXBean().getInputArguments();
        for (String str : arguments) {
            if (str.startsWith("-agentlib")) {
                isDebug = true;
                break;
            }
        }
    }


    public static Map CacheMap = new ConcurrentHashMap();

    public static Map<String, Object> GetSessionCache() {
        if (RequestUtil.GetRequest() == null) {
            return CacheMap;
        }
        Map<String, Object> map = (Map<String, Object>) RequestUtil.GetRequest().getAttribute("sessionCache");
        if (map == null) {
            map = new HashMap<>();
            RequestUtil.GetRequest().setAttribute("sessionCache", map);
        }
        return map;
    }

    public static BaseUser GetSessionUser() {
        if (RequestUtil.HasRequest()) {
            Object user = RequestUtil.GetRequest().getAttribute(BaseUser.F_USER);
            if (user != null) return (BaseUser) user;
        }
        return null;
    }

    public static BaseUser SetSessionUser(BaseUser persistedUser) {
        RequestUtil.GetRequest().setAttribute(BaseUser.F_USER, persistedUser);
        return persistedUser;
    }

    public static String GetUploadPath() {
        if (StrUtil.isEmpty(uploadpath)) {
            String path = baseAppliction.GetUploadFilePath();
            File f = new File(path);
            if (f.isAbsolute()) {
                uploadpath = path;
            } else {
                uploadpath = GetApplicationPath() + File.separator + path;
            }
            File ff = new File(uploadpath);
            if (!ff.exists()) {
                ff.mkdirs();
            }
        }
        return uploadpath;
    }

    public static String GetUploadFilePath(String filename) {
        if (StrUtil.isNotEmpty(filename)) {
            if (filename.contains("|")) {
                String[] ff = filename.split("\\|");
                filename = ff[1];
            }
            filename = filename.replace("_", "/");
            filename = filename.replace("@", "/");
        }
        return GetUploadPath() + File.separator + filename;
    }

    public static String GetTempPath() {
        if (StrUtil.isEmpty(temppath)) {
            String path = baseAppliction.GetTempFilePath();
            File f = new File(path);
            if (f.isAbsolute()) {
                temppath = path;
            } else {
                temppath = GetApplicationPath() + File.separator + path;
            }
            File ff = new File(temppath);
            if (!ff.exists()) {
                ff.mkdirs();
            }
        }
        return temppath;
    }

    public static String[] ChangeNameToDateUploadFilePath(String originFileName) {
        String uploadPath = GetUploadPath();
        String userPath = "";
        if (baseAppliction != null && baseAppliction.UseUserUploadPath()) {
            BaseUser user = GlobalValues.GetSessionUser();
            if (user != null) {
                userPath = user.GetUserPath().substring(uploadPath.length());
            }
        }
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
        String savePath = df.format(new Date());
        String suffix = "";
        if (originFileName.indexOf(".") > 0) {
            suffix = originFileName.substring(originFileName.lastIndexOf(".")).toLowerCase();
        }
        String uniquename = BaseModel.GetUniqueId() + suffix;
        String physicalPath = uploadPath + userPath + "/" + savePath + "/" + uniquename;
        File ff = new File(physicalPath);
        if (ff.exists()) {
            uniquename = BaseModel.GetUniqueId() + originFileName;
            physicalPath = uploadPath + userPath + "/" + savePath + "/" + uniquename;
        }
        String name = savePath + "_" + uniquename;
        return new String[]{physicalPath, name};
    }

    static String ApplicationPath = null;

    public static String GetApplicationPath() {
        if (StrUtil.isEmpty(ApplicationPath)) {
            URL url = baseAppliction.getClass().getProtectionDomain().getCodeSource().getLocation();
            File file = new File(url.getPath());
            String path = file.getAbsolutePath();
            try {
                path = java.net.URLDecoder.decode(path, "utf-8");
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (path.contains("/file:")) {
                path = path.substring(0, path.indexOf("/file:"));
            }
            if (path.contains("\\file:")) {
                path = path.substring(0, path.indexOf("\\file:"));
            }
            ApplicationPath = path;
        }
        return ApplicationPath;
    }

    //获取模板文件地址
    public static String GetTemplateFilePath(String fileName) {
        String path = "";
        CommonConfig config = SystemSpringConfig.getBean(CommonConfig.class);
        if (config != null) {
            String templatePath = config.getTemplatePath();
            templatePath = StrUtil.isNotEmpty(templatePath) ? templatePath : "template";
            File f = new File(templatePath);
            if (!f.isAbsolute()) {
                templatePath = GetApplicationPath() + File.separator + templatePath;
            }
            path = templatePath + File.separator + fileName;
        }
        if (!new File(path).exists()) {
            path = GetApplicationPath() + File.separator + "static" + File.separator + "template" + File.separator + fileName;
        }
        return path;
    }

}
