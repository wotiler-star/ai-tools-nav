package com.ainav.model.es;

import lombok.Data;

import java.io.Serializable;

/**
 * AI 工具在 Elasticsearch 中的文档结构（与 AiTool 对应，字段均为 ES 友好类型）。
 * 单独定义以避免 AiTool 上的 Jackson 注解 / LocalDateTime 与 ES 序列化冲突。
 */
@Data
public class EsAiToolDoc implements Serializable {

    private Long id;

    private String name;

    private String logo;

    private String description;

    private String url;

    private Long categoryId;

    private String tags;

    private Integer heat;
}
