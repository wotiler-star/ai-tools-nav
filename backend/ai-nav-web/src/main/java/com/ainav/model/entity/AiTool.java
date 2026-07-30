package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ainav.config.TagsDeserializer;
import com.ainav.config.TagsSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * AI 工具
 */
@Data
@TableName("ai_tool")
public class AiTool implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String logo;

    private String description;

    private String url;

    @TableField("category_id")
    private Long categoryId;

    /** 标签：数据库逗号分隔存储；JSON 以数组形式进出（与前端 string[] 对齐） */
    @JsonSerialize(using = TagsSerializer.class)
    @JsonDeserialize(using = TagsDeserializer.class)
    private String tags;

    private Integer heat;

    @TableField("is_recommended")
    private Boolean isRecommended;

    @TableField("is_hot")
    private Boolean isHot;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;
}
