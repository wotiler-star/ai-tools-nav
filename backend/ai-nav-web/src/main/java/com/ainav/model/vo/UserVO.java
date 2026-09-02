package com.ainav.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/** 用户脱敏视图（不含密码，对齐前端 UserVO） */
@Data
public class UserVO implements Serializable {

    private Long id;

    private String userName;

    private String userAvatar;

    /** user / admin */
    private String userRole;

    private String userProfile;

    private String email;

    private String phone;

    /** 积分 */
    private Long points;

    /** 成长等级 */
    private Integer level;

    /** 会员类型：0 普通 / 1 月度 / 2 年度 / 3 永久 */
    private Integer vipType;

    /** 会员过期时间 */
    private LocalDateTime vipExpireTime;

    private LocalDateTime createTime;
}
