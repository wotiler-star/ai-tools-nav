package com.ainav.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Sa-Token 配置：基于 SESSION Cookie 的登录认证。
 * 仅对后台管理 / 写操作接口做登录校验，公开阅读接口放行。
 */
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
                .addPathPatterns("/admin/**", "/user/logout", "/ai_post/add", "/ai_prompt/add")
                .excludePathPatterns("/doc.html", "/swagger-resources/**", "/v3/api-docs/**");
    }
}
