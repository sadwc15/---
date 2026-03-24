package com.fitness.utils;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * 分页工具类（简化版）
 */
public class PageUtils {

    private static final ThreadLocal<PageInfo> LOCAL_PAGE = new ThreadLocal<>();

    /**
     * 开始分页
     */
    public static void startPage() {
        // 这里需要从请求中获取分页参数
        // 你可以使用Spring MVC的@RequestParam或者从Request中获取
        // 示例：pageNum和pageSize
        PageInfo pageInfo = new PageInfo();
        pageInfo.setPageNum(1);  // 默认第1页
        pageInfo.setPageSize(10); // 默认每页10条
        LOCAL_PAGE.set(pageInfo);
    }

    /**
     * 清理分页
     */
    public static void clearPage() {
        LOCAL_PAGE.remove();
    }

    /**
     * 获取分页数据
     */
    public static Map<String, Object> getPageData(List<?> list) {
        Map<String, Object> result = new HashMap<>();
        result.put("rows", list);
        result.put("total", list.size()); // 实际应该从数据库获取总记录数
        return result;
    }

    /**
     * 分页信息内部类
     */
    static class PageInfo {
        private int pageNum;
        private int pageSize;

        // getter/setter 省略
        public int getPageNum() { return pageNum; }
        public void setPageNum(int pageNum) { this.pageNum = pageNum; }
        public int getPageSize() { return pageSize; }
        public void setPageSize(int pageSize) { this.pageSize = pageSize; }
    }
}
