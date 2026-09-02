package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户收藏（工具 / 帖子 / 提示词）
 */
@Data
@TableName("user_favorite")
public class UserFavorite implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("target_type")
    private String targetType;

    @TableField("target_id")
    private Long targetId;

    /** 收藏时快照，便于列表自包含展示 */
    @TableField("target_title")
    private String targetTitle;

    @TableField("target_cover")
    private String targetCover;

    @TableField("target_desc")
    private String targetDesc;

    @TableField("target_url")
    private String targetUrl;

    @TableField("create_time")
    private LocalDateTime createTime;
}
