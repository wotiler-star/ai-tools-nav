package com.ainav.model.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * AI 工具分页查询请求
 */
@Data
public class ToolQueryRequest implements Serializable {

    private long current = 1;

    private long pageSize = 20;

    private Long categoryId;

    private String keyword;

    /** 二级子标签过滤（分类→子标签导航），LIKE 匹配 ai_tool.tags */
    private String tag;
}
