package com.ainav.controller;

import com.ainav.common.BaseResponse;
import com.ainav.common.ResultUtils;
import com.ainav.model.dto.UserLoginRequest;
import com.ainav.model.dto.UserRegisterRequest;
import com.ainav.model.vo.UserVO;
import com.ainav.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户接口（账号密码登录，Sa-Token SESSION 会话，无第三方 OAuth）。
 * 路径与前端 src/lib/api.ts 完全一致。
 */
@RestController
@RequestMapping("/user")
@Tag(name = "用户")
public class UserController {

    @Resource
    private UserService userService;

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public BaseResponse<Long> register(@RequestBody UserRegisterRequest req) {
        return ResultUtils.success(
                userService.register(req.getUserAccount(), req.getUserPassword(), req.getCheckPassword()));
    }

    @Operation(summary = "账号密码登录")
    @PostMapping("/login")
    public BaseResponse<UserVO> login(@RequestBody UserLoginRequest req) {
        return ResultUtils.success(userService.login(req.getUserAccount(), req.getUserPassword()));
    }

    @Operation(summary = "获取当前登录用户")
    @GetMapping("/get/login")
    public BaseResponse<UserVO> getLoginUser() {
        return ResultUtils.success(userService.getLoginUserVO());
    }

    @Operation(summary = "注销登录")
    @PostMapping("/logout")
    public BaseResponse<Boolean> logout() {
        return ResultUtils.success(userService.logout());
    }
}
