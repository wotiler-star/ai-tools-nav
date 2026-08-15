package com.ainav.service.cache;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

/**
 * Redis 查询缓存（仅在 ainav.cache.enabled=true 时生效，对应 prod profile）。
 *
 * <p>用于缓存读多写少的列表（如分类列表），降低 DB 压力。所有读写均 try-catch 包裹，
 * 缓存不可用时直接穿透到 DB，不影响主流程。配合 sa-token-redis-jackson，Redis 同时承载
 * token 存储与本缓存，实现中间件“真正接进后端”。
 */
@Service
@ConditionalOnProperty(prefix = "ainav.cache", name = "enabled", havingValue = "true")
public class RedisCacheService {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public <T> T get(String key, Class<T> type) {
        try {
            String v = stringRedisTemplate.opsForValue().get(key);
            return v == null ? null : objectMapper.readValue(v, type);
        } catch (Exception e) {
            return null;
        }
    }

    public <T> List<T> getList(String key, Class<T> elementType) {
        try {
            String v = stringRedisTemplate.opsForValue().get(key);
            if (v == null) {
                return null;
            }
            return objectMapper.readValue(v,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, elementType));
        } catch (Exception e) {
            return null;
        }
    }

    public void put(String key, Object value, Duration ttl) {
        try {
            stringRedisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(value), ttl);
        } catch (Exception ignored) {
            // 缓存写入失败不阻断业务
        }
    }

    public void putList(String key, Object value, Duration ttl) {
        put(key, value, ttl);
    }
}
