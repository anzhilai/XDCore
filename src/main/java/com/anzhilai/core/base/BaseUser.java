package com.anzhilai.core.base;


import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.toolkit.DateUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.database.SqlInfo;
import com.anzhilai.core.toolkit.StrUtil;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class BaseUser extends BaseModel {

    public static final String F_GatherTOKEN = "gathertoken";
    public static final String F_GatherUser = "gatheruser";
    public static final String F_USER = "user";
    public static final String F_Admin = "admin";
    private static final byte[] SECRET = "hzfhzf7101213***777&&&".getBytes();
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);

    public String GetLoginName() {
        return "";
    }

    public String GetPassword() {
        return "";
    }

    public String GetLoginKey() {
        return "";
    }

    public boolean IsLock() {
        return false;
    }

    public boolean IsAdmin() {
        return F_Admin.equals(this.id);
    }

    public List<String> GetApiList() throws Exception {
        return new ArrayList<>();
    }

    //重要,通过此可以设置数据权限
    public void SetQueryListDataRight(BaseQuery bq, SqlInfo suselect) throws Exception {

    }

    public static String FormatPwd(String pwd) {
        String p = StrUtil.toMd5("hzfhzfhzf222000111777" + pwd + "111***???");
        return p;
    }

    public static String GetTokenFromUser(BaseUser user, String loginKey) {
        return GetTokenFromUser(JWT.create(), user, loginKey);
    }

    public static String GetTokenFromUser(JWTCreator.Builder builder, BaseUser user, String loginKey) {
        builder.withJWTId(user.id);
        builder.withKeyId(user.GetPassword());
        builder.withIssuer(SqlCache.GetTableName(user.getClass()));
        builder.withIssuedAt(new Date());
        builder.withClaim("loginKey", loginKey);
        return builder.sign(ALGORITHM);
    }

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
