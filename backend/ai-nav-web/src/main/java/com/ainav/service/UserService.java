package com.ainav.service;

import com.ainav.model.entity.User;
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

    /** 实体转脱敏 VO */
    UserVO toVO(User user);
}
