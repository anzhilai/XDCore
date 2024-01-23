package com.anzhilai.core.database;

import com.anzhilai.core.base.*;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.base.*;
import com.anzhilai.core.toolkit.TypeConvert;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SQL语句的缓存管理类
 * 该类用于管理缓存所有数据模型的相关属性和方法
 */
public class SqlCache {

    /**
     * 表名和对应的基础模型类的哈希映射表
     */
    public static Map<String, Class<BaseModel>> hashMapClasses = new ConcurrentHashMap<>();
    /**
     * 控制器类的列表
     */
    public static List<Class<?>> listController = new ArrayList<>();
    /**
     * 控制器类名称和类型的哈希映射表
     */
    public static Map<String, Class<?>> hashMapController = new ConcurrentHashMap<>();
    /**
     * 控制器类名称和对应Controller的根Url的哈希映射表
     */
    public static Map<String, String> hashMapClassRootUrl = new ConcurrentHashMap<>();
    /**
     * 表名和对应的类名的哈希映射表
     */
    private static Map<Class<?>, String> tableNameMap = new ConcurrentHashMap<>();
    /**
     * 插入SQL语句的哈希映射表
     */
    private static Map<Class<?>, String> insertSqlMap = new ConcurrentHashMap<>();
    /**
     * 插入SQL语句的字段列表的哈希映射表
     */
    private static Map<Class<?>, List<String>> insertSqlColumnMap = new ConcurrentHashMap<>();
    /**
     * 更新SQL语句的哈希映射表
     */
    private static Map<Class<?>, String> updateSqlMap = new ConcurrentHashMap<>();
    /**
     * 更新SQL语句的字段列表的哈希映射表
     */
    private static Map<Class<?>, List<String>> updateSqlColumnMap = new ConcurrentHashMap<>();
    /**
     * 类和它所有字段以及对应字段类型的哈希映射表
     */
    public static Map<Class<?>, Map<String, Field>> columnFieldMap = new ConcurrentHashMap<>();
    /**
     * 文件字段的列表
     */
    public static Map<Class<?>, List<String>> fileColumns = new ConcurrentHashMap<>();

    /**
     * URL权限的哈希映射表
     */
    public static Map<String, Boolean> urlRightMap = new ConcurrentHashMap<>();
    /**
     * 清除指定类的缓存
     *
     * @param clazz 要移除的类
     */
    public static void RemoveClass(Class clazz) {
        insertSqlMap.remove(clazz);
        insertSqlColumnMap.remove(clazz);
        updateSqlMap.remove(clazz);
        updateSqlColumnMap.remove(clazz);
        columnFieldMap.remove(clazz);
        fileColumns.remove(clazz);
    }
    /**
     * 添加数据模型类的缓存
     *
     * @param aClass 要缓存的类
     */
    public static void AddClass(Class<?> aClass) {
        Class<BaseModel> ac = (Class<BaseModel>) aClass;
        hashMapClasses.put(BaseModel.GetTableName(ac), ac);
    }

    /**
     * 添加控制器的缓存
     *
     * @param aClass 要缓存的控制器类
     */
    public static void AddController(Class<?> aClass) {
        if (aClass.getAnnotation(Controller.class) != null && !listController.contains(aClass)) {
            listController.add(aClass);
        }
        XController xc = aClass.getAnnotation(XController.class);
        String name="";
        if (BaseModelController.class.isAssignableFrom(aClass)) {
            Class<BaseModelController> ac = (Class<BaseModelController>) aClass;
            String sn = ac.getSimpleName();
            name = sn.replace("Controller", "");

            if (xc != null) {
                hashMapController.put(name, ac);
            }
        }

        if (xc != null) {
            RequestMapping rm = aClass.getAnnotation(RequestMapping.class);
            if(StrUtil.isNotEmpty(name)){
                hashMapClassRootUrl.put(name, (rm != null ? rm.value()[0] : ""));
            }
            boolean isloginc = !XController.LoginState.No.equals(xc.isLogin());
            for (Method m : aClass.getMethods()) {
                XController mxc = m.getAnnotation(XController.class);
                if (mxc != null) {
                    RequestMapping mrm = m.getAnnotation(RequestMapping.class);
                    String url = (rm != null ? rm.value()[0] : "") + mrm.value()[0];
                    boolean islogin = true;
                    if (XController.LoginState.Default.equals(mxc.isLogin())) {
                        islogin = isloginc;
                    } else if (XController.LoginState.No.equals(mxc.isLogin())) {
                        islogin = false;
                    } else if (XController.LoginState.Yes.equals(mxc.isLogin())) {
                        islogin = true;
                    }
                    urlRightMap.put(url.replaceAll("//", "/"), islogin);
                }
            }
        }
    }
    /**
     * 根据表名获取对应的基础模型类
     *
     * @param table 表名
     * @return 对应的基础模型类，若不存在则返回null
     */
    public static Class<BaseModel> GetClassByTableName(String table) {
        if (hashMapClasses.containsKey(table)) {
            return hashMapClasses.get(table);
        }
        return null;
    }
    /**
     * 设置类的表名
     *
     * @param aClass 类
     * @param tableName 表名
     */
    public static void SetTableName(Class<?> aClass, String tableName) {
        tableNameMap.put(aClass, tableName);
    }
    /**
     * 获取类的表名
     *
     * @param aClass 类
     * @return 表名，若不存在则返回null
     */
    public static String GetTableName(Class<?> aClass) {
        if (tableNameMap.containsKey(aClass)) {
            return tableNameMap.get(aClass);
        }
        return null;
    }
    /**
     * 添加插入SQL语句和对应的字段列表
     *
     * @param clazz 类
     * @param sql 插入SQL语句
     * @param insertColumns 插入语句的字段列表
     */
    public static void AddInsertSql(Class clazz, String sql, List<String> insertColumns) {
        insertSqlMap.put(clazz, sql);
        insertSqlColumnMap.put(clazz, insertColumns);
    }
    /**
     * 获取插入SQL语句
     *
     * @param clazz 类
     * @return 插入SQL语句，若不存在则返回null
     */
    public static String GetInsertSql(Class clazz) {
        if (!insertSqlMap.containsKey(clazz)) {
            return null;
        }
        return insertSqlMap.get(clazz);
    }
    /**
     * 获取插入SQL语句的字段列表
     *
     * @param clazz 类
     * @return 插入SQL语句的字段列表，若不存在则返回null
     */
    public static List<String> GetInsertColumns(Class clazz) {
        if (!insertSqlColumnMap.containsKey(clazz)) {
            return null;
        }
        return insertSqlColumnMap.get(clazz);
    }

    /**
     * 添加更新SQL语句和对应的字段列表
     *
     * @param clazz 类
     * @param sql 更新SQL语句
     * @param insertColumns 更新语句的字段列表
     */
    public static void AddUpdateSql(Class clazz, String sql, List<String> insertColumns) {
        updateSqlMap.put(clazz, sql);
        updateSqlColumnMap.put(clazz, insertColumns);
    }
    /**
     * 获取更新SQL语句
     *
     * @param clazz 类
     * @return 更新SQL语句，若不存在则返回null
     */
    public static String GetUpdateSql(Class clazz) {
        if (!updateSqlMap.containsKey(clazz)) {
            return null;
        }
        return updateSqlMap.get(clazz);
    }
    /**
     * 获取更新SQL语句的字段列表
     *
     * @param clazz 类
     * @return 更新SQL语句的字段列表，若不存在则返回null
     */
    public static List<String> GetUpdateColumns(Class clazz) {
        if (!updateSqlColumnMap.containsKey(clazz)) {
            return null;
        }
        return updateSqlColumnMap.get(clazz);
    }


    /**
     * 获取类的字段名称和对应的字段类型的哈希映射表
     *
     * @param clazz 类
     * @return 类的字段名称和对应的字段类型的哈希映射表，若不存在则返回null
     */
    public static <T extends BaseModel> Map<String, Field> GetColumnFieldMap(Class<T> clazz) {
        if (columnFieldMap.containsKey(clazz)) {
            return columnFieldMap.get(clazz);
        }
        ConcurrentHashMap<String, Field> typeHashMap = new ConcurrentHashMap<>();
        ArrayList<Field> list = new ArrayList<>();
        List<String> fileColumn = new ArrayList<>();
        list.addAll(Arrays.asList(clazz.getFields()));
        list.addAll(Arrays.asList(clazz.getDeclaredFields()));
        for (Field field : list) {
            if (Modifier.isStatic(field.getModifiers())) {
                continue;
            }
            XColumn xc = field.getAnnotation(XColumn.class);

            String columnName = field.getName();
            if (xc != null) {
                if (StrUtil.isNotEmpty(xc.name())) {
                    columnName = xc.name();
                }
                if (xc.filepath() && !fileColumn.contains(columnName)) {
                    fileColumn.add(columnName);
                }
                typeHashMap.put(columnName, field);
            }
        }
        columnFieldMap.put(clazz, typeHashMap);
        fileColumns.put(clazz, fileColumn);
        return columnFieldMap.getOrDefault(clazz, null);
    }
}
