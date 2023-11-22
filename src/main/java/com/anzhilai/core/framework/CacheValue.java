package com.anzhilai.core.framework;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.base.XColumn;
import com.anzhilai.core.base.XIndex;
import com.anzhilai.core.base.XTable;
import com.anzhilai.core.toolkit.StrUtil;

import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@XTable
public class CacheValue extends BaseModel {

    public static Cache<String, Object> cache = CacheBuilder.newBuilder().maximumSize(5000).build();
    private static Map<String, List<CacheValue>> watchTableMap = new ConcurrentHashMap<>();

    public final static String F_TableName = "CacheValue";

    @XColumn(name = F_isValid)
    public boolean isValid;
    public final static String F_isValid = "isValid";

    @XColumn(name = F_validTime)
    public Integer validTime=60;
    public final static String F_validTime = "validTime";


    @XColumn(name = F_lastTime)
    public Date lastTime;
    public final static String F_lastTime = "lastTime";

    @XColumn(name = F_watchTables,columnDefinition = "text")
    public String watchTables;
    public final static String F_watchTables = "watchTables";

    @XColumn
    @XIndex
    public String test;
    public final static String F_test = "test";




    public static void SetCacheValid(String key, String... watchTables) throws Exception {
        CacheValue cv = CacheValue.GetObjectById(CacheValue.class, key);
        if (cv == null) {
            cv = new CacheValue();
            cv.id = key;
        }
        synchronized (watchTableMap) {
            for (String table : watchTables) {
                if (watchTableMap.containsKey(table)) {
                    if (!watchTableMap.get(table).contains(cv)) {
                        watchTableMap.get(table).add(cv);
                    }
                } else {
                    List<CacheValue> l = new ArrayList<>();
                    l.add(cv);
                    watchTableMap.put(table, l);
                }
            }
        }
        cv.lastTime = new Date();
        cv.watchTables = StrUtil.join(watchTables);
        cv.isValid = true;
        try {
            cv.Save();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public static void AddCache(String key, Object v) throws Exception {
        cache.put(key, v);
    }

    public static <T extends Object> T GetCache(String key) throws Exception {
        CacheValue cv = CacheValue.GetObjectById(CacheValue.class, key);
        if (cv != null && cv.isValid) {
            if (Math.abs(new Date().getTime() - cv.lastTime.getTime()) < cv.validTime * 60 * 1000) {
                Object o = cache.getIfPresent(key);
                return (T) o;
            } else {
                ClearCache(key);
            }
        }
        return null;
    }

    public static void WatchTableChange(String table) throws Exception {
        List<CacheValue> list = new ArrayList<>();
        synchronized (watchTableMap) {
            if (!watchTableMap.containsKey(table)) {
                return;
            }
            list.addAll(watchTableMap.get(table));
            watchTableMap.get(table).clear();
        }
        for (CacheValue cv : list) {
            cv.isValid = false;
            cv.Update(CacheValue.F_isValid, false);
            cache.invalidate(cv.id);
        }
    }

    public static void ClearAllCache() throws SQLException {
        ClearCache(null);
    }

    public static void ClearCache(String key) throws SQLException {
        try {
            if (StrUtil.isNotEmpty(key)) {
                CacheValue cv = CacheValue.GetObjectById(CacheValue.class, key);
                if (cv != null && cv.isValid) {
                    cv.Update(CacheValue.F_isValid, false);
                    cache.invalidate(key);
                }
            } else {
                Map<String, Object> m = new HashMap<>();
                m.put(CacheValue.F_isValid, false);
                new CacheValue().Update(m, CacheValue.F_isValid, true);
                cache.invalidateAll();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
