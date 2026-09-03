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
                .addPathPatterns(
                        "/admin/**",
                        "/user/logout",
                        "/ai_post/add",
                        "/ai_post/update",
                        "/ai_post/delete",
                        "/ai_prompt/add",
                        "/ai_prompt/update",
                        "/ai_prompt/delete",
                        // ===== 评论：列表公开，发/删需登录 =====
                        "/ai_comment/add",
                        "/ai_comment/delete/**",
                        // ===== 用户中心：需登录 =====
                        "/user/update",
                        "/user/update/password",
                        "/user/mypost",
                        "/user/myprompt",
                        "/user/member",
                        "/user/favorite/**",
                        // ===== 站内消息：需登录 =====
                        "/ai_message/list/page",
                        "/ai_message/unread/count",
                        "/ai_message/read",
                        "/ai_message/delete")
                .excludePathPatterns("/doc.html", "/swagger-resources/**", "/v3/api-docs/**");
    }
}
