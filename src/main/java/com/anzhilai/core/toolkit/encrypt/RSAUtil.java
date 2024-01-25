package com.anzhilai.core.toolkit.encrypt;


import com.anzhilai.core.toolkit.Base64;
import com.anzhilai.core.toolkit.StrUtil;

import javax.crypto.Cipher;
import java.math.BigInteger;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.*;

public class RSAUtil {

    public static void main(String[] args) throws Exception {
        String data = "this is a test中文!";
        String[] keys = createKey();
        System.out.println(data);
        String encryptedString = RSAUtil.encrypt(data, keys[0]);//公钥加密
        System.out.println(encryptedString);
        String decryptedString = RSAUtil.decrypt(encryptedString, keys[1]);//私钥解密
        System.out.println(decryptedString);

        encryptedString = RSAUtil.encrypt2(data, keys[1]);//私钥加密
        System.out.println(encryptedString);
        decryptedString = RSAUtil.decrypt2(encryptedString, keys[0]);//公钥解密
        System.out.println(decryptedString);
    }

    //生成一对密钥
    public static String[] createKey() throws NoSuchAlgorithmException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(1024);
        KeyPair pair = keyGen.generateKeyPair();
//        String modulus = ((RSAPublicKey) pair.getPublic()).getModulus().toString(); //模
//        String public_exponent = ((RSAPublicKey) pair.getPublic()).getPublicExponent().toString();   //公钥指数
//        String modulus = ((RSAPrivateKey) pair.getPrivate()).getModulus().toString(); //模
//        String private_exponent = ((RSAPrivateKey) pair.getPrivate()).getPrivateExponent().toString();   //公钥指数
        byte[] publicBytes = pair.getPublic().getEncoded();
        byte[] privateBytes = pair.getPrivate().getEncoded();

        String privateKey = Base64.encode(privateBytes);
        String publicKey = Base64.encode(publicBytes);
        System.out.println("public key: " + publicKey);
        System.out.println("private key: " + privateKey);
        return new String[]{publicKey, privateKey};
    }

    //加密,data 长度不能大于 117字符
    /**
     * RSA公钥加密
     *
     * @param str       加密字符串
     * @param publicKey 公钥
     * @return 密文
     * @throws Exception 加密过程中的异常信息
     */
    public static String encrypt(String str, String publicKey) throws Exception {
        if (StrUtil.isEmpty(publicKey)) {
            return str;
        }
        //base64编码的公钥
        byte[] decoded = Base64.decode(publicKey);
        RSAPublicKey pubKey = (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
        //RSA加密
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, pubKey);
        String outStr = Base64.encode(cipher.doFinal(str.getBytes("UTF-8")));
        return outStr;
    }

    /**
     * RSA私钥解密
     *
     * @param str        加密字符串
     * @param privateKey 私钥
     * @return 铭文
     * @throws Exception 解密过程中的异常信息
     */
    public static String decrypt(String str, String privateKey) throws Exception {
        if (StrUtil.isEmpty(privateKey)) {
            return str;
        }
        //64位解码加密后的字符串
        byte[] inputByte = Base64.decode(str);
        //base64编码的私钥
        byte[] decoded = Base64.decode(privateKey);
        RSAPrivateKey priKey = (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
        //RSA解密
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, priKey);
        String outStr = new String(cipher.doFinal(inputByte));
        return outStr;
    }

    /**
     * RSA私钥加密
     *
     * @param str
     * @param privateKey
     * @return 密文
     * @throws Exception 加密过程中的异常信息
     */
    public static String encrypt2(String str, String privateKey) throws Exception {
        if (StrUtil.isEmpty(privateKey)) {
            return str;
        }
        //base64编码的私钥
        byte[] decoded = Base64.decode(privateKey);
        RSAPrivateKey priKey = (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
        //RSA加密
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, priKey);
        String outStr = Base64.encode(cipher.doFinal(str.getBytes("UTF-8")));
        return outStr;
    }

    /**
     * RSA公钥解密
     *
     * @param str
     * @param publicKey
     * @return 铭文
     * @throws Exception 解密过程中的异常信息
     */
    public static String decrypt2(String str, String publicKey) throws Exception {
        if (StrUtil.isEmpty(publicKey)) {
            return str;
        }
        //64位解码加密后的字符串
        byte[] inputByte = Base64.decode(str);
        //base64编码的公钥
        byte[] decoded = Base64.decode(publicKey);
        RSAPublicKey pubKey = (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
        //RSA解密
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, pubKey);
        String outStr = new String(cipher.doFinal(inputByte));
        return outStr;
    }

    /**
     * 使用模和指数生成RSA公钥
     * 注意：【此代码用了默认补位方式，为RSA/None/PKCS1Padding，不同JDK默认的补位方式可能不同，如Android默认是RSA
     * /None/NoPadding】
     *
     * @param modulus  模
     * @param exponent 指数
     * @return
     */
    public static RSAPublicKey getPublicKey(String modulus, String exponent) {
        try {
            BigInteger b1 = new BigInteger(modulus);
            BigInteger b2 = new BigInteger(exponent);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            RSAPublicKeySpec keySpec = new RSAPublicKeySpec(b1, b2);
            return (RSAPublicKey) keyFactory.generatePublic(keySpec);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 使用模和指数生成RSA私钥
     * 注意：【此代码用了默认补位方式，为RSA/None/PKCS1Padding，不同JDK默认的补位方式可能不同，如Android默认是RSA
     * /None/NoPadding】
     *
     * @param modulus  模
     * @param exponent 指数
     * @return
     */
    public static RSAPrivateKey getPrivateKey(String modulus, String exponent) {
        try {
            BigInteger b1 = new BigInteger(modulus);
            BigInteger b2 = new BigInteger(exponent);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            RSAPrivateKeySpec keySpec = new RSAPrivateKeySpec(b1, b2);
            return (RSAPrivateKey) keyFactory.generatePrivate(keySpec);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
