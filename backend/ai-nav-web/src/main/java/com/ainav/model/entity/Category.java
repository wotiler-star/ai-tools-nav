package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ainav.config.TagsDeserializer;
import com.ainav.config.TagsSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.io.Serializable;

/**
 * 分类
 */
@Data
@TableName("category")
public class Category implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String icon;

    private Integer sort;

    /** 二级子标签：数据库逗号分隔存储；JSON 以数组形式进出（与前端 string[] 对齐，复刻目标站『分类→子标签』导航） */
    @JsonSerialize(using = TagsSerializer.class)
    @JsonDeserialize(using = TagsDeserializer.class)
    private String tags;
}
