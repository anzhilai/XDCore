package com.anzhilai.core.framework;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.BaseUser;
import com.anzhilai.core.database.DBSession;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.StrUtil;
import org.springframework.scheduling.TaskScheduler;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
/**
 * 全局变量类
 */
public class GlobalValues {

    /**
     * 当前IP地址
     */
    public static String CurrentIP = "127.0.0.1";
    /**
     * 当前端口号，用于HTTP监听
     */
    public static int CurrentPort = -1;
    /**
     * 任务调度器
     */
    public static TaskScheduler taskScheduler;
    /**
     * 基础应用实例
     */
    public static BaseApplication baseAppliction;
    /**
     * 是否为调试模式
     */
    public static boolean isDebug = false;
    /**
     * 是否记录sql语句日志
     */
    public static boolean isLogSql = true;
    /**
     * 检查是否为调试模式
     */
    public static void checkDebug() {
        List<String> arguments = ManagementFactory.getRuntimeMXBean().getInputArguments();
        for (String str : arguments) {
            if (str.startsWith("-agentlib")) {
                isDebug = true;
                break;
            }
        }
    }

    /**
     * 获取会话缓存
     * @return 会话缓存的映射
     */
    public static Map<String, Object> GetSessionCache() {
        return DBSession.GetSession().CacheMap;
    }
    /**
     * 获取当前会话用户
     * @return 会话用户实例，如果不存在返回null
     */
    public static BaseUser GetSessionUser() {
        if (RequestUtil.HasRequest()) {
            Object user = RequestUtil.GetRequest().getAttribute(BaseUser.F_USER);
            if (user != null) return (BaseUser) user;
        }
        return null;
    }
    /**
     * 设置当前会话用户
     * @param persistedUser 持久化用户实例
     * @return 设置的持久化用户实例
     */
    public static BaseUser SetSessionUser(BaseUser persistedUser) {
        RequestUtil.GetRequest().setAttribute(BaseUser.F_USER, persistedUser);
        return persistedUser;
    }
    static String uploadpath = "";
    /**
     * 获取上传文件路径
     * @return 上传文件路径
     */
    public static String GetUploadPath() {
        if (StrUtil.isEmpty(uploadpath)) {
            String path = CommonConfig.getInstance().getUploadFilePath();
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
    /**
     * 获取上传文件完整路径
     * @param filename 文件名
     * @return 上传文件的完整路径
     */
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

    static String temppath = "";
    /**
     * 获取临时文件路径
     * @return 临时文件路径
     */
    public static String GetTempPath() {
        if (StrUtil.isEmpty(temppath)) {
            String path = CommonConfig.getInstance().getTempFilePath();
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
    /**
     * 将文件名转换为日期上传文件路径
     * @param originFileName 原始文件名
     * @return 文件路径和文件名的数组
     */
    public static String[] ChangeNameToDateUploadFilePath(String originFileName) {
        String uploadPath = GetUploadPath();
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
        String savePath = df.format(new Date());
        BaseUser user = GlobalValues.GetSessionUser();
        if (user != null) {
            savePath = user.GetUserPath().substring(uploadPath.length());
        }
        String suffix = "";
        if (originFileName.indexOf(".") > 0) {
            suffix = originFileName.substring(originFileName.lastIndexOf(".")).toLowerCase();
        }
        String uniquename = BaseModel.GetUniqueId() + suffix;
        String physicalPath = uploadPath + "/" + savePath + "/" + uniquename;
        File ff = new File(physicalPath);
        if (ff.exists()) {
            uniquename = BaseModel.GetUniqueId() + originFileName;
            physicalPath = uploadPath + "/" + savePath + "/" + uniquename;
        }
        String name = savePath.replaceAll("/", "_") + "_" + uniquename;
        return new String[]{physicalPath, name};
    }

    static String ApplicationPath = null;
    /**
     * 获取应用程序路径
     * @return 应用程序路径
     */
    public static String GetApplicationPath() {
        if (StrUtil.isEmpty(ApplicationPath)) {
            String realPath = baseAppliction.getClass().getClassLoader().getResource("").getFile();
            File file = new File(realPath);
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

    /**
     * 获取模板文件地址
     * @param fileName 文件名
     * @return 模板文件的地址
     */
    public static String GetTemplateFilePath(String fileName) {
        String path = "";
        CommonConfig config = SpringConfig.getBean(CommonConfig.class);
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
