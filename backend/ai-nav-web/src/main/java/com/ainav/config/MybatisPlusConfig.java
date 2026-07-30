package com.ainav.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置：分页插件（与前端 records/total/size/current 一致）
 * <p>
 * 分页方言 DbType 可通过 mybatis-plus.db-type 配置切换：
 * 生产默认 mysql；本地联调 local profile 设为 h2。
 */
@Configuration
public class MybatisPlusConfig {

    @Value("${mybatis-plus.db-type:mysql}")
    private String dbType;

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        DbType type = DbType.getDbType(dbType);
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(type));
        return interceptor;
    }
}
