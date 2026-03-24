package com.fitness.utils;

import java.util.UUID;

/**
 * 简单的令牌/ID生成工具
 */
public class TokenUtil {

    /**
     * 生成一个不重复的随机字符串 (UUID)
     * 用途：可以用来做订单号、图片文件名、或者临时的 Token
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 生成订单号 (时间戳 + 随机数)
     * 格式：20231201120000_1234
     */
    public static String generateOrderNo() {
        long time = System.currentTimeMillis();
        int random = (int) (Math.random() * 10000);
        return time + "_" + random;
    }
}