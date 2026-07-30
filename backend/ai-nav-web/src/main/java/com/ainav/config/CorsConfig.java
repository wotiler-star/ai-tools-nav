package com.ainav.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 全局跨域配置。
 * <p>
 * 前端（localhost:3000）与后端（localhost:8123）不同源，
 * Sa-Token 通过 Cookie 维持登录态，需允许携带凭证（allowCredentials）。
 * localhost 跨端口属 same-site，Cookie 可正常携带。
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowCredentials(true)
                // 用 originPatterns 才能与 allowCredentials(true) 共存
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .maxAge(3600);
    }
}
