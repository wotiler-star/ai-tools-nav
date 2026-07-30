package com.ainav;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * AI 导航站后端启动类（Spring Boot 3.2 + Java 17）
 */
@SpringBootApplication
@MapperScan("com.ainav.mapper")
public class AiNavApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiNavApplication.class, args);
    }
}
