package com.anzhilai.core.toolkit;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class MoneyUtil {

    private static final char[] CN_UPPER_NUMBER = "零壹贰叁肆伍陆柒捌玖".toCharArray();
    private static final char[] CN_UPPER_UNIT = "仟佰拾".toCharArray();
    private static final char[] CN_GROUP = "圆万亿".toCharArray();

    public static String moneyToChinese(BigDecimal money) {
        if (money.equals(BigDecimal.ZERO)) {
            return "零圆整";
        }
        double max = 1000000000000D;
        double min = 0.01D;
        if (money.doubleValue() >= max || money.doubleValue() < min) {
            return "大于1万亿或小于1分了";
        }
        money = money.setScale(2, RoundingMode.HALF_UP);
        String moneyStr = money.toString();
        int pointPos = moneyStr.indexOf(".");
        String sInt = null;
        String sPoint = null;
        if (pointPos >= 0) {
            sInt = moneyStr.substring(0, pointPos);
            sPoint = moneyStr.substring(pointPos + 1);
        } else {
            sInt = moneyStr;
        }
        StringBuilder stringBuilder = new StringBuilder();
        if (!"0".equals(sInt)) {
            int groupCount = (int) Math.ceil(sInt.length() / 4.0);
            for (int group = 0; group < groupCount; group++) {
                boolean zeroFlag = true;
                boolean noZeroFlag = false;
                int start = (sInt.length() % 4 == 0 ? 0 : (sInt.length() % 4 - 4)) + 4 * group;
                for (int i = 0; i < 4; i++) {
                    if (i + start >= 0) {
                        int value = sInt.charAt(i + start) - '0';
                        if (value > 0) {
                            stringBuilder.append(CN_UPPER_NUMBER[value]);
                            if (i < 3) {
                                stringBuilder.append(CN_UPPER_UNIT[i]);
                            }
                            zeroFlag = true;
                            noZeroFlag = true;
                        } else if (zeroFlag) {
                            stringBuilder.append("零");
                            zeroFlag = false;
                        }
                    }
                }
                if (stringBuilder.charAt(stringBuilder.length() - 1) == '零') {
                    stringBuilder.deleteCharAt(stringBuilder.length() - 1);
                }
                if (noZeroFlag || groupCount - group == 1) {
                    stringBuilder.append(CN_GROUP[groupCount - group - 1]);
                }
            }
        }
        if (sPoint == null || "00".equals(sPoint)) {
            stringBuilder.append("整");
        } else {
            int j = sPoint.charAt(0) - '0';
            int f = sPoint.charAt(1) - '0';
            if (j > 0) {
                stringBuilder.append(CN_UPPER_NUMBER[j]).append("角");
                if (f != 0) {
                    stringBuilder.append(CN_UPPER_NUMBER[f]).append("分");
                }
            } else if ("0".equals(sInt)) {
                stringBuilder.append(CN_UPPER_NUMBER[f]).append("分");
            } else {
                stringBuilder.append("零").append(CN_UPPER_NUMBER[f]).append("分");
            }
        }
        return stringBuilder.toString();
    }
}
