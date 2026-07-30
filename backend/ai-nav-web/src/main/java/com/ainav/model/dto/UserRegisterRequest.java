package com.ainav.model.dto;

import lombok.Data;

import java.io.Serializable;

/** 用户注册请求（对齐前端 /user/register） */
@Data
public class UserRegisterRequest implements Serializable {

    private String userAccount;

    private String userPassword;

    private String checkPassword;
}
