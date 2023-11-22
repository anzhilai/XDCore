package com.anzhilai.core.toolkit;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;
import org.apache.tools.zip.ZipOutputStream;

/**
 * 通过Java的Zip输入输出流实现压缩和解压文件
 */
public final class ZipUtil {

    private static final String ENCODING = "utf-8";

    private ZipUtil() {
    }
    private ZipOutputStream zos;

    public ZipUtil(ZipOutputStream zos) {
        this.zos = zos;
        this.zos.setEncoding(ENCODING);
    }

    public ZipUtil(OutputStream os) {
        this.zos = new ZipOutputStream(new BufferedOutputStream(os));
    }

    public void addEntry(String base, String name) {
        addEntry(base, name, null);
    }

    public void addEntry(String base, File source) {
        addEntry(base, source == null ? null : source.getName(), source);
    }

    public void addEntry(String base, String name, File source) {
        // 按目录分级，形如：/aaa/bbb.txt
        String entry = base + name;
        try {
            if (source == null || !source.exists()) {
                if (StrUtil.isNotEmpty(name)) {
                    zos.putNextEntry(new ZipEntry(entry + "/"));
                    zos.closeEntry();
                }
                return;
            }
            if (source.isDirectory()) {
                if (source.listFiles().length > 0) {
                    for (File file : source.listFiles()) {
                        addEntry(entry + "/", file.getName(), file);// 递归列出目录下的所有文件，添加文件Entry
                    }
                } else {
                    zos.putNextEntry(new ZipEntry(entry + "/"));
                    zos.closeEntry();
                }
            } else {
                FileInputStream fis = null;
                BufferedInputStream bis = null;
                try {
                    byte[] buffer = new byte[1024 * 10];
                    fis = new FileInputStream(source);
                    bis = new BufferedInputStream(fis, buffer.length);
                    int read = 0;
                    zos.putNextEntry(new ZipEntry(entry));
                    while ((read = bis.read(buffer, 0, buffer.length)) != -1) {
                        zos.write(buffer, 0, read);
                    }
                    zos.closeEntry();
                } finally {
                    closeQuietly(bis, fis);
                }
            }

        } catch (IOException e) {

        }

    }

    public void closeZos() {
        closeQuietly(zos);
    }



    public static boolean zip(String filePath) {
        return zip(new String[]{filePath}, new String[]{});
    }

    public static boolean zip(String filePath, String outZipPath) {
        return zip(new String[]{filePath}, outZipPath);
    }

    public static boolean zip(File[] filePaths, String outZipPath) {
        String[] fileNames = new String[filePaths.length];
        for (int i = 0; i < filePaths.length; i++) {
            fileNames[i] = filePaths[i].getPath();
        }
        return zip(fileNames, outZipPath);
    }

    public static boolean zip(String[] filePath, String outZipPath) {
        boolean ret = false;
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(outZipPath);
            ret = zip(filePath, new String[0], fos);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeQuietly(fos);
        }
        return ret;
    }

    public static boolean zip(String[] filePath, String[] basePath) {
        boolean ret = false;
        File source = new File(filePath[0]);
        String zipFilePath = source.getPath() + ".zip";
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(zipFilePath);
            ret = zip(filePath, basePath, fos);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeQuietly(fos);
        }
        return ret;
    }

    public static boolean zip(String filePath, OutputStream out) {
        return zip(new String[]{filePath}, out);
    }

    public static boolean zip(String[] filePath, OutputStream out) {
        return zip(filePath, null, out);
    }

    /**
     * 压缩文件
     *
     * @param filePath 待压缩的文件路径
     * @return 压缩后的文件
     */
    public static boolean zip(String[] filePath, String[] basePath, OutputStream out) {
        boolean ret = false;
        ZipOutputStream zos = null;
        try {
            File file = null;
            zos = new ZipOutputStream(new BufferedOutputStream(out));
            // 添加对应的文件Entry
            for (int i = 0, len = filePath.length; i < len; i++) {
                String _path = filePath[i];
                file = new File(_path);
                if (file.exists()) {
                    String base = "";
                    if (basePath != null && i < basePath.length) {
                        base = basePath[i] + "/";
                    }
                    addEntry(base, file, zos);
                }
            }
            ret = true;
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            closeQuietly(zos);
        }
        return ret;
    }

    /**
     * 扫描添加文件Entry
     *
     * @param base   基路径
     * @param source 源文件
     * @param zos    Zip文件输出流
     * @throws IOException
     */
    private static void addEntry(String base, File source, ZipOutputStream zos) throws IOException {
        // 按目录分级，形如：/aaa/bbb.txt
        String entry = base + source.getName();
        if (source.isDirectory()) {
            if (source.listFiles().length > 0) {
                for (File file : source.listFiles()) {
                    addEntry(entry + "/", file, zos);// 递归列出目录下的所有文件，添加文件Entry
                }
            } else {
                zos.putNextEntry(new ZipEntry(entry + "/"));
                zos.closeEntry();
            }
        } else {
            FileInputStream fis = null;
            BufferedInputStream bis = null;
            try {
                byte[] buffer = new byte[1024 * 10];
                fis = new FileInputStream(source);
                bis = new BufferedInputStream(fis, buffer.length);
                int read = 0;
                zos.putNextEntry(new ZipEntry(entry));
                zos.setEncoding(ENCODING);
                while ((read = bis.read(buffer, 0, buffer.length)) != -1) {
                    zos.write(buffer, 0, read);
                }
                zos.closeEntry();
            } finally {
                closeQuietly(bis, fis);
            }
        }
    }

    /**
     * 解压文件
     *
     * @param filePath 压缩文件路径
     */
    public static void unzip(String filePath, String targetPath) {
        File source = new File(filePath);
        if (source.exists()) {
            try {
                InputStream zis = null;
                BufferedOutputStream bos = null;
                ZipFile zipFile = new ZipFile(source, ENCODING);
                ZipEntry entry = null;
                for (Enumeration<?> entries = zipFile.getEntries(); entries.hasMoreElements(); ) {
                    entry = (ZipEntry) entries.nextElement();
                    File target = new File(targetPath, entry.getName());
                    if (!target.getParentFile().exists()) {
                        target.getParentFile().mkdirs();// 创建文件父目录
                    }
                    zis = zipFile.getInputStream(entry);
                    bos = null;
                    if (!entry.isDirectory()) {
                        bos = new BufferedOutputStream(new FileOutputStream(target));
                        int read = 0;
                        byte[] buffer = new byte[1024 * 10];
                        while ((read = zis.read(buffer, 0, buffer.length)) != -1) {
                            bos.write(buffer, 0, read);
                        }
                        bos.flush();
                    } else {
                        target.mkdirs();
                    }
                    closeQuietly(zis, bos);
                }
                try {
                    zipFile.close();
                    zis.close();
                    bos.close();
                    zipFile = null;
                    zis = null;
                    bos = null;
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * 解压文件
     *
     * @param filePath 压缩文件路径
     */
    public static void unzip(String filePath) {
        File source = new File(filePath);
        if (source.exists()) {
            unzip(filePath, source.getParent());
        }
    }

    /**
     * 关闭一个或多个流对象
     *
     * @param closeables 可关闭的流对象列表
     * @throws IOException
     */
    public static void close(Closeable... closeables) throws IOException {
        if (closeables != null) {
            for (Closeable closeable : closeables) {
                if (closeable != null) {
                    closeable.close();
                }
            }
        }
    }

    /**
     * 关闭一个或多个流对象
     *
     * @param closeables 可关闭的流对象列表
     */
    public static  void closeQuietly(Closeable... closeables) {
        if (closeables != null) {
            for (Closeable closeable : closeables) {
                if (closeable != null) {
                    try {
                        closeable.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }


}
