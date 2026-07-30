package com.ainav.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Knife4j 接口文档配置（开发/测试环境开启，生产关闭）
 */
@Configuration
@Profile({"dev", "test", "local"})
public class Knife4jConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AI 导航站 API")
                        .version("1.0.0")
                        .description("复刻 api.codefather.cn 的 AI 工具导航与社区站后端接口"));
    }
}
