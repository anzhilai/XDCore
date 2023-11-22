package com.anzhilai.core.toolkit.report;

import java.io.*;
import java.util.Calendar;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.poifs.filesystem.DirectoryEntry;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

/**
 * 将html文档转为doc
 */
public class HtmlToDoc {

    public static final String TMEP_FILE_OUT = "/doc/";// 输出doc目录
    public static final String TMEP_FILE = "/doc/temp.htm";// 模板目录
    public static final String CHAR_ENCODE = "gbk";

    public static String getTempDocPath(String path) {
        String docPath = "";
        String dateName = "";
        Calendar date = Calendar.getInstance();
        dateName += String.valueOf(date.get(Calendar.YEAR));
        dateName += String.format("%02d", (date.get(Calendar.MONTH) + 1));
        dateName += String.format("%02d", (date.get(Calendar.DATE)));
        dateName += String.format("%02d", (date.get(Calendar.HOUR_OF_DAY)));
        dateName += String.format("%02d", (date.get(Calendar.MINUTE)));
        dateName += String.format("%02d", (date.get(Calendar.SECOND)));
        dateName += String.format("%03d", (date.get(Calendar.MILLISECOND)));
        dateName += "_" + String.format("%05d", (new Random(10000)).nextInt());
        docPath = path + File.separator + dateName + ".doc";
        return docPath;
    }

    public static String writeWordFile(String filePath) throws Exception {
        String docPath = getTempDocPath((new File(filePath)).getParentFile().getPath());
        writeWordFile(filePath, docPath);
        return docPath;
    }

    public static boolean writeWordFile(String filePath, String docPath) throws Exception {
        String content = readFile(filePath);
        return writeWord(docPath, content);
    }

    /**
     * html转成doc
     *
     * @param request
     * @param content
     * @return
     * @throws Exception
     */
    public static String writeWord(HttpServletRequest request, String content) throws Exception {
        String path = request.getSession().getServletContext().getRealPath(TMEP_FILE_OUT);
        String docPath = getTempDocPath(path);
        writeWord(docPath, content);
        return docPath;
    }

    public static boolean writeWord(String docPath, String content) throws Exception {
        boolean flag = false;
        ByteArrayInputStream bais = null;
        FileOutputStream fos = null;
        try {
            (new File(docPath)).getParentFile().mkdirs();// 初始化目录
            bais = new ByteArrayInputStream(content.getBytes(CHAR_ENCODE));
            POIFSFileSystem poifs = new POIFSFileSystem();
            DirectoryEntry directory = poifs.getRoot();
            directory.createDocument("WordDocument", bais);
            fos = new FileOutputStream(docPath);
            poifs.writeFilesystem(fos);
            flag = true;
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fos != null) {
                fos.close();
            }
            if (bais != null) {
                bais.close();
            }

        }
        return flag;
    }

    public static String getTempDocContent(HttpServletRequest request) throws Exception {
        String path = request.getSession().getServletContext().getRealPath(TMEP_FILE);
        return readFile(path);
    }

    /**
     * 读取html文件到字符串
     */
    public static String readFile(String filePath) throws Exception {
        StringBuffer buffer = new StringBuffer();
        BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), CHAR_ENCODE));
        String line = null;
        while ((line = br.readLine()) != null) {
            buffer.append("\r\n");
            buffer.append(line);
        }
        br.close();
        return buffer.toString();
    }

    /**
     * 导出doc
     *
     * @param request
     * @param response
     * @param name
     * @param filePath
     * @return
     */
    public static boolean exportDoc(HttpServletRequest request, HttpServletResponse response, String name, String filePath) {
        boolean ret = false;
        File file = new File(filePath);
        if (file.exists()) {
            OutputStream output = null;
            FileInputStream fis = null;
            try {
                response.reset();
                response.setContentLength((int) file.length());
                response.setContentType("application/x-msdownload");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + new String(name.getBytes("GBK"), "ISO_8859_1") + ".doc");
                output = response.getOutputStream();
                fis = new FileInputStream(file);
                byte[] b = new byte[1024];
                int i = 0;
                while ((i = fis.read(b)) > 0) {
                    output.write(b, 0, i);
                }
                output.flush();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                close(fis);
                close(output);
                file.delete();
            }
        } else {
            try {
                response.getWriter().write("文件不存在");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return ret;
    }

    public static void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
