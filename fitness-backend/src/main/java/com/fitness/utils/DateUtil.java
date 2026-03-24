package com.fitness.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 日期时间工具类
 */
public class DateUtil {

    private static final DateTimeFormatter FULL_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 获取当前时间的字符串： "2025-12-01 12:00:00"
     */
    public static String nowStr() {
        return LocalDateTime.now().format(FULL_FMT);
    }

    /**
     * 格式化日期对象
     */
    public static String format(LocalDateTime date) {
        if (date == null) return "";
        return date.format(FULL_FMT);
    }

    /**
     * 解析字符串为日期对象
     */
    public static LocalDateTime parse(String str) {
        return LocalDateTime.parse(str, FULL_FMT);
    }
}