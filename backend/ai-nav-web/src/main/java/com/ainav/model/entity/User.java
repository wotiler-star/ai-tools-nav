package com.ainav.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户（手机号/微信/短信多方式登录，无 GitHub OAuth）
 */
@Data
@TableName("user")
public class User implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 登录账号 */
    @TableField("user_account")
    private String userAccount;

    /** 登录密码（加盐 MD5 存储） */
    @TableField("user_password")
    private String userPassword;

    @TableField("user_name")
    private String userName;

    @TableField("user_avatar")
    private String userAvatar;

    @TableField("user_profile")
    private String userProfile;

    private String phone;

    private String email;

    /** 角色：user / admin */
    private String role;

    /** 积分（经验值），用于成长等级与会员权益 */
    @TableField("points")
    private Long points;

    /** 成长等级（1 起） */
    @TableField("level")
    private Integer level;

    /** 会员类型：0 普通用户 / 1 月度会员 / 2 年度会员 / 3 永久会员 */
    @TableField("vip_type")
    private Integer vipType;

    /** 会员过期时间（NULL 表示未开通） */
    @TableField("vip_expire_time")
    private LocalDateTime vipExpireTime;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;
}
