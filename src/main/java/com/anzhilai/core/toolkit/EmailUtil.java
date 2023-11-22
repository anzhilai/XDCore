package com.anzhilai.core.toolkit;

import com.sun.mail.util.MailSSLSocketFactory;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class EmailUtil {

    public static void main2(String[] args) {
//        int[] array = new int[1000];
//        for (int i = 0; i < array.length; i++) {
//            array[i] = i + 1;
//        }
        double[] array = {73, 72, 71, 69, 68, 67};
        double sum = 0;
        for (int i = 0; i < array.length; i++) {
            sum = DoubleUtil.add(sum, array[i]);      //求出数组的总和
        }
        double average = DoubleUtil.divide(sum, (double) array.length);  //求出数组的平均数
        double total = 0;
        for (int i = 0; i < array.length; i++) {
            double value = DoubleUtil.sub(array[i], average);
            total = DoubleUtil.add(total, DoubleUtil.mul(value, value));
        }
        double standardDeviation = Math.sqrt(total / array.length);   //求出标准差
        System.out.println(standardDeviation);
    }


    public static void main(String[] args) {
//        String mailSmtpHost = "smtp.qq.com";
//        String mailSmtpPort = "465";
//        String sendEmail = "304130270@qq.com";
//        String sendPwd = "ifyhjgxsyqczbjdd";
//        String toEmail = "744755300@qq.com";
        String mailSmtpHost = "smtp.exmail.qq.com";
        String mailSmtpPort = "465";
        String sendEmail = "hrbot@bynav.com";
        String sendPwd = "Xd@12345";
        String toEmail = "304130270@qq.com";
        String title = "验证码";
        String content = "中文123456";
        List<String> fileList = null;
        try {
            sendMail(mailSmtpHost, mailSmtpPort, sendEmail, sendPwd, toEmail, title, content, fileList);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static boolean sendMail(String mailSmtpHost, String mailSmtpPort, String sendEmail, String sendPwd, String toEmail, String title, String content, List<String> fileList) {
        return sendMail(mailSmtpHost, mailSmtpPort, sendEmail, sendPwd, toEmail, null, title, content, fileList);
    }

    public static boolean sendMail(String mailSmtpHost, String mailSmtpPort, String sendEmail, String sendPwd, String toEmail, List<String> ccList, String title, String content, List<String> fileList) {
        boolean ret = false;
        try {
            Properties props = new Properties();
            props.setProperty("mail.smtp.host", mailSmtpHost);
            props.setProperty("mail.smtp.port", mailSmtpPort);//设置端口
            props.setProperty("mail.debug", "false"); //启用调试
            props.setProperty("mail.smtp.auth", "true");
            props.setProperty("mail.transport.protocol", "smtp");

            /**SSL认证，注意腾讯邮箱是基于SSL加密的，所以需要开启才可以使用**/
            MailSSLSocketFactory sf = new MailSSLSocketFactory();
            sf.setTrustAllHosts(true);
            props.put("mail.smtp.ssl.enable", "true");
            props.put("mail.smtp.ssl.socketFactory", sf);

            //建立邮件会话
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(sendEmail, sendPwd); //发件人账号、密码
                }
            });
            //建立邮件对象
            MimeMessage message = new MimeMessage(session);
            //设置邮件的发件人、收件人、主题
            //附带发件人名字
            //message.setFrom(new InternetAddress(sendEmail, "optional-personal"));
            message.setFrom(new InternetAddress(sendEmail)); //发件人账号
            message.setRecipients(Message.RecipientType.TO, toEmail); //收件人账号

            //标题
            message.setSubject(title); //邮件标题

            //内容
            MimeMultipart multipart = new MimeMultipart();
            BodyPart contentPart = new MimeBodyPart();
            contentPart.setContent(content, "text/html;charset=utf-8");//邮件内容
            multipart.addBodyPart(contentPart);

            //附件部分
            if (fileList != null) {
                for (String filePath : fileList) {
                    if (StrUtil.isNotEmpty(filePath) && new File(filePath).exists()) {
                        MimeBodyPart attachPart = new MimeBodyPart();
                        FileDataSource fileDataSource = new FileDataSource(filePath); //附件地址
                        attachPart.setDataHandler(new DataHandler(fileDataSource));
                        attachPart.setFileName(MimeUtility.encodeText(fileDataSource.getName()));
                        multipart.addBodyPart(attachPart);
                    }
                }
            }

            message.setContent(multipart);
            if (ccList != null) {
                List<Address> list = new ArrayList<>();
                for (String mail : ccList) {
                    list.add(new InternetAddress(mail));
                }
                message.setRecipients(Message.RecipientType.CC, list.toArray(new Address[list.size()]));
            }
            //发送邮件
            Transport.send(message);
            ret = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }
}
