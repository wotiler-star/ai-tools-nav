package com.ainav.service.cache;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Redis 查询缓存（仅在 ainav.cache.enabled=true 时生效，对应 prod profile）。
 *
 * <p>用于缓存读多写少的列表/详情，降低 DB 压力。所有读写均 try-catch 包裹，
 * 缓存不可用时直接穿透到 DB，不影响主流程。配合 sa-token-redis-jackson，Redis 同时承载
 * token 存储与本缓存，实现中间件“真正接进后端”。
 *
 * <p>注意：必须注入 Spring 管理的 ObjectMapper——它已注册 JavaTimeModule，
 * 能正确序列化实体里的 LocalDateTime / Date。此前手写 new ObjectMapper() 会在
 * 反序列化带时间字段的实体（AiTool / AiPost / AiColumn）时抛异常并被 catch 吞掉，
 * 导致缓存永远不命中。
 */
@Service
@ConditionalOnProperty(prefix = "ainav.cache", name = "enabled", havingValue = "true")
public class RedisCacheService {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private ObjectMapper objectMapper;

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

    /**
     * 读取带泛型的缓存值，如 {@code PageResult<AiTool>}。
     * 泛型擦除下 {@link #get(String, Class)} 只能拿到原始类型，必须走 TypeReference。
     */
    public <T> T getGeneric(String key, TypeReference<T> typeRef) {
        try {
            String v = stringRedisTemplate.opsForValue().get(key);
            return v == null ? null : objectMapper.readValue(v, typeRef);
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

    public void delete(String... keys) {
        if (keys == null || keys.length == 0) {
            return;
        }
        try {
            stringRedisTemplate.delete(java.util.Arrays.asList(keys));
        } catch (Exception ignored) {
            // 缓存删除失败不阻断业务
        }
    }

    /**
     * 按前缀批量失效（SCAN + DEL，不用会阻塞 Redis 的 KEYS 命令）。
     * 后台增删改之后调用，保证前台不会读到旧数据。
     */
    public void deleteByPrefix(String prefix) {
        try {
            // 用 List 而非 Set：byte[] 的 hashCode 是对象身份哈希，Set 去不掉重复项，
            // 而 DEL 本身幂等，重复 key 交给 Redis 忽略即可
            List<byte[]> packedKeys = new ArrayList<>();
            ScanOptions options = ScanOptions.scanOptions().match(prefix + "*").count(500).build();
            stringRedisTemplate.execute((RedisCallback<Void>) connection -> {
                try (Cursor<byte[]> cursor = connection.keyCommands().scan(options)) {
                    while (cursor.hasNext()) {
                        packedKeys.add(cursor.next());
                    }
                }
                return null;
            });
            if (!packedKeys.isEmpty()) {
                byte[][] keys = packedKeys.toArray(new byte[0][]);
                stringRedisTemplate.execute((RedisCallback<Long>) connection ->
                        connection.keyCommands().del(keys));
            }
        } catch (Exception ignored) {
            // 缓存失效失败不阻断业务，最坏情况是等 TTL 自然过期
        }
    }

    /** 生成缓存 key：参数统一转字符串，null 归一为空串，保证同一查询只有一个 key */
    public static String buildKey(String prefix, Object... parts) {
        StringBuilder sb = new StringBuilder(prefix);
        for (Object p : parts) {
            sb.append(':').append(p == null ? "" : String.valueOf(p));
        }
        return sb.toString();
    }
}
