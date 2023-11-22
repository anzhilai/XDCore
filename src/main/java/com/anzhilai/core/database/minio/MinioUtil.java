package com.anzhilai.core.database.minio;


import com.alibaba.fastjson.JSONObject;
import com.anzhilai.core.toolkit.StrUtil;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class MinioUtil {


    private static String minio_url;


    private static String minio_name;


    private static String minio_pass;


    private static String minio_bucketName;


    /**
     *
     * @Title: uploadImage
     * @Description:上传图片
     * @param inputStream
     * @param suffix
     * @return
     * @throws Exception
     */
    public static JSONObject uploadImage(InputStream inputStream, String suffix) throws Exception {
        return upload(inputStream, suffix, "image/jpeg");
    }


    /**
     * @Title: uploadVideo
     * @Description:上传视频
     * @param inputStream
     * @param suffix
     * @return
     * @throws Exception
     */
    public static JSONObject uploadVideo(InputStream inputStream, String suffix) throws Exception {
        return upload(inputStream, suffix, "video/mp4");
    }


    /**
     * @Title: uploadVideo
     * @Description:上传文件
     * @param inputStream
     * @param suffix
     * @return
     * @throws Exception
     */
    public static JSONObject uploadFile(InputStream inputStream, String suffix) throws Exception {
        return upload(inputStream, suffix, "application/octet-stream");
    }


    /**
     * 上传字符串大文本内容
     *
     * @Title: uploadString
     * @Description:描述方法
     * @param str
     * @return
     * @throws Exception
     */
    public static JSONObject uploadString(String str) throws Exception {
        if (!StrUtil.isNotEmpty(str)) {
            return new JSONObject();
        }
        InputStream inputStream = new ByteArrayInputStream(str.getBytes());
        return upload(inputStream, null, "text/html");
    }


    /**
     * @Title: upload
     * @Description:上传主功能
     * @return
     * @throws Exception
     */
    private static JSONObject upload(InputStream inputStream, String suffix, String contentType) throws Exception {
        JSONObject map = new JSONObject();
//        PropertiesLoader p = new PropertiesLoader("system.properties");
//        minio_url = p.getProperty("minio_url");
//        minio_name = p.getProperty("minio_name");
//        minio_pass = p.getProperty("minio_pass");
//        minio_bucketName = p.getProperty("minio_bucketName");
//        MinioClient minioClient = new MinioClient(minio_url, minio_name, minio_pass);
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
//        String ymd = sdf.format(new Date());
//        String objectName = ymd + "/" + UUID.randomUUID().toString() + (suffix != null ? suffix : "");
//        minioClient.putObject(minio_bucketName, objectName, inputStream, contentType);
//        String url = minioClient.getObjectUrl(minio_bucketName, objectName);
//        map.put("flag", "0");
//        map.put("mess", "上传成功");
//        map.put("url", url);
//        map.put("urlval", url);
//        map.put("path", minio_bucketName + "/" + objectName);
        return map;
    }
}
