package com.ainav.config;

import cn.dev33.satoken.stp.StpInterface;
import com.ainav.model.entity.User;
import com.ainav.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Sa-Token 角色/权限数据源。
 * 缺此实现时 @SaCheckRole("admin") 无法解析角色，全部后台管理接口（工具/分类/专栏/文章）会鉴权失败。
 * 角色直接取自 user.role 字段（"admin" / "user"）。
 */
@Component
public class StpInterfaceImpl implements StpInterface {

    @Resource
    private UserService userService;

    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        return List.of();
    }

    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        try {
            User u = userService.getById(Long.valueOf(loginId.toString()));
            if (u != null && u.getRole() != null && !u.getRole().isBlank()) {
                return List.of(u.getRole());
            }
        } catch (Exception ignored) {
            // 解析失败视为无角色，安全降级
        }
        return List.of();
    }
}
