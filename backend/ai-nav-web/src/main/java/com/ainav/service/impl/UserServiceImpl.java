package com.ainav.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.mapper.UserMapper;
import com.ainav.model.entity.User;
import com.ainav.model.vo.UserVO;
import com.ainav.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    /** 加盐值，混淆密码 */
    private static final String SALT = "ai_nav";

    private String encrypt(String rawPassword) {
        return DigestUtils.md5DigestAsHex((SALT + rawPassword).getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Long register(String userAccount, String userPassword, String checkPassword) {
        if (userAccount == null || userPassword == null || checkPassword == null
                || userAccount.isBlank() || userPassword.isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        if (userAccount.length() < 4) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号长度不能小于 4 位");
        }
        if (userPassword.length() < 6) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "密码长度不能小于 6 位");
        }
        if (!userPassword.equals(checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "两次输入的密码不一致");
        }
        long count = lambdaQuery().eq(User::getUserAccount, userAccount).count();
        if (count > 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号已存在");
        }
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encrypt(userPassword));
        user.setUserName("用户" + System.currentTimeMillis() % 100000);
        user.setRole("user");
        boolean ok = save(user);
        if (!ok) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "注册失败");
        }
        return user.getId();
    }

    @Override
    public UserVO login(String userAccount, String userPassword) {
        if (userAccount == null || userPassword == null
                || userAccount.isBlank() || userPassword.isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号或密码为空");
        }
        User user = lambdaQuery()
                .eq(User::getUserAccount, userAccount)
                .eq(User::getUserPassword, encrypt(userPassword))
                .one();
        if (user == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号或密码错误");
        }
        // Sa-Token 登录，下发 SESSION Cookie
        StpUtil.login(user.getId());
        return toVO(user);
    }

    @Override
    public boolean logout() {
        StpUtil.logout();
        return true;
    }

    @Override
    public UserVO getLoginUserVO() {
        Object loginId = StpUtil.getLoginIdDefaultNull();
        if (loginId == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        User user = getById(Long.valueOf(loginId.toString()));
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        return toVO(user);
    }

    @Override
    public UserVO toVO(User user) {
        if (user == null) {
            return null;
        }
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        vo.setUserRole(user.getRole());
        return vo;
    }
}
