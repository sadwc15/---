package com.fitness.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 全局配置类
 * 作用：统一处理跨域请求，以后不用在每个 Controller 上写 @CrossOrigin 了
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")            // 所有接口
                .allowedOriginPatterns("*")   // 允许所有来源
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的方法
                .allowedHeaders("*")          // 允许所有头
                .allowCredentials(true)       // 允许携带 Cookie
                .maxAge(3600);                // 缓存时间
    }
}