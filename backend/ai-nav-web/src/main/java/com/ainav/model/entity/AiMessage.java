package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 站内消息（评论 / 回复 / 系统通知）
 * 一张表按 user_id（接收者）过滤，不做全站广播表。
 */
@Data
@TableName("ai_message")
public class AiMessage implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 接收消息的用户 id */
    @TableField("user_id")
    private Long userId;

    /** 消息类型：comment（评论）/ reply（回复）/ system（系统） */
    private String type;

    /** 关联目标类型：post / article */
    @TableField("target_type")
    private String targetType;

    /** 关联目标 id */
    @TableField("target_id")
    private Long targetId;

    /** 关联目标标题快照（避免目标被删后消息无意义） */
    @TableField("target_title")
    private String targetTitle;

    /** 触发者（评论人） */
    @TableField("from_user_id")
    private Long fromUserId;

    @TableField("from_user_name")
    private String fromUserName;

    @TableField("from_user_avatar")
    private String fromUserAvatar;

    /** 消息摘要（评论内容截断） */
    private String content;

    /** 0 未读 / 1 已读 */
    @TableField("is_read")
    private Integer isRead;

    @TableField("create_time")
    private LocalDateTime createTime;
}
