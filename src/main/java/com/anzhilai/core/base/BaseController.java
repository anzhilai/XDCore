package com.anzhilai.core.base;


import com.anzhilai.core.database.SqlCache;
import com.anzhilai.core.toolkit.TypeConvert;

/**
 * 基础服务接口
 * BaseController是一个抽象类，是所有服务接口的基类。
 */
public abstract class BaseController {
    /**
     * 根据给定的名称返回模型类的Class对象。
     *
     * @param name 模型类的名称
     * @return 模型类的Class对象，如果找不到则返回null
     * @throws Exception 如果出现任何错误
     */
    public Class GetModelClass(String name) throws Exception {
        for(String table:SqlCache.hashMapClasses.keySet()){
            if(table.toLowerCase().startsWith(name.toLowerCase())){
                return SqlCache.hashMapClasses.get(table);
            }
        }
        return null;
    }
    /**
     * 根据给定的名称返回模型类的实例。
     *
     * @param name 模型类的名称
     * @return 模型类的实例，如果找不到则返回null
     * @throws Exception 如果出现任何错误
     */
    public BaseModel GetModelInstance(String name) throws Exception {
        for(String table:SqlCache.hashMapClasses.keySet()){
            if(table.toLowerCase().startsWith(name.toLowerCase())){
                return  TypeConvert.CreateNewInstance(SqlCache.hashMapClasses.get(table));
            }
        }
        return null;
    }
}
