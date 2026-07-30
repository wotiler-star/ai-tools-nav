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

    private LocalDateTime createTime;
}
