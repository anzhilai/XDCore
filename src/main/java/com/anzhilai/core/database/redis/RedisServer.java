package com.anzhilai.core.database.redis;

import com.anzhilai.core.toolkit.LogUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Set;
import java.util.concurrent.CountDownLatch;

/**
 * Created by  on 2017-06-18.
 */
//写一个Redis接收端最少都要这样配置
@Service
public class RedisServer {

    public final static ChannelTopic Channel = new ChannelTopic("Test");

    //用于操作的类
    @Autowired
    public StringRedisTemplate redisTemplate;
    private CountDownLatch latch;

    @Autowired
    public RedisServer(CountDownLatch latch) {
        this.latch = latch;
    }


    public boolean hasKey(String key) {
        return this.redisTemplate.hasKey(key);
    }

    public double getDouble(String key) {
        return TypeConvert.ToDouble(this.get(key));
    }

    public Date getDate(String key) {
        return TypeConvert.ToDate(this.get(key));
    }

    public String get(String key) {
        return this.redisTemplate.opsForValue().get(key);
    }

    public void set(String key, String value) {
        this.redisTemplate.opsForValue().set(key, value);
    }

    public void delete(String key) {
        this.redisTemplate.delete(key);
    }

    public Set<String> keys(String keysPattern) {
        return this.redisTemplate.keys(keysPattern);
    }

    public Set<String> allKeys() {
        return this.keys("*");
    }

    //@Bean//订阅某一个主题用的接口
    public MessageListenerAdapter listenerAdapter(CountDownLatch latch, RedisMessageListenerContainer container) {
        RedisServer redisGet = new RedisServer(latch);
        MessageListenerAdapter receiveMessage = new MessageListenerAdapter(redisGet, "callbackMessage");//后面的字符串是需要调用的方法名
        container.addMessageListener(receiveMessage, RedisServer.Channel);
        return receiveMessage;
    }

    public void callbackMessage(String message) {
        LogUtil.i(String.format("收到Redis%s主题推送: %s", RedisServer.Channel.getTopic(), message));
        latch.countDown();
    }


}
