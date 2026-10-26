package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * AI 资讯（首页「🌟 AI 资讯」榜单 + /news 列表的后端数据源）
 */
@Data
@TableName("ai_news")
public class AiNews implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 资讯标题 */
    private String title;

    /** 摘要（列表副标题） */
    private String summary;

    /** 正文 */
    private String content;

    /** 来源名称，如 机器之心 / 量子位 */
    private String source;

    /** 原文链接 */
    @TableField("source_url")
    private String sourceUrl;

    /** 封面图（可为空，前端退化为渐变封面） */
    @TableField("cover_url")
    private String coverUrl;

    /** 阅读量 */
    @TableField("view_num")
    private Long viewNum;

    /** 是否热门：0 否 / 1 是（展示 🔥） */
    private Integer hot;

    /** 排序，越小越靠前 */
    private Integer sort;

    /** 状态：0 下架 / 1 已发布 */
    private Integer status;

    @TableField("create_time")
    private Date createTime;

    @TableField("update_time")
    private Date updateTime;
}
