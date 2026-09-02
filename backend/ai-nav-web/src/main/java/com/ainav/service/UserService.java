package com.ainav.service;

import com.ainav.model.dto.UserUpdatePasswordRequest;
import com.ainav.model.dto.UserUpdateRequest;
import com.ainav.model.entity.User;
import com.ainav.model.vo.MemberVO;
import com.ainav.model.vo.UserVO;
import com.baomidou.mybatisplus.extension.service.IService;

public interface UserService extends IService<User> {

    /** 用户注册，返回新用户 id */
    Long register(String userAccount, String userPassword, String checkPassword);

    /** 账号密码登录，返回脱敏用户视图（Sa-Token 登录态由 StpUtil 维护） */
    UserVO login(String userAccount, String userPassword);

    /** 注销登录 */
    boolean logout();

    /** 获取当前登录用户（脱敏） */
    UserVO getLoginUserVO();

    /** 更新个人资料（昵称/头像/简介/邮箱/手机号） */
    UserVO updateProfile(UserUpdateRequest req);

    /** 修改密码 */
    boolean updatePassword(UserUpdatePasswordRequest req);

    /** 会员中心信息 */
    MemberVO getMemberInfo();

    /** 实体转脱敏 VO */
    UserVO toVO(User user);
}
