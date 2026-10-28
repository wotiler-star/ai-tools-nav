package com.ainav.model.vo;

import lombok.Data;

import java.io.Serializable;

/** 后台管理：数据概览统计 */
@Data
public class AdminStatsVO implements Serializable {

    /** 注册用户数 */
    private Long userCount;

    /** AI 工具数 */
    private Long toolCount;

    /** 分类数 */
    private Long categoryCount;

    /** 社区帖子数 */
    private Long postCount;

    /** 提示词数 */
    private Long promptCount;

    /** 评论数 */
    private Long commentCount;

    /** 知识库专栏数 */
    private Long columnCount;

    /** 知识库文章数 */
    private Long articleCount;

    /** 站内消息数 */
    private Long messageCount;
}
