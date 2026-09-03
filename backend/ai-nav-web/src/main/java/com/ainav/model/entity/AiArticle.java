package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * AI 知识库文章（归属某个专栏 ai_column）
 */
@Data
@TableName("ai_article")
public class AiArticle implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 所属专栏 id */
    @TableField("column_id")
    private Long columnId;

    /** 文章标题 */
    private String title;

    /** 文章摘要（列表展示） */
    private String summary;

    /** 正文（markdown） */
    private String content;

    /** 缩略图/封面 url，可空（空则前端生成色块） */
    @TableField("cover_url")
    private String coverUrl;

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

    /** 状态：0 草稿 / 1 已发布 */
    private Integer status;

    @TableField("create_time")
    private Date createTime;

    @TableField("update_time")
    private Date updateTime;
}
