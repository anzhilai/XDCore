package com.anzhilai.core.toolkit;

import com.mysql.jdbc.StringUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class FileUtil {

    public static void WriteStringToFile(String filePath, String content) {
        WriteStringToFile(filePath, content.getBytes());
    }

    public static void WriteStringToFile(String filePath, byte[] bytes) {
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static byte[] ReadToByte(String filename) {
        File file = new File(filename);
        Long filelength = file.length();
        byte[] filecontent = new byte[filelength.intValue()];
        try (FileInputStream in = new FileInputStream(file)) {
            in.read(filecontent);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return filecontent;
    }
    public static String ReadToBase64(String filename) {
        File file = new File(filename);
        Long filelength = file.length();
        byte[] filecontent = new byte[filelength.intValue()];
        try (FileInputStream in = new FileInputStream(file)) {
            in.read(filecontent);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Base64.encode(filecontent);
    }

    public static String readToString(String fileName) {
        return readToString(fileName, "UTF-8");
    }

    public static String readToString(String fileName, String encoding) {
        File file = new File(fileName);
        if (!file.exists()) {
            return null;
        }
        Long filelength = file.length();
        byte[] filecontent = new byte[filelength.intValue()];
        try (FileInputStream in = new FileInputStream(file);) {
            in.read(filecontent);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            return new String(filecontent, encoding);
        } catch (UnsupportedEncodingException e) {
            System.err.println("The OS does not support " + encoding);
            e.printStackTrace();
            return null;
        }
    }

    public static List<String> readToList(String path) {
        return readToList(path, "UTF-8");
    }

    public static List<String> readToList(String path, String encoding) {
        // 使用ArrayList来存储每行读取到的字符串
        List<String> list = new ArrayList<>();
        InputStreamReader fr = null;
        BufferedReader bf = null;
        try {
            fr = new InputStreamReader(new FileInputStream(path), encoding);
            bf = new BufferedReader(fr);
            String str = null;
            // 按行读取字符串
            while ((str = bf.readLine()) != null) {
                list.add(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (bf != null) {
                try {
                    bf.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fr != null) {
                try {
                    fr.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return list;
    }

    public static String get文件后缀后(String name) {
        String ret = "";
        int index = name.lastIndexOf(".");
        if (index > -1) {
            ret = name.substring(index);
        }
        return ret;
    }

    public static String getTypePart(String file) {
        if (StringUtils.isNullOrEmpty(file)) {
            return "";
        }
        File myFilePath = new File(file);
        if (!myFilePath.exists()) {
            return "";
        }
//        return file.substring(file.lastIndexOf("."));
        return get文件后缀后(file);
    }

    public static boolean isExist(String file) {
        File f = new File(file);
        return f.exists();
    }

    /**
     * 根据指定的文件夹目录返回文件夹内是否存在文件
     *
     * @param fileDirectoryPath 文件夹目录
     * @return
     */
    public static boolean hasFile(String fileDirectoryPath) {
        File fileDirectory = new File(fileDirectoryPath);
        if (fileDirectory.isDirectory()) {
            File[] files = fileDirectory.listFiles();
            if (files.length > 0)
                return true;
            else
                return false;
        } else
            return false;
    }

    public static String GetExt(String filename) {
        int i = filename.lastIndexOf(".");
        String ext = "";
        if (i != -1) {
            ext = filename.substring(i);
        }
        return ext;
    }

    public static String GetExt(String filename, boolean hasdot) {
        int i = filename.lastIndexOf(".");
        String ext = "";
        if (i != -1) {
            if (!hasdot) {
                i++;
            }
            ext = filename.substring(i);
        }
        return ext;
    }

    public static String GetNameWithoutExt(String filename) {
        int i = filename.lastIndexOf(".");
        String name = filename;
        if (i != -1) {
            name = filename.substring(0, i);
        }
        return name;
    }

    public static List<String> getAllFile(String directoryPath, boolean isAddDirectory) {
        List<String> list = new ArrayList<String>();
        File baseFile = new File(directoryPath);
        if (baseFile.isFile() || !baseFile.exists()) {
            return list;
        }
        File[] files = baseFile.listFiles();
        for (File file : files) {
            if (file.isDirectory()) {
                if (isAddDirectory) {
                    list.add(file.getAbsolutePath());
                }
                list.addAll(getAllFile(file.getAbsolutePath(), isAddDirectory));
            } else {
                list.add(file.getAbsolutePath());
            }
        }
        return list;
    }

    /**
     * 根据指定的文件夹目录返回文件夹内过滤之后的文件名
     *
     * @param fileDirectoryPath 文件夹目录
     * @param fileNames         需要过滤的文件集合 不带后缀名
     * @param fileTypes         文件后缀名
     * @return 过滤之后的文件名(带后缀名)
     */
    public static String[] getFileNames(String fileDirectoryPath, final List<String> fileNames, final String... fileTypes) {
        File fileDiretory = new File(fileDirectoryPath);
        if (fileDiretory.isDirectory()) {
            String[] files = fileDiretory.list(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    File newFile = new File(dir, name);
                    if (newFile.isDirectory()) return false;
                    for (String fileType : fileTypes) {
                        if (name.endsWith(fileType)) {
                            String fileName = name.substring(0, name.lastIndexOf("."));
                            if (!fileNames.contains(fileName)) return true;
                        }
                    }
                    return false;
                }
            });
            return files;
        } else {
            //LogUtil.i("未检测到新增文件");
            return new String[0];
        }
    }

    public static void mkdirs(String dir) {
        if (StrUtil.isEmpty(dir)) {
            return;
        }

        File file = new File(dir);
        if (file.isDirectory()) {
            return;
        } else {
            file.mkdirs();
        }
    }

    /**
     * 新建目录
     *
     * @param folderPath String 如 c:/fqf
     * @return boolean
     */
    public static boolean newFolder(String folderPath) {
        try {
            String filePath = folderPath;
            filePath = filePath.toString();
            File myFilePath = new File(filePath);
            if (!myFilePath.exists()) {
                myFilePath.mkdir();
            }
            return true;
        } catch (Exception e) {
            LogUtil.i("新建目录操作出错");
            e.printStackTrace();
            return false;
        }
    }

    /**
     * the traditional io way
     *
     * @param filename
     * @return
     * @throws IOException
     */
    public static byte[] toByteArray(String filename) throws IOException {

        File f = new File(filename);
        if (!f.exists()) {
            throw new FileNotFoundException(filename);
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream((int) f.length());
        BufferedInputStream in = null;
        try {
            in = new BufferedInputStream(new FileInputStream(f));
            int buf_size = 1024;
            byte[] buffer = new byte[buf_size];
            int len = 0;
            while (-1 != (len = in.read(buffer, 0, buf_size))) {
                bos.write(buffer, 0, len);
            }
            return bos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        } finally {
            try {
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            bos.close();
        }
    }

    /**
     * 新建文件
     *
     * @param filePathAndName String 文件路径及名称 如c:/fqf.txt
     * @param fileContent     String 文件内容
     * @return boolean
     */
    public static void newFile(String filePathAndName, String fileContent) {

        try {
            File myFilePath = new File(filePathAndName);
            if (!myFilePath.exists()) {
                myFilePath.createNewFile();
            }
            FileWriter resultFile = new FileWriter(myFilePath);
            PrintWriter myFile = new PrintWriter(resultFile);
            String strContent = fileContent;
            myFile.println(strContent);
            resultFile.close();

        } catch (Exception e) {
            LogUtil.i("新建目录操作出错");
            e.printStackTrace();

        }

    }

    /**
     * 删除文件
     *
     * @param filePathAndName String 文件路径及名称 如c:/fqf.txt
     * @return boolean
     */
    public static void delFile(String filePathAndName) {
        try {
            File myDelFile = new File(filePathAndName);
            if(myDelFile.exists()) {
                myDelFile.delete();
            }
        } catch (Exception e) {
            LogUtil.i("删除文件操作出错");
            e.printStackTrace();

        }

    }

    /**
     * 读取文件最后N行
     * <p>
     * 根据换行符判断当前的行数，
     * 使用统计来判断当前读取第N行
     * <p>
     * PS:输出的List是倒叙，需要对List反转输出
     *
     * @param file    待文件
     * @param numRead 读取的行数
     * @return List<String>
     */
    public static List<String> readLastNLine(File file, long numRead) {
        // 定义结果集
        List<String> result = new ArrayList<String>();
        //行数统计
        long count = 0;

        // 排除不可读状态
        if (!file.exists() || file.isDirectory() || !file.canRead()) {
            return null;
        }

        // 使用随机读取
        RandomAccessFile fileRead = null;
        try {
            //使用读模式
            fileRead = new RandomAccessFile(file, "r");
            //读取文件长度
            long length = fileRead.length();
            //如果是0，代表是空文件，直接返回空结果
            if (length == 0L) {
                return result;
            } else {
                //初始化游标
                long pos = length - 1;
                while (pos > 0) {
                    pos--;
                    //开始读取
                    fileRead.seek(pos);
                    //如果读取到\n代表是读取到一行
                    if (fileRead.readByte() == '\n') {
                        //使用readLine获取当前行
                        String line = fileRead.readLine();
                        //保存结果
                        result.add(line);

                        //打印当前行
                        System.out.println(line);

                        //行数统计，如果到达了numRead指定的行数，就跳出循环
                        count++;
                        if (count == numRead) {
                            break;
                        }
                    }
                }
                if (pos == 0) {
                    fileRead.seek(0);
                    result.add(fileRead.readLine());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fileRead != null) {
                try {
                    //关闭资源
                    fileRead.close();
                } catch (Exception e) {
                }
            }
        }

        return result;
    }

    /**
     * 删除文件夹
     * String
     *
     * @return boolean
     */
    public static void delFolder(String folderPath) {
        try {
            delAllFile(folderPath); // 删除完里面所有内容
            File myFilePath = new File(folderPath);
            if(myFilePath.exists()) {
                myFilePath.delete(); // 删除空文件夹
            }
        } catch (Exception e) {
            LogUtil.i("删除文件夹操作出错");
            e.printStackTrace();
        }
    }

    public static void delAllFileInThread(String path) {
        FileDeleteThread.DeleteFile(path);
    }

    /**
     * 删除文件夹里面的所有文件
     *
     * @param path String 文件夹路径 如 c:/fqf
     */
    public static void delAllFile(String path) {
        File file = new File(path);
        if (!file.exists()) {
            return;
        }
        if (!file.isDirectory()) {
            return;
        }
        String[] tempList = file.list();
        File temp = null;
        for (int i = 0; i < tempList.length; i++) {
            if (path.endsWith(File.separator)) {
                temp = new File(path + tempList[i]);
            } else {
                temp = new File(path + File.separator + tempList[i]);
            }
            if (temp.isFile()) {
                temp.delete();
            }
            if (temp.isDirectory()) {
                delFolder(path + "/" + tempList[i]);// 再删除空文件夹
            }
        }
    }

    /**
     * 复制单个文件
     *
     * @param oldPath String 原文件路径 如：c:/fqf.txt
     * @param newPath String 复制后路径 如：f:/fqf.txt
     * @return boolean
     */
    @SuppressWarnings({
            "resource", "unused"
    })
    public static void copyFile(String oldPath, String newPath) {
        try {
            int bytesum = 0;
            int byteread = 0;
            File oldfile = new File(oldPath);
            new File(newPath).getParentFile().mkdirs();
            if (oldfile.exists()) { // 文件存在时
                InputStream inStream = new FileInputStream(oldPath); // 读入原文件
                FileOutputStream fs = new FileOutputStream(newPath);
                byte[] buffer = new byte[1444];
                while ((byteread = inStream.read(buffer)) != -1) {
                    bytesum += byteread; // 字节数 文件大小
                    fs.write(buffer, 0, byteread);
                }
                inStream.close();
                fs.close();
            }
        } catch (Exception e) {
            LogUtil.i("复制单个文件操作出错");
            e.printStackTrace();

        }

    }

    /**
     * 复制整个文件夹内容
     *
     * @param oldPath String 原文件路径 如：c:/fqf
     * @param newPath String 复制后路径 如：f:/fqf/ff
     * @return boolean
     */
    public static void copyFolder(String oldPath, String newPath) {

        try {
            File a = new File(oldPath);
            if (!a.exists()) {
                return;
            }
            (new File(newPath)).mkdirs(); // 如果文件夹不存在 则建立新文件夹
            String[] file = a.list();
            File temp = null;
            for (int i = 0; i < file.length; i++) {
                if (oldPath.endsWith(File.separator)) {
                    temp = new File(oldPath + file[i]);
                } else {
                    temp = new File(oldPath + File.separator + file[i]);
                }

                if (temp.isFile()) {
                    FileInputStream input = new FileInputStream(temp);
                    FileOutputStream output = new FileOutputStream(newPath + "/" + (temp.getName()).toString());
                    byte[] b = new byte[1024 * 5];
                    int len;
                    while ((len = input.read(b)) != -1) {
                        output.write(b, 0, len);
                    }
                    output.flush();
                    output.close();
                    input.close();
                }
                if (temp.isDirectory()) {// 如果是子文件夹
                    copyFolder(oldPath + "/" + file[i], newPath + "/" + file[i]);
                }
            }
        } catch (Exception e) {
            LogUtil.i("复制整个文件夹内容操作出错");
            e.printStackTrace();

        }

    }

    /**
     * 移动文件到指定目录
     *
     * @param oldPath String 如：c:/fqf.txt
     * @param newPath String 如：d:/fqf.txt
     */
    public static void moveFile(String oldPath, String newPath) {
        copyFile(oldPath, newPath);
        delFile(oldPath);

    }

    /**
     * 移动文件到指定目录
     *
     * @param oldPath String 如：c:/fqf.txt
     * @param newPath String 如：d:/fqf.txt
     */
    public static void moveFolder(String oldPath, String newPath) {
        copyFolder(oldPath, newPath);
        delFolder(oldPath);

    }


    public static boolean saveFile(String path, byte[] data) {
        boolean ret = true;
        File file = new File(path);
        try {
            if (file.exists()) {
                file.delete();
            } else {
                file.getParentFile().mkdirs();
            }
            file.createNewFile();
            if (data != null) {
                FileOutputStream out = new FileOutputStream(path);
                out.write(data);
                out.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
            ret = false;
        }
        return ret;
    }

    // 进制位
    final static int JZ = 1024;
    // 1Byte
    final static int B = 1;
    // 1KB
    final static long KB = B * JZ;
    // 1MB
    final static long MB = KB * JZ;
    // 1GB
    final static long GB = MB * JZ;
    // 1TB
    final static long TB = GB * JZ;
    // 1PB
    final static long PB = TB * JZ;
    // EB (最多7EB)
    final static long EB = PB * JZ;

    // ZB(long 不能存储ZB字节)
    // final static long ZB = EB * JZ;

    /**
     * 格式化显示文件大小:<br>
     * 1KB=1024B<br>
     * 1MB=1024KB<br>
     * 1GB=1024MB<br>
     * 1TB=1024GB<br>
     * 1PB=1024TB<br>
     * 1EB=1024PB<br>
     * 1ZB =1024EB<br>
     * 1YB =1024ZB<br>
     * 1BB=1024YB<br>
     *
     * @param size
     * @param precision 精度 0~6
     * @return
     */
    public static String sizeFormat(long size, int precision) {
        if (precision > 6) {
            precision = 6;
        } else if (precision < 0) {
            precision = 0;
        }
        String format = "%." + precision + "f %s";
        Double val = 0.0;
        String unit = "B";
        if (size <= 0) {
            return String.format(format, val, unit);
        }
        long T = B;
        if (size >= B && size < MB) {// KB范围
            T = KB;
            unit = "KB";
        } else if (size < GB) {// MB 范围
            T = MB;
            unit = "MB";
        } else if (size < TB) {// GB
            T = GB;
            unit = "GB";
        } else if (size < PB) {// TB
            T = TB;
            unit = "TB";
        } else if (size < EB) {// PB
            T = PB;
            unit = "PB";
        } else if (size >= EB) {
            T = EB;
            unit = "EB";
        }
        val = (double) (size / T + (size * 1.0 % T / T));
        // size%1024=KB
        // size%(1024*1024)=MB
        // size%(1024*1024*1024)=GB
        // size%(1024*1024*1024*1024)=TB
        // size%(1024*1024*1024*1024*1024)=PB
        // size%(1024*1024*1024*1024*1024*1024)=EB
        // size%(1024*1024*1024*1024*1024*1024*1024)=ZB
        // size%(1024*1024*1024*1024*1024*1024*1024*1024)=YB
        // size%(1024*1024*1024*1024*1024*1024*1024*1024*1024)=BB
        return String.format(format, val, unit);
    }

    /**
     * 格式化显示文件大小:<br>
     * 1KB=1024B<br>
     * 1MB=1024KB<br>
     * 1GB=1024MB<br>
     * 1TB=1024GB<br>
     * 1PB=1024TB<br>
     * 1EB=1024PB<br>
     * 1ZB =1024EB<br>
     * 1YB =1024ZB<br>
     * 1BB=1024YB<br>
     *
     * @param size
     * @return
     */
    public static String sizeFormat(long size) {
        return sizeFormat(size, 2);
    }

    public static void main(String[] args) {
        saveFile("C:\\Users\\tangbin\\Desktop\\1.txt", "asdfasdf".getBytes());
    }
}
