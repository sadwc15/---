package com.fitness.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器
 * 作用：不管哪里报错，都会被这里捕获，并返回标准 JSON
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        // 打印错误堆栈到控制台，方便你排查
        e.printStackTrace();

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", 500);
        errorResponse.put("error", "Internal Server Error");
        // 把具体的错误信息返回给前端，方便你弹窗提示
        errorResponse.put("message", e.getMessage());

        return ResponseEntity.internalServerError().body(errorResponse);
    }

    // 你还可以专门捕获自定义异常，比如余额不足等
}