package com.anzhilai.core.toolkit;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StrUtil {
    private static Logger log = Logger.getLogger(StrUtil.class);

    public static boolean isHexStr(String str) {
        char[] charArr = str.toCharArray();
        for (int i = 0; i < charArr.length; ++i) {
            if ((0 > charArr[i] || charArr[i] > 9) && (97 > charArr[i] || charArr[i] > 122) && (65 > charArr[i] || charArr[i] > 90)) {
                return false;
            }
        }
        return true;
    }

    public static int CountStart(String s,String start){
        if (isEmpty(s)) return 0;
        String r = s;
        int count=0;
        int i = r.indexOf(start);
        while (i != -1) {
            r = r.substring(i + 1);
            i =r.indexOf(start);
            count++;
        }
        return count;
    }
    public static String TrimStart(String s,String start){
        if (isEmpty(s)) return s;
        String r = s;
        int i = r.indexOf(start);
        while (i != -1) {
            r = r.substring(i + 1);
            i =r.indexOf(start);
        }
        return r;
    }

    public static String CutStart(String s, String start) {
        if (isEmpty(s)) return s;
        String r = s;
        int i = s.indexOf(start);
        if (i != -1) {
            r = s.substring(i + 1);
        }
        return r;
    }

    public static String CutEnd(String s, String end) {
        if (isEmpty(s)) return s;
        String r = s;
        int i = s.lastIndexOf(end);
        if (i != -1) {
            r = s.substring(0, i);
        }
        return r;
    }

    public static String CutEndWith(String s, String end) {
        if (isEmpty(s)) return s;
        String r = s;
        if (s.endsWith(end)) {
            r = s.substring(0, end.length());
        }
        return r;
    }

    public static boolean isNotEqual(String str1, String str2) {
        return !isEqual(str1, str2);
    }

    public static boolean isNotEmpty(Object str) {
        return !org.springframework.util.StringUtils.isEmpty(str);
    }

    public static boolean isEmpty(Object str) {
        return org.springframework.util.StringUtils.isEmpty(str);
    }

    public static boolean isEqual(String str1, String str2) {
        String s1 = str1 == null ? "" : str1;
        String s2 = str2 == null ? "" : str2;
        return s1.equals(s2);
    }

    public static boolean startsWith(String str,String c){
        if(isEmpty(str)){
            return false;
        }
        return str.startsWith(c);
    }

    public static boolean ContiansList(List<String> list,String id){
        if(list==null){
            return false;
        }
        if(StrUtil.isEmpty(id)){
            return  false;
        }
        return list.contains(id);
    }

    public static List<String> splitToList(String str) {
        if(StrUtil.isEmpty(str)){
            return  new ArrayList<>();
        }
        List<String> list = new ArrayList<>();
        for (String s : split(str)) {
            list.add(s);
        }
        return list;
    }

    public static String[] split(String str) {
        return split(str, ",");
    }

    public static String[] split(String str, char c) {
        return StringUtils.split(str, c);
    }

    public static String[] split(String str, String c) {
        if (StrUtil.isEmpty(str)) {
            return new String[]{};
        }
        String[] ss = str.split(c);
        String[] rr = ArrayUtils.removeElement(ss, "");
        return rr;
    }

    public static boolean isChinese(char c) {
        String regEx = "[\u4e00-\u9fa5]";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(c + "");
        if (m.find())
            return true;
        return false;
    }

    public static int indexOf(String str, String find) {
        return StringUtils.indexOf(str, find);
    }

    public static int indexOf(String arrays[], String content) {
        for (int i = 0; i < arrays.length; i++) {
            if (arrays[i].equals(content)) {
                return i;
            }
        }
        return -1;
    }

    public static String join(Collection<String> list) {
        String str = "";
        for (String s : list) {
            str += s + ",";
        }
        return CutEnd(str, ",");
    }


    public static String join(Object[] strs) {
        return join(strs, ",");
    }

    public static String join(Object[] strs, String str) {
        return StringUtils.join(strs, str);
    }

    // 去空格
    public static String trim(String str) {
        return StringUtils.trim(str);
    }

    // 去空格(如果是null的话自动变为"")
    public static String trimToEmpty(String str) {
        return StringUtils.trimToEmpty(str);
    }

    // 去String中包含c的左右字符
    public static String trim(String str, String c) {
        return StringUtils.strip(str, c);
    }

    // 去一组String中的左右空格
    public static String[] trims(String[] str) {
        return trims(str, null);
    }

    // 去一组String中包含c的左右字符
    public static String[] trims(String[] str, String c) {
        return StringUtils.stripAll(str, c);
    }

    // 去左空格
    public static String trimL(String str) {
        return trimL(str, null);
    }

    // 去左边包含在c的字符
    public static String trimL(String str, String c) {
        return StringUtils.stripStart(str, c);
    }

    // 去右空格
    public static String trimR(String str) {
        return trimR(str, null);
    }

    // 去右边包含在c的字符
    public static String trimR(String str, String c) {
        return StringUtils.stripEnd(str, c);
    }

    // 获取N位数的随机数字字符串
    public static String randomInt(int size) {
        String ranInt = "";
        Random ran = new Random();
        for (int i = 0; i < size; i++) {
            int t = ran.nextInt(10);
            ranInt += t;
        }
        return ranInt;
    }

    /**
     * @param base64
     * @return
     */
    public static String base64Decode(final String base64) throws UnsupportedEncodingException {
        return new String(Base64.decodeBase64(base64), "utf-8");
    }

    /**
     * 二进制数据编码为BASE64字符串
     *
     * @param str
     * @return
     */
    public static String base64Encode(final String str) throws UnsupportedEncodingException {
        return Base64.encodeBase64String(str.getBytes("utf-8"));
    }

    public static String toSHA1(String decript) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            digest.update(decript.getBytes());
            byte messageDigest[] = digest.digest();
            // Create Hex String
            StringBuffer hexString = new StringBuffer();
            // 字节数组转换为 十六进制 数
            for (int i = 0; i < messageDigest.length; i++) {
                String shaHex = Integer.toHexString(messageDigest[i] & 0xFF);
                if (shaHex.length() < 2) {
                    hexString.append(0);
                }
                hexString.append(shaHex);
            }
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String toMiniMd5(String strTemp) {
        return toMd5(strTemp).substring(8, 24);
    }

    public static String toMd5(String strTemp) {
        try {
            return toMd5(strTemp.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return toMd5(strTemp.getBytes());
        }
    }

    public static String toMd5(byte[] strTemp) {
        char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
        try {

            // 使用MD5创建MessageDigest对象
            MessageDigest mdTemp = MessageDigest.getInstance("MD5");
            mdTemp.update(strTemp);
            byte[] md = mdTemp.digest();
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte b = md[i];
                // LogUtil.i((int)b);
                // 将没个数(int)b进行双字节加密
                str[k++] = hexDigits[b >> 4 & 0xf];
                str[k++] = hexDigits[b & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            return null;
        }
    }

    public static String fillAfter(String str, char c, int length) {//后补c
        while (str.length() < length) {
            str += c;
        }
        return str;
    }

    public static boolean equals(Object a, Object b) {
        if (isEmpty(a)) return isEmpty(b);
        return a.equals(b);
    }

    public static String sqlIn(int length) {
        String str = "";
        for (int i = 0; i < length; i++) {
            str += "," + "?";
        }
        return StrUtil.CutStart(str, ",");
    }

    public static int Counts(String str, String s) {
        int num = 0;
        if (StrUtil.isNotEmpty(str) && StrUtil.isNotEmpty(s)) {
            int fromIndex = 0;
            while (true) {
                int index = str.indexOf(s, fromIndex);
                if (index >= 0) {
                    fromIndex = index + s.length();
                    num++;
                } else {
                    break;
                }
            }
        }
        return num;
    }


    public static boolean isContainChinese(String str) {
        Matcher m = Pattern.compile("[\u4e00-\u9fa5]").matcher(str);
        return m.find();
    }

}
