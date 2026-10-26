package com.ainav.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * MyBatis-Plus 分页结构（与前端一致：records / total / size / current / pages）
 *
 * <p>必须提供无参构造器：Redis 缓存会把本类序列化成 JSON 再反序列化回来，
 * 而 Jackson 没有无参构造器时无法还原对象（异常会被缓存层的 try-catch 吞掉，
 * 表现为「缓存永远不命中」这种静默失效）。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> implements Serializable {

    private List<T> records;

    private long total;

    private long size;

    private long current;

    private long pages;
}
