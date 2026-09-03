package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * AI 知识库分类（新手入门 / DeepSeek / AI 编程 / AI 工具测评 ...）
 */
@Data
@TableName("ai_column_category")
public class AiColumnCategory implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 分类名称 */
    private String name;

    /** 排序，越小越靠前 */
    private Integer sort;

    /** 分类描述 */
    private String description;
}
