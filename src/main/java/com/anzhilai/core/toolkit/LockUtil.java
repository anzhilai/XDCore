package com.anzhilai.core.toolkit;

import org.redisson.Redisson;
import org.redisson.api.RKeys;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.config.SingleServerConfig;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockUtil {
    public static Map<String, Lock> lockMap = new ConcurrentHashMap();
    public static Map<String, Lock> threadLock = new ConcurrentHashMap();
    public static String LOCK_KEY_START = "SYSTEM_LOCK_";

    public static RedissonClient redissonClient;
    public static int LOCK_TIMEOUT_SECONDS = 0;//锁定超时时间（秒）

    public static void UseRedisLock(String redisAddress, String password, int lockTimeoutSeconds) {
        LockUtil.LOCK_TIMEOUT_SECONDS = lockTimeoutSeconds;
        if (redissonClient == null && StrUtil.isNotEmpty(redisAddress)) {
            Config config = new Config();
            SingleServerConfig singleServerConfig = config.useSingleServer().setAddress(redisAddress);
            if (StrUtil.isNotEmpty(password)) {
                singleServerConfig.setPassword(password);
            }
            singleServerConfig.setDatabase(0);
            redissonClient = Redisson.create(config);
        }
    }

    public static void Lock(String strKey) {
        strKey = LOCK_KEY_START + strKey;
        String threadKey = Thread.currentThread().getId() + "_" + strKey;
        if (!threadLock.containsKey(threadKey)) {
            Lock lock = null;
            if (redissonClient == null) {
                if (!lockMap.containsKey(strKey)) {
                    lockMap.putIfAbsent(strKey, new ReentrantLock());//不存在，则写入
                }
                lock = lockMap.get(strKey);
                lock.lock();
            } else {
                if (!lockMap.containsKey(strKey)) {
                    lockMap.putIfAbsent(strKey, redissonClient.getLock(strKey));//不存在，则写入
                }
                RLock rLock = (RLock) lockMap.get(strKey);
                if (LOCK_TIMEOUT_SECONDS > 0) {
                    rLock.lock(LOCK_TIMEOUT_SECONDS, TimeUnit.SECONDS);
                } else {
                    rLock.lock();
                }
                lock = rLock;
            }
            threadLock.put(threadKey, lock);
//            System.out.println("============================" + threadKey + ":lock("
//                    + (RequestUtil.GetRequest() != null ? RequestUtil.GetRequest().getRequestURI() : "")
//                    + ")");
        }
    }

    public static void UnLock(String strKey) {
        strKey = LOCK_KEY_START + strKey;
        String threadKey = Thread.currentThread().getId() + "_" + strKey;
        if (threadLock.containsKey(threadKey)) {
            threadLock.remove(threadKey).unlock();
//            System.out.println("============================" + threadKey + ":unlock("
//                    + (RequestUtil.GetRequest() != null ? RequestUtil.GetRequest().getRequestURI() : "")
//                    + ")");
        }
    }

    public static void UnLockAll() {
        for (String key : threadLock.keySet()) {
            threadLock.get(key).unlock();
        }
        threadLock.clear();
    }

    /**
     * 删除redis中所有的锁key，重新部署项目时，调用一次
     */
    public static void DeleteAllRedisLock() {
        if (LockUtil.redissonClient != null) {
            RKeys keys = LockUtil.redissonClient.getKeys();
            for (String key : keys.getKeys()) {
                if (StrUtil.isNotEmpty(key) && key.startsWith(LOCK_KEY_START)) {
                    LockUtil.redissonClient.getSet(key).delete();
                }
            }
        }
    }
}
