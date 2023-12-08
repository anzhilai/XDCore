package com.anzhilai.core.toolkit;

import com.anzhilai.core.framework.XException;
import com.anzhilai.core.toolkit.encrypt.RSAUtil;

import java.util.Date;

public class VerifyCodeUtil {
    //验证码加解密
    public static final String PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZVRhYExG0Zz14LMT61hKpw22Z1lLfC1l2BYdEZUyBREqCqS/2dQnnVIeR4eypwcmcoky6WVeaVh5oPbdU+KC5IqexkYuoyETLoIB07IFl+SJG1r9G9RrV6DTVNttvWt0oxW9jnaIv6spWp3dY5hIUSkUjqOaG9RqLkGvnGKdXLQIDAQAB";
    private static final String PRIVATE_KEY = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJlVGFgTEbRnPXgsxPrWEqnDbZnWUt8LWXYFh0RlTIFESoKpL/Z1CedUh5Hh7KnByZyiTLpZV5pWHmg9t1T4oLkip7GRi6jIRMuggHTsgWX5IkbWv0b1GtXoNNU2229a3SjFb2Odoi/qyland1jmEhRKRSOo5ob1GouQa+cYp1ctAgMBAAECgYEAjdLhw4VP2PetKZzvTbv4Y0G5/JL68AeFZd7TMPYpf191M8nd7S5wTKIpC0xXJOVz4AdWxP6iQsTpNy3uhw+5SFWvZ9/yZiPTZ/zckyGA4QKmdXO6dNVfGQUJfU/C2Pa3fgGlqhI1tajXIdOGcyFBHZAprh99MGJPhcN7bVDVw8ECQQDRSe9Aa/DJxW0ppumlqcEkDfApm7aYjh2zEu5P+efOXNJck/NaRN2xa3NwOQQM1wg6UhX8isyGJu7Jj7T6qdk5AkEAu43/eJnV4n/2BjCvV53iuqUIRtIFRsRR9KR7GJQbeKradG4X7GboiGQnvyCBMW0fOub5VF4GtLf/c3s4UvgxlQJAVsJvjCUzDHHrbvjioupcRrYAeT8z0soXRcTzRfQzRDj2e6pZl3I09Pe2Qy9fnnMF1idxNd/UKUi6dJQ+UitXAQJAVxonHvcyobITq+RISkSE23FxWpKG6Mqb1SXeFRgTegK+2XuXmK5iJ5V78ANEfJPVASHrgQb5zkv1UshS7BVf0QJBAKVtIrHTEOOw2Bhq+eCRr8oiXtJXm4fhm7yZV0rU8fYlbGyzYtiw5NOXo/hCRrUXAL+WvrljslFiYnCtSG6nkyk=";

    /**
     * 验证滑动验证码图片
     */
    public static boolean ValidateSlideCode(String valueKey) throws Exception {
        int index = valueKey.indexOf("_");
        if (index == -1) {
            return false;
        }
        String realValue = valueKey.substring(0, index);
        String value = DecryptVerifyCode(valueKey.substring(index + 1));
        double ok = TypeConvert.ToDouble(value);
        double value1 = TypeConvert.ToDouble(realValue);
        return Math.abs(ok - value1) <= 10;
    }

    /**
     * 解密数字验证码
     */
    public static String DecryptVerifyCode(String key) throws Exception {
        String[] strs = RSAUtil.decrypt(key, PRIVATE_KEY).split("_");//私钥解密;
        Date date = TypeConvert.ToDate(strs[0]);
        if (Math.abs(new Date().getTime() - date.getTime()) > 1000 * 60 * 10) {//10分钟有效
            throw new XException("验证码时间已过期");
        }
        return strs[1];
    }
}
