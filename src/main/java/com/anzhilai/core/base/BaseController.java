package com.anzhilai.core.base;


import com.anzhilai.core.database.SqlCache;

public abstract class BaseController {

    public Class GetModelClass(String pinyin) throws Exception {
        for(String table:SqlCache.hashMapClasses.keySet()){
            if(table.toLowerCase().startsWith(pinyin.toLowerCase())){
                return SqlCache.hashMapClasses.get(table);
            }
        }
        return null;
    }

    public BaseModel GetModelInstance(String pinyin) throws Exception {
        for(String table:SqlCache.hashMapClasses.keySet()){
            if(table.toLowerCase().startsWith(pinyin.toLowerCase())){
                return (BaseModel) SqlCache.hashMapClasses.get(table).newInstance();
            }
        }
        return null;
    }
}
