package com.ainav.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.ainav.common.BaseResponse;
import com.ainav.common.BusinessException;
import com.ainav.common.ErrorCode;
import com.ainav.common.ResultUtils;
import com.ainav.model.entity.AiComment;
import com.ainav.model.entity.User;
import com.ainav.service.AiCommentService;
import com.ainav.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.Data;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/ai_comment")
@Tag(name = "评论")
public class AiCommentController {

    @Resource
    private AiCommentService aiCommentService;

    @Resource
    private UserService userService;

    /** 发评论请求体 */
    @Data
    public static class AddCommentReq {
        /** 目标类型：article / post */
        private String targetType;
        private Long targetId;
        private String content;
        /** 回复某条评论时传其 id，顶级评论传 0 或不传 */
        private Long parentId;
    }

    @Operation(summary = "评论列表（公开）")
    @GetMapping("/list")
    public BaseResponse<List<AiComment>> list(
            @RequestParam(defaultValue = "article") String targetType,
            @RequestParam Long targetId) {
        if (targetId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少目标 id");
        }
        return ResultUtils.success(aiCommentService.listByTarget(targetType, targetId));
    }

    @Operation(summary = "发布评论（需登录）")
    @PostMapping("/add")
    public BaseResponse<Long> add(@RequestBody AddCommentReq req) {
        StpUtil.checkLogin();
        if (req == null || req.getTargetId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "缺少目标 id");
        }
        if (req.getContent() == null || req.getContent().isBlank()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评论内容不能为空");
        }
        long userId = StpUtil.getLoginIdAsLong();
        User user = userService.getById(userId);

        AiComment c = new AiComment();
        c.setUserId(userId);
        c.setUserName(user != null ? user.getUserName() : "匿名用户");
        c.setUserAvatar(user != null ? user.getUserAvatar() : "");
        c.setTargetType(req.getTargetType() == null || req.getTargetType().isBlank()
                ? "article" : req.getTargetType());
        c.setTargetId(req.getTargetId());
        c.setContent(req.getContent().trim());
        c.setParentId(req.getParentId() == null ? 0L : req.getParentId());
        c.setLikeNum(0L);
        c.setStatus(1);
        aiCommentService.save(c);
        return ResultUtils.success(c.getId());
    }

    @Operation(summary = "删除评论（本人或管理员）")
    @DeleteMapping("/delete/{id}")
    public BaseResponse<Boolean> delete(@PathVariable long id) {
        StpUtil.checkLogin();
        AiComment c = aiCommentService.getById(id);
        if (c == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "评论不存在");
        }
        long userId = StpUtil.getLoginIdAsLong();
        User user = userService.getById(userId);
        boolean isAdmin = user != null && "admin".equals(user.getRole());
        if (!isAdmin && !Objects.equals(c.getUserId(), userId)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "只能删除自己的评论");
        }
        return ResultUtils.success(aiCommentService.removeById(id));
    }
}
