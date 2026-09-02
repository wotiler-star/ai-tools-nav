package com.ainav.model.dto;

import lombok.Data;

import java.io.Serializable;

/** 修改密码请求 */
@Data
public class UserUpdatePasswordRequest implements Serializable {

    private String oldPassword;

    private String newPassword;

    private String checkPassword;
}
