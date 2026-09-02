package com.ainav.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.mapper.UserMapper;
import com.ainav.model.dto.UserUpdatePasswordRequest;
import com.ainav.model.dto.UserUpdateRequest;
import com.ainav.model.entity.User;
import com.ainav.model.vo.MemberVO;
import com.ainav.model.vo.UserVO;
import com.ainav.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

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

    /** 当前登录用户 id，未登录抛 NOT_LOGIN */
    private Long currentUserId() {
        Object loginId = StpUtil.getLoginIdDefaultNull();
        if (loginId == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        return Long.valueOf(loginId.toString());
    }

    @Override
    public UserVO updateProfile(UserUpdateRequest req) {
        if (req == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        Long userId = currentUserId();
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        if (req.getUserName() != null) {
            user.setUserName(req.getUserName());
        }
        if (req.getUserAvatar() != null) {
            user.setUserAvatar(req.getUserAvatar());
        }
        if (req.getUserProfile() != null) {
            user.setUserProfile(req.getUserProfile());
        }
        if (req.getEmail() != null) {
            user.setEmail(req.getEmail());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone());
        }
        updateById(user);
        return toVO(getById(userId));
    }

    @Override
    public boolean updatePassword(UserUpdatePasswordRequest req) {
        if (req == null || req.getOldPassword() == null || req.getNewPassword() == null
                || req.getCheckPassword() == null || req.getOldPassword().isBlank()
                || req.getNewPassword().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        if (req.getNewPassword().length() < 6) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "新密码长度不能小于 6 位");
        }
        if (!req.getNewPassword().equals(req.getCheckPassword())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "两次输入的密码不一致");
        }
        Long userId = currentUserId();
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        if (!user.getUserPassword().equals(encrypt(req.getOldPassword()))) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "原密码错误");
        }
        user.setUserPassword(encrypt(req.getNewPassword()));
        updateById(user);
        return true;
    }

    @Override
    public MemberVO getMemberInfo() {
        Long userId = currentUserId();
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        Integer vipType = user.getVipType() == null ? 0 : user.getVipType();
        LocalDateTime expire = user.getVipExpireTime();
        MemberVO vo = new MemberVO();
        vo.setPoints(user.getPoints() == null ? 0L : user.getPoints());
        vo.setLevel(user.getLevel() == null ? 1 : user.getLevel());
        vo.setVipType(vipType);
        vo.setVipTypeName(vipTypeName(vipType));
        vo.setVipExpireTime(expire);
        vo.setIsVip(vipType > 0 && (expire == null || expire.isAfter(LocalDateTime.now())));
        vo.setBenefits(buildBenefits(vipType));
        return vo;
    }

    private String vipTypeName(Integer vipType) {
        return switch (vipType) {
            case 1 -> "月度会员";
            case 2 -> "年度会员";
            case 3 -> "永久会员";
            default -> "普通用户";
        };
    }

    private List<String> buildBenefits(Integer vipType) {
        if (vipType == null || vipType == 0) {
            return List.of("全站 AI 工具免费检索", "社区发帖与评论", "提示词模板免费复制");
        }
        return List.of("会员专属身份标识", "全站课程 8 折优惠", "专属客服优先响应",
                "社区发帖置顶特权", "提示词模板无限量下载");
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
