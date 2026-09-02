package com.ainav.model.dto;

import lombok.Data;

import java.io.Serializable;

/** 用户资料更新请求（昵称 / 头像 / 简介 / 邮箱 / 手机号） */
@Data
public class UserUpdateRequest implements Serializable {

    private String userName;

    private String userAvatar;

    private String userProfile;

    private String email;

    private String phone;
}
