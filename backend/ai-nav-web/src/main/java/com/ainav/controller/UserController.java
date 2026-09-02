package com.ainav.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BaseResponse;
import com.ainav.common.ErrorCode;
import com.ainav.common.BusinessException;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.dto.UserFavoriteAddRequest;
import com.ainav.model.dto.UserLoginRequest;
import com.ainav.model.dto.UserRegisterRequest;
import com.ainav.model.dto.UserUpdatePasswordRequest;
import com.ainav.model.dto.UserUpdateRequest;
import com.ainav.model.entity.AiPost;
import com.ainav.model.entity.AiPrompt;
import com.ainav.model.entity.UserFavorite;
import com.ainav.model.vo.MemberVO;
import com.ainav.model.vo.UserVO;
import com.ainav.service.AiPostService;
import com.ainav.service.AiPromptService;
import com.ainav.service.UserFavoriteService;
import com.ainav.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @Resource
    private AiPostService aiPostService;

    @Resource
    private AiPromptService aiPromptService;

    @Resource
    private UserFavoriteService userFavoriteService;

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

    // ==================== 用户中心 ====================

    @Operation(summary = "更新个人资料")
    @PostMapping("/update")
    public BaseResponse<UserVO> update(@RequestBody UserUpdateRequest req) {
        return ResultUtils.success(userService.updateProfile(req));
    }

    @Operation(summary = "修改密码")
    @PostMapping("/update/password")
    public BaseResponse<Boolean> updatePassword(@RequestBody UserUpdatePasswordRequest req) {
        return ResultUtils.success(userService.updatePassword(req));
    }

    @Operation(summary = "会员中心信息")
    @GetMapping("/member")
    public BaseResponse<MemberVO> member() {
        return ResultUtils.success(userService.getMemberInfo());
    }

    @Operation(summary = "我的帖子")
    @GetMapping("/mypost")
    public BaseResponse<PageResult<AiPost>> myPost(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize) {
        return ResultUtils.success(aiPostService.listMyPosts(currentUserId(), current, pageSize));
    }

    @Operation(summary = "我的提示词")
    @GetMapping("/myprompt")
    public BaseResponse<PageResult<AiPrompt>> myPrompt(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long pageSize) {
        return ResultUtils.success(aiPromptService.listMyPrompts(currentUserId(), current, pageSize));
    }

    @Operation(summary = "我的收藏列表")
    @GetMapping("/favorite/list")
    public BaseResponse<List<UserFavorite>> favoriteList() {
        return ResultUtils.success(userFavoriteService.listMyFavorites(currentUserId()));
    }

    @Operation(summary = "新增收藏")
    @PostMapping("/favorite/add")
    public BaseResponse<Boolean> favoriteAdd(@RequestBody UserFavoriteAddRequest req) {
        return ResultUtils.success(userFavoriteService.addFavorite(currentUserId(), req));
    }

    @Operation(summary = "取消收藏")
    @DeleteMapping("/favorite/delete")
    public BaseResponse<Boolean> favoriteDelete(@RequestParam String targetType, @RequestParam long targetId) {
        return ResultUtils.success(userFavoriteService.removeFavorite(currentUserId(), targetType, targetId));
    }

    /** 当前登录用户 id */
    private Long currentUserId() {
        Object loginId = StpUtil.getLoginIdDefaultNull();
        if (loginId == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        return Long.valueOf(loginId.toString());
    }
}
