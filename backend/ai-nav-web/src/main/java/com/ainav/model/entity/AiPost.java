package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * AI 社区帖子
 */
@Data
@TableName("ai_post")
public class AiPost implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String content;

    @TableField("author_name")
    private String authorName;

    @TableField("author_avatar")
    private String authorAvatar;

    @TableField("thumb_url")
    private String thumbUrl;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("view_num")
    private Long viewNum;

    @TableField("like_num")
    private Long likeNum;

    @TableField("comment_num")
    private Long commentNum;
}
