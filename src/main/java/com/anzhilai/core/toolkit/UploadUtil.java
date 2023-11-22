package com.anzhilai.core.toolkit;

import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.framework.GlobalValues;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by  on 2018-01-17.
 */
public class UploadUtil {
    public static final String DEFAULT_NAME = "file";
    public static final String DEFAULT_CHARSET = "utf-8";


    public static void exportZipFile(HttpServletResponse response, String filePath) throws IOException {
        exportZipFile(response, new String[]{filePath}, new File(filePath).getName());
    }

    public static void exportZipFile(HttpServletResponse response, String filePath, String name) throws IOException {
        exportZipFile(response, new String[]{filePath}, name);
    }

    public static void exportZipFile(HttpServletResponse response, String[] filePath, String name) throws IOException {
        exportZipFile(response, filePath, null, name);
    }

    public static void exportZipFile(HttpServletResponse response, String[] filePath, String[] basePath, String name)
            throws IOException {
        response.setContentType("application/x-msdownload");
        response.setHeader("Content-Disposition",
                "attachment; filename=" + new String((name + ".zip").getBytes("UTF-8"), "ISO_8859_1"));
        OutputStream out = response.getOutputStream();
        ZipUtil.zip(filePath, basePath, out);
        out.flush();
        out.close();
    }

    public static String GetUploadFile(HttpServletRequest request,String filekey) throws IOException {

        if (request instanceof StandardMultipartHttpServletRequest) {
            StandardMultipartHttpServletRequest fileRequest = (StandardMultipartHttpServletRequest) request;
            Map<String, MultipartFile> m = fileRequest.getFileMap();
            for(String k : m.keySet()){
                if(k.equals(filekey)) {
                    String n =  m.get(k).getOriginalFilename();
                    String ext =n.substring(n.indexOf("."));
                    String filename = GlobalValues.GetUploadFilePath( BaseModel.GetUniqueId()+"."+ext);
                    File f = new File(filename);
                    m.get(k).transferTo(f);
                    return filename;
                }
            }
        }
        return "";
    }

    //获取所有的上传文件对象
    public static List<MultipartFile> getAllMultipartFile(HttpServletRequest request) {
        return getMultipartFile(request, null);
    }

    public static List<MultipartFile> getMultipartFile(HttpServletRequest request) {
        return getMultipartFile(request, DEFAULT_NAME);
    }

    public static List<MultipartFile> getMultipartFile(HttpServletRequest request, String name) {
        List<MultipartFile> list = null;
        boolean isEmpty = false;
        if (StrUtil.isEmpty(name)) {
            isEmpty = true;
            list = new ArrayList<>();
        }
        if (request instanceof StandardMultipartHttpServletRequest) {
            StandardMultipartHttpServletRequest fileRequest = (StandardMultipartHttpServletRequest) request;
            MultiValueMap<String, MultipartFile> map = fileRequest.getMultiFileMap();
            if (isEmpty) {
                for (String key : map.keySet()) {
                    list.addAll(map.get(key));
                }
            } else {
                if (map.containsKey(name)) {
                    list = map.get(name);
                }
            }
        }
        if (list == null) {
            list = new ArrayList<>();
        }
        return list;
    }

    public static boolean moveUploadFile(HttpServletRequest request, String name, String path) throws Exception {
        boolean ret = false;
        List<MultipartFile> list = getMultipartFile(request, name);
        if (list.size() > 0) {
            File file = null;
            for (MultipartFile multipartFile : list) {//随机生成文件名
                file = new File(path + File.separator + BaseModel.GetUniqueId() + FileUtil.get文件后缀后(multipartFile.getOriginalFilename()));
                multipartFile.transferTo(file);
            }
            ret = true;
        }
        return ret;
    }


    public static String getFileContentByName(HttpServletRequest request) throws Exception {
        return getFileContentByName(request, DEFAULT_NAME);
    }

    public static String getFileContentByName(HttpServletRequest request, String name) throws Exception {
        return getFileContentByName(request, name, DEFAULT_CHARSET);
    }

    public static String getFileContentByName(HttpServletRequest request, String name, String charset) throws Exception {
        String content = "";
        List<MultipartFile> list = getMultipartFile(request, name);
        if (list.size() > 0) {
            content = MultipartFileToString(list.get(0), charset);
        }
        return content;
    }

    public static String MultipartFileToString(MultipartFile file) throws IOException {
        return MultipartFileToString(file, DEFAULT_CHARSET);
    }

    public static String MultipartFileToString(MultipartFile file, String charset) throws IOException {
        return new String(file.getBytes(), charset);
    }
}
