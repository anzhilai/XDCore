package com.anzhilai.core.toolkit;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

public class SFtpUtil {
    public String ip;
    public int port;
    public String userName;
    public String password;
    public String privateKey;//添加私钥(信任登录方式)
    public Session session = null;
    public ChannelSftp channel = null;

    public SFtpUtil(String ip, int port, String userName, String password) {
        this.ip = ip;
        this.port = port;
        this.userName = userName;
        this.password = password;
    }

    public boolean login() {
        boolean ret = false;
        try {
            JSch jsch = new JSch();
            if (StrUtil.isNotEmpty(privateKey)) {
                jsch.addIdentity(privateKey);
            }
            session = jsch.getSession(userName, ip, port);
            if (StrUtil.isNotEmpty(password)) {
                session.setPassword(password);
            }
            Properties config = new Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.setTimeout(1000 * 10);
            session.connect();
            channel = (ChannelSftp) session.openChannel("sftp"); // 打开SFTP通道
            channel.connect();
            ret = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }

    //上传文件
    public void upload(String srcFile, String distFile) throws Exception {
        channel.put(srcFile, distFile, ChannelSftp.OVERWRITE);
    }

    public void upload(InputStream srcInput, String distFile) throws Exception {
        channel.put(srcInput, distFile, ChannelSftp.OVERWRITE);
    }


    public void download(String srcFile, String distFile) throws Exception {
        channel.get(srcFile, distFile);
    }

    public void download(String srcFile, OutputStream distFile) throws Exception {
        channel.get(srcFile, distFile);
    }

    public void close() {
        if (channel != null) {
            channel.disconnect();
        }
        if (session != null) {
            session.disconnect();
        }
    }

    public static void main(String[] args) {
        SFtpUtil sFtpUtil = new SFtpUtil("xxxx", 22, "root", "xxxx");
        String myFile = "C:\\Users\\tangbin\\Desktop\\123.txt";
        String distFile = "/root/123.txt";

        System.out.println("login:" + sFtpUtil.login());
        try {
//            sFtpUtil.upload(myFile, distFile);
            sFtpUtil.download(distFile, myFile);
            System.out.println("上传成功");
        } catch (Exception e) {
            System.out.println("上传失败");
            e.printStackTrace();
        } finally {
            sFtpUtil.close();
        }
    }
}
