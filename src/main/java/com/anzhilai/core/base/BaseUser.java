package com.anzhilai.core.base;


import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.framework.XException;
import com.anzhilai.core.toolkit.DateUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.StrUtil;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
/**
 * 基础用户实体类
 *
 */
public abstract class BaseUser extends BaseModel {
    /**
     * 收集令牌字段名
     */
    public static final String F_GatherTOKEN = "gathertoken";
    /**
     * 收集用户字段名
     */
    public static final String F_GatherUser = "gatheruser";
    /**
     * 用户字段名
     */
    public static final String F_USER = "user";
    /**
     * 管理员字段名
     */
    public static final String F_Admin = "admin";

    private static final byte[] SECRET = "hzfhzf7101213***777&&&".getBytes();
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);
    /**
     * 获取登录名
     *
     * @return 登录名
     */
    public String GetLoginName() {
        return "";
    }
    /**
     * 获取密码
     *
     * @return 密码
     */
    public String GetPassword() {
        return "";
    }
    /**
     * 获取登录密钥
     *
     * @return 登录密钥
     */
    public String GetLoginKey() {
        return "";
    }
    /**
     * 判断是否被锁定
     *
     * @return 是否被锁定
     */
    public boolean IsLock() {
        return false;
    }
    /**
     * 判断是否是管理员
     *
     * @return 是否是管理员
     */
    public boolean IsAdmin() {
        return F_Admin.equals(this.id);
    }
    /**
     * 获取用户授权的API列表
     *
     * @return API列表
     * @throws Exception 异常
     */
    public List<String> GetApiList() throws Exception {
        return new ArrayList<>();
    }

    /**
     * 设置数据查询权限
     *
     * @param bq       查询对象
     * @param suselect 查询信息
     * @throws Exception 异常
     */
    public void SetQueryListDataRight(BaseQuery bq, SqlInfo suselect) throws Exception {

    }
    /**
     * 格式化密码
     *
     * @param pwd 原始密码
     * @return 格式化后的密码
     */
    public static String FormatPwd(String pwd) {
        String p = StrUtil.toMd5("hzfhzfhzf222000111777" + pwd + "111***???");
        return p;
    }
    /**
     * 从用户和登录密钥获取令牌
     *
     * @param user     用户
     * @param loginKey 登录密钥
     * @return 令牌
     */
    public static String GetTokenFromUser(BaseUser user, String loginKey) {
        return GetTokenFromUser(JWT.create(), user, loginKey);
    }
    /**
     * 从用户和登录密钥获取令牌
     *
     * @param builder  令牌构建器
     * @param user     用户
     * @param loginKey 登录密钥
     * @return 令牌
     */
    public static String GetTokenFromUser(JWTCreator.Builder builder, BaseUser user, String loginKey) {
        builder.withJWTId(user.id);
        builder.withKeyId(user.GetPassword());
        builder.withIssuer(SqlCache.GetTableName(user.getClass()));
        builder.withIssuedAt(new Date());
        builder.withClaim("loginKey", loginKey);
        return builder.sign(ALGORITHM);
    }
    /**
     * 解码令牌
     *
     * @param token 令牌
     * @return 解码后的令牌
     * @throws Exception 异常
     */
    public static DecodedJWT DecodedToken(String token) throws Exception {
        DecodedJWT decodedJWT = null;
        if (StrUtil.isNotEmpty(token)) {
            try {
                JWTVerifier verifier = JWT.require(ALGORITHM).build(); //Reusable verifier instance
                decodedJWT = verifier.verify(token);
            } catch (Exception e) {
                e.printStackTrace();
                log.error(e.getMessage(), e);
            }
        }
        return decodedJWT;
    }
    /**
     * 获取用户路径
     *
     * @return 用户路径
     */
    public String GetUserPath() {
        String rootPath = GlobalValues.GetUploadPath() + File.separator + "users" + File.separator;
        if (this.CreateTime == null) {
            this.CreateTime = new Date();
            try {
                this.UpdateFields(F_CreateTime);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        rootPath = rootPath + DateUtil.GetDateString(this.CreateTime, "yyyy/MM/dd") + File.separator + id;
        return rootPath;
    }
    /**
     * 根据令牌获取用户
     *
     * @param token 令牌
     * @return 用户
     * @throws Exception 异常
     */
    public static BaseUser GetUserByToken(String token) throws Exception {
        if (StrUtil.isEmpty(token)) return null;
        try {
            JWTVerifier verifier = JWT.require(ALGORITHM).build(); //Reusable verifier instance
            DecodedJWT jwt = verifier.verify(token);
            String id = jwt.getId();
            String password = jwt.getKeyId();
            String tableName = jwt.getIssuer();
            if (StrUtil.isNotEmpty(tableName)) {
                int index = tableName.lastIndexOf(".");
                if (index > 0) {
                    tableName = tableName.substring(index + 1);
                }
                Class<BaseModel> modelClass = SqlCache.GetClassByTableName(tableName);
                if (modelClass != null && BaseUser.class.isAssignableFrom(modelClass)) {
                    BaseUser user = (BaseUser) GetObjectById(modelClass, id);
                    if (user != null) {
                        if (password.equals(user.GetPassword())) {
                            Claim loginKey = jwt.getClaim("loginKey");
                            if (loginKey != null) {
                                String str = loginKey.asString();
                                if (StrUtil.isNotEmpty(str) && !str.equals(user.GetLoginKey())) {
                                    throw new XException("账号已在其他地方登录，请重新登录系统");
                                }
                            }
                            return user;
                        }
                    }
                }
            }
        } catch (Exception e) {
            if (e.getClass() == XException.class) {
                throw e;
            }
            e.printStackTrace();
            log.error(e.getMessage(), e);
        }
        return null;
    }

}
