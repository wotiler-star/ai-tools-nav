package com.ainav.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BaseResponse;
import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.common.PageResult;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiPost;
import com.ainav.model.entity.User;
import com.ainav.service.AiPostService;
import com.ainav.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.Data;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai_post")
@Tag(name = "AI 社区")
public class AiPostController {

    @Resource
    private AiPostService aiPostService;

    @Resource
    private UserService userService;

    @Operation(summary = "社区帖子分页列表")
    @GetMapping("/list/page")
    public BaseResponse<PageResult<AiPost>> listPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "12") long pageSize) {
        return ResultUtils.success(aiPostService.listPostByPage(current, pageSize));
    }

    @Operation(summary = "社区帖子详情")
    @GetMapping("/get")
    public BaseResponse<AiPost> get(@RequestParam long id) {
        return ResultUtils.success(aiPostService.getById(id));
    }

    /** 发布帖子请求体 */
    @Data
    public static class AddPostReq {
        private String title;
        private String content;
        /** 可选：发布人昵称/头像（前端未传则用登录用户信息兜底） */
        private String authorName;
        private String authorAvatar;
    }

    @Operation(summary = "发布社区帖子（需登录）")
    @PostMapping("/add")
    public BaseResponse<Long> add(@RequestBody AddPostReq req) {
        // 拦截器已校验登录态，此处再双保险
        StpUtil.checkLogin();
        long userId = StpUtil.getLoginIdAsLong();

        User user = userService.getById(userId);
        AiPost post = new AiPost();
        post.setUserId(userId);
        post.setAuthorName(req.getAuthorName() != null && !req.getAuthorName().isBlank()
                ? req.getAuthorName()
                : (user != null ? user.getUserName() : "匿名用户"));
        post.setAuthorAvatar(req.getAuthorAvatar() != null && !req.getAuthorAvatar().isBlank()
                ? req.getAuthorAvatar()
                : (user != null ? user.getUserAvatar() : ""));
        post.setTitle(req.getTitle() == null ? "" : req.getTitle().trim());
        post.setContent(req.getContent() == null ? "" : req.getContent());
        post.setViewNum(0L);
        post.setLikeNum(0L);
        post.setCommentNum(0L);
        aiPostService.save(post);
        return ResultUtils.success(post.getId());
    }

    /** 编辑帖子请求体 */
    @Data
    public static class UpdatePostReq {
        private Long id;
        private String title;
        private String content;
    }

    @Operation(summary = "编辑社区帖子（作者本人或管理员）")
    @PostMapping("/update")
    public BaseResponse<Boolean> update(@RequestBody UpdatePostReq req) {
        if (req == null || req.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少帖子 id");
        }
        StpUtil.checkLogin();
        long userId = StpUtil.getLoginIdAsLong();
        AiPost post = aiPostService.getById(req.getId());
        if (post == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "帖子不存在");
        }
        boolean isAdmin = StpUtil.hasRole("admin");
        if (!isAdmin && (post.getUserId() == null || post.getUserId() != userId)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "只能编辑自己的帖子");
        }
        if (req.getTitle() != null) {
            post.setTitle(req.getTitle().trim());
        }
        if (req.getContent() != null) {
            post.setContent(req.getContent());
        }
        aiPostService.updateById(post);
        return ResultUtils.success(true);
    }

    @Operation(summary = "删除社区帖子（作者本人或管理员）")
    @PostMapping("/delete")
    public BaseResponse<Boolean> delete(@RequestParam long id) {
        StpUtil.checkLogin();
        long userId = StpUtil.getLoginIdAsLong();
        AiPost post = aiPostService.getById(id);
        if (post == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "帖子不存在");
        }
        boolean isAdmin = StpUtil.hasRole("admin");
        if (!isAdmin && (post.getUserId() == null || post.getUserId() != userId)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "只能删除自己的帖子");
        }
        aiPostService.removeById(id);
        return ResultUtils.success(true);
    }
}
