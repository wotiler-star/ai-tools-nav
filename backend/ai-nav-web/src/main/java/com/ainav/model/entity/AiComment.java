package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 通用评论（当前用于 AI 知识库文章；targetType 预留 post 等扩展）
 */
@Data
@TableName("ai_comment")
public class AiComment implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 评论目标类型：article（知识库文章）/ post（社区帖子） */
    @TableField("target_type")
    private String targetType;

    /** 评论目标 id */
    @TableField("target_id")
    private Long targetId;

    /** 评论用户 id */
    @TableField("user_id")
    private Long userId;

    /** 评论人昵称（冗余，避免频繁 join） */
    @TableField("user_name")
    private String userName;

    /** 评论人头像（冗余） */
    @TableField("user_avatar")
    private String userAvatar;

    /** 评论内容 */
    private String content;

    /** 父评论 id，0 表示顶级评论 */
    @TableField("parent_id")
    private Long parentId;

    @TableField("like_num")
    private Long likeNum;

    /** 状态：0 已删除 / 1 正常 */
    private Integer status;

    @TableField("create_time")
    private Date createTime;
}
