package com.ainav.model.dto;

import lombok.Data;

import java.io.Serializable;

/** 用户登录请求（账号密码，对齐前端 /user/login） */
@Data
public class UserLoginRequest implements Serializable {

    private String userAccount;

    private String userPassword;
}
