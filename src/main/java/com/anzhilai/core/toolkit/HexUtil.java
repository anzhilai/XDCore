package com.anzhilai.core.toolkit;

import java.math.BigInteger;

/**
 * 进制转换类
 */
public class HexUtil {
    private static String keys = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";//编码,可加一些字符也可以实现72,96等任意进制转换，但是有符号数据不直观，会影响阅读。
    private static int exponent = keys.length();//幂数


    public static String Hex10To94(long value)//17223472558080896352ul
    {
        String result = "";
        do {
            long index = value % exponent;
            result = keys.charAt((int) index) + result;
            value = (value - index) / exponent;
        }
        while (value > 0);

        return result;
    }

    public static long Hex94To10(String value)//bUI6zOLZTrj
    {
        long result = 0;
        for (int i = 0; i < value.length(); i++) {
            int x = value.length() - i - 1;
            result += keys.indexOf(value.charAt(i)) * Math.pow(exponent, x);
        }
        return result;
    }


    // 10进制转换成36进制
    public static String Hex10To36(long int10) {
        return Hex10ToX(int10, 36);
    }

    public static String Hex10To36(String int10) {
        return Hex10ToX(int10, 36);
    }

    // 36进制转换成10进制
    public static String Hex36To10(String int36) {
        return HexXTo10(int36, 36);
    }


    public static String Hex10ToX(long int10, int radix) {
        return Hex10ToX(TypeConvert.ToString(int10), radix);
    }

    public static String Hex10ToX(String int10, int radix) {
        return new BigInteger(int10).toString(radix);
    }

    public static String HexXTo10(String intX, int radix) {
        try {
            return new BigInteger(intX, radix).toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
