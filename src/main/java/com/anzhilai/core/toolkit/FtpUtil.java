package com.anzhilai.core.toolkit;

import java.io.*;
import java.util.Calendar;
import java.util.TimeZone;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;

public class FtpUtil {
    private static final Log LOG = LogFactory.getLog(FtpUtil.class);
    public static String charsetName = "utf-8";
    private FTPClient ftpClient;
    private String IP;
    private int port;
    private String userName;
    private String passWord;
    private String homePath;


    /**
     * 构造函数
     *
     * @param IP       FTP服务器地址
     * @param userName FTP服务器用户名
     * @param passWord FTP服务器密码
     */
    public FtpUtil(String IP, int port, String userName, String passWord) {
        this.IP = IP;
        this.port = port;
        this.userName = userName;
        this.passWord = passWord;
        this.ftpClient = new FTPClient();
        if (StrUtil.isEmpty(this.userName)) {//匿名登录
            this.userName = "anonymous";
            this.passWord = null;
        }
    }

    /**
     * @return 判断是否登入成功
     */
    public boolean login() {
        boolean isLogin = false;
        FTPClientConfig ftpClientConfig = new FTPClientConfig();
        ftpClientConfig.setServerTimeZoneId(TimeZone.getDefault().getID());

        // this.ftpClient.setControlEncoding("GBK");
        this.ftpClient.configure(ftpClientConfig);

        try {
            if (this.port > 0) {
                this.ftpClient.connect(this.IP, this.port);
            } else {
                this.ftpClient.connect(IP);
            }
            // FTP服务器连接回答
            int reply = this.ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                this.ftpClient.disconnect();
                if (LOG.isDebugEnabled())
                    LOG.debug("登录FTP服务失败！");
                return isLogin;
            }
            this.ftpClient.login(this.userName, this.passWord);
            // 设置传输协议
            this.ftpClient.enterLocalPassiveMode();
            this.ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
            if (LOG.isDebugEnabled())
                LOG.debug("恭喜" + this.userName + "成功登陆FTP服务器");
            homePath = this.ftpClient.printWorkingDirectory();
            isLogin = true;
        } catch (Exception e) {
            LOG.error(this.userName + "登录FTP服务失败！" + e.getMessage());
        }
        this.ftpClient.setBufferSize(1024 * 2);
        this.ftpClient.setDataTimeout(3 * 1000);
        return isLogin;
    }

    /**
     * 切换到工作目录
     */
    public void changeWorkingToHome() throws IOException {
        this.ftpClient.changeWorkingDirectory(homePath);
    }

    /**
     * 退出关闭服务器链接
     */
    public void logOut() {
        if (null != this.ftpClient && this.ftpClient.isConnected()) {
            try {
                boolean reuslt = this.ftpClient.logout();// 退出FTP服务器
                if (reuslt) {
                    if (LOG.isDebugEnabled())
                        LOG.debug("成功退出服务器");
                }
            } catch (IOException e) {
                LOG.error("退出FTP服务器异常！" + e.getMessage());
            } finally {
                try {
                    this.ftpClient.disconnect();// 关闭FTP服务器的连接
                } catch (IOException e) {
                    LOG.error("关闭FTP服务器的连接异常！");
                }
            }
        }
    }

    /**
     * 上传文件
     *
     * @param localFile         本地文件
     * @param remoteUpLoadePath 上传路径
     * @return
     */
    public boolean uploadFile(String localFile, String remoteUpLoadePath) {
        return uploadFile(new File(localFile), remoteUpLoadePath);
    }

    /***
     * 上传Ftp文件
     *
     * @param localFile
     *            当地文件
     * @param remoteUpLoadePath
     *            - 上传服务器路径 应该以/结束
     * */
    public boolean uploadFile(File localFile, String remoteUpLoadePath) {
        BufferedInputStream inStream = null;
        boolean success = false;
        try {
            inStream = new BufferedInputStream(new FileInputStream(localFile));
            createDirectory(remoteUpLoadePath);
            // 项目集成调用StreamUtil方法来实现
            if (LOG.isDebugEnabled())
                LOG.debug(localFile.getName() + "开始上传.....");
            success = this.ftpClient.storeFile(localFile.getName(), inStream);
            if (success == true) {
                if (LOG.isDebugEnabled())
                    LOG.debug(localFile.getName() + "上传成功");
                return success;
            }
        } catch (FileNotFoundException e) {
            LOG.error(localFile + "未找到");
        } catch (IOException e) {
            LOG.error("上传文件IO出错！" + e.toString());
        } finally {
            if (inStream != null) {
                try {
                    inStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return success;
    }

    /***
     * 上传Ftp文件
     *
     * @param localFile
     *            当地文件
     * @param remoteUpLoadePath 上传服务器路径
     *            - 应该以/结束
     * */
    public boolean uploadFile(File localFile, String remoteUpLoadePath, String fileName) {
        BufferedInputStream inStream = null;
        boolean success = false;
        try {
            inStream = new BufferedInputStream(new FileInputStream(localFile));
            createDirectory(remoteUpLoadePath);
            // 项目集成调用StreamUtil方法来实现
            if (LOG.isDebugEnabled())
                LOG.debug(localFile.getName() + "开始上传.....");
            success = this.ftpClient.storeFile(formatName(fileName), inStream);
            if (success == true) {
                if (LOG.isDebugEnabled())
                    LOG.debug(localFile.getName() + "上传成功");
                return success;
            }
        } catch (FileNotFoundException e) {
            LOG.error(localFile + "未找到");
        } catch (IOException e) {
            LOG.error("上传文件IO出错！" + e.toString());
        } finally {
            if (inStream != null) {
                try {
                    inStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return success;
    }

    /***
     * 上传Ftp文件
     *
     * @param in
     *            数据流
     * @param remoteUpLoadePath
     *             上传服务器路径
     * @param remotefileName
     *            存储名称
     * @throws IOException
     * */
    public boolean uploadFile(String remoteUpLoadePath, String remotefileName, byte[] in) throws IOException {
        InputStream inStream = null;
        boolean success = false;
        try {
            // 项目集成调用StreamUtil方法来实现
            inStream = ByteArrayInputStream(in);
            if (LOG.isDebugEnabled())
                LOG.debug(remotefileName + "开始上传.....");
            this.ftpClient.changeWorkingDirectory(formatName(remoteUpLoadePath)); //切换到远程目录
            success = this.ftpClient.storeFile(remotefileName, inStream);
            if (success == true) {
                if (LOG.isDebugEnabled())
                    LOG.debug(remotefileName + "上传成功");
                return success;
            }
        } catch (IOException e) {
            LOG.error("上传文件IO出错！" + e.toString());
        } finally {
            if (inStream != null) {
                try {
                    inStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return success;
    }

    /***
     * 上传Ftp文件
     *
     * @param inStream
     *            数据流
     * @param remoteUpLoadePath
     *              上传服务器路径
     * @param remoteFileName
     *              存储名称
     * @throws IOException
     * */
    public boolean uploadFile(String remoteUpLoadePath, String remoteFileName, InputStream inStream) throws IOException {
        //InputStream inStream = null;
        boolean success = false;
        try {
            // 项目集成调用StreamUtil方法来实现
            //inStream = ByteArrayInputStream(in);
            if (LOG.isDebugEnabled())
                LOG.debug(remoteFileName + "开始上传.....");
            this.ftpClient.changeWorkingDirectory(formatName(remoteUpLoadePath)); //切换到远程目录
            success = this.ftpClient.storeFile(new String(remoteFileName.getBytes("GBK"), "iso-8859-1"), inStream);
            if (success == true) {
                if (LOG.isDebugEnabled())
                    LOG.debug(remoteFileName + "上传成功");
                return success;
            }
        } catch (IOException e) {
            LOG.error("上传文件IO出错！" + e.toString());
        } finally {
            if (inStream != null) {
                try {
                    inStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return success;
    }

    /**
     * byte 数组 转换流
     *
     * @param in
     * @return
     */
    private InputStream ByteArrayInputStream(byte[] in) {
        ByteArrayInputStream is = new ByteArrayInputStream(in);
        return is;
    }

    // 项目集成调用StreamUtil方法来实现
    private byte[] input2byte(InputStream inStream) throws IOException {
        ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
        byte[] buff = new byte[1024];
        int rc = 0;
        while ((rc = inStream.read(buff, 0, 100)) > 0) {
            swapStream.write(buff, 0, rc);
        }
        byte[] in2b = swapStream.toByteArray();
        return in2b;
    }

    /***
     * 下载文件
     *
     * @param remoteFileName
     *            待下载文件名称
     * @param localDires
     *            下载到当地那个路径下
     * @param remoteDownLoadPath
     *            remoteFileName所在的路径
     * */

    public boolean downloadFile(String localDires, String remoteFileName, String remoteDownLoadPath) {
        String strFilePath = converPath(localDires) + toName(remoteFileName);
        return downloadFile(new File(strFilePath), remoteFileName, remoteDownLoadPath);
    }

    public boolean downloadFile(File file, String remoteFileName, String remoteDownLoadPath) {
        try {
            return downloadFile(new FileOutputStream(file), remoteFileName, remoteDownLoadPath);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean downloadFile(OutputStream output, String remoteFileName, String remoteDownLoadPath) {
        boolean success = false;
        try {
            this.ftpClient.changeWorkingDirectory(formatName(converPath(remoteDownLoadPath)));
            success = this.ftpClient.retrieveFile(remoteFileName, output);
        } catch (Exception e) {
        } finally {
            if (null != output) {
                try {
                    output.flush();
                    output.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        if (!success) {
            if (LOG.isDebugEnabled()) {
                LOG.debug(remoteFileName + "下载失败!!!");
            }
        }
        return success;
    }

    /***
     * 下载文件
     *
     * @param remoteFileName
     *            待下载文件名称
     * @param remoteDownLoadPath
     *            remoteFileName所在的路径
     * @throws IOException
     * */

    public byte[] downloadFile(String remoteFileName, String remoteDownLoadPath) throws IOException {
        InputStream inStream = null;
        byte[] retBytes = null;
        try {
            // Properties prop = System.getProperties();
            // String os = prop.getProperty("os.name");
            // if(os.startsWith("win") || os.startsWith("Win")){
            // remoteDownLoadPath = remoteDownLoadPath.replace("\\","/");
            // }
            // boolean b=ftpClient.changeWorkingDirectory(formatName("/2016");
            this.ftpClient.changeWorkingDirectory(formatName(remoteDownLoadPath.trim()));
            if (LOG.isDebugEnabled())
                LOG.debug(remoteFileName + "开始下载....");
            inStream = this.ftpClient.retrieveFileStream(formatName(remoteFileName.trim()));
            retBytes = input2byte(inStream);
        } catch (Exception e) {
            LOG.error(remoteFileName + "下载失败");
        } finally {
            if (null != inStream) {
                try {
                    inStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return retBytes;
    }

    /***
     * @上传文件夹
     * @param localDirectory
     *            当地文件夹
     * @param remoteDirectoryPath
     *            Ftp 服务器路径 以目录"/"结束
     * @throws IOException
     * @throws UnsupportedEncodingException
     * */
    public boolean uploadDirectory(String localDirectory, String remoteDirectoryPath)
            throws UnsupportedEncodingException, IOException {
        File src = new File(localDirectory);

        File[] allFile = src.listFiles();
        for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
            if (!allFile[currentFile].isDirectory()) {
                String srcName = allFile[currentFile].getPath().toString();
                uploadFile(new File(srcName), remoteDirectoryPath);
            }
        }
        for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
            if (allFile[currentFile].isDirectory()) {
                // 递归
                String path = converPath(remoteDirectoryPath) + allFile[currentFile].getName();
                createDirectory(allFile[currentFile].getName().toString());
                uploadDirectory(allFile[currentFile].getPath().toString(), path);
            }
        }
        return true;
    }

    /***
     * @下载文件夹
     * @param localDirectoryPath
     *              本地地址
     * @param remoteDirectory
     *            远程文件夹
     * */
    public boolean downLoadDirectory(String localDirectoryPath, String remoteDirectory) {
        remoteDirectory = converPath(remoteDirectory);
        localDirectoryPath = converPath(localDirectoryPath);
        try {
            new File(localDirectoryPath).mkdirs();
            this.changeWorkingToHome();
            FTPFile[] allFile = this.ftpClient.listFiles(formatName(remoteDirectory));
            for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
                if (!allFile[currentFile].isDirectory()) {
                    downloadFile(localDirectoryPath, allFile[currentFile].getName(), remoteDirectory);
                }
            }
            for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
                if (allFile[currentFile].isDirectory()) {
                    String strRemoteDirectoryPath = converPath(remoteDirectory) + allFile[currentFile].getName();
                    String strLocalDirectoryPath = converPath(localDirectoryPath) + allFile[currentFile].getName();
                    new File(converPath(strLocalDirectoryPath)).mkdirs();
                    // this.ftpClient.changeWorkingDirectory(formatName(converPath(strRemoteDirectoryPath)));
                    downLoadDirectory(converPath(strLocalDirectoryPath), converPath(strRemoteDirectoryPath));
                }
            }
        } catch (IOException e) {
            LOG.error("下载文件夹失败!" + e.toString());
            return false;
        }
        return true;
    }

    /**
     * 根据路径进行创建文件，解决兼容问题
     *
     * @param path
     * @return
     * @throws IOException
     * @throws UnsupportedEncodingException
     */
    public boolean createDirectory(String path) throws UnsupportedEncodingException, IOException {
        path = converPath(path);
        String directory = path.substring(0, path.lastIndexOf("/") + 1);
        if (!directory.equalsIgnoreCase("/") && !this.ftpClient.changeWorkingDirectory(formatName(directory))) {
            // 如果远程目录不存在，则递归创建远程服务器目录
            int start = 0;
            int end = 0;
            if (directory.startsWith("/")) {
                start = 1;
            } else {
                start = 0;
            }
            end = directory.indexOf("/", start);
            while (true) {
                String subDirectory = formatName(path.substring(start, end));
                if (!ftpClient.changeWorkingDirectory(subDirectory)) {
                    if (ftpClient.makeDirectory(subDirectory)) {
                        ftpClient.changeWorkingDirectory(subDirectory);
                    } else {
                        if (LOG.isDebugEnabled())
                            LOG.debug("创建目录失败!");
                        return false;
                    }
                }
                start = end + 1;
                end = directory.indexOf("/", start);
                // 检查所有目录是否创建完毕
                if (end <= start) {
                    break;
                }
            }
        }
        return true;
    }

    /**
     * 增加目录结尾标识“/”
     *
     * @param path
     * @return
     */
    private String converPath(String path) {
        if (!path.trim().endsWith("/"))
            path = path + "/";
        return path;
    }

    public String formatName(String name) {
        try {
            name = new String(name.getBytes(charsetName), "iso-8859-1");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return name;
    }

    private String toName(String name) {
        try {
            name = new String(name.getBytes("iso-8859-1"), charsetName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return name;
    }

    /**
     * 读取图片 文件
     *
     * @param imgPath
     * @return
     */
    public static byte[] imageToByteArray(String imgPath) {
        BufferedInputStream in;
        try {
            in = new BufferedInputStream(new FileInputStream(imgPath));
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            int size = 0;
            byte[] temp = new byte[1024];
            while ((size = in.read(temp)) != -1) {
                out.write(temp, 0, size);
            }
            in.close();
            return out.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 根据日期转换为路径 目录到分钟
     *
     * @return
     */
    public String sysDate2path2minute() {
        Calendar date = Calendar.getInstance();
        String rootDir = "";
        String path = rootDir + "/" + date.get(Calendar.YEAR) + "/" + (date.get(Calendar.MONTH) + 1) + "/"
                + date.get(Calendar.DAY_OF_MONTH) + "/" + date.get(Calendar.HOUR_OF_DAY) + "/"
                + date.get(Calendar.MINUTE);
        return path;
    }

    /**
     * 根据日期转换为路径 目录到小时
     *
     * @return
     */
    public String sysDate2path2hour() {
        Calendar date = Calendar.getInstance();
        String rootDir = "";
        String path = rootDir + "/" + date.get(Calendar.YEAR) + "/" + (date.get(Calendar.MONTH) + 1) + "/"
                + date.get(Calendar.DAY_OF_MONTH) + "/" + date.get(Calendar.HOUR_OF_DAY);
        return path;
    }

    /**
     * 根据日期转换为路径 目录到天
     *
     * @return
     */
    public String sysDate2path2day() {
        Calendar date = Calendar.getInstance();
        String rootDir = "";
        String path = rootDir + "/" + date.get(Calendar.YEAR) + "/" + (date.get(Calendar.MONTH) + 1) + "/"
                + date.get(Calendar.DAY_OF_MONTH);
        return path;
    }

    /**
     * * 删除文件 *
     *
     * @param remoteUpLoadePath FTP服务器保存目录 *
     * @param remoteFileName    要删除的文件名称 *
     * @return
     */
    public boolean deleteFile(String remoteUpLoadePath, String remoteFileName) {
        boolean flag = false;
        try {
            //切换FTP目录
            this.ftpClient.changeWorkingDirectory(formatName(remoteUpLoadePath));
            //删除
            this.ftpClient.dele(formatName(remoteFileName));
            flag = true;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ftpClient.isConnected()) {
                try {
                    ftpClient.disconnect();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return flag;
    }


    public static void main(String[] args) throws FileNotFoundException {
        long start = System.currentTimeMillis();
        FtpUtil ftp = new FtpUtil("123.56.99.91", 21, "test", "test");
        ftp.login();
        File file = new File("C:\\Users\\administrator\\Desktop\\test.txt");
        ftp.uploadFile(file, "test/", file.getName());
        ftp.logOut();
        long end = System.currentTimeMillis();
        System.out.println("总时间毫秒：" + (end - start));
    }
}
