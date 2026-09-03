package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * AI 知识库专栏（一个专栏下包含多篇文章）
 */
@Data
@TableName("ai_column")
public class AiColumn implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 专栏标题 */
    private String title;

    /** 专栏简介 */
    private String description;

    /** 封面色值（如 #3874F7 或 hsl 串），前端生成渐变封面 */
    private String coverColor;

    /** 所属分类 id（关联 ai_column_category.id） */
    @TableField("category_id")
    private Long categoryId;

    /** 分类名称冗余，便于列表直接展示 */
    @TableField("category_name")
    private String categoryName;

    /** 标签（逗号分隔），用于标签云 */
    private String tags;

    /** 是否免费：0 免费 / 1 会员 */
    @TableField("need_vip")
    private Integer needVip;

    /** 文章数（冗余，便于列表展示，发布文章时维护） */
    @TableField("article_count")
    private Integer articleCount;

    /** 阅读量 */
    @TableField("view_num")
    private Long viewNum;

    /** 点赞数 */
    @TableField("like_num")
    private Long likeNum;

    /** 收藏数 */
    @TableField("collect_num")
    private Long collectNum;

    /** 排序，越小越靠前 */
    private Integer sort;

    /** 状态：0 下架 / 1 已发布 */
    private Integer status;

    @TableField("create_time")
    private Date createTime;

    @TableField("update_time")
    private Date updateTime;
}
