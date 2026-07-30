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
}
