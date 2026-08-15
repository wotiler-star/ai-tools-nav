package com.ainav.config;

import cn.dev33.satoken.stp.StpInterface;
import com.ainav.mapper.UserMapper;
import com.ainav.model.entity.User;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Sa-Token 角色 / 权限加载器。
 *
 * <p>必须实现 {@link StpInterface}，否则 {@code @SaCheckRole("admin")} 无法解析当前登录用户的角色，
 * 会导致所有后台管理接口（AdminController）即便管理员已登录也被拒绝。之前后端缺失该实现，
 * 属于真实 bug。角色直接从 user 表的 role 字段读取（user / admin）。
 */
@Component
public class SaTokenPermissionImpl implements StpInterface {

    @Resource
    private UserMapper userMapper;

    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        // 当前业务仅依赖角色鉴权，权限集合留空
        return Collections.emptyList();
    }

    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        List<String> roles = new ArrayList<>();
        if (loginId == null) {
            return roles;
        }
        try {
            User user = userMapper.selectById(Long.valueOf(loginId.toString()));
            if (user != null && user.getRole() != null && !user.getRole().isBlank()) {
                roles.add(user.getRole());
            }
        } catch (Exception ignored) {
            // 角色解析失败时返回空集合（即无权限），不阻断登录态本身
        }
        return roles;
    }
}
