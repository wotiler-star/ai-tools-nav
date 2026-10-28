package com.ainav.service.impl;

import com.ainav.service.HealthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

/**
 * 健康检查实现：分别探测 MySQL 与 Redis，任一项不可用即判定为未就绪。
 * 每个探测都带超时并捕获异常，确保探针本身不会被依赖故障卡死。
 */
@Service
@Slf4j
public class HealthServiceImpl implements HealthService {

    private static final String APP = "ai-nav";

    private final DataSource dataSource;
    private final StringRedisTemplate stringRedisTemplate;

    public HealthServiceImpl(DataSource dataSource, StringRedisTemplate stringRedisTemplate) {
        this.dataSource = dataSource;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean alive() {
        return true;
    }

    @Override
    public Result check() {
        List<String> unavailable = new ArrayList<>();

        // MySQL：取一条连接并做 2 秒有效性校验
        try (Connection conn = dataSource.getConnection()) {
            if (conn == null || conn.isClosed() || !conn.isValid(2)) {
                unavailable.add("mysql");
            }
        } catch (Exception e) {
            log.warn("[{}] health check: mysql unavailable - {}", APP, e.getMessage());
            unavailable.add("mysql");
        }

        // Redis：PING，返回非空即视为可用
        try {
            String pong = stringRedisTemplate.getConnectionFactory().getConnection().ping();
            if (pong == null) {
                unavailable.add("redis");
            }
        } catch (Exception e) {
            log.warn("[{}] health check: redis unavailable - {}", APP, e.getMessage());
            unavailable.add("redis");
        }

        return new Result(unavailable.isEmpty(), unavailable);
    }
}
