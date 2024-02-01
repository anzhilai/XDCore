package com.anzhilai.core.toolkit;

import com.anzhilai.core.framework.GlobalValues;
import net.dongliu.requests.RawResponse;
import net.dongliu.requests.RequestBuilder;
import net.dongliu.requests.Requests;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Http请求工具类, 因requests已经足够好用,这里仅包装一层,并提供实例用.
 */
public class HttpUtil extends Requests {

    public static Map<String, List<String>> GetUploadRequest(HttpServletRequest request) throws Exception {
        Map<String, List<String>> map = new HashMap<>();
        if (request instanceof StandardMultipartHttpServletRequest) {
            StandardMultipartHttpServletRequest fileRequest = (StandardMultipartHttpServletRequest) request;
            Map<String, MultipartFile> m = fileRequest.getFileMap();
            for (String key : m.keySet()) {
                MultipartFile mf = m.get(key);
                String originFileName = mf.getOriginalFilename().replaceAll("_", "");
                String[] filepathname = GlobalValues.ChangeNameToDateUploadFilePath(originFileName);
                File f = new File(filepathname[0]);
                File fo = new File(f.getParent());
                fo.mkdirs();
                mf.transferTo(f);
                if (!map.containsKey(key)) {
                    map.put(key, new ArrayList<>());
                }
                map.get(key).add(filepathname[1]);
            }
        }
        return map;
    }

    public static List<String> uploadRequest(HttpServletRequest request) throws Exception {
        List<String> files = new ArrayList<>();
        for (List<String> list : GetUploadRequest(request).values()) {
            files.addAll(list);
        }
        return files;
    }

    public static void ExportResponse(HttpServletResponse response, String filename,String name,boolean isImage) throws Exception {
        if (isImage) {
            HttpUtil.exportImage(response, filename, name);
        } else {
            response.setHeader("Content-Disposition",
                    "attachment; filename=" + new String((name).getBytes("UTF-8"), "ISO_8859_1"));
            HttpUtil.exportFile(response, filename, "application/x-msdownload");
        }
    }

    public static void exportVideo(HttpServletResponse response, File file, long range, String name) throws Exception {
        response.setHeader("Content-Type", "video/mp4");//设置ContentType为video格式
        response.setHeader("Content-Disposition",
                "attachment; filename=" + new String((name).getBytes("UTF-8"), "ISO_8859_1"));
        response.setContentLength((int) file.length());
        response.setHeader("Content-Range", String.valueOf(range + (file.length() - 1)));//拖动进度条时的断点
        response.setHeader("Accept-Ranges", "bytes");
//            response.setHeader("Etag", "W/"9767057-1323779115364"");
        response.setHeader("Cache-Control", "max-age=31536000, must-revalidate");
        try {
            HttpUtil.exportFile(response, file.getPath(), "video/mp4");
        } catch (Exception e) {
        }
    }

    public static void exportImage(HttpServletResponse response, String filePath) throws Exception {
        exportImage(response, filePath, null);
    }
    public static void exportImage(HttpServletResponse response, String filePath, String name) throws Exception {
        if(!FileUtil.isExist(filePath)) {
            filePath = GlobalValues.GetUploadFilePath(filePath);
        }
        File file = new File(filePath);
        if (StrUtil.isEmpty(name)) {
            name = new File(filePath).getName();
        }
        response.setHeader("Content-Disposition", "inline; filename=" + new String((name).getBytes("UTF-8"), "ISO_8859_1"));
        if (file.exists() && StrUtil.isNotEmpty(filePath)) {
            String contentType = Files.probeContentType(Paths.get(filePath));
            HttpUtil.exportFile(response, file.getPath(), contentType);
        }
    }

    public static void exportFile(HttpServletResponse response, String filePath) throws Exception {
        response.setHeader("Content-Disposition",
                "attachment; filename=" + new String((new File(filePath).getName()).getBytes("UTF-8"), "ISO_8859_1"));
        exportFile(response, filePath, "application/x-msdownload");
    }

    public static void exportFile(HttpServletResponse response, String filePath, String contentType) throws Exception {
        File file = new File(filePath);
        if (!file.exists()) {
            return;
        }
        OutputStream out = response.getOutputStream();
        FileInputStream fs = null;
        try {
            response.setContentType(contentType);
            response.setContentLength((int) file.length());
            byte[] buff = new byte[1024];
            fs = new FileInputStream(file);
            while (fs.read(buff) >= 0) {
                out.write(buff);
            }
        } catch (Exception ex) {
        } finally {
            if (fs != null) {
                fs.close();
            }
            out.flush();
            out.close();
        }
    }

    public static void exportFileByContent(HttpServletResponse response, String content, String fileName)
            throws IOException {
        response.setContentType("application/x-msdownload");
        response.setHeader("Content-Disposition",
                "attachment; filename=" + new String(fileName.getBytes("UTF-8"), "ISO_8859_1"));
        OutputStream out = response.getOutputStream();
        out.write(content.getBytes("utf-8"));
        out.flush();
        out.close();
    }

    public static void downloadFile(String url, String path) {
        RequestBuilder get = Requests.get(url);
        RawResponse response = get.send();
        InputStream in = response.getInput();
        FileOutputStream out = null;
        File file = new File(path);
        try {
            file.getParentFile().mkdirs();
            if (file.exists()) {
                file.delete();
            }
            out = new FileOutputStream(file);
            int buf_size = 1024;
            byte[] buffer = new byte[buf_size];
            int len = 0;
            while (-1 != (len = in.read(buffer, 0, buf_size))) {
                out.write(buffer, 0, len);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            response.close();
        }
    }

}
