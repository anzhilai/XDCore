package com.anzhilai.core.database;

import com.anzhilai.core.base.*;
import com.anzhilai.core.toolkit.StrUtil;
import com.anzhilai.core.base.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.persistence.Column;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

//缓存管理,单系统暂时用内存管理,多系统,则必须用redis
public class SqlCache {


    public static Map<String, Class<BaseModel>> hashMapClasses = new ConcurrentHashMap<>();

    public static List<Class<?>> listController = new ArrayList<>();
    public static Map<String, Class<?>> hashMapController = new ConcurrentHashMap<>();

    private static Map<Class<?>, String> tableNameMap = new ConcurrentHashMap<>();

    private static Map<Class<?>, String> insertSqlMap = new ConcurrentHashMap<>();
    private static Map<Class<?>, List<String>> insertSqlColumnMap = new ConcurrentHashMap<>();

    private static Map<Class<?>, String> updateSqlMap = new ConcurrentHashMap<>();
    private static Map<Class<?>, List<String>> updateSqlColumnMap = new ConcurrentHashMap<>();

    public static Map<Class<?>, Map<String, Field>> columnFieldMap = new ConcurrentHashMap<>();// 记录着本对象所有字段和它对应的类型
    public static Map<Class<?>, List<String>> fileColumns = new ConcurrentHashMap<>();// 文件字段列表


    public static Map<String, Boolean> urlRightMap = new ConcurrentHashMap<>();

    public static void RemoveClass(Class clazz) {
        insertSqlMap.remove(clazz);
        insertSqlColumnMap.remove(clazz);
        updateSqlMap.remove(clazz);
        updateSqlColumnMap.remove(clazz);
        columnFieldMap.remove(clazz);
        fileColumns.remove(clazz);
    }

    public static void AddClass(Class<?> aClass) {
        Class<BaseModel> ac = (Class<BaseModel>) aClass;
        hashMapClasses.put(BaseModel.GetTableName(ac), ac);
    }

    public static void AddController(Class<?> aClass) {
        if (aClass.getAnnotation(Controller.class) != null) {
            listController.add(aClass);
        }
        XController xc = null;
        if (BaseModelController.class.isAssignableFrom(aClass)) {
            Class<BaseModelController> ac = (Class<BaseModelController>) aClass;
            String sn = ac.getSimpleName();
            String n = sn.replace("Controller", "");
            xc = ac.getAnnotation(XController.class);
            if (xc != null) {
                hashMapController.put(n, ac);
            }
        } else {
            xc = aClass.getAnnotation(XController.class);
        }
        if (xc != null) {
            RequestMapping rm = aClass.getAnnotation(RequestMapping.class);
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

    public static Class<BaseModel> GetClassByTableName(String table) {
        if (hashMapClasses.containsKey(table)) {
            return hashMapClasses.get(table);
        }
        return null;
    }

    public static void SetTableName(Class<?> aClass, String tableName) {
        tableNameMap.put(aClass, tableName);
    }

    public static String GetTableName(Class<?> aClass) {
        if (tableNameMap.containsKey(aClass)) {
            return tableNameMap.get(aClass);
        }
        return null;
    }

    public static void AddInsertSql(Class clazz, String sql, List<String> insertColumns) {
        insertSqlMap.put(clazz, sql);
        insertSqlColumnMap.put(clazz, insertColumns);
    }

    public static String GetInsertSql(Class clazz) {
        if (!insertSqlMap.containsKey(clazz)) {
            return null;
        }
        return insertSqlMap.get(clazz);
    }

    public static List<String> GetInsertColumns(Class clazz) {
        if (!insertSqlColumnMap.containsKey(clazz)) {
            return null;
        }
        return insertSqlColumnMap.get(clazz);
    }


    public static void AddUpdateSql(Class clazz, String sql, List<String> insertColumns) {
        updateSqlMap.put(clazz, sql);
        updateSqlColumnMap.put(clazz, insertColumns);
    }

    public static String GetUpdateSql(Class clazz) {
        if (!updateSqlMap.containsKey(clazz)) {
            return null;
        }
        return updateSqlMap.get(clazz);
    }

    public static List<String> GetUpdateColumns(Class clazz) {
        if (!updateSqlColumnMap.containsKey(clazz)) {
            return null;
        }
        return updateSqlColumnMap.get(clazz);
    }


    // 获取本对象所有字段名称和它对应的类型Map
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
            } else {
                try {
                    Method method = clazz.getMethod("get" + columnName);
                    if (method != null) {
                        Column column = method.getAnnotation(Column.class);
                        if (StrUtil.isNotEmpty(column.name())) {
                            columnName = column.name();
                        }
                        typeHashMap.put(columnName, field);
                    }
                } catch (NoSuchMethodException e) {
                }
            }
        }
        columnFieldMap.put(clazz, typeHashMap);
        fileColumns.put(clazz, fileColumn);
        return columnFieldMap.getOrDefault(clazz, null);
    }


}
